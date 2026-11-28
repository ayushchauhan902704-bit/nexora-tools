"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import confetti from "canvas-confetti";

const PLAYER_COLORS = [
  "#facc15",
  "#22c55e",
  "#3b82f6",
  "#ef4444",
  "#a855f7",
  "#f97316",
];

type View = "home" | "coin" | "dice";
type CoinSide = "H" | "T";

type DiceResult = {
  player: string;
  value: number;
};

function DiceFace({
  value,
  pos,
  color,
}: {
  value: number;
  pos: string;
  color: string;
}) {
  /*
    The front face intentionally uses 9 dots, as requested.
    During rolling/result display, the front face reflects the current
    dice value so the final visible face remains consistent with the result.
  */
  const pipsMap: Record<number, number[]> = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
    9: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  };

  return (
    <div
      className={`cube-face face-${pos}`}
      style={{
        background: `linear-gradient(145deg, ${color}, ${color}cc)`,
      }}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className={`pip ${
            pipsMap[value]?.includes(i + 1) ? "show" : ""
          }`}
        />
      ))}
    </div>
  );
}

function RealDice3D({
  value,
  color,
  rolling,
  land,
}: {
  value: number;
  color: string;
  rolling: boolean;
  land: { x: number; y: number; r: number };
}) {
  return (
    <div
      className="dice-3d-scene"
      style={
        {
          "--land-x": `${land.x}px`,
          "--land-r": `${land.r}deg`,
        } as CSSProperties
      }
    >
      <div
        className={`dice-cube ${
          rolling ? "cube-tumbling" : "cube-settled"
        }`}
      >
        {/* Front intentionally shows 9 dots visually */}
        <DiceFace value={rolling ? value : value} pos="front" color={color} />

        <DiceFace value={6} pos="back" color={color} />
        <DiceFace value={3} pos="right" color={color} />
        <DiceFace value={4} pos="left" color={color} />
        <DiceFace value={2} pos="top" color={color} />
        <DiceFace value={5} pos="bottom" color={color} />
      </div>
    </div>
  );
}

