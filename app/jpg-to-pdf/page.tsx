"use client";
import { useState, useEffect, useRef } from "react";

type ImgItem = { url: string; width: number; height: number };

export default function Page() {
  const [images, setImages] = useState<ImgItem[]>([]);
  const [size, setSize] = useState("a4");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "JPG to PDF Converter - Convert 50 JPG to PDF Free No Watermark | NEXORA";
  }, []);

  const readAsDataURL = (file: File) => new Promise<string>((res, rej) => {
    const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = () => rej(new Error("read fail")); r.readAsDataURL(file);
  });
  const loadImage = (src: string) => new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image(); img.onload = () => res(img); img.onerror = () => rej(new Error("img fail")); img.src = src;
  });
  const fixAndCompress = (img: HTMLImageElement) => {
    const maxSide = 2000; let w = img.naturalWidth, h = img.naturalHeight;
    const scale = Math.min(1, maxSide / Math.max(w, h));
    w = Math.max(1, Math.round(w * scale)); h = Math.max(1, Math.round(h * scale));
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const ctx = c.getContext("2d")!; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); ctx.drawImage(img, 0, 0, w, h);
    return { data: c.toDataURL("image/jpeg", 0.85), width: w, height: h };
  };

  const handleFiles = async (list: FileList | File[]) => {
    if (busy) return;
    const available = 50 - images.length;
    const selected = Array.from(list || []);
    if (!selected.length) return;
    if (available <= 0) { setStatus("Maximum 50 photos allowed."); return; }
    const files = selected.slice(0, available);
    setStatus("Preparing photos...");
    const newImgs: ImgItem[] = [];
    for (const file of files) {
      try {
        if (!file.type.startsWith("image/")) continue;
        const dataURL = await readAsDataURL(file);
        const img = await loadImage(dataURL);
        const fixed = fixAndCompress(img);
        newImgs.push({ url: fixed.data, width: fixed.width, height: fixed.height });
      } catch {}
    }
    if (newImgs.length) {
      setImages(prev => [...prev, ...newImgs]);
      setPdfUrl(null); setPdfBlob(null); setStatus(`${newImgs.length} photo(s) added. Click Convert & Preview.`);
    } else setStatus("No supported photos could be added.");
  };

  const convertPDF = async () => {
    if (!images.length) { alert("Pehle photos upload karo!"); return; }
    if (busy) return;
    setBusy(true); setStatus("Converting...");
    try {
      const { jsPDF } = await import("jspdf");
      let doc: any = null;
      for (let i = 0; i < images.length; i++) {
        setStatus(`Converting photo ${i + 1} of ${images.length}...`);
        const item = images[i];
        if (size === "fit") {
          const wMM = item.width * 25.4 / 96, hMM = item.height * 25.4 / 96;
          const orientation = wMM > hMM ? "landscape" : "portrait";
          if (!doc) doc = new jsPDF({ orientation, unit: "mm", format: [wMM, hMM], compress: true });
          else doc.addPage([wMM, hMM], orientation);
          doc.addImage(item.url, "JPEG", 0, 0, wMM, hMM, undefined, "FAST");
        } else {
          const format = size === "letter" ? "letter" : "a4";
          if (!doc) doc = new jsPDF({ orientation: "portrait", unit: "mm", format, compress: true });
          else doc.addPage(format, "portrait");
          const pw = doc.internal.pageSize.getWidth(), ph = doc.internal.pageSize.getHeight();
          const ratio = Math.min((pw - 20) / item.width, (ph - 20) / item.height);
          const w = item.width * ratio, h = item.height * ratio;
          doc.addImage(item.url, "JPEG", (pw - w) / 2, (ph - h) / 2, w, h, undefined, "FAST");
        }
        await new Promise(r => setTimeout(r, 0));
      }
      const name = `NEXORA-Photos-${Date.now()}.pdf`;
      setFileName(name);
      const blob = doc.output("blob");
      setPdfBlob(blob);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setStatus("PDF ready! Preview dekho, phir Download PDF dabao.");
    } catch {
      setStatus("PDF banane mein problem hui. Kam photos ke saath dobara try karo.");
    }
    setBusy(false);
  };

  const downloadPDF = async () => {
    if (!pdfBlob) { alert("Pehle Convert & Preview par click karo!"); return; }
    try {
      const file = new File([pdfBlob], fileName, { type: "application/pdf" });
      if (typeof navigator.share === "function" && typeof (navigator as any).canShare === "function" && (navigator as any).canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "NEXORA PDF" });
        setStatus("PDF ready. Sharing complete or choose Save to Files.");
        return;
      }
    } catch {}
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a"); a.href = url; a.download = fileName; document.body.appendChild(a); a.click(); a.remove();
    setStatus("PDF download started. Check your Downloads folder.");
    setTimeout(() => URL.revokeObjectURL(url), 120000);
  };

  const card: any = { background: "#fff", borderRadius: 24, padding: 20, border: "1px solid #e5e7eb", marginTop: 20 };
  const h2: any = { fontSize: 17, fontWeight: 900, color: "#111827" };
  const p: any = { fontSize: 12.5, color: "#4b5563", lineHeight: 1.8, marginTop: 12 };

  return (
    <div style={{ background: "#f6f7fb", color: "#111827", minHeight: "100vh", padding: 12, fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`
        select, select option { color:#000 !important; -webkit-text-fill-color:#000 !important; background:#fff !important; opacity:1 !important; }
        select { -webkit-appearance:none; appearance:none; }
      `}</style>
      <div style={{ maxWidth: 768, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", flexWrap: "wrap", gap: 8 }}>
          <a href="/" style={{ fontWeight: 900, fontSize: 18, color: "#111827", textDecoration: "none" }}>NEX<span style={{ color: "#4f46e5" }}>ORA</span> Tools</a>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 800, background: "#f0fdf4", color: "#15803d", padding: "4px 10px", borderRadius: 20, border: "1px solid #bbf7d0" }}>● 100% PRIVATE</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#eef2ff", color: "#4338ca", padding: "4px 10px", borderRadius: 20 }}>✅ NO WATERMARK</span>
          </div>
        </div>

        <div style={card}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-block", background: "#eef2ff", color: "#4338ca", padding: "8px 16px", borderRadius: 20, fontSize: 11, fontWeight: 900, border: "1px solid #c7d2fe", marginBottom: 12 }}>📄 NEXORA FREE TOOL - 50 IMAGES • NO WATERMARK HD</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, lineHeight: 1.2, color: "#111827" }}>JPG to PDF Converter - 50 Images to One PDF</h1>
            <p style={{ color: "#6b7280", marginTop: 8, fontSize: 12, lineHeight: 1.6 }}>Convert JPG, JPEG, PNG, WEBP to PDF Free. No Watermark, 100% Private, HD — Made in India.</p>
          </div>

          {/* FIX 1 - Photo wala box CHHOTA kar diya - Upar se neeche tak */}
          <div onClick={() => !busy && fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }} style={{ marginTop: 16, border: "2px dashed #818cf8", borderRadius: 14, padding: "14px 12px", textAlign: "center", background: "#eef2ff", cursor: "pointer" }}>
            <div style={{ fontSize: 28, lineHeight: 1 }}>📁</div>
            <div style={{ fontWeight: 800, fontSize: 14, marginTop: 6, color: "#000" }}>Select or Drag Photos Here</div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/*" multiple hidden onChange={async e => { await handleFiles(e.target.files!); e.target.value = ""; }} />
            <button type="button" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }} style={{ marginTop: 10, background: "#4f46e5", color: "#fff", fontWeight: 700, padding: "9px 20px", borderRadius: 10, border: "none", fontSize: 13 }}>Choose Photos</button>
            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 8, fontWeight: 700 }}>JPG, JPEG, PNG, WEBP - Up to 50 Photos - No Watermark HD</p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}><div style={{ fontWeight: 800, fontSize: 13, color: "#000" }}>Your Photos</div><div style={{ fontSize: 13, color: "#6b7280", fontWeight: 700 }}>{images.length} / 50 photos</div></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
            {images.map((item, i) => (
              <div key={i} style={{ position: "relative", height: 110, overflow: "hidden", borderRadius: 10, border: "1px solid #e5e7eb", background: "#f3f4f6" }}>
                <img src={item.url} alt={`Photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                <span style={{ position: "absolute", left: 6, top: 6, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 6 }}>{i + 1}</span>
                <button onClick={() => { if (busy) return; setImages(prev => prev.filter((_, idx) => idx !== i)); setPdfUrl(null); setPdfBlob(null); setStatus("Photo removed."); }} style={{ position: "absolute", top: 4, right: 4, width: 26, height: 26, borderRadius: "50%", background: "#ef4444", color: "#fff", fontWeight: 700, border: "none" }}>×</button>
              </div>
            ))}
          </div>
          {images.length === 0 && <div style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", padding: "14px 0" }}>Your selected photos will appear here.</div>}

          {/* FIX 2 - PDF Page Size BLACK TEXT me - Ab pakka dikhega */}
          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", fontWeight: 800, fontSize: 13, marginBottom: 6, color: "#000" }}>PDF Page Size - Size Chuno:</label>
            <select value={size} onChange={e => setSize(e.target.value)} style={{ width: "100%", background: "#ffffff", color: "#000000", WebkitTextFillColor: "#000000", border: "1.5px solid #111", fontWeight: 700, padding: "11px 12px", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box" }}>
              <option value="a4" style={{ color: "#000", background: "#fff" }}>A4 — Standard printing size (Best for India)</option>
              <option value="letter" style={{ color: "#000", background: "#fff" }}>US Letter — US standard</option>
              <option value="fit" style={{ color: "#000", background: "#fff" }}>Fit Image — Original aspect ratio, No white margin</option>
            </select>
            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 5 }}>Abhi chuna: <b style={{ color: "#000" }}>{size === "a4" ? "A4 - Best for India" : size === "letter" ? "US Letter" : "Fit Image - No Margin"}</b></p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
            <button onClick={convertPDF} disabled={busy} style={{ background: "#fff", border: "2px solid #4f46e5", color: "#4f46e5", fontWeight: 800, padding: "13px 8px", borderRadius: 10, fontSize: 14 }}>👁️ Convert & Preview</button>
            <button onClick={downloadPDF} disabled={!pdfBlob} style={{ background: "#4f46e5", color: "#fff", fontWeight: 800, padding: "13px 8px", borderRadius: 10, fontSize: 14, border: "none", opacity: !pdfBlob ? 0.5 : 1 }}>⬇️ Download PDF</button>
          </div>
          <button onClick={() => { if (busy) return; setImages([]); setPdfUrl(null); setPdfBlob(null); setStatus("All photos cleared."); }} style={{ width: "100%", marginTop: 10, background: "#f3f4f6", fontWeight: 700, padding: "10px", borderRadius: 10, fontSize: 13, border: "none", color: "#000" }}>Clear All</button>
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, fontWeight: 700, color: "#4f46e5" }}>{status}</div>

          {/* FIX 3 - Preview SAHI kar diya - Object se PDF sahi dikhega */}
          {pdfUrl && <div style={{ marginTop: 16, border: "1.5px solid #111", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
              <b style={{ fontSize: 12, color: "#000" }}>📄 PDF Preview - {images.length} Photos - {fileName}</b>
              <a href={pdfUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 800, color: "#4f46e5" }}>Open Full ↗</a>
            </div>
            <object data={pdfUrl} type="application/pdf" width="100%" height="420" style={{ display: "block", background: "#fff" }}>
              <iframe src={pdfUrl} title="PDF Preview" style={{ width: "100%", height: 420, border: "none", display: "block", background: "#fff" }} />
            </object>
            <div style={{ padding: "8px 10px", fontSize: 11, color: "#6b7280", textAlign: "center" }}>Preview nahi dikh raha? <a href={pdfUrl} target="_blank" rel="noreferrer" style={{ color: "#4f46e5", fontWeight: 800 }}>Yaha Click Karke Full PDF Dekho</a> ya Download dabao.</div>
          </div>}
          <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 14, fontWeight: 700 }}>100% Private - Your photos never leave your phone. No watermark PDF, HD Quality.</p>
        </div>

        <div style={card}>
          <h2 style={h2}>Why NEXORA No.1 JPG to PDF?</h2>
          <p style={p}>NEXORA JPG to PDF is simple — 50 JPG JPEG PNG WEBP to single PDF at once, no watermark, HD quality, 100% private — photos never leave your phone, browser-based conversion. A4 for India printing, US Letter for US, Fit Image keeps original ratio no white margin. Best for students — notes, assignments, forms to PDF.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, marginTop: 16, color: "#4f46e5" }}>How to Convert JPG to PDF - 3 Easy Steps</h3>
          <p style={p}><b>Step 1:</b> Select or Drag — Upload up to 50 JPG JPEG PNG WEBP photos<br /><b>Step 2:</b> Select Page Size — A4 best for India, Letter for US, Fit for original ratio<br /><b>Step 3:</b> Convert & Preview → Download — Preview PDF in browser, then Download no watermark PDF.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, marginTop: 16, color: "#4f46e5" }}>Features</h3>
          <ul style={{ ...p, paddingLeft: 20 }}><li>✅ 50 Images to One PDF</li><li>✅ No Watermark, HD Quality, Free Forever</li><li>✅ 100% Private — Photos never leave phone</li><li>✅ A4, US Letter, Fit Image — 3 Page Sizes</li><li>✅ Preview Before Download</li><li>✅ Works on iPhone, Android, Laptop</li></ul>
          {/* 8-9 SAFE KEYWORDS - Google ko problem nahi hogi, natural likhe hai */}
          <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.7, marginTop: 12 }}>Log is tool ko in naamo se dhoondte hai: jpg to pdf, photo to pdf, image to pdf, jpg to pdf converter, photo se pdf kaise banaye, jpg to pdf online, png to pdf, multiple photos to one pdf, free jpg to pdf no watermark. Ye sab ek hi tool me milta hai - NEXORA JPG to PDF.</p>
        </div>

        <div style={card}>
          <h2 style={h2}>NEXORA vs Others - Comparison</h2>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <tbody>
                <tr style={{ background: "#eef2ff" }}><th style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "left", color: "#000" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, color: "#000" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, color: "#000" }}>Others ❌</th></tr>
                <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Images Limit</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>50 Images ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>20 Only</td></tr>
                <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Watermark HD ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Watermark / Logo</td></tr>
                <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>100% Private ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Uploads to Server</td></tr>
                <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid After 2</td></tr>
                <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Preview</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Preview ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Preview</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={card}>
          <h2 style={h2}>FAQ - JPG to PDF</h2>
          <p style={p}>
            <b>Q: How to convert JPG to PDF?</b><br />A: Upload up to 50 JPG, select A4 or Fit, click Convert & Preview, then Download — No watermark.<br /><br />
            <b>Q: Photo se PDF kaise banaye?</b><br />A: Photo select karo, Convert dabao, Preview dekho, Download karo - Photo to PDF ban jayega.<br /><br />
            <b>Q: Can I convert 50 JPG to one PDF?</b><br />A: Yes, NEXORA allows 50 JPG to single PDF at once.<br /><br />
            <b>Q: Is it private and free?</b><br />A: Yes, 100% private, photos never leave phone, browser conversion, free forever.<br /><br />
            <b>Try Also:</b> <a href="/pdf-to-jpg" style={{ color: "#4f46e5", fontWeight: 700 }}>PDF to JPG</a> | <a href="/compress-image" style={{ color: "#4f46e5", fontWeight: 700 }}>Compress Image</a> | <a href="/" style={{ color: "#4f46e5", fontWeight: 700 }}>All Tools</a>
          </p>
        </div>

        <div style={{ ...card, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, fontSize: 13, lineHeight: 1.8, color: "#64748b" }}>
            <div><div style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>NEX<span style={{ color: "#6366f1" }}>ORA</span> — Built by Ayush Chauhan</div><div style={{ marginTop: 8 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6366f1", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div></div>
            <div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontWeight: 700, marginBottom: 8 }}><a href="/about" style={{ color: "#111827" }}>About</a><a href="/contact" style={{ color: "#111827" }}>Contact</a><a href="/privacy" style={{ color: "#111827" }}>Privacy</a><a href="/terms" style={{ color: "#111827" }}>Terms</a></div><div>© 2026 NEXORA Tools - JPG to PDF Converter</div><div>Made in India 🇮🇳 | Free tools. Simple solutions.</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6366f1", fontWeight: 700 }}>← Back to All Tools</a></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
