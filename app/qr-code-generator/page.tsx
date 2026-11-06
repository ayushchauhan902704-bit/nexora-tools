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

  // PHOTO TO QR - Naya
  const [photoLink, setPhotoLink] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

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
    if (type === "photo") return photoLink.trim();
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

  // PHOTO UPLOAD - Photo ka Link banega, wahi QR me jayega
  const handlePhotoUpload = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { alert("Sirf photo chuno!"); return; }
    if (f.size > 5 * 1024 * 1024) { alert("Photo 5MB se chhoti rakho!"); return; }
    // Pehle preview dikhao
    setPhotoPreview(URL.createObjectURL(f));
    setUploading(true);
    setQrDataUrl("");
    try {
      const form = new FormData();
      form.append("file", f);
      const res = await fetch("https://0x0.st", { method: "POST", body: form });
      const link = (await res.text()).trim();
      if (!link.startsWith("http")) throw new Error("fail");
      setPhotoLink(link);
    } catch {
      try {
        const form2 = new FormData();
        form2.append("reqtype", "fileupload");
        form2.append("fileToUpload", f);
        const res2 = await fetch("https://catbox.moe/user/api.php", { method: "POST", body: form2 });
        const link2 = (await res2.text()).trim();
        if (!link2.startsWith("http")) throw new Error("fail2");
        setPhotoLink(link2);
      } catch {
        alert("Photo upload nahi hui. Dobara try karo ya chhoti photo lo.");
      }
    }
    setUploading(false);
  };

  const generate = async () => {
    if (type === "photo" && !photoLink) { alert("Pehle photo chuno! Photo upload hogi, fir QR banega."); return; }
    if (!data) { alert("Pehle data daalo bhai! Link / UPI / Text / WiFi / Photo"); return; }
    if (mode === "logo" && !logoFile) { alert("Logo wala select kiya hai to pehle logo upload karo!"); return; }
    setLoading(true);
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=10&data=${encodeURIComponent(data)}`;
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

      if (mode === "logo" && logoFile) {
        const lImg = new Image();
        lImg.src = logoFile;
        await new Promise((res) => { lImg.onload = res; lImg.onerror = res; });
        const size = 120;
        const x = (600 - size) / 2, y = (600 - size) / 2;
        ctx.fillStyle = "#fff";
        ctx.fillRect(x - 12, y - 12, size + 24, size + 24);
        ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 3;
        ctx.strokeRect(x - 12, y - 12, size + 24, size + 24);
        ctx.drawImage(lImg, x, y, size, size);
      }

      setQrDataUrl(canvas.toDataURL("image/png"));
      setLoading(false);
      setTimeout(() => { document.getElementById("qr-result")?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
    } catch {
      setLoading(false);
      alert("Net slow hai, dobara try karo");
    }
  };

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `NEXORA-QR-${mode}-${type}-${Date.now()}.png`;
    a.click();
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
          <span style={badge}>📱 Link, UPI, Text, WiFi, Photo • With Logo / Normal • No Watermark PNG HD • Free</span>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.7, marginTop: 8 }}>QR Code Generator</h1>
          <p style={{ color: "#676778", margin: "8px 0", fontSize: 13 }}>Normal QR ya Logo wala QR banao - Link, UPI Payment, Text, WiFi, Photo sabke liye. Download PNG HD, No Watermark.</p>

          <label style={{ fontSize: 11, fontWeight: 800, color: "#555" }}>1️⃣ CHOOSE STYLE - Kaisa QR Chahiye?</label>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={() => setMode("normal")} style={{ ...tab(mode === "normal"), fontSize: 14, padding: 14 }}>⬜ Normal QR<br /><span style={{ fontSize: 11, fontWeight: 500 }}>Fast Scan • Clean</span></button>
            <button onClick={() => setMode("logo")} style={{ ...tab(mode === "logo"), fontSize: 14, padding: 14 }}>🖼️ With Logo QR<br /><span style={{ fontSize: 11, fontWeight: 500 }}>Shop Logo Beech Me</span></button>
          </div>

          {mode === "logo" && (
            <div style={{ marginTop: 12, background: "#f0efff", border: "1.5px dashed #6c5ce7", borderRadius: 14, padding: 14, textAlign: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 800 }}>📤 Apna Logo / Photo Upload Karo</p>
              <p style={{ fontSize: 11, color: "#666" }}>Shop logo, Instagram DP, koi bhi photo - beech me aayega</p>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
              <button onClick={() => fileRef.current?.click()} style={{ width: "auto", padding: "10px 18px", borderRadius: 10, border: "none", background: "#6c5ce7", color: "#fff", fontWeight: 800, cursor: "pointer", marginTop: 10, fontSize: 13 }}>{logoUrl ? "✅ Logo Lag Gaya - Change Karo" : "Choose Logo / Photo"}</button>
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
          </div>

          <div style={{ marginTop: 12 }}>
            {type === "link" && <><label style={{ fontSize: 12, fontWeight: 700 }}>Website / Instagram / YouTube / WhatsApp Link</label><input style={input} value={link} onChange={e => setLink(e.target.value)} placeholder="https://instagram.com/tera-shop ya https://youtube.com/..." /></>}
            {type === "upi" && <><label style={{ fontSize: 12, fontWeight: 700 }}>UPI ID</label><input style={input} value={upi} onChange={e => setUpi(e.target.value)} placeholder="e.g. 9389641559@paytm ya name@okhdfc" /><label style={{ fontSize: 12, fontWeight: 700, display: "block", marginTop: 10 }}>Shop / Tumhara Naam (QR me dikhega)</label><input style={input} value={upiName} onChange={e => setUpiName(e.target.value)} placeholder="e.g. Ayush Kirana Store" /><p style={{ fontSize: 11, color: "#666", marginTop: 6 }}>Customer scan karega to direct payment khulega - {upi ? `upi://pay?pa=${upi}` : ""}</p></>}
            {type === "text" && <><label style={{ fontSize: 12, fontWeight: 700 }}>Koi bhi Text</label><textarea style={{ ...input, minHeight: 70 }} rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="e.g. Shop address, Menu, Offer..." /></>}
            {type === "wifi" && <><label style={{ fontSize: 12, fontWeight: 700 }}>WiFi Name (SSID)</label><input style={input} value={wifiName} onChange={e => setWifiName(e.target.value)} placeholder="e.g. MyWiFi" /><label style={{ fontSize: 12, fontWeight: 700, display: "block", marginTop: 10 }}>WiFi Password</label><input style={input} value={wifiPass} onChange={e => setWifiPass(e.target.value)} placeholder="WiFi password" /><p style={{ fontSize: 11, color: "#666", marginTop: 6 }}>Guest scan karte hi WiFi se connect ho jayega, password type nahi karna padega.</p></>}

            {/* PHOTO TO QR - Naya Box */}
            {type === "photo" && <div style={{ border: "2px dashed #6c5ce7", borderRadius: 14, padding: 14, textAlign: "center", background: "#f0efff" }}>
              <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
              {photoPreview ? (
                <>
                  <img src={photoPreview} style={{ width: "100%", maxHeight: 180, objectFit: "contain", borderRadius: 10, background: "#fff" }} alt="photo" />
                  {uploading ? <p style={{ fontSize: 12, fontWeight: 800, color: "#6c5ce7", marginTop: 8 }}>⏳ Photo Upload Ho Rahi Hai... Link Ban Raha Hai...</p>
                  : photoLink ? <><p style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginTop: 8, wordBreak: "break-all" }}>✅ Photo Link Ban Gaya: {photoLink}</p><p style={{ fontSize: 11, color: "#666" }}>Ab Generate dabao - Is photo ka QR ban jayega. Scan karte hi ye photo khulegi.</p></>
                  : <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>Upload fail hui, dobara chuno.</p>}
                  <button onClick={() => photoRef.current?.click()} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "#fff", color: "#6c5ce7", fontWeight: 800, cursor: "pointer", marginTop: 8, fontSize: 12 }}>📷 Dusri Photo Chuno</button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 32 }}>📷</div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#000", marginTop: 4 }}>Photo Chuno - Uska QR Banega</p>
                  <p style={{ fontSize: 11, color: "#666" }}>QR scan karte hi ye photo khul jayegi. Menu, Product, ID - Kisi bhi photo ka QR banao.</p>
                  <button onClick={() => photoRef.current?.click()} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#6c5ce7", color: "#fff", fontWeight: 800, cursor: "pointer", marginTop: 10, fontSize: 13 }}>📷 Photo Chuno</button>
                  <p style={{ fontSize: 10, color: "#888", marginTop: 6 }}>Photo 5MB se chhoti rakho • Link khud ban jayega, tujhe kuch paste nahi karna</p>
                </>
              )}
            </div>}
          </div>

          <button onClick={generate} disabled={uploading} style={{ width: "100%", padding: 15, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6c5ce7,#a66bff)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 14, opacity: uploading ? 0.6 : 1 }}>{loading ? "⏳ Ban Raha Hai..." : uploading ? "⏳ Photo Upload Ho Rahi Hai..." : mode === "logo" ? "🖼️ Generate Logo QR →" : type === "photo" ? "📷 Generate Photo QR →" : "Generate QR Code →"}</button>

          {qrDataUrl && (
            <div id="qr-result" style={{ textAlign: "center", marginTop: 16 }}>
              <img src={qrDataUrl} style={{ maxWidth: 280, width: "100%", height: "auto", display: "block", margin: "0 auto", border: "1px solid #eee", borderRadius: 14, background: "#fff" }} alt="QR Code" />
              <p style={{ fontSize: 12, color: "#555", marginTop: 8, wordBreak: "break-all" }}>Data: <b>{data}</b></p>
              {type === "photo" && <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 800 }}>✅ Is QR ko scan karte hi teri photo khul jayegi 📷</p>}
              <button onClick={download} style={{ width: "100%", padding: 13, borderRadius: 12, background: "#fff", color: "#6c5ce7", border: "1.5px solid #6c5ce7", fontWeight: 800, cursor: "pointer", marginTop: 10 }}>⬇️ Download QR PNG - No Watermark HD ({mode === "logo" ? "With Logo" : "Normal"})</button>
              <p style={{ fontSize: 11, color: "#888", marginTop: 6 }}>Tip: Logo wala QR thoda dur se scan karo, aur print karne se pehle ek baar phone se scan karke check kar lo.</p>
            </div>
          )}
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>Why NEXORA QR Generator?</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 8, lineHeight: 1.7 }}>NEXORA QR Generator — 600x600 PNG HD, clean, no watermark, private, free forever. Best for India shops — <b>Normal QR</b> fast scan ke liye, <b>Logo QR</b> branding ke liye - shop ka logo beech me. <b>Photo QR</b> - Photo upload karo, uska QR banao, scan karte hi photo khulegi. UPI payment QR: UPI ID daalo, customer scans and pays. Link → QR for business card, menu, Instagram, shop. WiFi → QR scan karke auto connect. No signup, no watermark, no limit. Made in India.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6c5ce7", marginTop: 12 }}>How to Create QR - 3 Easy Steps</h3>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 6, lineHeight: 1.7 }}><b>Step 1:</b> Style Chuno — Normal ya With Logo<br /><b>Step 2:</b> Type Chuno — Link / UPI / Text / WiFi / Photo + Data Daalo<br /><b>Step 3:</b> Generate + Download — PNG HD no watermark for shop menu card.</p>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: "#6c5ce7", marginTop: 12 }}>Features</h3>
          <ul style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 6, lineHeight: 1.7, paddingLeft: 18 }}><li>✅ 2 Styles — Normal QR + Logo QR</li><li>✅ Link, UPI Payment, Text, WiFi, Photo — Sab Types QR</li><li>✅ 600x600 PNG HD — Clean No Watermark Printable</li><li>✅ Photo QR — Scan karte hi photo khulegi</li><li>✅ UPI QR — name@upi Scan Pay for Shop</li><li>✅ WiFi QR — Guests Scan Connect Auto</li><li>✅ Free Forever No Watermark No Signup Unlimited</li></ul>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>NEXORA vs Others - Comparison</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>NEXORA ✅</th><th style={{ border: "1px solid #e5e7eb", padding: 8, background: "#f5f3ff" }}>Others ❌</th></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Logo QR</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Logo QR ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid $5+/mo</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Photo QR</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Photo to QR ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No Photo QR</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Quality</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>600x600 PNG HD ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>200px Low</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>UPI QR</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>UPI Payment QR ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>No UPI</td></tr>
            <tr><td style={{ border: "1px solid #e5e7eb", padding: 8 }}>Price</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Free Forever ✅</td><td style={{ border: "1px solid #e5e7eb", padding: 8, textAlign: "center" }}>Paid</td></tr>
          </tbody></table>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 900 }}>FAQ - QR Code Generator</h2>
          <p style={{ fontSize: 12.5, color: "#4a4a5a", marginTop: 8, lineHeight: 1.7 }}><b>Q: Photo ka QR kaise banaye?</b><br />A: Photo wala button dabao, Photo chuno, Generate dabao - QR scan karte hi photo khul jayegi. Link dalne ki zaroorat nahi, link khud ban jayega.<br /><br /><b>Q: Logo wala QR scan hoga?</b><br />A: Haan, logo chhota rakha hai + white box diya hai, isliye scan ho jayega. Phir bhi print se pehle ek baar scan karke check karo.<br /><br /><b>Q: UPI QR kaise banaye?</b><br />A: UPI tab me UPI ID daalo, Generate dabao, customer scan karke pay karega.<br /><br /><b>Q: WiFi QR kaise kaam karta hai?</b><br />A: WiFi Name + Password daalo, QR banao, guest scan karte hi connect ho jayega.<br /><br /><b>Q: Is it free?</b><br />A: Yes, 100% free, private, no watermark, PNG HD 600x600.<br /><br />Try Also: <a href="/password-generator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Password Generator</a> | <a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>All Tools</a></p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "36px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 40 }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
          <div><b style={{ color: "#171725", fontSize: 18 }}>NEXORA — Built by Ayush Chauhan</b><div style={{ marginTop: 10, lineHeight: 1.9 }}>📧 Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br />📍 Dehradun, Uttarakhand, India<br />🔗 <a href="https://www.linkedin.com/in/ayush-chauhan-0b0960444" target="_blank" style={{ color: "#0a66c2", fontWeight: 700 }}>Connect on LinkedIn</a></div><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, fontWeight: 700 }}><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div></div>
          <div><div style={{ background: "#f6f7fb", border: "1px solid #e8e8ef", borderRadius: 12, padding: "12px 16px", textAlign: "right" }}><div style={{ fontWeight: 800, color: "#171725" }}>© 2026 NEXORA Tools - QR Generator</div><div>Made in India 🇮🇳 | No Watermark</div><div style={{ marginTop: 6 }}><a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>← Back to All Tools</a></div></div></div>
        </div>
      </footer>
    </div>
  );
}
