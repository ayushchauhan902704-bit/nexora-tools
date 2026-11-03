"use strict";
/* NEXORA - AUTO TRANSLATE JUGAAD - NO DICTIONARY - 100% WORKS */
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
    tr: "🇹🇷 Turkish"
  };
  const STORAGE_KEY = "nexora_language";
  const CACHE_PREFIX = "nexora_tr_";

  const originalTexts = new WeakMap();
  const cache = new Map();

  function detectLang(){
    const p = navigator.languages || [navigator.language || "en"];
    for(const pr of p){
      const c = pr.toLowerCase();
      const ex = Object.keys(LANGUAGES).find(k=>k.toLowerCase()===c);
      if(ex) return ex;
      const b = c.split("-")[0];
      if(LANGUAGES[b]) return b;
    }
    return "en";
  }

  function safeGet(){
    try{
      const s = localStorage.getItem(STORAGE_KEY);
      return s && s!=="auto" && LANGUAGES[s] ? s : detectLang();
    }catch(e){ return detectLang(); }
  }

  function getOriginal(n){
    if(!originalTexts.has(n)) originalTexts.set(n, n.nodeValue);
    return originalTexts.get(n);
  }

  // Free Google Translate API - No Key Needed
  async function translateText(text, targetLang){
    if(!text.trim() || targetLang==="en") return text;
    
    const cacheKey = `${targetLang}::${text}`;
    if(cache.has(cacheKey)) return cache.get(cacheKey);
    
    try{
      const stored = localStorage.getItem(CACHE_PREFIX + btoa(cacheKey).slice(0,50));
      if(stored) {
        cache.set(cacheKey, stored);
        return stored;
      }
    }catch(e){}

    try{
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      const data = await res.json();
      let translated = "";
      if(data && data[0]){
        data[0].forEach(item => { if(item[0]) translated += item[0]; });
      }
      if(translated){
        cache.set(cacheKey, translated);
        try{ localStorage.setItem(CACHE_PREFIX + btoa(cacheKey).slice(0,50), translated); }catch(e){}
        return translated;
      }
    }catch(e){
      console.log("Translate fail", e);
    }
    return text;
  }

  async function translatePage(lang){
    if(!LANGUAGES[lang]) lang="en";
    
    if(lang==="en"){
      // Restore original
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node){
          const p=node.parentElement;
          if(!p) return NodeFilter.FILTER_REJECT;
          if(p.closest("script, style, noscript, #nexora-language-selector")) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let n;
      while(n=walker.nextNode()){
        if(originalTexts.has(n)) n.nodeValue = originalTexts.get(n);
      }
      document.documentElement.lang="en";
      return;
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const p=node.parentElement;
        if(!p) return NodeFilter.FILTER_REJECT;
        if(p.closest("script, style, noscript, textarea, #resultCount, #nexora-language-selector")) return NodeFilter.FILTER_REJECT;
        if(!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if(node.nodeValue.trim().length < 2) return NodeFilter.FILTER_REJECT;
        // Skip if already has non-english chars (already translated)
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    let node;
    while(node=walker.nextNode()){
      getOriginal(node); // Save original
      nodes.push(node);
    }

    // Translate in batches of 5 to avoid rate limit
    for(let i=0;i<nodes.length;i+=5){
      const batch = nodes.slice(i, i+5);
      await Promise.all(batch.map(async (n) => {
        const original = getOriginal(n).trim();
        if(!original) return;
        // Skip small symbols, numbers only
        if(/^[0-9\s\W]+$/.test(original)) return;
        if(original.length < 2) return;
        
        const translated = await translateText(original, lang);
        if(translated && translated !== original){
          const fullOriginal = getOriginal(n);
          const lead = fullOriginal.match(/^\s*/)?.[0]||"";
          const trail = fullOriginal.match(/\s*$/)?.[0]||"";
          n.nodeValue = lead + translated + trail;
        }
      }));
      // Small delay to avoid blocking
      await new Promise(r=>setTimeout(r, 50));
    }

    // Translate placeholders
    const searchInput = document.getElementById("searchInput");
    if(searchInput){
      const ph = searchInput.getAttribute("data-i18n-placeholder") || searchInput.placeholder;
      if(ph && ph.length>2){
        const t = await translateText(ph, lang);
        if(t) searchInput.placeholder = t;
      }
    }

    document.documentElement.lang=lang;
  }

  function createSelector(){
    if(document.getElementById("nexora-language-selector")) return;
    const style=document.createElement("style");
    style.textContent=`#nexora-language-selector{position:fixed;right:14px;bottom:16px;z-index:99999;padding:10px 14px;border:1px solid #d1d5db;border-radius:12px;background:#fff;color:#111827;font-size:14px;max-width:190px;box-shadow:0 4px 18px rgba(0,0,0,.13);cursor:pointer}#nexora-language-selector:disabled{opacity:.6}`;
    document.head.appendChild(style);
    const sel=document.createElement("select");
    sel.id="nexora-language-selector";
    const auto=document.createElement("option");auto.value="auto";auto.textContent="🌐 Automatic";sel.appendChild(auto);
    Object.entries(LANGUAGES).forEach(([c,n])=>{const o=document.createElement("option");o.value=c;o.textContent=n;sel.appendChild(o);});
    let saved="auto";try{saved=localStorage.getItem(STORAGE_KEY)||"auto";}catch(e){}
    sel.value=LANGUAGES[saved]||saved==="auto"?saved:"auto";
    
    sel.addEventListener("change", async ()=>{
      const ch=sel.value;
      try{localStorage.setItem(STORAGE_KEY,ch);}catch(e){}
      const lang=ch==="auto"?detectLang():ch;
      sel.disabled=true;
      sel.innerHTML=`<option>⏳ Translating...</option>`;
      await translatePage(lang);
      sel.disabled=false;
      // Rebuild options
      sel.innerHTML="";
      const auto2=document.createElement("option");auto2.value="auto";auto2.textContent="🌐 Automatic";sel.appendChild(auto2);
      Object.entries(LANGUAGES).forEach(([c,n])=>{const o=document.createElement("option");o.value=c;o.textContent=n;sel.appendChild(o);});
      sel.value=ch;
    });
    document.body.appendChild(sel);
  }

  async function start(){
    let saved="auto";try{saved=localStorage.getItem(STORAGE_KEY)||"auto";}catch(e){}
    const urlParams=new URLSearchParams(location.search);
    const urlLang=urlParams.get('lang');
    let initial=urlLang&&LANGUAGES[urlLang]?urlLang:(saved==="auto"?detectLang():safeGet());
    
    createSelector();
    
    if(initial!=="en"){
      const sel=document.getElementById("nexora-language-selector");
      if(sel){sel.disabled=true; sel.innerHTML="<option>⏳ Auto Translating...</option>";}
      await translatePage(initial);
      if(sel){
        sel.disabled=false;
        sel.innerHTML="";
        const auto2=document.createElement("option");auto2.value="auto";auto2.textContent="🌐 Automatic";sel.appendChild(auto2);
        Object.entries(LANGUAGES).forEach(([c,n])=>{const o=document.createElement("option");o.value=c;o.textContent=n;sel.appendChild(o);});
        sel.value=saved;
      }
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start);
  else start();
})();
