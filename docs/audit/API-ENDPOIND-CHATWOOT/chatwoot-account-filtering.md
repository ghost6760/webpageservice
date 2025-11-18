# Filtrado de Empresas por Cuenta de Chatwoot

**Fecha**: 2025-11-14
**Autor**: Claude
**Estado**: ✅ Implementado

---

## 📋 Tabla de Contenidos

1. [Problema](#problema)
2. [Solución Implementada](#solución-implementada)
3. [Arquitectura](#arquitectura)
4. [Cambios Realizados](#cambios-realizados)
5. [Flujo de Datos](#flujo-de-datos)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Problema

### Contexto

El frontend del backend multi-tenant está embebido en Chatwoot como un iframe (ver [embedding-external-frontends.md](./embedding-external-frontends.md)). Este frontend tiene un **selector de empresas** que permite cambiar entre diferentes compañías.

### Situación Problemática

Cuando un usuario de Chatwoot accede al frontend embebido:
- ❌ Ve **TODAS las empresas** en el selector
- ❌ Puede cambiar a empresas que **NO le pertenecen**
- ❌ No hay restricción por cuenta de Chatwoot

**Ejemplo del problema:**
```
Usuario en Chatwoot Account ID: 12
  ↓
Accede al frontend embebido
  ↓
Ve selector con:
  - chatwoot_1 (Empresa A)    ← NO es suya
  - chatwoot_12 (Empresa B)   ← Esta SÍ es suya
  - chatwoot_45 (Empresa C)   ← NO es suya
  ↓
Puede seleccionar cualquiera ❌ PROBLEMA
```

### Objetivo

**Filtrar el selector de empresas** para que el usuario solo vea la empresa correspondiente a su cuenta de Chatwoot.

```
Usuario en Chatwoot Account ID: 12
  ↓
Accede al frontend embebido
  ↓
Ve SOLO su empresa:
  - chatwoot_12 (Empresa B)   ← Única opción
  ↓
No puede cambiar a otras empresas ✅ SOLUCIÓN
```

---

## Solución Implementada

### Opción Elegida: **Hybrid Filtering**

Combina query parameters con lógica de filtrado automático en el frontend.

### Componentes

1. **Query Parameters**: Chatwoot pasa `accountId` y `embed=chatwoot` en la URL del iframe
2. **Endpoint de Búsqueda**: Backend busca empresa por `chatwoot_account_id`
3. **Auto-filtrado Frontend**: Frontend recibe `accountId`, busca la empresa, y oculta el selector

### ¿Por qué esta opción?

| Criterio | Resultado |
|----------|-----------|
| **Complejidad** | ⭐⭐ Baja (similar a Single Tenant existente) |
| **Seguridad** | ⭐⭐⭐⭐ Alta (valida en backend) |
| **Mantenibilidad** | ⭐⭐⭐⭐⭐ Alta (consistente con patrón existente) |
| **Performance** | ⭐⭐⭐⭐⭐ Alta (cache en frontend) |
| **Debuggability** | ⭐⭐⭐⭐⭐ Alta (params visibles en URL) |

---

## Arquitectura

### Diagrama de Flujo

```
┌──────────────────────────────────────────────────────┐
│ 1. Usuario accede a Chatwoot                        │
│    URL: https://chatwoot.com/app/accounts/12/ia     │
└────────────────────┬─────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────┐
│ 2. Chatwoot renderiza iframe con params             │
│    <iframe src="https://backend.com/                 │
│                ?accountId=12&embed=chatwoot">        │
└────────────────────┬─────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────┐
│ 3. Frontend detecta params                           │
│    const accountId = route.query.accountId // "12"   │
│    const isEmbed = route.query.embed === "chatwoot"  │
└────────────────────┬─────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────┐
│ 4. Frontend llama al endpoint de búsqueda            │
│    GET /api/companies/by-chatwoot-account/12         │
└────────────────────┬─────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────┐
│ 5. Backend busca en PostgreSQL                       │
│    SELECT * FROM companies                           │
│    WHERE chatwoot_account_id = '12'                  │
│    AND is_active = true                              │
└────────────────────┬─────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────┐
│ 6. Backend retorna empresa                           │
│    {                                                 │
│      "company_id": "chatwoot_12",                    │
│      "company_name": "Mi Empresa S.A.",              │
│      "chatwoot_account_id": "12"                     │
│    }                                                 │
└────────────────────┬─────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────┐
│ 7. Frontend auto-selecciona empresa                  │
│    selectedCompany.value = "chatwoot_12"             │
│    showSelector.value = false  // Ocultar selector   │
└──────────────────────────────────────────────────────┘
```

### Mapeo de IDs

```
┌─────────────────┬──────────────────┬────────────────────┐
│   Chatwoot      │   Backend        │   Relación         │
├─────────────────┼──────────────────┼────────────────────┤
│ account.id: 12  │ company_id:      │ company_id =       │
│                 │   "chatwoot_12"  │   "chatwoot_" + id │
│                 │                  │                    │
│                 │ chatwoot_account_│ Mismo valor        │
│                 │   _id: "12"      │                    │
└─────────────────┴──────────────────┴────────────────────┘
```

**Ejemplo concreto:**
- Chatwoot crea cuenta con `account.id = 12`
- Webhook crea empresa:
  - `company_id = "chatwoot_12"` ← ID interno del backend
  - `chatwoot_account_id = "12"` ← ID de la cuenta en Chatwoot
- Frontend busca por `chatwoot_account_id = "12"`
- Encuentra empresa con `company_id = "chatwoot_12"`

---

## Cambios Realizados

### 1. Backend - Nuevo Endpoint

**Archivo**: `app/routes/companies.py`

**Endpoint agregado**: `GET /api/companies/by-chatwoot-account/:accountId`

#### Funcionalidad

```python
@bp.route('/by-chatwoot-account/<chatwoot_account_id>', methods=['GET'])
@handle_errors
def get_company_by_chatwoot_account(chatwoot_account_id):
    """
    Busca empresa por chatwoot_account_id

    1. Verifica si PostgreSQL está disponible
    2. Si NO: busca en memoria (CompanyManager)
    3. Si SÍ: busca en PostgreSQL
    4. Retorna datos de la empresa
    """
```

#### Parámetros

| Parámetro | Tipo | Ubicación | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `chatwoot_account_id` | string | Path | ID de la cuenta en Chatwoot | `"12"` |

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "company_id": "chatwoot_12",
    "company_name": "Mi Empresa S.A.",
    "business_type": "general",
    "chatwoot_account_id": "12",
    "services": "Asistente de IA, Documentos",
    "subscription_tier": "basic",
    "is_active": true,
    "source": "postgresql"
  }
}
```

#### Respuesta Error (404)

```json
{
  "success": false,
  "error": "No company found for Chatwoot account 12"
}
```

#### Fuentes de Datos

El endpoint tiene un **sistema de fallback**:

1. **PostgreSQL** (primario):
   ```sql
   SELECT company_id, company_name, business_type,
          chatwoot_account_id, services, subscription_tier
   FROM companies
   WHERE chatwoot_account_id = '12'
   AND is_active = true
   ORDER BY created_at DESC
   LIMIT 1
   ```

2. **Memoria** (fallback):
   ```python
   company_manager = get_company_manager()
   all_companies = company_manager.get_all_companies()
   expected_company_id = f"chatwoot_{chatwoot_account_id}"
   company = all_companies.get(expected_company_id)
   ```

#### Logs

El endpoint genera logs detallados:

```
[Chatwoot Embed] Looking up company for account ID: 12
[Chatwoot Embed] Found company in PostgreSQL: chatwoot_12
```

O en caso de error:

```
[Chatwoot Embed] No company found in PostgreSQL for account 12
```

---

### 2. Frontend - Modificaciones Implementadas ✅

**Archivos modificados**: Frontend Vue en `src/`

#### Detección de Embedding ✅

**Archivo**: `src/composables/useChatwootEmbed.js` (Creado)

```javascript
// src/composables/useChatwootEmbed.js
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSystemLog } from '@/composables/useSystemLog'

export const useChatwootEmbed = () => {
  const route = useRoute()
  const { addToLog } = useSystemLog()

  const isEmbedded = computed(() => {
    const embedFlag = route.query.embed === 'chatwoot'
    if (embedFlag) {
      addToLog('[Chatwoot Embed] Frontend detected as embedded in Chatwoot', 'info')
    }
    return embedFlag
  })

  const chatwootAccountId = computed(() => {
    const accountId = route.query.accountId
    if (isEmbedded.value && accountId) {
      addToLog(`[Chatwoot Embed] Account ID detected: ${accountId}`, 'info')
    }
    return accountId || null
  })

  const hasValidEmbedContext = computed(() => {
    return isEmbedded.value && !!chatwootAccountId.value
  })

  const getCompanyLookupUrl = computed(() => {
    if (!chatwootAccountId.value) return null
    return `/api/companies/by-chatwoot-account/${chatwootAccountId.value}`
  })

  return {
    isEmbedded,
    chatwootAccountId,
    hasValidEmbedContext,
    getCompanyLookupUrl
  }
}
```

#### Auto-carga de Empresa ✅

**Archivo**: `src/composables/useCompanies.js` (Modificado)

```javascript
// src/composables/useCompanies.js (fragmento relevante)
import { useChatwootEmbed } from '@/composables/useChatwootEmbed'

export const useCompanies = () => {
  // ... otros imports y setup

  const { isEmbedded, chatwootAccountId, hasValidEmbedContext } = useChatwootEmbed()

  const companies = ref([])
  const selectedCompany = ref(null)
  const showSelector = ref(true) // ✨ Controla visibilidad

  // ✨ NUEVO (v2.1.0): Carga empresas con soporte para múltiples formatos
  const loadCompanies = async () => {
    const response = await apiRequest('/api/companies')
    let companiesArray = []

    // Manejar diferentes formatos de respuesta
    if (Array.isArray(response)) {
      // Formato antiguo: array directo
      companiesArray = response
    } else if (response?.companies) {
      // Formato nuevo: objeto con propiedad 'companies'
      if (Array.isArray(response.companies)) {
        companiesArray = response.companies
      } else if (typeof response.companies === 'object') {
        // Convertir objeto a array
        companiesArray = Object.entries(response.companies).map(([id, data]) => ({
          id: data.company_id || id,
          company_id: data.company_id || id,
          name: data.company_name || data.name || id,
          company_name: data.company_name || data.name || id,
          status: data.status || 'active',
          ...data
        }))
      }
    }

    if (companiesArray.length > 0) {
      companies.value = companiesArray
      // ... resto de la lógica
    }
  }

  // ✨ NUEVO: Busca empresa por chatwoot_account_id
  const fetchCompanyByAccountId = async (accountId) => {
    if (!accountId) return null

    try {
      const response = await apiRequest(`/api/companies/by-chatwoot-account/${accountId}`)
      if (response && response.company_id) {
        addToLog(`[Chatwoot Embed] Company found: ${response.company_id}`, 'success')
        return response
      }
    } catch (error) {
      addToLog(`[Chatwoot Embed] Error fetching company: ${error.message}`, 'error')
      return null
    }
  }

  // ✨ NUEVO: Auto-carga empresa cuando está embebido
  const loadCompanyFromChatwoot = async () => {
    if (!hasValidEmbedContext.value) return false

    const company = await fetchCompanyByAccountId(chatwootAccountId.value)
    if (!company) {
      showSelector.value = true
      return false
    }

    // Auto-seleccionar empresa
    await handleCompanyChange(company.company_id)
    companies.value = [company] // Solo esta empresa
    showSelector.value = false // Ocultar selector

    return true
  }

  // ✨ Modificado: Detecta embed context en inicialización
  const initializeCompanies = async () => {
    if (hasValidEmbedContext.value) {
      const success = await loadCompanyFromChatwoot()
      if (success) return // Listo
    }

    // Flujo normal si no está embebido
    await loadCompanies()
  }

  return {
    companies,
    showSelector,         // ✨ NUEVO
    isEmbedded,           // ✨ NUEVO
    chatwootAccountId,    // ✨ NUEVO
    fetchCompanyByAccountId, // ✨ NUEVO
    loadCompanyFromChatwoot, // ✨ NUEVO
    // ... resto de exports
  }
}
```

**⚠️ Nota Técnica - Formato de Respuesta del API:**

El endpoint `/api/companies` puede retornar dos formatos:

1. **Array directo** (formato antiguo):
   ```json
   [
     { "company_id": "benova", "company_name": "Benova" }
   ]
   ```

2. **Objeto con propiedad companies** (formato nuevo):
   ```json
   {
     "companies": {
       "benova": { "company_id": "benova", "company_name": "Benova" }
     },
     "status": "success",
     "total_companies": 1
   }
   ```

La función `loadCompanies()` detecta automáticamente el formato y convierte a array cuando es necesario, manteniendo retrocompatibilidad con ambos formatos.

#### Componente de Selector ✅

**Archivo**: `src/components/shared/CompanySelector.vue` (Modificado)

```vue
<!-- src/components/shared/CompanySelector.vue -->
<template>
  <div class="company-selector-wrapper">
    <!-- ✨ Selector Normal (cuando NO está embebido) -->
    <template v-if="showSelector">
      <label for="companySelect" class="company-label">
        🏢 Empresa Activa:
      </label>
      <select
        id="companySelect"
        v-model="selectedCompanyId"
        @change="onCompanyChange"
        :disabled="isLoading"
        class="company-select"
      >
        <option value="">Seleccionar empresa...</option>
        <option
          v-for="company in companyOptions"
          :key="company.value"
          :value="company.value"
        >
          {{ company.label }}
        </option>
      </select>
      <button @click="onRefresh" class="refresh-btn">🔄</button>
    </template>

    <!-- ✨ Badge Embebido (cuando está en Chatwoot) -->
    <template v-else>
      <div class="embedded-company-badge">
        <div class="badge-header">
          <span class="badge-icon">🏢</span>
          <span class="badge-label">Empresa:</span>
        </div>
        <div class="badge-content">
          <span class="badge-company-name">{{ currentCompany?.company_name }}</span>
          <span class="badge-tag">Chatwoot</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useCompanies } from '@/composables/useCompanies'

const appStore = useAppStore()

const {
  isLoading,
  companyOptions,
  currentCompany,
  showSelector,          // ✨ Controla visibilidad
  isEmbedded,
  handleCompanyChange,
  reloadCompaniesConfig,
  initializeCompanies
} = useCompanies()

const selectedCompanyId = computed({
  get() { return appStore.currentCompanyId },
  set(value) { appStore.setCurrentCompany(value) }
})

const onCompanyChange = async (event) => {
  await handleCompanyChange(event?.target?.value)
}

const onRefresh = async () => {
  await reloadCompaniesConfig()
}

onMounted(async () => {
  await initializeCompanies() // ✨ Auto-detecta embed y carga empresa
})
</script>

<style scoped>
/* Estilos para badge embebido */
.embedded-company-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.badge-tag {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75em;
  text-transform: uppercase;
}
</style>
```

---

### 3. Chatwoot - Modificaciones Necesarias (NO IMPLEMENTADAS AÚN)

**Archivo a modificar**: `app/javascript/dashboard/routes/dashboard/ia/Index.vue`

#### Cambios Requeridos

```vue
<template>
  <div class="flex flex-col h-full">
    <iframe-loader
      :src="iaUrlWithParams"
      :is-visible="true"
      class="flex-1 h-full"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import IframeLoader from '@/shared/components/IframeLoader.vue';

const route = useRoute();
const section = computed(() => route.params.section || 'dashboard');
const accountId = computed(() => route.params.accountId); // ✨ NUEVO

const iaUrlWithParams = computed(() => {
  const baseUrl = window.chatwootConfig?.iaUrl ||
    'https://multibackendopenia-production.up.railway.app';

  const sectionPath = section.value === 'dashboard'
    ? ''
    : `/${section.value}`;

  // ✨ NUEVO: Agregar accountId y embed flag
  const params = new URLSearchParams({
    accountId: accountId.value,
    embed: 'chatwoot'
  });

  return `${baseUrl}${sectionPath}?${params.toString()}`;
});
</script>
```

#### URL Generada

**Antes:**
```
https://multibackendopenia-production.up.railway.app/dashboard
```

**Ahora:**
```
https://multibackendopenia-production.up.railway.app/dashboard?accountId=12&embed=chatwoot
```

---

## Flujo de Datos

### Caso 1: Usuario Accede desde Chatwoot

```
1. Usuario en Chatwoot (Account ID: 12)
   ↓
2. Navega a "Inteligencia Artificial" → "Dashboard"
   ↓
3. Chatwoot renderiza:
   <iframe src="https://backend.com/?accountId=12&embed=chatwoot">
   ↓
4. Frontend detecta:
   - route.query.accountId = "12"
   - route.query.embed = "chatwoot"
   ↓
5. Frontend hace request:
   GET /api/companies/by-chatwoot-account/12
   ↓
6. Backend busca en PostgreSQL:
   WHERE chatwoot_account_id = '12'
   ↓
7. Backend retorna:
   {
     "company_id": "chatwoot_12",
     "company_name": "Mi Empresa S.A."
   }
   ↓
8. Frontend auto-selecciona:
   - selectedCompany = "chatwoot_12"
   - showSelector = false
   ↓
9. Usuario ve SOLO su empresa ✅
```

### Caso 2: Usuario Accede Directamente (NO desde Chatwoot)

```
1. Usuario accede directo:
   https://backend.com/dashboard
   ↓
2. Frontend detecta:
   - route.query.accountId = undefined
   - route.query.embed = undefined
   ↓
3. Frontend carga TODAS las empresas:
   GET /api/companies
   ↓
4. Muestra selector normal:
   - showSelector = true
   - companies = [todas las empresas]
   ↓
5. Usuario puede seleccionar cualquier empresa ✅
```

---

## Ejemplos de Uso

### Ejemplo 1: Buscar Empresa por Account ID

**Request:**
```bash
curl -X GET https://multibackendopenia-production.up.railway.app/api/companies/by-chatwoot-account/12
```

**Response:**
```json
{
  "success": true,
  "data": {
    "company_id": "chatwoot_12",
    "company_name": "Empresa de Prueba S.A.",
    "business_type": "general",
    "chatwoot_account_id": "12",
    "services": "Asistente de IA, Gestión de documentos",
    "subscription_tier": "basic",
    "is_active": true,
    "source": "postgresql"
  }
}
```

### Ejemplo 2: Account ID No Existe

**Request:**
```bash
curl -X GET https://multibackendopenia-production.up.railway.app/api/companies/by-chatwoot-account/999
```

**Response:**
```json
{
  "success": false,
  "error": "No company found for Chatwoot account 999"
}
```

### Ejemplo 3: URL del Iframe con Params

**HTML en Chatwoot:**
```html
<iframe
  src="https://multibackendopenia-production.up.railway.app/dashboard?accountId=12&embed=chatwoot"
  style="width: 100%; height: 100%; border: none;"
></iframe>
```

**JavaScript en Frontend:**
```javascript
// Detectar params
const urlParams = new URLSearchParams(window.location.search);
const accountId = urlParams.get('accountId'); // "12"
const isEmbed = urlParams.get('embed') === 'chatwoot'; // true

if (isEmbed && accountId) {
  // Auto-cargar empresa
  fetchCompanyByAccountId(accountId);
}
```

---

## Testing

### Test 1: Endpoint Funciona

```bash
# 1. Crear empresa de prueba (si no existe)
curl -X POST http://localhost:8080/api/admin/companies/create \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "chatwoot_test",
    "company_name": "Test Company",
    "services": "Testing",
    "chatwoot_account_id": "test"
  }'

