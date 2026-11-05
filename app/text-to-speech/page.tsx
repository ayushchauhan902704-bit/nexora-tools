"use client";
import { useState, useEffect, useRef } from "react";

const LANGS = [
  { code: "all", label: "🌍 All" }, { code: "hi", label: "🇮🇳 Hindi" }, { code: "en", label: "🇺🇸 English" },
  { code: "es", label: "🇪🇸 Spanish" }, { code: "fr", label: "🇫🇷 French" }, { code: "de", label: "🇩🇪 German" },
  { code: "ar", label: "🇸🇦 Arabic" }, { code: "zh", label: "🇨🇳 Chinese" }, { code: "ja", label: "🇯🇵 Japanese" },
  { code: "ko", label: "🇰🇷 Korean" }, { code: "pt", label: "🇧🇷 Portuguese" }, { code: "ru", label: "🇷🇺 Russian" },
  { code: "it", label: "🇮🇹 Italian" }, { code: "bn", label: "🇧🇩 Bengali" }, { code: "ta", label: "🇮🇳 Tamil" },
  { code: "te", label: "🇮🇳 Telugu" }, { code: "mr", label: "🇮🇳 Marathi" }, { code: "gu", label: "🇮🇳 Gujarati" },
  { code: "tr", label: "🇹🇷 Turkish" }, { code: "nl", label: "🇳🇱 Dutch" },
];

