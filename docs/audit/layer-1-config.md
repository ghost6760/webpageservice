# Layer 1: Config Layer — Technical Audit

**Layer**: Configuration Management
**Analyzed**: 2025-11-07
**Files**: 8 (5 Python modules + 3 JSON config files)
**Complexity**: Medium
**Status**: ✅ Complete

---

## Executive Summary

The Config Layer provides the foundational multi-tenant configuration system for the entire application. It implements a three-tier configuration hierarchy:

1. **Base Config** (`companies_config.json`) — Minimal company definitions
2. **Extended Config** (`extended_companies_config.json`) — Rich metadata per company
3. **Custom Prompts** (`custom_prompts.json`) — Per-company agent prompts

### Key Strengths
✅ Clean dataclass-based configuration model (`CompanyConfig`)
✅ Comprehensive extended configuration with 20+ fields per company
✅ Redis key pattern abstraction for multi-tenancy
✅ Flask configuration class hierarchy (Dev/Staging/Prod)
✅ Centralized constants for system-wide values

### Critical Issues
🚨 **Empty base configuration** — `companies_config.json` is `{}`
🚨 **No environment variable validation** — `.env.example` is empty
⚠️ **Hardcoded fallbacks** — Redis prefix defaults to `f"{company_id}:"` if config missing
⚠️ **No schema validation** — JSON configs lack validation (Pydantic/marshmallow)
⚠️ **Circular import risk** — `redis_service.py` imports from `company_config.py`

### Maturity Score: **6/10**
- **Functionality**: 8/10 — Works well with extended config
- **Reliability**: 5/10 — Lacks validation and error handling
- **Maintainability**: 7/10 — Clean structure but no tests
- **Scalability**: 6/10 — Manual JSON editing doesn't scale
- **Security**: 5/10 — No secrets management pattern

---

## 1. Structure & Inventory

### File Tree
```
app/config/
├── __init__.py                      # Package exports (31 lines)
├── company_config.py                # Core config manager (125 lines)
├── constants.py                     # System constants (84 lines)
├── extended_company_config.py       # Extended loader (51 lines)
└── settings.py                      # Flask settings (65 lines)

Root-level configs:
├── companies_config.json            # Base config (EMPTY: {})
├── extended_companies_config.json   # Extended metadata (357 lines)
├── custom_prompts.json              # Agent prompts (207 lines)
└── .env.example                     # Environment template (EMPTY)
```

### Component Breakdown

#### **1.1 `company_config.py`** (125 lines)
**Purpose**: Multi-tenant configuration management

**Key Classes**:
```python
@dataclass
class CompanyConfig:
    company_id: str
    company_name: str
    embedding_model: str = "text-embedding-3-large"
    chat_model: str = "gpt-4o"
    temperature: float = 0.7
    max_tokens: int = 500
    top_k_results: int = 5
    redis_prefix: str = ""
    vector_namespace: str = ""

    def __post_init__(self):
        if not self.redis_prefix:
            self.redis_prefix = f"{self.company_id}:"
        if not self.vector_namespace:
            self.vector_namespace = f"{self.company_id}_vectors"
```

**Manager Pattern**:
```python
class CompanyConfigManager:
    def __init__(self):
        self._configs: Dict[str, CompanyConfig] = {}
        self._load_configs()

    def get_config(self, company_id: str) -> Optional[CompanyConfig]:
        return self._configs.get(company_id)

    def _load_configs(self):
        # Loads from companies_config.json
        # Falls back to extended_companies_config.json
```

**Global Singleton**:
```python
_config_manager = CompanyConfigManager()

def get_company_config(company_id: str) -> Optional[CompanyConfig]:
    return _config_manager.get_config(company_id)
```

**Analysis**:
- ✅ Clean dataclass design with sensible defaults
- ✅ Automatic Redis prefix/namespace generation
- ⚠️ Singleton pattern without thread safety mechanisms
- ⚠️ No validation of model names or parameter ranges
- 🚨 Falls back silently when config missing

---

#### **1.2 `extended_company_config.py`** (51 lines)
**Purpose**: Load extended company metadata beyond basic config

**Key Function**:
```python
def load_extended_companies_config() -> Dict[str, Any]:
    """
    Carga extended_companies_config.json con metadata adicional:
    - company_description, industry, timezone, locale
    - Configuración de servicios (Chatwoot, calendarios, email)
    - Business hours, special_hours
    """
    try:
        with open('extended_companies_config.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.warning("extended_companies_config.json not found")
        return {}
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}")
        return {}
```

