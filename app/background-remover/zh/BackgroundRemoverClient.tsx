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
    useState("上传照片即可开始");

  const [progress, setProgress] =
    useState(0);

  const [showPreview, setShowPreview] =
    useState(false);

  const [info, setInfo] =
    useState("");

  const [uploadText, setUploadText] =
    useState("选择照片");

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

      if (
        Math.abs(target - current) <
        0.2
      ) {
        smoothProgressDisplay.current =
          target;
      } else {
        smoothProgressDisplay.current =
          current +
          (target - current) *
            0.08;
      }

      setProgress(
        Math.round(
          smoothProgressDisplay.current
        )
      );

      progressAnimationRef.current =
        requestAnimationFrame(
          animate
        );
    };

    progressAnimationRef.current =
      requestAnimationFrame(
        animate
      );

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
    if (
      window.__nexoraRemoveBg
    ) {
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
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              100
            )
        );

        attempts++;
      }

      if (
        window.__nexoraRemoveBg
      ) {
        setLibReady(true);

        return window.__nexoraRemoveBg;
      }

      throw new Error(
        "无法加载图片处理引擎。"
      );
    }

    window.__nexoraRemoveBgLoading =
      true;

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
      console.error(
        error
      );

      throw new Error(
        "无法加载背景移除引擎。"
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
          URL.createObjectURL(
            file
          );

        img.onload = () => {
          URL.revokeObjectURL(
            url
          );

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

          if (
            scale < 1
          ) {
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
                  "无法准备图片。"
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
                      "无法准备图片。"
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
          URL.revokeObjectURL(
            url
          );

          reject(
            new Error(
              "无法读取图片。"
            )
          );
        };

        img.src =
          url;
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
              "找不到图片预览区域。"
            )
          );

          return;
        }

        const url =
          URL.createObjectURL(
            blob
          );

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
            URL.revokeObjectURL(
              url
            );

            reject(
              new Error(
                "无法创建图片预览。"
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

          URL.revokeObjectURL(
            url
          );

          resolve();
        };

        img.onerror = () => {
          URL.revokeObjectURL(
            url
          );

          reject(
            new Error(
              "无法显示处理后的图片。"
            )
          );
        };

        img.src =
          url;
      }
    );
  };

  /*
   * Process image
   */
  const processImage = async (
    file: File
  ) => {
    if (
      loadingRef.current
    ) {
      return;
    }

    loadingRef.current =
      true;

    setIsProcessing(
      true
    );

    setShowPreview(
      false
    );

    setInfo("");

    setUploadText(
      "正在处理图片..."
    );

    smoothProgressTarget.current =
      2;

    setStatus(
      "正在启动 AI 图片处理..."
    );

    try {
      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        throw new Error(
          "请选择有效的图片文件。"
        );
      }

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
        throw new Error(
          "支持的格式：JPG、PNG 和 WebP。"
        );
      }

      if (
        file.size >
        25 * 1024 * 1024
      ) {
        throw new Error(
          "图片太大。最大文件大小为 25 MB。"
        );
      }

      smoothProgressTarget.current =
        8;

      setStatus(
        "正在准备图片..."
      );

      const prepared =
        await prepareImage(
          file
        );

      smoothProgressTarget.current =
        15;

      setStatus(
        "正在准备 AI 资源..."
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
                      "AI 引擎加载时间过长，请重试。"
                    )
                  ),
                45000
              )
          ),
        ]);

      smoothProgressTarget.current =
        28;

      setStatus(
        "AI 已准备就绪，正在分析图片..."
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
                  "正在移除背景..."
                );
              } else if (
                percent < 90
              ) {
                setStatus(
                  "正在优化图片边缘..."
                );
              } else {
                setStatus(
                  "正在准备最终图片..."
                );
              }
            },
          }
        );

      smoothProgressTarget.current =
        96;

      setStatus(
        "正在准备最终图片..."
      );

      blobRef.current =
        result;

      await drawResult(
        result
      );

      smoothProgressTarget.current =
        100;

      setStatus(
        "背景移除成功"
      );

      setInfo(
        "你的图片已经准备好，可以下载了。"
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
          : "图片处理失败。";

      setStatus(
        "图片处理失败"
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
        "选择其他照片"
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
        "请先处理一张图片。"
      );

      return;
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setInfo(
            "无法创建 PNG 文件。"
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
          "PNG 下载成功。"
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
      "上传照片即可开始"
    );

    setProgress(
      0
    );

    smoothProgressTarget.current =
      0;

    smoothProgressDisplay.current =
      0;

    setUploadText(
      "选择照片"
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
            NEXORA • 免费在线工具
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
            免费在线图片去背景
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
            免费去除照片背景，生成透明 PNG，
            或添加白色、蓝色和红色背景。
            直接在浏览器中完成处理。
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
                JPG、PNG、WebP • 浏览器处理 • 无需注册
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
                  选择背景
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
                        "透明",
                    },
                    {
                      value:
                        "#ffffff" as BackgroundColor,
                      label:
                        "白色",
                    },
                    {
                      value:
                        "#6366f1" as BackgroundColor,
                      label:
                        "蓝色",
                    },
                    {
                      value:
                        "#ef4444" as BackgroundColor,
                      label:
                        "红色",
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
                  下载 PNG
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
                  去除另一张图片的背景
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
                "快速处理",
              text:
                "直接在浏览器中处理图片。",
            },
            {
              icon:
                "🔒",
              title:
                "浏览器处理",
              text:
                "背景移除处理在你的浏览器中进行。",
            },
            {
              icon:
                "🖼️",
              title:
                "透明 PNG",
              text:
                "轻松创建透明背景的 PNG 图片。",
            },
            {
              icon:
                "💧",
              title:
                "无水印",
              text:
                "NEXORA 不会在生成的图片上添加自己的水印。",
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
            在线免费去除图片背景
          </h2>

          <p>
            NEXORA Background Remover
            是一款免费的在线图片去背景工具。
            你可以使用它处理产品照片、个人头像、
            文件照片、社交媒体图片、演示文稿
            以及其他各种图片。
          </p>

          <p>
            上传 JPG、PNG 或 WebP 图片后，
            浏览器中的 AI 处理功能会分析图片
            并去除原始背景。处理完成后，
            你可以保留透明背景，也可以选择
            白色、蓝色或红色背景。
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
            不使用 Photoshop 也能去除图片背景
          </h2>

          <p>
            如果你只需要快速去除图片背景，
            不必安装复杂的图片编辑软件。
            NEXORA 可以直接在现代浏览器中运行，
            支持手机、平板电脑和桌面设备。
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
            创建透明背景 PNG 图片
          </h2>

          <p>
            如果你需要没有背景的图片，
            在背景移除完成后选择
            <strong>
              {" "}
              “透明”
            </strong>{" "}
            选项。
            然后即可下载 PNG 文件并保留透明背景。
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
            为证件照片添加白色背景
          </h2>

          <p>
            去除原始背景后，你可以选择白色背景。
            这对于部分证件照片、个人照片和其他
            图片用途可能很方便。
            但是，不同国家和不同证件的官方照片
            要求可能不同，因此请务必查看相关官方要求。
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
            如何去除照片背景
          </h2>

          <ol>
            <li>
              上传 JPG、PNG 或 WebP 图片。
            </li>

            <li>
              等待浏览器中的 AI 完成背景处理。
            </li>

            <li>
              选择透明、白色、蓝色或红色背景。
            </li>

            <li>
              下载处理完成的 PNG 图片。
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
            常见问题
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
                  "NEXORA 图片去背景工具免费吗？",
                a:
                  "是的。该工具可以免费使用，不需要创建账户。",
              },
              {
                q:
                  "支持哪些图片格式？",
                a:
                  "支持 JPG、PNG 和 WebP 图片。",
              },
              {
                q:
                  "可以制作透明背景吗？",
                a:
                  "可以。去除背景后选择“透明”，然后下载 PNG 图片。",
              },
              {
                q:
                  "可以在手机上使用吗？",
                a:
                  "可以。该工具支持现代手机和桌面浏览器。",
              },
              {
                q:
                  "生成的图片有水印吗？",
                a:
                  "没有。NEXORA 不会在生成的图片上添加自己的水印。",
              },
              {
                q:
                  "图片是在浏览器中处理的吗？",
                a:
                  "是的。背景移除处理在浏览器中进行。",
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
            NEXORA 其他免费工具
          </h2>

          <p
            style={{
              color:
                "#9da7bd",
            }}
          >
            探索 NEXORA 的其他免费在线工具，
            帮助你处理图片、PDF 和其他文件。
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
              NEXORA 首页
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
              BMI 计算器
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
              年龄计算器
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
              百分比计算器
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
            © {new Date().getFullYear()} NEXORA。
            所有工具均可免费使用。
          </p>

          <p>
            由 Ayush Chauhan 创建
          </p>
        </footer>
      </div>
    </main>
  );
}
