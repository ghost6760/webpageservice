/**
 * "bot can't check calendar" · /why-flow-based-bots-fail.html
 * English version of es/por-que-los-bots-de-flujo-fallan.html.
 *
 * Publication rule: describe WHAT fails and WHAT must be guaranteed, never HOW
 * the guarantee is implemented.
 */
module.exports = {
  lang: 'en',
  ruta: 'why-flow-based-bots-fail.html',
  alterna: { lang: 'es', ruta: 'es/por-que-los-bots-de-flujo-fallan.html' },
  publicado: '2026-08-05',
  actualizado: '2026-08-05',

  titulo: 'Why your bot cannot check the calendar | Hachi',
  ogTitulo: 'Why flow-based bots cannot book appointments',
  descripcion: 'The technical reason a flow-based bot cannot check your calendar, how a duplicated booking actually happens, and what to demand from any assistant that books.',
  migaFinal: 'Why flow-based bots fail',

  h1: 'Why your bot <em>cannot</em> check the calendar',
  entradilla: `If your chatbot confirms times that do not exist, asks for the name again
    every other message, or creates the same appointment twice, it is not misconfigured. It
    is doing the only thing it knows how to do. Here is the mechanism.`,

  bloques: [
    {
      h2: 'A flow is not an assistant, it is a diagram',
      html: `
<p>Most of what is sold as a "bot for clinics" is a hand-drawn diagram: if the customer taps
   this button, reply with this; if they type this word, jump to that step. It works by
   pattern matching, not by understanding.</p>
<p>That has a consequence which is not about quality but about
   <strong>capability</strong>: a diagram can only walk the paths somebody drew in advance.
   When a person writes something unanticipated, there is no branch to go to. That is why
   flows "break" on perfectly ordinary sentences.</p>
<div class="destacado">
<p>It is not doing it badly. It <strong>has no way of doing it</strong>. This is the
   difference between a new employee who has not learned something yet and a calculator you
   have asked to draft a letter.</p>
</div>`
    },
    {
      h2: 'Why it cannot know whether Thursday at 10 is free',
      html: `
<p>Answering "do you have anything Thursday at 10?" truthfully takes three things, and a
   flow has none of them:</p>
<ol>
  <li><strong>Understanding the question</strong>, including "Thursday", "day after
      tomorrow", "first thing" or "whenever you can in the afternoon".</li>
  <li><strong>Checking the real calendar</strong> at that moment — not a copy from
      yesterday, not a table of theoretical opening hours.</li>
  <li><strong>Interpreting the answer</strong> and, if there is no slot, offering
      alternatives that do exist.</li>
</ol>
<p>A flow can look like it is doing this, and that is the problem. It has two exits and
   neither is good:</p>
<ul>
  <li><strong>Confirm blind</strong> — "perfect, see you Thursday at 10" — and on Thursday
      two people turn up for the same slot.</li>
  <li><strong>Punt</strong> — "we'll confirm shortly" — which is precisely the work you were
      trying to get off your plate, only now with an extra step in front of it.</li>
</ul>
<div class="destacado aviso">
<p>If your bot has never caused a calendar problem, check which of the two it is doing. The
   second one never fails, but it never solves anything either.</p>
</div>`
    },
    {
      h2: 'How a duplicated booking actually happens',
      html: `
<p>This is the most expensive failure and the easiest to reproduce. A real conversation does
   not arrive tidy, it arrives in pieces:</p>
<div class="destacado">
<p>— "hi, I'd like to book"<br>
   — "Thursday if possible"<br>
   — "actually 11 is better"<br>
   — "oh, I'm Marta"<br>
   — "want my number?"<br>
   — "confirm it for me please"<br>
   — "can you confirm?"</p>
</div>
<p>Each of those arrives separately. A flow — or a "when a message comes in, do this"
   automation — has to decide on every one of them whether this is a new request or the
   continuation of the last. And it has no context to decide with.</p>
<p>So it does one of two things, and both are bad:</p>
<ul>
  <li><strong>Starts over</strong> on every message, and the customer repeats their name and
      the day three times until they give up and leave.</li>
  <li><strong>Treats each confirmation as a booking</strong>, and the two "confirm it"
      messages at the end become two appointments.</li>
</ul>
<p>A system that actually holds the conversation understands that all of it is
   <strong>one booking</strong> being filled in piece by piece, and that two confirmations
   in a row are not two appointments.</p>`
    },
    {
      h2: 'The silent failure: the booking left half-done',
      html: `
<p>This one almost never comes up in a demo, because you cannot see it. Rescheduling is two
   operations: cancel the old appointment and create the new one. If the first succeeds and
   the second fails — the calendar does not respond, the connection drops, the slot got taken
   in between — the result is that your customer <strong>no longer has an appointment</strong>
   and nobody knows.</p>
<p>It shows up in no error report, because from the outside the conversation ended well. It
   shows up the day that person arrives and is not in the diary.</p>
<div class="destacado bien">
<p>What you should demand is that <strong>if an operation fails halfway, it undoes
   itself</strong> and returns to the previous state. That is a requirement, not an extra:
   either the change completes in full or it does not happen. Ask about it explicitly — it is
   one of the few things that separate a serious system from one that demos well.</p>
</div>`
    },
    {
      h2: 'The other extreme: when the model makes things up',
      html: `
<p>Opposite the rigid flow sits a pendulum that swings the other way: wire a language model
   straight into WhatsApp and let it answer. It converses beautifully. And it has a different
   problem that costs just as much.</p>
<p>An unconstrained model <strong>fills in what it does not know</strong>, because that is
   what it was trained to do. Ask it a price it does not have and it produces a plausible
   one. Ask about a service you do not offer and it describes it confidently. It sounds
   convincing and it is false.</p>
<p>This is not a theoretical worry: companies have been ordered to compensate customers for
   what their chatbot promised them. What your assistant says, you said.</p>
<p>The answer is not to ask the model nicely in its instructions. It is that whatever it is
   about to say regarding prices, services and availability
   <strong>gets checked against your real information before it is sent</strong>, and that
   when the fact is missing, it says so and flags a human.</p>`
    },
    {
      h2: 'What to demand, as a list',
      html: `
<p>Whoever you buy from, this is what has to be answerable with a yes:</p>
<div class="tabla">
<table>
  <thead><tr><th>Requirement</th><th>Why it matters</th></tr></thead>
  <tbody>
    <tr><td>Checks real availability before proposing a time</td><td>Prevents the appointment that does not exist</td></tr>
    <tr><td>Understands that several messages are one booking</td><td>Prevents the duplicated appointment</td></tr>
    <tr><td>Undoes its work if an operation fails halfway</td><td>Prevents the customer with no appointment and no warning</td></tr>
    <tr><td>Checks what it is about to say against your data</td><td>Prevents invented prices and services</td></tr>
    <tr><td>Remembers the conversation across days</td><td>Prevents the customer leaving out of repetition</td></tr>
    <tr><td>Knows when to hand over to a person</td><td>Emergencies, complaints and delicate cases</td></tr>
  </tbody>
</table>
</div>
<div class="destacado">
<p>And a warning about the answers: <em>"yes, we've got that in the prompt"</em> is not a
   yes. It means they asked the model. What to ask is whether it is
   <strong>guaranteed</strong> — that is, whether the system checks every time, whatever
   happens in the conversation.</p>
</div>
<p>If you want to see how all of this translates into price, that is in
   <a href="/how-much-does-an-ai-assistant-cost.html">what an AI assistant costs</a>.</p>`
    }
  ],

  faq: [
    {
      q: 'Why does my bot confirm appointments that do not exist?',
      r: `<p>Because it has no access to your calendar. A drawn flow answers according to
          what somebody programmed, not according to what is free. It confirms because that
          is the most natural exit from the diagram, not because it checked anything.</p>`
    },
    {
      q: 'Can a flow-based bot be fixed to check the calendar?',
      r: `<p>Not by configuring it better. It needs a real calendar integration and the
          ability to interpret the answer, which is what separates one product category from
          another. It can be added with custom development, but at that point you are no
          longer paying for a flow.</p>`
    },
    {
      q: 'Why does my bot keep asking for my name every other message?',
      r: `<p>Because it has no memory of the conversation beyond the current message, or only
          within a very short session. An assistant that genuinely books has to remember
          across days, not just across messages.</p>`
    },
    {
      q: 'Is wiring ChatGPT straight into WhatsApp a good idea?',
      r: `<p>It converses very well and that is not the problem. The problem is that it cannot
          book in your calendar and that, unconstrained, it fills in facts it does not have:
          prices, services and hours that sound right and are not yours. On top of that, doing
          it from an ordinary number without the official API ends in a block — explained in
          <a href="/whatsapp-api-vs-business.html">WhatsApp Business vs API</a>.</p>`
    },
    {
      q: 'How do I test whether the bot being pitched really books?',
      r: `<p>In the demo, ask it for a time you know is taken. If it confirms, it is checking
          nothing. Then ask for confirmation twice in a row and see whether two appointments
          appear.</p>`
    },
    {
      q: 'So flow-based bots are useless?',
      r: `<p>They are useful for what they are: answering common questions, giving an address,
          opening hours or a list of services. If you do not need to book, they are the cheap
          and correct choice. The problem is not the tool, it is selling it as something it is
          not.</p>`
    }
  ],

  relacionadas: [
    { href: '/how-much-does-an-ai-assistant-cost.html',
      titulo: 'What an AI assistant costs',
      nota: 'What you pay for at each of the three tiers' },
    { href: '/whatsapp-api-vs-business.html',
      titulo: 'WhatsApp Business vs API',
      nota: 'Why numbers get blocked and what the 24h window is' },
    { href: '/calculator.html',
      titulo: 'ROI calculator',
      nota: 'What no-shows and reception hours really cost' }
  ],

  cta: {
    h2: 'Try it with the taken slot',
    p: `In the demo you can ask for a time you know is not free and watch what it answers.
        Twenty minutes, no cost, and no payment details asked for.`,
    boton: 'Book a demo',
    botonSec: '📊 Calculate my return'
  }
};
