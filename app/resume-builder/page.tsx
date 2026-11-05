"use client";
import { useState, useEffect } from "react";

declare global { interface Window { jspdf: any; } }

export default function Page() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [addr, setAddr] = useState("");
  const [obj, setObj] = useState("Seeking an entry-level position where I can utilize my skills to drive innovation.");
  const [edu, setEdu] = useState("B.Tech Computer Science - 2022-2026 - 8.5 CGPA\n12th - 85% - 2022");
  const [skills, setSkills] = useState("HTML, CSS, JavaScript, Python, SEO, React");
  const [exp, setExp] = useState("Projects: JPG to PDF, PDF Merge, Passport Photo Maker");

  useEffect(() => {
    document.title = "Resume Builder Free - ATS Resume PDF No Watermark | NEXORA";
    const load = (src: string) => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const s = document.createElement("script"); s.src = src; document.head.appendChild(s);
    };
    load("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  }, []);

  const downloadPdf = () => {
    if (!window.jspdf) { alert("Library load ho rahi hai, 2 sec baad try karo"); return; }
    if (!name.trim()) { alert("Naam to daalo bhai!"); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 15;
    doc.setFontSize(18); doc.setFont("helvetica", "bold"); doc.text(name, 105, y, { align: "center" }); y += 8;
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.text(`${contact} | ${addr}`, 105, y, { align: "center" }); y += 6;
    doc.line(10, y, 200, y); y += 8;
    const addSec = (title: string, content: string) => {
      doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.text(title, 10, y); y += 6;
      doc.setFontSize(9); doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(content, 185);
      for (const line of lines) { if (y > 280) { doc.addPage(); y = 15; } doc.text(line, 10, y); y += 5; }
      y += 4;
    };
    addSec("OBJECTIVE", obj); addSec("EDUCATION", edu); addSec("SKILLS", skills); addSec("EXPERIENCE / PROJECTS", exp);
    doc.save(`NEXORA-Resume-${name.replace(/\s+/g, "-")}.pdf`);
  };

  const input: any = { width: "100%", padding: "12px", border: "1px solid #e5e7eb", borderRadius: 10, marginTop: 6, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff", color: "#111827", minWidth: 0 };
  const label: any = { fontSize: 11, fontWeight: 800, marginTop: 14, display: "block", color: "#374151" };
  const btn: any = { width: "100%", padding: 14, background: "#111827", color: "#fff", border: "none", borderRadius: 12, fontWeight: 800, marginTop: 14, cursor: "pointer", fontSize: 14 };
  const displayName = name || "Your Name";

  return (
    <div style={{ background: "#f6f7fb", color: "#111827", minHeight: "100vh", fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", overflowX: "hidden" }}>
      {/* 👇 YE FIX HAI - Mobile pe 1 column, Desktop pe 2 column */}
      <style>{`
        .resume-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 1100px; margin: 16px auto; width: calc(100% - 24px); }
        @media (max-width: 800px) {
          .resume-wrap { grid-template-columns: 1fr !important; width: calc(100% - 20px) !important; }
        }
        .resume-input { min-width: 0 !important; }
      `}</style>

      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "#fff", borderBottom: "1px solid #e8e8ef" }}>
        <div style={{ width: "calc(100% - 24px)", maxWidth: 1100, margin: "auto", minHeight: 56, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "8px 0" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 900, color: "#111827", textDecoration: "none", whiteSpace: "nowrap" }}>NEX<span style={{ color: "#6366f1" }}>ORA</span></a>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ background: "#dcfce7", color: "#166534", padding: "5px 10px", borderRadius: 999, fontSize: 10, fontWeight: 800, border: "1px solid #bbf7d0", whiteSpace: "nowrap" }}>● ATS • PRIVATE</span>
            <a href="/" style={{ fontWeight: 700, fontSize: 12, color: "#6366f1", textDecoration: "none", whiteSpace: "nowrap" }}>← All Tools</a>
          </div>
        </div>
      </header>

      <div style={{ textAlign: "center", padding: "20px 12px 8px", maxWidth: 700, margin: "auto" }}>
        <span style={{ background: "#eef2ff", color: "#4f46e5", padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "1px solid #e0e7ff", display: "inline-block" }}>✅ ATS RESUME • NO WATERMARK PDF FREE</span>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginTop: 12, lineHeight: 1.3 }}>Resume Builder - ATS Resume in 2 Mins</h1>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>For Freshers, Jobs, Internships — No Watermark PDF, Private, Free Forever</p>
      </div>

      <div className="resume-wrap">
        {/* LEFT - FORM */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 18, border: "1px solid #e8e8ef", boxShadow: "0 4px 24px rgba(0,0,0,.04)", minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 900 }}>Fill Your Details</h3>
          <label style={label}>Full Name</label><input className="resume-input" style={input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Sharma" />
          <label style={label}>Phone + Email</label><input className="resume-input" style={input} value={contact} onChange={e => setContact(e.target.value)} placeholder="e.g. 98765 43210 | rahul@gmail.com" />
          <label style={label}>Address / LinkedIn</label><input className="resume-input" style={input} value={addr} onChange={e => setAddr(e.target.value)} placeholder="e.g. Dehradun - linkedin.com/in/rahul" />
          <label style={label}>Objective</label><textarea className="resume-input" style={{ ...input, minHeight: 70 }} rows={3} value={obj} onChange={e => setObj(e.target.value)} />
          <label style={label}>Education</label><textarea className="resume-input" style={{ ...input, minHeight: 70 }} rows={3} value={edu} onChange={e => setEdu(e.target.value)} />
          <label style={label}>Skills (comma separated)</label><input className="resume-input" style={input} value={skills} onChange={e => setSkills(e.target.value)} />
          <label style={label}>Experience / Projects</label><textarea className="resume-input" style={{ ...input, minHeight: 80 }} rows={4} value={exp} onChange={e => setExp(e.target.value)} />
          <button onClick={downloadPdf} style={btn}>⬇️ Download ATS Resume PDF</button>
          <div style={{ marginTop: 14, background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 10, padding: 10, fontSize: 11, lineHeight: 1.6 }}><b>✅ ATS Friendly Tips:</b> Simple format, no tables/images, keywords from job description, 1 page best for freshers.</div>
        </div>

        {/* RIGHT - PREVIEW */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 18, border: "1px solid #e8e8ef", boxShadow: "0 4px 24px rgba(0,0,0,.04)", minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 900 }}>Live Preview - ATS Friendly ✅</h3>
          <div style={{ background: "#fff", color: "#111", padding: 18, borderRadius: 8, fontSize: 13, lineHeight: 1.6, border: "1px solid #e5e7eb", marginTop: 12, wordWrap: "break-word", overflowWrap: "break-word" }}>
            <div style={{ borderBottom: "2px solid #111", paddingBottom: 10, marginBottom: 12, textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, wordWrap: "break-word" }}>{displayName}</div>
              <div style={{ fontSize: 11, marginTop: 4, wordWrap: "break-word" }}>{contact} {contact && addr ? " | " : ""} {addr}</div>
            </div>
            <div style={{ marginTop: 12 }}><b style={{ fontSize: 12, background: "#111", color: "#fff", padding: "2px 8px", borderRadius: 4, display: "inline-block" }}>OBJECTIVE</b><div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{obj}</div></div>
            <div style={{ marginTop: 14 }}><b style={{ fontSize: 12, background: "#111", color: "#fff", padding: "2px 8px", borderRadius: 4, display: "inline-block" }}>EDUCATION</b><div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{edu}</div></div>
            <div style={{ marginTop: 14 }}><b style={{ fontSize: 12, background: "#111", color: "#fff", padding: "2px 8px", borderRadius: 4, display: "inline-block" }}>SKILLS</b><div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{skills}</div></div>
            <div style={{ marginTop: 14 }}><b style={{ fontSize: 12, background: "#111", color: "#fff", padding: "2px 8px", borderRadius: 4, display: "inline-block" }}>EXPERIENCE / PROJECTS</b><div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{exp}</div></div>
          </div>

          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 900 }}>Why NEXORA?</h3>
            <p style={{ fontSize: 12, color: "#444", lineHeight: 1.7, marginTop: 6 }}>NEXORA Resume Builder — ATS resume in 2 mins, simple format no tables images, HR software friendly, increases interview chances, 100% private browser-based jsPDF, no watermark PDF, free forever. Live preview — see as you type. Best for freshers — first job, internships. Made in India.</p>
          </div>
        </div>
      </div>

      <footer style={{ borderTop: "1px solid #e8e8ef", background: "#fff", padding: "24px 12px", marginTop: 20, color: "#64748b", fontSize: 13, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 18, color: "#111827" }}>NEX<span style={{ color: "#6366f1" }}>ORA</span> — Built by Ayush Chauhan</div>
        <div style={{ marginTop: 8 }}>📧 ayushchauhan902704@gmail.com • 📍 Dehradun, India</div>
        <div style={{ marginTop: 8, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", fontWeight: 700 }}><a href="/about" style={{ color: "#111827" }}>About</a><a href="/contact" style={{ color: "#111827" }}>Contact</a><a href="/privacy" style={{ color: "#111827" }}>Privacy</a><a href="/terms" style={{ color: "#111827" }}>Terms</a></div>
        <div style={{ marginTop: 8 }}>© 2026 NEXORA Tools - Resume Builder • Made in India 🇮🇳</div>
      </footer>
    </div>
  );
}
