/* ============ 3. LÓGICA DO QUIZ ============ */
const QUIZ = perguntas.filter(valida);
const BRANCOS_MAX = Math.max(1, Math.floor(QUIZ.length * 3 / 15)); // 3 de 15, proporcional
const KEY = "eqev_v2";
let st = {tela:"inicio", i:0, resp:[]};
try{ const s = JSON.parse(localStorage.getItem(KEY)||"null"); if(s && Array.isArray(s.resp) && s.resp.length<=QUIZ.length) st = s; }catch(e){}
const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){} };
const brancos = () => st.resp.filter(x=>x==="branco").length;
const $ = s => document.querySelector(s);
const app = $("#app");
const LBL = {sim:"SIM", nao:"NÃO", branco:"BRANCO", sem_posicionamento:"sem posição", neutro:"neutro"};

function toast(m){ const t=document.createElement("div"); t.className="toast"; t.textContent=m; document.body.appendChild(t); setTimeout(()=>t.remove(),2600); }
function ir(tela){ st.tela = tela; save(); render(); window.scrollTo(0,0); }
function reiniciar(){ st = {tela:"inicio", i:0, resp:[]}; save(); render(); }
function beep(){try{const c=window._ac||(window._ac=new (window.AudioContext||window.webkitAudioContext)()),o=c.createOscillator(),g=c.createGain();o.frequency.value=900;g.gain.value=.07;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.14)}catch(e){}}
function responder(v){
  beep();
  if(v==="branco" && brancos() >= BRANCOS_MAX && st.resp[st.i] !== "branco"){ toast(`Você já utilizou seus ${BRANCOS_MAX} votos em branco.`); return; }
  st.resp[st.i] = v; save(); render();
}
function irPara(i){
  if(i > st.resp.length){ toast("Responda as perguntas anteriores primeiro."); return; }
  st.i = i; save(); render();
}
function proxima(){
  if(!st.resp[st.i]){ toast("Escolha uma opção para continuar."); return; }
  if(st.i < QUIZ.length-1){ st.i++; save(); render(); } else ir("resultado");
}
