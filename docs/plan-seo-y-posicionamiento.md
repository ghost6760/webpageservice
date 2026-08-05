# Plan de posicionamiento de hachi.live

**Qué es este documento:** el estado real de la web hoy, por qué casi nadie la
encuentra, y el plan para que buscadores y modelos de lenguaje la citen cuando
alguien tiene el problema que Hachi resuelve.

**Verificado contra:** `main` en `2470a85` · agosto 2026.

**La restricción que ordena todo lo demás:** se publica el **espacio del
problema**, nunca el **espacio de la solución**. Ver [sección 3](#3--qué-se-publica-y-qué-no).

---

## 1 · Lo que ya está bien (y conviene no romper)

La base técnica está por encima de la media. Esto está hecho y verificado:

| Elemento | Estado |
|---|---|
| Formulario de contacto | ✅ `POST https://api.hachi.live/api/contacto` — llega de verdad |
| Precios | ✅ Unificados en **EUR** en HTML, schema y `llms.txt` |
| `llms.txt` | ✅ 150 líneas, marcado como autoritativo, con sección *Notes for AI assistants* |
| Datos estructurados | ✅ `@graph` con `Organization` + `SoftwareApplication` + `FAQPage` |
| Reseñas fabricadas | ✅ **Retiradas** (`aggregateRating` 4,8/127 y tres testimonios inventados) |
| `hreflang` | ✅ `en` / `es` / `x-default`, correcto y recíproco |
| `robots.txt` | ✅ Distingue bots que **citan** de bots que **entrenan** |
| `security.txt` | ✅ RFC 9116 |
| `manifest.json` | ✅ PWA |
| FAQ | ✅ 8 preguntas en `<details>`, **visibles y marcadas** (Google exige ambas) |

Dos aciertos que merecen mención porque casi nadie los tiene:

**El `robots.txt`** permite `ChatGPT-User`, `OAI-SearchBot`, `PerplexityBot` y
`Claude-Web` —los que leen para responder y citan— y bloquea `GPTBot` y `CCBot`
—los que recopilan en bloque sin devolver visitas—. Es exactamente la decisión
correcta para LLMO y está razonada en comentarios dentro del propio archivo.

**Las 8 preguntas del FAQ** están en `<details>/<summary>` **y** en el schema. Es
un error habitual marcar preguntas que no se ven; Google lo penaliza. Aquí está
bien hecho.

---

## 2 · Por qué casi nadie la encuentra

**Datos reales de Search Console · últimos 3 meses (descarga del 5 ago 2026):**

| | |
|---|---|
| Impresiones | **1.382** |
| Clics | **12** |
| CTR | **0,87 %** |
| Días con al menos un clic | **11 de 92** |
| Páginas indexadas | 7 · sin indexar 6 |

Y el reparto por país, que es el dato que lo explica casi todo:

| País | Impresiones | Clics |
|---|---|---|
| Estados Unidos | 396 | 1 |
| India | 86 | 3 |
| Japón | 27 | 1 |
| Suiza | 27 | 2 |
| **España** | **fuera del top 8** | — |

**Vendes en España y España no aparece.** Ese es el titular.

### 2.0 · El nombre está saturado y trae tráfico ajeno

De las 40 consultas que generan impresiones, **39 son de marca — y de marca que
no es la tuya**:

```
hachi ai (86)   hachi tech (31)   hachi (25)   ha chi   haci   hatchi
hachi with love   hachi salon   hachi express   hachi market   hachi team
hachinet   hachi-labs   hachi arg   vsinger   海野水玉 曲   aheeva …
```

Hay muchas cosas llamadas Hachi: el perro Hachikō (de ahí Japón), empresas de
tecnología en India, salones, marcas de logística. Google te muestra para todas y
**ninguna de esas personas te va a comprar**. De ahí el CTR del 0,87 % y la
posición media de 10–11 para tu propia marca: hay nueve «hachi» más relevantes.

**Una sola consulta no es de marca:** *«agentes de ia que resuelven 65 % de
conversaciones»* — 23 impresiones, posición 9,96, cero clics. Y es una frase
literal de tu propia landing, o sea que alguien la copió de algún sitio.

**Cero consultas comerciales.** Ni «chatbot clínica», ni «whatsapp api», ni
«asistente ia citas», ni «agendar citas whatsapp».

**Conclusión estratégica:** pelear por «hachi» es una batalla perdida y además
inútil. La salida no es posicionar la marca sino **el problema**: que te
encuentren por *«cómo evito que mi bot duplique citas»*, no por *«hachi»*. Eso es
exactamente lo que hace la Fase 1, y estos datos lo confirman.

### 2.0 bis · Dos subdominios internos están indexados

`crm.hachi.live` (24 impresiones) y `api.hachi.live` (3) aparecen en Google.
Son el Chatwoot y el panel de administración: **no deberían estar en el índice**.
Además hay una versión `http://hachi.live/` indexada, que debe redirigir con 301
a `https`.

Acción: `noindex` o `robots.txt` propio en ambos subdominios, y comprobar el 301
de http a https.

### 2.0 ter · El sitemap lleva ocho meses sin releerse

Search Console lo registra enviado el **19 nov 2025** y leído por última vez el
**7 dic 2025**. Con páginas nuevas conviene reenviarlo y usar IndexNow para no
esperar al siguiente rastreo.

---

El resto del diagnóstico no es «falta SEO técnico». El SEO técnico está bien. El
problema es de **superficie**.

### 2.1 · Siete URLs no compiten

```
/                        /es/
/privacy-policy.html     /es/privacy-policy.html
/terms-of-service.html   /es/terms-of-service.html
/data-deletion.html
```

Todo lo demás son anclas de la misma página. Un dominio con siete URLs, de las
que cinco son legales, **solo puede posicionar para su propia marca**. Y para
buscar tu marca hay que conocerla ya, que es justo el problema.

Google necesita una URL por intención de búsqueda. Hoy no hay ninguna que
responda a *«por qué mi bot no puede consultar la agenda»*, *«cuánto cuesta un
asistente de IA para clínica»* o *«diferencia entre WhatsApp Business y la API»*
—aunque las tres respuestas **ya están escritas** en `docs/`.

### 2.2 · Los LLM te describen en genérico porque no tienen de dónde citarte

Perplexity dice *«multi-agent AI customer service platform»*. Es correcto y
podría ser cualquiera. Para que un modelo diga *«según Hachi, el problema de X
es Y»* necesita una **fuente concreta que responda a X**. El `llms.txt` ayuda,
pero es un archivo de resumen: no es una página que se pueda enlazar ni citar.

### 2.3 · Señales de marca fragmentadas

Gemini asocia Hachi con `vickiandhachi.com`. **Confirmado: ese dominio no tiene
nada que ver con hachi.live.** No hay nada que redirigir; es otro de los muchos
«hachi» que compiten por el nombre, igual que los de la sección 2.0.

La vía es reforzar la identidad propia: `sameAs` en `Organization` apuntando a
los perfiles oficiales (LinkedIn, GitHub, X), para que los modelos tengan con qué
desambiguar. Pero conviene ser realista: **con un nombre tan repetido, la marca
nunca va a ser el canal de captación.** El canal es el problema que resuelves.

### 2.4 · Fallos técnicos menores

| # | Qué | Impacto |
|---|---|---|
| 1 | 8 de las **143** preguntas del RAG están publicadas | Alto: cada pregunta es una consulta de cola larga |
| 2 | Font Awesome desde `cdnjs.cloudflare.com` | Medio: bloquea render, penaliza LCP |
| 3 | ~1.200 líneas de CSS en línea en cada HTML (142 y 147 KB) | Medio: sin caché entre páginas |
| 4 | La versión ES comparte `og-image` con la EN | Bajo: menos clic al compartir en español |
| 5 | Sin IndexNow | Bajo, pero es gratis: indexación en horas en Bing/Yandex |

---

## 3 · Qué se publica y qué no

**La regla:** se publica lo que atrae clientes; no se publica lo que ahorra meses
de trabajo a un competidor.

| | Espacio del **problema** | Espacio de la **solución** |
|---|---|---|
| Qué es | Qué falla, cuánto cuesta, por qué las alternativas no llegan | Cómo se resuelve, dónde se impone, el método para derivarlo |
| Quién lo lee | **Clientes** | Evaluadores, inversores… y competidores |
| Si lo copian | Nada: ya saben que su producto es limitado | Te alcanzan sin pagar los meses de producción |
| Decisión | **Publicar** | **No publicar** |

### 3.1 · No se publica

- **`invariantes-cubiertas.md` completo.** No es divulgación: es una
  **especificación**. Da el enunciado, el fichero, la función y la prueba de cada
  garantía. Un equipo competente lo usa de lista de tareas.
- **`escalar-verticales-hechos-custodiados.md`.** Es **el método**. Copiar una
  invariante da un caso; copiar el método permite generarlas para siempre.
- **La compilación de bugs históricos.** Le dice al competidor dónde están las
  minas que tú ya pisaste. Es el atajo más valioso que se le puede regalar.
- **Código del patrón SAGA o del nodo de reflexión.**

Y hay una razón práctica además de la competitiva: **el cliente no lee nada de
esto**. El dueño de una clínica no va a leer 1.327 líneas de invariantes. La
audiencia real de esa página serían evaluadores técnicos, inversores y
competencia — y a los dos primeros se les llega bajo NDA, no por SEO.

### 3.2 · Sí se publica: el qué, sin el cómo

- **«57 invariantes custodiadas»** como cifra, con tres o cuatro de ejemplo
  enunciadas. La cifra y el rigor son la señal; el catálogo es la receta.
- **«Reserva idempotente con compensación»** como propiedad, sin el diagrama de
  implementación.
- **El resultado**: «no puede confirmar una cita que no existe, porque la reserva
  se ejecuta en código verificado y no en el modelo».

> ⚠️ **Corregir:** el `llms.txt` dice «63 guarded invariants». El documento fuente
> tiene **57 invariantes** (19 reagendar + 10 ventas + 16 agendar + 12
> disponibilidad) y 9 reglas de prompt. Un número que no cuadra con la fuente es
> lo primero que comprueba un lector técnico, y el argumento entero es «podemos
> demostrarlo». Poner **57**, o «57 invariantes y 9 reglas de prompt», que además
> distingue lo que el código garantiza de lo que solo pide el prompt.

### 3.3 · Aportes a la comunidad que no alimentan a la competencia

La clave: contribuir sobre el **ecosistema** (Meta, WhatsApp, RGPD, mercado), no
sobre la arquitectura de Hachi. Eso construye autoridad sin transferir ventaja.

| Aporte | Por qué es seguro | Por qué posiciona |
|---|---|---|
| **Calculadoras de retorno** | Modelo económico, no técnico | Herramienta útil que se comparte y se enlaza |
| **Test «¿qué nivel tiene tu bot?»** | Define el estándar sin decir cómo cumplirlo | Quien define la medida se vuelve la referencia |
| **Glosario de WhatsApp API en español** | Documentación de Meta, no tuya | Casi no existe en español: cola larga con poca competencia |
| **Guía de migración de número a la API** | Dolor del ecosistema, ya documentado | Alta intención: quien lo busca está a punto de decidir |
| **Guía de RGPD para clínicas** | Normativa pública | Cierra ventas y neutraliza objeciones |
| **Los tres niveles del mercado** | Análisis de mercado | Reencuadra el «eres caro» antes de que lo digan |

El **test de nivel** merece atención especial: 15–20 preguntas que cualquiera
puede hacerle a su bot actual («¿puedes decirme si tengo hueco el martes a las
5?», «cancela mi cita y dame otra»), con una tabla de qué significa cada
respuesta. No revela nada de cómo se implementa, y **quien define el examen se
convierte en la autoridad**. Es la pieza con mejor relación entre lo que aporta y
lo que no arriesga.

---

## 4 · Plan por fases

### Fase 1 · Superficie (la que desatasca)

El objetivo es pasar de 7 URLs a ~15 que respondan a intenciones concretas. Todo
el contenido **ya está escrito** en `docs/` de `multibackendopenIA`.

| # | URL | Origen | Intención que captura |
|---|---|---|---|
| 1 | `/es/calculadora.html` | ✅ **Hecha y enlazada** (nav, hero y sección ROI) | «cuánto pierdo por ausencias» |
| 2 | `/es/preguntas.html` | RAG, 143 preguntas | Decenas de consultas de cola larga |
| 3 | `/es/whatsapp-api-vs-business.html` | RAG § WhatsApp API | «diferencia whatsapp business api» |
| 4 | `/es/cuanto-cuesta-un-asistente-ia.html` | Los tres niveles | «precio chatbot clínica» |
| 5 | `/es/por-que-los-bots-de-flujo-fallan.html` | Los tres niveles | «bot no consulta agenda» |
| 6 | `/es/rgpd-clinicas-whatsapp.html` | § RGPD | «whatsapp rgpd clínica» |
| 7 | `/es/migrar-numero-whatsapp-api.html` | RAG § migración | «migrar número perder contactos» |
| 8 | `/es/test-nivel-asistente.html` | Nuevo | Herramienta compartible |

Cada una con: `FAQPage` o `HowTo` propio, `BreadcrumbList`, canónica, entrada en
`sitemap.xml` y línea en `llms.txt`.

**Regla de canónico:** el original vive **siempre en hachi.live**. Si luego se
sindica a Dev.to o Medium, con `rel=canonical` de vuelta. Si no, se construye la
autoridad de Medium en vez de la tuya — que es justo el error que hay que evitar
teniendo ya una marca fragmentada.

### Fase 2 · Archivos técnicos

| Archivo | Estado | Acción |
|---|---|---|
| `sitemap.xml` | 8 URLs | Ampliar según Fase 1; añadir `lastmod` real |
| `llms.txt` | Bueno | Corregir 63→57; añadir las URLs nuevas |
| `robots.txt` | Muy bueno | Sin cambios |
| `security.txt` | Correcto | Renovar `Expires` antes de nov 2026 |
| **`/indexnow.txt`** | ❌ Falta | Clave + ping: indexación en horas en Bing y Yandex |
| **`/feed.xml`** | ❌ Falta | RSS del blog; lo consumen agregadores y algunos rastreadores de IA |
| **`/humans.txt`** | ❌ Falta | Marginal, pero es una señal de marca más |
| **`og-image-es.png`** | ❌ Falta | Clic al compartir en español |

Y fuera del repositorio, **por comprobar y hacer**: verificar el dominio en
**Google Search Console** y **Bing Webmaster Tools**, y enviar el sitemap en
ambos. Sin eso no hay forma de saber qué está indexado ni por qué no.

### Fase 3 · Rendimiento

1. Bajar Font Awesome a local, o sustituir por SVG en línea los pocos iconos que
   se usen. Elimina la única dependencia externa.
2. Sacar el CSS a `/assets/estilos.css` compartido. Hoy 142 y 147 KB de HTML se
   descargan enteros y sin caché entre páginas — y con 8 páginas nuevas el
   problema se multiplica por ocho.

### Fase 4 · Autoridad fuera del dominio

- Directorios de herramientas de IA (Product Hunt, Futurepedia, There's An AI For
  That). Son enlaces y tráfico de referencia reales.
- Sindicar 2–3 artículos a Dev.to y LinkedIn **con canónico de vuelta**.
- Perfil de empresa consolidado (`sameAs` en `Organization`) apuntando a
  LinkedIn, GitHub y el resto. Es lo que resuelve la confusión de marca.

---

## 5 · Orden recomendado

| Prioridad | Acción | Esfuerzo | Impacto |
|---|---|---|---|
| 0 | ~~Corregir «63 invariantes» → 57~~ · ~~enlazar la calculadora~~ | — | ✅ Hecho |
| 1 | **Desindexar `crm.` y `api.hachi.live`** + 301 de http a https | 30 min | Quita ruido y superficie innecesaria |
| 2 | `/es/preguntas.html` con las 143 preguntas del RAG | Medio | **El mayor retorno de SEO** |
| 3 | Reenviar sitemap (lleva 8 meses sin releerse) + alta en Bing Webmaster | 30 min | Search Console ya está; Bing no |
| 4 | Las 3 páginas de contenido de alta intención (3, 4, 5) | Medio | Superficie de posicionamiento |
| 5 | IndexNow | 30 min | Indexación en horas, gratis |
| 6 | Test de nivel del asistente | Medio | La pieza más compartible |
| 7 | `sameAs` en `Organization` hacia los perfiles oficiales | 20 min | Desambigua entre los muchos «hachi» |
| 8 | CSS y Font Awesome a local | Medio | LCP, y se paga en cada página nueva |
| 9 | Calculadoras 2 y 3 (fuera de horario, doble reserva) | Medio | Refuerzan la primera |

Lo primero se hace en cinco minutos. Lo segundo es lo que más mueve la aguja.

---

## 6 · Cómo saber si funciona

Sin medición esto es fe. Lo mínimo:

| Métrica | Dónde | Qué significa |
|---|---|---|
| Impresiones y consultas | Search Console | Para qué te empieza a ver Google |
| URLs indexadas | Search Console | Si las páginas nuevas entran |
| Visitas desde `chat.openai.com`, `perplexity.ai` | Analítica | **La señal de LLMO**: te están citando |
| Impresiones desde **España** | Search Console | Hoy es ~0. Es la métrica que dice si el plan funciona |
| Consultas **sin la palabra «hachi»** | Search Console | Hoy es 1 de 40. Objetivo: que sean mayoría |
| Formularios enviados | `api.hachi.live` | Lo único que importa de verdad |

**Punto de partida medido (5 ago 2026):** 1.382 impresiones, 12 clics, CTR
0,87 %, España fuera del top 8, 1 consulta no-marca de 40. Cualquier plan se
juzga contra esas cifras.

Revisión mensual. Y la prueba cualitativa que vale más que cualquier panel:
preguntar cada mes a Perplexity y ChatGPT *«cómo evito que mi asistente duplique
citas»* y ver si aparece Hachi. Hoy no aparece. Ese es el objetivo.

---

## 7 · Lo que deliberadamente no vamos a hacer

- **No volver a poner `aggregateRating` ni testimonios sin verificar.** Google
  retira los resultados enriquecidos de **todo el dominio** cuando detecta reseñas
  fabricadas, y un inversor que comprueba un testimonio y lo encuentra inventado
  contamina todo lo demás, incluido lo que sí es cierto. Un cliente real
  verificable vale más que tres inventados.
- **No publicar el catálogo de invariantes ni el método.** Sección 3.1.
- **No poner las calculadoras detrás de un correo.** El resultado se enseña
  entero; el correo se ofrece después para enviar el PDF. Una herramienta con
  muro no se comparte, y compartirse es su función.
- **No prometer cifras que no se puedan sostener.** Todo supuesto va con su
  rango, con el extremo conservador por defecto, y editable. Ver
  `modelo-calculadoras-roi.md` en `multibackendopenIA`.

---

## Documentos relacionados

En `ghost6760/multibackendopenIA`:

- `docs/comercial/modelo-calculadoras-roi.md` — el modelo económico de las calculadoras
- `docs/comercial/auditoria-landing-page-2026.md` — la auditoría que originó las correcciones ya aplicadas
- `docs/comercial/los-tres-niveles-del-mercado-y-el-valor-de-hachi.md` — base de tres páginas de la Fase 1
- `docs/rag/hachi_espana_rag.txt` — 143 preguntas listas para publicar
