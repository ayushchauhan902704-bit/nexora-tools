
"use strict";

/* =====================================================
   NEXORA ENGLISH-ONLY LANGUAGE ENGINE
   No Hindi translation
   No Hinglish translation
   No language selector
   English as default language
   ===================================================== */

(() => {
  const STORAGE_KEY = "nexora-language";

  function setEnglish() {
    // Always use English
    document.documentElement.lang = "en";
    document.documentElement.setAttribute("translate", "no");

    // Remove any previously saved Hindi preference
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Storage may be unavailable
    }

    // Remove the old language selector, if present
    const oldSelector = document.getElementById(
      "nexoraLanguageWrapper"
    );

    if (oldSelector) {
      oldSelector.remove();
    }

    // Remove any previously injected language selector styles
    const oldStyles = document.querySelectorAll("style");

    oldStyles.forEach(style => {
      if (
        style.textContent &&
        style.textContent.includes("nexoraLanguageWrapper")
      ) {
        style.remove();
      }
    });
  }

  function start() {
    setEnglish();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, {
      once: true
    });
  } else {
    start();
  }

  // Keep a simple compatibility API for existing pages
  window.NEXORA_LANGUAGE = {
    detect: () => "en",
    translate: () => setEnglish(),
    getCurrent: () => "en",
    getAvailable: () => ["en"]
  };
})();
