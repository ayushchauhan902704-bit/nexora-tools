"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Doc = {
  label: string;
  sub: string;
  w: number;
  h: number;
  kb: number;
};

const DOCS: Doc[] = [
  {
    label: "India Passport",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "USA Passport",
    sub: "600 × 600 • 2 × 2 in",
    w: 600,
    h: 600,
    kb: 0,
  },
  {
    label: "USA Visa",
    sub: "600 × 600 • 2 × 2 in",
    w: 600,
    h: 600,
    kb: 0,
  },
  {
    label: "UK / Schengen",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "Canada Visa",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "Australia Visa",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "China Visa",
    sub: "390 × 567 • 33 × 48 mm",
    w: 390,
    h: 567,
    kb: 0,
  },
  {
    label: "Japan Visa",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "Korea Visa",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "Dubai Visa",
    sub: "413 × 531 • 35 × 45 mm",
    w: 413,
    h: 531,
    kb: 0,
  },
  {
    label: "SSC Photo",
    sub: "200 × 230 • ≤ 20 KB",
    w: 200,
    h: 230,
    kb: 20,
  },
  {
    label: "IBPS Photo",
    sub: "200 × 230 • ≤ 20 KB",
    w: 200,
    h: 230,
    kb: 20,
  },
  {
    label: "Railway Photo",
    sub: "200 × 230 • ≤ 20 KB",
    w: 200,
    h: 230,
    kb: 20,
  },
  {
    label: "UPSC Photo",
    sub: "300 × 350 • ≤ 50 KB",
    w: 300,
    h: 350,
    kb: 50,
  },
  {
    label: "Bank Form",
    sub: "300 × 350 • ≤ 50 KB",
    w: 300,
    h: 350,
    kb: 50,
  },
  {
    label: "PAN Photo",
    sub: "400 × 300 • 3.5 × 2.5 cm",
    w: 400,
    h: 300,
    kb: 0,
  },
  {
    label: "Aadhaar Photo",
    sub: "300 × 400 • HD",
    w: 300,
    h: 400,
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
    label: "Driving License",
    sub: "300 × 350 • HD",
    w: 300,
    h: 350,
    kb: 0,
  },
  {
    label: "OCI Photo",
    sub: "600 × 600 • 2 × 2 in",
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
    label: "Job / Resume",
    sub: "400 × 500 • HD",
    w: 400,
    h: 500,
    kb: 0,
  },
  {
    label: "Custom",
    sub: "Your own dimensions",
    w: 600,
    h: 600,
    kb: 0,
  },
];

const MAX_FILE_SIZE = 30 * 1024 * 1024;
const MIN_DIMENSION = 50;
const MAX_DIMENSION = 2000;

