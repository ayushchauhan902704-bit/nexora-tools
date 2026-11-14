"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    __nexoraRemoveBg?: any;
    __nexoraRemoveBgLoading?: boolean;
  }
}

type BackgroundColor =
  | "transparent"
  | "white"
  | "#6366f1"
  | "#ef4444";

export default function BackgroundRemoverClient() {
  const [bgColor, setBgColor] =
    useState<BackgroundColor>("transparent");

  const [status, setStatus] = useState(
    "Photo upload karein aur start karein"
  );

  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [info, setInfo] = useState("");
  const [uploadText, setUploadText] =
    useState("Photo Upload Karein");

  const [isProcessing, setIsProcessing] = useState(false);
  const [libReady, setLibReady] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const blobRef = useRef<Blob | null>(null);

  /*
   * Smooth progress system
   */
  const progressTargetRef = useRef(0);
  const progressDisplayRef = useRef(0);
  const progressAnimationRef =
    useRef<number | null>(null);

  const loadingRef = useRef(false);
  const objectUrlRef =
    useRef<string | null>(null);

  /*
   * Smoothly move visible progress
   * toward the current target.
   */
  useEffect(() => {
    const animate = () => {
      const current =
        progressDisplayRef.current;

      const target =
        progressTargetRef.current;

      if (current < target) {
        const difference =
          target - current;

        const step =
          difference > 10
            ? 1.2
            : difference > 4
              ? 0.7
              : 0.35;

        progressDisplayRef.current =
          Math.min(
            current + step,
            target
          );

        setProgress(
          Math.round(
            progressDisplayRef.current
          )
        );
      }

      progressAnimationRef.current =
        window.requestAnimationFrame(
          animate
        );
    };

    progressAnimationRef.current =
      window.requestAnimationFrame(
        animate
      );

    return () => {
      if (
        progressAnimationRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          progressAnimationRef.current
        );
      }
    };
  }, []);

  const setProgressTarget = (
    value: number
  ) => {
    progressTargetRef.current =
      Math.max(
        0,
        Math.min(100, value)
      );
  };

  const finishProgress = () => {
    progressTargetRef.current = 100;
    progressDisplayRef.current = 100;
    setProgress(100);
  };

  /*
   * Load AI background-removal library.
   */
  const loadLibrary = (): Promise<any> => {
    return new Promise(
      (resolve, reject) => {
        if (
          typeof window ===
          "undefined"
        ) {
          reject(
            new Error(
              "Browser environment required hai."
            )
          );
          return;
        }

        if (
          window.__nexoraRemoveBg
        ) {
          setLibReady(true);

          resolve(
            window.__nexoraRemoveBg
          );

          return;
        }

        if (
          loadingRef.current ||
          window.__nexoraRemoveBgLoading
        ) {
          const start =
            Date.now();

          const check =
            window.setInterval(
              () => {
                if (
                  window.__nexoraRemoveBg
                ) {
                  window.clearInterval(
                    check
                  );

                  setLibReady(true);

                  resolve(
                    window.__nexoraRemoveBg
                  );

                  return;
                }

                if (
                  Date.now() -
                    start >
                  45000
                ) {
                  window.clearInterval(
                    check
                  );

                  loadingRef.current =
                    false;

                  window.__nexoraRemoveBgLoading =
                    false;

                  reject(
                    new Error(
                      "AI model load nahi ho paya. Internet connection check karke dobara try karein."
                    )
                  );
                }
              },
              250
            );

          return;
        }

        loadingRef.current =
          true;

        window.__nexoraRemoveBgLoading =
          true;

        const readyEvent =
          "nexora-bg-ready";

        const errorEvent =
          "nexora-bg-error";

        let finished = false;

        let timeout:
          number | null =
          null;

        const cleanup =
          () => {
            window.removeEventListener(
              readyEvent,
              onReady
            );

            window.removeEventListener(
              errorEvent,
              onError
            );

            if (
              timeout !== null
            ) {
              window.clearTimeout(
                timeout
              );

              timeout = null;
            }

            loadingRef.current =
              false;

            window.__nexoraRemoveBgLoading =
              false;
          };

        const finishSuccess =
          (fn: any) => {
            if (finished)
              return;

            finished = true;

            cleanup();

            setLibReady(true);

            resolve(fn);
          };

        const finishError =
          (error: Error) => {
            if (finished)
              return;

            finished = true;

            cleanup();

            reject(error);
          };

        const onReady =
          () => {
            if (
              window.__nexoraRemoveBg
            ) {
              finishSuccess(
                window.__nexoraRemoveBg
              );
            } else {
              finishError(
                new Error(
                  "AI library load hui, lekin remover available nahi hua."
                )
              );
            }
          };

        const onError =
          (event: Event) => {
            console.error(
              "NEXORA background-removal module error:",
              event
            );

            finishError(
              new Error(
                "AI model load nahi ho paya. Please dobara try karein."
              )
            );
          };

        window.addEventListener(
          readyEvent,
          onReady,
          {
            once: true,
          }
        );

        window.addEventListener(
          errorEvent,
          onError,
          {
            once: true,
          }
        );

        timeout =
          window.setTimeout(
            () => {
              finishError(
                new Error(
                  "AI model load hone mein bahut time lag raha hai. Please dobara try karein."
                )
              );
            },
            45000
          );

        const existingScript =
          document.querySelector(
            'script[data-nexora-bg-module="1"]'
          );

        if (
          existingScript
        ) {
          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.type =
          "module";

        script.setAttribute(
          "data-nexora-bg-module",
          "1"
        );

        script.textContent = `
          import removeBackground from "https://esm.sh/@imgly/background-removal@1.4.5";

          window.__nexoraRemoveBg = removeBackground;

          window.dispatchEvent(
            new Event("nexora-bg-ready")
          );
        `;

        script.onerror =
          () => {
            window.dispatchEvent(
              new Event(
                "nexora-bg-error"
              )
            );
          };

        document.body.appendChild(
          script
        );
      }
    );
  };

  /*
   * Clean temporary object URL.
   */
  const cleanupObjectUrl =
    () => {
      if (
        objectUrlRef.current
      ) {
        URL.revokeObjectURL(
          objectUrlRef.current
        );

        objectUrlRef.current =
          null;
      }
    };

  /*
   * Draw processed image
   * on selected background.
   */
  const redraw = (
    color: BackgroundColor =
      bgColor
  ) => {
    const img =
      imgRef.current;

    const canvas =
      canvasRef.current;

    if (
      !img ||
      !canvas
    ) {
      return;
    }

    const ctx =
      canvas.getContext(
        "2d"
      );

    if (!ctx) {
      return;
    }

    const width =
      img.naturalWidth ||
      img.width;

    const height =
      img.naturalHeight ||
      img.height;

    if (
      !width ||
      !height
    ) {
      return;
    }

    canvas.width =
      width;

    canvas.height =
      height;

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    if (
      color !==
      "transparent"
    ) {
      ctx.fillStyle =
        color === "white"
          ? "#ffffff"
          : color;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );
    }

    ctx.drawImage(
      img,
      0,
      0,
      width,
      height
    );
  };

  useEffect(() => {
    if (
      showPreview
    ) {
      redraw(bgColor);
    }
  }, [
    bgColor,
    showPreview,
  ]);

  /*
   * Prepare large images for
   * safer browser processing.
   */
  const prepareImage = (
    file: File
  ): Promise<
    Blob | File
  > => {
    return new Promise(
      (resolve) => {
        const url =
          URL.createObjectURL(
            file
          );

        const img =
          new Image();

        img.onload =
          () => {
            URL.revokeObjectURL(
              url
            );

            const maxDimension =
              2400;

            const maxPixels =
              12_000_000;

            const currentPixels =
              img.width *
              img.height;

            const dimensionScale =
              Math.min(
                1,
                maxDimension /
                  Math.max(
                    img.width,
                    img.height
                  )
              );

            const pixelScale =
              Math.sqrt(
                maxPixels /
                  Math.max(
                    currentPixels,
                    1
                  )
              );

            const scale =
              Math.min(
                1,
                dimensionScale,
                pixelScale
              );

            if (
              scale >= 1 &&
              file.size <=
                8 *
                  1024 *
                  1024
            ) {
              resolve(file);
              return;
            }

            const canvas =
              document.createElement(
                "canvas"
              );

            const width =
              Math.max(
                1,
                Math.round(
                  img.width *
                    scale
                )
              );

            const height =
              Math.max(
                1,
                Math.round(
                  img.height *
                    scale
                )
              );

            canvas.width =
              width;

            canvas.height =
              height;

            const ctx =
              canvas.getContext(
                "2d"
              );

            if (!ctx) {
              resolve(file);
              return;
            }

            ctx.drawImage(
              img,
              0,
              0,
              width,
              height
            );

            canvas.toBlob(
              (blob) => {
                resolve(
                  blob ||
                    file
                );
              },
              "image/jpeg",
              0.9
            );
          };

        img.onerror =
          () => {
            URL.revokeObjectURL(
              url
            );

            resolve(file);
          };

        img.src = url;
      }
    );
  };

  /*
   * Validate image.
   */
  const validateFile = (
    file: File
  ): string | null => {
    const allowedTypes =
      [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      return "Please JPG, PNG ya WebP image select karein.";
    }

    const maxFileSize =
      25 *
      1024 *
      1024;

    if (
      file.size >
      maxFileSize
    ) {
      return "Image 25 MB se badi hai. Please smaller image choose karein.";
    }

    return null;
  };

  /*
   * Main processing function.
   */
  const handleFile =
    async (
      file:
        | File
        | undefined
    ) => {
      if (
        !file ||
        isProcessing
      ) {
        return;
      }

      const validationError =
        validateFile(
          file
        );

      if (
        validationError
      ) {
        setStatus(
          `❌ ${validationError}`
        );

        setUploadText(
          "Photo Upload Karein"
        );

        return;
      }

      cleanupObjectUrl();

      setIsProcessing(
        true
      );

      setShowPreview(
        false
      );

      setInfo("");

      setUploadText(
        "⏳ AI Processing Start Ho Gayi..."
      );

      setStatus(
        "Background remove karna start ho raha hai..."
      );

      progressDisplayRef.current =
        0;

      progressTargetRef.current =
        0;

      setProgress(0);

      if (
        fileRef.current
      ) {
        fileRef.current.value =
          "";
      }

      try {
        /*
         * Initial stage
         */
        setProgressTarget(
          8
        );

        setStatus(
          "AI resources prepare ho rahe hain..."
        );

        /*
         * Load AI library.
         */
        setProgressTarget(
          32
        );

        const removeBg =
          await loadLibrary();

        setStatus(
          "AI ready hai. Aapki image prepare ho rahi hai..."
        );

        setProgressTarget(
          50
        );

        /*
         * Prepare uploaded image.
         */
        const preparedFile =
          await prepareImage(
            file
          );

        setStatus(
          "Background removal start ho raha hai..."
        );

        setProgressTarget(
          64
        );

        /*
         * Actual AI background removal.
         */
        const blob =
          await removeBg(
            preparedFile,
            {
              progress: (
                _key: string,
                current: number,
                total: number
              ) => {
                if (
                  !total
                ) {
                  return;
                }

                const realPct =
                  Math.round(
                    (current /
                      total) *
                      100
                  );

                /*
                 * Actual AI progress
                 * is mapped between 64-99%.
                 */
                const mappedPct =
                  64 +
                  Math.round(
                    (realPct /
                      100) *
                      35
                  );

                if (
                  mappedPct >
                  progressTargetRef.current
                ) {
                  setProgressTarget(
                    mappedPct
                  );
                }

                if (
                  mappedPct <
                  82
                ) {
                  setStatus(
                    `Background remove ho raha hai... ${mappedPct}%`
                  );
                } else if (
                  mappedPct <
                  96
                ) {
                  setStatus(
                    `Image refine ho rahi hai... ${mappedPct}%`
                  );
                } else {
                  setStatus(
                    "Final image prepare ho rahi hai..."
                  );
                }
              },
            }
          );

        finishProgress();

        setStatus(
          "✅ Background successfully remove ho gaya"
        );

        blobRef.current =
          blob;

        const url =
          URL.createObjectURL(
            blob
          );

        objectUrlRef.current =
          url;

        const img =
          new Image();

        img.onload =
          () => {
            imgRef.current =
              img;

            setShowPreview(
              true
            );

            setUploadText(
              "✅ Background Remove Ho Gaya"
            );

            setInfo(
              `${img.naturalWidth} × ${img.naturalHeight} • PNG • No Watermark`
            );

            setIsProcessing(
              false
            );
          };

        img.onerror =
          () => {
            cleanupObjectUrl();

            setIsProcessing(
              false
            );

            setShowPreview(
              false
            );

            setStatus(
              "❌ Processed image display nahi ho paayi. Please dobara try karein."
            );
          };

        img.src = url;
      } catch (
        error
      ) {
        console.error(
          "NEXORA Hinglish Background Remover Error:",
          error
        );

        setProgressTarget(
          0
        );

        progressDisplayRef.current =
          0;

        setProgress(0);

        setIsProcessing(
          false
        );

        setShowPreview(
          false
        );

        const message =
          error instanceof
          Error
            ? error.message
            : "Image process karte waqt kuch problem aa gayi.";

        setStatus(
          `❌ ${message}`
        );

        setUploadText(
          "Photo Upload Karein"
        );
      }
    };

  /*
   * Download result as PNG.
   */
  const download =
    () => {
      const canvas =
        canvasRef.current;

      if (
        !canvas ||
        !showPreview
      ) {
        setStatus(
          "Pehle image process karein."
        );

        return;
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setStatus(
              "❌ PNG create nahi ho paayi. Please dobara try karein."
            );

            return;
          }

          const url =
            URL.createObjectURL(
              blob
            );

          const anchor =
            document.createElement(
              "a"
            );

          anchor.href =
            url;

          anchor.download =
            `nexora-background-removed-${Date.now()}.png`;

          document.body.appendChild(
            anchor
          );

          anchor.click();

          anchor.remove();

          window.setTimeout(
            () => {
              URL.revokeObjectURL(
                url
              );
            },
            1000
          );

          setStatus(
            "✅ PNG successfully download ho gayi"
          );
        },
        "image/png"
      );
    };

  /*
   * Reset tool.
   */
  const resetTool =
    () => {
      cleanupObjectUrl();

      imgRef.current =
        null;

      blobRef.current =
        null;

      setShowPreview(
        false
      );

      setInfo("");

      setProgress(
        0
      );

      progressDisplayRef.current =
        0;

      progressTargetRef.current =
        0;

      setStatus(
        "Photo upload karein aur start karein"
      );

      setUploadText(
        "Photo Upload Karein"
      );

      if (
        fileRef.current
      ) {
        fileRef.current.value =
          "";
      }
    };

  const colors: {
    label: string;
    val: BackgroundColor;
  }[] = [
    {
      label: "Transparent",
      val: "transparent",
    },
    {
      label: "White - Passport",
      val: "white",
    },
    {
      label: "Blue - Visa",
      val: "#6366f1",
    },
    {
      label: "Red",
      val: "#ef4444",
    },
  ];

  return (
    <div
      style={{
        fontFamily:
          "system-ui, sans-serif",
        background:
          "#ffffff",
        color:
          "#0f172a",
        minHeight:
          "100vh",
      }}
    >
      {/* HEADER */}

      <header
        style={{
          background: "#fff",
          borderBottom:
            "1px solid #eef2f7",
          position:
            "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin:
              "0 auto",
            padding:
              "14px 20px",
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
          }}
        >
          <a
            href="/"
            style={{
              fontSize: 24,
              fontWeight: 900,
              color:
                "#2563eb",
              textDecoration:
                "none",
            }}
          >
            NEXORA
          </a>

          <nav
            style={{
              display:
                "flex",
              gap: 20,
              fontSize: 14,
              fontWeight: 600,
            }}
            aria-label="Main navigation"
          >
            <a
              href="/"
              style={{
                color:
                  "#0f172a",
                textDecoration:
                  "none",
              }}
            >
              Home
            </a>

            <a
              href="/passport-photo-maker"
              style={{
                color:
                  "#0f172a",
                textDecoration:
                  "none",
              }}
            >
              Passport Photo
            </a>
          </nav>
        </div>
      </header>

      {/* MAIN */}

      <main
        style={{
          maxWidth: 760,
          margin:
            "0 auto",
          padding:
            "30px 18px 10px",
        }}
      >
        {/* HERO */}

        <div
          style={{
            textAlign:
              "center",
            marginBottom:
              28,
          }}
        >
          <span
            style={{
              display:
                "inline-flex",
              background:
                "#eff6ff",
              color:
                "#2563eb",
              border:
                "1px solid #bfdbfe",
              padding:
                "7px 12px",
              borderRadius:
                999,
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            ✦ FREE • HD PNG • NO WATERMARK •{" "}
            {libReady
              ? "AI READY ✅"
              : "READY TO REMOVE BG"}
          </span>

          <h1
            style={{
              fontSize: 38,
              margin:
                "14px 0 8px",
              lineHeight:
                1.05,
              fontWeight: 900,
              background:
                "linear-gradient(90deg, #1d4ed8, #6d28d9)",
              WebkitBackgroundClip:
                "text",
              WebkitTextFillColor:
                "transparent",
              textAlign:
                "center",
            }}
          >
            Photo Ka
            <br />
            Background Remove Karein
          </h1>

          <p
            style={{
              color:
                "#64748b",
              fontSize: 16,
              margin: 0,
              lineHeight:
                1.6,
            }}
          >
            Image ka background online remove karein
            <br />
            Transparent, White, Blue, Red • PNG • No Watermark
          </p>
        </div>

        {/* TOOL CARD */}

        <div
          style={{
            background:
              "#fff",
            border:
              "1.5px solid #e2e8f0",
            borderRadius:
              20,
            padding: 18,
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              fontWeight: 700,
              fontSize: 14,
              margin:
                "0 0 10px",
              textAlign:
                "center",
            }}
          >
            Apni Photo Upload Karein
          </p>

          {/* UPLOAD */}

          <label
            htmlFor="background-remover-file-hi"
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();

              if (
                !isProcessing
              ) {
                handleFile(
                  e.dataTransfer.files[0]
                );
              }
            }}
            style={{
              display:
                "block",
              border:
                "1.5px dashed #cbd5e1",
              borderRadius:
                14,
              padding: 18,
              textAlign:
                "center",
              cursor:
                isProcessing
                  ? "not-allowed"
                  : "pointer",
              opacity:
                isProcessing
                  ? 0.7
                  : 1,
            }}
          >
            <div
              style={{
                fontSize: 28,
              }}
            >
              📷
            </div>

            <p
              style={{
                fontWeight: 700,
                margin:
                  "6px 0 2px",
                fontSize: 15,
              }}
            >
              {uploadText}
            </p>

            <p
              style={{
                fontSize: 12,
                color:
                  "#94a3b8",
                margin: 0,
              }}
            >
              JPG, PNG, WebP • Browser Processing • No Sign-Up
            </p>

            <input
              id="background-remover-file-hi"
              type="file"
              ref={fileRef}
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              hidden
              disabled={
                isProcessing
              }
              onChange={(e) =>
                handleFile(
                  e.target
                    .files?.[0]
                )
              }
            />
          </label>

          {/* PROGRESS */}

          {isProcessing && (
            <div
              style={{
                marginTop: 14,
              }}
              aria-live="polite"
            >
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom:
                    6,
                }}
              >
                <span
                  style={{
                    color:
                      "#2563eb",
                  }}
                >
                  {status}
                </span>

                <span>
                  {progress}%
                </span>
              </div>

              <div
                style={{
                  width:
                    "100%",
                  height: 8,
                  background:
                    "#eef2f7",
                  borderRadius:
                    999,
                  overflow:
                    "hidden",
                }}
                aria-hidden="true"
              >
                <div
                  style={{
                    height:
                      "100%",
                    width:
                      `${progress}%`,
                    background:
                      "linear-gradient(90deg, #2563eb, #7c3aed)",
                    transition:
                      "width 0.15s linear",
                  }}
                />
              </div>

              <p
                style={{
                  fontSize: 11,
                  color:
                    "#94a3b8",
                  textAlign:
                    "center",
                  margin:
                    "8px 0 0",
                }}
              >
                First use mein AI resources prepare hone ki wajah se thoda extra time lag sakta hai.
              </p>
            </div>
          )}

          {!isProcessing && (
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                textAlign:
                  "center",
                margin:
                  "12px 0 0",
                color:
                  status.startsWith(
                    "❌"
                  )
                    ? "#dc2626"
                    : "#2563eb",
              }}
              aria-live="polite"
            >
              {status}
            </p>
          )}

          {/* BACKGROUND OPTIONS */}

          <p
            style={{
              fontWeight: 700,
              fontSize: 14,
              margin:
                "16px 0 10px",
              textAlign:
                "center",
            }}
          >
            Background Choose Karein
          </p>

          <div
            style={{
              display:
                "flex",
              flexWrap:
                "wrap",
              gap: 8,
              justifyContent:
                "center",
            }}
          >
            {colors.map(
              (c) => (
                <button
                  key={
                    c.val
                  }
                  type="button"
                  disabled={
                    !showPreview ||
                    isProcessing
                  }
                  onClick={() => {
                    setBgColor(
                      c.val
                    );
                  }}
                  style={{
                    padding:
                      "8px 14px",
                    borderRadius:
                      999,
                    border:
                      bgColor ===
                      c.val
                        ? "2px solid #f97316"
                        : "1.5px solid #e2e8f0",
                    background:
                      bgColor ===
                      c.val
                        ? "#fff7ed"
                        : "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor:
                      showPreview &&
                      !isProcessing
                        ? "pointer"
                        : "not-allowed",
                    opacity:
                      showPreview &&
                      !isProcessing
                        ? 1
                        : 0.55,
                  }}
                >
                  {c.label}
                </button>
              )
            )}
          </div>

          {/* PREVIEW */}

          {showPreview && (
            <div
              style={{
                textAlign:
                  "center",
                marginTop: 16,
              }}
            >
              <canvas
                ref={canvasRef}
                aria-label="Background removed image preview"
                style={{
                  maxWidth:
                    "100%",
                  height:
                    "auto",
                  borderRadius:
                    12,
                  border:
                    "1px solid #eee",
                  display:
                    "block",
                  margin:
                    "0 auto",
                }}
              />

              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  marginTop: 8,
                }}
              >
                {info}
              </p>

              <button
                type="button"
                onClick={
                  download
                }
                style={{
                  width:
                    "100%",
                  padding: 15,
                  background:
                    "#f97316",
                  color:
                    "#fff",
                  border:
                    "none",
                  borderRadius:
                    12,
                  fontSize: 16,
                  fontWeight: 800,
                  cursor:
                    "pointer",
                  marginTop: 8,
                }}
              >
                PNG FREE Download Karein ↓
              </button>

              <button
                type="button"
                onClick={
                  resetTool
                }
                style={{
                  width:
                    "100%",
                  padding: 12,
                  background:
                    "#f8fafc",
                  color:
                    "#0f172a",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius:
                    12,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor:
                    "pointer",
                  marginTop: 8,
                }}
              >
                Dusra Background Remove Karein
              </button>
            </div>
          )}

          {/* INITIAL BUTTON */}

          {!showPreview &&
            !isProcessing && (
              <button
                type="button"
                onClick={() =>
                  fileRef.current?.click()
                }
                style={{
                  width:
                    "100%",
                  padding: 15,
                  background:
                    "#f97316",
                  color:
                    "#fff",
                  border:
                    "none",
                  borderRadius:
                    12,
                  fontSize: 16,
                  fontWeight: 800,
                  cursor:
                    "pointer",
                  marginTop: 16,
                }}
              >
                Background Remove FREE →
              </button>
            )}
        </div>

        <div
          style={{
            height: 30,
          }}
        />

        {/* WORK SECTION */}

        <div
          style={{
            background:
              "#fefce8",
            border:
              "2px solid #facc15",
            borderRadius:
              16,
            padding: 18,
          }}
        >
          <b>
            💡 Is Tool Ko Apne Daily Work Mein Use Karein
          </b>

          <p
            style={{
              margin:
                "8px 0 0",
              fontSize: 15,
              lineHeight:
                1.7,
            }}
          >
            Agar aap photos ko documents, applications,
            product listings, social media ya other designs
            ke liye prepare karte hain, to ye free tool
            background removal ke workflow mein useful ho sakta hai.
            Kisi official document ke liye photo use karne se pehle
            uski official requirements zaroor check karein.
          </p>
        </div>

        <div
          style={{
            height: 30,
          }}
        />

        {/* LOCALIZED SEO CONTENT */}

        <div
          style={{
            background:
              "#fff",
            border:
              "1px solid #eef2f7",
            borderRadius:
              18,
            padding: 22,
          }}
        >
          <h2
            style={{
              fontSize: 21,
            }}
          >
            Free Background Remover Online
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            NEXORA ka free background remover aapko
            browser ke andar hi photo ka background remove
            karne mein help karta hai. Aap transparent PNG
            bana sakte hain ya image ke liye white, blue ya red
            background choose kar sakte hain. Account ya sign-up
            ki zarurat nahi hai.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Photo Ka Background Kaise Remove Karein?
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            <b>Step 1:</b>{" "}
            JPG, PNG ya WebP photo upload karein.
            <br />

            <b>Step 2:</b>{" "}
            Browser-based AI image ko process karke
            background remove karega.
            <br />

            <b>Step 3:</b>{" "}
            Transparent, White, Blue ya Red background
            choose karein.
            <br />

            <b>Step 4:</b>{" "}
            Processed PNG ko download karein.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Image Ka Background Hataye Aur Transparent PNG Banaye
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            Background remove hone ke baad <b>Transparent</b>
            option select karein. Isse aap PNG result bana
            sakte hain jo product photos, profile graphics,
            thumbnails, websites, presentations aur designs
            mein use kiya ja sakta hai.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            White Background Photo Ke Liye
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            Agar aapko white background wali photo chahiye,
            to background remove karne ke baad
            <b> White - Passport</b> option choose kar sakte hain.
            Lekin passport, visa aur government documents ke
            photo rules country aur document ke hisaab se
            different ho sakte hain. Submit karne se pehle
            official requirements verify karein.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            iPhone Aur Android Par Background Remove Karein
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            NEXORA modern mobile aur desktop browsers ke liye
            designed hai. Aap phone se directly photo upload
            kar sakte hain bina separate application install kiye.
            Processing speed aapke device, browser, image size
            aur available memory par depend kar sakti hai.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Kya Photo Private Rehti Hai?
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            Background-removal processing browser ke andar
            perform hoti hai, NEXORA ke image-processing server
            par nahi. AI package ko required model resources
            external CDN se download karne pad sakte hain.
            Isliye image processing workflow aapke device par
            locally run karne ke liye designed hai.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Kaunse Image Formats Supported Hain?
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            Tool common <b>JPG, PNG aur WebP</b> images
            accept karta hai. Bahut large images ko browser
            processing ke time resize kiya ja sakta hai,
            taaki mobile devices par excessive memory usage
            kam rahe.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Automatic Background Removal vs Manual Editing
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            Manual editing mein selection, masks, layers aur
            edge adjustments karne pad sakte hain. Automatic
            background removal un situations mein time save
            kar sakta hai jahan aapko person, product ya kisi
            foreground subject ko quickly isolate karna ho.
          </p>

          {/* EXAMPLE IMAGE */}

          <div
            style={{
              marginTop: 22,
              textAlign:
                "center",
            }}
          >
            <img
              src="/background-remover-example.jpg"
              alt="NEXORA background remover before and after example"
              width="1200"
              height="630"
              loading="lazy"
              decoding="async"
              style={{
                width:
                  "100%",
                height:
                  "auto",
                borderRadius:
                  14,
                border:
                  "1px solid #eef2f7",
              }}
            />
          </div>

          {/* FEATURES */}

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            NEXORA Background Remover Ke Features
          </h2>

          <div
            style={{
              overflowX:
                "auto",
            }}
          >
            <table
              style={{
                width:
                  "100%",
                minWidth:
                  500,
                borderCollapse:
                  "collapse",
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
                      background:
                        "#f8fafc",
                      textAlign:
                        "left",
                    }}
                  >
                    Feature
                  </th>

                  <th
                    style={{
                      border:
                        "1px solid #eef2f7",
                      padding: 8,
                      background:
                        "#f8fafc",
                    }}
                  >
                    NEXORA
                  </th>

                  <th
                    style={{
                      border:
                        "1px solid #eef2f7",
                      padding: 8,
                      background:
                        "#f8fafc",
                    }}
                  >
                    Other Online Tools
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
                    Cost
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #eef2f7",
                      padding: 8,
                      textAlign:
                        "center",
                    }}
                  >
                    Free
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #eef2f7",
                      padding: 8,
                      textAlign:
                        "center",
                    }}
                  >
                    Varies
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
                      textAlign:
                        "center",
                    }}
                  >
                    No NEXORA watermark
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #eef2f7",
                      padding: 8,
                      textAlign:
                        "center",
                    }}
                  >
                    Varies
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
                    Browser Processing
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #eef2f7",
                      padding: 8,
                      textAlign:
                        "center",
                    }}
                  >
                    Yes
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #eef2f7",
                      padding: 8,
                      textAlign:
                        "center",
                    }}
                  >
                    Varies
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
                    Output
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #eef2f7",
                      padding: 8,
                      textAlign:
                        "center",
                    }}
                  >
                    PNG
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #eef2f7",
                      padding: 8,
                      textAlign:
                        "center",
                    }}
                  >
                    Varies
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
                    Background Options
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #eef2f7",
                      padding: 8,
                      textAlign:
                        "center",
                    }}
                  >
                    Transparent / White / Blue / Red
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #eef2f7",
                      padding: 8,
                      textAlign:
                        "center",
                    }}
                  >
                    Varies
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* FAQ */}

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Frequently Asked Questions
          </h2>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius:
                10,
              padding:
                "12px 14px",
              marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor:
                  "pointer",
              }}
            >
              Photo ka background kaise remove karein?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              JPG, PNG ya WebP photo upload karein.
              Browser-based AI background remove karega.
              Uske baad aap background choose karke PNG
              download kar sakte hain.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius:
                10,
              padding:
                "12px 14px",
              marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor:
                  "pointer",
              }}
            >
              Kya Photoshop ke bina background remove ho sakta hai?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Haan. NEXORA modern web browser mein directly
              work karta hai, isliye Photoshop ki zarurat nahi hai.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius:
                10,
              padding:
                "12px 14px",
              marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor:
                  "pointer",
              }}
            >
              Kya transparent PNG bana sakte hain?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Haan. Background remove hone ke baad
              Transparent option select karein aur PNG
              download karein.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius:
                10,
                padding:
                  "12px 14px",
                marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor:
                  "pointer",
              }}
            >
              Kya passport photo ke liye white background bana sakte hain?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Haan. Background remove karne ke baad
              White option choose karein. Passport aur visa
              photo requirements country aur document ke
              hisaab se different ho sakti hain.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius:
                10,
              padding:
                "12px 14px",
              marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor:
                  "pointer",
              }}
            >
              Kya ye iPhone aur Android par work karta hai?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Haan. Tool modern mobile aur desktop browsers
              ke liye designed hai. Processing speed device
              aur image par depend karti hai.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius:
                10,
              padding:
                "12px 14px",
              marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor:
                  "pointer",
              }}
            >
              Kya background remover free hai?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Haan. NEXORA Background Remover free use
              kiya ja sakta hai aur account ya sign-up
              required nahi hai.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius:
                10,
              padding:
                "12px 14px",
              marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor:
                  "pointer",
              }}
            >
              Kya meri photo server par upload hoti hai?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Background-removal processing browser ke andar
              hoti hai, NEXORA ke image-processing server par nahi.
              AI package required model resources external CDN
              se download kar sakta hai.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius:
                10,
              padding:
                "12px 14px",
              marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor:
                  "pointer",
              }}
            >
              Kaunse image formats supported hain?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              JPG, PNG aur WebP images supported hain.
              Bahut large images processing ke time resize
              ho sakti hain.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #eef2f7",
              borderRadius:
                10,
                padding:
                  "12px 14px",
                marginTop: 10,
            }}
          >
            <summary
              style={{
                fontWeight: 700,
                cursor:
                  "pointer",
              }}
            >
              Kya result bina watermark ke download kar sakte hain?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Haan. NEXORA generated PNG par apna watermark
              add nahi karta.
            </p>
          </details>

          {/* INTERNAL LINKS */}

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            NEXORA Ke Aur Free Tools
          </h2>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 10,
              marginTop: 12,
            }}
          >
            <a
              href="/passport-photo-maker"
              style={{
                textAlign:
                  "center",
                padding: 14,
                background:
                  "#0f172a",
                color:
                  "#fff",
                borderRadius:
                  10,
                textDecoration:
                  "none",
                fontWeight: 700,
              }}
            >
              Passport Photo Maker →
            </a>

            <a
              href="/compress-image-to-20kb"
              style={{
                textAlign:
                  "center",
                padding: 14,
                background:
                  "#2563eb",
                color:
                  "#fff",
                borderRadius:
                  10,
                textDecoration:
                  "none",
                fontWeight: 700,
              }}
            >
              Compress to 20KB →
            </a>

            <a
              href="/qr-generator"
              style={{
                textAlign:
                  "center",
                padding: 14,
                background:
                  "#7c3aed",
                color:
                  "#fff",
                borderRadius:
                  10,
                textDecoration:
                  "none",
                fontWeight: 700,
              }}
            >
              QR Generator →
            </a>

            <a
              href="/"
              style={{
                textAlign:
                  "center",
                padding: 14,
                background:
                  "#f1f5f9",
                color:
                  "#0f172a",
                borderRadius:
                  10,
                textDecoration:
                  "none",
                fontWeight: 700,
              }}
            >
              All Tools →
            </a>
          </div>
        </div>

        {/* AUTHOR */}

        <p
          style={{
            textAlign:
              "center",
            fontSize: 13,
            color:
              "#94a3b8",
            margin:
              "30px 0 10px",
            lineHeight:
              1.6,
          }}
        >
          By{" "}
          <b
            style={{
              color:
                "#0f172a",
            }}
          >
            Ayush Chauhan
          </b>{" "}
          • Tool: NEXORA
          <br />
          Last Updated: 14 Nov 2026 • Free & Browser-Based
        </p>
      </main>

      {/* FOOTER */}

      <footer
        style={{
          background:
            "#0f172a",
          color:
            "#cbd5e1",
          padding:
            "20px 16px",
          textAlign:
            "center",
          fontSize: 13,
        }}
      >
        <b
          style={{
            color:
              "#fff",
            fontSize: 16,
          }}
        >
          NEXORA
        </b>

        <p
          style={{
            margin:
              "6px 0 0",
          }}
        >
          Free Tools. Simple Solutions. •{" "}
          <a
            href="/about"
            style={{
              color:
                "#cbd5e1",
            }}
          >
            About
          </a>{" "}
          •{" "}
          <a
            href="/privacy-policy"
            style={{
              color:
                "#cbd5e1",
            }}
          >
            Privacy
          </a>{" "}
          •{" "}
          <a
            href="/contact"
            style={{
              color:
                "#cbd5e1",
            }}
          >
            Contact
          </a>
        </p>
      </footer>
    </div>
  );
}
