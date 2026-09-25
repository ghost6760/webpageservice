#!/usr/bin/env node
/**
 * Páginas por sector (/es/sectores/… y /industries/…) y sus dos índices.
 *
 *   node tools/sectores/generar.js     → escribe las páginas
 *   node tools/sectores/verificar.js   → las comprueba
 *
 * El generador SOLO pone la plantilla. Todo lo que hace útil una página —el
 * dolor, la conversación de ejemplo, lo que hace Hachi en ese sector, las
 * preguntas— está escrito a mano en sectores.es.js / sectores.en.js. Una
 * página que solo cambiara el nombre del sector sería una «doorway page» y
 * Google la trata como contenido a escala sin valor (política de marzo de 2024).
 * verificar.js mide que dos sectores no se parezcan demasiado.
 *
 * Los precios salen de mercados.js; las cuentas de retorno se calculan aquí,
 * nunca se teclean.
 */
const fs = require('fs');
const path = require('path');
const M = require('./mercados.js');

const R = path.join(__dirname, '..', '..');
const DOMINIO = 'https://hachi.live';

const IDIOMAS = {
  es: {
    datos: require('./sectores.es.js'),
    dir: 'es/sectores',
    raiz: '/es/',
    calculadora: '/es/calculadora.html',
    preguntas: '/es/preguntas.html',
    precios: '/es/#precios',
    contacto: '/es/#contacto',
    mercado: M.ES,
    importe: M.euros,
    idiomaSchema: 'es-ES',
    area: [{ '@type': 'Country', name: 'España' }, { '@type': 'Place', name: 'Latinoamérica' }],
    planes: { porCita: 'Por Cita', autonomo: 'Autónomo', esencial: 'Esencial',
      profesional: 'Profesional', completa: 'Clínica Completa' },
    t: {
      inicio: 'Inicio', sectores: 'Sectores', verPlanes: 'Ver planes →', otroIdioma: 'EN',
      indiceTitulo: 'Recepcionista con IA por sector: qué cambia en cada negocio | Hachi',
      indiceDescripcion: 'Veterinarias, clínicas, peluquerías, talleres, fontaneros: qué ' +
        'hace una recepcionista con IA en cada sector, con ejemplos reales y la cuenta de cuándo compensa.',
      indiceH1: 'Una recepcionista con IA, <em>hablando el idioma de tu sector</em>',
      indiceEntradilla: 'El problema es el mismo en todos —te escriben y te llaman cuando no ' +
        'puedes contestar—, pero las palabras, las urgencias y lo que se agenda cambian. ' +
        'Estas páginas cuentan cómo trabaja Hachi en cada uno, con una conversación de ' +
        'ejemplo y la cuenta de cuántas citas hacen falta para que se pague.',
      noEncaja: 'Dónde no encajamos, dicho antes',
      noEncajaTexto: '<p>Hachi agenda citas y visitas en una agenda con huecos. Por eso ' +
        '<strong>no</strong> es la herramienta para restaurantes (reservas de mesa con su ' +
        'propio sistema), hoteles (necesitan su motor de reservas) ni para repartir rutas entre ' +
        'técnicos. Si tu negocio vive de eso, te lo diremos en la demostración.</p>',
      tuSector: '¿Tu sector no está?',
      tuSectorTexto: 'Si trabajas con cita previa, casi seguro encaja. Cuéntanos el tuyo en la ' +
        'demostración y te enseñamos una conversación con tus servicios.',
      dolor: 'Lo que se pierde hoy',
      escena: 'Así contesta Hachi',
      hace: 'Qué hace Hachi en {sector}',
      garantias: 'Lo que el código impide en {sector}',
      garantiasIntro: 'El modelo entiende y conversa; las reglas críticas las impone el código ' +
        '(los guardrails), diga lo que diga la conversación. Las que más importan aquí:',
      roi: '¿Cuándo se paga solo?',
      roiTexto: (r) => `Con un ticket medio de <strong>${r.ticket}</strong> y un margen de ` +
        `contribución del <strong>${r.margen} %</strong> (un supuesto de ejemplo), el plan ` +
        `${r.plan} se paga con <strong>${r.citas} ${r.citas === 1 ? 'cita salvada' : 'citas salvadas'} al mes</strong>` +
        (r.porCita ? `, contando ya los ${r.porCitaImporte} que cuesta cada cita agendada.` : '.') +
        ' Se cuenta el margen y no el ingreso: una cita no es beneficio entero.',
      roiCalc: 'Hazlo con tus números en la <a href="/es/calculadora.html">calculadora</a>: puede ' +
        'decirte que todavía no te compensa, y si sale así, lo dice.',
      plan: 'Qué plan te encaja',
      alta: 'implantación única',
      mes: '/mes',
      latam: (L) => `<strong>¿Estás en Latinoamérica?</strong> Los mismos planes tienen su precio ` +
        `en dólares: Por Cita ${L.porCita.base} USD + ${L.porCita.chat} USD por cita, Independiente ` +
        `${L.autonomo.cuota} USD, Esencial ${L.esencial.cuota} USD, Profesional ` +
        `${L.profesional.cuota} USD y Clínica Completa ${L.completa.cuota} USD al mes.`,
      prueba: 'Antes de pagar nada: demostración de 20 minutos y 7 días de prueba con tu ' +
        'asistente ya configurado, sin tarjeta. Sin permanencia.',
      faq: 'Preguntas frecuentes',
      seguir: 'Otros sectores',
      todos: 'Todos los sectores',
      todosNota: 'Qué cambia en cada negocio',
      ctaH2: 'Míralo con tus servicios y tus precios',
      ctaP: 'La demostración son 20 minutos, con una conversación montada para tu negocio. ' +
        'Después, 7 días de prueba sin pagar nada.',
      ctaBoton: 'Solicitar una demostración',
      ctaSec: 'Calcular mi retorno',
      pie: ['Inicio', 'Planes', 'Calculadora', 'Preguntas'],
      pieOtro: 'English version',
      hubAlterno: 'Industries (English)',
      paraQuien: 'Para negocios en España y Latinoamérica',
      nadie: 'Nadie del equipo intervino',
      servicio: (s) => 'Recepcionista con IA para ' + s
    }
  },
  en: {
    datos: require('./sectores.en.js'),
    dir: 'industries',
    raiz: '/',
    calculadora: '/calculator.html',
    preguntas: '/faq.html',
    precios: '/#pricing',
    contacto: '/#contact',
    mercado: M.US,
    importe: M.dolares,
    idiomaSchema: 'en-US',
    area: [{ '@type': 'Country', name: 'United States' }],
    planes: { porCita: 'Pay-per-booking', autonomo: 'Solo', esencial: 'Essential',
      profesional: 'Professional', completa: 'Complete' },
    t: {
      inicio: 'Home', sectores: 'Industries', verPlanes: 'See plans →', otroIdioma: 'ES',
      indiceTitulo: 'AI receptionist by industry: what changes in each business | Hachi',
      indiceDescripcion: 'Vets, med spas, salons, auto shops, plumbers: what an AI receptionist ' +
        'does in each industry, with real examples and the maths on when it pays off.',
      indiceH1: 'An AI receptionist that <em>speaks your industry\'s language</em>',
      indiceEntradilla: 'The problem is the same everywhere — people call and text when you ' +
        'cannot pick up — but the words, the emergencies and what gets booked change. These ' +
        'pages show how Hachi works in each one, with a sample conversation and the maths on ' +
        'how many bookings it takes to pay for itself.',
      noEncaja: 'Where we do not fit, said up front',
      noEncajaTexto: '<p>Hachi books appointments and visits into a calendar with slots. So it ' +
        'is <strong>not</strong> the tool for restaurants (table reservations run on their own ' +
        'systems), hotels (they need a booking engine) or for routing technicians across town. ' +
        'If that is your business, we will tell you in the demo.</p>',
      tuSector: 'Is your industry missing?',
      tuSectorTexto: 'If you work by appointment, it almost certainly fits. Tell us about yours ' +
        'in the demo and we will show you a conversation with your own services.',
      dolor: 'What you lose today',
      escena: 'How Hachi answers',
      hace: 'What Hachi does for {sector}',
      garantias: 'What the code prevents in {sector}',
      garantiasIntro: 'The model understands and converses; the critical rules are enforced by ' +
        'code (the guardrails), whatever the conversation says. The ones that matter most here:',
      roi: 'When does it pay for itself?',
      roiTexto: (r) => `With an average ticket of <strong>${r.ticket}</strong> and a ` +
        `<strong>${r.margen}%</strong> contribution margin (an example assumption), the ` +
        `${r.plan} plan pays for itself with <strong>${r.citas} saved ` +
        `${r.citas === 1 ? 'appointment' : 'appointments'} a month</strong>` +
        (r.porCita ? `, already counting the ${r.porCitaImporte} charged per booking.` : '.') +
        ' We count margin, not revenue: an appointment is not all profit.',
      roiCalc: 'Run it with your own numbers in the <a href="/calculator.html">calculator</a>: it ' +
        'can tell you it does not pay off yet, and if so, it says so.',
      plan: 'Which plan fits',
      alta: 'one-off setup',
      mes: '/mo',
      us: (U) => `<strong>Prices for the United States, in USD.</strong> Pay-per-booking ` +
        `${M.dolares(U.porCita.base)} + ${M.dolares(U.porCita.chat)} per booking, Solo ` +
        `${M.dolares(U.autonomo.cuota)}, Essential ${M.dolares(U.esencial.cuota)}, Professional ` +
        `${M.dolares(U.profesional.cuota)} and Complete ${M.dolares(U.completa.cuota)} a month. ` +
        `Reminders and follow-ups go out by SMS or WhatsApp, whichever your clients use.`,
      prueba: 'Before paying anything: a 20-minute demo and a 7-day trial with your assistant ' +
        'already set up, no card. No lock-in.',
      faq: 'Frequently asked questions',
      seguir: 'Other industries',
      todos: 'All industries',
      todosNota: 'What changes in each business',
      ctaH2: 'See it with your services and your prices',
      ctaP: 'The demo takes 20 minutes, with a conversation built for your business. Then a ' +
        '7-day trial without paying anything.',
      ctaBoton: 'Book a demo',
      ctaSec: 'Calculate my return',
      pie: ['Home', 'Plans', 'Calculator', 'FAQ'],
      pieOtro: 'Versión en español',
      hubAlterno: 'Sectores (español)',
      paraQuien: 'For businesses in the United States',
      nadie: 'Nobody on the team stepped in',
      servicio: (s) => 'AI receptionist for ' + s
    }
  }
};

