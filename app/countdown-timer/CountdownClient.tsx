"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";

type Preset = {
  label: string;
  icon: string;
  date: string;
};

const DEFAULT_TITLE = "New Year 2027";
const DEFAULT_DATE = "2027-01-01T00:00:00";
const STORAGE_KEY = "nexora-countdown";

const PRESETS: Preset[] = [
  { label: "New Year 2027", icon: "🎆", date: "2027-01-01T00:00:00" },
  { label: "Christmas 2026", icon: "🎄", date: "2026-12-25T00:00:00" },
  { label: "Birthday", icon: "🎂", date: "2026-12-31T00:00:00" },
  { label: "Exam", icon: "📚", date: "2026-12-01T09:00:00" },
  { label: "Wedding", icon: "💍", date: "2027-01-15T18:00:00" },
];

function getTimeParts(diff: number) {
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function CountdownClient() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [target, setTarget] = useState(DEFAULT_DATE);
  const [customDate, setCustomDate] = useState("");
  const [now, setNow] = useState(() => new Date());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [copied, setCopied] = useState(false);
  const celebratedRef = useRef(false);
  const hasLoadedRef = useRef(false);

  // PWA
  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isStandalone = (window.navigator as any).standalone === true || window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) setIsInstalled(true);
    if (isIOS && !isStandalone) setShowIOS(true);
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
      setDeferredPrompt(null);
      return;
    }
    setShowIOS(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 1. LOAD - Link sabse pehle, fir Saved, fir Default
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkTitle = params.get("t");
    const linkDate = params.get("d");

    // A. Agar Share Link se aaya hai
    if (linkTitle && linkDate && new Date(linkDate).getTime() > Date.now()) {
      const t = decodeURIComponent(linkTitle);
      setTitle(t);
      setTarget(linkDate);
      setCustomDate(linkDate);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ title: t, target: linkDate }));
      hasLoadedRef.current = true;
      return;
    }
    // B. Agar apne phone me pehle se save hai aur abhi bhi time bacha hai
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.target && new Date(data.target).getTime() > Date.now()) {
          setTitle(data.title || DEFAULT_TITLE);
          setTarget(data.target);
          setCustomDate(data.target);
          hasLoadedRef.current = true;
          return;
        } else {
          // Time khatam ho gaya hai to delete kar do, default dikhega
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch { localStorage.removeItem(STORAGE_KEY); }
    hasLoadedRef.current = true;
  }, []);

  // 2. SAVE - Jab tak pura nahi hoga tab tak save rahega
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    if (new Date(target).getTime() > Date.now()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, target }));
    }
  }, [title, target]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const diff = useMemo(() => new Date(target).getTime() - now.getTime(), [target, now]);
  const isComplete = diff <= 0;
  const time = getTimeParts(diff);

  // 3. KHATAM HOTE HI - Confetti + Auto Reset to Default
  useEffect(() => {
    if (isComplete && !celebratedRef.current && hasLoadedRef.current) {
      celebratedRef.current = true;
      const end = Date.now() + 2500;
      const colors = ["#6d5dfc", "#22c7a5", "#ffce54", "#ff6b9d"];
      (function frame() {
        confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors });
        confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
      setTimeout(() => { confetti({ particleCount: 180, spread: 100, origin: { y: 0.4 }, colors }); }, 300);

      // 5 second baad khud hi default pe aa jayega
      const resetTimer = setTimeout(() => {
        localStorage.removeItem(STORAGE_KEY);
        setTitle(DEFAULT_TITLE);
        setTarget(DEFAULT_DATE);
        setCustomDate("");
        celebratedRef.current = false;
        // URL se ?t= & ?d= bhi hata do taaki wapas wahi purana na khule
        window.history.replaceState({}, "", window.location.pathname);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
    if (!isComplete) celebratedRef.current = false;
  }, [isComplete]);

  const formattedTarget = useMemo(() => {
    const date = new Date(target);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" });
  }, [target]);

  const bigDate = useMemo(() => {
    const d = new Date(target);
    if (Number.isNaN(d.getTime())) return { day: "--", month: "", year: "", weekday: "" };
    return {
      day: String(d.getDate()).padStart(2, "0"),
      month: d.toLocaleString("en-IN", { month: "long" }),
      year: String(d.getFullYear()),
      weekday: d.toLocaleString("en-IN", { weekday: "long" }),
    };
  }, [target]);

  const selectPreset = (preset: Preset) => { setTitle(preset.label); setTarget(preset.date); };

  const startCustomCountdown = () => {
    if (!customDate) return;
    setTarget(customDate);
    if (!title.trim()) setTitle("My Countdown");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // SHARE - Dono ke phone me wahi countdown chalega
  const shareCountdown = async () => {
    const url = `${window.location.origin}${window.location.pathname}?t=${encodeURIComponent(title)}&d=${encodeURIComponent(target)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: title, text: `Countdown to ${title} - NEXORA`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
    }
  };

  return (
    <main className="countdown-page">
      <div className="countdown-wrap">
        <header className="countdown-header">
          <div className="brand-pill"><span className="brand-dot" /> Free Online Tool</div>
          <h1>Countdown Timer</h1>
          <p>Create a live countdown to any date, event, birthday, holiday, exam, wedding or special day.</p>
          {!isInstalled && (
            <button type="button" className="install-btn" onClick={handleInstall}>
              <span>📲</span><span>{deferredPrompt ? "Install App - Add to Home" : "Add to Home Screen"}</span><span className="install-arrow">↓</span>
            </button>
          )}
          {isInstalled && <div className="installed-pill">✓ Installed - Home Screen pe hai</div>}
          {showIOS && !isInstalled && <div className="ios-hint">iPhone me: <b>Share ↑</b> dabao → <b>Add to Home Screen</b> → <b>Add</b></div>}
        </header>

        <section className="date-banner">
          <div className="date-left">
            <span className="date-weekday">{bigDate.weekday}</span>
            <span className="date-month-year">{bigDate.month} • {bigDate.year}</span>
          </div>
          <div className="date-big">{bigDate.day}</div>
          <div className="date-right">
            <span className="date-label">TARGET DATE</span>
            <span className="date-full">{formattedTarget}</span>
          </div>
        </section>

        <section className="main-card">
          <div className="status-row">
            <span className={isComplete ? "status complete" : "status live"}>
              <span className="status-dot" />{isComplete ? "Countdown Complete" : "Live Countdown"}
            </span>
            <span className="target-mini">{formattedTarget}</span>
          </div>

          <div className="event-hero">
            <span className="event-icon-big">{isComplete ? "🎉" : "⏳"}</span>
            <div className="event-hero-right">
              <div className="event-label">{isComplete ? "IT'S TIME" : "COUNTING DOWN TO"}</div>
              <h2>{title || "My Countdown"}</h2>
              <div className="event-sub">Every second brings you closer ✨</div>
            </div>
            <span className="event-live-badge">LIVE</span>
          </div>

          {isComplete ? (
            <div className="complete-box">
              <div className="complete-emoji">🎉</div>
              <div className="complete-title">The countdown has ended!</div>
              <div className="complete-text">Your target time has arrived. 5 sec me wapas New Year countdown shuru ho jayega...</div>
            </div>
          ) : (
            <>
              <div className="timer-grid-new">
                <div className="time-card-new c1"><div className="time-num-new">{pad(time.days)}</div><div className="time-lab-new">DAYS</div><div className="time-dot-new" /></div>
                <div className="time-card-new c2"><div className="time-num-new">{pad(time.hours)}</div><div className="time-lab-new">HOURS</div><div className="time-dot-new" /></div>
                <div className="time-card-new c3"><div className="time-num-new">{pad(time.minutes)}</div><div className="time-lab-new">MINS</div><div className="time-dot-new" /></div>
                <div className="time-card-new c4"><div className="time-num-new">{pad(time.seconds)}</div><div className="time-lab-new">SECS</div><div className="time-dot-new" /></div>
              </div>
              <div className="progress-track"><div className="progress-fill" /></div>
            </>
          )}
          <div className="target-line">Target: <strong>{formattedTarget}</strong></div>

          {/* ===== TIMER KE NEECHE SHARE BUTTON ===== */}
          {!isComplete && (
            <>
              <button type="button" className="share-btn" onClick={shareCountdown}>
                <span>🔗</span>
                <span>{copied ? "Link Copied! ✅" : "Share This Countdown"}</span>
                <span>→</span>
              </button>
              <p className="save-note">✓ Ye countdown save ho gaya hai. Jab tak pura nahi hoga, yahi dikhega.</p>
            </>
          )}
        </section>

        <section className="section-card">
          <div className="section-heading">
            <div><span className="section-kicker">QUICK START</span><h3>Popular Countdown Events</h3></div>
            <span className="section-hint">Choose one to start instantly</span>
          </div>
          <div className="preset-grid">
            {PRESETS.map((preset) => (
              <button key={preset.label} type="button" onClick={() => selectPreset(preset)} className={`preset ${target === preset.date ? "active" : ""}`}>
                <span className="preset-icon">{preset.icon}</span><span className="preset-name">{preset.label}</span><span className="preset-arrow">→</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section-card custom-card">
          <div className="section-heading"><div><span className="section-kicker">MAKE YOUR OWN</span><h3>Create a Custom Countdown</h3></div></div>
          <div className="form-grid">
            <div className="field"><label htmlFor="countdown-title">Event name</label><input id="countdown-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. My Birthday" maxLength={60} /></div>
            <div className="field"><label htmlFor="countdown-date">Date and time</label><input id="countdown-date" type="datetime-local" value={customDate} onChange={(e) => setCustomDate(e.target.value)} /></div>
          </div>
          <button type="button" className="start-button" onClick={startCustomCountdown} disabled={!customDate}><span>Start Countdown</span><span>→</span></button>
        </section>

        <section className="info-grid">
          <div className="info-card"><div className="info-icon">⚡</div><h3>Live & Accurate</h3><p>The countdown updates every second so you can track your remaining time in real time.</p></div>
          <div className="info-card"><div className="info-icon">🔒</div><h3>Private & Simple</h3><p>No account or sign-up is required. Set your date and start counting down instantly.</p></div>
          <div className="info-card"><div className="info-icon">📱</div><h3>Works Everywhere</h3><p>Use the countdown timer on your phone, tablet or desktop without installing anything.</p></div>
        </section>

        <section className="content-card">
          <h2>Free Online Countdown Timer</h2>
          <p>Use this free countdown timer to count down to a specific date and time. It can be used for New Year, birthdays, weddings, exams, holidays, vacations, launches, meetings and other important events.</p>
          <p>Enter your event name, choose a date and time, and the timer will show the remaining days, hours, minutes and seconds in real time.</p>
          <div className="keyword-list"><span>Countdown Timer</span><span>Online Countdown</span><span>Countdown Clock</span><span>Days Countdown</span><span>Birthday Countdown</span><span>New Year Countdown</span><span>Exam Countdown</span><span>Wedding Countdown</span></div>
        </section>

        <section className="faq-card">
          <div className="section-kicker">FAQ</div>
          <h2>Countdown Timer Questions</h2>
          <div className="faq-item"><h3>What is a countdown timer?</h3><p>A countdown timer shows the amount of time remaining until a selected date and time.</p></div>
          <div className="faq-item"><h3>Can I create a countdown to my birthday?</h3><p>Yes. Enter your birthday date and time in the custom countdown section to create a live birthday countdown.</p></div>
          <div className="faq-item"><h3>Can I use this for an exam or wedding?</h3><p>Yes. You can create a countdown for exams, weddings, holidays, vacations, launches and any other future event.</p></div>
          <div className="faq-item"><h3>Is this countdown timer free?</h3><p>Yes. The countdown timer is free to use and does not require an account or sign-up.</p></div>
        </section>

        <footer className="countdown-footer"><div>Free • No Sign-up • Works on Mobile & Desktop</div><div className="footer-brand">THE NEXORA TOOLS</div></footer>
      </div>

      <style jsx>{`
        * { box-sizing: border-box; }
        .countdown-page { min-height: 100vh; background: radial-gradient(circle at top, #f7f8ff 0%, #ffffff 42%, #f7f8fb 100%); color: #10131a; padding: 34px 16px 70px; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .countdown-wrap { width: 100%; max-width: 920px; margin: 0 auto; }
        .countdown-header { text-align: center; max-width: 700px; margin: 0 auto 18px; }
        .brand-pill { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border: 1px solid #e7e9ef; background: rgba(255,255,255,0.85); border-radius: 999px; color: #69707d; font-size: 11px; font-weight: 700; letter-spacing: 0.4px; box-shadow: 0 4px 18px rgba(20,25,40,0.04); }
        .brand-dot { width: 7px; height: 7px; border-radius: 50%; background: #6d5dfc; box-shadow: 0 0 0 4px rgba(109,93,252,0.1); }
        .countdown-header h1 { margin: 15px 0 7px; font-size: clamp(30px, 7vw, 46px); line-height: 1.05; letter-spacing: -1.5px; font-weight: 850; }
        .countdown-header p { margin: 0 auto; color: #69717f; font-size: 14px; line-height: 1.6; max-width: 650px; }
        .install-btn { margin-top: 16px; display: inline-flex; align-items: center; gap: 10px; padding: 13px 20px; border: 0; border-radius: 999px; background: #171922; color: #fff; font-family: inherit; font-size: 13px; font-weight: 800; cursor: pointer; box-shadow: 0 12px 30px rgba(23,25,34,0.25); }
        .install-arrow { background: #6d5dfc; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 50%; font-size: 12px; }
        .installed-pill { margin: 16px auto 0; display: inline-block; padding: 9px 14px; border-radius: 999px; background: #e8f9f2; color: #168c72; font-size: 12px; font-weight: 800; }
        .ios-hint { margin: 12px auto 0; max-width: 420px; padding: 10px 12px; border-radius: 12px; background: #fff7e8; border: 1px solid #ffe9b8; color: #7a5a00; font-size: 11px; line-height: 1.5; }
        .date-banner { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 18px 22px; margin-bottom: 16px; border-radius: 24px; background: linear-gradient(135deg, #171922 0%, #3a2f9e 55%, #6d5dfc 100%); color: #fff; box-shadow: 0 18px 40px rgba(109,93,252,0.28); overflow: hidden; position: relative; }
        .date-banner::after { content: ""; position: absolute; right: -30px; top: -30px; width: 140px; height: 140px; border-radius: 50%; background: rgba(255,255,255,0.08); }
        .date-left { display: flex; flex-direction: column; z-index: 1; }
        .date-weekday { font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.85; }
        .date-month-year { margin-top: 4px; font-size: 15px; font-weight: 700; }
        .date-big { font-size: clamp(48px, 12vw, 72px); font-weight: 900; line-height: 1; letter-spacing: -3px; z-index: 1; font-variant-numeric: tabular-nums; }
        .date-right { text-align: right; z-index: 1; }
        .date-label { display: block; font-size: 9px; font-weight: 800; letter-spacing: 1.6px; opacity: 0.7; }
        .date-full { display: block; margin-top: 5px; font-size: 11px; line-height: 1.5; opacity: 0.95; max-width: 180px; }
        .main-card, .section-card, .info-card, .content-card, .faq-card { background: rgba(255,255,255,0.94); border: 1px solid #e8eaf0; box-shadow: 0 16px 45px rgba(24,30,50,0.06); }
        .main-card { border-radius: 28px; padding: 22px; overflow: hidden; position: relative; background: #ffffff; }
        .main-card::before { content: ""; position: absolute; left: 0; top: 0; width: 100%; height: 5px; background: linear-gradient(90deg, #6d5dfc, #22c7a5, #ffce54); }
        .status-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .status { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .status.live { color: #168c72; } .status.complete { color: #6d5dfc; }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
        .target-mini { color: #858b97; font-size: 11px; font-weight: 600; }
        .event-hero { display: flex; align-items: center; gap: 14px; margin: 18px 0 18px; padding: 16px; border-radius: 20px; background: linear-gradient(135deg, #f3f1ff 0%, #ffffff 55%, #e8fdf5 100%); border: 1px solid #ece9ff; position: relative; overflow: hidden; }
        .event-hero::after { content: ""; position: absolute; right: -20px; top: -20px; width: 90px; height: 90px; border-radius: 50%; background: rgba(109,93,252,0.08); }
        .event-icon-big { width: 56px; height: 56px; display: grid; place-items: center; border-radius: 18px; background: #ffffff; font-size: 26px; box-shadow: 0 10px 25px rgba(109,93,252,0.15); flex-shrink: 0; }
        .event-hero-right { flex: 1; min-width: 0; z-index: 1; }
        .event-label { color: #8b909b; font-size: 9px; font-weight: 800; letter-spacing: 1.6px; }
        .event-hero-right h2 { margin: 5px 0 3px; font-size: clamp(21px, 5.5vw, 29px); line-height: 1.1; letter-spacing: -0.6px; font-weight: 850; color: #171922; }
        .event-sub { color: #9a9fa8; font-size: 11px; font-weight: 600; }
        .event-live-badge { background: #171922; color: #fff; font-size: 8px; font-weight: 900; letter-spacing: 1.5px; padding: 6px 9px; border-radius: 999px; flex-shrink: 0; z-index: 1; }
        .timer-grid-new { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; }
        .time-card-new { min-width: 0; position: relative; padding: 18px 4px 14px; text-align: center; border-radius: 20px; overflow: hidden; }
        .time-card-new.c1 { background: linear-gradient(180deg, #f3f1ff, #ffffff); border: 1px solid #e3deff; }
        .time-card-new.c2 { background: linear-gradient(180deg, #e8fdf5, #ffffff); border: 1px solid #c8f5e6; }
        .time-card-new.c3 { background: linear-gradient(180deg, #fff7e0, #ffffff); border: 1px solid #ffe9a8; }
        .time-card-new.c4 { background: linear-gradient(180deg, #ffeef4, #ffffff); border: 1px solid #ffc9dd; }
        .time-num-new { font-size: clamp(28px, 8vw, 44px); line-height: 1; font-weight: 900; letter-spacing: -1px; color: #171922; font-variant-numeric: tabular-nums; }
        .time-lab-new { margin-top: 7px; font-size: 9px; font-weight: 900; letter-spacing: 1.2px; color: #7a7f8a; white-space: nowrap; }
        .time-dot-new { width: 5px; height: 5px; border-radius: 50%; background: #6d5dfc; margin: 8px auto 0; }
        .c2 .time-dot-new { background: #22c7a5; } .c3 .time-dot-new { background: #f5b800; } .c4 .time-dot-new { background: #ff6b9d; }
        .progress-track { margin-top: 16px; height: 6px; background: #f0f1f5; border-radius: 999px; overflow: hidden; }
        .progress-fill { width: 68%; height: 100%; border-radius: 999px; background: linear-gradient(90deg, #6d5dfc, #22c7a5); }
        .target-line { margin-top: 18px; color: #858b97; text-align: center; font-size: 11px; line-height: 1.5; }
        .target-line strong { color: #555b67; }
        .complete-box { text-align: center; padding: 22px 10px 18px; border-radius: 18px; background: #faf9ff; border: 1px solid #ece9ff; }
        .complete-emoji { font-size: 42px; } .complete-title { margin-top: 7px; font-size: 18px; font-weight: 800; } .complete-text { margin-top: 5px; color: #858b97; font-size: 12px; }
        .share-btn { width: 100%; margin-top: 16px; padding: 14px 16px; border: 1px solid #e1e4ea; border-radius: 13px; background: #f3f1ff; color: #171922; font-family: inherit; font-size: 12px; font-weight: 850; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; }
        .save-note { margin: 10px 0 0; text-align: center; color: #168c72; font-size: 11px; font-weight: 700; }
        .section-card { margin-top: 16px; border-radius: 22px; padding: 20px; }
        .section-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 15px; margin-bottom: 15px; }
        .section-kicker { display: block; color: #6d5dfc; font-size: 9px; font-weight: 850; letter-spacing: 1.4px; margin-bottom: 5px; }
        .section-heading h3 { margin: 0; font-size: 17px; letter-spacing: -0.2px; }
        .section-hint { color: #9a9fa8; font-size: 10px; }
        .preset-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 9px; }
        .preset { display: flex; align-items: center; gap: 7px; min-width: 0; padding: 12px 10px; border: 1px solid #e9ebf0; border-radius: 14px; background: #fafbfc; color: #252831; cursor: pointer; transition: 0.18s ease; text-align: left; }
        .preset:hover { transform: translateY(-1px); border-color: #d9d5ff; background: #f8f7ff; }
        .preset.active { border-color: #6d5dfc; background: #f3f1ff; box-shadow: inset 0 0 0 1px rgba(109,93,252,0.08); }
        .preset-icon { font-size: 18px; flex-shrink: 0; } .preset-name { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 11px; font-weight: 750; } .preset-arrow { margin-left: auto; color: #9ca1aa; font-size: 13px; }
        .custom-card { background: #fff; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field label { display: block; margin: 0 0 6px; color: #5f6570; font-size: 10px; font-weight: 800; }
        .field input { width: 100%; box-sizing: border-box; padding: 13px 13px; border: 1px solid #e1e4ea; border-radius: 12px; outline: none; background: #fbfcfd; color: #171a22; font-family: inherit; font-size: 13px; }
        .field input:focus { border-color: #8d82ff; box-shadow: 0 0 0 3px rgba(109,93,252,0.09); }
        .field input::placeholder { color: #a8adb5; }
        .start-button { width: 100%; margin-top: 13px; padding: 14px 16px; border: 0; border-radius: 13px; background: #171922; color: white; font-family: inherit; font-size: 12px; font-weight: 850; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; }
        .start-button:hover:not(:disabled) { background: #6d5dfc; }
        .start-button:disabled { opacity: 0.45; cursor: not-allowed; }
        .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 16px; }
        .info-card { border-radius: 20px; padding: 18px; }
        .info-icon { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 10px; background: #f3f2ff; font-size: 16px; }
        .info-card h3 { margin: 12px 0 5px; font-size: 14px; } .info-card p { margin: 0; color: #777d88; font-size: 11px; line-height: 1.65; }
        .content-card { margin-top: 16px; border-radius: 22px; padding: 23px; }
        .content-card h2 { margin: 0 0 10px; font-size: 20px; } .content-card p { margin: 0 0 9px; color: #686e79; font-size: 12px; line-height: 1.75; }
        .keyword-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 15px; }
        .keyword-list span { padding: 6px 9px; border: 1px solid #e8e9ee; background: #fafbfc; border-radius: 999px; color: #777d88; font-size: 9px; font-weight: 700; }
        .faq-card { margin-top: 16px; border-radius: 22px; padding: 23px; }
        .faq-card h2 { margin: 0 0 16px; font-size: 20px; }
        .faq-item { padding: 13px 0; border-top: 1px solid #edf0f3; } .faq-item h3 { margin: 0 0 5px; font-size: 13px; } .faq-item p { margin: 0; color: #737984; font-size: 11px; line-height: 1.65; }
        .countdown-footer { text-align: center; color: #9ca1aa; font-size: 9px; line-height: 1.8; margin-top: 25px; }
        .footer-brand { margin-top: 3px; color: #777d88; font-weight: 800; letter-spacing: 0.8px; }
        @media (max-width: 760px) {
          .countdown-page { padding: 22px 12px 50px; }
          .main-card { padding: 18px; border-radius: 21px; }
          .section-card, .content-card, .faq-card { padding: 17px; border-radius: 19px; }
          .preset-grid { grid-template-columns: repeat(2, 1fr); }
          .preset:last-child { grid-column: span 2; }
          .info-grid { grid-template-columns: 1fr; }
          .info-card { padding: 16px; }
        }
        @media (max-width: 520px) {
          .countdown-header h1 { font-size: 32px; }
          .countdown-header p { font-size: 12px; }
          .status-row { align-items: flex-start; }
          .target-mini { width: 100%; }
          .event-hero { padding: 13px; gap: 11px; }
          .event-icon-big { width: 48px; height: 48px; font-size: 22px; border-radius: 15px; }
          .event-live-badge { display: none; }
          .timer-grid-new { gap: 6px; }
          .time-card-new { padding: 15px 2px 11px; border-radius: 16px; }
          .time-num-new { font-size: 27px; letter-spacing: -0.5px; }
          .time-lab-new { font-size: 8px; letter-spacing: 0.8px; }
          .form-grid { grid-template-columns: 1fr; }
          .section-heading { align-items: flex-start; flex-direction: column; gap: 5px; }
          .section-hint { display: none; }
          .preset { padding: 11px 9px; } .preset-name { font-size: 10px; }
          .date-banner { padding: 16px; flex-wrap: wrap; }
          .date-big { font-size: 54px; }
          .date-right { width: 100%; text-align: left; }
          .date-full { max-width: 100%; }
        }
      `}</style>
    </main>
  );
}
