# Flujo de Creación de Usuarios y Estrategia de Sincronización

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Flujo Completo de Signup](#flujo-completo-de-signup)
3. [Credenciales y Tokens Generados](#credenciales-y-tokens-generados)
4. [Eventos y Webhooks](#eventos-y-webhooks)
5. [Estrategias de Sincronización](#estrategias-de-sincronización)
6. [Implementación Recomendada](#implementación-recomendada)
7. [Código de Ejemplo](#código-de-ejemplo)
8. [Troubleshooting](#troubleshooting)

---

## Introducción

Este documento describe el flujo completo de creación de usuarios en Chatwoot Ilimitated, todas las credenciales generadas, y proporciona estrategias para sincronizar estos datos con tu backend externo de IA/Single-Tenant/Multi-Tenant.

### Objetivo

Permitir que cada usuario de Chatwoot tenga acceso a su propio panel personalizado en el backend externo, usando el `account_id` y `user_id` de Chatwoot como identificadores únicos.

### Arquitectura Actual

```
┌──────────────────────────────────────────────────────────────┐
│ Chatwoot User Signup                                         │
│ ├─ user_id: 1                                                │
│ ├─ account_id: 1                                             │
│ └─ credentials: tokens, pubsub_token, etc.                   │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ (Sincronización necesaria)
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│ Backend Externo (Railway)                                    │
│ ├─ Crear/Asociar empresa con account_id: 1                   │
│ ├─ Crear/Asociar usuario con user_id: 1                      │
│ └─ Configurar microservicios disponibles                     │
└──────────────────────────────────────────────────────────────┘
```

---

## Flujo Completo de Signup

### 1. Endpoint y Configuración

**Endpoint**: `POST /api/v1/accounts`
**Ruta Frontend**: `/app/auth/signup`
**Controller**: `app/controllers/api/v1/accounts_controller.rb`
**Autenticación**: No requerida (endpoint público)

**Configuración Requerida**:
```bash
# .env
ENABLE_ACCOUNT_SIGNUP=true  # Default: false

# Opcional (si usas captcha)
HCAPTCHA_SITE_KEY=your_site_key
HCAPTCHA_SECRET_KEY=your_secret_key
```

### 2. Request Body

```json
{
  "account_name": "Mi Empresa S.A.",
  "user_full_name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "SecureP@ssw0rd123",
  "locale": "es",
  "h_captcha_client_response": "captcha_token_here"
}
```

**Validaciones**:
- ✅ `ENABLE_ACCOUNT_SIGNUP` debe estar en `true`
- ✅ Email debe ser válido y único (no existir en la BD)
- ✅ `account_name` debe estar presente
- ✅ `user_full_name` debe estar presente
- ✅ Password debe cumplir requisitos de Devise
- ✅ hCaptcha válido (si está habilitado)

### 3. Flujo de Ejecución Detallado

```
┌─────────────────────────────────────────────────────────────┐
│ 1. POST /api/v1/accounts                                    │
│    └─ AccountsController#create                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ 2. Pre-validaciones (before_action)                         │
│    ├─ check_signup_enabled                                  │
│    │  └─ Verifica: ENABLE_ACCOUNT_SIGNUP == 'true'          │
│    ├─ validate_captcha                                      │
│    │  └─ Valida token de hCaptcha                           │
│    └─ ensure_account_name                                   │
│       └─ Verifica: account_name y user_full_name presentes  │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ 3. AccountBuilder.perform                                   │
│    (app/builders/account_builder.rb)                        │
│    ┌────────────────────────────────────────────────────┐   │
│    │ [BEGIN TRANSACTION]                                │   │
│    └────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ 4. Validación de Email                                      │
│    └─ Account::SignUpEmailValidationService.perform         │
│       ├─ Verifica que email no esté en disposable domains   │
│       └─ Verifica formato válido                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ 5. Validación de Usuario Único                              │
│    └─ User.exists?(email: 'juan@example.com')               │
│       └─ Si existe: raise UserExists error                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ 6. Crear Account (Cuenta/Empresa)                           │
│    Account.create!(                                          │
│      name: "Mi Empresa S.A.",                               │
│      locale: "es"                                           │
│    )                                                         │
│    ┌────────────────────────────────────────────────────┐   │
│    │ ✅ GENERADO: account.id = 1                        │   │
│    │    - name: "Mi Empresa S.A."                       │   │
│    │    - locale: "es"                                  │   │
│    │    - status: "active" (default)                    │   │
│    │    - created_at: timestamp                         │   │
│    └────────────────────────────────────────────────────┘   │
│    │                                                         │
│    │ [after_create_commit :notify_creation]                 │
│    │                                                         │
│    └─► Dispatcher.dispatch(ACCOUNT_CREATED)                 │
│        └─► InstallationWebhookListener ────────────────┐    │
└────────────────────────────────────────────────────────┼────┘
                   │                                     │
┌──────────────────▼─────────────────────────────────────┼────┐
│ 7. Crear User (Usuario)                                │    │
│    User.new(                                           │    │
│      email: "juan@example.com",                        │    │
│      password: "SecureP@ssw0rd123",                    │    │
│      name: "Juan Pérez"                                │    │
│    )                                                   │    │
│    │                                                   │    │
│    │ [before_validation :set_password_and_uid]        │    │
│    ├─► self.uid = email                               │    │
│    ├─► self.provider = "email" (default)              │    │
│    │                                                   │    │
│    │ [Línea 76: user.confirm]                         │    │
│    └─► Auto-confirma el usuario (sin email)           │    │
│       ├─ confirmed_at: timestamp                      │    │
│       └─ confirmation_token: nil                      │    │
│                                                        │    │
│    user.save!                                          │    │
│    ┌──────────────────────────────────────────────┐   │    │
│    │ ✅ GENERADO: user.id = 1                     │   │    │
│    │    - email: "juan@example.com"               │   │    │
│    │    - uid: "juan@example.com"                 │   │    │
│    │    - name: "Juan Pérez"                      │   │    │
│    │    - provider: "email"                       │   │    │
│    │    - confirmed_at: timestamp                 │   │    │
│    │    - encrypted_password: bcrypt_hash         │   │    │
│    │    - pubsub_token: (auto-generado)           │   │    │
│    │    - tokens: {} (JSON, para DeviseTokenAuth) │   │    │
│    └──────────────────────────────────────────────┘   │    │
│    │                                                   │    │
│    │ [after_create :create_access_token]               │    │
│    │ (via AccessTokenable concern)                     │    │
│    │                                                   │    │
│    └─► AccessToken.create!                            │    │
│        ┌──────────────────────────────────────────┐   │    │
│        │ ✅ GENERADO: access_token.token          │   │    │
│        │    - id: 1                               │   │    │
│        │    - owner_type: "User"                  │   │    │
│        │    - owner_id: 1                         │   │    │
│        │    - token: "secure_random_token_32chars"│   │    │
│        └──────────────────────────────────────────┘   │    │
└────────────────────────────────────────────────────────┼────┘
                   │                                     │
┌──────────────────▼─────────────────────────────────────┼────┐
│ 8. Crear AccountUser (Relación N:N)                    │    │
│    AccountUser.create!(                                │    │
│      account_id: 1,                                    │    │
│      user_id: 1,                                       │    │
│      role: AccountUser.roles['administrator']         │    │
│    )                                                   │    │
│    ┌──────────────────────────────────────────────┐   │    │
│    │ ✅ GENERADO: account_user.id = 1             │   │    │
│    │    - account_id: 1                           │   │    │
│    │    - user_id: 1                              │   │    │
│    │    - role: "administrator" (enum: 0)         │   │    │
│    │    - inviter_id: nil                         │   │    │
│    │    - active_at: nil                          │   │    │
│    └──────────────────────────────────────────────┘   │    │
│    │                                                   │    │
│    │ [after_create_commit]                             │    │
│    ├─► :notify_creation                                │    │
│    │   └─► Dispatcher.dispatch(AGENT_ADDED) ─────┐    │    │
│    └─► :create_notification_setting               │    │    │
│        └─► NotificationSettings.create!           │    │    │
└────────────────────────────────────────────────────┼───┼────┘
                   │                                 │   │
┌──────────────────▼─────────────────────────────────┼───┼────┐
│ 9. [COMMIT TRANSACTION]                            │   │    │
│    ✅ Todos los cambios persistidos en la BD       │   │    │
└────────────────────────────────────────────────────┼───┼────┘
                   │                                 │   │
┌──────────────────▼─────────────────────────────────┼───┼────┐
│ 10. send_auth_headers(user)                        │   │    │
│     (app/controllers/concerns/auth_helper.rb)      │   │    │
│     │                                               │   │    │
│     └─► user.create_new_auth_token                 │   │    │
│         (DeviseTokenAuth method)                   │   │    │
│         ┌──────────────────────────────────────┐   │   │    │
│         │ ✅ GENERADO: DeviseTokenAuth tokens  │   │   │    │
│         │    - access-token: JWT token         │   │   │    │
│         │    - client: client_id_hash          │   │   │    │
│         │    - uid: "juan@example.com"         │   │   │    │
│         │    - expiry: timestamp (2 meses)     │   │   │    │
│         │    - token-type: "Bearer"            │   │   │    │
│         │                                      │   │   │    │
│         │ Almacenado en:                       │   │   │    │
│         │ - user.tokens (JSON en BD)           │   │   │    │
│         │ - Response headers                   │   │   │    │
│         └──────────────────────────────────────┘   │   │    │
└────────────────────────────────────────────────────┼───┼────┘
                   │                                 │   │
┌──────────────────▼─────────────────────────────────┼───┼────┐
│ 11. render create.json.jbuilder                    │   │    │
│     (app/views/api/v1/accounts/create.json.jbuilder)│  │    │
│     │                                               │   │    │
│     └─► Response Body:                             │   │    │
│         {                                          │   │    │
│           "data": {                                │   │    │
│             "id": 1,                               │   │    │
│             "provider": "email",                   │   │    │
│             "uid": "juan@example.com",             │   │    │
│             "name": "Juan Pérez",                  │   │    │
│             "email": "juan@example.com",           │   │    │
│             "account_id": 1,                       │   │    │
│             "pubsub_token": "generated_token",     │   │    │
│             "role": "administrator",               │   │    │
│             "confirmed": true,                     │   │    │
│             "access_token": "personal_api_token",  │   │    │
│             "accounts": [                          │   │    │
│               {                                    │   │    │
│                 "id": 1,                           │   │    │
│                 "name": "Mi Empresa S.A.",         │   │    │
│                 "role": "administrator",           │   │    │
│                 "locale": "es"                     │   │    │
│               }                                    │   │    │
│             ]                                      │   │    │
│           }                                        │   │    │
│         }                                          │   │    │
│     │                                              │   │    │
│     └─► Response Headers:                         │   │    │
│         access-token: devise_token                │   │    │
│         client: client_id                         │   │    │
│         uid: juan@example.com                     │   │    │
│         expiry: 1234567890                        │   │    │
│         token-type: Bearer                        │   │    │
└────────────────────────────────────────────────────┼───┼────┘
                   │                                 │   │
┌──────────────────▼─────────────────────────────────▼───▼────┐
│ 12. Procesamiento Asíncrono de Eventos                     │
│     (EventDispatcherJob)                                    │
│     │                                                       │
│     ├─► ACCOUNT_CREATED event                              │
│     │   └─► InstallationWebhookListener ◄─────────────────┘│
│     │       └─► POST webhook (si configurado)              │
│     │           URL: INSTALLATION_EVENTS_WEBHOOK_URL       │
│     │           Payload: {                                 │
│     │             "event": "account_created",              │
│     │             "id": 1,                                 │
│     │             "name": "Mi Empresa S.A.",               │
│     │             "users": [                               │
│     │               {                                      │
│     │                 "id": 1,                             │
│     │                 "name": "Juan Pérez",                │
│     │                 "email": "juan@example.com",         │
│     │                 "type": "user"                       │
│     │               }                                      │
│     │             ]                                        │
│     │           }                                          │
│     │                                                      │
│     └─► AGENT_ADDED event ◄─────────────────────────────┘ │
│         └─► Varios listeners:                              │
│             - NotificationListener                         │
│             - WebhookListener                              │
│             - etc.                                         │
└────────────────────────────────────────────────────────────┘
```

### 4. Archivos Involucrados

| Archivo | Propósito | Líneas Clave |
|---------|-----------|--------------|
| `config/routes.rb` | Define ruta signup | 42 |
| `app/controllers/api/v1/accounts_controller.rb` | Controlador signup | 24-39 |
| `app/builders/account_builder.rb` | Lógica de creación | 7-16, 76 |
| `app/models/user.rb` | Modelo User | 42-150, 140-147 (webhook_data) |
| `app/models/account.rb` | Modelo Account | 131-136 (webhook_data), 164-166 (notify_creation) |
| `app/models/account_user.rb` | Relación N:N | after_create_commit callbacks |
| `app/models/access_token.rb` | Token API personal | 18-21 |
| `app/views/api/v1/accounts/create.json.jbuilder` | Response JSON | 1-25 |
| `app/listeners/installation_webhook_listener.rb` | Webhook listener | 2-24 |
| `lib/events/types.rb` | Definición de eventos | ACCOUNT_CREATED, AGENT_ADDED |

---

## Credenciales y Tokens Generados

### Resumen de Todas las Credenciales

Cuando un usuario se registra en Chatwoot, se generan **múltiples identificadores y tokens**:

```json
{
  "identifiers": {
    "user_id": 1,
    "account_id": 1,
    "account_user_id": 1,
    "email": "juan@example.com",
    "uid": "juan@example.com"
  },
  "authentication": {
    "personal_access_token": "secure_random_token_32_chars",
    "devise_access_token": "jwt_token_string",
    "devise_client": "client_hash",
    "devise_expiry": 1234567890,
    "pubsub_token": "secure_pubsub_token"
  },
  "account_info": {
    "account_name": "Mi Empresa S.A.",
    "locale": "es",
    "role": "administrator"
  }
}
```

### 1. Identificadores Principales

#### A. User ID
- **Campo**: `user.id`
- **Tipo**: Integer (autoincremental)
- **Propósito**: Identificador único global del usuario
- **Dónde se usa**:
  - Relaciones entre tablas
  - API endpoints (`/api/v1/profile`)
  - Sincronización con backend externo
- **Disponible en**:
  - Response body: `data.id`
  - Base de datos: `users.id`

#### B. Account ID
- **Campo**: `account.id`
- **Tipo**: Integer (autoincremental)
- **Propósito**: Identificador único de la cuenta/empresa
- **Dónde se usa**:
  - URLs: `/app/accounts/:accountId/...`
  - Scoping de recursos (multi-tenancy)
  - **Clave para Single Tenant: cada usuario ve su panel según su account_id**
- **Disponible en**:
  - Response body: `data.account_id` y `data.accounts[0].id`
  - Base de datos: `accounts.id`

#### C. Email / UID
- **Campos**: `user.email`, `user.uid`
- **Tipo**: String (unique)
- **Propósito**: Email del usuario (uid es igual a email)
- **Dónde se usa**:
  - Login
  - DeviseTokenAuth authentication
  - Identificación en webhooks
- **Disponible en**:
  - Response body: `data.email`, `data.uid`
  - Response headers: `uid`

### 2. Tokens de Autenticación

#### A. Personal Access Token (API Token)
**Generación**:
```ruby
# app/models/concerns/access_tokenable.rb
# after_create callback
AccessToken.create!(
  owner: user,
  token: SecureRandom.hex(32) # 64 caracteres hex
)
```

**Características**:
- ✅ **Permanente** (no expira automáticamente)
- ✅ Único por usuario
- ✅ Útil para integraciones API
- ✅ Se puede revocar manualmente

**Uso**:
```bash
curl -X GET "https://chatwoot.com/api/v1/profile" \
  -H "api_access_token: tu_personal_access_token_aqui"
```

**Disponible en**:
- Response body: `data.access_token`
- Base de datos: `access_tokens.token`

#### B. DeviseTokenAuth Tokens (Session Tokens)
**Generación**:
```ruby
# Llamado en AccountsController#create:
send_auth_headers(user)
  └─> user.create_new_auth_token
```

**Tokens generados**:
1. **access-token**: Token JWT para la sesión
2. **client**: Hash que identifica el cliente/dispositivo
3. **uid**: Email del usuario
4. **expiry**: Timestamp de expiración (2 meses por defecto)
5. **token-type**: Siempre "Bearer"

**Características**:
- ✅ Expiran en **2 meses** (configurable)
- ✅ Máximo **25 dispositivos** concurrentes
- ✅ Headers **NO cambian** en cada request (`change_headers_on_each_request = false`)
- ✅ Almacenados en `users.tokens` (JSON)

**Configuración** (`config/initializers/devise_token_auth.rb`):
```ruby
DeviseTokenAuth.setup do |config|
  config.token_lifespan = 2.months
  config.max_number_of_devices = 25
  config.change_headers_on_each_request = false
end
```

**Uso**:
```bash
curl -X GET "https://chatwoot.com/api/v1/conversations" \
  -H "access-token: devise_access_token" \
  -H "client: client_hash" \
  -H "uid: juan@example.com"
```

**Disponible en**:
- Response headers: `access-token`, `client`, `uid`, `expiry`, `token-type`
- Base de datos: `users.tokens` (JSON)

#### C. Pubsub Token (WebSocket Token)
**Generación**:
```ruby
# app/models/user.rb
# via Pubsubable concern
has_secure_token :pubsub_token
```

**Características**:
- ✅ Permanente
- ✅ Único por usuario
- ✅ Usado para ActionCable/WebSocket connections
- ✅ Auto-generado en creación de usuario

**Uso**:
```javascript
// Frontend WebSocket connection
const cable = ActionCable.createConsumer(
  `wss://chatwoot.com/cable?pubsub_token=${user.pubsub_token}`
);
```

**Disponible en**:
- Response body: `data.pubsub_token`
- Base de datos: `users.pubsub_token`

### 3. Información de Cuenta

#### Account Data
```json
{
  "id": 1,
  "name": "Mi Empresa S.A.",
  "locale": "es",
  "status": "active",
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Disponible en**:
- Response body: `data.accounts[0]`
- Base de datos: `accounts` table

#### AccountUser Data (Relación)
```json
{
  "id": 1,
  "account_id": 1,
  "user_id": 1,
  "role": "administrator",
  "inviter_id": null,
  "active_at": null
}
```

**Roles disponibles** (`app/models/account_user.rb`):
```ruby
enum role: { administrator: 0, agent: 1, custom_role: 2 }
```

**Disponible en**:
- Response body: `data.role`
- Base de datos: `account_users` table

### 4. Tabla Resumen de Credenciales

| Credencial | Tipo | Persistencia | Uso Principal | Disponible en Response |
|------------|------|--------------|---------------|------------------------|
| `user_id` | Integer | Permanente | Identificación usuario | ✅ `data.id` |
| `account_id` | Integer | Permanente | Multi-tenancy, Single Tenant | ✅ `data.account_id` |
| `email` | String | Permanente | Login, identificación | ✅ `data.email` |
| `personal_access_token` | String (64 chars) | Permanente | API integraciones | ✅ `data.access_token` |
| `devise_access_token` | JWT String | 2 meses | Sesión web/mobile | ✅ Header `access-token` |
| `devise_client` | Hash String | 2 meses | Identificar dispositivo | ✅ Header `client` |
| `pubsub_token` | String | Permanente | WebSocket/realtime | ✅ `data.pubsub_token` |
| `role` | Enum String | Permanente | Permisos | ✅ `data.role` |

---

## Eventos y Webhooks

### 1. Eventos Disparados

Durante el signup se disparan **2 eventos principales**:

#### A. ACCOUNT_CREATED (`account.created`)

**Trigger**: `Account` model `after_create_commit :notify_creation`

**Código** (`app/models/account.rb:164-166`):
```ruby
def notify_creation
  Rails.configuration.dispatcher.dispatch(ACCOUNT_CREATED, Time.zone.now, account: self)
end
```

**Listeners**:
- `InstallationWebhookListener` (async) → Ver sección siguiente

**Evento Data**:
```ruby
{
  account: Account instance
}
```

#### B. AGENT_ADDED (`agent.added`)

**Trigger**: `AccountUser` model `after_create_commit :notify_creation`

**Listeners**:
- `NotificationListener`
- `WebhookListener`
- Otros listeners según configuración

### 2. Installation Webhook

Chatwoot puede enviar un webhook cuando se crea una cuenta nueva, **ideal para sincronización con backend externo**.

#### Configuración

**Variables de entorno**:
```bash
# En SuperAdmin → Installation Config
INSTALLATION_EVENTS_WEBHOOK_URL=https://your-backend.railway.app/api/chatwoot/webhooks/account-created
```

O configurar via Rails console:
```ruby
InstallationConfig.create!(
  name: 'INSTALLATION_EVENTS_WEBHOOK_URL',
  value: 'https://your-backend.railway.app/api/chatwoot/webhooks/account-created'
)
```

#### Payload del Webhook

**Archivo**: `app/listeners/installation_webhook_listener.rb`

**Request**:
```http
POST https://your-backend.railway.app/api/chatwoot/webhooks/account-created
Content-Type: application/json

{
  "event": "account_created",
  "id": 1,
  "name": "Mi Empresa S.A.",
  "users": [
    {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "type": "user"
    }
  ]
}
```

**Código del Listener**:
```ruby
# app/listeners/installation_webhook_listener.rb
class InstallationWebhookListener < BaseListener
  def account_created(event)
    payload = account(event).webhook_data.merge(
      event: __method__.to_s,
      users: users(event)
    )
    deliver_webhook_payloads(payload)
  end

  private

  def account(event)
    event.data[:account]
  end

  def users(event)
    account(event).administrators.map(&:webhook_data)
  end

  def deliver_webhook_payloads(payload)
    webhook_url = InstallationConfig.find_by(name: 'INSTALLATION_EVENTS_WEBHOOK_URL')&.value
    WebhookJob.perform_later(webhook_url, payload) if webhook_url
  end
end
```

**Datos disponibles en webhook**:
- ✅ `account.id`
- ✅ `account.name`
- ✅ `user.id`
- ✅ `user.name`
- ✅ `user.email`

**⚠️ Limitación**: El webhook NO incluye tokens de autenticación por seguridad.

### 3. Webhook Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│ Account.create! completa                                   │
└──────────────────┬─────────────────────────────────────────┘
                   │
    ┌──────────────▼──────────────┐
    │ after_create_commit         │
    │ :notify_creation            │
    └──────────────┬──────────────┘
                   │
    ┌──────────────▼──────────────────────────────┐
    │ Dispatcher.dispatch(ACCOUNT_CREATED)        │
    └──────────────┬──────────────────────────────┘
                   │
    ┌──────────────▼──────────────────────────────┐
    │ EventDispatcherJob (Async)                  │
    └──────────────┬──────────────────────────────┘
                   │
    ┌──────────────▼──────────────────────────────┐
    │ InstallationWebhookListener.account_created │
    └──────────────┬──────────────────────────────┘
                   │
    ┌──────────────▼──────────────────────────────┐
    │ 1. Construir payload                        │
    │    - account.webhook_data                   │
    │    - users.map(&:webhook_data)              │
    └──────────────┬──────────────────────────────┘
                   │
    ┌──────────────▼──────────────────────────────┐
    │ 2. Obtener webhook_url                      │
    │    InstallationConfig.find_by(              │
    │      name: 'INSTALLATION_EVENTS_WEBHOOK_URL'│
    │    )                                        │
    └──────────────┬──────────────────────────────┘
                   │
    ┌──────────────▼──────────────────────────────┐
    │ 3. WebhookJob.perform_later                 │
    └──────────────┬──────────────────────────────┘
                   │
    ┌──────────────▼──────────────────────────────────────────┐
    │ POST https://your-backend.railway.app/api/webhooks      │
    │                                                          │
    │ {                                                        │
    │   "event": "account_created",                            │
    │   "id": 1,                                               │
    │   "name": "Mi Empresa S.A.",                             │
    │   "users": [                                             │
    │     {"id": 1, "name": "Juan Pérez", "email": "..."}      │
    │   ]                                                      │
    │ }                                                        │
    └──────────────────────────────────────────────────────────┘
```

---

## Estrategias de Sincronización

Para lograr que cada usuario vea su propio Single Tenant/Multi-Tenant según su `account_id`, existen **3 estrategias principales**:

### Estrategia 1: Installation Webhook (Recomendada)

**Ventajas**:
- ✅ Automática y en tiempo real
- ✅ No requiere modificar código de Chatwoot
- ✅ Desacoplada (backend externo es independiente)
- ✅ Fácil de mantener

**Desventajas**:
- ❌ No incluye tokens de autenticación
- ❌ Requiere configuración adicional

**Flujo**:
```
User Signup → ACCOUNT_CREATED event → InstallationWebhook
  → POST a backend externo
    → Backend crea/asocia empresa con account_id
      → Retorna éxito
```

**Implementación**: Ver sección "Código de Ejemplo - Estrategia 1"

---

### Estrategia 2: Frontend Callback (Simple)

**Ventajas**:
- ✅ Muy simple de implementar
- ✅ Tiene acceso a todos los tokens
- ✅ No requiere configuración en backend de Chatwoot

**Desventajas**:
- ❌ Depende del frontend (puede fallar si usuario cierra navegador)
- ❌ Menos confiable que webhook
- ❌ Requiere modificar frontend de Chatwoot

**Flujo**:
```
User Signup → Response con credentials
  → Frontend hace POST a backend externo
    → Backend crea empresa
      → Redirect a dashboard
```

**Implementación**: Ver sección "Código de Ejemplo - Estrategia 2"

---

### Estrategia 3: Custom After Signup Hook (Avanzada)

**Ventajas**:
- ✅ 100% confiable (sincrónico)
- ✅ Tiene acceso a todos los objetos y tokens
- ✅ Puede modificar respuesta si es necesario

**Desventajas**:
- ❌ Requiere modificar código de Chatwoot
- ❌ Puede afectar performance del signup
- ❌ Más difícil de mantener con actualizaciones

**Flujo**:
```
User Signup → AccountBuilder completa
  → Custom service sincroniza con backend externo
    → Almacena sync status en account.custom_attributes
      → Continúa con response normal
```

**Implementación**: Ver sección "Código de Ejemplo - Estrategia 3"

---

### Comparación de Estrategias

| Característica | Webhook (1) | Frontend (2) | Custom Hook (3) |
|----------------|-------------|--------------|-----------------|
| **Confiabilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Facilidad implementación** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Acceso a tokens** | ❌ | ✅ | ✅ |
| **Desacoplamiento** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Performance signup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Mantenibilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Requiere modificar Chatwoot** | ❌ | ✅ Mínimo | ✅ Medio |

**Recomendación**: Usar **Estrategia 1 (Webhook)** combinada con **Estrategia 2 (Frontend)** como fallback.

---

## Implementación Recomendada

### Arquitectura Híbrida (Webhook + Frontend Fallback)

```
┌─────────────────────────────────────────────────────────────┐
│ User completa signup en Chatwoot                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
    ┌──────────────▼──────────────┐
    │ AccountBuilder completa     │
    └──────┬─────────────┬─────────┘
           │             │
           │             │
    ┌──────▼─────────┐   │
    │ PRIMARY PATH   │   │
    │ (Confiable)    │   │
    │                │   │
    │ Webhook →      │   │
    │ Backend externo│   │
    │ crea empresa   │   │
    └────────────────┘   │
                         │
                  ┌──────▼─────────┐
                  │ FALLBACK PATH  │
                  │ (Por si acaso) │
                  │                │
                  │ Frontend recibe│
                  │ response →     │
                  │ POST a backend │
                  │ si webhook     │
                  │ no configurado │
                  └────────────────┘
```

### Flujo de Datos Completo

```
1. Usuario completa signup
   ↓
2. Chatwoot crea User + Account + AccountUser
   ↓
3. [PATH A - Webhook] ACCOUNT_CREATED event
   ├─ InstallationWebhookListener
   ├─ POST https://backend.railway.app/api/chatwoot/account-created
   ├─ Backend crea empresa con account_id
   └─ Backend retorna 200 OK

4. [PATH B - Frontend] Response con credentials
   ├─ Frontend recibe data.account_id, data.id, etc.
   ├─ Frontend verifica si webhook está configurado
   │  (checking backend for existing account)
   ├─ Si NO existe: POST a backend como fallback
   └─ Redirect a dashboard

5. Usuario accede a Single Tenant
   ├─ URL: /app/accounts/:accountId/single-tenant
   ├─ Frontend pasa: ?accountId=1
   └─ Backend externo muestra panel de empresa #1
```

### Configuración del Embedding con Account ID

**Modificación en** `app/javascript/dashboard/routes/dashboard/single_tenant/Index.vue`:

```vue
<template>
  <div class="flex flex-col h-full">
    <iframe-loader
      :src="singleTenantUrlWithAuth"
      :is-visible="true"
      class="flex-1 h-full"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import IframeLoader from '@/shared/components/IframeLoader.vue';

const route = useRoute();
const store = useStore();

const accountId = computed(() => route.params.accountId);
const userId = computed(() => store.getters.getCurrentUser.id);

// ✨ CLAVE: Pasar accountId y userId al backend externo
const singleTenantUrlWithAuth = computed(() => {
  const baseUrl = window.chatwootConfig?.singleTenantUrl ||
    'http://localhost:5173';

  // Construir URL con parámetros de autenticación
  const params = new URLSearchParams({
    accountId: accountId.value,
    userId: userId.value,
    // Opcional: pasar token para autenticación
    // token: store.getters['auth/getAuthToken']
  });

  return `${baseUrl}?${params.toString()}`;
});
</script>
```

**Backend externo recibe**:
```
GET https://backend.railway.app?accountId=1&userId=1
```

**Backend externo**:
1. Busca empresa con `chatwoot_account_id = 1`
2. Verifica que usuario tenga acceso a esa empresa
3. Renderiza panel personalizado para esa empresa

---

## Código de Ejemplo

### Estrategia 1: Installation Webhook

#### Backend Externo (Node.js/Express)

```javascript
// routes/chatwoot-webhooks.js
import express from 'express';
import { db } from '../db';
import { createCompany, associateUserToCompany } from '../services/company';

const router = express.Router();

/**
 * Webhook endpoint para account_created de Chatwoot
 * Configurar en Chatwoot SuperAdmin:
 * INSTALLATION_EVENTS_WEBHOOK_URL=https://backend.railway.app/api/chatwoot/webhooks/account-created
 */
router.post('/account-created', async (req, res) => {
  try {
    const { event, id: accountId, name: accountName, users } = req.body;

    // Validar que es el evento correcto
    if (event !== 'account_created') {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    console.log('[Webhook] Account created:', {
      accountId,
      accountName,
      users
    });

    // 1. Verificar si la empresa ya existe
    let company = await db.companies.findOne({
      where: { chatwoot_account_id: accountId }
    });

    if (!company) {
      // 2. Crear empresa en backend externo
      company = await createCompany({
        name: accountName,
        chatwoot_account_id: accountId,
        status: 'active',
        created_from: 'chatwoot_webhook'
      });

      console.log('[Webhook] Company created:', company.id);
    } else {
      console.log('[Webhook] Company already exists:', company.id);
    }

    // 3. Crear/asociar usuarios
    for (const user of users) {
      let existingUser = await db.users.findOne({
        where: { chatwoot_user_id: user.id }
      });

      if (!existingUser) {
        existingUser = await db.users.create({
          name: user.name,
          email: user.email,
          chatwoot_user_id: user.id,
          role: 'administrator' // Primer usuario es admin
        });

        console.log('[Webhook] User created:', existingUser.id);
      }

      // 4. Asociar usuario a empresa (si no está asociado)
      const association = await db.companyUsers.findOne({
        where: {
          company_id: company.id,
          user_id: existingUser.id
        }
      });

      if (!association) {
        await db.companyUsers.create({
          company_id: company.id,
          user_id: existingUser.id,
          role: 'administrator'
        });

        console.log('[Webhook] User associated to company');
      }
    }

    // 5. Inicializar microservicios para la empresa
    await initializeMicroservices(company.id, {
      ai_agents: true,
      document_management: true,
      conversations: true,
      multimedia: true,
      prompts: true
    });

    console.log('[Webhook] Microservices initialized');

    // 6. Retornar éxito
    res.status(200).json({
      success: true,
      company_id: company.id,
      message: 'Account synchronized successfully'
    });

  } catch (error) {
    console.error('[Webhook] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Endpoint para obtener empresa por account_id de Chatwoot
 * Usado por el frontend del iframe
 */
router.get('/company/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const { userId } = req.query;

    // 1. Buscar empresa por chatwoot_account_id
    const company = await db.companies.findOne({
      where: { chatwoot_account_id: parseInt(accountId) },
      include: [
        {
          model: db.users,
          where: userId ? { chatwoot_user_id: parseInt(userId) } : {},
          required: true // Inner join: solo si usuario tiene acceso
        },
        {
          model: db.microservices,
          where: { enabled: true }
        }
      ]
    });

    if (!company) {
      return res.status(404).json({
        error: 'Company not found or user does not have access'
      });
    }

    // 2. Retornar datos de la empresa y microservicios
    res.json({
      company: {
        id: company.id,
        name: company.name,
        chatwoot_account_id: company.chatwoot_account_id,
        status: company.status
      },
      microservices: company.microservices.map(ms => ({
        id: ms.id,
        name: ms.name,
        type: ms.type,
        enabled: ms.enabled,
        config: ms.config
      })),
      user_role: company.users[0]?.companyUsers?.role || 'viewer'
    });

  } catch (error) {
    console.error('[API] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function initializeMicroservices(companyId, services) {
  const microservicesToCreate = [];

  if (services.ai_agents) {
    microservicesToCreate.push({
      company_id: companyId,
      name: 'AI Agents',
      type: 'ai_agents',
      enabled: true,
      config: { max_agents: 5, model: 'gpt-4' }
    });
  }

  if (services.document_management) {
    microservicesToCreate.push({
      company_id: companyId,
      name: 'Document Management',
      type: 'documents',
      enabled: true,
      config: { max_storage_gb: 10 }
    });
  }

  // ... más microservicios

  await db.microservices.bulkCreate(microservicesToCreate);
}

export default router;
```

#### Backend Externo - Schema SQL

```sql
-- companies (empresas)
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  chatwoot_account_id INTEGER UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_from VARCHAR(50) DEFAULT 'manual',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- users (usuarios)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  chatwoot_user_id INTEGER UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- company_users (relación N:N)
CREATE TABLE company_users (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

-- microservices (microservicios disponibles por empresa)
CREATE TABLE microservices (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'ai_agents', 'documents', etc.
  enabled BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_companies_chatwoot_account ON companies(chatwoot_account_id);
CREATE INDEX idx_users_chatwoot_user ON users(chatwoot_user_id);
CREATE INDEX idx_company_users_company ON company_users(company_id);
CREATE INDEX idx_company_users_user ON company_users(user_id);
CREATE INDEX idx_microservices_company ON microservices(company_id);
```

---

### Estrategia 2: Frontend Callback

#### Modificar Frontend de Chatwoot

**Archivo**: `app/javascript/dashboard/routes/auth/Signup.vue`

```vue
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

const router = useRouter();
const store = useStore();

// ... código existente de signup form

async function handleSignup(formData) {
  try {
    // 1. Signup normal en Chatwoot
    const response = await store.dispatch('signup', formData);

    const {
      id: userId,
      account_id: accountId,
      email,
      name,
      access_token
    } = response.data.data;

    console.log('[Signup] Success:', { userId, accountId });

    // 2. ✨ NUEVO: Sincronizar con backend externo
    await syncWithExternalBackend({
      userId,
      accountId,
      email,
      name,
      accessToken: access_token
    });

    // 3. Redirect a dashboard
    router.push(`/app/accounts/${accountId}/dashboard`);

  } catch (error) {
    console.error('[Signup] Error:', error);
    // Mostrar error al usuario
  }
}

async function syncWithExternalBackend(userData) {
  try {
    const backendUrl = window.chatwootConfig?.singleTenantUrl ||
      'http://localhost:5173';

    // Verificar si ya existe la empresa
    const checkResponse = await axios.get(
      `${backendUrl}/api/chatwoot/company/${userData.accountId}`,
      { timeout: 3000 }
    );

    if (checkResponse.data.exists) {
      console.log('[Sync] Company already exists, skipping');
      return;
    }

  } catch (error) {
    if (error.response?.status === 404) {
      // Empresa no existe, crear
      try {
        await axios.post(
          `${backendUrl}/api/chatwoot/sync-account`,
          {
            user_id: userData.userId,
            account_id: userData.accountId,
            email: userData.email,
            name: userData.name,
            // NO enviar access_token por seguridad
          },
          { timeout: 5000 }
        );

        console.log('[Sync] Account synced successfully');

      } catch (syncError) {
        console.error('[Sync] Failed to sync account:', syncError);
        // No bloquear el signup por error de sincronización
      }
    }
  }
}
</script>
```

---

### Estrategia 3: Custom After Signup Hook

#### Modificar AccountBuilder

**Archivo**: `app/builders/account_builder.rb`

```ruby
# frozen_string_literal: true

class AccountBuilder
  include CustomExceptions::Account
  pattr_initialize [:account_name, :email!, :confirmed, :user, :user_full_name, :user_password, :super_admin, :locale]

  def perform
    if @user.nil?
      validate_email
      validate_user
    end

    ActiveRecord::Base.transaction do
      @account = create_account
      @user = create_and_link_user

      # ✨ NUEVO: Sincronizar con backend externo
      sync_with_external_backend
    end

    [@user, @account]
  rescue StandardError => e
    Rails.logger.debug e.inspect
    raise e
  end

  private

  # ... métodos existentes ...

  def sync_with_external_backend
    # Solo sincronizar si está configurado
    return unless ENV['ENABLE_EXTERNAL_SYNC'] == 'true'

    ExternalBackendSyncJob.perform_later(
      account_id: @account.id,
      user_id: @user.id,
      account_name: @account.name,
      user_name: @user.name,
      user_email: @user.email
    )

    Rails.logger.info "[AccountBuilder] External sync job queued for account #{@account.id}"
  rescue StandardError => e
    # No fallar el signup por error de sincronización
    Rails.logger.error "[AccountBuilder] External sync failed: #{e.message}"
  end
end
```

#### Crear Background Job

**Archivo**: `app/jobs/external_backend_sync_job.rb` (nuevo)

```ruby
# frozen_string_literal: true

class ExternalBackendSyncJob < ApplicationJob
  queue_as :default
  retry_on StandardError, wait: :exponentially_longer, attempts: 5

  def perform(account_id:, user_id:, account_name:, user_name:, user_email:)
    backend_url = ENV.fetch('SINGLE_TENANT_APP_URL', 'http://localhost:5173')
    endpoint = "#{backend_url}/api/chatwoot/sync-account"

    payload = {
      account_id: account_id,
      user_id: user_id,
      account_name: account_name,
      user_name: user_name,
      user_email: user_email,
      synced_at: Time.current.iso8601
    }

    response = HTTParty.post(
      endpoint,
      body: payload.to_json,
      headers: {
        'Content-Type' => 'application/json',
        'X-Chatwoot-Sync-Token' => ENV.fetch('EXTERNAL_SYNC_TOKEN', '')
      },
      timeout: 10
    )

    if response.success?
      # Almacenar resultado en custom_attributes
      account = Account.find(account_id)
      account.custom_attributes.merge!(
        'external_sync_status' => 'completed',
        'external_company_id' => response.parsed_response['company_id'],
        'synced_at' => Time.current.iso8601
      )
      account.save!

      Rails.logger.info "[ExternalBackendSync] Success for account #{account_id}"
    else
      Rails.logger.error "[ExternalBackendSync] Failed: #{response.code} - #{response.body}"
      raise StandardError, "Sync failed with status #{response.code}"
    end
  end
end
```

#### Configurar Variables de Entorno

```bash
# .env
ENABLE_EXTERNAL_SYNC=true
SINGLE_TENANT_APP_URL=https://backend.railway.app
EXTERNAL_SYNC_TOKEN=tu_token_secreto_aqui
```

---

## Troubleshooting

### Problema: Webhook no se dispara

**Causas**:
1. `INSTALLATION_EVENTS_WEBHOOK_URL` no configurado
2. Webhook URL incorrecta o no accesible
3. Backend externo no responde

**Soluciones**:

```ruby
# Verificar configuración en Rails console
rails c
> InstallationConfig.find_by(name: 'INSTALLATION_EVENTS_WEBHOOK_URL')&.value
# => "https://backend.railway.app/api/chatwoot/webhooks/account-created"

# Si no existe, crear:
> InstallationConfig.create!(
    name: 'INSTALLATION_EVENTS_WEBHOOK_URL',
    value: 'https://backend.railway.app/api/chatwoot/webhooks/account-created'
  )

# Verificar que webhook es alcanzable
> require 'net/http'
> uri = URI('https://backend.railway.app/api/chatwoot/webhooks/account-created')
> response = Net::HTTP.post(uri, {test: true}.to_json, {'Content-Type' => 'application/json'})
> response.code
# => "200"
```

**Debugging**:
```bash
# Ver logs de Sidekiq (donde corren los webhooks)
tail -f log/sidekiq.log | grep WebhookJob

# Ver logs de InstallationWebhookListener
tail -f log/development.log | grep InstallationWebhookListener
```

### Problema: Usuario no ve su empresa en Single Tenant

**Causas**:
1. Sincronización falló
2. Backend externo no encuentra empresa por account_id
3. Usuario no asociado a empresa

**Soluciones**:

```javascript
// En el iframe del Single Tenant, debugging en browser console:
console.log('Account ID:', new URLSearchParams(window.location.search).get('accountId'));
console.log('User ID:', new URLSearchParams(window.location.search).get('userId'));

// Verificar request al backend:
fetch(`https://backend.railway.app/api/chatwoot/company/${accountId}?userId=${userId}`)
  .then(r => r.json())
  .then(data => console.log('Company data:', data));
```

```ruby
# En Rails console, verificar datos:
rails c
> account = Account.find(1)
> account.custom_attributes
# => {"external_sync_status"=>"completed", "external_company_id"=>123, ...}

> user = User.find(1)
> user.accounts
# => [#<Account id: 1, ...>]
```

### Problema: Frontend callback falla silenciosamente

**Causa**: Error en `syncWithExternalBackend` no se muestra al usuario

**Solución**:

```vue
<script setup>
async function syncWithExternalBackend(userData) {
  try {
    // ... código de sync
  } catch (error) {
    console.error('[Sync] Error:', error);

    // Opcional: Mostrar notificación al usuario
    store.dispatch('notifications/show', {
      type: 'warning',
      message: 'Account created successfully, but external sync failed. Please contact support.',
      duration: 10000
    });

    // Opcional: Enviar error a tracking
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        tags: { feature: 'external_sync' },
        extra: { userData }
      });
    }
  }
}
</script>
```

### Problema: Performance del signup afectado

**Causa**: Sincronización síncrona en Estrategia 3

**Solución**: Usar background job (ya implementado en ejemplo) o cambiar a Estrategia 1 (Webhook)

```ruby
# MALO: Sincronización síncrona
def sync_with_external_backend
  HTTParty.post(...)  # Bloquea signup por 2-5 segundos
end

# BUENO: Sincronización asíncrona
def sync_with_external_backend
  ExternalBackendSyncJob.perform_later(...)  # No bloquea signup
end
```

### Problema: Duplicación de empresas

**Causa**: Múltiples sincronizaciones (webhook + frontend) crean empresa dos veces

**Solución**: Implementar idempotencia en backend externo

```javascript
// Backend externo
router.post('/sync-account', async (req, res) => {
  const { account_id } = req.body;

  // ✅ IDEMPOTENTE: Verificar antes de crear
  let company = await db.companies.findOne({
    where: { chatwoot_account_id: account_id }
  });

  if (company) {
    // Ya existe, retornar la existente
    return res.json({
      success: true,
      company_id: company.id,
      message: 'Company already exists',
      created: false
    });
  }

  // Crear nueva empresa
  company = await db.companies.create({
    chatwoot_account_id: account_id,
    // ... otros campos
  });

  res.json({
    success: true,
    company_id: company.id,
    message: 'Company created',
    created: true
  });
});
```

---

## Recursos Adicionales

### Archivos de Referencia

| Archivo | Propósito |
|---------|-----------|
| `config/routes.rb:42` | Ruta signup |
| `app/controllers/api/v1/accounts_controller.rb` | Controller signup |
| `app/builders/account_builder.rb` | Lógica creación |
| `app/models/user.rb:140-147` | webhook_data |
| `app/models/account.rb:131-136` | webhook_data |
| `app/listeners/installation_webhook_listener.rb` | Webhook listener |
| `app/views/api/v1/accounts/create.json.jbuilder` | Response JSON |

### Variables de Entorno Completas

```bash
# .env

# Signup
ENABLE_ACCOUNT_SIGNUP=true

# Captcha (opcional)
HCAPTCHA_SITE_KEY=your_site_key
HCAPTCHA_SECRET_KEY=your_secret_key

# Backend Externo
SINGLE_TENANT_APP_URL=https://backend.railway.app
MULTI_TENANT_APP_URL=https://backend.railway.app
IA_URL=https://backend.railway.app

# Sincronización Externa (Estrategia 3)
ENABLE_EXTERNAL_SYNC=true
EXTERNAL_SYNC_TOKEN=tu_token_secreto_aqui

# Installation Webhook (Estrategia 1)
# Configurar via SuperAdmin o Rails console
# INSTALLATION_EVENTS_WEBHOOK_URL=https://backend.railway.app/api/chatwoot/webhooks/account-created
```

### Documentación Relacionada

- **Embedding External Frontends**: `docs/embedding-external-frontends.md`
- **API Endpoints**: `docs/api-endpoints-part1.md`
- **Chatwoot API Docs**: https://www.chatwoot.com/developers/api/

---

## Próximos Pasos

1. ✅ Elegir estrategia de sincronización (recomendado: Webhook + Frontend fallback)
2. ✅ Implementar backend externo con endpoints `/account-created` y `/company/:accountId`
3. ✅ Configurar `INSTALLATION_EVENTS_WEBHOOK_URL` en Chatwoot SuperAdmin
4. ✅ Modificar componente Single Tenant para pasar `accountId` y `userId`
5. ✅ Probar flujo completo:
   - Signup nuevo usuario
   - Verificar webhook disparado
   - Verificar empresa creada en backend externo
   - Acceder a Single Tenant y verificar datos correctos
6. ✅ Implementar manejo de errores y reintentos
7. ✅ Monitorear logs y métricas

---

**Mantenido por**: Equipo Chatwoot Ilimitated
**Última actualización**: 2025-11-13
**Versión**: 1.0.0
