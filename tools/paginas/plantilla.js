/**
 * Plantilla compartida de las páginas de contenido.
 *
 * Las seis páginas (tres temas × dos idiomas) salen de aquí, así que la
 * cabecera, el nav, las migas, el pie, el CSS y los tres bloques de JSON-LD son
 * necesariamente idénticos. Copiar y pegar 1.200 líneas de CSS en cada fichero
 * —que es lo que hoy hacen las dos landings— es justo lo que produce que se
 * desincronicen.
 */

const T = {
  es: {
    verPlanes: 'Ver planes →',
    inicio: 'Inicio',
    actualizado: 'Actualizado el',
    enEstaPagina: 'En esta página',
    preguntas: 'Preguntas frecuentes',
    seguirLeyendo: 'Seguir leyendo',
    pie: ['Inicio', 'Planes', 'Calculadora', 'Preguntas'],
    piePaths: ['/es/', '/es/#precios', '/es/calculadora.html', '/es/preguntas.html'],
    otroIdioma: 'English version',
    codigoIdioma: 'EN'
  },
  en: {
    verPlanes: 'See plans →',
    inicio: 'Home',
    actualizado: 'Updated',
    enEstaPagina: 'On this page',
    preguntas: 'Frequently asked questions',
    seguirLeyendo: 'Keep reading',
    pie: ['Home', 'Plans', 'Calculator', 'FAQ'],
    piePaths: ['/', '/#pricing', '/calculator.html', '/es/preguntas.html'],
    otroIdioma: 'Versión en español',
    codigoIdioma: 'ES'
  }
};

