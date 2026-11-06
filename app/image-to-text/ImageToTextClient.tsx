"use client";
import { useState, useRef } from "react";
import Script from "next/script";

export default function ImageToTextClient() {
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Ready");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState("eng+hin"); // eng = Hinglish + English, hin = Hindi Devanagari
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) { alert("Only image chuno"); return; }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => { setPreview(e.target?.result as string); };
    reader.readAsDataURL(f);
    setShowResult(false);
    setResult("");
    setStatus("Image mil gayi - Ab Convert dabao");
  };

  // IMAGE KO SAAF KARNE WALA FUNCTION - YAHI ASLI FIX HAI
  const enhanceImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // 2x bada karo - Chhota text bada dikhega
        const scale = img.width < 1000 ? 2.5 : 1.5;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Grayscale + Contrast - Halka text kala ho jayega
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const gray = (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114);
          // Threshold - 140 se upar white, neeche black - Text saaf dikhega
          const val = gray > 140 ? 255 : 0;
          data[i] = val; data[i+1] = val; data[i+2] = val;
        }
        ctx.putImageData(imageData, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob((b) => resolve(b!), "image/png");
      };
      img.src = url;
    });
  };

  const convertNow = async () => {
    if (!file) return;
    setShowProgress(true); setIsProcessing(true); setProgress(0);
    setShowResult(false);
    // @ts-ignore
    const Tesseract = (window as any).Tesseract;
    if (!Tesseract) { alert("OCR load ho raha hai... 2 sec ruk ke dobara dabao"); setIsProcessing(false); setShowProgress(false); return; }
    try {
      setStatus("Image saaf ho rahi hai... 2x Zoom + Contrast");
      setProgress(10);
      const cleanBlob = await enhanceImage(file);
      // Preview me saaf wali image dikhao
      setPreview(URL.createObjectURL(cleanBlob));

      setStatus("Text padha ja raha hai...");
      const worker = await Tesseract.createWorker(lang, 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") { setProgress(Math.round(m.progress * 100)); setStatus(`Padh raha hu... ${Math.round(m.progress * 100)}%`); }
          else setStatus(m.status);
        },
      });
      // PSM 6 = Poora page ka text - Screenshot ke liye best
      await worker.setParameters({ tessedit_pageseg_mode: "6" });
      const { data: { text } } = await worker.recognize(cleanBlob);
      await worker.terminate();

      const cleanText = text.trim();
      if (!cleanText) {
        setResult("Text nahi mila. \n\nTip: \n1. Saaf, seedhi photo lo - Tedhi mat lo\n2. Light achhi rakho\n3. Text bada rakho - Screenshot zoom karke lo\n4. Hindi ke liye Hindi option chuno, Hinglish ke liye English option chuno");
      } else {
        setResult(cleanText);
      }
      setShowResult(true); setShowProgress(false); setProgress(100);
      setStatus("Ho gaya!");
    } catch (err: any) { alert("Error: " + err.message); setShowProgress(false); }
    setIsProcessing(false);
  };

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js" strategy="lazyOnload" />
      <style>{`
        *{box-sizing:border-box} .container{width:min(100% - 32px,900px);margin:auto}
        header{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.92);backdrop-filter:blur(14px);border-bottom:1px solid #e8e8ef}
        .logo{font-size:24px;font-weight:900;letter-spacing:-1px} .logo span{color:#ff7a00}
        .badge{display:inline-flex;padding:6px 12px;border-radius:999px;background:#fff3e6;color:#ff7a00;font-size:11px;font-weight:800;border:1px solid #ffedd5}
        .calculator{background:white;border:1px solid #e5e5ed;border-radius:24px;padding:26px;box-shadow:0 18px 50px rgba(30,30,70,0.08)}
        .pro-box{background:white;border:1px solid #e5e5ed;border-radius:20px;padding:22px;margin-top:18px;box-shadow:0 4px 20px rgba(0,0,0,.04)}
        .pro-box h2{font-size:16px;font-weight:900} .pro-box h3{font-size:13px;font-weight:900;margin:14px 0 6px} .pro-box p,.pro-box li{font-size:12.5px;color:#444;line-height:1.7}
        table{width:100%;border-collapse:collapse;font-size:12px;margin-top:10px} th,td{border:1px solid #e5e7eb;padding:8px} th{background:#fff7ed}
        .lang-btn{flex:1;height:44px;border-radius:12px;border:1.5px solid #eee;background:#fff;font-weight:800;cursor:pointer;font-size:13px}
        .lang-btn.active{background:#ff7a00;color:#fff;border-color:#ff7a00}
      `}</style>

      <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif",background:"#ffffff",color:"#171725"}}>
        <header><div className="container" style={{height:"70px",display:"flex",alignItems:"center",justifyContent:"space-between"}}><a href="/" className="logo" style={{textDecoration:"none",color:"#171725"}}>NEX<span>ORA</span></a><div style={{display:"flex",gap:"8px",alignItems:"center"}}><span className="badge">● 89K+ USERS • PRIVATE • NO.1</span><a href="/" style={{fontWeight:700,fontSize:"13px",color:"#ff7a00",textDecoration:"none"}}>← All Tools</a></div></div></header>

        <main>
          <section style={{textAlign:"center",padding:"28px 0 16px"}}><div className="container"><span className="badge">📷 OCR • NO UPLOAD • HINDI + HINGLISH + ENGLISH • FREE</span><h1 style={{fontSize:"clamp(28px,6vw,44px)",lineHeight:1.05,letterSpacing:"-1.2px",fontWeight:900}}>Image to <span style={{color:"#ff7a00"}}>Text</span> - Free OCR</h1><p style={{maxWidth:"650px",margin:"10px auto 0",color:"#676778",fontSize:"13px"}}>Photo se text nikalo - Hindi, Hinglish, English - 3 second me. 100% Private - Image browser me hi rehti hai, server pe nahi jati. No signup, No watermark.</p></div></section>

          <section><div className="container">
            <div className="calculator">
              {/* LANGUAGE CHUNO - HINGLISH KE LIYE ENGLISH */}
              <label style={{fontWeight:800,fontSize:"13px",display:"block",marginBottom:"8px"}}>1. Language Chuno - Kis Bhasha Ka Text Hai?</label>
              <div style={{display:"flex",gap:"8px",marginBottom:"16px"}}>
                <button className={lang==="eng" ? "lang-btn active" : "lang-btn"} onClick={()=>setLang("eng")}>English + Hinglish<br/><small style={{fontWeight:500}}>Jaise: Mera naam Ayush hai</small></button>
                <button className={lang==="hin" ? "lang-btn active" : "lang-btn"} onClick={()=>setLang("hin")}>Hindi - हिन्दी<br/><small style={{fontWeight:500}}>Jaise: मेरा नाम आयुष है</small></button>
                <button className={lang==="eng+hin" ? "lang-btn active" : "lang-btn"} onClick={()=>setLang("eng+hin")}>Dono Mix<br/><small style={{fontWeight:500}}>Hindi + English Dono</small></button>
              </div>

              <div onClick={()=>inputRef.current?.click()} style={{border:"2px dashed #ff7a00",borderRadius:"12px",padding:"32px",textAlign:"center",cursor:"pointer",background:"#fff7ed"}}>
                <input ref={inputRef} type="file" accept="image/*" hidden onChange={e=>e.target.files&&handleFile(e.target.files[0])} />
                {preview ? <img src={preview} style={{maxHeight:"280px",margin:"auto",borderRadius:"12px",maxWidth:"100%"}} alt="preview" /> : <><div style={{fontSize:"40px"}}>📷</div><p style={{fontWeight:700,marginTop:"6px"}}>Click to Upload Image - 100% Private</p><p style={{fontSize:"12px",color:"#888",marginTop:"4px"}}>JPG, PNG, WEBP - Hindi, Hinglish & English - Saaf photo lo, text bada rakho</p></>}
              </div>

              {showProgress && <div style={{marginTop:"24px"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:"12px"}}><span>Extracting... 0% to 100%</span><span>{progress}%</span></div><div style={{width:"100%",background:"#e5e7eb",borderRadius:"999px",height:"8px",marginTop:"4px"}}><div style={{background:"#ff7a00",height:"8px",borderRadius:"999px",width:`${progress}%`,transition:"width .2s"}}></div></div><p style={{fontSize:"11px",color:"#777",marginTop:"6px"}}>{status}</p></div>}

              <div style={{display:"flex",gap:"12px",marginTop:"16px"}}><button onClick={convertNow} disabled={!file||isProcessing} style={{flex:1,height:"52px",background:"#ff7a00",color:"white",border:0,borderRadius:"13px",fontWeight:800,cursor:"pointer",opacity:(!file||isProcessing)?0.6:1}}>{isProcessing?"Saaf Karke Padh Raha Hu...":"Convert to Text - No.1"}</button><button onClick={()=>{setFile(null); setPreview(""); setShowResult(false); setShowProgress(false); setResult("")}} style={{padding:"0 20px",height:"52px",background:"#fff3e6",color:"#ff7a00",border:0,borderRadius:"13px",fontWeight:800,cursor:"pointer"}}>Clear</button></div>

              {showResult && <div style={{marginTop:"24px"}}><label style={{fontWeight:800,fontSize:"13px"}}>✅ Extracted Text - Neeche Wala Text Copy Karo:</label><textarea value={result} onChange={e=>setResult(e.target.value)} style={{width:"100%",marginTop:"8px",height:"220px",padding:"14px",border:"1px solid #ddd",borderRadius:"13px",background:"#fafafa",fontSize:"14px",lineHeight:1.6}} placeholder="Text yaha aayega..."></textarea><div style={{display:"flex",gap:"12px",marginTop:"10px"}}><button onClick={()=>{navigator.clipboard.writeText(result); alert("Copy ho gaya!")}} style={{flex:1,height:"46px",background:"#00b894",color:"white",border:0,borderRadius:"12px",fontWeight:700}}>Copy Text</button><button onClick={()=>{const blob=new Blob([result],{type:"text/plain"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="nexora-extracted-text.txt"; a.click()}} style={{flex:1,height:"46px",background:"#171725",color:"white",border:0,borderRadius:"12px",fontWeight:700}}>Download .txt</button></div></div>}

              <p style={{fontSize:"12px",color:"#888",marginTop:"14px",lineHeight:1.6}}>💡 <b>Tip:</b> Agar text nahi aaye to - 1. Photo ko zoom karke crop karo, sirf text wala hissa rakho 2. Light me photo lo 3. Screenshot ki jagah seedhi photo lo. Speed Test wali screenshot ka text bahut chhota aur halka hai, isliye wo nahi padha jata.</p>
            </div>

            <div className="pro-box">
              <h2>What is Image to Text Converter (NEXORA OCR)?</h2>
              <p>NEXORA Image to Text Converter free OCR tool hai jo kisi bhi image ka text nikal deta hai - Hindi, Hinglish, English - 3 second me. Image server pe nahi jati, browser me hi rehti hai, 100% private. Book, Screenshot, Aadhaar, PAN, Document, Handwritten notes - sab ka text nikalta hai. Best for students, YouTubers, office workers. Made in India, trusted by 89K+ users.</p>
              <h3>How to Use - 3 Easy Steps</h3>
              <p><b>Step 1:</b> Language chuno - Hinglish ke liye English, Hindi ke liye Hindi<br/><b>Step 2:</b> Photo upload karo - Saaf, seedhi photo<br/><b>Step 3:</b> Convert dabao - Text neeche aa jayega, Copy ya Download karo</p>
              <h3>Features - Why No.1?</h3>
              <ul style={{paddingLeft:"18px"}}>
                <li>✅ Hindi + Hinglish + English - Teeno bhasha</li>
                <li>✅ 100% Private - No upload, browser me hi kaam</li>
                <li>✅ Auto Enhance - Image ko saaf karke padhta hai - 2x Zoom + Contrast</li>
                <li>✅ Free Forever, No Watermark, No Signup</li>
                <li>✅ Mobile + Laptop - Sab pe chalega</li>
              </ul>
            </div>

            <div className="pro-box"><h2>FAQ - Image to Text</h2><p><b>Q1: Hinglish ka text kaise nikale?</b><br/>A: Language me English + Hinglish chuno. Jaise photo me likha hai "Mera naam Ayush hai" - Wo English option se hi niklega.<br/><br/><b>Q2: Hindi ka text kaise nikale?</b><br/>A: Language me Hindi chuno. Jaise "मेरा नाम आयुष है" - Wo Hindi option se niklega.<br/><br/><b>Q3: Screenshot ka text kyu nahi aata?</b><br/>A: Screenshot ka text bahut chhota aur halka hota hai. Photo ko crop karke sirf text wala hissa rakho, fir Convert dabao. Hamara tool ab auto 2x zoom karta hai.<br/><br/><b>Q4: Kya image server pe jati hai?</b><br/>A: Nahi, 100% private. Image browser me hi rehti hai.</p><p style={{marginTop:"12px"}}>Try Also: <a href="/age-calculator" style={{color:"#ff7a00",fontWeight:700}}>Age Calculator</a> | <a href="/pdf-merge-split" style={{color:"#ff7a00",fontWeight:700}}>PDF Merge</a> | <a href="/bmi-calculator" style={{color:"#ff7a00",fontWeight:700}}>BMI Calculator</a> | <a href="/" style={{color:"#ff7a00",fontWeight:700}}>All Tools</a></p></div>
          </div></section>
        </main>

        <footer style={{borderTop:"1px solid #e8e8ef",background:"white",padding:"32px 0",color:"#747486",fontSize:"13px",lineHeight:1.8}}><div className="container" style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"25px"}}><div><div style={{fontWeight:900,fontSize:"18px",color:"#171725"}}>NEX<span style={{color:"#ff7a00"}}>ORA</span> — Built by Ayush Chauhan</div><div style={{marginTop:"10px",color:"#44445a"}}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{color:"#ff7a00",fontWeight:700}}>ayushchauhan902704@gmail.com</a><br/>📱 Phone: <a href="tel:+919389641559" style={{color:"#ff7a00",fontWeight:700}}>+91 9389641559</a><br/>📍 Dehradun, Uttarakhand, India<br/>🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{color:"#0a66c2",fontWeight:700}}>LinkedIn</a> | <a href="https://www.instagram.com/ius.chauhan" target="_blank" style={{color:"#e1306c",fontWeight:700}}>Instagram: ius.chauhan</a></div></div><div><div style={{display:"flex",gap:"14px",flexWrap:"wrap",fontWeight:700,marginBottom:"8px"}}><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/disclaimer">Disclaimer</a><a href="/sitemap.xml">Sitemap</a></div><div>© 2026 NEXORA Tools - Image to Text No.1</div><div>Made in India 🇮🇳 | 89K+ Users | No Watermark | Last Update: Nov 2026</div><div style={{marginTop:"6px"}}><a href="/" style={{color:"#ff7a00",fontWeight:700}}>← All Tools</a></div></div></div></footer>
      </div>
    </>
  );
}
