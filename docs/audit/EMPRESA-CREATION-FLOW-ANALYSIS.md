# Análisis Completo: Flujo de Creación de Empresas

> **Fecha de Análisis**: 2025-11-14
> **Propósito**: Documentar el flujo ACTUAL de creación de empresas antes de integrar con Chatwoot
> **Estado**: Sistema funcional en producción - NO MODIFICAR sin análisis previo

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura General](#arquitectura-general)
3. [Backend: Endpoint de Creación](#backend-endpoint-de-creación)
4. [Servicios Involucrados](#servicios-involucrados)
5. [Schema de Base de Datos](#schema-de-base-de-datos)
6. [Frontend: Componentes y Flujo](#frontend-componentes-y-flujo)
7. [Flujo Completo Paso a Paso](#flujo-completo-paso-a-paso)
8. [Webhook de Chatwoot (Actual)](#webhook-de-chatwoot-actual)
9. [Configuraciones y Variables](#configuraciones-y-variables)
10. [Análisis de Gaps y Consideraciones](#análisis-de-gaps-y-consideraciones)

---

## Resumen Ejecutivo

### ¿Qué hace el sistema actualmente?

El sistema permite crear empresas (tenants) de **3 formas diferentes**:

1. **Manual vía API** → `POST /api/admin/companies/create` (con API key)
2. **Frontend Enterprise** → Formulario en `EnterpriseCompanyForm.vue`
3. **Webhook Chatwoot** → `POST /api/chatwoot/webhooks/account-created` (automático)

### Arquitectura de Datos

```
┌─────────────────────────────────────────────┐
│         POSTGRESQL (Source of Truth)        │
│  ┌─────────────────────────────────────┐   │
│  │ companies table                      │   │
│  │ - id, company_id, company_name       │   │
│  │ - redis_prefix, vectorstore_index    │   │
│  │ - chatwoot_account_id (nullable)     │   │
│  │ - treatment_durations (JSONB)        │   │
│  │ - ... 30+ campos                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ company_config_versions (versionado)│   │
│  │ - config_snapshot (JSONB)            │   │
│  │ - changed_fields, previous_values    │   │
│  │ - Trigger automático en INSERT/UPDATE│  │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ default_prompts (6 agentes)          │   │
│  │ - company_id, agent_name, template   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│      JSON FILES (Fallback/Compatibilidad)   │
│  - companies_config.json                    │
│  - extended_companies_config.json           │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│         REDIS (Cache + Vectorstore)          │
│  - Cache de configs (TTL: 5 min)            │
│  - Vectorstore per-company                   │
│  - Namespace: {company_id}:*                 │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│    COMPANY MANAGER (Singleton en memoria)    │
│  - Dict global de todas las empresas        │
│  - Usado por orchestrator, agentes, etc.    │
└─────────────────────────────────────────────┘
```

### Servicios Inicializados por Empresa

Cuando se crea una empresa, el sistema **DEBE inicializar** estos 7 componentes:

1. ✅ **PostgreSQL config** → Tabla `companies`
2. ✅ **Vectorstore index** → Redis `{company_id}_documents`
3. ✅ **Prompts default** → Tabla `default_prompts` (6 agentes)
4. ✅ **CompanyManager** → Singleton global en memoria
5. ✅ **Multi-Agent Orchestrator** → 6 agentes IA con LangGraph
6. ✅ **JSON fallback** → `companies_config.json`
7. ✅ **Redis metadata** → Keys de configuración

**⚠️ CRÍTICO**: Si falta alguno, el sistema falla parcialmente.

---

## Arquitectura General

### Flujos de Creación

```
┌──────────────────────────────────────────────────────────────┐
│                    FLUJO 1: MANUAL API                       │
└──────────────────────────────────────────────────────────────┘

[Cliente HTTP/cURL]
    ↓ POST /api/admin/companies/create
    ↓ Header: X-API-Key
    ↓
[admin.py:create_new_company_enterprise()]
    ↓
[INLINE: 7 pasos de inicialización]
    ↓
[Retorna: JSON con status de cada paso]


┌──────────────────────────────────────────────────────────────┐
│                  FLUJO 2: FRONTEND ENTERPRISE                │
└──────────────────────────────────────────────────────────────┘

[Vue Component: EnterpriseCompanyForm.vue]
    ↓ Validación de campos en frontend
    ↓
[Composable: useEnterprise.createEnterpriseCompany()]
    ↓ Llamada a API con X-API-Key
    ↓
[admin.py:create_new_company_enterprise()]
    ↓
[MISMO flujo que FLUJO 1]


┌──────────────────────────────────────────────────────────────┐
│              FLUJO 3: WEBHOOK CHATWOOT (ACTUAL)              │
└──────────────────────────────────────────────────────────────┘

[Chatwoot: Usuario crea cuenta]
    ↓ Webhook POST /api/chatwoot/webhooks/account-created
    ↓
[chatwoot_webhooks.py:handle_account_created()]
    ↓ Verificar firma (opcional)
    ↓
[chatwoot_webhooks.py:create_company_from_chatwoot()]
    ↓ INLINE: Lógica PROPIA (NO usa admin.py)
    ↓ ⚠️ PROBLEMA: No inicializa todos los servicios
    ↓
[_initialize_company_services()]
    ↓ Solo Redis metadata, vectorstore, orchestrator
    ↓ ❌ FALTA: Prompts, JSON fallback
```

---

## Backend: Endpoint de Creación

### Archivo Principal

**`app/routes/admin.py`** (líneas 1078-1349)

### Decoradores y Seguridad

```python
@bp.route('/companies/create', methods=['POST'])
@handle_errors
@require_api_key  # ← REQUIERE API KEY
def create_new_company_enterprise():
    """
    ENDPOINT ENTERPRISE - Crear nueva empresa con PostgreSQL como source of truth
    """
```

**⚠️ Importante**:
- Requiere header `X-API-Key`
- NO se puede llamar sin autenticación
- El webhook de Chatwoot NO PUEDE usar este endpoint directamente

### Payload Esperado

```json
{
  "company_id": "spa_wellness",           // ← REQUERIDO (lowercase, números, _)
  "company_name": "Wellness Spa & Relax", // ← REQUERIDO
  "services": "relajación, bienestar",    // ← REQUERIDO

  "business_type": "beauty",              // opcional (default: "general")
  "sales_agent_name": "Ana, terapeuta",   // opcional
  "model_name": "gpt-4o-mini",            // opcional (default)
  "max_tokens": 1500,                     // opcional (default)
  "temperature": 0.7,                     // opcional (default)

  "schedule_service_url": "http://...",   // opcional
  "chatwoot_account_id": "123",           // opcional (para sincronización)

  "treatment_durations": {                // opcional (JSONB)
    "masaje relajante": 60,
    "facial hidratante": 75
  },

  "timezone": "America/Bogota",           // opcional (default)
  "language": "es",                       // opcional (default)
  "currency": "COP",                      // opcional (default)
  "subscription_tier": "basic"            // opcional (default)
}
```

### Proceso Completo (7 Pasos)

#### PASO 1: Validación (líneas 1086-1111)

```python
# 1.1 Validar campos requeridos
required_fields = ['company_id', 'company_name', 'services']
for field in required_fields:
    if not data.get(field):
        return create_error_response(f"Missing required field: {field}", 400)

# 1.2 Normalizar company_id
company_id = data['company_id'].lower().strip()

# 1.3 Validar formato
import re
if not re.match(r'^[a-z0-9_]+$', company_id):
    return create_error_response(
        "company_id must contain only lowercase letters, numbers, and underscores",
        400
    )

# 1.4 Verificar que NO existe
enterprise_service = get_enterprise_company_service()
existing_config = enterprise_service.get_company_config(company_id, use_cache=False)
if existing_config and existing_config.notes != "Default emergency configuration":
    return create_error_response(f"Company {company_id} already exists", 400)
```

#### PASO 2: Crear EnterpriseCompanyConfig (líneas 1113-1152)

```python
enterprise_config = EnterpriseCompanyConfig(
    company_id=company_id,
    company_name=data['company_name'],
    business_type=data.get('business_type', 'general'),
    services=data['services'],

    # 🔑 REDIS ISOLATION (auto-generado)
    redis_prefix=f"{company_id}:",
    vectorstore_index=f"{company_id}_documents",

    # Configuración de agentes
    sales_agent_name=data.get('sales_agent_name', f"Asistente de {data['company_name']}"),
    model_name=data.get('model_name', 'gpt-4o-mini'),
    max_tokens=data.get('max_tokens', 1500),
    temperature=data.get('temperature', 0.7),
    max_context_messages=data.get('max_context_messages', 10),

    # Servicios externos
    schedule_service_url=data.get('schedule_service_url', 'http://127.0.0.1:4040'),
    schedule_integration_type=data.get('schedule_integration_type', 'basic'),
    chatwoot_account_id=data.get('chatwoot_account_id'),  # ← Opcional

    # Configuración de negocio
    treatment_durations=data.get('treatment_durations'),
    schedule_keywords=data.get('schedule_keywords'),
    emergency_keywords=data.get('emergency_keywords'),
    sales_keywords=data.get('sales_keywords'),
    required_booking_fields=data.get('required_booking_fields'),

    # Localización
    timezone=data.get('timezone', 'America/Bogota'),
    language=data.get('language', 'es'),
    currency=data.get('currency', 'COP'),

    # Límites y suscripción
    subscription_tier=data.get('subscription_tier', 'basic'),
    max_documents=data.get('max_documents', 1000),
    max_conversations=data.get('max_conversations', 10000),

    # Metadatos
    created_by="admin_api",
    modified_by="admin_api",
    notes=f"Created via API on {datetime.now().isoformat()}"
)
```

**Campos auto-generados importantes:**
- `redis_prefix` → `"{company_id}:"`
- `vectorstore_index` → `"{company_id}_documents"`
- `version` → `1` (incrementa con cada update)

#### PASO 3: Guardar en PostgreSQL (líneas 1154-1161)

```python
postgresql_success = enterprise_service.create_company(
    enterprise_config,
    created_by="admin_api"
)

if not postgresql_success:
    return create_error_response("Failed to save company configuration to PostgreSQL", 500)
```

**Lo que hace `enterprise_service.create_company()`**:

1. Conecta a PostgreSQL
2. Verifica que `company_id` no existe
3. Convierte `treatment_durations` (dict) → JSON string
4. Inserta en tabla `companies`
5. **TRIGGER AUTOMÁTICO**: Crea versión en `company_config_versions`
6. Limpia cache (Redis + memoria)
7. Retorna `True` si éxito

**Archivo**: `app/services/company_config_service.py:169-224`

#### PASO 4: Inicializar Vectorstore (líneas 1163-1176)

```python
vectorstore_status = "not_initialized"
try:
    from app.services.vectorstore_service import VectorstoreService
    vectorstore_service = VectorstoreService(company_id=company_id)

    health_status = vectorstore_service.check_health()
    if health_status.get('index_exists'):
        vectorstore_status = "initialized"
    else:
        vectorstore_status = "failed"
except Exception as e:
    logger.warning(f"Could not initialize vectorstore for {company_id}: {e}")
    vectorstore_status = f"failed: {str(e)}"
```

**Tecnología**: Redis Vector Store con embedding search

**Índice creado**: `{company_id}_documents`

**Ejemplo**: Para `spa_wellness` → `spa_wellness_documents`

#### PASO 5: Inicializar Prompts en PostgreSQL (líneas 1178-1225)

```python
prompt_status = "not_initialized"
try:
    from app.services.prompt_service import get_prompt_service
    prompt_service = get_prompt_service()

    # Verificar estado de la base de datos
    db_status = prompt_service.get_db_status()
    if not db_status.get('postgresql_available', False):
        logger.warning(f"PostgreSQL not available for {company_id}, will use fallback prompts")
        prompt_status = "fallback_mode (no PostgreSQL)"
    else:
        # Inicializar prompts default para la empresa
        logger.info(f"[REFRESH] [{company_id}] Initializing default prompts in PostgreSQL...")

        # Convertir a legacy config para obtener los parámetros necesarios
        legacy_config = enterprise_config.to_legacy_config()

        prompt_init_stats = prompt_service.initialize_default_prompts_for_company(
            company_id=company_id,
            company_config=legacy_config
        )

        if prompt_init_stats.get("success"):
            prompts_created = prompt_init_stats.get("prompts_created", 0)
            agents_list = ", ".join(prompt_init_stats.get("agents_initialized", []))
            prompt_status = f"initialized ({prompts_created} agents: {agents_list})"
            logger.info(f"[OK] [{company_id}] Default prompts initialized successfully")
        else:
            errors = prompt_init_stats.get("errors", [])
            prompt_status = f"partial_failure (errors: {len(errors)})"
            logger.error(f"[ERROR] [{company_id}] Failed to initialize prompts: {errors}")

        # Verificar que los prompts están disponibles
        agents_data = prompt_service.get_company_prompts(company_id)
        if agents_data:
            sources = {}
            for agent_name, agent_info in agents_data.items():
                source = agent_info.get('source', 'unknown')
                sources[source] = sources.get(source, 0) + 1

            logger.info(f"[OK] [{company_id}] Prompts verified - sources: {sources}")
        else:
            logger.warning(f"[WARN] [{company_id}] No prompts found after initialization")

except Exception as e:
    logger.error(f"Error initializing prompts for {company_id}: {e}")
    prompt_status = f"error: {str(e)}"
```

**Prompts creados (6 agentes)**:

1. `router_agent` → Clasificación de intención
2. `sales_agent` → Ventas y conversión
3. `support_agent` → Soporte general
4. `emergency_agent` → Emergencias médicas
5. `schedule_agent` → Agendamiento de citas
6. `availability_agent` → Consulta de disponibilidad

**Tabla destino**: `default_prompts`

**Constraint**: `UNIQUE(company_id, agent_name)`

#### PASO 6: Agregar al CompanyManager (líneas 1227-1241)

```python
company_manager_status = "not_added"
try:
    company_manager = get_company_manager()
    legacy_config = enterprise_config.to_legacy_config()

    # ⚠️ CRÍTICO: Agregar ANTES de crear orchestrator
    company_manager.add_company_config(legacy_config)
    company_manager_status = "added_to_legacy_manager"

    logger.info(f"[OK] Company {company_id} added to legacy CompanyManager")

except Exception as e:
    logger.error(f"Failed to add company to legacy manager: {e}")
    company_manager_status = f"failed: {str(e)}"
```

**¿Qué es CompanyManager?**

- Singleton global en memoria
- Dict de todas las empresas cargadas
- Usado por orchestrator, agentes, webhooks, etc.
- **DEBE existir antes de crear orchestrator**

**Archivo**: `app/config/company_config.py:CompanyConfigManager`

#### PASO 7: Inicializar Multi-Agent Orchestrator (líneas 1243-1262)

```python
orchestrator_status = "not_initialized"
try:
    if company_manager_status.startswith("added"):
        factory = get_multi_agent_factory()
        orchestrator = factory.get_orchestrator(company_id)

        if orchestrator:
            orchestrator_status = "initialized"
            logger.info(f"[OK] Orchestrator created successfully for {company_id}")
        else:
            orchestrator_status = "failed - could not create"
            logger.error(f"[ERROR] Orchestrator creation failed for {company_id}")
    else:
        orchestrator_status = "skipped - company_manager failed"
        logger.warning(f"[WARN] Skipping orchestrator creation due to company_manager failure")

except Exception as e:
    logger.error(f"Error initializing orchestrator for {company_id}: {e}")
    orchestrator_status = f"failed: {str(e)}"
```

**¿Qué es el Orchestrator?**

- Sistema multi-agente basado en LangGraph
- Coordina los 6 agentes según la intención del usuario
- Arquitectura: State Graph con routing dinámico
- Cache en memoria para performance

**Archivo**: `app/services/multi_agent_factory.py`

**Componentes creados**:
- Router con clasificación de intención
- 5 agentes especializados (sales, support, emergency, schedule, availability)
- Estado compartido entre agentes
- Memoria de conversación

#### PASO 8: Actualizar JSON Fallback (líneas 1265-1302)

```python
json_fallback_status = "not_updated"
try:
    config_file = os.getenv('COMPANIES_CONFIG_FILE', 'companies_config.json')

    # Leer configuración existente
    if os.path.exists(config_file):
        with open(config_file, 'r', encoding='utf-8') as f:
            existing_config = json.load(f)
    else:
        existing_config = {}

    # Agregar nueva empresa (formato legacy para compatibilidad)
    existing_config[company_id] = {
        "company_name": enterprise_config.company_name,
        "business_type": enterprise_config.business_type,
        "redis_prefix": enterprise_config.redis_prefix,
        "vectorstore_index": enterprise_config.vectorstore_index,
        "schedule_service_url": enterprise_config.schedule_service_url,
        "sales_agent_name": enterprise_config.sales_agent_name,
        "services": enterprise_config.services,
        "model_name": enterprise_config.model_name,
        "max_tokens": enterprise_config.max_tokens,
        "temperature": enterprise_config.temperature,
        "_source": "postgresql",
        "_created_via": "enterprise_api",
        "_version": enterprise_config.version
    }

    # Guardar archivo actualizado
    with open(config_file, 'w', encoding='utf-8') as f:
        json.dump(existing_config, f, indent=2, ensure_ascii=False)

    json_fallback_status = "updated"
    logger.info(f"[OK] JSON config updated for {company_id}")

except Exception as e:
    logger.warning(f"Could not update JSON fallback for {company_id}: {e}")
    json_fallback_status = f"failed: {str(e)}"
```

**Archivo destino**: `/home/user/multibackendopenIA/companies_config.json`

**Propósito**:
- Fallback si PostgreSQL no disponible
- Compatibilidad con código legacy
- Bootstrap para desarrollo local

#### PASO 9: Retornar Respuesta (líneas 1304-1345)

```json
{
  "success": true,
  "data": {
    "message": "Enterprise company spa_wellness created successfully",
    "company_id": "spa_wellness",
    "company_name": "Wellness Spa & Relax",
    "business_type": "beauty",
    "architecture": "enterprise_postgresql",

    "setup_status": {
      "postgresql_config_saved": true,
      "vectorstore_initialized": "initialized",
      "prompts_configured": "initialized (6 agents: router_agent, sales_agent, support_agent, emergency_agent, schedule_agent, availability_agent)",
      "company_manager_added": "added_to_legacy_manager",
      "orchestrator_initialized": "initialized",
      "json_fallback_updated": "updated"
    },

    "configuration": {
      "redis_prefix": "spa_wellness:",
      "vectorstore_index": "spa_wellness_documents",
      "timezone": "America/Bogota",
      "language": "es",
      "currency": "COP",
      "subscription_tier": "basic",
      "max_documents": 1000,
      "max_conversations": 10000
    },

    "system_ready": true,

    "endpoints_available": [
      "POST /documents (with X-Company-ID: spa_wellness)",
      "POST /conversations/{user_id}/test?company_id=spa_wellness",
      "POST /webhook/chatwoot (auto-detect company)",
      "GET /api/admin/companies/spa_wellness (configuration)",
      "PUT /api/admin/companies/spa_wellness (update configuration)"
    ],

    "next_steps": [
      "Test system: curl -X POST /conversations/test123/test?company_id=spa_wellness -d '{\"message\": \"Hola\"}'",
      "Upload documents: curl -X POST /documents -H 'X-Company-ID: spa_wellness' -d '{\"content\": \"...\"}'",
      "Update config: curl -X PUT /api/admin/companies/spa_wellness -d '{\"sales_agent_name\": \"New Name\"}'",
      "Configure Chatwoot webhook with company_id in conversation metadata"
    ]
  }
}
```

**Campos clave en respuesta**:
- `setup_status` → Estado de cada paso de inicialización
- `system_ready` → `true` solo si orchestrator inicializado
- `architecture` → Siempre `"enterprise_postgresql"`

---

## Servicios Involucrados

### 1. EnterpriseCompanyConfigService

**Archivo**: `app/services/company_config_service.py`

**Clase**: `EnterpriseCompanyConfigService`

#### Método: `create_company()`

```python
def create_company(self, config: EnterpriseCompanyConfig, created_by: str = "admin") -> bool:
    """
    Crear nueva empresa en PostgreSQL

    Returns:
        True si éxito, False si ya existe o falla
    """
    with psycopg2.connect(self.db_connection_string) as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            # 1. Verificar que no existe
            cursor.execute(
                "SELECT company_id FROM companies WHERE company_id = %s",
                (config.company_id,)
            )
            if cursor.fetchone():
                logger.warning(f"Company {config.company_id} already exists")
                return False

            # 2. Preparar datos para inserción
            insert_data = asdict(config)

            # 3. Convertir tipos Python → PostgreSQL
            if config.treatment_durations:
                insert_data['treatment_durations'] = json.dumps(config.treatment_durations)
            if config.schedule_keywords:
                insert_data['schedule_keywords'] = config.schedule_keywords  # Array
            # ... más conversiones

            # 4. Construir query dinámicamente
            columns = list(insert_data.keys())
            placeholders = [f"%({col})s" for col in columns]

            insert_query = f"""
                INSERT INTO companies ({', '.join(columns)})
                VALUES ({', '.join(placeholders)})
                RETURNING id, version
            """

            # 5. Ejecutar inserción
            cursor.execute(insert_query, insert_data)
            result = cursor.fetchone()

            # 6. Commit
            conn.commit()

            # 7. Limpiar cache
            self._invalidate_cache(config.company_id)

            logger.info(f"Company {config.company_id} created successfully (id={result['id']}, version={result['version']})")
            return True
```

**Trigger automático ejecutado**:

```sql
CREATE TRIGGER trigger_company_config_versioning
    AFTER INSERT OR UPDATE OR DELETE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION create_company_config_version();
```

Este trigger crea automáticamente un snapshot en `company_config_versions`.

#### Método: `get_company_config()`

**Fallback en cascada (5 niveles)**:

```python
def get_company_config(self, company_id: str, use_cache: bool = True):
    """
    Obtener configuración de empresa con fallback automático
    """
    # NIVEL 1: Memory cache (en proceso Python)
    if use_cache and company_id in self._memory_cache:
        return self._memory_cache[company_id]

    # NIVEL 2: Redis cache (distribuido, TTL 5 min)
    if use_cache:
        cached = self._get_from_redis_cache(company_id)
        if cached:
            return cached

    # NIVEL 3: PostgreSQL (source of truth)
    config = self._get_from_postgresql(company_id)
    if config:
        self._cache_config(company_id, config)
        return config

    # NIVEL 4: JSON file (fallback)
    config = self._get_from_json(company_id)
    if config:
        return config

    # NIVEL 5: Default emergency config
    return self._get_emergency_config(company_id)
```

**Performance**:
- Memory cache: ~0.001ms
- Redis cache: ~5ms
- PostgreSQL: ~20ms
- JSON file: ~50ms

### 2. CompanyConfigManager

**Archivo**: `app/config/company_config.py`

**Clase**: `CompanyConfigManager` (Singleton)

#### Arquitectura PostgreSQL-First

```python
class CompanyConfigManager:
    """
    Gestor centralizado de configuraciones de empresas

    ARQUITECTURA:
    1. PostgreSQL como fuente primaria
    2. JSON como fallback/compatibilidad
    3. Redis como cache distribuido
    """

    def __init__(self):
        self._configs: Dict[str, CompanyConfig] = {}
        self._postgresql_available = False
        self._enterprise_service = None

        # Cargar configuraciones al inicio
        self._load_company_configs()

    def _load_company_configs(self):
        """
        PASO 1: Intentar cargar desde PostgreSQL
        """
        if self._check_postgresql_available():
            self._postgresql_available = True
            self._enterprise_service = get_enterprise_company_service()

            companies_loaded = self._load_from_postgresql()
            if companies_loaded > 0:
                logger.info(f"[OK] Loaded {companies_loaded} companies from PostgreSQL")

                # Sincronizar JSON con PostgreSQL (bidireccional)
                self._sync_json_with_postgresql()
                return

        """
        PASO 2: Fallback a JSON si PostgreSQL falla
        """
        companies_loaded = self._load_from_json()
        if companies_loaded > 0:
            logger.info(f"[FALLBACK] Loaded {companies_loaded} companies from JSON")

            # Intentar migrar a PostgreSQL si está disponible
            if self._postgresql_available:
                self._migrate_json_to_postgresql()
            return

        """
        PASO 3: Configuración de emergencia
        """
        logger.warning("[EMERGENCY] No companies found, loading emergency config")
        self._load_emergency_config()
```

#### Método: `add_company_config()`

**Dual-write pattern** (memoria + PostgreSQL):

```python
def add_company_config(self, config: CompanyConfig):
    """
    Agregar configuración de empresa en runtime

    IMPORTANTE: Escribe en memoria Y PostgreSQL
    """
    # 1. Agregar a memoria (inmediato)
    self._configs[config.company_id] = config
    logger.info(f"Company {config.company_id} added to memory")

    # 2. También guardar en PostgreSQL si está disponible
    if self._postgresql_available and self._enterprise_service:
        try:
            # Convertir CompanyConfig → EnterpriseCompanyConfig
            enterprise_config = EnterpriseCompanyConfig(
                company_id=config.company_id,
                company_name=config.company_name,
                # ... mapeo de todos los campos
            )

            # Verificar si ya existe en PostgreSQL
            existing = self._enterprise_service.get_company_config(
                config.company_id,
                use_cache=False
            )

            if not existing:
                success = self._enterprise_service.create_company(
                    enterprise_config,
                    created_by="company_manager"
                )
                if success:
                    logger.info(f"[OK] Company {config.company_id} synced to PostgreSQL")
                else:
                    logger.warning(f"[WARN] Failed to sync {config.company_id} to PostgreSQL")
            else:
                logger.debug(f"Company {config.company_id} already exists in PostgreSQL")

        except Exception as e:
            logger.error(f"Error syncing company to PostgreSQL: {e}")
            # No fallar, la empresa ya está en memoria
```

**Por qué dual-write**:
- Memoria: Performance (usado por agentes en runtime)
- PostgreSQL: Persistencia (sobrevive reinicios)

### 3. PromptService

**Archivo**: `app/services/prompt_service.py`

#### Método: `initialize_default_prompts_for_company()`

```python
def initialize_default_prompts_for_company(
    self,
    company_id: str,
    company_config: CompanyConfig
) -> dict:
    """
    Inicializar prompts default para todos los agentes

    Returns:
        {
            "success": True/False,
            "prompts_created": 6,
            "agents_initialized": ["router_agent", "sales_agent", ...],
            "errors": []
        }
    """
    agents = [
        "router_agent",
        "sales_agent",
        "support_agent",
        "emergency_agent",
        "schedule_agent",
        "availability_agent"
    ]

    prompts_created = 0
    agents_initialized = []
    errors = []

    for agent_name in agents:
        try:
            # Obtener template base desde repositorio
            template = self._get_base_template(agent_name, company_config)

            # Insertar en default_prompts
            with psycopg2.connect(self.db_url) as conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        INSERT INTO default_prompts
                        (company_id, agent_name, template, description, category)
                        VALUES (%s, %s, %s, %s, %s)
                        ON CONFLICT (company_id, agent_name) DO NOTHING
                    """, (
                        company_id,
                        agent_name,
                        template,
                        f"Default prompt for {agent_name}",
                        self._get_category(agent_name)
                    ))

                    if cursor.rowcount > 0:
                        prompts_created += 1
                        agents_initialized.append(agent_name)

                    conn.commit()

        except Exception as e:
            logger.error(f"Error creating prompt for {agent_name}: {e}")
            errors.append(f"{agent_name}: {str(e)}")

    return {
        "success": prompts_created > 0,
        "prompts_created": prompts_created,
        "agents_initialized": agents_initialized,
        "errors": errors
    }
```

**Templates base**:
- Repositorio de prompts por tipo de negocio
- Personalización con variables: `{company_name}`, `{services}`, `{sales_agent_name}`
- Optimizados para cada agente

---

## Schema de Base de Datos

### Tabla: `companies`

**Archivo**: `postgresql_schema.sql` (líneas 62-110)

```sql
CREATE TABLE IF NOT EXISTS companies (
    -- Identificadores
    id BIGSERIAL PRIMARY KEY,
    company_id VARCHAR(100) UNIQUE NOT NULL,
    company_name VARCHAR(200) NOT NULL,

    -- Tipo de negocio
    business_type VARCHAR(100) DEFAULT 'general',
    services TEXT NOT NULL,

    -- Configuración Redis/Vector Store
    redis_prefix VARCHAR(150) NOT NULL,
    vectorstore_index VARCHAR(150) NOT NULL,

    -- Configuración de Agentes IA
    sales_agent_name VARCHAR(200) NOT NULL,
    model_name VARCHAR(100) DEFAULT 'gpt-4o-mini',
    max_tokens INTEGER DEFAULT 1500,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_context_messages INTEGER DEFAULT 10,

    -- Servicios Externos
    schedule_service_url VARCHAR(300),
    schedule_integration_type VARCHAR(50) DEFAULT 'basic',
    chatwoot_account_id VARCHAR(50),  -- ← Para sincronización

    -- Configuración de Negocio (JSONB y Arrays)
    treatment_durations JSONB,
    schedule_keywords TEXT[],
    emergency_keywords TEXT[],
    sales_keywords TEXT[],
    required_booking_fields TEXT[],

    -- Localización
    timezone VARCHAR(50) DEFAULT 'America/Bogota',
    language VARCHAR(10) DEFAULT 'es',
    currency VARCHAR(10) DEFAULT 'COP',

    -- Estado y Límites
    is_active BOOLEAN DEFAULT true,
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    max_documents INTEGER DEFAULT 1000,
    max_conversations INTEGER DEFAULT 10000,

    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'admin',
    modified_by VARCHAR(100) DEFAULT 'admin',
    version INTEGER DEFAULT 1,
    notes TEXT
);

-- Índices para performance
CREATE INDEX idx_companies_company_id ON companies(company_id);
CREATE INDEX idx_companies_active ON companies(is_active);
CREATE INDEX idx_companies_business_type ON companies(business_type);
CREATE INDEX idx_companies_chatwoot_account_id ON companies(chatwoot_account_id);
```

**Campos clave**:

| Campo | Tipo | Uso |
|-------|------|-----|
| `company_id` | VARCHAR(100) | ID único (lowercase, números, _) |
| `redis_prefix` | VARCHAR(150) | Namespace Redis: `{company_id}:` |
| `vectorstore_index` | VARCHAR(150) | Índice vectores: `{company_id}_documents` |
| `chatwoot_account_id` | VARCHAR(50) | Para sync con Chatwoot (nullable) |
| `treatment_durations` | JSONB | Duraciones de servicios (flexible) |
| `schedule_keywords` | TEXT[] | Array de keywords para agendamiento |

### Tabla: `company_config_versions`

**Versionado automático** (líneas 112-139)

```sql
CREATE TABLE IF NOT EXISTS company_config_versions (
    id BIGSERIAL PRIMARY KEY,
    company_pk BIGINT REFERENCES companies(id) ON DELETE CASCADE,
    company_id VARCHAR(100) NOT NULL,
    version INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE')),

    -- Snapshot completo (permite rollback)
    config_snapshot JSONB NOT NULL,
    changes_summary TEXT,

    -- Campos específicos que cambiaron
    changed_fields TEXT[],
    previous_values JSONB,
    new_values JSONB,

    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'admin',
    notes TEXT,

    UNIQUE(company_id, version)
);

CREATE INDEX idx_company_versions_company_id ON company_config_versions(company_id);
CREATE INDEX idx_company_versions_action ON company_config_versions(action);
```

**Función de trigger**:

```sql
CREATE OR REPLACE FUNCTION create_company_config_version()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO company_config_versions (
            company_pk, company_id, version, action,
            config_snapshot, changes_summary
        ) VALUES (
            NEW.id, NEW.company_id, NEW.version, 'CREATE',
            row_to_json(NEW)::jsonb,
            'Initial company configuration'
        );
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Detectar campos cambiados
        -- Crear snapshot con diff
        -- ...
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Beneficios**:
- Historial completo de cambios
- Rollback a versión anterior
- Auditoría de quién cambió qué

### Tabla: `default_prompts`

**Prompts por empresa** (líneas 45-55)

```sql
CREATE TABLE IF NOT EXISTS default_prompts (
    id BIGSERIAL PRIMARY KEY,
    company_id VARCHAR(100) NOT NULL,
    agent_name VARCHAR(100) NOT NULL,
    template TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(company_id, agent_name)
);

CREATE INDEX idx_default_prompts_company_id ON default_prompts(company_id);
CREATE INDEX idx_default_prompts_agent_name ON default_prompts(agent_name);
```

**Datos típicos**:

```sql
-- Para company_id = "spa_wellness"
INSERT INTO default_prompts (company_id, agent_name, template, category) VALUES
('spa_wellness', 'router_agent', 'Eres un clasificador...', 'routing'),
('spa_wellness', 'sales_agent', 'Eres Ana, terapeuta...', 'sales'),
('spa_wellness', 'support_agent', 'Eres asistente de soporte...', 'support'),
('spa_wellness', 'emergency_agent', 'Manejo de emergencias...', 'emergency'),
('spa_wellness', 'schedule_agent', 'Agendamiento de citas...', 'schedule'),
('spa_wellness', 'availability_agent', 'Consulta de disponibilidad...', 'availability');
```

---

## Frontend: Componentes y Flujo

### Estructura de Archivos

```
src/
├── components/
│   ├── enterprise/
│   │   ├── EnterpriseCompanyForm.vue     ← Formulario principal
│   │   ├── EnterpriseCompanyList.vue     ← Lista de empresas
│   │   └── EnterpriseCompanyDetail.vue   ← Detalle de empresa
│   └── shared/
│       └── CompanySelector.vue           ← Dropdown selector
├── composables/
│   ├── useEnterprise.js                  ← Lógica de empresas enterprise
│   ├── useCompanies.js                   ← Lógica de empresas básicas
│   └── useApiRequest.js                  ← Cliente HTTP
├── stores/
│   ├── companies.js                      ← Store Pinia
│   └── app.js                            ← Store global
└── services/
    └── api.js                            ← Función apiRequest()
```

### EnterpriseCompanyForm.vue

**Archivo**: `src/components/enterprise/EnterpriseCompanyForm.vue`

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- ID de empresa -->
    <div class="form-group">
      <label>ID de Empresa *</label>
      <input
        v-model="formData.company_id"
        type="text"
        pattern="[a-z0-9_]+"
        :readonly="isEditMode"
        required
      />
      <small>Solo minúsculas, números y guiones bajos</small>
    </div>

    <!-- Nombre de empresa -->
    <div class="form-group">
      <label>Nombre de Empresa *</label>
      <input
        v-model="formData.company_name"
        type="text"
        required
      />
    </div>

    <!-- Tipo de negocio -->
    <div class="form-group">
      <label>Tipo de Negocio</label>
      <select v-model="formData.business_type">
        <option value="general">General</option>
        <option value="healthcare">Salud</option>
        <option value="beauty">Belleza</option>
        <option value="dental">Dental</option>
        <option value="veterinary">Veterinaria</option>
      </select>
    </div>

    <!-- Servicios -->
    <div class="form-group">
      <label>Servicios *</label>
      <textarea
        v-model="formData.services"
        required
      ></textarea>
      <small>Describe los servicios que ofrece la empresa</small>
    </div>

    <!-- Agente de ventas -->
    <div class="form-group">
      <label>Nombre del Agente de Ventas</label>
      <input
        v-model="formData.sales_agent_name"
        type="text"
        placeholder="Ej: María, asesora especializada"
      />
    </div>

    <!-- URL servicio de agendamiento -->
    <div class="form-group">
      <label>URL Servicio de Agendamiento</label>
      <input
        v-model="formData.schedule_service_url"
        type="url"
        placeholder="http://127.0.0.1:4040"
      />
    </div>

    <!-- Treatment durations (JSON editor) -->
    <div class="form-group">
      <label>Duraciones de Tratamientos (opcional)</label>
      <textarea
        v-model="treatmentDurationsJson"
        @blur="parseTreatmentDurations"
        placeholder='{"masaje": 60, "facial": 75}'
      ></textarea>
      <small v-if="treatmentDurationsError" class="error">
        {{ treatmentDurationsError }}
      </small>
    </div>

    <!-- Configuración avanzada (collapse) -->
    <details>
      <summary>Configuración Avanzada</summary>

      <div class="form-group">
        <label>Timezone</label>
        <select v-model="formData.timezone">
          <option value="America/Bogota">América/Bogotá</option>
          <option value="America/Mexico_City">América/México</option>
          <option value="America/New_York">América/Nueva York</option>
        </select>
      </div>

      <div class="form-group">
        <label>Moneda</label>
        <select v-model="formData.currency">
          <option value="COP">COP (Peso Colombiano)</option>
          <option value="USD">USD (Dólar)</option>
          <option value="MXN">MXN (Peso Mexicano)</option>
        </select>
      </div>

      <div class="form-group">
        <label>Subscription Tier</label>
        <select v-model="formData.subscription_tier">
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>
    </details>

    <!-- Botones -->
    <div class="form-actions">
      <button type="submit" :disabled="isSubmitting">
        {{ isEditMode ? 'Actualizar' : 'Crear' }} Empresa
      </button>
      <button type="button" @click="$emit('cancel')">
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEnterprise } from '@/composables/useEnterprise'
import { useAppStore } from '@/stores/app'

const props = defineProps({
  company: Object,  // Para modo edición
  mode: {
    type: String,
    default: 'create'  // 'create' o 'edit'
  }
})

const emit = defineEmits(['success', 'cancel'])

const { createEnterpriseCompany } = useEnterprise()
const appStore = useAppStore()

const isEditMode = computed(() => props.mode === 'edit')
const isSubmitting = ref(false)

// Datos del formulario
const formData = ref({
  company_id: props.company?.company_id || '',
  company_name: props.company?.company_name || '',
  business_type: props.company?.business_type || 'general',
  services: props.company?.services || '',
  sales_agent_name: props.company?.sales_agent_name || '',
  schedule_service_url: props.company?.schedule_service_url || 'http://127.0.0.1:4040',
  treatment_durations: props.company?.treatment_durations || null,
  timezone: props.company?.timezone || 'America/Bogota',
  language: 'es',
  currency: props.company?.currency || 'COP',
  subscription_tier: props.company?.subscription_tier || 'basic'
})

const treatmentDurationsJson = ref(
  formData.value.treatment_durations
    ? JSON.stringify(formData.value.treatment_durations, null, 2)
    : ''
)
const treatmentDurationsError = ref('')

// Parsear treatment durations desde JSON
function parseTreatmentDurations() {
  if (!treatmentDurationsJson.value.trim()) {
    formData.value.treatment_durations = null
    treatmentDurationsError.value = ''
    return
  }

  try {
    const parsed = JSON.parse(treatmentDurationsJson.value)
    formData.value.treatment_durations = parsed
    treatmentDurationsError.value = ''
  } catch (e) {
    treatmentDurationsError.value = 'JSON inválido'
  }
}

// Submit del formulario
async function handleSubmit() {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    const response = await createEnterpriseCompany(formData.value)

    console.log('✅ Empresa creada:', response)
    emit('success', response)

  } catch (error) {
    console.error('❌ Error creando empresa:', error)
    alert(`Error: ${error.message}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

### useEnterprise.js

**Archivo**: `src/composables/useEnterprise.js`

```javascript
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { apiRequest } from '@/services/api'

export function useEnterprise() {
  const appStore = useAppStore()
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Crear empresa enterprise
   *
   * @param {Object} companyData - Datos de la empresa
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async function createEnterpriseCompany(companyData) {
    isLoading.value = true
    error.value = null

    try {
      // 1. Validar campos requeridos
      if (!companyData.company_id || !companyData.company_name || !companyData.services) {
        throw new Error('company_id, company_name y services son requeridos')
      }

      // 2. Validar formato de company_id
      const companyIdRegex = /^[a-z0-9_]+$/
      if (!companyIdRegex.test(companyData.company_id)) {
        throw new Error('El ID de empresa solo puede contener letras minúsculas, números y guiones bajos')
      }

      // 3. Validar treatment_durations si existe
      if (companyData.treatment_durations) {
        for (const [treatment, duration] of Object.entries(companyData.treatment_durations)) {
          if (typeof duration !== 'number' || !isFinite(duration) || duration <= 0) {
            throw new Error(`treatment_durations.${treatment} debe ser un número positivo`)
          }
        }
      }

      // 4. Llamar a API
      const response = await apiRequest('/api/admin/companies/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-API-Key': appStore.adminApiKey  // ← CRÍTICO
        },
        body: JSON.stringify(companyData)
      })

      // 5. Actualizar cache de empresas
      if (appStore.cache.companies) {
        appStore.cache.companies = null  // Invalidar para recargar
      }

      return response

    } catch (err) {
      error.value = err.message
      console.error('[useEnterprise] Error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obtener empresa por ID
   */
  async function getEnterpriseCompany(companyId) {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest(`/api/admin/companies/${companyId}`, {
        method: 'GET',
        headers: {
          'X-API-Key': appStore.adminApiKey
        }
      })

      return response

    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Actualizar empresa
   */
  async function updateEnterpriseCompany(companyId, updates) {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiRequest(`/api/admin/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': appStore.adminApiKey
        },
        body: JSON.stringify(updates)
      })

      // Invalidar cache
      if (appStore.cache.companies) {
        appStore.cache.companies = null
      }

      return response

    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    createEnterpriseCompany,
    getEnterpriseCompany,
    updateEnterpriseCompany
  }
}
```

**Validaciones en frontend**:
- `company_id`: Regex `/^[a-z0-9_]+$/`
- `treatment_durations`: Números positivos
- Campos requeridos: `company_id`, `company_name`, `services`

### api.js

**Archivo**: `src/services/api.js`

```javascript
import { useAppStore } from '@/stores/app'

/**
 * Cliente HTTP centralizado
 *
 * Auto-agrega headers comunes:
 * - Content-Type
 * - X-Company-ID (empresa actual)
 */
export async function apiRequest(endpoint, options = {}) {
  const appStore = useAppStore()

  // URL base
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  const url = `${baseURL}${endpoint}`

  // Headers por defecto
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  // Agregar X-Company-ID si existe
  if (appStore.currentCompanyId) {
    defaultHeaders['X-Company-ID'] = appStore.currentCompanyId
  }

  // Merge headers
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {})
  }

  // Opciones finales
  const fetchOptions = {
    ...options,
    headers
  }

  try {
    const response = await fetch(url, fetchOptions)

    // Parsear JSON
    const data = await response.json()

    // Error HTTP
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Request failed')
    }

    // Extraer data si viene en { success: true, data: {...} }
    if (data.success && data.data) {
      return data.data
    }

    return data

  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error)
    throw error
  }
}
```

---

## Flujo Completo Paso a Paso

### Flujo 1: Creación Manual vía API

```
┌─────────────────────────────────────────────────────────────┐
│ PASO 1: Cliente hace POST request                          │
└─────────────────────────────────────────────────────────────┘

