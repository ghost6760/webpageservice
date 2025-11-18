# Chatwoot API Documentation - Part 1/4
## Accounts, Users, and Contacts

---

## 📋 Table of Contents

1. [Authentication Overview](#authentication-overview)
2. [Accounts API](#accounts-api)
3. [Users & Profile API](#users--profile-api)
4. [Contacts API](#contacts-api)
5. [WebSocket Channels](#websocket-channels)

---

## 🔐 Authentication Overview

### Authentication Methods

Chatwoot supports multiple authentication methods:

1. **Devise Token Auth** (for user sessions)
   - Headers: `access-token`, `client`, `uid`
   - Used for standard API calls

2. **API Access Token** (for integrations)
   - Header: `api_access_token` or `HTTP_API_ACCESS_TOKEN`
   - Used for platform integrations and bots

3. **WebSocket Authentication**
   - Parameter: `pubsub_token`
   - Used for real-time updates via ActionCable

### Base URLs

- **API v1**: `/api/v1`
- **API v2**: `/api/v2`
- **Platform API**: `/platform/api/v1`
- **Public API**: `/public/api/v1`

---

## 📦 Accounts API

Account-scoped resources. All endpoints require authentication unless specified.

### 1. Create Account

**Endpoint**: `POST /api/v1/accounts`
**Controller**: `Api::V1::AccountsController#create`
**Authentication**: Optional (public signup)
**Description**: Creates a new account with the first user as owner.

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "account_name": "My Company",
  "user_full_name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "locale": "en",
  "h_captcha_client_response": "captcha_token_here"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "uid": "unique-user-id",
  "email": "john@example.com",
  "account_id": 1,
  "pubsub_token": "pubsub_token_here",
  "accounts": [
    {
      "id": 1,
      "name": "My Company",
      "locale": "en",
      "domain": null,
      "support_email": null,
      "status": "active"
    }
  ]
}
```

**Notes**:
- Requires `ENABLE_ACCOUNT_SIGNUP` to be enabled
- Requires valid hCaptcha token if captcha is enabled
- Automatically sends authentication headers in response

---

### 2. Get Account Details

**Endpoint**: `GET /api/v1/accounts/:id`
**Controller**: `Api::V1::AccountsController#show`
**Authentication**: Required (Devise Token Auth)
**Description**: Retrieves details of a specific account.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "My Company",
  "locale": "en",
  "domain": "company.chatwoot.com",
  "support_email": "support@company.com",
  "custom_attributes": {
    "industry": "Technology",
    "company_size": "50-100",
    "timezone": "America/New_York"
  },
  "settings": {
    "auto_resolve_after": 40,
    "auto_resolve_message": "Conversation auto-resolved",
    "auto_resolve_ignore_waiting": false,
    "audio_transcriptions": false
  },
  "features": {
    "crm_v2": true,
    "custom_roles": false
  }
}
```

---

### 3. Update Account

**Endpoint**: `PUT /api/v1/accounts/:id`
**Controller**: `Api::V1::AccountsController#update`
**Authentication**: Required (Admin role)
**Description**: Updates account settings and attributes.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Updated Company Name",
  "locale": "es",
  "domain": "mycompany.chatwoot.com",
  "support_email": "help@company.com",
  "industry": "Healthcare",
  "company_size": "100-500",
  "timezone": "Europe/Madrid",
  "auto_resolve_after": 60,
  "auto_resolve_message": "This conversation has been auto-resolved",
  "auto_resolve_ignore_waiting": true,
  "audio_transcriptions": true
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Updated Company Name",
  "locale": "es",
  "domain": "mycompany.chatwoot.com",
  "support_email": "help@company.com"
}
```

---

### 4. Update Active At

**Endpoint**: `POST /api/v1/accounts/:id/update_active_at`
**Controller**: `Api::V1::AccountsController#update_active_at`
**Authentication**: Required
**Description**: Updates the user's last active timestamp for the account.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Response** (200 OK):
```
(Empty response body)
```

**Use Case**: Keep track of user activity for presence/status features.

---

### 5. Get Cache Keys

**Endpoint**: `GET /api/v1/accounts/:id/cache_keys`
**Controller**: `Api::V1::AccountsController#cache_keys`
**Authentication**: Required
**Description**: Retrieves cache keys for labels, inboxes, and teams.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Response** (200 OK):
```json
{
  "cache_keys": {
    "label": "1704123456",
    "inbox": "1704123789",
    "team": "1704123999"
  }
}
```

**Notes**:
- Response cached for 10 seconds
- Useful for frontend cache invalidation strategies

---

## 👤 Users & Profile API

### Authentication Endpoints (Devise)

**Base Path**: `/auth`

#### 1. Sign In

**Endpoint**: `POST /auth/sign_in`
**Controller**: `DeviseOverrides::SessionsController#create`
**Authentication**: None
**Description**: Authenticates a user and returns auth tokens.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Headers**:
```
access-token: AbCdEf123456...
client: client-token-here
uid: user@example.com
```

**Response Body** (200 OK):
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "display_name": "Johnny",
    "account_id": 1,
    "pubsub_token": "pubsub_token_here",
    "role": "administrator",
    "confirmed": true
  }
}
```

---

#### 2. Sign Out

**Endpoint**: `DELETE /auth/sign_out`
**Controller**: `DeviseOverrides::SessionsController#destroy`
**Authentication**: Required
**Description**: Signs out the current user and invalidates tokens.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Response** (200 OK):
```json
{
  "success": true
}
```

