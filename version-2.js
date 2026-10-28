'use strict';

const byId=id=>document.getElementById(id);
const text=(id,value)=>{byId(id).textContent=value;};
const contents=byId('contents-menu');
const compact=matchMedia('(max-width:650px)');
if(compact.matches)contents.open=false;
compact.addEventListener('change',event=>{contents.open=!event.matches;});
contents.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{if(compact.matches)contents.open=false;}));
byId('highlight-toggle').addEventListener('click',()=>{const off=document.body.classList.toggle('no-highlights');byId('highlight-toggle').setAttribute('aria-pressed',String(!off));text('highlight-state',off?'INACTIVAS':'ACTIVAS');});
byId('text-size').addEventListener('click',()=>{const large=document.body.classList.toggle('large-text');byId('text-size').setAttribute('aria-pressed',String(large));byId('text-size').firstChild.textContent=large?'A− ':'A+ ';byId('text-size').querySelector('span').textContent=large?'Tamaño normal':'Ampliar texto';byId('text-size').title=large?'Volver al tamaño normal':'Ampliar el texto para exponer';updateProgress();});
function updateProgress(){const height=document.documentElement.scrollHeight-innerHeight;byId('progress').style.width=`${height>0?Math.min(100,Math.max(0,scrollY/height*100)):0}%`;}
addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)contents.querySelectorAll('a').forEach(a=>{const active=a.hash===`#${entry.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});});},{rootMargin:'-12% 0px -72% 0px',threshold:0});document.querySelectorAll('.source-section,.source-article[id],.framework-group,.practice,#video').forEach(section=>observer.observe(section));}

const phaseData=[
  ['OBSERVA','¿Dónde notas la sensación?','Observa el cuerpo con curiosidad. Respira a tu ritmo, sin forzar que la sensación cambie.'],
  ['NOMBRA','Describe lo que sientes.','Por ejemplo: «Siento tensión en los hombros». Observa la sensación sin convertirla en una orden de actuar.'],
  ['ELIGE','Decide tu siguiente paso.','Puedes tomar agua, moverte un momento o volver a un párrafo. El impulso no exige una respuesta inmediata.']
];
let state='idle',remaining=90000,endAt=0,interval=null,phase=-1;
const start=byId('timer-start'),reset=byId('timer-reset');
function finish(){clearInterval(interval);interval=null;state='finished';remaining=0;text('timer-time','00:00');text('timer-state','PAUSA COMPLETADA');text('timer-title','Has creado un espacio.');text('timer-description','Observa cómo estás ahora. La intensidad puede cambiar o mantenerse; elige tu siguiente acción con calma.');byId('timer-progress').style.width='100%';start.textContent='Practicar de nuevo ↗';document.querySelectorAll('.phases li').forEach(li=>li.classList.remove('current'));}
function render(){
  if(state==='running')remaining=Math.max(0,endAt-Date.now());
  const seconds=Math.ceil(remaining/1000);text('timer-time',`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`);
  byId('timer-progress').style.width=`${100-remaining/90000*100}%`;
  if(state==='running'&&remaining<=0){finish();return;}
  if(state==='running'||state==='paused'){
    const next=Math.min(2,Math.floor((90000-remaining)/30000));
    if(next!==phase){phase=next;const data=phaseData[phase];text('timer-state',state==='paused'?'EN PAUSA':data[0]);text('timer-title',data[1]);text('timer-description',data[2]);document.querySelectorAll('.phases li').forEach((li,i)=>li.classList.toggle('current',i===phase));}
  }
}
function resetTimer(){clearInterval(interval);interval=null;state='idle';remaining=90000;phase=-1;reset.disabled=true;start.textContent='Comenzar ↗';text('timer-state','A TU RITMO');text('timer-title','Un espacio antes de actuar.');text('timer-description','Respira a tu ritmo y comienza cuando quieras.');document.querySelectorAll('.phases li').forEach((li,i)=>li.classList.toggle('current',i===0));render();}
start.addEventListener('click',()=>{
  if(state==='running'){remaining=Math.max(0,endAt-Date.now());if(remaining<=0){finish();return;}clearInterval(interval);interval=null;state='paused';text('timer-state','EN PAUSA');start.textContent='Continuar ↗';render();}
  else{if(state==='finished')resetTimer();state='running';endAt=Date.now()+remaining;text('timer-state',phaseData[Math.max(0,phase)][0]);reset.disabled=false;start.textContent='Pausar Ⅱ';render();interval=setInterval(render,200);}
});
reset.addEventListener('click',resetTimer);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state==='running')render();});

const video=byId('topic-video'),play=byId('video-play');
play.addEventListener('click',async()=>{if(video.paused){try{await video.play();text('video-status','');}catch{text('video-status','Usa el control de reproducción del video para comenzar.');}}else video.pause();});
video.addEventListener('play',()=>{play.textContent='Pausar video Ⅱ';});
video.addEventListener('pause',()=>{play.textContent='Reproducir video ↗';});
video.addEventListener('ended',()=>{play.textContent='Reproducir de nuevo ↗';});
byId('video-reset').addEventListener('click',()=>{video.pause();video.currentTime=0;text('video-status','Video listo para reproducir desde el inicio.');});
