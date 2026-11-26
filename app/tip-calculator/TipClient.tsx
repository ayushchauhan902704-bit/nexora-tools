"use client";
import { useState } from "react";

export default function TipClient() {
  const [bill, setBill] = useState(100);
  const [tipPercent, setTipPercent] = useState(20);
  const [people, setPeople] = useState(2);
  const [currency, setCurrency] = useState("$");
  const [rating, setRating] = useState("Great 😍");

  const tipAmount = (bill * tipPercent) / 100;
  const total = bill + tipAmount;
  const perPerson = people ? total / people : 0;
  const tipPerPerson = people ? tipAmount / people : 0;

  const fmt = (n: number) => currency + n.toFixed(2);

  const setTipWithRating = (p: number, r: string) => { setTipPercent(p); setRating(r); };

  return (
    <div style={{ minHeight: "100vh", background: "#080b14", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: "32px", fontWeight: "900", margin: "8px 0 4px" }}>💵 Tip Calculator</h1>
        <p style={{ textAlign: "center", color: "#9ba7bd", margin: "0 0 20px" }}>USA Restaurant me kitni Tip deni hai? Ab confuse mat ho!</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "#101626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px" }}>
            <label style={{ fontSize: "13px", color: "#9ba7bd", fontWeight: "700" }}>🧾 BILL KITNA AAYA?</label>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              {["$", "₹", "€", "£"].map(c => <button key={c} onClick={() => setCurrency(c)} style={{ width: "44px", height: "52px", borderRadius: "12px", border: "none", background: currency === c ? "#51e1d0" : "rgba(255,255,255,0.07)", color: currency === c ? "black" : "white", fontWeight: "900", fontSize: "18px", cursor: "pointer" }}>{c}</button>)}
              <input type="number" value={bill} onChange={e => setBill(Number(e.target.value) || 0)} style={{ flex: 1, padding: "12px", fontSize: "24px", fontWeight: "900", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: "#080b14", color: "white", outline: "none" }} />
            </div>

            <label style={{ fontSize: "13px", color: "#9ba7bd", fontWeight: "700", display: "block", marginTop: "18px" }}>⭐ SERVICE KAISI THI? - TIP %</label>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
              {[
                { p: 10, r: "Thik Thak 😐", c: "#FF9F43" },
                { p: 15, r: "Achhi Thi 🙂", c: "#FACC15" },
                { p: 18, r: "Bahut Achhi 😊", c: "#4ADE80" },
                { p: 20, r: "Great 😍", c: "#51e1d0" },
                { p: 25, r: "Amazing 🤩", c: "#9275ff" },
              ].map(t => (
                <button key={t.p} onClick={() => setTipWithRating(t.p, t.r)} style={{ flex: 1, padding: "12px 6px", borderRadius: "12px", border: "none", background: tipPercent === t.p ? t.c : "rgba(255,255,255,0.07)", color: tipPercent === t.p ? "black" : "white", fontWeight: "900", cursor: "pointer" }}>{t.p}%</button>
              ))}
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={{ fontSize: "13px", color: "#9ba7bd" }}>Custom Tip: <b style={{ color: "white" }}>{tipPercent}% - {rating}</b></label>
              <input type="range" min={0} max={50} value={tipPercent} onChange={e => { setTipPercent(Number(e.target.value)); setRating("Custom ✍️"); }} style={{ width: "100%", accentColor: "#51e1d0" }} />
            </div>

            <label style={{ fontSize: "13px", color: "#9ba7bd", fontWeight: "700", display: "block", marginTop: "14px" }}>👥 KITNE LOGO ME SPLIT KARNA HAI?</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "10px" }}>
              <button onClick={() => setPeople(Math.max(1, people - 1))} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.1)", color: "white", fontSize: "22px", cursor: "pointer" }}>-</button>
              <div style={{ flex: 1, textAlign: "center", background: "#080b14", padding: "12px", borderRadius: "12px", fontWeight: "900", fontSize: "18px" }}>{people} {people === 1 ? "Person" : "People"}</div>
              <button onClick={() => setPeople(people + 1)} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "none", background: "#51e1d0", color: "black", fontSize: "22px", fontWeight: "900", cursor: "pointer" }}>+</button>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
              {[50, 100, 200].map(v => <button key={v} onClick={() => setBill(v)} style={{ flex: 1, padding: "9px", borderRadius: "50px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "white", cursor: "pointer" }}>${v} Bill</button>)}
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg,#171b35,#0f2a2a)", border: "1px solid rgba(81,225,208,0.35)", borderRadius: "20px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 16px", textAlign: "center" }}>💰 Result</h3>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}><span style={{ color: "#9ba7bd" }}>Bill Amount</span><b>{fmt(bill)}</b></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}><span style={{ color: "#9ba7bd" }}>Tip ({tipPercent}%)</span><b style={{ color: "#51e1d0" }}>{fmt(tipAmount)}</b></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.1)", fontSize: "18px" }}><span>Total To Pay</span><b style={{ fontSize: "22px" }}>{fmt(total)}</b></div>
            <div style={{ background: "#51e1d0", color: "black", borderRadius: "14px", padding: "16px", textAlign: "center", marginTop: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700" }}>HAR BANDE KO DENA HAI</div>
              <div style={{ fontSize: "34px", fontWeight: "900" }}>{fmt(perPerson)}</div>
              <div style={{ fontSize: "12px" }}>Isme Tip {fmt(tipPerPerson)} shamil hai</div>
            </div>
            <p style={{ textAlign: "center", fontSize: "13px", color: "#c8cfe0", margin: "14px 0 0", lineHeight: "1.6" }}>
              {people > 1 ? `Agar ${people} dost ho, to har koi ${fmt(perPerson)} dega.` : `Akela hai to pura ${fmt(total)} tujhe hi dena hai 😅`}
              <br />Service: <b style={{ color: "white" }}>{rating}</b>
            </p>
          </div>
        </div>

        <div style={{ background: "#101626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "16px", marginTop: "16px" }}>
          <h3 style={{ margin: "0 0 8px" }}>🇺🇸 USA Me Tip Ka Rule:</h3>
          <p style={{ margin: 0, color: "#9ba7bd", fontSize: "14px", lineHeight: "1.8" }}>
            • <b style={{ color: "white" }}>10% =</b> Service kharab thi &nbsp; • <b style={{ color: "white" }}>15% =</b> Normal service<br />
            • <b style={{ color: "white" }}>20% =</b> Achhi service - Sabse common &nbsp; • <b style={{ color: "white" }}>25%+ =</b> Ekdum VIP service
          </p>
        </div>

        <p style={{ textAlign: "center", color: "#77839a", fontSize: "12px", marginTop: "16px" }}>100% Free • No Sign-up • THE NEXORA TOOLS by Ayush Chauhan</p>
      </div>
    </div>
  );
}