---

#### 3. Validate Token

**Endpoint**: `GET /auth/validate_token`
**Controller**: `DeviseOverrides::TokenValidationsController#validate_token`
**Authentication**: Required
**Description**: Validates current authentication tokens.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

#### 4. Request Password Reset

**Endpoint**: `POST /auth/password`
**Controller**: `DeviseOverrides::PasswordsController#create`
**Authentication**: None
**Description**: Sends password reset email.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):
```json
{
  "message": "Password reset instructions sent to email"
}
```

---

#### 5. Reset Password

**Endpoint**: `PUT /auth/password`
**Controller**: `DeviseOverrides::PasswordsController#update`
**Authentication**: None (uses reset token)
**Description**: Updates password using reset token.

**Request Body**:
```json
{
  "reset_password_token": "token-from-email",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response** (200 OK):
```json
{
  "message": "Password successfully updated"
}
```

---

### Profile Management

#### 6. Get Current User Profile

**Endpoint**: `GET /api/v1/profile`
**Controller**: `Api::V1::ProfilesController#show`
**Authentication**: Required
**Description**: Retrieves the current user's profile information.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "display_name": "Johnny",
  "avatar": "https://example.com/avatar.png",
  "message_signature": "Best regards,\nJohn",
  "custom_attributes": {
    "phone_number": "+1234567890"
  },
  "ui_settings": {
    "theme": "dark",
    "language": "en"
  },
  "accounts": [
    {
      "id": 1,
      "name": "My Company",
      "role": "administrator"
    }
  ]
}
```

---

#### 7. Update User Profile

**Endpoint**: `PUT /api/v1/profile`
**Controller**: `Api::V1::ProfilesController#update`
**Authentication**: Required
**Description**: Updates the current user's profile.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
Content-Type: application/json
```

**Request Body**:
```json
{
  "profile": {
    "name": "John Doe Updated",
    "display_name": "Johnny D",
    "email": "newemail@example.com",
    "message_signature": "Cheers,\nJohn Doe",
    "phone_number": "+1234567890",
    "ui_settings": {
      "theme": "light",
      "language": "es"
    }
  }
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "name": "John Doe Updated",
  "display_name": "Johnny D"
}
```

---

#### 8. Update Password

**Endpoint**: `PUT /api/v1/profile`
**Controller**: `Api::V1::ProfilesController#update`
**Authentication**: Required
**Description**: Changes the user's password.

**Request Body**:
```json
{
  "profile": {
    "current_password": "oldpassword123",
    "password": "newpassword456",
    "password_confirmation": "newpassword456"
  }
}
```

**Response** (200 OK):
```json
{
  "message": "Password updated successfully"
}
```

---

#### 9. Delete Avatar

**Endpoint**: `DELETE /api/v1/profile/avatar`
**Controller**: `Api::V1::ProfilesController#avatar`
**Authentication**: Required
**Description**: Removes the user's avatar image.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Response** (200 OK):
```json
{
  "id": 1,
  "avatar": null
}
```

---

#### 10. Update Availability

**Endpoint**: `POST /api/v1/profile/availability`
**Controller**: `Api::V1::ProfilesController#availability`
**Authentication**: Required
**Description**: Updates user availability status for a specific account.

**Request Body**:
```json
{
  "profile": {
    "account_id": 1,
    "availability": "online"
  }
}
```

**Availability Options**:
- `online` - Available to receive conversations
- `busy` - Busy, not accepting new conversations
- `offline` - Offline, not available

**Response** (200 OK):
```
(Empty response body)
```

---

#### 11. Set Auto Offline

**Endpoint**: `POST /api/v1/profile/auto_offline`
**Controller**: `Api::V1::ProfilesController#auto_offline`
**Authentication**: Required
**Description**: Enables/disables automatic offline status.

**Request Body**:
```json
{
  "profile": {
    "account_id": 1,
    "auto_offline": true
  }
}
```

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- When enabled, user status automatically changes to offline when inactive

---

#### 12. Set Active Account

