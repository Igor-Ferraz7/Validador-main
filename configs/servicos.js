/* Tipos de serviço e finalidades homologados por banco, por segmento.
 *
 * Fonte: arquivos "<Banco> - Tipo de Servico e Finalidades.txt" da Base de
 * Conhecimento de Integração Bancária. É o que cada banco homologou para o
 * ERP — não é a tabela cheia do manual, e sim o subconjunto aprovado.
 *
 * Lido por assets/servicos-cnab.js, que desenha o quadro de cada banco.
 *
 * Formato:
 *   '<codigo>': {
 *     nome,
 *     segmentos: [{
 *       seg       letra do segmento (A, J, O, N)
 *       titulo    o que o segmento paga
 *       servicos  [{ cod, txt }]            posições 10-11 do header de lote
 *       finalidades [{ cod, txt, grupo? }]  grupo rotula o bloco (Próprio banco…)
 *       notas     [texto]                   regras de combinação, quando o banco dá
 *     }]
 *   }
 *
 * Os textos foram encurtados e postos em caixa de frase para caber no quadro;
 * os códigos são os do arquivo de origem, sem alteração.
 *
 * Duas correções de origem, sinalizadas aqui para não se perderem: nos arquivos
 * do Bradesco e da Credisis a finalidade 01 (e a 05, no Bradesco) vinha escrita
 * "no Itaú", resquício de cópia do arquivo do Itaú. Aqui está o nome do banco
 * certo. Se o texto original estiver correto e a homologação for mesmo no Itaú,
 * é aqui que se conserta.
 */
