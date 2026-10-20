---
name: auditar-cnab
description: Audita os validadores CNAB 240 e o Preenchedor .srb deste repositório contra os manuais oficiais dos bancos catalogados em docs/cnab, produzindo um relatório de divergências com evidência (página do manual + linha do código). Use sempre que o usuário quiser comparar, conferir, auditar ou atualizar um validador, template ou config em relação ao manual/layout do banco; perguntar se um validador está correto, completo ou desatualizado; citar uma versão nova de layout (ex. Santander V11.7, Sicoob v3.3, BB jun/2026), campos, posições, segmentos (A, B, J, J-52, N, O...), códigos de ocorrência ou formas de lançamento; ou quiser saber se algum banco publicou manual novo — mesmo sem dizer "auditoria".
---

# Auditar CNAB 240

Cada validador deste repositório codifica à mão as regras do manual de um
banco (posições, conteúdos fixos, domínios, obrigatoriedade), e os bancos
revisam esses manuais. Esta skill acha onde o código e o manual oficial
discordam, com evidência dos dois lados, para o usuário decidir o que corrigir.

## Onde estão as coisas

- `docs/cnab/catalogo.js` — por banco: o validador, `baseDoValidador` (versão
  do manual em que o código foi baseado) e os documentos atuais (versão,
  arquivo, URL oficial, SHA-256). É JSON depois de `window.CNAB_DOCS =`.
- `docs/cnab/<pasta>/*.pdf` e `*.txt` — manuais e texto extraído. Só existem no
  disco (fora do git); se faltarem, baixe (abaixo).
- `Validador_CNAB240_<Banco>.html` — uma função por registro/segmento (`vHA`,
  `vHL`, `vSA`, `vSJ52`, `vTL`, `vTA`...) e uma chamada
  `CF(ctx,'NN.N Campo (ini–fim)',ini,fim,ln,[checks],esperado,fix)` por campo.
- Preenchedor `.srb`: `Placeholders/*.TXT` (template com as posições de cada
  campo) e `configs/<banco>.js` (regras dos tokens `<Campo_InsertIA>`).

Detalhes (convenções de nomes, severidades, onde fica a versão no código) em
`references/mapa-repositorio.md` — leia quando for abrir o código.

## Ferramentas

Rode da raiz do repositório com
`powershell -NoProfile -ExecutionPolicy Bypass -File <script> <args>`:

| Script | Para quê |
|---|---|
| `tools/baixar-docs.ps1 -Verificar` | Checa se algum banco publicou versão nova ou tirou o manual do ar (só cabeçalho HTTP, quase sem custo). |
| `tools/baixar-docs.ps1 [-Banco 033]` | Baixa/atualiza PDFs e gera os `.txt`. Arquivo diferente do catálogo vira `<arquivo>.NOVO.pdf`, sem sobrescrever. |
| `.claude/skills/auditar-cnab/scripts/buscar-manual.ps1 -Banco 033` | Sumário do manual. Com `-Padrao 'regex'`, as páginas onde aparece; com `-Pagina 8,9`, o texto dessas páginas. |
| `.claude/skills/auditar-cnab/scripts/extrair-campos.ps1 <validador.html \| template.TXT> [-Funcao vSA]` | Tabela do que o sistema implementa: campos com posição e linha no código, lacunas em 1–240, sobreposições, rótulo com posição diferente dos argumentos. |
| `... extrair-campos.ps1 <validador.html> -Buscar 'regex'` | Onde o código trata algo (CNPJ, um código de domínio, um serviço), com linha e função. Use para achar **todos** os pontos afetados por uma mudança, não só o primeiro. |

Use os scripts em vez de abrir os arquivos inteiros: os `.txt` dos manuais têm
de 100 a 600 KB e os validadores, 700–1000 linhas. Ler tudo gasta o contexto e
enterra a comparação; com a tabela do implementado em mãos, você abre só as
páginas do manual e as linhas do código que importam.

## Fluxo

1. **Escopo.** Banco(s) e artefato: validador, template/config do Preenchedor,
   ou ambos. Uma auditoria completa de um banco é grande; se o pedido for
   "audite tudo", faça um banco por relatório e combine a ordem com o usuário.
   Se o pedido for um segmento ou campo, fique nele.

2. **Fontes em dia.** Rode `-Verificar`. Versão nova publicada já é um achado:
   baixe com `-Banco`, leia o `.NOVO.pdf` e avise o usuário para atualizar o
   catálogo. Se os `.txt` faltarem, rode o download.

3. **Comece pela diferença de versões.** Compare `baseDoValidador` com a
   `versao` do documento. Se o manual for mais novo, ache o histórico/lista de
   alterações (`-Padrao 'altera|hist[oó]rico'`) e liste cada mudança entre a
   versão-base e a atual. São as divergências mais prováveis e as mais baratas
   de confirmar.

4. **Mapeie o implementado.** `extrair-campos.ps1` no validador (e no template,
   se for o caso). Anote quais registros/segmentos existem, as lacunas, os
   rótulos com posição errada e os `CF` com posição calculada.

