# Configuración de Sincronización Chatwoot → Backend

## 🚀 Inicio Rápido

Esta guía te llevará paso a paso para configurar la sincronización automática entre Chatwoot y tu backend multi-tenant.

---

## ✅ Pre-requisitos

- ✅ Backend desplegado en Railway (o corriendo localmente)
- ✅ PostgreSQL configurado y accesible
- ✅ Chatwoot instalado (producción o local)
- ✅ Acceso a Rails console de Chatwoot

---

## 📝 Paso 1: Configurar Variables de Entorno en Backend

### 1.1 Generar Token Secreto (Opcional pero recomendado)

```bash
# Generar token aleatorio seguro
python -c "import secrets; print(secrets.token_hex(32))"

# Output ejemplo:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### 1.2 Agregar a `.env` o Railway Variables

**Para Railway:**

Ve a tu proyecto → Variables → Agregar:

```
CHATWOOT_WEBHOOK_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Para desarrollo local:**

```bash
# .env
CHATWOOT_WEBHOOK_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
DATABASE_URL=postgresql://user:password@localhost:5432/multibackend
```

### 1.3 Verificar PostgreSQL

Asegúrate de que la tabla `companies` existe con el campo `chatwoot_account_id`:

```sql
-- Conectar a PostgreSQL
psql $DATABASE_URL

-- Verificar estructura de tabla
\d companies

-- Debería mostrar:
-- chatwoot_account_id | character varying(50) |
```

Si no existe, ejecuta el schema:

```bash
psql $DATABASE_URL < postgresql_schema.sql
```

---

## 📝 Paso 2: Configurar Webhook en Chatwoot

### Opción A: Via Rails Console (Recomendado)

```ruby
# Conectar a Rails console de Chatwoot
rails c

# Configurar webhook URL
InstallationConfig.create!(
  name: 'INSTALLATION_EVENTS_WEBHOOK_URL',
  value: 'https://multibackendopenia-production.up.railway.app/api/chatwoot/webhooks/account-created'
)

# Verificar configuración
InstallationConfig.find_by(name: 'INSTALLATION_EVENTS_WEBHOOK_URL')&.value
# => "https://multibackendopenia-production.up.railway.app/api/chatwoot/webhooks/account-created"
```

### Opción B: Via Environment Variable

Agregar a `.env` de Chatwoot:

```bash
INSTALLATION_EVENTS_WEBHOOK_URL=https://multibackendopenia-production.up.railway.app/api/chatwoot/webhooks/account-created
```

Luego reiniciar Chatwoot:

```bash
# Si es local
bundle exec rails restart

# Si es Railway
# Redeploy automático al detectar cambio en .env
```

---

## 📝 Paso 3: Testing Local

### 3.1 Instalar Dependencias

```bash
pip install requests
```

### 3.2 Ejecutar Script de Test

```bash
# Test completo (crea empresa, consulta, verifica métricas)
python test_chatwoot_webhook.py

# Test con URL personalizada
python test_chatwoot_webhook.py --url http://localhost:8080

# Solo consultar si empresa existe
python test_chatwoot_webhook.py --get 123

# Solo ver métricas
python test_chatwoot_webhook.py --metrics
```

### 3.3 Output Esperado

```
============================================================
        CHATWOOT WEBHOOK TEST SUITE
============================================================

ℹ Backend URL: http://localhost:8080
ℹ Timestamp: 2025-11-13T12:30:00

────────────────────────────────────────────────────────────

============================================================
          TEST: Account Created Webhook
============================================================

ℹ Enviando webhook a: http://localhost:8080/api/chatwoot/webhooks/account-created
ℹ Account ID: 999
ℹ Company Name: Test Company S.A.

Status Code: 200
Response Time: 0.45s

✓ Webhook recibido correctamente

Respuesta:
{
  "success": true,
  "data": {
    "company_id": "chatwoot_999",
    "company_name": "Test Company S.A.",
    "redis_prefix": "chatwoot_999:",
    "vectorstore_index": "chatwoot_999_documents",
    "message": "Company created and services initialized",
    "created": true
  }
}

✓ Empresa creada: chatwoot_999
ℹ Redis prefix: chatwoot_999:
ℹ Vectorstore: chatwoot_999_documents
ℹ Created: True
```

---

## 📝 Paso 4: Testing Producción

### 4.1 Verificar Backend Está Accesible

```bash
# Verificar que el endpoint existe
curl https://multibackendopenia-production.up.railway.app/api/system/info | jq .

# Buscar en la respuesta:
# "chatwoot_webhooks": "/api/chatwoot/webhooks"
# "chatwoot-auto-sync" en features
```

### 4.2 Crear Cuenta de Prueba en Chatwoot

1. Ve a tu Chatwoot signup: `https://chatwootultimate-production.up.railway.app/app/auth/signup`
2. Crea una cuenta nueva:
   - Email: `test@example.com`
   - Company: `Test Company S.A.`
   - Password: `TestPassword123!`

### 4.3 Verificar Sincronización

```bash
# Ver logs de Railway
railway logs --filter "Chatwoot"

# Deberías ver:
# [Chatwoot Webhook] Account created: 123 - Test Company S.A.
# [Chatwoot Sync] Creating company: chatwoot_123
# [Chatwoot Sync] Company created successfully: chatwoot_123
```

### 4.4 Verificar Empresa en PostgreSQL

```sql
-- Conectar a PostgreSQL de Railway
psql $DATABASE_URL

-- Buscar empresa creada
SELECT company_id, company_name, chatwoot_account_id, created_at
FROM companies
WHERE chatwoot_account_id = '123';

-- Output esperado:
--   company_id    |   company_name    | chatwoot_account_id |        created_at
-- ----------------+-------------------+---------------------+---------------------------
--  chatwoot_123   | Test Company S.A. | 123                 | 2025-11-13 12:30:00+00
```

