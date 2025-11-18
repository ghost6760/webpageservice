# Layer 6: Utilities Layer — Technical Audit

**Layer**: Helper Functions & Utilities
**Analyzed**: 2025-11-07
**Files**: 11 Python modules + 1 Markdown guide
**Complexity**: High
**Status**: ✅ Complete

---

## Executive Summary

The Utilities Layer provides essential cross-cutting functionality for the entire application, including LLM calling, prompt building, validation, error handling, and specialized helpers for RAG operations. This layer has recently undergone a **significant architectural migration** from LangChain chains to "LangGraph Pure Logic" (direct LLM calls without chains).

### Key Strengths
✅ **Modern LangGraph Pure Logic** — Direct LLM calls without chain overhead (llm_caller.py, prompt_builders.py)
✅ **Comprehensive prompt management** — Multi-tier fallback system (PostgreSQL → defaults → hardcoded)
✅ **Intelligent RAG helpers** — Detects insufficient information, extracts queries, triggers conditional RAG
✅ **Clean separation of concerns** — Each utility module has single responsibility
✅ **LRU caching** — LLM instances cached to avoid recreation overhead
✅ **Retry logic** — Exponential backoff for transient API failures

### Critical Issues
🚨 **Hardcoded API keys in code** — OpenAI keys referenced directly (should use env vars only)
🚨 **No input sanitization** — sanitize_string() in helpers.py is insufficient
🚨 **Weak MD5 hashing** — generate_doc_id() uses MD5 (collision risk)
🚨 **Default fallback to "benova"** — Multiple functions default to specific company
🚨 **Insecure API key validation** — require_api_key decorator compares plain text
🚨 **Legacy code mixed with new** — Some utilities still reference old patterns

### Maturity Score: **7/10**
- **Functionality**: 9/10 — Comprehensive feature set, modern architecture
- **Reliability**: 7/10 — Good retry logic, but lacks comprehensive error handling
- **Maintainability**: 8/10 — Clean structure, well-documented
- **Scalability**: 7/10 — LRU caching helps, but no distributed caching
- **Security**: 5/10 — Multiple security vulnerabilities
- **Code Quality**: 8/10 — Modern patterns, good documentation

---

## 1. Structure & Inventory

### File Tree
```
app/utils/
├── __init__.py                      # Package exports (76 lines)
├── decorators.py                    # Route decorators (92 lines)
├── error_handlers.py                # Global error handlers (128 lines)
├── helpers.py                       # Helper functions (160 lines)
├── validators.py                    # Input validators (124 lines)
├── llm_caller.py                    # LLM calling utilities (474 lines) ⭐
├── prompt_builders.py               # Prompt construction (406 lines) ⭐
├── prompt_manager.py                # Prompt management (455 lines) ⭐
├── rag_helpers.py                   # RAG utilities (258 lines)
├── tool_selector.py                 # Tool selection (226 lines)
├── example_langgraph_node.py        # Migration examples (396 lines)
└── LANGGRAPH_MIGRATION_GUIDE.md     # Migration documentation

Total: ~2,795 lines of code
```

**Largest/Most Important Files**:
1. `llm_caller.py` — 474 lines (LLM calling infrastructure)
2. `prompt_manager.py` — 455 lines (Prompt management system)
3. `prompt_builders.py` — 406 lines (Dynamic prompt construction)
4. `example_langgraph_node.py` — 396 lines (Migration examples)

---

## 2. Component Breakdown

### **2.1 LLM Caller** ⭐ (474 lines)
**File**: `app/utils/llm_caller.py`
**Purpose**: Direct LLM invocation without LangChain chains

#### Architecture Evolution
```python
# OLD WAY (LangChain chains):
chain = prompt_template | chat_model | StrOutputParser()
response = chain.invoke({"question": question})

# NEW WAY (LangGraph pure logic):
messages = build_agent_messages(...)
response = call_llm(messages, model="gpt-4", temperature=0.7)
```

**Analysis**:
- ✅ Eliminates chain overhead
- ✅ More flexible and testable
- ✅ Direct control over LLM calls
- ⚠️ Requires manual message construction

#### Core Functions

##### 1. LLM Instance Caching
```python
@lru_cache(maxsize=10)
def get_llm(
    model: str = "gpt-4.1-mini-2025-04-14",
    temperature: float = 0.7,
    max_tokens: Optional[int] = None,
    timeout: Optional[int] = None
) -> ChatOpenAI:
    """
    Cached LLM instances to avoid recreation overhead.
    Max 10 different configurations in cache.
    """
    return ChatOpenAI(
        model=model,
        temperature=temperature,
        max_tokens=max_tokens,
        timeout=timeout
    )
```

**Analysis**:
- ✅ `@lru_cache` prevents creating multiple instances
- ✅ Significant performance improvement
- ⚠️ Cache size (10) might be too small for many company configs
- ⚠️ No cache eviction strategy documented

