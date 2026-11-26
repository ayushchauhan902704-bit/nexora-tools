"use client";
import { useState } from "react";

export default function CoinFlipClient() {
  const [tab, setTab] = useState<"coin" | "dice">("coin");
  const [coin, setCoin] = useState<"Heads" | "Tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [dice, setDice] = useState<number[]>([6, 6]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [heads, setHeads] = useState(0);
  const [tails, setTails] = useState(0);

  const flipCoin = () => {
    if (flipping) return;
    setFlipping(true);
    setCoin(null);
    let count = 0;
    const interval = setInterval(() => {
      setCoin(Math.random() > 0.5 ? "Heads" : "Tails");
      count++;
      if (count > 10) {
        clearInterval(interval);
        const final = Math.random() > 0.5 ? "Heads" : "Tails";
        setCoin(final);
        setFlipping(false);
        if (final === "Heads") setHeads((h) => h + 1);
        else setTails((t) => t + 1);
        setHistory((h) => [`🪙 ${final}`, ...h].slice(0, 12));
      }
    }, 100);
  };

  const rollDice = (num: number) => {
    if (rolling) return;
    setRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDice(Array.from({ length: num }, () => Math.floor(Math.random() * 6) + 1));
      count++;
      if (count > 8) {
        clearInterval(interval);
        const final = Array.from({ length: num }, () => Math.floor(Math.random() * 6) + 1);
        setDice(final);
        setRolling(false);
        const total = final.reduce((a, b) => a + b, 0);
        setHistory((h) => [`🎲 ${final.join(" + ")} = ${total}`, ...h].slice(0, 12));
      }
    }, 90);
  };

  const totalFlips = heads + tails;
  const headsPct = totalFlips ? Math.round((heads / totalFlips) * 100) : 50;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black">🪙 Coin Flip <span className="text-yellow-400">&</span> 🎲 Dice Roller</h1>
          <p className="text-zinc-400 mt-2">Decision nahi ho raha? Kismat pe chhod do!</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 max-w-md mx-auto mb-6">
          <button onClick={() => setTab("coin")} className={`flex-1 py-3 rounded-xl font-bold ${tab === "coin" ? "bg-yellow-400 text-black" : "text-zinc-400"}`}>🪙 Coin Flip</button>
          <button onClick={() => setTab("dice")} className={`flex-1 py-3 rounded-xl font-bold ${tab === "dice" ? "bg-yellow-400 text-black" : "text-zinc-400"}`}>🎲 Dice Roller</button>
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-6">
          {/* Main */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[380px]">
            {tab === "coin" ? (
              <>
                <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center text-6xl md:text-7xl font-black border-8 shadow-2xl transition-all ${flipping ? "animate-spin scale-110" : ""} ${coin === "Heads" ? "bg-yellow-400 border-yellow-600 text-black" : coin === "Tails" ? "bg-zinc-200 border-zinc-400 text-black" : "bg-yellow-400 border-yellow-600 text-black"}`}>
                  {coin === "Tails" ? "T" : "H"}
                </div>
                <p className="mt-5 text-3xl font-black">{flipping ? "Flipping..." : coin ? coin : "Flip Karo!"}</p>
                <p className="text-zinc-500 text-sm mt-1">{coin === "Heads" ? "Heads aaya! Jeet gaye 🎉" : coin === "Tails" ? "Tails aaya!" : "Heads ya Tails?"}</p>
                <button onClick={flipCoin} disabled={flipping} className="mt-6 w-full max-w-sm py-4 rounded-2xl bg-yellow-400 text-black font-black text-xl hover:bg-yellow-300 disabled:opacity-50 active:scale-[0.98]">
                  {flipping ? "Flipping... 🪙" : "FLIP COIN 🚀"}
                </button>
                {totalFlips > 0 && (
                  <div className="w-full max-w-sm mt-6">
                    <div className="flex justify-between text-sm mb-2"><span>Heads: {heads}</span><span>Tails: {tails}</span></div>
                    <div className="h-3 bg-zinc-800 rounded-full overflow-hidden flex"><div className="bg-yellow-400" style={{ width: `${headsPct}%` }} /></div>
                    <p className="text-center text-xs text-zinc-500 mt-2">Total Flips: {totalFlips}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex gap-4">
                  {dice.map((d, i) => (
                    <div key={i} className={`w-24 h-24 md:w-28 md:h-28 bg-white text-black rounded-2xl flex items-center justify-center text-6xl font-black shadow-2xl ${rolling ? "animate-bounce" : ""}`}>
                      {d === 1 ? "•" : d === 2 ? "••" : d === 3 ? "•••" : d === 4 ? "••••" : d === 5 ? "•••••" : "••••••"}
                      <span className="sr-only">{d}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-3xl font-black">Total: {dice.reduce((a, b) => a + b, 0)}</p>
                <p className="text-zinc-500 text-sm">{dice.length} Dice - {dice.join(" + ")}</p>
                <div className="flex gap-3 w-full max-w-sm mt-6">
                  <button onClick={() => rollDice(1)} disabled={rolling} className="flex-1 py-4 rounded-2xl bg-white text-black font-black hover:bg-zinc-200 disabled:opacity-50">1 DICE</button>
                  <button onClick={() => rollDice(2)} disabled={rolling} className="flex-1 py-4 rounded-2xl bg-yellow-400 text-black font-black hover:bg-yellow-300 disabled:opacity-50">2 DICE</button>
                  <button onClick={() => rollDice(3)} disabled={rolling} className="flex-1 py-4 rounded-2xl bg-white text-black font-black hover:bg-zinc-200 disabled:opacity-50">3 DICE</button>
                </div>
                <button onClick={() => rollDice(dice.length)} disabled={rolling} className="mt-3 w-full max-w-sm py-3 rounded-2xl bg-zinc-800 font-bold hover:bg-zinc-700 disabled:opacity-50">
                  {rolling ? "Rolling... 🎲" : "ROLL AGAIN"}
                </button>
              </>
            )}
          </div>

          {/* History */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 h-fit">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">History</h3>
              <button onClick={() => { setHistory([]); setHeads(0); setTails(0); }} className="text-xs bg-zinc-800 px-3 py-1.5 rounded-lg">Clear</button>
            </div>
            <div className="space-y-2 max-h-[320px] overflow-auto">
              {history.map((h, i) => (
                <div key={i} className="bg-zinc-800/70 px-3 py-2.5 rounded-xl text-sm">{h}</div>
              ))}
              {history.length === 0 && <p className="text-zinc-500 text-sm text-center py-8">Abhi kuch nahi hua<br/>Flip ya Roll karo</p>}
            </div>
            <div className="mt-5 bg-zinc-800/50 rounded-2xl p-4 text-sm text-zinc-300">
              <p className="font-bold text-white mb-1">💡 Kis kaam aayega?</p>
              <p>• Cricket me toss ke liye</p>
              <p>• Ludo / Board game ke liye</p>
              <p>• "Aaj kaun jeetega?" decide karne ke liye</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