**Extended Schema** (per company):
```json
{
  "company_id": "benova",
  "company_name": "Benova Wellness",
  "company_description": "...",
  "industry": "wellness",
  "timezone": "America/Bogota",
  "locale": "es_CO",
  "currency": "COP",
  "embedding_model": "text-embedding-3-large",
  "chat_model": "gpt-4o",
  "temperature": 0.7,
  "max_tokens": 500,
  "top_k_results": 5,
  "business_hours": {...},
  "special_hours": [],
  "services": {
    "chatwoot": {...},
    "calendar": {...},
    "email": {...}
  },
  "vector_namespace": "benova_vectors",
  "redis_prefix": "benova:",
  "custom_settings": {...}
}
```

**Analysis**:
- ✅ Rich metadata for multi-tenant SaaS
- ✅ Proper error handling with logging
- ✅ Service configuration per company (Chatwoot, calendar, email)
- ⚠️ No schema validation — typos in JSON will cause runtime errors
- ⚠️ Business hours format not validated

**Supported Companies**:
1. `benova` — Benova Wellness
2. `spa_wellness` — Spa Wellness Center
3. `medispa` — MediSpa Aesthetics
4. `dental_clinic` — Dental Care Clinic

---

#### **1.3 `constants.py`** (84 lines)
**Purpose**: System-wide constants

**Key Constants**:
```python
# Agent Types
AGENT_TYPES = {
    'SALES': 'sales',
    'SUPPORT': 'support',
    'EMERGENCY': 'emergency',
    'ROUTER': 'router',
    'SCHEDULE': 'schedule',
    'AVAILABILITY': 'availability'
}

# Redis Key Patterns
REDIS_KEY_PATTERNS = {
    'conversation': '{company_prefix}conversation:{session_id}',
    'user_context': '{company_prefix}user:{user_id}',
    'agent_state': '{company_prefix}agent:{agent_id}:state',
    'shared_state': '{company_prefix}shared_state:{session_id}',
    'rate_limit': '{company_prefix}rate_limit:{identifier}',
    'cache': '{company_prefix}cache:{key}',
    'oauth': '{company_prefix}oauth:{service}:{user_id}',
    'calendar': '{company_prefix}calendar:{user_id}',
    'embeddings': '{company_prefix}embeddings:{doc_id}'
}

# Vector Store Settings
VECTOR_DIMENSIONS = 3072  # text-embedding-3-large
DEFAULT_CHUNK_SIZE = 1000
DEFAULT_CHUNK_OVERLAP = 200

# API Rate Limits
MAX_REQUESTS_PER_MINUTE = 60
MAX_TOKENS_PER_REQUEST = 8000

# Session Settings
SESSION_TIMEOUT_SECONDS = 3600
MAX_CONVERSATION_HISTORY = 50

# Search Settings
DEFAULT_SEARCH_K = 5
MAX_SEARCH_K = 20
HYBRID_SEARCH_ALPHA = 0.5  # Balance between BM25 and semantic
```

**Analysis**:
- ✅ Well-organized constant categories
- ✅ Redis key patterns use company prefix for multi-tenancy
- ✅ Sensible defaults for embeddings (dimension 3072 for text-embedding-3-large)
- ✅ Rate limiting constants defined
- ⚠️ No Enum classes — string constants prone to typos
- ⚠️ Hardcoded magic numbers (e.g., 3072, 1000, 200)
- ℹ️ `HYBRID_SEARCH_ALPHA = 0.5` — Balanced default for BM25/semantic search

---

#### **1.4 `settings.py`** (65 lines)
**Purpose**: Flask application configuration

**Key Classes**:
```python
class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://localhost/multibackend'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')

    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')

    # Session
    SESSION_TYPE = 'redis'
    PERMANENT_SESSION_LIFETIME = 3600

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    # Additional production settings

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost/multibackend_test'
```

**Export Function**:
```python
def get_config(env: str = 'development') -> Config:
    configs = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'testing': TestingConfig
    }
    return configs.get(env, DevelopmentConfig)
```

**Analysis**:
- ✅ Standard Flask configuration pattern
- ✅ Environment-based config selection
- ✅ Sensible fallbacks for development
- 🚨 **SECRET_KEY fallback is insecure** — Should fail in production if not set
- 🚨 **No validation** of `OPENAI_API_KEY` presence
- ⚠️ CORS wildcard `*` in default — Security risk in production
- ⚠️ No explicit session security settings (SECURE, HTTPONLY, SAMESITE)
- ℹ️ Session lifetime 3600s matches `constants.SESSION_TIMEOUT_SECONDS`

