import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MAX_IMAGE_BASE64_LENGTH = 15 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Gemini API is not configured. Please check the GEMINI_API_KEY environment variable.",
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
    const prompt = body?.prompt;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        {
          error: "No handwriting image was provided.",
        },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          error: "No transcription instructions were provided.",
        },
        { status: 400 }
      );
    }

    if (image.length > MAX_IMAGE_BASE64_LENGTH) {
      return NextResponse.json(
        {
          error:
            "The image is too large to process. Please use a smaller image.",
        },
        { status: 413 }
      );
    }

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

    const mimeMatch = header.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64$/);

    if (!mimeMatch) {
      return NextResponse.json(
        {
          error: "Invalid image encoding.",
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
          error: "The uploaded image appears to be empty or invalid.",
        },
        { status: 400 }
      );
    }

    const cleanPrompt = `
You are a high-quality multilingual handwriting transcription system.

Transcribe the handwritten content in the supplied image into editable text.

IMPORTANT:
- This is TRANSCRIPTION, not translation.
- Preserve the original language.
- Preserve the original script.
- Preserve English as English.
- Preserve Hindi/Devanagari as Hindi/Devanagari.
- Preserve Hinglish exactly as written.
- Preserve Hindi + English mixed writing.
- Do not translate anything.
- Do not rewrite anything.
- Do not improve grammar.
- Do not correct spelling.
- Do not summarize.
- Do not add information.
- Do not invent missing words.

Preserve whenever readable:
- names
- numbers
- dates
- punctuation
- symbols
- headings
- paragraphs
- line breaks
- numbered lists
- bullet-style lists
- tables and their reading order

If a very small part is genuinely impossible to read, use [unclear] rather than guessing.

Read the ENTIRE image carefully from top to bottom and left to right.

Return ONLY the transcription.

${cleanPrompt}
`;

    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

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
                  text: cleanPrompt,
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
            temperature: 0,
            topP: 0.1,
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
              "The handwriting request timed out. Please try the image again.",
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
            "The handwriting service returned an invalid response. Please try again.",
        },
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.error("Gemini API error:", {
        status: response.status,
        data,
      });

      const apiMessage =
        data?.error?.message ||
        data?.error?.status ||
        "The Gemini API could not process this image.";

      if (response.status === 400) {
        return NextResponse.json(
          {
            error:
              "Gemini rejected the image request. Please try a clear JPG, PNG or WebP image.",
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

      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "The handwriting service is temporarily busy. Please wait a moment and try again.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: apiMessage,
        },
        { status: response.status }
      );
    }

    const candidates = data?.candidates;

    if (!Array.isArray(candidates) || candidates.length === 0) {
      console.error("Gemini returned no candidates:", data);

      return NextResponse.json(
        {
          error:
            "Gemini could not generate a transcription from this image. Please try a clearer image.",
        },
        { status: 502 }
      );
    }

    const candidate = candidates[0];

    if (candidate?.finishReason === "SAFETY") {
      return NextResponse.json(
        {
          error:
            "The image could not be processed by the AI service.",
        },
        { status: 422 }
      );
    }

    const parts = candidate?.content?.parts;

    if (!Array.isArray(parts)) {
      console.error("Gemini returned an unexpected response:", data);

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
        if (typeof part?.text === "string") {
          return part.text;
        }

        return "";
      })
      .join("")
      .trim();

    if (!result) {
      return NextResponse.json(
        {
          error:
            "No readable handwriting was detected. Please use a sharper, well-lit image.",
        },
        { status: 422 }
      );
    }

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
    console.error("Handwriting API unexpected error:", error);

    return NextResponse.json(
      {
        error:
          "The handwriting could not be processed. Please try again.",
      },
      { status: 500 }
    );
  }
}
