"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

const COLORS = [
  "#7c3aed",
  "#2563eb",
  "#0891b2",
  "#059669",
  "#65a30d",
  "#ca8a04",
  "#ea580c",
  "#dc2626",
  "#db2777",
  "#9333ea",
  "#4f46e5",
  "#0f766e",
];

// Khali wheel ke liye 7 placeholder segments
const EMPTY_WHEEL = ["Add", "Your", "Entries", "To", "Spin", "And", "Win"];

const PRESETS = [
  {
    name: "🎁 Giveaway",
    items: [
      "Participant 1",
      "Participant 2",
      "Participant 3",
      "Participant 4",
      "Participant 5",
      "Participant 6",
    ],
  },
  {
    name: "🏫 Classroom",
    items: [
      "Student 1",
      "Student 2",
      "Student 3",
      "Student 4",
      "Student 5",
      "Student 6",
    ],
  },
  {
    name: "✅ Yes / No",
    items: ["Yes", "No"],
  },
  {
    name: "🍔 Food Picker",
    items: ["Pizza", "Burger", "Momos", "Biryani", "Pasta", "Sandwich"],
  },
  {
    name: "👥 Team Picker",
    items: ["Team A", "Team B"],
  },
  {
    name: "🎲 Truth / Dare",
    items: ["Truth", "Dare"],
  },
];

