/**
 * Genera /es/preguntas.html y /faq.html a partir de datos.es.js y datos.en.js.
 *
 * El HTML visible y el JSON-LD (FAQPage) salen del MISMO array, así que no
 * pueden divergir. Marcar en el schema una respuesta que no está en la página
 * es lo que Google considera marcado engañoso.
 *
 * Los estilos viven en /assets/pages.css (el sistema de diseño de las páginas
 * internas), no aquí: la plantilla solo produce el HTML.
 *
 * Las dos versiones llevan las mismas nueve secciones y las mismas 85
 * preguntas, para que sigan siendo comparables; sólo cambia la redacción.
 */
const fs = require('fs');
const path = require('path');

// Todo lo que difiere entre idiomas vive aquí y en nada más.
const IDIOMAS = {
  es: {
    datos: './datos.es.js',
    ruta: 'es/preguntas.html',
    alterna: 'faq.html',
    raiz: '/es/',
    calculadora: '/es/calculadora.html',
    contacto: '/es/#contacto',
    precios: '/es/#precios',
    privacidad: '/es/privacy-policy.html',
    codigoAlterno: 'EN',
    titulo: 'Preguntas frecuentes · Precios, canales y RGPD | Hachi',
    descripcion: (n) => n + ' preguntas respondidas: precios y planes, WhatsApp API y ' +
      'la ventana de 24 h, llamadas, cómo agenda las citas, ausencias y RGPD.',
    ogTitulo: 'Preguntas frecuentes sobre Hachi',
    ogDescripcion: 'Precios, WhatsApp API, tu número, cómo agenda las citas, ' +
      'ausencias, RGPD e implantación. Respondido entero, incluida la parte que ' +
      'juega en nuestra contra.',
    nombreSchema: 'Preguntas frecuentes sobre Hachi',
    idiomaSchema: 'es-ES',
    inicio: 'Inicio',
    migaFinal: 'Preguntas frecuentes',
    verPlanes: 'Ver planes →',
    enlaceCalculadora: 'Calculadora',
    h1: 'Todo lo que preguntan antes de <em>contratar</em>',
    entradilla: (n) => n + ' preguntas respondidas enteras, incluidas las que juegan ' +
      'en nuestra\n    contra: qué pierdes si migras tu número, cuándo <strong>no</strong> ' +
      'te compensa\n    contratarnos y en qué caso una herramienta de 29 € es la ' +
      'decisión correcta.',
    buscar: 'Buscar: precio, número, RGPD, ausencias…',
    buscarAria: 'Buscar entre las preguntas',
    porTemas: 'Por temas',
    indiceAria: 'Índice de secciones',
    sinResultados: 'No hay ninguna pregunta con ese texto.<br>\n  Escríbenos y te la ' +
      'respondemos: <a href="/es/#contacto">formulario de contacto</a>.',
    ctaH2: '¿No está tu pregunta?',
    ctaP: 'Escríbenos y te la respondemos con tu caso concreto. Y si quieres números\n' +
      '    en vez de respuestas, la calculadora hace la cuenta con los tuyos.',
    ctaBoton: 'Solicitar una demostración',
    ctaBotonSec: 'Calcular mi retorno',
    pieInicio: 'Inicio', piePlanes: 'Planes', pieCalc: 'Calculadora',
    piePriv: 'Privacidad',
    unaPregunta: ' pregunta', variasPreguntas: ' preguntas', de: ' de ',
    sinResultadosPara: 'Sin resultados para «',
    cierreComilla: '»',
    anclaAria: 'Enlace a esta pregunta'
  },
  en: {
    datos: './datos.en.js',
    ruta: 'faq.html',
    alterna: 'es/preguntas.html',
    raiz: '/',
    calculadora: '/calculator.html',
    contacto: '/#contact',
    precios: '/#pricing',
    privacidad: '/privacy-policy.html',
    codigoAlterno: 'ES',
    titulo: 'FAQ · Pricing, channels, booking and GDPR | Hachi',
    descripcion: (n) => n + ' questions answered: pricing and plans, WhatsApp API and ' +
      'the 24-hour window, calls, how appointments are booked, no-shows and GDPR.',
    ogTitulo: 'Frequently asked questions about Hachi',
    ogDescripcion: 'Pricing, WhatsApp API, your number, how appointments are booked, ' +
      'no-shows, GDPR and implementation. Answered in full, including the parts that ' +
      'argue against us.',
    nombreSchema: 'Frequently asked questions about Hachi',
    idiomaSchema: 'en',
    inicio: 'Home',
    migaFinal: 'Frequently asked questions',
    verPlanes: 'See plans →',
    enlaceCalculadora: 'Calculator',
    h1: 'Everything people ask before <em>buying</em>',
    entradilla: (n) => n + ' questions answered in full, including the ones that argue ' +
      'against us:\n    what you lose by migrating your number, when Hachi is ' +
      '<strong>not</strong> worth it,\n    and the case in which a €29 tool is the ' +
      'right decision.',
    buscar: 'Search: pricing, number, GDPR, no-shows…',
    buscarAria: 'Search the questions',
    porTemas: 'By topic',
    indiceAria: 'Section index',
    sinResultados: 'No question matches that text.<br>\n  Write to us and we will ' +
      'answer it: <a href="/#contact">contact form</a>.',
    ctaH2: 'Is your question missing?',
    ctaP: 'Write to us and we will answer it for your specific case. And if you want\n' +
      '    numbers rather than answers, the calculator runs the maths on yours.',
    ctaBoton: 'Book a demo',
    ctaBotonSec: 'Calculate my return',
    pieInicio: 'Home', piePlanes: 'Plans', pieCalc: 'Calculator',
    piePriv: 'Privacy',
    unaPregunta: ' question', variasPreguntas: ' questions', de: ' of ',
    sinResultadosPara: 'No results for \u201c',
    cierreComilla: '\u201d',
    anclaAria: 'Link to this question'
  }
};

