"use client";

import { useEffect, useRef, useState } from "react";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MIN_KB = 10;
const MAX_KB = 1000;

// Decimal KB - jaisa form me hota hai: 10 KB = 10,000 bytes
function formatSize(bytes: number) {
  if (bytes >= 1_000_000) {
    return `${(bytes / 1_000_000).toFixed(2)} MB`;
  }
  if (bytes >= 100_000) {
    return `${(bytes / 1000).toFixed(1)} KB`;
  }
  return `${(bytes / 1000).toFixed(2)} KB`;
}

function getBaseName(filename: string) {
  return filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-");
}

export default function CompressImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [compressedUrl, setCompressedUrl] = useState("");
  const [target, setTarget] = useState(20);
  const [customKB, setCustomKB] = useState("20");
  const [origSize, setOrigSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef("");
  const compressedUrlRef = useRef("");
  const compressedBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (compressedUrlRef.current) URL.revokeObjectURL(compressedUrlRef.current);
      compressedBlobRef.current = null;
    };
  }, []);

  const clearResultUrl = () => {
    if (compressedUrlRef.current) {
      URL.revokeObjectURL(compressedUrlRef.current);
      compressedUrlRef.current = "";
    }
    compressedBlobRef.current = null;
    setCompressedUrl("");
    setNewSize(0);
  };

  const onFile = (selectedFile?: File) => {
    if (!selectedFile) return;
    clearResultUrl();
    setError("");
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("This image is too large. Please choose an image up to 25 MB.");
      return;
    }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(selectedFile);
    previewUrlRef.current = url;
    setFile(selectedFile);
    setOrigSize(selectedFile.size);
    setPreview(url);
  };

  const getTargetKB = () => {
    let value = Number.parseInt(customKB, 10);
    if (!Number.isFinite(value)) value = target;
    return Math.min(MAX_KB, Math.max(MIN_KB, value));
  };

  const createJpeg = (
    img: HTMLImageElement,
    scale: number,
    quality: number
  ): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const width = Math.max(32, Math.round(img.naturalWidth * scale));
      const height = Math.max(32, Math.round(img.naturalHeight * scale));
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        Math.max(0.01, Math.min(0.98, quality))
      );
    });
  };

  // Ek scale pe best quality dhundho - jo target se neeche ho aur sabse badi ho
  const findBestAtScale = async (
    img: HTMLImageElement,
    scale: number,
    targetBytes: number
  ): Promise<Blob | null> => {
    const lowest = await createJpeg(img, scale, 0.01);
    if (!lowest) return null;
    if (lowest.size > targetBytes) return null;

    let best: Blob | null = lowest;
    let low = 0.01;
    let high = 0.98;

    for (let i = 0; i < 10; i++) {
      const quality = (low + high) / 2;
      const blob = await createJpeg(img, scale, quality);
      if (!blob) continue;
      if (blob.size <= targetBytes) {
        if (blob.size > best.size) best = blob;
        low = quality;
      } else {
        high = quality;
      }
    }
    return best;
  };

  // MAIN ENGINE - EXACT KB
  const findBestBlob = async (
    img: HTMLImageElement,
    targetBytes: number
  ): Promise<Blob | null> => {
    const exactTarget = Math.floor(targetBytes);
    let bestOverall: Blob | null = null;

    const scales = [
      1, 0.8, 0.6, 0.5, 0.4, 0.3, 0.22, 0.16, 0.12, 0.09, 0.06, 0.04, 0.025, 0.015,
    ];

    for (const scale of scales) {
      const blob = await findBestAtScale(img, scale, exactTarget);
      if (blob) {
        if (!bestOverall || blob.size > bestOverall.size) {
          bestOverall = blob;
        }
        // Target ke 98% paas aa gaye to ruk jao
        if (bestOverall.size >= exactTarget * 0.98) {
          break;
        }
      }
    }

    // Emergency - agar abhi tak nahi bana to aur chhota karke try karo
    if (!bestOverall) {
      let scale = 0.05;
      for (let i = 0; i < 15; i++) {
        const blob = await createJpeg(img, scale, 0.01);
        if (!blob) break;
        if (blob.size <= exactTarget) {
          bestOverall = blob;
          break;
        }
        const ratio = Math.sqrt(exactTarget / blob.size);
        scale *= Math.max(0.4, Math.min(0.85, ratio));
        scale = Math.max(0.01, scale);
      }
    }

    // FINAL HARD CHECK - upar wala kabhi return mat karo
    if (bestOverall && bestOverall.size <= exactTarget) {
      return bestOverall;
    }
    return null;
  };

  const compress = async () => {
    if (!file || !preview) {
      setError("Please upload an image first.");
      return;
    }
    const finalKB = getTargetKB();
    setTarget(finalKB);
    setCustomKB(String(finalKB));
    setLoading(true);
    setError("");
    clearResultUrl();

    try {
      const img = new Image();
      img.src = preview;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Unable to read this image."));
      });
      if (!img.naturalWidth || !img.naturalHeight) {
        throw new Error("Invalid image dimensions.");
      }

      const targetBytes = finalKB * 1000;
      const blob = await findBestBlob(img, targetBytes);
      if (!blob) {
        throw new Error(`Unable to create an image under ${finalKB} KB.`);
      }
      if (blob.size > targetBytes) {
        throw new Error("The generated file exceeded the selected size limit.");
      }

      compressedBlobRef.current = blob;
      const resultUrl = URL.createObjectURL(blob);
      compressedUrlRef.current = resultUrl;
      setCompressedUrl(resultUrl);
      setNewSize(blob.size);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "We could not process this image.";
      setError(message);
      clearResultUrl();
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const blob = compressedBlobRef.current;
    if (!blob || !file) return;
    if (blob.size !== newSize) {
      setError("Download verification failed. Please compress the image again.");
      return;
    }
    if (blob.size > target * 1000) {
      setError("The file is larger than the selected target size.");
      return;
    }
    const outputFile = new File(
      [blob],
      `NEXORA-${target}KB-${getBaseName(file.name)}.jpg`,
      { type: "image/jpeg", lastModified: Date.now() }
    );
    if (outputFile.size !== blob.size) {
      setError("The downloaded file could not be verified.");
      return;
    }
    const downloadUrl = URL.createObjectURL(outputFile);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = outputFile.name;
    link.rel = "noopener";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
  };

  const clearAll = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
    clearResultUrl();
    setFile(null);
    setPreview("");
    setError("");
    setOrigSize(0);
    setTarget(20);
    setCustomKB("20");
    if (inputRef.current) inputRef.current.value = "";
  };

  const savedPercent =
    origSize && newSize
      ? Math.max(0, Math.round((1 - newSize / origSize) * 100))
      : 0;

  const isWithinTarget = newSize > 0 && newSize <= target * 1000;
  const exactOutputText = newSize > 0 ? `${newSize.toLocaleString()} bytes` : "";

  return (
    <div className="page">
      <header className="topbar">
        <div className="nav">
          <a href="/" className="logo">NEXORA</a>
          <nav className="navlinks" aria-label="Main navigation">
            <a href="/">Home</a>
            <a href="/#tools">All Tools</a>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="badge">FREE • NO WATERMARK • BROWSER-BASED</div>
          <h1>Image Compressor</h1>
          <p>Compress JPG, PNG, and WebP images to your required file size.</p>
        </section>

        <section className="tool-card" aria-label="Image compressor">
          <div className="upload-label">Upload an image</div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            hidden
            onChange={(event) => onFile(event.target.files?.[0])}
          />
          <button
            type="button"
            className={`upload-box ${preview ? "has-preview" : ""}`}
            onClick={() => inputRef.current?.click()}
            aria-label="Choose an image"
          >
            {preview ? (
              <img src={preview} alt="Selected image preview" className="preview" />
            ) : (
              <>
                <div className="upload-icon">+</div>
                <strong>Choose Image</strong>
                <span>JPG, PNG or WebP • Up to 25 MB</span>
              </>
            )}
          </button>

          {file && (
            <div className="file-info">
              <span>Original: <strong>{formatSize(origSize)}</strong></span>
              <span className="file-name">{file.name}</span>
            </div>
          )}

          <div className="target-box">
            <label htmlFor="target-size">Target file size</label>
            <div className="input-row">
              <input
                id="target-size"
                type="number"
                min={MIN_KB}
                max={MAX_KB}
                inputMode="numeric"
                value={customKB}
                onChange={(event) => {
                  const value = event.target.value;
                  setCustomKB(value);
                  const number = Number.parseInt(value, 10);
                  if (Number.isFinite(number)) {
                    setTarget(Math.min(MAX_KB, Math.max(MIN_KB, number)));
                  }
                }}
                placeholder="20"
              />
              <span>KB</span>
            </div>
            <div className="presets" aria-label="Target size presets">
              {[10, 15, 20, 30, 50, 80, 100, 200, 500].map((size) => (
                <button
                  type="button"
                  key={size}
                  className={target === size ? "preset active" : "preset"}
                  onClick={() => {
                    setTarget(size);
                    setCustomKB(String(size));
                  }}
                >
                  {size} KB
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="error" role="alert">{error}</div>
          )}

          <div className="actions">
            <button
              type="button"
              className="compress-btn"
              onClick={compress}
              disabled={loading || !file}
            >
              {loading ? "Compressing..." : "Compress Image"}
            </button>
            <button type="button" className="clear-btn" onClick={clearAll}>
              Clear
            </button>
          </div>

          <p className="privacy-note">
            Your image is processed in your browser. It is not uploaded to our server.
          </p>
        </section>

        {compressedUrl && (
          <section className="result-card">
            <div className="result-title">Compression Complete</div>
            <div className={isWithinTarget ? "size-result success" : "size-result warning"}>
              {formatSize(origSize)} → {formatSize(newSize)}
            </div>
            <div className="exact-size">
              Actual output: <strong>{formatSize(newSize)}</strong> ({exactOutputText})
            </div>
            <p className="result-message">
              {isWithinTarget
                ? `${savedPercent}% smaller • Within your ${target} KB target`
                : `Target was ${target} KB • Result: ${formatSize(newSize)}`}
            </p>
            <div className="comparison">
              <div className="image-panel">
                <span>BEFORE</span>
                <img src={preview} alt="Original image" />
                <small>Original: {formatSize(origSize)}</small>
              </div>
              <div className="image-panel after">
                <span>AFTER</span>
                <img src={compressedUrl} alt="Compressed image preview" />
                <small>Output: <strong>{formatSize(newSize)}</strong></small>
              </div>
            </div>
            <div className="verified">
              ✓ Verified file size: {newSize.toLocaleString()} bytes
            </div>
            <button type="button" className="download-btn" onClick={download}>
              Download Compressed Image
            </button>
          </section>
        )}

        <div className="content-gap" />

        <article className="seo-content">
          <section>
            <h2>Free Image Compressor</h2>
            <p>
              NEXORA Image Compressor helps you reduce JPG, PNG, and WebP image sizes quickly without installing software. Enter your required target size, such as 20 KB, 50 KB, 100 KB, or 200 KB, and download the compressed image.
            </p>
            <p>
              This is useful when an online application, exam form, passport form, college application, website, or document upload has a strict image-size limit.
            </p>
          </section>
          <section>
            <h2>How to Compress an Image</h2>
            <ol>
              <li>Choose your JPG, PNG, or WebP image.</li>
              <li>Enter the required target size in KB.</li>
              <li>Click <strong>Compress Image</strong>.</li>
              <li>Preview the result and download it.</li>
            </ol>
          </section>
          <section>
            <h2>Why Use NEXORA?</h2>
            <ul>
              <li>Free to use with no account required.</li>
              <li>Works directly in your browser.</li>
              <li>Supports JPG, PNG, and WebP images.</li>
              <li>Custom target sizes from 10 KB to 1000 KB.</li>
              <li>No watermark added to the output.</li>
              <li>Works on phones, tablets, and desktop devices.</li>
            </ul>
          </section>
          <section>
            <h2>Image Compressor for Forms</h2>
            <p>
              Many online forms specify an image-size limit. Instead of manually changing image dimensions or repeatedly trying different quality settings, you can enter the required size directly and let the browser create a smaller JPEG version.
            </p>
            <p>
              The tool is suitable for common image-compression tasks such as reducing a photo for an application form, document upload, profile image, website upload, or other file-size-restricted submission.
            </p>
          </section>
          <section>
            <h2>Frequently Asked Questions</h2>
            <details><summary>Can I compress an image to 10 KB?</summary><p>Yes. Enter 10 KB as the target size. The compressor automatically adjusts image dimensions and JPEG quality to create a file at or below the selected limit while trying to stay as close to the target as possible.</p></details>
            <details><summary>Can I compress an image to 20 KB?</summary><p>Yes. Enter 20 KB as the target size and click Compress Image. The tool searches for the closest possible result that does not exceed the requested limit.</p></details>
            <details><summary>Can I choose a custom image size?</summary><p>Yes. You can enter any target from 10 KB to 1000 KB.</p></details>
            <details><summary>Which image formats are supported?</summary><p>JPG, JPEG, PNG, and WebP images are supported. The compressed output is provided as a JPEG file.</p></details>
            <details><summary>Is my image uploaded to a server?</summary><p>No. Compression is performed in your browser. The image is not intentionally uploaded to a NEXORA processing server.</p></details>
            <details><summary>Does the compressor work on mobile?</summary><p>Yes. The tool is designed to work on modern mobile and desktop browsers.</p></details>
            <details><summary>Will the image quality remain the same?</summary><p>Compression can reduce image quality because a smaller file generally requires some quality or dimension reduction. NEXORA tries to keep the output as large and clear as possible while staying within the selected target.</p></details>
          </section>
          <section className="related">
            <h2>Related Tools</h2>
            <div className="related-grid">
              <a href="/image-dpi-changer">Image DPI Changer</a>
              <a href="/passport-size-photo-maker">Passport Photo Maker</a>
              <a href="/image-resizer">Image Resizer</a>
              <a href="/background-remover">Background Remover</a>
            </div>
          </section>
        </article>

        <p className="updated">NEXORA • Free online tools • Last updated: November 27, 2026</p>
      </main>

      <footer className="footer">
        <strong>NEXORA</strong>
        <div>
          <a href="/about">About</a>
          <a href="/privacy-policy">Privacy</a>
          <a href="/contact">Contact</a>
        </div>
        <p>Free tools designed to be simple, fast, and useful.</p>
      </footer>

      <style jsx>{`
        * { box-sizing: border-box; }
        .page { min-height: 100vh; background: #ffffff; color: #0f172a; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .topbar { position: sticky; top: 0; z-index: 20; background: rgba(255,255,255,0.96); border-bottom: 1px solid #eef2f7; backdrop-filter: blur(8px); }
        .nav { width: min(100%,1000px); margin: 0 auto; padding: 11px 18px; display: flex; align-items: center; justify-content: space-between; }
        .logo { color: #2563eb; text-decoration: none; font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
        .navlinks { display: flex; gap: 17px; }
        .navlinks a { color: #334155; text-decoration: none; font-size: 12px; font-weight: 700; }
        .container { width: min(100%,760px); margin: 0 auto; padding: 24px 16px 0; }
        .hero { text-align: center; margin-bottom: 20px; }
        .badge { display: inline-block; padding: 5px 10px; border: 1px solid #bfdbfe; border-radius: 999px; background: #eff6ff; color: #2563eb; font-size: 10px; font-weight: 800; letter-spacing: 0.3px; }
        h1 { margin: 11px 0 5px; font-size: clamp(30px,7vw,40px); line-height: 1.08; letter-spacing: -1.2px; font-weight: 900; background: linear-gradient(90deg,#2563eb,#7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { max-width: 540px; margin: 0 auto; color: #64748b; font-size: 13px; line-height: 1.5; }
        .tool-card, .result-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 15px; box-shadow: 0 7px 26px rgba(15,23,42,0.05); }
        .upload-label { margin-bottom: 7px; text-align: center; font-size: 12px; font-weight: 800; }
        .upload-box { width: 100%; min-height: 145px; border: 1.5px dashed #cbd5e1; border-radius: 12px; background: #ffffff; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: #0f172a; padding: 10px; }
        .upload-box:hover { border-color: #93c5fd; background: #f8fbff; }
        .upload-icon { width: 32px; height: 32px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: grid; place-items: center; font-size: 23px; font-weight: 500; margin-bottom: 3px; }
        .upload-box strong { font-size: 13px; }
        .upload-box span { color: #94a3b8; font-size: 10px; }
        .upload-box.has-preview { min-height: 120px; }
        .preview { max-width: 100%; max-height: 120px; border-radius: 8px; object-fit: contain; }
        .file-info { margin-top: 7px; display: flex; justify-content: space-between; gap: 10px; color: #64748b; font-size: 10px; }
        .file-name { max-width: 55%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .target-box { margin-top: 12px; padding: 10px; border: 1px solid #eef2f7; border-radius: 11px; background: #f8fafc; }
        .target-box label { display: block; margin-bottom: 6px; font-size: 11px; font-weight: 800; }
        .input-row { display: flex; align-items: center; gap: 7px; }
        .input-row input { width: 100%; min-width: 0; padding: 9px 10px; border: 1px solid #2563eb; border-radius: 8px; outline: none; background: #ffffff; color: #0f172a; font-size: 13px; font-weight: 700; }
        .input-row span { font-size: 12px; font-weight: 900; }
        .presets { display: flex; gap: 5px; overflow-x: auto; padding-top: 8px; scrollbar-width: none; }
        .presets::-webkit-scrollbar { display: none; }
        .preset { flex: 0 0 auto; padding: 5px 8px; border: 1px solid #e2e8f0; border-radius: 999px; background: #ffffff; color: #334155; font-size: 10px; font-weight: 800; cursor: pointer; }
        .preset.active { border-color: #f97316; background: #fff7ed; color: #ea580c; }
        .error { margin-top: 10px; padding: 9px 10px; border-radius: 9px; background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; text-align: center; font-size: 11px; line-height: 1.45; }
        .actions { display: flex; gap: 8px; margin-top: 12px; }
        .compress-btn, .clear-btn, .download-btn { border: 0; border-radius: 9px; cursor: pointer; font-weight: 800; }
        .compress-btn { flex: 1; padding: 11px; background: #f97316; color: #ffffff; font-size: 13px; }
        .compress-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .clear-btn { padding: 11px 15px; background: #f8fafc; border: 1px solid #e2e8f0; color: #334155; font-size: 12px; }
        .privacy-note { margin: 8px 0 0; color: #94a3b8; text-align: center; font-size: 9px; line-height: 1.4; }
        .result-card { margin-top: 15px; }
        .result-title { text-align: center; font-size: 13px; font-weight: 900; }
        .size-result { margin-top: 3px; text-align: center; font-size: 19px; font-weight: 900; }
        .size-result.success { color: #2563eb; }
        .size-result.warning { color: #dc2626; }
        .exact-size { margin-top: 3px; text-align: center; color: #64748b; font-size: 10px; }
        .exact-size strong { color: #0f172a; }
        .result-message { margin: 4px 0 11px; text-align: center; color: #64748b; font-size: 10px; font-weight: 700; }
        .comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .image-panel { padding: 7px; border-radius: 9px; background: #f8fafc; text-align: center; }
        .image-panel.after { background: #ecfdf5; border: 1px solid #bbf7d0; }
        .image-panel span { display: block; margin-bottom: 5px; color: #64748b; font-size: 9px; font-weight: 900; }
        .image-panel.after span { color: #047857; }
        .image-panel img { width: 100%; height: 125px; object-fit: contain; border-radius: 6px; background: #ffffff; display: block; }
        .image-panel small { display: block; margin-top: 6px; color: #64748b; font-size: 9px; font-weight: 700; }
        .image-panel.after small { color: #047857; }
        .verified { margin-top: 9px; padding: 7px 9px; border-radius: 8px; background: #f0fdf4; color: #15803d; text-align: center; font-size: 9px; font-weight: 800; border: 1px solid #bbf7d0; }
        .download-btn { width: 100%; margin-top: 9px; padding: 11px; background: #0f172a; color: #ffffff; font-size: 12px; }
        .content-gap { height: 40px; }
        .seo-content { color: #334155; font-size: 12px; line-height: 1.75; }
        .seo-content section { margin-bottom: 28px; }
        .seo-content h2 { margin: 0 0 7px; color: #0f172a; font-size: 19px; line-height: 1.25; letter-spacing: -0.3px; }
        .seo-content p { margin: 0 0 9px; }
        .seo-content ol, .seo-content ul { margin: 6px 0 0; padding-left: 21px; }
        .seo-content li { margin: 3px 0; }
        .seo-content details { margin-top: 7px; padding: 9px 11px; border: 1px solid #e2e8f0; border-radius: 9px; background: #ffffff; }
        .seo-content summary { cursor: pointer; color: #0f172a; font-size: 11px; font-weight: 800; }
        .seo-content details p { margin: 7px 0 0; color: #64748b; font-size: 11px; line-height: 1.65; }
        .related-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 7px; }
        .related-grid a { padding: 9px 10px; border: 1px solid #e2e8f0; border-radius: 9px; color: #2563eb; text-decoration: none; background: #f8fafc; font-size: 10px; font-weight: 800; }
        .updated { margin: 38px 0 15px; text-align: center; color: #94a3b8; font-size: 9px; }
        .footer { padding: 18px 15px; background: #0f172a; color: #94a3b8; text-align: center; font-size: 10px; }
        .footer strong { color: #ffffff; font-size: 14px; }
        .footer div { display: flex; justify-content: center; gap: 13px; margin-top: 7px; }
        .footer a { color: #cbd5e1; text-decoration: none; }
        .footer p { margin: 6px 0 0; }
        @media (max-width: 520px) {
          .container { padding-left: 12px; padding-right: 12px; }
          .nav { padding-left: 13px; padding-right: 13px; }
          .tool-card, .result-card { padding: 12px; border-radius: 14px; }
          .comparison { gap: 6px; }
          .image-panel img { height: 105px; }
          .content-gap { height: 40px; }
          .seo-content h2 { font-size: 18px; }
        }
      `}</style>
    </div>
  );
}
