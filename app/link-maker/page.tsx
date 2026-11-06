"use client";
import { useState, useRef } from "react";

export default function Page() {
  const [tab, setTab] = useState("photo");
  const [preview, setPreview] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Text / WhatsApp / UPI / Location / Short Link ke liye
  const [textInput, setTextInput] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [waMsg, setWaMsg] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiName, setUpiName] = useState("");
  const [upiAmt, setUpiAmt] = useState("");
  const [locInput, setLocInput] = useState("");
  const [longLink, setLongLink] = useState("");

  const reset = () => { setLink(""); setPreview(""); setCopied(false); setProgress(0); };

  // ---------- FILE UPLOAD - Photo / Video / PDF / Audio / Any File ----------
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

  const uploadOne = async (blob: Blob | File, name: string): Promise<string> => {
    const doFetch = async (url: string, form: FormData, parse: (r: any) => Promise<string>) => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 25000);
      try {
        const r = await fetch(url, { method: "POST", body: form, signal: ctrl.signal });
        clearTimeout(t);
        return await parse(r);
      } catch (e) { clearTimeout(t); throw e; }
    };
    try {
      const f = new FormData(); f.append("reqtype", "fileupload"); f.append("fileToUpload", blob, name);
      const t = await doFetch("https://catbox.moe/user/api.php", f, async (r) => (await r.text()).trim());
      if (t.startsWith("http")) return t;
    } catch {}
    try {
      const f = new FormData(); f.append("file", blob, name);
      const u = await doFetch("https://tmpfiles.org/api/v1/upload", f, async (r) => {
        const j = await r.json();
        return j?.data?.url?.replace("tmpfiles.org/", "tmpfiles.org/dl/") || "";
      });
      if (u.startsWith("http")) return u;
    } catch {}
    try {
      const f = new FormData(); f.append("file", blob, name);
      const t = await doFetch("https://0x0.st", f, async (r) => (await r.text()).trim());
      if (t.startsWith("http")) return t;
    } catch {}
    try {
      const f = new FormData(); f.append("file", blob, name);
      const u = await doFetch("https://file.io/?expires=14d", f, async (r) => {
        const j = await r.json();
        return j?.link || "";
      });
      if (u.startsWith("http")) return u;
    } catch {}
    throw new Error("fail");
  };

  const handleFile = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // Tab ke hisab se check
    if (tab === "photo" && !f.type.startsWith("image/")) { alert("Sirf Photo chuno!"); return; }
    if (tab === "video" && !f.type.startsWith("video/")) { alert("Sirf Video chuno!"); return; }
    if (tab === "pdf" && f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) { alert("Sirf PDF chuno!"); return; }
    if (tab === "audio" && !f.type.startsWith("audio/")) { alert("Sirf Audio / Song chuno!"); return; }
    if (tab === "video") {
      if (f.size > 100 * 1024 * 1024) { alert("Video 100MB se chhoti rakho!"); return; }
      const dur = await getVideoDuration(f);
      if (dur > 30) { alert(`Video ${Math.round(dur)} sec ki hai! 10-30 sec ki video chuno.`); return; }
    } else {
      if (f.size > 100 * 1024 * 1024) { alert("File 100MB se chhoti rakho!"); return; }
    }
    setFileName(f.name);
    setFileSize((f.size / 1024 / 1024).toFixed(2) + " MB");
    setIsVideo(f.type.startsWith("video/"));
    setPreview(URL.createObjectURL(f));
    setLink(""); setCopied(false);
    setUploading(true); setProgress(20);
    try {
      let toUpload: Blob | File = f;
      let name = f.name;
      if (f.type.startsWith("image/")) { toUpload = await compressImage(f); name = "nexora-photo.jpg"; }
      setProgress(60);
      const l = await uploadOne(toUpload, name);
      setProgress(100);
      setLink(l);
    } catch {
      alert("Upload nahi hui. Net check karo, Safari Private Mode band karo, dobara try karo.");
      setProgress(0);
    }
    setUploading(false);
  };

  // ---------- TEXT / WHATSAPP / UPI / LOCATION / SHORT LINK ----------
  const makeTextLink = () => {
    if (!textInput.trim()) { alert("Pehle text likho!"); return; }
    // Text ko base64 me karke ek shareable link banega - Koi server nahi chahiye
    const encoded = btoa(unescape(encodeURIComponent(textInput.trim())));
    const l = `${window.location.origin}/link-maker?text=${encoded}`;
    setLink(l);
    setPreview("");
  };

  const makeWaLink = () => {
    let num = waNumber.replace(/[^0-9]/g, "");
    if (num.length === 10) num = "91" + num;
    if (num.length !== 12) { alert("Sahi 10 digit number dalo!"); return; }
    const l = `https://wa.me/${num}${waMsg.trim() ? `?text=${encodeURIComponent(waMsg.trim())}` : ""}`;
    setLink(l);
  };

  const makeUpiLink = () => {
    if (!upiId.trim()) { alert("UPI ID dalo!"); return; }
    let l = `upi://pay?pa=${upiId.trim()}&pn=${encodeURIComponent(upiName.trim() || "NEXORA")}&cu=INR`;
    if (upiAmt.trim()) l += `&am=${upiAmt.trim()}`;
    setLink(l);
  };

  const makeLocLink = () => {
    if (!locInput.trim()) { alert("Jagah ka naam ya address dalo!"); return; }
    const l = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locInput.trim())}`;
    setLink(l);
  };

  const makeShortLink = async () => {
    if (!longLink.trim().startsWith("http")) { alert("Sahi link dalo - https:// se shuru hona chahiye"); return; }
    setUploading(true);
    try {
      // is.gd - Free Shortener, CORS allow
      const r = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(longLink.trim())}`);
      const t = (await r.text()).trim();
      if (t.startsWith("http")) { setLink(t); }
      else { setLink(longLink.trim()); alert("Short nahi hua, lambi wali link hi copy kar lo."); }
    } catch { setLink(longLink.trim()); alert("Short nahi hua, net check karo."); }
    setUploading(false);
  };

  const copyLink = async () => {
    if (!link) return;
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch {
      const t = document.createElement("textarea"); t.value = link; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); setCopied(true);
    }
  };

  const openQR = () => {
    if (!link) return;
    window.location.href = `/qr-generator?link=${encodeURIComponent(link)}`;
  };

  const card: any = { background: "#fff", border: "1px solid #e8e8ef", borderRadius: 20, padding: 20, margin: "16px 0" };
  const input: any = { width: "100%", padding: 13, border: "1px solid #dedee8", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", marginTop: 8, background: "#fff", color: "#171725" };
  const tabStyle = (active: boolean): any => ({ flex: 1, padding: "10px 6px", borderRadius: 12, border: active ? "2px solid #6c5ce7" : "1px solid #e5e7eb", background: active ? "#f0efff" : "#fff", color: active ? "#6c5ce7" : "#555", fontWeight: 800, fontSize: 11, cursor: "pointer", textAlign: "center", minWidth: 70 });
  const btnMain: any = { width: "100%", padding: 14, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6c5ce7,#a66bff)", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", marginTop: 12 };

  const fileAccept = tab === "photo" ? "image/*" : tab === "video" ? "video/*" : tab === "pdf" ? "application/pdf" : tab === "audio" ? "audio/*" : "*/*";

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", minHeight: "100vh", paddingBottom: 20, overflowX: "hidden" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e8ef", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", minHeight: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, color: "#171725", textDecoration: "none" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#6c5ce7", textDecoration: "none" }}>← All Tools</a>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 24px))", margin: "auto" }}>
        <div style={card}>
          <span style={{ display: "inline-flex", background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800 }}>🔗 Sab Kuch Ki Link Banao • Photo • Video • PDF • Audio • File • Text • WhatsApp • UPI • Location • Short Link</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>Link Maker - Sab Kuch Ki Link</h1>
          <p style={{ color: "#676778", fontSize: 13, marginTop: 6 }}>Kisi bhi cheez ki link banao. Photo, Video, PDF, Audio, File, Text, WhatsApp, UPI, Location, Short Link - Sab ek jagah. Link copy karo, WhatsApp pe bhejo, ya QR banao.</p>

          {/* TABS */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
            <button onClick={() => { setTab("photo"); reset(); }} style={tabStyle(tab === "photo")}>📷 Photo</button>
            <button onClick={() => { setTab("video"); reset(); }} style={tabStyle(tab === "video")}>🎥 Video</button>
            <button onClick={() => { setTab("pdf"); reset(); }} style={tabStyle(tab === "pdf")}>📄 PDF</button>
            <button onClick={() => { setTab("audio"); reset(); }} style={tabStyle(tab === "audio")}>🎵 Audio</button>
            <button onClick={() => { setTab("file"); reset(); }} style={tabStyle(tab === "file")}>📁 Any File</button>
            <button onClick={() => { setTab("text"); reset(); }} style={tabStyle(tab === "text")}>📝 Text</button>
            <button onClick={() => { setTab("whatsapp"); reset(); }} style={tabStyle(tab === "whatsapp")}>💬 WhatsApp</button>
            <button onClick={() => { setTab("upi"); reset(); }} style={tabStyle(tab === "upi")}>💸 UPI</button>
            <button onClick={() => { setTab("location"); reset(); }} style={tabStyle(tab === "location")}>📍 Location</button>
            <button onClick={() => { setTab("short"); reset(); }} style={tabStyle(tab === "short")}>✂️ Short Link</button>
          </div>

          {/* FILE WALE TABS - Photo / Video / PDF / Audio / File */}
          {["photo", "video", "pdf", "audio", "file"].includes(tab) && (
            <div style={{ marginTop: 14 }}>
              <div onClick={() => !uploading && fileRef.current?.click()} style={{ border: "2px dashed #6c5ce7", borderRadius: 14, padding: 16, textAlign: "center", background: "#f0efff", cursor: "pointer" }}>
                <input ref={fileRef} type="file" accept={fileAccept} onChange={handleFile} style={{ display: "none" }} />
                {preview ? (
                  <>
                    {isVideo ? <video src={preview} controls style={{ width: "100%", maxHeight: 200, borderRadius: 10, background: "#000" }} />
                    : tab === "photo" ? <img src={preview} style={{ width: "100%", maxHeight: 180, objectFit: "contain", borderRadius: 10, background: "#fff" }} alt="preview" />
                    : <div style={{ fontSize: 40 }}>{tab === "pdf" ? "📄" : tab === "audio" ? "🎵" : "📁"}</div>}
                    <p style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>{fileName} • {fileSize}</p>
                    <button onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "#fff", color: "#6c5ce7", fontWeight: 800, fontSize: 12, cursor: "pointer", marginTop: 6 }}>Dusri File Chuno</button>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 34 }}>{tab === "photo" ? "📷" : tab === "video" ? "🎥" : tab === "pdf" ? "📄" : tab === "audio" ? "🎵" : "📁"}</div>
                    <p style={{ fontWeight: 800, fontSize: 13, marginTop: 6 }}>{tab === "photo" ? "Photo Chuno - Uska Link Banega" : tab === "video" ? "Video Chuno - 10-30 Sec - Uska Link Banega" : tab === "pdf" ? "PDF Chuno - Menu / Resume / Notes - Uska Link Banega" : tab === "audio" ? "Audio / Song Chuno - Uska Link Banega" : "Koi Bhi File Chuno - ZIP / APK / Doc - Uska Link Banega"}</p>
                    <p style={{ fontSize: 11, color: "#666" }}>100MB tak • Auto Upload hoga</p>
                    <button style={{ padding: "11px 20px", borderRadius: 10, border: "none", background: "#6c5ce7", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", marginTop: 8 }}>📁 File Chuno</button>
                  </>
                )}
              </div>
              {uploading && <><p style={{ fontSize: 12, fontWeight: 800, color: "#6c5ce7", marginTop: 10, textAlign: "center" }}>Link Ban Raha Hai... {progress}%</p><div style={{ width: "100%", background: "#e5e7eb", height: 6, borderRadius: 99, marginTop: 6 }}><div style={{ width: `${progress}%`, background: "#6c5ce7", height: 6, borderRadius: 99 }}></div></div></>}
            </div>
          )}

          {/* TEXT */}
          {tab === "text" && <div style={{ marginTop: 14 }}><label style={{ fontSize: 12, fontWeight: 700 }}>Koi bhi Text / Message / Password / Address</label><textarea style={{ ...input, minHeight: 80 }} rows={4} value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="e.g. Shop ka address, Secret message, Offer..." /><button onClick={makeTextLink} style={btnMain}>📝 Is Text Ki Link Banao →</button></div>}

          {/* WHATSAPP */}
          {tab === "whatsapp" && <div style={{ marginTop: 14 }}><label style={{ fontSize: 12, fontWeight: 700 }}>WhatsApp Number (10 digit)</label><input style={input} value={waNumber} onChange={e => setWaNumber(e.target.value)} placeholder="e.g. 9389641559" /><label style={{ fontSize: 12, fontWeight: 700, display: "block", marginTop: 10 }}>Pehle se likha Message (Optional)</label><input style={input} value={waMsg} onChange={e => setWaMsg(e.target.value)} placeholder="e.g. Hello, mujhe order karna hai" /><button onClick={makeWaLink} style={btnMain}>💬 WhatsApp Link Banao →</button><p style={{ fontSize: 11, color: "#666", marginTop: 6 }}>Is link pe click karte hi WhatsApp khul jayega, chat shuru ho jayegi.</p></div>}

          {/* UPI */}
          {tab === "upi" && <div style={{ marginTop: 14 }}><label style={{ fontSize: 12, fontWeight: 700 }}>UPI ID</label><input style={input} value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="e.g. 9389641559@paytm" /><label style={{ fontSize: 12, fontWeight: 700, display: "block", marginTop: 10 }}>Naam</label><input style={input} value={upiName} onChange={e => setUpiName(e.target.value)} placeholder="e.g. Ayush Kirana Store" /><label style={{ fontSize: 12, fontWeight: 700, display: "block", marginTop: 10 }}>Amount (Optional)</label><input style={input} value={upiAmt} onChange={e => setUpiAmt(e.target.value)} placeholder="e.g. 100" /><button onClick={makeUpiLink} style={btnMain}>💸 UPI Payment Link Banao →</button></div>}

          {/* LOCATION */}
          {tab === "location" && <div style={{ marginTop: 14 }}><label style={{ fontSize: 12, fontWeight: 700 }}>Dukaan / Ghar / Jagah Ka Naam Ya Address</label><input style={input} value={locInput} onChange={e => setLocInput(e.target.value)} placeholder="e.g. Clock Tower, Dehradun" /><button onClick={makeLocLink} style={btnMain}>📍 Location Link Banao →</button><p style={{ fontSize: 11, color: "#666", marginTop: 6 }}>Is link pe click karte hi Google Maps khul jayega.</p></div>}

          {/* SHORT LINK */}
          {tab === "short" && <div style={{ marginTop: 14 }}><label style={{ fontSize: 12, fontWeight: 700 }}>Lambi Link Paste Karo</label><input style={input} value={longLink} onChange={e => setLongLink(e.target.value)} placeholder="https://bahut-lambi-link..." /><button onClick={makeShortLink} disabled={uploading} style={btnMain}>{uploading ? "Chhoti Ho Rahi Hai..." : "✂️ Chhoti Link Banao →"}</button><p style={{ fontSize: 11, color: "#666", marginTop: 6 }}>Instagram Bio, WhatsApp Status me chhoti link achhi lagti hai.</p></div>}

          {/* RESULT - Sabke liye same */}
          {link && (
            <div style={{ marginTop: 16, border: "1.5px solid #16a34a", borderRadius: 14, padding: 14, background: "#f0fdf4" }}>
              <b style={{ fontSize: 13 }}>✅ Teri Link Ban Gayi:</b>
              <p style={{ fontSize: 12, color: "#166534", wordBreak: "break-all", marginTop: 6, background: "#fff", padding: 10, borderRadius: 8, border: "1px solid #bbf7d0" }}>{link}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                <button onClick={copyLink} style={{ padding: 13, borderRadius: 10, border: "none", background: "#16a34a", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>{copied ? "✅ Copy Ho Gaya!" : "📋 Copy Link"}</button>
                <a href={link} target="_blank" rel="noreferrer" style={{ padding: 13, borderRadius: 10, background: "#fff", color: "#6c5ce7", border: "1.5px solid #6c5ce7", fontWeight: 800, fontSize: 13, textAlign: "center", textDecoration: "none", display: "block" }}>👀 Link Kholo ↗</a>
              </div>
              <button onClick={openQR} style={{ width: "100%", padding: 13, borderRadius: 10, border: "none", background: "#6c5ce7", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", marginTop: 10 }}>📷 Is Link Ka QR Banao →</button>
            </div>
          )}
          <p style={{ fontSize: 11, color: "#888", textAlign: "center", marginTop: 10 }}>Note: File wali link public hoti hai. Private photo / document ka link mat banao.</p>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>Is Tool Se Kya-Kya Link Banegi?</h2>
          <ul style={{ fontSize: 12.5, color: "#4a4a5a", lineHeight: 1.8, paddingLeft: 18, marginTop: 6 }}>
            <li><b>📷 Photo Link</b> - Product, Shaadi, Meme ki link</li>
            <li><b>🎥 Video Link</b> - Reel, Promo, Birthday video ki link</li>
            <li><b>📄 PDF Link</b> - Menu, Price List, Resume, Notes ki link</li>
            <li><b>🎵 Audio Link</b> - Song, Voice Note, Podcast ki link</li>
            <li><b>📁 Any File Link</b> - ZIP, APK, Doc ki link</li>
            <li><b>📝 Text Link</b> - Message, Address ki link</li>
            <li><b>💬 WhatsApp Link</b> - Chat wali link</li>
            <li><b>💸 UPI Link</b> - Payment wali link</li>
            <li><b>📍 Location Link</b> - Dukaan ka Maps link</li>
            <li><b>✂️ Short Link</b> - Lambi link ko chhoti karo</li>
          </ul>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "36px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 40 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div><b style={{ color: "#171725", fontSize: 18 }}>NEXORA — Built by Ayush Chauhan</b><div style={{ marginTop: 8 }}>📧 ayushchauhan902704@gmail.com<br />📍 Dehradun, Uttarakhand, India</div></div>
          <div><div style={{ background: "#f6f7fb", border: "1px solid #e8e8ef", borderRadius: 12, padding: "12px 16px", textAlign: "right" }}><div style={{ fontWeight: 800, color: "#171725" }}>© 2026 NEXORA Tools</div><div>Made in India 🇮🇳</div></div></div>
        </div>
      </footer>
    </div>
  );
}
