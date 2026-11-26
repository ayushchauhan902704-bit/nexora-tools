"use client";
import { useState } from "react";
import confetti from "canvas-confetti";

const PLAYER_COLORS = ["#facc15", "#22c55e", "#3b82f6", "#ef4444", "#a855f7", "#f97316"];

function RealDice({ value, color, rolling }: { value: number; color: string; rolling: boolean }) {
  const pips: Record<number, number[]> = {
    1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9],
  };
  return (
    <div className={`real-dice ${rolling ? "dice-fly" : ""}`} style={{ background: `linear-gradient(145deg, ${color}, ${color}cc)` }}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={`pip ${pips[value]?.includes(i + 1) ? "show" : ""}`} />
      ))}
      <span className="dice-shine" />
    </div>
  );
}

export default function CoinFlipClient() {
  const [view, setView] = useState<"home" | "coin" | "dice">("home");

  // COIN - same as before, perfect hai
  const [headLabel, setHeadLabel] = useState("Heads");
  const [tailLabel, setTailLabel] = useState("Tails");
  const [coinResult, setCoinResult] = useState<"H" | "T" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [flyKey, setFlyKey] = useState(0);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);

  // DICE - ✅ NAYA
  const [howMany, setHowMany] = useState("1"); // pehle 1 hi hoga
  const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6"]);
  const [diceVal, setDiceVal] = useState(6);
  const [rolling, setRolling] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);

  const playerCount = Math.max(1, Math.min(6, parseInt(howMany) || 1));

  const flipCoin = () => {
    if (flipping) return;
    setFlipping(true);
    setCoinResult(null);
    setFlyKey((k) => k + 1);
    const isHead = Math.random() > 0.5;
    setTimeout(() => {
      setCoinResult(isHead ? "H" : "T");
      setFlipping(false);
      if (isHead) setHeadsCount((h) => h + 1);
      else setTailsCount((t) => t + 1);
      confetti({ particleCount: 180, spread: 100, origin: { y: 0.5 }, colors: ["#facc15", "#22c55e", "#ef4444", "#3b82f6"] });
      try { navigator.vibrate?.([80, 40, 80]); } catch {}
    }, 1600);
  };

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    // 1 player ho to bas 1 baar, warna har player ki baari
    let playerIdx = 0;
    const doOnePlayer = () => {
      setCurrentPlayer(playerIdx);
      let c = 0;
      const iv = setInterval(() => {
        setDiceVal(Math.floor(Math.random() * 6) + 1);
        c++;
        if (c > 10) {
          clearInterval(iv);
          setDiceVal(Math.floor(Math.random() * 6) + 1);
          try { navigator.vibrate?.(50); } catch {}
          playerIdx++;
          if (playerIdx < playerCount) {
            setTimeout(doOnePlayer, 500);
          } else {
            setTimeout(() => setRolling(false), 200);
          }
        }
      }, 90);
    };
    doOnePlayer();
  };

  // ============ HOME ============
  if (view === "home") {
    return (
      <main className="page">
        <style jsx>{`${css}`}</style>
        <div className="wrap">
          <header className="top"><div className="logo">thenexoratools<span>.com</span></div><div className="topBest">🪙 Coin + 🎲 Dice</div></header>
          <section className="hero">
            <div className="tag">🪙 FREE • NO SIGN UP • TOSS + DICE</div>
            <h1>Coin Flip <span>& Dice Roller</span></h1>
            <p className="sub">Kisko touch karna hai? Coin ya Dice - tap karo, andar game khulega.</p>
          </section>
          <div className="homeGrid">
            <div className="homeCard" onClick={() => setView("coin")}>
              <div className="homeCoin">
                <div className="homeCoinInner"><span>H</span><small>HEADS</small></div>
                <div className="homeCoinInner back"><span>T</span><small>TAILS</small></div>
              </div>
              <h2>🪙 Coin Flip</h2>
              <p>Toss ke liye - Cricket, Team, Decision</p>
              <button className="openBtn">OPEN COIN →</button>
            </div>
            <div className="homeCard" onClick={() => setView("dice")}>
              <div className="homeDice">
                <span className="d-pip" /><span className="d-pip" /><span className="d-pip" />
                <span className="d-pip" /><span className="d-pip" /><span className="d-pip" />
              </div>
              <h2>🎲 Dice Roller</h2>
              <p>Ludo / Board Game - 1 se 6 Player tak</p>
              <button className="openBtn dark">OPEN DICE →</button>
            </div>
          </div>
          <section className="content">
            <h2>Coin Flip & Dice Roller</h2>
            <p>Coin pe tap karo to toss hoga, Dice pe tap karo to roll hoga. Dono ekdum real jaisa feel denge.</p>
          </section>
        </div>
      </main>
    );
  }

  // ============ COIN PAGE ============
  if (view === "coin") {
    return (
      <main className="page">
        <style jsx>{`${css}`}</style>
        <div className="wrap">
          <button className="backBtn" onClick={() => setView("home")}>← Back</button>
          <header className="top"><div className="logo">thenexoratools<span>.com</span></div><div className="topBest">🪙 Coin Flip</div></header>
          <div className="nameBar">
            <input value={headLabel} onChange={(e) => setHeadLabel(e.target.value)} placeholder="Heads - Apna naam / Team" maxLength={14} />
            <span>VS</span>
            <input value={tailLabel} onChange={(e) => setTailLabel(e.target.value)} placeholder="Tails - Dusra naam / Team" maxLength={14} />
          </div>
          <div className="bigStage" onClick={flipCoin}>
            <div className="coin-scene">
              <div key={flyKey} className={`big-coin ${flipping ? "coin-fly" : ""}`}>
                <div className="coin-face front">
                  <span className="coin-letter">{coinResult ? (coinResult === "H" ? "H" : "T") : "H"}</span>
                  <small>{coinResult === "T" ? tailLabel : headLabel}</small>
                  <i className="coin-ring" />
                </div>
              </div>
            </div>
            <p className="stageText">{flipping ? "Coin udd raha hai... 🪙" : coinResult ? `🏆 ${coinResult === "H" ? headLabel : tailLabel} Jeeta!` : "Coin ko touch karo"}</p>
            <small className="stageSub">{flipping ? "" : "Tap karke toss karo"}</small>
          </div>
          <button className="bigBtn green" onClick={flipCoin} disabled={flipping}>{flipping ? "FLIPPING... 🪙" : "FLIP COIN 🚀"}</button>
          <div className="stats">
            <div className="stat">{headLabel || "Heads"}<b>{headsCount}</b></div>
            <div className="stat">{tailLabel || "Tails"}<b>{tailsCount}</b></div>
            <div className="stat">Total<b>{headsCount + tailsCount}</b></div>
          </div>
          {coinResult && !flipping && <div className="winnerLine">🏆 Winner: {coinResult === "H" ? headLabel : tailLabel}</div>}
        </div>
      </main>
    );
  }

  // ============ DICE PAGE - ✅ NAYA CLEAN ============
  return (
    <main className="page">
      <style jsx>{`${css}`}</style>
      <div className="wrap">
        <button className="backBtn" onClick={() => setView("home")}>← Back</button>
        <header className="top"><div className="logo">thenexoratools<span>.com</span></div><div className="topBest">🎲 Dice Roller</div></header>

        {/* ✅ Upar - How many players? Log khud likhenge */}
        <div className="howManyBox">
          <label>How many players?</label>
          <input
            type="number" min={1} max={6} value={howMany}
            onChange={(e) => {
              let v = e.target.value;
              if (v === "") { setHowMany(""); return; }
              let n = parseInt(v);
              if (n > 6) n = 6;
              if (n < 1) n = 1;
              setHowMany(String(n));
            }}
            placeholder="1"
          />
          <span>/ 6</span>
        </div>

        {/* Player ke naam - sirf jitne player hai utne hi dikhenge */}
        {playerCount > 1 && (
          <div className="playerNames">
            {Array.from({ length: playerCount }, (_, i) => (
              <input key={i} value={playerNames[i]} onChange={(e) => { const a = [...playerNames]; a[i] = e.target.value; setPlayerNames(a); }} style={{ borderColor: PLAYER_COLORS[i] }} placeholder={`Player ${i + 1}`} maxLength={10} />
            ))}
          </div>
        )}

        {/* ✅ Beech me SIRF DICE - neeche kuch likha nahi */}
        <div className="bigStage diceStage" onClick={rollDice}>
          <RealDice
            value={diceVal}
            // ✅ 1 player ho to color hamesha same (pehla wala), warna har player ka alag
            color={playerCount === 1 ? PLAYER_COLORS[0] : PLAYER_COLORS[currentPlayer]}
            rolling={rolling}
          />
        </div>

        <button className="bigBtn black" onClick={rollDice} disabled={rolling}>{rolling ? "ROLLING... 🎲" : "ROLL DICE 🎲"}</button>
        {/* ✅ Winner / Number wali line hata di - bilkul clean */}
      </div>
    </main>
  );
}

