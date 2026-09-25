#!/usr/bin/env node
/**
 * Comprueba las páginas de sector.  node tools/sectores/verificar.js
 *
 * Lo que más importa está en [5]: que dos sectores no compartan texto. Una
 * página de sector que solo cambia el nombre es una «doorway page»; Google la
 * trata como contenido a escala sin valor y puede sacar del índice el bloque
 * entero. Se mide con fragmentos de 5 palabras sobre el texto escrito a mano.
 */
const fs = require('fs');
const path = require('path');
const M = require('./mercados.js');
const G = require('./generar.js');

const R = path.join(__dirname, '..', '..');
let fallos = 0, ok = 0;
const c = (d, cond, det) => cond
  ? (ok++, console.log('  ✓ ' + d))
  : (fallos++, console.log('  ✗ ' + d + (det ? '  → ' + det : '')));

const PROHIBIDO = ['LangGraph', 'langgraph', 'Redis', 'PostgreSQL', 'checkpointer', 'company_id',
  'OpenAI', 'Gemini', 'gpt-4', 'Pydantic', 'HIPAA compliant.', 'HIPAA-compliant'];
// Máximo de fragmentos de 5 palabras compartidos entre dos sectores del mismo idioma.
const MAX_PARECIDO = 0.12;

const leer = (r) => fs.readFileSync(path.join(R, r), 'utf8');
const ld = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((m) => JSON.parse(m[1]));

