"use client";
import { useState, useEffect } from "react";

const PRESETS = [
  { label: "🎆 New Year 2027", date: "2027-01-01T00:00:00" },
  { label: "🪔 Diwali 2026", date: "2026-11-08T00:00:00" },
  { label: "🎄 Christmas 2026", date: "2026-12-25T00:00:00" },
  { label: "🎂 Birthday", date: "2026-12-31T00:00:00" },
  { label: "📚 Exam", date: "2026-12-01T09:00:00" },
];

export default function CountdownClient() {
  const [title, setTitle] = useState("New Year 2027 Tak");
  const [target, setTarget] = useState("2027-01-01T00:00:00");
  const [now, setNow] = useState(new Date());
  const [customDate, setCustomDate] = useState("");

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = new Date(target).getTime() - now.getTime();
  const isPast = diff <= 0;
  const abs = Math.abs(diff);
  const d = Math.floor(abs / (1000 * 60 * 60 * 24));
  const h = Math.floor((abs / (1000 * 60 * 60)) % 24);
  const m = Math.floor((abs / (1000 * 60)) % 60);
  const s = Math.floor((abs / 1000) % 60);

  const setPreset = (p: any) => { setTitle(p.label.replace(/^[🎆🪔🎄🎂📚] /, "") + " Tak"); setTarget(p.date); };

  const setCustom = () => {
    if (!customDate) return;
    setTarget(customDate);
    setTitle("Mera Countdown Tak");
  };

  const box = (val: number, label: string, color: string) => (
    <div style={{ flex: 1, minWidth: "70px", background: "#101626", border: `1px solid ${color}55`, borderRadius: "20px", padding: "20px 8px", textAlign: "center" }}>
      <div style={{ fontSize: "38px", fontWeight: "900", color: color, lineHeight: 1 }}>{String(val).padStart(2, "0")}</div>
      <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#9ba7bd", marginTop: "8px", fontWeight: "700" }}>{label}</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080b14", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "850px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: "34px", fontWeight: "900", lineHeight: 1.2, margin: "10px 0 6px" }}>⏳ Countdown Timer</h1>
        <p style={{ textAlign: "center", color: "#9ba7bd", margin: "0 0 24px" }}>Kisi bhi din tak ka live countdown - Second by Second!</p>

        <div style={{ background: "linear-gradient(135deg,#171b35,#101c2a)", border: "1px solid rgba(155,132,255,0.3)", borderRadius: "26px", padding: "28px", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", padding: "8px 16px", borderRadius: "50px", fontSize: "12px", color: "#b6a8ff", fontWeight: "700" }}>✨ {isPast ? "TIME HO GAYA!" : "TIME BAKI HAI"}</div>
          <h2 style={{ fontSize: "28px", margin: "16px 0 20px" }}>{isPast ? "🎉 " + title + " Aa Gaya!" : title}</h2>
          {isPast ? (
            <div style={{ fontSize: "50px" }}>🎉🎊🥳</div>
          ) : (
            <div style={{ display: "flex", gap: "12px" }}>
              {box(d, "DAYS", "#9275ff")}
              {box(h, "HOURS", "#51e1d0")}
              {box(m, "MINUTES", "#FACC15")}
              {box(s, "SECONDS", "#FF6B6B")}
            </div>
          )}
          <p style={{ color: "#9ba7bd", fontSize: "13px", marginTop: "18px" }}>Target Date: {new Date(target).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })}</p>
        </div>

        <div style={{ background: "#101626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px", marginTop: "20px" }}>
          <h3 style={{ margin: "0 0 12px" }}>🔥 Quick Presets</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => setPreset(p)} style={{ padding: "11px 16px", borderRadius: "50px", border: "1px solid rgba(255,255,255,0.15)", background: target === p.date ? "#9275ff" : "rgba(255,255,255,0.05)", color: "white", cursor: "pointer", fontWeight: "600" }}>{p.label}</button>
            ))}
          </div>
        </div>

        <div style={{ background: "#101626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px", marginTop: "16px" }}>
          <h3 style={{ margin: "0 0 12px" }}>🎯 Apna Countdown Banao</h3>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event ka naam - jaise Meri Shaadi" style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "#080b14", color: "white", outline: "none", boxSizing: "border-box", marginBottom: "12px" }} />
          <input type="datetime-local" value={customDate} onChange={e => setCustomDate(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "#080b14", color: "white", outline: "none", boxSizing: "border-box", colorScheme: "dark" }} />
          <button onClick={setCustom} style={{ width: "100%", padding: "16px", marginTop: "12px", borderRadius: "14px", border: "none", background: "linear-gradient(120deg,#8868ff,#6350d7)", color: "white", fontWeight: "900", fontSize: "16px", cursor: "pointer" }}>START COUNTDOWN 🚀</button>
        </div>

        <p style={{ textAlign: "center", color: "#77839a", fontSize: "12px", marginTop: "20px" }}>100% Free • No Sign-up • THE NEXORA TOOLS by Ayush Chauhan</p>
      </div>
    </div>
  );
}
