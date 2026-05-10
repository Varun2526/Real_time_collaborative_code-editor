
# KodaX — API Use Cases & Request/Response Reference

> Complete reference for every REST API endpoint with example requests, payloads, and responses.

---

## 🔐 Authentication Endpoints

---

### 1. REGISTER

**Endpoint:** `POST /api/auth/register`

**Purpose:** Register a new user with local credentials.

**Request Body:**
```json
{
  "username": "varun",
  "email": "varun@mail.com",
  "password": "securePass123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "payload": {
    "username": "varun",
    "id": "664abc123def456ghi789",
    "email": "varun@mail.com"
  }
}
```

**Error Responses:**
| Code | Scenario |
|------|----------|
| `400` | Missing required fields |
| `409` | Username or email already exists |

> **Note:** A JWT cookie (`token`) is automatically set on successful registration.

---

### 2. LOGIN

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "varun@mail.com",
  "password": "securePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "payload": {
    "id": "664abc123def456ghi789",
    "username": "varun",
    "email": "varun@mail.com"
  }
}
```

**Error Responses:**
| Code | Scenario |
|------|----------|
| `400` | Missing email or password / OAuth-only account ("Use Google login") |
| `404` | User not found |
| `401` | Invalid credentials |

---

### 3. GOOGLE LOGIN

**Endpoint:** `POST /api/auth/google`

**Request Body (Option A — ID Token):**
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body (Option B — Access Token):**
```json
{
  "access_token": "ya29.a0AfH6SMB..."
}
```

**Success Response (200):**
```json
{
  "message": "Google Login successful",
  "payload": {
    "id": "664abc123def456ghi789",
    "username": "varun",
    "email": "varun@gmail.com",
    "profilePic": "https://lh3.googleusercontent.com/..."
  }
}
```

> **Behavior:** If the email doesn't exist, a new account is created. If the email exists, the Google provider is linked to the existing account.

---

### 4. GITHUB LOGIN

**Endpoint:** `POST /api/auth/github`

**Request Body:**
```json
{
  "code": "abc123def456"
}
```

> The `code` is the authorization code received from GitHub's OAuth callback redirect.

**Success Response (200):**
```json
{
  "message": "GitHub Login successful",
  "payload": {
    "id": "664abc123def456ghi789",
    "username": "varun2526",
    "email": "varun@mail.com",
    "profilePic": "https://avatars.githubusercontent.com/u/..."
  }
}
```

> **Flow:** Frontend redirects to GitHub → User authorizes → GitHub redirects back with `code` → Frontend sends `code` to this endpoint → Backend exchanges code for access token → Fetches user profile & emails.

---

### 5. LOGOUT

**Endpoint:** `POST /api/auth/logout`

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

> Clears the `token` cookie.

---

### 6. GET ME (Current User Profile)

**Endpoint:** `GET /api/auth/me`
**Auth:** ✅ Required (JWT cookie)

**Success Response (200):**
```json
{
  "message": "Access granted",
  "user": {
    "id": "664abc123def456ghi789",
    "username": "varun",
    "email": "varun@mail.com",
    "profilePic": null
  }
}
```

---

## 🏠 Room Management Endpoints

---

### 7. CREATE ROOM

**Endpoint:** `POST /api/room/create`
**Auth:** ✅ Required

**Request Body:**
```json
{
  "title": "Backend Debug Session",
  "description": "Fixing the auth middleware",
  "language": "javascript",
  "visibility": "private"
}
```

**Success Response (201):**
```json
{
  "message": "Room created successfully",
  "payload": {
    "roomId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Backend Debug Session",
    "description": "Fixing the auth middleware",
    "language": "javascript",
    "visibility": "private",
    "members": [
      {
        "user": "664abc123def456ghi789",
        "role": "owner",
        "joinedAt": "2026-05-09T10:00:00.000Z"
      }
    ]
  }
}
```

**Database Entry:**
```js
Room {
    roomId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    title: "Backend Debug Session",
    code: "",
    files: [],
    language: "javascript",
    visibility: "private",
    members: [
        { user: "664abc123...", role: "owner" }
    ],
    pendingRequests: [],
    settings: { allowGuests: false, maxUsers: 10 }
}
```

---

### 8. GET MY ROOMS

**Endpoint:** `GET /api/room/my-rooms`
**Auth:** ✅ Required

**Query:** Finds all rooms where `members.user` includes the logged-in user.

**Success Response (200):**
```json
{
  "message": "Rooms fetched successfully",
  "payload": [
    {
      "roomId": "f47ac10b-...",
      "title": "Backend Debug Session",
      "language": "javascript",
      "visibility": "private",
      "members": [...]
    }
  ]
}
```

---

### 9. SEARCH ROOMS (Global)

**Endpoint:** `GET /api/room/search?q=javascript`
**Auth:** ✅ Required

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search term (searches title, description, language) |

> Only returns `public` rooms. Uses MongoDB `$text` index.

**Success Response (200):**
```json
{
  "message": "Rooms found",
  "payload": [...]
}
```

---

### 10. GET ROOM BY ID

**Endpoint:** `GET /api/room/:roomId`
**Auth:** ✅ Required

**Access Rules:**
| Role | Access |
|------|--------|
| Owner | ✅ |
| Moderator | ✅ |
| Member | ✅ |
| Pending | ❌ |
| Non-member | ❌ |

**Success Response (200):**
```json
{
  "message": "Room fetched successfully",
  "payload": {
    "roomId": "f47ac10b-...",
    "title": "Backend Debug Session",
    "code": "console.log('hello');",
    "files": [
      { "id": "abc123", "name": "index.js", "language": "javascript", "code": "..." }
    ],
    "language": "javascript",
    "members": [
      {
        "user": { "_id": "...", "username": "varun", "email": "..." },
        "role": "owner"
      }
    ]
  }
}
```

---

### 11. REQUEST JOIN ROOM

**Endpoint:** `POST /api/room/:roomId/request-join`
**Auth:** ✅ Required

**Validation Checks:**
- Room exists
- User is not already a member
- User is not already pending
- Room is not full (`maxUsers`)

**Public Room → Auto-join:**
```json
{
  "message": "Joined room successfully"
}
```

**Private Room → Added to pending:**
```json
{
  "message": "Join request sent successfully"
}
```

**Database Update (Private):**
```js
// Before
pendingRequests: []

