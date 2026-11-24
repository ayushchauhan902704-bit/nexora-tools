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

const DURATIONS = [1, 5, 10, 30] as const;

const STORAGE_BEST = "nexora_cps_best_v2";
const STORAGE_HISTORY = "nexora_cps_history_v2";

export default function CPSTestClient() {
  const [duration, setDuration] = useState<number>(5);
  const [status, setStatus] = useState<TestStatus>("idle");

  const [clicks, setClicks] = useState(0);
  const [cps, setCps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);

  const [best, setBest] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [graph, setGraph] = useState<number[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const clicksRef = useRef(0);
  const durationRef = useRef(5);
  const startTimeRef = useRef<number | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const graphTimerRef = useRef<number | null>(null);

  const statusRef = useRef<TestStatus>("idle");
  const lastPointerRef = useRef<number>(0);

  const finishRef = useRef<() => void>(() => {});

  /*
   * Load saved scores.
   */
  useEffect(() => {
    try {
      const savedBest = localStorage.getItem(STORAGE_BEST);

      if (savedBest) {
        const parsedBest = Number(savedBest);

        if (Number.isFinite(parsedBest)) {
          setBest(parsedBest);
        }
      }

      const savedHistory = localStorage.getItem(STORAGE_HISTORY);

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);

        if (
          Array.isArray(parsedHistory) &&
          parsedHistory.every((value) => typeof value === "number")
        ) {
          setHistory(parsedHistory.slice(0, 5));
        }
      }
    } catch {
      // Ignore localStorage errors.
    }

    return () => {
      stopTimers();
    };
  }, []);

  /*
   * Keep refs synchronized with state.
   */
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  /*
   * Stop all timers.
   */
  const stopTimers = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (graphTimerRef.current !== null) {
      window.clearInterval(graphTimerRef.current);
      graphTimerRef.current = null;
    }
  }, []);

  /*
   * Save score history.
   */
  const saveResult = useCallback((finalCps: number) => {
    const rounded = Number(finalCps.toFixed(2));

    setBest((previousBest) => {
      if (rounded > previousBest) {
        try {
          localStorage.setItem(STORAGE_BEST, String(rounded));
        } catch {}

        return rounded;
      }

      return previousBest;
    });

    setHistory((previousHistory) => {
      const nextHistory = [rounded, ...previousHistory].slice(0, 5);

      try {
        localStorage.setItem(
          STORAGE_HISTORY,
          JSON.stringify(nextHistory),
        );
      } catch {}

      return nextHistory;
    });
  }, []);

  /*
   * Finish the test.
   */
  const finish = useCallback(() => {
    if (statusRef.current !== "running") {
      return;
    }

    stopTimers();

    const start = startTimeRef.current;

    if (!start) {
      return;
    }

    const elapsed = durationRef.current;
    const finalCps = clicksRef.current / elapsed;

    setCps(finalCps);
    setTimeLeft(0);
    setStatus("done");

    statusRef.current = "done";

    saveResult(finalCps);
  }, [saveResult, stopTimers]);

  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

  /*
   * High precision timer.
   */
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

    animationFrameRef.current =
      requestAnimationFrame(updateTimer);
  }, []);

  /*
   * Start test.
   */
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

    /*
     * Graph updates separately so the UI remains smooth.
     */
    graphTimerRef.current = window.setInterval(() => {
      if (
        startTimeRef.current === null ||
        statusRef.current !== "running"
      ) {
        return;
      }

      const elapsed =
        (performance.now() - startTimeRef.current) / 1000;

      const currentCps =
        clicksRef.current / Math.max(elapsed, 0.001);

      setGraph((previous) => [
        ...previous.slice(-49),
        currentCps,
      ]);
    }, 150);

    animationFrameRef.current =
      requestAnimationFrame(updateTimer);
  }, [stopTimers, updateTimer]);

  /*
   * Reset test.
   */
  const resetTest = useCallback(() => {
    stopTimers();

    clicksRef.current = 0;
    startTimeRef.current = null;

    statusRef.current = "idle";

    setStatus("idle");
    setClicks(0);
    setCps(0);
    setGraph([]);
    setTimeLeft(durationRef.current);
    setRipples([]);
  }, [stopTimers]);

  /*
   * Change duration.
   */
  const changeDuration = useCallback(
    (seconds: number) => {
      if (statusRef.current === "running") {
        return;
      }

      stopTimers();

      durationRef.current = seconds;

      setDuration(seconds);
      setTimeLeft(seconds);
      setClicks(0);
      setCps(0);
      setGraph([]);
      setStatus("idle");

      statusRef.current = "idle";
    },
    [stopTimers],
  );

  /*
   * Handle click/tap.
   *
   * Pointer events work for:
   * - mouse
   * - touch
   * - pen
   */
  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    /*
     * Prevent duplicate pointer events from being counted
     * too aggressively on some touch devices.
     */
    if (
      event.pointerType === "touch" &&
      event.pointerId !== lastPointerRef.current
    ) {
      lastPointerRef.current = event.pointerId;
    }

    if (statusRef.current === "done") {
      resetTest();
      return;
    }

    if (statusRef.current === "idle") {
      startTest();
    }

    /*
     * Count this pointer action.
     */
    clicksRef.current += 1;

    setClicks(clicksRef.current);

    /*
     * Add ripple.
     */
    const rect = event.currentTarget.getBoundingClientRect();

    const ripple: Ripple = {
      id: Date.now() + Math.random(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    setRipples((previous) => [
      ...previous.slice(-7),
      ripple,
    ]);

    window.setTimeout(() => {
      setRipples((previous) =>
        previous.filter((item) => item.id !== ripple.id),
      );
    }, 550);
  };

  /*
   * Share result.
   */
  const shareResult = async () => {
    const shareText =
      `I scored ${cps.toFixed(2)} CPS on the NEXORA CPS Test. ` +
      `Can you beat my score?`;

    const shareData = {
      title: "My CPS Test Result",
      text: shareText,
      url: window.location.href,
    };

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(
        `${shareText} ${window.location.href}`,
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
          "Keep practicing. Consistency and relaxed clicking can improve your speed.",
      };
    }

    if (score < 6) {
      return {
        emoji: "👍",
        title: "Good Clicker",
        message:
          "Nice speed. You are building a solid clicking rhythm.",
      };
    }

    if (score < 8) {
      return {
        emoji: "🔥",
        title: "Pro Clicker",
        message:
          "Excellent clicking speed. Your reaction and clicking rhythm are strong.",
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
        "Outstanding CPS score. That is seriously fast clicking.",
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
    <main className="cps-page">
      <style jsx>{`
        .cps-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top,
              rgba(34, 197, 94, 0.08),
              transparent 35%
            ),
            #070b14;
          color: #ffffff;
          padding: 24px 16px 60px;
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

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 34px;
        }

        .logo {
          font-size: 21px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }

        .logo span {
          color: #22c55e;
        }

        .best-badge {
          background: #111827;
          border: 1px solid #263244;
          color: #cbd5e1;
          border-radius: 999px;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        .best-badge strong {
          color: #22c55e;
        }

        .hero {
          text-align: center;
          margin-bottom: 22px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.22);
          color: #86efac;
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

        .duration-row {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 9px;
          margin: 22px 0 14px;
        }

        .duration-button {
          border: 1px solid #293548;
          background: #111827;
          color: #cbd5e1;
          padding: 10px 20px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 800;
          font-size: 14px;
          transition:
            transform 0.15s,
            background 0.15s,
            border-color 0.15s;
        }

        .duration-button:hover {
          transform: translateY(-1px);
          border-color: #22c55e;
        }

        .duration-button.active {
          background: #22c55e;
          border-color: #22c55e;
          color: #031108;
        }

        .click-zone {
          position: relative;
          width: 100%;
          min-height: 330px;
          border-radius: 24px;
          border: 2px solid #263244;
          background:
            linear-gradient(
              145deg,
              #172033,
              #101827
            );
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          cursor: pointer;
          overflow: hidden;
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          outline: none;
        }

        .click-zone.running {
          border-color: #0ea5e9;
          background:
            linear-gradient(
              145deg,
              #075985,
              #0f3d5a
            );
        }

        .click-zone.done {
          border-color: #22c55e;
          background:
            linear-gradient(
              145deg,
              #14532d,
              #0f3d25
            );
        }

        .click-zone:active {
          transform: scale(0.997);
        }

        .timer {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 76px;
          background: rgba(0, 0, 0, 0.28);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 7px 13px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 900;
        }

        .click-number {
          margin-top: 10px;
          font-size: clamp(70px, 15vw, 112px);
          line-height: 0.95;
          font-weight: 950;
          letter-spacing: -4px;
          text-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
        }

        .click-instruction {
          margin-top: 13px;
          font-size: 18px;
          font-weight: 900;
        }

        .click-subtext {
          margin-top: 6px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 13px;
        }

        .progress-track {
          width: 82%;
          height: 8px;
          margin-top: 22px;
          background: rgba(0, 0, 0, 0.28);
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #ffffff;
          border-radius: inherit;
          transition: width 0.08s linear;
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

        .stat-value {
          display: block;
          color: #22c55e;
          font-size: 24px;
          line-height: 1;
          font-weight: 950;
        }

        .stat-label {
          display: block;
          color: #64748b;
          margin-top: 7px;
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

        .panel-title {
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

        .graph-bar {
          flex: 1;
          min-width: 3px;
          max-width: 12px;
          border-radius: 5px 5px 0 0;
          background: #22c55e;
          opacity: 0.9;
        }

        .buttons {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 17px;
        }

        .action-button {
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
          color: #ffffff;
          border: 1px solid #334155;
        }

        .result {
          margin-top: 16px;
          background: #111827;
          border: 2px solid #22c55e;
          border-radius: 20px;
          padding: 22px;
          text-align: center;
        }

        .result-score {
          font-size: 46px;
          line-height: 1;
          font-weight: 950;
          color: #22c55e;
        }

        .result-cps {
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

        .rank-message {
          max-width: 600px;
          margin: 7px auto 0;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.6;
        }

        .history-title {
          text-align: center;
          font-size: 13px;
          font-weight: 900;
        }

        .history-list {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .history-chip {
          background: #0b1220;
          border: 1px solid #253247;
          border-radius: 999px;
          padding: 8px 13px;
          font-size: 12px;
          font-weight: 800;
          color: #cbd5e1;
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

        .content p {
          margin: 0;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.75;
        }

        .content ul {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.8;
          padding-left: 20px;
        }

        .footer {
          margin-top: 24px;
          text-align: center;
          color: #475569;
          font-size: 12px;
        }

        @media (max-width: 650px) {
          .cps-page {
            padding: 18px 12px 45px;
          }

          .topbar {
            margin-bottom: 25px;
          }

          .logo {
            font-size: 18px;
          }

          .best-badge {
            padding: 8px 10px;
            font-size: 11px;
          }

          .click-zone {
            min-height: 300px;
            border-radius: 20px;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .click-instruction {
            font-size: 16px;
          }

          .progress-track {
            width: 88%;
          }

          .content {
            padding: 18px;
          }
        }
      `}</style>

      <div className="container">
        <header className="topbar">
          <div className="logo">
            NEXORA <span>TOOLS</span>
          </div>

          <div className="best-badge">
            🏆 Best:{" "}
            <strong>{best.toFixed(2)} CPS</strong>
          </div>
        </header>

        <section className="hero">
          <div className="eyebrow">
            ⚡ FREE ONLINE CLICK SPEED TEST
          </div>

          <h1>
            CPS Test -{" "}
            <span>Clicks Per Second</span>
          </h1>

          <p className="subtitle">
            Test your clicking speed and see how many clicks
            you can make per second. Fast, free, and works on
            desktop and mobile.
          </p>
        </section>

        <div className="duration-row">
          {DURATIONS.map((seconds) => (
            <button
              key={seconds}
              type="button"
              className={`duration-button ${
                duration === seconds ? "active" : ""
              }`}
              onClick={() => changeDuration(seconds)}
              disabled={status === "running"}
            >
              {seconds} Second{seconds !== 1 ? "s" : ""}
            </button>
          ))}
        </div>

        <div
          className={`click-zone ${
            status === "running"
              ? "running"
              : status === "done"
                ? "done"
                : ""
          }`}
          onPointerDown={handlePointerDown}
          role="button"
          tabIndex={0}
          aria-label="CPS Test click area"
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

          <div className="click-number">
            {clicks}
          </div>

          <div className="click-instruction">
            {status === "idle" &&
              "👆 CLICK HERE TO START"}

            {status === "running" &&
              "⚡ CLICK AS FAST AS YOU CAN"}

            {status === "done" &&
              `🎉 ${cps.toFixed(2)} CPS`}
          </div>

          <div className="click-subtext">
            {status === "idle" &&
              "Your timer starts with your first click"}

            {status === "running" &&
              `Current speed: ${cps.toFixed(2)} clicks per second`}

            {status === "done" &&
              "Click the area to play again"}
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat-value">
              {clicks}
            </span>
            <span className="stat-label">
              TOTAL CLICKS
            </span>
          </div>

          <div className="stat">
            <span className="stat-value">
              {cps.toFixed(2)}
            </span>
            <span className="stat-label">
              CURRENT CPS
            </span>
          </div>

          <div className="stat">
            <span className="stat-value">
              {best.toFixed(2)}
            </span>
            <span className="stat-label">
              PERSONAL BEST
            </span>
          </div>

          <div className="stat">
            <span className="stat-value">
              {timeLeft.toFixed(1)}s
            </span>
            <span className="stat-label">
              TIME LEFT
            </span>
          </div>
        </div>

        {graph.length > 2 && (
          <section className="panel">
            <div className="panel-title">
              📈 Live CPS Performance
            </div>

            <div className="graph">
              {graph.map((value, index) => {
                const height = Math.min(
                  100,
                  Math.max(5, (value / 15) * 100),
                );

                return (
                  <div
                    key={`${index}-${value}`}
                    className="graph-bar"
                    style={{
                      height: `${height}%`,
                      background:
                        value >= 10
                          ? "#ef4444"
                          : value >= 7
                            ? "#a855f7"
                            : value >= 5
                              ? "#22c55e"
                              : "#0ea5e9",
                    }}
                  />
                );
              })}
            </div>
          </section>
        )}

        {status === "done" && rank && (
          <section className="result">
            <div className="result-score">
              {cps.toFixed(2)}
            </div>

            <div className="result-cps">
              CLICKS PER SECOND
            </div>

            <div className="rank">
              {rank.emoji} {rank.title}
            </div>

            <p className="rank-message">
              {rank.message}
            </p>

            <div className="buttons">
              <button
                type="button"
                className="action-button primary"
                onClick={resetTest}
              >
                ↻ Play Again
              </button>

              <button
                type="button"
                className="action-button secondary"
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
              className="action-button primary"
              onClick={resetTest}
            >
              ↻ Restart
            </button>

            <button
              type="button"
              className="action-button secondary"
              onClick={shareResult}
            >
              📤 Share
            </button>
          </div>
        )}

        {history.length > 0 && (
          <section className="panel">
            <div className="history-title">
              📊 Your Last 5 Scores
            </div>

            <div className="history-list">
              {history.map((score, index) => (
                <span
                  key={`${score}-${index}`}
                  className="history-chip"
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
            A score around 5–7 CPS is generally a solid
            clicking speed. Scores above 8 CPS are fast, while
            10+ CPS is considered very high for ordinary
            clicking.
          </p>

          <h3>
            How can I improve my CPS?
          </h3>

          <ul>
            <li>
              Keep your hand relaxed while clicking.
            </li>
            <li>
              Practice short clicking sessions regularly.
            </li>
            <li>
              Experiment with different mouse grips and
              clicking techniques.
            </li>
            <li>
              Use a responsive mouse with a reliable switch.
            </li>
            <li>
              Avoid excessive force because it can reduce
              consistency.
            </li>
          </ul>

          <h3>
            Does the CPS Test work on mobile?
          </h3>

          <p>
            Yes. This test supports pointer input, so it can
            be used with a mouse, touchscreen, or compatible
            pointer device.
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
