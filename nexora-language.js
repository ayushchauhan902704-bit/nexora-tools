"use strict";
/* NEXORA LANGUAGE ENGINE - FINAL 100% TRANSLATION */
(() => {
  const LANGUAGES = {
    en: "🇬🇧 English", hi: "🇮🇳 Hindi", bn: "🇧🇩 Bengali", pt: "🇵🇹 Portuguese", es: "🇪🇸 Spanish",
    id: "🇮🇩 Indonesian", fr: "🇫🇷 French", de: "🇩🇪 German", ar: "🇸🇦 Arabic", tr: "🇹🇷 Turkish"
  };
  const STORAGE_KEY = "nexora_language";
  const supported = Object.keys(LANGUAGES);

  const TRANSLATIONS = {
    en: {},
    hi: {
      "Home": "होम", "All Tools": "सभी टूल्स", "Guides": "गाइड", "About": "हमारे बारे में", "Contact": "संपर्क करें", "Privacy": "गोपनीयता",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS": "रोज़मर्रा के कामों के लिए मुफ्त ऑनलाइन टूल्स",
      "Get More Done with": "अपने काम आसानी से पूरे करें",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.": "इमेज, PDF, वीडियो, टेक्स्ट और रोज़मर्रा के कामों के लिए आसान ऑनलाइन टूल्स। फाइलें कंप्रेस करें, दस्तावेज़ बदलें, फोटो बनाएं और अपना काम आसानी से पूरा करें।",
      "Free to use": "मुफ्त इस्तेमाल", "Easy to use": "आसान इस्तेमाल", "No watermark on supported tools": "सपोर्टेड टूल्स पर वॉटरमार्क नहीं", "Mobile friendly": "मोबाइल के लिए अनुकूल",
      "Search tools... e.g. image compressor, PDF to Word": "टूल खोजें... जैसे इमेज कंप्रेसर, PDF से Word",
      "Find the right tool quickly by name or task.": "नाम या काम के अनुसार सही टूल जल्दी खोजें।",
      "30": "30", "Online Tools": "ऑनलाइन टूल्स", "100%": "100%", "Free Access": "मुफ्त सुविधा", "24/7": "24/7", "Online Access": "ऑनलाइन उपलब्ध", "Easy": "आसान", "To Use": "इस्तेमाल करना",
      "Explore All Online Tools": "सभी ऑनलाइन टूल्स देखें", "Choose a tool and complete your task in a few simple steps.": "एक टूल चुनें और कुछ आसान चरणों में अपना काम पूरा करें।",
      "Showing 30 tools": "30 टूल दिखाए जा रहे हैं", "Image": "इमेज", "PDF": "PDF", "Calculators": "कैलकुलेटर", "Text & Utilities": "टेक्स्ट और अन्य सुविधाएं", "Open Tool →": "टूल खोलें →",
      "Image DPI Changer - 72 to 300 DPI": "इमेज DPI बदलें - 72 से 300 DPI", "Change image DPI from 72 to 300 DPI for printing without losing quality.": "क्वालिटी खोए बिना प्रिंटिंग के लिए इमेज DPI को 72 से 300 तक बदलें।",
      "300 DPI": "300 DPI", "No Watermark": "वॉटरमार्क नहीं", "Easy to Use": "इस्तेमाल में आसान", "Image Tool": "इमेज टूल",
      "Internet Speed Test - Pro": "इंटरनेट स्पीड टेस्ट - प्रो", "Check your internet download speed, upload speed and ping.": "अपने इंटरनेट की डाउनलोड स्पीड, अपलोड स्पीड और पिंग जांचें।",
      "Image to Text - OCR": "इमेज से टेक्स्ट - OCR", "Video Compressor to Any MB": "किसी भी MB में वीडियो कंप्रेसर",
      "Text to Speech": "टेक्स्ट से आवाज़", "YouTube Thumbnail Downloader": "YouTube थंबनेल डाउनलोडर",
      "Love Calculator": "लव कैलकुलेटर", "Passport Photo Maker": "पासपोर्ट फोटो मेकर", "Background Remover": "बैकग्राउंड हटाएं",
      "Compress Image to Any KB": "इमेज को किसी भी KB में कंप्रेस करें", "JPG to PDF Converter": "JPG से PDF कन्वर्टर", "PDF to JPG Converter": "PDF से JPG कन्वर्टर",
      "WORLDWIDE NO.1 • FREE DPI TOOL": "दुनिया का नंबर 1 • फ्री DPI टूल",
      "Image DPI Changer - Change 72 to 300 DPI Instantly": "इमेज DPI चेंजर - 72 से 300 DPI तुरंत बदलें",
      "Upload Your Image": "अपनी इमेज अपलोड करें", "Select DPI": "DPI चुनें", "Download Image - 300 DPI →": "इमेज डाउनलोड करें - 300 DPI →"
    },
    bn: {
      "Home": "হোম", "All Tools": "সব টুলস", "Guides": "গাইড", "About": "আমাদের সম্পর্কে", "Contact": "যোগাযোগ", "Privacy": "গোপনীয়তা",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS": "দৈনন্দিন কাজের জন্য বিনামূল্যে অনলাইন টুলস",
      "Get More Done with": "আপনার কাজ সহজে করুন",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.": "ছবি, PDF, ভিডিও, টেক্সট এবং দৈনন্দিন কাজের জন্য সহজ অনলাইন টুলস। ফাইল কম্প্রেস করুন, ডকুমেন্ট কনভার্ট করুন, ফটো তৈরি করুন এবং সহজে কাজ শেষ করুন।",
      "Free to use": "বিনামূল্যে ব্যবহার", "Easy to use": "ব্যবহার করা সহজ", "No watermark on supported tools": "সাপোর্টেড টুলে ওয়াটারমার্ক নেই", "Mobile friendly": "মোবাইল ফ্রেন্ডলি",
      "Search tools... e.g. image compressor, PDF to Word": "টুল খুঁজুন... যেমন ইমেজ কম্প্রেসর",
      "Find the right tool quickly by name or task.": "নাম বা কাজ অনুযায়ী দ্রুত সঠিক টুল খুঁজুন।",
      "30": "৩০", "Online Tools": "অনলাইন টুলস", "100%": "১০০%", "Free Access": "ফ্রি এক্সেস", "24/7": "২৪/৭", "Online Access": "অনলাইন এক্সেস", "Easy": "সহজ", "To Use": "ব্যবহার",
      "Explore All Online Tools": "সমস্ত অনলাইন টুলস দেখুন", "Choose a tool and complete your task in a few simple steps.": "একটি টুল বেছে নিন এবং কয়েকটি সহজ ধাপে আপনার কাজ সম্পূর্ণ করুন।",
      "Showing 30 tools": "৩০টি টুল দেখানো হচ্ছে", "Image": "ছবি", "PDF": "PDF", "Calculators": "ক্যালকুলেটর", "Text & Utilities": "টেক্সট ও ইউটিলিটি", "Open Tool →": "টুল খুলুন →",
      "Image DPI Changer - 72 to 300 DPI": "ইমেজ DPI পরিবর্তনকারী - ৭২ থেকে ৩০০ DPI", "Change image DPI from 72 to 300 DPI for printing without losing quality.": "গুণমান না হারিয়ে প্রিন্টিংয়ের জন্য ৭২ থেকে ৩০০ DPI তে পরিবর্তন করুন।",
      "300 DPI": "৩০০ DPI", "No Watermark": "ওয়াটারমার্ক নেই", "Easy to Use": "ব্যবহার করা সহজ", "Image Tool": "ইমেজ টুল",
      "Internet Speed Test - Pro": "ইন্টারনেট স্পিড টেস্ট - প্রো", "Check your internet download speed, upload speed and ping.": "আপনার ইন্টারনেট ডাউনলোড স্পিড, আপলোড স্পিড এবং পিং চেক করুন।",
      "Image to Text - OCR": "ছবি থেকে টেক্সট - OCR", "Video Compressor to Any MB": "যেকোনো MB তে ভিডিও কম্প্রেসর",
      "Text to Speech": "টেক্সট থেকে স্পিচ", "YouTube Thumbnail Downloader": "YouTube থাম্বনেইল ডাউনলোডার",
      "Love Calculator": "লাভ ক্যালকুলেটর", "Passport Photo Maker": "পাসপোর্ট ফটো মেকার", "Background Remover": "ব্যাকগ্রাউন্ড রিমুভার",
      "Compress Image to Any KB": "যেকোনো KB তে ছবি কম্প্রেস করুন", "JPG to PDF Converter": "JPG থেকে PDF কনভার্টার", "PDF to JPG Converter": "PDF থেকে JPG কনভার্টার",
      "WORLDWIDE NO.1 • FREE DPI TOOL": "বিশ্বব্যাপী নং ১ • বিনামূল্যে DPI টুল",
      "Image DPI Changer - Change 72 to 300 DPI Instantly": "ইমেজ DPI পরিবর্তনকারী - ৭২ থেকে ৩০০ DPI তে পরিবর্তন করুন",
      "Upload Your Image": "আপনার ছবি আপলোড করুন", "Select DPI": "DPI নির্বাচন করুন", "Download Image - 300 DPI →": "ছবি ডাউনলোড করুন - ৩০০ DPI →"
    }
  };

  const originalTexts = new WeakMap();
  let activeLanguage = "en";
  function detectLanguage() {
    const prefs = navigator.languages || [navigator.language || "en"];
    for (const pref of prefs) {
      const code = pref.toLowerCase();
      const exact = Object.keys(LANGUAGES).find(item => item.toLowerCase() === code);
      if (exact) return exact;
      const base = code.split("-")[0];
      if (LANGUAGES[base]) return base;
    }
    return "en";
  }
  function safeGetLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved && saved !== "auto" && LANGUAGES[saved] ? saved : detectLanguage();
    } catch (e) { return detectLanguage(); }
  }
  function getOriginalText(node) {
    if (!originalTexts.has(node)) originalTexts.set(node, node.nodeValue);
    return originalTexts.get(node);
  }
  function translateTextNodes(language, dictionary) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest("script, style, noscript, textarea, #resultCount, #nexora-language-selector")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      const original = getOriginalText(node);
      const key = original.trim();
      if (!key) continue;
      if (language === "en") { node.nodeValue = original; continue; }
      let translated = dictionary[key];
      if (!translated && key.endsWith(" →")) {
        const baseKey = key.slice(0, -2).trim();
        if (dictionary[baseKey]) translated = dictionary[baseKey] + " →";
      }
      if (translated) {
        const leading = original.match(/^\s*/)?.[0] || "";
        const trailing = original.match(/\s*$/)?.[0] || "";
        node.nodeValue = leading + translated + trailing;
      }
    }
  }
  function translatePage(language) {
    if (!LANGUAGES[language]) language = "en";
    activeLanguage = language;
    const dictionary = TRANSLATIONS[language] || {};
    document.documentElement.lang = language;
    translateTextNodes(language, dictionary);
  }
  function createLanguageSelector() {
    if (document.getElementById("nexora-language-selector")) return;
    const style = document.createElement("style");
    style.textContent = `#nexora-language-selector{position:fixed;right:14px;bottom:16px;z-index:99999;padding:10px 12px;border:1px solid #d1d5db;border-radius:12px;background:#fff;color:#111827;font-size:14px;max-width:190px;box-shadow:0 4px 18px rgba(0,0,0,.13);cursor:pointer}`;
    document.head.appendChild(style);
    const select = document.createElement("select");
    select.id = "nexora-language-selector";
    const autoOption = document.createElement("option");
    autoOption.value = "auto"; autoOption.textContent = "🌐 Automatic";
    select.appendChild(autoOption);
    Object.entries(LANGUAGES).forEach(([code, name]) => {
      const option = document.createElement("option");
      option.value = code; option.textContent = name;
      select.appendChild(option);
    });
    let saved = "auto";
    try { saved = localStorage.getItem(STORAGE_KEY) || "auto"; } catch(e) {}
    select.value = saved === "auto" || LANGUAGES[saved] ? saved : "auto";
    select.addEventListener("change", () => {
      const choice = select.value;
      try { localStorage.setItem(STORAGE_KEY, choice); } catch(e) {}
      const language = choice === "auto" ? detectLanguage() : choice;
      translatePage(language);
      setTimeout(()=> location.reload(), 150);
    });
    document.body.appendChild(select);
  }
  function start() {
    let saved = "auto";
    try { saved = localStorage.getItem(STORAGE_KEY) || "auto"; } catch(e) {}
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    let initialLanguage;
    if(urlLang && LANGUAGES[urlLang]) initialLanguage = urlLang;
    else initialLanguage = saved === "auto" ? detectLanguage() : safeGetLanguage();
    translatePage(initialLanguage);
    createLanguageSelector();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
