/**
 * «precio chatbot clínica» · /es/cuanto-cuesta-un-asistente-ia.html
 * Origen: RAG §§ Los tres niveles, Planes y precios, Implementación, Límites.
 *
 * Ángulo: el PRECIO. La página hermana (por-que-los-bots-de-flujo-fallan)
 * cubre el mecanismo técnico del fallo. No deben solaparse en prosa.
 */
module.exports = {
  lang: 'es',
  ruta: 'es/cuanto-cuesta-un-asistente-ia.html',
  alterna: { lang: 'en', ruta: 'how-much-does-an-ai-assistant-cost.html' },
  publicado: '2026-08-05',
  actualizado: '2026-08-05',

  titulo: 'Cuánto cuesta un asistente de IA para clínicas en 2026 | Hachi',
  ogTitulo: 'Cuánto cuesta un asistente de IA para clínicas',
  descripcion: 'Por qué los presupuestos van de 29 € a más de 900 € al mes, qué se paga en cada nivel, qué cuesta montarlo por tu cuenta y cómo saber cuál te compensa con tus números.',
  migaFinal: 'Cuánto cuesta un asistente de IA',

  h1: 'Cuánto cuesta un asistente de IA para <em>clínicas</em>',
  entradilla: `Si estás pidiendo presupuestos te vas a encontrar cifras desde 29 € hasta
    más de 900 € al mes, todas descritas igual. No son lo mismo: son tres tecnologías
    distintas. Te contamos qué se paga en cada una, aunque parte juegue en nuestra contra.`,

  bloques: [
    {
      h2: 'La horquilla no es de calidad, es de categoría',
      html: `
<p>Cuando dos ofertas se describen igual y se llevan 800 € de diferencia, lo primero que
   uno piensa es que alguien está inflando el precio. A veces sí. Pero lo que suele haber
   detrás es que están vendiendo <strong>cosas distintas con el mismo nombre</strong>.</p>

<div class="tabla">
<table>
  <thead><tr><th>Nivel</th><th>Qué es</th><th>Cuota/mes</th><th>Implantación</th></tr></thead>
  <tbody>
    <tr><td><strong>1</strong></td><td>Flujos dibujados: si pulsa este botón, responde esto</td><td>29 – 199 €</td><td>0 – 300 €</td></tr>
    <tr><td><strong>2</strong></td><td>Asistentes que conversan pero no ejecutan</td><td>150 – 500 €</td><td>0 – 1.000 €</td></tr>
    <tr class="destacada"><td><strong>3</strong></td><td>Sistemas que conversan <em>y</em> ejecutan contra tu agenda</td><td>460 – 1.840 €</td><td>2.000 – 15.000 €</td></tr>
  </tbody>
</table>
</div>

<p>La frontera entre el nivel 2 y el 3 es un solo verbo: <strong>ejecutar</strong>. Un
   asistente de nivel 2 mantiene una conversación estupenda y termina diciendo «un
   compañero te confirmará la cita». El cliente ha tenido una buena experiencia y tu
   equipo sigue teniendo exactamente el mismo trabajo pendiente.</p>`
    },
    {
      h2: 'Qué estás pagando en cada nivel',
      html: `
<h3>Nivel 1 · 29 a 199 € al mes</h3>
<p>Un diagrama hecho a mano. Pagas la herramienta que te deja dibujarlo y el alojamiento.
   Es barato porque hay poco que mantener: no hay modelo de lenguaje consumiendo por uso,
   no hay integración con tu calendario y no hay nadie afinando nada.</p>
<p><strong>Cuándo es la opción correcta:</strong> si sólo necesitas responder cuatro
   preguntas frecuentes y no agendas nada, esto te sobra y es lo más sensato que puedes
   hacer con tu dinero. Te lo diríamos igual.</p>

<h3>Nivel 2 · 150 a 500 € al mes</h3>
<p>Aquí ya hay inteligencia artificial de verdad, y eso cuesta: cada respuesta consume
   procesamiento que se paga por uso. Pagas comprensión de lenguaje natural, no capacidad
   de actuar.</p>

<h3>Nivel 3 · 460 a 1.840 € al mes</h3>
<p>Todo lo del nivel 2 más el trabajo de conectar el sistema a tu calendario real y —esto
   es lo que de verdad cuesta— <strong>garantizar que lo que hace es correcto</strong>:
   que comprueba antes de prometer, que no duplica una reserva cuando el cliente insiste,
   que deshace lo hecho si una operación falla a mitad y que no completa datos que no
   tiene.</p>
<p>Ese trabajo no se ve en una demostración. Se nota a los seis meses, cuando no has
   tenido que revisar lo que dice.</p>`
    },
    {
      h2: 'Las cuatro preguntas que separan un nivel de otro',
      html: `
<p>Hazlas a cualquier presupuesto, incluido el nuestro. Si quien te atiende no sabe
   contestarlas con concreción, estás en el nivel 1 o en el 2 aunque el precio sea de
   nivel 3:</p>
<ol>
  <li><strong>¿Consulta la disponibilidad real antes de proponer una hora, o sólo lo
      parece?</strong></li>
  <li><strong>Si la reserva falla a mitad, ¿queda todo a medias o se deshace solo?</strong></li>
  <li><strong>¿Puede agendar dos veces la misma cita si el cliente insiste?</strong></li>
  <li><strong>Cuando no sabe un dato, ¿lo dice o se lo inventa?</strong></li>
</ol>
<div class="destacado">
<p>Una respuesta del tipo «eso lo tenemos configurado en el prompt» no es un sí. Significa
   que se lo han <em>pedido</em> al modelo, no que esté garantizado. Es la diferencia
   entre una instrucción que se puede pasar por alto un día raro y una comprobación que se
   ejecuta siempre.</p>
</div>`
    },
    {
      h2: '¿Y si lo monto yo con herramientas de automatización?',
      html: `
<p>Es la alternativa que más gente considera, y merece una respuesta honesta: para tareas
   mecánicas —si llega esto, manda aquello— las herramientas de automatización van muy
   bien y son baratas.</p>
<p>El problema aparece cuando lo que hay al otro lado es una conversación. Los datos no
   llegan ordenados ni completos: llegan a trozos, con cambios de opinión y preguntas por
   el medio. Y hay tres costes que no se ven al empezar:</p>
<ul>
  <li><strong>La API oficial de WhatsApp.</strong> Sin ella, mandar recordatorios desde un
      número normal acaba en bloqueo. Con ella, hay que gestionar plantillas y la ventana
      de 24 horas —lo explicamos en
      <a href="/es/whatsapp-api-vs-business.html">WhatsApp Business vs API</a>.</li>
  <li><strong>El mantenimiento.</strong> No es montarlo, es que siga bien: cambias un
      precio, añades un servicio, cambia un horario.</li>
  <li><strong>Los casos raros.</strong> El 90 % de las conversaciones son fáciles. El 10 %
      restante es donde se pierde el cliente, y es donde se va el tiempo de desarrollo.</li>
</ul>
<p>Sale a cuenta si tienes a alguien que lo mantenga y tu volumen es bajo. Deja de salir a
   cuenta en cuanto una cita mal agendada te cuesta más que la diferencia de precio.</p>`
    },
    {
      h2: 'El punto de comparación que casi nadie hace',
      html: `
<p>La pregunta habitual es «¿es caro?». La útil es «¿comparado con qué?».</p>
<ul>
  <li><strong>Frente a una persona:</strong> una recepcionista en España cuesta entre
      <strong>25.000 € y 35.000 € al año</strong> con costes de empresa, y libra, enferma y
      no cubre las noches ni los domingos — que es cuando entra buena parte de las
      consultas.</li>
  <li><strong>Frente a no hacer nada:</strong> ahí está el coste real, y es el que no
      aparece en ninguna factura. Los huecos que se caen sin avisar, los mensajes de las
      23:40 que se contestan a las 10:00 cuando esa persona ya ha escrito a tres sitios
      más, y los que preguntan el precio y nunca vuelven.</li>
</ul>

<h3>Cuántas citas salvadas cubren la cuota</h3>
<p>Con un ticket medio de 200 € y un <strong>margen de contribución del 65 %</strong>:</p>
<div class="tabla">
<table>
  <thead><tr><th>Cuota mensual</th><th>Citas salvadas al mes que la cubren</th></tr></thead>
  <tbody>
    <tr><td>149 €</td><td><strong>2</strong></td></tr>
    <tr><td>390 €</td><td><strong>3</strong></td></tr>
    <tr><td>690 €</td><td><strong>6</strong></td></tr>
    <tr><td>990 €</td><td><strong>8</strong></td></tr>
  </tbody>
</table>
</div>
<div class="destacado">
<p>Fíjate en que se cuenta el <strong>margen</strong> y no el ingreso. Una cita de 200 € no
   son 200 € de beneficio: consume producto y fungibles. Presentar el ingreso bruto como
   «ahorro» es el error más común en estas cuentas y lo primero que detecta cualquiera que
   sepa leer un balance.</p>
<p>Métela con tus propias cifras en la
   <a href="/es/calculadora.html">calculadora de retorno</a>. Verás las fórmulas enteras y
   el veredicto que salga, incluido el de que aún no llegas.</p>
</div>`
    },
    {
      h2: 'Qué mirar en la letra pequeña',
      html: `
<p>Antes de firmar, comprueba estos cinco puntos en cualquier oferta:</p>
<ol>
  <li><strong>Qué cuenta como «conversación».</strong> Si cuentan mensajes en vez de
      conversaciones de 24 horas, el mismo volumen te sale entre cinco y diez veces más
      caro.</li>
  <li><strong>Qué pasa si te pasas del límite.</strong> ¿Se factura el exceso o se corta el
      servicio? Que un cliente se quede sin respuesta por haber llegado al tope es lo
      contrario de lo que contrataste.</li>
  <li><strong>Qué incluye el mantenimiento.</strong> Cambiar un precio o añadir un servicio
      debería estar dentro. Si cada cambio se factura, el precio real no es el que te han
      dicho.</li>
  <li><strong>Cuándo se cobra la implantación.</strong> Lo razonable es que no se pague
      nada hasta terminar la prueba y decidir continuar.</li>
  <li><strong>Si hay permanencia.</strong> Un producto que funciona no la necesita.</li>
</ol>
<p>Para referencia, así están nuestros números: implantación de 290 € a 1.690 € según
   plan —menos de dos meses de cuota, y sólo si continúas—, conversaciones extra a 0,25 €,
   minutos extra a 0,20 €, sin permanencia y sin corte de servicio al superar el límite.
   Los planes completos están en <a href="/es/#precios">precios</a>.</p>`
    }
  ],

  faq: [
    {
      q: '¿Por qué unos cobran 99 € y otros 690 € por lo mismo?',
      r: `<p>Porque no es lo mismo. La oferta de 99 € suele ser un flujo dibujado que no
          puede consultar tu agenda; la de 690 € consulta la disponibilidad real y ejecuta
          la reserva. La pregunta que las separa no es el precio: es
          <strong>«¿comprueba antes de prometer una hora?»</strong>.</p>`
    },
    {
      q: '¿Hay asistentes de IA gratis para clínicas?',
      r: `<p>Hay planes gratuitos de herramientas de flujos, y sirven para responder cuatro
          preguntas frecuentes. Ninguno agenda contra tu calendario real, porque eso exige
          una integración que cuesta dinero mantener. Si lo que necesitas es informar, un
          gratuito puede bastarte.</p>`
    },
    {
      q: '¿Cuánto cuesta la implantación y por qué se cobra?',
      r: `<p>En nuestro caso de 290 € a 1.690 € según el plan, siempre menos de dos meses de
          cuota. No es una licencia que se activa: alguien carga tus servicios, precios y
          duraciones, conecta tu número y tu agenda, configura tus horarios reales y forma a
          tu equipo. Se cobra sólo si continúas tras la prueba, y se elimina si contratas un
          trimestre por adelantado.</p>`
    },
    {
      q: '¿Cuánto cuesta montarlo por mi cuenta?',
      r: `<p>En el mercado, montar un sistema que consulte tu agenda de verdad y ejecute las
          reservas está entre <strong>2.000 € y 15.000 €</strong>. Con herramientas de
          automatización puedes bajar mucho esa cifra inicial, pero el coste real no está en
          montarlo sino en mantenerlo y en cubrir los casos raros.</p>`
    },
    {
      q: '¿Qué cuenta como conversación?',
      r: `<p>Debería ser <strong>un cliente hablando contigo durante 24 horas</strong>, no
          cada mensaje. Si alguien escribe treinta mensajes en una tarde, eso es una
          conversación, no treinta. Conviene preguntarlo expresamente, porque cambia el
          precio real por un factor de cinco o diez.</p>`
    },
    {
      q: '¿Y si mi ticket medio es bajo?',
      r: `<p>Entonces hacen falta más citas salvadas para cubrir la cuota, y puede que no te
          compense el plan grande — o ninguno. Es una cuenta, no una opinión: hazla con tus
          números en la <a href="/es/calculadora.html">calculadora</a>. Si sale que no
          compensa, no compensa.</p>`
    }
  ],

  relacionadas: [
    { href: '/es/por-que-los-bots-de-flujo-fallan.html',
      titulo: 'Por qué los bots de flujo fallan',
      nota: 'Qué limita técnicamente al nivel 1' },
    { href: '/es/whatsapp-api-vs-business.html',
      titulo: 'WhatsApp Business vs API',
      nota: 'Un coste que casi nadie presupuesta' },
    { href: '/es/calculadora.html',
      titulo: 'Calculadora de retorno',
      nota: 'La cuenta con tus cifras, sin registro' }
  ],

  cta: {
    h2: 'Haz la cuenta antes de decidir',
    p: `Pon tu ticket, tus citas y tus ausencias reales y mira qué sale. Y si prefieres
        verlo funcionando con tus servicios y tus precios, la demostración son 20 minutos y
        no cuesta nada.`,
    boton: 'Solicitar una demostración',
    botonSec: '📊 Calcular mi retorno'
  }
};