// After
pendingRequests: ["664abc123def456ghi789"]
```

---

### 12. GET PENDING REQUESTS

**Endpoint:** `GET /api/room/:roomId/pending`
**Auth:** ✅ Required (Owner or Moderator)

**Success Response (200):**
```json
{
  "message": "Pending requests fetched successfully",
  "payload": [
    {
      "_id": "664abc123def456ghi789",
      "username": "newuser",
      "email": "newuser@mail.com"
    }
  ]
}
```

---

### 13. APPROVE JOIN REQUEST

**Endpoint:** `POST /api/room/:roomId/approve/:userId`
**Auth:** ✅ Required (Owner or Moderator)

**Validation:**
- Room exists, moderator access, request is pending, room not full

**Database Update:**
```js
// Before
pendingRequests: ["664abc123..."]

// After
pendingRequests: []
members: [..., { user: "664abc123...", role: "member" }]
```

**Success Response (200):**
```json
{
  "message": "Join request approved successfully"
}
```

---

### 14. REJECT JOIN REQUEST

**Endpoint:** `POST /api/room/:roomId/reject/:userId`
**Auth:** ✅ Required (Owner or Moderator)

**Database Update:**
```js
// Before
pendingRequests: ["664abc123..."]

// After
pendingRequests: []
```

**Success Response (200):**
```json
{
  "message": "Join request rejected successfully"
}
```

---

### 15. LEAVE ROOM

**Endpoint:** `POST /api/room/:roomId/leave`
**Auth:** ✅ Required

User voluntarily leaves the room. Owners may need to transfer ownership first.

**Success Response (200):**
```json
{
  "message": "Left room successfully"
}
```

---

### 16. REMOVE MEMBER (Kick)

**Endpoint:** `POST /api/room/:roomId/remove/:userId`
**Auth:** ✅ Required (Owner or Moderator)

Forcefully removes a member from the room. Cannot remove the owner.

**Success Response (200):**
```json
{
  "message": "Member removed successfully"
}
```

---

### 17. PROMOTE TO MODERATOR

**Endpoint:** `PATCH /api/room/:roomId/promote/:userId`
**Auth:** ✅ Required (Owner only)

Changes target user's role from `member` → `moderator`.

**Success Response (200):**
```json
{
  "message": "Member promoted to moderator"
}
```

---

### 18. DEMOTE MODERATOR

**Endpoint:** `PATCH /api/room/:roomId/demote/:userId`
**Auth:** ✅ Required (Owner only)

Changes target user's role from `moderator` → `member`.

**Success Response (200):**
```json
{
  "message": "Moderator demoted to member"
}
```

---

### 19. TRANSFER OWNERSHIP

**Endpoint:** `PATCH /api/room/:roomId/transfer-ownership/:userId`
**Auth:** ✅ Required (Owner only)

Transfers owner role to the target user. Current owner becomes `moderator`.

**Database Update:**
```js
// Before
members: [
  { user: "ownerA", role: "owner" },
  { user: "userB", role: "member" }
]

