"use client";
import { useState, useRef } from "react";

const MAX_FILE_SIZE = 30 * 1024 * 1024;
const MAX_PIXELS = 40000000;

function formatBytes(b: number) {
  if (b < 1024) return b + " bytes";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}
function crc32(bytes: Uint8Array) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function writeU32(b: Uint8Array, o: number, v: number) {
  b[o] = (v >>> 24) & 255; b[o+1] = (v >>> 16) & 255; b[o+2] = (v >>> 8) & 255; b[o+3] = v & 255;
}
function readU32(b: Uint8Array, o: number) {
  return b[o]*16777216 + (b[o+1]<<16) + (b[o+2]<<8) + b[o+3];
}
function makePhys(dpi: number) {
  const ppm = Math.round(dpi / 0.0254);
  const c = new Uint8Array(21);
  writeU32(c, 0, 9); c.set([112,72,89,115], 4);
  writeU32(c, 8, ppm); writeU32(c, 12, ppm); c[16]=1;
  writeU32(c, 17, crc32(c.subarray(4,17)));
  return c;
}
function updateJpeg(buffer: ArrayBuffer, dpi: number) {
  const src = new Uint8Array(buffer);
  if (src.length < 4 || src[0]!==255 || src[1]!==216) throw new Error("Invalid JPEG.");
  const density = Math.min(65535, Math.max(1, Math.round(dpi)));
  let pos = 2;
  while (pos+4 <= src.length && src[pos]===255) {
    const marker = src[pos+1];
    if (marker===218 || marker===217) break;
    const len = (src[pos+2]<<8)|src[pos+3];
    if (len<2 || pos+2+len > src.length) throw new Error("Invalid JPEG metadata.");
    const isJfif = marker===224 && len>=16 && src[pos+4]===74 && src[pos+5]===70 && src[pos+6]===73 && src[pos+7]===70 && src[pos+8]===0;
    if (isJfif) {
      const out = src.slice();
      out[pos+11]=1; out[pos+12]=density>>8; out[pos+13]=density&255; out[pos+14]=density>>8; out[pos+15]=density&255;
      return out;
    }
    pos += 2+len;
  }
  const jfif = new Uint8Array([255,224,0,16,74,70,73,70,0,1,1,1,density>>8,density&255,density>>8,density&255,0,0]);
  const res = new Uint8Array(src.length+jfif.length);
  res.set(src.subarray(0,2),0); res.set(jfif,2); res.set(src.subarray(2),2+jfif.length);
  return res;
}
function updatePng(buffer: ArrayBuffer, dpi: number) {
  const src = new Uint8Array(buffer);
  const sig = [137,80,78,71,13,10,26,10];
  if (src.length<33 || !sig.every((v,i)=>src[i]===v)) throw new Error("Invalid PNG.");
  const parts: Uint8Array[] = [src.subarray(0,8)];
  let pos=8, inserted=false, foundH=false, foundE=false;
  while (pos+12 <= src.length) {
    const len = readU32(src,pos);
    if (len > src.length-pos-12) throw new Error("PNG damaged.");
    const type = String.fromCharCode(src[pos+4],src[pos+5],src[pos+6],src[pos+7]);
    const end = pos+12+len;
    if (type==="IHDR") { if(foundH) throw new Error("Invalid PNG."); parts.push(src.subarray(pos,end)); foundH=true; if(!inserted){ parts.push(makePhys(dpi)); inserted=true; } }
    else if (type!=="pHYs") parts.push(src.subarray(pos,end));
    pos=end;
    if (type==="IEND"){ foundE=true; break; }
  }
  if(!foundH||!inserted||!foundE) throw new Error("PNG could not be processed.");
  if(pos<src.length) parts.push(src.subarray(pos));
  const total = parts.reduce((s,p)=>s+p.length,0);
  const res = new Uint8Array(total); let off=0;
  for(const p of parts){ res.set(p,off); off+=p.length; }
  return res;
}

