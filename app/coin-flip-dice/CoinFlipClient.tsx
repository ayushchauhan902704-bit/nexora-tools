"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

const PLAYER_COLORS = ["#FACC15", "#22C55E", "#3B82F6", "#EF4444", "#A855F7", "#F97316"];
type View = "home" | "coin" | "dice";
type CoinSide = "H" | "T";

// Pips positions for 3x3 grid - only correct dots show
const PIPS_MAP: Record<number, number[]> = {
  1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9],
};

function DiceFace({ value, pos, color }: { value: number; pos: string; color: string }) {
  return (
    <div className={`cube-face face-${pos}`} style={{ background: `linear-gradient(145deg, ${color}, ${color}CC)` }}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={`pip ${PIPS_MAP[value]?.includes(i + 1) ? "show" : "hide"}`} />
      ))}
    </div>
  );
}

// Real 3D Cube - faces are FIXED, only rotation changes. No flicker.
function RealDice3D({ finalValue, color, rolling, rollKey }: { finalValue: number; color: string; rolling: boolean; rollKey: number }) {
  const finalRot: Record<number, string> = {
    1: "rotateX(0deg) rotateY(0deg)",
    2: "rotateX(0deg) rotateY(-90deg)",
    3: "rotateX(-90deg) rotateY(0deg)",
    4: "rotateX(90deg) rotateY(0deg)",
    5: "rotateX(0deg) rotateY(90deg)",
    6: "rotateX(0deg) rotateY(180deg)",
  };
  return (
    <div className="dice-3d-scene">
      <div key={rollKey} className={`dice-cube ${rolling ? "cube-tumbling" : "cube-settled"}`} style={{ "--final-rot": finalRot[finalValue] } as React.CSSProperties}>
        <DiceFace value={1} pos="front" color={color} />
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
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);

  const [howMany, setHowMany] = useState("2");
  const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6"]);
  const [diceVal, setDiceVal] = useState(6);
  const [pendingDiceVal, setPendingDiceVal] = useState(6);
  const [rolling, setRolling] = useState(false);
  const [rollKey, setRollKey] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [roundDone, setRoundDone] = useState(false);
  const [waitingForNext, setWaitingForNext] = useState(false);

  const coinHistoryRef = useRef<Array<CoinSide>>([]);
  const coinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerCount = Math.max(1, Math.min(6, parseInt(howMany) || 1));

  useEffect(() => { return () => { if (coinTimeoutRef.current) clearTimeout(coinTimeoutRef.current); }; }, []);

  // Reset dice when player count changes
  useEffect(() => {
    setCurrentPlayer(0);
    setScores([]);
    setRoundDone(false);
    setWaitingForNext(false);
    setDiceVal(6);
  }, [playerCount]);

  const flipCoin = () => {
    if (flipping) return;
    setFlipping(true);
    setCoinResult(null);
    setFlyKey((k) => k + 1);
    let isHead = Math.random() > 0.5;
    const last = coinHistoryRef.current;
    if (last.length >= 4) {
      const last4 = last.slice(-4);
      if (last4.every((v) => v === "H")) isHead = false;
      if (last4.every((v) => v === "T")) isHead = true;
    }
    try { navigator.vibrate?.([40, 30, 60]); } catch {}
    coinTimeoutRef.current = setTimeout(() => {
      const res: CoinSide = isHead ? "H" : "T";
      coinHistoryRef.current = [...coinHistoryRef.current, res].slice(-5);
      setCoinResult(res);
      setFlipping(false);
      if (isHead) setHeadsCount((h) => h + 1); else setTailsCount((t) => t + 1);
      confetti({ particleCount: 100, spread: 80, startVelocity: 26, origin: { y: 0.55 }, colors: ["#E2E8F0", "#94A3B8", "#FACC15", "#22C55E"] });
      try { navigator.vibrate?.([80, 40, 100]); } catch {}
    }, 2400);
  };

  // ===== TURN BASED DICE - LUDO STYLE =====
  const rollDice = () => {
    if (rolling) return;
    // If round done, start new round
    if (roundDone) {
      setScores([]); setCurrentPlayer(0); setRoundDone(false); setWaitingForNext(false);
    }
    // If waiting, this tap is for NEXT player - just start his roll
    setWaitingForNext(false);
    setRolling(true);
    setRollKey((k) => k + 1);
    const final = Math.floor(Math.random() * 6) + 1;
    setPendingDiceVal(final); // Lock value BEFORE animation - no double number bug
    try { navigator.vibrate?.([30, 20, 40]); } catch {}

    setTimeout(() => {
      setDiceVal(final); // Show only once at landing
      setRolling(false);
      const newScores = [...scores];
      newScores[currentPlayer] = final;
      setScores(newScores);
      try { navigator.vibrate?.([70, 30, 90]); } catch {}
      if (playerCount > 1) {
        if (currentPlayer < playerCount - 1) {
          setWaitingForNext(true); // WAIT - next player must tap
        } else {
          setRoundDone(true);
          confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors: PLAYER_COLORS });
        }
      }
    }, 1500); // Ludo timing: 1.5s fly + tumble
  };

  const nextPlayerTap = () => {
    if (!waitingForNext) return;
    setCurrentPlayer((p) => p + 1);
    // Next tap on dice will roll for new player
    setWaitingForNext(false);
  };

  const handleDiceTap = () => {
    if (rolling) return;
    if (waitingForNext) { nextPlayerTap(); return; }
    rollDice();
  };

  // ===== HOME =====
  if (view === "home") {
    return (
      <main className="page"><style jsx>{css}</style>
        <div className="wrap">
          <header className="top pinned"><div className="logo">THENEXORA<span>TOOLS</span></div><div className="topBest">FREE • NO SIGN UP</div></header>
          <section className="hero">
            <div className="tag">COIN FLIP + DICE ROLLER</div>
            <h1>Coin Flip <span>& Dice Roller</span></h1>
            <p className="sub">Realistic 3D coin toss & Ludo-style dice. For cricket, Ludo, board games & quick decisions.</p>
          </section>
          <div className="homeGrid">
            <div className="homeCard" onClick={() => setView("coin")}>
              <div className="homeCoin"><div className="homeCoinBack"><span>T</span><small>TAILS</small></div><div className="homeCoinFront"><span>H</span><small>HEADS</small></div></div>
              <h2>Coin Flip</h2><p>Toss for cricket, teams & decisions. Heads or Tails in 2.4s.</p><button className="openBtn">OPEN COIN →</button>
            </div>
            <div className="homeCard" onClick={() => setView("dice")}>
              <div className="homeDicePreview"><div className="previewDice">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (<span key={n} className={PIPS_MAP[6].includes(n) ? "show" : "hide"} />))}
              </div></div>
              <h2>Dice Roller</h2><p>Ludo-style 3D dice. Up to 6 players, turn by turn.</p><button className="openBtn dark">OPEN DICE →</button>
            </div>
          </div>
          <section className="content">
            <h2>Coin Flip & Dice Roller — Free Online Tool</h2>
            <p>Flip a virtual coin or roll a realistic dice instantly. Perfect for cricket toss, team selection, Ludo, Monopoly, Snakes &amp; Ladders and any fair decision. No sign-up, works on mobile, tablet and desktop.</p>
            <h3>How To Use Coin Flip</h3><p>Change Heads / Tails names, tap the coin. It jumps up, spins fast with blur, bounces and lands on Heads or Tails.</p>
            <h3>How To Use Dice Roller</h3><p>Choose players 1 to 6, add names. Tap dice to roll. For 2+ players, each player taps on their own turn. Dice flies, tumbles like Ludo, bounces and lands on one number.</p>
            <h3>Is It Fair &amp; Random?</h3><p>Yes. 50/50 for coin. Dice is 1 to 6 random. Coin also prevents same result 5 times in a row to stay fair.</p>
          </section>
          <section className="content">
            <h2>Frequently Asked Questions</h2>
            <div className="faq"><b>Can I use it for cricket toss?</b><p>Yes, made for cricket, football and team selection.</p></div>
            <div className="faq"><b>How many players for dice?</b><p>Up to 6 players, turn by turn. Each player taps on their turn.</p></div>
            <div className="faq"><b>Is it free?</b><p>Yes, 100% free. No sign-up, no app needed.</p></div>
            <div className="faq"><b>Does it work on mobile?</b><p>Yes, fully responsive on mobile, tablet and desktop.</p></div>
          </section>
          <section className="content"><h2>Explore More Tools</h2><div className="related"><a href="/spin-wheel">Spin Wheel</a><a href="/cps-test">CPS Test</a><a href="/reaction-time-test">Reaction Test</a><a href="/countdown-timer">Countdown Timer</a><a href="/random-number-generator">Random Number</a><a href="/age-calculator">Age Calculator</a></div></section>
          <div className="footer">© {new Date().getFullYear()} thenexoratools.com • Free Coin Flip &amp; Dice Roller</div>
        </div>
      </main>
    );
  }

  // ===== COIN =====
  if (view === "coin") {
    return (
      <main className="page"><style jsx>{css}</style>
        <div className="wrap">
          <button className="backBtn" onClick={() => setView("home")}>← Back</button>
          <header className="top"><div className="logo">THENEXORA<span>TOOLS</span></div><div className="topBest">COIN FLIP</div></header>
          <div className="pinned-label">PINNED • CUSTOM TEAMS</div>
          <div className="nameBar">
            <input value={headLabel} onChange={(e) => setHeadLabel(e.target.value)} placeholder="Heads" maxLength={14} />
            <span>VS</span>
            <input value={tailLabel} onChange={(e) => setTailLabel(e.target.value)} placeholder="Tails" maxLength={14} />
          </div>
          <div className="bigStage coinStage" onClick={flipCoin}>
            <div className="coinScene">
              <div key={flyKey} className={`coinWrapper ${flipping ? "coin-flipping-video" : ""}`}>
                <div className="coin3d">
                  <div className="coinSide coinFront"><div className="coinInner"><span className="coinLetter">{coinResult === "T" ? "T" : "H"}</span><small>{coinResult === "T" ? tailLabel : headLabel}</small><i /></div></div>
                  <div className="coinSide coinBack"><div className="coinInner"><span className="coinLetter">T</span><small>{tailLabel}</small><i /></div></div>
                </div>
              </div>
            </div>
            <div className={`coinShadow ${flipping ? "shadow-flipping" : ""}`} />
            <p className="stageText">{flipping ? "Flipping..." : coinResult ? `${coinResult === "H" ? headLabel : tailLabel} Wins!` : "Tap the coin to flip"}</p>
            <small className="stageSub">{flipping ? "Watch it spin in air" : "Tap anywhere on the coin"}</small>
          </div>
          <button className="bigBtn green" onClick={flipCoin} disabled={flipping}>{flipping ? "FLIPPING..." : "FLIP COIN"}</button>
          <div className="stats"><div className="stat">{headLabel || "Heads"}<b>{headsCount}</b></div><div className="stat">{tailLabel || "Tails"}<b>{tailsCount}</b></div><div className="stat">Total<b>{headsCount + tailsCount}</b></div></div>
          {coinResult && !flipping && <div className="winnerLine">Winner: {coinResult === "H" ? headLabel : tailLabel}</div>}
          <section className="content"><h2>Online Coin Flip — Heads or Tails</h2><p>Free coin flip for cricket toss, football toss and any 50/50 decision. Change names, tap coin, get fair Heads or Tails in 2.4 seconds. Real spin, blur and bounce like a real coin.</p></section>
        </div>
      </main>
    );
  }

  // ===== DICE =====
  const leader = scores.length ? Math.max(...scores.filter((s) => s !== undefined)) : 0;
  return (
    <main className="page"><style jsx>{css}</style>
      <div className="wrap">
        <button className="backBtn" onClick={() => setView("home")}>← Back</button>
        <header className="top"><div className="logo">THENEXORA<span>TOOLS</span></div><div className="topBest">DICE ROLLER</div></header>

        <div className="pinned-label">PINNED • TURN BY TURN • LUDO STYLE</div>

        <div className="howManyBox">
          <label>How many players?</label>
          <div className="playerBtns">{[1, 2, 3, 4, 5, 6].map((n) => (<button key={n} className={playerCount === n ? "pbtn active" : "pbtn"} onClick={() => setHowMany(String(n))}>{n}</button>))}</div>
        </div>

        {playerCount > 1 && (
          <div className="playerNames">
            {Array.from({ length: playerCount }, (_, i) => (
              <div key={i} className={`playerChip ${currentPlayer === i ? "active" : ""}`} style={{ borderColor: PLAYER_COLORS[i] }}>
                <input value={playerNames[i]} onChange={(e) => { const arr = [...playerNames]; arr[i] = e.target.value; setPlayerNames(arr); }} maxLength={10} />
                <span>{scores[i] !== undefined ? `Rolled: ${scores[i]}` : currentPlayer === i ? "Your Turn" : "Waiting"}</span>
              </div>
            ))}
          </div>
        )}

        <div className="turnBanner">
          {rolling ? `${playerNames[currentPlayer] || `Player ${currentPlayer + 1}`} is rolling...` : waitingForNext ? `Tap to continue — Next: ${playerNames[currentPlayer + 1] || `Player ${currentPlayer + 2}`}` : roundDone ? `Round Complete! Winner: ${playerNames[scores.indexOf(leader)] || "Player 1"} (${leader}) — Tap dice for new round` : playerCount > 1 ? `${playerNames[currentPlayer] || `Player ${currentPlayer + 1}`}'s Turn — Tap dice` : "Tap dice to roll"}
        </div>

        <div className="bigStage diceStage" onClick={handleDiceTap}>
          <div className="diceArena">
            <RealDice3D finalValue={rolling ? pendingDiceVal : diceVal} color={playerCount === 1 ? PLAYER_COLORS[0] : PLAYER_COLORS[currentPlayer]} rolling={rolling} rollKey={rollKey} />
          </div>
          <div className="diceGroundShadow" />
          <div className="diceTouchText">
            {rolling ? "Rolling..." : waitingForNext ? "Tap for Next Player →" : roundDone ? "Tap for New Round" : "Tap the dice to roll"}
          </div>
          <small className="stageSub">{rolling ? "Dice is flying & tumbling like Ludo" : "Tap anywhere on the dice"}</small>
          {!rolling && diceVal !== 0 && scores[currentPlayer] !== undefined && playerCount === 1 && <div className="bigNumber">You rolled {diceVal}</div>}
        </div>

        <button className="bigBtn black" onClick={handleDiceTap} disabled={rolling}>
          {rolling ? "ROLLING..." : waitingForNext ? "NEXT PLAYER →" : roundDone ? "NEW ROUND" : playerCount > 1 ? `ROLL FOR ${playerNames[currentPlayer]?.toUpperCase() || `PLAYER ${currentPlayer + 1}`}` : "ROLL DICE"}
        </button>

        {playerCount > 1 && scores.length > 0 && (
          <div className="scoreBoard">
            {scores.map((s, i) => s !== undefined && (
              <div key={i} className="scoreItem" style={{ borderColor: PLAYER_COLORS[i] }}><b>{playerNames[i]}</b><span>{s}</span>{s === leader && <em>Leader</em>}</div>
            ))}
          </div>
        )}

        <section className="content"><h2>Online Dice Roller — Ludo &amp; Board Games</h2><p>Roll dice online for Ludo, Monopoly, Snakes &amp; Ladders. 3D dice flies, tumbles like Ludo, bounces and lands on one number. Up to 6 players, turn by turn. Each player must tap on their own turn.</p></section>
      </div>
    </main>
  );
}

