/* ============ 4. TELAS ============ */
function telaInicio(){
  const retomar = st.resp.length ? `<button style="width:100%;margin-top:10px" onclick="ir('quiz')">Continuar de onde parei</button>` : "";
  return `<div class="card"><h1>Em Quem Eu Voto?</h1><p class="big">Descubra com qual candidato suas opiniões estão mais alinhadas.</p>
  <p>Responda ${QUIZ.length} perguntas sobre propostas e posicionamentos. O nome dos candidatos não será mostrado durante o quiz para que suas respostas sejam baseadas apenas no que você pensa.</p>
  <p class="mut">Este teste não indica em quem você deve votar. Ele apenas compara suas respostas com as posições cadastradas dos candidatos.</p>
  <button class="pri" onclick="st={tela:'quiz',i:0,resp:[]};save();render()">Começar o quiz</button>${retomar}
  <p style="text-align:center"><a href="#" onclick="metodoCompleto=false;ir('metodo');return false">Como funciona?</a></p></div>`;
}
function telaQuiz(){
  const p = QUIZ[st.i], a = st.resp[st.i], n = QUIZ.length, lim = brancos() >= BRANCOS_MAX && a !== "branco";
  const k = (v,t,off) => `<button class="tecla ${v} ${a===v?"on":""} ${off?"off":""}" aria-label="Voto ${t}" onclick="responder('${v}')">${t}</button>`;
  return `<div class="top"><span>Pergunta ${st.i+1} de ${n}</span><span class="mut">Votos em branco: ${brancos()}/${BRANCOS_MAX}</span></div>
  <div class="bar"><i style="width:${(st.i+(a?1:0))/n*100}%"></i></div>
  <div class="nav" aria-label="Ir para outra pergunta">${QUIZ.map((_,j)=>`<button class="${st.resp[j]?"feito":""} ${j===st.i?"atual":""}" ${j>st.resp.length?"disabled":""} onclick="irPara(${j})" aria-label="Pergunta ${j+1}">${j+1}</button>`).join("")}</div>
  <div class="card" style="margin-top:16px"><span class="tag">${p.tema}</span><p class="big" style="margin-top:12px">${p.pergunta}</p>
  <div class="painel"><div class="teclado">${k("branco","BRANCO",lim)}${k("nao","NÃO")}${k("sim","SIM")}</div></div>
  <div class="sp">${st.i>0?`<button onclick="st.i--;save();render()">Voltar</button>`:""}
  <button class="pri" style="flex:2" onclick="proxima()">${st.i===n-1?"Ver meu resultado":"Próxima"}</button></div></div>`;
}
const barra = (nome,c) => `<div class="row"><span>${nome}</span><span>${c.percentual.toFixed(0)}%</span></div><div class="bar"><i style="width:${c.percentual}%"></i></div>`;
function telaResultado(){
  if(st.resp.length < QUIZ.length){ st.tela="quiz"; return telaQuiz(); } // proteção: respostas incompletas
  const r = calcularResultado(st.resp, QUIZ), L = r.lula, F = r.flavioBolsonaro, cl = CANDIDATOS.lula, cf = CANDIDATOS.flavioBolsonaro;
  const card = (c,x) => `<div class="c"><div class="av"><img src="${c.imagem}" alt="${c.nome}" onerror="this.style.visibility='hidden'"></div><b>${c.nome}</b><div class="mut">Número ${c.numero}</div><div class="pct">${x.percentual.toFixed(0)}%</div></div>`;
  let topo, txt;
  if(!L.respostasValidas){
    topo = `<h2>Seu resultado</h2><p class="big">Não foi possível calcular o alinhamento.</p><p>Todas as suas respostas foram em branco, então não há respostas válidas para comparar.</p>`;
    txt = "Fiz o teste Em Quem Eu Voto? e descobri com qual candidato minhas opiniões estão mais alinhadas.";
  } else if(L.pontos === F.pontos){
    topo = `<h2>Seu resultado</h2><p class="big">Você está igualmente alinhado com os dois candidatos.</p><div class="two">${card(cl,L)}${card(cf,F)}</div>`;
    txt = "Fiz o teste Em Quem Eu Voto? e descobri com qual candidato minhas opiniões estão mais alinhadas. Resultado: igualmente alinhado com os dois.";
  } else {
    const w = L.pontos > F.pontos ? [cl,L] : [cf,F];
    topo = `<h2>Seu resultado</h2><p class="big" style="text-align:center">Suas respostas apresentam maior alinhamento com...</p>${card(w[0],w[1])}<p class="c mut">de alinhamento</p>`;
    txt = `Fiz o teste Em Quem Eu Voto? e descobri com qual candidato minhas opiniões estão mais alinhadas. Resultado: maior alinhamento com ${w[0].nome} (${w[1].percentual.toFixed(0)}%).`;
  }
  window._txtBase = txt; window._txt = txt + "\n" + urlSite();
  const linhas = QUIZ.map((p,i) => {
    const a = st.resp[i], m = k => p.candidatos[k].posicao === a;
    return `<div class="q"><b>Pergunta ${i+1}</b><div class="mut">${p.pergunta}</div><div>Sua resposta: <b>${LBL[a]}</b></div>
    ${a==="branco"?`<div class="mut">Essa resposta não foi considerada na pontuação de nenhum candidato.</div>`:
    `<div>${cl.nome}: ${LBL[p.candidatos.lula.posicao]} ${m("lula")?'<span class="ok">✓</span>':""}</div><div>${cf.nome}: ${LBL[p.candidatos.flavioBolsonaro.posicao]} ${m("flavioBolsonaro")?'<span class="ok">✓</span>':""}</div>`}</div>`;
  }).join("");
  return `<div class="card">${topo}
  ${L.respostasValidas?`<h3>Comparação</h3>${barra(cl.nome,L)}${barra(cf.nome,F)}`:""}
  <details><summary>Ver por que esse foi meu resultado</summary>
   <p>Você respondeu ${QUIZ.length} perguntas. Foram consideradas ${L.respostasValidas} respostas, pois você utilizou ${r.votosBrancos} voto(s) em branco.</p>
   <p>${cl.nome}: você concordou com ${L.pontos} de ${L.respostasValidas} posições analisadas (${L.percentual}%).<br>${cf.nome}: você concordou com ${F.pontos} de ${F.respostasValidas} posições analisadas (${F.percentual}%).</p>
   <details><summary>Ver minhas respostas</summary>${linhas}</details></details>
  <details><summary>Como calculamos seu resultado?</summary><p>O resultado é baseado exclusivamente nas suas respostas e na correspondência entre elas e as posições cadastradas para cada candidato. Votos em branco não pontuam para ninguém e saem do cálculo.</p>
  <p class="mut">Este resultado não representa uma recomendação de voto e não prevê qual candidato é melhor. Ele apenas mostra qual candidato possui maior correspondência com as respostas fornecidas.</p></details>
  <button style="width:100%;margin-top:14px" onclick="metodoCompleto=true;ir('metodo')">Ver fontes e metodologia</button>
  <h3>Compartilhe seu resultado</h3><div class="sp">
  <button onclick="window.open('https://wa.me/?text='+encodeURIComponent(_txt),'_blank')">WhatsApp</button>
  <button onclick="compartilhar()">Instagram</button><button onclick="copiar()">Copiar resultado</button></div>
  <p class="mut">Só o resultado final é compartilhado, nunca suas respostas individuais.</p>
  <button style="width:100%;margin-top:8px" onclick="st.tela='quiz';st.i=0;save();render();window.scrollTo(0,0)">Alterar minhas respostas</button><button style="width:100%;margin-top:8px" onclick="reiniciar()">Refazer o quiz</button></div>`;
}
function urlSite(){ return location.href.split("#")[0].split("?")[0]; }
function compartilhar(){
  if(navigator.share){ navigator.share({title:"Em Quem Eu Voto?", text:_txtBase, url:urlSite()}).catch(()=>{}); }
  else copiar(true);
}
function copiar(insta){
  const ok = () => toast(insta ? "Texto copiado. Cole no Instagram (story ou mensagem)." : "Resultado copiado!");
  if(navigator.clipboard) navigator.clipboard.writeText(_txt).then(ok, () => toast("Não foi possível copiar."));
  else toast("Não foi possível copiar.");
}
let metodoCompleto = false; // só vira true ao abrir a metodologia pela tela de resultado
function telaMetodo(){
  const item = (c,k) => { const x = c.candidatos[k]; return x.fonte ? `<div class="mut">${CANDIDATOS[k].nome}: <b>${LBL[x.posicao]}</b>. <a href="${x.fonte}" target="_blank" rel="noopener">${x.tituloFonte}</a> (${x.data}; consultado em ${x.consultadoEm})${x.base==="campo"?" [posição do partido/campo]":""}${x.nota?` — ${x.nota}`:""}</div>` : `<div class="mut">${CANDIDATOS[k].nome}: ${x.nota||"sem posição verificada"}</div>`; };
  const bloco = lista => lista.map(p => `<div class="q"><b>${p.tema}</b>: ${p.pergunta}${item(p,"lula")}${item(p,"flavioBolsonaro")}</div>`).join("");
  return `<div class="card"><h2>Como funciona?</h2><ol>
  <li>As perguntas são baseadas em propostas e posicionamentos públicos.</li><li>O candidato não é identificado durante o quiz.</li>
  <li>Cada resposta é comparada com os posicionamentos cadastrados.</li><li>O voto em branco não favorece nenhum candidato.</li>
  <li>O resultado representa apenas compatibilidade de respostas.</li><li>O resultado não é uma recomendação de voto.</li></ol>
  <p class="mut">${perguntas.some(p=>Object.values(p.candidatos).some(c=>c.base==="campo"))?"Posições marcadas como [partido/campo] representam a posição do PT ou do PL, usadas quando não há manifestação do próprio candidato. ":""}Uma pergunta só entra no cálculo se a posição dos dois candidatos estiver documentada. Onde não há evidência, nenhuma posição é presumida.</p>
  ${metodoCompleto?`<h3>Fontes das perguntas do quiz</h3>${bloco(QUIZ)}
  <h3>Propostas em verificação (fora do cálculo)</h3>${bloco(perguntas.filter(p=>!valida(p)))}`:`<p class="mut">As fontes e as posições de cada proposta ficam disponíveis ao final do quiz, para que os candidatos não sejam identificados durante as perguntas.</p>`}
  <button class="pri" style="margin-top:16px" onclick="ir(st.resp.length>=QUIZ.length?'resultado':st.resp.length?'quiz':'inicio')">Voltar</button></div>`;
}
function render(){
  app.innerHTML = {inicio:telaInicio, quiz:telaQuiz, resultado:telaResultado, metodo:telaMetodo}[st.tela]();
}
