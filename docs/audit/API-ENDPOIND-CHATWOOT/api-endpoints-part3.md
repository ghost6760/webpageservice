# Chatwoot API Documentation - Part 3/4
## Teams, Reports, Webhooks, and Automation

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Teams API](#teams-api)
3. [Reports API](#reports-api)
4. [Webhooks API](#webhooks-api)
5. [Automation Rules API](#automation-rules-api)
6. [Macros API](#macros-api)
7. [Campaigns API](#campaigns-api)
8. [Labels API](#labels-api)
9. [Canned Responses API](#canned-responses-api)
10. [Notifications API](#notifications-api)
11. [CSAT Survey Responses API](#csat-survey-responses-api)

---

## 🌟 Overview

This document covers advanced features and automation capabilities in Chatwoot:
- **Teams**: Organize agents into teams for better collaboration
- **Reports**: Analytics and metrics for performance tracking
- **Webhooks**: Real-time event notifications to external systems
- **Automation**: Rules and macros for workflow automation
- **Campaigns**: Proactive messaging campaigns
- **CSAT**: Customer satisfaction surveys and metrics

**Base Path**: `/api/v1/accounts/:account_id` (v1) or `/api/v2/accounts/:account_id` (v2 for reports)

**Authentication**: All endpoints require authentication unless specified otherwise.

---

## 👥 Teams API

**Base Path**: `/api/v1/accounts/:account_id/teams`
**Controller**: `Api::V1::Accounts::TeamsController`

Teams help organize agents into groups for better workload distribution and reporting.

### 1. List Teams

**Endpoint**: `GET /api/v1/accounts/:account_id/teams`
**Controller**: `Api::V1::Accounts::TeamsController#index`
**Authentication**: Required
**Description**: Lists all teams in the account.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Support Team",
    "description": "Handles customer support inquiries",
    "allow_auto_assign": true,
    "account_id": 1,
    "is_member": true,
    "created_at": "2024-12-01T08:00:00Z",
    "updated_at": "2025-01-06T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Sales Team",
    "description": "Manages sales conversations",
    "allow_auto_assign": false,
    "account_id": 1,
    "is_member": false,
    "created_at": "2024-12-01T08:00:00Z"
  }
]
```

---

### 2. Get Team Details

**Endpoint**: `GET /api/v1/accounts/:account_id/teams/:id`
**Controller**: `Api::V1::Accounts::TeamsController#show`
**Authentication**: Required
**Description**: Retrieves details of a specific team.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Support Team",
  "description": "Handles customer support inquiries",
  "allow_auto_assign": true,
  "account_id": 1,
  "is_member": true,
  "created_at": "2024-12-01T08:00:00Z",
  "updated_at": "2025-01-06T10:00:00Z"
}
```

---

### 3. Create Team

**Endpoint**: `POST /api/v1/accounts/:account_id/teams`
**Controller**: `Api::V1::Accounts::TeamsController#create`
**Authentication**: Required (Admin)
**Description**: Creates a new team.

**Request Body**:
```json
{
  "team": {
    "name": "VIP Support Team",
    "description": "Dedicated team for VIP customers",
    "allow_auto_assign": true
  }
}
```

**Response** (201 Created):
```json
{
  "id": 3,
  "name": "VIP Support Team",
  "description": "Dedicated team for VIP customers",
  "allow_auto_assign": true,
  "account_id": 1,
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Notes**:
- `allow_auto_assign`: Enables automatic conversation assignment to team members

---

### 4. Update Team

**Endpoint**: `PUT /api/v1/accounts/:account_id/teams/:id`
**Controller**: `Api::V1::Accounts::TeamsController#update`
**Authentication**: Required (Admin)
**Description**: Updates team information.

**Request Body**:
```json
{
  "team": {
    "name": "Updated Support Team",
    "description": "New description",
    "allow_auto_assign": false
  }
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Updated Support Team",
  "description": "New description",
  "allow_auto_assign": false
}
```

---

### 5. Delete Team

**Endpoint**: `DELETE /api/v1/accounts/:account_id/teams/:id`
**Controller**: `Api::V1::Accounts::TeamsController#destroy`
**Authentication**: Required (Admin)
**Description**: Deletes a team.

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Team members are not deleted, only team association is removed
- Conversations assigned to team remain but team reference is cleared

---

## 👤 Team Members API

**Base Path**: `/api/v1/accounts/:account_id/teams/:team_id/team_members`
**Controller**: `Api::V1::Accounts::TeamMembersController`

### 6. List Team Members

**Endpoint**: `GET /api/v1/accounts/:account_id/teams/:team_id/team_members`
**Controller**: `Api::V1::Accounts::TeamMembersController#index`
**Authentication**: Required
**Description**: Lists all members of a team.

**Response** (200 OK):
```json
[
  {
    "id": 2,
    "name": "Agent Jane",
    "email": "jane@company.com",
    "avatar": "https://example.com/avatar.png",
    "availability": "online",
    "role": "agent"
  },
  {
    "id": 3,
    "name": "Agent Bob",
    "email": "bob@company.com",
    "availability": "busy",
    "role": "agent"
  }
]
```

---

### 7. Add Team Members

**Endpoint**: `POST /api/v1/accounts/:account_id/teams/:team_id/team_members`
**Controller**: `Api::V1::Accounts::TeamMembersController#create`
**Authentication**: Required (Admin)
**Description**: Adds agents to the team.

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
    "id": 2,
    "name": "Agent Jane",
    "email": "jane@company.com"
  },
  {
    "id": 3,
    "name": "Agent Bob",
    "email": "bob@company.com"
  },
  {
    "id": 4,
    "name": "Agent Alice",
    "email": "alice@company.com"
  }
]
```

**Notes**:
- Only adds members not already in the team
- Validates that all user IDs belong to the account

---

### 8. Update Team Members

**Endpoint**: `PATCH /api/v1/accounts/:account_id/teams/:team_id/team_members`
**Controller**: `Api::V1::Accounts::TeamMembersController#update`
**Authentication**: Required (Admin)
**Description**: Replaces team member list (adds new, removes missing).

**Request Body**:
```json
{
  "user_ids": [2, 5, 6]
}
```

**Response** (200 OK):
```json
[
  {
    "id": 2,
    "name": "Agent Jane"
  },
  {
    "id": 5,
    "name": "Agent Charlie"
  },
  {
    "id": 6,
    "name": "Agent Dana"
  }
]
```

**Notes**:
- Removes users not in the new list
- Adds users not currently in the team

---

### 9. Remove Team Members

**Endpoint**: `DELETE /api/v1/accounts/:account_id/teams/:team_id/team_members`
**Controller**: `Api::V1::Accounts::TeamMembersController#destroy`
**Authentication**: Required (Admin)
**Description**: Removes specific members from the team.

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

## 📊 Reports API

**Base Path**: `/api/v2/accounts/:account_id/reports`
**Controller**: `Api::V2::Accounts::ReportsController`

Advanced analytics and reporting for performance tracking.

### 10. Get Conversation Reports (Timeseries)

**Endpoint**: `GET /api/v2/accounts/:account_id/reports`
**Controller**: `Api::V2::Accounts::ReportsController#index`
**Authentication**: Required
**Description**: Returns time-series conversation metrics.

**Query Parameters**:
- `type` - Report type: `account`, `agent`, `inbox`, `label`, `team`
- `id` - Entity ID (agent_id, inbox_id, etc.) - optional for `account` type
- `metric` - Metric to track: `conversations_count`, `incoming_messages_count`, `outgoing_messages_count`, `avg_first_response_time`, `avg_resolution_time`, `resolutions_count`
- `since` - Start timestamp (Unix)
- `until` - End timestamp (Unix)
- `timezone_offset` - Timezone offset in seconds
- `group_by` - Grouping: `day`, `week`, `month`, `year`
- `business_hours` - Filter by business hours: `true`/`false`

**Example Request**:
```
GET /api/v2/accounts/1/reports?type=account&metric=conversations_count&since=1704067200&until=1706745600&group_by=day
```

**Response** (200 OK):
```json
[
  {
    "timestamp": 1704067200,
    "value": 45
  },
  {
    "timestamp": 1704153600,
    "value": 52
  },
  {
    "timestamp": 1704240000,
    "value": 38
  }
]
```

**Available Metrics**:
- `conversations_count` - Total conversations
- `incoming_messages_count` - Messages from contacts
- `outgoing_messages_count` - Messages from agents
- `avg_first_response_time` - Average time to first response (seconds)
- `avg_resolution_time` - Average time to resolution (seconds)
- `resolutions_count` - Number of resolved conversations

---

### 11. Get Summary Report

**Endpoint**: `GET /api/v2/accounts/:account_id/reports/summary`
**Controller**: `Api::V2::Accounts::ReportsController#summary`
**Authentication**: Required
**Description**: Returns aggregated metrics summary with comparison to previous period.

**Query Parameters**:
- `type` - Report type: `account`, `agent`, `inbox`, `label`, `team`
- `id` - Entity ID (if applicable)
- `since` - Start timestamp (Unix)
- `until` - End timestamp (Unix)
- `timezone_offset` - Timezone offset in seconds
- `business_hours` - Filter by business hours: `true`/`false`

**Example Request**:
```
GET /api/v2/accounts/1/reports/summary?type=account&since=1704067200&until=1706745600
```

**Response** (200 OK):
```json
{
  "conversations_count": 450,
  "incoming_messages_count": 1250,
  "outgoing_messages_count": 1180,
  "avg_first_response_time": 320.5,
  "avg_resolution_time": 3600.2,
  "resolutions_count": 380,
  "previous": {
    "conversations_count": 420,
    "incoming_messages_count": 1100,
    "outgoing_messages_count": 1050,
    "avg_first_response_time": 420.8,
    "avg_resolution_time": 4200.5,
    "resolutions_count": 350
  }
}
```

**Notes**:
- `previous` contains metrics for the previous period of equal length
- All time values in seconds

---

### 12. Get Bot Summary

**Endpoint**: `GET /api/v2/accounts/:account_id/reports/bot_summary`
**Controller**: `Api::V2::Accounts::ReportsController#bot_summary`
**Authentication**: Required
**Description**: Returns bot-specific metrics.

**Query Parameters**: Same as Summary Report

**Response** (200 OK):
```json
{
  "bot_resolutions_count": 85,
  "bot_handoffs_count": 42,
  "previous": {
    "bot_resolutions_count": 72,
    "bot_handoffs_count": 38
  }
}
```

---

### 13. Get Agent Report

**Endpoint**: `GET /api/v2/accounts/:account_id/reports/agents`
**Controller**: `Api::V2::Accounts::ReportsController#agents`
**Authentication**: Required
**Description**: Returns CSV report of agent performance metrics.

**Query Parameters**:
- `since` - Start timestamp (Unix)
- `until` - End timestamp (Unix)
- `business_hours` - Filter by business hours: `true`/`false`

**Response** (200 OK):
```csv
Agent Name,Email,Conversations,Incoming Messages,Outgoing Messages,First Response Time,Resolution Time,Resolutions
Agent Jane,jane@company.com,45,120,115,250.5,3200.8,40
Agent Bob,bob@company.com,38,95,90,380.2,4100.3,32
```

**Content-Type**: `text/csv`

---

### 14. Get Inbox Report

**Endpoint**: `GET /api/v2/accounts/:account_id/reports/inboxes`
**Controller**: `Api::V2::Accounts::ReportsController#inboxes`
**Authentication**: Required
**Description**: Returns CSV report of inbox metrics.

**Response** (200 OK):
```csv
Inbox Name,Type,Conversations,Incoming Messages,Outgoing Messages,First Response Time,Resolution Time,Resolutions
Website Chat,web_widget,85,220,210,180.5,2800.2,75
Support Email,email,60,150,145,520.8,5200.6,50
```

**Content-Type**: `text/csv`

---

### 15. Get Label Report

**Endpoint**: `GET /api/v2/accounts/:account_id/reports/labels`
**Controller**: `Api::V2::Accounts::ReportsController#labels`
**Authentication**: Required
**Description**: Returns CSV report of label metrics.

**Response** (200 OK):
```csv
Label,Conversations,Incoming Messages,Outgoing Messages,First Response Time,Resolution Time,Resolutions
urgent,25,65,62,120.3,1800.5,22
billing,18,45,43,200.8,2400.2,15
```

**Content-Type**: `text/csv`

---

### 16. Get Team Report

**Endpoint**: `GET /api/v2/accounts/:account_id/reports/teams`
**Controller**: `Api::V2::Accounts::ReportsController#teams`
**Authentication**: Required
**Description**: Returns CSV report of team performance.

**Response** (200 OK):
```csv
Team Name,Conversations,Incoming Messages,Outgoing Messages,First Response Time,Resolution Time,Resolutions
Support Team,120,310,295,220.5,3100.8,105
Sales Team,95,240,230,180.2,2800.5,88
```

**Content-Type**: `text/csv`

---

### 17. Get Conversation Traffic (Heatmap)

**Endpoint**: `GET /api/v2/accounts/:account_id/reports/conversation_traffic`
**Controller**: `Api::V2::Accounts::ReportsController#conversation_traffic`
**Authentication**: Required
**Description**: Returns CSV heatmap of conversation traffic by hour and day.

**Query Parameters**:
- `since` - Start timestamp (Unix)
- `until` - End timestamp (Unix)
- `timezone_offset` - Timezone offset in hours

**Response** (200 OK):
```csv
Day,00:00,01:00,02:00,03:00,...,23:00
Monday,5,2,1,0,...,8
Tuesday,6,3,2,1,...,10
Wednesday,8,4,2,0,...,12
```

**Content-Type**: `text/csv`

**Use Case for AI**: Identify peak hours for staffing optimization

---

### 18. Get Conversation Metrics

**Endpoint**: `GET /api/v2/accounts/:account_id/reports/conversations`
**Controller**: `Api::V2::Accounts::ReportsController#conversations`
**Authentication**: Required
**Description**: Returns paginated list of conversations with metrics.

**Query Parameters**:
- `type` - Conversation type: `open`, `resolved`, `all`
- `user_id` - Filter by agent ID
- `page` - Page number

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 100,
      "display_id": 100,
      "status": "resolved",
      "created_at": "2025-01-06T10:00:00Z",
      "first_response_time": 180,
      "resolution_time": 2400,
      "messages_count": 12,
      "assignee": {
        "id": 2,
        "name": "Agent Jane"
      }
    }
  ],
  "meta": {
    "total": 450,
    "page": 1,
    "per_page": 20
  }
}
```

---

### 19. Get Bot Metrics

**Endpoint**: `GET /api/v2/accounts/:account_id/reports/bot_metrics`
**Controller**: `Api::V2::Accounts::ReportsController#bot_metrics`
**Authentication**: Required
**Description**: Returns detailed bot performance metrics.

**Query Parameters**:
- `since` - Start timestamp (Unix)
- `until` - End timestamp (Unix)

**Response** (200 OK):
```json
{
  "bot_conversations": 120,
  "bot_resolutions": 85,
  "bot_handoffs": 35,
  "avg_bot_resolution_time": 1200.5,
  "handoff_rate": 0.29,
  "resolution_rate": 0.71
}
```

**Use Case for AI**: Track AI bot effectiveness and handoff patterns

---

## 🪝 Webhooks API

**Base Path**: `/api/v1/accounts/:account_id/webhooks`
**Controller**: `Api::V1::Accounts::WebhooksController`

Configure webhooks to receive real-time event notifications.

### 20. List Webhooks

**Endpoint**: `GET /api/v1/accounts/:account_id/webhooks`
**Controller**: `Api::V1::Accounts::WebhooksController#index`
**Authentication**: Required
**Description**: Lists all configured webhooks.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "url": "https://myapp.com/chatwoot/webhook",
    "inbox_id": null,
    "subscriptions": [
      "conversation_created",
      "conversation_status_changed",
      "message_created"
    ],
    "created_at": "2024-12-01T08:00:00Z"
  },
  {
    "id": 2,
    "url": "https://analytics.com/events",
    "inbox_id": 1,
    "subscriptions": [
      "message_created",
      "conversation_resolved"
    ],
    "created_at": "2024-12-15T10:00:00Z"
  }
]
```

---

### 21. Create Webhook

**Endpoint**: `POST /api/v1/accounts/:account_id/webhooks`
**Controller**: `Api::V1::Accounts::WebhooksController#create`
**Authentication**: Required (Admin)
**Description**: Creates a new webhook subscription.

