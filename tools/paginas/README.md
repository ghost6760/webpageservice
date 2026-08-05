# Páginas de contenido (guías)

Estas seis páginas **se generan**. No las edites a mano.

```bash
node tools/paginas/generar.js    # regenera las 6
node tools/paginas/verificar.js  # 225 comprobaciones sobre el resultado
```

| Fichero de contenido | Página | Intención de búsqueda |
|---|---|---|
| `cuanto-cuesta.es.js` | `/es/cuanto-cuesta-un-asistente-ia.html` | «precio chatbot clínica» |
| `cuanto-cuesta.en.js` | `/how-much-does-an-ai-assistant-cost.html` | "ai assistant for clinics price" |
| `bots-de-flujo.es.js` | `/es/por-que-los-bots-de-flujo-fallan.html` | «bot no consulta agenda» |
| `bots-de-flujo.en.js` | `/why-flow-based-bots-fail.html` | "bot can't check calendar" |
| `whatsapp-api.es.js` | `/es/whatsapp-api-vs-business.html` | «diferencia whatsapp business api» |
| `whatsapp-api.en.js` | `/whatsapp-api-vs-business.html` | "whatsapp business api difference" |

## Por qué se generan

Tres motivos, y ninguno es pereza:

1. **El JSON-LD repite el contenido.** Cada página lleva un `FAQPage` cuyas
   respuestas tienen que estar palabra por palabra en el texto visible. Marcar en
   el schema algo que no está en la página es lo que Google considera marcado
   engañoso, y mantener las dos copias a mano acaba siempre en divergencia.
2. **El `hreflang` tiene que ser recíproco.** Seis páginas emparejadas de dos en
   dos: si una apunta a su alterna y la alterna no le devuelve el enlace, Google
   ignora el par entero. El generador falla si no cuadra.
3. **El CSS es el mismo.** Las dos landings del repositorio arrastran ~1.200
   líneas de CSS copiadas en cada fichero, y ya han divergido entre sí. Aquí sale
   de `plantilla.js`, una vez.

## Editar el contenido

Todo vive en `contenido/*.js`:

```js
module.exports = {
  lang: 'es',
  ruta: 'es/cuanto-cuesta-un-asistente-ia.html',
  alterna: { lang: 'en', ruta: 'how-much-does-an-ai-assistant-cost.html' },
  titulo: '…',        // ≤ 75 caracteres
  descripcion: '…',   // 110-175 caracteres
  h1: 'Admite <em>énfasis</em>',
  bloques: [ { h2: '…', html: `…` } ],   // mínimo 3
  faq: [ { q: '…', r: `…` } ],
  relacionadas: [ { href, titulo, nota } ],  // mínimo 2
  cta: { h2, p, boton, botonSec }
};
```

El generador **se niega a escribir** si el título pasa de 75 caracteres, la meta
description se sale de 110-175, hay menos de tres secciones, una etiqueta queda
sin cerrar, el `hreflang` no es recíproco o una respuesta del FAQ usa una
etiqueta que schema.org no admite (sólo `<p> <ul> <ol> <li> <strong> <em> <a>
<br>`).

## Qué NO puede entrar aquí

Rige la regla de `docs/plan-seo-y-posicionamiento.md`: se publica el **espacio
del problema** —qué falla, cuánto cuesta, por qué las alternativas no llegan— y
nunca el **espacio de la solución**. Por eso las páginas dicen *«hay que exigir
que se deshaga solo si falla a mitad»* y no cómo está implementado. `verificar.js`
comprueba que no se hayan colado nombres de la arquitectura ni de los
proveedores.

## Canibalización

Es el riesgo real de tener tres páginas que beben de la misma fuente. Los ángulos
están deliberadamente separados: **cuanto-cuesta** habla de precio,
**bots-de-flujo** del mecanismo del fallo y **whatsapp-api** del canal.
`verificar.js` compara todas las frases de más de 70 caracteres entre las seis
páginas, la de preguntas y las dos landings, y falla si alguna se repite literal.
El nav, el pie y el bloque de CTA se excluyen: son cromo compartido a propósito.

## Al añadir una página nueva

1. Crea `contenido/<tema>.<idioma>.js` — **siempre las dos versiones**, o el
   generador falla por `hreflang` sin par.
2. `node tools/paginas/generar.js && node tools/paginas/verificar.js`
3. Añade las dos URLs a `sitemap.xml` con sus `xhtml:link` recíprocos.
4. Añade una línea en `llms.txt`.
5. Enlázala desde la sección `#guias` / `#guides` de la landing correspondiente.
