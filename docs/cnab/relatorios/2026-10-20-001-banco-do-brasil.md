# Auditoria CNAB 240 — Banco do Brasil (001)

Data: 2026-10-20 · Manual: Arquivo de Pagamentos – Particularidades BB CNAB240
jun/2026 (`bb-pagamentos-particularidades-cnab240-2026-06.pdf`) ·
Validador baseado em: Arquivo de Pagamentos, nov/2020

Escopo: headers de arquivo e de lote (todos os tipos de lote), segmentos A, B,
J, J-52 (boleto, Pix QR Code e FGTS Digital), N (N1–N4, N8) e O. Os segmentos
C, W, W1 e Z são reconhecidos pelo validador, mas não foram conferidos campo a
campo (ver "Não verificado").

> **Situação: corrigido em 2026-10-20.** Todos os achados abaixo foram
> aplicados no validador, que passou a seguir o manual de jun/2026.

## Resumo

O manual do BB não tem histórico de alterações e a versão de nov/2020 saiu do
site, então a comparação foi entre o que o validador implementava e o manual
atual. Os dois problemas mais graves rejeitavam arquivos corretos: **todo
segmento B era validado como Pix** e o **CNPJ alinhado com brancos**, que o
próprio BB pede, era recusado no J-52. O manual atual também traz casos que o
validador não conhecia: FGTS Digital, formas de TED 41/43, Depósito Judicial,
GARE-SP e DARJ.

| 🔴 Divergência | 🟠 Ausente | 🔵 Nova versão | ⚪ Observação |
|---|---|---|---|
| 2 | 7 | 1 | 2 |

## Achados

### 🔴 Segmento B sempre validado como Pix
- **Manual:** p. 15 (segmento B comum: posições 15–17 em branco, endereço,
  valores, ISPB) e p. 16 (B de Pix Transferência, com forma de iniciação).
- **Código (antes):** `validate()` chamava `vSB` (layout Pix) para qualquer B.
- **Impacto:** arquivo correto de TED/crédito com segmento B levava **erro** de
  "forma de iniciação Pix inválida".
- **Correção:** B de Pix só em lotes de forma 45; nos demais, o novo
  `vSBnormal` (layout da p. 15).

### 🔴 CNPJ com brancos à esquerda recusado
- **Manual:** p. 5, 15, 21 — "Se CNPJ, alinhado à direita com brancos à
  esquerda" (CPF com zeros).
- **Código (antes):** J-52 exigia 15 dígitos (ERROR); J-52 de Pix QR nem
  conferia os números.
- **Correção:** função `inscrBB` em todos os campos de inscrição: CPF com
  zeros, CNPJ com brancos ou zeros à esquerda, DV conferido.

### 🔵 FGTS Digital
- **Manual:** p. 10, 19 e 21 — lote J de serviço 98, forma 47; J-52 com
  beneficiário tipo "2" e CNPJ da Caixa (`00360305000104`), URL (Payload
  Location) obrigatória e TXID em branco.
- **Código (antes):** sem tratamento específico.
- **Correção:** o J-52 do FGTS Digital é reconhecido pelo CNPJ da Caixa,
  conferido com essas regras e identificado no resumo do arquivo.

### 🟠 Formas de lançamento e combinação com o tipo de serviço
- **Manual:** p. 6–11 — AB: serviço 20/30/98, formas 01, 03, 05, 41, 43, 45,
  47; J: 98 com 30/31 (47 no FGTS Digital); ON: 98 com 11, 16, 17, 18, 21–24;
  Depósito Judicial: 30 com 71.
- **Código (antes):** sem 03, 41, 43 e 71; aceitava 10 (OP), que não está no
  manual; não conferia a combinação forma × serviço.
- **Correção:** lista e combinação conforme o manual (aviso).

### 🟠 Câmara obrigatória nas formas 03, 41 e 43
- **Manual:** p. 6 — essas formas exigem o código da câmara no segmento A
  (018 TED; 700 DOC).
- **Correção:** erro se a câmara não for 018 (41/43) ou 018/700 (03).

### 🟠 Depósito Judicial / em Garantia (forma 71)
- **Manual:** p. 8 e 13 — câmara 018/700/988 e identificação do depósito nas
  posições 178–217.
- **Correção:** ID obrigatório e câmaras aceitas.

### 🟠 GARE-SP (N4) e DARJ (N8) sem regras
- **Manual:** p. 26–27.
- **Correção:** campos de vencimento, referência, inscrição/documento e
  valores conferidos. DARF Simples (N3, p. 25) também completado.

### 🟠 Lacunas no header de arquivo e de lote
- **Manual:** p. 5–6 — posições 172–225 do header de arquivo; posições 51–52
  ("TS" em teste, brancos em produção) no header de lote.
- **Correção:** campos incluídos na conferência.

### 🟠 Segmento A: valor real e uso FEBRABAN
- **Manual:** p. 12 — valor real (163–177) zerado na remessa; 227–229 em
  branco.
- **Correção:** avisos incluídos.

### 🟠 Rótulo da forma 05
- O validador chamava a forma 05 de "TED Poupança"; no manual é crédito em
  conta poupança. Corrigido nas mensagens e no resumo.

### ⚪ CNPJ alfanumérico
- O manual de jun/2026 declara os campos de inscrição como alfanuméricos, mas
  não trata o CNPJ com letras. O validador o aceita **com aviso** para
  confirmação com o banco.

### ⚪ DOC ainda descrito no manual
- O manual ainda descreve o DOC (forma 03, câmara 700), encerrado em 2024. O
  validador aceita, conforme o manual.

## Não verificado

- Segmentos C, W, W1 e Z: reconhecidos, sem conferência campo a campo.
- Trailers de lote e de arquivo: totais conferidos pelo validador como antes.
- Domínios de códigos de ocorrência do retorno.