['es', 'en'].forEach((lang) => {
  const L = G.IDIOMAS[lang];
  const otro = G.IDIOMAS[lang === 'es' ? 'en' : 'es'];
  console.log(`\n[${lang}] ${L.datos.length} sectores + índice`);

  // ── 1. existen y se declaran bien
  const rutas = [G.hubDe(L), ...L.datos.map((s) => G.rutaDe(L, s))];
  rutas.forEach((r) => {
    c(r + ' existe', fs.existsSync(path.join(R, r)));
    if (!fs.existsSync(path.join(R, r))) return;
    const h = leer(r);
    const head = h.split('</head>')[0];
    const titulo = (head.match(/<title>([^<]+)<\/title>/) || [])[1] || '';
    const desc = (head.match(/<meta name="description" content="([^"]+)"/) || [])[1] || '';
    c(r + ': title ' + titulo.length + ' car. (≤75)', titulo.length > 0 && titulo.length <= 75);
    c(r + ': description ' + desc.length + ' car. (110-165)', desc.length >= 110 && desc.length <= 165);
    const url = 'https://hachi.live/' + r.replace(/index\.html$/, '');
    c(r + ': canonical propio', head.includes(`rel="canonical" href="${url}"`));
    // hreflang recíproco
    const alt = (head.match(new RegExp(`hreflang="${lang === 'es' ? 'en' : 'es'}" href="([^"]+)"`)) || [])[1];
    const altRuta = alt && alt.replace('https://hachi.live/', '').replace(/\/$/, '/index.html');
    const vuelta = altRuta && fs.existsSync(path.join(R, altRuta)) && leer(altRuta).includes(`hreflang="${lang}" href="${url}"`);
    c(r + ': hreflang recíproco', !!vuelta, alt);
    try { ld(h); c(r + ': JSON-LD válido', true); } catch (e) { c(r + ': JSON-LD válido', false, e.message); }
    const prohibidos = PROHIBIDO.filter((p) => h.includes(p));
    c(r + ': sin detalles internos ni promesas que no se cumplen', prohibidos.length === 0, prohibidos.join(', '));
    c(r + ': usa /assets/pages.css', h.includes('href="/assets/pages.css"'));
  });

  // ── 2. FAQ: lo marcado es lo visible
  L.datos.forEach((s) => {
    const h = leer(G.rutaDe(L, s));
    const faq = ld(h).find((o) => o['@type'] === 'FAQPage');
    const visibles = [...h.split('id="faq"')[1].matchAll(/<h3>([^<]+)<\/h3>/g)].map((m) => m[1]);
    c(s.id + ': FAQPage = preguntas visibles',
      faq && JSON.stringify(faq.mainEntity.map((q) => q.name)) === JSON.stringify(visibles));
  });

  // ── 3. mercado: moneda, canales y precios
  const m = L.mercado;
  L.datos.forEach((s) => {
    const h = leer(G.rutaDe(L, s));
    const cuerpo = h.split('<body')[1];
    const cuota = s.plan.id === 'porCita' ? m.porCita.base : m[s.plan.id].cuota;
    c(s.id + ': precio del plan = mercados.js (' + L.importe(cuota) + ')',
      cuerpo.includes('<p class="plan-precio">' + L.importe(cuota)));
    if (lang === 'es') {
      c(s.id + ': sin SMS (en España no se ofrece)', !/\bSMS\b/.test(cuerpo));
      c(s.id + ': precios LatAm presentes', cuerpo.includes(M.LATAM.profesional.cuota + ' USD'));
      c(s.id + ': sin «$»', !cuerpo.includes('$'));
    } else {
      c(s.id + ': menciona SMS', /\bSMS\b/.test(cuerpo));
      c(s.id + ': precios en USD de EE. UU.', cuerpo.includes(M.dolares(M.US.profesional.cuota)));
      c(s.id + ': sin «€»', !cuerpo.includes('€'));
    }
    const r = G.retorno(L, s);
    c(s.id + ': cuenta de retorno calculada (' + r.citas + ' citas)', cuerpo.includes('<strong>' + r.citas + ' '));
  });

  // ── 4. cada sector tiene pareja y vecinos existentes
  L.datos.forEach((s) => {
    c(s.id + ': tiene pareja en ' + (lang === 'es' ? 'en' : 'es'), otro.datos.some((x) => x.id === s.id));
    c(s.id + ': vecinos válidos y distintos de sí mismo',
      s.vecinos.length >= 2 && s.vecinos.every((v) => v !== s.id && L.datos.some((x) => x.id === v)));
  });

  // ── 5. que no sean la misma página con otro nombre
  const texto = (s) => [s.entradilla, ...s.dolores.flatMap((d) => [d.t, d.p]),
    ...s.escena.msgs.map((x) => x[1]), s.escena.nota, ...s.hace,
    ...s.garantias.map((g) => g.p), s.plan.por, s.plan.alternativa,
    ...s.faq.flatMap((f) => [f.q, f.r])].join(' ');
  const tejas = (s) => {
    const w = G.aTexto(texto(s)).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
    const set = new Set();
    for (let i = 0; i + 5 <= w.length; i++) set.add(w.slice(i, i + 5).join(' '));
    return set;
  };
  const T = L.datos.map((s) => [s.id, tejas(s)]);
  let peor = { v: 0 };
  for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) {
    const [a, A] = T[i], [b, B] = T[j];
    let comun = 0; A.forEach((x) => { if (B.has(x)) comun++; });
    const v = comun / Math.min(A.size, B.size);
    if (v > peor.v) peor = { v, a, b };
    if (v >= MAX_PARECIDO) c(`${a} y ${b} comparten ${(v * 100).toFixed(1)} % del texto`, false);
  }
  c(`ningún par de sectores comparte ≥ ${MAX_PARECIDO * 100} % (el más parecido: ${peor.a}/${peor.b}, ` +
    `${(peor.v * 100).toFixed(1)} %)`, peor.v < MAX_PARECIDO);
});

// ── 6. el HTML publicado es exactamente lo que genera la plantilla
console.log('\n[el HTML publicado coincide con el generador]');
const { execFileSync } = require('child_process');
const antes = {};
['es', 'en'].forEach((lang) => {
  const L = G.IDIOMAS[lang];
  [G.hubDe(L), ...L.datos.map((s) => G.rutaDe(L, s))].forEach((r) => { antes[r] = leer(r); });
});
execFileSync('node', [path.join(__dirname, 'generar.js')], { stdio: 'ignore' });
Object.entries(antes).forEach(([r, h]) => {
  const ahora = leer(r);
  c(r + ' al día', ahora === h);
  if (ahora !== h) fs.writeFileSync(path.join(R, r), h);   // no tocar lo publicado
});

console.log('\n' + '─'.repeat(64));
if (fallos) { console.log(`❌ ${fallos} fallo(s) de ${fallos + ok}`); process.exit(1); }
console.log(`✅ TODO OK — ${ok} comprobaciones`);