---

#### **1.5 `__init__.py`** (31 lines)
**Purpose**: Package initialization and exports

```python
from app.config.company_config import (
    CompanyConfig,
    get_company_config
)
from app.config.constants import (
    AGENT_TYPES,
    REDIS_KEY_PATTERNS,
    VECTOR_DIMENSIONS,
    DEFAULT_CHUNK_SIZE,
    DEFAULT_CHUNK_OVERLAP,
    MAX_REQUESTS_PER_MINUTE,
    SESSION_TIMEOUT_SECONDS
)
from app.config.settings import Config, get_config
from app.config.extended_company_config import load_extended_companies_config

__all__ = [
    'CompanyConfig',
    'get_company_config',
    'AGENT_TYPES',
    'REDIS_KEY_PATTERNS',
    # ... etc
]
```

**Analysis**:
- ✅ Clean public API surface
- ✅ Explicit `__all__` exports
- ✅ Centralized imports for consumers

---

### External Configuration Files

#### **1.6 `companies_config.json`** (EMPTY)
**Content**: `{}`

**Analysis**:
- 🚨 **CRITICAL**: Base config file is completely empty
- 🚨 `CompanyConfigManager._load_configs()` will find zero companies
- ℹ️ System appears to rely entirely on `extended_companies_config.json` as fallback
- ⚠️ This violates the documented three-tier config hierarchy

**Impact**:
- All company lookups fall back to extended config
- No clear separation between "base" and "extended" configs
- Confusing for developers expecting base config to work

---

#### **1.7 `extended_companies_config.json`** (357 lines)
**Content**: Detailed configuration for 4 companies

**Sample Structure** (benova):
```json
{
  "benova": {
    "company_id": "benova",
    "company_name": "Benova Wellness",
    "company_description": "Centro de bienestar integral...",
    "industry": "wellness",
    "timezone": "America/Bogota",
    "locale": "es_CO",
    "currency": "COP",
    "embedding_model": "text-embedding-3-large",
    "chat_model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 500,
    "top_k_results": 5,
    "business_hours": {
      "monday": {"open": "08:00", "close": "18:00", "enabled": true},
      "tuesday": {"open": "08:00", "close": "18:00", "enabled": true},
      "wednesday": {"open": "08:00", "close": "18:00", "enabled": true},
      "thursday": {"open": "08:00", "close": "18:00", "enabled": true},
      "friday": {"open": "08:00", "close": "18:00", "enabled": true},
      "saturday": {"open": "09:00", "close": "14:00", "enabled": true},
      "sunday": {"enabled": false}
    },
    "special_hours": [],
    "services": {
      "chatwoot": {
        "enabled": true,
        "account_id": "123456",
        "inbox_id": "789"
      },
      "calendar": {
        "enabled": true,
        "provider": "google",
        "calendar_id": "primary"
      },
      "email": {
        "enabled": true,
        "from_address": "contacto@benova.com",
        "smtp_host": "smtp.gmail.com"
      }
    },
    "vector_namespace": "benova_vectors",
    "redis_prefix": "benova:",
    "custom_settings": {
      "enable_voice": true,
      "enable_video": false,
      "default_language": "es"
    }
  },
  "spa_wellness": { /* similar structure */ },
  "medispa": { /* similar structure */ },
  "dental_clinic": { /* similar structure */ }
}
```

**Analysis**:
- ✅ Comprehensive per-company configuration
- ✅ Service toggles (Chatwoot, calendar, email)
- ✅ Business hours with per-day enabled flags
- ✅ Timezone-aware setup
- ⚠️ **No schema validation** — Easy to introduce typos
- ⚠️ **Sensitive data in repo** — SMTP credentials, API IDs
- ⚠️ Time format `"08:00"` is string, not validated
- ℹ️ `special_hours` array empty for all companies

**Companies Configured**:
1. **benova** — Wellness center, Spanish/COP, 8am-6pm weekdays
2. **spa_wellness** — Spa center, Spanish/COP, 9am-7pm
3. **medispa** — Medical aesthetics, Spanish/COP, 10am-6pm
4. **dental_clinic** — Dental care, Spanish/COP, 8am-5pm

---

#### **1.8 `custom_prompts.json`** (207 lines)
**Purpose**: Per-company agent system prompts

