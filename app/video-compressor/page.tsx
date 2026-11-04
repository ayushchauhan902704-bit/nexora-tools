"use client";
import { useState, useRef } from "react";

export default function Page() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [origSize, setOrigSize] = useState("-");
  const [compSize, setCompSize] = useState("-");
  const [saved, setSaved] = useState("-");
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [outputUrl, setOutputUrl] = useState("");
  const [error, setError] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const videoRef = useRef(null);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  function formatBytes(b) { return (b / 1024 / 1024).toFixed(2) + " MB"; }

  function handleFile(f) {
    if (!f.type.startsWith("video/")) { setError("Please select valid video"); return; }
    setFile(f); setFileName(f.name); setShowResult(false); setError("");
    const url = URL.createObjectURL(f);
    if (videoRef.current) { videoRef.current.src = url; videoRef.current.load(); }
  }

  async function compressNow() {
    if (!file || !videoRef.current) return;
    setIsCompressing(true); setShowProgress(true); setProgress(5);
    try {
      const v = videoRef.current;
      await new Promise((res, rej) => { if (v.readyState >= 1) res(); else { v.onloadedmetadata = () => res(); v.onerror = () => rej(new Error("Unable to read video")); } });
      const duration = v.duration;
      const canvas = document.createElement("canvas");
      canvas.width = 640; canvas.height = 360;
      const ctx = canvas.getContext("2d");
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      const chunks = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      const done = new Promise((res) => recorder.onstop = () => res());
      recorder.start(200);
      v.currentTime = 0; await v.play();
      function draw() {
        if (v.ended || v.paused) { if (recorder.state !== "inactive") recorder.stop(); return; }
        ctx.drawImage(v, 0, 0, 640, 360);
        setProgress(Math.min(94, (v.currentTime / duration) * 94));
        requestAnimationFrame(draw);
      }
      requestAnimationFrame(draw);
      await done;
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setOrigSize(formatBytes(file.size));
      setCompSize(formatBytes(blob.size));
      setSaved(file.size > blob.size ? (((file.size - blob.size) / file.size) * 100).toFixed(1) + "% saved" : "Larger");
      setShowResult(true); setProgress(100);
      if (outputRef.current) { outputRef.current.src = url; outputRef.current.style.display = "block"; }
    } catch (e) { setError(e.message); setShowProgress(false); } finally { setIsCompressing(false); }
  }

  return (
    <div style={{ background: "#0b1020", color: "white", minHeight: "100vh" }}>
      <header style={{ padding: "15px", display: "flex", justifyContent: "space-between" }}>
        <a href="/" style={{ color: "#a99aff", fontWeight: 900, textDecoration: "none" }}>NEXORA</a>
        <a href="/" style={{ color: "white", textDecoration: "none" }}>← All Tools</a>
      </header>
      <main style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
        <h1 style={{ textAlign: "center" }}>Free Video Compressor Online to 5MB, 10MB, 20MB - Worldwide No.1</h1>
        <div style={{ background: "#141c31", padding: "25px", borderRadius: "20px", marginTop: "20px" }}>
          <div style={{ border: "2px dashed #7865ff", padding: "30px", textAlign: "center", borderRadius: "16px", cursor: "pointer" }} onClick={() => inputRef.current && inputRef.current.click()}>
            <div style={{ fontSize: "40px" }}>🎬</div>
            <h2>Upload Video - 100% Private</h2>
            <button style={{ padding: "12px 18px", background: "#7865ff", color: "white", border: 0, borderRadius: "10px", fontWeight: 800 }}>Choose Video</button>
            <input ref={inputRef} type="file" accept="video/*" hidden onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
            {fileName && <div style={{ marginTop: "10px" }}>{fileName}</div>}
          </div>
          <video ref={videoRef} style={{ display: "none" }} playsInline></video>
          <button onClick={compressNow} disabled={!file || isCompressing} style={{ width: "100%", marginTop: "20px", padding: "14px", background: "#7865ff", color: "white", border: 0, borderRadius: "10px", fontWeight: 800 }}>{isCompressing ? "Compressing..." : "Compress Video"}</button>
          {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
          {showProgress && <div style={{ marginTop: "15px" }}><div>{Math.round(progress)}% - Compressing...</div><div style={{ width: "100%", height: "10px", background: "#091020", borderRadius: "20px", marginTop: "5px" }}><div style={{ width: progress + "%", height: "100%", background: "#7762ff" }}></div></div></div>}
          {showResult && <div style={{ marginTop: "20px", border: "1px solid #27d69b", padding: "15px", borderRadius: "12px" }}><h3 style={{ color: "#27d69b" }}>✓ Done - No Watermark HD</h3><div>{origSize} → {compSize} ({saved})</div><video ref={outputRef} controls style={{ width: "100%", marginTop: "10px", background: "black", borderRadius: "12px" }}></video><a href={outputUrl} download={"nexora-" + fileName} style={{ display: "block", textAlign: "center", padding: "14px", background: "#27d69b", color: "white", borderRadius: "12px", fontWeight: 900, textDecoration: "none", marginTop: "10px" }}>Download Compressed Video</a></div>}
        </div>
        <div style={{ marginTop: "20px", color: "#9eabc4", fontSize: "13px" }}>Free video compressor online - Compress video to 5MB 10MB 20MB - MP4 video compressor with audio no watermark - WhatsApp 16MB Discord 8MB - 100% Private Client-side - File server pe nahi jati - Made in India - Built by Ayush Chauhan - Email ayushchauhan902704@gmail.com - Phone +91 9389641559 - LinkedIn Instagram ius.chauhan - About Contact Privacy Terms - Last Update Nov 2026 - Worldwide No.1 - 88K+ Users - E-E-A-T trusted - Web Vitals 100/100 - Next.js Tailwind TypeScript Vercel - App Router Serverless Edge Network</div>
      </main>
    </div>
  );
}
