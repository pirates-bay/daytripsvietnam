#Requires -Version 5.1
# Downloads 21 missing hero images from Wikimedia Commons at 1200px width.
# Run from repo root. Skips files that already exist and are >50KB.

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$OutDir = "public/images"
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }

# target filename -> Wikimedia search query
$targets = [ordered]@{
    "perfume-pagoda-hero.jpg"      = "Perfume Pagoda Huong"
    "mai-chau-hero.jpg"            = "Mai Chau valley Vietnam"
    "bat-trang-hero.jpg"           = "Bat Trang pottery village"
    "duong-lam-hero.jpg"           = "Duong Lam ancient village"
    "mua-cave-hero.jpg"            = "Mua cave viewpoint Tam Coc"
    "hoa-lu-bai-dinh-hero.jpg"     = "Bai Dinh pagoda Ninh Binh"
    "lan-ha-bay-hero.jpg"          = "Lan Ha Bay"
    "lan-ha-kayak-hero.jpg"        = "kayak Ha Long Bay"
    "fansipan-hero.jpg"            = "Fansipan summit"
    "bac-ha-market-hero.jpg"       = "Bac Ha Sunday market"
    "cham-islands-hero.jpg"        = "Cu Lao Cham Vietnam"
    "cooking-class-hero.jpg"       = "pho Vietnamese soup"
    "marble-mountains-hero.jpg"    = "Marble Mountains Da Nang"
    "son-tra-hero.jpg"             = "Son Tra peninsula Lady Buddha"
    "royal-tombs-hero.jpg"         = "Tu Duc tomb Hue"
    "dmz-hero.jpg"                 = "Vinh Moc tunnels"
    "mekong-day-hero.jpg"          = "Cai Rang floating market"
    "can-gio-hero.jpg"             = "Can Gio mangrove"
    "paradise-cave-hero.jpg"       = "Paradise cave Phong Nha"
    "dalat-canyoning-hero.jpg"     = "Datanla waterfall Da Lat"
    "nha-trang-islands-hero.jpg"   = "Nha Trang bay islands"
}

# fallback queries if the primary search returns nothing good
$fallbacks = @{
    "perfume-pagoda-hero.jpg"      = "Chua Huong"
    "duong-lam-hero.jpg"           = "Mong Phu village"
    "hoa-lu-bai-dinh-hero.jpg"     = "Hoa Lu citadel"
    "cham-islands-hero.jpg"        = "Cham Islands Hoi An"
    "cooking-class-hero.jpg"       = "Vietnamese cuisine"
    "son-tra-hero.jpg"             = "Lady Buddha Da Nang"
    "dmz-hero.jpg"                 = "Khe Sanh Vietnam War"
    "mekong-day-hero.jpg"          = "Mekong Delta market Vietnam"
    "can-gio-hero.jpg"             = "Can Gio Biosphere Reserve"
    "dalat-canyoning-hero.jpg"     = "Da Lat waterfall Vietnam"
    "nha-trang-islands-hero.jpg"   = "Nha Trang beach Vietnam"
}

function Get-WikimediaImageUrl {
    param([string]$Query, [int]$Width = 1200)

    $searchUri = "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=" +
                 [uri]::EscapeDataString($Query) +
                 "&srnamespace=6&srlimit=10&format=json"

    $headers = @{ "User-Agent" = "DayTripsVietnam-ImageFetch/1.0 (https://daytripsvietnam.com)" }
    $search = Invoke-RestMethod -Uri $searchUri -Headers $headers

    foreach ($hit in $search.query.search) {
        $title = $hit.title
        if ($title -notmatch '\.(jpe?g)$') { continue }  # skip PNG/SVG/PDF
        if ($title -match '(?i)(logo|map|coat[ _-]of[ _-]arms|flag|svg|diagram|chart|poster)') { continue }

        $infoUri = "https://commons.wikimedia.org/w/api.php?action=query&titles=" +
                   [uri]::EscapeDataString($title) +
                   "&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=$Width&format=json"
        $info = Invoke-RestMethod -Uri $infoUri -Headers $headers

        $pages = $info.query.pages
        $page = $pages.PSObject.Properties | Select-Object -First 1
        $imageinfo = $page.Value.imageinfo
        if (-not $imageinfo) { continue }
        $thumb = $imageinfo[0].thumburl
        if ($thumb) { return @{ Url = $thumb; Title = $title } }
    }
    return $null
}

$success = @()
$failed = @()

foreach ($entry in $targets.GetEnumerator()) {
    $file = $entry.Key
    $query = $entry.Value
    $outPath = Join-Path $OutDir $file

    if ((Test-Path $outPath) -and ((Get-Item $outPath).Length -gt 50000)) {
        Write-Host "SKIP $file (exists, >50KB)"
        $success += $file
        continue
    }

    Write-Host "FETCH $file <- '$query'"
    $img = $null
    try { $img = Get-WikimediaImageUrl -Query $query } catch { Write-Host "  search error: $_" }

    if (-not $img -and $fallbacks.ContainsKey($file)) {
        $fb = $fallbacks[$file]
        Write-Host "  fallback <- '$fb'"
        try { $img = Get-WikimediaImageUrl -Query $fb } catch { Write-Host "  fallback error: $_" }
    }

    if (-not $img) {
        Write-Host "  FAILED: no image found" -ForegroundColor Red
        $failed += $file
        continue
    }

    try {
        $headers = @{ "User-Agent" = "DayTripsVietnam-ImageFetch/1.0 (https://daytripsvietnam.com)" }
        Invoke-WebRequest -Uri $img.Url -Headers $headers -OutFile $outPath
        $size = (Get-Item $outPath).Length
        Write-Host ("  OK {0:N0} bytes <- {1}" -f $size, $img.Title) -ForegroundColor Green
        $success += $file
    } catch {
        Write-Host "  download error: $_" -ForegroundColor Red
        $failed += $file
    }
}

Write-Host ""
Write-Host "=== DONE ==="
Write-Host ("Success: {0}" -f $success.Count)
Write-Host ("Failed:  {0}" -f $failed.Count)
if ($failed) { Write-Host "Missing: $($failed -join ', ')" }
