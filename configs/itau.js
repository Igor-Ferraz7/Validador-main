/* Configuração do Preenchedor .srb — Itaú (341).
 * Formato dos campos: ver configs/santander.js.
 * No Itaú o header não tem convênio, e o dígito da agência/conta é o DAC
 * (posição 72), que no template é o token DigitoVerificador_InsertIA.
 */
(function () {
  window.SRB_CONFIGS = window.SRB_CONFIGS || {};

  window.SRB_CONFIGS['341'] = {
    code: '341',
    name: 'Itaú',
    produto: 'SISPAG · Sistema de Contas a Pagar',
    logo: 'logos/Ita%C3%BA%20Unibanco%20S.A/itau-2-laranja.svg',
    cor: '#EC7000',
    corClara: '#FF8820',
    fields: [
      {
        token: 'Inscricao_InsertIA',
        label: 'CPF / CNPJ do titular',
        normalizer: 'cpfcnpj',
        rule: { kind: 'cpfcnpj', alfanumerico: false },
        obs: 'CPF (11 dígitos) ou CNPJ (14 dígitos), com DV válido. Aceita máscara. O manual do Itaú ainda não trata CNPJ com letras.'
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
        normalizer: 'digits',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Somente dígitos (agência Itaú com 4 dígitos).'
      },
      {
        token: 'CtaBanc_InsertIA',
        label: 'Conta corrente',
        normalizer: 'account',
        dvToken: 'DigitoVerificador_InsertIA',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Somente dígitos. Um DAC no formato "-X" é movido para o campo DAC.'
      },
      {
        token: 'DigitoVerificador_InsertIA',
        label: 'DAC da agência/conta',
        normalizer: 'trim',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Dígito de autoconferência da agência/conta (1 dígito).'
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
