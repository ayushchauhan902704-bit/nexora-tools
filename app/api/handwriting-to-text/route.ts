import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Gemini inline image input should stay within a reasonable request size.
const MAX_IMAGE_BASE64_LENGTH = 9 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const TRANSCRIPTION_PROMPT = `
You are a multilingual handwriting recognition and document transcription system.

Your task is to TRANSCRIBE the uploaded handwritten document into editable digital text.

The handwritten content can be in ANY language or combination of languages that you can recognize.

LANGUAGE AND SCRIPT RULES:

1. English handwriting must remain English.
2. Hindi handwriting written in Devanagari must remain Hindi / Devanagari.
3. Hinglish written using Latin letters must remain Hinglish.
4. Hindi + English mixed handwriting must remain mixed Hindi + English.
5. Do not translate any language into another language.
6. Do not convert Hindi into English.
7. Do not convert English into Hindi.
8. Do not convert Hinglish into Hindi.
9. Do not convert Hinglish into English.
10. Preserve other recognizable languages and scripts in their original form.
11. Preserve Unicode characters when applicable.

TRANSCRIPTION RULES:

- Transcribe what is actually visible.
- Preserve the original wording.
- Do not correct spelling.
- Do not correct grammar.
- Do not rewrite sentences.
- Do not improve the writing.
- Do not summarize.
- Do not explain the content.
- Do not add information.
- Do not invent missing words.
- Preserve names exactly as visible.
- Preserve places exactly as visible.
- Preserve numbers exactly as visible.
- Preserve dates exactly as visible.
- Preserve mathematical symbols when recognizable.
- Preserve punctuation.
- Preserve repeated words.
- Preserve informal language and slang.
- Preserve abbreviations.

STRUCTURE RULES:

- Read the ENTIRE image carefully.
- Preserve meaningful line breaks.
- Preserve paragraphs.
- Preserve headings.
- Preserve numbered lists.
- Preserve bullet-style lists when clearly visible.
- Preserve the original reading order.
- If a table is visible, preserve rows and columns as closely as possible using text.
- Do not merge the entire page into one paragraph.
- Do not create Markdown unless the original document clearly represents a list or heading.
- Do not add a title if the handwritten document does not contain one.

IMPORTANT FOR HANDWRITING:

- Pay close attention to small handwritten text.
- Inspect every visible line before producing the answer.
- Do not stop after reading only the easiest or largest text.
- Use the surrounding handwriting only to understand letter shapes, not to invent words.
- If a word is genuinely unreadable, use [unclear].
- Do not replace unclear handwriting with a likely word.

This is TRANSCRIPTION, NOT translation.
This is TRANSCRIPTION, NOT proofreading.
This is TRANSCRIPTION, NOT rewriting.

Return ONLY the transcription.
Do not describe the image.
Do not explain your answer.
Do not add introductory text.
`;