const LANG = process.env.LANG_PAGINA || 'es';
const T = IDIOMAS[LANG];
const secciones = require(T.datos);

const SALIDA = path.join(__dirname, '..', '..', T.ruta);

// ── utilidades ─────────────────────────────────────────────────────
const slug = (s) => s
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[¿?¡!,.:;«»"']/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 70);

const escXml = (s) => s
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Texto de la respuesta para el JSON-LD.
//
// Se conserva el marcado en lugar de aplanarlo a texto: schema.org permite en
// `acceptedAnswer.text` un subconjunto de HTML (<p>, <ul>, <ol>, <li>, <strong>,
// <em>, <a>, <br>), que es exactamente el que se usa aquí. Aplanarlo obligaba a
// inventar viñetas «•» que no están en la página, y entonces el schema decía
// algo distinto de lo que ve el lector — que es justo lo que hay que evitar.
//
// Sólo se normalizan los espacios y se resuelven las rutas relativas de los
// enlaces a absolutas, porque el schema se consume fuera del documento.
const ETIQUETAS_PERMITIDAS = /^\/?(p|ul|ol|li|strong|em|a|br)$/;

const aTexto = (html) => html
  .replace(/\s+/g, ' ')
  .replace(/href="\/(?!\/)/g, 'href="https://hachi.live/')
  .trim();

// Se verifica aquí, no sólo en el test: si alguien mete una etiqueta que
// schema.org no admite, la generación falla en vez de publicar marcado inválido.
const validarEtiquetas = (html, pregunta) => {
  (html.match(/<\/?([a-zA-Z]+)/g) || []).forEach((t) => {
    const nombre = t.replace('<', '');
    if (!ETIQUETAS_PERMITIDAS.test(nombre)) {
      throw new Error('etiqueta no permitida <' + nombre + '> en: ' + pregunta);
    }
  });
};

// ── comprobaciones de integridad antes de escribir ────────────────
const vistos = new Set();
let total = 0;
secciones.forEach((s) => s.preguntas.forEach((p) => {
  total++;
  const id = slug(p.q);
  if (vistos.has(id)) throw new Error('slug duplicado: ' + id + '  ← ' + p.q);
  vistos.add(id);
  if (!p.q.trim()) throw new Error('pregunta vacía');
  validarEtiquetas(p.r, p.q);
  if (p.r.replace(/<[^>]+>/g, '').trim().length < 40) {
    throw new Error('respuesta demasiado corta: ' + p.q);
  }
  const abiertas = (p.r.match(/<(p|ul|ol|li|strong|em|a)\b/g) || []).length;
  const cerradas = (p.r.match(/<\/(p|ul|ol|li|strong|em|a)>/g) || []).length;
  if (abiertas !== cerradas) throw new Error('HTML desequilibrado en: ' + p.q);
}));

// ── JSON-LD ────────────────────────────────────────────────────────
const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: T.nombreSchema,
  url: 'https://hachi.live/' + T.ruta,
  inLanguage: T.idiomaSchema,
  mainEntity: []
};
secciones.forEach((s) => s.preguntas.forEach((p) => {
  faqPage.mainEntity.push({
    '@type': 'Question',
    name: p.q,
    url: 'https://hachi.live/' + T.ruta + '#' + slug(p.q),
    acceptedAnswer: { '@type': 'Answer', text: aTexto(p.r) }
  });
}));

const migas = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: T.inicio,
      item: 'https://hachi.live' + T.raiz },
    { '@type': 'ListItem', position: 2, name: T.migaFinal,
      item: 'https://hachi.live/' + T.ruta }
  ]
};

