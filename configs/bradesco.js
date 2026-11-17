/* Configuração do Preenchedor .srb — Bradesco (237).
 * Formato dos campos: ver configs/santander.js.
 * Base: "Manual de Procedimentos Multipag Bradesco", versão 6, julho/2023,
 * header de arquivo (p. 9-10) e header de lote.
 *
 * O nome da empresa (posições 73-102) NÃO é token neste template: o Bradesco
 * recebe esse campo com FIXO=N em todos os blocos, ou seja, é o motor que o
 * preenche em tempo de execução. Por isso o Preenchedor não pergunta o nome
 * do titular aqui — ao contrário do que faz no BB e no Santander.
 *
 * O convênio (33-52) é alfanumérico: o layout o define como Alfa e o template
 * completa o campo com espaços à direita (D| |), não com zeros.
 */
(function () {
  window.SRB_CONFIGS = window.SRB_CONFIGS || {};

  window.SRB_CONFIGS['237'] = {
    code: '237',
    name: 'Bradesco',
    produto: 'Pagamento a Fornecedores · Multipag v6',
    logo: 'logos/Bradesco%20S.A/bradesco.svg',
    cor: '#CC0000',
    corClara: '#FF3B3B',
    fields: [
      {
        token: 'Inscricao_InsertIA',
        label: 'CPF / CNPJ do titular',
        normalizer: 'cpfcnpj',
        rule: { kind: 'cpfcnpj', alfanumerico: false },
        obs: 'CPF (11 dígitos) ou CNPJ (14 dígitos), com DV válido. Aceita máscara. O Multipag v6 (julho/2023) é anterior ao CNPJ alfanumérico.'
      },
      {
        token: 'TipoInscricao_InsertIA',
        label: 'Tipo de inscrição',
        input: false,
        derived: true,
        deriveFrom: 'Inscricao_InsertIA',
        deriveKind: 'tipoInscricao',
        obs: 'Derivado do CPF/CNPJ: 11 dígitos → "1", 14 dígitos → "2".'
      },
      {
        token: 'Convenio_InsertIA',
        label: 'Código do convênio',
        normalizer: 'trim',
        rule: { kind: 'charset', charset: 'alnum', min: 1 },
        obs: 'Código do convênio no banco (campo alfanumérico de 20 posições). O motor completa com espaços à direita.'
      },
      {
        token: 'Agencia_InsertIA',
        label: 'Agência',
        normalizer: 'account',
        dvToken: 'DVAgencia_InsertIA',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Somente dígitos (até 5). Um DV no formato "-X" é movido para o campo DV da agência.'
      },
      {
        token: 'DVAgencia_InsertIA',
        label: 'DV da agência',
        normalizer: 'trim',
        rule: { kind: 'charset', charset: 'any', min: 1 },
        obs: 'Exatamente 1 caractere. O layout define o campo como alfanumérico, então aceita letra.'
      },
      {
        token: 'CtaBanc_InsertIA',
        label: 'Conta corrente',
        normalizer: 'account',
        dvToken: 'DVBanc_InsertIA',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Somente dígitos (até 12). Um DV no formato "-X" é movido para o campo DV da conta.'
      },
      {
        token: 'DVBanc_InsertIA',
        label: 'DV da conta',
        normalizer: 'trim',
        rule: { kind: 'charset', charset: 'any', min: 1 },
        obs: 'Exatamente 1 caractere. O layout define o campo como alfanumérico, então aceita letra.'
      }
    ]
  };
})();
