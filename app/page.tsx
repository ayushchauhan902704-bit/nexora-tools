"use client";
import { useState } from "react";

const TOOLS = [
  { t:"Background Remover", d:"Remove background from any photo in 5 seconds. Transparent PNG, White / Blue / Red. No Watermark, 100% Free.", h:"/background-remover", c:"IMAGE", img:"/backgroundremover.jpg", tags:["AI","HD"] },
  { t:"Compress Image to Any KB", d:"JPG / PNG / WEBP to 20KB, 50KB, 100KB, 200KB - Exact Size for UPSC, SSC, Bank Form.", h:"/compress-image", c:"IMAGE", img:"/compressimage.png", tags:["Exact KB","Private"] },
  { t:"Passport Photo Maker", d:"Make passport photo in 10 sizes - 20KB, 50KB, Visa, Stamp, 35x45mm. White background.", h:"/passport-size-photo-maker", c:"IMAGE", img:"/passportphotomaker.png", tags:["10 Sizes","Exact KB"] },
  { t:"Video Compressor to Any MB", d:"Compress video to exact 5MB, 10MB, 20MB, 100MB - HD quality, no watermark.", h:"/video-compressor", c:"VIDEO", img:"/videocompressor.jpg", tags:["Exact Size","HD"] },
  { t:"Internet Speed Test - Pro", d:"Check Download, Upload, Ping in 3 Sec - Private & Accurate, no sign-up.", h:"/internet-speed-test", c:"TEXT", img:"/internetspeedtest.jpg", tags:["PRO Meter","Private"] },
  { t:"Image DPI Changer - 72 to 300 DPI", d:"Change JPG, PNG, HEIC DPI to 72, 150, 300, 600 - For Printing, Passport, Exam.", h:"/image-dpi-changer", c:"IMAGE", img:"/imagedpichanger.jpg", tags:["300 DPI","No Watermark"] },
  { t:"Image to Text - OCR Free", d:"Extract text from JPG, PNG in 3 Sec - Fast & Private, no upload to server.", h:"/image-to-text", c:"IMAGE", img:"/imagetotext.jpg", tags:["OCR","Private"] },
  { t:"Text to Speech - 40+ Languages", d:"Convert text to real human voice - 40+ Languages, free download.", h:"/text-to-speech", c:"TEXT", img:"/texttospeech.jpg", tags:["40+ Lang","Real Voice"] },
  { t:"YT Thumbnail Downloader - HD", d:"Download YouTube thumbnail in HD 1280x720 - No watermark.", h:"/yt-thumbnail-downloader", c:"IMAGE", img:"/ytthumbnaildownloader.png", tags:["HD","No Watermark"] },
  { t:"Love Calculator - By Name", d:"Check love compatibility % by names - Fun test, share with friends.", h:"/love-calculator", c:"CALCULATOR", img:"/lovecalculator.jpg", tags:["Viral","Fun"] },
  { t:"JPG to PDF - Best", d:"50 images to single PDF - No watermark, HD quality.", h:"/jpg-to-pdf", c:"PDF", img:"/jpgtopdf.jpg", tags:["50 Photos","HD"] },
  { t:"PDF to JPG - HD", d:"Convert PDF pages to HD JPG images - No watermark, private.", h:"/pdf-to-jpg", c:"PDF", img:"/pdftojpg.png", tags:["HD","Private"] },
  { t:"Instagram Reels Downloader", d:"Download Reels in HD - No watermark, fast, free.", h:"/instagram-reel-downloader", c:"IMAGE", img:"/instagramreelsdownloader.png", tags:["HD","No Watermark"] },
  { t:"QR Code Generator - No.1", d:"Create QR for link, text, WiFi - Instant HD download.", h:"/qr-code-generator", c:"IMAGE", img:"/qrcodegenerator.png", tags:["Instant","HD"] },
  { t:"PDF to Word - HD", d:"Convert PDF to editable Word DOC - Keep formatting, no watermark.", h:"/pdf-to-word", c:"PDF", img:"/pdftoword.png", tags:["Editable","HD"] },
  { t:"Word to PDF - HD", d:"DOCX, DOC to PDF - A4, HD, no watermark.", h:"/word-to-pdf", c:"PDF", img:"/wordtopdf.PNG", tags:["A4 HD","HD"] },
  { t:"PDF Merge & Split", d:"Merge multiple PDFs + Split PDF into pages - Unlimited, free.", h:"/pdf-merge-split", c:"PDF", img:"/pdfmergesplit.PNG", tags:["Unlimited","Free"] },
  { t:"Image to Word - OCR", d:"Scanned PDF, JPG, PNG to editable Word via OCR.", h:"/image-to-word", c:"PDF", img:"/imagetoword.jpg", tags:["OCR","Scanned"] },
  { t:"BMI Calculator", d:"Check Body Mass Index - Healthy weight range, instant result.", h:"/bmi-calculator", c:"CALCULATOR", img:"/bmicalculator.jpg", tags:["Health","Instant"] },
  { t:"Age Calculator", d:"Calculate exact age in years, months, days from DOB.", h:"/age-calculator", c:"CALCULATOR", img:"/agecalculator.jpg", tags:["DOB","Exact"] },
  { t:"Loan EMI Calculator", d:"EMI, Interest, Total Payment - Home, Car, Personal loan.", h:"/loan-emi-calculator", c:"CALCULATOR", img:"/loanemicalculator.jpg", tags:["EMI","Finance"] },
  { t:"Percentage Calculator", d:"Find X% of Y - Quick percent, instant as you type.", h:"/percentage-calculator", c:"CALCULATOR", img:"/percentagecalculator.jpg", tags:["Instant","Fast"] },
  { t:"Discount Calculator", d:"Original price, discount %, final price + savings.", h:"/discount-calculator", c:"CALCULATOR", img:"/discountcalculator.jpg", tags:["Savings"] },
  { t:"Date Difference Calculator", d:"Days between two dates - Age, duration, countdown.", h:"/date-difference-calculator", c:"CALCULATOR", img:"/datedifferencecalculator.jpg", tags:["Duration"] },
  { t:"Word Counter - Private", d:"Count words, characters, sentences instant - Private, no upload.", h:"/word-counter", c:"TEXT", img:"/wordcounter.jpg", tags:["Instant","Private"] },
  { t:"Character Counter", d:"Char count with & without spaces - For social media, exam.", h:"/character-counter", c:"TEXT", img:"/charactercounter.jpg", tags:["Social"] },
  { t:"AI Text Humanizer", d:"Make AI text sound human - Bypass detectors, natural writing.", h:"/ai-text-humanizer", c:"TEXT", img:"/aitexthumanizer.jpg", tags:["AI","Humanize"] },
  { t:"Unit Converter - Instant", d:"km to miles, kg to lbs, C to F - Instant as you type.", h:"/unit-converter", c:"TEXT", img:"/unitconverter.jpg", tags:["Instant","All Units"] },
  { t:"Password Generator", d:"Generate strong, secure random passwords - Private.", h:"/password-generator", c:"TEXT", img:"/passwordgenerator.jpg", tags:["Secure"] },
  { t:"Resume Builder - ATS", d:"Make ATS resume in 2 mins - PDF download, no watermark.", h:"/resume-builder", c:"TEXT", img:"/resumebuilder.jpg", tags:["ATS HD","PDF"] },
];

