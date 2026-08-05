/**
 * "ai assistant for clinics price" · /how-much-does-an-ai-assistant-cost.html
 * English version of es/cuanto-cuesta-un-asistente-ia.html.
 *
 * Adaptation: the receptionist salary benchmark is labelled as Spain-specific,
 * the same way the calculator labels the employer payroll overhead.
 */
module.exports = {
  lang: 'en',
  ruta: 'how-much-does-an-ai-assistant-cost.html',
  alterna: { lang: 'es', ruta: 'es/cuanto-cuesta-un-asistente-ia.html' },
  publicado: '2026-08-05',
  actualizado: '2026-08-05',

  titulo: 'What an AI assistant for clinics costs in 2026 | Hachi',
  ogTitulo: 'What an AI assistant for clinics costs',
  descripcion: 'Why quotes run from €29 to over €900 a month, what you are paying for at each tier, what building it yourself really costs, and how to tell which one pays for itself.',
  migaFinal: 'What an AI assistant costs',

  h1: 'What an AI assistant for <em>clinics</em> costs',
  entradilla: `If you are collecting quotes you will find figures from €29 to well over
    €900 a month, all described the same way. They are not the same thing: they are three
    different technologies. Here is what you pay for in each — including the part that
    argues against us.`,

  bloques: [
    {
      h2: 'The spread is not about quality, it is about category',
      html: `
<p>When two offers are described identically and sit €800 apart, the first thought is that
   someone is padding the price. Sometimes they are. But what usually sits underneath is
   that they are selling <strong>different things under the same name</strong>.</p>

<div class="tabla">
<table>
  <thead><tr><th>Tier</th><th>What it is</th><th>Per month</th><th>Setup</th></tr></thead>
  <tbody>
    <tr><td><strong>1</strong></td><td>Drawn flows: if they tap this button, say this</td><td>€29 – €199</td><td>€0 – €300</td></tr>
    <tr><td><strong>2</strong></td><td>Assistants that converse but do not execute</td><td>€150 – €500</td><td>€0 – €1,000</td></tr>
    <tr class="destacada"><td><strong>3</strong></td><td>Systems that converse <em>and</em> execute against your calendar</td><td>€460 – €1,840</td><td>€2,000 – €15,000</td></tr>
  </tbody>
</table>
</div>

<p>The border between tier 2 and tier 3 is a single verb: <strong>execute</strong>. A
   tier-2 assistant holds an excellent conversation and finishes with "a colleague will
   confirm your appointment". The customer had a good experience and your team has exactly
   the same work still waiting.</p>`
    },
    {
      h2: 'What you are paying for at each tier',
      html: `
<h3>Tier 1 · €29 to €199 a month</h3>
<p>A hand-drawn diagram. You pay for the tool that lets you draw it and for the hosting. It
   is cheap because there is little to maintain: no language model burning usage, no
   integration with your calendar, nobody tuning anything.</p>
<p><strong>When it is the right call:</strong> if all you need is to answer four common
   questions and you book nothing, this is plenty and it is the most sensible thing you can
   do with the money. We would say so either way.</p>

<h3>Tier 2 · €150 to €500 a month</h3>
<p>Here there is genuine AI, and that costs: every reply consumes processing charged by
   usage. You are paying for natural-language understanding, not for the ability to act.</p>

<h3>Tier 3 · €460 to €1,840 a month</h3>
<p>Everything in tier 2 plus the work of wiring the system to your real calendar and — this
   is what actually costs money — <strong>guaranteeing that what it does is correct</strong>:
   that it checks before promising, that it does not duplicate a booking when the customer
   insists, that it undoes its own work if an operation fails halfway, and that it does not
   fill in facts it does not have.</p>
<p>None of that work shows up in a demo. It shows up six months later, in the fact that you
   have not had to check what it says.</p>`
    },
    {
      h2: 'The four questions that separate one tier from another',
      html: `
<p>Ask them of any quote, ours included. If the person selling cannot answer them
   concretely, you are looking at tier 1 or 2 even when the price is tier 3:</p>
<ol>
  <li><strong>Does it check real availability before proposing a time, or does it only look
      like it does?</strong></li>
  <li><strong>If a booking fails halfway, does it stay half-done or undo itself?</strong></li>
  <li><strong>Can it book the same appointment twice if the customer insists?</strong></li>
  <li><strong>When it does not know something, does it say so or make it up?</strong></li>
</ol>
<div class="destacado">
<p>An answer along the lines of "that's handled in the prompt" is not a yes. It means they
   have <em>asked</em> the model to behave, not that the behaviour is guaranteed. That is
   the difference between an instruction that can be skipped on an odd day and a check that
   runs every time.</p>
</div>`
    },
    {
      h2: 'What about building it myself with automation tools?',
      html: `
<p>It is the alternative most people consider, and it deserves an honest answer: for
   mechanical tasks — when this arrives, send that — automation tools are excellent and
   cheap.</p>
<p>The trouble starts when what is on the other end is a conversation. The data does not
   arrive tidy or complete: it arrives in pieces, with changes of mind and questions in
   between. And three costs are invisible at the start:</p>
<ul>
  <li><strong>The official WhatsApp API.</strong> Without it, sending reminders from an
      ordinary number ends in a block. With it, you have to manage templates and the
      24-hour window — covered in
      <a href="/whatsapp-api-vs-business.html">WhatsApp Business vs API</a>.</li>
  <li><strong>Maintenance.</strong> Not building it, keeping it right: you change a price,
      you add a service, a schedule shifts.</li>
  <li><strong>The odd cases.</strong> Ninety per cent of conversations are easy. The
      remaining ten per cent is where you lose the customer, and where the development time
      goes.</li>
</ul>
<p>It adds up if you have someone to maintain it and your volume is low. It stops adding up
   the moment one mishandled booking costs you more than the price difference.</p>`
    },
    {
      h2: 'The comparison almost nobody makes',
      html: `
<p>The usual question is "is it expensive?". The useful one is "compared to what?".</p>
<ul>
  <li><strong>Against a person:</strong> a receptionist in Spain costs
      <strong>€25,000 to €35,000 a year</strong> fully loaded — the figure varies by country,
      but the shape of the comparison does not — and they take days off, get ill, and do not
      cover nights or Sundays, which is when a good share of enquiries arrive.</li>
  <li><strong>Against doing nothing:</strong> that is where the real cost sits, and it
      appears on no invoice. The slots that go empty without warning, the 23:40 message
      answered at 10:00 when that person has already written to three other places, and the
      ones who ask the price and never come back.</li>
</ul>

<h3>How many saved appointments cover the fee</h3>
<p>At a €200 average ticket and a <strong>65% contribution margin</strong>:</p>
<div class="tabla">
<table>
  <thead><tr><th>Monthly fee</th><th>Saved appointments/month that cover it</th></tr></thead>
  <tbody>
    <tr><td>€149</td><td><strong>2</strong></td></tr>
    <tr><td>€390</td><td><strong>3</strong></td></tr>
    <tr><td>€690</td><td><strong>6</strong></td></tr>
    <tr><td>€990</td><td><strong>8</strong></td></tr>
  </tbody>
</table>
</div>
<div class="destacado">
<p>Note that this counts <strong>margin</strong>, not revenue. A €200 appointment is not
   €200 of profit: it consumes product and consumables. Presenting gross revenue as
   "savings" is the most common error in these calculations and the first thing anyone who
   can read a set of accounts will spot.</p>
<p>You can run it on your own figures in the
   <a href="/calculator.html">ROI calculator</a>: it is built to tell you it does not pay
   for itself yet, and if that is the answer, it says so.</p>
</div>`
    },
    {
      h2: 'What to check in the small print',
      html: `
<p>Before signing, check these five points in any offer:</p>
<ol>
  <li><strong>What counts as a "conversation".</strong> If they count messages rather than
      24-hour conversations, the same volume costs you five to ten times more.</li>
  <li><strong>What happens if you exceed the limit.</strong> Is the excess billed, or is the
      service cut off? A customer left unanswered for hitting a cap is the opposite of what
      you bought.</li>
  <li><strong>What maintenance covers.</strong> Changing a price or adding a service should
      be inside it. If every change is billed, the real price is not the one you were
      quoted.</li>
  <li><strong>When setup is charged.</strong> The reasonable arrangement is that nothing is
      paid until the trial ends and you decide to continue.</li>
  <li><strong>Whether there is a lock-in.</strong> A product that works does not need one.</li>
</ol>
<p>For reference, here are our numbers: setup from €290 to €1,690 depending on plan — under
   two months of fee, and only if you continue — extra conversations at €0.25, extra minutes
   at €0.20, no lock-in and no service cut-off when you pass the limit. Full plans on the
   <a href="/#pricing">pricing section</a>.</p>`
    }
  ],

  faq: [
    {
      q: 'Why do some charge €99 and others €690 for the same thing?',
      r: `<p>Because it is not the same thing. The €99 offer is usually a drawn flow that
          cannot check your calendar; the €690 one checks real availability and executes the
          booking. The question that separates them is not price, it is
          <strong>"does it check before promising a time?"</strong>.</p>`
    },
    {
      q: 'Are there free AI assistants for clinics?',
      r: `<p>There are free tiers of flow-builder tools, and they are fine for answering four
          common questions. None of them book against your real calendar, because that
          requires an integration that costs money to maintain. If what you need is to
          inform, a free one may be enough.</p>`
    },
    {
      q: 'What does setup cost and why is it charged?',
      r: `<p>In our case €290 to €1,690 depending on the plan, always under two months of
          fee. It is not a licence being switched on: someone loads your services, prices and
          durations, connects your number and your calendar, configures your real opening
          hours and trains your team. It is charged only if you continue after the trial, and
          waived if you pay a quarter up front.</p>`
    },
    {
      q: 'What does building it myself cost?',
      r: `<p>On the open market, building a system that genuinely checks your calendar and
          executes bookings runs <strong>€2,000 to €15,000</strong>. With automation tools you
          can cut that initial figure a long way, but the real cost is not building it — it is
          maintaining it and covering the odd cases.</p>`
    },
    {
      q: 'What counts as a conversation?',
      r: `<p>It should be <strong>one customer talking to you over 24 hours</strong>, not each
          message. If someone sends thirty messages in an afternoon, that is one conversation,
          not thirty. Worth asking explicitly, because it changes the real price by a factor of
          five or ten.</p>`
    },
    {
      q: 'What if my average ticket is low?',
      r: `<p>Then you need more saved appointments to cover the fee, and the larger plan may
          not pay for itself — or any of them may not. It is arithmetic, not an opinion: run it
          on your figures in the <a href="/calculator.html">calculator</a>. If it says it does
          not pay, it does not pay.</p>`
    }
  ],

  relacionadas: [
    { href: '/why-flow-based-bots-fail.html',
      titulo: 'Why flow-based bots fail',
      nota: 'What technically limits tier 1' },
    { href: '/whatsapp-api-vs-business.html',
      titulo: 'WhatsApp Business vs API',
      nota: 'A cost almost nobody budgets for' },
    { href: '/calculator.html',
      titulo: 'ROI calculator',
      nota: 'The maths on your figures, no sign-up' }
  ],

  cta: {
    h2: 'Do the maths before you decide',
    p: `Put in your ticket, your appointments and your real no-show rate and see what comes
        out. And if you would rather watch it running on your own services and prices, the
        demo is 20 minutes and costs nothing.`,
    boton: 'Book a demo',
    botonSec: '📊 Calculate my return'
  }
};
