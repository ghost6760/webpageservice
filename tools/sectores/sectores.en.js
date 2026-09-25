/**
 * Industry pages in English (United States market).
 *
 * Not a translation of sectores.es.js: the market is different. In the US
 * people expect reminders by SMS, the phone matters more than chat, prices
 * are in USD (mercados.js converts them from EUR) and health practices that
 * bill insurance are HIPAA covered entities.
 *
 * Content rules:
 *   · Only capabilities that exist; what it does not do, we say.
 *   · Guarantees: only those enforced in code (landing, guardrails section).
 *     Never "it won't say booked before booking": gap HAG7 is still open.
 *   · Never claim HIPAA compliance. Hachi does not sign BAAs today.
 *   · In `faq[].r` only <p> <ul> <ol> <li> <strong> <em> <a> <br>.
 */
module.exports = [

// ─────────────────────────────────────────────────────────────────
{
  id: 'estetica',
  slug: 'med-spas',
  nombre: 'Med spas and aesthetic clinics',
  nombreSchema: 'med spas and aesthetic clinics',
  enFrase: 'a med spa',
  resumen: 'Consultations, Meta ads and people who ask the price and vanish',
  titulo: 'AI receptionist for med spas and aesthetic clinics | Hachi',
  descripcion: 'Answers Botox and filler questions at 11pm by text, WhatsApp or phone, books the consultation into your real calendar and follows up with people who went quiet.',
  h1: 'AI receptionist for <em>med spas</em>',
  entradilla: 'Med spa clients shop around. They message three clinics at night and book ' +
    'with the one that answers first and sounds trustworthy. Hachi answers in seconds, uses ' +
    'your own treatment information and leaves the consultation booked.',
  dolores: [
    { t: 'Your ads work; your inbox cannot keep up',
      p: 'You pay for every lead from Instagram and Facebook, and half of them arrive on a ' +
        'Friday night. By Monday, that person has booked somewhere else. The ad money is gone ' +
        'either way.' },
    { t: '"How much is it?" and then silence',
      p: 'The most common thread in any med spa: someone asks the price of lip filler, gets it ' +
        'and disappears. Not because they are not interested, but because nobody followed up.' },
    { t: 'The front desk lives on the phone',
      p: 'Explaining what a chemical peel is, how many sessions it takes and whether it hurts ' +
        'eats the whole day, while the client in the waiting room waits.' }
  ],
  escena: {
    persona: 'Megan', canal: 'SMS · 11:12 pm',
    alt: 'Sample conversation: a client asks about lip filler by text and Hachi books the consultation.',
    msgs: [
      ['in', 'Hi! How much is lip filler? I\'m a little scared it will look overdone'],
      ['out', 'Hi Megan! Lip filler starts at $650, and it always begins with a free consultation with our injector to decide how much to use. The goal is a natural look, and it can be adjusted later. Want me to book it? I have Tuesday at 5:30 pm or Thursday at 11:00 am.'],
      ['in', 'Tuesday works'],
      ['out', 'Done: consultation on Tuesday at 5:30 pm with Dr. Reyes. I\'ll text you a reminder the day before. If anything comes up, just reply and we\'ll move it.']
    ],
    nota: 'The price comes from your price list, not from the model: an amount that is not in ' +
      'your documents is removed before the message is sent. And the time is checked against ' +
      'the real calendar before it is offered.'
  },
  hace: [
    'Replies in seconds to <strong>Meta Lead Ads</strong> and reaches out by text or WhatsApp before the lead goes cold.',
    'Explains treatments, sessions, aftercare and contraindications <strong>in your own words</strong>: upload your PDFs and it uses them.',
    'Books consultations and treatments with the right duration and the right provider.',
    'Sends <strong>SMS or WhatsApp reminders</strong> with confirmation, so cancellations come early and the slot can be refilled.',
    '<strong>Proactive follow-up</strong> with people who asked the price and did not book, picking up their own conversation.',
    'Answers your Spanish-speaking clients in Spanish, and switches language mid-conversation if they do.'
  ],
  garantias: [
    { t: 'It does not invent a price.', p: 'An amount that is not in your price list, and that the client did not say, is removed before sending. In a med spa, a wrong price is an argument at the front desk.' },
    { t: 'It does not confirm a taken slot.', p: 'It checks the injector\'s calendar before offering a time. If there is no slot, it offers another.' },
    { t: 'It does not double-book.', p: 'Even if the client insists or sends the details across three messages, the consultation is created once.' }
  ],
  roi: { ticket: 350, margen: 65 },
  plan: { id: 'completa',
    por: '<p>A med spa lives on ads and on winning back people who went quiet — Lead Ads, ' +
      'proactive follow-up and campaigns — and that is the <strong>Complete</strong> plan. It ' +
      'also includes voice for phone calls.</p>',
    alternativa: 'If you are not running ads yet, the Essential plan covers messaging, several calendars and your knowledge base.' },
  faq: [
    { q: 'Is Hachi HIPAA compliant?',
      r: '<p>We do not sign a HIPAA Business Associate Agreement today, so we say it plainly. HIPAA applies when a practice bills insurance electronically; a med spa that is strictly cash-pay usually is not a covered entity. If you bill insurance for anything, tell us in the demo before sharing any patient data.</p>' },
    { q: 'Can it explain a treatment without giving medical advice?',
      r: '<p>Yes, and that is how it is set up: it explains what you wrote about each treatment and books the consultation for the clinical decision. It does not diagnose or recommend doses.</p>' },
    { q: 'Does it work with leads from my Instagram and Facebook ads?',
      r: '<p>Yes. On the Complete plan, when someone fills in your Meta lead form, Hachi contacts them within seconds and keeps the consent text they accepted.</p>' },
    { q: 'What if a client wants to talk to a person?',
      r: '<p>The conversation goes to your team with all the context. Nobody gets stuck talking to a machine.</p>' }
  ],
  vecinos: ['capilar', 'unas', 'spa']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'dental',
  slug: 'dental-practices',
  nombre: 'Dental practices',
  nombreSchema: 'dental practices',
  enFrase: 'a dental practice',
  resumen: 'New-patient calls, toothaches and recalls nobody remembers',
  titulo: 'AI receptionist for dental practices | Hachi',
  descripcion: 'Answers your dental practice\'s phone, texts and WhatsApp, books new-patient visits and cleanings into your real calendar and hands emergencies to your team.',
  h1: 'AI receptionist for <em>dental practices</em>',
  entradilla: 'The phone rings exactly when the whole team has their hands in someone\'s ' +
    'mouth. Hachi picks up that call or text, books the new-patient visit or the cleaning, ' +
    'and when someone writes in pain, hands it to a person.',
  dolores: [
    { t: 'The missed call is a new patient',
      p: 'People looking for a dentist call several practices. The one that does not answer loses ' +
        'a first visit that could have become an implant or an aligner case.' },
    { t: 'Recall appointments that slip',
      p: 'The six-month cleaning depends on someone remembering to call. When it slips, the chair ' +
        'sits empty and the patient comes back when it hurts.' },
    { t: 'No-shows in the chair',
      p: 'An empty chair for an hour is a hygienist\'s hour paid for and not billed. Most of the ' +
        'time a reminder and a quick "are you still coming?" would have prevented it.' }
  ],
  escena: {
    persona: 'James', canal: 'Text · 8:04 am',
    alt: 'Sample conversation: a patient with a toothache texts and Hachi escalates to the team.',
    msgs: [
      ['in', 'Morning, my tooth has been killing me since last night and my face is swollen'],
      ['out', 'I\'m sorry you\'re dealing with that, James. This needs someone on the team right away: I\'ve just flagged your message to the office as urgent and they\'ll contact you now.'],
      ['in', 'ok thanks'],
      ['out', 'In the meantime, could you send me your full name and date of birth? That way your file is ready when they call.']
    ],
    nota: 'An emergency does not stay in a loop with the machine: it is escalated to a person, ' +
      'and if something fails internally, it is escalated anyway. A routine cleaning, on the ' +
      'other hand, it books on its own after checking the calendar.'
  },
  hace: [
    'Answers texts, WhatsApp and, with voice, <strong>the practice phone</strong>: it books during the call.',
    'Tells a cleaning from an exam or a new-patient visit, each with its own length and operatory or provider.',
    'Recognises an emergency by what it means — pain, swelling, a broken tooth — not by single keywords, and hands it to your team.',
    '<strong>SMS reminders</strong> with confirmation to cut no-shows, and a waiting list to refill the freed slot.',
    'Answers the repetitive questions with your information: hours, financing, which plans you accept, parking.'
  ],
  garantias: [
    { t: 'It does not lose an emergency.', p: 'Severe pain or a request to speak to someone is escalated to a person, even if something fails internally.' },
    { t: 'It does not confirm a taken slot.', p: 'It checks each operatory\'s calendar before offering a time. No free slot, no appointment.' },
    { t: 'It does not book in the past or the wrong time zone.', p: 'Dates like "Monday the 21st" or "the day after tomorrow" are calculated by the code in your practice\'s time zone.' }
  ],
  roi: { ticket: 200, margen: 60 },
  plan: { id: 'profesional',
    por: '<p>In dentistry the phone matters as much as texting, and voice starts on the ' +
      '<strong>Professional</strong> plan: 400 call minutes a month and a calendar per ' +
      'operatory or dentist.</p>',
    alternativa: 'If you only want to start with messaging, Essential covers several calendars; voice can be added.' },
  faq: [
    { q: 'Is Hachi HIPAA compliant?',
      r: '<p>Not today, and we would rather say so up front: we do not sign a HIPAA Business Associate Agreement yet. Most dental practices bill insurance and are covered entities, so tell us in the demo before sharing any patient data and we will tell you honestly whether it fits.</p>' },
    { q: 'Can it quote prices for implants or aligners?',
      r: '<p>The ones you give it. If a treatment needs a quote after an exam, it says so and books the first visit. A figure that is not in your information is not sent.</p>' },
    { q: 'What does it do with an after-hours emergency?',
      r: '<p>It flags it as urgent and hands it to your team straight away. What happens next — an on-call number, a first-thing appointment — is up to you and is configured that way.</p>' },
    { q: 'Does it work with my practice management software?',
      r: '<p>Hachi has its own calendar with a copy in Google Calendar, and can send every appointment to another system via webhook. A specific integration is assessed in the demo.</p>' }
  ],
  vecinos: ['estetica', 'fisioterapia', 'veterinaria']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'veterinaria',
  slug: 'veterinary-clinics',
  nombre: 'Veterinary clinics',
  nombreSchema: 'veterinary clinics',
  enFrase: 'a vet clinic',
  resumen: 'Vaccines, pet emergencies and phones that never stop',
  titulo: 'AI receptionist for veterinary clinics | Hachi',
  descripcion: 'Books vaccines, wellness exams and grooming into your real calendar, texts reminders before each visit and hands pet emergencies to your team, 24/7.',
  h1: 'AI receptionist for <em>veterinary clinics</em>',
  entradilla: 'A vet clinic gets two kinds of message: the routine one — "do you have ' +
    'anything for his shots?" — and the one that cannot wait — "my dog ate something". Hachi ' +
    'books the first on its own and hands the second to a person immediately.',
  dolores: [
    { t: 'The phone rings during the exam',
      p: 'The vet has a cat on the table and the front desk is checking someone out. The vaccine ' +
        'call goes unanswered, and that family books with the clinic down the road.' },
    { t: 'Vaccines that lapse without notice',
      p: 'Rabies, DHPP, flea and tick: appointments that repeat themselves if someone reminds the ' +
        'owner. If not, the pet shows up late, or never.' },
    { t: 'The emergency buried among routine texts',
      p: 'Among twenty "what time do you open?" messages, one says the dog is struggling to ' +
        'breathe. That one cannot wait for someone to check the phone.' }
  ],
  escena: {
    persona: 'Ashley', canal: 'Text · 7:40 pm',
    alt: 'Sample conversation: an owner books her dog\'s rabies vaccine by text.',
    msgs: [
      ['in', 'Hi, Luna is due for her rabies shot, anything this week?'],
      ['out', 'Hi Ashley! For Luna\'s rabies vaccine I have Thursday at 10:30 am or Friday at 6:00 pm. Which works better?'],
      ['in', 'Friday'],
      ['out', 'All set: Luna, rabies vaccine, Friday at 6:00 pm. Please bring her vaccination records. I\'ll text you a reminder on Thursday.']
    ],
    nota: 'If Ashley had written "Luna is vomiting blood", the conversation would have gone to a ' +
      'person on the team at that moment, without touching the calendar.'
  },
  hace: [
    'Asks for the <strong>pet\'s name and species</strong> before booking, because it is set up with the details your clinic needs.',
    'Books exams, vaccines, scheduled surgery or grooming, each with its own length and provider.',
    '<strong>SMS reminders</strong> before each visit; the next dose can be booked when the current one ends.',
    'Recognises an emergency (ingestion, wounds, trouble breathing) and hands it to a person instantly.',
    'Answers the phone with voice when the team cannot, and replies to Spanish-speaking pet owners in Spanish.'
  ],
  garantias: [
    { t: 'It does not lose an emergency.', p: 'A message describing an emergency is escalated to a person, even if something fails internally. Here that comes first.' },
    { t: 'It does not double-book.', p: 'Even if the owner insists or sends the details across several messages, the vaccine is booked once.' },
    { t: 'It does not confirm a taken slot.', p: 'It checks the vet\'s calendar before offering a time.' }
  ],
  roi: { ticket: 150, margen: 55 },
  plan: { id: 'profesional',
    por: '<p>A vet clinic runs on the phone, and voice starts on the ' +
      '<strong>Professional</strong> plan: 400 minutes a month, calendars for each vet and for ' +
      'grooming, and WhatsApp calls.</p>',
    alternativa: 'A small clinic can start on Essential and add voice as an add-on.' },
  faq: [
    { q: 'Does HIPAA apply to a vet clinic?',
      r: '<p>No. HIPAA protects human health information; animal records are not covered. You still have privacy obligations toward the owners\' personal data, and Hachi keeps each clinic\'s data isolated from every other.</p>' },
    { q: 'Can it give veterinary advice?',
      r: '<p>No, and it is set up not to. It informs with what you give it (hours, prices, pre-surgery instructions) and, for any symptom, books an exam or hands the conversation to a person.</p>' },
    { q: 'Does it remind owners about the next vaccine?',
      r: '<p>It sends a reminder for every booked appointment by SMS or WhatsApp. If the next dose is booked when the current one ends, the reminder goes out on its own.</p>' },
    { q: 'What happens with an emergency at night?',
      r: '<p>The conversation is flagged as urgent and goes to your team. If you have an on-call number or a partner emergency hospital, it is set up to give it.</p>' }
  ],
  vecinos: ['dental', 'peluqueria', 'hogar']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'fisioterapia',
  slug: 'physical-therapy',
  nombre: 'Physical therapy clinics',
  nombreSchema: 'physical therapy clinics',
  enFrase: 'a PT clinic',
  resumen: 'Session plans, several therapists and calls during treatment',
  titulo: 'AI receptionist for physical therapy clinics | Hachi',
  descripcion: 'Books sessions with the right therapist, handles reschedules without pulling anyone off the table and texts a reminder before every visit. Phone and text, any time.',
  h1: 'AI receptionist for <em>physical therapy clinics</em>',
  entradilla: 'A physical therapist has both hands busy for fifty minutes. In that time three ' +
    'patients text to move their session and a new one calls about back pain. Hachi answers ' +
    'all four without pulling anyone away from the table.',
  dolores: [
    { t: 'Stopping treatment to grab the phone',
      p: 'Every interruption breaks the session. Not answering means a new patient who books ' +
        'another clinic that same afternoon.' },
    { t: 'The rescheduling shuffle',
      p: 'Plans of care run over many visits and life gets in the way. Moving one by hand, ' +
        'checking a colleague\'s schedule and confirming takes ten unbilled minutes.' },
    { t: 'Slots that stay empty',
      p: 'A late cancellation is a lost visit unless someone offers it to the patient who was ' +
        'waiting for an opening.' }
  ],
  escena: {
    persona: 'Kevin', canal: 'Text · 1:21 pm',
    alt: 'Sample conversation: a patient reschedules a physical therapy session by text.',
    msgs: [
      ['in', 'Hey, I have PT with Sarah Thursday at 5 but got stuck with a meeting, can I move it?'],
      ['out', 'Sure, Kevin. With Sarah I have Thursday at 7:00 pm or Friday at 9:30 am. Does either work?'],
      ['in', 'Friday 9:30'],
      ['out', 'Changed: your session with Sarah is now Friday at 9:30 am and Thursday is free again. I\'ll text you a reminder the day before.']
    ],
    nota: 'Moving an appointment is two steps: free the old one and create the new one. If the ' +
      'second fails, the first is rolled back; Kevin is never left with neither.'
  },
  hace: [
    'Books with <strong>the therapist who treats that patient</strong>: each provider with their own calendar and hours.',
    'Reschedules and cancels on its own, and offers the freed slot to the waiting list.',
    'Explains your services, packages and cash prices with your information.',
    '<strong>SMS reminders</strong> with confirmation before every visit.',
    'Understands voice notes and replies to Spanish-speaking patients in Spanish.'
  ],
  garantias: [
    { t: 'It does not leave a reschedule half-done.', p: 'If a step fails while moving a session, it is rolled back: the old one is never cancelled with the new one missing.' },
    { t: 'It does not confirm a taken slot.', p: 'It checks that therapist\'s calendar before offering a time.' },
    { t: 'It does not double-book.', p: 'Even if the patient sends the time in one message and the day in another.' }
  ],
  roi: { ticket: 120, margen: 70 },
  plan: { id: 'esencial',
    por: '<p>With several therapists you need a calendar per provider, which starts on ' +
      '<strong>Essential</strong>, with 750 conversations a month and the dashboard.</p>',
    alternativa: 'If you practice solo, the Solo plan covers one calendar and one number.' },
  faq: [
    { q: 'Is Hachi HIPAA compliant?',
      r: '<p>We do not sign a HIPAA Business Associate Agreement today. Practices that bill insurance are covered entities, so tell us in the demo before sharing patient data. Cash-pay practices that never bill insurance are usually not covered entities.</p>' },
    { q: 'Does it know which therapist each patient sees?',
      r: '<p>It books with the provider the patient asks for or the one you set for that service. If someone says "with Sarah", it looks for a slot in Sarah\'s calendar.</p>' },
    { q: 'What if someone asks whether their injury is serious?',
      r: '<p>It does not diagnose. It offers an evaluation with a therapist, and if the message sounds urgent, it hands it to a person.</p>' },
    { q: 'Can it sell session packages?',
      r: '<p>It explains your packages and their prices and books the sessions. Payment stays with your clinic.</p>' }
  ],
  vecinos: ['psicologia', 'dental', 'spa']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'psicologia',
  slug: 'therapists',
  nombre: 'Therapists and counselors',
  nombreSchema: 'therapists and counselors',
  enFrase: 'a therapy practice',
  resumen: 'First sessions, discretion, and messages a machine should not handle',
  titulo: 'AI receptionist for therapists and counselors | Hachi',
  descripcion: 'Books intake calls and sessions while you are in session, discreetly. Anything sensitive goes to you right away and never stays with the machine.',
  h1: 'AI receptionist for <em>therapists and counselors</em>',
  entradilla: 'You cannot check your phone during a session, and someone reaching out for help ' +
    'for the first time should not wait two days. Hachi books the intake discreetly and leaves ' +
    'everything that is not logistics to you.',
  dolores: [
    { t: 'The first message is the hardest to send',
      p: 'It took someone weeks to decide. If nobody replies, they may not try again.' },
    { t: 'You work alone, and you are in session',
      p: 'Most practices are one clinician. While you see a client, nobody answers, and between ' +
        'sessions you have ten minutes.' },
    { t: 'Last-minute cancellations',
      p: 'A lost session is an hour you do not get back. A reminder with confirmation leaves time ' +
        'to offer it to someone else.' }
  ],
  escena: {
    persona: 'Rachel', canal: 'Text · 9:55 pm',
    alt: 'Sample conversation: a person requests a first therapy session by text and Hachi books it.',
    msgs: [
      ['in', 'Hi, I\'d like to schedule a first appointment. I\'ve been dealing with a lot of anxiety lately'],
      ['out', 'Hi Rachel, thank you for reaching out; taking this step matters. The first session is 50 minutes, in person or online. I have Monday at 6:00 pm or Wednesday at 10:00 am. Which do you prefer?'],
      ['in', 'Monday, online'],
      ['out', 'Booked: first online session on Monday at 6:00 pm. You\'ll get the link and a reminder the day before.']
    ],
    nota: 'The assistant does not do therapy or give clinical advice. If a message sounds like a ' +
      'crisis, it is set up to pass it to you immediately instead of trying to handle it.'
  },
  hace: [
    'Books <strong>intake sessions and follow-ups</strong>, in person or telehealth, into your real calendar.',
    'Explains how you work, session length, fees and your cancellation policy in your words.',
    'Reminder before each session by SMS, with an option to confirm or reschedule.',
    'Any sensitive message goes to you with the context; the assistant stays out of the clinical side.',
    'Says it is an AI assistant if asked. It never presents itself as a person.'
  ],
  garantias: [
    { t: 'It does not claim to be a person.', p: 'If asked, it says it is an AI assistant. In a therapy practice, that honesty is not negotiable.' },
    { t: 'It does not lose a sensitive message.', p: 'Anything that sounds urgent, or a request to speak to you, is escalated, even if something fails internally.' },
    { t: 'It does not mix data between practices.', p: 'Each practice is isolated from the others; what one person writes cannot show up in another account.' }
  ],
  roi: { ticket: 150, margen: 85 },
  plan: { id: 'autonomo',
    por: '<p>Most practices are one clinician with one calendar, which is exactly the ' +
      '<strong>Solo</strong> plan: messaging around the clock, real booking and reminders.</p>',
    alternativa: 'A group practice needs a calendar per clinician: the Essential plan.' },
  faq: [
    { q: 'Is Hachi HIPAA compliant?',
      r: '<p>Not today: we do not sign a HIPAA Business Associate Agreement yet. If your practice bills insurance, you are likely a covered entity, so tell us in the demo before sharing client data and we will tell you honestly whether it fits.</p>' },
    { q: 'What happens if someone writes in crisis?',
      r: '<p>The assistant does not try to handle it: it is set up to pass the message to you immediately and, if you choose, to share the 988 Suicide &amp; Crisis Lifeline or another number you pick. You decide that wording in advance.</p>' },
    { q: 'Can it book telehealth sessions?',
      r: '<p>Yes: it is one more service with its own length. You set the video link.</p>' },
    { q: 'Will clients notice it is an assistant?',
      r: '<p>It writes naturally and in your tone, but it does not hide what it is: if asked, it says so.</p>' }
  ],
  vecinos: ['fisioterapia', 'estetica', 'spa']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'peluqueria',
  slug: 'hair-salons-and-barbershops',
  nombre: 'Hair salons and barbershops',
  nombreSchema: 'hair salons and barbershops',
  enFrase: 'a salon',
  resumen: 'Color or cut, each with its own time, and the phone ringing mid-fade',
  titulo: 'AI receptionist for hair salons and barbershops | Hachi',
  descripcion: 'Books cuts, color and beard trims with the right length and the stylist your client asks for, while you work. With text reminders and a waiting list.',
  h1: 'AI receptionist for <em>hair salons and barbershops</em>',
  entradilla: 'You cannot answer a text with clippers in your hand. And a color appointment ' +
    'does not take as long as a fade. Hachi books every service with its real length and with ' +
    'the stylist the client wants.',
  dolores: [
    { t: 'Replying with the blow dryer running',
      p: 'Every message you answer halfway keeps someone waiting in the chair. Every message you ' +
        'do not answer is a booking that goes to another shop.' },
    { t: 'A badly calculated book',
      p: 'Squeezing a full color into a thirty-minute gap wrecks the afternoon. Service length ' +
        'matters as much as the time.' },
    { t: 'An empty Saturday slot',
      p: 'A Saturday no-show is the best hour of the week gone. With a reminder and a waiting ' +
        'list, that slot fills again.' }
  ],
  escena: {
    persona: 'Marcus', canal: 'Text · 8:18 pm',
    alt: 'Sample conversation: a client books a cut and beard trim with a specific barber by text.',
    msgs: [
      ['in', 'Yo can I get a cut and beard with Danny on Saturday?'],
      ['out', 'Hey Marcus! Danny has Saturday at 10:00 am and 12:30 pm. Cut and beard is 45 minutes. Which one should I hold?'],
      ['in', '10'],
      ['out', 'Locked in: cut and beard with Danny, Saturday at 10:00 am. I\'ll text you a reminder Friday.']
    ],
    nota: 'Hachi knows a cut and beard takes 45 minutes and looks for a 45-minute gap in ' +
      'Danny\'s book, not anyone\'s.'
  },
  hace: [
    'Books each service with <strong>its real length</strong>: cut, color, highlights, beard, treatment.',
    'Respects the stylist the client asks for: "with Danny" searches Danny\'s book.',
    '<strong>Text reminder</strong> the day before and a waiting list for freed slots.',
    'Answers prices, hours and location with your information, even at 2 am, in English or Spanish.',
    'Understands the reference photos clients send ("I want this color").'
  ],
  garantias: [
    { t: 'It does not confirm a taken slot.', p: 'It looks for a gap that fits the whole service, not just the start time.' },
    { t: 'It does not double-book.', p: 'Even if the client repeats the request or sends the day and time separately.' },
    { t: 'It does not invent a price.', p: 'If a service has no price on your list, it does not make one up: it says it will be confirmed at the salon.' }
  ],
  roi: { ticket: 45, margen: 70 },
  plan: { id: 'porCita',
    por: '<p>With tickets of $30 to $50, paying for results usually works out better: the ' +
      '<strong>Pay-per-booking</strong> plan charges a small base fee plus a fixed amount per ' +
      'booking, with unlimited conversations and a monthly cap.</p>',
    alternativa: 'With several stylists and high volume, the Essential plan gives each one a calendar at a fixed fee.' },
  faq: [
    { q: 'Does it know how long each service takes?',
      r: '<p>Yes: each service is set up with its length, and the assistant only offers slots where it fits in full.</p>' },
    { q: 'Can clients choose their stylist?',
      r: '<p>Yes. With several stylists, each one has a calendar and clients can ask for theirs.</p>' },
    { q: 'Does it pay off with low tickets?',
      r: '<p>That is what the Pay-per-booking plan is for: a small base fee and a fixed amount per booking, with a monthly cap so you never pay more than a fixed plan.</p>' },
    { q: 'Does it work for walk-in only shops?',
      r: '<p>If everything is first come, first served, there is no calendar to fill and it would add little: it would answer hours and prices. It fits when you take appointments.</p>' }
  ],
  vecinos: ['unas', 'spa', 'estetica']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'unas',
  slug: 'beauty-and-nail-salons',
  nombre: 'Beauty and nail salons',
  nombreSchema: 'beauty and nail salons',
  enFrase: 'a nail salon',
  resumen: 'Fills every three weeks, stations, and regulars who book by text',
  titulo: 'AI receptionist for beauty and nail salons | Hachi',
  descripcion: 'Books manicures, fills, lashes and waxing with the right length and station, and reminds every client when her next visit is due. Texts answered while you work.',
  h1: 'AI receptionist for <em>beauty and nail salons</em>',
  entradilla: 'A beauty salon lives on regulars: the fill every three weeks, lashes every four. ' +
    'Hachi books every service at its station and with its time, and reminds the client so ' +
    'the chair does not sit empty.',
  dolores: [
    { t: 'Halfway through a gel set',
      p: 'You cannot stop a manicure to answer the phone. And the client who texts wants to know ' +
        'now whether Friday is open.' },
    { t: 'Services that are not the same length',
      p: 'A gel polish, an acrylic fill or a lash set take very different times. A poorly ' +
        'planned book is an afternoon of running late.' },
    { t: 'The regular who forgets',
      p: 'If nobody reminds her the fill is due, it slips, a nail breaks and she ends up at the ' +
        'salon that did reply.' }
  ],
  escena: {
    persona: 'Jasmine', canal: 'Text · 10:03 pm',
    alt: 'Sample conversation: a client books an acrylic fill and Hachi finds the open station.',
    msgs: [
      ['in', 'hiii i need a fill, anything friday afternoon?'],
      ['out', 'Hi Jasmine! An acrylic fill is 1 hour 15 minutes. Friday I have 4:00 pm or 6:30 pm. Want me to hold one?'],
      ['in', '4 pls'],
      ['out', 'Perfect: acrylic fill on Friday at 4:00 pm. I\'ll text you Thursday to confirm.']
    ],
    nota: 'The time it offers is a gap where the full hour and fifteen minutes fits, checked ' +
      'against the calendar before it is offered.'
  },
  hace: [
    'Books manicures, pedicures, fills, lashes, brows or waxing with <strong>their length</strong> and their station or tech.',
    '<strong>SMS reminders</strong> with confirmation, and a waiting list for freed slots.',
    'Answers prices, techniques and aftercare in your words, in English or Spanish.',
    'Understands the nail-art photos clients send.',
    'On the right plan, campaigns to fill a slow week, with replies handled by the assistant.'
  ],
  garantias: [
    { t: 'It does not confirm a taken slot.', p: 'It only offers gaps where the whole service fits.' },
    { t: 'It does not invent a price.', p: 'A custom design with no price on your list is confirmed at the salon, not improvised.' },
    { t: 'It does not double-book.', p: 'Even if the client repeats the request in another message.' }
  ],
  roi: { ticket: 50, margen: 65 },
  plan: { id: 'esencial',
    por: '<p>With several techs or stations you need a calendar for each, which starts on ' +
      '<strong>Essential</strong>, with 750 conversations a month.</p>',
    alternativa: 'If you work alone, Pay-per-booking or Solo will work out better.' },
  faq: [
    { q: 'Can it book a specific station?',
      r: '<p>Yes. Each station or tech is a calendar, and each service is assigned to the right one.</p>' },
    { q: 'Does it remind clients when their next visit is due?',
      r: '<p>It sends a reminder for every booked appointment. If the next one is booked at checkout, the reminder goes out on its own.</p>' },
    { q: 'Can I send promotions to my clients?',
      r: '<p>On the Complete plan, campaigns to your own client list, with the consent that list carries. Replies are handled by the assistant.</p>' },
    { q: 'Does it understand nail-art photos?',
      r: '<p>Yes: it reads the image and replies accordingly. If the design needs to be quoted, it says so and offers a time.</p>' }
  ],
  vecinos: ['peluqueria', 'estetica', 'capilar']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'spa',
  slug: 'spas-and-massage',
  nombre: 'Day spas and massage studios',
  nombreSchema: 'day spas and massage studios',
  enFrase: 'a spa',
  resumen: 'Massages, packages, gift cards and weekend bookings',
  titulo: 'AI receptionist for day spas and massage studios | Hachi',
  descripcion: 'Answers the Sunday-night "do you have a massage Saturday?" text, books with the right therapist and room, and sends a reminder so the booking holds.',
  h1: 'AI receptionist for <em>day spas and massage studios</em>',
  entradilla: 'Nobody decides on a massage at 11 am on a Tuesday; they decide on the couch on a ' +
    'Sunday night. Hachi answers then, explains your services and leaves the booking in the ' +
    'right room.',
  dolores: [
    { t: 'The impulse booking',
      p: 'A massage gets booked when the mood strikes. If the answer arrives Monday, the mood has ' +
        'passed or they booked elsewhere.' },
    { t: 'Explaining the same thing twenty times',
      p: 'What the package includes, how long the ritual takes, what to wear. Reasonable ' +
        'questions that eat the front desk\'s day.' },
    { t: 'Rooms and therapists matched by hand',
      p: 'A 90-minute massage needs a free therapist and a free room at the same time. Juggling ' +
        'that over the phone is where overlaps happen.' }
  ],
  escena: {
    persona: 'Olivia', canal: 'Text · 10:47 pm',
    alt: 'Sample conversation: a client asks about massage types and Hachi books a deep tissue massage.',
    msgs: [
      ['in', 'Hi! What\'s the difference between swedish and deep tissue? Looking for Saturday'],
      ['out', 'Hi Olivia! Swedish is gentle and good for unwinding; deep tissue works with firmer pressure on tight areas like neck and back. Both are 60 minutes. Saturday I have 11:00 am and 5:30 pm. Which sounds good?'],
      ['in', 'Deep tissue at 5:30'],
      ['out', 'Booked: deep tissue massage, Saturday at 5:30 pm. Please arrive ten minutes early. I\'ll text you a reminder Friday.']
    ],
    nota: 'The explanation comes from your own service menu, uploaded once: change a service and ' +
      'the answers change, with no flow to redraw.'
  },
  hace: [
    'Explains <strong>your massage and package menu</strong> in your words, at night and on weekends too.',
    'Books with the therapist and the length of each service.',
    'Explains gift cards, memberships and policies with your information.',
    '<strong>SMS reminders</strong> with confirmation, and a waiting list for cancellations.',
    'Answers in English, Spanish and Portuguese, handy if you get tourists.'
  ],
  garantias: [
    { t: 'It does not confirm a taken slot.', p: 'It checks the calendar before offering: never two clients with the same therapist at the same time.' },
    { t: 'It does not invent a price.', p: 'Package and membership prices come from your list. Anything missing is confirmed.' },
    { t: 'It does not book in the past.', p: '"This Saturday" is calculated in your spa\'s time zone, not the server\'s.' }
  ],
  roi: { ticket: 120, margen: 65 },
  plan: { id: 'esencial',
    por: '<p>With several therapists you need a calendar per person: the ' +
      '<strong>Essential</strong> plan, with your knowledge base for the service menu.</p>',
    alternativa: 'A single-therapist studio fits Solo; with lots of phone calls, Professional.' },
  faq: [
    { q: 'Can it sell gift cards?',
      r: '<p>It explains them and how to buy them with what you tell it. Payment stays with your spa.</p>' },
    { q: 'Does it understand the difference between my services?',
      r: '<p>The one you explain: upload your service menu and it answers from it. If something is not there, it does not make it up.</p>' },
    { q: 'Can it answer tourists in other languages?',
      r: '<p>Yes: it replies in English, Spanish or Portuguese depending on the language the person writes in. Your services and prices stay as they are; only the reply is translated.</p>' },
    { q: 'What if someone mentions a health condition?',
      r: '<p>It does not give health advice. If someone mentions an injury or a pregnancy, it answers with what you have set and, if needed, passes the conversation to the team.</p>' }
  ],
  vecinos: ['estetica', 'unas', 'fisioterapia']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'taller',
  slug: 'auto-repair-shops',
  nombre: 'Auto repair shops',
  nombreSchema: 'auto repair shops',
  enFrase: 'an auto shop',
  resumen: 'Oil changes, diagnostics and the phone ringing while you are under a car',
  titulo: 'AI receptionist for auto repair shops | Hachi',
  descripcion: 'Answers the shop phone and texts while you are under a car, asks for year, make and model, reads photos of the damage and books the diagnostic or service.',
  h1: 'AI receptionist for <em>auto repair shops</em>',
  entradilla: 'In a shop the phone rings when your hands are covered in grease. The customer ' +
    'wants to know if you can look at the car this week. Hachi picks up, takes the vehicle ' +
    'details and leaves the appointment on your schedule.',
  dolores: [
    { t: 'Nobody picks up the shop phone',
      p: 'With two or three techs working, the phone just rings. That brake job ends up at the ' +
        'shop across the street.' },
    { t: 'Appointments without the vehicle',
      p: 'Writing down "John, Tuesday" is useless if you do not know the car or what is wrong. ' +
        'Then someone has to call back.' },
    { t: 'The quote given blind',
      p: 'A price given over the phone without seeing the car is a guaranteed argument when the ' +
        'invoice arrives.' }
  ],
  escena: {
    persona: 'Carlos', canal: 'Phone call · 10:26 am',
    alt: 'Sample conversation: a customer calls about squeaky brakes and Hachi books a diagnostic.',
    msgs: [
      ['in', 'Hi, my car makes a weird noise when I brake, can you guys take a look?'],
      ['out', 'Sure. To find out what it is, the best start is a brake inspection. Can I get the year, make and model?'],
      ['in', '2018 Toyota Camry'],
      ['out', 'Got it, Carlos. For the inspection I have tomorrow at 9:00 am or Thursday at 3:00 pm. Does either work? The repair price comes once the tech has seen it.']
    ],
    nota: 'The details it asks for — year, make, model — are set up for your shop, and it will ' +
      'not book without them. It does not invent a repair price: your tech gives it afterwards.'
  },
  hace: [
    'Answers <strong>the shop phone with voice</strong> and books during the call.',
    'Asks for <strong>year, make and model</strong> before booking, because it is set up with the details you need.',
    'Reads photos customers send of the damage, the dashboard light or the tire.',
    'Books oil changes, inspections, tire service or diagnostics, each with its own length.',
    'Gives your flat-rate prices (an oil change, an inspection); anything that needs a look is quoted at the shop.',
    '<strong>Text reminders</strong> before the visit, and in Spanish for Spanish-speaking customers.'
  ],
  garantias: [
    { t: 'It does not invent a quote.', p: 'An amount that is not on your price list is removed before sending. For a repair, it says the price comes after the diagnostic.' },
    { t: 'It does not confirm a taken slot.', p: 'It checks the shop schedule before giving a time.' },
    { t: 'It does not double-book.', p: 'Even if the customer insists or gives the vehicle details across several messages.' }
  ],
  roi: { ticket: 450, margen: 35 },
  plan: { id: 'profesional',
    por: '<p>In a shop almost everything comes in by phone, and voice starts on the ' +
      '<strong>Professional</strong> plan: 400 minutes a month and WhatsApp calls.</p>',
    alternativa: 'If your customers text more than they call, Essential with the voice add-on also works.' },
  faq: [
    { q: 'Does it know the status of a repair?',
      r: '<p>Not today: that lives in your shop. If someone asks "is my car ready?", the assistant notes it and alerts your team to reply.</p>' },
    { q: 'Can it give quotes?',
      r: '<p>The flat-rate prices you give it, yes. A repair that needs a diagnostic, no: it books the diagnostic and says the price comes afterwards.</p>' },
    { q: 'What vehicle details does it ask for?',
      r: '<p>Whatever you set: usually year, make and model, sometimes mileage or the VIN. It will not book without them.</p>' },
    { q: 'Does it take calls while we are working?',
      r: '<p>Yes: with voice it picks up, talks naturally and books. Every call is logged in the dashboard with its transcript and summary.</p>' }
  ],
  vecinos: ['hogar', 'veterinaria', 'peluqueria']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'capilar',
  slug: 'hair-restoration-and-laser-clinics',
  nombre: 'Hair restoration and laser clinics',
  nombreSchema: 'hair restoration and laser hair removal clinics',
  enFrase: 'a hair restoration or laser clinic',
  resumen: 'Transplant consultations, laser session series and lots of ads',
  titulo: 'AI receptionist for hair restoration and laser clinics | Hachi',
  descripcion: 'Answers people asking about a hair transplant or laser hair removal, books the consultation and every session on schedule, and follows up with those who went quiet.',
  h1: 'AI receptionist for <em>hair restoration and laser clinics</em>',
  entradilla: 'A hair transplant is decided slowly and paid for dearly; laser hair removal is ' +
    'six or seven spaced sessions. Both depend on answering the first message fast and not ' +
    'losing anyone between one session and the next.',
  dolores: [
    { t: 'The expensive lead nobody answers',
      p: 'An ad lead for a transplant costs real money. If it takes a day to get a reply, that ' +
        'money is wasted.' },
    { t: 'Sessions that drift',
      p: 'Laser works when the intervals are kept. A client who does not book the next session ' +
        'in time loses results and ends up unhappy.' },
    { t: 'The decision that cools off',
      p: 'Someone asking about a transplant thinks about it for weeks. Without follow-up, the ' +
        'conversation stops at the price.' }
  ],
  escena: {
    persona: 'Daniel', canal: 'WhatsApp · 12:14 am',
    alt: 'Sample conversation: a prospect asks about a hair transplant, sends a photo and Hachi books the consultation.',
    msgs: [
      ['in', 'Hey, how much for a hair transplant? Sending you a pic of where I\'m at'],
      ['in', '📷 Photo'],
      ['out', 'Thanks, Daniel. From the photo I can see thinning at the temples. The price depends on how many grafts you need, and the doctor sets that in a free consultation. Want me to book it? I have Tuesday at 6:00 pm or Saturday at 10:30 am.'],
      ['in', 'Saturday'],
      ['out', 'Done: hair consultation on Saturday at 10:30 am. I\'ll text you a reminder Friday.']
    ],
    nota: 'The assistant describes the photo and does not quote a price that depends on the ' +
      'consultation: it books the consultation. If your list has starting prices, it gives them ' +
      'as they are.'
  },
  hace: [
    'Someone fills in your transplant or laser ad form on Instagram: Hachi texts them within seconds, while they are still on their phone.',
    'Reads photos of the area and offers the consultation.',
    'Books every laser session with its length, and the next one when the current one ends.',
    '<strong>Proactive follow-up</strong> with people who asked the price and did not book.',
    '<strong>SMS reminders</strong> with confirmation so session intervals do not break.'
  ],
  garantias: [
    { t: 'It does not invent a price.', p: 'An amount that is not in your information is removed. A transplant that depends on the consultation gets a consultation.' },
    { t: 'It does not confirm a taken slot.', p: 'It checks the doctor\'s or the laser room\'s calendar before offering a time.' },
    { t: 'It does not book in the past.', p: 'Dates are calculated in your clinic\'s time zone, "in six weeks" included.' }
  ],
  roi: { ticket: 250, margen: 60 },
  plan: { id: 'completa',
    por: '<p>These clinics live on ads and follow-up — Lead Ads, proactive follow-up, ' +
      'campaigns — and that is the <strong>Complete</strong> plan.</p>',
    alternativa: 'If you do not advertise, the Professional plan covers messaging, the phone and several calendars.' },
  faq: [
    { q: 'Can it assess a photo and say how many grafts are needed?',
      r: '<p>No. It describes what it sees so the conversation flows, but the assessment belongs to the doctor. What it does is book it.</p>' },
    { q: 'Does it book laser sessions at the right interval?',
      r: '<p>It books each session on the requested date and sends a reminder beforehand. If the next session is booked when one ends, the interval is covered.</p>' },
    { q: 'Is Hachi HIPAA compliant?',
      r: '<p>Hair restoration and laser removal are almost always paid out of pocket, and a clinic that never bills insurance is usually outside HIPAA. We still do not sign Business Associate Agreements today, so if any service you offer goes through insurance, raise it in the demo first.</p>' },
    { q: 'Can it offer financing?',
      r: '<p>It explains the options you give it. Approval stays with the lender and your clinic.</p>' }
  ],
  vecinos: ['estetica', 'unas', 'dental']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'hogar',
  slug: 'plumbers-electricians-and-home-services',
  nombre: 'Plumbers, electricians and home services',
  nombreSchema: 'plumbers, electricians and home service businesses',
  enFrase: 'a home service business',
  resumen: 'House calls, water emergencies and the phone ringing mid-job',
  titulo: 'AI receptionist for plumbers, electricians and home services',
  descripcion: 'Answers calls and texts while you are on a job, asks for the address and a photo of the problem, books the visit into your arrival window and flags emergencies.',
  h1: 'AI receptionist for <em>plumbers, electricians and home services</em>',
  entradilla: 'In the trades you spend the day up a ladder or under a sink. Every call you ' +
    'miss is a job someone else gets. Hachi answers, collects what you need to know and leaves ' +
    'the visit on your schedule.',
  dolores: [
    { t: 'The job goes to the next name on the list',
      p: 'Someone with a problem calls the first number they find. If you do not answer, they ' +
        'call the second one, and that is who gets the job.' },
    { t: 'Showing up blind',
      p: 'Arriving without knowing what is wrong — the water heater? an outlet? — means a second ' +
        'trip for the part. A photo before you go saves a truck roll.' },
    { t: 'Emergencies mixed in with estimates',
      p: 'A leak flooding the kitchen cannot wait in the same line as an estimate for next ' +
        'month\'s remodel.' }
  ],
  escena: {
    persona: 'Emily', canal: 'Text · 6:52 pm',
    alt: 'Sample conversation: a homeowner reports a tripping breaker and Hachi books a visit in an arrival window.',
    msgs: [
      ['in', 'Hi, half my kitchen lost power and the breaker keeps tripping'],
      ['out', 'Hi Emily. Could you send me a photo of the breaker panel and your address? That way the electrician knows what to expect.'],
      ['in', '📷 Photo · 1420 Oak St, Apt 3B'],
      ['out', 'Got it. I can book the visit tomorrow between 9 and 11 am or between 4 and 6 pm. Which do you prefer?']
    ],
    nota: 'You define the arrival windows (for example, two hours each). If Emily had written ' +
      'that water was coming through the ceiling, the conversation would have gone to you ' +
      'immediately.'
  },
  hace: [
    'Answers <strong>the phone with voice</strong> and texts while you work, and books the visit.',
    'Asks for <strong>the address, what happened and a photo</strong> before booking, because it is set up with what you need.',
    'Books into <strong>arrival windows</strong> you define, not an exact time you cannot keep.',
    'Recognises an emergency (a leak, something that cannot wait until tomorrow) and hands it to you right away.',
    '<strong>Text reminder</strong> the day before so the customer is home when you arrive, in English or Spanish.'
  ],
  garantias: [
    { t: 'It does not lose an emergency.', p: 'A problem that cannot wait is escalated to you, even if something fails internally.' },
    { t: 'It does not invent a quote.', p: 'It gives your service-call fee if it is on your price list; a repair is quoted on site.' },
    { t: 'It does not double-book a window.', p: 'It checks your schedule before offering a window: it will not send you to two houses at once.' }
  ],
  roi: { ticket: 300, margen: 50 },
  plan: { id: 'profesional',
    por: '<p>The trades run on the phone, and voice starts on the <strong>Professional</strong> ' +
      'plan: 400 minutes a month, calendars for each tech if you are a crew, and WhatsApp calls.</p>',
    alternativa: 'If you work solo and customers text more than they call, Solo with the voice add-on is enough.' },
  faq: [
    { q: 'Can it dispatch jobs to my techs and plan routes?',
      r: '<p>It distributes by calendar: each tech has one and the assistant books where there is room. It does not optimise routes between houses; dedicated dispatch software does that.</p>' },
    { q: 'What about emergencies at night?',
      r: '<p>They are flagged as urgent and reach you immediately. If you run an after-hours service at a different rate, the assistant explains it with your information.</p>' },
    { q: 'Does it give estimates?',
      r: '<p>It gives the fixed prices you set — service call, hourly rate, a standard install. Anything that depends on seeing the problem is booked as a diagnostic visit.</p>' },
    { q: 'Does it work for a maintenance company with service contracts?',
      r: '<p>It works for booking visits and talking to customers. If your work is mostly contract tickets with SLAs, tell us in the demo and we will tell you honestly whether it fits.</p>' }
  ],
  vecinos: ['taller', 'veterinaria', 'peluqueria']
}

];
