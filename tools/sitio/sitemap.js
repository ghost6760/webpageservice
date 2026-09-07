/**
 * Genera y comprueba el sitemap.xml a partir del árbol de páginas.
 *
 *   node tools/sitio/sitemap.js              comprobar (falla si hay desfase)
 *   node tools/sitio/sitemap.js --escribir   regenerarlo
 *
 * POR QUÉ GENERAR Y COMPROBAR VIVEN EN EL MISMO FICHERO
 * ----------------------------------------------------
 * Porque el fallo que este script existe para evitar fue exactamente que las
 * dos cosas se separaran. El 05-08 se escribió el sitemap a mano; el 06-08 el
 * commit `daac3cd` («unifica las 15 paginas internas con el sistema de diseno»)
 * tocó 15 de las 17 páginas y nadie volvió al sitemap. Resultado: 15 de 17
 * `lastmod` declaraban una fecha anterior al cambio real, durante un mes.
 *
 * Un `lastmod` que miente es peor que no ponerlo: Google evalúa si la fecha es
 * fiable y, cuando no lo es, descarta el `lastmod` de TODO el fichero. El
 * sitemap deja entonces de decir «esto ha cambiado, vuelve a rastrearlo» y
 * queda como una lista de URLs sin señal ninguna.
 *
 * DE DÓNDE SALE CADA DATO — ninguno se escribe a mano
 * ---------------------------------------------------
 *   · la lista de URLs → los ficheros .html que existen;
 *   · `lastmod`        → la fecha del último commit que tocó ese fichero, o hoy
 *                        si tiene cambios sin commitear;
 *   · los `xhtml:link` → las etiquetas hreflang de la propia página.
 *
 * Lo último es lo que impide la contradicción clásica: que el HTML diga que la
 * versión española de una página es una, y el sitemap diga que es otra. Si sólo
 * hay una fuente, no pueden discrepar.
 *
 * NO SE EMITEN `changefreq` NI `priority` a propósito. Google dejó de usarlos
 * hace años y lo ha dicho en público; mantenerlos sólo añade ruido y refuerza la
 * impresión de fichero autogenerado sin cuidado, que es justo lo que hace que se
 * desconfíe también del `lastmod`.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const R = path.join(__dirname, '..', '..');
const DOMINIO = 'https://hachi.live';
const escribir = process.argv.includes('--escribir');

let fallos = 0, ok = 0;
const c = (d, cond, det) => cond
  ? (ok++, console.log('  ✓ ' + d))
  : (fallos++, console.log('  ✗ ' + d + (det ? '  → ' + det : '')));

// ── Las páginas publicadas ─────────────────────────────────────────
// Sólo la raíz y /es/: docs/ y tools/ no se publican.
const paginas = [
  ...fs.readdirSync(R).filter((f) => f.endsWith('.html')),
  ...fs.readdirSync(path.join(R, 'es')).filter((f) => f.endsWith('.html')).map((f) => 'es/' + f),
].sort();

const aUrl = (p) => DOMINIO + '/' + p.replace(/(^|\/)index\.html$/, '$1');

// ── Fecha real del último cambio ───────────────────────────────────
const hoy = new Date().toISOString().slice(0, 10);
const sucio = new Set(
  execFileSync('git', ['status', '--porcelain'], { cwd: R, encoding: 'utf8' })
    .split('\n').map((l) => l.slice(3).trim()).filter(Boolean));

function ultimoCambio(p) {
  if (sucio.has(p)) return hoy;            // modificado y aún sin commitear
  const f = execFileSync('git', ['log', '-1', '--format=%ad', '--date=short', '--', p],
    { cwd: R, encoding: 'utf8' }).trim();
  return f || hoy;                          // fichero nuevo sin historial
}

// ── Lo que la propia página declara ────────────────────────────────
function cabecera(p) {
  const html = fs.readFileSync(path.join(R, p), 'utf8');
  const head = html.split('</head>')[0];
  const canonical = (head.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/) || [])[1] || null;
  const alternas = [...head.matchAll(/<link[^>]+rel="alternate"[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/g)]
    .map((m) => ({ lang: m[1], href: m[2] }));
  return { canonical, alternas };
}

// ── El sitemap que corresponde al estado actual del sitio ──────────
function generar() {
  const bloques = paginas.map((p) => {
    const { alternas } = cabecera(p);
    const links = alternas.map((a) =>
      `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>`);
    return ['  <url>',
      `    <loc>${aUrl(p)}</loc>`,
      `    <lastmod>${ultimoCambio(p)}</lastmod>`,
      ...links,
      '  </url>'].join('\n');
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generado por tools/sitio/sitemap.js. No editar a mano: se regenera. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${bloques.join('\n\n')}

</urlset>
`;
}

// ═══════════════════════════════════════════════════════════════════
if (escribir) {
  fs.writeFileSync(path.join(R, 'sitemap.xml'), generar());
  console.log(`sitemap.xml regenerado · ${paginas.length} URLs`);
  console.log('Recuerda avisar a los buscadores: bash tools/sitio/indexnow.sh');
  process.exit(0);
}

console.log('\n[cada página se declara a sí misma]');
paginas.forEach((p) => {
  const { canonical, alternas } = cabecera(p);
  const url = aUrl(p);
  c(`${p} tiene canonical`, !!canonical);
  if (canonical) c(`${p} canonical apunta a su propia URL`, canonical === url, canonical);
  // Si declara alternas, una de ellas tiene que ser ella misma: es lo que
  // convierte el grupo en recíproco y sin eso Google descarta el conjunto.
  if (alternas.length) {
    c(`${p} se incluye en sus propias alternas`,
      alternas.some((a) => a.href === url), alternas.map((a) => a.lang).join(','));
  }
});

console.log('\n[las alternas son recíprocas]');
const declara = new Map(paginas.map((p) => [aUrl(p), cabecera(p).alternas]));
paginas.forEach((p) => {
  const url = aUrl(p);
  cabecera(p).alternas.filter((a) => a.lang !== 'x-default' && a.href !== url).forEach((a) => {
    const suyas = declara.get(a.href);
    c(`${url} ↔ ${a.href} se apuntan mutuamente`,
      !!suyas && suyas.some((b) => b.href === url),
      suyas ? 'la otra no devuelve el enlace' : 'la otra página no existe');
  });
});

console.log('\n[el sitemap corresponde al sitio]');
const enDisco = fs.readFileSync(path.join(R, 'sitemap.xml'), 'utf8');
const esperado = generar();

const urlsDisco = [...enDisco.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const urlsReales = paginas.map(aUrl);
c('ninguna página publicada falta en el sitemap',
  urlsReales.every((u) => urlsDisco.includes(u)),
  urlsReales.filter((u) => !urlsDisco.includes(u)).join(', '));
c('ninguna URL del sitemap apunta a una página que no existe',
  urlsDisco.every((u) => urlsReales.includes(u)),
  urlsDisco.filter((u) => !urlsReales.includes(u)).join(', '));

// El desfase de lastmod: el fallo concreto que este script vino a evitar.
const fechasDisco = new Map([...enDisco.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)</g)]
  .map((m) => [m[1], m[2]]));
const desfasadas = paginas.filter((p) => fechasDisco.get(aUrl(p)) !== ultimoCambio(p));
c('todos los lastmod coinciden con el último cambio real',
  desfasadas.length === 0,
  desfasadas.map((p) => `${p}: dice ${fechasDisco.get(aUrl(p))}, cambió ${ultimoCambio(p)}`).join(' · '));

c('el sitemap es idéntico al que se generaría ahora',
  enDisco === esperado, 'ejecuta: node tools/sitio/sitemap.js --escribir');

console.log(`\n${ok} bien, ${fallos} mal`);
process.exit(fallos ? 1 : 0);
