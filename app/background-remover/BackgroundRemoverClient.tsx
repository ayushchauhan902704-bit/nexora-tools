"use client";
import { useEffect, useRef, useState } from "react";

type BackgroundColor = "transparent" | "white" | "#6366f1" | "#ef4444";

type RemoveBackgroundFunction = (
  input: File | Blob,
  config?: {
    progress?: (key: string, current: number, total: number) => void;
    model?: "small" | "medium";
    proxyToWorker?: boolean;
    output?: {
      format?: "image/png" | "image/jpeg" | "image/webp";
      quality?: number;
      type?: "foreground";
    };
  }
) => Promise<Blob>;

export default function BackgroundRemoverClient() {
  const [bgColor, setBgColor] = useState<BackgroundColor>("transparent");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [info, setInfo] = useState("");
  const [uploadText, setUploadText] = useState("Tap Karke Photo Upload Karo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [libReady, setLibReady] = useState(false);
  const [isGpu, setIsGpu] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const libraryPromiseRef = useRef<Promise<RemoveBackgroundFunction> | null>(null);
  const loadingRef = useRef(false);
  const objectUrlRef = useRef<string | null>(null);
  const smoothProgressTargetRef = useRef(0);
  const smoothProgressDisplayRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const gpuAvailable = typeof navigator !== "undefined" && "gpu" in navigator;
      setIsGpu(gpuAvailable);
    } catch { setIsGpu(false); }
  }, []);

  const setProgressTarget = (value: number) => {
    const safeValue = Math.max(0, Math.min(100, value));
    smoothProgressTargetRef.current = safeValue;
    if (animationFrameRef.current !== null) return;
    const animate = () => {
      const current = smoothProgressDisplayRef.current;
      const target = smoothProgressTargetRef.current;
      let next = current;
      if (Math.abs(target - current) < 0.5) next = target;
      else next = current + (target - current) * 0.18;
      smoothProgressDisplayRef.current = next;
      setProgress(Math.round(next));
      if (Math.abs(target - next) >= 0.5) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else animationFrameRef.current = null;
    };
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const finishProgress = async () => {
    setProgressTarget(100);
    await new Promise<void>((resolve) => {
      const check = () => {
        if (smoothProgressDisplayRef.current >= 99.5) {
          smoothProgressDisplayRef.current = 100;
          setProgress(100);
          resolve();
          return;
        }
        requestAnimationFrame(check);
      };
      check();
    });
  };

  const cleanupObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const loadLibrary = async (): Promise<RemoveBackgroundFunction> => {
    if (libraryPromiseRef.current) return libraryPromiseRef.current;
    libraryPromiseRef.current = import("@imgly/background-removal")
      .then((module) => {
        const removeBackground = module.default as unknown as RemoveBackgroundFunction;
        if (typeof removeBackground !== "function") throw new Error("Background removal library failed to load.");
        setLibReady(true);
        return removeBackground;
      })
      .catch((error) => {
        libraryPromiseRef.current = null;
        setLibReady(false);
        throw error;
      });
    return libraryPromiseRef.current;
  };

  const prepareImage = async (file: File): Promise<File> => {
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Unable to read the image."));
        image.src = objectUrl;
      });
      let width = image.naturalWidth;
      let height = image.naturalHeight;
      const pixels = width * height;
      const MAX_PIXELS = 12_000_000;
      const MAX_DIMENSION = 3200;
      const dimensionScale = Math.min(1, MAX_DIMENSION / width, MAX_DIMENSION / height);
      const pixelScale = pixels > MAX_PIXELS ? Math.sqrt(MAX_PIXELS / pixels) : 1;
      const scale = Math.min(dimensionScale, pixelScale);
      if (scale >= 1) return file;
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
      if (!ctx) return file;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(image, 0, 0, width, height);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((result) => resolve(result), "image/png", 1);
      });
      if (!blob) return file;
      return new File([blob], file.name, { type: "image/png", lastModified: Date.now() });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setStatus("Please upload a JPG, PNG, or WebP image.");
      setIsSuccess(false);
      return false;
    }
    if (file.size > 25 * 1024 * 1024) {
      setStatus("Image size must be 25 MB or less.");
      setIsSuccess(false);
      return false;
    }
    return true;
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    if (!img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (bgColor !== "transparent") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (showPreview) requestAnimationFrame(redraw);
  }, [bgColor, showPreview]);

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;
    if (loadingRef.current) return;
    loadingRef.current = true;
    if (fileInputRef.current) fileInputRef.current.value = "";
    cleanupObjectUrl();
    setIsProcessing(true);
    setShowPreview(false);
    setInfo("");
    setUploadText(file.name);
    setStatus("Photo taiyaar kar raha hu...");
    setIsSuccess(true);
    smoothProgressDisplayRef.current = 0;
    smoothProgressTargetRef.current = 0;
    setProgress(0);
    try {
      setStatus(isGpu ? "Starting GPU AI..." : "Starting AI...");
      setProgressTarget(5);
      const removeBackground = await loadLibrary();
      setProgressTarget(12);
      setStatus("Photo ko optimize kar raha hu...");
      const preparedFile = await prepareImage(file);
      setProgressTarget(20);
      setStatus(isGpu ? "GPU AI se background hata raha hu..." : "AI se background hata raha hu...");
      const result = await removeBackground(preparedFile, {
        model: "medium",
        proxyToWorker: true,
        output: { format: "image/png", quality: 1, type: "foreground" },
        progress: (_key, current, total) => {
          if (total <= 0) return;
          const percent = (current / total) * 100;
          const mapped = 20 + percent * 0.76;
          setProgressTarget(mapped);
        },
      });
      setProgressTarget(97);
      setStatus("Transparent PNG bana raha hu...");
      const resultBlob = result instanceof Blob ? result : new Blob([result], { type: "image/png" });
      blobRef.current = resultBlob;
      cleanupObjectUrl();
      const resultUrl = URL.createObjectURL(resultBlob);
      objectUrlRef.current = resultUrl;
      const previewImage = new Image();
      await new Promise<void>((resolve, reject) => {
        previewImage.onload = () => resolve();
        previewImage.onerror = () => reject(new Error("Could not load the processed image."));
        previewImage.src = resultUrl;
      });
      imgRef.current = previewImage;
      setInfo(`${previewImage.naturalWidth} × ${previewImage.naturalHeight} • PNG • Transparent • No Watermark`);
      setShowPreview(true);
      setProgressTarget(99);
      requestAnimationFrame(() => redraw());
      await finishProgress();
      setStatus("Ho gaya! Background hat gaya.");
      setIsSuccess(true);
    } catch (error) {
      console.error("NEXORA Background Removal Error:", error);
      setProgressTarget(0);
      setStatus("Background nahi hata. Dusri photo try karo.");
      setIsSuccess(false);
      setInfo("");
      cleanupObjectUrl();
      blobRef.current = null;
      imgRef.current = null;
      setShowPreview(false);
    } finally {
      setIsProcessing(false);
      loadingRef.current = false;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleUploadClick = () => {
    if (!isProcessing) fileInputRef.current?.click();
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nexora-background-removed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const resetTool = () => {
    cleanupObjectUrl();
    blobRef.current = null;
    imgRef.current = null;
    setShowPreview(false);
    setInfo("");
    setProgress(0);
    smoothProgressDisplayRef.current = 0;
    smoothProgressTargetRef.current = 0;
    setStatus("");
    setUploadText("Tap Karke Photo Upload Karo");
    setBgColor("transparent");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#ffffff", color: "#0f172a", minHeight: "100vh", colorScheme: "light" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #eef2f7", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ fontSize: 24, fontWeight: 900, color: "#2563eb", textDecoration: "none" }}>NEXORA</a>
          <nav style={{ display: "flex", gap: 20, fontSize: 14, fontWeight: 600 }}>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>Home</a>
            <a href="/" style={{ color: "#0f172a", textDecoration: "none" }}>All Tools</a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "30px 18px 10px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "7px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>✦ FREE • HD • NO WATERMARK • 100% PRIVATE</span>
          </div>
          <h1 style={{ fontSize: 38, margin: "14px 0 8px", lineHeight: 1.05, letterSpacing: "-0.5px", fontWeight: 900, fontFamily: "'Inter', system-ui, sans-serif", background: "linear-gradient(90deg, #1d4ed8, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>Background Remover<br />FREE - No Watermark</h1>
          <p style={{ color: "#64748b", fontSize: 16, margin: 0, lineHeight: 1.6 }}>Photo ka background 1 sec me hatao.<br />Transparent PNG banao - Passport, Shop, Profile ke liye.</p>
        </div>

        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 18, boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 10px", textAlign: "center" }}>Apni Photo Yaha Upload Karo</p>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleInputChange} hidden />
          {!showPreview ? (
            <div onClick={handleUploadClick} style={{ border: "1.5px dashed #cbd5e1", borderRadius: 14, padding: 18, textAlign: "center", cursor: isProcessing ? "not-allowed" : "pointer", background: "#fff" }}>
              <div style={{ fontSize: 28 }}>✨</div>
              <p style={{ fontWeight: 700, margin: "6px 0 2px", fontSize: 15 }}>{uploadText}</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>JPG, PNG, WebP • Up to 25 MB • 100% Private</p>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>Your Result</div>
                  <div style={{ marginTop: 2, color: "#64748b", fontSize: 12 }}>{info}</div>
                </div>
                <button type="button" onClick={resetTool} style={{ border: "1px solid #e2e8f0", background: "#f8fafc", borderRadius: 10, padding: "8px 12px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Remove Another</button>
              </div>
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 10, background: "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 20px 20px", overflow: "auto" }}>
                <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "auto", maxHeight: 560, objectFit: "contain", borderRadius: 10, margin: "0 auto" }} />
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 12, padding: "10px 12px", marginTop: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Background Choose Karo</div>
                <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, whiteSpace: "nowrap", scrollbarWidth: "none" }}>
                  {(["transparent", "white", "#6366f1", "#ef4444"] as const).map((value) => {
                    const label = value === "transparent" ? "Transparent" : value === "white" ? "White" : value === "#6366f1" ? "Blue" : "Red";
                    const active = bgColor === value;
                    return <button key={value} type="button" onClick={() => setBgColor(value)} style={{ padding: "6px 12px", borderRadius: 999, border: active ? "1.5px solid #f97316" : "1px solid #e2e8f0", background: active ? "#fff7ed" : "#fff", color: active ? "#ea580c" : "#0f172a", fontWeight: 700, cursor: "pointer", fontSize: 12, flexShrink: 0 }}>{label}</button>;
                  })}
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 6 }}><span>{status}</span><span style={{ color: "#2563eb" }}>{progress}%</span></div>
              <div style={{ width: "100%", height: 9, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#2563eb,#6d28d9)", borderRadius: 999, transition: "width 100ms linear" }} />
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: "#94a3b8" }}>{isGpu ? "GPU acceleration available" : "Optimized browser processing"}</div>
            </div>
          )}

          {status && !isProcessing && <p style={{ background: isSuccess ? "#ecfdf5" : "#fef2f2", color: isSuccess ? "#047857" : "#dc2626", padding: "10px 12px", borderRadius: 10, fontSize: 14, margin: "14px 0 0", textAlign: "center", fontWeight: 600 }}>{status}</p>}

          {!showPreview && <div style={{ marginTop: 12, padding: "10px 12px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, fontSize: 12, color: "#57534e" }}><b style={{ color: "#d97706" }}>Note:</b> Best result ke liye paas se li hui saaf photo use karo. Background simple hoga to cutting ekdum perfect aayegi.</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            {showPreview ? (
              <button onClick={download} style={{ flex: 1, padding: 15, background: "#f97316", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>Download Karo - PNG →</button>
            ) : (
              <button onClick={handleUploadClick} disabled={isProcessing} style={{ flex: 1, padding: 15, background: "#f97316", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: isProcessing ? "not-allowed" : "pointer", opacity: isProcessing ? 0.5 : 1 }}>{isProcessing ? "Bana Raha Hu..." : "Photo Upload Karo →"}</button>
            )}
            <button onClick={resetTool} style={{ padding: "15px 20px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Clear</button>
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "10px 0 0", fontWeight: 700 }}>🔒 100% Private - Photo browser me hi badalti hai, kabhi upload nahi hoti</p>
        </div>

        <div style={{ height: 70 }}></div>

        <div style={{ background: "#fefce8", border: "2px solid #facc15", borderRadius: 16, padding: 18 }}>
          <b>💡 Earning Tip - Is Tool Se Paisa Kamao!</b>
          <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.7 }}>Studio wale background hatane ke ₹50-100 lete hai. Tu WhatsApp pe ₹20 me kisi ki bhi photo ka background hata de. Roz 20 photo = ₹400. Koi paisa nahi lagna, sirf ye free tool.</p>
        </div>

        <div style={{ height: 30 }}></div>

        <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 18, padding: 22 }}>
          <h2 style={{ fontSize: 21 }}>Free AI Background Remover</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}>NEXORA Background Remover se JPG, PNG ya WebP photo ka background 1 sec me hatao. AI photo ke main subject ko pehchan ke background ko transparent kar deta hai. Result PNG me milta hai.<br /><br /><b>Transparent</b> = Bina background ke PNG.<br /><b>White</b> = Passport / Visa photo ke liye.<br /><b>Blue / Red</b> = ID, Form, Shop ke liye.</p>
          <img src="/background-remover-example.jpg" alt="NEXORA AI background remover example" style={{ display: "block", width: "100%", maxWidth: 760, height: "auto", margin: "16px auto", borderRadius: 14 }} />

          <h2 style={{ fontSize: 21, marginTop: 26 }}>Kaise Use Kare? 3 Step Me</h2>
          <p style={{ color: "#475569", lineHeight: 1.8 }}><b>Step 1:</b> Photo upload karo - JPG, PNG ya WebP.<br /><b>Step 2:</b> AI background hata dega, Transparent / White / Blue / Red choose karo.<br /><b>Step 3:</b> Download dabao - Bina watermark ke PNG mil jayega.</p>

          <h2 style={{ fontSize: 21, marginTop: 26 }}>NEXORA vs Dusre Tools</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 10 }}><tbody>
            <tr><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc", textAlign: "left" }}>Feature</th><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc" }}>NEXORA ✅</th><th style={{ border: "1px solid #eef2f7", padding: 8, background: "#f8fafc" }}>Dusre ❌</th></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Free</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Haan ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>1-2 Free, Fir Paisa</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Watermark</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Nahi ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Lagta Hai</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Transparent PNG</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Haan ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Pro Me</td></tr>
            <tr><td style={{ border: "1px solid #eef2f7", padding: 8 }}>Privacy</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>100% Private ✅</td><td style={{ border: "1px solid #eef2f7", padding: 8, textAlign: "center" }}>Server Pe Jati Hai</td></tr>
          </tbody></table>

          <h2 style={{ fontSize: 21, marginTop: 26 }}>Aksar Puche Jane Wale Sawal</h2>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Is NEXORA Background Remover free?</summary><p style={{ color: "#475569" }}>Haan, bilkul free hai, bina account ke.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Kaun se format chalte hai?</summary><p style={{ color: "#475569" }}>JPG, PNG aur WebP. Max 25 MB tak.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Transparent PNG kaise banaye?</summary><p style={{ color: "#475569" }}>Photo upload karo, Transparent select karo, Download dabao.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Passport ke liye white background kaise kare?</summary><p style={{ color: "#475569" }}>Background hatne ke baad White select karo, fir Download karo.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Kya meri photo safe hai?</summary><p style={{ color: "#475569" }}>Haan, photo browser me hi badalti hai, server pe nahi jati.</p></details>
          <details style={{ border: "1px solid #eef2f7", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}><summary style={{ fontWeight: 700, cursor: "pointer" }}>Watermark lagega?</summary><p style={{ color: "#475569" }}>Nahi, NEXORA ka koi watermark nahi lagega.</p></details>

          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <a href="/passport-photo-maker" style={{ flex: 1, textAlign: "center", padding: 14, background: "#0f172a", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Agla Tool Dekho → Passport Photo Maker</a>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", margin: "30px 0 10px", lineHeight: 1.6 }}>By <b style={{ color: "#0f172a" }}>Ayush Chauhan</b> • Tool: Nexora<br />Last Updated: 14 Nov 2026 • 100% Free & Private</p>
      </main>

      <div style={{ background: "#f8fafc", borderTop: "1px solid #eef2f7", padding: "16px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "nexoraLoop 18s linear infinite", fontSize: 14, fontWeight: 700, color: "#2563eb" }}>
          <span style={{ padding: "0 18px" }}>✦ DPI Changer 10-1200</span><span style={{ padding: "0 18px" }}>✦ Compress Image to 20KB</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span><span style={{ padding: "0 18px" }}>✦ DPI Changer 10-1200</span><span style={{ padding: "0 18px" }}>✦ Compress Image to 20KB</span><span style={{ padding: "0 18px" }}>✦ Background Remover</span><span style={{ padding: "0 18px" }}>✦ Passport Photo Maker</span>
        </div>
        <style>{`@keyframes nexoraLoop { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      <footer style={{ background: "#0f172a", color: "#cbd5e1", padding: "20px 16px", textAlign: "center", fontSize: 13 }}>
        <b style={{ color: "#fff", fontSize: 16 }}>NEXORA</b>
        <p style={{ margin: "6px 0 0" }}>Free Tools. Simple Solutions. • <a href="/about" style={{ color: "#cbd5e1" }}>About</a> • <a href="/privacy-policy" style={{ color: "#cbd5e1" }}>Privacy</a> • <a href="/contact" style={{ color: "#cbd5e1" }}>Contact</a></p>
      </footer>
    </div>
  );
}
