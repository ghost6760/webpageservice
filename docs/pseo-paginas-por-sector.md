# SEO programático (pSEO): páginas por sector

> **Qué es este documento.** La guía de la estrategia de páginas por sector: por
> qué se hizo así, qué hay publicado, qué falta, qué indexar y en qué orden, y
> cómo seguir creciendo sin que Google penalice el bloque. Es un documento de
> trabajo: **no es una página del sitio** (ver §10: cómo se evita que `docs/`
> se sirva).
>
> Empezado el 25-09-2026. Actualízalo cada vez que se publique una tanda o se
> tome una decisión; el historial está en §12.

---

## 0 · En 30 segundos

| | |
|---|---|
| **Estrategia** | Una página por **sector × mercado**, escrita a mano, con su propio contenido. **No** páginas por ciudad (todavía) |
| **Publicado** | 11 sectores × 2 idiomas = **22 páginas** + **2 índices** (commit `8452ff0`, 25-09-2026) |
| **Mercados** | Español → España y Latinoamérica · Inglés → Estados Unidos |
| **Sitemap** | De 17 a **41 URLs** |
| **Indexación** | 10 solicitudes al día en Search Console → plan de 3 días en §5 |
| **Siguiente** | Indexar (§5) → medir 3-6 semanas (§6) → segunda tanda de sectores (§7) |
| **Lo que no se puede romper** | §9: ni una «doorway page», ni una promesa que el producto no cumple |

---

## 1 · La estrategia y por qué es así

### 1.1 · El problema que resuelve

Search Console decía (ver `plan-seo-y-posicionamiento.md` §2): **39 de 40
búsquedas que traen impresiones son de marca** —y de marcas ajenas llamadas
«hachi»—, y ninguna es comercial. Pelear por «hachi» es inútil. Hay que aparecer
por **el problema**, y el problema tiene apellido de sector: nadie busca
«recepcionista con IA», busca «recepcionista para veterinaria» o «quién me coge
el teléfono del taller».

Las búsquedas por sector tienen poca competencia y mucha intención de compra. Por
eso el pSEO (páginas generadas desde una plantilla, una por intención de
búsqueda) encaja.

### 1.2 · Lo que proponía Gemini y lo que se decidió

Gemini propuso **sector × ciudad** (`/veterinarias/miami`, `/talleres/san-antonio`).
Se decidió **sector × mercado**, sin ciudades, por esto:

- **Política de Google de marzo de 2024 («scaled content abuse»).** Páginas
  hechas en serie para posicionar, sin valor propio, se tratan como spam y
  pueden sacar del índice **el bloque entero**, no solo la página.
- **Hachi no tiene nada local** en Miami ni en San Antonio: ni oficina, ni
  clientes, ni número de allí. `/veterinarias/miami` y `/veterinarias/houston`
  dirían lo mismo con otro nombre. Los «datos locales» que sugería Gemini (un
  prefijo telefónico local, estadísticas por ciudad) o no existen o habría que
  inventarlos.
- **Los sectores sí son distintos de verdad**, porque el producto cambia de
  verdad: el vocabulario («paciente», «mascota», «vehículo»), qué se agenda, qué
  urgencias hay, qué datos se piden antes de reservar, qué plan encaja y cuánto
  vale una cita.

El eje geográfico existe, pero es el **mercado**, no la ciudad: cambian el
idioma, la moneda, el canal (SMS en EE. UU.) y la ley (RGPD, HIPAA).

### 1.3 · Mercados

| Idioma de la página | Mercado | Moneda | Canales que se anuncian | Ley que se menciona |
|---|---|---|---|---|
| Español (`/es/sectores/`) | España + Latinoamérica | € (con la línea de LatAm en USD) | WhatsApp, Messenger, teléfono | RGPD |
| Inglés (`/industries/`) | Estados Unidos | USD | **SMS**, WhatsApp, teléfono | HIPAA (para decir que no firmamos BAA) |

---

## 2 · Qué se publicó (25-09-2026)

### 2.1 · Las 24 URLs

Índices:

- `https://hachi.live/es/sectores/`
- `https://hachi.live/industries/`