export default function CoinFlipClient() {
  const [view, setView] = useState<View>("home");

  const [headLabel, setHeadLabel] = useState("Heads");
  const [tailLabel, setTailLabel] = useState("Tails");

  const [coinResult, setCoinResult] = useState<CoinSide | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [flyKey, setFlyKey] = useState(0);
  const [showHand, setShowHand] = useState(false);

  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);

  const [howMany, setHowMany] = useState("1");

  const [playerNames, setPlayerNames] = useState([
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
    "Player 5",
    "Player 6",
  ]);

  const [diceVal, setDiceVal] = useState(6);
  const [rolling, setRolling] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  const [diceLand, setDiceLand] = useState({
    x: 0,
    y: 0,
    r: 0,
  });

  const [diceResults, setDiceResults] = useState<DiceResult[]>([]);
  const [copyMessage, setCopyMessage] = useState("");

  const diceIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const diceTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const coinTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const coinHistoryRef = useRef<Array<CoinSide>>([]);

  const playerCount = Math.max(
    1,
    Math.min(6, parseInt(howMany) || 1)
  );

  useEffect(() => {
    return () => {
      if (diceIntervalRef.current) {
        clearInterval(diceIntervalRef.current);
      }

      if (diceTimeoutRef.current) {
        clearTimeout(diceTimeoutRef.current);
      }

      if (coinTimeoutRef.current) {
        clearTimeout(coinTimeoutRef.current);
      }
    };
  }, []);

  const flipCoin = () => {
    if (flipping) return;

    setFlipping(true);
    setCoinResult(null);
    setFlyKey((k) => k + 1);
    setShowHand(true);

    window.setTimeout(() => {
      setShowHand(false);
    }, 500);

    let isHead = Math.random() > 0.5;

    const last = coinHistoryRef.current;

    /*
      Prevents an unrealistic endless streak while keeping the result
      random enough for normal use.
    */
    if (last.length >= 4) {
      const last4 = last.slice(-4);

      if (last4.every((v) => v === "H")) {
        isHead = false;
      }

      if (last4.every((v) => v === "T")) {
        isHead = true;
      }
    }

    try {
      navigator.vibrate?.([45, 35, 45, 35, 80]);
    } catch {}

    coinTimeoutRef.current = setTimeout(() => {
      const result: CoinSide = isHead ? "H" : "T";

      coinHistoryRef.current = [
        ...coinHistoryRef.current,
        result,
      ].slice(-5);

      setCoinResult(result);
      setFlipping(false);

      if (isHead) {
        setHeadsCount((h) => h + 1);
      } else {
        setTailsCount((t) => t + 1);
      }

      confetti({
        particleCount: 120,
        spread: 90,
        startVelocity: 28,
        origin: { y: 0.55 },
        colors: [
          "#e2e8f0",
          "#94a3b8",
          "#64748b",
          "#facc15",
          "#22c55e",
        ],
      });

      try {
        navigator.vibrate?.([80, 40, 100]);
      } catch {}
    }, 2400);
  };

  const resetCoin = () => {
    if (flipping) return;

    setCoinResult(null);
    setHeadsCount(0);
    setTailsCount(0);
    coinHistoryRef.current = [];
    setCopyMessage("");
  };

  const copyCoinResult = async () => {
    if (!coinResult) return;

    const text = `${
      coinResult === "H" ? headLabel : tailLabel
    } won the coin flip.`;

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("Result copied");

      window.setTimeout(() => {
        setCopyMessage("");
      }, 1600);
    } catch {
      setCopyMessage("Copy unavailable");
    }
  };

  const shareCoinResult = async () => {
    if (!coinResult) return;

    const text = `${
      coinResult === "H" ? headLabel : tailLabel
    } won the coin flip.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Coin Flip Result",
          text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopyMessage("Result copied");
      }
    } catch {}
  };

  const rollDice = () => {
    if (rolling) return;

    setRolling(true);
    setDiceResults([]);

    let playerIdx = 0;
    const temporaryResults: DiceResult[] = [];

    const doOnePlayer = () => {
      setCurrentPlayer(playerIdx);

      setDiceLand({
        x: Math.floor(Math.random() * 50) - 25,
        y: 0,
        r: Math.floor(Math.random() * 40) - 20,
      });

      let count = 0;

      diceIntervalRef.current = setInterval(() => {
        const randomValue = Math.floor(Math.random() * 6) + 1;

        setDiceVal(randomValue);

        count++;

        if (count >= 14) {
          if (diceIntervalRef.current) {
            clearInterval(diceIntervalRef.current);
          }

          const finalValue =
            Math.floor(Math.random() * 6) + 1;

          setDiceVal(finalValue);

          const playerName =
            playerNames[playerIdx]?.trim() ||
            `Player ${playerIdx + 1}`;

          temporaryResults.push({
            player: playerName,
            value: finalValue,
          });

          setDiceResults([...temporaryResults]);

          try {
            navigator.vibrate?.([35, 25, 50]);
          } catch {}

          playerIdx++;

          if (playerIdx < playerCount) {
            diceTimeoutRef.current = setTimeout(
              doOnePlayer,
              600
            );
          } else {
            diceTimeoutRef.current = setTimeout(() => {
              setRolling(false);

              try {
                navigator.vibrate?.([70, 30, 90]);
              } catch {}
            }, 250);
          }
        }
      }, 105);
    };

    doOnePlayer();
  };

  const resetDice = () => {
    if (rolling) return;

    setDiceVal(6);
    setDiceResults([]);
    setCurrentPlayer(0);
    setDiceLand({
      x: 0,
      y: 0,
      r: 0,
    });
    setCopyMessage("");
  };

  const copyDiceResults = async () => {
    if (!diceResults.length) return;

    const text = diceResults
      .map(
        (result) =>
          `${result.player}: ${result.value}`
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);

      setCopyMessage("Results copied");

      window.setTimeout(() => {
        setCopyMessage("");
      }, 1600);
    } catch {
      setCopyMessage("Copy unavailable");
    }
  };

  const shareDiceResults = async () => {
    if (!diceResults.length) return;

    const text = diceResults
      .map(
        (result) =>
          `${result.player}: ${result.value}`
      )
      .join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Dice Roller Results",
          text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCopyMessage("Results copied");
      }
    } catch {}
  };

  if (view === "home") {
    return (
      <main className="page">
        <style jsx>{css}</style>

        <div className="wrap">
          <header className="top">
            <div className="logo">
              thenexoratools<span>.com</span>
            </div>

            <div className="topBest">
              🪙 Coin + 🎲 Dice
            </div>
          </header>

          <section className="hero">
            <div className="tag">
              🪙 FREE • NO SIGN UP • INSTANT RESULTS
            </div>

            <h1>
              Coin Flip <span>& Dice Roller</span>
            </h1>

            <p className="sub">
              Flip a coin or roll the dice instantly.
              Fast, simple and designed for mobile and desktop.
            </p>
          </section>

          <div className="homeGrid">
            <div
              className="homeCard"
              onClick={() => setView("coin")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setView("coin");
                }
              }}
            >
              <div className="homeCoin">
                <div className="homeCoinBack">
                  <span>T</span>
                  <small>TAILS</small>
                </div>

                <div className="homeCoinFront">
                  <span>H</span>
                  <small>HEADS</small>
                </div>
              </div>

              <h2>🪙 Coin Flip</h2>

              <p>
                Flip a virtual coin for decisions,
                cricket tosses, teams, games and more.
              </p>

              <button
                className="openBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  setView("coin");
                }}
              >
                OPEN COIN →
              </button>
            </div>

            <div
              className="homeCard"
              onClick={() => setView("dice")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setView("dice");
                }
              }}
            >
              <div className="homeDicePreview">
                <div className="previewDice">
                  {Array.from({ length: 9 }, (_, i) => (
                    <span key={i} />
                  ))}
                </div>
              </div>

              <h2>🎲 Dice Roller</h2>

              <p>
                Roll a realistic virtual die for games,
                decisions, Ludo and up to 6 players.
              </p>

              <button
                className="openBtn dark"
                onClick={(e) => {
                  e.stopPropagation();
                  setView("dice");
                }}
              >
                OPEN DICE →
              </button>
            </div>
          </div>

          <section className="content">
            <h2>Coin Flip & Dice Roller Online</h2>

            <p>
              Use a free virtual coin flip or dice roller
              directly in your browser. No account, installation
              or unnecessary setup is required. The tool is
              designed to work smoothly on phones, tablets and
              desktop devices.
            </p>

            <div className="featureStrip">
              <span>✓ Free to use</span>
              <span>✓ No registration</span>
              <span>✓ Mobile friendly</span>
              <span>✓ Instant results</span>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (view === "coin") {
    return (
      <main className="page">
        <style jsx>{css}</style>

        <div className="wrap">
          <button
            className="backBtn"
            onClick={() => setView("home")}
          >
            ← Back
          </button>

          <header className="top">
            <div className="logo">
              thenexoratools<span>.com</span>
            </div>

            <div className="topBest">
              🪙 Coin Flip
            </div>
          </header>

          <div className="toolIntro">
            <h1>Coin Flip Online</h1>

            <p>
              Flip a virtual coin instantly. Customize both
              sides and use it for decisions, games, tosses and
              everyday choices.
            </p>
          </div>

          <div className="nameBar">
            <label className="srOnly" htmlFor="heads-name">
              Heads label
            </label>

            <input
              id="heads-name"
              value={headLabel}
              onChange={(e) =>
                setHeadLabel(e.target.value)
              }
              placeholder="Heads"
              maxLength={14}
            />

            <span>VS</span>

            <label className="srOnly" htmlFor="tails-name">
              Tails label
            </label>

            <input
              id="tails-name"
              value={tailLabel}
              onChange={(e) =>
                setTailLabel(e.target.value)
              }
              placeholder="Tails"
              maxLength={14}
            />
          </div>

          <div
            className="bigStage coinStage"
            onClick={flipCoin}
            role="button"
            tabIndex={0}
            aria-label="Flip the coin"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                flipCoin();
              }
            }}
          >
            <div className="coinScene">
              <div
                key={flyKey}
                className={`coinWrapper ${
                  flipping
                    ? "coin-flipping-video"
                    : ""
                }`}
              >
                <div className="coin3d">
                  <div className="coinSide coinFront">
                    <div className="coinInner">
                      <span className="coinLetter">
                        {coinResult === "T" ? "T" : "H"}
                      </span>

                      <small>
                        {coinResult === "T"
                          ? tailLabel
                          : headLabel}
                      </small>

                      <i />
                    </div>
                  </div>

                  <div className="coinSide coinBack">
                    <div className="coinInner">
                      <span className="coinLetter">
                        T
                      </span>

                      <small>{tailLabel}</small>

                      <i />
                    </div>
                  </div>

                  <div className="coinEdge" />
                </div>
              </div>

              {showHand && (
                <div className="toss-hand">🤚</div>
              )}
            </div>

            <div
              className={`coinShadow ${
                flipping ? "shadow-flipping" : ""
              }`}
            />

            <p className="stageText">
              {flipping
                ? "Flipping..."
                : coinResult
                ? `🏆 ${
                    coinResult === "H"
                      ? headLabel
                      : tailLabel
                  } Wins!`
                : "Tap the coin to flip"}
            </p>

            <small className="stageSub">
              {flipping
                ? "Watch the coin spin in the air"
                : "Tap anywhere on the coin"}
            </small>
          </div>

          <button
            className="bigBtn green"
            onClick={flipCoin}
            disabled={flipping}
          >
            {flipping
              ? "FLIPPING... 🪙"
              : "FLIP COIN 🚀"}
          </button>

          <div className="stats">
            <div className="stat">
              {headLabel || "Heads"}
              <b>{headsCount}</b>
            </div>

            <div className="stat">
              {tailLabel || "Tails"}
              <b>{tailsCount}</b>
            </div>

            <div className="stat">
              Total
              <b>{headsCount + tailsCount}</b>
            </div>
          </div>

          {coinResult && !flipping && (
            <>
              <div className="winnerLine">
                🏆 Winner:{" "}
                {coinResult === "H"
                  ? headLabel
                  : tailLabel}
              </div>

              <div className="resultActions">
                <button onClick={copyCoinResult}>
                  📋 Copy Result
                </button>

                <button onClick={shareCoinResult}>
                  ↗ Share
                </button>

                <button onClick={resetCoin}>
                  ↻ Reset
                </button>
              </div>
            </>
          )}

          {!coinResult && !flipping && (
            <button
              className="secondaryBtn"
              onClick={resetCoin}
            >
              ↻ Reset
            </button>
          )}

          {copyMessage && (
            <div className="copyToast">
              {copyMessage}
            </div>
          )}

          <section className="infoCard">
            <h2>How to Flip a Coin</h2>

            <ol>
              <li>Choose your Heads and Tails labels.</li>
              <li>Tap the coin or press the Flip Coin button.</li>
              <li>Wait for the animation to finish.</li>
              <li>Use the displayed result.</li>
            </ol>

            <h3>Is this coin flip random?</h3>

            <p>
              The result is generated in your browser using
              JavaScript randomness. It is suitable for casual
              decisions, games and virtual tosses.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <style jsx>{css}</style>

      <div className="wrap">
        <button
          className="backBtn"
          onClick={() => setView("home")}
        >
          ← Back
        </button>

        <header className="top">
          <div className="logo">
            thenexoratools<span>.com</span>
          </div>

          <div className="topBest">
            🎲 Dice Roller
          </div>
        </header>

        <div className="toolIntro">
          <h1>Dice Roller Online</h1>

          <p>
            Roll a virtual dice instantly for board games,
            Ludo, decisions, classroom activities and up to
            six players.
          </p>
        </div>

        <div className="howManyBox">
          <label htmlFor="player-count">
            How many players?
          </label>

          <input
            id="player-count"
            type="number"
            min={1}
            max={6}
            value={howMany}
            onChange={(e) => {
              let v = e.target.value;

              if (v === "") {
                setHowMany("");
                return;
              }

              let n = parseInt(v);

              if (isNaN(n)) {
                setHowMany("");
                return;
              }

              if (n > 6) n = 6;
              if (n < 1) n = 1;

              setHowMany(String(n));
            }}
            placeholder="1"
          />

          <span>/ 6</span>
        </div>

        {playerCount > 1 && (
          <div className="playerNames">
            {Array.from(
              { length: playerCount },
              (_, i) => (
                <div
                  className="playerInputWrap"
                  key={i}
                >
                  <label htmlFor={`player-${i}`}>
                    Player {i + 1}
                  </label>

                  <input
                    id={`player-${i}`}
                    value={playerNames[i]}
                    onChange={(e) => {
                      const arr = [...playerNames];

                      arr[i] = e.target.value;

                      setPlayerNames(arr);
                    }}
                    style={{
                      borderColor:
                        PLAYER_COLORS[i],
                    }}
                    placeholder={`Player ${i + 1}`}
                    maxLength={18}
                  />
                </div>
              )
            )}
          </div>
        )}

        <div
          className="bigStage diceStage"
          onClick={rollDice}
          role="button"
          tabIndex={0}
          aria-label="Roll the dice"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              rollDice();
            }
          }}
        >
          <div className="diceArena">
            <RealDice3D
              value={diceVal}
              color={
                playerCount === 1
                  ? PLAYER_COLORS[0]
                  : PLAYER_COLORS[currentPlayer]
              }
              rolling={rolling}
              land={diceLand}
            />
          </div>

          <div className="diceGroundShadow" />

          <div className="diceTouchText">
            {rolling
              ? playerCount > 1
                ? `${
                    playerNames[currentPlayer] ||
                    `Player ${currentPlayer + 1}`
                  } is rolling...`
                : "Rolling..."
              : diceResults.length
              ? "Roll again anytime"
              : "Tap the dice to roll"}
          </div>

          <small className="stageSub">
            {rolling
              ? "Watch it tumble like a real die"
              : "Tap anywhere on the dice"}
          </small>
        </div>

        <button
          className="bigBtn black"
          onClick={rollDice}
          disabled={rolling}
        >
          {rolling
            ? "ROLLING... 🎲"
            : "ROLL DICE 🎲"}
        </button>

        {diceResults.length > 0 && !rolling && (
          <section className="diceResults">
            <div className="resultHeader">
              <div>
                <span>ROLL RESULTS</span>
                <h2>Final Results</h2>
              </div>

              <div className="resultActions compact">
                <button onClick={copyDiceResults}>
                  📋 Copy
                </button>

                <button onClick={shareDiceResults}>
                  ↗ Share
                </button>
              </div>
            </div>

            <div className="resultList">
              {diceResults.map((result, index) => (
                <div
                  className="diceResultRow"
                  key={`${result.player}-${index}`}
                >
                  <div className="resultPlayer">
                    <span
                      className="playerDot"
                      style={{
                        background:
                          PLAYER_COLORS[
                            index %
                              PLAYER_COLORS.length
                          ],
                      }}
                    />

                    <strong>
                      {result.player}
                    </strong>
                  </div>

                  <div className="resultNumber">
                    {result.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <button
          className="secondaryBtn"
          onClick={resetDice}
          disabled={rolling}
        >
          ↻ Reset Dice
        </button>

        {copyMessage && (
          <div className="copyToast">
            {copyMessage}
          </div>
        )}

        <section className="infoCard">
          <h2>How to Use the Dice Roller</h2>

          <ol>
            <li>
              Choose between 1 and 6 players.
            </li>

            <li>
              Enter player names if you are playing
              with multiple people.
            </li>

            <li>
              Tap the dice or press Roll Dice.
            </li>

            <li>
              Wait for the final result.
            </li>
          </ol>

          <h3>What can you use it for?</h3>

          <p>
            Use the virtual dice for board games, Ludo,
            classroom activities, random decisions,
            tabletop games and other situations where
            you need a quick dice roll.
          </p>
        </section>
      </div>
    </main>
  );
}

const css = `
* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 50% -10%,
      rgba(22, 163, 74, 0.07),
      transparent 35%
    ),
    #ffffff;
  color: #0f172a;
  padding: 10px 12px 50px;
  font-family:
    "Plus Jakarta Sans",
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

