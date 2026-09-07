# Avisa a Bing y a Yandex de que las URLs del sitemap han cambiado.
#
#   powershell -ExecutionPolicy Bypass -File tools\sitio\indexnow.ps1 -Ver
#   powershell -ExecutionPolicy Bypass -File tools\sitio\indexnow.ps1
#
# Equivalente exacto de indexnow.sh, para Windows sin WSL. El .sh necesita
# mapfile, grep -oP y python3; Git Bash no trae python3, así que en Windows este
# es el camino corto. Los dos leen las URLs del mismo sitemap.xml, de modo que
# no hay dos listas que mantener ni pueden discrepar.
#
# IndexNow es un ping: en vez de esperar a que el rastreador pase —semanas en
# Bing—, le dices tú que mire, y la indexación baja a horas. Google NO participa
# en IndexNow; para Google es reenviar el sitemap en Search Console.

param([switch]$Ver)

$ErrorActionPreference = 'Stop'

$HostName = 'hachi.live'
$Clave    = 'f245e83186047476fef7a36fcd1ac763'
$Raiz     = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$Sitemap  = Join-Path $Raiz 'sitemap.xml'

$ficheroClave = Join-Path $Raiz "$Clave.txt"
if (-not (Test-Path $ficheroClave)) {
    Write-Error "Falta $Clave.txt en la raíz del repositorio."
}
if ((Get-Content $ficheroClave -Raw).Trim() -ne $Clave) {
    Write-Error "$Clave.txt no contiene la clave esperada."
}

# Las URLs salen del sitemap, igual que en la versión bash.
$urls = ([xml](Get-Content $Sitemap -Raw)).urlset.url | ForEach-Object { $_.loc }
if (-not $urls) { Write-Error "No se han encontrado <loc> en $Sitemap" }

Write-Host "$($urls.Count) URLs en el sitemap."

if ($Ver) { $urls | ForEach-Object { Write-Host "  $_" }; exit 0 }

# Antes de avisar se comprueba que la clave esté publicada en el dominio. Si no
# lo está, IndexNow responde 403 y descarta el envío entero sin decir por qué.
Write-Host -NoNewline "Comprobando https://$HostName/$Clave.txt … "
try {
    $publicada = (Invoke-WebRequest -Uri "https://$HostName/$Clave.txt" `
        -UseBasicParsing -TimeoutSec 15).Content.Trim()
} catch { $publicada = '' }

if ($publicada -ne $Clave) {
    Write-Host 'NO'
    Write-Host ''
    Write-Host 'El fichero de clave no responde con la clave. Redespliega el sitio'
    Write-Host 'y vuelve a intentarlo: sin él, IndexNow rechaza el envío con un 403.'
    exit 1
}
Write-Host 'ok'

# Un solo envío con todas las URLs, que es lo que recomienda el protocolo frente
# a un ping por URL.
$cuerpo = @{
    host        = $HostName
    key         = $Clave
    keyLocation = "https://$HostName/$Clave.txt"
    urlList     = @($urls)
} | ConvertTo-Json -Compress

foreach ($punto in @('https://api.indexnow.org/indexnow', 'https://www.bing.com/indexnow')) {
    Write-Host -NoNewline "→ $punto … "
    try {
        $r = Invoke-WebRequest -Uri $punto -Method Post -UseBasicParsing -TimeoutSec 30 `
            -ContentType 'application/json; charset=utf-8' -Body $cuerpo
        $codigo = [int]$r.StatusCode
    } catch {
        $codigo = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
    }
    switch ($codigo) {
        200     { Write-Host '200 · aceptado' }
        202     { Write-Host '202 · aceptado, clave pendiente de validar' }
        400     { Write-Host '400 · formato incorrecto' }
        403     { Write-Host '403 · clave no válida o no publicada' }
        422     { Write-Host "422 · alguna URL no pertenece a $HostName" }
        429     { Write-Host '429 · demasiados envíos, espera un rato' }
        0       { Write-Host 'sin respuesta (red)' }
        default { Write-Host $codigo }
    }
}

Write-Host ''
Write-Host 'Hecho. No hace falta repetirlo salvo que cambien o se añadan páginas.'
