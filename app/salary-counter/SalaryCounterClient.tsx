"use client";

import { useEffect, useMemo, useState } from "react";

export default function SalaryCounterClient() {
  const [amount, setAmount] = useState(0);
  const [fromUnit, setFromUnit] = useState("month");
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [currency, setCurrency] = useState("₹");
  const [now, setNow] = useState(new Date());
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(timer);
  }, []);

  const yearly = useMemo(() => {
    if (fromUnit === "year") return amount;
    if (fromUnit === "month") return amount * 12;
    if (fromUnit === "week") return amount * 52;
    if (fromUnit === "day") return amount * daysPerWeek * 52;
    if (fromUnit === "hour")
      return amount * hoursPerDay * daysPerWeek * 52;

    return amount * 60 * hoursPerDay * daysPerWeek * 52;
  }, [amount, fromUnit, hoursPerDay, daysPerWeek]);

  const totalHoursYear = hoursPerDay * daysPerWeek * 52;

  const perHour = totalHoursYear ? yearly / totalHoursYear : 0;
  const perMinute = perHour / 60;
  const perSecond = perHour / 3600;
  const perDay = perHour * hoursPerDay;
  const perWeek = perDay * daysPerWeek;
  const perMonth = yearly / 12;

  const startOfDay = new Date(now);
  startOfDay.setHours(9, 0, 0, 0);

  const secondsToday = Math.max(
    0,
    (now.getTime() - startOfDay.getTime()) / 1000
  );

  const hasSalary = amount > 0;
  const isLive = hasSalary && started;

  const earnedToday = isLive ? secondsToday * perSecond : 0;

  const daysPassed = Math.max(
    1,
    now.getDate() - 1 + now.getHours() / 24
  );

  const earnedMonth = isLive ? (perMonth / 30) * daysPassed : 0;

  const fmt = (n: number, decimals = 0) =>
    currency +
    n.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const units = [
    { id: "minute", label: "Minute" },
    { id: "hour", label: "Hour" },
    { id: "day", label: "Day" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
    { id: "year", label: "Year" },
  ];

  const earnings = [
    {
      icon: "⚡",
      label: "PER SECOND",
      value: fmt(perSecond, 3),
      sub: "Every second",
    },
    {
      icon: "◷",
      label: "PER MINUTE",
      value: fmt(perMinute, 2),
      sub: "Every minute",
    },
    {
      icon: "◴",
      label: "PER HOUR",
      value: fmt(perHour),
      sub: `${hoursPerDay} hrs / day`,
    },
    {
      icon: "☀️",
      label: "PER DAY",
      value: fmt(perDay),
      sub: "1 working day",
    },
    {
      icon: "▣",
      label: "PER WEEK",
      value: fmt(perWeek),
      sub: `${daysPerWeek} days`,
    },
    {
      icon: "▤",
      label: "PER MONTH",
      value: fmt(perMonth),
      sub: "Average month",
    },
    {
      icon: "▦",
      label: "PER YEAR",
      value: fmt(yearly),
      sub: "Annual income",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #ffffff 48%, #f4f7fb 100%)",
        color: "#111827",
        padding: "22px 16px 34px",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "860px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            textAlign: "center",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 900,
              letterSpacing: "0.5px",
              color: "#111827",
              marginBottom: "6px",
            }}
          >
            thenexoratools
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "999px",
              padding: "6px 11px",
              fontSize: "10px",
              fontWeight: 800,
              color: "#667085",
              boxShadow: "0 4px 18px rgba(15,23,42,0.05)",
              marginBottom: "9px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                background: "#22c55e",
                borderRadius: "50%",
                boxShadow: "0 0 0 4px rgba(34,197,94,0.12)",
              }}
            />
            LIVE SALARY TRACKER
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(25px, 6vw, 34px)",
              lineHeight: 1.1,
              letterSpacing: "-1.4px",
              fontWeight: 900,
              color: "#111827",
            }}
          >
            Live Salary Counter
          </h1>

          <p
            style={{
              margin: "7px auto 0",
              maxWidth: "560px",
              color: "#667085",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            See how much you earn every second, minute, hour, day, week,
            month and year.
          </p>
        </header>

        {/* LIVE HERO */}
        <section
          style={{
            background:
              "linear-gradient(135deg, #111827 0%, #172033 55%, #0f766e 150%)",
            borderRadius: "22px",
            padding: "21px 18px",
            color: "white",
            boxShadow: "0 18px 50px rgba(15,23,42,0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "rgba(81,225,208,0.10)",
              right: "-70px",
              top: "-80px",
            }}
          />

          <div
            style={{
              position: "relative",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.14)",
                padding: "5px 10px",
                borderRadius: "999px",
                fontSize: "9px",
                fontWeight: 900,
                letterSpacing: "0.7px",
              }}
            >
              <span style={{ color: "#51e1d0" }}>●</span>
              {isLive ? "LIVE NOW" : "WAITING FOR SALARY"}
            </div>

            <div
              style={{
                marginTop: "13px",
                fontSize: "9px",
                letterSpacing: "1.3px",
                fontWeight: 800,
                color: "#aab4c5",
              }}
            >
              EARNED TODAY
            </div>

            <div
              style={{
                marginTop: "3px",
                fontSize: "clamp(32px, 9vw, 52px)",
                lineHeight: 1.1,
                letterSpacing: "-2px",
                fontWeight: 900,
                color: "#51e1d0",
              }}
            >
              {fmt(earnedToday, 2)}
            </div>

            <div
              style={{
                marginTop: "5px",
                color: "#b8c2d3",
                fontSize: "11px",
              }}
            >
              {isLive ? `+ ${fmt(perSecond, 3)} every second` : "Write your salary to start"}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "9px",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "13px",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "8px",
                    color: "#aab4c5",
                    fontWeight: 800,
                    letterSpacing: "0.8px",
                  }}
                >
                  THIS MONTH
                </div>

                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
                    marginTop: "3px",
                  }}
                >
                  {fmt(earnedMonth)}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "13px",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "8px",
                    color: "#aab4c5",
                    fontWeight: 800,
                    letterSpacing: "0.8px",
                  }}
                >
                  PER HOUR
                </div>

                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
                    marginTop: "3px",
                    color: "#facc15",
                  }}
                >
                  {fmt(perHour)}
                </div>
              </div>
            </div>

            {!started && (
              <button
                onClick={() => hasSalary && setStarted(true)}
                disabled={!hasSalary}
                style={{
                  marginTop: "14px",
                  border: "none",
                  borderRadius: "999px",
                  padding: "10px 19px",
                  background: hasSalary ? "#51e1d0" : "#2a364a",
                  color: hasSalary ? "#071311" : "#8b95a8",
                  fontSize: "10px",
                  fontWeight: 900,
                  cursor: hasSalary ? "pointer" : "not-allowed",
                  boxShadow: hasSalary ? "0 8px 25px rgba(81,225,208,0.22)" : "none",
                  opacity: hasSalary ? 1 : 0.7,
                }}
              >
                {hasSalary ? "▶ START LIVE COUNTER" : "WRITE YOUR SALARY FIRST"}
              </button>
            )}

            {started && (
              <div
                style={{
                  marginTop: "13px",
                  fontSize: "9px",
                  color: "#9fece4",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                }}
              >
                ● COUNTER IS RUNNING
              </div>
            )}
          </div>
        </section>

        {/* SETTINGS */}
        <section
          style={{
            marginTop: "13px",
            background: "#ffffff",
            border: "1px solid #e6eaf0",
            borderRadius: "18px",
            padding: "17px",
            boxShadow: "0 8px 30px rgba(15,23,42,0.045)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 900,
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            Salary Details
          </div>

          {/* AMOUNT */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "5px",
                flexShrink: 0,
              }}
            >
              {["₹", "$", "€", "£"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  style={{
                    width: "38px",
                    height: "46px",
                    borderRadius: "10px",
                    border:
                      currency === c
                        ? "1px solid #7c6cff"
                        : "1px solid #e4e7ec",
                    background:
                      currency === c ? "#f1efff" : "#f8fafc",
                    color:
                      currency === c ? "#604ff0" : "#475467",
                    fontWeight: 900,
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={amount || ""}
              placeholder="Write your salary"
              onChange={(e) =>
                setAmount(Number(e.target.value) || 0)
              }
              style={{
                minWidth: 0,
                flex: 1,
                height: "46px",
                padding: "0 13px",
                borderRadius: "10px",
                border: "1px solid #dfe3e8",
                background: "#f8fafc",
                color: "#111827",
                fontSize: "18px",
                fontWeight: 900,
                outline: "none",
              }}
            />
          </div>

          {/* UNIT */}
          <div
            style={{
              marginTop: "14px",
              fontSize: "10px",
              color: "#667085",
              fontWeight: 800,
            }}
          >
            SALARY PERIOD
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "5px",
              marginTop: "7px",
            }}
          >
            {units.map((unit) => (
              <button
                key={unit.id}
                onClick={() => setFromUnit(unit.id)}
                style={{
                  minWidth: 0,
                  border: "none",
                  borderRadius: "9px",
                  padding: "9px 3px",
                  background:
                    fromUnit === unit.id
                      ? "#111827"
                      : "#f2f4f7",
                  color:
                    fromUnit === unit.id
                      ? "#ffffff"
                      : "#667085",
                  fontSize: "9px",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {unit.label}
              </button>
            ))}
          </div>

          {/* WORK HOURS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "13px",
              marginTop: "15px",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "5px",
                  fontSize: "9px",
                  color: "#667085",
                  fontWeight: 700,
                }}
              >
                <span>Hours / day</span>
                <b style={{ color: "#111827" }}>
                  {hoursPerDay} hrs
                </b>
              </div>

              <input
                type="range"
                min={1}
                max={16}
                value={hoursPerDay}
                onChange={(e) =>
                  setHoursPerDay(Number(e.target.value))
                }
                style={{
                  width: "100%",
                  accentColor: "#51cdbf",
                  marginTop: "5px",
                }}
              />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "5px",
                  fontSize: "9px",
                  color: "#667085",
                  fontWeight: 700,
                }}
              >
                <span>Days / week</span>
                <b style={{ color: "#111827" }}>
                  {daysPerWeek} days
                </b>
              </div>

              <input
                type="range"
                min={1}
                max={7}
                value={daysPerWeek}
                onChange={(e) =>
                  setDaysPerWeek(Number(e.target.value))
                }
                style={{
                  width: "100%",
                  accentColor: "#7c6cff",
                  marginTop: "5px",
                }}
              />
            </div>
          </div>
        </section>

        {/* ALL EARNINGS */}
        <section style={{ marginTop: "13px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 900,
                color: "#111827",
              }}
            >
              Your Earnings
            </div>

            <div
              style={{
                fontSize: "9px",
                color: "#98a2b3",
                fontWeight: 700,
              }}
            >
              LIVE BREAKDOWN
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(145px, 1fr))",
              gap: "8px",
            }}
          >
            {earnings.map((item, index) => (
              <div
                key={item.label}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e7eaf0",
                  borderRadius: "15px",
                  padding: "13px",
                  boxShadow:
                    "0 5px 20px rgba(15,23,42,0.035)",
                  transition: "transform 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      width: "27px",
                      height: "27px",
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "8px",
                      background:
                        index === 0
                          ? "#fff4e5"
                          : index === 1
                          ? "#eafaf8"
                          : index === 2
                          ? "#fff8dc"
                          : index === 3
                          ? "#f0edff"
                          : index === 4
                          ? "#eaf9ef"
                          : index === 5
                          ? "#fff0f2"
                          : "#eef2ff",
                      fontSize: "12px",
                    }}
                  >
                    {item.icon}
                  </span>

                  <span
                    style={{
                      fontSize: "8px",
                      fontWeight: 900,
                      color: "#98a2b3",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: "9px",
                    fontSize: "17px",
                    fontWeight: 900,
                    letterSpacing: "-0.5px",
                    color: "#111827",
                    wordBreak: "break-word",
                  }}
                >
                  {item.value}
                </div>

                <div
                  style={{
                    marginTop: "2px",
                    fontSize: "9px",
                    color: "#98a2b3",
                  }}
                >
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPLANATION */}
        <div
          style={{
            marginTop: "13px",
            background: "#f0fdfa",
            border: "1px solid #c9f3ec",
            borderRadius: "15px",
            padding: "12px 14px",
            color: "#475467",
            fontSize: "10px",
            lineHeight: 1.7,
          }}
        >
          <b style={{ color: "#111827" }}>💡 Your live rate:</b>{" "}
          You earn approximately{" "}
          <b style={{ color: "#087f73" }}>
            {fmt(perSecond, 2)}
          </b>{" "}
          every second. Your earnings are calculated from your salary,
          working hours and working days.
        </div>

        {/* FOOTER */}
        <footer
          style={{
            textAlign: "center",
            marginTop: "15px",
            fontSize: "9px",
            color: "#98a2b3",
          }}
        >
          Free • Live Counter • THE NEXORA TOOLS
        </footer>
      </div>
    </main>
  );
}
