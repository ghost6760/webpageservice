/**
 * Verifica /es/preguntas.html:
 *  - el JSON-LD y el HTML visible dicen lo mismo (marcado no engañoso)
 *  - anclas únicas y enlazables
 *  - el buscador funciona (ejecutado contra un DOM simulado)
 *  - coherencia de cifras con la landing, la calculadora y el modelo económico
 *  - no se ha filtrado nada del espacio de la solución
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const R = path.join(__dirname, '..', '..');
const HTML = fs.readFileSync(path.join(R, 'es/preguntas.html'), 'utf8');

let fallos = 0, ok = 0;
const c = (d, cond, det) => cond
  ? (ok++, console.log('  ✓ ' + d))
  : (fallos++, console.log('  ✗ ' + d + (det ? '  → ' + det : '')));

const soloMarcado = (h) => h
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/<style[\s\S]*?<\/style>/g, '');

// ─────────────────────────────────────────────── 1. estructura
console.log('\n[1] Estructura HTML');
['div', 'section', 'article', 'p', 'ul', 'ol', 'li', 'h2', 'h3', 'nav'].forEach((t) => {
  const m = soloMarcado(HTML);
  const a = (m.match(new RegExp('<' + t + '(?=[\\s>])', 'g')) || []).length;
  const b = (m.match(new RegExp('</' + t + '>', 'g')) || []).length;
  c('<' + t + '> equilibrado (' + a + '/' + b + ')', a === b);
});
c('lang="es"', /<html lang="es">/.test(HTML));
c('un solo <h1>', (HTML.match(/<h1[\s>]/g) || []).length === 1);

// ─────────────────────────────────────────────── 2. anclas
console.log('\n[2] Anclas de pregunta');
const anclas = (HTML.match(/<article class="pregunta" id="([^"]+)"/g) || [])
  .map((s) => s.match(/id="([^"]+)"/)[1]);
c('75 preguntas', anclas.length === 75, anclas.length + '');
c('todas las anclas son únicas', new Set(anclas).size === anclas.length,
  anclas.length - new Set(anclas).size + ' duplicadas');
c('sin acentos ni signos en las anclas',
  anclas.every((a) => /^[a-z0-9-]+$/.test(a)),
  anclas.filter((a) => !/^[a-z0-9-]+$/.test(a)).join(', '));
c('ninguna ancla vacía o truncada a nada', anclas.every((a) => a.length >= 3));
// cada pregunta tiene su enlace de ancla propio
anclas.forEach(() => {});
const enlacesAncla = (HTML.match(/class="ancla" href="#([^"]+)"/g) || [])
  .map((s) => s.match(/#([^"]+)/)[1]);
c('cada pregunta enlaza a su propia ancla',
  JSON.stringify(enlacesAncla) === JSON.stringify(anclas));

// ─────────────────────────────────────────────── 3. JSON-LD ↔ HTML
console.log('\n[3] JSON-LD frente al contenido visible');
const bloquesLd = [...HTML.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((m) => m[1]);
c('dos bloques JSON-LD', bloquesLd.length === 2, bloquesLd.length + '');

let faq = null, migas = null;
try {
  const parsed = bloquesLd.map((b) => JSON.parse(b));
  faq = parsed.find((p) => p['@type'] === 'FAQPage');
  migas = parsed.find((p) => p['@type'] === 'BreadcrumbList');
  c('ambos bloques parsean como JSON', true);
} catch (e) {
  c('ambos bloques parsean como JSON', false, e.message);
}
c('hay un FAQPage', !!faq);
c('hay un BreadcrumbList', !!migas);
c('FAQPage con 75 Question', faq && faq.mainEntity.length === 75,
  faq ? faq.mainEntity.length + '' : '—');
c('canónica del FAQPage correcta',
  faq && faq.url === 'https://hachi.live/es/preguntas.html');
c('inLanguage es-ES', faq && faq.inLanguage === 'es-ES');

// El texto de cada respuesta del schema DEBE estar en la página.
// Se compara sobre el texto visible normalizado.
const visible = soloMarcado(HTML).replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ');

// Se compara sin espacios: al quitar las etiquetas del HTML quedan espacios
// donde había un <strong>, y eso no es una divergencia de contenido.
const sinEspacios = (s) => s.replace(/\s+/g, '');
const visibleCompacto = sinEspacios(visible);

let desalineadas = [];
let preguntasAusentes = [];
if (faq) {
  faq.mainEntity.forEach((e) => {
    if (visibleCompacto.indexOf(sinEspacios(e.name)) === -1) preguntasAusentes.push(e.name);
    // se comprueba un fragmento largo y distintivo de la respuesta
    // El schema conserva el marcado permitido; se compara el texto legible.
    const plano = e.acceptedAnswer.text.replace(/<[^>]+>/g, ' ');
    const frag = sinEspacios(plano).slice(0, 90);
    if (frag.length > 30 && visibleCompacto.indexOf(frag) === -1) desalineadas.push(e.name);
  });
}
c('toda pregunta del schema aparece visible en la página',
  preguntasAusentes.length === 0, preguntasAusentes.slice(0, 3).join(' | '));
c('toda respuesta del schema aparece visible en la página',
  desalineadas.length === 0, desalineadas.slice(0, 3).join(' | '));
c('ninguna respuesta del schema queda vacía',
  faq && faq.mainEntity.every((e) => e.acceptedAnswer.text.trim().length >= 40));
c('cada Question del schema apunta a su ancla real',
  faq && faq.mainEntity.every((e) => {
    const id = (e.url.split('#')[1] || '');
    return anclas.indexOf(id) !== -1;
  }));
// schema.org admite un subconjunto de HTML en acceptedAnswer.text; cualquier
// otra etiqueta invalida el marcado.
const PERMITIDAS = ['p','ul','ol','li','strong','em','a','br'];
const usadas = new Set();
if (faq) faq.mainEntity.forEach((e) =>
  (e.acceptedAnswer.text.match(/<\/?([a-zA-Z]+)/g) || [])
    .forEach((t) => usadas.add(t.replace(/<\/?/, '').toLowerCase())));
c('el schema sólo usa etiquetas admitidas por schema.org',
  [...usadas].every((t) => PERMITIDAS.indexOf(t) !== -1),
  [...usadas].filter((t) => PERMITIDAS.indexOf(t) === -1).join(', '));
c('los enlaces del schema son absolutos',
  faq && !faq.mainEntity.some((e) => /href="\/(?!\/)/.test(e.acceptedAnswer.text)));
c('sin etiquetas sin cerrar en el schema',
  faq && faq.mainEntity.every((e) => {
    const t = e.acceptedAnswer.text;
    return PERMITIDAS.filter((x) => x !== 'br').every((x) =>
      (t.match(new RegExp('<' + x + '(?=[\\s>])', 'g')) || []).length ===
      (t.match(new RegExp('</' + x + '>', 'g')) || []).length);
  }));

// ─────────────────────────────────────────────── 4. buscador
console.log('\n[4] El buscador, ejecutado');
const script = (HTML.match(/<script>\s*\n\(function[\s\S]*?<\/script>/) || [])[0]
  .replace(/^<script>\s*/, '').replace(/<\/script>$/, '');

