"use client";

import {
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type GameState =
  | "idle"
  | "waiting"
  | "ready"
  | "result";

type Round = {
  number: number;
  time: number;
};

const TOTAL_ROUNDS = 5;
const PB_KEY = "nexora_reaction_best_v2";

export default function ReactionClient() {
  const [state, setState] =
    useState<GameState>("idle");

  const [round, setRound] = useState(0);

  const [results, setResults] =
    useState<Round[]>([]);

  const [lastTime, setLastTime] =
    useState<number | null>(null);

  const [falseStarts, setFalseStarts] =
    useState(0);

  const [personalBest, setPersonalBest] =
    useState<number | null>(null);

  const [device, setDevice] =
    useState("Touch");

  const [message, setMessage] =
    useState("Tap to start");

  const [countdown, setCountdown] =
    useState("");

  const timerRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const startTimeRef =
    useRef<number | null>(null);

  const currentRoundRef =
    useRef(0);

  const stateRef =
    useRef<GameState>("idle");

  const resultsRef =
    useRef<Round[]>([]);

  const falseStartsRef =
    useRef(0);

  /* --------------------------------
     LOAD PERSONAL BEST
  -------------------------------- */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          PB_KEY,
        );

      if (saved) {
        const value =
          Number(saved);

        if (
          Number.isFinite(value) &&
          value > 0
        ) {
          setPersonalBest(value);
        }
      }
    } catch {}

    if (
      typeof window !==
      "undefined"
    ) {
      const touch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints >
          0;

      setDevice(
        touch
          ? "Touch"
          : "Mouse",
      );
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(
          timerRef.current,
        );
      }
    };
  }, []);

  /* --------------------------------
     KEEP REFS IN SYNC
  -------------------------------- */

  useEffect(() => {
    stateRef.current =
      state;
  }, [state]);

  /* --------------------------------
     RANDOM WAIT
  -------------------------------- */

  const randomDelay =
    () => {
      return (
        1600 +
        Math.random() * 3000
      );
    };

  /* --------------------------------
     START ROUND
  -------------------------------- */

  const beginRound =
    useCallback(
      (roundNumber: number) => {
        if (
          timerRef.current
        ) {
          clearTimeout(
            timerRef.current,
          );
        }

        currentRoundRef.current =
          roundNumber;

        setRound(
          roundNumber,
        );

        setLastTime(null);
        setMessage(
          "Wait for green",
        );
        setCountdown("");
        setState("waiting");

        stateRef.current =
          "waiting";

        const delay =
          randomDelay();

        timerRef.current =
          setTimeout(() => {
            if (
              stateRef.current !==
              "waiting"
            ) {
              return;
            }

            startTimeRef.current =
              performance.now();

            setState("ready");

            stateRef.current =
              "ready";

            setMessage(
              "CLICK NOW",
            );
          }, delay);
      },
      [],
    );

  /* --------------------------------
     START GAME
  -------------------------------- */

  const startGame =
    useCallback(() => {
      if (
        stateRef.current ===
        "waiting"
      ) {
        return;
      }

      if (
        stateRef.current ===
        "ready"
      ) {
        return;
      }

      resultsRef.current =
        [];

      falseStartsRef.current =
        0;

      currentRoundRef.current =
        1;

      setResults([]);
      setFalseStarts(0);
      setRound(1);
      setLastTime(null);
      setState("waiting");

      stateRef.current =
        "waiting";

      beginRound(1);
    }, [beginRound]);

  /* --------------------------------
     FALSE START
  -------------------------------- */

  const falseStart =
    useCallback(() => {
      falseStartsRef.current +=
        1;

      setFalseStarts(
        falseStartsRef.current,
      );

      if (
        timerRef.current
      ) {
        clearTimeout(
          timerRef.current,
        );
      }

      setMessage(
        "Too early!",
      );

      setCountdown(
        "Wait for green",
      );

      timerRef.current =
        setTimeout(() => {
          beginRound(
            currentRoundRef.current,
          );
        }, 700);
    }, [beginRound]);

  /* --------------------------------
     HANDLE REACTION
  -------------------------------- */

  const handleGameAction =
    (
      e?: ReactPointerEvent<HTMLDivElement>,
    ) => {
      if (
        e?.pointerType ===
        "mouse" &&
        e.button !== 0
      ) {
        return;
      }

      const current =
        stateRef.current;

      /* IDLE */

      if (
        current ===
        "idle"
      ) {
        startGame();
        return;
      }

      /* WAITING */

      if (
        current ===
        "waiting"
      ) {
        falseStart();
        return;
      }

      /* READY */

      if (
        current ===
        "ready"
      ) {
        const start =
          startTimeRef.current;

        if (
          start === null
        ) {
          return;
        }

        const reaction =
          performance.now() -
          start;

        const clean =
          Math.max(
            1,
            Math.round(
              reaction,
            ),
          );

        const newRound: Round = {
          number:
            currentRoundRef.current,
          time: clean,
        };

        const updated = [
          ...resultsRef.current,
          newRound,
        ];

        resultsRef.current =
          updated;

        setResults(
          updated,
        );

        setLastTime(clean);

        if (
          currentRoundRef.current <
          TOTAL_ROUNDS
        ) {
          const nextRound =
            currentRoundRef.current +
            1;

          currentRoundRef.current =
            nextRound;

          setRound(
            nextRound,
          );

          setState(
            "waiting",
          );

          stateRef.current =
            "waiting";

          setMessage(
            "Next round...",
          );

          timerRef.current =
            setTimeout(() => {
              beginRound(
                nextRound,
              );
            }, 650);
        } else {
          finishGame(
            updated,
          );
        }
      }
    };

  /* --------------------------------
     FINISH
  -------------------------------- */

  const finishGame =
    (finalResults: Round[]) => {
      if (
        finalResults.length !==
        TOTAL_ROUNDS
      ) {
        return;
      }

      const times =
        finalResults.map(
          (r) => r.time,
        );

      const average =
        times.reduce(
          (a, b) =>
            a + b,
          0,
        ) /
        times.length;

      const roundedAverage =
        Math.round(
          average,
        );

      try {
        const old =
          Number(
            localStorage.getItem(
              PB_KEY,
            ),
          );

        if (
          !old ||
          roundedAverage <
            old
        ) {
          localStorage.setItem(
            PB_KEY,
            String(
              roundedAverage,
            ),
          );

          setPersonalBest(
            roundedAverage,
          );
        }
      } catch {}

      setState(
        "result",
      );

      stateRef.current =
        "result";

      setMessage(
        "Complete",
      );
    };

  /* --------------------------------
     KEYBOARD
  -------------------------------- */

  useEffect(() => {
    const onKeyDown =
      (event: KeyboardEvent) => {
        if (
          event.code !==
            "Space" &&
          event.code !==
            "Enter"
        ) {
          return;
        }

        event.preventDefault();

        handleGameAction();
      };

    window.addEventListener(
      "keydown",
      onKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        onKeyDown,
      );
    };
  });

  /* --------------------------------
     CALCULATIONS
  -------------------------------- */

  const times =
    results.map(
      (r) => r.time,
    );

  const average =
    times.length
      ? Math.round(
          times.reduce(
            (a, b) =>
              a + b,
            0,
          ) /
            times.length,
        )
      : 0;

  const bestRound =
    times.length
      ? Math.min(
          ...times,
        )
      : 0;

  const worstRound =
    times.length
      ? Math.max(
          ...times,
        )
      : 0;

  const sorted =
    [...times].sort(
      (a, b) =>
        a - b,
    );

  const median =
    sorted.length
      ? sorted[
          Math.floor(
            sorted.length /
              2,
          )
        ]
      : 0;

  let consistency = 100;

  if (
    times.length >= 2
  ) {
    const variance =
      times.reduce(
        (sum, value) =>
          sum +
          Math.pow(
            value -
              average,
            2,
          ),
        0,
      ) /
      times.length;

    const deviation =
      Math.sqrt(
        variance,
      );

    consistency =
      Math.max(
        0,
        Math.min(
          100,
          100 -
            (deviation /
              Math.max(
                average,
                1,
              )) *
              100,
        ),
      );
  }

  const getRating =
    (ms: number) => {
      if (
        ms < 150
      ) {
        return {
          title:
            "Exceptional",
          icon: "⚡",
        };
      }

      if (
        ms < 200
      ) {
        return {
          title:
            "Excellent",
          icon: "🔥",
        };
      }

      if (
        ms < 250
      ) {
        return {
          title:
            "Very Fast",
          icon: "🚀",
        };
      }

      if (
        ms < 300
      ) {
        return {
          title:
            "Fast",
          icon: "👍",
        };
      }

      if (
        ms < 400
      ) {
        return {
          title:
            "Average",
          icon: "🎯",
        };
      }

      return {
        title:
          "Keep Practicing",
        icon: "💪",
      };
    };

  const rating =
    average
      ? getRating(
          average,
        )
      : null;

  /* --------------------------------
     SHARE
  -------------------------------- */

  const shareResult =
    async () => {
      if (!average) {
        return;
      }

      const text =
        `My reaction time is ${average}ms on the NEXORA Reaction Time Test. Can you beat me?`;

      try {
        if (
          navigator.share
        ) {
          await navigator.share(
            {
              title:
                "NEXORA Reaction Time Test",
              text,
              url:
                window.location.href,
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

  /* --------------------------------
     PLAY SCREEN
  -------------------------------- */

  if (
    state !== "result"
  ) {
    return (
      <main className="gamePage">
        <style jsx>{`
          .gamePage {
            min-height: 100svh;
            background:
              #070b12;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            padding:
              18px;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
            overflow: hidden;
          }

          .gameWrap {
            width: 100%;
            max-width: 900px;
            min-height:
              calc(
                100svh - 36px
              );
            display: flex;
            flex-direction: column;
            justify-content:
              center;
            align-items: center;
          }

          .brand {
            position: absolute;
            top: 17px;
            left: 18px;
            font-size: 14px;
            font-weight: 950;
            letter-spacing: -.3px;
          }

          .brand span {
            color:
              #22c55e;
          }

          .round {
            position: absolute;
            top: 17px;
            right: 18px;
            color:
              #64748b;
            font-size: 11px;
            font-weight: 900;
          }

          .intro {
            text-align: center;
            margin-bottom: 22px;
          }

          .intro h1 {
            margin: 0;
            font-size:
              clamp(
                28px,
                7vw,
                48px
              );
            line-height: 1;
            letter-spacing:
              -1.8px;
          }

          .intro h1 span {
            color:
              #22c55e;
          }

          .intro p {
            margin:
              9px auto 0;
            max-width: 520px;
            color:
              #64748b;
            font-size: 12px;
            line-height: 1.5;
          }

          .signal {
            width: 100%;
            max-width: 820px;
            height:
              min(
                62vh,
                520px
              );
            min-height: 330px;
            border-radius: 28px;
            border: 2px solid
              #202c3c;
            background:
              #111827;
            display: flex;
            flex-direction: column;
            justify-content:
              center;
            align-items: center;
            text-align: center;
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
            -webkit-tap-highlight-color: transparent;
            touch-action:
              manipulation;
            transition:
              background .12s,
              border-color .12s,
              transform .08s;
          }

          .signal:active {
            transform:
              scale(.997);
          }

          .signal.waiting {
            background:
              #121a28;
            border-color:
              #26364c;
          }

          .signal.ready {
            background:
              #22c55e;
            border-color:
              #4ade80;
            color:
              #031108;
          }

          .signal.idle {
            background:
              linear-gradient(
                145deg,
                #111827,
                #0d1421
              );
          }

          .icon {
            font-size: 48px;
            line-height: 1;
            margin-bottom: 14px;
          }

          .signal h2 {
            margin: 0;
            font-size:
              clamp(
                27px,
                7vw,
                52px
              );
            font-weight: 950;
            letter-spacing:
              -1.5px;
          }

          .signal p {
            margin:
              9px 0 0;
            font-size: 12px;
            color:
              rgba(
                255,
                255,
                255,
                .58
              );
            font-weight: 700;
          }

          .ready p {
            color:
              rgba(
                3,
                17,
                8,
                .62
              );
          }

          .helper {
            margin-top: 15px;
            color:
              #475569;
            font-size: 10px;
            font-weight: 800;
          }

          .falseStart {
            position: absolute;
            bottom: 18px;
            left: 50%;
            transform:
              translateX(-50%);
            color:
              #f87171;
            font-size: 10px;
            font-weight: 900;
          }

          @media (
            max-width: 600px
          ) {
            .gamePage {
              padding: 12px;
            }

            .gameWrap {
              min-height:
                calc(
                  100svh - 24px
                );
            }

            .intro {
              margin-bottom: 13px;
            }

            .intro h1 {
              font-size: 27px;
            }

            .intro p {
              font-size: 10px;
              max-width: 350px;
            }

            .signal {
              min-height: 390px;
              height:
                63svh;
              border-radius: 24px;
            }

            .icon {
              font-size: 39px;
            }

            .signal h2 {
              font-size: 31px;
            }

            .signal p {
              font-size: 10px;
            }
          }
        `}</style>

        <div className="gameWrap">

          <div className="brand">
            NEXORA{" "}
            <span>TOOLS</span>
          </div>

          <div className="round">
            {round > 0
              ? `ROUND ${round}/${TOTAL_ROUNDS}`
              : "REACTION TEST"}
          </div>

          {state ===
            "idle" && (
            <div className="intro">
              <h1>
                Reaction Time{" "}
                <span>
                  Test
                </span>
              </h1>

              <p>
                Wait for green.
                Then react as
                fast as you can.
              </p>
            </div>
          )}

          <div
            className={`signal ${
              state
            }`}
            onPointerDown={
              handleGameAction
            }
          >
            {state ===
              "idle" && (
              <>
                <div className="icon">
                  ⚡
                </div>

                <h2>
                  Tap to Start
                </h2>

                <p>
                  5 rounds
                  •
                  Accurate
                  timing
                </p>
              </>
            )}

            {state ===
              "waiting" && (
              <>
                <div className="icon">
                  🔴
                </div>

                <h2>
                  Wait...
                </h2>

                <p>
                  Do not click
                  yet
                </p>
              </>
            )}

            {state ===
              "ready" && (
              <>
                <div className="icon">
                  🟢
                </div>

                <h2>
                  CLICK!
                </h2>

                <p>
                  React now
                </p>
              </>
            )}

            <div className="helper">
              {state ===
                "idle"
                ? "Tap • Click • Space"
                : state ===
                    "waiting"
                  ? "Too early = false start"
                  : "Tap anywhere"}
            </div>

            {falseStarts >
              0 && (
              <div className="falseStart">
                False starts:{" "}
                {falseStarts}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  /* --------------------------------
     RESULT SCREEN
  -------------------------------- */

  return (
    <main className="resultPage">
      <style jsx>{`
        .resultPage {
          min-height: 100svh;
          background:
            radial-gradient(
              circle at top,
              rgba(
                34,
                197,
                94,
                .07
              ),
              transparent 32%
            ),
            #070b12;
          color: white;
          padding:
            22px 12px 42px;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .wrap {
          width: 100%;
          max-width: 820px;
          margin: auto;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
          gap: 10px;
          margin-bottom:
            17px;
        }

        .logo {
          font-size: 15px;
          font-weight: 950;
        }

        .logo span {
          color:
            #22c55e;
        }

        .device {
          color:
            #64748b;
          font-size: 10px;
          font-weight: 900;
        }

        .hero {
          background:
            linear-gradient(
              145deg,
              #101a29,
              #0d1421
            );
          border: 1px solid
            #223047;
          border-radius: 20px;
          padding:
            23px 16px;
          text-align: center;
        }

        .complete {
          color:
            #64748b;
          font-size: 9px;
          font-weight: 950;
          letter-spacing:
            1px;
        }

        .score {
          margin-top: 7px;
          color:
            #22c55e;
          font-size:
            clamp(
              55px,
              14vw,
              82px
            );
          line-height: .9;
          font-weight: 950;
          letter-spacing:
            -3px;
        }

        .ms {
          color:
            #64748b;
          font-size: 11px;
          font-weight: 900;
          margin-top: 4px;
        }

        .rating {
          margin-top: 12px;
          font-size: 19px;
          font-weight: 950;
        }

        .ratingSub {
          color:
            #64748b;
          font-size: 10px;
          margin-top: 4px;
        }

        .actions {
          display: flex;
          justify-content:
            center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 15px;
        }

        button {
          border: 0;
          cursor: pointer;
          border-radius: 999px;
          padding:
            11px 19px;
          font-size: 11px;
          font-weight: 950;
        }

        .green {
          background:
            #22c55e;
          color:
            #031108;
        }

        .dark {
          background:
            #1e293b;
          color: white;
          border: 1px solid
            #334155;
        }

        .stats {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 8px;
          margin-top: 9px;
        }

        .stat {
          background:
            #111827;
          border: 1px solid
            #202c3e;
          border-radius: 14px;
          padding:
            12px 5px;
          text-align: center;
        }

        .stat strong {
          display: block;
          color:
            #22c55e;
          font-size: 20px;
          line-height: 1;
          font-weight: 950;
        }

        .stat span {
          display: block;
          color:
            #64748b;
          font-size: 8px;
          font-weight: 950;
          margin-top: 6px;
        }

        .panel {
          margin-top: 9px;
          background:
            #111827;
          border: 1px solid
            #202c3e;
          border-radius: 16px;
          padding: 15px;
        }

        .title {
          font-size: 13px;
          font-weight: 950;
        }

        .roundRow {
          display: grid;
          grid-template-columns:
            54px 1fr 48px;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .roundName {
          font-size: 10px;
          font-weight: 900;
        }

        .barBg {
          height: 8px;
          background:
            #080e18;
          border-radius: 999px;
          overflow: hidden;
        }

        .bar {
          height: 100%;
          border-radius: inherit;
          background:
            #22c55e;
        }

        .roundTime {
          text-align: right;
          font-size: 10px;
          font-weight: 950;
        }

        .analysis {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 7px;
          margin-top: 12px;
        }

        .analysisItem {
          background:
            #0b1220;
          border: 1px solid
            #1e2a3d;
          border-radius: 11px;
          padding: 10px 5px;
          text-align: center;
        }

        .analysisItem strong {
          display: block;
          color:
            #e2e8f0;
          font-size: 14px;
        }

        .analysisItem span {
          display: block;
          color:
            #64748b;
          font-size: 8px;
          font-weight: 900;
          margin-top: 3px;
        }

        .pb {
          margin-top: 9px;
          padding:
            11px;
          border-radius: 12px;
          background:
            rgba(
              34,
              197,
              94,
              .07
            );
          border: 1px solid
            rgba(
              34,
              197,
              94,
              .18
            );
          text-align: center;
          color:
            #86efac;
          font-size: 10px;
          font-weight: 900;
        }

        .info {
          margin-top: 9px;
          background:
            #111827;
          border: 1px solid
            #202c3e;
          border-radius: 16px;
          padding: 16px;
        }

        .info h2 {
          margin:
            0 0 7px;
          font-size: 16px;
        }

        .info h3 {
          margin:
            15px 0 5px;
          font-size: 12px;
        }

        .info p {
          margin: 0;
          color:
            #64748b;
          font-size: 10px;
          line-height: 1.65;
        }

        .info ul {
          margin:
            5px 0 0;
          padding-left:
            17px;
        }

        .info li {
          color:
            #64748b;
          font-size: 10px;
          line-height: 1.7;
        }

        .footer {
          text-align: center;
          margin-top: 17px;
          color:
            #334155;
          font-size: 8px;
        }

        @media (
          max-width: 600px
        ) {
          .resultPage {
            padding:
              16px 10px 35px;
          }

          .stats {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .analysis {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .hero {
            padding:
              20px 13px;
          }

          .roundRow {
            grid-template-columns:
              48px 1fr 43px;
          }
        }
      `}</style>

      <div className="wrap">

        <header className="header">
          <div className="logo">
            NEXORA{" "}
            <span>TOOLS</span>
          </div>

          <div className="device">
            📱 {device}
          </div>
        </header>

        {/* MAIN RESULT */}

        <section className="hero">

          <div className="complete">
            TEST COMPLETE
          </div>

          <div className="score">
            {average}
          </div>

          <div className="ms">
            MILLISECONDS
          </div>

          {rating && (
            <>
              <div className="rating">
                {rating.icon}{" "}
                {rating.title}
              </div>

              <div className="ratingSub">
                Average reaction
                time across 5
                rounds
              </div>
            </>
          )}

          <div className="actions">
            <button
              className="green"
              onClick={() =>
                window.location.reload()
              }
            >
              ↻ Try Again
            </button>

            <button
              className="dark"
              onClick={
                shareResult
              }
            >
              📤 Share Result
            </button>
          </div>
        </section>

        {/* STATS */}

        <section className="stats">

          <div className="stat">
            <strong>
              {average}ms
            </strong>

            <span>
              AVERAGE
            </span>
          </div>

          <div className="stat">
            <strong>
              {bestRound}ms
            </strong>

            <span>
              BEST ROUND
            </span>
          </div>

          <div className="stat">
            <strong>
              {median}ms
            </strong>

            <span>
              MEDIAN
            </span>
          </div>

          <div className="stat">
            <strong>
              {personalBest ??
                average}ms
            </strong>

            <span>
              ALL-TIME BEST
            </span>
          </div>

        </section>

        {/* ROUND RESULTS */}

        <section className="panel">

          <div className="title">
            📊 Round Results
          </div>

          {results.map(
            (item) => {
              const width =
                Math.min(
                  100,
                  Math.max(
                    10,
                    (item.time /
                      Math.max(
                        worstRound,
                        1,
                      )) *
                      100,
                  ),
                );

              let barColor =
                "#22c55e";

              if (
                item.time >=
                400
              ) {
                barColor =
                  "#ef4444";
              } else if (
                item.time >=
                300
              ) {
                barColor =
                  "#f59e0b";
              }

              return (
                <div
                  className="roundRow"
                  key={
                    item.number
                  }
                >
                  <div className="roundName">
                    Round{" "}
                    {
                      item.number
                    }
                  </div>

                  <div className="barBg">
                    <div
                      className="bar"
                      style={{
                        width:
                          `${width}%`,
                        background:
                          barColor,
                      }}
                    />
                  </div>

                  <div className="roundTime">
                    {
                      item.time
                    }ms
                  </div>
                </div>
              );
            },
          )}

          <div className="analysis">

            <div className="analysisItem">
              <strong>
                {consistency.toFixed(
                  0,
                )}%
              </strong>

              <span>
                CONSISTENCY
              </span>
            </div>

            <div className="analysisItem">
              <strong>
                {worstRound}ms
              </strong>

              <span>
                SLOWEST
              </span>
            </div>

            <div className="analysisItem">
              <strong>
                {falseStarts}
              </strong>

              <span>
                FALSE STARTS
              </span>
            </div>

          </div>

        </section>

        {/* PB */}

        <div className="pb">
          🏆 Personal best is saved
          automatically on this device.
        </div>

        {/* INFORMATION */}

        <section className="info">

          <h2>
            Reaction Time Test
          </h2>

          <p>
            This test measures how quickly
            you respond after the screen
            changes to green. Complete five
            rounds for a more useful average.
          </p>

          <h3>
            What is a good reaction time?
          </h3>

          <p>
            Reaction speed varies by person,
            device and input method. Lower
            milliseconds mean a faster
            reaction. Results around 200–300ms
            are common for many casual users,
            while substantially lower scores
            are very fast.
          </p>

          <h3>
            How to get a better score
          </h3>

          <ul>
            <li>
              Keep your hand relaxed.
            </li>

            <li>
              Focus on the center of the
              screen.
            </li>

            <li>
              Use a responsive mouse or
              touchscreen.
            </li>

            <li>
              Avoid clicking before green.
            </li>

            <li>
              Take several tests and compare
              your consistency.
            </li>
          </ul>

        </section>

        <footer className="footer">
          ©{" "}
          {new Date().getFullYear()}{" "}
          NEXORA Tools • Free
          Reaction Time Test
        </footer>

      </div>
    </main>
  );
}
