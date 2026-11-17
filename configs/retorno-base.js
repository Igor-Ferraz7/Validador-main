/* Base comum do Analisador de Retorno CNAB240.
 *
 * Aqui ficam as tabelas do padrão FEBRABAN (layout 240, V10.11): códigos de
 * ocorrência (nota G059, p. 180-182), tipo de serviço (G025), forma de
 * lançamento (G029) e as posições dos campos de cada segmento de pagamento.
 *
 * Cada banco entra em configs/retorno-<codigo>-<banco>.js e declara só o que
 * difere daqui. Para um banco novo, copie o arquivo de um banco parecido.
 *
 * Campos de um banco:
 *   code, name, produto, logo, cor   identidade (igual aos configs do Preenchedor)
 *   manual                           como citar o manual nas evidências
 *   fonte                            'proprio'  = ocorrências tiradas do manual do banco
 *                                    'febraban' = manual não traz a tabela; usa só o padrão
 *   ocor                             códigos do banco (sobrepõem os da FEBRABAN)
 *   soOcorDoBanco                    true = ignora a tabela FEBRABAN (caso do Itaú)
 *   pago/naoEfet/devol/agend/excl/bloq/info
 *                                    classificação dos códigos; substitui a da base
 *   maisPago, maisInfo, maisDevol…   acrescenta à lista da base, sem substituir
 *   forma, servico                   sobrepõem as tabelas da base
 *   seg                              posições por segmento (sobrepõem a base)
 *   notas                            avisos mostrados na tela
 */