const css = `
.page { min-height: 100vh; background: #fff; color: #0f172a; padding: 10px 12px 30px; font-family: 'Plus Jakarta Sans', Inter, sans-serif; }
.wrap { max-width: 900px; margin: auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.logo { font-size: 16px; font-weight: 800; }
.logo span { color: #16a34a; }
.topBest { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 999px; padding: 5px 10px; font-size: 11px; font-weight: 700; }
.hero { text-align: center; margin-bottom: 12px; }
.tag { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 10px; font-weight: 800; margin-bottom: 6px; }
h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.8px; }
h1 span { color: #16a34a; }
.sub { color: #64748b; font-size: 12px; margin-top: 5px; }
.homeGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.homeCard { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 20px 14px; text-align: center; cursor: pointer; box-shadow: 0 10px 30px rgba(15,23,42,0.06); }
.homeCard:active { transform: scale(0.98); }
.homeCard h2 { font-size: 18px; margin: 14px 0 4px; }
.homeCard p { color: #64748b; font-size: 12px; margin: 0; }
.openBtn { margin-top: 14px; border: 0; background: #16a34a; color: #fff; border-radius: 999px; padding: 11px 18px; font-weight: 800; font-size: 13px; width: 100%; cursor: pointer; }
.openBtn.dark { background: #0f172a; }
.homeCoin { width: 130px; height: 130px; margin: 10px auto; position: relative; }
.homeCoinInner { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fde047, #eab308 55%, #a16207); border: 5px solid #ca8a04; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 12px 25px rgba(0,0,0,0.25), inset 0 -6px 12px rgba(0,0,0,0.2); }
.homeCoinInner span { font-size: 48px; font-weight: 900; color: #422006; line-height: 1; }
.homeCoinInner small { font-size: 9px; font-weight: 800; letter-spacing: 2px; color: #713f12; }
.homeCoinInner.back { transform: translateX(18px) scale(0.9); background: radial-gradient(circle at 35% 30%, #e2e8f0, #94a3b8); border-color: #64748b; z-index: -1; }
.homeCoinInner.back span, .homeCoinInner.back small { color: #0f172a; }
.homeDice { width: 130px; height: 130px; margin: 10px auto; border-radius: 26px; background: linear-gradient(145deg, #ef4444, #b91c1c); display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); padding: 22px; gap: 6px; box-shadow: 0 12px 25px rgba(0,0,0,0.25), inset 0 -8px 14px rgba(0,0,0,0.25); }
.d-pip { width: 22px; height: 22px; background: #fff; border-radius: 50%; place-self: center; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); }
.content { margin-top: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; }
.content h2 { font-size: 17px; margin: 0 0 7px; }
.content p { color: #64748b; font-size: 12px; line-height: 1.7; margin: 0; }
.backBtn { border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 7px 14px; font-size: 12px; font-weight: 700; cursor: pointer; margin-bottom: 10px; }
.nameBar { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
.nameBar input { flex: 1; min-width: 0; border: 1.5px solid #e2e8f0; border-radius: 999px; padding: 12px; font-size: 13px; font-weight: 800; text-align: center; outline: none; background: #f8fafc; }
.nameBar input:focus { border-color: #16a34a; background: #fff; }
.nameBar span { font-weight: 800; color: #94a3b8; font-size: 12px; }
.bigStage { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 22px 14px; text-align: center; min-height: 380px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 10px 30px rgba(15,23,42,0.06); overflow: hidden; }
.diceStage { min-height: 340px; }
.stageText { font-size: 18px; font-weight: 800; margin: 18px 0 0; }
.stageSub { color: #94a3b8; font-size: 11px; font-weight: 600; }
.coin-scene { perspective: 1200px; }
.big-coin { width: 230px; height: 230px; }
.coin-face { width: 100%; height: 100%; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fde047, #eab308 55%, #a16207); border: 8px solid #ca8a04; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.3), inset 0 -10px 18px rgba(0,0,0,0.25); }
.coin-letter { font-size: 100px; font-weight: 900; color: #422006; line-height: 0.9; }
.coin-face small { font-size: 11px; font-weight: 800; color: #713f12; margin-top: 6px; max-width: 170px; word-break: break-word; }
.coin-ring { position: absolute; inset: 14px; border: 2px dashed rgba(66,32,6,0.4); border-radius: 50%; }
.coin-fly { animation: coinFly 1.6s cubic-bezier(0.3, 0.7, 0.3, 1) forwards; }
@keyframes coinFly { 0% { transform: translateY(0) rotateY(0) scale(1); } 25% { transform: translateY(-140px) rotateY(720deg) scale(0.85); } 50% { transform: translateY(-180px) rotateY(1440deg) scale(0.8); } 75% { transform: translateY(-60px) rotateY(2160deg) scale(0.95); } 100% { transform: translateY(0) rotateY(2520deg) scale(1); } }
.bigBtn { width: 100%; border: 0; border-radius: 999px; padding: 14px; font-size: 15px; font-weight: 800; cursor: pointer; margin-top: 14px; color: #fff; }
.bigBtn.green { background: #16a34a; box-shadow: 0 8px 24px rgba(22,163,74,0.3); }
.bigBtn.black { background: #0f172a; }
.bigBtn:disabled { opacity: .6; }
.stats { display: flex; gap: 8px; margin-top: 10px; }
.stat { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px; text-align: center; font-size: 11px; font-weight: 700; }
.stat b { display: block; font-size: 16px; }
.winnerLine { margin-top: 10px; background: #f0fdf4; border: 1.5px solid #16a34a; border-radius: 12px; padding: 10px; text-align: center; font-weight: 800; font-size: 14px; }
.howManyBox { display: flex; align-items: center; gap: 10px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 999px; padding: 10px 16px; margin-bottom: 10px; }
.howManyBox label { flex: 1; font-size: 13px; font-weight: 800; }
.howManyBox input { width: 70px; border: 1.5px solid #e2e8f0; border-radius: 999px; padding: 9px; font-size: 16px; font-weight: 800; text-align: center; outline: none; background: #fff; }
.howManyBox input:focus { border-color: #0f172a; }
.howManyBox span { font-size: 12px; font-weight: 700; color: #94a3b8; }
.playerNames { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 10px; }
.playerNames input { min-width: 90px; flex: 1; border: 1.5px solid #e2e8f0; border-radius: 999px; padding: 9px 10px; font-size: 12px; font-weight: 700; text-align: center; outline: none; }
.real-dice { width: 210px; height: 210px; border-radius: 34px; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); padding: 32px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.3), inset 0 -10px 18px rgba(0,0,0,0.25); }
.pip { width: 30px; height: 30px; background: #fff; border-radius: 50%; opacity: 0; place-self: center; box-shadow: inset 0 3px 5px rgba(0,0,0,0.35); }
.pip.show { opacity: 1; }
.dice-shine { position: absolute; top: 12px; left: 18px; right: 18px; height: 30px; background: rgba(255,255,255,0.35); border-radius: 999px; filter: blur(6px); }
/* ✅ DICE AB SAHI SE FLY KAREGA - Upar, Ghumega, Neeche Girega */
.dice-fly { animation: diceFlyGood 1.15s cubic-bezier(0.35, 0.7, 0.35, 1) infinite; }
@keyframes diceFlyGood {
  0% { transform: translateY(0) rotate(0deg) scale(1); }
  20% { transform: translateY(-90px) rotate(180deg) scale(0.92); }
  40% { transform: translateY(-160px) rotate(360deg) scale(0.88); }
  60% { transform: translateY(-160px) rotate(540deg) scale(0.88); }
  80% { transform: translateY(-50px) rotate(700deg) scale(0.96); }
  100% { transform: translateY(0) rotate(720deg) scale(1); }
}
@media (max-width: 650px) { .homeGrid { grid-template-columns: 1fr; } .big-coin { width: 200px; height: 200px; } .coin-letter { font-size: 80px; } .real-dice { width: 180px; height: 180px; padding: 26px; } }
`;
