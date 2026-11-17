/* Retorno CNAB240 — Santander (033).
 * Base: manual "Pagamento a Fornecedores" YLEC_2403 V11.7, item 5 (p. 61-64).
 * A tabela do Santander substitui a da FEBRABAN (soOcorDoBanco): vários códigos
 * têm significado próprio, como ZA (transferência devolvida) e a família Z0-Z9.
 */
(function () {
  window.RET_CONFIGS = window.RET_CONFIGS || {};
  window.RET_CONFIGS['033'] = {
    code: '033',
    name: 'Santander',
    produto: 'Pagamento a Fornecedores · YLEC_2403 V11.7',
    logo: 'logos/Banco%20Santander%20Brasil%20S.A/santander-fundo-vermelho.svg',
    cor: '#EC0000',
    manual: 'Manual Santander V11.7',
    fonte: 'proprio',
    soOcorDoBanco: true,
    refs: {
      tipos: 'Manual Santander V11.7, item 2.6, p. 7, e item 5, p. 61',
      header: 'Manual Santander V11.7, item 3.1, p. 8',
      movimento: 'Manual V11.7, item 5, p. 61: “movimento (pagamento, devolução, cancelamento do compromisso)”',
      critica: 'Manual V11.7, item 5, p. 61: “crítica (acatamento ou rejeição do registro)”',
      segZ: 'Manual V11.7, p. 4: autenticação “disponibilizada no arquivo retorno de movimento”',
      aviso: 'Manual V11.7, nota G020, p. 46',
      dataReal: 'Manual V11.7, item 3.2, p. 10'
    },
    ocor: {
      '00':'Crédito ou Débito Efetivado','01':'Insuficiência de Fundos - Débito Não Efetuado','02':'Crédito ou Débito Cancelado pelo Pagador/Credor','03':'Débito Autorizado pela Agência - Efetuado',
      'AA':'Controle Inválido','AB':'Tipo de Operação Inválido','AC':'Tipo de Serviço Inválido','AD':'Forma de Lançamento Inválida','AE':'Tipo/Número de Inscrição Inválido','AF':'Código de Convênio Inválido',
      'AG':'Agência/Conta Corrente/DV Inválido','AH':'Número Sequencial do Registro no Lote Inválido','AI':'Código de Segmento de Detalhe Inválido','AJ':'Tipo de Movimento Inválido',
      'AK':'Código da Câmara de Compensação do Banco do Favorecido/Depositário Inválido','AL':'Código do Banco do Favorecido, Instituição de Pagamento ou Depositário Inválido',
      'AM':'Agência Mantenedora da Conta Corrente do Favorecido Inválida','AN':'Conta Corrente/DV/Conta de Pagamento do Favorecido Inválido','AO':'Nome do Favorecido não Informado',
      'AP':'Data Lançamento Inválida/Vencimento Inválido/Data de Pagamento não permitida','AQ':'Tipo/Quantidade da Moeda Inválido / Layout divergente (Pix)','AR':'Valor do Lançamento Inválido/Divergente/Zerado',
      'AS':'Aviso ao Favorecido - Identificação Inválida','AT':'Tipo/Número de Inscrição do Favorecido/Contribuinte Inválido ou Divergente','AU':'Logradouro do Favorecido não Informado',
      'AV':'Número do Local do Favorecido não Informado','AW':'Cidade do Favorecido não Informada','AX':'CEP/Complemento do Favorecido Inválido','AY':'Sigla do Estado do Favorecido Inválido',
      'AZ':'Código/Nome do Banco Depositário Inválido','BA':'Código/Nome da Agência Depositário não Informado','BB':'Número do Documento Inválido (Seu Número)','BC':'Nosso Número Inválido',
      'BD':'Inclusão Efetuada com Sucesso','BE':'Alteração Efetuada com Sucesso','BF':'Exclusão Efetuada com Sucesso','BG':'Agência/Conta Impedida Legalmente',
      'B1':'Bloqueado Pendente de Autorização','B3':'Bloqueado pelo cliente','B4':'Bloqueado pela captura de título da cobrança','B8':'Bloqueado pela Validação de Tributos',
      'CA':'Código de barras - Código do Banco Inválido','CB':'Código de barras - Código da Moeda Inválido','CC':'Código de barras - Dígito Verificador Geral Inválido','CD':'Código de barras - Valor do Título Inválido',
      'CE':'Código de barras - Campo Livre Inválido','CF':'Valor do Documento/Principal/menor que o mínimo Inválido','CH':'Valor do Desconto Inválido','CI':'Valor de Mora Inválido','CJ':'Valor da Multa Inválido',
      'CK':'Valor do IR Inválido','CL':'Valor do ISS Inválido','CG':'Valor do Abatimento inválido','CM':'Valor do IOF Inválido','CN':'Valor de Outras Deduções Inválido','CO':'Valor de Outros Acréscimos Inválido',
      'HA':'Lote Não Aceito','HB':'Inscrição da Empresa Inválida para o Contrato','HC':'Convênio com a Empresa Inexistente/Inválido para o Contrato','HD':'Agência/Conta Corrente da Empresa Inexistente/Inválida para o Contrato',
      'HE':'Tipo de Serviço Inválido para o Contrato','HF':'Conta Corrente da Empresa com Saldo Insuficiente','HG':'Lote de Serviço fora de Sequência','HH':'Lote de Serviço Inválido','HI':'Arquivo não aceito',
      'HJ':'Tipo de Registro Inválido','HL':'Versão de Layout Inválida','HU':'Data / hora de Envio Inválida',
      'IA':'Pagamento exclusive em Cartório','IJ':'Competência ou Período de Referência ou Número da Parcela inválido','IL':'Código Pagamento / Receita não numérico ou com zeros','IM':'Município Inválido',
      'IN':'Número Declaração Inválido','IO':'Número Etiqueta inválido','IP':'Número Notificação inválido','IQ':'Inscrição Estadual inválida','IR':'Dívida Ativa Inválida','IS':'Valor Honorários ou Outros Acréscimos inválido',
      'IT':'Período Apuração inválido','IU':'Valor ou Percentual da Receita inválido','IV':'Número referência inválida',
      'PA':'Pix não efetivado','PB':'Transação interrompida devido a erro no PSP do Recebedor','PC':'Número da conta transacional encerrada no PSP do Recebedor','PD':'Tipo incorreto para a conta transacional especificada',
      'PE':'Tipo de transação não é suportado/autorizado na conta transacional especificada','PF':'CPF/CNPJ do usuário recebedor não é consistente com o titular da conta transacional especificada',
      'PG':'CPF/CNPJ do usuário recebedor incorreto','PH':'Ordem rejeitada pelo PSP do Recebedor','PI':'ISPB do PSP do Pagador inválido ou inexistente','PK':'QR Code inválido ou vencido',
      'PM':'Chave de pagamento ou QR Code inválido','PN':'Chave de pagamento ou QR Code não informado','SC':'Validação parcial','TA':'Lote não Aceito - Totais do Lote com Diferença',
      'XB':'Número de Inscrição do Contribuinte Inválido','XC':'Código do Pagamento ou Competência ou Número de Inscrição Inválido','XF':'Código do Pagamento ou Competência não Numérico ou Igual a Zeros',
      'YA':'Título Não Encontrado','YB':'Identificação Registro Opcional Inválido','YC':'Código Padrão Inválido','YD':'Código de Ocorrência Inválido','YE':'Complemento de Ocorrência Inválido','YF':'Alegação já informada',
      'ZA':'Transferência Devolvida','ZB':'Transferência mesma titularidade não permitida','ZC':'Código pagamento Tributo inválido','ZD':'Competência Inválida','ZE':'Título Bloqueado na base',
      'ZF':'Sistema em Contingência – Título com valor maior que referência','ZG':'Sistema em Contingência – Título vencido / Banco destino não recebe TED/Pix','ZH':'Sistema em contingência - Título indexado',
      'ZI':'Beneficiário divergente','ZJ':'Limite de pagamentos parciais excedido','ZK':'Título já liquidado','ZT':'Valor outras entidades inválidas','ZU':'Sistema Origem Inválido',
      'ZW':'Banco Destino não recebe essa modalidade de pagamento','ZX':'Banco Destino inoperante para essa modalidade de pagamento','ZY':'Código do Histórico de Crédito Inválido','ZV':'Autorização iniciada no Internet Banking',
      'Z0':'Conta com bloqueio (devolução)','Z1':'Conta fechada. É necessário ativar a conta (devolução)','Z2':'Conta com movimento controlado (devolução)','Z3':'Conta cancelada (devolução)',
      'Z4':'Registro inconsistente - Título (devolução)','Z5':'Apresentação indevida - Título (devolução)','Z6':'Dados do destinatário inválidos (devolução)','Z7':'Agência ou conta destinatária do crédito inválida (devolução)',
      'Z8':'Divergência na titularidade (devolução)','Z9':'Conta destinatária do crédito encerrada (devolução)',
      'C1':'COMPROR – Devolvido por outros bancos','C2':'COMPROR – Recusado','C3':'COMPROR – Rejeitado por sistema','C4':'COMPROR – Rejeitado por horário','C6':'COMPROR – Aprovado','C7':'COMPROR – Compromisso Inválido',
      'F1':'CONFIRMING – Compromisso Liquidado','F2':'CONFIRMING – Compromisso em Negociação',
      'O1':'Código da OCT inválido','O2':'Descrição do remetente inválida','O3':'Descrição da finalidade inválida','O4':'Código Convênio cobrança Inválido'
    },
    pago: ['00','03','F1'],
    naoEfet: ['01','02'],
    devol: ['ZA','Z0','Z1','Z2','Z3','Z4','Z5','Z6','Z7','Z8','Z9'],
    agend: ['BD','BE','C6','F2'],
    excl: ['BF'],
    bloq: ['B1','B3','B4','B8'],
    info: [],
    forma: {
      '10':'OP / Recibo','11':'Contas e tributos c/ código de barras','16':'DARF','17':'GPS','20':'Caixa “Autenticação”',
      '30':'Boleto Santander','31':'Boleto outros bancos','35':'OCT','45':'Pix transferência','47':'Pix QR Code'
    },
    servico: { '03':'Bloqueto eletrônico','14':'Consulta de tributos','20':'Fornecedores','22':'Contas, tributos e impostos','23':'Interoperabilidade','29':'Alegação do sacado','60':'Despesas viajante' },
    /* Segmento I = alegação do sacado (manual V11.7, seção 3.6). */
    seg: {
      I: function (p, l) { return { nome:p(l,33,72), valor:p(l,113,127), data:p(l,128,135), docCli:p(l,136,155), docBanco:p(l,156,175) }; }
    }
  };
})();
