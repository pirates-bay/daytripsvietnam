# Retry pass for transport hero images — uses a Wikimedia-compliant
# User-Agent (contact URL + email) and longer 3s delays to stay under the
# 429/robot-policy thresholds that blocked the first run.
#
# Only downloads files that don't already exist on disk.

$ErrorActionPreference = "Stop"
$OutDir = Join-Path $PSScriptRoot "..\public\images"
$OutDir = [System.IO.Path]::GetFullPath($OutDir)

# Wikimedia User-Agent policy requires a descriptive UA with contact info.
$UserAgent = "DayTripsVietnamHeroFetcher/1.0 (https://daytripsvietnam.com/; editorial@daytripsvietnam.com)"

# Tighter / better queries for the ones that failed or matched poorly.
$targets = [ordered]@{
  "vietnam-flights-hero.jpg"        = "Tan Son Nhat Airport terminal"
  "grab-vietnam-hero.jpg"           = "Motorbike taxi Ho Chi Minh City"
  "motorbike-rental-hero.jpg"       = "Ha Giang loop motorbike"
  "vietnam-trains-hero.jpg"         = "SE train Vietnam Railways"
  "vietnam-airlines-hero.jpg"       = "Vietnam Airlines Boeing 787-9"
  "bamboo-airways-hero.jpg"         = "Bamboo Airways A321"
  "futa-bus-hero.jpg"               = "Phuong Trang bus Vietnam"
  "sinh-tourist-hero.jpg"           = "Open tour bus Vietnam"
  "route-hanoi-hcmc-hero.jpg"       = "Bitexco Financial Tower Ho Chi Minh City"
  "route-hanoi-da-nang-hero.jpg"    = "Dragon Bridge Da Nang"
  "route-hanoi-hoi-an-hero.jpg"     = "Hoi An ancient town lanterns"
  "route-hanoi-hue-hero.jpg"        = "Imperial City Hue Ngo Mon"
  "route-hanoi-sapa-hero.jpg"       = "Sa Pa rice terraces Vietnam"
  "route-hanoi-ha-long-hero.jpg"    = "Ha Long Bay limestone islands"
  "route-hanoi-ninh-binh-hero.jpg"  = "Trang An Ninh Binh boats"
  "route-da-nang-hue-hero.jpg"      = "Hai Van Pass road"
  "route-da-nang-hoi-an-hero.jpg"   = "Hoi An Japanese Bridge"
  "route-hoi-an-hue-hero.jpg"       = "Lang Co beach Vietnam"
  "route-hcmc-da-nang-hero.jpg"     = "My Khe Beach Da Nang"
  "route-hcmc-phu-quoc-hero.jpg"    = "Phu Quoc beach Vietnam"
}

$fallbacks = [ordered]@{
  "vietnam-flights-hero.jpg"        = "Noi Bai Airport Terminal 2"
  "grab-vietnam-hero.jpg"           = "Motorbike Hanoi"
  "motorbike-rental-hero.jpg"       = "Scooter rental Vietnam"
  "vietnam-trains-hero.jpg"         = "Train Hanoi"
  "vietnam-airlines-hero.jpg"       = "Vietnam Airlines aircraft"
  "bamboo-airways-hero.jpg"         = "Bamboo Airways Boeing"
  "futa-bus-hero.jpg"               = "Intercity bus Vietnam"
  "sinh-tourist-hero.jpg"           = "Sinh Cafe tourist Vietnam"
  "route-hanoi-hcmc-hero.jpg"       = "Ho Chi Minh City skyline"
  "route-hanoi-da-nang-hero.jpg"    = "Da Nang skyline"
  "route-hanoi-hoi-an-hero.jpg"     = "Hoi An old town"
  "route-hanoi-hue-hero.jpg"        = "Hue citadel"
  "route-hanoi-sapa-hero.jpg"       = "Sapa Vietnam"
  "route-hanoi-ha-long-hero.jpg"    = "Halong Bay boat"
  "route-hanoi-ninh-binh-hero.jpg"  = "Ninh Binh landscape"
  "route-da-nang-hue-hero.jpg"      = "Hai Van pass viewpoint"
  "route-da-nang-hoi-an-hero.jpg"   = "Hoi An river boats"
  "route-hoi-an-hue-hero.jpg"       = "Central Vietnam coast"
  "route-hcmc-da-nang-hero.jpg"     = "Da Nang coastline"
  "route-hcmc-phu-quoc-hero.jpg"    = "Phu Quoc sunset"
}