POST /api/admin/companies/create
Headers:
  Content-Type: application/json
  X-API-Key: abc123xyz
Body:
  {
    "company_id": "spa_wellness",
    "company_name": "Wellness Spa",
    "services": "relajación, masajes",
    "treatment_durations": {
      "masaje": 60
    }
  }

         ↓

┌─────────────────────────────────────────────────────────────┐
│ PASO 2: Flask recibe request                               │
└─────────────────────────────────────────────────────────────┘

[Flask] app/routes/admin.py
  ↓
@require_api_key decorator
  ↓ Valida X-API-Key
  ↓ ✅ OK
  ↓
create_new_company_enterprise()
  ↓ Valida campos
  ↓ Valida formato company_id
  ↓ Verifica que no existe

         ↓

┌─────────────────────────────────────────────────────────────┐
│ PASO 3: Crear EnterpriseCompanyConfig                      │
└─────────────────────────────────────────────────────────────┘

enterprise_config = EnterpriseCompanyConfig(
  company_id="spa_wellness",
  company_name="Wellness Spa",
  services="relajación, masajes",
  redis_prefix="spa_wellness:",              ← Auto-generado
  vectorstore_index="spa_wellness_documents", ← Auto-generado
  treatment_durations={"masaje": 60},
  created_by="admin_api",
  version=1                                  ← Inicial
)

         ↓

