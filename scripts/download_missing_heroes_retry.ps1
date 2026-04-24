#Requires -Version 5.1
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
$OutDir = "public/images"

# remaining 7 with better queries
$targets = [ordered]@{
    "mai-chau-hero.jpg"            = "Mai Chau Hoa Binh"
    "mua-cave-hero.jpg"            = "Hang Mua"
    "mekong-day-hero.jpg"          = "Cai Rang floating market"
    "can-gio-hero.jpg"             = "Can Gio mangrove forest"
    "paradise-cave-hero.jpg"       = "Thien Duong cave"
    "dalat-canyoning-hero.jpg"     = "Datanla waterfall"
    "nha-trang-islands-hero.jpg"   = "Nha Trang beach"
}

$fallbacks = @{
    "mai-chau-hero.jpg"          = "Mai Chau valley"
    "mua-cave-hero.jpg"          = "Mua cave Ninh Binh"
    "mekong-day-hero.jpg"        = "Mekong Delta Vietnam boat"
    "can-gio-hero.jpg"           = "Can Gio Biosphere"
    "paradise-cave-hero.jpg"     = "Phong Nha Ke Bang cave"
    "dalat-canyoning-hero.jpg"   = "Pongour waterfall"
    "nha-trang-islands-hero.jpg" = "Hon Mun Nha Trang"
}

function Get-WikimediaImageUrl {
    param([string]$Query, [int]$Width = 1200)
    $searchUri = "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=" +
                 [uri]::EscapeDataString($Query) + "&srnamespace=6&srlimit=10&format=json"
    $headers = @{ "User-Agent" = "DayTripsVietnam-ImageFetch/1.0 (https://daytripsvietnam.com)" }
    $search = Invoke-RestMethod -Uri $searchUri -Headers $headers
    Start-Sleep -Milliseconds 1500
    foreach ($hit in $search.query.search) {
        $title = $hit.title
        if ($title -notmatch '\.(jpe?g)$') { continue }
        if ($title -match '(?i)(logo|map|coat[ _-]of[ _-]arms|flag|svg|diagram|chart|poster)') { continue }
        $infoUri = "https://commons.wikimedia.org/w/api.php?action=query&titles=" +
                   [uri]::EscapeDataString($title) +
                   "&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=$Width&format=json"
        $info = Invoke-RestMethod -Uri $infoUri -Headers $headers
        Start-Sleep -Milliseconds 1500
        $page = $info.query.pages.PSObject.Properties | Select-Object -First 1
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
        Write-Host "SKIP $file"
        $success += $file
        continue
    }

    Write-Host "FETCH $file <- '$query'"
    $img = $null
    try { $img = Get-WikimediaImageUrl -Query $query } catch { Write-Host "  err: $($_.Exception.Message)" }

    if (-not $img -and $fallbacks.ContainsKey($file)) {
        $fb = $fallbacks[$file]
        Write-Host "  fallback <- '$fb'"
        try { $img = Get-WikimediaImageUrl -Query $fb } catch { Write-Host "  err: $($_.Exception.Message)" }
    }

    if (-not $img) {
        Write-Host "  FAILED" -ForegroundColor Red
        $failed += $file
        continue
    }

    try {
        $headers = @{ "User-Agent" = "DayTripsVietnam-ImageFetch/1.0 (https://daytripsvietnam.com)" }
        Invoke-WebRequest -Uri $img.Url -Headers $headers -OutFile $outPath
        Start-Sleep -Milliseconds 1500
        $size = (Get-Item $outPath).Length
        Write-Host ("  OK {0:N0} <- {1}" -f $size, $img.Title) -ForegroundColor Green
        $success += $file
    } catch {
        Write-Host "  download err: $($_.Exception.Message)" -ForegroundColor Red
        $failed += $file
    }
}

Write-Host ""
Write-Host "Success: $($success.Count), Failed: $($failed.Count)"
if ($failed) { Write-Host "Still missing: $($failed -join ', ')" }
