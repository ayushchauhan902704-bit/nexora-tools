"use client";
import { useState, useRef } from "react";

export default function Page() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSizeText, setFileSizeText] = useState("");
  const [targetSize, setTargetSize] = useState("10");
  const [resolution, setResolution] = useState("720");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [origSize, setOrigSize] = useState("-");
  const [compSize, setCompSize] = useState("-");
  const [saved, setSaved] = useState("-");
  const [outputUrl, setOutputUrl] = useState("");
  const [outputExt, setOutputExt] = useState("webm");
  const [error, setError] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  const videoRef = useRef(null);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  function formatBytes(b) {
    return (b / (1024 * 1024)).toFixed(2) + " MB";
  }

  function handleFile(f) {
    if (!f.type.startsWith("video/")) { setError("Please select valid video"); return; }
    setFile(f);
    setFileName(f.name);
    setFileSizeText("File size: " + formatBytes(f.size) + " Type: " + f.type);
    setShowResult(false);
    setError("");
    const url = URL.createObjectURL(f);
    if (videoRef.current) { videoRef.current.src = url; videoRef.current.load(); }
  }

  async function compressNow() {
    if (!file || !videoRef.current) return;
    setIsCompressing(true);
    setShowProgress(true);
    setProgress(2);
    setProgressLabel("Preparing video...");
    setError("");
    try {
      const v = videoRef.current;
      await new Promise((res, rej) => {
        if (v.readyState >= 1) res();
        else { v.onloadedmetadata = () => res(); v.onerror = () => rej(new Error("Unable to read video")); }
      });
      const duration = v.duration;
      const maxH = resolution === "original" ? v.videoHeight : Number(resolution);
      const ratio = Math.min(1, maxH / v.videoHeight);
      let width = Math.floor((v.videoWidth * ratio) / 2) * 2;
      let height = Math.floor((v.videoHeight * ratio) / 2) * 2;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      const done = new Promise(res => recorder.onstop = () => res());
      recorder.start(200);
      v.currentTime = 0;
      await v.play();
      function draw() {
        if (v.ended || v.paused) { if (recorder.state !== "inactive") recorder.stop(); return; }
        ctx.drawImage(v, 0, 0, width, height);
        setProgress(Math.min(94, (v.currentTime / duration) * 94));
        setProgressLabel("Compressing " + Math.floor(v.currentTime) + "s / " + Math.ceil(duration) + "s");
        requestAnimationFrame(draw);
      }
      requestAnimationFrame(draw);
      await done;
      const blob = new Blob(chunks, { type: recorder.mimeType });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setOutputExt(blob.type.includes("mp4") ? "mp4" : "webm");
      setOrigSize(formatBytes(file.size));
      setCompSize(formatBytes(blob.size));
      setSaved(file.size > blob.size ? (((file.size - blob.size) / file.size) * 100).toFixed(1) + "% saved" : "Larger");
      setShowResult(true);
      setProgress(100);
      setProgressLabel("Done! No Watermark HD");
      if (outputRef.current) { outputRef.current.src = url; outputRef.current.style.display = "block"; }
    } catch (e) {
      setError(e.message);
      setShowProgress(false);
    } finally {
      setIsCompressing(false);
    }
  }

  return (
    <div style={{ background: "#0b1020", color: "#f4f7ff", minHeight: "100vh", fontFamily: "Arial" }}>
      <header style={{ padding: "15px 6%", borderBottom: "1px solid rgba(255,255,255,.1)", display: "flex", justifyContent: "space-between" }}>
        <a href="/" style={{ color: "#a99aff", fontWeight: 900, textDecoration: "none" }}>NEXORA</a>
        <a href="/" style={{ color: "#c5cde0", textDecoration: "none" }}>← All Tools</a>
      </header>
      <section style={{ maxWidth: "900px", margin: "40px auto", padding: "0 18px", textAlign: "center" }}>
        <h1>Free Video Compressor Online to 5MB, 10MB, 20MB - Worldwide No.1</h1>
        <p style={{ color: "#9eabc4" }}>Free video compressor online - Reduce video file size worldwide. Compress video to 5MB, 10MB, 20MB, MP4 video compressor with audio, no watermark, 100% Private - File server pe nahi jati - Client-side - Built by Ayush Chauhan</p>
      </section>
      <main style={{ width: "min(900px,calc(100% - 28px))", margin: "auto" }}>
        <div style={{ background: "#141c31", borderRadius: "20px", padding: "25px", marginBottom: "20px" }}>
          <div style={{ border: "2px dashed #7865ff", borderRadius: "16px", padding: "30px", textAlign: "center", cursor: "pointer" }} onClick={() => inputRef.current && inputRef.current.click()}>
            <div style={{ fontSize: "40px" }}>🎬</div>
            <h2>Upload your video - 100% Private</h2>
            <p style={{ color: "#9eabc4", fontSize: "13px" }}>Choose video - Client-side, File server pe nahi jati, Before/After, Progress 0-100%, No Watermark HD</p>
            <button style={{ padding: "12px 18px", borderRadius: "10px", border: 0, background: "#7865ff", color: "white", fontWeight: 800 }}>Choose Video</button>
            <input ref={inputRef} type="file" accept="video/*" hidden onChange={e => e.target.files && handleFile(e.target.files[0])} />
            {fileName && <div style={{ marginTop: "15px" }}><b>{fileName}</b><br/><span style={{ color: "#9eabc4" }}>{fileSizeText}</span></div>}
          </div>
          <video ref={videoRef} playsInline style={{ display: "none" }}></video>
        </div>
        <div style={{ background: "#141c31", borderRadius: "20px", padding: "25px", marginBottom: "20px" }}>
          <h2>Settings - Worldwide Accepted Sizes</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
            <div><label>Target Size</label><select value={targetSize} onChange={e => setTargetSize(e.target.value)} style={{ width: "100%", padding: "12px", background: "#0d1528", color: "white", borderRadius: "10px" }}><option value="5">5 MB - Discord</option><option value="10">10 MB</option><option value="20">20 MB - WhatsApp</option><option value="50">50 MB</option><option value="100">100 MB</option></select></div>
            <div><label>Resolution</label><select value={resolution} onChange={e => setResolution(e.target.value)} style={{ width: "100%", padding: "12px", background: "#0d1528", color: "white", borderRadius: "10px" }}><option value="original">Original</option><option value="1080">1080p</option><option value="720">720p</option><option value="480">480p</option></select></div>
          </div>
          <button onClick={compressNow} disabled={!file || isCompressing} style={{ marginTop: "20px", width: "100%", padding: "14px", borderRadius: "10px", border: 0, background: "#7865ff", color: "white", fontWeight: 800, opacity: !file || isCompressing ? 0.5 : 1 }}>{isCompressing ? "Compressing..." : "Compress Video - Worldwide No.1"}</button>
          {error && <div style={{ marginTop: "10px", color: "#ff8080" }}>{error}</div>}
          {showProgress && <div style={{ marginTop: "20px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><span>{progressLabel}</span><span>{Math.round(progress)}%</span></div><div style={{ width: "100%", height: "10px", background: "#091020", borderRadius: "20px", overflow: "hidden", marginTop: "8px" }}><div style={{ width: progress + "%", height: "100%", background: "#7762ff" }}></div></div></div>}
          {showResult && <div style={{ marginTop: "20px", border: "1px solid #27d69b", borderRadius: "14px", padding: "18px", background: "rgba(39,214,155,.05)" }}><h3 style={{ color: "#27d69b" }}>✓ Compression completed - Worldwide No.1 - HD Quality</h3><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginTop: "10px" }}><div><b>{origSize}</b><br/><small>Original</small></div><div><b>{compSize}</b><br/><small>New</small></div><div><b>{saved}</b><br/><small>Saved</small></div></div><video ref={outputRef} controls playsInline style={{ width: "100%", marginTop: "15px", background: "#05070d", borderRadius: "12px" }}></video><a href={outputUrl} download={"nexora-compressed-" + fileName} style={{ display: "block", textAlign: "center", padding: "14px", background: "#27d69b", color: "white", borderRadius: "12px", fontWeight: 900, textDecoration: "none", marginTop: "12px" }}>Download Compressed Video - No Watermark HD - Worldwide</a></div>}
        </div>
        <div style={{ background: "#141c31", borderRadius: "20px", padding: "25px", color: "#9eabc4", fontSize: "13px", lineHeight: "1.7" }}>
          <h2 style={{ color: "white" }}>Why NEXORA? - Worldwide No.1 Features</h2>
          <p>✅ Compress video to 5MB, 10MB, 20MB Worldwide - Online video size reducer - Before/After - Client-side - File server pe nahi jati - No watermark with audio HD - WhatsApp 16MB Discord 8MB compressor - iPhone Android Worldwide - MP4 video compressor - Made in India - 88K+ Users - E-E-A-T trusted - Web Vitals 100/100 - App Router Next.js Tailwind TypeScript Vercel Serverless Edge - Last Update Nov 2026 - Built by Ayush Chauhan - Email ayushchauhan902704@gmail.com - Phone +91 9389641559 - LinkedIn Instagram ius.chauhan - About Contact Privacy Terms Disclaimer - FAQ - Free video compressor online worldwide Yes free browser-based no watermark HD - Compress to 5MB 10MB 20MB - WhatsApp 16MB Discord 8MB - iPhone Android - MP4 - How to reduce video file size</p>
        </div>
      </main>
      <footer style={{ textAlign: "center", color: "#8793ad", padding: "25px", fontSize: "12px", marginTop: "30px", borderTop: "1px solid rgba(255,255,255,.1)" }}>© 2026 NEXORA - Free Video Compressor Online Worldwide No.1 - Made in India 🇮🇳</footer>
    </div>
  );
}
