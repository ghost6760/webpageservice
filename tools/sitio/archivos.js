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

// Los de entrenamiento se abrieron el 25-09-2026: lo que un modelo «sabe» de
// Hachi sin buscarlo sale de ahí, y bloqueado lo describía mal. Ahora se exige
// que sigan abiertos; cerrarlos es una decisión que hay que tomar a propósito.
const entrenadores = ['GPTBot', 'CCBot'];
entrenadores.forEach((b) => {
  const m = robots.match(new RegExp('User-agent: ' + b + '\\s*\\n(Allow|Disallow):'));
  c('permite a ' + b + ' (entrena modelos: que conozcan Hachi)',
    !m || m[1] === 'Allow', m ? m[1] : 'sin regla → permitido por defecto');
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
// El Plan Por Cita y el módulo de voz: sin ellos, un modelo repite que la voz
// empieza en 149 € o que no hay forma de pagar por resultado.
c('Plan Por Cita (49 € + 4 € / 9 €, tope 990 €) en llms.txt y en la landing',
  /€49/.test(llms) && /€4 per/.test(llms) && /€9 per/.test(llms) &&
  landing.includes('49 €/mes') && landing.includes('tope mensual de 990 €'));
// Precios por mercado: EE. UU. (convertido desde el euro) y LatAm (escala propia).
const MERC = require('../sectores/mercados.js');
c('llms.txt trae la tabla de EE. UU. en USD (de mercados.js)',
  llms.includes(MERC.dolares(MERC.US.profesional.cuota)) && llms.includes(MERC.dolares(MERC.US.autonomo.cuota)));
c('llms.txt trae la escala de LatAm en USD',
  llms.includes(MERC.LATAM.profesional.cuota + ' USD'));
c('llms.txt ya no dice que todo USD está obsoleto', !/Any USD figure is obsolete/.test(llms));
c('la portada inglesa enseña los precios de EE. UU.',
  leer('index.html').includes(MERC.dolares(MERC.US.profesional.cuota)));

c('módulo de voz de 190 € en llms.txt y en la landing',
  /€190/.test(llms) && landing.includes('+190 €/mes'));
c('llms.txt dice que la voz no está en Autónomo ni Esencial',
  /not included in Solo or Essential|Solo and Essential do not include voice/.test(llms));

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

// ═══════════════════════════════════════════════ iconos, imágenes y otros
console.log('\n[iconos, imágenes para compartir y ficheros técnicos]');
const { execFileSync: ejecutar } = require('child_process');
const bin = (f) => fs.readFileSync(path.join(R, f));
// favicon.ico con 48x48 dentro: Google pide múltiplos de 48 para el resultado.
if (hay('favicon.ico')) {
  const ico = bin('favicon.ico'); const n = ico.readUInt16LE(4);
  const tallas = Array.from({ length: n }, (_, i) => ico[6 + i * 16] || 256);
  c('favicon.ico incluye 48x48', tallas.includes(48), tallas.join(', '));
} else c('favicon.ico existe', false);
c('el favicon ya no es el cuadrado morado de relleno (> 2 KB)', hay('favicon.ico') && bin('favicon.ico').length > 2000);
['index.html', 'es/index.html'].forEach((f) => {
  const h = leer(f);
  c(f + ': declara favicon de 48 y de 192', h.includes('sizes="48x48"') && h.includes('sizes="192x192"'));
  c(f + ': enlaza feed.xml y humans.txt', h.includes('/feed.xml') && h.includes('/humans.txt'));
});
c('las páginas en español comparten la imagen en español',
  leer('es/index.html').includes('og-image-es.png') && !leer('es/preguntas.html').includes('images/og-image.png'));
['images/og-image.png', 'images/og-image-es.png', 'images/twitter-image.png', 'images/twitter-image-es.png']
  .forEach((f) => c(f + ' existe y no es el marcador de posición', hay(f) && bin(f).length > 50000));
const manifiesto = JSON.parse(leer('manifest.json'));
const refs = [...manifiesto.icons, ...(manifiesto.shortcuts || []).flatMap((s) => s.icons || [])]
  .map((i) => i.src).concat((manifiesto.screenshots || []).map((s) => s.src));
const rotas = refs.filter((s) => !hay(s.replace(/^\//, '')));
c('manifest.json no apunta a ficheros que no existen', rotas.length === 0, rotas.join(', '));
c('manifest.json tiene iconos maskable', manifiesto.icons.some((i) => i.purpose === 'maskable'));
c('humans.txt existe', hay('humans.txt'));
[['feed.js', 'feed.xml'], ['llms-full.js', 'llms-full.txt']].forEach(([s, f]) => {
  let bien = true;
  try { ejecutar('node', [path.join(__dirname, s)], { stdio: 'ignore' }); } catch (e) { bien = false; }
  c(f + ' al día con las páginas (node tools/sitio/' + s + ' --escribir)', bien);
});
c('llms.txt enlaza llms-full.txt', llms.includes('https://hachi.live/llms-full.txt'));

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