Sectores (plan recomendado y cuántas citas salvadas al mes pagan la cuota, con
el ticket y el margen de ejemplo que usa cada página):

| Sector | Español (España/LatAm) | Inglés (EE. UU.) | ES: plan · citas | EN: plan · citas |
|---|---|---|---|---|
| Medicina estética | `/es/sectores/medicina-estetica.html` | `/industries/med-spas.html` | Clínica Completa · 9 citas (180 €, 65 %) | Complete · 6 ($350, 65 %) |
| Clínicas dentales | `/es/sectores/clinicas-dentales.html` | `/industries/dental-practices.html` | Profesional · 10 citas (120 €, 60 %) | Professional · 7 ($200, 60 %) |
| Clínicas veterinarias | `/es/sectores/veterinarias.html` | `/industries/veterinary-clinics.html` | Profesional · 20 citas (60 €, 60 %) | Professional · 10 ($150, 55 %) |
| Fisioterapia | `/es/sectores/fisioterapia.html` | `/industries/physical-therapy.html` | Esencial · 13 citas (45 €, 70 %) | Essential · 6 ($120, 70 %) |
| Psicología | `/es/sectores/psicologos.html` | `/industries/therapists.html` | Autónomo · 3 citas (60 €, 85 %) | Solo · 2 ($150, 85 %) |
| Peluquerías y barberías | `/es/sectores/peluquerias-y-barberias.html` | `/industries/hair-salons-and-barbershops.html` | Por Cita · 3 citas (30 €, 70 %) | Pay-per-booking · 3 ($45, 70 %) |
| Centros de belleza y uñas | `/es/sectores/centros-de-belleza-y-unas.html` | `/industries/beauty-and-nail-salons.html` | Esencial · 18 citas (35 €, 65 %) | Essential · 15 ($50, 65 %) |
| Spas y centros de masajes | `/es/sectores/spas-y-masajes.html` | `/industries/spas-and-massage.html` | Esencial · 9 citas (70 €, 65 %) | Essential · 6 ($120, 65 %) |
| Talleres mecánicos | `/es/sectores/talleres-mecanicos.html` | `/industries/auto-repair-shops.html` | Profesional · 8 citas (250 €, 35 %) | Professional · 6 ($450, 35 %) |
| Clínicas capilares y de láser | `/es/sectores/clinicas-capilares-y-laser.html` | `/industries/hair-restoration-and-laser-clinics.html` | Clínica Completa · 11 citas (150 €, 60 %) | Complete · 8 ($250, 60 %) |
| Fontaneros, electricistas y mantenimiento | `/es/sectores/fontaneros-electricistas-y-mantenimiento.html` | `/industries/plumbers-electricians-and-home-services.html` | Profesional · 12 citas (120 €, 50 %) | Professional · 6 ($300, 50 %) |

> Las cifras de «citas» no se teclean: las calcula `generar.js` a partir del
> ticket, el margen y la cuota de `mercados.js`. Si cambia un precio, cambian solas.

### 2.2 · Qué lleva cada página (y por qué cada bloque)

| Bloque | Qué es | Por qué lo lleva |
|---|---|---|
| Lo que se pierde hoy | 3 dolores del sector, con sus palabras | Es lo que la persona busca; conecta con su búsqueda |
| Así contesta Hachi | Una conversación de ejemplo del sector | Contenido único por página, y enseña el producto sin demo |
| Qué hace Hachi en… | 5-6 capacidades aplicadas a ese negocio | Solo capacidades reales (§9) |
| Lo que el código impide en… | 3 guardrails, los que más pesan ahí | El diferencial frente a los bots; Gemini no lo mencionaba |
| ¿Cuándo se paga solo? | Citas salvadas que pagan la cuota | Cuenta honesta, enlaza a la calculadora |
| Qué plan te encaja | Plan, precio del mercado, alternativa y precios del otro mercado | Precio visible = menos fricción; sale de `mercados.js` |
| Preguntas frecuentes | 4 preguntas propias del sector | Cola larga + marcado `FAQPage` para Google |
| Otros sectores | 3 vecinos + índice | Enlazado interno en silo |