**Endpoint**: `PUT /api/v1/profile/set_active_account`
**Controller**: `Api::V1::ProfilesController#set_active_account`
**Authentication**: Required
**Description**: Sets the active account for the current session.

**Request Body**:
```json
{
  "profile": {
    "account_id": 2
  }
}
```

**Response** (200 OK):
```
(Empty response body)
```

---

#### 13. Resend Confirmation Email

**Endpoint**: `POST /api/v1/profile/resend_confirmation`
**Controller**: `Api::V1::ProfilesController#resend_confirmation`
**Authentication**: Required
**Description**: Resends email confirmation instructions.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Only sent if user is not already confirmed

---

#### 14. Reset Access Token

**Endpoint**: `POST /api/v1/profile/reset_access_token`
**Controller**: `Api::V1::ProfilesController#reset_access_token`
**Authentication**: Required
**Description**: Regenerates the user's API access token.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Response** (200 OK):
```json
{
  "id": 1,
  "access_token": {
    "token": "new-access-token-here"
  }
}
```

**Use Case**: For integrations and bot authentication

---

### Platform API - Users

**Base Path**: `/platform/api/v1`
**Authentication**: Platform App Token (via `api_access_token` header)

#### 15. Create Platform User

**Endpoint**: `POST /platform/api/v1/users`
**Controller**: `Platform::Api::V1::UsersController#create`
**Authentication**: Platform API Token
**Description**: Creates or updates a user via platform API.

**Headers**:
```
api_access_token: platform-token-here
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Jane Smith",
  "display_name": "Jane",
  "email": "jane@example.com",
  "password": "securepassword",
  "custom_attributes": {
    "employee_id": "EMP123",
    "department": "Sales"
  }
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "email": "jane@example.com",
  "name": "Jane Smith",
  "display_name": "Jane",
  "custom_attributes": {
    "employee_id": "EMP123",
    "department": "Sales"
  }
}
```

**Notes**:
- Automatically confirms the user (skips email confirmation)
- Creates or finds existing user by email

---

#### 16. Get Platform User

**Endpoint**: `GET /platform/api/v1/users/:id`
**Controller**: `Platform::Api::V1::UsersController#show`
**Authentication**: Platform API Token
**Description**: Retrieves a user's details.

**Headers**:
```
api_access_token: platform-token-here
```

**Response** (200 OK):
```json
{
  "id": 2,
  "email": "jane@example.com",
  "name": "Jane Smith",
  "display_name": "Jane"
}
```

---

#### 17. Update Platform User

**Endpoint**: `PUT /platform/api/v1/users/:id`
**Controller**: `Platform::Api::V1::UsersController#update`
**Authentication**: Platform API Token
**Description**: Updates a user's information.

**Request Body**:
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.new@example.com",
  "custom_attributes": {
    "employee_id": "EMP456",
    "department": "Marketing"
  }
}
```

**Response** (200 OK):
```json
{
  "id": 2,
  "email": "jane.new@example.com",
  "name": "Jane Smith Updated"
}
```

**Notes**:
- Skips email reconfirmation when email is changed

---

#### 18. Delete Platform User

**Endpoint**: `DELETE /platform/api/v1/users/:id`
**Controller**: `Platform::Api::V1::UsersController#destroy`
**Authentication**: Platform API Token
**Description**: Deletes a user asynchronously.

**Headers**:
```
api_access_token: platform-token-here
```

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Deletion is performed asynchronously via background job

---

#### 19. Generate SSO Login URL

**Endpoint**: `GET /platform/api/v1/users/:id/login`
**Controller**: `Platform::Api::V1::UsersController#login`
**Authentication**: Platform API Token
**Description**: Generates a single sign-on URL for the user.

**Headers**:
```
api_access_token: platform-token-here
```

**Response** (200 OK):
```json
{
  "url": "https://app.chatwoot.com/app/sso?token=sso-token-here"
}
```

**Use Case**: External systems can use this to log users into Chatwoot

---

#### 20. Get User API Token

**Endpoint**: `POST /platform/api/v1/users/:id/token`
**Controller**: `Platform::Api::V1::UsersController#token`
**Authentication**: Platform API Token
**Description**: Retrieves the user's API access token.

**Headers**:
```
api_access_token: platform-token-here
```

**Response** (200 OK):
```json
{
  "id": 2,
  "access_token": {
    "token": "user-access-token-here"
  }
}
```

---

### Agents API (Account-scoped Users)

**Base Path**: `/api/v1/accounts/:account_id`

#### 21. List Agents

