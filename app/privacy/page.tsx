"use client";

export default function Page() {
  const h2: any = { fontSize: 20, margin: "18px 0 8px" };
  const p: any = { color: "#44445a", fontSize: 14.5, marginBottom: 8 };
  const ul: any = { marginLeft: 18, color: "#44445a", fontSize: 14.5, marginBottom: 8 };
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
          <h1 style={{ fontSize: 36, letterSpacing: -0.8 }}>Privacy <span style={{ color: "#6c5ce7" }}>Policy</span></h1>
          <p style={{ color: "#676778" }}>Last updated: 10 October 2026</p>
        </div>

        <div style={{ width: "min(900px,calc(100% - 32px))", margin: "auto" }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8ef", borderRadius: 20, padding: 28, margin: "18px 0", boxShadow: "0 4px 24px rgba(0,0,0,.04)" }}>
            <h2 style={{ ...h2, marginTop: 0 }}>1. Introduction</h2>
            <p style={p}>Welcome to NEXORA (https://nexora-tools-drab.vercel.app/). This Privacy Policy explains how we handle your information when you use our free online tools. We are committed to protecting your privacy.</p>

            <h2 style={h2}>2. Information We Do NOT Collect</h2>
            <p style={p}>This is important: <b>Our calculators and tools run entirely in your browser.</b> When you calculate Age, BMI, EMI, or generate a password / QR code:</p>
            <ul style={ul}><li>We do NOT save your input data on our server</li><li>We do NOT store your calculation results</li><li>We do NOT ask for login or personal details to use tools</li></ul>

            <h2 style={h2}>3. Information We Collect</h2>
            <p style={p}>We only collect anonymous, non-personal data for improving the site:</p>
            <ul style={ul}><li><b>Google Analytics:</b> We use Google Analytics (ID: G-61NV39S2VE) to see how many visitors come, which tools are popular, and which country they are from. This data is anonymous.</li><li><b>Contact Info:</b> If you email us at ayushchauhan902704@gmail.com, we will have your email address to reply to you. We never share it.</li></ul>

            <h2 style={h2}>4. Cookies</h2>
            <p style={p}>NEXORA uses minimal cookies:</p>
            <ul style={ul}><li><b>Necessary Cookies:</b> For site to work properly.</li><li><b>Analytics Cookies:</b> By Google Analytics to understand traffic.</li><li><b>Future AdSense Cookies:</b> When we enable Google AdSense, Google may use cookies to show relevant ads. You can disable cookies in your browser settings anytime.</li></ul>

            <h2 style={h2}>5. Third-Party Services</h2>
            <p style={p}>We use trusted third-party services:</p>
            <ul style={ul}><li><b>Google Analytics</b> – for traffic analysis</li><li><b>Vercel</b> – for hosting our site securely</li><li><b>Google AdSense (Future)</b> – for showing ads to keep tools free</li></ul>
            <p style={p}>These services have their own privacy policies.</p>

            <h2 style={h2}>6. Children&apos;s Privacy</h2>
            <p style={p}>Our tools are safe for all ages. We do not knowingly collect personal information from children under 13.</p>

            <h2 style={h2}>7. Your Rights</h2>
            <p style={p}>You can:</p>
            <ul style={ul}><li>Use all tools without providing any personal data</li><li>Disable cookies from your browser</li><li>Ask us to delete any email you sent us</li></ul>

            <h2 style={h2}>8. Contact Us</h2>
            <p style={p}>If you have any questions about this Privacy Policy, please contact us:</p>
            <p style={p}><b>Email:</b> <a href="mailto:ayushchauhan902704@gmail.com" style={{ color: "#6c5ce7", fontWeight: 700 }}>ayushchauhan902704@gmail.com</a><br /><b>Phone:</b> +91 9389641559<br /><b>Location:</b> Dehradun, Uttarakhand, India</p>

            <h2 style={h2}>9. Changes to This Policy</h2>
            <p style={p}>We may update this policy from time to time. The updated date will be shown at the top. Please check this page periodically.</p>
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
