/* Retorno CNAB240 — Sicredi (748), Pagamento a Fornecedor.
 * Base: manual "Pagamento a Fornecedor - CNAB 240 FEBRABAN", V1.4, nota G099
 * (p. 31-35) e item 7 "Leitura de arquivo de retorno" (p. 25).
 * O Sicredi adota a tabela da FEBRABAN; aqui ficam só os códigos em que o
 * manual dele diverge ou acrescenta.
 */
(function () {
  window.RET_CONFIGS = window.RET_CONFIGS || {};
  window.RET_CONFIGS['748'] = {
    code: '748',
    name: 'Sicredi',
    produto: 'Pagamento a Fornecedor · Manual V1.4',
    logo: 'logos/Sicredi/logo-svg2.svg',
    cor: '#009A44',
    manual: 'Manual Sicredi V1.4',
    fonte: 'proprio',
    refs: {
      tipos: 'Manual Sicredi V1.4, item 7, p. 25: o retorno “informa se o arquivo foi agendado, se foi pago com sucesso ou teve alguma crítica”',
      header: 'Nota G016 — Código Remessa/Retorno, header de arquivo, posição 143',
      movimento: 'Manual Sicredi V1.4, nota G099, p. 31: “00 = Crédito ou débito efetivado — indica que o pagamento foi confirmado”',
      critica: 'Manual Sicredi V1.4, nota G099: “BD = Inclusão efetuada com sucesso”',
      segZ: 'Segmento Z — autenticação da remessa',
      aviso: 'Trailer de lote, número do aviso de débito',
      dataReal: 'Segmento A, data real da efetivação'
    },
    ocor: {
      '11':'Agência/conta corrente/DV inválido',
      'AA':'Controle inválido — movimento já processado (arquivo duplicado) ou campos de controle inválidos',
      'ZA':'Agência / conta do favorecido substituída (informativo)','ZE':'Título bloqueado na base',
      'ZF':'Sistema em contingência – título com valor maior que referência','ZG':'Sistema em contingência – título vencido',
      'ZH':'Sistema em contingência – título indexado','ZI':'Beneficiário divergente','ZJ':'Limite de pagamentos parciais excedido','ZK':'Boleto já liquidado'
    },
    info: ['ZA'],
    forma: { '30':'Liquidação de título do Sicredi','31':'Pagamento de título de outros bancos' }
  };
})();
