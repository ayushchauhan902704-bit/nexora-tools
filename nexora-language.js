// NEXORA GLOBAL LANGUAGE SYSTEM - FINAL FIX
document.addEventListener("DOMContentLoaded", async function() {
  console.log("NEXORA Lang System Started");
  const SUPPORTED = ['en','hi','bn','pt'];
  
  let lang = navigator.language.slice(0,2).toLowerCase();
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if(urlLang && SUPPORTED.includes(urlLang)) lang = urlLang;
  
  if(!SUPPORTED.includes(lang)) lang = 'en';
  
  console.log("Detected Lang:", lang);
  if(lang === 'en') {
    console.log("English - No change needed");
    return;
  }

  // Dono path try karenge
  let t = null;
  const paths = [`./locales/${lang}.json`, `/locales/${lang}.json`, `locales/${lang}.json`];
  
  for(let p of paths) {
    try {
      const res = await fetch(p);
      if(res.ok) { t = await res.json(); console.log("Loaded from:", p, t); break; }
    } catch(e) {}
  }
  
  if(!t) { console.log("Failed to load json"); return; }

  function set(id, text) {
    const el = document.getElementById(id);
    if(el && text) el.innerText = text;
  }

  set('t-title', t.title);
  set('t-desc', t.desc);
  set('t-upload', t.upload);
  set('t-how_title', t.how_to_title);
  set('t-step1', t.how_step_1);
  set('t-step2', t.how_step_2);
  set('t-select', t.select_dpi);
  set('t-tag', t.tag);
  
  console.log("Translation Done!");
});
