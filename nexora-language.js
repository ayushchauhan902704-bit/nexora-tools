"use strict";
/* NEXORA - HOME PAGE 100% ALL LANGUAGES - FINAL FIX */
(() => {
  const LANGUAGES = {
    en:"🇬🇧 English", hi:"🇮🇳 Hindi", bn:"🇧🇩 Bengali", pt:"🇵🇹 Portuguese",
    es:"🇪🇸 Spanish", id:"🇮🇩 Indonesian", fr:"🇫🇷 French", de:"🇩🇪 German",
    ar:"🇸🇦 Arabic", tr:"🇹🇷 Turkish"
  };
  const STORAGE_KEY = "nexora_language";

  const BASE = {
    "Home":"Home","All Tools":"All Tools","Guides":"Guides","About":"About","Contact":"Contact","Privacy":"Privacy",
    "Explore Tools →":"Explore Tools →","Explore Tools":"Explore Tools",
    "FREE ONLINE TOOLS FOR EVERYDAY TASKS":"FREE ONLINE TOOLS FOR EVERYDAY TASKS",
    "Get More Done with":"Get More Done with","NEXORA Tools":"NEXORA Tools",
    "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.",
    "Free to use":"Free to use","Easy to use":"Easy to use","No watermark on supported tools":"No watermark on supported tools","Mobile friendly":"Mobile friendly",
    "Search tools... e.g. image compressor, PDF to Word":"Search tools... e.g. image compressor, PDF to Word",
    "Find the right tool quickly by name or task.":"Find the right tool quickly by name or task.",
    "30":"30","Online Tools":"Online Tools","100%":"100%","Free Access":"Free Access","24/7":"24/7","Online Access":"Online Access","Easy":"Easy","To Use":"To Use",
    "Explore All Online Tools":"Explore All Online Tools","Choose a tool and complete your task in a few simple steps.":"Choose a tool and complete your task in a few simple steps.","Showing 30 tools":"Showing 30 tools",
    "All Tools":"All Tools","Image":"Image","PDF":"PDF","Calculators":"Calculators","Text & Utilities":"Text & Utilities","Open Tool →":"Open Tool →",
    "Image DPI Changer - 72 to 300 DPI":"Image DPI Changer - 72 to 300 DPI","Change image DPI from 72 to 300 DPI for printing without losing quality.":"Change image DPI from 72 to 300 DPI for printing without losing quality.",
    "Internet Speed Test - Pro":"Internet Speed Test - Pro","Check your internet download speed, upload speed and ping.":"Check your internet download speed, upload speed and ping.",
    "Image to Text - OCR":"Image to Text - OCR","Extract readable text from supported JPG and PNG images.":"Extract readable text from supported JPG and PNG images.",
    "Video Compressor to Any MB":"Video Compressor to Any MB","Compress videos with custom target file-size options.":"Compress videos with custom target file-size options.",
    "Text to Speech":"Text to Speech","Convert written text into speech using supported browser voices.":"Convert written text into speech using supported browser voices.",
    "YouTube Thumbnail Downloader":"YouTube Thumbnail Downloader","Get available YouTube video thumbnail images.":"Get available YouTube video thumbnail images.",
    "Love Calculator":"Love Calculator","Try a fun name-based compatibility calculation.":"Try a fun name-based compatibility calculation.",
    "Passport Photo Maker":"Passport Photo Maker","Prepare passport and document photos in supported sizes.":"Prepare passport and document photos in supported sizes.",
    "Background Remover":"Background Remover","Remove or change image backgrounds with available options.":"Remove or change image backgrounds with available options.",
    "Compress Image to Any KB":"Compress Image to Any KB","Reduce image file size for different upload requirements.":"Reduce image file size for different upload requirements.",
    "JPG to PDF Converter":"JPG to PDF Converter","Combine supported image files into a PDF document.":"Combine supported image files into a PDF document.",
    "PDF to JPG Converter":"PDF to JPG Converter","Convert PDF pages into downloadable JPG images.":"Convert PDF pages into downloadable JPG images.",
    "Instagram Reels Downloader":"Instagram Reels Downloader","Access available Instagram Reels download functionality.":"Access available Instagram Reels download functionality.",
    "QR Code Generator":"QR Code Generator","Create QR codes for supported links, text and Wi-Fi details.":"Create QR codes for supported links, text and Wi-Fi details.",
    "PDF to Word":"PDF to Word","Convert supported PDF documents into editable Word files.":"Convert supported PDF documents into editable Word files.",
    "Word to PDF":"Word to PDF","Convert supported Word documents into PDF format.":"Convert supported Word documents into PDF format.",
    "PDF Merge & Split":"PDF Merge & Split","Combine PDF documents or split them into separate pages.":"Combine PDF documents or split them into separate pages.",
    "Image to Word - OCR":"Image to Word - OCR","Extract text from supported images and scanned documents.":"Extract text from supported images and scanned documents.",
    "BMI Calculator":"BMI Calculator","Calculate body mass index using height and weight.":"Calculate body mass index using height and weight.",
    "Age Calculator":"Age Calculator","Calculate age in years, months and days from date of birth.":"Calculate age in years, months and days from date of birth.",
    "Loan EMI Calculator":"Loan EMI Calculator","Estimate monthly loan payments, interest and total repayment.":"Estimate monthly loan payments, interest and total repayment.",
    "Percentage Calculator":"Percentage Calculator","Calculate percentages, percentage changes and values.":"Calculate percentages, percentage changes and values.",
    "Discount Calculator":"Discount Calculator","Calculate discounted prices and total savings.":"Calculate discounted prices and total savings.",
    "Date Difference Calculator":"Date Difference Calculator","Find the number of days between two selected dates.":"Find the number of days between two selected dates.",
    "Word Counter":"Word Counter","Count words, characters, sentences and text length.":"Count words, characters, sentences and text length.",
    "Character Counter":"Character Counter","Count characters with and without spaces.":"Count characters with and without spaces.",
    "AI Text Humanizer":"AI Text Humanizer","Rewrite text to create a more natural writing style.":"Rewrite text to create a more natural writing style.",
    "Unit Converter":"Unit Converter","Convert length, weight, temperature and other common units.":"Convert length, weight, temperature and other common units.",
    "Password Generator":"Password Generator","Generate random passwords with customizable options.":"Generate random passwords with customizable options.",
    "Resume Builder":"Resume Builder","Create a professional resume and download your document.":"Create a professional resume and download your document.",
    "Image Compression Guides":"Image Compression Guides","Learn how to prepare images for different file-size requirements using simple step-by-step guides.":"Learn how to prepare images for different file-size requirements using simple step-by-step guides.",
    "Photo to 20KB - UPSC Guide":"Photo to 20KB - UPSC Guide","Compress Image to 30KB":"Compress Image to 30KB","Compress Image to 50KB":"Compress Image to 50KB","Compress Image to 100KB":"Compress Image to 100KB","Compress Image to 200KB":"Compress Image to 200KB","Compress Image to 500KB":"Compress Image to 500KB"
  };

  const DICT = {
    hi: {
      "Home":"होम","All Tools":"सभी टूल्स","Guides":"गाइड","About":"हमारे बारे में","Contact":"संपर्क करें","Privacy":"गोपनीयता","Explore Tools →":"टूल्स देखें →","Explore Tools":"टूल्स देखें",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS":"रोज़मर्रा के कामों के लिए मुफ्त ऑनलाइन टूल्स","Get More Done with":"अपने काम आसानी से पूरे करें",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"इमेज, PDF, वीडियो, टेक्स्ट के लिए आसान टूल्स। फाइल कंप्रेस करें, फोटो बनाएं।",
      "Free to use":"मुफ्त इस्तेमाल","Easy to use":"आसान इस्तेमाल","No watermark on supported tools":"वॉटरमार्क नहीं","Mobile friendly":"मोबाइल फ्रेंडली",
      "Search tools... e.g. image compressor, PDF to Word":"टूल खोजें... जैसे इमेज कंप्रेसर","Find the right tool quickly by name or task.":"नाम या काम से सही टूल खोजें।",
      "30":"30","Online Tools":"ऑनलाइन टूल्स","100%":"100%","Free Access":"मुफ्त सुविधा","24/7":"24/7","Online Access":"ऑनलाइन उपलब्ध","Easy":"आसान","To Use":"इस्तेमाल",
      "Explore All Online Tools":"सभी टूल्स देखें","Choose a tool and complete your task in a few simple steps.":"एक टूल चुनें और आसान चरणों में काम पूरा करें।","Showing 30 tools":"30 टूल दिखाए जा रहे हैं",
      "All Tools":"सभी टूल्स","Image":"इमेज","PDF":"PDF","Calculators":"कैलकुलेटर","Text & Utilities":"टेक्स्ट और सुविधाएं","Open Tool →":"टूल खोलें →",
      "Image DPI Changer - 72 to 300 DPI":"इमेज DPI बदलें - 72 से 300 DPI","Change image DPI from 72 to 300 DPI for printing without losing quality.":"प्रिंटिंग के लिए DPI बदलें।",
      "Internet Speed Test - Pro":"इंटरनेट स्पीड टेस्ट - प्रो","Check your internet download speed, upload speed and ping.":"डाउनलोड, अपलोड स्पीड और पिंग चेक करें।",
      "Image to Text - OCR":"इमेज से टेक्स्ट - OCR","Extract readable text from supported JPG and PNG images.":"JPG, PNG से टेक्स्ट निकालें।",
      "Video Compressor to Any MB":"वीडियो कंप्रेसर","Compress videos with custom target file-size options.":"वीडियो कंप्रेस करें।",
      "Text to Speech":"टेक्स्ट से आवाज़","Convert written text into speech using supported browser voices.":"टेक्स्ट को आवाज़ में बदलें।",
      "YouTube Thumbnail Downloader":"YouTube थंबनेल डाउनलोडर","Get available YouTube video thumbnail images.":"YouTube थंबनेल पाएं।",
      "Love Calculator":"लव कैलकुलेटर","Try a fun name-based compatibility calculation.":"लव कैलकुलेशन करें।",
      "Passport Photo Maker":"पासपोर्ट फोटो मेकर","Prepare passport and document photos in supported sizes.":"पासपोर्ट फोटो बनाएं।",
      "Background Remover":"बैकग्राउंड हटाएं","Remove or change image backgrounds with available options.":"बैकग्राउंड हटाएं।",
      "Compress Image to Any KB":"इमेज कंप्रेस करें","Reduce image file size for different upload requirements.":"इमेज साइज कम करें।",
      "JPG to PDF Converter":"JPG से PDF","Combine supported image files into a PDF document.":"इमेज को PDF में जोड़ें।",
      "PDF to JPG Converter":"PDF से JPG","Convert PDF pages into downloadable JPG images.":"PDF को JPG में बदलें।",
      "Instagram Reels Downloader":"Instagram Reels डाउनलोडर","Access available Instagram Reels download functionality.":"Reels डाउनलोड करें।",
      "QR Code Generator":"QR कोड जनरेटर","Create QR codes for supported links, text and Wi-Fi details.":"QR कोड बनाएं।",
      "PDF to Word":"PDF से Word","Convert supported PDF documents into editable Word files.":"PDF को Word में बदलें।",
      "Word to PDF":"Word से PDF","Convert supported Word documents into PDF format.":"Word को PDF में बदलें।",
      "PDF Merge & Split":"PDF जोड़ें/अलग करें","Combine PDF documents or split them into separate pages.":"PDF जोड़ें या अलग करें।",
      "Image to Word - OCR":"इमेज से Word","Extract text from supported images and scanned documents.":"इमेज से टेक्स्ट निकालें।",
      "BMI Calculator":"BMI कैलकुलेटर","Calculate body mass index using height and weight.":"BMI निकालें।",
      "Age Calculator":"उम्र कैलकुलेटर","Calculate age in years, months and days from date of birth.":"उम्र निकालें।",
      "Loan EMI Calculator":"लोन EMI कैलकुलेटर","Estimate monthly loan payments, interest and total repayment.":"EMI निकालें।",
      "Percentage Calculator":"प्रतिशत कैलकुलेटर","Calculate percentages, percentage changes and values.":"प्रतिशत निकालें।",
      "Discount Calculator":"डिस्काउंट कैलकुलेटर","Calculate discounted prices and total savings.":"डिस्काउंट निकालें।",
      "Date Difference Calculator":"तारीख कैलकुलेटर","Find the number of days between two selected dates.":"दिन गिनें।",
      "Word Counter":"शब्द काउंटर","Count words, characters, sentences and text length.":"शब्द गिनें।",
      "Character Counter":"अक्षर काउंटर","Count characters with and without spaces.":"अक्षर गिनें।",
      "AI Text Humanizer":"AI ह्यूमनाइज़र","Rewrite text to create a more natural writing style.":"टेक्स्ट को नेचुरल बनाएं।",
      "Unit Converter":"यूनिट कन्वर्टर","Convert length, weight, temperature and other common units.":"यूनिट बदलें।",
      "Password Generator":"पासवर्ड जनरेटर","Generate random passwords with customizable options.":"पासवर्ड बनाएं।",
      "Resume Builder":"रिज्यूमे बिल्डर","Create a professional resume and download your document.":"रिज्यूमे बनाएं।",
      "Image Compression Guides":"इमेज कंप्रेशन गाइड","Learn how to prepare images for different file-size requirements using simple step-by-step guides.":"अलग-अलग साइज के लिए गाइड।",
      "Photo to 20KB - UPSC Guide":"फोटो 20KB - UPSC गाइड","Compress Image to 30KB":"30KB में कंप्रेस","Compress Image to 50KB":"50KB में कंप्रेस","Compress Image to 100KB":"100KB में कंप्रेस","Compress Image to 200KB":"200KB में कंप्रेस","Compress Image to 500KB":"500KB में कंप्रेस"
    },
    bn: {
      "Home":"হোম","All Tools":"সব টুলস","Guides":"গাইড","About":"আমাদের সম্পর্কে","Contact":"যোগাযোগ","Privacy":"গোপনীয়তা","Explore Tools →":"টুলস দেখুন →","Explore Tools":"টুলস দেখুন",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS":"দৈনন্দিন কাজের জন্য বিনামূল্যে টুলস","Get More Done with":"আপনার কাজ সহজে করুন",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"ছবি, PDF, ভিডিও, টেক্সট এর জন্য সহজ টুলস।",
      "Free to use":"বিনামূল্যে ব্যবহার","Easy to use":"ব্যবহার সহজ","No watermark on supported tools":"ওয়াটারমার্ক নেই","Mobile friendly":"মোবাইল ফ্রেন্ডলি",
      "Search tools... e.g. image compressor, PDF to Word":"টুল খুঁজুন...","Find the right tool quickly by name or task.":"দ্রুত টুল খুঁজুন।",
      "30":"৩০","Online Tools":"অনলাইন টুলস","100%":"১০০%","Free Access":"ফ্রি এক্সেস","24/7":"২৪/৭","Online Access":"অনলাইন এক্সেস","Easy":"সহজ","To Use":"ব্যবহার",
      "Explore All Online Tools":"সমস্ত টুলস দেখুন","Choose a tool and complete your task in a few simple steps.":"একটি টুল বেছে নিন এবং সহজ ধাপে কাজ শেষ করুন।","Showing 30 tools":"৩০টি টুল দেখানো হচ্ছে",
      "All Tools":"সব টুলস","Image":"ছবি","PDF":"PDF","Calculators":"ক্যালকুলেটর","Text & Utilities":"টেক্সট ও ইউটিলিটি","Open Tool →":"টুল খুলুন →",
      "Image DPI Changer - 72 to 300 DPI":"ইমেজ DPI পরিবর্তনকারী","Change image DPI from 72 to 300 DPI for printing without losing quality.":"প্রিন্টিং এর জন্য DPI পরিবর্তন করুন।",
      "Internet Speed Test - Pro":"ইন্টারনেট স্পিড টেস্ট","Check your internet download speed, upload speed and ping.":"স্পিড চেক করুন।",
      "Image to Text - OCR":"ছবি থেকে টেক্সট","Extract readable text from supported JPG and PNG images.":"ছবি থেকে টেক্সট বের করুন।",
      "Video Compressor to Any MB":"ভিডিও কম্প্রেসর","Compress videos with custom target file-size options.":"ভিডিও কম্প্রেস করুন।",
      "Text to Speech":"টেক্সট থেকে স্পিচ","Convert written text into speech using supported browser voices.":"টেক্সটকে ভয়েসে রূপান্তর করুন।",
      "YouTube Thumbnail Downloader":"YouTube থাম্বনেইল ডাউনলোডার","Get available YouTube video thumbnail images.":"থাম্বনেইল পান।",
      "Love Calculator":"লাভ ক্যালকুলেটর","Try a fun name-based compatibility calculation.":"লাভ ক্যালকুলেশন।",
      "Passport Photo Maker":"পাসপোর্ট ফটো মেকার","Prepare passport and document photos in supported sizes.":"পাসপোর্ট ফটো তৈরি করুন।",
      "Background Remover":"ব্যাকগ্রাউন্ড রিমুভার","Remove or change image backgrounds with available options.":"ব্যাকগ্রাউন্ড সরান।",
      "Compress Image to Any KB":"ছবি কম্প্রেস করুন","Reduce image file size for different upload requirements.":"ছবির সাইজ কমান।",
      "JPG to PDF Converter":"JPG থেকে PDF","Combine supported image files into a PDF document.":"ছবি PDF এ যোগ করুন।",
      "PDF to JPG Converter":"PDF থেকে JPG","Convert PDF pages into downloadable JPG images.":"PDF কে JPG করুন।",
      "Instagram Reels Downloader":"Reels ডাউনলোডার","Access available Instagram Reels download functionality.":"Reels ডাউনলোড করুন।",
      "QR Code Generator":"QR কোড জেনারেটর","Create QR codes for supported links, text and Wi-Fi details.":"QR কোড তৈরি করুন।",
      "PDF to Word":"PDF থেকে Word","Convert supported PDF documents into editable Word files.":"PDF কে Word করুন।",
      "Word to PDF":"Word থেকে PDF","Convert supported Word documents into PDF format.":"Word কে PDF করুন।",
      "PDF Merge & Split":"PDF যোগ/আলাদা","Combine PDF documents or split them into separate pages.":"PDF যোগ বা আলাদা করুন।",
      "Image to Word - OCR":"ছবি থেকে Word","Extract text from supported images and scanned documents.":"টেক্সট বের করুন।",
      "BMI Calculator":"BMI ক্যালকুলেটর","Calculate body mass index using height and weight.":"BMI নির্ণয়।",
      "Age Calculator":"বয়স ক্যালকুলেটর","Calculate age in years, months and days from date of birth.":"বয়স নির্ণয়।",
      "Loan EMI Calculator":"লোন EMI ক্যালকুলেটর","Estimate monthly loan payments, interest and total repayment.":"EMI নির্ণয়।",
      "Percentage Calculator":"শতাংশ ক্যালকুলেটর","Calculate percentages, percentage changes and values.":"শতাংশ নির্ণয়।",
      "Discount Calculator":"ডিসকাউন্ট ক্যালকুলেটর","Calculate discounted prices and total savings.":"ডিসকাউন্ট নির্ণয়।",
      "Date Difference Calculator":"তারিখ ক্যালকুলেটর","Find the number of days between two selected dates.":"দিন গণনা।",
      "Word Counter":"শব্দ গণনা","Count words, characters, sentences and text length.":"শব্দ গণনা।",
      "Character Counter":"অক্ষর গণনা","Count characters with and without spaces.":"অক্ষর গণনা।",
      "AI Text Humanizer":"AI হিউম্যানাইজার","Rewrite text to create a more natural writing style.":"টেক্সট স্বাভাবিক করুন।",
      "Unit Converter":"ইউনিট কনভার্টার","Convert length, weight, temperature and other common units.":"ইউনিট পরিবর্তন।",
      "Password Generator":"পাসওয়ার্ড জেনারেটর","Generate random passwords with customizable options.":"পাসওয়ার্ড তৈরি।",
      "Resume Builder":"রিজিউম বিল্ডার","Create a professional resume and download your document.":"রিজিউম তৈরি।",
      "Image Compression Guides":"ইমেজ গাইড","Learn how to prepare images for different file-size requirements using simple step-by-step guides.":"গাইড দেখুন।",
      "Photo to 20KB - UPSC Guide":"ফটো ২০KB গাইড","Compress Image to 30KB":"৩০KB তে কম্প্রেস","Compress Image to 50KB":"৫০KB তে","Compress Image to 100KB":"১০০KB তে","Compress Image to 200KB":"২০০KB তে","Compress Image to 500KB":"৫০০KB তে"
    },
    pt: {
      "Home":"Início","All Tools":"Todas Ferramentas","Guides":"Guias","About":"Sobre","Contact":"Contato","Privacy":"Privacidade","Explore Tools →":"Ver Ferramentas →","Explore Tools":"Ver Ferramentas",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS":"FERRAMENTAS ONLINE GRÁTIS","Get More Done with":"Faça mais com","NEXORA Tools":"NEXORA Tools",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"Ferramentas simples para imagens, PDFs, vídeos e textos. Comprima, converta e crie com facilidade.",
      "Free to use":"Grátis","Easy to use":"Fácil de usar","No watermark on supported tools":"Sem marca d'água","Mobile friendly":"Mobile",
      "Search tools... e.g. image compressor, PDF to Word":"Buscar ferramentas... ex. compressor","Find the right tool quickly by name or task.":"Encontre a ferramenta certa rapidamente.",
      "30":"30","Online Tools":"Ferramentas","100%":"100%","Free Access":"Acesso Grátis","24/7":"24/7","Online Access":"Acesso Online","Easy":"Fácil","To Use":"Usar",
      "Explore All Online Tools":"Explorar Todas Ferramentas","Choose a tool and complete your task in a few simple steps.":"Escolha uma ferramenta e complete em poucos passos.","Showing 30 tools":"Mostrando 30 ferramentas",
      "All Tools":"Todas","Image":"Imagem","PDF":"PDF","Calculators":"Calculadoras","Text & Utilities":"Texto","Open Tool →":"Abrir Ferramenta →",
      "Image DPI Changer - 72 to 300 DPI":"Conversor de DPI 72-300","Change image DPI from 72 to 300 DPI for printing without losing quality.":"Altere o DPI para impressão sem perder qualidade.",
      "Internet Speed Test - Pro":"Teste de Velocidade Pro","Check your internet download speed, upload speed and ping.":"Verifique download, upload e ping.",
      "Image to Text - OCR":"Imagem para Texto OCR","Extract readable text from supported JPG and PNG images.":"Extrair texto de JPG e PNG.",
      "Video Compressor to Any MB":"Compressor de Vídeo","Compress videos with custom target file-size options.":"Comprima vídeos.",
      "Text to Speech":"Texto para Voz","Convert written text into speech using supported browser voices.":"Converta texto em voz.",
      "YouTube Thumbnail Downloader":"Baixador de Thumbnail","Get available YouTube video thumbnail images.":"Obtenha thumbnails.",
      "Love Calculator":"Calculadora do Amor","Try a fun name-based compatibility calculation.":"Calcule compatibilidade.",
      "Passport Photo Maker":"Foto 3x4 Maker","Prepare passport and document photos in supported sizes.":"Prepare foto 3x4.",
      "Background Remover":"Removedor de Fundo","Remove or change image backgrounds with available options.":"Remova o fundo.",
      "Compress Image to Any KB":"Comprimir Imagem","Reduce image file size for different upload requirements.":"Reduza o tamanho.",
      "JPG to PDF Converter":"JPG para PDF","Combine supported image files into a PDF document.":"Combine imagens em PDF.",
      "PDF to JPG Converter":"PDF para JPG","Convert PDF pages into downloadable JPG images.":"Converta PDF em JPG.",
      "Instagram Reels Downloader":"Baixador de Reels","Access available Instagram Reels download functionality.":"Baixe Reels.",
      "QR Code Generator":"Gerador de QR Code","Create QR codes for supported links, text and Wi-Fi details.":"Crie QR Code.",
      "PDF to Word":"PDF para Word","Convert supported PDF documents into editable Word files.":"Converta PDF em Word.",
      "Word to PDF":"Word para PDF","Convert supported Word documents into PDF format.":"Converta Word em PDF.",
      "PDF Merge & Split":"Juntar e Dividir PDF","Combine PDF documents or split them into separate pages.":"Junte ou divida PDFs.",
      "Image to Word - OCR":"Imagem para Word","Extract text from supported images and scanned documents.":"Extrair texto.",
      "BMI Calculator":"Calculadora IMC","Calculate body mass index using height and weight.":"Calcule o IMC.",
      "Age Calculator":"Calculadora de Idade","Calculate age in years, months and days from date of birth.":"Calcule idade.",
      "Loan EMI Calculator":"Calculadora de Empréstimo","Estimate monthly loan payments, interest and total repayment.":"Estime parcelas.",
      "Percentage Calculator":"Calculadora Porcentagem","Calculate percentages, percentage changes and values.":"Calcule porcentagem.",
      "Discount Calculator":"Calculadora Desconto","Calculate discounted prices and total savings.":"Calcule desconto.",
      "Date Difference Calculator":"Diferença de Datas","Find the number of days between two selected dates.":"Calcule dias entre datas.",
      "Word Counter":"Contador de Palavras","Count words, characters, sentences and text length.":"Conte palavras.",
      "Character Counter":"Contador de Caracteres","Count characters with and without spaces.":"Conte caracteres.",
      "AI Text Humanizer":"Humanizador de Texto","Rewrite text to create a more natural writing style.":"Torne o texto natural.",
      "Unit Converter":"Conversor de Unidades","Convert length, weight, temperature and other common units.":"Converta unidades.",
      "Password Generator":"Gerador de Senhas","Generate random passwords with customizable options.":"Gere senhas.",
      "Resume Builder":"Criador de Currículo","Create a professional resume and download your document.":"Crie currículo.",
      "Image Compression Guides":"Guias de Compressão","Learn how to prepare images for different file-size requirements using simple step-by-step guides.":"Aprenda a preparar imagens.",
      "Photo to 20KB - UPSC Guide":"Foto para 20KB","Compress Image to 30KB":"Comprimir para 30KB","Compress Image to 50KB":"Comprimir para 50KB","Compress Image to 100KB":"Comprimir para 100KB","Compress Image to 200KB":"Comprimir para 200KB","Compress Image to 500KB":"Comprimir para 500KB"
    },
    es: {
      "Home":"Inicio","All Tools":"Todas Herramientas","Guides":"Guías","About":"Sobre","Contact":"Contacto","Privacy":"Privacidad","Explore Tools →":"Ver Herramientas →",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS":"HERRAMIENTAS ONLINE GRATIS","Get More Done with":"Haz más con",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"Herramientas simples para imágenes, PDFs, vídeos y textos. Comprime, convierte y crea fácilmente.",
      "Free to use":"Gratis","Easy to use":"Fácil de usar","No watermark on supported tools":"Sin marca de agua","Mobile friendly":"Móvil",
      "Search tools... e.g. image compressor, PDF to Word":"Buscar herramientas... ej. compresor","Find the right tool quickly by name or task.":"Encuentra la herramienta rápidamente.",
      "Explore All Online Tools":"Explorar Todas las Herramientas","Choose a tool and complete your task in a few simple steps.":"Elige una herramienta y completa en pocos pasos.","Showing 30 tools":"Mostrando 30 herramientas","Open Tool →":"Abrir Herramienta →"
    },
    id: {
      "Home":"Beranda","All Tools":"Semua Alat","Guides":"Panduan","About":"Tentang","Contact":"Kontak","Privacy":"Privasi","Explore Tools →":"Lihat Alat →",
      "FREE ONLINE TOOLS FOR EVERYDAY TASKS":"ALAT ONLINE GRATIS","Get More Done with":"Selesaikan lebih banyak dengan",
      "Simple online tools for images, PDFs, videos, text and everyday tasks. Compress files, convert documents, create photos, calculate values and get your work done with ease.":"Alat online sederhana untuk gambar, PDF, video, teks. Kompres file, konversi dokumen dengan mudah.",
      "Free to use":"Gratis","Easy to use":"Mudah digunakan","No watermark on supported tools":"Tanpa watermark","Mobile friendly":"Ramah mobile",
      "Search tools... e.g. image compressor, PDF to Word":"Cari alat... mis. kompresor gambar","Find the right tool quickly by name or task.":"Temukan alat dengan cepat.",
      "Explore All Online Tools":"Jelajahi Semua Alat Online","Choose a tool and complete your task in a few simple steps.":"Pilih alat dan selesaikan tugas dalam beberapa langkah.","Showing 30 tools":"Menampilkan 30 alat","Open Tool →":"Buka Alat →"
    }
  };

  // Add English fallback and auto-fill missing with base
  Object.keys(LANGUAGES).forEach(code=>{
    if(!DICT[code]) DICT[code]={};
    // For es,id,fr,de etc if missing key, use pt or en logic handled later
  });

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

  function translatePage(lang){
    if(!LANGUAGES[lang]) lang="en";
    const dict = DICT[lang] || {};
    // Translate text nodes
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
      const t=dict[key];
      if(t){
        const lead=original.match(/^\s*/)?.[0]||"";
        const trail=original.match(/\s*$/)?.[0]||"";
        n.nodeValue=lead+t+trail;
      }
    });
    // Translate placeholders
    const searchInput=document.getElementById("searchInput");
    if(searchInput){
      const ph=searchInput.getAttribute("data-i18n-placeholder")||searchInput.placeholder;
      if(dict[ph]) searchInput.placeholder=dict[ph];
    }
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
    setTimeout(()=>translatePage(initial),600);
    setTimeout(()=>translatePage(initial),1500);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start);
  else start();
})();
