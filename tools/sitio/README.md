# Comprobación de alcanzabilidad

```bash
node tools/sitio/alcanzables.js
```

Responde a una sola pregunta: **¿se puede llegar a cada página navegando desde
`hachi.live`, sin escribir la URL a mano?**

Recorre el sitio en anchura desde las dos portadas siguiendo únicamente enlaces
`<a href>` reales —resolviendo los relativos y descartando los que aparecen
dentro de bloques `<script>`, que son cadenas de texto y no navegación— e informa
de a cuántos clics queda cada página y desde dónde.

## Por qué existe

Publicar una página y no enlazarla desde ninguna parte equivale a no publicarla.
Google acabará encontrándola por el `sitemap.xml`, pero **una persona que entra a
la portada y mira, no**: nadie teclea URLs ni sigue enlaces que no ve. Ya pasó una
vez con las calculadoras, que estuvieron publicadas y sin enlazar.

El test es tajante en dos puntos:

- Las **cinco páginas de captación** de cada idioma —calculadora, preguntas y las
  tres guías— tienen que estar **a un solo clic** de su portada. Si una cae a dos
  saltos, falla.
- Las **tres páginas legales** —privacidad, términos y eliminación de datos—
  tienen que ser alcanzables en los dos idiomas. No es sólo higiene: Meta exige
  que estén accesibles públicamente para aprobar la app de WhatsApp Business.

También comprueba que las dos portadas tengan el mismo número de entradas en el
nav, que es la forma barata de detectar que un idioma se ha quedado atrás.

---

# Comprobación de los ficheros algorítmicos

```bash
node tools/sitio/archivos.js
```

No comprueba que existan —eso es trivial— sino que **digan lo correcto y no se
contradigan entre sí**, que es donde fallan de verdad:

- que ninguna URL del `sitemap.xml` esté bloqueada por `robots.txt`;
- que `/.well-known/` no esté tapado, porque `security.txt` existe para leerse;
- que los rastreadores que **responden citando** (ChatGPT-User, PerplexityBot,
  ClaudeBot, Applebot…) estén permitidos, y que los que sólo **recopilan para
  entrenar** (GPTBot, CCBot) sigan bloqueados — esto último es una decisión de
  negocio, así que sale como aviso, no como fallo;
- que los precios de `llms.txt` coincidan con los de la landing. Es el dato que
  más daño hace si se queda viejo, porque un modelo lo citará como autoritativo;
- que la clave de IndexNow del script exista publicada en la raíz y coincida;
- que `Expires` de `security.txt` no haya caducado (avisa a 60 días);
- que el `sameAs` del `Organization` apunte a perfiles externos reales.

## IndexNow

```bash
bash tools/sitio/indexnow.sh --ver   # qué enviaría
bash tools/sitio/indexnow.sh         # enviarlo
```

Avisa a **Bing y Yandex** de que las URLs han cambiado; baja la indexación de
semanas a horas. **Google no participa en IndexNow** — para Google hay que
reenviar el sitemap desde Search Console, explicado en
`docs/indexacion-paso-a-paso.md`.

Las URLs salen del propio `sitemap.xml`, así que no hay dos listas que mantener.
El script comprueba antes que la clave esté publicada en el dominio: si no lo
está, IndexNow rechaza el envío entero con un 403 sin decir por qué.