### 4.5 Verificar en Frontend Embedido

1. Accede al iframe embedido en Chatwoot:
   ```
   https://chatwootultimate-production.up.railway.app/app/accounts/123/ia/dashboard
   ```

2. El iframe carga tu frontend con:
   ```
   https://multibackendopenia-production.up.railway.app/?accountId=123
   ```

3. Tu frontend hace:
   ```javascript
   GET /api/chatwoot/webhooks/company/123

   // Response:
   {
     "success": true,
     "data": {
       "exists": true,
       "company_id": "chatwoot_123",
       "company_name": "Test Company S.A.",
       ...
     }
   }
   ```

4. ✅ Dashboard carga con la empresa correcta

---

## 🔍 Troubleshooting

### Problema 1: Webhook no llega

**Síntomas:**
- Usuario signup en Chatwoot
- No hay logs en backend
- Empresa no se crea

**Diagnóstico:**

```ruby
# Rails console de Chatwoot
InstallationConfig.find_by(name: 'INSTALLATION_EVENTS_WEBHOOK_URL')&.value
# Verificar URL correcta

# Ver logs de Sidekiq (procesa webhooks)
tail -f log/sidekiq.log | grep WebhookJob
```

**Soluciones:**
1. Verificar URL webhook configurada
2. Verificar backend es accesible desde Chatwoot
3. Verificar Sidekiq está corriendo en Chatwoot

### Problema 2: Error 403 (Forbidden)

**Síntomas:**
- Webhook llega pero responde 403
- Error: "Invalid webhook signature"

**Solución:**

```bash
# Backend: Desactivar validación temporalmente
# En .env, comentar o remover:
# CHATWOOT_WEBHOOK_SECRET=...

# O configurar mismo secret en ambos lados
```

### Problema 3: Empresa duplicada

**Síntomas:**
- Múltiples empresas con mismo `chatwoot_account_id`

**Diagnóstico:**

```sql
SELECT company_id, chatwoot_account_id, created_at
FROM companies
WHERE chatwoot_account_id = '123'
ORDER BY created_at;
```

**Solución:**

```sql
-- Eliminar duplicados, mantener el más reciente
DELETE FROM companies
WHERE id NOT IN (
  SELECT MAX(id)
  FROM companies
  GROUP BY chatwoot_account_id
);

-- Verificar constraint unique existe
ALTER TABLE companies
ADD CONSTRAINT unique_chatwoot_account
UNIQUE (chatwoot_account_id);
```

### Problema 4: Frontend timeout

**Síntomas:**
- Usuario ve "Configurando..." por >30s
- Botón "Reintentar" aparece

**Diagnóstico:**

```bash
# Ver si webhook llegó
railway logs --filter "chatwoot_account_id:123"

# Verificar empresa existe
curl https://backend.railway.app/api/chatwoot/webhooks/company/123
```

**Solución:**

1. Si webhook no llegó: Verificar Paso 2
2. Si empresa no se creó: Ver logs de error en backend
3. Si empresa existe pero frontend no la encuentra: Bug en frontend, recargar página

---

## 📊 Monitoreo

### Métricas de Sincronización

```bash
# Ver métricas via API
curl https://backend.railway.app/api/chatwoot/webhooks/metrics | jq .

# Output:
{
  "success": true,
  "data": {
    "total_syncs": 150,
    "success_count": 148,
    "failed_count": 2,
    "success_rate": 98.67,
    "avg_latency_ms": 234.5,
    "recent_errors": [...],
    "last_sync": "2025-11-13T12:45:00Z"
  }
}
```

### Logs Importantes

**Backend (Railway):**

```bash
railway logs --filter "Chatwoot"

# Buscar:
# "[Chatwoot Webhook] Account created: ..."
# "[Chatwoot Sync] Creating company: ..."
# "[Chatwoot Sync] Company created successfully: ..."
# "[Chatwoot Sync] Error: ..." (si hay errores)
```

**Chatwoot (Rails):**

```bash
# Logs de webhooks
tail -f log/production.log | grep "InstallationWebhookListener"

# Logs de Sidekiq (procesa webhooks async)
tail -f log/sidekiq.log | grep "WebhookJob"
```

---

## 🎯 Verificación Final

Checklist de que todo está funcionando:

- [ ] Variable `CHATWOOT_WEBHOOK_SECRET` configurada (opcional)
- [ ] Variable `DATABASE_URL` configurada
- [ ] Tabla `companies` existe con campo `chatwoot_account_id`
- [ ] Webhook URL configurada en Chatwoot
- [ ] Backend accesible desde Chatwoot
- [ ] Tests locales pasan correctamente
- [ ] Signup test en Chatwoot crea empresa automáticamente
- [ ] Empresa aparece en PostgreSQL
- [ ] Frontend embedido carga correctamente
- [ ] Métricas muestran sincronizaciones exitosas

---

## 📚 Recursos Adicionales

- **Estrategia Completa**: `docs/audit/API-ENDPOIND-CHATWOOT/chatwoot-backend-sync-strategy.md`
- **Código Webhook**: `app/routes/chatwoot_webhooks.py`
- **Schema PostgreSQL**: `postgresql_schema.sql`
- **Frontend Embeds**: `docs/audit/API-ENDPOIND-CHATWOOT/embedding-external-frontends.md`

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa esta guía
2. Verifica logs de backend y Chatwoot
3. Ejecuta `test_chatwoot_webhook.py` para diagnóstico
4. Consulta métricas: `/api/chatwoot/webhooks/metrics`

---

**Última actualización**: 2025-11-13
**Versión**: 1.0.0
