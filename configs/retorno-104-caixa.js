/* Retorno CNAB240 — Caixa Econômica Federal (104).
 * Não há manual da Caixa em docs/cnab, então a tabela de ocorrências é a
 * padrão da FEBRABAN (nota G059). As posições dos segmentos A e J seguem o
 * mapeamento usado na integração (RETORNO-CAIXA.txt), que difere do padrão:
 * o "seu número" vem em 80-92 no segmento A e em 189-202 no segmento J.
 */
(function () {
  window.RET_CONFIGS = window.RET_CONFIGS || {};
  window.RET_CONFIGS['104'] = {
    code: '104',
    name: 'Caixa Econômica Federal',
    produto: 'Pagamento a Fornecedores · CNAB 240',
    logo: '',
    cor: '#0070AF',
    manual: 'Layout FEBRABAN 240 (sem manual da Caixa catalogado)',
    fonte: 'febraban',
    notas: [
      'Ainda não há manual da Caixa em <code>docs/cnab</code>. A leitura usa a tabela padrão da FEBRABAN (nota G059) e o mapeamento de posições da integração, então um código exclusivo da Caixa pode aparecer sem descrição.'
    ],
    refs: {
      tipos: 'Layout FEBRABAN 240, nota G059',
      header: 'Nota G016 — Código Remessa/Retorno, header de arquivo, posição 143',
      movimento: 'FEBRABAN, nota G059: “00 = Crédito ou Débito Efetivado — este código indica que o pagamento foi confirmado”',
      critica: 'FEBRABAN, nota G059: “BD = Inclusão Efetuada com Sucesso”',
      segZ: 'Segmento Z — autenticação do pagamento',
      aviso: 'Trailer de lote, número do aviso de débito',
      dataReal: 'Segmento A, data real da efetivação'
    },
    seg: {
      A: function (p, l) { return { nome:p(l,44,73), docCli:p(l,80,92), data:p(l,94,101), valor:p(l,120,134), docBanco:p(l,135,154), dataReal:p(l,155,162), valorReal:p(l,163,177) }; },
      J: function (p, l) { return { nome:p(l,62,91), venc:p(l,92,99), data:p(l,145,152), valor:p(l,153,167), docCli:p(l,189,202), docBanco:p(l,203,222) }; }
    }
  };
})();
