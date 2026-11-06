import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: "No image" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ text: "ERROR: API Key Vercel me nahi mili. Redeploy karo." });
    }

    const base64 = image.split(",")[1];
    const mime = image.split(";")[0].split(":")[1] || "image/jpeg";

    const prompt = `You are the best handwriting OCR expert. Read this handwritten page carefully.
    Rules:
    1. Transcribe EXACTLY what is written, don't add extra.
    2. Keep line breaks PROPER - jesi line handwritten me hai, wesi hi line me likho.
    3. If a word is unclear, guess the most logical word from context.
    4. Fix spelling but keep Hinglish as written (Hindi in English).
    5. Output ONLY clean typed text, no explanation, no markdown, no extra notes.
    6. Headings ko alag line me rakho.`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: mime, data: base64 } }
          ]
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 4000 }
      })
    });

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ text: "ERROR: " + data.error.message });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "ERROR: AI ne kuch nahi diya, dobara try karo";
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ text: "ERROR: " + e.message });
  }
}
