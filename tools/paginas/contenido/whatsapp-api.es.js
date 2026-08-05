/**
 * «diferencia whatsapp business api» · /es/whatsapp-api-vs-business.html
 * Origen: docs/rag/hachi_espana_rag.txt §§ WhatsApp API y Tu número.
 */
module.exports = {
  lang: 'es',
  ruta: 'es/whatsapp-api-vs-business.html',
  alterna: { lang: 'en', ruta: 'whatsapp-api-vs-business.html' },
  publicado: '2026-08-05',
  actualizado: '2026-08-05',

  titulo: 'WhatsApp Business vs WhatsApp Business API: diferencias reales | Hachi',
  ogTitulo: 'WhatsApp Business vs API: qué cambia de verdad',
  descripcion: 'Qué diferencia hay entre la app de WhatsApp Business y la API oficial, por qué bloquean números, qué es la ventana de 24 horas y qué pierdes al migrar tu número de siempre.',
  migaFinal: 'WhatsApp Business vs API',

  h1: 'WhatsApp Business y WhatsApp Business API <em>no son lo mismo</em>',
  entradilla: `Confundirlos es lo que hace que a muchos negocios les bloqueen el número —
    normalmente el de toda la vida, el que está en Google y en las tarjetas. Aquí está la
    diferencia entera, incluida la parte que casi nadie cuenta hasta que ya es tarde.`,

  bloques: [
    {
      h2: 'Son dos productos distintos, no dos versiones del mismo',
      html: `
<p>WhatsApp Business y WhatsApp Business API comparten nombre y poco más. La
   <strong>app</strong> —la gratuita que te descargas en el móvil— está pensada para un
   negocio pequeño que <em>responde</em>. La <strong>API</strong> es el canal que Meta
   habilita para empresas que además <em>inician</em> conversaciones y manejan volumen.</p>

<div class="tabla">
<table>
  <thead><tr><th></th><th>App de WhatsApp Business</th><th>WhatsApp Business API</th></tr></thead>
  <tbody>
    <tr><td>Dónde se usa</td><td>En el móvil</td><td><strong>Desde el ordenador</strong>, en un panel web</td></tr>
    <tr><td>Quién responde</td><td>Una persona, a mano</td><td>Tu equipo <strong>y</strong> un asistente, a la vez</td></tr>
    <tr><td>Escribir primero</td><td class="no">Riesgo de bloqueo</td><td class="si">Permitido, con plantilla aprobada</td></tr>
    <tr><td>Varias personas atendiendo</td><td class="no">No</td><td class="si">Sí, con la conversación asignada</td></tr>
    <tr><td>Historial y etiquetas</td><td>Sólo en ese móvil</td><td>Centralizado, con buscador</td></tr>
    <tr><td>Coste</td><td>Gratis</td><td>Se paga por conversación iniciada</td></tr>
  </tbody>
</table>
</div>

<div class="destacado">
<p><strong>Lo que más sorprende:</strong> la API <em>no es una aplicación</em>. No se
   descarga, no se instala y no vive en el móvil. Es una vía de conexión, y lo que tú ves
   es el panel web que se conecta a ella. No pierdes nada de lo que hacías —tus
   conversaciones siguen ahí y tu equipo puede contestar a mano cuando quiera—; lo que
   cambia es <strong>dónde</strong> se atiende.</p>
</div>`
    },
    {
      h2: 'Por qué bloquean números que usan la app normal',
      html: `
<p>La app está diseñada para conversaciones que empieza el cliente. En cuanto empiezas a
   mandar mensajes a gente que no te ha escrito ese día, o muchos mensajes seguidos, el
   sistema antispam de WhatsApp lo interpreta como lo que parece:</p>
<ul>
  <li>Primero <strong>te limita el envío</strong> sin avisarte.</li>
  <li>Después <strong>te suspende el número</strong> temporalmente.</li>
  <li>Si se repite, <strong>te lo bloquea de forma permanente</strong>.</li>
</ul>
<p>Y no hay un botón de recuperación ni un teléfono al que llamar. El problema no es el
   castigo en sí: es <em>qué número</em> pierdes. Suele ser el que llevas años publicando
   en tu ficha de Google, en la web, en los rótulos y en las tarjetas. Perderlo es perder
   el canal por el que te llega el trabajo.</p>

<div class="destacado aviso">
<p>Si estás mandando recordatorios de cita a mano desde la app del móvil, estás
   exactamente en el patrón que dispara el bloqueo. Funciona hasta que deja de funcionar,
   y no avisa.</p>
</div>`
    },
    {
      h2: 'La ventana de 24 horas, explicada sin tecnicismos',
      html: `
<p>Es la regla que ordena todo lo demás. Meta permite escribir libremente a una persona
   durante las <strong>24 horas siguientes a su último mensaje</strong>. Pasado ese plazo
   ya no se puede mandar texto libre: sólo una
   <strong>plantilla aprobada previamente por Meta</strong>.</p>

<p>En la práctica:</p>
<ul>
  <li>Alguien escribe a las 22:00 preguntando por un servicio → puedes responderle con
      total libertad durante las 24 horas siguientes.</li>
  <li>Esa persona no vuelve a escribir en tres días y quieres recuperarla → ya está fuera
      de la ventana, así que se le escribe con una plantilla aprobada
      («Hola {{nombre}}, ¿seguimos adelante con tu consulta de {{servicio}}?»).</li>
  <li>En cuanto contesta, <strong>se abre otra ventana de 24 horas</strong> y la
      conversación vuelve a ser libre.</li>
</ul>

<p>Esa ventana es, de paso, el mecanismo que impide el spam en WhatsApp: no puedes
   escribir a alguien cuando quieras con lo que quieras.</p>

<div class="destacado bien">
<p>Un asistente decente gestiona esto solo: sabe si la persona está dentro o fuera de la
   ventana y elige entre mensaje libre o plantilla sin que tú tengas que pensarlo. Es la
   razón por la que un bot casero o una automatización montada por tu cuenta acaba
   fallando — no porque esté mal hecha, sino porque <strong>sin API oficial y sin gestión
   de plantillas el mensaje sencillamente no sale</strong>.</p>
</div>`
    },
    {
      h2: 'La regla que decide si conservas tu número',
      html: `
<p>Aquí está la parte que conviene saber antes y no después:</p>

<blockquote>Un número de teléfono puede estar en la app de WhatsApp Business
<strong>O</strong> en la API, pero <strong>nunca en las dos a la vez</strong>.</blockquote>

<p>Es una norma de Meta, no una limitación de ningún proveedor. Y de ella salen dos
   caminos.</p>

<h3>Camino A · Un número nuevo</h3>
<p>Das de alta una SIM nueva y esa es la que va a la API. El WhatsApp Business que ya
   tienes <strong>no se toca</strong>: sigue en el teléfono con todo dentro. Riesgo cero y
   sin esperas adicionales.</p>
<p>La pega es evidente: es un número distinto del que está publicado, así que hay que
   empezar a difundirlo o poner una redirección. Aun así es lo que recomendamos a casi
   todo el mundo, sobre todo si tu WhatsApp actual tiene años de historial.</p>

<h3>Camino B · Migrar el número de siempre</h3>
<p>Se puede, y sigues siendo localizable donde ya te conocen. Pero:</p>

<div class="destacado aviso">
<p><strong>Al migrar el número a la API, el historial de chats y los contactos que viven
   en la app del móvil dejan de estar accesibles.</strong> La API arranca limpia. No es
   que se borren por arte de magia: es que ese número deja de funcionar en la app, y con
   él se va el acceso a esas conversaciones desde el panel nuevo.</p>
</div>

<p>Si un proveedor te resuelve este punto con un «nosotros te lo conectamos y listo»,
   pregúntale expresamente qué pasa con el histórico. La factura de no preguntarlo llega
   meses después, buscando una conversación antigua que ya no está en ninguna parte.</p>`
    },
    {
      h2: 'Cómo decidir, en dos preguntas',
      html: `
<ol>
  <li><strong>¿El número que usas ahora está publicado en tu web, en Google y en tus
      anuncios?</strong><br>Si no lo está, ve a número nuevo sin pensarlo más.</li>
  <li><strong>¿Con qué frecuencia abres un chat de hace meses?</strong><br>Si la respuesta
      es «nunca», migra y olvídate del histórico. Si lo consultas de vez en cuando —o forma
      parte del seguimiento de tus clientes—, entonces sí compensa rescatarlo antes.</li>
</ol>

<p>El rescate consiste en sacar la agenda de contactos y el histórico de la app,
   ordenarlos y cargarlos en el sistema nuevo, y hay que hacerlo <strong>antes</strong> de
   migrar. Eso no es automatización, es trabajo de datos: se hace caso por caso según
   cuánto tengas, y por eso se presupuesta aparte.</p>

<p>Es una decisión que se toma una vez y conviene tomarla bien. Si dudas, plantéalo con tu
   caso concreto antes de firmar nada con nadie.</p>`
    }
  ],

  faq: [
    {
      q: '¿Es gratis WhatsApp Business API?',
      r: `<p>La app es gratuita; la API no. Meta cobra por conversación iniciada por la
          empresa —recordatorios y campañas—, mientras que <strong>responder dentro de las
          24 horas siguientes al mensaje del cliente no tiene coste</strong>. A eso se le
          suma lo que cobre el proveedor que te la gestione.</p>`
    },
    {
      q: '¿Puedo seguir usando el móvil para contestar?',
      r: `<p>Con la API se atiende desde un panel web en el ordenador, no desde la app de
          WhatsApp del móvil. La ventaja es que pueden atender varias personas a la vez con
          las conversaciones asignadas, y que el historial queda centralizado y con
          buscador en vez de vivir en un único teléfono.</p>`
    },
    {
      q: '¿Cuánto tarda Meta en aprobar una plantilla?',
      r: `<p>Habitualmente entre 24 y 48 horas. Si la rechaza, no sale: es una barrera que
          no depende ni de ti ni de tu proveedor, y es parte de por qué la API no se usa
          para spam.</p>`
    },
    {
      q: '¿Puedo volver atrás después de migrar a la API?',
      r: `<p>Se puede devolver un número a la app, pero es un trámite y tampoco recupera lo
          que quedó atrás. Por eso la decisión importante es la de antes de migrar, no la
          de después.</p>`
    },
    {
      q: '¿Necesito la API si sólo quiero responder mensajes?',
      r: `<p>Si de verdad sólo respondes, y nunca escribes primero ni mandas recordatorios,
          la app puede bastarte. La API se vuelve necesaria en cuanto quieres iniciar
          conversaciones, que varias personas atiendan a la vez o que un asistente responda
          automáticamente.</p>`
    }
  ],

  relacionadas: [
    { href: '/es/por-que-los-bots-de-flujo-fallan.html',
      titulo: 'Por qué los bots de flujo fallan',
      nota: 'El mecanismo exacto de la cita duplicada' },
    { href: '/es/cuanto-cuesta-un-asistente-ia.html',
      titulo: 'Cuánto cuesta un asistente de IA',
      nota: 'Qué explica la horquilla de 29 € a 900 €' },
    { href: '/es/preguntas.html#puedo-usar-mi-numero-de-siempre',
      titulo: 'Preguntas frecuentes',
      nota: '75 respuestas, incluidas las incómodas' }
  ],

  cta: {
    h2: '¿Lo montamos nosotros?',
    p: `Tramitamos la API oficial, conectamos tu número y preparamos las plantillas. En la
        demostración vemos tu caso concreto: si te conviene número nuevo o migrar, y qué
        supone cada uno con tus datos.`,
    boton: 'Solicitar una demostración',
    botonSec: '📊 Calcular mi retorno'
  }
};
