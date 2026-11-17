/* Configuração do Preenchedor .srb — Banco do Brasil (001).
 * Formato dos campos: ver configs/santander.js.
 * Base: manual "Particularidades BB - CNAB240", junho/2026, header de arquivo
 * (p. 5) e header de lote (p. 6).
 *
 * No BB a agência e a conta têm dígitos verificadores separados (posições 58 e
 * 71), e ambos podem ser a letra X — por isso não são tratados como "somente
 * dígitos". A posição 72 (DV da agência/conta) é fixa em "0" no template,
 * conforme o manual, e não é um token.
 */
(function () {
  window.SRB_CONFIGS = window.SRB_CONFIGS || {};

  window.SRB_CONFIGS['001'] = {
    code: '001',
    name: 'Banco do Brasil',
    produto: 'Pagamentos · Particularidades CNAB240',
    logo: 'logos/Banco%20do%20Brasil%20S.A/banco-do-brasil-com-fundo.svg',
    cor: '#F5C518',
    corClara: '#FFD83D',
    fields: [
      {
        token: 'Inscricao_InsertIA',
        label: 'CPF / CNPJ do titular',
        normalizer: 'cpfcnpj',
        rule: { kind: 'cpfcnpj', alfanumerico: false },
        obs: 'CPF (11 dígitos) ou CNPJ (14 dígitos), com DV válido. Aceita máscara. O manual do BB ainda não trata CNPJ com letras.'
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
        token: 'NomeEmpresa_InsertIA',
        label: 'Nome do titular',
        normalizer: 'companyName',
        rule: { kind: 'charset', charset: 'company', min: 1 },
        obs: 'Maiúsculas, sem acentos. Limite = menor largura entre as ocorrências.'
      },
      {
        token: 'Convenio_InsertIA',
        label: 'Código do convênio',
        normalizer: 'digits',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Convênio de pagamento, somente dígitos (até 9). O motor completa com zeros à esquerda.'
      },
      {
        token: 'Agencia_InsertIA',
        label: 'Agência',
        normalizer: 'account',
        dvToken: 'DVAgencia_InsertIA',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Somente dígitos (até 4). Um DV no formato "-X" é movido para o campo DV da agência.'
      },
      {
        token: 'DVAgencia_InsertIA',
        label: 'DV da agência',
        normalizer: 'trim',
        rule: { kind: 'charset', charset: 'any', min: 1 },
        obs: 'Exatamente 1 caractere. Se for a letra X, informe em maiúscula.'
      },
      {
        token: 'CtaBanc_InsertIA',
        label: 'Conta corrente',
        normalizer: 'account',
        dvToken: 'DVBanc_InsertIA',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Somente dígitos. Um DV no formato "-X" é movido para o campo DV da conta.'
      },
      {
        token: 'DVBanc_InsertIA',
        label: 'DV da conta',
        normalizer: 'trim',
        rule: { kind: 'charset', charset: 'any', min: 1 },
        obs: 'Exatamente 1 caractere. Se for a letra X, informe em maiúscula.'
      }
    ]
  };
})();
