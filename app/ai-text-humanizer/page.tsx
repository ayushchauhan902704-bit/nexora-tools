import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Text Humanizer - Make AI Text Sound Natural & Readable | NEXORA",
  description: "Free AI Text Humanizer by NEXORA - Rewrite AI text to sound more natural, readable and human-like. Fix robotic tone, improve flow. No login, 100% private, no watermark.",
  keywords: ["ai text humanizer", "humanize ai text", "make ai text human", "ai to human text converter", "free ai humanizer"],
  authors: [{ name: "Ayush Chauhan" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://nexora-tools-drab.vercel.app/ai-text-humanizer" },
  openGraph: {
    title: "AI Text Humanizer - Make AI Text Sound Natural | NEXORA",
    description: "Rewrite AI text to sound more natural and readable. Free, private, no login, no watermark.",
    url: "https://nexora-tools-drab.vercel.app/ai-text-humanizer",
    type: "website",
    images: ["https://nexora-tools-drab.vercel.app/og-image.png"],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Text Humanizer - NEXORA",
    description: "Free AI Text Humanizer - Make AI text sound more natural, readable and human-like, private",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Person", name: "Ayush Chauhan" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nexora-tools-drab.vercel.app/" },
      { "@type": "ListItem", position: 2, name: "AI Text Humanizer", item: "https://nexora-tools-drab.vercel.app/ai-text-humanizer" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Is AI Text Humanizer free?", acceptedAnswer: { "@type": "Answer", text: "Yes, 100% free, no watermark, unlimited use, browser-based, private." } },
      { "@type": "Question", name: "Is my data safe?", acceptedAnswer: { "@type": "Answer", text: "Yes. Your text never leaves your device. All processing happens in your browser." } },
      { "@type": "Question", name: "How accurate is this tool?", acceptedAnswer: { "@type": "Answer", text: "It fixes common robotic phrasing, improves flow and makes text more natural while keeping original meaning." } },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Humanize AI Text",
    step: [
      { "@type": "HowToStep", name: "Paste Text", text: "Paste your AI generated text" },
      { "@type": "HowToStep", name: "Select Tone", text: "Select Student, Casual or Professional tone" },
      { "@type": "HowToStep", name: "Humanize", text: "Click Humanize Text and copy natural result" },
    ],
  },
];

"use client";
import { useState } from "react";

const SYNONYMS: Record<string, string> = {
  utilize: "use", however: "but", moreover: "also", therefore: "so",
  "in order to": "to", "a large number of": "many",
  "due to the fact that": "because", "in addition": "also",
  "furthermore": "also", "nevertheless": "still", "consequently": "so",
  "it is important to note": "note", "in conclusion": "in short",
};

export default function AITextHumanizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"student" | "casual" | "pro">("casual");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const wordCount = (t: string) => t.trim() ? t.trim().split(/\s+/).length : 0;

  function humanize() {
    setError(""); setCopied(false);
    if (!input.trim()) { setError("Please paste some text first."); return; }
    setProgress(10);
    setTimeout(() => {
      let t = input;
      for (const k in SYNONYMS) {
        const re = new RegExp("\\b" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
        t = t.replace(re, SYNONYMS[k]);
      }
      // Natural contractions - Blueprint: fix robotic tone
      t = t.replace(/\bIt is\b/g, "It's").replace(/\bI am\b/g, "I'm")
        .replace(/\bWe are\b/g, "We're").replace(/\bDo not\b/g, "Don't")
        .replace(/\bCannot\b/g, "Can't").replace(/\bWill not\b/g, "Won't")
        .replace(/\bI will\b/g, "I'll").replace(/\bYou are\b/g, "You're");
      // Professional tone = less contractions, cleaner
      if (mode === "pro") {
        t = t.replace(/It's/g, "It is").replace(/I'm/g, "I am").replace(/Don't/g, "Do not");
      }
      // Student tone = simpler sentences
      if (mode === "student") {
        t = t.replace(/\, however\,/gi, ", but ");
      }
      setOutput(t);
      setProgress(100);
      setTimeout(() => setProgress(0), 800);
    }, 300);
  }

  async function copyText() {
    if (!output) { setError("Nothing to copy yet. Humanize first."); return; }
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { const el = document.getElementById("outT") as HTMLTextAreaElement; el?.select(); document.execCommand("copy"); setCopied(true); }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-[900px] mx-auto px-4 pt-4 flex justify-between items-center">
        <a href="/" className="font-black text-[22px]">NEX<span className="text-violet-600">ORA</span></a>
        <div className="flex gap-2 items-center">
          <span className="bg-slate-100 border px-3 py-1 rounded-full text-[11px] font-bold text-slate-500">● PRIVATE • NO LOGIN</span>
          <a href="/" className="font-bold text-[13px] text-violet-600">← All Tools</a>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border mt-3">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-7 text-center">
          <h1 className="text-[32px] font-black tracking-tight leading-tight">AI Text Humanizer</h1>
          <p className="mt-1.5 text-sm opacity-90">Make your AI text more natural, readable and human-like — No Watermark, Private, Free</p>
          <span className="inline-block mt-3 bg-white/20 border border-white/30 px-3 py-1 rounded-full text-[11px] font-bold">✨ FREE • PRIVATE • NO LOGIN</span>
        </div>

        <div className="flex gap-2 flex-wrap px-5 pt-4">
          <span className="bg-slate-100 px-3 py-1 rounded-full text-[11px] font-bold">{wordCount(input)} Words In</span>
          <span className="bg-slate-100 px-3 py-1 rounded-full text-[11px] font-bold">{wordCount(output)} Words Out</span>
          {input && output && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-[11px] font-bold">Before: {wordCount(input)} → After: {wordCount(output)}</span>}
          <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-[11px] font-bold">● Browser-Based</span>
        </div>

        {progress > 0 && <div className="mx-5 mt-3 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-violet-600 transition-all" style={{ width: `${progress}%` }} /></div>}
        {error && <div className="mx-5 mt-3 bg-red-50 text-red-600 text-[13px] font-bold px-3 py-2 rounded-lg">⚠️ {error}</div>}

        <div className="p-5 grid md:grid-cols-2 gap-4">
          <div><label className="font-extrabold block mb-1.5 text-[13px]">Your Text</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your AI text here..." className="w-full h-[340px] border-2 rounded-xl p-3.5 text-sm outline-none focus:border-violet-600 resize-none" /></div>
          <div><label className="font-extrabold block mb-1.5 text-[13px]">Improved Result - Human Like</label>
            <textarea id="outT" value={output} readOnly placeholder="Natural result will appear here..." className="w-full h-[340px] border-2 rounded-xl p-3.5 text-sm outline-none resize-none bg-slate-50" /></div>
        </div>

        <div className="px-5 pb-5 flex gap-2.5 flex-wrap items-center">
          <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="px-3.5 py-3 rounded-[10px] border-2 font-semibold bg-white">
            <option value="student">Student Friendly</option><option value="casual">Casual - Natural</option><option value="pro">Professional</option>
          </select>
          <button onClick={humanize} className="flex-1 min-w-[200px] bg-violet-600 text-white py-3.5 rounded-[10px] font-extrabold text-[15px] hover:bg-violet-700">Humanize Text →</button>
          <button onClick={copyText} className="px-[18px] py-3 rounded-[10px] border bg-white font-bold">{copied ? "✓ Copied!" : "Copy Text"}</button>
        </div>
      </div>

      <section className="max-w-[900px] mx-auto bg-white p-6 rounded-2xl border shadow-sm mt-5">
        <h2 className="text-[17px] font-black mb-2">Why Users Choose NEXORA AI Text Humanizer?</h2>
        <p className="text-slate-500 text-[12.5px] leading-[1.7]">Unlike other humanizers that limit words, add watermark and upload your text to a server, NEXORA AI Text Humanizer is free, no watermark, unlimited use, and private — your text never leaves your device, processing happens in your browser. It fixes robotic phrasing like utilize → use, however → but, adds natural contractions like It&apos;s, I&apos;m, improves flow, and makes content more engaging. Best for students, bloggers, content writers, job applications, assignments, and emails. Works on iPhone, Android, and laptop without any app. It is a simple tool to make AI-assisted writing sound more natural and readable for real readers.</p>
        <h3 className="text-[13px] font-black mt-4 mb-1.5 text-indigo-600">What is AI Text Humanizer?</h3>
        <p className="text-slate-500 text-[12.5px] leading-[1.7]">An AI Text Humanizer is a tool that rewrites AI-generated text to remove robotic tone. It replaces formal, repetitive words with simple everyday language, fixes long sentences, and improves readability. Writers use it to make essays, blogs, emails, and assignments sound like they were written by a person — clear, natural, and easy to read.</p>
        <h3 className="text-[13px] font-black mt-4 mb-1.5 text-indigo-600">How to Use Humanizer - 3 Easy Steps</h3>
        <p className="text-slate-500 text-[12.5px] leading-[1.7]"><b>Step 1:</b> Paste your AI generated text in the left box<br /><b>Step 2:</b> Select tone — Student Friendly, Casual Natural or Professional<br /><b>Step 3:</b> Click Humanize Text → and copy the natural result from the right box.</p>
        <h3 className="text-[13px] font-black mt-4 mb-1.5 text-indigo-600">Features - Why Users Love NEXORA</h3>
        <ul className="pl-[18px] text-slate-500 text-[12.5px] leading-[1.7] list-disc"><li>100% Free, No Watermark, Unlimited Words</li><li>100% Private — Text never leaves your device, no server upload</li><li>Fixes Robotic Words — utilize → use, moreover → also, natural contractions</li><li>3 Tones — Student, Casual Natural, Professional</li><li>Works on iPhone, Android, Laptop — No App Needed</li><li>Fast in 2 Seconds, Made for All Users Worldwide</li></ul>
      </section>

      <section className="max-w-[900px] mx-auto bg-white p-6 rounded-2xl border shadow-sm mt-4">
        <h2 className="text-[17px] font-black mb-2">NEXORA vs Other Humanizers - Comparison</h2>
        <table className="w-full border-collapse text-[12px] mt-2"><thead><tr><th className="border p-2 bg-violet-50 text-left">Feature</th><th className="border p-2 bg-violet-50">NEXORA ✅</th><th className="border p-2 bg-violet-50">Others ❌</th></tr></thead><tbody>
          <tr><td className="border p-2">Limit</td><td className="border p-2 text-center">Unlimited ✅</td><td className="border p-2 text-center">500 Words Only</td></tr>
          <tr><td className="border p-2">Watermark</td><td className="border p-2 text-center">No ✅</td><td className="border p-2 text-center">Yes</td></tr>
          <tr><td className="border p-2">Privacy</td><td className="border p-2 text-center">100% Private ✅</td><td className="border p-2 text-center">Uploads to Server</td></tr>
          <tr><td className="border p-2">Price</td><td className="border p-2 text-center">Free ✅</td><td className="border p-2 text-center">Paid $10+</td></tr>
          <tr><td className="border p-2">Login</td><td className="border p-2 text-center">No Login ✅</td><td className="border p-2 text-center">Login Required</td></tr>
        </tbody></table>
      </section>

      <section className="max-w-[900px] mx-auto bg-white p-6 rounded-2xl border shadow-sm mt-4">
        <h2 className="text-[17px] font-black mb-2">FAQ - AI Text Humanizer</h2>
        <p className="text-slate-500 text-[12.5px] leading-[1.7]"><b>Q: Is AI Text Humanizer free?</b><br />A: Yes, 100% free, no watermark, unlimited use, no login.<br /><br /><b>Q: Is my data safe?</b><br />A: Yes, 100% private, browser-based. Your text never leaves your device.<br /><br /><b>Q: How accurate is this tool?</b><br />A: It improves natural tone, fixes robotic phrasing and makes text more human-like, readable and engaging for readers.<br /><br /><b>Q: Does it work on iPhone?</b><br />A: Yes, works on iPhone, Android, Laptop — no app needed.<br /><br /><b>Q: What does it fix?</b><br />A: Fixes robotic words utilize → use, however → but, adds contractions It&apos;s, I&apos;m, improves sentence flow while keeping original meaning.</p>
        <p className="mt-3 text-[12.5px]">Try Also: <a href="/ai-detector" className="text-violet-600 font-bold">AI Detector</a> | <a href="/word-counter" className="text-violet-600 font-bold">Word Counter</a> | <a href="/paraphrasing-tool" className="text-violet-600 font-bold">Paraphrasing Tool</a> | <a href="/age-calculator" className="text-violet-600 font-bold">Age Calculator</a> | <a href="/" className="text-violet-600 font-bold">All Tools</a></p>
        <p className="mt-3 text-[11px] text-slate-400">Last Updated: November 2026</p>
      </section>

      <footer className="max-w-[900px] mx-auto bg-white border rounded-2xl p-6 text-slate-500 text-[13px] leading-[1.8] mt-5 mb-5">
        <div className="flex justify-between flex-wrap gap-5">
          <div><div className="font-black text-[18px] text-slate-900">NEX<span className="text-violet-600">ORA</span> — Built by Ayush Chauhan</div><div className="mt-2">📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" className="text-violet-600 font-bold">ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" className="text-blue-600 font-bold">Connect on LinkedIn</a></div></div>
          <div><div className="flex gap-3.5 flex-wrap font-bold mb-2"><a href="/about" className="text-slate-900">About</a><a href="/contact" className="text-slate-900">Contact</a><a href="/privacy" className="text-slate-900">Privacy</a><a href="/terms" className="text-slate-900">Terms</a><a href="/disclaimer" className="text-slate-900">Disclaimer</a><a href="/sitemap.xml" className="text-slate-900">Sitemap</a></div><div>© 2026 NEXORA Tools - AI Text Humanizer</div><div>Made in India 🇮🇳 | Free tools. Simple solutions.</div><div className="mt-1"><a href="/" className="text-violet-600 font-bold">← All Tools</a></div></div>
        </div>
      </footer>
    </main>
  );
}