**Structure**:
```json
{
  "benova": {
    "system_prompt": "Eres un asistente virtual de Benova Wellness...",
    "sales_prompt": "Como agente de ventas de Benova...",
    "support_prompt": "Como agente de soporte técnico...",
    "emergency_prompt": "Como agente de emergencias...",
    "schedule_prompt": "Como agente de agendamiento...",
    "availability_prompt": "Como agente de disponibilidad..."
  },
  "spa_wellness": { /* similar structure */ },
  "medispa": { /* similar structure */ },
  "dental_clinic": { /* similar structure */ }
}
```

**Analysis**:
- ✅ Properly namespaced by company
- ✅ Specialized prompts per agent type
- ✅ Spanish language prompts match locale
- ⚠️ Duplicated prompt keys vs. `AGENT_TYPES` in constants.py
- ⚠️ No fallback mechanism if company/agent prompt missing
- ℹ️ Prompts are loaded by `prompt_service.py` (Layer 2)

---

#### **1.9 `.env.example`** (EMPTY)
**Content**: (File is empty)

**Expected Content** (based on `settings.py`):
```bash
# Flask
SECRET_KEY=your-secret-key-here
FLASK_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/multibackend

# Redis
REDIS_URL=redis://localhost:6379/0

# OpenAI
OPENAI_API_KEY=sk-...

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=INFO

# Session
SESSION_TYPE=redis
PERMANENT_SESSION_LIFETIME=3600
```

**Analysis**:
- 🚨 **CRITICAL**: Template is completely empty
- 🚨 New developers have no guidance on required environment variables
- 🚨 No documentation of OAuth credentials, API keys, etc.
- ⚠️ Increases onboarding friction significantly

---

## 2. Integration Points

### Upstream Dependencies (None)
- Config layer is the foundation — no dependencies on other app layers

### Downstream Consumers

#### **Services Layer (Layer 2)**
- `redis_service.py:34-50` → Imports `get_company_config()` for Redis key prefixes
- `openai_service.py` → Uses `CompanyConfig` for model selection
- `prompt_service.py` → Loads custom prompts from `custom_prompts.json`
- `vectorstore_service.py` → Uses `VECTOR_DIMENSIONS`, `DEFAULT_CHUNK_SIZE`
- `shared_state_store.py` → Uses `SESSION_TIMEOUT_SECONDS`
- `multi_agent_factory.py` → Uses `AGENT_TYPES` for agent creation

#### **Routes Layer (Layer 4)**
- API routes import `get_company_config()` for tenant resolution

#### **Agents Layer (Layer 7)**
- Agent nodes import `CompanyConfig` for LLM parameters

#### **Entry Point (Layer 9)**
- `app.py` → Imports `get_config()` for Flask app initialization

### External Dependencies
```python
# Standard library
import os
import json
import logging
from dataclasses import dataclass
from typing import Dict, Optional, Any

# No external packages (e.g., Pydantic, marshmallow)
```

---

## 3. Functional Flow

### Configuration Loading Sequence

```
1. Application Start (app.py)
   └─> settings.get_config(env='development')
       └─> Returns Config/DevelopmentConfig/ProductionConfig

2. CompanyConfigManager Singleton Initialization
   └─> _load_configs()
       ├─> Load companies_config.json (EMPTY → 0 configs)
       └─> Fallback: Load extended_companies_config.json
           └─> Parse 4 companies → Create CompanyConfig instances

3. Runtime: Company Resolution
   └─> get_company_config(company_id='benova')
       └─> _config_manager.get_config('benova')
           └─> Return CompanyConfig(
                 company_id='benova',
                 company_name='Benova Wellness',
                 embedding_model='text-embedding-3-large',
                 chat_model='gpt-4o',
                 temperature=0.7,
                 redis_prefix='benova:',
                 vector_namespace='benova_vectors',
                 ...
               )

4. Redis Key Generation (redis_service.py)
   └─> get_company_redis_key(company_id='benova', key_type='conversation', identifier='abc123')
       ├─> config = get_company_config('benova')
       ├─> prefix = config.redis_prefix  # 'benova:'
       ├─> pattern = REDIS_KEY_PATTERNS['conversation']  # '{company_prefix}conversation:{session_id}'
       ├─> base_key = pattern.format(company_prefix=prefix)  # 'benova:conversation:'
       └─> return f"{base_key}abc123"  # 'benova:conversation:abc123'
```

### Multi-Tenant Request Flow

```
HTTP Request → API Route
  ↓
Extract company_id from request (header/path/subdomain)
  ↓
get_company_config(company_id)
  ↓
Use config for:
  - LLM model selection
  - Redis key prefixing
  - Vector namespace
  - Temperature/max_tokens
  - Custom prompts
  ↓
Return company-specific response
```

