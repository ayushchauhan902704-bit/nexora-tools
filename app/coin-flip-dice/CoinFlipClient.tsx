"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

const PLAYER_COLORS = ["#facc15", "#22c55e", "#3b82f6", "#ef4444", "#a855f7", "#f97316"];
type View = "home" | "coin" | "dice";

function RealDice({ value, color, rolling }: { value: number; color: string; rolling: boolean }) {
  const pips: Record<number, number[]> = {
    1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9],
  };
  return (
    <div className={`real-dice ${rolling ? "dice-fly" : ""}`}
      style={{ "--dice-color": color, background: `linear-gradient(145deg, ${color} 0%, ${color}dd 42%, ${color}99 100%)` } as React.CSSProperties}>
      <div className="dice-edge" />
      <div className="dice-top-glow" />
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={`pip ${pips[value]?.includes(i + 1) ? "show" : ""}`} />
      ))}
      <span className="dice-shine" />
      <span className="dice-reflection" />
    </div>
  );
}

export default function CoinFlipClient() {
  const [view, setView] = useState<View>("home");
  const [headLabel, setHeadLabel] = useState("Heads");
  const [tailLabel, setTailLabel] = useState("Tails");
  const [coinResult, setCoinResult] = useState<"H" | "T" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [flyKey, setFlyKey] = useState(0);
  const [showHand, setShowHand] = useState(false);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);

  const [howMany, setHowMany] = useState("1");
  const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6"]);
  const [diceVal, setDiceVal] = useState(6);
  const [rolling, setRolling] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceLand, setDiceLand] = useState({ x: 0, y: 0, r: 0 });

  const diceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const diceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coinHistoryRef = useRef<("H" | "T")[]>([]);
  const coinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playerCount = Math.max(1, Math.min(6, parseInt(howMany) || 1));

  useEffect(() => {
    return () => {
      if (diceIntervalRef.current) clearInterval(diceIntervalRef.current);
      if (diceTimeoutRef.current) clearTimeout(diceTimeoutRef.current);
      if (coinTimeoutRef.current) clearTimeout(coinTimeoutRef.current);
    };
  }, []);

  // ============ COIN - REAL TV TOSS 2.5s + NO 5x SAME ============
  const flipCoin = () => {
    if (flipping) return;
    setFlipping(true);
    setCoinResult(null);
    setFlyKey((k) => k + 1);
    setShowHand(true);
    setTimeout(() => setShowHand(false), 600);

    // Anti-streak: 4 baar same aaya to 5th baar opposite force
    let isHead = Math.random() > 0.5;
    const last = coinHistoryRef.current;
    if (last.length >= 4) {
      const last4 = last.slice(-4);
      if (last4.every((v) => v === "H")) isHead = false;
      if (last4.every((v) => v === "T")) isHead = true;
    }

    try { navigator.vibrate?.([45, 35, 45, 35, 80]); } catch {}

    coinTimeoutRef.current = setTimeout(() => {
      const res = isHead ? "H" : "T";
      coinHistoryRef.current = [...coinHistoryRef.current, res].slice(-5);
      setCoinResult(res);
      setFlipping(false);
      if (isHead) setHeadsCount((h) => h + 1);
      else setTailsCount((t) => t + 1);
      confetti({ particleCount: 120, spread: 90, startVelocity: 28, origin: { y: 0.55 }, colors: ["#e2e8f0", "#94a3b8", "#64748b", "#facc15", "#22c55e"] });
      try { navigator.vibrate?.([80, 40, 100]); } catch {}
    }, 2500);
  };

  // ============ DICE - REAL FLY 1.5s ============
  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    let playerIdx = 0;
    const doOnePlayer = () => {
      setCurrentPlayer(playerIdx);
      // Har baar alag jagah girega - real jaisa
      setDiceLand({ x: Math.floor(Math.random() * 60) - 30, y: Math.floor(Math.random() * 20) - 10, r: Math.floor(Math.random() * 360) });
      let count = 0;
      diceIntervalRef.current = setInterval(() => {
        setDiceVal(Math.floor(Math.random() * 6) + 1);
        count++;
        if (count >= 12) {
          if (diceIntervalRef.current) clearInterval(diceIntervalRef.current);
          setDiceVal(Math.floor(Math.random() * 6) + 1);
          try { navigator.vibrate?.([35, 25, 50]); } catch {}
          playerIdx++;
          if (playerIdx < playerCount) {
            diceTimeoutRef.current = setTimeout(doOnePlayer, 650);
          } else {
            diceTimeoutRef.current = setTimeout(() => {
              setRolling(false);
              try { navigator.vibrate?.([70, 30, 90]); } catch {}
            }, 300);
          }
        }
      }, 110); // 12 * 110 = ~1.3s + bounce = 1.5s total real feel
    };
    doOnePlayer();
  };

  if (view === "home") {
    return (
      <main className="page"><style jsx>{css}</style>
        <div className="wrap">
          <header className="top"><div className="logo">thenexoratools<span>.com</span></div><div className="topBest">🪙 Coin + 🎲 Dice</div></header>
          <section className="hero"><div className="tag">🪙 FREE • NO SIGN UP • TOSS + DICE</div><h1>Coin Flip <span>& Dice Roller</span></h1><p className="sub">Choose Coin Flip or Dice Roller and play instantly.</p></section>
          <div className="homeGrid">
            <div className="homeCard" onClick={() => setView("coin")}>
              <div className="homeCoin"><div className="homeCoinBack"><span>T</span><small>TAILS</small></div><div className="homeCoinFront"><span>H</span><small>HEADS</small></div></div>
              <h2>🪙 Coin Flip</h2><p>Toss a coin for cricket, teams, decisions and more.</p><button className="openBtn">OPEN COIN →</button>
            </div>
            <div className="homeCard" onClick={() => setView("dice")}>
              <div className="homeDicePreview"><div className="previewDice">{Array.from({ length: 9 }, (_, i) => <span key={i} />)}</div></div>
              <h2>🎲 Dice Roller</h2><p>Roll for Ludo, board games and up to 6 players.</p><button className="openBtn dark">OPEN DICE →</button>
            </div>
          </div>
          <section className="content"><h2>Coin Flip & Dice Roller</h2><p>Flip a virtual coin or roll a realistic dice instantly. Everything runs directly in your browser with no sign-up required.</p></section>
        </div>
      </main>
    );
  }

  if (view === "coin") {
    return (
      <main className="page"><style jsx>{css}</style>
        <div className="wrap">
          <button className="backBtn" onClick={() => setView("home")}>← Back</button>
          <header className="top"><div className="logo">thenexoratools<span>.com</span></div><div className="topBest">🪙 Coin Flip</div></header>
          <div className="nameBar">
            <input value={headLabel} onChange={(e) => setHeadLabel(e.target.value)} placeholder="Heads" maxLength={14} />
            <span>VS</span>
            <input value={tailLabel} onChange={(e) => setTailLabel(e.target.value)} placeholder="Tails" maxLength={14} />
          </div>
          <div className="bigStage coinStage" onClick={flipCoin}>
            <div className="coin-floor" />
            <div className="coinScene">
              <div key={flyKey} className={`coinWrapper ${flipping ? "coin-flying" : ""}`}>
                <div className="coin3d">
                  <div className="coinSide coinFront"><div className="coinInner"><span className="coinLetter">{coinResult === "T" ? "T" : "H"}</span><small>{coinResult === "T" ? tailLabel : headLabel}</small><i /></div></div>
                  <div className="coinSide coinBack"><div className="coinInner"><span className="coinLetter">T</span><small>{tailLabel}</small><i /></div></div>
                </div>
              </div>
              {showHand && <div className="toss-hand">🤚</div>}
            </div>
            <div className="coinShadow" />
            <p className="stageText">{flipping ? "Flipping..." : coinResult ? `🏆 ${coinResult === "H" ? headLabel : tailLabel} Wins!` : "Tap the coin to flip"}</p>
            <small className="stageSub">{flipping ? "Watch the coin fly and spin" : "Tap anywhere on the coin"}</small>
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

  return (
    <main className="page"><style jsx>{css}</style>
      <div className="wrap">
        <button className="backBtn" onClick={() => setView("home")}>← Back</button>
        <header className="top"><div className="logo">thenexoratools<span>.com</span></div><div className="topBest">🎲 Dice Roller</div></header>
        <div className="howManyBox">
          <label>How many players?</label>
          <input type="number" min={1} max={6} value={howMany} onChange={(e) => { let v = e.target.value; if (v === "") { setHowMany(""); return; } let n = parseInt(v); if (isNaN(n)) { setHowMany(""); return; } if (n > 6) n = 6; if (n < 1) n = 1; setHowMany(String(n)); }} placeholder="1" />
          <span>/ 6</span>
        </div>
        {playerCount > 1 && (
          <div className="playerNames">
            {Array.from({ length: playerCount }, (_, i) => (
              <input key={i} value={playerNames[i]} onChange={(e) => { const arr = [...playerNames]; arr[i] = e.target.value; setPlayerNames(arr); }} style={{ borderColor: PLAYER_COLORS[i] }} placeholder={`Player ${i + 1}`} maxLength={10} />
            ))}
          </div>
        )}
        <div className="bigStage diceStage" onClick={rollDice}>
          <div className="diceArena">
            <div className={`diceHolder ${rolling ? "diceHolderRolling" : ""}`} style={{ "--land-x": `${diceLand.x}px`, "--land-y": `${diceLand.y}px`, "--land-r": `${diceLand.r}deg` } as React.CSSProperties}>
              <RealDice value={diceVal} color={playerCount === 1 ? PLAYER_COLORS[0] : PLAYER_COLORS[currentPlayer]} rolling={rolling} />
            </div>
          </div>
          <div className="diceGroundShadow" />
          <div className="diceTouchText">{rolling ? (playerCount > 1 ? `${playerNames[currentPlayer] || `Player ${currentPlayer + 1}`} is rolling...` : "Rolling...") : "Tap the dice to roll"}</div>
          <small className="stageSub">{rolling ? "Watch it fly up and bounce down" : "Tap anywhere on the dice"}</small>
        </div>
        <button className="bigBtn black" onClick={rollDice} disabled={rolling}>{rolling ? "ROLLING... 🎲" : "ROLL DICE 🎲"}</button>
      </div>
    </main>
  );
}

const css = `
* { box-sizing: border-box; }
.page { min-height: 100vh; background: radial-gradient(circle at 50% -10%, rgba(22,163,74,0.07), transparent 35%), #ffffff; color: #0f172a; padding: 10px 12px 40px; font-family: 'Plus Jakarta Sans', Inter, system-ui, sans-serif; }
.wrap { max-width: 900px; margin: auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.logo { font-size: 16px; font-weight: 900; letter-spacing: -0.4px; }
.logo span { color: #16a34a; }
.topBest { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 999px; padding: 6px 11px; font-size: 10px; font-weight: 800; }
.hero { text-align: center; margin-bottom: 15px; }
.tag { display: inline-block; padding: 5px 11px; border-radius: 999px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 9px; font-weight: 900; margin-bottom: 7px; }
h1 { margin: 0; font-size: 27px; font-weight: 900; letter-spacing: -1px; }
h1 span { color: #16a34a; }
.sub { color: #64748b; font-size: 12px; margin: 6px auto 0; line-height: 1.6; }
.homeGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
.homeCard { position: relative; background: linear-gradient(180deg, #ffffff, #fbfdff); border: 1px solid #e2e8f0; border-radius: 22px; padding: 20px 14px; text-align: center; cursor: pointer; box-shadow: 0 15px 45px rgba(15,23,42,0.07); }
.homeCard h2 { font-size: 18px; margin: 15px 0 5px; }
.homeCard p { color: #64748b; font-size: 11px; line-height: 1.55; margin: 0; }
.openBtn { margin-top: 15px; border: 0; background: #16a34a; color: #fff; border-radius: 999px; padding: 11px 18px; font-weight: 900; font-size: 12px; width: 100%; cursor: pointer; }
.openBtn.dark { background: #0f172a; }
.homeCoin { width: 130px; height: 130px; margin: 8px auto; position: relative; }
.homeCoinFront, .homeCoinBack { position: absolute; inset: 0; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 5px solid; box-shadow: 0 18px 30px rgba(0,0,0,0.20), inset 0 -8px 15px rgba(0,0,0,0.20), inset 0 5px 10px rgba(255,255,255,0.35); }
.homeCoinFront { z-index: 2; background: radial-gradient(circle at 30% 25%, #ffffff 0%, #e2e8f0 25%, #94a3b8 58%, #475569 100%); border-color: #64748b; }
.homeCoinBack { transform: translateX(17px) scale(0.91); background: radial-gradient(circle at 30% 25%, #f8fafc 0%, #cbd5e1 35%, #64748b 75%, #334155 100%); border-color: #475569; }
.homeCoin span { font-size: 48px; line-height: 1; font-weight: 950; color: #0f172a; }
.homeCoin small { margin-top: 2px; font-size: 8px; font-weight: 900; letter-spacing: 2px; color: #334155; }
.homeDicePreview { width: 130px; height: 130px; margin: 8px auto; display: flex; align-items: center; justify-content: center; }
.previewDice { width: 100px; height: 100px; border-radius: 23px; background: linear-gradient(145deg, #ef4444, #dc2626 45%, #991b1b); display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); padding: 18px; gap: 2px; transform: rotateX(10deg) rotateY(-12deg) rotateZ(-4deg); box-shadow: 0 20px 30px rgba(0,0,0,0.23); }
.previewDice span { width: 17px; height: 17px; border-radius: 50%; background: #fff; place-self: center; }
.content { margin-top: 15px; background: linear-gradient(180deg, #f8fafc, #ffffff); border: 1px solid #e2e8f0; border-radius: 17px; padding: 16px; }
.content h2 { font-size: 17px; margin: 0 0 7px; }
.content p { color: #64748b; font-size: 11px; line-height: 1.75; margin: 0; }
.backBtn { border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 7px 14px; font-size: 11px; font-weight: 800; cursor: pointer; margin-bottom: 10px; }
.nameBar { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
.nameBar input { flex: 1; min-width: 0; border: 1.5px solid #e2e8f0; border-radius: 999px; padding: 12px 10px; font-size: 12px; font-weight: 800; text-align: center; outline: none; background: #f8fafc; }
.nameBar input:focus { border-color: #16a34a; background: #fff; }
.nameBar span { font-weight: 900; color: #94a3b8; font-size: 10px; }
.bigStage { position: relative; background: radial-gradient(circle at 50% 40%, #ffffff 0%, #ffffff 52%, #f8fafc 100%); border: 1px solid #e2e8f0; border-radius: 23px; padding: 22px 14px; text-align: center; min-height: 390px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 15px 45px rgba(15,23,42,0.07); overflow: hidden; -webkit-tap-highlight-color: transparent; }
.stageText { position: relative; z-index: 5; font-size: 17px; font-weight: 900; margin: 20px 0 3px; }
.stageSub { position: relative; z-index: 5; color: #94a3b8; font-size: 10px; font-weight: 700; }
.coinStage { perspective: 1200px; }
.coinScene { position: relative; width: 250px; height: 250px; display: flex; align-items: center; justify-content: center; perspective: 1400px; z-index: 3; }
.coinWrapper { width: 230px; height: 230px; position: relative; transform-style: preserve-3d; will-change: transform; }
.coin3d { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; filter: drop-shadow(0 24px 20px rgba(15,23,42,0.25)); }
.coinSide { position: absolute; inset: 0; border-radius: 50%; backface-visibility: hidden; -webkit-backface-visibility: hidden; overflow: hidden; }
.coinFront { background: radial-gradient(circle at 30% 22%, #ffffff 0%, #f1f5f9 20%, #cbd5e1 55%, #64748b 80%, #334155 100%); border: 8px solid #94a3b8; box-shadow: inset 0 7px 12px rgba(255,255,255,0.6), inset 0 -13px 20px rgba(15,23,42,0.28); }
.coinBack { transform: rotateY(180deg); background: radial-gradient(circle at 30% 22%, #f8fafc 0%, #e2e8f0 25%, #94a3b8 65%, #475569 100%); border: 8px solid #64748b; box-shadow: inset 0 7px 12px rgba(255,255,255,0.5), inset 0 -13px 20px rgba(15,23,42,0.25); }
.coinInner { position: absolute; inset: 15px; border: 2px dashed rgba(15,23,42,0.35); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.coinLetter { font-size: 96px; font-weight: 950; line-height: 0.9; color: #0f172a; text-shadow: 0 2px 0 rgba(255,255,255,0.6); }
.coinInner small { margin-top: 7px; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10px; font-weight: 950; letter-spacing: 1px; color: #334155; }
.coinInner i { position: absolute; top: 10px; left: 20px; width: 55px; height: 18px; border-radius: 999px; background: rgba(255,255,255,0.55); filter: blur(5px); transform: rotate(-25deg); }
.toss-hand { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); font-size: 88px; z-index: 10; animation: handToss 0.6s ease-out forwards; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.2)); }
@keyframes handToss { 0% { transform: translateX(-50%) translateY(60px) scale(0.9); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateX(-50%) translateY(-40px) scale(1.05); opacity: 0; } }
.coin-flying { animation: realisticCoinFlight 2.5s cubic-bezier(0.18,0.72,0.25,1) forwards; }
@keyframes realisticCoinFlight {
  0% { transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1); }
  10% { transform: translate3d(0, -40px, 60px) rotateX(220deg) rotateY(180deg) scale(0.98); }
  25% { transform: translate3d(8px, -130px, 150px) rotateX(620deg) rotateY(520deg) scale(0.90); }
  45% { transform: translate3d(-6px, -190px, 210px) rotateX(1150deg) rotateY(900deg) scale(0.82); }
  60% { transform: translate3d(6px, -175px, 190px) rotateX(1580deg) rotateY(1230deg) scale(0.85); }
  75% { transform: translate3d(-4px, -110px, 120px) rotateX(1950deg) rotateY(1520deg) scale(0.92); }
  88% { transform: translate3d(0, -30px, 40px) rotateX(2220deg) rotateY(1730deg) scale(0.98); }
  95% { transform: translate3d(0, 8px, 0) rotateX(2300deg) rotateY(1790deg) scale(1.02); }
  100% { transform: translate3d(0, 0, 0) rotateX(2340deg) rotateY(1800deg) scale(1); }
}
.coinShadow { position: absolute; width: 185px; height: 34px; bottom: 128px; background: radial-gradient(ellipse, rgba(15,23,42,0.24), transparent 68%); filter: blur(6px); animation: coinShadowMove 2.5s ease-in-out forwards; pointer-events: none; }
@keyframes coinShadowMove { 0% { transform: scale(1); opacity: 0.5; } 35% { transform: scale(0.48); opacity: 0.18; } 55% { transform: scale(0.4); opacity: 0.12; } 80% { transform: scale(0.75); opacity: 0.32; } 100% { transform: scale(1); opacity: 0.5; } }
.diceStage { min-height: 370px; }
.diceArena { position: relative; width: 270px; height: 270px; display: flex; align-items: center; justify-content: center; perspective: 1100px; z-index: 3; }
.diceHolder { width: 210px; height: 210px; display: flex; align-items: center; justify-content: center; transform-style: preserve-3d; will-change: transform; }
.diceHolderRolling { animation: diceRealFly 1.5s cubic-bezier(0.2,0.75,0.25,1) forwards; }
@keyframes diceRealFly {
  0% { transform: translate3d(0, 0, 0) rotateZ(0deg) rotateX(0deg) scale(1); }
  15% { transform: translate3d(-18px, -60px, 80px) rotateZ(-25deg) rotateX(40deg) scale(0.95); }
  30% { transform: translate3d(22px, -150px, 160px) rotateZ(70deg) rotateX(120deg) scale(0.85); }
  45% { transform: translate3d(var(--land-x, 0px), -185px, 200px) rotateZ(170deg) rotateX(220deg) scale(0.82); }
  60% { transform: translate3d(var(--land-x, 0px), -120px, 130px) rotateZ(250deg) rotateX(300deg) scale(0.88); }
  75% { transform: translate3d(var(--land-x, 0px), -45px, 50px) rotateZ(320deg) rotateX(350deg) scale(0.96); }
  88% { transform: translate3d(var(--land-x, 0px), 12px, 0) rotateZ(355deg) scale(1.03); }
  94% { transform: translate3d(var(--land-x, 0px), -10px, 0) rotateZ(360deg) scale(1.01); }
  100% { transform: translate3d(var(--land-x, 0px), 0, 0) rotateZ(var(--land-r, 360deg)) scale(1); }
}
.real-dice { width: 210px; height: 210px; border-radius: 36px; position: relative; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); padding: 32px; gap: 2px; transform-style: preserve-3d; box-shadow: 0 30px 45px rgba(15,23,42,0.27), inset 0 -14px 22px rgba(0,0,0,0.25), inset 0 8px 13px rgba(255,255,255,0.28); }
.dice-edge { position: absolute; inset: 5px; border-radius: 31px; border: 2px solid rgba(255,255,255,0.20); pointer-events: none; }
.dice-top-glow { position: absolute; top: 12px; left: 25px; right: 25px; height: 42px; border-radius: 999px; background: rgba(255,255,255,0.28); filter: blur(8px); transform: rotate(-4deg); pointer-events: none; }
.pip { width: 30px; height: 30px; background: radial-gradient(circle at 35% 30%, #ffffff, #f8fafc 55%, #cbd5e1); border-radius: 50%; opacity: 0; place-self: center; box-shadow: inset 0 3px 6px rgba(0,0,0,0.30); }
.pip.show { opacity: 1; }
.dice-shine { position: absolute; top: 22px; left: 31px; width: 70px; height: 18px; background: rgba(255,255,255,0.42); border-radius: 999px; filter: blur(6px); transform: rotate(-25deg); pointer-events: none; }
.dice-reflection { position: absolute; right: 19px; bottom: 20px; width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.10); filter: blur(7px); pointer-events: none; }
.diceGroundShadow { position: absolute; width: 190px; height: 38px; bottom: 102px; border-radius: 50%; background: radial-gradient(ellipse, rgba(15,23,42,0.28), transparent 70%); filter: blur(7px); z-index: 1; pointer-events: none; }
.diceTouchText { position: relative; z-index: 5; font-size: 17px; font-weight: 900; margin-top: 2px; }
.howManyBox { display: flex; align-items: center; gap: 10px; background: linear-gradient(180deg, #f8fafc, #ffffff); border: 1.5px solid #e2e8f0; border-radius: 999px; padding: 10px 16px; margin-bottom: 10px; }
.howManyBox label { flex: 1; font-size: 12px; font-weight: 900; }
.howManyBox input { width: 70px; border: 1.5px solid #e2e8f0; border-radius: 999px; padding: 9px; font-size: 15px; font-weight: 900; text-align: center; outline: none; background: #fff; }
.howManyBox span { font-size: 11px; font-weight: 800; color: #94a3b8; }
.playerNames { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 10px; }
.playerNames input { min-width: 90px; flex: 1; border: 1.5px solid #e2e8f0; border-radius: 999px; padding: 9px 10px; font-size: 11px; font-weight: 800; text-align: center; outline: none; background: #fff; }
.bigBtn { width: 100%; border: 0; border-radius: 999px; padding: 15px; font-size: 14px; font-weight: 950; cursor: pointer; margin-top: 14px; color: #fff; }
.bigBtn.green { background: linear-gradient(180deg, #22c55e, #16a34a); }
.bigBtn.black { background: linear-gradient(180deg, #1e293b, #0f172a); }
.bigBtn:disabled { opacity: 0.58; cursor: not-allowed; }
.stats { display: flex; gap: 8px; margin-top: 10px; }
.stat { flex: 1; background: linear-gradient(180deg, #f8fafc, #ffffff); border: 1px solid #e2e8f0; border-radius: 13px; padding: 8px; text-align: center; font-size: 10px; font-weight: 800; }
.stat b { display: block; font-size: 16px; margin-top: 2px; }
.winnerLine { margin-top: 10px; background: linear-gradient(180deg, #f0fdf4, #ffffff); border: 1.5px solid #16a34a; border-radius: 13px; padding: 10px; text-align: center; font-weight: 900; font-size: 13px; }
@media (max-width: 650px) { .page { padding: 9px 10px 35px; } .homeGrid { grid-template-columns: 1fr; } .bigStage { min-height: 380px; } .coinScene { width: 230px; height: 230px; } .coinWrapper { width: 205px; height: 205px; } .coinLetter { font-size: 82px; } .real-dice { width: 185px; height: 185px; padding: 28px; border-radius: 31px; } .pip { width: 27px; height: 27px; } .diceArena { width: 245px; height: 245px; } .diceHolder { width: 185px; height: 185px; } }
@media (prefers-reduced-motion: reduce) { .coin-flying, .diceHolderRolling { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; } }
`;
