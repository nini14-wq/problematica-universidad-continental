'use strict';

const cycleData = [
  {kicker:'EXIGENCIA → ESTRÉS',symbol:'↗',name:'«No me alcanza el tiempo».',description:'Exámenes, entregas y poco control sobre el tiempo pueden elevar la ansiedad. La atención se desplaza hacia lo que se percibe como una amenaza.',example:'Lees el mismo párrafo mientras piensas en todo lo que falta por hacer.'},
  {kicker:'ESTRÉS → SENSACIÓN',symbol:'≈',name:'El cuerpo también responde.',description:'Pueden aparecer tensión muscular, respiración más rápida o inquietud. La interocepción nos permite notar estas señales internas; su significado depende del contexto.',example:'Notas los hombros tensos y el pulso acelerado al abrir la guía del examen.'},
  {kicker:'SENSACIÓN → CRAVING',symbol:'◎',name:'«Necesito vapear».',description:'Las sensaciones, las expectativas de alivio y las señales aprendidas pueden acompañar el deseo intenso de consumir. En personas con dependencia, la abstinencia también puede contribuir al malestar.',example:'La incomodidad coincide con la idea de buscar el vapeador y abandonar la lectura.'},
  {kicker:'CONSUMO → ASOCIACIÓN APRENDIDA',symbol:'↻',name:'Un alivio que enseña a repetir.',description:'Cuando se percibe alivio después de consumir, se puede reforzar esa respuesta al malestar. En la dependencia, aliviar síntomas de abstinencia también puede sostener el uso de nicotina.',example:'La siguiente vez que estudiar genera tensión, reaparece la expectativa de una pausa para vapear.'}
];
const mindData = [
  {kicker:'DEL CUERPO A LA INTERPRETACIÓN',glyph:'◎',label:'SEÑAL → SIGNIFICADO',name:'Sentir no es lo mismo que necesitar consumir.',description:'La interocepción es la percepción de las señales internas del cuerpo. La ansiedad puede influir en cómo se interpretan el pulso, la respiración o la tensión muscular.',example:'«Siento tensión» describe una sensación. «Tengo que vapear» es una interpretación y un impulso de actuar.',limit:'La idea de «falsa alarma» sirve como analogía perceptiva; no permite distinguir por sí sola ansiedad y abstinencia.'},
  {kicker:'MANTENER EL FOCO',glyph:'↗',label:'TAREA ↔ DISTRACCIÓN',name:'La atención tiene competencia.',description:'Mantener la lectura requiere atención sostenida. Las preocupaciones, el craving y las señales relacionadas con el consumo pueden desviar el foco de la tarea académica.',example:'Sigues mirando el texto, pero tu atención vuelve una y otra vez al vapeador que está sobre la mesa.',limit:'La captura por señales externas y la distracción por pensamientos internos son procesos distintos que pueden coexistir.'},
  {kicker:'RETENER Y TRABAJAR CON INFORMACIÓN',glyph:'≋',label:'LEER → RETENER → CONECTAR',name:'Hay menos espacio para procesar.',description:'La memoria de trabajo permite mantener y manipular información mientras lees. La rumiación y los pensamientos sobre consumo pueden competir con esa tarea.',example:'Llegas al final de una frase larga y necesitas volver al principio para reconstruir su significado.',limit:'La «RAM» es una metáfora didáctica. Los estudios de conectividad no demuestran un bloqueo literal del ejecutivo central o del bucle fonológico.'},
  {kicker:'ORIENTAR LA CONDUCTA A UN OBJETIVO',glyph:'⌁',label:'OBSERVAR → AJUSTAR → ELEGIR',name:'Cambiar la respuesta es una habilidad.',description:'El control inhibitorio ayuda a frenar respuestas automáticas; la flexibilidad cognitiva permite probar alternativas; y el monitoreo metacognitivo ayuda a reconocer lo que está ocurriendo.',example:'Notas el impulso, nombras la sensación y eliges una pausa de movimiento antes de retomar el estudio.',limit:'La autorregulación no equivale a una reserva fija de energía cerebral. Dificultarse para regular el consumo no define el valor moral de una persona.'}
];