---

## 4. Bugs & Issues

### Critical Bugs

#### 🚨 **BUG-CFG-001: Empty Base Configuration**
**File**: `companies_config.json`
**Line**: N/A (entire file)
**Severity**: High

**Issue**:
Base configuration file is completely empty `{}`. The `CompanyConfigManager._load_configs()` expects to load companies from this file but will find none.

**Impact**:
- Violates documented configuration hierarchy
- All companies loaded from "extended" config (not base)
- Confusing for developers expecting base config to work

**Evidence**:
```python
# company_config.py:60-70
def _load_configs(self):
    try:
        with open('companies_config.json', 'r') as f:
            companies_data = json.load(f)  # Returns {}
            for company_id, data in companies_data.items():  # Loop never executes
                config = CompanyConfig(**data)
                self._configs[company_id] = config
    except FileNotFoundError:
        # Falls back to extended config
```

**Fix**:
Either:
1. Remove `companies_config.json` and only use `extended_companies_config.json`
2. Populate `companies_config.json` with minimal base configs

**Suggested PR**: "Fix empty base config or remove redundant file"

---

#### 🚨 **BUG-CFG-002: Empty Environment Template**
**File**: `.env.example`
**Line**: N/A (entire file)
**Severity**: High

**Issue**:
Environment variable template is empty. New developers have no guidance on required variables.

**Impact**:
- Onboarding friction
- Missing critical secrets (OPENAI_API_KEY, DATABASE_URL)
- Application crashes with cryptic errors

**Evidence**:
```bash
$ cat .env.example
# (empty file)
```

**Fix**:
Populate `.env.example` with all required environment variables from `settings.py`:
```bash
SECRET_KEY=change-this-in-production
DATABASE_URL=postgresql://localhost/multibackend
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=sk-your-key-here
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
```

**Suggested PR**: "Add comprehensive .env.example template"

---

#### 🚨 **BUG-CFG-003: Insecure SECRET_KEY Fallback**
**File**: `app/config/settings.py:8`
**Line**: 8
**Severity**: High (Security)

**Issue**:
```python
SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
```

Hardcoded fallback secret key will be used in production if `SECRET_KEY` not set.

**Impact**:
- Session hijacking vulnerability
- CSRF token prediction
- Production security breach

**Fix**:
Fail fast in production if SECRET_KEY not set:
```python
SECRET_KEY = os.environ.get('SECRET_KEY')
if not SECRET_KEY and not os.environ.get('FLASK_ENV') == 'development':
    raise ValueError("SECRET_KEY must be set in production")
```

**Suggested PR**: "Require SECRET_KEY in production environments"

---

### Medium Severity Issues

#### ⚠️ **BUG-CFG-004: No JSON Schema Validation**
**File**: `app/config/extended_company_config.py:20-30`
**Severity**: Medium

**Issue**:
Extended config JSON is loaded without schema validation. Typos or missing fields cause runtime errors.

**Example**:
```json
{
  "benova": {
    "company_id": "benova",
    "tempratrue": 0.7,  // Typo: should be "temperature"
    "busines_hours": {}  // Typo: should be "business_hours"
  }
}
```

**Impact**:
- Silent failures when accessing misconfigured fields
- No early error detection
- Difficult debugging

**Fix**:
Add Pydantic schema validation:
```python
from pydantic import BaseModel, validator

class CompanyConfigSchema(BaseModel):
    company_id: str
    company_name: str
    temperature: float = 0.7
    # ... etc

    @validator('temperature')
    def validate_temperature(cls, v):
        if not 0 <= v <= 2:
            raise ValueError("Temperature must be between 0 and 2")
        return v

def load_extended_companies_config() -> Dict[str, Any]:
    data = json.load(f)
    # Validate each company
    for company_id, config_data in data.items():
        CompanyConfigSchema(**config_data)  # Raises error if invalid
    return data
```

**Suggested PR**: "Add Pydantic schema validation for company configs"

---

#### ⚠️ **BUG-CFG-005: Circular Import Risk**
**File**: `app/services/redis_service.py:36`
**Line**: 36
**Severity**: Medium

**Issue**:
```python
# redis_service.py (Layer 2)
from app.config.company_config import get_company_config  # Layer 1
from app.config.constants import REDIS_KEY_PATTERNS  # Layer 1
```

While this is correct (Layer 2 imports Layer 1), if any config module imports from services, circular import occurs.

