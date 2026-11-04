"use client";
import { useState } from "react";

const tools = [
  { id:1, title:"Internet Speed Test - Pro", desc:"Check Download, Upload, Ping in 3 Sec - Private & Accurate", href:"/internet-speed-test", cat:"text", icon:"⚡", iconBg:"#0f172a", iconColor:"white", badge:"PRO • NEW", badgeBg:"#0f172a", tags:["PRO Meter","Private","3 Sec"], search:"internet speed test download upload ping fast private" },
  { id:2, title:"Image to Text - OCR Free", desc:"Extract Text From JPG, PNG in 3 Sec - Fast & Private", href:"/image-to-text", cat:"image text", icon:"🔤", iconBg:"#eeecff", badge:"OCR • NEW", badgeBg:"#6c5ce7", tags:["OCR","Private","3 Sec"], search:"image to text ocr extract text from image jpg png photo to text" },
  { id:3, title:"Video Compressor to Any MB", desc:"Compress Video to Exact 5MB, 10MB, 20MB, 100MB - HD", href:"/video-compressor", cat:"text image", icon:"🎬", iconBg:"#ffedd5", badge:"EXACT MB • NEW", badgeBg:"#f97316", tags:["Exact Size","HD Audio","Private"], search:"video compressor compress video to 5mb 10mb 20mb 50mb 100mb exact size" },
  { id:4, title:"Text to Speech - 40+ Languages", desc:"Convert Text to Real Human Voice - 40+ Languages", href:"/text-to-speech", cat:"text", icon:"🌍", iconBg:"#ede9fe", badge:"40+ LANG • NEW", badgeBg:"#7c3aed", tags:["40+ Languages","Real Voice","Free"], search:"text to speech tts 40 languages real voice free" },
  { id:5, title:"YT Thumbnail Downloader - HD", desc:"Download YouTube Thumbnail in HD 1280x720 - No Watermark", href:"/yt-thumbnail-downloader", cat:"image", icon:"🖼️", iconBg:"#eeecff", badge:"HD • NEW", badgeBg:"#6c5ce7", tags:["HD 1280x720","No Watermark"], search:"yt thumbnail downloader youtube thumbnail download hd" },
  { id:6, title:"Love Calculator - By Name", desc:"Check Love Compatibility % By Names - Fun Test", href:"/love-calculator", cat:"calc", icon:"❤️", iconBg:"#fce7f3", badge:"VIRAL • HOT", badgeBg:"#ec4899", tags:["Viral","Fun","Popular"], search:"love calculator love test name compatibility" },
  { id:7, title:"Passport Photo Maker", desc:"10 Sizes - 20KB, 50KB, Visa, Stamp, 35x45mm - Exact Size", href:"/passport-size-photo", cat:"image", icon:"📸", iconBg:"#dcfce7", badge:"TRENDING", badgeBg:"#10b981", tags:["10 Sizes","Exact KB","HD"], search:"passport size photo maker 20kb 50kb 100kb visa stamp size" },
  { id:8, title:"Background Remover", desc:"Remove BG in 1 Click - HD, Transparent, White, Blue", href:"/background-remover", cat:"image", icon:"🖼️", iconBg:"#ede9fe", badge:"AI • HD", badgeBg:"#8b5cf6", tags:["AI Powered","HD","Fast"], search:"background remover remove bg transparent" },
  { id:9, title:"Compress Image to Any KB", desc:"JPG/PNG/WEBP to 20KB, 50KB, 100KB, 200KB - Exact Size", href:"/compress-image", cat:"image", icon:"🗜️", iconBg:"#fef3c7", badge:"", badgeBg:"", tags:["Exact KB","Worldwide","Private"], search:"compress image 20kb 40kb 100kb 200kb photo compressor exact size" },
  { id:10, title:"JPG to PDF - Best", desc:"50 Images to Single PDF - No Watermark HD", href:"/jpg-to-pdf", cat:"image pdf", icon:"📷", iconBg:"#e0e7ff", badge:"BEST", badgeBg:"#6366f1", tags:["50 Photos","No Watermark HD"], search:"jpg to pdf converter best 50 images no watermark" },
  { id:11, title:"PDF to JPG - HD", desc:"Convert PDF Pages to HD JPG Images - No Watermark", href:"/pdf-to-jpg", cat:"image pdf", icon:"🖼️", iconBg:"#fee2e2", badge:"HD", badgeBg:"#ef4444", tags:["All Pages","HD","Private"], search:"pdf to jpg pdf to jpeg image converter hd" },
  { id:12, title:"Instagram Reels Downloader", desc:"Download Reels in HD - No Watermark, Fast", href:"/instagram-reels-downloader", cat:"image", icon:"🎬", iconBg:"#fce7f3", badge:"HD", badgeBg:"#ec4899", tags:["HD","No Watermark"], search:"instagram reels downloader no watermark hd" },
  { id:13, title:"QR Code Generator - No.1", desc:"Create QR for Link, Text, WiFi - Instant HD Download", href:"/qr-code-generator", cat:"image", icon:"🔳", iconBg:"#dbeafe", badge:"NO.1", badgeBg:"#2563eb", tags:["Instant","PNG HD"], search:"qr code generator qr hd" },
  { id:14, title:"PDF to Word - HD", desc:"Convert PDF to Editable Word DOC - Keep Formatting", href:"/pdf-to-word", cat:"pdf", icon:"📄", iconBg:"#d1fae5", badge:"EDITABLE", badgeBg:"#10b981", tags:["Editable","No Watermark"], search:"pdf to word converter doc docx hd" },
  { id:15, title:"Word to PDF - HD", desc:"DOCX, DOC to PDF - A4, HD, No Watermark", href:"/word-to-pdf", cat:"pdf", icon:"📄", iconBg:"#e0e7ff", badge:"HD", badgeBg:"#6366f1", tags:["A4 HD","No Watermark"], search:"word to pdf docx to pdf no watermark hd" },
  { id:16, title:"PDF Merge & Split", desc:"Merge Multiple PDFs + Split PDF into Pages - Unlimited", href:"/pdf-merge-split", cat:"pdf", icon:"📚", iconBg:"#fef3c7", badge:"", badgeBg:"", tags:["Unlimited","Private","Free"], search:"pdf merge split combine join unlimited private" },
  { id:17, title:"Image to Word - OCR", desc:"Scanned PDF, JPG, PNG to Editable Word via OCR", href:"/image-to-word", cat:"pdf text", icon:"🔍", iconBg:"#fef3c7", badge:"OCR", badgeBg:"#f59e0b", tags:["OCR","Scanned"], search:"ocr image to word scanned pdf jpg png photo to text" },
  { id:18, title:"BMI Calculator", desc:"Check Body Mass Index - Healthy Weight Range", href:"/bmi-calculator", cat:"calc", icon:"🧍", iconBg:"#f1f5f9", badge:"", badgeBg:"", tags:["Health","Instant"], search:"bmi calculator body mass index" },
  { id:19, title:"Age Calculator", desc:"Calculate Exact Age in Years, Months, Days", href:"/age-calculator", cat:"calc", icon:"📅", iconBg:"#f1f5f9", badge:"", badgeBg:"", tags:["DOB","Exact"], search:"age calculator dob birth" },
  { id:20, title:"Loan EMI Calculator", desc:"EMI, Interest, Total Payment - Home, Car, Personal", href:"/loan-emi-calculator", cat:"calc", icon:"🏦", iconBg:"#f1f5f9", badge:"", badgeBg:"", tags:["EMI","Finance"], search:"loan emi calculator home car" },
  { id:21, title:"Percentage Calculator", desc:"Find X% of Y - Quick Percent Instant As You Type", href:"/percentage-calculator", cat:"calc", icon:"%", iconBg:"#dbeafe", badge:"INSTANT", badgeBg:"#2563eb", tags:["Instant","Fast"], search:"percentage calculator percent instant" },
  { id:22, title:"Discount Calculator", desc:"Original Price, Discount %, Final Price + Savings", href:"/discount-calculator", cat:"calc", icon:"🏷️", iconBg:"#f1f5f9", badge:"", badgeBg:"", tags:["Savings"], search:"discount calculator price off" },
  { id:23, title:"Date Difference / Days Calc", desc:"Days Between Two Dates - Age, Duration", href:"/date-difference", cat:"calc", icon:"⏱️", iconBg:"#f1f5f9", badge:"", badgeBg:"", tags:["Duration"], search:"date difference days calculator" },
  { id:24, title:"Word Counter - Private", desc:"Count Words, Characters, Sentences Instant - Private", href:"/word-counter", cat:"text", icon:"🔤", iconBg:"#dbeafe", badge:"PRIVATE", badgeBg:"#2563eb", tags:["Instant","Private"], search:"word counter words characters instant private" },
  { id:25, title:"Character Counter", desc:"Char Count With & Without Spaces - For Social", href:"/character-counter", cat:"text", icon:"🔡", iconBg:"#f1f5f9", badge:"", badgeBg:"", tags:["Social"], search:"character counter char count" },
  { id:26, title:"AI Text Humanizer", desc:"Make AI Text Sound Human - Bypass Detectors", href:"/ai-text-humanizer", cat:"text", icon:"🤖", iconBg:"#ede9fe", badge:"AI", badgeBg:"#7c3aed", tags:["AI","Humanize"], search:"ai text humanizer ai detector bypass" },
  { id:27, title:"Unit Converter - Instant", desc:"km to miles, kg to lbs, C to F - Instant As You Type", href:"/unit-converter", cat:"text", icon:"🌡️", iconBg:"#dcfce7", badge:"INSTANT", badgeBg:"#10b981", tags:["Instant","All Units"], search:"unit converter length weight temp celsius km miles kg lbs" },
  { id:28, title:"Password Generator", desc:"Generate Strong, Secure Random Passwords", href:"/password-generator", cat:"text", icon:"🔑", iconBg:"#f1f5f9", badge:"", badgeBg:"", tags:["Secure"], search:"password generator strong secure" },
  { id:29, title:"Resume Builder - ATS", desc:"Make ATS Resume in 2 Mins - PDF Download No Watermark", href:"/resume-builder", cat:"text", icon:"📝", iconBg:"#dcfce7", badge:"ATS • HD", badgeBg:"#10b981", tags:["ATS HD","PDF No Watermark"], search:"resume builder cv maker ats biodata no watermark" },
];

