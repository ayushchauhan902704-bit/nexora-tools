"use client";
import { PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "running" | "done";
type Mode = "time" | "target";
const DURATIONS = [1, 5, 10, 30, 60];
const PB_KEY = "nexora_cps_pb_v8";
const HISTORY_KEY = "nexora_cps_history_v8";

declare global { interface Window { gtag?: (...args: any[]) => void; } }
function trackEvent(name: string, params?: Record<string, any>) { try { window.gtag?.("event", name, params || {}); } catch {} }

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
  const [vibrateOn, setVibrateOn] = useState(true);
  const [inputType, setInputType] = useState("Touch / Mouse");
  const [combo, setCombo] = useState(0);

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
  const boxRef = useRef<HTMLDivElement | null>(null);
  const lastClickRef = useRef(0);
  const comboRef = useRef(0);
  const vibrateRef = useRef(true);

  useEffect(() => { vibrateRef.current = vibrateOn; }, [vibrateOn]);

  useEffect(() => {
    try {
      const savedPB = localStorage.getItem(PB_KEY);
      if (savedPB) {
        const parsed = JSON.parse(savedPB);
        if (parsed && typeof parsed === "object") {
          setBestByTime(parsed);
          const values = Object.values(parsed).filter((v): v is number => typeof v === "number");
          if (values.length) setBest(Math.max(...values));
        }
      }
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) setHistory(parsed.filter((v): v is number => typeof v === "number").slice(0, 10));
      }
    } catch {}
    return () => { stopTimers(); try { audioRef.current?.close(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopTimers = useCallback(() => {
    if (animationRef.current !== null) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
    if (graphRef.current !== null) { window.clearInterval(graphRef.current); graphRef.current = null; }
  }, []);

  const clickSound = useCallback(() => {
    if (!sound) return;
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      const ctx = audioRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.frequency.value = 520; oscillator.type = "sine";
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      oscillator.connect(gain); gain.connect(ctx.destination);
      oscillator.start(); oscillator.stop(ctx.currentTime + 0.04);
    } catch {}
  }, [sound]);

  const doVibrate = useCallback((pattern: number | number[]) => {
    if (!vibrateRef.current) return;
    try { navigator.vibrate?.(pattern); } catch {}
  }, []);

  const spawnRipple = useCallback((clientX: number, clientY: number) => {
    const box = boxRef.current; if (!box) return;
    const rect = box.getBoundingClientRect();
    const x = clientX - rect.left; const y = clientY - rect.top;
    const ripple = document.createElement("div");
    ripple.style.position = "absolute"; ripple.style.left = `${x - 34}px`; ripple.style.top = `${y - 34}px`;
    ripple.style.width = "68px"; ripple.style.height = "68px"; ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(22,163,74,0.18)"; ripple.style.border = "3px solid #16a34a";
    ripple.style.pointerEvents = "none"; ripple.style.zIndex = "10";
    box.appendChild(ripple);
    ripple.animate([{ transform: "scale(0.35)", opacity: "1" }, { transform: "scale(1.65)", opacity: "0" }], { duration: 480, easing: "ease-out" });
    const plus = document.createElement("div");
    plus.textContent = "+1"; plus.style.position = "absolute"; plus.style.left = `${x - 10}px`; plus.style.top = `${y - 35}px`;
    plus.style.color = "#16a34a"; plus.style.fontSize = "20px"; plus.style.fontWeight = "800"; plus.style.pointerEvents = "none"; plus.style.zIndex = "11";
    box.appendChild(plus);
    plus.animate([{ transform: "translateY(0)", opacity: "1" }, { transform: "translateY(-42px)", opacity: "0" }], { duration: 480, easing: "ease-out" });
    window.setTimeout(() => { ripple.remove(); plus.remove(); }, 520);
  }, []);

  // ✅ FIX - O(n) Sliding Window, pehle O(n²) tha - ab lag nahi marega
  const calcStats = useCallback((times: number[]) => {
    if (times.length === 0) return { peak: 0, consistency: 0, interval: 0 };
    if (times.length === 1) return { peak: 1, consistency: 100, interval: 0 };
    let peakValue = 0; let left = 0;
    for (let right = 0; right < times.length; right++) {
      while (times[right] - times[left] > 1000) left++;
      peakValue = Math.max(peakValue, right - left + 1);
    }
    const gaps: number[] = [];
    for (let i = 1; i < times.length; i++) gaps.push(times[i] - times[i - 1]);
    const average = gaps.reduce((s, v) => s + v, 0) / gaps.length;
    const variance = gaps.reduce((s, g) => s + Math.pow(g - average, 2), 0) / gaps.length;
    const deviation = Math.sqrt(variance);
    const consistencyScore = Math.max(0, Math.min(100, 100 - (deviation / Math.max(average, 1)) * 100));
    return { peak: peakValue, consistency: consistencyScore, interval: average };
  }, []);

  const saveResult = useCallback((score: number) => {
    const rounded = Number(score.toFixed(2));
    const key = modeRef.current === "time" ? `${durationRef.current}s` : "100clicks";
    setBestByTime((old) => {
      const next = { ...old, [key]: Math.max(old[key] || 0, rounded) };
      try { localStorage.setItem(PB_KEY, JSON.stringify(next)); } catch {}
      const values = Object.values(next).filter((v): v is number => typeof v === "number");
      setBest(values.length ? Math.max(...values) : 0);
      return next;
    });
    setHistory((old) => {
      const next = [rounded, ...old].slice(0, 10);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    trackEvent("cps_test_completed", { mode: modeRef.current, duration: modeRef.current === "time" ? durationRef.current : "100_clicks", cps: rounded });
  }, []);

  const finishTest = useCallback(() => {
    if (statusRef.current !== "running" || startRef.current === null) return;
    stopTimers();
    const elapsed = (window.performance.now() - startRef.current) / 1000;
    const finalCPS = modeRef.current === "time" ? clicksRef.current / Math.max(durationRef.current, 0.01) : clicksRef.current / Math.max(elapsed, 0.01);
    const stats = calcStats(clickTimesRef.current);
    setCps(finalCPS); setPeak(stats.peak); setConsistency(stats.consistency); setIntervalMs(stats.interval);
    setElapsedFinal(elapsed); setTimeLeft(0);
    setStatus("done"); statusRef.current = "done";
    saveResult(finalCPS); doVibrate([70, 35, 70]);
    trackEvent("cps_test_finish", { cps: Number(finalCPS.toFixed(2)), clicks: clicksRef.current, mode: modeRef.current });
  }, [calcStats, doVibrate, saveResult, stopTimers]);

  useEffect(() => { finishRef.current = finishTest; }, [finishTest]);

  const updateTimer = useCallback(() => {
    if (statusRef.current !== "running" || startRef.current === null) return;
    const elapsed = (window.performance.now() - startRef.current) / 1000;
    const remaining = Math.max(0, durationRef.current - elapsed);
    setTimeLeft(remaining);
    setCps(elapsed > 0 ? clicksRef.current / elapsed : 0);
    if (modeRef.current === "time" && remaining <= 0) { finishRef.current(); return; }
    if (modeRef.current === "target" && clicksRef.current >= 100) { finishRef.current(); return; }
    animationRef.current = requestAnimationFrame(updateTimer);
  }, []);

  const startTest = useCallback(() => {
    stopTimers();
    clicksRef.current = 0; clickTimesRef.current = [];
    startRef.current = window.performance.now(); statusRef.current = "running";
    setStatus("running"); setClicks(0); setCps(0); setPeak(0); setConsistency(0); setIntervalMs(0); setGraph([]); setCombo(0);
    comboRef.current = 0;
    setTimeLeft(modeRef.current === "time" ? durationRef.current : 0);
    setInputType("Touch / Mouse"); doVibrate(35);
    trackEvent("cps_test_started", { mode: modeRef.current, duration: modeRef.current === "time" ? durationRef.current : "100_clicks" });
    graphRef.current = window.setInterval(() => {
      if (statusRef.current !== "running" || startRef.current === null) return;
      const elapsed = (window.performance.now() - startRef.current) / 1000;
      const current = elapsed > 0 ? clicksRef.current / elapsed : 0;
      setGraph((old) => [...old.slice(-39), current]);
    }, 150);
    animationRef.current = requestAnimationFrame(updateTimer);
  }, [doVibrate, stopTimers, updateTimer]);

  const resetTest = useCallback(() => {
    stopTimers(); clicksRef.current = 0; clickTimesRef.current = []; startRef.current = null; statusRef.current = "idle";
    setStatus("idle"); setClicks(0); setCps(0); setGraph([]); setPeak(0); setConsistency(0); setIntervalMs(0); setElapsedFinal(0);
    setTimeLeft(modeRef.current === "time" ? durationRef.current : 0); setCombo(0); comboRef.current = 0;
  }, [stopTimers]);

  const changeDuration = useCallback((seconds: number) => {
    if (statusRef.current === "running") return;
    stopTimers(); durationRef.current = seconds; startRef.current = null; statusRef.current = "idle";
    setDuration(seconds); setCustomTime(seconds); setStatus("idle"); setClicks(0); setCps(0); setGraph([]); setTimeLeft(seconds); setPeak(0); setConsistency(0); setIntervalMs(0);
  }, [stopTimers]);

  const changeMode = useCallback((newMode: Mode) => {
    if (statusRef.current === "running") return;
    modeRef.current = newMode; setMode(newMode); stopTimers();
    clicksRef.current = 0; clickTimesRef.current = []; startRef.current = null; statusRef.current = "idle";
    setStatus("idle"); setClicks(0); setCps(0); setGraph([]); setPeak(0); setConsistency(0); setIntervalMs(0); setElapsedFinal(0); setCombo(0); comboRef.current = 0;
    setTimeLeft(newMode === "time" ? durationRef.current : 0);
  }, [stopTimers]);

  const handleBoxClick = (e: ReactPointerEvent<HTMLDivElement>) => {
    // ✅ FIX - Right click se count nahi hoga
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (statusRef.current !== "running") { spawnRipple(e.clientX, e.clientY); return; }
    spawnRipple(e.clientX, e.clientY); doVibrate(20);
    if (e.pointerType === "mouse") setInputType("Mouse");
    else if (e.pointerType === "touch") setInputType("Touch");
    else setInputType("Pen");
    const now = window.performance.now();
    if (now - lastClickRef.current < 400) comboRef.current += 1; else comboRef.current = 1;
    lastClickRef.current = now; setCombo(comboRef.current);
    clicksRef.current += 1; clickTimesRef.current.push(now); setClicks(clicksRef.current);
    clickSound();
    const stats = calcStats(clickTimesRef.current);
    setPeak(stats.peak); setConsistency(stats.consistency); setIntervalMs(stats.interval);
    if (modeRef.current === "target" && clicksRef.current >= 100) finishRef.current();
  };

  const shareResult = async () => {
    const text = `I scored ${cps.toFixed(2)} CPS on the NEXORA CPS Test. Peak ${peak.toFixed(1)} CPS with ${consistency.toFixed(0)}% consistency.`;
    trackEvent("cps_result_shared", { cps: Number(cps.toFixed(2)) });
    try {
      if (navigator.share) await navigator.share({ title: "CPS Test Result", text, url: window.location.href });
      else { await navigator.clipboard.writeText(`${text} ${window.location.href}`); window.alert("Your result has been copied."); }
    } catch {}
  };

  const getPerformance = (score: number) => {
    if (score < 4) return { icon: "🐢", title: "Getting Started", desc: "Keep practicing and focus on a relaxed, consistent clicking rhythm." };
    if (score < 6) return { icon: "👍", title: "Good Speed", desc: "A solid clicking speed. Keep practicing to improve your consistency." };
    if (score < 8) return { icon: "🔥", title: "Fast Clicker", desc: "Great clicking speed with strong overall performance." };
    if (score < 10) return { icon: "⚡", title: "Very Fast", desc: "Excellent clicking speed. Your result is well above the basic range." };
    if (score < 15) return { icon: "👑", title: "Extremely Fast", desc: "A very high CPS result. Try another round and compare your consistency." };
    return { icon: "🚨", title: "Unusually High Speed", desc: "This result is unusually high for ordinary clicking. Hardware, clicking technique, browser behavior or automated input can affect results." };
  };

  const resultInfo = status === "done" ? getPerformance(cps) : null;
  const progress = status === "idle" ? 0 : mode === "time" ? Math.min(100, ((duration - timeLeft) / duration) * 100) : Math.min(100, (clicks / 100) * 100);
  const currentPB = bestByTime[mode === "time" ? `${duration}s` : "100clicks"] || 0;

  return (
    <main className="page">
      <style jsx>{`
        .page { min-height: 100vh; background: #ffffff; color: #0f172a; padding: 12px 12px 36px; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
        .wrap { width: 100%; max-width: 850px; margin: auto; }
        .top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
        .logo { font-size: 14px; font-weight: 800; letter-spacing: -0.4px; }
        .logo span { color: #16a34a; }
        .topBest { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 999px; padding: 6px 10px; font-size: 9px; font-weight: 800; color: #64748b; }
        .topBest b { color: #16a34a; }
        .hero { text-align: center; margin-bottom: 12px; }
        .tag { display: inline-block; padding: 5px 9px; border-radius: 999px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 8px; font-weight: 800; margin-bottom: 6px; }
        h1 { margin: 0; font-size: clamp(25px, 6vw, 38px); line-height: 1.05; letter-spacing: -1px; font-weight: 850; }
        h1 span { color: #16a34a; }
        .sub { color: #64748b; max-width: 600px; margin: 7px auto 0; font-size: 10px; line-height: 1.55; }
        .modeRow { display: flex; justify-content: center; gap: 6px; margin-bottom: 8px; }
        .modeBtn, .duration { border: 1px solid #e2e8f0; background: #fff; color: #64748b; border-radius: 999px; font-weight: 800; cursor: pointer; }
        .modeBtn { padding: 7px 12px; font-size: 9px; }
        .modeBtn.active { background: #0f172a; color: #fff; border-color: #0f172a; }
        .durations { display: flex; justify-content: center; flex-wrap: wrap; gap: 5px; margin-bottom: 7px; }
        .duration { padding: 6px 12px; font-size: 9px; }
        .duration.active { background: #16a34a; border-color: #16a34a; color: #fff; }
        .duration:disabled { opacity: 0.5; }
        .custom { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 11px; margin-bottom: 8px; text-align: center; }
        .custom label { font-size: 8px; font-weight: 850; color: #475569; letter-spacing: 0.4px; }
        .custom p { font-size: 9px !important; line-height: 1.4; }
        .custom input { width: 100%; margin-top: 5px; accent-color: #16a34a; }
        .startWrap { display: flex; flex-direction: column; align-items: center; gap: 4px; margin: 0 0 8px; }
        .startBtn { width: 100%; max-width: 300px; border: 0; border-radius: 999px; padding: 11px 16px; font-size: 12px; font-weight: 850; cursor: pointer; background: #16a34a; color: #fff; box-shadow: 0 6px 18px rgba(22,163,74,0.22); }
        .startBtn:active { transform: scale(0.985); }
        .startBtn:disabled { opacity: 0.55; cursor: not-allowed; }
        .startHint { font-size: 8px; color: #94a3b8; font-weight: 600; }
        .clickArea { position: relative; min-height: 560px; width: 100%; border: 2px solid #e2e8f0; border-radius: 24px; background: #ffffff; box-shadow: 0 8px 30px rgba(15,23,42,0.055); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; overflow: hidden; cursor: pointer; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        .clickArea.running { border-color: #16a34a; background: #f0fdf4; }
        .clickArea.done { border-color: #16a34a; background: #f0fdf4; }
        .clickArea.idle { opacity: 0.88; }
        .timer { background: #0f172a; color: #fff; border-radius: 999px; padding: 5px 10px; font-size: 9px; font-weight: 850; position: relative; z-index: 2; }
        .number { font-size: clamp(90px, 22vw, 150px); line-height: 0.85; font-weight: 850; letter-spacing: -7px; margin-top: 12px; color: #0f172a; position: relative; z-index: 2; }
        .instruction { margin-top: 13px; font-size: 15px; font-weight: 850; color: #0f172a; position: relative; z-index: 2; }
        .hint { margin-top: 5px; color: #64748b; font-size: 9px; font-weight: 600; position: relative; z-index: 2; }
        .comboBadge { margin-top: 8px; background: #f97316; color: #fff; padding: 5px 10px; border-radius: 999px; font-size: 9px; font-weight: 850; position: relative; z-index: 2; }
        .progress { width: 72%; height: 6px; margin-top: 18px; background: #e2e8f0; border-radius: 999px; overflow: hidden; position: relative; z-index: 2; }
        .progressFill { height: 100%; background: #16a34a; border-radius: inherit; transition: width 0.08s linear; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 8px; }
        .stat { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 9px 4px; text-align: center; }
        .value { display: block; color: #16a34a; font-size: 17px; line-height: 1; font-weight: 850; }
        .label { display: block; margin-top: 4px; color: #94a3b8; font-size: 7px; font-weight: 850; letter-spacing: 0.35px; }
        .panel { margin-top: 8px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; box-shadow: 0 3px 15px rgba(15,23,42,0.035); }
        .panelTitle { font-size: 9px; font-weight: 850; }
        .graph { height: 60px; margin-top: 7px; display: flex; align-items: flex-end; gap: 2px; overflow: hidden; }
        .bar { flex: 1; min-width: 3px; max-width: 9px; border-radius: 3px 3px 0 0; }
        .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 8px; }
        .metric { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 7px 3px; text-align: center; }
        .metric strong { display: block; font-size: 12px; color: #0f172a; }
        .metric span { display: block; margin-top: 2px; color: #94a3b8; font-size: 7px; font-weight: 850; }
        .resultSpacer { height: auto; margin-top: 8px; }
        .result { width: 100%; max-width: 650px; margin: 0 auto; background: #fff; border: 1px solid #bbf7d0; border-radius: 16px; padding: 13px; text-align: center; box-shadow: 0 6px 25px rgba(15,23,42,0.07); animation: resultIn 0.35s ease both; }
        @keyframes resultIn { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .resultScore { color: #16a34a; font-size: 36px; line-height: 1; font-weight: 850; }
        .resultSmall { color: #94a3b8; font-size: 7px; font-weight: 850; margin-top: 4px; letter-spacing: 0.4px; }
        .rank { font-size: 15px; font-weight: 850; margin-top: 8px; }
        .rankDesc { color: #64748b; font-size: 9px; margin: 4px auto 0; line-height: 1.45; max-width: 520px; }
        .resultStats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-top: 8px; }
        .resultStat { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 6px; }
        .resultStat strong { display: block; font-size: 10px; }
        .resultStat span { display: block; color: #94a3b8; font-size: 6px; font-weight: 850; margin-top: 2px; }
        .buttons { display: flex; justify-content: center; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
        button.action { border: 0; border-radius: 999px; padding: 8px 14px; font-size: 9px; font-weight: 850; cursor: pointer; }
        .green { background: #16a34a; color: #fff; }
        .gray { background: #f1f5f9; color: #0f172a; border: 1px solid #e2e8f0; }
        .toggles { display: flex; justify-content: center; gap: 5px; flex-wrap: wrap; margin-top: 8px; }
        .toggleBtn { background: #fff; border: 1px solid #e2e8f0; border-radius: 999px; padding: 6px 10px; font-size: 8px; font-weight: 750; color: #64748b; cursor: pointer; }
        .toggleBtn.on { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
        .history { text-align: center; }
        .historyTitle { color: #94a3b8; font-size: 7px; font-weight: 850; }
        .chips { display: flex; justify-content: center; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
        .chip { background: #f8fafc; border: 1px solid #e2e8f0; color: #334155; border-radius: 999px; padding: 5px 8px; font-size: 7px; font-weight: 750; }
        .content { margin-top: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 13px; padding: 13px; }
        .content h2 { margin: 0 0 6px; font-size: 15px; font-weight: 850; }
        .content h3 { margin: 13px 0 4px; font-size: 11px; font-weight: 850; }
        .content p, .content li { color: #64748b; font-size: 9px; line-height: 1.6; }
        .content p { margin: 0; }
        .content ul { margin: 5px 0 0; padding-left: 16px; }
        .faq { margin-top: 13px; }
        .faqItem { border-top: 1px solid #e2e8f0; padding: 8px 0; }
        .faqItem:first-child { border-top: 0; }
        .faqItem strong { display: block; font-size: 9px; color: #0f172a; }
        .faqItem p { margin-top: 3px; }
        .related { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
        .related a { text-decoration: none; color: #15803d; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 6px 9px; border-radius: 999px; font-size: 7px; font-weight: 800; }
        .footer { text-align: center; margin-top: 13px; color: #94a3b8; font-size: 7px; }
        @media (max-width: 620px) {
          .page { padding: 9px 9px 28px; }
          .modeBtn { flex: 1; }
          .clickArea { min-height: 540px; border-radius: 20px; }
          .number { font-size: 100px; }
          .instruction { font-size: 13px; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .metrics { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 380px) { .clickArea { min-height: 500px; } .number { font-size: 88px; } .instruction { font-size: 12px; } }
      `}</style>
      <div className="wrap">
        <header className="top">
          <div className="logo">thenexoratools<span>.com</span></div>
          <div className="topBest">Best <b>{best.toFixed(2)} CPS</b></div>
        </header>
        <section className="hero">
          <div className="tag">FREE • FAST • NO SIGN UP</div>
          <h1>CPS Test — <span>Clicks Per Second</span></h1>
          <p className="sub">Test your clicking speed with accurate timing, custom challenges, peak CPS, consistency and personal best tracking.</p>
        </section>
        <div className="modeRow">
          <button className={`modeBtn ${mode === "time" ? "active" : ""}`} onClick={() => changeMode("time")}>⏱ Time Test</button>
          <button className={`modeBtn ${mode === "target" ? "active" : ""}`} onClick={() => changeMode("target")}>🎯 100 Click Test</button>
        </div>
        {mode === "time" && (
          <>
            <div className="durations">
              {DURATIONS.map((s) => (
                <button key={s} className={`duration ${duration === s ? "active" : ""}`} onClick={() => changeDuration(s)} disabled={status === "running"}>{s}s</button>
              ))}
            </div>
            <div className="custom">
              <label>CUSTOM TIME: {customTime}s</label>
              <input type="range" min={1} max={60} value={customTime} disabled={status === "running"} onChange={(e) => { const v = Number(e.target.value); setCustomTime(v); changeDuration(v); }} />
            </div>
          </>
        )}
        {mode === "target" && (
          <div className="custom"><label>TARGET: 100 CLICKS</label><p style={{ color: "#64748b", margin: "5px 0 0" }}>Complete 100 clicks as quickly as possible.</p></div>
        )}
        <div className="startWrap">
          {status === "idle" && <button className="startBtn" onClick={startTest}>▶ Start Test</button>}
          {status === "running" && <button className="startBtn" disabled>● Test Running</button>}
          {status === "done" && <button className="startBtn" onClick={startTest}>↻ Start Again</button>}
          <div className="startHint">{status === "idle" ? "Press Start, then click the large area below" : status === "running" ? "Click or tap as fast as you can" : "Start again for another attempt"}</div>
        </div>
        <div ref={boxRef} className={`clickArea ${status}`} onPointerDown={handleBoxClick} onContextMenu={(e) => e.preventDefault()} role="button" tabIndex={0} aria-label="CPS Test clicking area">
          <div className="timer">{status === "running" ? (mode === "time" ? `${timeLeft.toFixed(1)}s` : `${clicks}/100`) : status === "done" ? "DONE" : mode === "time" ? `${duration}s` : "100 Clicks"}</div>
          <div className="number">{clicks}</div>
          <div className="instruction">{status === "idle" && "👆 PRESS START ABOVE"}{status === "running" && "⚡ CLICK AS FAST AS YOU CAN"}{status === "done" && `${cps.toFixed(2)} CPS`}</div>
          <div className="hint">{status === "idle" && "Your clicks are counted only after Start"}{status === "running" && `${cps.toFixed(2)} CPS • ${inputType}`}{status === "done" && "Your result is ready"}</div>
          {status === "running" && combo >= 5 && <div className="comboBadge">🔥 Combo ×{combo}</div>}
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
            <div className="graph">
              {graph.map((value, index) => {
                const height = Math.min(100, Math.max(4, (value / 15) * 100));
                let background = "#38bdf8";
                if (value >= 10) background = "#ef4444"; else if (value >= 7) background = "#a855f7"; else if (value >= 5) background = "#22c55e";
                return <div key={index} className="bar" style={{ height: `${height}%`, background }} />;
              })}
            </div>
            <div className="metrics">
              <div className="metric"><strong>{peak.toFixed(1)}</strong><span>PEAK CPS</span></div>
              <div className="metric"><strong>{cps.toFixed(2)}</strong><span>AVG CPS</span></div>
              <div className="metric"><strong>{consistency.toFixed(0)}%</strong><span>CONSISTENCY</span></div>
              <div className="metric"><strong>{intervalMs ? `${intervalMs.toFixed(0)}ms` : "—"}</strong><span>AVG INTERVAL</span></div>
            </div>
          </section>
        )}
        {status === "done" && resultInfo && (
          <div className="resultSpacer">
            <section className="result">
              <div className="resultScore">{cps.toFixed(2)}</div>
              <div className="resultSmall">CLICKS PER SECOND{mode === "target" ? ` • 100 CLICKS IN ${elapsedFinal.toFixed(2)}s` : ` • ${duration}s TEST`}</div>
              <div className="rank">{resultInfo.icon} {resultInfo.title}</div>
              <p className="rankDesc">{resultInfo.desc}</p>
              <div className="resultStats">
                <div className="resultStat"><strong>{peak.toFixed(1)}</strong><span>PEAK CPS</span></div>
                <div className="resultStat"><strong>{consistency.toFixed(0)}%</strong><span>CONSISTENCY</span></div>
                <div className="resultStat"><strong>{inputType}</strong><span>INPUT</span></div>
              </div>
              <div className="buttons">
                <button className="action green" onClick={startTest}>↻ Play Again</button>
                <button className="action gray" onClick={shareResult}>↗ Share Result</button>
              </div>
            </section>
          </div>
        )}
        {status !== "done" && (
          <div className="buttons">
            <button className="action green" onClick={resetTest}>↻ Reset</button>
            <button className="action gray" onClick={shareResult}>↗ Share</button>
          </div>
        )}
        <div className="toggles">
          <button className={`toggleBtn ${sound ? "on" : ""}`} onClick={() => setSound((v) => !v)}>{sound ? "🔊 Sound On" : "🔇 Sound Off"}</button>
          <button className={`toggleBtn ${vibrateOn ? "on" : ""}`} onClick={() => setVibrateOn((v) => !v)}>{vibrateOn ? "📳 Vibration On" : "📳 Vibration Off"}</button>
        </div>
        {history.length > 0 && (
          <section className="panel history">
            <div className="historyTitle">LAST 10 SCORES</div>
            <div className="chips">{history.map((score, index) => (<span className="chip" key={`${score}-${index}`}>{score.toFixed(2)} CPS</span>))}</div>
          </section>
        )}
        <section className="content">
          <h2>CPS Test — Clicks Per Second Test</h2>
          <p>This free CPS Test measures how many clicks you can make per second. Use it as a click speed test, clicking speed test or mouse CPS test on desktop, Android, iPhone and tablet devices.</p>
          <h3>How to Use the CPS Test</h3>
          <ol style={{ margin: "5px 0 0", paddingLeft: "18px" }}><li>Choose a test duration.</li><li>Press Start Test.</li><li>Click or tap the large testing area as quickly as possible.</li><li>View your CPS, peak speed and consistency.</li></ol>
          <h3>What Does CPS Mean?</h3>
          <p>CPS means Clicks Per Second. If you make 30 clicks during a 5-second test, your average clicking speed is 6 CPS.</p>
          <h3>CPS Test Modes</h3>
          <p>Choose from 1, 5, 10, 30 or 60 seconds, or use the custom timer from 1–60 seconds. The 100 Click Test measures how quickly you can complete 100 clicks.</p>
          <h3>How to Improve Your Clicking Speed</h3>
          <ul><li>Keep your hand relaxed.</li><li>Practice short sessions regularly.</li><li>Focus on a steady clicking rhythm.</li><li>Use a responsive mouse or touchscreen.</li><li>Avoid excessive force while clicking.</li></ul>
          <h3>Is the CPS Score Accurate?</h3>
          <p>The test measures the clicks received by your browser during the selected challenge. Your device, browser, hardware, clicking technique and input method can affect the result.</p>
          <h3>Mobile CPS Test</h3>
          <p>You can use the test on compatible mobile browsers with touch input. Desktop users can use a mouse, while supported tablets and other devices can use touch or pointer input.</p>
          <div className="faq">
            <h3>Frequently Asked Questions</h3>
            <div className="faqItem"><strong>Is this CPS Test free?</strong><p>Yes. The CPS Test is free to use and does not require registration.</p></div>
            <div className="faqItem"><strong>What is a good CPS score?</strong><p>There is no universal perfect score. CPS depends on the input device, clicking technique and test conditions.</p></div>
            <div className="faqItem"><strong>Can I take a 1-second CPS test?</strong><p>Yes. Select the 1-second option for a quick CPS speed test.</p></div>
            <div className="faqItem"><strong>Can I take a 5-second CPS test?</strong><p>Yes. The 5-second CPS test is available as one of the standard test durations.</p></div>
            <div className="faqItem"><strong>What is the 100 Click Test?</strong><p>It measures how quickly you can complete 100 clicks and calculates your CPS from the completion time.</p></div>
            <div className="faqItem"><strong>Does the CPS Test work on mobile?</strong><p>Yes. Touch input is supported on compatible Android, iPhone and tablet browsers.</p></div>
            <div className="faqItem"><strong>Does this test require an account?</strong><p>No account or sign-up is required to run the test.</p></div>
          </div>
          <h3>Related Free Tools</h3>
          <div className="related">
            <a href="/age-calculator">Age Calculator</a>
            <a href="/percentage-calculator">Percentage Calculator</a>
            <a href="/bmi-calculator">BMI Calculator</a>
            <a href="/discount-calculator">Discount Calculator</a>
          </div>
        </section>
        <footer className="footer">© {new Date().getFullYear()} thenexoratools.com • Free Online Tools</footer>
      </div>
    </main>
  );
}