export async function POST(request: NextRequest) {
  try {
    // --------------------------------------------------
    // 1. Check API key
    // --------------------------------------------------

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Gemini API is not configured. Please check the GEMINI_API_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // 2. Read request
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 3. Validate image size
    // --------------------------------------------------

    if (image.length > MAX_IMAGE_BASE64_LENGTH) {
      return NextResponse.json(
        {
          error:
            "The image is too large to process. Please use a smaller image.",
        },
        { status: 413 }
      );
    }

    // --------------------------------------------------
    // 4. Validate data URL
    // --------------------------------------------------

    if (!image.startsWith("data:image/")) {
      return NextResponse.json(
        {
          error: "Invalid image data.",
        },
        { status: 400 }
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
          error: "Invalid image encoding.",
        },
        { status: 400 }
      );
    }

    const mimeType = mimeMatch[1].toLowerCase();

    // --------------------------------------------------
    // 5. Validate MIME type
    // --------------------------------------------------

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
          error:
            "The uploaded image appears to be empty or invalid.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 6. Gemini endpoint
    // --------------------------------------------------

    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";

    // --------------------------------------------------
    // 7. Timeout
    // --------------------------------------------------

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 60000);

    let response: Response;

    try {
      response = await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },

        body: JSON.stringify({
          contents: [
            {
              role: "user",

              parts: [
                {
                  text: TRANSCRIPTION_PROMPT,
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

          // Do not send custom temperature/topP values here.
          // This keeps the request compatible with Gemini 3.5 Flash-Lite.
          generationConfig: {
            maxOutputTokens: 8192,
          },
        }),

        signal: controller.signal,
      });
    } catch (error: any) {
      clearTimeout(timeout);

      if (error?.name === "AbortError") {
        return NextResponse.json(
          {
            error:
              "The handwriting request timed out. Please try again.",
          },
          { status: 504 }
        );
      }

      console.error("Gemini connection error:", error);

      return NextResponse.json(
        {
          error:
            "Could not connect to the handwriting recognition service. Please try again.",
        },
        { status: 502 }
      );
    }

    clearTimeout(timeout);

    // --------------------------------------------------
    // 8. Read Gemini response
    // --------------------------------------------------

    let data: any;

    try {
      data = await response.json();
    } catch {
      console.error(
        "Gemini returned a non-JSON response:",
        response.status
      );

      return NextResponse.json(
        {
          error:
            "The handwriting service returned an invalid response.",
        },
        { status: 502 }
      );
    }

    // --------------------------------------------------
    // 9. Handle Gemini API errors
    // --------------------------------------------------

    if (!response.ok) {
      console.error("Gemini API error:", {
        status: response.status,
        data,
      });

      const apiMessage =
        data?.error?.message ||
        "The Gemini API could not process this image.";

      if (response.status === 400) {
        return NextResponse.json(
          {
            error:
              "Gemini rejected the image request. Please try a clear JPG, PNG or WebP image.",
            details: apiMessage,
          },
          { status: 400 }
        );
      }

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            error:
              "Gemini API authentication failed. Please check the GEMINI_API_KEY configuration.",
          },
          { status: 500 }
        );
      }

      if (response.status === 404) {
        return NextResponse.json(
          {
            error:
              "The selected Gemini model is unavailable for this API key or project.",
            details: apiMessage,
          },
          { status: 502 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "The handwriting service is temporarily busy. Please wait a moment and try again.",
          },
          { status: 429 }
        );
      }

      if (response.status >= 500) {
        return NextResponse.json(
          {
            error:
              "The handwriting service is temporarily unavailable. Please try again.",
          },
          { status: 502 }
        );
      }

      return NextResponse.json(
        {
          error: apiMessage,
        },
        { status: response.status }
      );
    }

    // --------------------------------------------------
    // 10. Extract candidates
    // --------------------------------------------------

    const candidates = data?.candidates;

    if (!Array.isArray(candidates) || candidates.length === 0) {
      console.error(
        "Gemini returned no candidates:",
        data
      );

      return NextResponse.json(
        {
          error:
            "Gemini could not generate a transcription from this image.",
        },
        { status: 422 }
      );
    }

    const candidate = candidates[0];

    // --------------------------------------------------
    // 11. Handle blocked response
    // --------------------------------------------------

    if (
      candidate?.finishReason === "SAFETY" ||
      candidate?.finishReason === "BLOCKLIST"
    ) {
      return NextResponse.json(
        {
          error:
            "The image could not be processed by the AI service.",
        },
        { status: 422 }
      );
    }

    // --------------------------------------------------
    // 12. Extract text
    // --------------------------------------------------

    const parts = candidate?.content?.parts;

    if (!Array.isArray(parts)) {
      console.error(
        "Gemini returned an unexpected response:",
        data
      );

      return NextResponse.json(
        {
          error:
            "The handwriting service returned an unexpected response.",
        },
        { status: 502 }
      );
    }

    const result = parts
      .map((part: any) => {
        return typeof part?.text === "string"
          ? part.text
          : "";
      })
      .join("")
      .trim();

    // --------------------------------------------------
    // 13. Empty result
    // --------------------------------------------------

    if (!result) {
      return NextResponse.json(
        {
          error:
            "No readable handwriting was detected. Please try the image again.",
        },
        { status: 422 }
      );
    }

    // --------------------------------------------------
    // 14. Success
    // --------------------------------------------------

    return NextResponse.json(
      {
        text: result,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Handwriting API unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "The handwriting could not be processed. Please try again.",
      },
      { status: 500 }
    );
  }
}