function Invoke-Commons {
  param([string]$Query, [int]$Attempt = 1)
  $url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=5&gsrsearch=" + [uri]::EscapeDataString($Query) + "&prop=imageinfo&iiprop=url&iiurlwidth=1200"
  Start-Sleep -Seconds 3
  try {
    return Invoke-RestMethod -Uri $url -UserAgent $UserAgent -TimeoutSec 30 -Headers @{"Accept" = "application/json"}
  } catch {
    $msg = $_.Exception.Message
    Write-Host "  ! API error (attempt $Attempt): $msg" -ForegroundColor Yellow
    if ($Attempt -lt 3 -and $msg -match "429") {
      $backoff = 15 * $Attempt
      Write-Host "  . backing off ${backoff}s" -ForegroundColor DarkGray
      Start-Sleep -Seconds $backoff
      return Invoke-Commons -Query $Query -Attempt ($Attempt + 1)
    }
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
      # Skip specimen / scientific photos that happen to mention Vietnam
      if ($name -match "(specimen|MHNT|dorsal|ventral|holotype)") { continue }
      if ($info.thumburl) { return $info.thumburl }
      if ($info.url) { return $info.url }
    }
  }
  return $null
}

function Save-Image {
  param([string]$Url, [string]$Dest, [int]$Attempt = 1)
  Start-Sleep -Seconds 3
  try {
    Invoke-WebRequest -Uri $Url -UserAgent $UserAgent -OutFile $Dest -TimeoutSec 60
    return $true
  } catch {
    $msg = $_.Exception.Message
    Write-Host "  ! download error (attempt $Attempt): $msg" -ForegroundColor Yellow
    if ($Attempt -lt 3 -and $msg -match "429") {
      $backoff = 20 * $Attempt
      Write-Host "  . backing off ${backoff}s" -ForegroundColor DarkGray
      Start-Sleep -Seconds $backoff
      return Save-Image -Url $Url -Dest $Dest -Attempt ($Attempt + 1)
    }
    return $false
  }
}

$success = 0
$failed = @()

foreach ($entry in $targets.GetEnumerator()) {
  $filename = $entry.Key
  $query = $entry.Value
  $dest = Join-Path $OutDir $filename

  if (Test-Path $dest) {
    Write-Host "[skip] $filename" -ForegroundColor DarkGray
    $success++
    continue
  }

  Write-Host "[fetch] $filename  <-  `"$query`"" -ForegroundColor Cyan
  $resp = Invoke-Commons -Query $query
  $thumb = Get-ThumbUrl -Response $resp

  if (-not $thumb -and $fallbacks.Contains($filename)) {
    $fb = $fallbacks[$filename]
    Write-Host "  ~ fallback: `"$fb`"" -ForegroundColor Yellow
    $resp = Invoke-Commons -Query $fb
    $thumb = Get-ThumbUrl -Response $resp
  }

  if (-not $thumb) {
    Write-Host "  x no usable result" -ForegroundColor Red
    $failed += $filename
    continue
  }

  $ok = Save-Image -Url $thumb -Dest $dest
  if (-not $ok) {
    $failed += $filename
    continue
  }

  $size = (Get-Item $dest).Length
  if ($size -lt 5000) {
    Remove-Item $dest -Force
    Write-Host "  x too small ($size bytes)" -ForegroundColor Red
    $failed += $filename
    continue
  }
  Write-Host "  ok ($([math]::Round($size/1024)) KB)" -ForegroundColor Green
  $success++
}

Write-Host ""
Write-Host "=== retry done ===" -ForegroundColor White
Write-Host "  success: $success / $($targets.Count)" -ForegroundColor Green
if ($failed.Count -gt 0) {
  Write-Host "  failed:" -ForegroundColor Red
  $failed | ForEach-Object { Write-Host "    - $_" -ForegroundColor Red }
  exit 1
}
