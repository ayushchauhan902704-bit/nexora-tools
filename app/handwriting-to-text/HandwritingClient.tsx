"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    puter?: any;
    gtag?: (...args: any[]) => void;
  }
}

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2000;
const MAX_SOURCE_PIXELS = 40_000_000;

type Status = "idle" | "preparing" | "ready" | "processing" | "done" | "error";

function trackEvent(name: string, params: Record<string, any> = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

function getExtension(name: string) {
  return name.toLowerCase().split(".").pop() || "";
}

function isSupportedImage(file: File) {
  const ext = getExtension(file.name);
  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

  return (
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/webp" ||
    allowedExtensions.includes(ext)
  );
}

function isHeic(file: File) {
  const name = file.name.toLowerCase();

  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

function getBaseName(name: string) {
  return name.replace(/\.[^/.]+$/, "") || "handwriting";
}

function escapeHTML(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function HandwritingClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef("");

  const [image, setImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const [puterReady, setPuterReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [shareAvailable, setShareAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.puter) {
        setPuterReady(true);
      }

      setShareAvailable(typeof navigator.share === "function");
    }

    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const validateFile = (file: File) => {
    if (isHeic(file)) {
      return "HEIC and HEIF images are not supported by this browser workflow. Please convert the image to JPG or PNG and upload it again.";
    }

    if (!isSupportedImage(file)) {
      return "Please upload a JPG, PNG, or WebP image.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "The image is too large. Please choose an image under 20 MB.";
    }

    return "";
  };

  const prepareImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);

      const img = new Image();

      img.onload = () => {
        try {
          const naturalWidth = img.naturalWidth;
          const naturalHeight = img.naturalHeight;

          if (!naturalWidth || !naturalHeight) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Invalid image dimensions."));
            return;
          }

          if (naturalWidth * naturalHeight > MAX_SOURCE_PIXELS) {
            URL.revokeObjectURL(objectUrl);
            reject(
              new Error(
                "This image has too many pixels to process safely. Please use a smaller image."
              )
            );
            return;
          }

          const scale = Math.min(
            1,
            MAX_IMAGE_DIMENSION / Math.max(naturalWidth, naturalHeight)
          );

          const width = Math.max(1, Math.round(naturalWidth * scale));
          const height = Math.max(1, Math.round(naturalHeight * scale));

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Your browser could not process this image."));
            return;
          }

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          ctx.drawImage(img, 0, 0, width, height);

          const result = canvas.toDataURL("image/jpeg", 0.9);

          URL.revokeObjectURL(objectUrl);

          if (!result || result.length < 100) {
            reject(new Error("The image could not be prepared."));
            return;
          }

          resolve(result);
        } catch {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("The image could not be prepared."));
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("This image could not be decoded by your browser."));
      };

      img.src = objectUrl;
    });
  };

  const processFile = async (file?: File) => {
    if (!file) return;

    const validationError = validateFile(file);

    if (validationError) {
      setImage("");
      setPreviewUrl("");
      setFileName("");
      setText("");
      setError(validationError);
      setStatus("error");

      trackEvent("processing_error", {
        tool: "handwriting_to_text",
        error_type: "validation",
      });

      return;
    }

    try {
      setError("");
      setText("");
      setCopied(false);
      setStatus("preparing");

      trackEvent("tool_started", {
        tool: "handwriting_to_text",
      });

      const preview = URL.createObjectURL(file);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      previewUrlRef.current = preview;

      setPreviewUrl(preview);
      setFileName(file.name);

      const preparedImage = await prepareImage(file);

      setImage(preparedImage);
      setStatus("ready");
    } catch (err: any) {
      setImage("");
      setPreviewUrl("");
      setFileName("");

      setStatus("error");

      setError(
        err?.message ||
          "We could not prepare this image. Please try a clear JPG, PNG, or WebP photo."
      );
    }
  };

  const onFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await processFile(event.target.files?.[0]);

    if (event.target) {
      event.target.value = "";
    }
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      await processFile(file);
    }
  };

  const handlePaste = async (
    event: React.ClipboardEvent<HTMLDivElement>
  ) => {
    const items = event.clipboardData?.items;

    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();

        if (file) {
          await processFile(file);
        }

        return;
      }
    }
  };

  const extractResult = (response: any): string => {
    if (!response) return "";

    if (typeof response === "string") {
      return response;
    }

    if (typeof response?.text === "string") {
      return response.text;
    }

    if (typeof response?.message?.content === "string") {
      return response.message.content;
    }

    if (Array.isArray(response?.message?.content)) {
      return response.message.content
        .map((item: any) =>
          typeof item === "string" ? item : item?.text || ""
        )
        .join("");
    }

    if (Array.isArray(response?.content)) {
      return response.content
        .map((item: any) =>
          typeof item === "string" ? item : item?.text || ""
        )
        .join("");
    }

    return "";
  };

  const cleanResult = (value: string) => {
    return value
      .replace(/^```(?:text|plaintext|txt|markdown)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  };

  const doAI = async () => {
    if (!image) {
      setError("Please upload a handwriting photo first.");
      setStatus("error");
      return;
    }

    if (!window.puter) {
      setError(
        "The AI service is still loading. Please wait a moment and try again."
      );
      setStatus("error");
      return;
    }

    setError("");
    setText("");
    setCopied(false);
    setStatus("processing");

    trackEvent("processing_started", {
      tool: "handwriting_to_text",
    });

    /*
      IMPORTANT:
      The website UI is English.
      The transcription itself is NOT restricted to English.

      The AI must preserve the language/script actually visible
      in the uploaded handwriting.
    */
    const prompt = `
You are a multilingual handwriting recognition and document transcription system.

Your task is to TRANSCRIBE the uploaded handwritten document into editable digital text.

The website interface is English, but the handwritten content can be in ANY language or combination of languages that you can recognize.

LANGUAGE AND SCRIPT RULES:

1. English handwriting must remain English.
2. Hindi handwriting written in Devanagari must remain Hindi / Devanagari.
3. Hinglish written using Latin letters must remain Hinglish.
4. Hindi + English mixed handwriting must remain mixed Hindi + English.
5. Do not translate any language into another language.
6. Do not convert Hindi into English.
7. Do not convert English into Hindi.
8. Do not convert Hinglish into Hindi.
9. Do not convert Hinglish into English.
10. Do not normalize or standardize the language.
11. Preserve other recognizable languages and scripts in their original form.
12. Preserve Unicode characters when applicable.

EXAMPLES:

If the image says:
"Kal school jana hai"

Output:
"Kal school jana hai"

If the image says:
"कल स्कूल जाना है"

Output:
"कल स्कूल जाना है"

If the image says:
"Kal school jana hai, लेकिन maths ka homework बाकी है."

Output:
"Kal school jana hai, लेकिन maths ka homework बाकी है."

TRANSCRIPTION RULES:

- Transcribe what is actually visible.
- Preserve the original wording.
- Do not correct spelling.
- Do not correct grammar.
- Do not rewrite sentences.
- Do not improve the writing.
- Do not summarize.
- Do not explain the content.
- Do not add information.
- Do not invent missing words.
- Do not guess a word just because it seems logically likely.
- Preserve names exactly as visible.
- Preserve places exactly as visible.
- Preserve numbers exactly as visible.
- Preserve dates exactly as visible.
- Preserve mathematical symbols when recognizable.
- Preserve punctuation.
- Preserve repeated words.
- Preserve informal language and slang.
- Preserve abbreviations.

STRUCTURE RULES:

- Preserve meaningful line breaks.
- Preserve paragraphs.
- Preserve headings.
- Preserve numbered lists.
- Preserve bullet-style lists when clearly visible.
- Preserve the original reading order.
- If a table is visible, preserve rows and columns as closely as possible using text spacing or clear separators.
- Do not merge the entire page into one paragraph.
- Do not create Markdown unless the original document clearly represents a list or heading.
- Do not add a title if the handwritten document does not contain one.

UNCLEAR HANDWRITING:

If a small part is genuinely impossible to read, write:

[unclear]

Do NOT invent a word.

IMPORTANT:

This is transcription, NOT translation.
This is transcription, NOT proofreading.
This is transcription, NOT rewriting.

The goal is to reproduce the handwritten content as faithfully as possible while converting it into clean editable text.

Return ONLY the transcription.
Do not describe the image.
Do not explain your answer.
Do not add introductory text.
`.trim();

    try {
      let response: any;

      try {
        response = await window.puter.ai.chat(prompt, image);
      } catch {
        response = await window.puter.ai.chat([
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ]);
      }

      const result = cleanResult(extractResult(response));

      if (!result) {
        throw new Error("EMPTY_RESULT");
      }

      setText(result);
      setStatus("done");
      setError("");

      trackEvent("processing_completed", {
        tool: "handwriting_to_text",
        word_count: result.trim().split(/\s+/).filter(Boolean).length,
        character_count: result.length,
      });
    } catch {
      setStatus("error");

      setError(
        "The handwriting could not be read successfully. Try a clearer, brighter, straighter photo and run it again."
      );

      trackEvent("processing_error", {
        tool: "handwriting_to_text",
        error_type: "recognition",
      });
    }
  };

  const clearAll = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    setImage("");
    setPreviewUrl("");
    setFileName("");
    setText("");
    setError("");
    setCopied(false);
    setStatus("idle");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const copyText = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      trackEvent("copy", {
        tool: "handwriting_to_text",
      });

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setError(
        "Copy failed. Please select the text manually and copy it."
      );
    }
  };

  const downloadTXT = () => {
    if (!text) return;

    const blob = new Blob(["\uFEFF" + text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${getBaseName(fileName)}-handwriting.txt`;
    link.click();

    URL.revokeObjectURL(url);

    trackEvent("download", {
      tool: "handwriting_to_text",
      format: "txt",
    });
  };

  const downloadWord = () => {
    if (!text) return;

    const safeText = escapeHTML(text);

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Handwriting to Text - NEXORA</title>
<style>
body {
  margin: 0;
  padding: 40px;
  background: #ffffff;
  color: #111827;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.75;
}

.document {
  max-width: 800px;
  margin: 0 auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
</head>
<body>
<div class="document">${safeText}</div>
</body>
</html>
`;

    const blob = new Blob([html], {
      type: "application/msword;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${getBaseName(fileName)}-handwriting.doc`;
    link.click();

    URL.revokeObjectURL(url);

    trackEvent("download", {
      tool: "handwriting_to_text",
      format: "word",
    });
  };

  const downloadPDF = () => {
    if (!text) return;

    const safeText = escapeHTML(text);

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setError(
        "The PDF window was blocked. Please allow pop-ups for this page and try again."
      );
      return;
    }

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Handwriting to Text - NEXORA</title>

<style>
@page {
  size: A4;
  margin: 18mm;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #ffffff;
}

body {
  color: #111827;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.75;
}

.document {
  max-width: 760px;
  margin: 0 auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

@media print {
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>
</head>

<body>
<div class="document">${safeText}</div>

<script>
window.onload = function () {
  setTimeout(function () {
    window.print();
  }, 250);
};
</script>

</body>
</html>
`);

    printWindow.document.close();

    trackEvent("download", {
      tool: "handwriting_to_text",
      format: "pdf",
    });
  };

  const shareText = async () => {
    if (!text || typeof navigator.share !== "function") return;

    try {
      await navigator.share({
        title: "Handwriting to Text",
        text,
      });

      trackEvent("share", {
        tool: "handwriting_to_text",
      });
    } catch {
      // User cancelled sharing.
    }
  };

  const wordCount = text
    ? text.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const characterCount = text.length;

  return (
    <div className="nexora-page">
      <Script
        src="https://js.puter.com/v2/"
        strategy="afterInteractive"
        onLoad={() => setPuterReady(true)}
      />

      <main className="container">
        <section className="hero">
          <div className="eyebrow">
            FREE TOOL <span>•</span> HANDWRITING OCR
          </div>

          <h1>Handwriting to Text</h1>

          <p className="hero-copy">
            Convert handwritten photos into editable text while keeping the
            original language, wording and meaningful structure.
          </p>

          <div className="status">
            <span
              className={`status-dot ${
                puterReady ? "ready" : "loading"
              }`}
            />

            {puterReady ? "AI service ready" : "Preparing AI service"}
          </div>
        </section>

        <section className="tool-card">
          <div
            className={`upload-zone ${
              dragActive ? "drag-active" : ""
            } ${image ? "has-image" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onPaste={handlePaste}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();
                inputRef.current?.click();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Upload handwriting image"
          >
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              hidden
              onChange={onFileChange}
            />

            {image ? (
              <>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Uploaded handwriting preview"
                    className="preview"
                  />
                )}

                <div className="file-name">
                  {fileName || "Handwriting image"}
                </div>

                <div className="change-file">
                  Click to replace
                </div>
              </>
            ) : (
              <>
                <div className="upload-icon">↑</div>

                <div className="upload-title">
                  Upload handwriting photo
                </div>

                <div className="upload-subtitle">
                  Click, drag, drop or paste an image
                </div>

                <div className="formats">
                  JPG · PNG · WebP · Up to 20 MB
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="error-box" role="alert">
              <strong>Unable to continue</strong>
              <span>{error}</span>
            </div>
          )}

          {image && !error && status === "ready" && (
            <div className="ready-note">
              Image ready for transcription.
            </div>
          )}

          <div className="actions">
            <button
              type="button"
              onClick={doAI}
              disabled={
                !image ||
                status === "processing" ||
                status === "preparing"
              }
              className="primary-button"
            >
              {status === "processing" ? (
                <>
                  <span className="spinner" />
                  Reading handwriting...
                </>
              ) : status === "preparing" ? (
                <>
                  <span className="spinner" />
                  Preparing image...
                </>
              ) : (
                <>Convert to Text →</>
              )}
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="secondary-button"
            >
              Clear
            </button>
          </div>

          <div className="privacy-line">
            The image is processed through the AI service used for
            transcription. Avoid uploading highly sensitive documents.
          </div>
        </section>

        {status === "processing" && (
          <section className="processing-card">
            <div className="processing-head">
              <span>Reading your handwriting</span>
              <span>Working...</span>
            </div>

            <div className="progress-track">
              <div className="progress-bar" />
            </div>

            <p>
              The AI is analyzing the handwriting, language, line
              structure and document content.
            </p>
          </section>
        )}

        {text && (
          <section className="result-card">
            <div className="result-header">
              <div>
                <div className="result-title">
                  Transcription ready
                </div>

                <div className="result-meta">
                  {wordCount} words · {characterCount} characters
                </div>
              </div>

              <span className="result-badge">
                Editable
              </span>
            </div>

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="result-editor"
              aria-label="Editable handwriting transcription"
              spellCheck={false}
            />

            <div className="result-actions">
              <button
                type="button"
                onClick={downloadPDF}
                className="dark-button"
              >
                Save PDF
              </button>

              <button
                type="button"
                onClick={downloadWord}
                className="blue-button"
              >
                Word
              </button>

              <button
                type="button"
                onClick={downloadTXT}
                className="light-button"
              >
                TXT
              </button>

              <button
                type="button"
                onClick={copyText}
                className="light-button"
              >
                {copied ? "Copied" : "Copy"}
              </button>

              {shareAvailable && (
                <button
                  type="button"
                  onClick={shareText}
                  className="light-button share-button"
                >
                  Share
                </button>
              )}
            </div>

            <div className="edit-note">
              Review names, numbers, dates and unclear handwriting
              before using the transcription.
            </div>
          </section>
        )}

        <section className="tips-card">
          <div className="tips-icon">✦</div>

          <div>
            <div className="tips-title">
              Get better handwriting recognition
            </div>

            <p>
              Use a sharp, upright photo with even lighting. Keep the
              full page visible, avoid shadows and glare, and make sure
              the writing is large enough to read. One page per image
              usually gives a cleaner result.
            </p>
          </div>
        </section>

        <section className="content-card">
          <h2>Handwriting to Text Online</h2>

          <p>
            NEXORA Handwriting to Text converts a photo of handwritten
            notes into editable digital text. It can be useful for
            school notes, college notes, homework, assignments,
            meeting notes, personal notes, lists and handwritten pages.
          </p>

          <p>
            The transcription workflow is designed to preserve the
            language and wording visible in the image. English,
            Hindi, Hinglish and mixed Hindi-English handwriting can
            remain in their original form instead of being translated.
          </p>

          <h2>How to Convert Handwriting to Text</h2>

          <ol>
            <li>
              Upload or paste a clear photo of your handwritten page.
            </li>

            <li>
              Click <strong>Convert to Text</strong>.
            </li>

            <li>
              Review and edit the generated transcription.
            </li>

            <li>
              Copy it or export it as PDF, Word or TXT.
            </li>
          </ol>

          <h2>Hindi, English and Hinglish Handwriting</h2>

          <p>
            The recognition prompt does not force the handwriting into
            English. Hindi written in Devanagari stays in Devanagari,
            English stays in English, and Hinglish written with Latin
            letters stays as Hinglish. A page containing multiple
            languages can also be transcribed as mixed-language text.
          </p>

          <p>
            The result depends on handwriting clarity, image quality,
            lighting, contrast, page orientation and the recognition
            capability of the AI service. Faint, blurred, overlapping
            or extremely difficult handwriting may require manual
            correction.
          </p>

          <h2>Preserving the Original Writing</h2>

          <p>
            The transcription instructions prioritize what is actually
            written rather than silently correcting it. Spelling,
            grammar, names, numbers, punctuation and informal wording
            should remain unchanged whenever they are readable.
          </p>

          <h2>Who Can Use It?</h2>

          <ul>
            <li>
              Students digitizing handwritten class notes
            </li>

            <li>
              Teachers and educators organizing written material
            </li>

            <li>
              People converting handwritten lists into editable text
            </li>

            <li>
              Researchers digitizing handwritten notes
            </li>

            <li>
              Anyone who wants searchable digital copies of notes
            </li>
          </ul>
        </section>

        <section className="faq-card">
          <h2>Frequently Asked Questions</h2>

          <details>
            <summary>
              Can I convert a handwriting photo to text?
            </summary>

            <p>
              Yes. Upload a handwriting photo and select Convert to
              Text. The result appears in an editable text area.
            </p>
          </details>

          <details>
            <summary>
              Can it read Hindi handwriting?
            </summary>

            <p>
              Yes. The transcription instructions support Hindi and
              Devanagari handwriting while keeping the original
              language instead of translating it.
            </p>
          </details>

          <details>
            <summary>
              Can it read Hinglish handwriting?
            </summary>

            <p>
              Yes. Hinglish written using Latin letters is supported.
              The transcription workflow is instructed to preserve
              Hinglish instead of converting it into Hindi or English.
            </p>
          </details>

          <details>
            <summary>
              Can one page contain multiple languages?
            </summary>

            <p>
              Yes. The AI is instructed to preserve mixed-language
              writing, such as Hindi and English appearing on the same
              page.
            </p>
          </details>

          <details>
            <summary>
              Will the tool correct my spelling?
            </summary>

            <p>
              No. The transcription instructions prioritize the
              original wording instead of automatically correcting
              spelling or grammar.
            </p>
          </details>

          <details>
            <summary>
              Can I download the result?
            </summary>

            <p>
              Yes. You can copy the result or export it as PDF, Word
              or TXT.
            </p>
          </details>

          <details>
            <summary>
              Does handwriting recognition work perfectly?
            </summary>

            <p>
              No handwriting recognition system can guarantee perfect
              recognition for every writing style. Clear, well-lit
              images generally produce better results. Review important
              names, numbers and dates before using the result.
            </p>
          </details>

          <details>
            <summary>
              Do I need a NEXORA account?
            </summary>

            <p>
              This page does not add a NEXORA account requirement.
              The external AI service used for processing may have its
              own availability or access requirements.
            </p>
          </details>

          <details>
            <summary>
              Is the handwriting translated into English?
            </summary>

            <p>
              No. The transcription instructions tell the AI to keep
              the original language. Hindi should remain Hindi,
              Hinglish should remain Hinglish, and mixed-language
              handwriting should remain mixed-language.
            </p>
          </details>
        </section>

        <section className="related-card">
          <div>
            <div className="related-label">
              RELATED TOOL
            </div>

            <div className="related-title">
              Compress Images to Smaller File Sizes
            </div>
          </div>

          <a
            href="/compress-image-to-20kb-40kb-80kb-100kb-200kb-300kb-500kb"
            className="related-button"
          >
            Open Tool →
          </a>
        </section>

        <div className="page-note">
          NEXORA · Free online tools · Handwriting to Text
        </div>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .nexora-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(37, 99, 235, 0.06),
              transparent 430px
            ),
            #f8fafc;
          color: #0f172a;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .container {
          width: min(760px, calc(100% - 28px));
          margin: 0 auto;
          padding: 22px 0 38px;
        }

        .hero {
          text-align: center;
          margin-bottom: 16px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 9px;
          border: 1px solid #dbeafe;
          border-radius: 999px;
          background: #ffffff;
          color: #2563eb;
          font-size: 9px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.55px;
        }

        .eyebrow span {
          color: #94a3b8;
        }

        .hero h1 {
          margin: 10px 0 6px;
          font-size: clamp(30px, 7vw, 42px);
          line-height: 1.05;
          letter-spacing: -1.6px;
          font-weight: 900;
          background: linear-gradient(
            90deg,
            #2563eb,
            #7c3aed
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-copy {
          max-width: 560px;
          margin: 0 auto;
          color: #64748b;
          font-size: 13px;
          line-height: 1.55;
        }

        .status {
          margin-top: 7px;
          color: #64748b;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        .status-dot.ready {
          background: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .status-dot.loading {
          background: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .tool-card,
        .processing-card,
        .result-card,
        .tips-card,
        .content-card,
        .faq-card,
        .related-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          box-shadow:
            0 8px 30px rgba(15, 23, 42, 0.035);
        }

        .tool-card {
          padding: 12px;
        }

        .upload-zone {
          min-height: 166px;
          border: 1.5px dashed #cbd5e1;
          border-radius: 12px;
          background:
            linear-gradient(
              180deg,
              #ffffff 0%,
              #f8fbff 100%
            );
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          cursor: pointer;
          transition:
            border-color 0.15s ease,
            background 0.15s ease,
            transform 0.15s ease;
          outline: none;
          padding: 10px;
        }

        .upload-zone:hover,
        .upload-zone:focus-visible {
          border-color: #93c5fd;
          background: #f8fbff;
        }

        .upload-zone.drag-active {
          border-color: #2563eb;
          background: #eff6ff;
          transform: scale(1.005);
        }

        .upload-zone.has-image {
          min-height: 170px;
        }

        .upload-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 20px;
          font-weight: 900;
          margin-bottom: 7px;
        }

        .upload-title {
          font-size: 13px;
          font-weight: 850;
          color: #0f172a;
        }

        .upload-subtitle {
          margin-top: 3px;
          color: #64748b;
          font-size: 10px;
        }

        .formats {
          margin-top: 7px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 700;
        }

        .preview {
          max-width: 100%;
          max-height: 150px;
          display: block;
          border-radius: 8px;
          object-fit: contain;
          box-shadow:
            0 4px 18px rgba(15, 23, 42, 0.08);
        }

        .file-name {
          margin-top: 7px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #334155;
          font-size: 10px;
          font-weight: 700;
        }

        .change-file {
          margin-top: 2px;
          color: #2563eb;
          font-size: 9px;
          font-weight: 800;
        }

        .ready-note {
          margin-top: 8px;
          text-align: center;
          color: #16a34a;
          font-size: 10px;
          font-weight: 750;
        }

        .error-box {
          margin-top: 9px;
          padding: 9px 10px;
          border-radius: 9px;
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #991b1b;
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 10px;
          line-height: 1.45;
        }

        .error-box strong {
          font-size: 10px;
        }

        .actions {
          display: flex;
          gap: 7px;
          margin-top: 10px;
        }

        button {
          font-family: inherit;
        }

        .primary-button,
        .secondary-button {
          min-height: 39px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 850;
          transition:
            transform 0.12s ease,
            opacity 0.12s ease;
        }

        .primary-button {
          flex: 1;
          border: 0;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #7c3aed
            );
          color: #ffffff;
          box-shadow:
            0 7px 18px rgba(37, 99, 235, 0.17);
        }

        .primary-button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .primary-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        .secondary-button {
          padding: 0 16px;
          background: #ffffff;
          color: #334155;
          border: 1px solid #e2e8f0;
        }

        .privacy-line {
          margin-top: 8px;
          text-align: center;
          color: #94a3b8;
          font-size: 8.5px;
          line-height: 1.45;
        }

        .spinner {
          display: inline-block;
          width: 11px;
          height: 11px;
          margin-right: 6px;
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          vertical-align: -2px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .processing-card {
          margin-top: 10px;
          padding: 11px 12px;
        }

        .processing-head {
          display: flex;
          justify-content: space-between;
          color: #475569;
          font-size: 9px;
          font-weight: 800;
          margin-bottom: 7px;
        }

        .progress-track {
          height: 4px;
          background: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          width: 38%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #2563eb,
              #7c3aed
            );
          animation: progress 1.2s ease-in-out infinite;
        }

        .processing-card p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 9px;
          line-height: 1.45;
        }

        @keyframes progress {
          0% {
            transform: translateX(-120%);
          }

          50% {
            transform: translateX(130%);
          }

          100% {
            transform: translateX(300%);
          }
        }

        .result-card {
          margin-top: 10px;
          padding: 12px;
        }

        .result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
        }

        .result-title {
          color: #0f172a;
          font-size: 12px;
          font-weight: 900;
        }

        .result-meta {
          margin-top: 2px;
          color: #94a3b8;
          font-size: 9px;
        }

        .result-badge {
          padding: 4px 7px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #15803d;
          font-size: 8px;
          font-weight: 900;
          white-space: nowrap;
        }

        .result-editor {
          display: block;
          width: 100%;
          min-height: 250px;
          resize: vertical;
          padding: 11px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          outline: none;
          background: #ffffff;
          color: #111827;
          font-family:
            Inter,
            "Noto Sans",
            ui-sans-serif,
            system-ui,
            sans-serif;
          font-size: 12px;
          line-height: 1.7;
        }

        .result-editor:focus {
          border-color: #60a5fa;
          box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .result-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-top: 8px;
        }

        .result-actions button {
          min-height: 35px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 9.5px;
          font-weight: 850;
        }

        .dark-button {
          border: 0;
          background: #0f172a;
          color: #ffffff;
        }

        .blue-button {
          border: 0;
          background: #2563eb;
          color: #ffffff;
        }

        .light-button {
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #334155;
        }

        .edit-note {
          margin-top: 7px;
          color: #94a3b8;
          font-size: 8.5px;
          line-height: 1.45;
          text-align: center;
        }

        .tips-card {
          margin-top: 10px;
          padding: 11px 12px;
          display: flex;
          gap: 9px;
          background: #fffbeb;
          border-color: #fde68a;
        }

        .tips-icon {
          width: 24px;
          height: 24px;
          flex: 0 0 24px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: #fef3c7;
          color: #d97706;
          font-size: 11px;
          font-weight: 900;
        }

        .tips-title {
          color: #92400e;
          font-size: 10px;
          font-weight: 900;
        }

        .tips-card p {
          margin: 3px 0 0;
          color: #78350f;
          font-size: 9px;
          line-height: 1.55;
        }

        .content-card,
        .faq-card {
          margin-top: 10px;
          padding: 15px;
        }

        .content-card h2,
        .faq-card h2 {
          margin: 0 0 7px;
          color: #0f172a;
          font-size: 15px;
          line-height: 1.25;
          letter-spacing: -0.2px;
        }

        .content-card h2:not(:first-child) {
          margin-top: 18px;
        }

        .content-card p,
        .content-card li {
          color: #475569;
          font-size: 10.5px;
          line-height: 1.7;
        }

        .content-card p {
          margin: 0 0 8px;
        }

        .content-card ol,
        .content-card ul {
          padding-left: 18px;
          margin: 5px 0 0;
        }

        .content-card li {
          margin-bottom: 4px;
        }

        .content-card strong {
          color: #334155;
        }

        .faq-card details {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-top: 6px;
          padding: 9px 10px;
          background: #ffffff;
        }

        .faq-card summary {
          color: #334155;
          font-size: 10px;
          line-height: 1.4;
          font-weight: 800;
          cursor: pointer;
          list-style-position: inside;
        }

        .faq-card p {
          color: #64748b;
          font-size: 9.5px;
          line-height: 1.6;
          margin: 7px 0 0 18px;
        }

        .related-card {
          margin-top: 10px;
          padding: 11px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .related-label {
          color: #94a3b8;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .related-title {
          margin-top: 2px;
          color: #334155;
          font-size: 10px;
          font-weight: 800;
        }

        .related-button {
          flex: 0 0 auto;
          padding: 8px 10px;
          border-radius: 7px;
          background: #0f172a;
          color: #ffffff;
          text-decoration: none;
          font-size: 9px;
          font-weight: 850;
        }

        .page-note {
          padding: 17px 0 4px;
          color: #94a3b8;
          text-align: center;
          font-size: 8.5px;
        }

        @media (max-width: 520px) {
          .container {
            width: min(100% - 18px, 760px);
            padding-top: 18px;
          }

          .tool-card {
            padding: 9px;
          }

          .upload-zone {
            min-height: 152px;
          }

          .actions {
            gap: 6px;
          }

          .secondary-button {
            padding: 0 13px;
          }

          .result-actions {
            grid-template-columns: repeat(2, 1fr);
          }

          .related-card {
            align-items: flex-start;
          }

          .related-button {
            margin-top: 1px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .spinner,
          .progress-bar {
            animation: none;
          }

          .primary-button,
          .upload-zone {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
