"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const SAMPLE = `Ayush
Rahul
Priya
Aman
Sneha
Vikash
Riya
Arjun
Pooja
Karan
Anjali
Rohan`;

const TEAM_NAMES = [
  "Falcons",
  "Titans",
  "Warriors",
  "Strikers",
  "Phoenix",
  "Hawks",
  "Blazers",
  "Royals",
  "Panthers",
  "Dragons",
];

const TEAM_COLORS = [
  "#6C5CE7",
  "#0EA5A4",
  "#F59E0B",
  "#EF4444",
  "#2563EB",
  "#10B981",
  "#DB2777",
  "#7C3AED",
  "#0891B2",
  "#EA580C",
];

export default function TeamClient() {
  const [namesText, setNamesText] = useState(SAMPLE);
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleNames, setShuffleNames] = useState<string[]>([]);
  const [revealedTeams, setRevealedTeams] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const names = useMemo(() => {
    return namesText
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);
  }, [namesText]);

  const totalPlayers = names.length;

  const teamSizes = useMemo(() => {
    if (totalPlayers === 0) {
      return Array(teamCount).fill(0);
    }

    const base = Math.floor(totalPlayers / teamCount);
    const remainder = totalPlayers % teamCount;

    return Array.from({ length: teamCount }, (_, index) =>
      index < remainder ? base + 1 : base
    );
  }, [totalPlayers, teamCount]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      revealTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const shuffleArray = (array: string[]) => {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  };

  const createTeams = (playerNames: string[]) => {
    const shuffled = shuffleArray(playerNames);

    const result: string[][] = Array.from(
      { length: teamCount },
      () => []
    );

    /*
      This distribution guarantees that the difference between
      team sizes is never more than 1.
    */
    shuffled.forEach((name, index) => {
      result[index % teamCount].push(name);
    });

    return result;
  };

  const generateTeams = () => {
    if (isShuffling) return;

    if (totalPlayers < 2) {
      alert("Please enter at least 2 player names.");
      return;
    }

    if (teamCount > totalPlayers) {
      alert("The number of teams cannot be greater than the number of players.");
      return;
    }

    setTeams([]);
    setRevealedTeams([]);
    setCopied(false);
    setIsShuffling(true);

    let currentNames = shuffleArray(names);

    setShuffleNames(currentNames);

    let ticks = 0;

    intervalRef.current = setInterval(() => {
      currentNames = shuffleArray(names);
      setShuffleNames(currentNames);

      ticks++;

      /*
        5 seconds:
        100ms × 50 = 5000ms
      */
      if (ticks >= 50) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        const finalTeams = createTeams(names);

        setShuffleNames(shuffleArray(names));

        setTimeout(() => {
          setTeams(finalTeams);
          setIsShuffling(false);

          /*
            Reveal each team one by one for a premium
            presentation effect.
          */
          finalTeams.forEach((_, index) => {
            const timeout = setTimeout(() => {
              setRevealedTeams((previous) => [
                ...previous,
                index,
              ]);
            }, index * 180);

            revealTimeoutsRef.current.push(timeout);
          });
        }, 250);
      }
    }, 100);
  };

  const copyAll = async () => {
    if (!teams.length) return;

    const text = teams
      .map((team, index) => {
        const teamName =
          TEAM_NAMES[index % TEAM_NAMES.length];

        return `${teamName} — Team ${index + 1}\n${team
          .map((name) => `• ${name}`)
          .join("\n")}`;
      })
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert(text);
    }
  };

  const clearAll = () => {
    setNamesText("");
    setTeams([]);
    setShuffleNames([]);
    setRevealedTeams([]);
    setCopied(false);
  };

  const loadSample = () => {
    setNamesText(SAMPLE);
    setTeams([]);
    setRevealedTeams([]);
  };

  const displayedShuffleNames =
    shuffleNames.length > 0 ? shuffleNames : names;

  return (
    <main className="team-page">
      <div className="team-shell">

        {/* HEADER */}
        <header className="hero">
          <div className="hero-badge">
            <span className="badge-dot" />
            FREE RANDOM TEAM GENERATOR
          </div>

          <h1>
            Random Team
            <span> Generator</span>
          </h1>

          <p>
            Create fair, balanced teams in seconds.
          </p>
        </header>

        {/* MAIN CARD */}
        {!isShuffling && teams.length === 0 && (
          <section className="builder-card">

            {/* LEFT */}
            <div className="input-section">
              <div className="section-heading">
                <div>
                  <span className="step">01</span>
                  <div>
                    <h2>Players</h2>
                    <p>Enter one name per line</p>
                  </div>
                </div>

                <div className="player-count">
                  <strong>{totalPlayers}</strong>
                  <span>Players</span>
                </div>
              </div>

              <textarea
                value={namesText}
                onChange={(e) => setNamesText(e.target.value)}
                placeholder={`Enter player names...\nAyush\nRahul\nPriya`}
                spellCheck={false}
              />

              <div className="input-actions">
                <button
                  type="button"
                  onClick={loadSample}
                  className="secondary-btn"
                >
                  Load sample
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="clear-btn"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="settings-section">
              <div className="section-heading">
                <div>
                  <span className="step">02</span>
                  <div>
                    <h2>Teams</h2>
                    <p>Choose how many teams</p>
                  </div>
                </div>

                <div className="team-count">
                  {teamCount}
                </div>
              </div>

              <div className="team-options">
                {[2, 3, 4, 5, 6, 8].map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setTeamCount(number)}
                    className={
                      teamCount === number
                        ? "team-option active"
                        : "team-option"
                    }
                  >
                    {number}
                  </button>
                ))}
              </div>

              <div className="range-wrap">
                <div className="range-label">
                  <span>Custom team count</span>
                  <strong>{teamCount}</strong>
                </div>

                <input
                  type="range"
                  min="2"
                  max="10"
                  value={teamCount}
                  onChange={(e) =>
                    setTeamCount(Number(e.target.value))
                  }
                />
              </div>

              <div className="balance-box">
                <div className="balance-icon">⚖</div>

                <div>
                  <strong>Balanced teams</strong>
                  <p>
                    {totalPlayers > 0
                      ? `${totalPlayers} players will be split as evenly as possible.`
                      : "Add players to see the team balance."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={generateTeams}
                disabled={
                  isShuffling ||
                  totalPlayers < 2 ||
                  teamCount > totalPlayers
                }
                className="generate-btn"
              >
                <span>✦</span>
                Create Teams
                <span className="arrow">→</span>
              </button>
            </div>
          </section>
        )}

        {/* SHUFFLE SCREEN */}
        {isShuffling && (
          <section className="shuffle-screen">
            <div className="shuffle-top">
              <div className="shuffle-badge">
                <span className="pulse" />
                SHUFFLING PLAYERS
              </div>

              <h2>
                Mixing everyone...
              </h2>

              <p>
                Randomizing the teams fairly
              </p>
            </div>

            <div className="shuffle-box">
              <div className="shuffle-ring ring-one" />
              <div className="shuffle-ring ring-two" />

              <div className="shuffle-center">
                <div className="shuffle-icon">✦</div>
                <strong>RANDOMIZING</strong>
                <span>Fair distribution</span>
              </div>

              <div className="floating-name name-one">
                {displayedShuffleNames[0] || "Player"}
              </div>

              <div className="floating-name name-two">
                {displayedShuffleNames[1] || "Player"}
              </div>

              <div className="floating-name name-three">
                {displayedShuffleNames[2] || "Player"}
              </div>

              <div className="floating-name name-four">
                {displayedShuffleNames[3] || "Player"}
              </div>

              <div className="floating-name name-five">
                {displayedShuffleNames[4] || "Player"}
              </div>

              <div className="floating-name name-six">
                {displayedShuffleNames[5] || "Player"}
              </div>
            </div>

            <div className="shuffle-list">
              {displayedShuffleNames
                .slice(0, 12)
                .map((name, index) => (
                  <div
                    key={`${name}-${index}`}
                    className="shuffle-player"
                  >
                    <span>{index + 1}</span>
                    {name}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* RESULTS */}
        {!isShuffling && teams.length > 0 && (
          <section className="results-section">

            <div className="result-header">
              <div>
                <div className="success-label">
                  <span>✓</span>
                  TEAMS READY
                </div>

                <h2>
                  Your teams are ready.
                </h2>

                <p>
                  {totalPlayers} players · {teamCount} teams ·
                  Balanced distribution
                </p>
              </div>

              <button
                type="button"
                onClick={copyAll}
                className="copy-btn"
              >
                {copied ? "✓ Copied" : "Copy all"}
              </button>
            </div>

            <div className="teams-grid">
              {teams.map((team, index) => {
                const isVisible =
                  revealedTeams.includes(index);

                const teamName =
                  TEAM_NAMES[index % TEAM_NAMES.length];

                const color =
                  TEAM_COLORS[index % TEAM_COLORS.length];

                return (
                  <div
                    key={index}
                    className={
                      isVisible
                        ? "team-card visible"
                        : "team-card"
                    }
                    style={{
                      "--team-color": color,
                    } as React.CSSProperties}
                  >
                    <div className="team-card-top">
                      <div className="team-identity">
                        <div className="team-number">
                          {index + 1}
                        </div>

                        <div>
                          <h3>{teamName}</h3>
                          <span>Team {index + 1}</span>
                        </div>
                      </div>

                      <div className="members-count">
                        {team.length}
                      </div>
                    </div>

                    <div className="team-line" />

                    <div className="members">
                      {team.map((name, memberIndex) => (
                        <div
                          className="member"
                          key={`${name}-${memberIndex}`}
                        >
                          <div className="member-avatar">
                            {name.charAt(0).toUpperCase()}
                          </div>

                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="result-actions">
              <button
                type="button"
                onClick={generateTeams}
                className="shuffle-again"
              >
                ↻ Shuffle again
              </button>

              <button
                type="button"
                onClick={() => {
                  setTeams([]);
                  setRevealedTeams([]);
                }}
                className="edit-btn"
              >
                Edit players
              </button>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer>
          <span>100% Random</span>
          <span>•</span>
          <span>Balanced Teams</span>
          <span>•</span>
          <span>No Sign-up</span>
        </footer>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .team-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(108, 92, 231, 0.08),
              transparent 38%
            ),
            #f7f8fc;
          color: #151827;
          padding: 34px 18px 28px;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .team-shell {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
        }

        .hero {
          text-align: center;
          margin-bottom: 28px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          border: 1px solid #e5e7ef;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          color: #777b8c;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6c5ce7;
          box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.1);
        }

        .hero h1 {
          margin: 13px 0 5px;
          font-size: clamp(29px, 5vw, 44px);
          line-height: 1.05;
          letter-spacing: -0.045em;
          font-weight: 900;
          color: #161827;
        }

        .hero h1 span {
          color: #6c5ce7;
        }

        .hero p {
          margin: 0;
          color: #777b8c;
          font-size: 13px;
          font-weight: 500;
        }

        .builder-card {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 18px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #e7e9f0;
          border-radius: 22px;
          box-shadow:
            0 18px 60px rgba(31, 35, 55, 0.07),
            0 2px 8px rgba(31, 35, 55, 0.03);
        }

        .input-section,
        .settings-section {
          border: 1px solid #eceef4;
          border-radius: 17px;
          padding: 18px;
          background: #ffffff;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .section-heading > div:first-child {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .step {
          display: grid;
          place-items: center;
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: #f0edff;
          color: #6c5ce7;
          font-size: 10px;
          font-weight: 900;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 15px;
          font-weight: 850;
          letter-spacing: -0.01em;
        }

        .section-heading p {
          margin: 2px 0 0;
          font-size: 10px;
          color: #9296a5;
          font-weight: 500;
        }

        .player-count {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .player-count strong {
          color: #6c5ce7;
          font-size: 18px;
          font-weight: 900;
        }

        .player-count span {
          color: #9a9daa;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
        }

        textarea {
          display: block;
          width: 100%;
          height: 235px;
          resize: vertical;
          min-height: 160px;
          padding: 14px;
          border: 1px solid #e5e7ee;
          border-radius: 13px;
          background: #fafbfc;
          color: #171925;
          outline: none;
          font-family: inherit;
          font-size: 13px;
          line-height: 1.75;
          font-weight: 550;
          transition:
            border 0.2s,
            box-shadow 0.2s;
        }

        textarea::placeholder {
          color: #b0b3bd;
        }

        textarea:focus {
          border-color: #aaa0f1;
          box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.08);
          background: #ffffff;
        }

        .input-actions {
          display: flex;
          gap: 8px;
          margin-top: 9px;
        }

        .secondary-btn,
        .clear-btn {
          border: 1px solid #e7e8ef;
          background: #ffffff;
          color: #626676;
          border-radius: 9px;
          padding: 8px 11px;
          font-family: inherit;
          font-size: 10px;
          font-weight: 750;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .secondary-btn:hover {
          border-color: #c9c4f3;
          color: #6c5ce7;
        }

        .clear-btn {
          color: #e55353;
        }

        .clear-btn:hover {
          background: #fff6f6;
          border-color: #f3c5c5;
        }

        .team-count {
          display: grid;
          place-items: center;
          width: 35px;
          height: 35px;
          border-radius: 11px;
          background: #f0edff;
          color: #6c5ce7;
          font-size: 16px;
          font-weight: 900;
        }

        .team-options {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 7px;
        }

        .team-option {
          height: 43px;
          border: 1px solid #e6e7ee;
          border-radius: 11px;
          background: #fafbfc;
          color: #555968;
          font-family: inherit;
          font-size: 13px;
          font-weight: 850;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .team-option:hover {
          transform: translateY(-1px);
          border-color: #cfc9f6;
        }

        .team-option.active {
          background: #6c5ce7;
          border-color: #6c5ce7;
          color: white;
          box-shadow: 0 7px 20px rgba(108, 92, 231, 0.22);
        }

        .range-wrap {
          margin-top: 16px;
        }

        .range-label {
          display: flex;
          justify-content: space-between;
          color: #8b8e9d;
          font-size: 10px;
          font-weight: 650;
        }

        .range-label strong {
          color: #6c5ce7;
          font-size: 11px;
        }

        input[type="range"] {
          width: 100%;
          margin-top: 8px;
          accent-color: #6c5ce7;
          cursor: pointer;
        }

        .balance-box {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 15px;
          padding: 11px;
          border-radius: 12px;
          background: #f7f6ff;
          border: 1px solid #ebe8ff;
        }

        .balance-icon {
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          width: 31px;
          height: 31px;
          border-radius: 9px;
          background: white;
          color: #6c5ce7;
          font-size: 14px;
          font-weight: 900;
        }

        .balance-box strong {
          display: block;
          color: #37394a;
          font-size: 10px;
          font-weight: 850;
        }

        .balance-box p {
          margin: 2px 0 0;
          color: #8d90a0;
          font-size: 9px;
          line-height: 1.4;
        }

        .generate-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          height: 47px;
          margin-top: 13px;
          border: 0;
          border-radius: 12px;
          background: #161827;
          color: white;
          font-family: inherit;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.02em;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(22, 24, 39, 0.13);
          transition: 0.18s ease;
        }

        .generate-btn span:first-child {
          color: #a69cff;
        }

        .generate-btn .arrow {
          font-size: 15px;
          color: #b8b4ff;
        }

        .generate-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(22, 24, 39, 0.17);
        }

        .generate-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* SHUFFLE */

        .shuffle-screen {
          padding: 25px 0 8px;
          text-align: center;
        }

        .shuffle-top {
          margin-bottom: 20px;
        }

        .shuffle-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          border-radius: 999px;
          background: #f0edff;
          color: #6c5ce7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6c5ce7;
          animation: pulse 0.8s infinite;
        }

        .shuffle-top h2 {
          margin: 11px 0 4px;
          font-size: 25px;
          letter-spacing: -0.03em;
          font-weight: 900;
        }

        .shuffle-top p {
          margin: 0;
          color: #9296a5;
          font-size: 11px;
        }

        .shuffle-box {
          position: relative;
          width: min(100%, 580px);
          height: 310px;
          margin: 0 auto;
          overflow: hidden;
          border: 1px solid #e7e9f0;
          border-radius: 24px;
          background:
            radial-gradient(
              circle at center,
              rgba(108, 92, 231, 0.08),
              transparent 42%
            ),
            white;
          box-shadow:
            0 20px 60px rgba(31, 35, 55, 0.07);
        }

        .shuffle-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          border: 1px dashed rgba(108, 92, 231, 0.22);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: rotateRing 5s linear infinite;
        }

        .ring-one {
          width: 190px;
          height: 190px;
        }

        .ring-two {
          width: 285px;
          height: 285px;
          animation-direction: reverse;
          animation-duration: 7s;
        }

        .shuffle-center {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 120px;
          height: 120px;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          background: white;
          border: 1px solid #e8e9f0;
          box-shadow: 0 10px 35px rgba(108, 92, 231, 0.1);
          z-index: 3;
        }

        .shuffle-icon {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #6c5ce7;
          color: white;
          font-size: 13px;
          margin-bottom: 6px;
          animation: iconSpin 0.9s linear infinite;
        }

        .shuffle-center strong {
          font-size: 8px;
          letter-spacing: 0.12em;
          color: #37394a;
        }

        .shuffle-center span {
          margin-top: 2px;
          color: #a0a3ae;
          font-size: 7px;
        }

        .floating-name {
          position: absolute;
          z-index: 4;
          padding: 7px 11px;
          border: 1px solid #e8e9f0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 7px 20px rgba(31, 35, 55, 0.08);
          color: #454858;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
          animation: floatName 1s ease-in-out infinite alternate;
        }

        .name-one {
          left: 12%;
          top: 22%;
        }

        .name-two {
          right: 13%;
          top: 19%;
          animation-delay: 0.2s;
        }

        .name-three {
          left: 7%;
          bottom: 22%;
          animation-delay: 0.35s;
        }

        .name-four {
          right: 8%;
          bottom: 25%;
          animation-delay: 0.15s;
        }

        .name-five {
          left: 26%;
          top: 8%;
          animation-delay: 0.4s;
        }

        .name-six {
          right: 25%;
          bottom: 9%;
          animation-delay: 0.25s;
        }

        .shuffle-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          margin: 15px auto 0;
          max-width: 600px;
        }

        .shuffle-player {
          padding: 5px 8px;
          border-radius: 7px;
          background: white;
          border: 1px solid #e8e9ef;
          color: #7d808e;
          font-size: 8px;
          font-weight: 700;
          animation: playerFlash 0.45s ease-in-out infinite alternate;
        }

        .shuffle-player span {
          margin-right: 4px;
          color: #6c5ce7;
        }

        /* RESULTS */

        .results-section {
          animation: resultEnter 0.5s ease both;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 15px;
          margin-bottom: 17px;
        }

        .success-label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #16a36a;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .success-label span {
          display: grid;
          place-items: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e6f8f0;
          font-size: 9px;
        }

        .result-header h2 {
          margin: 7px 0 3px;
          font-size: 24px;
          line-height: 1;
          letter-spacing: -0.035em;
          font-weight: 900;
        }

        .result-header p {
          margin: 0;
          color: #9699a7;
          font-size: 10px;
          font-weight: 550;
        }

        .copy-btn {
          flex: 0 0 auto;
          padding: 9px 13px;
          border: 1px solid #e2e4eb;
          border-radius: 9px;
          background: white;
          color: #4d5060;
          font-family: inherit;
          font-size: 9px;
          font-weight: 850;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .copy-btn:hover {
          border-color: #bbb5ee;
          color: #6c5ce7;
        }

        .teams-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .team-card {
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(12px) scale(0.98);
          min-height: 170px;
          padding: 15px;
          border: 1px solid #e7e9ef;
          border-radius: 17px;
          background: white;
          box-shadow: 0 8px 28px rgba(31, 35, 55, 0.04);
        }

        .team-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition:
            opacity 0.35s ease,
            transform 0.35s ease;
        }

        .team-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 3px;
          background: var(--team-color);
        }

        .team-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .team-identity {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .team-number {
          display: grid;
          place-items: center;
          width: 31px;
          height: 31px;
          border-radius: 10px;
          background: color-mix(
            in srgb,
            var(--team-color) 12%,
            white
          );
          color: var(--team-color);
          font-size: 10px;
          font-weight: 900;
        }

        .team-identity h3 {
          margin: 0;
          color: #272938;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .team-identity span {
          display: block;
          margin-top: 1px;
          color: #a0a2ad;
          font-size: 8px;
          font-weight: 650;
        }

        .members-count {
          display: grid;
          place-items: center;
          min-width: 27px;
          height: 22px;
          padding: 0 7px;
          border-radius: 999px;
          background: #f5f6f8;
          color: #6f7280;
          font-size: 8px;
          font-weight: 850;
        }

        .team-line {
          width: 100%;
          height: 1px;
          margin: 13px 0 10px;
          background: #f0f1f4;
        }

        .members {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 6px;
        }

        .member {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
          padding: 6px 7px;
          border: 1px solid #f0f1f4;
          border-radius: 9px;
          background: #fafbfc;
        }

        .member-avatar {
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          width: 22px;
          height: 22px;
          border-radius: 7px;
          background: #f0edff;
          color: var(--team-color);
          font-size: 8px;
          font-weight: 900;
        }

        .member span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #555866;
          font-size: 9px;
          font-weight: 700;
        }

        .result-actions {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 15px;
        }

        .shuffle-again,
        .edit-btn {
          min-width: 125px;
          padding: 10px 14px;
          border-radius: 9px;
          font-family: inherit;
          font-size: 9px;
          font-weight: 850;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .shuffle-again {
          border: 0;
          background: #161827;
          color: white;
        }

        .shuffle-again:hover {
          transform: translateY(-1px);
        }

        .edit-btn {
          border: 1px solid #e3e5eb;
          background: white;
          color: #626574;
        }

        .edit-btn:hover {
          border-color: #c9c5ee;
          color: #6c5ce7;
        }

        footer {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          margin-top: 25px;
          color: #a5a8b2;
          font-size: 8px;
          font-weight: 700;
        }

        /* ANIMATIONS */

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes rotateRing {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes iconSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floatName {
          from {
            transform: translateY(-5px) rotate(-2deg);
          }
          to {
            transform: translateY(5px) rotate(2deg);
          }
        }

        @keyframes playerFlash {
          from {
            transform: scale(0.97);
            opacity: 0.6;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes resultEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 760px) {
          .team-page {
            padding: 22px 12px 22px;
          }

          .hero {
            margin-bottom: 20px;
          }

          .hero h1 {
            font-size: 32px;
          }

          .builder-card {
            grid-template-columns: 1fr;
            padding: 11px;
            border-radius: 18px;
          }

          .input-section,
          .settings-section {
            padding: 14px;
          }

          textarea {
            height: 190px;
          }

          .teams-grid {
            grid-template-columns: 1fr;
          }

          .shuffle-box {
            height: 285px;
          }

          .result-header {
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .team-page {
            padding-left: 10px;
            padding-right: 10px;
          }

          .hero h1 {
            font-size: 28px;
          }

          .hero p {
            font-size: 11px;
          }

          .team-options {
            grid-template-columns: repeat(6, 1fr);
          }

          .team-option {
            height: 39px;
          }

          .shuffle-box {
            height: 265px;
          }

          .ring-one {
            width: 155px;
            height: 155px;
          }

          .ring-two {
            width: 235px;
            height: 235px;
          }

          .shuffle-center {
            width: 105px;
            height: 105px;
          }

          .floating-name {
            font-size: 8px;
            padding: 6px 8px;
          }

          .name-one {
            left: 5%;
          }

          .name-two {
            right: 5%;
          }

          .name-three {
            left: 3%;
          }

          .name-four {
            right: 3%;
          }

          .name-five {
            left: 17%;
          }

          .name-six {
            right: 17%;
          }

          .members {
            grid-template-columns: 1fr;
          }

          .result-header {
            flex-direction: column;
          }

          .copy-btn {
            width: 100%;
          }

          .result-actions {
            flex-direction: column;
          }

          .shuffle-again,
          .edit-btn {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
