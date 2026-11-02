// NEXORA GLOBAL AUTO LANGUAGE - 100% Phone Language
document.addEventListener("DOMContentLoaded", async function() {
  const SUPPORTED = ['en','hi','bn','pt'];
  
  // 1. Phone ki real bhasha nikalo
  let browserLang = navigator.language.slice(0,2).toLowerCase();
  let lang = browserLang;
  
  // 2. Agar URL me ?lang=bn likha hai tabhi us bhasha me dikhao, warna phone wali
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if(urlLang && SUPPORTED.includes(urlLang)) {
    lang = urlLang;
  } else {
    // URL me kuch nahi hai toh phone ki bhasha lo
    if(!SUPPORTED.includes(browserLang)) lang = 'en';
  }
  
  console.log("Phone Lang:", browserLang, "Show Lang:", lang);
  
  // English hai toh kuch mat karo, English hi rehne do
  if(lang === 'en') {
    localStorage.removeItem('nexora_lang'); // purana wala cache hatao
    return;
  }

  try {
    const res = await fetch(`./locales/${lang}.json`);
    if(!res.ok) return;
    const t = await res.json();

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
    
    document.documentElement.lang = lang;
  } catch(e) {}
});