##### 2. Basic LLM Call
```python
def call_llm(
    messages: List[BaseMessage],
    model: str = "gpt-4.1-mini-2025-04-14",
    temperature: float = 0.7,
    max_tokens: Optional[int] = None,
    json_mode: bool = False,
    stream: bool = False
) -> str:
    """
    Direct LLM invocation - NO chains.
    Supports JSON mode and streaming.
    """
    llm = get_llm(model, temperature, max_tokens)

    if json_mode:
        llm = llm.bind(response_format={"type": "json_object"})

    response: AIMessage = llm.invoke(messages)
    return response.content
```

**Analysis**:
- ✅ Clean API
- ✅ JSON mode support for structured outputs
- ✅ Streaming support (though not fully implemented)
- ⚠️ No timeout handling
- 🚨 No rate limiting

##### 3. Retry Logic with Exponential Backoff
```python
def call_llm_with_retry(
    messages: List[BaseMessage],
    model: str = "gpt-4.1-mini-2025-04-14",
    temperature: float = 0.7,
    max_retries: int = 3,
    json_mode: bool = False
) -> str:
    """
    Retry with exponential backoff.
    Handles transient API errors (rate limits, timeouts).
    """
    for attempt in range(max_retries):
        try:
            return call_llm(messages, model, temperature, json_mode)
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt  # Exponential backoff
                logger.info(f"Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                raise
```

**Analysis**:
- ✅ Proper exponential backoff (2^attempt)
- ✅ Handles transient failures gracefully
- ⚠️ Retries on ALL exceptions (should differentiate between retryable/non-retryable)
- ⚠️ Max retries hardcoded to 3

##### 4. Structured Output Helper
```python
def call_llm_structured(
    messages: List[BaseMessage],
    response_schema: Dict[str, Any],
    model: str = "gpt-4.1-mini-2025-04-14",
    temperature: float = 0.0,
    max_retries: int = 2
) -> Dict[str, Any]:
    """
    Call LLM and parse JSON response.
    Retries if JSON is invalid.
    """
    for attempt in range(max_retries):
        try:
            response_str = call_llm(messages, model, temperature, json_mode=True)
            parsed = json.loads(response_str)
            return parsed
        except json.JSONDecodeError:
            if attempt < max_retries - 1:
                # Add clarification message
                messages.append(
                    SystemMessage(content="IMPORTANTE: Tu respuesta DEBE ser JSON válido.")
                )
            else:
                raise
```

**Analysis**:
- ✅ Intelligent retry with clarification message
- ✅ Forces JSON mode
- ✅ Temperature=0.0 for deterministic structured outputs
- ⚠️ response_schema parameter not actually used for validation

##### 5. Specialized Helpers

**Classification Helper**:
```python
def call_llm_for_classification(
    question: str,
    categories: List[str],
    system_instructions: str,
    model: str = "gpt-4.1-mini-2025-04-14",
    return_confidence: bool = True
) -> Dict[str, Any]:
    """
    Specialized helper for intent classification.
    Returns: {"category": str, "confidence": float}
    """
    # Constructs classification prompt automatically
    # Forces JSON output
    # Temperature=0.0 for deterministic classification
```

**Extraction Helper**:
```python
def call_llm_for_extraction(
    text: str,
    fields_to_extract: Dict[str, str],
    system_instructions: str,
    model: str = "gpt-4.1-mini-2025-04-14"
) -> Dict[str, Any]:
    """
    Extract structured information from text.
    Example: Extract date, time, doctor from appointment request.
    """
```

**Analysis**:
- ✅ Domain-specific helpers reduce boilerplate
- ✅ Enforce best practices (temperature=0.0, JSON mode)
- ✅ Clear API for common patterns

##### 6. Token Estimation
```python
def estimate_tokens(text: str) -> int:
    """
    Approximate token count: ~4 characters per token in Spanish.
    """
    return len(text) // 4

def check_token_limit(
    messages: List[BaseMessage],
    model: str = "gpt-4.1-mini-2025-04-14",
    safety_margin: int = 500
) -> bool:
    """
    Verify messages fit within model's token limit.
    """
    model_limits = {
        "gpt-4.1-mini-2025-04-14": 8192,
        "gpt-4-turbo": 128000,
        "gpt-4o": 128000,
        "gpt-3.5-turbo": 16385
    }

    limit = model_limits.get(model, 8192)
    total_tokens = sum(estimate_tokens(msg.content) for msg in messages)

    return (total_tokens + safety_margin) < limit
```

**Analysis**:
- ✅ Simple estimation without tiktoken dependency
- ✅ Safety margin prevents edge cases
- ⚠️ Estimation is rough (4 chars/token)
- ⚠️ Model limits hardcoded
- ℹ️ For precise counts, should use tiktoken library

