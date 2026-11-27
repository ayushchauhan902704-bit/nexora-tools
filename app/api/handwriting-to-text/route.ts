import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "Gemini API key is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

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
          error: "No transcription prompt was provided.",
        },
        { status: 400 }
      );
    }

    if (!image.startsWith("data:image/")) {
      return NextResponse.json(
        {
          error: "Invalid image format.",
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

    const mimeType = image
      .slice(5, commaIndex)
      .split(";")[0];

    const base64Data = image.slice(commaIndex + 1);

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        {
          error: "Only JPG, PNG and WebP images are supported.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
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
                  text: prompt,
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
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "The Gemini API could not process the image.",
        },
        { status: response.status }
      );
    }

    const result =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: any) => part?.text || "")
        .join("")
        .trim() || "";

    if (!result) {
      return NextResponse.json(
        {
          error: "Gemini returned an empty transcription.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      text: result,
    });
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
