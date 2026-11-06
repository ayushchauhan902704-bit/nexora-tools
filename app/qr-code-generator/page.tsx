"use client";
import { useState, useRef } from "react";

export default function Page() {
  const [mode, setMode] = useState<"normal" | "logo">("normal");
  const [type, setType] = useState("link");
  const [link, setLink] = useState("");
  const [upi, setUpi] = useState("");
  const [upiName, setUpiName] = useState("");
  const [text, setText] = useState("");
  const [wifiName, setWifiName] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [mediaLink, setMediaLink] = useState("");
  const [manualLink, setManualLink] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const mediaRef = useRef<HTMLInputElement>(null);

  const getData = () => {
    if (type === "link") return link.trim();
    if (type === "upi") {
      if (!upi.trim()) return "";
      if (upi.includes("upi://")) return upi.trim();
      return `upi://pay?pa=${upi.trim()}&pn=${encodeURIComponent(upiName.trim() || "NEXORA")}&cu=INR`;
    }
    if (type === "text") return text.trim();
    if (type === "wifi") {
      if (!wifiName.trim()) return "";
      return `WIFI:T:WPA;S:${wifiName.trim()};P:${wifiPass};;`;
    }
    if (type === "photo" || type === "video") return (mediaLink || manualLink).trim();
    return "";
  };
  const data = getData();

  const handleLogoUpload = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setLogoUrl(url);
    const reader = new FileReader();
    reader.onload = () => setLogoFile(reader.result as string);
    reader.readAsDataURL(f);
  };

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const max = 800;
        let w = img.naturalWidth, h = img.naturalHeight;
        if (Math.max(w, h) > max) {
          const s = max / Math.max(w, h);
          w = Math.round(w * s); h = Math.round(h * s);
        }
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        c.toBlob((b) => resolve(b || file), "image/jpeg", 0.6);
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((res) => {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => { URL.revokeObjectURL(v.src); res(v.duration); };
      v.onerror = () => res(0);
      v.src = URL.createObjectURL(file);
    });
  };

  // Sahi Upload - Ek-ek karke, ek saath nahi. Timeout 20 sec
  const uploadOne = async (blob: Blob | File, name: string): Promise<string> => {
    const doFetch = async (url: string, form: FormData, parse: (r: any) => Promise<string>) => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 20000);
      try {
        const r = await fetch(url, { method: "POST", body: form, signal: ctrl.signal });
        clearTimeout(t);
        return await parse(r);
      } catch (e) { clearTimeout(t); throw e; }
    };

    // 1. Catbox - Sabse pehle, iPhone pe sabse achha chalta hai
    try {
      const f = new FormData(); f.append("reqtype", "fileupload"); f.append("fileToUpload", blob, name);
      const t = await doFetch("https://catbox.moe/user/api.php", f, async (r) => (await r.text()).trim());
      if (t.startsWith("http")) return t;
    } catch (e) { console.log("catbox fail"); }

    // 2. TmpFiles
    try {
      const f = new FormData(); f.append("file", blob, name);
      const u = await doFetch("https://tmpfiles.org/api/v1/upload", f, async (r) => {
        const j = await r.json();
        return j?.data?.url?.replace("tmpfiles.org/", "tmpfiles.org/dl/") || "";
      });
      if (u.startsWith("http")) return u;
    } catch (e) { console.log("tmp fail"); }

    // 3. 0x0.st
    try {
      const f = new FormData(); f.append("file", blob, name);
      const t = await doFetch("https://0x0.st", f, async (r) => (await r.text()).trim());
      if (t.startsWith("http")) return t;
    } catch (e) { console.log("0x0 fail"); }

    // 4. File.io
    try {
      const f = new FormData(); f.append("file", blob, name);
      const u = await doFetch("https://file.io/?expires=14d", f, async (r) => {
        const j = await r.json();
        return j?.link || "";
      });
      if (u.startsWith("http")) return u;
    } catch (e) { console.log("fileio fail"); }

    throw new Error("all fail");
  };

  const handleMediaUpload = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const isVideo = f.type.startsWith("video/");
    const isImage = f.type.startsWith("image/");
    if (!isVideo && !isImage) { alert("Sirf Photo ya Video chuno!"); return; }
    if (isVideo) {
      if (f.size > 100 * 1024 * 1024) { alert("Video 100MB se chhoti rakho!"); return; }
      const dur = await getVideoDuration(f);
      if (dur > 25) { alert(`Video ${Math.round(dur)} sec ki hai! 10-20 sec ki video chuno.`); return; }
    } else {
      if (f.size > 50 * 1024 * 1024) { alert("Photo 50MB se chhoti rakho!"); return; }
    }
    setMediaType(isVideo ? "video" : "photo");
    setMediaPreview(URL.createObjectURL(f));
    setShowManual(false);
    setUploading(true); setProgress(20); setQrDataUrl(""); setMediaLink(""); setManualLink("");
    try {
      let toUpload: Blob | File = f;
      let name = f.name;
      if (isImage) {
        toUpload = await compressImage(f);
        name = "nexora-photo.jpg";
      }
      setProgress(60);
      const link = await uploadOne(toUpload, name);
      setProgress(100);
      setMediaLink(link);
      generateQRDirect(link);
    } catch {
      setShowManual(true);
      setProgress(0);
    }
    setUploading(false);
  };

  const useManualLink = () => {
    if (!manualLink.trim().startsWith("http")) { alert("Sahi link paste karo - https:// se shuru hona chahiye"); return; }
    setMediaLink(manualLink.trim());
    generateQRDirect(manualLink.trim());
  };

  const generateQRDirect = async (text: string) => {
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=10&data=${encodeURIComponent(text)}`;
    if (mode !== "logo" || !logoFile) {
      setQrDataUrl(apiUrl);
      setTimeout(() => { document.getElementById("qr-result")?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 50);
      return;
    }
    setLoading(true);
    try {
      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous";
      qrImg.src = apiUrl;
      await new Promise((res, rej) => { qrImg.onload = res; qrImg.onerror = rej; });
      const canvas = document.createElement("canvas");
      canvas.width = 600; canvas.height = 600;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 600, 600);
      ctx.drawImage(qrImg, 0, 0, 600, 600);
      const lImg = new Image(); lImg.src = logoFile;
      await new Promise((res) => { lImg.onload = res; lImg.onerror = res; });
      const size = 120; const x = (600 - size) / 2, y = (600 - size) / 2;
      ctx.fillStyle = "#fff"; ctx.fillRect(x - 12, y - 12, size + 24, size + 24);
      ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 3; ctx.strokeRect(x - 12, y - 12, size + 24, size + 24);
      ctx.drawImage(lImg, x, y, size, size);
      setQrDataUrl(canvas.toDataURL("image/png"));
      setTimeout(() => { document.getElementById("qr-result")?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 50);
    } catch {}
    setLoading(false);
  };

  const generate = async () => {
    if ((type === "photo" || type === "video") && !mediaLink && !manualLink) { alert("Pehle photo / video chuno ya link paste karo!"); return; }
    if (!data) { alert("Pehle data daalo bhai!"); return; }
    if (mode === "logo" && !logoFile) { alert("Logo wala select kiya hai to pehle logo upload karo!"); return; }
    await generateQRDirect(data);
  };

  const download = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NEXORA-QR-${mode}-${type}-${Date.now()}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch {
      const a = document.createElement("a");
      a.href = qrDataUrl;
      a.download = `NEXORA-QR-${Date.now()}.png`;
      a.click();
    }
  };

  const card: any = { background: "#fff", border: "1px solid #e8e8ef", borderRadius: 20, padding: 20, margin: "16px 0", boxShadow: "0 4px 24px rgba(0,0,0,.04)" };
  const badge: any = { display: "inline-flex", background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #c8e6c9" };
  const input: any = { width: "100%", padding: 13, border: "1px solid #dedee8", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", marginTop: 8, background: "#fff", color: "#171725" };
  const tab = (active: boolean): any => ({ flex: 1, padding: "11px 6px", borderRadius: 12, border: active ? "2px solid #6c5ce7" : "1px solid #e5e7eb", background: active ? "#f0efff" : "#fff", color: active ? "#6c5ce7" : "#555", fontWeight: 800, fontSize: 12, cursor: "pointer", textAlign: "center" });

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", minHeight: "100vh", paddingBottom: 20, overflowX: "hidden" }}>
      <style>{`@media(max-width:600px){.qr-tabs{flex-wrap:wrap !important}}`}</style>
      <header style={{ position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #e8e8ef", zIndex: 50 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", minHeight: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", padding: "8px 0" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, color: "#171725", textDecoration: "none" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ ...badge, margin: 0 }}>● UPI QR • LOGO QR • PHOTO QR</span><a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#6c5ce7", textDecoration: "none" }}>← All Tools</a></div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 24px))", margin: "auto" }}>
        <div style={card}>
          <span style={badge}>📱 Link, UPI, Text, WiFi, Photo, Video • No Watermark PNG HD • Free</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.7, marginTop: 8 }}>QR Code Generator</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: 13 }}>Normal QR ya Logo wala QR banao - Link, UPI, Text, WiFi, Photo, Video sabke liye. Download PNG HD.</p>

          <label style={{ fontSize: 11, fontWeight: 800, color: "#555" }}>1️⃣ CHOOSE STYLE - Kaisa QR Chahiye?</label>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={() => setMode("normal")} style={{ ...tab(mode === "normal"), fontSize: 14, padding: 14 }}>⬜ Normal QR<br /><span style={{ fontSize: 11, fontWeight: 500 }}>Fast Scan • Clean</span></button>
            <button onClick={() => setMode("logo")} style={{ ...tab(mode === "logo"), fontSize: 14, padding: 14 }}>🖼️ With Logo QR<br /><span style={{ fontSize: 11, fontWeight: 500 }}>Shop Logo Beech Me</span></button>
          </div>

          {mode === "logo" && (
            <div style={{ marginTop: 12, background: "#f0efff", border: "1.5px dashed #6c5ce7", borderRadius: 14, padding: 14, textAlign: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 800 }}>📤 Apna Logo Upload Karo</p>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
              <button onClick={() => fileRef.current?.click()} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#6c5ce7", color: "#fff", fontWeight: 800, cursor: "pointer", marginTop: 10, fontSize: 13 }}>{logoUrl ? "✅ Logo Lag Gaya - Change Karo" : "Choose Logo / Photo"}</button>
              {logoUrl && <img src={logoUrl} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 12, margin: "10px auto 0", border: "2px solid #fff", display: "block" }} alt="logo" />}
            </div>
          )}

          <label style={{ fontSize: 11, fontWeight: 800, color: "#555", display: "block", marginTop: 16 }}>2️⃣ KIS CHEEZ KA QR BANANA HAI?</label>
          <div className="qr-tabs" style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => setType("link")} style={tab(type === "link")}>🔗 Link</button>
            <button onClick={() => setType("upi")} style={tab(type === "upi")}>💸 UPI</button>
            <button onClick={() => setType("text")} style={tab(type === "text")}>📝 Text</button>
            <button onClick={() => setType("wifi")} style={tab(type === "wifi")}>📶 WiFi</button>
            <button onClick={() => setType("photo")} style={tab(type === "photo")}>📷 Photo</button>
            <button onClick={() => setType("video")} style={tab(type === "video")}>🎥 Video</button>
          </div>

          <div style={{ marginTop: 12 }}>
            {type === "link" && <><label style={{ fontSize: 12, fontWeight: 700 }}>Website / Instagram / YouTube Link</label><input style={input} value={link} onChange={e => setLink(e.target.value)} placeholder="https://instagram.com/tera-shop" /></>}
            {type === "upi" && <><label style={{ fontSize: 12, fontWeight: 700 }}>UPI ID</label><input style={input} value={upi} onChange={e => setUpi(e.target.value)} placeholder="e.g. 9389641559@paytm" /><label style={{ fontSize: 12, fontWeight: 700, display: "block", marginTop: 10 }}>Shop / Tumhara Naam</label><input style={input} value={upiName} onChange={e => setUpiName(e.target.value)} placeholder="e.g. Ayush Kirana Store" /></>}
            {type === "text" && <><label style={{ fontSize: 12, fontWeight: 700 }}>Koi bhi Text</label><textarea style={{ ...input, minHeight: 70 }} rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="e.g. Shop address, Menu, Offer..." /></>}
            {type === "wifi" && <><label style={{ fontSize: 12, fontWeight: 700 }}>WiFi Name (SSID)</label><input style={input} value={wifiName} onChange={e => setWifiName(e.target.value)} placeholder="e.g. MyWiFi" /><label style={{ fontSize: 12, fontWeight: 700, display: "block", marginTop: 10 }}>WiFi Password</label><input style={input} value={wifiPass} onChange={e => setWifiPass(e.target.value)} placeholder="WiFi password" /></>}

            {(type === "photo" || type === "video") && <div style={{ border: "2px dashed #6c5ce7", borderRadius: 14, padding: 14, textAlign: "center", background: "#f0efff" }}>
              <input ref={mediaRef} type="file" accept={type === "photo" ? "image/*" : "video/*"} onChange={handleMediaUpload} style={{ display: "none" }} />
              {mediaPreview ? (
                <>
                  {mediaType === "video" ? <video src={mediaPreview} controls style={{ width: "100%", maxHeight: 220, borderRadius: 10, background: "#000" }} /> : <img src={mediaPreview} style={{ width: "100%", maxHeight: 180, objectFit: "contain", borderRadius: 10, background: "#fff" }} alt="preview" />}
                  {uploading ? <><p style={{ fontSize: 12, fontWeight: 800, color: "#6c5ce7", marginTop: 8 }}>Upload Ho Rahi Hai... {progress}%</p><div style={{ width: "100%", background: "#e5e7eb", height: 6, borderRadius: 99, marginTop: 6 }}><div style={{ width: `${progress}%`, background: "#6c5ce7", height: 6, borderRadius: 99 }}></div></div></>
                  : mediaLink ? <><p style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginTop: 8, wordBreak: "break-all" }}>✅ Link Ban Gaya: {mediaLink}</p><p style={{ fontSize: 11, color: "#666" }}>Scan karte hi ye {mediaType === "video" ? "video chalegi" : "photo khulegi"}.</p></>
                  : <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>Upload fail hui, dobara chuno.</p>}
                  <button onClick={() => mediaRef.current?.click()} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "#fff", color: "#6c5ce7", fontWeight: 800, cursor: "pointer", marginTop: 8, fontSize: 12 }}>{type === "video" ? "🎥 Dusri Video Chuno" : "📷 Dusri Photo Chuno"}</button>

                  {/* MANUAL LINK - Agar auto fail ho jaye to ye kaam ayega */}
                  <div style={{ marginTop: 10 }}>
                    <button onClick={() => setShowManual(!showManual)} style={{ background: "none", border: "none", color: "#6c5ce7", fontWeight: 800, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>{showManual ? "Manual Link Band Karo ↑" : "Auto Upload Nahi Hua? Yaha Link Paste Karo →"}</button>
                    {showManual && <div style={{ background: "#fff", borderRadius: 10, padding: 10, marginTop: 8, textAlign: "left" }}>
                      <p style={{ fontSize: 11, color: "#333", lineHeight: 1.6 }}><b>1.</b> Google me `imgbb.com` kholo<br /><b>2.</b> Photo upload karo, `Copy Link` dabao<br /><b>3.</b> Yaha paste karo, QR ban jayega</p>
                      <input value={manualLink} onChange={e => setManualLink(e.target.value)} placeholder="https://i.ibb.co/... photo ka link yaha paste karo" style={{ width: "100%", padding: 10, border: "1.5px solid #111", borderRadius: 8, fontSize: 12, boxSizing: "border-box", marginTop: 6, color: "#000" }} />
                      <button onClick={useManualLink} style={{ width: "100%", padding: 10, borderRadius: 8, border: "none", background: "#16a34a", color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer", marginTop: 6 }}>✅ Is Link Ka QR Banao →</button>
                    </div>}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 32 }}>{type === "video" ? "🎥" : "📷"}</div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#000", marginTop: 4 }}>{type === "video" ? "Video Chuno - 10-20 Sec - Uska QR Banega" : "Photo Chuno - Badi Photo Bhi Chalegi (50MB Tak) - Uska QR Banega"}</p>
                  <p style={{ fontSize: 11, color: "#666" }}>{type === "video" ? "QR scan karte hi video chalegi. 10-20 sec ki video best hai." : "QR scan karte hi photo khulegi. Badi photo auto chhoti ho jayegi."}</p>
                  <button onClick={() => mediaRef.current?.click()} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#6c5ce7", color: "#fff", fontWeight: 800, cursor: "pointer", marginTop: 10, fontSize: 13 }}>{type === "video" ? "🎥 Video Chuno" : "📷 Photo Chuno"}</button>
                  <p style={{ fontSize: 10, color: "#888", marginTop: 6 }}>Photo 50MB tak • Video 100MB tak, 10-20 sec</p>
                  <button onClick={() => setShowManual(!showManual)} style={{ background: "none", border: "none", color: "#6c5ce7", fontWeight: 700, fontSize: 11, cursor: "pointer", textDecoration: "underline", marginTop: 4 }}>Ya Photo Ka Link Hai To Yaha Paste Karo →</button>
                  {showManual && <div style={{ background: "#fff", borderRadius: 10, padding: 10, marginTop: 8, textAlign: "left" }}>
                    <input value={manualLink} onChange={e => setManualLink(e.target.value)} placeholder="https://i.ibb.co/... link paste karo" style={{ width: "100%", padding: 10, border: "1.5px solid #111", borderRadius: 8, fontSize: 12, boxSizing: "border-box", color: "#000" }} />
                    <button onClick={useManualLink} style={{ width: "100%", padding: 10, borderRadius: 8, border: "none", background: "#16a34a", color: "#fff", fontWeight: 800, fontSize: 12, cursor: "pointer", marginTop: 6 }}>✅ Is Link Ka QR Banao →</button>
                  </div>}
                </>
              )}
            </div>}
          </div>

          <button onClick={generate} disabled={uploading} style={{ width: "100%", padding: 15, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6c5ce7,#a66bff)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 14, opacity: uploading ? 0.6 : 1 }}>{loading ? "⏳ Ban Raha Hai..." : uploading ? `Upload Ho Rahi Hai... ${progress}%` : type === "photo" ? "📷 Generate Photo QR →" : type === "video" ? "🎥 Generate Video QR →" : "Generate QR Code →"}</button>

          {qrDataUrl && (
            <div id="qr-result" style={{ textAlign: "center", marginTop: 16 }}>
              <img src={qrDataUrl} style={{ maxWidth: 280, width: "100%", height: "auto", display: "block", margin: "0 auto", border: "1px solid #eee", borderRadius: 14, background: "#fff" }} alt="QR Code" />
              <p style={{ fontSize: 12, color: "#555", marginTop: 8, wordBreak: "break-all" }}>Data: <b>{data}</b></p>
              {(type === "photo" || type === "video") && <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 800 }}>✅ Scan karte hi teri {type === "video" ? "video chalegi 🎥" : "photo khulegi 📷"}</p>}
              <button onClick={download} style={{ width: "100%", padding: 13, borderRadius: 12, background: "#fff", color: "#6c5ce7", border: "1.5px solid #6c5ce7", fontWeight: 800, cursor: "pointer", marginTop: 10 }}>⬇️ Download QR PNG - No Watermark HD</button>
            </div>
          )}
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>Why NEXORA QR Generator?</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 8, lineHeight: 1.7 }}>NEXORA QR Generator — 600x600 PNG HD, clean, no watermark, free forever. Photo QR - 50MB tak ki badi photo bhi chalegi, auto compress hogi. Video QR - 10-20 sec ki video ka QR banao, scan karte hi video chalegi.</p>
          <ul style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 6, lineHeight: 1.7, paddingLeft: 18 }}><li>✅ Photo QR - 50MB tak, Auto Compress</li><li>✅ Video QR - 10-20 Sec Video</li><li>✅ Link, UPI, Text, WiFi - Sab Types</li><li>✅ 600x600 PNG HD - No Watermark</li><li>✅ Free Forever, No Signup</li></ul>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "36px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 40 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
          <div><b style={{ color: "#171725", fontSize: 18 }}>NEXORA — Built by Ayush Chauhan</b><div style={{ marginTop: 10, lineHeight: 1.9 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India</div></div>
          <div><div style={{ background: "#f6f7fb", border: "1px solid #e8e8ef", borderRadius: 12, padding: "12px 16px", textAlign: "right" }}><div style={{ fontWeight: 800, color: "#171725" }}>© 2026 NEXORA Tools - QR Generator</div><div>Made in India 🇮🇳 | No Watermark</div></div></div>
        </div>
      </footer>
    </div>
  );
}