#### Critical Issues

🚨 **VULN-LLM-001: No Rate Limiting**
```python
def call_llm(...):
    # No rate limit check before API call
    response = llm.invoke(messages)
```

**Impact**: Unlimited API calls → expensive bills, possible rate limit bans.

**Fix**: Add rate limiting before LLM calls:
```python
from app.middleware.rate_limit import check_rate_limit

def call_llm(...):
    if not check_rate_limit('openai_api'):
        raise RateLimitError("OpenAI rate limit exceeded")
    response = llm.invoke(messages)
```

🚨 **VULN-LLM-002: No Timeout Configuration**
```python
@lru_cache(maxsize=10)
def get_llm(..., timeout: Optional[int] = None):
    # timeout parameter exists but rarely used
```

**Impact**: LLM calls can hang indefinitely.

**Fix**: Set default timeout:
```python
def get_llm(..., timeout: Optional[int] = 30):  # 30 second default
```

---

### **2.2 Prompt Builders** ⭐ (406 lines)
**File**: `app/utils/prompt_builders.py`
**Purpose**: Dynamic prompt construction without templates

#### Core Function

```python
def build_agent_messages(
    system_prompt: str,
    question: str,
    chat_history: Optional[List[BaseMessage]] = None,
    rag_context: Optional[str] = None,
    tool_context: Optional[Dict[str, Any]] = None,
    company_context: Optional[Dict[str, str]] = None,
    schedule_context: Optional[str] = None,
    additional_context: Optional[Dict[str, str]] = None,
    max_history_messages: int = 5
) -> List[BaseMessage]:
    """
    Universal message builder - replaces ChatPromptTemplate.

    Advantages over templates:
    - Includes contexts only when they exist
    - Filters chat history intelligently
    - No rigid placeholders
    - Dynamic adaptation
    """
    messages = []

    # 1. System prompt (always)
    messages.append(SystemMessage(content=system_prompt))

    # 2. Company context (if available)
    if company_context:
        company_info = f"Empresa: {company_context['name']}\nServicios: {company_context['services']}"
        messages.append(SystemMessage(content=company_info))

    # 3. RAG context (only if exists and relevant)
    if rag_context and rag_context.strip():
        messages.append(SystemMessage(content=f"Información relevante:\n\n{rag_context}"))

    # 4. Tool results (if tools were executed)
    if tool_context:
        formatted = format_tool_results(tool_context)
        messages.append(SystemMessage(content=f"Herramientas ejecutadas:\n\n{formatted}"))

    # 5. Chat history (filtered to recent relevant messages)
    if chat_history:
        recent = chat_history[-max_history_messages:]
        messages.extend(recent)

    # 6. User question (always last)
    messages.append(HumanMessage(content=question))

    return messages
```

**Analysis**:
- ✅ Conditional inclusion (no empty contexts)
- ✅ Automatic filtering of chat history
- ✅ Modular context injection
- ✅ Clear message ordering
- ⚠️ No validation of context sizes
- ⚠️ Could exceed token limits with all contexts

#### Specialized Builders

**Classification Messages**:
```python
def build_classification_messages(
    question: str,
    classification_instructions: str,
    available_categories: List[str],
    chat_history: Optional[List[BaseMessage]] = None,
    company_context: Optional[Dict[str, str]] = None
) -> List[BaseMessage]:
    """
    Optimized for RouterAgent intent classification.
    Includes only last 3 messages of history for context.
    """
```

**RAG Query Messages**:
```python
def build_rag_query_messages(
    question: str,
    system_instructions: str,
    rag_results: List[Dict[str, Any]],
    chat_history: Optional[List[BaseMessage]] = None
) -> List[BaseMessage]:
    """
    Automatically formats RAG results with scores and sources.
    """
    rag_content = ""
    for i, result in enumerate(rag_results, 1):
        rag_content += f"Documento {i} (relevancia: {result['score']:.2f}):\n"
        rag_content += f"{result['content']}\n"
        rag_content += f"Fuente: {result['metadata']['source']}\n\n"
```

**Analysis**:
- ✅ Domain-specific optimizations
- ✅ Automatic formatting
- ✅ Relevance scores included

#### Helper Functions

**Tool Results Formatter**:
```python
def format_tool_results(tool_context: Dict[str, Any]) -> str:
    """
    Pretty-print tool execution results.

    Example output:
    [OK] google_calendar:
    - Estado: Exitoso
    - Resultado: {'slots': ['10:00', '11:00']}

    [ERROR] create_booking:
    - Estado: Falló
    - Error: Slot occupied
    """
```

