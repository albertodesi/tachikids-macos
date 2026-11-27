// TachiKids — percorso adattivo locale (nessun account o server)
const $=id=>document.getElementById(id);
const STORAGE_KEY="tachikids-profile-v2";
const state={name:"",gender:"girl",mode:"words",level:1,length:2,count:10,index:0,correct:0,visible:false,waiting:false,answer:null,current:"",choices:[],queue:[],timer:null,exposure:900,pause:500,font:96,profile:null,sessionResults:[]};
const syllables={2:["MA","SO","LE","PA","TO","MI","LU","RE","CA","NO","BA","SI","FA","DO","TE","NI","PO","RA"],3:["TRA","SCA","GLO","PRE","CHI","GNE","FRA","SPE","CRI","DRO","GHI","ZZA","GLI","STR","SCI","CHE","GNA","TRO"],4:["STRA","GLIA","SCHE","CREI","TRAI","SQUI","GNEI","CHIO","SCIA","GLIO","GNOI","TRIE","CHIE","SCAI"],5:["SCHIA","STRIA","SCIAL","SQUAR","SCHIE","GLION","STRON","GHIAC","SCUOL","TRIAN"]};
let banks=Array.from({length:10},()=>["CASA","SOLE","LUNA","PANE"]);
let vocabularyEntries=[];
/* Filtro prudenziale del lessico per la scuola primaria. */
const childSafetyBlocked=["fumare","fumato","fumatore","fumatrice","fumatrici","fumatori","fumo","sigaretta","sigarette","sigaro","sigari","tabacco","alcool","alcolico","alcolici","ubriaco","ubriaca","ubriachi","ubriache","ubriacare","ubriacarsi","ubriachezza","droga","droghe","drogato","drogata","drogati","drogate","cocaina","eroina","marijuana","cannabis","hashish","spinello","spinelli","pornografia","pornografico","pornografica","porno","prostituta","prostituzione","puttana","puttane","puttaniere","cazzo","cazzi","stronzo","stronzi","stronza","stronze","merda","merde","vaffanculo","minchia","troia","troie","bastardo","bastarda","bastardi","bastarde","uccidere","ucciso","uccisa","uccisi","uccise","omicidio","omicidi","assassino","assassina","assassini","assassine","assassinare","stupro","stuprare","violentare","violenza","pistola","pistole","fucile","fucili","mitra","mitraglia","bomba","bombardare","bombardamento","esplosivo","esplosivi","suicidio","suicida","suicidarsi"];
const childSafetyStems=["fum","sigarett","sigar","tabacc","ubriac","drogat","cocain","eroin","marijuan","cannabis","hashish","spinell","pornograf","prostitu","puttan","cazz","stronz","merd","vaffancul","minchi","troi","bastard","omicid","assassin","uccis","uccider","stupra","violent","pistol","fucil","mitragli","bombard","esplosiv","suicid","arm","denud","tramort","terrorist","bestemm","tortur","rapin","rapim","azzard","fumator","sigarett","tabacc","ubriac","drogat","cocain","eroin","marijuan","cannabis","hashish","spinell","pornograf","prostitu","puttan","cazz","stronz","merd","vaffancul","minchi","troi","bastard","omicid","assassin","stupra","violent","pistol","fucil","mitragli","bombard","esplosiv","suicid"];
function isChildSafeWord(value){
 const word=String(value||"").toLocaleLowerCase("it-IT").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 return !childSafetyBlocked.includes(word)&&!childSafetyStems.some(stem=>word.includes(stem));
}

