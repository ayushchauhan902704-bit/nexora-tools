"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

const COLORS = ["#7c3aed","#2563eb","#0891b2","#059669","#65a30d","#ca8a04","#ea580c","#dc2626","#db2777","#9333ea","#4f46e5","#0f766e"];

const PRESETS = [
  { name: "🎁 Giveaway", items: ["Ayush","Rahul","Priya","Aman","Sneha","Vikash","Neha","Rohan"] },
  { name: "🏫 Classroom", items: ["Aarav","Diya","Kabir","Meera","Arjun","Anaya","Vihaan","Zara"] },
  { name: "✅ Yes / No", items: ["Yes","No"] },
  { name: "🍔 Kya Khaye?", items: ["Pizza","Burger","Momos","Biryani","Chole Bhature","Pasta","Sandwich","Chai"] },
  { name: "👥 Team Picker", items: ["Team A","Team B"] },
  { name: "🎲 Truth / Dare", items: ["Truth","Dare"] },
];

export default function SpinWheelClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const rotationRef = useRef(0);
  const namesRef = useRef<string[]>([]);
  const spinningRef = useRef(false);
  // ✅ AWAZ MATCH KE LIYE - last wala segment yaad rakhenge
  const lastSegmentRef = useRef(-1);
  const lastTickTimeRef = useRef(0);

  const [names, setNames] = useState<string[]>(["Ayush","Rahul","Priya","Aman","Sneha","Vikash","Neha","Rohan"]);
  const [input, setInput] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [vibrateOn, setVibrateOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);

  useEffect(() => { namesRef.current = names; }, [names]);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = 800;
    const center = size / 2;
    const radius = 375;
    canvas.width = size; canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    const list = namesRef.current;
    if (list.length === 0) {
      ctx.beginPath(); ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#f1f5f9"; ctx.fill();
      ctx.fillStyle = "#94a3b8"; ctx.font = "800 30px Arial, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("Add choices", center, center);
      return;
    }
    const slice = (Math.PI * 2) / list.length;
    ctx.beginPath(); ctx.arc(center, center, radius + 12, 0, Math.PI * 2);
    ctx.fillStyle = "#eab308"; ctx.fill();
    list.forEach((name, index) => {
      const start = index * slice;
      const end = start + slice;
      ctx.beginPath(); ctx.moveTo(center, center); ctx.arc(center, center, radius, start, end); ctx.closePath();
      ctx.fillStyle = COLORS[index % COLORS.length]; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.42)"; ctx.lineWidth = 4; ctx.stroke();
      const middle = start + slice / 2;
      ctx.save();
      ctx.translate(center + Math.cos(middle) * radius * 0.67, center + Math.sin(middle) * radius * 0.67);
      let textAngle = middle;
      if (textAngle > Math.PI / 2 && textAngle < Math.PI * 1.5) textAngle += Math.PI;
      ctx.rotate(textAngle);
      ctx.font = "900 27px Arial, sans-serif"; ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = 6;
      const maxWidth = radius * 0.48;
      let label = name;
      while (label.length > 4 && ctx.measureText(label).width > maxWidth) label = label.slice(0, -1);
      if (label !== name) label += "…";
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });
    ctx.beginPath(); ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 8; ctx.stroke();
    ctx.beginPath(); ctx.arc(center, center, 78, 0, Math.PI * 2);
    ctx.fillStyle = "#020617"; ctx.fill();
    ctx.beginPath(); ctx.arc(center, center, 73, 0, Math.PI * 2);
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = "#ffffff"; ctx.font = "950 24px Arial, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.shadowBlur = 0;
    ctx.fillText("SPIN", center, center);
  }, []);

  useEffect(() => { drawWheel(); }, [drawWheel]);
  useEffect(() => { drawWheel(); }, [names, drawWheel]);

  // ✅ AWAZ - ab wheel ke hisab se
  const playTick = useCallback((speed: number = 1) => {
    if (!soundOn) return;
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      const audio = audioRef.current;
      if (audio.state === "suspended") audio.resume();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = "square";
      // Tez ghum raha hai to unchi tick, dheere to neeche wali
      oscillator.frequency.value = 600 + speed * 400;
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.07, audio.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.035);
      oscillator.connect(gain); gain.connect(audio.destination);
      oscillator.start(); oscillator.stop(audio.currentTime + 0.04);
    } catch {}
  }, [soundOn]);

  const vibrate = useCallback(() => {
    if (!vibrateOn) return;
    try { if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(10); } catch {}
  }, [vibrateOn]);

  const applyRotation = (degrees: number) => {
    rotationRef.current = degrees;
    const wheel = wheelRef.current;
    if (wheel) wheel.style.transform = `rotate(${degrees}deg)`;
  };

  const resetWheel = () => {
    if (animationRef.current) { cancelAnimationFrame(animationRef.current); animationRef.current = null; }
    applyRotation(0);
  };

  const loadPreset = (items: string[]) => {
    if (spinningRef.current) return;
    namesRef.current = [...items]; setNames([...items]); setWinner(null); setHistory([]); resetWheel();
  };

  const addName = () => {
    if (spinningRef.current) return;
    const value = input.trim();
    if (!value) return;
    const exists = namesRef.current.some((item) => item.toLowerCase() === value.toLowerCase());
    if (exists) { setInput(""); return; }
    const updated = [...namesRef.current, value];
    namesRef.current = updated; setNames(updated); setInput(""); setWinner(null);
  };

  const removeName = (index: number) => {
    if (spinningRef.current) return;
    const updated = namesRef.current.filter((_, i) => i !== index);
    namesRef.current = updated; setNames(updated); setWinner(null);
  };

  const addMany = (value: string) => {
    if (spinningRef.current) return;
    const values = value.split(/\n|,/).map((x) => x.trim()).filter(Boolean);
    const unique = Array.from(new Set(values));
    namesRef.current = unique; setNames(unique); setWinner(null); setHistory([]); resetWheel();
  };

  const spin = () => {
    if (spinningRef.current) return;
    const current = namesRef.current;
    if (current.length < 2) return;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    spinningRef.current = true;
    setSpinning(true); setWinner(null);
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

      // ✅ YAHI MAIN FIX HAI - Teer jab ek tukda cross karega tabhi tick
      const segment = 360 / current.length;
      const normalized = ((currentRotation % 360) + 360) % 360;
      let relative = 270 - normalized;
      relative = ((relative % 360) + 360) % 360;
      const currentSegment = Math.floor(relative / segment);
      // Speed = abhi kitni tez ghum raha hai (1 = tez, 0 = ruk raha)
      const speed = 1 - eased;
      if (currentSegment !== lastSegmentRef.current) {
        lastSegmentRef.current = currentSegment;
        // Ekdum tez me har segment pe, dheere me bhi har segment pe - isliye match lagega
        if (now - lastTickTimeRef.current > 25) {
          lastTickTimeRef.current = now;
          playTick(Math.max(0.2, speed));
          // Vibration bhi wheel ke saath - tez me halki, end me band
          if (speed > 0.15) vibrate();
        }
      }

      if (progress < 1) { animationRef.current = requestAnimationFrame(animate); return; }
      applyRotation(finalRotation);
      animationRef.current = null;
      const normalizedFinal = ((finalRotation % 360) + 360) % 360;
      let relativeFinal = 270 - normalizedFinal;
      relativeFinal = ((relativeFinal % 360) + 360) % 360;
      const winnerIndex = Math.floor(relativeFinal / segment);
      const selected = current[winnerIndex % current.length];
      setWinner(selected);
      setHistory((previous) => [selected, ...previous.filter((item) => item !== selected)].slice(0, 10));
      spinningRef.current = false; setSpinning(false);
      confetti({ particleCount: 160, spread: 95, startVelocity: 35, origin: { x: 0.5, y: 0.62 } });
      if (voiceOn && typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const speech = new SpeechSynthesisUtterance(`Winner is ${selected}`);
          speech.rate = 0.9; speech.pitch = 1;
          window.speechSynthesis.speak(speech);
        } catch {}
      }
      if (removeWinner) {
        const remaining = current.filter((name) => name !== selected);
        namesRef.current = remaining; setNames(remaining);
        setTimeout(() => { drawWheel(); }, 30);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      try { audioRef.current?.close(); } catch {}
    };
  }, []);

  return (
    <main className="page">
      <div className="container">
        {/* VIDEO JESA WHITE HEADER */}
        <header className="top">
          <div className="logo">thenexoratools<span>.com</span></div>
          <div className="topBest">🎡 {names.length} Entries</div>
        </header>

        <section className="hero">
          <div className="tag">🎡 FREE • NO SIGN UP • VOICE + VIBRATION</div>
          <h1>Spin Wheel <span>- Random Picker</span></h1>
          <p className="sub">Giveaway winner, classroom, team ya khana decide karo. Naam likho, SPIN dabao, teer jaha rukega wahi winner hoga.</p>
        </section>

        {/* PRESETS - VIDEO JESA */}
        <div className="presets">
          {PRESETS.map((p) => (
            <button key={p.name} className="preset" onClick={() => loadPreset(p.items)} disabled={spinning}>{p.name}</button>
          ))}
        </div>

        {/* INPUT BOX - VIDEO JESA */}
        <div className="card">
          <div className="inputRow">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addName(); }} placeholder="Player ka naam likho... e.g. Ayush" disabled={spinning} autoComplete="off" spellCheck={false} />
            <button className="addBtn" onClick={addName} disabled={spinning}>+ Add</button>
          </div>
          <div className="quickRow">
            <button className="quick" onClick={() => { if (spinning) return; namesRef.current = []; setNames([]); setWinner(null); setHistory([]); resetWheel(); }}>🗑️ Clear All</button>
            <button className="quick" onClick={() => { if (spinning) return; const a = [...names]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } namesRef.current = a; setNames(a); }}>🔀 Shuffle</button>
            <button className="quick" onClick={() => loadPreset(PRESETS[0].items)}>✨ Demo Names</button>
          </div>
          <label className="toggleRow">
            <input type="checkbox" checked={removeWinner} onChange={(e) => setRemoveWinner(e.target.checked)} />
            Winner ko list se auto hata do (Elimination Mode)
          </label>
        </div>

        {/* WHEEL - BEECH ME */}
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
          <p className="spinHint">{names.length < 2 ? "Kam se kam 2 naam chahiye" : "Teer jaha rukega, wahi Winner hoga"}</p>

          {winner && (
            <div className="winnerBox">
              <div className="winnerLabel">🏆 WINNER</div>
              <div className="winnerName">{winner}</div>
              <div className="winnerBtns">
                <button className="wBtn" onClick={async () => { try { await navigator.clipboard.writeText(`🏆 Winner: ${winner}`); alert("Copied!"); } catch {} }}>📋 Copy Winner</button>
                <button className="wBtn" onClick={async () => { try { if (navigator.share) await navigator.share({ title: "Winner", text: `🏆 Winner is ${winner}!`, url: window.location.href }); } catch {} }}>📤 Share Winner</button>
                <button className="wBtn" onClick={spin}>↻ Spin Again</button>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="history">
              <div className="historyTitle">RECENT WINNERS</div>
              <div className="chips">{history.map((h, i) => <span key={i} className="chip">🏆 {h}</span>)}</div>
            </div>
          )}
        </div>

        {/* ENTRIES LIST */}
        <div className="listCard">
          <div className="listHead"><b>Entries ({names.length})</b><span>Tap × to remove</span></div>
          <div className="namesList">
            {names.map((n, i) => (
              <div key={i} className="nameItem">
                <span><span className="dot" style={{ background: COLORS[i % COLORS.length] }} />{n}</span>
                <button className="remove" onClick={() => removeName(i)} disabled={spinning}>×</button>
              </div>
            ))}
            {names.length === 0 && <p className="empty">Koi entry nahi hai, upar se naam add karo</p>}
          </div>
          <details className="bulk">
            <summary>Add multiple choices</summary>
            <textarea placeholder="One per line or separated by commas" disabled={spinning} onBlur={(e) => { if (e.target.value.trim()) { addMany(e.target.value); e.target.value = ""; } }} />
          </details>
        </div>

        <div className="toggles">
          <button className={`toggle ${soundOn ? "on" : ""}`} onClick={() => setSoundOn(v => !v)}>{soundOn ? "🔊 Tick Sound ON" : "🔇 Tick Sound OFF"}</button>
          <button className={`toggle ${vibrateOn ? "on" : ""}`} onClick={() => setVibrateOn(v => !v)}>{vibrateOn ? "📳 Vibration ON" : "📳 Vibration OFF"}</button>
          <button className={`toggle ${voiceOn ? "on" : ""}`} onClick={() => setVoiceOn(v => !v)}>{voiceOn ? "🗣️ Winner Voice ON" : "🗣️ Winner Voice OFF"}</button>
        </div>

        <section className="content">
          <h2>Spin Wheel - Random Name Picker</h2>
          <p>Spin Wheel ek free random picker hai. Giveaway winner chunne, classroom me student pick karne, team banane ya khana decide karne ke liye iska use karo. Bas naam add karo aur SPIN dabao.</p>
          <h3>Kaise use kare?</h3>
          <p>1. Upar wale box me naam likho aur Add dabao. 2. Preset se Giveaway, Classroom, Yes/No bhi 1 click me load kar sakte ho. 3. SPIN dabao. Teer jaha rukega, wahi winner hoga.</p>
          <h3>Elimination Mode kya hai?</h3>
          <p>Agar ye ON hai to winner list se auto hat jayega. Isse tum ek-ek karke sabko eliminate karke final winner nikal sakte ho.</p>
        </section>
        <div className="footer">© {new Date().getFullYear()} thenexoratools.com</div>
      </div>

      <style jsx>{`
        .page { min-height: 100vh; background: #ffffff; color: #0f172a; padding: 10px 12px 30px; font-family: 'Plus Jakarta Sans', Inter, sans-serif; overflow-x: hidden; }
        .container { width: 100%; max-width: 900px; margin: auto; }
        .top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .logo { font-size: 16px; font-weight: 800; letter-spacing: -0.5px; }
        .logo span { color: #16a34a; }
        .topBest { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 999px; padding: 5px 10px; font-size: 11px; font-weight: 700; color: #334155; }
        .hero { text-align: center; margin-bottom: 8px; }
        .tag { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 10px; font-weight: 800; margin-bottom: 6px; }
        h1 { margin: 0; font-size: 26px; line-height: 1.1; letter-spacing: -0.8px; font-weight: 800; }
        h1 span { color: #16a34a; }
        .sub { color: #64748b; max-width: 620px; margin: 5px auto 0; font-size: 12px; line-height: 1.5; }
        .presets { display: flex; gap: 6px; margin-bottom: 10px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
        .presets::-webkit-scrollbar { display: none; }
        .preset { flex-shrink: 0; border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 7px 12px; font-size: 11px; font-weight: 700; cursor: pointer; color: #334155; }
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 12px; box-shadow: 0 6px 24px rgba(15,23,42,0.05); }
        .inputRow { display: flex; gap: 8px; }
        .inputRow input { flex: 1; min-width: 0; border: 1.5px solid #e2e8f0; background: #ffffff !important; color: #0f172a !important; -webkit-text-fill-color: #0f172a !important; caret-color: #16a34a; border-radius: 999px; padding: 12px 14px; outline: none; font-size: 15px; font-weight: 700; font-family: inherit; }
        .inputRow input::placeholder { color: #94a3b8; font-weight: 600; }
        .inputRow input:focus { border-color: #16a34a; }
        .addBtn { flex-shrink: 0; border: 0; background: #0f172a; color: #fff; border-radius: 999px; padding: 0 18px; font-weight: 800; cursor: pointer; font-size: 13px; }
        .addBtn:disabled { opacity: .5; }
        .quickRow { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
        .quick { border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 999px; padding: 6px 10px; font-size: 11px; font-weight: 700; cursor: pointer; color: #475569; }
        .toggleRow { display: flex; align-items: center; gap: 7px; margin-top: 9px; font-size: 11px; font-weight: 600; color: #475569; cursor: pointer; }
        .toggleRow input { accent-color: #16a34a; width: 15px; height: 15px; }
        .wheelWrap { margin-top: 10px; background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 18px 10px 14px; box-shadow: 0 10px 30px rgba(15,23,42,0.06); text-align: center; overflow: hidden; }
        .wheelCenter { display: flex; justify-content: center; }
        .wheelBox { width: 300px; height: 300px; max-width: 86vw; max-height: 86vw; position: relative; flex-shrink: 0; }
        .pointer { position: absolute; top: -4px; left: 50%; transform: translateX(-50%); z-index: 30; width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-top: 28px solid #eab308; filter: drop-shadow(0 3px 4px rgba(0,0,0,0.25)); pointer-events: none; }
        .wheelRotator { width: 100%; height: 100%; border-radius: 50%; transform-origin: center center; will-change: transform; }
        .wheelCanvas { display: block; width: 100% !important; height: 100% !important; border-radius: 50%; }
        .spinBtn { width: 100%; max-width: 380px; margin-top: 14px; border: 0; border-radius: 999px; padding: 14px; font-size: 16px; font-weight: 800; cursor: pointer; background: #16a34a; color: #fff; box-shadow: 0 8px 24px rgba(22,163,74,0.3); }
        .spinBtn:disabled { opacity: .6; }
        .spinHint { font-size: 11px; color: #94a3b8; margin-top: 7px; font-weight: 600; }
        .winnerBox { margin: 14px auto 0; max-width: 380px; background: #f0fdf4; border: 2px solid #16a34a; border-radius: 16px; padding: 14px; }
        .winnerLabel { font-size: 10px; font-weight: 800; color: #15803d; letter-spacing: 1px; }
        .winnerName { font-size: 30px; font-weight: 800; line-height: 1.1; margin-top: 4px; word-break: break-word; }
        .winnerBtns { display: flex; justify-content: center; gap: 7px; margin-top: 9px; flex-wrap: wrap; }
        .wBtn { border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 7px 12px; font-size: 11px; font-weight: 700; cursor: pointer; }
        .history { margin-top: 12px; text-align: center; }
        .historyTitle { font-size: 10px; font-weight: 800; color: #94a3b8; }
        .chips { display: flex; justify-content: center; flex-wrap: wrap; gap: 5px; margin-top: 7px; }
        .chip { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 999px; padding: 6px 10px; font-size: 11px; font-weight: 700; }
        .listCard { margin-top: 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 14px; }
        .listHead { display: flex; justify-content: space-between; align-items: center; }
        .listHead b { font-size: 13px; }
        .listHead span { font-size: 10px; color: #94a3b8; font-weight: 700; }
        .namesList { margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 7px; max-height: 240px; overflow: auto; }
        .nameItem { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 11px; padding: 8px 10px; font-size: 13px; font-weight: 700; }
        .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 7px; }
        .remove { border: 0; background: transparent; color: #ef4444; font-size: 18px; cursor: pointer; line-height: 1; }
        .bulk { margin-top: 12px; color: #94a3b8; font-size: 11px; }
        .bulk summary { cursor: pointer; font-weight: 800; }
        .bulk textarea { width: 100%; min-height: 80px; margin-top: 8px; resize: vertical; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; color: #0f172a; padding: 10px; outline: none; font-size: 12px; }
        .toggles { display: flex; justify-content: center; flex-wrap: wrap; gap: 7px; margin-top: 12px; }
        .toggle { border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 7px 12px; font-size: 11px; font-weight: 700; color: #64748b; cursor: pointer; }
        .toggle.on { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
        .content { margin-top: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; }
        .content h2 { margin: 0 0 7px; font-size: 17px; font-weight: 800; }
        .content h3 { margin: 12px 0 4px; font-size: 13px; font-weight: 800; }
        .content p { color: #64748b; font-size: 12px; line-height: 1.7; }
        .footer { text-align: center; margin-top: 14px; color: #94a3b8; font-size: 10px; }
        @media (max-width: 620px) { .namesList { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}