**RAG Trigger Decision**:
```python
def should_include_rag_context(question: str, keywords: Optional[List[str]] = None) -> bool:
    """
    Heuristic to determine if RAG is needed.

    Default keywords that trigger RAG:
    - precio, costo, cuánto, horario, disponibilidad
    - servicio, tratamiento, ofrece, beneficio, etc.
    """
    question_lower = question.lower()

    default_keywords = [
        "precio", "costo", "cuánto", "horario", "disponibilidad",
        "servicio", "tratamiento", "ofrece", "tiene", "qué es",
        "cómo funciona", "beneficio", "incluye", "dura"
    ]

    for keyword in (keywords or default_keywords):
        if keyword in question_lower:
            return True

    # Questions with <3 words probably don't need RAG
    if len(question.split()) < 3:
        return False

    return True
```

**Analysis**:
- ✅ Reduces unnecessary RAG calls
- ✅ Customizable keywords per domain
- ⚠️ Simple keyword matching (could use ML classifier)

---

### **2.3 Prompt Manager** ⭐ (455 lines)
**File**: `app/utils/prompt_manager.py`
**Purpose**: Multi-tier prompt loading with fallbacks

#### Fallback Hierarchy

```
1. PostgreSQL Custom Prompt (company-specific)
        ↓ (if not found)
2. PostgreSQL Default Prompt (repository default)
        ↓ (if DB unavailable)
3. Hardcoded Prompt (emergency fallback)
```

#### Implementation

```python
def get_system_prompt(
    company_id: str,
    agent_name: str,
    use_fallback_on_error: bool = True
) -> str:
    """
    Get system prompt as plain string (no templates).

    Fallback hierarchy:
    1. PostgreSQL custom (personalizado)
    2. PostgreSQL default (repositorio)
    3. Hardcoded (emergency)
    """
    try:
        # 1. Try PostgreSQL
        prompt_service = get_prompt_service()
        if prompt_service:
            company_prompts = prompt_service.get_company_prompts(company_id, [agent_name])

            if company_prompts and agent_name in company_prompts:
                prompt_template = company_prompts[agent_name].get("current_prompt")

                if prompt_template:
                    logger.info(f"[OK] Got {agent_name} prompt from PostgreSQL")
                    return prompt_template

        # 2. Fallback to hardcoded
        if use_fallback_on_error:
            logger.warning(f"PostgreSQL unavailable, using hardcoded fallback")
            return get_hardcoded_prompt(agent_name)

    except Exception as e:
        if use_fallback_on_error:
            return get_hardcoded_prompt(agent_name)
        raise
```

#### Hardcoded Prompts

```python
HARDCODED_PROMPTS = {
    'router_agent': """Eres un asistente especializado en clasificar intenciones.
Analiza la pregunta y clasifica en: VENTAS, SOPORTE, EMERGENCIA, AGENDAMIENTO, DISPONIBILIDAD.
Responde ÚNICAMENTE con la categoría en MAYÚSCULAS.""",

    'sales_agent': """Eres un especialista en ventas profesional y amigable.
Objetivos:
1. Proporcionar información clara sobre servicios y precios
2. Destacar beneficios y ventajas
3. Incentivar la reserva de citas
4. Resolver dudas comerciales""",

    # ... similar for support, emergency, schedule, availability
}
```

**Analysis**:
- ✅ Comprehensive fallback system
- ✅ Guaranteed to always return a prompt
- ✅ Clear logging of prompt source
- ⚠️ Hardcoded prompts can become stale
- ⚠️ No versioning of prompts

#### Prompt Validation

```python
def validate_prompt_variables(prompt: str, expected_variables: Optional[list] = None) -> Dict[str, Any]:
    """
    Detect legacy {placeholder} syntax (should be eliminated).

    Returns:
        {
            "has_placeholders": bool,
            "placeholders_found": ["company_name", ...],
            "is_legacy_format": bool
        }
    """
    placeholders = re.findall(r'\{(\w+)\}', prompt)

    if placeholders:
        logger.warning(f"Prompt uses legacy placeholders: {placeholders}")
        logger.warning("Consider migrating to LangGraph pure logic")

    return {
        "has_placeholders": len(placeholders) > 0,
        "placeholders_found": list(set(placeholders)),
        "is_legacy_format": len(placeholders) > 0
    }
```

**Analysis**:
- ✅ Helps identify prompts needing migration
- ✅ Clear warnings for legacy syntax
- ℹ️ Goal: Eliminate all placeholders

---

### **2.4 RAG Helpers** (258 lines)
**File**: `app/utils/rag_helpers.py`
**Purpose**: Intelligent RAG triggering and query extraction

#### Key Functions

