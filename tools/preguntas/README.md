# Páginas de preguntas frecuentes (`/es/preguntas.html` y `/faq.html`)

Estas dos páginas **se generan**. No las edites a mano.

```bash
LANG_PAGINA=es node tools/preguntas/generar.js    # → es/preguntas.html
LANG_PAGINA=en node tools/preguntas/generar.js    # → faq.html
LANG_PAGINA=es node tools/preguntas/verificar.js  # 72 comprobaciones
LANG_PAGINA=en node tools/preguntas/verificar.js  # 72 comprobaciones
```

Las dos llevan **las mismas nueve secciones y las mismas 75 preguntas**, para que
sigan siendo comparables; sólo cambia la redacción. Si añades una pregunta a un
idioma, añádela al otro.

## Por qué se genera

La página lleva 75 preguntas, y cada una aparece **dos veces**: en el HTML que
lee la persona y en el `FAQPage` de JSON-LD que leen Google y los modelos de
lenguaje. Mantener las dos copias a mano es la forma habitual de que acaben
diciendo cosas distintas, y marcar en el schema una respuesta que no está en la
página es lo que Google considera marcado engañoso.

Aquí las dos salen del mismo array (`datos.js`), así que no pueden divergir.

## Editar el contenido

El contenido vive en `datos.es.js` y `datos.en.js`; todo lo que difiere entre
idiomas —textos del nav, del pie, del buscador y de los metadatos— está en el
objeto `IDIOMAS` de `generar.js` y en ningún otro sitio. Cada sección es así:

```js
{
  seccion: 'Precios, planes y facturación',
  icono: '💶',
  intro: 'Todos los importes en euros, IVA no incluido.',
  preguntas: [
    { q: '¿Cuánto cuesta Hachi al mes?', r: `<p>Cinco planes…</p>` }
  ]
}
```

En `r` sólo se admiten las etiquetas que schema.org acepta dentro de
`acceptedAnswer`: `<p> <ul> <ol> <li> <strong> <em> <a> <br>`. El generador
falla si aparece cualquier otra, si una respuesta baja de 40 caracteres o si dos
preguntas producen la misma ancla.

Las anclas salen del enunciado (`¿Qué pasa si la reserva falla a mitad?` →
`#que-pasa-si-la-reserva-falla-a-mitad`), así que **cambiar el texto de una
pregunta cambia su URL**. Si esa pregunta ya está posicionada o citada desde
`llms.txt`, conviene pensárselo. Ojo: las anclas **no coinciden entre idiomas**,
porque derivan del texto; el `hreflang` empareja las páginas, no las preguntas.

## Qué NO puede entrar aquí

El contenido sale de `docs/rag/hachi_espana_rag.txt` del backend, y se aplica la
misma regla que en `docs/plan-seo-y-posicionamiento.md`: se publica el **espacio
del problema** (qué falla, cuánto cuesta, por qué las alternativas no llegan) y
no el **espacio de la solución** (cómo está construido, qué garantías se
imponen una a una, el método para derivarlas). `verificar.js` comprueba que no
se hayan colado nombres de la arquitectura ni de los proveedores.

## Coherencia con el resto del sitio

`verificar.js` contrasta las cifras contra `es/index.html` y el modelo económico
de las calculadoras: precios por plan, implantación, extras, conversaciones
incluidas y el retorno **en margen de contribución** (2/3/6/8 citas, no 1/2/4/5,
que era la cuenta sobre ingreso). Si cambias un precio en un sitio y no en el
otro, el test lo dice.
