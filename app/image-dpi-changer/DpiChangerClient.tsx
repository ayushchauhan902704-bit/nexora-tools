"use client";

import { useRef, useState } from "react";

const MAX_FILE_SIZE = 30 * 1024 * 1024;
const MAX_PIXELS = 40000000;

function formatBytes(b: number) {
  if (b < 1024) return b + " bytes";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}

function trackEvent(
  name: string,
  params: Record<string, any> = {}
) {
  if (
    typeof window !== "undefined" &&
    (window as any).gtag
  ) {
    (window as any).gtag("event", name, params);
  }
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;

  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];

    for (let j = 0; j < 8; j++) {
      crc =
        (crc >>> 1) ^
        (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function writeU32(
  b: Uint8Array,
  o: number,
  v: number
) {
  b[o] = (v >>> 24) & 255;
  b[o + 1] = (v >>> 16) & 255;
  b[o + 2] = (v >>> 8) & 255;
  b[o + 3] = v & 255;
}

function readU32(
  b: Uint8Array,
  o: number
) {
  return (
    b[o] * 16777216 +
    (b[o + 1] << 16) +
    (b[o + 2] << 8) +
    b[o + 3]
  );
}

function makePhys(dpi: number) {
  const ppm = Math.round(dpi / 0.0254);
  const c = new Uint8Array(21);

  writeU32(c, 0, 9);
  c.set([112, 72, 89, 115], 4);

  writeU32(c, 8, ppm);
  writeU32(c, 12, ppm);

  c[16] = 1;

  writeU32(
    c,
    17,
    crc32(c.subarray(4, 17))
  );

  return c;
}

function updateJpeg(
  buffer: ArrayBuffer,
  dpi: number
) {
  const src = new Uint8Array(buffer);

  if (
    src.length < 4 ||
    src[0] !== 255 ||
    src[1] !== 216
  ) {
    throw new Error("Invalid JPEG file.");
  }

  const density = Math.min(
    65535,
    Math.max(1, Math.round(dpi))
  );

  let pos = 2;

  while (
    pos + 4 <= src.length &&
    src[pos] === 255
  ) {
    const marker = src[pos + 1];

    if (
      marker === 218 ||
      marker === 217
    ) {
      break;
    }

    const len =
      (src[pos + 2] << 8) |
      src[pos + 3];

    if (
      len < 2 ||
      pos + 2 + len > src.length
    ) {
      throw new Error(
        "Invalid JPEG metadata."
      );
    }

    const isJfif =
      marker === 224 &&
      len >= 16 &&
      src[pos + 4] === 74 &&
      src[pos + 5] === 70 &&
      src[pos + 6] === 73 &&
      src[pos + 7] === 70 &&
      src[pos + 8] === 0;

    if (isJfif) {
      const out = src.slice();

      out[pos + 11] = 1;

      out[pos + 12] =
        density >> 8;

      out[pos + 13] =
        density & 255;

      out[pos + 14] =
        density >> 8;

      out[pos + 15] =
        density & 255;

      return out;
    }

    pos += 2 + len;
  }

  const jfif = new Uint8Array([
    255,
    224,
    0,
    16,
    74,
    70,
    73,
    70,
    0,
    1,
    1,
    1,
    density >> 8,
    density & 255,
    density >> 8,
    density & 255,
    0,
    0,
  ]);

  const res = new Uint8Array(
    src.length + jfif.length
  );

  res.set(src.subarray(0, 2), 0);
  res.set(jfif, 2);
  res.set(
    src.subarray(2),
    2 + jfif.length
  );

  return res;
}

function updatePng(
  buffer: ArrayBuffer,
  dpi: number
) {
  const src = new Uint8Array(buffer);

  const sig = Array.from(
    "\x89PNG\r\n\x1a\n",
    (c) => c.charCodeAt(0)
  );

  if (
    src.length < 33 ||
    !sig.every(
      (v, i) => src[i] === v
    )
  ) {
    throw new Error("Invalid PNG file.");
  }

  const parts: Uint8Array[] = [
    src.subarray(0, 8),
  ];

  let pos = 8;
  let inserted = false;
  let foundH = false;
  let foundE = false;

  while (
    pos + 12 <= src.length
  ) {
    const len = readU32(src, pos);

    if (
      len > src.length - pos - 12
    ) {
      throw new Error("PNG file is damaged.");
    }

    const type =
      String.fromCharCode(
        src[pos + 4],
        src[pos + 5],
        src[pos + 6],
        src[pos + 7]
      );

    const end =
      pos + 12 + len;

    if (type === "IHDR") {
      if (foundH) {
        throw new Error(
          "Invalid PNG structure."
        );
      }

      parts.push(
        src.subarray(pos, end)
      );

      foundH = true;

      if (!inserted) {
        parts.push(
          makePhys(dpi)
        );

        inserted = true;
      }
    } else if (type !== "pHYs") {
      parts.push(
        src.subarray(pos, end)
      );
    }

    pos = end;

    if (type === "IEND") {
      foundE = true;
      break;
    }
  }

  if (
    !foundH ||
    !inserted ||
    !foundE
  ) {
    throw new Error(
      "The PNG file could not be processed."
    );
  }

  if (pos < src.length) {
    parts.push(
      src.subarray(pos)
    );
  }

  const total = parts.reduce(
    (sum, part) =>
      sum + part.length,
    0
  );

  const res = new Uint8Array(
    total
  );

  let off = 0;

  for (const part of parts) {
    res.set(part, off);
    off += part.length;
  }

  return res;
}

export default function DpiChangerClient() {
  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [meta, setMeta] =
    useState("");

  const [dpi, setDpi] =
    useState(300);

  const [customDpi, setCustomDpi] =
    useState("300");

  const [status, setStatus] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  const [ready, setReady] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [blob, setBlob] =
    useState<Blob | null>(null);

  const [format, setFormat] =
    useState("");

  const [w, setW] =
    useState(0);

  const [h, setH] =
    useState(0);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const previewUrlRef =
    useRef<string>("");

  const loadScript = (
    src: string
  ) =>
    new Promise<void>(
      (resolve, reject) => {
        if (
          (window as any)
            .heic2any
        ) {
          resolve();
          return;
        }

        const existing =
          document.querySelector(
            'script[data-heic="true"]'
          );

        if (existing) {
          existing.addEventListener(
            "load",
            () => resolve(),
            { once: true }
          );

          existing.addEventListener(
            "error",
            () =>
              reject(
                new Error(
                  "The HEIC converter could not be loaded."
                )
              ),
            { once: true }
          );

          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src = src;
        script.async = true;
        script.dataset.heic =
          "true";

        script.onload =
          () => resolve();

        script.onerror =
          () =>
            reject(
              new Error(
                "The HEIC converter could not be loaded."
              )
            );

        document.head.appendChild(
          script
        );
      }
    );

  const getType = (f: File) => {
    const name =
      f.name.toLowerCase();

    const type =
      f.type.toLowerCase();

    if (
      type === "image/png" ||
      name.endsWith(".png")
    ) {
      return "png";
    }

    if (
      type === "image/jpeg" ||
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg")
    ) {
      return "jpeg";
    }

    if (
      type.includes("heic") ||
      type.includes("heif") ||
      name.endsWith(".heic") ||
      name.endsWith(".heif")
    ) {
      return "heic";
    }

    return "unsupported";
  };

  const clearPreview = () => {
    if (
      previewUrlRef.current
    ) {
      URL.revokeObjectURL(
        previewUrlRef.current
      );

      previewUrlRef.current =
        "";
    }
  };

  const onFile = async (
    f: File | undefined
  ) => {
    if (!f || processing) return;

    clearPreview();

    setStatus("");
    setReady(false);
    setPreview("");
    setMeta("");
    setProcessing(true);
    setProgress(10);

    trackEvent(
      "dpi_tool_started",
      {
        file_type:
          f.type || "unknown",

        file_size_mb:
          Number(
            (
              f.size /
              (1024 * 1024)
            ).toFixed(2)
          ),
      }
    );

    try {
      if (
        f.size >
        MAX_FILE_SIZE
      ) {
        throw new Error(
          "Please select an image smaller than 30 MB."
        );
      }

      if (f.size === 0) {
        throw new Error(
          "The selected file is empty."
        );
      }

      const type =
        getType(f);

      if (
        type === "unsupported"
      ) {
        throw new Error(
          "Only JPG, PNG, or HEIC files are supported."
        );
      }

      let working: Blob = f;
      let fmt = type;

      if (type === "heic") {
        setStatus(
          "Converting the HEIC image to JPG..."
        );

        setProgress(30);

        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js"
        );

        const converted =
          await (
            window as any
          ).heic2any({
            blob: f,
            toType:
              "image/jpeg",
            quality: 0.92,
          });

        const b =
          Array.isArray(
            converted
          )
            ? converted[0]
            : converted;

        if (
          !(b instanceof Blob) ||
          b.size === 0
        ) {
          throw new Error(
            "The HEIC image could not be converted."
          );
        }

        working = b;
        fmt = "jpeg";
      }

      const url =
        URL.createObjectURL(
          working
        );

      const img =
        new Image();

      await new Promise<void>(
        (resolve, reject) => {
          img.onload =
            () => {
              URL.revokeObjectURL(
                url
              );

              resolve();
            };

          img.onerror =
            () => {
              URL.revokeObjectURL(
                url
              );

              reject(
                new Error(
                  "Your browser could not read this image."
                )
              );
            };

          img.src = url;
        }
      );

      const iw =
        img.naturalWidth;

      const ih =
        img.naturalHeight;

      if (!iw || !ih) {
        throw new Error(
          "The image dimensions could not be detected."
        );
      }

      if (
        iw * ih >
        MAX_PIXELS
      ) {
        throw new Error(
          "This image is too large. Please choose a smaller image."
        );
      }

      const previewUrl =
        URL.createObjectURL(
          working
        );

      previewUrlRef.current =
        previewUrl;

      setFile(f);
      setBlob(working);
      setFormat(fmt);
      setW(iw);
      setH(ih);
      setPreview(
        previewUrl
      );

      setMeta(
        `${iw} × ${ih} pixels • ${formatBytes(
          f.size
        )}${
          type === "heic"
            ? " • Converted to JPG"
            : ""
        }`
      );

      setReady(true);
      setProgress(100);

      setStatus(
        "Your image is ready. Select a DPI value and click Download."
      );

      setIsSuccess(true);

      trackEvent(
        "dpi_image_loaded",
        {
          image_format:
            fmt,
          width: iw,
          height: ih,
        }
      );
    } catch (e: any) {
      const message =
        e?.message ||
        "The image could not be loaded.";

      setStatus(message);
      setIsSuccess(false);
      setReady(false);
      setProgress(0);

      trackEvent(
        "dpi_tool_error",
        {
          error_message:
            message,
        }
      );
    } finally {
      setProcessing(false);

      if (
        inputRef.current
      ) {
        inputRef.current.value =
          "";
      }
    }
  };

  const download = async () => {
    if (
      !ready ||
      !blob
    ) {
      setStatus(
        "Please upload an image first."
      );

      setIsSuccess(false);

      return;
    }

    if (
      !Number.isInteger(
        dpi
      ) ||
      dpi < 10 ||
      dpi > 1200
    ) {
      setStatus(
        "Please enter a whole number between 10 and 1200 DPI."
      );

      setIsSuccess(false);

      return;
    }

    setStatus("");
    setProcessing(true);
    setProgress(20);

    trackEvent(
      "dpi_processing_started",
      {
        dpi,
        image_format:
          format,
      }
    );

    try {
      const buffer =
        await blob.arrayBuffer();

      setProgress(60);

      let result: Uint8Array;
      let mime: string;
      let ext: string;

      if (
        format === "png"
      ) {
        result =
          updatePng(
            buffer,
            dpi
          );

        mime =
          "image/png";

        ext = "png";
      } else {
        result =
          updateJpeg(
            buffer,
            dpi
          );

        mime =
          "image/jpeg";

        ext = "jpg";
      }

      setProgress(90);

      const finalBlob =
        new Blob(
          [result as any],
          { type: mime }
        );

      const url =
        URL.createObjectURL(
          finalBlob
        );

      const base =
        (
          file?.name ||
          "image"
        )
          .replace(
            /\.[^.]+$/,
            ""
          )
          .replace(
            /[^\w-]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            "") ||
        "image";

      const anchor =
        document.createElement(
          "a"
        );

      anchor.href =
        url;

      anchor.download =
        `${base}-${dpi}dpi.${ext}`;

      anchor.style.display =
        "none";

      document.body.appendChild(
        anchor
      );

      anchor.click();
      anchor.remove();

      setTimeout(
        () =>
          URL.revokeObjectURL(
            url
          ),
        60000
      );

      setProgress(100);

      setStatus(
        `Done! Your ${dpi} DPI image is ready.`
      );

      setIsSuccess(true);

      trackEvent(
        "dpi_image_download",
        {
          event_category:
            "Image Tools",
          event_label:
            `${dpi} DPI`,
          image_format:
            format,
          dpi,
        }
      );
    } catch (e: any) {
      const message =
        e?.message ||
        "The image could not be created.";

      setStatus(message);
      setIsSuccess(false);
      setProgress(0);

      trackEvent(
        "dpi_tool_error",
        {
          error_message:
            message,
          stage:
            "download",
        }
      );
    } finally {
      setProcessing(false);
    }
  };

  const clearAll = () => {
    clearPreview();

    setFile(null);
    setPreview("");
    setMeta("");
    setBlob(null);
    setFormat("");
    setW(0);
    setH(0);
    setStatus("");
    setCustomDpi("300");
    setDpi(300);
    setReady(false);
    setProgress(0);
    setProcessing(false);

    trackEvent(
      "dpi_tool_reset"
    );
  };

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background:
          "#ffffff",
        color:
          "#0f172a",
        colorScheme:
          "light",
      }}
    >
      <main
        style={{
          maxWidth: 760,
          margin:
            "0 auto",
          padding:
            "24px 16px 10px",
        }}
      >
        {/* HERO */}
        <div
          style={{
            textAlign:
              "center",
            marginBottom:
              20,
          }}
        >
          <span
            style={{
              display:
                "inline-flex",
              alignItems:
                "center",
              gap: 5,
              background:
                "#eff6ff",
              color:
                "#2563eb",
              border:
                "1px solid #bfdbfe",
              padding:
                "6px 10px",
              borderRadius:
                999,
              fontSize:
                10,
              fontWeight:
                800,
              letterSpacing:
                "0.2px",
            }}
          >
            ✦ FREE • NO WATERMARK • BROWSER PROCESSING
          </span>

          <h1
            style={{
              fontSize:
                "clamp(28px, 7vw, 34px)",
              margin:
                "12px 0 6px",
              lineHeight:
                1.06,
              letterSpacing:
                "-0.6px",
              fontWeight:
                900,
              background:
                "linear-gradient(90deg, #1d4ed8, #6d28d9)",
              WebkitBackgroundClip:
                "text",
              WebkitTextFillColor:
                "transparent",
            }}
          >
            Change Photo DPI Online
            <br />
            10 - 1200 DPI
          </h1>

          <p
            style={{
              color:
                "#64748b",
              fontSize:
                13,
              margin:
                0,
              lineHeight:
                1.55,
            }}
          >
            Change JPG, PNG or HEIC image DPI
            from 10 to 1200.
            <br />
            Quick browser-based DPI metadata editing.
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
              18,
            padding:
              15,
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              fontWeight:
                700,
              fontSize:
                13,
              margin:
                "0 0 8px",
              textAlign:
                "center",
            }}
          >
            Upload Your Image
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
            onChange={(e) =>
              onFile(
                e.target.files?.[0]
              )
            }
            hidden
          />

          {/* UPLOAD */}
          <div
            onClick={() =>
              inputRef.current?.click()
            }
            role="button"
            tabIndex={0}
            aria-label="Upload image"
            onKeyDown={(e) => {
              if (
                e.key ===
                  "Enter" ||
                e.key ===
                  " "
              ) {
                inputRef.current?.click();
              }
            }}
            style={{
              border:
                "1.5px dashed #cbd5e1",
              borderRadius:
                13,
              padding:
                preview
                  ? 8
                  : 15,
              textAlign:
                "center",
              cursor:
                "pointer",
              background:
                "#fff",
              outline:
                "none",
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Uploaded image preview"
                style={{
                  maxWidth:
                    "100%",
                  maxHeight:
                    140,
                  borderRadius:
                    9,
                  objectFit:
                    "contain",
                }}
              />
            ) : (
              <>
                <div
                  style={{
                    fontSize:
                      25,
                  }}
                >
                  📏
                </div>

                <p
                  style={{
                    fontWeight:
                      700,
                    margin:
                      "5px 0 2px",
                    fontSize:
                      14,
                  }}
                >
                  Tap to Upload Photo
                </p>

                <p
                  style={{
                    fontSize:
                      11,
                    color:
                      "#94a3b8",
                    margin:
                      0,
                  }}
                >
                  JPG, PNG, HEIC • Max 30 MB
                </p>
              </>
            )}
          </div>

          {file && (
            <p
              style={{
                fontSize:
                  11,
                color:
                  "#64748b",
                textAlign:
                  "center",
                margin:
                  "8px 0 0",
                wordBreak:
                  "break-word",
              }}
            >
              {meta} • {file.name}
            </p>
          )}

          {/* BEFORE / AFTER */}
          {ready && (
            <div
              style={{
                display:
                  "flex",
                gap: 8,
                marginTop:
                  11,
              }}
            >
              <div
                style={{
                  flex: 1,
                  background:
                    "#f8fafc",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius:
                    10,
                  padding:
                    "9px 6px",
                  textAlign:
                    "center",
                  fontSize:
                    11,
                  lineHeight:
                    1.5,
                }}
              >
                <b>Before</b>
                <br />
                {w} × {h}
                <br />
                Original
              </div>

              <div
                style={{
                  flex: 1,
                  background:
                    "#ecfdf5",
                  border:
                    "1px solid #a7f3d0",
                  borderRadius:
                    10,
                  padding:
                    "9px 6px",
                  textAlign:
                    "center",
                  fontSize:
                    11,
                  lineHeight:
                    1.5,
                }}
              >
                <b>After</b>
                <br />
                {w} × {h}
                <br />
                {dpi} DPI
              </div>
            </div>
          )}

          {/* DPI INPUT */}
          <div
            style={{
              background:
                "#f8fafc",
              border:
                "1px solid #eef2f7",
              borderRadius:
                11,
              padding:
                "9px 10px",
              marginTop:
                11,
            }}
          >
            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: 7,
              }}
            >
              <label
                htmlFor="dpi-input"
                style={{
                  position:
                    "absolute",
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow:
                    "hidden",
                  clip:
                    "rect(0,0,0,0)",
                  whiteSpace:
                    "nowrap",
                  border: 0,
                }}
              >
                Enter DPI
              </label>

              <input
                id="dpi-input"
                type="number"
                min={10}
                max={1200}
                value={
                  customDpi
                }
                onChange={(e) => {
                  const value =
                    e.target.value;

                  setCustomDpi(
                    value
                  );

                  const parsed =
                    parseInt(
                      value
                    );

                  if (
                    !isNaN(
                      parsed
                    )
                  ) {
                    setDpi(
                      Math.min(
                        1200,
                        Math.max(
                          10,
                          parsed
                        )
                      )
                    );
                  }
                }}
                placeholder="Enter DPI: 10-1200"
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding:
                    "10px 11px",
                  border:
                    "1.5px solid #2563eb",
                  borderRadius:
                    9,
                  fontSize:
                    13,
                  fontWeight:
                    600,
                  outline:
                    "none",
                  background:
                    "#fff",
                  color:
                    "#0f172a",
                }}
              />

              <span
                style={{
                  fontWeight:
                    800,
                  fontSize:
                    13,
                }}
              >
                DPI
              </span>
            </div>

            {/* PRESETS */}
            <div
              style={{
                display:
                  "flex",
                gap: 5,
                marginTop:
                  8,
                overflowX:
                  "auto",
                paddingBottom:
                  2,
                whiteSpace:
                  "nowrap",
                scrollbarWidth:
                  "none",
              }}
            >
              {[
                10,
                72,
                150,
                200,
                300,
                350,
                600,
                1200,
              ].map(
                (value) => (
                  <button
                    key={
                      value
                    }
                    type="button"
                    onClick={() => {
                      setDpi(
                        value
                      );
                      setCustomDpi(
                        String(
                          value
                        )
                      );
                    }}
                    style={{
                      padding:
                        "5px 9px",
                      border:
                        dpi ===
                        value
                          ? "1.5px solid #f97316"
                          : "1px solid #e2e8f0",
                      background:
                        dpi ===
                        value
                          ? "#fff7ed"
                          : "#fff",
                      color:
                        dpi ===
                        value
                          ? "#ea580c"
                          : "#0f172a",
                      fontWeight:
                        700,
                      cursor:
                        "pointer",
                      fontSize:
                        11,
                      borderRadius:
                        999,
                      flexShrink:
                        0,
                    }}
                  >
                    {value} DPI
                  </button>
                )
              )}
            </div>
          </div>

          {/* ACCURACY NOTE */}
          <div
            style={{
              marginTop:
                10,
              padding:
                "9px 10px",
              background:
                "#fff7ed",
              border:
                "1px solid #fed7aa",
              borderRadius:
                9,
              fontSize:
                11,
              color:
                "#57534e",
              lineHeight:
                1.5,
            }}
          >
            <b
              style={{
                color:
                  "#d97706",
              }}
            >
              Note:
            </b>{" "}
            DPI changes print-density metadata.
            It does not add pixels or create new image detail.
          </div>

          {/* PROGRESS */}
          {progress > 0 && (
            <div
              style={{
                marginTop:
                  12,
              }}
              aria-live="polite"
            >
              <div
                style={{
                  background:
                    "#e2e8f0",
                  borderRadius:
                    999,
                  height: 8,
                  overflow:
                    "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    background:
                      "#16a34a",
                    height:
                      "100%",
                    transition:
                      "width 0.3s ease",
                  }}
                />
              </div>

              <p
                style={{
                  fontSize:
                    10,
                  textAlign:
                    "center",
                  margin:
                    "5px 0 0",
                  color:
                    "#64748b",
                }}
              >
                {progress}% Complete
              </p>
            </div>
          )}

          {/* STATUS */}
          {status && (
            <p
              role="status"
              style={{
                background:
                  isSuccess
                    ? "#ecfdf5"
                    : "#fef2f2",
                color:
                  isSuccess
                    ? "#047857"
                    : "#dc2626",
                padding:
                  "9px 10px",
                borderRadius:
                  9,
                fontSize:
                  12,
                margin:
                  "11px 0 0",
                textAlign:
                  "center",
                fontWeight:
                  600,
                lineHeight:
                  1.45,
              }}
            >
              {status}
            </p>
          )}

          {/* ACTIONS */}
          <div
            style={{
              display:
                "flex",
              gap: 8,
              marginTop:
                14,
            }}
          >
            <button
              type="button"
              onClick={
                download
              }
              disabled={
                !ready ||
                processing
              }
              style={{
                flex: 1,
                padding:
                  13,
                background:
                  "#f97316",
                color:
                  "#fff",
                border:
                  "none",
                borderRadius:
                  10,
                fontSize:
                  14,
                fontWeight:
                  800,
                cursor:
                  !ready ||
                  processing
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  !ready ||
                  processing
                    ? 0.5
                    : 1,
              }}
            >
              {processing
                ? "Processing..."
                : `Download ${dpi} DPI →`}
            </button>

            <button
              type="button"
              onClick={
                clearAll
              }
              style={{
                padding:
                  "13px 17px",
                background:
                  "#f8fafc",
                border:
                  "1px solid #e2e8f0",
                borderRadius:
                  10,
                cursor:
                  "pointer",
                fontWeight:
                  700,
                fontSize:
                  13,
              }}
            >
              Clear
            </button>
          </div>

          {/* PRIVACY */}
          <p
            style={{
              textAlign:
                "center",
              fontSize:
                10,
              color:
                "#94a3b8",
              margin:
                "8px 0 0",
              fontWeight:
                600,
              lineHeight:
                1.5,
            }}
          >
            🔒 Your image is processed in your browser.
            It is not uploaded to NEXORA for DPI processing.
          </p>
        </div>

        {/* LARGE GAP BEFORE SEO CONTENT */}
        <div
          style={{
            height:
              "clamp(140px, 22vw, 230px)",
          }}
        />

        {/* SEO / INFORMATION CONTENT */}
        <section
          aria-label="DPI Changer information"
          style={{
            fontSize:
              13,
            lineHeight:
              1.7,
            color:
              "#475569",
          }}
        >
          {/* WHAT IS DPI */}
          <div
            style={{
              background:
                "#f8fafc",
              border:
                "1px solid #e2e8f0",
              borderRadius:
                15,
              padding:
                "18px 16px",
              marginBottom:
                14,
            }}
          >
            <h2
              style={{
                fontSize:
                  19,
                color:
                  "#0f172a",
                margin:
                  "0 0 8px",
              }}
            >
              What Is a DPI Changer?
            </h2>

            <p
              style={{
                margin:
                  "0 0 10px",
              }}
            >
              A DPI changer updates the
              print-resolution metadata stored
              in an image. It can be useful when
              a printing service, document
              workflow, application, or form asks
              for a specific DPI value such as
              72, 150, 300, or 600 DPI.
            </p>

            <p
              style={{
                margin: 0,
              }}
            >
              NEXORA supports custom values
              from <b>10 to 1200 DPI</b> for
              supported JPG, PNG, and HEIC images.
              The DPI operation is performed in
              the browser without requiring an
              account or software installation.
            </p>
          </div>

          {/* HOW TO */}
          <div
            style={{
              background:
                "#fff",
              border:
                "1px solid #eef2f7",
              borderRadius:
                15,
              padding:
                "18px 16px",
              marginBottom:
                14,
            }}
          >
            <h2
              style={{
                fontSize:
                  19,
                color:
                  "#0f172a",
                margin:
                  "0 0 8px",
              }}
            >
              How to Change Image DPI
            </h2>

            <ol
              style={{
                margin:
                  "0 0 0 18px",
                padding: 0,
              }}
            >
              <li>
                Upload a JPG, PNG, or HEIC image.
              </li>

              <li>
                Enter the DPI value you need,
                from 10 to 1200.
              </li>

              <li>
                Choose a preset such as 300 DPI
                or enter a custom value.
              </li>

              <li>
                Click Download to save the
                updated image.
              </li>
            </ol>
          </div>

          {/* FEATURES */}
          <div
            style={{
              background:
                "#fff",
              border:
                "1px solid #eef2f7",
              borderRadius:
                15,
              padding:
                "18px 16px",
              marginBottom:
                14,
            }}
          >
            <h2
              style={{
                fontSize:
                  19,
                color:
                  "#0f172a",
                margin:
                  "0 0 8px",
              }}
            >
              DPI Changer Features
            </h2>

            <ul
              style={{
                margin:
                  "0 0 0 18px",
                padding: 0,
              }}
            >
              <li>10–1200 DPI range.</li>
              <li>Custom DPI input.</li>
              <li>JPG, PNG, and HEIC support.</li>
              <li>No watermark added.</li>
              <li>No account required.</li>
              <li>Browser-based DPI processing.</li>
              <li>
                Original pixel dimensions remain
                unchanged.
              </li>
              <li>
                Works on modern mobile and
                desktop browsers.
              </li>
            </ul>
          </div>

          {/* DPI VS QUALITY */}
          <div
            style={{
              background:
                "#fefce8",
              border:
                "1px solid #fde68a",
              borderRadius:
                15,
              padding:
                "18px 16px",
              marginBottom:
                14,
            }}
          >
            <h2
              style={{
                fontSize:
                  19,
                color:
                  "#0f172a",
                margin:
                  "0 0 8px",
              }}
            >
              DPI vs Image Quality
            </h2>

            <p
              style={{
                margin: 0,
              }}
            >
              DPI and pixel dimensions are
              different. Changing DPI metadata
              does not automatically create
              additional image detail or increase
              the number of pixels. If a print
              service requires 300 DPI, setting
              the image metadata to 300 DPI can
              satisfy that metadata requirement,
              while final print quality also
              depends on the image's pixel
              dimensions and physical print size.
            </p>
          </div>

          {/* COMMON VALUES */}
          <div
            style={{
              background:
                "#fff",
              border:
                "1px solid #eef2f7",
              borderRadius:
                15,
              padding:
                "18px 16px",
              marginBottom:
                14,
            }}
          >
            <h2
              style={{
                fontSize:
                  19,
                color:
                  "#0f172a",
                margin:
                  "0 0 8px",
              }}
            >
              Common DPI Values
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
                  borderCollapse:
                    "collapse",
                  fontSize:
                    12,
                }}
              >
                <tbody>
                  {[
                    [
                      "72 DPI",
                      "Common digital and screen workflows",
                    ],
                    [
                      "150 DPI",
                      "Basic print workflows",
                    ],
                    [
                      "300 DPI",
                      "Common high-quality print setting",
                    ],
                    [
                      "600 DPI",
                      "Higher-resolution print workflows",
                    ],
                    [
                      "1200 DPI",
                      "Specialized high-resolution workflows",
                    ],
                  ].map(
                    ([
                      value,
                      use,
                    ]) => (
                      <tr
                        key={
                          value
                        }
                      >
                        <td
                          style={{
                            border:
                              "1px solid #eef2f7",
                            padding:
                              9,
                            fontWeight:
                              800,
                            color:
                              "#0f172a",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {value}
                        </td>

                        <td
                          style={{
                            border:
                              "1px solid #eef2f7",
                            padding:
                              9,
                          }}
                        >
                          {use}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div
            style={{
              background:
                "#fff",
              border:
                "1px solid #eef2f7",
              borderRadius:
                15,
              padding:
                "18px 16px",
            }}
          >
            <h2
              style={{
                fontSize:
                  19,
                color:
                  "#0f172a",
                margin:
                  "0 0 10px",
              }}
            >
              Frequently Asked Questions
            </h2>

            {[
              [
                "Is this DPI changer free?",
                "Yes. NEXORA's DPI Changer is free to use and does not require an account.",
              ],
              [
                "Is my image uploaded to a server?",
                "The DPI operation is performed in your browser. NEXORA does not need to upload your image to its own server for this operation.",
              ],
              [
                "Can I change an image to 300 DPI?",
                "Yes. Enter 300 in the DPI field or select the 300 DPI preset and download the result.",
              ],
              [
                "Can I use a custom DPI?",
                "Yes. You can enter any whole-number DPI from 10 through 1200.",
              ],
              [
                "Does changing DPI increase image resolution?",
                "No. DPI metadata and pixel dimensions are different. Changing DPI alone does not add new image detail.",
              ],
              [
                "Does the tool support HEIC?",
                "Yes. HEIC and HEIF images can be converted to JPG in the browser before the DPI metadata is processed.",
              ],
              [
                "Does the tool add a watermark?",
                "No. The downloaded result does not intentionally add a NEXORA watermark.",
              ],
              [
                "Can I use this on iPhone or Android?",
                "Yes. The tool is designed for modern mobile browsers as well as desktop browsers.",
              ],
            ].map(
              ([
                question,
                answer,
              ]) => (
                <details
                  key={
                    question
                  }
                  style={{
                    border:
                      "1px solid #eef2f7",
                    borderRadius:
                      10,
                    padding:
                      "10px 12px",
                    marginTop:
                      8,
                  }}
                >
                  <summary
                    style={{
                      fontWeight:
                        700,
                      color:
                        "#0f172a",
                      cursor:
                        "pointer",
                      fontSize:
                        12,
                    }}
                  >
                    {question}
                  </summary>

                  <p
                    style={{
                      color:
                        "#64748b",
                      margin:
                        "8px 0 0",
                      fontSize:
                        12,
                      lineHeight:
                        1.65,
                    }}
                  >
                    {answer}
                  </p>
                </details>
              )
            )}
          </div>
        </section>

        {/* INTERNAL LINKS */}
        <div
          style={{
            marginTop:
              18,
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 8,
          }}
        >
          <a
            href="/background-remover"
            style={{
              textDecoration:
                "none",
              padding:
                12,
              border:
                "1px solid #e2e8f0",
              borderRadius:
                11,
              background:
                "#f8fafc",
              color:
                "#0f172a",
              fontWeight:
                700,
              fontSize:
                12,
              textAlign:
                "center",
            }}
          >
            Background Remover →
          </a>

          <a
            href="/"
            style={{
              textDecoration:
                "none",
              padding:
                12,
              border:
                "1px solid #e2e8f0",
              borderRadius:
                11,
              background:
                "#f8fafc",
              color:
                "#0f172a",
              fontWeight:
                700,
                fontSize:
                12,
              textAlign:
                "center",
            }}
          >
            Explore All NEXORA Tools →
          </a>
        </div>

        {/* LEGAL LINKS */}
        <div
          style={{
            marginTop:
              22,
            padding:
              "15px 12px",
            borderTop:
              "1px solid #e2e8f0",
            borderBottom:
              "1px solid #e2e8f0",
          }}
        >
          <p
            style={{
              textAlign:
                "center",
              fontSize:
                11,
              fontWeight:
                800,
              color:
                "#475569",
              margin:
                "0 0 10px",
            }}
          >
            Legal & Information
          </p>

          <div
            style={{
              display:
                "flex",
              flexWrap:
                "wrap",
              justifyContent:
                "center",
              gap:
                "7px 14px",
            }}
          >
            <a
              href="/privacy-policy"
              style={{
                color:
                  "#64748b",
                textDecoration:
                  "none",
                fontSize:
                  11,
                fontWeight:
                  600,
              }}
            >
              Privacy Policy
            </a>

            <a
              href="/terms-of-service"
              style={{
                color:
                  "#64748b",
                textDecoration:
                  "none",
                fontSize:
                  11,
                fontWeight:
                  600,
              }}
            >
              Terms of Service
            </a>

            <a
              href="/disclaimer"
              style={{
                color:
                  "#64748b",
                textDecoration:
                  "none",
                fontSize:
                  11,
                fontWeight:
                  600,
              }}
            >
              Disclaimer
            </a>

            <a
              href="/cookie-policy"
              style={{
                color:
                  "#64748b",
                textDecoration:
                  "none",
                fontSize:
                  11,
                fontWeight:
                  600,
              }}
            >
              Cookie Policy
            </a>

            <a
              href="/contact"
              style={{
                color:
                  "#64748b",
                textDecoration:
                  "none",
                fontSize:
                  11,
                fontWeight:
                  600,
              }}
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* FOOTER INFO */}
        <p
          style={{
            textAlign:
              "center",
            fontSize:
              11,
            color:
              "#94a3b8",
            margin:
              "24px 0 8px",
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
          • NEXORA
          <br />
          Last Updated: 27 Nov 2026 • Free Online DPI Tool
        </p>
      </main>
    </div>
  );
}