Cada página lleva además `Service` + `FAQPage` + `BreadcrumbList` en JSON-LD,
`canonical` propio, `hreflang` recíproco con su pareja del otro idioma y
`x-default` a la versión inglesa.

### 2.3 · Cómo se enlazan (arquitectura en silo)

```
Portada (/ y /es/)
 ├── sección «No hace falta ser una clínica» → los 11 sectores + «Ver todos»   (1 clic)
 ├── pie de página → los 11 sectores + «Todos los sectores»                     (1 clic)
 └── Índice (/industries/, /es/sectores/) → los 11 sectores
        └── cada sector → 3 sectores vecinos + el índice
```

Ninguna página queda huérfana: `tools/sitio/alcanzables.js` lo comprueba y exige
que los dos índices estén a un clic de su portada.

### 2.4 · Lo que cambió fuera de las páginas

| Fichero | Cambio |
|---|---|
| `sitemap.xml` | De **17 a 41 URLs**. `tools/sitio/sitemap.js` recorre ahora `''`, `es`, `es/sectores` e `industries` (constante `PUBLICADAS`). Se regenera, no se edita |
| `llms.txt` | Tablas de precios de **EE. UU.** y **LatAm**, lista de páginas por sector, y fuera la frase «cualquier cifra en USD está obsoleta» (era falsa para LatAm) |
| `index.html` | Enlaces a los sectores y precios de EE. UU. en USD bajo la tabla de planes |
| `es/index.html` | Enlaces a los sectores y precios de LatAm en USD bajo la tabla de planes |
| `assets/pages.css` | Estilos de la conversación (`.chat`, `.msg`), la caja del plan y la rejilla de sectores |
| `tools/sitio/archivos.js` | Comprueba los precios de EE. UU. y LatAm en `llms.txt` y en la portada |
| `tools/sitio/alcanzables.js` | Incluye todas las páginas de sector |

---

## 3 · Precios por mercado

La **única fuente** es `tools/sectores/mercados.js`.

| Plan | España (€) | EE. UU. (USD) | LatAm (USD) |
|---|---|---|---|
| Por Cita / Pay-per-booking | 49 + 4 por cita de chat / 9 por cita en llamada, tope 990 | 59 + 5 / 11, tope 1.159 | 29 + 3 / 7, tope 299 |
| Autónomo / Solo / Independiente | 149 | 179 | 69 |
| Esencial / Essential | 390 | 459 | 129 |
| Profesional / Professional | 690 | 809 | 219 |
| Clínica Completa / Complete | 990 | 1.159 | 299 |
| Multi-sede | desde 1.690 | desde 1.979 | desde 590 |
| Módulo de voz | 190 (300 min) | 229 (300 min) | 99 (200 min) |

- **EE. UU.** = precio en euros × `TASA_EUR_USD` (hoy **1,17**), redondeado
  hacia arriba al siguiente número acabado en 9. Decisión del 25-09-2026: la
  escala de LatAm es para LatAm; en EE. UU. se parte del euro, que queda más alto
  y encaja con ese mercado.
- **LatAm** = escala propia de `docs/rag/hachi_latam_rag.txt` del backend,
  fijada contra precios reales de Colombia. **No se convierte.**
- **Cambiar la tasa:** una línea en `mercados.js` → `node tools/sectores/generar.js`
  → actualizar a mano los importes de `llms.txt` y de la portada inglesa →
  `node tools/sitio/archivos.js` (falla si no coinciden).

---

## 4 · Cómo está hecho

```
tools/sectores/
├── mercados.js       precios por mercado (única fuente)
├── sectores.es.js    contenido en español, escrito a mano
├── sectores.en.js    contenido en inglés, escrito a mano (no es una traducción)
├── generar.js        la plantilla; no lleva contenido
├── verificar.js      ~400 comprobaciones
└── README.md         referencia rápida
```

```bash
node tools/sectores/generar.js
node tools/sectores/verificar.js
node tools/sitio/sitemap.js --escribir
node tools/sitio/alcanzables.js && node tools/sitio/archivos.js && node tools/sitio/sitemap.js
```

