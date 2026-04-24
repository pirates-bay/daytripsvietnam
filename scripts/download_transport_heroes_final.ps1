# Final pass — pick up the last couple of stragglers that the first two
# queries couldn't resolve (motorbike-rental-hero, sinh-tourist-hero).

$ErrorActionPreference = "Stop"
$OutDir = Join-Path $PSScriptRoot "..\public\images"
$OutDir = [System.IO.Path]::GetFullPath($OutDir)
$UserAgent = "DayTripsVietnamHeroFetcher/1.0 (https://daytripsvietnam.com/; editorial@daytripsvietnam.com)"

$targets = [ordered]@{
  "motorbike-rental-hero.jpg" = @("Scooter Hanoi street", "Motorbike Vietnam", "Honda Wave Vietnam", "Vietnam traffic motorbikes")
  "sinh-tourist-hero.jpg"     = @("Tour bus Vietnam", "Coach bus Vietnam", "Tourist bus Ho Chi Minh City", "Bus Hanoi")
}

function Invoke-Commons {
  param([string]$Query)
  $url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=" + [uri]::EscapeDataString($Query) + "&prop=imageinfo&iiprop=url&iiurlwidth=1200"
  Start-Sleep -Seconds 3
  try {
    return Invoke-RestMethod -Uri $url -UserAgent $UserAgent -TimeoutSec 30
  } catch {
    Write-Host "  ! API error: $($_.Exception.Message)" -ForegroundColor Yellow
    return $null
  }
}

function Get-ThumbUrl {
  param($Response)
  if ($null -eq $Response -or $null -eq $Response.query -or $null -eq $Response.query.pages) { return $null }
  foreach ($page in $Response.query.pages.PSObject.Properties.Value) {
    if ($page.imageinfo -and $page.imageinfo.Count -gt 0) {
      $info = $page.imageinfo[0]
      $name = ($page.title -replace "^File:", "").ToLower()
      if ($name -match "\.(svg|pdf|ogg|webm|tif|tiff|gif)$") { continue }
      if ($name -match "(specimen|MHNT|dorsal|ventral|holotype)") { continue }
      if ($info.thumburl) { return $info.thumburl }
      if ($info.url) { return $info.url }
    }
  }
  return $null
}

$failed = @()
foreach ($entry in $targets.GetEnumerator()) {
  $filename = $entry.Key
  $queries = $entry.Value
  $dest = Join-Path $OutDir $filename

  if (Test-Path $dest) {
    Write-Host "[skip] $filename" -ForegroundColor DarkGray
    continue
  }

  $thumb = $null
  foreach ($q in $queries) {
    Write-Host "[try] $filename  <-  `"$q`"" -ForegroundColor Cyan
    $resp = Invoke-Commons -Query $q
    $thumb = Get-ThumbUrl -Response $resp
    if ($thumb) { break }
  }

  if (-not $thumb) {
    Write-Host "  x all queries failed" -ForegroundColor Red
    $failed += $filename
    continue
  }

  Start-Sleep -Seconds 3
  try {
    Invoke-WebRequest -Uri $thumb -UserAgent $UserAgent -OutFile $dest -TimeoutSec 60
    $size = (Get-Item $dest).Length
    if ($size -lt 5000) {
      Remove-Item $dest -Force
      throw "too small ($size bytes)"
    }
    Write-Host "  ok ($([math]::Round($size/1024)) KB) <- $thumb" -ForegroundColor Green
  } catch {
    Write-Host "  x download failed: $($_.Exception.Message)" -ForegroundColor Red
    $failed += $filename
  }
}

if ($failed.Count -gt 0) {
  Write-Host ""
  Write-Host "still failed:" -ForegroundColor Red
  $failed | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
  exit 1
}
Write-Host ""
Write-Host "all good" -ForegroundColor Green
