<#
  Gera templates/templates.js a partir dos templates de remessa em Placeholders/.

  O Preenchedor .srb (Preenchedor_SRB.html) carrega esse arquivo para já abrir
  com os templates prontos, sem upload. Ele é JS (e não um fetch do .TXT)
  porque, aberta direto do disco (file://), a página não pode ler outros
  arquivos; um <script src> funciona tanto no disco quanto no GitHub Pages.

  O .TXT continua sendo a fonte. Sempre que alterar um template, rode:

    powershell -ExecutionPolicy Bypass -File tools/gerar-templates.ps1

  e faça commit do .TXT junto com o templates/templates.js gerado.
#>
$ErrorActionPreference = 'Stop'

$root    = Split-Path -Parent $PSScriptRoot
$srcDir  = Join-Path $root 'Placeholders'
$outDir  = Join-Path $root 'templates'
$outFile = Join-Path $outDir 'templates.js'
$latin1  = [System.Text.Encoding]::GetEncoding(28591)  # 1 byte <-> 1 char, sem perdas

# Literal JS entre aspas simples. Bytes fora do ASCII imprimível viram \xHH,
# então qualquer conteúdo é reconstruído exatamente.
function ConvertTo-JsString([string]$s) {
  $sb = New-Object System.Text.StringBuilder
  foreach ($ch in $s.ToCharArray()) {
    $c = [int]$ch
    if ($ch -eq '\')      { [void]$sb.Append('\\') }
    elseif ($ch -eq "'")  { [void]$sb.Append("\'") }
    elseif ($c -lt 0x20 -or $c -gt 0x7E) { [void]$sb.Append(('\x{0:X2}' -f $c)) }
    else                  { [void]$sb.Append($ch) }
  }
  return "'" + $sb.ToString() + "'"
}

$files = @(Get-ChildItem -LiteralPath $srcDir -File |
  Where-Object { $_.Extension -match '^\.(txt|srb)$' } | Sort-Object Name)
if ($files.Count -eq 0) { throw "Nenhum template (.txt/.srb) encontrado em $srcDir" }

$entries = @()
foreach ($f in $files) {
  $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
  $text  = $latin1.GetString($bytes)

  # Banco: valor fixo do primeiro campo de código do banco no template.
  $m = [regex]::Match($text, '\|(?:CodOficial|BancoCompensacao)\|S\|(\d{3})\|')
  if (-not $m.Success) { throw "$($f.Name): não encontrei CodOficial/BancoCompensacao para identificar o banco." }
  $bank = $m.Groups[1].Value

  $eolName = if ($text.Contains("`r`n")) { 'CRLF' } else { 'LF' }
  $eol     = if ($eolName -eq 'CRLF') { "`r`n" } else { "`n" }
  $lines   = $text.Split([string[]]@($eol), [System.StringSplitOptions]::None)
  $finalNewline = $false
  if ($lines.Count -gt 1 -and $lines[$lines.Count - 1] -eq '') {
    $finalNewline = $true
    $lines = $lines[0..($lines.Count - 2)]
  }

  # Confere a reconstrução antes de gravar.
  $rebuilt = ($lines -join $eol) + $(if ($finalNewline) { $eol } else { '' })
  if ($rebuilt -ne $text) { throw "$($f.Name): reconstrução não bate com o original." }

  # Trava de dados do cliente. Os templates nascem de arquivos reais, com a
  # agência, a conta, o CPF/CNPJ e o nome de um cliente de verdade nos campos
  # de identificação. Este repositório é público, então nenhum desses campos
  # pode entrar com valor fixo: ou é um token <Campo_InsertIA>, ou é vazio /
  # zeros / brancos (preenchimento estrutural). Campos com FIXO=N não entram na
  # conta — quem preenche é o motor, e a coluna 11 ali é só descrição.
  $camposIdent = 'Inscricao|TipoInscricao|NomeEmpresa|Agencia|DVAgencia|CtaBanc|DVBanc|Convenio|NContBCO|OpConta|SacadorAvalista|Cedente|CPFCNPJ'
  $vazou = @()
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $p = $lines[$i] -split '\|'
    if ($p.Count -ne 13 -or $p[10] -ne 'S') { continue }
    if ($p[9] -notmatch "^($camposIdent)$") { continue }
    if ($p[11] -match '^(<\w+_InsertIA>|[0\s]*)$') { continue }
    $vazou += ("  linha {0}: {1}" -f ($i + 1), $lines[$i])
  }
  if ($vazou.Count -gt 0) {
    throw ("{0}: campo de identificação com valor fixo em vez de token — dado de cliente?`n{1}`nTroque o valor por <Campo_InsertIA> antes de versionar." -f $f.Name, ($vazou -join "`n"))
  }

  $jsLines = ($lines | ForEach-Object { '      ' + (ConvertTo-JsString $_) }) -join ",`n"
  $entries += @"
  {
    fileName: $(ConvertTo-JsString $f.Name),
    bank: '$bank',
    eol: '$eolName',
    finalNewline: $($finalNewline.ToString().ToLower()),
    bytes: $($bytes.Length),
    lines: [
$jsLines
    ]
  }
"@
  Write-Host ("{0}: banco {1}, {2} bytes, {3} linhas {4}" -f $f.Name, $bank, $bytes.Length, $lines.Count, $eolName)
}

$header = @"
/* ARQUIVO GERADO por tools/gerar-templates.ps1 — NÃO EDITE À MÃO.
 * Fonte: Placeholders/*.TXT e *.srb. Para alterar um template, edite o
 * arquivo em Placeholders/ e rode:
 *   powershell -ExecutionPolicy Bypass -File tools/gerar-templates.ps1
 */
"@

if (-not (Test-Path -LiteralPath $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
$js = $header + "`nwindow.SRB_TEMPLATES = [`n" + ($entries -join ",`n") + "`n];`n"
[System.IO.File]::WriteAllText($outFile, $js, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Gerado: $outFile"