`verificar.js` comprueba, por página: título ≤ 75 y descripción 110-165
caracteres, `canonical`, `hreflang` recíproco, JSON-LD válido, que el `FAQPage`
sea exactamente lo que se ve, que no se cuelen detalles internos (LangGraph,
Redis, proveedores de modelo…), que los precios coincidan con `mercados.js`,
que las páginas en español no hablen de SMS ni de dólares de EE. UU. y las
inglesas sí, que la cuenta de retorno esté calculada, **que dos sectores no
compartan ≥ 12 % del texto** y que el HTML publicado sea exactamente lo que
genera la plantilla.

---

## 5 · Plan de indexación (10 solicitudes al día)

### 5.1 · Ya hecho

- **25-09-2026:** sitemap reenviado (Search Console lo leyó: «Correcto», 17
  páginas; al releerlo verá 41) y 10 solicitudes: `/`, `/es/`, `/faq.html`,
  `/es/preguntas.html`, las dos guías de precio, las dos de WhatsApp API y las
  dos de bots de flujo.

### 5.2 · Pendiente, por orden de prioridad

El orden sigue a las campañas en marcha (veterinarias y talleres en EE. UU.) y a
los sectores de ticket alto. Marca cada casilla al pedirla.

**Día 1** — índices y sectores de las campañas:

- [ ] `https://hachi.live/industries/`
- [ ] `https://hachi.live/es/sectores/`
- [ ] `https://hachi.live/industries/veterinary-clinics.html`
- [ ] `https://hachi.live/industries/auto-repair-shops.html`
- [ ] `https://hachi.live/es/sectores/veterinarias.html`
- [ ] `https://hachi.live/es/sectores/talleres-mecanicos.html`
- [ ] `https://hachi.live/industries/med-spas.html`
- [ ] `https://hachi.live/es/sectores/medicina-estetica.html`
- [ ] `https://hachi.live/industries/plumbers-electricians-and-home-services.html`
- [ ] `https://hachi.live/es/sectores/fontaneros-electricistas-y-mantenimiento.html`

**Día 2:**

- [ ] `https://hachi.live/industries/dental-practices.html`
- [ ] `https://hachi.live/es/sectores/clinicas-dentales.html`
- [ ] `https://hachi.live/industries/physical-therapy.html`
- [ ] `https://hachi.live/es/sectores/fisioterapia.html`
- [ ] `https://hachi.live/industries/hair-salons-and-barbershops.html`
- [ ] `https://hachi.live/es/sectores/peluquerias-y-barberias.html`
- [ ] `https://hachi.live/industries/beauty-and-nail-salons.html`
- [ ] `https://hachi.live/es/sectores/centros-de-belleza-y-unas.html`
- [ ] `https://hachi.live/industries/spas-and-massage.html`
- [ ] `https://hachi.live/es/sectores/spas-y-masajes.html`

**Día 3** (quedan 4 sectores; se aprovechan 2 huecos para las portadas, que
cambiaron después de pedirlas el 25-09 al añadirles los enlaces a sectores):

- [ ] `https://hachi.live/industries/therapists.html`
- [ ] `https://hachi.live/es/sectores/psicologos.html`
- [ ] `https://hachi.live/industries/hair-restoration-and-laser-clinics.html`
- [ ] `https://hachi.live/es/sectores/clinicas-capilares-y-laser.html`
- [ ] `https://hachi.live/` (volver a pedir)
- [ ] `https://hachi.live/es/` (volver a pedir)

### 5.3 · Cómo se pide cada una

1. Search Console → barra de arriba «Inspeccionar cualquier URL» → pega la URL
   (siempre `https://hachi.live/…`, sin `www`).
2. **«Probar URL publicada»** (para que lea la versión nueva, no la guardada).
3. **«Solicitar indexación».**

Y una vez, tras cada publicación: `bash tools/sitio/indexnow.sh` desde tu
ordenador (avisa a Bing y Yandex de las 41 URLs del sitemap; Bing alimenta a
ChatGPT cuando busca en la web).

### 5.4 · Lo que Search Console marca y se ignora

