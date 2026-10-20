# O que mudou nos manuais CNAB 240 desde a base de cada validador

*Atualizado em 20/10/2026.*

Cada validador deste sistema foi escrito a partir de uma versão específica do
manual do banco, a **versão-base**. Os bancos continuam revisando esses manuais,
e cada revisão pode exigir que o validador mude junto. Este documento explica,
banco a banco e em linguagem simples, o que mudou entre a versão-base e a
versão mais recente publicada, e o que isso significa para o sistema.

> **Como ler:** comece pelo [panorama](#panorama). Se o termo "segmento" ou
> "forma de lançamento" não for familiar, leia antes os
> [conceitos básicos](#conceitos-básicos-em-2-minutos).

---

## Panorama

| Banco | Validador feito sobre | Versão oficial atual | O que mudou | Impacto no sistema |
|---|---|---|---|---|
| **Santander** (033) | ~~V11.6~~ → **V11.7** (jun/2026) | **V11.7** (jun/2026) | CNPJ com letras; fim do GARE-SP | ✅ **Corrigido** em 20/10/2026 (validador e Preenchedor) |
| **Banco do Brasil** (001) | nov/2020 | **jun/2026** | FGTS Digital via QR Code; formas de TED 41 e 43 | 🟠 **Médio.** Casos novos que o validador não reconhece |
| **Sicredi** (748) | v1.2 (mar/2024) | **V1.4** (abr/2024) | Ajustes na composição do arquivo e no Pix QR Code | 🟡 **Baixo.** Conferir os dois pontos |
| **Sicoob** (756) | ~~v2.11~~ → **v3.3** + Folha v1.0 | **v3.3** (mai/2025) | Códigos de retorno da Folha; guia de Folha separado | ✅ **Corrigido** em 20/10/2026 (guia de Folha catalogado e aplicado) |
| **Bradesco** (237) | v6 (jul/2023) | v6 (jul/2023) | Nada | ⚫ Manual em dia, mas **o validador não tem lógica** |
| **Itaú** (341) | v086 (fev/2024) | não publicada | — | ⚪ **Sem como comparar:** o manual público oficial é de 2020 |

O que fazer primeiro está em [Próximos passos](#próximos-passos).

---

## Conceitos básicos em 2 minutos

**O arquivo CNAB 240** é um arquivo de texto em que cada linha tem exatamente
240 caracteres. Cada trecho da linha (por exemplo, "da posição 19 à 32") tem um
significado fixo, definido pelo manual. As linhas se organizam assim:

```
HEADER DE ARQUIVO   (tipo 0)  quem envia, para qual banco, quando
  HEADER DE LOTE    (tipo 1)  que tipo de pagamento vem a seguir
    Segmento A      (tipo 3)  o pagamento em si (favorecido, valor, data)
    Segmento B      (tipo 3)  dados complementares (ex.: chave Pix)
    ...
  TRAILER DE LOTE   (tipo 5)  totais do lote
TRAILER DE ARQUIVO  (tipo 9)  totais do arquivo
```

**Segmentos** são os tipos de linha de detalhe. Os mais comuns:

| Segmento | Para quê |
|---|---|
| A e B | Transferências (conta, TED, Pix) |
| J e J-52 | Boletos e Pix QR Code. O J-52 traz dados de quem paga e de quem recebe |
| N e O | Tributos sem e com código de barras |
| Z | Comprovante/autenticação (retorno) |

**Forma de lançamento** é um código de 2 dígitos no header de lote que diz que
tipo de pagamento vem no lote, por exemplo `01` = crédito em conta corrente e
`45` = Pix transferência. Cada banco publica a sua lista.

**Formato dos campos.** O manual descreve cada campo com uma notação curta:

- `9(014)`: **numérico** com 14 posições (só dígitos 0–9);
- `X(014)`: **alfanumérico** com 14 posições (letras e dígitos).

Essa diferença é exatamente a mudança mais importante deste ano
([CNPJ alfanumérico](#1-cnpj-com-letras)).

**Remessa e retorno.** A empresa envia o arquivo de *remessa*; o banco devolve
um arquivo de *retorno* com o resultado de cada pagamento, por meio de
**códigos de retorno** (ex.: saldo insuficiente). Os validadores deste sistema
conferem principalmente a remessa.

**Padrão FEBRABAN e particularidades.** A FEBRABAN publica o padrão comum
(versão atual: 10.11, de ago/2023). Cada banco publica as suas
"particularidades": o que usa, o que não usa e regras próprias. Os validadores
seguem o manual de cada banco.

---

## Mudanças que atingem o mercado todo

Três movimentos explicam boa parte das revisões recentes. Vale conhecê-los
antes de ver cada banco.

- **Fim do DOC (2024).** O DOC foi encerrado pelos bancos em 2024. O Santander o
  retirou do manual na V11.5 e o Sicoob nas versões 2.4–2.5. O manual do Banco
  do Brasil ainda o menciona.
- **Pix no CNAB (2020 em diante).** Os manuais ganharam aos poucos o Pix por
  dados bancários, por chave, por QR Code estático e por QR Code dinâmico.
  Todos os validadores já tratam Pix, mas cada banco o incluiu num momento
  diferente.
- **CNPJ com letras (2026).** A Receita Federal passou a emitir CNPJs
  alfanuméricos a partir de julho de 2026. Os arquivos precisam aceitar letras
  onde antes só havia números. Até agora, só o Santander atualizou o manual.

---

## Banco a banco

### Santander (033) — da V11.6 para a V11.7

**Manual:** *Pagamento a Fornecedores – Layout CNAB 240 (YLEC_2403)*, que traz
na última página um resumo de cada versão.

| Versão | O que trouxe |
|---|---|
| V11 | Segmento C, domínio 23 (interoperabilidade), J-52 obrigatório para boletos |
| V11.1 | Pagamento Detran-PR (IPVA, DPVAT, licenciamento) |
| V11.2 | TED Judicial |
| V11.3 | Pix por banco/agência/conta |
| V11.4 | Pix por chave |
| V11.5 | Fim do DOC |
| **V11.6** | Pix QR Code dinâmico ← *base do validador* |
| **V11.7** | **CNPJ alfanumérico; fim do GARE-SP** ← *versão atual* |

#### 1. CNPJ com letras

**O que mudou.** Os campos de CPF/CNPJ passaram de numéricos para
alfanuméricos. No Header de Arquivo, o campo "Número de Inscrição da Empresa"
(posições 19–32) era numérico de 14 posições, como no padrão FEBRABAN, e agora
é `X(014)` (manual, p. 8). A regra é a Nota G042 (p. 51):

- **CNPJ:** pode ter letras (os 12 primeiros caracteres); os 2 últimos continuam
  sendo dígitos verificadores numéricos;
- **CPF:** continua só com números;
- **alinhamento:** à direita, com zeros à esquerda, como antes.

```
Antes:   12345678000195            (14 dígitos)
Agora:   12345678000195  ou  12ABC34501DE35   (os 2 últimos são o DV, sempre numérico)
```

**Onde vale.** A Nota G042 é citada em 14 páginas: headers de arquivo e de
lote, favorecido do segmento B e dados de sacado/beneficiário do J-52.

**O que isso significa para o sistema.**
- O **validador** recusa CNPJ com letras e marca **erro** já no header de
  arquivo. Um arquivo correto de uma empresa com CNPJ novo é dado como inválido.
- O **Preenchedor .srb** também recusa: ele apaga as letras ao normalizar e
  depois exige 14 dígitos.
- O **dígito verificador** muda de cálculo: cada caractere passa a valer o
  código ASCII − 48. A regra é da Receita Federal, não do manual do banco.

#### 2. Fim do GARE-SP

**O que mudou.** O Santander deixou de aceitar o pagamento de GARE-SP, a guia
de arrecadação estadual de São Paulo para ICMS, Dívida Ativa (DR) e ITCMD
(manual, p. 65). As formas de lançamento `22`, `23` e `24` saíram da lista
(p. 40).

**O que isso significa para o sistema.** O validador ainda aceita essas formas
e valida os campos do GARE. Um arquivo com GARE **passa no validador e é
recusado pelo banco**.

> ✅ **Corrigido em 20/10/2026.** O validador e o Preenchedor aceitam CNPJ com
> letras (com o novo cálculo de DV), e o validador acusa erro para GARE-SP. O
> validador agora segue a V11.7.

**Detalhes técnicos** (o que foi encontrado e onde):
[relatório de auditoria do Santander](relatorios/2026-10-20-033-santander.md).

---

### Banco do Brasil (001) — de nov/2020 para jun/2026

**Manual:** *Arquivo de Pagamentos – Particularidades BB CNAB240*.

**Uma limitação importante.** O BB não publica histórico de alterações, e a
versão de nov/2020 não está mais no site oficial (o endereço antigo serve a de
jul/2019). Por isso, as diferenças abaixo vêm da comparação entre **o que o
validador implementa** (o retrato de nov/2020) e **o que o manual de jun/2026
define**. Elas mostram o que o validador não conhece, mas não dá para garantir
em que ano cada regra surgiu.

#### 1. FGTS Digital pago por QR Code

**O que há no manual atual.** Um lote próprio para recolher o **FGTS Digital**
(sistema do governo que substituiu a guia antiga em 2024), pago por **Pix QR
Code dinâmico** no segmento J, com forma de lançamento `47` (manual, p. 9–10).

**No sistema.** O validador não tem tratamento específico para FGTS Digital: só
cita FGTS como rótulo do segmento W. Um lote de FGTS Digital pode ser validado
como se fosse outro tipo de pagamento.

#### 2. Formas de lançamento de TED

**O que há no manual atual.** Nos lotes de transferência aparecem as formas
`41` (TED para outra titularidade) e `43` (TED para a mesma titularidade), além
de `03` (DOC/TED). As três exigem o código da câmara de compensação no segmento
A (p. 6).

**No sistema.** O validador não as inclui na lista de formas conhecidas e emite
aviso de "forma incomum" para elas.

#### 3. O DOC ainda aparece

O manual de jun/2026 ainda descreve o DOC (forma `03`, câmara `700`,
finalidade DOC — p. 6 e 12–14), embora ele tenha sido encerrado em 2024. Não
exige mudança no validador, mas indica que o BB não revisou essas partes.

#### 4. CNPJ com letras ainda não aparece

Diferente do Santander, o manual do BB de jun/2026 **não menciona CNPJ
alfanumérico**. É provável que venha numa próxima versão.

---

### Sicredi (748) — da v1.2 para a V1.4

**Manual:** *Manual para Empresas Associadas – Pagamento a Fornecedor – CNAB 240*.
A última página registra as versões.

| Versão | O que trouxe |
|---|---|
| 1.0 | Manual exclusivo para Pagamento a Fornecedor |
| 1.1 | Contas Woop e Plataforma; DV no segmento A para Pix; e-mail da chave Pix sempre em minúsculas |
| **1.2** | Pix QR Code nos segmentos J e J-52 ← *base do validador* |
| 1.3 | Ajuste na composição do arquivo (quais segmentos cada lote usa) |
| **1.4** | Ajuste no pagamento por Pix QR Code ← *versão atual* |

**O que mudou.** O próprio manual descreve as duas mudanças de forma genérica
("ajuste"). O que vale hoje nesses pontos:

- **Composição do arquivo (1.3):** a tabela da p. 5 define, para cada tipo de
  pagamento, quais segmentos são obrigatórios. Exemplos: crédito em conta e TED
  usam A e B; boletos usam J e J-52; Pix QR Code (dinâmico e estático) usa J e
  J-52.
- **Pix QR Code (1.4):** o pagamento usa o segmento J com o J-52 obrigatório,
  com a URL extraída do QR Code, e foi liberado a partir de 19/04/2024 (p. 19–22).

**O que isso significa para o sistema.** O validador já trata Pix QR Code. Uma
auditoria precisa conferir se ele exige os segmentos certos para cada tipo de
lote e se segue as regras de QR Code dinâmico e estático das p. 21–22.

---

### Sicoob (756) — da v2.11 para a v3.3

**Manual:** *Guia de Importação de Arquivos CNAB 240 – Pagamentos e
Transferências*.

Boa parte das mudanças grandes do Sicoob (Pix, TXID obrigatório no J-52, fim do
DOC) aconteceu em 2024, **antes** da versão-base, e já faz parte do que o
validador segue. Depois da base vieram:

| Versão | Data | O que trouxe |
|---|---|---|
| **2.11** | 30/12/2024 | Novos códigos de retorno de Pix ← *base do validador* |
| 3.0 | 23/03/2025 | Códigos de retorno `BF` e `68` para Folha de Pagamento |
| 3.1 | 26/03/2025 | Mudança de nomenclatura |
| 3.2 | 23/04/2025 | "Manual" passa a se chamar "guia" |
| **3.3** | 19/05/2025 | Guia dividido em dois: Pagamentos e Transferências / Folha de Pagamento ← *atual* |

**O que isso significa para o sistema.**
- **Códigos `BF` e `68`:** aparecem só no arquivo de **retorno**. O validador do
  Sicoob confere a remessa e não lê esses códigos, então nada muda.
- **Divisão do guia (3.3):** as regras de **Folha de Pagamento** saíram deste
  guia e foram para outro documento. O validador **valida Folha** (lotes de tipo
  de serviço `30`), mas o guia de Folha ainda não está no catálogo de manuais e
  precisa ser incluído para servir de referência.

> ✅ **Corrigido em 20/10/2026.** O *Guia de Importação – Folha de Pagamento*
> v1.0 (19/05/2025) entrou no catálogo. Comparado com ele, o validador passou a:
> - conferir os 26 campos do segmento B de Folha (antes conferia 5);
> - aceitar em lotes de Folha só as formas de lançamento do guia: `01` (conta
>   corrente), `05` (poupança) e `41` (TED outra titularidade).
>
> Ele agora segue a v3.3 de Pagamentos e a v1.0 de Folha.

---

### Bradesco (237) — v6 nas duas pontas

O manual publicado é o mesmo em que o validador se baseia: *Manual de
Procedimentos Multipag Bradesco (240 posições)*, versão 6, de jul/2023. Não há
diferença de versão.

**O ponto de atenção é outro: o validador do Bradesco não tem lógica de
validação.** A página existe e aceita o arquivo, mas não confere nenhum campo.
O trabalho aqui é escrever o validador a partir da v6.

---

### Itaú (341) — sem como comparar

O validador se baseia no *SISPAG – Layout de Arquivos CNAB*, versão 086
(fev/2024). O único SISPAG publicado em site oficial do Itaú é de **out/2020**,
anterior à base do validador. Versões mais novas são distribuídas pelo portal
do Itaú Empresas ou pelo gerente, e não estão abertas na internet.

Comparar com o manual de 2020 levaria a conclusões erradas (pareceria que o
validador "tem regras demais"). Para fazer esta análise é preciso obter o PDF
da v086 ou mais recente com o Itaú.

---

## Próximos passos

Em ordem de urgência:

1. ~~**Santander: CNPJ com letras** no validador e no Preenchedor.~~ ✅ feito
2. ~~**Santander: remover o GARE-SP.**~~ ✅ feito
3. **Banco do Brasil:** auditoria completa, começando por FGTS Digital e formas
   de TED 41/43.
4. **Sicredi:** conferir a composição do arquivo e o Pix QR Code contra a V1.4.
5. ~~**Sicoob:** incluir o guia de Folha de Pagamento no catálogo.~~ ✅ feito
6. **Itaú:** obter o manual SISPAG v086 ou mais recente.
7. **Bradesco:** escrever o validador a partir da v6.

---

## Sobre este documento

**Fontes:** manuais oficiais listados em [`catalogo.js`](catalogo.js) (versão,
data, link e SHA-256 de cada um), lidos com a skill de auditoria
(`.claude/skills/auditar-cnab`). As referências de página apontam para as
versões atuais desses manuais. Os PDFs não ficam no repositório; veja o
[README](README.md) para baixá-los.

**Para atualizar:** quando um banco publicar versão nova
(`tools/baixar-docs.ps1 -Verificar` avisa), peça ao Claude Code, nesta pasta,
para atualizar este documento. Quando um validador for corrigido, atualize a
coluna "Validador feito sobre" no panorama.