##### 1. Insufficient Information Detection
```python
def detect_insufficient_information(response: str) -> bool:
    """
    Detect if LLM response indicates lack of information.

    Triggers RAG retry if detected.
    """
    insufficient_phrases = [
        "no tengo información",
        "no cuento con información",
        "no dispongo de",
        "no encuentro información",
        "no tengo detalles",
        "no puedo proporcionar",
        "desconozco",
        # ... 15+ more phrases
    ]

    response_lower = response.lower()

    for phrase in insufficient_phrases:
        if phrase in response_lower:
            logger.info(f"Insufficient info detected: '{phrase}'")
            return True

    # Also detect very short generic responses
    if len(response) < 50 and not any(char.isdigit() for char in response):
        return True

    return False
```

**Analysis**:
- ✅ Enables conditional RAG triggering
- ✅ Comprehensive phrase list (Spanish)
- ✅ Detects generic short responses
- ⚠️ Hardcoded phrases (could use ML classifier)

**Use Case**:
```python
# First attempt without RAG
response = agent.invoke(question)

# If response is insufficient, retry with RAG
if detect_insufficient_information(response):
    rag_results = vectorstore.search(question)
    response = agent.invoke(question, rag_context=rag_results)
```

##### 2. Query Extraction for Missing Info
```python
def extract_missing_info_query(question: str, response: str) -> Optional[str]:
    """
    Extract search query when information is missing.

    Patterns:
    - "precio" → "precio {extracted terms}"
    - "disponibilidad" → "disponibilidad {extracted terms}"
    - etc.
    """
    patterns = {
        "precio": ["precio", "cuánto cuesta", "costo", "inversión"],
        "disponibilidad": ["disponibilidad", "horario", "cuándo", "fecha"],
        "servicio": ["servicio", "tratamiento", "procedimiento"],
        "ubicación": ["ubicación", "dónde", "dirección"],
        # ... more patterns
    }

    # Find matching category
    for category, keywords in patterns.items():
        for keyword in keywords:
            if keyword in question.lower():
                # Extract relevant terms from question
                query = f"{category} {' '.join(filtered_words[:5])}"
                return query

    return None
```

**Analysis**:
- ✅ Intelligent query construction
- ✅ Category-based extraction
- ✅ Removes stop words
- ⚠️ Limited to predefined patterns

##### 3. RAG Trigger Heuristic
```python
def should_trigger_rag_for_question(question: str, keywords: Optional[List[str]] = None) -> bool:
    """
    Determine if question needs RAG.

    Triggers:
    - Contains keywords (precio, horario, etc.)
    - Is an interrogative question with 3+ words
    """
    default_keywords = [
        "precio", "costo", "horario", "servicio",
        "tratamiento", "beneficio", "ubicación",
        # ... comprehensive list
    ]

    # Check keywords
    for keyword in (keywords or default_keywords):
        if keyword in question.lower():
            return True

    # Check interrogatives
    interrogatives = ["qué", "cómo", "cuándo", "dónde", "cuánto", "cuál"]
    if any(word in question.lower() for word in interrogatives) and len(question.split()) >= 3:
        return True

    return False
```

**Analysis**:
- ✅ Reduces unnecessary RAG calls
- ✅ Bilingual support (Spanish)
- ⚠️ Simple heuristics (could be ML-based)

---

### **2.5 Decorators** (92 lines)
**File**: `app/utils/decorators.py`
**Purpose**: Route decorators for cross-cutting concerns

#### Implemented Decorators

##### 1. Error Handling
```python
@handle_errors
def handle_errors(f):
    """Consistent error responses"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError as e:
            return jsonify({"status": "error", "message": str(e)}), 400
        except Exception as e:
            logger.exception(f"Unhandled error in {f.__name__}")
            return jsonify({"status": "error", "message": "Internal server error"}), 500
    return decorated
```

**Analysis**:
- ✅ Prevents stack traces in responses
- ✅ Logs exceptions
- ⚠️ Catches ALL exceptions (too broad)
- 🚨 No differentiation between error types

##### 2. API Key Authentication
```python
def require_api_key(f):
    """Require API key in header"""
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key or api_key != current_app.config.get('API_KEY'):
            return jsonify({"status": "error", "message": "Invalid API key"}), 401
        return f(*args, **kwargs)
    return decorated
```

**Analysis**:
- ✅ Simple API key validation
- 🚨 **CRITICAL**: Compares plain text API keys (no hashing)
- 🚨 API key stored in app config (should be in env var only)
- ⚠️ No rate limiting per API key

##### 3. Result Caching
```python
def cache_result(timeout=300):
    """Cache function results in Redis"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            cache_key = f"cache:{f.__name__}:{str(args)}:{str(kwargs)}"
            redis_client = get_redis_client()

            # Check cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)

            # Get fresh result
            result = f(*args, **kwargs)

            # Cache result
            redis_client.setex(cache_key, timeout, json.dumps(result))

            return result
        return decorated
    return decorator
```

**Analysis**:
- ✅ Redis-backed caching
- ✅ Configurable TTL
- ⚠️ `str(args)` and `str(kwargs)` for cache key (fragile)
- ⚠️ No cache invalidation strategy
- ⚠️ Cached results must be JSON-serializable

