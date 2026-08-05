# Indexación: qué hacer y en qué orden

Guía operativa. Lo que hay en el repositorio ya está hecho; **esto es lo que
tienes que hacer tú a mano**, porque requiere entrar a paneles con tu cuenta.

> ⚠️ **Antes de nada: redespliega el sitio.** Todo lo de abajo lee ficheros del
> dominio en vivo. Si `hachi.live/sitemap.xml` todavía devuelve la versión de 7
> URLs, Search Console te va a indexar la lista vieja.
>
> Comprueba que ha subido:
> ```bash
> curl -s https://hachi.live/sitemap.xml | grep -c "<loc>"      # debe dar 17
> curl -s https://hachi.live/faq.html | head -2                 # debe existir
> curl -s https://hachi.live/f245e83186047476fef7a36fcd1ac763.txt
> ```

---

## 1 · Reenviar el sitemap en Google Search Console

Search Console lo tiene registrado como enviado el **19 nov 2025** y leído por
última vez el **7 dic 2025**. Ocho meses sin releerse: las páginas nuevas no
existen para Google hasta que vuelva a mirarlo.

1. Entra en <https://search.google.com/search-console>.
2. Arriba a la izquierda, **selecciona la propiedad `hachi.live`**. Si tienes
   varias (dominio y prefijo de URL), usa la de **dominio**; si no la tienes,
   sirve la de `https://hachi.live/`.
3. En el menú lateral: **Indexación → Sitemaps**.
4. Verás `sitemap.xml` en «Sitemaps enviados». **No lo borres.**
5. En «Añadir un sitemap nuevo», escribe `sitemap.xml` y pulsa **Enviar**.
   Reenviar el mismo no duplica nada: fuerza una relectura.
6. El estado pasará a «Correcto» en unos minutos. El número de «Páginas
   descubiertas» tarda de horas a días en actualizarse — es normal, no lo
   reenvíes otra vez.

### Además, fuerza las tres o cuatro más importantes

El sitemap es una sugerencia; la inspección de URL es una petición directa.

1. En la barra de arriba, pega la URL completa, por ejemplo
   `https://hachi.live/es/preguntas.html`, y pulsa Intro.
2. Espera a que diga «La URL no está en Google».
3. Pulsa **Solicitar indexación**.
4. Repite con:
   - `https://hachi.live/faq.html`
   - `https://hachi.live/es/cuanto-cuesta-un-asistente-ia.html`
   - `https://hachi.live/how-much-does-an-ai-assistant-cost.html`

Hay un límite diario (unas 10-12 al día). Empieza por esas cuatro; el resto
llega por el sitemap.

---

## 2 · Dar de alta Bing Webmaster Tools

No lo tienes, y es gratis. Bing alimenta también a **ChatGPT cuando busca en
la web**, así que importa más de lo que su cuota de mercado sugiere.

1. Entra en <https://www.bing.com/webmasters>.
2. **Importar desde Google Search Console** — es la opción rápida: autorizas y
   se trae el dominio ya verificado, sin tocar DNS.
   Si prefieres no conectar cuentas, añade el sitio a mano y verifica con el
   fichero XML que te da (súbelo a la raíz del repositorio).
3. Una vez dentro: **Sitemaps → Enviar sitemap** →
   `https://hachi.live/sitemap.xml`.

---

## 3 · IndexNow (ya está montado, sólo hay que dispararlo)

IndexNow es un aviso instantáneo a **Bing y Yandex**: en vez de esperar a que
pase el rastreador, les dices tú que miren. Baja la indexación de semanas a
horas. **Google no participa** — para Google es lo del punto 1.

Ya está todo en el repositorio: la clave publicada en la raíz y el script que
lee las URLs del propio `sitemap.xml`.

```bash
# desde el repositorio, con el sitio ya redesplegado
bash tools/sitio/indexnow.sh
```

El script comprueba primero que la clave esté publicada en el dominio —si no lo
está, IndexNow rechaza el envío entero con un 403 y no avisa— y después manda
las 17 URLs de una vez.

Repítelo sólo cuando publiques o cambies páginas.

---

## 4 · Lo que NO hay que enviar a ninguna parte

Esta es la duda que más se repite.

| Fichero | ¿Se envía a algún panel? |
|---|---|
| `sitemap.xml` | **Sí** — Search Console y Bing (puntos 1 y 2) |
| `robots.txt` | **No.** Los rastreadores lo leen solos en cada visita |
| `llms.txt` | **No.** No hay ningún panel donde registrarlo |
| `security.txt` | **No.** Se lee de `/.well-known/` cuando hace falta |
| `manifest.json` | **No.** Lo lee el navegador desde el `<link>` del HTML |

