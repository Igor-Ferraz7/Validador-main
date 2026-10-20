# Manuais oficiais CNAB 240

Manuais de layout publicados por cada banco (e o padrão FEBRABAN), usados
como referência pelos validadores e pela skill de auditoria
(`.claude/skills/auditar-cnab`).

**Para entender o que mudou** entre a versão em que cada validador se baseia e
a versão atual de cada banco, leia
[diferencas-entre-versoes.md](diferencas-entre-versoes.md).

| Pasta | Conteúdo |
|---|---|
| `catalogo.js` | Lista de manuais: título, versão, data, link oficial, tamanho e SHA-256. **Fonte única** para o botão "Manuais oficiais" dos validadores, o script de download e a skill. |
| `<código>-<banco>/` | PDFs do banco e o `.txt` extraído de cada um. |
| `febraban/` | Padrão FEBRABAN CNAB 240 (base comum a todos os bancos). |
| `relatorios/` | Relatórios gerados pela skill de auditoria. |

## Os PDFs não vão para o git

O repositório é público e publicado pelo GitHub Pages; versionar os PDFs
significaria republicar material dos bancos. Por isso eles (e os `.txt`)
estão no `.gitignore` e ficam só no disco. Nas páginas publicadas, o botão
"Manuais oficiais" aponta para o site de cada banco.

## Baixar ou atualizar

```
powershell -ExecutionPolicy Bypass -File tools/baixar-docs.ps1
```

Baixa tudo, confere o SHA-256 contra o catálogo e gera o `.txt` de cada PDF
(requer `pdftotext`: `winget install oschwartz10612.Poppler`). Se um banco
publicou um arquivo diferente, ele **não** sobrescreve a cópia atual: é salvo
como `<arquivo>.NOVO.pdf` para revisão.

Para só checar se algum banco publicou versão nova, sem baixar:

```
powershell -ExecutionPolicy Bypass -File tools/baixar-docs.ps1 -Verificar
```

Ao adotar uma versão nova, atualize no `catalogo.js` os campos `versao`,
`data`, `arquivo`, `bytes` e `sha256` do documento.

## Lacunas conhecidas

- **Itaú:** o único SISPAG publicado em domínio oficial é de out/2020, mais
  antigo que a v086 (02/2024) em que o validador se baseia. Se tiver o PDF da
  v086 fornecido pelo banco, coloque-o em `341-itau/` e cadastre-o no catálogo.
- **Sicoob:** desde a v3.3 as regras de Folha de Pagamento estão num guia
  separado, que ainda não está no catálogo (o validador valida Folha).
- **Banco do Brasil:** a versão de nov/2020, base do validador, não está mais
  no site oficial, e o manual não traz histórico de alterações.