(function () {
  var TED_OUTRO  = 'TED — outro titular';
  var TED_MESMO  = 'TED — mesmo titular (empresa)';
  var PROPRIO    = 'Próprio banco';
  var OUTROS     = 'Outros bancos';
  var PIX        = 'Pix';
  var COD_BARRAS = 'Contas e tributos com código de barras';
  var BOLETO_ELE = 'Boleto de pagamento eletrônico';
  var PG_FORN    = 'Pagamento fornecedores';
  var PG_SAL     = 'Pagamento salários';
  var PG_DIV     = 'Pagamentos diversos';

  window.CNAB_SERVICOS = {

    '001': {
      nome: 'Banco do Brasil',
      segmentos: [
        {
          seg: 'A', titulo: 'Transferências',
          servicos: [
            { cod: '20', txt: PG_FORN },
            { cod: '30', txt: PG_SAL },
            { cod: '98', txt: PG_DIV }
          ],
          finalidades: [
            { cod: '01', txt: 'Crédito em C/C no Banco do Brasil', grupo: PROPRIO },
            { cod: '05', txt: 'Crédito em poupança no Banco do Brasil', grupo: PROPRIO },
            { cod: '03', txt: 'DOC', grupo: OUTROS },
            { cod: '41', txt: TED_OUTRO, grupo: OUTROS },
            { cod: '43', txt: TED_MESMO, grupo: OUTROS },
            { cod: '45', txt: 'Transferências via Pix', grupo: PIX }
          ]
        },
        {
          seg: 'J', titulo: 'Boletos',
          servicos: [{ cod: '98', txt: PG_DIV }],
          finalidades: [
            { cod: '30', txt: 'Títulos em cobrança no Banco do Brasil' },
            { cod: '31', txt: 'Títulos em cobrança em outros bancos' }
          ]
        },
        {
          seg: 'O', titulo: 'Tributos com código de barras',
          servicos: [{ cod: '98', txt: PG_DIV }],
          finalidades: [{ cod: '11', txt: COD_BARRAS }]
        },
        {
          seg: 'N', titulo: 'Tributos sem código de barras',
          servicos: [{ cod: '98', txt: PG_DIV }],
          finalidades: [
            { cod: '16', txt: 'DARF normal' },
            { cod: '17', txt: 'GPS — Guia da Previdência Social' },
            { cod: '18', txt: 'DARF simples' },
            { cod: '22', txt: 'GARE — SP ICMS' }
          ]
        }
      ]
    },

    '033': {
      nome: 'Santander',
      segmentos: [
        {
          seg: 'A', titulo: 'Transferências',
          servicos: [
            { cod: '20', txt: 'Pagamento fornecedor' },
            { cod: '98', txt: PG_DIV }
          ],
          finalidades: [
            { cod: '01', txt: 'Crédito em C/C ou conta salário', grupo: PROPRIO },
            { cod: '05', txt: 'Crédito em conta poupança', grupo: PROPRIO },
            { cod: '03', txt: 'Transferências para outros bancos (DOC, TED)', grupo: OUTROS }
          ]
        },
        {
          seg: 'J', titulo: 'Boletos',
          servicos: [{ cod: '3', txt: BOLETO_ELE }],
          finalidades: [
            { cod: '30', txt: 'Liquidação de títulos do próprio banco' },
            { cod: '31', txt: 'Pagamento de títulos de outros bancos' }
          ]
        },
        {
          seg: 'O', titulo: 'Tributos com código de barras',
          servicos: [{ cod: '22', txt: 'Pagamento de contas, tributos e impostos' }],
          finalidades: [{ cod: '11', txt: 'Contas e tributos com código de barras (água, telefone, energia e outras concessionárias)' }]
        }
      ]
    },

    '097': {
      nome: 'Credisis',
      segmentos: [
        {
          seg: 'A', titulo: 'Transferências',
          servicos: [
            { cod: '20', txt: PG_FORN },
            { cod: '30', txt: PG_SAL }
          ],
          finalidades: [
            { cod: '01', txt: 'Crédito em C/C na Credisis', grupo: PROPRIO },
            { cod: '41', txt: TED_OUTRO, grupo: OUTROS }
          ]
        },
        {
          seg: 'J', titulo: 'Boletos',
          servicos: [{ cod: '3', txt: BOLETO_ELE }],
          finalidades: [
            { cod: '30', txt: 'Títulos em cobrança na Credisis' },
            { cod: '31', txt: 'Títulos em cobrança em outros bancos' }
          ]
        },
        {
          seg: 'O', titulo: 'Tributos com código de barras',
          servicos: [{ cod: '22', txt: 'Pagamento de tributos' }],
          finalidades: [{ cod: '11', txt: COD_BARRAS }]
        }
      ]
    },

    '104': {
      nome: 'Caixa Econômica Federal',
      segmentos: [
        {
          seg: 'A', titulo: 'Transferências',
          servicos: [
            { cod: '20', txt: 'Pagamento fornecedor' },
            { cod: '30', txt: PG_SAL },
            { cod: '98', txt: PG_DIV }
          ],
          finalidades: [
            { cod: '01', txt: 'Crédito em C/C ou conta salário', grupo: PROPRIO },
            { cod: '05', txt: 'Crédito em conta poupança', grupo: PROPRIO },
            { cod: '03', txt: 'DOC / TED', grupo: OUTROS },
            { cod: '41', txt: 'TED — outra titularidade', grupo: OUTROS },
            { cod: '43', txt: 'TED — mesma titularidade', grupo: OUTROS }
          ]
        },
        {
          seg: 'J', titulo: 'Boletos',
          servicos: [
            { cod: '20', txt: 'Pagamento fornecedor' },
            { cod: '98', txt: PG_DIV }
          ],
          finalidades: [
            { cod: '30', txt: 'Liquidação de títulos do próprio banco' },
            { cod: '31', txt: 'Pagamento de títulos de outros bancos' }
          ]
        },
        {
          seg: 'O', titulo: 'Tributos com código de barras',
          servicos: [{ cod: '22', txt: 'Pagamento de contas, tributos e impostos' }],
          finalidades: [{ cod: '11', txt: COD_BARRAS }]
        }
      ]
    },

    '237': {
      nome: 'Bradesco',
      segmentos: [
        {
          seg: 'A', titulo: 'Transferências',
          servicos: [
            { cod: '20', txt: PG_FORN },
            { cod: '30', txt: PG_SAL },
            { cod: '98', txt: PG_DIV }
          ],
          finalidades: [
            { cod: '01', txt: 'Crédito em C/C no Bradesco', grupo: PROPRIO },
            { cod: '05', txt: 'Crédito em poupança no Bradesco', grupo: PROPRIO },
            { cod: '03', txt: 'DOC', grupo: OUTROS },
            { cod: '41', txt: TED_OUTRO, grupo: OUTROS },
            { cod: '43', txt: TED_MESMO, grupo: OUTROS },
            { cod: '45', txt: 'Pix transferência', grupo: PIX }
          ]
        },
        {
          seg: 'J', titulo: 'Boletos',
          servicos: [
            { cod: '20', txt: PG_FORN },
            { cod: '98', txt: PG_DIV }
          ],
          finalidades: [
            { cod: '30', txt: 'Títulos em cobrança no Bradesco' },
            { cod: '31', txt: 'Títulos em cobrança em outros bancos' }
          ]
        },
        {
          seg: 'O', titulo: 'Tributos com código de barras',
          servicos: [
            { cod: '22', txt: 'Pagamentos de tributos' },
            { cod: '98', txt: PG_DIV }
          ],
          finalidades: [{ cod: '11', txt: COD_BARRAS }]
        }
      ]
    },

    '341': {
      nome: 'Itaú',
      segmentos: [
        {
          seg: 'A', titulo: 'Transferências',
          servicos: [
            { cod: '20', txt: PG_FORN },
            { cod: '30', txt: PG_SAL },
            { cod: '98', txt: PG_DIV }
          ],
          finalidades: [
            { cod: '01', txt: 'Crédito em C/C no Itaú', grupo: PROPRIO },
            { cod: '05', txt: 'Crédito em poupança no Itaú', grupo: PROPRIO },
            { cod: '03', txt: 'DOC', grupo: OUTROS },
            { cod: '41', txt: TED_OUTRO, grupo: OUTROS },
            { cod: '43', txt: TED_MESMO, grupo: OUTROS },
            { cod: '45', txt: 'Pix transferência', grupo: PIX }
          ],
          notas: [
            'Salário só de Itaú para Itaú: serviço 30 com finalidade 01 ou 05.',
            'Salário ou transferência para outros bancos: serviço 20 ou 98 com finalidade 03 ou 41.',
            'Transferência via Pix: serviço 20 ou 98 com finalidade 45.'
          ]
        },
        {
          seg: 'J', titulo: 'Boletos',
          servicos: [
            { cod: '20', txt: PG_FORN },
            { cod: '98', txt: PG_DIV }
          ],
          finalidades: [
            { cod: '30', txt: 'Títulos em cobrança no Itaú' },
            { cod: '31', txt: 'Títulos em cobrança em outros bancos' }
          ]
        },
        {
          seg: 'O', titulo: 'Tributos com código de barras',
          servicos: [
            { cod: '20', txt: PG_FORN },
            { cod: '22', txt: 'Pagamento de tributos' },
            { cod: '98', txt: PG_DIV }
          ],
          finalidades: [
            { cod: '13', txt: 'Pagamento de concessionárias' },
            { cod: '19', txt: 'IPTU / ISS / outros tributos municipais' },
            { cod: '91', txt: 'GNRE e tributos com código de barras' }
          ],
          notas: [
            'Tributos municipais e estaduais: serviço 22 com finalidade 19 ou 91.',
            'Concessionárias (água, luz, gás, telefone, TV e internet): serviço 20 ou 98 com finalidade 13.'
          ]
        },
        {
          seg: 'N', titulo: 'Tributos sem código de barras',
          servicos: [{ cod: '22', txt: 'Pagamento de tributos' }],
          finalidades: [
            { cod: '16', txt: 'DARF normal' },
            { cod: '17', txt: 'GPS — Guia da Previdência Social' },
            { cod: '18', txt: 'DARF simples' },
            { cod: '22', txt: 'GARE — SP ICMS' },
            { cod: '25', txt: 'IPVA' },
            { cod: '27', txt: 'DPVAT' },
            { cod: '35', txt: 'FGTS' }
          ]
        }
      ]
    },

    '748': {
      nome: 'Sicredi',
      segmentos: [
        {
          seg: 'A', titulo: 'Transferências',
          servicos: [
            { cod: '20', txt: PG_FORN },
            { cod: '30', txt: PG_SAL }
          ],
          finalidades: [
            { cod: '01', txt: 'Crédito em C/C Sicredi', grupo: PROPRIO },
            { cod: '41', txt: TED_OUTRO, grupo: OUTROS },
            { cod: '45', txt: 'Pix transferência', grupo: PIX }
          ]
        },
        {
          seg: 'J', titulo: 'Boletos',
          servicos: [{ cod: '3', txt: BOLETO_ELE }],
          finalidades: [
            { cod: '30', txt: 'Títulos Sicredi' },
            { cod: '31', txt: 'Títulos outros bancos' }
          ]
        },
        {
          seg: 'O', titulo: 'Tributos com código de barras',
          servicos: [{ cod: '22', txt: 'Pagamento de tributos' }],
          finalidades: [{ cod: '11', txt: COD_BARRAS }]
        }
      ]
    },

    '756': {
      nome: 'Sicoob',
      segmentos: [
        {
          seg: 'A', titulo: 'Transferências',
          servicos: [
            { cod: '20', txt: 'Pagamento fornecedor' },
            { cod: '30', txt: PG_SAL },
            { cod: '98', txt: PG_DIV }
          ],
          finalidades: [
            { cod: '01', txt: 'Crédito em C/C ou conta salário', grupo: PROPRIO },
            { cod: '05', txt: 'Crédito em conta poupança', grupo: PROPRIO },
            { cod: '03', txt: 'DOC / TED', grupo: OUTROS },
            { cod: '41', txt: 'TED — outra titularidade', grupo: OUTROS },
            { cod: '43', txt: 'TED — mesma titularidade', grupo: OUTROS }
          ]
        },
        {
          seg: 'J', titulo: 'Boletos',
          servicos: [
            { cod: '3', txt: BOLETO_ELE },
            { cod: '98', txt: PG_DIV }
          ],
          finalidades: [
            { cod: '30', txt: 'Liquidação de títulos do próprio banco' },
            { cod: '31', txt: 'Pagamento de títulos de outros bancos' }
          ]
        },
        {
          seg: 'O', titulo: 'Tributos com código de barras',
          servicos: [{ cod: '22', txt: 'Pagamento de contas, tributos e impostos' }],
          finalidades: [{ cod: '11', txt: COD_BARRAS }]
        }
      ]
    }
  };
})();