// ── utilidades ─────────────────────────────────────────────────────
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const aTexto = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const url = (ruta) => DOMINIO + '/' + ruta.replace(/(^|\/)index\.html$/, '$1');
const exigir = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); process.exit(1); } };
const ETIQUETAS_FAQ = ['p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'br'];

const rutaDe = (L, s) => L.dir + '/' + s.slug + '.html';
const hubDe = (L) => L.dir + '/index.html';

function retorno(L, s) {
  const m = L.mercado;
  const p = s.plan.id;
  const margen = s.roi.margen;
  const porCita = p === 'porCita';
  const porUnidad = s.roi.ticket * margen / 100 - (porCita ? m.porCita.chat : 0);
  const cuota = porCita ? m.porCita.base : m[p].cuota;
  exigir(porUnidad > 0, s.id + ': el margen por cita no cubre lo que cuesta agendarla');
  return {
    ticket: L.importe(s.roi.ticket), margen, plan: L.planes[p],
    citas: Math.ceil(cuota / porUnidad), porCita, porCitaImporte: L.importe(m.porCita.chat)
  };
}

function cajaPlan(L, s) {
  const m = L.mercado, p = s.plan.id, n = L.planes[p], i = L.importe;
  const precio = p === 'porCita'
    ? `${i(m.porCita.base)}${L.t.mes} + ${i(m.porCita.chat)} / ${i(m.porCita.llamada)}`
    : `${i(m[p].cuota)}${L.t.mes}`;
  const alta = p === 'porCita' ? m.porCita.alta : m[p].alta;
  return `  <div class="plan-caja">
    <p class="plan-nombre">${n}</p>
    <p class="plan-precio">${precio} <span>· ${i(alta)} ${L.t.alta}</span></p>
    ${s.plan.por}
  </div>`;
}

// ── página de sector ───────────────────────────────────────────────
function pagina(lang, s) {
  const L = IDIOMAS[lang], otro = IDIOMAS[lang === 'es' ? 'en' : 'es'];
  const par = otro.datos.find((x) => x.id === s.id);
  exigir(par, s.id + ': falta su pareja en el otro idioma');
  const ruta = rutaDe(L, s), rutaPar = rutaDe(otro, par);
  const en = lang === 'en' ? ruta : rutaPar;
  const r = retorno(L, s);
  const vecinos = s.vecinos.map((id) => {
    const v = L.datos.find((x) => x.id === id);
    exigir(v, s.id + ': vecino desconocido ' + id);
    return v;
  });
  const sector = s.enFrase;

  exigir(s.titulo.length <= 70, s.id + ' (' + lang + '): title de ' + s.titulo.length + ' caracteres (máx. 70)');
  exigir(s.descripcion.length >= 110 && s.descripcion.length <= 165,
    s.id + ' (' + lang + '): description de ' + s.descripcion.length + ' caracteres (110-165)');
  s.faq.forEach((f) => (f.r.match(/<\/?([a-zA-Z]+)/g) || []).forEach((t) => {
    const e = t.replace(/[</]/g, '').toLowerCase();
    exigir(ETIQUETAS_FAQ.includes(e), s.id + ': etiqueta <' + e + '> no admitida en una respuesta');
  }));

  const faqLd = s.faq.map((f) => ({
    '@type': 'Question', name: f.q, url: url(ruta) + '#' + slug(f.q),
    acceptedAnswer: { '@type': 'Answer', text: aTexto(f.r) }
  }));
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Service',
      name: L.t.servicio(s.nombreSchema), serviceType: L.t.servicio(s.nombreSchema),
      description: s.descripcion, url: url(ruta), inLanguage: L.idiomaSchema,
      areaServed: L.area,
      provider: { '@type': 'Organization', '@id': DOMINIO + '/#organization', name: 'Hachi AI', url: DOMINIO },
      offers: { '@type': 'Offer', name: L.planes[s.plan.id],
        price: String(s.plan.id === 'porCita' ? L.mercado.porCita.base : L.mercado[s.plan.id].cuota),
        priceCurrency: L.mercado.moneda } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: L.idiomaSchema, mainEntity: faqLd },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: L.t.inicio, item: DOMINIO + L.raiz },
      { '@type': 'ListItem', position: 2, name: L.t.sectores, item: url(hubDe(L)) },
      { '@type': 'ListItem', position: 3, name: s.nombre, item: url(ruta) }] }
  ];

  const escena = s.escena.msgs.map(([quien, txt]) =>
    `      <p class="msg ${quien === 'in' ? 'entra' : 'sale'}">${txt}</p>`).join('\n');

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${s.titulo}</title>
<meta name="description" content="${escAttr(s.descripcion)}">
<link rel="canonical" href="${url(ruta)}">
<link rel="alternate" hreflang="${lang}" href="${url(ruta)}">
<link rel="alternate" hreflang="${lang === 'es' ? 'en' : 'es'}" href="${url(rutaPar)}">
<link rel="alternate" hreflang="x-default" href="${url(en)}">
<link rel="icon" href="/favicon.ico">