function formatKB(bytes: number) {
  return Math.max(1, Math.round(bytes / 1024));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function PassportClient() {
  const fileRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState("");
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const [sel, setSel] = useState(0);

  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [customKB, setCustomKB] = useState("");

  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);

  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [origKB, setOrigKB] = useState(0);
  const [newKB, setNewKB] = useState(0);

  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const hasCustom =
    customW.trim() !== "" ||
    customH.trim() !== "" ||
    customKB.trim() !== "";

  const current = useMemo(() => {
    const d = DOCS[sel];

    const w = customW.trim() ? Number(customW) : d.w;
    const h = customH.trim() ? Number(customH) : d.h;
    const kb = customKB.trim() ? Number(customKB) : d.kb;

    return {
      label: hasCustom ? "Custom Size" : d.label,
      sub: d.sub,
      w: Number.isFinite(w) ? w : d.w,
      h: Number.isFinite(h) ? h : d.h,
      kb: Number.isFinite(kb) ? kb : d.kb,
    };
  }, [sel, customW, customH, customKB, hasCustom]);

  const revokePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => revokePreview();
  }, []);

  const canvasToBlob = (
    source: HTMLCanvasElement,
    quality: number
  ): Promise<Blob | null> =>
    new Promise((resolve) => {
      source.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        quality
      );
    });

  const makePreview = (source: HTMLCanvasElement) => {
    revokePreview();

    source.toBlob(
      (blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        previewUrlRef.current = url;
        setPreview(url);
      },
      "image/jpeg",
      0.88
    );
  };

  const renderImage = (
    image: HTMLImageElement,
    doc: {
      w: number;
      h: number;
    },
    x = positionX,
    y = positionY
  ) => {
    const width = Math.round(doc.w);
    const height = Math.round(doc.h);

    if (
      width < MIN_DIMENSION ||
      width > MAX_DIMENSION ||
      height < MIN_DIMENSION ||
      height > MAX_DIMENSION
    ) {
      setStatus(
        `Width and height must be between ${MIN_DIMENSION} and ${MAX_DIMENSION}px.`
      );
      setSuccess(false);
      return;
    }

    const c = document.createElement("canvas");

    c.width = width;
    c.height = height;

    const ctx = c.getContext("2d");

    if (!ctx) {
      setStatus(
        "Your browser could not start image processing. Please try another browser."
      );
      setSuccess(false);
      return;
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const iw = image.naturalWidth;
    const ih = image.naturalHeight;

    if (!iw || !ih) {
      setStatus("Could not read the image dimensions.");
      setSuccess(false);
      return;
    }

    const imageRatio = iw / ih;
    const outputRatio = width / height;

    let sw: number;
    let sh: number;

    if (imageRatio > outputRatio) {
      sh = ih;
      sw = ih * outputRatio;
    } else {
      sw = iw;
      sh = iw / outputRatio;
    }

    const maxX = Math.max(0, iw - sw);
    const maxY = Math.max(0, ih - sh);

    const sx = (clamp(x, 0, 100) / 100) * maxX;
    const sy = (clamp(y, 0, 100) / 100) * maxY;

    ctx.drawImage(
      image,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      width,
      height
    );

    setCanvas(c);
    makePreview(c);

    c.toBlob(
      (blob) => {
        if (blob) {
          setNewKB(formatKB(blob.size));
        }
      },
      "image/jpeg",
      0.88
    );
  };

  const handleFile = (file?: File) => {
    if (!file) return;

    const lowerName = file.name.toLowerCase();

    if (
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      lowerName.endsWith(".heic") ||
      lowerName.endsWith(".heif")
    ) {
      setStatus(
        "HEIC photos are not supported. Please convert the photo to JPG or PNG and upload it again."
      );
      setSuccess(false);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus(
        "Please upload a JPG, JPEG, PNG, WebP, or another supported image file."
      );
      setSuccess(false);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setStatus(
        "This image is larger than 30 MB. Please choose a smaller image."
      );
      setSuccess(false);
      return;
    }

    setProcessing(true);
    setSuccess(false);
    setStatus("Loading your photo...");

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        setImg(image);

        setOrigW(image.naturalWidth);
        setOrigH(image.naturalHeight);
        setOrigKB(formatKB(file.size));

        setPositionX(50);
        setPositionY(50);

        renderImage(image, current, 50, 50);

        setStatus(
          "Photo ready. Adjust the position if needed, then download."
        );

        setSuccess(true);
        setProcessing(false);
      };

      image.onerror = () => {
        setStatus(
          "This image could not be opened. Please choose another image."
        );
        setSuccess(false);
        setProcessing(false);
      };

      image.src = reader.result as string;
    };

    reader.onerror = () => {
      setStatus("The image could not be read. Please try again.");
      setSuccess(false);
      setProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const selectDoc = (index: number) => {
    setSel(index);

    setCustomW("");
    setCustomH("");
    setCustomKB("");

    setPositionX(50);
    setPositionY(50);

    const selected = DOCS[index];

    if (img) {
      renderImage(img, selected, 50, 50);

      setStatus(
        `${selected.label} selected • ${selected.w} × ${selected.h}${
          selected.kb
            ? ` • target ≤ ${selected.kb} KB`
            : ""
        }`
      );

      setSuccess(true);
    }
  };

  const applyCustom = () => {
    if (!img) {
      setStatus("Please upload a photo first.");
      setSuccess(false);
      return;
    }

    const w = Number(customW);
    const h = Number(customH);
    const kb = customKB.trim() ? Number(customKB) : 0;

    if (
      !Number.isInteger(w) ||
      !Number.isInteger(h) ||
      w < MIN_DIMENSION ||
      w > MAX_DIMENSION ||
      h < MIN_DIMENSION ||
      h > MAX_DIMENSION
    ) {
      setStatus(
        `Width and height must be whole numbers between ${MIN_DIMENSION} and ${MAX_DIMENSION}px.`
      );
      setSuccess(false);
      return;
    }

    if (
      kb !== 0 &&
      (!Number.isInteger(kb) || kb < 5 || kb > 500)
    ) {
      setStatus("File size must be between 5 and 500 KB.");
      setSuccess(false);
      return;
    }

    const customDoc = {
      w,
      h,
    };

    setPositionX(50);
    setPositionY(50);

    renderImage(img, customDoc, 50, 50);

    setStatus(
      `Custom size applied • ${w} × ${h}${
        kb ? ` • target ≤ ${kb} KB` : ""
      }`
    );

    setSuccess(true);
  };

  const changePosition = (
    type: "x" | "y",
    value: number
  ) => {
    if (!img) return;

    const nextX =
      type === "x" ? value : positionX;

    const nextY =
      type === "y" ? value : positionY;

    if (type === "x") {
      setPositionX(value);
    }

    if (type === "y") {
      setPositionY(value);
    }

    renderImage(
      img,
      current,
      nextX,
      nextY
    );
  };

  const compressToTarget = async (
    source: HTMLCanvasElement,
    targetKB: number
  ) => {
    const targetBytes = targetKB * 1024;

    let low = 0.15;
    let high = 0.95;

    let best: Blob | null = null;

    for (let i = 0; i < 10; i++) {
      const quality = (low + high) / 2;

      const blob = await canvasToBlob(
        source,
        quality
      );

      if (!blob) continue;

      if (blob.size <= targetBytes) {
        best = blob;
        low = quality;
      } else {
        high = quality;
      }
    }

    if (best) {
      return best;
    }

    let working = source;

    for (let step = 0; step < 7; step++) {
      const next = document.createElement("canvas");

      next.width = Math.max(
        50,
        Math.floor(working.width * 0.88)
      );

      next.height = Math.max(
        50,
        Math.floor(working.height * 0.88)
      );

      const ctx = next.getContext("2d");

      if (!ctx) break;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(
        0,
        0,
        next.width,
        next.height
      );

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        working,
        0,
        0,
        working.width,
        working.height,
        0,
        0,
        next.width,
        next.height
      );

      low = 0.1;
      high = 0.9;
      best = null;

      for (let i = 0; i < 9; i++) {
        const quality = (low + high) / 2;

        const blob = await canvasToBlob(
          next,
          quality
        );

        if (!blob) continue;

        if (blob.size <= targetBytes) {
          best = blob;
          low = quality;
        } else {
          high = quality;
        }
      }

      if (best) {
        return best;
      }

      working = next;
    }

    return canvasToBlob(working, 0.1);
  };

  const download = async () => {
    if (!canvas) {
      setStatus("Please upload a photo first.");
      setSuccess(false);
      return;
    }

    if (
      current.w < MIN_DIMENSION ||
      current.w > MAX_DIMENSION ||
      current.h < MIN_DIMENSION ||
      current.h > MAX_DIMENSION
    ) {
      setStatus("The selected photo dimensions are invalid.");
      setSuccess(false);
      return;
    }

    if (
      current.kb &&
      (current.kb < 5 || current.kb > 500)
    ) {
      setStatus(
        "The file-size target must be between 5 and 500 KB."
      );
      setSuccess(false);
      return;
    }

    setProcessing(true);
    setSuccess(false);
    setStatus("Preparing your photo...");

    try {
      let blob: Blob | null;

      if (current.kb > 0) {
        blob = await compressToTarget(
          canvas,
          current.kb
        );
      } else {
        blob = await canvasToBlob(
          canvas,
          0.92
        );
      }

      if (!blob) {
        throw new Error("Unable to create image.");
      }

      const actualKB = blob.size / 1024;

      setNewKB(
        Math.max(1, Math.round(actualKB))
      );

      const safeName = current.label
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const fileName =
        `NEXORA-${safeName}-${current.w}x${current.h}` +
        `${
          current.kb
            ? `-${current.kb}KB`
            : "-HD"
        }.jpg`;

      const url =
        URL.createObjectURL(blob);

      const isIOS =
        /iPad|iPhone|iPod/.test(
          navigator.userAgent
        ) ||
        (navigator.platform === "MacIntel" &&
          navigator.maxTouchPoints > 1);

      if (
        isIOS &&
        typeof (navigator as any).share ===
          "function"
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
            typeof (navigator as any)
              .canShare === "function" &&
            (navigator as any).canShare({
              files: [file],
            });

          if (canShare) {
            await (navigator as any).share(
              {
                files: [file],
                title:
                  "NEXORA Passport Photo",
              }
            );

            setStatus(
              `Photo ready • ${actualKB.toFixed(
                1
              )} KB`
            );

            setSuccess(true);
          } else {
            window.open(url, "_blank");

            setStatus(
              "Photo opened in a new tab. Use Share or Save Image to save it."
            );

            setSuccess(true);
          }
        } catch (error: any) {
          if (
            error?.name === "AbortError"
          ) {
            setStatus(
              "Sharing cancelled."
            );

            setSuccess(false);
          } else {
            window.open(url, "_blank");

            setStatus(
              "Photo opened in a new tab. Use Share or Save Image to save it."
            );

            setSuccess(true);
          }
        }
      } else {
        const a =
          document.createElement("a");

        a.href = url;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();
        a.remove();

        setStatus(
          `Download complete • ${actualKB.toFixed(
            1
          )} KB`
        );

        setSuccess(true);
      }

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);

      if (
        typeof (window as any).gtag ===
        "function"
      ) {
        (window as any).gtag(
          "event",
          "passport_photo_download",
          {
            event_category:
              "Image Tools",
            event_label:
              current.label,
            target_kb:
              current.kb || 0,
            width: current.w,
            height: current.h,
          }
        );
      }
    } catch {
      setStatus(
        "The photo could not be prepared. Please try again."
      );

      setSuccess(false);
    } finally {
      setProcessing(false);
    }
  };

  const clearAll = () => {
    revokePreview();

    setImg(null);
    setPreview("");
    setCanvas(null);

    setCustomW("");
    setCustomH("");
    setCustomKB("");

    setPositionX(50);
    setPositionY(50);

    setOrigW(0);
    setOrigH(0);
    setOrigKB(0);
    setNewKB(0);

    setSel(0);

    setStatus("");
    setSuccess(false);
    setProcessing(false);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <div className="page">
      <main className="container">

        <section className="hero">
          <span className="badge">
            FREE • HD • NO WATERMARK • BROWSER-BASED
          </span>

          <h1>
            Passport Photo Maker
          </h1>

          <p>
            Create passport, visa and document
            photos with custom size and
            file-size options.
          </p>
        </section>

        <section className="tool-card">

          <div className="section-title">
            <span>1</span>
            Upload Photo
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            hidden
            onChange={(e) => {
              handleFile(
                e.target.files?.[0]
              );
              e.target.value = "";
            }}
          />

          <button
            className="upload"
            onClick={() =>
              fileRef.current?.click()
            }
            type="button"
          >
            <div className="upload-icon">
              ＋
            </div>

            <strong>
              {preview
                ? "Change Photo"
                : "Upload Your Photo"}
            </strong>

            <small>
              JPG, JPEG, PNG or WebP •
              Up to 30 MB
            </small>
          </button>

          <div className="section-title size-title">
            <span>2</span>
            Choose Photo Size
          </div>

          <div className="preset-scroll">
            {DOCS.map(
              (doc, index) => {
                const active =
                  sel === index &&
                  !hasCustom;

                return (
                  <button
                    type="button"
                    key={`${doc.label}-${index}`}
                    className={`preset ${
                      active
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      selectDoc(index)
                    }
                  >
                    <strong>
                      {doc.label}
                    </strong>

                    <small>
                      {doc.sub}
                    </small>
                  </button>
                );
              }
            )}
          </div>

          <div className="custom-box">
            <div className="custom-label">
              Custom Size
            </div>

            <div className="custom-row">
              <input
                type="number"
                min={50}
                max={2000}
                value={customW}
                onChange={(e) =>
                  setCustomW(
                    e.target.value
                  )
                }
                placeholder={`Width ${DOCS[sel].w}`}
                aria-label="Custom width"
              />

              <span>×</span>

              <input
                type="number"
                min={50}
                max={2000}
                value={customH}
                onChange={(e) =>
                  setCustomH(
                    e.target.value
                  )
                }
                placeholder={`Height ${DOCS[sel].h}`}
                aria-label="Custom height"
              />

              <input
                type="number"
                min={5}
                max={500}
                value={customKB}
                onChange={(e) =>
                  setCustomKB(
                    e.target.value
                  )
                }
                placeholder={
                  DOCS[sel].kb
                    ? `${DOCS[sel].kb} KB`
                    : "KB"
                }
                aria-label="Custom file size"
              />
            </div>

            {img && (
              <button
                type="button"
                className="apply-btn"
                onClick={applyCustom}
              >
                Apply Custom Size
              </button>
            )}
          </div>

          {preview && (
            <>
              <div className="section-title adjust-title">
                <span>3</span>
                Adjust Photo Position
              </div>

              <div className="adjust-box">

                <div className="preview-wrap">
                  <img
                    src={preview}
                    alt="Processed passport photo preview"
                  />
                </div>

                <div className="adjust-controls">

                  <label>
                    <span>
                      Horizontal
                    </span>

                    <b>
                      {positionX}%
                    </b>
                  </label>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={positionX}
                    onChange={(e) =>
                      changePosition(
                        "x",
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />

                  <label>
                    <span>
                      Vertical
                    </span>

                    <b>
                      {positionY}%
                    </b>
                  </label>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={positionY}
                    onChange={(e) =>
                      changePosition(
                        "y",
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />

                  <button
                    type="button"
                    className="center-btn"
                    onClick={() => {
                      setPositionX(50);
                      setPositionY(50);

                      if (img) {
                        renderImage(
                          img,
                          current,
                          50,
                          50
                        );
                      }
                    }}
                  >
                    Reset Position
                  </button>

                </div>
              </div>

              {origW > 0 && (
                <div className="info">

                  <div>
                    Original
                    <strong>
                      {origW} × {origH} •{" "}
                      {origKB} KB
                    </strong>
                  </div>

                  <div>
                    Output
                    <strong>
                      {current.w} ×{" "}
                      {current.h} •{" "}
                      {current.kb
                        ? `≤ ${current.kb} KB`
                        : `${newKB} KB`}
                    </strong>
                  </div>

                </div>
              )}

              <div className="background-card">

                <div className="background-icon">
                  🎨
                </div>

                <div className="background-copy">
                  <strong>
                    Need a different background?
                  </strong>

                  <span>
                    Remove or change the photo
                    background with NEXORA
                    Background Remover.
                  </span>
                </div>

                <a
                  href="/background-remover"
                  className="background-btn"
                >
                  Open Background Remover →
                </a>

              </div>
            </>
          )}

          {status && (
            <div
              className={`status ${
                success
                  ? "success"
                  : "error"
              }`}
            >
              {status}
            </div>
          )}

          <div className="actions">

            <button
              type="button"
              className="download-btn"
              onClick={download}
              disabled={
                !preview ||
                processing
              }
            >
              {processing
                ? "Preparing..."
                : `Download ${current.label} →`}
            </button>

            <button
              type="button"
              className="clear-btn"
              onClick={clearAll}
            >
              Clear
            </button>

          </div>

          <div className="privacy">
            🔒 Your photo is processed
            in your browser.
          </div>

        </section>

        <div className="large-space" />

        <section className="seo-card">

          <span className="seo-kicker">
            PASSPORT & DOCUMENT PHOTO TOOL
          </span>

          <h2>
            Make Passport Size Photos Online
          </h2>

          <p>
            NEXORA Passport Photo Maker lets
            you resize and prepare photos for
            passports, visas, applications,
            exams, IDs and other document
            requirements. Upload an image,
            choose a preset or enter custom
            dimensions, adjust the position
            and download the result.
          </p>

          <h2>
            How to Make a Passport Photo
          </h2>

          <ol>
            <li>
              Upload your photo.
            </li>

            <li>
              Choose the required photo size.
            </li>

            <li>
              Adjust the photo position if
              needed.
            </li>

            <li>
              Set a custom KB limit when
              required.
            </li>

            <li>
              Download the finished JPG.
            </li>
          </ol>

          <h2>
            Popular Photo Sizes
          </h2>

          <div className="size-table">

            <div>
              <span>
                India Passport
              </span>

              <b>
                413 × 531 px
              </b>
            </div>

            <div>
              <span>
                USA Passport / Visa
              </span>

              <b>
                600 × 600 px
              </b>
            </div>

            <div>
              <span>
                UK / Schengen
              </span>

              <b>
                413 × 531 px
              </b>
            </div>

            <div>
              <span>
                SSC / IBPS / Railway
              </span>

              <b>
                200 × 230 px • ≤ 20 KB
              </b>
            </div>

            <div>
              <span>
                UPSC / Bank Form
              </span>

              <b>
                300 × 350 px • ≤ 50 KB
              </b>
            </div>

            <div>
              <span>
                PAN
              </span>

              <b>
                400 × 300 px
              </b>
            </div>

            <div>
              <span>
                Aadhaar / Voter ID
              </span>

              <b>
                300 × 400 px
              </b>
            </div>

            <div>
              <span>
                Driving License
              </span>

              <b>
                300 × 350 px
              </b>
            </div>

          </div>

          <p className="note">
            Photo requirements can vary by
            country, authority and application.
            Always check the current official
            application instructions before
            submitting a photo.
          </p>

          <h2>
            Why Use NEXORA?
          </h2>

          <div className="feature-grid">

            <div>
              <b>Fast</b>
              <span>
                Browser-based image processing.
              </span>
            </div>

            <div>
              <b>Custom</b>
              <span>
                Set your own width, height
                and KB target.
              </span>
            </div>

            <div>
              <b>Private</b>
              <span>
                Your photo does not need
                server processing.
              </span>
            </div>

            <div>
              <b>No Watermark</b>
              <span>
                Download a clean JPG output.
              </span>
            </div>

          </div>

          <h2>
            Frequently Asked Questions
          </h2>

          <details>
            <summary>
              How do I make a 20KB photo?
            </summary>

            <p>
              Choose an available 20KB
              preset or enter 20 KB in
              the custom file-size field.
            </p>
          </details>

          <details>
            <summary>
              How do I make a 50KB photo?
            </summary>

            <p>
              Choose an available 50KB
              preset or enter 50 KB in
              the custom file-size field.
            </p>
          </details>

          <details>
            <summary>
              Can I move my photo inside
              the crop?
            </summary>

            <p>
              Yes. Use the Horizontal and
              Vertical controls under the
              preview to position the photo
              before downloading it.
            </p>
          </details>

          <details>
            <summary>
              Can I use my own dimensions?
            </summary>

            <p>
              Yes. Enter a width and height
              from 50 to 2000 pixels and
              apply the custom size.
            </p>
          </details>

          <details>
            <summary>
              Is my photo uploaded to a server?
            </summary>

            <p>
              Normal processing happens
              directly in your browser. The
              tool does not need to upload
              the photo to a server for
              normal processing.
            </p>
          </details>

          <details>
            <summary>
              Can I change or remove the
              background?
            </summary>

            <p>
              Yes. After preparing your
              photo, open NEXORA Background
              Remover to remove or change
              the background.
            </p>
          </details>

          <div className="related">

            <a href="/image-dpi-changer">
              Image DPI Changer →
            </a>

            <a href="/background-remover">
              Background Remover →
            </a>

          </div>

        </section>

        <p className="updated">
          NEXORA • Free & Private
          <br />
          Last Updated: 27 Nov 2026
        </p>

      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #ffffff;
          color: #0f172a;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .container {
          width: 100%;
          max-width: 760px;
          margin: auto;
          padding: 27px 16px 0;
        }

        .hero {
          text-align: center;
          margin-bottom: 18px;
        }

        .badge {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          color: #2563eb;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .3px;
        }

        h1 {
          margin: 10px 0 6px;
          font-size: clamp(29px, 7vw, 39px);
          line-height: 1.05;
          letter-spacing: -1px;
          font-weight: 900;
          background:
            linear-gradient(
              90deg,
              #1d4ed8,
              #7c3aed
            );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero p {
          max-width: 530px;
          margin: auto;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        .tool-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          padding: 13px;
          box-shadow:
            0 10px 35px
            rgba(15, 23, 42, .055);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 900;
        }

        .section-title span {
          width: 21px;
          height: 21px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #eff6ff;
          color: #2563eb;
          font-size: 10px;
        }

        .size-title {
          margin-top: 15px;
        }

        .upload {
          width: 100%;
          border: 1.5px dashed #bfdbfe;
          border-radius: 12px;
          background: #f8fbff;
          padding: 16px 10px;
          cursor: pointer;
          color: #0f172a;
        }

        .upload-icon {
          width: 32px;
          height: 32px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #dbeafe;
          color: #2563eb;
          font-size: 22px;
          font-weight: 300;
        }

        .upload strong {
          display: block;
          margin-top: 5px;
          font-size: 13px;
        }

        .upload small {
          display: block;
          margin-top: 3px;
          color: #94a3b8;
          font-size: 9px;
        }

        .preset-scroll {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: thin;
        }

        .preset {
          flex: 0 0 auto;
          min-width: 126px;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          background: #fff;
          padding: 7px 8px;
          text-align: left;
          cursor: pointer;
        }

        .preset.active {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .preset strong {
          display: block;
          color: #0f172a;
          font-size: 10px;
        }

        .preset.active strong {
          color: #2563eb;
        }

        .preset small {
          display: block;
          margin-top: 2px;
          color: #64748b;
          font-size: 8px;
          line-height: 1.3;
        }

        .custom-box {
          margin-top: 10px;
          padding: 9px;
          border-radius: 11px;
          background: #f8fafc;
          border: 1px solid #eef2f7;
        }

        .custom-label {
          margin-bottom: 6px;
          font-size: 10px;
          font-weight: 900;
          color: #334155;
        }

        .custom-row {
          display: grid;
          grid-template-columns:
            1fr 14px 1fr 1fr;
          gap: 5px;
          align-items: center;
        }

        input[type="number"] {
          width: 100%;
          min-width: 0;
          padding: 9px 7px;
          border: 1px solid #dbe3ec;
          border-radius: 8px;
          background: white;
          color: #0f172a;
          font-size: 11px;
          font-weight: 700;
          outline: none;
        }

        input[type="number"]:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px #dbeafe;
        }

        .custom-row span {
          text-align: center;
          color: #94a3b8;
          font-weight: 900;
          font-size: 12px;
        }

        .apply-btn {
          width: 100%;
          margin-top: 7px;
          border: 0;
          border-radius: 8px;
          padding: 9px;
          background: #0f172a;
          color: white;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .adjust-title {
          margin-top: 15px;
        }

        .adjust-box {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) 190px;
          gap: 13px;
          padding: 10px;
          background: #f8fafc;
          border: 1px solid #eef2f7;
          border-radius: 12px;
        }

        .preview-wrap {
          min-height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 10px;
          background:
            repeating-conic-gradient(
              #f1f5f9 0% 25%,
              white 0% 50%
            )
            50% / 16px 16px;
        }

        .preview-wrap img {
          display: block;
          max-width: 100%;
          max-height: 300px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background: white;
        }

        .adjust-controls {
          padding: 3px;
        }

        .adjust-controls label {
          display: flex;
          justify-content: space-between;
          margin: 5px 0 4px;
          font-size: 9px;
          color: #64748b;
          font-weight: 800;
        }

        .adjust-controls label b {
          color: #2563eb;
        }

        input[type="range"] {
          width: 100%;
          accent-color: #2563eb;
          cursor: pointer;
        }

        .center-btn {
          width: 100%;
          margin-top: 10px;
          padding: 8px;
          border: 1px solid #dbe3ec;
          border-radius: 8px;
          background: white;
          color: #334155;
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
        }

        .info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-top: 8px;
        }

        .info div {
          padding: 8px;
          border: 1px solid #dcfce7;
          border-radius: 9px;
          background: #f0fdf4;
          color: #64748b;
          font-size: 9px;
        }

        .info strong {
          display: block;
          margin-top: 2px;
          color: #15803d;
          font-size: 10px;
        }

        .background-card {
          display: grid;
          grid-template-columns:
            auto 1fr auto;
          align-items: center;
          gap: 9px;
          margin-top: 9px;
          padding: 10px;
          border: 1px solid #ddd6fe;
          border-radius: 11px;
          background: #faf5ff;
        }

        .background-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #ede9fe;
        }

        .background-copy strong {
          display: block;
          color: #4c1d95;
          font-size: 10px;
        }

        .background-copy span {
          display: block;
          margin-top: 2px;
          color: #64748b;
          font-size: 8px;
          line-height: 1.4;
        }

        .background-btn {
          display: inline-block;
          padding: 8px 10px;
          border-radius: 8px;
          background: #7c3aed;
          color: white;
          text-decoration: none;
          font-size: 9px;
          font-weight: 900;
          white-space: nowrap;
        }

        .status {
          margin-top: 9px;
          padding: 8px 9px;
          border-radius: 8px;
          text-align: center;
          font-size: 10px;
          line-height: 1.4;
          font-weight: 700;
        }

        .status.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .status.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .actions {
          display: flex;
          gap: 7px;
          margin-top: 10px;
        }

        .download-btn {
          flex: 1;
          border: 0;
          border-radius: 9px;
          padding: 12px;
          background: #f97316;
          color: white;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .download-btn:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .clear-btn {
          padding: 12px 15px;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          background: #f8fafc;
          color: #334155;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .privacy {
          margin-top: 7px;
          text-align: center;
          color: #94a3b8;
          font-size: 8px;
          font-weight: 700;
        }

        .large-space {
          height: 105px;
        }

        .seo-card {
          border-top: 1px solid #eef2f7;
          padding-top: 25px;
        }

        .seo-kicker {
          color: #2563eb;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .6px;
        }

        .seo-card h2 {
          margin: 10px 0 7px;
          color: #0f172a;
          font-size: 20px;
          line-height: 1.25;
          letter-spacing: -.3px;
        }

        .seo-card p,
        .seo-card li {
          color: #475569;
          font-size: 12px;
          line-height: 1.75;
        }

        .seo-card ol {
          padding-left: 20px;
          margin-top: 5px;
        }

        .size-table {
          margin-top: 8px;
          border: 1px solid #eef2f7;
          border-radius: 10px;
          overflow: hidden;
        }

        .size-table div {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 9px 10px;
          border-bottom: 1px solid #eef2f7;
          font-size: 10px;
        }

        .size-table div:last-child {
          border-bottom: 0;
        }

        .size-table span {
          color: #64748b;
        }

        .size-table b {
          color: #0f172a;
          text-align: right;
        }

        .note {
          font-size: 10px !important;
          color: #64748b !important;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }

        .feature-grid div {
          padding: 10px;
          border: 1px solid #eef2f7;
          border-radius: 9px;
          background: #f8fafc;
        }

        .feature-grid b {
          display: block;
          font-size: 10px;
          color: #2563eb;
        }

        .feature-grid span {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 9px;
          line-height: 1.5;
        }

        details {
          margin-top: 7px;
          padding: 10px 11px;
          border: 1px solid #eef2f7;
          border-radius: 9px;
          background: white;
        }

        summary {
          cursor: pointer;
          color: #0f172a;
          font-size: 11px;
          font-weight: 800;
        }

        details p {
          margin-bottom: 0;
          font-size: 10px !important;
        }

        .related {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-top: 17px;
        }

        .related a {
          padding: 11px;
          border-radius: 9px;
          background: #0f172a;
          color: white;
          text-align: center;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
        }

        .updated {
          text-align: center;
          margin: 25px 0 10px;
          color: #94a3b8 !important;
          font-size: 9px !important;
        }

        @media (max-width: 600px) {
          .container {
            padding-left: 12px;
            padding-right: 12px;
          }

          .tool-card {
            padding: 10px;
            border-radius: 14px;
          }

          .adjust-box {
            grid-template-columns: 1fr;
          }

          .preview-wrap {
            min-height: 210px;
          }

          .adjust-controls {
            padding: 0 5px 4px;
          }

          .background-card {
            grid-template-columns:
              auto 1fr;
          }

          .background-btn {
            grid-column: 1 / -1;
            text-align: center;
          }

          .large-space {
            height: 120px;
          }

          .seo-card h2 {
            font-size: 19px;
          }
        }
      `}</style>
    </div>
  );
}
