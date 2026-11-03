"use strict";
/* NEXORA - HOME PAGE 100% - HI + BN + PT - NO TOOLS YET */
(() => {
  const LANGUAGES = { en:"🇬🇧 English", hi:"🇮🇳 Hindi", bn:"🇧🇩 Bengali", pt:"🇵🇹 Portuguese" };
  const STORAGE_KEY = "nexora_language";
  
  const DICT = {
    hi: {
      "Home":"होम","All Tools":"सभी टूल्स","Guides":"गाइड","About":"हमारे बारे में","Contact":"संपर्क करें","Privacy":"गोपनीयता",
      "Explore Tools →":"टूल्स देखें →","Explore Tools":"टूल्स देखें",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS":"रोज़मर्रा के कामों के लिए मुफ्त ऑनलाइन टूल्स",
      "Get More Done with":"अपने काम आसानी से पूरे करें",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"इमेज, PDF, वीडियो, टेक्स्ट के लिए आसान टूल्स। फाइल कंप्रेस करें, फोटो बनाएं और अपना काम आसानी से करें।",
      "Free to use":"मुफ्त इस्तेमाल","Easy to use":"आसान इस्तेमाल","No watermark on supported tools":"वॉटरमार्क नहीं","Mobile friendly":"मोबाइल फ्रेंडली",
      "Search tools... e.g. image compressor, PDF to Word":"टूल खोजें... जैसे इमेज कंप्रेसर, PDF से Word",
      "Find the right tool quickly by name or task.":"नाम या काम से सही टूल जल्दी खोजें।",
      "30":"30","Online Tools":"ऑनलाइन टूल्स","100%":"100%","Free Access":"मुफ्त सुविधा","24/7":"24/7","Online Access":"ऑनलाइन उपलब्ध","Easy":"आसान","To Use":"इस्तेमाल",
      "Explore All Online Tools":"सभी ऑनलाइन टूल्स देखें","Choose a tool and complete your task in a few simple steps.":"एक टूल चुनें और कुछ आसान चरणों में अपना काम पूरा करें।","Choose a tool and complete your task in a few single steps.":"एक टूल चुनें और कुछ आसान चरणों में अपना काम पूरा करें।",
      "Showing 30 tools":"30 टूल दिखाए जा रहे हैं","All Tools":"सभी टूल्स","Image":"इमेज","PDF":"PDF","Calculators":"कैलकुलेटर","Text & Utilities":"टेक्स्ट और सुविधाएं","Open Tool →":"टूल खोलें →",
      "Image DPI Changer - 72 to 300 DPI":"इमेज DPI बदलें - 72 से 300 DPI","Change image DPI from 72 to 300 DPI for printing without losing quality.":"प्रिंटिंग के लिए DPI बदलें, क्वालिटी वैसी ही रहेगी।","300 DPI":"300 DPI","No Watermark":"वॉटरमार्क नहीं",
      "Internet Speed Test - Pro":"इंटरनेट स्पीड टेस्ट - प्रो","Check your internet download speed, upload speed and ping.":"इंटरनेट की डाउनलोड, अपलोड स्पीड और पिंग चेक करें।","Speed Test":"स्पीड टेस्ट","Easy to Use":"इस्तेमाल में आसान",
      "Image to Text - OCR":"इमेज से टेक्स्ट - OCR","Extract readable text from supported JPG and PNG images.":"JPG और PNG इमेज से टेक्स्ट निकालें।","OCR":"OCR","Text Extraction":"टेक्स्ट निकालना",
      "Video Compressor to Any MB":"किसी भी MB में वीडियो कंप्रेसर","Compress videos with custom target file-size options.":"अपनी पसंद के साइज में वीडियो कंप्रेस करें।","Video":"वीडियो","Audio Support":"ऑडियो सपोर्ट",
      "Text to Speech":"टेक्स्ट से आवाज़","Convert written text into speech using supported browser voices.":"टेक्स्ट को आवाज़ में बदलें।","Text to Speech":"टेक्स्ट से आवाज़","Multiple Languages":"कई भाषाएं",
      "YouTube Thumbnail Downloader":"YouTube थंबनेल डाउनलोडर","Get available YouTube video thumbnail images.":"YouTube थंबनेल पाएं।","Thumbnails":"थंबनेल","HD Options":"HD विकल्प",
      "Love Calculator":"लव कैलकुलेटर","Try a fun name-based compatibility calculation.":"नाम से लव कैलकुलेशन करें।","Fun Tool":"फन टूल","Entertainment":"मनोरंजन",
      "Passport Photo Maker":"पासपोर्ट फोटो मेकर","Prepare passport and document photos in supported sizes.":"पासपोर्ट फोटो तैयार करें।","Photo Sizes":"फोटो साइज","Custom Options":"कस्टम विकल्प",
      "Background Remover":"बैकग्राउंड हटाएं","Remove or change image backgrounds with available options.":"बैकग्राउंड हटाएं या बदलें।","Background Editing":"बैकग्राउंड एडिटिंग","Image Tool":"इमेज टूल",
      "Compress Image to Any KB":"किसी भी KB में इमेज कंप्रेस करें","Reduce image file size for different upload requirements.":"इमेज साइज कम करें।","Target KB":"टारगेट KB","Image Compression":"इमेज कंप्रेशन",
      "JPG to PDF Converter":"JPG से PDF कन्वर्टर","Combine supported image files into a PDF document.":"इमेज को PDF में जोड़ें।","Multiple Images":"कई इमेज","PDF Export":"PDF एक्सपोर्ट",
      "PDF to JPG Converter":"PDF से JPG कन्वर्टर","Convert PDF pages into downloadable JPG images.":"PDF को JPG में बदलें।","PDF Conversion":"PDF कन्वर्जन","Image Export":"इमेज एक्सपोर्ट",
      "Instagram Reels Downloader":"Instagram Reels डाउनलोडर","Access available Instagram Reels download functionality.":"Instagram Reels डाउनलोड करें।","Instagram":"Instagram","Video":"वीडियो",
      "QR Code Generator":"QR कोड जनरेटर","Create QR codes for supported links, text and Wi-Fi details.":"QR कोड बनाएं।","QR Generator":"QR जनरेटर","Download":"डाउनलोड",
      "PDF to Word":"PDF से Word","Convert supported PDF documents into editable Word files.":"PDF को Word में बदलें।","DOCX":"DOCX","PDF Conversion":"PDF कन्वर्जन",
      "Word to PDF":"Word से PDF","Convert supported Word documents into PDF format.":"Word को PDF में बदलें।",
      "PDF Merge & Split":"PDF जोड़ें और अलग करें","Combine PDF documents or split them into separate pages.":"PDF जोड़ें या अलग करें।","Merge PDF":"PDF जोड़ें","Split PDF":"PDF अलग करें",
      "Image to Word - OCR":"इमेज से Word - OCR","Extract text from supported images and scanned documents.":"इमेज से टेक्स्ट निकालें।","OCR":"OCR","Word Export":"Word एक्सपोर्ट",
      "BMI Calculator":"BMI कैलकुलेटर","Calculate body mass index using height and weight.":"BMI निकालें।","Health":"स्वास्थ्य","Calculator":"कैलकुलेटर",
      "Age Calculator":"उम्र कैलकुलेटर","Calculate age in years, months and days from date of birth.":"उम्र निकालें।","DOB":"जन्मतिथि","Calculator":"कैलकुलेटर",
      "Loan EMI Calculator":"लोन EMI कैलकुलेटर","Estimate monthly loan payments, interest and total repayment.":"EMI निकालें।","EMI":"EMI","Finance":"वित्त",
      "Percentage Calculator":"प्रतिशत कैलकुलेटर","Calculate percentages, percentage changes and values.":"प्रतिशत निकालें।","Percentage":"प्रतिशत",
      "Discount Calculator":"डिस्काउंट कैलकुलेटर","Calculate discounted prices and total savings.":"डिस्काउंट निकालें।","Discount":"छूट","Savings":"बचत",
      "Date Difference Calculator":"तारीख अंतर कैलकुलेटर","Find the number of days between two selected dates.":"दिन गिनें।","Dates":"तारीखें","Duration":"अवधि",
      "Word Counter":"शब्द काउंटर","Count words, characters, sentences and text length.":"शब्द गिनें।","Word Count":"शब्द गिनती","Instant":"तुरंत",
      "Character Counter":"अक्षर काउंटर","Count characters with and without spaces.":"अक्षर गिनें।",
      "AI Text Humanizer":"AI ह्यूमनाइज़र","Rewrite text to create a more natural writing style.":"टेक्स्ट को नेचुरल बनाएं।",
      "Unit Converter":"यूनिट कन्वर्टर","Convert length, weight, temperature and other common units.":"यूनिट बदलें।","Multiple Units":"कई यूनिट",
      "Password Generator":"पासवर्ड जनरेटर","Generate random passwords with customizable options.":"पासवर्ड बनाएं।",
      "Resume Builder":"रिज्यूमे बिल्डर","Create a professional resume and download your document.":"रिज्यूमे बनाएं।",
      "Image Compression Guides":"इमेज कंप्रेशन गाइड","Learn how to prepare images for different file-size requirements using simple step-by-step guides.":"अलग-अलग साइज के लिए इमेज कैसे तैयार करें।",
      "Photo to 20KB - UPSC Guide":"फोटो 20KB - UPSC गाइड","Compress Image to 30KB":"इमेज 30KB में कंप्रेस करें","Compress Image to 50KB":"इमेज 50KB में कंप्रेस करें","Compress Image to 100KB":"इमेज 100KB में","Compress Image to 200KB":"इमेज 200KB में","Compress Image to 500KB":"इमेज 500KB में",
      "Free Online Tools for Everyday Tasks":"रोज़मर्रा के कामों के लिए मुफ्त टूल्स",
      "NEXORA brings together useful online tools for working with images, PDF documents, videos, text and everyday calculations. Whether you need to compress a photo, convert a document, extract text from an image, prepare a passport photo or calculate a value, you can explore the available tools in one place.":"NEXORA इमेज, PDF, वीडियो, टेक्स्ट के लिए उपयोगी टूल्स एक जगह लाता है। फोटो कंप्रेस करें, डॉक्यूमेंट बदलें, पासपोर्ट फोटो बनाएं।",
      "Each tool has its own features and supported formats. Processing methods, file limits and browser requirements may vary depending on the tool. Check the instructions on each tool page before using it.":"हर टूल के अपने फीचर्स हैं। इस्तेमाल से पहले टूल पेज पर निर्देश देखें।"
    },
    bn: {
      "Home":"হোম","All Tools":"সব টুলস","Guides":"গাইড","About":"আমাদের সম্পর্কে","Contact":"যোগাযোগ","Privacy":"গোপনীয়তা","Explore Tools →":"টুলস দেখুন →","Explore Tools":"টুলস দেখুন",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS":"দৈনন্দিন কাজের জন্য বিনামূল্যে টুলস",
      "Get More Done with":"আপনার কাজ সহজে করুন",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"ছবি, PDF, ভিডিও, টেক্সট এর জন্য সহজ টুলস। ফাইল কম্প্রেস করুন, ফটো তৈরি করুন।",
      "Free to use":"বিনামূল্যে ব্যবহার","Easy to use":"ব্যবহার সহজ","No watermark on supported tools":"ওয়াটারমার্ক নেই","Mobile friendly":"মোবাইল ফ্রেন্ডলি",
      "Search tools... e.g. image compressor, PDF to Word":"টুল খুঁজুন... যেমন ইমেজ কম্প্রেসর",
      "Find the right tool quickly by name or task.":"নাম বা কাজ দিয়ে দ্রুত টুল খুঁজুন।",
      "30":"৩০","Online Tools":"অনলাইন টুলস","100%":"১০০%","Free Access":"ফ্রি এক্সেস","24/7":"২৪/৭","Online Access":"অনলাইন এক্সেস","Easy":"সহজ","To Use":"ব্যবহার",
      "Explore All Online Tools":"সমস্ত অনলাইন টুলস দেখুন","Choose a tool and complete your task in a few simple steps.":"একটি টুল বেছে নিন এবং সহজ ধাপে কাজ শেষ করুন।","Choose a tool and complete your task in a few single steps.":"একটি টুল বেছে নিন এবং সহজ ধাপে কাজ শেষ করুন।",
      "Showing 30 tools":"৩০টি টুল দেখানো হচ্ছে","All Tools":"সব টুলস","Image":"ছবি","PDF":"PDF","Calculators":"ক্যালকুলেটর","Text & Utilities":"টেক্সট ও ইউটিলিটি","Open Tool →":"টুল খুলুন →",
      "Image DPI Changer - 72 to 300 DPI":"ইমেজ DPI পরিবর্তনকারী - ৭২ থেকে ৩০০ DPI","Change image DPI from 72 to 300 DPI for printing without losing quality.":"প্রিন্টিং এর জন্য DPI পরিবর্তন করুন।","300 DPI":"৩০০ DPI","No Watermark":"ওয়াটারমার্ক নেই",
      "Internet Speed Test - Pro":"ইন্টারনেট স্পিড টেস্ট - প্রো","Check your internet download speed, upload speed and ping.":"ডাউনলোড, আপলোড স্পিড এবং পিং চেক করুন।",
      "Image to Text - OCR":"ছবি থেকে টেক্সট - OCR","Extract readable text from supported JPG and PNG images.":"JPG, PNG ছবি থেকে টেক্সট বের করুন।",
      "Video Compressor to Any MB":"যেকোনো MB তে ভিডিও কম্প্রেসর","Compress videos with custom target file-size options.":"ভিডিও কম্প্রেস করুন।",
      "Text to Speech":"টেক্সট থেকে স্পিচ","Convert written text into speech using supported browser voices.":"টেক্সটকে ভয়েসে রূপান্তর করুন।",
      "YouTube Thumbnail Downloader":"YouTube থাম্বনেইল ডাউনলোডার","Get available YouTube video thumbnail images.":"YouTube থাম্বনেইল পান।",
      "Love Calculator":"লাভ ক্যালকুলেটর","Try a fun name-based compatibility calculation.":"লাভ ক্যালকুলেশন করুন।",
      "Passport Photo Maker":"পাসপোর্ট ফটো মেকার","Prepare passport and document photos in supported sizes.":"পাসপোর্ট ফটো তৈরি করুন।",
      "Background Remover":"ব্যাকগ্রাউন্ড রিমুভার","Remove or change image backgrounds with available options.":"ব্যাকগ্রাউন্ড সরান।",
      "Compress Image to Any KB":"যেকোনো KB তে ছবি কম্প্রেস করুন","Reduce image file size for different upload requirements.":"ছবির সাইজ কমান।",
      "JPG to PDF Converter":"JPG থেকে PDF","Combine supported image files into a PDF document.":"ছবি PDF এ যোগ করুন।",
      "PDF to JPG Converter":"PDF থেকে JPG","Convert PDF pages into downloadable JPG images.":"PDF কে JPG তে পরিবর্তন করুন।",
      "Instagram Reels Downloader":"Instagram Reels ডাউনলোডার","Access available Instagram Reels download functionality.":"Reels ডাউনলোড করুন।",
      "QR Code Generator":"QR কোড জেনারেটর","Create QR codes for supported links, text and Wi-Fi details.":"QR কোড তৈরি করুন।",
      "PDF to Word":"PDF থেকে Word","Convert supported PDF documents into editable Word files.":"PDF কে Word এ পরিবর্তন করুন।",
      "Word to PDF":"Word থেকে PDF","Convert supported Word documents into PDF format.":"Word কে PDF এ পরিবর্তন করুন।",
      "PDF Merge & Split":"PDF যোগ ও আলাদা করুন","Combine PDF documents or split them into separate pages.":"PDF যোগ বা আলাদা করুন।",
      "Image to Word - OCR":"ছবি থেকে Word","Extract text from supported images and scanned documents.":"ছবি থেকে টেক্সট বের করুন।",
      "BMI Calculator":"BMI ক্যালকুলেটর","Calculate body mass index using height and weight.":"BMI নির্ণয় করুন।",
      "Age Calculator":"বয়স ক্যালকুলেটর","Calculate age in years, months and days from date of birth.":"বয়স নির্ণয় করুন।",
      "Loan EMI Calculator":"লোন EMI ক্যালকুলেটর","Estimate monthly loan payments, interest and total repayment.":"EMI নির্ণয় করুন।",
      "Percentage Calculator":"শতাংশ ক্যালকুলেটর","Calculate percentages, percentage changes and values.":"শতাংশ নির্ণয় করুন।",
      "Discount Calculator":"ডিসকাউন্ট ক্যালকুলেটর","Calculate discounted prices and total savings.":"ডিসকাউন্ট নির্ণয় করুন।",
      "Date Difference Calculator":"তারিখ পার্থক্য ক্যালকুলেটর","Find the number of days between two selected dates.":"দিন গণনা করুন।",
      "Word Counter":"শব্দ গণনা","Count words, characters, sentences and text length.":"শব্দ গণনা করুন।",
      "Character Counter":"অক্ষর গণনা","Count characters with and without spaces.":"অক্ষর গণনা করুন।",
      "AI Text Humanizer":"AI হিউম্যানাইজার","Rewrite text to create a more natural writing style.":"টেক্সট স্বাভাবিক করুন।",
      "Unit Converter":"ইউনিট কনভার্টার","Convert length, weight, temperature and other common units.":"ইউনিট পরিবর্তন করুন।",
      "Password Generator":"পাসওয়ার্ড জেনারেটর","Generate random passwords with customizable options.":"পাসওয়ার্ড তৈরি করুন।",
      "Resume Builder":"রিজিউম বিল্ডার","Create a professional resume and download your document.":"রিজিউম তৈরি করুন।"
    },
    pt: {
      "Home":"Início","All Tools":"Todas Ferramentas","Guides":"Guias","About":"Sobre","Contact":"Contato","Privacy":"Privacidade","Explore Tools →":"Ver Ferramentas →","Explore Tools":"Ver Ferramentas",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS":"FERRAMENTAS ONLINE GRÁTIS PARA O DIA A DIA",
      "Get More Done with":"Faça mais com",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"Ferramentas online simples para imagens, PDFs, vídeos e textos. Comprima arquivos, converta documentos, crie fotos e facilite seu trabalho.",
      "Free to use":"Grátis","Easy to use":"Fácil de usar","No watermark on supported tools":"Sem marca d'água","Mobile friendly":"Mobile",
      "Search tools... e.g. image compressor, PDF to Word":"Buscar ferramentas... ex. compressor de imagem",
      "Find the right tool quickly by name or task.":"Encontre a ferramenta certa rapidamente.",
      "30":"30","Online Tools":"Ferramentas Online","100%":"100%","Free Access":"Acesso Grátis","24/7":"24/7","Online Access":"Acesso Online","Easy":"Fácil","To Use":"Usar",
      "Explore All Online Tools":"Explorar Todas as Ferramentas","Choose a tool and complete your task in a few simple steps.":"Escolha uma ferramenta e complete sua tarefa em poucos passos.",
      "Choose a tool and complete your task in a few single steps.":"Escolha uma ferramenta e complete em poucos passos.",
      "Showing 30 tools":"Mostrando 30 ferramentas","All Tools":"Todas","Image":"Imagem","PDF":"PDF","Calculators":"Calculadoras","Text & Utilities":"Texto e Utilitários","Open Tool →":"Abrir Ferramenta →",
      "Image DPI Changer - 72 to 300 DPI":"Conversor de DPI - 72 a 300 DPI","Change image DPI from 72 to 300 DPI for printing without losing quality.":"Altere o DPI da imagem de 72 para 300 DPI para impressão sem perder qualidade.",
      "Internet Speed Test - Pro":"Teste de Velocidade - Pro","Check your internet download speed, upload speed and ping.":"Verifique a velocidade de download, upload e ping.",
      "Image to Text - OCR":"Imagem para Texto - OCR","Extract readable text from supported JPG and PNG images.":"Extrair texto de imagens JPG e PNG.",
      "Video Compressor to Any MB":"Compressor de Vídeo para Qualquer MB","Compress videos with custom target file-size options.":"Comprima vídeos com tamanho personalizado.",
      "Text to Speech":"Texto para Voz","Convert written text into speech using supported browser voices.":"Converta texto em voz.",
      "YouTube Thumbnail Downloader":"Baixador de Thumbnail do YouTube","Get available YouTube video thumbnail images.":"Obtenha thumbnails do YouTube.",
      "Love Calculator":"Calculadora do Amor","Try a fun name-based compatibility calculation.":"Calcule compatibilidade amorosa.",
      "Passport Photo Maker":"Criador de Foto 3x4","Prepare passport and document photos in supported sizes.":"Prepare fotos para passaporte.",
      "Background Remover":"Removedor de Fundo","Remove or change image backgrounds with available options.":"Remova ou altere o fundo da imagem.",
      "Compress Image to Any KB":"Comprimir Imagem para Qualquer KB","Reduce image file size for different upload requirements.":"Reduza o tamanho da imagem.",
      "JPG to PDF Converter":"JPG para PDF","Combine supported image files into a PDF document.":"Combine imagens em um PDF.",
      "PDF to JPG Converter":"PDF para JPG","Convert PDF pages into downloadable JPG images.":"Converta PDF em imagens JPG.",
      "Instagram Reels Downloader":"Baixador de Reels do Instagram","Access available Instagram Reels download functionality.":"Baixe Reels do Instagram.",
      "QR Code Generator":"Gerador de QR Code","Create QR codes for supported links, text and Wi-Fi details.":"Crie QR Codes.",
      "PDF to Word":"PDF para Word","Convert supported PDF documents into editable Word files.":"Converta PDF em Word editável.",
      "Word to PDF":"Word para PDF","Convert supported Word documents into PDF format.":"Converta Word em PDF.",
      "PDF Merge & Split":"Juntar e Dividir PDF","Combine PDF documents or split them into separate pages.":"Junte PDFs ou divida em páginas.",
      "Image to Word - OCR":"Imagem para Word - OCR","Extract text from supported images and scanned documents.":"Extrair texto de imagens.",
      "BMI Calculator":"Calculadora de IMC","Calculate body mass index using height and weight.":"Calcule o IMC.",
      "Age Calculator":"Calculadora de Idade","Calculate age in years, months and days from date of birth.":"Calcule sua idade.",
      "Loan EMI Calculator":"Calculadora de Empréstimo","Estimate monthly loan payments, interest and total repayment.":"Estime parcelas de empréstimo.",
      "Percentage Calculator":"Calculadora de Porcentagem","Calculate percentages, percentage changes and values.":"Calcule porcentagens.",
      "Discount Calculator":"Calculadora de Desconto","Calculate discounted prices and total savings.":"Calcule descontos.",
      "Date Difference Calculator":"Calculadora de Diferença de Datas","Find the number of days between two selected dates.":"Calcule dias entre datas.",
      "Word Counter":"Contador de Palavras","Count words, characters, sentences and text length.":"Conte palavras e caracteres.",
      "Character Counter":"Contador de Caracteres","Count characters with and without spaces.":"Conte caracteres.",
      "AI Text Humanizer":"Humanizador de Texto IA","Rewrite text to create a more natural writing style.":"Torne o texto mais natural.",
      "Unit Converter":"Conversor de Unidades","Convert length, weight, temperature and other common units.":"Converta unidades.",
      "Password Generator":"Gerador de Senhas","Generate random passwords with customizable options.":"Gere senhas seguras.",
      "Resume Builder":"Criador de Currículo","Create a professional resume and download your document.":"Crie um currículo profissional."
    }
  };
  const originalTexts=new WeakMap();
  function detectLang(){const p=navigator.languages||[navigator.language||"en"];for(const pr of p){const c=pr.toLowerCase();const ex=Object.keys(LANGUAGES).find(k=>k.toLowerCase()===c);if(ex)return ex;const b=c.split("-")[0];if(LANGUAGES[b])return b;}return "en";}
  function safeGet(){try{const s=localStorage.getItem(STORAGE_KEY);return s&&s!=="auto"&&LANGUAGES[s]?s:detectLang();}catch(e){return detectLang();}}
  function getOriginal(n){if(!originalTexts.has(n))originalTexts.set(n,n.nodeValue);return originalTexts.get(n);}
  function translatePage(lang){
    if(!LANGUAGES[lang])lang="en";const dict=DICT[lang]||{};
    const walker=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {acceptNode(node){const p=node.parentElement;if(!p)return NodeFilter.FILTER_REJECT;if(p.closest("script, style, noscript, textarea, #resultCount, #nexora-language-selector"))return NodeFilter.FILTER_REJECT;if(!node.nodeValue.trim())return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});
    let node;const list=[];while(node=walker.nextNode()){list.push(node);}
    list.forEach(n=>{
      const original=getOriginal(n);const key=original.trim();if(!key)return;
      if(lang==="en"){n.nodeValue=original;return;}
      let t=dict[key]; if(t){const lead=original.match(/^\s*/)?.[0]||"";const trail=original.match(/\s*$/)?.[0]||"";n.nodeValue=lead+t+trail;}
    });
    document.documentElement.lang=lang;
  }
  function createSelector(){
    if(document.getElementById("nexora-language-selector"))return;
    const style=document.createElement("style");style.textContent=`#nexora-language-selector{position:fixed;right:14px;bottom:16px;z-index:99999;padding:10px 12px;border:1px solid #d1d5db;border-radius:12px;background:#fff;color:#111827;font-size:14px;max-width:190px;box-shadow:0 4px 18px rgba(0,0,0,.13);cursor:pointer}`;
    document.head.appendChild(style);
    const sel=document.createElement("select");sel.id="nexora-language-selector";
    const auto=document.createElement("option");auto.value="auto";auto.textContent="🌐 Automatic";sel.appendChild(auto);
    Object.entries(LANGUAGES).forEach(([c,n])=>{const o=document.createElement("option");o.value=c;o.textContent=n;sel.appendChild(o);});
    let saved="auto";try{saved=localStorage.getItem(STORAGE_KEY)||"auto";}catch(e){}
    sel.value=LANGUAGES[saved]||saved==="auto"?saved:"auto";
    sel.addEventListener("change",()=>{const ch=sel.value;try{localStorage.setItem(STORAGE_KEY,ch);}catch(e){}const lang=ch==="auto"?detectLang():ch;translatePage(lang);setTimeout(()=>location.reload(),250);});
    document.body.appendChild(sel);
  }
  function start(){
    let saved="auto";try{saved=localStorage.getItem(STORAGE_KEY)||"auto";}catch(e){}
    const urlParams=new URLSearchParams(location.search);const urlLang=urlParams.get('lang');
    let initial=urlLang&&LANGUAGES[urlLang]?urlLang:(saved==="auto"?detectLang():safeGet());
    translatePage(initial);createSelector();
    setTimeout(()=>translatePage(initial),500);setTimeout(()=>translatePage(initial),1500);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
