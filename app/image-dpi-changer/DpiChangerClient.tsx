"use client";
import { useState, useRef } from "react";

export const dynamic = "force-dynamic";

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
  const sig = Array.from("\x89PNG\r\n\x1a\n", (c) => c.charCodeAt(0));
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

export default function DpiChangerClient() {
  const [file, setFile] = useState<File|null>(null);
  const [preview, setPreview] = useState("");
  const [meta, setMeta] = useState("");
  const [dpi, setDpi] = useState(300);
  const [customDpi, setCustomDpi] = useState("");
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
    if (ex) { ex.addEventListener("load", ()=>resolve(), {once:true}); ex.addEventListener("error", ()=>reject(new Error("HEIC converter load nahi hua.")), {once:true}); return; }
    const s = document.createElement("script"); s.src=src; s.async=true; s.dataset.heic="true"; s.onload=()=>resolve(); s.onerror=()=>reject(new Error("HEIC converter load nahi hua.")); document.head.appendChild(s);
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
      if (f.size > MAX_FILE_SIZE) throw new Error("30 MB se chhoti photo select karo.");
      if (f.size===0) throw new Error("File khaali hai.");
      const type = getType(f);
      if (type==="unsupported") throw new Error("Sirf JPG, PNG ya HEIC chalega.");
      let working: Blob = f; let fmt = type;
      if (type==="heic") {
        setStatus("HEIC photo ko JPG me badal raha hu, ruk jao...");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js");
        const conv = await (window as any).heic2any({ blob: f, toType: "image/jpeg", quality: 0.92 });
        const b = Array.isArray(conv)?conv[0]:conv;
        if(!(b instanceof Blob)||b.size===0) throw new Error("HEIC convert nahi hua.");
        working=b; fmt="jpeg";
      }
      const url = URL.createObjectURL(working);
      const img = new Image();
      await new Promise<void>((res, rej)=>{ img.onload=()=>{URL.revokeObjectURL(url); res();}; img.onerror=()=>{URL.revokeObjectURL(url); rej(new Error("Browser ye photo nahi padh paya."));}; img.src=url; });
      const iw = img.naturalWidth, ih = img.naturalHeight;
      if(!iw||!ih) throw new Error("Photo ka size sahi nahi hai.");
      if(iw*ih > MAX_PIXELS) throw new Error("Photo bahut badi hai. Chhoti photo lo.");
      setFile(f); setBlob(working); setFormat(fmt); setW(iw); setH(ih);
      setPreview(URL.createObjectURL(working));
      setMeta(`${iw} × ${ih} pixels • ${formatBytes(f.size)}${type==="heic"?" • JPG me badal gaya":""}`);
      setReady(true); setStatus("Photo aa gayi. Ab DPI select karke Download dabao."); setIsSuccess(true);
    } catch(e:any) {
      setStatus(e.message||"Photo load nahi hui."); setIsSuccess(false); setReady(false);
    } finally { setProcessing(false); if(inputRef.current) inputRef.current.value=""; }
  };

  const download = async () => {
    if(!ready||!blob) { setStatus("Pehle photo upload karo."); setIsSuccess(false); return; }
    if(!Number.isInteger(dpi)||dpi<10||dpi>1200){ setStatus("10 se 1200 ke beech pura number likho."); setIsSuccess(false); return; }
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
      setStatus(`Ho gaya! ${dpi} DPI wali photo ready hai.`); setIsSuccess(true);
      if((window as any).gtag) (window as any).gtag("event","dpi_image_download",{event_category:"Image Tools",event_label:dpi+" DPI",image_format:format});
    } catch(e:any){ setStatus(e.message||"Photo ban nahi payi."); setIsSuccess(false); }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#ffffff", color: "#0f172a", minHeight: "100vh", colorScheme: "light" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #eef2f7", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 900, color: "#2563eb", textDecoration: "none" }}>NEXORA</a>
          <nav style={{ display: "flex", gap: 20, fontSize: 14, fontWeight: 600 }}>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>Home</a>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>All Tools</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "30px 18px 10px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>✦ FREE • HD • NO WATERMARK • 100% PRIVATE</span>
          </div>
          <h1 style={{ fontSize: 38, margin: "14px 0 8px", lineHeight: 1.05, letterSpacing: "-0.5px", fontWeight: 900, fontFamily: "'Inter', system-ui, sans-serif", background: "linear-gradient(90deg, #1d4ed8, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>DPI Changer<br/>10 - 1200</h1>
          <p style={{ color: "#64748b", fontSize: 16, margin: 0, lineHeight: 1.6 }}>Photo ka DPI 10 se 1200 tak karo 1 sec me.<br/>Any Type DPI Maker - Passport, Amazon, Printing ke liye.</p>
        </div>

        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 18, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 10px", textAlign: "center" }}>Apni Photo Yaha Upload Karo</p>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif" onChange={(e)=>onFile(e.target.files?.[0])} hidden />
          <div onClick={()=>inputRef.current?.click()} style={{ border: "1.5px dashed #cbd5e1", borderRadius: 14, padding: preview ? 10 : 18, textAlign: "center", cursor: "pointer", background: "#fff" }}>
            {preview ? <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 150, borderRadius: 10, objectFit: "contain" }} /> : <><div style={{ fontSize: 28 }}>📏</div><p style={{ fontWeight: 700, margin: "6px 0 2px", fontSize: 15 }}>Tap Karke Photo Upload Karo</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>JPG, PNG, HEIC • 100% Private</p></>}
          </div>

          {file && <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", margin: "10px 0 0" }}>{meta} • {file.name}</p>}

          <div style={{ background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 12, padding: "10px 12px", marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number" min={10} max={1200} value={customDpi}
                onChange={(e) => { setCustomDpi(e.target.value); const v = parseInt(e.target.value); if (!isNaN(v)) setDpi(Math.min(1200, Math.max(10, v))); }}
                placeholder="Kitna DPI chahiye? 10-1200 Type karo"
                style={{ flex: 1, padding: "11px 12px", borderRadius: 10, border: "1.5px solid #2563eb", fontSize: 14, fontWeight: 600, outline: "none", background: "#fff", color: "#0f172a" }}
              />
              <span style={{ fontWeight: 800, fontSize: 14, flexShrink: 0 }}>DPI</span>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, overflowX: "auto", paddingBottom: 2, whiteSpace: "nowrap", scrollbarWidth: "none" }}>
              {[10, 72, 150, 200, 300, 350, 600, 1200].map(s => (
                <button key={s} onClick={() => { setDpi(s); setCustomDpi(String(s)); }} style={{ padding: "6px 10px", borderRadius: 999, border: dpi === s ? "1.5px solid #f97316" : "1px solid #e2e8f0", background: dpi === s ? "#fff7ed" : "#fff", color: dpi === s ? "#ea580c" : "#0f172a", fontWeight: 700, cursor: "pointer", fontSize: 12, flexShrink: 0 }}>{s} DPI</button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12, padding: "10px 12px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, fontSize: 12, color: "#57534e" }}><b style={{ color: "#d97706" }}>Note:</b> Any type DPI bana sakte ho - 10 se 1200 tak. DPI badhane se photo kharab nahi hoti. Sirf print achha hota hai. Pixels same rehte hai.</div>

          {status && <p style={{ background: isSuccess ? "#ecfdf5" : "#fef2f2", color: isSuccess ? "#047857" : "#dc2626", padding: "10px 12px", borderRadius: 10, fontSize: 14, margin: "14px 0 0", textAlign: "center", fontWeight: 600 }}>{status}</p>}

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={download} disabled={!ready||processing} style={{ flex: 1, padding: 15, background: "#f97316", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: (!ready||processing) ? "not-allowed" : "pointer", opacity: (!ready||processing) ? 0.5 : 1 }}>{processing ? "Bana Raha Hu..." : `Download Karo - ${dpi} DPI →`}</button>
            <button onClick={() => { setFile(null); setPreview(""); setStatus(""); setCustomDpi(""); setDpi(300); setReady(false); }} style={{ padding: "15px 20px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Clear</button>
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "10px 0 0", fontWeight: 700 }}>🔒 100% Private - Photo browser me hi badalti hai, kabhi upload nahi hoti</p>
        </div>

        <div style={{ height: 70 }}></div>

        <div style={{ background: "#fefce8", border: "2px solid #facc15", borderRadius: 16, padding: 18 }}>
          <b>💡 Earning Tip - Is Tool Se Paisa Kamao!</b>
          <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.7 }}>Printing shop, studio wale DPI badalne ke liye 30-50 Rs lete hai. Tu WhatsApp pe ₹20 me kisi ki bhi photo ka DPI 10 se 1200 tak kar de. Roz 20 photo = ₹400. Koi paisa nahi lagna, sirf ye free tool.</p>
        </div>

        <div style={{ height: 30 }}></div>

        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21 }}>DPI Kya Hota Hai? Note Wala Samajh</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}>DPI ka matlab hai <b>Dots Per Inch</b>. Matlab 1 inch me kitne dot print honge. Jitna zyada DPI, utni saaf printing.<br/><br/><b>10 DPI</b> = Sabse kam, sirf chhota preview ke liye.<br/><b>72 DPI</b> = Sirf mobile / screen ke liye, print me phat jayega.<br/><b>150 DPI</b> = Normal print ke liye thik hai.<br/><b>300 DPI</b> = Passport, Visa, Sarkari Form, Amazon ke liye best. Sabse zyada manga jata hai.<br/><b>600 - 1200 DPI</b> = Bade poster / banner / high quality print ke liye.</p>
          <p style={{ color: "#475569", lineHeight: 1.8 }}>Is tool se <b>photo ka DPI kaise badhaye</b> - Bas photo upload karo, 10 se 1200 ke beech koi bhi DPI likho, Download dabao. Ye <b>any type DPI maker</b> hai - 10, 72, 150, 300, 600, 1200 ya beech ka koi bhi DPI bana sakte ho.</p>

          <h2 style={{ fontSize: 21, marginTop: 26 }}>Kaise Use Kare? 3 Step Me</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Step 1:</b> Photo upload karo - JPG, PNG ya HEIC.<br/><b>Step 2:</b> Kitna DPI chahiye type karo - 10 se 1200 tak, jaise 300.<br/><b>Step 3:</b> Download dabao - Nayi DPI wali photo mil jayegi.</p>

          <h2 style={{ fontSize: 21, marginTop: 26 }}>NEXORA vs Dusre Tools</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc" }}>NEXORA ✅</th><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc" }}>Dusre ❌</th></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Range</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>10 - 1200 ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Sirf 72 / 300</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Quality</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Same Rahegi ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Compress Kar Dete Hai</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Nahi ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Lagta Hai</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>100% Private ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Server Pe Jati Hai</td></tr>
          </tbody></table>

          <h2 style={{ fontSize: 21, marginTop: 26 }}>Aksar Puche Jane Wale Sawal</h2>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Photo ka DPI kaise badhaye?</summary><p style={{ color: "#475569" }}>Photo upload karo, 10 se 1200 tak koi bhi DPI type karo, Download dabao. 1 sec me ho jayega.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>10 se 1200 DPI kaise kare?</summary><p style={{ color: "#475569" }}>Isi tool me 10 se 1200 tak kuch bhi likh sakte ho. Pixels same rahenge.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Any type DPI maker kya hai?</summary><p style={{ color: "#475569" }}>Matlab koi bhi DPI bana sakte ho - 10, 72, 150, 300, 600, 1200 ya beech ka koi bhi.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>DPI badhane se photo kharab to nahi hogi?</summary><p style={{ color: "#475569" }}>Nahi, DPI sirf print density badalta hai. Photo same rehti hai.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Passport ke liye kitna DPI chahiye?</summary><p style={{ color: "#475569" }}>Passport, Visa aur sarkari form ke liye 300 DPI sabse best hai.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Kya meri photo safe hai?</summary><p style={{ color: "#475569" }}>Haan, photo browser me hi badalti hai, server pe nahi jati.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>HEIC photo chalegi?</summary><p style={{ color: "#475569" }}>Haan, HEIC apne aap JPG me convert ho jayegi.</p></details>

          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <a href="/background-remover" style={{ flex: 1, textAlign: "center", padding: 14, background: "#0f172a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Agla Tool Dekho → Background Remover</a>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "30px 0 10px", lineHeight: 1.6 }}>By <b style={{ color: "#0f172a" }}>Ayush Chauhan</b> • Tool: Nexora<br/>Last Updated: 5 Nov 2026 • 100% Free & Private</p>
      </main>

      <div style={{ background: "#f8fafc", borderTop: "1px solid #eef2f7", padding: "16px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "nexoraLoop 18s linear infinite", fontSize: 14, fontWeight: 700, color: "#2563eb" }}>
          <span style={{ padding: "0 18px" }}>✦ DPI Changer 10-1200</span><span style={{ padding: "0 18px" }}>✦ Compress Image to 20KB</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ DPI Changer 10-1200</span><span style={{ padding: "0 18px" }}>✦ Compress Image to 20KB</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span>
        </div>
        <style>{`@keyframes nexoraLoop { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      <footer style={{ background: "#0f172a", color: "#cbd5e1", padding: "20px 16px", textAlign: "center", fontSize: 13 }}>
        <b style={{ color: "#fff", fontSize: 16 }}>NEXORA</b>
        <p style={{ margin: "6px 0 0" }}>Free Tools. Simple Solutions. • <a href="/about" style={{ color: "#cbd5e1" }}>About</a> • <a href="/privacy-policy" style={{ color: "#cbd5e1" }}>Privacy</a> • <a href="/contact" style={{ color: "#cbd5e1" }}>Contact</a></p>
      </footer>
    </div>
  );
}
