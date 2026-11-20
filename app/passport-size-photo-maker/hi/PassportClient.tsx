"use client";

import { useRef, useState } from "react";

type Doc = {
  label: string;
  sub: string;
  w: number;
  h: number;
  kb: number;
};

const DOCS: Doc[] = [
  {
    label: "Passport India",
    sub: "413 × 531 • 3.5 × 4.5 cm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "Passport USA",
    sub: "600 × 600 • 2 × 2 inch",
    w: 600,
    h: 600,
    kb: 0,
  },
  {
    label: "Visa USA 2×2",
    sub: "600 × 600 • 2 × 2 inch",
    w: 600,
    h: 600,
    kb: 0,
  },
  {
    label: "Visa UK",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "Visa Schengen",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "Visa Canada",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "Visa Australia",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "Visa China",
    sub: "390 × 567 • 33 × 48 mm",
    w: 390,
    h: 567,
    kb: 0,
  },
  {
    label: "Visa Japan",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "Visa Korea",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "Visa Dubai",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "SSC • 20KB",
    sub: "200 × 230 • target ≤ 20KB",
    w: 200,
    h: 230,
    kb: 20,
  },
  {
    label: "UPSC • 50KB",
    sub: "300 × 350 • target ≤ 50KB",
    w: 300,
    h: 350,
    kb: 50,
  },
  {
    label: "IBPS • 20KB",
    sub: "200 × 230 • target ≤ 20KB",
    w: 200,
    h: 230,
    kb: 20,
  },
  {
    label: "Railway • 20KB",
    sub: "200 × 230 • target ≤ 20KB",
    w: 200,
    h: 230,
    kb: 20,
  },
  {
    label: "Bank Form",
    sub: "300 × 350 • target ≤ 50KB",
    w: 300,
    h: 350,
    kb: 50,
  },
  {
    label: "PAN Card",
    sub: "400 × 300 • 3.5 × 2.5 cm",
    w: 400,
    h: 300,
    kb: 0,
  },
  {
    label: "Aadhaar Card",
    sub: "300 × 400 • HD",
    w: 300,
    h: 400,
    kb: 0,
  },
  {
    label: "Driving License",
    sub: "300 × 350 • HD",
    w: 300,
    h: 350,
    kb: 0,
  },
  {
    label: "Voter ID",
    sub: "300 × 400 • HD",
    w: 300,
    h: 400,
    kb: 0,
  },
  {
    label: "OCI Card",
    sub: "600 × 600 • 2 × 2 inch",
    w: 600,
    h: 600,
    kb: 0,
  },
  {
    label: "Stamp Size",
    sub: "300 × 400 • 2.5 × 3.5 cm",
    w: 300,
    h: 400,
    kb: 0,
  },
  {
    label: "1 × 1 Inch",
    sub: "400 × 400 • HD",
    w: 400,
    h: 400,
    kb: 0,
  },
  {
    label: "College ID",
    sub: "300 × 400 • HD",
    w: 300,
    h: 400,
    kb: 0,
  },
  {
    label: "Job Resume",
    sub: "400 × 500 • HD",
    w: 400,
    h: 500,
    kb: 0,
  },
];