Sobre **`llms.txt` conviene ser preciso**, porque hay mucha confusión: no es un
estándar que ningún modelo lea automáticamente, y **no existe ningún sitio donde
darlo de alta**. Es un resumen en markdown para que un modelo que *ya* está
leyendo tu web encuentre los datos autoritativos —precios, planes, límites— sin
tener que deducirlos del HTML. Sirve cuando ChatGPT o Perplexity entran a
responder una pregunta sobre Hachi. Lo que hace que entren es el punto 1, el 2 y
que el `robots.txt` no los bloquee.

---

## 5 · Comprobar que ha quedado bien

Con el sitio desplegado:

```bash
curl -s https://hachi.live/robots.txt | grep Sitemap
curl -s -o /dev/null -w '%{http_code}\n' https://hachi.live/llms.txt          # 200
curl -s -o /dev/null -w '%{http_code}\n' https://hachi.live/.well-known/security.txt  # 200
curl -s -o /dev/null -w '%{http_code}\n' https://hachi.live/faq.html          # 200
```

Y desde el repositorio, sin necesidad de red:

```bash
node tools/sitio/archivos.js      # coherencia entre robots, llms, sitemap e IndexNow
node tools/sitio/alcanzables.js   # que se pueda llegar a todo navegando
```

### Herramientas externas que merecen los cinco minutos

- **Prueba de resultados enriquecidos** de Google —
  <https://search.google.com/test/rich-results> — pega
  `https://hachi.live/es/preguntas.html` y comprueba que detecta el `FAQPage`
  con sus 75 preguntas.
- **Validador de schema** — <https://validator.schema.org/>.
- **Comprobador de hreflang** — cualquiera sirve; lo que importa es que los
  pares se declaren en los dos sentidos, que es lo que ya verifica
  `tools/paginas/verificar.js`.

---

## 6 · Lo que sigue pendiente y depende de ti

### 6.1 · `sameAs`: los perfiles oficiales

Es el punto **más importante** que queda, y no puedo hacerlo yo porque hacen
falta URLs reales.

El `Organization` de las dos portadas declara hoy:

```json
"sameAs": ["https://hachi.live"]
```

Apuntarse a uno mismo no informa de nada. `sameAs` sirve para que un buscador o
un modelo **desambigüe entre entidades que se llaman igual** — y ese es
exactamente tu problema: en Search Console, 39 de las 40 consultas de marca son
de *otros* Hachi (hachi tech, hachi salon, hachi express). Gemini llegó a
asociar la marca con un dominio que no tiene nada que ver.

Pásame las URLs que existan de verdad —LinkedIn de empresa, GitHub, X, Crunchbase,
la ficha de Google Business— y las pongo. **No las invento**: un `sameAs` a un
perfil que no existe o que no controlas es peor que no tenerlo.

### 6.2 · Desindexar los subdominios

Search Console muestra `crm.hachi.live` (24 impresiones) y `api.hachi.live` (3)
indexados. Ninguno debería estar en Google: uno es el panel de clientes y el
otro la API.

La solución no está en este repositorio, sino en la configuración de esos dos
servicios: servir en cada uno un `robots.txt` propio con

```
User-agent: *
Disallow: /
```

o una cabecera `X-Robots-Tag: noindex` en las respuestas.

### 6.3 · Redirección de `http` a `https`

Hay una versión `http://hachi.live/` indexada. Debe responder **301** a la
`https`. Se configura en el proxy o en Coolify, no en el repositorio.

### 6.4 · Opcionales, por orden de lo que aportan

| Qué | Aporta | Cuesta |
|---|---|---|
| `og-image-es.png` propia | Más clic al compartir en español; hoy comparte la inglesa | Diseño |
| `feed.xml` (RSS) | Lo consumen agregadores y algún rastreador de IA | Bajo, pero con 8 páginas casi estáticas aporta poco hasta que haya blog |
| `humans.txt` | Señal de marca menor | Testimonial |
| CSS y tipografías a local | LCP; hoy Font Awesome viene de un CDN externo | Medio, y se paga en cada página nueva |

---

## Resumen: tu lista

- [ ] Redesplegar y comprobar que `sitemap.xml` devuelve 17 URLs
- [ ] Reenviar el sitemap en Search Console
- [ ] Solicitar indexación de las 4 páginas principales
- [ ] Dar de alta Bing Webmaster Tools y enviar el sitemap
- [x] Ejecutar `bash tools/sitio/indexnow.sh` ✅ 17 URLs enviadas, aceptado (202) por api.indexnow.org y Bing
- [x] Pasarme los perfiles oficiales para el `sameAs` ✅ hecho en el commit `bd8f354` (LinkedIn empresa, GitHub y LinkedIn del fundador en ambas portadas)
- [ ] `noindex` en `crm.` y `api.hachi.live`
- [ ] Comprobar el 301 de `http` a `https`