┌─────────────────────────────────────────────────────────────┐
│ PASO 4: PostgreSQL INSERT                                  │
└─────────────────────────────────────────────────────────────┘

[PostgreSQL]
INSERT INTO companies (
  company_id, company_name, services,
  redis_prefix, vectorstore_index,
  treatment_durations, ...
) VALUES (...);

  ↓ RETURNING id, version
  ↓ id=42, version=1

[TRIGGER AUTOMÁTICO]
INSERT INTO company_config_versions (
  company_pk=42,
  company_id='spa_wellness',
  version=1,
  action='CREATE',
  config_snapshot='{"company_id": "spa_wellness", ...}'
);

         ↓

┌─────────────────────────────────────────────────────────────┐
│ PASO 5: Inicializar Vectorstore                            │
└─────────────────────────────────────────────────────────────┘

[Redis Vector Store]
Crear índice: "spa_wellness_documents"
  ↓
Estado: "initialized"

         ↓

┌─────────────────────────────────────────────────────────────┐
│ PASO 6: Inicializar Prompts                                │
└─────────────────────────────────────────────────────────────┘

[PostgreSQL]
INSERT INTO default_prompts VALUES
  ('spa_wellness', 'router_agent', 'Template...', 'routing'),
  ('spa_wellness', 'sales_agent', 'Template...', 'sales'),
  ('spa_wellness', 'support_agent', 'Template...', 'support'),
  ('spa_wellness', 'emergency_agent', 'Template...', 'emergency'),
  ('spa_wellness', 'schedule_agent', 'Template...', 'schedule'),
  ('spa_wellness', 'availability_agent', 'Template...', 'availability');

  ↓