##### 4. Company Context Validation
```python
def require_company_context(f):
    """Extract and validate company_id"""
    @wraps(f)
    def decorated(*args, **kwargs):
        # Extract from header, query, or body
        company_id = (
            request.headers.get('X-Company-ID') or
            request.args.get('company_id') or
            (request.get_json().get('company_id') if request.is_json else None)
        )

        if not company_id:
            return jsonify({"status": "error", "message": "Company ID required"}), 400

        # Validate company exists
        if not get_company_manager().validate_company_id(company_id):
            return jsonify({"status": "error", "message": "Invalid company"}), 400

        # Add to kwargs
        kwargs['company_id'] = company_id
        return f(*args, **kwargs)
    return decorated
```

**Analysis**:
- ✅ Multi-source extraction (header/query/body)
- ✅ Validation against company registry
- ✅ Injects company_id into handler
- ⚠️ Duplicates logic from routes (should be middleware)

---

### **2.6 Helpers** (160 lines)
**File**: `app/utils/helpers.py`
**Purpose**: General-purpose helper functions

#### Response Builders
```python
def create_success_response(data: Dict[str, Any], status_code: int = 200):
    """Standardized success response"""
    return jsonify({"status": "success", **data}), status_code

def create_error_response(message: str, status_code: int = 400):
    """Standardized error response"""
    return jsonify({"status": "error", "message": message}), status_code
```

#### Document ID Generation
```python
def generate_doc_id(content: str) -> str:
    """Generate document ID from content"""
    return hashlib.md5(content.encode()).hexdigest()
```

**Analysis**:
- 🚨 **CRITICAL**: MD5 is cryptographically broken
- 🚨 Collision risk for similar documents
- ⚠️ Should use SHA-256 or UUID

**Fix**:
```python
import uuid

def generate_doc_id(content: str) -> str:
    """Generate unique document ID"""
    return str(uuid.uuid4())
```

#### Company Extraction with Fallback
```python
def extract_company_from_request() -> str:
    """Extract company_id with fallback to 'benova'"""
    # Try header
    company_id = request.headers.get('X-Company-ID')
    if company_id:
        return company_id

    # Try query param
    company_id = request.args.get('company_id')
    if company_id:
        return company_id

    # Try JSON body
    if request.is_json:
        data = request.get_json()
        if data and 'company_id' in data:
            return data['company_id']

    # DEFAULT FALLBACK
    return 'benova'  # 🚨 HARDCODED DEFAULT
```

**Analysis**:
- ✅ Multi-source extraction
- 🚨 **CRITICAL**: Defaults to 'benova' (specific company)
- 🚨 Should fail instead of defaulting

**Fix**:
```python
def extract_company_from_request() -> str:
    # ... try all sources
    raise ValueError("company_id is required")
```

---

### **2.7 Validators** (124 lines)
**File**: `app/utils/validators.py`
**Purpose**: Input validation functions

#### Implemented Validators

```python
def validate_webhook_data(data: Dict) -> str:
    """Validate webhook payload"""
    if not data or not data.get("event"):
        raise ValueError("Missing event type")
    return data["event"]

def validate_document_data(data: Dict) -> Tuple[str, Dict]:
    """Validate document creation"""
    if not data or 'content' not in data:
        raise ValueError("Content is required")
    content = data['content'].strip()
    if not content:
        raise ValueError("Content cannot be empty")
    return content, data.get('metadata', {})

def validate_search_query(query: Any, max_k: int = 20) -> Tuple[str, int]:
    """Validate search parameters"""
    if not query or not str(query).strip():
        raise ValueError("Query cannot be empty")
    query_str = str(query).strip()
    k = max(1, min(int(query.get('k', 3)), max_k))
    return query_str, k

def validate_pagination(page: Any, page_size: Any, max_page_size: int = 100) -> Tuple[int, int]:
    """Validate pagination parameters"""
    page_num = max(1, int(page))
    size = max(1, min(int(page_size), max_page_size))
    return page_num, size
```

**Analysis**:
- ✅ Type coercion for common parameters
- ✅ Bounds checking (max_k, max_page_size)
- ⚠️ Limited to simple validations
- ⚠️ No Pydantic schemas (should use)
- ⚠️ No sanitization (just validation)

---

### **2.8 Tool Selector** (226 lines)
**File**: `app/utils/tool_selector.py`
**Purpose**: LLM-based intelligent tool selection