| Aviso | Por qué no es un problema |
|---|---|
| «Página alternativa con etiqueta canónica adecuada» (`www.hachi.live/…`) | La canónica apunta a la versión sin `www` y Google la respeta |
| «Página con redirección» (`http://…`) | Redirigen a `https`, que es lo correcto |
| «No se ha encontrado (404)» `hachi.live/h` | Un enlace roto de fuera; esa página nunca existió |
| «Rastreada: sin indexar» `crm.hachi.live/app/login` | Es el login de Chatwoot; mejor fuera de Google |

**No pulses «Validar corrección»** en esos grupos: siempre darán «error».

---

## 6 · Cómo medir si funciona

**Cuándo mirar:** Google tarda entre días y semanas en indexar, y de 3 a 6
semanas en posicionar páginas nuevas de un dominio pequeño. **Primera revisión
seria: mediados de octubre de 2026.** Segunda: mediados de noviembre.

**Dónde:** Search Console → Rendimiento → filtro **«Página» contiene
`/industries/`** (y luego `/es/sectores/`).

| Métrica | Qué significa | Señal para decidir |
|---|---|---|
| Páginas indexadas (Indexación → Páginas) | Google las aceptó | Si a las 3 semanas siguen en «Descubierta: sin indexar», el problema es de autoridad, no de contenido: más enlaces externos (§8) |
| Impresiones por página | Google las enseña | Las que tengan impresiones son las que hay que reforzar primero |
| Consultas **sin «hachi»** | Tráfico nuevo, no de marca | Es el objetivo. Anota las 10 primeras aquí abajo |
| Posición media por página | Lo cerca que está de la primera página | Entre 8 y 20 = cerca: mejorar esa página (título, FAQ) rinde más que crear otra |
| Clics y demos que vienen de ahí | Negocio | Pregunta en cada demo «¿cómo nos encontraste?» |

**Consultas no de marca encontradas** (rellenar en cada revisión):

| Fecha | Consulta | Página | Posición | Impresiones |
|---|---|---|---|---|
| | | | | |

---

## 7 · Lo que queda: siguientes sectores

### 7.1 · Segunda tanda propuesta

Por encaje con el producto (🟢 tal cual · 🟡 con matices) y por si ya hay
campaña o demanda:

| # | Sector (ES / EN) | Encaje | Nota |
|---|---|---|---|
| 1 | Cejas, pestañas y micropigmentación / Brow and lash studios | 🟢 | Rellenos cada 3-4 semanas, igual que uñas pero otra búsqueda |
| 2 | Estudios de tatuaje / Tattoo studios | 🟢 | Fotos de referencia, señal y sesiones largas |
| 3 | Peluquería canina / Dog grooming | 🟢 | Vecino natural de veterinaria; en EE. UU. sin HIPAA |
| 4 | Depilación láser (separada de capilar) / Laser hair removal | 🟢 | Búsqueda propia y muy anunciada |
| 5 | Entrenadores personales / Personal trainers | 🟢 | Sesiones recurrentes, trabajan solos |
| 6 | Lavado y detailing de coches / Auto detailing | 🟢 | Vecino de taller |
| 7 | Climatización / HVAC | 🟡 | Mismo molde que fontaneros: visita por franjas + urgencias. En EE. UU. compite con ServiceTitan: vender la llamada atendida, no el despacho |
| 8 | Cerrajeros / Locksmiths | 🟡 | Casi todo es urgencia inmediata: encaja atender y pasar la urgencia, no la agenda |
| 9 | Nutrición / Nutritionists | 🟢 (ES) · 🟡 (EE. UU.) | En EE. UU., verificar si factura a seguros |
| 10 | Podología / Podiatry | 🟢 (ES) · 🔴 (EE. UU., HIPAA) | Solo español |
| 11 | Osteopatía y quiropráctica / Chiropractors | 🟢 (ES) · 🟡 (EE. UU.) | En EE. UU. muchos son solo pago directo |
| 12 | Fotografía (sesiones) / Photography studios | 🟢 | Ya se menciona en la portada |
| 13 | Autoescuelas | 🟡 | Solo español |
| 14 | Academias y clases particulares / Tutoring | 🟡 | Aforo y grupos: explicar el límite |
| 15 | Inmobiliarias (visitas) / Real estate showings | 🟡 | Encaja con Lead Ads |
| 16 | Asesorías y despachos / Law and accounting firms | 🟡 | Primera consulta; confidencialidad |

