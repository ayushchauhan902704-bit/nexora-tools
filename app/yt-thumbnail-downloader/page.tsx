"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [link, setLink] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    document.title = "YT Thumbnail Downloader HD - Free No Watermark | NEXORA";
  }, []);

  const extractId = (url: string) => {
    const reg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|img\.youtube\.com\/vi\/)([^"&?\/\s]{11})/;
    const m = url.match(reg); return m ? m[1] : null;
  };

  const getThumb = () => {
    const found = extractId(link.trim());
    if (!found) { alert("Valid YouTube link daalo bhai!"); return; }
    setId(found);
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const res = await fetch(url); const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = blobUrl; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(blobUrl);
    } catch { window.open(url, "_blank"); }
  };

  const thumbs = id ? [
    { label: "Max HD (1280x720)", url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`, name: `nexora-thumbnail-${id}-HD.jpg`, bg: "#111" },
    { label: "High Quality (480x360)", url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`, name: `nexora-thumbnail-${id}-HQ.jpg`, bg: "#333" },
    { label: "Medium Quality", url: `https://img.youtube.com/vi/${id}/mqdefault.jpg`, name: `nexora-thumbnail-${id}-MQ.jpg`, bg: "#555" },
    { label: "Small SD", url: `https://img.youtube.com/vi/${id}/default.jpg`, name: `nexora-thumbnail-${id}-SD.jpg`, bg: "#777" },
  ] : [];

  const card: any = { background: "#fff", border: "1px solid #e5e5ed", borderRadius: 18, padding: 22, marginTop: 18 };
  const h2: any = { fontSize: 18, fontWeight: 900, marginBottom: 8, color: "#171725" };
  const p: any = { fontSize: 13.5, color: "#333", lineHeight: 1.8 };
  const badge: any = { padding: "6px 12px", borderRadius: 999, background: "#eeecff", color: "#5b4bd8", fontSize: 11, fontWeight: 800 };

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", lineHeight: 1.6, minHeight: "100vh", paddingBottom: 20 }}>
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.95)", borderBottom: "1px solid #e8e8ef" }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto", minHeight: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", padding: "10px 0" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, letterSpacing: -1, color: "#171725", textDecoration: "none", whiteSpace: "nowrap" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ ...badge, background: "#e8f5e9", color: "#2e7d32", fontSize: 10, whiteSpace: "nowrap" }}>● PRIVATE • WORLDWIDE</span>
            <a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#6c5ce7", textDecoration: "none", whiteSpace: "nowrap" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <main style={{ width: "min(900px,calc(100% - 24px))", margin: "auto" }}>
        <div style={{ fontSize: 13, color: "#666", margin: "14px 0" }}><a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>Home</a> &gt; <a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>Tools</a> &gt; <span>YT Thumbnail Downloader</span></div>

        <section style={{ padding: "18px 0", textAlign: "center" }}>
          <h1 style={{ fontSize: 28, lineHeight: 1.1, fontWeight: 900, letterSpacing: -1 }}>YT Thumbnail Downloader - Download HD 1280x720 Free Tool</h1>
          <p style={{ color: "#666", fontSize: 13, marginTop: 8 }}>Free, Fast, Private, No Watermark - Works Worldwide</p>
        </section>

        <div style={{ background: "#fff", border: "1px solid #e5e5ed", borderRadius: 20, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,.06)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, marginBottom: 10 }}>Paste YouTube Video Link</h2>
          <input value={link} onChange={e => setLink(e.target.value)} type="text" placeholder="https://www.youtube.com/watch?v=..." style={{ width: "100%", height: 52, border: "1px solid #dcdce7", borderRadius: 12, padding: "0 14px", fontSize: 14, outline: "none", background: "#fff", color: "#171725", boxSizing: "border-box" }} />
          <button onClick={getThumb} style={{ height: 52, border: 0, borderRadius: 12, cursor: "pointer", fontWeight: 800, background: "#6c5ce7", color: "#fff", width: "100%", marginTop: 12 }}>Get Thumbnails</button>

          {id && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
              {thumbs.map((t, i) => (
                <div key={i} style={{ border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
                  <strong style={{ fontSize: 12 }}>{t.label}</strong>
                  <img src={t.url} alt={t.label} onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }} style={{ width: "100%", borderRadius: 8, marginTop: 6, background: "#f5f5f5" }} />
                  <a onClick={() => downloadImage(t.url, t.name)} style={{ display: "block", marginTop: 8, textAlign: "center", background: t.bg, color: "#fff", padding: 10, borderRadius: 8, cursor: "pointer", fontWeight: 800, fontSize: 13 }}>Download {i === 0 ? "HD" : i === 1 ? "HQ" : i === 2 ? "MQ" : "SD"}</a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={card}>
          <h2 style={h2}>What is YT Thumbnail Downloader?</h2>
          <p style={p}>YT Thumbnail Downloader by NEXORA is a free worldwide tool to download any YouTube video thumbnail in HD quality. YouTubers, designers, video editors and students search daily for youtube thumbnail download hd for inspiration, presentations, and editing. Our tool fetches thumbnails directly from YouTube&apos;s official image server img.youtube.com in 4 qualities - MaxRes 1280x720, HQ 480x360, MQ 320x180 and SD 120x90. It is 100% private, browser-based, no server, no watermark, no login. Unlike other heavy ad sites, NEXORA is made in India, fast in 1 second, and works on all devices - iPhone, Android, Laptop. Best for SEO, thumbnail analysis and creative work.</p>
          <h2 style={{ ...h2, marginTop: 18 }}>How to Use YT Thumbnail Downloader? (3 Steps)</h2>
          <p style={p}><b>Step 1: Paste Link</b> - Copy YouTube video link from youtube.com or youtu.be and paste in input box.<br /><b>Step 2: Get Thumbnails</b> - Click Get Thumbnails button, instantly see 4 qualities HD, HQ, MQ, SD.<br /><b>Step 3: Download</b> - Click Download HD button, image saves to your phone or laptop gallery in 1 click.</p>
          <h2 style={{ ...h2, marginTop: 18 }}>Features / Benefits</h2>
          <ul style={{ ...p, paddingLeft: 18 }}><li>✅ HD 1280x720 + 3 more qualities free forever</li><li>✅ 100% Private - No data tracking, link stays in browser</li><li>✅ No Watermark, Fast Worldwide, Made in India</li><li>✅ Mobile Friendly, No App Needed</li><li>✅ Free for YouTubers, Editors, Designers</li></ul>
          <h2 style={{ ...h2, marginTop: 18 }}>FAQ</h2>
          <p style={p}><b>Q1. Is this YT Thumbnail Downloader free?</b><br />Yes, 100% free forever, no watermark, HD quality.</p>
          <p style={p}><b>Q2. Is my data safe?</b><br />Yes, 100% safe. Your link never leaves your phone, 100% browser-based private processing.</p>
          <p style={p}><b>Q3. How accurate is this tool?</b><br />100% accurate, directly fetches from YouTube official CDN img.youtube.com, same as original.</p>
          <p style={{ marginTop: 16, fontSize: 11, color: "#888" }}>Author: Ayush Chauhan</p>
        </div>

        <div style={card}>
          <h2 style={h2}>Explore Other NEXORA Tools</h2>
          <p style={p}>🔗 <a href="/qr-code-generator" style={{ color: "#6c5ce7", fontWeight: 700 }}>QR Code Generator</a> - Create QR for Link, Text, WiFi<br />🔗 <a href="/jpg-to-pdf" style={{ color: "#6c5ce7", fontWeight: 700 }}>JPG to PDF</a> - 50 Images to Single PDF<br />🔗 <a href="/password-generator" style={{ color: "#6c5ce7", fontWeight: 700 }}>Password Generator</a> - Strong Secure Password<br />🔗 <a href="/" style={{ color: "#6c5ce7", fontWeight: 700 }}>All Tools</a></p>
        </div>
      </main>

      <footer style={{ marginTop: 30, borderTop: "1px solid #e8e8ef", background: "#fff", padding: "28px 0", fontSize: 13, color: "#666" }}>
        <div style={{ width: "min(900px,calc(100% - 24px))", margin: "auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between" }}>
            <div><b>NEXORA Tools</b><br /><a href="/about">About Us</a> | <a href="/contact">Contact</a> | <a href="/privacy">Privacy</a> | <a href="/terms">Terms</a> | <a href="/">All Tools</a></div>
            <div><b>Contact - Ayush Chauhan</b><br />→ LinkedIn: linkedin.com/in/ayush-chauhan<br />→ Gmail: ayushchauhan902704@gmail.com</div>
          </div>
          <p style={{ marginTop: 16, fontSize: 11, textAlign: "center" }}>© 2026 NEXORA - Made in India with ❤️ | Not affiliated with YouTube</p>
        </div>
      </footer>
    </div>
  );
}