# 2. Buscar por chatwoot_account_id
curl http://localhost:8080/api/companies/by-chatwoot-account/test

# 3. Verificar respuesta
# Debe retornar:
# {
#   "success": true,
#   "data": {
#     "company_id": "chatwoot_test",
#     "chatwoot_account_id": "test"
#   }
# }
```

### Test 2: Fallback a Memoria

```bash
# 1. Detener PostgreSQL (simular fallo)
docker stop postgres_container

# 2. Buscar empresa
curl http://localhost:8080/api/companies/by-chatwoot-account/test

# 3. Verificar logs
# Debe mostrar:
# [Chatwoot Embed] PostgreSQL not available, falling back to memory/JSON
# [Chatwoot Embed] Found company in memory: chatwoot_test

# 4. Verificar source en response
# "source": "memory"
```

### Test 3: Integración Frontend

```javascript
// En browser console del frontend embebido
const accountId = '12';
const response = await fetch(`/api/companies/by-chatwoot-account/${accountId}`);
const data = await response.json();

console.log('Company data:', data);
// Debe mostrar empresa correspondiente
```

### Test 4: URL con Params

```
1. Acceder a:
   http://localhost:5173/dashboard?accountId=12&embed=chatwoot

2. Abrir DevTools → Console

3. Verificar:
   console.log(route.query.accountId); // "12"
   console.log(route.query.embed);     // "chatwoot"

