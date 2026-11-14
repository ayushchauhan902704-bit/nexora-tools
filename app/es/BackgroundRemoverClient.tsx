"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    __nexoraRemoveBg?: any;
    __nexoraRemoveBgLoading?: boolean;
  }
}

const SITE_URL = "https://thenexoratools.com";

type BackgroundColor =
  | "transparent"
  | "#ffffff"
  | "#6366f1"
  | "#ef4444";

export default function BackgroundRemoverClient() {
  const [bgColor, setBgColor] =
    useState<BackgroundColor>("transparent");

  const [status, setStatus] =
    useState("Sube una foto para comenzar");

  const [progress, setProgress] =
    useState(0);

  const [showPreview, setShowPreview] =
    useState(false);

  const [info, setInfo] =
    useState("");

  const [uploadText, setUploadText] =
    useState("Seleccionar foto");

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [libReady, setLibReady] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const imageRef =
    useRef<HTMLImageElement | null>(null);

  const blobRef =
    useRef<Blob | null>(null);

  const smoothProgressTarget =
    useRef(0);

  const smoothProgressDisplay =
    useRef(0);

  const progressAnimationRef =
    useRef<number | null>(null);

  const loadingRef =
    useRef(false);

  const objectUrlRef =
    useRef<string | null>(null);

  /*
   * Smooth progress animation
   */
  useEffect(() => {
    const animate = () => {
      const current =
        smoothProgressDisplay.current;

      const target =
        smoothProgressTarget.current;

      if (Math.abs(target - current) < 0.2) {
        smoothProgressDisplay.current =
          target;
      } else {
        smoothProgressDisplay.current =
          current + (target - current) * 0.08;
      }

      setProgress(
        Math.round(
          smoothProgressDisplay.current
        )
      );

      progressAnimationRef.current =
        requestAnimationFrame(animate);
    };

    progressAnimationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (
        progressAnimationRef.current
      ) {
        cancelAnimationFrame(
          progressAnimationRef.current
        );
      }
    };
  }, []);

  /*
   * Load background-removal library
   */
  const loadLibrary = async () => {
    if (window.__nexoraRemoveBg) {
      setLibReady(true);
      return window.__nexoraRemoveBg;
    }

    if (
      window.__nexoraRemoveBgLoading
    ) {
      let attempts = 0;

      while (
        !window.__nexoraRemoveBg &&
        attempts < 300
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, 100)
        );

        attempts++;
      }

      if (window.__nexoraRemoveBg) {
        setLibReady(true);
        return window.__nexoraRemoveBg;
      }

      throw new Error(
        "No se pudo cargar el motor de procesamiento."
      );
    }

    window.__nexoraRemoveBgLoading = true;

    try {
      const module =
        await import(
          "https://esm.sh/@imgly/background-removal@1.4.5"
        );

      window.__nexoraRemoveBg =
        module.removeBackground;

      setLibReady(true);

      return window.__nexoraRemoveBg;
    } catch (error) {
      console.error(error);

      throw new Error(
        "No se pudo cargar el motor de eliminación de fondo."
      );
    } finally {
      window.__nexoraRemoveBgLoading =
        false;
    }
  };

  /*
   * Prepare image for processing
   */
  const prepareImage = (
    file: File
  ): Promise<{
    file: File;
    width: number;
    height: number;
  }> => {
    return new Promise(
      (resolve, reject) => {
        const img =
          new Image();

        const url =
          URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(url);

          let width =
            img.naturalWidth;

          let height =
            img.naturalHeight;

          const maxDimension =
            2400;

          const maxPixels =
            12000000;

          const scaleByDimension =
            Math.min(
              1,
              maxDimension /
                Math.max(
                  width,
                  height
                )
            );

          const scaleByPixels =
            Math.min(
              1,
              Math.sqrt(
                maxPixels /
                  (width * height)
              )
            );

          const scale =
            Math.min(
              scaleByDimension,
              scaleByPixels
            );

          if (scale < 1) {
            width =
              Math.max(
                1,
                Math.round(
                  width * scale
                )
              );

            height =
              Math.max(
                1,
                Math.round(
                  height * scale
                )
              );

            const canvas =
              document.createElement(
                "canvas"
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
              reject(
                new Error(
                  "No se pudo preparar la imagen."
                )
              );

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
                if (!blob) {
                  reject(
                    new Error(
                      "No se pudo preparar la imagen."
                    )
                  );

                  return;
                }

                const preparedFile =
                  new File(
                    [blob],
                    file.name.replace(
                      /\.[^/.]+$/,
                      ".png"
                    ),
                    {
                      type:
                        "image/png",
                    }
                  );

                resolve({
                  file:
                    preparedFile,
                  width,
                  height,
                });
              },
              "image/png"
            );

            return;
          }

          resolve({
            file,
            width,
            height,
          });
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);

          reject(
            new Error(
              "No se pudo leer la imagen."
            )
          );
        };

        img.src = url;
      }
    );
  };

  /*
   * Draw processed image
   */
  const drawResult = (
    blob: Blob
  ) => {
    return new Promise<void>(
      (resolve, reject) => {
        const canvas =
          canvasRef.current;

        if (!canvas) {
          reject(
            new Error(
              "No se encontró el área de vista previa."
            )
          );

          return;
        }

        const url =
          URL.createObjectURL(blob);

        const img =
          new Image();

        img.onload = () => {
          const width =
            img.naturalWidth;

          const height =
            img.naturalHeight;

          canvas.width =
            width;

          canvas.height =
            height;

          const ctx =
            canvas.getContext(
              "2d"
            );

          if (!ctx) {
            URL.revokeObjectURL(url);

            reject(
              new Error(
                "No se pudo crear la vista previa."
              )
            );

            return;
          }

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
          } else {
            ctx.clearRect(
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

          URL.revokeObjectURL(url);

          resolve();
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);

          reject(
            new Error(
              "No se pudo mostrar la imagen procesada."
            )
          );
        };

        img.src = url;
      }
    );
  };

  /*
   * Process image
   */
  const processImage = async (
    file: File
  ) => {
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;

    setIsProcessing(true);
    setShowPreview(false);
    setInfo("");
    setUploadText(
      "Procesando imagen..."
    );

    smoothProgressTarget.current = 2;

    setStatus(
      "Iniciando el procesamiento con IA..."
    );

    try {
      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        throw new Error(
          "Selecciona una imagen válida."
        );
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        throw new Error(
          "Formatos compatibles: JPG, PNG y WebP."
        );
      }

      if (
        file.size >
        25 * 1024 * 1024
      ) {
        throw new Error(
          "La imagen es demasiado grande. El tamaño máximo es de 25 MB."
        );
      }

      smoothProgressTarget.current =
        8;

      setStatus(
        "Preparando tu imagen..."
      );

      const prepared =
        await prepareImage(
          file
        );

      smoothProgressTarget.current =
        15;

      setStatus(
        "Preparando los recursos de IA..."
      );

      const removeBackground =
        await Promise.race([
          loadLibrary(),

          new Promise(
            (_, reject) =>
              setTimeout(
                () =>
                  reject(
                    new Error(
                      "La carga del motor de IA tardó demasiado. Inténtalo de nuevo."
                    )
                  ),
                45000
              )
          ),
        ]);

      smoothProgressTarget.current =
        28;

      setStatus(
        "La IA está lista. Analizando la imagen..."
      );

      const result =
        await removeBackground(
          prepared.file,
          {
            progress: (
              key: string,
              current: number,
              total: number
            ) => {
              let percent =
                30;

              if (
                total > 0
              ) {
                const ratio =
                  current /
                  total;

                percent =
                  30 +
                  Math.round(
                    ratio *
                      64
                  );
              }

              percent =
                Math.max(
                  30,
                  Math.min(
                    94,
                    percent
                  )
                );

              smoothProgressTarget.current =
                percent;

              if (
                percent < 65
              ) {
                setStatus(
                  "Eliminando el fondo..."
                );
              } else if (
                percent < 90
              ) {
                setStatus(
                  "Refinando los bordes..."
                );
              } else {
                setStatus(
                  "Preparando la imagen final..."
                );
              }
            },
          }
        );

      smoothProgressTarget.current =
        96;

      setStatus(
        "Preparando la imagen final..."
      );

      blobRef.current =
        result;

      await drawResult(
        result
      );

      smoothProgressTarget.current =
        100;

      setStatus(
        "Fondo eliminado correctamente."
      );

      setInfo(
        "Tu imagen está lista para descargar."
      );

      setShowPreview(
        true
      );
    } catch (error) {
      console.error(
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "No se pudo procesar la imagen.";

      setStatus(
        "No se pudo procesar la imagen."
      );

      setInfo(
        message
      );

      smoothProgressTarget.current =
        0;
    } finally {
      setIsProcessing(
        false
      );

      setUploadText(
        "Seleccionar otra foto"
      );

      loadingRef.current =
        false;
    }
  };

  /*
   * File selection
   */
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    processImage(
      file
    );
  };

  /*
   * Download PNG
   */
  const downloadImage = () => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      setInfo(
        "Primero procesa una imagen."
      );

      return;
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setInfo(
            "No se pudo crear el archivo PNG."
          );

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

        link.href =
          url;

        link.download =
          "nexora-background-remover.png";

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
          url
        );

        setInfo(
          "PNG descargado correctamente."
        );
      },
      "image/png"
    );
  };

  /*
   * Reset
   */
  const resetTool = () => {
    blobRef.current =
      null;

    setShowPreview(
      false
    );

    setInfo("");

    setStatus(
      "Sube una foto para comenzar"
    );

    setProgress(
      0
    );

    smoothProgressTarget.current =
      0;

    smoothProgressDisplay.current =
      0;

    setUploadText(
      "Seleccionar foto"
    );

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }

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
    }
  };

  /*
   * Change background and redraw
   */
  useEffect(() => {
    if (
      blobRef.current &&
      showPreview
    ) {
      drawResult(
        blobRef.current
      ).catch(
        console.error
      );
    }
  }, [
    bgColor,
    showPreview,
  ]);

  /*
   * Cleanup
   */
  useEffect(() => {
    return () => {
      if (
        objectUrlRef.current
      ) {
        URL.revokeObjectURL(
          objectUrlRef.current
        );
      }
    };
  }, []);

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "#080d1b",
        color:
          "#ffffff",
        fontFamily:
          "Inter, Arial, sans-serif",
        padding:
          "40px 18px 70px",
      }}
    >
      <div
        style={{
          maxWidth:
            "1100px",
          margin:
            "0 auto",
        }}
      >
        {/* HERO */}
        <section
          style={{
            textAlign:
              "center",
            marginBottom:
              "35px",
          }}
        >
          <div
            style={{
              display:
                "inline-block",
              padding:
                "7px 13px",
              border:
                "1px solid rgba(124,108,255,.35)",
              borderRadius:
                "999px",
              color:
                "#c9c3ff",
              fontSize:
                "13px",
              marginBottom:
                "18px",
            }}
          >
            NEXORA • Herramienta gratuita
          </div>

          <h1
            style={{
              fontSize:
                "clamp(34px, 7vw, 62px)",
              lineHeight:
                "1.05",
              margin:
                "0 auto 18px",
              maxWidth:
                "850px",
              fontWeight:
                800,
            }}
          >
            Eliminar Fondo de Foto Gratis
          </h1>

          <p
            style={{
              color:
                "#aeb6ca",
              fontSize:
                "17px",
              lineHeight:
                "1.7",
              maxWidth:
                "720px",
              margin:
                "0 auto",
            }}
          >
            Elimina el fondo de tus fotos,
            crea PNG transparentes o añade
            fondos blancos, azules o rojos.
            Todo directamente desde tu navegador.
          </p>
        </section>

        {/* TOOL */}
        <section
          style={{
            background:
              "rgba(17,24,45,.8)",
            border:
              "1px solid rgba(255,255,255,.09)",
            borderRadius:
              "24px",
            padding:
              "22px",
            maxWidth:
              "820px",
            margin:
              "0 auto",
            boxShadow:
              "0 25px 80px rgba(0,0,0,.3)",
          }}
        >
          <input
            ref={
              fileInputRef
            }
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={
              handleFileChange
            }
            style={{
              display:
                "none",
            }}
          />

          {!showPreview ? (
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={
                isProcessing
              }
              style={{
                width:
                  "100%",
                minHeight:
                  "280px",
                border:
                  "2px dashed rgba(124,108,255,.45)",
                borderRadius:
                  "20px",
                background:
                  "rgba(124,108,255,.06)",
                color:
                  "#ffffff",
                cursor:
                  isProcessing
                    ? "not-allowed"
                    : "pointer",
                padding:
                  "30px",
              }}
            >
              <div
                style={{
                  fontSize:
                    "48px",
                  marginBottom:
                    "12px",
                }}
              >
                🖼️
              </div>

              <div
                style={{
                  fontSize:
                    "22px",
                  fontWeight:
                    700,
                  marginBottom:
                    "8px",
                }}
              >
                {uploadText}
              </div>

              <div
                style={{
                  color:
                    "#9da7bd",
                  fontSize:
                    "14px",
                }}
              >
                JPG, PNG, WebP • Procesamiento en el navegador • Sin registro
              </div>
            </button>
          ) : (
            <div>
              <div
                style={{
                  borderRadius:
                    "18px",
                  overflow:
                    "hidden",
                  background:
                    "#111827",
                  padding:
                    "12px",
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
                      "650px",
                    objectFit:
                      "contain",
                    background:
                      bgColor ===
                      "transparent"
                        ? "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 24px 24px"
                        : bgColor,
                    borderRadius:
                      "12px",
                  }}
                />
              </div>

              <div
                style={{
                  marginTop:
                    "18px",
                }}
              >
                <h2
                  style={{
                    fontSize:
                      "16px",
                    marginBottom:
                      "12px",
                  }}
                >
                  Seleccionar fondo
                </h2>

                <div
                  style={{
                    display:
                      "flex",
                    flexWrap:
                      "wrap",
                    gap:
                      "10px",
                  }}
                >
                  {[
                    {
                      value:
                        "transparent" as BackgroundColor,
                      label:
                        "Transparente",
                    },
                    {
                      value:
                        "#ffffff" as BackgroundColor,
                      label:
                        "Blanco",
                    },
                    {
                      value:
                        "#6366f1" as BackgroundColor,
                      label:
                        "Azul",
                    },
                    {
                      value:
                        "#ef4444" as BackgroundColor,
                      label:
                        "Rojo",
                    },
                  ].map(
                    (
                      option
                    ) => (
                      <button
                        key={
                          option.value
                        }
                        type="button"
                        onClick={() =>
                          setBgColor(
                            option.value
                          )
                        }
                        style={{
                          padding:
                            "10px 15px",
                          borderRadius:
                            "10px",
                          border:
                            bgColor ===
                            option.value
                              ? "2px solid #ffffff"
                              : "1px solid rgba(255,255,255,.15)",
                          background:
                            option.value ===
                            "transparent"
                              ? "#202638"
                              : option.value,
                          color:
                            option.value ===
                            "#ffffff"
                              ? "#111827"
                              : "#ffffff",
                          cursor:
                            "pointer",
                          fontWeight:
                            600,
                        }}
                      >
                        {option.label}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div
                style={{
                  display:
                    "flex",
                  flexWrap:
                    "wrap",
                  gap:
                    "12px",
                  marginTop:
                    "20px",
                }}
              >
                <button
                  type="button"
                  onClick={
                    downloadImage
                  }
                  style={{
                    flex:
                      "1 1 220px",
                    border:
                      "none",
                    borderRadius:
                      "12px",
                    padding:
                      "14px 18px",
                    background:
                      "linear-gradient(135deg,#7c6cff,#27d5c3)",
                    color:
                      "#ffffff",
                    fontSize:
                      "16px",
                    fontWeight:
                      800,
                    cursor:
                      "pointer",
                  }}
                >
                  Descargar PNG
                </button>

                <button
                  type="button"
                  onClick={
                    resetTool
                  }
                  style={{
                    flex:
                      "1 1 180px",
                    border:
                      "1px solid rgba(255,255,255,.15)",
                    borderRadius:
                      "12px",
                    padding:
                      "14px 18px",
                    background:
                      "rgba(255,255,255,.05)",
                    color:
                      "#ffffff",
                    fontSize:
                      "15px",
                    fontWeight:
                      700,
                    cursor:
                      "pointer",
                  }}
                >
                  Eliminar otro fondo
                </button>
              </div>
            </div>
          )}

          {!showPreview &&
            isProcessing && (
              <div
                style={{
                  marginTop:
                    "20px",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    gap:
                      "10px",
                    marginBottom:
                      "8px",
                    fontSize:
                      "14px",
                    color:
                      "#c7cee0",
                  }}
                >
                  <span>
                    {status}
                  </span>

                  <strong>
                    {progress}%
                  </strong>
                </div>

                <div
                  style={{
                    height:
                      "10px",
                    borderRadius:
                      "999px",
                    background:
                      "#20283d",
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
                        "linear-gradient(90deg,#7c6cff,#27d5c3)",
                      transition:
                        "width .15s ease",
                    }}
                  />
                </div>
              </div>
            )}

          {!showPreview &&
            !isProcessing && (
              <div
                style={{
                  marginTop:
                    "18px",
                  textAlign:
                    "center",
                  color:
                    "#8f9ab3",
                  fontSize:
                    "14px",
                }}
              >
                {status}
              </div>
            )}

          {info && (
            <div
              style={{
                marginTop:
                  "15px",
                padding:
                  "12px 14px",
                borderRadius:
                  "10px",
                background:
                  "rgba(39,213,195,.08)",
                border:
                  "1px solid rgba(39,213,195,.15)",
                color:
                  "#cbd5e1",
                fontSize:
                  "14px",
              }}
            >
              {info}
            </div>
          )}
        </section>

        {/* FEATURES */}
        <section
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(210px,1fr))",
            gap:
              "14px",
            marginTop:
              "28px",
          }}
        >
          {[
            {
              icon:
                "⚡",
              title:
                "Rápido",
              text:
                "Procesa imágenes directamente desde tu navegador.",
            },
            {
              icon:
                "🔒",
              title:
                "Procesamiento local",
              text:
                "La eliminación del fondo se realiza en tu navegador.",
            },
            {
              icon:
                "🖼️",
              title:
                "PNG transparente",
              text:
                "Crea imágenes PNG con fondo transparente.",
            },
            {
              icon:
                "💧",
              title:
                "Sin marca de agua",
              text:
                "NEXORA no añade su propia marca de agua al resultado.",
            },
          ].map(
            (item) => (
              <div
                key={
                  item.title
                }
                style={{
                  padding:
                    "20px",
                  borderRadius:
                    "16px",
                  background:
                    "rgba(255,255,255,.035)",
                  border:
                    "1px solid rgba(255,255,255,.07)",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "25px",
                    marginBottom:
                      "8px",
                  }}
                >
                  {item.icon}
                </div>

                <h3
                  style={{
                    margin:
                      "0 0 7px",
                    fontSize:
                      "17px",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    margin:
                      0,
                    color:
                      "#9da7bd",
                    lineHeight:
                      "1.6",
                    fontSize:
                      "14px",
                  }}
                >
                  {item.text}
                </p>
              </div>
            )
          )}
        </section>

        {/* SEO CONTENT */}
        <article
          style={{
            marginTop:
              "55px",
            color:
              "#c6cede",
            lineHeight:
              "1.8",
          }}
        >
          <h2
            style={{
              color:
                "#ffffff",
              fontSize:
                "30px",
              lineHeight:
                "1.25",
            }}
          >
            Eliminar el fondo de una foto online
          </h2>

          <p>
            NEXORA Background Remover es una
            herramienta gratuita para eliminar
            el fondo de imágenes online.
            Puedes utilizarla para fotografías
            de productos, perfiles, documentos,
            redes sociales, presentaciones y
            muchos otros proyectos.
          </p>

          <p>
            Sube una imagen JPG, PNG o WebP y
            deja que el procesamiento basado en
            IA detecte el sujeto y elimine el
            fondo. Después puedes mantener el
            fondo transparente o elegir un fondo
            blanco, azul o rojo.
          </p>

          <h2
            style={{
              color:
                "#ffffff",
              fontSize:
                "27px",
              marginTop:
                "35px",
            }}
          >
            Quitar fondo de imagen sin Photoshop
          </h2>

          <p>
            No necesitas instalar un programa
            de edición de fotografías para
            realizar una eliminación básica del
            fondo. NEXORA funciona directamente
            en un navegador moderno y está
            diseñado para ofrecer un proceso
            sencillo desde teléfonos, tabletas
            y ordenadores.
          </p>

          <h2
            style={{
              color:
                "#ffffff",
              fontSize:
                "27px",
              marginTop:
                "35px",
            }}
          >
            Crear una imagen PNG transparente
          </h2>

          <p>
            Si necesitas una imagen sin fondo,
            selecciona la opción
            <strong>
              {" "}
              Transparente
            </strong>{" "}
            después del procesamiento.
            El resultado puede descargarse como
            archivo PNG para conservar la
            transparencia.
          </p>

          <h2
            style={{
              color:
                "#ffffff",
              fontSize:
                "27px",
              marginTop:
                "35px",
            }}
          >
            Fondo blanco para fotos de documentos
          </h2>

          <p>
            También puedes elegir un fondo
            blanco después de eliminar el fondo
            original. Esto puede ser útil para
            determinados documentos, fotografías
            de perfil y otros usos.
            Los requisitos oficiales para fotos
            de pasaporte o visado dependen del
            país y del documento, por lo que
            siempre debes comprobar las
            especificaciones oficiales.
          </p>

          <h2
            style={{
              color:
                "#ffffff",
              fontSize:
                "27px",
              marginTop:
                "35px",
            }}
          >
            Cómo quitar el fondo de una foto
          </h2>

          <ol>
            <li>
              Sube tu foto en formato JPG,
              PNG o WebP.
            </li>

            <li>
              Espera a que el procesamiento
              basado en IA termine.
            </li>

            <li>
              Selecciona Transparente, Blanco,
              Azul o Rojo.
            </li>

            <li>
              Descarga tu imagen PNG.
            </li>
          </ol>

          <h2
            style={{
              color:
                "#ffffff",
              fontSize:
                "27px",
              marginTop:
                "35px",
            }}
          >
            Preguntas frecuentes
          </h2>

          <div
            style={{
              display:
                "grid",
              gap:
                "12px",
              marginTop:
                "18px",
            }}
          >
            {[
              {
                q:
                  "¿Es gratis NEXORA Background Remover?",
                a:
                  "Sí. Puedes utilizar esta herramienta gratuitamente y no necesitas crear una cuenta.",
              },
              {
                q:
                  "¿Qué formatos puedo subir?",
                a:
                  "Puedes subir imágenes JPG, PNG y WebP.",
              },
              {
                q:
                  "¿Puedo crear un fondo transparente?",
                a:
                  "Sí. Selecciona Transparente después de eliminar el fondo y descarga el resultado como PNG.",
              },
              {
                q:
                  "¿Puedo utilizarlo en un teléfono?",
                a:
                  "Sí. La herramienta está diseñada para funcionar en navegadores modernos de teléfonos y ordenadores.",
              },
              {
                q:
                  "¿NEXORA añade una marca de agua?",
                a:
                  "No. NEXORA no añade su propia marca de agua a la imagen generada.",
              },
              {
                q:
                  "¿Se procesa la imagen en el navegador?",
                a:
                  "Sí. El procesamiento de eliminación del fondo se realiza en el navegador.",
              },
            ].map(
              (item) => (
                <details
                  key={
                    item.q
                  }
                  style={{
                    background:
                      "rgba(255,255,255,.035)",
                    border:
                      "1px solid rgba(255,255,255,.07)",
                    borderRadius:
                      "12px",
                    padding:
                      "15px 17px",
                  }}
                >
                  <summary
                    style={{
                      cursor:
                        "pointer",
                      fontWeight:
                        700,
                      color:
                        "#ffffff",
                    }}
                  >
                    {item.q}
                  </summary>

                  <p
                    style={{
                      margin:
                        "12px 0 0",
                      color:
                        "#9da7bd",
                    }}
                  >
                    {item.a}
                  </p>
                </details>
              )
            )}
          </div>
        </article>

        {/* OTHER TOOLS */}
        <section
          style={{
            marginTop:
              "55px",
            padding:
              "25px",
            borderRadius:
              "18px",
            background:
              "linear-gradient(135deg,rgba(124,108,255,.08),rgba(39,213,195,.06))",
            border:
              "1px solid rgba(255,255,255,.07)",
          }}
        >
          <h2
            style={{
              marginTop:
                0,
              color:
                "#ffffff",
            }}
          >
            Más herramientas gratuitas de NEXORA
          </h2>

          <p
            style={{
              color:
                "#9da7bd",
            }}
          >
            Explora otras herramientas gratuitas
            de NEXORA para trabajar con imágenes,
            PDF y otros archivos.
          </p>

          <div
            style={{
              display:
                "flex",
              flexWrap:
                "wrap",
              gap:
                "10px",
              marginTop:
                "16px",
            }}
          >
            <a
              href="/"
              style={{
                color:
                  "#c9c3ff",
                textDecoration:
                  "none",
                padding:
                  "9px 13px",
                border:
                  "1px solid rgba(124,108,255,.25)",
                borderRadius:
                  "9px",
              }}
            >
              Inicio de NEXORA
            </a>

            <a
              href="/bmi-calculator/"
              style={{
                color:
                  "#c9c3ff",
                textDecoration:
                  "none",
                padding:
                  "9px 13px",
                border:
                  "1px solid rgba(124,108,255,.25)",
                borderRadius:
                  "9px",
              }}
            >
              Calculadora de IMC
            </a>

            <a
              href="/age-calculator/"
              style={{
                color:
                  "#c9c3ff",
                textDecoration:
                  "none",
                padding:
                  "9px 13px",
                border:
                  "1px solid rgba(124,108,255,.25)",
                borderRadius:
                  "9px",
              }}
            >
              Calculadora de edad
            </a>

            <a
              href="/percentage-calculator/"
              style={{
                color:
                  "#c9c3ff",
                textDecoration:
                  "none",
                padding:
                  "9px 13px",
                border:
                  "1px solid rgba(124,108,255,.25)",
                borderRadius:
                  "9px",
              }}
            >
              Calculadora de porcentajes
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            marginTop:
              "50px",
            paddingTop:
              "25px",
            borderTop:
              "1px solid rgba(255,255,255,.08)",
            textAlign:
              "center",
            color:
              "#7f899f",
            fontSize:
              "13px",
          }}
        >
          <p>
            © {new Date().getFullYear()} NEXORA.
            Todas las herramientas gratuitas.
          </p>

          <p>
            Creado por Ayush Chauhan
          </p>
        </footer>
      </div>
    </main>
  );
}
