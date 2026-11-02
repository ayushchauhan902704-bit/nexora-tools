
/* ==========================================
   NEXORA AUTO + MANUAL LANGUAGE TRANSLATOR
   ========================================== */

(function () {
  "use strict";

  const LANGUAGES = {
    auto: "🌐 Automatic",
    en: "🇬🇧 English",
    hi: "🇮🇳 Hindi",
    es: "🇪🇸 Spanish",
    fr: "🇫🇷 French",
    de: "🇩🇪 German",
    pt: "🇵🇹 Portuguese",
    ar: "🇸🇦 Arabic",
    bn: "🇧🇩 Bengali",
    ur: "🇵🇰 Urdu",
    zh-CN: "🇨🇳 Chinese (Simplified)",
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
    sw: "🇰🇪 Swahili"
  };

  const STORAGE_KEY = "nexora_language";

  function getBrowserLanguage() {
    const preferences = navigator.languages || [navigator.language || "en"];

    for (const preference of preferences) {
      const lang = preference.toLowerCase();

      if (lang.startsWith("zh")) {
        return lang.includes("tw") || lang.includes("hk")
          ? "zh-TW"
          : "zh-CN";
      }

      const code = lang.split("-")[0];

      if (LANGUAGES[code]) {
        return code;
      }
    }

    return "en";
  }

  function getSavedLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "auto";
    } catch (e) {
      return "auto";
    }
  }

  function getTargetLanguage() {
    const saved = getSavedLanguage();

    if (saved === "auto") {
      return getBrowserLanguage();
    }

    return LANGUAGES[saved] ? saved : "en";
  }

  function setGoogleCookie(language) {
    const value = language === "en"
      ? "/en/en"
      : "/en/" + language;

    document.cookie =
      "googtrans=" + value + ";path=/;SameSite=Lax";
  }

  function createLanguageSelector() {
    if (document.getElementById("nexora-language-box")) return;

    const style = document.createElement("style");

    style.textContent = `
      #nexora-language-box {
        position: fixed;
        right: 15px;
        bottom: 15px;
        z-index: 999999;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 9px 11px;
        box-shadow: 0 5px 25px rgba(0,0,0,.15);
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: Arial, sans-serif;
      }

      #nexora-language-box label {
        font-size: 12px;
        font-weight: 700;
        color: #334155;
      }

      #nexora-language-select {
        max-width: 165px;
        padding: 7px 9px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        background: white;
        color: #111827;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
      }

      #google_translate_element {
        position: absolute !important;
        left: -9999px !important;
        top: 0 !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
      }

      @media(max-width:480px) {
        #nexora-language-box {
          right: 10px;
          bottom: 10px;
          padding: 8px;
        }
        #nexora-language-box label {
          font-size: 11px;
        }
        #nexora-language-select {
          max-width: 145px;
          font-size: 11px;
        }
      }
    `;

    document.head.appendChild(style);

    const box = document.createElement("div");
    box.id = "nexora-language-box";

    const label = document.createElement("label");
    label.htmlFor = "nexora-language-select";
    label.textContent = "🌐 Language";

    const select = document.createElement("select");
    select.id = "nexora-language-select";
    select.setAttribute("aria-label", "Choose website language");

    Object.entries(LANGUAGES).forEach(([code, name]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = name;
      select.appendChild(option);
    });

    select.value = getSavedLanguage();

    select.addEventListener("change", function () {
      const language = select.value;

      try {
        localStorage.setItem(STORAGE_KEY, language);
      } catch (e) {}

      const target = language === "auto"
        ? getBrowserLanguage()
        : language;

      setGoogleCookie(target);

      // Reload so Google Translate can apply the selected language.
      window.location.reload();
    });

    box.appendChild(label);
    box.appendChild(select);
    document.body.appendChild(box);
  }

  // Choose the language before Google Translate loads.
  setGoogleCookie(getTargetLanguage());

  window.googleTranslateElementInit = function () {
    if (!window.google || !google.translate) return;

    new google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages:
          "hi,es,fr,de,pt,ar,bn,ur,zh-CN,zh-TW,ja,ko,ru,it,nl,tr,id,vi,th,pl,uk,fa,ta,te,mr,gu,pa,sw",
        autoDisplay: false
      },
      "google_translate_element"
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createLanguageSelector);
  } else {
    createLanguageSelector();
  }

})();
