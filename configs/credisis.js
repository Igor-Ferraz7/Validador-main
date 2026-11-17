/* Configuração do Preenchedor .srb — Credisis (097).
 * Formato dos campos: ver configs/santander.js.
 *
 * Não há manual da Credisis em docs/cnab: as posições vêm do próprio template
 * e seguem o padrão FEBRABAN (header de arquivo e header de lote). Se algum dia
 * o manual entrar no catálogo, revalide as larguras com a skill auditar-cnab.
 *
 * O convênio (33-52) é alfanumérico de fato: no arquivo de origem ele vinha com
 * uma sigla de letras, não um número.
 */
(function () {
  window.SRB_CONFIGS = window.SRB_CONFIGS || {};

  window.SRB_CONFIGS['097'] = {
    code: '097',
    name: 'Credisis',
    produto: 'Pagamento a Fornecedores · CNAB 240',
    logo: 'logos/Credisis/credisis.svg',
    cor: '#00A650',
    corClara: '#00D66A',
    fields: [
      {
        token: 'Inscricao_InsertIA',
        label: 'CPF / CNPJ do titular',
        normalizer: 'cpfcnpj',
        rule: { kind: 'cpfcnpj', alfanumerico: false },
        obs: 'CPF (11 dígitos) ou CNPJ (14 dígitos), com DV válido. Aceita máscara.'
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
        obs: 'Maiúsculas, sem acentos. Limite = menor largura entre as ocorrências (30, no header de arquivo).'
      },
      {
        token: 'Convenio_InsertIA',
        label: 'Código do convênio',
        normalizer: 'trim',
        rule: { kind: 'charset', charset: 'alnum', min: 1 },
        obs: 'Campo alfanumérico de 20 posições; aceita letras. O motor completa com espaços à direita.'
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
        obs: 'Exatamente 1 caractere.'
      },
      {
        token: 'CtaBanc_InsertIA',
        label: 'Conta',
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
        obs: 'Exatamente 1 caractere.'
      }
    ]
  };
})();