const hints=["Parole brevi e familiari","Parole quotidiane","Parole più lunghe","Parole articolate","Parole ricche di sillabe","Parole con gruppi consonantici","Parole impegnative","Parole molto complesse","Parole da veri esploratori","Sfida esperta: parole lunghissime!"];
// Step temporali interni al gioco: non sono soglie cliniche né benchmark scientifici.
const exposureSteps=[2400,2200,2000,1800,1600,1400];
function applyTheme(screen){const theme=screen==="welcome"?"welcome":state.gender==="boy"?"boy":"girl";document.documentElement.dataset.theme=theme}
function show(id){["welcome","settings","training"].forEach(x=>$(x).classList.toggle("hidden",x!==id));applyTheme(id)}
applyTheme("welcome");
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function bank(){
 if(state.mode==="syllables")return syllables[state.length];
 if($("useCustomList")?.checked){const custom=String($("customList")?.value||"").split(/[\n,;]+/).map(x=>x.trim().toLocaleUpperCase("it-IT")).filter(x=>/^[A-ZÀÈÉÌÒÙ]{2,20}$/.test(x)&&isChildSafeWord(x));if(custom.length)return [...new Set(custom)]}
 const opts={syllables:$("filterSyllables")?.value||"",pattern:$("filterPattern")?.value||"",frequency:$("filterFrequency")?.value||"",maxLength:$("filterMaxLength")?.value||""};
 return vocabularyEntries.filter(x=>x.level===state.level&&isChildSafeWord(x.word)).filter(x=>{
  const word=x.word.toLocaleUpperCase("it-IT"),count=window.TachiContent.syllables(word),patterns=window.TachiContent.patterns(word);
  if(opts.syllables==="5plus"&&count<5)return false;
  if(opts.syllables&&opts.syllables!=="5plus"&&count!==Number(opts.syllables))return false;
  if(opts.pattern&&!patterns.includes(opts.pattern))return false;
  if(opts.frequency&&!((x.nvdbCategories||[]).includes(opts.frequency)||x.frequencyBand===opts.frequency||x.napoluxBand===opts.frequency.replace(/^napolux_/, "")))return false;
  if(opts.maxLength&&word.length>Number(opts.maxLength))return false;
  return true;
 }).map(x=>x.word.toLocaleUpperCase("it-IT"));
}
function cancel(){clearTimeout(state.timer)}
function schedule(fn,ms){cancel();state.timer=setTimeout(fn,ms)}
function notify(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200)}
function token(){const bytes=new Uint8Array(5);if(window.crypto&&typeof window.crypto.getRandomValues==="function")window.crypto.getRandomValues(bytes);else for(let i=0;i<bytes.length;i++)bytes[i]=Math.floor(Math.random()*256);return [...bytes].map(x=>"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[x%32]).join("")}
function saveProfile(){if(!state.profile)return false;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state.profile));return true}catch(error){console.warn("TachiKids: salvataggio locale non disponibile",error);notify("Percorso avviato, ma il salvataggio su questo dispositivo non è disponibile.");return false}}
function loadProfile(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"null")}catch{return null}}
function syncTimingDefaults(){const step=Math.max(0,Math.min(exposureSteps.length-1,state.profile?.step||0));const exposure=$("exposure");const pause=$("pause");if(exposure){exposure.value=String(exposureSteps[step]);$("exposureValue").textContent=(exposureSteps[step]/1000).toFixed(1)+" s"}if(pause){pause.value="1000";$("pauseValue").textContent="1.0 s"}}
function updateMode(){const syl=state.mode==="syllables";$("levelRow").classList.toggle("hidden",syl);$("levelHint").classList.toggle("hidden",syl);$("lengthRow").classList.toggle("hidden",!syl);$("contentFilters")?.classList.toggle("hidden",syl);document.querySelectorAll("[data-mode]").forEach(b=>b.classList.toggle("active",b.dataset.mode===state.mode));$("levelHint").textContent=hints[state.level-1]}
function accuracyFace(avg){const mood=avg===null?"neutral":avg>=85?"happy":avg>=65?"neutral":"sad";const mouth=mood==="happy"?"M10 19 Q18 28 26 19":mood==="sad"?"M10 25 Q18 17 26 25":"M11 22 H25";const color=mood==="happy"?"#27966B":mood==="sad"?"#D65B72":"#D99A35";return '<svg class="accuracy-face '+mood+'" viewBox="0 0 36 36" role="img" aria-label="'+(mood==="happy"?"Accuratezza alta":mood==="sad"?"Accuratezza da migliorare":"Accuratezza intermedia o non ancora disponibile")+'"><circle cx="18" cy="18" r="15" fill="'+color+'" opacity=".13"/><circle cx="18" cy="18" r="13" fill="none" stroke="'+color+'" stroke-width="2.2"/><circle cx="13" cy="14" r="1.5" fill="'+color+'"/><circle cx="23" cy="14" r="1.5" fill="'+color+'"/><path d="'+mouth+'" fill="none" stroke="'+color+'" stroke-width="2.2" stroke-linecap="round"/></svg>'}
function renderProfile(){if(!state.profile)return;syncTimingDefaults();$("profileToken").textContent=state.profile.token;$("pathStatus").textContent="Percorso "+(state.profile.step+1)+" di "+exposureSteps.length+" · esposizione "+exposureSteps[state.profile.step]+" ms";$("pathProgress").style.width=((state.profile.step+1)/exposureSteps.length*100)+"%";const sessions=state.profile.sessions||[];const last=sessions.at(-1);const scored=sessions.filter(x=>Number.isFinite(x.accuracy));const avg=scored.length?Math.round(scored.reduce((n,x)=>n+x.accuracy,0)/scored.length):null;const lastSession=$("lastSession");lastSession.textContent=sessions.length?"Ultima sessione: "+(Number.isFinite(last?.accuracy)?last.accuracy+"%":last?.mode==="reading"?"lettura ad alta voce":last?.mode==="syllables"?"sequenza sillabe":"sequenza parole"):"";lastSession.classList.toggle("hidden",!sessions.length);const dash=$("progressDashboard");if(dash)dash.innerHTML='<strong>Il tuo andamento</strong><div class="dashboard-metrics"><span><b>'+sessions.length+'</b><small>sessioni</small></span><span class="accuracy-metric">'+accuracyFace(avg)+'<b>'+(avg===null?"—":avg+"%")+'</b><small>accuratezza media*</small></span><span><b>'+sessions.reduce((n,x)=>n+(x.total||0),0)+'</b><small>stimoli</small></span></div><small>*Media calcolata solo sulle sessioni con risposte valutate.</small>';}
function startProfile(name,gender){state.name=name;state.gender=gender==="boy"?"boy":"girl";state.profile={token:token(),name,gender:state.gender,step:0,goodStreak:0,sessions:[],created:new Date().toISOString()};$("hello").textContent=(state.gender==="boy"?"Pronto, ":"Pronta, ")+name+"!";renderProfile();show("settings");saveProfile()}
function restoreProfile(){const p=loadProfile();if(!p||!p.token||!Number.isInteger(p.step))return false;state.profile=p;state.name=p.name;state.gender=p.gender;return true}
document.querySelectorAll("[data-gender]").forEach(b=>b.addEventListener("click",()=>{state.gender=b.dataset.gender;document.querySelectorAll("[data-gender]").forEach(x=>x.classList.toggle("selected",x===b));applyTheme("welcome")}));
function submitNewProfile(event){if(event){event.preventDefault();event.stopPropagation()}const input=$("playerName");const n=String(input?.value||"").trim();if(!n){notify("Scrivi il tuo nome per iniziare!");input?.focus();return}try{startProfile(n,state.gender)}catch(error){console.error("TachiKids: errore durante la creazione del profilo",error);notify("Non riesco ad avviare il profilo. Riprova tra poco.")}}
const enterButton=$("enter");if(enterButton){enterButton.type="button";enterButton.addEventListener("click",submitNewProfile)}
$("playerName").addEventListener("keydown",e=>{if(e.key==="Enter")submitNewProfile(e)});
$("resumeProfile").onclick=()=>{if(restoreProfile()){$("hello").textContent=(state.gender==="boy"?"Bentornato, ":"Bentornata, ")+state.name+"!";renderProfile();show("settings")}};
$("newProfile").onclick=()=>{localStorage.removeItem(STORAGE_KEY);state.profile=null;state.name="";state.gender="girl";$("playerName").value="";document.querySelectorAll("[data-gender]").forEach(x=>x.classList.toggle("selected",x.dataset.gender==="girl"));show("welcome");showNewProfileFields();applyTheme("welcome");$("playerName").focus()};
$("changeName").onclick=()=>{show("welcome");$("playerName").value=state.name;showNewProfileFields();document.querySelectorAll("[data-gender]").forEach(x=>x.classList.toggle("selected",x.dataset.gender===state.gender));applyTheme("welcome")};
document.querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;updateMode()});
$("level").onchange=e=>{state.level=+e.target.value;updateMode()};$("length").onchange=e=>state.length=+e.target.value;
function setFontSize(value){const size=Math.max(64,Math.min(128,Number(value)||96));$("fontSize").value=String(size);$("fontSizeValue").textContent=size+" px";$("fontPreview").style.fontSize=Math.min(36,size*.34)+"px";$("fontPreview").textContent=state.mode==="syllables"?"MA":"CASA";document.querySelectorAll("[data-font-size]").forEach(button=>{const active=Number(button.dataset.fontSize)===size;button.classList.toggle("selected",active);button.setAttribute("aria-pressed",String(active))});state.font=size}
document.querySelectorAll("[data-font-size]").forEach(button=>button.addEventListener("click",()=>setFontSize(button.dataset.fontSize)));
setFontSize(96);
$("start").onclick=()=>{if(!state.profile&&!restoreProfile()){notify("Crea prima il tuo profilo.");return}state.level=+$("level").value;state.length=+$("length").value;state.count=+$("count").value;state.exposure=+$("exposure").value;state.pause=+$("pause").value;state.font=Math.max(64,Math.min(128,+$("fontSize").value||96));state.index=0;state.correct=0;state.sessionResults=[];state.readings=[];state.transcript="";state.speechStatus="";const selected=bank();if(!selected.length){notify("Nessuno stimolo corrisponde ai filtri. Modifica la selezione.");return}state.queue=shuffle(selected);state.baseExposure=state.exposure;show("training");next()};
$("stop").onclick=()=>finish(false);
function next(){cancel();if(state.count&&state.index>=state.count){finish(true);return}state.index++;state.answer=null;state.waiting=false;const b=bank();if(!state.queue.length)state.queue=shuffle(b);state.current=state.queue.shift();state.choices=shuffle([state.current,...shuffle(b.filter(w=>w!==state.current)).slice(0,3)]);state.visible=true;render();schedule(()=>{state.visible=false;state.waiting=true;render()},state.exposure)}
function render(){const total=state.count?" / "+state.count:"";$("progressLabel").textContent=state.name+", stimolo "+state.index+total;$("progress").style.width=state.count?Math.min(100,state.index/state.count*100)+"%":"0%";const stage=$("stage");stage.innerHTML="";
if(state.waiting){const q=document.createElement("div");q.className="ready";q.textContent=state.mode==="syllables"?"Quale sillaba hai visto?":"Quale parola hai visto?";stage.append(q);const opts=document.createElement("div");opts.className="options";state.choices.forEach(word=>{const b=document.createElement("button");b.className="option";b.textContent=word;if(state.answer!==null){b.disabled=true;if(word===state.current)b.classList.add("correct");else if(word===state.answer)b.classList.add("wrong")}b.onclick=()=>choose(word);opts.append(b)});stage.append(opts);if(state.answer!==null){const f=document.createElement("div");f.className="feedback";f.textContent=state.answer===state.current?"Esatto! ⭐":"Quasi! La risposta era "+state.current;f.style.color=state.answer===state.current?"#27865b":"#e58a35";stage.append(f);const n=document.createElement("button");n.className="next-button";n.textContent="Continua";n.onclick=next;stage.append(n)}return}
if(state.visible){const w=document.createElement("div");w.className="stimulus";w.textContent=state.current;w.style.fontSize="min("+state.font+"px, 18vw)";stage.append(w)}else{const r=document.createElement("div");r.className="ready";r.textContent="Preparati…";stage.append(r)}}
function choose(v){if(state.answer!==null)return;state.answer=v;if(v===state.current)state.correct++;state.sessionResults.push(v===state.current);render()}
function finish(completed){cancel();state.visible=false;state.waiting=false;if(completed&&state.index){const accuracy=Math.round(state.correct/state.index*100);const p=state.profile;p.sessions.push({date:new Date().toISOString(),mode:state.mode,level:state.level,total:state.index,correct:state.correct,accuracy,exposure:state.exposure});if(p.sessions.length>100)p.sessions=p.sessions.slice(-100);
if(accuracy>=90){p.goodStreak++;if(p.goodStreak>=2&&p.step<exposureSteps.length-1){p.step++;p.goodStreak=0;p.feedback="Ottimo lavoro: nel prossimo allenamento proverai un tempo leggermente più rapido."}else p.feedback="Ottimo risultato: ripeti ancora questo livello per consolidarlo."}
else if(accuracy<75){p.goodStreak=0;p.step=Math.max(0,p.step-1);p.feedback="Rallentiamo un po': consolidiamo il riconoscimento prima di accelerare."}
else{p.goodStreak=0;p.feedback="Buon allenamento: manteniamo questo ritmo e riproviamo."}
saveProfile();renderProfile();}renderResult(completed)}
function renderResult(completed){const stage=$("stage");const accuracy=state.index?Math.round(state.correct/state.index*100):0;stage.innerHTML='<div class="result"><div class="trophy">🏆</div><h2>'+ (state.gender==="boy"?"BRAVO":"BRAVA")+', '+escapeHtml(state.name.toUpperCase())+'!</h2><p>'+(completed?"Hai completato la tua missione!":"Allenamento terminato!")+'</p><p>Risposte corrette: '+state.correct+' su '+state.index+' ('+accuracy+'%)</p><p>'+escapeHtml(state.profile?.feedback||"Puoi riprendere quando vuoi.")+'</p><button class="primary" id="again">↻ Continua il percorso</button><button class="primary secondary" id="home">⌂ Torna alla home</button></div>';$("again").onclick=()=>$("start").click();$("home").onclick=()=>{renderProfile();show("settings")};$("progress").style.width="100%";$("progressLabel").textContent="Missione conclusa"}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function loadWords(){try{const res=await fetch("./vocabulary/reading-vocabulary-it.json");if(!res.ok)throw Error("fetch");vocabularyEntries=await res.json();if(!vocabularyEntries.length)throw Error("dataset");banks=Array.from({length:10},(_,i)=>vocabularyEntries.filter(x=>x.level===i+1&&isChildSafeWord(x.word)).map(x=>x.word.toUpperCase()));const badge=$("vocabularyStatus");if(badge)badge.textContent=vocabularyEntries.length.toLocaleString("it-IT")+" voci nel catalogo · NVdB + lessico complementare";}catch(e){notify("Vocabolario non disponibile: verifica la connessione.")}}
if("serviceWorker"in navigator){navigator.serviceWorker.addEventListener("controllerchange",()=>window.location.reload());window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js?v=19").then(reg=>reg.update()).catch(()=>{}));}
function connection(){const el=$("connection");el.textContent=navigator.onLine?"● Online":"● Offline";el.classList.toggle("off",!navigator.onLine)}window.addEventListener("online",connection);window.addEventListener("offline",connection);connection();
function showNewProfileFields(){ $("resumeBox").classList.add("hidden"); $("newProfileFields").classList.remove("hidden"); }
function showResumeChoice(){ $("resumeBox").classList.remove("hidden"); $("newProfileFields").classList.add("hidden"); }
if(restoreProfile()){showResumeChoice();$("resumeName").textContent=state.name;$("resumeToken").textContent=state.profile.token}else{showNewProfileFields()}

// --- Lettura ad alta voce: valutazione adulta + riconoscimento vocale opzionale ---
Object.assign(state,{readings:[],recognition:null,readStart:null,transcript:"",speechStatus:""});
const originalNext=next, originalFinish=finish;
function speechConstructor(){return window.SpeechRecognition||window.webkitSpeechRecognition||null}
function normalizeSpeech(value){return String(value||"").toLocaleLowerCase("it-IT").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z]/g,"")}
function stopSpeech(){if(state.recognition){try{state.recognition.stop()}catch{}state.recognition=null}if(state.speechStatus==="listening")state.speechStatus="Ascolto terminato"}
function startSpeech(){
 const C=speechConstructor();if(!C)return;
 try{
  const rec=new C();state.recognition=rec;state.readStart=performance.now();state.speechStatus="listening";state.transcript="";
  rec.lang="it-IT";rec.continuous=false;rec.interimResults=false;rec.maxAlternatives=3;
  rec.onresult=e=>{const result=e.results[e.results.length-1];state.transcript=Array.from(result).map(x=>x.transcript).join(" / ");state.speechStatus="Riconoscimento completato";render()};
  rec.onerror=e=>{state.speechStatus=e.error==="not-allowed"?"Permesso microfono negato. Puoi usare la valutazione manuale.":"Riconoscimento non riuscito. Riprova o usa la valutazione manuale.";render()};
  rec.onend=()=>{if(state.speechStatus==="listening")state.speechStatus="Ascolto terminato";render()};
  rec.start();render();
 }catch(e){state.speechStatus="Impossibile avviare il microfono. Usa la valutazione manuale.";render()}
}
function assessReading(result){
 if(state.answer)return;stopSpeech();
 const elapsed=state.readStart?Math.round(performance.now()-state.readStart):null;
 state.answer=result;state.readings.push({word:state.current,result,elapsedMs:elapsed,transcript:state.transcript||""});
 if(result==="correct")state.correct++;render();
}
next=function(){
 cancel();stopSpeech();
 if(state.count&&state.index>=state.count){finish(true);return}
 state.index++;state.answer=null;state.waiting=false;state.transcript="";state.speechStatus="";state.readStart=null;
 const b=bank();if(!state.queue.length)state.queue=shuffle(b);
 state.current=state.queue.shift();state.choices=shuffle([state.current,...shuffle(b.filter(w=>w!==state.current)).slice(0,3)]);
 state.visible=true;render();
 if(state.mode!=="reading")schedule(()=>{state.visible=false;state.waiting=true;render()},state.exposure);
};
render=function(){
 const total=state.count?" / "+state.count:"";
 $("progressLabel").textContent=state.name+", stimolo "+state.index+total;
 $("progress").style.width=state.count?Math.min(100,state.index/state.count*100)+"%":"0%";
 const stage=$("stage");stage.innerHTML="";
 if(state.mode==="reading"){
  const word=document.createElement("div");word.className="stimulus reading-word";word.textContent=state.current;stage.append(word);
 // One discreet microphone indicator; the word remains the only main stimulus.
 const status=document.createElement("p");status.className="speech-status";
 const statusText=state.speechStatus||"Attivazione del microfono…";
 status.textContent=/not available|non disponibile/i.test(statusText)?"Microfono non disponibile":/not-allowed|negato|non autorizzato/i.test(statusText)?"Microfono non autorizzato":/ripristino|riprovo|attivazione/i.test(statusText)?"Connessione microfono…":"In ascolto";
 status.setAttribute("aria-live","polite");stage.append(status);
  }
};
finish=function(completed){
 cancel();stopSpeech();state.visible=false;state.waiting=false;
 if(completed&&state.index){
  const p=state.profile;
  if(state.mode==="reading"){
   const correct=state.readings.filter(x=>x.result==="correct").length;
   const assisted=state.readings.filter(x=>x.result==="assisted").length;
   const retry=state.readings.filter(x=>x.result==="retry").length;
   const times=state.readings.filter(x=>Number.isFinite(x.elapsedMs)).map(x=>x.elapsedMs);
   const average=times.length?Math.round(times.reduce((a,b)=>a+b,0)/times.length):null;
   p.sessions.push({date:new Date().toISOString(),mode:"reading",total:state.index,correct,assisted,retry,averageMicMs:average,readings:state.readings.map(({word,result,elapsedMs})=>({word,result,elapsedMs}))});
   p.feedback="Lettura registrata. I tempi del microfono sono indicativi e non costituiscono una prova standardizzata.";
   if(p.sessions.length>100)p.sessions=p.sessions.slice(-100);saveProfile();renderProfile();
  }else{
   const accuracy=Math.round(state.correct/state.index*100);
   p.sessions.push({date:new Date().toISOString(),mode:state.mode,level:state.level,total:state.index,correct:state.correct,accuracy,exposure:state.exposure});
   if(p.sessions.length>100)p.sessions=p.sessions.slice(-100);
   if(accuracy>=90){p.goodStreak++;if(p.goodStreak>=2&&p.step<exposureSteps.length-1){p.step++;p.goodStreak=0;p.feedback="Ottimo lavoro: nel prossimo allenamento proverai un tempo leggermente più rapido."}else p.feedback="Ottimo risultato: ripeti ancora questo livello per consolidarlo."}
   else if(accuracy<75){p.goodStreak=0;p.step=Math.max(0,p.step-1);p.feedback="Rallentiamo un po': consolidiamo il riconoscimento prima di accelerare."}
   else{p.goodStreak=0;p.feedback="Buon allenamento: manteniamo questo ritmo e riproviamo."}
   saveProfile();renderProfile();
  }
 }
 renderResult(completed);
};
renderResult=function(completed){
 const stage=$("stage");const reading=state.mode==="reading";
 const correct=reading?state.readings.filter(x=>x.result==="correct").length:state.correct;
 const assisted=reading?state.readings.filter(x=>x.result==="assisted").length:0;
 const retry=reading?state.readings.filter(x=>x.result==="retry").length:0;
 const times=reading?state.readings.filter(x=>Number.isFinite(x.elapsedMs)).map(x=>x.elapsedMs):[];
 const average=times.length?times.reduce((a,b)=>a+b,0)/times.length:null;
 stage.innerHTML='<div class="result"><div class="trophy">🏆</div><h2>'+(state.gender==="boy"?"BRAVO":"BRAVA")+', '+escapeHtml(state.name.toUpperCase())+'!</h2><p>'+(completed?"Hai completato la tua missione!":"Allenamento terminato!")+'</p><p>'+(reading?"Corrette: "+correct+" · Con aiuto: "+assisted+" · Da riprovare: "+retry:"Risposte corrette: "+correct+" su "+state.index)+'</p><p>'+(reading&&average!==null?"Tempo medio tra avvio microfono e trascrizione: "+(average/1000).toFixed(1)+" s. È una stima che include la latenza del riconoscimento, non una misura standardizzata.":escapeHtml(state.profile?.feedback||"Puoi riprendere quando vuoi."))+'</p><button class="primary" id="again">↻ Continua il percorso</button><button class="primary secondary" id="home">⌂ Torna alla home</button></div>';
 addCelebration(stage);
 $("again").onclick=()=>$("start").click();$("home").onclick=()=>{renderProfile();show("settings")};$("progress").style.width="100%";$("progressLabel").textContent="Missione conclusa";
};


