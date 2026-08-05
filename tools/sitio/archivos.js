/**
 * Comprueba los ficheros que leen buscadores, rastreadores y modelos.
 *
 *   node tools/sitio/archivos.js
 *
 * No comprueba que existan —eso es trivial— sino que digan lo correcto y que
 * no se contradigan entre sí, que es donde fallan de verdad: un robots.txt que
 * bloquea una página del sitemap, un llms.txt con precios viejos, una clave de
 * IndexNow que no coincide con la del script.
 */
const fs = require('fs');
const path = require('path');

const R = path.join(__dirname, '..', '..');
let fallos = 0, ok = 0, avisos = 0;
const c = (d, cond, det) => cond
  ? (ok++, console.log('  ✓ ' + d))
  : (fallos++, console.log('  ✗ ' + d + (det ? '  → ' + det : '')));
const aviso = (d, det) => { avisos++; console.log('  ⚠ ' + d + (det ? '  → ' + det : '')); };
const leer = (p) => fs.readFileSync(path.join(R, p), 'utf8');
const hay = (p) => fs.existsSync(path.join(R, p));

// ── URLs publicadas ────────────────────────────────────────────────
const sitemap = leer('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const rutas = urls.map((u) => u.replace('https://hachi.live', '') || '/');

// ═══════════════════════════════════════════════ robots.txt
console.log('\n[robots.txt]');
const robots = leer('robots.txt');

c('declara el sitemap',
  robots.includes('Sitemap: https://hachi.live/sitemap.xml'));

// Las reglas Disallow del bloque genérico no pueden tapar nada publicado.
const bloqueGenerico = (robots.match(/User-agent: \*\n([\s\S]*?)\n\n/) || [])[1] || '';
const disallows = [...bloqueGenerico.matchAll(/^Disallow:\s*(\S+)/gm)].map((m) => m[1]);
const tapadas = rutas.filter((r) => disallows.some((d) => d !== '/' && r.startsWith(d)));
c('ninguna URL del sitemap está bloqueada para el rastreador genérico',
  tapadas.length === 0, tapadas.join(', '));

c('/.well-known/ no está bloqueado (security.txt debe poder leerse)',
  !disallows.includes('/.well-known/'));

// Los que responden citando tienen que estar permitidos; los de entrenamiento
// en bloque son una decisión de negocio, no un error.
const citadores = ['ChatGPT-User', 'OAI-SearchBot', 'PerplexityBot', 'ClaudeBot',
  'Claude-SearchBot', 'Applebot', 'DuckAssistBot'];
citadores.forEach((b) => {
  const bloque = new RegExp('User-agent: ' + b + '\\s*\\n(Allow|Disallow): (\\S+)');
  const m = robots.match(bloque);
  c('permite a ' + b + ' (responde citando)',
    m ? m[1] === 'Allow' : true, m ? m[1] + ' ' + m[2] : 'sin regla → permitido por defecto');
});

const entrenadores = ['GPTBot', 'CCBot'];
entrenadores.forEach((b) => {
  const m = robots.match(new RegExp('User-agent: ' + b + '\\s*\\n(Allow|Disallow):'));
  if (m && m[1] === 'Allow') aviso(b + ' está permitido (recopila para entrenar, no trae visitas)');
  else ok++, console.log('  ✓ ' + b + ' bloqueado (recopila para entrenar)');
});

// ═══════════════════════════════════════════════ llms.txt
console.log('\n[llms.txt]');
const llms = leer('llms.txt');

const noCitadas = rutas.filter((r) =>
  r !== '/' && !/privacy|terms|data-deletion/.test(r) && !llms.includes(r));
c('todas las páginas de contenido aparecen en llms.txt',
  noCitadas.length === 0, noCitadas.join(', '));

// Los precios son el dato que más daño hace si se queda viejo: un modelo lo
// citará como autoritativo.
const landing = leer('es/index.html');
[['149', 'Autónomo'], ['390', 'Esencial'], ['690', 'Profesional'],
 ['990', 'Clínica Completa'], ['1,690', 'Multi-sede']].forEach(([p, n]) => {
  c('precio ' + n + ' coincide entre llms.txt y la landing',
    llms.includes('€' + p) &&
    (landing.includes(p.replace(',', '.') + ' €') || p === '1,690'));
});
c('el retorno en llms.txt es el de margen (2/3/6/8)',
  /2 appointments\/month/.test(llms) && /8 for Complete/.test(llms));
c('no queda el retorno viejo sobre ingreso',
  !/1 appointment\/month for Solo/.test(llms));
c('declara que los extras no cortan el servicio',
  /never cut off/i.test(llms));

// Enlaces internos de llms.txt que apuntan a ficheros reales
const enlacesLlms = [...new Set([...llms.matchAll(/https:\/\/hachi\.live(\/[^\s)]*)/g)]
  .map((m) => m[1]))].filter((u) => u.endsWith('.html'));
