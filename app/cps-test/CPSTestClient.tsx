"use client";

import { PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "running" | "done";
type Mode = "time" | "target";
type Ripple = { id: number; x: number; y: number };

const DURATIONS = [1, 5, 10, 30, 60];
const PB_KEY = "nexora_cps_pb_v6";
const HISTORY_KEY = "nexora_cps_history_v6";

export default function CPSTestClient() {
  const [mode, setMode] = useState<Mode>("time");
  const [duration, setDuration] = useState(5);
  const [customTime, setCustomTime] = useState(5);
  const [targetClicks] = useState(100);
  const [status, setStatus] = useState<Status>("idle");
  const [clicks, setClicks] = useState(0);
  const [cps, setCps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [elapsedFinal, setElapsedFinal] = useState(0);
  const [best, setBest] = useState(0);
  const [bestByTime, setBestByTime] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<number[]>([]);
  const [graph, setGraph] = useState<number[]>([]);
  const [peak, setPeak] = useState(0);
  const [consistency, setConsistency] = useState(0);
  const [intervalMs, setIntervalMs] = useState(0);
  const [sound, setSound] = useState(false);
  const [inputType, setInputType] = useState("Mouse / Touch");
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const statusRef = useRef<Status>("idle");
  const durationRef = useRef(5);
  const modeRef = useRef<Mode>("time");
  const clicksRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const clickTimesRef = useRef<number[]>([]);
  const animationRef = useRef<number | null>(null);
  const graphRef = useRef<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const finishRef = useRef<() => void>(() => {});

  const stopTimers = useCallback(() => {
    if (animationRef.current !== null) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
    if (graphRef.current !== null) { window.clearInterval(graphRef.current); graphRef.current = null; }
  }, []);

  useEffect(() => {
    try {
      const pb = localStorage.getItem(PB_KEY);
      if (pb) {
        const parsed = JSON.parse(pb);
        if (parsed && typeof parsed === "object") {
          setBestByTime(parsed);
          const vals = Object.values(parsed).filter((v): v is number => typeof v === "number");
          if (vals.length) setBest(Math.max(...vals));
        }
      }
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) {
        const parsed = JSON.parse(h);
        if (Array.isArray(parsed)) setHistory(parsed.filter((v): v is number => typeof v === "number").slice(0, 10));
      }
    } catch {}
    return () => { stopTimers(); try { audioRef.current?.close(); } catch {} };
  }, [stopTimers]);

  const clickSound = useCallback(() => {
    if (!sound) return;
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      const ctx = audioRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = 520; o.type = "sine";
      g.gain.setValueAtTime(0.035, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.04);
    } catch {}
  }, [sound]);

  const calcStats = useCallback((times: number[]) => {
    if (times.length < 2 || startRef.current === null) return { peak: 0, consistency: 100, interval: 0 };
    let peakV = 0;
    for (let i = 0; i < times.length; i++) {
      let c = 0;
      for (let j = i; j < times.length; j++) { if (times[j] - times[i] <= 1000) c++; else break; }
      if (c > peakV) peakV = c;
    }
    const gaps = [];
    for (let i = 1; i < times.length; i++) gaps.push(times[i] - times[i - 1]);
    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const variance = gaps.reduce((s, g) => s + Math.pow(g - avgGap, 2), 0) / gaps.length;
    const dev = Math.sqrt(variance);
    const cons = Math.max(0, Math.min(100, 100 - (dev / Math.max(avgGap, 1)) * 100));
    return { peak: peakV, consistency: cons, interval: avgGap };
  }, []);

  const saveResult = useCallback((score: number) => {
    const rounded = Number(score.toFixed(2));
    const key = modeRef.current === "time" ? `${durationRef.current}s` : "100clicks";
    setBestByTime((old) => {
      const next = { ...old, [key]: Math.max(old[key] || 0, rounded) };
      try { localStorage.setItem(PB_KEY, JSON.stringify(next)); } catch {}
      setBest(Math.max(0, ...Object.values(next)));
      return next;
    });
    setHistory((old) => {
      const next = [rounded, ...old].slice(0, 10);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const finishTest = useCallback(() => {
    if (statusRef.current !== "running" || startRef.current === null) return;
    stopTimers();
    const elapsed = (performance.now() - startRef.current) / 1000;
    const finalCPS = modeRef.current === "time" ? clicksRef.current / durationRef.current : clicksRef.current / Math.max(elapsed, 0.01);
    const st = calcStats(clickTimesRef.current);
    setCps(finalCPS); setPeak(st.peak); setConsistency(st.consistency); setIntervalMs(st.interval);
    setElapsedFinal(elapsed); setTimeLeft(0); setStatus("done"); statusRef.current = "done";
    saveResult(finalCPS);
  }, [calcStats, saveResult, stopTimers]);

  useEffect(() => { finishRef.current = finishTest; }, [finishTest]);

  const updateTimer = useCallback(() => {
    if (statusRef.current !== "running" || startRef.current === null) return;
    const elapsed = (performance.now() - startRef.current) / 1000;
    const remaining = Math.max(0, durationRef.current - elapsed);
    const live = elapsed > 0 ? clicksRef.current / elapsed : 0;
    setTimeLeft(remaining); setCps(live);
    if (modeRef.current === "time" && remaining <= 0) { finishRef.current(); return; }
    if (modeRef.current === "target" && clicksRef.current >= 100) { finishRef.current(); return; }
    animationRef.current = requestAnimationFrame(updateTimer);
  }, []);

  const startTest = useCallback(() => {
    stopTimers();
    clicksRef.current = 0; clickTimesRef.current = []; startRef.current = performance.now();
    statusRef.current = "running";
    setStatus("running"); setClicks(0); setCps(0); setPeak(0); setConsistency(0); setIntervalMs(0); setGraph([]); setTimeLeft(durationRef.current);
    graphRef.current = window.setInterval(() => {
      if (statusRef.current !== "running" || startRef.current === null) return;
      const elapsed = (performance.now() - startRef.current) / 1000;
      const live = elapsed > 0 ? clicksRef.current / elapsed : 0;
      setGraph((o) => [...o.slice(-44), live]);
    }, 150);
    animationRef.current = requestAnimationFrame(updateTimer);
  }, [stopTimers, updateTimer]);

  const resetTest = useCallback(() => {
    stopTimers(); clicksRef.current = 0; clickTimesRef.current = []; startRef.current = null; statusRef.current = "idle";
    setStatus("idle"); setClicks(0); setCps(0); setGraph([]); setRipples([]); setTimeLeft(durationRef.current);
  }, [stopTimers]);

  const changeDuration = useCallback((s: number) => {
    if (statusRef.current === "running") return;
    stopTimers(); durationRef.current = s; startRef.current = null; statusRef.current = "idle";
    setDuration(s); setCustomTime(s); setStatus("idle"); setClicks(0); setCps(0); setGraph([]); setTimeLeft(s);
  }, [stopTimers]);

  const changeMode = useCallback((m: Mode) => {
    if (statusRef.current === "running") return;
    modeRef.current = m; setMode(m); resetTest();
  }, [resetTest]);

  const handleClick = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") setInputType("🖱️ Mouse");
    else if (e.pointerType === "touch") setInputType("📱 Touch");
    else setInputType("✏️ Pen");
    if (statusRef.current === "done") { resetTest(); return; }
    if (statusRef.current === "idle") startTest();
    const now = performance.now();
    clicksRef.current += 1; clickTimesRef.current.push(now);
    setClicks(clicksRef.current); clickSound();
    const rect = e.currentTarget.getBoundingClientRect();
    const r: Ripple = { id: Date.now() + Math.random(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples((o) => [...o.slice(-6), r]);
    setTimeout(() => setRipples((o) => o.filter((x) => x.id !== r.id)), 500);
    if (startRef.current !== null) { const st = calcStats(clickTimesRef.current); setPeak(st.peak); setConsistency(st.consistency); setIntervalMs(st.interval); }
  };

  const shareResult = async () => {
    const text = `I scored ${cps.toFixed(2)} CPS (Peak ${peak.toFixed(1)}, Consistency ${consistency.toFixed(0)}%) on NEXORA CPS Test. Can you beat me?`;
    try {
      if (navigator.share) await navigator.share({ title: "NEXORA CPS Test", text, url: window.location.href });
      else { await navigator.clipboard.writeText(`${text} ${window.location.href}`); window.alert("Result copied!"); }
    } catch {}
  };

  const getRank = (s: number) => {
    if (s >= 20) return { icon: "🚨", title: "Suspicious - Possible Auto Clicker", desc: "20+ CPS is extremely rare for human clicking. This may be auto-clicker." };
    if (s < 4) return { icon: "🐢", title: "Getting Started", desc: "Keep practicing, relaxed hand is key." };
    if (s < 6) return { icon: "👍", title: "Good Clicker", desc: "Solid speed. You are above average." };
    if (s < 8) return { icon: "🔥", title: "Fast Clicker", desc: "Excellent! You are faster than most players." };
    if (s < 10) return { icon: "⚡", title: "Elite Clicker", desc: "Top level speed. Pro gamers zone." };
    return { icon: "👑", title: "Insane Clicker", desc: "Outstanding! You are in top 1% clickers." };
  };

  const getWorldRank = (s: number) => {
    if (s < 3) return "Bottom 30% - World Average is 6.5 CPS";
    if (s < 5) return "Top 65% - Close to World Average";
    if (s < 6.5) return "Top 50% - Around World Average (6.5 CPS)";
    if (s < 8) return "Top 25% - Faster than 75% people!";
    if (s < 10) return "Top 10% - Elite Zone!";
    return "Top 1% - World Class!";
  };

  const rank = status === "done" ? getRank(cps) : null;
  const progress = status === "idle" ? 0 : mode === "time" ? Math.min(100, ((duration - timeLeft) / duration) * 100) : Math.min(100, (clicks / 100) * 100);
  const currentPB = bestByTime[mode === "time" ? `${duration}s` : "100clicks"] || 0;

  return (
    <main className="page">
      <style jsx>{`
        .page{min-height:100vh;background:radial-gradient(circle at top,rgba(34,197,94,.07),transparent 34%),#070b14;color:#fff;padding:16px 12px 45px;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .wrap{width:100%;max-width:850px;margin:auto}
        .top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:22px}
        .logo{font-size:18px;font-weight:900}.logo span{color:#22c55e}
        .topBest{background:#111827;border:1px solid #263244;border-radius:999px;padding:7px 11px;font-size:11px;font-weight:800}.topBest b{color:#22c55e}
        .hero{text-align:center;margin-bottom:17px}
        .tag{display:inline-block;padding:5px 10px;border-radius:999px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);color:#86efac;font-size:10px;font-weight:900;margin-bottom:9px}
        h1{margin:0;font-size:clamp(27px,6vw,40px);line-height:1;letter-spacing:-1px}h1 span{color:#22c55e}
        .sub{color:#64748b;max-width:580px;margin:9px auto 0;font-size:12px;line-height:1.5}
        .modeRow{display:flex;justify-content:center;gap:8px;margin-bottom:10px}.modeBtn{border:1px solid #293548;background:#111827;color:#94a3b8;border-radius:999px;padding:9px 18px;font-size:12px;font-weight:900;cursor:pointer}.modeBtn.active{background:#fff;color:#000;border-color:#fff}
        .durations{display:flex;justify-content:center;flex-wrap:wrap;gap:7px;margin-bottom:10px}.duration{border:1px solid #293548;background:#111827;color:#94a3b8;border-radius:999px;padding:8px 15px;font-size:11px;font-weight:900;cursor:pointer}.duration.active{background:#22c55e;border-color:#22c55e;color:#031108}.duration:disabled{opacity:.55}
        .custom{background:#111827;border:1px solid #202c3e;border-radius:14px;padding:12px;margin-bottom:10px;text-align:center}.custom label{font-size:11px;font-weight:900;color:#94a3b8}.custom input{width:100%;margin-top:8px;accent-color:#22c55e}
        .clickArea{position:relative;min-height:285px;width:100%;border:2px solid #263244;border-radius:20px;background:linear-gradient(145deg,#172033,#0e1625);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;overflow:hidden;cursor:pointer;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
        .clickArea.running{border-color:#0ea5e9;background:linear-gradient(145deg,#075985,#0e3a57)}.clickArea.done{border-color:#22c55e;background:linear-gradient(145deg,#14532d,#0e3923)}
        .timer{background:rgba(0,0,0,.3);border-radius:999px;padding:6px 12px;font-size:12px;font-weight:900}
        .number{font-size:clamp(64px,15vw,100px);line-height:.9;font-weight:950;letter-spacing:-4px;margin-top:8px}
        .instruction{margin-top:10px;font-size:16px;font-weight:950}.hint{margin-top:5px;color:rgba(255,255,255,.62);font-size:11px}
        .progress{width:82%;height:7px;margin-top:18px;background:rgba(0,0,0,.3);border-radius:999px;overflow:hidden}.progressFill{height:100%;background:#fff;border-radius:inherit}
        .ripple{position:absolute;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.4);pointer-events:none;animation:ripple .5s ease-out forwards}@keyframes ripple{from{transform:scale(0);opacity:.8}to{transform:scale(3.4);opacity:0}}
        .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:9px}.stat{background:#111827;border:1px solid #202c3e;border-radius:14px;padding:12px 5px;text-align:center}.value{display:block;color:#22c55e;font-size:20px;line-height:1;font-weight:950}.label{display:block;margin-top:6px;color:#64748b;font-size:9px;font-weight:900}
        .panel{margin-top:9px;background:#111827;border:1px solid #202c3e;border-radius:15px;padding:13px}.panelTitle{font-size:12px;font-weight:950}
        .graph{height:75px;margin-top:9px;display:flex;align-items:flex-end;gap:2px;overflow:hidden}.bar{flex:1;min-width:3px;max-width:11px;border-radius:4px 4px 0 0}
        .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:10px}.metric{background:#0b1220;border:1px solid #1e2a3d;border-radius:11px;padding:9px 5px;text-align:center}.metric strong{display:block;font-size:14px;color:#e2e8f0}.metric span{display:block;margin-top:3px;color:#64748b;font-size:8px;font-weight:900}
        .result{margin-top:10px;background:#111827;border:2px solid #22c55e;border-radius:16px;padding:17px;text-align:center}.resultScore{color:#22c55e;font-size:43px;line-height:1;font-weight:950}.resultSmall{color:#64748b;font-size:9px;font-weight:900;margin-top:4px}.rank{font-size:20px;font-weight:950;margin-top:12px}.rankDesc{color:#94a3b8;font-size:12px;margin-top:5px}.world{background:#0b1220;border:1px solid #1e2a3d;border-radius:12px;padding:10px;margin-top:12px;font-size:12px;font-weight:800;color:#a5f3fc}
        .buttons{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:13px}button.action{border:0;border-radius:999px;padding:11px 20px;font-size:12px;font-weight:950;cursor:pointer}.green{background:#22c55e;color:#031108}.gray{background:#1e293b;color:#fff;border:1px solid #334155}
        .sound{display:flex;justify-content:center;margin-top:10px}.soundBtn{background:transparent;border:0;color:#64748b;font-size:10px;font-weight:800;cursor:pointer}
        .history{text-align:center}.historyTitle{color:#94a3b8;font-size:10px;font-weight:900}.chips{display:flex;justify-content:center;flex-wrap:wrap;gap:6px;margin-top:8px}.chip{background:#0b1220;border:1px solid #253247;color:#cbd5e1;border-radius:999px;padding:6px 10px;font-size:9px;font-weight:900}
        .content{margin-top:19px;background:#111827;border:1px solid #202c3e;border-radius:16px;padding:17px}.content h2{margin:0 0 8px;font-size:17px}.content h3{margin:15px 0 5px;font-size:13px}.content p,.content li{color:#64748b;font-size:11px;line-height:1.65}.content p{margin:0}.content ul{margin:6px 0 0;padding-left:18px}
        .footer{text-align:center;margin-top:18px;color:#334155;font-size:9px}
        @media(max-width:620px){.stats,.metrics{grid-template-columns:repeat(2,1fr)}.clickArea{min-height:270px}.instruction{font-size:14px}}
      `}</style>
      <div className="wrap">
        <header className="top"><div className="logo">NEXORA <span>TOOLS</span></div><div className="topBest">🏆 Best <b>{best.toFixed(2)}</b></div></header>
        <section className="hero"><div className="tag">⚡ FREE • ACCURATE • NO SIGN UP • #1 CPS TEST</div><h1>CPS Test — <span>Clicks Per Second</span></h1><p className="sub">Time Mode, 100 Clicks Challenge, Custom Timer, Peak CPS, World Rank & Auto-Clicker Detection.</p></section>

        <div className="modeRow">
          <button className={`modeBtn ${mode === "time" ? "active" : ""}`} onClick={() => changeMode("time")}>⏱️ Time Mode</button>
          <button className={`modeBtn ${mode === "target" ? "active" : ""}`} onClick={() => changeMode("target")}>🎯 100 Clicks Challenge</button>
        </div>

        {mode === "time" && (
          <>
            <div className="durations">{DURATIONS.map((s) => (<button key={s} className={`duration ${duration === s ? "active" : ""}`} onClick={() => changeDuration(s)} disabled={status === "running"}>{s}s</button>))}</div>
            <div className="custom"><label>⚙️ CUSTOM TIME: {customTime} Seconds</label><input type="range" min={1} max={60} value={customTime} disabled={status === "running"} onChange={(e) => { const v = Number(e.target.value); setCustomTime(v); changeDuration(v); }} /></div>
          </>
        )}
        {mode === "target" && (<div className="custom"><label>🎯 TARGET: 100 Clicks - Kitne second me kar sakte ho?</label><p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 0" }}>Timer tab tak chalega jab tak 100 clicks pure na ho jaye.</p></div>)}

        <div className={`clickArea ${status === "running" ? "running" : status === "done" ? "done" : ""}`} onPointerDown={handleClick} role="button" tabIndex={0}>
          {ripples.map((r) => (<span key={r.id} className="ripple" style={{ left: r.x - 21, top: r.y - 21 }} />))}
          <div className="timer">{status === "running" ? (mode === "time" ? `${timeLeft.toFixed(1)}s` : `${clicks}/100 Clicks`) : status === "done" ? "DONE" : mode === "time" ? `${duration}s` : "100 Clicks"}</div>
          <div className="number">{clicks}</div>
          <div className="instruction">{status === "idle" && "👆 CLICK TO START"}{status === "running" && "⚡ CLICK AS FAST AS YOU CAN"}{status === "done" && `${cps.toFixed(2)} CPS`}</div>
          <div className="hint">{status === "idle" && "Timer starts with your first click"}{status === "running" && `Current ${cps.toFixed(2)} CPS • ${inputType}`}{status === "done" && "Tap to play again"}</div>
          <div className="progress"><div className="progressFill" style={{ width: `${progress}%` }} /></div>
        </div>

        <div className="stats">
          <div className="stat"><span className="value">{clicks}</span><span className="label">CLICKS</span></div>
          <div className="stat"><span className="value">{cps.toFixed(2)}</span><span className="label">CPS</span></div>
          <div className="stat"><span className="value">{currentPB.toFixed(2)}</span><span className="label">{mode === "time" ? `${duration}s BEST` : "100 CLICK BEST"}</span></div>
          <div className="stat"><span className="value">{mode === "time" ? `${timeLeft.toFixed(1)}s` : status === "done" ? `${elapsedFinal.toFixed(2)}s` : `${100 - clicks}`}</span><span className="label">{mode === "time" ? "LEFT" : status === "done" ? "TOTAL TIME" : "REMAINING"}</span></div>
        </div>

        {graph.length > 2 && (
          <section className="panel"><div className="panelTitle">📈 Live Performance</div>
            <div className="graph">{graph.map((v, i) => { const h = Math.min(100, Math.max(4, (v / 15) * 100)); let bg = "#0ea5e9"; if (v >= 10) bg = "#ef4444"; else if (v >= 7) bg = "#a855f7"; else if (v >= 5) bg = "#22c55e"; return <div key={i} className="bar" style={{ height: `${h}%`, background: bg }} />; })}</div>
            <div className="metrics">
              <div className="metric"><strong>{peak.toFixed(1)}</strong><span>PEAK CPS</span></div>
              <div className="metric"><strong>{cps.toFixed(2)}</strong><span>AVG CPS</span></div>
              <div className="metric"><strong>{consistency.toFixed(0)}%</strong><span>CONSISTENCY</span></div>
              <div className="metric"><strong>{intervalMs ? `${intervalMs.toFixed(0)}ms` : "—"}</strong><span>AVG INTERVAL</span></div>
            </div>
          </section>
        )}

        {status === "done" && rank && (
          <section className="result"><div className="resultScore">{cps.toFixed(2)}</div><div className="resultSmall">CLICKS PER SECOND {mode === "target" && `• FINISHED IN ${elapsedFinal.toFixed(2)}s`}</div><div className="rank">{rank.icon} {rank.title}</div><p className="rankDesc">{rank.desc}</p><div className="world">🌍 {getWorldRank(cps)} • {inputType} • Peak {peak.toFixed(1)} CPS</div>
            <div className="buttons"><button className="action green" onClick={resetTest}>↻ Play Again</button><button className="action gray" onClick={shareResult}>📤 Share Result</button></div>
          </section>
        )}
        {status !== "done" && (<div className="buttons"><button className="action green" onClick={resetTest}>↻ Restart</button><button className="action gray" onClick={shareResult}>📤 Share</button></div>)}
        <div className="sound"><button className="soundBtn" onClick={() => setSound((v) => !v)}>{sound ? "🔊 Click sound ON" : "🔇 Click sound OFF"}</button></div>
        {history.length > 0 && (<section className="panel history"><div className="historyTitle">LAST 10 SCORES</div><div className="chips">{history.map((s, i) => (<span className="chip" key={`${s}-${i}`}>{s.toFixed(2)} CPS</span>))}</div></section>)}
        <section className="content"><h2>CPS Test - #1 Click Speed Test</h2><p>Choose Time Mode (1-60 sec) or 100 Clicks Challenge. Click as fast as you can and get accurate CPS, peak, consistency and world rank.</p><h3>What is a good CPS?</h3><p>World Average is 6.5 CPS. 5-7 CPS is good, 8+ is fast, 10+ is elite. Minecraft PvP players aim for 8-12 CPS.</p><h3>How to improve CPS?</h3><ul><li>Keep hand relaxed</li><li>Try Butterfly & Drag clicking</li><li>Practice daily 5 minutes</li><li>Use responsive mouse</li><li>Focus on rhythm, not force</li></ul></section>
        <footer className="footer">© {new Date().getFullYear()} NEXORA Tools</footer>
      </div>
    </main>
  );
}
