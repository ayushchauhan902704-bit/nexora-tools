
"use strict";

/* NEXORA LANGUAGE ENGINE */

(() => {
  const LANGUAGES = {
    en: "🇬🇧 English",
    hi: "🇮🇳 Hindi",
    es: "🇪🇸 Spanish",
    fr: "🇫🇷 French",
    de: "🇩🇪 German",
    pt: "🇵🇹 Portuguese",
    ar: "🇸🇦 Arabic",
    bn: "🇧🇩 Bengali",
    ur: "🇵🇰 Urdu",
    "zh-CN": "🇨🇳 Chinese (Simplified)",
    "zh-TW": "🇹🇼 Chinese (Traditional)",
    ja: "🇯🇵 Japanese",
    ko: "🇰🇷 Korean",
    ru: "🇷🇺 Russian",
    it: "🇮🇹 Italian",
    nl: "🇳🇱 Dutch",
    tr: "🇹🇷 Turkish",
    id: "🇮🇩 Indonesian",
    vi: "🇻🇳 Vietnamese",
    th: "🇹🇭 Thai",
    pl: "🇵🇱 Polish",
    uk: "🇺🇦 Ukrainian",
    fa: "🇮🇷 Persian",
    ta: "🇮🇳 Tamil",
    te: "🇮🇳 Telugu",
    mr: "🇮🇳 Marathi",
    gu: "🇮🇳 Gujarati",
    pa: "🇮🇳 Punjabi",
    sw: "🇰🇪 Swahili",
    ms: "🇲🇾 Malay",
    fil: "🇵🇭 Filipino",
    ro: "🇷🇴 Romanian",
    el: "🇬🇷 Greek",
    cs: "🇨🇿 Czech",
    hu: "🇭🇺 Hungarian",
    sv: "🇸🇪 Swedish"
  };

  const STORAGE_KEY = "nexora_language";

  /*
   * Translation dictionary.
   * Add translated text here using the same English keys.
   */
  const TRANSLATIONS = {
    en: {
      "Home": "Home",
      "All Tools": "All Tools",
      "Search tools": "Search tools",
      "Explore Tools": "Explore Tools",
      "Contact": "Contact",
      "About Us": "About Us"
    },

    hi: {
      "Home": "होम",
      "All Tools": "सभी टूल्स",
      "Search tools": "टूल्स खोजें",
      "Explore Tools": "टूल्स देखें",
      "Contact": "संपर्क करें",
      "About Us": "हमारे बारे में"
    }
  };

  const supported = Object.keys(LANGUAGES);

  function detectLanguage() {
    const preferences = navigator.languages || [
      navigator.language || "en"
    ];

    for (const preference of preferences) {
      const code = preference.toLowerCase();

      if (code.startsWith("zh-tw") || code.startsWith("zh-hk")) {
        return "zh-TW";
      }

      if (code.startsWith("zh")) return "zh-CN";

      const exact = supported.find(
        item => item.toLowerCase() === code
      );

      if (exact) return exact;

      const base = code.split("-")[0];

      if (supported.includes(base)) return base;
    }

    return "en";
  }

  function getLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved && saved !== "auto" && LANGUAGES[saved]) {
        return saved;
      }
    } catch (error) {}

    return detectLanguage();
  }

  function translatePage(language) {
    const dictionary = TRANSLATIONS[language] || {};

    document.documentElement.lang = language;

    document.documentElement.dir =
      ["ar", "ur", "fa"].includes(language) ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.getAttribute("data-i18n");

      if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
        element.textContent = dictionary[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      const key = element.getAttribute("data-i18n-placeholder");

      if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
        element.placeholder = dictionary[key];
      }
    });

    document.querySelectorAll("[data-i18n-title]").forEach(element => {
      const key = element.getAttribute("data-i18n-title");

      if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
        element.title = dictionary[key];
      }
    });
  }

  function createLanguageSelector() {
    if (document.getElementById("nexora-language-selector")) return;

    const style = document.createElement("style");

    style.textContent = `
      #nexora-language-selector {
        position: fixed;
        right: 14px;
        bottom: 16px;
        z-index: 99999;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        background: #fff;
        color: #111827;
        font-size: 14px;
        max-width: 190px;
        box-shadow: 0 4px 18px rgba(0,0,0,.13);
      }

      #nexora-language-selector:focus {
        outline: 2px solid #6366f1;
      }
    `;

    document.head.appendChild(style);

    const select = document.createElement("select");

    select.id = "nexora-language-selector";
    select.setAttribute("aria-label", "Choose website language");

    const autoOption = document.createElement("option");
    autoOption.value = "auto";
    autoOption.textContent = "🌐 Automatic";
    select.appendChild(autoOption);

    Object.entries(LANGUAGES).forEach(([code, name]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = name;
      select.appendChild(option);
    });

    const saved = localStorage.getItem(STORAGE_KEY) || "auto";
    select.value = saved;

    select.addEventListener("change", () => {
      const choice = select.value;

      try {
        localStorage.setItem(STORAGE_KEY, choice);
      } catch (error) {}

      translatePage(choice === "auto" ? detectLanguage() : choice);
    });

    document.body.appendChild(select);
  }

  function start() {
    const saved = localStorage.getItem(STORAGE_KEY) || "auto";

    translatePage(
      saved === "auto" ? detectLanguage() : getLanguage()
    );

    createLanguageSelector();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  window.NEXORA_LANGUAGE = {
    languages: LANGUAGES,
    translations: TRANSLATIONS,
    translate: translatePage,
    detect: detectLanguage
  };
})();