**Endpoint**: `GET /api/v1/accounts/:account_id/agents`
**Controller**: `Api::V1::Accounts::AgentsController#index`
**Authentication**: Required
**Description**: Lists all agents/users in the account.

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
    "name": "John Doe",
    "display_name": "Johnny",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.png",
    "role": "administrator",
    "availability": "online",
    "auto_offline": false,
    "confirmed": true
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "agent",
    "availability": "busy",
    "auto_offline": true,
    "confirmed": true
  }
]
```

---

#### 22. Create Agent

**Endpoint**: `POST /api/v1/accounts/:account_id/agents`
**Controller**: `Api::V1::Accounts::AgentsController#create`
**Authentication**: Required (Admin role)
**Description**: Invites a new agent to the account.

**Request Body**:
```json
{
  "agent": {
    "email": "newagent@example.com",
    "name": "New Agent",
    "role": "agent",
    "availability": "online",
    "auto_offline": false
  }
}
```

**Role Options**:
- `administrator` - Full access
- `agent` - Standard agent access

**Response** (201 Created):
```json
{
  "id": 3,
  "name": "New Agent",
  "email": "newagent@example.com",
  "role": "agent",
  "availability": "online",
  "auto_offline": false
}
```

**Notes**:
- Sends invitation email to the agent
- Validates account license limits

---

#### 23. Update Agent

**Endpoint**: `PUT /api/v1/accounts/:account_id/agents/:id`
**Controller**: `Api::V1::Accounts::AgentsController#update`
**Authentication**: Required (Admin role)
**Description**: Updates an agent's information and permissions.

**Request Body**:
```json
{
  "agent": {
    "name": "Updated Name",
    "role": "administrator",
    "availability": "busy",
    "auto_offline": true
  }
}
```

**Response** (200 OK):
```json
{
  "id": 3,
  "name": "Updated Name",
  "role": "administrator",
  "availability": "busy",
  "auto_offline": true
}
```

---

#### 24. Delete Agent

**Endpoint**: `DELETE /api/v1/accounts/:account_id/agents/:id`
**Controller**: `Api::V1::Accounts::AgentsController#destroy`
**Authentication**: Required (Admin role)
**Description**: Removes an agent from the account.

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Only removes the agent from this account
- If agent has no other accounts, user record is deleted

---

#### 25. Bulk Create Agents

**Endpoint**: `POST /api/v1/accounts/:account_id/agents/bulk_create`
**Controller**: `Api::V1::Accounts::AgentsController#bulk_create`
**Authentication**: Required (Admin role)
**Description**: Invites multiple agents at once.

**Request Body**:
```json
{
  "emails": [
    "agent1@example.com",
    "agent2@example.com",
    "agent3@example.com"
  ]
}
```

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Used during account onboarding
- Silently ignores invalid emails
- Validates total license limits before processing

---

## 👥 Contacts API

**Base Path**: `/api/v1/accounts/:account_id/contacts`

### Contact Management

#### 26. List Contacts

**Endpoint**: `GET /api/v1/accounts/:account_id/contacts`
**Controller**: `Api::V1::Accounts::ContactsController#index`
**Authentication**: Required
**Description**: Lists all contacts with pagination and filtering.

**Query Parameters**:
- `page` - Page number (default: 1)
- `labels` - Filter by label names (comma-separated)
- `include_contact_inboxes` - Include inbox associations (default: true)
- `sort` - Sort field (email, name, phone_number, last_activity_at, created_at, company, city, country)

**Headers**:
```
access-token: your-access-token
client: your-client-token
uid: user@example.com
```

**Example Request**:
```
GET /api/v1/accounts/1/contacts?page=1&sort=name&labels=vip,customer
```

**Response** (200 OK):
```json
{
  "payload": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phone_number": "+1234567890",
      "identifier": "CUST001",
      "avatar": "https://example.com/avatar.png",
      "blocked": false,
      "last_activity_at": "2025-01-05T10:30:00Z",
      "created_at": "2024-12-01T08:00:00Z",
      "additional_attributes": {
        "company_name": "Acme Corp",
        "city": "New York",
        "country": "USA"
      },
      "custom_attributes": {
        "customer_type": "premium",
        "lifetime_value": 5000
      },
      "contact_inboxes": [
        {
          "id": 1,
          "inbox_id": 2,
          "source_id": "fb_123456"
        }
      ]
    }
  ],
  "meta": {
    "count": 150,
    "current_page": 1
  }
}
```

**Pagination**: 15 contacts per page

---

#### 27. Search Contacts

**Endpoint**: `GET /api/v1/accounts/:account_id/contacts/search`
**Controller**: `Api::V1::Accounts::ContactsController#search`
**Authentication**: Required
**Description**: Searches contacts by name, email, phone, identifier, or company.

**Query Parameters**:
- `q` - Search query (required)
- `page` - Page number (default: 1)

**Example Request**:
```
GET /api/v1/accounts/1/contacts/search?q=alice
```

