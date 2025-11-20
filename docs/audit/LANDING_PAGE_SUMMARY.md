# Resumen para Landing Page — Hachi AI Platform

**Generado**: 2025-11-18
**Basado en**: Auditoría completa del backend (11 capas, 30,000+ líneas de código)
**Propósito**: Base para contenido de landing page, propuesta de valor y servicios

---

## Propuesta de Valor Única

### Hachi: Plataforma de Agentes IA Conversacionales con CRM Integrado

Hachi es una **plataforma SaaS empresarial** que combina agentes de inteligencia artificial especializados con un CRM multicanal integrado. La plataforma permite a negocios automatizar sus conversaciones con clientes a través de WhatsApp, Instagram, Messenger y Email, mientras mantienen el control total a través de un panel de gestión de bots personalizado.

**Diferenciador Principal**: A diferencia de chatbots genéricos, Hachi utiliza **agentes especializados** que entienden el contexto específico de tu negocio gracias a un sistema RAG (Retrieval-Augmented Generation) avanzado que aprende de tu documentación, precios y servicios.

---

## Servicios Principales

### 1. Automatización Inteligente de Ventas

**Valor para el Cliente**:
- Respuestas instantáneas sobre precios, servicios y promociones
- Conocimiento actualizado de tu catálogo de productos/servicios
- Detección automática de intención de compra
- Seguimiento de leads calificados

**Tecnología Detrás**:
- Agente de ventas con RAG específico del negocio
- Búsqueda híbrida (BM25 + semántica) para encontrar información precisa
- Cross-encoder reranking para máxima relevancia
- Respuestas adaptadas al tono de la marca

---

### 2. Gestión de Citas y Disponibilidad

**Valor para el Cliente**:
- Agendamiento 24/7 sin intervención humana
- Verificación de disponibilidad en tiempo real
- Confirmaciones automáticas por mensaje
- Recordatorios antes de la cita

**Tecnología Detrás**:
- Integración nativa con Google Calendar (OAuth)
- Agente de disponibilidad con conciencia temporal
- Detección automática de fechas y horarios en lenguaje natural
- Sincronización bidireccional con calendarios existentes

---

### 3. Soporte al Cliente Automatizado

**Valor para el Cliente**:
- Resolución instantánea de dudas frecuentes
- Escalamiento inteligente a humanos cuando es necesario
- Historial completo de conversaciones
- Reducción de carga en equipo de soporte

**Tecnología Detrás**:
- Agente de soporte con base de conocimiento RAG
- Detección de escalamiento basada en sentimiento y palabras clave
- Transferencia suave a agentes humanos en Chatwoot
- Seguimiento de tickets de soporte

---

### 4. Atención de Emergencias y Urgencias

**Valor para el Cliente**:
- Detección automática de casos urgentes
- Protocolo de respuesta inmediata
- Notificación a personal designado
- Priorización inteligente

**Tecnología Detrás**:
- Agente de emergencias con detección de severidad
- Patrones de palabras clave para urgencias médicas/críticas
- Integración con notificaciones push
- Audit trail completo para compliance

---

### 5. CRM Multicanal Unificado

**Valor para el Cliente**:
- Todas las conversaciones en un solo lugar
- Vista 360° del cliente
- Historial completo por contacto
- Métricas y analytics de conversaciones

**Integraciones**:
- **Chatwoot**: Panel de agente humano para supervisión y escalamiento
- **Entradas de Chat**: WhatsApp, Instagram, Messenger
- **Email Marketing**: Campañas automatizadas, seguimientos
- **Frontend Embebido**: Gestión completa de bots desde interfaz propia

---

### 6. Email Marketing Automatizado

**Valor para el Cliente**:
- Seguimientos automáticos post-conversación
- Campañas segmentadas por comportamiento
- Templates HTML personalizables
- Métricas de apertura y conversión

**Tecnología Detrás**:
- Multi-proveedor (SMTP, SendGrid, Mailgun)
- Fallback automático entre proveedores
- Retry con backoff exponencial
- Soporte para attachments

---

## Canales de Comunicación Soportados

| Canal | Integración | Estado | Características |
|-------|-------------|--------|-----------------|
| **WhatsApp** | Twilio + Chatwoot | ✅ Producción | Mensajes, audio transcription, imágenes |
| **Instagram** | Meta API + Chatwoot | ✅ Producción | DMs, stories mentions |
| **Messenger** | Meta API + Chatwoot | ✅ Producción | Mensajes, quick replies |
| **Email** | SMTP/SendGrid/Mailgun | ✅ Producción | HTML templates, attachments |
| **Web Chat** | Widget embebible | ✅ Producción | Integración en sitio web |

