"use client";
import { useState, useEffect, useRef } from "react";

const LANGS = [
  { code: "hi", flag: "🇮🇳", name: "Hindi", tts: "hi-IN" },
  { code: "en", flag: "🇺🇸", name: "English", tts: "en-US" },
  { code: "es", flag: "🇪🇸", name: "Spanish", tts: "es-ES" },
  { code: "fr", flag: "🇫🇷", name: "French", tts: "fr-FR" },
  { code: "de", flag: "🇩🇪", name: "German", tts: "de-DE" },
  { code: "ar", flag: "🇸🇦", name: "Arabic", tts: "ar-SA" },
  { code: "zh-CN", flag: "🇨🇳", name: "Chinese", tts: "zh-CN" },
  { code: "ja", flag: "🇯🇵", name: "Japanese", tts: "ja-JP" },
  { code: "ko", flag: "🇰🇷", name: "Korean", tts: "ko-KR" },
  { code: "pt", flag: "🇧🇷", name: "Portuguese", tts: "pt-BR" },
  { code: "ru", flag: "🇷🇺", name: "Russian", tts: "ru-RU" },
  { code: "it", flag: "🇮🇹", name: "Italian", tts: "it-IT" },
  { code: "bn", flag: "🇧🇩", name: "Bengali", tts: "bn-IN" },
  { code: "ta", flag: "🇮🇳", name: "Tamil", tts: "ta-IN" },
  { code: "te", flag: "🇮🇳", name: "Telugu", tts: "te-IN" },
  { code: "mr", flag: "🇮🇳", name: "Marathi", tts: "mr-IN" },
  { code: "gu", flag: "🇮🇳", name: "Gujarati", tts: "gu-IN" },
  { code: "pa", flag: "🇮🇳", name: "Punjabi", tts: "pa-IN" },
  { code: "kn", flag: "🇮🇳", name: "Kannada", tts: "kn-IN" },
  { code: "ml", flag: "🇮🇳", name: "Malayalam", tts: "ml-IN" },
  { code: "or", flag: "🇮🇳", name: "Odia", tts: "or-IN" },
  { code: "as", flag: "🇮🇳", name: "Assamese", tts: "as-IN" },
  { code: "ne", flag: "🇳🇵", name: "Nepali", tts: "ne-NP" },
  { code: "ur", flag: "🇵🇰", name: "Urdu", tts: "ur-PK" },
  { code: "si", flag: "🇱🇰", name: "Sinhala", tts: "si-LK" },
  { code: "th", flag: "🇹🇭", name: "Thai", tts: "th-TH" },
  { code: "vi", flag: "🇻🇳", name: "Vietnamese", tts: "vi-VN" },
  { code: "id", flag: "🇮🇩", name: "Indonesian", tts: "id-ID" },
  { code: "ms", flag: "🇲🇾", name: "Malay", tts: "ms-MY" },
  { code: "tl", flag: "🇵🇭", name: "Filipino", tts: "fil-PH" },
  { code: "uk", flag: "🇺🇦", name: "Ukrainian", tts: "uk-UA" },
  { code: "pl", flag: "🇵🇱", name: "Polish", tts: "pl-PL" },
  { code: "sv", flag: "🇸🇪", name: "Swedish", tts: "sv-SE" },
  { code: "no", flag: "🇳🇴", name: "Norwegian", tts: "nb-NO" },
  { code: "da", flag: "🇩🇰", name: "Danish", tts: "da-DK" },
  { code: "fi", flag: "🇫🇮", name: "Finnish", tts: "fi-FI" },
  { code: "el", flag: "🇬🇷", name: "Greek", tts: "el-GR" },
  { code: "he", flag: "🇮🇱", name: "Hebrew", tts: "he-IL" },
  { code: "tr", flag: "🇹🇷", name: "Turkish", tts: "tr-TR" },
  { code: "nl", flag: "🇳🇱", name: "Dutch", tts: "nl-NL" },
];

