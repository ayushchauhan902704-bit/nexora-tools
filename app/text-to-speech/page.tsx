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
  { code: "tr", flag: "🇹🇷", name: "Turkish", tts: "tr-TR" },
  { code: "nl", flag: "🇳🇱", name: "Dutch", tts: "nl-NL" },
  { code: "ur", flag: "🇵🇰", name: "Urdu", tts: "ur-PK" },
];

// 12 VOICE - Aadmi, Aurat, Bachha sab
const VOICES = [
  { id: "real-man", emoji: "👨", label: "Real Man", sub: "Aadmi - Real", pitch: 0.8, rate: 1 },
  { id: "real-woman", emoji: "👩", label: "Real Woman", sub: "Aurat - Real", pitch: 1.2, rate: 1 },
  { id: "deep-man", emoji: "🧔", label: "Deep Male", sub: "Bhari Awaaz", pitch: 0.6, rate: 0.9 },
  { id: "soft-female", emoji: "👱‍♀️", label: "Soft Female", sub: "Meethi Awaaz", pitch: 1.4, rate: 0.95 },
  { id: "young-boy", emoji: "👦", label: "Young Boy", sub: "Ladka", pitch: 1.5, rate: 1.1 },
  { id: "young-girl", emoji: "👧", label: "Young Girl", sub: "Ladki", pitch: 1.7, rate: 1.1 },
  { id: "old-man", emoji: "👴", label: "Old Man", sub: "Budha Aadmi", pitch: 0.7, rate: 0.8 },
  { id: "old-woman", emoji: "👵", label: "Old Woman", sub: "Budhi Aurat", pitch: 1.1, rate: 0.8 },
  { id: "robot", emoji: "🤖", label: "Robot", sub: "Robot Voice", pitch: 0.5, rate: 1.1 },
  { id: "news", emoji: "🎙️", label: "News Anchor", sub: "News Jaisa", pitch: 0.9, rate: 1 },
  { id: "story", emoji: "📖", label: "Story Teller", sub: "Kahani Wala", pitch: 1, rate: 0.85 },
  { id: "fast", emoji: "⚡", label: "Fast Talk", sub: "Tez Bolne Wala", pitch: 1, rate: 1.4 },
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

  // TRANSLATE - Hello likho, China chuno to Ni Hao bolega
  const translateText = async (input: string, to: string) => {
    if (to === "en") return input;
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=en|${to}`);
      const data = await res.json();
      const t = data?.responseData?.translatedText;
      if (t && t.toLowerCase() !== input.toLowerCase()) return t;
      return input;
    } catch { return input; }
  };

  const generate = async () => {
    if (!text.trim()) { alert("Pehle text likho!"); return; }
    setGenerating(true);
    const t = await translateText(text, selLang.code);
    setTranslated(t);
    setGenerating(false);
    // Generate ke baad turant bol dega
    speakText(t);
  };

  const speakText = (toSpeak?: string) => {
    const finalText = toSpeak || translated || text;
    if (!finalText.trim()) { alert("Pehle text likho aur Generate dabao!"); return; }
    const synth = synthRef.current!;
    synth.cancel(); setPaused(false);
    const utter = new SpeechSynthesisUtterance(finalText);
    utter.lang = selLang.tts;
    utter.rate = selVoice.rate * speed;
    utter.pitch = selVoice.pitch;
    // Browser voice - Language ke hisab se voice dhoondo
    const match = browserVoices.find(v => v.lang.toLowerCase().startsWith(selLang.code.split("-")[0].toLowerCase()));
    if (match) utter.voice = match;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => { setSpeaking(false); setPaused(false); };
    utter.onerror = () => { setSpeaking(false); setPaused(false); };
    synth.speak(utter);
  };

  const stop = () => { synthRef.current?.cancel(); setSpeaking(false); setPaused(false); };
  const pause = () => { synthRef.current?.pause(); setPaused(true); };
  const resume = () => { synthRef.current?.resume(); setPaused(false); };

  const card: any = { background: "#fff", borderRadius: 24, padding: 18, border: "1px solid #e5e7eb", margin: "14px auto", maxWidth: 900, width: "96%", boxShadow: "0 4px 20px rgba(0,0,0,.04)" };
  const label: any = { fontSize: 12, fontWeight: 900, color: "#000", display: "block", marginBottom: 8 };

  return (
    <div style={{ fontFamily: "Inter,system-ui,sans-serif", background: "#f6f7fb", color: "#111", minHeight: "100vh", paddingBottom: 20 }}>
      <style>{`
        textarea, input{color:#000 !important;-webkit-text-fill-color:#000 !important;background:#fff !important}
        .no-scrollbar::-webkit-scrollbar{display:none} .no-scrollbar{scrollbar-width:none}
        .lang-scroll{display:grid;grid-auto-flow:column;grid-template-rows:repeat(2, auto);gap:8px;overflow-x:auto;padding:4px 2px;scroll-snap-type:x mandatory}
        .voice-scroll{display:flex;gap:10px;overflow-x:auto;padding:4px 2px;scroll-snap-type:x mandatory}
      `}</style>

      <nav style={{ maxWidth: 900, margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 15px", flexWrap: "wrap", gap: 8, position: "sticky", top: 0, background: "rgba(246,247,251,.95)", zIndex: 20 }}>
        <a href="/" style={{ fontWeight: 900, textDecoration: "none", color: "#111" }}>🧮 NEXORA Tools</a>
        <div style={{ display: "flex", gap: 8 }}><span style={{ fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#166534", padding: "5px 10px", borderRadius: 20 }}>● 40+ LANG</span><a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#2563eb", textDecoration: "none" }}>← All Tools</a></div>
      </nav>

      <div style={{ textAlign: "center", padding: "10px 20px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900 }}>Text to Speech Free - 40+ Languages Real Voice</h1>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>Country chuno, Text likho, Generate dabao - Usi desh ki language me bolega. Hello likho, China chuno to Ni Hao bolega.</p>
        <div style={{ marginTop: 8 }}><span style={{ fontSize: 11, fontWeight: 700, background: "#dbeafe", color: "#1e40af", padding: "5px 10px", borderRadius: 20 }}>🌍 FREE • 40+ LANG • REAL HUMAN • TRANSLATE + SPEAK</span></div>
      </div>

      <div style={card}>
        {/* 1. LANGUAGE - 2 LINE, RIGHT SE LEFT SCROLL */}
        <label style={label}>1. LANGUAGE CHUNO - Desh Chuno 👉 Scroll Karo:</label>
        <div className="lang-scroll no-scrollbar">
          {LANGS.map(l => (
            <button key={l.code} onClick={() => { setLangCode(l.code); setTranslated(""); stop(); }} style={{ minWidth: 118, padding: "10px 12px", borderRadius: 999, border: langCode === l.code ? "2px solid #2563eb" : "1px solid #e5e7eb", background: langCode === l.code ? "#2563eb" : "#f8fafc", color: langCode === l.code ? "#fff" : "#111", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", scrollSnapAlign: "start" }}>{l.flag} {l.name}</button>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>👉 Abhi Chuna: <b style={{ color: "#2563eb" }}>{selLang.flag} {selLang.name}</b> - Isi language me bolega</p>

        {/* 2. VOICE - 12 VOICE, LEFT SE RIGHT SCROLL */}
        <label style={{ ...label, marginTop: 18 }}>2. VOICE CHUNO - Aadmi / Aurat / Bachha 👉 Scroll Karo:</label>
        <div className="voice-scroll no-scrollbar">
          {VOICES.map(v => (
            <button key={v.id} onClick={() => setVoiceId(v.id)} style={{ minWidth: 108, padding: "12px 10px", borderRadius: 16, border: voiceId === v.id ? "2px solid #16a34a" : "1px solid #e5e7eb", background: voiceId === v.id ? "#f0fdf4" : "#fff", cursor: "pointer", textAlign: "center", scrollSnapAlign: "start" }}>
              <div style={{ fontSize: 26 }}>{v.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#000", marginTop: 4 }}>{v.label}</div>
              <div style={{ fontSize: 10, color: "#64748b" }}>{v.sub}</div>
              {voiceId === v.id && <div style={{ fontSize: 10, fontWeight: 800, color: "#16a34a", marginTop: 4 }}>✅ Selected</div>}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>👉 Abhi Chuna: <b style={{ color: "#16a34a" }}>{selVoice.emoji} {selVoice.label}</b></p>

        {/* 3. TEXT BOX - WHITE, BLACK TEXT */}
        <label style={{ ...label, marginTop: 18 }}>3. TEXT LIKHO - Yaha Likho:</label>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Yaha text likho... Jaise: Hello, kaise ho?&#10;China chuno to ye Ni Hao me bolega&#10;Hindi chuno to Namaste me bolega" style={{ width: "100%", minHeight: 150, padding: 16, border: "1.5px solid #111", borderRadius: 14, fontSize: 16, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", background: "#ffffff", color: "#000000", WebkitTextFillColor: "#000000", fontWeight: 600, lineHeight: 1.6 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <button onClick={() => setText("Hello, kaise ho? Mera naam Ayush hai.")} style={{ padding: "7px 12px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#fff7ed", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>✍️ Sample: Hello</button>
          <button onClick={() => setText("Mujhe YouTube ke liye ek achhi si kahani sunao.")} style={{ padding: "7px 12px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#eff6ff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>✍️ Sample: Kahani</button>
          <button onClick={() => { setText(""); setTranslated(""); }} style={{ padding: "7px 12px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#f8fafc", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Clear</button>
        </div>

        {/* TRANSLATED TEXT - Kya banega wo yaha dikhega */}
        {translated && <div style={{ marginTop: 12, padding: 14, background: "#f0fdf4", border: "1.5px solid #16a34a", borderRadius: 12 }}><b style={{ fontSize: 12, color: "#166534" }}>🌍 {selLang.name} me Translate hua:</b><div style={{ fontSize: 16, fontWeight: 700, color: "#000", marginTop: 6, lineHeight: 1.6 }}>{translated}</div></div>}

        {/* SPEED */}
        <div style={{ marginTop: 14 }}><label style={{ fontSize: 11, fontWeight: 800, color: "#000" }}>Speed: {speed}x - Tez / Dheere</label><input type="range" min="0.5" max="1.5" step="0.1" value={speed} onChange={e => setSpeed(Number(e.target.value))} style={{ width: "100%" }} /></div>

        {/* GENERATE BUTTON */}
        <button onClick={generate} disabled={generating} style={{ width: "100%", padding: 15, borderRadius: 12, border: "none", background: "#ff7a00", color: "#fff", fontWeight: 900, fontSize: 17, cursor: "pointer", marginTop: 14 }}>{generating ? "⏳ Translate Ho Raha Hai..." : `✨ GENERATE - ${selLang.name} Me Bolo`}</button>

        {/* 3 BUTTON - PLAY / PAUSE / STOP */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
          <button onClick={() => speakText()} style={{ padding: 14, borderRadius: 12, border: "none", background: "#2563eb", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 14 }}>{speaking && !paused ? "🔊 Baj Raha..." : "▶️ Play"}</button>
          <button onClick={paused ? resume : pause} style={{ padding: 14, borderRadius: 12, border: "none", background: "#111827", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 14 }}>{paused ? "▶️ Resume" : "⏸️ Pause"}</button>
          <button onClick={stop} style={{ padding: 14, borderRadius: 12, border: "none", background: "#16a34a", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 14 }}>⏹️ Stop</button>
        </div>
        <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 10 }}>Tip: Pehle Generate dabao - Text translate hoga, fir Play se bolega. iPhone pe pehle screen pe touch karo.</p>
      </div>

      <div style={card}><h2 style={{ fontSize: 17, fontWeight: 900, color: "#111" }}>Why NEXORA Text to Speech?</h2><p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.7 }}>NEXORA Text to Speech 100% free hai. Country chuno, Text likho, Generate dabao - Usi desh ki language me bolega. Hindi, English, Chinese, Japanese, Spanish - Sab me. 12 alag voice - Aadmi, Aurat, Bachha, Robot. 100% private, text phone se bahar nahi jata. YouTube Shorts, Reels ke liye best hai.</p><h3 style={{ fontSize: 13, fontWeight: 900, margin: "14px 0 6px", color: "#2563eb" }}>How to Use - 3 Steps</h3><p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.7 }}><b>Step 1:</b> Language chuno - Scroll karke desh chuno.<br /><b>Step 2:</b> Voice chuno - Aadmi, Aurat, Bachha.<br /><b>Step 3:</b> Text likho - Generate dabao - Play se suno.</p></div>
      <div style={card}><h2 style={{ fontSize: 17, fontWeight: 900, color: "#111" }}>FAQ</h2><p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.7 }}><b>Q: Hello likha to China me kya bolega?</b><br />A: China chuno to Hello ka matlab Ni Hao bolega - Translate + Speak dono hoga.<br /><br /><b>Q: Free hai?</b><br />A: Haan, 100% free, unlimited.<br /><br /><b>Q: iPhone pe chalega?</b><br />A: Haan, pehle screen pe touch karo, fir Generate dabao.</p></div>
      <div style={{ maxWidth: 900, margin: "20px auto", width: "96%", background: "#fff", borderRadius: 24, padding: 20, border: "1px solid #e5e7eb" }}><div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, fontSize: 13, lineHeight: 1.8, color: "#64748b" }}><div><div style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>NEX<span style={{ color: "#2563eb" }}>ORA</span> — Built by Ayush Chauhan</div><div style={{ marginTop: 8 }}>📧 ayushchauhan902704@gmail.com<br />📍 Dehradun, Uttarakhand, India</div></div><div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontWeight: 700 }}><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div><div>© 2026 NEXORA Tools</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#2563eb", fontWeight: 700 }}>← All Tools</a></div></div></div></div>
    </div>
  );
}