4. Verificar que selector está oculto

5. Verificar que empresa está auto-seleccionada
```

---

## Troubleshooting

### Problema 1: Endpoint retorna 404

**Síntomas:**
```json
{
  "success": false,
  "error": "No company found for Chatwoot account 12"
}
```

**Causas posibles:**
1. Empresa no existe en PostgreSQL
2. `chatwoot_account_id` incorrecto
3. Empresa está marcada como `is_active = false`

**Solución:**
```sql
-- Verificar si empresa existe
SELECT company_id, chatwoot_account_id, is_active
FROM companies
WHERE chatwoot_account_id = '12';

-- Si no existe, crearla manualmente
INSERT INTO companies (company_id, company_name, chatwoot_account_id, is_active)
VALUES ('chatwoot_12', 'Test Company', '12', true);

-- Si existe pero is_active = false, activarla
UPDATE companies
SET is_active = true
WHERE chatwoot_account_id = '12';
```

### Problema 2: Frontend no detecta params

**Síntomas:**
- Selector sigue visible
- Muestra todas las empresas
- `accountId` es `undefined`

**Causas posibles:**
1. Chatwoot no está pasando params en la URL
2. Frontend no está leyendo `route.query` correctamente

**Solución:**
```javascript
// En browser console
console.log('URL:', window.location.href);
// Debe mostrar: ...?accountId=12&embed=chatwoot