**Potential Risk**:
```python
# If someone adds this to company_config.py:
from app.services.redis_service import get_redis_client  # CIRCULAR!
```

**Fix**:
- Use dependency injection instead of direct imports
- Document layer dependency rules
- Add import linter (e.g., `import-linter`)

**Suggested PR**: "Add import-linter to prevent circular dependencies"

---

#### ⚠️ **BUG-CFG-006: CORS Wildcard in Production**
**File**: `app/config/settings.py:15`
**Line**: 15
**Severity**: Medium (Security)

**Issue**:
```python
CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
```

Default CORS policy allows all origins (`*`), which is insecure in production.

**Impact**:
- XSS attacks from malicious origins
- Session hijacking
- CSRF vulnerabilities

**Fix**:
```python
CORS_ORIGINS = os.environ.get('CORS_ORIGINS')
if not CORS_ORIGINS:
    if os.environ.get('FLASK_ENV') == 'production':
        raise ValueError("CORS_ORIGINS must be explicitly set in production")
    CORS_ORIGINS = 'http://localhost:3000'  # Dev default
CORS_ORIGINS = CORS_ORIGINS.split(',')
```

**Suggested PR**: "Require explicit CORS origins in production"

---

### Low Severity Issues

#### ℹ️ **BUG-CFG-007: No Thread Safety in Singleton**
**File**: `app/config/company_config.py:115`
**Severity**: Low

**Issue**:
```python
_config_manager = CompanyConfigManager()  # Module-level singleton
```

Singleton is created at module load time without thread safety. In high-concurrency scenarios (Gunicorn workers), this could cause race conditions during initialization.

**Impact**:
- Mostly safe because configs are read-only after initialization
- Potential issue if configs are hot-reloaded

**Fix**:
Use thread-safe singleton pattern:
```python
import threading

class CompanyConfigManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._load_configs()
        return cls._instance
```

**Suggested PR**: "Make CompanyConfigManager thread-safe singleton"

---

#### ℹ️ **BUG-CFG-008: Sensitive Data in Repo**
**File**: `extended_companies_config.json`
**Severity**: Low (Security)

**Issue**:
Configuration file contains sensitive data:
- Chatwoot account IDs
- Calendar IDs
- Email addresses
- SMTP hosts

**Impact**:
- If repo is public, sensitive IDs are exposed
- Not critical secrets (no passwords/API keys), but still risky

**Fix**:
1. Move sensitive configs to environment variables
2. Use secrets manager (AWS Secrets Manager, Vault)
3. Keep only non-sensitive defaults in JSON

**Suggested PR**: "Move sensitive config to environment variables"

---

## 5. Recommendations

### High Priority (Fix Immediately)

1. **Populate `.env.example`**
   - Add all required environment variables
   - Include comments explaining each variable
   - Provide sensible development defaults

2. **Fix Insecure SECRET_KEY Fallback**
   - Fail fast in production if SECRET_KEY not set
   - Generate random key for development

3. **Add JSON Schema Validation**
   - Use Pydantic for `CompanyConfig` validation
   - Validate extended config on load
   - Provide clear error messages for misconfigurations

4. **Resolve Empty `companies_config.json`**
   - Either populate it or remove it entirely
   - Update documentation to clarify config hierarchy
   - Consider single source of truth (only extended config)

### Medium Priority (Next Sprint)

5. **Implement Constants as Enums**
   ```python
   from enum import Enum

   class AgentType(str, Enum):
       SALES = "sales"
       SUPPORT = "support"
       EMERGENCY = "emergency"
       ROUTER = "router"
       SCHEDULE = "schedule"
       AVAILABILITY = "availability"
   ```

6. **Add Configuration Tests**
   ```python
   def test_company_config_loads_all_companies():
       manager = CompanyConfigManager()
       assert len(manager._configs) == 4
       assert "benova" in manager._configs

   def test_redis_prefix_fallback():
       config = CompanyConfig(company_id="test", company_name="Test")
       assert config.redis_prefix == "test:"
   ```

7. **Fix CORS Wildcard**
   - Require explicit origins in production
   - Validate origin format (must be URL)

8. **Document Layer Dependencies**
   - Create `ARCHITECTURE.md` explaining layer rules
   - Config Layer must have zero upstream dependencies
   - Add import linter to CI/CD

### Low Priority (Technical Debt)

9. **Move Sensitive Data to Secrets Manager**
   - Integrate AWS Secrets Manager or Vault
   - Keep only non-sensitive defaults in JSON

