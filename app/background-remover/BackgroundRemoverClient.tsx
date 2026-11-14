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
    "Upload a photo to start"
  );

  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [info, setInfo] = useState("");
  const [uploadText, setUploadText] =
    useState("Tap to Upload Photo");

  const [isProcessing, setIsProcessing] = useState(false);
  const [libReady, setLibReady] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const blobRef = useRef<Blob | null>(null);

  /*
   * Progress system
   *
   * targetProgress = the actual stage/progress we want to reach.
   * displayedProgress = the number shown to the user.
   *
   * The displayed progress moves smoothly toward the target
   * instead of jumping randomly.
   */
  const progressTargetRef = useRef(0);
  const progressDisplayRef = useRef(0);
  const progressAnimationRef =
    useRef<number | null>(null);

  const loadingRef = useRef(false);
  const objectUrlRef =
    useRef<string | null>(null);

  /*
   * Smooth progress animation.
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

        /*
         * Move continuously toward the target.
         * Small differences use smaller steps so
         * the progress feels smooth.
         */
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

  /*
   * Set a new progress target.
   */
  const setProgressTarget = (
    value: number
  ) => {
    progressTargetRef.current =
      Math.max(
        0,
        Math.min(100, value)
      );
  };

  /*
   * Immediately finish progress.
   */
  const finishProgress = () => {
    progressTargetRef.current = 100;
    progressDisplayRef.current = 100;
    setProgress(100);
  };

  /*
   * Load the AI library safely.
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
              "Browser environment is required."
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

        /*
         * If another request is already
         * loading the library, wait for it.
         */
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
                      "The AI model could not be loaded. Please check your internet connection and try again."
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

            setLibReady(
              true
            );

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
                  "The AI library loaded without exposing the remover."
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
                "The AI model could not be loaded. Please try again."
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

        /*
         * Safety timeout.
         */
        timeout =
          window.setTimeout(
            () => {
              finishError(
                new Error(
                  "Loading the AI model took too long. Please try again."
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
   * Clean up temporary object URLs.
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
   * Redraw processed image
   * on the selected background.
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

  /*
   * Redraw whenever the
   * background changes.
   */
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
   * Safely prepare very large images.
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

            /*
             * Normal-size images are kept
             * in their original format.
             */
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

            /*
             * Large inputs are prepared as JPEG
             * to reduce browser memory usage.
             * The final download remains PNG.
             */
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
   * Validate selected image.
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
      return "Please choose a JPG, PNG, or WebP image.";
    }

    const maxFileSize =
      25 *
      1024 *
      1024;

    if (
      file.size >
      maxFileSize
    ) {
      return "This image is larger than 25 MB. Please choose a smaller image.";
    }

    return null;
  };

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
          "Tap to Upload Photo"
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
        "⏳ AI Processing Started..."
      );

      setStatus(
        "Starting AI background removal..."
      );

      progressDisplayRef.current =
        0;

      progressTargetRef.current =
        0;

      setProgress(0);

      /*
       * Reset file input so the
       * same image can be selected again.
       */
      if (
        fileRef.current
      ) {
        fileRef.current.value =
          "";
      }

      /*
       * Phase 1:
       * Start smooth loading progress.
       */
      setProgressTarget(
        8
      );

      try {
        /*
         * Phase 2:
         * Load AI library.
         */
        setStatus(
          "Loading AI resources..."
        );

        setProgressTarget(
          32
        );

        const removeBg =
          await loadLibrary();

        /*
         * AI library is ready.
         */
        setStatus(
          "AI resources ready. Preparing your image..."
        );

        setProgressTarget(
          50
        );

        /*
         * Prepare image.
         */
        const preparedFile =
          await prepareImage(
            file
          );

        setStatus(
          "Starting background removal..."
        );

        setProgressTarget(
          64
        );

        /*
         * Actual AI processing.
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
                 * Map actual AI progress
                 * from 64% to 99%.
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
                    `Removing the background... ${mappedPct}%`
                  );
                } else if (
                  mappedPct <
                  96
                ) {
                  setStatus(
                    `Refining the result... ${mappedPct}%`
                  );
                } else {
                  setStatus(
                    "Finishing your image..."
                  );
                }
              },
            }
          );

        /*
         * Processing completed.
         */
        finishProgress();

        setStatus(
          "✅ Background removed successfully"
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
              "✅ Background Removed"
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
              "❌ The processed image could not be displayed. Please try again."
            );
          };

        img.src = url;
      } catch (
        error
      ) {
        console.error(
          "NEXORA Background Remover Error:",
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
            : "Something went wrong while processing the image.";

        setStatus(
          `❌ ${message}`
        );

        setUploadText(
          "Tap to Upload Photo"
        );
      }
    };

  /*
   * Download displayed canvas
   * as PNG.
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
          "Please process an image first."
        );

        return;
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setStatus(
              "❌ Could not create the PNG. Please try again."
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
            "✅ PNG downloaded successfully"
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
        "Upload a photo to start"
      );

      setUploadText(
        "Tap to Upload Photo"
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
            Background
            <br />
            Remover
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
            Remove image backgrounds FREE
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
            Upload Your Photo
          </p>

          {/* UPLOAD */}

          <label
            htmlFor="background-remover-file"
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
              id="background-remover-file"
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
                The first use may take longer while AI resources are prepared.
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
            Choose Background
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
                Download PNG FREE ↓
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
                Remove Another Background
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
                Remove Background FREE →
              </button>
            )}
        </div>

        <div
          style={{
            height: 30,
          }}
        />

        {/* MONEY SECTION */}

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
            💡 A Simple Way to Use This Tool for Your Work
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
            If you help people prepare photos for applications,
            listings, documents, or social media, you can use this
            free background-removal tool as part of your workflow.
            Always follow the official photo requirements for the
            specific document or service.
          </p>
        </div>

        <div
          style={{
            height: 30,
          }}
        />

        {/* SEO CONTENT */}

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
            NEXORA Background Remover is a free online tool
            for removing image backgrounds directly in your browser.
            Create a transparent PNG or replace the original
            background with white, blue, or red. No account or
            sign-up is required.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            How to Remove a Background From an Image
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
            Upload a JPG, PNG, or WebP image.
            <br />

            <b>Step 2:</b>{" "}
            The browser-based AI processes the image
            and removes the background.
            <br />

            <b>Step 3:</b>{" "}
            Choose Transparent, White, Blue, or Red.
            <br />

            <b>Step 4:</b>{" "}
            Download the processed PNG without a NEXORA watermark.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Make a Transparent PNG
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            Select <b>Transparent</b> after the background
            has been removed. The result is exported as a PNG,
            making it useful for product images, profile graphics,
            presentations, thumbnails, websites, and other designs.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            White Background for Passport Photos
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            You can select the <b>White - Passport</b> option
            to create a white-background image after removing
            the original background. Passport and visa photo
            requirements differ by country, document type,
            dimensions, lighting, and background rules, so
            always verify the official requirements before
            submitting a photo.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Background Remover for iPhone and Android
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            NEXORA is designed for modern browsers on mobile
            and desktop devices. You can upload a photo from
            your phone without installing a separate application.
            Processing performance can vary depending on your
            device, browser, image dimensions, and available memory.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Is Background Removal Private?
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            The background-removal processing is performed
            in your browser rather than through a NEXORA
            image-processing server. The AI package can download
            model resources from an external CDN when required.
            This means the image-processing workflow is designed
            to happen locally on your device.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Supported Image Formats
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            The tool accepts common <b>JPG, PNG, and WebP</b>
            image files. Very large images may be resized during
            browser processing to help prevent excessive memory
            usage on mobile devices.
          </p>

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Background Remover vs Manual Editing
          </h2>

          <p
            style={{
              color:
                "#475569",
              lineHeight:
                1.8,
            }}
          >
            Manual background removal can require selection tools,
            masks, layers, and repeated edge adjustments. An
            automated background remover can save time when you
            need to isolate a person, product, object, or other
            foreground subject quickly.
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
              src="/background-remover-example.webp"
              alt="Background remover before and after example"
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

          {/* COMPARISON */}

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            NEXORA Background Remover Features
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
                    Typical Online Tools
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
                    Browser processing
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
                    Background choices
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
              How do I remove a background from a photo?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Upload a JPG, PNG, or WebP image.
              The browser-based AI removes the background,
              after which you can choose a background and
              download the PNG.
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
              Can I remove a background without Photoshop?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Yes. NEXORA works directly in a modern
              web browser, so Photoshop is not required.
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
              Can I make a transparent PNG?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Yes. Choose Transparent after background
              removal and download the result as a PNG.
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
              Can I create a white background for a passport photo?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Yes. Choose White after removing the original
              background. Always verify the official photo
              requirements for your country and document.
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
              Does it work on iPhone and Android?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Yes. The tool is designed for modern mobile
              and desktop browsers. Processing speed depends
              on the device and image.
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
              Is the background remover free?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Yes. NEXORA Background Remover is available
              to use for free without requiring an account or sign-up.
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
              Is my photo uploaded to a server?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Background-removal processing is performed
              in the browser rather than through a NEXORA
              image-processing server. The AI package may
              download model resources from an external CDN.
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
              What image formats are supported?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              JPG, PNG, and WebP images are supported.
              Very large images may be resized during processing
              to reduce browser memory usage.
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
              Can I download the result without a watermark?
            </summary>

            <p
              style={{
                color:
                  "#475569",
              }}
            >
              Yes. NEXORA does not add a watermark to the
              generated PNG.
            </p>
          </details>

          {/* INTERNAL LINKS */}

          <h2
            style={{
              fontSize: 21,
              marginTop: 26,
            }}
          >
            Try More Free NEXORA Tools
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

        {/* AUTHOR / UPDATE */}

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
