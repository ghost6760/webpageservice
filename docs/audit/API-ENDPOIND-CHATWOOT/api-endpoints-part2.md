# Chatwoot API Documentation - Part 2/4
## Conversations, Messages, and Inboxes

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Conversations API](#conversations-api)
3. [Conversation Sub-Resources](#conversation-sub-resources)
4. [Messages API](#messages-api)
5. [Inboxes API](#inboxes-api)
6. [Public API - Conversations & Messages](#public-api---conversations--messages)

---

## 🌟 Overview

This document covers the core communication APIs in Chatwoot:
- **Conversations**: Managing customer conversations with agents
- **Messages**: Individual messages within conversations
- **Inboxes**: Communication channels (email, chat, social media, etc.)

**Base Path**: `/api/v1/accounts/:account_id`

**Authentication**: All endpoints require authentication unless specified otherwise.

---

## 💬 Conversations API

**Base Path**: `/api/v1/accounts/:account_id/conversations`
**Controller**: `Api::V1::Accounts::ConversationsController`

### 1. List Conversations

**Endpoint**: `GET /api/v1/accounts/:account_id/conversations`
**Controller**: `Api::V1::Accounts::ConversationsController#index`
**Authentication**: Required
**Description**: Lists conversations with filtering and pagination.

**Query Parameters**:
- `status` - Filter by status: `open`, `resolved`, `pending`, `snoozed`
- `assignee_type` - Filter by assignee: `me`, `unassigned`, `all`
- `inbox_id` - Filter by inbox ID
- `team_id` - Filter by team ID
- `labels` - Filter by label names (array)
- `page` - Page number (default: 1)
- `sort_by` - Sort field: `latest`, `priority`, `waiting_since`, `created_at`, `last_activity_at`

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Example Request**:
```
GET /api/v1/accounts/1/conversations?status=open&assignee_type=me&page=1&sort_by=latest
```

**Response** (200 OK):
```json
{
  "data": {
    "meta": {
      "count": 45,
      "current_page": 1
    },
    "payload": [
      {
        "id": 100,
        "display_id": 100,
        "inbox_id": 1,
        "status": "open",
        "timestamp": "2025-01-06T10:00:00Z",
        "contact": {
          "id": 10,
          "name": "Alice Johnson",
          "email": "alice@example.com",
          "phone_number": "+1234567890"
        },
        "assignee": {
          "id": 2,
          "name": "Agent Jane",
          "email": "jane@company.com"
        },
        "team": {
          "id": 1,
          "name": "Support Team"
        },
        "messages": [
          {
            "id": 500,
            "content": "I need help with my order",
            "message_type": "incoming",
            "created_at": "2025-01-06T10:00:00Z"
          }
        ],
        "labels": ["urgent", "sales"],
        "priority": "high",
        "custom_attributes": {},
        "unread_count": 3,
        "agent_last_seen_at": "2025-01-06T09:55:00Z",
        "waiting_since": 300
      }
    ]
  }
}
```

**Use Case for AI**: Monitor active conversations, filter by status/assignee for intelligent routing

---

### 2. Get Conversation Metadata

**Endpoint**: `GET /api/v1/accounts/:account_id/conversations/meta`
**Controller**: `Api::V1::Accounts::ConversationsController#meta`
**Authentication**: Required
**Description**: Returns conversation count without fetching full data.

**Query Parameters**: Same as List Conversations

**Response** (200 OK):
```json
{
  "meta": {
    "mine_count": 5,
    "unassigned_count": 12,
    "all_count": 45
  }
}
```

**Use Case**: Dashboard statistics, count-only queries

---

### 3. Search Conversations

**Endpoint**: `GET /api/v1/accounts/:account_id/conversations/search`
**Controller**: `Api::V1::Accounts::ConversationsController#search`
**Authentication**: Required
**Description**: Searches conversations by message content.

**Query Parameters**:
- `q` - Search query (required)
- `page` - Page number (default: 1)
- Other filters from List Conversations

**Example Request**:
```
GET /api/v1/accounts/1/conversations/search?q=order+status&page=1
```

**Response** (200 OK):
```json
{
  "data": {
    "meta": {
      "count": 8,
      "current_page": 1
    },
    "payload": [
      {
        "id": 101,
        "display_id": 101,
        "messages": [
          {
            "content": "What's my order status?",
            "message_type": "incoming"
          }
        ]
      }
    ]
  }
}
```

**Use Case for AI**: Find conversations by keywords, context retrieval

---

### 4. Filter Conversations

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/filter`
**Controller**: `Api::V1::Accounts::ConversationsController#filter`
**Authentication**: Required
**Description**: Advanced filtering using custom filter criteria.

**Request Body**:
```json
{
  "payload": [
    {
      "attribute_key": "status",
      "filter_operator": "equal_to",
      "values": ["open"],
      "query_operator": "and"
    },
    {
      "attribute_key": "assignee_id",
      "filter_operator": "equal_to",
      "values": [2],
      "query_operator": "and"
    },
    {
      "attribute_key": "created_at",
      "filter_operator": "days_before",
      "values": [7],
      "query_operator": "and"
    }
  ],
  "page": 1
}
```

**Filter Operators**:
- `equal_to`, `not_equal_to`
- `contains`, `does_not_contain`
- `is_present`, `is_not_present`
- `is_greater_than`, `is_less_than`
- `days_before`

**Response** (200 OK):
```json
{
  "data": {
    "meta": {
      "count": 15,
      "current_page": 1
    },
    "payload": [...]
  }
}
```

**Use Case for AI**: Complex queries, automated filtering, reporting

---

### 5. Get Conversation Details

**Endpoint**: `GET /api/v1/accounts/:account_id/conversations/:id`
**Controller**: `Api::V1::Accounts::ConversationsController#show`
**Authentication**: Required
**Description**: Retrieves full details of a specific conversation.

**Response** (200 OK):
```json
{
  "id": 100,
  "display_id": 100,
  "inbox_id": 1,
  "status": "open",
  "priority": "high",
  "muted": false,
  "snoozed_until": null,
  "can_reply": true,
  "timestamp": "2025-01-06T10:00:00Z",
  "created_at": "2025-01-06T10:00:00Z",
  "contact": {
    "id": 10,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone_number": "+1234567890",
    "additional_attributes": {
      "company_name": "Acme Corp"
    }
  },
  "assignee": {
    "id": 2,
    "name": "Agent Jane",
    "email": "jane@company.com",
    "avatar": "https://example.com/avatar.png"
  },
  "team": {
    "id": 1,
    "name": "Support Team"
  },
  "messages": [],
  "labels": ["urgent", "billing"],
  "custom_attributes": {
    "order_id": "ORD12345",
    "priority_customer": true
  },
  "unread_count": 3,
  "agent_last_seen_at": "2025-01-06T10:05:00Z",
  "assignee_last_seen_at": "2025-01-06T10:05:00Z"
}
```

---

### 6. Create Conversation

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations`
**Controller**: `Api::V1::Accounts::ConversationsController#create`
**Authentication**: Required
**Description**: Creates a new conversation with a contact.

**Request Body**:
```json
{
  "inbox_id": 1,
  "contact_id": 10,
  "source_id": "external_123",
  "status": "open",
  "assignee_id": 2,
  "team_id": 1,
  "message": {
    "content": "Hello, how can we help you today?",
    "message_type": "outgoing",
    "private": false,
    "content_type": "text",
    "content_attributes": {}
  },
  "custom_attributes": {
    "origin": "website",
    "campaign": "summer_2025"
  }
}
```

**Message Types**:
- `outgoing` - Agent to contact
- `incoming` - Contact to agent
- `activity` - System message

**Response** (201 Created):
```json
{
  "id": 102,
  "display_id": 102,
  "inbox_id": 1,
  "status": "open",
  "contact": {...},
  "assignee": {...},
  "messages": [
    {
      "id": 501,
      "content": "Hello, how can we help you today?",
      "message_type": "outgoing"
    }
  ]
}
```

**Use Case for AI**: Proactively start conversations, automated outreach

---

### 7. Update Conversation

**Endpoint**: `PUT /api/v1/accounts/:account_id/conversations/:id`
**Controller**: `Api::V1::Accounts::ConversationsController#update`
**Authentication**: Required
**Description**: Updates conversation properties.

**Request Body**:
```json
{
  "priority": "urgent"
}
```

**Priority Options**: `urgent`, `high`, `medium`, `low`, `none`

**Response** (200 OK):
```json
{
  "id": 100,
  "priority": "urgent"
}
```

---

### 8. Delete Conversation

**Endpoint**: `DELETE /api/v1/accounts/:account_id/conversations/:id`
**Controller**: `Api::V1::Accounts::ConversationsController#destroy`
**Authentication**: Required (Admin)
**Description**: Deletes a conversation permanently.

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Deletion is asynchronous (background job)
- Requires administrator privileges
- Permanently removes all messages and attachments

---

### 9. Mute Conversation

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/mute`
**Controller**: `Api::V1::Accounts::ConversationsController#mute`
**Authentication**: Required
**Description**: Mutes notifications for the conversation.

**Response** (200 OK):
```
(Empty response body)
```

**Use Case**: Temporarily disable notifications for specific conversations

---

### 10. Unmute Conversation

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/unmute`
**Controller**: `Api::V1::Accounts::ConversationsController#unmute`
**Authentication**: Required
**Description**: Re-enables notifications for the conversation.

**Response** (200 OK):
```
(Empty response body)
```

---

### 11. Send Transcript

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/transcript`
**Controller**: `Api::V1::Accounts::ConversationsController#transcript`
**Authentication**: Required
**Description**: Emails conversation transcript to specified address.

**Request Body**:
```json
{
  "email": "customer@example.com"
}
```

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Sent asynchronously via email
- Includes all messages and attachments

**Use Case for AI**: Share conversation history, customer follow-up

---

### 12. Toggle Conversation Status

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/toggle_status`
**Controller**: `Api::V1::Accounts::ConversationsController#toggle_status`
**Authentication**: Required
**Description**: Changes conversation status.

**Request Body**:
```json
{
  "status": "resolved",
  "snoozed_until": "2025-01-10T10:00:00Z"
}
```

**Status Options**:
- `open` - Active conversation
- `resolved` - Closed/resolved
- `pending` - Waiting for customer
- `snoozed` - Temporarily hidden until date

**Response** (200 OK):
```json
{
  "id": 100,
  "status": "resolved"
}
```

**Notes**:
- Auto-assigns to current agent when reopening
- Bot handoff support for agent bots

**Use Case for AI**: Automated status management, ticket resolution

---

### 13. Toggle Priority

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/toggle_priority`
**Controller**: `Api::V1::Accounts::ConversationsController#toggle_priority`
**Authentication**: Required
**Description**: Changes conversation priority.

**Request Body**:
```json
{
  "priority": "urgent"
}
```

**Response** (200 OK):
```
(Empty response body)
```

**Use Case for AI**: Intelligent priority assignment based on sentiment/urgency

---

### 14. Toggle Typing Status

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/toggle_typing_status`
**Controller**: `Api::V1::Accounts::ConversationsController#toggle_typing_status`
**Authentication**: Required
**Description**: Broadcasts typing indicator status.

**Request Body**:
```json
{
  "typing_status": "on"
}
```

**Typing Status**: `on` or `off`

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Broadcasts to all conversation participants via WebSocket
- Used for real-time "agent is typing..." indicators

---

### 15. Update Last Seen

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/update_last_seen`
**Controller**: `Api::V1::Accounts::ConversationsController#update_last_seen`
**Authentication**: Required
**Description**: Updates agent's last seen timestamp.

**Response** (200 OK):
```
(Empty response body)
```

**Use Case**: Track when agent viewed conversation, read receipts

---

### 16. Mark as Unread

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/unread`
**Controller**: `Api::V1::Accounts::ConversationsController#unread`
**Authentication**: Required
**Description**: Marks conversation as unread for the agent.

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Sets last_seen to before last incoming message
- Shows conversation as unread in inbox

---

### 17. Update Custom Attributes

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/custom_attributes`
**Controller**: `Api::V1::Accounts::ConversationsController#custom_attributes`
**Authentication**: Required
**Description**: Updates conversation custom attributes.

**Request Body**:
```json
{
  "custom_attributes": {
    "order_id": "ORD67890",
    "product": "Premium Plan",
    "issue_type": "billing"
  }
}
```

**Response** (200 OK):
```json
{
  "id": 100,
  "custom_attributes": {
    "order_id": "ORD67890",
    "product": "Premium Plan",
    "issue_type": "billing"
  }
}
```

**Use Case for AI**: Tag conversations with metadata, context enrichment

---

### 18. Get Attachments

**Endpoint**: `GET /api/v1/accounts/:account_id/conversations/:id/attachments`
**Controller**: `Api::V1::Accounts::ConversationsController#attachments`
**Authentication**: Required
**Description**: Lists all attachments in the conversation.

**Query Parameters**:
- `page` - Page number (default: 1)

**Response** (200 OK):
```json
{
  "payload": [
    {
      "id": 1,
      "file_type": "image",
      "file_name": "screenshot.png",
      "file_size": 245678,
      "file_url": "https://cdn.example.com/attachments/screenshot.png",
      "message_id": 500,
      "created_at": "2025-01-06T10:01:00Z"
    },
    {
      "id": 2,
      "file_type": "document",
      "file_name": "invoice.pdf",
      "file_size": 89234,
      "file_url": "https://cdn.example.com/attachments/invoice.pdf",
      "message_id": 501,
      "created_at": "2025-01-06T10:15:00Z"
    }
  ],
  "meta": {
    "count": 2,
    "current_page": 1
  }
}
```

**Pagination**: 100 attachments per page

**Use Case for AI**: Retrieve images/documents for analysis, file indexing

---

### 19. Get Inbox Assistant Context

**Endpoint**: `GET /api/v1/accounts/:account_id/conversations/:id/inbox_assistant`
**Controller**: Referenced in routes
**Authentication**: Required
**Description**: Retrieves AI assistant context for the conversation.

**Response** (200 OK):
```json
{
  "context": {
    "contact_info": {...},
    "conversation_history": [...],
    "suggested_responses": [...],
    "related_articles": [...]
  }
}
```

**Use Case for AI**: Get conversation context for intelligent responses

---

## 🔗 Conversation Sub-Resources

### Assignments

**Base Path**: `/api/v1/accounts/:account_id/conversations/:conversation_id/assignments`
**Controller**: `Api::V1::Accounts::Conversations::AssignmentsController`

#### 20. Assign Conversation

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/assignments`
**Controller**: `Api::V1::Accounts::Conversations::AssignmentsController#create`
**Authentication**: Required
**Description**: Assigns conversation to an agent or team.

**Request Body (Assign to Agent)**:
```json
{
  "assignee_id": 2
}
```

**Request Body (Assign to Team)**:
```json
{
  "team_id": 1
}
```

**Request Body (Unassign)**:
```json
{
  "assignee_id": null
}
```

**Response** (200 OK):
```json
{
  "id": 2,
  "name": "Agent Jane",
  "email": "jane@company.com",
  "avatar": "https://example.com/avatar.png"
}
```

**Use Case for AI**: Intelligent routing, load balancing, skill-based assignment

---

### Labels

**Base Path**: `/api/v1/accounts/:account_id/conversations/:conversation_id/labels`
**Controller**: `Api::V1::Accounts::Conversations::LabelsController`

#### 21. List Conversation Labels

**Endpoint**: `GET /api/v1/accounts/:account_id/conversations/:conversation_id/labels`
**Controller**: `Api::V1::Accounts::Conversations::LabelsController#index`
**Authentication**: Required
**Description**: Lists all labels assigned to the conversation.

**Response** (200 OK):
```json
{
  "payload": ["urgent", "billing", "vip-customer"]
}
```

---

#### 22. Add Conversation Labels

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/labels`
**Controller**: `Api::V1::Accounts::Conversations::LabelsController#create`
**Authentication**: Required
**Description**: Adds labels to the conversation.

**Request Body**:
```json
{
  "labels": ["urgent", "billing", "vip-customer"]
}
```

**Response** (200 OK):
```json
{
  "payload": ["urgent", "billing", "vip-customer"]
}
```

**Use Case for AI**: Auto-categorization, sentiment-based tagging

---

### Participants

**Base Path**: `/api/v1/accounts/:account_id/conversations/:conversation_id/participants`
**Controller**: `Api::V1::Accounts::Conversations::ParticipantsController`

#### 23. List Participants

**Endpoint**: `GET /api/v1/accounts/:account_id/conversations/:conversation_id/participants`
**Controller**: `Api::V1::Accounts::Conversations::ParticipantsController#show`
**Authentication**: Required
**Description**: Lists all participants in the conversation.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "user_id": 2,
    "user": {
      "id": 2,
      "name": "Agent Jane",
      "email": "jane@company.com"
    }
  },
  {
    "id": 2,
    "user_id": 3,
    "user": {
      "id": 3,
      "name": "Agent Bob",
      "email": "bob@company.com"
    }
  }
]
```

---

#### 24. Add Participants

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/participants`
**Controller**: `Api::V1::Accounts::Conversations::ParticipantsController#create`
**Authentication**: Required
**Description**: Adds agents as participants to the conversation.

**Request Body**:
```json
{
  "user_ids": [2, 3, 4]
}
```

**Response** (201 Created):
```json
[
  {
    "id": 1,
    "user_id": 2
  },
  {
    "id": 2,
    "user_id": 3
  },
  {
    "id": 3,
    "user_id": 4
  }
]
```

**Use Case**: Multi-agent collaboration, escalation

---

#### 25. Update Participants

**Endpoint**: `PUT /api/v1/accounts/:account_id/conversations/:conversation_id/participants`
**Controller**: `Api::V1::Accounts::Conversations::ParticipantsController#update`
**Authentication**: Required
**Description**: Replaces participant list.

**Request Body**:
```json
{
  "user_ids": [2, 5]
}
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "user_id": 2
  },
  {
    "id": 4,
    "user_id": 5
  }
]
```

**Notes**:
- Adds new participants not in list
- Removes participants not in list

---

#### 26. Remove Participants

**Endpoint**: `DELETE /api/v1/accounts/:account_id/conversations/:conversation_id/participants`
**Controller**: `Api::V1::Accounts::Conversations::ParticipantsController#destroy`
**Authentication**: Required
**Description**: Removes specific participants.

**Request Body**:
```json
{
  "user_ids": [3, 4]
}
```

**Response** (200 OK):
```
(Empty response body)
```

---

### Direct Uploads

**Base Path**: `/api/v1/accounts/:account_id/conversations/:conversation_id/direct_uploads`
**Controller**: `Api::V1::Accounts::Conversations::DirectUploadsController`

#### 27. Create Direct Upload

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/direct_uploads`
**Controller**: `Api::V1::Accounts::Conversations::DirectUploadsController#create`
**Authentication**: Required
**Description**: Creates direct upload URL for ActiveStorage.

**Request Body**:
```json
{
  "blob": {
    "filename": "screenshot.png",
    "content_type": "image/png",
    "byte_size": 245678,
    "checksum": "abc123def456"
  }
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "key": "blob_key_here",
  "filename": "screenshot.png",
  "content_type": "image/png",
  "byte_size": 245678,
  "signed_id": "signed_blob_id_here",
  "direct_upload": {
    "url": "https://storage.example.com/upload",
    "headers": {
      "Content-Type": "image/png"
    }
  }
}
```

**Notes**:
- Used for client-side file uploads
- Returns signed URL for direct cloud storage upload
- Follow ActiveStorage direct upload flow

---

### Draft Messages

**Base Path**: `/api/v1/accounts/:account_id/conversations/:conversation_id/draft_messages`
**Controller**: `Api::V1::Accounts::Conversations::DraftMessagesController`

#### 28. Get Draft Message

**Endpoint**: `GET /api/v1/accounts/:account_id/conversations/:conversation_id/draft_messages`
**Controller**: `Api::V1::Accounts::Conversations::DraftMessagesController#show`
**Authentication**: Required
**Description**: Retrieves saved draft message for the conversation.

**Response** (200 OK):
```json
{
  "has_draft": true,
  "message": "I was typing this earlier..."
}
```

**Response (No Draft)**:
```json
{
  "has_draft": false
}
```

**Notes**:
- Stored in Redis for fast access
- Per conversation, per user

---

#### 29. Save Draft Message

**Endpoint**: `PUT /api/v1/accounts/:account_id/conversations/:conversation_id/draft_messages`
**Controller**: `Api::V1::Accounts::Conversations::DraftMessagesController#update`
**Authentication**: Required
**Description**: Saves draft message content.

**Request Body**:
```json
{
  "draft_message": {
    "message": "I'm working on a response..."
  }
}
```

**Response** (200 OK):
```
(Empty response body)
```

**Use Case**: Auto-save agent responses, resume writing later

---

#### 30. Delete Draft Message

**Endpoint**: `DELETE /api/v1/accounts/:account_id/conversations/:conversation_id/draft_messages`
**Controller**: `Api::V1::Accounts::Conversations::DraftMessagesController#destroy`
**Authentication**: Required
**Description**: Deletes saved draft message.

**Response** (200 OK):
```
(Empty response body)
```

---

## 💌 Messages API

**Base Path**: `/api/v1/accounts/:account_id/conversations/:conversation_id/messages`
**Controller**: `Api::V1::Accounts::Conversations::MessagesController`

### 31. List Messages

**Endpoint**: `GET /api/v1/accounts/:account_id/conversations/:conversation_id/messages`
**Controller**: `Api::V1::Accounts::Conversations::MessagesController#index`
**Authentication**: Required
**Description**: Lists all messages in a conversation.

**Query Parameters**:
- `page` - Page number (default: 1)
- `before` - Get messages before this ID
- `after` - Get messages after this ID

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Response** (200 OK):
```json
{
  "meta": {
    "count": 15
  },
  "payload": [
    {
      "id": 500,
      "content": "Hello, I need help with my order",
      "content_type": "text",
      "content_attributes": {},
      "message_type": "incoming",
      "created_at": "2025-01-06T10:00:00Z",
      "private": false,
      "status": "sent",
      "source_id": "ext_123",
      "sender": {
        "id": 10,
        "name": "Alice Johnson",
        "type": "contact",
        "email": "alice@example.com",
        "avatar": "https://example.com/avatar.png"
      },
      "attachments": [
        {
          "id": 1,
          "file_type": "image",
          "file_url": "https://cdn.example.com/image.png"
        }
      ],
      "conversation_id": 100
    },
    {
      "id": 501,
      "content": "I can help you with that!",
      "content_type": "text",
      "message_type": "outgoing",
      "created_at": "2025-01-06T10:01:00Z",
      "private": false,
      "status": "sent",
      "sender": {
        "id": 2,
        "name": "Agent Jane",
        "type": "user",
        "email": "jane@company.com"
      }
    }
  ]
}
```

**Message Types**:
- `incoming` - From contact to agent
- `outgoing` - From agent to contact
- `activity` - System/automation messages
- `template` - Template messages (WhatsApp, etc.)

**Content Types**:
- `text` - Plain text
- `input_text` - Text input
- `input_select` - Select dropdown
- `input_email` - Email input
- `input_textarea` - Multi-line text
- `cards` - Rich card layout
- `form` - Form message
- `article` - Help article

---

### 32. Create Message

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages`
**Controller**: `Api::V1::Accounts::Conversations::MessagesController#create`
**Authentication**: Required
**Description**: Sends a new message in the conversation.

**Request Body (Text Message)**:
```json
{
  "content": "Thank you for contacting us!",
  "message_type": "outgoing",
  "private": false,
  "content_type": "text"
}
```

**Request Body (With Attachments)**:
```json
{
  "content": "Here's the document you requested",
  "message_type": "outgoing",
  "private": false,
  "attachments": ["signed_blob_id_1", "signed_blob_id_2"]
}
```

**Request Body (Private Note)**:
```json
{
  "content": "Internal note: Customer seems frustrated",
  "message_type": "outgoing",
  "private": true
}
```

**Request Body (Rich Card)**:
```json
{
  "content": "Choose an option:",
  "content_type": "input_select",
  "content_attributes": {
    "items": [
      {"title": "Check Order Status", "value": "order_status"},
      {"title": "Return Product", "value": "return"},
      {"title": "Talk to Agent", "value": "agent"}
    ]
  }
}
```

**Response** (201 Created):
```json
{
  "id": 502,
  "content": "Thank you for contacting us!",
  "content_type": "text",
  "message_type": "outgoing",
  "created_at": "2025-01-06T10:05:00Z",
  "private": false,
  "status": "sent",
  "sender": {
    "id": 2,
    "name": "Agent Jane"
  },
  "conversation_id": 100
}
```

**Notes**:
- Private messages only visible to agents
- Attachments must be pre-uploaded via direct_uploads
- Message automatically sent to channel (email, chat, etc.)

**Use Case for AI**: Send automated responses, chatbot replies

---

### 33. Update Message

**Endpoint**: `PUT /api/v1/accounts/:account_id/conversations/:conversation_id/messages/:id`
**Controller**: `Api::V1::Accounts::Conversations::MessagesController#update`
**Authentication**: Required
**Description**: Updates message status (API inboxes only).

**Request Body**:
```json
{
  "status": "delivered",
  "external_error": null
}
```

**Status Options**:
- `sent` - Successfully sent
- `delivered` - Delivered to recipient
- `read` - Read by recipient
- `failed` - Delivery failed

**Response** (200 OK):
```json
{
  "id": 502,
  "status": "delivered"
}
```

**Notes**:
- Only available for API channel inboxes
- Used for webhook status updates from external services

---

### 34. Delete Message

**Endpoint**: `DELETE /api/v1/accounts/:account_id/conversations/:conversation_id/messages/:id`
**Controller**: `Api::V1::Accounts::Conversations::MessagesController#destroy`
**Authentication**: Required
**Description**: Soft deletes a message.

**Response** (200 OK):
```json
{
  "id": 502,
  "content": "This message was deleted",
  "content_type": "text",
  "content_attributes": {
    "deleted": true
  }
}
```

**Notes**:
- Message content replaced with "deleted" text
- All attachments removed
- Message still appears in history

---

### 35. Retry Failed Message

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages/:id/retry`
**Controller**: `Api::V1::Accounts::Conversations::MessagesController#retry`
**Authentication**: Required
**Description**: Retries sending a failed message.

**Response** (200 OK):
```json
{
  "id": 502,
  "status": "sent"
}
```

**Use Case**: Retry after temporary channel failures

---

### 36. Translate Message

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages/:id/translate`
**Controller**: `Api::V1::Accounts::Conversations::MessagesController#translate`
**Authentication**: Required
**Description**: Translates message content using Google Translate.

**Request Body**:
```json
{
  "target_language": "es"
}
```

**Language Codes**: ISO 639-1 codes (en, es, fr, de, etc.)

**Response** (200 OK):
```json
{
  "content": "Hola, necesito ayuda con mi pedido"
}
```

**Notes**:
- Requires Google Translate integration
- Translation cached in message.translations
- Subsequent requests return cached translation

**Use Case for AI**: Multi-language support, automatic translation

---

## 📮 Inboxes API

**Base Path**: `/api/v1/accounts/:account_id/inboxes`
**Controller**: `Api::V1::Accounts::InboxesController`

### 37. List Inboxes

**Endpoint**: `GET /api/v1/accounts/:account_id/inboxes`
**Controller**: `Api::V1::Accounts::InboxesController#index`
**Authentication**: Required
**Description**: Lists all inboxes in the account.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Website Chat",
    "channel_type": "Channel::WebWidget",
    "avatar_url": "https://example.com/avatar.png",
    "greeting_enabled": true,
    "greeting_message": "Hello! How can we help?",
    "enable_email_collect": true,
    "csat_survey_enabled": true,
    "enable_auto_assignment": true,
    "working_hours_enabled": true,
    "out_of_office_message": "We're offline, will reply soon",
    "timezone": "America/New_York",
    "allow_messages_after_resolved": false,
    "lock_to_single_conversation": true,
    "sender_name_type": "friendly",
    "business_name": "Acme Support",
    "channel": {
      "id": 1,
      "type": "web_widget",
      "website_url": "https://acme.com",
      "widget_color": "#1f93ff",
      "welcome_title": "Welcome to Acme!",
      "welcome_tagline": "We're here to help",
      "hmac_mandatory": false,
      "pre_chat_form_enabled": false
    }
  },
  {
    "id": 2,
    "name": "Support Email",
    "channel_type": "Channel::Email",
    "channel": {
      "id": 2,
      "type": "email",
      "email": "support@acme.com",
      "forward_to_email": "support@acme.com",
      "imap_enabled": true,
      "smtp_enabled": true
    }
  }
]
```

**Channel Types**:
- `Channel::WebWidget` - Website live chat
- `Channel::Email` - Email inbox
- `Channel::Api` - API channel
- `Channel::FacebookPage` - Facebook Messenger
- `Channel::Instagram` - Instagram DM
- `Channel::Whatsapp` - WhatsApp Business
- `Channel::Telegram` - Telegram
- `Channel::Line` - LINE
- `Channel::Sms` - SMS/Twilio

---

### 38. Get Inbox Details

**Endpoint**: `GET /api/v1/accounts/:account_id/inboxes/:id`
**Controller**: `Api::V1::Accounts::InboxesController#show`
**Authentication**: Required
**Description**: Retrieves detailed information about a specific inbox.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Website Chat",
  "channel_type": "Channel::WebWidget",
  "avatar_url": "https://example.com/avatar.png",
  "greeting_enabled": true,
  "greeting_message": "Hello! How can we help?",
  "working_hours": [
    {
      "day_of_week": 1,
      "closed_all_day": false,
      "open_hour": 9,
      "open_minutes": 0,
      "close_hour": 17,
      "close_minutes": 0
    }
  ],
  "channel": {
    "id": 1,
    "type": "web_widget",
    "website_url": "https://acme.com",
    "widget_color": "#1f93ff",
    "hmac_token": "token_here",
    "selected_feature_flags": ["attachments", "emoji_picker"]
  }
}
```

---

### 39. Create Inbox

**Endpoint**: `POST /api/v1/accounts/:account_id/inboxes`
**Controller**: `Api::V1::Accounts::InboxesController#create`
**Authentication**: Required (Admin)
**Description**: Creates a new inbox.