const keywordPattern=/(atención sostenida|control inhibitorio|flexibilidad cognitiva|monitoreo metacognitivo|memoria de trabajo|interocepción|rumiación|abstinencia|craving)/gi;
function setText(id,value){
  const element=document.getElementById(id);element.textContent=value;
  if(['cycle-description','mind-description'].includes(id)){
    const fragments=String(value).split(keywordPattern);
    element.replaceChildren(...fragments.map((part,i)=>{if(i%2){const mark=document.createElement('mark');mark.textContent=part;return mark;}return document.createTextNode(part);}));
  }
}
['cycle-description','mind-description'].forEach(id=>setText(id,document.getElementById(id).textContent));
function selectTab(button,buttons){buttons.forEach(b=>{const active=b===button;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;b.classList.toggle('active',active);});}
function tabKeyboard(list,orientation='horizontal'){
  list.addEventListener('keydown',event=>{
    const items=[...list.querySelectorAll('[role="tab"]')];
    const current=items.indexOf(document.activeElement);if(current<0)return;
    const next=orientation==='vertical'?'ArrowDown':'ArrowRight';const previous=orientation==='vertical'?'ArrowUp':'ArrowLeft';
    let index=current;
    if(event.key===next)index=(current+1)%items.length;
    else if(event.key===previous)index=(current-1+items.length)%items.length;
    else if(event.key==='Home')index=0;
    else if(event.key==='End')index=items.length-1;
    else return;
    event.preventDefault();items[index].click();items[index].focus();
  });
}
const cycleButtons=[...document.querySelectorAll('[data-cycle]')];
cycleButtons.forEach(button=>button.addEventListener('click',()=>{
  selectTab(button,cycleButtons);const data=cycleData[Number(button.dataset.cycle)];
  ['kicker','symbol','name','description','example'].forEach(key=>setText(`cycle-${key}`,data[key]));
  document.getElementById('cycle-panel').setAttribute('aria-labelledby',button.id);
}));
const mindButtons=[...document.querySelectorAll('[data-mind]')];
mindButtons.forEach(button=>button.addEventListener('click',()=>{
  selectTab(button,mindButtons);const data=mindData[Number(button.dataset.mind)];
  ['kicker','glyph','name','description','example','limit'].forEach(key=>setText(`mind-${key}`,data[key]));
  setText('mind-visual-label',data.label);
  document.getElementById('mind-panel').setAttribute('aria-labelledby',button.id);
}));
const frameworkButtons=[...document.querySelectorAll('[data-framework]')];
frameworkButtons.forEach(button=>button.addEventListener('click',()=>{
  selectTab(button,frameworkButtons);
  ['bio','social'].forEach(type=>{document.getElementById(`${type}-panel`).hidden=button.dataset.framework!==type;});
}));
document.querySelectorAll('[role="tablist"]').forEach(list=>tabKeyboard(list,list.getAttribute('aria-orientation')||'horizontal'));

const terms={
  craving:['Craving','Deseo intenso de consumir una sustancia. Puede aparecer ante señales externas, emociones, hábitos aprendidos o abstinencia. Sentirlo no obliga a actuar sobre él.'],
  interocepcion:['Interocepción','Proceso por el que percibimos e interpretamos señales del interior del cuerpo, como el latido, la respiración, el hambre o la tensión visceral. La atención y las expectativas influyen en esa experiencia.'],
  rumiacion:['Rumiación','Pensamiento repetitivo que vuelve a preocupaciones o malestar y puede dificultar centrar la atención en la tarea presente. No equivale simplemente a reflexionar sobre un problema.'],
  metacognicion:['Metacognición','Capacidad de observar y evaluar los propios procesos mentales. Por ejemplo: «Mi atención se está desviando; puedo hacer una pausa y decidir cómo continuar».']
};
const glossary=document.getElementById('glossary-dialog');let glossaryTrigger;
document.querySelectorAll('[data-term]').forEach(button=>button.addEventListener('click',()=>{
  glossaryTrigger=button;const [title,definition]=terms[button.dataset.term];setText('glossary-title',title);setText('glossary-definition',definition);glossary.showModal();
}));
document.getElementById('close-glossary').addEventListener('click',()=>glossary.close());
glossary.addEventListener('click',event=>{if(event.target===glossary){const rect=glossary.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)glossary.close();}});
glossary.addEventListener('close',()=>glossaryTrigger?.focus());

