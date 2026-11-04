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
    return () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); };
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

  return (
    <div className="bg-[#f6f7fb] p-3 sm:p-5 text-gray-900 min-h-screen" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <nav className="max-w-3xl mx-auto flex justify-between items-center py-3">
        <a href="/" className="font-black text-lg">NEX<span className="text-indigo-600">ORA</span> Tools</a>
        <div className="flex gap-2">
          <span className="text-xs font-black bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">● 100% PRIVATE</span>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">✅ NO WATERMARK</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto py-3 sm:py-6">
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-[11px] font-black mb-4 border border-indigo-200">📄 NEXORA FREE TOOL - 50 IMAGES • NO WATERMARK HD</div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">JPG to PDF Converter - 50 Images to One PDF</h1>
            <p className="text-gray-500 mt-3 text-[13px]">Convert JPG, JPEG, PNG, WEBP to PDF Free. No Watermark, 100% Private, HD — Made in India.</p>
          </div>

          <div onClick={() => !busy && fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }} className="mt-7 border-[2px] border-dashed border-indigo-400 rounded-2xl p-8 sm:p-12 text-center bg-indigo-50/50 cursor-pointer hover:bg-indigo-50">
            <div className="text-5xl">📁</div>
            <div className="font-extrabold text-lg mt-3">Select or Drag Photos Here</div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/*" multiple hidden onChange={async e => { await handleFiles(e.target.files!); e.target.value = ""; }} />
            <button type="button" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }} className="mt-5 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl">Choose Photos</button>
            <p className="text-xs text-gray-400 mt-3 font-bold">JPG, JPEG, PNG, WEBP Supported - Up to 50 Photos - No Watermark HD</p>
          </div>

          <div className="flex justify-between mt-5"><div className="font-extrabold text-sm">Your Photos</div><div className="text-sm text-gray-500 font-bold">{images.length} / 50 photos</div></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
            {images.map((item, i) => (
              <div key={i} className="relative h-[125px] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                <img src={item.url} alt={`Photo ${i + 1}`} className="w-full h-full object-contain" />
                <span className="absolute left-2 top-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md">{i + 1}</span>
                <button onClick={() => { if (busy) return; setImages(prev => prev.filter((_, idx) => idx !== i)); setPdfUrl(null); setPdfBlob(null); setStatus("Photo removed."); }} className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-500 text-white font-bold">×</button>
              </div>
            ))}
          </div>
          {images.length === 0 && <div className="text-center text-sm text-gray-400 py-5">Your selected photos will appear here.</div>}

          <div className="mt-5">
            <label className="block font-bold text-sm mb-2">PDF Page Size</label>
            <select value={size} onChange={e => setSize(e.target.value)} className="w-full bg-gray-50 border border-gray-200 font-semibold py-3 px-4 rounded-xl text-sm">
              <option value="a4">A4 — Standard printing size (Best for India)</option>
              <option value="letter">US Letter — US standard</option>
              <option value="fit">Fit Image — Original aspect ratio, No white margin</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button onClick={convertPDF} disabled={busy} className="bg-white border-2 border-indigo-600 text-indigo-600 font-extrabold py-4 rounded-xl text-base">👁️ Convert & Preview</button>
            <button onClick={downloadPDF} disabled={!pdfBlob} className={`font-extrabold py-4 rounded-xl text-base ${!pdfBlob ? "bg-indigo-600 text-white opacity-50" : "bg-indigo-600 text-white"}`}>⬇️ Download PDF</button>
          </div>
          <button onClick={() => { if (busy) return; setImages([]); setPdfUrl(null); setPdfBlob(null); setStatus("All photos cleared."); }} className="w-full mt-3 bg-gray-100 font-bold py-3 rounded-xl text-sm">Clear All</button>
          <div className="text-center mt-4 text-sm font-bold text-indigo-600">{status}</div>
          {pdfUrl && <iframe src={pdfUrl} title="PDF Preview" className="w-full h-[500px] border-2 border-gray-200 rounded-xl mt-4 block" />}
          <p className="text-center text-xs text-gray-400 mt-5 font-bold">100% Private - Your photos never leave your phone. No watermark PDF, HD Quality.</p>
        </div>

        {/* BLUEPRINT - WHY NEXORA */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 mt-6">
          <h2 className="text-[17px] font-black">Why NEXORA No.1 JPG to PDF?</h2>
          <p className="text-[12.5px] text-gray-600 leading-7 mt-3">Unlike other sites with limit, watermark and server upload, NEXORA JPG to PDF is simple — 50 JPG JPEG PNG WEBP to single PDF at once, no watermark, HD quality, 100% private — photos never leave your phone, browser-based conversion. A4 for India printing, US Letter for US, Fit Image keeps original ratio no white margin. Best for students — notes, assignments, forms to PDF.</p>
          <h3 className="text-[13px] font-black mt-5 text-indigo-600">How to Convert JPG to PDF - 3 Easy Steps</h3>
          <p className="text-[12.5px] text-gray-600 leading-7 mt-2"><b>Step 1:</b> Select or Drag — Upload up to 50 JPG JPEG PNG WEBP photos<br /><b>Step 2:</b> Select Page Size — A4 best for India, Letter for US, Fit for original ratio<br /><b>Step 3:</b> Convert & Preview → Download — Preview PDF in browser, then Download no watermark PDF.</p>
          <h3 className="text-[13px] font-black mt-5 text-indigo-600">Features</h3>
          <ul className="text-[12.5px] text-gray-600 leading-7 mt-2 list-disc pl-5"><li>✅ 50 Images to One PDF</li><li>✅ No Watermark, HD Quality, Free Forever</li><li>✅ 100% Private — Photos never leave phone</li><li>✅ A4, US Letter, Fit Image — 3 Page Sizes</li><li>✅ Preview Before Download</li><li>✅ Works on iPhone, Android, Laptop</li></ul>
        </div>

        {/* BLUEPRINT - COMPARISON */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 mt-6">
          <h2 className="text-[17px] font-black">NEXORA vs Others - Comparison</h2>
          <div className="overflow-auto mt-3"><table className="w-full border-collapse text-[12px]"><tbody>
            <tr className="bg-indigo-50"><th className="border p-2 text-left">Feature</th><th className="border p-2">NEXORA ✅</th><th className="border p-2">Others ❌</th></tr>
            <tr><td className="border p-2">Images Limit</td><td className="border p-2 text-center">50 Images ✅</td><td className="border p-2 text-center">20 Only</td></tr>
            <tr><td className="border p-2">Watermark</td><td className="border p-2 text-center">No Watermark HD ✅</td><td className="border p-2 text-center">Watermark / Logo</td></tr>
            <tr><td className="border p-2">Privacy</td><td className="border p-2 text-center">100% Private In Browser ✅</td><td className="border p-2 text-center">Uploads to Server</td></tr>
            <tr><td className="border p-2">Price</td><td className="border p-2 text-center">Free Forever ✅</td><td className="border p-2 text-center">Paid After 2</td></tr>
            <tr><td className="border p-2">Preview</td><td className="border p-2 text-center">Preview Before Download ✅</td><td className="border p-2 text-center">No Preview</td></tr>
          </tbody></table></div>
        </div>

        {/* BLUEPRINT - FAQ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 mt-6">
          <h2 className="text-[17px] font-black">FAQ - JPG to PDF</h2>
          <p className="text-[12.5px] text-gray-600 leading-7 mt-3">
            <b>Q: How to convert JPG to PDF?</b><br />A: Upload up to 50 JPG, select A4 or Fit, click Convert & Preview, then Download — No watermark.<br /><br />
            <b>Q: Can I convert 50 JPG to one PDF?</b><br />A: Yes, NEXORA allows 50 JPG to single PDF at once.<br /><br />
            <b>Q: Is it private and free?</b><br />A: Yes, 100% private, photos never leave phone, browser conversion, free forever.<br /><br />
            <b>Q: JPG to PDF kaise kare?</b><br />A: Photos select karo, Convert dabao, Preview dekho, Download karo.<br /><br />
            <b>Try Also:</b> <a href="/pdf-to-jpg" className="text-indigo-600 font-bold">PDF to JPG</a> | <a href="/compress-image" className="text-indigo-600 font-bold">Compress Image</a> | <a href="/" className="text-indigo-600 font-bold">All Tools</a>
          </p>
        </div>

        {/* BLUEPRINT - FOOTER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mt-6">
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, fontSize: 13, lineHeight: 1.8, color: "#64748b" }}>
            <div><div style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>NEX<span style={{ color: "#6366f1" }}>ORA</span> — Built by Ayush Chauhan</div><div style={{ marginTop: 8 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6366f1", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div></div>
            <div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontWeight: 700, marginBottom: 8 }}><a href="/about" style={{ color: "#111827" }}>About</a><a href="/contact" style={{ color: "#111827" }}>Contact</a><a href="/privacy" style={{ color: "#111827" }}>Privacy</a><a href="/terms" style={{ color: "#111827" }}>Terms</a></div><div>© 2026 NEXORA Tools - JPG to PDF Converter</div><div>Made in India 🇮🇳 | Free tools. Simple solutions.</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6366f1", fontWeight: 700 }}>← Back to All Tools</a></div></div>
          </div>
        </div>
      </main>
    </div>
  );
}
