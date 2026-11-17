/* Regras do validador de remessa CNAB240 — Sicoob (756).
 *
 * Movidas de Validador_CNAB240_Sicoob.html sem mudança de regra: o código abaixo é o mesmo
 * daquela página, sem a parte de tela. A tela é Validador_CNAB240.html,
 * que reconhece o banco pelo header do arquivo (posições 1-3) e chama
 * window.CNAB_REMESSA['756'].validar(linhas).
 *
 * validar(linhas) devolve { iss, fr, recs }:
 *   iss   ocorrências  { line, sev: 'ERROR'|'WARN'|'OK', seg, msg }
 *   fr    campos       { ln, seg, campo, pi, pf, esp, enc, st, det, fix }
 *   recs  estrutura    { ln, desc, ind, ok }
 */
(function () {
const BANCO='756';

/* helpers */
function p(l,a,b){return l.substring(a-1,b);}
function isBl(s){return/^\s*$/.test(s);}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function chkDt(s){
  if(!/^\d{8}$/.test(s))return{ok:false,msg:`Formato inválido (DDMMAAAA): "${s}"`};
  const d=+s.slice(0,2),m=+s.slice(2,4),y=+s.slice(4);
  const mx=[0,31,29,31,30,31,30,31,31,30,31,30,31];
  if(m<1||m>12)return{ok:false,msg:`Mês inválido: ${m}`};
  if(d<1||d>mx[m])return{ok:false,msg:`Dia ${d} inválido para mês ${m}`};
  if(y<2000||y>2099)return{ok:false,msg:`Ano ${y} fora de 2000–2099`};
  return{ok:true};
}
function chkCPF(s){const n=s.replace(/\D/g,'');if(n.length!==11||/^(\d)\1{10}$/.test(n))return false;let a=0;for(let i=0;i<9;i++)a+=+n[i]*(10-i);let r=(a*10)%11;if(r>=10)r=0;if(r!==+n[9])return false;let b=0;for(let i=0;i<10;i++)b+=+n[i]*(11-i);let s2=(b*10)%11;if(s2>=10)s2=0;return s2===+n[10];}
function chkCNPJ(s){const n=s.replace(/\D/g,'');if(n.length!==14||/^(\d)\1{13}$/.test(n))return false;const c=(str,l)=>{let sm=0,pp=l-7;for(let i=l;i>=1;i--){sm+=+str[l-i]*pp--;if(pp<2)pp=9;}return sm%11<2?0:11-sm%11;};return c(n,12)===+n[12]&&c(n,13)===+n[13];}

/* CF = checkField */
function CF(ctx,campo,ini,fim,ln,checks,esp,fix=null){
  const val=p(ln,ini,fim);let st='OK',det='',af=fix;
  for(const c of checks){
    if(!c.test){
      st=c.sev==='ERROR'?'ERROR':(st!=='ERROR'?'WARN':'ERROR');
      det=c.msg;if(c.fix!==undefined)af=c.fix;
      ctx.iss.push({line:ctx.ln,sev:c.sev,seg:ctx.seg,msg:`[${campo}] ${c.msg}`});
    }
  }
  ctx.fr.push({ln:ctx.ln,seg:ctx.seg,campo,pi:ini,pf:fim,esp,enc:val,st,det,fix:af});
}

/* ══════════════════════════════════════════════════════════════
   VALIDADORES — SICOOB (Banco 756) · CNAB240 v3.3 + Folha v1.0
   ══════════════════════════════════════════════════════════════ */

/* ── 01. HEADER DO ARQUIVO (tipo 0) ───────────────────────── */
function vHA(ctx,ln){
  CF(ctx,'01.0 Código do Banco (1–3)',1,3,ln,[{test:p(ln,1,3)===BANCO,sev:'ERROR',msg:`Deve ser "${BANCO}" (Sicoob), encontrado "${p(ln,1,3)}"`}],'"756"',BANCO);
  CF(ctx,'02.0 Lote de Serviço (4–7)',4,7,ln,[{test:p(ln,4,7)==='0000',sev:'ERROR',msg:`Header de arquivo deve ser "0000", encontrado "${p(ln,4,7)}"`}],'"0000"','0000');
  CF(ctx,'03.0 Tipo de Registro (8)',8,8,ln,[{test:p(ln,8,8)==='0',sev:'ERROR',msg:`Deve ser "0", encontrado "${p(ln,8,8)}"`}],'"0"','0');
  CF(ctx,'04.0 Uso FEBRABAN (9–17)',9,17,ln,[{test:isBl(p(ln,9,17)),sev:'WARN',msg:`Deve ser 9 brancos, encontrado: "${p(ln,9,17).trim()}"`}],'9 brancos','         ');
  const ti=p(ln,18,18);
  CF(ctx,'05.0 Tipo de Inscrição da Empresa (18)',18,18,ln,[{test:['1','2'].includes(ti),sev:'ERROR',msg:`Deve ser "1"(CPF) ou "2"(CNPJ), encontrado "${ti}"`}],'"1"=CPF / "2"=CNPJ');
  const ni=p(ln,19,32);
  CF(ctx,'06.0 Número de Inscrição (19–32)',19,32,ln,[
    {test:/^\d{14}$/.test(ni),sev:'ERROR',msg:`Deve ter 14 dígitos, encontrado "${ni}"`},
    {test:!(ti==='1'&&!chkCPF(ni.slice(-11))),sev:'WARN',msg:`CPF "${ni.slice(-11)}" com DV inválido`},
    {test:!(ti==='2'&&!chkCNPJ(ni)),sev:'WARN',msg:`CNPJ "${ni}" com DV inválido`}
  ],'14 dígitos numéricos (CPF c/ zeros à esq. ou CNPJ)');
  CF(ctx,'07.0 Código do Convênio (33–52)',33,52,ln,[{test:p(ln,33,52).trim().length>0,sev:'WARN',msg:'Código de convênio não informado'}],'20 posições alfanuméricas — convênio Sicoob CNAB240');
  CF(ctx,'08.0 Agência Mantenedora (53–57)',53,57,ln,[{test:/^\d{5}$/.test(p(ln,53,57)),sev:'ERROR',msg:`Deve ser 5 dígitos, encontrado "${p(ln,53,57)}"`}],'5 dígitos numéricos');
  CF(ctx,'09.0 DV da Agência (58)',58,58,ln,[{test:p(ln,58,58).trim().length===1,sev:'WARN',msg:'DV da agência não informado'}],'1 dígito alfanumérico');
  CF(ctx,'10.0 Conta Corrente (59–70)',59,70,ln,[{test:/^\d{12}$/.test(p(ln,59,70)),sev:'ERROR',msg:`Deve ter 12 dígitos, encontrado "${p(ln,59,70)}"`}],'12 dígitos numéricos');
  CF(ctx,'11.0 DV da Conta (71)',71,71,ln,[{test:/^\d$/.test(p(ln,71,71)),sev:'WARN',msg:`DV deve ser numérico (1 dígito), encontrado "${p(ln,71,71)}"`}],'1 dígito numérico');
  CF(ctx,'13.0 Nome da Empresa (73–102)',73,102,ln,[{test:p(ln,73,102).trim().length>0,sev:'ERROR',msg:'Nome da empresa não pode ser vazio'}],'Alfanumérico, 30 posições, obrigatório');
  CF(ctx,'14.0 Nome do Banco (103–132)',103,132,ln,[{test:p(ln,103,132).toUpperCase().includes('SICOOB')||p(ln,103,132).trim().length>0,sev:'WARN',msg:`Deve conter "SICOOB" ou nome do banco, encontrado "${p(ln,103,132).trim()}"`}],'"SICOOB" (30 posições)','SICOOB                        ');
  CF(ctx,'15.0 Filler (133–142)',133,142,ln,[{test:isBl(p(ln,133,142)),sev:'WARN',msg:'Deve ser branco (10 posições)'}],'10 brancos','          ');
  const rr=p(ln,143,143);
  CF(ctx,'16.0 Código Remessa/Retorno (143)',143,143,ln,[{test:['1','2'].includes(rr),sev:'ERROR',msg:`Deve ser "1"(Remessa) ou "2"(Retorno), encontrado "${rr}"`}],'"1"=Remessa / "2"=Retorno','1');
  const dg=p(ln,144,151);
  CF(ctx,'17.0 Data de Geração (144–151)',144,151,ln,[
    {test:/^\d{8}$/.test(dg),sev:'ERROR',msg:`Deve ser DDMMAAAA, encontrado "${dg}"`},
    {test:dg==='00000000'||!(/^\d{8}$/.test(dg))||chkDt(dg).ok,sev:'ERROR',msg:/^\d{8}$/.test(dg)&&dg!=='00000000'?chkDt(dg).msg||'':''}
  ].filter(c=>c.msg!==''),'DDMMAAAA (ex: 15032025)');
  CF(ctx,'18.0 Hora de Geração (152–157)',152,157,ln,[{test:/^\d{6}$/.test(p(ln,152,157))||p(ln,152,157)==='      ',sev:'WARN',msg:`Deve ser HHMMSS, encontrado "${p(ln,152,157)}"`}],'HHMMSS (ex: 143022)');
  CF(ctx,'19.0 NSA Número Sequencial (158–163)',158,163,ln,[{test:/^\d{6}$/.test(p(ln,158,163)),sev:'WARN',msg:`Deve ser 6 dígitos, encontrado "${p(ln,158,163)}"`}],'6 dígitos, incremental');
  CF(ctx,'20.0 Versão do Layout (164–166)',164,166,ln,[
    {test:/^\d{3}$/.test(p(ln,164,166)),sev:'WARN',msg:`Deve ser 3 dígitos, encontrado "${p(ln,164,166)}"`},
    {test:p(ln,164,166)==='087',sev:'WARN',msg:`[Sicoob] Versão esperada é "087". Encontrado: "${p(ln,164,166)}"`}
  ].filter(c=>c.msg!==''),'3 dígitos — "087" (Sicoob v3.3)','087');
  CF(ctx,'21.0 Densidade de Gravação (167–171)',167,171,ln,[{test:/^\d{5}$/.test(p(ln,167,171)),sev:'WARN',msg:`Deve ser 5 dígitos, encontrado "${p(ln,167,171)}"`}],'5 dígitos numéricos');
}

/* ── 02. HEADER DO LOTE (tipo 1) ──────────────────────────── */
function vHL(ctx,ln){
  CF(ctx,'01.1 Código do Banco (1–3)',1,3,ln,[{test:p(ln,1,3)===BANCO,sev:'ERROR',msg:`Deve ser "${BANCO}" (Sicoob), encontrado "${p(ln,1,3)}"`}],'"756"',BANCO);
  CF(ctx,'04.1 Tipo da Operação (9)',9,9,ln,[{test:p(ln,9,9)==='C',sev:'ERROR',msg:`Deve ser "C" (crédito), encontrado "${p(ln,9,9)}"`}],'"C" (crédito)','C');
  const ts=p(ln,10,11);
  CF(ctx,'05.1 Tipo de Serviço (10–11)',10,11,ln,[{test:['01','03','04','05','20','22','30'].includes(ts),sev:'WARN',msg:`Tipo "${ts}" incomum. Válidos: 20=Fornecedor 22=Tributos 30=Salários 01=Cobrança`}],'20=Fornecedor · 22=Tributos · 30=Salários · 01=Cobrança');
  const fo=p(ln,12,13);
  const fok=['01','05','11','16','17','18','30','31','41','43','45','47'];
  CF(ctx,'06.1 Forma de Lançamento (12–13)',12,13,ln,[
    {test:fok.includes(fo),sev:'WARN',msg:`Forma "${fo}" incomum. Sicoob aceita: 01=CCtaCte 05=Poupança 11=TribCB 16=DARF 17=GPS 18=DARFSim 30=LiqTitulosSicoob 31=OutrosBancos 41=TED 43=TED MesmaTit 45=PIX 47=PIX_QRCode`},
    // Guia de Folha de Pagamento v1.0 (G029): lotes de salário só com 01, 05 ou 41
    {test:ts!=='30'||['01','05','41'].includes(fo),sev:'ERROR',msg:`Folha de Pagamento (tipo de serviço 30) aceita só as formas 01 (conta corrente), 05 (poupança) e 41 (TED outra titularidade). Encontrado "${fo}"`}
  ],'01 05 11 16 17 18 30 31 41 43 45 47 · Folha (30): 01, 05 ou 41');
  // Validações cruzadas Sicoob
  if(fo==='41'&&!['020'].includes(ts))ctx.iss.push({line:ctx.ln,sev:'WARN',seg:ctx.seg,msg:`[Sicoob] TED Outra Titularidade (Forma 41) — Câmara 018 obrigatória no Segmento A (P001=018).`});
  if(fo==='43')ctx.iss.push({line:ctx.ln,sev:'WARN',seg:ctx.seg,msg:`[Sicoob] TED Mesma Titularidade (Forma 43) — Câmara 018 obrigatória no Segmento A (P001=018).`});
  if(fo==='45')ctx.iss.push({line:ctx.ln,sev:'WARN',seg:ctx.seg,msg:`[Sicoob] PIX Transferência (Forma 45) — Câmara 009 (SPI) no Segmento A, Forma de Iniciação G100 no Segmento B.`});
  if(fo==='47')ctx.iss.push({line:ctx.ln,sev:'WARN',seg:ctx.seg,msg:`[Sicoob] PIX QR Code (Forma 47) — usar Segmento J + Segmento J-52-PIX (G102: URL e TXID).`});
  const ve=p(ln,14,16);
  // Versão do layout do lote por tipo
  const veMap={'03':'045','20':'045','22':'012','30':'045','01':'040'};
  const vesp=veMap[ts]||'045';
  CF(ctx,'07.1 Versão Layout do Lote (14–16)',14,16,ln,[
    {test:/^\d{3}$/.test(ve),sev:'WARN',msg:`Deve ser 3 dígitos, encontrado "${ve}"`},
    {test:ve===vesp,sev:'WARN',msg:`[Sicoob] Para Serviço "${ts}" o esperado é "${vesp}" (045=Transf/Salário 012=Tributos 040=Títulos). Encontrado: "${ve}"`}
  ].filter(c=>c.msg!==''),`${vesp} (045=Transf/Salários/PIX · 012=Tributos · 040=Títulos)`,vesp);
  CF(ctx,'08.1 Filler (17)',17,17,ln,[{test:p(ln,17,17)===' ',sev:'WARN',msg:`Deve ser branco, encontrado "${p(ln,17,17)}"`}],'1 branco',' ');
  CF(ctx,'11.1 Código do Convênio (33–52)',33,52,ln,[{test:p(ln,33,52).trim().length>0,sev:'ERROR',msg:'Código de convênio obrigatório nas posições 33-52'}],'20 posições — convênio Sicoob CNAB240 (obrigatório)');
  CF(ctx,'12.1 Agência (53–57)',53,57,ln,[{test:/^\d{5}$/.test(p(ln,53,57)),sev:'ERROR',msg:`Deve ser 5 dígitos, encontrado "${p(ln,53,57)}"`}],'5 dígitos numéricos');
  CF(ctx,'14.1 Conta Corrente (59–70)',59,70,ln,[{test:/^\d{12}$/.test(p(ln,59,70)),sev:'ERROR',msg:`Deve ter 12 dígitos, encontrado "${p(ln,59,70)}"`}],'12 dígitos numéricos');
  CF(ctx,'15.1 DV Conta (71)',71,71,ln,[{test:/^\d$/.test(p(ln,71,71)),sev:'WARN',msg:`DV conta deve ser numérico, encontrado "${p(ln,71,71)}"`}],'1 dígito numérico');
  CF(ctx,'28.1 Ocorrências Retorno (231–240)',231,240,ln,[{test:isBl(p(ln,231,240)),sev:'WARN',msg:'Ocorrências devem ser brancos na remessa'}],'10 brancos na remessa','          ');
  return{ts,fo};
}

/* ── 03. TRAILER DO LOTE (tipo 5) ─────────────────────────── */
function vTL(ctx,ln,regs,soma){
  CF(ctx,'01.5 Código do Banco (1–3)',1,3,ln,[{test:p(ln,1,3)===BANCO,sev:'ERROR',msg:`Deve ser "${BANCO}", encontrado "${p(ln,1,3)}"`}],'"756"',BANCO);
  CF(ctx,'03.5 Tipo de Registro (8)',8,8,ln,[{test:p(ln,8,8)==='5',sev:'ERROR',msg:`Deve ser "5", encontrado "${p(ln,8,8)}"`}],'"5"','5');
  CF(ctx,'04.5 Filler (9–17)',9,17,ln,[{test:isBl(p(ln,9,17)),sev:'WARN',msg:'Filler 9-17 deve ser branco'}],'9 brancos','         ');
  const qrStr=p(ln,18,23);const qr=parseInt(qrStr,10);const qe=regs+2;
  if(qr!==qe){ctx.iss.push({line:ctx.ln,sev:'ERROR',seg:ctx.seg,msg:`[05.5 Qtd. Registros] Informado: ${qr}, calculado: ${qe} (Header+Detalhes+Trailer)`});ctx.fr.push({ln:ctx.ln,seg:ctx.seg,campo:'05.5 Qtd. Registros do Lote (18–23)',pi:18,pf:23,esp:`${qe} (auto-calculado)`,enc:qrStr,st:'ERROR',det:`Calculado: Header(1) + Detalhes(${regs}) + Trailer(1) = ${qe}`,fix:String(qe).padStart(6,'0')});}
  else{ctx.iss.push({line:ctx.ln,sev:'OK',seg:ctx.seg,msg:`[05.5 Qtd. Registros] Correto: ${qr}`});ctx.fr.push({ln:ctx.ln,seg:ctx.seg,campo:'05.5 Qtd. Registros do Lote (18–23)',pi:18,pf:23,esp:`${qe}`,enc:qrStr,st:'OK',det:'',fix:null});}
  const siStr=p(ln,24,41);const si=parseInt(siStr,10)||0;
  if(si!==soma&&soma>0){ctx.iss.push({line:ctx.ln,sev:'WARN',seg:ctx.seg,msg:`[06.5 Somatório] Informado: ${si}, calculado: ${soma}`});ctx.fr.push({ln:ctx.ln,seg:ctx.seg,campo:'06.5 Somatória dos Valores (24–41)',pi:24,pf:41,esp:`${soma} (auto-calculado, centavos)`,enc:siStr,st:'WARN',det:`Soma calculada: ${soma}`,fix:String(soma).padStart(18,'0')});}
  CF(ctx,'07.5 Somatória Qtd. Moeda (42–59)',42,59,ln,[{test:/^\d{18}$/.test(p(ln,42,59)),sev:'WARN',msg:'Deve ser 18 dígitos numéricos'}],'18 dígitos numéricos (zeros para BRL)');
}

/* ── 04. TRAILER DO ARQUIVO (tipo 9) ──────────────────────── */
function vTA(ctx,ln,tL,tR){
  CF(ctx,'01.9 Código do Banco (1–3)',1,3,ln,[{test:p(ln,1,3)===BANCO,sev:'ERROR',msg:`Deve ser "${BANCO}", encontrado "${p(ln,1,3)}"`}],'"756"',BANCO);
  CF(ctx,'02.9 Lote de Serviço (4–7)',4,7,ln,[{test:p(ln,4,7)==='9999',sev:'ERROR',msg:`Deve ser "9999", encontrado "${p(ln,4,7)}"`}],'"9999"','9999');
  CF(ctx,'03.9 Tipo de Registro (8)',8,8,ln,[{test:p(ln,8,8)==='9',sev:'ERROR',msg:`Deve ser "9", encontrado "${p(ln,8,8)}"`}],'"9"','9');
  CF(ctx,'04.9 Filler (9–17)',9,17,ln,[{test:isBl(p(ln,9,17)),sev:'WARN',msg:'Filler 9-17 deve ser branco'}],'9 brancos','         ');
  const qlStr=p(ln,18,23);const ql=parseInt(qlStr,10);
  if(ql!==tL){ctx.iss.push({line:ctx.ln,sev:'ERROR',seg:ctx.seg,msg:`[05.9 Qtd. Lotes] Informado: ${ql}, calculado: ${tL}`});ctx.fr.push({ln:ctx.ln,seg:ctx.seg,campo:'05.9 Qtd. Lotes do Arquivo (18–23)',pi:18,pf:23,esp:`${tL} (auto-calculado)`,enc:qlStr,st:'ERROR',det:`Total de lotes: ${tL}`,fix:String(tL).padStart(6,'0')});}
  else{ctx.iss.push({line:ctx.ln,sev:'OK',seg:ctx.seg,msg:`[05.9 Qtd. Lotes] Correto: ${ql}`});ctx.fr.push({ln:ctx.ln,seg:ctx.seg,campo:'05.9 Qtd. Lotes do Arquivo (18–23)',pi:18,pf:23,esp:`${tL}`,enc:qlStr,st:'OK',det:'',fix:null});}
  const qrStr=p(ln,24,29);const qr=parseInt(qrStr,10);
  if(qr!==tR){ctx.iss.push({line:ctx.ln,sev:'ERROR',seg:ctx.seg,msg:`[06.9 Qtd. Registros] Informado: ${qr}, calculado: ${tR}`});ctx.fr.push({ln:ctx.ln,seg:ctx.seg,campo:'06.9 Qtd. Registros do Arquivo (24–29)',pi:24,pf:29,esp:`${tR} (auto-calculado)`,enc:qrStr,st:'ERROR',det:`Total de registros tipos 0,1,3,5,9: ${tR}`,fix:String(tR).padStart(6,'0')});}
  else{ctx.iss.push({line:ctx.ln,sev:'OK',seg:ctx.seg,msg:`[06.9 Qtd. Registros] Correto: ${qr}`});ctx.fr.push({ln:ctx.ln,seg:ctx.seg,campo:'06.9 Qtd. Registros do Arquivo (24–29)',pi:24,pf:29,esp:`${tR}`,enc:qrStr,st:'OK',det:'',fix:null});}
  CF(ctx,'07.9 Qtd. Contas p/ Conciliação (30–35)',30,35,ln,[{test:p(ln,30,35)==='000000',sev:'WARN',msg:`Deve ser "000000" (Sicoob), encontrado "${p(ln,30,35)}"`}],'"000000" (Sicoob)','000000');
}

/* ── 05. SEGMENTO A — Transferências (TED / PIX / Crédito) ── */
function vSA(ctx,ln,fo){
  CF(ctx,'01.3A Código do Banco (1–3)',1,3,ln,[{test:p(ln,1,3)===BANCO,sev:'ERROR',msg:`Deve ser "${BANCO}", encontrado "${p(ln,1,3)}"`}],'"756"',BANCO);
  CF(ctx,'03.3A Tipo de Registro (8)',8,8,ln,[{test:p(ln,8,8)==='3',sev:'ERROR',msg:`Deve ser "3", encontrado "${p(ln,8,8)}"`}],'"3"','3');
  CF(ctx,'05.3A Segmento (14)',14,14,ln,[{test:p(ln,14,14).toUpperCase()==='A',sev:'ERROR',msg:`Deve ser "A", encontrado "${p(ln,14,14)}"`}],'"A"','A');
  CF(ctx,'06.3A Tipo de Movimento (15)',15,15,ln,[{test:['0','3'].includes(p(ln,15,15)),sev:'ERROR',msg:`Deve ser "0"(Inclusão) ou "3"(Estorno-retorno), encontrado "${p(ln,15,15)}"`}],'"0"=Inclusão / "3"=Estorno (retorno)','0');
  CF(ctx,'07.3A Código de Instrução (16–17)',16,17,ln,[{test:['00','33'].includes(p(ln,16,17)),sev:'WARN',msg:`Deve ser "00"(Inclusão) ou "33"(Estorno), encontrado "${p(ln,16,17)}"`}],'"00"=Inclusão / "33"=Estorno','00');
  const cm=p(ln,18,20);
  CF(ctx,'08.3A Câmara de Compensação (18–20)',18,20,ln,[{test:['000','018','009'].includes(cm),sev:'WARN',msg:`Câmara "${cm}" incomum. 000=Sicoob/CCtaCte · 018=TED · 009=PIX`}],'018=TED(STR/CIP) · 009=PIX(SPI) · 000=Sicoob');
  if((fo==='41'||fo==='43')&&cm!=='018')ctx.iss.push({line:ctx.ln,sev:'WARN',seg:ctx.seg,msg:`[Sicoob] TED (Forma ${fo}) usa Câmara 018. Encontrado: "${cm}"`});
  if(fo==='45'&&cm!=='009')ctx.iss.push({line:ctx.ln,sev:'WARN',seg:ctx.seg,msg:`[Sicoob] PIX Transferência (Forma 45) usa Câmara 009. Encontrado: "${cm}"`});
  CF(ctx,'09.3A Banco Favorecido (21–23)',21,23,ln,[{test:/^\d{3}$/.test(p(ln,21,23)),sev:'ERROR',msg:`Deve ter 3 dígitos, encontrado "${p(ln,21,23)}"`}],'3 dígitos (código BACEN)');
  CF(ctx,'10.3A Agência Favorecido (24–28)',24,28,ln,[{test:/^\d{5}$/.test(p(ln,24,28)),sev:'ERROR',msg:`Deve ter 5 dígitos, encontrado "${p(ln,24,28)}"`}],'5 dígitos numéricos');
  CF(ctx,'12.3A Conta do Favorecido (30–41)',30,41,ln,[{test:/^\d{12}$/.test(p(ln,30,41)),sev:'ERROR',msg:`Deve ter 12 dígitos, encontrado "${p(ln,30,41)}"`}],'12 dígitos numéricos');
  CF(ctx,'13.3A DV Conta Favorecido (42)',42,42,ln,[{test:p(ln,42,42).trim().length>0,sev:'WARN',msg:'DV não informado'}],'1 dígito numérico obrigatório');
  const dp=p(ln,94,101);
  CF(ctx,'17.3A Data do Pagamento (94–101)',94,101,ln,[
    {test:/^\d{8}$/.test(dp),sev:'ERROR',msg:`Deve ser DDMMAAAA, encontrado "${dp}"`},
    {test:!(/^\d{8}$/.test(dp))||chkDt(dp).ok,sev:'ERROR',msg:/^\d{8}$/.test(dp)?chkDt(dp).msg||'':''}
  ].filter(c=>c.msg!==''),'DDMMAAAA (ex: 15032025)');
  CF(ctx,'18.3A Tipo da Moeda (102–104)',102,104,ln,[{test:p(ln,102,104)==='BRL',sev:'WARN',msg:`[Sicoob] Deve ser "BRL", encontrado "${p(ln,102,104)}"`}],'"BRL"','BRL');
  CF(ctx,'19.3A Quantidade de Moeda (105–119)',105,119,ln,[{test:p(ln,105,119)==='000000000000000',sev:'WARN',msg:'Deve ser 15 zeros para pagamentos BRL'}],'000000000000000 (15 zeros)','000000000000000');
  const vp=p(ln,120,134);
  CF(ctx,'20.3A Valor do Pagamento (120–134)',120,134,ln,[
    {test:/^\d{15}$/.test(vp),sev:'ERROR',msg:`Deve ter 15 dígitos (2 decimais implícitos), encontrado "${vp}"`},
    {test:parseInt(vp,10)>0,sev:'WARN',msg:'Valor zerado'}
  ],'15 dígitos numéricos (centavos, sem separador decimal)');
  CF(ctx,'22.3A Data Real do Pagamento (155–162)',155,162,ln,[{test:/^\d{8}$/.test(p(ln,155,162))||isBl(p(ln,155,162))||p(ln,155,162)==='00000000',sev:'WARN',msg:'Na remessa deve ser 00000000 (zeros)'}],'00000000 na remessa / DDMMAAAA no retorno','00000000');
  // TED-specific
  if(fo==='41'||fo==='43'){
    CF(ctx,'26.3A Finalidade TED (220–224)',220,224,ln,[{test:/^\d{5}$/.test(p(ln,220,224))&&parseInt(p(ln,220,224),10)>0,sev:'WARN',msg:`Finalidade TED obrigatória para Forma ${fo}. Encontrado: "${p(ln,220,224)}"`}],'5 dígitos: 00004=Salários · 00005=Fornecedores · 00010=Crédito em Conta');
  }
  CF(ctx,'29.3A Aviso ao Favorecido (230)',230,230,ln,[{test:['0','2','5','6','7'].includes(p(ln,230,230)),sev:'WARN',msg:`Valor inválido: "${p(ln,230,230)}". Válidos: 0=Não Emite 2=Só Remetente 5=Só Favorecido 6=Ambos 7=Favor+2ViaRem`}],'0=Não Emite / 2=Só Remetente / 5=Só Favorecido / 6=Ambos / 7=Fav+2ViaRem','0');
}

/* ── 06. SEGMENTO B — Dados Complementares (Transferências) ─ */
function vSB(ctx,ln,fo){
  CF(ctx,'01.3B Código do Banco (1–3)',1,3,ln,[{test:p(ln,1,3)===BANCO,sev:'ERROR',msg:`Deve ser "${BANCO}", encontrado "${p(ln,1,3)}"`}],'"756"',BANCO);
  CF(ctx,'05.3B Segmento (14)',14,14,ln,[{test:p(ln,14,14).toUpperCase()==='B',sev:'ERROR',msg:`Deve ser "B", encontrado "${p(ln,14,14)}"`}],'"B"','B');
  // PIX Transferência: campo G100 (Forma de Iniciação)
  if(fo==='45'){
    const gi=p(ln,15,17).trim();
    CF(ctx,'06.3B-PIX Forma de Iniciação G100 (15–17)',15,17,ln,[{test:['01','02','03','04','05'].includes(gi),sev:'ERROR',msg:`G100 obrigatório para PIX Transferência. Válidos: 01=Telefone 02=Email 03=CPF/CNPJ 04=Aleatória 05=DadosBancários. Encontrado: "${gi}"`}],'01=Telefone · 02=Email · 03=CPF/CNPJ · 04=Aleatória · 05=Dados Bancários');
    const ti=p(ln,18,18);
    CF(ctx,'07.3B Tipo Inscrição Favorecido (18)',18,18,ln,[{test:['0','1','2'].includes(ti),sev:'WARN',msg:`Deve ser "0","1" ou "2", encontrado "${ti}"`}],'"0"=Isento / "1"=CPF / "2"=CNPJ');
    // Chave PIX nas informações 10/11/12
    if(gi==='01'){const ch=p(ln,128,226).trim();CF(ctx,'Chave PIX Telefone (128–226)',128,226,ln,[{test:ch.length>0,sev:'ERROR',msg:'Chave telefone deve estar nas posições 128-226'},{test:!ch||/^\+\d{13}$/.test(ch),sev:'WARN',msg:`Formato: +55DDDXXXXXXXXX. Encontrado: "${ch}"`}],'Formato: +55DDDXXXXXXXXX (ex: +5511987654321)');}
    if(gi==='02'){const ch=p(ln,128,226).trim();CF(ctx,'Chave PIX E-mail (128–226)',128,226,ln,[{test:ch.length>0,sev:'ERROR',msg:'Chave e-mail deve estar nas posições 128-226'},{test:!ch||/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(ch),sev:'WARN',msg:`E-mail deve ser em minúsculas. Encontrado: "${ch}"`}],'E-mail em letras minúsculas');}
    if(gi==='03'){const cpf=p(ln,19,32);CF(ctx,'Chave PIX CPF/CNPJ — posição 19–32',19,32,ln,[{test:/^\d{14}$/.test(cpf)&&parseInt(cpf,10)>0,sev:'ERROR',msg:`Para G100=03, posições 19-32 devem conter CPF/CNPJ. Encontrado: "${cpf}"`}],'CPF/CNPJ nas posições 19-32');}
    if(gi==='04'){const ch=p(ln,128,226).trim();CF(ctx,'Chave PIX Aleatória (128–226)',128,226,ln,[{test:ch.length>0,sev:'ERROR',msg:'Chave aleatória deve estar nas posições 128-226'},{test:!ch||/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ch),sev:'WARN',msg:`UUID esperado. Encontrado: "${ch}"`}],'UUID hexadecimal: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX');}
  } else {
    const ti=p(ln,18,18);
    CF(ctx,'07.3B Tipo Inscrição Favorecido (18)',18,18,ln,[{test:['1','2'].includes(ti),sev:'ERROR',msg:`Deve ser "1"(PF) ou "2"(PJ), encontrado "${ti}"`}],'"1"=Pessoa Física / "2"=Pessoa Jurídica');
    const ni=p(ln,19,32);
    CF(ctx,'08.3B Nº de Inscrição Favorecido (19–32)',19,32,ln,[
      {test:/^\d{14}$/.test(ni),sev:'ERROR',msg:`Deve ter 14 dígitos, encontrado "${ni}"`},
      {test:!(ti==='1'&&!chkCPF(ni.slice(-11))),sev:'WARN',msg:`CPF "${ni.slice(-11)}" com DV inválido`},
      {test:!(ti==='2'&&!chkCNPJ(ni)),sev:'WARN',msg:`CNPJ "${ni}" com DV inválido`}
    ],'14 dígitos numéricos (CPF c/ zeros à esq. ou CNPJ)');
  }
}

/* ── 07. SEGMENTO J — Pagamento de Títulos ────────────────── */
function vSJ(ctx,ln,fo){
  CF(ctx,'01.3J Código do Banco (1–3)',1,3,ln,[{test:p(ln,1,3)===BANCO,sev:'ERROR',msg:`Deve ser "${BANCO}", encontrado "${p(ln,1,3)}"`}],'"756"',BANCO);
  CF(ctx,'06.3J Tipo de Movimento (15)',15,15,ln,[{test:p(ln,15,15)==='0',sev:'WARN',msg:`Default "0", encontrado "${p(ln,15,15)}"`}],'"0" (default — inclusão)','0');
  CF(ctx,'07.3J Código de Instrução (16–17)',16,17,ln,[{test:p(ln,16,17)==='00',sev:'WARN',msg:`Default "00", encontrado "${p(ln,16,17)}"`}],'"00" (default)','00');
  const isPix=(fo==='47');
  if(!isPix){
    const cb=p(ln,18,61);
    CF(ctx,'08.3J Código de Barras (18–61)',18,61,ln,[{test:/^\d{44}$/.test(cb),sev:'ERROR',msg:`Deve ter 44 dígitos numéricos, encontrado ${cb.trim().length} chars`}],'44 dígitos numéricos');
  } else {
    const cb=p(ln,18,61);
    CF(ctx,'08.3J Código de Barras PIX QR (18–61)',18,61,ln,[{test:isBl(cb)||/^0+$/.test(cb.trim()),sev:'WARN',msg:'Para PIX QR, deve ser zeros ou brancos (URL fica no J52-PIX)'}],'Zeros ou brancos (URL no J52-PIX, pos 132-210)','00000000000000000000000000000000000000000000');
  }
  const dv=p(ln,92,99);
  CF(ctx,'10.3J Data do Vencimento (92–99)',92,99,ln,[{test:/^\d{8}$/.test(dv)||dv==='00000000',sev:'WARN',msg:`DDMMAAAA ou zeros, encontrado: "${dv}"`}],'DDMMAAAA ou 00000000');
  CF(ctx,'11.3J Valor Nominal (100–114)',100,114,ln,[{test:/^\d{15}$/.test(p(ln,100,114)),sev:'WARN',msg:`Deve ter 15 dígitos, encontrado "${p(ln,100,114)}"`}],'15 dígitos (zeros se não houver)');
  const dp=p(ln,145,152);
  CF(ctx,'14.3J Data do Pagamento (145–152)',145,152,ln,[
    {test:/^\d{8}$/.test(dp),sev:'ERROR',msg:`Deve ser DDMMAAAA, encontrado "${dp}"`},
    {test:!(/^\d{8}$/.test(dp))||chkDt(dp).ok,sev:'ERROR',msg:/^\d{8}$/.test(dp)?chkDt(dp).msg||'':''}
  ].filter(c=>c.msg!==''),'DDMMAAAA');
  const vp=p(ln,153,167);
  CF(ctx,'15.3J Valor do Pagamento (153–167)',153,167,ln,[
    {test:/^\d{15}$/.test(vp),sev:'ERROR',msg:`Deve ter 15 dígitos, encontrado "${vp}"`},
    {test:parseInt(vp,10)>0,sev:'WARN',msg:'Valor zerado'}
  ],'15 dígitos (centavos — valor final a pagar)');
  CF(ctx,'19.3J Código da Moeda (223–224)',223,224,ln,[{test:p(ln,223,224)==='09'||isBl(p(ln,223,224)),sev:'WARN',msg:`Deve ser "09" (Real), encontrado "${p(ln,223,224)}"`}],'"09" (Real)','09');
}

/* ── 08. SEGMENTO J-52 — Dados Pagador/Cedente (boleto) ───── */
function vSJ52(ctx,ln){
  CF(ctx,'01.J52 Código do Banco (1–3)',1,3,ln,[{test:p(ln,1,3)===BANCO,sev:'ERROR',msg:`Deve ser "${BANCO}", encontrado "${p(ln,1,3)}"`}],'"756"',BANCO);
  CF(ctx,'08.J52 Identificação Registro (18–19)',18,19,ln,[{test:p(ln,18,19)==='52',sev:'ERROR',msg:`Deve ser "52", encontrado "${p(ln,18,19)}"`}],'"52" (obrigatório para boletos Sicoob)','52');
  CF(ctx,'09.J52 Tipo Inscrição Sacado (20)',20,20,ln,[{test:['0','1','2'].includes(p(ln,20,20)),sev:'WARN',msg:`Deve ser "0","1"(CPF) ou "2"(CNPJ), encontrado "${p(ln,20,20)}"`}],'"1"=CPF / "2"=CNPJ');
  CF(ctx,'10.J52 CPF/CNPJ Sacado (21–35)',21,35,ln,[{test:/^\d{15}$/.test(p(ln,21,35)),sev:'WARN',msg:`Deve ter 15 dígitos (com zeros iniciais), encontrado "${p(ln,21,35)}"`}],'15 dígitos com zeros iniciais');
  CF(ctx,'11.J52 Nome do Sacado (36–75)',36,75,ln,[{test:p(ln,36,75).trim().length>0,sev:'WARN',msg:'Nome do sacado não informado'}],'Alfanumérico, 40 posições');
  CF(ctx,'12.J52 Tipo Inscrição Cedente (76)',76,76,ln,[{test:['0','1','2'].includes(p(ln,76,76)),sev:'WARN',msg:`Deve ser "1" ou "2", encontrado "${p(ln,76,76)}"`}],'"1"=CPF / "2"=CNPJ');
  CF(ctx,'13.J52 CPF/CNPJ Cedente (77–91)',77,91,ln,[{test:/^\d{15}$/.test(p(ln,77,91)),sev:'WARN',msg:`Deve ter 15 dígitos, encontrado "${p(ln,77,91)}"`}],'15 dígitos com zeros iniciais');
  CF(ctx,'14.J52 Nome do Cedente (92–131)',92,131,ln,[{test:p(ln,92,131).trim().length>0,sev:'WARN',msg:'Nome do cedente não informado'}],'Alfanumérico, 40 posições');
}

/* ── 09. SEGMENTO J-52-PIX — QR Code ──────────────────────── */
function vSJ52pix(ctx,ln){
  CF(ctx,'01.J52-PIX Código do Banco (1–3)',1,3,ln,[{test:p(ln,1,3)===BANCO,sev:'ERROR',msg:`Deve ser "${BANCO}", encontrado "${p(ln,1,3)}"`}],'"756"',BANCO);
  CF(ctx,'08.J52-PIX Identificação Registro (18–19)',18,19,ln,[{test:p(ln,18,19)==='52',sev:'ERROR',msg:`Deve ser "52", encontrado "${p(ln,18,19)}"`}],'"52"','52');
  CF(ctx,'09.J52-PIX Tipo Inscrição Devedor (20)',20,20,ln,[{test:['0','1','2'].includes(p(ln,20,20)),sev:'WARN',msg:`Deve ser "1"(CPF) ou "2"(CNPJ), encontrado "${p(ln,20,20)}"`}],'"1"=CPF / "2"=CNPJ');
  CF(ctx,'10.J52-PIX CPF/CNPJ Devedor (21–35)',21,35,ln,[{test:/^\d{15}$/.test(p(ln,21,35)),sev:'WARN',msg:`Deve ter 15 dígitos, encontrado "${p(ln,21,35)}"`}],'15 dígitos com zeros iniciais');
  CF(ctx,'11.J52-PIX Nome Devedor (36–75)',36,75,ln,[{test:p(ln,36,75).trim().length>0,sev:'WARN',msg:'Nome do devedor não informado'}],'Alfanumérico, 40 posições');
  CF(ctx,'12.J52-PIX Tipo Inscrição Favorecido (76)',76,76,ln,[{test:['0','1','2'].includes(p(ln,76,76)),sev:'WARN',msg:`Deve ser "1" ou "2", encontrado "${p(ln,76,76)}"`}],'"1"=CPF / "2"=CNPJ');
  CF(ctx,'13.J52-PIX CPF/CNPJ Favorecido (77–91)',77,91,ln,[{test:/^\d{15}$/.test(p(ln,77,91)),sev:'WARN',msg:`Deve ter 15 dígitos, encontrado "${p(ln,77,91)}"`}],'15 dígitos com zeros iniciais');
  CF(ctx,'14.J52-PIX Nome Favorecido (92–131)',92,131,ln,[{test:p(ln,92,131).trim().length>0,sev:'WARN',msg:'Nome do favorecido não informado'}],'Alfanumérico, 40 posições');
  const url=p(ln,132,210).trim();
  CF(ctx,'15.J52-PIX URL/Chave G102 (132–210)',132,210,ln,[{test:url.length>0,sev:'ERROR',msg:'URL QR Code Dinâmico ou Chave QR Estático obrigatório nas posições 132-210 (G102 Sicoob)'}],'URL QR Dinâmico ou Chave QR Estático (79 posições)');
  const txid=p(ln,211,240).trim();
  CF(ctx,'15.J52-PIX TXID (211–240)',211,240,ln,[{test:txid.length>0||true,sev:'WARN',msg:txid.length===0?'TXID recomendado para QR Code Dinâmico (posições 211-240)':''}].filter(c=>c.msg!==''),'TXID do QR Code Dinâmico — máx 30 posições');
}

/* ── 10. SEGMENTO O — Convênios/Tributos c/ Código de Barras  */
function vSO(ctx,ln){
  CF(ctx,'01.3O Código do Banco (1–3)',1,3,ln,[{test:p(ln,1,3)===BANCO,sev:'ERROR',msg:`Deve ser "${BANCO}", encontrado "${p(ln,1,3)}"`}],'"756"',BANCO);
  CF(ctx,'08.3O Código de Barras (18–61)',18,61,ln,[{test:p(ln,18,61).trim().length>0,sev:'ERROR',msg:'Código de barras obrigatório (44 posições alfanuméricas)'}],'44 posições alfanuméricas, obrigatório');
  CF(ctx,'09.3O Nome Concessionária/Órgão (62–91)',62,91,ln,[{test:p(ln,62,91).trim().length>0,sev:'WARN',msg:'Nome da concessionária não informado'}],'30 posições alfanuméricas');
  const dp=p(ln,100,107);
  CF(ctx,'11.3O Data do Pagamento (100–107)',100,107,ln,[
    {test:/^\d{8}$/.test(dp),sev:'ERROR',msg:`Deve ser DDMMAAAA, encontrado "${dp}"`},
    {test:!(/^\d{8}$/.test(dp))||chkDt(dp).ok,sev:'ERROR',msg:/^\d{8}$/.test(dp)?chkDt(dp).msg||'':''}
  ].filter(c=>c.msg!==''),'DDMMAAAA');
  const vp=p(ln,108,122);
  CF(ctx,'12.3O Valor do Pagamento (108–122)',108,122,ln,[
    {test:/^\d{15}$/.test(vp),sev:'ERROR',msg:`Deve ter 15 dígitos, encontrado "${vp}"`},
    {test:parseInt(vp,10)>0,sev:'WARN',msg:'Valor zerado'}
  ],'15 dígitos (2 casas decimais implícitas — 9(13)V2)');
}

/* ── 11. SEGMENTO N — Convênios/Tributos s/ Código de Barras  */
function vSN(ctx,ln){
  CF(ctx,'01.3N Código do Banco (1–3)',1,3,ln,[{test:p(ln,1,3)===BANCO,sev:'ERROR',msg:`Deve ser "${BANCO}", encontrado "${p(ln,1,3)}"`}],'"756"',BANCO);
  CF(ctx,'10.3N Nome do Contribuinte (58–87)',58,87,ln,[{test:p(ln,58,87).trim().length>0,sev:'ERROR',msg:'Nome do contribuinte obrigatório'}],'30 posições alfanuméricas, obrigatório');
  const dp=p(ln,88,95);
  CF(ctx,'11.3N Data do Pagamento (88–95)',88,95,ln,[
    {test:/^\d{8}$/.test(dp),sev:'ERROR',msg:`Deve ser DDMMAAAA, encontrado "${dp}"`},
    {test:!(/^\d{8}$/.test(dp))||chkDt(dp).ok,sev:'ERROR',msg:/^\d{8}$/.test(dp)?chkDt(dp).msg||'':''}
  ].filter(c=>c.msg!==''),'DDMMAAAA');
  const vp=p(ln,96,110);
  CF(ctx,'12.3N Valor Total (96–110)',96,110,ln,[
    {test:/^\d{15}$/.test(vp),sev:'ERROR',msg:`Deve ter 15 dígitos, encontrado "${vp}"`},
    {test:parseInt(vp,10)>0,sev:'WARN',msg:'Valor zerado'}
  ],'15 dígitos (centavos)');
  // Informações complementares de tributo (pos 111-230) variam conforme N005 (pos 133-134)
  const ct=p(ln,133,134).trim();
  if(ct==='17'){
    // GPS
    CF(ctx,'N1.GPS Código da Receita (111–116)',111,116,ln,[{test:/^\d{4,6}$/.test(p(ln,111,116).trim()),sev:'WARN',msg:`Código receita inválido: "${p(ln,111,116)}"`}],'6 posições alfa (código receita GPS)');
    CF(ctx,'N1.GPS Tipo ID Contribuinte (117–118)',117,118,ln,[{test:/^\d{2}$/.test(p(ln,117,118)),sev:'ERROR',msg:`2 dígitos, encontrado "${p(ln,117,118)}"`}],'2 dígitos (1=CNPJ 2=CPF 3=PIS/NIT 4=CEI 6=NB)');
    CF(ctx,'N1.GPS Competência MMAAAA (135–140)',135,140,ln,[{test:/^\d{6}$/.test(p(ln,135,140)),sev:'ERROR',msg:`MMAAAA, encontrado "${p(ln,135,140)}"`}],'MMAAAA (6 dígitos)');
    CF(ctx,'N1.GPS Valor Previsto INSS (141–155)',141,155,ln,[{test:/^\d{15}$/.test(p(ln,141,155)),sev:'ERROR',msg:`15 dígitos, encontrado "${p(ln,141,155)}"`}],'15 dígitos (centavos)');
  } else if(ct==='16'){
    // DARF Normal
    CF(ctx,'N2.DARF Período de Apuração (135–142)',135,142,ln,[{test:/^\d{8}$/.test(p(ln,135,142)),sev:'ERROR',msg:`DDMMAAAA, encontrado "${p(ln,135,142)}"`}],'DDMMAAAA');
    CF(ctx,'N2.DARF Número de Referência (143–159)',143,159,ln,[{test:/^\d{17}$/.test(p(ln,143,159)),sev:'ERROR',msg:`17 dígitos obrigatórios, encontrado "${p(ln,143,159)}"`}],'17 dígitos numéricos');
    CF(ctx,'N2.DARF Valor Principal (160–174)',160,174,ln,[{test:/^\d{15}$/.test(p(ln,160,174)),sev:'ERROR',msg:`15 dígitos, encontrado "${p(ln,160,174)}"`}],'15 dígitos (centavos)');
  } else if(ct==='18'){
    // DARF Simples
    CF(ctx,'N3.DARF Simples Código Receita (111–116)',111,116,ln,[{test:p(ln,111,114)==='6106',sev:'WARN',msg:`DARF Simples usa código "6106", encontrado "${p(ln,111,114)}"`}],'"6106" (DARF Simples)','6106  ');
    CF(ctx,'N3.DARF Simples Período de Apuração (135–142)',135,142,ln,[{test:/^\d{8}$/.test(p(ln,135,142)),sev:'ERROR',msg:`DDMMAAAA, encontrado "${p(ln,135,142)}"`}],'DDMMAAAA');
  }
}

/* ── 12. SEGMENTO B — Folha de Pagamento ──────────────────── */
/* Campos conforme o "Guia de Importação de Arquivos CNAB 240 – Folha de
   Pagamento" v1.0 (19/05/2025), item 7.3, separado do guia de Pagamentos na v3.3. */
function vSBFolha(ctx,ln){
  const numOuBranco=(a,b)=>/^\d+$/.test(p(ln,a,b))||isBl(p(ln,a,b));
  const valor=(a,b)=>/^\d{15}$/.test(p(ln,a,b));
  CF(ctx,'01.3B Código do Banco (1–3)',1,3,ln,[{test:p(ln,1,3)===BANCO,sev:'ERROR',msg:`Deve ser "${BANCO}", encontrado "${p(ln,1,3)}"`}],'"756"',BANCO);
  CF(ctx,'02.3B Lote de Serviço (4–7)',4,7,ln,[{test:/^\d{4}$/.test(p(ln,4,7)),sev:'ERROR',msg:`Deve ter 4 dígitos, encontrado "${p(ln,4,7)}"`}],'4 dígitos (igual ao header do lote)');
  CF(ctx,'03.3B Tipo de Registro (8)',8,8,ln,[{test:p(ln,8,8)==='3',sev:'ERROR',msg:`Deve ser "3", encontrado "${p(ln,8,8)}"`}],'"3"','3');
  CF(ctx,'04.3B Nº Sequencial do Registro (9–13)',9,13,ln,[{test:/^\d{5}$/.test(p(ln,9,13)),sev:'ERROR',msg:`Deve ter 5 dígitos, encontrado "${p(ln,9,13)}"`}],'5 dígitos');
  CF(ctx,'05.3B Segmento (14)',14,14,ln,[{test:p(ln,14,14).toUpperCase()==='B',sev:'ERROR',msg:`Deve ser "B", encontrado "${p(ln,14,14)}"`}],'"B"','B');
  CF(ctx,'06.3B Uso Exclusivo FEBRABAN (15–17)',15,17,ln,[{test:isBl(p(ln,15,17)),sev:'WARN',msg:'Deve ser 3 brancos'}],'3 brancos','   ');
  CF(ctx,'07.3B Tipo Inscrição Favorecido (18)',18,18,ln,[{test:['1','2'].includes(p(ln,18,18)),sev:'ERROR',msg:`Deve ser "1"(PF) ou "2"(PJ) — obrigatório para Folha. Encontrado: "${p(ln,18,18)}"`}],'"1"=Pessoa Física / "2"=Pessoa Jurídica');
  const ni=p(ln,19,32);
  const ti=p(ln,18,18);
  CF(ctx,'08.3B Nº Inscrição Favorecido (19–32)',19,32,ln,[
    {test:/^\d{14}$/.test(ni),sev:'ERROR',msg:`Deve ter 14 dígitos, encontrado "${ni}"`},
    {test:!(ti==='1'&&!chkCPF(ni.slice(-11))),sev:'WARN',msg:`CPF "${ni.slice(-11)}" com DV inválido`},
    {test:!(ti==='2'&&!chkCNPJ(ni)),sev:'WARN',msg:`CNPJ "${ni}" com DV inválido`}
  ],'14 dígitos numéricos (CPF c/ zeros à esq. ou CNPJ)');
  // Endereço do favorecido (opcional)
  CF(ctx,'09.3B Logradouro (33–62)',33,62,ln,[],'Alfanumérico, opcional');
  CF(ctx,'10.3B Nº do Local (63–67)',63,67,ln,[{test:numOuBranco(63,67),sev:'WARN',msg:`Numérico (ou brancos se não informado), encontrado "${p(ln,63,67)}"`}],'5 dígitos, opcional');
  CF(ctx,'11.3B Complemento (68–82)',68,82,ln,[],'Alfanumérico, opcional');
  CF(ctx,'12.3B Bairro (83–97)',83,97,ln,[],'Alfanumérico, opcional');
  CF(ctx,'13.3B Cidade (98–117)',98,117,ln,[],'Alfanumérico, opcional');
  CF(ctx,'14.3B CEP (118–122)',118,122,ln,[{test:numOuBranco(118,122),sev:'WARN',msg:`Numérico (ou brancos se não informado), encontrado "${p(ln,118,122)}"`}],'5 dígitos, opcional');
  CF(ctx,'15.3B Complemento do CEP (123–125)',123,125,ln,[],'3 posições, opcional');
  CF(ctx,'16.3B Estado (126–127)',126,127,ln,[{test:/^[A-Z]{2}$/.test(p(ln,126,127))||isBl(p(ln,126,127)),sev:'WARN',msg:`Sigla com 2 letras maiúsculas (ou brancos), encontrado "${p(ln,126,127)}"`}],'Sigla da UF, opcional');
  // Dados do pagamento
  CF(ctx,'17.3B Data do Vencimento (128–135)',128,135,ln,[{test:p(ln,128,135)==='00000000'||isBl(p(ln,128,135))||chkDt(p(ln,128,135)).ok,sev:'WARN',msg:`DDMMAAAA, zeros ou brancos. Encontrado "${p(ln,128,135)}"`}],'DDMMAAAA (ou zeros)');
  CF(ctx,'18.3B Valor do Documento (136–150)',136,150,ln,[{test:valor(136,150)||isBl(p(ln,136,150)),sev:'WARN',msg:`15 dígitos 9(13)V2, encontrado "${p(ln,136,150)}"`}],'15 dígitos 9(13)V2');
  CF(ctx,'19.3B Valor do Abatimento (151–165)',151,165,ln,[{test:valor(151,165)||isBl(p(ln,151,165)),sev:'WARN',msg:`15 dígitos 9(13)V2, encontrado "${p(ln,151,165)}"`}],'15 dígitos 9(13)V2');
  CF(ctx,'20.3B Valor do Desconto (166–180)',166,180,ln,[{test:valor(166,180)||isBl(p(ln,166,180)),sev:'WARN',msg:`15 dígitos 9(13)V2, encontrado "${p(ln,166,180)}"`}],'15 dígitos 9(13)V2');
  CF(ctx,'21.3B Valor da Mora (181–195)',181,195,ln,[{test:valor(181,195)||isBl(p(ln,181,195)),sev:'WARN',msg:`15 dígitos 9(13)V2, encontrado "${p(ln,181,195)}"`}],'15 dígitos 9(13)V2');
  CF(ctx,'22.3B Valor da Multa (196–210)',196,210,ln,[{test:valor(196,210)||isBl(p(ln,196,210)),sev:'WARN',msg:`15 dígitos 9(13)V2, encontrado "${p(ln,196,210)}"`}],'15 dígitos 9(13)V2');
  CF(ctx,'23.3B Código/Documento do Favorecido (211–225)',211,225,ln,[],'Alfanumérico, opcional (P008)');
  CF(ctx,'24.3B Aviso ao Favorecido (226)',226,226,ln,[{test:['0','2','5','6','7'].includes(p(ln,226,226)),sev:'WARN',msg:`Valor inválido: "${p(ln,226,226)}". Válidos: 0=Não Emite 2=Só Remetente 5=Só Favorecido 6=Ambos`}],'0=Não Emite / 2=Só Remetente / 5=Só Favorecido / 6=Ambos','0');
  CF(ctx,'25.3B Código UG Centralizadora — SIAPE (227–232)',227,232,ln,[],'Uso exclusivo do SIAPE; brancos para os demais');
  CF(ctx,'26.3B Uso Exclusivo FEBRABAN (233–240)',233,240,ln,[{test:isBl(p(ln,233,240)),sev:'WARN',msg:'Deve ser 8 brancos'}],'8 brancos','        ');
}

/* ═══════════════════════════════════════════════════════════════
   VALIDATE PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */
function validate(lines){
  const iss=[],fr=[],recs=[];
  let lotsOpen=0,loteCur=0,regsInLote=0,somaLote=0,totalRegs=0,totalLotes=0,seqLote=1,seqReg=0;
  let hdrFound=false,trlFound=false,loteForma='',loteTipoS='',loteTipo='';
  const movLote={};
  const addI=(ln,sev,seg,msg)=>iss.push({line:ln,sev,seg,msg});
  if(!lines.length){addI(0,'ERROR','ARQUIVO','Arquivo vazio.');return{iss,fr,recs};}

  lines.forEach((raw,idx)=>{
    const ln=idx+1;const line=raw.padEnd(240,' ');
    if(raw.length!==240)addI(ln,'ERROR','ESTRUTURA',`Linha ${ln} tem ${raw.length} chars (esperado: 240). CNAB240 = 240 bytes + CRLF.`);
    const rt=p(line,8,8);

    if(rt==='0'){
      hdrFound=true;if(idx!==0)addI(ln,'ERROR','HEADER ARQ','Header do arquivo deve ser a primeira linha.');totalRegs++;
      const ctx={iss,fr,ln,seg:'HEADER ARQ'};vHA(ctx,line);
      recs.push({ln,desc:`Header do Arquivo · Sicoob 756 · Layout: ${p(line,164,166)} · ${p(line,143,143)==='1'?'Remessa':'Retorno'}`,ok:true});

    } else if(rt==='1'){
      totalRegs++;const lN=parseInt(p(line,4,7),10);
      if(lN!==seqLote)addI(ln,'ERROR','HEADER LOTE',`Lote fora de sequência: "${p(line,4,7)}" (esperado: ${String(seqLote).padStart(4,'0')})`);
      lotsOpen++;totalLotes++;loteCur=lN;seqLote++;seqReg=0;regsInLote=0;somaLote=0;movLote[lN]=0;
      const ctx={iss,fr,ln,seg:`HEADER LOTE #${String(lN).padStart(4,'0')}`};
      const r=vHL(ctx,line);loteTipoS=r.ts;loteForma=r.fo;loteTipo=r.ts;
      const desc_fo={'01':'CCtaCte','05':'Poupança','11':'TribCodBarras','16':'DARF','17':'GPS','18':'DARFSimples','30':'BoletoSicoob','31':'Boleto3ºBanco','41':'TED OuTit','43':'TED MesmaTit','45':'PIX Transf','47':'PIX QRCode'};
      recs.push({ln,desc:`Header Lote #${p(line,4,7)} · Serviço: ${loteTipoS} · Forma: ${desc_fo[loteForma]||loteForma}`,ind:1,ok:true});

    } else if(rt==='5'&&p(line,4,7)!=='9999'){
      totalRegs++;if(p(line,4,7)!==String(loteCur).padStart(4,'0'))addI(ln,'ERROR','TRAILER LOTE',`Lote "${p(line,4,7)}" diverge do lote aberto "${String(loteCur).padStart(4,'0')}".`);
      lotsOpen--;
      const ctx={iss,fr,ln,seg:`TRAILER LOTE #${p(line,4,7)}`};vTL(ctx,line,regsInLote,somaLote);
      recs.push({ln,desc:`Trailer Lote #${p(line,4,7)} · Registros: ${parseInt(p(line,18,23),10)}`,ind:1,ok:true});

    } else if(rt==='9'){
      trlFound=true;totalRegs++;if(ln!==lines.length)addI(ln,'WARN','TRAILER ARQ','Trailer não é a última linha.');
      if(p(line,4,7)!=='9999')addI(ln,'ERROR','TRAILER ARQ',`Lote deve ser "9999", encontrado "${p(line,4,7)}".`);
      if(lotsOpen!==0)addI(ln,'ERROR','TRAILER ARQ',`${lotsOpen} lote(s) sem trailer.`);
      const ctx={iss,fr,ln,seg:'TRAILER ARQ'};vTA(ctx,line,totalLotes,totalRegs);
      recs.push({ln,desc:`Trailer do Arquivo · Lotes: ${parseInt(p(line,18,23),10)} · Registros: ${parseInt(p(line,24,29),10)}`,ok:true});

    } else if(rt==='3'){
      totalRegs++;regsInLote++;seqReg++;movLote[loteCur]=(movLote[loteCur]||0)+1;
      const sc=p(line,14,14).toUpperCase();const sr=parseInt(p(line,9,13),10);
      if(sr!==seqReg)addI(ln,'ERROR',`SEG ${sc}`,`Seq: ${sr} (esperado: ${seqReg}). Deve iniciar em 00001 em cada lote.`);
      const ctx={iss,fr,ln,seg:`SEG ${sc}`};

      if(sc==='A'){
        vSA(ctx,line,loteForma);
        somaLote+=parseInt(p(line,120,134),10)||0;
        recs.push({ln,desc:`Seg. A — ${loteForma==='45'?'PIX':(loteForma==='41'||loteForma==='43')?'TED':'Crédito/OP'} · Lote: ${p(line,4,7)} · Seq: ${String(sr).padStart(5,'0')}`,ind:2,ok:true});

      } else if(sc==='B'){
        // Folha de pagamento (tipo serviço 30) usa layout diferente de segmento B
        if(loteTipoS==='30'){vSBFolha(ctx,line);}
        else{vSB(ctx,line,loteForma);}
        recs.push({ln,desc:`Seg. B — ${loteTipoS==='30'?'Folha Pagamento':loteForma==='45'?'PIX Dados':'Compl. Favorecido'} · Lote: ${p(line,4,7)} · Seq: ${String(sr).padStart(5,'0')}`,ind:2,ok:true});

      } else if(sc==='J'){
        const idReg=p(line,18,19);
        if(idReg==='52'){
          // J-52 ou J-52-PIX: distinguir pelo conteúdo das posições 132-210 (URL=PIX)
          const urlChave=p(line,132,210).trim();
          const isPixQR=loteForma==='47'||urlChave.length>5;
          if(isPixQR){
            vSJ52pix(ctx,line);
            recs.push({ln,desc:`Seg. J52-PIX QR Code · Lote: ${p(line,4,7)} · Seq: ${String(sr).padStart(5,'0')}`,ind:2,ok:true});
          } else {
            vSJ52(ctx,line);
            recs.push({ln,desc:`Seg. J52 — Pagador/Cedente/Sacador · Lote: ${p(line,4,7)} · Seq: ${String(sr).padStart(5,'0')}`,ind:2,ok:true});
          }
        } else {
          vSJ(ctx,line,loteForma);
          somaLote+=parseInt(p(line,153,167),10)||0;
          recs.push({ln,desc:`Seg. J — ${loteForma==='47'?'PIX QR Code':'Boleto/Título'} · Lote: ${p(line,4,7)} · Seq: ${String(sr).padStart(5,'0')}`,ind:2,ok:true});
        }

      } else if(sc==='O'){
        vSO(ctx,line);
        somaLote+=parseInt(p(line,108,122),10)||0;
        recs.push({ln,desc:`Seg. O — Tributos c/ Código de Barras · Lote: ${p(line,4,7)} · Seq: ${String(sr).padStart(5,'0')}`,ind:2,ok:true});

      } else if(sc==='N'){
        vSN(ctx,line);
        somaLote+=parseInt(p(line,96,110),10)||0;
        const ct=p(line,133,134).trim();const dn=ct==='16'?'DARF Normal':ct==='17'?'GPS':ct==='18'?'DARF Simples':`Tributo(${ct})`;
        recs.push({ln,desc:`Seg. N — ${dn} (s/ cód. barras) · Lote: ${p(line,4,7)} · Seq: ${String(sr).padStart(5,'0')}`,ind:2,ok:true});

      } else if(sc==='W'){
        recs.push({ln,desc:`Seg. W — Inf. Complementares (Opcional) · Lote: ${p(line,4,7)} · Seq: ${String(sr).padStart(5,'0')}`,ind:2,ok:true});

      } else if(sc==='Z'){
        recs.push({ln,desc:`Seg. Z — Autenticação do Pagamento (Retorno) · Lote: ${p(line,4,7)} · Seq: ${String(sr).padStart(5,'0')}`,ind:2,ok:true});

      } else {
        addI(ln,'WARN',`SEG ${sc}`,`Segmento desconhecido: "${sc}". Sicoob suporta: A,B,J,J52,J52-PIX,O,N,W,Z.`);
        recs.push({ln,desc:`Seg. ${sc} — Desconhecido`,ind:2,ok:false});
      }

    } else if(rt!=='5'){
      addI(ln,'ERROR','ESTRUTURA',`Tipo de registro inválido: "${rt}" (válidos: 0,1,3,5,9).`);
    }
  });

  if(!hdrFound)addI(0,'ERROR','ARQUIVO','Header do arquivo (tipo 0) não encontrado — deve ser a primeira linha.');
  if(!trlFound)addI(0,'ERROR','ARQUIVO','Trailer do arquivo (tipo 9) não encontrado — deve ser a última linha.');
  if(lotsOpen>0)addI(0,'ERROR','ARQUIVO',`${lotsOpen} lote(s) sem trailer correspondente.`);
  return{iss,fr,recs};
}

window.CNAB_REMESSA = window.CNAB_REMESSA || {};
window.CNAB_REMESSA['756'] = Object.assign({
    "codigo": "756",
    "nome": "Sicoob",
    "produto": "Sicoobnet Empresarial · v3.3 (05/2025)",
    "versao": "Banco 756 · Layout v3.3 · Folha v1.0 · TED · PIX · Boleto · Tributos",
    "suporta": "Suporta arquivos .REM e .TXT de remessa Sicoob Codificação ASCII (DOS/Windows) · Linhas de 240 bytes + CRLF · Banco 756",
    "cor": "#005A9E",
    "tinta": "#fff",
    "logo": "logos/Sicoob/sicoob-vector-logo.svg",
    "pagina": "Validador_CNAB240_Sicoob.html",
    "nota": "<strong>Como usar a Inspeção de Campos:</strong><br> Cada campo exibe duas fitas CNAB empilhadas: a fita <span style=\"color:var(--er);font-weight:700\">atual</span> mostra os bytes exatos do seu arquivo; a fita <span style=\"color:var(--ok);font-weight:700\">manual</span> mostra como deve ficar segundo os guias Sicoob v3.3 (Pagamentos) e v1.0 (Folha). Células <span style=\"display:inline-block;width:10px;height:10px;background:var(--erb);border:1px solid var(--er);border-radius:2px;vertical-align:middle\"></span> são bytes errados no arquivo; células <span style=\"display:inline-block;width:10px;height:10px;background:var(--okm);border:1px solid var(--ok);border-radius:2px;vertical-align:middle\"></span> são a correção exata. Campos ✓ OK ficam compactos. Para campos longos é exibida uma comparação de texto.<br> <strong>Regras Sicoob:</strong> Banco 756 · Versão layout arquivo 087 · PIX Transferência (Forma 45) · PIX QR Code (Forma 47) · TED (Forma 41/43) · Segmento J-52 obrigatório para boletos · J-52-PIX para Pix QR Code."
  }, { validar: validate });
})();
