
"use client";

import { useMemo, useState } from "react";

type Tool = {
  name: string;
  description: string;
  category: string;
  icon: string;
  href: string;
  tags: string[];
};

const tools: Tool[] = [
  { name: "Internet Speed Test", description: "Measure download speed, upload speed and ping.", category: "Text", icon: "⚡", href: "/internet-speed-test", tags: ["Speed", "Network"] },
  { name: "Image to Text — OCR", description: "Extract readable text from JPG and PNG images.", category: "Image", icon: "🔤", href: "/image-to-text", tags: ["OCR", "Extract text"] },
  { name: "Video Compressor", description: "Reduce video file size with flexible MB targets.", category: "Video", icon: "🎬", href: "/video-compressor", tags: ["Video", "Compression"] },
  { name: "Text to Speech", description: "Turn written text into spoken audio in supported languages.", category: "Text", icon: "🌍", href: "/text-to-speech", tags: ["Audio", "Languages"] },
  { name: "YouTube Thumbnail Downloader", description: "Get available YouTube thumbnails in high resolution.", category: "Image", icon: "🖼️", href: "/yt-thumbnail-downloader.html", tags: ["YouTube", "HD"] },
  { name: "Love Calculator", description: "A light-hearted name compatibility calculator.", category: "Calculator", icon: "❤️", href: "/love-calculator", tags: ["Fun", "Names"] },
  { name: "Passport Photo Maker", description: "Prepare passport, visa and document photos in common sizes.", category: "Image", icon: "📸", href: "/passport-size-photo", tags: ["Passport", "Photo size"] },
  { name: "Background Remover", description: "Remove image backgrounds and create transparent images.", category: "Image", icon: "✂️", href: "/background-remover", tags: ["Background", "Transparent"] },
  { name: "Image Compressor", description: "Compress JPG, PNG and WebP images to smaller file sizes.", category: "Image", icon: "🗜️", href: "/compress-image", tags: ["20KB", "50KB"] },
  { name: "JPG to PDF", description: "Combine multiple images into a single PDF document.", category: "PDF", icon: "📷", href: "/jpg-to-pdf", tags: ["Convert", "PDF"] },
  { name: "PDF to JPG", description: "Convert PDF pages into JPG images.", category: "PDF", icon: "🖼️", href: "/pdf-to-jpg", tags: ["Convert", "Images"] },
  { name: "Instagram Reels Downloader", description: "Download available Instagram Reels using the supported workflow.", category: "Video", icon: "🎞️", href: "/instagram-reels-downloader", tags: ["Instagram", "Reels"] },
  { name: "QR Code Generator", description: "Create QR codes for links, text and Wi-Fi details.", category: "Image", icon: "▦", href: "/qr-code-generator", tags: ["QR", "Generator"] },
  { name: "PDF to Word", description: "Convert PDF documents into editable Word files.", category: "PDF", icon: "📄", href: "/pdf-to-word", tags: ["DOCX", "Editable"] },
  { name: "Word to PDF", description: "Convert DOC and DOCX documents into PDF files.", category: "PDF", icon: "📝", href: "/word-to-pdf", tags: ["DOCX", "Convert"] },
  { name: "PDF Merge & Split", description: "Combine PDF files or split a document into separate pages.", category: "PDF", icon: "📚", href: "/pdf-merge-split", tags: ["Merge", "Split"] },
  { name: "Image to Word — OCR", description: "Extract text from scanned documents and images.", category: "PDF", icon: "🔎", href: "/image-to-word", tags: ["OCR", "Word"] },
  { name: "BMI Calculator", description: "Calculate body mass index using height and weight.", category: "Calculator", icon: "⚖️", href: "/bmi-calculator", tags: ["Health", "BMI"] },
  { name: "Age Calculator", description: "Calculate your age in years, months and days.", category: "Calculator", icon: "📅", href: "/age-calculator", tags: ["Birth date", "Age"] },
  { name: "Loan EMI Calculator", description: "Estimate monthly payments, interest and total repayment.", category: "Calculator", icon: "🏦", href: "/loan-emi-calculator", tags: ["Loan", "EMI"] },
  { name: "Percentage Calculator", description: "Calculate percentages and percentage changes quickly.", category: "Calculator", icon: "%", href: "/percentage-calculator", tags: ["Percent", "Math"] },
  { name: "Discount Calculator", description: "Find the sale price and savings after a discount.", category: "Calculator", icon: "🏷️", href: "/discount-calculator", tags: ["Sale", "Savings"] },
  { name: "Date Difference Calculator", description: "Find the number of days between two dates.", category: "Calculator", icon: "⏱️", href: "/date-difference", tags: ["Date", "Days"] },
  { name: "Word Counter", description: "Count words, characters and sentences in your text.", category: "Text", icon: "🔠", href: "/word-counter", tags: ["Words", "Characters"] },
  { name: "Character Counter", description: "Count characters with and without spaces.", category: "Text", icon: "🔡", href: "/character-counter", tags: ["Characters", "Social"] },
  { name: "AI Text Humanizer", description: "Rewrite text with a more natural writing style.", category: "Text", icon: "✍️", href: "/ai-text-humanizer", tags: ["Writing", "AI"] },
  { name: "Unit Converter", description: "Convert length, weight, temperature and other units.", category: "Calculator", icon: "🌡️", href: "/unit-converter", tags: ["Units", "Conversion"] },
  { name: "Password Generator", description: "Generate strong random passwords with custom options.", category: "Text", icon: "🔐", href: "/password-generator", tags: ["Security", "Password"] },
  { name: "Resume Builder", description: "Create a structured resume and prepare it for PDF export.", category: "Text", icon: "📋", href: "/resume-builder", tags: ["Resume", "CV"] },
];

