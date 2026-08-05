/**
 * Verifica las seis páginas de contenido generadas.
 *
 *   node tools/paginas/verificar.js
 */
const fs = require('fs');
const path = require('path');

const R = path.join(__dirname, '..', '..');
const paginas = fs.readdirSync(path.join(__dirname, 'contenido'))
  .filter((f) => f.endsWith('.js')).sort()
  .map((f) => require(path.join(__dirname, 'contenido', f)));

let fallos = 0, ok = 0;
const c = (d, cond, det) => cond
  ? (ok++, console.log('  ✓ ' + d))
  : (fallos++, console.log('  ✗ ' + d + (det ? '  → ' + det : '')));

const leer = (p) => fs.readFileSync(path.join(R, p), 'utf8');
const soloMarcado = (h) => h
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/<style[\s\S]*?<\/style>/g, '');
const sinEspacios = (s) => s.replace(/\s+/g, '');
const aTextoVisible = (h) => soloMarcado(h).replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');

const html = {};
paginas.forEach((p) => { html[p.ruta] = leer(p.ruta); });

// ───────────────────────────────────────────── 1. estructura
console.log('\n[1] Estructura de cada página');
paginas.forEach((p) => {
  const h = html[p.ruta];
  const m = soloMarcado(h);
  const roto = ['div', 'section', 'p', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th',
    'nav', 'article', 'blockquote', 'thead', 'tbody', 'strong', 'em', 'a']
    .filter((t) => (m.match(new RegExp('<' + t + '(?=[\\s>])', 'g')) || []).length !==
                   (m.match(new RegExp('</' + t + '>', 'g')) || []).length);
  c(p.ruta + ': etiquetas equilibradas', roto.length === 0, roto.join(', '));
  c(p.ruta + ': un solo <h1>', (h.match(/<h1[\s>]/g) || []).length === 1);
  c(p.ruta + ': lang="' + p.lang + '"', h.includes('<html lang="' + p.lang + '">'));
});

