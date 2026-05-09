# KodaX — Internal System Flows

> Developer reference documenting the logic flow behind every backend operation.

---

## 🔐 Authentication Flows

### JWT Strategy

```
🔹 Login / Register / OAuth
1. User provides credentials (or OAuth token/code)
2. Backend verifies credentials
3. Generate JWT → { userId }
4. Send token as httpOnly cookie

🔹 Protected Route Access
1. Frontend sends request (cookie auto-attached)
2. authMiddleware verifies JWT from cookie (or Authorization header)
3. Extract userId from token payload
4. Attach userId to req.user
5. Next middleware/controller processes request
```

> **Design Decision:** We store only `{ userId }` in the JWT because:
> - ❌ **Not email** — Emails can change, are slightly larger payload, and aren't needed for DB queries
> - ❌ **Not provider** — Not required for authentication, adds unnecessary complexity, can always be fetched from DB
> - ✅ **userId** — Immutable, minimal payload, directly usable for DB lookups

---

### Register Flow (Local)
1. Get data (username, email, password)
2. Validate input — all fields required
3. Check if user already exists (`email` or `username`)
4. Hash password (`bcrypt`, 10 salt rounds)
5. Create user in DB with `providers: [{ name: "local" }]`
6. Generate JWT (`expiresIn: '7d'`)
7. Send token as httpOnly cookie + user data in response

### Login Flow (Local)
1. Get email + password
2. Find user by email
3. If not found → `404` error
4. If user has no password (OAuth-only user) → "Use Google login" error
5. Compare password (`bcrypt.compare`)
6. If wrong → `401` error
7. Generate JWT (`expiresIn: '7d'`)
8. Send cookie + response

### Google OAuth Flow
1. Receive `credential` (ID token) or `access_token` from frontend
2. If `credential`: Verify ID token via `google-auth-library`
3. If `access_token`: Fetch user info from Google's userinfo endpoint
4. Extract `email`, `name`, `picture`, `sub` (Google ID)
5. Find existing user by email
6. If new user → generate unique username, create user with `providers: [{ name: "google", providerId: sub }]`
7. If existing user → link Google provider if not already linked
8. Generate JWT and send cookie

### GitHub OAuth Flow
1. Receive authorization `code` from frontend callback
2. Exchange code for `access_token` via GitHub's OAuth endpoint
3. Fetch user profile from `api.github.com/user`
4. Fetch user emails from `api.github.com/user/emails` (handles private emails)
5. Extract primary email, name/login, avatar_url, GitHub ID
6. Find existing user by email
7. If new user → generate unique username, create user with `providers: [{ name: "github", providerId: id }]`
8. If existing user → link GitHub provider if not already linked
9. Generate JWT and send cookie

### Logout Flow
1. Clear cookie (set to empty, `httpOnly`, `sameSite: 'lax'`)
2. Send success response

### Get Me Flow (Profile Fetch)
1. Verify JWT via `authMiddleware`
2. Find user by `req.user.userId`, exclude password field
3. Return user profile data

---

## 🏠 Room Management Flows

### Create Room
1. Verify user (middleware)
2. Get data (title, description, language, visibility)
3. Validate input (title required, valid visibility)
4. Generate unique roomId using `uuid`
5. Create room in DB (owner = logged-in user, added as first member with role `owner`)
6. Return room data

> **Note:** For the sharable link, we use `uuid` to generate a unique roomId instead of the database `_id`. This keeps the roomId separate from the database and avoids exposing internal IDs.

### Get My Rooms
1. User must be logged in (verifyToken)
2. Get userId from `req.user`
3. Find all rooms where `members.user` includes userId
4. Return list of rooms

### Get Room By ID
1. Verify user (middleware)
2. Find room by `roomId` param
3. Verify user is a member of the room
4. Return room details (with populated member data)

### Search Rooms (Global)
1. Get search query (`q`) from query params
2. Set base filter: only `public` rooms
3. If query exists, apply full-text search (`$text` index on title, description, language)
4. Fetch rooms and return list

### Join Room (Request)

```text
User clicks Join
    ↓
Frontend sends request
    ↓
Backend validates:
  - Room exists?
  - Already a member? → reject
  - Already pending? → reject
  - Room full? (maxUsers) → reject
    ↓
Is room public?
  ├── YES ──► Add directly as member (role: "member")
  └── NO ───► Add user to pendingRequests array
                    ↓
              Notify moderators/owner (via socket if connected)
                    ↓
              Moderator approves/rejects
                    ↓
              User becomes member (if approved)
```

### Get Pending Requests
1. Verify user (middleware)
2. Check if requester is `owner` or `moderator`
3. Populate and return `pendingRequests` array with user data

### Approve Join Request
1. Verify user (middleware)
2. Check moderator/owner access
3. Verify request is pending
4. Verify room is not full
5. Remove user from `pendingRequests`
6. Add user to `members` with role `member`
7. Save room

### Reject Join Request
1. Verify user (middleware)
2. Check moderator/owner access
3. Verify request is pending
4. Remove user from `pendingRequests`
5. Save room

### Leave Room
1. Verify user (middleware)
2. Check user is a member
3. If user is the owner → handle ownership (error or transfer)
4. Remove user from `members` array
5. Save room

### Remove Member (Kick)
1. Verify user (middleware)
2. Check requester is `owner` or `moderator`
3. Check target user is a member
4. Cannot remove the owner
5. Remove target from `members`
6. Save room

