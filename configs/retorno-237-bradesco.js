/* Retorno CNAB240 — Bradesco (237), Pagamento a Fornecedores / Multipag.
 * Base: manual "Pagamento a Fornecedores", versão 6, julho/2023, nota G059
 * (p. 89-96). O Bradesco adota a tabela da FEBRABAN e acrescenta os códigos
 * da família 5x ("Exclusivo Layout CNAB Bradesco").
 */
(function () {
  window.RET_CONFIGS = window.RET_CONFIGS || {};
  window.RET_CONFIGS['237'] = {
    code: '237',
    name: 'Bradesco',
    produto: 'Pagamento a Fornecedores · Multipag v6',
    logo: 'logos/Bradesco%20S.A/bradesco.svg',
    cor: '#CC0000',
    manual: 'Manual Bradesco v6, julho/2023',
    fonte: 'proprio',
    refs: {
      tipos: 'Manual Bradesco v6, nota G059, p. 89',
      header: 'Nota G016 — Código Remessa/Retorno, header de arquivo, posição 143',
      movimento: 'Manual Bradesco v6, G059: “00 = Crédito ou Débito Efetivado — este código indica que o pagamento foi confirmado”',
      critica: 'Manual Bradesco v6, G059: “BD = Inclusão Efetuada com Sucesso” e “5A = Agendado sob lista de débito”',
      segZ: 'Segmento Z — autenticação do pagamento',
      aviso: 'Trailer de lote, número do aviso de débito (nota G068)',
      dataReal: 'Segmento A, data real da efetivação'
    },
    ocor: {
      'ZA':'Agência/Conta do Favorecido Substituída (informativo)',
      'ZB':'Divergência entre o nome do beneficiário e o cadastro da Receita Federal',
      'ZC':'Confirmação de Antecipação de Valor','ZD':'Antecipação Parcial de Valor',
      'ZE':'Título bloqueado ou não encontrado na base da CIP','ZF':'Sistema em contingência – título com valor maior que referência',
      'ZG':'Sistema em contingência – título vencido','ZH':'Sistema em contingência – título indexado',
      'ZI':'Beneficiário divergente do constante na CIP','ZJ':'Limite de pagamentos parciais excedido','ZK':'Boleto já liquidado na base da CIP',
      '5A':'Agendado sob lista de débito','5B':'Pagamento não autorizado sob lista de débito','5C':'Lista com mais de uma modalidade',
      '5D':'Lista com mais de uma data de pagamento','5E':'Número de lista duplicado','5F':'Lista de débito vencida e não autorizada',
      '5I':'Ordem de Pagamento emitida — pagamento realizado ao favorecido nesta data','5J':'Ordem de pagamento com data limite vencida',
      '5M':'Número de lista de débito inválido','5T':'Pagamento realizado em contrato na condição de TESTE'
    },
    maisPago: ['5I'],
    maisAgend: ['5A'],
    maisNaoEfet: ['5B'],
    info: ['ZA','ZB','ZC','ZD','5T']
  };
})();
