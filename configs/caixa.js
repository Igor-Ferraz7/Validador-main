/* Configuração do Preenchedor .srb — Caixa Econômica Federal (104).
 * Formato dos campos: ver configs/santander.js.
 *
 * Não há manual da Caixa em docs/cnab: as posições vêm do próprio template.
 * A Caixa se afasta do padrão FEBRABAN no miolo do header:
 *   33-38  código do convênio (contrato), 6 posições — onde a FEBRABAN põe
 *          um convênio de 20 posições (33-52);
 *   59-62  operação da conta;
 *   63-70  número da conta — a FEBRABAN usa 59-70 para a conta inteira.
 *
 * Por isso a operação é um campo à parte aqui, e não existe em nenhum outro
 * banco do Preenchedor. Nos headers de lote o arquivo de origem trazia 59-70
 * como um único campo, com operação e conta concatenadas; o template separa os
 * dois, como o header de arquivo já fazia.
 */
(function () {
  window.SRB_CONFIGS = window.SRB_CONFIGS || {};

  window.SRB_CONFIGS['104'] = {
    code: '104',
    name: 'Caixa Econômica Federal',
    produto: 'Pagamento a Fornecedores · CNAB 240',
    logo: '',
    cor: '#0070AF',
    corClara: '#2BA3E0',
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
        obs: 'Maiúsculas, sem acentos. Limite = menor largura entre as ocorrências (30, no header de arquivo). Também preenche o sacador avalista do J-52.'
      },
      {
        token: 'NContBCO_InsertIA',
        label: 'Código do convênio',
        normalizer: 'digits',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Código do convênio (contrato) com a Caixa, 6 dígitos. O motor completa com zeros à esquerda.'
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
        token: 'OpConta_InsertIA',
        label: 'Operação da conta',
        normalizer: 'digits',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Código de operação informado pela Caixa (ex.: 001 para conta corrente). O motor completa com zeros à esquerda, em 4 posições.'
      },
      {
        token: 'CtaBanc_InsertIA',
        label: 'Conta',
        normalizer: 'account',
        dvToken: 'DVBanc_InsertIA',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Somente dígitos (até 8), sem a operação. Um DV no formato "-X" é movido para o campo DV da conta.'
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