6 prompts creados

         ↓

┌─────────────────────────────────────────────────────────────┐
│ PASO 7: Agregar a CompanyManager                           │
└─────────────────────────────────────────────────────────────┘

[Memoria Python - Singleton]
CompanyManager._configs['spa_wellness'] = CompanyConfig(...)

  ↓
Estado: "added_to_legacy_manager"

         ↓

┌─────────────────────────────────────────────────────────────┐
│ PASO 8: Inicializar Orchestrator                           │
└─────────────────────────────────────────────────────────────┘

[Multi-Agent Factory]
factory.get_orchestrator('spa_wellness')
  ↓
[LangGraph State Graph]
  - Router Agent (clasificación)
  - Sales Agent
  - Support Agent
  - Emergency Agent
  - Schedule Agent
  - Availability Agent
  ↓
Cache en memoria
  ↓
Estado: "initialized"

         ↓

┌─────────────────────────────────────────────────────────────┐
│ PASO 9: Actualizar JSON Fallback                           │
└─────────────────────────────────────────────────────────────┘

[Filesystem]
Leer: companies_config.json
  ↓
Agregar:
  "spa_wellness": {
    "company_name": "Wellness Spa",
    "redis_prefix": "spa_wellness:",
    ...
    "_source": "postgresql",
    "_version": 1
  }
  ↓
