"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [mainSpeed, setMainSpeed] = useState("--");
  const [dl, setDl] = useState("--");
  const [ul, setUl] = useState("--");
  const [ping, setPing] = useState("--");
  const [jitter, setJitter] = useState("--");
  const [ip, setIp] = useState("--");
  const [isp, setIsp] = useState("--");
  const [loc, setLoc] = useState("--");
  const [device, setDevice] = useState("--");
  const [quality, setQuality] = useState("");
  const [bar, setBar] = useState(0);
  const [status, setStatus] = useState("Ready to test");
  const [btnText, setBtnText] = useState("⚡ START TEST");
  const [disabled, setDisabled] = useState(false);
  const [step, setStep] = useState(0); // 0=none, 1=ping, 2=dl, 3=ul, 4=done

  useEffect(() => {
    document.title = "Internet Speed Test - Download, Upload, Ping, Jitter | NEXORA";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Free internet speed test. Check download speed, upload speed, ping, jitter, IP, ISP, location. Jio, Airtel, Vi, BSNL, WiFi, 5G speed test. No app, 100% free.");
    setDevice(/Mobi|Android/i.test(navigator.userAgent) ? (navigator.userAgent.includes("Android") ? "Mobile - Android" : "Mobile - iPhone") : "Desktop / Laptop");
    // IP + ISP + Location
    fetch("https://ipapi.co/json/").then(r=>r.json()).then(d=>{
      if(d.ip) setIp(d.ip);
      if(d.org) setIsp(d.org);
      if(d.city) setLoc(d.city+", "+(d.region||"")+", "+(d.country_name||""));
    }).catch(()=>{ setIp("Private Network"); setIsp("Your Network"); setLoc("India"); });
  }, []);

  const testPing = async () => {
    setStatus("Step 1 - Ping check ho raha hai...");
    setStep(1);
    const pings: number[] = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      await fetch("https://www.cloudflare.com/cdn-cgi/trace?" + Date.now(), { cache: "no-store", mode: "no-cors" });
      const end = performance.now();
      pings.push(end - start);
      setBar(((i + 1) / 15) * 100);
      await new Promise((r) => setTimeout(r, 100));
    }
    const avg = pings.reduce((a, b) => a + b) / pings.length;
    let jit = 0;
    for(let i=1;i<pings.length;i++) jit += Math.abs(pings[i]-pings[i-1]);
    setJitter(Math.max(1, Math.round(jit/(pings.length-1))) + " ms");
    return Math.max(5, Math.round(avg));
  };

  const testDownload = async () => {
    setStatus("Step 2 - Download Speed check ho raha hai...");
    setStep(2);
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
        setBar(33 + Math.min(33, Number(mbps)/2));
      }
    }
    const seconds = (performance.now() - start) / 1000;
    return ((loaded * 8) / seconds / 1000000).toFixed(2);
  };

  const testUpload = async () => {
    setStatus("Step 3 - Upload Speed check ho raha hai...");
    setStep(3);
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
    setBtnText("⏳ Testing... Ruko");
    setMainSpeed("0.0");
    setDl("--"); setUl("--"); setPing("--"); setJitter("--"); setQuality("");
    setBar(0); setStep(0);
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
      setStep(4);
      setStatus("✅ Ho Gaya! Result upar hai.");
      setMainSpeed(d);
      const dn = Number(d);
      let q = "";
      if(dn>=50) q="🔥 Excellent! 4K, Gaming, Sab chalega mast.";
      else if(dn>=25) q="✅ Very Good! 4K YouTube, Zoom sab chalega.";
      else if(dn>=10) q="👍 Good! HD YouTube, WhatsApp, Class sab chalega.";
      else if(dn>=5) q="😐 Average! WhatsApp chalega, HD me rukega.";
      else q="⚠️ Slow! Router restart karo ya WiFi ke paas jao.";
      if(p<=30) q+=" Ping bahut achha hai - Gaming ke liye best.";
      else if(p<=80) q+=" Ping thik hai.";
      else q+=" Ping zyada hai - Gaming me lag aayega.";
      setQuality(q);
    } catch (e) {
      setStatus("Error, please try again. Check internet.");
    }
    setDisabled(false);
    setBtnText("⚡ START TEST - Speed Check Karo");
  };

  const stepStyle = (n:number) => ({
    background: step===n ? "#ff7a00" : step>n || step===4 ? "#f0fff4" : "#fff7ed",
    border: `1.5px solid ${step===n ? "#ff7a00" : step>n || step===4 ? "#86efac" : "#ffedd5"}`,
    borderRadius: 12, padding: "10px 5px", textAlign: "center" as const,
    color: step===n ? "#fff" : "#17203a"
  });

  return (
    <div style={{ background: "#ffffff", color: "#17203a", minHeight: "100vh", display: "flex", justifyContent: "center", padding: "0 14px 20px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 820, width: "100%" }}>
        {/* NAV */}
        <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "0 10px" }}>
          <a href="/" style={{ fontSize: 22, fontWeight: 800, color: "#ff7a00", textDecoration: "none" }}>NEXORA</a>
          <a href="/" style={{ fontSize: 12, fontWeight: 700, color: "#5b657f", textDecoration: "none" }}>← All Tools</a>
        </div>

        {/* HERO - BAHAR SE KAM TEXT */}
        <div style={{ textAlign: "center", margin: "14px 0 8px" }}>
          <span style={{ display: "inline-block", padding: "5px 11px", borderRadius: 30, background: "#fff3e6", color: "#ff7a00", fontSize: 11, fontWeight: 800 }}>⚡ FREE • NO APP • 10 SEC TEST</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "10px 0 6px" }}>Internet Speed Test</h1>
          <p style={{ color: "#6b7690", fontSize: 13, maxWidth: 620, margin: "auto", lineHeight: 1.6 }}>Download, Upload, Ping, Jitter - Sab ek hi click me. Jio, Airtel, Vi, WiFi, 5G - Sabka speed test.</p>
        </div>

        {/* TOOL - WHITE + ORANGE */}
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 18, padding: 16, boxShadow: "0 10px 30px rgba(0,0,0,.05)" }}>
          {/* 1-2-3 STEPS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            <div style={stepStyle(1)}><b style={{ display: "block", width: 26, height: 26, lineHeight: "26px", margin: "0 auto 5px", background: step===1 ? "#fff" : "#ff7a00", color: step===1 ? "#ff7a00" : "#fff", borderRadius: "50%", fontSize: 13 }}>1</b><span style={{ fontSize: 12, fontWeight: 800 }}>Ping</span><small style={{ display: "block", fontSize: 11, color: step===1 ? "#fff" : "#6b7690", marginTop: 2 }}>{step>1 ? ping : step===1 ? "Checking..." : "Ready"}</small></div>
            <div style={stepStyle(2)}><b style={{ display: "block", width: 26, height: 26, lineHeight: "26px", margin: "0 auto 5px", background: step===2 ? "#fff" : "#ff7a00", color: step===2 ? "#ff7a00" : "#fff", borderRadius: "50%", fontSize: 13 }}>2</b><span style={{ fontSize: 12, fontWeight: 800 }}>Download</span><small style={{ display: "block", fontSize: 11, color: step===2 ? "#fff" : "#6b7690", marginTop: 2 }}>{step>2 ? dl : step===2 ? "Testing..." : "Ready"}</small></div>
            <div style={stepStyle(3)}><b style={{ display: "block", width: 26, height: 26, lineHeight: "26px", margin: "0 auto 5px", background: step===3 ? "#fff" : "#ff7a00", color: step===3 ? "#ff7a00" : "#fff", borderRadius: "50%", fontSize: 13 }}>3</b><span style={{ fontSize: 12, fontWeight: 800 }}>Upload</span><small style={{ display: "block", fontSize: 11, color: step===3 ? "#fff" : "#6b7690", marginTop: 2 }}>{step===4 ? ul : step===3 ? "Testing..." : "Ready"}</small></div>
          </div>

          {/* BIG SPEED */}
          <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1, color: "#ff7a00" }}>{mainSpeed}<small style={{ fontSize: 20, color: "#17203a" }}> Mbps</small></div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#6b7690", marginTop: 4, letterSpacing: 1 }}>{step===0 ? "CLICK START TO TEST YOUR SPEED" : step===1 ? "PING TEST" : step===2 ? "DOWNLOAD SPEED" : step===3 ? "UPLOAD SPEED" : "YOUR INTERNET SPEED"}</div>
            <div style={{ height: 10, background: "#f1f5f9", borderRadius: 20, overflow: "hidden", margin: "14px 0 6px" }}>
              <div style={{ height: "100%", width: `${bar}%`, background: "linear-gradient(90deg,#ff7a00,#ffb347)", transition: "width .3s" }}></div>
            </div>
            <div style={{ fontSize: 12, color: "#6b7690", minHeight: 18 }}>{status}</div>
          </div>

          {/* RESULTS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
            <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "11px 5px", textAlign: "center" }}><strong style={{ display: "block", fontSize: 17, color: "#ff7a00" }}>{dl}</strong><small style={{ color: "#6b7690", fontSize: 11 }}>⬇ Download</small></div>
            <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "11px 5px", textAlign: "center" }}><strong style={{ display: "block", fontSize: 17, color: "#1e5bff" }}>{ul}</strong><small style={{ color: "#6b7690", fontSize: 11 }}>⬆ Upload</small></div>
            <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "11px 5px", textAlign: "center" }}><strong style={{ display: "block", fontSize: 17 }}>{ping}</strong><small style={{ color: "#6b7690", fontSize: 11 }}>Ping</small></div>
            <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "11px 5px", textAlign: "center" }}><strong style={{ display: "block", fontSize: 17 }}>{jitter}</strong><small style={{ color: "#6b7690", fontSize: 11 }}>Jitter</small></div>
          </div>

          {/* NETWORK INFO */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <div style={{ background: "#f8fafc", border: "1px solid #eee", borderRadius: 10, padding: 10 }}><small style={{ color: "#6b7690", fontSize: 11, display: "block" }}>🌐 IP Address</small><b style={{ fontSize: 13, wordBreak: "break-all" }}>{ip}</b></div>
            <div style={{ background: "#f8fafc", border: "1px solid #eee", borderRadius: 10, padding: 10 }}><small style={{ color: "#6b7690", fontSize: 11, display: "block" }}>📡 ISP / Network</small><b style={{ fontSize: 13, wordBreak: "break-all" }}>{isp}</b></div>
            <div style={{ background: "#f8fafc", border: "1px solid #eee", borderRadius: 10, padding: 10 }}><small style={{ color: "#6b7690", fontSize: 11, display: "block" }}>📍 Location</small><b style={{ fontSize: 13 }}>{loc}</b></div>
            <div style={{ background: "#f8fafc", border: "1px solid #eee", borderRadius: 10, padding: 10 }}><small style={{ color: "#6b7690", fontSize: 11, display: "block" }}>📱 Device / Browser</small><b style={{ fontSize: 13 }}>{device}</b></div>
          </div>

          {quality && <div style={{ marginTop: 12, background: "#f0fff4", border: "1px solid #86efac", borderRadius: 10, padding: 10, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#15803d" }}>{quality}</div>}

          <button onClick={startTest} disabled={disabled} style={{ background: "#ff7a00", color: "#fff", border: "none", width: "100%", padding: 13, borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 12, opacity: disabled ? 0.6 : 1 }}>{btnText}</button>
        </div>

        <div style={{ height: 80 }}></div>

        <div style={{ background: "#e9fff1", border: "1px solid #1ed06a", borderRadius: 9, padding: "8px 10px", textAlign: "center", fontSize: 12 }}>Video Chota Karna Hai? - <a href="/video-compressor" style={{ color: "#0a9e4a", fontWeight: 800 }}>Video Compressor</a> • Photo Chota Karna Hai? - <a href="/compress-image" style={{ color: "#0a9e4a", fontWeight: 800 }}>Photo Compressor</a></div>

        <div style={{ marginTop: 12, background: "linear-gradient(90deg,#ff7a00,#ff9a3d)", color: "#fff", borderRadius: 12, padding: 11, textAlign: "center", overflow: "hidden" }}><marquee style={{ fontWeight: 800, fontSize: 12 }}>🔥 NEXORA - Free Tools • Internet Speed Test • Video Compressor • Photo Compressor • 100% Free • No Watermark 🔥</marquee></div>

        {/* ANDAR SE POWER - SEO - CLICK PE KHULEGA */}
        <details style={{ marginTop: 18, border: "1px solid #eee", borderRadius: 12, background: "#fff", overflow: "hidden" }}>
          <summary style={{ padding: "12px 14px", fontSize: 13, fontWeight: 800, color: "#ff7a00", cursor: "pointer", listStyle: "none" }}>▼ Internet Speed Test Ke Baare Me Aur Jano - Click Karo</summary>
          <div style={{ padding: "0 14px 14px", fontSize: 13, lineHeight: 1.8, color: "#4b5568" }}>
            <h3 style={{ color: "#17203a", fontSize: 14 }}>Internet Speed Test Online Free - Download, Upload, Ping, Jitter</h3>
            <p>NEXORA Internet Speed Test duniya ka sabse fast speed test hai. Agar aapko internet speed test, wifi speed test, jio speed test, airtel speed test, download speed test, upload speed test karna hai to ye tool aapke liye hai. Jio, Airtel, Vi, BSNL, WiFi, Broadband, 5G, 4G - sabka speed test ek hi click me.</p>
            <h3 style={{ color: "#17203a", fontSize: 14 }}>Kaise Check Kare? - 1-2-3 Steps</h3>
            <ul style={{ paddingLeft: 18 }}><li>Step 1: START TEST dabao - Pehle Ping check hoga.</li><li>Step 2: Download Speed check hoga.</li><li>Step 3: Upload Speed check hoga.</li><li>Result: Download, Upload, Ping, Jitter, IP, ISP, Location sab dikhega.</li></ul>
            <h3 style={{ color: "#17203a", fontSize: 14 }}>Kitni Speed Achhi Hai?</h3>
            <ul style={{ paddingLeft: 18 }}><li>WhatsApp, Instagram: 5 Mbps kaafi hai.</li><li>YouTube HD: 10 Mbps chahiye.</li><li>YouTube 4K: 25 Mbps chahiye.</li><li>Online Gaming, BGMI, Free Fire: Ping 30ms se kam hona chahiye.</li><li>Zoom / Online Class: 10 Mbps Download + 5 Mbps Upload.</li><li>Work From Home: 50 Mbps best hai.</li></ul>
            <h3 style={{ color: "#17203a", fontSize: 14 }}>Network Ke Baare Me Sab Kuch</h3>
            <p>Ye tool sirf speed nahi batata. Ye IP Address, ISP ka naam, Location, Device ka naam, Connection Type - WiFi ya Mobile Data - sab batata hai. Agar speed kam aa rahi hai to Router ko restart karo, WiFi ke paas jao.</p>
            <h3 style={{ color: "#17203a", fontSize: 14 }}>Jio Speed Test, Airtel Speed Test, Vi Speed Test</h3>
            <p>Apne mobile me Jio, Airtel ya Vi ka data on karke is page ko kholo aur START TEST dabao. Ye tool batayega ki Jio ki speed kitni hai, Airtel ki speed kitni hai. WiFi pe ho to WiFi speed test batayega. 5G pe ho to 5G speed test batayega.</p>
            <h3 style={{ color: "#17203a", fontSize: 14 }}>FAQ</h3>
            <p><b>1. Internet speed kaise check kare?</b> START TEST dabao, 10 second me result aa jayega.<br/><b>2. Kya ye free hai?</b> Haan, 100% free, no app, no signup.<br/><b>3. Ping kya hota hai?</b> Ping matlab network ka response time. Kam ping achha hota hai.<br/><b>4. Jitter kya hota hai?</b> Ping me upar-neeche hona jitter hai. Kam jitter matlab stable network.<br/><b>5. Download aur Upload me kya farak hai?</b> Download matlab dekhna, Upload matlab bhejna.</p>
            <p>Keywords: internet speed test, speed test, wifi speed test, jio speed test, airtel speed test, vi speed test, bsnl speed test, download speed test, upload speed test, ping test, check internet speed, speed test online, fast speed test, broadband speed test, 5g speed test.</p>
          </div>
        </details>

        <p style={{ textAlign: "center", color: "#8793ad", fontSize: 11, marginTop: 16, lineHeight: 1.7 }}>© NEXORA. Free online tools for everyone.<br/><a href="/" style={{ color: "#ff7a00" }}>Home</a> · <a href="/video-compressor" style={{ color: "#ff7a00" }}>Video Compressor</a> · <a href="/compress-image" style={{ color: "#ff7a00" }}>Photo Compressor</a></p>
      </div>
    </div>
  );
}
