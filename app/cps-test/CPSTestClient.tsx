"use client";

import {
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Status = "idle" | "running" | "done";

type Ripple = {
  id: number;
  x: number;
  y: number;
};

type Stats = {
  peak: number;
  average: number;
  consistency: number;
  interval: number;
};

const DURATIONS = [1, 5, 10, 30] as const;

const PB_KEY = "nexora_cps_pb_v5";
const HISTORY_KEY = "nexora_cps_history_v5";

const emptyStats: Stats = {
  peak: 0,
  average: 0,
  consistency: 0,
  interval: 0,
};

export default function CPSTestClient() {
  const [duration, setDuration] = useState(5);
  const [status, setStatus] = useState<Status>("idle");

  const [clicks, setClicks] = useState(0);
  const [cps, setCps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);

  const [best, setBest] = useState(0);
  const [bestByTime, setBestByTime] =
    useState<Record<string, number>>({});

  const [history, setHistory] = useState<number[]>([]);
  const [graph, setGraph] = useState<number[]>([]);
  const [stats, setStats] = useState<Stats>(emptyStats);

  const [sound, setSound] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const statusRef = useRef<Status>("idle");
  const durationRef = useRef(5);

  const clicksRef = useRef(0);
  const startRef = useRef<number | null>(null);

  const clickTimesRef = useRef<number[]>([]);

  const animationRef = useRef<number | null>(null);
  const graphRef = useRef<number | null>(null);

  const audioRef = useRef<AudioContext | null>(null);

  const finishRef = useRef<() => void>(() => {});

  /* -----------------------------
     LOAD SAVED DATA
  ----------------------------- */

  useEffect(() => {
    try {
      const savedPB = localStorage.getItem(PB_KEY);

      if (savedPB) {
        const parsed = JSON.parse(savedPB);

        if (
          parsed &&
          typeof parsed === "object"
        ) {
          setBestByTime(parsed);

          const values = Object.values(parsed)
            .filter(
              (v): v is number =>
                typeof v === "number",
            );

          if (values.length) {
            setBest(Math.max(...values));
          }
        }
      }

      const savedHistory =
        localStorage.getItem(HISTORY_KEY);

      if (savedHistory) {
        const parsed = JSON.parse(
          savedHistory,
        );

        if (Array.isArray(parsed)) {
          setHistory(
            parsed
              .filter(
                (v): v is number =>
                  typeof v === "number",
              )
              .slice(0, 10),
          );
        }
      }
    } catch {}

    return () => {
      stopTimers();

      if (audioRef.current) {
        try {
          audioRef.current.close();
        } catch {}
      }
    };
  }, []);

  /* -----------------------------
     STOP TIMERS
  ----------------------------- */

  const stopTimers = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(
        animationRef.current,
      );

      animationRef.current = null;
    }

    if (graphRef.current !== null) {
      window.clearInterval(
        graphRef.current,
      );

      graphRef.current = null;
    }
  }, []);

  /* -----------------------------
     SOUND
  ----------------------------- */

  const clickSound = useCallback(() => {
    if (!sound) return;

    try {
      if (!audioRef.current) {
        audioRef.current =
          new AudioContext();
      }

      const ctx = audioRef.current;

      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const oscillator =
        ctx.createOscillator();

      const gain =
        ctx.createGain();

      oscillator.frequency.value = 520;
      oscillator.type = "sine";

      gain.gain.setValueAtTime(
        0.035,
        ctx.currentTime,
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.035,
      );

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(
        ctx.currentTime + 0.04,
      );
    } catch {}
  }, [sound]);

  /* -----------------------------
     CALCULATE STATS
  ----------------------------- */

  const calculateStats = useCallback(
    (times: number[], totalClicks: number) => {
      if (
        times.length < 1 ||
        startRef.current === null
      ) {
        return emptyStats;
      }

      const elapsed =
        (performance.now() -
          startRef.current) /
        1000;

      const average =
        elapsed > 0
          ? totalClicks / elapsed
          : 0;

      let peak = average;

      if (times.length >= 2) {
        const oneSecond = 1000;

        for (
          let i = 0;
          i < times.length;
          i++
        ) {
          const start = times[i];

          let count = 0;

          for (
            let j = i;
            j < times.length;
            j++
          ) {
            if (
              times[j] - start <=
              oneSecond
            ) {
              count++;
            } else {
              break;
            }
          }

          if (count > peak) {
            peak = count;
          }
        }
      }

      let interval = 0;

      if (times.length >= 2) {
        let totalGap = 0;

        for (
          let i = 1;
          i < times.length;
          i++
        ) {
          totalGap +=
            times[i] -
            times[i - 1];
        }

        interval =
          totalGap /
          (times.length - 1);
      }

      let consistency = 100;

      if (times.length >= 3) {
        const gaps: number[] = [];

        for (
          let i = 1;
          i < times.length;
          i++
        ) {
          gaps.push(
            times[i] -
              times[i - 1],
          );
        }

        const avgGap =
          gaps.reduce(
            (a, b) => a + b,
            0,
          ) / gaps.length;

        const variance =
          gaps.reduce(
            (sum, gap) =>
              sum +
              Math.pow(
                gap - avgGap,
                2,
              ),
            0,
          ) / gaps.length;

        const deviation =
          Math.sqrt(variance);

        consistency = Math.max(
          0,
          Math.min(
            100,
            100 -
              (deviation /
                Math.max(
                  avgGap,
                  1,
                )) *
                100,
          ),
        );
      }

      return {
        peak,
        average,
        consistency,
        interval,
      };
    },
    [],
  );

  /* -----------------------------
     SAVE RESULT
  ----------------------------- */

  const saveResult = useCallback(
    (score: number) => {
      const rounded = Number(
        score.toFixed(2),
      );

      setBestByTime((old) => {
        const next = {
          ...old,
          [durationRef.current]:
            Math.max(
              old[durationRef.current] ||
                0,
              rounded,
            ),
        };

        try {
          localStorage.setItem(
            PB_KEY,
            JSON.stringify(next),
          );
        } catch {}

        const values =
          Object.values(next);

        const max = Math.max(
          0,
          ...values,
        );

        setBest(max);

        return next;
      });

      setHistory((old) => {
        const next = [
          rounded,
          ...old,
        ].slice(0, 10);

        try {
          localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(next),
          );
        } catch {}

        return next;
      });
    },
    [],
  );

  /* -----------------------------
     FINISH
  ----------------------------- */

  const finishTest = useCallback(() => {
    if (
      statusRef.current !==
      "running"
    ) {
      return;
    }

    stopTimers();

    /*
     * FINAL CPS IS ALWAYS:
     *
     * TOTAL CLICKS / SELECTED DURATION
     *
     * This keeps the final result
     * stable and predictable.
     */

    const finalCPS =
      clicksRef.current /
      durationRef.current;

    const finalStats =
      calculateStats(
        clickTimesRef.current,
        clicksRef.current,
      );

    setCps(finalCPS);
    setStats({
      ...finalStats,
      average: finalCPS,
    });

    setTimeLeft(0);
    setStatus("done");

    statusRef.current = "done";

    saveResult(finalCPS);
  }, [
    calculateStats,
    saveResult,
    stopTimers,
  ]);

  useEffect(() => {
    finishRef.current =
      finishTest;
  }, [finishTest]);

  /* -----------------------------
     TIMER
  ----------------------------- */

  const updateTimer =
    useCallback(() => {
      if (
        statusRef.current !==
          "running" ||
        startRef.current === null
      ) {
        return;
      }

      const elapsed =
        (performance.now() -
          startRef.current) /
        1000;

      const remaining =
        Math.max(
          0,
          durationRef.current -
            elapsed,
        );

      const liveCPS =
        elapsed > 0
          ? clicksRef.current /
            elapsed
          : 0;

      setTimeLeft(remaining);
      setCps(liveCPS);

      if (remaining <= 0) {
        finishRef.current();
        return;
      }

      animationRef.current =
        requestAnimationFrame(
          updateTimer,
        );
    }, []);

  /* -----------------------------
     START
  ----------------------------- */

  const startTest = useCallback(() => {
    stopTimers();

    clicksRef.current = 0;

    clickTimesRef.current = [];

    startRef.current =
      performance.now();

    statusRef.current =
      "running";

    setStatus("running");
    setClicks(0);
    setCps(0);
    setStats(emptyStats);
    setGraph([]);
    setTimeLeft(
      durationRef.current,
    );

    graphRef.current =
      window.setInterval(() => {
        if (
          statusRef.current !==
            "running" ||
          startRef.current === null
        ) {
          return;
        }

        const elapsed =
          (performance.now() -
            startRef.current) /
          1000;

        const liveCPS =
          elapsed > 0
            ? clicksRef.current /
              elapsed
            : 0;

        setGraph((old) => [
          ...old.slice(-44),
          liveCPS,
        ]);
      }, 150);

    animationRef.current =
      requestAnimationFrame(
        updateTimer,
      );
  }, [
    stopTimers,
    updateTimer,
  ]);

  /* -----------------------------
     RESET
  ----------------------------- */

  const resetTest =
    useCallback(() => {
      stopTimers();

      clicksRef.current = 0;

      clickTimesRef.current =
        [];

      startRef.current = null;

      statusRef.current =
        "idle";

      setStatus("idle");
      setClicks(0);
      setCps(0);
      setStats(emptyStats);
      setGraph([]);
      setRipples([]);
      setTimeLeft(
        durationRef.current,
      );
    }, [stopTimers]);

  /* -----------------------------
     CHANGE DURATION
  ----------------------------- */

  const changeDuration =
    useCallback(
      (seconds: number) => {
        if (
          statusRef.current ===
          "running"
        ) {
          return;
        }

        stopTimers();

        durationRef.current =
          seconds;

        startRef.current =
          null;

        statusRef.current =
          "idle";

        setDuration(seconds);
        setStatus("idle");
        setClicks(0);
        setCps(0);
        setStats(emptyStats);
        setGraph([]);
        setTimeLeft(seconds);
      },
      [stopTimers],
    );

  /* -----------------------------
     CLICK
  ----------------------------- */

  const handleClick =
    (
      event: ReactPointerEvent<HTMLDivElement>,
    ) => {
      if (
        statusRef.current ===
        "done"
      ) {
        resetTest();
        return;
      }

      if (
        statusRef.current ===
        "idle"
      ) {
        startTest();
      }

      const now =
        performance.now();

      clicksRef.current += 1;

      clickTimesRef.current.push(
        now,
      );

      setClicks(
        clicksRef.current,
      );

      clickSound();

      const rect =
        event.currentTarget.getBoundingClientRect();

      const ripple: Ripple = {
        id:
          Date.now() +
          Math.random(),

        x:
          event.clientX -
          rect.left,

        y:
          event.clientY -
          rect.top,
      };

      setRipples((old) => [
        ...old.slice(-6),
        ripple,
      ]);

      window.setTimeout(() => {
        setRipples((old) =>
          old.filter(
            (r) =>
              r.id !==
              ripple.id,
          ),
        );
      }, 500);

      /*
       * Update extra statistics
       * while testing.
       */
      if (
        startRef.current !==
        null
      ) {
        const current =
          calculateStats(
            clickTimesRef.current,
            clicksRef.current,
          );

        setStats(current);
      }
    };

  /* -----------------------------
     SHARE
  ----------------------------- */

  const shareResult =
    async () => {
      const text =
        `I scored ${cps.toFixed(
          2,
        )} CPS on the NEXORA CPS Test. ` +
        `Can you beat my score?`;

      try {
        if (
          navigator.share
        ) {
          await navigator.share(
            {
              title:
                "NEXORA CPS Test",
              text,
              url:
                window.location
                  .href,
            },
          );
        } else {
          await navigator.clipboard.writeText(
            `${text} ${window.location.href}`,
          );

          window.alert(
            "Result copied!",
          );
        }
      } catch {}
    };

  /* -----------------------------
     RANK
  ----------------------------- */

  const getRank =
    (score: number) => {
      if (score < 4)
        return {
          icon: "🐢",
          title:
            "Getting Started",
        };

      if (score < 6)
        return {
          icon: "👍",
          title:
            "Good Clicker",
        };

      if (score < 8)
        return {
          icon: "🔥",
          title:
            "Fast Clicker",
        };

      if (score < 10)
        return {
          icon: "⚡",
          title:
            "Elite Clicker",
        };

      return {
        icon: "👑",
        title:
          "Insane Clicker",
      };
    };

  const rank =
    status === "done"
      ? getRank(cps)
      : null;

  const progress =
    status === "idle"
      ? 0
      : Math.min(
          100,
          Math.max(
            0,
            ((duration -
              timeLeft) /
              duration) *
              100,
          ),
        );

  const currentPB =
    bestByTime[
      String(duration)
    ] || 0;

  return (
    <main className="page">
      <style jsx>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top,
              rgba(34,197,94,.07),
              transparent 34%
            ),
            #070b14;
          color: #fff;
          padding: 16px 12px 45px;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .wrap {
          width: 100%;
          max-width: 850px;
          margin: auto;
        }

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 22px;
        }

        .logo {
          font-size: 18px;
          font-weight: 900;
        }

        .logo span {
          color: #22c55e;
        }

        .topBest {
          background: #111827;
          border: 1px solid #263244;
          border-radius: 999px;
          padding: 7px 11px;
          font-size: 11px;
          font-weight: 800;
        }

        .topBest b {
          color: #22c55e;
        }

        .hero {
          text-align: center;
          margin-bottom: 17px;
        }

        .tag {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 999px;
          background: rgba(34,197,94,.08);
          border: 1px solid rgba(34,197,94,.2);
          color: #86efac;
          font-size: 10px;
          font-weight: 900;
          margin-bottom: 9px;
        }

        h1 {
          margin: 0;
          font-size: clamp(27px, 6vw, 40px);
          line-height: 1;
          letter-spacing: -1px;
        }

        h1 span {
          color: #22c55e;
        }

        .sub {
          color: #64748b;
          max-width: 580px;
          margin: 9px auto 0;
          font-size: 12px;
          line-height: 1.5;
        }

        .durations {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 10px;
        }

        .duration {
          border: 1px solid #293548;
          background: #111827;
          color: #94a3b8;
          border-radius: 999px;
          padding: 8px 15px;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .duration.active {
          background: #22c55e;
          border-color: #22c55e;
          color: #031108;
        }

        .duration:disabled {
          opacity: .55;
        }

        .clickArea {
          position: relative;
          min-height: 285px;
          width: 100%;
          border: 2px solid #263244;
          border-radius: 20px;
          background:
            linear-gradient(
              145deg,
              #172033,
              #0e1625
            );
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          overflow: hidden;
          cursor: pointer;
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
              #0e3a57
            );
        }

        .clickArea.done {
          border-color: #22c55e;
          background:
            linear-gradient(
              145deg,
              #14532d,
              #0e3923
            );
        }

        .timer {
          background: rgba(0,0,0,.3);
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 900;
        }

        .number {
          font-size: clamp(
            64px,
            15vw,
            100px
          );
          line-height: .9;
          font-weight: 950;
          letter-spacing: -4px;
          margin-top: 8px;
        }

        .instruction {
          margin-top: 10px;
          font-size: 16px;
          font-weight: 950;
        }

        .hint {
          margin-top: 5px;
          color: rgba(255,255,255,.62);
          font-size: 11px;
        }

        .progress {
          width: 82%;
          height: 7px;
          margin-top: 18px;
          background: rgba(0,0,0,.3);
          border-radius: 999px;
          overflow: hidden;
        }

        .progressFill {
          height: 100%;
          background: #fff;
          border-radius: inherit;
          transition: width .08s linear;
        }

        .ripple {
          position: absolute;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255,255,255,.4);
          pointer-events: none;
          animation: ripple .5s ease-out forwards;
        }

        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: .8;
          }
          to {
            transform: scale(3.4);
            opacity: 0;
          }
        }

        .stats {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 8px;
          margin-top: 9px;
        }

        .stat {
          background: #111827;
          border: 1px solid #202c3e;
          border-radius: 14px;
          padding: 12px 5px;
          text-align: center;
        }

        .value {
          display: block;
          color: #22c55e;
          font-size: 20px;
          line-height: 1;
          font-weight: 950;
        }

        .label {
          display: block;
          margin-top: 6px;
          color: #64748b;
          font-size: 9px;
          font-weight: 900;
        }

        .panel {
          margin-top: 9px;
          background: #111827;
          border: 1px solid #202c3e;
          border-radius: 15px;
          padding: 13px;
        }

        .panelTitle {
          font-size: 12px;
          font-weight: 950;
        }

        .graph {
          height: 75px;
          margin-top: 9px;
          display: flex;
          align-items: flex-end;
          gap: 2px;
          overflow: hidden;
        }

        .bar {
          flex: 1;
          min-width: 3px;
          max-width: 11px;
          border-radius: 4px 4px 0 0;
        }

        .metrics {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 7px;
          margin-top: 10px;
        }

        .metric {
          background: #0b1220;
          border: 1px solid #1e2a3d;
          border-radius: 11px;
          padding: 9px 5px;
          text-align: center;
        }

        .metric strong {
          display: block;
          font-size: 14px;
          color: #e2e8f0;
        }

        .metric span {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 8px;
          font-weight: 900;
        }

        .result {
          margin-top: 10px;
          background: #111827;
          border: 2px solid #22c55e;
          border-radius: 16px;
          padding: 17px;
          text-align: center;
        }

        .resultScore {
          color: #22c55e;
          font-size: 43px;
          line-height: 1;
          font-weight: 950;
        }

        .resultSmall {
          color: #64748b;
          font-size: 9px;
          font-weight: 900;
          margin-top: 4px;
        }

        .rank {
          font-size: 20px;
          font-weight: 950;
          margin-top: 12px;
        }

        .buttons {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 13px;
        }

        button.action {
          border: 0;
          border-radius: 999px;
          padding: 11px 20px;
          font-size: 12px;
          font-weight: 950;
          cursor: pointer;
        }

        .green {
          background: #22c55e;
          color: #031108;
        }

        .gray {
          background: #1e293b;
          color: #fff;
          border: 1px solid #334155 !important;
        }

        .sound {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }

        .soundBtn {
          background: transparent;
          border: 0;
          color: #64748b;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .history {
          text-align: center;
        }

        .historyTitle {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 900;
        }

        .chips {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }

        .chip {
          background: #0b1220;
          border: 1px solid #253247;
          color: #cbd5e1;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 9px;
          font-weight: 900;
        }

        .content {
          margin-top: 19px;
          background: #111827;
          border: 1px solid #202c3e;
          border-radius: 16px;
          padding: 17px;
        }

        .content h2 {
          margin: 0 0 8px;
          font-size: 17px;
        }

        .content h3 {
          margin: 15px 0 5px;
          font-size: 13px;
        }

        .content p,
        .content li {
          color: #64748b;
          font-size: 11px;
          line-height: 1.65;
        }

        .content p {
          margin: 0;
        }

        .content ul {
          margin: 6px 0 0;
          padding-left: 18px;
        }

        .footer {
          text-align: center;
          margin-top: 18px;
          color: #334155;
          font-size: 9px;
        }

        @media (max-width: 620px) {
          .page {
            padding: 13px 10px 35px;
          }

          .top {
            margin-bottom: 18px;
          }

          .stats {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .metrics {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .clickArea {
            min-height: 270px;
          }

          .instruction {
            font-size: 14px;
          }

          .sub {
            font-size: 11px;
          }
        }
      `}</style>

      <div className="wrap">

        {/* HEADER */}

        <header className="top">
          <div className="logo">
            NEXORA{" "}
            <span>TOOLS</span>
          </div>

          <div className="topBest">
            🏆 Best{" "}
            <b>
              {best.toFixed(2)}
            </b>
          </div>
        </header>

        {/* HERO */}

        <section className="hero">
          <div className="tag">
            ⚡ FREE • ACCURATE • NO SIGN UP
          </div>

          <h1>
            CPS Test —{" "}
            <span>
              Clicks Per Second
            </span>
          </h1>

          <p className="sub">
            Measure your click speed with
            accurate timing, live performance
            and detailed stats.
          </p>
        </section>

        {/* DURATIONS */}

        <div className="durations">
          {DURATIONS.map(
            (seconds) => (
              <button
                key={seconds}
                className={`duration ${
                  duration ===
                  seconds
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  changeDuration(
                    seconds,
                  )
                }
                disabled={
                  status ===
                  "running"
                }
              >
                {seconds}s
              </button>
            ),
          )}
        </div>

        {/* CLICK AREA */}

        <div
          className={`clickArea ${
            status ===
            "running"
              ? "running"
              : status ===
                  "done"
                ? "done"
                : ""
          }`}
          onPointerDown={
            handleClick
          }
          role="button"
          tabIndex={0}
        >
          {ripples.map(
            (ripple) => (
              <span
                key={
                  ripple.id
                }
                className="ripple"
                style={{
                  left:
                    ripple.x -
                    21,
                  top:
                    ripple.y -
                    21,
                }}
              />
            ),
          )}

          <div className="timer">
            {status ===
            "running"
              ? `${timeLeft.toFixed(
                  1,
                )}s`
              : status ===
                  "done"
                ? "DONE"
                : `${duration}s`}
          </div>

          <div className="number">
            {clicks}
          </div>

          <div className="instruction">
            {status ===
              "idle" &&
              "👆 CLICK TO START"}

            {status ===
              "running" &&
              "⚡ CLICK AS FAST AS YOU CAN"}

            {status ===
              "done" &&
              `${cps.toFixed(
                2,
              )} CPS`}
          </div>

          <div className="hint">
            {status ===
              "idle" &&
              "Timer starts with your first click"}

            {status ===
              "running" &&
              `Current ${cps.toFixed(
                2,
              )} CPS`}

            {status ===
              "done" &&
              "Tap to play again"}
          </div>

          <div className="progress">
            <div
              className="progressFill"
              style={{
                width:
                  `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* MAIN STATS */}

        <div className="stats">
          <div className="stat">
            <span className="value">
              {clicks}
            </span>

            <span className="label">
              CLICKS
            </span>
          </div>

          <div className="stat">
            <span className="value">
              {cps.toFixed(2)}
            </span>

            <span className="label">
              CPS
            </span>
          </div>

          <div className="stat">
            <span className="value">
              {currentPB.toFixed(
                2,
              )}
            </span>

            <span className="label">
              {duration}s BEST
            </span>
          </div>

          <div className="stat">
            <span className="value">
              {timeLeft.toFixed(
                1,
              )}s
            </span>

            <span className="label">
              LEFT
            </span>
          </div>
        </div>

        {/* LIVE GRAPH */}

        {graph.length > 2 && (
          <section className="panel">
            <div className="panelTitle">
              📈 Live Performance
            </div>

            <div className="graph">
              {graph.map(
                (value, i) => {
                  const height =
                    Math.min(
                      100,
                      Math.max(
                        4,
                        (value /
                          15) *
                          100,
                      ),
                    );

                  let bg =
                    "#0ea5e9";

                  if (
                    value >=
                    10
                  ) {
                    bg =
                      "#ef4444";
                  } else if (
                    value >=
                    7
                  ) {
                    bg =
                      "#a855f7";
                  } else if (
                    value >=
                    5
                  ) {
                    bg =
                      "#22c55e";
                  }

                  return (
                    <div
                      key={i}
                      className="bar"
                      style={{
                        height:
                          `${height}%`,
                        background:
                          bg,
                      }}
                    />
                  );
                },
              )}
            </div>

            <div className="metrics">
              <div className="metric">
                <strong>
                  {stats.peak.toFixed(
                    1,
                  )}
                </strong>

                <span>
                  PEAK CPS
                </span>
              </div>

              <div className="metric">
                <strong>
                  {stats.average.toFixed(
                    2,
                  )}
                </strong>

                <span>
                  AVG CPS
                </span>
              </div>

              <div className="metric">
                <strong>
                  {stats.consistency.toFixed(
                    0,
                  )}%
                </strong>

                <span>
                  CONSISTENCY
                </span>
              </div>

              <div className="metric">
                <strong>
                  {stats.interval
                    ? `${stats.interval.toFixed(
                        0,
                      )}ms`
                    : "—"}
                </strong>

                <span>
                  AVG INTERVAL
                </span>
              </div>
            </div>
          </section>
        )}

        {/* RESULT */}

        {status ===
          "done" &&
          rank && (
            <section className="result">
              <div className="resultScore">
                {cps.toFixed(
                  2,
                )}
              </div>

              <div className="resultSmall">
                CLICKS PER SECOND
              </div>

              <div className="rank">
                {rank.icon}{" "}
                {rank.title}
              </div>

              <div className="buttons">
                <button
                  className="action green"
                  onClick={
                    resetTest
                  }
                >
                  ↻ Play Again
                </button>

                <button
                  className="action gray"
                  onClick={
                    shareResult
                  }
                >
                  📤 Share
                </button>
              </div>
            </section>
          )}

        {/* BUTTONS */}

        {status !==
          "done" && (
          <div className="buttons">
            <button
              className="action green"
              onClick={
                resetTest
              }
            >
              ↻ Restart
            </button>

            <button
              className="action gray"
              onClick={
                shareResult
              }
            >
              📤 Share
            </button>
          </div>
        )}

        {/* SOUND */}

        <div className="sound">
          <button
            className="soundBtn"
            onClick={() =>
              setSound(
                (v) => !v,
              )
            }
          >
            {sound
              ? "🔊 Click sound ON"
              : "🔇 Click sound OFF"}
          </button>
        </div>

        {/* HISTORY */}

        {history.length >
          0 && (
          <section className="panel history">
            <div className="historyTitle">
              LAST 10 SCORES
            </div>

            <div className="chips">
              {history.map(
                (
                  score,
                  i,
                ) => (
                  <span
                    className="chip"
                    key={`${score}-${i}`}
                  >
                    {score.toFixed(
                      2,
                    )}{" "}
                    CPS
                  </span>
                ),
              )}
            </div>
          </section>
        )}

        {/* SEO CONTENT */}

        <section className="content">
          <h2>
            CPS Test
          </h2>

          <p>
            CPS Test measures how many
            clicks you can make per second.
            Choose 1, 5, 10 or 30 seconds
            and click as quickly as possible.
          </p>

          <h3>
            What is a good CPS?
          </h3>

          <p>
            5–7 CPS is a good result for
            many users. 8+ CPS is fast, while
            10+ CPS is very high clicking
            speed. Results can vary by mouse,
            technique and device.
          </p>

          <h3>
            CPS Test features
          </h3>

          <ul>
            <li>
              Accurate high-resolution
              timing
            </li>

            <li>
              1, 5, 10 and 30 second modes
            </li>

            <li>
              Live CPS performance graph
            </li>

            <li>
              Peak and average CPS
            </li>

            <li>
              Click consistency and interval
            </li>

            <li>
              Personal best tracking
            </li>

            <li>
              Mouse and touchscreen support
            </li>

            <li>
              No account or signup required
            </li>
          </ul>

          <h3>
            How to improve CPS
          </h3>

          <p>
            Keep your hand relaxed, maintain
            a consistent rhythm and practice
            regularly. Different clicking
            techniques can produce different
            results, so focus on speed without
            causing hand or wrist discomfort.
          </p>
        </section>

        <footer className="footer">
          © {new Date().getFullYear()} NEXORA
          Tools
        </footer>
      </div>
    </main>
  );
}
