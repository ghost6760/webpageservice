# Páginas por sector (`/es/sectores/…` y `/industries/…`)

```bash
node tools/sectores/generar.js     # escribe 11 sectores × 2 idiomas + 2 índices
node tools/sectores/verificar.js   # ~400 comprobaciones
node tools/sitio/sitemap.js --escribir
```

Las páginas **se generan**: no se editan a mano.

## Qué es cada fichero

| Fichero | Qué contiene |
|---|---|
| `mercados.js` | Precios por mercado. **Única fuente** para las páginas, el `llms.txt` y las portadas |
| `sectores.es.js` | Sectores en español: mercado **España + Latinoamérica** (euros, con la línea de LatAm en USD). Sin SMS |
| `sectores.en.js` | Sectores en inglés: mercado **Estados Unidos** (USD, con SMS). No es una traducción |
| `generar.js` | Solo la plantilla. Usa `/assets/pages.css`, igual que las guías |
| `verificar.js` | Metadatos, hreflang, FAQ marcada = visible, precios por mercado, y parecido entre sectores |

## Precios por mercado (decisión del 25-09-2026)

- **España / UE**: euros, los de la landing.
- **Estados Unidos**: los mismos planes, convertidos a dólares desde el euro con
  `TASA_EUR_USD` y redondeados hacia arriba al siguiente número acabado en 9.
  Para cambiar la tasa: una línea en `mercados.js`, regenerar y volver a pasar
  `tools/sitio/archivos.js` (comprueba que `llms.txt` y la portada inglesa lleven
  los mismos importes; esos dos se actualizan a mano).
- **Latinoamérica**: su propia escala en USD (29 / 69 / 129 / 219 / 299 / 590),
  copiada de `docs/rag/hachi_latam_rag.txt` del backend. No se convierte.

## La regla que no se puede romper: ni una «doorway page»

Una página de sector que solo cambia el nombre del sector es contenido a escala
sin valor, y Google puede sacar del índice el bloque entero. Por eso:

1. Cada sector se **escribe a mano**: su dolor, su conversación de ejemplo, lo
   que hace Hachi ahí, las garantías que más importan en ese negocio y sus
   preguntas frecuentes.
2. `verificar.js` [5] mide cuánto texto comparten dos sectores (fragmentos de 5
   palabras) y falla a partir del 12 %. Hoy el par más parecido está por debajo
   del 5 %.
3. **Por ciudad, no.** `/veterinarias/miami` diría lo mismo que `/veterinarias/houston`.
   Solo tendría sentido con algo local de verdad (clientes allí, un dato propio de
   esa ciudad) y con Search Console enseñando tráfico de esa ciudad.

## Qué se puede afirmar y qué no

- Solo capacidades que existen. Lo que no hace, se dice (el estado de una
  reparación, repartir rutas entre técnicos, cobrar).
- Garantías: solo las que impone el código (sección guardrails de la landing).
  **Nunca** «no da una cita por hecha sin reservarla»: el hueco HAG7 del backend
  sigue abierto.
- Inglés: **nunca** «HIPAA compliant». Hachi no firma BAA hoy; las páginas de
  salud lo dicen en su FAQ. Las veterinarias quedan fuera de HIPAA.
- SMS: solo en las páginas de EE. UU.

## Añadir un sector

1. Añade el objeto en `sectores.es.js` **y** en `sectores.en.js`, con el mismo `id`.
2. `node tools/sectores/generar.js && node tools/sectores/verificar.js`.
3. Enlázalo en las portadas (sección «No hace falta ser una clínica» y el pie).
4. Añádelo a la lista de `llms.txt` y regenera el sitemap.