**Request Body**:
```json
{
  "webhook": {
    "url": "https://myapp.com/chatwoot/webhook",
    "inbox_id": null,
    "subscriptions": [
      "conversation_created",
      "conversation_status_changed",
      "message_created",
      "message_updated",
      "conversation_resolved"
    ]
  }
}
```

**Available Event Subscriptions**:
- `conversation_created` - New conversation started
- `conversation_updated` - Conversation details changed
- `conversation_status_changed` - Status changed (open/resolved/pending)
- `conversation_resolved` - Conversation marked as resolved
- `message_created` - New message sent/received
- `message_updated` - Message edited or status changed
- `contact_created` - New contact created
- `contact_updated` - Contact information updated

**Response** (201 Created):
```json
{
  "id": 3,
  "url": "https://myapp.com/chatwoot/webhook",
  "inbox_id": null,
  "subscriptions": [
    "conversation_created",
    "conversation_status_changed",
    "message_created",
    "message_updated",
    "conversation_resolved"
  ],
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Notes**:
- `inbox_id` is optional - if null, webhook applies to all inboxes
- Set `inbox_id` to filter events for specific inbox only

**Webhook Payload Format**:
```json
{
  "event": "conversation_created",
  "account": {
    "id": 1,
    "name": "Acme Corp"
  },
  "inbox": {
    "id": 1,
    "name": "Website Chat"
  },
  "conversation": {
    "id": 100,
    "display_id": 100,
    "status": "open",
    "contact": {...},
    "assignee": {...}
  },
  "message": {...},
  "sender": {...}
}
```

**Use Case for AI**:
- Real-time event processing
- External system integration
- Analytics tracking
- Trigger external workflows

---

### 22. Update Webhook

**Endpoint**: `PUT /api/v1/accounts/:account_id/webhooks/:id`
**Controller**: `Api::V1::Accounts::WebhooksController#update`
**Authentication**: Required (Admin)
**Description**: Updates webhook configuration.

