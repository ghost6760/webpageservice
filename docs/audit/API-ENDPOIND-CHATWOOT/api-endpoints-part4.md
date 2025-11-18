# Chatwoot API Documentation - Part 4/4
## Integrations, Search, Knowledge Base, and Platform APIs

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Search API](#search-api)
3. [Integrations API](#integrations-api)
4. [Custom Attribute Definitions API](#custom-attribute-definitions-api)
5. [Custom Filters API](#custom-filters-api)
6. [Portals API (Knowledge Base)](#portals-api-knowledge-base)
7. [Articles API](#articles-api)
8. [Agent Bots API](#agent-bots-api)
9. [Platform API](#platform-api)

---

## 🌟 Overview

This final part covers advanced features, integrations, and platform-level APIs:
- **Search**: Global and entity-specific search
- **Integrations**: Third-party app integrations (Slack, Shopify, Linear, etc.)
- **Custom Attributes**: Define custom fields for conversations and contacts
- **Custom Filters**: Save and reuse complex filter queries
- **Knowledge Base**: Help center with portals and articles
- **Agent Bots**: AI bot configuration and management
- **Platform API**: Multi-tenancy and platform-level operations

**Base Path**: `/api/v1/accounts/:account_id` (most endpoints)
**Platform API Base Path**: `/platform/api/v1`

**Authentication**: All endpoints require authentication unless specified otherwise.

---

## 🔍 Search API

**Base Path**: `/api/v1/accounts/:account_id/search`
**Controller**: `Api::V1::Accounts::SearchController`

Global search across multiple entity types.

### 1. Global Search

**Endpoint**: `GET /api/v1/accounts/:account_id/search`
**Controller**: `Api::V1::Accounts::SearchController#index`
**Authentication**: Required
**Description**: Searches across all entity types (conversations, contacts, messages, articles).

**Query Parameters**:
- `q` - Search query (required)
- `page` - Page number (default: 1)

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Example Request**:
```
GET /api/v1/accounts/1/search?q=order+status&page=1
```

**Response** (200 OK):
```json
{
  "conversations": [
    {
      "id": 100,
      "display_id": 100,
      "status": "open",
      "messages": [
        {
          "id": 500,
          "content": "What's my order status?",
          "created_at": "2025-01-06T10:00:00Z"
        }
      ]
    }
  ],
  "contacts": [
    {
      "id": 10,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phone_number": "+1234567890"
    }
  ],
  "messages": [
    {
      "id": 501,
      "content": "Let me check your order status",
      "conversation_id": 100,
      "created_at": "2025-01-06T10:01:00Z"
    }
  ],
  "articles": [
    {
      "id": 5,
      "title": "How to track order status",
      "description": "Guide to tracking your order",
      "category": {
        "name": "Orders"
      }
    }
  ]
}
```

**Use Case for AI**: Unified search across all data types for context gathering

---

### 2. Search Conversations

**Endpoint**: `GET /api/v1/accounts/:account_id/search/conversations`
**Controller**: `Api::V1::Accounts::SearchController#conversations`
**Authentication**: Required
**Description**: Searches only conversations.

**Query Parameters**:
- `q` - Search query (required)
- `page` - Page number (default: 1)

**Response** (200 OK):
```json
{
  "payload": [
    {
      "id": 100,
      "display_id": 100,
      "status": "open",
      "contact": {
        "id": 10,
        "name": "Alice Johnson"
      },
      "messages_count": 15
    }
  ],
  "meta": {
    "count": 25,
    "current_page": 1
  }
}
```

---

### 3. Search Contacts

**Endpoint**: `GET /api/v1/accounts/:account_id/search/contacts`
**Controller**: `Api::V1::Accounts::SearchController#contacts`
**Authentication**: Required
**Description**: Searches only contacts.

**Query Parameters**:
- `q` - Search query (required)
- `page` - Page number (default: 1)

**Response** (200 OK):
```json
{
  "payload": [
    {
      "id": 10,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phone_number": "+1234567890",
      "additional_attributes": {
        "company_name": "Acme Corp"
      }
    }
  ],
  "meta": {
    "count": 8,
    "current_page": 1
  }
}
```

---

### 4. Search Messages

**Endpoint**: `GET /api/v1/accounts/:account_id/search/messages`
**Controller**: `Api::V1::Accounts::SearchController#messages`
**Authentication**: Required
**Description**: Searches only messages.

**Query Parameters**:
- `q` - Search query (required)
- `page` - Page number (default: 1)

**Response** (200 OK):
```json
{
  "payload": [
    {
      "id": 500,
      "content": "What's my order status?",
      "message_type": "incoming",
      "conversation_id": 100,
      "created_at": "2025-01-06T10:00:00Z",
      "sender": {
        "id": 10,
        "name": "Alice Johnson"
      }
    }
  ],
  "meta": {
    "count": 12,
    "current_page": 1
  }
}
```

---

### 5. Search Articles

**Endpoint**: `GET /api/v1/accounts/:account_id/search/articles`
**Controller**: `Api::V1::Accounts::SearchController#articles`
**Authentication**: Required
**Description**: Searches help center articles.

**Query Parameters**:
- `q` - Search query (required)
- `page` - Page number (default: 1)

**Response** (200 OK):
```json
{
  "payload": [
    {
      "id": 5,
      "title": "How to track order status",
      "slug": "track-order-status",
      "description": "Guide to tracking your order",
      "content": "Full article content here...",
      "category": {
        "id": 2,
        "name": "Orders",
        "slug": "orders"
      },
      "author": {
        "id": 1,
        "name": "Admin User"
      },
      "status": "published"
    }
  ],
  "meta": {
    "count": 5,
    "current_page": 1
  }
}
```

**Use Case for AI**: Find relevant help articles to suggest to customers

---

## 🔌 Integrations API

### Integration Apps

**Base Path**: `/api/v1/accounts/:account_id/integrations/apps`
**Controller**: `Api::V1::Accounts::Integrations::AppsController`

#### 6. List Available Integrations

**Endpoint**: `GET /api/v1/accounts/:account_id/integrations/apps`
**Controller**: `Api::V1::Accounts::Integrations::AppsController#index`
**Authentication**: Required
**Description**: Lists all available integration apps for the account.

**Response** (200 OK):
```json
[
  {
    "id": "slack",
    "name": "Slack",
    "description": "Connect Slack to Chatwoot for team notifications",
    "logo": "https://chatwoot.com/integrations/slack.png",
    "enabled": true,
    "action": "/accounts/1/integrations/slack"
  },
  {
    "id": "dialogflow",
    "name": "Dialogflow",
    "description": "Integrate Google Dialogflow bot",
    "logo": "https://chatwoot.com/integrations/dialogflow.png",
    "enabled": false,
    "action": "/accounts/1/integrations/hooks"
  },
  {
    "id": "google_translate",
    "name": "Google Translate",
    "description": "Translate messages automatically",
    "logo": "https://chatwoot.com/integrations/google-translate.png",
    "enabled": true
  }
]
```

**Available Integrations**:
- Slack
- Dialogflow
- Google Translate
- Webhooks
- Dyte (Video calls)
- Shopify
- Linear
- Notion
- OpenAI

---

#### 7. Get Integration Details

**Endpoint**: `GET /api/v1/accounts/:account_id/integrations/apps/:id`
**Controller**: `Api::V1::Accounts::Integrations::AppsController#show`
**Authentication**: Required
**Description**: Retrieves details of a specific integration.

**Response** (200 OK):
```json
{
  "id": "slack",
  "name": "Slack",
  "description": "Connect Slack to Chatwoot for team notifications",
  "logo": "https://chatwoot.com/integrations/slack.png",
  "enabled": true,
  "hooks": [
    {
      "id": 1,
      "app_id": "slack",
      "inbox_id": 1,
      "settings": {
        "reference_id": "C0123456789"
      }
    }
  ]
}
```

---

### Integration Hooks

**Base Path**: `/api/v1/accounts/:account_id/integrations/hooks`
**Controller**: `Api::V1::Accounts::Integrations::HooksController`

#### 8. Create Integration Hook

**Endpoint**: `POST /api/v1/accounts/:account_id/integrations/hooks`
**Controller**: `Api::V1::Accounts::Integrations::HooksController#create`
**Authentication**: Required (Admin)
**Description**: Creates a new integration hook.

**Request Body**:
```json
{
  "hook": {
    "app_id": "dialogflow",
    "inbox_id": 1,
    "settings": {
      "project_id": "my-dialogflow-project",
      "credentials": "{...json...}"
    }
  }
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "app_id": "dialogflow",
  "inbox_id": 1,
  "status": "enabled",
  "settings": {
    "project_id": "my-dialogflow-project"
  },
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Supported Apps**:
- `dialogflow` - Google Dialogflow bot
- `openai` - OpenAI GPT integration
- `linear` - Linear issue tracking
- `slack` - Slack notifications

---

#### 9. Update Integration Hook

**Endpoint**: `PUT /api/v1/accounts/:account_id/integrations/hooks/:id`
**Controller**: `Api::V1::Accounts::Integrations::HooksController#update`
**Authentication**: Required (Admin)
**Description**: Updates integration settings.

**Request Body**:
```json
{
  "hook": {
    "status": "disabled",
    "settings": {
      "project_id": "updated-project"
    }
  }
}
```

**Status Options**:
- `enabled` - Integration active
- `disabled` - Integration paused

**Response** (200 OK):
```json
{
  "id": 2,
  "app_id": "dialogflow",
  "status": "disabled",
  "settings": {
    "project_id": "updated-project"
  }
}
```

---

#### 10. Process Integration Event

**Endpoint**: `POST /api/v1/accounts/:account_id/integrations/hooks/:id/process_event`
**Controller**: `Api::V1::Accounts::Integrations::HooksController#process_event`
**Authentication**: Required
**Description**: Triggers an integration event manually.

**Request Body**:
```json
{
  "event": {
    "name": "message_created",
    "data": {
      "conversation_id": 100,
      "message": "Hello from customer"
    }
  }
}
```

**Response** (200 OK):
```json
{
  "message": {
    "intent": "order_status",
    "response": "Let me check your order status",
    "confidence": 0.95
  }
}
```

**Use Case for AI**: Trigger AI bot processing, get suggested responses

---

#### 11. Delete Integration Hook

**Endpoint**: `DELETE /api/v1/accounts/:account_id/integrations/hooks/:id`
**Controller**: `Api::V1::Accounts::Integrations::HooksController#destroy`
**Authentication**: Required (Admin)
**Description**: Removes an integration.

**Response** (200 OK):
```
(Empty response body)
```

---

### Slack Integration

**Base Path**: `/api/v1/accounts/:account_id/integrations/slack`
**Controller**: `Api::V1::Accounts::Integrations::SlackController`

#### 12. Create Slack Integration

**Endpoint**: `POST /api/v1/accounts/:account_id/integrations/slack`
**Controller**: `Api::V1::Accounts::Integrations::SlackController#create`
**Authentication**: Required (Admin)
**Description**: Connects Slack workspace to Chatwoot.

**Request Body**:
```json
{
  "code": "oauth_code_from_slack",
  "inbox_id": 1
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "app_id": "slack",
  "inbox_id": 1,
  "settings": {
    "team_id": "T0123456789",
    "team_name": "My Team",
    "reference_id": null
  }
}
```

**Notes**:
- OAuth flow required (redirect to Slack, get code)
- Creates integration for specific inbox

---

#### 13. List Slack Channels

**Endpoint**: `GET /api/v1/accounts/:account_id/integrations/slack/list_all_channels`
**Controller**: `Api::V1::Accounts::Integrations::SlackController#list_all_channels`
**Authentication**: Required (Admin)
**Description**: Lists available Slack channels.

**Response** (200 OK):
```json
[
  {
    "id": "C0123456789",
    "name": "general",
    "is_private": false
  },
  {
    "id": "C9876543210",
    "name": "support",
    "is_private": false
  },
  {
    "id": "C5555555555",
    "name": "urgent-alerts",
    "is_private": true
  }
]
```

---

#### 14. Update Slack Channel

**Endpoint**: `PUT /api/v1/accounts/:account_id/integrations/slack`
**Controller**: `Api::V1::Accounts::Integrations::SlackController#update`
**Authentication**: Required (Admin)
**Description**: Sets the Slack channel for notifications.

**Request Body**:
```json
{
  "reference_id": "C0123456789"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "app_id": "slack",
  "settings": {
    "reference_id": "C0123456789",
    "channel_name": "general"
  }
}
```

**Notes**:
- Notifications sent to selected channel
- Channel must exist in workspace

---

#### 15. Delete Slack Integration

**Endpoint**: `DELETE /api/v1/accounts/:account_id/integrations/slack`
**Controller**: `Api::V1::Accounts::Integrations::SlackController#destroy`
**Authentication**: Required (Admin)
**Description**: Disconnects Slack integration.

**Response** (200 OK):
```
(Empty response body)
```

---

## 🏗️ Custom Attribute Definitions API

**Base Path**: `/api/v1/accounts/:account_id/custom_attribute_definitions`
**Controller**: `Api::V1::Accounts::CustomAttributeDefinitionsController`

Define custom fields for conversations and contacts.

### 16. List Custom Attribute Definitions

**Endpoint**: `GET /api/v1/accounts/:account_id/custom_attribute_definitions`
**Controller**: `Api::V1::Accounts::CustomAttributeDefinitionsController#index`
**Authentication**: Required
**Description**: Lists all custom attribute definitions.

**Query Parameters**:
- `attribute_model` - Filter by model: `conversation_attribute`, `contact_attribute`

**Example Request**:
```
GET /api/v1/accounts/1/custom_attribute_definitions?attribute_model=contact_attribute
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "attribute_display_name": "Customer Type",
    "attribute_key": "customer_type",
    "attribute_description": "Type of customer (new, returning, vip)",
    "attribute_display_type": "list",
    "attribute_model": "contact_attribute",
    "attribute_values": ["new", "returning", "vip"],
    "regex_pattern": null,
    "regex_cue": null,
    "created_at": "2024-12-01T08:00:00Z"
  },
  {
    "id": 2,
    "attribute_display_name": "Order ID",
    "attribute_key": "order_id",
    "attribute_description": "Customer's order number",
    "attribute_display_type": "text",
    "attribute_model": "contact_attribute",
    "attribute_values": [],
    "regex_pattern": "^ORD[0-9]{6}$",
    "regex_cue": "Format: ORD123456",
    "created_at": "2024-12-01T08:00:00Z"
  }
]
```

**Attribute Display Types**:
- `text` - Single line text
- `number` - Numeric value
- `link` - URL
- `date` - Date picker
- `list` - Dropdown list
- `checkbox` - Boolean (true/false)

**Attribute Models**:
- `conversation_attribute` - Custom fields for conversations
- `contact_attribute` - Custom fields for contacts

---

### 17. Get Custom Attribute Definition

**Endpoint**: `GET /api/v1/accounts/:account_id/custom_attribute_definitions/:id`
**Controller**: `Api::V1::Accounts::CustomAttributeDefinitionsController#show`
**Authentication**: Required
**Description**: Retrieves a specific custom attribute definition.

**Response** (200 OK):
```json
{
  "id": 1,
  "attribute_display_name": "Customer Type",
  "attribute_key": "customer_type",
  "attribute_display_type": "list",
  "attribute_model": "contact_attribute",
  "attribute_values": ["new", "returning", "vip"]
}
```

---

### 18. Create Custom Attribute Definition

**Endpoint**: `POST /api/v1/accounts/:account_id/custom_attribute_definitions`
**Controller**: `Api::V1::Accounts::CustomAttributeDefinitionsController#create`
**Authentication**: Required (Admin)
**Description**: Creates a new custom attribute definition.

**Request Body**:
```json
{
  "custom_attribute_definition": {
    "attribute_display_name": "Subscription Plan",
    "attribute_key": "subscription_plan",
    "attribute_description": "Customer's subscription tier",
    "attribute_display_type": "list",
    "attribute_model": "contact_attribute",
    "attribute_values": ["free", "basic", "pro", "enterprise"]
  }
}
```

**Request Body (with validation)**:
```json
{
  "custom_attribute_definition": {
    "attribute_display_name": "Phone Number",
    "attribute_key": "phone_number",
    "attribute_description": "Customer phone in E.164 format",
    "attribute_display_type": "text",
    "attribute_model": "contact_attribute",
    "regex_pattern": "^\\+[1-9]\\d{1,14}$",
    "regex_cue": "Example: +1234567890"
  }
}
```

**Response** (201 Created):
```json
{
  "id": 3,
  "attribute_display_name": "Subscription Plan",
  "attribute_key": "subscription_plan",
  "attribute_display_type": "list",
  "attribute_model": "contact_attribute",
  "attribute_values": ["free", "basic", "pro", "enterprise"],
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Notes**:
- `attribute_key` must be unique per model
- Once created, `attribute_key` and `attribute_model` cannot be changed
- `regex_pattern` validates input (optional)

**Use Case for AI**:
- Define custom fields for AI-extracted data
- Structured data collection
- Validation rules for user input

---

### 19. Update Custom Attribute Definition

**Endpoint**: `PUT /api/v1/accounts/:account_id/custom_attribute_definitions/:id`
**Controller**: `Api::V1::Accounts::CustomAttributeDefinitionsController#update`
**Authentication**: Required (Admin)
**Description**: Updates a custom attribute definition.

**Request Body**:
```json
{
  "custom_attribute_definition": {
    "attribute_display_name": "Updated Name",
    "attribute_description": "Updated description",
    "attribute_values": ["new", "returning", "vip", "churned"]
  }
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "attribute_display_name": "Updated Name",
  "attribute_description": "Updated description",
  "attribute_values": ["new", "returning", "vip", "churned"]
}
```

**Notes**:
- Cannot change `attribute_key` or `attribute_model`
- Adding values to list is safe
- Removing values may affect existing data

---

### 20. Delete Custom Attribute Definition

**Endpoint**: `DELETE /api/v1/accounts/:account_id/custom_attribute_definitions/:id`
**Controller**: `Api::V1::Accounts::CustomAttributeDefinitionsController#destroy`
**Authentication**: Required (Admin)
**Description**: Deletes a custom attribute definition.

**Response** (204 No Content):
```
(Empty response body)
```

**Notes**:
- Deletes the definition but not the data
- Existing custom_attributes data remains but won't have definition

---

## 📋 Custom Filters API

**Base Path**: `/api/v1/accounts/:account_id/custom_filters`
**Controller**: `Api::V1::Accounts::CustomFiltersController`

Save and reuse complex filter queries.

### 21. List Custom Filters

**Endpoint**: `GET /api/v1/accounts/:account_id/custom_filters`
**Controller**: `Api::V1::Accounts::CustomFiltersController#index`
**Authentication**: Required
**Description**: Lists all saved filters for the current user.

**Query Parameters**:
- `filter_type` - Filter type: `conversation`, `contact` (default: `conversation`)

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Urgent open conversations",
    "filter_type": "conversation",
    "query": {
      "payload": [
        {
          "attribute_key": "status",
          "filter_operator": "equal_to",
          "values": ["open"]
        },
        {
          "attribute_key": "labels",
          "filter_operator": "contains",
          "values": ["urgent"]
        }
      ]
    },
    "created_at": "2024-12-01T08:00:00Z",
    "updated_at": "2025-01-06T10:00:00Z"
  }
]
```

---

### 22. Get Custom Filter

**Endpoint**: `GET /api/v1/accounts/:account_id/custom_filters/:id`
**Controller**: `Api::V1::Accounts::CustomFiltersController#show`
**Authentication**: Required
**Description**: Retrieves a specific custom filter.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Urgent open conversations",
  "filter_type": "conversation",
  "query": {
    "payload": [...]
  }
}
```

---

### 23. Create Custom Filter

**Endpoint**: `POST /api/v1/accounts/:account_id/custom_filters`
**Controller**: `Api::V1::Accounts::CustomFiltersController#create`
**Authentication**: Required
**Description**: Saves a new custom filter.

**Request Body**:
```json
{
  "custom_filter": {
    "name": "VIP customers in last 30 days",
    "filter_type": "contact",
    "query": {
      "payload": [
        {
          "attribute_key": "custom_attributes.customer_type",
          "filter_operator": "equal_to",
          "values": ["vip"],
          "query_operator": "and"
        },
        {
          "attribute_key": "created_at",
          "filter_operator": "days_before",
          "values": [30],
          "query_operator": "and"
        }
      ]
    }
  }
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "name": "VIP customers in last 30 days",
  "filter_type": "contact",
  "query": {
    "payload": [...]
  },
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Use Case for AI**:
- Save commonly used filter queries
- Quick access to specific segments
- Reporting and analytics

---

### 24. Update Custom Filter

**Endpoint**: `PUT /api/v1/accounts/:account_id/custom_filters/:id`
**Controller**: `Api::V1::Accounts::CustomFiltersController#update`
**Authentication**: Required
**Description**: Updates a saved filter.

**Request Body**:
```json
{
  "custom_filter": {
    "name": "Updated filter name",
    "query": {
      "payload": [...]
    }
  }
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Updated filter name",
  "filter_type": "conversation"
}
```

---

### 25. Delete Custom Filter

**Endpoint**: `DELETE /api/v1/accounts/:account_id/custom_filters/:id`
**Controller**: `Api::V1::Accounts::CustomFiltersController#destroy`
**Authentication**: Required
**Description**: Deletes a saved filter.

**Response** (204 No Content):
```
(Empty response body)
```

---

## 📚 Portals API (Knowledge Base)

**Base Path**: `/api/v1/accounts/:account_id/portals`
**Controller**: `Api::V1::Accounts::PortalsController`

Help center / knowledge base management.

### 26. List Portals

**Endpoint**: `GET /api/v1/accounts/:account_id/portals`
**Controller**: `Api::V1::Accounts::PortalsController#index`
**Authentication**: Required
**Description**: Lists all help center portals.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Product Help Center",
    "slug": "product-help",
    "custom_domain": "help.acme.com",
    "color": "#1f93ff",
    "page_title": "Acme Help Center",
    "header_text": "How can we help you?",
    "homepage_link": "https://acme.com",
    "config": {
      "default_locale": "en",
      "allowed_locales": ["en", "es", "fr"]
    },
    "archived": false,
    "portal_url": "https://chatwoot.acme.com/hc/product-help",
    "articles_count": 45,
    "created_at": "2024-12-01T08:00:00Z"
  }
]
```

---

### 27. Get Portal Details

**Endpoint**: `GET /api/v1/accounts/:account_id/portals/:slug`
**Controller**: `Api::V1::Accounts::PortalsController#show`
**Authentication**: Required
**Description**: Retrieves portal details with articles.

**Query Parameters**:
- `locale` - Filter articles by locale (default: portal's default_locale)

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Product Help Center",
  "slug": "product-help",
  "custom_domain": "help.acme.com",
  "color": "#1f93ff",
  "logo": "https://cdn.acme.com/logo.png",
  "config": {
    "default_locale": "en",
    "allowed_locales": ["en", "es", "fr"]
  },
  "articles": [
    {
      "id": 5,
      "title": "Getting Started",
      "slug": "getting-started",
      "category": {
        "id": 1,
        "name": "Basics"
      }
    }
  ]
}
```

---

### 28. Create Portal

**Endpoint**: `POST /api/v1/accounts/:account_id/portals`
**Controller**: `Api::V1::Accounts::PortalsController#create`
**Authentication**: Required (Admin)
**Description**: Creates a new help center portal.

**Request Body**:
```json
{
  "portal": {
    "name": "API Documentation",
    "slug": "api-docs",
    "custom_domain": "docs.acme.com",
    "color": "#4CAF50",
    "page_title": "Acme API Documentation",
    "header_text": "Developer Resources",
    "homepage_link": "https://acme.com",
    "config": {
      "default_locale": "en",
      "allowed_locales": ["en", "es"]
    }
  },
  "inbox_id": 1,
  "blob_id": "logo_blob_id"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "name": "API Documentation",
  "slug": "api-docs",
  "custom_domain": "docs.acme.com",
  "portal_url": "https://chatwoot.acme.com/hc/api-docs",
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Notes**:
- `slug` must be unique
- `inbox_id` optional - connects to live chat widget
- `blob_id` optional - logo image

---

### 29. Update Portal

**Endpoint**: `PUT /api/v1/accounts/:account_id/portals/:slug`
**Controller**: `Api::V1::Accounts::PortalsController#update`
**Authentication**: Required (Admin)
**Description**: Updates portal settings.

**Request Body**:
```json
{
  "portal": {
    "name": "Updated Name",
    "color": "#FF5722",
    "page_title": "New Title",
    "config": {
      "allowed_locales": ["en", "es", "fr", "de"]
    }
  },
  "blob_id": "new_logo_blob_id"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Updated Name",
  "color": "#FF5722"
}
```

---

### 30. Delete Portal

**Endpoint**: `DELETE /api/v1/accounts/:account_id/portals/:slug`
**Controller**: `Api::V1::Accounts::PortalsController#destroy`
**Authentication**: Required (Admin)
**Description**: Deletes a portal and all its articles.

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Permanently deletes portal, categories, and articles
- Cannot be undone

---

### 31. Archive Portal

**Endpoint**: `PATCH /api/v1/accounts/:account_id/portals/:slug/archive`
**Controller**: `Api::V1::Accounts::PortalsController#archive`
**Authentication**: Required (Admin)
**Description**: Archives a portal (soft delete).

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Archived portals not publicly accessible
- Can be unarchived by updating `archived: false`

---

### 32. Delete Portal Logo

**Endpoint**: `DELETE /api/v1/accounts/:account_id/portals/:slug/logo`
**Controller**: `Api::V1::Accounts::PortalsController#logo`
**Authentication**: Required (Admin)
**Description**: Removes portal logo.

**Response** (200 OK):
```
(Empty response body)
```

---

### 33. Send Custom Domain Instructions

**Endpoint**: `POST /api/v1/accounts/:account_id/portals/:slug/send_instructions`
**Controller**: `Api::V1::Accounts::PortalsController#send_instructions`
**Authentication**: Required (Admin)
**Description**: Emails custom domain setup instructions.

**Request Body**:
```json
{
  "email": "admin@acme.com"
}
```

**Response** (200 OK):
```json
{
  "message": "Instructions sent successfully"
}
```

**Notes**:
- Requires `custom_domain` to be set
- Sends CNAME configuration details

---

## 📄 Articles API

**Base Path**: `/api/v1/accounts/:account_id/portals/:portal_id/articles`
**Controller**: `Api::V1::Accounts::ArticlesController`

Help center article management.

### 34. List Articles

**Endpoint**: `GET /api/v1/accounts/:account_id/portals/:portal_id/articles`
**Controller**: `Api::V1::Accounts::ArticlesController#index`
**Authentication**: Required
**Description**: Lists articles in a portal.

**Query Parameters**:
- `locale` - Filter by locale (e.g., `en`, `es`)
- `query` - Search query
- `category_slug` - Filter by category
- `status` - Filter by status: `draft`, `published`, `archived`
- `author_id` - Filter by author
- `page` - Page number

**Example Request**:
```
GET /api/v1/accounts/1/portals/product-help/articles?locale=en&status=published&page=1
```

**Response** (200 OK):
```json
{
  "payload": [
    {
      "id": 5,
      "title": "Getting Started Guide",
      "slug": "getting-started",
      "content": "Full article content in HTML...",
      "description": "Learn how to get started with our product",
      "position": 1,
      "status": "published",
      "locale": "en",
      "category": {
        "id": 1,
        "name": "Basics",
        "slug": "basics"
      },
      "author": {
        "id": 1,
        "name": "Admin User"
      },
      "views": 1250,
      "created_at": "2024-12-01T08:00:00Z",
      "updated_at": "2025-01-06T10:00:00Z"
    }
  ],
  "meta": {
    "all_articles_count": 45,
    "mine_articles_count": 12,
    "published_count": 38,
    "draft_count": 5,
    "archived_count": 2,
    "current_page": 1
  }
}
```

---

### 35. Get Article Details

**Endpoint**: `GET /api/v1/accounts/:account_id/portals/:portal_id/articles/:id`
**Controller**: `Api::V1::Accounts::ArticlesController#show`
**Authentication**: Required
**Description**: Retrieves full article details.

**Response** (200 OK):
```json
{
  "id": 5,
  "title": "Getting Started Guide",
  "slug": "getting-started",
  "content": "<h1>Getting Started</h1><p>Welcome to our product...</p>",
  "description": "Learn how to get started",
  "position": 1,
  "status": "published",
  "locale": "en",
  "category_id": 1,
  "author_id": 1,
  "associated_articles": [
    {
      "id": 6,
      "title": "Advanced Features"
    }
  ],
  "meta": {
    "title": "SEO optimized title",
    "description": "SEO meta description",
    "tags": ["getting-started", "tutorial"]
  },
  "views": 1250,
  "created_at": "2024-12-01T08:00:00Z"
}
```

---

### 36. Create Article

**Endpoint**: `POST /api/v1/accounts/:account_id/portals/:portal_id/articles`
**Controller**: `Api::V1::Accounts::ArticlesController#create`
**Authentication**: Required
**Description**: Creates a new article (as draft).

**Request Body**:
```json
{
  "article": {
    "title": "How to Reset Password",
    "slug": "reset-password",
    "content": "<h1>Password Reset</h1><p>Follow these steps...</p>",
    "description": "Guide to resetting your password",
    "category_id": 2,
    "author_id": 1,
    "locale": "en",
    "position": 1,
    "associated_article_id": null,
    "meta": {
      "title": "Reset Password - Help Center",
      "description": "Step-by-step password reset guide",
      "tags": ["password", "security", "account"]
    }
  }
}
```

**Response** (201 Created):
```json
{
  "id": 10,
  "title": "How to Reset Password",
  "slug": "reset-password",
  "status": "draft",
  "locale": "en",
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Notes**:
- Articles created as `draft` by default
- Must publish separately
- `slug` must be unique within portal

---

### 37. Update Article

**Endpoint**: `PUT /api/v1/accounts/:account_id/portals/:portal_id/articles/:id`
**Controller**: `Api::V1::Accounts::ArticlesController#update`
**Authentication**: Required
**Description**: Updates article content and metadata.

**Request Body**:
```json
{
  "article": {
    "title": "Updated Title",
    "content": "<h1>Updated content...</h1>",
    "status": "published",
    "meta": {
      "tags": ["updated", "new-tag"]
    }
  }
}
```

**Status Options**:
- `draft` - Not published
- `published` - Live and visible
- `archived` - Hidden but not deleted

**Response** (200 OK):
```json
{
  "id": 10,
  "title": "Updated Title",
  "status": "published"
}
```

---

### 38. Delete Article

**Endpoint**: `DELETE /api/v1/accounts/:account_id/portals/:portal_id/articles/:id`
**Controller**: `Api::V1::Accounts::ArticlesController#destroy`
**Authentication**: Required
**Description**: Permanently deletes an article.

**Response** (200 OK):
```
(Empty response body)
```

---

### 39. Reorder Articles

**Endpoint**: `POST /api/v1/accounts/:account_id/portals/:portal_id/articles/reorder`
**Controller**: `Api::V1::Accounts::ArticlesController#reorder`
**Authentication**: Required
**Description**: Updates article positions within category.

**Request Body**:
```json
{
  "positions_hash": {
    "5": 1,
    "6": 2,
    "7": 3,
    "10": 4
  }
}
```

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Key: article_id, Value: new position
- Used for drag-and-drop reordering

---

## 🤖 Agent Bots API

**Base Path**: `/api/v1/accounts/:account_id/agent_bots`
**Controller**: `Api::V1::Accounts::AgentBotsController`

Configure AI agent bots for conversations.

### 40. List Agent Bots

**Endpoint**: `GET /api/v1/accounts/:account_id/agent_bots`
**Controller**: `Api::V1::Accounts::AgentBotsController#index`
**Authentication**: Required
**Description**: Lists all agent bots (global and account-specific).

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Dialogflow Bot",
    "description": "Google Dialogflow integration",
    "outgoing_url": null,
    "account_id": null,
    "bot_type": "csml",
    "bot_config": {},
    "avatar": "https://chatwoot.com/bots/dialogflow.png"
  },
  {
    "id": 2,
    "name": "Support Bot",
    "description": "Custom support bot for common questions",
    "outgoing_url": "https://bot.acme.com/webhook",
    "account_id": 1,
    "bot_type": "webhook",
    "bot_config": {
      "headers": {
        "Authorization": "Bearer token"
      }
    },
    "avatar": "https://acme.com/bot-avatar.png"
  }
]
```

**Bot Types**:
- `webhook` - External webhook bot
- `csml` - CSML bot (deprecated)
- `hook` - Integration hook bot

---

### 41. Get Agent Bot Details

**Endpoint**: `GET /api/v1/accounts/:account_id/agent_bots/:id`
**Controller**: `Api::V1::Accounts::AgentBotsController#show`
**Authentication**: Required
**Description**: Retrieves bot details.

**Response** (200 OK):
```json
{
  "id": 2,
  "name": "Support Bot",
  "description": "Custom support bot",
  "outgoing_url": "https://bot.acme.com/webhook",
  "bot_type": "webhook",
  "bot_config": {
    "headers": {
      "Authorization": "Bearer token"
    },
    "timeout": 10
  }
}
```

---

### 42. Create Agent Bot

**Endpoint**: `POST /api/v1/accounts/:account_id/agent_bots`
**Controller**: `Api::V1::Accounts::AgentBotsController#create`
**Authentication**: Required (Admin)
**Description**: Creates a new agent bot.

**Request Body**:
```json
{
  "name": "AI Assistant",
  "description": "OpenAI powered assistant",
  "outgoing_url": "https://ai.acme.com/webhook",
  "bot_type": "webhook",
  "bot_config": {
    "headers": {
      "Authorization": "Bearer sk-xxx",
      "Content-Type": "application/json"
    },
    "timeout": 15
  },
  "avatar_url": "https://acme.com/ai-avatar.png"
}
```

**Response** (201 Created):
```json
{
  "id": 3,
  "name": "AI Assistant",
  "description": "OpenAI powered assistant",
  "outgoing_url": "https://ai.acme.com/webhook",
  "account_id": 1,
  "bot_type": "webhook",
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Notes**:
- `outgoing_url` receives webhook events when bot receives messages
- `bot_config` can store custom configuration
- `avatar_url` downloads avatar asynchronously

**Use Case for AI**:
- Connect external AI services
- Custom bot logic
- Integrate with GPT, Claude, etc.

---

### 43. Update Agent Bot

**Endpoint**: `PUT /api/v1/accounts/:account_id/agent_bots/:id`
**Controller**: `Api::V1::Accounts::AgentBotsController#update`
**Authentication**: Required (Admin)
**Description**: Updates bot configuration.

**Request Body**:
```json
{
  "name": "Updated Bot Name",
  "outgoing_url": "https://new-url.com/webhook",
  "bot_config": {
    "timeout": 20
  }
}
```

**Response** (200 OK):
```json
{
  "id": 3,
  "name": "Updated Bot Name",
  "outgoing_url": "https://new-url.com/webhook"
}
```

---

### 44. Delete Agent Bot Avatar

**Endpoint**: `DELETE /api/v1/accounts/:account_id/agent_bots/:id/avatar`
**Controller**: `Api::V1::Accounts::AgentBotsController#avatar`
**Authentication**: Required (Admin)
**Description**: Removes bot avatar.

**Response** (200 OK):
```json
{
  "id": 3,
  "avatar": null
}
```

---

### 45. Delete Agent Bot

**Endpoint**: `DELETE /api/v1/accounts/:account_id/agent_bots/:id`
**Controller**: `Api::V1::Accounts::AgentBotsController#destroy`
**Authentication**: Required (Admin)
**Description**: Deletes an agent bot.

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Removes bot from all inboxes
- Cannot delete global bots (account_id null)

---

### 46. Reset Bot Access Token

**Endpoint**: `POST /api/v1/accounts/:account_id/agent_bots/:id/reset_access_token`
**Controller**: `Api::V1::Accounts::AgentBotsController#reset_access_token`
**Authentication**: Required (Admin)
**Description**: Regenerates bot API access token.

**Response** (200 OK):
```json
{
  "id": 3,
  "access_token": {
    "token": "new-token-here"
  }
}
```

**Use Case**: Rotate credentials for security

---

## 🏢 Platform API

**Base Path**: `/platform/api/v1`
**Authentication**: Platform API Token

Platform-level operations for multi-tenancy and SaaS management.

### Platform Accounts

#### 47. List Platform Accounts

**Endpoint**: `GET /platform/api/v1/accounts`
**Controller**: `Platform::Api::V1::AccountsController#index`
**Authentication**: Platform API Token
**Description**: Lists all accounts accessible by the platform app.

**Headers**:
```
api_access_token: platform-token-here
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Acme Corp",
    "locale": "en",
    "domain": "acme.chatwoot.com",
    "support_email": "support@acme.com",
    "status": "active",
    "features": {
      "custom_domain": true,
      "agent_bots": true
    },
    "limits": {
      "agents": 10,
      "inboxes": 5
    }
  }
]
```

---

#### 48. Get Platform Account

**Endpoint**: `GET /platform/api/v1/accounts/:id`
**Controller**: `Platform::Api::V1::AccountsController#show`
**Authentication**: Platform API Token
**Description**: Retrieves account details.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Acme Corp",
  "locale": "en",
  "status": "active",
  "features": {
    "custom_domain": true,
    "agent_bots": true,
    "sla": false
  },
  "limits": {
    "agents": 10,
    "inboxes": 5
  },
  "custom_attributes": {
    "plan": "enterprise",
    "billing_id": "cus_123"
  }
}
```

---

#### 49. Create Platform Account

**Endpoint**: `POST /platform/api/v1/accounts`
**Controller**: `Platform::Api::V1::AccountsController#create`
**Authentication**: Platform API Token
**Description**: Creates a new account programmatically.

