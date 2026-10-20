<#
  Navega no texto dos manuais (docs/cnab/<pasta>/*.txt) sem carregar o
  manual inteiro: os .txt têm de 100 a 600 KB.

    buscar-manual.ps1 -Banco 033
        Documento(s) do banco: versão, nº de páginas e as linhas de sumário.

    buscar-manual.ps1 -Banco 033 -Padrao 'Segmento A'
        Páginas onde o padrão (regex, sem diferenciar maiúsculas) aparece,
        com até 3 linhas de contexto por página.

    buscar-manual.ps1 -Banco 033 -Pagina 21,22
        Texto completo das páginas pedidas.

  -Banco aceita o código (001, 033, ...) ou 'febraban'.
  -Documento filtra pelo nome do arquivo quando o banco tem mais de um.
  -Max limita quantas páginas a busca lista (padrão 15).
  -Bruto mantém os espaços de alinhamento do pdftotext; por padrão, sequências
   longas de espaços viram dois espaços (economiza tokens e ainda separa as
   colunas das tabelas).

  Os .txt são gerados por tools/baixar-docs.ps1.
#>
param(
  [Parameter(Mandatory = $true)][string]$Banco,
  [string]$Padrao = '',
  [int[]]$Pagina = @(),
  [string]$Documento = '',
  [int]$Max = 15,
  [switch]$Bruto
)
$ErrorActionPreference = 'Stop'

$root    = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..')).Path
$docsDir = Join-Path $root 'docs\cnab'
$raw  = [System.IO.File]::ReadAllText((Join-Path $docsDir 'catalogo.js'), [System.Text.Encoding]::UTF8)
$cat  = $raw.Substring($raw.IndexOf('{'), $raw.LastIndexOf('}') - $raw.IndexOf('{') + 1) | ConvertFrom-Json

$grupo = $null
foreach ($b in $cat.bancos) { if ($b.codigo -eq $Banco) { $grupo = $b } }
foreach ($r in $cat.referencias) { if ($r.nome.ToLower() -eq $Banco.ToLower()) { $grupo = $r } }
if (-not $grupo) { throw "Banco '$Banco' não está em docs/cnab/catalogo.js." }

$docs = @($grupo.documentos | Where-Object { -not $Documento -or $_.arquivo -like "*$Documento*" })
if ($docs.Count -eq 0) { throw "Nenhum documento de '$Banco' corresponde a '$Documento'." }

function Compact([string]$s) {
  if ($Bruto) { return $s.TrimEnd() }
  return ($s -replace '\s{3,}', '  ').Trim()
}

foreach ($d in $docs) {
  $txt = Join-Path (Join-Path $docsDir $grupo.pasta) ([System.IO.Path]::ChangeExtension($d.arquivo, '.txt'))
  if (-not (Test-Path -LiteralPath $txt)) {
    throw "Texto não encontrado: $txt`nRode: powershell -ExecutionPolicy Bypass -File tools/baixar-docs.ps1 -Banco $Banco"
  }
  # pdftotext separa as páginas com form feed (\f).
  $paginas = [System.IO.File]::ReadAllText($txt, [System.Text.Encoding]::UTF8).Split([char]12)
  if ($paginas.Length -gt 1 -and $paginas[-1].Trim() -eq '') { $paginas = $paginas[0..($paginas.Length - 2)] }
  $n = $paginas.Length
  Write-Output "# $($d.titulo) — versão $($d.versao) ($($d.data)) — $n páginas — $($d.arquivo)"

  if ($Pagina.Count) {
    foreach ($pg in $Pagina) {
      if ($pg -lt 1 -or $pg -gt $n) { Write-Output "(página $pg não existe)"; continue }
      Write-Output "`n=== página $pg/$n ==="
      $vazias = 0
      foreach ($l in $paginas[$pg - 1].Split("`n")) {
        $c = Compact $l
        if ($c -eq '') { $vazias++; if ($vazias -gt 1) { continue } } else { $vazias = 0 }
        Write-Output $c
      }
    }
  }
  elseif ($Padrao) {
    $re = [regex]::new($Padrao, 'IgnoreCase')
    $achadas = 0; $total = 0
    for ($i = 0; $i -lt $n; $i++) {
      $hits = @($paginas[$i].Split("`n") | Where-Object { $re.IsMatch($_) })
      if (-not $hits.Count) { continue }
      $total++
      if ($achadas -ge $Max) { continue }
      $achadas++
      Write-Output ("p.{0}: " -f ($i + 1))
      $hits | Select-Object -First 3 | ForEach-Object { Write-Output ("    " + (Compact $_)) }
      if ($hits.Count -gt 3) { Write-Output "    (+$($hits.Count - 3) ocorrências nesta página)" }
    }
    if ($total -eq 0) { Write-Output 'Nenhuma ocorrência.' }
    elseif ($total -gt $achadas) { Write-Output "... $total páginas no total; use -Max para ver mais." }
  }
  else {
    # Sumário: nas primeiras páginas, linhas com texto que terminam no número
    # da página após pontilhado ou após um bloco de espaços.
    $lim = [Math]::Min(6, $n); $nSum = 0
    for ($i = 0; $i -lt $lim; $i++) {
      foreach ($l in $paginas[$i].Split("`n")) {
        if ($l -match '[A-Za-zÀ-ú]{3}.*?(\.{4,}|\s{3,})\d{1,3}\s*$') {
          $nSum++
          Write-Output ("  " + ((Compact $l) -replace '\s*\.{4,}\s*', ' … '))
        }
      }
    }
    if (-not $nSum) { Write-Output "  (sem sumário nas primeiras páginas; tente -Padrao 'segmento|header|trailer|hist[oó]rico')" }
  }
}
