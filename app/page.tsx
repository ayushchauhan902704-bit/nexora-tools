"use client";
import { useState } from "react";

const TOOLS = [
  { t:"Internet Speed Test - Pro", d:"Check Download, Upload, Ping in 3 Sec - Private & Accurate", h:"/internet-speed-test", c:"TEXT", icon:"⚡", tags:["PRO Meter","Private"] },
  { t:"Image to Text - OCR Free", d:"Extract Text From JPG, PNG in 3 Sec - Fast & Private", h:"/image-to-text", c:"IMAGE", icon:"🔤", tags:["OCR","Private"] },
  { t:"Video Compressor to Any MB", d:"Compress Video to Exact 5MB, 10MB, 20MB, 100MB - HD", h:"/video-compressor", c:"VIDEO", icon:"🎬", tags:["Exact Size","HD"] },
  { t:"Text to Speech - 40+ Languages", d:"Convert Text to Real Human Voice - 40+ Languages", h:"/text-to-speech", c:"TEXT", icon:"🌍", tags:["40+ Lang","Real Voice"] },
  { t:"YT Thumbnail Downloader - HD", d:"Download YouTube Thumbnail in HD 1280x720", h:"/yt-thumbnail-downloader", c:"IMAGE", icon:"🖼️", tags:["HD","No Watermark"] },
  { t:"Love Calculator - By Name", d:"Check Love Compatibility % By Names - Fun Test", h:"/love-calculator", c:"CALCULATOR", icon:"❤️", tags:["Viral","Fun"] },
  { t:"Passport Photo Maker", d:"10 Sizes - 20KB, 50KB, Visa, Stamp, 35x45mm", h:"/passport-size-photo", c:"IMAGE", icon:"📸", tags:["10 Sizes","Exact KB"] },
  { t:"Background Remover", d:"Remove BG in 1 Click - HD, Transparent, White, Blue", h:"/background-remover", c:"IMAGE", icon:"🖼️", tags:["AI","HD"] },
  { t:"Compress Image to Any KB", d:"JPG/PNG/WEBP to 20KB, 50KB, 100KB, 200KB - Exact Size", h:"/compress-image", c:"IMAGE", icon:"🗜️", tags:["Exact KB","Private"] },
  { t:"JPG to PDF - Best", d:"50 Images to Single PDF - No Watermark HD", h:"/jpg-to-pdf", c:"PDF", icon:"📷", tags:["50 Photos","HD"] },
  { t:"PDF to JPG - HD", d:"Convert PDF Pages to HD JPG Images - No Watermark", h:"/pdf-to-jpg", c:"PDF", icon:"🖼️", tags:["HD","Private"] },
  { t:"Instagram Reels Downloader", d:"Download Reels in HD - No Watermark, Fast", h:"/instagram-reels-downloader", c:"IMAGE", icon:"🎬", tags:["HD","No Watermark"] },
  { t:"QR Code Generator - No.1", d:"Create QR for Link, Text, WiFi - Instant HD Download", h:"/qr-code-generator", c:"IMAGE", icon:"🔳", tags:["Instant","HD"] },
  { t:"PDF to Word - HD", d:"Convert PDF to Editable Word DOC - Keep Formatting", h:"/pdf-to-word", c:"PDF", icon:"📄", tags:["Editable","HD"] },
  { t:"Word to PDF - HD", d:"DOCX, DOC to PDF - A4, HD, No Watermark", h:"/word-to-pdf", c:"PDF", icon:"📄", tags:["A4 HD","HD"] },
  { t:"PDF Merge & Split", d:"Merge Multiple PDFs + Split PDF into Pages - Unlimited", h:"/pdf-merge-split", c:"PDF", icon:"📚", tags:["Unlimited","Free"] },
  { t:"Image to Word - OCR", d:"Scanned PDF, JPG, PNG to Editable Word via OCR", h:"/image-to-word", c:"PDF", icon:"🔍", tags:["OCR","Scanned"] },
  { t:"BMI Calculator", d:"Check Body Mass Index - Healthy Weight Range", h:"/bmi-calculator", c:"CALCULATOR", icon:"🧍", tags:["Health","Instant"] },
  { t:"Age Calculator", d:"Calculate Exact Age in Years, Months, Days", h:"/age-calculator", c:"CALCULATOR", icon:"📅", tags:["DOB","Exact"] },
  { t:"Loan EMI Calculator", d:"EMI, Interest, Total Payment - Home, Car, Personal", h:"/loan-emi-calculator", c:"CALCULATOR", icon:"🏦", tags:["EMI","Finance"] },
  { t:"Percentage Calculator", d:"Find X% of Y - Quick Percent Instant As You Type", h:"/percentage-calculator", c:"CALCULATOR", icon:"%", tags:["Instant","Fast"] },
  { t:"Discount Calculator", d:"Original Price, Discount %, Final Price + Savings", h:"/discount-calculator", c:"CALCULATOR", icon:"🏷️", tags:["Savings"] },
  { t:"Date Difference / Days Calc", d:"Days Between Two Dates - Age, Duration", h:"/date-difference", c:"CALCULATOR", icon:"⏱️", tags:["Duration"] },
  { t:"Word Counter - Private", d:"Count Words, Characters, Sentences Instant - Private", h:"/word-counter", c:"TEXT", icon:"🔤", tags:["Instant","Private"] },
  { t:"Character Counter", d:"Char Count With & Without Spaces - For Social", h:"/character-counter", c:"TEXT", icon:"🔡", tags:["Social"] },
  { t:"AI Text Humanizer", d:"Make AI Text Sound Human - Bypass Detectors", h:"/ai-text-humanizer", c:"TEXT", icon:"🤖", tags:["AI","Humanize"] },
  { t:"Unit Converter - Instant", d:"km to miles, kg to lbs, C to F - Instant As You Type", h:"/unit-converter", c:"TEXT", icon:"🌡️", tags:["Instant","All Units"] },
  { t:"Password Generator", d:"Generate Strong, Secure Random Passwords", h:"/password-generator", c:"TEXT", icon:"🔑", tags:["Secure"] },
  { t:"Resume Builder - ATS", d:"Make ATS Resume in 2 Mins - PDF Download No Watermark", h:"/resume-builder", c:"TEXT", icon:"📝", tags:["ATS HD","PDF"] },
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
    <div className="nexora">
      <div className="ambient ambientOne"></div><div className="ambient ambientTwo"></div>
      <header className="siteHeader">
        <a href="/" className="brand"><span className="brandMark">N</span>NEXORA<span className="brandDot">.</span></a>
        <nav className="navLinks"><a href="/" className="navActive">Home</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a></nav>
        <a href="#tools" className="headerCta">Explore Tools →</a>
      </header>

      <section className="hero">
        <span className="heroEyebrow"><span className="liveDot"></span> 29 FREE TOOLS • NO WATERMARK • 100% PRIVATE</span>
        <h1>Every Tool You Need.<br/><span className="gradientText">In One Place.</span></h1>
        <p className="heroCopy">Compress Image to Any KB • Video Compressor to Exact MB • Image to Text OCR • Text to Speech 40+ Languages • PDF Tools HD — No Watermark, Trusted Worldwide</p>
        <div className="heroActions"><a href="#tools" className="primaryButton">Explore All Tools →</a><a href="/compress-image" className="secondaryButton">Compress Image to 20KB</a></div>
        <div className="heroVisual">
          <div className="visualGlow"></div>
          <div className="visualTop"><span className="windowDots"><i></i><i></i><i></i></span><span>NEXORA • ALL TOOLS</span><span className="visualStatus"><b></b> LIVE</span></div>
          <div className="visualMain">
            <div className="visualCopy"><span className="miniLabel">MOST POPULAR</span><strong>Compress to <em>Exact KB</em><br/>in 3 Seconds.</strong><p>100% browser-based. Your files never leave your device.</p></div>
            <div className="floatingTiles">
              <div className="floatTile tileA"><span>🗜️</span><b>Image to 20KB</b><small>Exact Size • HD</small></div>
              <div className="floatTile tileB"><span>🎬</span><b>Video to 10MB</b><small>Exact MB • HD Audio</small></div>
              <div className="floatTile tileC"><span>🔤</span><b>Image to Text OCR</b><small>3 Sec • Private</small></div>
            </div>
          </div>
          <div className="visualBottom"><span>29 TOOLS</span><span>96K+ USERS</span><span>100% FREE</span></div>
        </div>
        <div className="heroMetrics"><div><strong>29+</strong><span>Free Tools</span></div><div><strong>96K+</strong><span>Happy Users</span></div><div><strong>100%</strong><span>Private</span></div><div><strong>0</strong><span>Watermark</span></div></div>
      </section>

      <section className="toolsSection" id="tools">
        <div className="sectionHeading"><div><span className="sectionKicker">● ALL TOOLS</span><h2>Find Your Tool<br/><span className="mutedHeading">In Seconds.</span></h2></div><p>Search from 29 powerful tools. Everything runs in your browser - fast, private & free forever.</p></div>
        <div className="toolControls">
          <div className="searchBox"><span>⌕</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search 29 tools... e.g. compress image to 50kb, jpg to pdf..." /><button onClick={()=>setQ("")}>×</button></div>
          <div className="categoryList">{CATS.map(c=><button key={c} onClick={()=>setCat(c)} className={`categoryPill ${cat===c?'selected':''}`}>{c}</button>)}</div>
        </div>
        <div className="resultsLine"><span>{filtered.length} TOOLS FOUND</span><span>Showing <b>{filtered.length} / 29</b></span></div>
        <div className="toolGrid">
          {filtered.map((t,i)=>(
            <a key={t.t} href={t.h} className="toolCard" style={{'--card-index':i} as any}>
              <div className="cardTop"><span className="toolIcon">{t.icon}</span><span className="cardArrow">↗</span></div>
              <span className="cardCategory">{t.c}</span><h3>{t.t}</h3><p>{t.d}</p>
              <div className="cardBottom"><div className="tagList">{t.tags.map(tag=><span key={tag}>{tag}</span>)}</div><span className="openLabel">OPEN <b>→</b></span></div>
            </a>
          ))}
        </div>
        {filtered.length===0 && <div className="emptyState"><span>🔍</span><h3>No tool found</h3><p>Try different keyword like compress, pdf, qr</p><button onClick={()=>{setQ("");setCat("ALL")}}>Show All Tools</button></div>}
      </section>

      <section className="guidesSection">
        <div className="guidesIntro"><span className="sectionKicker">● GUIDES</span><h2>Compression Guides by Size</h2><p>Learn how to compress images to exact KB for any requirement</p></div>
        <div className="guideGrid">
          {["20KB","30KB","50KB","100KB","200KB","500KB"].map((g,i)=>(<a key={g} href={`/blog/how-to-compress-image-to-${g.toLowerCase()}/`} className="guideCard"><span className="guideNumber">0{i+1}</span>📄 Compress Image to {g} <b>→</b></a>))}
        </div>
      </section>

      <section className="whySection"><div className="whyOrb"></div>
        <div className="whyContent"><span className="sectionKicker lightKicker">● WHY NEXORA?</span><h2>Why NEXORA is <span>No.1?</span></h2><p>Unlike other sites with watermarks, limits and server uploads, we give 100% free, private, HD tools that run in your browser. Your files never leave your device. Best alternative to ilovepdf, tinypng, smallpdf.</p></div>
        <div className="whyPoints"><div><span>01</span><div><b>100% Private</b><p>Files never upload to server. 100% browser processing.</p></div></div><div><span>02</span><div><b>Exact KB / MB Size</b><p>20KB, 50KB, 10MB - exact size, not random %.</p></div></div><div><span>03</span><div><b>No Watermark HD</b><p>HD quality, zero watermark, forever free.</p></div></div></div>
      </section>

      <footer className="footer">
        <div className="footerMain">
          <div className="footerBrand"><a href="/" className="brand"><span className="brandMark">N</span>NEXORA<span className="brandDot">.</span></a><p style={{marginTop:12}}>29 free tools trusted worldwide. Fast, Private Browser-Based, No Watermark HD.</p><a className="emailLink" href="mailto:ayushchauhan902704@gmail.com">ayushchauhan902704@gmail.com</a></div>
          <div><h4>Popular Tools</h4><a href="/image-to-text">Image to Text OCR</a><a href="/video-compressor">Video Compressor</a><a href="/text-to-speech">Text to Speech</a><a href="/passport-size-photo">Passport Photo</a></div>
          <div><h4>PDF Tools HD</h4><a href="/pdf-to-word">PDF to Word</a><a href="/word-to-pdf">Word to PDF</a><a href="/pdf-merge-split">Merge & Split PDF</a><a href="/jpg-to-pdf">JPG to PDF</a></div>
          <div><h4>Legal</h4><a href="/about">About Us</a><a href="/contact">Contact</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms</a></div>
        </div>
        <div className="footerBottom"><span>© 2026 NEXORA Tools • 29 Tools Free Forever</span><span>No Watermark HD • Private & Secure</span></div>
      </footer>
    </div>
  );
}