**Request Body**:
```json
{
  "name": "New Company",
  "locale": "en",
  "domain": "newcompany.chatwoot.com",
  "support_email": "support@newcompany.com",
  "features": {
    "custom_domain": true,
    "agent_bots": true,
    "sla": true
  },
  "limits": {
    "agents": 20,
    "inboxes": 10
  },
  "custom_attributes": {
    "plan": "pro",
    "trial_ends_at": "2025-02-06"
  }
}
```

**Response** (201 Created):
```json
{
  "id": 5,
  "name": "New Company",
  "status": "active",
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Use Case**: Automated account provisioning for SaaS

---

#### 50. Update Platform Account

**Endpoint**: `PUT /platform/api/v1/accounts/:id`
**Controller**: `Platform::Api::V1::AccountsController#update`
**Authentication**: Platform API Token
**Description**: Updates account configuration.

**Request Body**:
```json
{
  "name": "Updated Name",
  "status": "suspended",
  "features": {
    "sla": true
  },
  "limits": {
    "agents": 50
  }
}
```

**Status Options**:
- `active` - Account operational
- `suspended` - Temporarily disabled
- `inactive` - Permanently disabled

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Updated Name",
  "status": "suspended"
}
```

---

#### 51. Delete Platform Account

**Endpoint**: `DELETE /platform/api/v1/accounts/:id`
**Controller**: `Platform::Api::V1::AccountsController#destroy`
**Authentication**: Platform API Token
**Description**: Deletes an account (async).

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Deletion is asynchronous (background job)
- Permanently removes all data