**Request Body**:
```json
{
  "webhook": {
    "url": "https://newapp.com/webhook",
    "subscriptions": [
      "message_created",
      "conversation_resolved"
    ]
  }
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "url": "https://newapp.com/webhook",
  "subscriptions": [
    "message_created",
    "conversation_resolved"
  ]
}
```

---

### 23. Delete Webhook

**Endpoint**: `DELETE /api/v1/accounts/:account_id/webhooks/:id`
**Controller**: `Api::V1::Accounts::WebhooksController#destroy`
**Authentication**: Required (Admin)
**Description**: Deletes a webhook.

**Response** (200 OK):
```
(Empty response body)
```

---

## 🤖 Automation Rules API

**Base Path**: `/api/v1/accounts/:account_id/automation_rules`
**Controller**: `Api::V1::Accounts::AutomationRulesController`

Automate repetitive tasks with conditional rules.

### 24. List Automation Rules

**Endpoint**: `GET /api/v1/accounts/:account_id/automation_rules`
**Controller**: `Api::V1::Accounts::AutomationRulesController#index`
**Authentication**: Required
**Description**: Lists all automation rules.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Auto-assign urgent conversations",
    "description": "Automatically assign urgent labeled conversations to senior agents",
    "event_name": "conversation_created",
    "active": true,
    "conditions": [
      {
        "attribute_key": "status",
        "filter_operator": "equal_to",
        "values": ["open"],
        "query_operator": "and"
      },
      {
        "attribute_key": "labels",
        "filter_operator": "contains",
        "values": ["urgent"],
        "query_operator": "and"
      }
    ],
    "actions": [
      {
        "action_name": "assign_agent",
        "action_params": [2]
      },
      {
        "action_name": "add_label",
        "action_params": ["auto-assigned"]
      }
    ],
    "created_at": "2024-12-01T08:00:00Z"
  }
]
```

---

### 25. Get Automation Rule Details

**Endpoint**: `GET /api/v1/accounts/:account_id/automation_rules/:id`
**Controller**: `Api::V1::Accounts::AutomationRulesController#show`
**Authentication**: Required
**Description**: Retrieves details of a specific automation rule.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Auto-assign urgent conversations",
  "description": "Automatically assign urgent labeled conversations to senior agents",
  "event_name": "conversation_created",
  "active": true,
  "conditions": [...],
  "actions": [...]
}
```

---

### 26. Create Automation Rule

**Endpoint**: `POST /api/v1/accounts/:account_id/automation_rules`
**Controller**: `Api::V1::Accounts::AutomationRulesController#create`
**Authentication**: Required (Admin)
**Description**: Creates a new automation rule.