export default function Page() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [lang, setLang] = useState("all");
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    document.title = "Text to Speech Free - 40+ Languages Real Voice | NEXORA";
    const synth = window.speechSynthesis;
    synthRef.current = synth;
    const load = () => {
      const v = synth.getVoices();
      if (v.length) setVoices(v);
    };
    load();
    synth.onvoiceschanged = load;
    const t = setTimeout(load, 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = voices.map((v, i) => ({ v, i })).filter(({ v }) => lang === "all" || v.lang.toLowerCase().includes(lang));

  useEffect(() => {
    if (filtered.length && !filtered.find(f => f.i === voiceIdx)) setVoiceIdx(filtered[0].i);
  }, [lang, voices]);

  const speak = () => {
    if (!text.trim()) { alert("Text likho pehle!"); return; }
    const synth = synthRef.current!;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    if (voices[voiceIdx]) utter.voice = voices[voiceIdx];
    utter.rate = speed; utter.pitch = pitch;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    synth.speak(utter);
  };
  const stop = () => { synthRef.current?.cancel(); setSpeaking(false); };

  const card: any = { background: "#fff", borderRadius: 24, padding: 22, border: "1px solid #e5e7eb", margin: "18px auto", maxWidth: 900, width: "96%", boxShadow: "0 4px 20px rgba(0,0,0,.04)" };
  const h2: any = { fontSize: 17, fontWeight: 900, color: "#111" };
  const p: any = { fontSize: 12.5, color: "#475569", lineHeight: 1.7 };
  const badge: any = { fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#166534", padding: "5px 10px", borderRadius: 20, border: "1px solid #bbf7d0" };
  const btn: any = { padding: "14px 20px", borderRadius: 12, border: "none", background: "#111827", color: "#fff", fontWeight: 800, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontSize: 14, width: "100%" };

  return (
    <div style={{ fontFamily: "Inter,system-ui,sans-serif", background: "#f6f7fb", color: "#111", minHeight: "100vh", paddingBottom: 20 }}>
      <nav style={{ maxWidth: 900, margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 15px", flexWrap: "wrap", gap: 8, position: "sticky", top: 0, background: "rgba(246,247,251,.95)", zIndex: 20 }}>
        <a href="/" style={{ fontWeight: 900, textDecoration: "none", color: "#111", whiteSpace: "nowrap" }}>🧮 NEXORA Tools</a>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={badge}>● 40+ LANG</span>
          <span style={badge}>✅ No Watermark Real Voice</span>
          <a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#2563eb", textDecoration: "none" }}>← All Tools</a>
        </div>
      </nav>

      <div style={{ textAlign: "center", padding: "10px 20px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>Text to Speech Free - 40+ Languages Real Voice</h1>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>Convert text to real human voice in Hindi, English, Spanish, French & 35+ more — No Watermark, HD, Private</p>
        <div style={{ marginTop: 8 }}><span style={{ ...badge, background: "#dbeafe", color: "#1e40af", border: "1px solid #bfdbfe" }}>🌍 FREE • 40+ LANG • REAL HUMAN • PRIVATE</span></div>
      </div>

      <div style={{ ...card, padding: 22 }}>
        <label style={{ fontSize: 11, fontWeight: 800, opacity: 0.6 }}>SELECT LANGUAGE - भाषा चुनें:</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(105px,1fr))", gap: 8, marginTop: 12 }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => setLang(l.code)} style={{ padding: "8px 10px", borderRadius: 999, border: "1px solid #e5e7eb", background: lang === l.code ? "#111827" : "#f8fafc", color: lang === l.code ? "#fff" : "#111", fontSize: 11, fontWeight: 700, cursor: "pointer", textAlign: "center" }}>{l.label}</button>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 800, opacity: 0.6 }}>SELECT VOICE - Real Human Voice:</label>
          <select value={voiceIdx} onChange={e => setVoiceIdx(Number(e.target.value))} style={{ width: "100%", padding: 12, border: "1px solid #e5e7eb", borderRadius: 12, background: "#f8fafc", fontSize: 13, fontWeight: 700, outline: "none", marginTop: 6, boxSizing: "border-box" }}>
            {filtered.map(({ v, i }) => (
              <option key={i} value={i}>{v.name} ({v.lang}){v.name.toLowerCase().includes("google") ? " • Real Human" : ""}</option>
            ))}
          </select>
          <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{voices.length ? `${voices.length} Real Voices Loaded - ${new Set(voices.map(v => v.lang)).size} Languages` : "Loading real voices..."}</p>
        </div>

        <textarea value={text} onChange={e => setText(e.target.value)} placeholder={"Type in any language...\nहिन्दी: नमस्ते दोस्तों, ये NEXORA का टूल है\nEnglish: Hello friends, this is NEXORA Text to Speech\nSpanish: Hola amigos, esto es increíble"} style={{ width: "100%", minHeight: 180, padding: 16, border: "1.5px solid #e5e7eb", borderRadius: 14, fontSize: 15, outline: "none", resize: "vertical", marginTop: 16, boxSizing: "border-box", fontFamily: "inherit" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
          <div><label style={{ fontSize: 11, fontWeight: 800, opacity: 0.6 }}>Speed: {speed}x</label><input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={e => setSpeed(Number(e.target.value))} style={{ width: "100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 12, background: "#f8fafc" }} /></div>
          <div><label style={{ fontSize: 11, fontWeight: 800, opacity: 0.6 }}>Pitch: {pitch}</label><input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={e => setPitch(Number(e.target.value))} style={{ width: "100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 12, background: "#f8fafc" }} /></div>
        </div>

        {speaking && <div style={{ display: "flex", gap: 3, alignItems: "center", justifyContent: "center", height: 40, marginTop: 14 }}><div style={{ width: 4, height: 28, background: "#2563eb", borderRadius: 10 }} /><div style={{ width: 4, height: 18, background: "#2563eb", borderRadius: 10 }} /><div style={{ width: 4, height: 28, background: "#2563eb", borderRadius: 10 }} /><div style={{ width: 4, height: 18, background: "#2563eb", borderRadius: 10 }} /><div style={{ width: 4, height: 28, background: "#2563eb", borderRadius: 10 }} /></div>}

        <button onClick={speak} style={{ ...btn, background: "#2563eb", marginTop: 14, fontSize: 16 }}>{speaking ? "🔊 Speaking..." : "▶️ Play in Selected Language"}</button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
          <button onClick={() => synthRef.current?.pause()} style={btn}>⏸️ Pause</button>
          <button onClick={() => synthRef.current?.resume()} style={btn}>▶️ Resume</button>
          <button onClick={stop} style={{ ...btn, background: "#16a34a" }}>⏹️ Stop</button>
        </div>
        <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 10 }}>Tip: Hindi ke liye Google Hindi, English ke liye Google US English - ye sabse real voice hai.</p>
      </div>

      <div style={card}><h2 style={h2}>Why NEXORA Text to Speech?</h2><p style={p}>NEXORA Text to Speech is 100% free forever, no watermark, 40+ languages, real human voice, 100% private — your text never leaves your phone, browser-based SpeechSynthesis, no upload to server. Convert text to voice in 1 second. Choose Hindi for YouTube, English for presentation, Spanish French German for learning, Arabic Chinese Japanese for global content. Made in India, works on iPhone, Android, Laptop.</p>
        <h3 style={{ fontSize: 13, fontWeight: 900, margin: "14px 0 6px", color: "#2563eb" }}>What is Text to Speech 40+ Languages?</h3><p style={p}>Text to Speech (TTS) by NEXORA is a free voice tool that converts any text into real human voice in 40+ languages including Hindi, English, Spanish, French, German, Arabic, Chinese, Japanese, Korean, Portuguese, Russian, Italian, Bengali, Tamil, Telugu, Marathi, Gujarati, Turkish, Dutch. Perfect for YouTube Shorts voiceover, Instagram Reels, school projects, presentations, storytelling, learning pronunciation.</p>
        <h3 style={{ fontSize: 13, fontWeight: 900, margin: "14px 0 6px", color: "#2563eb" }}>How to Use - 3 Easy Steps</h3><p style={p}><b>Step 1:</b> Select Language — Click on language chip like Hindi, English, Spanish.<br /><b>Step 2:</b> Type Text — Paste or type your script in that language, choose real voice from dropdown.<br /><b>Step 3:</b> Play Real Voice — Click Play, adjust Speed and Pitch, Pause Resume anytime.</p>
        <h3 style={{ fontSize: 13, fontWeight: 900, margin: "14px 0 6px", color: "#2563eb" }}>Features</h3><ul style={{ ...p, paddingLeft: 18 }}><li>✅ 100% Free, No Watermark, Unlimited, No Signup</li><li>✅ 40+ Languages - Hindi English Spanish French German Arabic Chinese Japanese +30 more</li><li>✅ Real Human Voice - Google Real Voices, Male Female</li><li>✅ 100% Private — Text never leaves phone</li><li>✅ Speed & Pitch Control, Pause Resume Stop</li><li>✅ Works on iPhone, Android, Laptop — No App Needed</li></ul>
      </div>

      <div style={card}><h2 style={h2}>NEXORA vs Others - Comparison</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
          <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#eff6ff", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#eff6ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#eff6ff" }}>Others ❌</th></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Languages</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>40+ ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>5-10 Only</td></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Limit</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Unlimited ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>500-2000 chars</td></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Watermark / Paid</td></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>100% Private ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Uploads to Server</td></tr>
          <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>$9+ / Month</td></tr>
        </tbody></table>
      </div>

      <div style={card}><h2 style={h2}>FAQ - Text to Speech</h2><p style={p}><b>Q: Is this Text to Speech Free?</b><br />A: Yes, 100% free forever, no watermark, unlimited. No signup, browser voice.<br /><br /><b>Q: Is my data safe?</b><br />A: Yes, 100% private. Text never leaves your device, browser Speech API.<br /><br /><b>Q: iPhone support?</b><br />A: Yes, works on iPhone, Android, Laptop - Safari, Chrome.<br /><br /><b>Q: Can I use for YouTube?</b><br />A: Yes, free for YouTube Shorts, Reels, commercial use, no watermark.</p>
        <p style={{ ...p, marginTop: 12 }}>Try Also: <a href="/background-remover" style={{ color: "#2563eb", fontWeight: 700 }}>Background Remover</a> | <a href="/passport-photo-maker" style={{ color: "#2563eb", fontWeight: 700 }}>Passport Photo Maker</a> | <a href="/image-compressor" style={{ color: "#2563eb", fontWeight: 700 }}>Image Compressor</a> | <a href="/" style={{ color: "#2563eb", fontWeight: 700 }}>All Tools</a></p>
      </div>

      <div style={{ maxWidth: 900, margin: "20px auto", width: "96%", background: "#fff", borderRadius: 24, padding: 20, border: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, fontSize: 13, lineHeight: 1.8, color: "#64748b" }}>
          <div><div style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>NEX<span style={{ color: "#2563eb" }}>ORA</span> — Built by Ayush Chauhan</div><div style={{ marginTop: 8 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#2563eb", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div></div>
          <div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontWeight: 700, marginBottom: 8 }}><a href="/about" style={{ color: "#111827", textDecoration: "none" }}>About</a><a href="/contact" style={{ color: "#111827", textDecoration: "none" }}>Contact</a><a href="/privacy" style={{ color: "#111827", textDecoration: "none" }}>Privacy</a><a href="/terms" style={{ color: "#111827", textDecoration: "none" }}>Terms</a></div><div>© 2026 NEXORA Tools - Text to Speech</div><div>Made in India 🇮🇳 | Free tools. Simple solutions.</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#2563eb", fontWeight: 700 }}>← All Tools</a></div></div>
        </div>
      </div>
    </div>
  );
}
