"use client";
import { useState, useEffect } from "react";

export default function SalaryCounterClient() {
  const [amount, setAmount] = useState(50000);
  const [fromUnit, setFromUnit] = useState("month");
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [currency, setCurrency] = useState("₹");
  const [now, setNow] = useState(new Date());
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(t);
  }, []);

  const yearly = fromUnit === "year" ? amount
    : fromUnit === "month" ? amount * 12
    : fromUnit === "week" ? amount * 52
    : fromUnit === "day" ? amount * daysPerWeek * 52
    : fromUnit === "hour" ? amount * hoursPerDay * daysPerWeek * 52
    : amount * 60 * hoursPerDay * daysPerWeek * 52;

  const totalHoursYear = hoursPerDay * daysPerWeek * 52;
  const perHour = totalHoursYear ? yearly / totalHoursYear : 0;
  const perMinute = perHour / 60;
  const perSecond = perHour / 3600;
  const perDay = perHour * hoursPerDay;
  const perWeek = perDay * daysPerWeek;
  const perMonth = yearly / 12;

  // Aaj kitna kamaya - subah 9 baje se maan ke
  const startOfDay = new Date(now); startOfDay.setHours(9, 0, 0, 0);
  const secondsToday = Math.max(0, (now.getTime() - startOfDay.getTime()) / 1000);
  const earnedToday = secondsToday * perSecond;

  // Is mahine me kitna - 1 tarikh se
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysPassed = Math.max(1, now.getDate() - 1 + now.getHours() / 24);
  const earnedMonth = (perMonth / 30) * daysPassed;

  const fmt = (n: number, dec = 0) => currency + n.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });

  const unitBtn = (unit: string, label: string) => (
    <button onClick={() => setFromUnit(unit)} style={{ padding: "11px 6px", borderRadius: "12px", border: "none", background: fromUnit === unit ? "#51e1d0" : "rgba(255,255,255,0.07)", color: fromUnit === unit ? "black" : "white", fontWeight: "800", fontSize: "11px", cursor: "pointer", flex: 1 }}>{label}</button>
  );

  const card = (label: string, val: string, sub: string, color: string) => (
    <div style={{ background: "#101626", border: `1px solid ${color}44`, borderRadius: "18px", padding: "16px", textAlign: "center" }}>
      <div style={{ fontSize: "11px", letterSpacing: "1px", color: "#9ba7bd", fontWeight: "700" }}>{label}</div>
      <div style={{ fontSize: "20px", fontWeight: "900", color: color, margin: "6px 0 3px" }}>{val}</div>
      <div style={{ fontSize: "11px", color: "#77839a" }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080b14", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", fontSize: "32px", fontWeight: "900", margin: "8px 0 4px" }}>💸 Live Salary Counter</h1>
        <p style={{ textAlign: "center", color: "#9ba7bd", margin: "0 0 20px" }}>Dekho tum har second kitne paise kama rahe ho - LIVE!</p>

        <div style={{ background: "linear-gradient(135deg,#171b35,#0f2a2a)", border: "1px solid rgba(81,225,208,0.4)", borderRadius: "24px", padding: "24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "#FF3B30", color: "white", padding: "5px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: "900" }}>● LIVE</div>
          <div style={{ fontSize: "12px", color: "#9ba7bd", marginTop: "12px", letterSpacing: "1px" }}>AAJ AB TAK KAMA LIYE</div>
          <div style={{ fontSize: "46px", fontWeight: "900", color: "#51e1d0", lineHeight: 1.2 }}>{fmt(earnedToday, 2)}</div>
          <div style={{ fontSize: "13px", color: "#9ba7bd", marginTop: "6px" }}>Har second + {fmt(perSecond, 3)} badh raha hai 💰</div>
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: "14px", padding: "12px" }}><div style={{ fontSize: "11px", color: "#9ba7bd" }}>IS MAHINE</div><b style={{ fontSize: "18px" }}>{fmt(earnedMonth)}</b></div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: "14px", padding: "12px" }}><div style={{ fontSize: "11px", color: "#9ba7bd" }}>PER HOUR</div><b style={{ fontSize: "18px", color: "#FACC15" }}>{fmt(perHour)}</b></div>
          </div>
          {!started && <button onClick={() => setStarted(true)} style={{ marginTop: "16px", padding: "13px 24px", borderRadius: "50px", border: "none", background: "#51e1d0", fontWeight: "900", cursor: "pointer" }}>▶️ COUNTER START KARO</button>}
        </div>

        <div style={{ background: "#101626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "20px", marginTop: "16px" }}>
          <label style={{ fontSize: "13px", color: "#9ba7bd", fontWeight: "700" }}>TERI SALARY KITNI HAI?</label>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {["₹", "$", "€", "£"].map(c => <button key={c} onClick={() => setCurrency(c)} style={{ width: "42px", height: "52px", borderRadius: "12px", border: "none", background: currency === c ? "#9275ff" : "rgba(255,255,255,0.07)", color: "white", fontWeight: "900", fontSize: "18px", cursor: "pointer" }}>{c}</button>)}
            </div>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value) || 0)} style={{ flex: 1, padding: "14px", fontSize: "22px", fontWeight: "900", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: "#080b14", color: "white", outline: "none" }} />
          </div>
          <label style={{ fontSize: "13px", color: "#9ba7bd", fontWeight: "700", display: "block", marginTop: "16px" }}>YE SALARY KIS HISAB SE HAI?</label>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
            {unitBtn("minute", "PER MINUTE")}{unitBtn("hour", "PER HOUR")}{unitBtn("day", "PER DAY")}{unitBtn("week", "PER WEEK")}{unitBtn("month", "PER MONTH")}{unitBtn("year", "PER YEAR")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
            <div><label style={{ fontSize: "13px", color: "#9ba7bd" }}>Din me kitne ghante? <b style={{ color: "white" }}>{hoursPerDay} hrs</b></label><input type="range" min={1} max={16} value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))} style={{ width: "100%", accentColor: "#51e1d0" }} /></div>
            <div><label style={{ fontSize: "13px", color: "#9ba7bd" }}>Hafte me kitne din? <b style={{ color: "white" }}>{daysPerWeek} days</b></label><input type="range" min={1} max={7} value={daysPerWeek} onChange={e => setDaysPerWeek(Number(e.target.value))} style={{ width: "100%", accentColor: "#9275ff" }} /></div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "16px" }}>
          {card("⏱️ PER SECOND", fmt(perSecond, 3), "Har second", "#FF9F43")}
          {card("⏰ PER MINUTE", fmt(perMinute, 2), "Har minute", "#51e1d0")}
          {card("💵 PER HOUR", fmt(perHour), `${hoursPerDay} hrs / day`, "#FACC15")}
          {card("📅 PER DAY", fmt(perDay), "1 din ka", "#9275ff")}
          {card("📆 PER WEEK", fmt(perWeek), `${daysPerWeek} din`, "#4ADE80")}
          {card("🗓️ PER MONTH", fmt(perMonth), "Mahina", "#FF6B6B")}
        </div>

        <div style={{ background: "rgba(81,225,208,0.08)", border: "1px solid rgba(81,225,208,0.25)", borderRadius: "16px", padding: "16px", marginTop: "16px", fontSize: "14px", lineHeight: "1.8", color: "#c8cfe0" }}>
          🧠 <b style={{ color: "white" }}>Samajh Le:</b> Tu 1 second me {fmt(perSecond, 2)} kamata hai. Matlab jab tak tu ye line padh raha hai, tab tak {fmt(perSecond * 5, 2)} kama liye! 😎
        </div>

        <p style={{ textAlign: "center", color: "#77839a", fontSize: "12px", marginTop: "16px" }}>100% Free • Live Counter • THE NEXORA TOOLS by Ayush Chauhan</p>
      </div>
    </div>
  );
}
