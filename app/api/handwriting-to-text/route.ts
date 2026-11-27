import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MAX_IMAGE_BASE64_LENGTH = 9 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const PROMPT = `
You are a multilingual handwriting recognition and document transcription system.

TRANSCRIBE the entire handwritten image into editable text.

LANGUAGE RULES:
- English must remain English.
- Hindi written in Devanagari must remain Hindi/Devanagari.
- Hinglish must remain Hinglish.
- Hindi + English mixed writing must remain mixed.
- Preserve all other recognizable languages and scripts.
- Never translate.
- Never convert Hindi to English.
- Never convert English to Hindi.
- Never convert Hinglish to Hindi or English.

ACCURACY RULES:
- Read the ENTIRE image.
- Inspect every visible line.
- Preserve the original wording.
- Do not correct spelling.
- Do not correct grammar.
- Do not rewrite.
- Do not summarize.
- Do not explain.
- Do not add information.
- Do not invent words.
- Preserve names.
- Preserve numbers.
- Preserve dates.
- Preserve punctuation.
- Preserve symbols.
- Preserve abbreviations.
- Preserve repeated words.

STRUCTURE:
- Preserve meaningful line breaks.
- Preserve paragraphs.
- Preserve headings.
- Preserve numbered lists.
- Preserve bullet-style lists.
- Preserve original reading order.
- Preserve tables as closely as possible using text.
- Do not merge everything into one paragraph.

If a small part is genuinely impossible to read, write [unclear].
Do not guess.

This is transcription, NOT translation.
This is transcription, NOT proofreading.
This is transcription, NOT rewriting.

Return ONLY the transcription.
`;

async function callGemini(
  model: string,
  mimeType: string,
  base64Data: string
) {
  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 60000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: PROMPT,
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 8192,
        },
      }),
      signal: controller.signal,
    });

    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error: any) {
    if (error?.name === "AbortError") {
      return {
        ok: false,
        status: 504,
        data: {
          error: {
            message: "Gemini request timed out.",
          },
        },
      };
    }

    return {
      ok: false,
      status: 502,
      data: {
        error: {
          message: "Could not connect to Gemini.",
        },
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

function extractText(data: any): string {
  const parts = data?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part: any) =>
      typeof part?.text === "string" ? part.text : ""
    )
    .join("")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is not configured on the server.",
        },
        { status: 500 }
      );
    }

    let body: any;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request data.",
        },
        { status: 400 }
      );
    }

    const image = body?.image;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        {
          error: "No handwriting image was provided.",
        },
        { status: 400 }
      );
    }

    if (image.length > MAX_IMAGE_BASE64_LENGTH) {
      return NextResponse.json(
        {
          error:
            "The image is too large. Please use a smaller image.",
        },
        { status: 413 }
      );
    }

    const commaIndex = image.indexOf(",");

    if (commaIndex === -1) {
      return NextResponse.json(
        {
          error: "Invalid image data.",
        },
        { status: 400 }
      );
    }

    const header = image.slice(0, commaIndex);
    const base64Data = image.slice(commaIndex + 1);

    const mimeMatch = header.match(
      /^data:(image\/[a-zA-Z0-9.+-]+);base64$/
    );

    if (!mimeMatch) {
      return NextResponse.json(
        {
          error: "Invalid image format.",
        },
        { status: 400 }
      );
    }

    const mimeType = mimeMatch[1].toLowerCase();

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        {
          error:
            "Unsupported image format. Please use JPG, PNG or WebP.",
        },
        { status: 400 }
      );
    }

    if (!base64Data || base64Data.length < 100) {
      return NextResponse.json(
        {
          error: "The image appears to be empty or invalid.",
        },
        { status: 400 }
      );
    }

    /*
     * Try the newest lightweight model first.
     * If it is unavailable or temporarily unavailable,
     * try the 3.1 Flash-Lite model.
     */
    const models = [
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
    ];

    let lastError = "Gemini could not process the image.";

    for (const model of models) {
      const result = await callGemini(
        model,
        mimeType,
        base64Data
      );

      if (result.ok) {
        const text = extractText(result.data);

        if (text) {
          return NextResponse.json(
            {
              text,
              model,
            },
            {
              status: 200,
              headers: {
                "Cache-Control": "no-store",
              },
            }
          );
        }

        lastError =
          "Gemini returned an empty transcription.";
        continue;
      }

      const apiMessage =
        result.data?.error?.message ||
        "Unknown Gemini API error.";

      lastError = `${model}: ${apiMessage}`;

      console.error("Gemini model failed:", {
        model,
        status: result.status,
        error: result.data,
      });

      /*
       * Continue to the fallback model for model-access,
       * temporary server, and rate-limit errors.
       */
      if (
        result.status === 404 ||
        result.status === 429 ||
        result.status >= 500
      ) {
        continue;
      }

      /*
       * Authentication/permission errors are unlikely
       * to be fixed by changing models.
       */
      if (
        result.status === 401 ||
        result.status === 403
      ) {
        return NextResponse.json(
          {
            error:
              "Gemini API authentication or permission failed.",
            details: apiMessage,
          },
          { status: 500 }
        );
      }

      /*
       * Invalid image/request.
       */
      if (result.status === 400) {
        return NextResponse.json(
          {
            error:
              "Gemini rejected the image request.",
            details: apiMessage,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "The handwriting service could not process this image.",
        details: lastError,
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("Handwriting API error:", error);

    return NextResponse.json(
      {
        error:
          "The handwriting could not be processed. Please try again.",
      },
      { status: 500 }
    );
  }
}
