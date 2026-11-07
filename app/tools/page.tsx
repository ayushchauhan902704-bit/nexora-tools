import Link from "next/link";

export const metadata = {
  title: "All Tools - Nexora Tools | Free Online Tools",
  description: "30+ Free Online Tools - No Watermark, No Ads. Image, PDF, Calculator Tools",
};

export default function ToolsPage() {
  return (
    <>
      <style>{`
        body{font-family:Arial;max-width:1000px;margin:auto;padding:20px;background:#fafafa}
        h1{text-align:center;margin-bottom:5px}
        .sub{color:#666;text-align:center;margin-bottom:25px}
        .category-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:15px;margin-bottom:35px}
        .category-box{background:white;border:2px solid #eee;padding:18px;border-radius:14px;text-align:center;cursor:pointer;transition:0.2s}
        .category-box:hover{border-color:#000;transform:translateY(-3px);box-shadow:0 5px 15px rgba(0,0,0,0.1)}
        .category-box h3{margin:5px 0;color:#000}
        .category-box p{font-size:13px;color:#777;margin:0}
        .section-title{margin-top:35px;margin-bottom:15px;padding-left:10px;border-left:4px solid #000;font-size:20px}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
        .card{border:1px solid #ddd;padding:14px;border-radius:10px;text-align:center;text-decoration:none;color:#000;font-weight:600;background:white;display:block}
        .card:hover{background:#000;color:white}
        .card.new{background:#fdf2f8;border-color:#fbcfe8;color:#be185d}
        .card.pro{background:#000;color:#fff;border-color:#000;box-shadow:0 4px 12px rgba(0,0,0,0.2)}
        .card.tts-new{background:#eff6ff;border-color:#93c5fd;color:#1d4ed8;box-shadow:0 4px 12px rgba(37,99,235,0.15)}
        .card.video-new{background:#f0fdf4;border-color:#86efac;color:#15803d;box-shadow:0 4px 12px rgba(34,197,94,0.15)}
        .card.ocr-new{background:#f5f3ff;border-color:#c4b5fd;color:#5b21b6;box-shadow:0 4px 12px rgba(109,40,217,0.15)}
        .card.dpi-new{background:#fffbeb;border-color:#fcd34d;color:#92400e;box-shadow:0 4px 12px rgba(245,158,11,0.2)}
      `}</style>

      <h1>All Tools - Free, No Watermark</h1>
      <p className="sub">36 Tools - Organized by Category</p>

      <div className="category-grid">
        <Link href="#video-tools" style={{textDecoration:"none"}}><div className="category-box" style={{borderColor:"#22c55e",background:"#f0fdf4"}}><h3>🎬 Video Tools</h3><p>1 Tool - NEW Compress</p></div></Link>
        <Link href="#pdf-tools" style={{textDecoration:"none"}}><div className="category-box"><h3>📄 PDF Tools</h3><p>6 Tools - Merge, Split, Convert</p></div></Link>
        <Link href="#image-tools" style={{textDecoration:"none"}}><div className="category-box"><h3>🖼️ Image Tools</h3><p>8 Tools - DPI, OCR, BG Remover, Passport</p></div></Link>
        <Link href="#calculator-tools" style={{textDecoration:"none"}}><div className="category-box"><h3>🧮 Calculator Tools</h3><p>6 Tools - Age, BMI, EMI</p></div></Link>
        <Link href="#text-tools" style={{textDecoration:"none"}}><div className="category-box"><h3>📝 Text Tools</h3><p>8 Tools - TTS, Counter, Humanizer</p></div></Link>
        <Link href="#other-tools" style={{textDecoration:"none"}}><div className="category-box"><h3>⚡ Other Tools</h3><p>7 Tools - Speed Test, QR, Resume</p></div></Link>
      </div>

      <h2 className="section-title" id="video-tools" style={{borderLeftColor:"#22c55e"}}>🎬 Video Tools</h2>
      <div className="grid">
        <Link className="card video-new" href="/video-compressor">🎬 Video Compressor NEW - No Watermark</Link>
      </div>

      <h2 className="section-title" id="pdf-tools">📄 PDF Tools</h2>
      <div className="grid">
        <Link className="card" href="/jpg-to-pdf">JPG to PDF</Link>
        <Link className="card" href="/pdf-to-jpg">PDF to JPG</Link>
        <Link className="card" href="/pdf-to-word">PDF to Word</Link>
        <Link className="card" href="/word-to-pdf">Word to PDF</Link>
        <Link className="card" href="/pdf-merge-split">PDF Merge Split</Link>
        <Link className="card" href="/image-to-word">Image to Word</Link>
      </div>

      <h2 className="section-title" id="image-tools">🖼️ Image Tools</h2>
      <div className="grid">
        <Link className="card dpi-new" href="/image-dpi-changer">📏 Image DPI Changer NEW - 72 to 300 DPI</Link>
        <Link className="card ocr-new" href="/image-to-text">🔤 Image to Text NEW - OCR</Link>
        <Link className="card" href="/background-remover">Background Remover</Link>
        <Link className="card" href="/passport-size-photo-maker">Passport Photo</Link>
        <Link className="card" href="/compress-image">Compress Image</Link>
        <Link className="card" href="/qr-code-generator">QR Generator</Link>
        <Link className="card" href="/mirror">Mirror</Link>
        <Link className="card" href="/handwriting-to-text">Handwriting to Text</Link>
      </div>

      <h2 className="section-title" id="calculator-tools">🧮 Calculator Tools</h2>
      <div className="grid">
        <Link className="card" href="/percentage-calculator">Percentage Calc</Link>
        <Link className="card" href="/age-calculator">Age Calculator</Link>
        <Link className="card" href="/bmi-calculator">BMI Calculator</Link>
        <Link className="card" href="/loan-emi-calculator">Loan EMI</Link>
        <Link className="card" href="/discount-calculator">Discount Calc</Link>
        <Link className="card" href="/date-difference-calculator">Date Difference</Link>
      </div>

      <h2 className="section-title" id="text-tools">📝 Text Tools</h2>
      <div className="grid">
        <Link className="card tts-new" href="/text-to-speech">🌍 Text to Speech NEW - 40+ Lang</Link>
        <Link className="card" href="/word-counter">Word Counter</Link>
        <Link className="card" href="/character-counter">Char Counter</Link>
        <Link className="card" href="/ai-text-humanizer">AI Humanizer</Link>
        <Link className="card" href="/password-generator">Password Gen</Link>
        <Link className="card" href="/unit-converter">Unit Converter</Link>
        <Link className="card" href="/background-remover/english">BG Remover English</Link>
        <Link className="card" href="/background-remover/spanish">BG Remover Spanish</Link>
      </div>

      <h2 className="section-title" id="other-tools">⚡ Other Tools</h2>
      <div className="grid">
        <Link className="card pro" href="/internet-speed-test">⚡ Internet Speed Test PRO</Link>
        <Link className="card new" href="/love-calculator">❤️ Love Calculator NEW</Link>
        <Link className="card" href="/resume-builder">Resume Builder</Link>
        <Link className="card" href="/instagram-reel-downloader">Insta Downloader</Link>
        <Link className="card" href="/yt-thumbnail-downloader">YT Thumbnail</Link>
        <Link className="card" href="/handwriting-to-text/english">Handwriting English</Link>
        <Link className="card" href="/handwriting-to-text/spanish">Handwriting Spanish</Link>
      </div>
    </>
  );
}