**Recomendación para la segunda tanda:** los 6 primeros (🟢, sin matices) más
climatización, en los dos idiomas: 14 páginas.

### 7.2 · Dónde no hacer página (y por qué)

Restaurantes (reservas de mesa en su sistema), hoteles y turismo rural (motor de
reservas), limpieza a domicilio (rutas, no huecos), administración de fincas
(incidencias con plazos, no citas). El índice de sectores ya lo dice: «Dónde no
encajamos».

### 7.3 · Páginas por ciudad: cuándo sí

Solo si se cumplen **las tres**:

1. Search Console enseña impresiones de esa ciudad para ese sector (la demanda
   existe).
2. Hay algo local **verdadero** que contar: clientes allí, un caso, un dato
   propio del mercado de esa ciudad con fuente.
3. La página de sector de ese idioma ya está indexada y posiciona (la ciudad
   cuelga de ella, no al revés).

Candidata más probable: **Miami** (mercado hispano, campañas en marcha, cambio de
idioma a mitad de llamada como argumento real). Estructura:
`/industries/veterinary-clinics/miami.html`, enlazada solo desde su sector.

---

## 8 · Próximos pasos (además de sectores)

Por orden de impacto:

| # | Qué | Dónde | Por qué |
|---|---|---|---|
| 1 | **Indexar** las 24 URLs (§5) | Search Console | Sin esto no existe nada de lo anterior |
| 2 | **Conocimiento de EE. UU. para el agente de Hachi** (precios en USD, SMS, HIPAA) | backend: RAG de la empresa `hachi` | Hoy el agente solo sabe de España: un prospecto que llega de `/industries/` y escribe recibiría precios en euros |
| 3 | **Montar el SMS** | backend (Twilio) | Las páginas de EE. UU. lo prometen desde el 25-09-2026. Tiene que existir antes del primer cliente de allí |
| 4 | **Que `docs/` y `tools/` no se sirvan** | Coolify (§10.3) | Se servían; el arreglo está en el repo, falta aplicarlo en Coolify |
| 5 | **Enlaces externos** a las páginas de sector | fuera del sitio | Un dominio nuevo posiciona despacio sin enlaces: directorios del sector, un artículo invitado, LinkedIn enlazando al sector concreto, la firma de los correos de cada campaña apuntando a su sector |
| 6 | **Usar las páginas en las campañas** | correo en frío | El correo a una veterinaria debería enlazar `/industries/veterinary-clinics.html`, no la portada: más conversión y señal de uso para Google |
| 7 | Segunda tanda de sectores (§7.1) | `tools/sectores` | Cuando haya datos de la primera |
| 8 | Portar la plantilla de las guías | `tools/paginas/generar.js` | Está desfasada: **no ejecutarla** hasta portarla (ver `tools/preguntas/README.md`) |
| 9 | Páginas pendientes del plan SEO | `plan-seo-y-posicionamiento.md` §4 | `rgpd-clinicas-whatsapp`, `migrar-numero-whatsapp-api`, `test-nivel-asistente` |
| 10 | Imagen para compartir por sector | `images/` | Hoy todas comparten `og-image.png` |

---

## 9 · Reglas que no se pueden romper

1. **Ni una doorway page.** Cada sector se escribe a mano. `verificar.js` falla si
   dos sectores comparten ≥ 12 % del texto. No bajes el umbral para que pase:
   reescribe el sector.
2. **Solo capacidades que existen.** Lo que no hace, se dice (el estado de una
   reparación, repartir rutas entre técnicos, cobrar, diagnosticar).
3. **Garantías: solo las impuestas en código.** Nunca «no da una cita por hecha
   hasta reservarla»: el hueco HAG7 del backend sigue abierto (el modelo puede
   decir «te agendo» sin haber reservado). Tampoco «no duplica aunque escriba
   desde dos móviles o dos canales»: la deduplicación es por conversación.
4. **Nunca «HIPAA compliant».** Hachi no firma BAA hoy. Las páginas de salud en
   inglés lo dicen en su FAQ. Veterinaria queda fuera de HIPAA.
