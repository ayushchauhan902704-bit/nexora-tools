"use client";
import { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const send = (e: any) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !msg.trim()) { alert("Saare box bharo bhai!"); return; }
    const subject = encodeURIComponent(`NEXORA Contact - ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
    window.location.href = `mailto:ayushchauhan902704@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const input: any = { width: "100%", padding: 13, border: "1px solid #dedee8", borderRadius: 12, fontSize: 15, outline: "none", boxSizing: "border-box", background: "#fff", color: "#171725" };
  const label: any = { fontWeight: 600, fontSize: 14, display: "block", margin: "14px 0 6px" };

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", lineHeight: 1.6, minHeight: "100vh" }}>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid #e8e8ef", zIndex: 10 }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 25, fontWeight: 900, letterSpacing: -1, textDecoration: "none", color: "#171725" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <nav style={{ display: "flex", gap: 22, fontSize: 14, fontWeight: 600, color: "#555566" }}><a href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</a><a href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</a><a href="/contact" style={{ textDecoration: "none", color: "inherit" }}>Contact</a></nav>
        </div>
      </header>

      <main>
        <div style={{ textAlign: "center", padding: "50px 0 20px", width: "min(900px,calc(100% - 32px))", margin: "auto" }}>
          <h1 style={{ fontSize: 38 }}>Contact <span style={{ color: "#6c5ce7" }}>NEXORA</span></h1>
          <p style={{ color: "#676778", marginTop: 6 }}>We reply within 24 hours – feedback, bug, new tool idea?</p>
        </div>

        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto" }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 18, padding: 28, margin: "18px 0" }}>
            <h2 style={{ marginBottom: 8 }}>Send Message</h2>
            <form onSubmit={send}>
              <label style={label}>Name</label><input style={input} value={name} onChange={e => setName(e.target.value)} placeholder="Ayush Chauhan" />
              <label style={label}>Email</label><input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" />
              <label style={label}>Message</label><textarea style={{ ...input, minHeight: 110 }} rows={5} value={msg} onChange={e => setMsg(e.target.value)} placeholder="Hi, please add SIP Calculator..." />
              <button type="submit" style={{ background: "#6c5ce7", color: "#fff", border: 0, padding: 14, borderRadius: 12, fontWeight: 700, width: "100%", marginTop: 14, cursor: "pointer" }}>Send Email →</button>
            </form>
            <p style={{ fontSize: 12, color: "#888", textAlign: "center", marginTop: 8 }}>{sent ? "✅ Gmail khul gaya? Send dabaa dena!" : "Clicking send will open your Gmail / Email app"}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: "#f9f9ff", border: "1px solid #e8e8ef", borderRadius: 12, padding: 16, fontSize: 14 }}><b>📧 Email</b><br /><a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700, wordBreak: "break-all", textDecoration: "none" }}>ayushchauhan902704@gmail.com</a><br /><span style={{ color: "#777" }}>Best way – reply in 12 hours</span></div>
            <div style={{ background: "#f9f9ff", border: "1px solid #e8e8ef", borderRadius: 12, padding: 16, fontSize: 14 }}><b>📱 Phone</b><br /><a href="tel:+919389641559" style={{ color: "#6c5ce7", fontWeight: 700, textDecoration: "none" }}>+91 9389641559</a><br /><span style={{ color: "#777" }}>Dehradun, Uttarakhand, India</span></div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 18, padding: 28, margin: "18px 0" }}>
            <b>Before contacting:</b>
            <p style={{ fontSize: 14, color: "#44445a", marginTop: 6 }}>Tool ka naam zarur likhna – jaise “Loan EMI me bug hai” – taaki jaldi fix kar saku.</p>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "30px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 30 }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div><b style={{ color: "#171725" }}>NEXORA</b><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}><a href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</a><a href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</a><a href="/contact" style={{ textDecoration: "none", color: "inherit" }}>Contact</a><a href="/privacy" style={{ textDecoration: "none", color: "inherit" }}>Privacy</a><a href="/terms" style={{ textDecoration: "none", color: "inherit" }}>Terms</a><a href="/disclaimer" style={{ textDecoration: "none", color: "inherit" }}>Disclaimer</a><a href="/sitemap.xml" style={{ textDecoration: "none", color: "inherit" }}>Sitemap</a></div></div>
          <div>© 2026 NEXORA – Built by Ayush Chauhan</div>
        </div>
      </footer>
    </div>
  );
}