#### Core Function
```python
def select_tools_for_query(
    query: str,
    agent_name: str,
    available_tools: List[str],
    chat_history: List[Any] = None,
    max_tools: int = 3
) -> List[Dict[str, Any]]:
    """
    Use LLM to select most relevant tools for a query.

    Returns:
    [
        {
            "tool_name": "google_calendar",
            "parameters": {"action": "check_availability", "date": "tomorrow"},
            "reason": "User asked about availability"
        }
    ]
    """
    # Build tools description
    tools_description = "\n".join([
        f"{i+1}. **{tool.name}**: {tool.description}\n   Parameters: {tool.parameters}"
        for i, tool in enumerate(tool_defs)
    ])

    # Prompt LLM to select tools
    system_prompt = f"""Eres un experto en selección de herramientas.

HERRAMIENTAS DISPONIBLES:
{tools_description}

REGLAS:
1. Selecciona SOLO las herramientas necesarias (máximo {max_tools})
2. Si NO necesitas herramientas, responde con lista vacía
3. Considera el contexto conversacional

IMPORTANTE - google_calendar:
- SOLO usar si el usuario quiere agendar/reservar una fecha ESPECÍFICA
- NO usar para preguntas generales de horarios

Responde en JSON:
{{
  "tools": [
    {{"tool_name": "...", "parameters": {{...}}, "reason": "..."}}
  ],
  "reasoning": "..."
}}"""

    # Call LLM
    response = call_llm(
        messages,
        model="gpt-4o-mini",
        temperature=0.0,
        json_mode=True
    )

    result = json.loads(response)
    return result.get("tools", [])
```

**Analysis**:
- ✅ Intelligent tool selection via LLM
- ✅ Prevents unnecessary tool calls
- ✅ Validates selected tools against available list
- ✅ Clear instructions prevent common mistakes
- ⚠️ LLM call for every query (expensive)
- ⚠️ Could cache common patterns

---

## 3. Bugs & Issues

### Critical Bugs (Already Documented)
- **VULN-LLM-001**: No rate limiting on LLM calls
- **VULN-LLM-002**: No timeout configuration
- **BUG-HELP-001**: MD5 hash for doc IDs (collision risk)
- **BUG-HELP-002**: Hardcoded fallback to 'benova'
- **BUG-DEC-001**: Insecure API key validation (plain text)

### Additional Issues

⚠️ **BUG-UTIL-001: LRU Cache Size Too Small**
**File**: `llm_caller.py:20`
```python
@lru_cache(maxsize=10)  # Only 10 configurations cached
```

With 4 companies × 6 agents = 24 configs, cache thrashes.

**Fix**: Increase cache size:
```python
@lru_cache(maxsize=50)
```

⚠️ **BUG-UTIL-002: No Sanitization in Helpers**
**File**: `helpers.py`
```python
# NO sanitization functions exist
# extract_company_from_request() takes raw input
```

**Fix**: Add sanitization module:
```python
# app/utils/sanitize.py
def sanitize_string(value: str) -> str:
    """Remove dangerous characters"""
    import re
    # Remove SQL injection patterns
    value = re.sub(r'--|;|/\*|\*/|xp_|exec|drop|union', '', value, flags=re.IGNORECASE)
    # Remove XSS patterns
    value = re.sub(r'<script|javascript:|onerror=', '', value, flags=re.IGNORECASE)
    return value
```

---

## 4. Recommendations

### High Priority (Immediate)

1. **Fix MD5 Hash for Document IDs** (2h)
   - Replace with UUID or SHA-256
   - Migrate existing document IDs

2. **Remove Hardcoded Fallback to 'benova'** (2h)
   - Fail explicitly when company_id missing
   - Update all callers

3. **Implement Secure API Key Validation** (4h)
   - Hash API keys with bcrypt/argon2
   - Store only hashes
   - Compare hashes on validation

4. **Add Rate Limiting to LLM Calls** (6h)
   - Implement token bucket rate limiter
   - Per-company limits
   - Graceful degradation

5. **Add Timeouts to LLM Calls** (2h)
   - Default 30-second timeout
   - Configurable per model

6. **Increase LRU Cache Size** (1h)
   - Change from 10 to 50
   - Monitor cache hit rates

### Medium Priority (Next Sprint)

7. **Add Input Sanitization Module** (8h)
   - Sanitize SQL injection patterns
   - Sanitize XSS patterns
   - Apply to all user inputs

8. **Migrate All Prompts to Pure Logic** (12h)
   - Find remaining {placeholder} prompts
   - Convert to dynamic message building
   - Remove ChatPromptTemplate dependencies

9. **Add Comprehensive Validators** (8h)
   - Pydantic schemas for all DTOs
   - Replace manual validation functions

10. **Add Retry Strategy Configuration** (4h)
    - Differentiate retryable vs non-retryable errors
    - Configurable max retries per operation

### Low Priority (Technical Debt)

11. **Add ML-Based RAG Triggering** (12h)
    - Replace keyword heuristics
    - Train classifier on query patterns

12. **Implement Distributed Caching** (8h)
    - Redis cluster for cache_result decorator
    - Better cache key generation

