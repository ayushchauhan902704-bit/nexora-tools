"use client";

import {
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type GameState = "idle" | "playing" | "finished" | "failed";
type TargetType = "red" | "yellow";

type RoundResult = {
  round: number;
  time: number;
};

const TOTAL_ROUNDS = 10;
const TOTAL_DOTS = 20;
const BEST_KEY = "nexora_reaction_target_best_v1";

export default function ReactionClient() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [activeTarget, setActiveTarget] = useState<number | null>(null);
  const [targetType, setTargetType] = useState<TargetType>("red");
  const [lastReaction, setLastReaction] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [message, setMessage] = useState("Ready when you are");
  const [trapEnabled, setTrapEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const targetStartRef = useRef<number | null>(null);
  const roundRef = useRef(0);
  const stateRef = useRef<GameState>("idle");
  const targetRef = useRef<number | null>(null);
  const targetTypeRef = useRef<TargetType>("red");
  const lockedRef = useRef(false);
  const resultsRef = useRef<RoundResult[]>([]);
  const trapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextRoundTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BEST_KEY);

      if (saved) {
        const value = Number(saved);

        if (Number.isFinite(value) && value > 0) {
          setBestScore(value);
        }
      }
    } catch {}

    return () => {
      if (trapTimerRef.current) clearTimeout(trapTimerRef.current);
      if (startDelayRef.current) clearTimeout(startDelayRef.current);
      if (nextRoundTimerRef.current) {
        clearTimeout(nextRoundTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  const getRandomDot = useCallback(() => {
    return Math.floor(Math.random() * TOTAL_DOTS);
  }, []);

  const clearTrapTimer = useCallback(() => {
    if (trapTimerRef.current) {
      clearTimeout(trapTimerRef.current);
      trapTimerRef.current = null;
    }
  }, []);

  const clearGameTimers = useCallback(() => {
    clearTrapTimer();

    if (startDelayRef.current) {
      clearTimeout(startDelayRef.current);
      startDelayRef.current = null;
    }

    if (nextRoundTimerRef.current) {
      clearTimeout(nextRoundTimerRef.current);
      nextRoundTimerRef.current = null;
    }
  }, [clearTrapTimer]);

  const startRound = useCallback(
    (roundNumber: number) => {
      clearTrapTimer();

      lockedRef.current = false;
      roundRef.current = roundNumber;

      setRound(roundNumber);
      setLastReaction(null);
      setErrorMessage("");

      let nextDot = getRandomDot();

      if (nextDot === targetRef.current) {
        nextDot = (nextDot + 1) % TOTAL_DOTS;
      }

      const showTrap = Math.random() < 0.42;

      setTrapEnabled(showTrap);

      targetRef.current = nextDot;
      targetTypeRef.current = "red";

      setActiveTarget(nextDot);
      setTargetType("red");
      setMessage("Tap the red target");

      setGameState("playing");
      stateRef.current = "playing";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          targetStartRef.current = performance.now();
        });
      });

      if (showTrap) {
        trapTimerRef.current = setTimeout(() => {
          if (
            stateRef.current !== "playing" ||
            lockedRef.current
          ) {
            return;
          }

          let trapDot = getRandomDot();

          while (trapDot === targetRef.current) {
            trapDot = getRandomDot();
          }

          setActiveTarget(trapDot);
          setTargetType("yellow");
          targetTypeRef.current = "yellow";
          setMessage("Yellow is a trap — wait for red");

          trapTimerRef.current = setTimeout(() => {
            if (
              stateRef.current !== "playing" ||
              lockedRef.current
            ) {
              return;
            }

            setActiveTarget(targetRef.current);
            setTargetType("red");
            targetTypeRef.current = "red";
            setMessage("Tap the red target");
          }, 650);
        }, 500 + Math.random() * 850);
      }
    },
    [clearTrapTimer, getRandomDot],
  );

  const startGame = useCallback(() => {
    clearGameTimers();

    lockedRef.current = false;
    resultsRef.current = [];

    setResults([]);
    setRound(1);
    roundRef.current = 1;
    setLastReaction(null);
    setErrorMessage("");
    setActiveTarget(null);
    setTargetType("red");
    setTrapEnabled(false);
    setMessage("Get ready...");

    setGameState("playing");
    stateRef.current = "playing";

    startDelayRef.current = setTimeout(() => {
      startRound(1);
    }, 500);
  }, [clearGameTimers, startRound]);

  const finishSuccess = useCallback(
    (finalResults: RoundResult[]) => {
      clearTrapTimer();

      if (finalResults.length !== TOTAL_ROUNDS) {
        return;
      }

      const times = finalResults.map((item) => item.time);

      const average = Math.round(
        times.reduce((sum, value) => sum + value, 0) /
          times.length,
      );

      try {
        const old = Number(localStorage.getItem(BEST_KEY));

        if (!old || average < old) {
          localStorage.setItem(BEST_KEY, String(average));
          setBestScore(average);
        }
      } catch {}

      setActiveTarget(null);
      setTargetType("red");
      setTrapEnabled(false);
      setLastReaction(null);
      setMessage("Challenge complete");

      setGameState("finished");
      stateRef.current = "finished";
    },
    [clearTrapTimer],
  );

  const failGame = useCallback(() => {
    clearTrapTimer();

    lockedRef.current = true;

    setActiveTarget(null);
    setTrapEnabled(false);
    setErrorMessage(
      "You touched the yellow trap. Stay focused and try again.",
    );
    setMessage("Challenge failed");

    setGameState("failed");
    stateRef.current = "failed";
  }, [clearTrapTimer]);

  const handleDotPress = useCallback(
    (
      dotIndex: number,
      event?: ReactPointerEvent<HTMLButtonElement>,
    ) => {
      if (
        event?.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      if (stateRef.current !== "playing") return;
      if (lockedRef.current) return;

      if (dotIndex !== activeTarget) return;

      lockedRef.current = true;

      if (targetTypeRef.current === "yellow") {
        failGame();
        return;
      }

      const start = targetStartRef.current;

      if (start === null) {
        lockedRef.current = false;
        return;
      }

      const reaction = performance.now() - start;

      const clean = Math.max(
        1,
        Math.round(reaction),
      );

      const newResult: RoundResult = {
        round: roundRef.current,
        time: clean,
      };

      const updatedResults = [
        ...resultsRef.current,
        newResult,
      ];

      resultsRef.current = updatedResults;
      setResults(updatedResults);
      setLastReaction(clean);

      if (roundRef.current >= TOTAL_ROUNDS) {
        finishSuccess(updatedResults);
        return;
      }

      const nextRound = roundRef.current + 1;

      setMessage(`${clean} ms — Next target...`);

      nextRoundTimerRef.current = setTimeout(() => {
        lockedRef.current = false;
        startRound(nextRound);
      }, 350);
    },
    [activeTarget, failGame, finishSuccess, startRound],
  );

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (
        event.code !== "Space" &&
        event.code !== "Enter"
      ) {
        return;
      }

      event.preventDefault();

      if (stateRef.current === "idle") {
        startGame();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [startGame]);

  const times = results.map((item) => item.time);

  const average = times.length
    ? Math.round(
        times.reduce((sum, value) => sum + value, 0) /
          times.length,
      )
    : 0;

  const bestRound = times.length
    ? Math.min(...times)
    : 0;

  const slowestRound = times.length
    ? Math.max(...times)
    : 0;

  const consistency = useMemo(() => {
    if (times.length < 2) return 100;

    const mean =
      times.reduce((sum, value) => sum + value, 0) /
      times.length;

    const variance =
      times.reduce(
        (sum, value) =>
          sum + Math.pow(value - mean, 2),
        0,
      ) / times.length;

    const deviation = Math.sqrt(variance);

    return Math.max(
      0,
      Math.min(
        100,
        100 -
          (deviation / Math.max(mean, 1)) * 100,
      ),
    );
  }, [times]);

  const rating =
    average > 0
      ? average < 180
        ? {
            title: "Exceptional Reflexes",
            icon: "⚡",
          }
        : average < 220
          ? {
              title: "Excellent Reaction",
              icon: "🔥",
            }
          : average < 280
            ? {
                title: "Very Fast",
                icon: "🚀",
              }
            : average < 350
              ? {
                  title: "Fast Reaction",
                  icon: "🎯",
                }
              : average < 450
                ? {
                    title: "Good Start",
                    icon: "👍",
                  }
                : {
                    title: "Keep Practicing",
                    icon: "💪",
                  }
      : null;

  const shareResult = async () => {
    if (!average) return;

    const text =
      `I scored an average reaction time of ${average} ms on the Reaction Time Test at The Nexora Tools. Can you beat me?`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Reaction Time Test",
          text,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${text} ${window.location.href}`,
        );

        window.alert("Result copied to clipboard.");
      }
    } catch {}
  };

  const restart = () => {
    clearGameTimers();

    lockedRef.current = false;
    resultsRef.current = [];

    setResults([]);
    setRound(0);
    setLastReaction(null);
    setActiveTarget(null);
    setTargetType("red");
    setTrapEnabled(false);
    setErrorMessage("");
    setMessage("Ready when you are");

    setGameState("idle");
    stateRef.current = "idle";
  };

  if (gameState === "idle") {
    return (
      <main className="page">
        <style jsx>{`
          .page {
            min-height: 100svh;
            background:
              radial-gradient(
                circle at top,
                #fff5fa 0%,
                #ffffff 42%
              );
            color: #111827;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
            padding: 14px;
          }

          .container {
            width: 100%;
            max-width: 1180px;
            margin: 0 auto;
          }

          .topbar {
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .brand {
            font-size: 15px;
            font-weight: 950;
            letter-spacing: -0.6px;
          }

          .brandDot {
            color: #ec4899;
          }

          .mini {
            color: #64748b;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 0.8px;
            text-transform: uppercase;
          }

          .hero {
            text-align: center;
            padding: 36px 12px 20px;
          }

          .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #db2777;
            background: #fdf2f8;
            border: 1px solid #fbcfe8;
            padding: 7px 11px;
            border-radius: 999px;
            font-size: 8px;
            font-weight: 950;
            letter-spacing: 0.8px;
            text-transform: uppercase;
          }

          h1 {
            margin: 14px 0 8px;
            font-size: clamp(31px, 6vw, 58px);
            line-height: 0.95;
            letter-spacing: -2.8px;
            font-weight: 950;
            color: #111827;
          }

          h1 span {
            color: #ec4899;
          }

          .subtitle {
            max-width: 600px;
            margin: 0 auto;
            color: #64748b;
            font-size: 11px;
            line-height: 1.65;
          }

          .startBox {
            width: 100%;
            max-width: 1050px;
            min-height: min(58svh, 570px);
            margin: 16px auto 0;
            border: 1px solid #f1dce8;
            border-radius: 28px;
            background:
              linear-gradient(
                145deg,
                #ffffff,
                #fff8fb
              );
            box-shadow:
              0 18px 60px
                rgba(236, 72, 153, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            transition:
              transform 0.15s ease,
              box-shadow 0.15s ease;
          }

          .startBox:hover {
            transform: translateY(-2px);
            box-shadow:
              0 24px 70px
                rgba(236, 72, 153, 0.14);
          }

          .startInner {
            text-align: center;
          }

          .startIcon {
            width: 70px;
            height: 70px;
            margin: 0 auto 16px;
            border-radius: 22px;
            display: grid;
            place-items: center;
            background:
              linear-gradient(
                135deg,
                #fdf2f8,
                #fce7f3
              );
            border: 1px solid #fbcfe8;
            font-size: 31px;
            box-shadow:
              0 10px 30px
                rgba(236, 72, 153, 0.1);
          }

          .startTitle {
            font-size: clamp(25px, 5vw, 40px);
            line-height: 1;
            font-weight: 950;
            letter-spacing: -1.7px;
          }

          .startText {
            margin-top: 9px;
            color: #64748b;
            font-size: 10px;
            font-weight: 750;
          }

          .startHint {
            margin-top: 16px;
            display: inline-block;
            padding: 10px 15px;
            border-radius: 999px;
            background: #111827;
            color: #fff;
            font-size: 9px;
            font-weight: 950;
            letter-spacing: 0.2px;
          }

          .rules {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            max-width: 1050px;
            margin: 10px auto 0;
          }

          .rule {
            border: 1px solid #f0e7ec;
            border-radius: 14px;
            padding: 11px 8px;
            text-align: center;
            background: rgba(255, 255, 255, 0.8);
          }

          .ruleIcon {
            font-size: 15px;
          }

          .ruleText {
            margin-top: 4px;
            color: #475569;
            font-size: 8px;
            font-weight: 800;
          }

          .ruleText strong {
            color: #111827;
          }

          .seoIntro {
            max-width: 900px;
            margin: 24px auto 0;
            padding: 18px;
            border: 1px solid #f1e7ed;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.75);
          }

          .seoIntro h2 {
            margin: 0 0 7px;
            font-size: 16px;
            font-weight: 950;
          }

          .seoIntro p {
            margin: 0;
            color: #64748b;
            font-size: 9px;
            line-height: 1.75;
          }

          .footer {
            text-align: center;
            color: #94a3b8;
            font-size: 8px;
            margin: 22px 0 4px;
          }

          @media (max-width: 600px) {
            .page {
              padding: 10px;
            }

            .hero {
              padding: 28px 8px 13px;
            }

            h1 {
              font-size: 31px;
            }

            .subtitle {
              font-size: 10px;
            }

            .startBox {
              min-height: 59svh;
              border-radius: 22px;
            }

            .rules {
              grid-template-columns: repeat(3, 1fr);
            }

            .rule {
              padding: 9px 5px;
            }
          }
        `}</style>

        <div className="container">
          <header className="topbar">
            <div className="brand">
              thenexoratools
              <span className="brandDot">.</span>
            </div>

            <div className="mini">
              Reaction Speed Test
            </div>
          </header>

          <section className="hero">
            <div className="eyebrow">
              ⚡ Reflex Challenge
            </div>

            <h1>
              Reaction Time <span>Test</span>
            </h1>

            <p className="subtitle">
              Test your reaction speed with a fast,
              browser-based reflex challenge. Find the
              red target, avoid yellow traps, and measure
              your response time in milliseconds.
            </p>
          </section>

          <div
            className="startBox"
            role="button"
            tabIndex={0}
            aria-label="Start reaction time test"
            onPointerDown={() => startGame()}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();
                startGame();
              }
            }}
          >
            <div className="startInner">
              <div className="startIcon">⚡</div>

              <div className="startTitle">
                Start Reaction Test
              </div>

              <div className="startText">
                10 rounds • 20 targets • millisecond timing
              </div>

              <div className="startHint">
                TAP, CLICK, OR PRESS ENTER
              </div>
            </div>
          </div>

          <div className="rules">
            <div className="rule">
              <div className="ruleIcon">🔴</div>
              <div className="ruleText">
                <strong>RED</strong> = tap it
              </div>
            </div>

            <div className="rule">
              <div className="ruleIcon">🟡</div>
              <div className="ruleText">
                <strong>YELLOW</strong> = avoid
              </div>
            </div>

            <div className="rule">
              <div className="ruleIcon">🟢</div>
              <div className="ruleText">
                Green = inactive
              </div>
            </div>
          </div>

          <section className="seoIntro">
            <h2>Free Online Reaction Time Test</h2>

            <p>
              This reaction time test measures how quickly
              you respond to a visual target. It is designed
              for quick practice on phones, tablets and
              desktop devices. Your final score is calculated
              from 10 successful rounds, with results shown
              in milliseconds.
            </p>
          </section>

          <div className="footer">
            Free Reaction Time Test • No registration required
          </div>
        </div>
      </main>
    );
  }

  if (
    gameState === "playing" ||
    gameState === "failed"
  ) {
    return (
      <main className="gamePage">
        <style jsx>{`
          .gamePage {
            min-height: 100svh;
            background:
              radial-gradient(
                circle at top,
                #fff7fb 0%,
                #ffffff 35%
              );
            color: #111827;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
            padding: 12px 14px 22px;
          }

          .gameContainer {
            width: 100%;
            max-width: 1180px;
            margin: 0 auto;
          }

          .gameHeader {
            min-height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          }

          .brand {
            font-size: 14px;
            font-weight: 950;
            letter-spacing: -0.5px;
          }

          .brand span {
            color: #ec4899;
          }

          .roundInfo {
            color: #64748b;
            font-size: 9px;
            font-weight: 950;
            letter-spacing: 0.6px;
          }

          .status {
            text-align: center;
            min-height: 65px;
            padding-top: 10px;
          }

          .statusMain {
            font-size: clamp(18px, 4vw, 28px);
            line-height: 1;
            font-weight: 950;
            letter-spacing: -1px;
          }

          .statusSub {
            margin-top: 5px;
            color: #94a3b8;
            font-size: 9px;
            font-weight: 800;
          }

          .board {
            position: relative;
            width: 100%;
            height: min(68svh, 700px);
            min-height: 430px;
            margin: 4px auto 0;
            border-radius: 30px;
            border: 1px solid #f1dce8;
            background:
              radial-gradient(
                circle at center,
                #ffffff 0%,
                #fff8fb 100%
              );
            box-shadow:
              0 20px 70px
                rgba(236, 72, 153, 0.08);
            overflow: hidden;
            touch-action: manipulation;
            user-select: none;
            -webkit-user-select: none;
          }

          .grid {
            position: absolute;
            inset: 0;
            padding: 22px;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(4, 1fr);
            gap: 16px;
          }

          .dotSlot {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .dot {
            width: clamp(32px, 5vw, 52px);
            height: clamp(32px, 5vw, 52px);
            padding: 0;
            border: 0;
            border-radius: 50%;
            background:
              linear-gradient(
                145deg,
                #4ade80,
                #16a34a
              );
            box-shadow:
              0 7px 18px
                rgba(22, 163, 74, 0.18);
            cursor: pointer;
            transition:
              transform 0.08s ease,
              box-shadow 0.08s ease;
            -webkit-tap-highlight-color: transparent;
          }

          .dot:hover {
            transform: scale(1.08);
          }

          .dot:active {
            transform: scale(0.92);
          }

          .dot.red {
            background:
              radial-gradient(
                circle at 35% 30%,
                #ff7eaa,
                #ec4899 55%,
                #db2777
              );
            box-shadow:
              0 0 0 5px
                rgba(236, 72, 153, 0.1),
              0 10px 30px
                rgba(236, 72, 153, 0.32);
            animation:
              redPulse 0.8s ease-in-out
                infinite alternate;
          }

          .dot.yellow {
            background:
              radial-gradient(
                circle at 35% 30%,
                #fde68a,
                #facc15 55%,
                #eab308
              );
            box-shadow:
              0 0 0 5px
                rgba(234, 179, 8, 0.1),
              0 10px 30px
                rgba(234, 179, 8, 0.32);
            animation:
              yellowPulse 0.7s ease-in-out
                infinite alternate;
          }

          @keyframes redPulse {
            from {
              transform: scale(0.96);
            }

            to {
              transform: scale(1.08);
            }
          }

          @keyframes yellowPulse {
            from {
              transform: scale(0.96);
            }

            to {
              transform: scale(1.08);
            }
          }

          .failedOverlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(255, 255, 255, 0.87);
            backdrop-filter: blur(5px);
          }

          .failedCard {
            width: 100%;
            max-width: 380px;
            text-align: center;
            border: 1px solid #fbcfe8;
            background: #fff;
            border-radius: 22px;
            padding: 25px 18px;
            box-shadow:
              0 18px 55px
                rgba(236, 72, 153, 0.12);
          }

          .failedIcon {
            font-size: 38px;
          }

          .failedTitle {
            margin-top: 7px;
            color: #db2777;
            font-size: 24px;
            font-weight: 950;
            letter-spacing: -1px;
          }

          .failedText {
            margin-top: 5px;
            color: #64748b;
            font-size: 10px;
            line-height: 1.6;
          }

          .restartButton {
            margin-top: 15px;
            border: 0;
            border-radius: 999px;
            background: #111827;
            color: #fff;
            padding: 11px 20px;
            font-size: 10px;
            font-weight: 950;
            cursor: pointer;
          }

          .liveInfo {
            min-height: 44px;
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 18px;
            color: #64748b;
            font-size: 9px;
            font-weight: 850;
          }

          .liveInfo strong {
            color: #111827;
          }

          .legend {
            display: flex;
            justify-content: center;
            gap: 14px;
            margin-top: 2px;
            color: #94a3b8;
            font-size: 8px;
            font-weight: 800;
          }

          .legendItem {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .legendDot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
          }

          .green {
            background: #16a34a;
          }

          .redLegend {
            background: #ec4899;
          }

          .yellow {
            background: #facc15;
          }

          @media (max-width: 600px) {
            .gamePage {
              padding: 8px 9px 16px;
            }

            .gameHeader {
              min-height: 34px;
            }

            .brand {
              font-size: 12px;
            }

            .roundInfo {
              font-size: 8px;
            }

            .status {
              min-height: 57px;
            }

            .statusMain {
              font-size: 19px;
            }

            .statusSub {
              font-size: 8px;
            }

            .board {
              height: 67svh;
              min-height: 390px;
              border-radius: 23px;
            }

            .grid {
              padding: 14px;
              gap: 9px;
            }

            .dot {
              width: clamp(27px, 8vw, 39px);
              height: clamp(27px, 8vw, 39px);
            }

            .liveInfo {
              gap: 12px;
              font-size: 8px;
            }
          }
        `}</style>

        <div className="gameContainer">
          <header className="gameHeader">
            <div className="brand">
              thenexoratools
              <span>.</span>
            </div>

            <div className="roundInfo">
              ROUND {round}/{TOTAL_ROUNDS}
            </div>
          </header>

          <div className="status">
            <div className="statusMain">
              {gameState === "failed"
                ? "Challenge Failed"
                : message}
            </div>

            <div className="statusSub">
              {gameState === "failed"
                ? errorMessage
                : trapEnabled
                  ? "Red = target • Yellow = trap"
                  : "Find and tap the red target"}
            </div>
          </div>

          <section
            className="board"
            aria-label="Reaction time test board"
          >
            <div className="grid">
              {Array.from(
                { length: TOTAL_DOTS },
                (_, index) => {
                  const isActive =
                    activeTarget === index;

                  const className =
                    isActive ? targetType : "";

                  return (
                    <div
                      className="dotSlot"
                      key={index}
                    >
                      <button
                        type="button"
                        aria-label={
                          isActive
                            ? targetType === "red"
                              ? "Red target"
                              : "Yellow trap"
                            : "Inactive green circle"
                        }
                        className={`dot ${className}`}
                        onPointerDown={(event) =>
                          handleDotPress(
                            index,
                            event,
                          )
                        }
                      />
                    </div>
                  );
                },
              )}
            </div>

            {gameState === "failed" && (
              <div className="failedOverlay">
                <div className="failedCard">
                  <div className="failedIcon">
                    🟡
                  </div>

                  <div className="failedTitle">
                    Wrong Target
                  </div>

                  <div className="failedText">
                    You touched the yellow trap.
                    Your completed rounds are
                    still recorded for this attempt.
                  </div>

                  <button
                    type="button"
                    className="restartButton"
                    onClick={restart}
                  >
                    ↻ Try Again
                  </button>
                </div>
              </div>
            )}
          </section>

          <div className="liveInfo">
            <span>
              Completed:{" "}
              <strong>
                {results.length}/{TOTAL_ROUNDS}
              </strong>
            </span>

            {lastReaction !== null && (
              <span>
                Last:{" "}
                <strong>
                  {lastReaction} ms
                </strong>
              </span>
            )}

            <span>
              Best:{" "}
              <strong>
                {bestRound
                  ? `${bestRound} ms`
                  : "—"}
              </strong>
            </span>
          </div>

          <div className="legend">
            <div className="legendItem">
              <span className="legendDot green" />
              Green
            </div>

            <div className="legendItem">
              <span className="legendDot redLegend" />
              Red target
            </div>

            <div className="legendItem">
              <span className="legendDot yellow" />
              Yellow trap
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="resultPage">
      <style jsx>{`
        .resultPage {
          min-height: 100svh;
          background:
            radial-gradient(
              circle at top,
              #fff5fa 0%,
              #ffffff 38%
            );
          color: #111827;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          padding: 18px 12px 45px;
        }

        .resultWrap {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .resultHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 40px;
        }

        .logo {
          font-size: 14px;
          font-weight: 950;
          letter-spacing: -0.5px;
        }

        .logo span {
          color: #ec4899;
        }

        .completed {
          color: #db2777;
          background: #fdf2f8;
          border: 1px solid #fbcfe8;
          border-radius: 999px;
          padding: 6px 9px;
          font-size: 8px;
          font-weight: 950;
        }

        .resultHero {
          margin-top: 16px;
          border: 1px solid #f1dce8;
          border-radius: 24px;
          padding: 25px 16px;
          text-align: center;
          background:
            linear-gradient(
              145deg,
              #ffffff,
              #fff8fb
            );
          box-shadow:
            0 18px 60px
              rgba(236, 72, 153, 0.08);
        }

        .smallLabel {
          color: #94a3b8;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1px;
        }

        .score {
          margin-top: 5px;
          font-size: clamp(58px, 13vw, 88px);
          line-height: 0.9;
          font-weight: 950;
          letter-spacing: -4px;
          color: #ec4899;
        }

        .unit {
          margin-top: 3px;
          color: #64748b;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 1px;
        }

        .rating {
          margin-top: 12px;
          font-size: 20px;
          font-weight: 950;
          letter-spacing: -0.5px;
        }

        .ratingSub {
          margin-top: 4px;
          color: #64748b;
          font-size: 9px;
        }

        .buttons {
          display: flex;
          justify-content: center;
          gap: 7px;
          flex-wrap: wrap;
          margin-top: 15px;
        }

        .button {
          border: 0;
          border-radius: 999px;
          padding: 10px 17px;
          font-size: 9px;
          font-weight: 950;
          cursor: pointer;
        }

        .primary {
          background: #111827;
          color: #fff;
        }

        .secondary {
          background: #fdf2f8;
          color: #be185d;
          border: 1px solid #fbcfe8;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 7px;
          margin-top: 8px;
        }

        .card {
          border: 1px solid #f0e7ec;
          border-radius: 14px;
          background: #fff;
          padding: 12px 5px;
          text-align: center;
        }

        .cardValue {
          color: #111827;
          font-size: 17px;
          font-weight: 950;
          line-height: 1;
        }

        .cardValue.green {
          color: #16a34a;
        }

        .cardValue.pink {
          color: #ec4899;
        }

        .cardLabel {
          margin-top: 5px;
          color: #94a3b8;
          font-size: 7px;
          font-weight: 950;
          letter-spacing: 0.5px;
        }

        .panel {
          margin-top: 8px;
          border: 1px solid #f0e7ec;
          border-radius: 16px;
          background: #fff;
          padding: 15px;
        }

        .panelTitle {
          font-size: 12px;
          font-weight: 950;
        }

        .roundRow {
          display: grid;
          grid-template-columns: 50px 1fr 48px;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .roundName {
          color: #475569;
          font-size: 8px;
          font-weight: 900;
        }

        .barBg {
          height: 7px;
          border-radius: 999px;
          background: #f1f5f9;
          overflow: hidden;
        }

        .bar {
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #f472b6,
              #ec4899
            );
        }

        .roundTime {
          text-align: right;
          font-size: 8px;
          font-weight: 950;
          color: #111827;
        }

        .analysis {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
          margin-top: 12px;
        }

        .analysisCard {
          background: #fff8fb;
          border: 1px solid #f5e4ed;
          border-radius: 12px;
          padding: 10px 5px;
          text-align: center;
        }

        .analysisValue {
          font-size: 14px;
          font-weight: 950;
        }

        .analysisLabel {
          margin-top: 3px;
          color: #94a3b8;
          font-size: 7px;
          font-weight: 950;
        }

        .pb {
          margin-top: 8px;
          border: 1px solid #fbcfe8;
          background: #fdf2f8;
          color: #be185d;
          border-radius: 13px;
          padding: 10px;
          text-align: center;
          font-size: 8px;
          font-weight: 900;
        }

        .info {
          margin-top: 8px;
          border: 1px solid #f0e7ec;
          border-radius: 16px;
          padding: 15px;
          background: #fff;
        }

        .info h2 {
          margin: 0 0 6px;
          font-size: 15px;
          font-weight: 950;
        }

        .info h3 {
          margin: 15px 0 5px;
          font-size: 11px;
          font-weight: 950;
        }

        .info p,
        .info li {
          color: #64748b;
          font-size: 9px;
          line-height: 1.75;
        }

        .info p {
          margin: 0;
        }

        .info ul {
          margin: 5px 0 0;
          padding-left: 16px;
        }

        .faqItem {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
        }

        .faqItem:first-of-type {
          margin-top: 5px;
        }

        .faqQuestion {
          font-size: 9px;
          font-weight: 950;
          color: #111827;
        }

        .faqAnswer {
          margin-top: 3px;
          color: #64748b;
          font-size: 9px;
          line-height: 1.7;
        }

        .related {
          margin-top: 8px;
          border: 1px solid #f0e7ec;
          border-radius: 16px;
          padding: 15px;
          background: #fff;
        }

        .relatedTitle {
          font-size: 12px;
          font-weight: 950;
        }

        .relatedGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
          margin-top: 9px;
        }

        .relatedLink {
          display: block;
          text-decoration: none;
          color: #475569;
          background: #fff8fb;
          border: 1px solid #f5e4ed;
          border-radius: 11px;
          padding: 9px 7px;
          font-size: 8px;
          font-weight: 850;
          text-align: center;
        }

        .relatedLink:hover {
          border-color: #f9a8d4;
          color: #be185d;
        }

        .footer {
          margin-top: 20px;
          text-align: center;
          color: #94a3b8;
          font-size: 7px;
        }

        @media (max-width: 600px) {
          .resultPage {
            padding: 12px 9px 35px;
          }

          .cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .relatedGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .resultHero {
            padding: 22px 13px;
          }

          .roundRow {
            grid-template-columns: 45px 1fr 45px;
          }
        }
      `}</style>

      <div className="resultWrap">
        <header className="resultHeader">
          <div className="logo">
            thenexoratools
            <span>.</span>
          </div>

          <div className="completed">
            ✓ COMPLETED
          </div>
        </header>

        <section className="resultHero">
          <div className="smallLabel">
            AVERAGE REACTION TIME
          </div>

          <div className="score">
            {average}
          </div>

          <div className="unit">
            MILLISECONDS
          </div>

          {rating && (
            <>
              <div className="rating">
                {rating.icon} {rating.title}
              </div>

              <div className="ratingSub">
                Based on your successful 10-round
                challenge
              </div>
            </>
          )}

          <div className="buttons">
            <button
              type="button"
              className="button primary"
              onClick={restart}
            >
              ↻ Try Again
            </button>

            <button
              type="button"
              className="button secondary"
              onClick={shareResult}
            >
              ↗ Share Result
            </button>
          </div>
        </section>

        <section className="cards">
          <div className="card">
            <div className="cardValue pink">
              {average} ms
            </div>

            <div className="cardLabel">
              AVERAGE
            </div>
          </div>

          <div className="card">
            <div className="cardValue">
              {bestRound} ms
            </div>

            <div className="cardLabel">
              BEST
            </div>
          </div>

          <div className="card">
            <div className="cardValue">
              {slowestRound} ms
            </div>

            <div className="cardLabel">
              SLOWEST
            </div>
          </div>

          <div className="card">
            <div className="cardValue">
              {bestScore ?? average} ms
            </div>

            <div className="cardLabel">
              PERSONAL BEST
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panelTitle">
            Round-by-Round Results
          </div>

          {results.map((item) => {
            const maxTime = Math.max(
              slowestRound,
              1,
            );

            const width = Math.max(
              8,
              Math.min(
                100,
                (item.time / maxTime) * 100,
              ),
            );

            return (
              <div
                className="roundRow"
                key={item.round}
              >
                <div className="roundName">
                  Round {item.round}
                </div>

                <div className="barBg">
                  <div
                    className="bar"
                    style={{
                      width: `${width}%`,
                    }}
                  />
                </div>

                <div className="roundTime">
                  {item.time} ms
                </div>
              </div>
            );
          })}

          <div className="analysis">
            <div className="analysisCard">
              <div className="analysisValue">
                {consistency.toFixed(0)}%
              </div>

              <div className="analysisLabel">
                CONSISTENCY
              </div>
            </div>

            <div className="analysisCard">
              <div className="analysisValue">
                {results.length}/10
              </div>

              <div className="analysisLabel">
                ROUNDS
              </div>
            </div>

            <div className="analysisCard">
              <div className="analysisValue">
                {bestRound} ms
              </div>

              <div className="analysisLabel">
                FASTEST
              </div>
            </div>
          </div>
        </section>

        <div className="pb">
          🏆 Your personal best is saved automatically
          on this device.
        </div>

        <section className="info">
          <h2>Reaction Time Test</h2>

          <p>
            This free reaction time test measures how
            quickly you respond to a visual target.
            The challenge uses 10 successful rounds
            and records each reaction in milliseconds.
            It works directly in your browser without
            requiring registration or software installation.
          </p>

          <h3>How to Use the Reaction Time Test</h3>

          <ul>
            <li>
              Start the challenge when you are ready.
            </li>

            <li>
              Wait for the red target to appear.
            </li>

            <li>
              Tap or click the red target as quickly
              as possible.
            </li>

            <li>
              Do not tap inactive green circles.
            </li>

            <li>
              Avoid yellow traps because touching one
              ends the current challenge.
            </li>

            <li>
              Complete 10 successful rounds to receive
              your final average reaction time.
            </li>
          </ul>

          <h3>What Is a Good Reaction Time?</h3>

          <p>
            Reaction time differs from person to person
            and can also be affected by the device,
            display latency, browser performance and
            input method. A lower result in milliseconds
            means a faster response. For fair comparisons,
            use the same device and input method when
            repeating the test.
          </p>

          <h3>How Can I Improve My Reaction Speed?</h3>

          <p>
            Stay focused on the center of the test area,
            keep your hand relaxed and react to the target
            instead of predicting where it will appear.
            Repeated practice can help you understand your
            reaction speed and consistency.
          </p>

          <h3>Is This Reaction Test Free?</h3>

          <p>
            Yes. The reaction time test is available
            without registration or a paid subscription.
            Your personal-best score is stored locally on
            the device when browser storage is available.
          </p>

          <h3>Does It Work on Mobile?</h3>

          <p>
            Yes. The test is designed for touchscreens
            as well as mouse and keyboard input on desktop
            devices. For the most consistent measurements,
            avoid switching devices between attempts.
          </p>
        </section>

        <section className="related">
          <div className="relatedTitle">
            Explore More Free Tools
          </div>

          <div className="relatedGrid">
            <a
              className="relatedLink"
              href="/cps-test"
            >
              CPS Test
            </a>

            <a
              className="relatedLink"
              href="/age-calculator"
            >
              Age Calculator
            </a>

            <a
              className="relatedLink"
              href="/percentage-calculator"
            >
              Percentage Calculator
            </a>

            <a
              className="relatedLink"
              href="/love-calculator"
            >
              Love Calculator
            </a>

            <a
              className="relatedLink"
              href="/tip-calculator"
            >
              Tip Calculator
            </a>

            <a
              className="relatedLink"
              href="/salary-calculator"
            >
              Salary Calculator
            </a>
          </div>
        </section>

        <footer className="footer">
          Free Reaction Time Test • Fast • Simple •
          Mobile Friendly
        </footer>
      </div>
    </main>
  );
}
