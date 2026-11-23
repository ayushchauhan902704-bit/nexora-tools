"use client";
import { useState } from "react";

const TOOLS = [
  { t:"Background Remover", d:"Remove background from any photo in 5 seconds. Transparent PNG, White / Blue / Red. No watermark, 100% free.", h:"/background-remover", c:"IMAGE", img:"/backgroundremover.jpg", tags:["AI","HD"] },
  { t:"Compress Image to Any KB", d:"JPG / PNG / WEBP to 20KB, 50KB, 100KB, 200KB - Exact size for UPSC, SSC, Bank forms.", h:"/compress-image", c:"IMAGE", img:"/compressimage.png", tags:["Exact KB","Private"] },
  { t:"Passport Photo Maker", d:"Make passport photo in 10 sizes - 20KB, 50KB, Visa, Stamp, 35x45mm. White background.", h:"/passport-size-photo-maker", c:"IMAGE", img:"/passportphotomaker.png", tags:["10 Sizes","Exact KB"] },
  { t:"Video Compressor to Any MB", d:"Compress video to exact 5MB, 10MB, 20MB, 100MB - HD quality, no watermark.", h:"/video-compressor", c:"VIDEO", img:"/videocompressor.jpg", tags:["Exact Size","HD"] },
  { t:"Internet Speed Test - Pro", d:"Check download, upload, ping in 3 seconds - Private and accurate, no sign-up.", h:"/internet-speed-test", c:"TEXT", img:"/internetspeedtest.jpg", tags:["PRO Meter","Private"] },
  { t:"Image DPI Changer - 72 to 300 DPI", d:"Change JPG, PNG, HEIC DPI to 72, 150, 300, 600 - For printing, passport, exam.", h:"/image-dpi-changer", c:"IMAGE", img:"/imagedpichanger.jpg", tags:["300 DPI","No Watermark"] },
  { t:"Image to Text - OCR Free", d:"Extract text from JPG, PNG in 3 seconds - Fast and private, no upload to server.", h:"/image-to-text", c:"IMAGE", img:"/imagetotext.jpg", tags:["OCR","Private"] },
  { t:"Text to Speech - 40+ Languages", d:"Convert text to real human voice - 40+ languages, free download.", h:"/text-to-speech", c:"TEXT", img:"/texttospeech.jpg", tags:["40+ Lang","Real Voice"] },
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

const FAQS = [
  { q:"Is THE NEXORA TOOLS really 100% free?", a:"Yes. All 30 tools are completely free forever. No sign-up, no hidden charges, no watermark and no daily limit." },
  { q:"Are my files safe and private?", a:"Yes. All tools run inside your browser. Your photos, PDFs and videos never upload to our server. Your files never leave your device." },
  { q:"How to compress image to exact 20KB or 50KB?", a:"Open Compress Image to Any KB, upload your JPG / PNG, select 20KB or 50KB, and download. It is perfect for UPSC, SSC, Bank and college forms." },
  { q:"Who is the founder of THE NEXORA TOOLS?", a:"THE NEXORA TOOLS was founded by Ayush Chauhan from India. He built this platform to give students, creators and small businesses free, fast and private tools." },
  { q:"Do I need to create an account?", a:"No. You can use every tool without sign-up or login. Just open the tool, use it and download your result." },
];

export default function Home(){
  const [q,setQ]=useState("");
  const [cat,setCat]=useState("ALL");
  const filtered = TOOLS.filter(x=>{
    const mCat = cat==="ALL" || x.c===cat;
    const mQ = (x.t+" "+x.d).toLowerCase().includes(q.toLowerCase());
    return mCat && mQ;
  });
  return (
    <div style={{background:"#ffffff", color:"#111827", fontFamily:"Inter, system-ui, sans-serif", fontSize:13}}>
      {/* HEADER - Smaller & Clean */}
      <header style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", borderBottom:"1px solid #e5e7eb", position:"sticky", top:0, background:"#fff", zIndex:10, maxWidth:1100, margin:"0 auto", width:"100%", boxSizing:"border-box"}}>
        <a href="/" style={{fontWeight:800, fontSize:17, color:"#111827", textDecoration:"none"}}>NEXORA<span style={{color:"#2563eb"}}>.</span></a>
        <nav style={{display:"flex", gap:12, fontSize:12.5}}><a href="/" style={{color:"#111827", textDecoration:"none"}}>Home</a><a href="/about" style={{color:"#111827", textDecoration:"none"}}>About</a><a href="/contact" style={{color:"#111827", textDecoration:"none"}}>Contact</a></nav>
        <a href="#tools" style={{background:"#2563eb", color:"#fff", padding:"7px 11px", borderRadius:8, textDecoration:"none", fontWeight:600, fontSize:12}}>Explore Tools →</a>
      </header>

      {/* HERO - Smaller */}
      <section style={{padding:"26px 14px 18px", textAlign:"center", maxWidth:760, margin:"0 auto"}}>
        <span style={{background:"#eff6ff", color:"#2563eb", padding:"4px 10px", borderRadius:20, fontSize:10.5, fontWeight:700, letterSpacing:0.3}}>30 FREE TOOLS • NO WATERMARK • 100% PRIVATE</span>
        <h1 style={{fontSize:30, lineHeight:1.15, margin:"12px 0 8px", fontWeight:800}}>Every Tool You Need.<br/><span style={{color:"#2563eb"}}>In One Place.</span></h1>
        <p style={{fontSize:13.5, color:"#4b5563", lineHeight:1.65, maxWidth:640, margin:"0 auto"}}>Compress Image to Any KB • Video Compressor to Exact MB • Image to Text OCR • Text to Speech in 40+ Languages • PDF Tools in HD — No Watermark, Trusted Worldwide.</p>
        <div style={{display:"flex", gap:9, justifyContent:"center", marginTop:16, flexWrap:"wrap"}}>
          <a href="#tools" style={{background:"#2563eb", color:"#fff", padding:"9px 15px", borderRadius:9, textDecoration:"none", fontWeight:600, fontSize:13}}>Explore All Tools →</a>
          <a href="/compress-image" style={{border:"1px solid #d1d5db", color:"#111827", padding:"9px 15px", borderRadius:9, textDecoration:"none", fontWeight:600, fontSize:13}}>Compress Image to 20KB</a>
        </div>
        <p style={{fontSize:11.5, color:"#6b7280", marginTop:12}}>Trusted by students, creators & small businesses in India and worldwide • No sign-up needed</p>
      </section>

      {/* FOUNDER - English, Clean, Photo + Video */}
      <section style={{maxWidth:760, margin:"0 auto", padding:"0 14px 22px", textAlign:"center"}}>
        <h2 style={{fontSize:19, marginBottom:8}}>Founded by Ayush Chauhan</h2>
        <img src="/ayushchauhan.jpg" alt="Ayush Chauhan - Founder of THE NEXORA TOOLS" style={{width:86, height:86, objectFit:"cover", borderRadius:"50%", border:"2px solid #e5e7eb"}} />
        <p style={{fontSize:13, color:"#4b5563", lineHeight:1.65, marginTop:10}}>Hello, I am <b style={{color:"#111827"}}>Ayush Chauhan</b>, the founder of <b style={{color:"#111827"}}>THE NEXORA TOOLS</b>. I created this platform with one simple mission — to give everyone free, fast and private tools without watermark, sign-up or hidden charges.</p>
        <video src="/ayushchauhan.mp4" controls style={{width:"100%", maxWidth:620, borderRadius:12, border:"1px solid #e5e7eb", marginTop:10}} />
      </section>

      {/* TOOLS */}
      <section id="tools" style={{maxWidth:1100, margin:"0 auto", padding:"14px"}}>
        <h2 style={{fontSize:21, margin:0}}>Find Your Tool <span style={{color:"#6b7280", fontWeight:400}}>in seconds.</span></h2>
        <p style={{color:"#4b5563", fontSize:13, lineHeight:1.6, margin:"6px 0 0"}}>Search from 30 powerful tools. Everything runs in your browser — fast, private & free forever.</p>
        <div style={{display:"flex", gap:8, margin:"14px 0", flexWrap:"wrap"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search 30 tools... e.g. compress image to 50kb, jpg to pdf..." style={{flex:1, minWidth:210, padding:"9px 11px", borderRadius:9, border:"1px solid #d1d5db", fontSize:13}} />
          <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>{CATS.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"7px 11px", borderRadius:20, border:"1px solid #d1d5db", background:cat===c?"#111827":"#fff", color:cat===c?"#fff":"#111827", cursor:"pointer", fontSize:12}}>{c}</button>)}</div>
        </div>
        <p style={{fontSize:11.5, color:"#6b7280", margin:0}}>{filtered.length} TOOLS FOUND</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:12, marginTop:12}}>
          {filtered.map((t)=>(
            <a key={t.t} href={t.h} style={{border:"1px solid #e5e7eb", borderRadius:13, overflow:"hidden", textDecoration:"none", color:"#111827", background:"#fff"}}>
              <img src={t.img} alt={`${t.t} - Free Online Tool by THE NEXORA TOOLS`} style={{width:"100%", height:135, objectFit:"cover", display:"block"}} />
              <div style={{padding:12}}>
                <span style={{fontSize:10, fontWeight:700, color:"#2563eb", letterSpacing:0.4}}>{t.c}</span>
                <h3 style={{fontSize:14.5, margin:"5px 0", lineHeight:1.3}}>{t.t}</h3>
                <p style={{fontSize:12.5, color:"#4b5563", lineHeight:1.6, margin:0}}>{t.d}</p>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10}}>
                  <span style={{fontSize:11, color:"#6b7280"}}>{t.tags.join(" • ")}</span>
                  <span style={{fontWeight:700, color:"#2563eb", fontSize:12}}>OPEN →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ABOUT - Long Page, A to Z */}
      <section style={{maxWidth:1100, margin:"22px auto 0", padding:"0 14px"}}>
        <h2 style={{fontSize:20, margin:"0 0 6px"}}>About THE NEXORA TOOLS</h2>
        <p style={{color:"#4b5563", lineHeight:1.7, fontSize:13, margin:0}}>THE NEXORA TOOLS is a free online tools platform founded by <b style={{color:"#111827"}}>Ayush Chauhan</b>. It brings 30 powerful tools together in one clean website — Image Tools, PDF Tools, Calculators, Text Tools and Video Tools. Whether you are a student filling a UPSC or SSC form, a creator making a YouTube thumbnail, or a small business owner making a PDF invoice, you will find the right tool here in seconds.</p>
        <p style={{color:"#4b5563", lineHeight:1.7, fontSize:13, margin:"8px 0 0"}}>Unlike other websites that add watermarks, ask for sign-up, or upload your files to a server, THE NEXORA TOOLS works completely inside your browser. Your files stay on your device. That means faster speed, complete privacy and zero risk of data leak. All tools are HD quality, free forever, and work on mobile, tablet and desktop.</p>
      </section>

      {/* WHY */}
      <section style={{maxWidth:1100, margin:"20px auto 0", padding:"0 14px"}}>
        <h2 style={{fontSize:20, margin:"0 0 6px"}}>Why THE NEXORA TOOLS is No.1?</h2>
        <p style={{color:"#4b5563", lineHeight:1.65, fontSize:13, margin:0}}>Simple, private and exact. That is why lakhs of users trust THE NEXORA TOOLS.</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:11, marginTop:12}}>
          <div style={{border:"1px solid #e5e7eb", borderRadius:11, padding:12}}><b style={{fontSize:13}}>01 - 100% Private</b><p style={{color:"#4b5563", lineHeight:1.6, fontSize:12.5, margin:"5px 0 0"}}>Files never upload to server. 100% browser processing. Your data stays with you.</p></div>
          <div style={{border:"1px solid #e5e7eb", borderRadius:11, padding:12}}><b style={{fontSize:13}}>02 - Exact KB / MB Size</b><p style={{color:"#4b5563", lineHeight:1.6, fontSize:12.5, margin:"5px 0 0"}}>20KB, 50KB, 10MB — exact size, not random %. Perfect for exam forms.</p></div>
          <div style={{border:"1px solid #e5e7eb", borderRadius:11, padding:12}}><b style={{fontSize:13}}>03 - No Watermark, HD</b><p style={{color:"#4b5563", lineHeight:1.6, fontSize:12.5, margin:"5px 0 0"}}>HD quality, zero watermark, forever free. Download and use anywhere.</p></div>
          <div style={{border:"1px solid #e5e7eb", borderRadius:11, padding:12}}><b style={{fontSize:13}}>04 - No Sign-Up</b><p style={{color:"#4b5563", lineHeight:1.6, fontSize:12.5, margin:"5px 0 0"}}>Open any tool and start using it instantly. No login, no email, no waiting.</p></div>
        </div>
      </section>

      {/* HOW TO USE */}
      <section style={{maxWidth:1100, margin:"20px auto 0", padding:"0 14px"}}>
        <h2 style={{fontSize:20, margin:"0 0 6px"}}>How to Use THE NEXORA TOOLS?</h2>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:11, marginTop:10}}>
          <div style={{background:"#f9fafb", borderRadius:11, padding:12}}><b style={{fontSize:13}}>Step 1 - Search</b><p style={{color:"#4b5563", fontSize:12.5, lineHeight:1.6, margin:"5px 0 0"}}>Type your tool name in the search box, like “compress image” or “jpg to pdf”.</p></div>
          <div style={{background:"#f9fafb", borderRadius:11, padding:12}}><b style={{fontSize:13}}>Step 2 - Open Tool</b><p style={{color:"#4b5563", fontSize:12.5, lineHeight:1.6, margin:"5px 0 0"}}>Click OPEN. Upload your file or type your text. No sign-up needed.</p></div>
          <div style={{background:"#f9fafb", borderRadius:11, padding:12}}><b style={{fontSize:13}}>Step 3 - Download</b><p style={{color:"#4b5563", fontSize:12.5, lineHeight:1.6, margin:"5px 0 0"}}>Get your result in HD, without watermark, and download it for free.</p></div>
        </div>
      </section>

      {/* POPULAR */}
      <section style={{maxWidth:1100, margin:"20px auto 0", padding:"0 14px"}}>
        <h2 style={{fontSize:20, margin:"0 0 8px"}}>Most Popular Tools on THE NEXORA TOOLS</h2>
        <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
          {["Compress Image to 20KB","Background Remover","Passport Photo Maker","JPG to PDF","PDF to Word","Video Compressor","Image to Text OCR","QR Code Generator","Resume Builder","Text to Speech"].map((x,i)=>(
            <a key={x} href={TOOLS[i]?.h || "#tools"} style={{border:"1px solid #e5e7eb", borderRadius:20, padding:"7px 11px", fontSize:12, color:"#111827", textDecoration:"none", background:"#fff"}}>{x} →</a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{maxWidth:1100, margin:"20px auto 0", padding:"0 14px"}}>
        <h2 style={{fontSize:20, margin:"0 0 10px"}}>Frequently Asked Questions</h2>
        {FAQS.map(f=>(
          <div key={f.q} style={{border:"1px solid #e5e7eb", borderRadius:11, padding:"12px", marginBottom:9}}>
            <b style={{fontSize:13}}>{f.q}</b>
            <p style={{color:"#4b5563", fontSize:12.5, lineHeight:1.65, margin:"5px 0 0"}}>{f.a}</p>
          </div>
        ))}
      </section>

      {/* FOUNDER STORY */}
      <section style={{maxWidth:1100, margin:"20px auto 0", padding:"0 14px"}}>
        <h2 style={{fontSize:20, margin:"0 0 6px"}}>Meet the Founder — Ayush Chauhan</h2>
        <p style={{color:"#4b5563", fontSize:13, lineHeight:1.7, margin:0}}>Ayush Chauhan is an Indian creator and developer and the founder of THE NEXORA TOOLS (thenexoratools.com). He started this platform because students in India were struggling with paid tools, watermarks and complicated websites for simple tasks like compressing an image to 20KB or making a passport photo. His vision is simple — every useful tool should be free, private and easy for everyone.</p>
      </section>

      <footer style={{borderTop:"1px solid #e5e7eb", padding:"22px 14px", marginTop:24}}>
        <div style={{maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:18}}>
          <div><b style={{fontSize:17}}>NEXORA.</b><p style={{color:"#4b5563", maxWidth:300, fontSize:12.5, lineHeight:1.6}}>30 free tools trusted worldwide. Fast, Private, Browser-Based, No Watermark, HD. Founded by Ayush Chauhan.</p><a href="mailto:ayushchauhan902704@gmail.com" style={{color:"#2563eb", fontSize:12.5}}>ayushchauhan902704@gmail.com</a></div>
          <div><h4 style={{fontSize:13, margin:"0 0 8px"}}>Popular Tools</h4><p style={{fontSize:12.5, margin:"4px 0"}}><a href="/image-to-text" style={{color:"#4b5563", textDecoration:"none"}}>Image to Text OCR</a></p><p style={{fontSize:12.5, margin:"4px 0"}}><a href="/video-compressor" style={{color:"#4b5563", textDecoration:"none"}}>Video Compressor</a></p><p style={{fontSize:12.5, margin:"4px 0"}}><a href="/passport-size-photo-maker" style={{color:"#4b5563", textDecoration:"none"}}>Passport Photo</a></p></div>
          <div><h4 style={{fontSize:13, margin:"0 0 8px"}}>Legal</h4><p style={{fontSize:12.5, margin:"4px 0"}}><a href="/about" style={{color:"#4b5563", textDecoration:"none"}}>About Us</a></p><p style={{fontSize:12.5, margin:"4px 0"}}><a href="/contact" style={{color:"#4b5563", textDecoration:"none"}}>Contact</a></p><p style={{fontSize:12.5, margin:"4px 0"}}><a href="/privacy" style={{color:"#4b5563", textDecoration:"none"}}>Privacy Policy</a></p><p style={{fontSize:12.5, margin:"4px 0"}}><a href="/terms" style={{color:"#4b5563", textDecoration:"none"}}>Terms</a></p></div>
        </div>
        <p style={{textAlign:"center", color:"#6b7280", marginTop:18, fontSize:12}}>© 2026 THE NEXORA TOOLS • thenexoratools.com • 30 Tools Free Forever • Founded by Ayush Chauhan</p>
      </footer>
    </div>
  );
}
