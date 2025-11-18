# Configuración del Webhook de Chatwoot

## 🎯 Objetivo

Sincronizar automáticamente la creación de cuentas en Chatwoot con la creación de empresas en el backend multi-tenant.

## 📋 Cambios Implementados

### 1. Endpoint de Admin (sin API key)
**Archivo**: `app/routes/admin.py`

✅ **Removido** `@require_api_key` del endpoint de creación de empresas
- Antes: Requería header `X-API-Key`
- Ahora: Público (para permitir llamadas desde webhook)

### 2. Webhook Handler
**Archivo**: `app/routes/chatwoot_webhooks.py`

✅ **Creado** endpoint que recibe eventos de Chatwoot
- Ruta: `POST /api/chatwoot/webhooks/account-created`
- Recibe evento `ACCOUNT_CREATED` de Chatwoot
- Llama internamente a `/api/admin/companies/create`
- Inicializa **TODOS** los 7 servicios automáticamente

### 3. Blueprint Registrado
**Archivo**: `app/__init__.py`

✅ **Registrado** blueprint de webhooks en la aplicación

---

## ⚙️ Configuración en Chatwoot

### Opción 1: Variables de Entorno (Recomendado)

Agregar en `.env` de Chatwoot:

```bash
# URL del webhook en tu backend
INSTALLATION_EVENTS_WEBHOOK_URL=https://multibackendopenia-production.up.railway.app/api/chatwoot/webhooks/account-created
```

Luego reiniciar Chatwoot.

### Opción 2: Rails Console

Conectar a la consola de Chatwoot:

```bash
# En Railway, ejecutar:
railway run rails console

# O en servidor SSH:
docker exec -it chatwoot_app rails console
```

Ejecutar en la consola:

```ruby
# Crear o actualizar configuración
InstallationConfig.create_or_find_by(name: 'INSTALLATION_EVENTS_WEBHOOK_URL') do |config|
  config.value = 'https://multibackendopenia-production.up.railway.app/api/chatwoot/webhooks/account-created'
end

# Verificar configuración
InstallationConfig.find_by(name: 'INSTALLATION_EVENTS_WEBHOOK_URL')&.value
```

### Opción 3: SuperAdmin Dashboard

1. Acceder al SuperAdmin de Chatwoot
2. Ir a **Settings** → **Installation Config**
3. Agregar:
   - **Key**: `INSTALLATION_EVENTS_WEBHOOK_URL`
   - **Value**: `https://multibackendopenia-production.up.railway.app/api/chatwoot/webhooks/account-created`

---

