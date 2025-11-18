# Audit Map — MultiBackend OpenIA Repository

**Generated**: 2025-11-07
**Scope**: Backend audit of multi-tenant AI agent SaaS platform
**Excluded**: `app/agents_DEPRECATED_2025_10_31/`, `src/` (frontend)

---

## Repository Structure Overview

```
multibackendopenIA/
├── app/
│   ├── __init__.py                          # Flask application factory
│   ├── config/                              # Layer 1: Configuration
│   │   ├── __init__.py
│   │   ├── company_config.py               # Multi-tenant config manager
│   │   ├── constants.py                    # System-wide constants
│   │   ├── extended_company_config.py      # Extended config loader
│   │   └── settings.py                     # Flask settings
│   ├── services/                            # Layer 2: Core Services
│   │   ├── __init__.py
│   │   ├── calendar_integration_service.py
│   │   ├── chatwoot_service.py
│   │   ├── company_config_service.py
│   │   ├── email_service.py
│   │   ├── mcp_tool_registry.py
│   │   ├── multi_agent_factory.py
│   │   ├── multi_agent_orchestrator.py
│   │   ├── multimedia_service.py
│   │   ├── oauth_credential_service.py
│   │   ├── openai_service.py
│   │   ├── prompt_service.py
│   │   ├── redis_service.py
│   │   ├── shared_state_store.py           # 1180 lines - shared state management
│   │   └── vectorstore_service.py          # 1233 lines - RAG & hybrid search
│   ├── models/                              # Layer 3: Data Models
│   ├── routes/                              # Layer 4: API Routes
│   ├── middleware/                          # Layer 5: Middleware
│   ├── utils/                               # Layer 6: Utilities
│   ├── agents/                              # Layer 7: AI Agents (LangGraph)
│   ├── tools/                               # Layer 8: Agent Tools
│   └── tests/                               # Layer 10: Tests
├── docs/                                    # Layer 11: Documentation
├── companies_config.json                    # Base company configurations
├── extended_companies_config.json           # Extended company metadata
├── custom_prompts.json                      # Per-company agent prompts
├── .env.example                             # Environment variable template
├── requirements.txt                         # Python dependencies
└── app.py                                   # Layer 9: Entry Point

```

---

## Architectural Layers (11 Total)

| Layer | Name | Description | Complexity | Files |
|-------|------|-------------|------------|-------|
| **1** | **Config Layer** | Multi-tenant configuration, constants, settings | Medium | 5 Python + 3 JSON |
| **2** | **Core Services** | Business logic services (OpenAI, Redis, RAG, agents) | High | 14 services |
| **3** | **Data Models** | SQLAlchemy ORM models, dataclasses | Medium | TBD |
| **4** | **API Routes** | Flask blueprints, REST endpoints | Medium | TBD |
| **5** | **Middleware** | Auth, logging, error handling | Medium | TBD |
| **6** | **Utilities** | Helper functions, decorators | Low | TBD |
| **7** | **AI Agents** | LangGraph agent nodes & graphs | High | TBD |
| **8** | **Agent Tools** | Executable tools for agents | Medium | TBD |
| **9** | **Entry Point** | Application initialization | Low | 1 file |
| **10** | **Tests** | Unit, integration, E2E tests | Medium | TBD |
| **11** | **Documentation** | READMEs, guides, API docs | Low | TBD |

---

## Prioritized File Analysis List

### **CHAT 1: Layers 1-2 (Config + Core Services)** ✅

#### Layer 1: Config (8 files)
1. ✅ `app/config/company_config.py` — Multi-tenant CompanyConfig dataclass & manager
2. ✅ `app/config/extended_company_config.py` — Extended config loader
3. ✅ `app/config/constants.py` — Redis key patterns, system constants
4. ✅ `app/config/settings.py` — Flask configuration classes
5. ✅ `app/config/__init__.py` — Package initialization
6. ✅ `companies_config.json` — Base company configurations (empty)
7. ✅ `extended_companies_config.json` — Detailed company metadata
8. ✅ `.env.example` — Environment variables template (empty)

