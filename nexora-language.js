"use strict";
/* NEXORA LANGUAGE ENGINE - FINAL WORLDWIDE AUTO - SINGLE FILE */
(() => {
  const LANGUAGES = {
    en: "🇬🇧 English",
    hi: "🇮🇳 Hindi",
    bn: "🇧🇩 Bengali",
    pt: "🇵🇹 Portuguese",
    es: "🇪🇸 Spanish",
    id: "🇮🇩 Indonesian",
    fr: "🇫🇷 French",
    de: "🇩🇪 German",
    ar: "🇸🇦 Arabic",
    tr: "🇹🇷 Turkish",
  };
  const STORAGE_KEY = "nexora_language";
  const supported = Object.keys(LANGUAGES);

  const TRANSLATIONS = {
    en: {},
    hi: {
      "Home": "होम", "All Tools": "सभी टूल्स", "About": "हमारे बारे में", "Contact": "संपर्क करें", "Privacy": "गोपनीयता",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS": "रोज़मर्रा के कामों के लिए मुफ्त ऑनलाइन टूल्स",
      "Get More Done with": "अपने काम आसानी से पूरे करें", "Search tools... e.g. image compressor, PDF to Word": "टूल खोजें...",
      "All Tools": "सभी टूल्स", "Image": "इमेज", "PDF": "PDF", "Calculators": "कैलकुलेटर", "Open Tool →": "टूल खोलें →",
      "Image DPI Changer - 72 to 300 DPI": "इमेज DPI बदलें - 72 से 300 DPI",
      "Image Compression Guides": "इमेज कंप्रेशन गाइड",
      "WORLDWIDE NO.1 • FREE DPI TOOL": "दुनिया का नंबर 1 • फ्री DPI टूल",
      "Image DPI Changer - Change 72 to 300 DPI Instantly": "इमेज DPI चेंजर - 72 से 300 DPI तुरंत बदलें",
      "Change your JPG, PNG or HEIC image DPI to 72, 150, 300, 600 or custom value. Best for printing, Amazon, passport & worldwide docs. 100% Private - No Watermark.": "अपनी JPG, PNG या HEIC इमेज का DPI बदलें। प्रिंटिंग के लिए बेस्ट, 100% प्राइवेट।",
      "Upload Your Image": "अपनी इमेज अपलोड करें",
      "Select DPI": "DPI चुनें", "Or enter custom DPI (1–1200)": "या कस्टम DPI डालें (1-1200)",
      "Download Image - 300 DPI →": "इमेज डाउनलोड करें - 300 DPI →"
    },
    bn: {
      "Home": "হোম", "All Tools": "সব টুলস", "About": "আমাদের সম্পর্কে", "Contact": "যোগাযোগ", "Privacy": "গোপনীয়তা",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS": "দৈনন্দিন কাজের জন্য বিনামূল্যে অনলাইন টুলস",
      "Get More Done with": "আপনার কাজ সহজে করুন", "Search tools... e.g. image compressor, PDF to Word": "টুল খুঁজুন...",
      "All Tools": "সব টুলস", "Image": "ছবি", "PDF": "PDF", "Calculators": "ক্যালকুলেটর", "Open Tool →": "টুল খুলুন →",
      "Image DPI Changer - 72 to 300 DPI": "ইমেজ DPI পরিবর্তনকারী - 72 থেকে 300 DPI",
      "Image Compression Guides": "ইমেজ কম্প্রেশন গাইড",
      "WORLDWIDE NO.1 • FREE DPI TOOL": "বিশ্বব্যাপী নং 1 • বিনামূল্যে DPI টুল",
      "Image DPI Changer - Change 72 to 300 DPI Instantly": "ইমেজ DPI পরিবর্তনকারী - 72 থেকে 300 DPI তে পরিবর্তন করুন",
      "Change your JPG, PNG or HEIC image DPI to 72, 150, 300, 600 or custom value. Best for printing, Amazon, passport & worldwide docs. 100% Private - No Watermark.": "আপনার JPG, PNG ছবির DPI পরিবর্তন করুন। প্রিন্টিং এর জন্য সেরা, 100% প্রাইভেট।",
      "Upload Your Image": "আপনার ছবি আপলোড করুন",
      "Select DPI": "DPI নির্বাচন করুন", "Or enter custom DPI (1–1200)": "অথবা কাস্টম DPI লিখুন (1-1200)",
      "Download Image - 300 DPI →": "ছবি ডাউনলোড করুন - 300 DPI →"
    },
    pt: {
      "Home": "Início", "All Tools": "Todas Ferramentas", "About": "Sobre", "Contact": "Contato", "Privacy": "Privacidade",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS": "FERRAMENTAS ONLINE GRÁTIS PARA TAREFAS DIÁRIAS",
      "Get More Done with": "Faça mais com", "Search tools... e.g. image compressor, PDF to Word": "Buscar ferramentas...",
      "All Tools": "Todas Ferramentas", "Image": "Imagem", "PDF": "PDF", "Calculators": "Calculadoras", "Open Tool →": "Abrir →",
      "Image DPI Changer - 72 to 300 DPI": "Alterador de DPI - 72 a 300 DPI",
      "WORLDWIDE NO.1 • FREE DPI TOOL": "Nº 1 MUNDIAL • FERRAMENTA DPI GRÁTIS",
      "Image DPI Changer - Change 72 to 300 DPI Instantly": "Alterador de DPI de Imagem - Mude 72 para 300 DPI Instantaneamente",
      "Upload Your Image": "Carregue sua imagem",
      "Select DPI": "Selecione DPI", "Or enter custom DPI (1–1200)": "Ou digite DPI personalizado",
      "Download Image - 300 DPI →": "Baixar Imagem - 300 DPI →"
    },
    es: {
      "Home": "Inicio", "All Tools": "Todas Herramientas", "WORLDWIDE NO.1 • FREE DPI TOOL": "Nº1 MUNDIAL • HERRAMIENTA DPI GRATIS",
      "Image DPI Changer - Change 72 to 300 DPI Instantly": "Cambiador de DPI - Cambia 72 a 300 DPI al instante",
      "Upload Your Image": "Sube tu imagen", "Select DPI": "Seleccionar DPI",
      "Download Image - 300 DPI →": "Descargar Imagen - 300 DPI →"
    },
    id: {
      "Home": "Beranda", "All Tools": "Semua Alat", "WORLDWIDE NO.1 • FREE DPI TOOL": "NO.1 DUNIA • ALAT DPI GRATIS",
      "Image DPI Changer - Change 72 to 300 DPI Instantly": "Pengubah DPI Gambar - Ubah 72 ke 300 DPI Instan",
      "Upload Your Image": "Unggah Gambar Anda", "Select DPI": "Pilih DPI",
      "Download Image - 300 DPI →": "Unduh Gambar - 300 DPI →"
    }
  };

  const originalTexts = new WeakMap();
  let activeLanguage = "en";
  let resultCountObserver = null;

  function detectLanguage() {
    const prefs = navigator.languages || [navigator.language || "en"];
    for (const pref of prefs) {
      const code = pref.toLowerCase();
      if (code.startsWith("zh-tw") || code.startsWith("zh-hk")) return "zh-TW";
      if (code.startsWith("zh")) return "zh-CN";
      const exact = supported.find(item => item.toLowerCase() === code);
      if (exact) return exact;
      const base = code.split("-")[0];
      if (supported.includes(base)) return base;
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
      } else { node.nodeValue = original; }
    }
  }

  function translatePage(language) {
    if (!LANGUAGES[language]) language = "en";
    activeLanguage = language;
    const dictionary = TRANSLATIONS[language] || {};
    document.documentElement.lang = language;
    document.documentElement.dir = ["ar","ur","fa"].includes(language) ? "rtl" : "ltr";
    translateTextNodes(language, dictionary);
  }

  function createLanguageSelector() {
    if (document.getElementById("nexora-language-selector")) return;
    const style = document.createElement("style");
    style.textContent = `#nexora-language-selector{position:fixed;right:14px;bottom:16px;z-index:99999;padding:10px 12px;border:1px solid #d1d5db;border-radius:12px;background:#fff;color:#111827;font-size:14px;max-width:190px;box-shadow:0 4px 18px rgba(0,0,0,.13);cursor:pointer} html[dir="rtl"] #nexora-language-selector{right:auto;left:14px}`;
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
      location.reload();
    });
    document.body.appendChild(select);
  }

  function start() {
    let saved = "auto";
    try { saved = localStorage.getItem(STORAGE_KEY) || "auto"; } catch(e) {}
    const initialLanguage = saved === "auto" ? detectLanguage() : safeGetLanguage();
    translatePage(initialLanguage);
    createLanguageSelector();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
