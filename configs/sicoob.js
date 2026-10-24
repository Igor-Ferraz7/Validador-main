/* Configuração do Preenchedor .srb — Sicoob (756).
 * Formato dos campos: ver configs/santander.js.
 */
(function () {
  window.SRB_CONFIGS = window.SRB_CONFIGS || {};

  window.SRB_CONFIGS['756'] = {
    code: '756',
    name: 'Sicoob',
    produto: 'Sicoobnet Empresarial · Guia CNAB 240 v3.3',
    logo: 'logos/Sicoob/sicoob-vector-logo.svg',
    cor: '#005A9E',
    corClara: '#0070C0',
    fields: [
      {
        token: 'Inscricao_InsertIA',
        label: 'CPF / CNPJ do titular',
        normalizer: 'cpfcnpj',
        rule: { kind: 'cpfcnpj', alfanumerico: false },
        obs: 'CPF (11 dígitos) ou CNPJ (14 dígitos), com DV válido. Aceita máscara. O guia do Sicoob ainda não trata CNPJ com letras.'
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
        obs: 'Código disponibilizado pelo internet banking após a adesão ao convênio CNAB 240 (alfanumérico, até 20).'
      },
      {
        token: 'Agencia_InsertIA',
        label: 'Cooperativa (agência)',
        normalizer: 'digits',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Código da cooperativa, somente dígitos.'
      },
      {
        token: 'CtaBanc_InsertIA',
        label: 'Conta corrente',
        normalizer: 'account',
        dvToken: 'DVBanc_InsertIA',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Somente dígitos. Um DV no formato "-X" é movido para o campo DV.'
      },
      {
        token: 'DVBanc_InsertIA',
        label: 'DV da conta',
        normalizer: 'trim',
        rule: { kind: 'charset', charset: 'any', min: 1 },
        obs: 'Exatamente 1 caractere.'
      },
      {
        token: 'NomeEmpresa_InsertIA',
        label: 'Nome do titular',
        normalizer: 'companyName',
        rule: { kind: 'charset', charset: 'company', min: 1 },
        obs: 'Maiúsculas, sem acentos. Limite = menor largura entre as ocorrências.'
      }
    ]
  };
})();