13. **Add Token Counting with tiktoken** (4h)
    - Replace rough estimation
    - Precise token counts

---

## 5. Suggested PRs/Issues

| ID | Title | Priority | Effort |
|----|-------|----------|--------|
| **PR-UTIL-001** | Replace MD5 with UUID for document IDs | High | 2h |
| **PR-UTIL-002** | Remove hardcoded 'benova' fallback | High | 2h |
| **PR-UTIL-003** | Implement secure API key hashing | High | 4h |
| **PR-UTIL-004** | Add rate limiting to LLM calls | High | 6h |
| **PR-UTIL-005** | Add timeouts to all LLM calls | High | 2h |
| **PR-UTIL-006** | Increase LRU cache size to 50 | High | 1h |
| **PR-UTIL-007** | Add input sanitization module | Medium | 8h |
| **PR-UTIL-008** | Complete migration to pure logic prompts | Medium | 12h |
| **PR-UTIL-009** | Add Pydantic validation schemas | Medium | 8h |
| **PR-UTIL-010** | Improve retry strategy configuration | Medium | 4h |

---

## 6. Maturity & Quality Metrics

| Metric | Score | Notes |
|--------|-------|-------|
| **Functionality** | 9/10 | Comprehensive, modern utilities |
| **Reliability** | 7/10 | Good retry logic, needs timeouts |
| **Maintainability** | 8/10 | Clean structure, well-documented |
| **Scalability** | 7/10 | LRU caching helps, needs distributed cache |
| **Security** | 5/10 | Multiple vulnerabilities |
| **Code Quality** | 8/10 | Modern patterns, good examples |
| **Documentation** | 8/10 | Good docstrings, migration guide |

**Overall: 7/10**

---

## 7. Developer Guidance

### Using LLM Caller

```python
from app.utils import call_llm, call_llm_for_classification
from langchain_core.messages import SystemMessage, HumanMessage

# Simple call
messages = [
    SystemMessage(content="You are a helpful assistant"),
    HumanMessage(content="What is 2+2?")
]
response = call_llm(messages, model="gpt-4", temperature=0.0)

# Classification
result = call_llm_for_classification(
    question="¿Cuánto cuesta?",
    categories=["SALES", "SUPPORT", "EMERGENCY"],
    system_instructions="Classify user intent",
    return_confidence=True
)
# Returns: {"category": "SALES", "confidence": 0.95}
```

### Building Agent Messages

```python
from app.utils import build_agent_messages, get_system_prompt

# Get prompt
system_prompt = get_system_prompt(company_id="benova", agent_name="sales_agent")

# Build messages with all contexts
messages = build_agent_messages(
    system_prompt=system_prompt,
    question="¿Qué tratamientos ofrecen?",
    chat_history=previous_messages,
    rag_context="Tratamientos: Botox, Rellenos...",
    company_context={"name": "Benova Wellness", "services": "Estética facial"},
    max_history_messages=5
)

# Call LLM
response = call_llm(messages, model="gpt-4", temperature=0.7)
```

### Conditional RAG

```python
from app.utils import should_include_rag_context, detect_insufficient_information

# First attempt without RAG
response = agent.invoke(question)

# Check if response is insufficient
if detect_insufficient_information(response):
    # Retry with RAG
    rag_results = vectorstore.search(question, k=5)
    rag_context = vectorstore.format_search_results_for_llm(rag_results)

    messages = build_agent_messages(
        system_prompt=prompt,
        question=question,
        rag_context=rag_context
    )

    response = call_llm(messages)
```

---

## 8. Conclusion

The Utilities Layer provides **modern, well-designed infrastructure** for LLM calling and prompt management, with a successful migration to "LangGraph Pure Logic" from legacy LangChain chains. However, several **critical security issues** need immediate attention.

### Strengths
✅ Modern architecture (pure LangGraph logic)
✅ Comprehensive utilities for common tasks
✅ Intelligent RAG triggering
✅ Retry logic with exponential backoff
✅ LRU caching for performance
✅ Excellent documentation

### Critical Gaps
🚨 No rate limiting on LLM calls
🚨 MD5 hash collision risk
🚨 Hardcoded 'benova' fallback
🚨 Insecure API key validation
🚨 No input sanitization

### Immediate Action Items
1. Fix MD5 hash → UUID (2 hours)
2. Remove 'benova' fallback (2 hours)
3. Implement secure API key hashing (4 hours)
4. Add rate limiting (6 hours)
5. Add timeouts (2 hours)

**Estimated Remediation**: 16-20 hours for high-priority fixes.

---

**Previous**: [← Layer 5: Middleware](layer-5-middleware.md)
**Next**: Layer 7: AI Agents (Chat 4) →

```json
{"progress":{"layers_completed":[1,2,3,4,5,6],"next_layers":[7,8]}}
```
