/**
 * Genera las seis páginas de contenido (tres temas × dos idiomas).
 *
 *   node tools/paginas/generar.js
 */
const fs = require('fs');
const path = require('path');
const { construir, slugificar, ETIQUETAS_FAQ } = require('./plantilla.js');

const RAIZ = path.join(__dirname, '..', '..');
const DIR = path.join(__dirname, 'contenido');

const paginas = fs.readdirSync(DIR).filter((f) => f.endsWith('.js')).sort()
  .map((f) => require(path.join(DIR, f)));

// ── comprobaciones antes de escribir nada ──────────────────────────
const rutas = new Set();
paginas.forEach((p) => {
  const donde = p.ruta;
  const exigir = (cond, msg) => { if (!cond) throw new Error(donde + ': ' + msg); };

  exigir(!rutas.has(p.ruta), 'ruta duplicada');
  rutas.add(p.ruta);
  exigir(/^(es\/)?[a-z0-9-]+\.html$/.test(p.ruta), 'ruta con formato raro');
  exigir(p.lang === 'es' || p.lang === 'en', 'idioma desconocido');
  exigir(p.titulo.length <= 75, 'title de ' + p.titulo.length + ' caracteres (máx. 75)');
  exigir(p.descripcion.length >= 110 && p.descripcion.length <= 175,
    'meta description de ' + p.descripcion.length + ' caracteres (110-175)');
  exigir(p.bloques.length >= 3, 'menos de 3 secciones');
  exigir(p.relacionadas.length >= 2, 'menos de 2 enlaces relacionados');

  // El JSON-LD de las preguntas sólo admite un subconjunto de HTML.
  (p.faq || []).forEach((f) => {
    const anclas = new Set();
    exigir(!anclas.has(slugificar(f.q)), 'ancla de pregunta duplicada');
    anclas.add(slugificar(f.q));
    (f.r.match(/<\/?([a-zA-Z]+)/g) || []).forEach((t) => {
      const n = t.replace(/<\/?/, '').toLowerCase();
      exigir(ETIQUETAS_FAQ.indexOf(n) !== -1,
        'etiqueta <' + n + '> no admitida por schema.org en «' + f.q + '»');
    });
  });

  // Etiquetas equilibradas en el cuerpo.
  const todo = p.bloques.map((b) => b.html).join('') + (p.faq || []).map((f) => f.r).join('');
  ['p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'div', 'table', 'tr', 'td', 'th',
   'blockquote', 'h3', 'thead', 'tbody', 'section'].forEach((t) => {
    const a = (todo.match(new RegExp('<' + t + '(?=[\\s>])', 'g')) || []).length;
    const b = (todo.match(new RegExp('</' + t + '>', 'g')) || []).length;
    exigir(a === b, '<' + t + '> desequilibrado (' + a + '/' + b + ')');
  });
});

// Los pares de idioma deben apuntarse entre sí.
paginas.forEach((p) => {
  const par = paginas.find((q) => q.ruta === p.alterna.ruta);
  if (!par) throw new Error(p.ruta + ': su alterna ' + p.alterna.ruta + ' no existe');
  if (par.alterna.ruta !== p.ruta) {
    throw new Error(p.ruta + ': el hreflang no es recíproco con ' + par.ruta);
  }
});

// ── escritura ──────────────────────────────────────────────────────
paginas.forEach((p) => {
  const html = construir(p);
  const destino = path.join(RAIZ, p.ruta);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, html);
  console.log('  ' + p.ruta.padEnd(42) +
    (Buffer.byteLength(html) / 1024).toFixed(1).padStart(6) + ' KB' +
    ('  ' + p.bloques.length + ' secciones, ' + (p.faq || []).length + ' preguntas'));
});
console.log('\n' + paginas.length + ' páginas generadas.');
