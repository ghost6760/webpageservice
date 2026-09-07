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

---

# Generación y comprobación del sitemap

```bash
node tools/sitio/sitemap.js              # comprobar (falla si hay desfase)
node tools/sitio/sitemap.js --escribir   # regenerarlo
```

**El `sitemap.xml` ya no se edita a mano.** Se genera del árbol de páginas, y
ningún dato se teclea: las URLs salen de los ficheros `.html` que existen, el
`lastmod` sale de la fecha del último commit que tocó cada fichero, y los
`xhtml:link` salen de las etiquetas `hreflang` de la propia página — una sola
fuente, así que HTML y sitemap no pueden contradecirse.

## Por qué existe

Por un fallo concreto. El 05-08 se escribió el sitemap a mano; el 06-08 el commit
`daac3cd` —«unifica las 15 paginas internas con el sistema de diseno»— tocó 15 de
las 17 páginas, y nadie volvió al sitemap. Durante un mes, **15 de 17 `lastmod`
declararon una fecha anterior al cambio real**.

Un `lastmod` que miente es peor que no ponerlo: Google evalúa si la fecha es
fiable y, cuando no lo es, descarta el `lastmod` de **todo** el fichero. El
sitemap deja de decir «esto ha cambiado, vuelve a rastrearlo» y queda como una
lista de URLs sin señal — justo cuando más falta hacía, con cuatro guías
atascadas en «Descubierta: actualmente sin indexar».

Comprueba además lo que se había roto a la vez:

- que **cada página tenga `canonical`** y apunte a su propia URL. Sin él, la
  variante `www.` compite; cinco páginas legales llevaban meses sin ninguno;
- que las **alternas sean recíprocas**: si A dice que su versión española es B, B
  tiene que devolver el enlace. Un grupo hreflang no recíproco lo descarta Google
  entero;
- que no falte ni sobre ninguna URL respecto a las páginas publicadas.

No se emiten `changefreq` ni `priority`: Google dejó de usarlos hace años, y
mantenerlos sólo refuerza la impresión de fichero autogenerado sin cuidado, que
es exactamente lo que lleva a desconfiar también del `lastmod`.

## IndexNow

```bash
bash tools/sitio/indexnow.sh --ver   # qué enviaría
bash tools/sitio/indexnow.sh         # enviarlo
```

En Windows, sin WSL, usa la versión de PowerShell — hace exactamente lo mismo:

```powershell
powershell -ExecutionPolicy Bypass -File tools\sitio\indexnow.ps1 -Ver
powershell -ExecutionPolicy Bypass -File tools\sitio\indexnow.ps1
```

Existe porque el `.sh` necesita `mapfile`, `grep -oP` y `python3`, y Git Bash en
Windows no trae `python3`. Las dos leen las URLs del mismo `sitemap.xml`, así que
no hay dos listas que mantener ni pueden discrepar.

Avisa a **Bing y Yandex** de que las URLs han cambiado; baja la indexación de
semanas a horas. **Google no participa en IndexNow** — para Google hay que
reenviar el sitemap desde Search Console, explicado en
`docs/indexacion-paso-a-paso.md`.

Las URLs salen del propio `sitemap.xml`, así que no hay dos listas que mantener.
El script comprueba antes que la clave esté publicada en el dominio: si no lo
está, IndexNow rechaza el envío entero con un 403 sin decir por qué.
