/* Configuração do Preenchedor .srb — Sicredi (748).
 * Formato dos campos: ver configs/santander.js.
 * O convênio do Sicredi é preenchido pelo motor (não é token); a agência tem
 * DV próprio (nota G004 do manual), no token DVAgencia_InsertIA.
 */
(function () {
  window.SRB_CONFIGS = window.SRB_CONFIGS || {};

  window.SRB_CONFIGS['748'] = {
    code: '748',
    name: 'Sicredi',
    produto: 'Pagamento a Fornecedor · Manual V1.4',
    logo: 'logos/Sicredi/logo-svg2.svg',
    cor: '#009A44',
    corClara: '#00B84F',
    fields: [
      {
        token: 'Inscricao_InsertIA',
        label: 'CPF / CNPJ do titular',
        normalizer: 'cpfcnpj',
        rule: { kind: 'cpfcnpj', alfanumerico: false },
        obs: 'CPF (11 dígitos) ou CNPJ (14 dígitos), com DV válido. Aceita máscara. O manual do Sicredi ainda não trata CNPJ com letras.'
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
        token: 'Agencia_InsertIA',
        label: 'Agência',
        normalizer: 'account',
        dvToken: 'DVAgencia_InsertIA',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Somente dígitos. Um DV no formato "-X" é movido para o campo DV da agência.'
      },
      {
        token: 'DVAgencia_InsertIA',
        label: 'DV da agência',
        normalizer: 'trim',
        rule: { kind: 'charset', charset: 'alnum', min: 1 },
        obs: 'Exatamente 1 caractere (nota G004: consulte o gerente da conta).'
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