export default function PassportClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState("");
  const [sel, setSel] = useState(0);

  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [customKB, setCustomKB] = useState("");

  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [processing, setProcessing] = useState(false);

  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [origKB, setOrigKB] = useState(0);
  const [newKB, setNewKB] = useState(0);

  const fileRef = useRef<HTMLInputElement>(null);

  const hasCustom =
    customW.trim() !== "" ||
    customH.trim() !== "" ||
    customKB.trim() !== "";

  const getCurrent = (): Doc => {
    const d = DOCS[sel];

    const parsedW = customW.trim() ? Number(customW) : d.w;
    const parsedH = customH.trim() ? Number(customH) : d.h;
    const parsedKB = customKB.trim() ? Number(customKB) : d.kb;

    return {
      label: hasCustom ? "Custom Size" : d.label,
      sub: d.sub,
      w: Number.isFinite(parsedW) ? parsedW : d.w,
      h: Number.isFinite(parsedH) ? parsedH : d.h,
      kb: Number.isFinite(parsedKB) ? parsedKB : d.kb,
    };
  };

  const toBlob = (
    sourceCanvas: HTMLCanvasElement,
    quality: number
  ): Promise<Blob | null> => {
    return new Promise((resolve) => {
      sourceCanvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        quality
      );
    });
  };

  const processImage = (image: HTMLImageElement, doc: Doc) => {
    const c = document.createElement("canvas");

    c.width = Math.round(doc.w);
    c.height = Math.round(doc.h);

    const ctx = c.getContext("2d");

    if (!ctx) {
      setStatus("Browser canvas available nahi hai. Dusra browser try karein.");
      setIsSuccess(false);
      return;
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const iw = image.naturalWidth || image.width;
    const ih = image.naturalHeight || image.height;

    if (!iw || !ih) {
      setStatus("Photo ka size padha nahi ja saka.");
      setIsSuccess(false);
      return;
    }

    const imageRatio = iw / ih;
    const canvasRatio = c.width / c.height;

    let sx = 0;
    let sy = 0;
    let sw = iw;
    let sh = ih;

    if (imageRatio > canvasRatio) {
      sh = ih;
      sw = ih * canvasRatio;
      sx = (iw - sw) / 2;
    } else {
      sw = iw;
      sh = iw / canvasRatio;
      sy = (ih - sh) / 2;
    }

    ctx.drawImage(
      image,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      c.width,
      c.height
    );

    setCanvas(c);
    setPreview(c.toDataURL("image/jpeg", 0.9));

    c.toBlob(
      (blob) => {
        if (blob) {
          setNewKB(Math.max(1, Math.round(blob.size / 1024)));
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("Kripya JPG, JPEG, PNG ya koi image file chunein.");
      setIsSuccess(false);
      return;
    }

    setStatus("Aapka photo load ho raha hai...");
    setIsSuccess(false);
    setProcessing(true);

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        setImg(image);

        setOrigW(image.naturalWidth);
        setOrigH(image.naturalHeight);
        setOrigKB(Math.max(1, Math.round(file.size / 1024)));

        processImage(image, getCurrent());

        setStatus(
          "Photo load ho gaya. Document size chunein ya apna khud ka size daalein."
        );
        setIsSuccess(true);
        setProcessing(false);
      };

      image.onerror = () => {
        setStatus("Ye photo khul nahi rahi. Dusri photo try karein.");
        setIsSuccess(false);
        setProcessing(false);
      };

      image.src = reader.result as string;
    };

    reader.onerror = () => {
      setStatus("File padhi nahi ja saki. Dobara try karein.");
      setIsSuccess(false);
      setProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const selectDoc = (idx: number) => {
    setSel(idx);

    setCustomW("");
    setCustomH("");
    setCustomKB("");

    if (img) {
      processImage(img, DOCS[idx]);

      setStatus(
        `${DOCS[idx].label} select hua • ${DOCS[idx].w} × ${DOCS[idx].h}${
          DOCS[idx].kb ? ` • target ≤ ${DOCS[idx].kb}KB` : ""
        }`
      );

      setIsSuccess(true);
    }
  };

  const applyCustom = () => {
    if (!img) {
      setStatus("Pehle photo upload karein.");
      setIsSuccess(false);
      return;
    }

    const cur = getCurrent();

    if (
      !Number.isInteger(cur.w) ||
      !Number.isInteger(cur.h) ||
      cur.w < 50 ||
      cur.w > 2000 ||
      cur.h < 50 ||
      cur.h > 2000
    ) {
      setStatus(
        "Width aur Height 50 se 2000 pixel ke beech me poora number hona chahiye."
      );
      setIsSuccess(false);
      return;
    }

    if (
      cur.kb !== 0 &&
      (!Number.isInteger(cur.kb) || cur.kb < 5 || cur.kb > 500)
    ) {
      setStatus("KB 5 se 500 ke beech me hona chahiye.");
      setIsSuccess(false);
      return;
    }

    processImage(img, cur);

    setStatus(
      `Custom size lag gaya • ${cur.w} × ${cur.h}${
        cur.kb ? ` • target ≤ ${cur.kb}KB` : " • HD"
      }`
    );

    setIsSuccess(true);
  };

  const compressToTarget = async (
    source: HTMLCanvasElement,
    targetKB: number
  ): Promise<{
    blob: Blob | null;
    canvas: HTMLCanvasElement;
  }> => {
    const targetBytes = targetKB * 1024;

    let bestBlob: Blob | null = null;

    let low = 0.05;
    let high = 0.98;

    for (let i = 0; i < 12; i++) {
      const quality = (low + high) / 2;

      const blob = await toBlob(source, quality);

      if (!blob) continue;

      if (blob.size <= targetBytes) {
        bestBlob = blob;
        low = quality;
      } else {
        high = quality;
      }
    }

    if (bestBlob) {
      return {
        blob: bestBlob,
        canvas: source,
      };
    }

    let workingCanvas = source;

    for (let scaleStep = 0; scaleStep < 8; scaleStep++) {
      const nextCanvas = document.createElement("canvas");

      nextCanvas.width = Math.max(
        50,
        Math.floor(workingCanvas.width * 0.9)
      );

      nextCanvas.height = Math.max(
        50,
        Math.floor(workingCanvas.height * 0.9)
      );

      const ctx = nextCanvas.getContext("2d");

      if (!ctx) break;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(
        0,
        0,
        nextCanvas.width,
        nextCanvas.height
      );

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        workingCanvas,
        0,
        0,
        workingCanvas.width,
        workingCanvas.height,
        0,
        0,
        nextCanvas.width,
        nextCanvas.height
      );

      let lowQuality = 0.05;
      let highQuality = 0.95;
      let underTarget: Blob | null = null;

      for (let i = 0; i < 10; i++) {
        const quality = (lowQuality + highQuality) / 2;

        const blob = await toBlob(nextCanvas, quality);

        if (!blob) continue;

        if (blob.size <= targetBytes) {
          underTarget = blob;
          lowQuality = quality;
        } else {
          highQuality = quality;
        }
      }

      if (underTarget) {
        return {
          blob: underTarget,
          canvas: nextCanvas,
        };
      }

      workingCanvas = nextCanvas;
    }

    const fallbackBlob = await toBlob(workingCanvas, 0.05);

    return {
      blob: fallbackBlob,
      canvas: workingCanvas,
    };
  };

  const download = async () => {
    if (!canvas) {
      setStatus("Pehle photo upload karein.");
      setIsSuccess(false);
      return;
    }

    const current = getCurrent();

    if (
      current.w < 50 ||
      current.w > 2000 ||
      current.h < 50 ||
      current.h > 2000
    ) {
      setStatus("Photo ka size galat hai.");
      setIsSuccess(false);
      return;
    }

    if (
      current.kb &&
      (current.kb < 5 || current.kb > 500)
    ) {
      setStatus("KB target 5 se 500 ke beech me hona chahiye.");
      setIsSuccess(false);
      return;
    }

    setStatus("Aapka photo taiyaar ho raha hai...");
    setIsSuccess(false);
    setProcessing(true);

    try {
      let finalCanvas = canvas;
      let blob: Blob | null = null;

      if (current.kb > 0) {
        const result = await compressToTarget(
          canvas,
          current.kb
        );

        blob = result.blob;
        finalCanvas = result.canvas;
      } else {
        blob = await toBlob(canvas, 0.92);
      }

      if (!blob) {
        setStatus("JPG ban nahi paya. Dobara try karein.");
        setIsSuccess(false);
        return;
      }

      const actualKB = blob.size / 1024;

      setNewKB(Math.max(1, Math.round(actualKB)));

      const objectUrl = URL.createObjectURL(blob);

      const safeLabel = hasCustom
        ? `Custom-${current.w}x${current.h}`
        : current.label.replace(/[^a-zA-Z0-9]+/g, "-");

      const fileName =
        `NEXORA-${safeLabel}-${finalCanvas.width}x${finalCanvas.height}` +
        `${current.kb ? `-${current.kb}KB` : "-HD"}.jpg`;

      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" &&
          navigator.maxTouchPoints > 1);

      if (
        isIOS &&
        typeof (navigator as any).share === "function"
      ) {
        try {
          const file = new File(
            [blob],
            fileName,
            {
              type: "image/jpeg",
            }
          );

          const canShare =
            typeof (navigator as any).canShare === "function" &&
            (navigator as any).canShare({
              files: [file],
            });

          if (canShare) {
            await (navigator as any).share({
              files: [file],
              title: "NEXORA Passport Photo",
            });

            setStatus(
              `Photo taiyaar hai • ${actualKB.toFixed(1)}KB`
            );
            setIsSuccess(true);
          } else {
            throw new Error("File sharing is unavailable.");
          }
        } catch (error: any) {
          if (error?.name === "AbortError") {
            setStatus("Sharing cancel kar diya.");
            setIsSuccess(false);
          } else {
            const newWindow = window.open(
              "",
              "_blank"
            );

            if (newWindow) {
              newWindow.location.href = objectUrl;

              setStatus(
                "Photo naye tab me khul gayi hai. Save karne ke liye Share ya Save Image dabayein."
              );

              setIsSuccess(true);
            } else {
              setStatus(
                "Kripya pop-up allow karein aur dobara download karein."
              );

              setIsSuccess(false);
            }
          }
        }
      } else {
        const anchor = document.createElement("a");

        anchor.href = objectUrl;
        anchor.download = fileName;

        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        setStatus(
          `Download ho gaya • ${actualKB.toFixed(1)}KB`
        );

        setIsSuccess(true);
      }

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60000);

      if (typeof (window as any).gtag === "function") {
        (window as any).gtag(
          "event",
          "passport_photo_download",
          {
            event_category: "Image Tools",
            event_label: current.label,
            target_kb: current.kb || 0,
            width: finalCanvas.width,
            height: finalCanvas.height,
          }
        );
      }
    } catch {
      setStatus(
        "Download fail ho gaya. Dobara try karein."
      );
      setIsSuccess(false);
    } finally {
      setProcessing(false);
    }
  };

  const clearAll = () => {
    setImg(null);
    setPreview("");
    setStatus("");
    setIsSuccess(false);

    setCustomW("");
    setCustomH("");
    setCustomKB("");

    setSel(0);

    setCanvas(null);

    setOrigW(0);
    setOrigH(0);
    setOrigKB(0);
    setNewKB(0);

    setProcessing(false);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const current = getCurrent();

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#ffffff",
        color: "#0f172a",
        minHeight: "100vh",
        colorScheme: "light",
      }}
    >
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #eef2f7",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "14px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <a
            href="/"
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#2563eb",
              textDecoration: "none",
            }}
          >
            NEXORA
          </a>

          <nav
            style={{
              display: "flex",
              gap: 20,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <a
              href="/"
              style={{
                color: "#0f172a",
                textDecoration: "none",
              }}
            >
              Home
            </a>

            <a
              href="/"
              style={{
                color: "#0f172a",
                textDecoration: "none",
              }}
            >
              Saare Tools
            </a>
          </nav>
        </div>
      </header>

      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "30px 18px 10px",
        }}
      >
        <section
          style={{
            textAlign: "center",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #bfdbfe",
                padding: "7px 12px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.3px",
                whiteSpace: "nowrap",
              }}
            >
              ✦ FREE • HD • NO WATERMARK • PRIVATE
            </span>
          </div>

          <h1
            style={{
              fontSize: 36,
              margin: "12px 0 6px",
              lineHeight: 1.05,
              letterSpacing: "-0.5px",
              fontWeight: 900,
              background:
                "linear-gradient(90deg, #1d4ed8, #6d28d9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
            }}
          >
            Passport Photo
            <br />
            Maker
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: 14,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Passport, visa aur document photo banayein - apne size aur file size ke saath.
          </p>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 18,
            padding: 14,
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              fontWeight: 800,
              fontSize: 13,
              margin: "0 0 8px",
              textAlign: "center",
            }}
          >
            Apna Photo Upload Karein
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />

          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: "1.5px dashed #cbd5e1",
              borderRadius: 12,
              padding: 14,
              textAlign: "center",
              cursor: "pointer",
              background: "#ffffff",
            }}
          >
            <div style={{ fontSize: 24 }}>📸</div>

            <p
              style={{
                fontWeight: 800,
                margin: "4px 0 2px",
                fontSize: 14,
              }}
            >
              {preview
                ? "Photo Badlein"
                : "Photo Upload Karne Ke Liye Dabaye"}
            </p>

            <p
              style={{
                fontSize: 11,
                color: "#94a3b8",
                margin: 0,
              }}
            >
              JPG, JPEG, PNG • White background • Browser me processing
            </p>
          </div>

          <p
            style={{
              fontWeight: 800,
              fontSize: 12,
              margin: "14px 0 6px",
            }}
          >
            Document Size Chunein
          </p>

          <div
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              paddingBottom: 6,
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
            }}
          >
            {DOCS.map((doc, i) => {
              const isActive =
                sel === i && !hasCustom;

              return (
                <button
                  key={`${doc.label}-${i}`}
                  onClick={() => selectDoc(i)}
                  style={{
                    padding: "7px 9px",
                    borderRadius: 9,
                    border: isActive
                      ? "1.5px solid #f97316"
                      : "1px solid #e2e8f0",
                    background: isActive
                      ? "#fff7ed"
                      : "#ffffff",
                    color: isActive
                      ? "#ea580c"
                      : "#0f172a",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 11,
                    lineHeight: 1.3,
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {doc.label}

                  <br />

                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: "#64748b",
                    }}
                  >
                    {doc.sub}
                  </span>
                </button>
              );
            })}
          </div>

          <p
            style={{
              fontWeight: 800,
              fontSize: 12,
              margin: "10px 0 6px",
            }}
          >
            Apna Width / Height / KB Daalein
          </p>

          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #eef2f7",
              borderRadius: 10,
              padding: 9,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
              }}
            >
              <input
                type="number"
                min={50}
                max={2000}
                value={customW}
                onChange={(e) =>
                  setCustomW(e.target.value)
                }
                placeholder={`W - ${DOCS[sel].w}`}
                style={{
                  flex: 1,
                  padding: "9px 8px",
                  borderRadius: 8,
                  border:
                    "1.5px solid #2563eb",
                  fontSize: 13,
                  fontWeight: 700,
                  outline: "none",
                  background: "#ffffff",
                  color: "#0f172a",
                  minWidth: 0,
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 800,
                  color: "#94a3b8",
                  fontSize: 13,
                }}
              >
                ×
              </div>

              <input
                type="number"
                min={50}
                max={2000}
                value={customH}
                onChange={(e) =>
                  setCustomH(e.target.value)
                }
                placeholder={`H - ${DOCS[sel].h}`}
                style={{
                  flex: 1,
                  padding: "9px 8px",
                  borderRadius: 8,
                  border:
                    "1.5px solid #2563eb",
                  fontSize: 13,
                  fontWeight: 700,
                  outline: "none",
                  background: "#ffffff",
                  color: "#0f172a",
                  minWidth: 0,
                }}
              />

              <input
                type="number"
                min={5}
                max={500}
                value={customKB}
                onChange={(e) =>
                  setCustomKB(e.target.value)
                }
                placeholder={
                  DOCS[sel].kb
                    ? `${DOCS[sel].kb} KB`
                    : "KB"
                }
                style={{
                  flex: 1,
                  padding: "9px 8px",
                  borderRadius: 8,
                  border:
                    "1.5px solid #f97316",
                  fontSize: 13,
                  fontWeight: 700,
                  outline: "none",
                  background: "#ffffff",
                  color: "#0f172a",
                  minWidth: 0,
                }}
              />
            </div>

            {img && (
              <button
                onClick={applyCustom}
                style={{
                  width: "100%",
                  padding: 9,
                  marginTop: 8,
                  background: "#0f172a",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Apna Size Lagayein →
              </button>
            )}
          </div>

          {preview && (
            <div
              style={{
                marginTop: 16,
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                borderRadius: 12,
                padding: 12,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontWeight: 800,
                  fontSize: 13,
                  margin: "0 0 8px",
                }}
              >
                Photo Preview
              </p>

              <img
                src={preview}
                alt="Banayi gayi passport photo ka preview"
                style={{
                  width: "100%",
                  maxWidth: 280,
                  maxHeight: 320,
                  borderRadius: 10,
                  objectFit: "contain",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                }}
              />

              {origW > 0 && (
                <div
                  style={{
                    marginTop: 10,
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 10,
                    padding: 10,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "#475569",
                    }}
                  >
                    Original:{" "}
                    <b style={{ color: "#0f172a" }}>
                      {origW} × {origH} • {origKB} KB
                    </b>
                  </div>

                  <div
                    style={{
                      fontSize: 18,
                      color: "#16a34a",
                      lineHeight: 1.2,
                    }}
                  >
                    ↓
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#15803d",
                    }}
                  >
                    Output: {current.w} × {current.h} •{" "}
                    {current.kb
                      ? `Target ≤ ${current.kb}KB`
                      : `${newKB} KB`}
                  </div>
                </div>
              )}
            </div>
          )}

          {preview && (
            <a
              href="/background-remover/hi"
              style={{
                display: "block",
                marginTop: 12,
                padding: "14px 12px",
                borderRadius: 14,
                textDecoration: "none",
                background:
                  "linear-gradient(90deg, #2563eb, #7c3aed, #db2777)",
                boxShadow:
                  "0 10px 25px rgba(124,58,237,0.25)",
                border: "2px solid #ffffff",
                animation:
                  "nexoraBlink 1.2s ease-in-out infinite",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.4,
                }}
              >
                🎨 White, Blue ya Red Background Chahiye?
              </div>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#fefce8",
                  marginTop: 5,
                  background:
                    "rgba(0,0,0,0.22)",
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: 999,
                }}
              >
                👉 Background Remover Kholein
              </div>

              <style>{`
                @keyframes nexoraBlink {
                  0%, 100% {
                    transform: scale(1);
                  }
                  50% {
                    transform: scale(1.03);
                  }
                }
              `}</style>
            </a>
          )}

          {status && (
            <p
              style={{
                background: isSuccess
                  ? "#ecfdf5"
                  : "#fef2f2",
                color: isSuccess
                  ? "#047857"
                  : "#dc2626",
                padding: "9px 10px",
                borderRadius: 9,
                fontSize: 13,
                margin: "12px 0 0",
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              {status}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 14,
            }}
          >
            <button
              onClick={download}
              disabled={!preview || processing}
              style={{
                flex: 1,
                padding: 14,
                background: "#f97316",
                color: "#ffffff",
                border: "none",
                borderRadius: 11,
                fontSize: 15,
                fontWeight: 800,
                cursor:
                  !preview || processing
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  !preview || processing
                    ? 0.5
                    : 1,
              }}
            >
              {processing
                ? "Taiyaar ho raha hai..."
                : `Download ${current.label} →`}
            </button>

            <button
              onClick={clearAll}
              style={{
                padding: "13px 16px",
                background: "#f8fafc",
                border:
                  "1px solid #e2e8f0",
                borderRadius: 11,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Saaf Karein
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#94a3b8",
              margin: "8px 0 0",
              fontWeight: 700,
            }}
          >
            🔒 Aapka photo aapke browser me hi process hota hai
          </p>
        </section>

        <div style={{ height: 18 }} />

        <a
          href="/image-dpi-changer"
          style={{
            display: "block",
            background: "#ecfdf5",
            border: "1px solid #86efac",
            borderRadius: 10,
            padding: "10px 12px",
            textDecoration: "none",
            fontSize: 13,
            color: "#15803d",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Photo ka DPI badalna hai?{" "}
          <span
            style={{
              color: "#16a34a",
              textDecoration: "underline",
            }}
          >
            DPI Changer Kholein
          </span>{" "}
          →
        </a>

        <div style={{ height: 30 }} />

        <section
          style={{
            background: "#fefce8",
            border: "2px solid #facc15",
            borderRadius: 16,
            padding: 18,
          }}
        >
          <b>💡 Document Photo Ke Liye Free Tool</b>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: 14,
              lineHeight: 1.7,
              color: "#334155",
            }}
          >
            Bina software install kiye passport, visa aur form wali photo banayein. Koi preset chunein ya apna khud ka width, height aur file-size target daalein.
          </p>
        </section>

        <div style={{ height: 30 }} />

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #eef2f7",
            borderRadius: 18,
            padding: 22,
          }}
        >
          <h2 style={{ fontSize: 21 }}>
            Passport Aur Document Photo Ke Common Size
          </h2>

          <p
            style={{
              color: "#475569",
              lineHeight: 1.8,
            }}
          >
            <b>India Passport:</b> 413 × 531 pixels
            (3.5 × 4.5 cm preset).
            <br />
            <b>USA Passport / Visa:</b> 600 × 600 pixels
            (2 × 2 inch preset).
            <br />
            <b>SSC / IBPS / Railway:</b> 200 × 230 pixels
            20KB target preset ke saath.
            <br />
            <b>UPSC / Bank Form:</b> 300 × 350 pixels
            50KB target preset ke saath.
            <br />
            <b>PAN:</b> 400 × 300 pixels.
            <br />
            <b>Aadhaar / Voter ID:</b> 300 × 400 pixels.
            <br />
            <b>Driving License:</b> 300 × 350 pixels.
          </p>

          <p
            style={{
              color: "#64748b",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            Size desh, authority, form aur naye nirdesh ke hisaab se badal sakta hai. Submit karne se pehle official form ke nirdesh me size, file size aur photo ke niyam zaroor check karein.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Passport Size Photo Kaise Banayein
          </h2>

          <p
            style={{
              color: "#475569",
              lineHeight: 1.8,
            }}
          >
            <b>Step 1:</b> Apna photo upload karein.
            <br />
            <b>Step 2:</b> Passport, Visa, SSC,
            UPSC ya koi aur document preset chunein.
            <br />
            <b>Step 3:</b> Zaroorat ho to apna
            width, height aur KB target daalein.
            <br />
            <b>Step 4:</b> Bani hui JPG download karein.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            NEXORA Passport Photo Maker Ke Features
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
              marginTop: 10,
            }}
          >
            <tbody>
              <tr>
                <th
                  style={{
                    border:
                      "1px solid #eef2f7",
                    padding: 8,
                    background: "#f8fafc",
                    textAlign: "left",
                  }}
                >
                  Feature
                </th>

                <th
                  style={{
                    border:
                      "1px solid #eef2f7",
                    padding: 8,
                    background: "#f8fafc",
                  }}
                >
                  NEXORA
                </th>
              </tr>

              <tr>
                <td
                  style={{
                    border:
                      "1px solid #eef2f7",
                    padding: 8,
                  }}
                >
                  Document presets
                </td>

                <td
                  style={{
                    border:
                      "1px solid #eef2f7",
                    padding: 8,
                    textAlign: "center",
                  }}
                >
                  25+
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    border:
                      "1px solid #eef2f7",
                    padding: 8,
                  }}
                >
                  Apna size (Custom dimensions)
                </td>

                <td
                  style={{
                    border:
                      "1px solid #eef2f7",
                    padding: 8,
                    textAlign: "center",
                  }}
                >
                  Haan
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    border:
                      "1px solid #eef2f7",
                    padding: 8,
                  }}
                >
                  Apna file-size target
                </td>

                <td
                  style={{
                    border:
                      "1px solid #eef2f7",
                    padding: 8,
                    textAlign: "center",
                  }}
                >
                  5–500KB
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    border:
                      "1px solid #eef2f7",
                    padding: 8,
                  }}
                >
                  Watermark
                </td>

                <td
                  style={{
                    border:
                      "1px solid #eef2f7",
                    padding: 8,
                    textAlign: "center",
                  }}
                >
                  Nahi
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    border:
                      "1px solid #eef2f7",
                    padding: 8,
                  }}
                >
                  Browser me processing
                </td>

                <td
                  style={{
                    border:
                      "1px solid #eef2f7",
                    padding: 8,
                    textAlign: "center",
                  }}
                >
                  Haan
                </td>
              </tr>
            </tbody>
          </table>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Aksar Puche Jaane Wale Sawal
          </h2>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius: 10,
              padding: "12px 14px",
              marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              20KB photo kaise banayein?
            </summary>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.7,
              }}
            >
              SSC, IBPS ya Railway 20KB preset chunein,
              ya custom KB wali jagah 20 daalein. Tool
              JPG ko compress karke diye gaye target ke andar laane ki koshish karta hai.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius: 10,
              padding: "12px 14px",
              marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              50KB photo kaise banayein?
            </summary>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.7,
              }}
            >
              UPSC ya Bank Form preset chunein, ya
              custom KB wali jagah 50 daalein. Tool
              photo ko compress karke diye gaye target ke andar laane ki koshish karta hai.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius: 10,
              padding: "12px 14px",
              marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Kya main apna khud ka photo size daal sakta hu?
            </summary>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.7,
              }}
            >
              Haan. Apni zaroorat ke hisaab se width aur height
              50 se 2000 pixel ke beech me daalein aur Apna Size Lagayein dabayein.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius: 10,
              padding: "12px 14px",
              marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Kya mera photo server par upload hota hai?
            </summary>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.7,
              }}
            >
              Nahi. Photo ki normal processing seedha aapke
              browser me hoti hai, isliye tool ko aapka photo server par bhejne ki zaroorat nahi padti.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius: 10,
              padding: "12px 14px",
              marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Kya tool watermark lagata hai?
            </summary>

            <p
              style={{
                color: "#475569",
                lineHeight: 1.7,
              }}
            >
              Nahi. Bani hui JPG me NEXORA ka watermark nahi hota.
            </p>
          </details>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 22,
            }}
          >
            <a
              href="/image-dpi-changer"
              style={{
                flex: 1,
                textAlign: "center",
                padding: 14,
                background: "#0f172a",
                color: "#ffffff",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              DPI Chahiye? DPI Changer Kholein →
            </a>
          </div>
        </section>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "#94a3b8",
            margin: "30px 0 10px",
            lineHeight: 1.6,
          }}
        >
          By{" "}
          <b style={{ color: "#0f172a" }}>
            Ayush Chauhan
          </b>{" "}
          • NEXORA
          <br />
          Last Updated: 19 Nov 2026 • Free & Private
        </p>
      </main>

      <div
        style={{
          background: "#f8fafc",
          borderTop:
            "1px solid #eef2f7",
          padding: "16px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            display: "inline-block",
            animation:
              "nexoraLoop 18s linear infinite",
            fontSize: 14,
            fontWeight: 700,
            color: "#2563eb",
          }}
        >
          <span style={{ padding: "0 18px" }}>
            ✦ Passport Photo Maker
          </span>

          <span style={{ padding: "0 18px" }}>
            ✦ DPI Changer
          </span>

          <span style={{ padding: "0 18px" }}>
            ✦ Photo Ko 20KB Karein
          </span>

          <span style={{ padding: "0 18px" }}>
            ✦ Background Remover
          </span>

          <span style={{ padding: "0 18px" }}>
            ✦ Passport Photo Maker
          </span>

          <span style={{ padding: "0 18px" }}>
            ✦ DPI Changer
          </span>

          <span style={{ padding: "0 18px" }}>
            ✦ Photo Ko 20KB Karein
          </span>

          <span style={{ padding: "0 18px" }}>
            ✦ Background Remover
          </span>
        </div>

        <style>{`
          @keyframes nexoraLoop {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>

      <footer
        style={{
          background: "#0f172a",
          color: "#cbd5e1",
          padding: "20px 16px",
          textAlign: "center",
          fontSize: 13,
        }}
      >
        <b
          style={{
            color: "#ffffff",
            fontSize: 16,
          }}
        >
          NEXORA
        </b>

        <p style={{ margin: "6px 0 0" }}>
          Free Tools. Simple Solutions. •{" "}
          <a
            href="/about"
            style={{ color: "#cbd5e1" }}
          >
            About
          </a>{" "}
          •{" "}
          <a
            href="/privacy-policy"
            style={{ color: "#cbd5e1" }}
          >
            Privacy
          </a>{" "}
          •{" "}
          <a
            href="/contact"
            style={{ color: "#cbd5e1" }}
          >
            Contact
          </a>
        </p>
      </footer>
    </div>
  );
}