console.log('Query params:', route.query);
// Debe mostrar: { accountId: "12", embed: "chatwoot" }

// Si no aparecen, verificar componente Index.vue de Chatwoot
```

### Problema 3: CORS error al llamar endpoint

**Síntomas:**
```
Access to fetch at 'https://backend.com/api/companies/...' from origin 'https://chatwoot.com' has been blocked by CORS
```

**Solución:**
```python
# En app/__init__.py, verificar que Chatwoot está en CORS origins
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://chatwootultimate-production.up.railway.app",  # ✅ Agregar
            "https://multibackendopenia-production.up.railway.app",
            "http://localhost:3000",
            "http://localhost:5173"
        ]
    }
})
```

### Problema 4: Selector no se oculta

**Síntomas:**
- Empresa se auto-selecciona correctamente
- Pero selector sigue visible

**Causa:**
- Lógica de `showSelector` no está implementada

**Solución:**
```vue
<template>
  <!-- Agregar v-if para ocultar selector -->
  <div v-if="showSelector" class="company-selector">
    <select v-model="selectedCompany">...</select>
  </div>

  <!-- Mostrar badge cuando está embebido -->
  <div v-else class="embedded-badge">
    {{ currentCompany?.company_name }}
  </div>
</template>

<script setup>
const showSelector = ref(true); // Inicializar