// ── HTML ───────────────────────────────────────────────────────────
const indice = secciones.map((s, i) =>
  `      <a href="#s${i + 1}">${s.seccion}
        <em>${s.preguntas.length}</em></a>`).join('\n');

const cuerpo = secciones.map((s, i) => `
<section class="bloque" id="s${i + 1}">
  <h2>${s.seccion}</h2>
  <p class="intro">${s.intro}</p>
${s.preguntas.map((p) => `
  <article class="pregunta" id="${slug(p.q)}">
    <h3>${p.q}<a class="ancla" href="#${slug(p.q)}" aria-label="${T.anclaAria}">#</a></h3>
    <div class="respuesta">
${p.r.split('\n').map((l) => '      ' + l.trim()).filter((l) => l.trim()).join('\n')}
    </div>
  </article>`).join('\n')}
</section>`).join('\n');

const html = `<!DOCTYPE html>
<html lang="${LANG}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${T.titulo}</title>
<meta name="description" content="${T.descripcion(total)}">
<link rel="canonical" href="https://hachi.live/${T.ruta}">
<link rel="alternate" hreflang="${LANG}" href="https://hachi.live/${T.ruta}">
<link rel="alternate" hreflang="${LANG === 'es' ? 'en' : 'es'}" href="https://hachi.live/${T.alterna}">
<link rel="alternate" hreflang="x-default" href="https://hachi.live/${LANG === 'en' ? T.ruta : T.alterna}">
<link rel="icon" href="/favicon.ico">

<meta property="og:type" content="website">
<meta property="og:url" content="https://hachi.live/${T.ruta}">
<meta property="og:title" content="${T.ogTitulo}">
<meta property="og:description" content="${T.ogDescripcion}">
<meta property="og:image" content="https://hachi.live/images/og-image.png">

<script type="application/ld+json">
${JSON.stringify(faqPage, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(migas, null, 2)}
</script>

    <link rel="stylesheet" href="/assets/pages.css">
</head>
<body class="pagina-faq">

<nav class="nav">
  <div class="envoltorio">
    <a href="${T.raiz}" class="marca">Hachi<span>.</span></a>
    <div>
      <a href="/${T.alterna}" style="margin-right:16px">${T.codigoAlterno}</a>
      <a href="${T.calculadora}" style="margin-right:16px">${T.enlaceCalculadora}</a>
      <a href="${T.precios}">${T.verPlanes}</a>
    </div>
  </div>
</nav>

<div class="envoltorio">

<nav class="migas" aria-label="${T.inicio}">
  <a href="${T.raiz}">${T.inicio}</a> › ${T.migaFinal}
</nav>

<header class="hero">
  <h1>${T.h1}</h1>
  <p class="entradilla">
    ${T.entradilla(total)}
  </p>
</header>

<div class="buscador">
  <input type="search" id="q" placeholder="${T.buscar}"
         aria-label="${T.buscarAria}" autocomplete="off">
</div>
<p class="contador" id="contador" role="status" aria-live="polite"></p>

<nav class="indice" id="indice" aria-label="${T.indiceAria}">
  <h2>${T.porTemas}</h2>
  <div>
${indice}
  </div>
</nav>

<p class="sinresultados" id="sinresultados">
  ${T.sinResultados}
</p>
${cuerpo}

<div class="cta">
  <h2>${T.ctaH2}</h2>
  <p>
    ${T.ctaP}
  </p>
  <a href="${T.contacto}" class="boton">${T.ctaBoton}</a>
  <a href="${T.calculadora}" class="boton sec">${T.ctaBotonSec}</a>
</div>

</div>

<footer>
  <div class="envoltorio">
    Hachi · <a href="${T.raiz}">${T.pieInicio}</a> · <a href="${T.precios}">${T.piePlanes}</a> ·
    <a href="${T.calculadora}">${T.pieCalc}</a> ·
    <a href="${T.privacidad}">${T.piePriv}</a>
  </div>
</footer>

<script>
(function () {
  'use strict';
  var caja = document.getElementById('q');
  var contador = document.getElementById('contador');
  var vacio = document.getElementById('sinresultados');
  var indice = document.getElementById('indice');
  var bloques = [].slice.call(document.querySelectorAll('.bloque'));
  var total = ${total};

  // Se indexa una vez, sin acentos, para que "numero" encuentre "número".
  function normalizar(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
  }
  var fichas = [];
  bloques.forEach(function (b) {
    [].slice.call(b.querySelectorAll('.pregunta')).forEach(function (p) {
      fichas.push({ nodo: p, bloque: b, texto: normalizar(p.textContent) });
    });
  });

  function filtrar() {
    var t = normalizar(caja.value.trim());
    if (!t) {
      fichas.forEach(function (f) { f.nodo.style.display = ''; });
      bloques.forEach(function (b) { b.style.display = ''; });
      indice.style.display = '';
      vacio.classList.remove('visible');
      contador.textContent = '';
      return;
    }
    var partes = t.split(/\\s+/);
    var n = 0;
    fichas.forEach(function (f) {
      var ok = partes.every(function (p) { return f.texto.indexOf(p) !== -1; });
      f.nodo.style.display = ok ? '' : 'none';
      if (ok) n++;
    });
    bloques.forEach(function (b) {
      var visibles = [].slice.call(b.querySelectorAll('.pregunta'))
        .some(function (p) { return p.style.display !== 'none'; });
      b.style.display = visibles ? '' : 'none';
    });
    indice.style.display = 'none';
    vacio.classList.toggle('visible', n === 0);
    contador.textContent = n === 0
      ? ${JSON.stringify(T.sinResultadosPara)} + caja.value.trim() + ${JSON.stringify(T.cierreComilla)}
      : n + (n === 1 ? ${JSON.stringify(T.unaPregunta)} : ${JSON.stringify(T.variasPreguntas)}) + ${JSON.stringify(T.de)} + total;
  }

  caja.addEventListener('input', filtrar);
  caja.addEventListener('search', filtrar);

  // Al cargar, no siempre está vacía: al volver atrás, el navegador restaura
  // lo que hubiera escrito. Sin esto se vería el texto en la caja y la lista
  // entera sin filtrar.
  filtrar();

  // Si se llega con ancla y la pregunta está oculta por un filtro previo,
  // se limpia el filtro para que el enlace profundo siga funcionando.
  window.addEventListener('hashchange', function () {
    if (caja.value) { caja.value = ''; filtrar(); }
    var d = document.querySelector(window.location.hash || '#no');
    if (d) d.scrollIntoView();
  });
})();
</script>
</body>
</html>
`;

fs.writeFileSync(SALIDA, html);
console.log('Escrito ' + T.ruta + '  (' + LANG + ')');
console.log('  secciones: ' + secciones.length);
console.log('  preguntas: ' + total);
console.log('  tamaño:    ' + (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB');
console.log('  JSON-LD:   ' + faqPage.mainEntity.length + ' entradas');
