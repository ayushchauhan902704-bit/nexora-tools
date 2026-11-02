
(function () {
    "use strict";

    const LANGUAGES = {
        en: "English",
        hi: "Hindi",
        es: "Spanish",
        fr: "French",
        de: "German",
        pt: "Portuguese",
        ar: "Arabic",
        bn: "Bengali",
        ur: "Urdu",
        zh-CN: "Chinese",
        ja: "Japanese",
        ko: "Korean",
        ru: "Russian",
        it: "Italian",
        nl: "Dutch",
        tr: "Turkish",
        id: "Indonesian",
        vi: "Vietnamese",
        th: "Thai",
        pl: "Polish",
        uk: "Ukrainian",
        fa: "Persian",
        ta: "Tamil",
        te: "Telugu",
        mr: "Marathi",
        gu: "Gujarati",
        pa: "Punjabi",
        sw: "Swahili"
    };

    const STORAGE_KEY = "nexora_language";
    const DEFAULT_LANGUAGE = "en";

    function getCookie(name) {
        const match = document.cookie.match(
            new RegExp("(?:^|; )" + name + "=([^;]*)")
        );

        return match ? decodeURIComponent(match[1]) : "";
    }

    function setGoogleCookie(language) {
        const value = language === "en" ? "" : "/en/" + language;

        document.cookie =
            "googtrans=" + value +
            "; path=/; max-age=" +
            (language === "en" ? "0" : "31536000") +
            "; SameSite=Lax";
    }

    function getBrowserLanguage() {
        const browserLanguages = navigator.languages || [
            navigator.language || "en"
        ];

        for (const browserLanguage of browserLanguages) {
            const code = browserLanguage.toLowerCase();

            if (LANGUAGES[code]) return code;

            const shortCode = code.split("-")[0];

            if (LANGUAGES[shortCode]) return shortCode;
        }

        return DEFAULT_LANGUAGE;
    }

    function getSelectedLanguage() {
        try {
            return localStorage.getItem(STORAGE_KEY) || null;
        } catch (error) {
            return null;
        }
    }

    function saveLanguage(language) {
        try {
            if (language === "auto") {
                localStorage.removeItem(STORAGE_KEY);
            } else {
                localStorage.setItem(STORAGE_KEY, language);
            }
        } catch (error) {
            console.warn("Language preference could not be saved.");
        }
    }

    function getTargetLanguage() {
        const saved = getSelectedLanguage();

        if (saved && LANGUAGES[saved]) {
            return saved;
        }

        return getBrowserLanguage();
    }

    function getCurrentTranslation() {
        const cookie = getCookie("googtrans");
        const parts = cookie.split("/");

        return parts.length >= 3 ? parts[2] : "en";
    }

    function applyLanguage(language) {
        if (!LANGUAGES[language]) return;

        saveLanguage(language);
        setGoogleCookie(language);

        if (getCurrentTranslation() !== language) {
            location.reload();
        }
    }

    function createLanguageSelector() {
        if (document.getElementById("nexora-language-box")) return;

        const box = document.createElement("div");
        box.id = "nexora-language-box";

        box.innerHTML = `
            <label for="nexora-language-select">
                🌐 Language
            </label>
            <select id="nexora-language-select"
                    aria-label="Choose website language">
                <option value="auto">🌍 Auto Detect</option>
                ${Object.entries(LANGUAGES).map(([code, name]) =>
                    `<option value="${code}">${name}</option>`
                ).join("")}
            </select>
        `;

        const style = document.createElement("style");

        style.textContent = `
            #nexora-language-box {
                position: fixed;
                right: 12px;
                bottom: 15px;
                z-index: 999999;
                background: #ffffff;
                color: #111827;
                padding: 9px 11px;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                box-shadow: 0 4px 18px rgba(0,0,0,.13);
                display: flex;
                align-items: center;
                gap: 7px;
                font-family: Arial, sans-serif;
                font-size: 12px;
            }

            #nexora-language-box label {
                font-weight: 700;
                white-space: nowrap;
            }

            #nexora-language-select {
                max-width: 125px;
                padding: 7px;
                border: 1px solid #d1d5db;
                border-radius: 7px;
                background: white;
                color: #111827;
                font-size: 12px;
                outline: none;
            }

            #nexora-language-select:focus {
                border-color: #6366f1;
            }

            @media(max-width:480px) {
                #nexora-language-box {
                    right: 8px;
                    bottom: 10px;
                    padding: 7px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(box);

        const select = document.getElementById(
            "nexora-language-select"
        );

        const saved = getSelectedLanguage();

        select.value = saved && LANGUAGES[saved]
            ? saved
            : "auto";

        select.addEventListener("change", function () {
            const language = this.value === "auto"
                ? getBrowserLanguage()
                : this.value;

            applyLanguage(language);
        });
    }

    // Google Translate callback
    window.googleTranslateElementInit = function () {
        if (!window.google || !google.translate) return;

        new google.translate.TranslateElement(
            {
                pageLanguage: "en",
                includedLanguages: Object.keys(LANGUAGES).join(","),
                autoDisplay: false,
                multilanguagePage: true
            },
            "google_translate_element"
        );
    };

    function initialize() {
        createLanguageSelector();

        const target = getTargetLanguage();
        const current = getCurrentTranslation();

        if (target !== current) {
            setGoogleCookie(target);
            location.reload();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

})();