// ───────────────────────────────────────────── 2. JSON-LD
console.log('\n[2] JSON-LD y correspondencia con el texto visible');
paginas.forEach((p) => {
  const h = html[p.ruta];
  const bloques = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => m[1]);
  let objetos = null;
  try { objetos = bloques.map((b) => JSON.parse(b)); } catch (e) { objetos = null; }
  c(p.ruta + ': todos los bloques JSON-LD parsean', !!objetos);
  if (!objetos) return;

  const tipos = objetos.map((o) => o['@type']);
  c(p.ruta + ': Article + BreadcrumbList + FAQPage',
    tipos.includes('Article') && tipos.includes('BreadcrumbList') &&
    tipos.includes('FAQPage'), tipos.join(', '));

  const art = objetos.find((o) => o['@type'] === 'Article');
  const url = 'https://hachi.live/' + p.ruta;
  c(p.ruta + ': @id del Article = canónica', art.mainEntityOfPage['@id'] === url);
  c(p.ruta + ': headline sin etiquetas', !/<[a-z/]/i.test(art.headline));
  c(p.ruta + ': headline coincide con el <h1> visible',
    sinEspacios(aTextoVisible(h)).includes(sinEspacios(art.headline)));

  const mig = objetos.find((o) => o['@type'] === 'BreadcrumbList');
  c(p.ruta + ': la miga final apunta a la propia página',
    mig.itemListElement[1].item === url);

  // FAQ: cada respuesta del schema tiene que estar visible en la página.
  const faq = objetos.find((o) => o['@type'] === 'FAQPage');
  const visible = sinEspacios(aTextoVisible(h));
  const fuera = faq.mainEntity.filter((e) => {
    const plano = sinEspacios(e.acceptedAnswer.text.replace(/<[^>]+>/g, ' '));
    return !visible.includes(plano.slice(0, 90));
  }).map((e) => e.name);
  c(p.ruta + ': toda respuesta del schema está en la página',
    fuera.length === 0, fuera.join(' | '));
  c(p.ruta + ': toda pregunta del schema está en la página',
    faq.mainEntity.every((e) => visible.includes(sinEspacios(e.name))));
  c(p.ruta + ': anclas de las preguntas existen',
    faq.mainEntity.every((e) => h.includes('id="' + e.url.split('#')[1] + '"')));
  c(p.ruta + ': enlaces del schema absolutos',
    !faq.mainEntity.some((e) => /href="\/(?!\/)/.test(e.acceptedAnswer.text)));
});

// ───────────────────────────────────────────── 3. hreflang
console.log('\n[3] hreflang recíproco y canónicas');
paginas.forEach((p) => {
  const h = html[p.ruta];
  const url = 'https://hachi.live/' + p.ruta;
  const urlAlt = 'https://hachi.live/' + p.alterna.ruta;
  c(p.ruta + ': canónica propia',
    h.includes('rel="canonical" href="' + url + '"'));
  c(p.ruta + ': se autorreferencia en hreflang',
    h.includes('hreflang="' + p.lang + '" href="' + url + '"'));
  c(p.ruta + ': apunta a su alterna',
    h.includes('hreflang="' + p.alterna.lang + '" href="' + urlAlt + '"'));
  const par = html[p.alterna.ruta];
  c(p.ruta + ': la alterna le devuelve el hreflang',
    par.includes('hreflang="' + p.lang + '" href="' + url + '"'));
  // x-default siempre a la versión inglesa
  const xd = (h.match(/hreflang="x-default" href="([^"]+)"/) || [])[1];
  c(p.ruta + ': x-default a la versión inglesa',
    xd === (p.lang === 'en' ? url : urlAlt), xd);
});

// ───────────────────────────────────────────── 4. enlaces
console.log('\n[4] Enlaces internos');
const existentes = new Set();
paginas.forEach((p) => {
  [...new Set((html[p.ruta].match(/href="(\/[^"#?]*)/g) || [])
    .map((s) => s.slice(6)))].forEach((u) => {
    if (!u.endsWith('.html') && !u.endsWith('.ico') && !u.endsWith('.png')) {
      // rutas de directorio (/ y /es/) — se comprueba el index
      const idx = path.join(R, u.replace(/^\//, ''), 'index.html');
      c(p.ruta + ' → ' + u, fs.existsSync(idx));
      return;
    }
    const abs = path.join(R, u.replace(/^\//, ''));
    c(p.ruta + ' → ' + u, fs.existsSync(abs));
    existentes.add(u);
  });
});

console.log('\n[5] Malla de enlaces entre las tres páginas del mismo idioma');
['es', 'en'].forEach((lang) => {
  const grupo = paginas.filter((p) => p.lang === lang);
  grupo.forEach((p) => {
    const otras = grupo.filter((q) => q.ruta !== p.ruta);
    const enlaza = otras.filter((q) => html[p.ruta].includes('href="/' + q.ruta + '"'));
    c(p.ruta + ': enlaza a las otras 2 del mismo idioma',
      enlaza.length === otras.length,
      enlaza.length + '/' + otras.length);
  });
});

// ───────────────────────────────────────────── 6. duplicados
console.log('\n[6] Sin contenido duplicado entre páginas');
// «cuánto cuesta» y «bots de flujo» beben de la misma fuente: es donde más
// riesgo hay de canibalizarse.
// El nav, el pie y el bloque de llamada a la acción son cromo compartido a
// propósito: repetirlos no es contenido duplicado. Se recortan antes de
// comparar, o el test acusa a la plantilla de plagiarse a sí misma.
function frases(h) {
  const cuerpo = soloMarcado(h)
    .replace(/<nav[\s\S]*?<\/nav>/g, '')
    .replace(/<footer[\s\S]*?<\/footer>/g, '')
    .replace(/<div class="cta">[\s\S]*?<\/div>\s*<\/div>/g, '')
    .replace(/<header[\s\S]*?<\/header>/g, '');
  return cuerpo.replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.:])\s+/)
    .map((f) => f.trim())
    .filter((f) => f.length > 70);
}
['es', 'en'].forEach((lang) => {
  const grupo = paginas.filter((p) => p.lang === lang);
  for (let i = 0; i < grupo.length; i++) {
    for (let j = i + 1; j < grupo.length; j++) {
      const a = frases(html[grupo[i].ruta]);
      const b = new Set(frases(html[grupo[j].ruta]).map(sinEspacios));
      const comunes = a.filter((f) => b.has(sinEspacios(f)));
      c('sin frases largas repetidas: ' + grupo[i].ruta.replace(/^es\//, '') +
        ' vs ' + grupo[j].ruta.replace(/^es\//, ''),
        comunes.length === 0, comunes.slice(0, 2).join(' // '));
    }
  }
});
// tampoco con la página de preguntas ni con las landings
const otros = ['es/preguntas.html', 'es/index.html', 'index.html']
  .filter((f) => fs.existsSync(path.join(R, f)));
paginas.forEach((p) => {
  const a = frases(html[p.ruta]);
  otros.forEach((o) => {
    if ((o.startsWith('es/') ? 'es' : 'en') !== p.lang) return;
    const b = new Set(frases(leer(o)).map(sinEspacios));
    const comunes = a.filter((f) => b.has(sinEspacios(f)));
    c('sin frases repetidas: ' + p.ruta + ' vs ' + o,
      comunes.length === 0, comunes.slice(0, 2).join(' // '));
  });
});

// ───────────────────────────────────────────── 7. espacio-solución
console.log('\n[7] No se ha filtrado el espacio de la solución');
const prohibido = ['SAGA', 'LangGraph', 'langgraph', 'checkpointer', 'PostgreSQL',
  'Pydantic', 'neuro-simbólic', 'neuro-symbolic', 'company_id', 'gap_decomposer',
  'router_hub', 'OpenAI', 'Gemini', 'gpt-4', 'embedding', 'vectorstore',
  'invariante', 'invariant'];
paginas.forEach((p) => {
  const hit = prohibido.filter((t) => html[p.ruta].includes(t));
  c(p.ruta + ': sin arquitectura ni proveedores', hit.length === 0, hit.join(', '));
});

// ───────────────────────────────────────────── 8. cifras
console.log('\n[8] Cifras coherentes con el resto del sitio');
const dinero = { es: 'es/cuanto-cuesta-un-asistente-ia.html',
                 en: 'how-much-does-an-ai-assistant-cost.html' };
Object.keys(dinero).forEach((lang) => {
  const h = html[dinero[lang]];
  const sep = lang === 'es' ? ['149 €', '390 €', '690 €', '990 €']
                            : ['€149', '€390', '€690', '€990'];
  c(dinero[lang] + ': los cuatro precios de plan', sep.every((s) => h.includes(s)));
  c(dinero[lang] + ': ROI en margen 2/3/6/8',
    ['<strong>2</strong>', '<strong>3</strong>', '<strong>6</strong>',
     '<strong>8</strong>'].every((s) => h.includes(s)));
  c(dinero[lang] + ': dice explícitamente que cuenta margen, no ingreso',
    /margen<\/strong> y no el ingreso|<strong>margin<\/strong>, not revenue/.test(h));
  c(dinero[lang] + ': rangos de los tres niveles',
    /29|199/.test(h) && /1\.840|1,840/.test(h));
  c(dinero[lang] + ': extras 0,25 / 0.25 y 0,20 / 0.20',
    /0[,.]25/.test(h) && /0[,.]20/.test(h));
});
// la horquilla del nivel 3 debe coincidir con la del RAG y la landing
c('coherencia 2.000–15.000 € de montarlo por tu cuenta',
  /2\.000 € y 15\.000 €/.test(html['es/cuanto-cuesta-un-asistente-ia.html']) &&
  /€2,000 to €15,000/.test(html['how-much-does-an-ai-assistant-cost.html']));
// el dato de la recepcionista debe ir marcado como español en la versión EN
c('la versión EN marca el sueldo de recepción como dato de España',
  /receptionist in Spain[\s\S]{0,220}varies by country/
    .test(html['how-much-does-an-ai-assistant-cost.html']));

// ───────────────────────────────────────────── 9. SEO
console.log('\n[9] Metadatos');
paginas.forEach((p) => {
  const h = html[p.ruta];
  const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  c(p.ruta + ': title ' + t.length + ' car. (≤75)', t.length > 0 && t.length <= 75);
  c(p.ruta + ': description ' + d.length + ' car. (110-175)',
    d.length >= 110 && d.length <= 175);
  c(p.ruta + ': og:url correcta',
    h.includes('og:url" content="https://hachi.live/' + p.ruta + '"'));
  c(p.ruta + ': sumario con una entrada por sección',
    (h.match(/<a href="#b\d+">/g) || []).length === p.bloques.length);
  const ext = (h.match(/(?:src|href)="https?:\/\/(?!hachi\.live)[^"]+"/g) || [])
    .filter((u) => !/schema\.org/.test(u));
  c(p.ruta + ': sin recursos externos', ext.length === 0, ext.join(' '));
  c(p.ruta + ': sin <script src=>', !/<script[^>]+\bsrc=/.test(h));
});

console.log('\n' + '─'.repeat(64));
console.log(fallos === 0 ? '✅ TODO OK — ' + ok + ' comprobaciones'
                         : '❌ ' + fallos + ' fallos de ' + (ok + fallos));
process.exit(fallos === 0 ? 0 : 1);