Escribir: companies_config.json

         ↓

┌─────────────────────────────────────────────────────────────┐
│ PASO 10: Retornar Respuesta                                │
└─────────────────────────────────────────────────────────────┘

HTTP 200 OK
{
  "success": true,
  "data": {
    "company_id": "spa_wellness",
    "setup_status": {
      "postgresql_config_saved": true,
      "vectorstore_initialized": "initialized",
      "prompts_configured": "initialized (6 agents: ...)",
      "company_manager_added": "added_to_legacy_manager",
      "orchestrator_initialized": "initialized",
      "json_fallback_updated": "updated"
    },
    "system_ready": true
  }
}
```

---

## Webhook de Chatwoot (Actual)

### Archivo

**`app/routes/chatwoot_webhooks.py`**

### Proceso Actual

```python
@bp.route('/account-created', methods=['POST'])
@handle_errors
def handle_account_created():
    """
    Webhook de Chatwoot cuando se crea una cuenta nueva
    """
    start_time = time.time()

    try:
        # 1. Validar firma del webhook (opcional)
        if WEBHOOK_SECRET and not _verify_webhook_signature(request):
            logger.warning("[Chatwoot Webhook] Invalid webhook signature")
            return create_error_response('Invalid webhook signature', 403)

        # 2. Obtener y validar payload
        data = request.get_json()

        if not data:
            return create_error_response('No data received', 400)

        # 3. Extraer datos de Chatwoot
        chatwoot_account_id = str(data.get('id'))
        account_name = data.get('name')
        users = data.get('users', [])

        if not chatwoot_account_id or not account_name:
            return create_error_response('Missing account id or name', 400)

        logger.info(f"[Chatwoot Webhook] Account created: {chatwoot_account_id} - {account_name}")

        # 4. Crear empresa
        result = create_company_from_chatwoot(
            chatwoot_account_id=chatwoot_account_id,
            account_name=account_name,
            users=users
        )

        # 5. Trackear métricas
        duration = time.time() - start_time
        _track_sync_metrics(
            success=result['success'],
            duration=duration,
            error=result.get('error')
        )

        # 6. Retornar resultado
        if result['success']:
            return create_success_response(result)
        else:
            return create_error_response(result.get('error', 'Unknown error'), 500)

    except Exception as e:
        duration = time.time() - start_time
        logger.error(f"[Chatwoot Webhook] Error: {e}", exc_info=True)
        _track_sync_metrics(success=False, duration=duration, error=str(e))
        return create_error_response(f"Error processing webhook: {str(e)}", 500)
