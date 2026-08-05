#!/usr/bin/env bash
#
# Avisa a Bing y a Yandex de que las URLs del sitemap han cambiado.
#
#   bash tools/sitio/indexnow.sh          # envía todas las URLs del sitemap
#   bash tools/sitio/indexnow.sh --ver    # sólo enseña qué enviaría
#
# IndexNow es un ping: en vez de esperar a que el rastreador pase —que en Bing
# puede tardar semanas—, le dices tú que mire. La indexación suele bajar a
# horas. Google NO participa en IndexNow; para Google es Search Console.
#
# Requisito: el fichero de clave tiene que estar publicado en la raíz del
# dominio y contener exactamente la clave. Ya está en el repositorio.

set -euo pipefail

HOST="hachi.live"
CLAVE="f245e83186047476fef7a36fcd1ac763"
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SITEMAP="$RAIZ/sitemap.xml"

if [[ ! -f "$RAIZ/$CLAVE.txt" ]]; then
  echo "ERROR: falta $CLAVE.txt en la raíz del repositorio." >&2
  exit 1
fi

if [[ "$(cat "$RAIZ/$CLAVE.txt")" != "$CLAVE" ]]; then
  echo "ERROR: $CLAVE.txt no contiene la clave esperada." >&2
  exit 1
fi

# Las URLs salen del sitemap para que no haya dos listas que mantener.
mapfile -t URLS < <(grep -oP '(?<=<loc>)[^<]+' "$SITEMAP")

if [[ ${#URLS[@]} -eq 0 ]]; then
  echo "ERROR: no se han encontrado <loc> en $SITEMAP" >&2
  exit 1
fi

echo "${#URLS[@]} URLs en el sitemap."

if [[ "${1:-}" == "--ver" ]]; then
  printf '  %s\n' "${URLS[@]}"
  exit 0
fi

# Antes de avisar, se comprueba que la clave esté realmente publicada. Si no lo
# está, IndexNow responde 403 y el envío entero se descarta en silencio.
echo -n "Comprobando https://$HOST/$CLAVE.txt … "
publicada="$(curl -fsS --max-time 15 "https://$HOST/$CLAVE.txt" 2>/dev/null || true)"
if [[ "$publicada" != "$CLAVE" ]]; then
  echo "NO"
  echo
  echo "El fichero de clave no responde con la clave. Redespliega el sitio y"
  echo "vuelve a intentarlo — sin él, IndexNow rechaza el envío con un 403."
  exit 1
fi
echo "ok"

# El cuerpo JSON: un solo envío con todas las URLs, que es lo que recomienda el
# protocolo frente a un ping por URL.
cuerpo="$(printf '%s\n' "${URLS[@]}" | python3 -c '
import json, sys
urls = [l.strip() for l in sys.stdin if l.strip()]
print(json.dumps({
    "host": "'"$HOST"'",
    "key": "'"$CLAVE"'",
    "keyLocation": "https://'"$HOST"'/'"$CLAVE"'.txt",
    "urlList": urls
}))')"

for punto in "https://api.indexnow.org/indexnow" "https://www.bing.com/indexnow"; do
  echo -n "→ $punto … "
  codigo="$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 \
    -X POST "$punto" \
    -H 'Content-Type: application/json; charset=utf-8' \
    --data "$cuerpo" || echo '000')"
  case "$codigo" in
    200) echo "200 · aceptado" ;;
    202) echo "202 · aceptado, clave pendiente de validar" ;;
    400) echo "400 · formato incorrecto" ;;
    403) echo "403 · clave no válida o no publicada" ;;
    422) echo "422 · alguna URL no pertenece a $HOST" ;;
    429) echo "429 · demasiados envíos, espera un rato" ;;
    000) echo "sin respuesta (red)" ;;
    *)   echo "$codigo" ;;
  esac
done

echo
echo "Hecho. No hace falta repetirlo salvo que cambien o se añadan páginas."
