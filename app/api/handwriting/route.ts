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

    const prompt = `Read this handwritten image carefully and transcribe EXACTLY.
    Rules: Keep same line breaks as in image. Keep Hinglish as written. Fix spelling from context. Output ONLY clean text, no explanation.`;

    // Naya model - ye zyada stable hai
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: mime, data: base64 } }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 4000 }
      })
    });

    const data = await res.json();
    console.log("GEMINI ERROR:", JSON.stringify(data).slice(0, 1000));
    
    if (data.error) {
      return NextResponse.json({ text: "ERROR: " + data.error.message });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "ERROR: AI ne kuch nahi diya, dobara try karo";
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ text: "ERROR: " + e.message });
  }
}