function nodoFalso(texto) {
  return { textContent: texto, style: {}, querySelectorAll: () => [],
           classList: { add() {}, remove() {}, toggle() {} } };
}
function correrBuscador(consulta) {
  // Se reconstruye una página mínima con las preguntas reales.
  const preguntas = [...HTML.matchAll(
    /<article class="pregunta" id="[^"]+">([\s\S]*?)<\/article>/g)]
    .map((m) => nodoFalso(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')));

  const porBloque = [];
  let i = 0;
  const conteos = (HTML.match(/<section class="bloque"[\s\S]*?(?=<section class="bloque"|<div class="cta")/g) || [])
    .map((s) => (s.match(/<article class="pregunta"/g) || []).length);
  conteos.forEach((n) => {
    const propias = preguntas.slice(i, i + n); i += n;
    porBloque.push({ style: {}, querySelectorAll: () => propias });
  });

  const caja = { value: consulta, addEventListener() {} };
  const contador = nodoFalso(''); const vacio = nodoFalso('');
  const indice = { style: {} };

  const doc = {
    getElementById(id) {
      return { q: caja, contador: contador, sinresultados: vacio, indice: indice }[id];
    },
    querySelectorAll(sel) { return sel === '.bloque' ? porBloque : []; },
    querySelector() { return null; }
  };
  const sandbox = { document: doc, window: { addEventListener() {}, location: { hash: '' } } };
  sandbox.window.document = doc;
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox, { timeout: 5000 });
  const visibles = preguntas.filter((p) => p.style.display !== 'none').length;
  return { visibles, contador: contador.textContent, total: preguntas.length };
}

let r;
try { r = correrBuscador(''); c('el script del buscador corre sin lanzar', true); }
catch (e) { c('el script del buscador corre sin lanzar', false, e.message); r = null; }

if (r) {
  c('sin filtro se ven las 75', r.visibles === 75, r.visibles + '');
  const rp = correrBuscador('precio');
  c('«precio» encuentra preguntas', rp.visibles > 0 && rp.visibles < 75,
    rp.visibles + '');
  const ra = correrBuscador('numero');           // sin tilde
  const rb = correrBuscador('número');           // con tilde
  c('la búsqueda ignora acentos («numero» = «número»)',
    ra.visibles === rb.visibles && ra.visibles > 0,
    ra.visibles + ' vs ' + rb.visibles);
  const rc = correrBuscador('RGPD');
  c('la búsqueda ignora mayúsculas', rc.visibles > 0, rc.visibles + '');
  const rd = correrBuscador('ventana 24 horas');  // varios términos
  c('varios términos se combinan con Y', rd.visibles > 0 && rd.visibles < 10,
    rd.visibles + '');
  const re = correrBuscador('zzzzqqq');
  c('sin resultados no rompe', re.visibles === 0);
  c('el contador informa del subconjunto', /de 75$/.test(rp.contador), rp.contador);
}

// ─────────────────────────────────────────────── 5. cifras coherentes
console.log('\n[5] Coherencia de cifras con la landing y la calculadora');
const landing = fs.readFileSync(path.join(R, 'es/index.html'), 'utf8');

c('ROI en margen (2/3/6/8), NO en ingreso (1/2/4/5)',
  /2 citas para Autónomo, 3 para Esencial, 6 para Profesional y 8 para/.test(
    HTML.replace(/\s+/g, ' ')));
c('no aparece la tabla vieja 1/2/4/5',
  !/1 cita para Autónomo|Autónomo.*?<strong>1<\/strong>/s.test(HTML));
c('menciona el margen de contribución del 65 %',
  /margen de contribución del 65 %/.test(HTML.replace(/\s+/g, ' ')));

[['149', 'Autónomo'], ['390', 'Esencial'], ['690', 'Profesional'],
 ['990', 'Clínica Completa']].forEach(([p, n]) => {
  c('precio ' + n + ' = ' + p + ' € coincide con la landing',
    HTML.includes(p + ' €') && landing.includes(p + ' €'));
});
c('implantación 290–1.690 €', /290 € a 1\.690 €/.test(HTML));
c('extras 0,25 €/conversación y 0,20 €/minuto',
  HTML.includes('0,25 €') && HTML.includes('0,20 €'));
c('conversaciones por plan 250/750/1.500/3.000',
  ['250 conversaciones', '750 conversaciones', '1.500 conversaciones',
   '3.000 conversaciones'].every((s) => HTML.includes(s)));
c('rango de ausencias evitables 40–60 %', /40 % al 60 %/.test(HTML));
c('usa el 40 % (extremo bajo) como supuesto', /el 40 %.*extremo bajo/s.test(HTML));
c('demo 20 minutos y prueba 7 días',
  /20 minutos/.test(HTML) && /7 días/.test(HTML));
c('3 a 5 días laborables de montaje', /3 a 5 días laborables/.test(HTML));
c('recepcionista 25.000–35.000 €', /25\.000 € y 35\.000 €/.test(HTML));

// ─────────────────────────────────────────────── 6. nada del espacio-solución
console.log('\n[6] No se ha filtrado el espacio de la solución');
const prohibido = ['SAGA', 'LangGraph', 'langgraph', 'checkpointer', 'Redis',
  'PostgreSQL', 'invariante', 'invariantes', 'gap_decomposer', 'router_hub',
  'nodo de reflexión', 'Pydantic', 'neuro-simbólic', 'company_id',
  'OpenAI', 'Gemini', 'gpt-4', 'embedding'];
const filtrados = prohibido.filter((p) => HTML.includes(p));
c('sin detalles de arquitectura ni de proveedores',
  filtrados.length === 0, filtrados.join(', '));
c('describe QUÉ garantiza, no CÓMO se construye',
  /es código que se ejecuta siempre/.test(HTML));

// ─────────────────────────────────────────────── 7. SEO
console.log('\n[7] SEO y enlaces');
c('canonical propio',
  /rel="canonical" href="https:\/\/hachi\.live\/es\/preguntas\.html"/.test(HTML));
const titulo = (HTML.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
c('title presente y <= 75 caracteres', titulo.length > 0 && titulo.length <= 75,
  titulo.length + ': ' + titulo);
const desc = (HTML.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
c('meta description entre 120 y 175 caracteres',
  desc.length >= 120 && desc.length <= 175, desc.length + '');
c('og:url correcta', /og:url" content="https:\/\/hachi\.live\/es\/preguntas\.html"/.test(HTML));
c('miga de pan visible además del schema', /<nav class="migas"/.test(HTML));

['/es/', '/es/#precios', '/es/#contacto', '/es/calculadora.html'].forEach((h) => {
  c('enlaza a ' + h, HTML.includes('href="' + h + '"'));
});
const externos = (HTML.match(/(?:src|href)="https?:\/\/(?!hachi\.live)[^"]+"/g) || [])
  .filter((u) => !/schema\.org/.test(u));
c('sin recursos externos', externos.length === 0, externos.join(' '));
c('sin <script src=>', !/<script[^>]+\bsrc=/.test(HTML));

// índice de secciones
const enlacesIndice = (HTML.match(/<a href="#s\d+"/g) || []).length;
c('índice con 9 secciones', enlacesIndice === 9, enlacesIndice + '');
c('las 9 secciones existen',
  [1,2,3,4,5,6,7,8,9].every((i) => HTML.includes('id="s' + i + '"')));

console.log('\n' + '─'.repeat(60));
console.log(fallos === 0 ? '✅ TODO OK — ' + ok + ' comprobaciones'
                         : '❌ ' + fallos + ' fallos de ' + (ok + fallos));
process.exit(fallos === 0 ? 0 : 1);
