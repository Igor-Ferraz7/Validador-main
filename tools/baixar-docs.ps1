<#
  Baixa (ou verifica) os manuais oficiais listados em docs/cnab/catalogo.js.

    powershell -ExecutionPolicy Bypass -File tools/baixar-docs.ps1
        Baixa todos os PDFs para docs/cnab/<pasta>/ e gera o .txt de cada um
        (texto extraído com pdftotext, usado pela skill de auditoria).

    powershell -ExecutionPolicy Bypass -File tools/baixar-docs.ps1 -Verificar
        Não baixa nada: consulta só o cabeçalho HTTP de cada URL e aponta
        documentos que mudaram de tamanho (provável nova versão) ou saíram do ar.

    -Banco 033    limita a um banco (código) ou a "febraban".

  Um PDF baixado cujo SHA-256 difere do catálogo NÃO sobrescreve a cópia
  atual: é salvo como <arquivo>.NOVO.pdf para revisão. Depois de revisar,
  atualize versão/arquivo/bytes/sha256 no catálogo.

  Os PDFs e .txt ficam fora do git (.gitignore): não republicamos material
  dos bancos no repositório público.
#>
param(
  [switch]$Verificar,
  [string]$Banco = ''
)
$ErrorActionPreference = 'Stop'

$root    = Split-Path -Parent $PSScriptRoot
$docsDir = Join-Path $root 'docs\cnab'
$catFile = Join-Path $docsDir 'catalogo.js'
$ua      = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'

# catalogo.js = comentário + "window.CNAB_DOCS = { JSON };"
$raw  = [System.IO.File]::ReadAllText($catFile, [System.Text.Encoding]::UTF8)
$json = $raw.Substring($raw.IndexOf('{'), $raw.LastIndexOf('}') - $raw.IndexOf('{') + 1)
$cat  = $json | ConvertFrom-Json

$grupos = @()
foreach ($b in $cat.bancos)      { $grupos += [pscustomobject]@{ id = $b.codigo; nome = $b.nome; pasta = $b.pasta; docs = $b.documentos } }
foreach ($r in $cat.referencias) { $grupos += [pscustomobject]@{ id = $r.nome.ToLower(); nome = $r.nome; pasta = $r.pasta; docs = $r.documentos } }
if ($Banco) { $grupos = @($grupos | Where-Object { $_.id -eq $Banco.ToLower() }) }
if ($grupos.Count -eq 0) { throw "Nenhum banco '$Banco' no catálogo." }

function Find-PdfToText {
  $c = Get-Command pdftotext -ErrorAction SilentlyContinue
  if ($c) { return $c.Source }
  $pk = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
  $hit = Get-ChildItem $pk -Recurse -Filter pdftotext.exe -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($hit) { return $hit.FullName }
  return $null
}
$pdftotext = if ($Verificar) { $null } else { Find-PdfToText }
if (-not $Verificar -and -not $pdftotext) {
  Write-Warning 'pdftotext não encontrado: os .txt não serão gerados. Instale com: winget install oschwartz10612.Poppler'
}

# Pede só o 1º byte (Range) em vez de HEAD: alguns sites (ex.: BB) recusam
# HEAD. O tamanho total vem do Content-Range (206) ou do Content-Length (200).
function Get-Head([string]$url) {
  $h = @{ status = ''; bytes = $null; modified = '' }
  $lines = & curl.exe -sL -A $ua --max-time 60 -r 0-0 -D - -o NUL $url 2>$null
  foreach ($l in $lines) {
    if ($l -match '^HTTP/\S+\s+(\d+)')                         { $h.status = $Matches[1]; $h.bytes = $null }
    elseif ($l -match '^(?i)content-range:\s*bytes [^/]*/(\d+)') { $h.bytes = [long]$Matches[1] }
    elseif ($l -match '^(?i)content-length:\s*(\d+)' -and $h.status -eq '200') { $h.bytes = [long]$Matches[1] }
    elseif ($l -match '^(?i)last-modified:\s*(.+)$')            { $h.modified = $Matches[1].Trim() }
  }
  if ($h.status -eq '206') { $h.status = '200' }
  return $h
}

# A partir daqui os programas externos (curl, pdftotext) podem escrever avisos
# no stderr; no Windows PowerShell 5.1 isso viraria erro fatal com 'Stop'.
# As falhas são tratadas pelo código de saída.
$ErrorActionPreference = 'Continue'

$problemas = 0
foreach ($g in $grupos) {
  $dir = Join-Path $docsDir $g.pasta
  if (-not $Verificar -and -not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

  foreach ($d in $g.docs) {
    $dest  = Join-Path $dir $d.arquivo
    $label = "[$($g.nome)] $($d.arquivo)"

    if ($Verificar) {
      $h = Get-Head $d.url
      if ($h.status -ne '200') {
        $problemas++
        Write-Host "INACESSÍVEL ($($h.status))  $label`n    $($d.url)"
      } elseif ($d.bytes -and $h.bytes -and $h.bytes -ne $d.bytes) {
        $problemas++
        Write-Host "MUDOU       $label  (catálogo $($d.bytes) bytes, site $($h.bytes) bytes; $($h.modified)) — provável nova versão"
      } else {
        Write-Host "OK          $label  ($($h.bytes) bytes; $($h.modified))"
      }
      continue
    }

    $tmp = "$dest.download"
    & curl.exe -fsSL -A $ua --max-time 180 -o $tmp $d.url 2>$null
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $tmp)) {
      $problemas++
      Remove-Item -LiteralPath $tmp -ErrorAction SilentlyContinue
      Write-Host "FALHOU      $label  — baixe manualmente:`n    $($d.url)`n    e salve como: $dest"
      continue
    }
    $head = [System.IO.File]::ReadAllBytes($tmp)[0..3]
    if ([System.Text.Encoding]::ASCII.GetString($head) -ne '%PDF') {
      $problemas++
      Remove-Item -LiteralPath $tmp
      Write-Host "NÃO É PDF   $label  — o site devolveu outra coisa (bloqueio?). Baixe manualmente:`n    $($d.url)"
      continue
    }

    $hash  = (Get-FileHash -Algorithm SHA256 -LiteralPath $tmp).Hash.ToLower()
    $bytes = (Get-Item -LiteralPath $tmp).Length
    if ($d.sha256 -and $hash -ne $d.sha256) {
      $problemas++
      $novo = [System.IO.Path]::ChangeExtension($dest, '.NOVO.pdf')
      Move-Item -LiteralPath $tmp -Destination $novo -Force
      Write-Host "MUDOU       $label  — o banco publicou outro arquivo. Salvo para revisão em:`n    $novo  ($bytes bytes, sha256 $hash)"
      $dest = $novo
    } else {
      Move-Item -LiteralPath $tmp -Destination $dest -Force
      $st = if ($d.sha256) { 'OK         ' } else { 'BAIXADO    ' }
      Write-Host "$st $label  ($bytes bytes, sha256 $hash)"
    }

    if ($pdftotext) {
      & $pdftotext -layout -enc UTF-8 $dest ([System.IO.Path]::ChangeExtension($dest, '.txt')) 2>$null
    }
  }
}

if ($problemas) { Write-Host "`n$problemas item(ns) precisam de atenção." } else { Write-Host "`nTudo em dia." }
