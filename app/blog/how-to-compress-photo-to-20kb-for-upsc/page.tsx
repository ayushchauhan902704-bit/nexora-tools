import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Compress Photo to 20KB for UPSC Form 2026 - Free Tool | NEXORA",
  description: "UPSC requires photo 20KB-50KB and signature 10KB-20KB. Learn how to compress photo to 20KB for UPSC online free with NEXORA. 100% private, browser-based.",
  alternates: {
    canonical: "https://nexora-tools-drab.vercel.app/blog/how-to-compress-photo-to-20kb-for-upsc",
  },
};

export default function Page() {
  return (
    <main style={{background:"#f7f8fc", minHeight:"100vh", padding:"20px 0"}}>
      <div style={{width:"min(900px, calc(100% - 32px))", margin:"auto"}}>
        
        <div style={{background:"white", border:"1px solid #e8e8ef", borderRadius:"18px", padding:"26px", margin:"18px 0"}}>
          <span style={{background:"#e8f5e9", color:"#2e7d32", padding:"5px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:800}}>UPSC 2026 GUIDE</span>
          <h1 style={{fontSize:"30px", marginTop:"10px", lineHeight:"1.2"}}>How to Compress Photo to <span style={{color:"#6c5ce7"}}>20KB for UPSC</span> Form 2026</h1>
          <p style={{fontSize:"13px", color:"#747486", marginTop:"8px"}}>UPSC form rejects if photo is more than 50KB. Here is the 100% working method to compress to 20KB.</p>
          
          <div style={{marginTop:"18px", background:"#f0efff", padding:"14px", borderRadius:"12px"}}>
            <b style={{fontSize:"13px"}}>UPSC Official Requirement:</b>
            <ul style={{fontSize:"13px", paddingLeft:"18px", marginTop:"6px", color:"#4a4a5a"}}>
              <li>Photo: 20KB to 50KB, JPG, 200x300 pixels</li>
              <li>Signature: 10KB to 20KB, JPG</li>
              <li>Photo ID: 20KB to 300KB, JPG/PDF</li>
            </ul>
          </div>

          <h2 style={{fontSize:"18px", marginTop:"20px"}}>3 Steps to Compress to 20KB</h2>
          <p style={{fontSize:"13px", color:"#4a4a5a", marginTop:"8px"}}><b>Step 1:</b> Go to UPSC official PDF and check size.<br/><b>Step 2:</b> Open NEXORA Compressor, select 20KB preset and JPG format.<br/><b>Step 3:</b> Click Compress Now and download. Upload to UPSC.</p>

          <Link href="/compress-image-to-20kb-40kb-80kb-100kb-200kb-300kb-500kb" style={{display:"block", background:"#6c5ce7", color:"white", textAlign:"center", padding:"14px", borderRadius:"12px", fontWeight:800, marginTop:"18px"}}>
            Compress Photo to 20KB Now →
          </Link>
          <p style={{fontSize:"11px", color:"#747486", marginTop:"8px", textAlign:"center"}}>100% Private - Photo never leaves your phone</p>
        </div>

        <div style={{background:"white", border:"1px solid #e8e8ef", borderRadius:"18px", padding:"26px"}}>
          <h3 style={{fontSize:"15px"}}>FAQ - UPSC Photo 20KB</h3>
          <p style={{fontSize:"13px", marginTop:"10px"}}><b>Q: Why UPSC needs 20KB photo?</b><br/>A: UPSC server has limit to store lakhs of forms. Small size loads fast and saves server cost.</p>
          <p style={{fontSize:"13px", marginTop:"10px"}}><b>Q: What if my photo is 100KB?</b><br/>A: Form will show error "File size exceeds limit". You must compress to 20KB-50KB.</p>
          <Link href="/" style={{color:"#6c5ce7", fontWeight:700, fontSize:"13px", marginTop:"14px", display:"block"}}>← Back to All Tools</Link>
        </div>

      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org",
        "@type":"HowTo",
        "name":"How to Compress Photo to 20KB for UPSC",
        "step":[
          {"@type":"HowToStep","name":"Check UPSC Requirement","text":"Photo 20KB-50KB needed"},
          {"@type":"HowToStep","name":"Compress","text":"Use NEXORA 20KB compressor"},
          {"@type":"HowToStep","name":"Upload","text":"Upload to UPSC form"}
        ]
      })}} />
    </main>
  );
}
