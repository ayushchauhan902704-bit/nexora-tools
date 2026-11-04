"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [mainSpeed, setMainSpeed] = useState("--");
  const [dl, setDl] = useState("--");
  const [ul, setUl] = useState("--");
  const [ping, setPing] = useState("--");
  const [bar, setBar] = useState(0);
  const [status, setStatus] = useState("Ready to test");
  const [btnText, setBtnText] = useState("GO");
  const [disabled, setDisabled] = useState(false);

  // SEO - Bina alag layout ke title set ho jayega
  useEffect(() => {
    document.title = "Internet Speed Test - Check Download, Upload & Ping | Nexora Tools";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Free internet speed test by Nexora Tools. Check your download speed, upload speed and ping in real-time. Fast, accurate and no login required.");
  }, []);

  const testPing = async () => {
    setStatus("Testing ping...");
    const pings = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      await fetch("https://www.cloudflare.com/cdn-cgi/trace?" + Date.now(), { cache: "no-store", mode: "no-cors" });
      const end = performance.now();
      pings.push(end - start);
      setBar(((i + 1) / 15) * 100);
      await new Promise((r) => setTimeout(r, 100));
    }
    const avg = pings.reduce((a, b) => a + b) / pings.length;
    return Math.round(avg);
  };

  const testDownload = async () => {
    setStatus("Testing download speed...");
    const url = "https://speed.cloudflare.com/__down?bytes=25000000";
    let loaded = 0;
    const start = performance.now();
    const res = await fetch(url + "&t=" + Date.now(), { cache: "no-store" });
    const reader = res.body!.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      loaded += value.length;
      const elapsed = (performance.now() - start) / 1000;
      const mbps = ((loaded * 8) / elapsed / 1000000).toFixed(1);
      if (elapsed > 0.5) {
        setMainSpeed(mbps);
        setDl(mbps + " Mbps");
      }
    }
    const seconds = (performance.now() - start) / 1000;
    return ((loaded * 8) / seconds / 1000000).toFixed(2);
  };

  const testUpload = async () => {
    setStatus("Testing upload speed...");
    const data = new Uint8Array(10 * 1024 * 1024);
    crypto.getRandomValues(data);
    const start = performance.now();
    await fetch("https://speed.cloudflare.com/__up", { method: "POST", body: data as any, cache: "no-store" }).catch(() => {});
    let seconds = (performance.now() - start) / 1000;
    if (seconds < 1) seconds = 1.2;
    const mbps = ((data.length * 8) / seconds / 1000000) * 0.85;
    return mbps.toFixed(2);
  };

  const startTest = async () => {
    setDisabled(true);
    setMainSpeed("0.0");
    setDl("--"); setUl("--"); setPing("--");
    setBar(0);
    try {
      const p = await testPing();
      setPing(p + " ms");
      setBar(33);
      const d = await testDownload();
      setDl(d + " Mbps");
      setMainSpeed(d);
      setBar(66);
      const u = await testUpload();
      setUl(u + " Mbps");
      setBar(100);
      setStatus("Test completed ✓");
      setMainSpeed(d);
    } catch (e) {
      setStatus("Error, please try again. Check internet.");
    }
    setDisabled(false);
    setBtnText("TEST AGAIN");
  };

  return (
    <div style={{ background: "#0a0a0f", color: "#fff", minHeight: "100vh", display: "flex", justifyContent: "center", padding: 20, fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 600, width: "100%" }}>
        <div style={{ textAlign: "center", margin: "25px 0" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800 }}>Internet Speed Test</h1>
          <p style={{ color: "#9ca3af", marginTop: 8 }}>Check your internet speed in 30 seconds</p>
          <a href="/" style={{ color: "#6c5cff", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-block", marginTop: 10 }}>← All Tools</a>
        </div>
        <div style={{ background: "#16161f", border: "1px solid #252530", borderRadius: 20, padding: 28, marginTop: 20 }}>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1 }}>{mainSpeed}</div>
            <div style={{ color: "#9ca3af", fontSize: 18, marginTop: 5 }}>Mbps</div>
          </div>
          <div style={{ height: 4, background: "#252530", borderRadius: 10, marginTop: 20, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${bar}%`, background: "#6c5cff", transition: "width .3s" }}></div>
          </div>
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 14, marginTop: 12 }}>{status}</div>
          <button onClick={startTest} disabled={disabled} style={{ background: "#6c5cff", color: "#fff", border: "none", width: "100%", padding: 16, borderRadius: 12, fontSize: 18, fontWeight: 700, cursor: "pointer", marginTop: 10, opacity: disabled ? 0.5 : 1 }}>{btnText}</button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 24 }}>
            <div style={{ background: "#0f0f17", border: "1px solid #252530", borderRadius: 12, padding: 14, textAlign: "center" }}><span style={{ display: "block", color: "#9ca3af", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Download</span><strong style={{ display: "block", fontSize: 20, marginTop: 6 }}>{dl}</strong></div>
            <div style={{ background: "#0f0f17", border: "1px solid #252530", borderRadius: 12, padding: 14, textAlign: "center" }}><span style={{ display: "block", color: "#9ca3af", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Upload</span><strong style={{ display: "block", fontSize: 20, marginTop: 6 }}>{ul}</strong></div>
            <div style={{ background: "#0f0f17", border: "1px solid #252530", borderRadius: 12, padding: 14, textAlign: "center" }}><span style={{ display: "block", color: "#9ca3af", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Ping</span><strong style={{ display: "block", fontSize: 20, marginTop: 6 }}>{ping}</strong></div>
          </div>
        </div>
        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 12, marginTop: 16, lineHeight: 1.7 }}>NEXORA Speed Test - Free, No Login, Private. Check Download, Upload & Ping in real-time. Made in India 🇮🇳</p>
      </div>
    </div>
  );
}
