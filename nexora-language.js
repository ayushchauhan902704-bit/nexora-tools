"use strict";
/* NEXORA - HOME + IMAGE COMPRESSOR TOOL - 100% ALL LANGUAGES */
(() => {
  const LANGUAGES = {
    en:"🇬🇧 English", hi:"🇮🇳 Hindi", bn:"🇧🇩 Bengali", pt:"🇵🇹 Portuguese",
    es:"🇪🇸 Spanish", id:"🇮🇩 Indonesian", fr:"🇫🇷 French", de:"🇩🇪 German"
  };
  const STORAGE_KEY = "nexora_language";

  const HOME_DICT = {
    hi: {
      "Home":"होम","All Tools":"सभी टूल्स","Guides":"गाइड","About":"हमारे बारे में","Contact":"संपर्क करें","Privacy":"गोपनीयता",
      "Explore Tools →":"टूल्स देखें →","FREE ONLINE TOOLS FOR EVERYDAY TASKS":"रोज़मर्रा के कामों के लिए मुफ्त टूल्स",
      "Get More Done with":"अपने काम आसानी से पूरे करें",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"इमेज, PDF, वीडियो के लिए आसान टूल्स।",
      "Free to use":"मुफ्त इस्तेमाल","Easy to use":"आसान इस्तेमाल","No watermark on supported tools":"वॉटरमार्क नहीं","Mobile friendly":"मोबाइल फ्रेंडली",
      "Search tools... e.g. image compressor, PDF to Word":"टूल खोजें...","Find the right tool quickly by name or task.":"नाम से टूल खोजें।",
      "Online Tools":"ऑनलाइन टूल्स","Free Access":"मुफ्त सुविधा","Online Access":"ऑनलाइन उपलब्ध","Easy":"आसान","To Use":"इस्तेमाल",
      "Explore All Online Tools":"सभी टूल्स देखें","Choose a tool and complete your task in a few simple steps.":"टूल चुनें और काम पूरा करें।","Showing 30 tools":"30 टूल दिखाए जा रहे हैं",
      "Image":"इमेज","PDF":"PDF","Calculators":"कैलकुलेटर","Text & Utilities":"टेक्स्ट और सुविधाएं","Open Tool →":"टूल खोलें →",
      "Background Remover":"बैकग्राउंड हटाएं","Compress Image to Any KB":"इमेज कंप्रेस करें"
    },
    bn: {
      "Home":"হোম","All Tools":"সব টুলস","FREE ONLINE TOOLS FOR EVERYDAY TASKS":"বিনামূল্যে টুলস",
      "Get More Done with":"আপনার কাজ সহজে করুন","Explore All Online Tools":"সমস্ত টুলস দেখুন","Showing 30 tools":"৩০টি টুল","Open Tool →":"টুল খুলুন →",
      "Background Remover":"ব্যাকগ্রাউন্ড রিমুভার","Compress Image to Any KB":"ছবি কম্প্রেস করুন"
    },
    pt: {
      "Home":"Início","All Tools":"Todas Ferramentas","FREE ONLINE TOOLS FOR EVERYDAY TASKS":"FERRAMENTAS GRÁTIS",
      "Get More Done with":"Faça mais com","Explore All Online Tools":"Explorar Todas","Showing 30 tools":"Mostrando 30 ferramentas","Open Tool →":"Abrir Ferramenta →"
    }
  };

  const COMPRESS_DICT = {
    hi: {
      "FREE • IMAGE COMPRESSOR":"फ्री • इमेज कंप्रेसर","← All Tools":"← सभी टूल्स",
      "20KB to 500KB • Browser-Based • No Watermark":"20KB से 500KB • ब्राउज़र में • वॉटरमार्क नहीं",
      "Compress Image to":"इमेज कंप्रेस करें","Target KB":"टारगेट KB",
      "Reduce JPG, PNG and WebP image file sizes online. Choose 20KB, 40KB, 80KB, 100KB, 200KB, 300KB or 500KB, or enter your own target size. Preview and download your result.":"JPG, PNG, WebP इमेज का साइज ऑनलाइन कम करें। 20KB, 50KB, 100KB, 200KB में से चुनें या अपना साइज डालें।",
      "📄 UPSC Form ke liye?":"📄 UPSC फॉर्म के लिए?","20KB photo kaise banaye - Full Guide padho":"20KB फोटो कैसे बनाएं - पूरी गाइड पढ़ें",
      "1. Upload Photo (JPG, PNG, WEBP)":"1. फोटो अपलोड करें (JPG, PNG, WEBP)",
      "Choose an image from your phone, tablet or computer.":"अपने फोन, टैबलेट या कंप्यूटर से इमेज चुनें।",
      "2. Select Target Size":"2. टारगेट साइज चुनें",
      "Custom Target (KB)":"कस्टम टारगेट (KB)","Output Format":"आउटपुट फॉर्मेट",
      "JPG - Best for Forms":"JPG - फॉर्म के लिए बेस्ट","WEBP - Modern Format":"WEBP - नया फॉर्मेट","PNG - Lossless":"PNG - बिना क्वालिटी खोए",
      "The selected KB is a maximum target. Exact file size depends on image dimensions, image content and format.":"चुना गया KB अधिकतम टारगेट है। असली साइज इमेज के आकार और फॉर्मेट पर निर्भर करता है।",
      "Compress Now →":"अभी कंप्रेस करें →","Compress Now":"अभी कंप्रेस करें","Compressing...":"कंप्रेस हो रहा है...",
      "Original Image":"ओरिजिनल इमेज","Compressed Image":"कंप्रेस की गई इमेज",
      "Download Image":"इमेज डाउनलोड करें","Another Photo":"दूसरी फोटो",
      "Free Image Compressor to Reduce Image Size Online":"फ्री इमेज कंप्रेसर - ऑनलाइन साइज कम करें",
      "NEXORA Image Compressor helps you reduce the file size of JPG, PNG and WebP images. Select a target size such as 20KB, 40KB, 80KB, 100KB, 200KB, 300KB or 500KB and download the processed image. You can also enter a custom target size.":"NEXORA इमेज कंप्रेसर JPG, PNG, WebP का साइज कम करता है। 20KB से 500KB तक चुनें और डाउनलोड करें।",
      "How to Compress an Image to 20KB, 100KB or Other Sizes":"20KB, 100KB या अन्य साइज में इमेज कैसे कंप्रेस करें",
      "Why Reduce Image File Size?":"इमेज साइज क्यों कम करें?",
      "Image Compressor Features":"इमेज कंप्रेसर के फीचर्स",
      "JPG, PNG and WebP - Which Format Should You Choose?":"JPG, PNG, WebP - कौन सा फॉर्मेट चुनें?",
      "Image Privacy":"इमेज प्राइवेसी",
      "NEXORA Image Compressor - Features":"NEXORA इमेज कंप्रेसर - फीचर्स",
      "Frequently Asked Questions About Image Compression":"इमेज कंप्रेशन के बारे में पूछे जाने वाले सवाल",
      "NEXORA — Built by Ayush Chauhan":"NEXORA — आयुष चौहान द्वारा बनाया गया",
      "© 2026 NEXORA Tools - Image Compressor":"© 2026 NEXORA Tools - इमेज कंप्रेसर",
      "Made in India 🇮🇳 | Free tools. Simple solutions.":"भारत में बना 🇮🇳 | फ्री टूल्स।",
      "← Back to All Tools":"← सभी टूल्स पर वापस"
    },
    bn: {
      "FREE • IMAGE COMPRESSOR":"ফ্রি • ইমেজ কম্প্রেসর","← All Tools":"← সব টুলস",
      "20KB to 500KB • Browser-Based • No Watermark":"২০KB থেকে ৫০০KB • ব্রাউজারে • ওয়াটারমার্ক নেই",
      "Compress Image to":"ছবি কম্প্রেস করুন","Target KB":"টার্গেট KB",
      "Reduce JPG, PNG and WebP image file sizes online. Choose 20KB, 40KB, 80KB, 100KB, 200KB, 300KB or 500KB, or enter your own target size. Preview and download your result.":"JPG, PNG, WebP ছবির সাইজ অনলাইনে কমান। ২০KB থেকে ৫০০KB বেছে নিন।",
      "📄 UPSC Form ke liye?":"📄 UPSC ফর্মের জন্য?","20KB photo kaise banaye - Full Guide padho":"২০KB ফটো কিভাবে বানাবেন - গাইড পড়ুন",
      "1. Upload Photo (JPG, PNG, WEBP)":"১. ফটো আপলোড করুন",
      "Choose an image from your phone, tablet or computer.":"ফোন বা কম্পিউটার থেকে ছবি বেছে নিন।",
      "2. Select Target Size":"২. টার্গেট সাইজ বেছে নিন",
      "Custom Target (KB)":"কাস্টম টার্গেট (KB)","Output Format":"আউটপুট ফরম্যাট",
      "JPG - Best for Forms":"JPG - ফর্মের জন্য সেরা","WEBP - Modern Format":"WEBP - আধুনিক ফরম্যাট","PNG - Lossless":"PNG - লসলেস",
      "Compress Now →":"এখনই কম্প্রেস করুন →","Original Image":"আসল ছবি","Compressed Image":"কম্প্রেসড ছবি",
      "Download Image":"ছবি ডাউনলোড করুন","Another Photo":"অন্য ফটো",
      "Free Image Compressor to Reduce Image Size Online":"ফ্রি ইমেজ কম্প্রেসর"
    },
    pt: {
      "FREE • IMAGE COMPRESSOR":"GRÁTIS • COMPRESSOR DE IMAGEM","← All Tools":"← Todas Ferramentas",
      "20KB to 500KB • Browser-Based • No Watermark":"20KB a 500KB • No navegador • Sem marca d'água",
      "Compress Image to":"Comprimir Imagem para","Target KB":"KB Alvo",
      "Reduce JPG, PNG and WebP image file sizes online. Choose 20KB, 40KB, 80KB, 100KB, 200KB, 300KB or 500KB, or enter your own target size. Preview and download your result.":"Reduza o tamanho de imagens JPG, PNG e WebP online. Escolha 20KB a 500KB ou digite seu tamanho.",
      "📄 UPSC Form ke liye?":"📄 Para formulário UPSC?","20KB photo kaise banaye - Full Guide padho":"Como criar foto de 20KB - Leia o guia completo",
      "1. Upload Photo (JPG, PNG, WEBP)":"1. Carregar Foto (JPG, PNG, WEBP)",
      "Choose an image from your phone, tablet or computer.":"Escolha uma imagem do seu celular ou computador.",
      "2. Select Target Size":"2. Selecione o Tamanho Alvo",
      "Custom Target (KB)":"Alvo Personalizado (KB)","Output Format":"Formato de Saída",
      "JPG - Best for Forms":"JPG - Melhor para formulários","WEBP - Modern Format":"WEBP - Formato Moderno","PNG - Lossless":"PNG - Sem perdas",
      "The selected KB is a maximum target. Exact file size depends on image dimensions, image content and format.":"O KB selecionado é um alvo máximo. O tamanho exato depende das dimensões e formato.",
      "Compress Now →":"Comprimir Agora →","Original Image":"Imagem Original","Compressed Image":"Imagem Comprimida",
      "Download Image":"Baixar Imagem","Another Photo":"Outra Foto",
      "Free Image Compressor to Reduce Image Size Online":"Compressor de Imagem Grátis Online"
    }
  };

  const originalTexts = new WeakMap();
  function detectLang(){
    const p=navigator.languages||[navigator.language||"en"];
    for(const pr of p){
      const c=pr.toLowerCase();
      const ex=Object.keys(LANGUAGES).find(k=>k.toLowerCase()===c);
      if(ex) return ex;
      const b=c.split("-")[0];
      if(LANGUAGES[b]) return b;
    }
    return "en";
  }
  function safeGet(){try{const s=localStorage.getItem(STORAGE_KEY);return s&&s!=="auto"&&LANGUAGES[s]?s:detectLang();}catch(e){return detectLang();}}
  function getOriginal(n){if(!originalTexts.has(n))originalTexts.set(n,n.nodeValue);return originalTexts.get(n);}

  function getDict(lang){
    let dict = {...(HOME_DICT[lang]||{})};
    const path = location.pathname.toLowerCase();
    if(path.includes("compress-image")){
      Object.assign(dict, COMPRESS_DICT[lang]||{});
    }
    return dict;
  }

  function translatePage(lang){
    if(!LANGUAGES[lang]) lang="en";
    const dict = getDict(lang);
    const walker=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const p=node.parentElement;
        if(!p) return NodeFilter.FILTER_REJECT;
        if(p.closest("script, style, noscript, textarea, #resultCount, #nexora-language-selector")) return NodeFilter.FILTER_REJECT;
        if(!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node; const list=[];
    while(node=walker.nextNode()){list.push(node);}
    list.forEach(n=>{
      const original=getOriginal(n);
      const key=original.trim();
      if(!key) return;
      if(lang==="en"){n.nodeValue=original;return;}
      // Exact match first
      let t=dict[key];
      // Try partial for long sentences
      if(!t && key.length>30){
        for(const k in dict){
          if(key.startsWith(k.substring(0,25)) && k.length>20){
            t=dict[k]; break;
          }
        }
      }
      if(t){
        const lead=original.match(/^\s*/)?.[0]||"";
        const trail=original.match(/\s*$/)?.[0]||"";
        n.nodeValue=lead+t+trail;
      }
    });
    document.documentElement.lang=lang;
  }

  function createSelector(){
    if(document.getElementById("nexora-language-selector")) return;
    const style=document.createElement("style");
    style.textContent=`#nexora-language-selector{position:fixed;right:14px;bottom:16px;z-index:99999;padding:10px 12px;border:1px solid #d1d5db;border-radius:12px;background:#fff;color:#111827;font-size:14px;max-width:190px;box-shadow:0 4px 18px rgba(0,0,0,.13);cursor:pointer}`;
    document.head.appendChild(style);
    const sel=document.createElement("select");
    sel.id="nexora-language-selector";
    const auto=document.createElement("option");auto.value="auto";auto.textContent="🌐 Automatic";sel.appendChild(auto);
    Object.entries(LANGUAGES).forEach(([c,n])=>{const o=document.createElement("option");o.value=c;o.textContent=n;sel.appendChild(o);});
    let saved="auto";try{saved=localStorage.getItem(STORAGE_KEY)||"auto";}catch(e){}
    sel.value=LANGUAGES[saved]||saved==="auto"?saved:"auto";
    sel.addEventListener("change",()=>{
      const ch=sel.value;
      try{localStorage.setItem(STORAGE_KEY,ch);}catch(e){}
      const lang=ch==="auto"?detectLang():ch;
      translatePage(lang);
      setTimeout(()=>location.reload(),250);
    });
    document.body.appendChild(sel);
  }

  function start(){
    let saved="auto";try{saved=localStorage.getItem(STORAGE_KEY)||"auto";}catch(e){}
    const urlParams=new URLSearchParams(location.search);
    const urlLang=urlParams.get('lang');
    let initial=urlLang&&LANGUAGES[urlLang]?urlLang:(saved==="auto"?detectLang():safeGet());
    translatePage(initial);
    createSelector();
    setTimeout(()=>translatePage(initial),800);
    setTimeout(()=>translatePage(initial),2000);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start);
  else start();
})();