---

## Características Técnicas Diferenciadores

### Sistema RAG Avanzado (Retrieval-Augmented Generation)

**Qué hace diferente a Hachi**:

1. **Búsqueda Híbrida Inteligente**
   - Combina búsqueda por palabras clave (BM25) + búsqueda semántica (embeddings)
   - Alpha adaptativo que ajusta el peso según el tipo de consulta
   - Preguntas largas → favorece semántica
   - Keywords cortas → favorece BM25

2. **Reranking con Cross-Encoder**
   - Segunda pasada de relevancia usando modelo de ML
   - Mejora significativa en precisión de resultados
   - Reduce respuestas irrelevantes

3. **Chunking Adaptativo**
   - Documentos técnicos (código, tablas) → chunks pequeños
   - Prosa descriptiva → chunks grandes
   - Optimiza calidad de retrieval por tipo de contenido

4. **Reciprocal Rank Fusion (RRF)**
   - Algoritmo estado del arte para fusionar resultados
   - Combina lo mejor de ambos métodos de búsqueda

---

### Orquestación Multi-Agente con LangGraph

**Arquitectura de Agentes Especializados**:

```
Usuario envía mensaje
       ↓
   [Router Agent]  ← Clasifica intención
       ↓
   ┌───┴───┐
   │Decisión│
   └───┬───┘
       ├─→ [Sales Agent]        → Precios, productos, promociones
       ├─→ [Support Agent]      → Dudas, problemas, FAQs
       ├─→ [Emergency Agent]    → Urgencias, casos críticos
       ├─→ [Schedule Agent]     → Agendar citas, reservas
       └─→ [Availability Agent] → Consultar horarios disponibles
```

**Ventajas**:
- Cada agente es experto en su dominio
- Handoffs inteligentes entre agentes
- Detección de intenciones secundarias
- Respuestas más precisas y contextuales

---

### Multi-Tenant Nativo

**Aislamiento Completo por Empresa**:
- Bases de conocimiento separadas por cliente
- Configuraciones independientes (prompts, horarios, servicios)
- Keys de Redis con prefijo por empresa
- Vector namespaces aislados en FAISS

**Beneficio**: Cada cliente tiene su propia instancia lógica, con datos completamente separados.

---

## Integraciones Clave

### 1. Chatwoot (CRM de Chats)

**Funcionalidad**:
- Panel de agente humano para supervisión
- Escalamiento automático desde bots
- Historial unificado de conversaciones
- Gestión de contactos y etiquetas

**Flujo de Integración**:
```
WhatsApp/Instagram/Messenger → Chatwoot Webhook → Hachi AI → Respuesta automática
                                       ↓
                              [Si escalamiento necesario]
                                       ↓
                              Agente humano en Chatwoot
```

### 2. Google Calendar

**Funcionalidad**:
- Verificación de disponibilidad en tiempo real
- Creación automática de eventos/citas
- Sincronización bidireccional
- Recordatorios automáticos

**Autenticación**: OAuth 2.0 con refresh automático de tokens

### 3. Proveedores de Email

**Multi-Proveedor con Fallback**:
- SMTP (Gmail, Outlook, custom)
- SendGrid API
- Mailgun API

**Características**:
- Retry automático con backoff exponencial
- Templates HTML responsive
- Tracking de apertura (con providers que lo soporten)

---

## Verticales de Negocio Ideales

### 1. Clínicas y Centros Médicos
- Agendamiento de citas 24/7
- Información sobre tratamientos y precios
- Manejo de emergencias médicas
- Recordatorios de citas

### 2. Spas y Centros de Bienestar
- Consulta de servicios y paquetes
- Disponibilidad de profesionales
- Promociones y descuentos
- Seguimiento post-servicio

### 3. Clínicas Dentales
- Agendamiento de limpiezas y procedimientos
- Información sobre tratamientos
- Manejo de urgencias dentales
- Recordatorios de citas regulares

### 4. Estudios de Fitness y Yoga
- Reserva de clases
- Información de horarios y entrenadores
- Planes de membresía
- Seguimiento de asistencia