// --- Lettura continua: una sola attivazione del microfono e valutazione finale ---
const flashNext=next, flashFinish=finish, flashRenderResult=renderResult;
Object.assign(state,{readingWords:[],readCursor:0,readingStartedAt:0,readingRecognitionActive:false,readingRecognition:null,readingResultIndex:0,readingLastTranscript:"",readingRating:null});
function startRecognitionCycle(){
 if(!state.readingRecognitionActive || state.readingRecognition)return;
 const C=speechConstructor();
 if(!C){state.speechStatus="Riconoscimento vocale non disponibile: puoi comunque usare la modalità di lettura con valutazione finale.";render();return}
 try{
  const rec=new C();state.readingRecognition=rec;rec.lang="it-IT";rec.continuous=true;rec.interimResults=true;rec.maxAlternatives=3;
  rec.onresult=e=>{
   for(let i=e.resultIndex;i<e.results.length;i++){
    const item=e.results[i];if(!item.isFinal)continue;
    const transcript=Array.from(item).map(x=>x.transcript).join(" ").trim();
    if(transcript)processReadingTranscript(transcript);
    if(!state.readingRecognitionActive)return;
   }
  };
  rec.onerror=e=>{
   if(e.error==="not-allowed"||e.error==="service-not-allowed"){
    state.readingRecognitionActive=false;state.speechStatus="Permesso microfono negato. Puoi concludere e valutare la sessione manualmente.";
   }else state.speechStatus="Ascolto in ripristino…";
   render();
  };
  rec.onend=()=>{
   if(state.readingRecognition===rec)state.readingRecognition=null;
   if(state.readingRecognitionActive){state.speechStatus="Ascolto attivo";setTimeout(startRecognitionCycle,250)}
  };
  rec.start();state.speechStatus="Ascolto attivo";
 }catch(err){state.readingRecognition=null;if(state.readingRecognitionActive){state.speechStatus="Riprovo ad attivare l'ascolto…";setTimeout(startRecognitionCycle,500)}}
}
function processReadingTranscript(transcript){
 if(!state.readingRecognitionActive)return;
 state.readingLastTranscript=transcript;
 const tokens=normalizeSpeech(transcript).split(" ").filter(Boolean);
 for(const token of tokens){
  if(state.readCursor>=state.readingWords.length)break;
  // Cerca la parola attesa nei prossimi tre stimoli: il browser può restituire
  // più parole insieme in un unico risultato finale.
  let found=-1;
  for(let j=state.readCursor;j<Math.min(state.readCursor+4,state.readingWords.length);j++){
   if(normalizeSpeech(state.readingWords[j])===token){found=j;break}
  }
  if(found>=0){
   while(state.readCursor<found){recordReadingWord("uncertain","Parola non rilevata con certezza")}
   recordReadingWord("recognized",transcript);
  }else{
   recordReadingWord("uncertain",transcript);
  }
 }
 if(state.readCursor>=state.readingWords.length){finish(true);return}
 state.index=state.readCursor+1;state.current=state.readingWords[state.readCursor];render();
}
function recordReadingWord(status,transcript){
 const word=state.readingWords[state.readCursor];
 state.readings.push({word,status,transcript:transcript||""});state.readCursor++;
}
function stopContinuousRecognition(){
 state.readingRecognitionActive=false;
 const rec=state.readingRecognition;state.readingRecognition=null;
 if(rec){rec.onend=null;try{rec.stop()}catch{}}
}
next=function(){
 cancel();
 if(state.mode!=="reading"){flashNext();return}
 if(!state.readingWords.length||state.readCursor>=state.readingWords.length){
  const source=shuffle(bank());const amount=state.count>0?state.count:20;
  state.readingWords=source.slice(0,Math.min(amount,source.length));
  state.readCursor=0;state.readings=[];state.readingResultIndex=0;state.readingLastTranscript="";state.readingRating=null;state.readingStartedAt=performance.now();
 }
 if(state.readCursor>=state.readingWords.length){finish(true);return}
 state.index=state.readCursor+1;state.current=state.readingWords[state.readCursor];state.visible=true;state.waiting=false;render();
 if(!state.readingRecognitionActive){state.readingRecognitionActive=true;startRecognitionCycle()}
};
render=function(){
 if(state.mode!=="reading"){const current=state.mode;state.mode=current;flashRender();return}
 const total=state.readingWords.length||state.count||20;
 $("progressLabel").textContent=state.name+" · parola "+Math.min(state.readCursor+1,total)+" / "+total;
 $("progress").style.width=Math.min(100,state.readCursor/total*100)+"%";
 const stage=$("stage");stage.innerHTML="";
 const word=document.createElement("div");word.className="stimulus reading-word";word.textContent=state.current;word.style.fontSize="min("+state.font+"px, 18vw)";stage.append(word);
 const help=document.createElement("p");help.className="reading-help";help.textContent="Leggi ad alta voce e passa naturalmente alla parola successiva: TachiKids resta in ascolto.";stage.append(help);
 const status=document.createElement("p");status.className="speech-status";status.textContent=state.speechStatus||"Attivazione del microfono…";stage.append(status);
 const transcript=document.createElement("p");transcript.className="transcript";transcript.textContent=state.readingLastTranscript?"Ultimo riconoscimento: "+state.readingLastTranscript:"Il testo riconosciuto non viene conservato nel riepilogo.";stage.append(transcript);
 const count=document.createElement("p");count.className="reading-help";count.textContent=state.readings.filter(x=>x.status==="recognized").length+" riconosciute · "+state.readings.filter(x=>x.status==="uncertain").length+" da verificare";stage.append(count);
 const privacy=document.createElement("p");privacy.className="reading-help";privacy.textContent="Il microfono resta attivo durante la sessione. L'audio è gestito dal servizio di riconoscimento del browser; l'app non salva registrazioni.";stage.append(privacy);
 const end=document.createElement("button");end.className="primary secondary";end.textContent="Termina e valuta la sessione";end.onclick=()=>finish(false);stage.append(end);
};
finish=function(completed){
 cancel();
 if(state.mode!=="reading"){flashFinish(completed);return}
 stopContinuousRecognition();
 // Le parole non raggiunte restano da verificare, non sono errori automatici.
 while(state.readCursor<state.readingWords.length)recordReadingWord("unreviewed","");
 state.index=state.readings.length;state.visible=false;state.waiting=false;
 const recognized=state.readings.filter(x=>x.status==="recognized").length;
 const uncertain=state.readings.filter(x=>x.status==="uncertain").length;
 const unreviewed=state.readings.filter(x=>x.status==="unreviewed").length;
 const session={date:new Date().toISOString(),mode:"reading",total:state.readings.length,recognized,uncertain,unreviewed,durationMs:Math.round(performance.now()-(state.readingStartedAt||performance.now())),rating:null,readings:state.readings.map(({word,status})=>({word,status}))};
 if(state.profile){state.profile.sessions.push(session);if(state.profile.sessions.length>100)state.profile.sessions=state.profile.sessions.slice(-100);state.profile.feedback="Sessione di lettura registrata. La valutazione complessiva è a cura dell'adulto.";saveProfile();renderProfile()}
 state.lastReadingSession=session;renderResult(completed);
};
renderResult=function(completed){
 if(state.mode!=="reading"){flashRenderResult(completed);return}
 const s=state.lastReadingSession||{};const stage=$("stage");
 stage.innerHTML='<div class="result reading-result"><div class="result-heading"><div class="trophy">🏆📖</div><div class="result-title-group"><h2>'+(state.gender==="boy"?"BRAVO":"BRAVA")+', '+escapeHtml(state.name.toUpperCase())+'!</h2><p class="encouragement-message">'+getEncouragement()+'</p></div></div><p class="result-subtitle">'+(completed?"Hai completato la tua missione di lettura!":"Sessione di lettura terminata.")+'</p><div class="reading-result-stats"><div class="result-stat result-stat-primary"><strong>'+(s.recognized||0)+'</strong><span>Parole riconosciute</span></div><div class="result-stat"><strong>'+((s.uncertain||0)+(s.unreviewed||0))+'</strong><span>Da verificare</span></div><div class="result-stat"><strong>'+((s.durationMs||0)/1000).toFixed(1)+' s</strong><span>Durata</span></div></div><section class="result-review"><h3>Valutazione dell’adulto</h3><p>La trascrizione automatica è indicativa. Rivedi il risultato e scegli la valutazione più adatta.</p><div class="reading-assessment"><button type="button" class="option" data-rating="fluent">✓ Lettura fluida</button><button type="button" class="option" data-rating="hesitant">◐ Qualche esitazione</button><button type="button" class="option" data-rating="practice">↻ Da consolidare</button></div><p id="ratingFeedback" class="feedback">'+(s.rating?"Valutazione: "+s.rating:"Scegli una valutazione per salvare l’esito.")+'</p></section><div class="result-actions"><button type="button" class="primary" id="again">↻ Nuova sessione</button><button type="button" class="primary secondary" id="home">⌂ Torna alla configurazione</button></div></div>';
 stage.querySelectorAll("[data-rating]").forEach(button=>button.addEventListener("click",()=>{
  const labels={fluent:"Lettura fluida",hesitant:"Qualche esitazione",practice:"Da consolidare"};
  if(!state.lastReadingSession)return;
  state.lastReadingSession.rating=labels[button.dataset.rating];
  if(state.profile){
   const saved=state.profile.sessions.find(item=>item.date===state.lastReadingSession.date);
   if(saved)saved.rating=state.lastReadingSession.rating;
   saveProfile();
  }
  $("ratingFeedback").textContent="Valutazione salvata: "+state.lastReadingSession.rating;
  stage.querySelectorAll("[data-rating]").forEach(item=>{
   item.classList.toggle("correct",item===button);
   item.setAttribute("aria-pressed",item===button?"true":"false");
  });
 }));
 addCelebration(stage);
 // Le azioni sono gestite dal listener delegato sullo stage.
 $("progress").style.width="100%";$("progressLabel").textContent="Sessione conclusa";
};