**Response** (200 OK):
```json
{
  "payload": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phone_number": "+1234567890"
    }
  ],
  "meta": {
    "count": 1,
    "current_page": 1
  }
}
```

---

#### 28. Filter Contacts

**Endpoint**: `POST /api/v1/accounts/:account_id/contacts/filter`
**Controller**: `Api::V1::Accounts::ContactsController#filter`
**Authentication**: Required
**Description**: Filters contacts using advanced filter criteria.

**Request Body**:
```json
{
  "payload": [
    {
      "attribute_key": "email",
      "filter_operator": "contains",
      "values": ["@example.com"],
      "query_operator": "and"
    },
    {
      "attribute_key": "custom_attributes.customer_type",
      "filter_operator": "equal_to",
      "values": ["premium"],
      "query_operator": "and"
    }
  ],
  "page": 1
}
```

**Filter Operators**:
- `equal_to` - Exact match
- `not_equal_to` - Not equal
- `contains` - Contains substring
- `does_not_contain` - Does not contain
- `is_present` - Has value
- `is_not_present` - Empty/null
- `is_greater_than` - Greater than (numbers/dates)
- `is_less_than` - Less than (numbers/dates)

**Response** (200 OK):
```json
{
  "payload": [...],
  "meta": {
    "count": 25,
    "current_page": 1
  }
}
```

---

#### 29. Get Active Contacts

**Endpoint**: `GET /api/v1/accounts/:account_id/contacts/active`
**Controller**: `Api::V1::Accounts::ContactsController#active`
**Authentication**: Required
**Description**: Returns currently online contacts.

**Response** (200 OK):
```json
{
  "payload": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "online_status": "online"
    }
  ],
  "meta": {
    "count": 5,
    "current_page": 1
  }
}
```

**Use Case**: Shows which contacts are currently active on your website/app

---

#### 30. Import Contacts

**Endpoint**: `POST /api/v1/accounts/:account_id/contacts/import`
**Controller**: `Api::V1::Accounts::ContactsController#import`
**Authentication**: Required (Admin role)
**Description**: Imports contacts from CSV file.

**Request** (multipart/form-data):
```
import_file: [CSV file]
```

**CSV Format**:
```csv
name,email,phone_number,identifier,company_name,city,country
Alice Johnson,alice@example.com,+1234567890,CUST001,Acme Corp,New York,USA
Bob Smith,bob@example.com,+0987654321,CUST002,Tech Inc,San Francisco,USA
```

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Import processed asynchronously
- Creates DataImport record for tracking

---

#### 31. Export Contacts

**Endpoint**: `POST /api/v1/accounts/:account_id/contacts/export`
**Controller**: `Api::V1::Accounts::ContactsController#export`
**Authentication**: Required
**Description**: Exports contacts to CSV (sent via email).

**Request Body**:
```json
{
  "column_names": ["name", "email", "phone_number", "company_name"],
  "payload": [
    {
      "attribute_key": "email",
      "filter_operator": "contains",
      "values": ["@example.com"]
    }
  ],
  "label": "customers"
}
```

**Response** (200 OK):
```
(Empty response body)
```

**Notes**:
- Export processed asynchronously
- CSV file sent to user's email when ready

---

#### 32. Get Contact Details

**Endpoint**: `GET /api/v1/accounts/:account_id/contacts/:id`
**Controller**: `Api::V1::Accounts::ContactsController#show`
**Authentication**: Required
**Description**: Retrieves detailed information about a specific contact.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone_number": "+1234567890",
  "identifier": "CUST001",
  "avatar": "https://example.com/avatar.png",
  "blocked": false,
  "last_activity_at": "2025-01-05T10:30:00Z",
  "created_at": "2024-12-01T08:00:00Z",
  "additional_attributes": {
    "company_name": "Acme Corp",
    "city": "New York",
    "country": "USA",
    "description": "Premium customer",
    "social_profiles": {
      "twitter": "alice_j",
      "linkedin": "alice-johnson"
    }
  },
  "custom_attributes": {
    "customer_type": "premium",
    "lifetime_value": 5000,
    "subscription_plan": "enterprise"
  },
  "contact_inboxes": [
    {
      "id": 1,
      "inbox_id": 2,
      "source_id": "fb_123456",
      "inbox": {
        "id": 2,
        "name": "Facebook Inbox",
        "channel_type": "facebook"
      }
    }
  ]
}
```

---

#### 33. Create Contact

**Endpoint**: `POST /api/v1/accounts/:account_id/contacts`
**Controller**: `Api::V1::Accounts::ContactsController#create`
**Authentication**: Required
**Description**: Creates a new contact.