**Request Body**:
```json
{
  "name": "Auto-resolve spam",
  "description": "Automatically resolve conversations tagged as spam",
  "event_name": "conversation_updated",
  "active": true,
  "conditions": [
    {
      "attribute_key": "labels",
      "filter_operator": "contains",
      "values": ["spam"],
      "query_operator": "and"
    }
  ],
  "actions": [
    {
      "action_name": "resolve_conversation",
      "action_params": []
    },
    {
      "action_name": "send_message",
      "action_params": ["This conversation has been marked as spam and resolved."]
    }
  ]
}
```

**Available Event Names**:
- `conversation_created` - When new conversation starts
- `conversation_updated` - When conversation is modified
- `conversation_opened` - When conversation reopened
- `message_created` - When new message arrives

**Available Condition Operators**:
- `equal_to`, `not_equal_to`
- `contains`, `does_not_contain`
- `is_present`, `is_not_present`
- `is_greater_than`, `is_less_than`

**Available Actions**:
- `assign_agent` - Assign to specific agent
- `assign_team` - Assign to team
- `add_label` - Add labels
- `remove_label` - Remove labels
- `send_message` - Send automated message
- `send_email_to_team` - Notify team via email
- `send_attachment` - Send file attachment
- `mute_conversation` - Mute notifications
- `snooze_conversation` - Snooze until date
- `resolve_conversation` - Mark as resolved
- `change_priority` - Update priority
- `send_webhook_event` - Trigger webhook

**Response** (201 Created):
```json
{
  "id": 2,
  "name": "Auto-resolve spam",
  "event_name": "conversation_updated",
  "active": true,
  "conditions": [...],
  "actions": [...]
}
```

**Use Case for AI**:
- Auto-categorization based on AI analysis
- Intelligent routing
- Spam detection
- Priority escalation
- SLA enforcement

---

### 27. Update Automation Rule

**Endpoint**: `PUT /api/v1/accounts/:account_id/automation_rules/:id`
**Controller**: `Api::V1::Accounts::AutomationRulesController#update`
**Authentication**: Required (Admin)
**Description**: Updates an automation rule.

**Request Body**:
```json
{
  "name": "Updated rule name",
  "active": false,
  "conditions": [...],
  "actions": [...]
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Updated rule name",
  "active": false
}
```

---

### 28. Delete Automation Rule

**Endpoint**: `DELETE /api/v1/accounts/:account_id/automation_rules/:id`
**Controller**: `Api::V1::Accounts::AutomationRulesController#destroy`
**Authentication**: Required (Admin)
**Description**: Deletes an automation rule.

**Response** (200 OK):
```
(Empty response body)
```

---

### 29. Clone Automation Rule

**Endpoint**: `POST /api/v1/accounts/:account_id/automation_rules/:id/clone`
**Controller**: `Api::V1::Accounts::AutomationRulesController#clone`
**Authentication**: Required (Admin)
**Description**: Creates a duplicate of an existing rule.

**Request Body**:
```json
{
  "automation_rule_id": 1
}
```