5. **SMS solo en las páginas de EE. UU.** (y tiene que existir antes del primer
   cliente de allí, ver §8).
6. **Precios solo desde `mercados.js`.** Nunca tecleados en `sectores.*.js`.
7. **Espacio del problema, no de la solución** (`plan-seo-y-posicionamiento.md`
   §3): ni LangGraph, ni Redis, ni proveedores de modelo en las páginas.
8. **Las páginas se generan.** Si algo está mal, se arregla en `sectores.*.js` o
   en `generar.js`, nunca en el HTML.

---

## 10 · `docs/` y `tools/` no deben servirse

### 10.1 · Lo que pasaba

Confirmado el 25-09-2026: `https://hachi.live/docs/pseo-paginas-por-sector.md`
**se descargaba**. La aplicación de Coolify (proyecto `landing_page`) estaba así:

| Ajuste | Valor |
|---|---|
| Build Pack | Nixpacks, «Is it a static site?» marcado |
| Static Image | `nginx:alpine` |
| Custom Nginx Configuration | vacía (la de por defecto) |
| Base Directory / Publish Directory | `/` y `/` |

Con eso Coolify copia **el repositorio entero** al nginx: `docs/` (con
`docs/audit/`: endpoints de la API, webhooks de Chatwoot, arquitectura del
backend), `tools/` y cualquier `.md`.

### 10.2 · Lo que hay en el repositorio desde el 25-09-2026

| Fichero | Qué hace |
|---|---|
| `deploy/nginx.conf` | Sirve el sitio y devuelve **404** a `/docs`, `/tools`, `/deploy`, a los ficheros ocultos (salvo `/.well-known/`) y a cualquier `.md`. Además: redirecciones relativas (detrás del proxy), UTF-8 en `.txt`/`.css`/`.json`, gzip |
| `Dockerfile` | `nginx:alpine` con esa configuración; copia el sitio y **falla la construcción** si `docs/`, `tools/` o `.git` llegan a la imagen, o si falta `index.html`, `es/index.html`, `robots.txt` o `security.txt` |
| `.dockerignore` | Deja fuera `.git`, `docs/`, `tools/`, los `.md` y los ficheros del despliegue |
| `robots.txt` | `Disallow: /docs/` y `/tools/` (que tampoco se indexen) |

Probado con nginx 1.24 sobre una copia de lo que entra en la imagen: todas las
páginas, los índices de carpeta (`/es/`, `/industries/`, `/es/sectores/`),
`llms.txt`, `robots.txt`, `sitemap.xml`, `/.well-known/security.txt`, la clave de
IndexNow, CSS, iconos y `manifest.json` → **200**; `/docs`, `/docs/…`, `/tools/…`,
`/deploy/…`, `/.git/HEAD`, `README.md` y `Dockerfile` → **404**; `/es` → 301 a
`/es/` con `Location` relativa.

⚠️ **Sin `listen [::]:80` a propósito:** donde no hay IPv6, esa línea impide
arrancar nginx (pasó en la prueba). El proxy de Coolify entra por IPv4.

### 10.3 · Lo que hay que hacer en Coolify (una de las dos)

**Opción A · Dockerfile (la completa, recomendada).** `docs/` ni siquiera entra
en la imagen.

1. Configuration → General → **Build Pack: Dockerfile**.
2. Deja **Base Directory** en `/`; el Dockerfile está en `/Dockerfile`.
3. **Ports Exposes: `80`** (aparece al cambiar a Dockerfile).
4. Los **Domains** no cambian (`https://hachi.live,https://www.hachi.live`).
5. Save → **Redeploy**. Mira el log: si la construcción falla, falla en el
   `RUN test …` y dice qué falta; la versión anterior sigue sirviendo.
6. Comprueba (§10.4).

Para volver atrás: Build Pack → Nixpacks, marcar «Is it a static site?» y
Redeploy (o Rollback a la versión anterior).

**Opción B · Solo la configuración de nginx (la rápida).** No cambia cómo se
construye; los ficheros siguen en el contenedor, pero nginx no los entrega.