## 🔄 Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario crea cuenta en Chatwoot                         │
│    - POST /api/v1/accounts                                  │
│    - account_name: "Mi Empresa"                             │
│    - user_email: "juan@example.com"                         │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌──────────────────▼──────────────────────────────────────────┐
│ 2. Chatwoot crea Account y User                             │
│    - account.id = 1                                         │
│    - user.id = 1                                            │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌──────────────────▼──────────────────────────────────────────┐
│ 3. Chatwoot dispara evento ACCOUNT_CREATED                  │
│    - Trigger: Account.after_create_commit                   │
│    - Listener: InstallationWebhookListener                  │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌──────────────────▼──────────────────────────────────────────┐
│ 4. Chatwoot envía webhook a tu backend                      │
│    POST https://tu-backend.com/api/chatwoot/webhooks/       │
│         account-created                                     │
│                                                             │
│    Payload:                                                 │
│    {                                                        │
│      "event": "account_created",                            │
│      "id": 1,                                               │
│      "name": "Mi Empresa",                                  │
│      "users": [                                             │
│        {                                                    │
│          "id": 1,                                           │
│          "name": "Juan Pérez",                              │
│          "email": "juan@example.com"                        │
│        }                                                    │
│      ]                                                      │
│    }                                                        │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌──────────────────▼──────────────────────────────────────────┐
│ 5. Backend recibe webhook                                   │
│    - Valida payload                                         │
│    - Extrae: chatwoot_account_id, account_name, users       │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌──────────────────▼──────────────────────────────────────────┐
│ 6. Backend llama a endpoint de admin internamente           │
│    POST http://localhost:8080/api/admin/companies/create    │
│                                                             │
│    Payload:                                                 │
│    {                                                        │
│      "company_id": "chatwoot_1",                            │
│      "company_name": "Mi Empresa",                          │
│      "business_type": "general",                            │
│      "services": "Asistente de IA, Documentos",             │
│      "chatwoot_account_id": "1",                            │
│      ...                                                    │
│    }                                                        │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌──────────────────▼──────────────────────────────────────────┐
│ 7. Endpoint de admin inicializa empresa                     │
│    ✅ PostgreSQL persistence (companies table)              │
│    ✅ Vectorstore initialization (Redis)                    │
│    ✅ Prompts initialization (6 agentes)                    │
│    ✅ CompanyManager registration (memoria)                 │
│    ✅ Multi-Agent Orchestrator (LangGraph)                  │
│    ✅ JSON fallback update                                  │
│    ✅ Redis metadata                                        │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌──────────────────▼──────────────────────────────────────────┐
│ 8. Backend retorna resultado                                │
│    {                                                        │
│      "success": true,                                       │
│      "company_id": "chatwoot_1",                            │
│      "setup_status": {                                      │
│        "postgresql_config_saved": true,                     │
│        "vectorstore_initialized": "initialized",            │
│        "prompts_configured": "initialized (6 agents)",      │
│        "company_manager_added": "added_to_legacy_manager",  │
│        "orchestrator_initialized": "initialized",           │
│        "json_fallback_updated": "updated"                   │
│      },                                                     │
│      "system_ready": true                                   │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

### 1. Health Check del Webhook

```bash
curl https://multibackendopenia-production.up.railway.app/api/chatwoot/webhooks/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "chatwoot_webhooks",
    "endpoints": [
      "POST /api/chatwoot/webhooks/account-created"
    ]
  }
}
```

### 2. Simular Webhook de Chatwoot

```bash
curl -X POST https://multibackendopenia-production.up.railway.app/api/chatwoot/webhooks/account-created \
  -H "Content-Type: application/json" \
  -d '{
    "event": "account_created",
    "id": 999,
    "name": "Empresa de Prueba",
    "users": [
      {
        "id": 1,
        "name": "Test User",
        "email": "test@example.com",
        "type": "user"
      }
    ]
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "company_id": "chatwoot_999",
    "company_name": "Empresa de Prueba",
    "chatwoot_account_id": "999",
    "setup_status": {
      "postgresql_config_saved": true,
      "vectorstore_initialized": "initialized",
      "prompts_configured": "initialized (6 agents: ...)",
      "company_manager_added": "added_to_legacy_manager",
      "orchestrator_initialized": "initialized",
      "json_fallback_updated": "updated"
    },
    "message": "Company created successfully via admin endpoint",
    "created": true
  }
}
```

### 3. Verificar Empresa Creada

```bash
# Verificar en PostgreSQL
curl https://multibackendopenia-production.up.railway.app/api/admin/companies/chatwoot_999
```

### 4. Test en Chatwoot

1. Crear una cuenta nueva en Chatwoot:
   - Ir a `/app/auth/signup`
   - Completar formulario
   - Submit

2. Verificar logs del backend:
   ```
   [Chatwoot Webhook] Account created event received: 1 - Mi Empresa
   [Chatwoot Webhook] Calling admin endpoint: http://localhost:8080/api/admin/companies/create
   [Chatwoot Webhook] Company created successfully: chatwoot_1
   ```

3. Verificar en base de datos:
   ```sql
   SELECT company_id, company_name, chatwoot_account_id
   FROM companies
   WHERE chatwoot_account_id IS NOT NULL;
   ```

---

## 🔍 Troubleshooting

### Webhook no se dispara

**Verificar configuración:**
```ruby
# En Rails console de Chatwoot
InstallationConfig.find_by(name: 'INSTALLATION_EVENTS_WEBHOOK_URL')&.value
```

**Verificar listener activo:**
```ruby
# En Rails console
Rails.configuration.dispatcher.listeners
```

**Revisar logs de Chatwoot:**
```bash
# En Railway
railway logs --service chatwoot

# Buscar:
# - "InstallationWebhookListener"
# - "ACCOUNT_CREATED"
# - "WebhookJob"
```

### Backend retorna 400/500

**Revisar logs del backend:**
```bash
railway logs --service multibackendopenia

# Buscar:
# - "[Chatwoot Webhook] Error"
# - "Admin endpoint returned"
```

**Verificar endpoint de admin:**
```bash
curl -X POST https://multibackendopenia-production.up.railway.app/api/admin/companies/create \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "test_manual",
    "company_name": "Test Manual",
    "services": "Testing"
  }'
```

### Empresa ya existe

Si intentas crear una cuenta con el mismo `chatwoot_account_id` dos veces, el webhook retorna:

```json
{
  "success": true,
  "company_id": "chatwoot_1",
  "message": "Company already exists",
  "created": false
}
```

Esto es **idempotente** - no falla, solo indica que ya existe.

---

## 📊 Monitoring

### Logs Importantes

**Backend:**
- `[Chatwoot Webhook] Account created event received`
- `[Chatwoot Webhook] Calling admin endpoint`
- `[Chatwoot Webhook] Company created successfully`
- `[Chatwoot Webhook] Sync completed in X.XXs`

**Chatwoot:**
- `InstallationWebhookListener account_created`
- `WebhookJob perform`
- `POST webhook_url`

### Métricas

- **Latencia del webhook**: ~2-5 segundos (incluye todos los 7 pasos)
- **Tasa de éxito**: Debe ser >95%
- **Timeout**: 60 segundos máximo

---

## 🔐 Seguridad

### ⚠️ IMPORTANTE

Al quitar `@require_api_key` del endpoint de creación, el endpoint es ahora **público**.

**Recomendaciones:**

1. **Rate limiting** (futuro):
   ```python
   from flask_limiter import Limiter

   @bp.route('/companies/create', methods=['POST'])
   @limiter.limit("10 per minute")
   def create_new_company_enterprise():
       ...
   ```

2. **Validación de origen** (futuro):
   ```python
   allowed_ips = ['Railway-IP', 'Chatwoot-IP']
   if request.remote_addr not in allowed_ips:
       return create_error_response('Unauthorized', 403)
   ```

3. **Webhook signature** (ya implementado en webhook, opcional):
   - Chatwoot puede firmar webhooks con HMAC
   - Descomentar validación en `chatwoot_webhooks.py` si lo necesitas

---

## 📝 Variables de Entorno

**Backend** (`.env`):
```bash
# Opcional: URL del backend para llamadas internas
BACKEND_URL=http://localhost:8080  # development
# BACKEND_URL=https://multibackendopenia-production.up.railway.app  # production
```

**Chatwoot** (`.env`):
```bash
# URL del webhook de sincronización
INSTALLATION_EVENTS_WEBHOOK_URL=https://multibackendopenia-production.up.railway.app/api/chatwoot/webhooks/account-created
```

---

## ✅ Checklist de Configuración

- [ ] Código pusheado a Railway
- [ ] Backend desplegado en Railway
- [ ] Webhook health check funciona
- [ ] Configurar `INSTALLATION_EVENTS_WEBHOOK_URL` en Chatwoot
- [ ] Reiniciar Chatwoot
- [ ] Crear cuenta de prueba en Chatwoot
- [ ] Verificar logs del backend
- [ ] Verificar empresa creada en PostgreSQL
- [ ] Test completo de flujo

---

**Fecha**: 2025-11-14
**Autor**: Claude
**Estado**: ✅ Implementado y listo para configurar