```

### Función: `create_company_from_chatwoot()`

**⚠️ PROBLEMA**: Lógica INLINE propia, NO usa el endpoint de admin

```python
def create_company_from_chatwoot(
    chatwoot_account_id: str,
    account_name: str,
    users: list
) -> dict:
    """
    Crear empresa desde webhook de Chatwoot

    ⚠️ PROBLEMA: NO usa admin.py, tiene lógica duplicada
    """
    try:
        enterprise_service = get_enterprise_company_service()

        # 1. Verificar si ya existe (idempotencia)
        existing = _find_company_by_chatwoot_id(chatwoot_account_id)
        if existing:
            logger.info(f"[Chatwoot Sync] Company already exists for chatwoot_account_id {chatwoot_account_id}")
            return {
                'success': True,
                'company_id': existing.company_id,
                'company_name': existing.company_name,
                'redis_prefix': existing.redis_prefix,
                'vectorstore_index': existing.vectorstore_index,
                'message': 'Company already exists',
                'created': False
            }

        # 2. Generar company_id único
        company_id = f"chatwoot_{chatwoot_account_id}"

        # 3. Configurar empresa
        config = EnterpriseCompanyConfig(
            company_id=company_id,
            company_name=account_name,
            business_type='general',
            services='Asistente de IA, Gestión de documentos, Conversaciones',

            # Redis isolation
            redis_prefix=f"chatwoot_{chatwoot_account_id}:",
            vectorstore_index=f"chatwoot_{chatwoot_account_id}_documents",

            # Agentes IA
            sales_agent_name=f"Asistente de {account_name}",
            model_name='gpt-4o-mini',
            max_tokens=1500,
            temperature=0.7,

            # Servicios externos
            schedule_service_url=os.getenv('SCHEDULE_SERVICE_URL', 'http://127.0.0.1:4040'),
            schedule_integration_type='basic',

            # 🔑 CLAVE: Guardar chatwoot_account_id para sincronización
            chatwoot_account_id=chatwoot_account_id,

            # Configuración de negocio
            timezone='America/Bogota',
            language='es',
            currency='COP',

            # Límites iniciales
            is_active=True,
            subscription_tier='basic',
            max_documents=1000,
            max_conversations=10000,

            # Metadatos
            created_by='chatwoot_webhook',
            modified_by='chatwoot_webhook',
            notes=f'Auto-created from Chatwoot account_created webhook. '
                  f'Users: {len(users)}. '
                  f'Created: {datetime.now().isoformat()}'
        )

        # 4. Crear en PostgreSQL
        logger.info(f"[Chatwoot Sync] Creating company: {company_id}")
        success = enterprise_service.create_company(config, created_by='chatwoot_webhook')

        if success:
            # 5. Inicializar servicios (vectorstore, redis, orchestrator)
            logger.info(f"[Chatwoot Sync] Initializing services for: {company_id}")
            _initialize_company_services(company_id)

            logger.info(f"[Chatwoot Sync] Company created successfully: {company_id}")
            return {
                'success': True,
                'company_id': company_id,
                'company_name': account_name,
                'redis_prefix': config.redis_prefix,
                'vectorstore_index': config.vectorstore_index,
                'message': 'Company created and services initialized',
                'created': True
            }
        else:
            logger.error(f"[Chatwoot Sync] Failed to create company in database: {company_id}")
            return {
                'success': False,
                'error': 'Failed to create company in database'
            }

    except Exception as e:
        logger.error(f"[Chatwoot Sync] Error creating company from Chatwoot: {e}", exc_info=True)
        return {
            'success': False,
            'error': str(e)
        }