**Request Body (Website Chat)**:
```json
{
  "name": "Website Chat",
  "avatar": null,
  "greeting_enabled": true,
  "greeting_message": "Hello! How can we help?",
  "enable_email_collect": true,
  "csat_survey_enabled": true,
  "enable_auto_assignment": true,
  "channel": {
    "type": "web_widget",
    "website_url": "https://mysite.com",
    "widget_color": "#1f93ff",
    "welcome_title": "Welcome!",
    "welcome_tagline": "We're here to help",
    "hmac_mandatory": false
  }
}
```

**Request Body (Email Inbox)**:
```json
{
  "name": "Support Email",
  "channel": {
    "type": "email",
    "email": "support@mycompany.com",
    "imap_enabled": true,
    "imap_address": "imap.gmail.com",
    "imap_port": 993,
    "imap_login": "support@mycompany.com",
    "imap_password": "password",
    "smtp_enabled": true,
    "smtp_address": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_login": "support@mycompany.com",
    "smtp_password": "password"
  }
}
```

**Request Body (API Channel)**:
```json
{
  "name": "Custom API",
  "channel": {
    "type": "api",
    "webhook_url": "https://myapp.com/webhook"
  }
}
```

**Response** (201 Created):
```json
{
  "id": 3,
  "name": "Website Chat",
  "channel_type": "Channel::WebWidget",
  "channel": {
    "id": 3,
    "type": "web_widget",
    "website_token": "widget_token_here"
  }
}
```

