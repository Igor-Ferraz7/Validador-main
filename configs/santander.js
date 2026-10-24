/* =====================================================================
 * Configuração declarativa de banco para o Preenchedor de Remessa .srb
 * ---------------------------------------------------------------------
 * Banco: Santander (033)
 *
 * Este arquivo NÃO contém lógica de UI nem de validação. Ele apenas
 * DECLARA, por token, qual normalizador e qual regra de validação a
 * página (motor genérico) deve aplicar. Para adicionar outro banco,
 * crie configs/<banco>.js no mesmo formato e registre-o em
 * window.SRB_CONFIGS — a UI passa a oferecê-lo automaticamente.
 *
 * Campos do banco: code, name, produto (texto do cabeçalho), logo, cor e
 * corClara (identidade visual aplicada à página quando o banco é escolhido).
 *
 * Campos de cada entrada de `fields`:
 *   token       Token detectado no arquivo (sem os sinais < >).
 *   label       Rótulo exibido ao usuário.
 *   normalizer  Nome de um normalizador genérico do motor:
 *               'trim' | 'digits' | 'cpfcnpj' | 'account' | 'companyName'
 *   rule        Regra de validação (aplicada ao valor NORMALIZADO):
 *               { kind:'cpfcnpj', alfanumerico:true|false }
 *               (alfanumerico: o manual do banco aceita CNPJ com letras)
 *               { kind:'charset', charset:'digits'|'alnum'|'company'|'any', min:N }
 *               (o comprimento MÁXIMO nunca é fixado aqui — é calculado a
 *                partir da MENOR largura do token no arquivo carregado)
 *   input       false → não exibir campo de valor (ex.: campo derivado).
 *   derived     true  → valor calculado a partir de outro token.
 *   deriveFrom  token de origem do valor derivado.
 *   deriveKind  nome da derivação genérica ('tipoInscricao').
 *   dvToken     (normalizador 'account', usado em conta ou agência) token do
 *               DV correspondente, para onde vai o dígito verificador
 *               digitado no padrão "-X".
 *   obs         Texto de ajuda exibido junto ao campo.
 * ===================================================================== */
(function () {
  window.SRB_CONFIGS = window.SRB_CONFIGS || {};

  window.SRB_CONFIGS['033'] = {
    code: '033',
    name: 'Santander',
    produto: 'Pagamento a Fornecedores · YLEC_2403 V11.7',
    logo: 'logos/Banco%20Santander%20Brasil%20S.A/santander-fundo-vermelho.svg',
    cor: '#EC0000',
    corClara: '#FF1A1A',
    fields: [
      {
        token: 'Inscricao_InsertIA',
        label: 'CPF / CNPJ do titular',
        normalizer: 'cpfcnpj',
        rule: { kind: 'cpfcnpj', alfanumerico: true },
        obs: 'CPF (11 dígitos) ou CNPJ (14 caracteres; pode ter letras, como o CNPJ alfanumérico), com DV válido. Aceita máscara.'
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
        obs: 'Alfanumérico, 1 a 20 caracteres.'
      },
      {
        token: 'Agencia_InsertIA',
        label: 'Agência',
        normalizer: 'digits',
        rule: { kind: 'charset', charset: 'digits', min: 1 },
        obs: 'Somente dígitos. O Santander não utiliza DV de agência.'
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
