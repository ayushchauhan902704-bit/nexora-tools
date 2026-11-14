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
  const [status, setStatus] = useState("Téléchargez une photo pour commencer");
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [info, setInfo] = useState("");
  const [uploadText, setUploadText] = useState("Appuyez pour Télécharger une Photo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [libReady, setLibReady] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const libraryPromiseRef = useRef<Promise<RemoveBackgroundFunction> | null>(null);
  const loadingRef = useRef(false);
  const objectUrlRef = useRef<string | null>(null);
  const progressTargetRef = useRef(0);
  const progressDisplayRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const setProgressTarget = (value: number) => {
    const safeValue = Math.max(0, Math.min(100, value));
    progressTargetRef.current = safeValue;
    if (animationFrameRef.current !== null) return;
    const animate = () => {
      const current = progressDisplayRef.current;
      const target = progressTargetRef.current;
      let next = current;
      if (Math.abs(target - current) < 0.5) next = target;
      else next = current + (target - current) * 0.2;
      progressDisplayRef.current = next;
      setProgress(Math.round(next));
      if (Math.abs(target - next) >= 0.5) animationFrameRef.current = requestAnimationFrame(animate);
      else animationFrameRef.current = null;
    };
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const finishProgress = async () => {
    setProgressTarget(100);
    await new Promise<void>((resolve) => {
      const check = () => {
        if (progressDisplayRef.current >= 99.5) {
          progressDisplayRef.current = 100;
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

  useEffect(() => {
    const preload = () => { loadLibrary().catch(() => {}); };
    const win = window as any;
    if (typeof win.requestIdleCallback === "function") {
      const idleId = win.requestIdleCallback(preload, { timeout: 1500 });
      return () => { if (typeof win.cancelIdleCallback === "function") win.cancelIdleCallback(idleId); };
    }
    const timer = setTimeout(preload, 800);
    return () => { clearTimeout(timer); };
  }, []);

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
      const MAX_PIXELS = 8_000_000;
      const MAX_DIMENSION = 2400;
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
      let outputType = file.type;
      if (outputType !== "image/png" && outputType !== "image/jpeg" && outputType !== "image/webp") outputType = "image/png";
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((result) => resolve(result), outputType, outputType === "image/png" ? undefined : 0.92);
      });
      if (!blob) return file;
      return new File([blob], file.name, { type: outputType, lastModified: Date.now() });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setStatus("Veuillez télécharger une image JPG, PNG ou WebP.");
      return false;
    }
    if (file.size > 25 * 1024 * 1024) {
      setStatus("La taille de l'image doit être de 25 Mo maximum.");
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
    setStatus("Préparation de votre image...");
    progressDisplayRef.current = 0;
    progressTargetRef.current = 0;
    setProgress(0);
    try {
      setStatus("Chargement du moteur IA...");
      setProgressTarget(5);
      const removeBackground = await loadLibrary();
      setProgressTarget(12);
      setStatus("Optimisation de l'image...");
      const preparedFile = await prepareImage(file);
      setProgressTarget(20);
      setStatus("L'IA supprime le fond...");
      const result = await removeBackground(preparedFile, {
        model: "medium",
        proxyToWorker: true,
        output: { format: "image/png", quality: 1, type: "foreground" },
        progress: (_key, current, total) => {
          if (total <= 0) return;
          const percent = (current / total) * 100;
          const mapped = 20 + percent * 0.68;
          setProgressTarget(mapped);
        },
      });
      setProgressTarget(90);
      setStatus("Création de votre PNG transparent...");
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
      setInfo(`${previewImage.naturalWidth} × ${previewImage.naturalHeight} • PNG • Transparent • Sans Filigrane`);
      setShowPreview(true);
      setProgressTarget(97);
      requestAnimationFrame(() => { redraw(); });
      await finishProgress();
      setStatus("Fond supprimé avec succès !");
    } catch (error) {
      console.error("NEXORA Background Removal Error:", error);
      setProgressTarget(0);
      setStatus("Impossible de supprimer le fond. Veuillez essayer une autre photo.");
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
    loadLibrary().catch(() => {});
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nexora-fond-supprime-${Date.now()}.png`;
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
    progressDisplayRef.current = 0;
    progressTargetRef.current = 0;
    setStatus("Téléchargez une photo pour commencer");
    setUploadText("Appuyez pour Télécharger une Photo");
    setBgColor("transparent");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main style={{ minHeight: "100vh", background: "#ffffff", color: "#111827" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,0.94)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "13px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <a href="/" style={{ textDecoration: "none", fontWeight: 950, fontSize: 22, color: "#2563eb" }}>NEXORA</a>
          <nav style={{ display: "flex", gap: 16, fontSize: 14, fontWeight: 700 }}>
            <a href="/" style={{ color: "#374151", textDecoration: "none" }}>Accueil</a>
            <a href="/passport-photo-maker" style={{ color: "#374151", textDecoration: "none" }}>Photo d'Identité</a>
          </nav>
        </div>
      </header>

      <section style={{ maxWidth: 850, margin: "0 auto", padding: "42px 20px 22px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", fontWeight: 800, fontSize: 11, letterSpacing: "0.04em" }}>
          {libReady ? "GRATUIT • IA • PNG HD • SANS FILIGRANE" : "GRATUIT • SUPPRESSEUR DE FOND IA"}
        </div>
        <h1 style={{ fontSize: "clamp(36px, 8vw, 62px)", lineHeight: 1.04, margin: "17px 0 12px", fontWeight: 950, letterSpacing: "-0.045em", background: "linear-gradient(90deg, #1d4ed8, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Supprimez le Fond d'une Photo en Quelques Secondes
        </h1>
        <p style={{ maxWidth: 700, margin: "0 auto", fontSize: 17, lineHeight: 1.65, color: "#64748b" }}>
          Supprimez automatiquement le fond de vos photos avec l'IA et créez un PNG transparent propre directement dans votre navigateur. Sans Photoshop, sans inscription et sans filigrane.
        </p>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "8px 18px 48px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 18, padding: 16, boxShadow: "0 15px 45px rgba(15,23,42,0.07)" }}>
          {!showPreview ? (
            <div onClick={handleUploadClick} onMouseEnter={() => loadLibrary().catch(() => {})} style={{ minHeight: 205, border: "2px dashed #cbd5e1", borderRadius: 15, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "22px 18px", cursor: isProcessing ? "not-allowed" : "pointer", background: "#f8fafc" }}>
              <div style={{ width: 56, height: 56, borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", background: "#eff6ff", color: "#2563eb", fontSize: 27, marginBottom: 11 }}>✨</div>
              <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 900 }}>{uploadText}</h2>
              <p style={{ margin: "0 0 5px", color: "#64748b", fontSize: 14 }}>JPG, PNG ou WebP • Jusqu'à 25 Mo</p>
              <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Gratuit • Sans inscription • Dans le navigateur</p>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleInputChange} style={{ display: "none" }} />
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 19 }}>Votre Résultat</div>
                  <div style={{ marginTop: 4, color: "#64748b", fontSize: 13 }}>{info}</div>
                </div>
                <button type="button" onClick={resetTool} style={{ border: "1px solid #cbd5e1", background: "#ffffff", borderRadius: 9, padding: "9px 12px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Supprimer une Autre</button>
              </div>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 15, padding: 10, background: "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 20px 20px", overflow: "auto" }}>
                <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "auto", maxHeight: 560, objectFit: "contain", borderRadius: 10, margin: "0 auto" }} />
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 8 }}>Fond</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(["transparent", "white", "#6366f1", "#ef4444"] as const).map((value) => {
                    const label = value === "transparent" ? "Transparent" : value === "white" ? "Blanc" : value === "#6366f1" ? "Bleu" : "Rouge";
                    return (
                      <button key={value} type="button" onClick={() => setBgColor(value)} style={{ border: bgColor === value ? "2px solid #f97316" : "1px solid #cbd5e1", background: bgColor === value ? "#fff7ed" : "#ffffff", color: bgColor === value ? "#ea580c" : "#111827", borderRadius: 9, padding: "8px 11px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>{label}</button>
                    );
                  })}
                </div>
              </div>
              <button type="button" onClick={download} style={{ width: "100%", marginTop: 16, border: 0, borderRadius: 11, padding: "13px 16px", background: "#f97316", color: "#ffffff", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>Télécharger PNG - GRATUIT →</button>
            </div>
          )}
          {isProcessing && (
            <div style={{ marginTop: 16, padding: "15px", border: "1px solid #dbeafe", borderRadius: 12, background: "#f8fbff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 9, fontSize: 13, fontWeight: 800 }}>
                <span>{status}</span>
                <span style={{ color: "#2563eb", minWidth: 38, textAlign: "right" }}>{progress}%</span>
              </div>
              <div style={{ width: "100%", height: 9, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#2563eb,#7c3aed)", borderRadius: 999, transition: "width 120ms linear" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 11, color: "#64748b" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563eb", animation: "nexoraPulse 1s infinite" }} />
                <span>L'IA traite dans votre navigateur</span>
              </div>
              <style jsx>{`@keyframes nexoraPulse { 0%, 100% { opacity: 0.35; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }`}</style>
            </div>
          )}
          {!isProcessing && !showPreview && <p style={{ margin: "13px 0 0", textAlign: "center", color: "#64748b", fontSize: 13 }}>{status}</p>}
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 18px 42px" }}>
        <div style={{ background: "#111827", color: "#ffffff", borderRadius: 18, padding: "24px 20px", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 24 }}>Supprimez les Fonds Gratuitement</h2>
          <p style={{ maxWidth: 620, margin: "0 auto", color: "#cbd5e1", lineHeight: 1.65, fontSize: 14 }}>Supprimez le fond des photos sans filigrane, sans compte et sans logiciel compliqué.</p>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 18px 50px" }}>
        <article style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 18, padding: "25px", lineHeight: 1.8, color: "#475569" }}>
          <h2 style={{ color: "#111827", fontSize: 28, marginTop: 0 }}>Suppresseur de Fond IA Gratuit - Supprimez le Fond d'une Photo Sans Photoshop</h2>
          <p>NEXORA Suppresseur de Fond est un outil en ligne gratuit pour supprimer le fond des photos. Téléchargez une image JPG, PNG ou WebP et l'IA sépare automatiquement le sujet principal du fond. Sans Photoshop.</p>
          <p>Le résultat est généré en PNG avec transparence préservée. Vous pouvez aussi remplacer le fond supprimé par du blanc, du bleu ou du rouge. C'est utile pour les photos d'identité, photos de produits, photos de profil, réseaux sociaux et annonces en ligne.</p>
          <p>Pour supprimer le fond d'une photo sans Photoshop, téléchargez simplement votre image. L'IA du navigateur traite l'image et crée un PNG transparent que vous pouvez télécharger gratuitement.</p>
          <h3 style={{ color: "#111827" }}>Suppression de Fond pour Photos</h3>
          <p>L'outil est conçu pour les photos de produits, photos de profil, images pour réseaux sociaux, préparation de photo d'identité, images de document, présentations, boutiques en ligne et autres tâches quotidiennes.</p>
          <h3 style={{ color: "#111827" }}>Traitement Rapide dans le Navigateur</h3>
          <p>NEXORA effectue la suppression de fond directement dans le navigateur avec l'IA. La vitesse dépend de l'appareil, du navigateur, des dimensions de l'image et si le modèle d'IA a déjà été mis en cache par le navigateur.</p>
          <h3 style={{ color: "#111827" }}>PNG Transparent et Sans Filigrane</h3>
          <p>Téléchargez l'image traitée en PNG sans filigrane NEXORA. Les résultats transparents peuvent être utilisés directement dans les outils de design, présentations, documents et autres applications de retouche d'image.</p>
          <img src="/background-remover-example.jpg" alt="Exemple supprimer fond photo - NEXORA suppresseur de fond IA avant et après" width={760} height={400} loading="lazy" style={{ display: "block", width: "100%", maxWidth: 760, height: "auto", margin: "22px auto", borderRadius: 14 }} />
        </article>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 18px 50px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 18, overflow: "hidden" }}>
          <div style={{ padding: "20px" }}><h2 style={{ margin: 0, fontSize: 26, color: "#111827" }}>Fonctionnalités du Suppresseur de Fond NEXORA</h2></div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead><tr><th style={{ textAlign: "left", padding: "12px 18px", borderTop: "1px solid #e5e7eb", background: "#f8fafc" }}>Fonctionnalité</th><th style={{ textAlign: "left", padding: "12px 18px", borderTop: "1px solid #e5e7eb", background: "#f8fafc" }}>NEXORA</th></tr></thead>
              <tbody>
                {[["Gratuit", "Oui"], ["Suppression de fond IA", "Oui"], ["PNG Transparent", "Oui"], ["Sans filigrane", "Oui"], ["JPG / PNG / WebP", "Oui"], ["Taille max de téléchargement", "25 Mo"], ["Traitement dans le navigateur", "Oui"], ["Couleurs de fond", "Transparent / Blanc / Bleu / Rouge"]].map(([feature, value]) => (
                  <tr key={feature}><td style={{ padding: "12px 18px", borderTop: "1px solid #e5e7eb" }}>{feature}</td><td style={{ padding: "12px 18px", borderTop: "1px solid #e5e7eb", fontWeight: 800 }}>{value}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 18px 50px" }}>
        <h2 style={{ fontSize: 30, color: "#111827" }}>Questions Fréquentes</h2>
        {[
          ["Le Suppresseur de Fond NEXORA est-il gratuit ?", "Oui. Le Suppresseur de Fond NEXORA est gratuit sans compte ni inscription."],
          ["Quels formats d'image sont acceptés ?", "Les images JPG, PNG et WebP sont acceptées. La taille maximale est de 25 Mo."],
          ["Puis-je rendre le fond transparent ?", "Oui. Le résultat est généré en PNG avec fond transparent."],
          ["Puis-je utiliser un fond blanc ?", "Oui. Sélectionnez Blanc après la suppression du fond."],
          ["NEXORA ajoute-t-elle un filigrane ?", "Non. Le PNG téléchargé ne contient pas de filigrane NEXORA."],
          ["Comment supprimer le fond sans Photoshop ?", "Téléchargez votre photo sur NEXORA. L'IA du navigateur supprime le fond et crée un PNG transparent que vous pouvez télécharger gratuitement."],
          ["L'outil fonctionne-t-il sur iPhone et Android ?", "Oui. L'outil est conçu pour les navigateurs mobiles et de bureau modernes, y compris iPhone, Android, Windows et Mac compatibles."],
          ["Ma photo est-elle envoyée vers un serveur NEXORA ?", "Le traitement est effectué dans le navigateur. L'image est traitée localement au lieu d'être envoyée vers un serveur NEXORA. La bibliothèque d'IA peut télécharger des ressources du modèle depuis son CDN externe."],
        ].map(([question, answer]) => (
          <details key={question} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "11px 13px", marginTop: 9, background: "#ffffff" }}>
            <summary style={{ cursor: "pointer", fontWeight: 800, fontSize: 14 }}>{question}</summary>
            <p style={{ marginBottom: 2, color: "#64748b", lineHeight: 1.7, fontSize: 14 }}>{answer}</p>
          </details>
        ))}
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 18px 42px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
          {[["/passport-photo-maker", "Photo d'Identité Maker"], ["/compress-image-to-20kb", "Compresser Image à 20KB"], ["/qr-generator", "Générateur QR"], ["/", "Tous les Outils NEXORA"]].map(([href, label]) => (
            <a key={href} href={href} style={{ textDecoration: "none", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px", color: "#111827", fontWeight: 800, fontSize: 13 }}>{label}</a>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 18px 35px", textAlign: "center", color: "#64748b", fontSize: 13 }}>
        <p>Par Ayush Chauhan • Outil : NEXORA</p>
        <p>Dernière Mise à Jour : 14 Nov 2026 • Gratuit et Dans le Navigateur</p>
      </section>

      <footer style={{ borderTop: "1px solid #e5e7eb", background: "#ffffff", padding: "23px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, fontSize: 13 }}>
          <a href="/about" style={{ color: "#64748b", textDecoration: "none" }}>À Propos</a>
          <a href="/privacy-policy" style={{ color: "#64748b", textDecoration: "none" }}>Politique de Confidentialité</a>
          <a href="/contact" style={{ color: "#64748b", textDecoration: "none" }}>Contact</a>
        </div>
      </footer>
    </main>
  );
}
