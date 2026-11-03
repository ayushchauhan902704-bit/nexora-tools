"use strict";
/* NEXORA - FINAL 100% - ALL 30 TOOLS + BG REMOVER */
(() => {
  const LANGUAGES = { en:"🇬🇧 English", hi:"🇮🇳 Hindi", bn:"🇧🇩 Bengali", pt:"🇵🇹 Portuguese" };
  const STORAGE_KEY = "nexora_language";
  const DICT = {
    hi: {
      "Home":"होम","All Tools":"सभी टूल्स","Guides":"गाइड","About":"हमारे बारे में","Contact":"संपर्क करें","Privacy":"गोपनीयता","Explore Tools →":"टूल्स देखें →",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS":"रोज़मर्रा के कामों के लिए मुफ्त ऑनलाइन टूल्स",
      "Get More Done with":"अपने काम आसानी से पूरे करें","NEXORA Tools":"NEXORA टूल्स",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"इमेज, PDF, वीडियो, टेक्स्ट के लिए आसान टूल्स। फाइल कंप्रेस करें, फोटो बनाएं।",
      "Free to use":"मुफ्त इस्तेमाल","Easy to use":"आसान इस्तेमाल","No watermark on supported tools":"वॉटरमार्क नहीं","Mobile friendly":"मोबाइल फ्रेंडली",
      "Search tools... e.g. image compressor, PDF to Word":"टूल खोजें... जैसे इमेज कंप्रेसर",
      "Find the right tool quickly by name or task.":"नाम या काम से सही टूल खोजें।",
      "30":"30","Online Tools":"ऑनलाइन टूल्स","100%":"100%","Free Access":"मुफ्त सुविधा","24/7":"24/7","Online Access":"ऑनलाइन उपलब्ध","Easy":"आसान","To Use":"इस्तेमाल",
      "Explore All Online Tools":"सभी टूल्स देखें","Choose a tool and complete your task in a few simple steps.":"टूल चुनें और आसान चरणों में काम पूरा करें।",
      "Showing 30 tools":"30 टूल दिखाए जा रहे हैं","Image":"इमेज","PDF":"PDF","Calculators":"कैलकुलेटर","Text & Utilities":"टेक्स्ट और सुविधाएं","Open Tool →":"टूल खोलें →","All Tools":"सभी टूल्स",
      "Image DPI Changer - 72 to 300 DPI":"इमेज DPI बदलें - 72 से 300 DPI","Change image DPI from 72 to 300 DPI for printing without losing quality.":"प्रिंटिंग के लिए DPI बदलें, क्वालिटी वैसी ही रहेगी।",
      "Internet Speed Test - Pro":"इंटरनेट स्पीड टेस्ट - प्रो","Check your internet download speed, upload speed and ping.":"इंटरनेट की डाउनलोड स्पीड, अपलोड स्पीड और पिंग चेक करें।",
      "Image to Text - OCR":"इमेज से टेक्स्ट - OCR","Extract readable text from supported JPG and PNG images.":"JPG और PNG इमेज से टेक्स्ट निकालें।",
      "Video Compressor to Any MB":"किसी भी MB में वीडियो कंप्रेसर","Compress videos with custom target file-size options.":"अपनी पसंद के साइज में वीडियो कंप्रेस करें।",
      "Text to Speech":"टेक्स्ट से आवाज़","Convert written text into speech using supported browser voices.":"टेक्स्ट को आवाज़ में बदलें।",
      "YouTube Thumbnail Downloader":"YouTube थंबनेल डाउनलोडर","Get available YouTube video thumbnail images.":"YouTube थंबनेल पाएं।",
      "Love Calculator":"लव कैलकुलेटर","Try a fun name-based compatibility calculation.":"नाम से लव कैलकुलेशन करें।",
      "Passport Photo Maker":"पासपोर्ट फोटो मेकर","Prepare passport and document photos in supported sizes.":"पासपोर्ट और डॉक्यूमेंट फोटो तैयार करें।",
      "Background Remover":"बैकग्राउंड हटाएं","Remove or change image backgrounds with available options.":"इमेज का बैकग्राउंड हटाएं या बदलें।",
      "Compress Image to Any KB":"किसी भी KB में इमेज कंप्रेस करें","Reduce image file size for different upload requirements.":"अलग-अलग जरूरतों के लिए इमेज साइज कम करें।",
      "JPG to PDF Converter":"JPG से PDF कन्वर्टर","Combine supported image files into a PDF document.":"इमेज फाइलों को PDF में जोड़ें।",
      "PDF to JPG Converter":"PDF से JPG कन्वर्टर","Convert PDF pages into downloadable JPG images.":"PDF पेज को JPG में बदलें।",
      "Instagram Reels Downloader":"Instagram Reels डाउनलोडर","Access available Instagram Reels download functionality.":"Instagram Reels डाउनलोड करें।",
      "QR Code Generator":"QR कोड जनरेटर","Create QR codes for supported links, text and Wi-Fi details.":"लिंक, टेक्स्ट के लिए QR कोड बनाएं।",
      "PDF to Word":"PDF से Word","Convert supported PDF documents into editable Word files.":"PDF को एडिट होने वाले Word में बदलें।",
      "Word to PDF":"Word से PDF","Convert supported Word documents into PDF format.":"Word को PDF में बदलें।",
      "PDF Merge & Split":"PDF जोड़ें और अलग करें","Combine PDF documents or split them into separate pages.":"PDF जोड़ें या अलग-अलग पेज में बांटें।",
      "Image to Word - OCR":"इमेज से Word - OCR","Extract text from supported images and scanned documents.":"इमेज और स्कैन डॉक्यूमेंट से टेक्स्ट निकालें।",
      "BMI Calculator":"BMI कैलकुलेटर","Calculate body mass index using height and weight.":"लंबाई और वजन से BMI निकालें।",
      "Age Calculator":"उम्र कैलकुलेटर","Calculate age in years, months and days from date of birth.":"जन्मतिथि से उम्र निकालें।",
      "Loan EMI Calculator":"लोन EMI कैलकुलेटर","Estimate monthly loan payments, interest and total repayment.":"मासिक लोन किस्त का अनुमान लगाएं।",
      "Percentage Calculator":"प्रतिशत कैलकुलेटर","Calculate percentages, percentage changes and values.":"प्रतिशत निकालें।",
      "Discount Calculator":"डिस्काउंट कैलकुलेटर","Calculate discounted prices and total savings.":"छूट के बाद कीमत निकालें।",
      "Date Difference Calculator":"तारीख अंतर कैलकुलेटर","Find the number of days between two selected dates.":"दो तारीखों के बीच दिन निकालें।",
      "Word Counter":"शब्द गिनें","Count words, characters, sentences and text length.":"शब्द, अक्षर, वाक्य गिनें।",
      "Character Counter":"अक्षर गिनें","Count characters with and without spaces.":"स्पेस के साथ और बिना अक्षर गिनें।",
      "AI Text Humanizer":"AI टेक्स्ट ह्यूमनाइज़र","Rewrite text to create a more natural writing style.":"टेक्स्ट को स्वाभाविक बनाएं।",
      "Unit Converter":"यूनिट कन्वर्टर","Convert length, weight, temperature and other common units.":"लंबाई, वजन, तापमान बदलें।",
      "Password Generator":"पासवर्ड जनरेटर","Generate random passwords with customizable options.":"मजबूत पासवर्ड बनाएं।",
      "Resume Builder":"रिज्यूमे बिल्डर","Create a professional resume and download your document.":"प्रोफेशनल रिज्यूमे बनाएं और डाउनलोड करें।",
      "Speed Test":"स्पीड टेस्ट","Easy to Use":"इस्तेमाल में आसान","Text Extraction":"टेक्स्ट निकालना","Audio Support":"ऑडियो सपोर्ट","Multiple Languages":"कई भाषाएं","Thumbnails":"थंबनेल","HD Options":"HD विकल्प","Photo Sizes":"फोटो साइज","Custom Options":"कस्टम विकल्प","Background Editing":"बैकग्राउंड एडिटिंग","Image Tool":"इमेज टूल","Target KB":"लक्षित KB","Image Compression":"इमेज कंप्रेशन","Multiple Images":"कई इमेज","PDF Export":"PDF एक्सपोर्ट","PDF Conversion":"PDF कन्वर्जन","Image Export":"इमेज एक्सपोर्ट","QR Generator":"QR जनरेटर","Download":"डाउनलोड","DOCX":"DOCX","Merge PDF":"PDF जोड़ें","Split PDF":"PDF अलग करें","Word Export":"Word एक्सपोर्ट","Health":"स्वास्थ्य","Calculator":"कैलकुलेटर","DOB":"जन्मतिथि","Finance":"वित्त","EMI":"EMI","Percentage":"प्रतिशत","Discount":"छूट","Savings":"बचत","Dates":"तारीखें","Duration":"अवधि","Word Count":"शब्द गिनती","Instant":"तुरंत","Character Count":"अक्षर गिनती","Text":"टेक्स्ट","AI Writing":"AI लेखन","Security":"सुरक्षा","Generator":"जनरेटर","PDF Download":"PDF डाउनलोड","RESUME":"रिज्यूमे",
      "Background Remover - Remove Background Free HD No Watermark | NEXORA":"बैकग्राउंड हटाएं - फ्री HD वॉटरमार्क नहीं | NEXORA",
      "Remove background in 1 second - Transparent, White, Blue, Red — No Watermark, HD, Private":"1 सेकंड में बैकग्राउंड हटाएं - ट्रांसपेरेंट, सफेद, नीला, लाल - वॉटरमार्क नहीं, HD, प्राइवेट",
      "📁 Click or Drag Photo Here":"📁 फोटो यहाँ क्लिक करें या खींचें","Upload a photo to start":"फोटो अपलोड करके शुरू करें",
      "Transparent":"ट्रांसपेरेंट","White - Passport":"सफेद - पासपोर्ट","Blue - Visa":"नीला - वीजा","Red":"लाल","⬇️ Download HD PNG":"⬇️ HD PNG डाउनलोड करें",
      "Why NEXORA No.1 Background Remover in World?":"दुनिया में NEXORA नंबर 1 बैकग्राउंड रिमूवर क्यों है?",
      "Features - Why World Loves NEXORA":"फीचर्स - दुनिया NEXORA को क्यों पसंद करती है","NEXORA vs Others - Comparison":"NEXORA vs अन्य - तुलना","FAQ - Background Remover - Google Loves This":"FAQ - बैकग्राउंड रिमूवर"
    },
    bn: {
      "Home":"হোম","All Tools":"সব টুলস","Explore Tools →":"টুলস দেখুন →","FREE ONLINE TOOLS FOR EVERYDAY TASKS":"দৈনন্দিন কাজের জন্য বিনামূল্যে টুলস",
      "Get More Done with":"আপনার কাজ সহজে করুন","Showing 30 tools":"৩০টি টুল দেখানো হচ্ছে","Open Tool →":"টুল খুলুন →",
      "Background Remover":"ব্যাকগ্রাউন্ড রিমুভার","Remove or change image backgrounds with available options.":"ছবির ব্যাকগ্রাউন্ড সরান বা পরিবর্তন করুন।",
      "Compress Image to Any KB":"যেকোনো KB তে ছবি কম্প্রেস করুন","Reduce image file size for different upload requirements.":"বিভিন্ন প্রয়োজনে ছবির সাইজ কমান।",
      "Remove background in 1 second - Transparent, White, Blue, Red — No Watermark, HD, Private":"১ সেকেন্ডে ব্যাকগ্রাউন্ড সরান - ট্রান্সপারেন্ট, সাদা, নীল, লাল - ওয়াটারমার্ক নেই",
      "📁 Click or Drag Photo Here":"📁 ফটো এখানে ক্লিক করুন","Upload a photo to start":"ফটো আপলোড করে শুরু করুন","Transparent":"ট্রান্সপারেন্ট","White - Passport":"সাদা - পাসপোর্ট","Blue - Visa":"নীল - ভিসা","Red":"লাল","⬇️ Download HD PNG":"⬇️ HD PNG ডাউনলোড করুন","Why NEXORA No.1 Background Remover in World?":"বিশ্বে NEXORA নং ১ ব্যাকগ্রাউন্ড রিমুভার কেন?"
    }
  };
  const originalTexts = new WeakMap();
  function detectLang(){ const p=navigator.languages||[navigator.language||"en"]; for(const pr of p){ const c=pr.toLowerCase(); const ex=Object.keys(LANGUAGES).find(k=>k.toLowerCase()===c); if(ex) return ex; const b=c.split("-")[0]; if(LANGUAGES[b]) return b; } return "en"; }
  function safeGet(){ try{ const s=localStorage.getItem(STORAGE_KEY); return s && s!=="auto" && LANGUAGES[s] ? s : detectLang(); }catch(e){ return detectLang(); } }
  function getOriginal(n){ if(!originalTexts.has(n)) originalTexts.set(n,n.nodeValue); return originalTexts.get(n); }
  function translatePage(lang){
    if(!LANGUAGES[lang]) lang="en"; const dict=DICT[lang]||{}; 
    const walker=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode(node){ const p=node.parentElement; if(!p) return NodeFilter.FILTER_REJECT; if(p.closest("script, style, noscript, textarea, #resultCount, #nexora-language-selector")) return NodeFilter.FILTER_REJECT; if(!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT; return NodeFilter.FILTER_ACCEPT; } });
    let node; const list=[]; while(node=walker.nextNode()){ list.push(node); }
    list.forEach(n=>{
      const original=getOriginal(n); const key=original.trim(); if(!key) return;
      if(lang==="en"){ n.nodeValue=original; return; }
      let t=dict[key];
      if(!t && key.length>15){ for(const k in dict){ if(key===k || key.includes(k) && k.length>10){ if(dict[k].length>0){ t=dict[k]; break; } } } }
      if(t){ const lead=original.match(/^\s*/)?.[0]||""; const trail=original.match(/\s*$/)?.[0]||""; n.nodeValue=lead+t+trail; }
    });
    document.querySelectorAll("h1,h2,h3,p,button,a,span,div,li,td,th").forEach(el=>{
      if(el.children.length>0) return; const txt=el.textContent.trim(); if(!txt) return; if(dict[txt]) el.textContent=dict[txt];
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
    setTimeout(()=>translatePage(initial), 800); setTimeout(()=>translatePage(initial), 2000);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
