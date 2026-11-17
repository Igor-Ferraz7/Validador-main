/* Retorno CNAB240 — Credisis (097).
 * Não há manual da Credisis em docs/cnab, então a tabela de ocorrências é a
 * padrão da FEBRABAN (nota G059). As posições seguem o padrão, iguais às do
 * mapeamento usado na integração (RETORNO-CREDISIS.txt).
 */
(function () {
  window.RET_CONFIGS = window.RET_CONFIGS || {};
  window.RET_CONFIGS['097'] = {
    code: '097',
    name: 'Credisis',
    produto: 'Pagamento a Fornecedores · CNAB 240',
    logo: 'logos/Credisis/credisis.svg',
    cor: '#00A650',
    manual: 'Layout FEBRABAN 240 (sem manual da Credisis catalogado)',
    fonte: 'febraban',
    notas: [
      'Ainda não há manual da Credisis em <code>docs/cnab</code>. A leitura usa a tabela padrão da FEBRABAN (nota G059), então um código exclusivo da Credisis pode aparecer sem descrição.'
    ],
    refs: {
      tipos: 'Layout FEBRABAN 240, nota G059',
      header: 'Nota G016 — Código Remessa/Retorno, header de arquivo, posição 143',
      movimento: 'FEBRABAN, nota G059: “00 = Crédito ou Débito Efetivado — este código indica que o pagamento foi confirmado”',
      critica: 'FEBRABAN, nota G059: “BD = Inclusão Efetuada com Sucesso”',
      segZ: 'Segmento Z — autenticação do pagamento',
      aviso: 'Trailer de lote, número do aviso de débito',
      dataReal: 'Segmento A, data real da efetivação'
    }
  };
})();
