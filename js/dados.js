/* ============ 1. DADOS (única estrutura a editar) ============
   - posicao: "sim" | "nao" | "neutro" | "sem_posicionamento"
   - base:    "candidato" (posição do próprio candidato/governo) ou "campo" (posição do partido/campo PT ou PL,
              usada quando não há manifestação do próprio candidato). Fica visível na página de metodologia.
   - Só entram no quiz as perguntas em que os DOIS lados são "sim" ou "nao".
*/
const CONSULTADO = "2026-10-04";

const CANDIDATOS = {
  lula: {nome: "Luiz Inácio Lula da Silva", numero: "13", imagem: "assets/images/lula.jpg"},
  flavioBolsonaro: {nome: "Flávio Bolsonaro", numero: "22", imagem: "assets/images/flavio.jpg"}
};

/* Registro de fontes: escreva uma vez, reutilize nas perguntas */
const FONTES = {
  plLula:   {url:"https://planodegoverno2026.com.br/candidatos/presidente/lula/", titulo:"Plano de governo de Lula 2026 (cópia do TSE)", data:"2026-08-07"},
  plFlavio: {url:"https://planodegoverno2026.com.br/candidatos/presidente/flavio-bolsonaro/", titulo:"Plano de governo de Flávio Bolsonaro 2026 (cópia do TSE)", data:"2026-08-13"},
  p360:     {url:"https://www.poder360.com.br/poder-eleicoes-2026/eleicoes-2026-compare-os-planos-de-governo-de-lula-e-flavio/", titulo:"Poder360: compare os planos de governo de Lula e Flávio", data:"2026-08-21"},
  p360_6x1: {url:"https://www.poder360.com.br/poder-eleicoes-2026/flavio-deixa-fim-da-escala-6-x-1-fora-do-plano-de-governo/", titulo:"Poder360: Flávio deixa fim da escala 6x1 fora do plano", data:"2026-08-13"},
  p360Lula: {url:"https://www.poder360.com.br/poder-eleicoes-2026/plano-de-governo-de-lula-em-2026-troca-reconstrucao-por-legado/", titulo:"Poder360: plano de governo de Lula em 2026", data:"2026-08-21"},
  band:     {url:"https://www.band.com.br/politica/eleicoes/eleicoes-2026-conheca-as-propostas-e-o-perfil-de-flavio-bolsonaro-pl", titulo:"Band: propostas e perfil de Flávio Bolsonaro", data:"2026-08-29"},
  gdpSeg:   {url:"https://www.gazetadopovo.com.br/eleicoes/2026/propostas-flavio-bolsonaro-plano-de-governo-seguranca-publica/", titulo:"Gazeta do Povo: propostas de segurança de Flávio", data:"2026-08-19"},
  jb:       {url:"https://jornaldebrasilia.com.br/noticias/politica-e-poder/lula-foca-no-controle-da-policia-e-flavio-bolsonaro-promete-reducao-da-maioridade-e-castracao-quimica/", titulo:"Jornal de Brasília: comparativo de segurança", data:"2026-09-07"},
  estatais: {url:"https://tribunadosertao.com.br/financas/2026/09/21/982853-petrobras-correios-e-bb-a-visao-dos-presidenciaveis-sobre-as-estatais", titulo:"Petrobras, Correios e BB: a visão dos presidenciáveis sobre as estatais", data:"2026-09-21"},
  agbr:     {url:"https://agenciabrasil.ebc.com.br/politica/noticia/2026-09/flavio-bolsonaro-propoe-enxugar-estado-e-endurecer-acoes-de-seguranca", titulo:"Agência Brasil: Flávio propõe enxugar o Estado e endurecer a segurança", data:"2026-09-18"},
  terror:   {url:"https://www.correiodamanha.com.br/politica/2026/05/289676-eua-contraria-lula-e-classifica-pcc-e-cv-como-organizacoes-terroristas.html", titulo:"Correio da Manhã: EUA contrariam Lula e classificam PCC e CV como terroristas", data:"2026-05-29"},
  pecim:    {url:"https://www.itatiaia.com.br/politica/governo-lula-publica-decreto-que-encerra-programa-para-escolas-civico-militares", titulo:"Itatiaia: governo Lula encerra programa de escolas cívico-militares", data:"2023-07-21"},
  armasF:   {url:"https://www.gazetadopovo.com.br/republica/quem-planeja-o-fim-do-estatuto-do-desarmamento-no-brasil/", titulo:"Gazeta do Povo: quem planeja o fim do Estatuto do Desarmamento", data:"s.d."},
  armasL:   {url:"https://www.brasil247.com/brasil/plano-de-governo-preve-fim-da-escala-6x1-controle-de-armas-e-desmatamento-liquido-zero", titulo:"Brasil 247: plano de Lula prevê controle de armas", data:"2026-08-08"},
  irF:      {url:"https://jornalcontabil.com.br/noticia/senado-aprova-pl-que-isenta-ir-ate-r-5-mil-e-taxa-super-ricos/amp/", titulo:"Jornal Contábil: Senado aprova isenção do IR até R$ 5 mil", data:"2025-11-05"},
  licL:     {url:"https://apublica.org/2025/08/licenciamento-ou-devastacao-lula-vetou-63-dos-398-dispositivos/", titulo:"Agência Pública: Lula faz 63 vetos ao PL do Licenciamento", data:"2025-08-08"}
};