**Response** (201 Created):
```json
{
  "id": 5,
  "name": "Auto-assign urgent conversations",
  "description": "Automatically assign urgent labeled conversations to senior agents",
  "event_name": "conversation_created",
  "active": true,
  "conditions": [...],
  "actions": [...]
}
```

---

## ⚡ Macros API

**Base Path**: `/api/v1/accounts/:account_id/macros`
**Controller**: `Api::V1::Accounts::MacrosController`

Pre-defined action sequences for quick execution by agents.

### 30. List Macros

**Endpoint**: `GET /api/v1/accounts/:account_id/macros`
**Controller**: `Api::V1::Accounts::MacrosController#index`
**Authentication**: Required
**Description**: Lists all macros visible to the current user.

**Query Parameters**:
- `visibility` - Filter by visibility: `global`, `personal`

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Close with satisfaction survey",
    "visibility": "global",
    "created_by": {
      "id": 1,
      "name": "Admin User"
    },
    "actions": [
      {
        "action_name": "send_message",
        "action_params": ["Thank you for contacting us! We hope we could help."]
      },
      {
        "action_name": "resolve_conversation",
        "action_params": []
      }
    ],
    "created_at": "2024-12-01T08:00:00Z"
  }
]
```

**Visibility Types**:
- `global` - Available to all agents
- `personal` - Only visible to creator

---

### 31. Get Macro Details

**Endpoint**: `GET /api/v1/accounts/:account_id/macros/:id`
**Controller**: `Api::V1::Accounts::MacrosController#show`
**Authentication**: Required
**Description**: Retrieves details of a specific macro.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Close with satisfaction survey",
  "visibility": "global",
  "actions": [...]
}
```

---

### 32. Create Macro

**Endpoint**: `POST /api/v1/accounts/:account_id/macros`
**Controller**: `Api::V1::Accounts::MacrosController#create`
**Authentication**: Required
**Description**: Creates a new macro.

**Request Body**:
```json
{
  "name": "Escalate to manager",
  "visibility": "global",
  "actions": [
    {
      "action_name": "add_label",
      "action_params": ["escalated"]
    },
    {
      "action_name": "assign_team",
      "action_params": [1]
    },
    {
      "action_name": "send_message",
      "action_params": ["This issue has been escalated to our management team."]
    },
    {
      "action_name": "change_priority",
      "action_params": ["urgent"]
    }
  ]
}
```

**Available Actions** (same as Automation Rules):
- `assign_agent`, `assign_team`
- `add_label`, `remove_label`
- `send_message`, `send_attachment`
- `resolve_conversation`, `snooze_conversation`
- `change_priority`, `mute_conversation`
- `send_email_to_team`, `send_webhook_event`

**Response** (201 Created):
```json
{
  "id": 2,
  "name": "Escalate to manager",
  "visibility": "global",
  "actions": [...],
  "created_by": {
    "id": 2,
    "name": "Agent Jane"
  }
}
```

---

### 33. Update Macro

**Endpoint**: `PUT /api/v1/accounts/:account_id/macros/:id`
**Controller**: `Api::V1::Accounts::MacrosController#update`
**Authentication**: Required
**Description**: Updates a macro.

**Request Body**:
```json
{
  "name": "Updated macro name",
  "visibility": "personal",
  "actions": [...]
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Updated macro name",
  "visibility": "personal"
}
```

---

### 34. Delete Macro

**Endpoint**: `DELETE /api/v1/accounts/:account_id/macros/:id`
**Controller**: `Api::V1::Accounts::MacrosController#destroy`
**Authentication**: Required
**Description**: Deletes a macro.

**Response** (200 OK):
```
(Empty response body)
```

---

### 35. Execute Macro

**Endpoint**: `POST /api/v1/accounts/:account_id/macros/:id/execute`
**Controller**: `Api::V1::Accounts::MacrosController#execute`
**Authentication**: Required
**Description**: Executes a macro on one or more conversations.

**Request Body**:
```json
{
  "conversation_ids": [100, 101, 102]
}
```

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Execution is asynchronous (background job)
- All actions executed in sequence for each conversation
- Useful for bulk operations

**Use Case for AI**:
- Quick response templates
- Standardized workflows
- Bulk conversation management
- Agent productivity enhancement

---

## 📢 Campaigns API

**Base Path**: `/api/v1/accounts/:account_id/campaigns`
**Controller**: `Api::V1::Accounts::CampaignsController`

Proactive messaging campaigns to engage visitors and customers.

### 36. List Campaigns

**Endpoint**: `GET /api/v1/accounts/:account_id/campaigns`
**Controller**: `Api::V1::Accounts::CampaignsController#index`
**Authentication**: Required
**Description**: Lists all campaigns.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "display_id": 1,
    "title": "Welcome to our website",
    "description": "Greet new visitors",
    "message": "Hi there! 👋 Need any help?",
    "enabled": true,
    "trigger_only_during_business_hours": true,
    "inbox": {
      "id": 1,
      "name": "Website Chat"
    },
    "sender": {
      "id": 2,
      "name": "Agent Jane"
    },
    "audience": {
      "type": "all_visitors"
    },
    "trigger_rules": {
      "time_on_page": 30,
      "url": "https://acme.com/pricing"
    },
    "scheduled_at": null,
    "created_at": "2024-12-01T08:00:00Z"
  }
]
```

---

### 37. Get Campaign Details

**Endpoint**: `GET /api/v1/accounts/:account_id/campaigns/:id`
**Controller**: `Api::V1::Accounts::CampaignsController#show`
**Authentication**: Required
**Description**: Retrieves details of a specific campaign.

**Response** (200 OK):
```json
{
  "id": 1,
  "display_id": 1,
  "title": "Welcome to our website",
  "description": "Greet new visitors",
  "message": "Hi there! 👋 Need any help?",
  "enabled": true,
  "trigger_only_during_business_hours": true,
  "inbox_id": 1,
  "sender_id": 2,
  "audience": {
    "type": "all_visitors"
  },
  "trigger_rules": {
    "time_on_page": 30,
    "url": "https://acme.com/pricing"
  },
  "scheduled_at": null
}
```

---

### 38. Create Campaign

