# Chatwoot API Endpoints - AI Agent Tool Summary
## For LangGraph Cognitive Agents

---

## 🎯 Purpose

This document provides a **high-level summary** of the most important Chatwoot API endpoints for **AI cognitive agents** using frameworks like LangGraph. It focuses on:

1. **Available Tools**: Which endpoints can be used as tools by AI agents
2. **Conversation Escalation**: How to escalate conversations when the agent cannot resolve an issue
3. **System Problem Handling**: How to handle errors and system issues
4. **Context Gathering**: How to retrieve information to make informed decisions

This summary is derived from the complete endpoint documentation in:
- `api-endpoints-part1.md` (46 endpoints) - Accounts, Users, Contacts
- `api-endpoints-part2.md` (54 endpoints) - Conversations, Messages, Inboxes
- `api-endpoints-part3.md` (60 endpoints) - Teams, Reports, Webhooks, Automation
- `api-endpoints-part4.md` (56 endpoints) - Integrations, Search, Knowledge Base, Platform

**Total Endpoints Documented**: 216

---

## 📋 Table of Contents

1. [Critical Concepts](#critical-concepts)
2. [Use Case 1: Conversation Escalation](#use-case-1-conversation-escalation)
3. [Use Case 2: Gathering Context](#use-case-2-gathering-context)
4. [Use Case 3: Managing Conversations](#use-case-3-managing-conversations)
5. [Use Case 4: Sending Messages & Responses](#use-case-4-sending-messages--responses)
6. [Use Case 5: Knowledge Base Access](#use-case-5-knowledge-base-access)
7. [Use Case 6: System Monitoring](#use-case-6-system-monitoring)
8. [Use Case 7: Automation & Workflows](#use-case-7-automation--workflows)
9. [Decision Trees for AI Agents](#decision-trees-for-ai-agents)
10. [Emergency Escalation Protocols](#emergency-escalation-protocols)

---

## 🔑 Critical Concepts

### Authentication
All API requests require authentication using **Devise Token Auth**:
- **Headers**: `access-token`, `client`, `uid`
- **Alternative**: `api_access_token` for platform/bot integrations

### Base URLs
- **API v1**: `/api/v1/accounts/:account_id`
- **API v2** (Reports): `/api/v2/accounts/:account_id`
- **Platform API**: `/platform/api/v1`
- **Public API**: `/public/api/v1`

### Key IDs Needed
- `account_id` - The workspace/company ID
- `conversation_id` - Specific conversation
- `contact_id` - Customer/user
- `inbox_id` - Communication channel (email, chat, etc.)
- `team_id` - Agent team
- `agent_id` / `user_id` - Human agent

---

## 🚨 Use Case 1: Conversation Escalation

**When to Use**: AI agent cannot resolve the issue and needs to escalate to a human agent or team.

### 1.1 Assign to Human Agent

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/assignments`

**Purpose**: Transfer conversation to a specific human agent

**Request**:
```json
{
  "assignee_id": 2
}
```

**When to Use**:
- Customer explicitly requests human agent
- AI confidence score below threshold
- Issue requires specialized expertise
- Emotional/sensitive situation detected

**Example Decision Logic**:
```
IF sentiment == "angry" OR intent_confidence < 0.7 OR keyword in ["speak to manager", "human agent"]
  THEN assign_to_human_agent()
```

---

### 1.2 Assign to Team

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/assignments`

**Purpose**: Route conversation to specialized team (e.g., billing, technical support)

**Request**:
```json
{
  "team_id": 1
}
```

**When to Use**:
- Issue requires domain expertise (billing, legal, technical)
- Customer tier requires specific team (VIP, enterprise)
- AI needs to route based on conversation topic

---

### 1.3 Add Labels for Escalation Tracking

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/labels`

**Purpose**: Tag conversation for tracking and priority

**Request**:
```json
{
  "labels": ["escalated", "urgent", "ai-handoff"]
}
```

**When to Use**:
- Before escalating to track AI performance
- To trigger automation rules
- For analytics on escalation patterns

---

### 1.4 Change Conversation Priority

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/toggle_priority`

**Purpose**: Mark conversation as urgent before assignment

**Request**:
```json
{
  "priority": "urgent"
}
```

**Priority Levels**: `urgent`, `high`, `medium`, `low`, `none`

**When to Use**:
- High-value customer detected
- Time-sensitive issue (downtime, security breach)
- Negative sentiment detected

---

### 1.5 Add Private Note for Human Agent

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages`

**Purpose**: Leave context note for human agent before handoff

**Request**:
```json
{
  "content": "AI Bot Context: Customer asking about refund for order #12345. Previous conversations show 2 similar issues. Sentiment: frustrated. Confidence in resolution: 0.45",
  "message_type": "outgoing",
  "private": true
}
```

**When to Use**:
- **ALWAYS** before escalating
- Include: AI analysis, confidence score, customer history, attempted solutions

---

### 1.6 Send Handoff Message to Customer

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages`

**Purpose**: Inform customer about escalation

**Request**:
```json
{
  "content": "I'm connecting you with one of our specialists who can better assist with this issue. Please hold for a moment.",
  "message_type": "outgoing",
  "private": false
}
```

---

### 1.7 Execute Escalation Macro

**Endpoint**: `POST /api/v1/accounts/:account_id/macros/:id/execute`

**Purpose**: Run pre-defined escalation workflow (assign + label + notify)

**Request**:
```json
{
  "conversation_ids": [100]
}
```

**When to Use**:
- Standard escalation flows already configured
- Faster than individual API calls

---

## 🔍 Use Case 2: Gathering Context

**When to Use**: AI needs information to make decisions or provide informed responses.

### 2.1 Get Conversation Details

**Endpoint**: `GET /api/v1/accounts/:account_id/conversations/:id`

**Purpose**: Retrieve full conversation context (status, assignee, labels, custom attributes)

**Response Includes**:
- Contact information
- Conversation status (open/resolved/pending)
- Assigned agent/team
- Labels and custom attributes
- Message history

**When to Use**:
- Before responding to customer
- To check conversation state
- To retrieve custom data (order_id, subscription_plan, etc.)

---

### 2.2 Get Contact Information

**Endpoint**: `GET /api/v1/accounts/:account_id/contacts/:id`

**Purpose**: Retrieve customer profile and history

**Response Includes**:
- Name, email, phone
- Custom attributes (customer_type, lifetime_value, etc.)
- Previous conversations
- Notes from agents

**When to Use**:
- To personalize responses
- To check customer tier/status
- To retrieve order history or account details

---

### 2.3 Search Previous Conversations

**Endpoint**: `GET /api/v1/accounts/:account_id/conversations/search?q=order+status`

**Purpose**: Find similar past conversations for context

**When to Use**:
- Customer has recurring issues
- To find previous resolutions
- To detect patterns

---

### 2.4 Search Messages

**Endpoint**: `GET /api/v1/accounts/:account_id/search/messages?q=refund`

**Purpose**: Search message content across all conversations

**When to Use**:
- To find specific information discussed before
- To analyze conversation patterns
- To retrieve specific data points

---

### 2.5 Search Knowledge Base Articles

**Endpoint**: `GET /api/v1/accounts/:account_id/search/articles?q=password+reset`

**Purpose**: Find relevant help articles to suggest

**When to Use**:
- To provide self-service options
- Before escalating, try to suggest articles
- To enhance AI responses with documentation

---

### 2.6 Get Contact's Conversation History

**Endpoint**: `GET /api/v1/accounts/:account_id/contacts/:id/conversations`

**Purpose**: Retrieve all past conversations with this customer

**When to Use**:
- To understand customer history
- To detect repeated issues
- To provide continuity in service

---

### 2.7 Get Available Agents

**Endpoint**: `GET /api/v1/accounts/:account_id/agents`

**Purpose**: List all agents with availability status

**Response Includes**:
- Agent ID, name, email
- Availability: `online`, `busy`, `offline`
- Role: `administrator`, `agent`

**When to Use**:
- To find available agent for assignment
- To check who's online before escalating

---

### 2.8 Get Assignable Agents

**Endpoint**: `GET /api/v1/accounts/:account_id/assignable_agents?inbox_id=1`

**Purpose**: List agents who can handle specific inbox

**When to Use**:
- Before assigning conversation
- To route to correct agent pool

---

## 💬 Use Case 3: Managing Conversations

**When to Use**: AI needs to change conversation state or metadata.

### 3.1 Change Conversation Status

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/toggle_status`

**Purpose**: Update conversation status

**Request**:
```json
{
  "status": "resolved"
}
```

**Status Options**: `open`, `resolved`, `pending`, `snoozed`

**When to Use**:
- Mark as `resolved` when issue is fixed
- Mark as `pending` when waiting for customer
- Mark as `snoozed` to follow up later

---

### 3.2 Add Custom Attributes

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/custom_attributes`

**Purpose**: Store structured data about conversation

**Request**:
```json
{
  "custom_attributes": {
    "order_id": "ORD12345",
    "issue_type": "billing",
    "ai_confidence": 0.85,
    "resolved_by": "ai_bot"
  }
}
```

**When to Use**:
- Track AI performance metrics
- Store extracted entities (order IDs, account numbers)
- Tag for analytics

---

### 3.3 Update Last Seen

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/update_last_seen`

**Purpose**: Mark conversation as viewed by agent/bot

**When to Use**:
- After AI processes new messages
- To track read status

---

### 3.4 Toggle Typing Indicator

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:id/toggle_typing_status`

**Purpose**: Show "AI is typing..." indicator

**Request**:
```json
{
  "typing_status": "on"
}
```

**When to Use**:
- While AI is generating response
- To improve user experience
- Turn off after sending message

---

## ✉️ Use Case 4: Sending Messages & Responses

**When to Use**: AI needs to communicate with customers.

### 4.1 Send Text Message

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages`

**Purpose**: Send AI-generated response to customer

**Request**:
```json
{
  "content": "Your order #12345 has been shipped and will arrive by Jan 10th.",
  "message_type": "outgoing",
  "private": false
}
```

**When to Use**:
- Answering customer questions
- Providing updates
- Sending confirmations

---

### 4.2 Send Message with Rich Content

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages`

**Purpose**: Send interactive messages (buttons, cards)

**Request**:
```json
{
  "content": "Choose an option:",
  "content_type": "input_select",
  "content_attributes": {
    "items": [
      {"title": "Track Order", "value": "track_order"},
      {"title": "Request Refund", "value": "refund"},
      {"title": "Speak to Agent", "value": "escalate"}
    ]
  }
}
```

**When to Use**:
- To guide customer through options
- To collect structured input
- To improve UX

---

### 4.3 Send Private Note

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages`

**Purpose**: Internal note not visible to customer

**Request**:
```json
{
  "content": "AI detected potential fraud - customer IP changed 3 times",
  "message_type": "outgoing",
  "private": true
}
```

**When to Use**:
- Internal alerts
- AI analysis notes
- Context for human agents

---

### 4.4 Translate Message

**Endpoint**: `POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages/:id/translate`

**Purpose**: Translate customer message to agent's language

**Request**:
```json
{
  "target_language": "en"
}
```

**When to Use**:
- Multi-language support
- Understanding non-English messages

---

### 4.5 Use Canned Response

**Endpoint**: `GET /api/v1/accounts/:account_id/canned_responses?search=welcome`

**Purpose**: Retrieve pre-written response templates

**When to Use**:
- For common questions
- Consistent messaging
- Faster responses

---

## 📚 Use Case 5: Knowledge Base Access

**When to Use**: AI needs to suggest help articles or self-service options.

### 5.1 Search Articles

**Endpoint**: `GET /api/v1/accounts/:account_id/search/articles?q=reset+password`

**Purpose**: Find relevant help articles

**When to Use**:
- Before escalating, offer self-service
- To enhance AI responses with documentation
- To reduce agent workload

---

### 5.2 Get Article Details

**Endpoint**: `GET /api/v1/accounts/:account_id/portals/:portal_id/articles/:id`

**Purpose**: Retrieve full article content

**When to Use**:
- To include article content in AI response
- To verify article relevance

---

### 5.3 Create Article from Conversation

**Endpoint**: `POST /api/v1/accounts/:account_id/portals/:portal_id/articles`

**Purpose**: Generate help article from resolved conversation

**Request**:
```json
{
  "article": {
    "title": "How to Update Billing Information",
    "content": "<h1>Steps to update billing...</h1>",
    "category_id": 2,
    "status": "draft"
  }
}
```

**When to Use**:
- After resolving common issues
- To build knowledge base automatically
- To reduce future inquiries

---

## 📊 Use Case 6: System Monitoring

**When to Use**: AI needs to check system health or identify issues.

### 6.1 Get Summary Metrics

**Endpoint**: `GET /api/v2/accounts/:account_id/reports/summary?type=account&since=1704067200&until=1706745600`

**Purpose**: Monitor conversation volume and response times

**Response**:
```json
{
  "conversations_count": 450,
  "avg_first_response_time": 320.5,
  "avg_resolution_time": 3600.2,
  "resolutions_count": 380
}
```

**When to Use**:
- To detect unusual activity
- To check if system is overloaded
- To recommend escalation based on wait times

---

### 6.2 Get Bot Metrics

**Endpoint**: `GET /api/v2/accounts/:account_id/reports/bot_metrics`

**Purpose**: Track AI bot performance

**Response**:
```json
{
  "bot_resolutions": 85,
  "bot_handoffs": 42,
  "handoff_rate": 0.33,
  "resolution_rate": 0.67
}
```

**When to Use**:
- Self-assessment of AI performance
- To adjust escalation thresholds
- To identify training gaps

---

### 6.3 Get CSAT Metrics

**Endpoint**: `GET /api/v1/accounts/:account_id/csat_survey_responses/metrics`

**Purpose**: Monitor customer satisfaction

**Response**:
```json
{
  "satisfaction_score": 4.13,
  "response_rate": 0.625,
  "ratings_count": {
    "1": 5, "2": 8, "3": 15, "4": 35, "5": 62
  }
}
```

**When to Use**:
- To detect quality issues
- To validate AI improvements
- To trigger alerts on low ratings

---

## 🤖 Use Case 7: Automation & Workflows

**When to Use**: AI needs to trigger automated actions.

### 7.1 Execute Macro

**Endpoint**: `POST /api/v1/accounts/:account_id/macros/:id/execute`

**Purpose**: Run pre-defined action sequence

**Request**:
```json
{
  "conversation_ids": [100, 101, 102]
}
```

**Example Macro Actions**:
- Send message
- Assign to agent/team
- Add labels
- Change priority
- Resolve conversation

**When to Use**:
- Standard workflows
- Bulk operations
- Consistent processes

---

### 7.2 Create Automation Rule

**Endpoint**: `POST /api/v1/accounts/:account_id/automation_rules`

**Purpose**: Set up conditional automation based on AI insights

**Request**:
```json
{
  "name": "Auto-escalate low confidence",
  "event_name": "message_created",
  "conditions": [
    {
      "attribute_key": "custom_attributes.ai_confidence",
      "filter_operator": "is_less_than",
      "values": [0.5]
    }
  ],
  "actions": [
    {
      "action_name": "assign_team",
      "action_params": [1]
    }
  ]
}
```

**When to Use**:
- To automate escalation based on AI confidence
- To route by topic/sentiment
- To enforce SLAs

---

### 7.3 Trigger Webhook

**Endpoint**: Webhook subscriptions send events automatically

**Purpose**: Notify external systems of events

**Events**:
- `conversation_created`
- `message_created`
- `conversation_status_changed`
- `conversation_resolved`

**When to Use**:
- Integrate with external AI services
- Trigger downstream workflows
- Analytics and logging

---

## 🌳 Decision Trees for AI Agents

### Decision Tree 1: Should I Escalate?

```
START
│
├─ Is customer explicitly requesting human?
│  └─ YES → ESCALATE (Use Case 1.1)
│  └─ NO → Continue
│
├─ Is AI confidence score < 0.7?
│  └─ YES → ESCALATE (Use Case 1.1 + 1.5)
│  └─ NO → Continue
│
├─ Is sentiment negative/angry?
│  └─ YES → ESCALATE with URGENT priority (Use Case 1.1 + 1.4)
│  └─ NO → Continue
│
├─ Is issue in restricted category (legal, medical, financial)?
│  └─ YES → ESCALATE to specialized team (Use Case 1.2)
│  └─ NO → Continue
│
├─ Has conversation exceeded 5 turns without resolution?
│  └─ YES → ESCALATE (Use Case 1.1 + 1.5)
│  └─ NO → Continue
│
└─ Attempt resolution with AI
   │
   ├─ Resolution successful?
   │  └─ YES → Mark as resolved (Use Case 3.1)
   │  └─ NO → ESCALATE (Use Case 1.1)
```

---

### Decision Tree 2: Which Team Should Handle This?

```
START: Analyze conversation topic
│
├─ Topic: Billing/Payments
│  └─ Assign to Billing Team (team_id: 1)
│
├─ Topic: Technical Support
│  └─ Assign to Technical Team (team_id: 2)
│
├─ Topic: Account/Security
│  └─ Assign to Security Team (team_id: 3)
│
├─ Topic: Sales/Upgrade
│  └─ Assign to Sales Team (team_id: 4)
│
└─ Topic: General/Unknown
   └─ Assign to General Support Team (team_id: 5)
```

---

### Decision Tree 3: What Response Type Should I Send?

```
START
│
├─ Can I resolve with existing knowledge?
│  ├─ YES → Send direct answer (Use Case 4.1)
│  └─ NO → Continue
│
├─ Is there a relevant help article?
│  ├─ YES → Send article link (Use Case 5.1 + 4.1)
│  └─ NO → Continue
│
├─ Need customer to choose option?
│  ├─ YES → Send rich content with buttons (Use Case 4.2)
│  └─ NO → Continue
│
├─ Need to collect specific information?
│  ├─ YES → Send structured input form (Use Case 4.2)
│  └─ NO → Continue
│
└─ Cannot help
   └─ ESCALATE with context (Use Case 1.5 + 1.6)
```

---

## 🚑 Emergency Escalation Protocols

### Protocol 1: Urgent Customer Issue

**Triggers**:
- Keywords: "emergency", "urgent", "critical", "down", "not working"
- High-value customer (custom_attributes.customer_type == "vip")
- Financial loss mentioned
- Security breach suspected

**Actions** (Execute in Order):
```
1. Set priority to URGENT
   POST /api/v1/accounts/:account_id/conversations/:id/toggle_priority
   { "priority": "urgent" }

2. Add escalation labels
   POST /api/v1/accounts/:account_id/conversations/:conversation_id/labels
   { "labels": ["urgent", "escalated", "ai-escalation"] }

3. Add private note with AI context
   POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages
   { "content": "URGENT: [AI analysis]", "private": true }

4. Assign to senior agent or on-call team
   POST /api/v1/accounts/:account_id/conversations/:conversation_id/assignments
   { "team_id": 1 }

5. Notify customer
   POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages
   { "content": "I'm immediately connecting you with a senior specialist." }
```

---

### Protocol 2: AI System Failure

**Triggers**:
- AI service timeout
- Multiple consecutive failures
- Invalid API responses

**Actions**:
```
1. Set conversation status to pending
   POST /api/v1/accounts/:account_id/conversations/:id/toggle_status
   { "status": "pending" }

2. Add system error label
   POST /api/v1/accounts/:account_id/conversations/:conversation_id/labels
   { "labels": ["system-error", "ai-failed"] }

3. Assign to available agent
   GET /api/v1/accounts/:account_id/agents (filter by availability == "online")
   POST /api/v1/accounts/:account_id/conversations/:conversation_id/assignments
   { "assignee_id": [first_available_agent] }

4. Send apologetic message
   POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages
   { "content": "I apologize for the delay. Let me connect you with an agent who can assist you right away." }
```

---

### Protocol 3: High Volume Overload

**Triggers**:
- Conversation queue > threshold
- Average wait time > SLA
- All agents busy

**Actions**:
```
1. Check current metrics
   GET /api/v2/accounts/:account_id/reports/summary

2. If overloaded:
   - Send automated holding message with ETA
   - Suggest knowledge base articles
   - Offer callback option
   - Set status to "snoozed" with future time

3. Prioritize by customer tier
   - VIP customers → immediate assignment
   - Regular customers → queue with article suggestions
```

---

## 📊 Endpoint Summary by Category

### **Critical Escalation Endpoints** (Use First)
1. `POST /api/v1/accounts/:account_id/conversations/:conversation_id/assignments` - Assign to agent/team
2. `POST /api/v1/accounts/:account_id/conversations/:conversation_id/labels` - Add labels
3. `POST /api/v1/accounts/:account_id/conversations/:id/toggle_priority` - Set priority
4. `POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages` - Send message (private note or customer message)

### **Context Gathering Endpoints** (Use to Make Decisions)
5. `GET /api/v1/accounts/:account_id/conversations/:id` - Get conversation details
6. `GET /api/v1/accounts/:account_id/contacts/:id` - Get customer profile
7. `GET /api/v1/accounts/:account_id/search` - Global search
8. `GET /api/v1/accounts/:account_id/agents` - Get available agents

### **Conversation Management Endpoints** (Use to Update State)
9. `POST /api/v1/accounts/:account_id/conversations/:id/toggle_status` - Change status
10. `POST /api/v1/accounts/:account_id/conversations/:id/custom_attributes` - Store data
11. `POST /api/v1/accounts/:account_id/conversations/:id/update_last_seen` - Mark as viewed

### **Knowledge & Self-Service Endpoints** (Use Before Escalating)
12. `GET /api/v1/accounts/:account_id/search/articles` - Find help articles
13. `GET /api/v1/accounts/:account_id/canned_responses` - Get pre-written responses

### **Monitoring Endpoints** (Use for System Health)
14. `GET /api/v2/accounts/:account_id/reports/summary` - System metrics
15. `GET /api/v2/accounts/:account_id/reports/bot_metrics` - AI performance
16. `GET /api/v1/accounts/:account_id/csat_survey_responses/metrics` - Customer satisfaction

---

## 🎯 Quick Reference: AI Agent Workflow

### Minimal AI Agent Flow

```python
# 1. Receive new message via webhook
event = receive_webhook()

# 2. Get conversation context
conversation = GET /api/v1/accounts/:account_id/conversations/:id
contact = GET /api/v1/accounts/:account_id/contacts/:contact_id

# 3. Analyze & decide
if should_escalate(conversation, contact):
    # 4a. Escalate
    POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages
    { "content": "AI Context: ...", "private": true }

    POST /api/v1/accounts/:account_id/conversations/:conversation_id/assignments
    { "assignee_id": best_agent_id }

    POST /api/v1/accounts/:account_id/conversations/:conversation_id/labels
    { "labels": ["escalated", "ai-handoff"] }
else:
    # 4b. AI handles
    POST /api/v1/accounts/:account_id/conversations/:conversation_id/messages
    { "content": "AI response", "private": false }

    if resolved:
        POST /api/v1/accounts/:account_id/conversations/:id/toggle_status
        { "status": "resolved" }
```

---

## 📖 Additional Resources

For detailed endpoint specifications, see:
- **Part 1**: Accounts, Users, Contacts (46 endpoints)
- **Part 2**: Conversations, Messages, Inboxes (54 endpoints)
- **Part 3**: Teams, Reports, Webhooks, Automation (60 endpoints)
- **Part 4**: Integrations, Search, Knowledge Base, Platform (56 endpoints)

**Total**: 216 endpoints documented

---

## ⚠️ Important Notes for AI Agents

### 1. Always Leave Context on Escalation
When escalating, **ALWAYS** add a private note with:
- AI confidence score
- Customer sentiment analysis
- Extracted entities (order IDs, account numbers)
- Attempted solutions
- Conversation summary

### 2. Check Availability Before Assigning
Use `GET /api/v1/accounts/:account_id/agents` to check agent availability before assignment.

### 3. Use Labels for Analytics
Tag conversations with labels like:
- `ai-resolved` - AI successfully handled
- `ai-escalated` - AI escalated to human
- `ai-failed` - AI encountered error
- `ai-confidence-low` - AI uncertain about resolution

### 4. Implement Graceful Degradation
If API calls fail:
1. Retry with exponential backoff
2. Fall back to basic escalation (assign to general queue)
3. Never leave customer hanging - send apologetic message

### 5. Monitor Performance
Regularly check:
- Bot resolution rate
- Escalation rate
- Average confidence scores
- Customer satisfaction scores

### 6. Handle Edge Cases
- Customer switches language mid-conversation
- Multiple issues in one conversation
- Time-sensitive requests (callbacks, appointments)
- Privacy-sensitive information (PII, payment data)

---

**Generated**: 2025-01-07
**For**: LangGraph AI Agents
**Chatwoot API Version**: v1, v2 (Reports)
**Total Endpoints**: 216 (Summary highlights ~16 critical endpoints)
