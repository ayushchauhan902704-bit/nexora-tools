"use client";
import { useState, useRef, useEffect } from "react";

export default function BackgroundRemoverClientSpanish() {
  const [bgColor, setBgColor] = useState("transparent");
  const [status, setStatus] = useState("Sube una foto para empezar");
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [info, setInfo] = useState("");
  const [uploadText, setUploadText] = useState("Toca para Subir Foto");
  const [isProcessing, setIsProcessing] = useState(false);
  const [libReady, setLibReady] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const s = document.createElement("script");
    s.type = "module";
    s.innerHTML = `
      import removeBackground from "https://esm.sh/@imgly/background-removal@1.4.5";
      window.__nexoraRemoveBg = removeBackground;
      window.dispatchEvent(new Event("nexora-bg-ready"));
    `;
    document.body.appendChild(s);
    const onReady = () => setLibReady(true);
    window.addEventListener("nexora-bg-ready", onReady);
    if (!document.querySelector('script[data-nexora-importmap]')) {
      const im = document.createElement("script");
      im.setAttribute("type", "importmap");
      im.setAttribute("data-nexora-importmap", "1");
      im.setAttribute("data-nexora-importmap", "1");
      im.textContent = JSON.stringify({ imports: { "@imgly/background-removal": "https://esm.sh/@imgly/background-removal@1.4.5" } });
      document.head.appendChild(im);
    }
    return () => window.removeEventListener("nexora-bg-ready", onReady);
  }, []);

  const redraw = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    if (bgColor === "transparent") ctx.clearRect(0, 0, canvas.width, canvas.height);
    else { ctx.fillStyle = bgColor === "white" ? "#ffffff" : bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.drawImage(img, 0, 0);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!(window as any).__nexoraRemoveBg) {
      setStatus("⏳ La librería de IA se está cargando, espera 5 segundos e inténtalo de nuevo...");
      return;
    }
    setUploadText("⏳ Cargando IA...");
    setShowPreview(false);
    setStatus("⏳ Cargando IA...");
    progressRef.current = 0;
    setProgress(0);
    setIsProcessing(true);
    try {
      const removeBg = (window as any).__nexoraRemoveBg;
      const blob = await removeBg(file, {
        progress: (_key: string, current: number, total: number) => {
          if (!total) return;
          const pct = Math.round((current / total) * 100);
          if (pct > progressRef.current) {
            progressRef.current = pct;
            setProgress(pct);
            if (pct < 30) setStatus(`⏳ Cargando IA... ${pct}%`);
            else if (pct < 90) setStatus(`🤖 Eliminando Fondo... ${pct}%`);
            else setStatus(`✨ Casi Listo... ${pct}%`);
          }
        },
      });
      progressRef.current = 100;
      setProgress(100);
      blobRef.current = blob;
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setTimeout(() => { redraw(); }, 50);
        setShowPreview(true);
        setUploadText("✅ Fondo Eliminado");
        setStatus("✅ ¡Listo! Elige el color de fondo");
        setInfo(`${img.naturalWidth}x${img.naturalHeight} • HD PNG`);
        setIsProcessing(false);
        setProgress(100);
      };
      img.src = url;
    } catch (err: any) {
      setStatus("❌ Error: " + err.message);
      setIsProcessing(false);
    }
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !blobRef.current) { alert("Por favor sube una foto primero"); return; }
    canvas.toBlob((b) => {
      if (!b) return;
      const url = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = url; a.download = `nexora-bg-${Date.now()}.png`;
      document.body.appendChild(a); a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    }, "image/png", 1);
  };

  const colors = [
    { label: "Transparente", val: "transparent" },
    { label: "Blanco - Pasaporte", val: "white" },
    { label: "Azul - Visa", val: "#6366f1" },
    { label: "Rojo", val: "#ef4444" },
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#ffffff", color: "#0f172a", minHeight: "100vh", colorScheme: "light" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #eef2f7", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 900, color: "#2563eb", textDecoration: "none" }}>NEXORA</a>
          <nav style={{ display: "flex", gap: 20, fontSize: 14, fontWeight: 600 }}>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>Inicio</a>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>Todas las Herramientas</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "30px 18px 10px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: "0.3px", whiteSpace: "nowrap", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>
              ✦ GRATIS • HD • SIN MARCA DE AGUA • {libReady ? "IA LISTA ✅" : "CARGANDO IA..."}
            </span>
          </div>
          <h1 style={{ fontSize: 38, margin: "14px 0 8px", lineHeight: 1.05, letterSpacing: "-0.5px", fontWeight: 900, fontFamily: "'Inter', system-ui, sans-serif", background: "linear-gradient(90deg, #1d4ed8, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>Eliminar<br/>Fondo</h1>
          <p style={{ color: "#64748b", fontSize: 16, margin: 0, lineHeight: 1.6 }}>Elimina el fondo en 1 segundo.<br/>Transparente, Blanco, Azul, Rojo - HD PNG.</p>
        </div>

        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 18, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 10px", textAlign: "center" }}>Sube Tu Foto Aquí</p>
          <div onClick={() => fileRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }} style={{ border: "1.5px dashed #cbd5e1", borderRadius: 14, padding: 18, textAlign: "center", background: "#fff", cursor: "pointer" }}>
            <div style={{ fontSize: 28 }}>📷</div>
            <p style={{ fontWeight: 700, margin: "6px 0 2px", fontSize: 15 }}>{uploadText}</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>JPG, PNG, WebP • 100% Privado • IA en el Navegador</p>
            <input type="file" ref={fileRef} accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
          </div>

          {isProcessing && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: "#2563eb" }}>{status}</span>
                <span style={{ color: "#2563eb" }}>{progress}%</span>
              </div>
              <div style={{ width: "100%", height: 8, background: "#eef2f7", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #2563eb, #7c3aed)", transition: "width 0.3s ease", borderRadius: 999 }} />
              </div>
            </div>
          )}
          {!isProcessing && <p style={{ fontSize: 13, fontWeight: 700, textAlign: "center", margin: "12px 0 0", color: "#2563eb" }}>{status}</p>}

          <p style={{ fontWeight: 700, fontSize: 14, margin: "16px 0 10px", textAlign: "center" }}>Elige el Fondo</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {colors.map((c) => (
              <button key={c.val} onClick={() => { setBgColor(c.val); setTimeout(() => redraw(), 50); }} style={{ padding: "8px 14px", borderRadius: 999, border: bgColor === c.val ? "2px solid #f97316" : "1.5px solid #e2e8f0", background: bgColor === c.val ? "#fff7ed" : "#fff", color: bgColor === c.val ? "#ea580c" : "#0f172a", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{c.label}</button>
            ))}
          </div>

          {showPreview && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <canvas ref={canvasRef} style={{ maxWidth: "100%", borderRadius: 12, border: "1px solid #eee" }} />
              <p style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>{info}</p>
              <button onClick={download} style={{ width: "100%", padding: 15, background: "#f97316", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 8 }}>Descargar HD PNG ↓</button>
            </div>
          )}
          {!showPreview && !isProcessing && <button onClick={() => fileRef.current?.click()} style={{ width: "100%", padding: 15, background: "#f97316", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 16 }}>Eliminar Fondo →</button>}
        </div>

        <div style={{ height: 70 }}></div>

        <div style={{ background: "#fefce8", border: "2px solid #facc15", borderRadius: 16, padding: 18 }}>
          <b>💡 Consejo Para Ganar Dinero - ¡Gana Dinero Con Esta Herramienta!</b>
          <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.7 }}>Para una foto de pasaporte se necesita fondo blanco. Los estudios cobran $5. Puedes ofrecer fotos de pasaporte con fondo blanco en WhatsApp o Fiverr por $2. 20 fotos al día = $40. Usa esta herramienta, solo tarda 1 segundo.</p>
        </div>

        <div style={{ height: 30 }}></div>

        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21 }}>¿Por Qué NEXORA Es El Mejor Eliminador de Fondo?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}>A diferencia de remove.bg con límites, marca de agua y planes de pago, NEXORA es <b>100% gratis para siempre, sin marca de agua, HD PNG, 100% privado</b> - tu foto nunca sale de tu teléfono. La IA funciona en el navegador. Elige <b>Transparente para productos, Blanco para pasaporte, Azul para visa, Rojo para documentos.</b></p>
          <h2 style={{ fontSize: 21, marginTop: 26 }}>¿Cómo Usar?</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Paso 1:</b> Sube tu foto.<br/><b>Paso 2:</b> La IA elimina el fondo en 1 seg.<br/><b>Paso 3:</b> Elige el fondo y Descarga HD PNG.</p>

          <h2 style={{ fontSize: 21, marginTop: 26 }}>NEXORA vs Otros</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc", textAlign: "left" }}>Característica</th><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc" }}>NEXORA ✅</th><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc" }}>Otros ❌</th></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Límite</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Ilimitado ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Solo 1-2 Gratis</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Marca de agua</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>No ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>De Pago</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Privacidad</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>100% Privado ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Sube al Servidor</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Calidad</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>HD PNG ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Baja Calidad</td></tr>
          </tbody></table>

          <h2 style={{ fontSize: 21, marginTop: 26 }}>Preguntas Frecuentes</h2>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>¿Es gratis este eliminador de fondo?</summary><p style={{ color: "#475569" }}>Sí, 100% gratis, sin marca de agua, ilimitado.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>¿Cómo hacer una foto de pasaporte con fondo blanco?</summary><p style={{ color: "#475569" }}>Sube tu foto, elimina el fondo, elige Blanco para pasaporte, Azul para visa.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>¿Mi foto está segura y es privada?</summary><p style={{ color: "#475569" }}>Sí, la IA funciona en tu navegador, tu foto nunca va a ningún servidor.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>¿Funciona en iPhone?</summary><p style={{ color: "#475569" }}>Sí, funciona en iPhone, Android y Laptop - sin necesidad de app.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>¿La calidad se mantiene en HD?</summary><p style={{ color: "#475569" }}>Sí, HD PNG en calidad original, sin borrosidad.</p></details>

          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <a href="/passport-photo-maker/spanish" style={{ flex: 1, textAlign: "center", padding: 14, background: "#0f172a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Prueba La Siguiente Herramienta → Creador de Fotos de Pasaporte</a>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "30px 0 10px", lineHeight: 1.6 }}>Por <b style={{ color: "#0f172a" }}>Ayush Chauhan</b> • Herramienta: Nexora<br/>Última Actualización: 6 Nov 2026 • 100% Gratis y Privado</p>
      </main>

      <div style={{ background: "#f8fafc", borderTop: "1px solid #eef2f7", padding: "16px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "nexoraLoop 18s linear infinite", fontSize: 14, fontWeight: 700, color: "#2563eb" }}>
          <span style={{ padding: "0 18px" }}>✦ Eliminar Fondo</span><span style={{ padding: "0 18px" }}>✦ Comprimir Imagen a 20KB</span><span style={{ padding: "0 18px" }}>✦ Creador de Fotos de Pasaporte</span><span style={{ padding: "0 18px" }}>✦ Humanizador de Texto IA</span><span style={{ padding: "0 18px" }}>✦ Eliminar Fondo</span><span style={{ padding: "0 18px" }}>✦ Comprimir Imagen a 20KB</span><span style={{ padding: "0 18px" }}>✦ Creador de Fotos de Pasaporte</span><span style={{ padding: "0 18px" }}>✦ Humanizador de Texto IA</span>
        </div>
        <style>{`@keyframes nexoraLoop { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      <footer style={{ background: "#0f172a", color: "#cbd5e1", padding: "20px 16px", textAlign: "center", fontSize: 13 }}>
        <b style={{ color: "#fff", fontSize: 16 }}>NEXORA</b>
        <p style={{ margin: "6px 0 0" }}>Herramientas Gratis. Soluciones Simples. • <a href="/about" style={{ color: "#cbd5e1" }}>Acerca de</a> • <a href="/privacy-policy" style={{ color: "#cbd5e1" }}>Privacidad</a> • <a href="/contact" style={{ color: "#cbd5e1" }}>Contacto</a></p>
      </footer>
    </div>
  );
}
