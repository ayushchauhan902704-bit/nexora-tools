"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type TestState =
  | "idle"
  | "waiting"
  | "ready"
  | "result"
  | "finished";

const TOTAL_ROUNDS = 5;
const MIN_DELAY = 1800;
const MAX_DELAY = 4500;

export default function ReactionClient() {
  const [state, setState] = useState<TestState>("idle");
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [currentResult, setCurrentResult] = useState<number | null>(null);
  const [message, setMessage] = useState("Test your reaction speed.");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  /* -----------------------------
     Cleanup
  ----------------------------- */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /* -----------------------------
     Random delay
  ----------------------------- */

  const getRandomDelay = () => {
    return Math.floor(
      Math.random() * (MAX_DELAY - MIN_DELAY + 1) + MIN_DELAY
    );
  };

  /* -----------------------------
     Start waiting phase
  ----------------------------- */

  const beginWaiting = useCallback(() => {
    clearTimer();

    startTimeRef.current = null;
    setCurrentResult(null);
    setState("waiting");
    setMessage("Wait for green...");

    const delay = getRandomDelay();

    timerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      startTimeRef.current = performance.now();

      setState("ready");
      setMessage("CLICK NOW!");
    }, delay);
  }, [clearTimer]);

  /* -----------------------------
     Start complete test
  ----------------------------- */

  const startTest = useCallback(() => {
    clearTimer();

    setRound(1);
    setResults([]);
    setCurrentResult(null);
    startTimeRef.current = null;

    setState("waiting");
    setMessage("Wait for green...");

    const delay = getRandomDelay();

    timerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      startTimeRef.current = performance.now();

      setState("ready");
      setMessage("CLICK NOW!");
    }, delay);
  }, [clearTimer]);

  /* -----------------------------
     Handle test area click
  ----------------------------- */

  const handleTestClick = useCallback(() => {
    /*
      IDLE
      Start the test.
    */
    if (state === "idle") {
      startTest();
      return;
    }

    /*
      WAITING
      User clicked too early.
    */
    if (state === "waiting") {
      clearTimer();

      setCurrentResult(-1);
      setState("result");
      setMessage("Too soon! Wait for green.");

      return;
    }

    /*
      READY
      Calculate reaction time.
    */
    if (
      state === "ready" &&
      startTimeRef.current !== null
    ) {
      const reactionTime = Math.round(
        performance.now() - startTimeRef.current
      );

      startTimeRef.current = null;

      const updatedResults = [
        ...results,
        reactionTime,
      ];

      setResults(updatedResults);
      setCurrentResult(reactionTime);
      setState("result");

      if (updatedResults.length === TOTAL_ROUNDS) {
        setMessage("Test complete!");
      } else {
        setMessage("Nice! Get ready for the next round.");
      }

      return;
    }
  }, [
    state,
    results,
    startTest,
    clearTimer,
  ]);

  /* -----------------------------
     Next round
  ----------------------------- */

  const handleNextRound = useCallback(() => {
    if (results.length >= TOTAL_ROUNDS) {
      setState("finished");
      return;
    }

    setRound(results.length + 1);

    beginWaiting();
  }, [results.length, beginWaiting]);

  /* -----------------------------
     Restart
  ----------------------------- */

  const restartTest = useCallback(() => {
    clearTimer();

    startTimeRef.current = null;

    setState("idle");
    setRound(0);
    setResults([]);
    setCurrentResult(null);
    setMessage("Test your reaction speed.");
  }, [clearTimer]);

  /* -----------------------------
     Keyboard support
  ----------------------------- */

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (
        event.code !== "Space" &&
        event.code !== "Enter"
      ) {
        return;
      }

      event.preventDefault();

      if (
        state === "result" &&
        currentResult !== -1 &&
        results.length < TOTAL_ROUNDS
      ) {
        handleNextRound();
        return;
      }

      handleTestClick();
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [
    state,
    currentResult,
    results.length,
    handleNextRound,
    handleTestClick,
  ]);

  /* -----------------------------
     Statistics
  ----------------------------- */

  const validResults = results.filter(
    (time) => time >= 0
  );

  const average =
    validResults.length > 0
      ? Math.round(
          validResults.reduce(
            (sum, time) => sum + time,
            0
          ) / validResults.length
        )
      : null;

  const best =
    validResults.length > 0
      ? Math.min(...validResults)
      : null;

  const worst =
    validResults.length > 0
      ? Math.max(...validResults)
      : null;

  /* -----------------------------
     Rating
  ----------------------------- */

  const getRating = (
    time: number | null
  ) => {
    if (time === null || time < 0) {
      return "";
    }

    if (time < 150) {
      return "Lightning Fast";
    }

    if (time < 200) {
      return "Excellent";
    }

    if (time < 250) {
      return "Very Fast";
    }

    if (time < 300) {
      return "Fast";
    }

    if (time < 400) {
      return "Average";
    }

    if (time < 500) {
      return "Slow";
    }

    return "Keep Practicing";
  };

  /* -----------------------------
     Dynamic test area class
  ----------------------------- */

  const getTestAreaClass = () => {
    if (state === "waiting") {
      return "waiting";
    }

    if (state === "ready") {
      return "ready";
    }

    if (
      state === "result" &&
      currentResult === -1
    ) {
      return "tooSoon";
    }

    if (state === "result") {
      return "result";
    }

    if (state === "finished") {
      return "finished";
    }

    return "idle";
  };

  return (
    <main className="reactionPage">
      <div className="reactionContainer">

        {/* =========================
            HEADER
        ========================= */}

        <header className="header">

          <div className="badge">
            REACTION TIME TEST
          </div>

          <h1>
            Reaction Time Test
          </h1>

          <p>
            Test how quickly you can react when
            the screen changes.
          </p>

        </header>

        {/* =========================
            MAIN CARD
        ========================= */}

        <section className="testCard">

          {/* TOP STATS */}

          <div className="topStats">

            <div className="topStat">

              <span>ROUND</span>

              <strong>
                {round > 0
                  ? `${round}/${TOTAL_ROUNDS}`
                  : "—"}
              </strong>

            </div>

            <div className="topStat right">

              <span>AVERAGE</span>

              <strong>
                {average !== null
                  ? `${average} ms`
                  : "—"}
              </strong>

            </div>

          </div>

          {/* =========================
              TEST AREA
          ========================= */}

          <button
            type="button"
            className={`testArea ${getTestAreaClass()}`}
            onClick={handleTestClick}
            aria-label="Reaction time test"
          >

            {/* IDLE */}

            {state === "idle" && (
              <>
                <div className="bolt">
                  ⚡
                </div>

                <div className="mainText">
                  Click to Start
                </div>

                <div className="subText">
                  Or press Space
                </div>
              </>
            )}

            {/* WAITING */}

            {state === "waiting" && (
              <>
                <div className="mainText">
                  Wait...
                </div>

                <div className="subText">
                  Do not click yet
                </div>
              </>
            )}

            {/* READY */}

            {state === "ready" && (
              <>
                <div className="mainText">
                  CLICK!
                </div>

                <div className="subText">
                  React as quickly as you can
                </div>
              </>
            )}

            {/* RESULT */}

            {state === "result" && (
              <>
                {currentResult === -1 ? (
                  <>
                    <div className="mainText">
                      Too Soon!
                    </div>

                    <div className="subText">
                      You clicked before the screen
                      changed.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="reactionNumber">
                      {currentResult}
                      <span>ms</span>
                    </div>

                    <div className="rating">
                      {getRating(currentResult)}
                    </div>
                  </>
                )}
              </>
            )}

            {/* FINISHED */}

            {state === "finished" && (
              <>
                <div className="mainText">
                  Test Complete
                </div>

                <div className="subText">
                  Your average reaction time
                </div>

                <div className="finalAverage">
                  {average} ms
                </div>
              </>
            )}

          </button>

          {/* =========================
              RESULT ACTION
          ========================= */}

          {state === "result" && (
            <div className="actionArea">

              {currentResult === -1 ? (
                <button
                  type="button"
                  className="primaryButton"
                  onClick={startTest}
                >
                  Try Again
                </button>
              ) : results.length <
                TOTAL_ROUNDS ? (
                <button
                  type="button"
                  className="primaryButton"
                  onClick={handleNextRound}
                >
                  Next Round
                </button>
              ) : (
                <button
                  type="button"
                  className="primaryButton"
                  onClick={() =>
                    setState("finished")
                  }
                >
                  View Results
                </button>
              )}

            </div>
          )}

          {/* =========================
              FINAL RESULTS
          ========================= */}

          {state === "finished" && (
            <div className="finalResults">

              <div className="resultBox">

                <span>
                  Average
                </span>

                <strong>
                  {average} ms
                </strong>

              </div>

              <div className="resultBox">

                <span>
                  Best
                </span>

                <strong>
                  {best} ms
                </strong>

              </div>

              <div className="resultBox">

                <span>
                  Worst
                </span>

                <strong>
                  {worst} ms
                </strong>

              </div>

              <button
                type="button"
                className="primaryButton full"
                onClick={restartTest}
              >
                Test Again
              </button>

            </div>
          )}

          {/* =========================
              ATTEMPT HISTORY
          ========================= */}

          {results.length > 0 &&
            state !== "finished" && (
              <div className="history">

                <div className="historyTitle">
                  Your Attempts
                </div>

                <div className="attemptGrid">

                  {results.map(
                    (time, index) => (
                      <div
                        className="attempt"
                        key={`${index}-${time}`}
                      >

                        <span>
                          Round {index + 1}
                        </span>

                        <strong>
                          {time} ms
                        </strong>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

        </section>

        {/* =========================
            HOW TO PLAY
        ========================= */}

        <section className="infoSection">

          <h2>
            How to Play
          </h2>

          <div className="steps">

            <div className="step">

              <div className="stepNumber">
                1
              </div>

              <p>
                Click the test area to start.
              </p>

            </div>

            <div className="step">

              <div className="stepNumber">
                2
              </div>

              <p>
                Wait until the area turns green.
              </p>

            </div>

            <div className="step">

              <div className="stepNumber">
                3
              </div>

              <p>
                Click immediately when it turns
                green.
              </p>

            </div>

            <div className="step">

              <div className="stepNumber">
                4
              </div>

              <p>
                Complete 5 rounds to get your
                average.
              </p>

            </div>

          </div>

        </section>

        {/* =========================
            INFORMATION
        ========================= */}

        <section className="infoSection">

          <h2>
            About Reaction Time
          </h2>

          <p className="infoText">
            Reaction time measures how quickly you
            respond to a visual signal. Your result
            can vary depending on your device,
            display, browser, input method, attention,
            and fatigue.
          </p>

          <p className="infoText">
            For a more useful result, complete all
            five rounds and compare your average
            reaction time instead of relying on a
            single attempt.
          </p>

        </section>

        {/* =========================
            FOOTER
        ========================= */}

        <footer className="footer">
          Free Reaction Time Test ·
          Fast · Simple · No Signup
        </footer>

      </div>

      {/* =========================
          STYLES
      ========================= */}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .reactionPage {
          min-height: 100vh;
          padding: 48px 16px 70px;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(99, 102, 241, 0.16),
              transparent 40%
            ),
            #070b16;
          color: #f8fafc;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .reactionContainer {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        /* HEADER */

        .header {
          text-align: center;
          margin-bottom: 28px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 7px 13px;
          border: 1px solid
            rgba(129, 140, 248, 0.3);
          border-radius: 999px;
          background:
            rgba(99, 102, 241, 0.1);
          color: #a5b4fc;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        h1 {
          margin: 15px 0 10px;
          font-size: clamp(
            32px,
            7vw,
            54px
          );
          line-height: 1;
          letter-spacing: -2px;
        }

        .header p {
          max-width: 600px;
          margin: 0 auto;
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.6;
        }

        /* CARD */

        .testCard {
          padding: 18px;
          border: 1px solid
            rgba(148, 163, 184, 0.13);
          border-radius: 24px;
          background:
            rgba(15, 23, 42, 0.78);
          box-shadow:
            0 30px 80px
              rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(16px);
        }

        /* TOP STATS */

        .topStats {
          display: flex;
          justify-content: space-between;
          padding: 5px 8px 16px;
        }

        .topStat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .topStat.right {
          text-align: right;
        }

        .topStat span {
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .topStat strong {
          color: #e2e8f0;
          font-size: 15px;
        }

        /* TEST AREA */

        .testArea {
          width: 100%;
          min-height: 420px;
          border: 0;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 30px;
          text-align: center;
          color: white;
          font-family: inherit;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;

          transition:
            background 0.12s ease,
            transform 0.08s ease,
            box-shadow 0.12s ease;
        }

        .testArea:active {
          transform: scale(0.995);
        }

        .testArea.idle {
          background:
            linear-gradient(
              135deg,
              #111827,
              #172033
            );
          border: 1px solid
            rgba(148, 163, 184, 0.12);
        }

        .testArea.waiting {
          background:
            linear-gradient(
              135deg,
              #991b1b,
              #7f1d1d
            );
        }

        .testArea.ready {
          background:
            linear-gradient(
              135deg,
              #15803d,
              #166534
            );

          box-shadow:
            0 0 80px
              rgba(34, 197, 94, 0.2);
        }

        .testArea.result {
          background:
            linear-gradient(
              135deg,
              #312e81,
              #3730a3
            );
        }

        .testArea.tooSoon {
          background:
            linear-gradient(
              135deg,
              #991b1b,
              #7f1d1d
            );
        }

        .testArea.finished {
          background:
            linear-gradient(
              135deg,
              #312e81,
              #3730a3
            );
        }

        .bolt {
          font-size: 48px;
          line-height: 1;
          margin-bottom: 4px;
        }

        .mainText {
          font-size: clamp(
            30px,
            7vw,
            50px
          );
          font-weight: 900;
          line-height: 1;
          letter-spacing: -1.5px;
        }

        .subText {
          color:
            rgba(255, 255, 255, 0.67);
          font-size: 14px;
          line-height: 1.5;
        }

        /* REACTION RESULT */

        .reactionNumber {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-size: clamp(
            68px,
            16vw,
            125px
          );
          line-height: 0.9;
          font-weight: 900;
          letter-spacing: -6px;
        }

        .reactionNumber span {
          font-size: 24px;
          letter-spacing: 0;
        }

        .rating {
          margin-top: 9px;
          color: #c7d2fe;
          font-size: 16px;
          font-weight: 800;
        }

        .finalAverage {
          margin-top: 12px;
          font-size: 44px;
          font-weight: 900;
        }

        /* BUTTONS */

        .actionArea {
          display: flex;
          justify-content: center;
          padding-top: 16px;
        }

        .primaryButton {
          border: 0;
          border-radius: 12px;
          padding: 13px 24px;
          background: #6366f1;
          color: #ffffff;
          font-family: inherit;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;

          transition:
            transform 0.15s ease,
            opacity 0.15s ease;
        }

        .primaryButton:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .primaryButton:active {
          transform: translateY(0);
        }

        .primaryButton.full {
          width: 100%;
          margin-top: 18px;
        }

        /* HISTORY */

        .history {
          margin-top: 18px;
        }

        .historyTitle {
          margin-bottom: 10px;
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.3px;
          text-transform: uppercase;
        }

        .attemptGrid {
          display: grid;
          grid-template-columns:
            repeat(5, 1fr);
          gap: 8px;
        }

        .attempt {
          padding: 12px 7px;
          border: 1px solid
            rgba(148, 163, 184, 0.09);
          border-radius: 12px;
          background:
            rgba(2, 6, 23, 0.45);
          text-align: center;
        }

        .attempt span {
          display: block;
          margin-bottom: 5px;
          color: #64748b;
          font-size: 10px;
        }

        .attempt strong {
          font-size: 14px;
        }

        /* FINAL RESULTS */

        .finalResults {
          margin-top: 18px;
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 10px;
        }

        .resultBox {
          padding: 18px;
          border: 1px solid
            rgba(148, 163, 184, 0.11);
          border-radius: 14px;
          background:
            rgba(2, 6, 23, 0.45);
        }

        .resultBox span {
          display: block;
          margin-bottom: 7px;
          color: #64748b;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .resultBox strong {
          font-size: 22px;
        }

        /* INFORMATION */

        .infoSection {
          margin-top: 36px;
          padding: 0 5px;
        }

        .infoSection h2 {
          margin: 0 0 15px;
          color: #f8fafc;
          font-size: 22px;
          letter-spacing: -0.4px;
        }

        .steps {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 12px;
        }

        .step {
          min-height: 135px;
          padding: 17px;
          border: 1px solid
            rgba(148, 163, 184, 0.1);
          border-radius: 14px;
          background:
            rgba(15, 23, 42, 0.45);
        }

        .stepNumber {
          display: flex;
          width: 28px;
          height: 28px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background:
            rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
          font-size: 12px;
          font-weight: 900;
        }

        .step p {
          margin: 12px 0 0;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.5;
        }

        .infoText {
          margin: 0 0 12px;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.8;
        }

        /* FOOTER */

        .footer {
          margin-top: 42px;
          text-align: center;
          color: #475569;
          font-size: 12px;
        }

        /* MOBILE */

        @media (max-width: 700px) {

          .reactionPage {
            padding:
              32px 12px 55px;
          }

          .testCard {
            padding: 12px;
            border-radius: 20px;
          }

          .testArea {
            min-height: 360px;
            border-radius: 15px;
          }

          .finalResults {
            grid-template-columns: 1fr;
          }

          .steps {
            grid-template-columns:
              1fr 1fr;
          }

        }

        @media (max-width: 480px) {

          .header {
            margin-bottom: 20px;
          }

          .header p {
            font-size: 14px;
          }

          .testArea {
            min-height: 330px;
          }

          .mainText {
            font-size: 32px;
          }

          .reactionNumber {
            font-size: 76px;
          }

          .steps {
            grid-template-columns: 1fr;
          }

          .attempt {
            padding:
              10px 3px;
          }

          .attempt span {
            font-size: 9px;
          }

          .attempt strong {
            font-size: 12px;
          }

        }

      `}</style>
    </main>
  );
}