const CSS = `
:root{
  --violeta:#8B5CF6; --violeta-osc:#7C3AED; --cian:#06B6D4;
  --verde:#10B981; --ambar:#F59E0B; --rojo:#EF4444;
  --fondo:#0a0a0f; --panel:#13131c; --panel2:#1b1b27;
  --borde:#2a2a3a; --texto:#E5E7EB; --tenue:#9CA3AF;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
  background:var(--fondo);color:var(--texto);line-height:1.7;
  -webkit-font-smoothing:antialiased}
a{color:var(--cian);text-decoration:none}
a:hover{text-decoration:underline}
.envoltorio{max-width:800px;margin:0 auto;padding:0 20px}

.nav{border-bottom:1px solid var(--borde);padding:16px 0;position:sticky;top:0;
  background:rgba(10,10,15,.93);backdrop-filter:blur(8px);z-index:20}
.nav .envoltorio{display:flex;align-items:center;justify-content:space-between;gap:16px;
  max-width:1000px}
.marca{font-weight:700;font-size:1.2rem;color:#fff}
.marca span{background:linear-gradient(90deg,var(--violeta),var(--cian));
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}

.migas{font-size:.82rem;color:var(--tenue);padding:18px 0 0}
.migas a{color:var(--tenue)}

header.cabecera{padding:22px 0 8px}
h1{font-size:2.15rem;line-height:1.22;margin-bottom:16px;color:#fff}
h1 em{font-style:normal;background:linear-gradient(90deg,var(--violeta),var(--cian));
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.entradilla{color:var(--tenue);font-size:1.08rem;line-height:1.65}
.meta{font-size:.8rem;color:var(--tenue);margin-top:16px;opacity:.8}

.sumario{background:var(--panel);border:1px solid var(--borde);border-radius:14px;
  padding:18px 22px;margin:30px 0 8px}
.sumario h2{font-size:.76rem;text-transform:uppercase;letter-spacing:.06em;
  color:var(--tenue);margin-bottom:10px;font-weight:600}
.sumario ol{margin-left:20px}
.sumario li{margin-bottom:4px;font-size:.93rem}

section.bloque{margin-top:44px;scroll-margin-top:80px}
h2{font-size:1.55rem;color:#fff;line-height:1.3}
section.bloque>h2{margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--borde)}
h3{font-size:1.13rem;color:#fff;margin:26px 0 10px}
p{margin-bottom:14px}
ul,ol{margin:0 0 14px 24px}
li{margin-bottom:8px}
strong{color:#fff;font-weight:600}
blockquote{border-left:3px solid var(--violeta);padding:4px 0 4px 18px;margin:20px 0;
  color:var(--texto);font-size:1.05rem}

.destacado{background:var(--panel);border:1px solid var(--borde);
  border-left:3px solid var(--cian);border-radius:10px;padding:18px 20px;margin:22px 0}
.destacado.aviso{border-left-color:var(--ambar)}
.destacado.bien{border-left-color:var(--verde)}
.destacado p:last-child,.destacado ul:last-child,.destacado ol:last-child{margin-bottom:0}

.tabla{overflow-x:auto;margin:22px 0;border:1px solid var(--borde);border-radius:12px}
table{width:100%;border-collapse:collapse;font-size:.92rem}
th,td{padding:10px 14px;text-align:left;border-bottom:1px solid var(--borde);
  vertical-align:top}
thead th{background:var(--panel2);color:var(--tenue);font-size:.78rem;
  text-transform:uppercase;letter-spacing:.04em;white-space:nowrap}
tbody tr:last-child td{border-bottom:none}
td.si{color:var(--verde)} td.no{color:var(--rojo)}
tr.destacada td{background:rgba(139,92,246,.09)}
tr.destacada td:first-child{color:#fff;font-weight:600}

.faq{margin-top:44px}
.faq>h2{margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--borde)}
.faq article{margin-bottom:22px;scroll-margin-top:80px}
.faq h3{font-size:1.06rem;margin:0 0 6px}
.faq .r{color:var(--tenue);font-size:.96rem}
.faq .r p{margin-bottom:10px}

.relacionadas{margin:46px 0 0}
.relacionadas h2{font-size:1.2rem;margin-bottom:14px}
.relacionadas div{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}
.relacionadas a{display:block;padding:15px 17px;background:var(--panel);
  border:1px solid var(--borde);border-radius:12px;color:var(--texto);font-size:.93rem}
.relacionadas a:hover{border-color:var(--violeta);text-decoration:none}
.relacionadas a b{display:block;color:#fff;margin-bottom:3px;font-size:.97rem}
.relacionadas a span{color:var(--tenue);font-size:.86rem}

.cta{text-align:center;padding:36px 22px 40px;margin:46px 0 50px;
  background:linear-gradient(135deg,rgba(139,92,246,.12),rgba(6,182,212,.10));
  border:1px solid rgba(139,92,246,.28);border-radius:20px}
.cta h2{font-size:1.4rem;margin-bottom:8px;border:none;padding:0}
.cta p{color:var(--tenue);max-width:520px;margin:0 auto 20px;font-size:.97rem}
.boton{display:inline-block;padding:14px 30px;border-radius:10px;font-weight:600;
  background:linear-gradient(90deg,var(--violeta),var(--violeta-osc));color:#fff}
.boton:hover{text-decoration:none;opacity:.92}
.boton.sec{background:transparent;border:1px solid var(--borde);color:var(--texto);
  margin-left:10px}

footer{border-top:1px solid var(--borde);padding:26px 0;color:var(--tenue);
  font-size:.87rem;text-align:center}

@media(max-width:640px){
  h1{font-size:1.62rem}
  h2{font-size:1.3rem}
  .boton.sec{margin-left:0;margin-top:10px}
}`;

// ── utilidades compartidas ─────────────────────────────────────────
const slugificar = (s) => s
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[¿?¡!,.:;«»"'()]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 70);

// schema.org admite este subconjunto dentro de acceptedAnswer.
const ETIQUETAS_FAQ = ['p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'br'];

const textoSchema = (html) => html
  .replace(/\s+/g, ' ')
  .replace(/href="\/(?!\/)/g, 'href="https://hachi.live/')
  .trim();

const esc = (s) => String(s)
  .replace(/&(?!(?:[a-zA-Z]+|#\d+);)/g, '&amp;')
  .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── construcción de la página ──────────────────────────────────────
function construir(pag) {
  const t = T[pag.lang];
  const base = 'https://hachi.live';
  const url = base + '/' + pag.ruta;
  const urlAlt = base + '/' + pag.alterna.ruta;
  const raiz = pag.lang === 'es' ? '/es/' : '/';

  // ── JSON-LD ──
  const articulo = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pag.h1.replace(/<[^>]+>/g, ''),
    description: pag.descripcion,
    inLanguage: pag.lang === 'es' ? 'es-ES' : 'en',
    datePublished: pag.publicado,
    dateModified: pag.actualizado,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'Hachi', url: base },
    publisher: { '@type': 'Organization', name: 'Hachi', url: base }
  };

  const migas = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.inicio, item: base + raiz },
      { '@type': 'ListItem', position: 2, name: pag.migaFinal, item: url }
    ]
  };

  const faqLd = pag.faq && pag.faq.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pag.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      url: url + '#' + slugificar(f.q),
      acceptedAnswer: { '@type': 'Answer', text: textoSchema(f.r) }
    }))
  } : null;

  const bloquesLd = [articulo, migas].concat(faqLd ? [faqLd] : [])
    .map((o) => '<script type="application/ld+json">\n' +
                JSON.stringify(o, null, 2) + '\n</script>').join('\n');

  // ── sumario ──
  const sumario = pag.bloques.map((b, i) =>
    `      <li><a href="#b${i + 1}">${b.h2}</a></li>`).join('\n');

  // ── cuerpo ──
  const cuerpo = pag.bloques.map((b, i) => `
<section class="bloque" id="b${i + 1}">
  <h2>${b.h2}</h2>
${b.html.split('\n').map((l) => '  ' + l.trim()).filter((l) => l.trim()).join('\n')}
</section>`).join('\n');

  const faqHtml = (pag.faq && pag.faq.length) ? `
<section class="faq" id="faq">
  <h2>${t.preguntas}</h2>
${pag.faq.map((f) => `  <article id="${slugificar(f.q)}">
    <h3>${f.q}</h3>
    <div class="r">
