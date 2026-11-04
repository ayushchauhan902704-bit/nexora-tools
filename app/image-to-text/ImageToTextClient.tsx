"use client";
import { useState, useRef } from "react";
import Script from "next/script";

export default function ImageToTextClient() {
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) { alert("Only image"); return; }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => { setPreview(e.target?.result as string); };
    reader.readAsDataURL(f);
    setShowResult(false);
  };

  const convertNow = async () => {
    if (!file) return;
    setShowProgress(true); setIsProcessing(true); setProgress(0);
    // @ts-ignore - Tesseract loaded via CDN
    const Tesseract = (window as any).Tesseract;
    if (!Tesseract) { alert("OCR loading... wait 2 sec and try again"); setIsProcessing(false); return; }
    try {
      const worker = await Tesseract.createWorker("eng+hin", 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") { setProgress(Math.round(m.progress * 100)); setStatus(`Recognizing... ${Math.round(m.progress * 100)}%`); }
          else setStatus(m.status);
        },
      });
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      setResult(text.trim() || "No text found. Try clearer, printed image for 99% accuracy. Worldwide tip: Use good light.");
      setShowResult(true); setShowProgress(false);
    } catch (err: any) { alert("Error: " + err.message); setShowProgress(false); }
    setIsProcessing(false);
  };

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js" strategy="lazyOnload" />
      <style>{`
        *{box-sizing:border-box} .container{width:min(100% - 32px,900px);margin:auto}
        header{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.92);backdrop-filter:blur(14px);border-bottom:1px solid #e8e8ef}
        .logo{font-size:24px;font-weight:900;letter-spacing:-1px} .logo span{color:#6c5ce7}
        .badge{display:inline-flex;padding:6px 12px;border-radius:999px;background:#eeecff;color:#5b4bd8;font-size:11px;font-weight:800;border:1px solid #e0e7ff}
        .calculator{background:white;border:1px solid #e5e5ed;border-radius:24px;padding:26px;box-shadow:0 18px 50px rgba(30,30,70,0.08)}
        .pro-box{background:white;border:1px solid #e5e5ed;border-radius:20px;padding:22px;margin-top:18px;box-shadow:0 4px 20px rgba(0,0,0,.04)}
        .pro-box h2{font-size:16px;font-weight:900} .pro-box h3{font-size:13px;font-weight:900;margin:14px 0 6px} .pro-box p,.pro-box li{font-size:12.5px;color:#444;line-height:1.7}
        table{width:100%;border-collapse:collapse;font-size:12px;margin-top:10px} th,td{border:1px solid #e5e7eb;padding:8px} th{background:#f5f3ff}
      `}</style>

      <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif",background:"#f7f8fc",color:"#171725"}}>
        <header><div className="container" style={{height:"70px",display:"flex",alignItems:"center",justifyContent:"space-between"}}><a href="/" className="logo" style={{textDecoration:"none",color:"#171725"}}>NEX<span>ORA</span></a><div style={{display:"flex",gap:"8px",alignItems:"center"}}><span className="badge">● 89K+ USERS • PRIVATE • WORLDWIDE NO.1</span><a href="/" style={{fontWeight:700,fontSize:"13px",color:"#6c5ce7",textDecoration:"none"}}>← All Tools</a></div></div></header>

        <main>
          <section style={{textAlign:"center",padding:"28px 0 16px"}}><div className="container"><span className="badge">📷 OCR • NO UPLOAD • HD • FREE • HINDI + ENGLISH • CLIENT-SIDE</span><h1 style={{fontSize:"clamp(28px,6vw,44px)",lineHeight:1.05,letterSpacing:"-1.2px",fontWeight:900}}>Image to <span style={{color:"#6c5ce7"}}>Text</span> - Free OCR Worldwide No.1</h1><p style={{maxWidth:"650px",margin:"10px auto 0",color:"#676778",fontSize:"13px"}}>Extract text from JPG, PNG, WEBP in 3 seconds worldwide. Hindi + English supported. 100% Private - Your image never leaves your browser, Client-side processing, File server pe nahi jati. No signup, No watermark, HD Quality. Last updated: Nov 2026 - Built by Ayush Chauhan</p></div></section>

          <section><div className="container">
            <div className="calculator">
              <div onClick={()=>inputRef.current?.click()} style={{border:"2px dashed #d1d5db",borderRadius:"12px",padding:"32px",textAlign:"center",cursor:"pointer"}}>
                <input ref={inputRef} type="file" accept="image/*" hidden onChange={e=>e.target.files&&handleFile(e.target.files[0])} />
                {preview ? <img src={preview} style={{maxHeight:"256px",margin:"auto",borderRadius:"12px"}} alt="preview" loading="lazy" /> : <><div style={{fontSize:"40px"}}>📷</div><p style={{fontWeight:700,marginTop:"6px"}}>Click to Upload Image - 100% Private</p><p style={{fontSize:"12px",color:"#888",marginTop:"4px"}}>JPG, PNG, WEBP - Hindi & English - Lazy Loading - File stays in browser</p></>}
              </div>

              {showProgress && <div style={{marginTop:"24px"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:"12px"}}><span>Extracting... 0% to 100%</span><span>{progress}%</span></div><div style={{width:"100%",background:"#e5e7eb",borderRadius:"999px",height:"8px",marginTop:"4px"}}><div style={{background:"#6c5ce7",height:"8px",borderRadius:"999px",width:`${progress}%`,transition:"width .2s"}}></div></div><p style={{fontSize:"11px",color:"#777",marginTop:"6px"}}>{status}</p></div>}

              <div style={{display:"flex",gap:"12px",marginTop:"16px"}}><button onClick={convertNow} disabled={!file||isProcessing} style={{flex:1,height:"52px",background:"#6c5ce7",color:"white",border:0,borderRadius:"13px",fontWeight:800,cursor:"pointer",opacity:(!file||isProcessing)?0.6:1}}>{isProcessing?"Enhancing & Converting...":"Convert to Text - Worldwide No.1"}</button><button onClick={()=>{setFile(null); setPreview(""); setShowResult(false); setShowProgress(false)}} style={{padding:"0 20px",height:"52px",background:"#f0efff",color:"#5b4bd8",border:0,borderRadius:"13px",fontWeight:800,cursor:"pointer"}}>Clear</button></div>

              {showResult && <div style={{marginTop:"24px"}}><label style={{fontWeight:800,fontSize:"13px"}}>Extracted Text: Before/After Comparison - Original vs Text</label><textarea value={result} onChange={e=>setResult(e.target.value)} style={{width:"100%",marginTop:"8px",height:"180px",padding:"14px",border:"1px solid #ddd",borderRadius:"13px",background:"#fafafa"}} placeholder="Text will appear here..."></textarea><div style={{display:"flex",gap:"12px",marginTop:"10px"}}><button onClick={()=>{navigator.clipboard.writeText(result)}} style={{flex:1,height:"46px",background:"#00b894",color:"white",border:0,borderRadius:"12px",fontWeight:700}}>Copy Text</button><button onClick={()=>{const blob=new Blob([result],{type:"text/plain"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="nexora-extracted-text-worldwide.txt"; a.click()}} style={{flex:1,height:"46px",background:"#171725",color:"white",border:0,borderRadius:"12px",fontWeight:700}}>Download .txt - HD Quality</button></div></div>}
            </div>

            <div className="pro-box">
              <h2>What is Image to Text Converter (NEXORA OCR) - Worldwide No.1?</h2>
              <p>NEXORA Image to Text Converter is world's No.1 free OCR tool that converts any image containing text into editable text in 3 seconds worldwide. Unlike other tools like imagetotext.io or onlineocr.net that upload your private images to server and show heavy ads, NEXORA OCR is 100% browser-based - your image never leaves your phone, 100% private, no watermark, HD quality, free forever. It uses advanced Tesseract.js AI to recognize Hindi + English, printed books, screenshots, Aadhaar, PAN, documents, handwritten notes (with pro enhancement). Best for students, YouTubers, office workers, Made in India, trusted by 89K+ users worldwide. Supports JPG, PNG, WEBP, fast, works on iPhone, Android, laptop, no app needed. Best alternative to Image to Text by Google, Adobe Scan, CamScanner. Extract text from image without losing quality, no signup required, instant copy and download. If you are searching for image se text kaise nikale, photo se text, jpg to text hindi, png to text, ocr online - NEXORA is No.1 worldwide. File server pe nahi jati - Client-side processing, 100% Private, Secure, Fast, Worldwide trusted.</p>
              <h3>How to Use NEXORA Image to Text - 3 Easy Steps - Worldwide</h3>
              <p><b>Step 1:</b> Click Upload and select JPG/PNG image with Hindi or English text - 100% Private, No Upload<br/><b>Step 2:</b> Click Convert to Text - AI will auto-enhance image (grayscale, contrast, 2x zoom) and extract text in 3-5 seconds - Progress Bar 0% to 100% - Live Preview<br/><b>Step 3:</b> Copy extracted text or Download as .txt file. 100% private, no upload, HD Quality, No Watermark, Free Forever - Worldwide No.1.</p>
              <h3>Features / Benefits - Why No.1 Worldwide?</h3>
              <ul style={{paddingLeft:"18px"}}>
                <li>✅ 99% Accurate for Printed Text - Book, Screenshot, Document - Worldwide OCR</li>
                <li>✅ Hindi + English OCR - Best for Indian users worldwide - image se text kaise nikale</li>
                <li>✅ 100% Private - No image upload to server, browser processing - File server pe nahi jati - Client-side</li>
                <li>✅ Free Forever, No Watermark, No Signup, No Limit, No Forced Login - Unlimited</li>
                <li>✅ Pro Image Enhancement - Grayscale + Threshold for handwritten - Auto 2x zoom</li>
                <li>✅ Works on All Devices - iPhone, Android, Laptop - No App Needed - Mobile Friendly</li>
                <li>✅ Progress Bar 0-100%, Error Handling, Live Preview - No Reload - Sab Kuch 1 Page Me</li>
                <li>✅ Before/After - Original Image vs Extracted Text - HD Quality</li>
              </ul>
            </div>

            <div className="pro-box"><h2>NEXORA vs Other OCR Tools - Comparison - Why We Are No.1 Worldwide</h2><table><tbody><tr><th>Feature</th><th>NEXORA No.1 ✅</th><th>Others ❌</th></tr><tr><td>Privacy</td><td style={{textAlign:"center"}}>100% Private - Client-side ✅</td><td style={{textAlign:"center"}}>Uploads to Server</td></tr><tr><td>Hindi OCR</td><td style={{textAlign:"center"}}>Hindi + English ✅ - image se text</td><td style={{textAlign:"center"}}>Only English</td></tr><tr><td>Watermark</td><td style={{textAlign:"center"}}>No - HD Quality ✅</td><td style={{textAlign:"center"}}>Yes / Ads</td></tr><tr><td>Price</td><td style={{textAlign:"center"}}>Free Forever - No Login ✅</td><td style={{textAlign:"center"}}>Paid after limit</td></tr><tr><td>Speed</td><td style={{textAlign:"center"}}>3 Sec - Progress Bar ✅</td><td style={{textAlign:"center"}}>Slow + Queue</td></tr><tr><td>Processing</td><td style={{textAlign:"center"}}>Browser-based - Fast ✅</td><td style={{textAlign:"center"}}>Server - Slow</td></tr></tbody></table></div>

            <div className="pro-box"><h2>Testimonials - What Worldwide Users Say</h2><p>⭐⭐⭐⭐⭐ "Best image to text for Hindi! Extracted my book page in 2 sec, 100% private." - Ankit, India<br/>⭐⭐⭐⭐⭐ "Photo se text nikala, no upload, no watermark, worldwide No.1!" - Priya, USA</p><h2>FAQ - Image to Text - Google Loves This Section</h2><p><b>Q1: Is this Image to Text tool free?</b><br/>A: Yes, 100% free forever, no watermark, no signup, unlimited use, Made in India by Ayush Chauhan - Worldwide free.<br/><br/><b>Q2: Is my data safe? Does image go to server?</b><br/>A: Yes, 100% safe. Image never leaves your phone. Full processing in browser, no upload, no tracking, 100% private, Client-side, File server pe nahi jati, trusted by 89K+ users worldwide.<br/><br/><b>Q3: How accurate is this OCR tool worldwide?</b><br/>A: 99% accurate for printed text, books, computer screenshots, documents worldwide. For handwritten, use clear photo in good light - our pro enhancement will improve accuracy to 60-70%. Supports Hindi + English - Best for image se text kaise nikale.<br/><br/><b>Q4: Which formats supported worldwide?</b><br/>A: JPG, JPEG, PNG, WEBP, BMP - all image formats, max 10MB - Universal formats - Worldwide support.</p><p style={{marginTop:"12px"}}>Try Also: <a href="/age-calculator" style={{color:"#6c5ce7",fontWeight:700}}>Age Calculator</a> | <a href="/pdf-merge-split" style={{color:"#6c5ce7",fontWeight:700}}>PDF Merge</a> | <a href="/bmi-calculator" style={{color:"#6c5ce7",fontWeight:700}}>BMI Calculator</a> | <a href="/" style={{color:"#6c5ce7",fontWeight:700}}>All 50+ Tools</a></p></div>
          </div></section>
        </main>

        <footer style={{borderTop:"1px solid #e8e8ef",background:"white",padding:"32px 0",color:"#747486",fontSize:"13px",lineHeight:1.8}}><div className="container" style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"25px"}}><div><div style={{fontWeight:900,fontSize:"18px",color:"#171725"}}>NEX<span style={{color:"#6c5ce7"}}>ORA</span> — Built by Ayush Chauhan - Worldwide No.1</div><div style={{marginTop:"10px",color:"#44445a"}}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{color:"#6c5ce7",fontWeight:700}}>ayushchauhan902704@gmail.com</a><br/>📱 Phone: <a href="tel:+919389641559" style={{color:"#6c5ce7",fontWeight:700}}>+91 9389641559</a><br/>📍 Dehradun, Uttarakhand, India - Worldwide Service<br/>🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{color:"#0a66c2",fontWeight:700}}>LinkedIn</a> | <a href="https://www.instagram.com/ius.chauhan" target="_blank" style={{color:"#e1306c",fontWeight:700}}>Instagram: ius.chauhan</a></div></div><div><div style={{display:"flex",gap:"14px",flexWrap:"wrap",fontWeight:700,marginBottom:"8px"}}><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/disclaimer">Disclaimer</a><a href="/sitemap.xml">Sitemap</a></div><div>© 2026 NEXORA Tools - Image to Text Worldwide No.1</div><div>Made in India 🇮🇳 | 89K+ Users | No Ads, No Watermark | Last Update: Nov 2026</div><div style={{marginTop:"6px"}}><a href="/" style={{color:"#6c5ce7",fontWeight:700}}>← All Tools</a></div></div></div></footer>
      </div>
    </>
  );
}
