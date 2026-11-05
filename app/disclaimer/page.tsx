"use client";

export default function Page() {
  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif", background: "#f7f8fc", color: "#171725", lineHeight: 1.7, minHeight: "100vh" }}>
      <header style={{ position: "sticky", top: 0, background: "rgba(255,255,255,.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid #e8e8ef" }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 25, fontWeight: 900, textDecoration: "none", color: "#171725" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <nav style={{ display: "flex", gap: 22, fontSize: 14, fontWeight: 600, color: "#555566" }}><a href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</a><a href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</a><a href="/contact" style={{ textDecoration: "none", color: "inherit" }}>Contact</a></nav>
        </div>
      </header>

      <main>
        <div style={{ textAlign: "center", padding: "45px 0 15px", width: "min(900px,calc(100% - 32px))", margin: "auto" }}>
          <h1 style={{ fontSize: 36 }}><span style={{ color: "#6c5ce7" }}>Disclaimer</span></h1>
          <p style={{ color: "#676778" }}>Last updated: 10 October 2026</p>
        </div>

        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto" }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 18, padding: 28, margin: "18px 0" }}>
            <h2 style={{ fontSize: 18, margin: "16px 0 6px" }}>General Information</h2>
            <p style={{ color: "#44445a", fontSize: 14.5, marginBottom: 8 }}>All information and tools on NEXORA are for general informational purposes only. While we try to keep tools accurate and up-to-date, we make no warranties about completeness or accuracy.</p>

            <h2 style={{ fontSize: 18, margin: "16px 0 6px" }}>Not Professional Advice</h2>
            <p style={{ color: "#44445a", fontSize: 14.5, marginBottom: 8 }}>Our calculators do not provide professional advice: BMI Calculator is not medical advice, please consult a doctor. Loan EMI, Percentage, Discount calculators are estimates, please verify with your bank / financial advisor. Password Generator creates strong passwords but we are not responsible for how you use them.</p>

            <h2 style={{ fontSize: 18, margin: "16px 0 6px" }}>External Links</h2>
            <p style={{ color: "#44445a", fontSize: 14.5, marginBottom: 8 }}>Our site may contain links to other sites. We are not responsible for their content or privacy practices.</p>

            <h2 style={{ fontSize: 18, margin: "16px 0 6px" }}>Consent</h2>
            <p style={{ color: "#44445a", fontSize: 14.5, marginBottom: 8 }}>By using NEXORA, you consent to this disclaimer.</p>

            <h2 style={{ fontSize: 18, margin: "16px 0 6px" }}>Contact</h2>
            <p style={{ color: "#44445a", fontSize: 14.5 }}>If you need clarification: <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a></p>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e8e8ef", padding: "30px 0", background: "#fff", color: "#747486", fontSize: 13, marginTop: 30 }}>
        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div><b style={{ color: "#171725" }}>NEXORA</b><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}><a href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</a><a href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</a><a href="/contact" style={{ textDecoration: "none", color: "inherit" }}>Contact</a><a href="/privacy" style={{ textDecoration: "none", color: "inherit" }}>Privacy</a><a href="/terms" style={{ textDecoration: "none", color: "inherit" }}>Terms</a><a href="/disclaimer" style={{ textDecoration: "none", color: "inherit" }}>Disclaimer</a><a href="/sitemap.xml" style={{ textDecoration: "none", color: "inherit" }}>Sitemap</a></div></div>
          <div>© 2026 NEXORA</div>
        </div>
      </footer>
    </div>
  );
}