${f.r.split('\n').map((l) => '      ' + l.trim()).filter((l) => l.trim()).join('\n')}
    </div>
  </article>`).join('\n')}
</section>` : '';

  const relacionadas = pag.relacionadas.length ? `
<nav class="relacionadas" aria-label="${t.seguirLeyendo}">
  <h2>${t.seguirLeyendo}</h2>
  <div>
${pag.relacionadas.map((r) =>
  `    <a href="${r.href}"><b>${r.titulo}</b><span>${r.nota}</span></a>`).join('\n')}
  </div>
</nav>` : '';

  return `<!DOCTYPE html>
<html lang="${pag.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(pag.titulo)}</title>
<meta name="description" content="${esc(pag.descripcion)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="${pag.lang}" href="${url}">
<link rel="alternate" hreflang="${pag.alterna.lang}" href="${urlAlt}">
<link rel="alternate" hreflang="x-default" href="${pag.lang === 'en' ? url : urlAlt}">
<link rel="icon" href="/favicon.ico">

<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(pag.ogTitulo || pag.titulo)}">
<meta property="og:description" content="${esc(pag.descripcion)}">
<meta property="og:image" content="${base}/images/og-image.png">

${bloquesLd}

<style>${CSS}
</style>
</head>
<body>

<nav class="nav">
  <div class="envoltorio">
    <a href="${raiz}" class="marca">Hachi<span>.</span></a>
    <div>
      <a href="/${pag.alterna.ruta}" style="margin-right:16px">${t.codigoIdioma}</a>
      <a href="${pag.lang === 'es' ? '/es/#precios' : '/#pricing'}">${t.verPlanes}</a>
    </div>
  </div>
</nav>

<div class="envoltorio">

<nav class="migas" aria-label="${t.inicio}">
  <a href="${raiz}">${t.inicio}</a> › ${pag.migaFinal}
</nav>

<header class="cabecera">
  <h1>${pag.h1}</h1>
  <p class="entradilla">${pag.entradilla}</p>
  <p class="meta">${t.actualizado} ${pag.actualizado}</p>
</header>

<nav class="sumario" aria-label="${t.enEstaPagina}">
  <h2>${t.enEstaPagina}</h2>
  <ol>
${sumario}
  </ol>
</nav>
${cuerpo}
${faqHtml}
${relacionadas}

<div class="cta">
  <h2>${pag.cta.h2}</h2>
  <p>${pag.cta.p}</p>
  <a href="${pag.lang === 'es' ? '/es/#contacto' : '/#contact'}" class="boton">${pag.cta.boton}</a>
  <a href="${pag.lang === 'es' ? '/es/calculadora.html' : '/calculator.html'}" class="boton sec">${pag.cta.botonSec}</a>
</div>

</div>

<footer>
  <div class="envoltorio">
    Hachi ·
${t.pie.map((n, i) => `    <a href="${t.piePaths[i]}">${n}</a>`).join(' ·\n')} ·
    <a href="/${pag.alterna.ruta}">${t.otroIdioma}</a>
  </div>
</footer>
</body>
</html>
`;
}

module.exports = { construir, slugificar, ETIQUETAS_FAQ, textoSchema };
