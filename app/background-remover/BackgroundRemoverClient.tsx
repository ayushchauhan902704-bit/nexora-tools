"use client";

import { useEffect, useRef, useState } from "react";

type BackgroundColor = "transparent" | "white" | "#6366f1" | "#ef4444";

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const blobRef = useRef<Blob | null>(null);

  const smoothProgressTargetRef = useRef(0);
  const smoothProgressDisplayRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const loadingRef = useRef(false);
  const objectUrlRef = useRef<string | null>(null);

  // Local npm package loader.
  // IMPORTANT: This does NOT use https://esm.sh
  const libraryPromiseRef =
    useRef<Promise<any> | null>(null);

  const setProgressTarget = (value: number) => {
    const safeValue = Math.max(
      0,
      Math.min(100, value)
    );

    smoothProgressTargetRef.current = safeValue;

    if (animationFrameRef.current !== null) {
      return;
    }

    const animate = () => {
      const current =
        smoothProgressDisplayRef.current;

      const target =
        smoothProgressTargetRef.current;

      let next = current;

      if (Math.abs(target - current) < 0.5) {
        next = target;
      } else {
        next =
          current + (target - current) * 0.12;
      }

      smoothProgressDisplayRef.current = next;
      setProgress(Math.round(next));

      if (Math.abs(target - next) >= 0.5) {
        animationFrameRef.current =
          requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current =
      requestAnimationFrame(animate);
  };

  const finishProgress = async () => {
    setProgressTarget(100);

    await new Promise<void>((resolve) => {
      const check = () => {
        if (
          smoothProgressDisplayRef.current >=
          99.5
        ) {
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

  /**
   * Loads @imgly/background-removal from the local
   * node_modules package.
   *
   * Vercel/Webpack can resolve this package normally.
   * There is NO external https://esm.sh import.
   */
  const loadLibrary = async (): Promise<any> => {
    if (libraryPromiseRef.current) {
      return libraryPromiseRef.current;
    }

    libraryPromiseRef.current =
      import("@imgly/background-removal")
        .then((module) => {
          const removeBackground =
            module.default;

          if (
            typeof removeBackground !==
            "function"
          ) {
            throw new Error(
              "Background removal library failed to load."
            );
          }

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

  const redraw = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;

    if (!canvas || !img) {
      return;
    }

    if (!img.complete || !img.naturalWidth) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (bgColor !== "transparent") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    ctx.drawImage(
      img,
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  useEffect(() => {
    redraw();
  }, [bgColor, showPreview]);

  const prepareImage = async (
    file: File
  ): Promise<File | Blob> => {
    const objectUrl =
      URL.createObjectURL(file);

    try {
      const img = new Image();

      await new Promise<void>(
        (resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () =>
            reject(
              new Error(
                "Unable to read the image."
              )
            );

          img.src = objectUrl;
        }
      );

      const maxDimension = 2400;
      const maxPixels = 12_000_000;

      let width = img.naturalWidth;
      let height = img.naturalHeight;

      const currentPixels =
        width * height;

      const dimensionScale =
        Math.min(
          1,
          maxDimension / width,
          maxDimension / height
        );

      const pixelScale =
        currentPixels > maxPixels
          ? Math.sqrt(
              maxPixels / currentPixels
            )
          : 1;

      const scale = Math.min(
        dimensionScale,
        pixelScale
      );

      if (
        scale >= 1 &&
        file.size <= 8 * 1024 * 1024
      ) {
        return file;
      }

      width = Math.max(
        1,
        Math.round(width * scale)
      );

      height = Math.max(
        1,
        Math.round(height * scale)
      );

      const canvas =
        document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx =
        canvas.getContext("2d");

      if (!ctx) {
        return file;
      }

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      const blob =
        await new Promise<Blob | null>(
          (resolve) => {
            canvas.toBlob(
              (result) =>
                resolve(result),
              "image/jpeg",
              0.9
            );
          }
        );

      if (!blob) {
        return file;
      }

      return new File(
        [blob],
        "nexora-input.jpg",
        {
          type: "image/jpeg",
          lastModified:
            Date.now(),
        }
      );
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const validateFile = (
    file: File
  ): boolean => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      setStatus(
        "Please upload a JPG, PNG, or WebP image."
      );

      return false;
    }

    if (
      file.size >
      25 * 1024 * 1024
    ) {
      setStatus(
        "Image size must be 25 MB or less."
      );

      return false;
    }

    return true;
  };

  const handleFile = async (
    file: File
  ) => {
    if (!validateFile(file)) {
      return;
    }

    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    cleanupObjectUrl();

    setIsProcessing(true);
    setShowPreview(false);
    setInfo("");
    setUploadText(file.name);
    setStatus(
      "Preparing your image..."
    );

    smoothProgressDisplayRef.current = 0;
    smoothProgressTargetRef.current = 0;
    setProgress(0);

    try {
      setStatus(
        "Loading AI background remover..."
      );

      setProgressTarget(5);

      const removeBackground =
        await loadLibrary();

      setProgressTarget(15);

      setStatus(
        "Preparing image..."
      );

      const preparedFile =
        await prepareImage(file);

      setProgressTarget(30);

      setStatus(
        "Removing background with AI..."
      );

      const result =
        await removeBackground(
          preparedFile,
          {
            progress: (
              _key: string,
              current: number,
              total: number
            ) => {
              let percent = 0;

              if (
                total > 0
              ) {
                percent =
                  (current / total) *
                  100;
              }

              const mapped =
                30 +
                percent * 0.69;

              setProgressTarget(
                mapped
              );
            },
          }
        );

      setProgressTarget(99);

      setStatus(
        "Finalizing your image..."
      );

      const resultBlob =
        result instanceof Blob
          ? result
          : new Blob(
              [result],
              {
                type: "image/png",
              }
            );

      blobRef.current =
        resultBlob;

      cleanupObjectUrl();

      const resultUrl =
        URL.createObjectURL(
          resultBlob
        );

      objectUrlRef.current =
        resultUrl;

      const previewImage =
        new Image();

      await new Promise<void>(
        (resolve, reject) => {
          previewImage.onload =
            () => resolve();

          previewImage.onerror =
            () =>
              reject(
                new Error(
                  "Could not load the processed image."
                )
              );

          previewImage.src =
            resultUrl;
        }
      );

      imgRef.current =
        previewImage;

      setShowPreview(true);

      setInfo(
        `${previewImage.naturalWidth} × ${previewImage.naturalHeight} • PNG • No Watermark`
      );

      await finishProgress();

      setStatus(
        "Background removed successfully!"
      );
    } catch (error) {
      console.error(
        "Background removal error:",
        error
      );

      setProgressTarget(0);

      setStatus(
        "Something went wrong. Please try another image."
      );

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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleUploadClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  const download = () => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const url =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          `nexora-background-removed-${Date.now()}.png`;

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
          url
        );
      },
      "image/png"
    );
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

    setStatus(
      "Upload a photo to start"
    );

    setUploadText(
      "Tap to Upload Photo"
    );

    setBgColor(
      "transparent"
    );

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "#f8fafc",
        color: "#111827",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background:
            "rgba(255,255,255,0.92)",
          backdropFilter:
            "blur(12px)",
          borderBottom:
            "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin:
              "0 auto",
            padding:
              "14px 20px",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            gap: 16,
          }}
        >
          <a
            href="/"
            style={{
              textDecoration:
                "none",
              fontWeight: 900,
              fontSize: 22,
              color: "#111827",
            }}
          >
            NEXORA
          </a>

          <nav
            style={{
              display:
                "flex",
              gap: 16,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <a
              href="/"
              style={{
                color:
                  "#374151",
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
                  "#374151",
                textDecoration:
                  "none",
              }}
            >
              Passport Photo
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: 900,
          margin:
            "0 auto",
          padding:
            "54px 20px 28px",
          textAlign:
            "center",
        }}
      >
        <div
          style={{
            display:
              "inline-flex",
            alignItems:
              "center",
            gap: 8,
            padding:
              "8px 14px",
            borderRadius: 999,
            background:
              "#eef2ff",
            color:
              "#4f46e5",
            fontWeight: 800,
            fontSize: 12,
            letterSpacing:
              "0.04em",
          }}
        >
          {libReady
            ? "FREE • HD PNG • NO WATERMARK • AI READY ✅"
            : "FREE • HD PNG • NO WATERMARK • AI READY"}
        </div>

        <h1
          style={{
            fontSize:
              "clamp(38px, 8vw, 68px)",
            lineHeight:
              1.05,
            margin:
              "20px 0 14px",
            fontWeight: 950,
            letterSpacing:
              "-0.04em",
          }}
        >
          Background Remover
        </h1>

        <p
          style={{
            maxWidth: 720,
            margin:
              "0 auto",
            fontSize: 18,
            lineHeight: 1.7,
            color:
              "#64748b",
          }}
        >
          Remove image backgrounds automatically with
          AI. Create clean transparent PNGs directly in
          your browser.
        </p>
      </section>

      {/* TOOL */}
      <section
        style={{
          maxWidth: 980,
          margin:
            "0 auto",
          padding:
            "10px 20px 60px",
        }}
      >
        <div
          style={{
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius: 24,
            padding:
              "26px",
            boxShadow:
              "0 20px 60px rgba(15,23,42,0.08)",
          }}
        >
          {!showPreview ? (
            <div
              onClick={
                handleUploadClick
              }
              style={{
                minHeight: 300,
                border:
                  "2px dashed #cbd5e1",
                borderRadius: 20,
                display:
                  "flex",
                flexDirection:
                  "column",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                textAlign:
                  "center",
                padding:
                  "30px 20px",
                cursor:
                  isProcessing
                    ? "not-allowed"
                    : "pointer",
                background:
                  "#f8fafc",
              }}
            >
              <div
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: 20,
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  background:
                    "#eef2ff",
                  color:
                    "#4f46e5",
                  fontSize: 34,
                  marginBottom: 16,
                }}
              >
                ✨
              </div>

              <h2
                style={{
                  margin:
                    "0 0 8px",
                  fontSize: 23,
                  fontWeight: 900,
                }}
              >
                {uploadText}
              </h2>

              <p
                style={{
                  margin:
                    "0 0 8px",
                  color:
                    "#64748b",
                }}
              >
                JPG, PNG or WebP • Up to 25 MB
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color:
                    "#94a3b8",
                }}
              >
                Processing happens in your browser.
                No sign-up required.
              </p>

              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleInputChange
                }
                style={{
                  display:
                    "none",
                }}
              />
            </div>
          ) : (
            <div>
              <div
                style={{
                  display:
                    "flex",
                  flexWrap:
                    "wrap",
                  gap: 12,
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom: 18,
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: 20,
                    }}
                  >
                    Your Result
                  </div>

                  <div
                    style={{
                      marginTop: 5,
                      color:
                        "#64748b",
                      fontSize: 14,
                    }}
                  >
                    {info}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    resetTool
                  }
                  style={{
                    border:
                      "1px solid #cbd5e1",
                    background:
                      "#ffffff",
                    borderRadius: 10,
                    padding:
                      "10px 14px",
                    fontWeight: 800,
                    cursor:
                      "pointer",
                  }}
                >
                  Remove Another Background
                </button>
              </div>

              <div
                style={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: 18,
                  padding: 14,
                  background:
                    "#f8fafc",
                  overflow:
                    "auto",
                }}
              >
                <canvas
                  ref={
                    canvasRef
                  }
                  style={{
                    display:
                      "block",
                    width:
                      "100%",
                    height:
                      "auto",
                    maxHeight:
                      650,
                    objectFit:
                      "contain",
                    borderRadius:
                      12,
                  }}
                />
              </div>

              {/* BACKGROUND OPTIONS */}
              <div
                style={{
                  marginTop: 22,
                }}
              >
                <div
                  style={{
                    fontWeight: 900,
                    marginBottom: 10,
                  }}
                >
                  Background
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    flexWrap:
                      "wrap",
                    gap: 10,
                  }}
                >
                  {(
                    [
                      [
                        "transparent",
                        "Transparent",
                      ],
                      [
                        "white",
                        "White - Passport",
                      ],
                      [
                        "#6366f1",
                        "Blue - Visa",
                      ],
                      [
                        "#ef4444",
                        "Red",
                      ],
                    ] as const
                  ).map(
                    ([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setBgColor(
                            value
                          )
                        }
                        style={{
                          border:
                            bgColor ===
                            value
                              ? "2px solid #4f46e5"
                              : "1px solid #cbd5e1",
                          background:
                            "#ffffff",
                          borderRadius:
                            12,
                          padding:
                            "10px 14px",
                          fontWeight:
                            800,
                          cursor:
                            "pointer",
                        }}
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={
                  download
                }
                style={{
                  width:
                    "100%",
                  marginTop: 22,
                  border: 0,
                  borderRadius: 14,
                  padding:
                    "16px 18px",
                  background:
                    "#111827",
                  color:
                    "#ffffff",
                  fontSize: 16,
                  fontWeight: 900,
                  cursor:
                    "pointer",
                }}
              >
                Download PNG FREE
              </button>
            </div>
          )}

          {/* PROGRESS */}
          {isProcessing && (
            <div
              style={{
                marginTop: 22,
              }}
            >
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  gap: 10,
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                <span>
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
                  height: 10,
                  borderRadius: 999,
                  background:
                    "#e5e7eb",
                  overflow:
                    "hidden",
                }}
              >
                <div
                  style={{
                    width:
                      `${progress}%`,
                    height:
                      "100%",
                    background:
                      "#4f46e5",
                    borderRadius:
                      999,
                    transition:
                      "width 120ms linear",
                  }}
                />
              </div>
            </div>
          )}

          {!isProcessing &&
            !showPreview && (
              <p
                style={{
                  margin:
                    "18px 0 0",
                  textAlign:
                    "center",
                  color:
                    "#64748b",
                  fontSize: 14,
                }}
              >
                {status}
              </p>
            )}
        </div>
      </section>

      {/* MONEY / TRUST SECTION */}
      <section
        style={{
          maxWidth: 980,
          margin:
            "0 auto",
          padding:
            "0 20px 55px",
        }}
      >
        <div
          style={{
            background:
              "#111827",
            color:
              "#ffffff",
            borderRadius: 22,
            padding:
              "30px 24px",
            textAlign:
              "center",
          }}
        >
          <h2
            style={{
              margin:
                "0 0 10px",
              fontSize: 28,
            }}
          >
            Remove Backgrounds for Free
          </h2>

          <p
            style={{
              maxWidth: 700,
              margin:
                "0 auto",
              color:
                "#cbd5e1",
              lineHeight: 1.7,
            }}
          >
            NEXORA lets you remove backgrounds without
            watermarks, account creation, or complicated
            software.
          </p>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section
        style={{
          maxWidth: 980,
          margin:
            "0 auto",
          padding:
            "0 20px 60px",
        }}
      >
        <article
          style={{
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius: 20,
            padding:
              "28px",
            lineHeight: 1.8,
            color:
              "#475569",
          }}
        >
          <h2
            style={{
              color:
                "#111827",
              fontSize: 30,
              marginTop: 0,
            }}
          >
            Free AI Background Remover
          </h2>

          <p>
            NEXORA Background Remover is a free online
            tool for removing backgrounds from photos.
            Upload a JPG, PNG, or WebP image and the AI
            background-removal technology automatically
            separates the main subject from the background.
          </p>

          <p>
            The processed result is provided as a PNG so
            transparent backgrounds can be preserved.
            You can also choose a white, blue, or red
            background when you need a ready-to-use image.
          </p>

          <h3
            style={{
              color:
                "#111827",
            }}
          >
            Background Removal for Passport and Visa Photos
          </h3>

          <p>
            A white or colored background can be useful
            when preparing images for passport, visa,
            identification, application, and document
            purposes. Always check the exact photo
            requirements of the organization or country
            before submitting an image.
          </p>

          <h3
            style={{
              color:
                "#111827",
            }}
          >
            Private Browser-Based Processing
          </h3>

          <p>
            Image processing is performed in your browser
            using the background-removal technology.
            NEXORA does not need to send your original
            image to a NEXORA image-processing server.
            The AI package may download required model
            resources from its configured external resources.
          </p>

          <h3
            style={{
              color:
                "#111827",
            }}
          >
            No Watermark
          </h3>

          <p>
            Download your processed PNG without a NEXORA
            watermark. The tool is designed to make
            background removal simple on phones, tablets,
            and desktop browsers.
          </p>

          <img
            src="/background-remover-example.jpg"
            alt="Background remover example"
            style={{
              display:
                "block",
              width:
                "100%",
              maxWidth: 760,
              height:
                "auto",
              margin:
                "24px auto",
              borderRadius: 16,
            }}
          />
        </article>
      </section>

      {/* COMPARISON */}
      <section
        style={{
          maxWidth: 980,
          margin:
            "0 auto",
          padding:
              "0 20px 60px",
        }}
      >
        <div
          style={{
            background:
              "#ffffff",
            border:
              "1px solid #e5e7eb",
            borderRadius: 20,
            overflow:
              "hidden",
          }}
        >
          <div
            style={{
              padding:
                "22px 24px",
            }}
          >
            <h2
              style={{
                margin:
                  0,
                fontSize: 28,
                color:
                  "#111827",
              }}
            >
              NEXORA Background Remover Features
            </h2>
          </div>

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
                borderCollapse:
                  "collapse",
                minWidth:
                  620,
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign:
                        "left",
                      padding:
                        "14px 20px",
                      borderTop:
                        "1px solid #e5e7eb",
                      background:
                        "#f8fafc",
                    }}
                  >
                    Feature
                  </th>

                  <th
                    style={{
                      textAlign:
                        "left",
                      padding:
                        "14px 20px",
                      borderTop:
                        "1px solid #e5e7eb",
                      background:
                        "#f8fafc",
                    }}
                  >
                    NEXORA
                  </th>
                </tr>
              </thead>

              <tbody>
                {[
                  [
                    "Free to use",
                    "Yes",
                  ],
                  [
                    "AI background removal",
                    "Yes",
                  ],
                  [
                    "Transparent PNG",
                    "Yes",
                  ],
                  [
                    "No watermark",
                    "Yes",
                  ],
                  [
                    "JPG / PNG / WebP",
                    "Yes",
                  ],
                  [
                    "Maximum upload size",
                    "25 MB",
                  ],
                  [
                    "Browser-based image processing",
                    "Yes",
                  ],
                ].map(
                  ([feature, value]) => (
                    <tr
                      key={
                        feature
                      }
                    >
                      <td
                        style={{
                          padding:
                            "14px 20px",
                          borderTop:
                            "1px solid #e5e7eb",
                        }}
                      >
                        {feature}
                      </td>

                      <td
                        style={{
                          padding:
                            "14px 20px",
                          borderTop:
                            "1px solid #e5e7eb",
                          fontWeight:
                            800,
                        }}
                      >
                        {value}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          maxWidth: 980,
          margin:
            "0 auto",
          padding:
            "0 20px 60px",
        }}
      >
        <h2
          style={{
            fontSize: 32,
            color:
              "#111827",
          }}
        >
          Frequently Asked Questions
        </h2>

        <div>
          <details
            style={{
              border:
                "1px solid #e5e7eb",
              borderRadius:
                10,
              padding:
                "12px 14px",
              marginTop: 10,
              background:
                "#ffffff",
            }}
          >
            <summary
              style={{
                cursor:
                  "pointer",
                fontWeight:
                  800,
              }}
            >
              Is NEXORA Background Remover free?
            </summary>

            <p>
              Yes. NEXORA Background Remover is available
              for free without requiring an account.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #e5e7eb",
              borderRadius:
                10,
              padding:
                "12px 14px",
              marginTop: 10,
              background:
                "#ffffff",
            }}
          >
            <summary
              style={{
                cursor:
                  "pointer",
                fontWeight:
                  800,
              }}
            >
              What image formats are supported?
            </summary>

            <p>
              JPG, PNG, and WebP images are supported.
              The maximum upload size is 25 MB.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #e5e7eb",
              borderRadius:
                10,
              padding:
                "12px 14px",
              marginTop: 10,
              background:
                "#ffffff",
            }}
          >
            <summary
              style={{
                cursor:
                  "pointer",
                fontWeight:
                  800,
              }}
            >
              Can I make the background transparent?
            </summary>

            <p>
              Yes. The processed image can be downloaded
              as a PNG with a transparent background.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #e5e7eb",
              borderRadius:
                10,
              padding:
                "12px 14px",
              marginTop: 10,
              background:
                "#ffffff",
            }}
          >
            <summary
              style={{
                cursor:
                  "pointer",
                fontWeight:
                800,
              }}
            >
              Can I use a white background?
            </summary>

            <p>
              Yes. Select “White - Passport” after the
              background has been removed.
            </p>
          </details>

          <details
            style={{
              border:
                "1px solid #e5e7eb",
              borderRadius:
                10,
              padding:
                "12px 14px",
              marginTop: 10,
              background:
                "#ffffff",
            }}
          >
            <summary
              style={{
                cursor:
                  "pointer",
                fontWeight:
                  800,
              }}
            >
              Does NEXORA add a watermark?
            </summary>

            <p>
              No. The downloaded PNG does not include a
              NEXORA watermark.
            </p>
          </details>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section
        style={{
          maxWidth: 980,
          margin:
            "0 auto",
          padding:
            "0 20px 50px",
        }}
      >
        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {[
            [
              "/passport-photo-maker",
              "Passport Photo Maker",
            ],
            [
              "/compress-image-to-20kb",
              "Compress Image to 20KB",
            ],
            [
              "/qr-generator",
              "QR Generator",
            ],
            [
              "/",
              "All NEXORA Tools",
            ],
          ].map(
            ([href, label]) => (
              <a
                key={href}
                href={href}
                style={{
                  textDecoration:
                    "none",
                  background:
                    "#ffffff",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius:
                    14,
                  padding:
                    "16px",
                  color:
                    "#111827",
                  fontWeight:
                    800,
                }}
              >
                {label}
              </a>
            )
          )}
        </div>
      </section>

      {/* AUTHOR */}
      <section
        style={{
          maxWidth: 980,
          margin:
            "0 auto",
          padding:
            "0 20px 40px",
          textAlign:
            "center",
          color:
            "#64748b",
          fontSize: 14,
        }}
      >
        <p>
          By Ayush Chauhan • Tool: NEXORA
        </p>

        <p>
          Last Updated: 14 Nov 2026 • Free &
          Browser-Based
        </p>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop:
            "1px solid #e5e7eb",
          background:
            "#ffffff",
          padding:
            "26px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin:
              "0 auto",
            display:
              "flex",
            flexWrap:
              "wrap",
            justifyContent:
              "center",
            gap: 18,
            fontSize: 14,
          }}
        >
          <a
            href="/about"
            style={{
              color:
                "#64748b",
              textDecoration:
                "none",
            }}
          >
            About
          </a>

          <a
            href="/privacy-policy"
            style={{
              color:
                "#64748b",
              textDecoration:
                "none",
            }}
          >
            Privacy Policy
          </a>

          <a
            href="/contact"
            style={{
              color:
                "#64748b",
              textDecoration:
                "none",
            }}
          >
            Contact
          </a>
        </div>
      </footer>
    </main>
  );
}
