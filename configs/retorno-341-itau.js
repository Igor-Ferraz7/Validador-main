/* Retorno CNAB240 — Itaú (341), SISPAG.
 * Base: manual "SISPAG - Sistema de Contas a Pagar", outubro/2020, nota 8
 * (Ocorrências, p. 47-49), nota 5 (formas de pagamento, p. 45) e nota 4
 * (tipos de pagamento, p. 44).
 *
 * A tabela do Itaú NÃO é a da FEBRABAN: os mesmos códigos significam outra
 * coisa. No Itaú, BD é "pagamento agendado" e BC é "nosso número inválido",
 * enquanto na FEBRABAN BD é "inclusão efetuada" e BC, "nosso número inválido".
 * Por isso soOcorDoBanco: a tabela padrão é ignorada para este banco.
 */
(function () {
  window.RET_CONFIGS = window.RET_CONFIGS || {};
  window.RET_CONFIGS['341'] = {
    code: '341',
    name: 'Itaú',
    produto: 'SISPAG · Sistema de Contas a Pagar',
    logo: 'logos/Ita%C3%BA%20Unibanco%20S.A/logo-nova-letras-brancas.svg',
    cor: '#EC7000',
    manual: 'Manual Itaú SISPAG, outubro/2020',
    fonte: 'proprio',
    soOcorDoBanco: true,
    notas: [
      'No Itaú, uma Ordem de Pagamento aparece primeiro como <b>EM</b> (OP emitida) e só vira <b>CP</b> (OP cumprida) quando o favorecido saca. Se não for sacada, volta como <b>EX</b> (devolução). Aqui EM e CP contam como pagos.',
      'DOC e TED devolvidos chegam com <b>DV</b>, e o manual avisa que a devolução de DOC só é informada se ocorrer em até 3 dias úteis (TED, no mesmo dia).'
    ],
    refs: {
      tipos: 'Manual Itaú SISPAG, out/2020, nota 8, p. 47',
      header: 'Manual Itaú SISPAG, out/2020, registro header de arquivo',
      movimento: 'Manual Itaú SISPAG, nota 8, p. 47: ocorrência “00 - PAGAMENTO EFETUADO”',
      critica: 'Manual Itaú SISPAG, nota 8, p. 47: ocorrências “BD - PAGAMENTO AGENDADO” e “BE - PAGAMENTO AGENDADO COM FORMA ALTERADA PARA OP”',
      segZ: 'Manual Itaú SISPAG: segmento Z com a autenticação do pagamento',
      aviso: 'Trailer de lote, número do aviso de débito',
      dataReal: 'Manual Itaú SISPAG, segmento A'
    },
    ocor: {
      '00':'PAGAMENTO EFETUADO','AE':'DATA DE PAGAMENTO ALTERADA','AG':'NÚMERO DO LOTE INVÁLIDO','AH':'NÚMERO SEQUENCIAL DO REGISTRO NO LOTE INVÁLIDO',
      'AI':'PRODUTO DEMONSTRATIVO DE PAGAMENTO NÃO CONTRATADO','AJ':'TIPO DE MOVIMENTO INVÁLIDO','AL':'CÓDIGO DO BANCO FAVORECIDO INVÁLIDO',
      'AM':'AGÊNCIA DO FAVORECIDO INVÁLIDA','AN':'CONTA CORRENTE DO FAVORECIDO INVÁLIDA','AO':'NOME DO FAVORECIDO INVÁLIDO',
      'AP':'DATA DE PAGAMENTO / VALIDADE / HORA DE LANÇAMENTO / ARRECADAÇÃO / APURAÇÃO INVÁLIDA','AQ':'QUANTIDADE DE REGISTROS MAIOR QUE 999999',
      'AR':'VALOR ARRECADADO / LANÇAMENTO INVÁLIDO','BC':'NOSSO NÚMERO INVÁLIDO','BD':'PAGAMENTO AGENDADO','BE':'PAGAMENTO AGENDADO COM FORMA ALTERADA PARA OP',
      'BI':'CNPJ / CPF DO FAVORECIDO NO SEGMENTO J-52 OU B INVÁLIDO / DOCUMENTO FAVORECIDO INVÁLIDO PIX','BL':'VALOR DA PARCELA INVÁLIDO',
      'CD':'CNPJ / CPF INFORMADO DIVERGENTE DO CADASTRADO','CE':'PAGAMENTO CANCELADO','CF':'VALOR DO DOCUMENTO INVÁLIDO / VALOR DIVERGENTE DO QR CODE',
      'CG':'VALOR DO ABATIMENTO INVÁLIDO','CH':'VALOR DO DESCONTO INVÁLIDO','CI':'CNPJ / CPF / IDENTIFICADOR / INSCRIÇÃO ESTADUAL / INSCRIÇÃO NO CAD-ICMS INVÁLIDO',
      'CJ':'VALOR DA MULTA INVÁLIDO','CK':'TIPO DE INSCRIÇÃO INVÁLIDA','CL':'VALOR DO INSS INVÁLIDO','CM':'VALOR DO COFINS INVÁLIDO','CN':'CONTA NÃO CADASTRADA',
      'CO':'VALOR DE OUTRAS ENTIDADES INVÁLIDO','CP':'CONFIRMAÇÃO DE OP CUMPRIDA','CQ':'SOMA DAS FATURAS DIFERE DO PAGAMENTO','CR':'VALOR DO CSLL INVÁLIDO',
      'CS':'DATA DE VENCIMENTO DA FATURA INVÁLIDA','DA':'NÚMERO DE DEPENDENTES SALÁRIO FAMÍLIA INVÁLIDO','DB':'NÚMERO DE HORAS SEMANAIS INVÁLIDO',
      'DC':'SALÁRIO DE CONTRIBUIÇÃO INSS INVÁLIDO','DD':'SALÁRIO DE CONTRIBUIÇÃO FGTS INVÁLIDO','DE':'VALOR TOTAL DOS PROVENTOS INVÁLIDO',
      'DF':'VALOR TOTAL DOS DESCONTOS INVÁLIDO','DG':'VALOR LÍQUIDO NÃO NUMÉRICO','DH':'VALOR LÍQUIDO INFORMADO DIFERE DO CALCULADO','DI':'VALOR DO SALÁRIO-BASE INVÁLIDO',
      'DJ':'BASE DE CÁLCULO IRRF INVÁLIDA','DK':'BASE DE CÁLCULO FGTS INVÁLIDA','DL':'FORMA DE PAGAMENTO INCOMPATÍVEL COM HOLERITE','DM':'E-MAIL DO FAVORECIDO INVÁLIDO',
      'DV':'DOC / TED DEVOLVIDO PELO BANCO FAVORECIDO','D0':'FINALIDADE DO HOLERITE INVÁLIDA','D1':'MÊS DE COMPETÊNCIA DO HOLERITE INVÁLIDO',
      'D2':'DIA DA COMPETÊNCIA DO HOLERITE INVÁLIDO','D3':'CENTRO DE CUSTO INVÁLIDO','D4':'CAMPO NUMÉRICO DA FUNCIONAL INVÁLIDO','D5':'DATA INÍCIO DE FÉRIAS NÃO NUMÉRICA',
      'D6':'DATA INÍCIO DE FÉRIAS INCONSISTENTE','D7':'DATA FIM DE FÉRIAS NÃO NUMÉRICA','D8':'DATA FIM DE FÉRIAS INCONSISTENTE','D9':'NÚMERO DE DEPENDENTES IR INVÁLIDO',
      'EM':'CONFIRMAÇÃO DE OP EMITIDA','EX':'DEVOLUÇÃO DE OP NÃO SACADA PELO FAVORECIDO','E0':'TIPO DE MOVIMENTO HOLERITE INVÁLIDO',
      'E1':'VALOR 01 DO HOLERITE / INFORME INVÁLIDO','E2':'VALOR 02 DO HOLERITE / INFORME INVÁLIDO','E3':'VALOR 03 DO HOLERITE / INFORME INVÁLIDO',
      'E4':'VALOR 04 DO HOLERITE / INFORME INVÁLIDO','FC':'PAGAMENTO EFETUADO ATRAVÉS DE FINANCIAMENTO COMPROR','FD':'PAGAMENTO EFETUADO ATRAVÉS DE FINANCIAMENTO DESCOMPROR',
      'HA':'ERRO NO LOTE','HM':'ERRO NO REGISTRO HEADER DE ARQUIVO','IB':'VALOR DO DOCUMENTO INVÁLIDO','IC':'VALOR DO ABATIMENTO INVÁLIDO','ID':'VALOR DO DESCONTO INVÁLIDO',
      'IE':'VALOR DA MORA INVÁLIDO','IF':'VALOR DA MULTA INVÁLIDO','IG':'VALOR DA DEDUÇÃO INVÁLIDO','IH':'VALOR DO ACRÉSCIMO INVÁLIDO',
      'II':'DATA DE VENCIMENTO INVÁLIDA / QR CODE EXPIRADO','IJ':'COMPETÊNCIA / PERÍODO DE REFERÊNCIA / PARCELA INVÁLIDA',
      'IK':'TRIBUTO NÃO LIQUIDÁVEL VIA SISPAG OU NÃO CONVENIADO COM ITAÚ','IL':'CÓDIGO DE PAGAMENTO / EMPRESA / RECEITA INVÁLIDO','IM':'TIPO X FORMA NÃO COMPATÍVEL',
      'IN':'BANCO/AGÊNCIA NÃO CADASTRADOS','IO':'DAC / VALOR / COMPETÊNCIA / IDENTIFICADOR DO LACRE INVÁLIDO / IDENTIFICAÇÃO DO QR CODE INVÁLIDO',
      'IP':'DAC DO CÓDIGO DE BARRAS INVÁLIDO / ERRO NA VALIDAÇÃO DO QR CODE','IQ':'DÍVIDA ATIVA OU NÚMERO DE ETIQUETA INVÁLIDO','IR':'PAGAMENTO ALTERADO',
      'IS':'CONCESSIONÁRIA NÃO CONVENIADA COM ITAÚ','IT':'VALOR DO TRIBUTO INVÁLIDO','IU':'VALOR DA RECEITA BRUTA ACUMULADA INVÁLIDO',
      'IV':'NÚMERO DO DOCUMENTO ORIGEM / REFERÊNCIA INVÁLIDO','IX':'CÓDIGO DO PRODUTO INVÁLIDO','LA':'DATA DE PAGAMENTO DE UM LOTE ALTERADA','LC':'LOTE DE PAGAMENTOS CANCELADO',
      'NA':'PAGAMENTO CANCELADO POR FALTA DE AUTORIZAÇÃO','NB':'IDENTIFICAÇÃO DO TRIBUTO INVÁLIDA','NC':'EXERCÍCIO (ANO BASE) INVÁLIDO',
      'ND':'CÓDIGO RENAVAM NÃO ENCONTRADO/INVÁLIDO','NE':'UF INVÁLIDA','NF':'CÓDIGO DO MUNICÍPIO INVÁLIDO','NG':'PLACA INVÁLIDA','NH':'OPÇÃO/PARCELA DE PAGAMENTO INVÁLIDA',
      'NI':'TRIBUTO JÁ FOI PAGO OU ESTÁ VENCIDO','NR':'OPERAÇÃO NÃO REALIZADA','PD':'AQUISIÇÃO CONFIRMADA (RISCO SACADO)','RJ':'REGISTRO REJEITADO',
      'RS':'PAGAMENTO DISPONÍVEL PARA ANTECIPAÇÃO NO RISCO SACADO','SS':'PAGAMENTO CANCELADO POR INSUFICIÊNCIA DE SALDO / LIMITE DIÁRIO EXCEDIDO',
      'TA':'LOTE NÃO ACEITO - TOTAIS DO LOTE COM DIFERENÇA','TI':'TITULARIDADE INVÁLIDA','X1':'FORMA INCOMPATÍVEL COM LAYOUT 010','X2':'NÚMERO DA NOTA FISCAL INVÁLIDO',
      'X3':'IDENTIFICADOR DE NF/CNPJ INVÁLIDO','X4':'FORMA 32 INVÁLIDA'
    },
    pago: ['00','CP','EM','FC','FD'],
    naoEfet: ['CE','NA','SS','LC'],
    devol: ['DV','EX'],
    agend: ['BD','BE'],
    excl: [],
    bloq: [],
    info: ['AE','IR','LA','RS','PD'],
    forma: {
      '01':'Crédito em conta corrente no Itaú','02':'Cheque pagamento/administrativo','03':'DOC “C”','05':'Crédito em conta poupança no Itaú',
      '06':'Crédito em conta corrente de mesma titularidade','07':'DOC “D”','10':'Ordem de pagamento à disposição','11':'Ordem de pagamento para acerto (pagamento rejeitado)',
      '13':'Pagamento de concessionárias','16':'DARF normal','17':'GPS','18':'DARF simples','19':'IPTU/ISS/outros tributos municipais','22':'GARE-SP ICMS',
      '25':'IPVA','27':'DPVAT','30':'Títulos em cobrança no Itaú','31':'Títulos em cobrança em outros bancos','32':'Nota fiscal - liquidação eletrônica',
      '35':'FGTS','41':'TED - outro titular','43':'TED - mesmo titular','45':'Pix transferência','47':'Pix QR-Code','60':'Cartão salário','91':'GNRE e tributos com código de barras'
    },
    servico: {
      '10':'Dividendos','15':'Debêntures','20':'Fornecedores','22':'Tributos','30':'Salários','40':'Fundos de investimentos','50':'Sinistros de seguros',
      '60':'Despesas viajante em trânsito','80':'Representantes autorizados','90':'Benefícios','98':'Diversos'
    },
    /* O Itaú usa posições próprias no segmento O e um segmento N por tributo. */
    seg: {
      O: function (p, l) {
        return { nome:p(l,66,95), valor:p(l,122,136), data:p(l,137,144), valorReal:p(l,145,159), docCli:p(l,175,194), docBanco:p(l,216,230) };
      },
      N: function (p, l) {
        var trib = p(l, 18, 19);
        var pos = {
          '01': { valor:[86,99],   data:[100,107], nome:[166,195] },  // GPS
          '02': { valor:[106,119], data:[128,135], nome:[166,195] },  // DARF normal
          '03': { valor:[106,119], data:[128,135], nome:[166,195] },  // DARF simples
          '05': { valor:[125,138], data:[147,154], nome:[166,195] },  // GARE-SP
          '07': { valor:[95,108],  data:[117,124], nome:[166,195] },  // IPVA
          '08': { valor:[95,108],  data:[117,124], nome:[166,195] },  // DPVAT
          '11': { valor:[152,165], data:[144,151], nome:[114,143] }   // FGTS
        }[trib] || { valor:[106,119], data:[128,135], nome:[166,195] };
        return { nome:p(l, pos.nome[0], pos.nome[1]), valor:p(l, pos.valor[0], pos.valor[1]), data:p(l, pos.data[0], pos.data[1]),
          docCli:p(l,196,215), docBanco:'', tributo:trib };
      }
    }
  };
})();