<meta property="og:type" content="website">
<meta property="og:url" content="${url(ruta)}">
<meta property="og:title" content="${escAttr(aTexto(s.h1))}">
<meta property="og:description" content="${escAttr(s.descripcion)}">
<meta property="og:image" content="https://hachi.live/images/og-image${lang === 'es' ? '-es' : ''}.png">

${ld.map((o) => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n</script>`).join('\n')}

    <link rel="stylesheet" href="/assets/pages.css">
</head>
<body class="pagina-sector">

<nav class="nav">
  <div class="envoltorio">
    <a href="${L.raiz}" class="marca">Hachi<span>.</span></a>
    <div>
      <a href="/${rutaPar}" style="margin-right:16px">${L.t.otroIdioma}</a>
      <a href="${L.precios}">${L.t.verPlanes}</a>
    </div>
  </div>
</nav>

<div class="envoltorio">

<nav class="migas" aria-label="${L.t.inicio}">
  <a href="${L.raiz}">${L.t.inicio}</a> › <a href="/${L.dir}/">${L.t.sectores}</a> › ${s.nombre}
</nav>

<header class="cabecera">
  <h1>${s.h1}</h1>
  <p class="entradilla">${s.entradilla}</p>
  <p class="meta">${L.t.paraQuien}</p>
</header>

<section class="bloque" id="dolor">
  <h2>${L.t.dolor}</h2>
${s.dolores.map((d) => `  <h3>${d.t}</h3>\n  <p>${d.p}</p>`).join('\n')}
</section>

<section class="bloque" id="conversacion">
  <h2>${L.t.escena}</h2>
  <div class="chat" role="img" aria-label="${escAttr(s.escena.alt)}">
    <p class="chat-cab"><b>${s.escena.persona}</b> · ${s.escena.canal}</p>
${escena}
    <p class="chat-pie">${L.t.nadie}</p>
  </div>
  <p>${s.escena.nota}</p>
</section>

<section class="bloque" id="que-hace">
  <h2>${L.t.hace.replace('{sector}', sector)}</h2>
  <ul>
${s.hace.map((h) => `    <li>${h}</li>`).join('\n')}
  </ul>
</section>

<section class="bloque" id="garantias">
  <h2>${L.t.garantias.replace('{sector}', sector)}</h2>
  <p>${L.t.garantiasIntro}</p>
${s.garantias.map((g) => `  <div class="destacado bien"><p><strong>${g.t}</strong> ${g.p}</p></div>`).join('\n')}
</section>

<section class="bloque" id="retorno">
  <h2>${L.t.roi}</h2>
  <p>${L.t.roiTexto(r)}</p>
  <p>${L.t.roiCalc}</p>
</section>

<section class="bloque" id="plan">
  <h2>${L.t.plan}</h2>
${cajaPlan(L, s)}
  <p>${s.plan.alternativa}</p>
  <div class="destacado"><p>${lang === 'es' ? L.t.latam(M.LATAM) : L.t.us(M.US)}</p></div>
  <p>${L.t.prueba}</p>
</section>

<section class="faq" id="faq">
  <h2>${L.t.faq}</h2>
${s.faq.map((f) => `  <article id="${slug(f.q)}">
    <h3>${f.q}</h3>
    <div class="r">
      ${f.r.trim()}
    </div>
  </article>`).join('\n')}
</section>

<nav class="relacionadas" aria-label="${L.t.seguir}">
  <h2>${L.t.seguir}</h2>
  <div>
${vecinos.map((v) => `    <a href="/${rutaDe(L, v)}"><b>${v.nombre}</b><span>${v.resumen}</span></a>`).join('\n')}
    <a href="/${L.dir}/"><b>${L.t.todos}</b><span>${L.t.todosNota}</span></a>
  </div>
</nav>

<div class="cta">
  <h2>${L.t.ctaH2}</h2>
  <p>${L.t.ctaP}</p>
  <a href="${L.contacto}" class="boton">${L.t.ctaBoton}</a>
  <a href="${L.calculadora}" class="boton sec">${L.t.ctaSec}</a>
</div>

</div>

${pie(L, rutaPar)}
</body>
</html>
`;
  return { ruta, html };
}

function pie(L, rutaOtro) {
  const [a, b, c, d] = L.t.pie;
  return `<footer>
  <div class="envoltorio">
    Hachi ·
    <a href="${L.raiz}">${a}</a> ·
    <a href="${L.precios}">${b}</a> ·
    <a href="${L.calculadora}">${c}</a> ·
    <a href="${L.preguntas}">${d}</a> ·
    <a href="/${L.dir}/">${L.t.sectores}</a> ·
    <a href="/${rutaOtro}">${L.t.pieOtro}</a>
  </div>
</footer>`;
}

// ── índice de sectores ─────────────────────────────────────────────
function indice(lang) {
  const L = IDIOMAS[lang], otro = IDIOMAS[lang === 'es' ? 'en' : 'es'];
  const ruta = hubDe(L), rutaPar = hubDe(otro);
  const en = lang === 'en' ? ruta : rutaPar;
  exigir(L.t.indiceTitulo.length <= 75, lang + ': title del índice demasiado largo');
  exigir(L.t.indiceDescripcion.length >= 110 && L.t.indiceDescripcion.length <= 165,
    lang + ': description del índice de ' + L.t.indiceDescripcion.length + ' caracteres');
  const ld = [
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: aTexto(L.t.indiceH1),
      description: L.t.indiceDescripcion, url: url(ruta), inLanguage: L.idiomaSchema,
      hasPart: L.datos.map((s) => ({ '@type': 'WebPage', name: s.nombre, url: url(rutaDe(L, s)) })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: L.t.inicio, item: DOMINIO + L.raiz },
      { '@type': 'ListItem', position: 2, name: L.t.sectores, item: url(ruta) }] }
  ];
  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${L.t.indiceTitulo}</title>