```

### Función: `_initialize_company_services()`

**⚠️ PROBLEMA**: Inicialización PARCIAL, faltan servicios

```python
def _initialize_company_services(company_id: str):
    """
    Inicializar servicios para nueva empresa

    ⚠️ PROBLEMA: Solo inicializa 3 cosas:
    - Redis metadata
    - Vectorstore (pre-warm)
    - Orchestrator (pre-warm)

    ❌ FALTA:
    - Prompts en PostgreSQL
    - JSON fallback
    """
    try:
        from app.services.redis_service import get_redis_client
        from app.config.company_config import get_company_manager

        redis_client = get_redis_client()
        company_manager = get_company_manager()

        # 1. Obtener configuración
        config = company_manager.get_company_config(company_id)
        if not config:
            logger.warning(f"[Chatwoot Sync] Config not found for company: {company_id}")
            return

        # 2. Crear metadata inicial en Redis
        prefix = config.redis_prefix
        metadata = {
            'company_id': company_id,
            'created_at': datetime.now().isoformat(),
            'source': 'chatwoot_webhook',
            'status': 'active',
            'chatwoot_account_id': config.chatwoot_account_id
        }

        redis_client.setex(
            f"{prefix}metadata",
            86400,  # 24 horas
            json.dumps(metadata)
        )
        logger.info(f"[Chatwoot Sync] Redis metadata created for: {company_id}")

        # 3. Pre-warm vectorstore (opcional)
        try:
            from app.services.vectorstore_service import get_vectorstore_service
            vectorstore_service = get_vectorstore_service()
            # El índice se crea automáticamente cuando se usa
            logger.info(f"[Chatwoot Sync] Vectorstore service ready for: {company_id}")
        except Exception as e:
            logger.warning(f"[Chatwoot Sync] Could not pre-warm vectorstore: {e}")

        # 4. Pre-warm orchestrator (opcional)
        try:
            from app.services.multi_agent_factory import get_multi_agent_factory
            factory = get_multi_agent_factory()

            # Esto crea el orchestrator en cache
            orchestrator = factory.get_orchestrator(company_id)

            if orchestrator:
                logger.info(f"[Chatwoot Sync] Orchestrator pre-warmed for: {company_id}")
            else:
                logger.warning(f"[Chatwoot Sync] Orchestrator initialization skipped for: {company_id}")
        except Exception as e:
            logger.warning(f"[Chatwoot Sync] Could not pre-warm orchestrator: {e}")

        logger.info(f"[Chatwoot Sync] Services initialized successfully for: {company_id}")

    except Exception as e:
        logger.error(f"[Chatwoot Sync] Error initializing services for {company_id}: {e}")
        # No fallar la creación de empresa si servicios no se inicializan
