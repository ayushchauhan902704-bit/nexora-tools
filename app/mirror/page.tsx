"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [count, setCount] = useState(2);

  useEffect(() => {
    // 2 sec baad Flipkart pe bhej do - tab tak NEXORA ka view count ho jayega
    const timer = setTimeout(() => {
      window.location.href = "https://fkrt.co/PODvi7";
    }, 2000);

    const counter = setInterval(() => {
      setCount((c) => (c > 0 ? c - 1 : 0));
    }, 1000);

    return () => { clearTimeout(timer); clearInterval(counter); };
  }, []);

  return (
    <div style={{ fontFamily: "Arial,sans-serif", textAlign: "center", paddingTop: 80, minHeight: "100vh", background: "#fff", color: "#171725" }}>
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: "#6c5ce7" }}>NEX<span style={{ color: "#171725" }}>ORA</span> • ONLINE MIRROR</div>
      <h2 style={{ fontSize: 26, marginTop: 16 }}>🪞 Opening Mirror...</h2>

      <div style={{ border: "5px solid #f3f3f3", borderTop: "5px solid #2874f0", borderRadius: "50%", width: 50, height: 50, animation: "spin 1s linear infinite", margin: "20px auto" }}></div>
      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>

      <p style={{ color: "#676778" }}>Please wait {count} second...</p>
      <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>Redirecting to Flipkart Mirror...</p>

      <div style={{ marginTop: 30 }}>
        <a href="https://fkrt.co/PODvi7" style={{ display: "inline-block", background: "#2874f0", color: "#fff", padding: "12px 22px", borderRadius: 999, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Agar na khule to yaha click karo →</a>
      </div>

      <p style={{ fontSize: 11, color: "#aaa", marginTop: 30 }}>Powered by NEXORA Tools • Made in India 🇮🇳</p>
    </div>
  );
}