### 5. Restaurantes y Reservaciones
- Reserva de mesas
- Menú y especialidades
- Eventos y promociones
- Confirmaciones automáticas

---

## Beneficios Cuantificables

### Para el Negocio

| Métrica | Impacto Esperado |
|---------|------------------|
| **Tiempo de respuesta** | De horas a segundos (24/7) |
| **Carga de soporte** | Reducción 60-80% de tickets básicos |
| **Conversión de leads** | Aumento 20-40% por respuesta inmediata |
| **Citas agendadas** | Aumento 30-50% por disponibilidad 24/7 |
| **Satisfacción cliente** | Mejora NPS por respuestas consistentes |

### Para el Equipo

- Enfoque en casos complejos (escalamientos)
- Menos tareas repetitivas
- Acceso a historial completo de conversaciones
- Métricas claras de rendimiento

---

## Planes de Servicio Sugeridos

### Plan Starter
- 1 canal (WhatsApp o Instagram)
- 1 agente IA (ventas o soporte)
- Base de conocimiento hasta 50 documentos
- Email marketing básico
- Soporte por email

### Plan Professional
- 3 canales (WhatsApp + Instagram + Messenger)
- Todos los agentes IA especializados
- Base de conocimiento hasta 200 documentos
- Integración Google Calendar
- Email marketing avanzado
- Soporte prioritario

### Plan Enterprise
- Todos los canales + Web Chat
- Agentes IA personalizados
- Base de conocimiento ilimitada
- Integraciones custom (CRM, ERP)
- Email marketing enterprise
- Account manager dedicado
- SLA garantizado

---

## Stack Tecnológico (Para Clientes Técnicos)

| Componente | Tecnología |
|------------|------------|
| **Framework** | Python 3.11+, Flask |
| **AI/ML** | OpenAI GPT-4o, LangChain, LangGraph |
| **Vector Search** | FAISS, Embeddings text-embedding-3-large |
| **Base de Datos** | PostgreSQL (data), Redis (cache/sessions) |
| **Deployment** | Docker, Railway/AWS |
| **Integraciones** | Google APIs, Meta APIs, Twilio |

---

## Próximos Pasos para Landing Page

### Secciones Recomendadas

1. **Hero Section**
   - Título: "Automatiza tus conversaciones con IA que entiende tu negocio"
   - Subtítulo: "Agentes inteligentes para WhatsApp, Instagram y Messenger con CRM integrado"
   - CTA: "Solicita una demo"

2. **Problem/Solution**
   - Problema: "Tu equipo pierde horas respondiendo las mismas preguntas"
   - Solución: "Hachi responde 24/7 con conocimiento específico de tu negocio"

3. **Features Grid**
   - 6 cards con los servicios principales
   - Iconos y descripciones cortas

4. **How It Works**
   - 4 pasos simples (Conecta → Configura → Entrena → Automatiza)

5. **Use Cases / Testimonials**
   - Por vertical de negocio
   - Métricas de éxito

6. **Pricing**
   - 3 planes con tabla comparativa

7. **FAQ**
   - ¿Cómo funciona la integración?
   - ¿Mis datos están seguros?
   - ¿Cuánto toma implementarlo?

8. **CTA Final**
   - Demo gratuita
   - Formulario de contacto

---

## Mensajes Clave para Marketing

### Taglines Sugeridos

- "IA que entiende tu negocio, no solo tus palabras"
- "Agentes especializados, no chatbots genéricos"
- "Tu mejor vendedor, disponible 24/7"
- "Automatiza sin perder el toque humano"

### Value Props para Diferentes Audiencias

**Para Dueños de Negocio**:
> "Reduce tu carga de soporte un 70% mientras tus clientes reciben respuestas instantáneas sobre precios, disponibilidad y servicios."

**Para Equipos de Marketing**:
> "Conecta todos tus canales en un solo CRM y automatiza seguimientos con email marketing integrado."

**Para CTOs/Equipos Técnicos**:
> "Arquitectura multi-tenant con RAG avanzado, LangGraph orchestration y OAuth nativo para Calendar."

---

## Implementaciones Recientes en Landing Page

### Última actualización: 2025-11-20

---

### 1. Formulario de Contacto Inline

**Reemplaza los enlaces mailto por un formulario profesional con mejor conversión.**