5. **Compare registro a registro.** Para cada registro/segmento (header de
   arquivo, header de lote, segmentos, trailers), ache a tabela no manual
   (`-Padrao` → `-Pagina`) e confira campo a campo:
   - posição inicial/final e tamanho;
   - tipo (numérico/alfanumérico) e casas decimais;
   - conteúdo fixo ou padrão (ex.: versão do layout);
   - domínios (tipo de serviço, forma de lançamento, finalidade, ocorrências);
   - obrigatoriedade e regras condicionais (ex.: segmento J-52 obrigatório);
   - segmentos que o manual define e o validador não trata, e vice-versa.

   Para ver o que um campo realmente checa, leia as linhas indicadas pelo
   `extrair-campos` (Read com offset/limit). Case campos pela **posição**, não
   pelo número do item: a numeração (`07.0`, notas `G015`) muda entre bancos.
   No Preenchedor, compare as posições e valores fixos do template e as regras
   do `configs/<banco>.js` (ex.: tipo e tamanho do CPF/CNPJ) com o manual.

6. **Classifique** (abaixo) e **escreva o relatório**.

## Classificação

- 🔴 **Divergência** — o código contradiz o manual atual: posição errada, valor
  fixo errado, rejeita algo válido ou aceita algo inválido.
- 🟠 **Ausente** — regra do manual que o sistema não checa: segmento não
  validado, domínio não conferido, lacuna de posições.
- 🔵 **Nova versão** — mudança publicada depois da `baseDoValidador` (cite o
  item do histórico de alterações).
- ⚪ **Observação** — o sistema é mais rígido ou diferente de forma defensável,
  ou o manual é ambíguo; precisa de decisão humana.

Considere a severidade do próprio validador: um `WARN` onde o manual diz
"obrigatório" pode ser divergência.

Todo achado leva evidência dos dois lados: **manual** (arquivo + página +
trecho curto) e **código** (`arquivo:linha`). O usuário vai agir sobre o
relatório; um achado sem página não dá para conferir, e um achado errado leva a
"consertar" um validador que funcionava. Se não conseguiu confirmar no manual,
diga isso em vez de supor.

## Relatório

Salve em `docs/cnab/relatorios/AAAA-MM-DD-<codigo>-<banco>.md` (vai para o
git: é análise nossa, não cópia do manual). Use esta estrutura:

```markdown
# Auditoria CNAB 240 — <Banco> (<código>)

Data: AAAA-MM-DD · Manual: <título> <versão> (`<arquivo>`) ·
Validador baseado em: <baseDoValidador>
Escopo: <o que foi auditado e o que ficou de fora>

## Resumo

<3 a 6 linhas: estado geral e o que corrigir primeiro.>

| 🔴 Divergência | 🟠 Ausente | 🔵 Nova versão | ⚪ Observação |
|---|---|---|---|
| n | n | n | n |

## Achados

### 🔴 <título curto>
- **Manual:** p. N — "trecho curto"
- **Código:** `Validador_CNAB240_X.html:LINHA` — o que o código faz hoje
- **Impacto:** o que acontece com um arquivo real
- **Sugestão:** a correção

## Não verificado

<O que ficou fora do escopo ou não deu para confirmar.>
```

Os manuais têm direitos dos bancos e o repositório é público: cite a página,
resuma com suas palavras e transcreva só o essencial (nomes de campos,
valores, uma frase curta).

## Depois do relatório

Não altere validadores, templates ou configs por conta própria: apresente o
resumo e pergunte o que corrigir. Ao corrigir, atualize também a versão
declarada (texto do cabeçalho `.htag`, comentários e mensagens que citam a
versão, e `baseDoValidador` no catálogo) e teste a página no navegador.

## Armadilhas conhecidas

- **Bradesco:** o validador não tem lógica (o `<script>` está vazio). Não liste
  cada campo como ausente; diga que o validador precisa ser escrito.
- **Itaú:** o único manual oficial público (out/2020) é mais antigo que a v086
  em que o validador se baseia. Comparar com ele gera falsas regressões; avise
  a limitação e peça o PDF da v086.
- **Tabelas do pdftotext:** a coluna de nomes pode ficar deslocada algumas
  linhas em relação às de posição/formato (acontece no Santander, inclusive
  com `-Bruto`). As colunas mantêm a ordem: o n-ésimo nome corresponde à n-ésima
  posição e ao n-ésimo formato. Confira pelo tamanho — `9(003)` exige
  fim − início + 1 = 3 — antes de afirmar que um campo mudou.
- **Tabelas de histórico de versões:** numa célula com várias linhas, o número
  da versão sai na linha do meio, não na primeira. Atribua cada linha de texto
  à versão pela posição da célula, senão itens caem na versão vizinha.
- **Sem histórico:** alguns manuais (ex.: BB) não registram alterações e a
  versão-base pode ter saído do ar. Nesse caso, use o validador como retrato da
  versão-base e compare-o com o manual atual, deixando claro que não dá para
  datar cada mudança.
- **Notas (G015, G042...):** as tabelas só citam a nota; a regra fica numa
  seção de informações genéricas no fim do manual. Ache a definição ancorando
  no início da linha: `-Padrao '^\s*G042\b'`.