// Event delegation in capture: controls remain functional after dynamic result rendering.
$("stage").addEventListener("click",event=>{
 const button=event.target.closest("#again, #home");
 if(!button)return;
 event.preventDefault();
 event.stopPropagation();
 event.stopImmediatePropagation();
 try{
  stopContinuousRecognition();
  cancel();
  state.readingWords=[];state.readCursor=0;state.readings=[];
  state.readingLastTranscript="";state.readingRating=null;state.lastReadingSession=null;
  state.readingStartedAt=0;state.readingRecognitionActive=false;
  if(button.id==="again"){
   show("settings");
   $("start").click();
  }else{
   renderProfile();
   show("settings");
   window.scrollTo({top:0,behavior:"smooth"});
  }
 }catch(error){
  console.error("TachiKids: errore nell'azione finale della lettura",error);
  notify("Non riesco a completare l'azione. Riprova.");
 }
},true);


 /* Messaggi brevi e variabili per celebrare l'impegno del bambino */
function getEncouragement(){
 const girl=state.gender!=="boy";
 const messages=girl?["BRAVA","WOW","SUPER","MITICA","FANTASTICA","GRANDE","EVVIVA","FORMIDABILE","URRÀ","SPETTACOLARE"]:["BRAVO","WOW","SUPER","MITICO","FANTASTICO","GRANDE","EVVIVA","FORMIDABILE","URRÀ","SPETTACOLARE"];
 return messages[Math.floor(Math.random()*messages.length)];
}
/* Festeggiamento finale condiviso tra tutte le modalità */
function addCelebration(stage){
 stage.classList.add("celebration-stage");
 const layer=document.createElement("div");layer.className="celebration-confetti";layer.setAttribute("aria-hidden","true");
 const burst=document.createElement("div");burst.className="celebration-burst";
 const effects=["cannon-left","cannon-right","cannon-dual","fireworks","spiral","shower"];
 const effect=effects[Math.floor(Math.random()*effects.length)];
 burst.classList.add("effect-"+effect);
 const palette=["confetti-blue","confetti-orange","confetti-yellow","confetti-pink","confetti-green"];
 for(let i=0;i<76;i++){
  const piece=document.createElement("i");
  const cannon=effect.startsWith("cannon");
  const firework=effect==="fireworks"||effect==="spiral";
  piece.className="confetti-piece "+palette[i%palette.length];
  piece.style.setProperty("--size",(6+Math.random()*10)+"px");
  piece.style.setProperty("--delay",(Math.random()*.65)+"s");
  piece.style.setProperty("--rotation",(Math.random()*1440-720)+"deg");
  if(cannon){
   const side=effect==="cannon-left"?0:effect==="cannon-right"?100:(i%2?0:100);
   piece.classList.add("confetti-shot");
   piece.style.left=side+"%";piece.style.top=(68+Math.random()*20)+"%";
   piece.style.setProperty("--dx",((side===0?1:-1)*(100+Math.random()*250))+"px");
   piece.style.setProperty("--dy",(-180-Math.random()*300)+"px");
   piece.style.setProperty("--fall",(180+Math.random()*260)+"px");
   piece.style.setProperty("--duration",(1.6+Math.random()*1.4)+"s");
  }else if(firework){
   piece.classList.add(effect==="spiral"?"confetti-spiral":"confetti-firework");
   piece.style.left=(20+Math.random()*60)+"%";piece.style.top=(22+Math.random()*38)+"%";
   const angle=Math.random()*Math.PI*2, distance=90+Math.random()*190;
   piece.style.setProperty("--dx",Math.cos(angle)*distance+"px");
   piece.style.setProperty("--dy",Math.sin(angle)*distance+"px");
   piece.style.setProperty("--duration",(1.2+Math.random()*1.1)+"s");
  }else{
   piece.classList.add("confetti-rain");
   piece.style.left=Math.random()*100+"%";piece.style.top="-22px";
   piece.style.setProperty("--drift",(Math.random()*280-140)+"px");
   piece.style.setProperty("--duration",(2.2+Math.random()*2)+"s");
  }
  burst.append(piece);
 }
 for(let i=0;i<16;i++){
  const star=document.createElement("b");star.className="celebration-star";star.textContent=i%2?"✦":"★";
  star.style.setProperty("--sx",(Math.random()*100)+"%");
  star.style.setProperty("--sd",(Math.random()*1.1)+"s");
  star.style.setProperty("--ss",(18+Math.random()*24)+"px");
  burst.append(star);
 }
 layer.append(burst);
 const result=stage.querySelector(".result");
 if(result){
  result.classList.add("celebration-result");
  result.append(layer);
 }else{stage.prepend(layer)}
 if(result){
  const garland=document.createElement("div");garland.className="celebration-garland";
  const entrances=["garland-launch-left","garland-launch-right","garland-pop","garland-drop"];
  garland.classList.add(entrances[Math.floor(Math.random()*entrances.length)]);
  ["🎉","⭐","🎈","✦","🎊","⭐","🎈","✦","🎉"].forEach((symbol,index)=>{
   const flag=document.createElement("span");flag.className="garland-flag flag-"+(index%5);flag.textContent=symbol;garland.append(flag);
  });
  result.prepend(garland);
 }
 const trophy=stage.querySelector(".trophy");if(trophy){trophy.classList.add("trophy-bounce");trophy.setAttribute("aria-hidden","true")}
 const heading=stage.querySelector("h2");if(heading)heading.classList.add("celebration-title");
 const message=stage.querySelector(".encouragement-message");if(message)message.classList.add("encouragement-pop");
 const kicker=document.createElement("div");kicker.className="celebration-kicker";kicker.textContent="✦ MISSIONE COMPIUTA! ✦";
 if(result)result.insertBefore(kicker,result.querySelector("h2"));
}

