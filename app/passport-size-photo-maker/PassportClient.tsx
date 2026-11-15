"use client";

import { useEffect, useRef, useState } from "react";
import * as BackgroundRemoval from "@imgly/background-removal";

type BackgroundMode = "original" | "color";

type CropPosition = {
  x: number;
  y: number;
};

type DocPreset = {
  id: string;
  name: string;
  size: string;
  width: number;
  height: number;
  kb?: number;
};

const DOCS: DocPreset[] = [
  {
    id: "india-passport",
    name: "Passport India",
    size: "413 × 531 • 35 × 45mm",
    width: 413,
    height: 531,
  },
  {
    id: "usa-passport",
    name: "Passport USA",
    size: "600 × 600 • 2 × 2 inch",
    width: 600,
    height: 600,
  },
  {
    id: "usa-visa",
    name: "Visa USA",
    size: "600 × 600 • 2 × 2 inch",
    width: 600,
    height: 600,
  },
  {
    id: "uk-visa",
    name: "Visa UK",
    size: "413 × 531 • 35 × 45mm",
    width: 413,
    height: 531,
  },
  {
    id: "schengen-visa",
    name: "Visa Schengen",
    size: "413 × 531 • 35 × 45mm",
    width: 413,
    height: 531,
  },
  {
    id: "canada-visa",
    name: "Visa Canada",
    size: "413 × 531 • 35 × 45mm",
    width: 413,
    height: 531,
  },
  {
    id: "australia-visa",
    name: "Visa Australia",
    size: "413 × 531 • 35 × 45mm",
    width: 413,
    height: 531,
  },
  {
    id: "japan-visa",
    name: "Visa Japan",
    size: "413 × 531 • 35 × 45mm",
    width: 413,
    height: 531,
  },
  {
    id: "korea-visa",
    name: "Visa South Korea",
    size: "413 × 531 • 35 × 45mm",
    width: 413,
    height: 531,
  },
  {
    id: "dubai-visa",
    name: "Visa Dubai",
    size: "413 × 531 • 35 × 45mm",
    width: 413,
    height: 531,
  },
  {
    id: "china-visa",
    name: "Visa China",
    size: "390 × 567 • 33 × 48mm",
    width: 390,
    height: 567,
  },
  {
    id: "ssc-ibps-railway",
    name: "SSC / IBPS / Railway",
    size: "200 × 230 • ≤20KB",
    width: 200,
    height: 230,
    kb: 20,
  },
  {
    id: "upsc-bank",
    name: "UPSC / Bank",
    size: "300 × 350 • ≤50KB",
    width: 300,
    height: 350,
    kb: 50,
  },
  {
    id: "pan-card",
    name: "PAN Card",
    size: "400 × 300 • 35 × 25mm",
    width: 400,
    height: 300,
  },
  {
    id: "aadhaar",
    name: "Aadhaar",
    size: "300 × 400",
    width: 300,
    height: 400,
  },
  {
    id: "driving-license",
    name: "Driving License",
    size: "300 × 350",
    width: 300,
    height: 350,
  },
  {
    id: "voter-id",
    name: "Voter ID",
    size: "300 × 400",
    width: 300,
    height: 400,
  },
  {
    id: "oci",
    name: "OCI",
    size: "600 × 600",
    width: 600,
    height: 600,
  },
  {
    id: "stamp",
    name: "Stamp Photo",
    size: "300 × 400",
    width: 300,
    height: 400,
  },
  {
    id: "one-inch",
    name: "1 × 1 Inch",
    size: "400 × 400",
    width: 400,
    height: 400,
  },
  {
    id: "college-id",
    name: "College ID",
    size: "300 × 400",
    width: 300,
    height: 400,
  },
  {
    id: "job-resume",
    name: "Job / Resume",
    size: "400 × 500",
    width: 400,
    height: 500,
  },
];

const MAX_SOURCE_DIMENSION = 6000;
const MIN_DIMENSION = 50;
const MAX_DIMENSION = 2000;
const MIN_TARGET_KB = 5;
const MAX_TARGET_KB = 5000;

const COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Blue", value: "#2f6fed" },
  { name: "Red", value: "#d62828" },
  { name: "Green", value: "#168a45" },
  { name: "Black", value: "#000000" },
];

export default function PassportClient() {
  const [img, setImg] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [sel, setSel] = useState("india-passport");

  const [customW, setCustomW] = useState("");
  const [customH, setCustomH] = useState("");
  const [customKB, setCustomKB] = useState("");

  const [backgroundMode, setBackgroundMode] =
    useState<BackgroundMode>("original");

  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [origKB, setOrigKB] = useState(0);
  const [newKB, setNewKB] = useState(0);

  const [cropPosition, setCropPosition] = useState<CropPosition>({
    x: 0.5,
    y: 0.5,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentFileRef = useRef<File | null>(null);

  const sourceImageRef = useRef<HTMLImageElement | null>(null);

  const processedForegroundRef = useRef<HTMLImageElement | null>(null);

  const previewUrlRef = useRef<string | null>(null);

  function getCurrent(): DocPreset {
    const customWidth = Number(customW);
    const customHeight = Number(customH);
    const customKb = Number(customKB);

    if (
      customWidth >= MIN_DIMENSION &&
      customWidth <= MAX_DIMENSION &&
      customHeight >= MIN_DIMENSION &&
      customHeight <= MAX_DIMENSION
    ) {
      return {
        id: "custom",
        name: "Custom Size",
        size: `${customWidth} × ${customHeight}${
          customKb ? ` • ≤${customKb}KB` : ""
        }`,
        width: Math.round(customWidth),
        height: Math.round(customHeight),
        kb:
          customKb >= MIN_TARGET_KB && customKb <= MAX_TARGET_KB
            ? Math.round(customKb)
            : undefined,
      };
    }

    return (
      DOCS.find((d) => d.id === sel) || DOCS[0]
    );
  }

  function revokePreviewUrl() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }

  function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);

      image.onerror = () =>
        reject(new Error("Unable to load the image."));

      image.src = src;
    });
  }

  function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Unable to read image."));
        }
      };

      reader.onerror = () =>
        reject(new Error("Unable to read the selected file."));

      reader.readAsDataURL(file);
    });
  }

  async function getSourceImage(file: File): Promise<HTMLImageElement> {
    const dataUrl = await fileToDataURL(file);
    const original = await loadImage(dataUrl);

    if (
      original.naturalWidth <= MAX_SOURCE_DIMENSION &&
      original.naturalHeight <= MAX_SOURCE_DIMENSION
    ) {
      return original;
    }

    const scale = Math.min(
      MAX_SOURCE_DIMENSION / original.naturalWidth,
      MAX_SOURCE_DIMENSION / original.naturalHeight
    );

    const width = Math.max(
      1,
      Math.round(original.naturalWidth * scale)
    );

    const height = Math.max(
      1,
      Math.round(original.naturalHeight * scale)
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas is not supported by this browser.");
    }

    ctx.drawImage(original, 0, 0, width, height);

    const resized = await loadImage(canvas.toDataURL("image/jpeg", 0.95));

    return resized;
  }

  async function createForegroundFromBackgroundRemoval(
    file: File
  ): Promise<HTMLImageElement> {
    setStatus("Removing the original background…");
    setIsSuccess(false);

    const removeBackground =
      (BackgroundRemoval as any).default ||
      (BackgroundRemoval as any).removeBackground;

    if (typeof removeBackground !== "function") {
      throw new Error(
        "Background removal module is not available. Please reinstall @imgly/background-removal."
      );
    }

    const resultBlob = await removeBackground(file, {
      model: "medium",
      proxyToWorker: true,
      output: {
        format: "image/png",
        quality: 1,
        type: "foreground",
      },
      progress: (
        key: string,
        current: number,
        total: number
      ) => {
        if (total > 0) {
          const percent = Math.round((current / total) * 100);

          setStatus(
            `Removing background… ${Math.min(100, percent)}%`
          );
        }
      },
    });

    const resultUrl = URL.createObjectURL(resultBlob);

    try {
      const foreground = await loadImage(resultUrl);

      return foreground;
    } finally {
      URL.revokeObjectURL(resultUrl);
    }
  }

  function createCanvas(
    source: HTMLImageElement,
    width: number,
    height: number,
    mode: BackgroundMode,
    color: string
  ): HTMLCanvasElement {
    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", {
      alpha: true,
    });

    if (!ctx) {
      throw new Error("Canvas is not supported by this browser.");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (mode === "color") {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    const sourceWidth = source.naturalWidth || source.width;
    const sourceHeight = source.naturalHeight || source.height;

    const targetRatio = width / height;
    const sourceRatio = sourceWidth / sourceHeight;

    let drawWidth: number;
    let drawHeight: number;

    if (sourceRatio > targetRatio) {
      drawHeight = height;
      drawWidth = height * sourceRatio;
    } else {
      drawWidth = width;
      drawHeight = width / sourceRatio;
    }

    const extraX = drawWidth - width;
    const extraY = drawHeight - height;

    const dx = -(extraX * cropPosition.x);
    const dy = -(extraY * cropPosition.y);

    ctx.drawImage(
      source,
      dx,
      dy,
      drawWidth,
      drawHeight
    );

    return canvas;
  }

  function createColorBackgroundCanvas(
    foreground: HTMLImageElement,
    width: number,
    height: number,
    color: string
  ): HTMLCanvasElement {
    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", {
      alpha: false,
    });

    if (!ctx) {
      throw new Error("Canvas is not supported by this browser.");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    const sourceWidth =
      foreground.naturalWidth || foreground.width;

    const sourceHeight =
      foreground.naturalHeight || foreground.height;

    const targetRatio = width / height;
    const sourceRatio = sourceWidth / sourceHeight;

    let drawWidth: number;
    let drawHeight: number;

    if (sourceRatio > targetRatio) {
      drawHeight = height;
      drawWidth = height * sourceRatio;
    } else {
      drawWidth = width;
      drawHeight = width / sourceRatio;
    }

    const extraX = drawWidth - width;
    const extraY = drawHeight - height;

    const dx = -(extraX * cropPosition.x);
    const dy = -(extraY * cropPosition.y);

    ctx.drawImage(
      foreground,
      dx,
      dy,
      drawWidth,
      drawHeight
    );

    return canvas;
  }

  async function processImage(
    file?: File,
    forceBackgroundRemoval = false
  ) {
    const currentFile = file || currentFileRef.current;

    if (!currentFile) return;

    setProcessing(true);
    setIsSuccess(false);
    setStatus("Preparing your photo…");

    try {
      const current = getCurrent();

      let finalCanvas: HTMLCanvasElement;

      if (
        backgroundMode === "color" ||
        forceBackgroundRemoval
      ) {
        let foreground =
          processedForegroundRef.current;

        if (!foreground || forceBackgroundRemoval) {
          foreground =
            await createForegroundFromBackgroundRemoval(
              currentFile
            );

          processedForegroundRef.current =
            foreground;
        }

        setStatus("Applying the selected background…");

        finalCanvas = createColorBackgroundCanvas(
          foreground,
          current.width,
          current.height,
          backgroundColor
        );
      } else {
        setStatus("Creating your photo…");

        let source =
          sourceImageRef.current;

        if (!source) {
          source =
            await getSourceImage(currentFile);

          sourceImageRef.current = source;
        }

        finalCanvas = createCanvas(
          source,
          current.width,
          current.height,
          "original",
          "#ffffff"
        );
      }

      canvasRef.current = finalCanvas;

      revokePreviewUrl();

      const previewBlob =
        await new Promise<Blob | null>((resolve) =>
          finalCanvas.toBlob(
            resolve,
            "image/jpeg",
            0.92
          )
        );

      if (!previewBlob) {
        throw new Error(
          "Unable to create the photo preview."
        );
      }

      const previewUrl =
        URL.createObjectURL(previewBlob);

      previewUrlRef.current = previewUrl;

      setPreview(previewUrl);

      setNewKB(
        Math.max(
          1,
          Math.round(previewBlob.size / 1024)
        )
      );

      setIsSuccess(true);
      setStatus(
        backgroundMode === "original"
          ? "Photo ready with original background."
          : "Photo ready with the selected color background."
      );
    } catch (error) {
      console.error(error);

      setPreview(null);
      setIsSuccess(false);

      setStatus(
        error instanceof Error
          ? error.message
          : "Something went wrong while processing the photo."
      );
    } finally {
      setProcessing(false);
    }
  }

  async function handleFile(
    file: File
  ) {
    if (!file.type.startsWith("image/")) {
      setStatus(
        "Please select a valid image file."
      );
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setStatus(
        "Maximum upload size is 25MB."
      );
      return;
    }

    setProcessing(true);
    setIsSuccess(false);
    setStatus("Loading your photo…");

    currentFileRef.current = file;

    sourceImageRef.current = null;
    processedForegroundRef.current = null;

    revokePreviewUrl();

    try {
      const source =
        await getSourceImage(file);

      sourceImageRef.current = source;

      setOrigW(
        source.naturalWidth ||
          source.width
      );

      setOrigH(
        source.naturalHeight ||
          source.height
      );

      setOrigKB(
        Math.max(
          1,
          Math.round(file.size / 1024)
        )
      );

      const dataUrl =
        await fileToDataURL(file);

      setImg(dataUrl);

      await processImage(file);
    } catch (error) {
      console.error(error);

      setStatus(
        "Unable to load this image. Please try another photo."
      );
    } finally {
      setProcessing(false);
    }
  }

  function selectDoc(id: string) {
    setSel(id);

    const doc =
      DOCS.find((d) => d.id === id);

    if (!doc) return;

    setCustomW("");
    setCustomH("");
    setCustomKB("");

    if (currentFileRef.current) {
      setTimeout(() => {
        processImage();
      }, 0);
    }
  }

  function applyCustom() {
    const width = Number(customW);
    const height = Number(customH);
    const kb = Number(customKB);

    if (
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      width < MIN_DIMENSION ||
      height < MIN_DIMENSION ||
      width > MAX_DIMENSION ||
      height > MAX_DIMENSION
    ) {
      setStatus(
        `Enter a valid width and height between ${MIN_DIMENSION} and ${MAX_DIMENSION}px.`
      );
      return;
    }

    if (
      customKB &&
      (!Number.isFinite(kb) ||
        kb < MIN_TARGET_KB ||
        kb > MAX_TARGET_KB)
    ) {
      setStatus(
        `Target file size must be between ${MIN_TARGET_KB}KB and ${MAX_TARGET_KB}KB.`
      );
      return;
    }

    setSel("custom");

    if (currentFileRef.current) {
      setTimeout(() => {
        processImage();
      }, 0);
    }
  }

  async function updateBackgroundMode(
    mode: BackgroundMode
  ) {
    setBackgroundMode(mode);

    if (!currentFileRef.current) {
      return;
    }

    setProcessing(true);
    setIsSuccess(false);

    try {
      if (mode === "original") {
        processedForegroundRef.current = null;

        await processImage(
          currentFileRef.current
        );
      } else {
        await processImage(
          currentFileRef.current,
          true
        );
      }
    } finally {
      setProcessing(false);
    }
  }

  async function updateBackgroundColor(
    color: string
  ) {
    setBackgroundColor(color);

    if (
      backgroundMode !== "color" ||
      !currentFileRef.current
    ) {
      return;
    }

    setProcessing(true);
    setIsSuccess(false);

    try {
      await processImage(
        currentFileRef.current
      );
    } finally {
      setProcessing(false);
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

    if (!currentFileRef.current) {
      return;
    }

    setTimeout(() => {
      processImage();
    }, 0);
  }

  async function canvasToBlob(
    canvas: HTMLCanvasElement,
    quality: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "Unable to create the final image."
              )
            );
            return;
          }

          resolve(blob);
        },
        "image/jpeg",
        quality
      );
    });
  }

  async function compressToTarget(
    canvas: HTMLCanvasElement,
    targetKB?: number
  ): Promise<Blob> {
    if (!targetKB) {
      return canvasToBlob(canvas, 0.95);
    }

    const targetBytes =
      targetKB * 1024;

    let bestBlob =
      await canvasToBlob(canvas, 0.95);

    if (bestBlob.size <= targetBytes) {
      return bestBlob;
    }

    let low = 0.05;
    let high = 0.95;

    for (let i = 0; i < 10; i++) {
      const quality =
        (low + high) / 2;

      const blob =
        await canvasToBlob(
          canvas,
          quality
        );

      if (blob.size <= targetBytes) {
        bestBlob = blob;
        low = quality;
      } else {
        high = quality;
      }
    }

    if (bestBlob.size <= targetBytes) {
      return bestBlob;
    }

    let scale = 0.95;

    for (let i = 0; i < 8; i++) {
      const scaled =
        document.createElement(
          "canvas"
        );

      scaled.width = Math.max(
        50,
        Math.round(
          canvas.width * scale
        )
      );

      scaled.height = Math.max(
        50,
        Math.round(
          canvas.height * scale
        )
      );

      const ctx =
        scaled.getContext("2d");

      if (!ctx) break;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality =
        "high";

      ctx.drawImage(
        canvas,
        0,
        0,
        scaled.width,
        scaled.height
      );

      let qLow = 0.05;
      let qHigh = 0.9;

      for (let j = 0; j < 8; j++) {
        const q =
          (qLow + qHigh) / 2;

        const blob =
          await canvasToBlob(
            scaled,
            q
          );

        if (
          blob.size <= targetBytes
        ) {
          bestBlob = blob;
          qLow = q;
        } else {
          qHigh = q;
        }
      }

      if (
        bestBlob.size <= targetBytes
      ) {
        return bestBlob;
      }

      scale *= 0.9;
    }

    return bestBlob;
  }

  async function download() {
    if (!canvasRef.current) {
      setStatus(
        "Please upload and process a photo first."
      );
      return;
    }

    if (processing) return;

    setProcessing(true);
    setIsSuccess(false);

    let popup: Window | null = null;

    const userAgent =
      navigator.userAgent ||
      navigator.vendor ||
      "";

    const isIOS =
      /iPad|iPhone|iPod/i.test(
        userAgent
      ) ||
      (
        navigator.platform ===
          "MacIntel" &&
        navigator.maxTouchPoints > 1
      );

    /*
      iOS Safari may block a popup if it is opened
      after an asynchronous operation.

      We open it immediately from the button click,
      then point it to the generated file later.
    */
    if (isIOS) {
      popup =
        window.open(
          "about:blank",
          "_blank"
        );
    }

    try {
      const current =
        getCurrent();

      const targetKB =
        current.kb;

      setStatus(
        targetKB
          ? `Preparing your download under ${targetKB}KB…`
          : "Preparing your download…"
      );

      const blob =
        await compressToTarget(
          canvasRef.current,
          targetKB
        );

      setNewKB(
        Math.max(
          1,
          Math.round(
            blob.size / 1024
          )
        )
      );

      const filename =
        `nexora-passport-photo-${current.width}x${current.height}.jpg`;

      const file =
        new File(
          [blob],
          filename,
          {
            type: "image/jpeg",
          }
        );

      /*
        Best experience on iPhone/iPad:
        use native Share sheet when supported.
      */
      if (
        isIOS &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        try {
          if (popup) {
            popup.close();
            popup = null;
          }

          await navigator.share({
            files: [file],
            title:
              "NEXORA Passport Photo",
          });

          setStatus(
            "Photo ready. Use Save to Photos in the Share menu."
          );

          setIsSuccess(true);

          if (
            typeof window !== "undefined" &&
            typeof window.gtag ===
              "function"
          ) {
            window.gtag(
              "event",
              "passport_photo_download",
              {
                width:
                  current.width,
                height:
                  current.height,
                background:
                  backgroundMode,
              }
            );
          }

          return;
        } catch (shareError) {
          /*
            User may cancel the Share sheet.
            Continue to browser fallback only
            when necessary.
          */

          if (
            shareError &&
            typeof shareError ===
              "object" &&
            "name" in shareError &&
            (shareError as any)
              .name ===
              "AbortError"
          ) {
            setStatus(
              "Share cancelled."
            );
            return;
          }
        }
      }

      const url =
        URL.createObjectURL(blob);

      /*
        iPhone/iPad fallback.
      */
      if (isIOS) {
        if (popup && !popup.closed) {
          popup.location.href = url;

          setStatus(
            "Your photo is ready. Tap Share, then choose Save to Photos."
          );
        } else {
          window.location.href =
            url;

          setStatus(
            "Your photo is ready. Use Share → Save to Photos."
          );
        }

        setIsSuccess(true);

        setTimeout(() => {
          URL.revokeObjectURL(
            url
          );
        }, 60000);

        if (
          typeof window !==
            "undefined" &&
          typeof window.gtag ===
            "function"
        ) {
          window.gtag(
            "event",
            "passport_photo_download",
            {
              width:
                current.width,
              height:
                current.height,
              background:
                backgroundMode,
            }
          );
        }

        return;
      }

      /*
        Normal desktop / Android browser download.
      */
      const link =
        document.createElement(
          "a"
        );

      link.href = url;
      link.download =
        filename;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(
          url
        );
      }, 60000);

      setStatus(
        "Photo downloaded successfully."
      );

      setIsSuccess(true);

      if (
        typeof window !==
          "undefined" &&
        typeof window.gtag ===
          "function"
      ) {
        window.gtag(
          "event",
          "passport_photo_download",
          {
            width:
              current.width,
            height:
              current.height,
            background:
              backgroundMode,
          }
        );
      }
    } catch (error) {
      console.error(error);

      if (
        popup &&
        !popup.closed
      ) {
        popup.close();
      }

      setStatus(
        "Download failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  }

  function clearAll() {
    currentFileRef.current = null;

    sourceImageRef.current = null;

    processedForegroundRef.current =
      null;

    revokePreviewUrl();

    setImg(null);
    setPreview(null);

    setStatus("");
    setIsSuccess(false);

    setOrigW(0);
    setOrigH(0);
    setOrigKB(0);
    setNewKB(0);

    setBackgroundMode(
      "original"
    );

    setBackgroundColor(
      "#ffffff"
    );

    setCropPosition({
      x: 0.5,
      y: 0.5,
    });

    setCustomW("");
    setCustomH("");
    setCustomKB("");

    const input =
      document.getElementById(
        "passport-file"
      ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  useEffect(() => {
    return () => {
      revokePreviewUrl();
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a
            href="/"
            className="text-xl font-black tracking-tight"
          >
            NEXORA
          </a>

          <nav className="flex items-center gap-5 text-sm font-semibold text-slate-600">
            <a
              href="/"
              className="transition hover:text-slate-950"
            >
              Home
            </a>

            <a
              href="/#tools"
              className="transition hover:text-slate-950"
            >
              All Tools
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="px-4 pb-8 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
            FREE • PRIVATE • BROWSER-BASED
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Passport Photo Maker
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Create passport, visa and document photos
            in the correct size. Keep your original
            background or replace it with a color.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* UPLOAD */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <label
              htmlFor="passport-file"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
            >
              <div className="mb-4 text-5xl">
                📷
              </div>

              <h2 className="text-xl font-extrabold">
                Upload Your Photo
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                JPG, JPEG, PNG or WebP. Maximum file size:
                25MB.
              </p>

              <span className="mt-5 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white">
                Choose Photo
              </span>
            </label>

            <input
              id="passport-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (file) {
                  handleFile(file);
                }
              }}
            />

            {img && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                  <span>
                    Original:{" "}
                    {origW} × {origH}px
                  </span>

                  <span>
                    File size:{" "}
                    {origKB}KB
                  </span>

                  {preview && (
                    <span>
                      Output preview:{" "}
                      {newKB}KB
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {img && (
            <>
              {/* DOCUMENT PRESETS */}
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-4">
                  <h2 className="text-lg font-extrabold">
                    Choose Document Size
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select the required passport, visa or
                    document format.
                  </p>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2">
                  {DOCS.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() =>
                        selectDoc(doc.id)
                      }
                      className={`min-w-[190px] rounded-2xl border p-4 text-left transition ${
                        sel === doc.id
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="text-sm font-extrabold">
                        {doc.name}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {doc.size}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CUSTOM SIZE */}
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <h2 className="text-lg font-extrabold">
                  Custom Size
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your own output dimensions and
                  optional maximum file size.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600">
                      Width (px)
                    </label>

                    <input
                      type="number"
                      min={MIN_DIMENSION}
                      max={MAX_DIMENSION}
                      value={customW}
                      onChange={(e) =>
                        setCustomW(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                      placeholder="e.g. 413"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600">
                      Height (px)
                    </label>

                    <input
                      type="number"
                      min={MIN_DIMENSION}
                      max={MAX_DIMENSION}
                      value={customH}
                      onChange={(e) =>
                        setCustomH(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                      placeholder="e.g. 531"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600">
                      Maximum Size (KB)
                    </label>

                    <input
                      type="number"
                      min={MIN_TARGET_KB}
                      max={MAX_TARGET_KB}
                      value={customKB}
                      onChange={(e) =>
                        setCustomKB(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={applyCustom}
                  className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Apply Custom Size
                </button>
              </div>

              {/* BACKGROUND */}
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-5">
                  <h2 className="text-lg font-extrabold">
                    Background
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Keep the real background or replace it
                    with a color.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateBackgroundMode(
                        "original"
                      )
                    }
                    disabled={processing}
                    className={`rounded-2xl border p-5 text-left transition ${
                      backgroundMode ===
                      "original"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-base font-extrabold">
                      Original Background
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      Keep the actual background from
                      your uploaded photo.
                    </div>

                    <div className="mt-3 text-xs font-bold text-blue-600">
                      Size and crop will still be changed.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateBackgroundMode(
                        "color"
                      )
                    }
                    disabled={processing}
                    className={`rounded-2xl border p-5 text-left transition ${
                      backgroundMode ===
                      "color"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-base font-extrabold">
                      Color Background
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      Remove the original background and
                      apply a selected color.
                    </div>

                    <div className="mt-3 text-xs font-bold text-blue-600">
                      AI background separation is used.
                    </div>
                  </button>
                </div>

                {backgroundMode ===
                  "color" && (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 text-sm font-extrabold">
                      Choose Background Color
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {COLORS.map(
                        (color) => (
                          <button
                            key={
                              color.value
                            }
                            type="button"
                            onClick={() =>
                              updateBackgroundColor(
                                color.value
                              )
                            }
                            disabled={
                              processing
                            }
                            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                              backgroundColor ===
                              color.value
                                ? "border-blue-500 ring-2 ring-blue-100"
                                : "border-slate-300"
                            }`}
                          >
                            <span
                              className="h-5 w-5 rounded-full border border-slate-300"
                              style={{
                                backgroundColor:
                                  color.value,
                              }}
                            />

                            {color.name}
                          </button>
                        )
                      )}

                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold">
                        <span>
                          Custom
                        </span>

                        <input
                          type="color"
                          value={
                            backgroundColor
                          }
                          onChange={(e) =>
                            updateBackgroundColor(
                              e.target.value
                            )
                          }
                          className="h-6 w-8 cursor-pointer border-0 bg-transparent p-0"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* PREVIEW */}
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-4">
                    <h2 className="text-lg font-extrabold">
                      Preview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Your final document photo preview.
                    </p>
                  </div>

                  <div className="flex min-h-[420px] items-center justify-center rounded-2xl bg-slate-100 p-6">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Passport photo preview"
                        className="max-h-[520px] max-w-full rounded-lg object-contain shadow-xl"
                      />
                    ) : (
                      <div className="text-center text-sm text-slate-400">
                        Preview will appear here.
                      </div>
                    )}
                  </div>
                </div>

                {/* CROP */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                  <h2 className="text-lg font-extrabold">
                    Crop Position
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Adjust the position of the photo inside
                    the selected document size.
                  </p>

                  <div className="mt-8">
                    <label className="mb-2 flex justify-between text-xs font-bold text-slate-600">
                      <span>
                        Horizontal Position
                      </span>

                      <span>
                        {Math.round(
                          cropPosition.x *
                            100
                        )}
                        %
                      </span>
                    </label>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={
                        cropPosition.x
                      }
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

                  <div className="mt-8">
                    <label className="mb-2 flex justify-between text-xs font-bold text-slate-600">
                      <span>
                        Vertical Position
                      </span>

                      <span>
                        {Math.round(
                          cropPosition.y *
                            100
                        )}
                        %
                      </span>
                    </label>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={
                        cropPosition.y
                      }
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

                  <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <div className="font-bold text-slate-900">
                      Output
                    </div>

                    <div className="mt-2">
                      {getCurrent().width} ×{" "}
                      {getCurrent().height}px
                    </div>

                    {getCurrent()
                      .kb && (
                      <div className="mt-1">
                        Maximum file size:{" "}
                        {getCurrent()
                          .kb}
                        KB
                      </div>
                    )}

                    <div className="mt-1">
                      Background:{" "}
                      {backgroundMode ===
                      "original"
                        ? "Original"
                        : "Color"}
                    </div>
                  </div>
                </div>
              </div>

              {/* STATUS */}
              {(status ||
                processing) && (
                <div
                  className={`mt-6 rounded-2xl border p-4 text-sm font-semibold ${
                    isSuccess
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-blue-200 bg-blue-50 text-blue-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {processing && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                    )}

                    <span>
                      {status ||
                        "Processing…"}
                    </span>
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={download}
                  disabled={
                    processing ||
                    !preview
                  }
                  className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-sm font-extrabold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing
                    ? "Processing…"
                    : "Download Passport Photo"}
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  disabled={processing}
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Clear
                </button>
              </div>

              {/* PRIVACY */}
              <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-center text-xs font-semibold leading-6 text-green-700">
                🔒 Your photo is processed in your browser.
                It is not uploaded to a server by NEXORA.
              </div>
            </>
          )}
        </div>
      </section>

      {/* EXTRA INFO */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-black">
            Free Passport Photo Maker
          </h2>

          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <p>
              NEXORA Passport Photo Maker helps you create
              passport, visa, ID and document photos in
              commonly required dimensions. Select a
              predefined format or enter your own width,
              height and maximum file size.
            </p>

            <p>
              You can keep the original photo background
              when you only need to change the size and
              crop. If you need a different background,
              choose Color Background to remove the original
              background and apply a new color.
            </p>

            <p>
              The tool works directly in your browser and
              does not require an account or a paid
              subscription.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-2xl">
                📐
              </div>

              <h3 className="mt-3 font-extrabold">
                Correct Dimensions
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create photos using predefined document
                dimensions or your own custom size.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-2xl">
                🎨
              </div>

              <h3 className="mt-3 font-extrabold">
                Background Options
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Keep the original background or replace it
                with a selected color.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-2xl">
                🔒
              </div>

              <h3 className="mt-3 font-extrabold">
                Browser-Based
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Process your photo directly in your browser
                without creating an account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-black">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 space-y-4">
            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer font-extrabold">
                Can I keep my original background?
              </summary>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Yes. Select Original Background. Your
                uploaded background will remain unchanged
                while the photo is resized and cropped.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer font-extrabold">
                Can I change the background color?
              </summary>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Yes. Select Color Background and choose
                white, blue, red, green, black or a custom
                color. The original background is removed
                before the selected color is applied.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer font-extrabold">
                Does the tool work on iPhone?
              </summary>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Yes. On iPhone and iPad, the download uses
                the browser's native Share flow when
                supported. You can choose Save to Photos
                from the Share menu.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer font-extrabold">
                Can I create a specific KB file?
              </summary>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                You can enter a maximum file size in KB.
                NEXORA compresses the final image to try to
                stay below that limit while preserving the
                requested dimensions as much as possible.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer font-extrabold">
                Are my photos uploaded to a server?
              </summary>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                The photo processing is performed in the
                browser. No NEXORA account is required.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            © {new Date().getFullYear()} NEXORA. Free online
            tools for everyone.
          </div>

          <a
            href="/dpi-changer"
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Image DPI Changer
          </a>
        </div>
      </footer>
    </main>
  );
}
