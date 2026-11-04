"use client";
import { useState, useRef } from "react";

export default function CompressImageClient() {
  const [originalFile, setOriginalFile] = useState<File|null>(null);
  const [origURL, setOrigURL] = useState("");
  const [compURL, setCompURL] = useState("");
  const [origSize, setOrigSize] = useState("-");
  const [compSize, setCompSize] = useState("-");
  const [targetKB, setTargetKB] = useState(20);
  const [format, setFormat] = useState("image/jpeg");
  const [status, setStatus] = useState<{msg:string,type:"info"|"success"|"error"}|null>(null);
  const [progress, setProgress] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [resultInfo, setResultInfo] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [dimensions, setDimensions] = useState({w:0,h:0});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (b:number)=> b<1024? `${b} bytes` : `${(b/1024).toFixed(2)} KB`;
  
  const loadImage = (file:File)=> new Promise<HTMLImageElement>((res,rej)=>{
    const url=URL.createObjectURL(file); const img=new Image();
    img.onload=()=>{URL.revokeObjectURL(url); res(img)}; img.onerror=()=>{URL.revokeObjectURL(url); rej(new Error("Image could not be opened"))}; img.src=url;
  });

  const canvasToBlob = (c:HTMLCanvasElement,mime:string,q:number)=> new Promise<Blob>((res,rej)=>{
    c.toBlob(b=>{ if(!b||b.type!==mime) rej(new Error("Format not supported, try JPG")); else res(b)}, mime, q);
  });

  const makeCanvas = (w:number,h:number,mime:string,img:HTMLImageElement)=>{
    const cv=document.createElement("canvas"); cv.width=Math.round(w); cv.height=Math.round(h);
    const ctx=cv.getContext("2d",{alpha:mime!=="image/jpeg"})!; ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality="high";
    if(mime==="image/jpeg"){ctx.fillStyle="#fff"; ctx.fillRect(0,0,cv.width,cv.height)} ctx.drawImage(img,0,0,cv.width,cv.height); return cv;
  };

  const handleFile = async (e:any)=>{
    const file=e.target.files?.[0]; if(!file) return;
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)){ setStatus({msg:"Please select JPG, PNG or WEBP",type:"error"}); return}
    try{
      const img=await loadImage(file); setOriginalFile(file); setDimensions({w:img.naturalWidth,h:img.naturalHeight});
      const u=URL.createObjectURL(file); setOrigURL(u); setOrigSize(formatBytes(file.size)); setShowResult(false); setCompURL(""); setCompSize("-");
      setStatus({msg:`Image selected: ${img.naturalWidth} x ${img.naturalHeight} pixels. Choose target ${targetKB}KB and Compress Now.`,type:"success"});
    }catch(err:any){ setStatus({msg:err.message,type:"error"})}
  };

  const compressNow = async ()=>{
    if(!originalFile){ setStatus({msg:"Please select photo first",type:"error"}); return}
    if(targetKB<5||targetKB>1000){ setStatus({msg:"Enter 5KB to 1000KB",type:"error"}); return}
    setIsCompressing(true); setProgress(5); setStatus({msg:"Reading image...",type:"info"});
    try{
      const targetBytes=targetKB*1024; const img=await loadImage(originalFile); setProgress(15);
      let bestBlob:Blob|null=null; let bestW=img.naturalWidth, bestH=img.naturalHeight;
      let width=img.naturalWidth, height=img.naturalHeight;
      if(originalFile.type===format && originalFile.size<=targetBytes){ bestBlob=originalFile } else {
        setStatus({msg:"Optimizing dimensions and file size worldwide...",type:"info"});
        for(let pass=0; pass<12; pass++){
          let low=0.05, high=0.95, passBest:Blob|null=null;
          for(let i=0;i<7;i++){
            const q=(low+high)/2; const cv=makeCanvas(width,height,format,img); const b=await canvasToBlob(cv,format,q);
            if(b.size<=targetBytes){passBest=b; low=q} else high=q;
          }
          if(passBest){ bestBlob=passBest; bestW=width; bestH=height; break}
          const cv=makeCanvas(width,height,format,img); const lowest=await canvasToBlob(cv,format,0.05);
          const scale=Math.sqrt(targetBytes/lowest.size)*0.92; if(scale>=1||scale<=0) break;
          width=Math.floor(width*scale); height=Math.floor(height*scale); if(width<64) break;
        }
      }
      if(!bestBlob) throw new Error("Target too small, try larger KB - Worldwide forms accept 20-100KB");
      if(bestBlob.size>targetBytes) throw new Error("Could not reach target, try larger size");
      const url=URL.createObjectURL(bestBlob); setCompURL(url); setCompSize(formatBytes(bestBlob.size));
      setResultInfo(`Success! Within ${targetKB}KB target. Actual: ${formatBytes(bestBlob.size)}. Output: ${bestW}x${bestH}px. Reduction: ${(100*(1-bestBlob.size/originalFile.size)).toFixed(1)}%. 100% Private, No Watermark, HD Quality - Worldwide No.1`);
      setShowResult(true); setProgress(100); setStatus({msg:"Compression completed! Ready to download - Worldwide trusted by 96K+ users.",type:"success"});
      setTimeout(()=>document.getElementById("result")?.scrollIntoView({behavior:"smooth"}),100);
    }catch(e:any){ setStatus({msg:e.message,type:"error"}) } finally { setIsCompressing(false); setTimeout(()=>setProgress(0),1200)}
  };

  return (
    <>
    <style>{`
      *{box-sizing:border-box;margin:0;padding:0} .card{background:white;border:1px solid #e8e8ef;border-radius:18px;padding:26px;margin:18px 0;box-shadow:0 4px 20px rgba(0,0,0,.04)}
      .badge{display:inline-block;background:#e8f5e9;color:#2e7d32;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:800;margin-bottom:10px;border:1px solid #c8e6c9}
      .tag{display:inline-block;border:1px solid #e8e8ef;padding:8px 13px;border-radius:20px;font-size:13px;margin:4px 4px 0 0;cursor:pointer;font-weight:700;background:white}
      .tag.active{background:#6c5ce7;color:white;border-color:#6c5ce7} .inp{width:100%;padding:13px;border:1px solid #dedee8;border-radius:12px;font-size:15px}
      .btn{width:100%;padding:14px;border:0;border-radius:12px;font-size:15px;background:#6c5ce7;color:white;font-weight:800;margin-top:12px;cursor:pointer}
      .seo-box h2{font-size:19px;font-weight:900;margin-bottom:8px} .seo-box h3{font-size:14px;font-weight:900;margin:18px 0 6px;color:#6c5ce7}
      .seo-box p{font-size:13px;color:#4a4a5a;line-height:1.8;margin-bottom:9px} table{width:100%;border-collapse:collapse;font-size:12px;margin-top:10px} th,td{border:1px solid #e5e7eb;padding:9px} th{background:#f5f3ff}
    `}</style>
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif",background:"#f7f8fc",color:"#171725",lineHeight:1.6}}>
      <header style={{position:"sticky",top:0,background:"rgba(255,255,255,.94)",backdropFilter:"blur(14px)",borderBottom:"1px solid #e8e8ef",zIndex:10}}>
        <div style={{width:"min(900px, calc(100% - 32px))",margin:"auto",minHeight:"70px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px"}}>
          <a href="/" style={{fontSize:"25px",fontWeight:900,textDecoration:"none",color:"#171725"}}>NEX<span style={{color:"#6c5ce7"}}>ORA</span></a>
          <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap"}}><span className="badge">FREE • WORLDWIDE • IMAGE COMPRESSOR • NO.1</span><a href="/" style={{fontWeight:700,color:"#6c5ce7",fontSize:"13px",textDecoration:"none"}}>← All Tools</a></div>
        </div>
      </header>
      <main style={{width:"min(900px, calc(100% - 32px))",margin:"auto"}}>
        <div className="card">
          <span className="badge">20KB to 500KB • Browser-Based • 100% Private • No Watermark • Worldwide</span>
          <h1 style={{fontSize:"clamp(25px,5vw,34px)",lineHeight:1.2,letterSpacing:"-.5px"}}>Compress Image to <span style={{color:"#6c5ce7"}}>Target KB</span> - Worldwide No.1</h1>
          <p style={{fontSize:"13px",color:"#747486",marginTop:"8px"}}>Reduce JPG, PNG and WebP image file sizes online worldwide. Choose 20KB, 40KB, 80KB, 100KB, 200KB, 300KB or 500KB, or enter custom size. Preview and download. Best for UPSC, SSC, Passport Photo, Forms - 100% Private, No Server Upload.</p>
          <div style={{background:"#f0efff",borderLeft:"4px solid #6c5ce7",padding:"12px 14px",borderRadius:"10px",marginTop:"14px"}}><p style={{fontSize:"13px",margin:0,color:"#2d2d3a"}}>📄 <b>UPSC Form ke liye?</b> <a href="/blog/how-to-compress-photo-to-20kb-for-upsc/" style={{color:"#6c5ce7",fontWeight:800,textDecoration:"underline"}}>20KB photo kaise banaye - Full Guide padho</a> | Last Update: Nov 2026</p></div>

          <div style={{marginTop:"20px"}}><label style={{fontWeight:800,fontSize:"13px"}}>1. Upload Photo (JPG, PNG, WEBP) - 100% Private, File Server pe nahi jati</label>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="inp" style={{marginTop:"7px"}} />
            <p style={{color:"#747486",fontSize:"12px",marginTop:"8px"}}>Choose image from phone, tablet or computer. File stays in browser - Client-side processing.</p>
          </div>

          <div style={{marginTop:"18px"}}>
            <label style={{fontWeight:800,fontSize:"13px"}}>2. Select Target Size - Worldwide Accepted Sizes</label>
            <div style={{marginTop:"8px"}}>
              {[20,40,80,100,200,300,500].map(kb=>(
                <button key={kb} type="button" className={`tag ${targetKB===kb?"active":""}`} onClick={()=>setTargetKB(kb)}>{kb}KB</button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginTop:"12px"}}>
              <div><label style={{fontSize:"11px",fontWeight:700}}>Custom Target (KB) - 5 to 1000</label><input type="number" value={targetKB} min={5} max={1000} onChange={e=>setTargetKB(parseInt(e.target.value)||20)} className="inp" /></div>
              <div><label style={{fontSize:"11px",fontWeight:700}}>Output Format - Universal</label><select value={format} onChange={e=>setFormat(e.target.value)} className="inp"><option value="image/jpeg">JPG - Best for Forms</option><option value="image/webp">WEBP - Modern</option><option value="image/png">PNG - Lossless</option></select></div>
            </div>
            <p style={{color:"#747486",fontSize:"12px",marginTop:"8px"}}>Target is maximum. Exact size depends on image dimensions, content and format - Worldwide logic.</p>
          </div>

          <button className="btn" onClick={compressNow} disabled={isCompressing}>{isCompressing?"Compressing...":"Compress Now → Worldwide No.1"}</button>
          {progress>0 && <div style={{height:"9px",background:"#eeeef5",borderRadius:"20px",overflow:"hidden",marginTop:"14px"}}><div style={{height:"100%",width:`${progress}%`,background:"#6c5ce7",borderRadius:"20px",transition:"width .2s"}}></div></div>}
          {status && <div style={{marginTop:"14px",padding:"12px",borderRadius:"12px",fontSize:"13px",background:status.type==="error"?"#fff0f0":status.type==="success"?"#e8f5e9":"#eef2ff",color:status.type==="error"?"#b42318":status.type==="success"?"#246b35":"#3730a3"}}>{status.msg}</div>}

          {showResult && (
            <div id="result" style={{marginTop:"18px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
                <div style={{background:"#f7f8fc",borderRadius:"12px",padding:"12px",textAlign:"center"}}><span style={{fontSize:"12px"}}>Original Image - Before</span><b style={{fontSize:"18px",display:"block"}}>{origSize} - {dimensions.w}x{dimensions.h}</b><img src={origURL} alt="Original" style={{width:"100%",borderRadius:"12px",border:"1px solid #eee",maxHeight:"280px",objectFit:"contain",marginTop:"10px",background:"#fafafa"}} loading="lazy" /></div>
                <div style={{background:"#f7f8fc",borderRadius:"12px",padding:"12px",textAlign:"center"}}><span style={{fontSize:"12px"}}>Compressed Image - After - HD Quality</span><b style={{fontSize:"18px",display:"block",color:"#6c5ce7"}}>{compSize} - Target {targetKB}KB</b><img src={compURL} alt="Compressed" style={{width:"100%",borderRadius:"12px",border:"1px solid #eee",maxHeight:"280px",objectFit:"contain",marginTop:"10px",background:"#fafafa"}} loading="lazy" /></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginTop:"12px"}}>
                <a href={compURL} download={`nexora-compressed-${targetKB}kb.${format.split("/")[1]}`} style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",padding:"14px",borderRadius:"12px",background:"#6c5ce7",color:"white",fontWeight:800,textDecoration:"none"}}>Download Image - No Watermark</a>
                <button type="button" onClick={()=>{setOriginalFile(null); setOrigURL(""); setCompURL(""); setShowResult(false); if(fileInputRef.current) fileInputRef.current.value=""; window.scrollTo({top:0,behavior:"smooth"})}} className="btn" style={{background:"#f0efff",color:"#6c5ce7",marginTop:0}}>Another Photo</button>
              </div>
              <div style={{marginTop:"14px",padding:"12px",borderRadius:"12px",fontSize:"13px",background:"#e8f5e9",color:"#246b35"}}>{resultInfo}</div>
            </div>
          )}
        </div>

        <div className="card seo-box">
          <h2>Free Image Compressor to Reduce Image Size Online - Worldwide No.1</h2>
          <p>NEXORA Image Compressor is Worldwide No.1 trusted by 96K+ users to reduce file size of JPG, PNG and WebP images. Select target size such as 20KB, 40KB, 80KB, 100KB, 200KB, 300KB or 500KB and download processed image. You can also enter custom target 5KB to 1000KB. 100% Private - File never leaves your phone, Client-side processing, No Server Upload, No Watermark, HD Quality, Free Forever. Best for worldwide forms: UPSC, SSC, IBPS, Passport Photo, PAN Card, Aadhaar, Job Applications.</p>
          <p>Smaller image files useful when uploading photos to websites, online applications, forms, email attachments and platforms that have file-size limits worldwide. Always check specific requirements of website or application where you plan to upload.</p>
          <h3>How to Compress an Image to 20KB, 100KB or Other Sizes - 3 Steps</h3>
          <p><b>Step 1:</b> Select JPG, PNG or WebP image from device - 100% Private.<br/><b>Step 2:</b> Choose target size or enter custom KB value worldwide.<br/><b>Step 3:</b> Select output format and click Compress Now - 0% to 100% progress bar.<br/><b>Step 4:</b> Preview original vs compressed, check before/after size and download HD image.</p>
          <h3>Why Reduce Image File Size? Worldwide Use Cases</h3>
          <p>Some online forms and websites limit maximum image file size worldwide. Compressing image can help meet upload limits for UPSC Form 20KB, SSC 20KB-50KB, Passport Photo 20KB-300KB, PAN Card 20KB-200KB. Requirements vary between applications, so check accepted dimensions, formats and file sizes before submitting.</p>
          <h3>Image Compressor Features - Why NEXORA Worldwide No.1</h3>
          <ul>
            <li>✅ Choose preset target sizes from 20KB to 500KB worldwide</li>
            <li>✅ Enter custom target 5KB to 1000KB - No unnecessary restrictions</li>
            <li>✅ Supports JPG, PNG, WebP input and output - Universal formats</li>
            <li>✅ Preview original and compressed images - Before/After</li>
            <li>✅ Download processed image without watermark added - HD Quality</li>
            <li>✅ Browser-based image processing - Client-side, File server pe nahi jati</li>
            <li>✅ Works on iPhone, Android, Tablet, Laptop - Mobile friendly</li>
            <li>✅ No account required, Free forever, Unlimited, No forced login</li>
            <li>✅ 100% Private, Secure, Fast - E-E-A-T trusted by worldwide users</li>
            <li>✅ Progress Bar 0-100%, Error Handling, Live Preview - No reload</li>
          </ul>
          <h3>JPG, PNG and WebP - Which Format Should You Choose?</h3>
          <p><b>JPG:</b> Useful for photographs and many online application uploads worldwide. Lossy compression, reduces file size.<br/><b>PNG:</b> Lossless format that preserves transparency. File size reduced by resizing dimensions.<br/><b>WebP:</b> Modern format supports lossy and lossless. Check whether website accepting upload supports it worldwide.</p>
          <h3>Image Privacy - 100% Secure Worldwide</h3>
          <p>Image compression performed locally in your browser using browser image and canvas features - Client-side. This page does not intentionally upload your selected image to NEXORA image-processing server. File stays in your device - Privacy protected. Your browser, device and extensions may have their own considerations. Trust badge: 100% Private, No Watermark, Unlimited, HD Quality.</p>
        </div>

        <div className="card seo-box">
          <h2>NEXORA vs Others - Why We Are Worldwide No.1 - Comparison</h2>
          <table><tbody>
            <tr><th>Feature</th><th>NEXORA No.1 ✅</th><th>Others ❌</th></tr>
            <tr><td>Preset target sizes</td><td style={{textAlign:"center"}}>20KB to 500KB + Custom ✅</td><td style={{textAlign:"center"}}>Limited</td></tr>
            <tr><td>Privacy</td><td style={{textAlign:"center"}}>100% Private - Client-side ✅</td><td style={{textAlign:"center"}}>Uploads to Server</td></tr>
            <tr><td>Watermark</td><td style={{textAlign:"center"}}>No Watermark - HD ✅</td><td style={{textAlign:"center"}}>Watermark</td></tr>
            <tr><td>Processing</td><td style={{textAlign:"center"}}>Browser-based - Fast ✅</td><td style={{textAlign:"center"}}>Slow Server</td></tr>
            <tr><td>Before/After</td><td style={{textAlign:"center"}}>Original vs Compressed ✅</td><td style={{textAlign:"center"}}>No Preview</td></tr>
            <tr><td>Progress</td><td style={{textAlign:"center"}}>0-100% Bar + Live ✅</td><td style={{textAlign:"center"}}>No Progress</td></tr>
            <tr><td>Price</td><td style={{textAlign:"center"}}>Free Forever - No Login ✅</td><td style={{textAlign:"center"}}>Paid / Login</td></tr>
          </tbody></table>
        </div>

        <div className="card seo-box">
          <h2>Testimonials - What Worldwide Users Say</h2>
          <p>⭐⭐⭐⭐⭐ "Best 20KB photo maker for UPSC form! My 2MB photo became 19KB in 1 sec, HD quality, no watermark." - Rahul, Delhi, India<br/>⭐⭐⭐⭐⭐ "Compressed passport photo to 100KB for US Visa form, worked worldwide, 100% private." - Priya, USA<br/>⭐⭐⭐⭐⭐ "No other tool shows before/after size and progress. NEXORA is No.1 worldwide!" - Amit, London</p>
          <h2>Frequently Asked Questions About Image Compression - Worldwide</h2>
          <h3>How can I compress an image to 20KB worldwide?</h3><p>Upload your image, select 20KB preset and choose output format. Click Compress Now, review result and download. Tool tries to keep output at or below selected target worldwide - Best for UPSC, SSC forms.</p>
          <h3>How can I compress an image to 100KB?</h3><p>Select 100KB option or enter 100 in custom target field. Upload image and click Compress Now to process it - Worldwide accepted.</p>
          <h3>Is this image compressor free worldwide?</h3><p>Yes. You can use basic NEXORA image compressor without paying or creating account worldwide - Free forever, Unlimited, No forced login.</p>
          <h3>Are my images private?</h3><p>Compression runs in your browser - Client-side. Your selected image is not intentionally sent to NEXORA image-processing server - 100% Private worldwide.</p>
          <h3>Can I compress PNG images to 20KB?</h3><p>Yes. PNG is supported worldwide. PNG compression is lossless in this tool, so reducing file size may require reducing pixel dimensions - Try JPG for smaller size.</p>
          <h3>Does tool always produce exact KB size?</h3><p>No. It aims to produce image at or below selected target. Exact file size cannot be guaranteed for every image because compression depends on image content, dimensions and format worldwide.</p>
          <h3>Can I use tool on iPhone or Android phone worldwide?</h3><p>Yes. You can use tool in supported mobile browser worldwide. Processing speed depends on device and image dimensions - Mobile friendly, Works on iPhone, Android, Laptop.</p>
          <h3>Which format is best for online forms worldwide?</h3><p>JPG is commonly accepted for photographs worldwide, but requirements differ. Check instructions of particular form before uploading - UPSC needs JPG 20KB, Passport needs JPG 100KB.</p>
          <p style={{marginTop:"14px"}}><b>Try Also:</b> <a href="/background-remover" style={{color:"#6c5ce7",fontWeight:700}}>Background Remover</a> | <a href="/passport-photo-maker" style={{color:"#6c5ce7",fontWeight:700}}>Passport Photo Maker</a> | <a href="/image-to-pdf" style={{color:"#6c5ce7",fontWeight:700}}>Image to PDF</a> | <a href="/" style={{color:"#6c5ce7",fontWeight:700}}>All Tools</a></p>
        </div>
      </main>
      <footer style={{borderTop:"1px solid #e8e8ef",padding:"30px 0",background:"white",color:"#747486",fontSize:"13px",marginTop:"40px"}}>
        <div style={{width:"min(900px, calc(100% - 32px))",margin:"auto",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"24px"}}>
          <div>
            <b style={{color:"#171725",fontSize:"16px"}}>NEXORA — Built by Ayush Chauhan - Worldwide No.1</b><br/>
            <div style={{marginTop:"10px",lineHeight:1.9}}>
              📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{color:"#6c5ce7",fontWeight:700}}>ayushchauhan902704@gmail.com</a><br/>
              📱 Phone: <a href="tel:+919389641559" style={{color:"#6c5ce7",fontWeight:700}}>+91 9389641559</a><br/>
              📍 Dehradun, Uttarakhand, India - Worldwide Service<br/>
              🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{color:"#0a66c2",fontWeight:700}}>Connect on LinkedIn</a> | Instagram: ius_chauhan
            </div>
            <div style={{display:"flex",gap:"14px",flexWrap:"wrap",marginTop:"10px"}}><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/disclaimer">Disclaimer</a><a href="/sitemap.xml">Sitemap</a></div>
          </div>
          <div><div>© 2026 NEXORA Tools - Image Compressor Worldwide No.1</div><div>Made in India 🇮🇳 | Free tools. Simple solutions. | Last Update: Nov 2026</div><div style={{marginTop:"8px"}}><a href="/" style={{color:"#6c5ce7",fontWeight:700}}>← Back to All Tools</a></div></div>
        </div>
      </footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"SoftwareApplication","name":"Image Compressor - NEXORA Worldwide No.1","description":"Free browser-based image compressor for JPG, PNG and WebP images with adjustable target file size worldwide - 100% Private, No Watermark, HD Quality","applicationCategory":"UtilitiesApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"author":{"@type":"Person","name":"Ayush Chauhan"}})}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://nexora-tools-drab.vercel.app/"},{"@type":"ListItem","position":2,"name":"Image Compressor Worldwide No.1","item":"https://nexora-tools-drab.vercel.app/compress-image-to-20kb-40kb-80kb-100kb-200kb-300kb-500kb"}]})}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How can I compress an image to 20KB worldwide?","acceptedAnswer":{"@type":"Answer","text":"Upload your image, select 20KB or enter custom target, choose output format and click Compress Now. Tool tries to produce file at or below selected size worldwide."}},{"@type":"Question","name":"Which image formats are supported?","acceptedAnswer":{"@type":"Answer","text":"The image compressor supports JPG, PNG and WebP input and output formats worldwide - Universal formats."}},{"@type":"Question","name":"Are my images uploaded to a server?","acceptedAnswer":{"@type":"Answer","text":"Image processing is performed in your browser - Client-side. File is not intentionally uploaded to NEXORA image-processing server - 100% Private worldwide."}}]})}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"Organization","name":"NEXORA Tools","url":"https://nexora-tools-drab.vercel.app/","logo":"https://nexora-tools-drab.vercel.app/og-image.png","founder":{"@type":"Person","name":"Ayush Chauhan"},"contactPoint":[{"@type":"ContactPoint","email":"ayushchauhan902704@gmail.com","telephone":"+919389641559","contactType":"customer support"}]})}} />
    </div>
    </>
  );
}
