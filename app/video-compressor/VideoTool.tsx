"use client";
import { useRef, useState, useEffect } from "react";

export default function VideoTool() {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const sourceVideoRef = useRef<HTMLVideoElement>(null);
  const outputPreviewRef = useRef<HTMLVideoElement>(null);

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
  const [outputExtension, setOutputExtension] = useState("webm");
  const [isCompressing, setIsCompressing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const fmt = (b: number) => {
    if (!b || b <= 0) return "0 KB";
    if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
    return (b / (1024 * 1024)).toFixed(2) + " MB";
  };

  const chips = [
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
    setError(""); setResult(null);
    if (!f) return;
    if (!f.type.startsWith("video/")) { setError("Video file chuno."); return; }
    if (sourceURL) URL.revokeObjectURL(sourceURL);
    const url = URL.createObjectURL(f);
    setSelectedFile(f); setSourceURL(url);
    if (sourceVideoRef.current) { sourceVideoRef.current.src = url; sourceVideoRef.current.load(); }
  };

  const getTargetBytes = () => {
    const v = Number(targetValue);
    if (!Number.isFinite(v)) throw new Error("Size likho.");
    if (currentUnit === "KB") {
      if (v < 500 || v > 102400) throw new Error("KB me 500KB se 102400KB tak likho.");
      return v * 1024;
    } else {
      if (v < 0.5 || v > 100) throw new Error("MB me 0.5MB se 100MB tak likho.");
      return v * 1024 * 1024;
    }
  };

  // Tera purana wala compress logic - same to same
  const compress = async () => {
    if (!selectedFile || isCompressing) return;
    setError(""); setResult(null);
    let targetBytes: number;
    try { targetBytes = getTargetBytes(); } catch (e: any) { setError(e.message); return; }
    const sourceVideo = sourceVideoRef.current!;
    setIsCompressing(true); setShowProgress(true);
    setProgress(2); setProgressLabel("Preparing..."); setStatusText("Video load ho rahi hai.");

    let audioContext: any = null, audioSourceNode: any = null, audioDestination: any = null;
    try {
      await new Promise<void>((res, rej) => {
        if (sourceVideo.readyState >= 1) res();
        else sourceVideo.addEventListener("loadedmetadata", () => res(), { once: true });
        setTimeout(() => rej(new Error("Load timeout")), 20000);
      });
      const dur = sourceVideo.duration;
      if (!dur || dur <= 0) throw new Error("Duration nahi mili.");
      if (dur > 600) throw new Error("10 minute se choti video use karo.");
      const maxW = 1280;
      let w = sourceVideo.videoWidth, h = sourceVideo.videoHeight;
      if (w > maxW) { const r = maxW / w; w = Math.floor(w * r / 2) * 2; h = Math.floor(h * r / 2) * 2; }
      const totalBits = (targetBytes * 8 / dur) * 0.88;
      let videoBitrate = Math.max(100000, Math.floor(Math.floor(totalBits - 128000) * 0.85));
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      const canvasStream: any = (canvas as any).captureStream(30);
      // Audio
      let audioTracks: any[] = [];
      try {
        const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
        audioContext = new AC();
        if (audioContext.state === "suspended") await audioContext.resume();
        audioSourceNode = audioContext.createMediaElementSource(sourceVideo);
        audioDestination = audioContext.createMediaStreamDestination();
        const gain = audioContext.createGain(); gain.gain.value = 1;
        const silent = audioContext.createGain(); silent.gain.value = 0;
        audioSourceNode.connect(gain); gain.connect(audioDestination);
        audioSourceNode.connect(silent); silent.connect(audioContext.destination);
        audioTracks = audioDestination.stream.getAudioTracks();
      } catch { audioTracks = []; }

      const combined = new MediaStream();
      canvasStream.getVideoTracks().forEach((t: any) => combined.addTrack(t));
      audioTracks.forEach((t: any) => combined.addTrack(t));
      const mime = "video/webm;codecs=vp9,opus";
      const recorder = new MediaRecorder(combined, { mimeType: (MediaRecorder as any).isTypeSupported(mime) ? mime : "video/webm", videoBitsPerSecond: videoBitrate, audioBitsPerSecond: 128000 } as any);
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
          if (now - last >= 1000 / 30) { ctx.drawImage(sourceVideo, 0, 0, w, h); last = now; }
          setProgress(Math.min(94, (sourceVideo.currentTime / dur) * 94));
          setProgressLabel("Compressing..."); setStatusText(`⚡ 100x Fast - ${Math.floor(sourceVideo.currentTime)} / ${Math.ceil(dur)} sec`);
          raf = requestAnimationFrame(draw);
        };
        sourceVideo.onended = finish;
        sourceVideo.play().then(() => { raf = requestAnimationFrame(draw); }).catch(() => reject(new Error("Play nahi hui")));
      });
      sourceVideo.pause();
      setProgress(96); setProgressLabel("Finishing..."); setStatusText("Saving...");
      if (recorder.state !== "inactive") recorder.stop();
      await done;
      const outputBlob = new Blob(chunks, { type: "video/webm" });
      if (!outputBlob.size) throw new Error("Empty file bana.");
      const outUrl = URL.createObjectURL(outputBlob);
      setOutputURL(outUrl); setOutputExtension("webm");
      if (outputPreviewRef.current) { outputPreviewRef.current.src = outUrl; outputPreviewRef.current.style.display = "block"; }
      const orig = selectedFile.size, nowB = outputBlob.size, diff = orig - nowB;
      setResult({ orig: fmt(orig), now: fmt(nowB), saved: diff > 0 ? ((diff / orig) * 100).toFixed(1) + "% kam" : "-", big: `${fmt(orig)} → ${fmt(nowB)}`, note: `Target tha: ${fmt(targetBytes)}. ${nowB <= targetBytes ? "Target ke andar hai." : "Thoda bada hai, dobara try karo."} ${audioTracks.length ? "Audio ke saath." : ""}`, blob: outputBlob, base: selectedFile.name.replace(/\.[^/.]+$/, "") });
      setProgress(100); setProgressLabel("Done!"); setStatusText("Ho gaya.");
    } catch (err: any) { setError(err.message); setShowProgress(false); }
    finally { setIsCompressing(false); }
  };

  const download = () => {
    if (!result?.blob) { setError("Pehle compress karo."); return; }
    const a = document.createElement("a");
    a.href = outputURL; a.download = result.base + "-compressed." + outputExtension;
    document.body.appendChild(a); a.click(); a.remove();
  };

  const reset = () => {
    if (isCompressing) return;
    setSelectedFile(null); setResult(null); setOutputURL(""); setError(""); setShowProgress(false);
    setTargetValue("10"); setCurrentUnit("MB"); setActiveChip("10 MB");
    if (sourceVideoRef.current) { sourceVideoRef.current.pause(); sourceVideoRef.current.removeAttribute("src"); sourceVideoRef.current.load(); }
    if (outputPreviewRef.current) { outputPreviewRef.current.pause(); outputPreviewRef.current.removeAttribute("src"); outputPreviewRef.current.style.display = "none"; }
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <>
      <style>{`
        *{box-sizing:border-box} body{margin:0;background:#f8faff;color:#17203a;font-family:'Inter',Arial,sans-serif}
        .navbar{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 6%;background:#fff;border-bottom:1px solid #e9edf7;position:sticky;top:0;z-index:10}
        .logo{font-family:'Poppins',sans-serif;font-size:22px;font-weight:800;color:#1e5bff}
        .hero{max-width:820px;margin:18px auto 10px;padding:0 16px;text-align:center}
        .badge{display:inline-block;padding:5px 11px;border-radius:30px;background:#e8efff;color:#1e5bff;font-size:11px;font-weight:800}
        h1{font-family:'Poppins',sans-serif;font-size:clamp(26px,5vw,38px);line-height:1.15;margin:10px 0 6px;color:#1e5bff}
        .hero p{color:#5b657f;line-height:1.6;font-size:13px;max-width:620px;margin:auto}
        .main{width:min(820px,calc(100% - 28px));margin:14px auto 30px}
        .card{background:#fff;border:1px solid #e9edf7;border-radius:16px;padding:15px;box-shadow:0 10px 30px rgba(30,91,255,.06);margin-bottom:14px}
        .upload-box{border:2px dashed #b9c7ff;border-radius:12px;background:#f0f4ff;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:50px;cursor:pointer}
        .btn{border:0;border-radius:9px;padding:9px 13px;background:#ff7a00;color:#fff;font-weight:800;cursor:pointer;white-space:nowrap;font-size:13px}
        .btn:disabled{opacity:.45;cursor:not-allowed}
        .btn-big{width:100%;padding:12px;font-size:15px;margin-top:11px}
        .btn-secondary{background:#eef1f8;color:#17203a;border:1px solid #e5e8f5}
        .scroll-title{font-size:13px;font-weight:800;margin:13px 0 7px}
        .scroll-row{display:flex;gap:7px;overflow-x:auto;padding-bottom:6px;white-space:nowrap}
        .chip{flex:0 0 auto;padding:8px 13px;border-radius:20px;border:1.5px solid #dde3f5;background:#fff;font-size:12px;font-weight:700;cursor:pointer}
        .chip.active{background:#1e5bff;color:#fff;border-color:#1e5bff}
        .write-box{margin-top:11px}.write-box label{font-size:13px;font-weight:800;display:block;margin-bottom:7px}
        .write-row{display:flex;gap:6px;width:100%;align-items:stretch}
        .write-row input{flex:1;min-width:0;border:2px solid #1e5bff;border-radius:10px;padding:11px 10px;font-size:16px;font-weight:800;text-align:center;outline:none}
        .unit-mini{display:flex;gap:6px}.unit-mini button{width:48px;border-radius:10px;border:1.5px solid #dde3f5;background:#fff;font-weight:800;cursor:pointer;font-size:12px}
        .unit-mini button.active{background:#1e5bff;color:#fff;border-color:#1e5bff}
        .file-info{margin-top:9px;padding:9px;border-radius:10px;background:#f6f8ff;font-size:13px}
        .progress{margin-top:11px}.bar{height:9px;background:#eef1f8;border-radius:20px;overflow:hidden}.bar i{display:block;height:100%;width:0%;background:linear-gradient(90deg,#1e5bff,#ff7a00);transition:width .2s}
        .error{margin-top:9px;padding:9px;border-radius:10px;background:#fff1f1;color:#c81e1e;font-size:13px}
        .result{margin-top:13px;border:1.5px solid #b9eecb;border-radius:13px;padding:12px;background:#f0fff4}
        .big-preview{font-size:16px;font-weight:800;text-align:center;background:#fff;border-radius:9px;padding:10px;margin:8px 0}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;text-align:center}.stats div{background:#fff;border:1px solid #e5e8f5;border-radius:9px;padding:9px 5px}.stats strong{display:block;font-size:14px}.stats small{color:#6b7690;font-size:11px}
        .preview{width:100%;max-height:280px;background:#000;border-radius:11px;margin-top:10px;display:none}
        .big-gap{height:90px}.green-note{margin-top:0;background:#e9fff1;border:1px solid #1ed06a;border-radius:9px;padding:8px 10px;text-align:center;font-size:12px}.green-note a{color:#0a9e4a;font-weight:800;text-decoration:underline}
        .loop{margin-top:12px;background:linear-gradient(90deg,#1e5bff,#7a3cff);color:#fff;border-radius:12px;padding:11px;text-align:center}.loop marquee{font-weight:800;font-size:12px}
        .seo-details{margin-top:18px;border:1px solid #e9edf7;border-radius:12px;background:#fff;overflow:hidden}.seo-details summary{padding:12px 14px;font-size:13px;font-weight:800;color:#1e5bff;cursor:pointer;list-style:none}
        .seo-inner{padding:0 14px 14px;font-size:13px;line-height:1.8;color:#4b5568}.seo-inner h3{color:#17203a;font-size:14px;margin:14px 0 6px}
        footer{text-align:center;color:#8793ad;border-top:1px solid #e9edf7;padding:16px 14px;font-size:11px;background:#fff;line-height:1.7} footer a{color:#1e5bff}
      `}</style>

      <header className="navbar"><a className="logo" href="/">NEXORA</a><a href="/">← All Tools</a></header>
      <section className="hero">
        <span className="badge">⚡ 100x FAST • FREE • NO WATERMARK</span>
        <h1>Video Compressor to 500KB - 100MB</h1>
        <p>Video ko 500KB, 1MB, 5MB, 10MB, 100MB tak chota karo. Free, fast, no watermark.</p>
      </section>

      <main className="main">
        <section className="card">
          <div className="upload-box" onClick={() => videoInputRef.current?.click()}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ fontSize: 21 }}>🎬</div><div><h2 style={{ fontSize: 14, margin: 0 }}>Video Yaha Dalein</h2><p style={{ fontSize: 11, color: "#6b7690", margin: "1px 0 0" }}>Tap karo ya drag karo</p></div></div>
            <button className="btn" type="button" onClick={(e) => { e.stopPropagation(); videoInputRef.current?.click(); }}>Choose Video</button>
            <input type="file" ref={videoInputRef} accept="video/*" hidden onChange={(e) => selectFile(e.target.files?.[0])} />
          </div>
          <video ref={sourceVideoRef} playsInline preload="auto" style={{ display: "none" }} />
          {selectedFile && <div className="file-info"><b>{selectedFile.name}</b><div>Original: {fmt(selectedFile.size)} • {selectedFile.type || "Video"}</div></div>}

          <div className="scroll-title">👇 Size Chuno</div>
          <div className="scroll-row">
            {chips.map((c) => (
              <button key={c.label} className={`chip ${activeChip === c.label ? "active" : ""}`} onClick={() => { setActiveChip(c.label); setCurrentUnit(c.unit); setTargetValue(c.val); }}>{c.label}</button>
            ))}
          </div>

          <div className="write-box">
            <label>✍️ Yaha Likho Kitne KB / MB Ki Video Chahiye</label>
            <div className="write-row">
              <input type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="10" />
              <div className="unit-mini">
                <button type="button" className={currentUnit === "KB" ? "active" : ""} onClick={() => setCurrentUnit("KB")}>KB</button>
                <button type="button" className={currentUnit === "MB" ? "active" : ""} onClick={() => setCurrentUnit("MB")}>MB</button>
              </div>
            </div>
          </div>

          <button className="btn btn-big" onClick={compress} disabled={!selectedFile || isCompressing}>⚡ GENERATE - Compress Video</button>
          <button className="btn btn-big btn-secondary" onClick={reset} type="button" style={{ marginTop: 8 }}>Reset</button>
          {error && <div className="error" style={{ display: "block" }}>{error}</div>}
          {showProgress && <div className="progress"><div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7, fontWeight: 700 }}><span>{progressLabel}</span><span>{Math.round(progress)}%</span></div><div className="bar"><i style={{ width: progress + "%" }} /></div><div style={{ fontSize: 12, color: "#6b7690", marginTop: 7 }}>{statusText}</div></div>}
          {result && <div className="result" style={{ display: "block" }}>
            <h3 style={{ margin: "0 0 8px", color: "#0a9e4a", fontSize: 15 }}>✅ Ho Gaya! Preview Dekho</h3>
            <div className="big-preview">{result.big}</div>
            <div className="stats"><div><strong>{result.orig}</strong><small>Original</small></div><div><strong>{result.now}</strong><small>New Size</small></div><div><strong>{result.saved}</strong><small>Kitna Kam Hua</small></div></div>
            <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.6, marginTop: 8 }}>{result.note}</p>
            <video ref={outputPreviewRef} className="preview" controls playsInline />
            <button className="btn btn-big" onClick={download} style={{ marginTop: 12 }}>⬇️ Download Compressed Video</button>
          </div>}
        </section>

        <div className="big-gap"></div>
        <div className="green-note">Photo Compressor Karna Hai To Yaha Kare - <a href="/compress-image">Photo Compressor</a></div>
        <div className="loop"><div style={{fontWeight:800, fontSize:12, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>🔥 NEXORA - Free Tools • Video Compressor • Photo Compressor • PDF Compressor • 100% Free • No Watermark 🔥</div></div>

        <details className="seo-details">
          <summary>▼ Video Compressor Ke Baare Me Aur Jano - Click Karo</summary>
          <div className="seo-inner">
            <h3>Video Compressor Online Free - 500KB Se 100MB Tak</h3>
            <p>NEXORA Video Compressor duniya ka sabse fast video compressor online free hai. Agar aapko compress video to 500KB, compress video to 1MB, compress video to 5MB, compress video to 10MB, compress video to 20MB, compress video to 100MB karna hai, to ye tool aapke liye hai. Ye ek MP4 video compressor, WhatsApp video compressor, video size reducer hai jo bina watermark ke kaam karta hai.</p>
            <h3>Kaise Compress Kare?</h3>
            <ul><li>Step 1: Video dalo.</li><li>Step 2: Size chuno ya likho - jaise 500KB ya 10MB.</li><li>Step 3: GENERATE dabao, Preview dekho - Itne se itna hua, fir Download karo.</li></ul>
            <h3>Kis Kaam Aayega?</h3>
            <ul><li>WhatsApp Video Compressor: 16MB se badi video ko 10MB karo.</li><li>Form: 10MB wali video ko 9MB karo.</li><li>Email: 25MB wali video ko 5MB karo.</li><li>Discord: 8MB wali video banao.</li></ul>
            <h3>100x Fast Kyu Hai?</h3>
            <p>Video server pe upload nahi hoti. Sab kuch browser me hota hai. Isliye 100x fast hai.</p>
            <h3>FAQ</h3>
            <p><b>1. Video compressor to 10MB kaise kare?</b> Video dalo, 10MB chuno, GENERATE dabao.<br /><b>2. Kya ye free hai?</b> Haan, 100% free, no watermark.<br /><b>3. Kya audio rahega?</b> Haan, awaz ke saath.<br /><b>4. WhatsApp ke liye kitna size?</b> 10MB ya 16MB.</p>
          </div>
        </details>
      </main>
      <footer><div>© {new Date().getFullYear()} NEXORA. Free online tools for everyone.</div><div><a href="/">Home</a> · <a href="/compress-image">Photo Compressor</a> · <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/privacy">Privacy Policy</a></div></footer>

      {/* Google Schema - Same to Same */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "NEXORA Video Compressor", applicationCategory: "MultimediaApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free video compressor to 500KB, 1MB, 5MB, 10MB, 20MB, 100MB. MP4, WhatsApp, Discord compressor, 100x fast, no watermark." }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "How to compress video to 10MB?", acceptedAnswer: { "@type": "Answer", text: "Upload video, select 10MB, click Generate. Tool makes 10MB to 9MB." } }, { "@type": "Question", name: "Is video compressor free?", acceptedAnswer: { "@type": "Answer", text: "Yes 100% free, no watermark, no signup." } }] }) }} />
    </>
  );
}