```

---

## Configuraciones y Variables

### Variables de Entorno

```bash
# PostgreSQL (OBLIGATORIO para enterprise)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Redis (OBLIGATORIO para vectorstore y cache)
REDIS_URL=redis://host:6379

# OpenAI (OBLIGATORIO para agentes)
OPENAI_API_KEY=sk-...

# Chatwoot webhook (OPCIONAL)
CHATWOOT_WEBHOOK_SECRET=secret_para_validar_firma

# Archivos de configuración (fallback)
COMPANIES_CONFIG_FILE=companies_config.json
EXTENDED_CONFIG_FILE=extended_companies_config.json

# Schedule service (OPCIONAL)
SCHEDULE_SERVICE_URL=http://127.0.0.1:4040

# Empresa por defecto
DEFAULT_COMPANY_ID=benova
```

### Archivos JSON

**`companies_config.json`**:

```json
{
  "benova": {
    "company_name": "Benova",
    "business_type": "beauty",
    "redis_prefix": "benova:",
    "vectorstore_index": "benova_documents",
    "schedule_service_url": "http://127.0.0.1:4040",
    "sales_agent_name": "María, asesora especializada de Benova",
    "services": "medicina estética y tratamientos de belleza",
    "model_name": "gpt-4o-mini",
    "max_tokens": 1500,
    "temperature": 0.7,
    "treatment_durations": {
      "limpieza facial": 60,
      "masaje relajante": 60
    },
    "_source": "postgresql",
    "_version": 1
  }
}
```

---

## Análisis de Gaps y Consideraciones

### Gaps Identificados

#### 1. Webhook de Chatwoot NO usa lógica de admin.py

**Problema**:
- El webhook tiene su propia implementación inline
- NO ejecuta todos los pasos de `create_new_company_enterprise()`
- Faltan servicios críticos

**Servicios faltantes en webhook**:
- ❌ **Prompts en PostgreSQL** → Agentes no tienen templates
- ❌ **JSON fallback update** → Inconsistencia con admin
- ⚠️ **CompanyManager** → Depende de cache
- ⚠️ **Orchestrator** → Pre-warm puede fallar

**Impacto**:
- Empresas creadas vía webhook pueden fallar al usar agentes
- Inconsistencia entre empresas creadas por admin vs webhook
- Debug difícil (dos paths de código diferentes)

#### 2. Endpoint de admin REQUIERE API key

**Problema**:
- `@require_api_key` bloquea el acceso sin header
- El webhook de Chatwoot NO puede usar este endpoint directamente

**Opciones**:
- A) Quitar `@require_api_key` → ❌ Inseguro
- B) Crear función compartida → ✅ Mejor
- C) Webhook llama a endpoint interno → Complejo

#### 3. Lógica duplicada (200+ líneas)

**Problema**:
- `admin.py:create_new_company_enterprise()` → 270 líneas
- `chatwoot_webhooks.py:create_company_from_chatwoot()` → 120 líneas
- Código duplicado dificulta mantenimiento

**Riesgos**:
- Cambio en admin.py no se replica en webhook
- Bugs diferentes en cada path
- Testing doble (dos flows)

### Consideraciones para Integración con Chatwoot

#### Opción 1: Función Compartida (RECOMENDADO)

```python
# app/services/company_creation_service.py

def create_company_full(
    company_data: dict,
    created_by: str = "admin_api"
) -> dict:
    """
    FUNCIÓN COMPARTIDA para crear empresa completa

    Usada por:
    - admin.py:create_new_company_enterprise()
    - chatwoot_webhooks.py:create_company_from_chatwoot()

    Garantiza:
    - PostgreSQL persistence
    - Vectorstore initialization
    - Prompts initialization
    - CompanyManager registration
    - Orchestrator pre-warming
    - JSON fallback update

    Returns:
        {
            "success": True/False,
            "company_id": "...",
            "setup_status": {...},
            "error": "..." (si falla)
        }
    """
    # TODO: Implementar lógica completa aquí
    pass
```

**Beneficios**:
- ✅ Una sola fuente de verdad
- ✅ Consistencia garantizada
- ✅ Fácil mantenimiento
- ✅ Testing centralizado

**Cambios necesarios**:
1. Crear `app/services/company_creation_service.py`
2. Extraer lógica de `admin.py` a función compartida
3. Refactorizar `admin.py` para usar función
4. Refactorizar `chatwoot_webhooks.py` para usar función

#### Opción 2: Webhook llama endpoint de admin

```python
# chatwoot_webhooks.py

def create_company_from_chatwoot(...):
    # Hacer request HTTP interno a /api/admin/companies/create
    # Con API key interna

    import requests
    response = requests.post(
        'http://localhost:8080/api/admin/companies/create',
        headers={'X-API-Key': os.getenv('INTERNAL_API_KEY')},
        json=company_data
    )
```

**Problemas**:
- Overhead de HTTP request
- Necesita API key interna
- Más complejo de debugear
- Latencia adicional

#### Opción 3: Remover @require_api_key para creación

```python
# admin.py

@bp.route('/companies/create', methods=['POST'])
@handle_errors
# ❌ NO @require_api_key
def create_new_company_enterprise():
    # Validar origen (webhook vs admin)
    # ...
```

**Problemas**:
- ❌ Endpoint público sin autenticación
- ❌ Riesgo de seguridad
- ❌ Spam de creación de empresas

### Recomendación Final

**Implementar Opción 1: Función Compartida**

```
1. Crear app/services/company_creation_service.py
2. Definir create_company_full() con TODA la lógica
3. Refactorizar admin.py para usar la función
4. Refactorizar chatwoot_webhooks.py para usar la función
5. Mantener @require_api_key en endpoint de admin
6. Webhook llama directamente a la función (sin HTTP)
```

**Ventajas**:
- ✅ Máxima consistencia
- ✅ Sin código duplicado
- ✅ Seguridad mantenida
- ✅ Performance óptima
- ✅ Fácil testing

---

## Resumen Final

### Estado Actual

```
FUNCIONA ✅:
- Creación manual vía API (POST /api/admin/companies/create)
- Creación desde frontend (EnterpriseCompanyForm.vue)
- PostgreSQL como source of truth
- Versionado automático
- Fallback a JSON
- Cache en 3 niveles

FUNCIONA PARCIALMENTE ⚠️:
- Webhook de Chatwoot crea empresa
- Pero NO inicializa todos los servicios
- Faltan prompts en PostgreSQL
- Falta JSON fallback update

PROBLEMA ❌:
- Código duplicado entre admin.py y chatwoot_webhooks.py
- Inconsistencia en servicios inicializados
- Webhook NO puede usar endpoint de admin (require API key)
```

### Próximos Pasos Recomendados

1. **NO modificar admin.py** hasta tener plan claro
2. **Documentar diferencias** entre admin y webhook
3. **Diseñar función compartida** con spec completa
4. **Testing exhaustivo** antes de refactorizar
5. **Migración gradual** con feature flags

---

**Documento creado**: 2025-11-14
**Autor**: Análisis del sistema existente
**Propósito**: Base para diseñar integración correcta con Chatwoot