button,
input {
  font-family: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

.wrap {
  max-width: 900px;
  margin: auto;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.logo {
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.4px;
}

.logo span {
  color: #16a34a;
}

.topBest {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 6px 11px;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.hero {
  text-align: center;
  margin-bottom: 15px;
}

.tag {
  display: inline-block;
  padding: 5px 11px;
  border-radius: 999px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  font-size: 9px;
  font-weight: 900;
  margin-bottom: 7px;
}

h1 {
  margin: 0;
  font-size: 27px;
  font-weight: 900;
  letter-spacing: -1px;
}

h1 span {
  color: #16a34a;
}

.sub {
  color: #64748b;
  font-size: 12px;
  margin: 6px auto 0;
  line-height: 1.6;
  max-width: 650px;
}

.homeGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
}

.homeCard {
  background: linear-gradient(
    180deg,
    #ffffff,
    #fbfdff
  );
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  padding: 20px 14px;
  text-align: center;
  cursor: pointer;
  box-shadow:
    0 15px 45px rgba(15, 23, 42, 0.07);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.homeCard:hover {
  transform: translateY(-3px);
  border-color: #cbd5e1;
  box-shadow:
    0 20px 55px rgba(15, 23, 42, 0.1);
}

.homeCard:focus-visible {
  outline: 3px solid rgba(22, 163, 74, 0.2);
  outline-offset: 3px;
}

.homeCard h2 {
  font-size: 18px;
  margin: 15px 0 5px;
}

.homeCard p {
  color: #64748b;
  font-size: 11px;
  line-height: 1.55;
  margin: 0;
}

.openBtn {
  margin-top: 15px;
  border: 0;
  background: #16a34a;
  color: #fff;
  border-radius: 999px;
  padding: 11px 18px;
  font-weight: 900;
  font-size: 12px;
  width: 100%;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.openBtn:hover {
  transform: translateY(-1px);
}

.openBtn.dark {
  background: #0f172a;
}

.homeCoin {
  width: 130px;
  height: 130px;
  margin: 8px auto;
  position: relative;
}

.homeCoinFront,
.homeCoinBack {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 5px solid;
  box-shadow:
    0 18px 30px rgba(0, 0, 0, 0.2);
}

.homeCoinFront {
  z-index: 2;
  background:
    radial-gradient(
      circle at 30% 25%,
      #ffffff 0%,
      #e2e8f0 25%,
      #94a3b8 58%,
      #475569 100%
    );
  border-color: #64748b;
}

.homeCoinBack {
  transform:
    translateX(17px)
    scale(0.91);
  background:
    radial-gradient(
      circle at 30% 25%,
      #f8fafc 0%,
      #cbd5e1 35%,
      #64748b 75%,
      #334155 100%
    );
  border-color: #475569;
}

.homeCoin span {
  font-size: 48px;
  line-height: 1;
  font-weight: 950;
  color: #0f172a;
}

.homeCoin small {
  margin-top: 2px;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #334155;
}

.homeDicePreview {
  width: 130px;
  height: 130px;
  margin: 8px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.previewDice {
  width: 100px;
  height: 100px;
  border-radius: 23px;
  background:
    linear-gradient(
      145deg,
      #ef4444,
      #dc2626 45%,
      #991b1b
    );
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  padding: 18px;
  gap: 2px;
  transform:
    rotateX(10deg)
    rotateY(-12deg)
    rotateZ(-4deg);
  box-shadow:
    0 20px 30px rgba(0, 0, 0, 0.23);
}

.previewDice span {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #fff;
  place-self: center;
}

.content {
  margin-top: 15px;
  background:
    linear-gradient(
      180deg,
      #f8fafc,
      #ffffff
    );
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  padding: 17px;
}

.content h2 {
  font-size: 17px;
  margin: 0 0 7px;
}

.content p {
  color: #64748b;
  font-size: 11px;
  line-height: 1.75;
  margin: 0;
}

.featureStrip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
  margin-top: 14px;
}

.featureStrip span {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 5px;
  text-align: center;
  font-size: 9px;
  font-weight: 800;
  color: #475569;
}

.backBtn {
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  margin-bottom: 10px;
}

.backBtn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.toolIntro {
  text-align: center;
  margin-bottom: 12px;
}

.toolIntro h1 {
  font-size: 25px;
}

.toolIntro p {
  color: #64748b;
  font-size: 11px;
  line-height: 1.7;
  max-width: 650px;
  margin: 6px auto 0;
}

.nameBar {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.nameBar input {
  flex: 1;
  min-width: 0;
  border: 1.5px solid #e2e8f0;
  border-radius: 999px;
  padding: 12px 10px;
  font-size: 12px;
  font-weight: 800;
  text-align: center;
  outline: none;
  background: #f8fafc;
}

.nameBar input:focus {
  border-color: #16a34a;
  background: #fff;
}

.nameBar span {
  font-weight: 900;
  color: #94a3b8;
  font-size: 10px;
}

.bigStage {
  position: relative;
  background:
    radial-gradient(
      circle at 50% 40%,
      #ffffff 0%,
      #ffffff 52%,
      #f8fafc 100%
    );
  border: 1px solid #e2e8f0;
  border-radius: 23px;
  padding: 22px 14px;
  text-align: center;
  min-height: 390px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow:
    0 15px 45px rgba(15, 23, 42, 0.07);
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.bigStage:focus-visible {
  outline: 3px solid rgba(22, 163, 74, 0.2);
  outline-offset: 3px;
}

.stageText {
  position: relative;
  z-index: 5;
  font-size: 17px;
  font-weight: 900;
  margin: 20px 0 3px;
}

.stageSub {
  position: relative;
  z-index: 5;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
}

.coinStage {
  perspective: 1200px;
}

.coinScene {
  position: relative;
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1400px;
  z-index: 3;
}

.coinWrapper {
  width: 230px;
  height: 230px;
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;
}

.coin3d {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.coinSide {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  overflow: hidden;
}

.coinFront {
  background:
    radial-gradient(
      circle at 32% 28%,
      #ffffff 0%,
      #f8fafc 18%,
      #cbd5e1 48%,
      #94a3b8 78%,
      #64748b 100%
    );
  border: 7px solid #94a3b8;
  box-shadow:
    inset 0 0 0 3px rgba(255, 255, 255, 0.5),
    inset 0 -12px 22px rgba(15, 23, 42, 0.35),
    inset 0 10px 16px rgba(255, 255, 255, 0.6),
    0 18px 28px rgba(15, 23, 42, 0.22);
}

.coinBack {
  transform: rotateY(180deg);
  background:
    radial-gradient(
      circle at 32% 28%,
      #ffffff 0%,
      #e2e8f0 22%,
      #94a3b8 62%,
      #475569 100%
    );
  border: 7px solid #64748b;
  box-shadow:
    inset 0 0 0 3px rgba(255, 255, 255, 0.4),
    inset 0 -12px 22px rgba(15, 23, 42, 0.3),
    inset 0 10px 16px rgba(255, 255, 255, 0.5);
}

.coinInner {
  position: absolute;
  inset: 14px;
  border: 2px dashed rgba(15, 23, 42, 0.32);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.coinLetter {
  font-size: 96px;
  font-weight: 950;
  line-height: 0.9;
  color: #0f172a;
  text-shadow:
    0 2px 0 rgba(255, 255, 255, 0.7),
    0 -1px 0 rgba(0, 0, 0, 0.15);
  font-family: Georgia, serif;
}

.coinInner small {
  margin-top: 7px;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 10px;
  font-weight: 950;
  letter-spacing: 1px;
  color: #334155;
}

.coinInner i {
  position: absolute;
  top: 12px;
  left: 24px;
  width: 52px;
  height: 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  filter: blur(5px);
  transform: rotate(-25deg);
}

.coinEdge {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #64748b;
  transform: translateZ(-6px);
}

.toss-hand {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 84px;
  z-index: 10;
  animation:
    handToss 0.5s ease-out forwards;
}

@keyframes handToss {
  0% {
    transform:
      translateX(-50%)
      translateY(60px)
      scale(0.9);
    opacity: 0;
  }

  30% {
    opacity: 1;
  }

  100% {
    transform:
      translateX(-50%)
      translateY(-30px)
      scale(1.05);
    opacity: 0;
  }
}

.coin-flipping-video {
  animation:
    coinVideoFlip
    2.4s
    cubic-bezier(0.25, 0.7, 0.3, 1)
    forwards;
}

@keyframes coinVideoFlip {
  0% {
    transform:
      translateY(0)
      rotateX(0deg)
      scale(1, 1);
    filter: blur(0);
  }

  8% {
    transform:
      translateY(-55px)
      rotateX(320deg)
      scale(0.92, 0.95);
    filter: blur(0.3px);
  }

  16% {
    transform:
      translateY(-115px)
      rotateX(720deg)
      scale(0.55, 0.92);
    filter: blur(1.2px);
  }

  26% {
    transform:
      translateY(-165px)
      rotateX(1150deg)
      scale(0.28, 0.88);
    filter: blur(2.2px);
  }

  36% {
    transform:
      translateY(-175px)
      rotateX(1550deg)
      scale(0.18, 0.85);
    filter: blur(2.8px);
  }

  46% {
    transform:
      translateY(-155px)
      rotateX(1950deg)
      scale(0.32, 0.88);
    filter: blur(2.2px);
  }

  56% {
    transform:
      translateY(-105px)
      rotateX(2300deg)
      scale(0.6, 0.92);
    filter: blur(1.2px);
  }

  66% {
    transform:
      translateY(-45px)
      rotateX(2620deg)
      scale(0.88, 0.96);
    filter: blur(0.4px);
  }

  75% {
    transform:
      translateY(0)
      rotateX(2880deg)
      scale(1, 1);
    filter: blur(0);
  }

  82% {
    transform:
      translateY(-22px)
      rotateX(2970deg)
      scale(1, 0.96);
    filter: blur(0);
  }

  88% {
    transform:
      translateY(0)
      rotateX(3040deg)
      scale(1, 1);
    filter: blur(0);
  }

  93% {
    transform:
      translateY(-10px)
      rotateX(3080deg)
      scale(1, 0.98);
  }

  97% {
    transform:
      translateY(0)
      rotateX(3100deg)
      scale(1, 1);
  }

  100% {
    transform:
      translateY(0)
      rotateX(3240deg)
      scale(1, 1);
    filter: blur(0);
  }
}

.coinShadow {
  position: absolute;
  width: 185px;
  height: 34px;
  bottom: 128px;
  background:
    radial-gradient(
      ellipse,
      rgba(15, 23, 42, 0.24),
      transparent 68%
    );
  filter: blur(6px);
  pointer-events: none;
}

.shadow-flipping {
  animation:
    coinShadowVideo
    2.4s
    ease-in-out
    forwards;
}

@keyframes coinShadowVideo {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }

  30% {
    transform: scale(0.45);
    opacity: 0.15;
  }

  50% {
    transform: scale(0.38);
    opacity: 0.1;
  }

  75% {
    transform: scale(0.85);
    opacity: 0.35;
  }

  82% {
    transform: scale(0.95);
    opacity: 0.45;
  }

  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

.diceStage {
  min-height: 370px;
}

.diceArena {
  position: relative;
  width: 270px;
  height: 270px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1100px;
  z-index: 3;
}

.dice-3d-scene {
  width: 190px;
  height: 190px;
  perspective: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dice-cube {
  width: 150px;
  height: 150px;
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;
}

.cube-face {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  padding: 22px;
  gap: 2px;
  box-shadow:
    inset 0 -10px 18px rgba(0, 0, 0, 0.25),
    inset 0 6px 10px rgba(255, 255, 255, 0.25),
    0 20px 35px rgba(0, 0, 0, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.25);
}

.face-front {
  transform: translateZ(75px);
}

.face-back {
  transform:
    rotateY(180deg)
    translateZ(75px);
}

.face-right {
  transform:
    rotateY(90deg)
    translateZ(75px);
}

.face-left {
  transform:
    rotateY(-90deg)
    translateZ(75px);
}

.face-top {
  transform:
    rotateX(90deg)
    translateZ(75px);
}

.face-bottom {
  transform:
    rotateX(-90deg)
    translateZ(75px);
}

.pip {
  width: 24px;
  height: 24px;
  background:
    radial-gradient(
      circle at 35% 30%,
      #ffffff,
      #e2e8f0 60%,
      #94a3b8
    );
  border-radius: 50%;
  opacity: 0;
  place-self: center;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.35);
}

.pip.show {
  opacity: 1;
}

.cube-tumbling {
  animation:
    diceTumbleVideo
    1.5s
    cubic-bezier(0.2, 0.75, 0.25, 1)
    forwards;
}

@keyframes diceTumbleVideo {
  0% {
    transform:
      translate3d(0, 0, 0)
      rotateX(0deg)
      rotateY(0deg)
      rotateZ(0deg)
      scale(1);
  }

  15% {
    transform:
      translate3d(-22px, -70px, 80px)
      rotateX(220deg)
      rotateY(180deg)
      rotateZ(-18deg)
      scale(0.92);
  }

  30% {
    transform:
      translate3d(20px, -150px, 150px)
      rotateX(480deg)
      rotateY(420deg)
      rotateZ(25deg)
      scale(0.84);
  }

  48% {
    transform:
      translate3d(
        var(--land-x, 0px),
        -185px,
        190px
      )
      rotateX(760deg)
      rotateY(680deg)
      rotateZ(-12deg)
      scale(0.82);
  }

  65% {
    transform:
      translate3d(
        var(--land-x, 0px),
        -110px,
        110px
      )
      rotateX(1020deg)
      rotateY(920deg)
      rotateZ(15deg)
      scale(0.9);
  }

  80% {
    transform:
      translate3d(
        var(--land-x, 0px),
        -30px,
        40px
      )
      rotateX(1240deg)
      rotateY(1100deg)
      rotateZ(-5deg)
      scale(0.97);
  }

  90% {
    transform:
      translate3d(
        var(--land-x, 0px),
        10px,
        0
      )
      rotateX(1350deg)
      rotateY(1200deg)
      scale(1.03);
  }

  95% {
    transform:
      translate3d(
        var(--land-x, 0px),
        -8px,
        0
      )
      rotateX(1400deg)
      rotateY(1250deg)
      scale(1.01);
  }

  100% {
    transform:
      translate3d(
        var(--land-x, 0px),
        0,
        0
      )
      rotateX(1440deg)
      rotateY(1440deg)
      rotateZ(var(--land-r, 0deg))
      scale(1);
  }
}

.cube-settled {
  transform:
    rotateX(0deg)
    rotateY(0deg)
    rotateZ(0deg);
  transition:
    transform 0.35s ease;
}

.diceGroundShadow {
  position: absolute;
  width: 190px;
  height: 38px;
  bottom: 102px;
  border-radius: 50%;
  background:
    radial-gradient(
      ellipse,
      rgba(15, 23, 42, 0.28),
      transparent 70%
    );
  filter: blur(7px);
  z-index: 1;
  pointer-events: none;
}

.diceTouchText {
  position: relative;
  z-index: 5;
  font-size: 17px;
  font-weight: 900;
  margin-top: 2px;
}

.howManyBox {
  display: flex;
  align-items: center;
  gap: 9px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  padding: 10px 12px;
  margin-bottom: 9px;
}

.howManyBox label {
  flex: 1;
  font-size: 12px;
  font-weight: 900;
}

.howManyBox input {
  width: 70px;
  border: 1.5px solid #e2e8f0;
  border-radius: 999px;
  padding: 9px;
  font-size: 15px;
  font-weight: 900;
  text-align: center;
  outline: none;
  background: #fff;
}

.howManyBox input:focus {
  border-color: #16a34a;
}

.howManyBox span {
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
}

.playerNames {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
  margin-bottom: 10px;
}

.playerInputWrap {
  min-width: 0;
}

.playerInputWrap label {
  display: block;
  font-size: 8px;
  font-weight: 900;
  color: #64748b;
  margin: 0 0 4px 7px;
}

.playerNames input {
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 999px;
  padding: 9px 10px;
  font-size: 11px;
  font-weight: 800;
  text-align: center;
  outline: none;
  background: #fff;
}

.playerNames input:focus {
  background: #f8fafc;
}

.bigBtn {
  width: 100%;
  border: 0;
  border-radius: 999px;
  padding: 15px;
  font-size: 14px;
  font-weight: 950;
  cursor: pointer;
  margin-top: 14px;
  color: #fff;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
}

.bigBtn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.bigBtn.green {
  background:
    linear-gradient(
      180deg,
      #22c55e,
      #16a34a
    );
}

.bigBtn.black {
  background:
    linear-gradient(
      180deg,
      #1e293b,
      #0f172a
    );
}

.bigBtn:disabled {
  opacity: 0.58;
  cursor: not-allowed;
}

.stats {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.stat {
  flex: 1;
  background:
    linear-gradient(
      180deg,
      #f8fafc,
      #ffffff
    );
  border: 1px solid #e2e8f0;
  border-radius: 13px;
  padding: 8px;
  text-align: center;
  font-size: 10px;
  font-weight: 800;
}

.stat b {
  display: block;
  font-size: 16px;
  margin-top: 2px;
}

.winnerLine {
  margin-top: 10px;
  background:
    linear-gradient(
      180deg,
      #f0fdf4,
      #ffffff
    );
  border: 1.5px solid #16a34a;
  border-radius: 13px;
  padding: 10px;
  text-align: center;
  font-weight: 900;
  font-size: 13px;
}

.resultActions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
  margin-top: 8px;
}

.resultActions button,
.secondaryBtn {
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #0f172a;
  border-radius: 999px;
  padding: 10px 8px;
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
}

.resultActions button:hover,
.secondaryBtn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.secondaryBtn {
  width: 100%;
  margin-top: 9px;
}

.secondaryBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.diceResults {
  margin-top: 12px;
  background:
    linear-gradient(
      180deg,
      #ffffff,
      #f8fafc
    );
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 13px;
}

.resultHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.resultHeader span {
  display: block;
  color: #16a34a;
  font-size: 8px;
  font-weight: 950;
  letter-spacing: 1.5px;
}

.resultHeader h2 {
  margin: 3px 0 0;
  font-size: 17px;
}

.resultActions.compact {
  margin: 0;
  display: flex;
}

.resultActions.compact button {
  padding: 8px 10px;
}

.resultList {
  margin-top: 10px;
  display: grid;
  gap: 6px;
}

.diceResultRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 10px;
}

.resultPlayer {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.resultPlayer strong {
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playerDot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex: 0 0 auto;
}

.resultNumber {
  min-width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  color: #fff;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 950;
}

.copyToast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  background: #0f172a;
  color: #fff;
  padding: 9px 14px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 900;
  z-index: 100;
  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.25);
}

.infoCard {
  margin-top: 14px;
  background:
    linear-gradient(
      180deg,
      #f8fafc,
      #ffffff
    );
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  padding: 16px;
}

.infoCard h2 {
  font-size: 17px;
  margin: 0 0 9px;
}

.infoCard h3 {
  font-size: 13px;
  margin: 17px 0 5px;
}

.infoCard p {
  color: #64748b;
  font-size: 11px;
  line-height: 1.75;
  margin: 0;
}

.infoCard ol {
  margin: 0;
  padding-left: 20px;
  color: #475569;
  font-size: 11px;
  line-height: 1.9;
}

.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 650px) {
  .page {
    padding: 9px 10px 35px;
  }

  .homeGrid {
    grid-template-columns: 1fr;
  }

  .featureStrip {
    grid-template-columns: repeat(2, 1fr);
  }

  .bigStage {
    min-height: 380px;
  }

  .coinScene {
    width: 230px;
    height: 230px;
  }

  .coinWrapper {
    width: 205px;
    height: 205px;
  }

  .coinLetter {
    font-size: 82px;
  }

  .dice-cube {
    width: 130px;
    height: 130px;
  }

  .cube-face {
    width: 130px;
    height: 130px;
    padding: 18px;
  }

  .face-front {
    transform: translateZ(65px);
  }

  .face-back {
    transform:
      rotateY(180deg)
      translateZ(65px);
  }

  .face-right {
    transform:
      rotateY(90deg)
      translateZ(65px);
  }

  .face-left {
    transform:
      rotateY(-90deg)
      translateZ(65px);
  }

  .face-top {
    transform:
      rotateX(90deg)
      translateZ(65px);
  }

  .face-bottom {
    transform:
      rotateX(-90deg)
      translateZ(65px);
  }

  .pip {
    width: 20px;
    height: 20px;
  }

  .playerNames {
    grid-template-columns: repeat(2, 1fr);
  }

  .resultHeader {
    align-items: flex-start;
    flex-direction: column;
  }

  .resultActions.compact {
    width: 100%;
  }

  .resultActions.compact button {
    flex: 1;
  }
}

@media (max-width: 390px) {
  h1 {
    font-size: 24px;
  }

  .topBest {
    font-size: 9px;
    padding: 5px 8px;
  }

  .coinScene {
    transform: scale(0.94);
  }

  .diceArena {
    transform: scale(0.9);
  }

  .playerNames {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
`;