export default function Page() {
  const [file, setFile] = useState<File|null>(null);
  const [preview, setPreview] = useState("");
  const [meta, setMeta] = useState("");
  const [dpi, setDpi] = useState(300);
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [blob, setBlob] = useState<Blob|null>(null);
  const [format, setFormat] = useState("");
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
    if ((window as any).heic2any) { resolve(); return; }
    const ex = document.querySelector('script[data-heic="true"]');
    if (ex) { ex.addEventListener("load", ()=>resolve(), {once:true}); ex.addEventListener("error", ()=>reject(new Error("HEIC converter could not be loaded.")), {once:true}); return; }
    const s = document.createElement("script"); s.src=src; s.async=true; s.dataset.heic="true"; s.onload=()=>resolve(); s.onerror=()=>reject(new Error("HEIC converter could not be loaded.")); document.head.appendChild(s);
  });

  const getType = (f: File) => {
    const n = f.name.toLowerCase(); const t = f.type.toLowerCase();
    if (t==="image/png"||n.endsWith(".png")) return "png";
    if (t==="image/jpeg"||n.endsWith(".jpg")||n.endsWith(".jpeg")) return "jpeg";
    if (t.includes("heic")||t.includes("heif")||n.endsWith(".heic")||n.endsWith(".heif")) return "heic";
    return "unsupported";
  };

  const onFile = async (f: File|undefined) => {
    if(!f || processing) return;
    setStatus(""); setReady(false); setPreview(""); setMeta("");
    setProcessing(true);
    try {
      if (f.size > MAX_FILE_SIZE) throw new Error("Please select an image smaller than 30 MB.");
      if (f.size===0) throw new Error("The selected file is empty.");
      const type = getType(f);
      if (type==="unsupported") throw new Error("Unsupported format. Please choose JPG, PNG or HEIC.");
      let working: Blob = f; let fmt = type;
      if (type==="heic") {
        setStatus("Converting HEIC image. Please wait...");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js");
        const conv = await (window as any).heic2any({ blob: f, toType: "image/jpeg", quality: 0.92 });
        const b = Array.isArray(conv)?conv[0]:conv;
        if(!(b instanceof Blob)||b.size===0) throw new Error("HEIC conversion failed.");
        working=b; fmt="jpeg";
      }
      const url = URL.createObjectURL(working);
      const img = new Image();
      await new Promise<void>((res, rej)=>{ img.onload=()=>{URL.revokeObjectURL(url); res();}; img.onerror=()=>{URL.revokeObjectURL(url); rej(new Error("The browser could not read this image."));}; img.src=url; });
      const iw = img.naturalWidth, ih = img.naturalHeight;
      if(!iw||!ih) throw new Error("Invalid dimensions.");
      if(iw*ih > MAX_PIXELS) throw new Error("Too many pixels. Use smaller image.");
      setFile(f); setBlob(working); setFormat(fmt); setW(iw); setH(ih);
      setPreview(URL.createObjectURL(working));
      setMeta(`${iw} × ${ih} pixels • ${formatBytes(f.size)}${type==="heic"?" • Converted to JPG":""}`);
      setReady(true); setStatus("Image loaded. Select DPI and download."); setIsSuccess(true);
    } catch(e:any) {
      setStatus(e.message||"Could not load image."); setIsSuccess(false); setReady(false);
    } finally { setProcessing(false); if(inputRef.current) inputRef.current.value=""; }
  };

  const download = async () => {
    if(!ready||!blob) { setStatus("Please upload image first."); setIsSuccess(false); return; }
    if(!Number.isInteger(dpi)||dpi<1||dpi>1200){ setStatus("Enter whole number 1-1200."); setIsSuccess(false); return; }
    setStatus("");
    try {
      const buf = await blob.arrayBuffer();
      let result: Uint8Array, mime: string, ext: string;
      if(format==="png"){ result=updatePng(buf,dpi); mime="image/png"; ext="png"; }
      else { result=updateJpeg(buf,dpi); mime="image/jpeg"; ext="jpg"; }
      const finalBlob = new Blob([result as any], {type:mime});
      const url = URL.createObjectURL(finalBlob);
      const base = (file?.name||"image").replace(/\.[^.]+$/,"").replace(/[^\w-]+/g,"-").replace(/^-+|-+$/g,"")||"image";
      const a = document.createElement("a"); a.href=url; a.download=`${base}-${dpi}dpi.${ext}`; a.style.display="none"; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),60000);
      setStatus(`Your ${dpi} DPI image ready. If Safari opens image, use Share > Save to Files.`); setIsSuccess(true);
      if((window as any).gtag) (window as any).gtag("event","dpi_image_download",{event_category:"Image Tools",event_label:dpi+" DPI",image_format:format});
    } catch(e:any){ setStatus(e.message||"Could not prepare image."); setIsSuccess(false); }
  };

  return (
    <div style={{fontFamily:"Inter,system-ui,Arial,sans-serif",background:"#fffbeb",color:"#1f2937",minHeight:"100vh",lineHeight:1.6}}>
      <header style={{borderBottom:"1px solid #fde68a",background:"#fff",position:"sticky",top:0,zIndex:10}}>
        <div style={{maxWidth:1100,margin:"auto",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <a href="/" style={{fontSize:26,fontWeight:900,letterSpacing:.5,textDecoration:"none",color:"#1f2937"}}>NEX<span style={{color:"#f59e0b"}}>ORA</span></a>
          <a href="/" style={{color:"#57534e",fontSize:13,fontWeight:700,border:"1px solid #fde68a",padding:"8px 14px",borderRadius:999,background:"#fffbeb",textDecoration:"none"}}>← All Tools</a>
        </div>
      </header>
      <main style={{maxWidth:900,margin:"28px auto",padding:"0 18px"}}>
        <section style={{textAlign:"center",marginBottom:22}}>
          <div style={{display:"inline-block",background:"#fff7ed",color:"#d97706",padding:"6px 13px",borderRadius:30,fontSize:11,fontWeight:900,border:"1px solid #fed7aa",marginBottom:12}}>FREE DPI TOOL • NO WATERMARK</div>
          <h1 style={{fontSize:"clamp(28px,5vw,42px)",lineHeight:1.15,fontWeight:900,letterSpacing:-1}}>Image DPI Changer - Change 72 to 300 DPI Instantly</h1>
          <p style={{color:"#78716c",maxWidth:650,margin:"10px auto 0",fontSize:14}}>Change your JPG, PNG or HEIC image DPI to 72, 150, 300, 600 or custom value. Best for printing, Amazon, passport & worldwide docs. 100% Private - No Watermark.</p>
        </section>

        <section style={{background:"#fff",border:"1px solid #fde68a",borderRadius:20,padding:22,boxShadow:"0 8px 30px rgba(245,158,11,.08)"}}>
          <label onClick={()=>inputRef.current?.click()} style={{display:"block",border:"3px dashed #f59e0b",borderRadius:18,padding:"36px 15px",textAlign:"center",background:"#fffbeb",cursor:"pointer"}}>
            <div style={{fontSize:40,marginBottom:8}}>📏</div>
            <h2 style={{fontSize:18,marginBottom:4}}>Upload Your Image</h2>
            <p style={{fontSize:12,color:"#78716c"}}>Tap to choose or <strong style={{color:"#f59e0b"}}>browse files</strong> - JPG, PNG, HEIC supported</p>
          </label>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif" onChange={(e)=>onFile(e.target.files?.[0])} style={{position:"absolute",width:1,height:1,opacity:0,overflow:"hidden"}} />
          {file && (
            <div style={{marginTop:18,padding:14,background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{fontSize:24}}>🖼️</div><div><div style={{fontSize:13,fontWeight:800,overflowWrap:"anywhere"}}>{file.name}</div><div style={{fontSize:11,color:"#78716c"}}>{meta}</div></div></div>
              {preview && <img src={preview} alt="Uploaded preview" style={{maxWidth:"100%",maxHeight:280,objectFit:"contain",margin:"14px auto 0",borderRadius:8,display:"block"}} />}
            </div>
          )}
          <div style={{marginTop:22}}>
            <h3 style={{fontSize:16,marginBottom:12,fontWeight:900}}>Select DPI</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {[72,150,300,600].map(v=>(
                <button key={v} onClick={()=>setDpi(v)} style={{background:dpi===v?"#f59e0b":"#fff",color:dpi===v?"white":"#44403c",border:"1px solid #fde68a",borderRadius:11,padding:"12px 5px",fontWeight:800,cursor:"pointer"}}>{v} DPI</button>
              ))}
            </div>
            <div style={{marginTop:18}}>
              <label style={{display:"block",fontSize:12,color:"#57534e",marginBottom:7,fontWeight:700}}>Or enter custom DPI (1–1200)</label>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <input type="number" min={1} max={1200} value={dpi} onChange={(e)=>setDpi(Number(e.target.value))} style={{width:"100%",background:"#fff",border:"1px solid #fde68a",borderRadius:10,padding:12,color:"#1f2937",fontSize:15,outline:"none"}} />
                <span style={{color:"#78716c",fontSize:13,fontWeight:800}}>DPI</span>
              </div>
            </div>
            <div style={{marginTop:14,padding:"12px 14px",background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:10,fontSize:12,color:"#57534e"}}><strong style={{color:"#d97706"}}>Important:</strong> Changing DPI does not add pixels or blur. It changes print density for high-quality printing.</div>
            {status && <div style={{marginTop:14,fontSize:12,color:isSuccess?"#059669":"#dc2626",fontWeight:700,overflowWrap:"anywhere"}}>{status}</div>}
            <button onClick={download} disabled={!ready||processing} style={{width:"100%",marginTop:20,padding:14,background:"linear-gradient(90deg,#f59e0b,#f97316)",color:"white",border:0,borderRadius:12,fontSize:15,fontWeight:900,cursor:(!ready||processing)?"not-allowed":"pointer",opacity:(!ready||processing)?.45:1,boxShadow:"0 8px 20px rgba(245,158,11,.25)"}}>{processing?"Preparing Image...":`Download Image - ${dpi} DPI →`}</button>
            <p style={{textAlign:"center",marginTop:12,color:"#a8a29e",fontSize:11,fontWeight:700}}>🔒 100% Private - Images processed in browser, never uploaded. Made in India</p>
          </div>
        </section>

        <div style={{marginTop:28,background:"#fff",border:"1px solid #fde68a",borderRadius:18,padding:22}}>
          <h2 style={{fontSize:18,fontWeight:900,marginBottom:10}}>What is Image DPI Changer - No.1 Tool?</h2>
          <p style={{fontSize:13,color:"#57534e",lineHeight:1.85}}>NEXORA Image DPI Changer is the free online tool to change image DPI from 72 to 300 DPI instantly. DPI means Dots Per Inch - it tells printer how dense image should be printed. Unlike other tools that compress or add watermark, NEXORA keeps original pixels, quality and converts DPI metadata correctly for JPG (JFIF) and PNG (pHYs chunk). Used by users worldwide from USA, Brazil, India, Indonesia, Nigeria, Germany for Amazon product photos, passport photos, printing shops, and government forms. 100% free, no watermark, HD quality, works on iPhone, Android, PC.</p>
          <h3 style={{fontSize:14,fontWeight:900,marginTop:18,color:"#d97706"}}>How to use Image DPI Changer - 3-4 Step</h3>
          <p style={{fontSize:13,color:"#57534e",lineHeight:1.85}}><b>Step 1:</b> Upload your image<br /><b>Step 2:</b> Select 300 DPI and Download<br /><b>Step 3:</b> Click Download Image button - your new DPI image saves instantly.<br /><b>Step 4:</b> Use for printing, Amazon, Shopify, passport, visa worldwide.</p>
          <h3 style={{fontSize:14,fontWeight:900,marginTop:18,color:"#d97706"}}>FAQ - Image DPI Changer</h3>
          <p style={{fontSize:13,color:"#57534e",lineHeight:1.85}}><b>Q: Does changing DPI reduce quality?</b><br />A: No, it only changes print density metadata. Pixels remain same.<br /><br /><b>Q: Is it free and private?</b><br />A: Yes, 100% free, browser-based, images never leave your device.<br /><br /><b>Q: Which formats supported?</b><br />A: JPG, PNG and HEIC (HEIC auto-converts to JPG).</p>
        </div>

        <div style={{marginTop:26,background:"#fff",border:"1px solid #fde68a",borderRadius:18,padding:20}}>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:20,fontSize:12,color:"#57534e"}}>
            <div><b style={{color:"#111827",fontSize:14}}>NEXORA — Built by Ayush Chauhan</b><br /><div style={{marginTop:8,lineHeight:1.9}}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{color:"#d97706",fontWeight:700}}>ayushchauhan902704@gmail.com</a><br />📱 Phone: <a href="tel:+919389641559" style={{color:"#d97706",fontWeight:700}}>+91 9389641559</a><br />📍 Dehradun, Uttarakhand, India<br /></div></div>
            <div><div>© 2026 NEXORA Tools</div><div>Made in India 🇮🇳 | 72k+ Users</div><div style={{marginTop:8}}><a href="/" style={{color:"#d97706",fontWeight:700}}>← Back to All Tools</a></div></div>
          </div>
        </div>
      </main>
      <footer style={{marginTop:36,padding:"22px 15px",textAlign:"center",borderTop:"1px solid #fde68a",color:"#a8a29e",fontSize:11,background:"#fff"}}><p>© 2026 NEXORA Tools - Image DPI Changer - All Rights Reserved - Dehradun, India</p></footer>
    </div>
  );
}