const css = `
* { box-sizing: border-box; }
.page { min-height: 100vh; background: #F8FAFC; color: #0F172A; padding: 10px 12px 40px; font-family: Inter, system-ui, sans-serif; }
.wrap { max-width: 900px; margin: auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.top.pinned { position: sticky; top: 0; z-index: 20; background: rgba(248,250,252,0.92); backdrop-filter: blur(10px); padding: 10px 6px; }
.logo { font-size: 15px; font-weight: 900; letter-spacing: -0.3px; }
.logo span { color: #16A34A; }
.topBest { background: #0F172A; color: #fff; border-radius: 999px; padding: 6px 11px; font-size: 10px; font-weight: 800; letter-spacing: 0.4px; }
.hero { text-align: center; margin-bottom: 16px; }
.tag { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #DCFCE7; color: #15803D; font-size: 10px; font-weight: 900; letter-spacing: 0.6px; margin-bottom: 8px; }
h1 { margin: 0; font-size: 30px; font-weight: 900; letter-spacing: -1px; }
h1 span { color: #16A34A; }
.sub { color: #64748B; font-size: 12px; margin: 7px auto 0; line-height: 1.6; max-width: 520px; }
.homeGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
.homeCard { background: #fff; border: 1px solid #E2E8F0; border-radius: 24px; padding: 20px 14px; text-align: center; cursor: pointer; box-shadow: 0 12px 32px rgba(15,23,42,0.06); }
.homeCard h2 { font-size: 18px; margin: 14px 0 5px; }
.homeCard p { color: #64748B; font-size: 11px; line-height: 1.55; margin: 0; }
.openBtn { margin-top: 14px; border: 0; background: #16A34A; color: #fff; border-radius: 999px; padding: 11px 18px; font-weight: 900; font-size: 12px; width: 100%; cursor: pointer; }
.openBtn.dark { background: #0F172A; }
.homeCoin { width: 128px; height: 128px; margin: 8px auto; position: relative; }
.homeCoinFront, .homeCoinBack { position: absolute; inset: 0; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 5px solid; }
.homeCoinFront { z-index: 2; background: radial-gradient(circle at 30% 25%, #fff 0%, #E2E8F0 25%, #94A3B8 58%, #475569 100%); border-color: #64748B; box-shadow: 0 16px 26px rgba(0,0,0,0.18); }
.homeCoinBack { transform: translateX(16px) scale(0.92); background: radial-gradient(circle at 30% 25%, #F8FAFC 0%, #CBD5E1 35%, #64748B 75%, #334155 100%); border-color: #475569; }
.homeCoin span { font-size: 46px; font-weight: 950; color: #0F172A; line-height: 1; }
.homeCoin small { margin-top: 3px; font-size: 8px; font-weight: 900; letter-spacing: 2px; color: #334155; }
.homeDicePreview { width: 128px; height: 128px; margin: 8px auto; display: flex; align-items: center; justify-content: center; }
.previewDice { width: 98px; height: 98px; border-radius: 22px; background: linear-gradient(145deg, #EF4444, #DC2626 45%, #991B1B); display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); padding: 17px; gap: 2px; transform: rotateX(8deg) rotateY(-10deg); box-shadow: 0 18px 28px rgba(0,0,0,0.22); }
.previewDice span { width: 16px; height: 16px; border-radius: 50%; background: #fff; place-self: center; }
.previewDice span.hide, .pip.hide { opacity: 0; }
.previewDice span.show, .pip.show { opacity: 1; }
.content { margin-top: 14px; background: #fff; border: 1px solid #E2E8F0; border-radius: 18px; padding: 16px; }
.content h2 { font-size: 17px; margin: 0 0 7px; }
.content h3 { font-size: 13px; margin: 12px 0 4px; }
.content p { color: #64748B; font-size: 11px; line-height: 1.75; margin: 0; }
.faq { margin-top: 10px; border-top: 1px solid #F1F5F9; padding-top: 8px; }
.faq b { font-size: 11px; }
.faq p { margin-top: 3px; }
.related { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin-top: 9px; }
.related a { display: block; text-decoration: none; color: #475569; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 11px; padding: 9px 7px; font-size: 11px; font-weight: 700; text-align: center; }
.footer { text-align: center; color: #94A3B8; font-size: 10px; margin-top: 12px; }
.backBtn { border: 1px solid #E2E8F0; background: #fff; border-radius: 999px; padding: 7px 14px; font-size: 11px; font-weight: 800; cursor: pointer; margin-bottom: 10px; }
.pinned-label { background: #FEF3C7; border: 1px solid #FDE68A; color: #92400E; font-size: 10px; font-weight: 900; letter-spacing: 0.5px; text-align: center; padding: 7px; border-radius: 999px; margin-bottom: 10px; }
.nameBar { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
.nameBar input { flex: 1; min-width: 0; border: 1.5px solid #E2E8F0; border-radius: 999px; padding: 12px 10px; font-size: 12px; font-weight: 800; text-align: center; outline: none; background: #fff; }
.nameBar span { font-weight: 900; color: #94A3B8; font-size: 10px; }
.bigStage { position: relative; background: #fff; border: 1px solid #E2E8F0; border-radius: 24px; padding: 22px 14px; text-align: center; min-height: 380px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 14px 40px rgba(15,23,42,0.07); overflow: hidden; }
.stageText { position: relative; z-index: 5; font-size: 17px; font-weight: 900; margin: 20px 0 3px; }
.stageSub { position: relative; z-index: 5; color: #94A3B8; font-size: 10px; font-weight: 700; }
.coinStage { perspective: 1200px; }
.coinScene { position: relative; width: 240px; height: 240px; display: flex; align-items: center; justify-content: center; perspective: 1400px; z-index: 3; }
.coinWrapper { width: 220px; height: 220px; position: relative; transform-style: preserve-3d; }
.coin3d { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; }
.coinSide { position: absolute; inset: 0; border-radius: 50%; backface-visibility: hidden; overflow: hidden; }
.coinFront { background: radial-gradient(circle at 32% 28%, #fff 0%, #F8FAFC 18%, #CBD5E1 48%, #94A3B8 78%, #64748B 100%); border: 7px solid #94A3B8; box-shadow: inset 0 -12px 22px rgba(15,23,42,0.32), inset 0 10px 16px rgba(255,255,255,0.6); }
.coinBack { transform: rotateY(180deg); background: radial-gradient(circle at 32% 28%, #fff 0%, #E2E8F0 22%, #94A3B8 62%, #475569 100%); border: 7px solid #64748B; }
.coinInner { position: absolute; inset: 14px; border: 2px dashed rgba(15,23,42,0.32); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.coinLetter { font-size: 92px; font-weight: 950; line-height: 0.9; color: #0F172A; font-family: Georgia, serif; }
.coinInner small { margin-top: 7px; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10px; font-weight: 950; letter-spacing: 1px; color: #334155; }
.coinInner i { position: absolute; top: 12px; left: 24px; width: 52px; height: 16px; border-radius: 999px; background: rgba(255,255,255,0.55); filter: blur(5px); transform: rotate(-25deg); }
.coin-flipping-video { animation: coinVideoFlip 2.4s cubic-bezier(0.25,0.7,0.3,1) forwards; }
@keyframes coinVideoFlip {
  0% { transform: translateY(0) rotateX(0deg) scale(1, 1); }
  8% { transform: translateY(-55px) rotateX(320deg) scale(0.92, 0.95); }
  16% { transform: translateY(-115px) rotateX(720deg) scale(0.55, 0.92); filter: blur(1.2px); }
  26% { transform: translateY(-165px) rotateX(1150deg) scale(0.28, 0.88); filter: blur(2.2px); }
  36% { transform: translateY(-175px) rotateX(1550deg) scale(0.18, 0.85); filter: blur(2.8px); }
  46% { transform: translateY(-155px) rotateX(1950deg) scale(0.32, 0.88); filter: blur(2.2px); }
  56% { transform: translateY(-105px) rotateX(2300deg) scale(0.60, 0.92); filter: blur(1.2px); }
  66% { transform: translateY(-45px) rotateX(2620deg) scale(0.88, 0.96); }
  75% { transform: translateY(0) rotateX(2880deg) scale(1, 1); }
  82% { transform: translateY(-22px) rotateX(2970deg) scale(1, 0.96); }
  88% { transform: translateY(0) rotateX(3040deg) scale(1, 1); }
  93% { transform: translateY(-10px) rotateX(3080deg) scale(1, 0.98); }
  100% { transform: translateY(0) rotateX(3240deg) scale(1, 1); }
}
.coinShadow { position: absolute; width: 180px; height: 32px; bottom: 118px; background: radial-gradient(ellipse, rgba(15,23,42,0.24), transparent 68%); filter: blur(6px); pointer-events: none; }
.shadow-flipping { animation: coinShadowVideo 2.4s ease-in-out forwards; }
@keyframes coinShadowVideo { 0% { transform: scale(1); opacity: 0.5; } 30% { transform: scale(0.45); opacity: 0.15; } 50% { transform: scale(0.38); opacity: 0.1; } 75% { transform: scale(0.85); opacity: 0.35; } 100% { transform: scale(1); opacity: 0.5; } }
.diceStage { min-height: 380px; }
.diceArena { position: relative; width: 260px; height: 260px; display: flex; align-items: center; justify-content: center; perspective: 1100px; z-index: 3; }
.dice-3d-scene { width: 180px; height: 180px; perspective: 1000px; display: flex; align-items: center; justify-content: center; }
.dice-cube { width: 145px; height: 145px; position: relative; transform-style: preserve-3d; }
.cube-face { position: absolute; width: 145px; height: 145px; border-radius: 24px; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); padding: 20px; gap: 2px; box-shadow: inset 0 -10px 18px rgba(0,0,0,0.25), inset 0 6px 10px rgba(255,255,255,0.25), 0 20px 35px rgba(0,0,0,0.25); border: 2px solid rgba(255,255,255,0.25); }
.face-front { transform: translateZ(72px); }
.face-back { transform: rotateY(180deg) translateZ(72px); }
.face-right { transform: rotateY(90deg) translateZ(72px); }
.face-left { transform: rotateY(-90deg) translateZ(72px); }
.face-top { transform: rotateX(90deg) translateZ(72px); }
.face-bottom { transform: rotateX(-90deg) translateZ(72px); }
.pip { width: 22px; height: 22px; background: radial-gradient(circle at 35% 30%, #fff, #E2E8F0 60%, #94A3B8); border-radius: 50%; place-self: center; box-shadow: inset 0 2px 4px rgba(0,0,0,0.35); }
.cube-tumbling { animation: diceLudoTumble 1.5s cubic-bezier(0.2,0.75,0.25,1) forwards; }
@keyframes diceLudoTumble {
  0% { transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1); }
  12% { transform: translate3d(-18px, -65px, 70px) rotateX(180deg) rotateY(140deg) rotateZ(-15deg) scale(0.94); }
  28% { transform: translate3d(18px, -145px, 140px) rotateX(420deg) rotateY(380deg) rotateZ(22deg) scale(0.86); }
  45% { transform: translate3d(0, -178px, 180px) rotateX(680deg) rotateY(620deg) rotateZ(-10deg) scale(0.83); }
  62% { transform: translate3d(-10px, -115px, 110px) rotateX(940deg) rotateY(860deg) rotateZ(14deg) scale(0.90); }
  78% { transform: translate3d(6px, -42px, 45px) rotateX(1160deg) rotateY(1050deg) rotateZ(-5deg) scale(0.97); }
  88% { transform: translate3d(0, 10px, 0) rotateX(1280deg) rotateY(1160deg) scale(1.04); }
  94% { transform: translate3d(0, -10px, 0) rotateX(1340deg) rotateY(1210deg) scale(1.01); }
  100% { transform: translate3d(0, 0, 0) rotateX(1440deg) rotateY(1440deg) scale(1); }
}
.cube-settled { transform: var(--final-rot); transition: transform 0.3s ease; }
.diceGroundShadow { position: absolute; width: 180px; height: 34px; bottom: 100px; border-radius: 50%; background: radial-gradient(ellipse, rgba(15,23,42,0.28), transparent 70%); filter: blur(7px); z-index: 1; pointer-events: none; }
.diceTouchText { position: relative; z-index: 5; font-size: 16px; font-weight: 900; margin-top: 2px; }
.bigNumber { margin-top: 8px; background: #0F172A; color: #fff; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 800; }
.howManyBox { display: flex; align-items: center; gap: 10px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 999px; padding: 9px 14px; margin-bottom: 10px; }
.howManyBox label { flex: 1; font-size: 12px; font-weight: 900; }
.playerBtns { display: flex; gap: 4px; }
.pbtn { width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid #E2E8F0; background: #fff; font-weight: 800; cursor: pointer; }
.pbtn.active { background: #0F172A; color: #fff; border-color: #0F172A; }
.playerNames { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 10px; }
.playerChip { min-width: 118px; flex: 1; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 8px; background: #fff; }
.playerChip.active { box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }
.playerChip input { width: 100%; border: 0; outline: none; text-align: center; font-size: 11px; font-weight: 800; }
.playerChip span { display: block; text-align: center; font-size: 10px; font-weight: 700; color: #64748B; margin-top: 2px; }
.turnBanner { background: #0F172A; color: #fff; border-radius: 12px; padding: 10px; text-align: center; font-size: 12px; font-weight: 800; margin-bottom: 10px; }
.scoreBoard { display: flex; gap: 7px; margin-top: 10px; flex-wrap: wrap; }
.scoreItem { flex: 1; min-width: 90px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 8px; text-align: center; }
.scoreItem b { display: block; font-size: 10px; }
.scoreItem span { font-size: 18px; font-weight: 900; }
.scoreItem em { display: block; font-size: 9px; font-style: normal; color: #16A34A; font-weight: 900; }
.bigBtn { width: 100%; border: 0; border-radius: 999px; padding: 15px; font-size: 14px; font-weight: 950; cursor: pointer; margin-top: 14px; color: #fff; }
.bigBtn.green { background: linear-gradient(180deg, #22C55E, #16A34A); }
.bigBtn.black { background: linear-gradient(180deg, #1E293B, #0F172A); }
.bigBtn:disabled { opacity: 0.58; cursor: not-allowed; }
.stats { display: flex; gap: 8px; margin-top: 10px; }
.stat { flex: 1; background: #fff; border: 1px solid #E2E8F0; border-radius: 13px; padding: 8px; text-align: center; font-size: 10px; font-weight: 800; }
.stat b { display: block; font-size: 16px; margin-top: 2px; }
.winnerLine { margin-top: 10px; background: #F0FDF4; border: 1.5px solid #16A34A; border-radius: 13px; padding: 10px; text-align: center; font-weight: 900; font-size: 13px; }
@media (max-width: 650px) { .page { padding: 9px 10px 35px; } .homeGrid { grid-template-columns: 1fr; } .bigStage { min-height: 380px; } .coinScene { width: 230px; height: 230px; } .coinWrapper { width: 205px; height: 205px; } .coinLetter { font-size: 82px; } .dice-cube { width: 128px; height: 128px; } .cube-face { width: 128px; height: 128px; padding: 17px; } .face-front { transform: translateZ(64px); } .face-back { transform: rotateY(180deg) translateZ(64px); } .face-right { transform: rotateY(90deg) translateZ(64px); } .face-left { transform: rotateY(-90deg) translateZ(64px); } .face-top { transform: rotateX(90deg) translateZ(64px); } .face-bottom { transform: rotateX(-90deg) translateZ(64px); } .related { grid-template-columns: repeat(2, 1fr); } }
`;
