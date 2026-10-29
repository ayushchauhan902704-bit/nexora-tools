// NEXORA AUTO LANG - UNIVERSAL
function googleTranslateElementInit(){
 new google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'en,hi,bn,ta,te,mr,gu,pa,es,fr,de,pt,ar',autoDisplay:false},'google_translate_element');
 setTimeout(function(){
  var l=(navigator.language||'en').toLowerCase();
  var t='en'; if(l.startsWith('hi'))t='hi'; if(l.startsWith('bn'))t='bn'; if(l.startsWith('ta'))t='ta'; if(l.startsWith('te'))t='te';
  if(t!='en'){var s=document.querySelector('select.goog-te-combo'); if(s){s.value=t; s.dispatchEvent(new Event('change'));}}
 },1200);
}