---

### Platform Account Users

**Base Path**: `/platform/api/v1/accounts/:account_id/account_users`

#### 52. List Account Users

**Endpoint**: `GET /platform/api/v1/accounts/:account_id/account_users`
**Description**: Lists users in an account.

**Response** (200 OK):
```json
[
  {
    "user_id": 1,
    "account_id": 1,
    "role": "administrator",
    "availability": "online"
  }
]
```

---

#### 53. Add User to Account

**Endpoint**: `POST /platform/api/v1/accounts/:account_id/account_users`
**Description**: Adds a user to an account.

**Request Body**:
```json
{
  "user_id": 2,
  "role": "agent"
}
```

**Response** (201 Created):
```json
{
  "user_id": 2,
  "account_id": 1,
  "role": "agent"
}
```

---

#### 54. Remove User from Account

**Endpoint**: `DELETE /platform/api/v1/accounts/:account_id/account_users`
**Description**: Removes a user from account.

**Request Body**:
```json
{
  "user_id": 2
}
```

**Response** (200 OK):
```
(Empty response body)
```

---

### Platform Agent Bots

**Base Path**: `/platform/api/v1/agent_bots`
**Controller**: `Platform::Api::V1::AgentBotsController`

#### 55. List Platform Agent Bots

**Endpoint**: `GET /platform/api/v1/agent_bots`
**Controller**: `Platform::Api::V1::AgentBotsController#index`
**Authentication**: Platform API Token
**Description**: Lists all agent bots managed by platform app.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Global Support Bot",
    "description": "Shared bot across accounts",
    "outgoing_url": "https://bot.platform.com/webhook",
    "account_id": null
  }
]
```

---

#### 56. Create Platform Agent Bot

**Endpoint**: `POST /platform/api/v1/agent_bots`
**Controller**: `Platform::Api::V1::AgentBotsController#create`
**Authentication**: Platform API Token
**Description**: Creates a platform-managed bot.

