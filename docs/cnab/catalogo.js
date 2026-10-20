/* Catálogo dos manuais oficiais CNAB 240 usados pelos validadores.
 *
 * Fonte única para: o botão "Manuais oficiais" de cada validador
 * (assets/docs-cnab.js), o download/verificação (tools/baixar-docs.ps1) e a
 * skill de auditoria (.claude/skills/auditar-cnab).
 *
 * Os PDFs ficam em docs/cnab/<pasta>/ apenas no disco (não vão para o git,
 * para não republicar material dos bancos). Rode tools/baixar-docs.ps1 para
 * baixá-los.
 *
 * O conteúdo após "window.CNAB_DOCS =" precisa ser JSON válido (aspas duplas,
 * sem comentários, sem vírgula sobrando): o script PowerShell o lê como JSON.
 */
window.CNAB_DOCS = {
  "atualizadoEm": "2026-10-20",
  "bancos": [
    {
      "codigo": "001",
      "nome": "Banco do Brasil",
      "pasta": "001-banco-do-brasil",
      "validador": "Validador_CNAB240_BancoDoBrasil.html",
      "baseDoValidador": "Arquivo de Pagamentos, nov/2020",
      "documentos": [
        {
          "titulo": "Arquivo de Pagamentos – Particularidades BB CNAB240",
          "versao": "jun/2026",
          "data": "2026-06",
          "arquivo": "bb-pagamentos-particularidades-cnab240-2026-06.pdf",
          "url": "https://www.bb.com.br/docs/portal/disem/PgtVer03BB.pdf",
          "bytes": 1181772,
          "sha256": "4c41b8dac0b5a2b5ab49a360b4b3693ee99a0d414ebbbbe3e8d0239ab3b8618c",
          "observacao": "O site do BB recusa alguns clientes HTTP (403); o curl.exe do Windows funciona."
        }
      ]
    },
    {
      "codigo": "033",
      "nome": "Santander",
      "pasta": "033-santander",
      "validador": "Validador_CNAB240_Santander.html",
      "baseDoValidador": "YLEC_2403 V.11.7 (06/2026)",
      "documentos": [
        {
          "titulo": "Pagamento a Fornecedores – Manual de Troca de Arquivos – Layout CNAB 240 (YLEC_2403)",
          "versao": "V11.7",
          "data": "2026-06",
          "arquivo": "santander-pagamento-fornecedores-cnab240-v11.7.pdf",
          "url": "https://cms.santander.com.br/sites/WPS/documentos/arq-layout-pagamento-fornecedores-set24/26-05-25_132828_pagamento-fornecedores-layout-cnab-240.pdf",
          "bytes": 1323406,
          "sha256": "4b4ddbfaade1481a6c70bfb06f56b50d283302cbc07db9e1ac8d3453e5873d0d",
          "observacao": ""
        }
      ]
    },
    {
      "codigo": "237",
      "nome": "Bradesco",
      "pasta": "237-bradesco",
      "validador": "Validador_CNAB240_Bradesco_Multipag.html",
      "baseDoValidador": "Multipag v6 (07/2023)",
      "documentos": [
        {
          "titulo": "Manual de Procedimentos Multipag Bradesco (240 posições) – inclui Pix",
          "versao": "6",
          "data": "2023-07",
          "arquivo": "bradesco-multipag-cnab240-v6.pdf",
          "url": "https://wspf.banco.bradesco/wsValidadorUniversal/Content/Pdf/Multipag_Bradesco_PIX_240_posicoes.pdf",
          "bytes": 2861703,
          "sha256": "bc502f3d97f767202045919aaafe98806e9d343a3dea341c9a314f9d6eb5c3e0",
          "observacao": "Publicado no Validador Universal do Bradesco. Substitui o layout v03 (2018) e o manual v5 (jan/2022) do site institucional."
        }
      ]
    },
    {
      "codigo": "341",
      "nome": "Itaú",
      "pasta": "341-itau",
      "validador": "Validador_CNAB240_Itau.html",
      "baseDoValidador": "SISPAG v086 (02/2024)",
      "documentos": [
        {
          "titulo": "SISPAG – Intercâmbio Eletrônico de Arquivos (CNAB 240)",
          "versao": "out/2020",
          "data": "2020-10",
          "arquivo": "itau-sispag-cnab240-2020-10.pdf",
          "url": "https://download.itau.com.br/bankline/sispag_cnab.pdf",
          "bytes": 1600443,
          "sha256": "a51e91be9aca32b89b812338be7596376d60279dcb563d421d03d8d16555ee22",
          "observacao": "Mais antigo que a v086 (02/2024) usada no validador; a v086 não está publicada em domínio oficial do Itaú."
        }
      ]
    },
    {
      "codigo": "748",
      "nome": "Sicredi",
      "pasta": "748-sicredi",
      "validador": "Validador_CNAB240_Sicredi - v2 1.html",
      "baseDoValidador": "Pagfor v1.2 (03/2024)",
      "documentos": [
        {
          "titulo": "Manual para Empresas Associadas – Pagamento a Fornecedor – CNAB 240 FEBRABAN",
          "versao": "V1.4",
          "data": "2024-04",
          "arquivo": "sicredi-pagamentos-cnab240-v1.4.pdf",
          "url": "https://www.sicredi.com.br/media/produtos/filer_public/2024/04/18/manual-pagamentos1804.pdf",
          "bytes": 1723288,
          "sha256": "1a547b2419a32293cfced30eb6d7d4dcf2cdb247e70413a528fadc56e790ebb5",
          "observacao": ""
        }
      ]
    },
    {
      "codigo": "756",
      "nome": "Sicoob",
      "pasta": "756-sicoob",
      "validador": "Validador_CNAB240_Sicoob.html",
      "baseDoValidador": "v2.11 (12/2024)",
      "documentos": [
        {
          "titulo": "Guia de Importação de Arquivos CNAB 240 – Pagamentos e Transferências",
          "versao": "3.3",
          "data": "2025-05-19",
          "arquivo": "sicoob-importacao-cnab240-pagamentos-v3.3.pdf",
          "url": "https://www.sicoob.com.br/documents/20128/1635942/Guia+de+importacao+de+arquivos+CNAB+240+Piloto.pdf/53ce530c-54ee-7952-32fb-3e5f2f2a57a9?version=2.0&t=1747666535910&download=true",
          "bytes": 311923,
          "sha256": "348135530f05351d1fee1e99f0fffdabc9e7203865ec7957eeef906472708a2c",
          "observacao": ""
        }
      ]
    }
  ],
  "referencias": [
    {
      "nome": "FEBRABAN",
      "pasta": "febraban",
      "documentos": [
        {
          "titulo": "Layout Padrão FEBRABAN CNAB 240 – Intercâmbio de Informações entre Bancos e Empresas",
          "versao": "10.11",
          "data": "2023-08-21",
          "arquivo": "febraban-cnab240-v10.11.pdf",
          "url": "https://cmsarquivos.febraban.org.br/Arquivos/documentos/PDF/Layout%20padrao%20CNAB240%20V%2010%2011%20-%2021_08_2023.pdf",
          "bytes": 4342675,
          "sha256": "246c9e261e951d20f9bf5d8a8e339b10009d4257d8cb70a1ae7e165e531788e6",
          "observacao": "Padrão base; cada banco publica as suas particularidades."
        }
      ]
    }
  ]
};