10. **Add Hot Reload for Configs**
    - Watch `extended_companies_config.json` for changes
    - Reload configs without restart
    - Useful for dynamic tenant onboarding

11. **Implement Configuration Versioning**
    - Add `config_version` field to JSON
    - Migrate old configs automatically
    - Prevent breaking changes

12. **Thread-Safe Singleton**
    - Add `threading.Lock()` to singleton initialization
    - Relevant for Gunicorn multi-worker setups

---

## 6. Suggested PRs/Issues

### Pull Requests

| ID | Title | Priority | Estimated Effort |
|----|-------|----------|------------------|
| **PR-CFG-001** | Add comprehensive .env.example template | High | 1 hour |
| **PR-CFG-002** | Require SECRET_KEY in production | High | 2 hours |
| **PR-CFG-003** | Add Pydantic schema validation for configs | High | 4 hours |
| **PR-CFG-004** | Remove empty companies_config.json | High | 1 hour |
| **PR-CFG-005** | Replace string constants with Enums | Medium | 3 hours |
| **PR-CFG-006** | Require explicit CORS origins in production | Medium | 2 hours |
| **PR-CFG-007** | Add configuration unit tests | Medium | 4 hours |
| **PR-CFG-008** | Add import-linter to prevent circular deps | Low | 2 hours |
| **PR-CFG-009** | Make CompanyConfigManager thread-safe | Low | 2 hours |
| **PR-CFG-010** | Move sensitive config to env vars | Low | 3 hours |

### Issues (Documentation/Research)

| ID | Title | Priority |
|----|-------|----------|
| **ISSUE-CFG-001** | Document configuration hierarchy in README | High |
| **ISSUE-CFG-002** | Research secrets management solutions | Medium |
| **ISSUE-CFG-003** | Create ARCHITECTURE.md with layer rules | Medium |
| **ISSUE-CFG-004** | Investigate config hot-reload solutions | Low |

---

## 7. Dependencies

### Upstream (Consumed By)
None — Config Layer is the foundation.

### Downstream (Consumes From)

**Python Standard Library**:
- `os` — Environment variable access
- `json` — JSON parsing
- `logging` — Logging
- `dataclasses` — `CompanyConfig` dataclass
- `typing` — Type hints

**No External Packages**:
- ❌ No Pydantic (recommended to add)
- ❌ No marshmallow
- ❌ No python-dotenv (could improve `.env` handling)

**Dependency on External Files**:
- `companies_config.json` (empty)
- `extended_companies_config.json` (357 lines)
- `custom_prompts.json` (207 lines)

**Environment Variables** (from `settings.py`):
```
Required:
- OPENAI_API_KEY (critical, no validation)

Optional (with fallbacks):
- SECRET_KEY (insecure fallback)
- DATABASE_URL (defaults to localhost PostgreSQL)
- REDIS_URL (defaults to localhost Redis)
- CORS_ORIGINS (defaults to wildcard)
- LOG_LEVEL (defaults to INFO)
```

---

## 8. Maturity & Quality Metrics

### Code Quality: **7/10**
✅ Clean dataclass design
✅ Proper logging
✅ Type hints present
⚠️ No tests
⚠️ No schema validation
⚠️ Hardcoded fallbacks

### Reliability: **5/10**
✅ Works for current 4 companies
⚠️ Silent failures on missing configs
⚠️ No validation of JSON structure
🚨 Empty base config file
🚨 Empty .env.example

### Security: **5/10**
✅ Redis key isolation per company
⚠️ Insecure SECRET_KEY fallback
⚠️ CORS wildcard default
⚠️ Sensitive data in repo (Chatwoot IDs, etc.)
⚠️ No secrets manager integration

### Scalability: **6/10**
✅ Multi-tenant architecture
✅ Redis prefix isolation
⚠️ Manual JSON editing doesn't scale
⚠️ No admin UI for config management
⚠️ No config versioning

### Maintainability: **7/10**
✅ Clean module structure
✅ Good separation of concerns
✅ Comprehensive extended config
⚠️ No tests
⚠️ Circular import risk
⚠️ No documentation

### **Overall Maturity Score: 6/10**

---

## 9. Developer Guidance

### How to Add a New Company