**Notes**:
- Validates account inbox limits
- Different channel types have different required attributes

---

### 40. Update Inbox

**Endpoint**: `PUT /api/v1/accounts/:account_id/inboxes/:id`
**Controller**: `Api::V1::Accounts::InboxesController#update`
**Authentication**: Required (Admin)
**Description**: Updates inbox settings.

**Request Body**:
```json
{
  "name": "Updated Inbox Name",
  "greeting_enabled": false,
  "enable_auto_assignment": true,
  "working_hours_enabled": true,
  "timezone": "America/Los_Angeles",
  "csat_survey_enabled": true,
  "csat_config": {
    "display_type": "emoji",
    "message": "How was your experience?",
    "survey_rules": {
      "operator": "contains",
      "values": ["resolved"]
    }
  },
  "channel": {
    "widget_color": "#ff0000"
  }
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Updated Inbox Name",
  "greeting_enabled": false
}
```

---

### 41. Delete Inbox

**Endpoint**: `DELETE /api/v1/accounts/:account_id/inboxes/:id`
**Controller**: `Api::V1::Accounts::InboxesController#destroy`
**Authentication**: Required (Admin)
**Description**: Deletes an inbox permanently.

**Response** (200 OK):
```json
{
  "message": "Inbox deletion initiated"
}
```

