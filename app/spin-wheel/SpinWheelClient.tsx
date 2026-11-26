"use client";

import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import confetti from "canvas-confetti";

const COLORS = [
  "#2563EB",
  "#7C3AED",
  "#DB2777",
  "#EA580C",
  "#059669",
  "#0891B2",
  "#4F46E5",
  "#CA8A04",
  "#DC2626",
  "#0F766E",
  "#9333EA",
  "#0284C7",
  "#16A34A",
  "#C026D3",
  "#D97706",
  "#2563EB",
];

const DEFAULT_NAMES = [
  "Ayush",
  "Rahul",
  "Priya",
  "Aman",
  "Sneha",
  "Vikash",
  "Neha",
  "Rohan",
];

type HistoryItem = {
  name: string;
  time: string;
};

const SPIN_DURATION = 4800;

export default function SpinWheelClient() {
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);
  const [input, setInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const [winner, setWinner] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [removeWinner, setRemoveWinner] = useState(false);
  const [noRepeat, setNoRepeat] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [message, setMessage] = useState(
    "Add names, then spin the wheel to pick a winner."
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rotationRef = useRef(0);
  const namesRef = useRef<string[]>(DEFAULT_NAMES);

  const audioContextRef = useRef<AudioContext | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activePreset, setActivePreset] = useState("Custom");

  useEffect(() => {
    namesRef.current = names;
  }, [names]);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    drawWheel();

    const handleResize = () => drawWheel();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }

      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [names, rotation]);

  const uniqueNames = useMemo(() => {
    const seen = new Set<string>();

    return names.filter((name) => {
      const key = name.trim().toLowerCase();

      if (!key || seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }, [names]);

  const drawWheel = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    if (rect.width === 0) return;

    const size = Math.min(rect.width, 620);
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const center = size / 2;
    const radius = center - 7;

    ctx.clearRect(0, 0, size, size);

    const list = uniqueNames;

    if (list.length === 0) {
      drawEmptyWheel(ctx, center, radius);
      return;
    }

    const segment = (Math.PI * 2) / list.length;

    for (let i = 0; i < list.length; i++) {
      const start = i * segment;
      const end = start + segment;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();

      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      drawWheelText(
        ctx,
        list[i],
        center,
        center,
        radius,
        start,
        segment,
        list.length
      );
    }

    // Outer ring
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 5;
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(center, center, radius - 8, 0, Math.PI * 2);

    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center hub
    const hubRadius = Math.min(48, size * 0.115);

    const gradient = ctx.createRadialGradient(
      center - 8,
      center - 8,
      2,
      center,
      center,
      hubRadius
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#e5e7eb");

    ctx.beginPath();
    ctx.arc(center, center, hubRadius, 0, Math.PI * 2);

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#111827";
    ctx.font = `900 ${Math.max(11, size * 0.032)}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("SPIN", center, center);
  };

  const drawEmptyWheel = (
    ctx: CanvasRenderingContext2D,
    center: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);

    ctx.fillStyle = "#f3f4f6";
    ctx.fill();

    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "#6b7280";
    ctx.font =
      '700 15px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("ADD NAMES", center, center - 8);

    ctx.font =
      '500 12px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

    ctx.fillText("to start spinning", center, center + 14);
  };

  const drawWheelText = (
    ctx: CanvasRenderingContext2D,
    name: string,
    center: number,
    centerY: number,
    radius: number,
    start: number,
    segment: number,
    total: number
  ) => {
    ctx.save();

    const angle = start + segment / 2;

    ctx.translate(center, centerY);
    ctx.rotate(angle);

    const fontSize =
      total <= 8
        ? 18
        : total <= 12
          ? 15
          : total <= 20
            ? 12
            : 10;

    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const maxChars =
      total <= 8 ? 18 : total <= 12 ? 14 : total <= 20 ? 11 : 8;

    const safeName =
      name.length > maxChars
        ? `${name.slice(0, maxChars - 1)}…`
        : name;

    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 3;

    ctx.fillText(safeName, radius - 24, 0);

    ctx.restore();
  };

  const addName = () => {
    const value = input.trim();

    if (!value) return;

    if (
      names.some(
        (name) => name.trim().toLowerCase() === value.toLowerCase()
      )
    ) {
      setMessage("That name is already in the list.");
      return;
    }

    setNames((prev) => [...prev, value]);
    setInput("");
    setMessage(`${value} added to the wheel.`);
    setActivePreset("Custom");
  };

  const removeName = (index: number) => {
    if (spinning) return;

    setNames((prev) => prev.filter((_, i) => i !== index));
    setWinner(null);
    setActivePreset("Custom");
  };

  const clearAll = () => {
    if (spinning) return;

    setNames([]);
    setWinner(null);
    setHistory([]);
    setMessage("Wheel cleared. Add names to begin.");
    setActivePreset("Custom");
  };

  const shuffleNames = () => {
    if (spinning || names.length < 2) return;

    const shuffled = [...names];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setNames(shuffled);
    setMessage("Names shuffled.");
  };

  const addBulkNames = () => {
    const incoming = bulkInput
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter(Boolean);

    if (!incoming.length) {
      setMessage("Paste at least one name.");
      return;
    }

    const combined = [...names, ...incoming];

    const seen = new Set<string>();

    const cleaned = combined.filter((name) => {
      const key = name.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });

    const addedCount = cleaned.length - names.length;

    setNames(cleaned);
    setBulkInput("");
    setShowBulk(false);
    setActivePreset("Custom");

    setMessage(
      addedCount > 0
        ? `${addedCount} new name${addedCount === 1 ? "" : "s"} added.`
        : "No new names were added."
    );
  };

  const applyPreset = (preset: string) => {
    if (spinning) return;

    setActivePreset(preset);

    if (preset === "Giveaway") {
      setNames([
        "Alex",
        "Jordan",
        "Taylor",
        "Morgan",
        "Casey",
        "Jamie",
        "Riley",
        "Avery",
      ]);
    }

    if (preset === "Classroom") {
      setNames([
        "Student 1",
        "Student 2",
        "Student 3",
        "Student 4",
        "Student 5",
        "Student 6",
        "Student 7",
        "Student 8",
        "Student 9",
        "Student 10",
      ]);
    }

    if (preset === "Teams") {
      setNames([
        "Team A",
        "Team B",
        "Team C",
        "Team D",
        "Team E",
        "Team F",
      ]);
    }

    if (preset === "Lunch") {
      setNames([
        "Pizza",
        "Burger",
        "Tacos",
        "Pasta",
        "Sushi",
        "Sandwich",
      ]);
    }

    setWinner(null);
    setMessage(`${preset} list loaded.`);
  };

  const createAudioContext = () => {
    if (!soundEnabled) return null;

    try {
      if (!audioContextRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;

        if (!AudioCtx) return null;

        audioContextRef.current = new AudioCtx();
      }

      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume().catch(() => {});
      }

      return audioContextRef.current;
    } catch {
      return null;
    }
  };

  const playTick = (frequency = 850) => {
    const audio = createAudioContext();

    if (!audio) return;

    try {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.045,
        audio.currentTime + 0.005
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audio.currentTime + 0.045
      );

      oscillator.connect(gain);
      gain.connect(audio.destination);

      oscillator.start();
      oscillator.stop(audio.currentTime + 0.05);
    } catch {
      // Ignore audio errors.
    }
  };

  const speakWinner = (name: string) => {
    if (!soundEnabled || typeof window === "undefined") return;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(
        `The winner is ${name}`
      );

      utterance.rate = 0.92;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech may be unavailable in some browsers.
    }
  };

  const vibrate = (pattern: number | number[]) => {
    try {
      if ("vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore unsupported vibration.
    }
  };

  const getWinnerIndex = (finalRotation: number, count: number) => {
    const segment = 360 / count;

    // Pointer is at the bottom of the wheel = 90 degrees.
    const pointerAngle = 90;

    const normalized =
      ((pointerAngle - (finalRotation % 360)) + 360) % 360;

    return Math.floor(normalized / segment) % count;
  };

  const spin = () => {
    const currentNames = namesRef.current;

    if (spinning) return;

    if (currentNames.length < 2) {
      setMessage("Add at least 2 names to spin the wheel.");
      return;
    }

    createAudioContext();

    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }

    setSpinning(true);
    setWinner(null);
    setMessage("Spinning… watch the pointer.");

    vibrate([20, 30, 20]);

    const extraTurns = 6 + Math.floor(Math.random() * 3);

    const randomOffset = Math.floor(Math.random() * 360);

    const newRotation =
      rotationRef.current + extraTurns * 360 + randomOffset;

    setRotation(newRotation);

    rotationRef.current = newRotation;

    let tickCount = 0;

    if (soundEnabled) {
      tickIntervalRef.current = setInterval(() => {
        tickCount++;

        playTick(650 + Math.min(tickCount * 10, 350));
      }, 85);
    }

    spinTimeoutRef.current = setTimeout(() => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }

      const currentList = namesRef.current;

      if (!currentList.length) {
        setSpinning(false);
        return;
      }

      const index = getWinnerIndex(
        newRotation,
        currentList.length
      );

      const selectedWinner = currentList[index];

      setWinner(selectedWinner);
      setSpinning(false);

      const now = new Date();

      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setHistory((prev) =>
        [
          {
            name: selectedWinner,
            time,
          },
          ...prev,
        ].slice(0, 10)
      );

      setMessage(`${selectedWinner} has been selected.`);

      vibrate([60, 40, 120]);

      playTick(1200);

      window.setTimeout(() => {
        speakWinner(selectedWinner);
      }, 180);

      confetti({
        particleCount: 220,
        spread: 100,
        startVelocity: 35,
        origin: {
          x: 0.5,
          y: 0.42,
        },
      });

      if (removeWinner || noRepeat) {
        setNames((prev) => {
          const winnerIndex = prev.findIndex(
            (name) => name === selectedWinner
          );

          if (winnerIndex === -1) return prev;

          return prev.filter((_, i) => i !== winnerIndex);
        });
      }
    }, SPIN_DURATION);
  };

  const shareWinner = async () => {
    if (!winner) return;

    const text = `🎉 Winner: ${winner}\nPicked with the Spin Wheel on thenexoratools.com`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Spin Wheel Winner",
          text,
        });

        return;
      }

      await navigator.clipboard.writeText(text);

      setMessage("Winner result copied to clipboard.");
    } catch {
      setMessage("Unable to share the result on this device.");
    }
  };

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addName();
    }
  };

  const handleBulkChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setBulkInput(event.target.value);
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #ffffff;
          color: #111827;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        ::selection {
          background: #dbeafe;
          color: #111827;
        }

        .spin-glow {
          animation: spinGlow 1.8s ease-in-out infinite;
        }

        @keyframes spinGlow {
          0%,
          100% {
            box-shadow:
              0 0 0 1px rgba(37, 99, 235, 0.08),
              0 20px 70px rgba(15, 23, 42, 0.08);
          }

          50% {
            box-shadow:
              0 0 0 1px rgba(37, 99, 235, 0.18),
              0 25px 85px rgba(37, 99, 235, 0.12);
          }
        }

        .winner-pop {
          animation: winnerPop 0.45s ease-out;
        }

        @keyframes winnerPop {
          0% {
            transform: scale(0.92);
            opacity: 0;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1180px] px-4 pb-14 pt-5 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-black tracking-[-0.02em] text-[#111827]">
              thenexoratools
            </div>

            <div className="mt-0.5 text-[10px] font-medium text-[#9ca3af]">
              Free online tools
            </div>
          </div>

          <div className="rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5 text-[10px] font-bold text-[#6b7280]">
            RANDOM PICKER
          </div>
        </header>

        {/* Title */}
        <section className="mb-5 text-center">
          <h1 className="text-[25px] font-black tracking-[-0.04em] text-[#111827] sm:text-[30px]">
            Spin Wheel
          </h1>

          <p className="mx-auto mt-1.5 max-w-[620px] text-[12px] leading-5 text-[#6b7280]">
            Add names, spin the wheel, and let the pointer choose a random
            winner.
          </p>
        </section>

        {/* Main layout */}
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
          {/* Wheel side */}
          <section
            className={`rounded-[26px] border border-[#e5e7eb] bg-white p-4 shadow-[0_18px_70px_rgba(15,23,42,0.07)] sm:p-6 ${
              !spinning ? "spin-glow" : ""
            }`}
          >
            {/* Status */}
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#9ca3af]">
                  Random winner
                </p>

                <p className="mt-0.5 text-[12px] font-semibold text-[#374151]">
                  {spinning
                    ? "The wheel is spinning..."
                    : `${uniqueNames.length} entries ready`}
                </p>
              </div>

              <div className="rounded-full bg-[#eff6ff] px-3 py-1.5 text-[10px] font-bold text-[#2563eb]">
                {uniqueNames.length} names
              </div>
            </div>

            {/* Wheel */}
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-[600px]">
                {/* Wheel */}
                <div
                  className="relative mx-auto aspect-square w-[min(88vw,600px)]"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning
                      ? `transform ${SPIN_DURATION}ms cubic-bezier(0.12, 0.8, 0.08, 1)`
                      : "none",
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="h-full w-full"
                    aria-label="Random name spin wheel"
                  />
                </div>

                {/* Fixed pointer at bottom */}
                <div className="pointer-events-none absolute bottom-[-20px] left-1/2 z-20 -translate-x-1/2">
                  <div className="relative flex h-[38px] w-[52px] items-center justify-center">
                    <div
                      className="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2"
                      style={{
                        borderLeft: "16px solid transparent",
                        borderRight: "16px solid transparent",
                        borderBottom: "28px solid #111827",
                      }}
                    />

                    <div
                      className="absolute bottom-[4px] left-1/2 h-0 w-0 -translate-x-1/2"
                      style={{
                        borderLeft: "11px solid transparent",
                        borderRight: "11px solid transparent",
                        borderBottom: "19px solid #ffffff",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Winner */}
              <div className="mt-8 w-full max-w-[520px] text-center">
                {winner ? (
                  <div className="winner-pop rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#16a34a]">
                      Winner
                    </p>

                    <p className="mt-1 text-[25px] font-black tracking-[-0.03em] text-[#111827]">
                      {winner}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={shareWinner}
                        className="rounded-full border border-[#d1d5db] bg-white px-4 py-2 text-[10px] font-bold text-[#374151] transition hover:border-[#9ca3af]"
                      >
                        Share result
                      </button>

                      <button
                        onClick={spin}
                        disabled={spinning || uniqueNames.length < 2}
                        className="rounded-full bg-[#111827] px-4 py-2 text-[10px] font-black text-white transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Spin again
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
                    <p className="text-[11px] font-semibold text-[#6b7280]">
                      {message}
                    </p>
                  </div>
                )}
              </div>

              {/* Main spin button */}
              <button
                onClick={spin}
                disabled={spinning || uniqueNames.length < 2}
                className="mt-4 w-full max-w-[520px] rounded-2xl bg-[#111827] py-3.5 text-[13px] font-black tracking-[-0.01em] text-white shadow-[0_12px_30px_rgba(17,24,39,0.16)] transition hover:-translate-y-0.5 hover:bg-[#2563eb] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {spinning ? "Spinning..." : "SPIN THE WHEEL"}
              </button>

              <p className="mt-2 text-center text-[9px] font-medium text-[#9ca3af]">
                The fixed pointer at the bottom selects the winner.
              </p>
            </div>
          </section>

          {/* Controls */}
          <aside className="space-y-4">
            {/* Add names */}
            <section className="rounded-[22px] border border-[#e5e7eb] bg-white p-4 shadow-[0_12px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-[13px] font-black text-[#111827]">
                    Add names
                  </h2>

                  <p className="mt-0.5 text-[10px] text-[#9ca3af]">
                    One name at a time
                  </p>
                </div>

                <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-[9px] font-bold text-[#6b7280]">
                  {uniqueNames.length}
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  disabled={spinning}
                  placeholder="Enter a name..."
                  className="min-w-0 flex-1 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2.5 text-[11px] font-medium text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:bg-white"
                />

                <button
                  onClick={addName}
                  disabled={spinning}
                  className="rounded-xl bg-[#2563eb] px-4 text-[10px] font-black text-white transition hover:bg-[#1d4ed8] disabled:opacity-40"
                >
                  Add
                </button>
              </div>

              <button
                onClick={() => setShowBulk((prev) => !prev)}
                disabled={spinning}
                className="mt-2 text-[10px] font-bold text-[#2563eb] hover:underline"
              >
                {showBulk ? "Hide bulk input" : "Paste multiple names"}
              </button>

              {showBulk && (
                <div className="mt-3">
                  <textarea
                    value={bulkInput}
                    onChange={handleBulkChange}
                    disabled={spinning}
                    rows={6}
                    placeholder={`Alex
Jordan
Taylor
Morgan`}
                    className="w-full resize-none rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2.5 text-[11px] font-medium leading-5 text-[#111827] outline-none focus:border-[#2563eb] focus:bg-white"
                  />

                  <button
                    onClick={addBulkNames}
                    className="mt-2 w-full rounded-xl bg-[#111827] py-2.5 text-[10px] font-black text-white hover:bg-[#2563eb]"
                  >
                    Add names
                  </button>
                </div>
              )}
            </section>

            {/* Presets */}
            <section className="rounded-[22px] border border-[#e5e7eb] bg-white p-4 shadow-[0_12px_45px_rgba(15,23,42,0.05)]">
              <h2 className="text-[13px] font-black text-[#111827]">
                Quick lists
              </h2>

              <p className="mt-0.5 text-[10px] text-[#9ca3af]">
                Start instantly with a ready-made list.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {["Giveaway", "Classroom", "Teams", "Lunch"].map(
                  (preset) => (
                    <button
                      key={preset}
                      onClick={() => applyPreset(preset)}
                      disabled={spinning}
                      className={`rounded-xl border px-3 py-2.5 text-[10px] font-bold transition ${
                        activePreset === preset
                          ? "border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb]"
                          : "border-[#e5e7eb] bg-[#f9fafb] text-[#4b5563] hover:border-[#bfdbfe]"
                      }`}
                    >
                      {preset}
                    </button>
                  )
                )}
              </div>
            </section>

            {/* Options */}
            <section className="rounded-[22px] border border-[#e5e7eb] bg-white p-4 shadow-[0_12px_45px_rgba(15,23,42,0.05)]">
              <h2 className="text-[13px] font-black text-[#111827]">
                Wheel options
              </h2>

              <div className="mt-3 space-y-3">
                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-[#374151]">
                      Remove winner
                    </p>

                    <p className="text-[9px] text-[#9ca3af]">
                      Remove the selected name after each spin.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={removeWinner}
                    onChange={(e) =>
                      setRemoveWinner(e.target.checked)
                    }
                    disabled={spinning}
                    className="h-4 w-4 accent-[#2563eb]"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-[#374151]">
                      No repeat winners
                    </p>

                    <p className="text-[9px] text-[#9ca3af]">
                      Keep winners out of future spins.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={noRepeat}
                    onChange={(e) => setNoRepeat(e.target.checked)}
                    disabled={spinning}
                    className="h-4 w-4 accent-[#2563eb]"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-[#374151]">
                      Sound & voice
                    </p>

                    <p className="text-[9px] text-[#9ca3af]">
                      Spin ticks and winner announcement.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) =>
                      setSoundEnabled(e.target.checked)
                    }
                    disabled={spinning}
                    className="h-4 w-4 accent-[#2563eb]"
                  />
                </label>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={shuffleNames}
                  disabled={spinning || names.length < 2}
                  className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] py-2.5 text-[10px] font-bold text-[#4b5563] hover:border-[#bfdbfe] disabled:opacity-40"
                >
                  Shuffle
                </button>

                <button
                  onClick={clearAll}
                  disabled={spinning || names.length === 0}
                  className="rounded-xl border border-[#fee2e2] bg-[#fffafa] py-2.5 text-[10px] font-bold text-[#dc2626] hover:bg-[#fef2f2] disabled:opacity-40"
                >
                  Clear all
                </button>
              </div>
            </section>

            {/* Entries */}
            <section className="rounded-[22px] border border-[#e5e7eb] bg-white p-4 shadow-[0_12px_45px_rgba(15,23,42,0.05)]">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-[13px] font-black text-[#111827]">
                    Entries
                  </h2>

                  <p className="mt-0.5 text-[10px] text-[#9ca3af]">
                    These names are on the wheel.
                  </p>
                </div>

                <span className="text-[10px] font-bold text-[#6b7280]">
                  {uniqueNames.length}
                </span>
              </div>

              <div className="max-h-[280px] space-y-1.5 overflow-y-auto pr-1">
                {uniqueNames.map((name, index) => (
                  <div
                    key={`${name}-${index}`}
                    className="flex items-center justify-between rounded-xl bg-[#f9fafb] px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          background:
                            COLORS[index % COLORS.length],
                        }}
                      />

                      <span className="truncate text-[10px] font-semibold text-[#374151]">
                        {name}
                      </span>
                    </div>

                    <button
                      onClick={() => removeName(index)}
                      disabled={spinning}
                      aria-label={`Remove ${name}`}
                      className="ml-2 text-[16px] font-medium leading-none text-[#9ca3af] hover:text-[#dc2626] disabled:opacity-30"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {uniqueNames.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[#d1d5db] px-3 py-8 text-center">
                    <p className="text-[10px] font-bold text-[#6b7280]">
                      No entries yet
                    </p>

                    <p className="mt-1 text-[9px] text-[#9ca3af]">
                      Add names above to build your wheel.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>

        {/* Winner history */}
        {history.length > 0 && (
          <section className="mt-5 rounded-[22px] border border-[#e5e7eb] bg-white p-4 shadow-[0_12px_45px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[13px] font-black text-[#111827]">
                  Winner history
                </h2>

                <p className="mt-0.5 text-[10px] text-[#9ca3af]">
                  Your most recent selections.
                </p>
              </div>

              <button
                onClick={() => setHistory([])}
                className="text-[9px] font-bold text-[#6b7280] hover:text-[#dc2626]"
              >
                Clear history
              </button>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {history.map((item, index) => (
                <div
                  key={`${item.name}-${item.time}-${index}`}
                  className="flex items-center justify-between rounded-xl bg-[#f9fafb] px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-[11px] font-black text-[#2563eb]">
                      #{index + 1}
                    </span>

                    <span className="truncate text-[10px] font-bold text-[#374151]">
                      {item.name}
                    </span>
                  </div>

                  <span className="ml-2 text-[8px] font-medium text-[#9ca3af]">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* How to use */}
        <section className="mx-auto mt-8 max-w-[850px] text-center">
          <h2 className="text-[16px] font-black tracking-[-0.02em] text-[#111827]">
            Free Random Name Picker
          </h2>

          <p className="mt-2 text-[11px] leading-5 text-[#6b7280]">
            Use the wheel for giveaways, classrooms, team selection,
            games, lunch decisions, contests, raffles, and everyday
            random choices. Add as many names as you need, then spin.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              "Giveaways",
              "Classrooms",
              "Team Picker",
              "Random Winner",
              "Games",
              "Contests",
              "Raffles",
              "Decision Maker",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5 text-[9px] font-bold text-[#6b7280]"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-9 border-t border-[#f0f0f0] pt-5 text-center">
          <p className="text-[9px] font-medium text-[#9ca3af]">
            Free to use • No sign-up required • thenexoratools
          </p>
        </footer>
      </div>
    </main>
  );
}
