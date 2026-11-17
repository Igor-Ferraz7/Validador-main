# Validador-main

Central de validadores CNAB240 por banco e Preenchedor de Remessa `.srb`.
Abra o `index.html` (no navegador, direto do disco, ou pelo GitHub Pages).

## Preenchedor de Remessa .srb

`Preenchedor_SRB.html` já abre com o template de cada banco carregado: basta
escolher o banco, preencher os dados do cliente e clicar em **Gerar .srb**.
Templates disponíveis: Banco do Brasil, Bradesco, Caixa, Credisis, Itaú,
Santander, Sicoob e Sicredi. A página assume o logo, a cor e os manuais
oficiais do banco escolhido e lembra o último banco usado no navegador.

Cada banco pede só os campos que o seu template deixa como token, então o
formulário muda de banco para banco: o Bradesco não pede o nome do titular
(nesse template o motor preenche as posições 73-102), e a Caixa é a única que
pede a operação da conta, porque separa operação (59-62) e conta (63-70) onde
os outros usam 59-70 para a conta inteira.

- **Templates:** os arquivos em `Placeholders/` são a fonte. A página lê uma
  cópia embutida em `templates/templates.js`, gerada a partir deles.
- **Regras por banco:** `configs/<banco>.js` (rótulos, normalização e
  validação de cada token `<Campo_InsertIA>`).

### Alterar ou adicionar um template

1. Edite (ou adicione) o arquivo em `Placeholders/`.
2. Regere o arquivo embutido:

   ```
   powershell -ExecutionPolicy Bypass -File tools/gerar-templates.ps1
   ```

3. Faça commit do template e do `templates/templates.js` juntos.

**Nenhum dado de cliente nos templates.** Os templates nascem de arquivos reais,
com a agência, a conta, o CPF/CNPJ e o nome de um cliente de verdade nos campos
de identificação, e este repositório é público. Mantenha os arquivos de origem
fora dele e troque todo campo de identificação por um token antes de versionar.
O gerador recusa o arquivo se achar valor fixo em `Inscricao`, `NomeEmpresa`,
`Agencia`, `CtaBanc`, `Convenio` e afins — só passa token, vazio, zeros ou
brancos. Campos com `FIXO=N` ficam de fora da trava: ali quem preenche é o
motor, e a coluna 11 é apenas descrição.

Para um banco novo, crie também `configs/<banco>.js` (regras de cada token,
nome, logo e cor; use os existentes como modelo) e inclua o `<script>`
correspondente em `Preenchedor_SRB.html`. O banco do template é identificado
pelo campo `CodOficial` (ou `BancoCompensacao`) do próprio arquivo.

## Analisador de Retorno

`Retorno_CNAB240.html` lê um arquivo de retorno e diz se ele é:

- **retorno de crítica** (o "pré-retorno"): o banco só aceitou ou recusou os
  registros (agendado, bloqueado, excluído ou erro). Nada foi pago ainda;
- **retorno de movimento** (o definitivo): o banco informa o resultado do
  pagamento. Só a ocorrência de pagamento efetivado permite dar baixa.

O header não diferencia os dois (posição 143 = 2 em ambos); a decisão vem das
ocorrências de cada registro (posições 231–240), do segmento Z (autenticação)
e do aviso de débito no trailer de lote. A página mostra o status de cada
pagamento e exporta um CSV para a baixa. O arquivo é lido só no navegador.

O banco é reconhecido pelo próprio arquivo (header, posições 1–3); o botão
**Trocar banco** força outro. Bancos atendidos: Banco do Brasil (001),
Santander (033), Credisis (097), Caixa (104), Bradesco (237), Itaú (341),
Sicredi (748) e Sicoob (756).

### Regras por banco

As tabelas do padrão FEBRABAN (ocorrências da nota G059, tipo de serviço,
forma de lançamento e posições dos segmentos) ficam em
`configs/retorno-base.js`. Cada banco entra em
`configs/retorno-<codigo>-<banco>.js` e declara só o que difere — o cabeçalho
desse arquivo lista os campos aceitos. Para um banco novo, copie o arquivo de
um banco parecido e inclua o `<script>` em `Retorno_CNAB240.html`.

Isso importa porque o mesmo código significa coisas diferentes em cada banco:

