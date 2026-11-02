// NEXORA GLOBAL LANGUAGE SYSTEM - Auto Worldwide
(async function() {
  const SUPPORTED = ['en','hi','bn','pt','es','fr','de','id','tr'];
  
  // 1. Phone ki bhasha nikalo
  let lang = navigator.language.slice(0,2).toLowerCase();
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if(urlLang && SUPPORTED.includes(urlLang)) lang = urlLang;
  
  if(!SUPPORTED.includes(lang)) lang = 'en';
  localStorage.setItem('nexora_lang', lang);
  
  if(lang === 'en') return; // English default hai, kuch karne ki zarurat nahi

  // 2. Us bhasha ki file load karo
  try {
    const res = await fetch(`/locales/${lang}.json`);
    if(!res.ok) return;
    const t = await res.json();

    // 3. Puri site pe har jagah jaha ID laga hai usko badal do
    function set(id, text) {
      const el = document.getElementById(id);
      if(el && text) el.innerText = text;
    }

    // Ye har page pe kaam karega
    set('t-title', t.title);
    set('t-desc', t.desc);
    set('t-upload', t.upload);
    set('t-how_title', t.how_to_title);
    set('t-step1', t.how_step_1);
    set('t-step2', t.how_step_2);
    set('t-select', t.select_dpi);
    set('t-tag', t.tag);
    set('t-info', t.important);
    set('t-what', t.what);
    set('t-home-title', t.home_title);
    set('t-home-desc', t.home_desc);
    
    document.documentElement.lang = lang;
    console.log('NEXORA Language Loaded:', lang);
  } catch(e) {
    console.log('Language load fail', e);
  }
})();
