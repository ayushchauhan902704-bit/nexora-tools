"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";

const COLORS = ["#16a34a","#0ea5e9","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316","#22c55e","#3b82f6","#eab308","#a855f7"];

const PRESETS: Record<string, string[]> = {
  "🎁 Giveaway": ["Ayush","Rahul","Priya","Aman","Sneha","Vikash","Neha","Rohan"],
  "🏫 Classroom": ["Aarav","Diya","Kabir","Meera","Arjun","Anaya","Vihaan","Zara"],
  "✅ Yes / No": ["YES","NO","YES","NO","YES","NO"],
  "🍔 Kya Khaye?": ["Pizza","Burger","Momos","Biryani","Chole Bhature","Pasta","Sandwich","Chai"],
  "👥 Team Picker": ["Team A","Team B","Team A","Team B","Team A","Team B"],
  "🎲 Truth / Dare": ["Truth","Dare","Truth","Dare","Truth","Dare","Truth","Dare"],
};

export default function SpinWheelClient() {
  const [names, setNames] = useState<string[]>(["Ayush","Rahul","Priya","Aman","Sneha","Vikash","Neha","Rohan"]);
  const [input, setInput] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [vibrateOn, setVibrateOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const lastTickRef = useRef(0);
  const spinningRef = useRef(false);

  const playTick = useCallback(() => {
    if (!soundOn) return;
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      const ctx = audioRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = 900; o.type = "square";
      g.gain.setValueAtTime(0.03, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.04);
    } catch {}
  }, [soundOn]);

  const speakWinner = useCallback((name: string) => {
    if (!voiceOn) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(`Winner is ${name}`);
      u.rate = 1; u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch {}
  }, [voiceOn]);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = 340;
    const center = size / 2;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== size * dpr) { canvas.width = size * dpr; canvas.height = size * dpr; canvas.style.width = `${size}px`; canvas.style.height = `${size}px`; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    if (names.length === 0) {
      ctx.beginPath(); ctx.arc(center, center, center - 4, 0, Math.PI * 2);
      ctx.fillStyle = "#f1f5f9"; ctx.fill();
      ctx.fillStyle = "#94a3b8"; ctx.font = "800 14px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Add names to start", center, center);
      return;
    }

    const anglePer = (Math.PI * 2) / names.length;
    names.forEach((name, i) => {
      const start = i * anglePer;
      const end = start + anglePer;
      ctx.beginPath(); ctx.moveTo(center, center);
      ctx.arc(center, center, center - 4, start, end);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length]; ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.5; ctx.stroke();

      ctx.save(); ctx.translate(center, center); ctx.rotate(start + anglePer / 2);
      ctx.textAlign = "right"; ctx.fillStyle = "#fff";
      ctx.font = "800 14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(name.slice(0, 14), center - 22, 5);
      // chota dot outer pe
      ctx.beginPath(); ctx.arc(center - 12, 0, 4, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.fill();
      ctx.restore();
    });

    // Outer golden ring
    ctx.beginPath(); ctx.arc(center, center, center - 2, 0, Math.PI * 2);
    ctx.strokeStyle = "#eab308"; ctx.lineWidth = 5; ctx.stroke();
    // Center
    ctx.beginPath(); ctx.arc(center, center, 34, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a"; ctx.fill();
    ctx.strokeStyle = "#eab308"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.font = "800 13px 'Plus Jakarta Sans', sans-serif"; ctx.textAlign = "center";
    ctx.fillText("SPIN", center, center + 5);
  }, [names]);

  useEffect(() => { drawWheel(); }, [drawWheel]);

  // Tick sound + vibration jab ghum raha hai
  useEffect(() => {
    if (!spinning) return;
    const iv = window.setInterval(() => {
      playTick();
      if (vibrateOn) { try { navigator.vibrate?.(12); } catch {} }
    }, 110);
    return () => window.clearInterval(iv);
  }, [spinning, playTick, vibrateOn]);

  const addName = () => {
    if (!input.trim()) return;
    if (names.includes(input.trim())) { alert("Ye naam pehle se hai!"); return; }
    setNames([...names, input.trim()]);
    setInput("");
  };

  const addMany = (list: string[]) => {
    setNames(list); setWinner(null); setHistory([]);
  };

  const spin = () => {
    if (spinningRef.current || names.length < 2) return;
    spinningRef.current = true;
    setSpinning(true); setWinner(null);
    if (vibrateOn) { try { navigator.vibrate?.(40); } catch {} }

    const extra = 360 * 7 + Math.floor(Math.random() * 360);
    const newRot = rotation + extra;
    setRotation(newRot);

    // Pointer upar hai (270 deg) - wahi winner
    const normalized = (360 - (newRot % 360)) % 360;
    // Pointer 270 pe hai, isliye +90 shift
    const pointerAngle = (normalized + 90) % 360;
    const idx = Math.floor(pointerAngle / (360 / names.length)) % names.length;

    setTimeout(() => {
      const win = names[idx];
      setWinner(win);
      setHistory([win, ...history].slice(0, 10));
      setSpinning(false); spinningRef.current = false;
      confetti({ particleCount: 220, spread: 100, origin: { y: 0.55 }, colors: ["#16a34a","#eab308","#0ea5e9","#ef4444"] });
      if (vibrateOn) { try { navigator.vibrate?.([80, 40, 80, 40, 150]); } catch {} }
      speakWinner(win);
      if (removeWinner) setNames(names.filter(n => n !== win));
    }, 4500);
  };

  const copyWinner = async () => {
    if (!winner) return;
    try { await navigator.clipboard.writeText(`🏆 Winner: ${winner} - via thenexoratools.com/spin-wheel`); alert("Winner copied!"); } catch {}
  };

  const shareWinner = async () => {
    if (!winner) return;
    const text = `🏆 Winner is ${winner}! Spin Wheel - thenexoratools.com`;
    try {
      if (navigator.share) await navigator.share({ title: "Spin Wheel Winner", text, url: window.location.href });
      else await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <main className="page">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        .page { min-height: 100vh; background: #ffffff; color: #0f172a; padding: 16px 14px 40px; font-family: 'Plus Jakarta Sans', Inter, sans-serif; }
        .wrap { width: 100%; max-width: 900px; margin: auto; }
        .top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .logo { font-size: 17px; font-weight: 800; letter-spacing: -0.5px; }
        .logo span { color: #16a34a; }
        .topBest { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 999px; padding: 7px 12px; font-size: 11px; font-weight: 700; color: #334155; }
        .hero { text-align: center; margin-bottom: 14px; }
        .tag { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 11px; font-weight: 800; margin-bottom: 10px; }
        h1 { margin: 0; font-size: clamp(30px, 6vw, 42px); line-height: 1.05; letter-spacing: -1px; font-weight: 800; }
        h1 span { color: #16a34a; }
        .sub { color: #64748b; max-width: 620px; margin: 10px auto 0; font-size: 13px; line-height: 1.6; }
        .presets { display: flex; justify-content: center; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
        .preset { border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 8px 14px; font-size: 12px; font-weight: 700; cursor: pointer; color: #334155; }
        .preset:active { transform: scale(0.97); }
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 16px; box-shadow: 0 10px 40px rgba(15,23,42,0.06); }
        .inputRow { display: flex; gap: 8px; }
        .inputRow input { flex: 1; border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 999px; padding: 13px 16px; outline: none; font-size: 14px; font-weight: 600; font-family: inherit; }
        .inputRow input:focus { border-color: #16a34a; background: #fff; }
        .addBtn { border: 0; background: #0f172a; color: #fff; border-radius: 999px; padding: 0 22px; font-weight: 800; cursor: pointer; }
        .quickRow { display: flex; gap: 7px; margin-top: 10px; flex-wrap: wrap; }
        .quick { border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 999px; padding: 7px 12px; font-size: 11px; font-weight: 700; cursor: pointer; color: #475569; }
        .wheelWrap { margin-top: 14px; background: #fff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 22px 14px 18px; box-shadow: 0 10px 40px rgba(15,23,42,0.06); text-align: center; position: relative; overflow: hidden; }
        .wheelCenter { display: flex; justify-content: center; position: relative; }
        .pointer { position: absolute; top: -2px; left: 50%; transform: translateX(-50%); z-index: 20; width: 0; height: 0; border-left: 18px solid transparent; border-right: 18px solid transparent; border-top: 34px solid #eab308; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25)); }
        .pointer:after { content: ''; position: absolute; top: -34px; left: -6px; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 12px solid #0f172a; }
        .spinBtn { width: 100%; max-width: 420px; margin-top: 18px; border: 0; border-radius: 999px; padding: 16px; font-size: 17px; font-weight: 800; cursor: pointer; background: #16a34a; color: #fff; box-shadow: 0 8px 24px rgba(22,163,74,0.3); }
        .spinBtn:disabled { opacity: .6; }
        .spinBtn:active { transform: scale(0.98); }
        .winnerBox { margin: 16px auto 0; max-width: 420px; background: #f0fdf4; border: 2px solid #16a34a; border-radius: 18px; padding: 16px; animation: pop .3s ease; }
        @keyframes pop { from { transform: scale(.9); } to { transform: scale(1); } }
        .winnerLabel { font-size: 11px; font-weight: 800; color: #15803d; letter-spacing: 1px; }
        .winnerName { font-size: 32px; font-weight: 800; line-height: 1.1; margin-top: 4px; }
        .winnerBtns { display: flex; justify-content: center; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
        .wBtn { border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 8px 14px; font-size: 12px; font-weight: 700; cursor: pointer; }
        .history { margin-top: 14px; text-align: center; }
        .chips { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .chip { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 999px; padding: 7px 11px; font-size: 11px; font-weight: 700; }
        .listCard { margin-top: 14px; background: #fff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 16px; }
        .listHead { display: flex; justify-content: space-between; align-items: center; }
        .listHead b { font-size: 14px; }
        .listHead span { font-size: 11px; color: #94a3b8; font-weight: 700; }
        .namesList { margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-height: 260px; overflow: auto; }
        .nameItem { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 9px 10px; font-size: 13px; font-weight: 700; }
        .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 7px; }
        .remove { border: 0; background: transparent; color: #ef4444; font-size: 18px; cursor: pointer; line-height: 1; }
        .toggles { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
        .toggle { border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 8px 14px; font-size: 11px; font-weight: 700; color: #64748b; cursor: pointer; }
        .toggle.on { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
        .toggleRow { display: flex; align-items: center; gap: 8px; margin-top: 12px; font-size: 12px; font-weight: 600; color: #475569; cursor: pointer; }
        .toggleRow input { accent-color: #16a34a; width: 16px; height: 16px; }
        .content { margin-top: 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px; }
        .content h2 { margin: 0 0 8px; font-size: 18px; font-weight: 800; }
        .content h3 { margin: 14px 0 5px; font-size: 14px; font-weight: 800; }
        .content p, .content li { color: #64748b; font-size: 12px; line-height: 1.7; }
        .footer { text-align: center; margin-top: 16px; color: #94a3b8; font-size: 10px; }
        @media (max-width: 620px) { .namesList { grid-template-columns: 1fr; } }
      `}</style>

      <div className="wrap">
        <header className="top">
          <div className="logo">thenexoratools<span>.com</span></div>
          <div className="topBest">🎡 {names.length} Entries</div>
        </header>

        <section className="hero">
          <div className="tag">🎡 FREE • NO SIGN UP • VOICE + VIBRATION</div>
          <h1>Spin Wheel <span>- Random Picker</span></h1>
          <p className="sub">Giveaway winner, classroom, team ya khana decide karo. Naam likho, SPIN dabao, jaha teer rukega wahi winner hoga.</p>
        </section>

        <div className="presets">
          {Object.keys(PRESETS).map(k => (
            <button key={k} className="preset" onClick={() => addMany(PRESETS[k])}>{k}</button>
          ))}
        </div>

        {/* UPAR WALA BOX - NAAM LIKHNE WALA */}
        <div className="card">
          <div className="inputRow">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addName()} placeholder="Player ka naam likho... e.g. Ayush" />
            <button onClick={addName} className="addBtn">+ Add</button>
          </div>
          <div className="quickRow">
            <button className="quick" onClick={() => { setNames([]); setWinner(null); setHistory([]); }}>🗑️ Clear All</button>
            <button className="quick" onClick={() => { const a = [...names]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } setNames(a); }}>🔀 Shuffle</button>
            <button className="quick" onClick={() => addMany(PRESETS["🎁 Giveaway"])}>✨ Demo Names</button>
          </div>
          <label className="toggleRow">
            <input type="checkbox" checked={removeWinner} onChange={e => setRemoveWinner(e.target.checked)} />
            Winner ko list se auto hata do (Elimination Mode)
          </label>
        </div>

        {/* BEECH ME WHEEL */}
        <div className="wheelWrap">
          <div className="wheelCenter">
            <div className="pointer" />
            <div style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 4.5s cubic-bezier(0.12, 0.8, 0.08, 1)" : "none", lineHeight: 0 }}>
              <canvas ref={canvasRef} width={340} height={340} style={{ maxWidth: "100%", height: "auto" }} />
            </div>
          </div>

          <button onClick={spin} disabled={spinning || names.length < 2} className="spinBtn">
            {spinning ? "Spinning... 🎡" : "🎡 SPIN NOW"}
          </button>
          <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, fontWeight: 600 }}>{names.length < 2 ? "Kam se kam 2 naam chahiye" : "Teer jaha rukega, wahi Winner hoga"}</p>

          {winner && (
            <div className="winnerBox">
              <div className="winnerLabel">🏆 WINNER</div>
              <div className="winnerName">{winner}</div>
              <div className="winnerBtns">
                <button className="wBtn" onClick={copyWinner}>📋 Copy Winner</button>
                <button className="wBtn" onClick={shareWinner}>📤 Share Winner</button>
                <button className="wBtn" onClick={spin}>↻ Spin Again</button>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="history">
              <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8" }}>RECENT WINNERS</div>
              <div className="chips">{history.map((h, i) => <span key={i} className="chip">🏆 {h}</span>)}</div>
            </div>
          )}
        </div>

        {/* NAMES LIST */}
        <div className="listCard">
          <div className="listHead"><b>Entries ({names.length})</b><span>Tap × to remove</span></div>
          <div className="namesList">
            {names.map((n, i) => (
              <div key={i} className="nameItem">
                <span><span className="dot" style={{ background: COLORS[i % COLORS.length] }} />{n}</span>
                <button className="remove" onClick={() => setNames(names.filter((_, idx) => idx !== i))}>×</button>
              </div>
            ))}
            {names.length === 0 && <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", gridColumn: "1 / -1", padding: 20 }}>Koi entry nahi hai, upar se naam add karo</p>}
          </div>
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
          <p>Agar ye ON hai to winner list se auto hat jayega. Isse tum ek-ek karke sabko eliminate karke final winner nikal sakte ho - classroom aur giveaway ke liye best hai.</p>
        </section>
        <div className="footer">© {new Date().getFullYear()} thenexoratools.com</div>
      </div>
    </main>
  );
}