1. Configuration → General → **Custom Nginx Configuration**: pega el contenido
   entero de `deploy/nginx.conf`.
2. Save → Redeploy → comprueba (§10.4).

Para volver atrás: vacía el campo y Redeploy.

### 10.4 · Comprobación después de desplegar

Tienen que **abrir** (200):

- `https://hachi.live/`, `https://hachi.live/es/`, `https://hachi.live/industries/`,
  `https://hachi.live/es/sectores/veterinarias.html`
- `https://hachi.live/llms.txt`, `https://hachi.live/robots.txt`,
  `https://hachi.live/sitemap.xml`, `https://hachi.live/.well-known/security.txt`

Tienen que dar **404** (no descargar nada):

- `https://hachi.live/docs/pseo-paginas-por-sector.md`
- `https://hachi.live/docs/audit/audit-map.md`
- `https://hachi.live/tools/sectores/generar.js`
- `https://hachi.live/.git/HEAD`

Opcional, en el mismo panel: **Direction → «Redirect to non-www»**. Hoy sirve
las dos (`www` y sin `www`); con la redirección, Search Console deja de listar
las `www` como «página alternativa».

## 11 · Cómo añadir un sector (lista de pasos)

1. Escribe el objeto en `tools/sectores/sectores.es.js` **y** en
   `sectores.en.js`, con el mismo `id`. Usa un sector existente como guía de
   estructura, no de texto.
2. Elige `roi.ticket` y `roi.margen` realistas para ese sector y mercado.
3. `node tools/sectores/generar.js && node tools/sectores/verificar.js`.
4. Añade el sector como vecino de 2-3 sectores parecidos (`vecinos`).
5. Enlázalo en las portadas: sección «No hace falta ser una clínica» y pie (la
   lista se generó con un script; basta con añadir el enlace a mano).
6. Añádelo a la lista «Industry pages» de `llms.txt`.
7. `node tools/sitio/sitemap.js --escribir`, luego `alcanzables.js`,
   `archivos.js` y `sitemap.js`.
8. Capturas en escritorio y móvil antes de publicar.
9. Commit, push a `main`, `bash tools/sitio/indexnow.sh` y añadir sus dos URLs
   al plan de indexación (§5).
10. Actualiza este documento: §2.1, §7.1 y §12.

---

## 12 · Historial de decisiones

| Fecha | Decisión | Por qué |
|---|---|---|
| 25-09-2026 | Sector × mercado, no sector × ciudad | Política de Google contra contenido a escala; nada local que contar |
| 25-09-2026 | Primera tanda: 10 sectores + servicios del hogar | Encaje con el producto y campañas en marcha (veterinarias, talleres). Servicios del hogar a petición: agendan visitas y no pueden coger el teléfono |
| 25-09-2026 | EE. UU. en USD convertido desde el euro (1,17) | La escala LatAm es para LatAm; en EE. UU. queda más alto y encaja con ese mercado |
| 25-09-2026 | Las páginas de EE. UU. anuncian SMS | Hay autorización de Twilio y se monta en un día; queda pendiente construirlo (§8) |
| 25-09-2026 | GPTBot y CCBot desbloqueados en `robots.txt` | Que los modelos conozcan Hachi (ver `plan-seo-y-posicionamiento.md`) |
| 25-09-2026 | `robots.txt`: `Disallow: /docs/` y `/tools/` | Mitigación mientras se decide cómo dejar de servirlos (§10) |
| 25-09-2026 | `Dockerfile` + `deploy/nginx.conf` + `.dockerignore` | `docs/` se descargaba desde hachi.live; pasos en Coolify en §10.3 |

---

## Documentos relacionados

- `docs/plan-seo-y-posicionamiento.md`: el diagnóstico SEO de origen y el plan por fases.
- `docs/indexacion-paso-a-paso.md`: Search Console, Bing e IndexNow paso a paso.
- `tools/sectores/README.md`: referencia rápida del generador.
- Backend `docs/comercial/us-canada/`: mercado de EE. UU., HIPAA (`09`) y precios (`02`).
- Backend `docs/rag/hachi_latam_rag.txt`: la escala de precios de LatAm.
