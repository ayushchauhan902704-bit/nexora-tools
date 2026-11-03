"use strict";
/* NEXORA - FINAL - HOME + ALL TOOLS 100% - CONNECTED */
(() => {
  const LANGUAGES = { en:"🇬🇧 English", hi:"🇮🇳 Hindi", bn:"🇧🇩 Bengali", pt:"🇵🇹 Portuguese", es:"🇪🇸 Spanish", id:"🇮🇩 Indonesian" };
  const STORAGE_KEY = "nexora_language";

  const DICT = {
    hi: {
      "Home":"होम","All Tools":"सभी टूल्स","Guides":"गाइड","About":"हमारे बारे में","Contact":"संपर्क करें","Privacy":"गोपनीयता",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS":"रोज़मर्रा के कामों के लिए मुफ्त ऑनलाइन टूल्स",
      "Get More Done with":"अपने काम आसानी से पूरे करें","NEXORA Tools":"NEXORA टूल्स",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"इमेज, PDF, वीडियो, टेक्स्ट और रोज़मर्रा के कामों के लिए आसान ऑनलाइन टूल्स।",
      "Free to use":"मुफ्त इस्तेमाल","Easy to use":"आसान इस्तेमाल","No watermark on supported tools":"वॉटरमार्क नहीं","Mobile friendly":"मोबाइल फ्रेंडली",
      "Search tools... e.g. image compressor, PDF to Word":"टूल खोजें... जैसे इमेज कंप्रेसर",
      "Find the right tool quickly by name or task.":"नाम या काम के अनुसार सही टूल जल्दी खोजें।",
      "30":"30","Online Tools":"ऑनलाइन टूल्स","100%":"100%","Free Access":"मुफ्त सुविधा","24/7":"24/7","Online Access":"ऑनलाइन उपलब्ध","Easy":"आसान","To Use":"इस्तेमाल",
      "Explore All Online Tools":"सभी ऑनलाइन टूल्स देखें","Choose a tool and complete your task in a few simple steps.":"एक टूल चुनें और आसान चरणों में काम पूरा करें।",
      "Showing 30 tools":"30 टूल दिखाए जा रहे हैं","All Tools":"सभी टूल्स","Image":"इमेज","PDF":"PDF","Calculators":"कैलकुलेटर","Text & Utilities":"टेक्स्ट और सुविधाएं","Open Tool →":"टूल खोलें →",
      "Image DPI Changer - 72 to 300 DPI":"इमेज DPI बदलें - 72 से 300 DPI","Change image DPI from 72 to 300 DPI for printing without losing quality.":"प्रिंटिंग के लिए DPI बदलें, क्वालिटी वैसी ही रहेगी।",
      // BACKGROUND REMOVER TOOL - FULL
      "Background Remover":"बैकग्राउंड हटाएं","Remove background in 1 second - Transparent, White, Blue, Red — No Watermark, HD, Private":"1 सेकंड में बैकग्राउंड हटाएं - ट्रांसपेरेंट, सफेद, नीला, लाल - वॉटरमार्क नहीं, HD",
      "📁 Click or Drag Photo Here":"📁 फोटो यहाँ क्लिक करें या खींचें","Upload a photo to start":"शुरू करने के लिए फोटो अपलोड करें",
      "Transparent":"ट्रांसपेरेंट","White - Passport":"सफेद - पासपोर्ट","Blue - Visa":"नीला - वीजा","Red":"लाल",
      "⬇️ Download HD PNG":"⬇️ HD PNG डाउनलोड करें",
      "Why NEXORA No.1 Background Remover in World?":"दुनिया में NEXORA नंबर 1 बैकग्राउंड रिमूवर क्यों है?",
      "Unlike remove.bg, slazzer with limits, watermark and paid plans, NEXORA Background Remover is 100% free forever, no watermark, HD PNG, 100% private — your photo never leaves your phone, browser-based AI processing, no upload to server. Remove background in 1 second automatically. Choose Transparent for e-commerce products, White for passport size photo, Blue for visa, Red for official documents. Download HD PNG original quality, no blur. Unlike other tools that reduce quality, NEXORA keeps HD. Made in India, trusted by 89k+ users worldwide, works on iPhone, Android, Laptop, offline. Best alternative to remove.bg, slazzer, removal.ai, Adobe. Fast in 1 sec, Made for India, Made for World.":"remove.bg जैसी लिमिट, वॉटरमार्क वाली साइटों से अलग, NEXORA 100% फ्री, वॉटरमार्क नहीं, HD, 100% प्राइवेट - फोटो फोन से बाहर नहीं जाती। 1 सेकंड में बैकग्राउंड हटाएं। पासपोर्ट के लिए सफेद, वीजा के लिए नीला चुनें।",
      "How to Remove Background - 3 Easy Steps":"बैकग्राउंड कैसे हटाएं - 3 आसान स्टेप",
      "NEXORA vs Others - Comparison":"NEXORA vs अन्य - तुलना","FAQ - Background Remover - Google Loves This":"FAQ - बैकग्राउंड रिमूवर"
    },
    bn: {
      "Home":"হোম","All Tools":"সব টুলস","FREE ONLINE TOOLS FOR EVERYDAY TASKS":"দৈনন্দিন কাজের জন্য বিনামূল্যে টুলস",
      "Get More Done with":"আপনার কাজ সহজে করুন","NEXORA Tools":"NEXORA টুলস",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"ছবি, PDF, ভিডিও, টেক্সট এর জন্য সহজ টুলস।",
      "Search tools... e.g. image compressor, PDF to Word":"টুল খুঁজুন...",
      "Explore All Online Tools":"সমস্ত টুলস দেখুন","Showing 30 tools":"৩০টি টুল দেখানো হচ্ছে","Open Tool →":"টুল খুলুন →",
      "Background Remover":"ব্যাকগ্রাউন্ড রিমুভার","Remove background in 1 second - Transparent, White, Blue, Red — No Watermark, HD, Private":"১ সেকেন্ডে ব্যাকগ্রাউন্ড সরান - ট্রান্সপারেন্ট, সাদা, নীল, লাল - ওয়াটারমার্ক নেই, HD",
      "📁 Click or Drag Photo Here":"📁 ফটো এখানে ক্লিক করুন বা টেনে আনুন","Upload a photo to start":"শুরু করতে ফটো আপলোড করুন",
      "Transparent":"ট্রান্সপারেন্ট","White - Passport":"সাদা - পাসপোর্ট","Blue - Visa":"নীল - ভিসা","Red":"লাল",
      "⬇️ Download HD PNG":"⬇️ HD PNG ডাউনলোড করুন",
      "Why NEXORA No.1 Background Remover in World?":"বিশ্বে NEXORA নং ১ ব্যাকগ্রাউন্ড রিমুভার কেন?"
    }
  };

  const originalTexts = new WeakMap();
  function detectLang(){ const p=navigator.languages||[navigator.language||"en"]; for(const pr of p){ const c=pr.toLowerCase(); const ex=Object.keys(LANGUAGES).find(k=>k.toLowerCase()===c); if(ex) return ex; const b=c.split("-")[0]; if(LANGUAGES[b]) return b; } return "en"; }
  function safeGet(){ try{ const s=localStorage.getItem(STORAGE_KEY); return s && s!=="auto" && LANGUAGES[s] ? s : detectLang(); }catch(e){ return detectLang(); } }
  function getOriginal(n){ if(!originalTexts.has(n)) originalTexts.set(n,n.nodeValue); return originalTexts.get(n); }

  function translatePage(lang){
    if(!LANGUAGES[lang]) lang="en";
    const dict = DICT[lang] || {};
    const walker=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode(node){ const p=node.parentElement; if(!p) return NodeFilter.FILTER_REJECT; if(p.closest("script, style, noscript, textarea, #resultCount, #nexora-language-selector")) return NodeFilter.FILTER_REJECT; if(!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT; return NodeFilter.FILTER_ACCEPT; } });
    let node; const toTranslate=[];
    while(node=walker.nextNode()){ toTranslate.push(node); }
    toTranslate.forEach(n=>{
      const original=getOriginal(n); const key=original.trim(); if(!key) return;
      if(lang==="en"){ n.nodeValue=original; return; }
      let t=dict[key];
      if(!t && key.length>30){ // for long paragraphs, try partial match
        for(const k in dict){ if(key.startsWith(k.substring(0,30))){ t=dict[k]; break; } }
      }
      if(t){ const lead=original.match(/^\s*/)?.[0]||""; const trail=original.match(/\s*$/)?.[0]||""; n.nodeValue=lead+t+trail; }
    });
    // also translate buttons and headings with innerText
    document.querySelectorAll("h1,h2,h3,p,button,a,span,li").forEach(el=>{
      if(el.children.length>0) return;
      const txt=el.textContent.trim(); if(!txt) return; if(dict[txt]) el.textContent=dict[txt];
    });
    document.documentElement.lang=lang;
  }

  function createSelector(){
    if(document.getElementById("nexora-language-selector")) return;
    const style=document.createElement("style"); style.textContent=`#nexora-language-selector{position:fixed;right:14px;bottom:16px;z-index:99999;padding:10px 12px;border:1px solid #d1d5db;border-radius:12px;background:#fff;color:#111827;font-size:14px;max-width:190px;box-shadow:0 4px 18px rgba(0,0,0,.13);cursor:pointer}`;
    document.head.appendChild(style);
    const sel=document.createElement("select"); sel.id="nexora-language-selector";
    const auto=document.createElement("option"); auto.value="auto"; auto.textContent="🌐 Automatic"; sel.appendChild(auto);
    Object.entries(LANGUAGES).forEach(([c,n])=>{ const o=document.createElement("option"); o.value=c; o.textContent=n; sel.appendChild(o); });
    let saved="auto"; try{ saved=localStorage.getItem(STORAGE_KEY)||"auto"; }catch(e){}
    sel.value=LANGUAGES[saved]||saved==="auto" ? saved : "auto";
    sel.addEventListener("change",()=>{ const ch=sel.value; try{ localStorage.setItem(STORAGE_KEY,ch); }catch(e){} const lang=ch==="auto"?detectLang():ch; translatePage(lang); setTimeout(()=>location.reload(),250); });
    document.body.appendChild(sel);
  }
  function start(){
    let saved="auto"; try{ saved=localStorage.getItem(STORAGE_KEY)||"auto"; }catch(e){}
    const urlParams=new URLSearchParams(location.search); const urlLang=urlParams.get('lang');
    let initial=urlLang&&LANGUAGES[urlLang]?urlLang:(saved==="auto"?detectLang():safeGet());
    translatePage(initial); createSelector();
    setTimeout(()=>translatePage(initial), 800);
    setTimeout(()=>translatePage(initial), 2000);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