/* Parole e sillabe: flusso automatico temporizzato, senza conferme */
const continuousNext=next, continuousFinish=finish, continuousRender=render, continuousRenderResult=renderResult;
let autoSequenceTimer=null;
function clearAutoSequence(){if(autoSequenceTimer){clearTimeout(autoSequenceTimer);autoSequenceTimer=null}}
function autoAdvance(){
 clearAutoSequence();
 if(state.mode==="reading"){continuousNext();return}
 if(state.count&&state.index>=state.count){finish(true);return}
 state.index++;state.answer=null;state.waiting=false;
 const b=bank();if(!state.queue.length)state.queue=shuffle(b);
 state.current=state.queue.shift();if($("adaptiveTiming")?.checked)state.exposure=window.TachiContent.exposure(state.current,state.baseExposure||state.exposure);state.visible=true;render();
 autoSequenceTimer=setTimeout(()=>{
  state.visible=false;render();
  autoSequenceTimer=setTimeout(()=>autoAdvance(),Math.max(150,state.pause||500));
 },Math.max(250,state.exposure||900));
}
next=function(){if(state.mode==="reading"){continuousNext();return}autoAdvance()};
render=function(){
 if(state.mode==="reading"){continuousRender();return}
 const total=state.count?" / "+state.count:"";
 $("progressLabel").textContent=state.name+", stimolo "+state.index+total;
 $("progress").style.width=state.count?Math.min(100,state.index/state.count*100)+"%":"0%";
 const training=$("training");
 training.classList.add("focus-sequence");
 const stage=$("stage");stage.innerHTML="";
 if(state.visible){
  const word=document.createElement("div");word.className="stimulus";word.textContent=state.current;
  word.style.fontSize="min("+state.font+"px, 18vw)";stage.append(word);
 }
};
finish=function(completed){
 if(state.mode==="reading"){continuousFinish(completed);return}
 clearAutoSequence();cancel();state.visible=false;state.waiting=false;
 if(completed&&state.index&&state.profile){
  const session={date:new Date().toISOString(),mode:state.mode,level:state.level,total:state.index,exposure:state.exposure,pause:state.pause,completed:true,scored:false};
  state.profile.sessions.push(session);if(state.profile.sessions.length>100)state.profile.sessions=state.profile.sessions.slice(-100);
  state.profile.feedback="Allenamento completato: "+state.index+" stimoli visualizzati in sequenza automatica.";
  saveProfile();renderProfile();
 }
 renderResult(completed);
};
renderResult=function(completed){
 if(state.mode==="reading"){continuousRenderResult(completed);return}
 const stage=$("stage");const mode=state.mode==="syllables"?"sillabe":"parole";
 stage.innerHTML='<div class="result"><div class="trophy">🏆✨</div><h2>'+getEncouragement()+', '+escapeHtml(state.name.toUpperCase())+'!</h2><p>'+(completed?"Missione completata!":"Hai fatto un bellissimo allenamento!")+'</p><p>Hai visualizzato '+state.index+' '+mode+'.</p><p>Tempo di esposizione: '+state.exposure+' ms · Pausa: '+state.pause+' ms.</p><p>La sequenza è stata eseguita automaticamente, senza conferme o interruzioni.</p><button class="primary" id="again">↻ Nuova sessione</button><button class="primary secondary" id="home">⌂ Torna alla home</button></div>';
 addCelebration(stage);
 $("again").onclick=()=>$("start").click();
 $("home").onclick=()=>{renderProfile();show("settings")};
 $("progress").style.width="100%";$("progressLabel").textContent="Sequenza conclusa";
};

