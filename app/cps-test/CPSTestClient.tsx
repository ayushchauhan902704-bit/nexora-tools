"use client";

import {
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Status = "idle" | "running" | "done";
type Mode = "time" | "target";
type Ripple = { id: number; x: number; y: number };

const DURATIONS = [1, 5, 10, 30, 60];
const PB_KEY = "nexora_cps_pb_v7";
const HISTORY_KEY = "nexora_cps_history_v7";

export default function CPSTestClient() {
  const [mode, setMode] = useState<Mode>("time");
  const [duration, setDuration] = useState(5);
  const [customTime, setCustomTime] = useState(5);
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
      if (pb) { const parsed = JSON.parse(pb); if (parsed && typeof parsed === "object") { setBestByTime(parsed); const values = Object.values(parsed).filter((v): v is number => typeof v === "number"); if (values.length) setBest(Math.max(...values)); } }
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) { const parsed = JSON.parse(h); if (Array.isArray(parsed)) setHistory(parsed.filter((v): v is number => typeof v === "number").slice(0, 10)); }
    } catch {}
    return () => { stopTimers(); try { audioRef.current?.close(); } catch {} };
  }, [stopTimers]);

  const clickSound = useCallback(() => {
    if (!sound) return;
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      const ctx = audioRef.current; if (ctx.state === "suspended") void ctx.resume();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = 520; o.type = "sine";
      g.gain.setValueAtTime(0.035, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.04);
    } catch {}
  }, [sound]);

  const calcStats = useCallback((times: number[]) => {
    if (times.length < 2) return { peak: times.length, consistency: 100, interval: 0 };
    let peakValue = 0;
    for (let i = 0; i < times.length; i++) { let c = 0; for (let j = i; j < times.length; j++) { if (times[j] - times[i] <= 1000) c++; else break; } peakValue = Math.max(peakValue, c); }
    const gaps: number[] = []; for (let i = 1; i < times.length; i++) gaps.push(times[i] - times[i - 1]);
    const avg = gaps.reduce((s, v) => s + v, 0) / gaps.length;
    const vari = gaps.reduce((s, g) => s + Math.pow(g - avg, 2), 0) / gaps.length;
    const dev = Math.sqrt(vari);
    return { peak: peakValue, consistency: Math.max(0, Math.min(100, 100 - (dev / Math.max(avg, 1)) * 100)), interval: avg };
  }, []);

  const saveResult = useCallback((score: number) => {
    const rounded = Number(score.toFixed(2));
    const key = modeRef.current === "time" ? `${durationRef.current}s` : "100clicks";
    setBestByTime((old) => { const next = { ...old, [key]: Math.max(old[key] || 0, rounded) }; try { localStorage.setItem(PB_KEY, JSON.stringify(next)); } catch {}; setBest(Math.max(0, ...Object.values(next))); return next; });
    setHistory((old) => { const next = [rounded, ...old].slice(0, 10); try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}; return next; });
  }, []);

  const finishTest = useCallback(() => {
    if (statusRef.current !== "running" || startRef.current === null) return;
    stopTimers();
    const elapsed = (performance.now() - startRef.current) / 1000;
    const finalCPS = modeRef.current === "time" ? clicksRef.current / Math.max(durationRef.current, 0.01) : clicksRef.current / Math.max(elapsed, 0.01);
    const stats = calcStats(clickTimesRef.current);
    setCps(finalCPS); setPeak(stats.peak); setConsistency(stats.consistency); setIntervalMs(stats.interval); setElapsedFinal(elapsed); setTimeLeft(0);
    setStatus("done"); statusRef.current = "done"; saveResult(finalCPS);
  }, [calcStats, saveResult, stopTimers]);

  useEffect(() => { finishRef.current = finishTest; }, [finishTest]);

  const updateTimer = useCallback(() => {
    if (statusRef.current !== "running" || startRef.current === null) return;
    const elapsed = (performance.now() - startRef.current) / 1000;
    const remaining = Math.max(0, durationRef.current - elapsed);
    setTimeLeft(remaining); setCps(elapsed > 0 ? clicksRef.current / elapsed : 0);
    if (modeRef.current === "time" && remaining <= 0) { finishRef.current(); return; }
    if (modeRef.current === "target" && clicksRef.current >= 100) { finishRef.current(); return; }
    animationRef.current = requestAnimationFrame(updateTimer);
  }, []);

  const startTest = useCallback(() => {
    stopTimers(); clicksRef.current = 0; clickTimesRef.current = []; startRef.current = performance.now(); statusRef.current = "running";
    setStatus("running"); setClicks(0); setCps(0); setPeak(0); setConsistency(0); setIntervalMs(0); setGraph([]); setTimeLeft(durationRef.current);
    graphRef.current = window.setInterval(() => {
      if (statusRef.current !== "running" || startRef.current === null) return;
      const elapsed = (performance.now() - startRef.current) / 1000;
      setGraph((old) => [...old.slice(-44), elapsed > 0 ? clicksRef.current / elapsed : 0]);
    }, 150);
    animationRef.current = requestAnimationFrame(updateTimer);
  }, [stopTimers, updateTimer]);

  const resetTest = useCallback(() => {
    stopTimers(); clicksRef.current = 0; clickTimesRef.current = []; startRef.current = null; statusRef.current = "idle";
    setStatus("idle"); setClicks(0); setCps(0); setGraph([]); setRipples([]); setPeak(0); setConsistency(0); setIntervalMs(0); setElapsedFinal(0); setTimeLeft(durationRef.current);
  }, [stopTimers]);

  const changeDuration = useCallback((s: number) => {
    if (statusRef.current === "running") return; stopTimers(); durationRef.current = s; startRef.current = null; statusRef.current = "idle";
    setDuration(s); setCustomTime(s); setStatus("idle"); setClicks(0); setCps(0); setGraph([]); setTimeLeft(s);
  }, [stopTimers]);

  const changeMode = useCallback((m: Mode) => { if (statusRef.current === "running") return; modeRef.current = m; setMode(m); resetTest(); }, [resetTest]);

  const handleClick = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") setInputType("Mouse");
    else if (e.pointerType === "touch") setInputType("Touch");
    else setInputType("Pen");
    if (statusRef.current === "done") { resetTest(); return; }
    if (statusRef.current === "idle") startTest();
    const now = performance.now(); clicksRef.current += 1; clickTimesRef.current.push(now); setClicks(clicksRef.current); clickSound();
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple: Ripple = { id: Date.now() + Math.random(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples((old) => [...old.slice(-8), ripple]);
    window.setTimeout(() => setRipples((old) => old.filter((i) => i.id !== ripple.id)), 500);
    const stats = calcStats(clickTimesRef.current); setPeak(stats.peak); setConsistency(stats.consistency); setIntervalMs(stats.interval);
    if (modeRef.current === "target" && clicksRef.current >= 100) finishRef.current();
  };

  const shareResult = async () => {
    const text = `I scored ${cps.toFixed(2)} CPS on thenexoratools.com CPS Test. Peak ${peak.toFixed(1)} CPS with ${consistency.toFixed(0)}% consistency.`;
    try {
      if (navigator.share) await navigator.share({ title: "CPS Test Result", text, url: window.location.href });
      else { await navigator.clipboard.writeText(`${text} ${window.location.href}`); window.alert("Result copied!"); }
    } catch {}
  };

  const getPerformance = (score: number) => {
    if (score < 4) return { icon: "🐢", title: "Getting Started", desc: "Keep practicing and focus on a relaxed, consistent clicking rhythm." };
    if (score < 6) return { icon: "👍", title: "Good Speed", desc: "A solid clicking speed. Keep practicing for more consistency." };
    if (score < 8) return { icon: "🔥", title: "Fast Clicker", desc: "Great clicking speed with strong performance." };
    if (score < 10) return { icon: "⚡", title: "Very Fast", desc: "Excellent speed. Your clicking performance is well above the basic range." };
    if (score < 15) return { icon: "👑", title: "Extremely Fast", desc: "A very high CPS result. Try another round and compare your consistency." };
    return { icon: "🚨", title: "Unusually High Speed", desc: "This CPS is unusually high for ordinary clicking. Hardware, clicking technique or automation may affect the result." };
  };

  const performance = status === "done" ? getPerformance(cps) : null;
  const progress = status === "idle" ? 0 : mode === "time" ? Math.min(100, ((duration - timeLeft) / duration) * 100) : Math.min(100, (clicks / 100) * 100);
  const currentPB = bestByTime[mode === "time" ? `${duration}s` : "100clicks"] || 0;

  return (
    <main className="page">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        .page { min-height: 100vh; background: #ffffff; color: #0f172a; padding: 16px 14px 50px; font-family: 'Plus Jakarta Sans', Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .wrap { width: 100%; max-width: 900px; margin: auto; }
        .top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 20px; }
        .logo { font-size: 17px; font-weight: 800; letter-spacing: -0.5px; color: #0f172a; }
        .logo span { color: #16a34a; }
        .topBest { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 999px; padding: 7px 12px; font-size: 11px; font-weight: 700; color: #334155; }
        .topBest b { color: #16a34a; }
        .hero { text-align: center; margin-bottom: 18px; }
        .tag { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 11px; font-weight: 800; margin-bottom: 10px; }
        h1 { margin: 0; font-size: clamp(30px, 6vw, 44px); line-height: 1.05; letter-spacing: -1.2px; font-weight: 800; }
        h1 span { color: #16a34a; }
        .sub { color: #64748b; max-width: 620px; margin: 10px auto 0; font-size: 13px; line-height: 1.6; font-weight: 500; }
        .modeRow { display: flex; justify-content: center; gap: 8px; margin-bottom: 12px; }
        .modeBtn, .duration { border: 1px solid #e2e8f0; background: #fff; color: #64748b; border-radius: 999px; font-weight: 700; cursor: pointer; }
        .modeBtn { padding: 10px 20px; font-size: 13px; }
        .modeBtn.active { background: #0f172a; color: #fff; border-color: #0f172a; }
        .durations { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
        .duration { padding: 9px 18px; font-size: 12px; }
        .duration.active { background: #16a34a; border-color: #16a34a; color: #fff; }
        .duration:disabled { opacity: .5; }
        .custom { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 13px; margin-bottom: 12px; text-align: center; }
        .custom label { font-size: 11px; font-weight: 800; color: #475569; letter-spacing: .5px; }
        .custom input { width: 100%; margin-top: 8px; accent-color: #16a34a; }

        /* BIG CLICK BOX - FULL SCREEN FEEL */
        .clickArea { position: relative; min-height: 460px; width: 100%; border: 2px solid #e2e8f0; border-radius: 24px; background: #ffffff; box-shadow: 0 10px 40px rgba(15,23,42,0.06); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; overflow: hidden; cursor: pointer; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        .clickArea.running { border-color: #16a34a; background: #f0fdf4; }
        .clickArea.done { border-color: #16a34a; background: #f0fdf4; }
        .timer { background: #0f172a; color: #fff; border-radius: 999px; padding: 7px 14px; font-size: 12px; font-weight: 800; }
        .number { font-size: clamp(80px, 18vw, 130px); line-height: .9; font-weight: 800; letter-spacing: -5px; margin-top: 10px; color: #0f172a; }
        .instruction { margin-top: 12px; font-size: 18px; font-weight: 800; color: #0f172a; }
        .hint { margin-top: 6px; color: #64748b; font-size: 12px; font-weight: 500; }
        .progress { width: 82%; height: 8px; margin-top: 20px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }
        .progressFill { height: 100%; background: #16a34a; border-radius: inherit; transition: width .08s linear; }

        /* GREEN DOT WHERE YOU CLICK */
        .ripple { position: absolute; width: 28px; height: 28px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 6px rgba(34,197,94,0.20); pointer-events: none; animation: ripple .45s ease-out forwards; }
        @keyframes ripple { from { transform: scale(.4); opacity: 1; } to { transform: scale(1.4); opacity: 0; } }

        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 12px; }
        .stat { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 14px 5px; text-align: center; }
        .value { display: block; color: #16a34a; font-size: 22px; line-height: 1; font-weight: 800; }
        .label { display: block; margin-top: 6px; color: #94a3b8; font-size: 10px; font-weight: 800; letter-spacing: .5px; }
        .panel { margin-top: 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 14px; box-shadow: 0 4px 20px rgba(15,23,42,0.04); }
        .panelTitle { font-size: 13px; font-weight: 800; }
        .graph { height: 75px; margin-top: 10px; display: flex; align-items: flex-end; gap: 2px; overflow: hidden; }
        .bar { flex: 1; min-width: 3px; max-width: 11px; border-radius: 4px 4px 0 0; }
        .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; }
        .metric { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 5px; text-align: center; }
        .metric strong { display: block; font-size: 15px; color: #0f172a; }
        .metric span { display: block; margin-top: 3px; color: #94a3b8; font-size: 9px; font-weight: 800; }

        /* RESULT - SLIDES UP FROM BOTTOM */
        .resultOverlay { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; display: flex; justify-content: center; padding: 12px; pointer-events: none; }
        .result { pointer-events: auto; width: 100%; max-width: 900px; background: #fff; border: 2px solid #16a34a; border-radius: 22px 22px 22px 22px; padding: 20px; text-align: center; box-shadow: 0 -10px 40px rgba(0,0,0,0.18); animation: slideUp .45s cubic-bezier(.2,.9,.3,1.2) both; }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .resultScore { color: #16a34a; font-size: 48px; line-height: 1; font-weight: 800; letter-spacing: -1px; }
        .resultSmall { color: #94a3b8; font-size: 10px; font-weight: 800; margin-top: 5px; letter-spacing: .5px; }
        .rank { font-size: 21px; font-weight: 800; margin-top: 12px; }
        .rankDesc { color: #64748b; font-size: 13px; margin-top: 5px; line-height: 1.5; }
        .world { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 11px; margin-top: 12px; font-size: 13px; font-weight: 700; color: #15803d; }
        .buttons { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
        button.action { border: 0; border-radius: 999px; padding: 12px 22px; font-size: 13px; font-weight: 800; cursor: pointer; }
        .green { background: #16a34a; color: #fff; }
        .gray { background: #f1f5f9; color: #0f172a; border: 1px solid #e2e8f0; }
        .sound { display: flex; justify-content: center; margin-top: 12px; }
        .soundBtn { background: transparent; border: 0; color: #94a3b8; font-size: 11px; font-weight: 700; cursor: pointer; }
        .history { text-align: center; }
        .historyTitle { color: #94a3b8; font-size: 10px; font-weight: 800; }
        .chips { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
        .chip { background: #f8fafc; border: 1px solid #e2e8f0; color: #334155; border-radius: 999px; padding: 7px 11px; font-size: 10px; font-weight: 700; }
        .content { margin-top: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px; }
        .content h2 { margin: 0 0 8px; font-size: 18px; font-weight: 800; }
        .content h3 { margin: 16px 0 5px; font-size: 14px; font-weight: 800; }
        .content p, .content li { color: #64748b; font-size: 12px; line-height: 1.7; }
        .content p { margin: 0; }
        .content ul { margin: 6px 0 0; padding-left: 18px; }
        .footer { text-align: center; margin-top: 18px; color: #94a3b8; font-size: 10px; }
        @media (max-width: 620px) { .stats, .metrics { grid-template-columns: repeat(2, 1fr); } .clickArea { min-height: 420px; border-radius: 20px; } .instruction { font-size: 15px; } .modeRow { flex-direction: column; } .modeBtn { width: 100%; } .result { border-radius: 20px; } }
      `}</style>

      <div className="wrap">
        <header className="top">
          <div className="logo">thenexoratools<span>.com</span></div>
          <div className="topBest">🏆 Best <b>{best.toFixed(2)}</b></div>
        </header>

        <section className="hero">
          <div className="tag">⚡ FREE • FAST • NO SIGN UP</div>
          <h1>CPS Test — <span>Clicks Per Second</span></h1>
          <p className="sub">Test your clicking speed with accurate timing, 1–60 second challenges, a 100-click challenge, peak CPS, consistency and personal best tracking.</p>
        </section>

        <div className="modeRow">
          <button className={`modeBtn ${mode === "time" ? "active" : ""}`} onClick={() => changeMode("time")}>⏱️ Time Mode</button>
          <button className={`modeBtn ${mode === "target" ? "active" : ""}`} onClick={() => changeMode("target")}>🎯 100 Clicks Challenge</button>
        </div>

        {mode === "time" && (
          <>
            <div className="durations">
              {DURATIONS.map((s) => (<button key={s} className={`duration ${duration === s ? "active" : ""}`} onClick={() => changeDuration(s)} disabled={status === "running"}>{s}s</button>))}
            </div>
            <div className="custom">
              <label>⚙️ CUSTOM TIME: {customTime} SECONDS</label>
              <input type="range" min={1} max={60} value={customTime} disabled={status === "running"} onChange={(e) => { const v = Number(e.target.value); setCustomTime(v); changeDuration(v); }} />
            </div>
          </>
        )}

        {mode === "target" && (
          <div className="custom">
            <label>🎯 TARGET: 100 CLICKS</label>
            <p style={{ fontSize: 11, color: "#64748b", margin: "6px 0 0" }}>Click 100 times as quickly as possible. Your total time and CPS will be shown when you finish.</p>
          </div>
        )}

        <div className={`clickArea ${status === "running" ? "running" : status === "done" ? "done" : ""}`} onPointerDown={handleClick} role="button" tabIndex={0} aria-label="CPS clicking test area">
          {ripples.map((r) => (<span key={r.id} className="ripple" style={{ left: r.x - 14, top: r.y - 14 }} />))}
          <div className="timer">{status === "running" ? (mode === "time" ? `${timeLeft.toFixed(1)}s` : `${clicks}/100 Clicks`) : status === "done" ? "DONE" : mode === "time" ? `${duration}s` : "100 Clicks"}</div>
          <div className="number">{clicks}</div>
          <div className="instruction">{status === "idle" && "👆 CLICK TO START"}{status === "running" && "⚡ CLICK AS FAST AS YOU CAN"}{status === "done" && `${cps.toFixed(2)} CPS`}</div>
          <div className="hint">{status === "idle" && "Your first click starts the timer"}{status === "running" && `Current ${cps.toFixed(2)} CPS • ${inputType}`}{status === "done" && "Tap the area or Play Again to start another test"}</div>
          <div className="progress"><div className="progressFill" style={{ width: `${progress}%` }} /></div>
        </div>

        <div className="stats">
          <div className="stat"><span className="value">{clicks}</span><span className="label">CLICKS</span></div>
          <div className="stat"><span className="value">{cps.toFixed(2)}</span><span className="label">CPS</span></div>
          <div className="stat"><span className="value">{currentPB.toFixed(2)}</span><span className="label">{mode === "time" ? `${duration}s BEST` : "100 CLICK BEST"}</span></div>
          <div className="stat"><span className="value">{mode === "time" ? `${timeLeft.toFixed(1)}s` : status === "done" ? `${elapsedFinal.toFixed(2)}s` : `${100 - clicks}`}</span><span className="label">{mode === "time" ? "LEFT" : status === "done" ? "TOTAL TIME" : "REMAINING"}</span></div>
        </div>

        {graph.length > 2 && (
          <section className="panel">
            <div className="panelTitle">📈 Live Performance</div>
            <div className="graph">{graph.map((v, i) => { const h = Math.min(100, Math.max(4, (v / 15) * 100)); let bg = "#38bdf8"; if (v >= 10) bg = "#ef4444"; else if (v >= 7) bg = "#a855f7"; else if (v >= 5) bg = "#22c55e"; return <div key={i} className="bar" style={{ height: `${h}%`, background: bg }} />; })}</div>
            <div className="metrics">
              <div className="metric"><strong>{peak.toFixed(1)}</strong><span>PEAK CPS</span></div>
              <div className="metric"><strong>{cps.toFixed(2)}</strong><span>AVG CPS</span></div>
              <div className="metric"><strong>{consistency.toFixed(0)}%</strong><span>CONSISTENCY</span></div>
              <div className="metric"><strong>{intervalMs ? `${intervalMs.toFixed(0)}ms` : "—"}</strong><span>AVG INTERVAL</span></div>
            </div>
          </section>
        )}

        {/* RESULT - BOTTOM SHEET SLIDE UP */}
        {status === "done" && performance && (
          <div className="resultOverlay">
            <section className="result">
              <div className="resultScore">{cps.toFixed(2)}</div>
              <div className="resultSmall">CLICKS PER SECOND {mode === "target" && ` • FINISHED IN ${elapsedFinal.toFixed(2)}s`}</div>
              <div className="rank">{performance.icon} {performance.title}</div>
              <p className="rankDesc">{performance.desc}</p>
              <div className="world">📊 Peak {peak.toFixed(1)} CPS • {consistency.toFixed(0)}% consistency • {inputType}</div>
              <div className="buttons">
                <button className="action green" onClick={resetTest}>↻ Play Again</button>
                <button className="action gray" onClick={shareResult}>📤 Share Result</button>
              </div>
            </section>
          </div>
        )}

        {status !== "done" && (
          <div className="buttons">
            <button className="action green" onClick={resetTest}>↻ Restart</button>
            <button className="action gray" onClick={shareResult}>📤 Share</button>
          </div>
        )}

        <div className="sound"><button className="soundBtn" onClick={() => setSound((v) => !v)}>{sound ? "🔊 Click sound ON" : "🔇 Click sound OFF"}</button></div>

        {history.length > 0 && (
          <section className="panel history">
            <div className="historyTitle">LAST 10 SCORES</div>
            <div className="chips">{history.map((s, i) => (<span className="chip" key={`${s}-${i}`}>{s.toFixed(2)} CPS</span>))}</div>
          </section>
        )}

        <section className="content">
          <h2>CPS Test – Clicks Per Second Test</h2>
          <p>CPS Test measures how many times you can click in one second. Choose a timed test from 1 to 60 seconds or try the 100 Clicks Challenge. Your result is calculated from your clicks and test duration.</p>
          <h3>What is CPS?</h3>
          <p>CPS means Clicks Per Second. For example, if you make 30 clicks during a 5-second test, your average speed is 6 CPS.</p>
          <h3>How to improve your clicking speed</h3>
          <ul><li>Keep your hand relaxed.</li><li>Practice short sessions regularly.</li><li>Focus on a consistent clicking rhythm.</li><li>Use a mouse or device that responds reliably to your input.</li><li>Avoid excessive force while clicking.</li></ul>
          <h3>CPS Test modes</h3>
          <p>Time Mode lets you choose 1, 5, 10, 30 or 60 seconds, with an additional custom timer from 1–60 seconds. The 100 Clicks Challenge measures how quickly you can complete 100 clicks.</p>
          <h3>Is a very high CPS always accurate?</h3>
          <p>Not necessarily. Clicking technique, device hardware, browser behavior and automated input can affect results. This test reports the measured result rather than claiming to identify a specific clicking method.</p>
        </section>

        <footer className="footer">© {new Date().getFullYear()} thenexoratools.com</footer>
      </div>
    </main>
  );
}
