/**
 * Precios por mercado: la única fuente para las páginas de sector.
 *
 *   · España / UE ........ euros, los de la landing (analisis-de-precios-espana-2026).
 *   · Estados Unidos ..... los mismos planes que España, convertidos a dólares.
 *                          Decisión del 25-09-2026: la escala LatAm en USD es para
 *                          LatAm; en EE. UU. se parte del euro, que queda más alto
 *                          y encaja con la capacidad de compra de ese mercado.
 *   · Latinoamérica ...... su propia escala en USD (docs/rag/hachi_latam_rag.txt),
 *                          fijada contra precios reales de Colombia, no convertida.
 *
 * La conversión a dólares se hace AQUÍ, con una sola tasa y una sola regla de
 * redondeo, para que cambiar la tasa sea cambiar una línea y regenerar.
 */

// 1 € = TASA $. Redondeo: hacia arriba, al siguiente número que acaba en 9
// (174,33 → 179; 807,30 → 809). Nunca por debajo de la conversión.
const TASA_EUR_USD = 1.17;

const aDolares = (eur) => {
  const bruto = eur * TASA_EUR_USD;
  let n = Math.ceil(bruto);
  while (n % 10 !== 9) n++;
  return n;
};
// Importes pequeños (por cita, por minuto): hacia arriba, al dólar o a 5 céntimos.
const aDolaresSuelto = (eur) => Math.ceil(eur * TASA_EUR_USD);
const aCentimos = (eur) => Math.ceil(eur * TASA_EUR_USD * 20) / 20;

const ES = {
  moneda: 'EUR',
  porCita: { base: 49, chat: 4, llamada: 9, tope: 990, alta: 290 },
  autonomo: { cuota: 149, alta: 290, conv: 250, min: 0 },
  esencial: { cuota: 390, alta: 690, conv: 750, min: 0 },
  profesional: { cuota: 690, alta: 1190, conv: 1500, min: 400 },
  completa: { cuota: 990, alta: 1690, conv: 3000, min: 800 },
  multisede: { cuota: 1690 },
  moduloVoz: { cuota: 190, min: 300 },
  extra: { conv: 0.25, min: 0.20 }
};

const US = {
  moneda: 'USD',
  tasa: TASA_EUR_USD,
  porCita: { base: aDolares(ES.porCita.base), chat: aDolaresSuelto(ES.porCita.chat),
    llamada: aDolaresSuelto(ES.porCita.llamada), tope: aDolares(ES.porCita.tope),
    alta: aDolares(ES.porCita.alta) },
  autonomo: { ...ES.autonomo, cuota: aDolares(ES.autonomo.cuota), alta: aDolares(ES.autonomo.alta) },
  esencial: { ...ES.esencial, cuota: aDolares(ES.esencial.cuota), alta: aDolares(ES.esencial.alta) },
  profesional: { ...ES.profesional, cuota: aDolares(ES.profesional.cuota), alta: aDolares(ES.profesional.alta) },
  completa: { ...ES.completa, cuota: aDolares(ES.completa.cuota), alta: aDolares(ES.completa.alta) },
  multisede: { cuota: aDolares(ES.multisede.cuota) },
  moduloVoz: { cuota: aDolares(ES.moduloVoz.cuota), min: ES.moduloVoz.min },
  extra: { conv: aCentimos(ES.extra.conv), min: aCentimos(ES.extra.min) }
};

// Escala propia de LatAm, copiada del RAG (no convertida).
const LATAM = {
  moneda: 'USD',
  porCita: { base: 29, chat: 3, llamada: 7, tope: 299, alta: 89 },
  autonomo: { cuota: 69, alta: 89, conv: 150, min: 0 },
  esencial: { cuota: 129, alta: 169, conv: 400, min: 0 },
  profesional: { cuota: 219, alta: 269, conv: 800, min: 200 },
  completa: { cuota: 299, alta: 349, conv: 1500, min: 400 },
  multisede: { cuota: 590 },
  moduloVoz: { cuota: 99, min: 200 },
  extra: { conv: 0.12, min: 0.12 }
};

// Formato de importe en cada idioma.
const euros = (n) => {
  const [e, d] = n.toFixed(Number.isInteger(n) ? 0 : 2).split('.');
  return e.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (d ? ',' + d : '') + ' €';
};
const dolares = (n) => {
  const [e, d] = n.toFixed(Number.isInteger(n) ? 0 : 2).split('.');
  return '$' + e.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + d : '');
};

module.exports = { TASA_EUR_USD, ES, US, LATAM, euros, dolares };