**Request Body**:
```json
{
  "name": "Charlie Brown",
  "identifier": "CUST003",
  "email": "charlie@example.com",
  "phone_number": "+1122334455",
  "avatar_url": "https://example.com/charlie.png",
  "inbox_id": 1,
  "source_id": "external_123",
  "additional_attributes": {
    "company_name": "Brown & Co",
    "city": "Chicago",
    "country": "USA",
    "description": "New lead from website"
  },
  "custom_attributes": {
    "source": "website",
    "campaign": "summer_2025"
  }
}
```

**Response** (201 Created):
```json
{
  "id": 10,
  "name": "Charlie Brown",
  "email": "charlie@example.com",
  "phone_number": "+1122334455",
  "identifier": "CUST003",
  "additional_attributes": {
    "company_name": "Brown & Co"
  },
  "custom_attributes": {
    "source": "website"
  }
}
```

**Notes**:
- `inbox_id` creates a contact inbox association
- `avatar_url` downloads avatar asynchronously

---

#### 34. Update Contact

**Endpoint**: `PUT /api/v1/accounts/:account_id/contacts/:id`
**Controller**: `Api::V1::Accounts::ContactsController#update`
**Authentication**: Required
**Description**: Updates contact information.

**Request Body**:
```json
{
  "name": "Alice Johnson Updated",
  "email": "alice.new@example.com",
  "phone_number": "+1234567899",
  "blocked": false,
  "additional_attributes": {
    "company_name": "New Acme Corp",
    "city": "Los Angeles"
  },
  "custom_attributes": {
    "customer_type": "enterprise",
    "lifetime_value": 10000
  }
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Alice Johnson Updated",
  "email": "alice.new@example.com",
  "custom_attributes": {
    "customer_type": "enterprise",
    "lifetime_value": 10000
  }
}
```

**Notes**:
- Custom attributes are merged, not replaced
- Additional attributes are merged, not replaced

---

#### 35. Delete Contact

**Endpoint**: `DELETE /api/v1/accounts/:account_id/contacts/:id`
**Controller**: `Api::V1::Accounts::ContactsController#destroy`
**Authentication**: Required
**Description**: Deletes a contact.

**Response** (200 OK):
```
(Empty response body)
```

**Error Response** (422 Unprocessable Entity):
```json
{
  "message": "Cannot delete Alice Johnson while online"
}
```

**Notes**:
- Cannot delete contacts who are currently online
- Deletes all associated conversations and messages

---

#### 36. Get Contactable Inboxes

**Endpoint**: `GET /api/v1/accounts/:account_id/contacts/:id/contactable_inboxes`
**Controller**: `Api::V1::Accounts::ContactsController#contactable_inboxes`
**Authentication**: Required
**Description**: Lists inboxes where this contact can be reached.

**Response** (200 OK):
```json
[
  {
    "inbox": {
      "id": 1,
      "name": "Website Inbox",
      "channel_type": "web"
    },
    "source_id": "web_visitor_123"
  },
  {
    "inbox": {
      "id": 2,
      "name": "Facebook Messenger",
      "channel_type": "facebook"
    },
    "source_id": "fb_123456789"
  }
]
```

---

#### 37. Delete Contact Avatar

**Endpoint**: `DELETE /api/v1/accounts/:account_id/contacts/:id/avatar`
**Controller**: `Api::V1::Accounts::ContactsController#avatar`
**Authentication**: Required
**Description**: Removes the contact's avatar image.

**Response** (200 OK):
```json
{
  "id": 1,
  "avatar": null
}
```

---

#### 38. Delete Custom Attributes

**Endpoint**: `POST /api/v1/accounts/:account_id/contacts/:id/destroy_custom_attributes`
**Controller**: `Api::V1::Accounts::ContactsController#destroy_custom_attributes`
**Authentication**: Required
**Description**: Removes specific custom attributes from a contact.

**Request Body**:
```json
{
  "custom_attributes": ["old_field_1", "deprecated_field_2"]
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "custom_attributes": {
    "customer_type": "premium"
  }
}
```

---

### Contact Sub-Resources

#### 39. Get Contact Conversations

**Endpoint**: `GET /api/v1/accounts/:account_id/contacts/:id/conversations`
**Controller**: `Api::V1::Accounts::Contacts::ConversationsController#index`
**Authentication**: Required
**Description**: Lists all conversations for a contact.

**Response** (200 OK):
```json
[
  {
    "id": 100,
    "inbox_id": 1,
    "status": "open",
    "created_at": "2025-01-05T09:00:00Z",
    "messages_count": 15
  },
  {
    "id": 99,
    "inbox_id": 2,
    "status": "resolved",
    "created_at": "2024-12-20T14:30:00Z",
    "messages_count": 8
  }
]
```

---

#### 40. Create Contact Inbox

