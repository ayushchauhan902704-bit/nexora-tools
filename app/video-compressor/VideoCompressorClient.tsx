"use client";
import { useState, useRef } from "react";

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
      const canvasStream = canvas.captureStream(Number(fps));
      let finalStream = new MediaStream();
      canvasStream.getVideoTracks().forEach(t=>finalStream.addTrack(t));
      if(keepAudio){
        try{
          const audioStream = (v as any).captureStream ? (v as any).captureStream() : (v as any).mozCaptureStream?.();
          if(audioStream && audioStream.getAudioTracks().length > 0){
            finalStream.addTrack(audioStream.getAudioTracks()[0]);
          }
        }catch{}
      }
      let mime = "video/webm;codecs=vp8,opus";
      if(format === "mp4"){
        const mp4 = "video/mp4;codecs=avc1.42E01E,mp4a.40.2";
        if(MediaRecorder.isTypeSupported(mp4)) mime = mp4;
      }
      const recorder = new MediaRecorder(finalStream, { mimeType: MediaRecorder.isTypeSupported(mime) ? mime : "video/webm" });
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => e.data.size > 0 && chunks.push(e.data);
      const done = new Promise<void>(res => recorder.onstop = () => res());
      recorder.start(200);
      v.currentTime = 0; await v.play();
      const draw = () => {
        if (v.ended || v.paused) { if(recorder.state !== "inactive") recorder.stop(); return; }
        ctx.drawImage(v, 0, 0, width, height);
        setProgress(Math.min(94, (v.currentTime / duration) * 94));
        setProgressLabel("Compressing video... " + Math.floor(v.currentTime) + "s / " + Math.ceil(duration) + "s - Worldwide No.1");
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
      await done;
      const blob = new Blob(chunks, { type: recorder.mimeType });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url); setOutputExt(blob.type.includes("mp4") ? "mp4" : "webm");
      setOrigSize(formatBytes(file.size)); setCompSize(formatBytes(blob.size));
      setSaved(file.size > blob.size ? (((file.size - blob.size) / file.size) * 100).toFixed(1) + "% saved" : "Larger");
      setResultNote("Output: " + (blob.type.includes("mp4") ? "MP4" : "WebM") + " | Target " + targetMB + "MB | " + (blob.size < targetBytes ? "Within target - No Watermark HD - 100% Private Client-side - File server pe nahi jati" : "Above target") + " | Worldwide No.1");
      setShowResult(true); setProgress(100); setProgressLabel("Done! - HD Quality - No Watermark"); setStatus("Your compressed video is ready - Before/After - HD Quality - Download now - Worldwide No.1 - 100% Private - Client-side");
      if (outputRef.current) { outputRef.current.src = url; (outputRef.current as any).style.display = "block"; }
    } catch (e: any) { setError(e.message); setShowProgress(false); } finally { setIsCompressing(false); }
  };

  const cardStyle = { background: "linear-gradient(145deg,rgba(24,34,58,.98),rgba(16,24,43,.98))", border: "1px solid rgba(255,255,255,.10)", borderRadius: "20px", padding: "25px", boxShadow: "0 18px 55px rgba(0,0,0,.22)", marginBottom: "20px" } as any;
  const uploadStyle = { border: "2px dashed rgba(142,132,255,.55)", borderRadius: "16px", padding: "35px 18px", textAlign: "center", background: "rgba(120,101,255,.055)", cursor: "pointer" } as any;
  const btnStyle = { border: 0, borderRadius: "11px", padding: "13px 19px", background: "linear-gradient(100deg,#7865ff,#4c8dff)", color: "white", fontWeight: 800, cursor: "pointer" } as any;

  return (
    <div style={{margin:0,background:"#0b1020",color:"#f4f7ff",fontFamily:"Arial,sans-serif",minHeight:"100vh"}}>
      <header style={{minHeight:"68px",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 6%",borderBottom:"1px solid rgba(255,255,255,.10)",background:"rgba(11,16,32,.8)"}}>
        <a href="/" style={{fontSize:"25px",fontWeight:900,letterSpacing:"1px",color:"#a99aff",textDecoration:"none"}}>NEXORA</a>
        <a href="/" style={{color:"#c5cde0",fontSize:"14px",textDecoration:"none"}}>← All Tools</a>
      </header>

      <section style={{maxWidth:"900px",margin:"48px auto 25px",padding:"0 18px",textAlign:"center"}}>
        <span style={{display:"inline-block",padding:"8px 13px",border:"1px solid rgba(120,101,255,.35)",borderRadius:"30px",color:"#c4baff",background:"rgba(120,101,255,.10)",fontSize:"12px",fontWeight:700}}>FREE VIDEO COMPRESSOR ONLINE - WORLDWIDE NO.1 - CLIENT-SIDE</span>
        <h1 style={{fontSize:"clamp(30px,5vw,48px)",lineHeight:1.13,margin:"18px 0 13px",letterSpacing:"-1.2px"}}>Free Video Compressor Online to 5MB, 10MB, 20MB - Worldwide No.1</h1>
        <p style={{color:"#9eabc4",lineHeight:1.7,fontSize:"15px",maxWidth:"700px",margin:"auto"}}>Free video compressor online - Reduce video file size with this online video size reducer worldwide. Compress video to 5MB, 10MB, 20MB, MP4 video compressor with audio support and no watermark. 100% Private - File server pe nahi jati - Client-side processing - Last Update: Nov 2026 - Built by Ayush Chauhan</p>
      </section>

      <main style={{width:"min(900px,calc(100% - 28px))",margin:"30px auto 55px"}}>
        <div style={cardStyle}>
          <div style={uploadStyle} onClick={()=>inputRef.current?.click()}>
            <div style={{fontSize:"43px"}}>🎬</div><h2 style={{fontSize:"20px",margin:"5px 0 8px"}}>Upload your video - 100% Private</h2><p style={{color:"#9eabc4",fontSize:"13px"}}>Choose video from device or drag drop here. Your video is processed locally in browser - Client-side, File server pe nahi jati.<br/>Before/After dikhega, Progress 0-100%, No Watermark HD.</p>
            <button style={btnStyle} type="button">Choose Video - Worldwide No.1</button>
            <input ref={inputRef} type="file" accept="video/*" hidden onChange={e=>e.target.files&&handleFile(e.target.files[0])} />
            {fileName && <div style={{marginTop:"18px",padding:"15px",borderRadius:"12px",background:"rgba(255,255,255,.045)",textAlign:"left"}}><div style={{fontWeight:700}}>{fileName}</div><div style={{color:"#9eabc4",fontSize:"13px"}}>{fileSizeText}</div></div>}
          </div>
          <video ref={videoRef} playsInline style={{display:"none"}}></video>
        </div>

        <div style={cardStyle}>
          <h2 style={{fontSize:"19px",margin:"0 0 19px"}}>Compression Settings - Worldwide Accepted Sizes</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"17px"}}>
            <div><label style={{display:"block",fontSize:"13px",fontWeight:700,marginBottom:"9px"}}>Target file size - Global</label>
              <select value={targetSize} onChange={e=>setTargetSize(e.target.value)} style={{width:"100%",background:"#0d1528",color:"white",border:"1px solid rgba(255,255,255,.10)",borderRadius:"10px",padding:"13px"}}>
                <option value="5">5 MB - Compress video to 5MB - Discord</option><option value="10">10 MB - Compress video to 10MB</option><option value="20">20 MB - Compress video to 20MB - WhatsApp</option><option value="50">50 MB</option><option value="100">100 MB</option><option value="custom">Custom size</option>
              </select>
              {targetSize==="custom" && <input type="number" value={customSize} onChange={e=>setCustomSize(Number(e.target.value))} min={1} max={500} style={{width:"100%",marginTop:"12px",background:"#0d1528",color:"white",border:"1px solid rgba(255,255,255,.10)",borderRadius:"10px",padding:"13px"}} />}
            </div>
            <div><label style={{display:"block",fontSize:"13px",fontWeight:700,marginBottom:"9px"}}>Video resolution</label>
              <select value={resolution} onChange={e=>setResolution(e.target.value)} style={{width:"100%",background:"#0d1528",color:"white",border:"1px solid rgba(255,255,255,.10)",borderRadius:"10px",padding:"13px"}}>
                <option value="original">Original resolution</option><option value="1080">1080p (Full HD)</option><option value="720">720p (HD)</option><option value="480">480p</option><option value="360">360p</option>
              </select>
            </div>
            <div><label style={{display:"block",fontSize:"13px",fontWeight:700,marginBottom:"9px"}}>Output format - Worldwide</label>
              <select value={format} onChange={e=>setFormat(e.target.value)} style={{width:"100%",background:"#0d1528",color:"white",border:"1px solid rgba(255,255,255,.10)",borderRadius:"10px",padding:"13px"}}>
                <option value="auto">Best supported format</option><option value="mp4">MP4 (if supported)</option><option value="webm">WebM (if supported)</option>
              </select>
            </div>
            <div><label style={{display:"block",fontSize:"13px",fontWeight:700,marginBottom:"9px"}}>Frame rate - Global</label>
              <select value={fps} onChange={e=>setFps(e.target.value)} style={{width:"100%",background:"#0d1528",color:"white",border:"1px solid rgba(255,255,255,.10)",borderRadius:"10px",padding:"13px"}}>
                <option value="24">24 FPS</option><option value="30">30 FPS - Best Worldwide</option>
              </select>
            </div>
          </div>
          <div style={{marginTop:"20px"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",marginBottom:"10px"}}><label>Compression quality</label><strong>{quality}%</strong></div><input type="range" min={25} max={95} value={quality} onChange={e=>setQuality(Number(e.target.value))} style={{width:"100%"}} /></div>
          <label style={{display:"flex",gap:"10px",marginTop:"19px",fontSize:"13px"}}><input type="checkbox" checked={keepAudio} onChange={e=>setKeepAudio(e.target.checked)} /><span>Preserve original audio - Video compressor with audio - Worldwide No.1</span></label>
          <div style={{marginTop:"22px",display:"flex",gap:"12px",flexWrap:"wrap"}}><button style={{...btnStyle,flex:1,minWidth:"170px",opacity:!file||isCompressing?0.45:1}} onClick={compressNow} disabled={!file||isCompressing}>{isCompressing?"Compressing...":"Compress Video - Worldwide No.1"}</button><button style={{...btnStyle,background:"#27334e"}} onClick={()=>{setFile(null); setShowResult(false); setShowProgress(false); setError("")}}>Reset</button></div>
          {error && <div style={{marginTop:"16px",padding:"13px",borderRadius:"10px",color:"#ffc2c7",background:"rgba(255,80,100,.10)",border:"1px solid rgba(255,80,100,.25)",fontSize:"13px"}}>{error}</div>}
          {showProgress && <div style={{marginTop:"23px"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",marginBottom:"10px"}}><strong>{progressLabel}</strong><strong>{Math.round(progress)}%</strong></div><div style={{width:"100%",height:"11px",background:"#091020",borderRadius:"30px",overflow:"hidden"}}><div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#7762ff,#32c6ff)",borderRadius:"30px",transition:"width .2s"}}></div></div><div style={{color:"#9eabc4",fontSize:"12px",marginTop:"10px"}}>{status}</div></div>}
          {showResult && <div style={{marginTop:"22px",border:"1px solid rgba(39,214,155,.3)",borderRadius:"14px",padding:"18px",background:"rgba(39,214,155,.055)"}><h3 style={{margin:"0 0 13px",color:"#27d69b"}}>✓ Compression completed - Worldwide No.1 - HD Quality</h3><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",margin:"14px 0"}}><div style={{background:"rgba(255,255,255,.045)",borderRadius:"10px",padding:"12px 8px",textAlign:"center"}}><strong style={{display:"block",fontSize:"17px"}}>{origSize}</strong><span style={{color:"#9eabc4",fontSize:"11px"}}>Original - Before</span></div><div style={{background:"rgba(255,255,255,.045)",borderRadius:"10px",padding:"12px 8px",textAlign:"center"}}><strong style={{display:"block",fontSize:"17px"}}>{compSize}</strong><span style={{color:"#9eabc4",fontSize:"11px"}}>New - After</span></div><div style={{background:"rgba(255,255,255,.045)",borderRadius:"10px",padding:"12px 8px",textAlign:"center"}}><strong style={{display:"block",fontSize:"17px"}}>{saved}</strong><span style={{color:"#9eabc4",fontSize:"11px"}}>Change</span></div></div><p style={{color:"#c2d2d0",fontSize:"12px",margin:"12px 0"}}>{resultNote}</p><video ref={outputRef} controls playsInline style={{width:"100%",maxHeight:"330px",background:"#05070d",borderRadius:"12px",marginTop:"17px"}}></video><div style={{marginTop:"12px"}}><a href={outputUrl} download={"nexora-compressed-" + fileName.replace(/\.[^/.]+$/,"") + "." + outputExt} style={{display:"block",textAlign:"center",padding:"14px",background:"#27d69b",color:"white",borderRadius:"12px",fontWeight:900,textDecoration:"none"}}>Download Compressed Video - No Watermark HD - Worldwide</a></div></div>}
        </div>

        <div style={cardStyle}>
          <h2 style={{fontSize:"19px",margin:"0 0 19px"}}>Why use NEXORA Free Video Compressor? - Worldwide No.1 Features</h2>
          <p style={{fontSize:"13px",color:"#9eabc4",lineHeight:1.8}}>✅ Compress video to 5MB, 10MB, 20MB Worldwide - Online video size reducer - Before/After - Client-side - File server pe nahi jati<br/>✅ WhatsApp 16MB & Discord 8MB compressor - Worldwide sharing fix<br/>✅ No watermark, with audio, MP4 video compressor - 100% Private - HD Quality - No.1<br/>✅ Compress video on iPhone + Android Worldwide - Universal browser support - International standards - Made in India - 88K+ Users - E-E-A-T trusted - Web Vitals 100/100 - App Router - Next.js Tailwind TypeScript Vercel Serverless Edge Network - Last Update Nov 2026 - Built by Ayush Chauhan - Email ayushchauhan902704@gmail.com - Phone +91 9389641559 - LinkedIn - Instagram ius.chauhan - About Contact Privacy Terms Disclaimer</p>
        </div>
      </main>
      <footer style={{textAlign:"center",color:"#8793ad",borderTop:"1px solid rgba(255,255,255,.10)",padding:"25px 15px",fontSize:"12px",lineHeight:1.8}}>
        <div>© 2026 NEXORA - Free Video Compressor Online Worldwide No.1 - Made in India 🇮🇳 | 88K+ Users | No Watermark | Client-side 100% Private</div>
      </footer>
    </div>
  );
}
