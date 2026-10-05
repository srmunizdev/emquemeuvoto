/* ============ 2. CÁLCULO (função pura e auditável) ============ */
const valida = p => ["lula","flavioBolsonaro"].every(k => ["sim","nao"].includes(p.candidatos[k].posicao));
function calcularResultado(respostasUsuario, perguntas){
  const r = {lula:{pontos:0,respostasValidas:0,percentual:0}, flavioBolsonaro:{pontos:0,respostasValidas:0,percentual:0}, votosBrancos:0};
  perguntas.forEach((p,i) => {
    const a = respostasUsuario[i];
    if(a === "branco"){ r.votosBrancos++; return; }
    if(!["sim","nao"].includes(a) || !valida(p)) return;
    for(const k of ["lula","flavioBolsonaro"]){
      r[k].respostasValidas++;
      if(p.candidatos[k].posicao === a) r[k].pontos++;
    }
  });
  for(const k of ["lula","flavioBolsonaro"]){
    const c = r[k]; c.percentual = c.respostasValidas ? +(c.pontos/c.respostasValidas*100).toFixed(2) : 0;
  }
  return r;
}
