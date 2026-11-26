"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "home" | "coin" | "dice";

const diceColors = [
  "red",
  "blue",
  "green",
  "purple",
  "orange",
  "pink",
];

const diceDots: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function DiceFace({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  const dots = diceDots[value];

  return (
    <div className={`nxo-die nxo-die-${color}`}>
      <div className="nxo-die-inner">
        {Array.from({ length: 9 }).map((_, i) => (
          <div className="nxo-dot-cell" key={i}>
            {dots.includes(i) && <span className="nxo-dot" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CoinFlipClient() {
  const [mode, setMode] = useState<Mode>("home");

  const [coinSide, setCoinSide] = useState<"Heads" | "Tails">("Heads");
  const [flipping, setFlipping] = useState(false);

  const [headsName, setHeadsName] = useState("Heads");
  const [tailsName, setTailsName] = useState("Tails");

  const [playerCount, setPlayerCount] = useState(2);
  const [dice, setDice] = useState<number[]>([6, 6]);
  const [rolling, setRolling] = useState(false);

  const coinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const diceTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (coinTimer.current) clearTimeout(coinTimer.current);
      if (diceTimer.current) clearInterval(diceTimer.current);
    };
  }, []);

  const openCoin = () => {
    setMode("coin");
    setFlipping(false);
  };

  const openDice = () => {
    setMode("dice");
    setRolling(false);
    setDice(
      Array.from(
        { length: playerCount },
        () => Math.floor(Math.random() * 6) + 1
      )
    );
  };

  const flipCoin = () => {
    if (flipping) return;

    setFlipping(true);

    const result = Math.random() < 0.5 ? "Heads" : "Tails";

    coinTimer.current = setTimeout(() => {
      setCoinSide(result);
      setFlipping(false);
    }, 5000);
  };

  const rollDice = () => {
    if (rolling) return;

    setRolling(true);

    let count = 0;

    diceTimer.current = setInterval(() => {
      setDice(
        Array.from(
          { length: playerCount },
          () => Math.floor(Math.random() * 6) + 1
        )
      );

      count++;

      if (count >= 18) {
        if (diceTimer.current) {
          clearInterval(diceTimer.current);
        }

        setDice(
          Array.from(
            { length: playerCount },
            () => Math.floor(Math.random() * 6) + 1
          )
        );

        setRolling(false);
      }
    }, 100);
  };

  const changePlayers = (count: number) => {
    if (rolling) return;

    setPlayerCount(count);

    setDice(
      Array.from(
        { length: count },
        () => Math.floor(Math.random() * 6) + 1
      )
    );
  };

  /* ================= HOME ================= */

  if (mode === "home") {
    return (
      <main className="nxo-app">
        <div className="nxo-home">
          <header className="nxo-home-header">
            <h1>Coin Flip &amp; Dice Roller</h1>
            <p>Tap a tool to start</p>
          </header>

          <div className="nxo-tool-grid">
            {/* COIN */}
            <button
              className="nxo-tool-card nxo-coin-card"
              onClick={openCoin}
              type="button"
            >
              <div className="nxo-card-visual">
                <div className="nxo-home-coin">
                  <div className="nxo-home-coin-ring" />
                  <div className="nxo-home-coin-ring nxo-ring-two" />
                </div>
              </div>

              <div className="nxo-card-title">Coin Flip</div>
              <div className="nxo-card-subtitle">Tap to flip</div>
            </button>

            {/* DICE */}
            <button
              className="nxo-tool-card nxo-dice-card"
              onClick={openDice}
              type="button"
            >
              <div className="nxo-card-visual">
                <DiceFace value={6} color="blue" />
              </div>

              <div className="nxo-card-title">Dice Roller</div>
              <div className="nxo-card-subtitle">Tap to roll</div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ================= COIN ================= */

  if (mode === "coin") {
    return (
      <main className="nxo-fullscreen">
        <div className="nxo-topbar">
          <button
            className="nxo-back"
            onClick={() => setMode("home")}
            type="button"
            aria-label="Back"
          >
            ←
          </button>

          <div className="nxo-coin-inputs">
            <input
              value={headsName}
              onChange={(e) => setHeadsName(e.target.value)}
              disabled={flipping}
              placeholder="Heads"
            />

            <span>VS</span>

            <input
              value={tailsName}
              onChange={(e) => setTailsName(e.target.value)}
              disabled={flipping}
              placeholder="Tails"
            />
          </div>
        </div>

        <div className="nxo-center">
          <button
            className={`nxo-big-coin ${flipping ? "nxo-coin-flipping" : ""}`}
            onClick={flipCoin}
            disabled={flipping}
            type="button"
            aria-label="Flip coin"
          >
            <div className="nxo-coin-border">
              <div className="nxo-coin-inner" />
            </div>
          </button>

          {!flipping && (
            <>
              <div className="nxo-result">
                {coinSide === "Heads"
                  ? headsName || "Heads"
                  : tailsName || "Tails"}
              </div>

              <div className="nxo-result-label">Result</div>
            </>
          )}

          {flipping && (
            <div className="nxo-flipping-text">Flipping...</div>
          )}
        </div>
      </main>
    );
  }

  /* ================= DICE ================= */

  return (
    <main className="nxo-fullscreen">
      <div className="nxo-topbar">
        <button
          className="nxo-back"
          onClick={() => setMode("home")}
          type="button"
          aria-label="Back"
        >
          ←
        </button>

        <div className="nxo-player-bar">
          {Array.from({ length: 6 }, (_, i) => i + 1).map((player) => (
            <button
              key={player}
              type="button"
              onClick={() => changePlayers(player)}
              className={
                playerCount === player
                  ? "nxo-player active"
                  : "nxo-player"
              }
            >
              Player {player}
            </button>
          ))}
        </div>
      </div>

      <div className="nxo-dice-center">
        <div
          className={`nxo-dice-layout nxo-dice-count-${playerCount}`}
        >
          {dice.map((value, i) => (
            <button
              key={i}
              type="button"
              className={rolling ? "nxo-dice-button rolling" : "nxo-dice-button"}
              onClick={rollDice}
              disabled={rolling}
              aria-label={`Player ${i + 1} dice`}
            >
              <DiceFace
                value={value}
                color={diceColors[i]}
              />
            </button>
          ))}
        </div>
      </div>

      <button
        className="nxo-roll-button"
        onClick={rollDice}
        disabled={rolling}
        type="button"
      >
        {rolling ? "Rolling..." : "ROLL DICE"}
      </button>
    </main>
  );
}