// After
members: [
  { user: "ownerA", role: "moderator" },
  { user: "userB", role: "owner" }
]
```

**Success Response (200):**
```json
{
  "message": "Ownership transferred successfully"
}
```

---

### 20. UPDATE ROOM SETTINGS

**Endpoint:** `PATCH /api/room/:roomId/settings`
**Auth:** ✅ Required (Owner or Moderator)

**Request Body (all optional):**
```json
{
  "title": "Updated Title",
  "description": "New description",
  "visibility": "public",
  "allowGuests": true,
  "maxUsers": 20
}
```

**Success Response (200):**
```json
{
  "message": "Room settings updated"
}
```

---

### 21. DELETE ROOM

**Endpoint:** `DELETE /api/room/:roomId`
**Auth:** ✅ Required (Owner only)

Permanently deletes the room and all associated messages.

**Success Response (200):**
```json
{
  "message": "Room deleted successfully"
}
```

---

## 💬 Chat Endpoints

---

### 22. GET MESSAGES

**Endpoint:** `GET /api/chat/:roomId`
**Auth:** ✅ Required (room member)

Fetches chat message history for a room, populated with sender data.

**Success Response (200):**
```json
{
  "message": "Messages fetched",
  "payload": [
    {
      "_id": "...",
      "roomId": "...",
      "sender": {
        "_id": "...",
        "username": "varun"
      },
      "message": "Hey team, check out this fix!",
      "createdAt": "2026-05-09T10:30:00.000Z"
    }
  ]
}
```

---

## 📝 Code Endpoints

---

### 23. GET CODE

**Endpoint:** `GET /api/code/:roomId`
**Auth:** ✅ Required (room member)

Fetches the current code state and language for a room.

**Success Response (200):**
```json
{
  "message": "Code fetched",
  "payload": {
    "code": "console.log('hello');",
    "language": "javascript",
    "files": [
      {
        "id": "file-1",
        "name": "index.js",
        "language": "javascript",
        "code": "console.log('hello');"
      }
    ]
  }
}
```

---

### 24. SAVE CODE

**Endpoint:** `PUT /api/code/:roomId`
**Auth:** ✅ Required (room member)

**Request Body:**
```json
{
  "code": "print('Hello, World!')",
  "language": "python"
}
```

**Allowed Languages:**
`javascript`, `python`, `java`, `c++`, `c`, `ruby`, `go`, `php`

**Success Response (200):**
```json
{
  "message": "Code saved successfully"
}
```

---

## 📊 Database Schemas

### User Schema
```js
{
  username:    String (unique, required),
  email:       String (unique, required, lowercase),
  password:    String (required only for local auth),
  profilePic:  String (default: null),
  providers:   [{ name: "local"|"google"|"github", providerId: String }],
  socketId:    String (default: null),
  currentRoom: String (default: null),
  createdAt:   Date,
  updatedAt:   Date
}
```

### Room Schema
```js
{
  roomId:          String (unique, UUID),
  title:           String (required, max 100),
  description:     String (max 300),
  code:            String (legacy single-file),
  files:           [{ id, name, language, code }],
  language:        String (enum of 8 languages),
  members:         [{ user: ObjectId, role: "owner"|"moderator"|"member", joinedAt: Date }],
  pendingRequests: [ObjectId],
  visibility:      "public" | "private",
  settings: {
    allowGuests:   Boolean (default: false),
    maxUsers:      Number (default: 10)
  },
  createdAt:       Date,
  updatedAt:       Date
}
```

### Message Schema
```js
{
  roomId:    ObjectId (ref: Room),
  sender:    ObjectId (ref: User),
  message:   String (max 1000),
  createdAt: Date,
  updatedAt: Date
}
```