**Endpoint**: `POST /api/v1/accounts/:account_id/contacts/:id/contact_inboxes`
**Controller**: `Api::V1::Accounts::Contacts::ContactInboxesController#create`
**Authentication**: Required
**Description**: Associates a contact with an inbox.

**Request Body**:
```json
{
  "inbox_id": 3,
  "source_id": "whatsapp_+1234567890"
}
```

**Response** (201 Created):
```json
{
  "id": 5,
  "contact_id": 1,
  "inbox_id": 3,
  "source_id": "whatsapp_+1234567890"
}
```

---

#### 41. List Contact Labels

**Endpoint**: `GET /api/v1/accounts/:account_id/contacts/:id/labels`
**Controller**: `Api::V1::Accounts::Contacts::LabelsController#index`
**Authentication**: Required
**Description**: Lists all labels assigned to a contact.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "VIP",
    "color": "#FF0000",
    "description": "VIP customers"
  },
  {
    "id": 5,
    "title": "Support",
    "color": "#00FF00",
    "description": "Support contacts"
  }
]
```

---

#### 42. Add Contact Labels

**Endpoint**: `POST /api/v1/accounts/:account_id/contacts/:id/labels`
**Controller**: `Api::V1::Accounts::Contacts::LabelsController#create`
**Authentication**: Required
**Description**: Adds labels to a contact.

**Request Body**:
```json
{
  "labels": ["VIP", "Premium Customer", "North America"]
}
```

**Response** (200 OK):
```json
{
  "labels": ["VIP", "Premium Customer", "North America"]
}
```

---

#### 43. List Contact Notes

**Endpoint**: `GET /api/v1/accounts/:account_id/contacts/:id/notes`
**Controller**: `Api::V1::Accounts::Contacts::NotesController#index`
**Authentication**: Required
**Description**: Lists all notes for a contact.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "content": "Customer requested callback on Monday",
    "user": {
      "id": 2,
      "name": "Agent John"
    },
    "created_at": "2025-01-05T11:00:00Z"
  }
]
```

---

#### 44. Create Contact Note

**Endpoint**: `POST /api/v1/accounts/:account_id/contacts/:id/notes`
**Controller**: `Api::V1::Accounts::Contacts::NotesController#create`
**Authentication**: Required
**Description**: Adds a note to a contact.

**Request Body**:
```json
{
  "content": "Follow up with customer about enterprise plan upgrade"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "content": "Follow up with customer about enterprise plan upgrade",
  "user": {
    "id": 1,
    "name": "Current User"
  },
  "created_at": "2025-01-06T10:00:00Z"
}
```

---

#### 45. Update Contact Note

**Endpoint**: `PUT /api/v1/accounts/:account_id/contacts/:id/notes/:note_id`
**Controller**: `Api::V1::Accounts::Contacts::NotesController#update`
**Authentication**: Required
**Description**: Updates an existing contact note.

**Request Body**:
```json
{
  "content": "Updated note content"
}
```

**Response** (200 OK):
```json
{
  "id": 2,
  "content": "Updated note content"
}
```

---

#### 46. Delete Contact Note

**Endpoint**: `DELETE /api/v1/accounts/:account_id/contacts/:id/notes/:note_id`
**Controller**: `Api::V1::Accounts::Contacts::NotesController#destroy`
**Authentication**: Required
**Description**: Deletes a contact note.

**Response** (200 OK):
```
(Empty response body)
```

---

## 🔌 WebSocket Channels

### RoomChannel

**Channel**: `RoomChannel`
**File**: `app/channels/room_channel.rb`
**Description**: Real-time updates for conversations, messages, and presence.

#### Connection

**URL**: `ws://your-domain/cable`

**Parameters**:
- `pubsub_token` - User/Contact pubsub token (required)
- `user_id` - User ID (for agents/admins)
- `account_id` - Account ID (for agents/admins)

**Example Connection** (JavaScript):
```javascript
const cable = ActionCable.createConsumer('ws://localhost:3000/cable');

const subscription = cable.subscriptions.create({
  channel: 'RoomChannel',
  pubsub_token: 'user-pubsub-token-here',
  user_id: 1,
  account_id: 1
}, {
  connected() {
    console.log('Connected to RoomChannel');
  },

  received(data) {
    console.log('Received:', data);
    // Handle different event types
    switch(data.event) {
      case 'presence.update':
        handlePresenceUpdate(data.data);
        break;
      case 'conversation.created':
        handleNewConversation(data.data);
        break;
      case 'message.created':
        handleNewMessage(data.data);
        break;
    }
  }
});
```

---

#### Events Received

##### 1. Presence Update

**Event**: `presence.update`
**Description**: Notifies when users/contacts go online/offline.

