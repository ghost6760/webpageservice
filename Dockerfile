# hachi.live: nginx sirviendo SOLO lo público.
#
# Por qué existe: con Nixpacks en modo estático, Coolify copiaba el repositorio
# entero al nginx y https://hachi.live/docs/… se podía descargar, docs/audit/
# incluido. Aquí:
#   1. .dockerignore deja fuera docs/, tools/, .git y los .md;
#   2. deploy/nginx.conf devuelve 404 a esas rutas aunque algo se colara;
#   3. la construcción FALLA si docs/ o tools/ llegan a la imagen.
# Detalle y pasos en Coolify: docs/pseo-paginas-por-sector.md §10.

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/deploy \
 && test ! -e /usr/share/nginx/html/docs \
 && test ! -e /usr/share/nginx/html/tools \
 && test ! -e /usr/share/nginx/html/.git \
 && test -f /usr/share/nginx/html/index.html \
 && test -f /usr/share/nginx/html/es/index.html \
 && test -f /usr/share/nginx/html/robots.txt \
 && test -f /usr/share/nginx/html/.well-known/security.txt \
 && nginx -t

EXPOSE 80
