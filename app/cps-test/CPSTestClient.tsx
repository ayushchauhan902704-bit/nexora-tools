"use client";

import {
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Status = "idle" | "running" | "done";
type Mode = "time" | "target";

type ClickDot = {
  id: number;
  x: number;
  y: number;
};

const DURATIONS = [1, 5, 10, 30, 60];

const PB_KEY = "nexora_cps_pb_v8";
const HISTORY_KEY = "nexora_cps_history_v8";

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
  const [bestByTime, setBestByTime] =
    useState<Record<string, number>>({});

  const [history, setHistory] = useState<number[]>([]);

  const [graph, setGraph] = useState<number[]>([]);
  const [peak, setPeak] = useState(0);
  const [consistency, setConsistency] = useState(0);
  const [intervalMs, setIntervalMs] = useState(0);

  const [sound, setSound] = useState(false);
  const [inputType, setInputType] = useState("Mouse / Touch");

  const [clickDots, setClickDots] = useState<ClickDot[]>([]);

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

  const stopTimers = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (graphRef.current !== null) {
      window.clearInterval(graphRef.current);
      graphRef.current = null;
    }
  }, []);

  useEffect(() => {
    try {
      const pb = localStorage.getItem(PB_KEY);

      if (pb) {
        const parsed = JSON.parse(pb);

        if (parsed && typeof parsed === "object") {
          setBestByTime(parsed);

          const values = Object.values(parsed).filter(
            (value): value is number =>
              typeof value === "number"
          );

          if (values.length) {
            setBest(Math.max(...values));
          }
        }
      }

      const historyData =
        localStorage.getItem(HISTORY_KEY);

      if (historyData) {
        const parsed = JSON.parse(historyData);

        if (Array.isArray(parsed)) {
          setHistory(
            parsed
              .filter(
                (value): value is number =>
                  typeof value === "number"
              )
              .slice(0, 10)
          );
        }
      }
    } catch {}

    return () => {
      stopTimers();

      try {
        audioRef.current?.close();
      } catch {}
    };
  }, [stopTimers]);

  const clickSound = useCallback(() => {
    if (!sound) return;

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

      oscillator.frequency.value = 520;
      oscillator.type = "sine";

      gain.gain.setValueAtTime(
        0.035,
        ctx.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.035
      );

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.04);
    } catch {}
  }, [sound]);

  const calcStats = useCallback((times: number[]) => {
    if (times.length < 2) {
      return {
        peak: times.length,
        consistency: 100,
        interval: 0,
      };
    }

    let peakValue = 0;

    for (let i = 0; i < times.length; i++) {
      let count = 0;

      for (let j = i; j < times.length; j++) {
        if (times[j] - times[i] <= 1000) {
          count++;
        } else {
          break;
        }
      }

      peakValue = Math.max(peakValue, count);
    }

    const gaps: number[] = [];

    for (let i = 1; i < times.length; i++) {
      gaps.push(times[i] - times[i - 1]);
    }

    const averageGap =
      gaps.reduce(
        (sum, value) => sum + value,
        0
      ) / gaps.length;

    const variance =
      gaps.reduce(
        (sum, gap) =>
          sum +
          Math.pow(
            gap - averageGap,
            2
          ),
        0
      ) / gaps.length;

    const deviation = Math.sqrt(variance);

    const consistencyValue = Math.max(
      0,
      Math.min(
        100,
        100 -
          (deviation /
            Math.max(averageGap, 1)) *
            100
      )
    );

    return {
      peak: peakValue,
      consistency: consistencyValue,
      interval: averageGap,
    };
  }, []);

  const saveResult = useCallback(
    (score: number) => {
      const rounded = Number(
        score.toFixed(2)
      );

      const key =
        modeRef.current === "time"
          ? `${durationRef.current}s`
          : "100clicks";

      setBestByTime((old) => {
        const next = {
          ...old,
          [key]: Math.max(
            old[key] || 0,
            rounded
          ),
        };

        try {
          localStorage.setItem(
            PB_KEY,
            JSON.stringify(next)
          );
        } catch {}

        setBest(
          Math.max(
            0,
            ...Object.values(next)
          )
        );

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
            JSON.stringify(next)
          );
        } catch {}

        return next;
      });
    },
    []
  );

  const finishTest = useCallback(() => {
    if (
      statusRef.current !== "running" ||
      startRef.current === null
    ) {
      return;
    }

    stopTimers();

    const elapsed =
      (performance.now() -
        startRef.current) /
      1000;

    const finalCPS =
      modeRef.current === "time"
        ? clicksRef.current /
          Math.max(
            durationRef.current,
            0.01
          )
        : clicksRef.current /
          Math.max(
            elapsed,
            0.01
          );

    const stats = calcStats(
      clickTimesRef.current
    );

    setCps(finalCPS);
    setPeak(stats.peak);
    setConsistency(
      stats.consistency
    );
    setIntervalMs(
      stats.interval
    );
    setElapsedFinal(elapsed);
    setTimeLeft(0);

    statusRef.current = "done";
    setStatus("done");

    saveResult(finalCPS);
  }, [
    calcStats,
    saveResult,
    stopTimers,
  ]);

  useEffect(() => {
    finishRef.current = finishTest;
  }, [finishTest]);

  const updateTimer = useCallback(() => {
    if (
      statusRef.current !== "running" ||
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
          elapsed
      );

    const liveCPS =
      elapsed > 0
        ? clicksRef.current /
          elapsed
        : 0;

    setTimeLeft(remaining);
    setCps(liveCPS);

    if (
      modeRef.current === "time" &&
      remaining <= 0
    ) {
      finishRef.current();
      return;
    }

    if (
      modeRef.current === "target" &&
      clicksRef.current >= 100
    ) {
      finishRef.current();
      return;
    }

    animationRef.current =
      requestAnimationFrame(
        updateTimer
      );
  }, []);

  const startTest = useCallback(() => {
    stopTimers();

    clicksRef.current = 0;
    clickTimesRef.current = [];

    startRef.current =
      performance.now();

    statusRef.current = "running";

    setStatus("running");
    setClicks(0);
    setCps(0);
    setPeak(0);
    setConsistency(0);
    setIntervalMs(0);
    setGraph([]);
    setClickDots([]);

    setTimeLeft(
      durationRef.current
    );

    graphRef.current =
      window.setInterval(() => {
        if (
          statusRef.current !== "running" ||
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
        updateTimer
      );
  }, [
    stopTimers,
    updateTimer,
  ]);

  const resetTest = useCallback(() => {
    stopTimers();

    clicksRef.current = 0;
    clickTimesRef.current = [];
    startRef.current = null;

    statusRef.current = "idle";

    setStatus("idle");
    setClicks(0);
    setCps(0);
    setGraph([]);
    setClickDots([]);
    setPeak(0);
    setConsistency(0);
    setIntervalMs(0);
    setElapsedFinal(0);

    setTimeLeft(
      durationRef.current
    );
  }, [stopTimers]);

  const changeDuration = useCallback(
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

      startRef.current = null;

      statusRef.current = "idle";

      setDuration(seconds);
      setCustomTime(seconds);

      setStatus("idle");
      setClicks(0);
      setCps(0);
      setGraph([]);
      setClickDots([]);

      setTimeLeft(seconds);
    },
    [stopTimers]
  );

  const changeMode = useCallback(
    (newMode: Mode) => {
      if (
        statusRef.current ===
        "running"
      ) {
        return;
      }

      modeRef.current =
        newMode;

      setMode(newMode);

      resetTest();
    },
    [resetTest]
  );

  const handleClick = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (
      event.pointerType === "mouse"
    ) {
      setInputType("Mouse");
    } else if (
      event.pointerType === "touch"
    ) {
      setInputType("Touch");
    } else {
      setInputType("Pen");
    }

    if (
      statusRef.current === "done"
    ) {
      resetTest();
      return;
    }

    if (
      statusRef.current === "idle"
    ) {
      startTest();
    }

    const now =
      performance.now();

    clicksRef.current += 1;

    clickTimesRef.current.push(
      now
    );

    setClicks(
      clicksRef.current
    );

    clickSound();

    const rect =
      event.currentTarget.getBoundingClientRect();

    const dot: ClickDot = {
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

    setClickDots((old) => [
      ...old.slice(-12),
      dot,
    ]);

    window.setTimeout(() => {
      setClickDots((old) =>
        old.filter(
          (item) =>
            item.id !==
            dot.id
        )
      );
    }, 450);

    const stats =
      calcStats(
        clickTimesRef.current
      );

    setPeak(stats.peak);
    setConsistency(
      stats.consistency
    );
    setIntervalMs(
      stats.interval
    );

    if (
      modeRef.current === "target" &&
      clicksRef.current >= 100
    ) {
      finishRef.current();
    }
  };

  const shareResult = async () => {
    const text =
      `I scored ${cps.toFixed(
        2
      )} CPS on thenexoratools CPS Test. ` +
      `Peak ${peak.toFixed(
        1
      )} CPS with ${consistency.toFixed(
        0
      )}% consistency.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title:
            "CPS Test Result",
          text,
          url:
            window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `${text} ${window.location.href}`
        );

        window.alert(
          "Result copied!"
        );
      }
    } catch {}
  };

  const getPerformance =
    (score: number) => {
      if (score < 4) {
        return {
          icon: "🐢",
          title:
            "Getting Started",
          desc:
            "Keep practicing and focus on a relaxed, consistent clicking rhythm.",
        };
      }

      if (score < 6) {
        return {
          icon: "👍",
          title:
            "Good Speed",
          desc:
            "A solid clicking speed. Keep practicing for better consistency.",
        };
      }

      if (score < 8) {
        return {
          icon: "🔥",
          title:
            "Fast Clicker",
          desc:
            "Great clicking speed with strong performance.",
        };
      }

      if (score < 10) {
        return {
          icon: "⚡",
          title:
            "Very Fast",
          desc:
            "Excellent speed. Your clicking performance is well above the basic range.",
        };
      }

      if (score < 15) {
        return {
          icon: "👑",
          title:
            "Extremely Fast",
          desc:
            "A very high CPS result. Try another round and compare your consistency.",
        };
      }

      return {
        icon: "🚨",
        title:
          "Unusually High Speed",
        desc:
          "This CPS is unusually high for ordinary clicking. Device hardware, clicking technique or automated input may affect the result.",
      };
    };

  /*
   * IMPORTANT:
   * Do not name this variable "performance".
   * The browser already has a global performance object
   * used by performance.now().
   */
  const performanceResult =
    status === "done"
      ? getPerformance(cps)
      : null;

  const progress =
    status === "idle"
      ? 0
      : mode === "time"
        ? Math.min(
            100,
            ((duration -
              timeLeft) /
              duration) *
              100
          )
        : Math.min(
            100,
            (clicks / 100) *
              100
          );

  const currentPB =
    bestByTime[
      mode === "time"
        ? `${duration}s`
        : "100clicks"
    ] || 0;

  return (
    <main className="page">
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #ffffff;
          color: #111827;
          padding: 18px 14px 60px;
          font-family:
            "Avenir Next",
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .wrap {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 28px;
        }

        .logo {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: #111827;
        }

        .logo span {
          color: #16a34a;
        }

        .topBest {
          border: 1px solid #e5e7eb;
          background: #f8fafc;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
        }

        .topBest b {
          color: #16a34a;
        }

        .hero {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 22px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          padding: 6px 11px;
          border-radius: 999px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.2px;
        }

        h1 {
          margin: 11px 0 0;
          font-size: clamp(
            30px,
            6vw,
            50px
          );
          line-height: 1.03;
          letter-spacing: -1.8px;
          color: #0f172a;
        }

        h1 span {
          color: #16a34a;
        }

        .sub {
          max-width: 680px;
          margin: 11px auto 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        .modeRow {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .modeBtn,
        .duration {
          border: 1px solid #dbe2ea;
          background: #ffffff;
          color: #64748b;
          border-radius: 999px;
          font-weight: 900;
          cursor: pointer;
          transition:
            0.15s ease;
        }

        .modeBtn {
          padding: 10px 19px;
          font-size: 12px;
        }

        .modeBtn:hover,
        .duration:hover {
          border-color: #16a34a;
          color: #15803d;
        }

        .modeBtn.active {
          background: #111827;
          color: #ffffff;
          border-color: #111827;
        }

        .durations {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 10px;
        }

        .duration {
          padding: 8px 15px;
          font-size: 11px;
        }

        .duration.active {
          background: #16a34a;
          border-color: #16a34a;
          color: #ffffff;
        }

        .duration:disabled {
          opacity: 0.55;
        }

        .custom {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 15px;
          padding: 12px 14px;
          margin-bottom: 12px;
          text-align: center;
        }

        .custom label {
          color: #475569;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.3px;
        }

        .custom input {
          width: 100%;
          margin-top: 8px;
          accent-color: #16a34a;
        }

        .clickArea {
          position: relative;
          width: 100%;
          min-height: min(
            72vh,
            720px
          );
          border: 2px solid #dbe2ea;
          border-radius: 28px;
          background: #ffffff;
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
          box-shadow:
            0 14px 50px
              rgba(
                15,
                23,
                42,
                0.08
              );
          transition:
            border-color 0.2s
              ease,
            box-shadow 0.2s
              ease,
            background 0.2s
              ease;
        }

        .clickArea:hover {
          border-color: #cbd5e1;
          box-shadow:
            0 18px 60px
              rgba(
                15,
                23,
                42,
                0.1
              );
        }

        .clickArea.running {
          border-color: #86efac;
          box-shadow:
            0 18px 70px
              rgba(
                22,
                163,
                74,
                0.12
              );
        }

        .clickArea.done {
          border-color: #22c55e;
          background: #f7fff9;
        }

        .timer {
          background: #f1f5f9;
          color: #475569;
          border-radius: 999px;
          padding: 7px 13px;
          font-size: 12px;
          font-weight: 900;
        }

        .clickArea.running
          .timer {
          background: #f0fdf4;
          color: #15803d;
        }

        .number {
          margin-top: 15px;
          color: #0f172a;
          font-size: clamp(
            80px,
            18vw,
            150px
          );
          line-height: 0.88;
          font-weight: 950;
          letter-spacing: -7px;
        }

        .instruction {
          margin-top: 18px;
          color: #111827;
          font-size: clamp(
            17px,
            3vw,
            25px
          );
          font-weight: 950;
          letter-spacing: -0.5px;
        }

        .hint {
          margin-top: 7px;
          color: #94a3b8;
          font-size: 11px;
        }

        .progress {
          position: absolute;
          left: 8%;
          bottom: 25px;
          width: 84%;
          height: 7px;
          background: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
        }

        .progressFill {
          height: 100%;
          background: #16a34a;
          border-radius: inherit;
          transition:
            width 0.08s linear;
        }

        .clickDot {
          position: absolute;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid
            #ffffff;
          box-shadow:
            0 0 0 4px
              rgba(
                34,
                197,
                94,
                0.18
              ),
            0 3px 10px
              rgba(
                22,
                163,
                74,
                0.35
              );
          pointer-events: none;
          animation:
            clickDot
            0.45s ease-out
            forwards;
          z-index: 5;
        }

        @keyframes clickDot {
          0% {
            opacity: 1;
            transform: scale(
              0.55
            );
          }

          45% {
            opacity: 1;
            transform: scale(
              1.15
            );
          }

          100% {
            opacity: 0;
            transform: scale(
              0.85
            );
          }
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(
            4,
            1fr
          );
          gap: 9px;
          margin-top: 10px;
        }

        .stat {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 15px;
          padding: 13px 6px;
          text-align: center;
        }

        .value {
          display: block;
          color: #111827;
          font-size: 21px;
          line-height: 1;
          font-weight: 950;
        }

        .stat:nth-child(2)
          .value {
          color: #16a34a;
        }

        .label {
          display: block;
          margin-top: 6px;
          color: #94a3b8;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.3px;
        }

        .panel {
          margin-top: 10px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 14px;
        }

        .panelTitle {
          color: #111827;
          font-size: 12px;
          font-weight: 950;
        }

        .graph {
          height: 80px;
          margin-top: 10px;
          display: flex;
          align-items: flex-end;
          gap: 2px;
          overflow: hidden;
        }

        .bar {
          flex: 1;
          min-width: 3px;
          max-width: 12px;
          border-radius: 4px 4px 0 0;
        }

        .metrics {
          display: grid;
          grid-template-columns: repeat(
            4,
            1fr
          );
          gap: 7px;
          margin-top: 10px;
        }

        .metric {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          border-radius: 11px;
          padding: 9px 5px;
          text-align: center;
        }

        .metric strong {
          display: block;
          color: #111827;
          font-size: 14px;
        }

        .metric span {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
          font-size: 8px;
          font-weight: 900;
        }

        .result {
          margin-top: 12px;
          background: #ffffff;
          border: 2px solid #22c55e;
          border-radius: 20px;
          padding: 24px 18px;
          text-align: center;
          animation:
            resultSlideUp
            0.55s
            cubic-bezier(
              0.16,
              1,
              0.3,
              1
            )
            both;
          box-shadow:
            0 18px 60px
              rgba(
                22,
                163,
                74,
                0.12
              );
        }

        @keyframes resultSlideUp {
          from {
            opacity: 0;
            transform: translateY(
              100px
            );
          }

          to {
            opacity: 1;
            transform: translateY(
              0
            );
          }
        }

        .resultScore {
          color: #16a34a;
          font-size: clamp(
            50px,
            10vw,
            78px
          );
          line-height: 0.95;
          font-weight: 950;
          letter-spacing: -3px;
        }

        .resultSmall {
          color: #94a3b8;
          font-size: 9px;
          font-weight: 900;
          margin-top: 6px;
          letter-spacing: 0.4px;
        }

        .rank {
          color: #111827;
          font-size: 22px;
          font-weight: 950;
          margin-top: 17px;
        }

        .rankDesc {
          max-width: 560px;
          margin: 6px auto 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.55;
        }

        .resultInfo {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 15px;
        }

        .infoChip {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          color: #475569;
          border-radius: 999px;
          padding: 7px 10px;
          font-size: 9px;
          font-weight: 900;
        }

        .buttons {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 15px;
        }

        button.action {
          border: 0;
          border-radius: 999px;
          padding: 12px 21px;
          font-size: 12px;
          font-weight: 950;
          cursor: pointer;
        }

        .green {
          background: #16a34a;
          color: #ffffff;
        }

        .green:hover {
          background: #15803d;
        }

        .gray {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0 !important;
        }

        .gray:hover {
          background: #e2e8f0;
        }

        .sound {
          display: flex;
          justify-content: center;
          margin-top: 11px;
        }

        .soundBtn {
          background: transparent;
          border: 0;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .history {
          text-align: center;
        }

        .historyTitle {
          color: #64748b;
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
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 9px;
          font-weight: 900;
        }

        .content {
          margin-top: 20px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 19px;
        }

        .content h2 {
          margin: 0 0 8px;
          color: #111827;
          font-size: 18px;
        }

        .content h3 {
          margin: 17px 0 6px;
          color: #111827;
          font-size: 13px;
        }

        .content p,
        .content li {
          color: #64748b;
          font-size: 11px;
          line-height: 1.7;
        }

        .content p {
          margin: 0;
        }

        .content ul {
          margin: 7px 0 0;
          padding-left: 19px;
        }

        .footer {
          text-align: center;
          margin-top: 20px;
          color: #94a3b8;
          font-size: 9px;
        }

        @media (max-width: 620px) {
          .page {
            padding: 13px 10px 45px;
          }

          .top {
            margin-bottom: 20px;
          }

          .logo {
            font-size: 16px;
          }

          .topBest {
            font-size: 9px;
            padding: 7px 9px;
          }

          .hero {
            margin-bottom: 17px;
          }

          h1 {
            font-size: 32px;
          }

          .sub {
            font-size: 11px;
          }

          .modeRow {
            flex-direction: column;
          }

          .modeBtn {
            width: 100%;
          }

          .clickArea {
            min-height: 68vh;
            border-radius: 22px;
          }

          .number {
            font-size: 100px;
          }

          .instruction {
            font-size: 17px;
          }

          .stats,
          .metrics {
            grid-template-columns: repeat(
              2,
              1fr
            );
          }

          .progress {
            bottom: 20px;
          }

          .result {
            padding: 21px 14px;
          }

          .resultScore {
            font-size: 58px;
          }

          .rank {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="wrap">
        <header className="top">
          <div className="logo">
            thenexoratools
          </div>

          <div className="topBest">
            Personal Best{" "}
            <b>
              {best.toFixed(2)}
            </b>
          </div>
        </header>

        <section className="hero">
          <div className="tag">
            FREE • FAST • NO SIGN UP
          </div>

          <h1>
            CPS Test —{" "}
            <span>
              Clicks Per Second
            </span>
          </h1>

          <p className="sub">
            Test your clicking speed with
            accurate timing, custom
            challenges, peak CPS,
            consistency and personal
            best tracking.
          </p>
        </section>

        <div className="modeRow">
          <button
            className={`modeBtn ${
              mode === "time"
                ? "active"
                : ""
            }`}
            onClick={() =>
              changeMode("time")
            }
          >
            Time Test
          </button>

          <button
            className={`modeBtn ${
              mode === "target"
                ? "active"
                : ""
            }`}
            onClick={() =>
              changeMode("target")
            }
          >
            100 Click Challenge
          </button>
        </div>

        {mode === "time" && (
          <>
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
                        seconds
                      )
                    }
                    disabled={
                      status ===
                      "running"
                    }
                  >
                    {seconds}s
                  </button>
                )
              )}
            </div>

            <div className="custom">
              <label>
                CUSTOM TEST TIME:{" "}
                {customTime}{" "}
                SECONDS
              </label>

              <input
                type="range"
                min={1}
                max={60}
                value={customTime}
                disabled={
                  status ===
                  "running"
                }
                onChange={(event) => {
                  const value =
                    Number(
                      event.target
                        .value
                    );

                  setCustomTime(
                    value
                  );

                  changeDuration(
                    value
                  );
                }}
              />
            </div>
          </>
        )}

        {mode === "target" && (
          <div className="custom">
            <label>
              100 CLICK CHALLENGE
            </label>

            <p
              style={{
                fontSize: 11,
                color:
                  "#64748b",
                margin:
                  "6px 0 0",
              }}
            >
              Click 100 times as
              quickly as possible.
              Your completion time
              and CPS will be
              calculated
              automatically.
            </p>
          </div>
        )}

        <div
          className={`clickArea ${
            status === "running"
              ? "running"
              : status === "done"
                ? "done"
                : ""
          }`}
          onPointerDown={
            handleClick
          }
          role="button"
          tabIndex={0}
          aria-label="CPS clicking test area"
        >
          {clickDots.map(
            (dot) => (
              <span
                key={dot.id}
                className="clickDot"
                style={{
                  left:
                    dot.x - 6.5,
                  top:
                    dot.y - 6.5,
                }}
              />
            )
          )}

          <div className="timer">
            {status ===
            "running"
              ? mode === "time"
                ? `${timeLeft.toFixed(
                    1
                  )}s`
                : `${clicks}/100`
              : status ===
                  "done"
                ? "TEST COMPLETE"
                : mode ===
                    "time"
                  ? `${duration}s TEST`
                  : "100 CLICKS"}
          </div>

          <div className="number">
            {clicks}
          </div>

          <div className="instruction">
            {status === "idle" &&
              "CLICK ANYWHERE TO START"}

            {status === "running" &&
              "CLICK AS FAST AS YOU CAN"}

            {status === "done" &&
              `${cps.toFixed(
                2
              )} CPS`}
          </div>

          <div className="hint">
            {status === "idle" &&
              "Your first click starts the test"}

            {status === "running" &&
              `Current ${cps.toFixed(
                2
              )} CPS • ${inputType}`}

            {status === "done" &&
              "Your result is ready below"}
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
              {currentPB.toFixed(2)}
            </span>

            <span className="label">
              {mode === "time"
                ? `${duration}s BEST`
                : "100 CLICK BEST"}
            </span>
          </div>

          <div className="stat">
            <span className="value">
              {mode === "time"
                ? `${timeLeft.toFixed(
                    1
                  )}s`
                : status === "done"
                  ? `${elapsedFinal.toFixed(
                      2
                    )}s`
                  : `${Math.max(
                      0,
                      100 - clicks
                    )}`}
            </span>

            <span className="label">
              {mode === "time"
                ? "TIME LEFT"
                : status === "done"
                  ? "TOTAL TIME"
                  : "CLICKS LEFT"}
            </span>
          </div>
        </div>

        {graph.length > 2 && (
          <section className="panel">
            <div className="panelTitle">
              Live Performance
            </div>

            <div className="graph">
              {graph.map(
                (
                  value,
                  index
                ) => {
                  const height =
                    Math.min(
                      100,
                      Math.max(
                        4,
                        (value /
                          15) *
                          100
                      )
                    );

                  let background =
                    "#16a34a";

                  if (
                    value >= 10
                  ) {
                    background =
                      "#dc2626";
                  } else if (
                    value >= 7
                  ) {
                    background =
                      "#9333ea";
                  } else if (
                    value >= 5
                  ) {
                    background =
                      "#16a34a";
                  }

                  return (
                    <div
                      key={
                        index
                      }
                      className="bar"
                      style={{
                        height: `${height}%`,
                        background,
                      }}
                    />
                  );
                }
              )}
            </div>

            <div className="metrics">
              <div className="metric">
                <strong>
                  {peak.toFixed(
                    1
                  )}
                </strong>

                <span>
                  PEAK CPS
                </span>
              </div>

              <div className="metric">
                <strong>
                  {cps.toFixed(
                    2
                  )}
                </strong>

                <span>
                  AVERAGE CPS
                </span>
              </div>

              <div className="metric">
                <strong>
                  {consistency.toFixed(
                    0
                  )}
                  %
                </strong>

                <span>
                  CONSISTENCY
                </span>
              </div>

              <div className="metric">
                <strong>
                  {intervalMs
                    ? `${intervalMs.toFixed(
                        0
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

        {status === "done" &&
          performanceResult && (
            <section className="result">
              <div className="resultScore">
                {cps.toFixed(2)}
              </div>

              <div className="resultSmall">
                CLICKS PER SECOND
                {mode ===
                  "target" &&
                  ` • COMPLETED IN ${elapsedFinal.toFixed(
                    2
                  )}s`}
              </div>

              <div className="rank">
                {performanceResult.icon}{" "}
                {
                  performanceResult.title
                }
              </div>

              <p className="rankDesc">
                {
                  performanceResult.desc
                }
              </p>

              <div className="resultInfo">
                <span className="infoChip">
                  Peak{" "}
                  {peak.toFixed(
                    1
                  )} CPS
                </span>

                <span className="infoChip">
                  {consistency.toFixed(
                    0
                  )}
                  % Consistency
                </span>

                <span className="infoChip">
                  Input:{" "}
                  {inputType}
                </span>
              </div>

              <div className="buttons">
                <button
                  className="action green"
                  onClick={
                    resetTest
                  }
                >
                  Play Again
                </button>

                <button
                  className="action gray"
                  onClick={
                    shareResult
                  }
                >
                  Share Result
                </button>
              </div>
            </section>
          )}

        {status !== "done" && (
          <div className="buttons">
            <button
              className="action green"
              onClick={
                resetTest
              }
            >
              Restart Test
            </button>

            <button
              className="action gray"
              onClick={
                shareResult
              }
            >
              Share
            </button>
          </div>
        )}

        <div className="sound">
          <button
            className="soundBtn"
            onClick={() =>
              setSound(
                (value) =>
                  !value
              )
            }
          >
            {sound
              ? "Click Sound On"
              : "Click Sound Off"}
          </button>
        </div>

        {history.length > 0 && (
          <section className="panel history">
            <div className="historyTitle">
              LAST 10 SCORES
            </div>

            <div className="chips">
              {history.map(
                (
                  score,
                  index
                ) => (
                  <span
                    className="chip"
                    key={`${score}-${index}`}
                  >
                    {score.toFixed(
                      2
                    )} CPS
                  </span>
                )
              )}
            </div>
          </section>
        )}

        <section className="content">
          <h2>
            CPS Test – Clicks Per Second Test
          </h2>

          <p>
            CPS stands for Clicks Per
            Second. This free CPS Test
            measures how quickly you can
            click during a timed challenge.
            Choose a test from 1 to 60
            seconds or complete the 100
            Click Challenge.
          </p>

          <h3>
            What is CPS?
          </h3>

          <p>
            CPS is the number of clicks
            made per second. For example,
            30 clicks during a 5-second
            test gives an average result of
            6 CPS.
          </p>

          <h3>
            How is CPS calculated?
          </h3>

          <p>
            For a timed test, CPS is
            calculated by dividing your
            total clicks by the test
            duration in seconds. The 100
            Click Challenge calculates CPS
            from the time required to
            complete all 100 clicks.
          </p>

          <h3>
            How to improve your clicking speed
          </h3>

          <ul>
            <li>
              Keep your hand relaxed.
            </li>

            <li>
              Practice regularly in short
              sessions.
            </li>

            <li>
              Focus on a steady clicking
              rhythm.
            </li>

            <li>
              Use a responsive mouse or
              touch device.
            </li>

            <li>
              Avoid excessive force while
              clicking.
            </li>
          </ul>

          <h3>
            Is a very high CPS always accurate?
          </h3>

          <p>
            Extremely high results can be
            influenced by clicking technique,
            device hardware, browser behavior
            or automated input. This test
            reports the measured result and
            does not claim to identify a
            specific clicking method.
          </p>
        </section>

        <footer className="footer">
          © {new Date().getFullYear()}{" "}
          thenexoratools
        </footer>
      </div>
    </main>
  );
}