<meta name="description" content="${escAttr(L.t.indiceDescripcion)}">
<link rel="canonical" href="${url(ruta)}">
<link rel="alternate" hreflang="${lang}" href="${url(ruta)}">
<link rel="alternate" hreflang="${lang === 'es' ? 'en' : 'es'}" href="${url(rutaPar)}">
<link rel="alternate" hreflang="x-default" href="${url(en)}">
<link rel="icon" href="/favicon.ico">

<meta property="og:type" content="website">
<meta property="og:url" content="${url(ruta)}">
<meta property="og:title" content="${escAttr(aTexto(L.t.indiceH1))}">
<meta property="og:description" content="${escAttr(L.t.indiceDescripcion)}">
<meta property="og:image" content="https://hachi.live/images/og-image${lang === 'es' ? '-es' : ''}.png">

${ld.map((o) => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n</script>`).join('\n')}

    <link rel="stylesheet" href="/assets/pages.css">
</head>
<body class="pagina-sector">

<nav class="nav">
  <div class="envoltorio">
    <a href="${L.raiz}" class="marca">Hachi<span>.</span></a>
    <div>
      <a href="/${otro.dir}/" style="margin-right:16px">${L.t.otroIdioma}</a>
      <a href="${L.precios}">${L.t.verPlanes}</a>
    </div>
  </div>
</nav>

<div class="envoltorio">

<nav class="migas" aria-label="${L.t.inicio}">
  <a href="${L.raiz}">${L.t.inicio}</a> › ${L.t.sectores}
</nav>

<header class="cabecera">
  <h1>${L.t.indiceH1}</h1>
  <p class="entradilla">${L.t.indiceEntradilla}</p>
  <p class="meta">${L.t.paraQuien}</p>
</header>

<nav class="relacionadas rejilla-sectores" aria-label="${L.t.sectores}">
  <div>
${L.datos.map((s) => `    <a href="/${rutaDe(L, s)}"><b>${s.nombre}</b><span>${s.resumen}</span></a>`).join('\n')}
  </div>
</nav>

<section class="bloque" id="no-encaja">
  <h2>${L.t.noEncaja}</h2>
  ${L.t.noEncajaTexto}
</section>

<div class="cta">
  <h2>${L.t.tuSector}</h2>
  <p>${L.t.tuSectorTexto}</p>
  <a href="${L.contacto}" class="boton">${L.t.ctaBoton}</a>
  <a href="${L.calculadora}" class="boton sec">${L.t.ctaSec}</a>
</div>

</div>

${pie(L, rutaPar)}
</body>
</html>
`;
  return { ruta, html };
}

// ── escribir ───────────────────────────────────────────────────────
if (require.main === module) {
  const escritas = [];
  ['es', 'en'].forEach((lang) => {
    const L = IDIOMAS[lang];
    const ids = new Set();
    L.datos.forEach((s) => { exigir(!ids.has(s.id), 'id repetido ' + s.id); ids.add(s.id); });
    fs.mkdirSync(path.join(R, L.dir), { recursive: true });
    [indice(lang), ...L.datos.map((s) => pagina(lang, s))].forEach(({ ruta, html }) => {
      fs.writeFileSync(path.join(R, ruta), html);
      escritas.push(ruta);
    });
  });
  escritas.forEach((r) => console.log('  ' + r));
  console.log(escritas.length + ' páginas escritas.');
}

module.exports = { IDIOMAS, rutaDe, hubDe, retorno, slug, aTexto };