const categories = ["All tools", "Image", "PDF", "Video", "Calculator", "Text"];

const guides = [
  ["Compress an Image to 20KB", "/blog/how-to-compress-image-to-20kb/"],
  ["Compress an Image to 30KB", "/blog/how-to-compress-image-to-30kb/"],
  ["Compress an Image to 50KB", "/blog/how-to-compress-image-to-50kb/"],
  ["Compress an Image to 100KB", "/blog/how-to-compress-image-to-100kb/"],
  ["Compress an Image to 200KB", "/blog/how-to-compress-image-to-200kb/"],
  ["Compress an Image to 500KB", "/blog/how-to-compress-image-to-500kb/"],
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All tools");

  const filteredTools = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory =
        activeCategory === "All tools" ||
        tool.category === activeCategory;

      const searchable =
        `${tool.name} ${tool.description} ${tool.category} ${tool.tags.join(" ")}`.toLowerCase();

      return matchesCategory && searchable.includes(normalized);
    });
  }, [query, activeCategory]);

  return (
    <main className="nexora">
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />

      <header className="siteHeader">
        <a className="brand" href="/" aria-label="NEXORA home">
          <span className="brandMark">N</span>
          <span>NEXORA<span className="brandDot">.</span></span>
        </a>

        <nav className="navLinks">
          <a className="navActive" href="/">Home</a>
          <a href="#tools">Tools</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>

        <a className="headerCta" href="#tools">
          Explore tools <span>↗</span>
        </a>
      </header>

      <section className="hero">
        <div className="heroEyebrow">
          <span className="liveDot" />
          SIMPLE TOOLS. BETTER WORKFLOWS.
        </div>

        <h1>
          Everything you need.
          <br />
          <span className="gradientText">Nothing you don’t.</span>
        </h1>

        <p className="heroCopy">
          A growing collection of practical online tools for images, PDFs,
          video, text and everyday tasks. Fast to use, easy to understand.
        </p>

        <div className="heroActions">
          <a className="primaryButton" href="#tools">
            Explore all tools <span>↘</span>
          </a>
          <a className="secondaryButton" href="#why-nexora">
            Why NEXORA?
          </a>
        </div>

        <div className="heroVisual">
          <div className="visualGlow" />

          <div className="visualTop">
            <div className="windowDots"><i /><i /><i /></div>
            <span>YOUR EVERYDAY TOOLKIT</span>
            <span className="visualStatus"><b /> READY TO USE</span>
          </div>

          <div className="visualMain">
            <div className="visualCopy">
              <span className="miniLabel">NEXORA WORKSPACE</span>
              <strong>
                Make everyday
                <br />
                <em>tasks feel effortless.</em>
              </strong>
              <p>Useful tools. Clear results. Less friction.</p>
            </div>

            <div className="floatingTiles">
              <div className="floatTile tileA">
                <span>🖼️</span><b>Image tools</b><small>Compress · Convert</small>
              </div>
              <div className="floatTile tileB">
                <span>📄</span><b>PDF tools</b><small>Merge · Export</small>
              </div>
              <div className="floatTile tileC">
                <span>⚡</span><b>Quick utilities</b><small>Calculate · Create</small>
              </div>
            </div>
          </div>

          <div className="visualBottom">
            <span>✦ Built for everyday productivity</span>
            <span>29 TOOLS IN THIS COLLECTION</span>
          </div>
        </div>

        <div className="heroMetrics">
          <div><strong>29</strong><span>Available tools</span></div>
          <div><strong>06</strong><span>Tool categories</span></div>
          <div><strong>01</strong><span>Simple destination</span></div>
        </div>
      </section>

      <section className="toolsSection" id="tools">
        <div className="sectionHeading">
          <div>
            <span className="sectionKicker">THE TOOLBOX</span>
            <h2>
              Find the right tool.
              <br />
              <span className="mutedHeading">Get straight to work.</span>
            </h2>
          </div>
          <p>Browse the collection or search for exactly what you need.</p>
        </div>

        <div className="toolControls">
          <label className="searchBox">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools, tasks or keywords..."
              aria-label="Search tools"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <div className="categoryList">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={
                  activeCategory === category
                    ? "categoryPill selected"
                    : "categoryPill"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="resultsLine">
          <span>{filteredTools.length} tools</span>
          <span>Choose a tool to get started <b>↗</b></span>
        </div>

        {filteredTools.length > 0 ? (
          <div className="toolGrid">
            {filteredTools.map((tool, index) => (
              <a
                className="toolCard"
                href={tool.href}
                key={tool.href}
                style={{ "--card-index": index } as React.CSSProperties}
              >
                <div className="cardTop">
                  <div className="toolIcon">{tool.icon}</div>
                  <span className="cardArrow">↗</span>
                </div>

                <div className="cardCategory">{tool.category}</div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>

                <div className="cardBottom">
                  <div className="tagList">
                    {tool.tags.slice(0, 2).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <span className="openLabel">Open tool <b>→</b></span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="emptyState">
            <span>⌕</span>
            <h3>No matching tools found</h3>
            <p>Try another keyword or choose a different category.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All tools");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section className="guidesSection">
        <div className="guidesIntro">
          <span className="sectionKicker">HELPFUL RESOURCES</span>
          <h2>Need a specific image size?</h2>
          <p>Explore practical guides for common image compression requirements.</p>
        </div>

        <div className="guideGrid">
          {guides.map(([label, href], index) => (
            <a href={href} className="guideCard" key={href}>
              <span className="guideNumber">0{index + 1}</span>
              <span>{label}</span>
              <b>↗</b>
            </a>
          ))}
        </div>
      </section>

      <section className="whySection" id="why-nexora">
        <div className="whyOrb" />

        <div className="whyContent">
          <span className="sectionKicker lightKicker">THE NEXORA APPROACH</span>
          <h2>
            Less complexity.
            <br />
            <span>More getting things done.</span>
          </h2>
          <p>
            NEXORA brings useful utilities together in one place, with focused
            interfaces that help you complete everyday tasks without unnecessary steps.
          </p>
        </div>

        <div className="whyPoints">
          <div>
            <span>01</span>
            <section>
              <b>Easy to navigate</b>
              <p>Clear categories and a simple search make tools easy to find.</p>
            </section>
          </div>
          <div>
            <span>02</span>
            <section>
              <b>Focused experiences</b>
              <p>Each tool is designed around a specific task and workflow.</p>
            </section>
          </div>
          <div>
            <span>03</span>
            <section>
              <b>Made for everyone</b>
              <p>Use the collection across modern phones, tablets and desktops.</p>
            </section>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footerMain">
          <div className="footerBrand">
            <a className="brand footerLogo" href="/">
              <span className="brandMark">N</span>
              <span>NEXORA<span className="brandDot">.</span></span>
            </a>
            <p>Practical online tools for everyday tasks.</p>
            <a className="emailLink" href="mailto:ayushchauhan902704@gmail.com">
              ayushchauhan902704@gmail.com
            </a>
          </div>

          <div>
            <h4>Explore</h4>
            <a href="#tools">All tools</a>
            <a href="/image-to-text">Image to Text</a>
            <a href="/video-compressor">Video Compressor</a>
            <a href="/compress-image">Image Compressor</a>
          </div>

          <div>
            <h4>PDF tools</h4>
            <a href="/jpg-to-pdf">JPG to PDF</a>
            <a href="/pdf-to-jpg">PDF to JPG</a>
            <a href="/pdf-to-word">PDF to Word</a>
            <a href="/pdf-merge-split">Merge & Split PDF</a>
          </div>

          <div>
            <h4>Information</h4>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms</a>
            <a href="/disclaimer">Disclaimer</a>
            <a href="/sitemap.xml">Sitemap</a>
          </div>
        </div>

        <div className="footerBottom">
          <span>© {new Date().getFullYear()} NEXORA Tools. All rights reserved.</span>
          <span>Designed for a clearer digital workflow.</span>
        </div>
      </footer>
    </main>
  );
}
