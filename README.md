# Validador-main

Central de validadores CNAB240 por banco e Preenchedor de Remessa `.srb`.
Abra o `index.html` (no navegador, direto do disco, ou pelo GitHub Pages).

## Preenchedor de Remessa .srb

`Preenchedor_SRB.html` já abre com o template de cada banco carregado: basta
escolher o banco, preencher os dados do cliente e clicar em **Gerar .srb**.
Templates disponíveis: Itaú, Santander, Sicoob e Sicredi. A página assume o
logo, a cor e os manuais oficiais do banco escolhido e lembra o último banco
usado no navegador.

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

Para um banco novo, crie também `configs/<banco>.js` (regras de cada token,
nome, logo e cor; use os existentes como modelo) e inclua o `<script>`
correspondente em `Preenchedor_SRB.html`. O banco do template é identificado
pelo campo `CodOficial` (ou `BancoCompensacao`) do próprio arquivo.

## Analisador de Retorno (Santander)

`Retorno_CNAB240_Santander.html` lê um arquivo de retorno do Santander
(Pagamento a Fornecedores) e diz se ele é:

- **retorno de crítica** (o "pré-retorno"): o banco só aceitou ou recusou os
  registros. Ocorrências BD/BE (agendado), B1–B8 (bloqueado), BF (excluído)
  ou erros. Nada foi pago ainda;
- **retorno de movimento** (o definitivo): o banco informa o resultado do
  pagamento. Só a ocorrência 00 ou 03 confirma o pagamento; 01/02 e ZA indicam
  que não foi pago ou foi devolvido.

O header não diferencia os dois (posição 143 = 2 em ambos); a decisão vem das
ocorrências de cada registro (posições 231–240), do segmento Z (autenticação)
e do aviso de débito no trailer de lote. Base: manual Santander V11.7, itens
2.6 e 5, p. 4 e nota G020. A página mostra o status de cada pagamento e exporta
um CSV para a baixa. O arquivo é lido só no navegador.

## Manuais oficiais

`docs/cnab/catalogo.js` lista o manual oficial de cada banco (e o padrão
FEBRABAN): versão, data, link e SHA-256. Cada validador tem o botão
**📄 Manuais oficiais**, que abre esses links (e a cópia local, quando a página
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