| Código | FEBRABAN | No banco |
| --- | --- | --- |
| `BD` | Inclusão efetuada com sucesso | Itaú: **pagamento agendado** |
| `BF` | Exclusão efetuada com sucesso | Sicoob: **rejeitado** por pendência de assinatura |
| `ZA` | Informativo | Santander: **transferência devolvida**; Bradesco e Sicredi: conta do favorecido substituída |

Banco do Brasil, Caixa e Credisis usam a tabela da FEBRABAN: o manual do BB
remete a uma planilha de ocorrências à parte, e não há manual da Caixa nem da
Credisis em `docs/cnab`. A página avisa isso na tela.

## Tipos de serviço e finalidades

No rodapé de cada validador e do Preenchedor há um quadro com o que o banco
homologou para o ERP em cada segmento: os tipos de serviço (posições 10-11 do
header de lote) e as finalidades (15-16). **Expandir** abre em tamanho cheio e
**Baixar PNG** salva a figura em 3x.

O quadro é desenhado na hora, num `<canvas>`, a partir de `configs/servicos.js`
— não é uma imagem pronta guardada no repositório. Assim a figura nunca descola
dos dados, acompanha o tema claro/escuro e a cor do banco, e continua sendo
baixável. Junto vai uma versão em texto, escondida da tela, para leitor de tela
e para copiar os códigos.

- **Dados:** `configs/servicos.js`, um bloco por banco, com os segmentos e seus
  itens. O cabeçalho do arquivo descreve o formato.
- **Desenho:** `assets/servicos-cnab.js`, nos mesmos moldes de
  `assets/docs-cnab.js`: `data-banco="<código>"` numa página de banco, ou
  `data-banco="auto"` com `window.CnabServicos.montar(código)` quando a página
  troca de banco, como faz o Preenchedor.

Para um banco novo, acrescente o bloco em `configs/servicos.js` e inclua os dois
`<script>` na página. Bancos sem bloco simplesmente não mostram o quadro.

## Visual

Todas as páginas usam o mesmo sistema visual, em `assets/ui.css`: cores,
tipos, botões, etiquetas, listas e tabelas. O fundo, as linhas e os destaques
são derivados da cor do banco, então cada página assume o tom dele, no tema
claro e no escuro (`assets/tema.js`; o botão fica no rodapé do menu). Cada página
define só essa cor, logo depois do link para o `ui.css`:

```html
<link rel="stylesheet" href="assets/ui.css">
<style>:root{--bk:#EC0000;--bkc:#fff;}</style>
```

`--bk` é a cor do banco e `--bkc` a cor do texto sobre ela (branco, ou
`#16140f` quando o branco não dá contraste, como no amarelo do BB). No
Preenchedor as duas vêm do `cor` em `configs/<banco>.js`.

Para um validador novo, copie o `<head>` de um existente e inclua o link no
menu do `index.html`. A central abre cada ferramenta por endereço próprio
(`index.html#santander`, `#preenchedor`…) e lembra a última usada.

## Manuais oficiais

`docs/cnab/catalogo.js` lista o manual oficial de cada banco (e o padrão
FEBRABAN): versão, data, link e SHA-256. Cada validador tem o botão
**Manuais oficiais**, que abre esses links (e a cópia local, quando a página
é aberta do disco).

O que mudou em cada manual desde a versão em que o validador se baseia está
explicado em [docs/cnab/diferencas-entre-versoes.md](docs/cnab/diferencas-entre-versoes.md).

Os PDFs ficam só no disco, fora do git. Para baixá-los ou checar se algum banco
publicou versão nova, veja `docs/cnab/README.md`:

```
powershell -ExecutionPolicy Bypass -File tools/baixar-docs.ps1
powershell -ExecutionPolicy Bypass -File tools/baixar-docs.ps1 -Verificar
```

## Auditoria contra os manuais (Claude Code)

A skill de projeto `.claude/skills/auditar-cnab` compara validadores, templates
e configs com os manuais e gera um relatório em `docs/cnab/relatorios/`. No
Claude Code, aberto nesta pasta, basta pedir, por exemplo: "audite o validador
do Sicoob contra o manual atual". Requer o `pdftotext`
(`winget install oschwartz10612.Poppler`) e os PDFs baixados.