export default function SpinWheelClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const rotationRef = useRef(0);
  const namesRef = useRef<string[]>([]);
  const spinningRef = useRef(false);

  const lastSegmentRef = useRef(-1);
  const lastTickTimeRef = useRef(0);

  const [names, setNames] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [vibrateOn, setVibrateOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);

  useEffect(() => {
    namesRef.current = names;
  }, [names]);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 800;
    const center = size / 2;
    const radius = 375;

    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // FIX: Khali ho to 7 rang wala placeholder dikhao, gray nahi
    const list = namesRef.current.length === 0 ? EMPTY_WHEEL : namesRef.current;

    const slice = (Math.PI * 2) / list.length;

    ctx.beginPath();
    ctx.arc(center, center, radius + 12, 0, Math.PI * 2);
    ctx.fillStyle = "#eab308";
    ctx.fill();

    list.forEach((name, index) => {
      const start = index * slice;
      const end = start + slice;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();

      ctx.fillStyle = COLORS[index % COLORS.length];
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.42)";
      ctx.lineWidth = 4;
      ctx.stroke();

      const middle = start + slice / 2;

      ctx.save();
      ctx.translate(
        center + Math.cos(middle) * radius * 0.67,
        center + Math.sin(middle) * radius * 0.67
      );

      let textAngle = middle;
      if (textAngle > Math.PI / 2 && textAngle < Math.PI * 1.5) {
        textAngle += Math.PI;
      }
      ctx.rotate(textAngle);

      ctx.font = "900 27px Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 6;

      const maxWidth = radius * 0.48;
      let label = name;
      while (label.length > 4 && ctx.measureText(label).width > maxWidth) {
        label = label.slice(0, -1);
      }
      if (label !== name) label += "…";
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, 78, 0, Math.PI * 2);
    ctx.fillStyle = "#020617";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(center, center, 73, 0, Math.PI * 2);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "950 24px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowBlur = 0;
    ctx.fillText("SPIN", center, center);
  }, []);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  useEffect(() => {
    drawWheel();
  }, [names, drawWheel]);

  const playTick = useCallback(
    (speed: number = 1) => {
      if (!soundOn) return;
      try {
        if (!audioRef.current) {
          audioRef.current = new AudioContext();
        }
        const audio = audioRef.current;
        if (audio.state === "suspended") audio.resume();
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = "square";
        oscillator.frequency.value = 600 + speed * 400;
        gain.gain.setValueAtTime(0.0001, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.07, audio.currentTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.035);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start();
        oscillator.stop(audio.currentTime + 0.04);
      } catch {}
    },
    [soundOn]
  );

  const vibrate = useCallback(() => {
    if (!vibrateOn) return;
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(10);
      }
    } catch {}
  }, [vibrateOn]);

  const applyRotation = (degrees: number) => {
    rotationRef.current = degrees;
    const wheel = wheelRef.current;
    if (wheel) wheel.style.transform = `rotate(${degrees}deg)`;
  };

  const resetWheel = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    applyRotation(0);
  };

  const loadPreset = (items: string[]) => {
    if (spinningRef.current) return;
    const updated = [...items];
    namesRef.current = updated;
    setNames(updated);
    setWinner(null);
    setHistory([]);
    resetWheel();
  };

  const addName = () => {
    if (spinningRef.current) return;
    const value = input.trim();
    if (!value) return;
    const exists = namesRef.current.some((item) => item.toLowerCase() === value.toLowerCase());
    if (exists) {
      setInput("");
      return;
    }
    const updated = [...namesRef.current, value];
    namesRef.current = updated;
    setNames(updated);
    setInput("");
    setWinner(null);
  };

  const removeName = (index: number) => {
    if (spinningRef.current) return;
    const updated = namesRef.current.filter((_, i) => i !== index);
    namesRef.current = updated;
    setNames(updated);
    setWinner(null);
  };

  const addMany = (value: string) => {
    if (spinningRef.current) return;
    const values = value.split(/\n|,/).map((x) => x.trim()).filter(Boolean);
    const unique = Array.from(new Set(values));
    namesRef.current = unique;
    setNames(unique);
    setWinner(null);
    setHistory([]);
    resetWheel();
  };

  const clearAll = () => {
    if (spinningRef.current) return;
    namesRef.current = [];
    setNames([]);
    setWinner(null);
    setHistory([]);
    resetWheel();
  };

  const shuffle = () => {
    if (spinningRef.current) return;
    const shuffled = [...names];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    namesRef.current = shuffled;
    setNames(shuffled);
  };

  const spin = () => {
    if (spinningRef.current) return;
    const current = namesRef.current;
    if (current.length < 2) return;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    spinningRef.current = true;
    setSpinning(true);
    setWinner(null);
    vibrate();
    const startRotation = rotationRef.current;
    const randomAngle = Math.random() * 360;
    const totalRotation = 360 * 9 + randomAngle;
    const finalRotation = startRotation + totalRotation;
    const duration = 5800;
    const startTime = performance.now();
    lastSegmentRef.current = -1;
    lastTickTimeRef.current = 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      let progress = elapsed / duration;
      if (progress > 1) progress = 1;
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentRotation = startRotation + totalRotation * eased;
      applyRotation(currentRotation);
      const segment = 360 / current.length;
      const normalized = ((currentRotation % 360) + 360) % 360;
      let relative = 270 - normalized;
      relative = ((relative % 360) + 360) % 360;
      const currentSegment = Math.floor(relative / segment);
      const speed = 1 - eased;
      if (currentSegment !== lastSegmentRef.current) {
        lastSegmentRef.current = currentSegment;
        if (now - lastTickTimeRef.current > 25) {
          lastTickTimeRef.current = now;
          playTick(Math.max(0.2, speed));
          if (speed > 0.15) vibrate();
        }
      }
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      applyRotation(finalRotation);
      animationRef.current = null;
      const normalizedFinal = ((finalRotation % 360) + 360) % 360;
      let relativeFinal = 270 - normalizedFinal;
      relativeFinal = ((relativeFinal % 360) + 360) % 360;
      const winnerIndex = Math.floor(relativeFinal / segment);
      const selected = current[winnerIndex % current.length];
      setWinner(selected);
      setHistory((previous) => [selected, ...previous.filter((item) => item !== selected)].slice(0, 10));
      spinningRef.current = false;
      setSpinning(false);
      confetti({ particleCount: 160, spread: 95, startVelocity: 35, origin: { x: 0.5, y: 0.62 } });
      if (voiceOn && typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const speech = new SpeechSynthesisUtterance(`Winner is ${selected}`);
          speech.rate = 0.9;
          speech.pitch = 1;
          window.speechSynthesis.speak(speech);
        } catch {}
      }
      if (removeWinner) {
        const remaining = current.filter((name) => name !== selected);
        namesRef.current = remaining;
        setNames(remaining);
        setTimeout(() => drawWheel(), 30);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      try {
        audioRef.current?.close();
      } catch {}
    };
  }, []);

  return (
    <main className="page">
      <div className="container">
        <header className="top">
          <div className="logo">thenexoratools<span>.com</span></div>
          <div className="topBest">🎡 {names.length} Entries</div>
        </header>

        <section className="hero">
          <div className="tag">🎡 FREE • NO SIGN UP</div>
          <h1>Spin Wheel <span>Random Picker</span></h1>
          <p className="sub">Enter your choices, spin the wheel, and get a random winner instantly.</p>
        </section>

        <div className="presets">
          {PRESETS.map((preset) => (
            <button key={preset.name} className="preset" onClick={() => loadPreset(preset.items)} disabled={spinning}>
              {preset.name}
            </button>
          ))}
        </div>

        <div className="card">
          <div className="inputRow">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addName(); }} placeholder="Enter a name or choice..." disabled={spinning} autoComplete="off" spellCheck={false} />
            <button className="addBtn" onClick={addName} disabled={spinning}>+ Add</button>
          </div>
          <div className="quickRow">
            <button className="quick" onClick={clearAll}>🗑️ Clear</button>
            <button className="quick" onClick={shuffle}>🔀 Shuffle</button>
            <button className="quick" onClick={() => loadPreset(PRESETS[0].items)}>✨ Example</button>
          </div>
          <label className="toggleRow">
            <input type="checkbox" checked={removeWinner} onChange={(e) => setRemoveWinner(e.target.checked)} />
            Remove winner after each spin
          </label>
        </div>

        <div className="wheelWrap">
          <div className="wheelCenter">
            <div className="wheelBox">
              <div className="pointer" />
              <div ref={wheelRef} className="wheelRotator">
                <canvas ref={canvasRef} className="wheelCanvas" />
              </div>
            </div>
          </div>
          <button className="spinBtn" onClick={spin} disabled={spinning || names.length < 2}>
            {spinning ? "Spinning... 🎡" : "🎡 SPIN NOW"}
          </button>
          <p className="spinHint">{names.length < 2 ? "Add at least 2 entries to spin" : "The pointer selects the winner"}</p>

          {winner && (
            <div className="winnerBox">
              <div className="winnerLabel">🏆 WINNER</div>
              <div className="winnerName">{winner}</div>
              <div className="winnerBtns">
                <button className="wBtn" onClick={async () => { try { await navigator.clipboard.writeText(`🏆 Winner: ${winner}`); alert("Winner copied!"); } catch {} }}>📋 Copy</button>
                <button className="wBtn" onClick={async () => { try { if (navigator.share) { await navigator.share({ title: "Spin Wheel Winner", text: `🏆 Winner: ${winner}!`, url: window.location.href }); } } catch {} }}>📤 Share</button>
                <button className="wBtn" onClick={spin}>↻ Spin Again</button>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="history">
              <div className="historyTitle">RECENT WINNERS</div>
              <div className="chips">
                {history.map((item, index) => (
                  <span key={index} className="chip">🏆 {item}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="listCard">
          <div className="listHead">
            <b>Entries ({names.length})</b>
            <span>Tap × to remove</span>
          </div>
          <div className="namesList">
            {names.map((name, index) => (
              <div key={index} className="nameItem">
                <span><span className="dot" style={{ background: COLORS[index % COLORS.length] }} />{name}</span>
                <button className="remove" onClick={() => removeName(index)} disabled={spinning} aria-label={`Remove ${name}`}>×</button>
              </div>
            ))}
            {names.length === 0 && <p className="empty">No entries yet. Enter a name or choice above.</p>}
          </div>
          <details className="bulk">
            <summary>Add multiple entries</summary>
            <textarea placeholder="Enter one entry per line or separate them with commas" disabled={spinning} onBlur={(e) => { if (e.target.value.trim()) { addMany(e.target.value); e.target.value = ""; } }} />
          </details>
        </div>

        <div className="toggles">
          <button className={`toggle ${soundOn ? "on" : ""}`} onClick={() => setSoundOn((v) => !v)}>{soundOn ? "🔊 Tick Sound ON" : "🔇 Tick Sound OFF"}</button>
          <button className={`toggle ${vibrateOn ? "on" : ""}`} onClick={() => setVibrateOn((v) => !v)}>{vibrateOn ? "📳 Vibration ON" : "📳 Vibration OFF"}</button>
          <button className={`toggle ${voiceOn ? "on" : ""}`} onClick={() => setVoiceOn((v) => !v)}>{voiceOn ? "🗣️ Winner Voice ON" : "🗣️ Winner Voice OFF"}</button>
        </div>

        <section className="content">
          <h2>Spin Wheel Random Name Picker</h2>
          <p>Spin Wheel is a free random picker for giveaways, classrooms, team selection, quick decisions, and choosing between multiple options. Add your entries and spin the wheel to get a random result.</p>
          <h3>How to use the Spin Wheel</h3>
          <p>Enter two or more names or choices, then click Spin Now. You can also add multiple entries at once, shuffle the list, or use a preset. The pointer determines the selected result.</p>
          <h3>Elimination Mode</h3>
          <p>Turn on Remove winner after each spin to automatically remove the selected entry. This is useful for elimination games, tournaments, classroom activities, and repeated winner selection.</p>
        </section>

        <div className="footer">© {new Date().getFullYear()} thenexoratools.com</div>
      </div>

      <style jsx>{`
        .page { min-height: 100vh; background: #ffffff; color: #0f172a; padding: 10px 12px 30px; font-family: Inter, Arial, sans-serif; overflow-x: hidden; }
        .container { width: 100%; max-width: 900px; margin: auto; }
        .top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }
        .logo { font-size: 15px; font-weight: 800; letter-spacing: -0.4px; }
        .logo span { color: #16a34a; }
        .topBest { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 999px; padding: 5px 9px; font-size: 10px; font-weight: 700; color: #334155; }
        .hero { text-align: center; margin-bottom: 7px; }
        .tag { display: inline-block; padding: 4px 9px; border-radius: 999px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 9px; font-weight: 800; margin-bottom: 5px; }
        h1 { margin: 0; font-size: 24px; line-height: 1.1; letter-spacing: -0.7px; font-weight: 800; }
        h1 span { color: #16a34a; }
        .sub { color: #64748b; max-width: 580px; margin: 4px auto 0; font-size: 11px; line-height: 1.45; }
        .presets { display: flex; gap: 5px; margin-bottom: 8px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
        .presets::-webkit-scrollbar { display: none; }
        .preset { flex-shrink: 0; border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 6px 10px; font-size: 10px; font-weight: 700; cursor: pointer; color: #334155; }
        .preset:disabled { opacity: 0.55; cursor: not-allowed; }
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 10px; box-shadow: 0 5px 20px rgba(15, 23, 42, 0.05); }
        .inputRow { display: flex; gap: 7px; }
        .inputRow input { flex: 1; min-width: 0; border: 1.5px solid #e2e8f0; background: #fff !important; color: #0f172a !important; -webkit-text-fill-color: #0f172a !important; caret-color: #16a34a; border-radius: 999px; padding: 10px 13px; outline: none; font-size: 14px; font-weight: 700; font-family: inherit; }
        .inputRow input::placeholder { color: #94a3b8; font-weight: 600; }
        .inputRow input:focus { border-color: #16a34a; }
        .addBtn { flex-shrink: 0; border: 0; background: #0f172a; color: #fff; border-radius: 999px; padding: 0 16px; font-weight: 800; cursor: pointer; font-size: 12px; }
        .addBtn:disabled { opacity: 0.5; }
        .quickRow { display: flex; gap: 5px; margin-top: 7px; flex-wrap: wrap; }
        .quick { border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 999px; padding: 5px 9px; font-size: 10px; font-weight: 700; cursor: pointer; color: #475569; }
        .toggleRow { display: flex; align-items: center; gap: 6px; margin-top: 8px; font-size: 10px; font-weight: 600; color: #475569; cursor: pointer; }
        .toggleRow input { accent-color: #16a34a; width: 14px; height: 14px; }
        .wheelWrap { margin-top: 8px; background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 15px 8px 12px; box-shadow: 0 8px 26px rgba(15, 23, 42, 0.06); text-align: center; overflow: hidden; }
        .wheelCenter { display: flex; justify-content: center; }
        .wheelBox { width: 290px; height: 290px; max-width: 82vw; max-height: 82vw; position: relative; flex-shrink: 0; }
        .pointer { position: absolute; top: -4px; left: 50%; transform: translateX(-50%); z-index: 30; width: 0; height: 0; border-left: 14px solid transparent; border-right: 14px solid transparent; border-top: 27px solid #eab308; filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.25)); pointer-events: none; }
        .wheelRotator { width: 100%; height: 100%; border-radius: 50%; transform-origin: center center; will-change: transform; }
        .wheelCanvas { display: block; width: 100% !important; height: 100% !important; border-radius: 50%; }
        .spinBtn { width: 100%; max-width: 360px; margin-top: 11px; border: 0; border-radius: 999px; padding: 12px; font-size: 15px; font-weight: 800; cursor: pointer; background: #16a34a; color: #fff; box-shadow: 0 7px 20px rgba(22, 163, 74, 0.3); }
        .spinBtn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinHint { font-size: 10px; color: #94a3b8; margin-top: 6px; font-weight: 600; }
        .winnerBox { margin: 11px auto 0; max-width: 360px; background: #f0fdf4; border: 2px solid #16a34a; border-radius: 14px; padding: 11px; }
        .winnerLabel { font-size: 9px; font-weight: 800; color: #15803d; letter-spacing: 1px; }
        .winnerName { font-size: 26px; font-weight: 800; line-height: 1.1; margin-top: 3px; word-break: break-word; }
        .winnerBtns { display: flex; justify-content: center; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
        .wBtn { border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 6px 10px; font-size: 10px; font-weight: 700; cursor: pointer; }
        .history { margin-top: 10px; text-align: center; }
        .historyTitle { font-size: 9px; font-weight: 800; color: #94a3b8; }
        .chips { display: flex; justify-content: center; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
        .chip { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 999px; padding: 5px 8px; font-size: 10px; font-weight: 700; }
        .listCard { margin-top: 9px; background: #fff; border: 1px solid #e2e8f0; border-radius: 17px; padding: 11px; }
        .listHead { display: flex; justify-content: space-between; align-items: center; }
        .listHead b { font-size: 12px; }
        .listHead span { font-size: 9px; color: #94a3b8; font-weight: 700; }
        .namesList { margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; max-height: 220px; overflow: auto; }
        .nameItem { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 7px 9px; font-size: 12px; font-weight: 700; min-width: 0; }
        .nameItem > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
        .remove { border: 0; background: transparent; color: #ef4444; font-size: 17px; cursor: pointer; line-height: 1; padding: 0 2px; }
        .empty { grid-column: 1 / -1; text-align: center; color: #94a3b8; font-size: 11px; padding: 8px; margin: 0; }
        .bulk { margin-top: 9px; color: #94a3b8; font-size: 10px; }
        .bulk summary { cursor: pointer; font-weight: 800; }
        .bulk textarea { width: 100%; min-height: 65px; margin-top: 7px; resize: vertical; background: #fff; border: 1px solid #e2e8f0; border-radius: 9px; color: #0f172a; padding: 8px; outline: none; font-size: 11px; font-family: inherit; }
        .toggles { display: flex; justify-content: center; flex-wrap: wrap; gap: 5px; margin-top: 9px; }
        .toggle { border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 6px 9px; font-size: 10px; font-weight: 700; color: #64748b; cursor: pointer; }
        .toggle.on { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
        .content { margin-top: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 12px; }
        .content h2 { margin: 0 0 5px; font-size: 15px; font-weight: 800; }
        .content h3 { margin: 9px 0 3px; font-size: 12px; font-weight: 800; }
        .content p { color: #64748b; font-size: 10.5px; line-height: 1.6; margin: 0; }
        .footer { text-align: center; margin-top: 10px; color: #94a3b8; font-size: 9px; }
        @media (max-width: 620px) {
          .namesList { grid-template-columns: 1fr; }
          .wheelBox { width: 270px; height: 270px; }
          h1 { font-size: 22px; }
          .sub { font-size: 10.5px; }
        }
      `}</style>
    </main>
  );
}
