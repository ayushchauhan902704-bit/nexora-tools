"use client";

import { useEffect, useRef, useState } from "react";

type ImgItem = {
  url: string;
  width: number;
  height: number;
};

export default function JpgToPdf() {
  const [images, setImages] = useState<ImgItem[]>([]);
  const [size, setSize] = useState("a4");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const readAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Unable to read file"));

      reader.readAsDataURL(file);
    });

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Unable to load image"));

      img.src = src;
    });

  const fixAndCompress = (img: HTMLImageElement) => {
    const maxSide = 2000;

    let width = img.naturalWidth;
    let height = img.naturalHeight;

    const scale = Math.min(
      1,
      maxSide / Math.max(width, height)
    );

    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas unavailable");
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(img, 0, 0, width, height);

    return {
      data: canvas.toDataURL("image/jpeg", 0.85),
      width,
      height,
    };
  };

  const handleFiles = async (
    list: FileList | File[]
  ) => {
    if (busy) return;

    const selected = Array.from(list || []);

    if (!selected.length) return;

    const available = 50 - images.length;

    if (available <= 0) {
      setStatus("Maximum 50 images reached.");
      return;
    }

    const files = selected.slice(0, available);

    setStatus("Preparing images...");

    const newImages: ImgItem[] = [];

    for (const file of files) {
      try {
        if (!file.type.startsWith("image/")) {
          continue;
        }

        const dataURL = await readAsDataURL(file);
        const img = await loadImage(dataURL);
        const fixed = fixAndCompress(img);

        newImages.push({
          url: fixed.data,
          width: fixed.width,
          height: fixed.height,
        });
      } catch {
        // Skip unsupported/corrupted image.
      }
    }

    if (newImages.length) {
      setImages((prev) => [...prev, ...newImages]);

      setPdfUrl(null);
      setPdfBlob(null);

      setStatus(
        `${newImages.length} image${
          newImages.length > 1 ? "s" : ""
        } added.`
      );
    } else {
      setStatus("No supported images could be added.");
    }
  };

  const convertPDF = async () => {
    if (!images.length) {
      alert("Please select at least one image.");
      return;
    }

    if (busy) return;

    setBusy(true);
    setStatus("Converting images...");

    try {
      const { jsPDF } = await import("jspdf");

      let doc: any = null;

      for (let i = 0; i < images.length; i++) {
        setStatus(
          `Converting image ${i + 1} of ${images.length}...`
        );

        const item = images[i];

        if (size === "fit") {
          const widthMM =
            (item.width * 25.4) / 96;

          const heightMM =
            (item.height * 25.4) / 96;

          const orientation =
            widthMM > heightMM
              ? "landscape"
              : "portrait";

          if (!doc) {
            doc = new jsPDF({
              orientation,
              unit: "mm",
              format: [widthMM, heightMM],
              compress: true,
            });
          } else {
            doc.addPage(
              [widthMM, heightMM],
              orientation
            );
          }

          doc.addImage(
            item.url,
            "JPEG",
            0,
            0,
            widthMM,
            heightMM,
            undefined,
            "FAST"
          );
        } else {
          const format =
            size === "letter"
              ? "letter"
              : "a4";

          if (!doc) {
            doc = new jsPDF({
              orientation: "portrait",
              unit: "mm",
              format,
              compress: true,
            });
          } else {
            doc.addPage(format, "portrait");
          }

          const pageWidth =
            doc.internal.pageSize.getWidth();

          const pageHeight =
            doc.internal.pageSize.getHeight();

          const ratio = Math.min(
            (pageWidth - 20) / item.width,
            (pageHeight - 20) / item.height
          );

          const width = item.width * ratio;
          const height = item.height * ratio;

          doc.addImage(
            item.url,
            "JPEG",
            (pageWidth - width) / 2,
            (pageHeight - height) / 2,
            width,
            height,
            undefined,
            "FAST"
          );
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 0)
        );
      }

      const name = `NEXORA-Photos-${Date.now()}.pdf`;

      const blob = doc.output("blob");

      setFileName(name);
      setPdfBlob(blob);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setStatus("PDF ready. Preview it or download it.");
    } catch {
      setStatus(
        "Could not create the PDF. Try fewer images."
      );
    }

    setBusy(false);
  };

  const downloadPDF = async () => {
    if (!pdfBlob) {
      alert("Please create the PDF first.");
      return;
    }

    try {
      const file = new File(
        [pdfBlob],
        fileName,
        {
          type: "application/pdf",
        }
      );

      if (
        typeof navigator.share === "function" &&
        typeof (navigator as any).canShare === "function" &&
        (navigator as any).canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          files: [file],
          title: "NEXORA PDF",
        });

        setStatus(
          "PDF ready. Choose Save to Files if needed."
        );

        return;
      }
    } catch {
      // Fall back to browser download.
    }

    const url = URL.createObjectURL(pdfBlob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setStatus("PDF download started.");

    setTimeout(
      () => URL.revokeObjectURL(url),
      120000
    );
  };

  const removeImage = (index: number) => {
    if (busy) return;

    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setPdfUrl(null);
    setPdfBlob(null);

    setStatus("Image removed.");
  };

  const clearAll = () => {
    if (busy) return;

    setImages([]);
    setPdfUrl(null);
    setPdfBlob(null);
    setFileName("");

    setStatus("All images cleared.");
  };

  const card: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e8e6ed",
    borderRadius: 18,
    padding: 16,
    boxShadow:
      "0 8px 30px rgba(20, 10, 40, 0.045)",
  };

  const pink = "#ec4899";
  const purple = "#7c3aed";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#faf9fc 0%,#f5f4f8 100%)",
        color: "#18151f",
        padding: "10px 10px 35px",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        button,
        input,
        select {
          font-family: inherit;
        }

        button {
          cursor: pointer;
          transition: .15s ease;
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        select,
        select option {
          color: #18151f !important;
          background: #ffffff !important;
          -webkit-text-fill-color: #18151f !important;
        }

        @media(max-width:600px) {
          .topTitle {
            font-size: 16px !important;
          }

          .heroTitle {
            font-size: 23px !important;
          }

          .actionGrid {
            grid-template-columns: 1fr !important;
          }

          .imageGrid {
            grid-template-columns: repeat(2,1fr) !important;
          }
        }
      `}</style>

      <div
        style={{
          width: "min(760px,100%)",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: "7px 2px 11px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/"
            className="topTitle"
            style={{
              textDecoration: "none",
              fontSize: 18,
              fontWeight: 950,
              color: "#18151f",
              letterSpacing: -0.6,
            }}
          >
            NEX<span style={{ color: pink }}>ORA</span>
          </a>

          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 9.5,
                fontWeight: 900,
                color: "#be185d",
                background: "#fff0f7",
                border: "1px solid #f7d5e7",
                padding: "4px 8px",
                borderRadius: 999,
              }}
            >
              PRIVATE
            </span>

            <span
              style={{
                fontSize: 9.5,
                fontWeight: 900,
                color: "#6d28d9",
                background: "#f4efff",
                border: "1px solid #e5dafe",
                padding: "4px 8px",
                borderRadius: 999,
              }}
            >
              NO WATERMARK
            </span>
          </div>
        </header>

        {/* MAIN TOOL */}

        <section style={card}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-block",
                padding: "5px 9px",
                borderRadius: 999,
                background: "#fff0f7",
                border: "1px solid #f6d5e7",
                color: pink,
                fontSize: 9.5,
                fontWeight: 950,
              }}
            >
              JPG • JPEG • PNG • WEBP
            </div>

            <h1
              className="heroTitle"
              style={{
                fontSize: 25,
                lineHeight: 1.15,
                margin: "9px 0 5px",
                fontWeight: 950,
                letterSpacing: -0.8,
              }}
            >
              JPG to PDF Converter
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: 11.5,
                lineHeight: 1.6,
                color: "#706b77",
              }}
            >
              Combine up to 50 images into one PDF.
              Free, private and watermark-free.
            </p>
          </div>

          {/* UPLOAD */}

          <div
            onClick={() =>
              !busy && fileRef.current?.click()
            }
            onDragOver={(e) =>
              e.preventDefault()
            }
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            style={{
              marginTop: 14,
              border: `1.5px dashed ${pink}`,
              borderRadius: 14,
              padding: "13px 10px",
              textAlign: "center",
              background: "#fff8fc",
              cursor: busy
                ? "not-allowed"
                : "pointer",
            }}
          >
            <div
              style={{
                fontSize: 23,
                lineHeight: 1,
              }}
            >
              📁
            </div>

            <div
              style={{
                marginTop: 5,
                fontSize: 12.5,
                fontWeight: 850,
              }}
            >
              Select or drag images here
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              multiple
              hidden
              onChange={async (e) => {
                await handleFiles(
                  e.target.files!
                );
                e.target.value = "";
              }}
            />

            <button
              type="button"
              disabled={busy}
              onClick={(e) => {
                e.stopPropagation();
                fileRef.current?.click();
              }}
              style={{
                marginTop: 8,
                border: "none",
                background: pink,
                color: "#ffffff",
                fontWeight: 900,
                padding: "8px 17px",
                borderRadius: 9,
                fontSize: 11.5,
              }}
            >
              Choose Images
            </button>

            <div
              style={{
                marginTop: 6,
                color: "#8a8490",
                fontSize: 9.5,
                fontWeight: 700,
              }}
            >
              Up to 50 images • Browser processing
            </div>
          </div>

          {/* IMAGE COUNT */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 13,
              fontSize: 11.5,
            }}
          >
            <b>Your Images</b>

            <span
              style={{
                color: pink,
                fontWeight: 850,
              }}
            >
              {images.length} / 50
            </span>
          </div>

          {/* IMAGE GRID */}

          {images.length > 0 ? (
            <div
              className="imageGrid"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3,1fr)",
                gap: 8,
                marginTop: 8,
              }}
            >
              {images.map((item, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    height: 95,
                    overflow: "hidden",
                    borderRadius: 9,
                    border:
                      "1px solid #e7e4ea",
                    background: "#f6f5f7",
                  }}
                >
                  <img
                    src={item.url}
                    alt={`Selected image ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      left: 4,
                      background:
                        "rgba(0,0,0,.62)",
                      color: "#fff",
                      borderRadius: 5,
                      padding: "2px 5px",
                      fontSize: 9,
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}
                  </span>

                  <button
                    onClick={() =>
                      removeImage(index)
                    }
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: "none",
                      background: "#ef4444",
                      color: "#fff",
                      fontWeight: 900,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#aaa5ae",
                fontSize: 10.5,
                padding: "10px 0 2px",
              }}
            >
              Selected images will appear here.
            </div>
          )}

          {/* PAGE SIZE */}

          <div style={{ marginTop: 13 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 900,
                marginBottom: 5,
              }}
            >
              PDF Page Size
            </label>

            <select
              value={size}
              onChange={(e) =>
                setSize(e.target.value)
              }
              style={{
                width: "100%",
                height: 40,
                border: "1px solid #ddd9e5",
                borderRadius: 9,
                padding: "0 10px",
                fontSize: 11.5,
                fontWeight: 750,
                outline: "none",
              }}
            >
              <option value="a4">
                A4 — Recommended for printing
              </option>

              <option value="letter">
                US Letter — Standard US size
              </option>

              <option value="fit">
                Fit Image — Original ratio, no margin
              </option>
            </select>

            <div
              style={{
                marginTop: 4,
                fontSize: 9.5,
                color: "#89838e",
              }}
            >
              Selected:{" "}
              <b style={{ color: purple }}>
                {size === "a4"
                  ? "A4"
                  : size === "letter"
                  ? "US Letter"
                  : "Fit Image"}
              </b>
            </div>
          </div>

          {/* ACTIONS */}

          <div
            className="actionGrid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 8,
              marginTop: 13,
            }}
          >
            <button
              onClick={convertPDF}
              disabled={busy}
              style={{
                height: 42,
                border:
                  `1.5px solid ${pink}`,
                background: "#fff",
                color: pink,
                borderRadius: 9,
                fontSize: 11.5,
                fontWeight: 900,
              }}
            >
              {busy
                ? "Converting..."
                : "Preview PDF"}
            </button>

            <button
              onClick={downloadPDF}
              disabled={!pdfBlob}
              style={{
                height: 42,
                border: "none",
                background:
                  pdfBlob
                    ? purple
                    : "#d8d4dc",
                color: "#fff",
                borderRadius: 9,
                fontSize: 11.5,
                fontWeight: 900,
                opacity:
                  pdfBlob ? 1 : 0.7,
              }}
            >
              Download PDF
            </button>
          </div>

          <button
            onClick={clearAll}
            disabled={busy}
            style={{
              width: "100%",
              height: 36,
              marginTop: 7,
              border: "1px solid #e5e1e8",
              background: "#faf9fb",
              color: "#625c67",
              borderRadius: 9,
              fontSize: 10.5,
              fontWeight: 800,
            }}
          >
            Clear All
          </button>

          {/* STATUS */}

          {status && (
            <div
              style={{
                textAlign: "center",
                marginTop: 9,
                color: purple,
                fontSize: 10.5,
                fontWeight: 800,
              }}
            >
              {status}
            </div>
          )}

          {/* PREVIEW */}

          {pdfUrl && (
            <div
              style={{
                marginTop: 13,
                border:
                  "1px solid #e4e1e7",
                borderRadius: 11,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 9px",
                  background: "#faf9fb",
                  borderBottom:
                    "1px solid #e7e4e9",
                }}
              >
                <b
                  style={{
                    fontSize: 10,
                  }}
                >
                  PDF Preview
                </b>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: pink,
                    fontSize: 9.5,
                    fontWeight: 900,
                    textDecoration:
                      "none",
                  }}
                >
                  Open Full ↗
                </a>
              </div>

              <object
                data={pdfUrl}
                type="application/pdf"
                width="100%"
                height="360"
                style={{
                  display: "block",
                  background: "#fff",
                }}
              >
                <iframe
                  src={pdfUrl}
                  title="PDF Preview"
                  style={{
                    width: "100%",
                    height: 360,
                    border: "none",
                  }}
                />
              </object>

              <div
                style={{
                  padding: "7px 9px",
                  textAlign: "center",
                  fontSize: 9.5,
                  color: "#85808a",
                }}
              >
                Preview not available?
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: pink,
                    fontWeight: 850,
                    marginLeft: 3,
                  }}
                >
                  Open PDF
                </a>
              </div>
            </div>
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: 11,
              color: "#9a959e",
              fontSize: 9.5,
            }}
          >
            Browser-based processing • No
            watermark • No registration
          </div>
        </section>

        {/* ABOUT */}

        <section
          style={{
            ...card,
            marginTop: 12,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 950,
            }}
          >
            JPG to PDF Converter
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              color: "#706b77",
              fontSize: 10.5,
              lineHeight: 1.7,
            }}
          >
            Convert JPG, JPEG, PNG and WEBP images
            into a single PDF directly in your
            browser. Combine up to 50 images and
            choose A4, US Letter or Fit Image.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 7,
              marginTop: 10,
            }}
          >
            {[
              ["50 Images", "Combine multiple images"],
              ["No Watermark", "Clean PDF output"],
              ["A4 & Letter", "Print-friendly sizes"],
              ["Fit Image", "Keep original ratio"],
            ].map(([title, text]) => (
              <div
                key={title}
                style={{
                  padding: 9,
                  borderRadius: 9,
                  background:
                    "#faf9fc",
                  border:
                    "1px solid #eeeaf1",
                }}
              >
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 900,
                    color: pink,
                  }}
                >
                  {title}
                </div>

                <div
                  style={{
                    marginTop: 2,
                    fontSize: 9.5,
                    color: "#85808a",
                  }}
                >
                  {text}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW TO */}

        <section
          style={{
            ...card,
            marginTop: 12,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 950,
            }}
          >
            How to Convert JPG to PDF
          </h2>

          <ol
            style={{
              margin:
                "8px 0 0",
              paddingLeft: 19,
              color: "#625c67",
              fontSize: 10.5,
              lineHeight: 1.8,
            }}
          >
            <li>
              Select or drag your images.
            </li>

            <li>
              Choose A4, US Letter or Fit Image.
            </li>

            <li>
              Select <b>Preview PDF</b>.
            </li>

            <li>
              Check the preview and download.
            </li>
          </ol>
        </section>

        {/* FAQ */}

        <section
          style={{
            ...card,
            marginTop: 12,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 950,
            }}
          >
            JPG to PDF FAQ
          </h2>

          <div style={{ marginTop: 9 }}>
            {[
              [
                "How do I convert JPG to PDF?",
                "Select your images, choose a page size, preview the PDF and download it.",
              ],
              [
                "Can I convert multiple JPG images?",
                "Yes. You can combine up to 50 supported images into one PDF.",
              ],
              [
                "Is it free?",
                "Yes. The converter can be used free without registration.",
              ],
              [
                "Can I use A4 or US Letter?",
                "Yes. A4, US Letter and Fit Image are available.",
              ],
              [
                "Does it add a watermark?",
                "No NEXORA watermark is added to the generated PDF.",
              ],
            ].map(([question, answer]) => (
              <details
                key={question}
                style={{
                  padding:
                    "8px 0",
                  borderBottom:
                    "1px solid #eeeaf0",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: 10.5,
                    fontWeight: 900,
                    color: "#28232d",
                  }}
                >
                  {question}
                </summary>

                <p
                  style={{
                    margin:
                      "6px 0 1px",
                    fontSize: 10,
                    lineHeight: 1.6,
                    color: "#77717c",
                  }}
                >
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* RELATED */}

        <section
          style={{
            ...card,
            marginTop: 12,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 950,
            }}
          >
            Related Tools
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginTop: 9,
            }}
          >
            <a
              href="/pdf-to-jpg"
              style={{
                textDecoration: "none",
                color: pink,
                background: "#fff0f7",
                border:
                  "1px solid #f5d7e7",
                borderRadius: 8,
                padding:
                  "7px 9px",
                fontSize: 9.5,
                fontWeight: 900,
              }}
            >
              PDF to JPG
            </a>

            <a
              href="/compress-image"
              style={{
                textDecoration: "none",
                color: purple,
                background: "#f4efff",
                border:
                  "1px solid #e5dcfb",
                borderRadius: 8,
                padding:
                  "7px 9px",
                fontSize: 9.5,
                fontWeight: 900,
              }}
            >
              Compress Image
            </a>

            <a
              href="/"
              style={{
                textDecoration: "none",
                color: "#625c67",
                background: "#f7f6f8",
                border:
                  "1px solid #e5e2e8",
                borderRadius: 8,
                padding:
                  "7px 9px",
                fontSize: 9.5,
                fontWeight: 900,
              }}
            >
              All Tools
            </a>
          </div>
        </section>

        {/* FOOTER */}

        <footer
          style={{
            textAlign: "center",
            padding: "18px 5px 5px",
            color: "#96919b",
            fontSize: 9.5,
            lineHeight: 1.7,
          }}
        >
          <div
            style={{
              fontWeight: 950,
              color: "#27222c",
              fontSize: 13,
            }}
          >
            NEX
            <span style={{ color: pink }}>
              ORA
            </span>
          </div>

          <div style={{ marginTop: 3 }}>
            Free, fast and simple online tools.
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "center",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 7,
            }}
          >
            <a
              href="/about"
              style={{
                color: "#706b77",
              }}
            >
              About
            </a>

            <a
              href="/contact"
              style={{
                color: "#706b77",
              }}
            >
              Contact
            </a>

            <a
              href="/privacy"
              style={{
                color: "#706b77",
              }}
            >
              Privacy
            </a>

            <a
              href="/terms"
              style={{
                color: "#706b77",
              }}
            >
              Terms
            </a>
          </div>

          <div style={{ marginTop: 7 }}>
            © 2026 NEXORA Tools
          </div>
        </footer>
      </div>
    </div>
  );
}
