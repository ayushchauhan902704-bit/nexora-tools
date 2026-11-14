"use client";

import { useEffect, useRef, useState } from "react";

type BackgroundColor =
  | "transparent"
  | "#ffffff"
  | "#6366f1"
  | "#ef4444";

declare global {
  interface Window {
    __nexoraRemoveBg?: any;
    __nexoraRemoveBgLoading?: Promise<any>;
  }
}

export default function BackgroundRemoverClient() {
  const [bgColor, setBgColor] =
    useState<BackgroundColor>("transparent");

  const [status, setStatus] = useState(
    "ارفع صورة للبدء"
  );

  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [info, setInfo] = useState("");
  const [uploadText, setUploadText] =
    useState("اختيار صورة");
  const [isProcessing, setIsProcessing] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const imageRef =
    useRef<HTMLImageElement | null>(null);

  const resultBlobRef =
    useRef<Blob | null>(null);

  const progressTargetRef =
    useRef(0);

  const progressDisplayRef =
    useRef(0);

  const progressAnimationRef =
    useRef<number | null>(null);

  const objectUrlRef =
    useRef<string | null>(null);

  const animateProgress = () => {
    const current =
      progressDisplayRef.current;

    const target =
      progressTargetRef.current;

    if (
      Math.abs(target - current) < 0.4
    ) {
      progressDisplayRef.current =
        target;

      setProgress(
        Math.round(target)
      );

      progressAnimationRef.current =
        null;

      return;
    }

    const next =
      current +
      (target - current) * 0.08;

    progressDisplayRef.current =
      next;

    setProgress(
      Math.round(next)
    );

    progressAnimationRef.current =
      requestAnimationFrame(
        animateProgress
      );
  };

  const setSmoothProgress = (
    value: number
  ) => {
    progressTargetRef.current =
      Math.max(
        0,
        Math.min(100, value)
      );

    if (
      progressAnimationRef.current ===
      null
    ) {
      progressAnimationRef.current =
        requestAnimationFrame(
          animateProgress
        );
    }
  };

  /*
   * IMPORTANT:
   * webpackIgnore prevents Next.js/Webpack
   * from trying to bundle the HTTPS module
   * during the Vercel build.
   */
  const loadLibrary = async () => {
    if (window.__nexoraRemoveBg) {
      return window.__nexoraRemoveBg;
    }

    if (
      window.__nexoraRemoveBgLoading
    ) {
      return await window.__nexoraRemoveBgLoading;
    }

    window.__nexoraRemoveBgLoading =
      import(
        /* webpackIgnore: true */
        "https://esm.sh/@imgly/background-removal@1.4.5"
      );

    try {
      const lib =
        await window.__nexoraRemoveBgLoading;

      window.__nexoraRemoveBg =
        lib;

      return lib;
    } finally {
      window.__nexoraRemoveBgLoading =
        undefined;
    }
  };

  const prepareImage = (
    file: File
  ): Promise<{
    blob: Blob;
    width: number;
    height: number;
  }> => {
    return new Promise(
      (resolve, reject) => {
        const url =
          URL.createObjectURL(file);

        const img =
          new Image();

        img.onload = () => {
          try {
            let width =
              img.naturalWidth;

            let height =
              img.naturalHeight;

            const maxDimension =
              2400;

            const maxPixels =
              12_000_000;

            let scale = 1;

            if (
              width >
                maxDimension ||
              height >
                maxDimension
            ) {
              scale = Math.min(
                scale,
                maxDimension /
                  Math.max(
                    width,
                    height
                  )
              );
            }

            if (
              width * height >
              maxPixels
            ) {
              scale = Math.min(
                scale,
                Math.sqrt(
                  maxPixels /
                    (width *
                      height)
                )
              );
            }

            const finalWidth =
              Math.max(
                1,
                Math.round(
                  width * scale
                )
              );

            const finalHeight =
              Math.max(
                1,
                Math.round(
                  height * scale
                )
              );

            if (
              finalWidth !== width ||
              finalHeight !== height
            ) {
              const canvas =
                document.createElement(
                  "canvas"
                );

              canvas.width =
                finalWidth;

              canvas.height =
                finalHeight;

              const ctx =
                canvas.getContext(
                  "2d"
                );

              if (!ctx) {
                URL.revokeObjectURL(
                  url
                );

                reject(
                  new Error(
                    "تعذر إنشاء مساحة معالجة الصورة."
                  )
                );

                return;
              }

              ctx.drawImage(
                img,
                0,
                0,
                finalWidth,
                finalHeight
              );

              canvas.toBlob(
                (blob) => {
                  URL.revokeObjectURL(
                    url
                  );

                  if (!blob) {
                    reject(
                      new Error(
                        "تعذر تجهيز الصورة للمعالجة."
                      )
                    );

                    return;
                  }

                  resolve({
                    blob,
                    width:
                      finalWidth,
                    height:
                      finalHeight,
                  });
                },
                "image/png",
                0.95
              );
            } else {
              fetch(url)
                .then(
                  (response) =>
                    response.blob()
                )
                .then((blob) => {
                  URL.revokeObjectURL(
                    url
                  );

                  resolve({
                    blob,
                    width,
                    height,
                  });
                })
                .catch((error) => {
                  URL.revokeObjectURL(
                    url
                  );

                  reject(error);
                });
            }
          } catch (error) {
            URL.revokeObjectURL(
              url
            );

            reject(error);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(
            url
          );

          reject(
            new Error(
              "تعذر قراءة الصورة."
            )
          );
        };

        img.src = url;
      }
    );
  };

  const drawResult = () => {
    const canvas =
      canvasRef.current;

    const img =
      imageRef.current;

    if (!canvas || !img) {
      return;
    }

    const width =
      img.naturalWidth;

    const height =
      img.naturalHeight;

    if (
      width <= 0 ||
      height <= 0
    ) {
      return;
    }

    canvas.width =
      width;

    canvas.height =
      height;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    if (
      bgColor !==
      "transparent"
    ) {
      ctx.fillStyle =
        bgColor;

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

  const handleFile = async (
    file?: File
  ) => {
    if (!file) {
      return;
    }

    setShowPreview(false);
    setInfo("");
    setIsProcessing(true);
    setUploadText(
      "جارٍ معالجة الصورة..."
    );

    setSmoothProgress(3);

    if (
      !file.type.match(
        /^image\/(jpeg|png|webp)$/
      )
    ) {
      setStatus(
        "يرجى اختيار صورة JPG أو PNG أو WebP."
      );

      setInfo(
        "التنسيقات المدعومة: JPG وPNG وWebP."
      );

      setIsProcessing(false);
      setUploadText(
        "اختيار صورة"
      );

      setSmoothProgress(0);

      return;
    }

    if (
      file.size >
      25 * 1024 * 1024
    ) {
      setStatus(
        "حجم الصورة كبير جدًا."
      );

      setInfo(
        "الحد الأقصى لحجم الملف هو 25 ميجابايت."
      );

      setIsProcessing(false);
      setUploadText(
        "اختيار صورة"
      );

      setSmoothProgress(0);

      return;
    }

    try {
      setStatus(
        "جارٍ تجهيز الصورة..."
      );

      setSmoothProgress(10);

      const prepared =
        await prepareImage(
          file
        );

      setSmoothProgress(18);

      setStatus(
        "جارٍ تجهيز موارد الذكاء الاصطناعي..."
      );

      const lib =
        await Promise.race([
          loadLibrary(),

          new Promise(
            (_, reject) => {
              setTimeout(
                () =>
                  reject(
                    new Error(
                      "انتهى وقت تحميل أداة الذكاء الاصطناعي."
                    )
                  ),
                45000
              );
            }
          ),
        ]);

      setSmoothProgress(30);

      setStatus(
        "تم تجهيز الذكاء الاصطناعي، جارٍ تحليل الصورة..."
      );

      const {
        removeBackground,
      } = lib as any;

      const resultBlob =
        await removeBackground(
          prepared.blob,
          {
            progress: (
              _key: string,
              current: number,
              total: number
            ) => {
              if (
                total > 0
              ) {
                const ratio =
                  current /
                  total;

                const mapped =
                  30 +
                  ratio *
                    64;

                setSmoothProgress(
                  mapped
                );

                if (
                  ratio <
                  0.35
                ) {
                  setStatus(
                    "جارٍ تحليل الصورة..."
                  );
                } else if (
                  ratio <
                  0.75
                ) {
                  setStatus(
                    "جارٍ إزالة الخلفية..."
                  );
                } else {
                  setStatus(
                    "جارٍ تحسين حواف الصورة..."
                  );
                }
              }
            },
          }
        );

      setSmoothProgress(96);

      setStatus(
        "جارٍ تجهيز الصورة النهائية..."
      );

      resultBlobRef.current =
        resultBlob;

      const resultUrl =
        URL.createObjectURL(
          resultBlob
        );

      const img =
        new Image();

      img.onload = () => {
        if (
          imageRef.current?.src
        ) {
          try {
            URL.revokeObjectURL(
              imageRef.current.src
            );
          } catch {}
        }

        imageRef.current =
          img;

        drawResult();

        setSmoothProgress(
          100
        );

        setTimeout(() => {
          setStatus(
            "تمت إزالة الخلفية بنجاح."
          );

          setInfo(
            "صورتك جاهزة للتنزيل."
          );

          setShowPreview(true);
          setIsProcessing(false);

          setUploadText(
            "اختيار صورة أخرى"
          );
        }, 500);
      };

      img.onerror = () => {
        URL.revokeObjectURL(
          resultUrl
        );

        throw new Error(
          "تعذر تجهيز الصورة الناتجة."
        );
      };

      img.src =
        resultUrl;
    } catch (error) {
      console.error(error);

      setStatus(
        "تعذر معالجة الصورة."
      );

      setInfo(
        error instanceof Error
          ? error.message
          : "حدث خطأ غير متوقع أثناء معالجة الصورة."
      );

      setIsProcessing(false);

      setUploadText(
        "اختيار صورة"
      );

      setSmoothProgress(0);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (file) {
      void handleFile(
        file
      );
    }

    event.target.value =
      "";
  };

  const downloadPNG = () => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      setInfo(
        "يرجى معالجة صورة أولًا."
      );

      return;
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setInfo(
            "تعذر إنشاء ملف PNG."
          );

          return;
        }

        const url =
          URL.createObjectURL(
            blob
          );

        const a =
          document.createElement(
            "a"
          );

        a.href =
          url;

        a.download =
          "nexora-background-removed.png";

        document.body.appendChild(
          a
        );

        a.click();

        a.remove();

        URL.revokeObjectURL(
          url
        );

        setInfo(
          "تم تنزيل ملف PNG بنجاح."
        );
      },
      "image/png"
    );
  };

  const resetTool = () => {
    setShowPreview(false);

    setStatus(
      "ارفع صورة للبدء"
    );

    setInfo("");

    setProgress(0);

    progressTargetRef.current =
      0;

    progressDisplayRef.current =
      0;

    setUploadText(
      "اختيار صورة"
    );

    setIsProcessing(false);

    resultBlobRef.current =
      null;

    if (
      imageRef.current?.src
    ) {
      try {
        URL.revokeObjectURL(
          imageRef.current.src
        );
      } catch {}
    }

    imageRef.current =
      null;

    const canvas =
      canvasRef.current;

    if (canvas) {
      const ctx =
        canvas.getContext(
          "2d"
        );

      if (ctx) {
        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      canvas.width = 1;
      canvas.height = 1;
    }
  };

  useEffect(() => {
    if (showPreview) {
      drawResult();
    }
  }, [
    bgColor,
    showPreview,
  ]);

  useEffect(() => {
    return () => {
      if (
        progressAnimationRef.current
      ) {
        cancelAnimationFrame(
          progressAnimationRef.current
        );
      }

      if (
        objectUrlRef.current
      ) {
        URL.revokeObjectURL(
          objectUrlRef.current
        );
      }

      if (
        imageRef.current?.src
      ) {
        try {
          URL.revokeObjectURL(
            imageRef.current.src
          );
        } catch {}
      }
    };
  }, []);

  return (
    <main
      dir="rtl"
      lang="ar"
      style={{
        minHeight:
          "100vh",
        background:
          "linear-gradient(180deg,#080d1b 0%,#0b1020 100%)",
        color: "#fff",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        padding:
          "40px 20px 70px",
      }}
    >
      <div
        style={{
          maxWidth: 1050,
          margin:
            "0 auto",
        }}
      >
        <section
          style={{
            textAlign:
              "center",
            padding:
              "30px 10px 35px",
          }}
        >
          <div
            style={{
              display:
                "inline-block",
              padding:
                "8px 14px",
              borderRadius:
                999,
              background:
                "rgba(124,108,255,.12)",
              border:
                "1px solid rgba(124,108,255,.3)",
              color:
                "#c8c1ff",
              fontSize:
                13,
              fontWeight:
                700,
              marginBottom:
                18,
            }}
          >
            NEXORA • أداة مجانية
          </div>

          <h1
            style={{
              fontSize:
                "clamp(32px,6vw,58px)",
              lineHeight:
                1.1,
              margin:
                "0 auto 18px",
              maxWidth:
                850,
              fontWeight:
                800,
            }}
          >
            إزالة خلفية الصور مجانًا
          </h1>

          <p
            style={{
              maxWidth:
                720,
              margin:
                "0 auto",
              color:
                "#aeb7ca",
              fontSize:
                "clamp(16px,2.5vw,20px)",
              lineHeight:
                1.8,
            }}
          >
            أزل خلفية الصور الشخصية
            والصور بسهولة، وأنشئ PNG
            شفافًا أو أضف خلفية بيضاء
            أو زرقاء أو حمراء. تتم معالجة
            الصورة مباشرة من خلال المتصفح.
          </p>
        </section>

        <section
          style={{
            background:
              "rgba(255,255,255,.045)",
            border:
              "1px solid rgba(255,255,255,.09)",
            borderRadius:
              24,
            padding:
              "clamp(18px,4vw,32px)",
            boxShadow:
              "0 25px 80px rgba(0,0,0,.25)",
          }}
        >
          {!showPreview ? (
            <label
              style={{
                display:
                  "flex",
                minHeight:
                  330,
                borderRadius:
                  20,
                border:
                  "2px dashed rgba(124,108,255,.5)",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                textAlign:
                  "center",
                cursor:
                  isProcessing
                    ? "not-allowed"
                    : "pointer",
                background:
                  "rgba(124,108,255,.035)",
                padding:
                  30,
              }}
            >
              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleInputChange
                }
                disabled={
                  isProcessing
                }
                style={{
                  display:
                    "none",
                }}
              />

              <div>
                <div
                  style={{
                    fontSize:
                      56,
                    marginBottom:
                      12,
                  }}
                >
                  🖼️
                </div>

                <div
                  style={{
                    fontSize:
                      21,
                    fontWeight:
                      800,
                    marginBottom:
                      8,
                  }}
                >
                  {uploadText}
                </div>

                <div
                  style={{
                    color:
                      "#9da8bd",
                    fontSize:
                      14,
                    lineHeight:
                      1.7,
                  }}
                >
                  JPG، PNG، WebP •
                  معالجة عبر المتصفح •
                  بدون تسجيل
                </div>
              </div>
            </label>
          ) : (
            <div>
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  gap: 15,
                  flexWrap:
                    "wrap",
                  marginBottom:
                    18,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize:
                        20,
                      fontWeight:
                        800,
                      marginBottom:
                        5,
                    }}
                  >
                    تمت إزالة الخلفية
                  </div>

                  <div
                    style={{
                      color:
                        "#aeb7ca",
                      fontSize:
                        14,
                    }}
                  >
                    اختر الخلفية ثم نزّل الصورة.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    resetTool
                  }
                  style={{
                    border:
                      0,
                    borderRadius:
                      12,
                    padding:
                      "11px 16px",
                    background:
                      "rgba(255,255,255,.08)",
                    color:
                      "#fff",
                    cursor:
                      "pointer",
                    fontWeight:
                      700,
                  }}
                >
                  إزالة خلفية أخرى
                </button>
              </div>

              <div
                style={{
                  borderRadius:
                    18,
                  overflow:
                    "hidden",
                  background:
                    "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 24px 24px",
                  minHeight:
                    280,
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  padding:
                    20,
                }}
              >
                <canvas
                  ref={
                    canvasRef
                  }
                  style={{
                    maxWidth:
                      "100%",
                    maxHeight:
                      520,
                    width:
                      "auto",
                    height:
                      "auto",
                    display:
                      "block",
                  }}
                />
              </div>

              <div
                style={{
                  marginTop:
                    24,
                }}
              >
                <div
                  style={{
                    fontWeight:
                      800,
                    marginBottom:
                      12,
                  }}
                >
                  اختيار الخلفية
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    gap: 10,
                    flexWrap:
                      "wrap",
                  }}
                >
                  {[
                    {
                      value:
                        "transparent" as BackgroundColor,
                      label:
                        "شفافة",
                    },
                    {
                      value:
                        "#ffffff" as BackgroundColor,
                      label:
                        "بيضاء",
                    },
                    {
                      value:
                        "#6366f1" as BackgroundColor,
                      label:
                        "زرقاء",
                    },
                    {
                      value:
                        "#ef4444" as BackgroundColor,
                      label:
                        "حمراء",
                    },
                  ].map(
                    (item) => (
                      <button
                        key={
                          item.value
                        }
                        type="button"
                        onClick={() =>
                          setBgColor(
                            item.value
                          )
                        }
                        style={{
                          padding:
                            "11px 16px",
                          borderRadius:
                            12,
                          border:
                            bgColor ===
                            item.value
                              ? "2px solid #7c6cff"
                              : "1px solid rgba(255,255,255,.12)",
                          background:
                            "rgba(255,255,255,.06)",
                          color:
                            "#fff",
                          cursor:
                            "pointer",
                          fontWeight:
                            700,
                        }}
                      >
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={
                  downloadPNG
                }
                style={{
                  width:
                    "100%",
                  marginTop:
                    22,
                  border:
                    0,
                  borderRadius:
                    14,
                  padding:
                    "15px 20px",
                  background:
                    "linear-gradient(135deg,#7c6cff,#27d5c3)",
                  color:
                    "#fff",
                  cursor:
                    "pointer",
                  fontSize:
                    16,
                  fontWeight:
                    800,
                }}
              >
                تنزيل PNG
              </button>
            </div>
          )}

          {!showPreview &&
            isProcessing && (
              <div
                style={{
                  marginTop:
                    24,
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    gap: 10,
                    marginBottom:
                      9,
                    fontSize:
                      14,
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
                    height:
                      10,
                    borderRadius:
                      999,
                    background:
                      "rgba(255,255,255,.08)",
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
                      borderRadius:
                        999,
                      background:
                        "linear-gradient(90deg,#7c6cff,#27d5c3)",
                      transition:
                        "width .15s ease",
                    }}
                  />
                </div>
              </div>
            )}

          {!showPreview &&
            !isProcessing &&
            info && (
              <div
                style={{
                  marginTop:
                    18,
                  padding:
                    14,
                  borderRadius:
                    12,
                  background:
                    "rgba(239,68,68,.08)",
                  border:
                    "1px solid rgba(239,68,68,.2)",
                  color:
                    "#fecaca",
                  fontSize:
                    14,
                  lineHeight:
                    1.7,
                }}
              >
                {info}
              </div>
            )}

          {showPreview &&
            info && (
              <div
                style={{
                  marginTop:
                    14,
                  color:
                    "#9fe7d7",
                  fontSize:
                    14,
                  textAlign:
                    "center",
                }}
              >
                {info}
              </div>
            )}
        </section>

        <section
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 14,
            marginTop:
              24,
          }}
        >
          {[
            {
              icon: "⚡",
              title:
                "سريع",
              text:
                "إزالة الخلفية مباشرة من المتصفح.",
            },
            {
              icon: "🔒",
              title:
                "معالجة محلية",
              text:
                "تتم معالجة الصورة باستخدام الأداة داخل المتصفح.",
            },
            {
              icon: "🖼️",
              title:
                "PNG شفاف",
              text:
                "أنشئ صور PNG بخلفية شفافة.",
            },
            {
              icon: "🚫",
              title:
                "بدون علامة مائية",
              text:
                "لا نضيف علامة مائية إلى الصورة الناتجة.",
            },
          ].map(
            (item) => (
              <div
                key={
                  item.title
                }
                style={{
                  padding:
                    20,
                  borderRadius:
                    18,
                  background:
                    "rgba(255,255,255,.04)",
                  border:
                    "1px solid rgba(255,255,255,.08)",
                }}
              >
                <div
                  style={{
                    fontSize:
                      28,
                    marginBottom:
                      10,
                  }}
                >
                  {item.icon}
                </div>

                <div
                  style={{
                    fontWeight:
                      800,
                    marginBottom:
                      7,
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    color:
                      "#9da8bd",
                    fontSize:
                      13,
                    lineHeight:
                      1.7,
                  }}
                >
                  {item.text}
                </div>
              </div>
            )
          )}
        </section>

        <section
          style={{
            marginTop:
              55,
            lineHeight:
              1.9,
          }}
        >
          <h2
            style={{
              fontSize:
                30,
              marginBottom:
                14,
            }}
          >
            إزالة خلفية الصور عبر الإنترنت
          </h2>

          <p
            style={{
              color:
                "#aeb7ca",
              fontSize:
                16,
            }}
          >
            تساعدك أداة NEXORA على إزالة
            خلفية الصور بسرعة وإنشاء صور
            جاهزة للاستخدام في المتاجر
            الإلكترونية ووسائل التواصل
            الاجتماعي والتصميم والمستندات
            والصور الشخصية.
          </p>

          <h2
            style={{
              fontSize:
                28,
              marginTop:
                38,
              marginBottom:
                14,
            }}
          >
            إزالة الخلفية بدون Photoshop
          </h2>

          <p
            style={{
              color:
                "#aeb7ca",
              fontSize:
                16,
            }}
          >
            لا تحتاج إلى تثبيت برنامج متخصص.
            ارفع الصورة إلى NEXORA، واترك
            أداة الذكاء الاصطناعي تحلل الصورة
            وتزيل الخلفية، ثم اختر الخلفية
            المناسبة وقم بتنزيل النتيجة بصيغة PNG.
          </p>

          <h2
            style={{
              fontSize:
                28,
              marginTop:
                38,
              marginBottom:
                14,
            }}
          >
            إنشاء صور PNG شفافة
          </h2>

          <p
            style={{
              color:
                "#aeb7ca",
              fontSize:
                16,
            }}
          >
            إذا كنت تحتاج إلى صورة بدون
            خلفية، اختر خيار "شفافة" بعد
            إزالة الخلفية. ستتمكن من تنزيل
            النتيجة كملف PNG مناسب للتصميم
            والعروض والصور الرقمية.
          </p>

          <h2
            style={{
              fontSize:
                28,
              marginTop:
                38,
              marginBottom:
                14,
            }}
          >
            إضافة خلفية بيضاء للصور الشخصية
          </h2>

          <p
            style={{
              color:
                "#aeb7ca",
              fontSize:
                16,
            }}
          >
            يمكنك اختيار اللون الأبيض بعد
            إزالة الخلفية لإنشاء صورة بخلفية
            بسيطة ونظيفة. كما تتوفر خلفيات
            زرقاء وحمراء للاستخدامات المختلفة.
          </p>

          <h2
            style={{
              fontSize:
                28,
              marginTop:
                38,
              marginBottom:
                14,
            }}
          >
            كيفية إزالة خلفية الصورة
          </h2>

          <ol
            style={{
              color:
                "#aeb7ca",
              paddingRight:
                25,
              fontSize:
                16,
            }}
          >
            <li>
              ارفع صورة JPG أو PNG أو WebP.
            </li>

            <li>
              انتظر حتى يقوم الذكاء الاصطناعي
              بتحليل الصورة وإزالة الخلفية.
            </li>

            <li>
              اختر خلفية شفافة أو بيضاء أو
              زرقاء أو حمراء.
            </li>

            <li>
              اضغط على "تنزيل PNG" لحفظ الصورة.
            </li>
          </ol>
        </section>

        <section
          style={{
            marginTop:
              55,
          }}
        >
          <h2
            style={{
              fontSize:
                30,
              marginBottom:
                20,
            }}
          >
            الأسئلة الشائعة
          </h2>

          <div
            style={{
              display:
                "grid",
              gap: 12,
            }}
          >
            {[
              [
                "هل أداة NEXORA مجانية؟",
                "نعم، يمكنك استخدام أداة إزالة خلفية الصور مجانًا.",
              ],
              [
                "ما الصيغ التي تدعمها الأداة؟",
                "تدعم JPG وPNG وWebP ضمن الحد المسموح لحجم الملف.",
              ],
              [
                "هل يمكن إنشاء خلفية شفافة؟",
                "نعم، اختر خيار الخلفية الشفافة ثم نزّل النتيجة بصيغة PNG.",
              ],
              [
                "هل تعمل الأداة على الهاتف؟",
                "نعم، يمكن استخدامها على متصفحات iPhone وAndroid الحديثة.",
              ],
              [
                "هل تتم معالجة الصور داخل المتصفح؟",
                "تتم معالجة الصورة باستخدام الأداة داخل المتصفح، مع احتمال تنزيل موارد نموذج الذكاء الاصطناعي من شبكة خارجية.",
              ],
              [
                "هل توجد علامة مائية؟",
                "لا نضيف علامة مائية خاصة بـ NEXORA إلى الصور الناتجة.",
              ],
            ].map(
              ([question, answer]) => (
                <details
                  key={
                    question
                  }
                  style={{
                    background:
                      "rgba(255,255,255,.04)",
                    border:
                      "1px solid rgba(255,255,255,.08)",
                    borderRadius:
                      14,
                    padding:
                      "16px 18px",
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
                    {question}
                  </summary>

                  <p
                    style={{
                      color:
                        "#aeb7ca",
                      margin:
                        "12px 0 0",
                      lineHeight:
                        1.8,
                    }}
                  >
                    {answer}
                  </p>
                </details>
              )
            )}
          </div>
        </section>

        <section
          style={{
            marginTop:
              55,
          }}
        >
          <h2
            style={{
              fontSize:
                28,
              marginBottom:
                18,
            }}
          >
            أدوات NEXORA المجانية الأخرى
          </h2>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(190px,1fr))",
              gap: 12,
            }}
          >
            <a
              href="/"
              style={{
                color:
                  "#c8c1ff",
                textDecoration:
                  "none",
                padding:
                  16,
                borderRadius:
                  14,
                background:
                  "rgba(255,255,255,.04)",
              }}
            >
              جميع الأدوات
            </a>

            <a
              href="/bmi-calculator/"
              style={{
                color:
                  "#c8c1ff",
                textDecoration:
                  "none",
                padding:
                  16,
                borderRadius:
                  14,
                background:
                  "rgba(255,255,255,.04)",
              }}
            >
              حاسبة مؤشر كتلة الجسم
            </a>

            <a
              href="/age-calculator/"
              style={{
                color:
                  "#c8c1ff",
                textDecoration:
                  "none",
                padding:
                  16,
                borderRadius:
                  14,
                background:
                  "rgba(255,255,255,.04)",
              }}
            >
              حاسبة العمر
            </a>

            <a
              href="/percentage-calculator/"
              style={{
                color:
                  "#c8c1ff",
                textDecoration:
                  "none",
                padding:
                  16,
                borderRadius:
                  14,
                background:
                  "rgba(255,255,255,.04)",
              }}
            >
              حاسبة النسبة المئوية
            </a>
          </div>
        </section>

        <footer
          style={{
            marginTop:
              65,
            paddingTop:
              25,
            borderTop:
              "1px solid rgba(255,255,255,.08)",
            textAlign:
              "center",
            color:
              "#7f8aa3",
            fontSize:
              13,
            lineHeight:
              1.8,
          }}
        >
          ©{" "}
          {new Date().getFullYear()}{" "}
          NEXORA. جميع الأدوات متاحة
          مجانًا.
          <br />
          تم إنشاء NEXORA بواسطة
          Ayush Chauhan.
        </footer>
      </div>
    </main>
  );
}
