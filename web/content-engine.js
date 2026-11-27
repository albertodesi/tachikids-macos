/* TachiKids Content Engine — classificazioni ortografiche euristiche, non cliniche */
(function(){
 function syllables(word){return (String(word||"").toLocaleLowerCase("it-IT").match(/[aeiouàèéìòóù]+/gi)||[]).length}
 function patterns(word){
  const w=String(word||"").toLocaleLowerCase("it-IT"),p=[];
  if(/([bcdfghjklmnpqrstvwxyz])\\1/i.test(w))p.push("doppie");
  if(/gli|gn|sc(i|e)|ch(i|e)|gh(i|e)|qu/i.test(w))p.push("digrammi");
  if(/[bcdfgptv][lr]|s[bcdfgptv][lr]|[bcdfgptv][mn]/i.test(w))p.push("gruppi-consonantici");
  if(/^[aeiouàèéìòóù]/i.test(w))p.push("iniziale-vocale");
  return p;
 }
 function exposure(word,base){const n=syllables(word);return Math.max(700,Math.min(4000,Math.round((Number(base)||1800)+(n-2)*180)))}
 window.TachiContent={syllables,patterns,exposure};
})();