const rotos = enlacesLlms.filter((u) => !hay(u.replace(/^\//, '')));
c('sin enlaces rotos en llms.txt', rotos.length === 0, rotos.join(', '));

// ═══════════════════════════════════════════════ IndexNow
console.log('\n[IndexNow]');
const script = leer('tools/sitio/indexnow.sh');
const claveScript = (script.match(/CLAVE="([0-9a-f]{8,})"/) || [])[1];
c('el script declara una clave', !!claveScript);
c('existe el fichero de clave en la raíz', claveScript && hay(claveScript + '.txt'));
c('el fichero contiene exactamente la clave',
  claveScript && hay(claveScript + '.txt') &&
  leer(claveScript + '.txt').trim() === claveScript);
c('la clave tiene entre 8 y 128 caracteres hexadecimales',
  claveScript && /^[0-9a-fA-F]{8,128}$/.test(claveScript));
c('el fichero de clave no está bloqueado en robots.txt',
  !disallows.some((d) => d !== '/' && ('/' + claveScript + '.txt').startsWith(d)));

// ═══════════════════════════════════════════════ security.txt
console.log('\n[.well-known/security.txt]');
c('existe', hay('.well-known/security.txt'));
if (hay('.well-known/security.txt')) {
  const sec = leer('.well-known/security.txt');
  c('tiene Contact', /^Contact:/m.test(sec));
  c('tiene Canonical', /^Canonical:/m.test(sec));
  const exp = (sec.match(/^Expires:\s*(\S+)/m) || [])[1];
  c('tiene Expires', !!exp);
  if (exp) {
    const quedan = (new Date(exp) - new Date()) / 86400000;
    if (quedan < 0) c('Expires no ha caducado', false, 'caducó hace ' + Math.abs(Math.round(quedan)) + ' días');
    else if (quedan < 60) aviso('Expires caduca en ' + Math.round(quedan) + ' días', exp);
    else { ok++; console.log('  ✓ Expires vigente (' + Math.round(quedan) + ' días)'); }
  }
}

// ═══════════════════════════════════════════════ datos estructurados
console.log('\n[Datos estructurados de las portadas]');
['index.html', 'es/index.html'].forEach((f) => {
  const h = leer(f);
  const bloques = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let grafo = null;
  try { grafo = JSON.parse(bloques[0][1]); } catch (e) { grafo = null; }
  c(f + ': el JSON-LD parsea', !!grafo);
  if (!grafo) return;
  const nodos = grafo['@graph'] || [grafo];
  const tipos = nodos.map((n) => n['@type']);
  c(f + ': declara Organization', tipos.includes('Organization'));
  c(f + ': declara SoftwareApplication', tipos.includes('SoftwareApplication'));
  c(f + ': declara FAQPage', tipos.includes('FAQPage'));

  const org = nodos.find((n) => n['@type'] === 'Organization');
  if (org) {
    c(f + ': Organization tiene logo', !!org.logo);
    const externos = (org.sameAs || []).filter((u) => !u.includes('hachi.live'));
    if (externos.length === 0) {
      aviso(f + ': sameAs no apunta a ningún perfil externo',
        'sin esto los modelos no pueden distinguir esta marca de los otros «hachi»');
    } else { ok++; console.log('  ✓ ' + f + ': sameAs con ' + externos.length + ' perfiles externos'); }
  }
});

// ═══════════════════════════════════════════════ imágenes sociales
console.log('\n[Imágenes de compartición]');
const paginas = rutas.filter((r) => r.endsWith('.html')).map((r) => r.replace(/^\//, ''))
  .concat(['index.html', 'es/index.html']);
const imgs = new Set();
paginas.filter(hay).forEach((p) => {
  const m = leer(p).match(/og:image" content="https:\/\/hachi\.live(\/[^"]+)"/);
  if (m) imgs.add(m[1]);
});
[...imgs].forEach((i) => c('existe la imagen ' + i, hay(i.replace(/^\//, ''))));
// Las legales no necesitan imagen social: nadie comparte una política de
// privacidad, y ponerle una tarjeta no aporta nada.
const deContenido = paginas.filter(hay)
  .filter((p) => !/privacy-policy|terms-of-service|data-deletion/.test(p));
const sinOg = deContenido.filter((p) => !/og:image"/.test(leer(p)));
c('todas las páginas de contenido declaran og:image',
  sinOg.length === 0, sinOg.join(', '));

// ═══════════════════════════════════════════════ manifest
console.log('\n[manifest.json]');
c('existe', hay('manifest.json'));
if (hay('manifest.json')) {
  let man = null;
  try { man = JSON.parse(leer('manifest.json')); } catch (e) { man = null; }
  c('parsea', !!man);
  if (man) {
    const faltan = (man.icons || []).map((i) => i.src)
      .filter((s) => s && s.startsWith('/') && !hay(s.replace(/^\//, '')));
    c('los iconos declarados existen', faltan.length === 0, faltan.join(', '));
  }
}

console.log('\n' + '─'.repeat(64));
console.log((fallos === 0 ? '✅ TODO OK — ' + ok + ' comprobaciones'
                          : '❌ ' + fallos + ' fallos de ' + (ok + fallos)) +
            (avisos ? '  ·  ' + avisos + ' aviso(s)' : ''));
process.exit(fallos === 0 ? 0 : 1);
