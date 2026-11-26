"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";

const COLORS = [
  "#16a34a",
  "#0ea5e9",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#eab308",
  "#a855f7",
];

const PRESETS: Record<string, string[]> = {
  "🎁 Giveaway": [
    "Ayush",
    "Rahul",
    "Priya",
    "Aman",
    "Sneha",
    "Vikash",
    "Neha",
    "Rohan",
  ],

  "🏫 Classroom": [
    "Aarav",
    "Diya",
    "Kabir",
    "Meera",
    "Arjun",
    "Anaya",
    "Vihaan",
    "Zara",
  ],

  "✅ Yes / No": ["YES", "NO"],

  "🍔 What to Eat?": [
    "Pizza",
    "Burger",
    "Momos",
    "Biryani",
    "Chole Bhature",
    "Pasta",
    "Sandwich",
    "Chai",
  ],

  "👥 Team Picker": ["Team A", "Team B"],

  "🎲 Truth / Dare": ["Truth", "Dare"],
};

export default function SpinWheelClient() {
  const [names, setNames] = useState<string[]>([
    "Ayush",
    "Rahul",
    "Priya",
    "Aman",
    "Sneha",
    "Vikash",
    "Neha",
    "Rohan",
  ]);

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
  const spinningRef = useRef(false);
  const rotationRef = useRef(0);
  const namesRef = useRef(names);

  namesRef.current = names;

  /* -----------------------------
     Tick Sound
  ----------------------------- */

  const playTick = useCallback(() => {
    if (!soundOn) return;

    try {
      if (!audioRef.current) {
        audioRef.current = new AudioContext();
      }

      const ctx = audioRef.current;

      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.frequency.value = 900;
      oscillator.type = "square";

      gain.gain.setValueAtTime(0.03, ctx.currentTime);

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.04
      );

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.04);
    } catch {}
  }, [soundOn]);

  /* -----------------------------
     Winner Voice
  ----------------------------- */

  const speakWinner = useCallback(
    (name: string) => {
      if (!voiceOn) return;

      try {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(
          `Winner is ${name}`
        );

        utterance.rate = 0.95;
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
      } catch {}
    },
    [voiceOn]
  );

  /* -----------------------------
     Draw Wheel
  ----------------------------- */

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const size = 300;
    const center = size / 2;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, size, size);

    if (names.length === 0) {
      ctx.beginPath();
      ctx.arc(center, center, center - 4, 0, Math.PI * 2);

      ctx.fillStyle = "#f1f5f9";
      ctx.fill();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "800 14px Arial, sans-serif";
      ctx.textAlign = "center";

      ctx.fillText("Add entries to start", center, center);

      return;
    }

    const anglePer = (Math.PI * 2) / names.length;

    names.forEach((name, i) => {
      const start = i * anglePer;
      const end = start + anglePer;

      /* Slice */
      ctx.beginPath();

      ctx.moveTo(center, center);

      ctx.arc(
        center,
        center,
        center - 4,
        start,
        end
      );

      ctx.closePath();

      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      /* Text */
      ctx.save();

      ctx.translate(center, center);

      ctx.rotate(start + anglePer / 2);

      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";

      const fontSize = name.length > 10 ? 11 : 13;

      ctx.font = `800 ${fontSize}px Arial, sans-serif`;

      ctx.fillText(
        name.slice(0, 14),
        center - 20,
        5
      );

      /* Small dot */
      ctx.beginPath();

      ctx.arc(
        center - 12,
        0,
        3.5,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fill();

      ctx.restore();
    });

    /* Outer border */
    ctx.beginPath();

    ctx.arc(
      center,
      center,
      center - 2,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 4;
    ctx.stroke();

    /* Center */
    ctx.beginPath();

    ctx.arc(
      center,
      center,
      30,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = "#0f172a";
    ctx.fill();

    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 12px Arial, sans-serif";
    ctx.textAlign = "center";

    ctx.fillText(
      "SPIN",
      center,
      center + 4
    );
  }, [names]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  /* -----------------------------
     Tick / Vibration During Spin
  ----------------------------- */

  useEffect(() => {
    if (!spinning) return;

    const interval = window.setInterval(() => {
      playTick();

      if (vibrateOn) {
        try {
          navigator.vibrate?.(12);
        } catch {}
      }
    }, 110);

    return () => window.clearInterval(interval);
  }, [spinning, playTick, vibrateOn]);

  /* -----------------------------
     Add Entry
  ----------------------------- */

  const addName = () => {
    const clean = input.trim();

    if (!clean) return;

    if (names.includes(clean)) {
      alert("This entry is already on the wheel.");
      return;
    }

    setNames((old) => [...old, clean]);
    setInput("");
  };

  /* -----------------------------
     Preset
  ----------------------------- */

  const addMany = (list: string[]) => {
    setNames([...list]);
    setWinner(null);
    setHistory([]);
    setRotation(0);
    rotationRef.current = 0;
  };

  /* -----------------------------
     Spin
  ----------------------------- */

  const spin = () => {
    if (
      spinningRef.current ||
      namesRef.current.length < 2
    ) {
      return;
    }

    spinningRef.current = true;

    setSpinning(true);
    setWinner(null);

    if (vibrateOn) {
      try {
        navigator.vibrate?.(40);
      } catch {}
    }

    const currentNames = [...namesRef.current];

    /*
      IMPORTANT:

      The wheel is now rotated as one complete visual wheel.
      The pointer stays fixed at the top.

      Minimum:
      7 full rotations

      Plus:
      random angle

      This makes the wheel visibly spin around and around.
    */

    const extraRotation =
      360 * 7 + Math.floor(Math.random() * 360);

    const newRotation =
      rotationRef.current + extraRotation;

    rotationRef.current = newRotation;

    setRotation(newRotation);

    /*
      Calculate which segment is under the
      fixed top pointer after rotation.
    */

    const finalAngle =
      ((newRotation % 360) + 360) % 360;

    const pointerAngle = 270;

    let relativeAngle =
      (pointerAngle - finalAngle + 360) % 360;

    const segmentAngle =
      360 / currentNames.length;

    let winnerIndex =
      Math.floor(relativeAngle / segmentAngle);

    if (winnerIndex >= currentNames.length) {
      winnerIndex = currentNames.length - 1;
    }

    window.setTimeout(() => {
      const win = currentNames[winnerIndex];

      setWinner(win);

      setHistory((old) => [
        win,
        ...old,
      ].slice(0, 10));

      setSpinning(false);
      spinningRef.current = false;

      confetti({
        particleCount: 220,
        spread: 100,
        origin: {
          y: 0.55,
        },
        colors: [
          "#16a34a",
          "#eab308",
          "#0ea5e9",
          "#ef4444",
        ],
      });

      if (vibrateOn) {
        try {
          navigator.vibrate?.([
            80,
            40,
            80,
            40,
            150,
          ]);
        } catch {}
      }

      speakWinner(win);

      if (removeWinner) {
        setNames((old) =>
          old.filter((n) => n !== win)
        );
      }
    }, 4800);
  };

  /* -----------------------------
     Copy Winner
  ----------------------------- */

  const copyWinner = async () => {
    if (!winner) return;

    try {
      await navigator.clipboard.writeText(
        `🏆 Winner: ${winner} - Spin Wheel`
      );

      alert("Winner copied!");
    } catch {}
  };

  /* -----------------------------
     Share Winner
  ----------------------------- */

  const shareWinner = async () => {
    if (!winner) return;

    const text =
      `🏆 Winner is ${winner}! ` +
      `Spin Wheel Random Picker`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Spin Wheel Winner",
          text,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Winner details copied!");
      }
    } catch {}
  };

  return (
    <main className="page">

      <style jsx>{`

        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #ffffff;
          color: #0f172a;
          padding: 10px 12px 30px;
          font-family: 'Plus Jakarta Sans', Inter, sans-serif;
          overflow-x: hidden;
        }

        .wrap {
          width: 100%;
          max-width: 900px;
          margin: auto;
        }

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .logo {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .logo span {
          color: #16a34a;
        }

        .topBest {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 700;
          color: #334155;
        }

        .hero {
          text-align: center;
          margin-bottom: 8px;
        }

        .tag {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 999px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          font-size: 10px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        h1 {
          margin: 0;
          font-size: 26px;
          line-height: 1.1;
          letter-spacing: -0.8px;
          font-weight: 800;
        }

        h1 span {
          color: #16a34a;
        }

        .sub {
          color: #64748b;
          max-width: 650px;
          margin: 5px auto 0;
          font-size: 12px;
          line-height: 1.5;
        }

        .presets {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
        }

        .presets::-webkit-scrollbar {
          display: none;
        }

        .preset {
          flex-shrink: 0;
          border: 1px solid #e2e8f0;
          background: #fff;
          border-radius: 999px;
          padding: 7px 12px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          color: #334155;
        }

        .preset:hover {
          border-color: #16a34a;
          color: #15803d;
        }

        .card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 12px;
          box-shadow: 0 6px 24px rgba(15,23,42,0.05);
        }

        .inputRow {
          display: flex;
          gap: 8px;
        }

        .inputRow input {
          flex: 1;
          min-width: 0;
          border: 1.5px solid #e2e8f0;
          background: #ffffff !important;
          color: #0f172a !important;
          -webkit-text-fill-color: #0f172a !important;
          caret-color: #16a34a;
          border-radius: 999px;
          padding: 12px 14px;
          outline: none;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
        }

        .inputRow input::placeholder {
          color: #94a3b8;
          font-weight: 600;
        }

        .inputRow input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.08);
        }

        .addBtn {
          flex-shrink: 0;
          border: 0;
          background: #0f172a;
          color: #fff;
          border-radius: 999px;
          padding: 0 18px;
          font-weight: 800;
          cursor: pointer;
          font-size: 13px;
        }

        .quickRow {
          display: flex;
          gap: 7px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .quick {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          color: #475569;
        }

        .wheelWrap {
          margin-top: 10px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 18px 10px 14px;
          box-shadow: 0 10px 30px rgba(15,23,42,0.06);
          text-align: center;
          overflow: hidden;
        }

        .wheelCenter {
          display: flex;
          justify-content: center;
        }

        /*
          IMPORTANT:
          The wheel itself rotates.
          The pointer does NOT rotate.
        */

        .wheelBox {
          width: 300px;
          height: 300px;
          max-width: 86vw;
          max-height: 86vw;
          position: relative;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wheelRotator {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform-origin: 50% 50%;
          will-change: transform;
        }

        .wheelCanvas {
          width: 100% !important;
          height: 100% !important;
          display: block;
          border-radius: 50%;
        }

        .pointer {
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 30;

          width: 0;
          height: 0;

          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-top: 28px solid #eab308;

          filter:
            drop-shadow(0 3px 4px rgba(0,0,0,0.25));

          pointer-events: none;
        }

        .spinBtn {
          width: 100%;
          max-width: 380px;
          margin-top: 14px;
          border: 0;
          border-radius: 999px;
          padding: 14px;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          background: #16a34a;
          color: #fff;
          box-shadow: 0 8px 24px rgba(22,163,74,0.3);
          position: relative;
          z-index: 10;
        }

        .spinBtn:hover:not(:disabled) {
          background: #15803d;
        }

        .spinBtn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .winnerBox {
          margin: 14px auto 0;
          max-width: 380px;
          background: #f0fdf4;
          border: 2px solid #16a34a;
          border-radius: 16px;
          padding: 14px;
        }

        .winnerLabel {
          font-size: 10px;
          font-weight: 800;
          color: #15803d;
          letter-spacing: 1px;
        }

        .winnerName {
          font-size: 30px;
          font-weight: 800;
          line-height: 1.1;
          margin-top: 4px;
          word-break: break-word;
        }

        .winnerBtns {
          display: flex;
          justify-content: center;
          gap: 7px;
          margin-top: 9px;
          flex-wrap: wrap;
        }

        .wBtn {
          border: 1px solid #e2e8f0;
          background: #fff;
          border-radius: 999px;
          padding: 7px 12px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .history {
          margin-top: 12px;
          text-align: center;
        }

        .chips {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 7px;
        }

        .chip {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
        }

        .listCard {
          margin-top: 12px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 14px;
        }

        .listHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .listHead b {
          font-size: 13px;
        }

        .listHead span {
          font-size: 10px;
          color: #94a3b8;
          font-weight: 700;
        }

        .namesList {
          margin-top: 10px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          max-height: 240px;
          overflow: auto;
        }

        .nameItem {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          padding: 8px 10px;
          font-size: 13px;
          font-weight: 700;
          min-width: 0;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 7px;
          flex-shrink: 0;
        }

        .remove {
          border: 0;
          background: transparent;
          color: #ef4444;
          font-size: 18px;
          cursor: pointer;
          line-height: 1;
        }

        .toggles {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 12px;
        }

        .toggle {
          border: 1px solid #e2e8f0;
          background: #fff;
          border-radius: 999px;
          padding: 7px 12px;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
        }

        .toggle.on {
          background: #f0fdf4;
          border-color: #bbf7d0;
          color: #15803d;
        }

        .toggleRow {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 9px;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
        }

        .toggleRow input {
          accent-color: #16a34a;
          width: 15px;
          height: 15px;
        }

        .content {
          margin-top: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
        }

        .content h2 {
          margin: 0 0 7px;
          font-size: 17px;
          font-weight: 800;
        }

        .content h3 {
          margin: 12px 0 4px;
          font-size: 13px;
          font-weight: 800;
        }

        .content p {
          color: #64748b;
          font-size: 12px;
          line-height: 1.7;
        }

        .keywordLine {
          margin-top: 8px;
          font-size: 11px;
          color: #64748b;
          line-height: 1.7;
        }

        .footer {
          text-align: center;
          margin-top: 14px;
          color: #94a3b8;
          font-size: 10px;
        }

        @media (max-width: 620px) {
          .namesList {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 24px;
          }

          .wheelBox {
            width: 290px;
            height: 290px;
          }
        }

      `}</style>

      <div className="wrap">

        {/* TOP */}
        <header className="top">
          <div className="logo">
            thenexoratools<span>.com</span>
          </div>

          <div className="topBest">
            🎡 {names.length} Entries
          </div>
        </header>

        {/* HERO */}
        <section className="hero">

          <div className="tag">
            🎡 FREE • NO SIGN UP • RANDOM PICKER
          </div>

          <h1>
            Spin Wheel <span>- Random Name Picker</span>
          </h1>

          <p className="sub">
            Spin the wheel to randomly pick a winner, name,
            team, student, decision, or choice in seconds.
          </p>

        </section>

        {/* PRESETS */}
        <div className="presets">

          {Object.keys(PRESETS).map((key) => (
            <button
              key={key}
              className="preset"
              onClick={() => addMany(PRESETS[key])}
            >
              {key}
            </button>
          ))}

        </div>

        {/* INPUT */}
        <div className="card">

          <div className="inputRow">

            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addName();
                }
              }}
              placeholder="Enter a name or option..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />

            <button
              onClick={addName}
              className="addBtn"
            >
              + Add
            </button>

          </div>

          <div className="quickRow">

            <button
              className="quick"
              onClick={() => {
                setNames([]);
                setWinner(null);
                setHistory([]);
                setRotation(0);
                rotationRef.current = 0;
              }}
            >
              🗑️ Clear All
            </button>

            <button
              className="quick"
              onClick={() => {
                const shuffled = [...names];

                for (
                  let i = shuffled.length - 1;
                  i > 0;
                  i--
                ) {
                  const j =
                    Math.floor(
                      Math.random() * (i + 1)
                    );

                  [
                    shuffled[i],
                    shuffled[j],
                  ] = [
                    shuffled[j],
                    shuffled[i],
                  ];
                }

                setNames(shuffled);
              }}
            >
              🔀 Shuffle
            </button>

            <button
              className="quick"
              onClick={() =>
                addMany(PRESETS["🎁 Giveaway"])
              }
            >
              ✨ Demo Names
            </button>

          </div>

          {/* ELIMINATION */}
          <label className="toggleRow">

            <input
              type="checkbox"
              checked={removeWinner}
              onChange={(e) =>
                setRemoveWinner(e.target.checked)
              }
            />

            Automatically remove the winner
            after each spin (Elimination Mode)

          </label>

        </div>

        {/* WHEEL */}
        <div className="wheelWrap">

          <div className="wheelCenter">

            <div className="wheelBox">

              {/* FIXED POINTER */}
              <div className="pointer" />

              {/* ONLY THIS ROTATES */}
              <div
                className="wheelRotator"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning
                    ? "transform 4.8s cubic-bezier(0.12, 0.8, 0.08, 1)"
                    : "none",
                }}
              >

                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="wheelCanvas"
                />

              </div>

            </div>

          </div>

          {/* SPIN BUTTON */}
          <button
            onClick={spin}
            disabled={
              spinning ||
              names.length < 2
            }
            className="spinBtn"
          >
            {spinning
              ? "Spinning... 🎡"
              : "🎡 SPIN THE WHEEL"}
          </button>

          <p
            style={{
              fontSize: 11,
              color: "#94a3b8",
              marginTop: 7,
              fontWeight: 600,
            }}
          >
            {names.length < 2
              ? "Add at least 2 entries to spin"
              : "The pointer determines the winner"}
          </p>

          {/* WINNER */}
          {winner && (
            <div className="winnerBox">

              <div className="winnerLabel">
                🏆 WINNER
              </div>

              <div className="winnerName">
                {winner}
              </div>

              <div className="winnerBtns">

                <button
                  className="wBtn"
                  onClick={copyWinner}
                >
                  📋 Copy Winner
                </button>

                <button
                  className="wBtn"
                  onClick={shareWinner}
                >
                  📤 Share Winner
                </button>

                <button
                  className="wBtn"
                  onClick={spin}
                >
                  ↻ Spin Again
                </button>

              </div>

            </div>
          )}

          {/* HISTORY */}
          {history.length > 0 && (
            <div className="history">

              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#94a3b8",
                }}
              >
                RECENT WINNERS
              </div>

              <div className="chips">

                {history.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="chip"
                  >
                    🏆 {item}
                  </span>
                ))}

              </div>

            </div>
          )}

        </div>

        {/* ENTRIES */}
        <div className="listCard">

          <div className="listHead">

            <b>
              Entries ({names.length})
            </b>

            <span>
              Tap × to remove
            </span>

          </div>

          <div className="namesList">

            {names.map((name, index) => (
              <div
                key={`${name}-${index}`}
                className="nameItem"
              >

                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >

                  <span
                    className="dot"
                    style={{
                      background:
                        COLORS[
                          index % COLORS.length
                        ],
                    }}
                  />

                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {name}
                  </span>

                </span>

                <button
                  className="remove"
                  onClick={() =>
                    setNames((old) =>
                      old.filter(
                        (_, i) => i !== index
                      )
                    )
                  }
                  aria-label={`Remove ${name}`}
                >
                  ×
                </button>

              </div>
            ))}

            {names.length === 0 && (
              <p
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  textAlign: "center",
                  gridColumn: "1 / -1",
                  padding: 20,
                }}
              >
                No entries yet. Add a name above to
                create your random wheel.
              </p>
            )}

          </div>

        </div>

        {/* SETTINGS */}
        <div className="toggles">

          <button
            className={`toggle ${
              soundOn ? "on" : ""
            }`}
            onClick={() =>
              setSoundOn((value) => !value)
            }
          >
            {soundOn
              ? "🔊 Tick Sound ON"
              : "🔇 Tick Sound OFF"}
          </button>

          <button
            className={`toggle ${
              vibrateOn ? "on" : ""
            }`}
            onClick={() =>
              setVibrateOn((value) => !value)
            }
          >
            {vibrateOn
              ? "📳 Vibration ON"
              : "📳 Vibration OFF"}
          </button>

          <button
            className={`toggle ${
              voiceOn ? "on" : ""
            }`}
            onClick={() =>
              setVoiceOn((value) => !value)
            }
          >
            {voiceOn
              ? "🗣️ Winner Voice ON"
              : "🗣️ Winner Voice OFF"}
          </button>

        </div>

        {/* SEO CONTENT */}
        <section className="content">

          <h2>
            Free Spin Wheel - Random Name Picker
          </h2>

          <p>
            Use this free spin wheel and random name picker
            to choose a winner, student, team, activity,
            food option, or random decision. Enter your
            entries, spin the wheel, and let the fixed
            pointer select a random result.
          </p>

          <h3>
            Random Wheel for Giveaways
          </h3>

          <p>
            Create a simple giveaway picker for contests,
            promotions, social media giveaways, classroom
            activities, raffles, and random winner selection.
            Add names and spin the wheel to select a winner.
          </p>

          <h3>
            Classroom Randomizer and Student Picker
          </h3>

          <p>
            Teachers and students can use the wheel as a
            classroom randomizer, student picker, group
            selector, or activity picker. Add student names
            and spin the wheel whenever you need a random
            selection.
          </p>

          <h3>
            Team Picker and Decision Wheel
          </h3>

          <p>
            Use the random wheel to create teams, choose
            between options, make quick decisions, select
            activities, or decide what to eat. Presets for
            Yes or No, Team Picker, Truth or Dare, and food
            choices are included.
          </p>

          <h3>
            How to Use the Spin Wheel
          </h3>

          <p>
            1. Enter your names or options.
            2. Add as many entries as you need.
            3. Choose a preset or create your own list.
            4. Press Spin the Wheel.
            5. The fixed pointer shows the selected winner.
          </p>

          <p className="keywordLine">
            Popular uses include random name picker, spin
            the wheel, wheel spinner, picker wheel, random
            wheel, random picker, giveaway picker, winner
            picker, classroom randomizer, student picker,
            team picker, decision wheel, yes or no wheel,
            random choice generator, and contest winner
            picker.
          </p>

        </section>

        <div className="footer">
          © {new Date().getFullYear()} thenexoratools.com
        </div>

      </div>

    </main>
  );
}
