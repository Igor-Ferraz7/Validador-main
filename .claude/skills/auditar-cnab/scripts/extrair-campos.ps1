<#
  Lista os campos que o sistema implementa, sem precisar ler o arquivo todo.

    extrair-campos.ps1 <Validador_CNAB240_X.html>
        Para cada função de registro/segmento (vHA, vHL, vSA, ..., vTA): os
        campos validados via CF(ctx,'rótulo',ini,fim,...), com a linha no
        código. Aponta:
          - rótulo cuja posição "(a–b)" difere dos argumentos ini/fim;
          - posições 1–240 sem nenhum campo (lacunas) e sobreposições;
          - chamadas CF com posição calculada (precisam de leitura manual).

    extrair-campos.ps1 <Placeholders/ARQUIVO.TXT>
        Para cada bloco do template .srb (|HEARQ| ... |/HEARQ|): REG,
        posições, campo, fixo (S/N) e valor; com lacunas/sobreposições.

  -Funcao vSA   limita a uma função (validador) ou bloco (template).

    extrair-campos.ps1 <Validador_CNAB240_X.html> -Buscar 'chkCNPJ|\\d\{14\}'
        Em vez da tabela: linhas que casam com a regex, com o número da linha
        e a função onde estão (ex.: onde o código trata CNPJ, GARE, um código
        de domínio).
#>
param(
  [Parameter(Mandatory = $true)][string]$Arquivo,
  [string]$Funcao = '',
  [string]$Buscar = ''
)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $Arquivo)) { throw "Arquivo não encontrado: $Arquivo" }

# Faixas 1..240 não cobertas e posições cobertas por mais de um campo.
function Get-Cobertura($campos) {
  $uso = New-Object int[] 241
  foreach ($c in $campos) { for ($p = [Math]::Max(1, $c.ini); $p -le [Math]::Min(240, $c.fim); $p++) { $uso[$p]++ } }
  $faixas = { param($pred)
    $out = @(); $ini = 0
    for ($p = 1; $p -le 241; $p++) {
      $ok = ($p -le 240) -and (& $pred $uso[$p])
      if ($ok -and -not $ini) { $ini = $p }
      if (-not $ok -and $ini) { $out += $(if ($ini -eq $p - 1) { "$ini" } else { "$ini-$($p - 1)" }); $ini = 0 }
    }
    $out
  }
  [pscustomobject]@{
    lacunas = & $faixas { param($n) $n -eq 0 }
    sobrepos = & $faixas { param($n) $n -gt 1 }
  }
}

function Write-Cobertura($campos) {
  $cob = Get-Cobertura $campos
  if ($cob.lacunas)  { Write-Output ("  lacunas (sem campo): " + ($cob.lacunas -join ', ')) }
  if ($cob.sobrepos) { Write-Output ("  sobreposições: " + ($cob.sobrepos -join ', ')) }
}

$ext = [System.IO.Path]::GetExtension($Arquivo).ToLower()
$linhas = [System.IO.File]::ReadAllLines((Resolve-Path -LiteralPath $Arquivo), [System.Text.Encoding]::UTF8)

if ($Buscar) {
  $re = [regex]::new($Buscar, 'IgnoreCase'); $fn = '-'; $n = 0
  for ($i = 0; $i -lt $linhas.Length; $i++) {
    $m = [regex]::Match($linhas[$i], '^\s*function\s+(\w+)\s*\(')
    if ($m.Success) { $fn = $m.Groups[1].Value }
    if ($re.IsMatch($linhas[$i])) {
      $n++
      $t = $linhas[$i].Trim(); if ($t.Length -gt 170) { $t = $t.Substring(0, 167) + '...' }
      Write-Output ("L{0,-5} [{1}] {2}" -f ($i + 1), $fn, $t)
    }
  }
  if (-not $n) { Write-Output 'Nenhuma ocorrência.' }
  exit
}

