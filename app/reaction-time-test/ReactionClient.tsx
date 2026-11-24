"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "waiting" | "ready" | "result" | "tooSoon" | "finished";

const BEST_KEY = "nexora_reaction_best_v6";
const HISTORY_KEY = "nexora_reaction_history_v6";

export default function ReactionClient() {
  const [status, setStatus] = useState<Status>("idle");
  const [round, setRound] = useState(1);
  const [times, setTimes] = useState<number[]>([]);
  const [currentMs, setCurrentMs] = useState(0);
  const [best, setBest] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [inputType, setInputType] = useState("Mouse / Touch");
  const [attempts, setAttempts] = useState(0);

  const timeoutRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const statusRef = useRef<Status>("idle");
  const timesRef = useRef<number[]>([]);

  useEffect(() => {
    try {
      const b = localStorage.getItem(BEST_KEY);
      if (b) setBest(Number(b) || 0);
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) {
        const p = JSON.parse(h);
        if (Array.isArray(p)) setHistory(p.filter((v): v is number => typeof v === "number").slice(0, 5));
      }
    } catch {}
    return () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); };
  }, []);

  const clearTimer = () => {
    if (timeoutRef.current) { window.clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  };

  const startGame = useCallback(() => {
    clearTimer();
    timesRef.current = [];
    setTimes([]); setRound(1); setCurrentMs(0); setAttempts(0);
    statusRef.current = "waiting"; setStatus("waiting");
    const delay = 1500 + Math.random() * 3000;
    timeoutRef.current = window.setTimeout(() => {
      startRef.current = performance.now();
      statusRef.current = "ready"; setStatus("ready");
    }, delay);
  }, []);

  const nextRound = useCallback((ms: number) => {
    const newTimes = [...timesRef.current, ms];
    timesRef.current = newTimes;
    setTimes(newTimes); setCurrentMs(ms);
    if (newTimes.length >= 5) {
      const avg = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
      const bestInGame = Math.min(...newTimes);
      setBest((old) => {
        if (bestInGame < old || old === 0) {
          try { localStorage.setItem(BEST_KEY, String(Math.round(bestInGame))); } catch {}
          return Math.round(bestInGame);
        }
        return old;
      });
      setHistory((old) => {
        const next = [Math.round(avg), ...old].slice(0, 5);
        try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
      statusRef.current = "finished"; setStatus("finished");
    } else {
      setRound(newTimes.length + 1);
      statusRef.current = "waiting"; setStatus("waiting");
      const delay = 1500 + Math.random() * 3000;
      timeoutRef.current = window.setTimeout(() => {
        startRef.current = performance.now();
        statusRef.current = "ready"; setStatus("ready");
      }, delay);
    }
  }, []);

  const handleClick = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") setInputType("🖱️ Mouse");
    else if (e.pointerType === "touch") setInputType("📱 Touch");
    else setInputType("✏️ Pen");
    setAttempts((a) => a + 1);

    if (statusRef.current === "idle") { startGame(); return; }
    if (statusRef.current === "waiting") {
      clearTimer();
      statusRef.current = "tooSoon"; setStatus("tooSoon");
      return;
    }
    if (statusRef.current === "ready") {
      const ms = performance.now() - startRef.current;
      nextRound(Math.round(ms));
      return;
    }
    if (statusRef.current === "tooSoon") { startGame(); return; }
    if (statusRef.current === "finished") { startGame(); return; }
    if (statusRef.current === "result") { return; }
  };

  const getRank = (ms: number) => {
    if (ms < 180) return { icon: "⚡", title: "Pro Gamer Reflexes", desc: "Insane! Faster than 95% people. Pro esports level." };
    if (ms < 220) return { icon: "🔥", title: "Excellent Reflexes", desc: "Very fast! Top 15% me ho tum." };
    if (ms < 270) return { icon: "👍", title: "Good Reflexes", desc: "Average se better ho. World average 250ms hai." };
    if (ms < 350) return { icon: "🙂", title: "Average Reflexes", desc: "Normal hai. Practice se 220ms tak ja sakta hai." };
    return { icon: "🐢", title: "Slow Reflexes", desc: "Neend poori karo aur practice karo, improve ho jayega." };
  };

  const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  const bestInGame = times.length ? Math.min(...times) : 0;
  const rank = status === "finished" ? getRank(avg) : null;

  const getBoxColor = () => {
    if (status === "waiting") return "#dc2626";
    if (status === "ready") return "#22c55e";
    if (status === "tooSoon") return "#f59e0b";
    if (status === "finished") return "#22c55e";
    return "#172033";
  };

  return (
    <main className="page">
      <style jsx>{`
        .page{min-height:100vh;background:radial-gradient(circle at top,rgba(34,197,94,.07),transparent 34%),#070b14;color:#fff;padding:16px 12px 45px;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .wrap{width:100%;max-width:850px;margin:auto}
        .top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:22px}.logo{font-size:18px;font-weight:900}.logo span{color:#22c55e}
        .topBest{background:#111827;border:1px solid #263244;border-radius:999px;padding:7px 11px;font-size:11px;font-weight:800}.topBest b{color:#22c55e}
        .hero{text-align:center;margin-bottom:17px}.tag{display:inline-block;padding:5px 10px;border-radius:999px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);color:#86efac;font-size:10px;font-weight:900;margin-bottom:9px}
        h1{margin:0;font-size:clamp(27px,6vw,40px);line-height:1;letter-spacing:-1px}h1 span{color:#22c55e}
        .sub{color:#64748b;max-width:580px;margin:9px auto 0;font-size:12px;line-height:1.5}
        .rounds{display:flex;justify-content:center;gap:8px;margin-bottom:10px}.dot{width:32px;height:32px;border-radius:50%;background:#1e293b;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;border:1px solid #334155}.dot.done{background:#22c55e;color:#031108;border-color:#22c55e}.dot.active{background:#fff;color:#000}
        .box{min-height:300px;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:manipulation;padding:20px}
        .big{font-size:clamp(40px,10vw,68px);font-weight:950;line-height:1}.small{margin-top:10px;font-size:14px;font-weight:700;color:rgba(255,255,255,.8)}
        .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}.stat{background:#111827;border:1px solid #202c3e;border-radius:14px;padding:12px 5px;text-align:center}.value{display:block;color:#22c55e;font-size:20px;font-weight:950}.label{display:block;margin-top:6px;color:#64748b;font-size:9px;font-weight:900}
        .panel{margin-top:10px;background:#111827;border:1px solid #202c3e;border-radius:15px;padding:14px}.panelTitle{font-size:12px;font-weight:950}
        .bars{margin-top:10px;display:flex;flex-direction:column;gap:8px}.barRow{display:flex;align-items:center;gap:10px;font-size:11px;font-weight:800}.barRow span:first-child{width:50px}.barTrack{flex:1;height:12px;background:#0b1220;border-radius:999px;overflow:hidden}.barFill{height:100%;background:#22c55e}
        .result{margin-top:10px;background:#111827;border:2px solid #22c55e;border-radius:16px;padding:18px;text-align:center}.resultScore{color:#22c55e;font-size:48px;font-weight:950;line-height:1}.rank{font-size:20px;font-weight:950;margin-top:12px}.rankDesc{color:#94a3b8;font-size:12px;margin-top:5px}
        .buttons{display:flex;justify-content:center;gap:8px;margin-top:14px}button.action{border:0;border-radius:999px;padding:11px 22px;font-size:12px;font-weight:950;cursor:pointer}.green{background:#22c55e;color:#031108}.gray{background:#1e293b;color:#fff;border:1px solid #334155}
        .content{margin-top:20px;background:#111827;border:1px solid #202c3e;border-radius:16px;padding:17px}.content h2{margin:0 0 8px;font-size:17px}.content h3{margin:15px 0 5px;font-size:13px}.content p,.content li{color:#64748b;font-size:11px;line-height:1.65}
        .footer{text-align:center;margin-top:18px;color:#334155;font-size:9px}
        @media(max-width:620px){.stats{grid-template-columns:repeat(2,1fr)}.box{min-height:270px}}
      `}</style>
      <div className="wrap">
        <header className="top"><div className="logo">NEXORA <span>TOOLS</span></div><div className="topBest">🏆 Best <b>{best ? `${best}ms` : "—"}</b></div></header>
        <section className="hero"><div className="tag">⚡ FREE • 5 ROUNDS • NO SIGN UP</div><h1>Reaction Time Test — <span>How Fast Are You?</span></h1><p className="sub">Wait for green, then click as fast as you can. 5 rounds ka average hi tera asli reaction time hai.</p></section>

        <div className="rounds">{[1, 2, 3, 4, 5].map((r) => (<div key={r} className={`dot ${times.length >= r ? "done" : round === r && status !== "idle" && status !== "finished" ? "active" : ""}`}>{times.length >= r ? "✓" : r}</div>))}</div>

        <div className="box" style={{ background: getBoxColor() }} onPointerDown={handleClick}>
          {status === "idle" && (<><div className="big">👆 CLICK TO START</div><div className="small">5 Rounds • Wait for GREEN</div></>)}
          {status === "waiting" && (<><div className="big">⏳ WAIT FOR GREEN...</div><div className="small">Round {round} / 5 • Jaldi click kiya to Too Soon!</div></>)}
          {status === "ready" && (<><div className="big">🟢 CLICK NOW!</div><div className="small">As fast as you can!</div></>)}
          {status === "tooSoon" && (<><div className="big">⚠️ TOO SOON!</div><div className="small">Tu green se pehle click kar diya. Fir se click karke restart kar.</div></>)}
          {status === "finished" && (<><div className="big">🎉 {Math.round(avg)}ms</div><div className="small">Average Reaction Time • Tap to Play Again</div></>)}
          {status === "result" && (<><div className="big">{currentMs}ms</div></>)}
        </div>

        <div className="stats">
          <div className="stat"><span className="value">{times.length ? `${Math.round(avg)}ms` : "—"}</span><span className="label">AVERAGE</span></div>
          <div className="stat"><span className="value">{bestInGame ? `${bestInGame}ms` : "—"}</span><span className="label">BEST THIS GAME</span></div>
          <div className="stat"><span className="value">{best ? `${best}ms` : "—"}</span><span className="label">ALL TIME BEST</span></div>
          <div className="stat"><span className="value">{inputType}</span><span className="label">DEVICE</span></div>
        </div>

        {times.length > 0 && (
          <section className="panel"><div className="panelTitle">📊 Round Results</div><div className="bars">{times.map((t, i) => (<div key={i} className="barRow"><span>Round {i + 1}</span><div className="barTrack"><div className="barFill" style={{ width: `${Math.min(100, (t / 500) * 100)}%`, background: t < 220 ? "#22c55e" : t < 300 ? "#f59e0b" : "#ef4444" }} /></div><span>{t}ms</span></div>))}</div></section>
        )}

        {status === "finished" && rank && (
          <section className="result"><div className="resultScore">{Math.round(avg)}ms</div><div style={{ color: "#64748b", fontSize: 10, fontWeight: 900, marginTop: 4 }}>AVERAGE REACTION TIME • BEST {bestInGame}ms</div><div className="rank">{rank.icon} {rank.title}</div><p className="rankDesc">{rank.desc}</p><div className="buttons"><button className="action green" onClick={startGame}>↻ Play Again</button><button className="action gray" onClick={() => { navigator.clipboard.writeText(`My reaction time is ${Math.round(avg)}ms on NEXORA Reaction Test. Can you beat me? https://thenexoratools.com/reaction-time-test`); window.alert("Copied!"); }}>📤 Share</button></div></section>
        )}

        {history.length > 0 && (<section className="panel" style={{ textAlign: "center" }}><div className="panelTitle">LAST 5 AVERAGES</div><div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", marginTop: 8 }}>{history.map((h, i) => (<span key={i} style={{ background: "#0b1220", border: "1px solid #253247", borderRadius: 999, padding: "6px 10px", fontSize: 10, fontWeight: 900 }}>{h}ms</span>))}</div></section>)}

        <section className="content"><h2>What is Reaction Time?</h2><p>Reaction time is how long your brain takes to see something and react. Average human reaction time is around 250ms. Pro gamers are often below 180ms.</p><h3>How to improve?</h3><p>Sleep well, stay hydrated, practice daily, and keep your hand relaxed on mouse.</p></section>
        <footer className="footer">© {new Date().getFullYear()} NEXORA Tools • Attempts: {attempts}</footer>
      </div>
    </main>
  );
}
