"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "home" | "coin" | "dice";

const diceColors = [
  "from-red-500 to-red-700",
  "from-blue-500 to-blue-700",
  "from-green-500 to-green-700",
  "from-purple-500 to-purple-700",
  "from-orange-500 to-orange-700",
  "from-pink-500 to-pink-700",
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
  colorIndex,
  large = false,
}: {
  value: number;
  colorIndex: number;
  large?: boolean;
}) {
  return (
    <div
      className={`
        relative rounded-[28px]
        bg-gradient-to-br ${diceColors[colorIndex]}
        shadow-[0_25px_80px_rgba(0,0,0,.45)]
        border border-white/20
        ${large
          ? "w-48 h-48 md:w-64 md:h-64"
          : "w-32 h-32 md:w-40 md:h-40"}
      `}
    >
      <div className="absolute inset-0 rounded-[28px] bg-white/[0.06]" />

      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-[18%]">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {diceDots[value].includes(i) && (
              <div
                className={`
                  rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,.35)]
                  ${large ? "w-7 h-7 md:w-9 md:h-9" : "w-5 h-5 md:w-6 md:h-6"}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CoinFlipClient() {
  const [mode, setMode] = useState<Mode>("home");

  const [coinSide, setCoinSide] = useState<"Heads" | "Tails">("Heads");
  const [coinFlipping, setCoinFlipping] = useState(false);

  const [headsName, setHeadsName] = useState("Heads");
  const [tailsName, setTailsName] = useState("Tails");

  const [playerCount, setPlayerCount] = useState(2);
  const [diceValues, setDiceValues] = useState<number[]>([6, 6]);
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
    setCoinFlipping(false);
  };

  const openDice = () => {
    setMode("dice");
    setRolling(false);
    setDiceValues(
      Array.from({ length: playerCount }, () => Math.floor(Math.random() * 6) + 1)
    );
  };

  const flipCoin = () => {
    if (coinFlipping) return;

    setCoinFlipping(true);

    const finalSide = Math.random() < 0.5 ? "Heads" : "Tails";

    // 5 seconds visible toss
    coinTimer.current = setTimeout(() => {
      setCoinSide(finalSide);
      setCoinFlipping(false);
    }, 5000);
  };

  const rollDice = () => {
    if (rolling) return;

    setRolling(true);

    let ticks = 0;

    diceTimer.current = setInterval(() => {
      setDiceValues(
        Array.from(
          { length: playerCount },
          () => Math.floor(Math.random() * 6) + 1
        )
      );

      ticks++;

      if (ticks >= 18) {
        if (diceTimer.current) clearInterval(diceTimer.current);

        setDiceValues(
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
    setDiceValues(
      Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1)
    );
  };

  // ---------------- HOME ----------------

  if (mode === "home") {
    return (
      <main className="min-h-screen bg-[#07090f] text-white px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              Coin Flip & Dice Roller
            </h1>

            <p className="mt-3 text-zinc-400 text-sm md:text-base">
              Tap a tool to start
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* COIN CARD */}
            <button
              onClick={openCoin}
              className="
                group relative min-h-[430px] md:min-h-[560px]
                rounded-[32px] border border-white/10
                bg-gradient-to-b from-zinc-900 to-[#0b0d13]
                overflow-hidden
                flex items-center justify-center
                transition-all duration-300
                hover:border-yellow-400/40
                hover:-translate-y-1
                active:scale-[0.98]
              "
            >
              <div
                className="
                  absolute inset-0 opacity-0 group-hover:opacity-100
                  transition-opacity
                  bg-[radial-gradient(circle_at_center,rgba(250,204,21,.12),transparent_55%)]
                "
              />

              <div className="relative flex flex-col items-center">
                <div
                  className="
                    w-56 h-56 md:w-72 md:h-72
                    rounded-full
                    bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600
                    border-[10px] border-yellow-700/80
                    shadow-[0_30px_100px_rgba(250,204,21,.25)]
                    flex items-center justify-center
                  "
                >
                  {/* Completely blank coin */}
                  <div
                    className="
                      w-[82%] h-[82%] rounded-full
                      border-2 border-yellow-200/40
                      shadow-inner
                    "
                  />
                </div>

                <h2 className="mt-8 text-2xl md:text-3xl font-black">
                  Coin Flip
                </h2>

                <p className="mt-2 text-zinc-500 text-sm">
                  Tap to flip
                </p>
              </div>
            </button>

            {/* DICE CARD */}
            <button
              onClick={openDice}
              className="
                group relative min-h-[430px] md:min-h-[560px]
                rounded-[32px] border border-white/10
                bg-gradient-to-b from-zinc-900 to-[#0b0d13]
                overflow-hidden
                flex items-center justify-center
                transition-all duration-300
                hover:border-blue-400/40
                hover:-translate-y-1
                active:scale-[0.98]
              "
            >
              <div
                className="
                  absolute inset-0 opacity-0 group-hover:opacity-100
                  transition-opacity
                  bg-[radial-gradient(circle_at_center,rgba(59,130,246,.12),transparent_55%)]
                "
              />

              <div className="relative flex flex-col items-center">
                <DiceFace value={6} colorIndex={1} large />

                <h2 className="mt-8 text-2xl md:text-3xl font-black">
                  Dice Roller
                </h2>

                <p className="mt-2 text-zinc-500 text-sm">
                  Tap to roll
                </p>
              </div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ---------------- COIN FULLSCREEN ----------------

  if (mode === "coin") {
    return (
      <main className="fixed inset-0 z-50 bg-[#05070b] text-white overflow-hidden">
        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 py-4 md:px-8">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <button
              onClick={() => setMode("home")}
              className="
                shrink-0 w-11 h-11 rounded-full
                bg-white/10 border border-white/10
                text-white text-xl
                hover:bg-white/15
              "
            >
              ←
            </button>

            {/* LONG EDITABLE BOX */}
            <div
              className="
                flex-1 h-12 rounded-2xl
                bg-white/[0.07]
                border border-white/10
                flex items-center gap-2 px-3
              "
            >
              <input
                value={headsName}
                onChange={(e) => setHeadsName(e.target.value)}
                disabled={coinFlipping}
                placeholder="Heads / Team 1"
                className="
                  min-w-0 flex-1 bg-transparent outline-none
                  text-center text-sm md:text-base font-bold
                  placeholder:text-zinc-600
                "
              />

              <div className="text-zinc-600 font-bold">VS</div>

              <input
                value={tailsName}
                onChange={(e) => setTailsName(e.target.value)}
                disabled={coinFlipping}
                placeholder="Tails / Team 2"
                className="
                  min-w-0 flex-1 bg-transparent outline-none
                  text-center text-sm md:text-base font-bold
                  placeholder:text-zinc-600
                "
              />
            </div>
          </div>
        </div>

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center px-5">
          <div className="flex flex-col items-center">
            <button
              onClick={flipCoin}
              disabled={coinFlipping}
              aria-label="Flip coin"
              className="relative group"
            >
              {/* Outer glow */}
              <div
                className={`
                  absolute inset-[-30px] rounded-full
                  bg-yellow-400/10 blur-3xl
                  ${coinFlipping ? "opacity-100" : "opacity-50"}
                `}
              />

              {/* Coin */}
              <div
                className={`
                  relative
                  w-64 h-64
                  sm:w-72 sm:h-72
                  md:w-96 md:h-96
                  rounded-full
                  bg-gradient-to-br
                  from-yellow-200 via-yellow-400 to-yellow-700
                  border-[10px] md:border-[14px]
                  border-yellow-700
                  shadow-[0_35px_120px_rgba(250,204,21,.35)]
                  ${coinFlipping ? "coin-flipping" : ""}
                `}
              >
                {/* Blank coin */}
                <div
                  className="
                    absolute inset-[8%]
                    rounded-full
                    border-2 border-yellow-100/50
                    shadow-[inset_0_0_30px_rgba(0,0,0,.18)]
                  "
                />

                <div
                  className="
                    absolute inset-[14%]
                    rounded-full
                    border border-yellow-100/20
                  "
                />
              </div>
            </button>

            {!coinFlipping && (
              <p className="mt-8 text-zinc-500 text-sm">
                Tap the coin to flip
              </p>
            )}

            {coinFlipping && (
              <p className="mt-8 text-yellow-400 font-bold text-lg animate-pulse">
                Flipping...
              </p>
            )}

            {!coinFlipping && (
              <div className="mt-4 text-center">
                <p className="text-3xl md:text-4xl font-black">
                  {coinSide === "Heads" ? headsName || "Heads" : tailsName || "Tails"}
                </p>

                <p className="text-zinc-500 text-sm mt-1">
                  Result
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ---------------- DICE FULLSCREEN ----------------

  return (
    <main className="fixed inset-0 z-50 bg-[#05070b] text-white overflow-hidden">
      {/* Top */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button
            onClick={() => setMode("home")}
            className="
              shrink-0 w-11 h-11 rounded-full
              bg-white/10 border border-white/10
              text-white text-xl
              hover:bg-white/15
            "
          >
            ←
          </button>

          {/* PLAYER SELECTOR */}
          <div
            className="
              flex-1 h-12 rounded-2xl
              bg-white/[0.07]
              border border-white/10
              p-1.5 flex gap-1.5
              overflow-x-auto
            "
          >
            {Array.from({ length: 6 }, (_, i) => i + 1).map((player) => (
              <button
                key={player}
                onClick={() => changePlayers(player)}
                className={`
                  min-w-[72px] flex-1 rounded-xl
                  text-xs md:text-sm font-black
                  transition
                  ${
                    playerCount === player
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:text-white"
                  }
                `}
              >
                Player {player}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center Dice */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pt-16 pb-10">
        <div className="w-full max-w-6xl flex items-center justify-center">
          {playerCount <= 3 ? (
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {diceValues.map((value, i) => (
                <button
                  key={i}
                  onClick={rollDice}
                  disabled={rolling}
                  className={`
                    transition-transform
                    ${rolling ? "dice-shake" : "hover:scale-105"}
                  `}
                >
                  <DiceFace
                    value={value}
                    colorIndex={i}
                    large
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
              {diceValues.map((value, i) => (
                <button
                  key={i}
                  onClick={rollDice}
                  disabled={rolling}
                  className={`
                    transition-transform
                    ${rolling ? "dice-shake" : "hover:scale-105"}
                  `}
                >
                  <DiceFace
                    value={value}
                    colorIndex={i}
                    large
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom button only — no result text */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4">
        <button
          onClick={rollDice}
          disabled={rolling}
          className="
            min-w-[180px]
            px-8 py-4
            rounded-2xl
            bg-white text-black
            font-black
            text-base
            shadow-xl
            hover:bg-zinc-200
            active:scale-95
            disabled:opacity-50
          "
        >
          {rolling ? "Rolling..." : "ROLL DICE"}
        </button>
      </div>
    </main>
  );
}