**Notes**:
- Deletion is asynchronous (background job)
- Deletes all conversations, messages, and contacts associated with inbox

---

### 42. Get Assignable Agents (Deprecated)

**Endpoint**: `GET /api/v1/accounts/:account_id/inboxes/:id/assignable_agents`
**Controller**: `Api::V1::Accounts::InboxesController#assignable_agents`
**Authentication**: Required
**Description**: Lists agents who can be assigned to this inbox.

**Response** (200 OK):
```json
[
  {
    "id": 2,
    "name": "Agent Jane",
    "email": "jane@company.com",
    "availability": "online"
  }
]
```

**Notes**:
- Deprecated, will be removed in v2.7.0
- Use `/api/v1/accounts/:account_id/assignable_agents` instead

---

### 43. Get Inbox Campaigns

**Endpoint**: `GET /api/v1/accounts/:account_id/inboxes/:id/campaigns`
**Controller**: `Api::V1::Accounts::InboxesController#campaigns`
**Authentication**: Required
**Description**: Lists campaigns associated with this inbox.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Welcome Campaign",
    "description": "Greet new visitors",
    "enabled": true,
    "trigger_rules": {
      "time_on_page": 30
    }
  }
]
```

---

### 44. Get Agent Bot

**Endpoint**: `GET /api/v1/accounts/:account_id/inboxes/:id/agent_bot`
**Controller**: `Api::V1::Accounts::InboxesController#agent_bot`
**Authentication**: Required
**Description**: Gets the agent bot assigned to this inbox.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Support Bot",
  "description": "Automated support assistant",
  "outgoing_url": "https://bot.example.com/webhook"
}
```

**Response (No Bot)**:
```json
null
```

---

### 45. Set Agent Bot

**Endpoint**: `POST /api/v1/accounts/:account_id/inboxes/:id/set_agent_bot`
**Controller**: `Api::V1::Accounts::InboxesController#set_agent_bot`
**Authentication**: Required (Admin)
**Description**: Assigns or removes an agent bot from the inbox.