const phases=[
  {title:'OBSERVA',prompt:'¿Dónde sientes el impulso?',instruction:'Nota el cuerpo con curiosidad. Localiza la sensación sin intentar cambiarla. Respira de forma natural.'},
  {title:'NOMBRA',prompt:'Ponle nombre a la sensación.',instruction:'Prueba una descripción: «Siento tensión en los hombros» o «Noto inquietud». Observa si cambia.'},
  {title:'ELIGE',prompt:'Dale espacio a tu siguiente paso.',instruction:'Puedes tomar agua, moverte un momento o volver a un párrafo. Elige una acción sin apresurarte.'}
];
const timerStart=document.getElementById('timer-start');const timerReset=document.getElementById('timer-reset');
let timerStatus='idle',remaining=90000,endAt=0,timerInterval=null,currentPhase=-1;
function updateTimer(){
  if(timerStatus==='running')remaining=Math.max(0,endAt-Date.now());
  const seconds=Math.ceil(remaining/1000);
  setText('timer-time',`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`);
  document.getElementById('timer-ring').style.strokeDashoffset=String(100-(remaining/90000*100));
  if(remaining<=0&&timerStatus==='running'){finishTimer();return;}
  if(timerStatus==='running'||timerStatus==='paused'){
    const phase=Math.min(2,Math.floor((90000-remaining)/30000));
    if(phase!==currentPhase){currentPhase=phase;setText('timer-phase',phases[phase].title);setText('timer-prompt',phases[phase].prompt);setText('timer-instruction',phases[phase].instruction);document.querySelectorAll('.practice-steps li').forEach((li,i)=>li.classList.toggle('current',i===phase));}
  }
}
function finishTimer(){
  clearInterval(timerInterval);timerInterval=null;timerStatus='finished';
  remaining=0;setText('timer-time','00:00');document.getElementById('timer-ring').style.strokeDashoffset='100';
  setText('timer-state','PAUSA COMPLETADA');setText('timer-phase','OBSERVASTE · NOMBRASTE · ELEGISTE');setText('timer-prompt','Has creado un espacio.');setText('timer-instruction','El impulso puede seguir presente. Nota cómo estás y elige con calma tu siguiente acción.');timerStart.textContent='Practicar de nuevo ↗';document.querySelectorAll('.practice-steps li').forEach(li=>li.classList.remove('current'));
}
function resetTimer(){
  clearInterval(timerInterval);timerInterval=null;remaining=90000;timerStatus='idle';currentPhase=-1;
  setText('timer-state','A TU RITMO');setText('timer-phase','UN ESPACIO PARA TI');setText('timer-prompt','Haz espacio antes de actuar.');setText('timer-instruction','Siéntate como te resulte cómodo y respira a tu ritmo. Empieza cuando quieras.');timerStart.textContent='Comenzar la pausa ↗';timerReset.disabled=true;document.querySelectorAll('.practice-steps li').forEach((li,i)=>li.classList.toggle('current',i===0));updateTimer();
}
timerStart.addEventListener('click',()=>{
  if(timerStatus==='running'){remaining=Math.max(0,endAt-Date.now());clearInterval(timerInterval);timerInterval=null;if(remaining<=0){finishTimer();return;}timerStatus='paused';setText('timer-state','EN PAUSA');timerStart.textContent='Continuar la pausa ↗';updateTimer();}
  else{if(timerStatus==='finished')resetTimer();timerStatus='running';endAt=Date.now()+remaining;timerReset.disabled=false;setText('timer-state','EN ESTE MOMENTO');timerStart.textContent='Pausar Ⅱ';updateTimer();timerInterval=setInterval(updateTimer,200);}
});
timerReset.addEventListener('click',resetTimer);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&timerStatus==='running')updateTimer();});

['before','after'].forEach(id=>document.getElementById(id).addEventListener('input',()=>{
  setText(`${id}-value`,`${document.getElementById(id).value} / 10`);
  const before=Number(document.getElementById('before').value),after=Number(document.getElementById('after').value);
  setText('reflection-message',after<before?'La intensidad bajó. Observa qué notas ahora, sin exigir que siempre ocurra igual.':after>before?'La intensidad subió. Puedes terminar la práctica y buscar una forma de apoyo que te resulte cómoda.':'Observar también cuenta, aunque la intensidad no cambie.');
}));
const highlightButton=document.getElementById('highlight-toggle');highlightButton.addEventListener('click',()=>{const off=document.body.classList.toggle('no-highlights');highlightButton.setAttribute('aria-pressed',String(!off));setText('highlight-state',off?'INACTIVO':'ACTIVO');});

const menuToggle=document.querySelector('.menu-toggle'),nav=document.getElementById('main-nav');
function closeMenu(){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Abrir menú');}
menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menuToggle.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
function updateReadingProgress(){const height=document.documentElement.scrollHeight-window.innerHeight;document.getElementById('reading-progress').style.width=`${height>0?Math.min(100,Math.max(0,window.scrollY/height*100)):0}%`;}
window.addEventListener('scroll',updateReadingProgress,{passive:true});window.addEventListener('resize',updateReadingProgress);updateReadingProgress();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.hash===`#${entry.target.id}`));}});},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));}

const video=document.getElementById('topic-video'),videoPlay=document.getElementById('video-play');
videoPlay.addEventListener('click',async()=>{
  if(video.paused){try{await video.play();setText('video-status','');}catch{setText('video-status','Usa el control de reproducción del video para comenzar.');}}
  else video.pause();
});
video.addEventListener('play',()=>{videoPlay.textContent='Pausar video Ⅱ';});
video.addEventListener('pause',()=>{videoPlay.textContent='Reproducir video ↗';});
video.addEventListener('ended',()=>{videoPlay.textContent='Reproducir de nuevo ↗';});
document.getElementById('video-reset').addEventListener('click',()=>{video.pause();video.currentTime=0;setText('video-status','Video listo para reproducir desde el inicio.');});