const VOICES = [
  { id: "real-man", emoji: "👨", label: "Real Man", sub: "Aadmi", pitch: 0.8, rate: 1 },
  { id: "real-woman", emoji: "👩", label: "Real Woman", sub: "Aurat", pitch: 1.2, rate: 1 },
  { id: "deep-man", emoji: "🧔", label: "Deep Male", sub: "Bhari", pitch: 0.6, rate: 0.9 },
  { id: "soft-female", emoji: "👱‍♀️", label: "Soft Female", sub: "Meethi", pitch: 1.4, rate: 0.95 },
  { id: "young-boy", emoji: "👦", label: "Young Boy", sub: "Ladka", pitch: 1.5, rate: 1.1 },
  { id: "young-girl", emoji: "👧", label: "Young Girl", sub: "Ladki", pitch: 1.7, rate: 1.1 },
  { id: "old-man", emoji: "👴", label: "Old Man", sub: "Budha", pitch: 0.7, rate: 0.8 },
  { id: "old-woman", emoji: "👵", label: "Old Woman", sub: "Budhi", pitch: 1.1, rate: 0.8 },
  { id: "robot", emoji: "🤖", label: "Robot", sub: "Robot", pitch: 0.5, rate: 1.1 },
  { id: "news", emoji: "🎙️", label: "News Anchor", sub: "News", pitch: 0.9, rate: 1 },
  { id: "story", emoji: "📖", label: "Story Teller", sub: "Kahani", pitch: 1, rate: 0.85 },
  { id: "fast", emoji: "⚡", label: "Fast Talk", sub: "Tez", pitch: 1, rate: 1.4 },
];