if ($ext -eq '.html' -or $ext -eq '.htm') {
  # Agrupa pelo nome real da função que contém o CF: além de vHA, vSA...,
  # há validações feitas dentro de validate() (ex.: segmentos de retorno).
  $reFn  = [regex]'^\s*function\s+(\w+)\s*\('
  $reCF  = [regex]"CF\(ctx,\s*(['""``])(.*?)\1\s*,\s*([^,]+?)\s*,\s*([^,]+?)\s*,"
  $rePos = [regex]'\((\d+)\s*(?:[–\-]\s*(\d+))?\)\s*$'
  $grupos = [ordered]@{}; $atual = $null; $linhaFn = 0; $dinamicos = @()
  for ($i = 0; $i -lt $linhas.Length; $i++) {
    $m = $reFn.Match($linhas[$i])
    if ($m.Success) { $atual = $m.Groups[1].Value; $linhaFn = $i + 1; if ($atual -eq 'CF') { $atual = $null }; continue }
    if (-not $atual) { continue }
    $cfs = $reCF.Matches($linhas[$i])
    if ($cfs.Count -and -not $grupos.Contains($atual)) { $grupos[$atual] = [pscustomobject]@{ linha = $linhaFn; campos = @() } }
    foreach ($c in $cfs) {
      $rot = $c.Groups[2].Value; $a = $c.Groups[3].Value; $b = $c.Groups[4].Value
      if ($a -notmatch '^\d+$' -or $b -notmatch '^\d+$') { $dinamicos += "${atual}: L$($i + 1) $rot ($a, $b)"; continue }
      $campo = [pscustomobject]@{ rotulo = $rot; ini = [int]$a; fim = [int]$b; linha = $i + 1; aviso = '' }
      $pm = $rePos.Match($rot)
      if ($pm.Success) {
        $ri = [int]$pm.Groups[1].Value
        $rf = if ($pm.Groups[2].Success) { [int]$pm.Groups[2].Value } else { $ri }
        if ($ri -ne $campo.ini -or $rf -ne $campo.fim) { $campo.aviso = "  << rótulo diz $ri-$rf" }
      }
      $grupos[$atual].campos += $campo
    }
  }
  if ($grupos.Count -eq 0) { Write-Output 'Nenhuma função de validação (function vXxx) encontrada.'; exit }
  foreach ($k in $grupos.Keys) {
    if ($Funcao -and $k -ne $Funcao) { continue }
    $g = $grupos[$k]
    Write-Output "## $k (linha $($g.linha)) — $($g.campos.Count) campos"
    foreach ($c in ($g.campos | Sort-Object ini, fim)) {
      Write-Output ("  {0,3}-{1,-3} L{2,-5} {3}{4}" -f $c.ini, $c.fim, $c.linha, $c.rotulo, $c.aviso)
    }
    if ($g.campos.Count) { Write-Cobertura $g.campos }
  }
  if ($dinamicos) { Write-Output "`n## CF com posição calculada (ler no código)"; $dinamicos | ForEach-Object { "  $_" } }
}
else {
  # Template .srb: |REG|TIPO|POS_INI|POS_FIM|ALINHA|CHAR_PAD|CASA_DEC|MULT|NOME|FIXO|VALOR|
  $bloco = $null; $campos = @()
  $fecha = {
    if ($bloco -and (-not $Funcao -or $bloco -eq $Funcao)) {
      Write-Output "## $bloco — $($campos.Count) campos"
      foreach ($c in $campos) { Write-Output ("  {0,3}-{1,-3} L{2,-4} {3,-22} fixo={4} valor={5}" -f $c.ini, $c.fim, $c.linha, $c.nome, $c.fixo, $c.valor) }
      if ($campos.Count) { Write-Cobertura $campos }
    }
  }
  for ($i = 0; $i -lt $linhas.Length; $i++) {
    $l = $linhas[$i]
    if ($l -match '^\|/(\w+)\|\s*$') { & $fecha; $bloco = $null; $campos = @(); continue }
    if ($l -match '^\|(\w+)\|\s*$')  { $bloco = $Matches[1]; $campos = @(); continue }
    if (-not $bloco) { continue }
    $p = $l.Split('|')
    if ($p.Length -lt 13 -or $p[3] -notmatch '^\d+$' -or $p[4] -notmatch '^\d+$') { continue }
    $v = $p[11]; if ($v.Length -gt 28) { $v = $v.Substring(0, 25) + '...' }
    $campos += [pscustomobject]@{ ini = [int]$p[3]; fim = [int]$p[4]; linha = $i + 1; nome = $p[9]; fixo = $p[10]; valor = "'$v'" }
  }
}
