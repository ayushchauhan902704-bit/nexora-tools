"use client";
import { useState } from "react";

export default function LoveCalculatorClient() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState<{percent: number, msg: string, show: boolean} | null>(null);

  const calcLove = () => {
    const n1 = name1.trim();
    const n2 = name2.trim();
    if (!n1 || !n2) { alert("Dono naam likho ❤️"); return; }
    let sum = 0;
    let combined = (n1.toLowerCase() + n2.toLowerCase()).replace(/\s/g, '');
    for (let i = 0; i < combined.length; i++) { sum += combined.charCodeAt(i); }
    let percent = (sum % 71) + 30;
    if (n1.toLowerCase() === n2.toLowerCase()) percent = 100;
    if (percent > 100) percent = 99;
    if (n1[0].toLowerCase() === n2[0].toLowerCase() && percent < 75) percent += 10;

    let msg = "";
    if (percent >= 90) msg = "Soulmates! Shaadi pakki hai 💍❤️ Tum dono ek dusre ke liye bane ho!";
    else if (percent >= 75) msg = "True Love! Perfect Jodi 💘 Dil se connection hai!";
    else if (percent >= 60) msg = "Good Chemistry! 😍 Thoda try karo, pyaar aur badhega!";
    else if (percent >= 40) msg = "Friendship zyada, pyaar thoda kam 😉 Dosti pakki!";
    else msg = "Abhi dosti rakho, pyaar me time lagega 💔 But kuch bhi ho sakta hai!";

    setResult({ percent, msg, show: true });
    setTimeout(() => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const share = () => {
    if (!result) return;
    const text = `${name1} ❤️ ${name2} - Love ${result.percent}% - ${result.msg} - Check on NEXORA Tools ❤️ ${window.location.href}`;
    if (navigator.share) navigator.share({ title: "Love Calculator - NEXORA", text, url: location.href });
    else { navigator.clipboard.writeText(text); alert("Copied! Share on WhatsApp ❤️"); }
  };

  return (
    <div style={{ fontFamily: "system-ui", background: "#fdf2f8", minHeight: "100vh" }}>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid #fce7f3", zIndex: 10 }}>
        <div style={{ width: "min(900px, calc(100% - 32px))", margin: "auto", height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: "25px", fontWeight: 900 }}>NEX<span style={{ color: "#ec4899" }}>ORA</span></a>
          <a href="/" style={{ fontWeight: 700, color: "#ec4899", fontSize: "13px" }}>← All Tools</a>
        </div>
      </header>

      <main style={{ width: "min(900px, calc(100% - 32px))", margin: "auto", padding: "20px 0" }}>
        <div style={{ background: "white", border: "1px solid #fce7f3", borderRadius: "18px", padding: "26px", margin: "18px 0", boxShadow: "0 4px 20px rgba(236,72,153,.08)" }}>
          <span style={{ display: "inline-block", background: "#fce7f3", color: "#9d174d", padding: "5px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 800, marginBottom: "10px" }}>🔒 Private – 100% in browser | No.1 • Viral • Fun</span>
          <h1 style={{ fontSize: "24px", fontWeight: 900 }}>Love Calculator ❤️ - True Love % by Name</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: "13px" }}>No.1 Love Calculator - Check Love Compatibility with Crush, Partner, Soulmate in 1 Sec.</p>

          <input value={name1} onChange={e => setName1(e.target.value)} style={{ width: "100%", padding: "16px 14px", border: "2px solid #fbcfe8", borderRadius: "14px", fontSize: "15px", fontWeight: 700, outline: "none", marginTop: "12px" }} placeholder="Your Name ❤️ Eg. Ayush" />
          <input value={name2} onChange={e => setName2(e.target.value)} style={{ width: "100%", padding: "16px 14px", border: "2px solid #fbcfe8", borderRadius: "14px", fontSize: "15px", fontWeight: 700, outline: "none", marginTop: "12px" }} placeholder="Crush / Partner Name 💖 Eg. Priya" />
          <button onClick={calcLove} style={{ width: "100%", padding: "15px", borderRadius: "14px", border: "none", background: "#ec4899", color: "white", fontWeight: 900, fontSize: "15px", cursor: "pointer", marginTop: "14px" }}>💘 Calculate Love % - 1 Sec</button>

          {result?.show && (
            <div id="result" style={{ textAlign: "center", marginTop: "20px" }}>
              <div style={{ fontSize: "64px", fontWeight: 900, color: "#ec4899", letterSpacing: "-2px" }}>{result.percent}%</div>
              <div style={{ fontSize: "15px", fontWeight: 900 }}>{name1} ❤️ {name2}</div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#831843", marginTop: "8px" }}>{result.msg}</div>
              <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <button onClick={share} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "#111827", color: "white", fontWeight: 800 }}>📤 Share</button>
                <button onClick={() => { setName1(""); setName2(""); setResult(null); }} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "#f1f5f9", color: "#111827", fontWeight: 800 }}>🔄 Again</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: "white", border: "1px solid #fce7f3", borderRadius: "18px", padding: "22px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 900 }}>Why NEXORA Love Calculator No.1?</h2>
          <p style={{ fontSize: "12.5px", color: "#4a4a5a", lineHeight: "1.7", marginTop: "8px" }}>Uses Name Chemistry + Numerology logic. 100% private, in browser, free forever. Trusted by 96K+ lovers. Best for crush test, soulmate check.</p>
          <p style={{ marginTop: "12px", fontSize: "13px" }}><a href="/" style={{ color: "#ec4899", fontWeight: 700 }}>← Back to All Tools</a></p>
        </div>
      </main>
    </div>
  );
}
