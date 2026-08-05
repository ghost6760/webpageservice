/**
 * Source of /faq.html — the English twin of es/preguntas.html.
 *
 * Same nine sections and the same 75 questions, so the two language versions
 * stay comparable. Only the wording differs.
 *
 * PUBLICATION RULE: problem space only. No enumerated guarantees, no method for
 * deriving them, no historical bugs. Describe WHAT the system guarantees, never
 * HOW it is built.
 */

module.exports = [

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'What Hachi is, and who it is for',
  icono: '🐕',
  intro: 'The basics: what it does, what it does not do, and whether it fits your business.',
  preguntas: [
    {
      q: 'What exactly is Hachi?',
      r: `<p>An AI assistant that answers your WhatsApp around the clock,
          <strong>checks your real calendar</strong> and books the appointment. Then it sends
          the reminders, and if someone asked and went quiet, it writes back.</p>
          <p>The difference from most of the market is one verb: it does not only
          <em>converse</em>, it also <em>executes</em> against your calendar.</p>`
    },
    {
      q: 'Is it a chatbot?',
      r: `<p>Not in the usual sense. A menu chatbot makes you press "1 to book, 2 for prices"
          and breaks the moment you type something it was not expecting. Hachi understands
          free language, in text and in voice notes, and when a conversation turns delicate it
          flags someone on your team instead of improvising.</p>`
    },
    {
      q: 'Does it replace my receptionist?',
      r: `<p>No, and we do not sell it that way. It takes the repetitive part off their plate —
          prices, opening hours, location, parking, what to do beforehand — which is 80% of the
          messages. Your team spends its time on whoever is actually in the building, which is
          where the difference shows.</p>`
    },
    {
      q: 'I am not a clinic. Does it still work for me?',
      r: `<p>Yes. Hachi is not built for a sector, it is built for a problem: people message you
          when you cannot answer, and by the time you do it is too late.</p>
          <p>It works for hair and barber shops, tattoo studios, vets, garages, academies,
          photography, consultancies and practices. The vocabulary changes — where it says
          "patient" it will say "client" — and so does your list of services. Nothing else.</p>`
    },
    {
      q: 'I work alone, with no team. Does it make sense for me?',
      r: `<p>That is precisely where it shows most, because there is no front desk to absorb the
          messages: either you answer or nobody does. The
          <strong>Solo plan (€149/month)</strong> exists for exactly that — one calendar, one
          number — and there is no minimum below which we turn you away.</p>`
    },
    {
      q: 'Do I need to be a registered company?',
      r: `<p>No. We invoice sole traders against their own tax ID without any problem, and the
          invoice carries Spanish VAT and is deductible like any other supplier's.</p>`
    },
    {
      q: 'When does Hachi NOT make sense?',
      r: `<p>We would rather say it than sell you something you will not use. It does not pay
          off if you <strong>do not work by appointment</strong>, if you receive
          <strong>very few messages a month</strong> (losing three messages does not cover a
          subscription), or if <strong>WhatsApp is not your channel</strong> because you sell
          in a shop or over the phone.</p>`
    },
    {
      q: 'Which sectors do you have the most experience in?',
      r: `<p>Aesthetic medicine — the main one — dental practices, spa and wellness, and other
          health and therapy practices: physiotherapy, nutrition, psychology, podiatry, speech
          therapy. Also solo professionals and appointment-based businesses outside healthcare.
          The list is where we have flying hours, not who we accept.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'Pricing, plans and billing',
  icono: '💶',
  intro: 'All figures in euros, VAT not included, and no lock-in.',
  preguntas: [
    {
      q: 'How much does Hachi cost per month?',
      r: `<p>Five plans: <strong>Solo €149</strong>, <strong>Essential €390</strong>,
          <strong>Professional €690</strong>, <strong>Complete €990</strong> and
          <strong>Multi-site from €1,690</strong> a month. No lock-in: the fee is monthly and
          you can leave whenever you want.</p>
          <p>They are laid out in detail on the <a href="/#pricing">pricing section</a>.</p>`
    },
    {
      q: 'What does each plan include?',
      r: `<ul>
            <li><strong>Solo (€149)</strong> — WhatsApp 24/7, real calendar, cancellations and
                rescheduling, reminders, 250 conversations/month.</li>
            <li><strong>Essential (€390)</strong> — the above plus several calendars or
                practitioners, full dashboard with metrics, 750 conversations/month.</li>
            <li><strong>Professional (€690)</strong> — plus phone handling with an AI voice that
                books during the call, 1,500 conversations and 400 minutes.</li>
            <li><strong>Complete (€990)</strong> — plus proactive follow-up, WhatsApp campaigns
                and outbound calls, 3,000 conversations and 800 minutes.</li>
            <li><strong>Multi-site (from €1,690)</strong> — several sites in one account, your
                own branding, and reselling.</li>
          </ul>`
    },
    {
      q: 'Is there a setup fee?',
      r: `<p>Yes, a one-off charge from <strong>€290 to €1,690</strong> depending on the plan —
          under two months of fee in every case. It covers loading your services, prices and
          durations, connecting your WhatsApp number and your calendar, configuring your real
          opening hours, tuning your brand's tone and training your team.</p>
          <p><strong>It is not charged until you decide to continue</strong> after the free
          trial, and it is waived entirely if you pay a quarter up front.</p>`
    },
    {
      q: 'When do I pay for the first time?',
      r: `<p>At the end, and only if you say yes. In order: the demo video call costs
          <strong>€0</strong>, configuring your assistant <strong>€0</strong>, the 7-day trial
          <strong>€0</strong>. If you decide to continue, that is when setup (once) and the
          first monthly fee appear. If you decide not to, <strong>€0</strong>. No card is asked
          for to run the trial.</p>`
    },
    {
      q: 'How many saved appointments a month does it take to pay for itself?',
      r: `<p>At a €200 average ticket and a <strong>65% contribution margin</strong>: 2
          appointments for Solo, 3 for Essential, 6 for Professional and 8 for Complete. At a
          €400 ticket, halve each figure.</p>
          <p>Margin is counted rather than revenue on purpose: a €200 appointment is not €200
          of profit, because it consumes product and consumables. You can run the maths on your
          own numbers in the <a href="/calculator.html">ROI calculator</a>.</p>`
    },
    {
      q: 'What counts as a "conversation"?',
      r: `<p>One customer talking to you across <strong>24 hours</strong>, not each message. If
          somebody sends thirty messages in an afternoon sorting out their questions and
          booking, that is <strong>one conversation</strong>.</p>
          <p>Which is why the allowances go further than they look: a clinic receiving "20
          messages a day" usually lands at 150-250 conversations a month, not 600.</p>`
    },
    {
      q: 'What happens if I go over the plan limit?',
      r: `<p><strong>The service is not cut off.</strong> No customer of yours goes unanswered
          for having hit a cap: that would be the opposite of what you bought.</p>
          <p>Conversations beyond the plan are billed at <strong>€0.25</strong> each and call
          minutes at <strong>€0.20</strong>, itemised line by line on the invoice. If you go
          over two months running we tell you and suggest moving up a plan, which is almost
          always cheaper than paying the excess.</p>`
    },
    {
      q: 'Why is there a conversation limit at all?',
      r: `<p>It is not an artificial cap to push you upmarket. Every reply consumes AI
          processing charged by usage; the WhatsApp provider charges per message; and there is
          hosting, history storage and human maintenance work behind it.</p>
          <p>One detail almost nobody states correctly: <strong>replying within 24 hours of the
          customer's message costs Meta nothing</strong>. What is paid for are the messages we
          initiate — reminders and campaigns. The limit sizes the service; it does not cover a
          Meta tariff.</p>`
    },
    {
      q: 'Can I change plan?',
      r: `<p>Yes, up or down whenever you like; it applies from the next invoice. Not getting it
          right at first is normal: we start from your estimate and after two months there is
          real data from your business to tune it.</p>`
    },
    {
      q: 'Is there a lock-in?',
      r: `<p>No. The fee is monthly and cancellation is requested before the renewal date, with
          no penalty. There is a discount only if <em>you</em> choose to pay quarterly.</p>`
    },
    {
      q: 'How do I pay and what invoice do I get?',
      r: `<p>Credit or debit card, SEPA direct debit or PayPal, always <strong>in euros</strong>:
          no currency conversion fee and no international charge appears on your statement.</p>
          <p>You receive a deductible invoice with Spanish VAT, made out to your company or your
          sole-trader tax ID, issued automatically each month. If you have an intra-EU VAT
          number, the payment gateway applies whatever is due once you enter it.</p>`
    },
    {
      q: 'Can I resell Hachi under my own brand?',
      r: `<p>Yes, that is the <strong>Multi-site / White Label</strong> plan, from €1,690/month.
          Several sites or businesses in one account without mixing, the dashboard and
          communications under your brand, unlimited custom agents and priority support. You
          decide what to charge each of your own clients: the margin is yours.</p>
          <p>The final price depends on the number of sites and the volume, so it is worked out
          case by case on a call.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'The demo and the trial',
  icono: '🎬',
  intro: 'Two different things, and both are free. It is the most common confusion.',
  preguntas: [
    {
      q: 'What is the difference between the demo and the trial?',
      r: `<p>The <strong>demo</strong> is 20 minutes on a video call, watching it with us. The
          <strong>trial</strong> is 7 days using it yourself, with your real customers. First
          one, then the other, and the first payment only if you decide to stay.</p>`
    },
    {
      q: 'Is the demo free? Do you ask for a card?',
      r: `<p>Free and with no commitment, and no payment details are requested. Nor for starting
          the 7-day trial.</p>`
    },
    {
      q: 'How long does the demo last?',
      r: `<p>Twenty minutes. We show you Hachi handling a WhatsApp conversation, checking the
          calendar and closing a real appointment, and sending a reminder. We answer your
          questions and work out which plan fits you.</p>`
    },
    {
      q: 'During the trial, is it a simulation or does it really handle customers?',
      r: `<p>It really does. Beforehand we set your assistant up with your services, your prices,
          your number and your calendar — 3 to 5 working days — and for those 7 days it handles
          your actual customers. You see every conversation, every appointment booked and every
          reminder sent.</p>`
    },
    {
      q: 'Only 7 days of trial? Others give a month',
      r: `<p>Seven days with your business genuinely running is enough to see it clearly. And we
          will be straight about the reason: we do not give you a toy demo, we build the whole
          assistant, and that is days of our team's work <em>before</em> the trial starts. A free
          month would mean doing that work for nothing many times over, and we would end up
          covering it by raising the price for everyone.</p>`
    },
    {
      q: 'If I am not convinced when the trial ends, what do I pay?',
      r: `<p>Nothing. Not the configuration, not the setup fee, not the subscription. Nothing is
          charged until you decide to continue.</p>`
    },
    {
      q: 'How do I book a demo?',
      r: `<p>From the <a href="/#contact">contact form</a> on this site, or by messaging on
          WhatsApp. Outside business hours the assistant itself handles you and books it — which
          is, incidentally, the best demonstration available.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'WhatsApp: the API, your number and the 24-hour window',
  icono: '📱',
  intro: 'The part the industry explains worst, and the one that causes the most grief when it surfaces late.',
  preguntas: [
    {
      q: 'What is the difference between WhatsApp Business and WhatsApp Business API?',
      r: `<p>They are two different products. The <strong>app</strong> — the free one on your
          phone — is built for a business that <em>replies</em>. The <strong>API</strong> is
          Meta's official route for companies that also <em>message first</em> and work at
          volume.</p>
          <ul>
            <li><strong>Where it runs:</strong> the app on a phone; the API on a computer, in a
                web console.</li>
            <li><strong>Who replies:</strong> in the app, one person by hand; on the API, your
                team and the assistant at once.</li>
            <li><strong>Messaging first:</strong> in the app, risk of a block; on the API,
                allowed with an approved template.</li>
            <li><strong>History:</strong> in the app, only on that phone; on the API,
                centralised and searchable.</li>
          </ul>
          <p>The whole thing is laid out in
          <a href="/whatsapp-api-vs-business.html">WhatsApp Business vs API</a>.</p>`
    },
    {
      q: 'Why can my number be blocked for using the normal WhatsApp Business?',
      r: `<p>Because the app is not built for starting conversations. Once you begin sending
          messages to people who did not write to you that day, or many in a row, WhatsApp reads
          it as spam: first it throttles your sending, then it suspends the number temporarily,
          and if it repeats, it blocks it permanently.</p>
          <p>And that number is usually <strong>the one you have had for years</strong>, the one
          on your Google listing, your website and your cards.</p>`
    },
    {
      q: 'Can I keep my existing number?',
      r: `<p>Yes, but it is worth deciding deliberately, because one Meta rule governs everything:
          <strong>a number can be on the WhatsApp Business app OR on the API, never on both at
          once</strong>.</p>
          <p>There are two paths and they are set out in the next two questions.</p>`
    },
    {
      q: 'Path A: a new number. What does it involve?',
      r: `<p>A new SIM for the API. Your existing WhatsApp Business <strong>stays untouched on
          the phone</strong>, with all its chats and contacts. Zero risk, and ready in the same
          time frame as the rest of the setup.</p>
          <p>The catch: it is a different number from the one on your website, your Google
          listing and your cards, so you have to start promoting it or set up a redirect. It is
          what we recommend to almost everyone, especially if your current WhatsApp has years of
          history in it.</p>`
    },
    {
      q: 'Path B: migrating my number. Do I lose the history and contacts?',
      r: `<p>Yes, and this is what almost nobody mentions until it is too late:
          <strong>when a number moves to the API, the chat history and contacts living in the
          phone app stop being accessible</strong>. The API starts clean. That number stops
          working in the app, and with it goes access to those conversations from the new
          console.</p>
          <p>Anyone who tells you "don't worry, we'll just connect your WhatsApp Business" is not
          telling you this. You would find out the day you go looking for a customer conversation
          from eight months ago.</p>`
    },
    {
      q: 'Can the old data be rescued before migrating?',
      r: `<p>Yes, but it has to happen <strong>before</strong> migrating and it is separate work:
          extracting the contact list and conversation history, organising them and loading them
          into the new system.</p>
          <p>That is not automation, it is database work: done case by case depending on how many
          contacts and how much history you have, which is why <strong>it is quoted
          separately</strong> after looking at what is there. We tell you before we start, never
          after.</p>`
    },
    {
      q: 'How do I choose between a new number and migrating?',
      r: `<p>Two questions:</p>
          <ol>
            <li><strong>Is the number you use now published on your website, your Google listing
                and your ads?</strong> If it is not, take a new number and stop thinking about
                it.</li>
            <li><strong>Do you need to keep reading old conversations?</strong> If you never look
                at them, migrate without a rescue. If you consult them often, the rescue is worth
                it.</li>
          </ol>`
    },
    {
      q: 'What is the 24-hour window?',
      r: `<p>Meta allows free messaging to a person for the
          <strong>24 hours after their last message</strong>. After that you cannot send free
          text: only a <strong>template approved by Meta in advance</strong>.</p>
          <p>Day to day: someone messages at 22:00 and Hachi replies with complete freedom for
          the next 24 hours. If they do not write again for three days and you want to follow up,
          they are outside the window, so the message goes out as an approved template; as soon
          as they reply, a fresh window opens and the conversation is unrestricted again.</p>`
    },
    {
      q: 'Do I have to keep track of the 24-hour window?',
      r: `<p>No. The system knows whether the person is inside or outside the window and picks
          between free message and template on its own. We prepare and submit the templates you
          need — reminders, follow-ups, campaigns; Meta usually approves them within 24 to 48
          hours.</p>
          <p>This is, incidentally, why a home-made bot eventually fails: without the official API
          and template handling, the message simply does not go out.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'How appointments get booked',
  icono: '📅',
  intro: 'The part that separates an assistant that converses from one that also executes.',
  preguntas: [
    {
      q: 'Does it really check my calendar before proposing a time?',
      r: `<p>Yes, always. It never offers a time without having looked at your real availability,
          and if there is no slot it proposes alternatives that do exist.</p>
          <p>It is the question that separates the three market tiers: a drawn flow
          <em>cannot</em> check your calendar. It is not doing it badly, it has no way of doing
          it. The mechanism is explained in
          <a href="/why-flow-based-bots-fail.html">why flow-based bots fail</a>.</p>`
    },
    {
      q: 'Can it confirm an appointment that does not actually exist?',
      r: `<p>No. That check is code that runs every time, not an instruction written into a prompt
          that the model might skip on an odd day. It is exactly the difference you are paying for
          against a €29 offer.</p>`
    },
    {
      q: 'If the customer insists three times, do I end up with three appointments?',
      r: `<p>No. The details arrive in pieces — "Thursday"… "at 11"… "I'm Marta"… the phone number
          at the end — and an ordinary automation either starts over on each new message or creates
          a duplicate. Hachi understands it is still the same booking and completes it without
          duplicating.</p>`
    },
    {
      q: 'What happens if a booking fails halfway?',
      r: `<p>It undoes itself. If rescheduling cancels the old appointment and creating the new one
          fails, the system reverts the change rather than leaving it half-done. Your customer does
          not end up without an appointment because of an internal error.</p>`
    },
    {
      q: 'Can it cancel and reschedule without my team stepping in?',
      r: `<p>Yes, both, and the calendar ends up updated. Nobody has to finish the job by hand.</p>`
    },
    {
      q: 'Does it work with several calendars or practitioners?',
      r: `<p>Yes, from the Essential plan: independent calendars per site or per practitioner, each
          with its own hours, services and durations. The assistant knows which one an appointment
          belongs to. Duration, preparation time and deposit are configurable per service.</p>`
    },
    {
      q: 'Does it remember what I already told it?',
      r: `<p>Yes, across days, not just within one message. If you already gave your name it will
          not ask again, and if you said you were interested in a particular service it still has
          that twenty messages later. A menu chatbot makes you repeat everything, which is exactly
          what makes people give up.</p>`
    },
    {
      q: 'Can it book over the phone, not just on WhatsApp?',
      r: `<p>Yes, from the Professional plan. If nobody picks up at the front desk, Hachi does, with
          a natural voice, checks real availability and <strong>closes the appointment during the
          call itself</strong>. Every call is logged with its transcript and summary in the
          dashboard.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'No-shows, follow-up and campaigns',
  icono: '🔔',
  intro: 'What happens before and after the appointment, which is where the money leaks.',
  preguntas: [
    {
      q: 'How does it reduce no-shows?',
      r: `<p>With automatic reminders before each appointment — say a week, 24 hours and 2 hours
          before; you decide how many and when. The customer confirms or cancels by replying to the
          reminder and the calendar updates itself.</p>
          <p>The point is not only that more people turn up: it is that <strong>whoever cancels
          does so in time</strong>, and that slot can be sold again instead of being lost.</p>`
    },
    {
      q: 'How much do no-shows actually drop?',
      r: `<p>The effect attributed to reminders with confirmation sits in the
          <strong>40% to 60%</strong> range. We use 40% — the low end — in every calculation we
          publish, and in the <a href="/calculator.html">calculator</a> that number is on a slider
          so you can drag it down and see what happens. It is an assumption, not a promise.</p>`
    },
    {
      q: 'What is proactive follow-up?',
      r: `<p>If someone asked about a service and disappeared, Hachi writes back a few days later
          with a message tailored to what they asked about. It is not a generic nudge: it picks the
          conversation up where it stopped. Available from the Complete plan.</p>
          <p>It is by a distance the most expensive thing that happens to an appointment-based
          business: they ask the price, think about it, and never come back.</p>`
    },
    {
      q: 'Will Hachi message people who have never written to me?',
      r: `<p><strong>No, and it is not a sales promise: it is how the thing is built.</strong> The
          assistant only replies to people who wrote first, and follow-up acts solely on
          conversations that person opened themselves. If someone has never messaged you, Hachi has
          no way to contact them.</p>
          <p>The first message always comes from your customer. Hachi resumes conversations, it does
          not start them. The one exception is the campaigns you launch to your own list.</p>`
    },
    {
      q: 'What are WhatsApp campaigns?',
      r: `<p>Sends to your customer base using official Meta-approved templates — not irregular bulk
          messaging — segmentable by customer type, service or last visit. Available from the
          Complete plan.</p>
          <p>And the important part: <strong>whoever replies goes straight into a conversation with
          the assistant</strong>, which answers their questions and books them. Sending the promotion
          is easy; the hard part is handling the fifty who reply at once.</p>`
    },
    {
      q: 'Does it classify conversations?',
      r: `<p>Yes, on its own: interested in a particular service, appointment booked, awaiting reply,
          former customer. Your team can open it and see at a glance what needs attention, and those
          same labels are used to segment campaigns.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'Comparing quotes: why some cost €99 and others €900',
  icono: '⚖️',
  intro: 'We lay it out in full even where it argues against us, because it is the only way for you to compare properly.',
  preguntas: [
    {
      q: 'Why is there such a price gap between one offer and another?',
      r: `<p>Because under the same description — "an AI assistant that answers your WhatsApp and
          books appointments" — sit <strong>three different technologies</strong>:</p>
          <ul>
            <li><strong>Tier 1 · Drawn flows (€29-199/month).</strong> A hand-made diagram. It does
                not understand, it matches patterns. Its limit is not quality, it is capability:
                <em>it cannot check your calendar</em>.</li>
            <li><strong>Tier 2 · Assistants that converse (€150-500/month).</strong> Real AI: it
                understands, informs, qualifies. What it lacks is <em>execution</em>: it ends with
                "a colleague will confirm your appointment".</li>
            <li><strong>Tier 3 · Systems that converse AND execute (€460-1,840/month).</strong> They
                check real availability, book, cancel, reschedule and answer for the result.
                <strong>Hachi is here.</strong></li>
          </ul>
          <p>The full breakdown is in
          <a href="/how-much-does-an-ai-assistant-cost.html">what an AI assistant costs</a>.</p>`
    },
    {
      q: 'What four questions should I ask any quote?',
      r: `<p>Ours included. If the person selling cannot answer them concretely, you are looking at
          tier 1 or 2:</p>
          <ol>
            <li>Does it check real availability before proposing a time, or does it only look like
                it does?</li>
            <li>If a booking fails halfway, does it stay half-done or undo itself?</li>
            <li>Can it book the same appointment twice if the customer insists?</li>
            <li>When it does not know something, does it say so or make it up?</li>
          </ol>`
    },
    {
      q: 'If Hachi is tier 3, why does it cost less than its tier?',
      r: `<p>Because we would rather grow with customers who stay. Every plan sits below its tier's
          range: the most complete is €990/month when the tier-3 market reaches €1,840, and the
          highest setup fee is €1,690 when that range starts at €2,000.</p>
          <p>What we will not do is compete with tier 1 on price.</p>`
    },
    {
      q: 'When is tier 1 the right choice?',
      r: `<p>If all you need is to answer four common questions and you book nothing, a drawn flow is
          plenty and it is the sensible call. We would say so either way — it is a cheaper tool that
          does a different job well.</p>`
    },
    {
      q: 'What about automation tools like Zapier, Make or n8n?',
      r: `<p>Those tools chain fixed steps: if A happens, do B. They are excellent for mechanical
          tasks. A conversation with a customer is not one: there are questions, changes of mind,
          objections and missing details that arrive in pieces.</p>`
    },
    {
      q: 'Can it invent a price or a service I do not offer?',
      r: `<p>An unconstrained model fills in what it does not know, because that is what it was
          trained to do: it sounds convincing and it is false. In Hachi the answer is checked against
          <strong>your real information</strong> before it is sent, and if the fact is missing, it
          says so and offers to hand the conversation to a person.</p>
          <p>This is not a theoretical worry: companies have been ordered to compensate customers for
          what their chatbot promised.</p>`
    },
    {
      q: 'I already tried a chatbot and it was a disaster. Why would this be different?',
      r: `<p>It is the most common thing we hear, and fairly: menu chatbots frustrate people. Which is
          why the trial is 7 days with your real services and prices, before deciding anything. If it
          does not convince you, you do not continue and you do not pay.</p>`
    },
    {
      q: 'It is expensive for my business',
      r: `<p>Against hiring someone to handle WhatsApp mornings, afternoons, nights and weekends, it is
          a fraction: a receptionist in Spain costs <strong>€25,000 to €35,000 a year</strong> fully
          loaded, and takes days off.</p>
          <p>And if the numbers genuinely do not work, we say so. Run them yourself in the
          <a href="/calculator.html">calculator</a>: it is built to tell you it does not pay for
          itself yet, and if that is the answer, it says so.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'Data protection and GDPR',
  icono: '🔒',
  intro: 'You handle personal data and, in healthcare, special-category data. This is not a checkbox.',
  preguntas: [
    {
      q: 'Who is the controller and who is the processor?',
      r: `<p><strong>You are the controller</strong>: they are your customers and your data, and you
          decide what they are used for. <strong>Hachi is the processor</strong>: we handle that data
          on your behalf, only to provide the service, following your instructions.</p>`
    },
    {
      q: 'Do you sign a data processing agreement?',
      r: `<p>Yes, the one required by <strong>Article 28 of the GDPR</strong>, before we start. It
          details what data is processed, with which providers, where it is hosted and how long it is
          kept. If your legal advisers need to review it or add conditions, send it over and we look at
          it before signing. That is routine.</p>`
    },
    {
      q: 'Can Hachi send messages without consent?',
      r: `<p>No. The assistant only replies to people who wrote first. The sole exception is campaigns
          you launch, and there the rules are: <strong>you supply the list</strong> (Hachi does not buy,
          scrape or infer numbers), <strong>the consent is yours</strong> as controller of that data, and
          <strong>Meta also polices it</strong> by requiring an approved template. If Meta rejects it, it
          does not go out.</p>
          <p>Our recommendation: only send campaigns to people who gave you their number so you could
          write to them, and keep a record of when and how.</p>`
    },
    {
      q: 'I handle health data. Does that change anything?',
      r: `<p>It is <strong>special category</strong> data (Art. 9 GDPR) and deserves more care, not less.
          Which is why Hachi works with the conversation — what the customer writes to request an
          appointment — and <strong>does not need your clinical records</strong>: there is nothing to
          upload. The less data that goes in, the better, and what is stored and for how long can be
          restricted.</p>`
    },
    {
      q: 'What happens if one of my customers exercises their rights?',
      r: `<p>Access, rectification, erasure, objection and portability: you pass it to us and we handle it
          within the legal deadline, including <strong>complete deletion</strong> of their data and
          conversations.</p>`
    },
    {
      q: 'Where is the data stored and for how long?',
      r: `<p>Server location, the specific list of providers involved, exact retention periods and
          international transfers are all detailed in the data processing agreement, handed over and
          signed before we start. If you need to see it before deciding, ask for it at the demo.</p>`
    },
    {
      q: 'Do I lose control of what the assistant says?',
      r: `<p>The opposite. From the dashboard you edit how it replies, what prices it quotes, what services
          it offers and <strong>what it must never say</strong>. Your team sees every conversation in real
          time and can step in at any moment.</p>`
    },
    {
      q: 'What if a customer notices it is an assistant and is put off?',
      r: `<p>It speaks naturally and in your brand's tone. And the moment a conversation turns delicate — an
          emergency, a serious complaint, someone asking for a human — it alerts your team and hands over
          with the full context. Nobody gets trapped talking to a machine.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'Implementation, requirements and support',
  icono: '🛠️',
  intro: 'What you need to have, how long it takes and what happens afterwards.',
  preguntas: [
    {
      q: 'How long until it is up and running?',
      r: `<p><strong>Three to five working days</strong> from when you send your list of services and
          prices. The 7-day trial starts as soon as it is built.</p>`
    },
    {
      q: 'What do you need from me?',
      r: `<ol>
            <li><strong>A decision about the number</strong>: new SIM or migrating your existing one. If you
                do not have WhatsApp Business API yet, we arrange it.</li>
            <li><strong>Your list of services and prices</strong>, exactly as you give it to a customer. A
                PDF, a spreadsheet or even screenshots: we structure it.</li>
            <li><strong>Your opening hours</strong> and how many appointments fit per slot.</li>
            <li><strong>Your business details</strong>: exact address, what you do offer and what you
                don't.</li>
          </ol>`
    },
    {
      q: 'Do I have to install anything or change my practice-management software?',
      r: `<p>Nothing to install — the API runs in a browser — no need to change management software, no need
          for anyone to watch a phone, and no need for anyone on your team to be technical.</p>
          <p>Hachi can work with its own calendar or sync with the one you already use; we look at that in the
          demo, depending on your software.</p>`
    },
    {
      q: 'Is maintenance charged separately?',
      r: `<p>No, it is included in the fee. Price changes as often as needed, adding or removing services and
          durations, changes to hours, calendars, practitioners and holidays, adjustments to how the agents
          behave, changes to reminders, and <strong>every platform improvement</strong>. There is no surprise
          invoice each time you change something.</p>`
    },
    {
      q: 'Can I change things myself?',
      r: `<p>Yes: prices, wording, hours and each agent's behaviour are all in the dashboard, and there is a
          <strong>simulator</strong> for testing any change in a practice conversation before a real customer
          sees it. If you would rather we did it, message us and routine changes are done within 24-48 working
          hours.</p>`
    },
    {
      q: 'What is quoted separately?',
      r: `<p>Only two things: custom integrations with management software that is not already supported, and
          bespoke development that is not part of the product. In both cases you get a fixed quote before
          anything is built. Plus rescuing contacts and history if you choose to migrate your number.</p>`
    },
    {
      q: 'What happens if something breaks?',
      r: `<p>We monitor the service automatically and find out before you do. A serious incident — the assistant
          not responding, the WhatsApp connection dropping — is handled immediately during working hours.
          Multi-site plans have priority support.</p>`
    },
    {
      q: 'How do I check it is working?',
      r: `<p>The dashboard shows every appointment Hachi booked, every reminder sent and every conversation
          recovered, plus the service status. Nothing has to be taken on faith: the numbers are there.</p>`
    },
    {
      q: 'What are your opening hours?',
      r: `<p>Sales hours are <strong>Monday to Friday, 09:00 to 19:00</strong> (mainland Spain time) and
          <strong>Saturdays 10:00 to 14:00</strong>. Outside those hours the assistant itself handles you and
          books the demo.</p>`
    }
  ]
}

];
