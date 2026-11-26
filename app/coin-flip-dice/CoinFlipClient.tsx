"use client";
import { useState } from "react";

const PLAYER_COLORS = ["#facc15", "#22c55e", "#3b82f6", "#ef4444", "#a855f7", "#f97316"];

function DiceFace({ value, color, rolling }: { value: number; color: string; rolling: boolean }) {
  const pips: Record<number, number[]> = {
    1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9],
  };
  return (
    <div className={`dice-face ${rolling ? "rolling" : ""}`} style={{ background: color }}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={`pip ${pips[value]?.includes(i + 1) ? "show" : ""}`} />
      ))}
    </div>
  );
}

export default function CoinFlipClient() {
  const [headLabel, setHeadLabel] = useState("Heads");
  const [tailLabel, setTailLabel] = useState("Tails");
  const [coin, setCoin] = useState<"Heads" | "Tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [flipDeg, setFlipDeg] = useState(0);

  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6"]);
  const [diceVals, setDiceVals] = useState<number[]>([6, 6]);
  const [rolling, setRolling] = useState(false);
  const [diceWinner, setDiceWinner] = useState<string | null>(null);

  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);

  const flipCoin = () => {
    if (flipping) return;
    setFlipping(true);
    setCoin(null);
    const finalIsHead = Math.random() > 0.5;
    // 5 sec ghumega - 5 full flip = 1800 deg + final side
    const extra = 1800 + (finalIsHead ? 0 : 180);
    setFlipDeg((d) => d + extra);
    setTimeout(() => {
      const final = finalIsHead ? "Heads" : "Tails";
      setCoin(final);
      setFlipping(false);
      if (final === "Heads") setHeadsCount((h) => h + 1);
      else setTailsCount((t) => t + 1);
      if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    }, 5000);
  };

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    setDiceWinner(null);
    let c = 0;
    const iv = setInterval(() => {
      setDiceVals(Array.from({ length: playerCount }, () => Math.floor(Math.random() * 6) + 1));
      c++;
      if (c > 12) {
        clearInterval(iv);
        const final = Array.from({ length: playerCount }, () => Math.floor(Math.random() * 6) + 1);
        setDiceVals(final);
        setRolling(false);
        const max = Math.max(...final);
        const winIdx = final.indexOf(max);
        setDiceWinner(playerNames[winIdx]);
        if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
      }
    }, 100);
  };

  return (
    <main className="page">
      <style jsx>{`
        .page { min-height: 100vh; background: #fff; color: #0f172a; padding: 10px 12px 30px; font-family: 'Plus Jakarta Sans', Inter, sans-serif; }
        .wrap { max-width: 1100px; margin: auto; }
        .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .logo { font-size: 16px; font-weight: 800; }
        .logo span { color: #16a34a; }
        .topBest { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 999px; padding: 5px 10px; font-size: 11px; font-weight: 700; }
        .hero { text-align: center; margin-bottom: 12px; }
        .tag { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 10px; font-weight: 800; margin-bottom: 6px; }
        h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.8px; }
        h1 span { color: #16a34a; }
        .sub { color: #64748b; font-size: 12px; margin-top: 5px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 14px; box-shadow: 0 10px 30px rgba(15,23,42,0.06); display: flex; flex-direction: column; }
        .cardTitle { text-align: center; font-size: 16px; font-weight: 800; margin-bottom: 10px; }
        /* Upar lambi patti */
        .topBar { display: flex; gap: 8px; margin-bottom: 14px; }
        .topBar input { flex: 1; min-width: 0; border: 1.5px solid #e2e8f0; border-radius: 999px; padding: 10px 12px; font-size: 13px; font-weight: 800; outline: none; text-align: center; background: #f8fafc; color: #0f172a; }
        .topBar input:focus { border-color: #16a34a; background: #fff; }
        .vs { display: flex; align-items: center; font-weight: 800; color: #94a3b8; font-size: 12px; }
        .playerBtns { display: flex; gap: 5px; justify-content: center; flex-wrap: wrap; margin-bottom: 12px; }
        .pBtn { border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 999px; padding: 6px 10px; font-size: 11px; font-weight: 700; cursor: pointer; }
        .pBtn.on { background: #0f172a; color: #fff; border-color: #0f172a; }
        .playerInputs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 12px; }
        .playerInputs input { min-width: 90px; flex: 1; border: 1.5px solid #e2e8f0; border-radius: 999px; padding: 8px 10px; font-size: 12px; font-weight: 700; outline: none; text-align: center; }
        /* Beech me bada Coin / Dice - Clean */
        .stage { flex: 1; min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; user-select: none; }
        .stage p { margin-top: 14px; font-weight: 800; font-size: 18px; }
        .stage small { color: #94a3b8; font-size: 11px; font-weight: 600; margin-top: 4px; }
        .coin-scene { perspective: 1000px; }
        .coin3d { width: 190px; height: 190px; position: relative; transform-style: preserve-3d; transition: transform 5s cubic-bezier(0.15, 0.8, 0.1, 1); }
        .coinFace { position: absolute; inset: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; text-align: center; padding: 20px; backface-visibility: hidden; border: 6px solid rgba(0,0,0,0.15); box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
        .coinFront { background: linear-gradient(135deg, #facc15, #eab308); color: #422006; }
        .coinBack { background: linear-gradient(135deg, #e2e8f0, #cbd5e1); color: #0f172a; transform: rotateY(180deg); }
        .diceRow { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        .dice-face { width: 110px; height: 110px; border-radius: 22px; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); padding: 18px; box-shadow: 0 12px 25px rgba(0,0,0,0.18); }
        .dice-face.rolling { animation: shake 0.1s infinite; }
        @keyframes shake { 0%{ transform: rotate(-4deg) translateY(0);} 50%{ transform: rotate(4deg) translateY(-6px);} 100%{ transform: rotate(-4deg) translateY(0);} }
        .pip { width: 16px; height: 16px; border-radius: 50%; background: #fff; opacity: 0; place-self: center; box-shadow: inset 0 2px 3px rgba(0,0,0,0.3); }
        .pip.show { opacity: 1; }
        .bigBtn { width: 100%; border: 0; border-radius: 999px; padding: 14px; font-size: 15px; font-weight: 800; cursor: pointer; margin-top: 14px; color: #fff; }
        .bigBtn:disabled { opacity: .6; }
        .coinBtn { background: #16a34a; box-shadow: 0 8px 24px rgba(22,163,74,0.3); }
        .diceBtn { background: #0f172a; }
        .stats { display: flex; gap: 8px; margin-top: 10px; }
        .stat { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px; text-align: center; font-size: 11px; font-weight: 700; }
        .stat b { display: block; font-size: 16px; }
        .winnerLine { margin-top: 10px; background: #f0fdf4; border: 1.5px solid #16a34a; border-radius: 12px; padding: 10px; text-align: center; font-weight: 800; font-size: 14px; }
        .content { margin-top: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; }
        .content h2 { font-size: 17px; margin: 0 0 7px; }
        .content p { color: #64748b; font-size: 12px; line-height: 1.7; margin: 0; }
        @media (max-width: 750px) { .grid { grid-template-columns: 1fr; } .coin3d { width: 160px; height: 160px; } .dice-face { width: 88px; height: 88px; padding: 14px; } .stage { min-height: 260px; } }
      `}</style>

      <div className="wrap">
        <header className="top">
          <div className="logo">thenexoratools<span>.com</span></div>
          <div className="topBest">🪙 Coin + 🎲 Dice</div>
        </header>
        <section className="hero">
          <div className="tag">🪙 FREE • NO SIGN UP • TOSS + DICE</div>
          <h1>Coin Flip <span>& Dice Roller</span></h1>
          <p className="sub">Left me Coin, Right me Dice - Coin pe tap karo toss hoga, Dice pe tap karo roll hoga.</p>
        </section>

        <div className="grid">
          {/* LEFT - COIN */}
          <div className="card">
            <div className="cardTitle">🪙 Coin Flip - Toss</div>
            {/* Upar lambi patti - Heads / Tails editable */}
            <div className="topBar">
              <input value={headLabel} onChange={(e) => setHeadLabel(e.target.value)} placeholder="Heads" maxLength={12} />
              <span className="vs">VS</span>
              <input value={tailLabel} onChange={(e) => setTailLabel(e.target.value)} placeholder="Tails" maxLength={12} />
            </div>

            {/* Beech me bada Coin - Clean, kuch likha nahi extra */}
            <div className="stage" onClick={flipCoin}>
              <div className="coin-scene">
                <div className="coin3d" style={{ transform: `rotateY(${flipDeg}deg)` }}>
                  <div className="coinFace coinFront">{headLabel || "Heads"}</div>
                  <div className="coinFace coinBack">{tailLabel || "Tails"}</div>
                </div>
              </div>
              <p>{flipping ? "Flipping... 🪙" : coin ? (coin === "Heads" ? headLabel : tailLabel) : "Tap Coin to Flip"}</p>
              <small>{flipping ? "5 sec ghum raha hai..." : "Coin ko touch karo"}</small>
            </div>

            <button className="bigBtn coinBtn" onClick={flipCoin} disabled={flipping}>{flipping ? "Flipping... 🪙" : "FLIP COIN 🚀"}</button>
            <div className="stats">
              <div className="stat">{headLabel || "Heads"}<b>{headsCount}</b></div>
              <div className="stat">{tailLabel || "Tails"}<b>{tailsCount}</b></div>
              <div className="stat">Total<b>{headsCount + tailsCount}</b></div>
            </div>
            {coin && !flipping && <div className="winnerLine">🏆 Winner: {coin === "Heads" ? headLabel : tailLabel}</div>}
          </div>

          {/* RIGHT - DICE */}
          <div className="card">
            <div className="cardTitle">🎲 Dice Roller</div>
            {/* Upar lambi patti - Player 1-6 */}
            <div className="playerBtns">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button key={n} className={`pBtn ${playerCount === n ? "on" : ""}`} onClick={() => { setPlayerCount(n); setDiceVals(Array.from({ length: n }, () => 6)); setDiceWinner(null); }}>
                  {n} Player
                </button>
              ))}
            </div>
            <div className="playerInputs">
              {Array.from({ length: playerCount }, (_, i) => (
                <input key={i} value={playerNames[i]} onChange={(e) => { const a = [...playerNames]; a[i] = e.target.value; setPlayerNames(a); }} style={{ borderColor: PLAYER_COLORS[i] }} placeholder={`Player ${i + 1}`} maxLength={10} />
              ))}
            </div>

            {/* Beech me bada Dice - Clean, neeche kuch nahi */}
            <div className="stage" onClick={rollDice}>
              <div className="diceRow">
                {diceVals.slice(0, playerCount).map((v, i) => (
                  <DiceFace key={i} value={v} color={PLAYER_COLORS[i]} rolling={rolling} />
                ))}
              </div>
              <p>{rolling ? "Rolling... 🎲" : diceWinner ? `🏆 ${diceWinner} Jeeta!` : "Tap Dice to Roll"}</p>
              <small>{rolling ? "Dice ghum raha hai..." : "Dice ko touch karo"}</small>
            </div>

            <button className="bigBtn diceBtn" onClick={rollDice} disabled={rolling}>{rolling ? "Rolling... 🎲" : "ROLL DICE 🎲"}</button>
            {diceWinner && !rolling && <div className="winnerLine">🏆 Winner: {diceWinner} - {Math.max(...diceVals)} aaya!</div>}
          </div>
        </div>

        <section className="content">
          <h2>Coin Flip & Dice Roller - Free Online</h2>
          <p>Cricket me toss ke liye coin flip karo, apne team ka naam upar likh do. Ludo / Board game ke liye dice roll karo, 1 se 6 player tak khel sakte ho, sabke dice ka color alag hai.</p>
        </section>
      </div>
    </main>
  );
}
