"use client";

export default function Page() {
  const h2: any = { fontSize: 18, margin: "16px 0 6px" };
  const p: any = { color: "#44445a", fontSize: 14.5, marginBottom: 6 };
  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", lineHeight: 1.7, minHeight: "100vh" }}>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid #e8e8ef", zIndex: 10 }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 25, fontWeight: 900, letterSpacing: -0.5, textDecoration: "none", color: "#171725" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <nav style={{ display: "flex", gap: 22, fontSize: 14, fontWeight: 600, color: "#555566" }}><a href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</a><a href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</a><a href="/contact" style={{ textDecoration: "none", color: "inherit" }}>Contact</a></nav>
        </div>
      </header>

      <main>
        <div style={{ textAlign: "center", padding: "45px 0 15px", width: "min(900px,calc(100% - 32px))", margin: "auto" }}>
          <h1 style={{ fontSize: 36, letterSpacing: -0.8 }}>Terms of <span style={{ color: "#6c5ce7" }}>Service</span></h1>
          <p style={{ color: "#676778" }}>Last updated: 10 October 2026</p>
        </div>

        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto" }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 20, padding: 28, margin: "18px 0", boxShadow: "0 4px 24px rgba(0,0,0,.04)" }}>
            <h2 style={h2}>1. Acceptance of Terms</h2>
            <p style={p}>By using NEXORA (nexora-tools-drab.vercel.app), you agree to these Terms. If you don&apos;t agree, please don&apos;t use our tools.</p>

            <h2 style={h2}>2. Use of Tools</h2>
            <p style={p}>All tools are free for personal and commercial use. You can use Age Calculator, BMI, EMI, QR Generator etc without any restrictions. You shall not misuse tools for illegal activities.</p>

            <h2 style={h2}>3. No Warranty</h2>
            <p style={p}>Our tools are for general information only. For example, BMI is an estimate, not medical advice. Loan EMI calculations are approximate, please confirm with your bank. We provide tools &quot;as is&quot; without any warranty.</p>

            <h2 style={h2}>4. Intellectual Property</h2>
            <p style={p}>Design, logo, and code of NEXORA belongs to Ayush Chauhan. You can share our tools link, but don&apos;t copy entire site content without permission.</p>

            <h2 style={h2}>5. Limitation of Liability</h2>
            <p style={p}>NEXORA will not be liable for any loss or damage from using our tools. Use your own judgment for important financial / medical decisions.</p>

            <h2 style={h2}>6. Changes</h2>
            <p style={p}>We may update these Terms anytime. Continued use after update means you accept new Terms.</p>

            <h2 style={h2}>7. Contact</h2>
            <p style={p}>Email: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a> | Phone: +91 9389641559 | Dehradun, Uttarakhand</p>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "36px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 30 }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div><b style={{ color: "#171725" }}>NEXORA</b><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}><a href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</a><a href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</a><a href="/contact" style={{ textDecoration: "none", color: "inherit" }}>Contact</a><a href="/privacy" style={{ textDecoration: "none", color: "inherit" }}>Privacy</a><a href="/terms" style={{ textDecoration: "none", color: "inherit" }}>Terms</a><a href="/disclaimer" style={{ textDecoration: "none", color: "inherit" }}>Disclaimer</a><a href="/sitemap.xml" style={{ textDecoration: "none", color: "inherit" }}>Sitemap</a></div></div>
          <div>© 2026 NEXORA – Built by Ayush Chauhan</div>
        </div>
      </footer>
    </div>
  );
}