export default function Page() {
  const [text, setText] = useState("");
  const [langCode, setLangCode] = useState("hi");
  const [voiceId, setVoiceId] = useState("real-man");
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [translated, setTranslated] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [speed, setSpeed] = useState(1);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const selLang = LANGS.find(l => l.code === langCode)!;
  const selVoice = VOICES.find(v => v.id === voiceId)!;

  useEffect(() => {
    document.title = "Text to Speech Free - 40+ Languages Real Voice | NEXORA";
    const synth = window.speechSynthesis;
    synthRef.current = synth;
    const load = () => { const v = synth.getVoices(); if (v.length) setBrowserVoices(v); };
    load(); synth.onvoiceschanged = load;
    const t1 = setTimeout(load, 500); const t2 = setTimeout(load, 1500);
    const unlock = () => { try { const u = new SpeechSynthesisUtterance(""); synth.speak(u); synth.cancel(); } catch(e){} };
    document.addEventListener("touchstart", unlock, { once: true });
    return () => { clearTimeout(t1); clearTimeout(t2); document.removeEventListener("touchstart", unlock); };
  }, []);

  const cleanForSpeak = (s: string) => {
    let t = s;
    t = t.replace(/^[\s\-–—_*\#\.\,।\:;]+/g, "");
    t = t.replace(/[\-–—_*\#\@\|\/\\\<\>\(\)\[\]\{\}]+/g, " ");
    t = t.replace(/\.{2,}/g, ". ");
    t = t.replace(/\s+/g, " ").trim();
    return t;
  };
  const cleanForShow = (s: string) => s.replace(/^[\s\-–—_*\#]+/g, "").trim();

  const translateText = async (input: string, to: string) => {
    if (to === "en") return input;
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=en|${to}`);
      const data = await res.json();
      const t = data?.responseData?.translatedText;
      if (t && t.toLowerCase() !== input.toLowerCase()) return cleanForShow(t);
      return input;
    } catch { return input; }
  };

  const generate = async () => {
    if (!text.trim()) { alert("Pehle text likho!"); return; }
    setGenerating(true);
    const t = await translateText(text, selLang.code);
    const clean = cleanForShow(t);
    setTranslated(clean);
    setGenerating(false);
    speakText(clean);
  };

  const speakText = (toSpeak?: string) => {
    const raw = toSpeak || translated || text;
    const finalText = cleanForSpeak(raw);
    if (!finalText.trim()) { alert("Pehle text likho aur Generate dabao!"); return; }
    const synth = synthRef.current!;
    synth.cancel(); setPaused(false);
    const chunks = finalText.match(/[^.!?।]+[.!?।]?/g) || [finalText];
    let idx = 0;
    const speakChunk = () => {
      if (idx >= chunks.length) { setSpeaking(false); setPaused(false); return; }
      const utter = new SpeechSynthesisUtterance(chunks[idx].trim());
      utter.lang = selLang.tts;
      utter.rate = selVoice.rate * speed;
      utter.pitch = selVoice.pitch;
      const base = selLang.code.split("-")[0].toLowerCase();
      const googleVoice = browserVoices.find(v => v.lang.toLowerCase().startsWith(base) && v.name.toLowerCase().includes("google"));
      const anyVoice = browserVoices.find(v => v.lang.toLowerCase().startsWith(base));
      if (googleVoice) utter.voice = googleVoice;
      else if (anyVoice) utter.voice = anyVoice;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => { idx++; speakChunk(); };
      utter.onerror = () => { idx++; speakChunk(); };
      synth.speak(utter);
    };
    speakChunk();
  };

  // DOWNLOAD VOICE - MP3 Download hoga
  const downloadVoice = async () => {
    const raw = translated || text;
    const finalText = cleanForSpeak(raw);
    if (!finalText.trim()) { alert("Pehle text likho aur Generate dabao!"); return; }
    setDownloading(true);
    try {
      const chunk = finalText.slice(0, 180);
      const langForUrl = selLang.tts.split("-")[0];
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${langForUrl}&client=tw-ob`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("fail");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `nexora-${selLang.name}-${Date.now()}.mp3`;
      a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href), 5000);
    } catch {
      // Agar browser block kare to naya tab me kholo - Waha se download ho jayegi
      const chunk = finalText.slice(0, 180);
      const langForUrl = selLang.tts.split("-")[0];
      window.open(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${langForUrl}&client=tw-ob`, "_blank");
      alert("MP3 naye tab me khul gayi hai - Waha 3 dot dabake Download kar lo.");
    }
    setDownloading(false);
  };

  const stop = () => { synthRef.current?.cancel(); setSpeaking(false); setPaused(false); };
  const pause = () => { synthRef.current?.pause(); setPaused(true); };
  const resume = () => { synthRef.current?.resume(); setPaused(false); };

  // CHHOTA SIZE - Sab thoda chhota, clean
  const card: any = { background: "#fff", borderRadius: 16, padding: 13, border: "1px solid #e5e7eb", margin: "10px auto", maxWidth: 760, width: "96%", boxShadow: "0 2px 12px rgba(0,0,0,.04)" };
  const label: any = { fontSize: 11, fontWeight: 900, color: "#000", display: "block", marginBottom: 6 };

  return (
    <div style={{ fontFamily: "Inter,system-ui,sans-serif", background: "#f6f7fb", color: "#111", minHeight: "100vh", paddingBottom: 20 }}>
      <style>{`
        textarea, input{color:#000 !important;-webkit-text-fill-color:#000 !important;background:#fff !important}
        .no-scrollbar::-webkit-scrollbar{display:none} .no-scrollbar{scrollbar-width:none}
        .lang-scroll{display:grid;grid-auto-flow:column;grid-template-rows:repeat(2, auto);gap:6px;overflow-x:auto;padding:2px;scroll-snap-type:x mandatory}
        .voice-scroll{display:flex;gap:8px;overflow-x:auto;padding:2px;scroll-snap-type:x mandatory}
      `}</style>

      <nav style={{ maxWidth: 760, margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", flexWrap: "wrap", gap: 6, position: "sticky", top: 0, background: "rgba(246,247,251,.95)", zIndex: 20 }}>
        <a href="/" style={{ fontWeight: 900, textDecoration: "none", color: "#111", fontSize: 15 }}>🧮 NEXORA Tools</a>
        <div style={{ display: "flex", gap: 6 }}><span style={{ fontSize: 10, fontWeight: 700, background: "#dcfce7", color: "#166534", padding: "4px 8px", borderRadius: 20 }}>● 40+ LANG</span><a href="/" style={{ fontWeight: 700, fontSize: 11, color: "#2563eb", textDecoration: "none" }}>← All Tools</a></div>
      </nav>

      <div style={{ textAlign: "center", padding: "8px 16px" }}>
        <h1 style={{ fontSize: 21, fontWeight: 900, lineHeight: 1.2 }}>Text to Speech Free - 40+ Languages Real Voice</h1>
        <p style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Country chuno, Text likho, Generate dabao - Usi desh ki language me saaf bolega.</p>
        <div style={{ marginTop: 6 }}><span style={{ fontSize: 10, fontWeight: 700, background: "#dbeafe", color: "#1e40af", padding: "4px 8px", borderRadius: 20 }}>🌍 FREE • 40+ LANG • REAL HUMAN • DOWNLOAD MP3</span></div>
      </div>

      <div style={card}>
        <label style={label}>1. LANGUAGE CHUNO 👉 Scroll Karo:</label>
        <div className="lang-scroll no-scrollbar">
          {LANGS.map(l => (
            <button key={l.code} onClick={() => { setLangCode(l.code); setTranslated(""); stop(); }} style={{ minWidth: 96, padding: "7px 10px", borderRadius: 999, border: langCode === l.code ? "2px solid #2563eb" : "1px solid #e5e7eb", background: langCode === l.code ? "#2563eb" : "#f8fafc", color: langCode === l.code ? "#fff" : "#111", fontSize: 11, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", scrollSnapAlign: "start" }}>{l.flag} {l.name}</button>
          ))}
        </div>
        <p style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>👉 Abhi: <b style={{ color: "#2563eb" }}>{selLang.flag} {selLang.name}</b></p>

        <label style={{ ...label, marginTop: 12 }}>2. VOICE CHUNO 👉 Scroll Karo:</label>
        <div className="voice-scroll no-scrollbar">
          {VOICES.map(v => (
            <button key={v.id} onClick={() => setVoiceId(v.id)} style={{ minWidth: 84, padding: "8px 6px", borderRadius: 12, border: voiceId === v.id ? "2px solid #16a34a" : "1px solid #e5e7eb", background: voiceId === v.id ? "#f0fdf4" : "#fff", cursor: "pointer", textAlign: "center", scrollSnapAlign: "start" }}>
              <div style={{ fontSize: 20 }}>{v.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#000", marginTop: 2 }}>{v.label}</div>
              <div style={{ fontSize: 9, color: "#64748b" }}>{v.sub}</div>
              {voiceId === v.id && <div style={{ fontSize: 9, fontWeight: 800, color: "#16a34a", marginTop: 2 }}>✅ Selected</div>}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>👉 Abhi: <b style={{ color: "#16a34a" }}>{selVoice.emoji} {selVoice.label}</b></p>

        <label style={{ ...label, marginTop: 12 }}>3. TEXT LIKHO:</label>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Yaha text likho Jaise Hello brother" style={{ width: "100%", minHeight: 110, padding: 12, border: "1.5px solid #111", borderRadius: 12, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", background: "#ffffff", color: "#000000", WebkitTextFillColor: "#000000", fontWeight: 600, lineHeight: 1.5 }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
          <button onClick={() => setText("Hello brother")} style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#fff7ed", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>✍️ Sample Hello brother</button>
          <button onClick={() => setText("Mujhe YouTube ke liye ek achhi si kahani sunao")} style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#eff6ff", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>✍️ Sample Kahani</button>
          <button onClick={() => { setText(""); setTranslated(""); }} style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#f8fafc", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Clear</button>
        </div>

        {translated && <div style={{ marginTop: 10, padding: 10, background: "#f0fdf4", border: "1.5px solid #16a34a", borderRadius: 10 }}><b style={{ fontSize: 11, color: "#166534" }}>🌍 {selLang.name} me Translate hua:</b><div style={{ fontSize: 14, fontWeight: 700, color: "#000", marginTop: 4, lineHeight: 1.5 }}>{translated}</div></div>}

        <div style={{ marginTop: 10 }}><label style={{ fontSize: 10, fontWeight: 800, color: "#000" }}>Speed: {speed}x</label><input type="range" min="0.5" max="1.5" step="0.1" value={speed} onChange={e => setSpeed(Number(e.target.value))} style={{ width: "100%" }} /></div>

        <button onClick={generate} disabled={generating} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: "#ff7a00", color: "#fff", fontWeight: 900, fontSize: 15, cursor: "pointer", marginTop: 10 }}>{generating ? "⏳ Translate Ho Raha Hai..." : `✨ GENERATE - ${selLang.name} Me Bolo`}</button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
          <button onClick={() => speakText()} style={{ padding: 11, borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>{speaking && !paused ? "🔊 Baj Raha..." : "▶️ Play"}</button>
          <button onClick={paused ? resume : pause} style={{ padding: 11, borderRadius: 10, border: "none", background: "#111827", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>{paused ? "▶️ Resume" : "⏸️ Pause"}</button>
          <button onClick={stop} style={{ padding: 11, borderRadius: 10, border: "none", background: "#16a34a", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>⏹️ Stop</button>
        </div>

        {/* DOWNLOAD VOICE BUTTON - Naya */}
        <button onClick={downloadVoice} disabled={downloading} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #16a34a", background: "#f0fdf4", color: "#166534", fontWeight: 900, fontSize: 14, cursor: "pointer", marginTop: 8 }}>{downloading ? "⏳ Download Ho Rahi Hai..." : "⬇️ DOWNLOAD VOICE - MP3 Download Karo"}</button>
        <p style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", marginTop: 8 }}>Tip: Generate dabao - Fir Download se MP3 le lo - YouTube / Reels me laga lo.</p>
      </div>

      {/* GAP - Tool ke baad door gap, chipka nahi lagega */}
      <div style={{ height: 80 }}></div>

      <div style={card}><h2 style={{ fontSize: 15, fontWeight: 900, color: "#111" }}>Why NEXORA Text to Speech?</h2><p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>NEXORA Text to Speech 100% free hai. Country chuno, Text likho, Generate dabao - Usi desh ki language me bolega. 40+ desh - Hindi, English, Chinese, Japanese, Punjabi, Kannada, Malayalam, Nepali, Thai, Vietnam, sab me. 12 alag voice. MP3 Download bhi kar sakte ho. 100% private.</p><h3 style={{ fontSize: 12, fontWeight: 900, margin: "10px 0 4px", color: "#2563eb" }}>How to Use - 3 Steps</h3><p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}><b>Step 1:</b> Language chuno - Scroll karke desh chuno.<br /><b>Step 2:</b> Voice chuno - Aadmi, Aurat, Bachha.<br /><b>Step 3:</b> Text likho - Generate dabao - Play / Download karo.</p></div>

      <div style={{ height: 20 }}></div>

      <div style={card}><h2 style={{ fontSize: 15, fontWeight: 900, color: "#111" }}>FAQ</h2><p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}><b>Q: Hello brother likha to Hindi me kya bolega?</b><br />A: Hindi chuno to Namaskar Bhai bolega - Bina dash ke, saaf.<br /><br /><b>Q: Voice download hogi?</b><br />A: Haan, Download Voice dabao - MP3 download hogi, Reels / YouTube me laga sakte ho.<br /><br /><b>Q: Free hai?</b><br />A: Haan, 100% free, unlimited.<br /><br /><b>Q: iPhone pe chalega?</b><br />A: Haan, pehle screen pe touch karo, fir Generate dabao.</p></div>

      <div style={{ height: 20 }}></div>

      <div style={{ maxWidth: 760, margin: "10px auto", width: "96%", background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #e5e7eb" }}><div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14, fontSize: 12, lineHeight: 1.7, color: "#64748b" }}><div><div style={{ fontWeight: 900, fontSize: 16, color: "#111827" }}>NEX<span style={{ color: "#2563eb" }}>ORA</span> — Built by Ayush Chauhan</div><div style={{ marginTop: 6 }}>📧 ayushchauhan902704@gmail.com<br />📍 Dehradun, Uttarakhand, India</div></div><div><div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontWeight: 700 }}><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div><div>© 2026 NEXORA Tools</div><div style={{ marginTop: 4 }}><a href="/" style={{ color: "#2563eb", fontWeight: 700 }}>← All Tools</a></div></div></div></div>
    </div>
  );
}
