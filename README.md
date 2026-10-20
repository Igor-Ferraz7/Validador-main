# Validador-main

Central de validadores CNAB240 por banco e Preenchedor de Remessa `.srb`.
Abra o `index.html` (no navegador, direto do disco, ou pelo GitHub Pages).

## Preenchedor de Remessa .srb

`Preenchedor_SRB.html` já abre com o template de cada banco carregado: basta
preencher os dados do cliente e clicar em **Gerar .srb**.

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

Para um banco novo, crie também `configs/<banco>.js` e inclua o `<script>`
correspondente em `Preenchedor_SRB.html`.

## Manuais oficiais

`docs/cnab/catalogo.js` lista o manual oficial de cada banco (e o padrão
FEBRABAN): versão, data, link e SHA-256. Cada validador tem o botão
**📄 Manuais oficiais**, que abre esses links (e a cópia local, quando a página
é aberta do disco).

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
