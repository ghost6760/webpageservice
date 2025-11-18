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

**Documento generado automáticamente basado en auditoría técnica completa.**
**Para actualizaciones, re-ejecutar análisis de capas de auditoría.**
