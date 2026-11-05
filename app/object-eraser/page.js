"use client";
import { useRef, useState, useEffect } from "react";
import Script from "next/script";

export default function ObjectEraser() {
  const mainRef = useRef(null);
  const maskRef = useRef(null);
  const imgRef = useRef(null);
  const [hasImage, setHasImage] = useState(false);
  const [mode, setMode] = useState("brush");
  const [brushSize, setBrushSize] = useState(30);
  const [drawing, setDrawing] = useState(false);
  const [status, setStatus] = useState("Photo upload karo, fir object pe finger ghumao");
  const [result, setResult] = useState(null);

  const getPos = (e) => {
    const canvas = mainRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const maxW = 900;
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > maxW) { h = (h * maxW) / w; w = maxW; }
      const main = mainRef.current, mask = maskRef.current;
      main.width = w; main.height = h;
      mask.width = w; mask.height = h;
      main.getContext("2d").drawImage(img, 0, 0, w, h);
      mask.getContext("2d").clearRect(0, 0, w, h);
      setHasImage(true);
      setResult(null);
      setStatus("Ab finger se object pe ghumao, laal rang aayega");
    };
    img.src = url;
  };

  const startDraw = (e) => {
    if (!hasImage) return;
    setDrawing(true);
    const ctx = maskRef.current.getContext("2d");
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    draw(e);
  };

  const draw = (e) => {
    if (!drawing && e.type !== "pointerdown") return;
    if (e.cancelable) e.preventDefault();
    const ctx = maskRef.current.getContext("2d");
    const p = getPos(e);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (mode === "brush") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(255,40,60,0.65)";
      ctx.lineWidth = brushSize;
    } else {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushSize;
    }
    ctx.lineTo(p.x, p.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
  };

  const clearMask = () => {
    const m = maskRef.current;
    m.getContext("2d").clearRect(0, 0, m.width, m.height);
  };

  const removeObject = async () => {
    const mask = maskRef.current;
    const data = mask.getContext("2d").getImageData(0, 0, mask.width, mask.height).data;
    let has = false;
    for (let i = 3; i < data.length; i += 4) { if (data[i] > 10) { has = true; break; } }
    if (!has) { setStatus("Pehle object pe finger se ghumao!"); return; }

    setStatus("AI background bana raha hai... 10-15 sec ruko...");
    setResult(null);
    try {
      const tmp = document.createElement("canvas");
      tmp.width = mainRef.current.width; tmp.height = mainRef.current.height;
      const tctx = tmp.getContext("2d");
      tctx.drawImage(imgRef.current, 0, 0, tmp.width, tmp.height);
      tctx.drawImage(mask, 0, 0);
      const maskedImg = tmp.toDataURL("image/png");

      // @ts-ignore - puter global
      const out = await window.puter.ai.txt2img(
        "Remove the object marked in red completely. Fill that red area with natural background matching surrounding photo. Keep rest of photo 100% same, same face, same lighting, photorealistic. No red mark in final image.",
        { model: "gpt-image-2", quality: "low", input_image: maskedImg }
      );
      setResult(out.src);
      setStatus("Ho gaya! ✅ Object gayab, background ban gaya.");
    } catch (err) {
      setStatus("AI fail hua. Puter me sign in karke dobara try karo.");
    }
  };

  return (
    <>
      <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
      <div style={{ minHeight: "100vh", background: "radial-gradient(circle at 20% 0%,#12366b 0,#07111f 38%,#050b14 100%)", color: "#fff", fontFamily: "Inter,system-ui,sans-serif" }}>
        <header style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6%", borderBottom: "1px solid #ffffff12" }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Nexora<span style={{ color: "#67a9ff" }}> Tools</span></div>
          <div style={{ color: "#a9bdd6", fontSize: 14 }}>Object Eraser • Pro</div>
        </header>

        <div style={{ textAlign: "center", padding: "40px 20px 20px" }}>
          <h1 style={{ fontSize: "clamp(32px,6vw,52px)", margin: 0 }}>Remove Anything, Like Samsung ✨</h1>
          <p style={{ color: "#9bb0c8", maxWidth: 600, margin: "10px auto" }}>Photo pe finger ghumao, object gayab. Background AI khud bana dega. Baaki photo same rahega.</p>
        </div>

        <div style={{ maxWidth: 1000, margin: "20px auto 60px", padding: "0 16px" }}>
          <div style={{ background: "#071321cc", border: "1px solid #ffffff14", borderRadius: 24, padding: 20 }}>
            <label style={{ border: "1px dashed #ffffff30", borderRadius: 18, padding: 24, textAlign: "center", color: "#9db1c9", cursor: "pointer", display: "block" }}>
              📷 Tap to choose a photo
              <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            </label>

            {hasImage && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "15px 0" }}>
                <button onClick={() => setMode("brush")} style={{ padding: "10px 14px", borderRadius: 10, background: mode === "brush" ? "#2477ff" : "#ffffff10", color: "#fff", fontWeight: 700, border: 0, cursor: "pointer" }}>🖌️ Brush</button>
                <button onClick={() => setMode("eraser")} style={{ padding: "10px 14px", borderRadius: 10, background: mode === "eraser" ? "#2477ff" : "#ffffff10", color: "#fff", fontWeight: 700, border: 0, cursor: "pointer" }}>🧽 Eraser</button>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>Size <input type="range" min="10" max="80" value={brushSize} onChange={(e) => setBrushSize(+e.target.value)} /></label>
                <button onClick={clearMask} style={{ padding: "10px 14px", borderRadius: 10, background: "#ffffff10", color: "#fff", border: 0, cursor: "pointer" }}>Clear All</button>
              </div>
            )}

            <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", background: "#000", display: hasImage ? "block" : "none", touchAction: "none" }}>
              <canvas ref={mainRef} onPointerDown={startDraw} onPointerMove={draw} onPointerUp={() => setDrawing(false)} style={{ display: "block", width: "100%", height: "auto", touchAction: "none" }} />
              <canvas ref={maskRef} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", width: "100%", height: "100%" }} />
            </div>

            {hasImage && (
              <div style={{ display: "flex", gap: 9, marginTop: 15 }}>
                <button onClick={removeObject} style={{ background: "#2477ff", color: "#fff", border: 0, borderRadius: 13, padding: "14px 20px", fontWeight: 800, cursor: "pointer", flex: 1 }}>✨ Remove Object - AI Fill</button>
              </div>
            )}

            <div style={{ color: "#8ea5bf", fontSize: 13, marginTop: 10, textAlign: "center" }}>{status}</div>

            {result && (
              <div style={{ marginTop: 18, textAlign: "center" }}>
                <img src={result} style={{ maxWidth: "100%", borderRadius: 18 }} alt="erased" />
                <br />
                <a href={result} download="nexora-erased.png" target="_blank" style={{ display: "inline-block", marginTop: 12, color: "#fff", textDecoration: "none", background: "#2477ff", padding: "12px 18px", borderRadius: 10, fontWeight: 700 }}>⬇️ Download Clean Photo</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