const CATS = ["ALL","IMAGE","PDF","CALCULATOR","TEXT","VIDEO"];

export default function Home(){
  const [q,setQ]=useState("");
  const [cat,setCat]=useState("ALL");
  const filtered = TOOLS.filter(x=>{
    const mCat = cat==="ALL" || x.c===cat;
    const mQ = (x.t+" "+x.d).toLowerCase().includes(q.toLowerCase());
    return mCat && mQ;
  });
  return (
    <div style={{background:"#ffffff", color:"#111827", fontFamily:"Inter, system-ui, sans-serif"}}>
      <header style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #e5e7eb", position:"sticky", top:0, background:"#fff", zIndex:10}}>
        <a href="/" style={{fontWeight:800, fontSize:22, color:"#111827", textDecoration:"none"}}>NEXORA<span style={{color:"#2563eb"}}>.</span></a>
        <nav style={{display:"flex", gap:18}}><a href="/" style={{color:"#111827", textDecoration:"none"}}>Home</a><a href="/about" style={{color:"#111827", textDecoration:"none"}}>About</a><a href="/contact" style={{color:"#111827", textDecoration:"none"}}>Contact</a></nav>
        <a href="#tools" style={{background:"#2563eb", color:"#fff", padding:"10px 16px", borderRadius:10, textDecoration:"none", fontWeight:600}}>Explore Tools →</a>
      </header>

      <section style={{padding:"40px 20px", textAlign:"center", maxWidth:900, margin:"0 auto"}}>
        <span style={{background:"#eff6ff", color:"#2563eb", padding:"6px 12px", borderRadius:20, fontSize:12, fontWeight:700}}>30 FREE TOOLS • NO WATERMARK • 100% PRIVATE</span>
        <h1 style={{fontSize:42, lineHeight:1.1, margin:"16px 0 12px"}}>Every Tool You Need.<br/><span style={{color:"#2563eb"}}>In One Place.</span></h1>
        <p style={{fontSize:17, color:"#4b5563", lineHeight:1.7}}>Compress Image to Any KB • Video Compressor to Exact MB • Image to Text OCR • Text to Speech 40+ Languages • PDF Tools HD — No Watermark, Trusted Worldwide</p>
        <div style={{display:"flex", gap:12, justifyContent:"center", marginTop:20, flexWrap:"wrap"}}>
          <a href="#tools" style={{background:"#2563eb", color:"#fff", padding:"12px 20px", borderRadius:10, textDecoration:"none", fontWeight:600}}>Explore All Tools →</a>
          <a href="/compress-image" style={{border:"1px solid #d1d5db", color:"#111827", padding:"12px 20px", borderRadius:10, textDecoration:"none", fontWeight:600}}>Compress Image to 20KB</a>
        </div>
      </section>

      <section style={{maxWidth:900, margin:"0 auto", padding:"0 20px 30px", textAlign:"center"}}>
        <h2 style={{fontSize:24, marginBottom:8}}>Founded by Ayush Chauhan</h2>
        <video src="/ayushchauhan.mp4" controls style={{width:"100%", maxWidth:700, borderRadius:16, border:"1px solid #e5e7eb"}} />
        <p style={{fontSize:15, color:"#4b5563", lineHeight:1.7, marginTop:12}}>Hi, main Ayush Chauhan, THE NEXORA TOOLS ka founder. Maine ye site aapke liye banayi hai - saare tools 100% free hai, no sign-up, no watermark.</p>
        <p style={{fontSize:15, color:"#4b5563", lineHeight:1.7}}><b>THE NEXORA TOOLS</b> is a free tools website. No sign-up, no watermark, 100% free. Made for students, creators and small business owners in India and worldwide.</p>
      </section>

      <section id="tools" style={{maxWidth:1100, margin:"0 auto", padding:"20px"}}>
        <h2 style={{fontSize:28}}>Find Your Tool <span style={{color:"#6b7280"}}>In Seconds.</span></h2>
        <p style={{color:"#4b5563"}}>Search from 30 powerful tools. Everything runs in your browser - fast, private & free forever.</p>
        <div style={{display:"flex", gap:10, margin:"16px 0", flexWrap:"wrap"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search 30 tools... e.g. compress image to 50kb, jpg to pdf..." style={{flex:1, minWidth:220, padding:"12px", borderRadius:10, border:"1px solid #d1d5db"}} />
          <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>{CATS.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"10px 14px", borderRadius:20, border:"1px solid #d1d5db", background:cat===c?"#111827":"#fff", color:cat===c?"#fff":"#111827", cursor:"pointer"}}>{c}</button>)}</div>
        </div>
        <p style={{fontSize:13, color:"#6b7280"}}>{filtered.length} TOOLS FOUND</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16, marginTop:16}}>
          {filtered.map((t)=>(
            <a key={t.t} href={t.h} style={{border:"1px solid #e5e7eb", borderRadius:16, overflow:"hidden", textDecoration:"none", color:"#111827", background:"#fff"}}>
              <img src={t.img} alt={`${t.t} - Free Online Tool by THE NEXORA TOOLS`} style={{width:"100%", height:170, objectFit:"cover"}} />
              <div style={{padding:16}}>
                <span style={{fontSize:11, fontWeight:700, color:"#2563eb"}}>{t.c}</span>
                <h3 style={{fontSize:18, margin:"6px 0"}}>{t.t}</h3>
                <p style={{fontSize:14, color:"#4b5563", lineHeight:1.7}}>{t.d}</p>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12}}>
                  <span style={{fontSize:12, color:"#6b7280"}}>{t.tags.join(" • ")}</span>
                  <span style={{fontWeight:700, color:"#2563eb"}}>OPEN →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section style={{maxWidth:1100, margin:"30px auto", padding:"0 20px"}}>
        <h2>Why THE NEXORA TOOLS is No.1?</h2>
        <p style={{color:"#4b5563", lineHeight:1.7}}>Unlike other sites with watermarks, limits and server uploads, we give 100% free, private, HD tools that run in your browser. Your files never leave your device.</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(250px, 1fr))", gap:16, marginTop:16}}>
          <div style={{border:"1px solid #e5e7eb", borderRadius:12, padding:16}}><b>01 - 100% Private</b><p style={{color:"#4b5563", lineHeight:1.7}}>Files never upload to server. 100% browser processing.</p></div>
          <div style={{border:"1px solid #e5e7eb", borderRadius:12, padding:16}}><b>02 - Exact KB / MB Size</b><p style={{color:"#4b5563", lineHeight:1.7}}>20KB, 50KB, 10MB - exact size, not random %.</p></div>
          <div style={{border:"1px solid #e5e7eb", borderRadius:12, padding:16}}><b>03 - No Watermark HD</b><p style={{color:"#4b5563", lineHeight:1.7}}>HD quality, zero watermark, forever free.</p></div>
        </div>
      </section>

      <footer style={{borderTop:"1px solid #e5e7eb", padding:"30px 20px", marginTop:30}}>
        <div style={{maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:20}}>
          <div><b style={{fontSize:20}}>NEXORA.</b><p style={{color:"#4b5563", maxWidth:300}}>30 free tools trusted worldwide. Fast, Private Browser-Based, No Watermark HD.</p><a href="mailto:ayushchauhan902704@gmail.com" style={{color:"#2563eb"}}>ayushchauhan902704@gmail.com</a></div>
          <div><h4>Popular Tools</h4><p><a href="/image-to-text">Image to Text OCR</a></p><p><a href="/video-compressor">Video Compressor</a></p><p><a href="/passport-size-photo-maker">Passport Photo</a></p></div>
          <div><h4>Legal</h4><p><a href="/about">About Us</a></p><p><a href="/contact">Contact</a></p><p><a href="/privacy">Privacy Policy</a></p><p><a href="/terms">Terms</a></p></div>
        </div>
        <p style={{textAlign:"center", color:"#6b7280", marginTop:20}}>© 2026 THE NEXORA TOOLS • 30 Tools Free Forever • Founded by Ayush Chauhan</p>
      </footer>
    </div>
  );
}