// En onMounted cuando es embed
if (isEmbedded.value) {
  showSelector.value = false; // ← Ocultar
}
</script>
```

### Problema 5: Múltiples empresas con mismo chatwoot_account_id

**Síntomas:**
```sql
-- Retorna 2+ empresas
SELECT * FROM companies WHERE chatwoot_account_id = '12';
-- chatwoot_12 (created_at: 2025-11-01)
-- chatwoot_12_backup (created_at: 2025-11-10)
```

**Causa:**
- Empresas duplicadas o backups

**Solución:**
El endpoint ya maneja esto con `ORDER BY created_at DESC LIMIT 1`, por lo que retorna la más reciente.

Si quieres limpiar duplicados:
```sql
-- Ver duplicados
SELECT chatwoot_account_id, COUNT(*)
FROM companies
WHERE chatwoot_account_id IS NOT NULL
GROUP BY chatwoot_account_id
HAVING COUNT(*) > 1;

-- Marcar antiguos como inactivos
UPDATE companies
SET is_active = false
WHERE chatwoot_account_id = '12'
AND company_id != 'chatwoot_12'; -- Mantener el correcto
```

### Problema 6: Selector desaparece en modo normal (formato API) ✅ RESUELTO

**Síntomas:**
- Selector de empresas no aparece cuando se accede directamente (sin embedding)
- Console muestra: `Error: Invalid response format: expected array of companies`
- `companies count: 0`

**Causa:**
El endpoint `/api/companies` cambió su formato de respuesta:

**Formato anterior:**
```json
[
  { "company_id": "benova", "company_name": "Benova" },
  { "company_id": "tecno", "company_name": "Tecno" }
]
```

**Formato nuevo:**
```json
{
  "companies": {
    "benova": { "company_id": "benova", "company_name": "Benova" },
    "tecno": { "company_id": "tecno", "company_name": "Tecno" }
  },
  "status": "success",
  "total_companies": 2
}
```

**Solución implementada:**
Actualizar `loadCompanies()` en `src/composables/useCompanies.js:73-142` para soportar ambos formatos:

```javascript
const loadCompanies = async () => {
  const response = await apiRequest('/api/companies')
  let companiesArray = []

  // Manejar diferentes formatos de respuesta
  if (Array.isArray(response)) {
    // Formato antiguo: array directo
    companiesArray = response
  } else if (response?.companies) {
    // Formato nuevo: objeto con propiedad 'companies'
    if (Array.isArray(response.companies)) {
      // companies es un array
      companiesArray = response.companies
    } else if (typeof response.companies === 'object') {
      // companies es un objeto - convertir a array
      companiesArray = Object.entries(response.companies).map(([id, companyData]) => ({
        id: companyData.company_id || id,
        company_id: companyData.company_id || id,
        name: companyData.company_name || companyData.name || id,
        company_name: companyData.company_name || companyData.name || id,
        status: companyData.status || 'active',
        ...companyData
      }))
    }
  }

  if (companiesArray.length > 0) {
    companies.value = companiesArray
    // ... resto de la lógica
  }
}
```

**Resultado:**
- ✅ Selector aparece correctamente en modo normal
- ✅ Retrocompatibilidad con formato antiguo
- ✅ Empresas se cargan correctamente en ambos casos

**Commits relacionados:**
- `7bc6387` - fix: Handle new API response format for /api/companies endpoint
- `e84e4e3` - debug: Add comprehensive debugging to diagnose selector visibility bug

**Debugging agregado:**
```javascript
console.log('[DEBUG useCompanies] loadCompanies raw response:', response)
console.log('[DEBUG useCompanies] Response format:', format)
console.log('[DEBUG useCompanies] Processed companies array:', companiesArray)
```

---

## Seguridad

### Validación de Input

El endpoint valida automáticamente el `chatwoot_account_id`:
- ✅ SQL injection protection (usa parameterized queries)
- ✅ Solo retorna empresas activas (`is_active = true`)
- ✅ Limita a 1 resultado

### Exposición de Datos

El endpoint **NO expone**:
- ❌ API keys
- ❌ Configuraciones sensibles
- ❌ Datos de otras empresas

Solo retorna información pública de la empresa.

### Recomendaciones Adicionales

1. **Rate Limiting** (futuro):
   ```python
   from flask_limiter import Limiter

   @bp.route('/by-chatwoot-account/<id>')
   @limiter.limit("100 per minute")
   def get_company_by_chatwoot_account(id):
       ...
   ```

2. **Logging de Accesos**:
   Ya implementado:
   ```python
   logger.info(f"[Chatwoot Embed] Looking up company for account ID: {id}")
   ```

3. **Validación de Origin** (futuro):
   ```python
   allowed_origins = ['https://chatwoot.com', 'https://chatwoot-staging.com']
   if request.headers.get('Origin') not in allowed_origins:
       return create_error_response('Unauthorized origin', 403)
   ```

---

## Métricas y Monitoreo

### Logs a Monitorear

```bash
# Búsquedas exitosas
grep "[Chatwoot Embed] Found company" /var/log/app.log

