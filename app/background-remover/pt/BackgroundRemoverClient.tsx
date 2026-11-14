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
  const [status, setStatus] = useState("Envie uma foto para começar");
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [info, setInfo] = useState("");
  const [uploadText, setUploadText] = useState("Toque para Enviar Foto");
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
      setStatus("Por favor, envie uma imagem JPG, PNG ou WebP.");
      return false;
    }
    if (file.size > 25 * 1024 * 1024) {
      setStatus("O tamanho da imagem deve ser de até 25 MB.");
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
    setStatus("Preparando sua imagem...");
    progressDisplayRef.current = 0;
    progressTargetRef.current = 0;
    setProgress(0);
    try {
      setStatus("Carregando motor de IA...");
      setProgressTarget(5);
      const removeBackground = await loadLibrary();
      setProgressTarget(12);
      setStatus("Otimizando imagem...");
      const preparedFile = await prepareImage(file);
      setProgressTarget(20);
      setStatus("A IA está removendo o fundo...");
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
      setStatus("Criando seu PNG transparente...");
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
      setInfo(`${previewImage.naturalWidth} × ${previewImage.naturalHeight} • PNG • Transparente • Sem Marca d'Água`);
      setShowPreview(true);
      setProgressTarget(97);
      requestAnimationFrame(() => { redraw(); });
      await finishProgress();
      setStatus("Fundo removido com sucesso!");
    } catch (error) {
      console.error("NEXORA Background Removal Error:", error);
      setProgressTarget(0);
      setStatus("Não foi possível remover o fundo. Tente outra foto.");
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
      link.download = `nexora-fundo-removido-${Date.now()}.png`;
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
    setStatus("Envie uma foto para começar");
    setUploadText("Toque para Enviar Foto");
    setBgColor("transparent");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main style={{ minHeight: "100vh", background: "#ffffff", color: "#111827" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,0.94)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "13px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <a href="/" style={{ textDecoration: "none", fontWeight: 950, fontSize: 22, color: "#2563eb" }}>NEXORA</a>
          <nav style={{ display: "flex", gap: 16, fontSize: 14, fontWeight: 700 }}>
            <a href="/" style={{ color: "#374151", textDecoration: "none" }}>Início</a>
            <a href="/passport-photo-maker" style={{ color: "#374151", textDecoration: "none" }}>Foto 3x4</a>
          </nav>
        </div>
      </header>

      <section style={{ maxWidth: 850, margin: "0 auto", padding: "42px 20px 22px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", fontWeight: 800, fontSize: 11, letterSpacing: "0.04em" }}>
          {libReady ? "GRÁTIS • IA • PNG HD • SEM MARCA D'ÁGUA" : "GRÁTIS • REMOVEDOR DE FUNDO COM IA"}
        </div>
        <h1 style={{ fontSize: "clamp(36px, 8vw, 62px)", lineHeight: 1.04, margin: "17px 0 12px", fontWeight: 950, letterSpacing: "-0.045em", background: "linear-gradient(90deg, #1d4ed8, #6d28d9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Remova o Fundo da Foto em Segundos
        </h1>
        <p style={{ maxWidth: 700, margin: "0 auto", fontSize: 17, lineHeight: 1.65, color: "#64748b" }}>
          Remova o fundo de fotos automaticamente com IA e crie um PNG transparente limpo direto no seu navegador. Sem Photoshop, sem cadastro e sem marca d'água.
        </p>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "8px 18px 48px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 18, padding: 16, boxShadow: "0 15px 45px rgba(15,23,42,0.07)" }}>
          {!showPreview ? (
            <div onClick={handleUploadClick} onMouseEnter={() => loadLibrary().catch(() => {})} style={{ minHeight: 205, border: "2px dashed #cbd5e1", borderRadius: 15, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "22px 18px", cursor: isProcessing ? "not-allowed" : "pointer", background: "#f8fafc" }}>
              <div style={{ width: 56, height: 56, borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", background: "#eff6ff", color: "#2563eb", fontSize: 27, marginBottom: 11 }}>✨</div>
              <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 900 }}>{uploadText}</h2>
              <p style={{ margin: "0 0 5px", color: "#64748b", fontSize: 14 }}>JPG, PNG ou WebP • Até 25 MB</p>
              <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Grátis • Sem cadastro • No navegador</p>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleInputChange} style={{ display: "none" }} />
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 19 }}>Seu Resultado</div>
                  <div style={{ marginTop: 4, color: "#64748b", fontSize: 13 }}>{info}</div>
                </div>
                <button type="button" onClick={resetTool} style={{ border: "1px solid #cbd5e1", background: "#ffffff", borderRadius: 9, padding: "9px 12px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Remover Outra</button>
              </div>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 15, padding: 10, background: "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 20px 20px", overflow: "auto" }}>
                <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "auto", maxHeight: 560, objectFit: "contain", borderRadius: 10, margin: "0 auto" }} />
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 8 }}>Fundo</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(["transparent", "white", "#6366f1", "#ef4444"] as const).map((value) => {
                    const label = value === "transparent" ? "Transparente" : value === "white" ? "Branco" : value === "#6366f1" ? "Azul" : "Vermelho";
                    return (
                      <button key={value} type="button" onClick={() => setBgColor(value)} style={{ border: bgColor === value ? "2px solid #f97316" : "1px solid #cbd5e1", background: bgColor === value ? "#fff7ed" : "#ffffff", color: bgColor === value ? "#ea580c" : "#111827", borderRadius: 9, padding: "8px 11px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>{label}</button>
                    );
                  })}
                </div>
              </div>
              <button type="button" onClick={download} style={{ width: "100%", marginTop: 16, border: 0, borderRadius: 11, padding: "13px 16px", background: "#f97316", color: "#ffffff", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>Baixar PNG - GRÁTIS →</button>
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
                <span>A IA está processando no seu navegador</span>
              </div>
              <style jsx>{`@keyframes nexoraPulse { 0%, 100% { opacity: 0.35; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }`}</style>
            </div>
          )}
          {!isProcessing && !showPreview && <p style={{ margin: "13px 0 0", textAlign: "center", color: "#64748b", fontSize: 13 }}>{status}</p>}
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 18px 42px" }}>
        <div style={{ background: "#111827", color: "#ffffff", borderRadius: 18, padding: "24px 20px", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 24 }}>Remova Fundos Grátis</h2>
          <p style={{ maxWidth: 620, margin: "0 auto", color: "#cbd5e1", lineHeight: 1.65, fontSize: 14 }}>Remova o fundo de fotos sem marcas d'água, sem contas e sem software complicado.</p>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 18px 50px" }}>
        <article style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 18, padding: "25px", lineHeight: 1.8, color: "#475569" }}>
          <h2 style={{ color: "#111827", fontSize: 28, marginTop: 0 }}>Removedor de Fundo com IA Grátis - Remova o Fundo da Foto Sem Photoshop</h2>
          <p>NEXORA Removedor de Fundo é uma ferramenta online grátis para remover o fundo de fotos. Envie uma imagem JPG, PNG ou WebP e a IA separa automaticamente o assunto principal do fundo. Sem Photoshop.</p>
          <p>O resultado é gerado como PNG com transparência preservada. Você também pode trocar o fundo removido por branco, azul ou vermelho. É útil para fotos 3x4, fotos de produtos, fotos de perfil, redes sociais e anúncios online.</p>
          <p>Para remover o fundo de uma foto sem Photoshop, basta enviar sua imagem. A IA do navegador processa a imagem e cria um PNG transparente que você pode baixar grátis.</p>
          <h3 style={{ color: "#111827" }}>Remoção de Fundo para Fotos</h3>
          <p>A ferramenta foi feita para fotos de produtos, fotos de perfil, imagens para redes sociais, preparação de foto 3x4, imagens de documento, apresentações, lojas online e outras tarefas do dia a dia.</p>
          <h3 style={{ color: "#111827" }}>Processamento Rápido no Navegador</h3>
          <p>A NEXORA faz a remoção de fundo direto no navegador usando IA. A velocidade depende do dispositivo, navegador, tamanho da imagem e se o modelo de IA já foi salvo no navegador.</p>
          <h3 style={{ color: "#111827" }}>PNG Transparente e Sem Marca d'Água</h3>
          <p>Baixe a imagem processada como PNG sem marca d'água da NEXORA. Resultados transparentes podem ser usados direto em ferramentas de design, apresentações, documentos e outros editores de imagem.</p>
          <img src="/background-remover-example.jpg" alt="Exemplo de remover fundo de foto - NEXORA removedor de fundo com IA antes e depois" width={760} height={400} loading="lazy" style={{ display: "block", width: "100%", maxWidth: 760, height: "auto", margin: "22px auto", borderRadius: 14 }} />
        </article>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 18px 50px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 18, overflow: "hidden" }}>
          <div style={{ padding: "20px" }}><h2 style={{ margin: 0, fontSize: 26, color: "#111827" }}>Recursos do Removedor de Fundo NEXORA</h2></div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead><tr><th style={{ textAlign: "left", padding: "12px 18px", borderTop: "1px solid #e5e7eb", background: "#f8fafc" }}>Recurso</th><th style={{ textAlign: "left", padding: "12px 18px", borderTop: "1px solid #e5e7eb", background: "#f8fafc" }}>NEXORA</th></tr></thead>
              <tbody>
                {[["Grátis para usar", "Sim"], ["Remoção de fundo com IA", "Sim"], ["PNG Transparente", "Sim"], ["Sem marca d'água", "Sim"], ["JPG / PNG / WebP", "Sim"], ["Tamanho máximo de envio", "25 MB"], ["Processamento no navegador", "Sim"], ["Cores de fundo", "Transparente / Branco / Azul / Vermelho"]].map(([feature, value]) => (
                  <tr key={feature}><td style={{ padding: "12px 18px", borderTop: "1px solid #e5e7eb" }}>{feature}</td><td style={{ padding: "12px 18px", borderTop: "1px solid #e5e7eb", fontWeight: 800 }}>{value}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 18px 50px" }}>
        <h2 style={{ fontSize: 30, color: "#111827" }}>Perguntas Frequentes</h2>
        {[
          ["O Removedor de Fundo NEXORA é grátis?", "Sim. O Removedor de Fundo NEXORA é grátis para usar sem precisar de conta ou cadastro."],
          ["Quais formatos de imagem são aceitos?", "Imagens JPG, PNG e WebP são aceitas. O tamanho máximo de envio é de 25 MB."],
          ["Posso deixar o fundo transparente?", "Sim. O resultado processado é gerado como PNG com fundo transparente."],
          ["Posso usar fundo branco?", "Sim. Selecione Branco depois que o fundo for removido."],
          ["A NEXORA adiciona marca d'água?", "Não. O PNG baixado não inclui marca d'água da NEXORA."],
          ["Como remover o fundo sem Photoshop?", "Envie sua foto para a NEXORA. A IA do navegador remove o fundo e cria um PNG transparente que você pode baixar grátis."],
          ["A ferramenta funciona no iPhone e Android?", "Sim. A ferramenta foi feita para navegadores modernos de celular e computador, incluindo iPhone, Android, Windows e Mac compatíveis."],
          ["Minha foto é enviada para um servidor da NEXORA?", "O processamento é feito no navegador. A imagem é processada localmente em vez de ser enviada para um servidor da NEXORA. A biblioteca de IA pode baixar recursos do modelo a partir do seu CDN externo."],
        ].map(([question, answer]) => (
          <details key={question} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "11px 13px", marginTop: 9, background: "#ffffff" }}>
            <summary style={{ cursor: "pointer", fontWeight: 800, fontSize: 14 }}>{question}</summary>
            <p style={{ marginBottom: 2, color: "#64748b", lineHeight: 1.7, fontSize: 14 }}>{answer}</p>
          </details>
        ))}
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 18px 42px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
          {[["/passport-photo-maker", "Foto 3x4 Maker"], ["/compress-image-to-20kb", "Comprimir Imagem para 20KB"], ["/qr-generator", "Gerador de QR"], ["/", "Todas as Ferramentas NEXORA"]].map(([href, label]) => (
            <a key={href} href={href} style={{ textDecoration: "none", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px", color: "#111827", fontWeight: 800, fontSize: 13 }}>{label}</a>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 18px 35px", textAlign: "center", color: "#64748b", fontSize: 13 }}>
        <p>Por Ayush Chauhan • Ferramenta: NEXORA</p>
        <p>Última Atualização: 14 Nov 2026 • Grátis e No Navegador</p>
      </section>

      <footer style={{ borderTop: "1px solid #e5e7eb", background: "#ffffff", padding: "23px 18px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, fontSize: 13 }}>
          <a href="/about" style={{ color: "#64748b", textDecoration: "none" }}>Sobre</a>
          <a href="/privacy-policy" style={{ color: "#64748b", textDecoration: "none" }}>Política de Privacidade</a>
          <a href="/contact" style={{ color: "#64748b", textDecoration: "none" }}>Contato</a>
        </div>
      </footer>
    </main>
  );
}
