/**
 * Genera /es/preguntas.html a partir de datos.js.
 *
 * El HTML visible y el JSON-LD (FAQPage) salen del MISMO array, así que no
 * pueden divergir. Marcar en el schema una respuesta que no está en la página
 * es lo que Google considera marcado engañoso.
 */
const fs = require('fs');
const path = require('path');
const secciones = require('./datos.js');

const SALIDA = path.join(__dirname, '..', '..', 'es', 'preguntas.html');

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
  name: 'Preguntas frecuentes sobre Hachi',
  url: 'https://hachi.live/es/preguntas.html',
  inLanguage: 'es-ES',
  mainEntity: []
};
secciones.forEach((s) => s.preguntas.forEach((p) => {
  faqPage.mainEntity.push({
    '@type': 'Question',
    name: p.q,
    url: 'https://hachi.live/es/preguntas.html#' + slug(p.q),
    acceptedAnswer: { '@type': 'Answer', text: aTexto(p.r) }
  });
}));

const migas = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://hachi.live/es/' },
    { '@type': 'ListItem', position: 2, name: 'Preguntas frecuentes',
      item: 'https://hachi.live/es/preguntas.html' }
  ]
};

// ── HTML ───────────────────────────────────────────────────────────
const indice = secciones.map((s, i) =>
  `      <a href="#s${i + 1}"><span>${s.icono}</span>${s.seccion}
        <em>${s.preguntas.length}</em></a>`).join('\n');

const cuerpo = secciones.map((s, i) => `
<section class="bloque" id="s${i + 1}">
  <h2><span aria-hidden="true">${s.icono}</span> ${s.seccion}</h2>
  <p class="intro">${s.intro}</p>
${s.preguntas.map((p) => `
  <article class="pregunta" id="${slug(p.q)}">
    <h3>${p.q}<a class="ancla" href="#${slug(p.q)}" aria-label="Enlace a esta pregunta">#</a></h3>
    <div class="respuesta">
${p.r.split('\n').map((l) => '      ' + l.trim()).filter((l) => l.trim()).join('\n')}
    </div>
  </article>`).join('\n')}
</section>`).join('\n');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Preguntas frecuentes sobre Hachi · Precios, WhatsApp API, agenda y RGPD</title>
<meta name="description" content="${total} preguntas respondidas sobre Hachi: precios y planes, WhatsApp Business API y la ventana de 24 h, migrar tu número, cómo agenda las citas, ausencias y RGPD.">
<link rel="canonical" href="https://hachi.live/es/preguntas.html">
<link rel="alternate" hreflang="es" href="https://hachi.live/es/preguntas.html">
<link rel="icon" href="/favicon.ico">

<meta property="og:type" content="website">
<meta property="og:url" content="https://hachi.live/es/preguntas.html">
<meta property="og:title" content="Preguntas frecuentes sobre Hachi">
<meta property="og:description" content="Precios, WhatsApp API, tu número, cómo agenda las citas, ausencias, RGPD e implantación. Respondido entero, incluida la parte que juega en nuestra contra.">
<meta property="og:image" content="https://hachi.live/images/og-image.png">

