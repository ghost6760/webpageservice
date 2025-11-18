# Embedding External Frontends in Chatwoot Ilimitated

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura General](#arquitectura-general)
3. [Mapa Completo de Archivos Modificados](#mapa-completo-de-archivos-modificados)
4. [Guías de Implementación](#guías-de-implementación)
   - [Agregar Sección al Dashboard IA](#1-agregar-sección-al-dashboard-ia)
   - [Crear Nuevo Embedding en Dashboard](#2-crear-nuevo-embedding-en-dashboard)
   - [Crear Nuevo Embedding en SuperAdmin](#3-crear-nuevo-embedding-en-superadmin)
5. [Configuración de URLs](#configuración-de-urls)
6. [Componentes Compartidos](#componentes-compartidos)
7. [Mejores Prácticas](#mejores-prácticas)
8. [Troubleshooting](#troubleshooting)

---

## Introducción

Este documento describe la arquitectura de embedding de frontends externos en Chatwoot Ilimitated y proporciona guías paso a paso para agregar nuevas funcionalidades. Actualmente existen **3 frontends embebidos**:

1. **IA Dashboard** - Interfaz de agentes IA para usuarios regulares
2. **Single Tenant** - Panel de negocio para administradores de cuenta
3. **Multi-Tenant** - Panel de gestión global para superadmin

Todos utilizan **iframe embedding** con diferentes configuraciones y parámetros.

---

## Arquitectura General

### Flujo de Configuración

```
┌─────────────────────────────────────────────────────┐
│ Environment Variables (.env / docker-compose)       │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Rails Initializers (config/initializers/)           │
│ - chatwoot.rb                                        │
│ - single_tenant_env.rb                               │
│ - multi_tenant_env.rb                                │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Layout Files (app/views/layouts/)                   │
│ - vueapp.html.erb (dashboard/single-tenant)          │
│ - super_admin/application.html.erb (multi-tenant)   │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ window.chatwootConfig (JavaScript Global Object)    │
│ {                                                    │
│   iaUrl: "...",                                      │
│   singleTenantUrl: "...",                            │
│   multiTenantUrl: "..."                              │
│ }                                                    │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Vue Components (app/javascript/)                    │
│ - dashboard/routes/dashboard/ia/Index.vue           │
│ - dashboard/routes/dashboard/single_tenant/Index.vue│
│ - superadmin_pages/views/multitenant/Index.vue      │
└─────────────────────────────────────────────────────┘
```

### Patrón de Routing

```
Rails Routes (config/routes.rb)
    ↓
Vue Router (*.routes.js)
    ↓
Vue Component (Index.vue)
    ↓
IframeLoader / Frame Component
    ↓
External Backend (Railway/localhost)
```

---

## Mapa Completo de Archivos Modificados

### 🎯 DASHBOARD - Inteligencia Artificial

#### Frontend - Componentes Vue

**`app/javascript/dashboard/routes/dashboard/ia/Index.vue`**
- **Propósito**: Componente principal que embede el iframe del backend de IA
- **Funcionalidad**:
  - Soporta 8 secciones dinámicas vía `:section` route param
  - Lee `window.chatwootConfig.iaUrl` para la URL del backend
  - Construye URL con sección: `${iaUrl}/${section}` o `${iaUrl}` (dashboard por defecto)
- **Secciones soportadas**:
  - `dashboard` - Panel principal
  - `documentos` - Gestión de documentos
  - `conversaciones` - Historial de conversaciones
  - `multimedia` - Archivos multimedia
  - `prompts` - Gestión de prompts
  - `administracion` - Configuración
  - `enterprise` - Funciones enterprise
  - `health` - Health check
- **Default Backend**: `https://multibackendopenia-production.up.railway.app`

```vue
<template>
  <div class="flex flex-col h-full">
    <iframe-loader
      :src="iaUrl"
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
const iaUrl = computed(() => {
  const baseUrl = window.chatwootConfig?.iaUrl ||
    'https://multibackendopenia-production.up.railway.app';
  return section.value === 'dashboard'
    ? baseUrl
    : `${baseUrl}/${section.value}`;
});
</script>
```

#### Frontend - Rutas

**`app/javascript/dashboard/routes/dashboard/ia/ia.routes.js`**
- **Propósito**: Define las rutas Vue para la sección IA
- **Rutas**:
  - `ia_dashboard`: `/accounts/:accountId/ia` (ruta base)
  - `ia_section`: `/accounts/:accountId/ia/:section` (rutas con sección)
- **Roles permitidos**: `administrator`, `agent`, `custom_role`

```javascript
import { frontendURL } from '../../../helper/URLHelper';

const Index = () => import('./Index.vue');

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/ia'),
      name: 'ia_dashboard',
      meta: {
        permissions: ['administrator', 'agent', 'custom_role'],
      },
      component: Index,
    },
    {
      path: frontendURL('accounts/:accountId/ia/:section'),
      name: 'ia_section',
      meta: {
        permissions: ['administrator', 'agent', 'custom_role'],
      },
      component: Index,
    },
  ],
};
```

**`app/javascript/dashboard/routes/dashboard/dashboard.routes.js`**
- **Modificación**: Importa y agrega `iaRoutes` al routing principal
- **Línea aproximada**: Importación al inicio del archivo

```javascript
import iaRoutes from './ia/ia.routes';

// ... otras importaciones

export default {
  routes: [
    // ... otras rutas
    ...iaRoutes.routes,
  ],
};
```

#### Frontend - Navegación/Sidebar

**`app/javascript/dashboard/components-next/sidebar/Sidebar.vue`** (líneas 356-404)
- **Propósito**: Agrega el menú "Inteligencia Artificial" al sidebar
- **Configuración**:
  - Ícono: `i-lucide-brain`
  - Label: "Inteligencia Artificial" (⚠️ hardcoded, sin i18n)
  - 8 items de submenú
  - Accesible para: administrator, agent, custom_role

```vue
<!-- Líneas 356-404 aproximadamente -->
<template v-if="hasPermission('administrator', 'agent', 'custom_role')">
  <SidebarItem
    :icon="'i-lucide-brain'"
    :label="'Inteligencia Artificial'"
    :is-child-menu-active="isIaMenuActive"
    @click="toggleSubmenu('ia')"
  >
    <template #submenu>
      <div v-if="isSubmenuOpen.ia" class="submenu">
        <SidebarSubmenuItem
          :to="`/app/accounts/${accountId}/ia/dashboard`"
          :label="'Dashboard'"
          :icon="'i-lucide-layout-dashboard'"
        />
        <SidebarSubmenuItem
          :to="`/app/accounts/${accountId}/ia/documentos`"
          :label="'Documentos'"
          :icon="'i-lucide-file-text'"
        />
        <SidebarSubmenuItem
          :to="`/app/accounts/${accountId}/ia/conversaciones`"
          :label="'Conversaciones'"
          :icon="'i-lucide-messages-square'"
        />
        <SidebarSubmenuItem
          :to="`/app/accounts/${accountId}/ia/multimedia`"
          :label="'Multimedia'"
          :icon="'i-lucide-image'"
        />
        <SidebarSubmenuItem
          :to="`/app/accounts/${accountId}/ia/prompts`"
          :label="'Prompts'"
          :icon="'i-lucide-code'"
        />
        <SidebarSubmenuItem
          :to="`/app/accounts/${accountId}/ia/administracion`"
          :label="'Administración'"
          :icon="'i-lucide-settings'"
        />
        <SidebarSubmenuItem
          :to="`/app/accounts/${accountId}/ia/enterprise`"
          :label="'Enterprise'"
          :icon="'i-lucide-building'"
        />
        <SidebarSubmenuItem
          :to="`/app/accounts/${accountId}/ia/health`"
          :label="'Health Check'"
          :icon="'i-lucide-heart-pulse'"
        />
      </div>
    </template>
  </SidebarItem>
</template>
```

---

### 🏢 SINGLE TENANT - Panel de Negocio

#### Frontend - Componentes Vue

**`app/javascript/dashboard/routes/dashboard/single_tenant/Index.vue`**
- **Propósito**: Embede el panel de gestión single tenant
- **Funcionalidad**:
  - Lee `window.chatwootConfig.singleTenantUrl`
  - Pasa `accountId` como query parameter: `?accountId=123`
- **Default**: `http://localhost:5173`

```vue
<template>
  <div class="flex flex-col h-full">
    <iframe-loader
      :src="singleTenantUrlWithParams"
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
const accountId = computed(() => route.params.accountId);

const singleTenantUrlWithParams = computed(() => {
  const baseUrl = window.chatwootConfig?.singleTenantUrl ||
    'http://localhost:5173';
  return `${baseUrl}?accountId=${accountId.value}`;
});
</script>
```

#### Frontend - Rutas

**`app/javascript/dashboard/routes/dashboard/single_tenant/single-tenant.routes.js`**
- **Propósito**: Define la ruta Vue para Single Tenant
- **Ruta**: `/accounts/:accountId/single-tenant`
- **Roles permitidos**: `administrator`, `agent`, `custom_role`

```javascript
import { frontendURL } from '../../../helper/URLHelper';

const Index = () => import('./Index.vue');

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/single-tenant'),
      name: 'single_tenant',
      meta: {
        permissions: ['administrator', 'agent', 'custom_role'],
      },
      component: Index,
    },
  ],
};
```

**Importado en**: `app/javascript/dashboard/routes/dashboard/dashboard.routes.js`

```javascript
import singleTenantRoutes from './single_tenant/single-tenant.routes';

export default {
  routes: [
    // ... otras rutas
    ...singleTenantRoutes.routes,
  ],
};
```

---

### 👑 SUPERADMIN - Multi-Tenant

#### Frontend - Componentes Vue

**`app/javascript/superadmin_pages/views/multitenant/Index.vue`**
- **Propósito**: Panel de gestión multi-tenant para superadmin
- **Funcionalidad**:
  - Lee `window.chatwootConfig.multiTenantUrl`
  - Pasa `superAdmin=true` como query parameter
- **Default**: `http://localhost:5173`

```vue
<template>
  <div class="flex flex-col h-full w-full">
    <iframe-loader
      :src="multiTenantUrlWithParams"
      :is-visible="true"
      class="flex-1 h-full w-full"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import IframeLoader from '@/shared/components/IframeLoader.vue';

const multiTenantUrlWithParams = computed(() => {
  const baseUrl = window.chatwootConfig?.multiTenantUrl ||
    'http://localhost:5173';
  return `${baseUrl}?superAdmin=true`;
});
</script>
```

#### Frontend - Entrypoint

**`app/javascript/entrypoints/superadmin_pages.js`**
- **Modificaciones**:
  - Línea 6: Importa el componente `MultiTenantIndex`
  - Línea 11: Lo registra en `ComponentMapping`

```javascript
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import Vuelidate from '@vuelidate/core';
// ... otras importaciones

import MultiTenantIndex from '../superadmin_pages/views/multitenant/Index.vue'; // Línea 6

const ComponentMapping = {
  // ... otros componentes
  MultiTenantIndex, // Línea 11
};

// ... resto del código de inicialización
```

#### Backend - Controller

**`app/controllers/super_admin/multitenant_controller.rb`**
- **Propósito**: Controlador simple que renderiza la vista multitenant
- **Funcionalidad**: Establece el título de página

```ruby
# frozen_string_literal: true

class SuperAdmin::MultitenantController < SuperAdmin::ApplicationController
  def index
    @page_title = 'Multi-Tenant Management'
  end
end
```

#### Backend - Views

**`app/views/super_admin/multitenant/index.html.erb`**
- **Propósito**: Template mínimo con div contenedor
- **Importante**: `data-component-name="MultiTenantIndex"` conecta con el entrypoint

```erb
<div id="app" data-component-name="MultiTenantIndex"></div>
```

**`app/views/super_admin/application/_navigation.html.erb`** (línea 31 aprox.)
- **Modificación**: Agrega link "Multi-Tenant" al menú de navegación superadmin

```erb
<li>
  <%= link_to 'Multi-Tenant',
      super_admin_multitenant_path,
      class: 'nav-link' %>
</li>
```

**`app/views/super_admin/application/_javascript.html.erb`** (líneas 97-98 aprox.)
- **Propósito**: Referencia `multiTenantUrl` para inyección de SDK de Chatwoot
- **Nota**: Incluye lógica compleja de inicialización de SDK

**`app/views/layouts/super_admin/application.html.erb`** (líneas 26-48, 50-140)
- **Propósito**: Inyecta `window.chatwootConfig.multiTenantUrl` temprano en el page load
- **Funcionalidad**:
  - Configura objeto `window.chatwootConfig`
  - Incluye lógica de watcher y inicialización de SDK
  - Lee variable de entorno `MULTI_TENANT_APP_URL`

```erb
<script>
  window.chatwootConfig = {
    multiTenantUrl: '<%= ENV.fetch('MULTI_TENANT_APP_URL', 'http://localhost:5173') %>'
  };
</script>
<!-- SDK initialization logic -->
```

---

### ⚙️ BACKEND - Rails Routes

**`config/routes.rb`**
- **Modificaciones**:
  - Línea 27: Ruta para IA dashboard base
  - Línea 28: Ruta para IA con sección
  - Línea 550: Ruta multitenant en namespace super_admin

```ruby
# Línea 27-28 (dentro del scope dashboard)
get '/app/accounts/:account_id/ia',
    to: 'dashboard#index',
    as: 'account_ia'

get '/app/accounts/:account_id/ia/:section',
    to: 'dashboard#index',
    as: 'account_ia_section'

# Línea 550 (dentro de namespace :super_admin)
namespace :super_admin, path: '' do
  # ... otras rutas
  get 'multitenant', to: 'multitenant#index'
end
```

---

### ⚙️ CONFIGURACIÓN - Initializers

**`config/initializers/chatwoot.rb`**
- **Propósito**: Configura la URL del backend de IA
- **Variables de entorno**: `IA_URL`
- **Defaults**:
  - Production: `https://multibackendopenia-production.up.railway.app`
  - Development: `http://localhost:5173`

```ruby
# Configuración de IA URL
ENV['IA_URL'] ||= if Rails.env.production?
                    'https://multibackendopenia-production.up.railway.app'
                  else
                    'http://localhost:5173'
                  end
```

**`config/initializers/single_tenant_env.rb`**
- **Propósito**: Configura la URL del panel single tenant
- **Variables de entorno**: `SINGLE_TENANT_APP_URL` o `SINGLE_TENANT_URL`

```ruby
# frozen_string_literal: true

Rails.application.configure do
  config.x.single_tenant_url = ENV.fetch(
    'SINGLE_TENANT_APP_URL',
    ENV.fetch('SINGLE_TENANT_URL', 'http://localhost:5173')
  )
end
```

**`config/initializers/multi_tenant_env.rb`**
- **Propósito**: Configura la URL del panel multi-tenant
- **Variables de entorno**: `MULTI_TENANT_APP_URL` o `MULTI_TENANT_URL`

```ruby
# frozen_string_literal: true

Rails.application.configure do
  config.x.multi_tenant_url = ENV.fetch(
    'MULTI_TENANT_APP_URL',
    ENV.fetch('MULTI_TENANT_URL', 'http://localhost:5173')
  )
end
```

---

### ⚙️ CONFIGURACIÓN - Layout Principal

**`app/views/layouts/vueapp.html.erb`** (líneas 56-57 aprox.)
- **Propósito**: Inyecta las URLs en `window.chatwootConfig` para el dashboard
- **Variables inyectadas**:
  - `iaUrl`
  - `singleTenantUrl`

```erb
<script>
  window.chatwootConfig = {
    // ... otras configuraciones
    iaUrl: '<%= ENV.fetch('IA_URL', 'https://multibackendopenia-production.up.railway.app') %>',
    singleTenantUrl: '<%= Rails.application.config.x.single_tenant_url %>'
  };
</script>
```

---

### 🐳 CONFIGURACIÓN - Docker/Environment

**`docker-compose.production.yaml`** (líneas 8-9 aprox.)
- **Propósito**: Define variables de entorno para producción
- **Variables**:

```yaml
environment:
  - MULTI_TENANT_APP_URL=https://multibackendopenia-production.up.railway.app
  - SINGLE_TENANT_APP_URL=https://multibackendopenia-production.up.railway.app
```

**`.env.example`**
- **Nota**: Actualmente NO incluye estas variables
- **Recomendación**: Agregar para documentación:

```bash
# External Frontend URLs
IA_URL=https://your-ia-backend.railway.app
SINGLE_TENANT_APP_URL=https://your-single-tenant-backend.railway.app
MULTI_TENANT_APP_URL=https://your-multi-tenant-backend.railway.app
```

---

### 🧩 COMPONENTES COMPARTIDOS

**`app/javascript/shared/components/IframeLoader.vue`**
- **Propósito**: Componente genérico reutilizable para cargar iframes
- **Características**:
  - Soporte RTL/LTR automático
  - Estados de carga y error
  - Fullscreen support
  - Props: `src`, `isVisible`

```vue
<template>
  <div class="iframe-container">
    <div v-if="loading" class="loading-state">
      <!-- Loading spinner -->
    </div>
    <iframe
      v-show="!loading"
      :src="src"
      class="w-full h-full border-0"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  src: { type: String, required: true },
  isVisible: { type: Boolean, default: true }
});

const loading = ref(true);

const onLoad = () => {
  loading.value = false;
};

const onError = () => {
  // Handle error
};
</script>
```

**`app/javascript/dashboard/components/widgets/DashboardApp/Frame.vue`**
- **Propósito**: Frame especializado para dashboard apps con comunicación postMessage
- **Características**:
  - Comunicación bidireccional vía postMessage
  - Contexto de conversación/contacto/agente
  - Event handlers para interacción con iframe

```vue
<template>
  <div class="dashboard-app-frame">
    <iframe
      ref="frameRef"
      :src="src"
      @load="handleFrameLoad"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  src: String,
  context: Object // { conversation, contact, agent }
});

const frameRef = ref(null);

const handleFrameLoad = () => {
  // Send context to iframe
  frameRef.value.contentWindow.postMessage({
    event: 'chatwoot:context',
    data: props.context
  }, '*');
};

const handleMessage = (event) => {
  // Handle messages from iframe
  if (event.data.event === 'chatwoot:action') {
    // Handle actions
  }
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>
```

---

### 🌐 i18n/TRANSLATIONS

**Estado Actual**: ⚠️ **Sin soporte i18n**

Todos los labels del menú IA están **hardcoded en español** en:
- `app/javascript/dashboard/components-next/sidebar/Sidebar.vue`

**Labels hardcoded**:
- "Inteligencia Artificial" (menú principal)
- "Dashboard", "Documentos", "Conversaciones", "Multimedia", "Prompts", "Administración", "Enterprise", "Health Check" (submenús)

**Archivos NO modificados** (pero deberían para i18n):
- `config/locales/en.yml` (Backend)
- `app/javascript/dashboard/i18n/locale/en/index.json` (Frontend)

---

## Guías de Implementación

### 1. Agregar Sección al Dashboard IA

**Caso de uso**: Quieres agregar una nueva sección como "Reports" o "Analytics" al menú IA existente.

#### ✅ Pasos:

**Paso 1: Agregar item al sidebar**

Edita: `app/javascript/dashboard/components-next/sidebar/Sidebar.vue`

```vue
<!-- Busca la sección IA (línea ~356) y agrega un nuevo SidebarSubmenuItem -->
<SidebarSubmenuItem
  :to="`/app/accounts/${accountId}/ia/reports`"
  :label="'Reportes'"
  :icon="'i-lucide-bar-chart'"
/>
```

**Paso 2: Asegúrate que tu backend maneje la ruta**

El componente `Index.vue` ya está preparado para secciones dinámicas:
- URL generada: `${iaUrl}/reports`
- No necesitas modificar código Vue

**Paso 3: Implementa la ruta en tu backend externo**

En tu backend (Railway), asegúrate de tener una ruta:
```javascript
// Ejemplo con Express
app.get('/reports', (req, res) => {
  res.render('reports');
});
```

#### 📝 Ejemplo Completo

```vue
<!-- app/javascript/dashboard/components-next/sidebar/Sidebar.vue -->
<template v-if="hasPermission('administrator', 'agent', 'custom_role')">
  <SidebarItem
    :icon="'i-lucide-brain'"
    :label="'Inteligencia Artificial'"
    :is-child-menu-active="isIaMenuActive"
    @click="toggleSubmenu('ia')"
  >
    <template #submenu>
      <div v-if="isSubmenuOpen.ia" class="submenu">
        <!-- Items existentes -->
        <SidebarSubmenuItem
          :to="`/app/accounts/${accountId}/ia/dashboard`"
          :label="'Dashboard'"
          :icon="'i-lucide-layout-dashboard'"
        />
        <!-- ... otros items ... -->

        <!-- ✨ NUEVA SECCIÓN ✨ -->
        <SidebarSubmenuItem
          :to="`/app/accounts/${accountId}/ia/reports`"
          :label="'Reportes'"
          :icon="'i-lucide-bar-chart'"
        />

        <SidebarSubmenuItem
          :to="`/app/accounts/${accountId}/ia/analytics`"
          :label="'Analíticas'"
          :icon="'i-lucide-trending-up'"
        />
      </div>
    </template>
  </SidebarItem>
</template>
```

#### ⚠️ Consideraciones

- **i18n**: Los labels están hardcoded. Considera implementar i18n (ver sección "Implementar i18n")
- **Permisos**: Por defecto accesible para `administrator`, `agent`, `custom_role`
- **Íconos**: Usa Lucide icons (`i-lucide-*`). Ver: https://lucide.dev/icons/

---

### 2. Crear Nuevo Embedding en Dashboard

**Caso de uso**: Quieres embeder un frontend completamente nuevo (ej: "Campañas", "Analytics", "CRM") en el dashboard de usuarios.

#### ✅ Pasos:

**Paso 1: Crear archivo de configuración del initializer**

Crea: `config/initializers/campaigns_env.rb`

```ruby
# frozen_string_literal: true

Rails.application.configure do
  config.x.campaigns_url = ENV.fetch(
    'CAMPAIGNS_APP_URL',
    ENV.fetch('CAMPAIGNS_URL', 'http://localhost:5174')
  )
end
```

**Paso 2: Inyectar URL en layout**

Edita: `app/views/layouts/vueapp.html.erb`

```erb
<script>
  window.chatwootConfig = {
    // ... configuraciones existentes
    iaUrl: '<%= ENV.fetch('IA_URL', '...') %>',
    singleTenantUrl: '<%= Rails.application.config.x.single_tenant_url %>',
    // ✨ NUEVA URL ✨
    campaignsUrl: '<%= Rails.application.config.x.campaigns_url %>'
  };
</script>
```

**Paso 3: Crear estructura de carpetas Vue**

```bash
mkdir -p app/javascript/dashboard/routes/dashboard/campaigns
```

**Paso 4: Crear componente Vue**

Crea: `app/javascript/dashboard/routes/dashboard/campaigns/Index.vue`

```vue
<template>
  <div class="flex flex-col h-full">
    <iframe-loader
      :src="campaignsUrl"
      :is-visible="true"
      class="flex-1 h-full"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import IframeLoader from '@/shared/components/IframeLoader.vue';

const campaignsUrl = computed(() => {
  return window.chatwootConfig?.campaignsUrl || 'http://localhost:5174';
});
</script>
```

**Paso 5: Crear archivo de rutas Vue**

Crea: `app/javascript/dashboard/routes/dashboard/campaigns/campaigns.routes.js`

```javascript
import { frontendURL } from '../../../helper/URLHelper';

const Index = () => import('./Index.vue');

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/campaigns'),
      name: 'campaigns_dashboard',
      meta: {
        permissions: ['administrator', 'agent'], // Ajusta permisos
      },
      component: Index,
    },
  ],
};
```

**Paso 6: Registrar rutas en routing principal**

Edita: `app/javascript/dashboard/routes/dashboard/dashboard.routes.js`

```javascript
// Al inicio del archivo
import campaignsRoutes from './campaigns/campaigns.routes';

// Dentro de export default { routes: [ ... ] }
export default {
  routes: [
    // ... otras rutas
    ...iaRoutes.routes,
    ...singleTenantRoutes.routes,
    ...campaignsRoutes.routes, // ✨ NUEVA LÍNEA ✨
  ],
};
```

**Paso 7: Agregar rutas Rails**

Edita: `config/routes.rb`

```ruby
# Dentro del scope dashboard
get '/app/accounts/:account_id/campaigns',
    to: 'dashboard#index',
    as: 'account_campaigns'
```

**Paso 8: Agregar al sidebar**

Edita: `app/javascript/dashboard/components-next/sidebar/Sidebar.vue`

```vue
<!-- Agrega un nuevo SidebarItem -->
<SidebarItem
  v-if="hasPermission('administrator', 'agent')"
  :icon="'i-lucide-megaphone'"
  :label="'Campañas'"
  :to="`/app/accounts/${accountId}/campaigns`"
/>
```

**Paso 9: Configurar variables de entorno**

Edita: `docker-compose.production.yaml`

```yaml
environment:
  - CAMPAIGNS_APP_URL=https://your-campaigns-backend.railway.app
```

Edita: `.env` (local)

```bash
CAMPAIGNS_APP_URL=http://localhost:5174
```

#### 📝 Estructura Final

```
app/javascript/dashboard/routes/dashboard/
├── campaigns/
│   ├── Index.vue              # Componente con iframe
│   └── campaigns.routes.js    # Rutas Vue
├── ia/
│   ├── Index.vue
│   └── ia.routes.js
├── single_tenant/
│   ├── Index.vue
│   └── single-tenant.routes.js
└── dashboard.routes.js        # Importa todos los subroutes

config/
├── initializers/
│   └── campaigns_env.rb       # Configuración de URL
└── routes.rb                  # Rutas Rails

app/views/layouts/
└── vueapp.html.erb            # Inyección de window.chatwootConfig
```

#### ⚠️ Consideraciones

- **Puerto del backend**: Usa puerto diferente si corres múltiples backends localmente
- **CORS**: Asegúrate que tu backend permita requests desde Chatwoot
- **Autenticación**: Considera pasar tokens vía query params o postMessage
- **Permisos**: Ajusta el array `permissions` según tus necesidades

---

### 3. Crear Nuevo Embedding en SuperAdmin

**Caso de uso**: Quieres embeder un panel de administración global (ej: "Billing", "System Settings") solo accesible para superadmins.

#### ✅ Pasos:

**Paso 1: Crear controlador Rails**

Crea: `app/controllers/super_admin/billing_controller.rb`

```ruby
# frozen_string_literal: true

class SuperAdmin::BillingController < SuperAdmin::ApplicationController
  def index
    @page_title = 'Billing Management'
  end
end
```

**Paso 2: Crear vista ERB**

Crea: `app/views/super_admin/billing/index.html.erb`

```erb
<div id="app" data-component-name="BillingIndex"></div>
```

**Paso 3: Crear componente Vue**

Crea: `app/javascript/superadmin_pages/views/billing/Index.vue`

```vue
<template>
  <div class="flex flex-col h-full w-full">
    <iframe-loader
      :src="billingUrlWithParams"
      :is-visible="true"
      class="flex-1 h-full w-full"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import IframeLoader from '@/shared/components/IframeLoader.vue';

const billingUrlWithParams = computed(() => {
  const baseUrl = window.chatwootConfig?.billingUrl ||
    'http://localhost:5175';
  return `${baseUrl}?superAdmin=true`;
});
</script>
```

**Paso 4: Registrar componente en entrypoint**

Edita: `app/javascript/entrypoints/superadmin_pages.js`

```javascript
// Al inicio
import BillingIndex from '../superadmin_pages/views/billing/Index.vue';

// En ComponentMapping
const ComponentMapping = {
  // ... componentes existentes
  MultiTenantIndex,
  BillingIndex, // ✨ NUEVA LÍNEA ✨
};
```

**Paso 5: Crear initializer**

Crea: `config/initializers/billing_env.rb`

```ruby
# frozen_string_literal: true

Rails.application.configure do
  config.x.billing_url = ENV.fetch(
    'BILLING_APP_URL',
    ENV.fetch('BILLING_URL', 'http://localhost:5175')
  )
end
```

**Paso 6: Inyectar URL en layout superadmin**

Edita: `app/views/layouts/super_admin/application.html.erb`

```erb
<script>
  window.chatwootConfig = {
    multiTenantUrl: '<%= ENV.fetch('MULTI_TENANT_APP_URL', '...') %>',
    // ✨ NUEVA URL ✨
    billingUrl: '<%= Rails.application.config.x.billing_url %>'
  };
</script>
```

**Paso 7: Agregar ruta Rails**

Edita: `config/routes.rb`

```ruby
namespace :super_admin, path: '' do
  # ... otras rutas
  get 'multitenant', to: 'multitenant#index'
  get 'billing', to: 'billing#index' # ✨ NUEVA LÍNEA ✨
end
```

**Paso 8: Agregar al menú de navegación**

Edita: `app/views/super_admin/application/_navigation.html.erb`

```erb
<li>
  <%= link_to 'Multi-Tenant', super_admin_multitenant_path, class: 'nav-link' %>
</li>
<!-- ✨ NUEVO ITEM ✨ -->
<li>
  <%= link_to 'Billing', super_admin_billing_path, class: 'nav-link' %>
</li>
```

**Paso 9: Configurar variables de entorno**

```bash
# .env
BILLING_APP_URL=http://localhost:5175

# docker-compose.production.yaml
environment:
  - BILLING_APP_URL=https://your-billing-backend.railway.app
```

#### 📝 Estructura Final

```
app/controllers/super_admin/
└── billing_controller.rb         # Controller Rails

app/views/super_admin/
├── billing/
│   └── index.html.erb            # Vista con div#app
└── application/
    └── _navigation.html.erb      # Menú de navegación

app/javascript/
├── superadmin_pages/views/
│   ├── billing/
│   │   └── Index.vue             # Componente con iframe
│   └── multitenant/
│       └── Index.vue
└── entrypoints/
    └── superadmin_pages.js       # Registro del componente

config/
├── initializers/
│   └── billing_env.rb            # Configuración de URL
└── routes.rb                     # Rutas Rails
```

#### ⚠️ Consideraciones

- **Acceso**: Solo superadmins pueden acceder (controlado por `SuperAdmin::ApplicationController`)
- **Layout**: Usa el layout `super_admin/application.html.erb`
- **Componentes**: Deben registrarse en `superadmin_pages.js` (diferente a dashboard)
- **Query Params**: Considera pasar `superAdmin=true` u otros parámetros según necesites

---

## Configuración de URLs

### Jerarquía de Configuración

```
1. Environment Variables (.env / docker-compose.yaml)
   ↓
2. Rails Initializers (config/initializers/*.rb)
   ↓
3. Rails Config (Rails.application.config.x.*)
   ↓
4. Layout Files (app/views/layouts/*.html.erb)
   ↓
5. window.chatwootConfig (JavaScript Global Object)
   ↓
6. Vue Components (*.vue)
```

### Variables de Entorno Recomendadas

**`.env`** (desarrollo local)
```bash
# AI Backend
IA_URL=http://localhost:5173

# Single Tenant Backend
SINGLE_TENANT_APP_URL=http://localhost:5173
# Alternativa
SINGLE_TENANT_URL=http://localhost:5173

# Multi-Tenant Backend
MULTI_TENANT_APP_URL=http://localhost:5173
# Alternativa
MULTI_TENANT_URL=http://localhost:5173
```

**`docker-compose.production.yaml`** (producción)
```yaml
services:
  rails:
    environment:
      - IA_URL=https://multibackendopenia-production.up.railway.app
      - SINGLE_TENANT_APP_URL=https://singletenant-backend.railway.app
      - MULTI_TENANT_APP_URL=https://multitenant-backend.railway.app
```

### Defaults por Ambiente

Los initializers típicamente tienen lógica condicional:

```ruby
# config/initializers/ia_url.rb
ENV['IA_URL'] ||= if Rails.env.production?
                    'https://multibackendopenia-production.up.railway.app'
                  elsif Rails.env.development?
                    'http://localhost:5173'
                  else
                    'http://localhost:5173'
                  end
```

### Actualizar URLs sin Reiniciar

⚠️ **Las URLs se inyectan en el HTML durante el render**, por lo que:

1. **Cambios en `.env`** → Requiere reiniciar Rails server
2. **Cambios en `docker-compose`** → Requiere `docker-compose down && docker-compose up`
3. **No hay hot-reload** para estas configuraciones

---

## Componentes Compartidos

### IframeLoader

**Ubicación**: `app/javascript/shared/components/IframeLoader.vue`

**Props**:
```typescript
{
  src: String,           // URL del iframe (required)
  isVisible: Boolean,    // Visibilidad del iframe (default: true)
}
```

**Características**:
- ✅ Loading state automático
- ✅ Error handling
- ✅ Soporte RTL/LTR
- ✅ Fullscreen support
- ✅ Styles responsive con Tailwind

**Uso básico**:
```vue
<template>
  <iframe-loader
    :src="externalUrl"
    :is-visible="true"
    class="w-full h-full"
  />
</template>

<script setup>
import { computed } from 'vue';
import IframeLoader from '@/shared/components/IframeLoader.vue';

const externalUrl = computed(() =>
  window.chatwootConfig?.myUrl || 'http://localhost:3000'
);
</script>
```

### Frame (Dashboard App)

**Ubicación**: `app/javascript/dashboard/components/widgets/DashboardApp/Frame.vue`

**Props**:
```typescript
{
  src: String,           // URL del iframe
  config: Object,        // Configuración de la app
  currentChat: Object,   // Conversación actual (opcional)
}
```

**Características**:
- ✅ Comunicación postMessage bidireccional
- ✅ Contexto de conversación/contacto/agente
- ✅ Event handlers personalizables
- ✅ Lifecycle management

**Uso avanzado con contexto**:
```vue
<template>
  <frame
    :src="appUrl"
    :config="appConfig"
    :current-chat="currentConversation"
    @ready="onFrameReady"
    @action="onFrameAction"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import Frame from '@/dashboard/components/widgets/DashboardApp/Frame.vue';
import { useStore } from 'vuex';

const store = useStore();

const appUrl = computed(() =>
  window.chatwootConfig?.customAppUrl || ''
);

const appConfig = ref({
  apiKey: 'xxx',
  accountId: store.getters.getCurrentAccountId
});

const currentConversation = computed(() =>
  store.getters['conversationPage/getCurrentConversation']
);

const onFrameReady = () => {
  console.log('Frame loaded and ready');
};

const onFrameAction = (event) => {
  // Handle actions from iframe
  if (event.action === 'send_message') {
    // Send message logic
  }
};
</script>
```

### Cuándo usar cada uno

**Usa `IframeLoader`** cuando:
- ✅ Solo necesitas embeder una URL simple
- ✅ No requieres comunicación con el iframe
- ✅ Es una aplicación standalone sin integración profunda

**Usa `Frame`** cuando:
- ✅ Necesitas pasar contexto de Chatwoot al iframe
- ✅ Requieres comunicación bidireccional (postMessage)
- ✅ La app externa necesita interactuar con conversaciones/contactos
- ✅ Es una "Dashboard App" integrada

---

## Mejores Prácticas

### 1. Seguridad

#### CORS Configuration
Asegúrate que tu backend externo permita requests desde Chatwoot:

```javascript
// Express example
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-chatwoot-domain.com'
  ],
  credentials: true
}));
```

#### CSP Headers
Si usas Content Security Policy, permite iframe sources:

```ruby
# config/initializers/content_security_policy.rb
Rails.application.config.content_security_policy do |policy|
  policy.frame_src :self,
    'http://localhost:5173',
    'https://multibackendopenia-production.up.railway.app'
end
```

#### Authentication
Considera pasar tokens de autenticación:

```vue
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const authenticatedUrl = computed(() => {
  const baseUrl = window.chatwootConfig?.iaUrl;
  const token = store.getters['auth/getAuthToken'];
  const accountId = store.getters.getCurrentAccountId;

  return `${baseUrl}?token=${token}&accountId=${accountId}`;
});
</script>
```

⚠️ **Cuidado**: Evita pasar tokens sensibles en query params en producción. Considera usar postMessage para pasar credenciales después del load.

### 2. Performance

#### Lazy Loading
Usa dynamic imports para componentes pesados:

```javascript
// campaigns.routes.js
const Index = () => import('./Index.vue'); // ✅ Lazy load

// ❌ NO hagas esto:
// import Index from './Index.vue';
```

#### Preload Links
Para backends críticos, considera preload en el layout:

```erb
<!-- app/views/layouts/vueapp.html.erb -->
<link rel="preconnect" href="<%= ENV['IA_URL'] %>">
<link rel="dns-prefetch" href="<%= ENV['IA_URL'] %>">
```

#### Loading States
Siempre muestra estados de carga al usuario:

```vue
<template>
  <div class="relative h-full">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <spinner />
      <p>Cargando Inteligencia Artificial...</p>
    </div>
    <iframe-loader
      :src="iaUrl"
      @load="loading = false"
    />
  </div>
</template>
```

### 3. Error Handling

#### Fallbacks
Siempre ten URLs de fallback:

```vue
<script setup>
const iaUrl = computed(() => {
  return window.chatwootConfig?.iaUrl ||
         ENV.IA_URL ||
         'https://multibackendopenia-production.up.railway.app';
});
</script>
```

#### Error Boundaries
Maneja errores de carga del iframe:

```vue
<script setup>
import { ref } from 'vue';

const error = ref(null);
const retryCount = ref(0);
const maxRetries = 3;

const handleError = () => {
  if (retryCount.value < maxRetries) {
    retryCount.value++;
    // Retry logic
  } else {
    error.value = 'No se pudo cargar la aplicación. Por favor, contacta soporte.';
  }
};
</script>

<template>
  <div v-if="error" class="error-state">
    {{ error }}
  </div>
  <iframe-loader
    v-else
    :src="iaUrl"
    @error="handleError"
  />
</template>
```

### 4. i18n (Internacionalización)

Actualmente los labels están hardcoded. Para implementar i18n correctamente:

#### Backend (Rails)

Edita: `config/locales/en.yml`
```yaml
en:
  sidebar:
    artificial_intelligence: "Artificial Intelligence"
    ia_dashboard: "Dashboard"
    ia_documents: "Documents"
    ia_conversations: "Conversations"
    ia_multimedia: "Multimedia"
    ia_prompts: "Prompts"
    ia_administration: "Administration"
    ia_enterprise: "Enterprise"
    ia_health: "Health Check"
```

Crea: `config/locales/es.yml`
```yaml
es:
  sidebar:
    artificial_intelligence: "Inteligencia Artificial"
    ia_dashboard: "Dashboard"
    ia_documents: "Documentos"
    ia_conversations: "Conversaciones"
    ia_multimedia: "Multimedia"
    ia_prompts: "Prompts"
    ia_administration: "Administración"
    ia_enterprise: "Enterprise"
    ia_health: "Health Check"
```

#### Frontend (Vue)

Edita: `app/javascript/dashboard/i18n/locale/en/index.json`
```json
{
  "SIDEBAR": {
    "ARTIFICIAL_INTELLIGENCE": "Artificial Intelligence",
    "IA_DASHBOARD": "Dashboard",
    "IA_DOCUMENTS": "Documents",
    "IA_CONVERSATIONS": "Conversations",
    "IA_MULTIMEDIA": "Multimedia",
    "IA_PROMPTS": "Prompts",
    "IA_ADMINISTRATION": "Administration",
    "IA_ENTERPRISE": "Enterprise",
    "IA_HEALTH": "Health Check"
  }
}
```

Actualiza: `app/javascript/dashboard/components-next/sidebar/Sidebar.vue`
```vue
<template>
  <SidebarItem
    :icon="'i-lucide-brain'"
    :label="$t('SIDEBAR.ARTIFICIAL_INTELLIGENCE')"
    :is-child-menu-active="isIaMenuActive"
    @click="toggleSubmenu('ia')"
  >
    <template #submenu>
      <div v-if="isSubmenuOpen.ia" class="submenu">
        <SidebarSubmenuItem
          :to="`/app/accounts/${accountId}/ia/dashboard`"
          :label="$t('SIDEBAR.IA_DASHBOARD')"
          :icon="'i-lucide-layout-dashboard'"
        />
        <!-- ... más items ... -->
      </div>
    </template>
  </SidebarItem>
</template>
```

### 5. Logging y Debugging

#### Console Logs
Agrega logs para debugging en desarrollo:

```vue
<script setup>
import { computed, watch } from 'vue';

const iaUrl = computed(() => {
  const url = window.chatwootConfig?.iaUrl || 'default';

  if (import.meta.env.DEV) {
    console.log('[IA Dashboard] URL:', url);
  }

  return url;
});

watch(iaUrl, (newUrl) => {
  if (import.meta.env.DEV) {
    console.log('[IA Dashboard] URL changed to:', newUrl);
  }
});
</script>
```

#### Error Tracking
Integra con servicios de error tracking:

```vue
<script setup>
const handleError = (error) => {
  console.error('[IA Dashboard] Error:', error);

  // Send to error tracking service
  if (window.Sentry) {
    window.Sentry.captureException(error, {
      tags: { component: 'IADashboard' }
    });
  }
};
</script>
```

### 6. Testing

#### E2E Tests (Cypress)
```javascript
// cypress/integration/ia_dashboard.spec.js
describe('IA Dashboard', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'password');
    cy.visit('/app/accounts/1/ia');
  });

  it('loads IA dashboard iframe', () => {
    cy.get('iframe').should('exist');
    cy.get('iframe').should('have.attr', 'src')
      .and('include', 'multibackendopenia-production.up.railway.app');
  });

  it('navigates to documents section', () => {
    cy.get('[data-testid="sidebar-ia-documents"]').click();
    cy.url().should('include', '/ia/documentos');
  });
});
```

#### Component Tests (Vitest)
```javascript
// app/javascript/dashboard/routes/dashboard/ia/Index.spec.js
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Index from './Index.vue';

describe('IA Dashboard Index', () => {
  it('renders iframe with correct URL', () => {
    window.chatwootConfig = {
      iaUrl: 'https://test-backend.com'
    };

    const wrapper = mount(Index, {
      global: {
        mocks: {
          $route: { params: { section: 'dashboard' } }
        }
      }
    });

    const iframe = wrapper.find('iframe');
    expect(iframe.attributes('src')).toBe('https://test-backend.com');
  });
});
```

---

## Troubleshooting

### Problema: Iframe no carga / Pantalla en blanco

**Causas posibles**:
1. URL del backend incorrecta o no accesible
2. Problemas de CORS
3. CSP blocking iframe
4. Backend no responde

**Soluciones**:

```bash
# 1. Verificar configuración
# En Rails console:
rails c
> ENV['IA_URL']
> Rails.application.config.x.single_tenant_url

# 2. Verificar en browser console
console.log(window.chatwootConfig);

# 3. Verificar CORS en backend
# Asegúrate que permite origen de Chatwoot

# 4. Verificar CSP
# En browser console busca errores CSP
# Ajusta config/initializers/content_security_policy.rb

# 5. Verificar que backend está corriendo
curl https://multibackendopenia-production.up.railway.app
```

### Problema: Cambios en .env no se reflejan

**Causa**: Rails cachea configuración al iniciar

**Solución**:
```bash
# Desarrollo
bin/rails restart
# O detener y volver a iniciar el server

# Docker
docker-compose down
docker-compose up -d
```

### Problema: Ruta Vue no funciona (404)

**Causas posibles**:
1. Falta registrar rutas en `dashboard.routes.js`
2. Falta agregar ruta Rails en `config/routes.rb`
3. Permisos incorrectos

**Soluciones**:

```javascript
// 1. Verificar import en dashboard.routes.js
import myNewRoutes from './my-new-feature/my-new.routes';

export default {
  routes: [
    ...myNewRoutes.routes, // ✅ Debe estar aquí
  ]
};
```

```ruby
# 2. Verificar ruta Rails (config/routes.rb)
get '/app/accounts/:account_id/my-feature',
    to: 'dashboard#index',
    as: 'account_my_feature'
```

```javascript
// 3. Verificar permisos en rutas Vue
{
  path: frontendURL('accounts/:accountId/my-feature'),
  meta: {
    permissions: ['administrator', 'agent'], // ✅ Usuario debe tener uno de estos roles
  },
  component: Index,
}
```

### Problema: postMessage no funciona entre iframe y Chatwoot

**Causa**: Origen incorrecto o event listeners no configurados

**Solución**:

```javascript
// En tu backend (dentro del iframe)
window.parent.postMessage({
  event: 'custom-event',
  data: { foo: 'bar' }
}, 'https://your-chatwoot-domain.com'); // ⚠️ Especifica origen correcto

// En Chatwoot (componente Frame.vue)
const handleMessage = (event) => {
  // ⚠️ Verifica origen por seguridad
  if (event.origin !== 'https://your-backend-domain.com') {
    return;
  }

  if (event.data.event === 'custom-event') {
    console.log(event.data.data);
  }
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage); // ⚠️ Cleanup importante
});
```

### Problema: Variables de entorno no definidas en producción

**Causa**: No están configuradas en docker-compose o hosting

**Solución**:

```yaml
# docker-compose.production.yaml
services:
  rails:
    environment:
      - IA_URL=${IA_URL}  # ⚠️ Asegúrate que está definida
      # O directamente:
      - IA_URL=https://your-backend.railway.app
```

```bash
# Railway / Heroku / otros
# Configurar en UI o CLI:
railway variables set IA_URL=https://your-backend.railway.app
```

### Problema: Íconos no se muestran en sidebar

**Causa**: Nombre incorrecto del ícono o librería no cargada

**Solución**:

```vue
<!-- ✅ Correcto (Lucide icons) -->
:icon="'i-lucide-brain'"
:icon="'i-lucide-file-text'"

<!-- ❌ Incorrecto -->
:icon="'brain'"
:icon="'lucide-brain'"
```

Verifica íconos disponibles en: https://lucide.dev/icons/

### Problema: Enterprise overlay conflictos

**Causa**: Modificaciones en OSS no compatibles con Enterprise

**Solución**:

```bash
# 1. Buscar archivos relacionados en enterprise/
rg -n "IaDashboard|ia_dashboard" app enterprise

# 2. Si hay override en enterprise/, actualizar ambos
# OSS: app/javascript/dashboard/routes/dashboard/ia/Index.vue
# Enterprise: enterprise/app/javascript/dashboard/routes/dashboard/ia/Index.vue

# 3. Usar extension points cuando sea posible
# En lugar de modificar directamente, usar:
# - prepend_mod_with en Ruby
# - Hooks/events en Vue
```

---

## Recursos Adicionales

### Documentación Oficial
- **Chatwoot Development**: https://www.chatwoot.com/docs/contributing-guide
- **Vue 3 Composition API**: https://vuejs.org/guide/extras/composition-api-faq.html
- **Rails Routing**: https://guides.rubyonrails.org/routing.html
- **Lucide Icons**: https://lucide.dev/icons/

### Ejemplos en este Repo
- **IA Dashboard**: `app/javascript/dashboard/routes/dashboard/ia/`
- **Single Tenant**: `app/javascript/dashboard/routes/dashboard/single_tenant/`
- **Multi-Tenant**: `app/javascript/superadmin_pages/views/multitenant/`

### Notas de Desarrollo Enterprise
- **Enterprise Development Guide**: https://chatwoot.help/hc/handbook/articles/developing-enterprise-edition-features-38

---

## Changelog

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2025-11-13 | 1.0.0 | Documentación inicial del sistema de embedding |

---

## Contribuciones

Si encuentras errores o mejoras para esta documentación:
1. Edita este archivo: `docs/embedding-external-frontends.md`
2. Haz commit con mensaje descriptivo
3. Crea PR para revisión

---

**Mantenido por**: Equipo Chatwoot Ilimitated
**Última actualización**: 2025-11-13
