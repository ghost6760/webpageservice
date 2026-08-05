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
