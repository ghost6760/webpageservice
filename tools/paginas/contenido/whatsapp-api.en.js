/**
 * "whatsapp business api difference" · /whatsapp-api-vs-business.html
 * English version of es/whatsapp-api-vs-business.html.
 */
module.exports = {
  lang: 'en',
  ruta: 'whatsapp-api-vs-business.html',
  alterna: { lang: 'es', ruta: 'es/whatsapp-api-vs-business.html' },
  publicado: '2026-08-05',
  actualizado: '2026-08-05',

  titulo: 'WhatsApp Business vs WhatsApp Business API: the real differences | Hachi',
  ogTitulo: 'WhatsApp Business vs API: what actually changes',
  descripcion: 'What separates the WhatsApp Business app from the official API, why numbers get blocked, what the 24-hour window is, and what you lose by migrating your number.',
  migaFinal: 'WhatsApp Business vs API',

  h1: 'WhatsApp Business and WhatsApp Business API <em>are not the same thing</em>',
  entradilla: `Confusing the two is what gets business numbers blocked — usually the number
    you have had for years, the one on your Google listing and your cards. Here is the
    whole difference, including the part almost nobody mentions until it is too late.`,

  bloques: [
    {
      h2: 'Two different products, not two versions of one',
      html: `
<p>WhatsApp Business and WhatsApp Business API share a name and little else. The
   <strong>app</strong> — the free one you install on a phone — is built for a small
   business that <em>replies</em>. The <strong>API</strong> is Meta's official route for
   companies that also <em>message first</em> and work at volume.</p>

<div class="tabla">
<table>
  <thead><tr><th></th><th>WhatsApp Business app</th><th>WhatsApp Business API</th></tr></thead>
  <tbody>
    <tr><td>Where it runs</td><td>On a phone</td><td><strong>On a computer</strong>, in a web console</td></tr>
    <tr><td>Who replies</td><td>One person, by hand</td><td>Your team <strong>and</strong> an assistant, at once</td></tr>
    <tr><td>Messaging first</td><td class="no">Risk of a block</td><td class="si">Allowed, with an approved template</td></tr>
    <tr><td>Several people handling chats</td><td class="no">No</td><td class="si">Yes, with conversations assigned</td></tr>
    <tr><td>History and labels</td><td>Only on that phone</td><td>Centralised and searchable</td></tr>
    <tr><td>Cost</td><td>Free</td><td>Charged per business-initiated conversation</td></tr>
  </tbody>
</table>
</div>

<div class="destacado">
<p><strong>The part that surprises everyone:</strong> the API <em>is not an app</em>. There
   is nothing to download, nothing to install and it does not live on a phone. It is a
   connection route, and what you actually look at is the web console wired to it. You
   lose none of what you had — your conversations are still there and your team can still
   reply by hand whenever they want. What changes is <strong>where</strong> the work
   happens.</p>
</div>`
    },
    {
      h2: 'Why numbers on the normal app get blocked',
      html: `
<p>The app is designed for conversations the customer starts. The moment you begin sending
   messages to people who did not write to you that day, or many messages in a row,
   WhatsApp's anti-spam system reads it as exactly what it looks like:</p>
<ul>
  <li>First it <strong>throttles your sending</strong>, without telling you.</li>
  <li>Then it <strong>suspends the number</strong> temporarily.</li>
  <li>If it happens again, it <strong>blocks it permanently</strong>.</li>
</ul>
<p>There is no recovery button and no one to call. The real damage is not the penalty
   itself, it is <em>which number</em> you lose. It is usually the one you have spent years
   publishing on your Google listing, your website, your signage and your cards. Losing it
   means losing the channel your work arrives through.</p>

<div class="destacado aviso">
<p>If you are sending appointment reminders by hand from the app on a phone, you are
   sitting in precisely the pattern that triggers a block. It works until it doesn't, and
   there is no warning.</p>
</div>`
    },
    {
      h2: 'The 24-hour window, without the jargon',
      html: `
<p>This is the rule everything else follows from. Meta lets you message a person freely for
   <strong>24 hours after their last message</strong>. After that you cannot send free
   text — only a <strong>template approved by Meta in advance</strong>.</p>

<p>In practice:</p>
<ul>
  <li>Someone messages at 22:00 asking about a service → you can reply however you like for
      the next 24 hours.</li>
  <li>They go quiet for three days and you want to follow up → they are outside the window,
      so you reach them with an approved template
      ("Hi {{name}}, shall we go ahead with your {{service}} enquiry?").</li>
  <li>As soon as they reply, <strong>a fresh 24-hour window opens</strong> and the
      conversation is unrestricted again.</li>
</ul>

<p>That window is, incidentally, the mechanism that keeps WhatsApp free of spam: you cannot
   message anyone you like, whenever you like, with whatever you like.</p>

<div class="destacado bien">
<p>A competent assistant handles this on its own: it knows whether the person is inside or
   outside the window and picks between free message and template without you thinking
   about it. This is why a home-made bot or a DIY automation eventually fails — not because
   it was built badly, but because <strong>without the official API and template handling
   the message simply does not go out</strong>.</p>
</div>`
    },
    {
      h2: 'The rule that decides whether you keep your number',
      html: `
<p>Here is the part worth knowing beforehand rather than afterwards:</p>

<blockquote>A phone number can be on the WhatsApp Business app <strong>OR</strong> on the
API, but <strong>never on both at once</strong>.</blockquote>

<p>That is a Meta rule, not a limitation of any particular vendor. Two paths follow from
   it.</p>

<h3>Path A · A new number</h3>
<p>A new SIM for the API. Your existing WhatsApp Business <strong>stays untouched on the
   phone</strong>, with all its chats and contacts. Zero risk and no extra waiting.</p>
<p>The obvious drawback: it is a different number from the one you have published, so you
   have to start promoting it or set up a redirect. Even so, it is what we recommend to
   almost everyone, especially if your current WhatsApp has years of history in it.</p>

<h3>Path B · Migrating your long-standing number</h3>
<p>It can be done, and you stay reachable where people already know you. But:</p>

<div class="destacado aviso">
<p><strong>When you migrate a number to the API, the chat history and contacts that live in
   the phone app stop being accessible.</strong> The API starts clean. They are not
   magically wiped: that number stops working in the app, and with it goes your access to
   those conversations from the new console.</p>
</div>

<p>Anyone who tells you "don't worry, we'll just connect your WhatsApp Business" is not
   telling you this. You would find out the day you go looking for a customer conversation
   from eight months ago and it is not there.</p>`
    },
    {
      h2: 'How to decide, in two questions',
      html: `
<ol>
  <li><strong>Is the number you use now published on your website, your Google listing and
      your ads?</strong><br>If it isn't, take a new number and stop thinking about it.</li>
  <li><strong>Do you need to keep reading old conversations?</strong><br>If you never look
      at them, migrate without a rescue. If you consult them often — or they are part of how
      you follow up with customers — it is worth rescuing them first.</li>
</ol>

<p>A rescue means extracting the contact list and the conversation history from the app,
   organising them and loading them into the new system, and it has to happen
   <strong>before</strong> migrating. That is not automation, it is data work: it is done
   case by case depending on how much you have, which is why it is quoted separately.</p>

<p>It is a decision you make once, so it is worth making well. If you are unsure, put your
   specific case on the table before signing anything with anyone.</p>`
    }
  ],

  faq: [
    {
      q: 'Is WhatsApp Business API free?',
      r: `<p>The app is free; the API is not. Meta charges per business-initiated
          conversation — reminders and campaigns — while <strong>replying within 24 hours of
          the customer's message costs nothing</strong>. On top of that sits whatever your
          provider charges to run it.</p>`
    },
    {
      q: 'Can I still reply from my phone?',
      r: `<p>With the API you work from a web console on a computer, not the WhatsApp app on
          a phone. The upside is that several people can handle chats at once with
          conversations assigned to them, and the history is centralised and searchable
          instead of living on a single handset.</p>`
    },
    {
      q: 'How long does Meta take to approve a template?',
      r: `<p>Usually 24 to 48 hours. If it is rejected, it does not go out — a barrier that
          depends on neither you nor your provider, and part of why the API is not used for
          spam.</p>`
    },
    {
      q: 'Can I go back after migrating to the API?',
      r: `<p>A number can be returned to the app, but it is a process and it does not bring
          back what was left behind. That is why the decision that matters is the one before
          migrating, not the one after.</p>`
    },
    {
      q: 'Do I need the API if I only want to answer messages?',
      r: `<p>If you genuinely only reply, and never message first or send reminders, the app
          may be enough. The API becomes necessary as soon as you want to start
          conversations, have several people handling chats at once, or have an assistant
          reply automatically.</p>`
    }
  ],

  relacionadas: [
    { href: '/why-flow-based-bots-fail.html',
      titulo: 'Why flow-based bots fail',
      nota: 'The exact mechanism behind a duplicated booking' },
    { href: '/how-much-does-an-ai-assistant-cost.html',
      titulo: 'What an AI assistant costs',
      nota: 'What explains the €29-to-€900 spread' },
    { href: '/calculator.html',
      titulo: 'ROI calculator',
      nota: 'The maths on your own figures, no sign-up' }
  ],

  cta: {
    h2: 'Want us to set it up?',
    p: `We handle the official API, connect your number and prepare the templates. In the
        demo we look at your specific case: whether a new number or a migration suits you,
        and what each one means with your data.`,
    boton: 'Book a demo',
    botonSec: '📊 Calculate my return'
  }
};