(function () {
  window.RET_CONFIGS = window.RET_CONFIGS || {};

  /* Nota G059 — Código das Ocorrências para Retorno/Remessa. */
  var OCOR = {
    '00':'Crédito ou Débito Efetivado — o pagamento foi confirmado','01':'Insuficiência de Fundos - Débito Não Efetuado',
    '02':'Crédito ou Débito Cancelado pelo Pagador/Credor','03':'Débito Autorizado pela Agência - Efetuado',
    'AA':'Controle Inválido','AB':'Tipo de Operação Inválido','AC':'Tipo de Serviço Inválido','AD':'Forma de Lançamento Inválida',
    'AE':'Tipo/Número de Inscrição Inválido','AF':'Código de Convênio Inválido','AG':'Agência/Conta Corrente/DV Inválido',
    'AH':'Nº Sequencial do Registro no Lote Inválido','AI':'Código de Segmento de Detalhe Inválido','AJ':'Tipo de Movimento Inválido',
    'AK':'Código da Câmara de Compensação do Banco Favorecido/Depositário Inválido',
    'AL':'Código do Banco Favorecido, Instituição de Pagamento ou Depositário Inválido',
    'AM':'Agência Mantenedora da Conta Corrente do Favorecido Inválida','AN':'Conta Corrente/DV/Conta de Pagamento do Favorecido Inválido',
    'AO':'Nome do Favorecido Não Informado','AP':'Data Lançamento Inválido','AQ':'Tipo/Quantidade da Moeda Inválido','AR':'Valor do Lançamento Inválido',
    'AS':'Aviso ao Favorecido - Identificação Inválida','AT':'Tipo/Número de Inscrição do Favorecido Inválido','AU':'Logradouro do Favorecido Não Informado',
    'AV':'Nº do Local do Favorecido Não Informado','AW':'Cidade do Favorecido Não Informada','AX':'CEP/Complemento do Favorecido Inválido',
    'AY':'Sigla do Estado do Favorecido Inválida','AZ':'Código/Nome do Banco Depositário Inválido','BA':'Código/Nome da Agência Depositária Não Informado',
    'BB':'Seu Número Inválido','BC':'Nosso Número Inválido','BD':'Inclusão Efetuada com Sucesso','BE':'Alteração Efetuada com Sucesso',
    'BF':'Exclusão Efetuada com Sucesso','BG':'Agência/Conta Impedida Legalmente/Bloqueada',
    'BH':'Empresa não pagou salário','BI':'Falecimento do mutuário','BJ':'Empresa não enviou remessa do mutuário','BK':'Empresa não enviou remessa no vencimento',
    'BL':'Valor da parcela inválida','BM':'Identificação do contrato inválida','BN':'Operação de Consignação Incluída com Sucesso',
    'BO':'Operação de Consignação Alterada com Sucesso','BP':'Operação de Consignação Excluída com Sucesso','BQ':'Operação de Consignação Liquidada com Sucesso',
    'BR':'Reativação Efetuada com Sucesso','BS':'Suspensão Efetuada com Sucesso',
    'CA':'Código de Barras - Código do Banco Inválido','CB':'Código de Barras - Código da Moeda Inválido',
    'CC':'Código de Barras - Dígito Verificador Geral Inválido','CD':'Código de Barras - Valor do Título Inválido','CE':'Código de Barras - Campo Livre Inválido',
    'CF':'Valor do Documento Inválido','CG':'Valor do Abatimento Inválido','CH':'Valor do Desconto Inválido','CI':'Valor de Mora Inválido','CJ':'Valor da Multa Inválido',
    'CK':'Valor do IR Inválido','CL':'Valor do ISS Inválido','CM':'Valor do IOF Inválido','CN':'Valor de Outras Deduções Inválido',
    'CO':'Valor de Outros Acréscimos Inválido','CP':'Valor do INSS Inválido',
    'HA':'Lote Não Aceito','HB':'Inscrição da Empresa Inválida para o Contrato','HC':'Convênio com a Empresa Inexistente/Inválido para o Contrato',
    'HD':'Agência/Conta Corrente da Empresa Inexistente/Inválido para o Contrato','HE':'Tipo de Serviço Inválido para o Contrato',
    'HF':'Conta Corrente da Empresa com Saldo Insuficiente','HG':'Lote de Serviço Fora de Sequência','HH':'Lote de Serviço Inválido','HI':'Arquivo não aceito',
    'HJ':'Tipo de Registro Inválido','HK':'Código Remessa / Retorno Inválido','HL':'Versão de layout inválida','HM':'Mutuário não identificado',
    'HN':'Tipo do benefício não permite empréstimo','HO':'Benefício cessado/suspenso','HP':'Benefício possui representante legal',
    'HQ':'Benefício é do tipo PA (Pensão alimentícia)','HR':'Quantidade de contratos permitida excedida','HS':'Benefício não pertence ao Banco informado',
    'HT':'Início do desconto informado já ultrapassado','HU':'Número da parcela inválida','HV':'Quantidade de parcela inválida',
    'HW':'Margem consignável excedida dentro do prazo do contrato','HX':'Empréstimo já cadastrado','HY':'Empréstimo inexistente','HZ':'Empréstimo já encerrado',
    'H1':'Arquivo sem trailer','H2':'Mutuário sem crédito na competência','H3':'Não descontado – outros motivos','H4':'Retorno de Crédito não pago',
    'H5':'Cancelamento de empréstimo retroativo','H6':'Outros Motivos de Glosa','H7':'Margem consignável excedida acima do prazo do contrato',
    'H8':'Mutuário desligado do empregador','H9':'Mutuário afastado por licença',
    'IA':'Primeiro nome do mutuário diferente da base do benefício','IB':'Benefício suspenso/cessado pela APS ou Sisobi',
    'IC':'Benefício suspenso por dependência de cálculo','ID':'Benefício suspenso/cessado pela inspetoria/auditoria',
    'IE':'Benefício bloqueado para empréstimo pelo beneficiário','IF':'Benefício bloqueado para empréstimo por TBM',
    'IG':'Benefício em fase de concessão de PA ou desdobramento','IH':'Benefício cessado por óbito','II':'Benefício cessado por fraude',
    'IJ':'Benefício cessado por concessão de outro benefício','IK':'Benefício cessado: estatutário transferido para órgão de origem',
    'IL':'Empréstimo suspenso pela APS','IM':'Empréstimo cancelado pelo banco','IN':'Crédito transformado em PAB','IO':'Término da consignação foi alterado',
    'IP':'Fim do empréstimo durante período de suspensão ou concessão','IQ':'Empréstimo suspenso pelo banco',
    'IR':'Não averbação de contrato – parcelas/competências informadas','TA':'Lote Não Aceito - Totais do Lote com Diferença',
    /* A FEBRABAN só diz que as ocorrências iniciadas em 'ZA' são informativas;
       o significado exato vem do manual de cada banco. */
    'ZA':'Ocorrência informativa ao cliente — ver o manual do banco',
    'YA':'Título Não Encontrado','YB':'Identificador Registro Opcional Inválido','YC':'Código Padrão Inválido','YD':'Código de Ocorrência Inválido',
    'YE':'Complemento de Ocorrência Inválido','YF':'Alegação já Informada'
  };

  /* G025 — Tipo de Serviço (header de lote, 10-11). */
  var SERVICO = {
    '01':'Cobrança','03':'Boleto de Pagamento Eletrônico','04':'Conciliação Bancária','05':'Débitos','06':'Custódia de Cheques','07':'Gestão de Caixa',
    '08':'Consulta/Informação Margem','09':'Averbação da Consignação/Retenção','10':'Pagamento Dividendos','20':'Pagamento Fornecedor',
    '29':'Alegação do Pagador','30':'Pagamento Salários','40':'Vendor','41':'Vendor a Termo','50':'Pagamento Sinistros Segurados',
    '60':'Pagamento Despesas Viajante em Trânsito','70':'Pagamento Autorizado','75':'Pagamento Credenciados',
    '80':'Pagamento Representantes / Vendedores Autorizados','90':'Pagamento Benefícios','98':'Pagamentos Diversos'
  };

  /* G029 — Forma de Lançamento (header de lote, 12-13). */
  var FORMA = {
    '01':'Crédito em Conta Corrente/Salário','02':'Cheque Pagamento / Administrativo','03':'DOC/TED','04':'Cartão Salário','05':'Crédito em Conta Poupança',
    '10':'OP à Disposição','11':'Contas e Tributos com Código de Barras','16':'Tributo - DARF Normal','17':'Tributo - GPS','18':'Tributo - DARF Simples',
    '19':'Tributo - IPTU / Prefeituras','20':'Pagamento com Autenticação','21':'Tributo - DARJ','22':'Tributo - GARE-SP ICMS','23':'Tributo - GARE-SP DR',
    '24':'Tributo - GARE-SP ITCMD','25':'Tributo - IPVA','26':'Tributo - Licenciamento','27':'Tributo - DPVAT','30':'Liquidação de Títulos do Próprio Banco',
    '31':'Pagamento de Títulos de Outros Bancos','40':'Extrato de Conta Corrente','41':'TED - Outra Titularidade','43':'TED - Mesma Titularidade',
    '44':'TED para Transferência de Conta Investimento','45':'Pix Transferência','47':'Pix QR-Code','50':'Débito em Conta Corrente',
    '70':'Extrato para Gestão de Caixa','71':'Depósito Judicial em Conta Corrente','72':'Depósito Judicial em Poupança','73':'Extrato de Conta Investimento',
    '80':'Tributos municipais ISS - próprio Banco','81':'Tributos municipais ISS - outros Bancos'
  };

  /* Posições dos campos de cada segmento de pagamento (padrão FEBRABAN).
   * Cada entrada recebe a função de recorte p(linha, inicio, fim) e a linha. */
  var SEG = {
    A: function (p, l) { return { nome:p(l,44,73), docCli:p(l,74,93), data:p(l,94,101), valor:p(l,120,134), docBanco:p(l,135,154), dataReal:p(l,155,162), valorReal:p(l,163,177) }; },
    J: function (p, l) { return { nome:p(l,62,91), venc:p(l,92,99), data:p(l,145,152), valor:p(l,153,167), docCli:p(l,183,202), docBanco:p(l,203,222) }; },
    N: function (p, l) { return { docCli:p(l,18,37), docBanco:p(l,38,57), nome:p(l,58,87), data:p(l,88,95), valor:p(l,96,110) }; },
    O: function (p, l) { return { nome:p(l,62,91), venc:p(l,92,99), data:p(l,100,107), valor:p(l,108,122), docCli:p(l,123,142), docBanco:p(l,143,162) }; }
  };

  /* Classificação padrão dos códigos. "info" são códigos que não são erro e não
   * mudam o status — a FEBRABAN diz que as ocorrências 'ZA' são informativas. */
  window.RET_BASE = {
    ocor: OCOR, servico: SERVICO, forma: FORMA, seg: SEG,
    pago: ['00','03'], naoEfet: ['01','02'], devol: [], agend: ['BD','BE'], excl: ['BF'], bloq: [], info: ['ZA']
  };

  /* Junta a base com o que o banco declarou. */
  window.RET_RESOLVE = function (code) {
    var b = window.RET_CONFIGS[code];
    if (!b) return null;
    var base = window.RET_BASE;
    var junta = function (dicio, extra) {
      var o = {}, k;
      for (k in dicio) o[k] = dicio[k];
      for (k in (extra || {})) o[k] = extra[k];
      return o;
    };
    var r = {
      code: code, name: b.name, produto: b.produto || '', logo: b.logo || '', cor: b.cor || '#16140f',
      manual: b.manual || '', fonte: b.fonte || 'febraban', notas: b.notas || [], refs: b.refs || {},
      ocor: b.soOcorDoBanco ? junta({}, b.ocor) : junta(base.ocor, b.ocor),
      servico: junta(base.servico, b.servico),
      forma: junta(base.forma, b.forma),
      seg: junta(base.seg, b.seg)
    };
    ['pago','naoEfet','devol','agend','excl','bloq','info'].forEach(function (k) {
      var mais = b['mais' + k.charAt(0).toUpperCase() + k.slice(1)] || [];
      r[k] = (b[k] || base[k]).concat(mais);
    });
    return r;
  };
})();
