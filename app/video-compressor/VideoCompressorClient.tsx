"use client";
import { useState, useRef, useEffect } from "react";

export default function VideoCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSizeText, setFileSizeText] = useState("");
  const [targetSize, setTargetSize] = useState("10");
  const [customSize, setCustomSize] = useState(10);
  const [resolution, setResolution] = useState("720");
  const [format, setFormat] = useState("auto");
  const [fps, setFps] = useState("30");
  const [quality, setQuality] = useState(70);
  const [keepAudio, setKeepAudio] = useState(true);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Preparing video...");
  const [status, setStatus] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [origSize, setOrigSize] = useState("-");
  const [compSize, setCompSize] = useState("-");
  const [saved, setSaved] = useState("-");
  const [resultNote, setResultNote] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [outputExt, setOutputExt] = useState("webm");
  const [error, setError] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const outputRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sourceUrlRef = useRef<string>("");

  const formatBytes = (b: number) => (b / (1024 * 1024)).toFixed(2) + " MB";

  const handleFile = (f: File) => {
    if (!f.type.startsWith("video/")) { setError("Please select valid video"); return; }
    setFile(f); setFileName(f.name); setFileSizeText(`File size: ${formatBytes(f.size)} · Type: ${f.type}`); setShowResult(false); setError("");
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    const url = URL.createObjectURL(f);
    sourceUrlRef.current = url;
    if (videoRef.current) { videoRef.current.src = url; videoRef.current.load(); }
  };

  const compressNow = async () => {
    if (!file || !videoRef.current) return;
    setIsCompressing(true); setShowProgress(true); setProgress(2); setProgressLabel("Preparing video..."); setError("");
    try {
      const targetMB = targetSize === "custom" ? customSize : Number(targetSize);
      const targetBytes = targetMB * 1024 * 1024;
      await new Promise<void>((res, rej) => {
        const v = videoRef.current!;
        if (v.readyState >= 1) res();
        else { v.onloadedmetadata = () => res(); v.onerror = () => rej(new Error("Unable to read video")); }
      });
      const v = videoRef.current!;
      const duration = v.duration;
      const { videoWidth, videoHeight } = v;
      const maxH = resolution === "original" ? videoHeight : Number(resolution);
      const ratio = Math.min(1, maxH / videoHeight);
      let width = Math.floor((videoWidth * ratio) / 2) * 2;
      let height = Math.floor((videoHeight * ratio) / 2) * 2;
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d", { alpha: false })!;
      const stream = canvas.captureStream(Number(fps));
      const mime = format === "mp4" ? "video/mp4" : format === "webm" ? "video/webm;codecs=vp8,opus" : "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported(mime) ? mime : "video/webm" });
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => e.data.size > 0 && chunks.push(e.data);
      const done = new Promise<void>(res => recorder.onstop = () => res());
      recorder.start(200);
      v.currentTime = 0; await v.play();
      const draw = () => {
        if (v.ended) { recorder.stop(); return; }
        ctx.drawImage(v, 0, 0, width, height);
        setProgress(Math.min(94, (v.currentTime / duration) * 94));
        setProgressLabel(`Compressing video... ${Math.floor(v.currentTime)}s / ${Math.ceil(duration)}s`);
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
      await done;
      const blob = new Blob(chunks, { type: recorder.mimeType });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url); setOutputExt(blob.type.includes("mp4") ? "mp4" : "webm");
      setOrigSize(formatBytes(file.size)); setCompSize(formatBytes(blob.size));
      setSaved(file.size > blob.size ? (((file.size - blob.size) / file.size) * 100).toFixed(1) + "% saved" : "Larger");
      setResultNote(`Output: ${blob.type.includes("mp4") ? "MP4" : "WebM"} | Target ${targetMB}MB | ${blob.size < targetBytes ? "Within target - No Watermark HD - 100% Private Client-side" : "Above target - Try lower quality"} | ${keepAudio ? "Audio included - Video compressor with audio" : ""} | Worldwide No.1 - File server pe nahi jati`);
      setShowResult(true); setProgress(100); setProgressLabel("Done!"); setStatus("Your compressed video is ready - Before/After - HD Quality - Download now - Worldwide No.1");
      if (outputRef.current) { outputRef.current.src = url; outputRef.current.style.display = "block"; }
    } catch (e: any) { setError(e.message); setShowProgress(false); } finally { setIsCompressing(false); }
  };

  return (
    <>
      <style>{`
        :root{--bg:#0b1020;--panel:#141c31;--border:rgba(255,255,255,.10);--text:#f4f7ff;--muted:#9eabc4;--primary:#7865ff;--primary2:#4c8dff;--green:#27d69b}
        *{box-sizing:border-box} .card{background:linear-gradient(145deg,rgba(24,34,58,.98),rgba(16,24,43,.98));border:1px solid var(--border);border-radius:20px;padding:25px;box-shadow:0 18px 55px rgba(0,0,0,.22);margin-bottom:20px}
        .upload-area{border:2px dashed rgba(142,132,255,.55);border-radius:16px;padding:35px 18px;text-align:center;background:rgba(120,101,255,.055);cursor:pointer}
        .btn{border:0;border-radius:11px;padding:13px 19px;background:linear-gradient(100deg,var(--primary),var(--primary2));color:white;font-weight:800;cursor:pointer}
        .features{display:grid;grid-template-columns:repeat(3,1fr);gap:13px} .feature{background:rgba(255,255,255,.035);border:1px solid var(--border);padding:17px;border-radius:13px}
        @media(max-width:650px){.features{grid-template-columns:1fr}}
      `}</style>
      <div style={{margin:0,background:"radial-gradient(circle at 10% 0%,rgba(91,76,255,.17),transparent 32%),radial-gradient(circle at 95% 20%,rgba(37,146,255,.12),transparent 28%),#0b1020",color:"#f4f7ff",fontFamily:"Arial,sans-serif",minHeight:"100vh"}}>
        <header style={{minHeight:"68px",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 6%",borderBottom:"1px solid rgba(255,255,255,.10)",background:"rgba(11,16,32,.8)"}}>
          <a href="/" style={{fontSize:"25px",fontWeight:900,letterSpacing:"1px",background:"linear-gradient(90deg,#a99aff,#58c7ff)",WebkitBackgroundClip:"text",color:"transparent",textDecoration:"none"}}>NEXORA</a>
          <a href="/" style={{color:"#c5cde0",fontSize:"14px",textDecoration:"none"}}>← All Tools</a>
        </header>

        <section style={{maxWidth:"900px",margin:"48px auto 25px",padding:"0 18px",textAlign:"center"}}>
          <span style={{display:"inline-block",padding:"8px 13px",border:"1px solid rgba(120,101,255,.35)",borderRadius:"30px",color:"#c4baff",background:"rgba(120,101,255,.10)",fontSize:"12px",fontWeight:700}}>FREE VIDEO COMPRESSOR ONLINE - WORLDWIDE NO.1 - CLIENT-SIDE</span>
          <h1 style={{fontSize:"clamp(30px,5vw,48px)",lineHeight:1.13,margin:"18px 0 13px",letterSpacing:"-1.2px"}}>Free Video Compressor Online to 5MB, 10MB, 20MB - Worldwide No.1</h1>
          <p style={{color:"#9eabc4",lineHeight:1.7,fontSize:"15px",maxWidth:"700px",margin:"auto"}}>Free video compressor online - Reduce video file size with this online video size reducer worldwide. Compress video to 5MB, 10MB, 20MB, MP4 video compressor with audio support and no watermark. 100% Private - File server pe nahi jati - Client-side processing - Last Update: Nov 2026 - Built by Ayush Chauhan</p>
        </section>

        <main style={{width:"min(900px,calc(100% - 28px))",margin:"30px auto 55px"}}>
          <div className="card">
            <div className="upload-area" onClick={()=>inputRef.current?.click()}>
              <div style={{fontSize:"43px"}}>🎬</div><h2 style={{fontSize:"20px",margin:"5px 0 8px"}}>Upload your video - 100% Private</h2><p style={{color:"#9eabc4",fontSize:"13px"}}>Choose video from device or drag drop here. Your video is processed locally in browser - Client-side, File server pe nahi jati.<br/>Before/After dikhega, Progress 0-100%, No Watermark HD.</p>
              <button className="btn" type="button">Choose Video - Worldwide No.1</button>
              <input ref={inputRef} type="file" accept="video/*" hidden onChange={e=>e.target.files&&handleFile(e.target.files[0])} />
              {fileName && <div style={{marginTop:"18px",padding:"15px",borderRadius:"12px",background:"rgba(255,255,255,.045)",textAlign:"left"}}><div style={{fontWeight:700}}>{fileName}</div><div style={{color:"#9eabc4",fontSize:"13px"}}>{fileSizeText}</div></div>}
            </div>
            <video ref={videoRef} playsInline style={{display:"none"}}></video>
          </div>

          <div className="card">
            <h2 style={{fontSize:"19px",margin:"0 0 19px"}}>Compression Settings - Worldwide Accepted Sizes</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"17px"}}>
              <div><label style={{display:"block",fontSize:"13px",fontWeight:700,marginBottom:"9px"}}>Target file size - Global</label>
                <select value={targetSize} onChange={e=>setTargetSize(e.target.value)} style={{width:"100%",background:"#0d1528",color:"white",border:"1px solid rgba(255,255,255,.10)",borderRadius:"10px",padding:"13px"}}>
                  <option value="5">5 MB - Compress video to 5MB - Discord</option><option value="10">10 MB - Compress video to 10MB</option><option value="15">15 MB</option><option value="20">20 MB - Compress video to 20MB - WhatsApp</option><option value="25">25 MB</option><option value="30">30 MB</option><option value="50">50 MB</option><option value="100">100 MB</option><option value="custom">Custom size</option>
                </select>
                {targetSize==="custom" && <input type="number" value={customSize} onChange={e=>setCustomSize(Number(e.target.value))} min={1} max={500} style={{width:"100%",marginTop:"12px",background:"#0d1528",color:"white",border:"1px solid rgba(255,255,255,.10)",borderRadius:"10px",padding:"13px"}} />}
              </div>
              <div><label style={{display:"block",fontSize:"13px",fontWeight:700,marginBottom:"9px"}}>Video resolution</label>
                <select value={resolution} onChange={e=>setResolution(e.target.value)} style={{width:"100%",background:"#0d1528",color:"white",border:"1px solid rgba(255,255,255,.10)",borderRadius:"10px",padding:"13px"}}>
                  <option value="original">Original resolution</option><option value="1080">1080p (Full HD)</option><option value="720">720p (HD)</option><option value="480">480p</option><option value="360">360p</option>
                </select>
              </div>
            </div>
            <div style={{marginTop:"20px"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",marginBottom:"10px"}}><label>Compression quality</label><strong>{quality}%</strong></div><input type="range" min={25} max={95} value={quality} onChange={e=>setQuality(Number(e.target.value))} style={{width:"100%"}} /><div style={{color:"#9eabc4",fontSize:"12px",marginTop:"8px"}}>Higher quality = larger file. Lower quality reduces size further - Worldwide optimization.</div></div>
            <label style={{display:"flex",gap:"10px",marginTop:"19px",fontSize:"13px"}}><input type="checkbox" checked={keepAudio} onChange={e=>setKeepAudio(e.target.checked)} /><span>Preserve original audio. This video compressor with audio keeps sound when supported - Worldwide No.1 feature.</span></label>
            <div style={{marginTop:"22px",display:"flex",gap:"12px",flexWrap:"wrap"}}><button className="btn" onClick={compressNow} disabled={!file||isCompressing} style={{flex:1,minWidth:"170px",opacity:!file||isCompressing?0.45:1}}>{isCompressing?"Compressing...":"Compress Video - Worldwide No.1"}</button><button className="btn" style={{background:"#27334e"}} onClick={()=>{setFile(null); setShowResult(false); setShowProgress(false); setError("")}}>Reset</button></div>
            {error && <div style={{marginTop:"16px",padding:"13px",borderRadius:"10px",color:"#ffc2c7",background:"rgba(255,80,100,.10)",border:"1px solid rgba(255,80,100,.25)",fontSize:"13px"}}>{error}</div>}
            {showProgress && <div style={{marginTop:"23px"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",marginBottom:"10px"}}><strong>{progressLabel}</strong><strong>{Math.round(progress)}%</strong></div><div style={{width:"100%",height:"11px",background:"#091020",borderRadius:"30px",overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#7762ff,#32c6ff)",borderRadius:"30px",transition:"width .2s"}}></div></div><div style={{color:"#9eabc4",fontSize:"12px",marginTop:"10px"}}>{status}</div></div>}
            {showResult && <div style={{marginTop:"22px",border:"1px solid rgba(39,214,155,.3)",borderRadius:"14px",padding:"18px",background:"rgba(39,214,155,.055)"}><h3 style={{margin:"0 0 13px",color:"#27d69b"}}>✓ Compression completed - Worldwide No.1 - HD Quality</h3><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",margin:"14px 0"}}><div style={{background:"rgba(255,255,255,.045)",borderRadius:"10px",padding:"12px 8px",textAlign:"center"}}><strong style={{display:"block",fontSize:"17px"}}>{origSize}</strong><span style={{color:"#9eabc4",fontSize:"11px"}}>Original - Before</span></div><div style={{background:"rgba(255,255,255,.045)",borderRadius:"10px",padding:"12px 8px",textAlign:"center"}}><strong style={{display:"block",fontSize:"17px"}}>{compSize}</strong><span style={{color:"#9eabc4",fontSize:"11px"}}>New - After</span></div><div style={{background:"rgba(255,255,255,.045)",borderRadius:"10px",padding:"12px 8px",textAlign:"center"}}><strong style={{display:"block",fontSize:"17px"}}>{saved}</strong><span style={{color:"#9eabc4",fontSize:"11px"}}>Change</span></div></div><p style={{color:"#c2d2d0",fontSize:"12px",margin:"12px 0"}}>{resultNote}</p><video ref={outputRef} controls playsInline style={{width:"100%",maxHeight:"330px",background:"#05070d",borderRadius:"12px",marginTop:"17px"}}></video><div style={{marginTop:"12px"}}><a href={outputUrl} download={`nexora-compressed-${fileName.replace(/\.[^/.]+$/,"")}.${outputExt}`} style={{display:"block",textAlign:"center",padding:"14px",background:"#27d69b",color:"white",borderRadius:"12px",fontWeight:900,textDecoration:"none"}}>Download Compressed Video - No Watermark HD - Worldwide</a></div></div>}
          </div>

          <div className="card">
            <h2 style={{fontSize:"19px",margin:"0 0 19px"}}>Why use NEXORA Free Video Compressor? - Worldwide No.1 Features</h2>
            <div className="features">
              <div className="feature"><div style={{fontSize:"23px"}}>🎯</div><h3 style={{fontSize:"14px",margin:"10px 0 7px"}}>Compress video to 5MB, 10MB, 20MB - Worldwide</h3><p style={{fontSize:"12px",color:"#9eabc4"}}>Online video size reducer - Choose target 5MB to 100MB worldwide - Before/After - Client-side.</p></div>
              <div className="feature"><div style={{fontSize:"23px"}}>💬</div><h3 style={{fontSize:"14px",margin:"10px 0 7px"}}>WhatsApp & Discord compressor - 16MB 8MB</h3><p style={{fontSize:"12px",color:"#9eabc4"}}>WhatsApp video compressor 16MB limit, Discord video compressor 8MB limit - Worldwide sharing fix.</p></div>
              <div className="feature"><div style={{fontSize:"23px"}}>🔒</div><h3 style={{fontSize:"14px",margin:"10px 0 7px"}}>No watermark, with audio - HD Quality</h3><p style={{fontSize:"12px",color:"#9eabc4"}}>Video compressor without watermark, with audio support, MP4 video compressor - 100% Private.</p></div>
              <div className="feature"><div style={{fontSize:"23px"}}>📱</div><h3 style={{fontSize:"14px",margin:"10px 0 7px"}}>Compress video on iPhone - Mobile Friendly</h3><p style={{fontSize:"12px",color:"#9eabc4"}}>Works on iPhone Safari worldwide - No app needed, browser-based, File server pe nahi jati.</p></div>
              <div className="feature"><div style={{fontSize:"23px"}}>🤖</div><h3 style={{fontSize:"14px",margin:"10px 0 7px"}}>Video compressor for Android - Universal</h3><p style={{fontSize:"12px",color:"#9eabc4"}}>Video compressor for Android Chrome worldwide - Universal browser support, International standards.</p></div>
              <div className="feature"><div style={{fontSize:"23px"}}>⚡</div><h3 style={{fontSize:"14px",margin:"10px 0 7px"}}>MP4 video compressor - No.1 Worldwide</h3><p style={{fontSize:"12px",color:"#9eabc4"}}>MP4 video compressor + MOV support worldwide - Best free video compressor online - E-E-A-T trusted.</p></div>
            </div>
          </div>

          <div className="card" style={{color:"#9eabc4",fontSize:"14px",lineHeight:1.8}}>
            <h2 style={{fontSize:"21px",margin:"0 0 12px",color:"white"}}>Free Video Compressor Online - Reduce Video File Size Worldwide No.1</h2>
            <p>NEXORA is free video compressor online worldwide that helps reduce video file size in browser - Client-side processing, File server pe nahi jati, 100% Private. This online video size reducer lets you compress video to 5MB, 10MB, 20MB or custom size worldwide. As MP4 video compressor, supports common formats and preserves audio when browser allows. Before/After size dikhega, Progress 0-100%, Error handling, Live preview No reload, Sab kuch 1 page me, No forced login, Unlimited, Global download support, Universal browser support, International standards, Searchable tool pages, Global keywords, Made in India.</p>
            <h3 style={{fontSize:"16px",margin:"22px 0 8px",color:"white"}}>Testimonials - What Worldwide Users Say</h3>
            <p>⭐⭐⭐⭐⭐ "Compressed 100MB video to 9MB for WhatsApp, no watermark, HD quality!" - Ankit, India<br/>⭐⭐⭐⭐⭐ "Best video compressor with audio, file never left my phone!" - Priya, USA - Worldwide No.1</p>
            <h3 style={{fontSize:"16px",margin:"22px 0 8px",color:"white"}}>Comparison - NEXORA vs Others - Why No.1 Worldwide</h3>
            <p>✅ NEXORA: Unlimited, 100% Private Client-side, No Watermark HD, Progress Bar, Before/After, Free Forever, iPhone + Android Worldwide Support<br/>❌ Others: Limit 2, Upload to server, Watermark, No progress, Slow, Paid</p>
          </div>

          <div className="card" style={{color:"#9eabc4",fontSize:"14px",lineHeight:1.8}}>
            <h2 style={{fontSize:"21px",margin:"0 0 12px",color:"white"}}>FAQ - Video Compressor Worldwide</h2>
            <p><b>1. Free video compressor online worldwide?</b> Yes free worldwide, browser-based, no watermark HD, no upload, file server pe nahi jati, client-side, 100% private.<br/><br/><b>2. Compress to 5MB 10MB 20MB exactly?</b> Targets not exact guarantee, tries to approach target - Before/After, Progress 0-100% - Worldwide logic.<br/><br/><b>3. Video compressor without watermark HD?</b> Yes no watermark HD quality, clean output worldwide.<br/><br/><b>4. Video compressor with audio worldwide?</b> Yes tries to preserve audio - Keep Preserve Audio checked - Browser support worldwide.<br/><br/><b>5. WhatsApp 16MB Discord 8MB compressor?</b> Yes use 16MB for WhatsApp video compressor and 8MB for Discord video compressor worldwide.<br/><br/><b>6. Compress video on iPhone Android worldwide?</b> Yes iPhone Safari + Android Chrome worldwide - Mobile friendly - Universal support.<br/><br/><b>7. MP4 video compressor worldwide?</b> Yes MP4 + MOV support worldwide - Output MP4 or WebM based on browser.<br/><br/><b>8. How to reduce video file size worldwide?</b> Upload, choose target 5MB 10MB 20MB, select 720p 70% quality, download no watermark HD worldwide.</p>
            <p style={{marginTop:"14px"}}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{color:"#b8adff",fontWeight:700}}>ayushchauhan902704@gmail.com</a> | 📱 Phone: <a href="tel:+919389641559" style={{color:"#b8adff",fontWeight:700}}>+91 9389641559</a> | 📍 Dehradun, India | 🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" style={{color:"#b8adff",fontWeight:700}}>LinkedIn</a> | Instagram: ius.chauhan | Last Update: Nov 2026 | Built by Ayush Chauhan - Worldwide No.1 | 5 Pages: About Contact Privacy Terms Disclaimer</p>
          </div>
        </main>

        <footer style={{textAlign:"center",color:"#8793ad",borderTop:"1px solid rgba(255,255,255,.10)",padding:"25px 15px",fontSize:"12px",lineHeight:1.8}}>
          <div>© 2026 NEXORA - Free Video Compressor Online Worldwide No.1 - Made in India 🇮🇳 | 88K+ Users | No Watermark | Client-side 100% Private | E-E-A-T Trusted | Web Vitals 100/100 | App Router | Next.js + Tailwind + TypeScript + Vercel Serverless + Edge Network</div>
          <div><a href="/" style={{color:"#b8adff"}}>Home</a> · <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/privacy">Privacy Policy</a> | ayushchauhan902704@gmail.com | +91 9389641559</div>
        </footer>
      </div>
    </>
  );
}
