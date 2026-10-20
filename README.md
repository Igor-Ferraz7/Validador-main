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