**Request Body (Assign Bot)**:
```json
{
  "agent_bot": 1
}
```

**Request Body (Remove Bot)**:
```json
{
  "agent_bot": null
}
```

**Response** (200 OK):
```
(Empty response body)
```

**Use Case for AI**: Configure AI bot for inbox automation

---

### 46. Delete Inbox Avatar

**Endpoint**: `DELETE /api/v1/accounts/:account_id/inboxes/:id/avatar`
**Controller**: `Api::V1::Accounts::InboxesController#avatar`
**Authentication**: Required (Admin)
**Description**: Removes the inbox avatar image.

**Response** (200 OK):
```
(Empty response body)
```

---

### 47. Sync WhatsApp Templates

**Endpoint**: `POST /api/v1/accounts/:account_id/inboxes/:id/sync_templates`
**Controller**: `Api::V1::Accounts::InboxesController#sync_templates`
**Authentication**: Required (Admin)
**Description**: Syncs WhatsApp message templates from Meta.

**Response** (200 OK):
```json
{
  "message": "Template sync initiated successfully"
}
```

**Error Response** (422):
```json
{
  "error": "Template sync is only available for WhatsApp channels"
}
```

**Notes**:
- Only for WhatsApp Business API inboxes
- Sync is asynchronous (background job)
- Fetches approved templates from Meta

