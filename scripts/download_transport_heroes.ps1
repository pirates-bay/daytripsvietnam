# Download hero images for /transport/ articles from Wikimedia Commons.
#
# Uses the Commons search API to find a topical file, then downloads a
# 1200px-wide thumbnail into public/images/. A Start-Sleep of 1500ms
# between API calls avoids the 429 rate limit we hit on the previous batch.
#
# Usage:
#   pwsh -ExecutionPolicy Bypass -File scripts/download_transport_heroes.ps1
#
# Safe to re-run: if a file already exists on disk, it is skipped.

$ErrorActionPreference = "Stop"
$OutDir = Join-Path $PSScriptRoot "..\public\images"
$OutDir = [System.IO.Path]::GetFullPath($OutDir)
$UserAgent = "daytripsvietnam.com hero-image fetcher (editorial)"

# Primary search query per filename.
$targets = [ordered]@{
  # Pillar + modes
  "vietnam-transport-hero.jpg"      = "Traffic Hanoi Vietnam"
  "vietnam-flights-hero.jpg"        = "Noi Bai International Airport"
  "vietnam-trains-hero.jpg"         = "Reunification Express train Vietnam"
  "sleeper-bus-hero.jpg"            = "Vietnam sleeper bus"
  "grab-vietnam-hero.jpg"           = "Grab motorbike Vietnam"
  "motorbike-rental-hero.jpg"       = "Motorbike Ha Giang loop Vietnam"

  # Brands
  "vietnam-airlines-hero.jpg"       = "Vietnam Airlines Boeing 787"
  "vietjet-hero.jpg"                = "VietJet Air Airbus A321"
  "bamboo-airways-hero.jpg"         = "Bamboo Airways Airbus"
  "vietnam-railways-hero.jpg"       = "Hanoi railway station"
  "futa-bus-hero.jpg"               = "Phuong Trang FUTA bus"
  "sinh-tourist-hero.jpg"           = "Sinh Tourist office Ho Chi Minh City"

  # Routes
  "route-hanoi-hcmc-hero.jpg"       = "Ho Chi Minh City skyline night"
  "route-hanoi-da-nang-hero.jpg"    = "Da Nang Dragon Bridge"
  "route-hanoi-hoi-an-hero.jpg"     = "Hoi An lanterns ancient town"
  "route-hanoi-hue-hero.jpg"        = "Hue Imperial City Ngo Mon"
  "route-hanoi-sapa-hero.jpg"       = "Sapa rice terraces"
  "route-hanoi-ha-long-hero.jpg"    = "Ha Long Bay karst"
  "route-hanoi-ninh-binh-hero.jpg"  = "Tam Coc Ninh Binh"
  "route-da-nang-hue-hero.jpg"      = "Hai Van Pass Vietnam"
  "route-da-nang-hoi-an-hero.jpg"   = "Hoi An Japanese covered bridge"
  "route-hoi-an-hue-hero.jpg"       = "Lang Co Bay Vietnam"
  "route-hcmc-da-nang-hero.jpg"     = "My Khe Beach Da Nang"
  "route-hcmc-phu-quoc-hero.jpg"    = "Phu Quoc island beach"
}

# Fallback queries if the primary returns nothing usable.
$fallbacks = [ordered]@{
  "vietnam-transport-hero.jpg"      = "Motorbike traffic Ho Chi Minh City"
  "vietnam-flights-hero.jpg"        = "Tan Son Nhat International Airport"
  "vietnam-trains-hero.jpg"         = "Vietnam Railways locomotive"
  "sleeper-bus-hero.jpg"            = "Long-distance bus Vietnam"
  "grab-vietnam-hero.jpg"           = "Taxi Hanoi Vietnam"
  "motorbike-rental-hero.jpg"       = "Scooter Vietnam street"
  "vietnam-airlines-hero.jpg"       = "Vietnam Airlines Airbus"
  "vietjet-hero.jpg"                = "VietJet Air aircraft"
  "bamboo-airways-hero.jpg"         = "Bamboo Airways aircraft"
  "vietnam-railways-hero.jpg"       = "Saigon railway station"
  "futa-bus-hero.jpg"               = "Futa bus Vietnam"
  "sinh-tourist-hero.jpg"           = "Tour bus Vietnam"
  "route-hanoi-hcmc-hero.jpg"       = "Saigon skyline"
  "route-hanoi-da-nang-hero.jpg"    = "Da Nang beach"
  "route-hanoi-hoi-an-hero.jpg"     = "Hoi An old town"
  "route-hanoi-hue-hero.jpg"        = "Hue citadel"
  "route-hanoi-sapa-hero.jpg"       = "Lao Cai railway station"
  "route-hanoi-ha-long-hero.jpg"    = "Halong Bay boat"
  "route-hanoi-ninh-binh-hero.jpg"  = "Trang An Ninh Binh"
  "route-da-nang-hue-hero.jpg"      = "Marble Mountains Da Nang"
  "route-da-nang-hoi-an-hero.jpg"   = "Hoi An river"
  "route-hoi-an-hue-hero.jpg"       = "Central Vietnam coast"
  "route-hcmc-da-nang-hero.jpg"     = "Da Nang My Khe"
  "route-hcmc-phu-quoc-hero.jpg"    = "Phu Quoc beach sunset"
}

function Invoke-Commons {
  param([string]$Query)
  $url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=5&gsrsearch=" + [uri]::EscapeDataString($Query) + "&prop=imageinfo&iiprop=url&iiurlwidth=1200"
  Start-Sleep -Milliseconds 1500
  try {
    return Invoke-RestMethod -Uri $url -UserAgent $UserAgent -TimeoutSec 30
  } catch {
    Write-Host "  ! API error: $($_.Exception.Message)" -ForegroundColor Yellow
    Start-Sleep -Seconds 3
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
      # Skip non-photo / low-value formats
      if ($name -match "\.(svg|pdf|ogg|webm|tif|tiff|gif)$") { continue }
      if ($info.thumburl) { return $info.thumburl }
      if ($info.url) { return $info.url }
    }
  }
  return $null
}

$success = 0
$failed = @()

foreach ($entry in $targets.GetEnumerator()) {
  $filename = $entry.Key
  $query = $entry.Value
  $dest = Join-Path $OutDir $filename

  if (Test-Path $dest) {
    Write-Host "[skip] $filename already exists" -ForegroundColor DarkGray
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

  try {
    Start-Sleep -Milliseconds 1500
    Invoke-WebRequest -Uri $thumb -UserAgent $UserAgent -OutFile $dest -TimeoutSec 60
    $size = (Get-Item $dest).Length
    if ($size -lt 5000) {
      Remove-Item $dest -Force
      throw "too small ($size bytes)"
    }
    Write-Host "  ok ($([math]::Round($size/1024)) KB) <- $thumb" -ForegroundColor Green
    $success++
  } catch {
    Write-Host "  x download failed: $($_.Exception.Message)" -ForegroundColor Red
    $failed += $filename
  }
}

Write-Host ""
Write-Host "=== done ===" -ForegroundColor White
Write-Host "  success: $success / $($targets.Count)" -ForegroundColor Green
if ($failed.Count -gt 0) {
  Write-Host "  failed:" -ForegroundColor Red
  $failed | ForEach-Object { Write-Host "    - $_" -ForegroundColor Red }
  exit 1
}