export default function HomePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = tools.filter(t => {
    const matchSearch = t.search.includes(q.toLowerCase()) || t.title.toLowerCase().includes(q.toLowerCase());
    const matchCat = cat === "all" || t.cat.includes(cat);
    return matchSearch && matchCat;
  });

  const categories = [
    { k: "all", l: "All Tools" },
    { k: "image", l: "Image" },
    { k: "pdf", l: "PDF" },
    { k: "calc", l: "Calculator" },
    { k: "text", l: "Text" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <nav className="w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 px-[5%] py-3.5 flex justify-between items-center sticky top-0 z-50">
        <div className="font-black text-[18px] tracking-tight flex gap-2 items-center">🧮 <span className="text-[#2563eb]">NEXORA</span> Tools</div>
        <div className="hidden md:flex gap-5 text-[13px] font-semibold text-slate-600">
          <a href="/" className="hover:text-blue-600">Home</a><a href="/about" className="hover:text-blue-600">About</a><a href="/contact" className="hover:text-blue-600">Contact</a><a href="/privacy" className="hover:text-blue-600">Privacy</a>
        </div>
      </nav>

      <div className="text-center pt-[70px] pb-[50px] px-5 bg-[radial-gradient(1200px_600px_at_50%_-10%,#dbeafe_0%,#f8fafc_60%)]">
        <h1 className="text-[clamp(28px,5vw,48px)] font-black tracking-tight leading-[1.1]">29 Free Tools to <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Get Work Done Faster</span></h1>
        <p className="text-slate-500 text-[15px] mt-3.5 font-medium max-w-[800px] mx-auto leading-[1.5]">Compress Image to Any KB • Video Compressor to Exact MB • Image to Text OCR • Text to Speech 40+ Languages • PDF Tools HD • Background Remover — No Watermark, 100% Private, Trusted Worldwide</p>
        
        <div className="w-[95%] max-w-[700px] mx-auto mt-7 relative">
          <span className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[18px] opacity-50">🔍</span>
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search 29 tools... e.g. compress image to 50kb, jpg to pdf, background remover..." className="w-full pl-[50px] pr-[22px] py-[18px] border border-slate-200 rounded-2xl text-[15px] font-semibold outline-none shadow-[0_10px_30px_rgba(0,0,0,0.06)] focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition" />
        </div>

        <div className="flex justify-center gap-7 mt-6 text-[12px] font-bold text-slate-600 flex-wrap">
          <div><span className="text-blue-600 font-black text-[14px]">29</span> Tools</div><div><span className="text-blue-600 font-black text-[14px]">96K+</span> Users</div><div><span className="text-blue-600 font-black text-[14px]">100%</span> Free</div><div><span className="text-blue-600 font-black text-[14px]">0</span> Watermark</div><div><span className="text-blue-600 font-black">Private</span></div>
        </div>

        <div className="flex gap-2.5 justify-center flex-wrap mt-8">
          {categories.map(c => (
            <button key={c.k} onClick={()=>setCat(c.k)} className={`px-3.5 py-2 rounded-full border text-[12px] font-bold transition ${cat===c.k ? 'bg-[#0f172a] text-white border-[#0f172a]' : 'bg-white border-slate-200 hover:bg-[#0f172a] hover:text-white'}`}>{c.l}</button>
          ))}
        </div>
      </div>

      <div className="w-[96%] max-w-[1280px] mx-auto py-6">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
          {filtered.map(t => (
            <div key={t.id} className="bg-white border border-slate-200 rounded-[20px] p-5 relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:border-slate-300 transition">
              {t.badge && <div className="absolute top-3.5 right-3.5 text-[8px] font-black px-2 py-1 rounded-full text-white tracking-wide" style={{background:t.badgeBg}}>{t.badge}</div>}
              <div className="flex gap-3 items-center">
                <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center text-[20px]" style={{background:t.iconBg, color:t.iconColor || 'black'}}>{t.icon}</div>
                <div><h3 className="text-[14px] font-extrabold tracking-tight">{t.title}</h3><div className="text-[11.5px] text-slate-500 mt-1 leading-[1.4] h-8">{t.desc}</div></div>
              </div>
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {t.tags.map(tag => <span key={tag} className="text-[9px] font-extrabold px-2 py-1 rounded-full bg-[#f1f5f9] text-slate-600">{tag}</span>)}
              </div>
              <button onClick={()=>location.href=t.href} className="w-full mt-3.5 py-2.5 rounded-xl bg-[#0f172a] text-white font-extrabold text-[13px] hover:bg-[#2563eb] transition flex justify-center items-center gap-1.5">Open Tool →</button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[96%] max-w-[900px] mx-auto bg-white border border-slate-200 rounded-[20px] p-6 mt-5">
        <h2 className="text-[16px] font-black">Why NEXORA No.1 Free Tools Site?</h2>
        <p className="text-[12px] text-slate-500 mt-2 leading-7">NEXORA is trusted worldwide for free online tools. Unlike other sites with watermarks, limits and server uploads, we give 100% free, private, HD tools that run in your browser. Your files never leave your device. Best alternative to ilovepdf, tinypng, smallpdf. Now with Image to Text OCR, Video Compressor to Exact MB, Text to Speech 40+ Languages & Internet Speed Test Pro - Fast, Private & Secure.</p>
      </div>

      <footer className="bg-[#020617] mt-14">
        <div className="w-[96%] max-w-[1280px] mx-auto py-10 px-5 grid grid-cols-2 md:grid-cols-[1.8fr_1fr_1fr_1fr] gap-8">
          <div><h4 className="text-white text-[13px] font-extrabold mb-3">🧮 NEXORA Tools</h4><p className="text-slate-400 text-[12px] leading-6">29 free tools trusted worldwide. Fast, Private Browser-Based, No Watermark HD. All processing in browser.</p></div>
          <div><h4 className="text-white text-[13px] font-bold mb-3">Popular Tools</h4><div className="flex flex-col gap-1.5 text-[12px] text-slate-400"><a href="/image-to-text">Image to Text OCR</a><a href="/video-compressor">Video Compressor</a><a href="/text-to-speech">Text to Speech</a></div></div>
          <div><h4 className="text-white text-[13px] font-bold mb-3">PDF Tools HD</h4><div className="flex flex-col gap-1.5 text-[12px] text-slate-400"><a href="/pdf-to-word">PDF to Word</a><a href="/word-to-pdf">Word to PDF</a><a href="/pdf-merge-split">Merge & Split PDF</a></div></div>
          <div><h4 className="text-white text-[13px] font-bold mb-3">Legal</h4><div className="flex flex-col gap-1.5 text-[12px] text-slate-400"><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy Policy</a></div></div>
        </div>
        <div className="border-t border-slate-800 text-center py-4 text-slate-500 text-[11px]">© 2026 NEXORA Tools • 29 Tools Free Forever • Trusted Worldwide • No Watermark HD • Private & Secure</div>
      </footer>
    </div>
  );
}
