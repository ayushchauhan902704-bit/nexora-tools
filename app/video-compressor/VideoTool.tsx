"use client";
import { useRef, useState } from "react";

export default function VideoTool() {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const sourceVideoRef = useRef<HTMLVideoElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceURL, setSourceURL] = useState<string>("");
  const [targetValue, setTargetValue] = useState("10");
  const [currentUnit, setCurrentUnit] = useState<"KB" | "MB">("MB");
  const [activeChip, setActiveChip] = useState("10 MB");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [statusText, setStatusText] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [outputURL, setOutputURL] = useState("");
  const [outputExtension, setOutputExtension] = useState("mp4");
  const [isCompressing, setIsCompressing] = useState(false);

  const fmt = (b: number) => {
    if (!b || b <= 0) return "0 KB";
    if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
    return (b / (1024 * 1024)).toFixed(2) + " MB";
  };

  const chips = [
    { label: "100 KB", val: "100", unit: "KB" as const },
    { label: "200 KB", val: "200", unit: "KB" as const },
    { label: "500 KB", val: "500", unit: "KB" as const },
    { label: "800 KB", val: "800", unit: "KB" as const },
    { label: "1 MB", val: "1", unit: "MB" as const },
    { label: "2 MB", val: "2", unit: "MB" as const },
    { label: "5 MB", val: "5", unit: "MB" as const },
    { label: "8 MB", val: "8", unit: "MB" as const },
    { label: "10 MB", val: "10", unit: "MB" as const },
    { label: "16 MB", val: "16", unit: "MB" as const },
    { label: "20 MB", val: "20", unit: "MB" as const },
    { label: "25 MB", val: "25", unit: "MB" as const },
    { label: "50 MB", val: "50", unit: "MB" as const },
    { label: "100 MB", val: "100", unit: "MB" as const },
  ];

  const selectFile = (f: File | undefined | null) => {
    setError(""); setResult(null); setOutputURL("");
    if (!f) return;
    if (!f.type.startsWith("video/")) { setError("Please upload a video file."); return; }
    if (sourceURL) URL.revokeObjectURL(sourceURL);
    const url = URL.createObjectURL(f);
    setSelectedFile(f); setSourceURL(url);
    if (sourceVideoRef.current) { sourceVideoRef.current.src = url; sourceVideoRef.current.load(); }
  };

  const getTargetBytes = () => {
    const v = Number(targetValue);
    if (!Number.isFinite(v) || v <= 0) throw new Error("Please enter a valid size.");
    if (currentUnit === "KB") {
      if (v < 100 || v > 102400) throw new Error("KB me 100KB se 102400KB tak likho.");
      return v * 1000;
    } else {
      if (v < 0.1 || v > 100) throw new Error("MB me 0.1MB se 100MB tak likho.");
      return v * 1000 * 1000;
    }
  };

  const compress = async () => {
    if (!selectedFile || isCompressing) return;
    setError(""); setResult(null); setOutputURL("");
    let targetBytes: number;
    try { targetBytes = getTargetBytes(); } catch (e: any) { setError(e.message); return; }
    const sourceVideo = sourceVideoRef.current!;
    setIsCompressing(true); setShowProgress(true);
    setProgress(2); setProgressLabel("Preparing..."); setStatusText("Video load ho rahi hai.");

    try {
      await new Promise<void>((res, rej) => {
        if (sourceVideo.readyState >= 1) res();
        else sourceVideo.addEventListener("loadedmetadata", () => res(), { once: true });
        setTimeout(() => rej(new Error("Load timeout")), 20000);
      });
      const dur = sourceVideo.duration;
      if (!dur || dur <= 0) throw new Error("Duration nahi mili.");
      if (dur > 600) throw new Error("10 minute se choti video use karo.");

      // 100KB FIX - Chhote target pe auto chhota resolution + kam FPS + kam audio
      let maxW = 1280;
      let fps = 30;
      let audioBps = 128000;
      if (targetBytes < 300 * 1000) { maxW = 240; fps = 10; audioBps = 24000; }
      else if (targetBytes < 1000 * 1000) { maxW = 360; fps = 15; audioBps = 32000; }
      else if (targetBytes < 5 * 1000 * 1000) { maxW = 720; fps = 24; audioBps = 64000; }

      let w = sourceVideo.videoWidth, h = sourceVideo.videoHeight;
      if (w > maxW) { const r = maxW / w; w = Math.floor(w * r / 2) * 2; h = Math.floor(h * r / 2) * 2; }
      w = Math.max(2, w); h = Math.max(2, h);

      // Bitrate - 92% target use karo, audio minus karke
      const totalBits = (targetBytes * 8 / dur) * 0.92;
      let videoBitrate = Math.max(15000, Math.floor(totalBits - audioBps));
      // Agar bahut chhota target hai to audio band karke sirf video rakho
      let useAudio = true;
      if (targetBytes < 250 * 1000 && dur > 20) { useAudio = false; audioBps = 0; videoBitrate = Math.max(15000, Math.floor(totalBits)); }

      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      const canvasStream: any = (canvas as any).captureStream(fps);

      let audioTracks: any[] = [];
      let audioContext: any = null;
      if (useAudio) {
        try {
          const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
          audioContext = new AC();
          if (audioContext.state === "suspended") await audioContext.resume();
          const srcNode = audioContext.createMediaElementSource(sourceVideo);
          const dest = audioContext.createMediaStreamDestination();
          const gain = audioContext.createGain(); gain.gain.value = 1;
          const silent = audioContext.createGain(); silent.gain.value = 0;
          srcNode.connect(gain); gain.connect(dest);
          srcNode.connect(silent); silent.connect(audioContext.destination);
          audioTracks = dest.stream.getAudioTracks();
        } catch { audioTracks = []; }
      }

      const combined = new MediaStream();
      canvasStream.getVideoTracks().forEach((t: any) => combined.addTrack(t));
      audioTracks.forEach((t: any) => combined.addTrack(t));

      const allMimes = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
      let mime = "video/webm";
      for (const t of allMimes) { if ((MediaRecorder as any).isTypeSupported(t)) { mime = t; break; } }
      const recorder = new MediaRecorder(combined, { mimeType: mime, videoBitsPerSecond: videoBitrate, audioBitsPerSecond: audioBps } as any);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      const done = new Promise<void>((res) => { recorder.onstop = () => res(); });
      sourceVideo.muted = false; sourceVideo.volume = 1;
      recorder.start(500);
      sourceVideo.pause(); sourceVideo.currentTime = 0;
      await new Promise<void>((res) => { sourceVideo.addEventListener("seeked", () => res(), { once: true }); });
      await new Promise<void>((resolve, reject) => {
        let last = 0, fin = false; let raf = 0;
        const finish = () => { if (fin) return; fin = true; cancelAnimationFrame(raf); resolve(); };
        const draw = (now: number) => {
          if (fin) return;
          if (sourceVideo.ended) { finish(); return; }
          if (now - last >= 1000 / fps) { ctx.drawImage(sourceVideo, 0, 0, w, h); last = now; }
          setProgress(Math.min(94, (sourceVideo.currentTime / dur) * 94));
          setProgressLabel("Compressing..."); setStatusText(`${Math.floor(sourceVideo.currentTime)} / ${Math.ceil(dur)} sec`);
          raf = requestAnimationFrame(draw);
        };
        sourceVideo.onended = finish;
        sourceVideo.play().then(() => { raf = requestAnimationFrame(draw); }).catch(() => reject(new Error("Play nahi hui")));
      });
      sourceVideo.pause();
      setProgress(96); setProgressLabel("Finishing..."); setStatusText("Saving...");
      if (recorder.state !== "inactive") recorder.stop();
      await done;
      if (audioContext) { try { await audioContext.close(); } catch {} }
      const outputBlob = new Blob(chunks, { type: mime.split(";")[0] });
      if (!outputBlob.size) throw new Error("Empty file bana.");
      const outUrl = URL.createObjectURL(outputBlob);
      const ext = outputBlob.type.includes("mp4") ? "mp4" : "webm";
      setOutputURL(outUrl); setOutputExtension(ext);
      const orig = selectedFile.size, nowB = outputBlob.size, diff = orig - nowB;
      setResult({ orig: fmt(orig), now: fmt(nowB), saved: diff > 0 ? ((diff / orig) * 100).toFixed(1) + "% kam" : "-", big: `${fmt(orig)} → ${fmt(nowB)}`, note: `Target tha: ${fmt(targetBytes)}. ${nowB <= targetBytes ? "Target ke andar hai." : "Thoda bada hai - 100KB jaise chhote target pe lambi video me quality bahut kam hogi."} ${audioTracks.length ? "Audio ke saath." : "Audio ke bina (chhota target)."} Format: .${ext}`, blob: outputBlob, base: selectedFile.name.replace(/\.[^/.]+$/, "") });
      setProgress(100); setProgressLabel("Done!"); setStatusText("Ho gaya.");
    } catch (err: any) { setError(err.message); setShowProgress(false); }
    finally { setIsCompressing(false); }
  };

  const download = () => {
    if (!result?.blob) { setError("Pehle compress karo."); return; }
    const a = document.createElement("a");
    a.href = outputURL; a.download = `NEXORA-${result.base}-compressed.${outputExtension}`;
    document.body.appendChild(a); a.click(); a.remove();
  };

  const reset = () => {
    if (isCompressing) return;
    setSelectedFile(null); setResult(null); setOutputURL(""); setError(""); setShowProgress(false);
    setTargetValue("10"); setCurrentUnit("MB"); setActiveChip("10 MB");
    if (sourceVideoRef.current) { sourceVideoRef.current.pause(); sourceVideoRef.current.removeAttribute("src"); sourceVideoRef.current.load(); }
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <div className="page">
      <header className="topbar"><div className="nav"><a href="/" className="logo">NEXORA</a><nav className="navlinks"><a href="/">Home</a><a href="/#tools">All Tools</a></nav></div></header>
      <main className="container">
        <section className="hero">
          <div className="badge">FREE • NO WATERMARK • BROWSER-BASED</div>
          <h1>Video Compressor</h1>
          <p>Compress video to 100KB, 500KB, 1MB, 10MB or 100MB. Fast, free, no watermark.</p>
        </section>

        <section className="tool-card">
          <div className="upload-label">Upload a video</div>
          <div className="upload-box" onClick={() => videoInputRef.current?.click()}>
            <div className="upload-left"><div className="upload-icon">🎬</div><div><strong>{selectedFile ? selectedFile.name : "Choose Video"}</strong><span>{selectedFile ? `Original: ${fmt(selectedFile.size)}` : "MP4, WebM, MOV • Up to 10 min"}</span></div></div>
            <button className="btn-small" type="button" onClick={(e) => { e.stopPropagation(); videoInputRef.current?.click(); }}>Choose</button>
            <input type="file" ref={videoInputRef} accept="video/*" hidden onChange={(e) => selectFile(e.target.files?.[0])} />
          </div>
          <video ref={sourceVideoRef} playsInline preload="auto" style={{ display: "none" }} />

          <div className="target-box">
            <label htmlFor="target-size">Target file size</label>
            <div className="input-row">
              <input id="target-size" type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="10" />
              <div className="unit-mini">
                <button type="button" className={currentUnit === "KB" ? "active" : ""} onClick={() => setCurrentUnit("KB")}>KB</button>
                <button type="button" className={currentUnit === "MB" ? "active" : ""} onClick={() => setCurrentUnit("MB")}>MB</button>
              </div>
            </div>
            <div className="presets">
              {chips.map((c) => (
                <button key={c.label} type="button" className={activeChip === c.label ? "preset active" : "preset"} onClick={() => { setActiveChip(c.label); setCurrentUnit(c.unit); setTargetValue(c.val); }}>{c.label}</button>
              ))}
            </div>
          </div>

          {error && <div className="error" role="alert">{error}</div>}

          <div className="actions">
            <button type="button" className="compress-btn" onClick={compress} disabled={!selectedFile || isCompressing}>{isCompressing ? "Compressing..." : "Compress Video"}</button>
            <button type="button" className="clear-btn" onClick={reset}>Clear</button>
          </div>
          {showProgress && <div className="progress"><div className="progress-top"><span>{progressLabel}</span><span>{Math.round(progress)}%</span></div><div className="bar"><i style={{ width: progress + "%" }} /></div><div className="progress-sub">{statusText}</div></div>}
          <p className="privacy-note">Your video is processed in your browser. It is not uploaded to our server.</p>

          {result && <div className="result">
            <div className="result-title">Compression Complete</div>
            <div className="size-result">{result.big}</div>
            <p className="result-message">{result.saved} smaller • Format: .{outputExtension.toUpperCase()}</p>
            <p className="result-note">{result.note}</p>
            {outputURL && <video src={outputURL} className="preview" controls playsInline muted />}
            <button type="button" className="download-btn" onClick={download}>Download Compressed Video</button>
          </div>}
        </section>

        <div className="content-gap" />

        <article className="seo-content">
          <section><h2>Free Video Compressor</h2><p>NEXORA Video Compressor helps you reduce video file size quickly without installing software. Enter your required target size, such as 100KB, 500KB, 1MB, 10MB, 20MB or 100MB, and download the compressed video.</p><p>This is useful when WhatsApp, email, Discord, an online form, or a website has a strict video-size limit.</p></section>
          <section><h2>How to Compress a Video</h2><ol><li>Choose your video file.</li><li>Enter the required target size in KB or MB.</li><li>Click <strong>Compress Video</strong>.</li><li>Preview the result and download it.</li></ol></section>
          <section><h2>Why Use NEXORA?</h2><ul><li>Free to use with no account required.</li><li>Works directly in your browser.</li><li>Custom target sizes from 100KB to 100MB.</li><li>No watermark added to the output.</li><li>Works on phones, tablets, and desktop.</li><li>Audio is preserved where possible.</li></ul></section>
          <section><h2>Video Compressor for WhatsApp & Forms</h2><p>Many platforms limit video size. Instead of manually changing resolution or repeatedly trying different settings, you can enter the required size directly and let the browser create a smaller version.</p><p><strong>Note:</strong> 100KB is a very small target. A 10-12 MB video can be made to 100KB, but for long videos quality will be very low. For best quality, use 1MB to 10MB for short videos.</p></section>
          <section><h2>Frequently Asked Questions</h2>
            <details><summary>Can I compress a video to 100KB?</summary><p>Yes. Enter 100KB as target. For short videos it works well. For long videos, resolution and quality will be reduced automatically to reach the target.</p></details>
            <details><summary>Can I compress a video to 10MB?</summary><p>Yes. Select 10MB and click Compress Video.</p></details>
            <details><summary>Will audio remain?</summary><p>Yes, audio is preserved where possible. For very small targets like under 250KB, audio may be removed to reach the size.</p></details>
            <details><summary>Which formats are supported?</summary><p>MP4, WebM, MOV and other browser-supported video formats. Output is MP4 where supported, otherwise WebM.</p></details>
            <details><summary>Is my video uploaded to a server?</summary><p>No. Compression is performed in your browser.</p></details>
            <details><summary>Does it work on mobile?</summary><p>Yes. Works on modern mobile and desktop browsers.</p></details>
          </section>
          <section className="related"><h2>Related Tools</h2><div className="related-grid"><a href="/compress-image">Image Compressor</a><a href="/passport-size-photo-maker">Passport Photo Maker</a><a href="/image-resizer">Image Resizer</a><a href="/background-remover">Background Remover</a></div></section>
        </article>
        <p className="updated">NEXORA • Free online tools • Last updated: November 27, 2026</p>
      </main>
      <footer className="footer"><strong>NEXORA</strong><div><a href="/about">About</a><a href="/privacy-policy">Privacy</a><a href="/contact">Contact</a></div><p>Free tools designed to be simple, fast, and useful.</p></footer>
      <style jsx>{`
        * { box-sizing: border-box; }
        .page { min-height: 100vh; background: #ffffff; color: #0f172a; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .topbar { position: sticky; top: 0; z-index: 20; background: rgba(255,255,255,0.96); border-bottom: 1px solid #eef2f7; backdrop-filter: blur(8px); }
        .nav { width: min(100%,1000px); margin: 0 auto; padding: 11px 18px; display: flex; align-items: center; justify-content: space-between; }
        .logo { color: #2563eb; text-decoration: none; font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
        .navlinks { display: flex; gap: 17px; }
        .navlinks a { color: #334155; text-decoration: none; font-size: 12px; font-weight: 700; }
        .container { width: min(100%,760px); margin: 0 auto; padding: 24px 16px 0; }
        .hero { text-align: center; margin-bottom: 20px; }
        .badge { display: inline-block; padding: 5px 10px; border: 1px solid #bfdbfe; border-radius: 999px; background: #eff6ff; color: #2563eb; font-size: 10px; font-weight: 800; letter-spacing: 0.3px; }
        h1 { margin: 11px 0 5px; font-size: clamp(30px,7vw,40px); line-height: 1.08; letter-spacing: -1.2px; font-weight: 900; background: linear-gradient(90deg,#2563eb,#7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { max-width: 540px; margin: 0 auto; color: #64748b; font-size: 13px; line-height: 1.5; }
        .tool-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 15px; box-shadow: 0 7px 26px rgba(15,23,42,0.05); }
        .upload-label { margin-bottom: 7px; text-align: center; font-size: 12px; font-weight: 800; }
        .upload-box { width: 100%; min-height: 56px; border: 1.5px dashed #cbd5e1; border-radius: 12px; background: #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px; }
        .upload-left { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .upload-icon { width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; display: grid; place-items: center; font-size: 16px; flex-shrink: 0; }
        .upload-left strong { display: block; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
        .upload-left span { color: #94a3b8; font-size: 10px; }
        .btn-small { border: 0; border-radius: 8px; padding: 8px 12px; background: #2563eb; color: #fff; font-size: 11px; font-weight: 800; cursor: pointer; flex-shrink: 0; }
        .target-box { margin-top: 12px; padding: 10px; border: 1px solid #eef2f7; border-radius: 11px; background: #f8fafc; }
        .target-box label { display: block; margin-bottom: 6px; font-size: 11px; font-weight: 800; }
        .input-row { display: flex; align-items: center; gap: 7px; }
        .input-row input { width: 100%; min-width: 0; padding: 9px 10px; border: 1px solid #2563eb; border-radius: 8px; outline: none; background: #fff; font-size: 13px; font-weight: 700; }
        .unit-mini { display: flex; gap: 5px; flex-shrink: 0; }
        .unit-mini button { padding: 9px 10px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 11px; font-weight: 800; cursor: pointer; }
        .unit-mini button.active { background: #2563eb; color: #fff; border-color: #2563eb; }
        .presets { display: flex; gap: 5px; overflow-x: auto; padding-top: 8px; scrollbar-width: none; }
        .presets::-webkit-scrollbar { display: none; }
        .preset { flex: 0 0 auto; padding: 5px 8px; border: 1px solid #e2e8f0; border-radius: 999px; background: #fff; color: #334155; font-size: 10px; font-weight: 800; cursor: pointer; }
        .preset.active { border-color: #f97316; background: #fff7ed; color: #ea580c; }
        .error { margin-top: 10px; padding: 9px 10px; border-radius: 9px; background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; text-align: center; font-size: 11px; }
        .actions { display: flex; gap: 8px; margin-top: 12px; }
        .compress-btn, .clear-btn, .download-btn { border: 0; border-radius: 9px; cursor: pointer; font-weight: 800; }
        .compress-btn { flex: 1; padding: 11px; background: #f97316; color: #fff; font-size: 13px; }
        .compress-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .clear-btn { padding: 11px 15px; background: #f8fafc; border: 1px solid #e2e8f0; color: #334155; font-size: 12px; }
        .privacy-note { margin: 8px 0 0; color: #94a3b8; text-align: center; font-size: 9px; }
        .progress { margin-top: 11px; }
        .progress-top { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 6px; }
        .bar { height: 8px; background: #eef1f8; border-radius: 20px; overflow: hidden; }
        .bar i { display: block; height: 100%; background: linear-gradient(90deg,#2563eb,#f97316); transition: width .2s; }
        .progress-sub { font-size: 10px; color: #64748b; margin-top: 6px; text-align: center; }
        .result { margin-top: 13px; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 12px; background: #f0fdf4; }
        .result-title { text-align: center; font-size: 13px; font-weight: 900; color: #15803d; }
        .size-result { margin-top: 4px; text-align: center; font-size: 18px; font-weight: 900; color: #2563eb; }
        .result-message { margin: 4px 0; text-align: center; color: #64748b; font-size: 10px; font-weight: 700; }
        .result-note { font-size: 11px; color: #334155; line-height: 1.6; text-align: center; }
        .preview { width: 100%; max-height: 280px; background: #000; border-radius: 11px; margin-top: 10px; }
        .download-btn { width: 100%; margin-top: 10px; padding: 11px; background: #0f172a; color: #fff; font-size: 12px; }
        .content-gap { height: 40px; }
        .seo-content { color: #334155; font-size: 12px; line-height: 1.75; }
        .seo-content section { margin-bottom: 28px; }
        .seo-content h2 { margin: 0 0 7px; color: #0f172a; font-size: 19px; line-height: 1.25; }
        .seo-content p { margin: 0 0 9px; }
        .seo-content ol, .seo-content ul { margin: 6px 0 0; padding-left: 21px; }
        .seo-content li { margin: 3px 0; }
        .seo-content details { margin-top: 7px; padding: 9px 11px; border: 1px solid #e2e8f0; border-radius: 9px; background: #fff; }
        .seo-content summary { cursor: pointer; color: #0f172a; font-size: 11px; font-weight: 800; }
        .seo-content details p { margin: 7px 0 0; color: #64748b; font-size: 11px; line-height: 1.65; }
        .related-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 7px; }
        .related-grid a { padding: 9px 10px; border: 1px solid #e2e8f0; border-radius: 9px; color: #2563eb; text-decoration: none; background: #f8fafc; font-size: 10px; font-weight: 800; }
        .updated { margin: 38px 0 15px; text-align: center; color: #94a3b8; font-size: 9px; }
        .footer { padding: 18px 15px; background: #0f172a; color: #94a3b8; text-align: center; font-size: 10px; }
        .footer strong { color: #fff; font-size: 14px; }
        .footer div { display: flex; justify-content: center; gap: 13px; margin-top: 7px; }
        .footer a { color: #cbd5e1; text-decoration: none; }
        .footer p { margin: 6px 0 0; }
        @media (max-width: 520px) { .container { padding-left: 12px; padding-right: 12px; } .tool-card { padding: 12px; } .content-gap { height: 40px; } }
      `}</style>
    </div>
  );
}
