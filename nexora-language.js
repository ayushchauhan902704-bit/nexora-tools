"use strict";

/* NEXORA AUTOMATIC LANGUAGE ENGINE */

(() => {
  const TRANSLATIONS = {
    en: {},

    hi: {
      "Home": "होम",
      "All Tools": "सभी टूल्स",
      "Guides": "गाइड",
      "About": "हमारे बारे में",
      "Contact": "संपर्क करें",
      "Privacy": "गोपनीयता",
      "Explore Tools": "टूल्स देखें",
      "Explore Tools →": "टूल्स देखें →",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS": "रोज़मर्रा के कामों के लिए मुफ्त ऑनलाइन टूल्स",
      "Get More Done with": "अपने काम आसानी से पूरे करें",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.": "इमेज, PDF, वीडियो, टेक्स्ट और रोज़मर्रा के कामों के लिए आसान ऑनलाइन टूल्स। फाइलें कंप्रेस करें, दस्तावेज़ बदलें, फोटो बनाएं और गणनाएं आसानी से करें।",
      "Free to use": "मुफ्त इस्तेमाल",
      "Easy to use": "आसान इस्तेमाल",
      "No watermark on supported tools": "सपोर्टेड टूल्स पर वॉटरमार्क नहीं",
      "Mobile friendly": "मोबाइल के लिए अनुकूल",
      "Search tools... e.g. image compressor, PDF to Word": "टूल खोजें... जैसे इमेज कंप्रेसर, PDF से Word",
      "Search online tools": "ऑनलाइन टूल खोजें",
      "Clear search": "खोज साफ़ करें",
      "Filter tools by category": "कैटेगरी के अनुसार टूल छांटें",
      "Find the right tool quickly by name or task.": "नाम या काम के अनुसार सही टूल जल्दी खोजें।",
      "Online Tools": "ऑनलाइन टूल्स",
      "Free Access": "मुफ्त सुविधा",
      "Online Access": "ऑनलाइन उपलब्ध",
      "Easy": "आसान",
      "To Use": "इस्तेमाल करना",
      "Explore All Online Tools": "सभी ऑनलाइन टूल्स देखें",
      "Choose a tool and complete your task in a few simple steps.": "एक टूल चुनें और कुछ आसान चरणों में अपना काम पूरा करें।",
      "Showing 30 tools": "30 टूल दिखाए जा रहे हैं",
      "Image": "इमेज",
      "PDF": "PDF",
      "Calculators": "कैलकुलेटर",
      "Text & Utilities": "टेक्स्ट और अन्य सुविधाएं",
      "Open Tool →": "टूल खोलें →",
      "No tools found": "कोई टूल नहीं मिला",
      "Try another search term or select a different category.": "दूसरा शब्द खोजें या कोई दूसरी कैटेगरी चुनें।",
      "Image Compression Guides": "इमेज कंप्रेशन गाइड",
      "Learn how to prepare images for different file-size requirements using simple step-by-step guides.": "आसान चरणों वाली गाइड से अलग-अलग फाइल साइज के लिए इमेज तैयार करना सीखें।",
      "Photo to 20KB - UPSC Guide": "फोटो 20KB करें - UPSC गाइड",
      "Compress Image to 30KB": "इमेज 30KB करें",
      "Compress Image to 50KB": "इमेज 50KB करें",
      "Compress Image to 100KB": "इमेज 100KB करें",
      "Compress Image to 200KB": "इमेज 200KB करें",
      "Compress Image to 500KB": "इमेज 500KB करें",
      "Free Online Tools for Everyday Tasks": "रोज़मर्रा के कामों के लिए मुफ्त ऑनलाइन टूल्स",
      "Free Online Tools": "मुफ्त ऑनलाइन टूल्स",
      "Simple Interface": "आसान इंटरफेस",
      "Image & PDF Utilities": "इमेज और PDF सुविधाएं",
      "Everyday Calculators": "रोज़मर्रा के कैलकुलेटर",
      "Popular Tools": "लोकप्रिय टूल्स",
      "PDF & Document Tools": "PDF और दस्तावेज़ टूल्स",
      "Information": "जानकारी",
      "Guides & Articles": "गाइड और लेख",
      "About Us": "हमारे बारे में",
      "Privacy Policy": "गोपनीयता नीति",
      "Terms & Conditions": "नियम और शर्तें",
      "Disclaimer": "अस्वीकरण",
      "XML Sitemap": "XML साइटमैप",
      "Image DPI Changer - 72 to 300 DPI": "इमेज DPI बदलें - 72 से 300 DPI",
      "Change image DPI from 72 to 300 DPI for printing without losing quality.": "क्वालिटी खोए बिना प्रिंटिंग के लिए इमेज DPI को 72 से 300 तक बदलें।",
      "Internet Speed Test - Pro": "इंटरनेट स्पीड टेस्ट - प्रो",
      "Check your internet download speed, upload speed and ping.": "अपने इंटरनेट की डाउनलोड स्पीड, अपलोड स्पीड और पिंग जांचें।",
      "Image to Text - OCR": "इमेज से टेक्स्ट - OCR",
      "Extract readable text from supported JPG and PNG images.": "सपोर्टेड JPG और PNG इमेज से टेक्स्ट निकालें।",
      "Video Compressor to Any MB": "किसी भी MB में वीडियो कंप्रेसर",
      "Compress videos with custom target file-size options.": "अपनी पसंद के फाइल साइज में वीडियो कंप्रेस करें।",
      "Text to Speech": "टेक्स्ट से आवाज़",
      "Convert written text into speech using supported browser voices.": "लिखे हुए टेक्स्ट को आवाज़ में बदलें।",
      "YouTube Thumbnail Downloader": "YouTube थंबनेल डाउनलोडर",
      "Get available YouTube video thumbnail images.": "YouTube वीडियो के उपलब्ध थंबनेल प्राप्त करें।",
      "Love Calculator": "लव कैलकुलेटर",
      "Try a fun name-based compatibility calculation.": "नाम के आधार पर मजेदार अनुकूलता जांचें।",
      "Passport Photo Maker": "पासपोर्ट फोटो मेकर",
      "Prepare passport and document photos in supported sizes.": "सपोर्टेड साइज में पासपोर्ट और दस्तावेज़ फोटो तैयार करें।",
      "Background Remover": "बैकग्राउंड हटाएं",
      "Remove or change image backgrounds with available options.": "इमेज का बैकग्राउंड हटाएं या बदलें।",
      "Compress Image to Any KB": "इमेज को किसी भी KB में कंप्रेस करें",
      "Reduce image file size for different upload requirements.": "अलग-अलग अपलोड जरूरतों के लिए इमेज का साइज कम करें।",
      "JPG to PDF Converter": "JPG से PDF कन्वर्टर",
      "Combine supported image files into a PDF document.": "इमेज फाइलों को एक PDF दस्तावेज़ में जोड़ें।",
      "PDF to JPG Converter": "PDF से JPG कन्वर्टर",
      "Convert PDF pages into downloadable JPG images.": "PDF पेज को डाउनलोड करने योग्य JPG इमेज में बदलें।",
      "Instagram Reels Downloader": "Instagram Reels डाउनलोडर",
      "Access available Instagram Reels download functionality.": "Instagram Reels डाउनलोड करने की सुविधा इस्तेमाल करें।",
      "QR Code Generator": "QR कोड जनरेटर",
      "Create QR codes for supported links, text and Wi-Fi details.": "लिंक, टेक्स्ट और Wi-Fi जानकारी के लिए QR कोड बनाएं।",
      "PDF to Word": "PDF से Word",
      "Convert supported PDF documents into editable Word files.": "PDF दस्तावेज़ों को एडिट करने योग्य Word फाइल में बदलें।",
      "Word to PDF": "Word से PDF",
      "Convert supported Word documents into PDF format.": "Word दस्तावेज़ों को PDF में बदलें।",
      "PDF Merge & Split": "PDF जोड़ें और अलग करें",
      "Combine PDF documents or split them into separate pages.": "PDF दस्तावेज़ जोड़ें या अलग-अलग पेज में बांटें।",
      "Image to Word - OCR": "इमेज से Word - OCR",
      "Extract text from supported images and scanned documents.": "इमेज और स्कैन किए गए दस्तावेज़ों से टेक्स्ट निकालें।",
      "BMI Calculator": "BMI कैलकुलेटर",
      "Calculate body mass index using height and weight.": "लंबाई और वजन से बॉडी मास इंडेक्स निकालें।",
      "Age Calculator": "उम्र कैलकुलेटर",
      "Calculate age in years, months and days from date of birth.": "जन्मतिथि से साल, महीने और दिन में उम्र निकालें।",
      "Loan EMI Calculator": "लोन EMI कैलकुलेटर",
      "Estimate monthly loan payments, interest and total repayment.": "मासिक लोन किस्त, ब्याज और कुल भुगतान का अनुमान लगाएं।",
      "Percentage Calculator": "प्रतिशत कैलकुलेटर",
      "Calculate percentages, percentage changes and values.": "प्रतिशत, प्रतिशत बदलाव और मान निकालें।",
      "Discount Calculator": "डिस्काउंट कैलकुलेटर",
      "Calculate discounted prices and total savings.": "छूट के बाद कीमत और कुल बचत निकालें।",
      "Date Difference Calculator": "तारीख अंतर कैलकुलेटर",
      "Find the number of days between two selected dates.": "दो तारीखों के बीच दिनों की संख्या निकालें।",
      "Word Counter": "शब्द गिनें",
      "Count words, characters, sentences and text length.": "शब्द, अक्षर, वाक्य और टेक्स्ट की लंबाई गिनें।",
      "Character Counter": "अक्षर गिनें",
      "Count characters with and without spaces.": "स्पेस के साथ और बिना अक्षरों की गिनती करें।",
      "AI Text Humanizer": "AI टेक्स्ट ह्यूमनाइज़र",
      "Rewrite text to create a more natural writing style.": "टेक्स्ट को अधिक स्वाभाविक अंदाज में दोबारा लिखें।",
      "Unit Converter": "यूनिट कन्वर्टर",
      "Convert length, weight, temperature and other common units.": "लंबाई, वजन, तापमान और अन्य यूनिट बदलें।",
      "Password Generator": "पासवर्ड जनरेटर",
      "Generate random passwords with customizable options.": "अपनी पसंद के विकल्पों के साथ मजबूत पासवर्ड बनाएं।",
      "Resume Builder": "रिज्यूमे बिल्डर",
      "Create a professional resume and download your document.": "प्रोफेशनल रिज्यूमे बनाएं और डाउनलोड करें।",
      "Contact:": "संपर्क:",
      "A collection of free online tools for images, PDFs, videos, text and everyday tasks. Explore simple utilities designed to make common digital work easier.": "इमेज, PDF, वीडियो, टेक्स्ट और रोज़मर्रा के कामों के लिए मुफ्त ऑनलाइन टूल्स का संग्रह। आम डिजिटल कामों को आसान बनाने वाली सुविधाएं देखें।",
      "NEXORA brings together useful online tools for working with images, PDF documents, videos, text and everyday calculations. Whether you need to compress a photo, convert a document, extract text from an image, prepare a passport photo or calculate a value, you can explore the available tools in one place.": "NEXORA इमेज, PDF दस्तावेज़, वीडियो, टेक्स्ट और रोज़मर्रा की गणनाओं के लिए उपयोगी ऑनलाइन टूल्स एक जगह उपलब्ध कराता है। फोटो कंप्रेस करने, दस्तावेज़ बदलने, इमेज से टेक्स्ट निकालने या पासपोर्ट फोटो बनाने के लिए टूल्स देखें।",
      "Each tool has its own features and supported formats. Processing methods, file limits and browser requirements may vary depending on the tool. Check the instructions on each tool page before using it.": "हर टूल की अपनी सुविधाएं और सपोर्टेड फॉर्मेट हैं। प्रोसेसिंग का तरीका, फाइल लिमिट और ब्राउज़र की जरूरत अलग हो सकती है। इस्तेमाल से पहले टूल पेज के निर्देश पढ़ें।",
      "No Watermark": "वॉटरमार्क नहीं",
      "Easy to Use": "इस्तेमाल में आसान",
      "Text Extraction": "टेक्स्ट निकालना",
      "Audio Support": "ऑडियो सपोर्ट",
      "Multiple Languages": "कई भाषाएं",
      "Thumbnails": "थंबनेल",
      "HD Options": "HD विकल्प",
      "Photo Sizes": "फोटो साइज",
      "Custom Options": "कस्टम विकल्प",
      "Background Editing": "बैकग्राउंड एडिटिंग",
      "Image Tool": "इमेज टूल",
      "Target KB": "लक्षित KB",
      "Image Compression": "इमेज कंप्रेशन",
      "Multiple Images": "कई इमेज",
      "PDF Export": "PDF एक्सपोर्ट",
      "PDF Conversion": "PDF कन्वर्जन",
      "Image Export": "इमेज एक्सपोर्ट",
      "QR Generator": "QR जनरेटर",
      "Download": "डाउनलोड",
      "DOCX": "DOCX",
      "Merge PDF": "PDF जोड़ें",
      "Split PDF": "PDF अलग करें",
      "Word Export": "Word एक्सपोर्ट",
      "Health": "स्वास्थ्य",
      "Calculator": "कैलकुलेटर",
      "DOB": "जन्मतिथि",
      "Finance": "वित्त",
      "EMI": "EMI",
      "Percentage": "प्रतिशत",
      "Discount": "छूट",
      "Savings": "बचत",
      "Dates": "तारीखें",
      "Duration": "अवधि",
      "Word Count": "शब्द गिनती",
      "Instant": "तुरंत",
      "Character Count": "अक्षर गिनती",
      "Text": "टेक्स्ट",
      "AI Writing": "AI लेखन",
      "Security": "सुरक्षा",
      "Generator": "जनरेटर",
      "PDF Download": "PDF डाउनलोड",
      "RESUME": "रिज्यूमे",
      "NEW": "नया",
      "PRO": "प्रो",
      "VIDEO": "वीडियो",
      "40+ LANGUAGES": "40+ भाषाएं",
      "HD": "HD",
      "FUN": "मनोरंजन",
      "PHOTO": "फोटो",
      "AI": "AI",
      "POPULAR": "लोकप्रिय",
      "MEDIA": "मीडिया",
      "QR": "QR",
      "DOCUMENT": "दस्तावेज़",
      "OCR": "OCR",
      "INSTANT": "तुरंत",
      "TEXT": "टेक्स्ट"
    }
  };

  function detectLanguage() {
    const languages = navigator.languages || [
      navigator.language || "en"
    ];

    for (const lang of languages) {
      const code = lang.toLowerCase();

      if (code === "hi" || code.startsWith("hi-")) {
        return "hi";
      }
    }

    return "en";
  }

  function translatePage(language) {
    const dictionary = TRANSLATIONS[language] || {};
    document.documentElement.lang = language;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    let node;

    while ((node = walker.nextNode())) {
      const parent = node.parentElement;

      if (!parent) continue;

      if (
        parent.closest(
          "script, style, noscript, textarea, input, select"
        )
      ) continue;

      if (!node.__nexoraOriginal) {
        Object.defineProperty(node, "__nexoraOriginal", {
          value: node.nodeValue,
          writable: true
        });
      }

      const original = node.__nexoraOriginal;
      const key = original.trim();

      if (!key) continue;

      if (language === "en") {
        node.nodeValue = original;
      } else if (dictionary[key]) {
        const leading = original.match(/^\s*/)?.[0] || "";
        const trailing = original.match(/\s*$/)?.[0] || "";

        node.nodeValue = leading + dictionary[key] + trailing;
      }
    }

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      const key = element.getAttribute("data-i18n-placeholder");

      if (!element.dataset.nexoraOriginalPlaceholder) {
        element.dataset.nexoraOriginalPlaceholder =
          element.getAttribute("placeholder") || "";
      }

      element.setAttribute(
        "placeholder",
        language === "hi"
          ? (dictionary[key] || element.dataset.nexoraOriginalPlaceholder)
          : element.dataset.nexoraOriginalPlaceholder
      );
    });

    document.querySelectorAll("[aria-label]").forEach(element => {
      const original = element.getAttribute("aria-label");

      const labels = {
        "Search online tools": "ऑनलाइन टूल खोजें",
        "Clear search": "खोज साफ़ करें",
        "Filter tools by category": "कैटेगरी के अनुसार टूल छांटें"
      };

      if (!element.dataset.nexoraOriginalAria) {
        element.dataset.nexoraOriginalAria = original;
      }

      element.setAttribute(
        "aria-label",
        language === "hi"
          ? (labels[element.dataset.nexoraOriginalAria] ||
             element.dataset.nexoraOriginalAria)
          : element.dataset.nexoraOriginalAria
      );
    });

    updateResultCount(language);
  }

  function updateResultCount(language) {
    const element = document.getElementById("resultCount");

    if (!element) return;

    const match = element.textContent.match(
      /(?:Showing\s+)?(\d+)\s+(?:tools?|टूल)/
    );

    if (!match) return;

    const count = Number(match[1]);

    const text = language === "hi"
      ? (count === 1
          ? "1 टूल दिखाया जा रहा है"
          : count + " टूल दिखाए जा रहे हैं")
      : "Showing " + count + (count === 1 ? " tool" : " tools");

    if (element.textContent !== text) {
      element.textContent = text;
    }
  }

  function start() {
    const language = detectLanguage();

    translatePage(language);

    const resultCount = document.getElementById("resultCount");

    if (resultCount) {
      new MutationObserver(() => {
        updateResultCount(language);
      }).observe(resultCount, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  window.NEXORA_LANGUAGE = {
    detect: detectLanguage,
    translate: translatePage
  };
})();