#### Layer 2: Core Services (14 files)
1. ✅ `app/services/vectorstore_service.py` — 1233 lines: Hybrid search (BM25+semantic), RAG, reranking
2. ✅ `app/services/shared_state_store.py` — 1180 lines: Multi-backend state management (Redis/memory)
3. ✅ `app/services/multi_agent_orchestrator.py` — Agent routing & orchestration logic
4. ✅ `app/services/multi_agent_factory.py` — Agent factory pattern
5. ✅ `app/services/openai_service.py` — OpenAI API wrapper (embeddings, chat, streaming)
6. ✅ `app/services/prompt_service.py` — Dynamic prompt loading (custom/default)
7. ✅ `app/services/redis_service.py` — Redis client & company-specific key generation
8. ✅ `app/services/oauth_credential_service.py` — OAuth token management
9. ✅ `app/services/mcp_tool_registry.py` — MCP tool registration & execution
10. ✅ `app/services/calendar_integration_service.py` — Calendar booking integration
11. ✅ `app/services/chatwoot_service.py` — Chatwoot CRM integration
12. ✅ `app/services/email_service.py` — Email sending functionality
13. ✅ `app/services/multimedia_service.py` — Audio/video processing
14. ✅ `app/services/company_config_service.py` — Company config service wrapper
15. ✅ `custom_prompts.json` — 207 lines: Per-company agent prompts

---

### **CHAT 2: Layers 3-4 (Models + Routes)** 🔜

#### Layer 3: Data Models
- `app/models/*.py` — SQLAlchemy models
- Schema definitions
- ORM relationships

#### Layer 4: API Routes
- `app/routes/*.py` — Flask blueprints
- REST endpoints
- Request/response handlers

---

### **CHAT 3: Layers 5-6 (Middleware + Utilities)** 🔜

#### Layer 5: Middleware
- Authentication middleware
- Logging middleware
- Error handling middleware

#### Layer 6: Utilities
- Helper functions
- Decorators
- Common utilities

---

### **CHAT 4: Layers 7-8 (Agents + Tools)** 🔜

#### Layer 7: AI Agents
- `app/agents/*.py` — LangGraph agents
- Agent nodes & graphs
- State management

#### Layer 8: Agent Tools
- `app/tools/*.py` — Executable tools
- Tool integrations
- Custom functions

---

### **CHAT 5: Layers 9-10 (Entry Point + Tests)** 🔜

#### Layer 9: Entry Point
- `app.py` — Application initialization

#### Layer 10: Tests
- `app/tests/*.py` — Test suites
- Fixtures
- Test configurations

---

### **CHAT 6: Layer 11 (Documentation)** 🔜

#### Layer 11: Documentation
- `docs/*.md` — Documentation files
- API specifications
- Setup guides

---

## Key Architectural Insights

### Multi-Tenancy Strategy
- **Company Isolation**: Redis key prefixes, isolated vector stores, per-company configs
- **Supported Tenants**: `benova`, `spa_wellness`, `medispa`, `dental_clinic`
- **Configuration Cascade**: Base config → Extended config → Custom prompts

### Critical Systems
1. **VectorstoreService** (1233 lines)
   - Hybrid search with BM25 + semantic vectors
   - Cross-encoder reranking
   - Adaptive chunking based on information density
   - RRF (Reciprocal Rank Fusion) for result merging

2. **SharedStateStore** (1180 lines)
   - Multi-backend support (Redis/memory)
   - Typed dataclasses for domain entities (PricingInfo, ScheduleInfo, etc.)
   - TTL-based expiration
   - Thread-safe operations

3. **Multi-Agent Orchestrator**
   - Dynamic agent routing
   - Specialized agents: sales, support, emergency, router, schedule, availability
   - Factory pattern for agent creation
   - LangGraph integration

### Technology Stack
- **Framework**: Flask (REST API)
- **Database**: PostgreSQL (via SQLAlchemy)
- **Cache**: Redis
- **AI**: OpenAI (GPT-4, embeddings), LangChain, LangGraph
- **Search**: BM25 + semantic vectors (hybrid)
- **Integrations**: Chatwoot, OAuth, calendar APIs, email

---

## Analysis Priorities

### High Priority (Complex/Critical)
1. ✅ VectorstoreService — RAG engine
2. ✅ SharedStateStore — State management
3. ✅ Multi-agent orchestration — Agent routing
4. ✅ CompanyConfig — Multi-tenancy foundation

### Medium Priority (Business Logic)
5. ✅ OpenAI service — LLM integration
6. ✅ Prompt service — Dynamic prompts
7. ✅ Calendar/Chatwoot integrations
8. Data models (Layer 3)
9. API routes (Layer 4)

### Lower Priority (Supporting)
10. ✅ Redis service — Key generation
11. ✅ Email/multimedia services
12. Utilities (Layer 6)
13. Tests (Layer 10)
14. Documentation (Layer 11)

---

## Notes
- **Deprecated code excluded**: `app/agents_DEPRECATED_2025_10_31/`
- **Frontend excluded**: `src/` (React/TypeScript)
- **Empty files**: `.env.example`, `companies_config.json` (intentional for examples)
- **Largest files**: `vectorstore_service.py` (1233L), `shared_state_store.py` (1180L)
- **Config files**: 3 external JSON files for multi-tenant configuration