**Request Body**:
```json
{
  "name": "Platform Bot",
  "description": "Centrally managed bot",
  "account_id": null,
  "outgoing_url": "https://bot.platform.com/webhook",
  "avatar_url": "https://platform.com/bot.png"
}
```

**Response** (201 Created):
```json
{
  "id": 10,
  "name": "Platform Bot",
  "account_id": null,
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Notes**:
- `account_id: null` creates global bot available to all accounts
- `account_id: 1` creates account-specific bot

---

## 🎯 AI Agent Use Cases

### Recommended Endpoints for AI Integration

#### 1. **Knowledge Base Management**
- `POST /api/v1/accounts/:account_id/portals/:portal_id/articles` - AI-generated help articles
- `GET /api/v1/accounts/:account_id/search/articles` - Find relevant articles for suggestions
- `PUT /api/v1/accounts/:account_id/portals/:portal_id/articles/:id` - Update articles based on feedback

#### 2. **Intelligent Search**
- `GET /api/v1/accounts/:account_id/search` - Unified search for context gathering
- `GET /api/v1/accounts/:account_id/search/messages` - Find similar past conversations
- `GET /api/v1/accounts/:account_id/search/contacts` - Contact lookup

#### 3. **Custom Data Collection**
- `POST /api/v1/accounts/:account_id/custom_attribute_definitions` - Define AI-extracted fields
- `POST /api/v1/accounts/:account_id/custom_filters` - Save common AI queries
- Structured data extraction and validation

#### 4. **AI Bot Integration**
- `POST /api/v1/accounts/:account_id/agent_bots` - Configure AI bot endpoints
- `POST /api/v1/accounts/:account_id/integrations/hooks` - Connect to AI services
- `POST /api/v1/accounts/:account_id/integrations/hooks/:id/process_event` - Trigger AI processing

#### 5. **Integration Ecosystem**
- Slack - Team notifications and alerts
- Dialogflow/OpenAI - Conversational AI
- Linear - Issue tracking automation
- Shopify - E-commerce context

#### 6. **Platform Automation**
- `POST /platform/api/v1/accounts` - Automated account provisioning
- `POST /platform/api/v1/accounts/:account_id/account_users` - Bulk user management
- Multi-tenant SaaS operations

---

## 📝 Notes

### Search Performance Tips
- Use specific entity search (conversations, contacts, etc.) when possible
- Implement client-side result caching
- Use pagination for large result sets
- Search is case-insensitive

### Integration Best Practices
- Store sensitive credentials in `bot_config` or `settings`
- Implement webhook signature verification
- Use HTTPS for all webhook URLs
- Handle timeouts gracefully (default 10-15 seconds)

### Knowledge Base SEO
- Fill `meta.title` and `meta.description` for articles
- Use descriptive slugs
- Add relevant tags
- Optimize content for search engines
- Enable custom domains for better branding

### Custom Attributes Guidelines
- Plan attribute structure before creating
- Use validation patterns (`regex_pattern`) for data quality
- Document `regex_cue` for user guidance
- Limit number of attributes (performance)
- Use lists for controlled vocabularies

### Platform API Security
- Rotate platform tokens regularly
- Use IP whitelisting when possible
- Monitor API usage and rate limits
- Implement proper access controls

---

## 🔒 Security Considerations

### Authentication
- All endpoints require valid authentication
- Platform API uses separate token system
- Tokens should be rotated periodically
- Use HTTPS for all API calls

### Authorization
- Admin endpoints require administrator role
- Platform API has account-wide access
- Pundit policies enforce permissions
- Check user role before sensitive operations

### Data Privacy
- Custom attributes may contain PII
- Articles can be public or private
- Webhooks may expose sensitive data
- Implement data retention policies

---

## 📚 Related Documentation

This is **Part 4 of 4** in the Chatwoot API documentation series.

**Previous**:
- Part 1/4 - Accounts, Users, and Contacts (46 endpoints)
- Part 2/4 - Conversations, Messages, and Inboxes (54 endpoints)
- Part 3/4 - Teams, Reports, Webhooks, and Automation (60 endpoints)

**Summary**:
- **Part 1**: 46 endpoints
- **Part 2**: 54 endpoints
- **Part 3**: 60 endpoints
- **Part 4**: 56 endpoints
- **Total**: 216 endpoints documented

**Next Step**: Consolidation into single comprehensive document

---

**Generated**: 2025-01-06
**Chatwoot Version**: Latest (as of documentation date)
**API Version**: v1, Platform API v1
**Total Endpoints in Part 4**: 56
**Grand Total**: 216 endpoints
