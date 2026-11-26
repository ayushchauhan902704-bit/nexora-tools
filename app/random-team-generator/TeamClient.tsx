"use client";
import { useState } from "react";

const SAMPLE = `Ayush
Rahul
Priya
Aman
Sneha
Vikash
Riya
Arjun
Pooja
Karan
Anjali
Rohan`;

const COLORS = ["#9275ff", "#51e1d0", "#FACC15", "#FF6B6B", "#FF9F43", "#4ADE80", "#F472B6", "#60A5FA"];

export default function TeamClient() {
  const [namesText, setNamesText] = useState(SAMPLE);
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [copied, setCopied] = useState(false);
  const [shuffling, setShuffling] = useState(false);

  const names = namesText.split("\n").map(n => n.trim()).filter(Boolean);

  const generate = () => {
    if (names.length < 2) { alert("Kam se kam 2 naam daalo bhai!"); return; }
    if (teamCount < 2) { alert("Kam se kam 2 team chahiye!"); return; }
    setShuffling(true);
    let c = 0;
    const iv = setInterval(() => {
      const shuffled = [...names].sort(() => Math.random() - 0.5);
      const t: string[][] = Array.from({ length: teamCount }, () => []);
      shuffled.forEach((n, i) => t[i % teamCount].push(n));
      setTeams(t);
      c++;
      if (c > 8) { clearInterval(iv); setShuffling(false); }
    }, 90);
  };

  const copyAll = async () => {
    const txt = teams.map((t, i) => `Team ${i + 1} (${COLORS[i % COLORS.length]}):\n${t.map(n => "• " + n).join("\n")}`).join("\n\n");
    try { await navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { alert(txt); }
  };

  const clearAll = () => { setNamesText(""); setTeams([]); };

  return (
    <div style={{ minHeight: "100vh", background: "#080b14", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: "34px", fontWeight: "900", margin: "10px 0 6px" }}>👥 Random Team Generator</h1>
        <p style={{ textAlign: "center", color: "#9ba7bd", margin: "0 0 22px" }}>Cricket, Football, BGMI, School, Office - Sabke liye fair teams!</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "#101626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 10px" }}>1️⃣ Naam Daalo <span style={{ float: "right", color: "#51e1d0", fontSize: "13px" }}>{names.length} Players</span></h3>
            <textarea value={namesText} onChange={e => setNamesText(e.target.value)} placeholder={"Ek line me ek naam...\nAyush\nRahul\nPriya"} style={{ width: "100%", height: "220px", background: "#080b14", color: "white", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "14px", padding: "14px", outline: "none", resize: "none", boxSizing: "border-box", lineHeight: "1.7" }} />
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <button onClick={() => setNamesText(SAMPLE)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "white", cursor: "pointer" }}>Sample Lo</button>
              <button onClick={clearAll} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "#FF6B6B", cursor: "pointer" }}>Clear</button>
            </div>
          </div>

          <div style={{ background: "#101626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 10px" }}>2️⃣ Kitni Teams?</h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[2, 3, 4, 5, 6, 8].map(n => (
                <button key={n} onClick={() => setTeamCount(n)} style={{ width: "52px", height: "52px", borderRadius: "14px", border: "none", fontWeight: "900", fontSize: "18px", cursor: "pointer", background: teamCount === n ? "#9275ff" : "rgba(255,255,255,0.07)", color: "white" }}>{n}</button>
              ))}
            </div>
            <div style={{ marginTop: "14px" }}>
              <label style={{ fontSize: "13px", color: "#9ba7bd" }}>Custom: {teamCount} Teams</label>
              <input type="range" min={2} max={10} value={teamCount} onChange={e => setTeamCount(Number(e.target.value))} style={{ width: "100%", marginTop: "8px", accentColor: "#9275ff" }} />
            </div>
            <div style={{ background: "rgba(146,117,255,0.12)", border: "1px solid rgba(146,117,255,0.3)", borderRadius: "12px", padding: "12px", marginTop: "14px", fontSize: "13px", color: "#c8bcff" }}>
              👉 {names.length} players ÷ {teamCount} teams = Har team me lagbhag <b style={{ color: "white" }}>{names.length ? Math.ceil(names.length / teamCount) : 0} players</b> aayenge.
            </div>
            <button onClick={generate} style={{ width: "100%", padding: "16px", marginTop: "14px", borderRadius: "14px", border: "none", background: "linear-gradient(120deg,#8868ff,#6350d7)", color: "white", fontWeight: "900", fontSize: "16px", cursor: "pointer" }}>{shuffling ? "🎲 SHUFFLING..." : "🎲 TEAMS BANAO"}</button>
          </div>
        </div>

        {teams.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0 }}>🏆 Teri Teams Ready Hain!</h2>
              <button onClick={copyAll} style={{ padding: "10px 16px", borderRadius: "10px", border: "none", background: "#FACC15", fontWeight: "800", cursor: "pointer" }}>{copied ? "✅ Copied!" : "📋 Copy All"}</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "14px", marginTop: "14px" }}>
              {teams.map((team, i) => (
                <div key={i} style={{ background: "#101626", border: `1px solid ${COLORS[i % COLORS.length]}55`, borderRadius: "18px", padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <b style={{ color: COLORS[i % COLORS.length] }}>Team {i + 1}</b>
                    <span style={{ background: COLORS[i % COLORS.length], color: "#080b14", padding: "3px 9px", borderRadius: "50px", fontSize: "11px", fontWeight: "900" }}>{team.length} Players</span>
                  </div>
                  <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {team.map((n, j) => (
                      <div key={j} style={{ background: "rgba(255,255,255,0.06)", padding: "9px 12px", borderRadius: "10px", fontSize: "14px" }}>👤 {n}</div>
                    ))}
                    {team.length === 0 && <p style={{ color: "#77839a", fontSize: "13px" }}>Koi nahi aaya is team me</p>}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={generate} style={{ width: "100%", padding: "14px", marginTop: "16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "white", fontWeight: "800", cursor: "pointer" }}>🔄 Phir Se Shuffle Karo</button>
          </div>
        )}

        <p style={{ textAlign: "center", color: "#77839a", fontSize: "12px", marginTop: "22px" }}>100% Fair • 100% Random • No Sign-up • THE NEXORA TOOLS by Ayush Chauhan</p>
      </div>
    </div>
  );
}