<script type="application/ld+json">
${JSON.stringify(faqPage, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(migas, null, 2)}
</script>

<style>
:root{
  --violeta:#8B5CF6; --violeta-osc:#7C3AED; --cian:#06B6D4;
  --verde:#10B981; --ambar:#F59E0B;
  --fondo:#0a0a0f; --panel:#13131c; --panel2:#1b1b27;
  --borde:#2a2a3a; --texto:#E5E7EB; --tenue:#9CA3AF;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
  background:var(--fondo);color:var(--texto);line-height:1.65;
  -webkit-font-smoothing:antialiased}
a{color:var(--cian);text-decoration:none}
a:hover{text-decoration:underline}
.envoltorio{max-width:920px;margin:0 auto;padding:0 20px}

.nav{border-bottom:1px solid var(--borde);padding:16px 0;position:sticky;top:0;
  background:rgba(10,10,15,.93);backdrop-filter:blur(8px);z-index:20}
.nav .envoltorio{display:flex;align-items:center;justify-content:space-between;gap:16px}
.marca{font-weight:700;font-size:1.2rem;color:#fff}
.marca span{background:linear-gradient(90deg,var(--violeta),var(--cian));
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}

.migas{font-size:.82rem;color:var(--tenue);padding:18px 0 0}
.migas a{color:var(--tenue)}

header.hero{padding:26px 0 26px}
h1{font-size:2.15rem;line-height:1.2;margin-bottom:14px;color:#fff}
h1 em{font-style:normal;background:linear-gradient(90deg,var(--violeta),var(--cian));
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.entradilla{color:var(--tenue);font-size:1.05rem;max-width:680px}

.buscador{position:relative;margin:22px 0 6px}
.buscador input{width:100%;padding:13px 16px 13px 44px;background:var(--panel);
  border:1px solid var(--borde);border-radius:12px;color:var(--texto);
  font-size:1rem;font-family:inherit}
.buscador input:focus{outline:2px solid var(--violeta);outline-offset:1px}
.buscador::before{content:"🔍";position:absolute;left:15px;top:50%;
  transform:translateY(-50%);opacity:.6;font-size:.95rem}
.contador{font-size:.83rem;color:var(--tenue);min-height:20px;margin-bottom:20px}

.indice{background:var(--panel);border:1px solid var(--borde);border-radius:14px;
  padding:18px 20px;margin-bottom:34px}
.indice h2{font-size:.78rem;text-transform:uppercase;letter-spacing:.06em;
  color:var(--tenue);margin-bottom:12px;font-weight:600}
.indice div{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:4px}
.indice a{display:flex;align-items:center;gap:9px;padding:7px 9px;border-radius:8px;
  color:var(--texto);font-size:.92rem}
.indice a:hover{background:var(--panel2);text-decoration:none}
.indice a em{margin-left:auto;font-style:normal;font-size:.76rem;color:var(--tenue);
  background:var(--panel2);border-radius:20px;padding:1px 8px}

.bloque{margin-bottom:46px;scroll-margin-top:80px}
.bloque h2{font-size:1.5rem;color:#fff;margin-bottom:6px;
  padding-bottom:12px;border-bottom:1px solid var(--borde)}
.bloque .intro{color:var(--tenue);font-size:.95rem;margin:12px 0 24px}

.pregunta{margin-bottom:26px;scroll-margin-top:80px}
.pregunta h3{font-size:1.1rem;color:#fff;margin-bottom:8px;line-height:1.4}
.pregunta h3 .ancla{opacity:0;margin-left:8px;color:var(--violeta);
  font-weight:400;transition:opacity .15s}
.pregunta:hover h3 .ancla,.pregunta h3 .ancla:focus{opacity:1}
.pregunta:target h3{color:var(--cian)}
.respuesta{color:var(--tenue);font-size:.97rem}
.respuesta p+p,.respuesta ul,.respuesta ol{margin-top:11px}
.respuesta ul,.respuesta ol{margin-left:22px}
.respuesta li{margin-bottom:6px}
.respuesta strong{color:var(--texto)}

.sinresultados{display:none;padding:34px 0;text-align:center;color:var(--tenue)}
.sinresultados.visible{display:block}

.cta{text-align:center;padding:38px 22px 42px;margin:10px 0 50px;
  background:linear-gradient(135deg,rgba(139,92,246,.12),rgba(6,182,212,.10));
  border:1px solid rgba(139,92,246,.28);border-radius:20px}
.cta h2{font-size:1.45rem;color:#fff;margin-bottom:8px}
.cta p{color:var(--tenue);max-width:520px;margin:0 auto 20px;font-size:.97rem}
.boton{display:inline-block;padding:14px 30px;border-radius:10px;font-weight:600;
  background:linear-gradient(90deg,var(--violeta),var(--violeta-osc));color:#fff}
.boton:hover{text-decoration:none;opacity:.92}
.boton.sec{background:transparent;border:1px solid var(--borde);color:var(--texto);
  margin-left:10px}

footer{border-top:1px solid var(--borde);padding:26px 0;color:var(--tenue);
  font-size:.87rem;text-align:center}

@media(max-width:640px){
  h1{font-size:1.6rem}
  .indice div{grid-template-columns:1fr}
  .boton.sec{margin-left:0;margin-top:10px}
}
</style>
</head>
<body>

<nav class="nav">
  <div class="envoltorio">
    <a href="/es/" class="marca">Hachi<span>.</span></a>
    <div>
      <a href="/es/calculadora.html" style="margin-right:16px">Calculadora</a>
      <a href="/es/#precios">Ver planes →</a>
    </div>
  </div>
</nav>

<div class="envoltorio">

<nav class="migas" aria-label="Ruta">
  <a href="/es/">Inicio</a> › Preguntas frecuentes
</nav>

<header class="hero">
  <h1>Todo lo que preguntan antes de <em>contratar</em></h1>
  <p class="entradilla">
    ${total} preguntas respondidas enteras, incluidas las que juegan en nuestra
    contra: qué pierdes si migras tu número, cuándo <strong>no</strong> te compensa
    contratarnos y en qué caso una herramienta de 29 € es la decisión correcta.
  </p>
</header>

<div class="buscador">
  <input type="search" id="q" placeholder="Buscar: precio, número, RGPD, ausencias…"
         aria-label="Buscar entre las preguntas" autocomplete="off">
</div>
<p class="contador" id="contador" role="status" aria-live="polite"></p>

<nav class="indice" id="indice" aria-label="Índice de secciones">
  <h2>Por temas</h2>
  <div>
${indice}
  </div>
</nav>

<p class="sinresultados" id="sinresultados">
  No hay ninguna pregunta con ese texto.<br>
  Escríbenos y te la respondemos: <a href="/es/#contacto">formulario de contacto</a>.
</p>
${cuerpo}

<div class="cta">
  <h2>¿No está tu pregunta?</h2>
  <p>
    Escríbenos y te la respondemos con tu caso concreto. Y si quieres números
    en vez de respuestas, la calculadora hace la cuenta con los tuyos.
  </p>
  <a href="/es/#contacto" class="boton">Solicitar una demostración</a>
  <a href="/es/calculadora.html" class="boton sec">📊 Calcular mi retorno</a>
</div>

</div>

<footer>
  <div class="envoltorio">
    Hachi · <a href="/es/">Inicio</a> · <a href="/es/#precios">Planes</a> ·
    <a href="/es/calculadora.html">Calculadora</a> ·
    <a href="/es/privacy-policy.html">Privacidad</a>
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
      ? 'Sin resultados para «' + caja.value.trim() + '»'
      : n + (n === 1 ? ' pregunta' : ' preguntas') + ' de ' + total;
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
console.log('Escrito ' + SALIDA);
console.log('  secciones: ' + secciones.length);
console.log('  preguntas: ' + total);
console.log('  tamaño:    ' + (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB');
console.log('  JSON-LD:   ' + faqPage.mainEntity.length + ' entradas');