**Endpoint**: `POST /api/v1/accounts/:account_id/campaigns`
**Controller**: `Api::V1::Accounts::CampaignsController#create`
**Authentication**: Required (Admin)
**Description**: Creates a new campaign.

**Request Body**:
```json
{
  "campaign": {
    "title": "Cart abandonment reminder",
    "description": "Remind users about items in cart",
    "message": "You have items waiting in your cart. Need help checking out?",
    "enabled": true,
    "trigger_only_during_business_hours": false,
    "inbox_id": 1,
    "sender_id": 2,
    "audience": {
      "type": "filtered",
      "id": 5
    },
    "trigger_rules": {
      "time_on_page": 60,
      "url": "https://acme.com/cart"
    },
    "scheduled_at": null,
    "template_params": {}
  }
}
```

**Audience Types**:
- `all_visitors` - All website visitors
- `filtered` - Specific contact segment (requires segment ID)

**Trigger Rules**:
- `time_on_page` - Seconds on page before trigger
- `url` - Specific URL to trigger on (exact match or pattern)
- `exit_intent` - Trigger on mouse leave (boolean)

**Response** (201 Created):
```json
{
  "id": 2,
  "display_id": 2,
  "title": "Cart abandonment reminder",
  "enabled": true,
  "trigger_rules": {...}
}
```

**Use Case for AI**:
- Proactive customer engagement
- Onboarding flows
- Cart abandonment recovery
- Feature announcements
- Targeted messaging

---

### 39. Update Campaign

**Endpoint**: `PUT /api/v1/accounts/:account_id/campaigns/:id`
**Controller**: `Api::V1::Accounts::CampaignsController#update`
**Authentication**: Required (Admin)
**Description**: Updates a campaign.

**Request Body**:
```json
{
  "campaign": {
    "title": "Updated campaign title",
    "enabled": false,
    "message": "Updated message text"
  }
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Updated campaign title",
  "enabled": false
}
```

---

### 40. Delete Campaign

**Endpoint**: `DELETE /api/v1/accounts/:account_id/campaigns/:id`
**Controller**: `Api::V1::Accounts::CampaignsController#destroy`
**Authentication**: Required (Admin)
**Description**: Deletes a campaign.

**Response** (200 OK):
```
(Empty response body)
```

---

## 🏷️ Labels API

**Base Path**: `/api/v1/accounts/:account_id/labels`
**Controller**: `Api::V1::Accounts::LabelsController`

Organize conversations and contacts with custom labels.

### 41. List Labels

**Endpoint**: `GET /api/v1/accounts/:account_id/labels`
**Controller**: `Api::V1::Accounts::LabelsController#index`
**Authentication**: Required
**Description**: Lists all labels in the account.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "urgent",
    "description": "Urgent priority conversations",
    "color": "#FF0000",
    "show_on_sidebar": true,
    "created_at": "2024-12-01T08:00:00Z"
  },
  {
    "id": 2,
    "title": "billing",
    "description": "Billing related inquiries",
    "color": "#00FF00",
    "show_on_sidebar": true,
    "created_at": "2024-12-01T08:00:00Z"
  }
]
```

---

### 42. Get Label Details

**Endpoint**: `GET /api/v1/accounts/:account_id/labels/:id`
**Controller**: `Api::V1::Accounts::LabelsController#show`
**Authentication**: Required
**Description**: Retrieves details of a specific label.

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "urgent",
  "description": "Urgent priority conversations",
  "color": "#FF0000",
  "show_on_sidebar": true
}
```

---

### 43. Create Label

**Endpoint**: `POST /api/v1/accounts/:account_id/labels`
**Controller**: `Api::V1::Accounts::LabelsController#create`
**Authentication**: Required
**Description**: Creates a new label.

**Request Body**:
```json
{
  "label": {
    "title": "vip-customer",
    "description": "VIP customer conversations",
    "color": "#FFD700",
    "show_on_sidebar": true
  }
}
```

**Response** (201 Created):
```json
{
  "id": 3,
  "title": "vip-customer",
  "description": "VIP customer conversations",
  "color": "#FFD700",
  "show_on_sidebar": true,
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Notes**:
- `color` - Hex color code (e.g., #FF0000)
- `show_on_sidebar` - Display in sidebar filter

---

### 44. Update Label

**Endpoint**: `PUT /api/v1/accounts/:account_id/labels/:id`
**Controller**: `Api::V1::Accounts::LabelsController#update`
**Authentication**: Required
**Description**: Updates a label.

**Request Body**:
```json
{
  "label": {
    "title": "super-urgent",
    "color": "#8B0000",
    "show_on_sidebar": false
  }
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "super-urgent",
  "color": "#8B0000",
  "show_on_sidebar": false
}
```

---

### 45. Delete Label

**Endpoint**: `DELETE /api/v1/accounts/:account_id/labels/:id`
**Controller**: `Api::V1::Accounts::LabelsController#destroy`
**Authentication**: Required
**Description**: Deletes a label.

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Removes label from all conversations and contacts
- Cannot be undone

---

## 💬 Canned Responses API

**Base Path**: `/api/v1/accounts/:account_id/canned_responses`
**Controller**: `Api::V1::Accounts::CannedResponsesController`

Quick response templates for agents.

### 46. List Canned Responses

**Endpoint**: `GET /api/v1/accounts/:account_id/canned_responses`
**Controller**: `Api::V1::Accounts::CannedResponsesController#index`
**Authentication**: Required
**Description**: Lists all canned responses.

**Query Parameters**:
- `search` - Search in short_code or content

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "short_code": "welcome",
    "content": "Hello! Thank you for contacting us. How can we help you today?",
    "account_id": 1,
    "created_at": "2024-12-01T08:00:00Z"
  },
  {
    "id": 2,
    "short_code": "closing",
    "content": "Thank you for reaching out. We're glad we could help! Have a great day!",
    "account_id": 1,
    "created_at": "2024-12-01T08:00:00Z"
  }
]
```

**Example with Search**:
```
GET /api/v1/accounts/1/canned_responses?search=welcome
```

---

### 47. Create Canned Response

**Endpoint**: `POST /api/v1/accounts/:account_id/canned_responses`
**Controller**: `Api::V1::Accounts::CannedResponsesController#create`
**Authentication**: Required
**Description**: Creates a new canned response.