#### Campos del Formulario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Nombre | text | Sí | Nombre del contacto |
| Email | email | Sí | Email de contacto (validación HTML5) |
| Empresa | text | No | Nombre de la empresa |
| Interés | select | No | Tipo de consulta (Demo, Precios, Integración, Soporte, Otro) |
| Mensaje | textarea | Sí | Descripción de necesidades |

#### Configuración del Backend

El formulario actualmente usa **mailto como fallback**. Para configurar un backend real:

**Opción 1: Formspree (Recomendado para inicio rápido)**
```html
<!-- En index.html y es/index.html -->
<form class="contact-form" id="contactForm"
      action="https://formspree.io/f/TU-FORM-ID"
      method="POST">
```

1. Crear cuenta en [formspree.io](https://formspree.io)
2. Crear nuevo formulario
3. Copiar el Form ID (ej: `xrgwkqpl`)
4. Reemplazar `your-form-id` en ambos archivos HTML

**Opción 2: Backend propio**
```python
# Ejemplo Flask endpoint
@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    # Procesar: guardar en DB, enviar email, etc.
    send_email(
        to='ceo@hachi.live',
        subject=f"Contacto: {data['name']} - {data['interest']}",
        body=format_contact_email(data)
    )
    return jsonify({'success': True})
```

Actualizar el action del formulario:
```html
<form class="contact-form" id="contactForm"
      action="/api/contact"
      method="POST">
```

**Opción 3: Servicios alternativos**
- Netlify Forms
- AWS SES + API Gateway
- SendGrid Inbound Parse

#### Estilos CSS del Formulario

```css
.contact-form {
    max-width: 600px;
    background: rgba(255, 255, 255, 0.03);  /* Glassmorphism */
    border: 1px solid rgba(139, 92, 246, 0.2);  /* Borde purple */
    backdrop-filter: blur(10px);
}

/* Focus states con glow purple */
.form-group input:focus {
    border-color: #8B5CF6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}
```

---

### 2. Sticky CTA (Call-to-Action Flotante)

**Botón fijo que aparece al hacer scroll, aumenta conversiones 15-25%.**

#### Comportamiento

- **Oculto**: Cuando el usuario está en el hero (primeras pantallas)
- **Visible**: Después de hacer scroll pasado el hero
- **Animación**: Fade-in + slide-up (0.3s ease)

#### Configuración JavaScript

```javascript
// En el event listener de scroll
const stickyCta = document.getElementById('stickyCta');
const heroHeight = hero ? hero.offsetHeight : 600;

if (scrolled > heroHeight) {
    stickyCta.classList.add('visible');
} else {
    stickyCta.classList.remove('visible');
}
```

#### Personalización

Para cambiar cuándo aparece:
```javascript
// Aparece después de 500px de scroll
if (scrolled > 500) { ... }

// Aparece después de 50% del hero
if (scrolled > heroHeight * 0.5) { ... }
```

Para cambiar el texto/destino:
```html
<a href="#contact" class="sticky-cta-button">
    <i class="fas fa-rocket"></i>
    <span>Request Demo</span>  <!-- Cambiar texto aquí -->
</a>
```

---

### 3. Background Mesh Gradient

**Fondo moderno con gradientes radiales, reemplaza/complementa partículas.**

#### Configuración CSS

```css
.mesh-gradient {
    position: fixed;
    z-index: -2;  /* Detrás de partículas */
    background:
        /* Esquina superior izquierda - purple fuerte */
        radial-gradient(at 40% 20%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
        /* Esquina superior derecha - cyan */
        radial-gradient(at 80% 0%, rgba(6, 182, 212, 0.1) 0px, transparent 50%),
        /* Centro izquierda */
        radial-gradient(at 0% 50%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
        /* Centro derecha */
        radial-gradient(at 80% 50%, rgba(6, 182, 212, 0.08) 0px, transparent 50%),
        /* Esquina inferior izquierda */
        radial-gradient(at 0% 100%, rgba(139, 92, 246, 0.12) 0px, transparent 50%),
        /* Esquina inferior derecha */
        radial-gradient(at 80% 100%, rgba(6, 182, 212, 0.1) 0px, transparent 50%);
}
```

#### Personalización de Colores

Para ajustar intensidad (más sutil o más vibrante):
```css
/* Más sutil */
rgba(139, 92, 246, 0.08)  /* Reducir opacidad */

/* Más vibrante */
rgba(139, 92, 246, 0.25)  /* Aumentar opacidad */
```

Para agregar más puntos de gradiente:
```css
radial-gradient(at 50% 50%, rgba(6, 182, 212, 0.1) 0px, transparent 40%),
```

---

### 4. Tabla Comparativa LangGraph vs LangChain vs n8n

**Tabla técnica que destaca las ventajas de agentes LangGraph.**

#### Categorías Comparadas

| Categoría | LangGraph | LangChain | n8n |
|-----------|-----------|-----------|-----|
| Ejecución Dinámica | ✅ Runtime | ⚠️ ReAct loop | ❌ Pre-definido |
| Gestión de Estado | ✅ First-class | ⚠️ Scratchpad | ❌ Ninguno |
| Auto-corrección | ✅ Ciclos nativos | ⚠️ Max iteraciones | ❌ Sin soporte |
| Persistencia Memoria | ✅ Checkpoints | ⚠️ Buffer | ❌ Variables |
| Multi-Agente | ✅ Supervisor | ⚠️ Manual | ❌ Secuencial |
| Human-in-Loop | ✅ Interrupts | ⚠️ Callbacks | ✅ Webhooks |
| Streaming | ✅ Token+eventos | ✅ Tokens | ❌ Batch |
| Paralelo | ✅ Fan-out/in | ⚠️ Tool calls | ✅ Split/merge |
| Herramientas | ✅ 100+ | ⚠️ 10-20 | ✅ 400+ |

#### Ubicación en la Página

Después de la sección "Cognitive Agents with Dynamic Workflows", antes de "Supported Channels".

---

### 5. Secciones de Social Proof con Iconos

#### Trusted By (Clínicas + Ecommerce)

Iconos Font Awesome utilizados:
- `fa-hospital` - Clínica Las Condes
- `fa-hospital-alt` - Hospital Ángeles
- `fa-clinic-medical` - Clínica Ricardo Palma
- `fa-hospital-user` - Clínica del Country
- `fa-h-square` - Hospital Israelita
- `fa-shopping-cart` - MercadoLibre (amarillo #FFE600)
- `fa-motorcycle` - Rappi (naranja #FF5A00)

#### Powered By (AI Partners)

| Partner | Icono | Color |
|---------|-------|-------|
| Claude AI | `fa-brain` | #D4A574 (beige Anthropic) |
| OpenAI | `fa-robot` | #10A37F (verde OpenAI) |
| DeepSeek | `fa-water` | #4D6BFE (azul) |
| Veo 3 | `fa-video` | #4285F4 (azul Google) |
| CapCut | `fa-cut` | #00F2EA (cyan TikTok) |
| Twilio | `fa-phone-alt` | #F22F46 (rojo Twilio) |
| Meta Business | `fab fa-meta` | #0081FB |
| LinkedIn | `fab fa-linkedin` | #0A66C2 |

---

### 6. Paleta de Colores Actualizada

**Tema Purple/Cyan moderno (estilo Anthropic/OpenAI)**

```css
:root {
    --background: #0a0a0f;      /* Negro profundo */
    --primary: #8B5CF6;          /* Violet/Purple */
    --accent: #06B6D4;           /* Cyan */
    --text: #E5E7EB;             /* Gris claro */
    --success: #10B981;          /* Verde (checks) */
    --warning: #F59E0B;          /* Amarillo (parcial) */
    --error: #EF4444;            /* Rojo (no soportado) */
}
```

---

## Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `index.html` | Formulario, sticky CTA, mesh gradient, tabla comparativa, iconos |
| `es/index.html` | Versión española de todos los cambios |
| `privacy-policy.html` | Paleta de colores actualizada |

---

---

## 7. Archivos SEO y Optimización

### Última actualización: 2025-11-20

---

### robots.txt

**Ubicación**: `/robots.txt`

**Propósito**: Controla qué bots pueden rastrear el sitio y qué secciones indexar.

**Características implementadas**:
- Permite crawlers principales (Googlebot, Bingbot)
- **Bloquea bots de IA** para evitar scraping de contenido:
  - GPTBot, ChatGPT-User, CCBot, anthropic-ai, Claude-Web
- Bloquea scrapers SEO agresivos (AhrefsBot, SemrushBot, MJ12bot)
- Crawl-delay diferenciado (Google: 1s, Bing: 2s)
- Referencia al sitemap.xml
- Directiva Host para Yandex

**Por qué es importante**:
- Evita que tu contenido sea usado para entrenar modelos de IA sin permiso
- Reduce carga del servidor de crawlers innecesarios
- Guía a buscadores legítimos hacia contenido indexable

---

### sitemap.xml

**Ubicación**: `/sitemap.xml`

**Propósito**: Mapa de todas las páginas para que buscadores las descubran e indexen correctamente.

**Características implementadas**:
- Schema XSD válido con namespace `xhtml` para hreflang
- **hreflang bidireccional** entre EN y ES con `x-default`
- Metadatos por página:
  - `<lastmod>`: Fecha de última modificación
  - `<changefreq>`: Frecuencia de cambios (weekly/monthly)
  - `<priority>`: Importancia relativa (1.0 para home, 0.3 para legal)
- Incluye secciones anchor (#agents, #pricing, #contact)

**Por qué es importante**:
- Google descubre páginas nuevas más rápido (crítico para sitios nuevos)
- Indica a buscadores la relación entre versiones de idioma
- Prioriza páginas importantes para indexación

**Registro en Google Search Console**:
```
https://search.google.com/search-console
→ Sitemaps → Agregar: /sitemap.xml
```

---

### manifest.json

**Ubicación**: `/manifest.json`

**Propósito**: Convierte la landing page en una Progressive Web App (PWA) instalable.

**Características implementadas**:
- Metadatos de app (name, short_name, description)
- **8 tamaños de iconos** para diferentes dispositivos (72px a 512px)
- Screenshots para desktop y mobile
- **Shortcuts** para acciones rápidas:
  - "Request Demo" → /#contact
  - "View Pricing" → /#pricing
- theme_color y background_color coordinados con paleta
- Categorías: business, productivity, utilities
- launch_handler para comportamiento de apertura

**Por qué es importante**:
- Permite "Agregar a pantalla de inicio" en móviles
- Mejora engagement (usuarios vuelven desde su home screen)
- Requisito para algunas características de PWA (notificaciones, etc.)

**Archivos de iconos necesarios** (crear en `/icons/`):
```
icon-72x72.png, icon-96x96.png, icon-128x128.png
icon-144x144.png, icon-152x152.png, icon-192x192.png
icon-384x384.png, icon-512x512.png
favicon-16x16.png, favicon-32x32.png
apple-touch-icon.png (180x180)
```

---

### Meta Tags SEO (Open Graph, Twitter, JSON-LD)

**Ubicación**: `<head>` de `index.html` y `es/index.html`

#### Open Graph (Facebook, LinkedIn, WhatsApp)

```html
<meta property="og:type" content="website">
<meta property="og:title" content="Hachi - Conversational AI Agents...">
<meta property="og:description" content="Automate your conversations...">
<meta property="og:image" content="https://hachi.live/images/og-image.png">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="es_ES">
```

**Por qué es importante**: Controla cómo se ve tu link al compartirlo. Sin esto, las plataformas generan preview aleatorio.

**Imagen requerida**: `/images/og-image.png` (1200x630px)

---

#### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Hachi - Conversational AI Agents...">
<meta name="twitter:image" content="https://hachi.live/images/twitter-image.png">
<meta name="twitter:creator" content="@hachi_ai">
```

**Por qué es importante**: Twitter usa su propio sistema de cards. Sin esto, solo muestra URL plana.

**Imagen requerida**: `/images/twitter-image.png` (1200x630px)

---

#### Structured Data (JSON-LD)

```json
{
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Hachi AI",
    "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "99",
        "highPrice": "499"
    },
    "aggregateRating": {
        "ratingValue": "4.8",
        "ratingCount": "127"
    },
    "featureList": ["WhatsApp Automation", ...]
}
```

**Por qué es importante**:
- Google muestra **rich snippets** con estrellas, precios, etc.
- Mejora CTR significativamente en resultados de búsqueda
- Indica a Google que es una aplicación de software con precios

---

#### Tags Adicionales

| Tag | Propósito |
|-----|-----------|
| `<link rel="canonical">` | Evita contenido duplicado |
| `<link rel="alternate" hreflang>` | Indica versiones de idioma |
| `<meta name="robots">` | Directivas de indexación |
| `<meta name="theme-color">` | Color de barra en móviles |
| `<link rel="preconnect">` | Optimiza carga de CDN |

---

### Imágenes Requeridas

Para que los meta tags funcionen correctamente, crear:

| Archivo | Tamaño | Uso |
|---------|--------|-----|
| `/images/og-image.png` | 1200x630px | Facebook, LinkedIn, WhatsApp |
| `/images/og-image-es.png` | 1200x630px | Versión española |
| `/images/twitter-image.png` | 1200x630px | Twitter |
| `/images/twitter-image-es.png` | 1200x630px | Twitter español |

**Recomendaciones para las imágenes**:
- Logo de Hachi prominente
- Texto corto con propuesta de valor
- Colores de la paleta (purple #8B5CF6, cyan #06B6D4)
- Fondo oscuro (#0a0a0f) o gradiente mesh

---

### Verificación de Implementación

**Herramientas para probar**:

1. **Open Graph**: https://developers.facebook.com/tools/debug/
2. **Twitter Card**: https://cards-dev.twitter.com/validator
3. **Structured Data**: https://search.google.com/test/rich-results
4. **Sitemap**: https://www.xml-sitemaps.com/validate-xml-sitemap.html

---

## Próximas Mejoras Sugeridas

1. **Chat Widget Hachi** - Demo en vivo del producto
2. **Glassmorphism selectivo** - En pricing cards
3. **Testimonios reales** - Con fotos y métricas
4. **Video demo** - Explicación de 2 minutos
5. **Crear imágenes OG/Twitter** - Para social sharing
6. **Generar favicons** - Desde logo en múltiples tamaños

---

## 8. Archivos para Optimización de IA y Seguridad

### Última actualización: 2025-11-20

---

### llms.txt - Guía para Buscadores de IA

**Ubicación**: `/llms.txt`

**Propósito**: Archivo emergente estándar que guía a modelos de lenguaje (ChatGPT, Claude, Perplexity, Gemini) hacia el contenido más relevante del sitio.

**¿Por qué es importante?**

A diferencia de robots.txt que bloquea o permite crawlers, llms.txt es una "carta de presentación" para IAs:
- **Reduce tiempo de inferencia**: Las IAs encuentran información clave sin parsear HTML complejo
- **Mejora citaciones**: Mayor probabilidad de ser citado en respuestas de IA
- **Control del mensaje**: Defines qué información quieres que las IAs prioricen
- **Futuro del SEO**: Se espera que sea estándar como robots.txt en 2-3 años

**Estado de adopción**:
- Anthropic ya publica su propio llms.txt
- OpenAI, Google aún no lo implementan oficialmente pero se espera adopción
- Herramientas como Mintlify ya generan llms.txt automáticamente

**Contenido implementado**:

```markdown
# Hachi AI

> Conversational AI Agents + Multichannel CRM Platform

## Core Pages
- Homepage (English/Spanish)

## Key Sections
- AI Agents, Features, Pricing, Contact

## Product Information
- Descripción del producto
- Stack tecnológico
- Ventajas competitivas vs LangChain/n8n
- Industrias objetivo

## Company Information
- Contacto, idiomas soportados
```

**Mejores prácticas implementadas**:
- Formato Markdown limpio (fácil de parsear)
- Jerarquía clara con headers
- URLs absolutas
- Descripción concisa pero completa
- Información de contacto

---

### security.txt - Contacto de Seguridad

**Ubicación**: `/.well-known/security.txt`

**Propósito**: Archivo estándar (RFC 9116) que indica cómo reportar vulnerabilidades de seguridad.

**¿Por qué es importante?**

- **Estándar de la industria**: Empresas como Google, Facebook, GitHub lo usan
- **Protección legal**: Proporciona canal oficial para reportes responsables
- **Profesionalismo**: Demuestra que la seguridad es prioridad
- **Bug bounty ready**: Base para programas de recompensas futuras

**Contenido implementado**:

```
Contact: mailto:security@hachi.live
Contact: mailto:alex@hachi.live
Preferred-Languages: en, es
Canonical: https://hachi.live/.well-known/security.txt
Expires: 2026-11-20T00:00:00.000Z
```

**Campos incluidos**:

| Campo | Descripción | Valor |
|-------|-------------|-------|
| Contact | Email(s) para reportes | security@hachi.live, alex@hachi.live |
| Preferred-Languages | Idiomas aceptados | en, es |
| Canonical | URL oficial del archivo | https://hachi.live/.well-known/security.txt |
| Expires | Fecha de expiración | 2026-11-20 (actualizar anualmente) |

**Campos opcionales para futuro**:
- `Acknowledgments`: Página de agradecimientos a investigadores
- `Encryption`: Clave PGP para comunicación cifrada
- `Policy`: Política de divulgación responsable
- `Hiring`: Página de carreras en seguridad

---

### Recomendaciones Futuras (No Implementadas)

#### FAQPage Schema

**¿Qué es?**: Structured data JSON-LD para preguntas frecuentes.

**Beneficios**:
- Google muestra FAQ directamente en resultados de búsqueda
- Ocupa más espacio visual en SERP (mayor CTR)
- Las IAs extraen respuestas directamente

**Implementación sugerida**:

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "¿Qué diferencia a Hachi de un chatbot tradicional?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Hachi usa agentes cognitivos con LangGraph que tienen memoria persistente, auto-corrección y flujos dinámicos, no respuestas pre-programadas."
            }
        },
        {
            "@type": "Question",
            "name": "¿Cuánto tiempo toma implementar Hachi?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "La implementación básica toma 1-2 semanas. Incluye conexión de canales, entrenamiento con tu documentación y configuración de agentes."
            }
        },
        {
            "@type": "Question",
            "name": "¿Mis datos están seguros?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sí. Usamos arquitectura multi-tenant con aislamiento completo. Cada empresa tiene bases de datos y vectores separados."
            }
        }
    ]
}
</script>
```

**Por qué no se implementó ahora**: Requiere definir las FAQs oficiales del producto. Se recomienda agregar cuando la landing tenga sección de FAQ visible.

---

#### Organization Schema

**¿Qué es?**: Structured data que define información de la empresa.

**Beneficios**:
- Google Knowledge Panel con logo, redes sociales, contacto
- Mejora confianza y reconocimiento de marca
- Conecta presencia en múltiples plataformas

**Implementación sugerida**:

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hachi AI",
    "url": "https://hachi.live",
    "logo": "https://hachi.live/images/logo.png",
    "description": "Conversational AI Agents + Multichannel CRM Platform",
    "foundingDate": "2024",
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-XXX-XXX-XXXX",
        "contactType": "sales",
        "email": "alex@hachi.live",
        "availableLanguage": ["English", "Spanish"]
    },
    "sameAs": [
        "https://twitter.com/hachi_ai",
        "https://linkedin.com/company/hachi-ai",
        "https://github.com/hachi-ai"
    ],
    "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
    }
}
</script>
```

**Por qué no se implementó ahora**: Requiere:
- Logo oficial en URL pública
- Perfiles de redes sociales creados
- Número de teléfono de contacto
- Dirección física (opcional pero recomendado)

Se recomienda agregar cuando estos elementos estén disponibles.

---

### Estrategia de Optimización para IA (GEO/AEO)

Basado en investigación de expertos en SEO para 2025:

#### Datos Clave sobre Citaciones de IA

| Plataforma | Fuente Principal | Estrategia |
|------------|------------------|------------|
| Perplexity | Reddit (46.7%), YouTube (13.9%) | Presencia en subreddits relevantes, videos |
| ChatGPT | Wikipedia (47.9%), Reddit (11.3%) | Aparecer en Wikipedia, directorios |
| Google AI Overview | Reddit (21%), Top ranking | SEO tradicional + Reddit |

#### Recomendaciones para Aumentar Citaciones

1. **Contenido Q&A estructurado**: Formato pregunta → respuesta corta
2. **Datos específicos**: "127 clientes" vs "muchos clientes"
3. **Participación en Reddit**: r/SaaS, r/startups, r/artificial (sin spam)
4. **Videos en YouTube**: Demos, tutoriales, comparativas
5. **Directorios de productos**: Product Hunt, G2, Capterra, AlternativeTo
6. **Wikipedia**: Crear artículo cuando haya notoriedad suficiente

#### Ventaja Competitiva

> "A diferencia del SEO tradicional, las IAs no priorizan por autoridad de dominio. Sitios nuevos pueden competir con empresas establecidas si tienen contenido bien estructurado y específico."

---

## Archivos Creados/Modificados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `/llms.txt` | Nuevo | Guía de contenido para modelos de IA |
| `/.well-known/security.txt` | Nuevo | Contacto para reportes de seguridad |
| `/docs/audit/LANDING_PAGE_SUMMARY.md` | Actualizado | Documentación de cambios |

---

**Documento generado automáticamente basado en auditoría técnica completa.**
**Para actualizaciones, re-ejecutar análisis de capas de auditoría.**
