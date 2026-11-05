"use client";

export default function Page() {
  const card: any = { background: "#fff", border: "1px solid #ececf3", borderRadius: 24, padding: 36, marginBottom: 20 };
  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,Inter,Segoe UI,Roboto,sans-serif", background: "#fcfcff", color: "#111118", lineHeight: 1.8, minHeight: "100vh" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid #ececf3" }}>
        <div style={{ width: "min(1100px,calc(100% - 32px))", margin: "auto", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 26, fontWeight: 900, letterSpacing: -1.2, textDecoration: "none", color: "#111118" }}>NEX<span style={{ color: "#6c5ce7" }}>ORA</span></a>
          <nav style={{ display: "flex", gap: 28, fontSize: 14.5, fontWeight: 600, color: "#5a5a72" }}><a href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</a><a href="/#tools" style={{ textDecoration: "none", color: "inherit" }}>Tools</a><a href="/contact" style={{ textDecoration: "none", color: "inherit" }}>Contact</a></nav>
        </div>
      </header>

      <main>
        <div style={{ width: "min(1100px,calc(100% - 32px))", margin: "auto", padding: "90px 0 60px", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "#f1efff", color: "#6c5ce7", padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, marginBottom: 18 }}>BUILT IN DEHRADUN, FOR INDIA AND THE WORLD</div>
          <h1 style={{ fontSize: 54, lineHeight: 1.05, letterSpacing: -2.5, fontWeight: 900 }}>We build simple tools<br />for <span style={{ background: "linear-gradient(90deg,#6c5ce7,#a55eea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>complex tasks</span></h1>
          <p style={{ maxWidth: 640, margin: "18px auto 0", color: "#66667e", fontSize: 18 }}>NEXORA is a privacy-first toolbox designed to help you get things done faster. No ads. No signups. No tracking. Just tools that work.</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, margin: "40px 0" }}>
            <div style={{ background: "#fff", border: "1px solid #ececf3", borderRadius: 16, padding: 20, textAlign: "center" }}><b style={{ fontSize: 28, display: "block" }}>50+</b><span style={{ fontSize: 13, color: "#77778e", fontWeight: 600 }}>LIVE TOOLS</span></div>
            <div style={{ background: "#fff", border: "1px solid #ececf3", borderRadius: 16, padding: 20, textAlign: "center" }}><b style={{ fontSize: 28, display: "block" }}>100%</b><span style={{ fontSize: 13, color: "#77778e", fontWeight: 600 }}>PRIVATE</span></div>
            <div style={{ background: "#fff", border: "1px solid #ececf3", borderRadius: 16, padding: 20, textAlign: "center" }}><b style={{ fontSize: 28, display: "block" }}>&lt;1s</b><span style={{ fontSize: 13, color: "#77778e", fontWeight: 600 }}>LOAD TIME</span></div>
            <div style={{ background: "#fff", border: "1px solid #ececf3", borderRadius: 16, padding: 20, textAlign: "center" }}><b style={{ fontSize: 28, display: "block" }}>0</b><span style={{ fontSize: 13, color: "#77778e", fontWeight: 600 }}>DATA STORED</span></div>
          </div>
        </div>

        <div style={{ width: "min(1100px,calc(100% - 32px))", margin: "auto", padding: "20px 0" }}>
          <div style={card}>
            <h2 style={{ fontSize: 26, letterSpacing: -0.8, marginBottom: 12 }}>Why we built NEXORA</h2>
            <p style={{ color: "#44445e", fontSize: 16, marginBottom: 12 }}>Every day we need a small tool for work - to edit a document, calculate something, or convert a file. Most websites are cluttered with popups, forced logins, and they track your data.</p>
            <p style={{ color: "#44445e", fontSize: 16 }}>We were tired of that experience. So we decided to build a better alternative - a single, clean, fast place where tools just work, without asking for anything in return.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 20 }}>
            <div style={{ borderRadius: 18, padding: 22, background: "linear-gradient(180deg,#fff,#f9f9ff)", border: "1px solid #ececf3" }}><div style={{ width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center", background: "#f1efff", marginBottom: 12 }}>⚡</div><b style={{ display: "block", marginBottom: 6, fontSize: 15 }}>Built for Speed</b><span style={{ fontSize: 14, color: "#66667e" }}>Every tool is optimized to load in under a second, even on slow 4G networks. No heavy scripts.</span></div>
            <div style={{ borderRadius: 18, padding: 22, background: "linear-gradient(180deg,#fff,#f9f9ff)", border: "1px solid #ececf3" }}><div style={{ width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center", background: "#f1efff", marginBottom: 12 }}>🔒</div><b style={{ display: "block", marginBottom: 6, fontSize: 15 }}>Privacy by Design</b><span style={{ fontSize: 14, color: "#66667e" }}>All processing happens in your browser. Your files never touch our servers. We don&apos;t store anything.</span></div>
            <div style={{ borderRadius: 18, padding: 22, background: "linear-gradient(180deg,#fff,#f9f9ff)", border: "1px solid #ececf3" }}><div style={{ width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center", background: "#f1efff", marginBottom: 12 }}>🎯</div><b style={{ display: "block", marginBottom: 6, fontSize: 15 }}>Simple by Default</b><span style={{ fontSize: 14, color: "#66667e" }}>No learning curve. Open the tool, do your work, and leave. No manual needed.</span></div>
            <div style={{ borderRadius: 18, padding: 22, background: "linear-gradient(180deg,#fff,#f9f9ff)", border: "1px solid #ececf3" }}><div style={{ width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center", background: "#f1efff", marginBottom: 12 }}>🌱</div><b style={{ display: "block", marginBottom: 6, fontSize: 15 }}>Growing Every Week</b><span style={{ fontSize: 14, color: "#66667e" }}>We are a living platform. We add new tools every week based on what our users actually need.</span></div>
          </div>

          <div style={{ ...card, marginTop: 20 }}>
            <h2 style={{ fontSize: 26, letterSpacing: -0.8, marginBottom: 12 }}>Our Mission</h2>
            <p style={{ color: "#44445e", fontSize: 16, marginBottom: 12 }}>To build the most trusted and simple toolbox on the internet - where anyone, from a student to a business owner, can find a reliable solution in 10 seconds.</p>
            <p style={{ color: "#44445e", fontSize: 16 }}>We are not trying to be everything. We are trying to be the most useful.</p>

            <div style={{ display: "flex", gap: 20, alignItems: "center", background: "#111118", color: "#fff", borderRadius: 24, padding: 28, marginTop: 26 }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, overflow: "hidden", background: "#222", flexShrink: 0 }}><img src="/ayush.jpg" alt="Ayush Chauhan founder of NEXORA Tools" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div>
                <b style={{ fontSize: 16 }}>Ayush Chauhan</b><br />
                <span style={{ color: "#d0d0e6", fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>FOUNDER, NEXORA TOOLS - DEHRADUN</span>
                <p style={{ marginTop: 8, color: "#a8a8be", fontSize: 14.5 }}>I&apos;m Ayush from Dehradun. I started NEXORA in 2025 because I was tired of ad-filled tools. I personally reply to every email. If you have an idea for a tool, I read it.</p>
                <p style={{ marginTop: 10, fontSize: 12, color: "#888" }}>Last updated: 1 Nov 2026 | 50+ tools live</p>
                <a href="/contact" style={{ display: "inline-block", marginTop: 12, background: "#fff", color: "#111118", padding: "8px 14px", borderRadius: 100, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Contact Me →</a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #ececf3", padding: "36px 0", marginTop: 50, background: "#fff", color: "#7a7a90", fontSize: 13 }}>
        <div style={{ width: "min(1100px,calc(100% - 32px))", margin: "auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div><div style={{ fontWeight: 900, color: "#111118", fontSize: 16 }}>NEXORA</div><div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10 }}><a href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</a><a href="/about" style={{ textDecoration: "none", color: "inherit" }}>About</a><a href="/contact" style={{ textDecoration: "none", color: "inherit" }}>Contact</a><a href="/privacy" style={{ textDecoration: "none", color: "inherit" }}>Privacy</a><a href="/terms" style={{ textDecoration: "none", color: "inherit" }}>Terms</a><a href="/disclaimer" style={{ textDecoration: "none", color: "inherit" }}>Disclaimer</a></div></div>
          <div>© 2026 NEXORA – Built with precision in India</div>
        </div>
      </footer>
    </div>
  );
}
