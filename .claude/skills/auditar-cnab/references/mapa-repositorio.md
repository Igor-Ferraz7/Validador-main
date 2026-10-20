# Mapa do código para auditoria

Como as regras CNAB estão escritas no repositório, para achar rápido o que
comparar com o manual.

## Validadores (`Validador_CNAB240_<Banco>.html`)

Página única com HTML, CSS e um `<script>` com toda a lógica. O padrão é o
mesmo em todos os bancos (o Bradesco ainda não tem lógica).

### Código do banco e versão declarada

- `const BANCO='033';` no início do script.
- A versão do manual em que o validador se baseia aparece em três lugares, que
  devem ser atualizados juntos quando o validador for corrigido:
  - etiqueta do cabeçalho: `<span class="htag">Banco 033 · YLEC_2403 V.11.6 · ...`;
  - comentário antes das funções: `VALIDATORS — SANTANDER CNAB240 YLEC_2403 V.11.6`;
  - mensagens/esperados que citam a versão, ex. `'"060" (Santander V.11.6)'`.
  - e `baseDoValidador` em `docs/cnab/catalogo.js`.

### Uma função por registro/segmento

| Função | Registro |
|---|---|
| `vHA` | Header de arquivo (tipo 0) |
| `vHL` | Header de lote (tipo 1) — costuma devolver tipo de serviço/forma de lançamento usados pelos segmentos |
| `vSA`, `vSB...`, `vSC`, `vSJ`, `vSJ52...`, `vSN`, `vSO`, `vSW`, `vSZ`... | Segmentos do detalhe (tipo 3); sufixos indicam variantes (ex. `vSBpix`, `vSJ52pix`, `vSJpixqr`) |
| `vTL` | Trailer de lote (tipo 5) — somatórios e contagem |
| `vTA` | Trailer de arquivo (tipo 9) |

Os nomes variam um pouco entre bancos; `extrair-campos.ps1` lista os que
existem.

### O roteamento fica em `validate()`

`validate()` percorre as linhas, decide o registro pelo tipo (posição 8) e,
nos detalhes, pelo código do segmento (posição 14), numa cadeia
`if(sc==='A'){ vSA(...) } else if(sc==='B'){ ... }`. É ali que se descobre:

- quais segmentos o validador trata (um segmento ausente da cadeia não é
  validado — compare com a lista de segmentos do manual);
- qual variante é escolhida (ex.: J-52 Pix × boleto) e com base em quê
  (forma de lançamento do header de lote, conteúdo de um campo).

Ache com `Grep` por `sc===` ou `function validate(`.

### Um `CF(...)` por campo

```js
CF(ctx, '20.0 Versão do Layout (164–166)', 164, 166, ln,
   [ {test: p(ln,164,166)==='060', sev:'WARN', msg:'...', fix:'060'} ],
   '"060" (Santander V.11.6)',   // texto do valor esperado, mostrado na tela
   '060');                       // valor sugerido para correção (opcional)
```

- `p(ln,a,b)` extrai as posições a..b (1-based, inclusivas).
- Cada item de `checks` é uma regra: `test` falso gera ocorrência com
  severidade `sev` — `'ERROR'` (arquivo inválido) ou `'WARN'` (aviso).
- O rótulo traz o número do item no manual do banco e as posições; o
  `extrair-campos.ps1` aponta quando o rótulo e os argumentos discordam.
- Um campo pode aparecer sem `CF` (lido para uso em outra regra) ou não
  aparecer de todo — as lacunas que o `extrair-campos.ps1` mostra.

Utilitários comuns: `isNum`, `isBl` (brancos), `isZeros`, `chkDt`
(DDMMAAAA), `chkCPF`, `chkCNPJ`. Ao auditar CPF/CNPJ, confira se `chkCNPJ`
aceita o formato exigido pelo manual (ex.: CNPJ alfanumérico).

## Preenchedor `.srb`

- `Placeholders/<ARQUIVO>.TXT` — template. Linhas de campo com 11 colunas:
  `|REG|TIPO|POS_INI|POS_FIM|ALINHA|CHAR_PAD|CASA_DEC|MULT|NOME|FIXO|VALOR|`,
  em blocos `|HEARQ| ... |/HEARQ|`. `FIXO=S` → o valor vem do template; `N` →
  preenchido pelo motor em tempo de execução. Tokens `<Campo_InsertIA>` são
  preenchidos pelo usuário na página.
- `configs/<banco>.js` — por token: normalizador e regra (`cpfcnpj`,
  `charset` digits/alnum/company/any). O tamanho máximo vem do template (menor
  largura entre as ocorrências do token), não da config.
- `templates/templates.js` — cópia embutida dos templates, **gerada** por
  `tools/gerar-templates.ps1`. Nunca edite à mão; ao mudar um template em
  `Placeholders/`, rode o gerador.
- O motor que consome o `.srb` faz o padding; a página insere valores crus.

Pontos típicos a auditar no Preenchedor: posições e valores fixos do template
(versão do layout no header de arquivo e de lote, código do banco, nome do
banco), e se a regra de cada token na config aceita exatamente o que o manual
aceita (tipo, tamanho, dígito verificador).

## Catálogo (`docs/cnab/catalogo.js`)

```json
{ "codigo": "033", "nome": "Santander", "pasta": "033-santander",
  "validador": "Validador_CNAB240_Santander.html",
  "baseDoValidador": "YLEC_2403 V.11.6 (07/2024)",
  "documentos": [ { "titulo": "...", "versao": "V11.7", "data": "2026-06",
    "arquivo": "....pdf", "url": "https://...", "bytes": 1323406,
    "sha256": "...", "observacao": "..." } ] }
```

`referencias` traz o padrão FEBRABAN (pasta `febraban/`, use `-Banco
febraban`), útil quando o manual do banco remete ao padrão sem repetir a regra.