$("exposure").oninput=e=>$("exposureValue").textContent=(+e.target.value/1000).toFixed(1)+" s";$("pause").oninput=e=>$("pauseValue").textContent=(+e.target.value/1000).toFixed(1)+" s";syncTimingDefaults();loadWords();updateMode();
/* Generatore di tabelle: usa gli stessi filtri del motore di contenuti */
$("generateTable")?.addEventListener("click",()=>{const words=shuffle(bank());const [rows,cols]=($("tableSize")?.value||"3x4").split("x").map(Number);const amount=rows*cols;if(words.length<amount){notify("Servono almeno "+amount+" parole: amplia i filtri.");return}const out=$("readingTableOutput");out.innerHTML="";const table=document.createElement("div");table.className="reading-table-grid";table.style.setProperty("--cols",cols);words.slice(0,amount).forEach(word=>{const cell=document.createElement("span");cell.textContent=word;table.append(cell)});const tools=document.createElement("div");tools.className="table-actions";const print=document.createElement("button");print.className="text-button";print.textContent="Stampa tabella";print.onclick=()=>window.print();const refresh=document.createElement("button");refresh.className="text-button";refresh.textContent="Genera un'altra";refresh.onclick=()=>$("generateTable").click();tools.append(print,refresh);out.append(table,tools);out.classList.remove("hidden")});

/* Liste personali salvate localmente sul dispositivo */
try{const savedList=localStorage.getItem("tachikids-custom-list-v1");if(savedList&&$("customList"))$("customList").value=savedList}catch{}
$("customList")?.addEventListener("input",e=>{try{localStorage.setItem("tachikids-custom-list-v1",e.target.value)}catch{}});
