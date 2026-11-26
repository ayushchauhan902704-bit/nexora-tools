"use client";
import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";

const COLORS = ["#FF4757","#FFA502","#2ED573","#1E90FF","#ECCC68","#FF6B81","#7BED9F","#70A1FF","#FF7F50","#A55EEA","#26DE81","#F78FB3"];

export default function SpinWheelClient() {
  const [names, setNames] = useState(["Ayush","Rahul","Priya","Aman","Sneha","Vikash","Neha","Rohan"]);
  const [input, setInput] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addName = () => {
    if(!input.trim()) return;
    setNames([...names, input.trim()]);
    setInput("");
  };

  const removeName = (i: number) => {
    setNames(names.filter((_, idx) => idx !== i));
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    if(!ctx) return;
    const size = 340;
    const center = size / 2;
    const anglePer = (Math.PI * 2) / names.length;

    ctx.clearRect(0,0,size,size);
    names.forEach((name, i) => {
      const start = i * anglePer;
      const end = start + anglePer;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, center - 4, start, end);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(start + anglePer / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 15px Inter, sans-serif";
      ctx.fillText(name.slice(0, 14), center - 18, 6);
      ctx.restore();
    });

    // Center Circle
    ctx.beginPath();
    ctx.arc(center, center, 32, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 13px Inter";
    ctx.textAlign = "center";
    ctx.fillText("SPIN", center, center + 5);
  };

  useEffect(() => { drawWheel(); }, [names, rotation]);

  const spin = () => {
    if(spinning || names.length < 2) return;
    setSpinning(true);
    setWinner(null);
    const extra = 360 * 6 + Math.floor(Math.random() * 360);
    const newRot = rotation + extra;
    setRotation(newRot);

    // Winner calculate
    const total = 360;
    const normalized = (360 - (newRot % 360)) % 360;
    const idx = Math.floor(normalized / (total / names.length)) % names.length;

    setTimeout(() => {
      const win = names[idx];
      setWinner(win);
      setHistory([win, ...history].slice(0, 10));
      setSpinning(false);
      confetti({ particleCount: 180, spread: 90, origin: { y: 0.6 } });
      if(removeWinner) setNames(names.filter(n => n !== win));
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black">🎡 Spin Wheel <span className="text-yellow-400">PRO</span></h1>
          <p className="text-zinc-400 mt-2">Winner decide karo - Giveaway, Team, Game sab ke liye</p>
        </div>

        <div className="grid md:grid-cols-[1fr_380px] gap-6">
          {/* Wheel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center relative">
            <div className="relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[30px] border-t-yellow-400 drop-shadow-[0_0_10px_#FFD700]" />
              <div style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 4.5s cubic-bezier(0.12, 0.8, 0.08, 1)" : "none" }}>
                <canvas ref={canvasRef} width={340} height={340} className="max-w-full h-auto drop-shadow-2xl" />
              </div>
            </div>

            <button onClick={spin} disabled={spinning}
              className="mt-6 w-full py-4 rounded-2xl bg-yellow-400 text-black font-black text-xl hover:bg-yellow-300 disabled:opacity-50 active:scale-[0.98] transition">
              {spinning ? "Spinning... 🎡" : "SPIN NOW 🚀"}
            </button>

            {winner && (
              <div className="mt-4 w-full bg-green-500/10 border border-green-500 rounded-2xl p-4 text-center animate-bounce">
                <p className="text-sm text-green-400">🏆 WINNER</p>
                <p className="text-3xl font-black">{winner}</p>
              </div>
            )}

            {history.length > 0 && (
              <div className="mt-4 w-full">
                <p className="text-xs text-zinc-500 mb-2">Recent Winners:</p>
                <div className="flex flex-wrap gap-2">{history.map((h,i)=><span key={i} className="px-3 py-1 bg-zinc-800 rounded-full text-sm">🏆 {h}</span>)}</div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 h-fit">
            <h3 className="font-bold text-lg mb-3">Entries ({names.length})</h3>
            <div className="flex gap-2">
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addName()}
                placeholder="Naam likho..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 outline-none focus:border-yellow-400" />
              <button onClick={addName} className="bg-white text-black px-4 rounded-xl font-bold">Add</button>
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={()=>setNames([...names,"Team A","Team B"])} className="text-xs bg-zinc-800 px-3 py-2 rounded-lg">+ Demo</button>
              <button onClick={()=>setNames([])} className="text-xs bg-zinc-800 px-3 py-2 rounded-lg">Clear All</button>
              <button onClick={()=>{const arr=[...names]; for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} setNames(arr);}} className="text-xs bg-zinc-800 px-3 py-2 rounded-lg">Shuffle</button>
            </div>

            <label className="flex items-center gap-2 mt-4 text-sm text-zinc-300 cursor-pointer">
              <input type="checkbox" checked={removeWinner} onChange={e=>setRemoveWinner(e.target.checked)} className="accent-yellow-400 w-4 h-4" />
              Winner ko list se hata do
            </label>

            <div className="mt-4 space-y-2 max-h-[320px] overflow-auto pr-1">
              {names.map((n,i)=>(
                <div key={i} className="flex justify-between items-center bg-zinc-800/70 px-3 py-2 rounded-xl">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{background: COLORS[i%COLORS.length]}} />{n}</span>
                  <button onClick={()=>removeName(i)} className="text-red-400 text-lg leading-none">×</button>
                </div>
              ))}
              {names.length===0 && <p className="text-zinc-500 text-sm text-center py-6">Koi entry nahi hai, upar se add karo</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
