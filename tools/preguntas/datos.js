/**
 * Fuente única de la página /es/preguntas.html.
 *
 * De aquí salen a la vez el HTML visible y el JSON-LD (FAQPage), de modo que no
 * puedan divergir: es el fallo clásico de las páginas de preguntas frecuentes y
 * Google lo penaliza como marcado engañoso.
 *
 * Contenido derivado de docs/rag/hachi_espana_rag.txt (el mismo cuerpo de
 * conocimiento que usa el asistente), reescrito para lectura pública.
 *
 * REGLA DE PUBLICACIÓN: sólo espacio del problema. Nada de invariantes
 * enunciadas una por una, nada del método para derivarlas, nada de bugs
 * históricos. Se describe QUÉ garantiza el sistema, nunca CÓMO se construye.
 */

// `r` = respuesta en HTML (se permite <p>, <ul>, <li>, <strong>, <em>, <a>).
// El texto plano para el JSON-LD se deriva quitando etiquetas.

module.exports = [

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'Qué es Hachi y para quién',
  icono: '🐕',
  intro: 'Lo básico: qué hace, qué no hace y si encaja con tu negocio.',
  preguntas: [
    {
      q: '¿Qué es Hachi exactamente?',
      r: `<p>Un asistente de inteligencia artificial que atiende tu WhatsApp las 24 horas,
          <strong>consulta tu agenda real</strong> y reserva la cita. Después envía los
          recordatorios y, si alguien preguntó y desapareció, le vuelve a escribir.</p>
          <p>La diferencia con casi todo lo demás del mercado está en el verbo:
          no sólo <em>conversa</em>, también <em>ejecuta</em> contra tu calendario.</p>`
    },
    {
      q: '¿Es un chatbot?',
      r: `<p>No en el sentido habitual. Un chatbot de menús te hace pulsar «1 para pedir
          cita, 2 para precios» y se rompe en cuanto escribes algo que no estaba
          previsto. Hachi entiende lenguaje libre, en texto y en notas de voz, y cuando
          la conversación se pone delicada avisa a una persona de tu equipo en vez de
          seguir improvisando.</p>`
    },
    {
      q: '¿Sustituye a mi recepcionista?',
      r: `<p>No, y no lo vendemos así. Le quita de encima lo que se repite —precios,
          horarios, ubicación, aparcamiento, preparación previa— que es el 80 % de los
          mensajes. Tu equipo se dedica a quien ya está dentro de la clínica, que es
          donde se nota la diferencia.</p>`
    },
    {
      q: 'No soy una clínica, ¿me sirve igual?',
      r: `<p>Sí. Hachi no está hecho para un sector, está hecho para un problema: te
          escriben cuando no puedes contestar, y cuando contestas ya es tarde.</p>
          <p>Funciona en peluquería y barbería, estudios de tatuaje, veterinarias,
          talleres, academias, fotografía, asesorías y despachos. Cambian las palabras
          —donde dice «paciente» dirá «cliente»— y tu lista de servicios. Nada más.</p>`
    },
    {
      q: 'Trabajo solo, sin equipo. ¿Tiene sentido para mí?',
      r: `<p>Es justamente donde más se nota, porque no hay recepción que absorba los
          mensajes: o contestas tú o no contesta nadie. El
          <strong>plan Autónomo (149 €/mes)</strong> existe exactamente para eso —una
          agenda, un número— y no hay un mínimo por debajo del cual no te atendamos.</p>`
    },
    {
      q: '¿Necesito tener una sociedad?',
      r: `<p>No. Facturamos a tu NIF de autónomo sin ningún problema, y la factura lleva
          IVA español y es deducible como la de cualquier otro proveedor.</p>`
    },
    {
      q: '¿Cuándo NO tiene sentido contratar Hachi?',
      r: `<p>Preferimos decirlo antes que venderte algo que no vas a aprovechar. No
          compensa si <strong>no trabajas con cita previa</strong>, si recibes
          <strong>muy pocos mensajes al mes</strong> (perder tres mensajes no paga una
          cuota) o si <strong>WhatsApp no es tu canal</strong> porque vendes en tienda
          física o por teléfono.</p>`
    },
    {
      q: '¿En qué sectores tenéis más rodaje?',
      r: `<p>Medicina estética —el principal—, clínica dental, spa y bienestar, y otros
          centros de salud y terapias: fisioterapia, nutrición, psicología, podología,
          logopedia. También profesionales independientes y negocios con cita previa
          fuera de la salud. La lista es dónde tenemos horas de vuelo, no a quién
          aceptamos.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'Precios, planes y facturación',
  icono: '💶',
  intro: 'Todos los importes en euros, IVA no incluido y sin permanencia.',
  preguntas: [
    {
      q: '¿Cuánto cuesta Hachi al mes?',
      r: `<p>Cinco planes: <strong>Autónomo 149 €</strong>, <strong>Esencial 390 €</strong>,
          <strong>Profesional 690 €</strong>, <strong>Clínica Completa 990 €</strong> y
          <strong>Multi-sede desde 1.690 €</strong> al mes. Sin permanencia: la cuota es
          mensual y te das de baja cuando quieras.</p>
          <p>Puedes verlos en detalle en <a href="/es/#precios">planes y precios</a>.</p>`
    },
    {
      q: '¿Qué incluye cada plan?',
      r: `<ul>
            <li><strong>Autónomo (149 €)</strong> — WhatsApp 24/7, agenda real,
                cancelaciones y reagendamientos, recordatorios, 250 conversaciones/mes.</li>
            <li><strong>Esencial (390 €)</strong> — lo anterior más varias agendas o
                profesionales, panel completo con métricas, 750 conversaciones/mes.</li>
            <li><strong>Profesional (690 €)</strong> — más atención telefónica con voz de
                IA que agenda durante la llamada, 1.500 conversaciones y 400 minutos.</li>
            <li><strong>Clínica Completa (990 €)</strong> — más seguimiento proactivo,
                campañas de WhatsApp y llamadas salientes, 3.000 conversaciones y
                800 minutos.</li>
            <li><strong>Multi-sede (desde 1.690 €)</strong> — varias sedes en una cuenta,
                marca propia y reventa.</li>
          </ul>`
    },
    {
      q: '¿Hay coste de implantación?',
      r: `<p>Sí, un pago único que va de <strong>290 € a 1.690 €</strong> según el plan
          —menos de dos meses de cuota en todos los casos—. Cubre cargar tus servicios,
          precios y duraciones, conectar tu número de WhatsApp y tu agenda, configurar
          tus horarios reales, ajustar el tono de tu marca y formar a tu equipo.</p>
          <p><strong>No se cobra hasta que decides continuar</strong> tras la prueba
          gratuita, y se elimina por completo si contratas un trimestre por adelantado.</p>`
    },
    {
      q: '¿Cuándo se paga la primera vez?',
      r: `<p>Al final, y sólo si dices que sí. En orden: la videollamada de demostración
          cuesta <strong>0 €</strong>, la configuración de tu asistente
          <strong>0 €</strong>, los 7 días de prueba <strong>0 €</strong>. Si decides
          continuar, ahí aparecen la implantación (una vez) y la primera cuota. Si
          decides no continuar, <strong>0 €</strong>. No se pide tarjeta para probar.</p>`
    },
    {
      q: '¿Cuántas citas salvadas al mes hacen falta para que se pague solo?',
      r: `<p>Con un ticket medio de 200 € y un <strong>margen de contribución del 65 %</strong>:
          2 citas para Autónomo, 3 para Esencial, 6 para Profesional y 8 para
          Clínica Completa. Con un ticket de 400 €, la mitad en cada caso.</p>
          <p>Se cuenta el margen y no el ingreso a propósito: una cita de 200 € no son
          200 € de beneficio, porque consume producto y fungibles. Puedes hacer la
          cuenta con tus propios números en la
          <a href="/es/calculadora.html">calculadora de retorno</a>.</p>`
    },
    {
      q: '¿Qué cuenta como «conversación»?',
      r: `<p>Un cliente hablando contigo durante <strong>24 horas</strong>, no cada
          mensaje. Si alguien escribe treinta mensajes en una tarde resolviendo dudas y
          agendando, eso es <strong>una sola conversación</strong>.</p>
          <p>Por eso los números cunden más de lo que parece: una clínica que recibe
          «20 mensajes al día» suele estar en 150-250 conversaciones al mes, no 600.</p>`
    },
    {
      q: '¿Qué pasa si me paso del límite del plan?',
      r: `<p><strong>No se corta el servicio.</strong> Ningún cliente tuyo se queda sin
          respuesta por haber llegado al tope: sería lo contrario de lo que
          contrataste.</p>
          <p>Las conversaciones de más se facturan a <strong>0,25 €</strong> cada una y
          los minutos de llamada a <strong>0,20 €</strong>, detallados línea a línea en
          la factura. Si te pasas dos meses seguidos te avisamos y te proponemos subir de
          plan, que casi siempre sale más barato que pagar el exceso.</p>`
    },
    {
      q: '¿Por qué hay un límite de conversaciones?',
      r: `<p>No es un tope artificial para empujarte al plan de arriba. Cada respuesta
          consume procesamiento de IA, que se paga por uso; el proveedor de WhatsApp
          cobra por mensaje; y hay alojamiento, guardado del historial y trabajo humano
          de mantenimiento detrás.</p>
          <p>Una precisión que casi nadie cuenta bien: <strong>responder dentro de las
          24 horas siguientes al mensaje del cliente no le cuesta nada a Meta</strong>.
          Lo que se paga son los mensajes que iniciamos nosotros —recordatorios y
          campañas—. El límite dimensiona el servicio, no cubre una tarifa de Meta.</p>`
    },
    {
      q: '¿Puedo cambiar de plan?',
      r: `<p>Sí, subir o bajar cuando quieras; se aplica en la siguiente factura. Al
          principio es normal no acertar: empezamos por lo que estimes y a los dos meses
          hay datos reales de tu negocio para ajustarlo.</p>`
    },
    {
      q: '¿Hay permanencia?',
      r: `<p>No. La cuota es mensual y la baja se pide antes de la fecha de renovación,
          sin penalización. Sólo hay descuento si <em>tú</em> eliges pagar por trimestre.</p>`
    },
    {
      q: '¿Cómo se paga y qué factura recibo?',
      r: `<p>Tarjeta de crédito o débito, domiciliación bancaria SEPA o PayPal, siempre
          <strong>en euros</strong>: en tu extracto no aparece ninguna comisión de cambio
          de divisa ni cargo internacional.</p>
          <p>Recibes factura con IVA español, deducible, a nombre de tu sociedad o de tu
          NIF de autónomo, emitida automáticamente cada mes. Si tienes NIF-IVA
          intracomunitario, la pasarela aplica lo que corresponda al introducirlo.</p>`
    },
    {
      q: '¿Puedo revender Hachi con mi marca?',
      r: `<p>Sí, es el plan <strong>Multi-sede / Marca Blanca</strong>, desde 1.690 €/mes.
          Varias sedes o empresas en una sola cuenta sin mezclarse entre sí, el panel y
          la comunicación con tu marca, agentes personalizados ilimitados y soporte
          prioritario. Tú decides qué le cobras a cada cliente tuyo: el margen es
          tuyo.</p>
          <p>El precio final depende del número de sedes y del volumen, así que se ve
          caso por caso en una llamada.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'La demostración y la prueba',
  icono: '🎬',
  intro: 'Son dos cosas distintas y las dos son gratuitas. Es la confusión más habitual.',
  preguntas: [
    {
      q: '¿Qué diferencia hay entre la demo y la prueba?',
      r: `<p>La <strong>demostración</strong> son 20 minutos por videollamada viéndolo con
          nosotros. La <strong>prueba</strong> son 7 días usándolo tú, con tus clientes
          reales. Primero una, luego la otra, y el primer pago sólo si decides quedarte.</p>`
    },
    {
      q: '¿La demo es gratis? ¿Me piden tarjeta?',
      r: `<p>Gratis y sin compromiso, y no se piden datos de pago. Tampoco para empezar
          los 7 días de prueba.</p>`
    },
    {
      q: '¿Cuánto dura la demostración?',
      r: `<p>20 minutos. Te enseñamos Hachi atendiendo un WhatsApp, consultando la agenda
          y cerrando una cita real, y enviando un recordatorio. Resolvemos tus dudas y
          vemos qué plan te encaja.</p>`
    },
    {
      q: 'Durante la prueba, ¿es un simulacro o atiende de verdad?',
      r: `<p>De verdad. Antes montamos tu asistente con tus servicios, tus precios, tu
          número y tu agenda —de 3 a 5 días laborables— y durante esos 7 días atiende a
          tus clientes reales. Tú ves cada conversación, cada cita agendada y cada
          recordatorio enviado.</p>`
    },
    {
      q: '¿Sólo 7 días de prueba? Otros dan un mes',
      r: `<p>Siete días con tu negocio funcionando de verdad dan para verlo claro. Y
          seremos francos con el motivo: no te damos una demo de juguete, te montamos el
          asistente completo, y eso son días de trabajo de nuestro equipo <em>antes</em>
          de que empiece la prueba. Un mes gratis significaría hacer ese trabajo a cambio
          de nada muchas veces, y acabaríamos compensándolo subiéndole el precio a todo
          el mundo.</p>`
    },
    {
      q: 'Si al terminar la prueba no me convence, ¿qué pago?',
      r: `<p>Nada. Ni la configuración, ni la implantación, ni la cuota. No se cobra nada
          hasta que decides continuar.</p>`
    },
    {
      q: '¿Cómo agendo una demostración?',
      r: `<p>Desde el <a href="/es/#contacto">formulario de contacto</a> de la web, o
          escribiendo por WhatsApp. Fuera del horario comercial te atiende el propio
          asistente y te la agenda — que es, de paso, la mejor demostración posible.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'WhatsApp: la API, tu número y la ventana de 24 horas',
  icono: '📱',
  intro: 'La parte que peor se explica en el sector, y la que más disgustos da cuando se descubre tarde.',
  preguntas: [
    {
      q: '¿Qué diferencia hay entre WhatsApp Business y WhatsApp Business API?',
      r: `<p>Son dos productos distintos. La <strong>app</strong> de WhatsApp Business (la
          gratuita del móvil) está pensada para un negocio que <em>responde</em>. La
          <strong>API</strong> es la vía oficial de Meta para empresas que además
          <em>escriben primero</em> y trabajan a volumen.</p>
          <ul>
            <li><strong>Dónde se usa:</strong> la app en el móvil; la API desde el
                ordenador, en un panel web.</li>
            <li><strong>Quién responde:</strong> en la app, una persona a mano; en la API,
                tu equipo y el asistente a la vez.</li>
            <li><strong>Escribir primero:</strong> en la app, riesgo de bloqueo; en la
                API, permitido con plantilla aprobada.</li>
            <li><strong>Historial:</strong> en la app, sólo en ese móvil; en la API,
                centralizado y con buscador.</li>
          </ul>`
    },
    {
      q: '¿Por qué me pueden bloquear el número usando WhatsApp Business normal?',
      r: `<p>Porque la app no está hecha para iniciar conversaciones. Si empiezas a mandar
          mensajes a clientes que no te han escrito ese día, o muchos seguidos, WhatsApp
          lo interpreta como spam: primero te limita el envío, luego te suspende el
          número temporalmente y, si se repite, te lo bloquea de forma permanente.</p>
          <p>Y ese número suele ser <strong>el de toda la vida</strong>, el que está en
          Google, en tu web y en tus tarjetas.</p>`
    },
    {
      q: '¿Puedo usar mi número de siempre?',
      r: `<p>Sí, pero conviene decidirlo a sabiendas, porque hay una regla de Meta que lo
          condiciona todo: <strong>un número puede estar en la app de WhatsApp Business
          O en la API, nunca en las dos a la vez</strong>.</p>
          <p>Hay dos caminos y los explicamos enteros en las dos preguntas siguientes.</p>`
    },
    {
      q: 'Camino A: número nuevo. ¿Qué implica?',
      r: `<p>Una SIM nueva para la API. Tu WhatsApp Business de siempre
          <strong>se queda intacto en el móvil</strong>, con todos sus chats y contactos.
          Riesgo cero y listo en el mismo plazo que el resto de la implementación.</p>
          <p>La pega: es un número distinto del que está en tu web, en Google y en tus
          tarjetas, así que hay que empezar a publicarlo o redirigir. Es lo que
          recomendamos a casi todo el mundo, sobre todo si tu WhatsApp actual tiene años
          de historial.</p>`
    },
    {
      q: 'Camino B: migrar mi número. ¿Pierdo el historial y los contactos?',
      r: `<p>Sí, y esto es lo que casi nadie cuenta hasta que es tarde:
          <strong>al migrar el número a la API, el historial de chats y los contactos que
          viven en la app del móvil dejan de estar accesibles</strong>. La API arranca
          limpia. Ese número deja de funcionar en la app y con él se va el acceso a esas
          conversaciones desde el panel nuevo.</p>
          <p>Quien te diga «tú tranquilo, conectamos tu WhatsApp Business y ya» no te está
          contando esto. Lo descubrirías el día que busques la conversación de un cliente
          de hace ocho meses y no esté.</p>`
    },
    {
      q: '¿Se puede rescatar lo anterior antes de migrar?',
      r: `<p>Sí, pero hay que hacerlo <strong>antes</strong> de migrar y es un trabajo
          aparte: rescatar la agenda de contactos y el histórico de conversaciones,
          ordenarlos y cargarlos en el sistema nuevo.</p>
          <p>Eso no es automatización, es trabajo de base de datos: se hace caso por caso
          según cuántos contactos y cuánto historial tengas, y por eso
          <strong>se presupuesta aparte</strong>, después de mirar qué hay. Te lo decimos
          antes de empezar, nunca después.</p>`
    },
    {
      q: '¿Cómo decido entre número nuevo y migrar?',
      r: `<p>Con dos preguntas:</p>
          <ol>
            <li><strong>¿El número que usas ahora está publicado en tu web, en Google y en
                tus anuncios?</strong> Si no lo está, ve a número nuevo sin pensarlo más.</li>
            <li><strong>¿Necesitas seguir consultando conversaciones antiguas?</strong> Si
                no las miras nunca, migra sin rescate. Si las consultas a menudo, compensa
                el rescate previo.</li>
          </ol>`
    },
    {
      q: '¿Qué es la ventana de 24 horas?',
      r: `<p>Meta permite escribir libremente al cliente durante las
          <strong>24 horas siguientes a su último mensaje</strong>. Pasado ese plazo ya no
          se puede mandar un mensaje libre: sólo una
          <strong>plantilla aprobada previamente por Meta</strong>.</p>
          <p>En tu día a día: alguien escribe a las 22:00 y Hachi le responde con total
          libertad durante las 24 horas siguientes. Si no vuelve a escribir en tres días
          y quieres recuperarlo, ya está fuera de la ventana, así que se le escribe con
          plantilla; en cuanto contesta se abre otra ventana y la conversación vuelve a
          ser libre.</p>`
    },
    {
      q: '¿Tengo que estar pendiente de la ventana de 24 horas?',
      r: `<p>No. El sistema sabe si la persona está dentro o fuera de la ventana y elige
          solo entre mensaje libre y plantilla. Nosotros preparamos y enviamos a aprobar
          las plantillas que necesites —recordatorios, seguimientos, campañas—; Meta suele
          aprobarlas en 24-48 horas.</p>
          <p>Es, por cierto, la razón por la que un bot casero acaba fallando: sin API
          oficial y sin gestión de plantillas, el mensaje sencillamente no sale.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'Cómo agenda las citas',
  icono: '📅',
  intro: 'La parte que separa a un asistente que conversa de uno que además ejecuta.',
  preguntas: [
    {
      q: '¿Consulta mi agenda de verdad antes de proponer una hora?',
      r: `<p>Sí, siempre. Nunca ofrece una hora sin haber mirado tu disponibilidad real, y
          si no hay hueco propone alternativas que sí existen.</p>
          <p>Es la pregunta que separa los tres niveles del mercado: un flujo dibujado
          <em>no puede</em> consultar tu agenda. No es que lo haga mal, es que no tiene
          forma de hacerlo.</p>`
    },
    {
      q: '¿Puede confirmar una cita que en realidad no existe?',
      r: `<p>No. Esa comprobación es código que se ejecuta siempre, no una instrucción
          escrita en el prompt que el modelo pueda pasar por alto un día que le pillen con
          una frase rara. Es exactamente la diferencia que estás pagando frente a una
          oferta de 29 €.</p>`
    },
    {
      q: 'Si el cliente insiste tres veces, ¿acabo con tres citas?',
      r: `<p>No. Los datos llegan a trozos —«el jueves»… «a las 11»… «me llamo Marta»… el
          teléfono al final— y una automatización normal, con cada mensaje nuevo, o vuelve
          a empezar o crea una cita repetida. Hachi entiende que sigue siendo la misma
          reserva y la completa sin duplicar.</p>`
    },
    {
      q: '¿Qué pasa si la reserva falla a mitad?',
      r: `<p>Se deshace sola. Si al reagendar se cancela la cita vieja y falla la creación
          de la nueva, el sistema revierte el cambio en lugar de dejarlo a medias. Tu
          cliente no se queda sin cita por un error interno.</p>`
    },
    {
      q: '¿Puede cancelar y reagendar sin que intervenga mi equipo?',
      r: `<p>Sí, las dos cosas, y la agenda queda actualizada. Nadie tiene que rematar la
          faena a mano.</p>`
    },
    {
      q: '¿Funciona con varias agendas o varios profesionales?',
      r: `<p>Sí, desde el plan Esencial: agendas independientes por sede o por profesional,
          cada una con sus horarios, sus servicios y sus duraciones. El asistente sabe a
          cuál corresponde cada cita. También se configuran duración, tiempo de
          preparación y abono por tratamiento.</p>`
    },
    {
      q: '¿Se acuerda de lo que le dije antes?',
      r: `<p>Sí, entre días, no sólo dentro del mismo mensaje. Si ya diste tu nombre no te
          lo vuelve a pedir, y si dijiste que te interesa un tratamiento concreto lo tiene
          presente veinte mensajes después. Un chatbot de menús te obliga a repetirlo
          todo, y eso es justo lo que hace que la gente abandone.</p>`
    },
    {
      q: '¿Puede agendar por teléfono, no sólo por WhatsApp?',
      r: `<p>Sí, desde el plan Profesional. Si nadie coge el teléfono en recepción, Hachi lo
          coge con voz natural, consulta la disponibilidad real y <strong>cierra la cita
          durante la propia llamada</strong>. Cada llamada queda registrada con su
          transcripción y su resumen en el panel.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'Ausencias, seguimiento y campañas',
  icono: '🔔',
  intro: 'Lo que pasa antes y después de la cita, que es donde se pierde el dinero.',
  preguntas: [
    {
      q: '¿Cómo reduce las ausencias?',
      r: `<p>Con recordatorios automáticos antes de cada cita —por ejemplo una semana,
          24 horas y 2 horas antes; tú decides cuántos y cuándo—. El cliente confirma o
          cancela respondiendo al recordatorio y la agenda se actualiza sola.</p>
          <p>Lo importante no es sólo que aparezca más gente: es que
          <strong>quien cancela lo hace con tiempo</strong> y ese hueco se puede volver a
          vender en vez de perderse.</p>`
    },
    {
      q: '¿Cuánto se reducen las ausencias en la práctica?',
      r: `<p>El efecto que se atribuye a los recordatorios con confirmación está en el
          rango del <strong>40 % al 60 %</strong>. Nosotros usamos el 40 % —el extremo
          bajo— en todos nuestros cálculos, y en la
          <a href="/es/calculadora.html">calculadora</a> ese número está en un
          deslizador para que puedas bajarlo y ver qué pasa. Es un supuesto, no una
          promesa.</p>`
    },
    {
      q: '¿Qué es el seguimiento proactivo?',
      r: `<p>Si alguien preguntó por un servicio y desapareció, Hachi le vuelve a escribir
          a los días con un mensaje personalizado según lo que preguntó. No es un
          recordatorio genérico: retoma su conversación por donde se quedó. Disponible
          desde el plan Clínica Completa.</p>
          <p>Es, con diferencia, lo más caro que le pasa a un negocio con cita previa:
          preguntan el precio, se lo piensan y nunca vuelven.</p>`
    },
    {
      q: '¿Hachi va a escribir a gente que no me ha escrito nunca?',
      r: `<p><strong>No, y no es una promesa comercial: es cómo está construido.</strong>
          El asistente sólo responde a quien ha escrito antes, y el seguimiento actúa
          únicamente sobre conversaciones que esa persona abrió ella misma. Si alguien
          nunca te ha escrito, Hachi no tiene forma de contactarle.</p>
          <p>El primer mensaje siempre lo da tu cliente. Hachi retoma conversaciones, no
          las inicia. La única excepción son las campañas que lanzas tú a tu propia
          lista.</p>`
    },
    {
      q: '¿Qué son las campañas de WhatsApp?',
      r: `<p>Envíos a tu base de clientes con plantillas oficiales aprobadas por Meta —no
          envíos masivos irregulares—, segmentables por tipo de cliente, servicio o última
          visita. Disponibles desde el plan Clínica Completa.</p>
          <p>Y lo importante: <strong>quien responde entra directamente en conversación con
          el asistente</strong>, que le resuelve las dudas y le agenda. Mandar la promoción
          es fácil; lo difícil es atender a los cincuenta que contestan a la vez.</p>`
    },
    {
      q: '¿Clasifica las conversaciones?',
      r: `<p>Sí, solo: interesado en un servicio concreto, cita agendada, pendiente de
          responder, cliente antiguo. Tu equipo entra y ve de un vistazo qué hay que
          atender, y esas mismas etiquetas sirven para segmentar campañas.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'Comparar presupuestos: por qué hay ofertas de 99 € y de 900 €',
  icono: '⚖️',
  intro: 'Te lo contamos entero aunque parte juegue en nuestra contra, porque es la única forma de que compares con criterio.',
  preguntas: [
    {
      q: '¿Por qué hay tanta diferencia de precio entre unas ofertas y otras?',
      r: `<p>Porque bajo la misma descripción —«un asistente de IA que atiende tu WhatsApp
          y agenda citas»— conviven <strong>tres tecnologías distintas</strong>:</p>
          <ul>
            <li><strong>Nivel 1 · Flujos dibujados (29-199 €/mes).</strong> Un diagrama
                hecho a mano. No entiende, reconoce patrones. Su límite no es de calidad,
                es de capacidad: <em>no puede consultar tu agenda</em>.</li>
            <li><strong>Nivel 2 · Asistentes que conversan (150-500 €/mes).</strong> IA de
                verdad: entiende, informa, cualifica. Lo que le falta es
                <em>ejecutar</em>: termina diciendo «un compañero te confirmará la cita».</li>
            <li><strong>Nivel 3 · Sistemas que conversan Y ejecutan (460-1.840 €/mes).</strong>
                Consultan la disponibilidad real, reservan, cancelan, reagendan y responden
                del resultado. <strong>Aquí está Hachi.</strong></li>
          </ul>`
    },
    {
      q: '¿Qué cuatro preguntas debería hacerle a cualquier presupuesto?',
      r: `<p>Incluido el nuestro. Si quien te atiende no sabe contestarlas con concreción,
          estás en el nivel 1 o 2:</p>
          <ol>
            <li>¿Consulta la disponibilidad real antes de proponer una hora, o sólo lo
                parece?</li>
            <li>Si la reserva falla a mitad, ¿queda todo a medias o se deshace solo?</li>
            <li>¿Puede agendar dos veces la misma cita si el cliente insiste?</li>
            <li>Cuando no sabe un dato, ¿lo dice o se lo inventa?</li>
          </ol>`
    },
    {
      q: 'Si Hachi es de nivel 3, ¿por qué cuesta menos que su nivel?',
      r: `<p>Porque preferimos crecer con clientes que se queden. Todos los planes están
          por debajo del rango de su nivel: el más completo son 990 €/mes cuando el
          mercado de nivel 3 llega a 1.840 €, y la implantación más cara son 1.690 €
          cuando ese rango empieza en 2.000 €.</p>
          <p>Lo que no vamos a hacer es competir con el nivel 1 en precio.</p>`
    },
    {
      q: '¿Cuándo es el nivel 1 la opción correcta?',
      r: `<p>Si sólo necesitas responder cuatro preguntas frecuentes y no agendas nada, un
          flujo dibujado te sobra y es lo más sensato. Te lo diríamos igual — es una
          herramienta más barata que hace bien otra cosa.</p>`
    },
    {
      q: '¿Y las automatizaciones tipo Zapier, Make o n8n?',
      r: `<p>Esas herramientas encadenan pasos fijos: si pasa A, haz B. Sirven muy bien
          para tareas mecánicas. Una conversación con un cliente no lo es: hay dudas,
          cambios de opinión, objeciones y datos que faltan y llegan a trozos.</p>`
    },
    {
      q: '¿Puede inventarse un precio o un servicio que no ofrezco?',
      r: `<p>Un modelo sin restricciones completa lo que no sabe, porque para eso está
          entrenado: suena convincente y es falso. En Hachi la respuesta se comprueba
          contra <strong>tu información real</strong> antes de enviarse, y si el dato no
          está, lo dice y ofrece pasar la conversación a una persona.</p>
          <p>No es una preocupación teórica: hay empresas condenadas a indemnizar a
          clientes por lo que les prometió su chatbot.</p>`
    },
    {
      q: 'Ya probé un chatbot y fue un desastre. ¿Por qué iba a ser distinto?',
      r: `<p>Es lo más habitual que nos cuentan, y con razón: los chatbots de menús
          frustran. Por eso la prueba son 7 días con tus servicios y tus precios reales,
          antes de decidir nada. Si no te convence, no continúas y no pagas.</p>`
    },
    {
      q: 'Es caro para mi negocio',
      r: `<p>Comparado con contratar a una persona para atender WhatsApp mañana, tarde,
          noche y fines de semana, es una fracción: una recepcionista en España cuesta
          entre <strong>25.000 € y 35.000 € al año</strong> con costes de empresa, y
          libra.</p>
          <p>Y si de verdad no te cuadran los números, te lo decimos. Haz la cuenta con
          los tuyos en la <a href="/es/calculadora.html">calculadora</a>: está preparada
          para decirte que todavía no te compensa, y si sale así lo dice.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'Protección de datos y RGPD',
  icono: '🔒',
  intro: 'Tratas datos personales y, en sanidad, de categoría especial. Esto no es una casilla que marcar.',
  preguntas: [
    {
      q: '¿Quién es responsable y quién encargado del tratamiento?',
      r: `<p><strong>Tú eres el responsable</strong>: son tus clientes y tus datos, y tú
          decides para qué se usan. <strong>Hachi es el encargado</strong>: tratamos esos
          datos por cuenta tuya, sólo para prestarte el servicio y siguiendo tus
          instrucciones.</p>`
    },
    {
      q: '¿Firmáis el contrato de encargado de tratamiento?',
      r: `<p>Sí, el que exige el <strong>artículo 28 del RGPD</strong>, antes de empezar.
          Va con el detalle de qué datos se tratan, con qué proveedores, dónde se alojan y
          cuánto tiempo se conservan. Si tu asesoría jurídica necesita revisarlo o añadir
          condiciones, nos lo mandas y lo vemos antes de firmar. Es habitual.</p>`
    },
    {
      q: '¿Puede Hachi mandar mensajes sin consentimiento?',
      r: `<p>No. El asistente sólo responde a quien ha escrito antes. La única excepción
          son las campañas que lanzas tú, y ahí manda esto: <strong>la lista la aportas
          tú</strong> (Hachi no compra, no busca ni deduce números), <strong>el
          consentimiento es tuyo</strong> como responsable de esos datos, y
          <strong>Meta también lo controla</strong> exigiendo plantilla aprobada. Si Meta
          la rechaza, no sale.</p>
          <p>Nuestra recomendación: manda campañas sólo a quien te dio su número para que
          le escribieras, y guarda constancia de cuándo y cómo te lo dio.</p>`
    },
    {
      q: 'Trato datos de salud. ¿Eso cambia algo?',
      r: `<p>Son <strong>categoría especial</strong> (art. 9 RGPD) y merecen más cuidado,
          no menos. Por eso Hachi trabaja con la conversación —lo que el cliente escribe
          para pedir cita— y <strong>no necesita tu historia clínica</strong>: no hay que
          volcarla en ningún sitio. Cuanto menos dato entre, mejor, y se puede limitar qué
          se guarda y durante cuánto.</p>`
    },
    {
      q: '¿Qué pasa si un cliente mío ejerce sus derechos?',
      r: `<p>Acceso, rectificación, supresión, oposición y portabilidad: nos lo trasladas y
          lo atendemos dentro del plazo legal, incluida la <strong>eliminación
          completa</strong> de sus datos y sus conversaciones.</p>`
    },
    {
      q: '¿Dónde se guardan los datos y durante cuánto tiempo?',
      r: `<p>La ubicación de los servidores, la lista concreta de proveedores que
          intervienen, los plazos exactos de conservación y las transferencias
          internacionales están detallados en el contrato de encargado de tratamiento, que
          se entrega y se firma antes de empezar. Si necesitas verlo antes de decidir,
          pídelo en la demostración.</p>`
    },
    {
      q: '¿Pierdo el control de lo que dice el asistente?',
      r: `<p>Al contrario. Desde el panel editas cómo responde, qué precios da, qué
          servicios ofrece y <strong>qué no debe decir nunca</strong>. Tu equipo ve todas
          las conversaciones en tiempo real y puede entrar en cualquier momento.</p>`
    },
    {
      q: '¿Y si el cliente nota que es un asistente y se molesta?',
      r: `<p>Habla con naturalidad y con el tono de tu marca. Y en cuanto la conversación
          se pone delicada —una urgencia, una queja seria, alguien que pide hablar con una
          persona— avisa a tu equipo y le pasa la conversación con todo el contexto. Nadie
          se queda atrapado hablando con una máquina.</p>`
    }
  ]
},

// ─────────────────────────────────────────────────────────────────
{
  seccion: 'Implementación, requisitos y soporte',
  icono: '🛠️',
  intro: 'Qué necesitas tener, cuánto tarda y qué pasa después.',
  preguntas: [
    {
      q: '¿Cuánto se tarda en tenerlo funcionando?',
      r: `<p>De <strong>3 a 5 días laborables</strong> desde que nos pasas tu lista de
          servicios y precios. La prueba de 7 días empieza en cuanto está montado.</p>`
    },
    {
      q: '¿Qué necesitáis de mí?',
      r: `<ol>
            <li><strong>Una decisión sobre el número</strong>: SIM nueva o migrar el de
                siempre. Si aún no tienes WhatsApp Business API, la tramitamos nosotros.</li>
            <li><strong>Tu lista de servicios y precios</strong>, tal como se la das a un
                cliente. Un PDF, un Excel o incluso capturas: nosotros lo estructuramos.</li>
            <li><strong>Tus horarios</strong> y cuántas citas caben por franja.</li>
            <li><strong>Los datos de tu negocio</strong>: dirección exacta, lo que sí
                ofreces y lo que no.</li>
          </ol>`
    },
    {
      q: '¿Tengo que instalar algo o cambiar de programa de gestión?',
      r: `<p>No hace falta instalar nada —la API se usa desde el navegador—, no hace falta
          cambiar de software de gestión, no hace falta que nadie esté pendiente del móvil
          y no hace falta que nadie de tu equipo sepa de tecnología.</p>
          <p>Hachi puede trabajar con su propia agenda o sincronizarse con la que ya usas;
          eso se ve en la demostración según el programa que tengas.</p>`
    },
    {
      q: '¿El mantenimiento se paga aparte?',
      r: `<p>No, va incluido en la cuota. Cambios de precios todas las veces que haga
          falta, añadir o quitar servicios y duraciones, cambios de horarios, agendas,
          profesionales y festivos, ajustes del comportamiento de los agentes, cambios en
          los recordatorios y <strong>todas las mejoras de la plataforma</strong>. No hay
          una factura sorpresa cada vez que cambias algo.</p>`
    },
    {
      q: '¿Puedo cambiar cosas yo mismo?',
      r: `<p>Sí: precios, textos, horarios y comportamiento de cada agente están a mano en
          el panel, y hay un <strong>simulador</strong> para probar cualquier cambio en una
          conversación de prueba antes de que lo vea un cliente real. Si prefieres que lo
          dejemos hecho nosotros, nos escribes y los cambios habituales quedan resueltos en
          24-48 horas laborables.</p>`
    },
    {
      q: '¿Qué se presupuesta aparte?',
      r: `<p>Sólo dos cosas: integraciones a medida con software de gestión que no esté ya
          soportado, y desarrollos específicos que no formen parte del producto. En ambos
          casos te pasamos presupuesto cerrado antes de hacer nada. Y el rescate de
          contactos e historial si eliges migrar tu número.</p>`
    },
    {
      q: '¿Qué pasa si algo falla?',
      r: `<p>Monitorizamos el servicio de forma automática y nos enteramos antes que tú.
          Una incidencia grave —el asistente no responde, se cae la conexión de WhatsApp—
          se atiende de inmediato en horario laboral. Los planes Multi-sede tienen soporte
          prioritario.</p>`
    },
    {
      q: '¿Cómo compruebo que está funcionando?',
      r: `<p>En el panel ves cada cita agendada por Hachi, cada recordatorio enviado y cada
          conversación recuperada, además del estado del servicio. No hay que creerse
          nada: los números están ahí.</p>`
    },
    {
      q: '¿Cuál es vuestro horario de atención?',
      r: `<p>Atención comercial de <strong>lunes a viernes de 09:00 a 19:00</strong> (hora
          peninsular) y <strong>sábados de 10:00 a 14:00</strong>. Fuera de ese horario te
          atiende el propio asistente y te agenda la demostración.</p>`
    }
  ]
}

];
