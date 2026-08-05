/**
 * «bot no consulta agenda» · /es/por-que-los-bots-de-flujo-fallan.html
 * Origen: RAG §§ Los tres niveles (nivel 1), Diferencial vs chatbot.
 *
 * Ángulo: el MECANISMO del fallo. La página hermana
 * (cuanto-cuesta-un-asistente-ia) cubre el precio. No deben solaparse.
 *
 * Regla de publicación: se describe QUÉ falla y QUÉ hay que garantizar, nunca
 * CÓMO está implementada la garantía.
 */
module.exports = {
  lang: 'es',
  ruta: 'es/por-que-los-bots-de-flujo-fallan.html',
  alterna: { lang: 'en', ruta: 'why-flow-based-bots-fail.html' },
  publicado: '2026-08-05',
  actualizado: '2026-08-05',

  titulo: 'Por qué tu bot no puede consultar la agenda de verdad | Hachi',
  ogTitulo: 'Por qué los bots de flujo no pueden agendar',
  descripcion: 'El motivo técnico por el que un bot de flujos no consulta tu calendario, cómo se produce la cita duplicada y qué hay que exigirle a cualquier asistente que agende.',
  migaFinal: 'Por qué los bots de flujo fallan',

  h1: 'Por qué tu bot <em>no puede</em> consultar la agenda',
  entradilla: `Si tu chatbot confirma horas que no existen, vuelve a preguntar el nombre
    cada dos mensajes o crea la misma cita dos veces, no está mal configurado. Está
    haciendo exactamente lo único que sabe hacer. Aquí está el mecanismo.`,

  bloques: [
    {
      h2: 'Un flujo no es un asistente: es un diagrama',
      html: `
<p>La mayoría de lo que se vende como «bot para clínicas» es un diagrama dibujado a mano:
   si el cliente pulsa este botón, responde esto; si escribe esta palabra, salta a este
   otro paso. Funciona por reconocimiento de patrones, no por comprensión.</p>
<p>Eso tiene una consecuencia que no es de calidad, sino de <strong>capacidad</strong>:
   un diagrama sólo puede recorrer los caminos que alguien dibujó antes. Cuando alguien
   escribe algo que no estaba previsto, no hay rama a la que ir. Por eso los flujos se
   «rompen» con frases perfectamente normales.</p>
<div class="destacado">
<p>No es que lo haga mal. Es que <strong>no tiene forma de hacerlo</strong>. Es la
   diferencia entre un empleado nuevo que aún no sabe algo y una calculadora a la que le
   pides que redacte una carta.</p>
</div>`
    },
    {
      h2: 'Por qué no puede saber si el jueves a las 10 está libre',
      html: `
<p>Para responder «¿tenéis hueco el jueves a las 10?» con verdad hacen falta tres cosas, y
   un flujo no tiene ninguna:</p>
<ol>
  <li><strong>Entender la pregunta</strong>, incluyendo «el jueves», «pasado mañana», «a
      primera hora» o «cuando podáis por la tarde».</li>
  <li><strong>Consultar el calendario real</strong> en ese momento, no una copia de ayer ni
      una tabla de horarios teóricos.</li>
  <li><strong>Interpretar la respuesta</strong> y, si no hay hueco, proponer alternativas
      que sí existan.</li>
</ol>
<p>Un flujo puede parecer que lo hace, y ahí está el problema. Tiene dos salidas y ninguna
   buena:</p>
<ul>
  <li><strong>Confirmar a ciegas</strong> — «perfecto, te esperamos el jueves a las 10» —
      y el jueves se presentan dos personas a la misma hora.</li>
  <li><strong>Escurrir el bulto</strong> — «te confirmamos en breve» — que es exactamente
      el trabajo que querías quitarte de encima, sólo que ahora con un paso más.</li>
</ul>
<div class="destacado aviso">
<p>Si tu bot nunca te ha dado un problema de agenda, comprueba cuál de las dos está
   haciendo. La segunda no falla, pero tampoco resuelve.</p>
</div>`
    },
    {
      h2: 'Cómo se produce exactamente una cita duplicada',
      html: `
<p>Es el fallo más caro y el más fácil de reproducir. Una conversación real no llega
   ordenada, llega a trozos:</p>
<div class="destacado">
<p>— «hola, quería pedir cita»<br>
   — «el jueves si puede ser»<br>
   — «a las 11 mejor»<br>
   — «ah, me llamo Marta»<br>
   — «¿te paso el teléfono?»<br>
   — «confírmame porfa»<br>
   — «¿me lo confirmas?»</p>
</div>
<p>Cada uno de esos mensajes llega por separado. Un flujo, o una automatización del tipo
   «cuando llegue un mensaje, haz esto», tiene que decidir en cada uno si es una petición
   nueva o la continuación de la anterior. Y no tiene contexto para saberlo.</p>
<p>Así que hace una de dos cosas, y las dos son malas:</p>
<ul>
  <li><strong>Vuelve a empezar</strong> en cada mensaje, y el cliente tiene que repetir el
      nombre y el día tres veces hasta que se cansa y se va.</li>
  <li><strong>Trata cada confirmación como una reserva</strong>, y los dos «confírmame» del
      final se convierten en dos citas.</li>
</ul>
<p>Un sistema que sostiene la conversación entiende que todo eso es
   <strong>la misma reserva</strong>, que se va completando por partes, y que dos
   confirmaciones seguidas no son dos citas.</p>`
    },
    {
      h2: 'El fallo silencioso: la reserva que se queda a medias',
      html: `
<p>Este casi nunca se menciona en una demostración porque no se ve. Reagendar una cita son
   dos operaciones: cancelar la vieja y crear la nueva. Si la primera funciona y la segunda
   falla —el calendario no responde, se cae la conexión, el hueco se ocupó entre medias—,
   el resultado es que tu cliente <strong>se ha quedado sin cita</strong> y nadie se ha
   enterado.</p>
<p>No aparece en ningún informe de errores porque, desde fuera, la conversación terminó
   bien. Aparece el día que esa persona se presenta y no está en la agenda.</p>
<div class="destacado bien">
<p>Lo que hay que exigir es que <strong>si una operación falla a mitad, se deshaga sola</strong>
   y vuelva al estado anterior. Es un requisito, no un extra: o el cambio se completa
   entero, o no se hace. Pregúntalo expresamente, porque es de las pocas cosas que separan
   un sistema serio de uno que impresiona en la demostración.</p>
</div>`
    },
    {
      h2: 'El otro extremo: cuando el modelo se lo inventa',
      html: `
<p>Frente al flujo rígido hay un péndulo que se va al otro lado: conectar directamente un
   modelo de lenguaje a WhatsApp y dejarlo contestar. Conversa maravillosamente. Y tiene un
   problema distinto pero igual de caro.</p>
<p>Un modelo sin restricciones <strong>completa lo que no sabe</strong>, porque para eso
   está entrenado. Le preguntan por un precio que no tiene y da uno plausible. Le preguntan
   por un servicio que no ofreces y lo describe con seguridad. Suena convincente y es
   falso.</p>
<p>Y no es un riesgo de manual: ya hay sentencias que obligan a una empresa a cumplir lo
   que su chatbot prometió a un cliente. Ante el que reclama, lo que dijo tu asistente lo
   dijiste tú.</p>
<p>La respuesta a esto no es pedirle al modelo que se porte bien en las instrucciones. Es
   que lo que va a decir sobre precios, servicios y disponibilidad
   <strong>se compruebe contra tu información real antes de enviarse</strong>, y que
   cuando el dato no está, lo diga y avise a una persona.</p>`
    },
    {
      h2: 'Qué exigir, en una lista',
      html: `
<p>Al margen de con quién lo contrates, esto es lo que hay que poder responder que sí:</p>
<div class="tabla">
<table>
  <thead><tr><th>Requisito</th><th>Por qué importa</th></tr></thead>
  <tbody>
    <tr><td>Consulta la disponibilidad real antes de proponer una hora</td><td>Evita la cita que no existe</td></tr>
    <tr><td>Entiende que varios mensajes son una sola reserva</td><td>Evita la cita duplicada</td></tr>
    <tr><td>Deshace lo hecho si una operación falla a mitad</td><td>Evita el cliente sin cita y sin aviso</td></tr>
    <tr><td>Comprueba lo que va a decir contra tus datos</td><td>Evita precios y servicios inventados</td></tr>
    <tr><td>Recuerda la conversación entre días</td><td>Evita que el cliente abandone repitiéndose</td></tr>
    <tr><td>Sabe cuándo pasar a una persona</td><td>Urgencias, quejas y casos delicados</td></tr>
  </tbody>
</table>
</div>
<div class="destacado">
<p>Y una advertencia sobre las respuestas: <em>«sí, eso lo tenemos puesto en el prompt»</em>
   no es un sí. Significa que se lo han pedido al modelo. Lo que hay que preguntar es si
   está <strong>garantizado</strong> — es decir, si el sistema lo comprueba siempre, pase
   lo que pase en la conversación.</p>
</div>
<p>Si quieres ver cómo se traduce todo esto en precio, está en
   <a href="/es/cuanto-cuesta-un-asistente-ia.html">cuánto cuesta un asistente de IA</a>.</p>`
    }
  ],

  faq: [
    {
      q: '¿Por qué mi bot confirma citas que no existen?',
      r: `<p>Porque no tiene acceso a tu calendario. Un flujo dibujado responde según lo que
          alguien programó, no según lo que hay libre. Confirma porque es la salida más
          natural del diagrama, no porque haya comprobado nada.</p>`
    },
    {
      q: '¿Se puede arreglar un bot de flujos para que consulte la agenda?',
      r: `<p>No configurándolo mejor. Requiere una integración real con el calendario y la
          capacidad de interpretar la respuesta, que es lo que distingue una categoría de
          producto de otra. Se puede añadir con desarrollo a medida, pero entonces ya no
          estás pagando por un flujo.</p>`
    },
    {
      q: '¿Por qué mi bot vuelve a pedirme el nombre cada dos mensajes?',
      r: `<p>Porque no tiene memoria de la conversación más allá del mensaje actual, o la
          tiene sólo dentro de una sesión muy corta. Un asistente que agenda de verdad tiene
          que recordar entre días, no sólo entre mensajes.</p>`
    },
    {
      q: '¿Sirve conectar ChatGPT directamente a mi WhatsApp?',
      r: `<p>Conversa muy bien y ese no es el problema. El problema es que no puede reservar
          en tu agenda y que, sin restricciones, completa los datos que no tiene: precios,
          servicios y horarios que suenan bien y no son los tuyos. Además, hacerlo desde un
          número normal sin la API oficial acaba en bloqueo — está explicado en
          <a href="/es/whatsapp-api-vs-business.html">WhatsApp Business vs API</a>.</p>`
    },
    {
      q: '¿Cómo compruebo si el bot que me ofrecen agenda de verdad?',
      r: `<p>En la demostración, pídele una hora que sepas que está ocupada. Si te la
          confirma, no está consultando nada. Y pide confirmación dos veces seguidas a ver
          si aparecen dos citas.</p>`
    },
    {
      q: '¿Entonces los bots de flujo no sirven para nada?',
      r: `<p>Sí sirven, para lo suyo: responder preguntas frecuentes, dar una dirección, un
          horario o una lista de servicios. Si no necesitas agendar, son la opción barata y
          correcta. El problema no es la herramienta, es venderla como algo que no es.</p>`
    }
  ],

  relacionadas: [
    { href: '/es/cuanto-cuesta-un-asistente-ia.html',
      titulo: 'Cuánto cuesta un asistente de IA',
      nota: 'Qué se paga en cada uno de los tres niveles' },
    { href: '/es/whatsapp-api-vs-business.html',
      titulo: 'WhatsApp Business vs API',
      nota: 'Por qué bloquean números y qué es la ventana de 24 h' },
    { href: '/es/preguntas.html#puede-confirmar-una-cita-que-en-realidad-no-existe',
      titulo: 'Preguntas frecuentes',
      nota: '75 respuestas sobre agenda, precios y RGPD' }
  ],

  cta: {
    h2: 'Pruébalo con la hora ocupada',
    p: `En la demostración puedes pedir una hora que sepas que no está libre y ver qué
        contesta. Son 20 minutos, no cuesta nada y no se piden datos de pago.`,
    boton: 'Solicitar una demostración',
    botonSec: '📊 Calcular mi retorno'
  }
};