---

## 🌐 Public API - Conversations & Messages

**Base Path**: `/public/api/v1`
**Authentication**: Contact-based (via contact identifier)

These endpoints are for public-facing contact interactions (widget, mobile app).

### 48. Create Public Contact

**Endpoint**: `POST /public/api/v1/inboxes/:inbox_id/contacts`
**Description**: Creates or retrieves a contact for public conversations.

**Request Body**:
```json
{
  "identifier": "unique_identifier",
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+1234567890",
  "custom_attributes": {
    "source": "mobile_app"
  }
}
```

**Response** (201 Created):
```json
{
  "id": 15,
  "source_id": "contact_source_id",
  "pubsub_token": "public_token_here",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### 49. Get Public Contact

**Endpoint**: `GET /public/api/v1/inboxes/:inbox_id/contacts/:id`
**Description**: Retrieves contact information.

**Response** (200 OK):
```json
{
  "id": 15,
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.png",
  "pubsub_token": "public_token_here"
}
```

---

### 50. List Public Conversations

**Endpoint**: `GET /public/api/v1/inboxes/:inbox_id/contacts/:contact_id/conversations`
**Description**: Lists all conversations for a contact.

**Response** (200 OK):
```json
[
  {
    "id": 100,
    "inbox_id": 1,
    "status": "open",
    "messages": [...]
  }
]
```

---

### 51. Create Public Conversation

**Endpoint**: `POST /public/api/v1/inboxes/:inbox_id/contacts/:contact_id/conversations`
**Description**: Starts a new conversation from the public widget/app.

**Request Body**:
```json
{
  "contact_id": 15,
  "message": {
    "content": "Hello, I need help",
    "timestamp": "2025-01-06T10:00:00Z"
  }
}
```

**Response** (201 Created):
```json
{
  "id": 105,
  "inbox_id": 1,
  "status": "open",
  "messages": [...]
}
```

---

### 52. Get Public Conversation

**Endpoint**: `GET /public/api/v1/inboxes/:inbox_id/contacts/:contact_id/conversations/:id`
**Description**: Gets conversation details.

**Response** (200 OK):
```json
{
  "id": 105,
  "status": "open",
  "messages": [...],
  "agent": {...}
}
```

---

### 53. List Public Messages

**Endpoint**: `GET /public/api/v1/inboxes/:inbox_id/contacts/:contact_id/conversations/:conversation_id/messages`
**Description**: Lists messages in a public conversation.

**Response** (200 OK):
```json
[
  {
    "id": 600,
    "content": "Hello, I need help",
    "message_type": "incoming",
    "created_at": "2025-01-06T10:00:00Z"
  }
]
```

---

### 54. Create Public Message

**Endpoint**: `POST /public/api/v1/inboxes/:inbox_id/contacts/:contact_id/conversations/:conversation_id/messages`
**Description**: Sends a message from the contact.

**Request Body**:
```json
{
  "content": "My order number is 12345",
  "timestamp": "2025-01-06T10:01:00Z"
}
```

**Response** (201 Created):
```json
{
  "id": 601,
  "content": "My order number is 12345",
  "message_type": "incoming",
  "created_at": "2025-01-06T10:01:00Z"
}
```

---

## 🎯 AI Agent Use Cases

### Recommended Endpoints for AI Integration

#### 1. **Conversation Management**
- `GET /api/v1/accounts/:account_id/conversations` - Monitor active conversations
- `POST /api/v1/accounts/:account_id/conversations/filter` - Find conversations by criteria
- `POST /api/v1/accounts/:account_id/conversations/:id/toggle_status` - Auto-resolve
- `POST /api/v1/accounts/:account_id/conversations/:id/custom_attributes` - Tag with metadata

#### 2. **Intelligent Messaging**
- `POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages` - Send AI responses
- `POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages/:id/translate` - Multi-language
- `GET /api/v1/accounts/:account_id/conversations/:id/attachments` - Analyze files

#### 3. **Smart Routing**
- `POST /api/v1/accounts/:account_id/conversations/:conversation_id/assignments` - Assign to agents
- `POST /api/v1/accounts/:account_id/conversations/:conversation_id/labels` - Auto-categorize
- `POST /api/v1/accounts/:account_id/conversations/:id/toggle_priority` - Priority detection

#### 4. **Inbox Management**
- `GET /api/v1/accounts/:account_id/inboxes` - List all channels
- `POST /api/v1/accounts/:account_id/inboxes/:id/set_agent_bot` - Configure AI bot
- `GET /api/v1/accounts/:account_id/inboxes/:id/agent_bot` - Get bot config

#### 5. **Draft & Typing**
- `PUT /api/v1/accounts/:account_id/conversations/:conversation_id/draft_messages` - Save drafts
- `POST /api/v1/accounts/:account_id/conversations/:id/toggle_typing_status` - Show typing

#### 6. **Real-time Updates**
- Use WebSocket RoomChannel (from Part 1) to listen for new conversations/messages
- React to `message.created` and `conversation.created` events

---

## 📝 Notes

### Performance Tips
- Use `meta` endpoint for counts only (faster than full index)
- Implement pagination for large result sets
- Use WebSocket for real-time instead of polling
- Cache inbox and agent lists

### Message Best Practices
- Always set appropriate `message_type` (incoming/outgoing)
- Use `private: true` for internal notes
- Pre-upload attachments via `direct_uploads`
- Handle async message delivery (check status)

### Conversation Lifecycle
1. **Open** - Active conversation
2. **Pending** - Waiting for customer response
3. **Snoozed** - Temporarily hidden
4. **Resolved** - Closed/completed

### Error Handling
- 403 Forbidden - No access to inbox/conversation
- 404 Not Found - Conversation doesn't exist
- 422 Unprocessable Entity - Validation errors
- 500 Internal Server Error - Server issues

---

## 📚 Related Documentation

This is **Part 2 of 4** in the Chatwoot API documentation series.

**Previous**: Part 1/4 - Accounts, Users, and Contacts
**Coming Next**:
- Part 3/4: Teams, Reports, Webhooks, Automation
- Part 4/4: Integrations, Advanced Features, WebSocket Events

---

**Generated**: 2025-01-06
**Chatwoot Version**: Latest (as of documentation date)
**API Version**: v1, Public API v1
