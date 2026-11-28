"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

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

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

type SelectedPlayer = {
  team: number;
  index: number;
};

export default function TeamClient() {
  const [namesText, setNamesText] = useState("");
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleNames, setShuffleNames] = useState<string[]>([]);
  const [revealedTeams, setRevealedTeams] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState<SelectedPlayer | null>(null);
  const [error, setError] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const names = useMemo(() => {
    return namesText
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter(Boolean);
  }, [namesText]);

  const duplicates = useMemo(() => {
    const seen = new Set<string>();
    const duplicateSet = new Set<string>();
    names.forEach((name) => {
      const normalized = name.toLocaleLowerCase();
      if (seen.has(normalized)) duplicateSet.add(name);
      seen.add(normalized);
    });
    return Array.from(duplicateSet);
  }, [names]);

  const totalPlayers = names.length;

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, params || {});
    }
  };

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
    const result: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((name, index) => {
      result[index % teamCount].push(name);
    });
    return result;
  };

  const clearAllTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    revealTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    revealTimeoutsRef.current = [];
  };

  const generateTeams = () => {
    if (isShuffling) return;
    if (totalPlayers < 2) {
      setError("Please enter at least 2 players.");
      trackEvent("team_generator_error", { reason: "not_enough_players" });
      return;
    }
    if (totalPlayers > 200) {
      setError("Please enter no more than 200 players.");
      trackEvent("team_generator_error", { reason: "player_limit" });
      return;
    }
    if (teamCount > totalPlayers) {
      setError("The number of teams cannot be greater than the number of players.");
      trackEvent("team_generator_error", { reason: "too_many_teams" });
      return;
    }
    if (duplicates.length > 0) {
      setError(`"${duplicates[0]}" appears more than once. Please remove the duplicate name.`);
      trackEvent("team_generator_error", { reason: "duplicate_name" });
      return;
    }

    clearAllTimers();
    setError("");
    setTeams([]);
    setRevealedTeams([]);
    setShuffleNames(shuffleArray(names));
    setCopied(false);
    setSelected(null);
    setIsShuffling(true);
    trackEvent("team_generator_started", { players: totalPlayers, teams: teamCount });

    let ticks = 0;
    intervalRef.current = setInterval(() => {
      setShuffleNames(shuffleArray(names));
      ticks += 1;
      if (ticks >= 35) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        const finalTeams = createTeams(names);
        const finishTimeout = setTimeout(() => {
          setTeams(finalTeams);
          setIsShuffling(false);
          trackEvent("team_generator_completed", { players: totalPlayers, teams: teamCount });
          finalTeams.forEach((_, index) => {
            const timeout = setTimeout(() => {
              setRevealedTeams((previous) => {
                if (previous.includes(index)) return previous;
                return [...previous, index];
              });
            }, index * 180);
            revealTimeoutsRef.current.push(timeout);
          });
        }, 250);
        revealTimeoutsRef.current.push(finishTimeout);
      }
    }, 90);
  };

  const copyAll = async () => {
    if (!teams.length) return;
    const text = teams
      .map(
        (team, index) =>
          `${TEAM_NAMES[index % TEAM_NAMES.length]} — Team ${index + 1}\n${team
            .map((name) => `• ${name}`)
            .join("\n")}`
      )
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      trackEvent("team_generator_copy", { players: totalPlayers, teams: teamCount });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert(text);
    }
  };

  const movePlayer = (toTeam: number) => {
    if (!selected) return;
    const newTeams = teams.map((team) => [...team]);
    const sourceTeam = newTeams[selected.team];
    if (!sourceTeam) return;
    const [player] = sourceTeam.splice(selected.index, 1);
    if (!player) return;
    newTeams[toTeam].push(player);
    setTeams(newTeams);
    setSelected(null);
    trackEvent("team_generator_player_moved", { from_team: selected.team + 1, to_team: toTeam + 1 });
  };

  const moveUpDown = (direction: -1 | 1) => {
    if (!selected) return;
    const newTeams = teams.map((team) => [...team]);
    const currentTeam = newTeams[selected.team];
    if (!currentTeam) return;
    const newIndex = selected.index + direction;
    if (newIndex < 0 || newIndex >= currentTeam.length) return;
    [currentTeam[selected.index], currentTeam[newIndex]] = [currentTeam[newIndex], currentTeam[selected.index]];
    setTeams(newTeams);
    setSelected({ ...selected, index: newIndex });
  };

  const resetTool = () => {
    clearAllTimers();
    setTeams([]);
    setRevealedTeams([]);
    setSelected(null);
    setCopied(false);
    setError("");
    setIsShuffling(false);
    setShuffleNames([]);
    trackEvent("team_generator_reset");
  };

  const displayedShuffleNames = shuffleNames.length > 0 ? shuffleNames : names;

  return (
    <main className="team-page">
      <div className="team-shell">
        <div className="topbar">
          <a href="/" className="brand">thenexora<span>tools</span></a>
          <a href="/" className="top-link">← All Tools</a>
        </div>

        <header className="hero">
          <div className="hero-badge"><span className="badge-dot" />FREE • RANDOM TEAM GENERATOR</div>
          <h1>Random Team <span>Generator</span></h1>
          <p>Create balanced random teams in seconds. Free, fast, and easy to use.</p>
        </header>

        {!isShuffling && teams.length === 0 && (
          <section className="builder-card" aria-label="Random Team Generator">
            <div className="input-section">
              <div className="section-heading">
                <div>
                  <span className="step">01</span>
                  <div><h2>Players</h2><p>Enter one name per line</p></div>
                </div>
                <div className="player-count"><strong>{totalPlayers}</strong><span>Players</span></div>
              </div>
              <label htmlFor="player-names" className="sr-only">Player names</label>
              <textarea
                id="player-names"
                value={namesText}
                onChange={(event) => { setNamesText(event.target.value); setError(""); }}
                placeholder={`Enter player names...\nAyush\nRahul\nPriya`}
                spellCheck={false}
                autoComplete="off"
                aria-describedby="player-tip"
              />
              {duplicates.length > 0 && (
                <div className="warn" role="alert"><strong>Duplicate name detected:</strong> {duplicates.join(", ")}</div>
              )}
              {error && <div className="warn" role="alert">{error}</div>}
              <div className="input-actions">
                <button type="button" onClick={() => { setNamesText(SAMPLE); setError(""); trackEvent("team_generator_sample_loaded"); }} className="secondary-btn">Load sample</button>
                <button type="button" onClick={() => { setNamesText(""); setError(""); }} className="clear-btn">Clear</button>
              </div>
              <p className="tip" id="player-tip">Tip: After generating teams, select a player to move or reorder them.</p>
            </div>

            <div className="settings-section">
              <div className="section-heading">
                <div>
                  <span className="step">02</span>
                  <div><h2>Teams</h2><p>Choose the number of teams</p></div>
                </div>
                <div className="team-count">{teamCount}</div>
              </div>
              <div className="team-options">
                {[2, 3, 4, 5, 6, 8].map((number) => (
                  <button key={number} type="button" onClick={() => { setTeamCount(number); setError(""); }} className={teamCount === number ? "team-option active" : "team-option"} aria-pressed={teamCount === number}>{number}</button>
                ))}
              </div>
              <div className="range-wrap">
                <div className="range-label"><span>Custom team count</span><strong>{teamCount}</strong></div>
                <input type="range" min="2" max="10" value={teamCount} onChange={(event) => { setTeamCount(Number(event.target.value)); setError(""); }} aria-label="Number of teams" />
              </div>
              <div className="balance-box">
                <div className="balance-icon">⚖</div>
                <div>
                  <strong>Balanced distribution</strong>
                  <p>{totalPlayers > 0 ? `${totalPlayers} players • Teams will be distributed as evenly as possible` : "Add players to see the team balance."}</p>
                </div>
              </div>
              <button type="button" onClick={generateTeams} disabled={totalPlayers < 2 || teamCount > totalPlayers || duplicates.length > 0 || totalPlayers > 200} className="generate-btn">
                <span>✦</span>Create Teams<span className="arrow">→</span>
              </button>
            </div>
          </section>
        )}

        {isShuffling && (
          <section className="shuffle-screen" aria-live="polite" aria-label="Creating random teams">
            <div className="shuffle-top">
              <div className="shuffle-badge"><span className="pulse" />SHUFFLING PLAYERS</div>
              <h2>Mixing everyone...</h2>
              <p>Randomizing the players fairly</p>
            </div>
            <div className="shuffle-box">
              <div className="shuffle-ring ring-one" />
              <div className="shuffle-ring ring-two" />
              <div className="shuffle-center">
                <div className="shuffle-icon">✦</div>
                <strong>RANDOMIZING</strong>
                <span>Balanced distribution</span>
              </div>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className={`floating-name name-${["one", "two", "three", "four", "five", "six"][index]}`}>
                  {displayedShuffleNames[index] || "Player"}
                </div>
              ))}
            </div>
            <div className="shuffle-list">
              {displayedShuffleNames.slice(0, 12).map((name, index) => (
                <div key={`${name}-${index}`} className="shuffle-player"><span>{index + 1}</span>{name}</div>
              ))}
            </div>
          </section>
        )}

        {!isShuffling && teams.length > 0 && (
          <section className="results-section" aria-label="Generated teams">
            <div className="result-header">
              <div>
                <div className="success-label"><span>✓</span>TEAMS READY</div>
                <h2>Your teams are ready.</h2>
                <p>{totalPlayers} players • {teamCount} teams • Balanced distribution</p>
              </div>
              <button type="button" onClick={copyAll} className="copy-btn">{copied ? "✓ Copied" : "Copy all"}</button>
            </div>
            <p className="move-hint">Select any player to reorder them or move them to another team.</p>
            <div className="teams-grid">
              {teams.map((team, teamIndex) => {
                const isVisible = revealedTeams.includes(teamIndex);
                const teamName = TEAM_NAMES[teamIndex % TEAM_NAMES.length];
                const color = TEAM_COLORS[teamIndex % TEAM_COLORS.length];
                return (
                  <div key={teamIndex} className={isVisible ? "team-card visible" : "team-card"} style={{ "--team-color": color } as CSSProperties}>
                    <div className="team-card-top">
                      <div className="team-identity">
                        <div className="team-number">{teamIndex + 1}</div>
                        <div><h3>{teamName}</h3><span>Team {teamIndex + 1}</span></div>
                      </div>
                      <div className="members-count">{team.length} {team.length === 1 ? "Player" : "Players"}</div>
                    </div>
                    <div className="team-line" />
                    <div className="members">
                      {team.map((name, memberIndex) => {
                        const isSelected = selected?.team === teamIndex && selected?.index === memberIndex;
                        return (
                          <div key={`${name}-${memberIndex}`} className="member-wrap">
                            <button type="button" onClick={() => setSelected(isSelected ? null : { team: teamIndex, index: memberIndex })} className={isSelected ? "member selected" : "member"} aria-expanded={isSelected} aria-label={`${name}. ${isSelected ? "Close player controls" : "Open player controls"}`}>
                              <div className="member-avatar">{name.charAt(0).toUpperCase()}</div>
                              <span className="member-name">{name}</span>
                              <em>{isSelected ? "✕" : "⋮"}</em>
                            </button>
                            {isSelected && (
                              <div className="move-box">
                                <div className="move-row">
                                  <button type="button" onClick={() => moveUpDown(-1)} disabled={memberIndex === 0}>↑ Up</button>
                                  <button type="button" onClick={() => moveUpDown(1)} disabled={memberIndex === team.length - 1}>↓ Down</button>
                                </div>
                                <div className="move-label">Move to team</div>
                                <div className="move-row">
                                  {teams.map((_, targetTeam) =>
                                    targetTeam !== teamIndex ? (
                                      <button key={targetTeam} type="button" onClick={() => movePlayer(targetTeam)} className="move-team">
                                        {TEAM_NAMES[targetTeam % TEAM_NAMES.length]}
                                      </button>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="result-actions">
              <button type="button" onClick={generateTeams} className="shuffle-again">↻ Shuffle again</button>
              <button type="button" onClick={resetTool} className="edit-btn">Edit players</button>
            </div>
          </section>
        )}

        {!isShuffling && teams.length === 0 && (
          <section className="seo-content">
            <div className="content-card">
              <span className="content-kicker">RANDOM TEAM MAKER</span>
              <h2>Free Random Team Generator</h2>
              <p>Create random teams quickly for school activities, sports, office games, group projects, gaming sessions, tournaments, and casual events. Enter your player names, choose the number of teams, and let the generator distribute everyone as evenly as possible.</p>
              <h3>How to use the Random Team Generator</h3>
              <ol>
                <li>Enter one player name per line.</li>
                <li>Choose how many teams you need.</li>
                <li>Select <strong>Create Teams</strong>.</li>
                <li>Review, reorder, or move players if needed.</li>
                <li>Copy the final teams when you are ready.</li>
              </ol>
              <h3>Built for sports, school, office, and games</h3>
              <p>Use the generator for football, cricket, basketball, volleyball, school groups, classroom activities, office events, gaming squads, team-building activities, tournaments, and other situations where players need to be divided into random groups.</p>
              <h3>Balanced random distribution</h3>
              <p>Players are shuffled before being distributed across the selected teams. When the total number of players cannot be divided equally, some teams will naturally contain one more player than others. This keeps the team sizes as even as possible.</p>
              <h3>Privacy-friendly by design</h3>
              <p>Player names entered into this tool are processed in your browser by the page. No account is required and no file upload is needed to create teams.</p>
            </div>
            <div className="faq-card">
              <span className="content-kicker">FAQ</span>
              <h2>Random Team Generator FAQ</h2>
              <details><summary>Is this Random Team Generator free?</summary><p>Yes. You can create random teams without signing up or creating an account.</p></details>
              <details><summary>How many players can I enter?</summary><p>You can enter up to 200 player names. This limit helps keep the tool fast and responsive on mobile devices and desktop browsers.</p></details>
              <details><summary>Can I create teams for cricket or football?</summary><p>Yes. You can use it for cricket, football, basketball, volleyball, gaming, school activities, office events, tournaments, and many other group activities.</p></details>
              <details><summary>Will the teams always have the same number of players?</summary><p>When the player count is not evenly divisible by the number of teams, some teams will contain one additional player. The distribution is kept as even as possible.</p></details>
              <details><summary>Can I move a player after teams are created?</summary><p>Yes. Select any player to move them to another team or change their position within their current team.</p></details>
              <details><summary>Do I need to install anything?</summary><p>No. The tool works directly in a modern web browser on phones, tablets, and desktop devices.</p></details>
            </div>
            <div className="related-card">
              <div>
                <span className="content-kicker">MORE TOOLS</span>
                <h2>Explore more useful tools</h2>
                <p>Use other free tools from thenexoratools for everyday calculations, conversions, and productivity tasks.</p>
              </div>
              <div className="related-links">
                <a href="/percentage-calculator">Percentage Calculator</a>
                <a href="/age-calculator">Age Calculator</a>
                <a href="/bmi-calculator">BMI Calculator</a>
                <a href="/discount-calculator">Discount Calculator</a>
              </div>
            </div>
          </section>
        )}

        <footer><span>Free to use</span><span>•</span><span>Randomized teams</span><span>•</span><span>No sign-up</span><span>•</span><span>thenexoratools</span></footer>
      </div>

      <style jsx>{`
        * { box-sizing: border-box; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        .team-page { width: 100%; max-width: 100vw; min-height: 100vh; overflow-x: hidden; background: radial-gradient(circle at 50% -10%, rgba(108,92,231,0.1), transparent 38%), radial-gradient(circle at 95% 10%, rgba(14,165,164,0.06), transparent 30%), #f6f7fb; color: #151827; padding: 20px 10px 70px; font-family: "Plus Jakarta Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .team-shell { width: 100%; max-width: 980px; margin: 0 auto; overflow: hidden; }
        .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 0 4px; }
        .brand { color: #151827; text-decoration: none; font-size: 16px; font-weight: 950; letter-spacing: -0.5px; }
        .brand span { color: #6c5ce7; }
        .top-link { color: #667085; text-decoration: none; font-size: 8.5px; font-weight: 850; }
        .hero { text-align: center; margin-bottom: 18px; padding: 0 4px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 9px; border: 1px solid #e5e7ef; border-radius: 999px; background: #fff; color: #777b8c; font-size: 7.5px; font-weight: 800; letter-spacing: 0.1em; }
        .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: #6c5ce7; box-shadow: 0 0 0 4px rgba(108,92,231,0.1); }
        .hero h1 { margin: 10px 0 4px; color: #161827; font-size: clamp(27px, 6.5vw, 42px); line-height: 1.02; letter-spacing: -0.055em; font-weight: 900; }
        .hero h1 span { background: linear-gradient(90deg,#6c5ce7,#a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { margin: 0; color: #7a7d8c; font-size: 9.5px; font-weight: 500; }
        .builder-card { display: grid; grid-template-columns: 1.08fr 0.92fr; gap: 12px; width: 100%; padding: 12px; overflow: hidden; border: 1px solid #e7e9f0; border-radius: 20px; background: #fff; box-shadow: 0 15px 50px rgba(31,35,55,0.055); }
        .input-section, .settings-section { min-width: 0; padding: 14px; border: 1px solid #eceef4; border-radius: 15px; background: #fff; }
        .section-heading { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 10px; }
        .section-heading > div:first-child { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .step { display: grid; place-items: center; width: 26px; height: 26px; flex: 0 0 auto; border-radius: 8px; background: #f0edff; color: #6c5ce7; font-size: 8px; font-weight: 900; }
        .section-heading h2 { margin: 0; font-size: 14px; font-weight: 900; letter-spacing: -0.02em; }
        .section-heading p { margin: 2px 0 0; color: #9296a5; font-size: 8px; font-weight: 500; }
        .player-count { display: flex; align-items: baseline; gap: 3px; flex: 0 0 auto; }
        .player-count strong { color: #6c5ce7; font-size: 16px; font-weight: 900; }
        .player-count span { color: #9a9daa; font-size: 7px; font-weight: 700; text-transform: uppercase; }
        textarea { display: block; width: 100%; height: 190px; min-height: 135px; resize: vertical; padding: 11px; border: 1px solid #e5e7ee; border-radius: 11px; outline: none; background: #fafbfc; color: #171925; font-family: inherit; font-size: 12px; line-height: 1.6; font-weight: 700; }
        textarea::placeholder { color: #a8abb8; font-size: 11px; font-weight: 600; }
        textarea:focus { border-color: #aaa0f1; background: #fff; box-shadow: 0 0 0 3px rgba(108,92,231,0.07); }
        .warn { margin-top: 7px; padding: 7px 9px; border-radius: 8px; background: #fff1f1; color: #d33; font-size: 8.5px; font-weight: 700; line-height: 1.4; }
        .input-actions { display: flex; gap: 6px; margin-top: 7px; }
        .secondary-btn, .clear-btn { padding: 6px 9px; border: 1px solid #e7e8ef; border-radius: 8px; background: #fff; color: #626676; font-family: inherit; font-size: 8px; font-weight: 750; cursor: pointer; }
        .clear-btn { color: #e55353; }
        .tip { margin: 7px 0 0; color: #a0a3ae; font-size: 7.5px; font-weight: 600; line-height: 1.4; }
        .team-count { display: grid; place-items: center; width: 30px; height: 30px; flex: 0 0 auto; border-radius: 9px; background: #f0edff; color: #6c5ce7; font-size: 14px; font-weight: 900; }
        .team-options { display: grid; grid-template-columns: repeat(6,1fr); gap: 5px; }
        .team-option { height: 36px; border: 1px solid #e6e7ee; border-radius: 9px; background: #fafbfc; color: #555968; font-family: inherit; font-size: 11px; font-weight: 850; cursor: pointer; }
        .team-option.active { border-color: #6c5ce7; background: #6c5ce7; color: #fff; box-shadow: 0 5px 15px rgba(108,92,231,0.18); }
        .range-wrap { margin-top: 11px; }
        .range-label { display: flex; justify-content: space-between; color: #8b8e9d; font-size: 8px; font-weight: 650; }
        .range-label strong { color: #6c5ce7; font-size: 9px; }
        input[type="range"] { width: 100%; margin-top: 6px; accent-color: #6c5ce7; cursor: pointer; }
        .balance-box { display: flex; align-items: center; gap: 8px; margin-top: 11px; padding: 8px; border: 1px solid #ebe8ff; border-radius: 10px; background: linear-gradient(135deg,#f7f6ff,#ecfdf5); }
        .balance-icon { display: grid; place-items: center; width: 28px; height: 28px; flex: 0 0 auto; border-radius: 8px; background: #fff; color: #6c5ce7; font-size: 12px; }
        .balance-box strong { display: block; color: #37394a; font-size: 9.5px; font-weight: 850; }
        .balance-box p { margin: 2px 0 0; color: #8d90a0; font-size: 7.5px; line-height: 1.4; }
        .generate-btn { display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%; height: 43px; margin-top: 10px; border: 0; border-radius: 11px; background: #161827; color: #fff; font-family: inherit; font-size: 10.5px; font-weight: 900; cursor: pointer; }
        .generate-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .shuffle-screen { width: 100%; overflow: hidden; padding: 20px 0 5px; text-align: center; }
        .shuffle-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 9px; border-radius: 999px; background: #f0edff; color: #6c5ce7; font-size: 7.5px; font-weight: 900; letter-spacing: 0.1em; }
        .pulse { width: 5px; height: 5px; border-radius: 50%; background: #6c5ce7; animation: pulse 0.8s infinite; }
        .shuffle-top h2 { margin: 9px 0 3px; font-size: 23px; letter-spacing: -0.03em; font-weight: 900; }
        .shuffle-top p { margin: 0; color: #9296a5; font-size: 9px; }
        .shuffle-box { position: relative; width: 100%; max-width: 550px; height: 275px; margin: 0 auto; overflow: hidden; border: 1px solid #e7e9f0; border-radius: 20px; background: radial-gradient(circle at center, rgba(108,92,231,0.07), transparent 42%), #fff; box-shadow: 0 17px 50px rgba(31,35,55,0.055); }
        .shuffle-ring { position: absolute; left: 50%; top: 50%; border: 1px dashed rgba(108,92,231,0.22); border-radius: 50%; transform: translate(-50%,-50%); animation: rotateRing 5s linear infinite; }
        .ring-one { width: 175px; height: 175px; }
        .ring-two { width: 255px; height: 255px; animation-direction: reverse; animation-duration: 7s; }
        .shuffle-center { position: absolute; left: 50%; top: 50%; z-index: 3; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 108px; height: 108px; transform: translate(-50%,-50%); border: 1px solid #e8e9f0; border-radius: 50%; background: #fff; box-shadow: 0 9px 28px rgba(108,92,231,0.09); }
        .shuffle-icon { display: grid; place-items: center; width: 28px; height: 28px; margin-bottom: 5px; border-radius: 8px; background: #6c5ce7; color: #fff; font-size: 11px; animation: iconSpin 0.9s linear infinite; }
        .shuffle-center strong { color: #37394a; font-size: 6.5px; letter-spacing: 0.12em; }
        .shuffle-center span { margin-top: 2px; color: #a0a3ae; font-size: 6px; }
        .floating-name { position: absolute; z-index: 4; max-width: 105px; overflow: hidden; padding: 6px 9px; border: 1px solid #e8e9f0; border-radius: 999px; background: rgba(255,255,255,0.94); color: #454858; font-size: 8.5px; font-weight: 800; text-overflow: ellipsis; white-space: nowrap; animation: floatName 1s ease-in-out infinite alternate; }
        .name-one { left: 6%; top: 22%; }
        .name-two { right: 6%; top: 19%; animation-delay: 0.2s; }
        .name-three { left: 4%; bottom: 22%; animation-delay: 0.35s; }
        .name-four { right: 4%; bottom: 25%; animation-delay: 0.15s; }
        .name-five { left: 22%; top: 8%; animation-delay: 0.4s; }
        .name-six { right: 22%; bottom: 9%; animation-delay: 0.25s; }
        .shuffle-list { display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; max-width: 600px; margin: 12px auto 0; }
        .shuffle-player { padding: 4px 7px; border: 1px solid #e8e9ef; border-radius: 7px; background: #fff; color: #7d808e; font-size: 7px; font-weight: 700; animation: playerFlash 0.45s ease-in-out infinite alternate; }
        .shuffle-player span { margin-right: 3px; color: #6c5ce7; }
        .results-section { width: 100%; overflow: hidden; animation: resultEnter 0.5s ease both; }
        .result-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 10px; margin-bottom: 7px; padding: 0 2px; }
        .success-label { display: flex; align-items: center; gap: 5px; color: #16a36a; font-size: 7px; font-weight: 900; letter-spacing: 0.12em; }
        .success-label span { display: grid; place-items: center; width: 15px; height: 15px; border-radius: 50%; background: #e6f8f0; font-size: 8px; }
        .result-header h2 { margin: 6px 0 3px; font-size: 23px; line-height: 1; letter-spacing: -0.035em; font-weight: 900; }
        .result-header p { margin: 0; color: #9699a7; font-size: 8.5px; font-weight: 550; }
        .copy-btn { flex: 0 0 auto; padding: 8px 11px; border: 1px solid #e2e4eb; border-radius: 8px; background: #fff; color: #4d5060; font-family: inherit; font-size: 7.5px; font-weight: 850; cursor: pointer; }
        .move-hint { margin: 0 0 9px; color: #8b8e9d; font-size: 8px; font-weight: 600; text-align: center; }
        .teams-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 9px; width: 100%; }
        .team-card { position: relative; width: 100%; min-width: 0; min-height: 155px; padding: 13px; overflow: hidden; opacity: 0; transform: translateY(9px) scale(0.985); border: 1px solid #e7e9ef; border-radius: 17px; background: #fff; box-shadow: 0 8px 25px rgba(31,35,55,0.04); }
        .team-card.visible { opacity: 1; transform: translateY(0) scale(1); transition: opacity 0.35s ease, transform 0.35s ease; }
        .team-card::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--team-color); }
        .team-card-top { display: flex; justify-content: space-between; align-items: center; gap: 7px; }
        .team-identity { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .team-number { display: grid; place-items: center; width: 30px; height: 30px; flex: 0 0 auto; border-radius: 9px; background: var(--team-color); color: #fff; font-size: 10px; font-weight: 900; }
        .team-identity h3 { margin: 0; color: #1a1a2e; font-size: 14px; font-weight: 900; }
        .team-identity span { display: block; margin-top: 2px; color: #a0a2ad; font-size: 6.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
        .members-count { display: grid; place-items: center; min-width: 25px; height: 21px; padding: 0 7px; flex: 0 0 auto; border-radius: 999px; background: #f1f2f5; color: #6f7280; font-size: 6.5px; font-weight: 850; }
        .team-line { width: 100%; height: 1px; margin: 10px 0 9px; background: #f0f1f4; }
        .members { display: grid; grid-template-columns: 1fr; gap: 5px; width: 100%; }
        .member-wrap { width: 100%; min-width: 0; }
        .member { display: flex; align-items: center; gap: 7px; width: 100%; min-width: 0; padding: 7px 8px; border: 1px solid #eef0f4; border-radius: 9px; background: #fff; color: inherit; font-family: inherit; text-align: left; cursor: pointer; }
        .member.selected { border-color: var(--team-color); background: #faf9ff; }
        .member-avatar { display: grid; place-items: center; width: 26px; height: 26px; flex: 0 0 auto; border-radius: 8px; background: var(--team-color); color: #fff; font-size: 9px; font-weight: 900; }
        .member-name { flex: 1; min-width: 0; overflow: hidden; color: #18181b; font-size: 12px; font-weight: 800; text-overflow: ellipsis; white-space: nowrap; }
        .member em { flex: 0 0 auto; color: #a0a3ae; font-size: 12px; font-style: normal; }
        .move-box { width: 100%; margin-top: 5px; padding: 7px; border: 1px solid #ebe8ff; border-radius: 9px; background: #fff; }
        .move-row { display: flex; flex-wrap: wrap; gap: 5px; }
        .move-row button { flex: 1; min-width: 0; padding: 6px 5px; border: 1px solid #e7e8ef; border-radius: 7px; background: #fafbfc; font-family: inherit; font-size: 7.5px; font-weight: 800; cursor: pointer; }
        .move-row button:disabled { opacity: 0.4; cursor: not-allowed; }
        .move-row .move-team { border-color: #e2ddff; background: #f0edff; color: #6c5ce7; }
        .move-label { margin: 6px 0 4px; color: #8b8e9d; font-size: 6.5px; font-weight: 800; }
        .result-actions { display: flex; justify-content: center; gap: 6px; width: 100%; margin-top: 12px; }
        .shuffle-again, .edit-btn { min-width: 115px; padding: 8px 11px; border-radius: 9px; font-family: inherit; font-size: 8px; font-weight: 850; cursor: pointer; }
        .shuffle-again { border: 0; background: #161827; color: #fff; }
        .edit-btn { border: 1px solid #e3e5eb; background: #fff; color: #626574; }
        .seo-content { display: grid; gap: 9px; margin-top: 22px; }
        .content-card, .faq-card, .related-card { padding: 17px; border: 1px solid #e7e9f0; border-radius: 16px; background: #fff; }
        .content-kicker { display: inline-block; color: #6c5ce7; font-size: 6.5px; font-weight: 900; letter-spacing: 0.13em; }
        .seo-content h2 { margin: 5px 0 7px; color: #191b29; font-size: 18px; font-weight: 900; }
        .seo-content h3 { margin: 15px 0 5px; color: #292b38; font-size: 11px; font-weight: 900; }
        .seo-content p, .seo-content li { color: #777b8b; font-size: 9px; line-height: 1.65; }
        .faq-card details { padding: 9px 0; border-top: 1px solid #eef0f4; }
        .faq-card summary { cursor: pointer; color: #303240; font-size: 9.5px; font-weight: 850; list-style: none; }
        .faq-card summary::-webkit-details-marker { display: none; }
        .faq-card summary::after { content: "+"; float: right; color: #6c5ce7; font-size: 12px; }
        .faq-card details[open] summary::after { content: "−"; }
        .related-card { display: flex; justify-content: space-between; align-items: center; gap: 18px; }
        .related-links { display: grid; grid-template-columns: repeat(2,minmax(120px,1fr)); gap: 5px; width: 320px; max-width: 100%; }
        .related-links a { display: block; padding: 7px 8px; border: 1px solid #e9eaf0; border-radius: 8px; background: #fafbfc; color: #575a69; text-decoration: none; font-size: 7.5px; font-weight: 800; }
        footer { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 5px; margin-top: 20px; color: #a5a8b2; font-size: 6.5px; font-weight: 700; }
        @keyframes pulse { 0%,100% { opacity: 0.35; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.15); } }
        @keyframes rotateRing { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes iconSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes floatName { from { transform: translateY(-4px); } to { transform: translateY(4px); } }
        @keyframes playerFlash { from { transform: scale(0.97); opacity: 0.6; } to { transform: scale(1); opacity: 1; } }
        @keyframes resultEnter { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 760px) { .builder-card { grid-template-columns: 1fr; } .teams-grid { grid-template-columns: 1fr; } .related-card { display: block; } .related-links { width: 100%; margin-top: 11px; } }
        @media (max-width: 480px) { .result-header { flex-direction: column; } .copy-btn { width: 100%; } .result-actions { flex-direction: column; } .shuffle-again, .edit-btn { width: 100%; } .related-links { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; } }
      `}</style>
    </main>
  );
}
