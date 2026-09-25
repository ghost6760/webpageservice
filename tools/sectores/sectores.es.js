/**
 * Páginas de sector en español (mercado España + Latinoamérica).
 *
 * Cada sector se escribe a mano. Lo que NO puede pasar: copiar un sector,
 * cambiar el nombre y dejarlo. Eso es una «doorway page» y verificar.js lo
 * detecta midiendo cuánto texto comparten dos sectores.
 *
 * Reglas de contenido (las mismas del RAG y de la landing):
 *   · Solo capacidades que existen. Lo que no hace, se dice.
 *   · Nada de SMS en español: el SMS es del mercado de EE. UU.
 *   · Precios: nunca aquí. Salen de mercados.js en la plantilla.
 *   · «Garantías»: solo las que impone el código (landing, sección guardrails).
 *     «No da una cita por hecha sin reservarla» NO: el hueco HAG7 sigue abierto.
 *   · En `faq[].r` solo <p> <ul> <ol> <li> <strong> <em> <a> <br>.
 */
module.exports = [

// ─────────────────────────────────────────────────────────────────
{
  id: 'estetica',
  slug: 'medicina-estetica',
  nombre: 'Medicina estética',
  nombreSchema: 'clínicas de medicina estética',
  enFrase: 'una clínica estética',
  resumen: 'Valoraciones, anuncios de Meta y pacientes que preguntan el precio y desaparecen',
  titulo: 'Recepcionista con IA para clínicas de medicina estética | Hachi',
  descripcion: 'Contesta a quien pregunta por bótox o rellenos a las once de la noche, agenda la valoración en tu agenda real y retoma a quien preguntó el precio y no volvió.',
  h1: 'Recepcionista con IA para <em>clínicas de medicina estética</em>',
  entradilla: 'En estética el paciente compara. Escribe a tres clínicas a la vez, casi siempre ' +
    'por la noche, y reserva con la que contesta primero y le da confianza. Hachi contesta en ' +
    'segundos, resuelve las dudas con tu información y deja la valoración puesta.',
  dolores: [
    { t: 'El anuncio funciona, el WhatsApp no da abasto',
      p: 'Pagas por cada contacto de Meta y la mitad llega un viernes a las diez de la noche. ' +
        'Cuando el lunes alguien contesta, esa persona ya ha reservado en otro sitio. El dinero ' +
        'del anuncio se fue igual.' },
    { t: '«¿Cuánto cuesta?» y silencio',
      p: 'Es la conversación más repetida de una clínica estética: preguntan el precio del ácido ' +
        'hialurónico, lo reciben y desaparecen. No es que no quieran; es que nadie les volvió a ' +
        'escribir.' },
    { t: 'La recepción se come la agenda médica',
      p: 'Entre explicar qué es un peeling, cuántas sesiones hacen falta y si duele, la persona de ' +
        'recepción pasa el día en el móvil. Y la que se lleva el disgusto es la paciente que ya ' +
        'estaba en la sala.' }
  ],
  escena: {
    persona: 'Marina', canal: 'WhatsApp · 23:12',
    alt: 'Conversación de ejemplo: una paciente pregunta por rellenos de labios y Hachi agenda la valoración.',
    msgs: [
      ['in', 'Hola! Cuánto cuesta el relleno de labios? Me da un poco de miedo que quede exagerado'],
      ['out', 'Hola, Marina. El relleno de labios con ácido hialurónico son 280 €, y siempre empieza por una valoración gratuita con la doctora para decidir cuánto poner. Se busca un resultado natural, y se puede retocar después. ¿Te agendo la valoración? Tengo el martes a las 17:30 o el jueves a las 11:00.'],
      ['in', 'El martes me va bien'],
      ['out', 'Hecho: valoración el martes a las 17:30 con la Dra. Ruiz. Te mando un recordatorio el día antes. Si te surge algo, escríbeme y la movemos.']
    ],
    nota: 'El precio sale de tu tarifa, no de la imaginación del modelo: si una cifra no está en ' +
      'tus documentos, se retira antes de enviarse. Y la hora se comprueba en la agenda real ' +
      'antes de ofrecerla.'
  },
  hace: [
    'Contesta en segundos a los contactos de <strong>anuncios de Meta (Lead Ads)</strong> y les escribe por WhatsApp antes de que se enfríen.',
    'Explica tratamientos, sesiones, cuidados y contraindicaciones <strong>con tus textos</strong>: subes tus PDF y los usa.',
    'Agenda la valoración o el tratamiento en tu agenda, con la duración de cada servicio y el profesional que toca.',
    'Recordatorio antes de la cita con confirmación: quien no puede venir avisa con tiempo y el hueco se recoloca.',
    '<strong>Seguimiento proactivo</strong> a quien preguntó el precio y no reservó, retomando su conversación, no con un mensaje genérico.',
    'Campañas de WhatsApp a tu base de pacientes (retoques, temporada de láser), y las respuestas las atiende el propio asistente.'
  ],
  garantias: [
    { t: 'No se inventa un precio.', p: 'Un importe que no está en tu tarifa ni lo dijo la paciente se retira antes de enviarse. En estética, un precio mal dado es una discusión en recepción.' },
    { t: 'No confirma una hora ocupada.', p: 'Consulta la agenda de la doctora antes de ofrecer una hora. Si no hay hueco, propone otro.' },
    { t: 'No duplica la cita.', p: 'Aunque la paciente insista o mande los datos en tres mensajes, la valoración se crea una vez.' }
  ],
  roi: { ticket: 180, margen: 65 },
  plan: { id: 'completa',
    por: '<p>La clínica estética vive de los anuncios y de recuperar a quien se enfría, y eso ' +
      '—Lead Ads, seguimiento proactivo y campañas— está en <strong>Clínica Completa</strong>. ' +
      'Incluye además la voz para las llamadas.</p>',
    alternativa: 'Si todavía no inviertes en anuncios, el plan Esencial cubre WhatsApp, varias agendas y tu base de conocimiento.' },
  faq: [
    { q: '¿Puede explicar un tratamiento sin dar consejo médico?',
      r: '<p>Sí, y es como se configura: explica lo que tú has escrito sobre cada tratamiento —en qué consiste, sesiones, cuidados— y, para decidir si a esa persona le conviene, agenda la valoración con el profesional. No diagnostica ni recomienda dosis.</p>' },
    { q: '¿Qué pasa con las fotos que mandan las pacientes?',
      r: '<p>Las entiende: si alguien manda una foto de la zona, el asistente la interpreta y responde en consecuencia, normalmente proponiendo la valoración. La decisión clínica sigue siendo del profesional.</p>' },
    { q: '¿Sirve para los contactos de mis anuncios de Instagram y Facebook?',
      r: '<p>Sí. Con el plan Clínica Completa, cuando alguien deja sus datos en tu formulario de Meta, Hachi le escribe por WhatsApp en segundos y guarda el texto de consentimiento que aceptó.</p>' },
    { q: '¿Y si la paciente quiere hablar con una persona?',
      r: '<p>La conversación pasa a tu equipo con todo el contexto. Nadie se queda atrapado hablando con una máquina.</p>' }
  ],
  vecinos: ['capilar', 'unas', 'spa']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'dental',
  slug: 'clinicas-dentales',
  nombre: 'Clínicas dentales',
  nombreSchema: 'clínicas dentales',
  enFrase: 'una clínica dental',
  resumen: 'Urgencias con dolor, primeras visitas y revisiones que nadie recuerda',
  titulo: 'Recepcionista con IA para clínicas dentales | Hachi',
  descripcion: 'Atiende el WhatsApp y el teléfono de tu clínica dental, agenda primeras visitas y revisiones en tu agenda real y pasa a tu equipo las urgencias con dolor.',
  h1: 'Recepcionista con IA para <em>clínicas dentales</em>',
  entradilla: 'En una clínica dental el teléfono suena justo cuando todo el equipo está con ' +
    'las manos ocupadas en boca. Hachi coge esa llamada y ese WhatsApp, agenda la primera ' +
    'visita o la revisión, y cuando alguien escribe con dolor, se lo pasa a una persona.',
  dolores: [
    { t: 'La llamada que nadie coge es un paciente nuevo',
      p: 'Quien busca dentista llama a varios. El que no contesta pierde una primera visita que ' +
        'podía acabar en un tratamiento de ortodoncia o de implantes.' },
    { t: 'Las revisiones que se olvidan',
      p: 'La limpieza de cada seis meses depende de que alguien se acuerde de llamar. Cuando no ' +
        'se hace, el hueco no se llena y el paciente vuelve cuando ya le duele.' },
    { t: 'Las ausencias en sillón',
      p: 'Un sillón vacío una hora es la hora del higienista pagada sin producir. Casi siempre ' +
        'se podía haber evitado con un recordatorio y un «¿sigues viniendo?».' }
  ],
  escena: {
    persona: 'Javier', canal: 'WhatsApp · 08:04',
    alt: 'Conversación de ejemplo: un paciente con dolor de muela escribe y Hachi lo pasa al equipo.',
    msgs: [
      ['in', 'Buenos días, me duele muchísimo una muela desde anoche y se me ha hinchado la cara'],
      ['out', 'Siento que estés así, Javier. Esto lo tiene que ver alguien del equipo cuanto antes: acabo de pasar tu mensaje a la clínica como urgente y te contactan ahora mismo.'],
      ['in', 'Vale gracias'],
      ['out', 'Mientras tanto, ¿me dices tu nombre completo? Así ya está en la ficha cuando te llamen.']
    ],
    nota: 'Una urgencia no se queda en un bucle con la máquina: se escala a una persona, y si ' +
      'algo falla por dentro, se escala igual. Para una revisión normal, en cambio, agenda él ' +
      'solo comprobando la agenda.'
  },
  hace: [
    'Atiende WhatsApp y, con voz, <strong>el teléfono de la clínica</strong>: agenda durante la propia llamada.',
    'Distingue una revisión, una limpieza o una primera visita, cada una con su duración y su sillón o profesional.',
    'Reconoce una urgencia por lo que significa —dolor, inflamación, un golpe—, no por palabras sueltas, y la pasa a tu equipo.',
    'Recordatorios con confirmación para bajar las ausencias, y lista de espera para rellenar el hueco que se libera.',
    'Responde lo repetitivo con tu información: horarios, financiación, si aceptáis una aseguradora, cómo llegar.'
  ],
  garantias: [
    { t: 'No pierde una urgencia.', p: 'Ante un dolor fuerte o una petición de hablar con alguien, escala a una persona, también si algo falla por dentro.' },
    { t: 'No confirma una hora ocupada.', p: 'Comprueba la agenda de cada gabinete antes de proponer. Si no hay hueco, no hay cita.' },
    { t: 'No reserva en el pasado ni en otra zona horaria.', p: 'Las fechas («el lunes 21», «pasado mañana») las calcula el código en la hora de tu clínica.' }
  ],
  roi: { ticket: 120, margen: 60 },
  plan: { id: 'profesional',
    por: '<p>En una dental el teléfono pesa tanto como el WhatsApp, y la voz empieza en ' +
      '<strong>Profesional</strong>: 400 minutos de llamada al mes y varias agendas para ' +
      'gabinetes o doctores.</p>',
    alternativa: 'Si solo quieres empezar por WhatsApp, Esencial cubre varias agendas; la voz se le puede añadir como módulo.' },
  faq: [
    { q: '¿Puede dar precios de tratamientos como implantes u ortodoncia?',
      r: '<p>Los que tú le des. Si un tratamiento necesita presupuesto tras la exploración, lo dirá así y agendará la primera visita. Una cifra que no esté en tu información no sale.</p>' },
    { q: '¿Qué hace con una urgencia fuera de horario?',
      r: '<p>La marca como urgente y la pasa a tu equipo al momento. Qué pasa después —un teléfono de guardia, una cita a primera hora— lo decides tú y se configura así.</p>' },
    { q: '¿Trabaja con mi programa de gestión dental?',
      r: '<p>Hachi tiene su propia agenda con copia en Google Calendar, y puede enviar cada cita a otro sistema por webhook. La integración con un programa concreto se valora en la demostración.</p>' },
    { q: '¿Cómo trata los datos de salud de mis pacientes?',
      r: '<p>Como categoría especial del RGPD (artículo 9). Tú eres el responsable y Hachi el encargado, con el contrato del artículo 28 firmado antes de tocar un dato.</p>' }
  ],
  vecinos: ['estetica', 'fisioterapia', 'veterinaria']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'veterinaria',
  slug: 'veterinarias',
  nombre: 'Clínicas veterinarias',
  nombreSchema: 'clínicas veterinarias',
  enFrase: 'una veterinaria',
  resumen: 'Vacunas, urgencias con la mascota y teléfonos que no paran',
  titulo: 'Recepcionista con IA para clínicas veterinarias | Hachi',
  descripcion: 'Agenda vacunas, revisiones y peluquería canina en tu agenda real, recuerda la próxima dosis y pasa al veterinario las urgencias. WhatsApp y teléfono, 24/7.',
  h1: 'Recepcionista con IA para <em>clínicas veterinarias</em>',
  entradilla: 'Una veterinaria recibe dos clases de mensaje: el rutinario —«¿tenéis hueco ' +
    'para la vacuna?»— y el que no puede esperar —«mi perro se ha comido algo»—. Hachi agenda ' +
    'el primero solo y pasa el segundo a una persona al momento.',
  dolores: [
    { t: 'El teléfono suena durante la consulta',
      p: 'El veterinario está con un gato en la mesa y la recepción cobrando. La llamada de la ' +
        'vacuna se pierde, y esa familia pide hora en la clínica de al lado.' },
    { t: 'Las vacunas que caducan sin avisar',
      p: 'La rabia, la polivalente, la desparasitación: son citas que se repiten solas si ' +
        'alguien avisa. Si no, la mascota llega tarde o no llega.' },
    { t: 'La urgencia mezclada con lo rutinario',
      p: 'Entre veinte mensajes de «¿a qué hora abrís?», uno dice que el perro no respira bien. ' +
        'Ese no puede quedarse esperando a que alguien mire el móvil.' }
  ],
  escena: {
    persona: 'Lucía', canal: 'WhatsApp · 19:40',
    alt: 'Conversación de ejemplo: una clienta pide cita para la vacuna de su perra y Hachi la agenda.',
    msgs: [
      ['in', 'Hola, a Kira le toca la vacuna de la rabia, tenéis algo esta semana?'],
      ['out', 'Hola, Lucía. Para la vacuna de Kira tengo el jueves a las 10:30 o el viernes a las 18:00. ¿Cuál te viene mejor?'],
      ['in', 'Viernes'],
      ['out', 'Listo: Kira, vacuna de la rabia, el viernes a las 18:00. Trae su cartilla, por favor. Te escribo el jueves para recordártelo.']
    ],
    nota: 'Si Lucía hubiera escrito «Kira ha vomitado sangre», la conversación habría ido a una ' +
      'persona del equipo en ese momento, sin pasar por la agenda.'
  },
  hace: [
    'Pide el <strong>nombre y la especie de la mascota</strong> antes de agendar, porque se configura con los datos que tu clínica necesita.',
    'Agenda consulta, vacuna, cirugía programada o peluquería canina, cada una con su duración y su profesional.',
    'Recordatorio antes de cada cita, y la siguiente dosis se puede agendar al salir de la anterior.',
    'Reconoce una urgencia (ingestión, heridas, dificultad para respirar) y la pasa a una persona al instante.',
    'Atiende el teléfono con voz cuando el equipo no puede, y también las llamadas de WhatsApp.'
  ],
  garantias: [
    { t: 'No pierde una urgencia.', p: 'Un mensaje que describe una urgencia se escala a una persona, también si algo falla por dentro. Aquí es lo primero.' },
    { t: 'No duplica la cita.', p: 'Aunque la familia insista o mande los datos en varios mensajes, la vacuna se agenda una vez.' },
    { t: 'No confirma una hora ocupada.', p: 'Comprueba la agenda del veterinario antes de ofrecer una hora.' }
  ],
  roi: { ticket: 60, margen: 60 },
  plan: { id: 'profesional',
    por: '<p>Una veterinaria vive del teléfono, y la voz empieza en <strong>Profesional</strong>: ' +
      '400 minutos al mes, varias agendas para veterinarios y peluquería, y llamadas de WhatsApp.</p>',
    alternativa: 'Una clínica pequeña puede empezar con Esencial y añadir la voz como módulo.' },
  faq: [
    { q: '¿Puede dar consejo veterinario?',
      r: '<p>No, y está configurado para no hacerlo. Informa con lo que tú le das (horarios, precios, preparación antes de una cirugía) y, ante cualquier síntoma, agenda consulta o pasa la conversación a una persona.</p>' },
    { q: '¿Recuerda la próxima vacuna?',
      r: '<p>Envía recordatorios de cada cita agendada. Si al terminar una vacuna se agenda la siguiente, el recordatorio llega solo cuando toque.</p>' },
    { q: '¿Sirve también para la peluquería canina?',
      r: '<p>Sí. Es una agenda más, con sus servicios y duraciones —baño, corte, deslanado— y su profesional.</p>' },
    { q: '¿Qué pasa si escriben de noche con una urgencia?',
      r: '<p>La conversación se marca como urgente y pasa a tu equipo. Si tienes un teléfono de guardia o una clínica de urgencias de referencia, se configura para indicarlo.</p>' }
  ],
  vecinos: ['dental', 'peluqueria', 'hogar']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'fisioterapia',
  slug: 'fisioterapia',
  nombre: 'Fisioterapia',
  nombreSchema: 'centros de fisioterapia',
  enFrase: 'un centro de fisioterapia',
  resumen: 'Bonos de sesiones, varios fisios y pacientes que llaman durante el tratamiento',
  titulo: 'Recepcionista con IA para centros de fisioterapia | Hachi',
  descripcion: 'Agenda sesiones con el fisio que toca, gestiona cambios de hora sin interrumpir el tratamiento y recuerda cada cita. WhatsApp y teléfono atendidos a cualquier hora.',
  h1: 'Recepcionista con IA para <em>centros de fisioterapia</em>',
  entradilla: 'Un fisioterapeuta tiene las dos manos ocupadas durante cincuenta minutos. En ' +
    'ese tiempo le escriben tres pacientes para mover la sesión y uno nuevo con lumbalgia. ' +
    'Hachi contesta a los cuatro sin sacarle de la camilla.',
  dolores: [
    { t: 'Soltar al paciente para coger el móvil',
      p: 'Cada interrupción rompe la sesión. No cogerlo significa un paciente nuevo que busca ' +
        'otro centro esa misma tarde.' },
    { t: 'El baile de cambios de hora',
      p: 'Los tratamientos son de varias sesiones y la vida se cruza. Mover una cita a mano, ' +
        'comprobar el hueco del compañero y confirmar son diez minutos que no se cobran.' },
    { t: 'Los huecos que se quedan vacíos',
      p: 'Una cancelación a última hora es una sesión perdida si nadie la ofrece a quien estaba ' +
        'esperando hueco.' }
  ],
  escena: {
    persona: 'Andrés', canal: 'WhatsApp · 13:21',
    alt: 'Conversación de ejemplo: un paciente mueve su sesión de fisioterapia y Hachi la reprograma.',
    msgs: [
      ['in', 'Hola, tengo sesión con Nuria el jueves a las 17 pero me han puesto una reunión, puedo cambiarla?'],
      ['out', 'Claro, Andrés. Con Nuria tengo el jueves a las 19:00 o el viernes a las 9:30. ¿Te encaja alguna?'],
      ['in', 'El viernes a las 9:30'],
      ['out', 'Cambiado: tu sesión con Nuria pasa al viernes a las 9:30 y el jueves queda libre. Te lo recuerdo el día antes.']
    ],
    nota: 'Mover una cita son dos pasos: liberar la vieja y crear la nueva. Si el segundo falla, ' +
      'el primero se deshace; Andrés nunca se queda sin ninguna de las dos.'
  },
  hace: [
    'Agenda con <strong>el fisio que lleva a ese paciente</strong>: cada profesional con su agenda y sus horarios.',
    'Reprograma y cancela sin intervención, y el hueco liberado se ofrece a la lista de espera.',
    'Explica tus tratamientos, bonos y precios con tu información.',
    'Recordatorios con confirmación antes de cada sesión.',
    'Entiende notas de voz, que es como escribe media consulta.'
  ],
  garantias: [
    { t: 'No deja un cambio a medias.', p: 'Si al mover una sesión falla un paso, se deshace lo hecho: nunca queda la vieja cancelada y la nueva sin crear.' },
    { t: 'No confirma una hora ocupada.', p: 'Comprueba la agenda de ese fisio antes de proponer.' },
    { t: 'No duplica la sesión.', p: 'Aunque el paciente mande la hora en un mensaje y el día en otro.' }
  ],
  roi: { ticket: 45, margen: 70 },
  plan: { id: 'esencial',
    por: '<p>Con varios fisios hace falta una agenda por profesional, y eso empieza en ' +
      '<strong>Esencial</strong>, con 750 conversaciones al mes y el panel con métricas.</p>',
    alternativa: 'Si trabajas solo, el plan Autónomo cubre una agenda y un número.' },
  faq: [
    { q: '¿Sabe con qué fisio va cada paciente?',
      r: '<p>Agenda con el profesional que el paciente pide o que tú configures para ese servicio. Si alguien dice «con Nuria», busca hueco en la agenda de Nuria.</p>' },
    { q: '¿Puede vender bonos de sesiones?',
      r: '<p>Informa de tus bonos y sus precios, y agenda las sesiones. El cobro no lo hace: sigue siendo cosa de tu centro.</p>' },
    { q: '¿Qué pasa si alguien pregunta si su lesión es grave?',
      r: '<p>No diagnostica. Propone una primera valoración con el fisio, y si el mensaje suena a urgencia, lo pasa a una persona.</p>' },
    { q: '¿Y las mutuas o aseguradoras?',
      r: '<p>Responde lo que tú le indiques sobre qué aseguradoras aceptáis y qué hace falta traer. La autorización con la aseguradora sigue siendo trabajo de tu centro.</p>' }
  ],
  vecinos: ['psicologia', 'dental', 'spa']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'psicologia',
  slug: 'psicologos',
  nombre: 'Psicología',
  nombreSchema: 'consultas de psicología',
  enFrase: 'una consulta de psicología',
  resumen: 'Primeras consultas, discreción y mensajes que no puede atender una máquina',
  titulo: 'Recepcionista con IA para psicólogos y consultas de terapia | Hachi',
  descripcion: 'Agenda primeras consultas y sesiones mientras estás en terapia, con discreción y datos de salud protegidos. Lo delicado pasa a ti al momento.',
  h1: 'Recepcionista con IA para <em>psicólogos</em>',
  entradilla: 'Un psicólogo no puede mirar el móvil durante una sesión, y quien escribe ' +
    'pidiendo ayuda por primera vez no debería esperar dos días. Hachi agenda la primera ' +
    'consulta con discreción y deja para ti todo lo que no es logística.',
  dolores: [
    { t: 'El primer mensaje es el más difícil de escribir',
      p: 'A alguien le ha costado semanas decidirse. Si no recibe respuesta, es fácil que no ' +
        'vuelva a intentarlo.' },
    { t: 'Trabajas solo y en sesión',
      p: 'Una consulta de psicología suele ser una persona. Mientras atiendes, nadie contesta, y ' +
        'al terminar tienes diez minutos antes de la siguiente.' },
    { t: 'Las cancelaciones de última hora',
      p: 'Una sesión perdida es una hora que no se recupera. Un recordatorio con confirmación ' +
        'deja tiempo para ofrecerla a otra persona.' }
  ],
  escena: {
    persona: 'Paula', canal: 'WhatsApp · 21:55',
    alt: 'Conversación de ejemplo: una persona pide una primera consulta de psicología y Hachi la agenda.',
    msgs: [
      ['in', 'Hola, quería pedir una primera cita. Llevo un tiempo con mucha ansiedad'],
      ['out', 'Hola, Paula. Gracias por escribir; dar este paso cuesta. La primera consulta dura 50 minutos y puede ser presencial u online. Tengo el lunes a las 18:00 o el miércoles a las 10:00. ¿Cuál prefieres?'],
      ['in', 'El lunes, online'],
      ['out', 'Reservado: primera consulta online el lunes a las 18:00. Te llegará el enlace y un recordatorio el día antes.']
    ],
    nota: 'El asistente no hace terapia ni da consejo clínico. Si un mensaje suena a crisis, se ' +
      'configura para pasarlo a ti al momento en vez de intentar atenderlo.'
  },
  hace: [
    'Agenda <strong>primeras consultas y sesiones</strong>, presenciales u online, en tu agenda real.',
    'Explica cómo trabajas, duración, precio y política de cancelación con tus textos.',
    'Recordatorio antes de cada sesión, con opción de confirmar o cambiar.',
    'Cualquier mensaje delicado pasa a ti con el contexto; el asistente no entra en lo clínico.',
    'Dice que es un asistente de IA si se lo preguntan. Nunca se presenta como una persona.'
  ],
  garantias: [
    { t: 'No dice que es una persona.', p: 'Si le preguntan, contesta que es un asistente de IA, como exige el artículo 50 del Reglamento europeo de IA. En una consulta de psicología, esa honestidad no es negociable.' },
    { t: 'No pierde un mensaje delicado.', p: 'Lo que suena a urgencia o a petición de hablar contigo se escala, también si algo falla por dentro.' },
    { t: 'No mezcla datos entre consultas.', p: 'Cada consulta está aislada de las demás; lo que escribe una persona no puede aparecer en otra cuenta.' }
  ],
  roi: { ticket: 60, margen: 85 },
  plan: { id: 'autonomo',
    por: '<p>La mayoría de consultas son una persona con una agenda, que es justo el plan ' +
      '<strong>Autónomo</strong>: WhatsApp 24/7, agenda real y recordatorios.</p>',
    alternativa: 'Un centro con varios psicólogos necesita una agenda por profesional: plan Esencial.' },
  faq: [
    { q: '¿Qué pasa si alguien escribe en crisis?',
      r: '<p>El asistente no intenta atenderlo: se configura para pasarte el mensaje al momento y, si lo decides, indicar el teléfono de emergencias o de ayuda que corresponda. Lo que diga ese mensaje lo decides tú de antemano.</p>' },
    { q: '¿Cómo se protegen los datos de mis pacientes?',
      r: '<p>Se tratan como datos de salud, categoría especial del RGPD. Tú eres el responsable; Hachi, el encargado, con contrato del artículo 28 firmado antes de empezar. Y puedes pedir la supresión de los datos de una persona concreta.</p>' },
    { q: '¿Puede agendar sesiones online?',
      r: '<p>Sí: es un servicio más, con su duración. El enlace de la videollamada lo configuras tú.</p>' },
    { q: '¿Se nota que es un asistente?',
      r: '<p>Escribe con naturalidad y con tu tono, pero no oculta que es un asistente: si se lo preguntan, lo dice.</p>' }
  ],
  vecinos: ['fisioterapia', 'estetica', 'spa']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'peluqueria',
  slug: 'peluquerias-y-barberias',
  nombre: 'Peluquerías y barberías',
  nombreSchema: 'peluquerías y barberías',
  enFrase: 'una peluquería',
  resumen: 'Tinte o corte, cada uno con su tiempo, y el móvil sonando con las tijeras en la mano',
  titulo: 'Recepcionista con IA para peluquerías y barberías | Hachi',
  descripcion: 'Agenda cortes, tintes y barba con la duración de cada servicio y el peluquero que pide el cliente, mientras trabajas. Con recordatorios y lista de espera.',
  h1: 'Recepcionista con IA para <em>peluquerías y barberías</em>',
  entradilla: 'Con las tijeras en la mano no se contesta un WhatsApp. Y un tinte no dura lo ' +
    'mismo que un corte de caballero. Hachi agenda cada servicio con su tiempo real y con el ' +
    'profesional que el cliente quiere.',
  dolores: [
    { t: 'Contestar con el secador en la mano',
      p: 'Cada mensaje que contestas a medias es un cliente en la silla esperando. Cada mensaje ' +
        'que no contestas es una cita que se va a otra peluquería.' },
    { t: 'La agenda mal calculada',
      p: 'Meter un tinte con mechas en un hueco de media hora descuadra la tarde entera. La ' +
        'duración de cada servicio importa tanto como la hora.' },
    { t: 'El sábado vacío por un «no puedo ir»',
      p: 'Un plantón en sábado es la mejor hora de la semana perdida. Con un recordatorio y una ' +
        'lista de espera, ese hueco se vuelve a llenar.' }
  ],
  escena: {
    persona: 'Sergio', canal: 'WhatsApp · 20:18',
    alt: 'Conversación de ejemplo: un cliente pide corte y barba con un barbero concreto y Hachi lo agenda.',
    msgs: [
      ['in', 'Buenas! Corte y barba con Dani el sábado?'],
      ['out', '¡Buenas, Sergio! Dani tiene el sábado a las 10:00 y a las 12:30. Corte y barba son 45 minutos. ¿Cuál te guardo?'],
      ['in', 'A las 10'],
      ['out', 'Guardado: corte y barba con Dani, sábado a las 10:00. El viernes te mando un recordatorio.']
    ],
    nota: 'Hachi sabe que corte y barba son 45 minutos y busca un hueco de 45 minutos en la ' +
      'agenda de Dani, no en la de cualquiera.'
  },
  hace: [
    'Agenda cada servicio con <strong>su duración real</strong>: corte, tinte, mechas, barba, tratamiento.',
    'Respeta la preferencia de profesional: «con Dani» busca en la agenda de Dani.',
    'Recordatorio el día antes y lista de espera para los huecos que se liberan.',
    'Contesta precios, horarios y dónde estáis con tu información, también de madrugada.',
    'Entiende las fotos de referencia que mandan los clientes («quiero este color»).'
  ],
  garantias: [
    { t: 'No confirma una hora ocupada.', p: 'Busca un hueco que cubra la duración completa del servicio, no solo la hora de inicio.' },
    { t: 'No duplica la cita.', p: 'Aunque el cliente repita la petición o mande el día y la hora en mensajes separados.' },
    { t: 'No se inventa un precio.', p: 'Si un servicio no tiene precio en tu tarifa, no se lo inventa: dice que se confirma en el salón.' }
  ],
  roi: { ticket: 30, margen: 70 },
  plan: { id: 'porCita',
    por: '<p>Con tickets de 20 o 30 €, pagar por resultado suele salir mejor: el plan ' +
      '<strong>Por Cita</strong> cobra una cuota pequeña y un importe fijo por cada cita que ' +
      'agenda, con conversaciones ilimitadas y un tope mensual.</p>',
    alternativa: 'Si tienes varios profesionales y mucho volumen, el plan Esencial da una agenda por persona y cuota fija.' },
  faq: [
    { q: '¿Sabe cuánto dura cada servicio?',
      r: '<p>Sí: cada servicio se configura con su duración, y el asistente solo ofrece huecos donde cabe entero.</p>' },
    { q: '¿Puede elegir el cliente el peluquero?',
      r: '<p>Sí. Con varios profesionales, cada uno tiene su agenda y el cliente puede pedir el suyo.</p>' },
    { q: '¿Me sale a cuenta con tickets bajos?',
      r: '<p>Por eso existe el plan Por Cita: pagas una cuota base pequeña y un importe fijo por cada cita que agenda. Y tiene un tope mensual, así que nunca pagas más que un plan fijo.</p>' },
    { q: '¿Trabaja también con barberías que no usan cita?',
      r: '<p>Si todo es por orden de llegada, no hay agenda que llenar y te aportaría poco: contestaría horarios y precios. Encaja cuando hay cita previa.</p>' }
  ],
  vecinos: ['unas', 'spa', 'estetica']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'unas',
  slug: 'centros-de-belleza-y-unas',
  nombre: 'Centros de belleza y uñas',
  nombreSchema: 'centros de belleza y salones de uñas',
  enFrase: 'un centro de belleza',
  resumen: 'Rellenos cada tres semanas, cabinas y clientas fieles que reservan por WhatsApp',
  titulo: 'Recepcionista con IA para centros de belleza y uñas | Hachi',
  descripcion: 'Agenda manicuras, rellenos, pestañas y depilación con su duración y su cabina, y recuerda a cada clienta cuándo le toca volver. WhatsApp atendido mientras trabajas.',
  h1: 'Recepcionista con IA para <em>centros de belleza y uñas</em>',
  entradilla: 'Un centro de belleza vive de la clienta que vuelve: el relleno cada tres ' +
    'semanas, las pestañas cada cuatro. Hachi agenda cada servicio en su cabina y con su ' +
    'tiempo, y recuerda la cita para que la silla no se quede vacía.',
  dolores: [
    { t: 'Con el esmalte a medias',
      p: 'No se puede dejar una manicura para contestar el móvil. Y la clienta que escribe ' +
        'quiere saber ya si hay hueco el viernes.' },
    { t: 'Servicios que no duran lo mismo',
      p: 'Un semipermanente, un relleno de gel o unas extensiones de pestañas ocupan tiempos ' +
        'muy distintos. Una agenda mal cuadrada es una tarde de retrasos.' },
    { t: 'La clienta fiel que se despista',
      p: 'Si nadie le recuerda que le toca el relleno, se le pasa, se le rompen y acaba en ' +
        'otro centro que sí le contestó.' }
  ],
  escena: {
    persona: 'Carla', canal: 'WhatsApp · 22:03',
    alt: 'Conversación de ejemplo: una clienta pide relleno de gel y Hachi le agenda en la cabina disponible.',
    msgs: [
      ['in', 'Holaa me toca relleno de gel, tienes algo el viernes por la tarde?'],
      ['out', '¡Hola, Carla! El relleno de gel es 1 hora y 15 minutos. El viernes tengo a las 16:00 o a las 18:30. ¿Te guardo alguna?'],
      ['in', 'Las 16'],
      ['out', 'Perfecto: relleno de gel el viernes a las 16:00. El jueves te escribo para confirmarlo.']
    ],
    nota: 'La hora que ofrece es un hueco donde caben la hora y cuarto completa, comprobado en ' +
      'la agenda antes de proponerlo.'
  },
  hace: [
    'Agenda manicura, pedicura, rellenos, pestañas, cejas o depilación con <strong>su duración</strong> y su cabina o profesional.',
    'Recordatorio con confirmación, y lista de espera para las horas que se liberan.',
    'Contesta precios, técnicas y cuidados con tus textos.',
    'Entiende las fotos de diseños que mandan las clientas.',
    'Con el plan adecuado, campañas de WhatsApp para llenar la semana floja.'
  ],
  garantias: [
    { t: 'No confirma una hora ocupada.', p: 'Solo ofrece huecos donde el servicio cabe entero.' },
    { t: 'No se inventa un precio.', p: 'Un diseño especial sin precio en tu tarifa se confirma en el centro, no se improvisa.' },
    { t: 'No duplica la cita.', p: 'Aunque la clienta repita la petición en otro mensaje.' }
  ],
  roi: { ticket: 35, margen: 65 },
  plan: { id: 'esencial',
    por: '<p>Con varias profesionales o cabinas hace falta una agenda para cada una, y eso ' +
      'empieza en <strong>Esencial</strong>, con 750 conversaciones al mes.</p>',
    alternativa: 'Si trabajas sola, el plan Por Cita o el Autónomo te salen más a cuenta.' },
  faq: [
    { q: '¿Puede agendar en una cabina concreta?',
      r: '<p>Sí. Cada cabina o profesional es una agenda, y cada servicio se asigna a la que corresponde.</p>' },
    { q: '¿Recuerda cuándo le toca volver a cada clienta?',
      r: '<p>Envía el recordatorio de cada cita agendada. Si al terminar se agenda la siguiente, el aviso llega solo.</p>' },
    { q: '¿Puedo mandar promociones a mis clientas?',
      r: '<p>Con el plan Clínica Completa, campañas de WhatsApp con plantillas aprobadas por Meta a tu propia base de clientas, que es quien da el consentimiento. Las respuestas las atiende el asistente.</p>' },
    { q: '¿Entiende las fotos de diseños?',
      r: '<p>Sí: interpreta la imagen y responde en consecuencia. Si el diseño necesita valorarse, lo dice y propone hora.</p>' }
  ],
  vecinos: ['peluqueria', 'estetica', 'capilar']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'spa',
  slug: 'spas-y-masajes',
  nombre: 'Spas y centros de masajes',
  nombreSchema: 'spas y centros de masajes',
  enFrase: 'un spa',
  resumen: 'Circuitos, masajes, tarjetas regalo y reservas de fin de semana',
  titulo: 'Recepcionista con IA para spas y centros de masajes | Hachi',
  descripcion: 'Contesta a quien pregunta por un masaje o un circuito un domingo por la noche, agenda con el terapeuta y la cabina que toca y recuerda la cita para que no falle.',
  h1: 'Recepcionista con IA para <em>spas y centros de masajes</em>',
  entradilla: 'Nadie decide un masaje un martes a las once de la mañana: se decide el ' +
    'domingo por la noche, en el sofá. Hachi contesta a esa hora, explica tus rituales y ' +
    'deja la reserva hecha en la cabina que toca.',
  dolores: [
    { t: 'La reserva de impulso',
      p: 'El masaje se reserva cuando apetece. Si la respuesta llega el lunes, las ganas han ' +
        'pasado o ya reservó otro.' },
    { t: 'Explicar veinte veces lo mismo',
      p: 'Qué incluye el circuito, cuánto dura el ritual, si hay que llevar bañador. Preguntas ' +
        'razonables que se comen el tiempo de la recepción.' },
    { t: 'Cabinas y terapeutas encajados a mano',
      p: 'Un masaje de noventa minutos necesita terapeuta y cabina libres a la vez. Cuadrarlo ' +
        'por teléfono es donde nacen los solapes.' }
  ],
  escena: {
    persona: 'Elena', canal: 'WhatsApp · 22:47',
    alt: 'Conversación de ejemplo: una clienta pregunta por un masaje relajante y Hachi lo reserva.',
    msgs: [
      ['in', 'Hola! Qué diferencia hay entre el masaje relajante y el descontracturante? Quiero uno para el sábado'],
      ['out', 'Hola, Elena. El relajante es suave y sirve para desconectar; el descontracturante trabaja con más presión las zonas cargadas, como cuello y espalda. Los dos son de 60 minutos. El sábado tengo a las 11:00 y a las 17:30. ¿Cuál te apetece?'],
      ['in', 'Descontracturante a las 17:30'],
      ['out', 'Reservado: masaje descontracturante, sábado a las 17:30. Llega diez minutos antes. Te lo recuerdo el viernes.']
    ],
    nota: 'La explicación sale de tu propia carta de servicios, que subes una vez: si cambias un ' +
      'ritual, cambia lo que responde, sin rediseñar ningún flujo.'
  },
  hace: [
    'Explica <strong>tu carta de masajes y circuitos</strong> con tus textos, también de noche y en fin de semana.',
    'Agenda con el terapeuta y la duración de cada servicio.',
    'Informa de tarjetas regalo, bonos y condiciones con tu información.',
    'Recordatorio antes de la cita con confirmación, y lista de espera para las cancelaciones.',
    'Atiende en español, inglés y portugués, útil si recibes turistas.'
  ],
  garantias: [
    { t: 'No confirma una hora ocupada.', p: 'Comprueba la agenda antes de proponer: nada de dos clientes a la misma hora con el mismo terapeuta.' },
    { t: 'No se inventa un precio.', p: 'Los precios de rituales y bonos salen de tu tarifa. Lo que no esté, se confirma.' },
    { t: 'No reserva en el pasado.', p: '«Este sábado» se calcula en la hora de tu centro, no en la del servidor.' }
  ],
  roi: { ticket: 70, margen: 65 },
  plan: { id: 'esencial',
    por: '<p>Con varios terapeutas hace falta una agenda por persona: plan ' +
      '<strong>Esencial</strong>, con tu base de conocimiento para la carta de servicios.</p>',
    alternativa: 'Un centro con un solo terapeuta encaja en Autónomo; con mucha llamada telefónica, en Profesional.' },
  faq: [
    { q: '¿Puede vender tarjetas regalo?',
      r: '<p>Informa de ellas y de cómo se compran con lo que tú le indiques. El cobro sigue siendo cosa de tu centro.</p>' },
    { q: '¿Entiende la diferencia entre mis tratamientos?',
      r: '<p>La que tú le explicas: sube tu carta de servicios y la usa para responder. Si algo no está, no se lo inventa.</p>' },
    { q: '¿Atiende a turistas en otros idiomas?',
      r: '<p>Sí: contesta en español, inglés o portugués según el idioma en que le escriban. Tus servicios y precios se mantienen tal cual; solo se traduce la respuesta.</p>' },
    { q: '¿Qué pasa si alguien tiene una contraindicación?',
      r: '<p>No da consejo de salud. Si una persona menciona una lesión o un embarazo, responde con lo que tú hayas indicado y, si hace falta, pasa la conversación al equipo.</p>' }
  ],
  vecinos: ['estetica', 'unas', 'fisioterapia']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'taller',
  slug: 'talleres-mecanicos',
  nombre: 'Talleres mecánicos',
  nombreSchema: 'talleres mecánicos',
  enFrase: 'un taller',
  resumen: 'Revisiones, diagnósticos y el teléfono sonando debajo de un coche',
  titulo: 'Recepcionista con IA para talleres mecánicos | Hachi',
  descripcion: 'Atiende el teléfono y el WhatsApp del taller cuando estás bajo un coche, pide marca, modelo y matrícula, y agenda la revisión o el diagnóstico.',
  h1: 'Recepcionista con IA para <em>talleres mecánicos</em>',
  entradilla: 'En un taller el teléfono suena cuando tienes las manos llenas de grasa. El ' +
    'cliente quiere saber si le podéis mirar el coche esta semana. Hachi coge esa llamada, ' +
    'pide los datos del vehículo y deja la cita en tu agenda.',
  dolores: [
    { t: 'Nadie coge el teléfono del taller',
      p: 'Con dos o tres mecánicos trabajando, el teléfono se queda sonando. Esa revisión la ' +
        'acaba haciendo el taller de la otra calle.' },
    { t: 'Citas sin los datos del coche',
      p: 'Apuntar «Juan, el martes» no sirve de nada si no sabes qué coche es ni qué le pasa. ' +
        'Luego hay que volver a llamar.' },
    { t: 'El presupuesto improvisado',
      p: 'Un precio dado por teléfono sin ver el coche es una discusión asegurada cuando llega ' +
        'la factura.' }
  ],
  escena: {
    persona: 'Raúl', canal: 'Llamada · 10:26',
    alt: 'Conversación de ejemplo: un cliente llama al taller por un ruido en los frenos y Hachi agenda el diagnóstico.',
    msgs: [
      ['in', 'Hola, el coche me hace un ruido raro al frenar, me lo podéis mirar?'],
      ['out', 'Claro. Para ver qué es, lo mejor es un diagnóstico de frenos. ¿Me dices marca, modelo y matrícula?'],
      ['in', 'Un Seat León, 4521 KLM'],
      ['out', 'Perfecto, Raúl. Para el diagnóstico tengo mañana a las 9:00 o el jueves a las 15:00. ¿Te va alguno? El precio de la reparación te lo damos cuando lo veamos.']
    ],
    nota: 'Los datos que pide —marca, modelo, matrícula— se configuran para tu taller, y no ' +
      'agenda sin ellos. El precio de una reparación no lo inventa: lo da el mecánico después.'
  },
  hace: [
    'Atiende <strong>las llamadas del taller con voz</strong> y agenda durante la propia llamada.',
    'Pide <strong>marca, modelo y matrícula</strong> antes de agendar, porque se configura con los datos que necesitas.',
    'Entiende las fotos que mandan del golpe, del testigo del salpicadero o de la rueda.',
    'Agenda revisión, cambio de aceite, ITV previa o diagnóstico, cada uno con su duración.',
    'Da tus precios cerrados (un cambio de aceite, una revisión); lo que requiere ver el coche, se presupuesta en el taller.',
    'Recordatorio antes de la cita y aviso de próximas revisiones si se agendan.'
  ],
  garantias: [
    { t: 'No se inventa un presupuesto.', p: 'Un importe que no está en tu tarifa se retira antes de enviarse. Para una reparación, dice que el precio se da tras el diagnóstico.' },
    { t: 'No confirma un hueco ocupado.', p: 'Comprueba la agenda del taller antes de dar una hora.' },
    { t: 'No duplica la cita.', p: 'Aunque el cliente insista o dé los datos del coche en varios mensajes.' }
  ],
  roi: { ticket: 250, margen: 35 },
  plan: { id: 'profesional',
    por: '<p>En un taller casi todo entra por teléfono, y la voz empieza en ' +
      '<strong>Profesional</strong>: 400 minutos al mes y las llamadas de WhatsApp.</p>',
    alternativa: 'Si tus clientes escriben más que llaman, el plan Esencial con el módulo de voz también sirve.' },
  faq: [
    { q: '¿Sabe en qué punto está la reparación de un coche?',
      r: '<p>Hoy no: eso vive en tu taller. Si alguien pregunta «¿está listo mi coche?», el asistente lo anota y avisa a tu equipo para que conteste.</p>' },
    { q: '¿Puede dar presupuestos?',
      r: '<p>Los precios cerrados que tú le indiques, sí. Una reparación que necesita diagnóstico, no: agenda el diagnóstico y dice que el precio se da después.</p>' },
    { q: '¿Qué datos del coche pide?',
      r: '<p>Los que configures: normalmente marca, modelo y matrícula, y a veces los kilómetros. No agenda sin ellos.</p>' },
    { q: '¿Atiende llamadas mientras estamos trabajando?',
      r: '<p>Sí: con la voz, coge la llamada, conversa con naturalidad y agenda. Cada llamada queda en el panel con su transcripción y su resumen.</p>' }
  ],
  vecinos: ['hogar', 'veterinaria', 'peluqueria']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'capilar',
  slug: 'clinicas-capilares-y-laser',
  nombre: 'Clínicas capilares y de láser',
  nombreSchema: 'clínicas capilares y de depilación láser',
  enFrase: 'una clínica capilar o de láser',
  resumen: 'Valoraciones de injerto, sesiones de láser seriadas y mucho anuncio',
  titulo: 'Recepcionista con IA para clínicas capilares y de láser | Hachi',
  descripcion: 'Contesta a quien pregunta por un injerto o por la depilación láser, agenda la valoración y cada sesión en su intervalo, y retoma a quien pidió precio y no reservó.',
  h1: 'Recepcionista con IA para <em>clínicas capilares y de láser</em>',
  entradilla: 'Un injerto capilar se decide despacio y se paga caro; el láser son seis o ' +
    'siete sesiones espaciadas. Las dos cosas dependen de contestar rápido al primer mensaje ' +
    'y de no perder a nadie entre una sesión y la siguiente.',
  dolores: [
    { t: 'El lead caro que nadie contesta',
      p: 'Un contacto de anuncio para un injerto cuesta dinero. Si tarda un día en recibir ' +
        'respuesta, ese dinero se ha tirado.' },
    { t: 'Las sesiones que se desordenan',
      p: 'El láser funciona si se respetan los intervalos. Una clienta que no agenda la ' +
        'siguiente sesión a tiempo pierde resultado y acaba insatisfecha.' },
    { t: 'La decisión que se enfría',
      p: 'Quien pregunta por un injerto lo piensa semanas. Sin un seguimiento, la conversación ' +
        'se queda en el precio.' }
  ],
  escena: {
    persona: 'Óscar', canal: 'WhatsApp · 00:14',
    alt: 'Conversación de ejemplo: un paciente pregunta por un injerto capilar, manda una foto y Hachi agenda la valoración.',
    msgs: [
      ['in', 'Buenas, cuánto cuesta un injerto capilar? Te mando foto de cómo lo tengo'],
      ['in', '📷 Foto'],
      ['out', 'Gracias, Óscar. Por la foto se ve pérdida en la zona de las entradas. El precio depende de las unidades foliculares que hagan falta, y eso lo determina el médico en una valoración gratuita. ¿Te la agendo? Tengo el martes a las 18:00 o el sábado a las 10:30.'],
      ['in', 'El sábado'],
      ['out', 'Hecho: valoración capilar el sábado a las 10:30. Te recuerdo la cita el viernes.']
    ],
    nota: 'El asistente describe la foto y no da un precio que dependa de la valoración: agenda ' +
      'la valoración. Si en tu tarifa hay precios orientativos, los da tal cual.'
  },
  hace: [
    'Contesta en segundos a los <strong>contactos de anuncios de Meta</strong> y les escribe por WhatsApp.',
    'Entiende las fotos de la zona a tratar y propone la valoración.',
    'Agenda cada sesión de láser con su duración, y la siguiente al terminar la anterior.',
    '<strong>Seguimiento proactivo</strong> a quien pidió precio y no reservó, retomando su conversación.',
    'Recordatorios con confirmación para no romper los intervalos entre sesiones.'
  ],
  garantias: [
    { t: 'No se inventa un precio.', p: 'Un importe que no está en tu información se retira. Un injerto que depende de la valoración, se valora.' },
    { t: 'No confirma una hora ocupada.', p: 'Comprueba la agenda del médico o de la cabina de láser antes de ofrecer hora.' },
    { t: 'No reserva en el pasado.', p: 'Las fechas se calculan en la hora de tu clínica, también «dentro de seis semanas».' }
  ],
  roi: { ticket: 150, margen: 60 },
  plan: { id: 'completa',
    por: '<p>Estas clínicas viven de los anuncios y del seguimiento, y eso —Lead Ads, ' +
      'seguimiento proactivo, campañas— está en <strong>Clínica Completa</strong>.</p>',
    alternativa: 'Si no haces publicidad, el plan Profesional cubre WhatsApp, teléfono y varias agendas.' },
  faq: [
    { q: '¿Puede valorar una foto y decir cuántas unidades hacen falta?',
      r: '<p>No. Describe lo que ve para que la conversación fluya, pero la valoración es del médico. Lo que hace es agendarla.</p>' },
    { q: '¿Agenda las sesiones de láser con su intervalo?',
      r: '<p>Agenda cada sesión en la fecha que se pida y avisa antes con un recordatorio. Si al terminar una sesión se agenda la siguiente, el intervalo queda cubierto.</p>' },
    { q: '¿Qué hace con quien preguntó y no volvió?',
      r: '<p>Con el plan Clínica Completa, el seguimiento proactivo le escribe retomando su conversación. Solo a quien escribió primero: Hachi no inicia conversaciones con desconocidos.</p>' },
    { q: '¿Puede ofrecer financiación?',
      r: '<p>Informa de las opciones que tú le indiques. La aprobación de la financiación sigue siendo cosa de la entidad y de tu clínica.</p>' }
  ],
  vecinos: ['estetica', 'unas', 'dental']
},

// ─────────────────────────────────────────────────────────────────
{
  id: 'hogar',
  slug: 'fontaneros-electricistas-y-mantenimiento',
  nombre: 'Fontaneros, electricistas y mantenimiento',
  nombreSchema: 'fontaneros, electricistas y empresas de mantenimiento',
  enFrase: 'un negocio de reparaciones',
  resumen: 'Visitas a domicilio, urgencias de agua y el móvil sonando en mitad de un trabajo',
  titulo: 'Recepcionista con IA para fontaneros, electricistas y mantenimiento',
  descripcion: 'Contesta mientras estás en una obra, pide dirección y fotos de la avería, agenda la visita en tu franja y pasa a ti las urgencias. Llamadas y WhatsApp, 24/7.',
  h1: 'Recepcionista con IA para <em>fontaneros, electricistas y mantenimiento</em>',
  entradilla: 'Quien trabaja en reparaciones pasa el día subido a una escalera o debajo de ' +
    'un fregadero. Cada llamada que no coge es un trabajo que se lleva otro. Hachi contesta, ' +
    'recoge lo que necesitas saber y te deja la visita agendada.',
  dolores: [
    { t: 'El trabajo que se va al siguiente de la lista',
      p: 'Quien tiene una avería llama al primero que encuentra. Si no contestas, llama al ' +
        'segundo, y ese es el que se queda el trabajo.' },
    { t: 'Ir a ciegas',
      p: 'Presentarse sin saber qué pasa —¿es el calentador?, ¿es un enchufe?— obliga a volver ' +
        'con la pieza. Una foto antes de ir ahorra un viaje.' },
    { t: 'Las urgencias mezcladas con los presupuestos',
      p: 'Una fuga que está inundando la cocina no puede esperar en la misma cola que un ' +
        'presupuesto de reforma para el mes que viene.' }
  ],
  escena: {
    persona: 'Ana', canal: 'WhatsApp · 18:52',
    alt: 'Conversación de ejemplo: una clienta tiene un enchufe que no funciona y Hachi agenda la visita en una franja.',
    msgs: [
      ['in', 'Hola, se me ha quedado sin luz media cocina y salta el diferencial'],
      ['out', 'Hola, Ana. ¿Me mandas una foto del cuadro eléctrico y me dices la dirección? Así el electricista va sabiendo qué se encuentra.'],
      ['in', '📷 Foto · Calle Mayor 14, 3ºB'],
      ['out', 'Recibido. Puedo agendarte la visita mañana entre las 9:00 y las 11:00 o entre las 16:00 y las 18:00. ¿Cuál prefieres?']
    ],
    nota: 'Las franjas de visita las defines tú (por ejemplo, de dos en dos horas). Si Ana ' +
      'hubiera escrito que sale agua por el techo, la conversación habría ido a ti al momento.'
  },
  hace: [
    'Atiende <strong>el teléfono con voz</strong> y el WhatsApp mientras trabajas, y agenda la visita.',
    'Pide <strong>la dirección, qué ha pasado y una foto</strong> antes de agendar, porque se configura con lo que necesitas.',
    'Agenda en <strong>franjas de visita</strong> que tú defines, no a una hora exacta imposible de cumplir.',
    'Reconoce una urgencia (una fuga, algo que no se puede dejar para mañana) y te la pasa al momento.',
    'Recordatorio el día antes para que el cliente esté en casa cuando llegues.'
  ],
  garantias: [
    { t: 'No pierde una urgencia.', p: 'Una avería que no puede esperar se escala a ti, también si algo falla por dentro.' },
    { t: 'No se inventa un presupuesto.', p: 'Da tu precio de desplazamiento o de visita si lo tienes en tu tarifa; una reparación se presupuesta al verla.' },
    { t: 'No dobla una franja.', p: 'Comprueba tu agenda antes de ofrecer una franja: no te manda a dos sitios a la vez.' }
  ],
  roi: { ticket: 120, margen: 50 },
  plan: { id: 'profesional',
    por: '<p>Este oficio vive del teléfono, y la voz empieza en <strong>Profesional</strong>: ' +
      '400 minutos al mes, varias agendas si sois un equipo y llamadas de WhatsApp.</p>',
    alternativa: 'Si trabajas solo y tus clientes escriben más que llaman, el plan Autónomo con el módulo de voz es suficiente.' },
  faq: [
    { q: '¿Puede repartir los avisos entre mis técnicos y planificar la ruta?',
      r: '<p>Reparte por agenda: cada técnico tiene la suya y el asistente agenda en la que tenga hueco. Lo que no hace es optimizar rutas entre domicilios; para eso hay software de despacho específico.</p>' },
    { q: '¿Qué pasa con las urgencias de noche?',
      r: '<p>Se marcan como urgentes y te llegan al momento. Si tienes servicio de guardia con otro precio, el asistente lo explica con tu información.</p>' },
    { q: '¿Da presupuestos?',
      r: '<p>Da los precios fijos que tú le pongas —desplazamiento, hora de trabajo, una instalación estándar—. Lo que depende de ver la avería, lo agenda como visita de diagnóstico.</p>' },
    { q: '¿Sirve para una empresa de mantenimiento con contratos?',
      r: '<p>Sirve para agendar las visitas y atender a los clientes. Si tu trabajo son sobre todo incidencias con plazos de contrato, cuéntalo en la demostración y te diremos con honestidad si encaja.</p>' }
  ],
  vecinos: ['taller', 'veterinaria', 'peluqueria']
}

];
