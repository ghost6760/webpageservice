/**
 * ¿Se puede llegar a cada página navegando desde hachi.live, sin escribir la
 * URL a mano? Recorrido en anchura desde las dos portadas, siguiendo sólo
 * enlaces <a href> reales.
 */
const path=require('path');
const fs=require('fs');
const R=path.join(__dirname,'..','..');
let f=0,ok=0;
const c=(d,cond,det)=>cond?(ok++,console.log('  ✓ '+d)):(f++,console.log('  ✗ '+d+(det?'  → '+det:'')));

// Los enlaces del pie son relativos ("privacy-policy.html"), así que hay que
// resolverlos contra la página donde aparecen o se cuentan como inalcanzables.
const aFichero=(u,desdeFichero)=>{
  u=u.split('#')[0].split('?')[0];
  if(!u||/^(https?:|mailto:|tel:)/.test(u)) return null;
  let r;
  if(u.startsWith('/')) r=u.replace(/^\//,'');
  else r=path.posix.join(path.posix.dirname(desdeFichero),u);
  if(r===''||r.endsWith('/')) r+='index.html';
  if(!r.endsWith('.html')) return null;
  return r;
};

function recorrer(inicio){
  const vistos=new Set([inicio]);
  const cola=[inicio];
  const desde={[inicio]:'(portada)'};
  const profundidad={[inicio]:0};
  while(cola.length){
    const actual=cola.shift();
    const p=path.join(R,actual);
    if(!fs.existsSync(p)) continue;
    const h=fs.readFileSync(p,'utf8')
      .replace(/<script[\s\S]*?<\/script>/g,'');  // sólo enlaces reales, no cadenas JS
    [...h.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(m=>m[1]).forEach(u=>{
      const fich=aFichero(u,actual);
      if(!fich||vistos.has(fich)) return;
      vistos.add(fich); desde[fich]=actual;
      profundidad[fich]=profundidad[actual]+1;
      cola.push(fich);
    });
  }
  return {vistos,desde,profundidad};
}

const en=recorrer('index.html');
const es=recorrer('es/index.html');

const TODAS=['index.html','es/index.html','calculator.html','es/calculadora.html',
  'faq.html','es/preguntas.html','whatsapp-api-vs-business.html',
  'es/whatsapp-api-vs-business.html','how-much-does-an-ai-assistant-cost.html',
  'es/cuanto-cuesta-un-asistente-ia.html','why-flow-based-bots-fail.html',
  'es/por-que-los-bots-de-flujo-fallan.html','privacy-policy.html',
  'es/privacy-policy.html','terms-of-service.html','es/terms-of-service.html',
  'data-deletion.html'];

console.log('\n[alcanzable desde hachi.live/ (portada inglesa)]');
TODAS.forEach(p=>c(p+(en.vistos.has(p)?'  · salto '+en.profundidad[p]+' desde '+en.desde[p]:''),
  en.vistos.has(p)));

console.log('\n[alcanzable desde hachi.live/es/ (portada española)]');
TODAS.forEach(p=>c(p+(es.vistos.has(p)?'  · salto '+es.profundidad[p]+' desde '+es.desde[p]:''),
  es.vistos.has(p)));

console.log('\n[a un solo clic desde la portada]');
const unClicEn=TODAS.filter(p=>en.profundidad[p]===1);
const unClicEs=TODAS.filter(p=>es.profundidad[p]===1);
console.log('  EN: '+unClicEn.join(', '));
console.log('  ES: '+unClicEs.join(', '));
['calculator.html','faq.html','how-much-does-an-ai-assistant-cost.html',
 'why-flow-based-bots-fail.html','whatsapp-api-vs-business.html']
 .forEach(p=>c('EN a 1 clic: '+p,unClicEn.includes(p),'salto '+en.profundidad[p]));
['es/calculadora.html','es/preguntas.html','es/cuanto-cuesta-un-asistente-ia.html',
 'es/por-que-los-bots-de-flujo-fallan.html','es/whatsapp-api-vs-business.html']
 .forEach(p=>c('ES a 1 clic: '+p,unClicEs.includes(p),'salto '+es.profundidad[p]));

console.log('\n[el nav lleva a las guías]');
const hEn=fs.readFileSync(path.join(R,'index.html'),'utf8');
const hEs=fs.readFileSync(path.join(R,'es/index.html'),'utf8');
c('EN: nav tiene «Guides» → #guides',/<li><a href="#guides">Guides<\/a><\/li>/.test(hEn));
c('ES: nav tiene «Guías» → #guias',/<li><a href="#guias">Guías<\/a><\/li>/.test(hEs));
c('EN: existe la sección #guides',hEn.includes('id="guides"'));
c('ES: existe la sección #guias',hEs.includes('id="guias"'));
c('EN: nav FAQ → /faq.html',/<li><a href="\/faq\.html">FAQ<\/a><\/li>/.test(hEn));
c('ES: nav Preguntas → /es/preguntas.html',/<li><a href="\/es\/preguntas\.html">Preguntas<\/a><\/li>/.test(hEs));
c('EN: CTA «See all 75 questions» tras el acordeón',
  /id="faq"[\s\S]*?href="\/faq\.html" class="cta-button"[\s\S]*?<\/section>/.test(hEn));
c('ES: CTA «Ver las 75 preguntas» tras el acordeón',
  /id="faq"[\s\S]*?href="\/es\/preguntas\.html" class="cta-button"[\s\S]*?<\/section>/.test(hEs));

console.log('\n[simetría entre idiomas]');
const navEn=(hEn.match(/<ul class="nav-links">[\s\S]*?<\/ul>/)||[''])[0];
const navEs=(hEs.match(/<ul class="nav-links">[\s\S]*?<\/ul>/)||[''])[0];
c('mismo número de entradas en el nav',
  (navEn.match(/<li>/g)||[]).length===(navEs.match(/<li>/g)||[]).length,
  (navEn.match(/<li>/g)||[]).length+' vs '+(navEs.match(/<li>/g)||[]).length);

console.log('\n'+'─'.repeat(64));
console.log(f===0?'✅ TODO OK — '+ok+' comprobaciones':'❌ '+f+' fallos de '+(ok+f));
process.exit(f===0?0:1);