1. **Add to `extended_companies_config.json`**:
```json
{
  "new_company": {
    "company_id": "new_company",
    "company_name": "New Company Inc.",
    "company_description": "Description...",
    "industry": "healthcare",
    "timezone": "America/New_York",
    "locale": "en_US",
    "currency": "USD",
    "embedding_model": "text-embedding-3-large",
    "chat_model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 500,
    "top_k_results": 5,
    "business_hours": {
      "monday": {"open": "09:00", "close": "17:00", "enabled": true},
      // ... etc
    },
    "services": {
      "chatwoot": {"enabled": false},
      "calendar": {"enabled": false},
      "email": {"enabled": true, "from_address": "hello@newcompany.com"}
    },
    "vector_namespace": "new_company_vectors",
    "redis_prefix": "new_company:"
  }
}
```

2. **Add prompts to `custom_prompts.json`**:
```json
{
  "new_company": {
    "system_prompt": "You are an AI assistant for New Company Inc...",
    "sales_prompt": "As a sales agent...",
    "support_prompt": "As a support agent...",
    // ... etc
  }
}
```

3. **Restart application** — Configs are loaded at startup

### How to Access Company Config in Code

```python
from app.config import get_company_config

def my_service_function(company_id: str):
    config = get_company_config(company_id)

    if not config:
        raise ValueError(f"Company {company_id} not found")

    # Use config
    model = config.chat_model
    temperature = config.temperature
    redis_prefix = config.redis_prefix

    # ... business logic
```

### How to Add a New Constant

1. Add to `app/config/constants.py`:
```python
# New constant category
MY_NEW_CONSTANT = "value"
```

2. Export in `app/config/__init__.py`:
```python
from app.config.constants import MY_NEW_CONSTANT

__all__ = [
    # ... existing exports
    'MY_NEW_CONSTANT',
]
```

3. Use in other layers:
```python
from app.config import MY_NEW_CONSTANT
```

### How to Generate Company-Specific Redis Keys

```python
from app.services.redis_service import get_company_redis_key

# Generate key
key = get_company_redis_key(
    company_id='benova',
    key_type='conversation',
    identifier='session_abc123'
)
# Result: 'benova:conversation:session_abc123'

# Use with Redis
redis_client = get_redis_client()
redis_client.set(key, value, ex=3600)
```

### Common Pitfalls

❌ **Don't hardcode company IDs**:
```python
# BAD
if company_id == "benova":
    do_something()

# GOOD
config = get_company_config(company_id)
if config.custom_settings.get("enable_voice"):
    do_something()
```

❌ **Don't access JSON files directly**:
```python
# BAD
with open('extended_companies_config.json') as f:
    data = json.load(f)

# GOOD
from app.config import get_company_config
config = get_company_config(company_id)
```

❌ **Don't bypass Redis key generation**:
```python
# BAD
key = f"{company_id}:conversation:{session_id}"

# GOOD
key = get_company_redis_key(company_id, 'conversation', session_id)
```

### Testing Configurations

```python
import pytest
from app.config import get_company_config, CompanyConfig

def test_company_config_loads():
    config = get_company_config('benova')
    assert config is not None
    assert config.company_name == "Benova Wellness"
    assert config.redis_prefix == "benova:"

def test_company_config_fallback():
    config = CompanyConfig(company_id="test", company_name="Test Co.")
    # Should auto-generate prefix
    assert config.redis_prefix == "test:"
    assert config.vector_namespace == "test_vectors"

def test_invalid_company_returns_none():
    config = get_company_config('nonexistent')
    assert config is None
```

---

## 10. Conclusion

The Config Layer provides a **solid foundation** for multi-tenant configuration but has several **critical gaps** that need immediate attention:

### Strengths
✅ Clean dataclass-based architecture
✅ Comprehensive extended configuration with 20+ fields
✅ Proper Redis key isolation via prefixes
✅ Flexible service toggles (Chatwoot, calendar, email)
✅ Centralized constants for system-wide values

### Critical Gaps
🚨 Empty base config file (`companies_config.json`)
🚨 Empty environment template (`.env.example`)
🚨 No schema validation (prone to typos and runtime errors)
🚨 Insecure SECRET_KEY fallback in production
🚨 CORS wildcard default

### Immediate Action Items
1. Populate `.env.example` with all required variables
2. Add Pydantic schema validation to prevent config errors
3. Fix insecure SECRET_KEY fallback
4. Resolve empty `companies_config.json` (populate or remove)
5. Add unit tests for config loading

### Long-Term Improvements
- Implement configuration hot-reload
- Integrate secrets manager (AWS Secrets Manager / Vault)
- Build admin UI for config management
- Add configuration versioning
- Move sensitive data out of repo

**Estimated Remediation Effort**: 16-20 hours for high-priority fixes.

---

**Next Layer**: [Layer 2: Core Services →](layer-2-core-services.md)
