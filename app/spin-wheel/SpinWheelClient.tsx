"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

const PRESETS = [
  {
    name: "🎁 Giveaway",
    items: [
      "Ayush",
      "Rahul",
      "Priya",
      "Aman",
      "Sneha",
      "Vikash",
      "Neha",
      "Rohan",
    ],
  },
  {
    name: "🏫 Classroom",
    items: [
      "Aarav",
      "Diya",
      "Kabir",
      "Meera",
      "Arjun",
      "Anaya",
      "Vihaan",
      "Zara",
    ],
  },
  {
    name: "✅ Yes / No",
    items: ["Yes", "No"],
  },
  {
    name: "🍔 What to Eat?",
    items: [
      "Pizza",
      "Burger",
      "Momos",
      "Biryani",
      "Chole Bhature",
      "Pasta",
      "Sandwich",
      "Chai",
    ],
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
  const tickTimerRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const audioRef = useRef<AudioContext | null>(null);

  const rotationRef = useRef(0);
  const namesRef = useRef<string[]>([]);
  const spinningRef = useRef(false);

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
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const [removeWinner, setRemoveWinner] =
    useState(false);

  const [soundOn, setSoundOn] =
    useState(true);

  const [vibrateOn, setVibrateOn] =
    useState(true);

  const [voiceOn, setVoiceOn] =
    useState(false);

  /* ---------------------------------------------
     KEEP REF IN SYNC
  --------------------------------------------- */

  useEffect(() => {
    namesRef.current = names;
  }, [names]);

  /* ---------------------------------------------
     DRAW WHEEL
  --------------------------------------------- */

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

    ctx.clearRect(
      0,
      0,
      size,
      size
    );

    const list = namesRef.current;

    if (list.length === 0) {
      ctx.beginPath();
      ctx.arc(
        center,
        center,
        radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = "#111827";
      ctx.fill();

      ctx.fillStyle = "#94a3b8";
      ctx.font =
        "800 30px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(
        "Add choices",
        center,
        center
      );

      return;
    }

    const slice =
      (Math.PI * 2) / list.length;

    /* Outer shadow */

    ctx.beginPath();

    ctx.arc(
      center,
      center,
      radius + 12,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = "#020617";
    ctx.fill();

    /* Wheel slices */

    list.forEach((name, index) => {
      const start =
        index * slice;

      const end =
        start + slice;

      ctx.beginPath();

      ctx.moveTo(
        center,
        center
      );

      ctx.arc(
        center,
        center,
        radius,
        start,
        end
      );

      ctx.closePath();

      ctx.fillStyle =
        COLORS[index % COLORS.length];

      ctx.fill();

      ctx.strokeStyle =
        "rgba(255,255,255,0.42)";

      ctx.lineWidth = 4;

      ctx.stroke();

      /* Text */

      const middle =
        start + slice / 2;

      ctx.save();

      ctx.translate(
        center +
          Math.cos(middle) *
            radius *
            0.67,

        center +
          Math.sin(middle) *
            radius *
            0.67
      );

      let textAngle = middle;

      if (
        textAngle >
          Math.PI / 2 &&
        textAngle <
          Math.PI * 1.5
      ) {
        textAngle += Math.PI;
      }

      ctx.rotate(textAngle);

      ctx.font =
        "900 27px Arial, sans-serif";

      ctx.fillStyle = "#ffffff";

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.shadowColor =
        "rgba(0,0,0,0.55)";

      ctx.shadowBlur = 6;

      const maxWidth =
        radius * 0.48;

      let label = name;

      while (
        label.length > 4 &&
        ctx.measureText(label).width >
          maxWidth
      ) {
        label =
          label.slice(0, -1);
      }

      if (label !== name) {
        label += "…";
      }

      ctx.fillText(
        label,
        0,
        0
      );

      ctx.restore();
    });

    /* Outer border */

    ctx.beginPath();

    ctx.arc(
      center,
      center,
      radius,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 8;

    ctx.stroke();

    /* Center */

    ctx.beginPath();

    ctx.arc(
      center,
      center,
      78,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = "#020617";
    ctx.fill();

    ctx.beginPath();

    ctx.arc(
      center,
      center,
      73,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 6;

    ctx.stroke();

    ctx.fillStyle = "#ffffff";

    ctx.font =
      "950 24px Arial, sans-serif";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowBlur = 0;

    ctx.fillText(
      "SPIN",
      center,
      center
    );
  }, []);

  /* ---------------------------------------------
     INITIAL DRAW
  --------------------------------------------- */

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  /* ---------------------------------------------
     REDRAW WHEN NAMES CHANGE
  --------------------------------------------- */

  useEffect(() => {
    drawWheel();
  }, [names, drawWheel]);

  /* ---------------------------------------------
     SOUND
  --------------------------------------------- */

  const playTick = useCallback(() => {
    if (!soundOn) return;

    try {
      if (!audioRef.current) {
        audioRef.current =
          new AudioContext();
      }

      const audio =
        audioRef.current;

      if (
        audio.state ===
        "suspended"
      ) {
        audio.resume();
      }

      const oscillator =
        audio.createOscillator();

      const gain =
        audio.createGain();

      oscillator.type =
        "square";

      oscillator.frequency.value =
        850;

      gain.gain.setValueAtTime(
        0.0001,
        audio.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.07,
        audio.currentTime + 0.005
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audio.currentTime + 0.035
      );

      oscillator.connect(gain);
      gain.connect(audio.destination);

      oscillator.start();

      oscillator.stop(
        audio.currentTime + 0.04
      );
    } catch {}
  }, [soundOn]);

  /* ---------------------------------------------
     VIBRATION
  --------------------------------------------- */

  const vibrate = useCallback(() => {
    if (!vibrateOn) return;

    try {
      if (
        typeof navigator !==
          "undefined" &&
        "vibrate" in navigator
      ) {
        navigator.vibrate(10);
      }
    } catch {}
  }, [vibrateOn]);

  /* ---------------------------------------------
     APPLY ROTATION DIRECTLY
  --------------------------------------------- */

  const applyRotation = (
    degrees: number
  ) => {
    rotationRef.current =
      degrees;

    const wheel =
      wheelRef.current;

    if (wheel) {
      wheel.style.transform =
        `rotate(${degrees}deg)`;
    }
  };

  /* ---------------------------------------------
     RESET
  --------------------------------------------- */

  const resetWheel = () => {
    if (animationRef.current) {
      cancelAnimationFrame(
        animationRef.current
      );

      animationRef.current =
        null;
    }

    if (tickTimerRef.current) {
      clearInterval(
        tickTimerRef.current
      );

      tickTimerRef.current =
        null;
    }

    applyRotation(0);
  };

  /* ---------------------------------------------
     PRESET
  --------------------------------------------- */

  const loadPreset = (
    items: string[]
  ) => {
    if (spinningRef.current) return;

    namesRef.current = [
      ...items,
    ];

    setNames([
      ...items,
    ]);

    setWinner(null);
    setHistory([]);

    resetWheel();
  };

  /* ---------------------------------------------
     ADD NAME
  --------------------------------------------- */

  const addName = () => {
    if (spinningRef.current)
      return;

    const value =
      input.trim();

    if (!value) return;

    const exists =
      namesRef.current.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      );

    if (exists) {
      setInput("");
      return;
    }

    const updated = [
      ...namesRef.current,
      value,
    ];

    namesRef.current =
      updated;

    setNames(updated);

    setInput("");
    setWinner(null);
  };

  /* ---------------------------------------------
     REMOVE NAME
  --------------------------------------------- */

  const removeName = (
    index: number
  ) => {
    if (spinningRef.current)
      return;

    const updated =
      namesRef.current.filter(
        (_, i) =>
          i !== index
      );

    namesRef.current =
      updated;

    setNames(updated);

    setWinner(null);
  };

  /* ---------------------------------------------
     BULK ADD
  --------------------------------------------- */

  const addMany = (
    value: string
  ) => {
    if (spinningRef.current)
      return;

    const values =
      value
        .split(/\n|,/)
        .map((x) =>
          x.trim()
        )
        .filter(Boolean);

    const unique =
      Array.from(
        new Set(values)
      );

    namesRef.current =
      unique;

    setNames(unique);

    setWinner(null);
    setHistory([]);

    resetWheel();
  };

  /* ---------------------------------------------
     SPIN
  --------------------------------------------- */

  const spin = () => {
    if (
      spinningRef.current
    ) {
      return;
    }

    const current =
      namesRef.current;

    if (current.length < 2) {
      return;
    }

    if (
      animationRef.current
    ) {
      cancelAnimationFrame(
        animationRef.current
      );
    }

    /* Start */

    spinningRef.current =
      true;

    setSpinning(true);
    setWinner(null);

    vibrate();

    /* -----------------------------------------
       IMPORTANT:
       9 FULL ROTATIONS + RANDOM ANGLE
    ----------------------------------------- */

    const startRotation =
      rotationRef.current;

    const randomAngle =
      Math.random() * 360;

    const totalRotation =
      360 * 9 +
      randomAngle;

    const finalRotation =
      startRotation +
      totalRotation;

    /* 5.8 seconds */

    const duration = 5800;

    const startTime =
      performance.now();

    /* -----------------------------------------
       TICK SOUND
    ----------------------------------------- */

    if (tickTimerRef.current) {
      clearInterval(
        tickTimerRef.current
      );
    }

    tickTimerRef.current =
      setInterval(() => {
        playTick();
        vibrate();
      }, 90);

    /* -----------------------------------------
       ANIMATION LOOP
    ----------------------------------------- */

    const animate = (
      now: number
    ) => {
      const elapsed =
        now - startTime;

      let progress =
        elapsed /
        duration;

      if (progress > 1) {
        progress = 1;
      }

      /*
        Smooth deceleration.

        Start fast.
        Middle fast.
        End slowly.
      */

      const eased =
        1 -
        Math.pow(
          1 - progress,
          4
        );

      const currentRotation =
        startRotation +
        totalRotation *
          eased;

      /*
        THIS IS THE IMPORTANT PART.

        We directly update the actual
        wheel element every animation frame.

        No CSS transition.
        No React state animation.
      */

      applyRotation(
        currentRotation
      );

      if (progress < 1) {
        animationRef.current =
          requestAnimationFrame(
            animate
          );

        return;
      }

      /* ---------------------------------------
         FINAL POSITION
      --------------------------------------- */

      applyRotation(
        finalRotation
      );

      animationRef.current =
        null;

      if (tickTimerRef.current) {
        clearInterval(
          tickTimerRef.current
        );

        tickTimerRef.current =
          null;
      }

      /* ---------------------------------------
         FIND WINNER
      --------------------------------------- */

      const segment =
        360 /
        current.length;

      const normalized =
        ((finalRotation %
          360) +
          360) %
        360;

      /*
        Pointer = 12 o'clock.

        Canvas starts at 3 o'clock.
        Therefore pointer angle = 270°.
      */

      const pointerAngle =
        270;

      let relative =
        pointerAngle -
        normalized;

      relative =
        ((relative %
          360) +
          360) %
        360;

      const winnerIndex =
        Math.floor(
          relative /
            segment
        );

      const selected =
        current[
          winnerIndex %
            current.length
        ];

      /* ---------------------------------------
         RESULT
      --------------------------------------- */

      setWinner(
        selected
      );

      setHistory(
        (previous) => [
          selected,
          ...previous.filter(
            (item) =>
              item !==
              selected
          ),
        ].slice(0, 10)
      );

      spinningRef.current =
        false;

      setSpinning(false);

      /* ---------------------------------------
         CONFETTI
      --------------------------------------- */

      confetti({
        particleCount: 160,
        spread: 95,
        startVelocity: 35,
        origin: {
          x: 0.5,
          y: 0.62,
        },
      });

      /* ---------------------------------------
         VOICE
      --------------------------------------- */

      if (
        voiceOn &&
        typeof window !==
          "undefined" &&
        "speechSynthesis" in
          window
      ) {
        try {
          window.speechSynthesis.cancel();

          const speech =
            new SpeechSynthesisUtterance(
              `Winner is ${selected}`
            );

          speech.rate = 0.9;
          speech.pitch = 1;

          window.speechSynthesis.speak(
            speech
          );
        } catch {}
      }

      /* ---------------------------------------
         REMOVE WINNER
      --------------------------------------- */

      if (
        removeWinner
      ) {
        const remaining =
          current.filter(
            (name) =>
              name !==
              selected
          );

        namesRef.current =
          remaining;

        setNames(
          remaining
        );

        setTimeout(() => {
          drawWheel();
        }, 30);
      }
    };

    animationRef.current =
      requestAnimationFrame(
        animate
      );
  };

  /* ---------------------------------------------
     CLEANUP
  --------------------------------------------- */

  useEffect(() => {
    return () => {
      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      if (
        tickTimerRef.current
      ) {
        clearInterval(
          tickTimerRef.current
        );
      }

      try {
        audioRef.current?.close();
      } catch {}
    };
  }, []);

  return (
    <main className="page">
      <div className="container">

        {/* HEADER */}

        <header className="header">
          <div>
            <div className="brand">
              NEXORA
            </div>

            <h1>
              Spin Wheel
            </h1>

            <p className="subtitle">
              Random Name Picker & Wheel Spinner
            </p>
          </div>

          <div className="badge">
            FREE
          </div>
        </header>

        {/* SEO INTRO */}

        <section className="seoIntro">
          <h2>
            Free Random Spin Wheel
          </h2>

          <p>
            Use this free spin wheel to
            randomly pick a name, winner,
            student, team, giveaway entry,
            or make a quick decision.
            Add your choices and spin the
            wheel instantly.
          </p>
        </section>

        {/* PRESETS */}

        <section className="presets">
          <div className="sectionTitle">
            Quick Picks
          </div>

          <div className="presetGrid">
            {PRESETS.map(
              (preset) => (
                <button
                  key={
                    preset.name
                  }
                  className="presetButton"
                  onClick={() =>
                    loadPreset(
                      preset.items
                    )
                  }
                  disabled={
                    spinning
                  }
                >
                  {
                    preset.name
                  }
                </button>
              )
            )}
          </div>
        </section>

        {/* MAIN */}

        <div className="layout">

          {/* CONTROLS */}

          <section className="panel controls">

            <div className="panelHeader">
              <div>
                <h2>
                  Your Choices
                </h2>

                <p>
                  Add names or options
                </p>
              </div>

              <span className="count">
                {names.length}
              </span>
            </div>

            {/* ADD */}

            <div className="addRow">
              <input
                value={input}
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    addName();
                  }
                }}
                placeholder="Enter a name or choice..."
                disabled={
                  spinning
                }
              />

              <button
                className="addButton"
                onClick={
                  addName
                }
                disabled={
                  spinning
                }
              >
                Add
              </button>
            </div>

            {/* NAME LIST */}

            <div className="nameList">
              {names.map(
                (
                  name,
                  index
                ) => (
                  <div
                    className="nameItem"
                    key={`${name}-${index}`}
                  >
                    <span className="number">
                      {index +
                        1}
                    </span>

                    <span className="name">
                      {name}
                    </span>

                    <button
                      className="removeButton"
                      onClick={() =>
                        removeName(
                          index
                        )
                      }
                      disabled={
                        spinning
                      }
                    >
                      ×
                    </button>
                  </div>
                )
              )}

              {names.length ===
                0 && (
                <div className="empty">
                  Add at least
                  two choices
                  to spin the
                  wheel.
                </div>
              )}
            </div>

            {/* BULK */}

            <details className="bulk">
              <summary>
                Add multiple choices
              </summary>

              <textarea
                placeholder="One per line or separated by commas"
                disabled={
                  spinning
                }
                onBlur={(e) => {
                  if (
                    e.target.value.trim()
                  ) {
                    addMany(
                      e.target.value
                    );

                    e.target.value =
                      "";
                  }
                }}
              />
            </details>

            {/* SETTINGS */}

            <div className="settings">

              <label className="setting">
                <span>
                  🔊 Sound
                </span>

                <input
                  type="checkbox"
                  checked={
                    soundOn
                  }
                  onChange={(
                    e
                  ) =>
                    setSoundOn(
                      e.target
                        .checked
                    )
                  }
                />
              </label>

              <label className="setting">
                <span>
                  📳 Vibration
                </span>

                <input
                  type="checkbox"
                  checked={
                    vibrateOn
                  }
                  onChange={(
                    e
                  ) =>
                    setVibrateOn(
                      e.target
                        .checked
                    )
                  }
                />
              </label>

              <label className="setting">
                <span>
                  🔊 Announce winner
                </span>

                <input
                  type="checkbox"
                  checked={
                    voiceOn
                  }
                  onChange={(
                    e
                  ) =>
                    setVoiceOn(
                      e.target
                        .checked
                    )
                  }
                />
              </label>

              <label className="setting">
                <span>
                  🗑️ Remove winner
                </span>

                <input
                  type="checkbox"
                  checked={
                    removeWinner
                  }
                  onChange={(
                    e
                  ) =>
                    setRemoveWinner(
                      e.target
                        .checked
                    )
                  }
                />
              </label>

            </div>
          </section>

          {/* WHEEL */}

          <section className="panel wheelPanel">

            {/* POINTER */}

            <div className="pointer">
              <div className="pointerInner" />
            </div>

            {/* ROTATING WHEEL */}

            <div
              ref={
                wheelRef
              }
              className="wheelRotator"
            >
              <canvas
                ref={
                  canvasRef
                }
                className="wheelCanvas"
              />
            </div>

            {/* BUTTON */}

            <button
              className="spinButton"
              onClick={
                spin
              }
              disabled={
                spinning ||
                names.length <
                  2
              }
            >
              {spinning
                ? "SPINNING..."
                : "SPIN THE WHEEL"}
            </button>

            {/* WINNER */}

            <div
              className={`result ${
                winner
                  ? "show"
                  : ""
              }`}
            >
              {winner && (
                <>
                  <span className="winnerLabel">
                    WINNER
                  </span>

                  <strong>
                    {winner}
                  </strong>
                </>
              )}
            </div>

            {/* HISTORY */}

            {history.length >
              0 && (
              <div className="history">

                <div className="historyTitle">
                  Recent Winners
                </div>

                <div className="historyList">
                  {history.map(
                    (
                      item,
                      index
                    ) => (
                      <span
                        key={`${item}-${index}`}
                        className="historyItem"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>

              </div>
            )}

          </section>
        </div>

        {/* SEO CONTENT */}

        <section className="seoContent">

          <h2>
            Random Wheel & Name Picker
          </h2>

          <p>
            This online random wheel is
            useful for giveaways, contests,
            classrooms, team selection,
            games, raffles, random decisions
            and choosing a winner fairly.
          </p>

          <div className="seoGrid">

            <div>
              <h3>
                Giveaway Winner Picker
              </h3>

              <p>
                Enter your participants
                and spin the wheel to
                randomly select a giveaway
                or contest winner.
              </p>
            </div>

            <div>
              <h3>
                Classroom Randomizer
              </h3>

              <p>
                Pick students randomly
                for activities, questions,
                teams or classroom tasks.
              </p>
            </div>

            <div>
              <h3>
                Random Decision Wheel
              </h3>

              <p>
                Add your options and let
                the random wheel make
                the choice for you.
              </p>
            </div>

            <div>
              <h3>
                Team Picker
              </h3>

              <p>
                Quickly select teams or
                randomly assign participants
                using the wheel spinner.
              </p>
            </div>

          </div>

          <p className="keywords">
            Spin Wheel · Random Name Picker ·
            Wheel Spinner · Picker Wheel ·
            Random Wheel · Random Picker ·
            Giveaway Picker · Winner Picker ·
            Classroom Randomizer · Student Picker ·
            Team Picker · Decision Wheel ·
            Yes or No Wheel · Random Choice Generator
          </p>

        </section>

      </div>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top,
              #111827 0%,
              #080d1b 48%,
              #050814 100%
            );
          color: white;
          padding: 28px 16px 70px;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .brand {
          color: #27d5c3;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 3px;
          margin-bottom: 8px;
        }

        h1 {
          margin: 0;
          font-size: clamp(
            30px,
            5vw,
            48px
          );
          line-height: 1;
          font-weight: 950;
        }

        .subtitle {
          margin: 10px 0 0;
          color: #94a3b8;
          font-size: 15px;
        }

        .badge {
          padding: 8px 12px;
          border-radius: 999px;
          background:
            rgba(
              124,
              108,
              255,
              0.14
            );
          border: 1px solid
            rgba(
              124,
              108,
              255,
              0.35
            );
          color: #c4b5fd;
          font-size: 10px;
          font-weight: 950;
        }

        .seoIntro {
          background:
            rgba(
              15,
              23,
              42,
              0.8
            );
          border: 1px solid
            rgba(
              148,
              163,
              184,
              0.13
            );
          border-radius: 18px;
          padding: 18px;
          margin-bottom: 18px;
        }

        .seoIntro h2 {
          margin: 0 0 7px;
          font-size: 20px;
        }

        .seoIntro p {
          margin: 0;
          color: #94a3b8;
          line-height: 1.7;
          font-size: 14px;
        }

        .presets {
          margin-bottom: 18px;
        }

        .sectionTitle {
          color: #cbd5e1;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 9px;
        }

        .presetGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .presetButton {
          border: 1px solid #263247;
          background: #111827;
          color: #e2e8f0;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .presetButton:hover {
          border-color: #7c6cff;
        }

        .presetButton:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .layout {
          display: grid;
          grid-template-columns:
            minmax(280px, 0.8fr)
            minmax(360px, 1.2fr);
          gap: 18px;
          align-items: stretch;
        }

        .panel {
          background:
            rgba(
              15,
              23,
              42,
              0.84
            );
          border: 1px solid
            rgba(
              148,
              163,
              184,
              0.13
            );
          border-radius: 22px;
          box-shadow:
            0 20px 70px
              rgba(
                0,
                0,
                0,
                0.25
              );
        }

        .controls {
          padding: 20px;
        }

        .panelHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .panelHeader h2 {
          margin: 0;
          font-size: 20px;
        }

        .panelHeader p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .count {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #1e293b;
          color: #c4b5fd;
          font-size: 12px;
          font-weight: 950;
        }

        .addRow {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .addRow input {
          flex: 1;
          min-width: 0;
          background: #080d1b;
          border: 1px solid #263247;
          border-radius: 10px;
          padding: 12px;
          color: white;
          outline: none;
          font-size: 13px;
        }

        .addRow input:focus {
          border-color: #7c6cff;
        }

        .addButton {
          border: 0;
          background: #7c6cff;
          color: white;
          border-radius: 10px;
          padding: 0 16px;
          font-weight: 950;
          cursor: pointer;
        }

        .nameList {
          max-height: 310px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nameItem {
          display: flex;
          align-items: center;
          gap: 9px;
          background: #0b1222;
          border: 1px solid #172238;
          border-radius: 10px;
          padding: 8px 10px;
        }

        .number {
          width: 24px;
          height: 24px;
          border-radius: 7px;
          display: grid;
          place-items: center;
          background: #1e293b;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 950;
        }

        .name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          font-weight: 800;
        }

        .removeButton {
          width: 27px;
          height: 27px;
          border: 0;
          background: transparent;
          color: #64748b;
          font-size: 20px;
          cursor: pointer;
          border-radius: 7px;
        }

        .removeButton:hover {
          color: #f87171;
          background:
            rgba(
              248,
              113,
              113,
              0.1
            );
        }

        .empty {
          text-align: center;
          color: #64748b;
          padding: 30px 10px;
          font-size: 13px;
        }

        .bulk {
          margin-top: 13px;
          color: #94a3b8;
          font-size: 12px;
        }

        .bulk summary {
          cursor: pointer;
          font-weight: 800;
        }

        .bulk textarea {
          width: 100%;
          min-height: 90px;
          margin-top: 8px;
          resize: vertical;
          background: #080d1b;
          border: 1px solid #263247;
          border-radius: 10px;
          color: white;
          padding: 10px;
          outline: none;
          font-size: 12px;
        }

        .settings {
          display: grid;
          gap: 7px;
          margin-top: 15px;
        }

        .setting {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 10px;
          background: #0b1222;
          border: 1px solid #172238;
          border-radius: 9px;
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 700;
        }

        .setting input {
          accent-color: #7c6cff;
        }

        /* ==============================
           WHEEL
        ============================== */

        .wheelPanel {
          min-height: 620px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .wheelPanel::before {
          content: "";
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(
                124,
                108,
                255,
                0.12
              ),
              transparent 68%
            );
          pointer-events: none;
        }

        /*
          IMPORTANT:
          There is NO CSS transition here.

          JavaScript requestAnimationFrame
          controls the rotation directly.
        */

        .wheelRotator {
          position: relative;
          z-index: 2;
          width: min(
            100%,
            500px
          );
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          transform-origin: center center;
          will-change: transform;
          transform: rotate(0deg);
        }

        .wheelCanvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
          border-radius: 50%;
        }

        /* POINTER */

        .pointer {
          position: absolute;
          z-index: 20;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;

          border-left:
            19px solid transparent;

          border-right:
            19px solid transparent;

          border-top:
            38px solid white;

          filter:
            drop-shadow(
              0 4px 6px
                rgba(
                  0,
                  0,
                  0,
                  0.6
                )
            );
        }

        .pointerInner {
          position: absolute;
          left: -12px;
          top: -34px;
          width: 0;
          height: 0;

          border-left:
            12px solid transparent;

          border-right:
            12px solid transparent;

          border-top:
            25px solid #ef4444;
        }

        .spinButton {
          position: relative;
          z-index: 5;
          width: min(
            100%,
            360px
          );
          margin-top: 20px;
          padding: 15px 18px;
          border: 0;
          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #7c6cff,
              #5b4de8
            );

          color: white;
          font-size: 15px;
          font-weight: 950;
          letter-spacing: 0.5px;

          box-shadow:
            0 12px 35px
              rgba(
                124,
                108,
                255,
                0.28
              );

          cursor: pointer;
        }

        .spinButton:active {
          transform: scale(0.98);
        }

        .spinButton:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .result {
          position: relative;
          z-index: 4;
          min-height: 75px;
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .result.show {
          animation:
            winnerPop
              0.45s
              ease-out;
        }

        .winnerLabel {
          color: #fbbf24;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .result strong {
          margin-top: 3px;
          font-size: clamp(
            24px,
            5vw,
            36px
          );
          font-weight: 950;

          background:
            linear-gradient(
              90deg,
              white,
              #c4b5fd,
              #67e8f9
            );

          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .history {
          width: 100%;
          max-width: 500px;
          position: relative;
          z-index: 4;
          margin-top: 8px;
        }

        .historyTitle {
          margin-bottom: 7px;
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .historyList {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .historyItem {
          padding: 5px 9px;
          border-radius: 999px;
          background: #111827;
          border: 1px solid #263247;
          color: #cbd5e1;
          font-size: 10px;
          font-weight: 800;
        }

        /* SEO */

        .seoContent {
          margin-top: 20px;
          padding: 22px;
          background:
            rgba(
              15,
              23,
              42,
              0.65
            );
          border: 1px solid
            rgba(
              148,
              163,
              184,
              0.12
            );
          border-radius: 20px;
        }

        .seoContent h2 {
          margin: 0 0 9px;
          font-size: 22px;
        }

        .seoContent > p {
          margin: 0;
          color: #94a3b8;
          line-height: 1.7;
          font-size: 13px;
        }

        .seoGrid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 12px;
          margin-top: 18px;
        }

        .seoGrid > div {
          padding: 14px;
          background: #0b1222;
          border: 1px solid #172238;
          border-radius: 13px;
        }

        .seoGrid h3 {
          margin: 0 0 6px;
          font-size: 13px;
        }

        .seoGrid p {
          margin: 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.6;
        }

        .keywords {
          margin-top: 17px !important;
          color: #475569 !important;
          font-size: 10px !important;
        }

        @keyframes winnerPop {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }

          70% {
            transform: scale(1.08);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 850px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .wheelPanel {
            min-height: 0;
            padding: 20px 14px 25px;
          }

          .wheelRotator {
            width: min(
              100%,
              460px
            );
          }

          .seoGrid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 520px) {
          .page {
            padding:
              20px 10px 50px;
          }

          .header {
            margin-bottom: 15px;
          }

          h1 {
            font-size: 30px;
          }

          .subtitle {
            font-size: 13px;
          }

          .presetGrid {
            display: grid;
            grid-template-columns:
              repeat(2, 1fr);
          }

          .presetButton {
            width: 100%;
            padding: 9px 6px;
          }

          .controls {
            padding: 15px;
          }

          .wheelPanel {
            border-radius: 18px;
          }

          .wheelRotator {
            width: 100%;
          }

          .pointer {
            top: 10px;
          }

          .spinButton {
            margin-top: 15px;
          }

          .seoGrid {
            grid-template-columns: 1fr;
          }
        }

      `}</style>
    </main>
  );
}