**Request Body**:
```json
{
  "canned_response": {
    "short_code": "refund",
    "content": "I'd be happy to help you with a refund. Could you please provide your order number?"
  }
}
```

**Response** (201 Created):
```json
{
  "id": 3,
  "short_code": "refund",
  "content": "I'd be happy to help you with a refund. Could you please provide your order number?",
  "account_id": 1,
  "created_at": "2025-01-06T10:00:00Z"
}
```

**Notes**:
- `short_code` - Unique identifier used to trigger the response (e.g., typing `/welcome`)
- Supports variables: `{{contact.name}}`, `{{agent.name}}`, etc.

---

### 48. Update Canned Response

**Endpoint**: `PUT /api/v1/accounts/:account_id/canned_responses/:id`
**Controller**: `Api::V1::Accounts::CannedResponsesController#update`
**Authentication**: Required
**Description**: Updates a canned response.

**Request Body**:
```json
{
  "canned_response": {
    "short_code": "refund_policy",
    "content": "Updated refund message content"
  }
}
```

**Response** (200 OK):
```json
{
  "id": 3,
  "short_code": "refund_policy",
  "content": "Updated refund message content"
}
```

---

### 49. Delete Canned Response

**Endpoint**: `DELETE /api/v1/accounts/:account_id/canned_responses/:id`
**Controller**: `Api::V1::Accounts::CannedResponsesController#destroy`
**Authentication**: Required
**Description**: Deletes a canned response.

**Response** (200 OK):
```
(Empty response body)
```

---

## 🔔 Notifications API

**Base Path**: `/api/v1/accounts/:account_id/notifications`
**Controller**: `Api::V1::Accounts::NotificationsController`

Manage agent notifications.

### 50. List Notifications

**Endpoint**: `GET /api/v1/accounts/:account_id/notifications`
**Controller**: `Api::V1::Accounts::NotificationsController#index`
**Authentication**: Required
**Description**: Lists notifications for the current user.

**Query Parameters**:
- `page` - Page number (default: 1)
- `type` - Filter by type: `conversation`, `mention`, `assigned`

**Response** (200 OK):
```json
{
  "data": {
    "payload": [
      {
        "id": 1,
        "notification_type": "conversation_assignment",
        "primary_actor_type": "Conversation",
        "primary_actor_id": 100,
        "primary_actor": {
          "id": 100,
          "display_id": 100
        },
        "read_at": null,
        "snoozed_until": null,
        "created_at": "2025-01-06T10:00:00Z",
        "meta": {
          "assignee": {
            "id": 2,
            "name": "Agent Jane"
          }
        }
      }
    ],
    "meta": {
      "count": 25,
      "current_page": 1,
      "unread_count": 8
    }
  }
}
```

**Pagination**: 15 notifications per page

---

### 51. Get Unread Count

**Endpoint**: `GET /api/v1/accounts/:account_id/notifications/unread_count`
**Controller**: `Api::V1::Accounts::NotificationsController#unread_count`
**Authentication**: Required
**Description**: Returns count of unread notifications.

**Response** (200 OK):
```json
{
  "count": 8
}
```

---

### 52. Mark as Read

**Endpoint**: `PUT /api/v1/accounts/:account_id/notifications/:id`
**Controller**: `Api::V1::Accounts::NotificationsController#update`
**Authentication**: Required
**Description**: Marks a notification as read.

**Response** (200 OK):
```json
{
  "id": 1,
  "read_at": "2025-01-06T10:05:00Z"
}
```

---

### 53. Mark as Unread

**Endpoint**: `POST /api/v1/accounts/:account_id/notifications/:id/unread`
**Controller**: `Api::V1::Accounts::NotificationsController#unread`
**Authentication**: Required
**Description**: Marks a notification as unread.

**Response** (200 OK):
```json
{
  "id": 1,
  "read_at": null
}
```

---

### 54. Mark All as Read

**Endpoint**: `POST /api/v1/accounts/:account_id/notifications/read_all`
**Controller**: `Api::V1::Accounts::NotificationsController#read_all`
**Authentication**: Required
**Description**: Marks all notifications as read.

**Request Body (Optional)**:
```json
{
  "primary_actor_type": "Conversation",
  "primary_actor_id": 100
}
```

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- If `primary_actor_type` and `primary_actor_id` provided, only marks notifications for that entity

---

### 55. Snooze Notification

**Endpoint**: `POST /api/v1/accounts/:account_id/notifications/:id/snooze`
**Controller**: `Api::V1::Accounts::NotificationsController#snooze`
**Authentication**: Required
**Description**: Snoozes notification until specified time.

**Request Body**:
```json
{
  "snoozed_until": "2025-01-07T10:00:00Z"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "snoozed_until": "2025-01-07T10:00:00Z"
}
```

---

### 56. Delete Notification

**Endpoint**: `DELETE /api/v1/accounts/:account_id/notifications/:id`
**Controller**: `Api::V1::Accounts::NotificationsController#destroy`
**Authentication**: Required
**Description**: Deletes a single notification.

**Response** (200 OK):
```
(Empty response body)
```

---

### 57. Delete All Notifications

**Endpoint**: `POST /api/v1/accounts/:account_id/notifications/destroy_all`
**Controller**: `Api::V1::Accounts::NotificationsController#destroy_all`
**Authentication**: Required
**Description**: Deletes all or read notifications.

**Request Body**:
```json
{
  "type": "read"
}
```

**Type Options**:
- `read` - Delete only read notifications
- `all` - Delete all notifications

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Deletion is asynchronous (background job)

---

## 😊 CSAT Survey Responses API

**Base Path**: `/api/v1/accounts/:account_id/csat_survey_responses`
**Controller**: `Api::V1::Accounts::CsatSurveyResponsesController`

Customer Satisfaction survey responses and metrics.

### 58. List CSAT Responses

**Endpoint**: `GET /api/v1/accounts/:account_id/csat_survey_responses`
**Controller**: `Api::V1::Accounts::CsatSurveyResponsesController#index`
**Authentication**: Required
**Description**: Lists CSAT survey responses with filtering.

