"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const TEAM_NAMES = [
  "Falcons", "Titans", "Warriors", "Strikers", "Phoenix",
  "Hawks", "Blazers", "Royals", "Panthers", "Dragons",
];

const TEAM_COLORS = [
  "#6C5CE7", "#0EA5A4", "#F59E0B", "#EF4444", "#2563EB",
  "#10B981", "#DB2777", "#7C3AED", "#0891B2", "#EA580C",
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

export default function TeamClient() {
  const [namesText, setNamesText] = useState("");
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleNames, setShuffleNames] = useState<string[]>([]);
  const [revealedTeams, setRevealedTeams] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState<{ team: number; index: number } | null>(null);
  const [error, setError] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const names = useMemo(() => {
    return namesText.split("\n").map((n) => n.trim()).filter(Boolean);
  }, [namesText]);

  const duplicates = useMemo(() => {
    const seen = new Set<string>();
    const dup = new Set<string>();
    names.forEach((n) => {
      const low = n.toLowerCase();
      if (seen.has(low)) dup.add(n);
      seen.add(low);
    });
    return Array.from(dup);
  }, [names]);

  const totalPlayers = names.length;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      revealTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const shuffleArray = (arr: string[]) => {
    const r = [...arr];
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  };

  const createTeams = (playerNames: string[]) => {
    const shuffled = shuffleArray(playerNames);
    const result: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((name, i) => result[i % teamCount].push(name));
    return result;
  };

  const generateTeams = () => {
    if (isShuffling) return;
    if (totalPlayers < 2) { setError("Kam se kam 2 players likho."); return; }
    if (teamCount > totalPlayers) { setError("Teams players se zyada nahi ho sakti."); return; }
    if (duplicates.length > 0) {
      setError(`"${duplicates[0]}" 2 baar hai, ek hata do.`);
      return;
    }
    setError(""); setTeams([]); setRevealedTeams([]); setCopied(false); setSelected(null); setIsShuffling(true);
    let ticks = 0;
    intervalRef.current = setInterval(() => {
      setShuffleNames(shuffleArray(names));
      ticks++;
      if (ticks >= 35) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const finalTeams = createTeams(names);
        setTimeout(() => {
          setTeams(finalTeams); setIsShuffling(false);
          finalTeams.forEach((_, idx) => {
            const t = setTimeout(() => setRevealedTeams((p) => [...p, idx]), idx * 180);
            revealTimeoutsRef.current.push(t);
          });
        }, 250);
      }
    }, 90);
  };

  const copyAll = async () => {
    if (!teams.length) return;
    const text = teams.map((team, i) => `${TEAM_NAMES[i % TEAM_NAMES.length]} — Team ${i + 1}\n${team.map((n) => `• ${n}`).join("\n")}`).join("\n\n");
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { alert(text); }
  };

  const movePlayer = (toTeam: number) => {
    if (!selected) return;
    const newTeams = teams.map((t) => [...t]);
    const removed = newTeams[selected.team].splice(selected.index, 1);
    const player = removed[0];
    if (!player) return;
    newTeams[toTeam].push(player);
    setTeams(newTeams); setSelected(null);
  };

  const moveUpDown = (dir: -1 | 1) => {
    if (!selected) return;
    const newTeams = teams.map((t) => [...t]);
    const arr = newTeams[selected.team];
    const ni = selected.index + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[selected.index], arr[ni]] = [arr[ni], arr[selected.index]];
    setTeams(newTeams); setSelected({ ...selected, index: ni });
  };

  const displayedShuffleNames = shuffleNames.length > 0 ? shuffleNames : names;

  return (
    <main className="team-page">
      <div className="team-shell">
        <header className="hero">
          <div className="hero-badge"><span className="badge-dot" /> FREE • RANDOM TEAM GENERATOR</div>
          <h1>Random Team <span>Generator</span></h1>
          <p>Create fair, balanced teams in seconds. No sign-up.</p>
        </header>

        {!isShuffling && teams.length === 0 && (
          <section className="builder-card">
            <div className="input-section">
              <div className="section-heading">
                <div><span className="step">01</span><div><h2>Players</h2><p>One name per line</p></div></div>
                <div className="player-count"><strong>{totalPlayers}</strong><span>Players</span></div>
              </div>
              <textarea value={namesText} onChange={(e) => { setNamesText(e.target.value); setError(""); }} placeholder={`Write players name...\nAyush\nRahul\nPriya`} spellCheck={false} />
              {duplicates.length > 0 && <div className="warn">⚠ {duplicates.join(", ")} duplicate hai</div>}
              {error && <div className="warn">{error}</div>}
              <div className="input-actions">
                <button type="button" onClick={() => setNamesText(SAMPLE)} className="secondary-btn">Load sample</button>
                <button type="button" onClick={() => { setNamesText(""); setError(""); }} className="clear-btn">Clear</button>
              </div>
              <p className="tip">Tip: Naam pe click karke team badal sakte ho.</p>
            </div>

            <div className="settings-section">
              <div className="section-heading">
                <div><span className="step">02</span><div><h2>Teams</h2><p>How many teams?</p></div></div>
                <div className="team-count">{teamCount}</div>
              </div>
              <div className="team-options">{[2,3,4,5,6,8].map((n) => (
                <button key={n} type="button" onClick={() => setTeamCount(n)} className={teamCount === n ? "team-option active" : "team-option"}>{n}</button>
              ))}</div>
              <div className="range-wrap">
                <div className="range-label"><span>Custom team count</span><strong>{teamCount}</strong></div>
                <input type="range" min="2" max="10" value={teamCount} onChange={(e) => setTeamCount(Number(e.target.value))} />
              </div>
              <div className="balance-box"><div className="balance-icon">⚖</div><div><strong>Balanced teams</strong><p>{totalPlayers > 0 ? `${totalPlayers} players • Har team me lagbhag barabar` : "Players add karo to balance dikhega."}</p></div></div>
              <button type="button" onClick={generateTeams} disabled={totalPlayers < 2 || teamCount > totalPlayers} className="generate-btn"><span>✦</span> Create Teams <span className="arrow">→</span></button>
            </div>
          </section>
        )}

        {isShuffling && (
          <section className="shuffle-screen">
            <div className="shuffle-top"><div className="shuffle-badge"><span className="pulse" /> SHUFFLING PLAYERS</div><h2>Mixing everyone...</h2><p>Randomizing fairly</p></div>
            <div className="shuffle-box">
              <div className="shuffle-ring ring-one" /><div className="shuffle-ring ring-two" />
              <div className="shuffle-center"><div className="shuffle-icon">✦</div><strong>RANDOMIZING</strong><span>Fair distribution</span></div>
              {[0,1,2,3,4,5].map((i) => (<div key={i} className={`floating-name name-${["one","two","three","four","five","six"][i]}`}>{displayedShuffleNames[i] || "Player"}</div>))}
            </div>
            <div className="shuffle-list">{displayedShuffleNames.slice(0,12).map((name, idx) => (<div key={`${name}-${idx}`} className="shuffle-player"><span>{idx+1}</span>{name}</div>))}</div>
          </section>
        )}

        {!isShuffling && teams.length > 0 && (
          <section className="results-section">
            <div className="result-header">
              <div><div className="success-label"><span>✓</span> TEAMS READY</div><h2>Your teams are ready.</h2><p>{totalPlayers} players • {teamCount} teams • Balanced</p></div>
              <button type="button" onClick={copyAll} className="copy-btn">{copied ? "✓ Copied" : "Copy all"}</button>
            </div>
            <p className="move-hint">Kisi bhi naam pe click karo — upar / neeche / dusri team me bhejo</p>
            <div className="teams-grid">
              {teams.map((team, idx) => {
                const isVisible = revealedTeams.includes(idx);
                const teamName = TEAM_NAMES[idx % TEAM_NAMES.length];
                const color = TEAM_COLORS[idx % TEAM_COLORS.length];
                return (
                  <div key={idx} className={isVisible ? "team-card visible" : "team-card"} style={{ "--team-color": color } as React.CSSProperties}>
                    <div className="team-card-top"><div className="team-identity"><div className="team-number">{idx+1}</div><div><h3>{teamName}</h3><span>Team {idx+1}</span></div></div><div className="members-count">{team.length} Players</div></div>
                    <div className="team-line" />
                    <div className="members">
                      {team.map((name, mi) => {
                        const isSel = selected?.team === idx && selected?.index === mi;
                        return (
                          <div key={`${name}-${mi}`} className="member-wrap">
                            <button type="button" onClick={() => setSelected(isSel ? null : { team: idx, index: mi })} className={isSel ? "member selected" : "member"}>
                              <div className="member-avatar">{name.charAt(0).toUpperCase()}</div><span className="member-name">{name}</span><em>{isSel ? "✕" : "⋮"}</em>
                            </button>
                            {isSel && (
                              <div className="move-box">
                                <div className="move-row"><button onClick={() => moveUpDown(-1)}>↑ Up</button><button onClick={() => moveUpDown(1)}>↓ Down</button></div>
                                <div className="move-label">Move to team:</div>
                                <div className="move-row">{teams.map((_, ti) => ti !== idx && (<button key={ti} onClick={() => movePlayer(ti)} className="move-team">{TEAM_NAMES[ti % TEAM_NAMES.length]}</button>))}</div>
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
              <button type="button" onClick={() => { setTeams([]); setRevealedTeams([]); setSelected(null); }} className="edit-btn">Edit players</button>
            </div>
          </section>
        )}
        <footer><span>100% Random</span><span>•</span><span>Balanced Teams</span><span>•</span><span>No Sign-up</span></footer>
      </div>

      <style jsx>{`
        *{box-sizing:border-box}
        /* SIDE ME JAANE WALA FIX - YEHI MAIN PROBLEM THI */
        .team-page{width:100%;max-width:100vw;overflow-x:hidden;min-height:100vh;background:radial-gradient(circle at 50% -10%, rgba(108,92,231,.12), transparent 38%), radial-gradient(circle at 95% 10%, rgba(14,165,164,.07), transparent 30%), #f6f7fb;color:#151827;padding:28px 12px 90px;font-family:"Plus Jakarta Sans",Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .team-shell{width:100%;max-width:980px;margin:0 auto;overflow:hidden}
        .hero{text-align:center;margin-bottom:24px;padding:0 4px}
        .hero-badge{display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border:1px solid #e5e7ef;border-radius:999px;background:#fff;color:#777b8c;font-size:9px;font-weight:800;letter-spacing:.12em}
        .badge-dot{width:6px;height:6px;border-radius:50%;background:#6c5ce7;box-shadow:0 0 0 4px rgba(108,92,231,.12)}
        .hero h1{margin:13px 0 6px;font-size:clamp(30px,8vw,46px);line-height:1.02;letter-spacing:-.05em;font-weight:900;color:#161827}
        .hero h1 span{background:linear-gradient(90deg,#6c5ce7,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .hero p{margin:0;color:#7a7d8c;font-size:12px;font-weight:500}
        .builder-card{display:grid;grid-template-columns:1.08fr .92fr;gap:16px;padding:16px;background:#fff;border:1px solid #e7e9f0;border-radius:24px;box-shadow:0 18px 60px rgba(31,35,55,.07);width:100%;overflow:hidden}
        .input-section,.settings-section{border:1px solid #eceef4;border-radius:18px;padding:18px;background:#fff;min-width:0}
        .section-heading{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:13px}
        .section-heading>div:first-child{display:flex;align-items:center;gap:10px}
        .step{display:grid;place-items:center;width:30px;height:30px;border-radius:9px;background:#f0edff;color:#6c5ce7;font-size:10px;font-weight:900}
        .section-heading h2{margin:0;font-size:17px;font-weight:900;letter-spacing:-.02em}
        .section-heading p{margin:2px 0 0;font-size:10px;color:#9296a5;font-weight:500}
        .player-count{display:flex;align-items:baseline;gap:4px}.player-count strong{color:#6c5ce7;font-size:19px;font-weight:900}.player-count span{color:#9a9daa;font-size:9px;font-weight:700;text-transform:uppercase}
        textarea{display:block;width:100%;height:235px;resize:vertical;min-height:160px;padding:14px;border:1px solid #e5e7ee;border-radius:13px;background:#fafbfc;color:#171925;outline:none;font-family:inherit;font-size:15px;line-height:1.75;font-weight:700;letter-spacing:-.01em}
        textarea::placeholder{color:#a8abb8;font-weight:600;font-size:14px}
        textarea:focus{border-color:#aaa0f1;box-shadow:0 0 0 4px rgba(108,92,231,.09);background:#fff}
        .warn{margin-top:8px;padding:8px 10px;border-radius:9px;background:#fff1f1;color:#d33;font-size:10px;font-weight:700}
        .input-actions{display:flex;gap:8px;margin-top:9px}
        .secondary-btn,.clear-btn{border:1px solid #e7e8ef;background:#fff;color:#626676;border-radius:9px;padding:8px 11px;font-family:inherit;font-size:10px;font-weight:750;cursor:pointer}
        .clear-btn{color:#e55353}
        .tip{margin:10px 0 0;color:#a0a3ae;font-size:9px;font-weight:600}
        .team-count{display:grid;place-items:center;width:35px;height:35px;border-radius:11px;background:#f0edff;color:#6c5ce7;font-size:16px;font-weight:900}
        .team-options{display:grid;grid-template-columns:repeat(6,1fr);gap:7px}
        .team-option{height:43px;border:1px solid #e6e7ee;border-radius:11px;background:#fafbfc;color:#555968;font-family:inherit;font-size:13px;font-weight:850;cursor:pointer;transition:.18s}
        .team-option.active{background:#6c5ce7;border-color:#6c5ce7;color:#fff;box-shadow:0 7px 20px rgba(108,92,231,.22)}
        .range-wrap{margin-top:16px}.range-label{display:flex;justify-content:space-between;color:#8b8e9d;font-size:10px;font-weight:650}.range-label strong{color:#6c5ce7;font-size:11px}
        input[type="range"]{width:100%;margin-top:8px;accent-color:#6c5ce7;cursor:pointer}
        .balance-box{display:flex;align-items:center;gap:10px;margin-top:15px;padding:11px;border-radius:12px;background:linear-gradient(135deg,#f7f6ff,#ecfdf5);border:1px solid #ebe8ff}
        .balance-icon{display:grid;place-items:center;flex:0 0 auto;width:31px;height:31px;border-radius:9px;background:#fff;color:#6c5ce7;font-size:14px}
        .balance-box strong{display:block;color:#37394a;font-size:11px;font-weight:850}.balance-box p{margin:2px 0 0;color:#8d90a0;font-size:9px;line-height:1.4}
        .generate-btn{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;height:50px;margin-top:13px;border:0;border-radius:14px;background:#161827;color:#fff;font-family:inherit;font-size:12px;font-weight:900;cursor:pointer;box-shadow:0 10px 24px rgba(22,24,39,.14)}
        .generate-btn:disabled{opacity:.45;cursor:not-allowed}
        .generate-btn span:first-child{color:#a69cff}.generate-btn .arrow{font-size:15px;color:#b8b4ff}
        .shuffle-screen{padding:25px 0 8px;text-align:center;width:100%;overflow:hidden}
        .shuffle-badge{display:inline-flex;align-items:center;gap:7px;padding:7px 11px;border-radius:999px;background:#f0edff;color:#6c5ce7;font-size:9px;font-weight:900;letter-spacing:.12em}
        .pulse{width:6px;height:6px;border-radius:50%;background:#6c5ce7;animation:pulse .8s infinite}
        .shuffle-top h2{margin:11px 0 4px;font-size:26px;letter-spacing:-.03em;font-weight:900}.shuffle-top p{margin:0;color:#9296a5;font-size:11px}
        .shuffle-box{position:relative;width:100%;max-width:580px;height:310px;margin:0 auto;overflow:hidden;border:1px solid #e7e9f0;border-radius:24px;background:radial-gradient(circle at center, rgba(108,92,231,.08), transparent 42%), #fff;box-shadow:0 20px 60px rgba(31,35,55,.07)}
        .shuffle-ring{position:absolute;left:50%;top:50%;border:1px dashed rgba(108,92,231,.22);border-radius:50%;transform:translate(-50%,-50%);animation:rotateRing 5s linear infinite}.ring-one{width:190px;height:190px}.ring-two{width:285px;height:285px;animation-direction:reverse;animation-duration:7s}
        .shuffle-center{position:absolute;left:50%;top:50%;width:120px;height:120px;transform:translate(-50%,-50%);display:flex;flex-direction:column;justify-content:center;align-items:center;border-radius:50%;background:#fff;border:1px solid #e8e9f0;box-shadow:0 10px 35px rgba(108,92,231,.1);z-index:3}
        .shuffle-icon{width:31px;height:31px;display:grid;place-items:center;border-radius:9px;background:#6c5ce7;color:#fff;font-size:13px;margin-bottom:6px;animation:iconSpin .9s linear infinite}.shuffle-center strong{font-size:8px;letter-spacing:.12em;color:#37394a}.shuffle-center span{margin-top:2px;color:#a0a3ae;font-size:7px}
        .floating-name{position:absolute;z-index:4;max-width:110px;overflow:hidden;text-overflow:ellipsis;padding:7px 11px;border:1px solid #e8e9f0;border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 7px 20px rgba(31,35,55,.08);color:#454858;font-size:10px;font-weight:800;white-space:nowrap;animation:floatName 1s ease-in-out infinite alternate}
        .name-one{left:6%;top:22%}.name-two{right:6%;top:19%;animation-delay:.2s}.name-three{left:4%;bottom:22%;animation-delay:.35s}.name-four{right:4%;bottom:25%;animation-delay:.15s}.name-five{left:22%;top:8%;animation-delay:.4s}.name-six{right:22%;bottom:9%;animation-delay:.25s}
        .shuffle-list{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:15px auto 0;max-width:600px}.shuffle-player{padding:5px 8px;border-radius:7px;background:#fff;border:1px solid #e8e9ef;color:#7d808e;font-size:8px;font-weight:700;animation:playerFlash .45s ease-in-out infinite alternate}.shuffle-player span{margin-right:4px;color:#6c5ce7}
        .results-section{animation:resultEnter .5s ease both;width:100%;overflow:hidden}
        .result-header{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:8px;padding:0 2px}
        .success-label{display:flex;align-items:center;gap:6px;color:#16a36a;font-size:8px;font-weight:900;letter-spacing:.12em}.success-label span{display:grid;place-items:center;width:16px;height:16px;border-radius:50%;background:#e6f8f0;font-size:9px}
        .result-header h2{margin:7px 0 3px;font-size:26px;line-height:1;letter-spacing:-.035em;font-weight:900}.result-header p{margin:0;color:#9699a7;font-size:10px;font-weight:550}
        .copy-btn{flex:0 0 auto;padding:9px 13px;border:1px solid #e2e4eb;border-radius:9px;background:#fff;color:#4d5060;font-family:inherit;font-size:9px;font-weight:850;cursor:pointer}
        .move-hint{text-align:center;color:#8b8e9d;font-size:10px;font-weight:600;margin:0 0 12px}
        .teams-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;width:100%}
        /* TEAM CARD - AB ANDAR SE COLOURFUL + CLEAN */
        .team-card{position:relative;overflow:hidden;opacity:0;transform:translateY(12px) scale(.98);min-height:170px;padding:16px;border:1px solid #e7e9ef;border-radius:20px;background:linear-gradient(180deg,#ffffff 0%, color-mix(in srgb, var(--team-color) 4%, white) 100%);box-shadow:0 10px 30px rgba(31,35,55,.05);width:100%;min-width:0}
        .team-card.visible{opacity:1;transform:translateY(0) scale(1);transition:opacity .35s ease, transform .35s ease}
        .team-card::before{content:"";position:absolute;left:0;top:0;width:100%;height:4px;background:var(--team-color)}
        .team-card-top{display:flex;justify-content:space-between;align-items:center;gap:8px}.team-identity{display:flex;align-items:center;gap:10px;min-width:0}
        .team-number{display:grid;place-items:center;flex:0 0 auto;width:34px;height:34px;border-radius:11px;background:var(--team-color);color:#fff;font-size:12px;font-weight:900;box-shadow:0 4px 12px color-mix(in srgb, var(--team-color) 35%, transparent)}
        .team-identity h3{margin:0;color:#1a1a2e;font-size:17px;font-weight:900;letter-spacing:-.02em;line-height:1}.team-identity span{display:block;margin-top:2px;color:#a0a2ad;font-size:8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
        .members-count{display:grid;place-items:center;flex:0 0 auto;min-width:28px;height:24px;padding:0 8px;border-radius:999px;background:#f1f2f5;color:#6f7280;font-size:8px;font-weight:850}
        .team-line{width:100%;height:1px;margin:13px 0 12px;background:#f0f1f4}
        .members{display:grid;grid-template-columns:1fr;gap:8px;width:100%}
        .member-wrap{width:100%;min-width:0}
        /* NAAM KA NAYA ATTRACTIVE FONT */
        .member{display:flex;align-items:center;gap:10px;width:100%;min-width:0;padding:10px 11px;border:1px solid #eef0f4;border-radius:12px;background:#fff;cursor:pointer;font-family:inherit;text-align:left;box-shadow:0 1px 3px rgba(0,0,0,.02)}
        .member.selected{border-color:var(--team-color);background:color-mix(in srgb, var(--team-color) 6%, white)}
        .member-avatar{display:grid;place-items:center;flex:0 0 auto;width:30px;height:30px;border-radius:10px;background:linear-gradient(135deg,var(--team-color),#a855f7);color:#fff;font-size:12px;font-weight:900}
        .member-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#18181b;font-size:14.5px;font-weight:800;letter-spacing:-.02em;line-height:1.2}
        .member em{font-style:normal;color:#a0a3ae;font-size:14px;flex:0 0 auto}
        .move-box{margin-top:6px;padding:8px;border-radius:10px;background:#fff;border:1px solid #ebe8ff;width:100%}
        .move-row{display:flex;gap:6px;flex-wrap:wrap}.move-row button{flex:1;min-width:0;padding:7px 6px;border:1px solid #e7e8ef;border-radius:8px;background:#fafbfc;font-size:9px;font-weight:800;cursor:pointer}.move-row .move-team{background:#f0edff;color:#6c5ce7;border-color:#e2ddff}
        .move-label{font-size:8px;font-weight:800;color:#8b8e9d;margin:7px 0 4px}
        .result-actions{display:flex;justify-content:center;gap:8px;margin-top:16px;width:100%}
        .shuffle-again,.edit-btn{min-width:125px;padding:11px 14px;border-radius:11px;font-family:inherit;font-size:10px;font-weight:850;cursor:pointer}
        .shuffle-again{border:0;background:#161827;color:#fff}.edit-btn{border:1px solid #e3e5eb;background:#fff;color:#626574}
        footer{display:flex;justify-content:center;align-items:center;gap:7px;margin-top:25px;color:#a5a8b2;font-size:8px;font-weight:700}
        @keyframes pulse{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.15)}}
        @keyframes rotateRing{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes iconSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes floatName{from{transform:translateY(-5px)}to{transform:translateY(5px)}}
        @keyframes playerFlash{from{transform:scale(.97);opacity:.6}to{transform:scale(1);opacity:1}}
        @keyframes resultEnter{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @media (max-width:760px){.team-page{padding:20px 10px 90px}.builder-card{grid-template-columns:1fr;padding:11px;border-radius:18px}.input-section,.settings-section{padding:14px}textarea{height:190px}.teams-grid{grid-template-columns:1fr}.shuffle-box{height:285px}.result-header{align-items:flex-start}}
        @media (max-width:480px){.team-page{padding-left:10px;padding-right:10px}.hero h1{font-size:30px}.shuffle-box{height:265px}.ring-one{width:155px;height:155px}.ring-two{width:235px;height:235px}.shuffle-center{width:105px;height:105px}.floating-name{font-size:9px;padding:6px 9px;max-width:95px}.members{grid-template-columns:1fr}.result-header{flex-direction:column}.copy-btn{width:100%}.result-actions{flex-direction:column}.shuffle-again,.edit-btn{width:100%}}
      `}</style>
    </main>
  );
}
