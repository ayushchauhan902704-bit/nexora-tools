"use client";

import {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Gender = "male" | "female";

type Result = {
  percent: number;
  message: string;
  emoji: string;
};

type Particle = {
  id: number;
  left: number;
  delay: number;
  size: number;
  x: number;
  y: number;
  rotation: number;
  symbol: string;
};

const RESULT_MESSAGES = [
  {
    min: 90,
    emoji: "💖",
    message:
      "An amazing match! Your names have a strong romantic vibe.",
  },
  {
    min: 80,
    emoji: "😍",
    message:
      "A beautiful connection! There is definitely some chemistry here.",
  },
  {
    min: 70,
    emoji: "💕",
    message:
      "Great chemistry! This pair has a lovely connection.",
  },
  {
    min: 60,
    emoji: "😊",
    message:
      "A promising match! Good things can grow with time.",
  },
  {
    min: 50,
    emoji: "💗",
    message:
      "There is a sweet connection here. Keep getting to know each other.",
  },
  {
    min: 40,
    emoji: "🙂",
    message:
      "A friendly connection with room for something more.",
  },
  {
    min: 0,
    emoji: "💫",
    message:
      "Every connection is unique. Love cannot be measured by a number alone.",
  },
];

function getResult(percent: number): Result {
  const found =
    RESULT_MESSAGES.find((item) => percent >= item.min) ??
    RESULT_MESSAGES[RESULT_MESSAGES.length - 1];

  return {
    percent,
    message: found.message,
    emoji: found.emoji,
  };
}

/**
 * Keeps letters and numbers from many writing systems.
 * This makes the calculator more globally friendly than an
 * English-only a-z regex.
 */
function normalizeName(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function calculateLove(
  name1: string,
  name2: string,
  gender1: Gender,
  gender2: Gender
): number {
  const a = normalizeName(name1);
  const b = normalizeName(name2);

  if (!a || !b) return 0;

  // Same names always receive the maximum fun score.
  if (a === b) {
    return 100;
  }

  let score = 0;

  for (let i = 0; i < a.length; i++) {
    score += a.charCodeAt(i) * (i + 1);
  }

  for (let i = 0; i < b.length; i++) {
    score += b.charCodeAt(i) * (i + 1);
  }

  const combined = a + b;

  for (let i = 0; i < combined.length; i++) {
    score += combined.charCodeAt(i);
  }

  const commonLetters = new Set(
    [...a].filter((char) => b.includes(char))
  );

  score += commonLetters.size * 7;

  if (gender1 !== gender2) {
    score += 11;
  }

  if ([...a][0] === [...b][0]) {
    score += 9;
  }

  const lengthDifference = Math.abs(a.length - b.length);

  score -= Math.min(lengthDifference * 2, 14);

  return Math.min(99, Math.max(1, 35 + (score % 65)));
}

export default function LoveCalculatorClient() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  const [gender1, setGender1] = useState<Gender | "">("");
  const [gender2, setGender2] = useState<Gender | "">("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const [particles, setParticles] = useState<Particle[]>([]);
  const [shareStatus, setShareStatus] = useState("");

  const resultRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up any pending calculation when the component unmounts.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Generate celebration particles only once per result.
  // This prevents Math.random() from changing positions on re-render.
  useEffect(() => {
    if (!result) {
      setParticles([]);
      return;
    }

    const symbols = ["🎉", "💖", "✨", "💕", "💗", "🎊"];

    const generated: Particle[] = Array.from(
      { length: 32 },
      (_, i) => ({
        id: i,
        left: 8 + Math.random() * 84,
        delay: Math.random() * 0.55,
        size: 13 + Math.random() * 18,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: -180 + Math.random() * 360,
        symbol: symbols[i % symbols.length],
      })
    );

    setParticles(generated);

    const scrollTimer = setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [result]);

  const calculate = () => {
    if (loading) return;

    setError("");
    setShareStatus("");

    const first = name1.trim();
    const second = name2.trim();

    if (!first || !second) {
      setError("Please enter both names.");
      return;
    }

    if (!gender1 || !gender2) {
      setError("Please select the gender for both names.");
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setResult(null);
    setLoading(true);

    const finalPercent = calculateLove(
      first,
      second,
      gender1,
      gender2
    );

    const finalResult = getResult(finalPercent);

    // Premium short heartbeat/loading experience.
    timerRef.current = setTimeout(() => {
      setLoading(false);
      setResult(finalResult);
      timerRef.current = null;
    }, 1800);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      calculate();
    }
  };

  const reset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setName1("");
    setName2("");
    setGender1("");
    setGender2("");
    setResult(null);
    setParticles([]);
    setError("");
    setShareStatus("");
    setLoading(false);
  };

  const shareResult = async () => {
    if (!result) return;

    const shareText =
      `${name1.trim()} ❤️ ${name2.trim()} — Love Match ${result.percent}%\n\n` +
      `${result.message}\n\n` +
      `Try the Love Calculator on thenexoratools.com`;

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share({
          title: "Love Calculator",
          text: shareText,
          url: window.location.href,
        });

        setShareStatus("Shared successfully.");
        return;
      }

      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(shareText);
        setShareStatus("Result copied to clipboard.");
        return;
      }

      setShareStatus("Sharing is not available on this device.");
    } catch {
      // User cancelled native sharing.
    }
  };

  return (
    <main className="love-page">
      <style jsx>{`
        .love-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 15% 5%,
              rgba(244, 114, 182, 0.18),
              transparent 28%
            ),
            radial-gradient(
              circle at 88% 12%,
              rgba(251, 113, 133, 0.15),
              transparent 30%
            ),
            radial-gradient(
              circle at 50% 100%,
              rgba(236, 72, 153, 0.08),
              transparent 38%
            ),
            linear-gradient(
              180deg,
              #fff7fb 0%,
              #ffffff 48%,
              #fff8fc 100%
            );
          color: #24151d;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          overflow-x: hidden;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          background: rgba(255, 255, 255, 0.84);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(244, 114, 182, 0.15);
        }

        .brand {
          text-decoration: none;
          color: #21151b;
          font-size: 19px;
          font-weight: 950;
          letter-spacing: -0.7px;
        }

        .brand span {
          color: #ec4899;
        }

        .back {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          text-decoration: none;
          color: #9d174d;
          font-size: 11px;
          font-weight: 850;
        }

        .container {
          width: min(760px, calc(100% - 28px));
          margin: 0 auto;
          padding: 25px 0 50px;
        }

        .hero {
          text-align: center;
          padding: 7px 5px 21px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border-radius: 999px;
          background: rgba(255, 240, 247, 0.9);
          border: 1px solid #fbcfe8;
          color: #9d174d;
          font-size: 9.5px;
          font-weight: 900;
          box-shadow: 0 6px 20px rgba(236, 72, 153, 0.06);
        }

        .hero h1 {
          margin: 11px 0 7px;
          font-size: clamp(28px, 7vw, 43px);
          line-height: 1.03;
          letter-spacing: -1.5px;
          font-weight: 950;
        }

        .hero h1 span {
          display: inline-block;
          animation: tinyBeat 1.5s infinite;
        }

        .hero p {
          max-width: 550px;
          margin: 0 auto;
          color: #76636c;
          font-size: 11.5px;
          line-height: 1.55;
        }

        @keyframes tinyBeat {
          0%,
          100% {
            transform: scale(1);
          }

          12% {
            transform: scale(1.08);
          }

          22% {
            transform: scale(1);
          }
        }

        .card {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #fce7f3;
          border-radius: 25px;
          padding: 20px;
          box-shadow:
            0 25px 80px rgba(236, 72, 153, 0.10),
            0 5px 18px rgba(30, 10, 20, 0.04);
        }

        .card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(236, 72, 153, 0.45),
            transparent
          );
        }

        .section-title {
          margin-bottom: 13px;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: -0.2px;
        }

        .field {
          margin-bottom: 13px;
        }

        .label {
          display: block;
          margin: 0 0 6px;
          font-size: 10px;
          font-weight: 850;
          color: #634b55;
        }

        .input {
          width: 100%;
          box-sizing: border-box;
          padding: 13px 14px;
          border: 1.5px solid #f3c4d9;
          border-radius: 13px;
          background: #fff;
          color: #24151d;
          font-size: 14px;
          font-weight: 700;
          outline: none;
          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            transform 0.18s ease;
        }

        .input::placeholder {
          color: #b59ca6;
          font-weight: 600;
        }

        .input:focus {
          border-color: #ec4899;
          box-shadow:
            0 0 0 4px rgba(236, 72, 153, 0.08),
            0 6px 20px rgba(236, 72, 153, 0.06);
        }

        .gender-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 7px;
        }

        .gender-btn {
          min-height: 38px;
          border: 1px solid #f4d5e2;
          background: #fff;
          border-radius: 11px;
          padding: 8px 7px;
          font-size: 10.5px;
          font-weight: 850;
          color: #634b55;
          cursor: pointer;
          transition:
            border-color 0.16s ease,
            background 0.16s ease,
            transform 0.16s ease,
            box-shadow 0.16s ease;
        }

        .gender-btn:hover {
          transform: translateY(-1px);
        }

        .gender-btn.active {
          border-color: #ec4899;
          background: linear-gradient(
            180deg,
            #fff4f9,
            #fff0f7
          );
          color: #9d174d;
          box-shadow:
            inset 0 0 0 1px rgba(236, 72, 153, 0.1),
            0 5px 16px rgba(236, 72, 153, 0.07);
        }

        .calculate-btn {
          width: 100%;
          margin-top: 4px;
          border: 0;
          border-radius: 14px;
          padding: 14px 16px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #ec4899 0%,
              #db2777 55%,
              #be185d 100%
            );
          box-shadow:
            0 12px 28px rgba(236, 72, 153, 0.23),
            inset 0 1px rgba(255, 255, 255, 0.2);
          font-size: 12px;
          font-weight: 950;
          cursor: pointer;
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
        }

        .calculate-btn:hover {
          transform: translateY(-1px);
          box-shadow:
            0 15px 34px rgba(236, 72, 153, 0.29),
            inset 0 1px rgba(255, 255, 255, 0.2);
        }

        .calculate-btn:active {
          transform: translateY(1px);
        }

        .calculate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .error {
          margin-top: 10px;
          padding: 9px 11px;
          border-radius: 10px;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #9f1239;
          font-size: 10.5px;
          font-weight: 750;
          line-height: 1.4;
        }

        .loading {
          min-height: 315px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .heart-loader {
          position: relative;
          width: 118px;
          height: 118px;
          margin: 0 auto 13px;
          display: grid;
          place-items: center;
        }

        .heart-loader::before,
        .heart-loader::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(236, 72, 153, 0.2);
          animation: pulseRing 1.35s infinite ease-out;
        }

        .heart-loader::after {
          animation-delay: 0.42s;
        }

        .heart {
          position: relative;
          z-index: 2;
          font-size: 65px;
          line-height: 1;
          animation: heartbeat 0.82s infinite;
          filter:
            drop-shadow(0 10px 20px rgba(236, 72, 153, 0.24));
        }

        .loading-text {
          font-size: 13px;
          font-weight: 950;
          color: #831843;
        }

        .loading-sub {
          margin-top: 5px;
          color: #927783;
          font-size: 10px;
        }

        @keyframes heartbeat {
          0%,
          100% {
            transform: scale(1);
          }

          15% {
            transform: scale(1.16);
          }

          30% {
            transform: scale(0.98);
          }

          45% {
            transform: scale(1.13);
          }

          60% {
            transform: scale(1);
          }
        }

        @keyframes pulseRing {
          0% {
            transform: scale(0.7);
            opacity: 0.65;
          }

          100% {
            transform: scale(1.42);
            opacity: 0;
          }
        }

        .result {
          position: relative;
          min-height: 345px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 18px 6px 8px;
        }

        .celebration {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          top: 47%;
          opacity: 0;
          animation: burst 1.75s ease-out forwards;
        }

        @keyframes burst {
          0% {
            opacity: 0;
            transform:
              translate(0, 0)
              scale(0.45)
              rotate(0deg);
          }

          12% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translate(
                calc((var(--x) - 50) * 2.4px),
                calc((var(--y) - 50) * 3.2px)
              )
              scale(1.18)
              rotate(var(--rotation));
          }
        }

        .result-content {
          position: relative;
          z-index: 2;
          width: 100%;
        }

        .result-emoji {
          font-size: 48px;
          line-height: 1;
          margin-bottom: 7px;
          animation: pop 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
          filter:
            drop-shadow(0 8px 20px rgba(236, 72, 153, 0.16));
        }

        @keyframes pop {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }

          70% {
            transform: scale(1.12);
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .names {
          color: #6d4a58;
          font-size: 12px;
          font-weight: 850;
          margin-bottom: 3px;
        }

        .percentage {
          margin: 0;
          font-size: clamp(68px, 18vw, 108px);
          line-height: 0.95;
          letter-spacing: -5px;
          font-weight: 1000;
          color: #ec4899;
          text-shadow:
            0 8px 30px rgba(236, 72, 153, 0.18);
        }

        .match-label {
          margin-top: 5px;
          color: #9d174d;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .message {
          max-width: 455px;
          margin: 10px auto 0;
          color: #5f4b54;
          font-size: 11.5px;
          line-height: 1.55;
          font-weight: 650;
        }

        .result-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 17px;
        }

        .action {
          min-height: 42px;
          border: 0;
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 10.5px;
          font-weight: 900;
          cursor: pointer;
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
        }

        .action:hover {
          transform: translateY(-1px);
        }

        .share {
          color: white;
          background: #18121a;
          box-shadow: 0 8px 20px rgba(24, 18, 26, 0.12);
        }

        .again {
          color: #7f1d4d;
          background: #fff0f7;
          border: 1px solid #fbcfe8;
        }

        .share-status {
          min-height: 15px;
          margin-top: 8px;
          color: #9d174d;
          font-size: 9.5px;
          font-weight: 800;
        }

        .info-card {
          margin-top: 12px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #fce7f3;
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 10px 35px rgba(236, 72, 153, 0.04);
        }

        .info-card h2 {
          margin: 0 0 6px;
          font-size: 13px;
          font-weight: 950;
        }

        .info-card p {
          margin: 0;
          color: #76636c;
          font-size: 10.5px;
          line-height: 1.65;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
          margin-top: 11px;
        }

        .step {
          padding: 10px 8px;
          background: #fff7fb;
          border: 1px solid #fce7f3;
          border-radius: 12px;
          text-align: center;
        }

        .step-icon {
          font-size: 18px;
        }

        .step-title {
          margin-top: 3px;
          font-size: 9.5px;
          font-weight: 900;
        }

        .step-text {
          margin-top: 2px;
          color: #8a727b;
          font-size: 8.5px;
          line-height: 1.35;
        }

        .disclaimer {
          margin-top: 10px !important;
          font-size: 9px !important;
          color: #9a858d !important;
        }

        .footer {
          text-align: center;
          padding: 15px 0 0;
          color: #9a858d;
          font-size: 9px;
        }

        @media (max-width: 520px) {
          .container {
            width: min(100% - 20px, 760px);
            padding-top: 17px;
          }

          .card {
            padding: 15px;
            border-radius: 20px;
          }

          .hero h1 {
            font-size: 28px;
          }

          .gender-row {
            gap: 6px;
          }

          .steps {
            grid-template-columns: 1fr;
          }

          .step {
            display: grid;
            grid-template-columns: 28px 1fr;
            text-align: left;
            align-items: center;
          }

          .step-icon {
            grid-row: span 2;
          }

          .result {
            min-height: 330px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .heart,
          .heart-loader::before,
          .heart-loader::after,
          .particle,
          .result-emoji,
          .hero h1 span {
            animation: none !important;
          }
        }
      `}</style>

      <header className="nav">
        <a
          href="/"
          className="brand"
          aria-label="thenexoratools home"
        >
          thenexora<span>tools</span>
        </a>

        <a href="/" className="back">
          ← All Tools
        </a>
      </header>

      <div className="container">
        <section className="hero">
          <div className="badge">
            💗 Free • Fast • Just for Fun
          </div>

          <h1>
            Love Calculator <span>❤️</span>
          </h1>

          <p>
            Enter two names and discover your fun love match percentage.
          </p>
        </section>

        <section className="card">
          {!loading && !result && (
            <>
              <div className="section-title">
                Enter your names
              </div>

              <div className="field">
                <label
                  className="label"
                  htmlFor="name1"
                >
                  Your name
                </label>

                <input
                  id="name1"
                  className="input"
                  type="text"
                  value={name1}
                  onChange={(e) =>
                    setName1(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your name"
                  autoComplete="name"
                  maxLength={60}
                  aria-label="Your name"
                />

                <div className="gender-row">
                  <button
                    type="button"
                    className={`gender-btn ${
                      gender1 === "male"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setGender1("male")
                    }
                    aria-pressed={
                      gender1 === "male"
                    }
                  >
                    👨 Male
                  </button>

                  <button
                    type="button"
                    className={`gender-btn ${
                      gender1 === "female"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setGender1("female")
                    }
                    aria-pressed={
                      gender1 === "female"
                    }
                  >
                    👩 Female
                  </button>
                </div>
              </div>

              <div className="field">
                <label
                  className="label"
                  htmlFor="name2"
                >
                  Crush / partner name
                </label>

                <input
                  id="name2"
                  className="input"
                  type="text"
                  value={name2}
                  onChange={(e) =>
                    setName2(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Enter their name"
                  autoComplete="off"
                  maxLength={60}
                  aria-label="Crush or partner name"
                />

                <div className="gender-row">
                  <button
                    type="button"
                    className={`gender-btn ${
                      gender2 === "male"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setGender2("male")
                    }
                    aria-pressed={
                      gender2 === "male"
                    }
                  >
                    👨 Male
                  </button>

                  <button
                    type="button"
                    className={`gender-btn ${
                      gender2 === "female"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setGender2("female")
                    }
                    aria-pressed={
                      gender2 === "female"
                    }
                  >
                    👩 Female
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="calculate-btn"
                onClick={calculate}
                disabled={loading}
              >
                💘 Calculate Love Match
              </button>

              {error && (
                <div
                  className="error"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}
            </>
          )}

          {loading && (
            <div
              className="loading"
              role="status"
              aria-live="polite"
            >
              <div>
                <div className="heart-loader">
                  <div className="heart">
                    ❤️
                  </div>
                </div>

                <div className="loading-text">
                  Measuring your love connection...
                </div>

                <div className="loading-sub">
                  Your result is almost ready
                </div>
              </div>
            </div>
          )}

          {!loading && result && (
            <div
              ref={resultRef}
              id="result"
              className="result"
            >
              <div className="celebration">
                {particles.map((particle) => (
                  <span
                    key={particle.id}
                    className="particle"
                    style={
                      {
                        left: `${particle.left}%`,
                        fontSize: `${particle.size}px`,
                        animationDelay: `${particle.delay}s`,
                        "--x": `${particle.x}`,
                        "--y": `${particle.y}`,
                        "--rotation": `${particle.rotation}deg`,
                      } as React.CSSProperties
                    }
                  >
                    {particle.symbol}
                  </span>
                ))}
              </div>

              <div className="result-content">
                <div className="result-emoji">
                  {result.emoji}
                </div>

                <div className="names">
                  {name1.trim()} ❤️ {name2.trim()}
                </div>

                <div
                  className="percentage"
                  aria-label={`Love match ${result.percent} percent`}
                >
                  {result.percent}%
                </div>

                <div className="match-label">
                  Love Match
                </div>

                <div className="message">
                  {result.message}
                </div>

                <div className="result-actions">
                  <button
                    type="button"
                    className="action share"
                    onClick={shareResult}
                  >
                    📤 Share Result
                  </button>

                  <button
                    type="button"
                    className="action again"
                    onClick={reset}
                  >
                    🔄 Try Again
                  </button>
                </div>

                <div
                  className="share-status"
                  aria-live="polite"
                >
                  {shareStatus}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="info-card">
          <h2>How it works</h2>

          <p>
            Enter both names, choose the gender for each
            person, and start the fun love match. The result
            is generated instantly in your browser.
          </p>

          <div className="steps">
            <div className="step">
              <div className="step-icon">✍️</div>

              <div>
                <div className="step-title">
                  Enter names
                </div>

                <div className="step-text">
                  Add both names.
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-icon">❤️</div>

              <div>
                <div className="step-title">
                  Heart check
                </div>

                <div className="step-text">
                  Watch the short heartbeat animation.
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-icon">💖</div>

              <div>
                <div className="step-title">
                  See your match
                </div>

                <div className="step-text">
                  Get your fun percentage.
                </div>
              </div>
            </div>
          </div>

          <p className="disclaimer">
            This Love Calculator is designed for
            entertainment. A percentage cannot scientifically
            measure real-world love or compatibility.
          </p>
        </section>

        <div className="footer">
          © {new Date().getFullYear()} thenexoratools •
          Free online tools
        </div>
      </div>
    </main>
  );
}