**Query Parameters**:
- `page` - Page number (default: 1)
- `user_ids` - Filter by agent IDs (array)
- `inbox_id` - Filter by inbox ID
- `team_id` - Filter by team ID
- `rating` - Filter by rating (1-5)
- `since` - Start timestamp (Unix)
- `until` - End timestamp (Unix)
- `sort` - Sort by created_at (default: desc)

**Example Request**:
```
GET /api/v1/accounts/1/csat_survey_responses?rating=5&page=1&since=1704067200&until=1706745600
```

**Response** (200 OK):
```json
{
  "data": {
    "payload": [
      {
        "id": 1,
        "rating": 5,
        "feedback_message": "Excellent service! Very helpful.",
        "conversation": {
          "id": 100,
          "display_id": 100
        },
        "contact": {
          "id": 10,
          "name": "Alice Johnson",
          "email": "alice@example.com"
        },
        "assigned_agent": {
          "id": 2,
          "name": "Agent Jane"
        },
        "created_at": "2025-01-06T10:00:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "total_count": 125
    }
  }
}
```

**Pagination**: 25 responses per page

---

### 59. Get CSAT Metrics

**Endpoint**: `GET /api/v1/accounts/:account_id/csat_survey_responses/metrics`
**Controller**: `Api::V1::Accounts::CsatSurveyResponsesController#metrics`
**Authentication**: Required
**Description**: Returns CSAT metrics summary.

**Query Parameters**: Same as List CSAT Responses

**Response** (200 OK):
```json
{
  "total_count": 125,
  "total_sent_messages_count": 200,
  "ratings_count": {
    "1": 5,
    "2": 8,
    "3": 15,
    "4": 35,
    "5": 62
  },
  "response_rate": 0.625,
  "satisfaction_score": 4.13
}
```

**Metrics Explained**:
- `total_count` - Total survey responses received
- `total_sent_messages_count` - Total surveys sent
- `ratings_count` - Breakdown by rating (1-5 stars)
- `response_rate` - Percentage of surveys responded to
- `satisfaction_score` - Average rating

**Use Case for AI**:
- Track customer satisfaction trends
- Identify top-performing agents
- Detect service quality issues
- Trigger alerts for low ratings

---

### 60. Download CSAT Report

**Endpoint**: `GET /api/v1/accounts/:account_id/csat_survey_responses/download`
**Controller**: `Api::V1::Accounts::CsatSurveyResponsesController#download`
**Authentication**: Required
**Description**: Downloads CSAT responses as CSV.

**Query Parameters**: Same as List CSAT Responses

**Response** (200 OK):
```csv
ID,Rating,Feedback,Contact,Email,Agent,Conversation,Created At
1,5,"Excellent service!",Alice Johnson,alice@example.com,Agent Jane,100,2025-01-06 10:00:00
2,4,"Good support",Bob Smith,bob@example.com,Agent Bob,101,2025-01-06 11:30:00
```

**Content-Type**: `text/csv`

---

## 🎯 AI Agent Use Cases

### Recommended Endpoints for AI Integration

#### 1. **Performance Monitoring**
- `GET /api/v2/accounts/:account_id/reports/summary` - Track KPIs
- `GET /api/v2/accounts/:account_id/reports/agents` - Agent performance
- `GET /api/v1/accounts/:account_id/csat_survey_responses/metrics` - Customer satisfaction

#### 2. **Intelligent Automation**
- `POST /api/v1/accounts/:account_id/automation_rules` - Create rules based on AI insights
- `POST /api/v1/accounts/:account_id/macros/:id/execute` - Execute workflows
- `POST /api/v1/accounts/:account_id/webhooks` - Real-time event processing

#### 3. **Team Management**
- `GET /api/v1/accounts/:account_id/teams` - Team structure
- `POST /api/v1/accounts/:account_id/teams/:team_id/team_members` - Dynamic team assignment
- `GET /api/v2/accounts/:account_id/reports/teams` - Team performance metrics

#### 4. **Proactive Engagement**
- `POST /api/v1/accounts/:account_id/campaigns` - Trigger campaigns based on user behavior
- `GET /api/v2/accounts/:account_id/reports/conversation_traffic` - Identify peak hours

#### 5. **Knowledge Management**
- `POST /api/v1/accounts/:account_id/canned_responses` - Create AI-generated responses
- `POST /api/v1/accounts/:account_id/labels` - Auto-categorization
- `GET /api/v1/accounts/:account_id/canned_responses?search=...` - Find relevant responses

#### 6. **Quality Assurance**
- `GET /api/v1/accounts/:account_id/csat_survey_responses` - Monitor satisfaction
- `GET /api/v2/accounts/:account_id/reports/bot_metrics` - Bot performance
- `POST /api/v1/accounts/:account_id/webhooks` - Alert on negative feedback

---

## 📝 Notes

### Automation Best Practices
- Start with simple rules, iterate based on results
- Test automation rules on small sample first
- Monitor automation impact on metrics
- Use webhooks for external system integration

### Report Performance Tips
- Use `group_by` parameter for aggregated views
- Request CSV exports for large datasets
- Cache report results for dashboards
- Use `business_hours` filter for accurate metrics

### Webhook Security
- Verify webhook signatures (if implemented)
- Use HTTPS endpoints only
- Implement retry logic on your receiver
- Log all webhook events for debugging

### Team Organization
- Keep teams focused (5-15 members ideal)
- Use `allow_auto_assign` for balanced workload
- Regularly review team performance reports
- Align teams with inbox specializations

---

## 📚 Related Documentation

This is **Part 3 of 4** in the Chatwoot API documentation series.

**Previous**:
- Part 1/4 - Accounts, Users, and Contacts
- Part 2/4 - Conversations, Messages, and Inboxes

**Coming Next**:
- Part 4/4 - Integrations, Advanced Features, Search

---

**Generated**: 2025-01-06
**Chatwoot Version**: Latest (as of documentation date)
**API Version**: v1, v2 (Reports)
**Total Endpoints Documented**: 60
