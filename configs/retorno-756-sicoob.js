/* Retorno CNAB240 — Sicoob (756), Sicoobnet Empresarial.
 * Base: guia "Importação de arquivos CNAB 240 - Pagamentos", v3.3, nota G059
 * (p. 43). O Sicoob parte da tabela da FEBRABAN, mas redefine dois códigos:
 *   BF = transação REJEITADA por pendência de assinatura (na FEBRABAN é
 *        "exclusão efetuada com sucesso");
 *   PD = transação pendente de assinatura (ou seja, ainda não paga).
 * Por isso BF sai da lista de "excluído" e PD entra como bloqueado.
 */
(function () {
  window.RET_CONFIGS = window.RET_CONFIGS || {};
  window.RET_CONFIGS['756'] = {
    code: '756',
    name: 'Sicoob',
    produto: 'Sicoobnet Empresarial · Guia CNAB 240 v3.3',
    logo: 'logos/Sicoob/sicoob-vector-logo.svg',
    cor: '#005A9E',
    manual: 'Guia Sicoob v3.3',
    fonte: 'proprio',
    notas: [
      'No Sicoob, <b>BF</b> é “transação rejeitada por pendência de assinatura” e <b>PD</b> é “transação pendente de assinatura” — diferente do padrão FEBRABAN, onde BF é exclusão efetuada com sucesso. Um pagamento com PD depende de assinatura no Sicoobnet e ainda não foi pago.'
    ],
    refs: {
      tipos: 'Guia Sicoob v3.3, nota G059, p. 43',
      header: 'Nota G016 — Código Remessa/Retorno, header de arquivo, posição 143',
      movimento: 'Guia Sicoob v3.3, G059: “00 = Crédito ou débito efetivado — este código indica que o pagamento foi confirmado”',
      critica: 'Guia Sicoob v3.3, G059: “BD = Inclusão efetuada com sucesso — a inclusão foi efetuada e está agendada”',
      segZ: 'Segmento Z — autenticação do pagamento',
      aviso: 'Trailer de lote, número do aviso de débito',
      dataReal: 'Segmento A, data real da efetivação'
    },
    ocor: {
      '01':'Conta Corrente da Empresa com Saldo Insuficiente','02':'Débito Cancelado pelo Pagador',
      'AJ':'Rejeição CNAB — estrutura do registro e/ou do lote rejeitada (obrigatoriedade, domínio ou tipo de dado)',
      'AN':'Tipo de conta do favorecido inválido','AP':'Data lançamento inválida',
      'BD':'Inclusão efetuada com sucesso — a inclusão foi efetuada e está agendada',
      'BF':'Transação rejeitada por pendência de assinatura','PD':'Transação pendente de assinatura',
      'PA':'Pix não efetivado — registro Pix negocialmente rejeitado',
      'PC':'Conta transacional inválida/inexistente/encerrada/bloqueada no PSP do Recebedor',
      'PE':'Tipo de transação não é suportado/autorizado na conta transacional especificada',
      'PG':'CPF/CNPJ do usuário recebedor incorreto','PH':'Ordem rejeitada pelo PSP do Recebedor','PI':'ISPB Pagador / Recebedor inválido',
      'PJ':'Chave não cadastrada no DICT','PK':'QR Code inválido/vencido','ZJ':'Limite de pagamentos parciais excedido'
    },
    agend: ['BD'],
    excl: [],
    bloq: ['PD']
  };
})();
