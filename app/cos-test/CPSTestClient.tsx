"use client";

import {
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type TestStatus = "idle" | "running" | "done";

type Ripple = {
  id: number;
  x: number;
  y: number;
};

const DURATIONS = [1, 5, 10, 30];

const BEST_KEY = "nexora_cps_best";
const HISTORY_KEY = "nexora_cps_history";

export default function CPSTestClient() {
  const [duration, setDuration] = useState(5);
  const [status, setStatus] = useState<TestStatus>("idle");
  const [clicks, setClicks] = useState(0);
  const [cps, setCps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [best, setBest] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [graph, setGraph] = useState<number[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const statusRef = useRef<TestStatus>("idle");
  const durationRef = useRef(5);
  const clicksRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  const animationRef = useRef<number | null>(null);
  const graphIntervalRef = useRef<number | null>(null);

  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    try {
      const savedBest = localStorage.getItem(BEST_KEY);

      if (savedBest) {
        const value = Number(savedBest);

        if (Number.isFinite(value)) {
          setBest(value);
        }
      }

      const savedHistory = localStorage.getItem(HISTORY_KEY);

      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);

        if (
          Array.isArray(parsed) &&
          parsed.every((item) => typeof item === "number")
        ) {
          setHistory(parsed.slice(0, 5));
        }
      }
    } catch {
      // Ignore storage errors.
    }

    return () => {
      stopTimers();
    };
  }, []);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const stopTimers = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (graphIntervalRef.current !== null) {
      window.clearInterval(graphIntervalRef.current);
      graphIntervalRef.current = null;
    }
  }, []);

  const saveResult = useCallback((score: number) => {
    const roundedScore = Number(score.toFixed(2));

    setBest((oldBest) => {
      if (roundedScore > oldBest) {
        try {
          localStorage.setItem(
            BEST_KEY,
            roundedScore.toString(),
          );
        } catch {}

        return roundedScore;
      }

      return oldBest;
    });

    setHistory((oldHistory) => {
      const newHistory = [
        roundedScore,
        ...oldHistory,
      ].slice(0, 5);

      try {
        localStorage.setItem(
          HISTORY_KEY,
          JSON.stringify(newHistory),
        );
      } catch {}

      return newHistory;
    });
  }, []);

  const finishTest = useCallback(() => {
    if (statusRef.current !== "running") {
      return;
    }

    stopTimers();

    const finalCps =
      clicksRef.current / durationRef.current;

    setCps(finalCps);
    setTimeLeft(0);
    setStatus("done");

    statusRef.current = "done";

    saveResult(finalCps);
  }, [saveResult, stopTimers]);

  useEffect(() => {
    finishRef.current = finishTest;
  }, [finishTest]);

  const updateTimer = useCallback(() => {
    if (
      statusRef.current !== "running" ||
      startTimeRef.current === null
    ) {
      return;
    }

    const elapsed =
      (performance.now() - startTimeRef.current) / 1000;

    const remaining = Math.max(
      0,
      durationRef.current - elapsed,
    );

    const currentCps =
      clicksRef.current / Math.max(elapsed, 0.001);

    setTimeLeft(remaining);
    setCps(currentCps);

    if (remaining <= 0) {
      finishRef.current();
      return;
    }

    animationRef.current =
      requestAnimationFrame(updateTimer);
  }, []);

  const startTest = useCallback(() => {
    stopTimers();

    clicksRef.current = 0;
    startTimeRef.current = performance.now();

    statusRef.current = "running";

    setStatus("running");
    setClicks(0);
    setCps(0);
    setGraph([]);
    setTimeLeft(durationRef.current);

    graphIntervalRef.current = window.setInterval(() => {
      if (
        statusRef.current !== "running" ||
        startTimeRef.current === null
      ) {
        return;
      }

      const elapsed =
        (performance.now() - startTimeRef.current) /
        1000;

      const currentCps =
        clicksRef.current /
        Math.max(elapsed, 0.001);

      setGraph((oldGraph) => [
        ...oldGraph.slice(-49),
        currentCps,
      ]);
    }, 150);

    animationRef.current =
      requestAnimationFrame(updateTimer);
  }, [stopTimers, updateTimer]);

  const resetTest = useCallback(() => {
    stopTimers();

    clicksRef.current = 0;
    startTimeRef.current = null;

    statusRef.current = "idle";

    setStatus("idle");
    setClicks(0);
    setCps(0);
    setGraph([]);
    setRipples([]);
    setTimeLeft(durationRef.current);
  }, [stopTimers]);

  const changeDuration = useCallback(
    (seconds: number) => {
      if (statusRef.current === "running") {
        return;
      }

      stopTimers();

      durationRef.current = seconds;
      statusRef.current = "idle";

      setDuration(seconds);
      setStatus("idle");
      setClicks(0);
      setCps(0);
      setGraph([]);
      setTimeLeft(seconds);
    },
    [stopTimers],
  );

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (statusRef.current === "done") {
      resetTest();
      return;
    }

    if (statusRef.current === "idle") {
      startTest();
    }

    clicksRef.current += 1;
    setClicks(clicksRef.current);

    const rect =
      event.currentTarget.getBoundingClientRect();

    const ripple: Ripple = {
      id: Date.now() + Math.random(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    setRipples((oldRipples) => [
      ...oldRipples.slice(-7),
      ripple,
    ]);

    window.setTimeout(() => {
      setRipples((oldRipples) =>
        oldRipples.filter(
          (item) => item.id !== ripple.id,
        ),
      );
    }, 550);
  };

  const shareResult = async () => {
    const text =
      `I scored ${cps.toFixed(2)} CPS on the NEXORA CPS Test. ` +
      `Can you beat my score?`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My CPS Test Result",
          text,
          url: window.location.href,
        });

        return;
      }

      await navigator.clipboard.writeText(
        `${text} ${window.location.href}`,
      );

      window.alert("Result copied to clipboard!");
    } catch {
      // User cancelled sharing.
    }
  };

  const getRank = (score: number) => {
    if (score < 4) {
      return {
        emoji: "🐢",
        title: "Average Clicker",
        message:
          "Keep practicing. A relaxed hand and consistent rhythm can improve your speed.",
      };
    }

    if (score < 6) {
      return {
        emoji: "👍",
        title: "Good Clicker",
        message:
          "Nice work. You have a solid clicking speed.",
      };
    }

    if (score < 8) {
      return {
        emoji: "🔥",
        title: "Pro Clicker",
        message:
          "Excellent speed. Your clicking rhythm is getting seriously fast.",
      };
    }

    if (score < 10) {
      return {
        emoji: "⚡",
        title: "Elite Clicker",
        message:
          "Very fast clicking. You are entering advanced CPS territory.",
      };
    }

    return {
      emoji: "👑",
      title: "Insane Clicker",
      message:
        "Outstanding result. That is extremely fast clicking.",
    };
  };

  const rank =
    status === "done" ? getRank(cps) : null;

  const progress =
    status === "idle"
      ? 0
      : Math.min(
          100,
          Math.max(
            0,
            ((duration - timeLeft) / duration) * 100,
          ),
        );

  return (
    <main className="page">
      <style jsx>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top,
              rgba(34, 197, 94, 0.08),
              transparent 35%
            ),
            #070b14;
          color: #fff;
          padding: 22px 15px 60px;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 32px;
        }

        .logo {
          font-size: 21px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .logo span {
          color: #22c55e;
        }

        .best {
          background: #111827;
          border: 1px solid #263244;
          border-radius: 999px;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        .best strong {
          color: #22c55e;
        }

        .hero {
          text-align: center;
          margin-bottom: 22px;
        }

        .badge {
          display: inline-block;
          color: #86efac;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          border-radius: 999px;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 14px;
        }

        h1 {
          margin: 0;
          font-size: clamp(30px, 6vw, 48px);
          line-height: 1.05;
          letter-spacing: -1.5px;
        }

        h1 span {
          color: #22c55e;
        }

        .subtitle {
          max-width: 680px;
          margin: 13px auto 0;
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.6;
        }

        .durations {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 9px;
          margin: 22px 0 14px;
        }

        .duration {
          border: 1px solid #293548;
          background: #111827;
          color: #cbd5e1;
          padding: 10px 20px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 800;
        }

        .duration.active {
          background: #22c55e;
          border-color: #22c55e;
          color: #031108;
        }

        .duration:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .clickArea {
          position: relative;
          width: 100%;
          min-height: 330px;
          border: 2px solid #263244;
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              #172033,
              #101827
            );
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          overflow: hidden;
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .clickArea.running {
          border-color: #0ea5e9;
          background:
            linear-gradient(
              145deg,
              #075985,
              #0f3d5a
            );
        }

        .clickArea.done {
          border-color: #22c55e;
          background:
            linear-gradient(
              145deg,
              #14532d,
              #0f3d25
            );
        }

        .timer {
          background: rgba(0, 0, 0, 0.3);
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 900;
        }

        .number {
          margin-top: 10px;
          font-size: clamp(70px, 15vw, 112px);
          line-height: 0.95;
          font-weight: 950;
          letter-spacing: -4px;
        }

        .instruction {
          margin-top: 13px;
          font-size: 18px;
          font-weight: 900;
        }

        .hint {
          margin-top: 6px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 13px;
        }

        .progress {
          width: 82%;
          height: 8px;
          margin-top: 22px;
          background: rgba(0, 0, 0, 0.28);
          border-radius: 999px;
          overflow: hidden;
        }

        .progressFill {
          height: 100%;
          background: #fff;
          border-radius: inherit;
        }

        .ripple {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.45);
          pointer-events: none;
          animation: ripple 0.55s ease-out forwards;
        }

        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: 0.8;
          }

          to {
            transform: scale(3.5);
            opacity: 0;
          }
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 14px;
        }

        .stat {
          background: #111827;
          border: 1px solid #202c3e;
          border-radius: 16px;
          padding: 15px 8px;
          text-align: center;
        }

        .value {
          display: block;
          color: #22c55e;
          font-size: 24px;
          line-height: 1;
          font-weight: 950;
        }

        .label {
          display: block;
          margin-top: 7px;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
        }

        .panel {
          margin-top: 14px;
          background: #111827;
          border: 1px solid #202c3e;
          border-radius: 18px;
          padding: 17px;
        }

        .panelTitle {
          font-size: 14px;
          font-weight: 900;
        }

        .graph {
          height: 100px;
          margin-top: 14px;
          display: flex;
          align-items: flex-end;
          gap: 3px;
          overflow: hidden;
        }

        .bar {
          flex: 1;
          min-width: 3px;
          max-width: 12px;
          border-radius: 5px 5px 0 0;
        }

        .result {
          margin-top: 16px;
          background: #111827;
          border: 2px solid #22c55e;
          border-radius: 20px;
          padding: 22px;
          text-align: center;
        }

        .score {
          color: #22c55e;
          font-size: 48px;
          font-weight: 950;
          line-height: 1;
        }

        .scoreLabel {
          margin-top: 6px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 700;
        }

        .rank {
          margin-top: 17px;
          font-size: 24px;
          font-weight: 950;
        }

        .message {
          max-width: 600px;
          margin: 7px auto 0;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.6;
        }

        .buttons {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 17px;
        }

        .button {
          border: 0;
          border-radius: 999px;
          padding: 13px 24px;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
        }

        .primary {
          background: #22c55e;
          color: #031108;
        }

        .secondary {
          background: #1e293b;
          color: #fff;
          border: 1px solid #334155;
        }

        .historyTitle {
          text-align: center;
          font-size: 13px;
          font-weight: 900;
        }

        .history {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .chip {
          background: #0b1220;
          border: 1px solid #253247;
          border-radius: 999px;
          padding: 8px 13px;
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 800;
        }

        .content {
          margin-top: 26px;
          background: #111827;
          border: 1px solid #202c3e;
          border-radius: 20px;
          padding: 22px;
        }

        .content h2 {
          margin: 0 0 12px;
          font-size: 21px;
        }

        .content h3 {
          margin: 20px 0 7px;
          font-size: 16px;
        }

        .content p,
        .content li {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.75;
        }

        .content p {
          margin: 0;
        }

        .content ul {
          padding-left: 20px;
        }

        .footer {
          margin-top: 24px;
          text-align: center;
          color: #475569;
          font-size: 12px;
        }

        @media (max-width: 650px) {
          .page {
            padding: 18px 12px 45px;
          }

          .top {
            margin-bottom: 25px;
          }

          .logo {
            font-size: 18px;
          }

          .best {
            padding: 8px 10px;
            font-size: 11px;
          }

          .clickArea {
            min-height: 300px;
            border-radius: 20px;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .instruction {
            font-size: 16px;
          }

          .progress {
            width: 88%;
          }

          .content {
            padding: 18px;
          }
        }
      `}</style>

      <div className="container">
        <header className="top">
          <div className="logo">
            NEXORA <span>TOOLS</span>
          </div>

          <div className="best">
            🏆 Best:{" "}
            <strong>{best.toFixed(2)} CPS</strong>
          </div>
        </header>

        <section className="hero">
          <div className="badge">
            ⚡ FREE ONLINE CLICK SPEED TEST
          </div>

          <h1>
            CPS Test -{" "}
            <span>Clicks Per Second</span>
          </h1>

          <p className="subtitle">
            Test your clicking speed and find out how many
            clicks you can make per second. Free, fast, and
            works on desktop and mobile.
          </p>
        </section>

        <div className="durations">
          {DURATIONS.map((seconds) => (
            <button
              key={seconds}
              type="button"
              className={`duration ${
                duration === seconds ? "active" : ""
              }`}
              onClick={() => changeDuration(seconds)}
              disabled={status === "running"}
            >
              {seconds} Second
              {seconds !== 1 ? "s" : ""}
            </button>
          ))}
        </div>

        <div
          className={`clickArea ${
            status === "running"
              ? "running"
              : status === "done"
                ? "done"
                : ""
          }`}
          onPointerDown={handlePointerDown}
          role="button"
          tabIndex={0}
          aria-label="CPS test click area"
        >
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="ripple"
              style={{
                left: ripple.x - 22,
                top: ripple.y - 22,
              }}
            />
          ))}

          <div className="timer">
            {status === "running"
              ? `${timeLeft.toFixed(1)}s`
              : status === "done"
                ? "DONE"
                : `${duration}s`}
          </div>

          <div className="number">
            {clicks}
          </div>

          <div className="instruction">
            {status === "idle" &&
              "👆 CLICK HERE TO START"}

            {status === "running" &&
              "⚡ CLICK AS FAST AS YOU CAN"}

            {status === "done" &&
              `🎉 ${cps.toFixed(2)} CPS`}
          </div>

          <div className="hint">
            {status === "idle" &&
              "The timer starts with your first click"}

            {status === "running" &&
              `Current speed: ${cps.toFixed(2)} clicks per second`}

            {status === "done" &&
              "Click the area to play again"}
          </div>

          <div className="progress">
            <div
              className="progressFill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="value">
              {clicks}
            </span>

            <span className="label">
              TOTAL CLICKS
            </span>
          </div>

          <div className="stat">
            <span className="value">
              {cps.toFixed(2)}
            </span>

            <span className="label">
              CURRENT CPS
            </span>
          </div>

          <div className="stat">
            <span className="value">
              {best.toFixed(2)}
            </span>

            <span className="label">
              PERSONAL BEST
            </span>
          </div>

          <div className="stat">
            <span className="value">
              {timeLeft.toFixed(1)}s
            </span>

            <span className="label">
              TIME LEFT
            </span>
          </div>
        </div>

        {graph.length > 2 && (
          <section className="panel">
            <div className="panelTitle">
              📈 Live CPS Performance
            </div>

            <div className="graph">
              {graph.map((value, index) => {
                const height = Math.min(
                  100,
                  Math.max(5, (value / 15) * 100),
                );

                const barColor =
                  value >= 10
                    ? "#ef4444"
                    : value >= 7
                      ? "#a855f7"
                      : value >= 5
                        ? "#22c55e"
                        : "#0ea5e9";

                return (
                  <div
                    key={`${index}-${value}`}
                    className="bar"
                    style={{
                      height: `${height}%`,
                      background: barColor,
                    }}
                  />
                );
              })}
            </div>
          </section>
        )}

        {status === "done" && rank && (
          <section className="result">
            <div className="score">
              {cps.toFixed(2)}
            </div>

            <div className="scoreLabel">
              CLICKS PER SECOND
            </div>

            <div className="rank">
              {rank.emoji} {rank.title}
            </div>

            <p className="message">
              {rank.message}
            </p>

            <div className="buttons">
              <button
                type="button"
                className="button primary"
                onClick={resetTest}
              >
                ↻ Play Again
              </button>

              <button
                type="button"
                className="button secondary"
                onClick={shareResult}
              >
                📤 Share Result
              </button>
            </div>
          </section>
        )}

        {status !== "done" && (
          <div className="buttons">
            <button
              type="button"
              className="button primary"
              onClick={resetTest}
            >
              ↻ Restart
            </button>

            <button
              type="button"
              className="button secondary"
              onClick={shareResult}
            >
              📤 Share
            </button>
          </div>
        )}

        {history.length > 0 && (
          <section className="panel">
            <div className="historyTitle">
              📊 Your Last 5 Scores
            </div>

            <div className="history">
              {history.map((score, index) => (
                <span
                  key={`${score}-${index}`}
                  className="chip"
                >
                  {score.toFixed(2)} CPS
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="content">
          <h2>
            CPS Test - Clicks Per Second Test
          </h2>

          <p>
            CPS Test measures how many times you can click
            in one second. Choose a test duration, click the
            test area as quickly as possible, and your final
            clicks-per-second score will be calculated
            automatically.
          </p>

          <h3>
            What is a good CPS score?
          </h3>

          <p>
            Around 5–7 CPS is a solid clicking speed for many
            users. Scores above 8 CPS are fast, while 10+ CPS
            is considered very high for ordinary clicking.
          </p>

          <h3>
            How can I improve my CPS?
          </h3>

          <ul>
            <li>
              Keep your hand relaxed while clicking.
            </li>
            <li>
              Practice short sessions regularly.
            </li>
            <li>
              Experiment with different clicking techniques.
            </li>
            <li>
              Use a responsive mouse with a reliable switch.
            </li>
            <li>
              Focus on consistency instead of excessive force.
            </li>
          </ul>

          <h3>
            Does the CPS Test work on mobile?
          </h3>

          <p>
            Yes. The test uses pointer events and supports
            touchscreen devices as well as mouse input.
          </p>

          <h3>
            Is this CPS Test free?
          </h3>

          <p>
            Yes. The NEXORA CPS Test is free to use and does
            not require an account or sign-up.
          </p>
        </section>

        <div className="footer">
          © {new Date().getFullYear()} NEXORA Tools · Free
          Online Tools
        </div>
      </div>
    </main>
  );
}