const S  = (posicao, f, nota = "", base = "candidato") => ({posicao, fonte: FONTES[f].url, tituloFonte: FONTES[f].titulo, data: FONTES[f].data, consultadoEm: CONSULTADO, nota, base});
const NA = (nota = "Posição não localizada em fonte verificável") => ({posicao: "sem_posicionamento", fonte: "", tituloFonte: "", data: "", consultadoEm: CONSULTADO, nota, base: "candidato"});
const P  = (id, tema, pergunta, lula, flavioBolsonaro) => ({id, tema, pergunta, candidatos: {lula, flavioBolsonaro}});

const perguntas = [
  P(1,"Direitos trabalhistas","A jornada de trabalho deve ser definida por uma regra única em lei (como 40 horas semanais e o fim da escala 6x1), em vez de ser negociada diretamente entre trabalhador e empresa.",
    S("sim","plLula"), S("nao","p360_6x1","Plano defende o negociado sobre o legislado, em vez de regra única.")),
  P(2,"Segurança pública","A maioridade penal deve ser reduzida de 18 para 16 anos.",
    S("nao","jb","A fonte informa que o plano de Lula não propõe a redução (classificado como 'não')."), S("sim","gdpSeg")),
  P(3,"Privatizações","Empresas estatais, como os Correios, devem poder ser vendidas ao setor privado, avaliando caso a caso, em vez de mantidas sob controle público.",
    S("nao","estatais","Lula descarta vender os Correios e atribui papel estratégico às estatais."), S("sim","estatais","Plano retoma privatizações 'com critério'; já declarou intenção de privatizar os Correios.")),
  P(4,"Saúde","O governo federal deve ter como meta reduzir as filas de atendimento do SUS.",
    S("sim","p360"), S("sim","p360")),
  P(5,"Meio ambiente","O autolicenciamento ambiental deve ser ampliado, inclusive para atividades de médio potencial poluidor e quando o órgão público não responde dentro do prazo.",
    S("nao","licL","Governo vetou a ampliação do autolicenciamento (LAC) para médio potencial poluidor."), S("sim","agbr","Plano permite autolicenciamento por decurso de prazo.")),
  P(6,"Impostos","A reforma tributária do consumo já aprovada deve ser mantida e concluída (com cesta básica isenta e devolução de imposto aos mais pobres), em vez de ser revisada para reduzir a carga efetiva de tributos.",
    S("sim","plLula"), S("nao","band","Plano defende revisão da reforma para reduzir a carga efetiva.")),
  P(7,"Segurança e armas","O acesso a armas de fogo deve seguir regras restritivas, como as do Estatuto do Desarmamento e o controle sobre os CACs, em vez de ser liberado a quem cumprir requisitos como idade mínima, ocupação lícita e testes técnicos.",
    S("sim","armasL","Plano prevê manter o controle de armas e munições."), S("nao","armasF","Campanha trabalha em plano para revogar o Estatuto do Desarmamento.")),
  P(8,"Educação","O governo deve ampliar o acesso ao ensino em tempo integral.",
    S("sim","p360"), S("sim","p360")),
  P(9,"Papel do Estado","O governo federal deve reduzir sua estrutura, extinguindo pelo menos 10 ministérios, e cortar gastos como base do equilíbrio das contas públicas.",
    S("nao","p360","Fonte contrasta: Lula mantém o arcabouço fiscal e amplia investimentos; o plano prevê criar um ministério (Segurança Pública), não extinguir."), S("sim","p360")),
  P(10,"Emprego","Deve existir uma regulamentação específica para o trabalho por aplicativos, com proteção social para esses trabalhadores.",
    S("sim","p360Lula"), S("nao","plFlavio","Plano quer manter o modelo atual, com proteção previdenciária.")),
  P(11,"Segurança pública","Facções criminosas como PCC e CV devem ser formalmente classificadas como organizações terroristas.",
    S("nao","terror","O governo Lula contrariou a classificação (feita pelos EUA) e defende combatê-las com a Lei Antifacções."), S("sim","p360","Plano classifica PCC, CV e milícias como narcoterroristas.")),
  P(12,"Educação","O governo federal deve apoiar e expandir escolas cívico-militares.",
    S("nao","pecim","Ato de governo: o governo Lula encerrou o programa nacional em 2023."), S("sim","p360")),
  P(13,"Impostos","A isenção de Imposto de Renda para quem ganha até R$ 5 mil por mês deve ser mantida.",
    S("sim","plLula"), S("sim","irF","Votou a favor do projeto no Senado.")),
  P(14,"Instituições","O Supremo Tribunal Federal deve ter limites, como restrição às decisões monocráticas e retirada de competências criminais originárias da Corte.",
    S("nao","p360","A fonte informa que o plano de Lula não propõe mudanças nas competências do STF."), S("sim","p360")),
  P(15,"Programas sociais","O Bolsa Família e outras políticas de combate à pobreza devem ser ampliados.",
    S("sim","p360"), S("nao","p360","Plano propõe manter os programas, sem ampliá-los, com ênfase em qualificação e emprego."))
  ,
  /* Em verificação (fora do cálculo até haver fonte do outro lado) */
  P(16,"Segurança pública","Deve ser ampliado o uso de reconhecimento facial integrado a bancos de dados criminais.", NA(), S("sim","p360")),
  P(17,"Política","O presidente da República não deve poder ser reeleito.", NA(), S("sim","band")),
  P(18,"Relações internacionais","O Brasil deve priorizar a reaproximação com os Estados Unidos na política externa.", NA("Plano fala em autonomia do Brasil; posição específica não localizada"), S("sim","p360"))
];
