"use client";

import { useEffect, useRef, useState } from "react";
import removeBackground from "@imgly/background-removal";

type Doc = {
  id: string;
  label: string;
  country?: string;
  w: number;
  h: number;
  mm?: string;
  kb?: number;
};

type CropPosition = {
  x: number;
  y: number;
};

type BackgroundMode = "original" | "color";

const DOCS: Doc[] = [
  {
    id: "passport-india",
    label: "Passport India",
    country: "India",
    w: 413,
    h: 531,
    mm: "35×45 mm",
  },
  {
    id: "passport-usa",
    label: "Passport USA",
    country: "USA",
    w: 600,
    h: 600,
    mm: "2×2 inch",
  },
  {
    id: "visa-usa",
    label: "Visa USA",
    country: "USA",
    w: 600,
    h: 600,
    mm: "2×2 inch",
  },
  {
    id: "visa-uk",
    label: "Visa UK",
    country: "UK",
    w: 413,
    h: 531,
    mm: "35×45 mm",
  },
  {
    id: "visa-schengen",
    label: "Visa Schengen",
    country: "Europe",
    w: 413,
    h: 531,
    mm: "35×45 mm",
  },
  {
    id: "visa-canada",
    label: "Visa Canada",
    country: "Canada",
    w: 413,
    h: 531,
    mm: "35×45 mm",
  },
  {
    id: "visa-australia",
    label: "Visa Australia",
    country: "Australia",
    w: 413,
    h: 531,
    mm: "35×45 mm",
  },
  {
    id: "visa-japan",
    label: "Visa Japan",
    country: "Japan",
    w: 413,
    h: 531,
    mm: "35×45 mm",
  },
  {
    id: "visa-korea",
    label: "Visa Korea",
    country: "South Korea",
    w: 413,
    h: 531,
    mm: "35×45 mm",
  },
  {
    id: "visa-dubai",
    label: "Visa Dubai",
    country: "UAE",
    w: 413,
    h: 531,
    mm: "35×45 mm",
  },
  {
    id: "visa-china",
    label: "Visa China",
    country: "China",
    w: 390,
    h: 567,
    mm: "33×48 mm",
  },
  {
    id: "ssc",
    label: "SSC Photo",
    country: "India",
    w: 200,
    h: 230,
    kb: 20,
  },
  {
    id: "ibps",
    label: "IBPS Photo",
    country: "India",
    w: 200,
    h: 230,
    kb: 20,
  },
  {
    id: "railway",
    label: "Railway Photo",
    country: "India",
    w: 200,
    h: 230,
    kb: 20,
  },
  {
    id: "upsc",
    label: "UPSC Photo",
    country: "India",
    w: 300,
    h: 350,
    kb: 50,
  },
  {
    id: "bank",
    label: "Bank Photo",
    country: "India",
    w: 300,
    h: 350,
    kb: 50,
  },
  {
    id: "pan",
    label: "PAN Card",
    country: "India",
    w: 400,
    h: 300,
    mm: "35×25 mm",
  },
  {
    id: "aadhaar",
    label: "Aadhaar",
    country: "India",
    w: 300,
    h: 400,
  },
  {
    id: "driving-license",
    label: "Driving License",
    country: "India",
    w: 300,
    h: 350,
  },
  {
    id: "voter-id",
    label: "Voter ID",
    country: "India",
    w: 300,
    h: 400,
  },
  {
    id: "oci",
    label: "OCI Photo",
    country: "India",
    w: 600,
    h: 600,
  },
  {
    id: "stamp",
    label: "Stamp Photo",
    w: 300,
    h: 400,
  },
  {
    id: "one-inch",
    label: "1×1 Inch",
    w: 400,
    h: 400,
    mm: "1×1 inch",
  },
  {
    id: "college-id",
    label: "College ID",
    w: 300,
    h: 400,
  },
  {
    id: "resume",
    label: "Resume Photo",
    w: 400,
    h: 500,
  },
];

const MAX_SOURCE_DIMENSION = 6000;
const MIN_DIMENSION = 50;
const MAX_DIMENSION = 2000;
const MIN_TARGET_KB = 5;
const MAX_TARGET_KB = 5000;

const BG_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Blue", value: "#2563eb" },
  { name: "Red", value: "#dc2626" },
  { name: "Green", value: "#16a34a" },
  { name: "Black", value: "#000000" },
];

