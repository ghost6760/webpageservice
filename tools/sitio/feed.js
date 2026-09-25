#!/usr/bin/env node
/**
 * feed.xml (Atom): las páginas de contenido del sitio, las más recientes arriba.
 *
 *   node tools/sitio/feed.js              → comprobar (falla si hay desfase)
 *   node tools/sitio/feed.js --escribir   → regenerarlo
 *
 * No se teclea nada: las páginas salen del sitemap.xml, el título y la
 * descripción de la propia página, y la fecha del último commit que la tocó
 * (igual que el lastmod del sitemap). Lo leen agregadores y algunos
 * rastreadores de IA para enterarse de lo nuevo sin recorrer el sitio.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const R = path.join(__dirname, '..', '..');
const DOMINIO = 'https://hachi.live';
const escribir = process.argv.includes('--escribir');

// Fuera del feed: portadas (no son «entradas») y páginas legales.
const FUERA = /^(index\.html|es\/index\.html|privacy-policy\.html|es\/privacy-policy\.html|terms-of-service\.html|es\/terms-of-service\.html|data-deletion\.html)$/;

const hoy = new Date().toISOString().slice(0, 10);
const sucio = new Set(execFileSync('git', ['status', '--porcelain'], { cwd: R, encoding: 'utf8' })
  .split('\n').map((l) => l.slice(3).trim()).filter(Boolean));
const fecha = (p) => {
  if (sucio.has(p)) return hoy;
  return execFileSync('git', ['log', '-1', '--format=%ad', '--date=short', '--', p],
    { cwd: R, encoding: 'utf8' }).trim() || hoy;
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const desHtml = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

const sitemap = fs.readFileSync(path.join(R, 'sitemap.xml'), 'utf8');
const paginas = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(DOMINIO + '/', ''))
  .map((u) => (u === '' || u.endsWith('/') ? u + 'index.html' : u))
  .filter((p) => !FUERA.test(p) && fs.existsSync(path.join(R, p)));

const entradas = paginas.map((p) => {
  const h = fs.readFileSync(path.join(R, p), 'utf8');
  const head = h.split('</head>')[0];
  const titulo = desHtml((head.match(/<title>([^<]+)<\/title>/) || [])[1] || p);
  const desc = desHtml((head.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '');
  const lang = (h.match(/<html lang="([a-z]+)"/) || [])[1] || 'en';
  const url = DOMINIO + '/' + p.replace(/(^|\/)index\.html$/, '$1');
  return { url, titulo, desc, lang, fecha: fecha(p) };
}).sort((a, b) => b.fecha.localeCompare(a.fecha) || a.url.localeCompare(b.url));

const actualizado = entradas.reduce((m, e) => (e.fecha > m ? e.fecha : m), '2000-01-01');

function generar() {
  return `<?xml version="1.0" encoding="utf-8"?>
<!-- Generado por tools/sitio/feed.js. No editar a mano: se regenera. -->
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Hachi · AI receptionist</title>
  <subtitle>Guides, industry pages and answers about AI receptionists that book into a real calendar.</subtitle>
  <link rel="self" type="application/atom+xml" href="${DOMINIO}/feed.xml"/>
  <link rel="alternate" type="text/html" href="${DOMINIO}/"/>
  <id>${DOMINIO}/feed.xml</id>
  <updated>${actualizado}T00:00:00Z</updated>
  <author><name>Hachi</name><uri>${DOMINIO}/</uri></author>
  <icon>${DOMINIO}/icons/favicon-96x96.png</icon>
  <logo>${DOMINIO}/icons/icon-512x512.png</logo>
${entradas.map((e) => `  <entry xml:lang="${e.lang}">
    <title>${esc(e.titulo)}</title>
    <link rel="alternate" type="text/html" hreflang="${e.lang}" href="${e.url}"/>
    <id>${e.url}</id>
    <updated>${e.fecha}T00:00:00Z</updated>
    <summary>${esc(e.desc)}</summary>
  </entry>`).join('\n')}
</feed>
`;
}

if (escribir) {
  fs.writeFileSync(path.join(R, 'feed.xml'), generar());
  console.log('feed.xml regenerado · ' + entradas.length + ' entradas');
  process.exit(0);
}
const actual = fs.existsSync(path.join(R, 'feed.xml')) ? fs.readFileSync(path.join(R, 'feed.xml'), 'utf8') : '';
if (actual === generar()) { console.log('✅ feed.xml al día · ' + entradas.length + ' entradas'); process.exit(0); }
console.log('✗ feed.xml desfasado → node tools/sitio/feed.js --escribir'); process.exit(1);