**Payload**:
```json
{
  "event": "presence.update",
  "data": {
    "account_id": 1,
    "users": {
      "1": "online",
      "2": "busy",
      "3": "offline"
    },
    "contacts": {
      "10": "online",
      "11": "online"
    }
  }
}
```

---

##### 2. Conversation Created

**Event**: `conversation.created`
**Description**: New conversation created.

**Payload**:
```json
{
  "event": "conversation.created",
  "data": {
    "id": 100,
    "inbox_id": 1,
    "contact_id": 10,
    "status": "open",
    "assignee_id": null,
    "created_at": "2025-01-06T10:00:00Z"
  }
}
```

---

##### 3. Message Created

**Event**: `message.created`
**Description**: New message in a conversation.

**Payload**:
```json
{
  "event": "message.created",
  "data": {
    "id": 500,
    "conversation_id": 100,
    "content": "Hello, I need help",
    "message_type": "incoming",
    "created_at": "2025-01-06T10:01:00Z",
    "sender": {
      "id": 10,
      "name": "Alice Johnson",
      "type": "contact"
    }
  }
}
```

---

##### 4. Conversation Status Changed

**Event**: `conversation.status_changed`
**Description**: Conversation status updated.

**Payload**:
```json
{
  "event": "conversation.status_changed",
  "data": {
    "id": 100,
    "status": "resolved",
    "updated_at": "2025-01-06T10:30:00Z"
  }
}
```

---

##### 5. Conversation Assigned

**Event**: `conversation.assigned`
**Description**: Conversation assigned to an agent.

**Payload**:
```json
{
  "event": "conversation.assigned",
  "data": {
    "id": 100,
    "assignee_id": 2,
    "assignee": {
      "id": 2,
      "name": "Agent Jane"
    }
  }
}
```

---

##### 6. Typing Status

**Event**: `conversation.typing_on` / `conversation.typing_off`
**Description**: User is typing or stopped typing.

**Payload**:
```json
{
  "event": "conversation.typing_on",
  "data": {
    "conversation_id": 100,
    "user": {
      "id": 1,
      "name": "Agent John",
      "type": "user"
    }
  }
}
```

---

#### Client Actions

##### Update Presence

**Method**: `update_presence()`
**Description**: Manually trigger presence update.

```javascript
subscription.perform('update_presence');
```

---

## 🎯 AI Agent Use Cases

### Recommended Endpoints for AI Integration

#### 1. **Contact Management**
- `POST /api/v1/accounts/:account_id/contacts` - Create contacts from conversations
- `GET /api/v1/accounts/:account_id/contacts/search` - Find existing contacts
- `PUT /api/v1/accounts/:account_id/contacts/:id` - Update contact information
- `POST /api/v1/accounts/:account_id/contacts/:id/notes` - Add context notes

#### 2. **User Information Retrieval**
- `GET /api/v1/profile` - Get current user context
- `GET /api/v1/accounts/:account_id/agents` - List available agents
- `GET /api/v1/accounts/:account_id/assignable_agents` - Find agents for assignment

#### 3. **Account Context**
- `GET /api/v1/accounts/:id` - Get account settings and configuration
- `GET /api/v1/accounts/:id/cache_keys` - Check for data updates

#### 4. **Real-time Updates**
- WebSocket `RoomChannel` - Listen for new conversations and messages
- `presence.update` events - Track online status

#### 5. **Bulk Operations**
- `POST /api/v1/accounts/:account_id/contacts/filter` - Advanced filtering
- `POST /api/v1/accounts/:account_id/contacts/export` - Data extraction
- `POST /api/v1/accounts/:account_id/agents/bulk_create` - Team onboarding

---

## 📝 Notes

### Rate Limiting
- Not explicitly defined in controllers
- Consider implementing client-side throttling

### Pagination
- Standard: 15 items per page for contacts
- Use `page` parameter for navigation
- Check `meta.count` for total items

### Error Handling
- 401 Unauthorized - Invalid/missing auth tokens
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource doesn't exist
- 422 Unprocessable Entity - Validation errors
- 500 Internal Server Error - Server issues

### Best Practices for AI Agents
1. **Cache account/user context** - Reduce redundant API calls
2. **Use WebSocket for real-time** - More efficient than polling
3. **Filter before fetching** - Use search/filter endpoints
4. **Batch operations** - Use bulk endpoints when possible
5. **Handle async operations** - Import/export are background jobs

---

## 📚 Related Documentation

This is **Part 1 of 4** in the Chatwoot API documentation series.

**Coming Next**:
- Part 2/4: Conversations, Messages, Inboxes
- Part 3/4: Teams, Agents, Reports, Webhooks
- Part 4/4: Integrations, Automation, WebSocket Events

---

**Generated**: 2025-01-06
**Chatwoot Version**: Latest (as of documentation date)
**API Version**: v1, v2, Platform API v1