---

## ⚙️ Advanced Room Administration Flows

### Promote to Moderator (Owner only)
1. Verify user (middleware)
2. Check if requester is the `owner`
3. Check if target user is currently a `member`
4. Change target user role to `moderator`
5. Save room

### Demote Moderator (Owner only)
1. Verify user (middleware)
2. Check if requester is the `owner`
3. Check if target user is currently a `moderator`
4. Change target user role to `member`
5. Save room

### Transfer Ownership (Owner only)
1. Verify user (middleware)
2. Check if requester is the `owner`
3. Check if target user is a member of the room
4. Change target user role to `owner`
5. Change requester role to `moderator`
6. Save room

### Update Room Settings (Owner or Moderator)
1. Verify user (middleware)
2. Check if requester is `owner` or `moderator`
3. Update allowed fields (`title`, `description`, `visibility`, `allowGuests`, `maxUsers`)
4. Save room

### Delete Room (Owner only)
1. Verify user (middleware)
2. Check if requester is the `owner`
3. Delete all associated messages (`MessageModel.deleteMany`)
4. Delete the room (`Room.deleteOne`)

---

## 💬 Chat Flow

```text
User opens room
    ↓
GET /api/chat/:roomId  (REST API)
    ↓
Backend validates room exists & user is member
    ↓
Backend fetches messages using internal room _id
    ↓
Messages loaded (populated with sender data)
    ↓
Socket connects
    ↓
User sends message (socket event: "send_message")
    ↓
Server saves message to DB (with sender & room reference)
    ↓
Server populates sender data
    ↓
Broadcast "receive_message" to room
    ↓
All users update UI instantly
```

---

## 📝 Code Sync Flow

### REST API (Initial Load / Manual Save)
1. Verify user (middleware)
2. Get `roomId` from params
3. Fetch room & validate user is a member
4. **GET:** Return `code`, `language`, and `files` array
5. **PUT:** Validate input and `language` (must be in allowed enum), update `code` and `language`, save room

### WebSocket (Real-time Sync)

```text
User types in editor
    ↓
Frontend emits "code_change" { roomId, fileId?, code }
    ↓
Server validates membership
    ↓
If fileId provided → update specific file's code
Else → update legacy room.code
    ↓
Save to DB immediately
    ↓
Broadcast "code_updated" { fileId, code, userId } to room
    ↓
All other users' editors update instantly
```

### Language Change Flow
```text
User changes language selector
    ↓
Frontend emits "language_change" { roomId, fileId?, language }
    ↓
Server validates & updates DB (file-specific or room-level)
    ↓
Broadcast "language_updated" { fileId, language, userId } to room
```

### File Management Flow
```text
Add File:    emit "add_file" { roomId, file } → saves to DB → broadcast "file_added"
Delete File: emit "delete_file" { roomId, fileId } → removes from DB → broadcast "file_deleted"
```

---

## ▶️ Code Execution Flow (JDoodle)

```text
User clicks "Run" button
    ↓
Frontend emits "run_code" { roomId, code, language }
    ↓
Server verifies membership
    ↓
Broadcast "code_running" { userId, language } to notify all users
    ↓
Map language to JDoodle language identifier
    ↓
POST to api.jdoodle.com/v1/execute with:
  - clientId, clientSecret
  - script (code)
  - language, versionIndex
    ↓
Receive execution result
    ↓
Broadcast "code_result" { output, error } to entire room
```

**Supported Languages:** JavaScript (Node.js), Python 3, Java, C++ (C++17), C, Ruby, Go, PHP

---

## 🖱️ Presence & Cursor Flow

### User Online/Offline
```text
Socket connects → socketAuth middleware verifies JWT
    ↓
"connection" event → userOnlineHandler saves socketId to User model
    ↓
"disconnect" event → clear socketId & currentRoom from User model
                    → broadcast "user_offline" to room
```

### Cursor Tracking
```text
User moves cursor in editor
    ↓
Frontend emits "cursor_move" { roomId, position }
    ↓
Server broadcasts "cursor_updated" { userId, socketId, position } to room
    ↓
Other users render cursor overlay in their editors
```

### Typing Indicator
```text
User starts typing in chat
    ↓
Frontend emits "typing" { roomId }
    ↓
Server broadcasts "user_typing" { userId } to room
    ↓
Other users see "typing..." indicator
```

---

## 🏗 Architecture Diagrams

### Authentication Flow
```text
Register/Login/OAuth → Validate → Hash Password (bcrypt) → Generate JWT { userId }
                                                                  │
                                                 Set httpOnly Cookie ──► Client
                                                                  │
                                    Protected Routes ◄── verifyToken middleware
                                          │
                                 Extract userId from JWT → Attach to req.user
```

### Room Join Flow
```text
User clicks Join Link
        │
        ▼
  Is room public? ──── YES ──► Add directly as member
        │
        NO
        │
        ▼
  Add to pendingRequests ──► Notify Owner/Moderator
                                      │
                              Approve─┤─ Reject
                                │           │
                          Add to members    Remove from pending
```

### Real-time Sync Flow
```text
User A types code
        │
        ▼
  Emit "code_change" via Socket.io
        │
        ▼
  Server saves to MongoDB instantly
        │
        ▼
  Broadcast "code_updated" to room
        │
        ▼
  User B, C, D editors update in real-time
```