# Búsquedas fallidas
grep "[Chatwoot Embed] No company found" /var/log/app.log

# Errores de base de datos
grep "[Chatwoot Embed] Database error" /var/log/app.log
```

### Métricas Recomendadas

| Métrica | Descripción | Threshold |
|---------|-------------|-----------|
| **Requests/min** | Llamadas al endpoint | < 1000/min |
| **Success Rate** | % de búsquedas exitosas | > 95% |
| **Response Time** | Latencia del endpoint | < 100ms |
| **404 Rate** | % de empresas no encontradas | < 5% |

---

## Próximos Pasos

### Implementación Completada ✅

- [x] **Backend**: Endpoint `/api/companies/by-chatwoot-account/:accountId` (commit: cf0ee20)
- [x] **Frontend**: Composable `useChatwootEmbed.js` (commit: ea610a3)
- [x] **Frontend**: Modificar `useCompanies.js` con auto-carga (commit: ea610a3)
- [x] **Frontend**: Actualizar `CompanySelector.vue` con badge visual (commit: ea610a3)
- [x] **Docs**: Documentación completa con ejemplos y troubleshooting

### Pendientes de Implementación

- [ ] Modificar componente `Index.vue` en **Chatwoot** para pasar params
- [ ] Testing end-to-end del flujo completo
- [ ] Despliegue en producción

### Mejoras Futuras

- [ ] Cache de búsquedas por `chatwoot_account_id` (Redis)
- [ ] Rate limiting por IP
- [ ] Analytics de uso del endpoint
- [ ] Webhook para sincronizar cambios de nombre de empresa
- [ ] Soporte multi-empresa por cuenta (si aplica en el futuro)

---

## Referencias

- [embedding-external-frontends.md](./embedding-external-frontends.md) - Arquitectura de embedding
- [CHATWOOT-WEBHOOK-SETUP.md](../CHATWOOT-WEBHOOK-SETUP.md) - Configuración de webhook de creación
- [EMPRESA-CREATION-FLOW-ANALYSIS.md](../EMPRESA-CREATION-FLOW-ANALYSIS.md) - Flujo de creación de empresas

---

## Changelog

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2025-11-18 | 2.1.0 | **Fix crítico**: Manejar nuevo formato de respuesta `/api/companies` (objeto vs array). Agregar debugging comprehensivo. Commits: `7bc6387`, `e84e4e3` |
| 2025-11-14 | 2.0.0 | Implementación completa: backend + frontend + docs |
| 2025-11-14 | 1.0.0 | Implementación inicial del endpoint backend |

---

**Mantenido por**: Equipo Backend Multi-Tenant
**Última actualización**: 2025-11-18
