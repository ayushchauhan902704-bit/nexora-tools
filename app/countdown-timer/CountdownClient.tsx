"use client";

import { useEffect, useMemo, useState } from "react";

type Preset = {
  label: string;
  icon: string;
  date: string;
};

const PRESETS: Preset[] = [
  {
    label: "New Year 2027",
    icon: "🎆",
    date: "2027-01-01T00:00:00",
  },
  {
    label: "Christmas 2026",
    icon: "🎄",
    date: "2026-12-25T00:00:00",
  },
  {
    label: "Birthday",
    icon: "🎂",
    date: "2026-12-31T00:00:00",
  },
  {
    label: "Exam",
    icon: "📚",
    date: "2026-12-01T09:00:00",
  },
  {
    label: "Wedding",
    icon: "💍",
    date: "2027-01-15T18:00:00",
  },
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

function TimeBox({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="count-box">
      <div className="count-number">{pad(value)}</div>
      <div className="count-label">{label}</div>
    </div>
  );
}

export default function CountdownClient() {
  const [title, setTitle] = useState("New Year 2027");
  const [target, setTarget] = useState("2027-01-01T00:00:00");
  const [customDate, setCustomDate] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const diff = useMemo(() => {
    return new Date(target).getTime() - now.getTime();
  }, [target, now]);

  const isComplete = diff <= 0;
  const time = getTimeParts(diff);

  const formattedTarget = useMemo(() => {
    const date = new Date(target);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }, [target]);

  const selectPreset = (preset: Preset) => {
    setTitle(preset.label);
    setTarget(preset.date);
  };

  const startCustomCountdown = () => {
    if (!customDate) return;

    setTarget(customDate);

    if (!title.trim()) {
      setTitle("My Countdown");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="countdown-page">
      <div className="countdown-wrap">

        {/* HEADER */}
        <header className="countdown-header">
          <div className="brand-pill">
            <span className="brand-dot" />
            Free Online Tool
          </div>

          <h1>Countdown Timer</h1>

          <p>
            Create a live countdown to any date, event, birthday, holiday,
            exam, wedding or special day.
          </p>
        </header>

        {/* MAIN COUNTDOWN */}
        <section className="main-card">

          <div className="status-row">
            <span className={isComplete ? "status complete" : "status live"}>
              <span className="status-dot" />
              {isComplete ? "Countdown Complete" : "Live Countdown"}
            </span>

            <span className="target-mini">
              {formattedTarget}
            </span>
          </div>

          <div className="event-title">
            <span className="event-icon">
              {isComplete ? "🎉" : "⏳"}
            </span>

            <div>
              <div className="event-label">
                {isComplete ? "IT'S TIME" : "COUNTING DOWN TO"}
              </div>

              <h2>
                {title || "My Countdown"}
              </h2>
            </div>
          </div>

          {isComplete ? (
            <div className="complete-box">
              <div className="complete-emoji">🎉</div>
              <div className="complete-title">
                The countdown has ended!
              </div>
              <div className="complete-text">
                Your target time has arrived.
              </div>
            </div>
          ) : (
            <div className="timer-grid">
              <TimeBox value={time.days} label="DAYS" />
              <TimeBox value={time.hours} label="HOURS" />
              <TimeBox value={time.minutes} label="MINUTES" />
              <TimeBox value={time.seconds} label="SECONDS" />
            </div>
          )}

          <div className="target-line">
            Target: <strong>{formattedTarget}</strong>
          </div>
        </section>

        {/* QUICK PRESETS */}
        <section className="section-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">QUICK START</span>
              <h3>Popular Countdown Events</h3>
            </div>

            <span className="section-hint">
              Choose one to start instantly
            </span>
          </div>

          <div className="preset-grid">
            {PRESETS.map((preset) => {
              const active = target === preset.date;

              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => selectPreset(preset)}
                  className={`preset ${active ? "active" : ""}`}
                >
                  <span className="preset-icon">{preset.icon}</span>

                  <span className="preset-name">
                    {preset.label}
                  </span>

                  <span className="preset-arrow">→</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* CUSTOM COUNTDOWN */}
        <section className="section-card custom-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">MAKE YOUR OWN</span>
              <h3>Create a Custom Countdown</h3>
            </div>
          </div>

          <div className="form-grid">

            <div className="field">
              <label htmlFor="countdown-title">
                Event name
              </label>

              <input
                id="countdown-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My Birthday"
                maxLength={60}
              />
            </div>

            <div className="field">
              <label htmlFor="countdown-date">
                Date and time
              </label>

              <input
                id="countdown-date"
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            </div>

          </div>

          <button
            type="button"
            className="start-button"
            onClick={startCustomCountdown}
            disabled={!customDate}
          >
            <span>Start Countdown</span>
            <span>→</span>
          </button>
        </section>

        {/* WHY USE */}
        <section className="info-grid">

          <div className="info-card">
            <div className="info-icon">⚡</div>
            <h3>Live & Accurate</h3>
            <p>
              The countdown updates every second so you can track your
              remaining time in real time.
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">🔒</div>
            <h3>Private & Simple</h3>
            <p>
              No account or sign-up is required. Set your date and start
              counting down instantly.
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">📱</div>
            <h3>Works Everywhere</h3>
            <p>
              Use the countdown timer on your phone, tablet or desktop
              without installing anything.
            </p>
          </div>

        </section>

        {/* SEO CONTENT */}
        <section className="content-card">

          <h2>Free Online Countdown Timer</h2>

          <p>
            Use this free countdown timer to count down to a specific
            date and time. It can be used for New Year, birthdays,
            weddings, exams, holidays, vacations, launches, meetings
            and other important events.
          </p>

          <p>
            Enter your event name, choose a date and time, and the timer
            will show the remaining days, hours, minutes and seconds
            in real time.
          </p>

          <div className="keyword-list">
            <span>Countdown Timer</span>
            <span>Online Countdown</span>
            <span>Countdown Clock</span>
            <span>Days Countdown</span>
            <span>Birthday Countdown</span>
            <span>New Year Countdown</span>
            <span>Exam Countdown</span>
            <span>Wedding Countdown</span>
          </div>

        </section>

        {/* FAQ */}
        <section className="faq-card">

          <div className="section-kicker">FAQ</div>

          <h2>Countdown Timer Questions</h2>

          <div className="faq-item">
            <h3>What is a countdown timer?</h3>
            <p>
              A countdown timer shows the amount of time remaining until
              a selected date and time.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I create a countdown to my birthday?</h3>
            <p>
              Yes. Enter your birthday date and time in the custom
              countdown section to create a live birthday countdown.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I use this for an exam or wedding?</h3>
            <p>
              Yes. You can create a countdown for exams, weddings,
              holidays, vacations, launches and any other future event.
            </p>
          </div>

          <div className="faq-item">
            <h3>Is this countdown timer free?</h3>
            <p>
              Yes. The countdown timer is free to use and does not
              require an account or sign-up.
            </p>
          </div>

        </section>

        <footer className="countdown-footer">
          <div>Free • No Sign-up • Works on Mobile & Desktop</div>
          <div className="footer-brand">THE NEXORA TOOLS</div>
        </footer>

      </div>

      <style jsx>{`
        .countdown-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top, #f7f8ff 0%, #ffffff 42%, #f7f8fb 100%);
          color: #10131a;
          padding: 34px 16px 70px;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .countdown-wrap {
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
        }

        .countdown-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 26px;
        }

        .brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border: 1px solid #e7e9ef;
          background: rgba(255,255,255,0.85);
          border-radius: 999px;
          color: #69707d;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          box-shadow: 0 4px 18px rgba(20, 25, 40, 0.04);
        }

        .brand-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6d5dfc;
          box-shadow: 0 0 0 4px rgba(109,93,252,0.1);
        }

        .countdown-header h1 {
          margin: 15px 0 7px;
          font-size: clamp(30px, 7vw, 46px);
          line-height: 1.05;
          letter-spacing: -1.5px;
          font-weight: 850;
        }

        .countdown-header p {
          margin: 0 auto;
          color: #69717f;
          font-size: 14px;
          line-height: 1.6;
          max-width: 650px;
        }

        .main-card,
        .section-card,
        .info-card,
        .content-card,
        .faq-card {
          background: rgba(255,255,255,0.94);
          border: 1px solid #e8eaf0;
          box-shadow:
            0 16px 45px rgba(24, 30, 50, 0.06);
        }

        .main-card {
          border-radius: 26px;
          padding: 24px;
          overflow: hidden;
          position: relative;
        }

        .main-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #6d5dfc, #22c7a5);
        }

        .status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .status.live {
          color: #168c72;
        }

        .status.complete {
          color: #6d5dfc;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .target-mini {
          color: #858b97;
          font-size: 11px;
          font-weight: 600;
        }

        .event-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 25px 0 22px;
          text-align: left;
        }

        .event-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #f2f1ff;
          font-size: 22px;
          flex-shrink: 0;
        }

        .event-label {
          color: #8b909b;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .event-title h2 {
          margin: 4px 0 0;
          font-size: clamp(20px, 5vw, 28px);
          line-height: 1.15;
          letter-spacing: -0.5px;
        }

        .timer-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .count-box {
          min-width: 0;
          padding: 21px 8px 17px;
          text-align: center;
          border: 1px solid #eceef3;
          background: #f9fafc;
          border-radius: 18px;
        }

        .count-number {
          font-size: clamp(32px, 9vw, 52px);
          line-height: 1;
          font-weight: 850;
          letter-spacing: -2px;
          color: #171a22;
          font-variant-numeric: tabular-nums;
        }

        .count-label {
          margin-top: 8px;
          color: #858b97;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .target-line {
          margin-top: 18px;
          color: #858b97;
          text-align: center;
          font-size: 11px;
          line-height: 1.5;
        }

        .target-line strong {
          color: #555b67;
        }

        .complete-box {
          text-align: center;
          padding: 22px 10px 18px;
          border-radius: 18px;
          background: #faf9ff;
          border: 1px solid #ece9ff;
        }

        .complete-emoji {
          font-size: 42px;
        }

        .complete-title {
          margin-top: 7px;
          font-size: 18px;
          font-weight: 800;
        }

        .complete-text {
          margin-top: 5px;
          color: #858b97;
          font-size: 12px;
        }

        .section-card {
          margin-top: 16px;
          border-radius: 22px;
          padding: 20px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 15px;
        }

        .section-kicker {
          display: block;
          color: #6d5dfc;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1.4px;
          margin-bottom: 5px;
        }

        .section-heading h3 {
          margin: 0;
          font-size: 17px;
          letter-spacing: -0.2px;
        }

        .section-hint {
          color: #9a9fa8;
          font-size: 10px;
        }

        .preset-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 9px;
        }

        .preset {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
          padding: 12px 10px;
          border: 1px solid #e9ebf0;
          border-radius: 14px;
          background: #fafbfc;
          color: #252831;
          cursor: pointer;
          transition: 0.18s ease;
          text-align: left;
        }

        .preset:hover {
          transform: translateY(-1px);
          border-color: #d9d5ff;
          background: #f8f7ff;
        }

        .preset.active {
          border-color: #6d5dfc;
          background: #f3f1ff;
          box-shadow: inset 0 0 0 1px rgba(109,93,252,0.08);
        }

        .preset-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .preset-name {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 11px;
          font-weight: 750;
        }

        .preset-arrow {
          margin-left: auto;
          color: #9ca1aa;
          font-size: 13px;
        }

        .custom-card {
          background: #fff;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .field label {
          display: block;
          margin: 0 0 6px;
          color: #5f6570;
          font-size: 10px;
          font-weight: 800;
        }

        .field input {
          width: 100%;
          box-sizing: border-box;
          padding: 13px 13px;
          border: 1px solid #e1e4ea;
          border-radius: 12px;
          outline: none;
          background: #fbfcfd;
          color: #171a22;
          font-family: inherit;
          font-size: 13px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .field input:focus {
          border-color: #8d82ff;
          box-shadow: 0 0 0 3px rgba(109,93,252,0.09);
        }

        .field input::placeholder {
          color: #a8adb5;
        }

        .start-button {
          width: 100%;
          margin-top: 13px;
          padding: 14px 16px;
          border: 0;
          border-radius: 13px;
          background: #171922;
          color: white;
          font-family: inherit;
          font-size: 12px;
          font-weight: 850;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .start-button:hover:not(:disabled) {
          background: #6d5dfc;
          transform: translateY(-1px);
        }

        .start-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .info-card {
          border-radius: 20px;
          padding: 18px;
        }

        .info-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #f3f2ff;
          font-size: 16px;
        }

        .info-card h3 {
          margin: 12px 0 5px;
          font-size: 14px;
        }

        .info-card p {
          margin: 0;
          color: #777d88;
          font-size: 11px;
          line-height: 1.65;
        }

        .content-card {
          margin-top: 16px;
          border-radius: 22px;
          padding: 23px;
        }

        .content-card h2 {
          margin: 0 0 10px;
          font-size: 20px;
        }

        .content-card p {
          margin: 0 0 9px;
          color: #686e79;
          font-size: 12px;
          line-height: 1.75;
        }

        .keyword-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 15px;
        }

        .keyword-list span {
          padding: 6px 9px;
          border: 1px solid #e8e9ee;
          background: #fafbfc;
          border-radius: 999px;
          color: #777d88;
          font-size: 9px;
          font-weight: 700;
        }

        .faq-card {
          margin-top: 16px;
          border-radius: 22px;
          padding: 23px;
        }

        .faq-card h2 {
          margin: 0 0 16px;
          font-size: 20px;
        }

        .faq-item {
          padding: 13px 0;
          border-top: 1px solid #edf0f3;
        }

        .faq-item h3 {
          margin: 0 0 5px;
          font-size: 13px;
        }

        .faq-item p {
          margin: 0;
          color: #737984;
          font-size: 11px;
          line-height: 1.65;
        }

        .countdown-footer {
          text-align: center;
          color: #9ca1aa;
          font-size: 9px;
          line-height: 1.8;
          margin-top: 25px;
        }

        .footer-brand {
          margin-top: 3px;
          color: #777d88;
          font-weight: 800;
          letter-spacing: 0.8px;
        }

        @media (max-width: 760px) {
          .countdown-page {
            padding: 22px 12px 50px;
          }

          .main-card {
            padding: 18px;
            border-radius: 21px;
          }

          .section-card,
          .content-card,
          .faq-card {
            padding: 17px;
            border-radius: 19px;
          }

          .preset-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .preset:last-child {
            grid-column: span 2;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .info-card {
            padding: 16px;
          }
        }

        @media (max-width: 520px) {
          .countdown-header h1 {
            font-size: 32px;
          }

          .countdown-header p {
            font-size: 12px;
          }

          .status-row {
            align-items: flex-start;
          }

          .target-mini {
            width: 100%;
          }

          .event-title {
            justify-content: flex-start;
            margin: 21px 0 17px;
          }

          .event-icon {
            width: 42px;
            height: 42px;
            border-radius: 13px;
            font-size: 19px;
          }

          .event-title h2 {
            font-size: 20px;
          }

          .timer-grid {
            gap: 6px;
          }

          .count-box {
            padding: 17px 4px 13px;
            border-radius: 14px;
          }

          .count-number {
            font-size: 29px;
            letter-spacing: -1px;
          }

          .count-label {
            font-size: 7px;
            letter-spacing: 0.8px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 5px;
          }

          .section-hint {
            display: none;
          }

          .preset {
            padding: 11px 9px;
          }

          .preset-name {
            font-size: 10px;
          }
        }
      `}</style>
    </main>
  );
}