export default function PassportClient() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [sel, setSel] = useState<Doc>(DOCS[0]);

  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [customKB, setCustomKB] = useState("");

  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [origKB, setOrigKB] = useState(0);
  const [newKB, setNewKB] = useState(0);

  const [cropPosition, setCropPosition] = useState<CropPosition>({
    x: 50,
    y: 50,
  });

  const [backgroundMode, setBackgroundMode] =
    useState<BackgroundMode>("original");

  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const [sourceFile, setSourceFile] = useState<File | null>(null);

  const [foregroundBlob, setForegroundBlob] = useState<Blob | null>(null);

  const [foregroundImage, setForegroundImage] =
    useState<HTMLImageElement | null>(null);

  const [backgroundProcessing, setBackgroundProcessing] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const current = sel;

  function getCurrent(): Doc {
    return {
      ...current,
      w: Math.max(
        MIN_DIMENSION,
        Math.min(
          MAX_DIMENSION,
          Number(customW) || current.w
        )
      ),
      h: Math.max(
        MIN_DIMENSION,
        Math.min(
          MAX_DIMENSION,
          Number(customH) || current.h
        )
      ),
      kb:
        Number(customKB) >= MIN_TARGET_KB &&
        Number(customKB) <= MAX_TARGET_KB
          ? Number(customKB)
          : current.kb,
    };
  }

  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to load processed image."));
      };

      image.src = url;
    });
  }

  function loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to read the selected image."));
      };

      image.src = url;
    });
  }

  async function getSourceImage(): Promise<HTMLImageElement | null> {
    if (!img) return null;

    const maxSide = Math.max(img.naturalWidth, img.naturalHeight);

    if (maxSide <= MAX_SOURCE_DIMENSION) {
      return img;
    }

    const scale = MAX_SOURCE_DIMENSION / maxSide;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = Math.round(img.naturalWidth * scale);
    tempCanvas.height = Math.round(img.naturalHeight * scale);

    const ctx = tempCanvas.getContext("2d");

    if (!ctx) {
      return img;
    }

    ctx.drawImage(
      img,
      0,
      0,
      tempCanvas.width,
      tempCanvas.height
    );

    const blob = await new Promise<Blob | null>((resolve) => {
      tempCanvas.toBlob(resolve, "image/jpeg", 0.95);
    });

    if (!blob) {
      return img;
    }

    return loadImageFromBlob(blob);
  }

  function drawCoverImage(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    width: number,
    height: number,
    position: CropPosition
  ) {
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;

    const sourceRatio = sourceWidth / sourceHeight;
    const targetRatio = width / height;

    let cropWidth = sourceWidth;
    let cropHeight = sourceHeight;

    if (sourceRatio > targetRatio) {
      cropWidth = sourceHeight * targetRatio;
    } else {
      cropHeight = sourceWidth / targetRatio;
    }

    const maxX = sourceWidth - cropWidth;
    const maxY = sourceHeight - cropHeight;

    const sx = maxX * (clamp(position.x, 0, 100) / 100);
    const sy = maxY * (clamp(position.y, 0, 100) / 100);

    ctx.drawImage(
      image,
      sx,
      sy,
      cropWidth,
      cropHeight,
      0,
      0,
      width,
      height
    );
  }

  async function createCanvas(
    width?: number,
    height?: number
  ): Promise<HTMLCanvasElement | null> {
    const sourceImage = await getSourceImage();

    if (!sourceImage) {
      return null;
    }

    const s = getCurrent();

    const finalWidth = width || s.w;
    const finalHeight = height || s.h;

    const outputCanvas = document.createElement("canvas");

    outputCanvas.width = finalWidth;
    outputCanvas.height = finalHeight;

    const ctx = outputCanvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (backgroundMode === "color" && foregroundImage) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, finalWidth, finalHeight);

      drawCoverImage(
        ctx,
        foregroundImage,
        finalWidth,
        finalHeight,
        cropPosition
      );
    } else {
      drawCoverImage(
        ctx,
        sourceImage,
        finalWidth,
        finalHeight,
        cropPosition
      );
    }

    return outputCanvas;
  }

  function canvasToBlob(
    targetCanvas: HTMLCanvasElement,
    quality = 0.92
  ): Promise<Blob | null> {
    return new Promise((resolve) => {
      targetCanvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        quality
      );
    });
  }

  async function renderPreview() {
    if (!img) return;

    const s = getCurrent();

    const c = await createCanvas(s.w, s.h);

    if (!c) {
      setStatus("Unable to create the preview.");
      return;
    }

    setCanvas(c);

    const previewBlob = await canvasToBlob(c, 0.92);

    if (!previewBlob) {
      setStatus("Unable to generate the preview.");
      return;
    }

    const url = URL.createObjectURL(previewBlob);

    setPreview((old) => {
      if (old) {
        URL.revokeObjectURL(old);
      }
      return url;
    });

    setNewKB(previewBlob.size / 1024);
  }

  async function processImage() {
    if (!img) return;

    setProcessing(true);
    setIsSuccess(false);
    setStatus("Creating your photo...");

    try {
      await renderPreview();

      setIsSuccess(true);
      setStatus("Photo ready.");
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong while processing the photo.");
      setIsSuccess(false);
    } finally {
      setProcessing(false);
    }
  }

  async function prepareForeground() {
    if (!sourceFile) {
      setStatus("Please upload a photo first.");
      return;
    }

    if (foregroundBlob && foregroundImage) {
      return;
    }

    setBackgroundProcessing(true);
    setProcessing(true);
    setIsSuccess(false);
    setStatus("Removing the original background...");

    try {
      const result = await removeBackground(sourceFile, {
        model: "medium",
        proxyToWorker: true,
        output: {
          format: "image/png",
          quality: 1,
          type: "foreground",
        },
      });

      const blob =
        result instanceof Blob
          ? result
          : new Blob([result], { type: "image/png" });

      const transparentImage = await loadImageFromBlob(blob);

      setForegroundBlob(blob);
      setForegroundImage(transparentImage);

      setStatus("Background removed. Preparing your photo...");

      await renderPreview();

      setIsSuccess(true);
      setStatus("Color background applied.");
    } catch (error) {
      console.error("Background removal failed:", error);

      setStatus(
        "Background removal failed. Please try another photo or use Original Background."
      );

      setBackgroundMode("original");
      setForegroundBlob(null);
      setForegroundImage(null);
      setIsSuccess(false);
    } finally {
      setBackgroundProcessing(false);
      setProcessing(false);
    }
  }

  async function handleFile(file: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("Please select a JPG, PNG, WEBP, or other image file.");
      return;
    }

    setProcessing(true);
    setIsSuccess(false);
    setStatus("Loading your photo...");

    try {
      const image = await loadImageFromFile(file);

      setSourceFile(file);
      setImg(image);

      setOrigW(image.naturalWidth);
      setOrigH(image.naturalHeight);
      setOrigKB(file.size / 1024);

      setForegroundBlob(null);
      setForegroundImage(null);

      setBackgroundMode("original");

      setCropPosition({
        x: 50,
        y: 50,
      });

      setStatus("Photo loaded. Creating preview...");

      const s = getCurrent();

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = s.w;
      outputCanvas.height = s.h;

      const ctx = outputCanvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas is not supported.");
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      drawCoverImage(
        ctx,
        image,
        s.w,
        s.h,
        { x: 50, y: 50 }
      );

      const blob = await canvasToBlob(outputCanvas, 0.92);

      if (!blob) {
        throw new Error("Preview creation failed.");
      }

      setCanvas(outputCanvas);

      const url = URL.createObjectURL(blob);

      setPreview((old) => {
        if (old) {
          URL.revokeObjectURL(old);
        }
        return url;
      });

      setNewKB(blob.size / 1024);

      setStatus("Photo ready.");
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setStatus(
        "Unable to process this image. Please try another photo."
      );
      setIsSuccess(false);
    } finally {
      setProcessing(false);
    }
  }

  function selectDoc(doc: Doc) {
    setSel(doc);

    setCustomW(String(doc.w));
    setCustomH(String(doc.h));
    setCustomKB(doc.kb ? String(doc.kb) : "");

    setStatus(
      `${doc.label} selected — ${doc.w}×${doc.h}px`
    );

    if (img) {
      setTimeout(() => {
        processImage();
      }, 0);
    }
  }

  function applyCustom() {
    const w = clamp(
      Number(customW) || current.w,
      MIN_DIMENSION,
      MAX_DIMENSION
    );

    const h = clamp(
      Number(customH) || current.h,
      MIN_DIMENSION,
      MAX_DIMENSION
    );

    setCustomW(String(w));
    setCustomH(String(h));

    setStatus(`Custom size applied — ${w}×${h}px`);

    if (img) {
      setTimeout(() => {
        processImage();
      }, 0);
    }
  }

  function updateCrop(
    axis: "x" | "y",
    value: number
  ) {
    setCropPosition((prev) => ({
      ...prev,
      [axis]: value,
    }));

    if (img) {
      setTimeout(() => {
        processImage();
      }, 0);
    }
  }

  async function changeBackgroundMode(
    mode: BackgroundMode
  ) {
    if (mode === backgroundMode) return;

    if (mode === "original") {
      setBackgroundMode("original");
      setStatus("Original background restored.");

      setTimeout(() => {
        processImage();
      }, 0);

      return;
    }

    setBackgroundMode("color");

    await prepareForeground();
  }

  async function changeBackgroundColor(
    color: string
  ) {
    setBackgroundColor(color);

    if (!img) return;

    if (!foregroundImage) {
      await prepareForeground();
      return;
    }

    setStatus("Applying background color...");

    setTimeout(async () => {
      await processImage();
      setStatus("Background color applied.");
    }, 0);
  }

  async function compressToTarget(
    sourceCanvas: HTMLCanvasElement,
    targetKB: number
  ): Promise<{
    blob: Blob;
    canvas: HTMLCanvasElement;
  }> {
    let workingCanvas = sourceCanvas;

    let quality = 0.92;

    let blob = await canvasToBlob(
      workingCanvas,
      quality
    );

    if (!blob) {
      throw new Error("Unable to create output file.");
    }

    if (blob.size / 1024 <= targetKB) {
      return {
        blob,
        canvas: workingCanvas,
      };
    }

    let low = 0.35;
    let high = 0.92;

    for (let i = 0; i < 8; i++) {
      const q = (low + high) / 2;

      const testBlob = await canvasToBlob(
        workingCanvas,
        q
      );

      if (!testBlob) continue;

      const sizeKB = testBlob.size / 1024;

      if (sizeKB <= targetKB) {
        blob = testBlob;
        low = q;
      } else {
        high = q;
      }
    }

    if (blob.size / 1024 <= targetKB) {
      return {
        blob,
        canvas: workingCanvas,
      };
    }

    let width = workingCanvas.width;
    let height = workingCanvas.height;

    for (let i = 0; i < 8; i++) {
      width = Math.max(
        MIN_DIMENSION,
        Math.round(width * 0.9)
      );

      height = Math.max(
        MIN_DIMENSION,
        Math.round(height * 0.9)
      );

      const smallerCanvas =
        document.createElement("canvas");

      smallerCanvas.width = width;
      smallerCanvas.height = height;

      const ctx = smallerCanvas.getContext("2d");

      if (!ctx) break;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        workingCanvas,
        0,
        0,
        width,
        height
      );

      let smallerBlob = await canvasToBlob(
        smallerCanvas,
        0.82
      );

      if (!smallerBlob) continue;

      let qLow = 0.35;
      let qHigh = 0.9;

      for (let j = 0; j < 6; j++) {
        const q = (qLow + qHigh) / 2;

        const test = await canvasToBlob(
          smallerCanvas,
          q
        );

        if (!test) continue;

        if (test.size / 1024 <= targetKB) {
          smallerBlob = test;
          qLow = q;
        } else {
          qHigh = q;
        }
      }

      blob = smallerBlob;
      workingCanvas = smallerCanvas;

      if (blob.size / 1024 <= targetKB) {
        break;
      }
    }

    return {
      blob,
      canvas: workingCanvas,
    };
  }

  async function download() {
    if (!img || processing || backgroundProcessing) {
      return;
    }

    setProcessing(true);
    setStatus("Preparing your download...");

    let popup: Window | null = null;

    const isIOS =
      typeof navigator !== "undefined" &&
      /iPad|iPhone|iPod/.test(navigator.userAgent);

    try {
      /*
       * Open the iOS window immediately from the click event.
       * This helps prevent popup blocking after async processing.
       */
      if (isIOS && typeof window !== "undefined") {
        popup = window.open("", "_blank");
      }

      if (
        backgroundMode === "color" &&
        !foregroundImage
      ) {
        await prepareForeground();
      }

      const s = getCurrent();

      const finalCanvas = await createCanvas(
        s.w,
        s.h
      );

      if (!finalCanvas) {
        throw new Error(
          "Unable to create the final image."
        );
      }

      let finalBlob = await canvasToBlob(
        finalCanvas,
        0.94
      );

      if (!finalBlob) {
        throw new Error(
          "Unable to create the final download."
        );
      }

      let outputCanvas = finalCanvas;

      if (s.kb) {
        const compressed =
          await compressToTarget(
            finalCanvas,
            s.kb
          );

        finalBlob = compressed.blob;
        outputCanvas = compressed.canvas;
      }

      const actualKB =
        finalBlob.size / 1024;

      setNewKB(actualKB);

      const bgName =
        backgroundMode === "original"
          ? "Original-BG"
          : `${backgroundColor
              .replace("#", "")
              .toUpperCase()}-BG`;

      const safeLabel =
        s.label.replace(/[^a-zA-Z0-9]+/g, "-");

      const fileName =
        `NEXORA-${safeLabel}-${outputCanvas.width}x${outputCanvas.height}-${bgName}.jpg`;

      /*
       * iOS/iPadOS:
       * Prefer Web Share when file sharing is available.
       * Otherwise open the image and let the user use
       * Share → Save to Photos.
       */
      if (
        isIOS &&
        typeof navigator !== "undefined"
      ) {
        const shareFile = new File(
          [finalBlob],
          fileName,
          {
            type: "image/jpeg",
          }
        );

        const canShareFiles =
          typeof navigator.canShare === "function" &&
          navigator.canShare({
            files: [shareFile],
          });

        if (
          canShareFiles &&
          typeof navigator.share === "function"
        ) {
          try {
            await navigator.share({
              files: [shareFile],
              title: "NEXORA Passport Photo",
              text: "Your passport photo is ready.",
            });

            setStatus(
              "Photo shared successfully."
            );
          } catch (shareError: any) {
            /*
             * User closing the share sheet is not
             * considered a download failure.
             */
            if (
              shareError?.name ===
              "AbortError"
            ) {
              setStatus(
                "Share cancelled."
              );
            } else {
              throw shareError;
            }
          }
        } else {
          const url =
            URL.createObjectURL(finalBlob);

          if (popup && !popup.closed) {
            popup.location.href = url;
          } else {
            window.location.href = url;
          }

          setStatus(
            "Photo opened. Tap Share → Save to Photos."
          );

          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 60000);
        }
      } else {
        /*
         * Android / Chrome / Edge / Firefox / Desktop:
         * normal download flow.
         */
        const url =
          URL.createObjectURL(finalBlob);

        const link =
          document.createElement("a");

        link.href = url;
        link.download = fileName;
        link.rel = "noopener";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setStatus(
          `Download ready — ${actualKB.toFixed(1)} KB`
        );

        /*
         * Keep the object URL alive long enough
         * for slower mobile browsers.
         */
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 60000);
      }

      if (
        typeof window !== "undefined" &&
        typeof (window as any).gtag ===
          "function"
      ) {
        (window as any).gtag(
          "event",
          "passport_photo_download",
          {
            event_category:
              "Image Tools",
            event_label: s.label,
            target_kb:
              s.kb || undefined,
            output_width:
              outputCanvas.width,
            output_height:
              outputCanvas.height,
            output_kb:
              Number(
                actualKB.toFixed(1)
              ),
            background_mode:
              backgroundMode,
            background_color:
              backgroundMode === "color"
                ? backgroundColor
                : undefined,
          }
        );
      }

      setIsSuccess(true);
    } catch (error) {
      console.error(
        "Download failed:",
        error
      );

      if (popup && !popup.closed) {
        try {
          popup.close();
        } catch {}
      }

      setStatus(
        "Download failed. Please try again."
      );

      setIsSuccess(false);
    } finally {
      setProcessing(false);
    }
  }

  function clearAll() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImg(null);
    setPreview("");
    setCanvas(null);

    setSourceFile(null);
    setForegroundBlob(null);
    setForegroundImage(null);

    setOrigW(0);
    setOrigH(0);
    setOrigKB(0);
    setNewKB(0);

    setBackgroundMode("original");
    setBackgroundColor("#ffffff");

    setCropPosition({
      x: 50,
      y: 50,
    });

    setStatus("");
    setIsSuccess(false);
    setProcessing(false);
    setBackgroundProcessing(false);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <main className="min-h-screen bg-[#080d1b] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080d1b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a
            href="/"
            className="text-xl font-black tracking-tight"
          >
            NEXORA
          </a>

          <nav className="hidden gap-6 text-sm text-white/70 sm:flex">
            <a
              href="/"
              className="transition hover:text-white"
            >
              Home
            </a>

            <a
              href="/about"
              className="transition hover:text-white"
            >
              About
            </a>

            <a
              href="/contact"
              className="transition hover:text-white"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 text-center">
        <div className="mx-auto mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold tracking-wide text-cyan-300">
          FREE • HD • NO WATERMARK • PRIVATE
        </div>

        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          Passport Photo Maker
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
          Create passport, visa, ID and document photos
          in the correct size. Process your photo directly
          in your browser.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            {/* Upload */}
            <div>
              <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 text-3xl">
                  📷
                </div>

                <h2 className="text-xl font-bold">
                  Upload Your Photo
                </h2>

                <p className="mt-2 text-sm text-white/50">
                  JPG, PNG, WEBP and other common image
                  formats are supported.
                </p>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];

                    if (file) {
                      handleFile(file);
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    fileRef.current?.click()
                  }
                  className="mt-6 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-6 py-3 font-bold text-black shadow-lg transition hover:scale-[1.02]"
                >
                  Choose Photo
                </button>
              </div>

              {img && (
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold">
                        Original Photo
                      </div>

                      <div className="mt-1 text-xs text-white/50">
                        {origW} × {origH}px •{" "}
                        {origKB.toFixed(1)} KB
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={clearAll}
                      className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-400/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Document selection */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  Select Document Size
                </h2>

                <span className="text-xs text-white/40">
                  {current.w} × {current.h}px
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {DOCS.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() =>
                      selectDoc(doc)
                    }
                    className={`min-w-[150px] rounded-xl border px-4 py-3 text-left transition ${
                      sel.id === doc.id
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    }`}
                  >
                    <div className="text-sm font-bold">
                      {doc.label}
                    </div>

                    <div className="mt-1 text-xs text-white/40">
                      {doc.w} × {doc.h}px
                    </div>

                    {doc.mm && (
                      <div className="mt-1 text-xs text-cyan-300/70">
                        {doc.mm}
                      </div>
                    )}

                    {doc.kb && (
                      <div className="mt-1 text-xs text-yellow-300/70">
                        ≤ {doc.kb} KB
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-3 text-sm font-bold">
                  Custom Size
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="mb-1 block text-[11px] text-white/40">
                      Width
                    </label>

                    <input
                      value={customW}
                      onChange={(e) =>
                        setCustomW(
                          e.target.value
                        )
                      }
                      type="number"
                      min={MIN_DIMENSION}
                      max={MAX_DIMENSION}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] text-white/40">
                      Height
                    </label>

                    <input
                      value={customH}
                      onChange={(e) =>
                        setCustomH(
                          e.target.value
                        )
                      }
                      type="number"
                      min={MIN_DIMENSION}
                      max={MAX_DIMENSION}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] text-white/40">
                      Target KB
                    </label>

                    <input
                      value={customKB}
                      onChange={(e) =>
                        setCustomKB(
                          e.target.value
                        )
                      }
                      type="number"
                      min={MIN_TARGET_KB}
                      max={MAX_TARGET_KB}
                      placeholder="Optional"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={applyCustom}
                  className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 py-2 text-sm font-bold hover:bg-white/10"
                >
                  Apply Custom Size
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          {img && (
            <div className="mt-8 border-t border-white/10 pt-8">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black">
                    Photo Preview
                  </h2>

                  <p className="mt-1 text-sm text-white/50">
                    Adjust the background and crop before
                    downloading.
                  </p>
                </div>

                {isSuccess && (
                  <div className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                    ✓ Ready
                  </div>
                )}
              </div>

              {/* Background mode */}
              <div className="mb-5 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/[0.08] to-indigo-500/[0.08] p-4">
                <div className="mb-3 text-sm font-black">
                  Background
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      changeBackgroundMode(
                        "original"
                      )
                    }
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      backgroundMode ===
                      "original"
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-white/10 bg-black/20 hover:border-white/20"
                    }`}
                  >
                    <div className="text-sm font-bold">
                      Original Background
                    </div>

                    <div className="mt-1 text-xs text-white/40">
                      Keep the actual background
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeBackgroundMode(
                        "color"
                      )
                    }
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      backgroundMode ===
                      "color"
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-white/10 bg-black/20 hover:border-white/20"
                    }`}
                  >
                    <div className="text-sm font-bold">
                      Color Background
                    </div>

                    <div className="mt-1 text-xs text-white/40">
                      Remove background & add color
                    </div>
                  </button>
                </div>

                {backgroundMode ===
                  "color" && (
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-bold text-white/60">
                      Choose Background Color
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {BG_COLORS.map(
                        (color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() =>
                              changeBackgroundColor(
                                color.value
                              )
                            }
                            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition ${
                              backgroundColor ===
                              color.value
                                ? "border-cyan-400 bg-white/10"
                                : "border-white/10 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <span
                              className="h-4 w-4 rounded-full border border-white/30"
                              style={{
                                backgroundColor:
                                  color.value,
                              }}
                            />

                            {color.name}
                          </button>
                        )
                      )}

                      <label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold hover:bg-white/10">
                        <span
                          className="h-4 w-4 rounded-full border border-white/30"
                          style={{
                            backgroundColor:
                              backgroundColor,
                          }}
                        />

                        Custom

                        <input
                          type="color"
                          value={
                            backgroundColor
                          }
                          onChange={(e) =>
                            changeBackgroundColor(
                              e.target.value
                            )
                          }
                          className="h-0 w-0 opacity-0"
                        />
                      </label>
                    </div>

                    {backgroundProcessing && (
                      <div className="mt-3 rounded-lg bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300">
                        Removing the original
                        background. The first run
                        may take longer while the
                        browser prepares the model.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Preview image */}
              <div className="flex justify-center rounded-3xl border border-white/10 bg-[#050914] p-5">
                <div className="relative max-w-full overflow-hidden rounded-xl shadow-2xl">
                  {preview ? (
                    <img
                      src={preview}
                      alt={`${current.label} passport photo preview`}
                      className="block max-h-[520px] max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-80 w-60 items-center justify-center text-sm text-white/40">
                      Preview will appear here
                    </div>
                  )}

                  {(processing ||
                    backgroundProcessing) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                      <div className="rounded-2xl border border-white/10 bg-black/70 px-5 py-4 text-center">
                        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />

                        <div className="text-sm font-bold">
                          {backgroundProcessing
                            ? "Removing background..."
                            : "Processing photo..."}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Background-removal CTA */}
              <a
                href="/background-remover"
                className="mt-5 block rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-500/10 via-cyan-400/10 to-indigo-500/10 p-4 transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xl">
                    ✨
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-black">
                      Need a White or Custom Background?
                    </div>

                    <div className="mt-1 text-xs leading-5 text-white/50">
                      Tap here to remove your photo
                      background and create a clean
                      white or custom background with
                      NEXORA.
                    </div>
                  </div>

                  <div className="ml-auto text-lg text-cyan-300">
                    →
                  </div>
                </div>
              </a>

              {/* Dimensions */}
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs text-white/40">
                    Original
                  </div>

                  <div className="mt-1 font-bold">
                    {origW} × {origH}px
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs text-white/40">
                    Output
                  </div>

                  <div className="mt-1 font-bold">
                    {canvas
                      ? `${canvas.width} × ${canvas.height}px`
                      : `${current.w} × ${current.h}px`}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs text-white/40">
                    Output Size
                  </div>

                  <div className="mt-1 font-bold">
                    {newKB
                      ? `${newKB.toFixed(1)} KB`
                      : "—"}
                  </div>
                </div>
              </div>

              {/* Crop controls */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="mb-4">
                  <h3 className="font-bold">
                    Adjust Crop Position
                  </h3>

                  <p className="mt-1 text-xs text-white/40">
                    Move the image horizontally or
                    vertically inside the selected
                    document frame.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex justify-between text-xs text-white/50">
                      <span>
                        Horizontal
                      </span>

                      <span>
                        {cropPosition.x}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cropPosition.x}
                      onChange={(e) =>
                        updateCrop(
                          "x",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-xs text-white/50">
                      <span>
                        Vertical
                      </span>

                      <span>
                        {cropPosition.y}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cropPosition.y}
                      onChange={(e) =>
                        updateCrop(
                          "y",
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              {status && (
                <div
                  className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                    status.toLowerCase().includes(
                      "failed"
                    ) ||
                    status.toLowerCase().includes(
                      "unable"
                    )
                      ? "border-red-400/20 bg-red-400/10 text-red-300"
                      : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                  }`}
                >
                  {status}
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={download}
                  disabled={
                    processing ||
                    backgroundProcessing
                  }
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-4 font-black text-black shadow-xl transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing ||
                  backgroundProcessing
                    ? "Preparing..."
                    : "Download Photo"}
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white transition hover:bg-white/10"
                >
                  Clear
                </button>
              </div>

              <div className="mt-4 text-center text-xs leading-5 text-white/35">
                Your photo is processed in your
                browser. This tool does not upload your
                photo to a NEXORA server.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Tip */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.04] p-5">
          <div className="text-sm font-black text-yellow-300">
            Quick Tip
          </div>

          <p className="mt-2 text-sm leading-6 text-white/55">
            For official applications, always check the
            latest photo requirements published by the
            relevant government, embassy, university or
            organization before submitting your photo.
          </p>
        </div>
      </section>

      {/* Common sizes */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-2xl font-black">
            Common Passport & Visa Photo Sizes
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "India Passport",
                "35 × 45 mm",
              ],
              [
                "USA Passport",
                "2 × 2 inch",
              ],
              [
                "Schengen Visa",
                "35 × 45 mm",
              ],
              [
                "China Visa",
                "33 × 48 mm",
              ],
            ].map(([name, size]) => (
              <div
                key={name}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div className="text-sm font-bold">
                  {name}
                </div>

                <div className="mt-1 text-xs text-white/40">
                  {size}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-2xl font-black">
            How to Make a Passport Photo
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              [
                "1",
                "Upload",
                "Upload a clear photo from your phone or computer.",
              ],
              [
                "2",
                "Select Size",
                "Choose the passport, visa, ID or document size you need.",
              ],
              [
                "3",
                "Adjust",
                "Choose the original or color background and adjust the crop.",
              ],
              [
                "4",
                "Download",
                "Download the finished photo in JPEG format.",
              ],
            ].map(
              ([number, title, text]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-black text-cyan-300">
                    {number}
                  </div>

                  <div className="mt-4 font-bold">
                    {title}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    {text}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 p-6">
            <h2 className="text-2xl font-black">
              Why Use NEXORA Passport Photo Maker?
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="px-6 py-4">
                    Feature
                  </th>

                  <th className="px-6 py-4">
                    NEXORA
                  </th>

                  <th className="px-6 py-4">
                    Traditional Photo Studio
                  </th>
                </tr>
              </thead>

              <tbody>
                {[
                  [
                    "Online",
                    "✓",
                    "✗",
                  ],
                  [
                    "Free",
                    "✓",
                    "Usually paid",
                  ],
                  [
                    "Multiple sizes",
                    "✓",
                    "Limited",
                  ],
                  [
                    "Background options",
                    "✓",
                    "✓",
                  ],
                  [
                    "Browser processing",
                    "✓",
                    "✗",
                  ],
                ].map(
                  ([feature, nexora, studio]) => (
                    <tr
                      key={feature}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="px-6 py-4 font-bold">
                        {feature}
                      </td>

                      <td className="px-6 py-4 text-cyan-300">
                        {nexora}
                      </td>

                      <td className="px-6 py-4 text-white/40">
                        {studio}
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
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-2xl font-black">
            Frequently Asked Questions
          </h2>

          <div className="mt-6 space-y-3">
            {[
              [
                "Is the Passport Photo Maker free?",
                "Yes. NEXORA Passport Photo Maker is free to use with no watermark.",
              ],
              [
                "Does this tool remove the background?",
                "Yes. Choose Color Background to remove the original background and place the person on a selected color. Choose Original Background to keep the actual background.",
              ],
              [
                "Can I make a white passport photo background?",
                "Yes. Select Color Background and choose White. The tool removes the original background and places the foreground on a white background.",
              ],
              [
                "Can I use the original background?",
                "Yes. Original Background keeps your uploaded photo background while resizing and cropping the image to the selected dimensions.",
              ],
              [
                "Does NEXORA upload my photo?",
                "The photo is processed in your browser. This tool does not upload your photo to a NEXORA server.",
              ],
              [
                "Can I use this on iPhone?",
                "Yes. The tool works on iPhone, iPad, Android phones, tablets and desktop browsers.",
              ],
              [
                "Can I choose a custom size?",
                "Yes. You can enter a custom width, height and optional target file size.",
              ],
              [
                "Can I create a photo under a specific KB limit?",
                "Yes. If a target KB value is provided, NEXORA attempts to compress the image to that size. Very small limits may require reducing output dimensions.",
              ],
              [
                "What format is the downloaded photo?",
                "The final photo is downloaded as a JPEG for broad compatibility with websites, forms and mobile devices.",
              ],
            ].map(
              ([question, answer]) => (
                <details
                  key={question}
                  className="group rounded-xl border border-white/10 bg-black/20"
                >
                  <summary className="cursor-pointer list-none px-5 py-4 font-bold">
                    <div className="flex items-center justify-between gap-4">
                      <span>{question}</span>

                      <span className="text-cyan-300 transition group-open:rotate-45">
                        +
                      </span>
                    </div>
                  </summary>

                  <div className="px-5 pb-5 text-sm leading-6 text-white/50">
                    {answer}
                  </div>
                </details>
              )
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-black">
                NEXORA
              </div>

              <p className="mt-1 text-sm text-white/40">
                Free, fast and simple online tools for
                everyone.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-white/50">
              <a
                href="/about"
                className="hover:text-white"
              >
                About
              </a>

              <a
                href="/privacy-policy"
                className="hover:text-white"
              >
                Privacy Policy
              </a>

              <a
                href="/contact"
                className="hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-white/5 pt-5 text-xs text-white/30">
            © {new Date().getFullYear()} NEXORA.
            All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
