# 🖥️ KodaX — Backend

> Node.js + Express v5 + Socket.IO + MongoDB backend engine for the KodaX real-time collaborative code editor.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_v9-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongoosejs.com/)

---

## 📖 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Directory Structure](#directory-structure)
- [API Reference](#api-reference)
- [Socket.IO Events](#socketio-events)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [RBAC — Roles & Permissions](#rbac--roles--permissions)
- [Code Execution](#code-execution)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Scripts](#scripts)

---

## Architecture Overview

```
server.js  ──────► HTTP Server
               │
               ├──► Express App (app.js)
               │       ├── CORS middleware
               │       ├── cookie-parser
               │       ├── /api/auth   → authRoutes
               │       ├── /api/room   → roomRoutes
               │       ├── /api/chat   → chatRoutes
               │       ├── /api/code   → codeRoutes
               │       ├── 404 handler
               │       └── Global error handler
               │
               └──► Socket.IO Server
                       ├── socketAuth middleware (JWT)
                       ├── presence handlers (online/offline)
                       ├── room handlers (join/leave/code/chat/run)
                       └── request handlers (join requests)
```

---

## Directory Structure

```
backend/
├── config/
│   └── db.js                   # Mongoose connection to MongoDB
├── controllers/
│   ├── authController.js        # Auth logic (register/login/OAuth/logout/me)
│   ├── chatController.js        # Fetch chat history for a room
│   ├── codeController.js        # Fetch/save code state
│   └── roomController.js        # Room CRUD + join flow + admin actions
├── middleware/
│   └── authMiddleware.js        # verifyToken: JWT from cookie or Bearer header
├── models/
│   ├── User.js                  # User schema (multi-provider auth)
│   ├── Room.js                  # Room schema (files, members, settings)
│   └── Message.js               # Chat message schema
├── routes/
│   ├── authRoutes.js            # /api/auth endpoints
│   ├── chatRoutes.js            # /api/chat endpoints
│   ├── codeRoutes.js            # /api/code endpoints
│   └── roomRoutes.js            # /api/room endpoints
├── sockets/
│   ├── index.js                 # Socket.IO init — registers all handlers
│   ├── handlers/
│   │   ├── presence/
│   │   │   ├── UserOnline.js    # Sets user.socketId on connect
│   │   │   └── disconnect.js    # Clears socketId, broadcasts offline
│   │   ├── requests/
│   │   │   ├── requestJoin.js   # Client requests to join private room
│   │   │   ├── approveRequest.js# Owner/mod approves join request
│   │   │   └── rejectRequest.js # Owner/mod rejects join request
│   │   └── room/
│   │       ├── joinRoom.js      # Socket joins room channel
│   │       ├── leaveRoom.js     # Socket leaves room channel
│   │       ├── codeChange.js    # Syncs code edits to DB + room
│   │       ├── cursorMove.js    # Broadcasts cursor position
│   │       ├── typing.js        # Broadcasts typing indicator
│   │       ├── roomChat.js      # Persists + broadcasts chat messages
│   │       └── runCode.js       # JDoodle execution + broadcasts result
│   ├── middlewares/
│   │   └── socketAuth.js        # JWT verification for socket connections
│   └── utils/
│       ├── emitToRoom.js        # Broadcast to all sockets in a room
│       └── emitToUser.js        # Emit to a specific user by userId
├── app.js                       # Express app factory
├── server.js                    # Server entry point
├── .env.example                 # Environment variable template
├── api_test.http                # REST Client test file
└── package.json
```

---

## API Reference

All endpoints are prefixed with `/api`. Authentication uses HTTP-only JWT cookies set via `res.cookie('token', ...)`.

### Auth — `/api/auth`

#### `POST /api/auth/register`
Register a new user with local credentials.

**Request Body:**
```json
{
  "username": "varun2526",
  "email": "varun@example.com",
  "password": "SecurePass@123"
}
```

**Response `201`:**
```json
{
  "message": "User registered successfully",
  "payload": { "id": "...", "username": "varun2526", "email": "varun@example.com" }
}
```

**Error cases:** `400` missing fields | `409` duplicate email/username

---

#### `POST /api/auth/login`
Login with email and password. Sets `token` cookie.

**Request Body:**
```json
{ "email": "varun@example.com", "password": "SecurePass@123" }
```

**Response `200`:**
```json
{
  "message": "Login successful",
  "payload": { "id": "...", "username": "varun2526", "email": "varun@example.com" }
}
```

**Error cases:** `400` missing fields | `400` use Google login | `404` user not found | `401` wrong password

---

#### `POST /api/auth/google`
Authenticate via Google. Accepts either an `idToken` credential or an `access_token`.

**Request Body:**
```json
{ "credential": "google_id_token" }
// OR
{ "access_token": "google_access_token" }
```

**Response `200`:** Same payload as login. Sets JWT cookie.

---

#### `POST /api/auth/github`
Authenticate via GitHub OAuth code exchange.

**Request Body:**
```json
{ "code": "github_oauth_code" }
```

**Response `200`:** Same payload as login. Sets JWT cookie.

---

#### `POST /api/auth/logout`
Clears the JWT cookie.

**Response `200`:** `{ "message": "Logout successful" }`

---

#### `GET /api/auth/me` 🔐
Returns the currently authenticated user.

**Response `200`:**
```json
{
  "message": "Access granted",
  "user": { "id": "...", "username": "varun2526", "email": "...", "profilePic": "..." }
}
```

---

### Room — `/api/room`

All room endpoints require authentication (🔐).

#### `POST /api/room/create` 🔐
Create a new room. Creator becomes the `owner`.

**Request Body:**
```json
{
  "title": "My Coding Session",
  "description": "Working on the KodaX backend",
  "language": "javascript",
  "visibility": "private",
  "settings": { "maxUsers": 10, "allowGuests": false }
}
```

**Response `201`:**
```json
{
  "message": "Room created successfully",
  "payload": { "roomId": "uuid-v4-string", "title": "...", ... }
}
```

---

#### `GET /api/room/my-rooms` 🔐
Returns all rooms where the user is a member.

---

#### `GET /api/room/search?q=keyword` 🔐
Full-text search across public room titles and descriptions.

---

#### `GET /api/room/:roomId` 🔐
Returns room details including populated members. **Members only.**

---

#### `POST /api/room/:roomId/request-join` 🔐
- If the room is **public**: user is added immediately as a member.
- If the room is **private**: user is added to `pendingRequests`; owner/mods are notified.

---

#### `GET /api/room/:roomId/pending` 🔐 *(Owner/Mod)*
Returns the list of pending join requests with populated user info.

---

#### `POST /api/room/:roomId/approve/:userId` 🔐 *(Owner/Mod)*
Moves user from `pendingRequests` to `members` with role `member`.

---

#### `POST /api/room/:roomId/reject/:userId` 🔐 *(Owner/Mod)*
Removes user from `pendingRequests`.

---

#### `POST /api/room/:roomId/leave` 🔐
Remove yourself from a room. Owners must transfer ownership first.

---

#### `POST /api/room/:roomId/remove/:userId` 🔐 *(Owner/Mod)*
Kick a member out. Cannot kick the owner or another moderator (Mod restriction).

---

#### `PATCH /api/room/:roomId/promote/:userId` 🔐 *(Owner only)*
Promote a `member` to `moderator`.

---

#### `PATCH /api/room/:roomId/demote/:userId` 🔐 *(Owner only)*
Demote a `moderator` to `member`.

---

#### `PATCH /api/room/:roomId/transfer-ownership/:userId` 🔐 *(Owner only)*
Transfer `owner` role to another member. Current owner becomes `moderator`.

---

#### `PATCH /api/room/:roomId/settings` 🔐 *(Owner/Mod)*
Update room settings.

**Request Body (all optional):**
```json
{
  "title": "New Title",
  "description": "Updated description",
  "visibility": "public",
  "settings": { "maxUsers": 20, "allowGuests": true }
}
```

---

#### `DELETE /api/room/:roomId` 🔐 *(Owner only)*
Permanently deletes the room and all associated messages.

---

### Chat — `/api/chat`

#### `GET /api/chat/:roomId` 🔐
Returns all chat messages for the room, with sender info populated.

**Response `200`:**
```json
{
  "payload": [
    {
      "_id": "...",
      "message": "Hello team!",
      "sender": { "_id": "...", "username": "varun2526", "profilePic": "..." },
      "createdAt": "2026-05-13T09:00:00.000Z"
    }
  ]
}
```

---

### Code — `/api/code`

#### `GET /api/code/:roomId` 🔐
Returns the current code snapshot and language for the room.

#### `PUT /api/code/:roomId` 🔐
Saves code and/or language for the room.

**Request Body:**
```json
{ "code": "console.log('hello')", "language": "javascript" }
```

---

## Socket.IO Events

The Socket.IO server runs on the same port as the HTTP server. All socket connections are authenticated via the `socketAuth` middleware which reads the `token` cookie.

### Connection Flow

```
Client connects
  → socketAuth middleware verifies JWT
  → socket.userId = decoded token userId
  → userOnlineHandler sets user.socketId in DB
  → All event handlers registered
```

### Room Events

| Event (Client → Server) | Payload | What happens |
|--------------------------|---------|--------------|
| `join_room` | `{ roomId }` | Socket joins room channel; broadcasts `user_joined` |
| `leave_room` | `{ roomId }` | Socket leaves room channel; broadcasts `user_left` |
| `code_change` | `{ roomId, fileId, code }` | Saves to DB; broadcasts `code_updated` |
| `language_change` | `{ roomId, fileId, language, name }` | Saves to DB; broadcasts `language_updated` |
| `cursor_move` | `{ roomId, position: {lineNumber, column} }` | Broadcasts `cursor_updated` with socketId |
| `typing` | `{ roomId }` | Broadcasts `user_typing` |
| `send_message` | `{ roomId, message }` | Saves to DB; populates sender; broadcasts `receive_message` |
| `run_code` | `{ roomId, code, language }` | Calls JDoodle; broadcasts `code_running` then `code_result` |
| `add_file` | `{ roomId, file }` | Saves to DB; broadcasts `file_added` |
| `delete_file` | `{ roomId, fileId }` | Removes from DB; broadcasts `file_deleted` |

| Event (Server → Client) | Payload | Description |
|--------------------------|---------|-------------|
| `user_joined` | `{ userId, username }` | Someone joined the room |
| `user_left` | `{ userId }` | Someone left the room |
| `code_updated` | `{ fileId, code }` | Code change from another user |
| `language_updated` | `{ fileId, language }` | Language change from another user |
| `cursor_updated` | `{ socketId, userId, position }` | Cursor moved |
| `user_typing` | `{ userId, username }` | User is typing in chat |
| `receive_message` | `{ message, sender, createdAt }` | New chat message |
| `code_running` | `{ userId, language }` | Execution started |
| `code_result` | `{ output, error }` | Execution result |
| `file_added` | `{ file }` | New file added |
| `file_deleted` | `{ fileId }` | File deleted |
| `join_request_received` | `{ userId, username }` | New pending join request |
| `request_approved` | `{ roomId }` | Your join request was approved |
| `request_rejected` | `{ roomId }` | Your join request was rejected |

### Join Request Events

| Event (Client → Server) | Payload | Description |
|--------------------------|---------|-------------|
| `request_join` | `{ roomId }` | Request access to a private room |
| `approve_request` | `{ roomId, userId }` | Owner/mod approves a request |
| `reject_request` | `{ roomId, userId }` | Owner/mod rejects a request |

---

## Database Models

### User

```js
{
  username: String,       // unique, required
  email: String,          // unique, required, lowercase
  password: String,       // required for local auth, null for OAuth-only
  profilePic: String,     // nullable
  providers: [{
    name: 'local' | 'google' | 'github',
    providerId: String    // null for local
  }],
  socketId: String,       // current active socket (nullable)
  currentRoom: String,    // currently active room (nullable)
}
```

### Room

```js
{
  roomId: String,         // UUID, unique, indexed
  title: String,          // max 100 chars, text-indexed
  description: String,    // max 300 chars, text-indexed
  code: String,           // legacy single-file code
  files: [{
    id: String,
    name: String,
    language: String,
    code: String
  }],
  language: 'javascript' | 'python' | 'java' | 'c++' | 'c' | 'ruby' | 'go' | 'php',
  members: [{
    user: ObjectId → User,
    role: 'owner' | 'moderator' | 'member',
    joinedAt: Date
  }],
  pendingRequests: [ObjectId → User],
  visibility: 'public' | 'private',
  settings: {
    allowGuests: Boolean,
    maxUsers: Number      // default: 10
  }
}
```

### Message

```js
{
  roomId: ObjectId → Room,
  sender: ObjectId → User,
  message: String,        // max 1000 chars
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication

### Strategy

KodaX uses **HTTP-only JWT cookies** for session management:

1. On successful auth (register/login/OAuth), a JWT is signed with `userId` as the payload.
2. The token is sent as an HTTP-only cookie — inaccessible to JavaScript (XSS protection).
3. `secure: true` and `sameSite: 'none'` in production; `sameSite: 'lax'` in development.
4. Token expiry: **7 days**.

### Middleware

`verifyToken` (in `authMiddleware.js`):
- Reads token from `req.cookies.token`
- Falls back to `Authorization: Bearer <token>` header
- Attaches `req.user = { userId }` on success

### OAuth Flows

**Google:**
1. Frontend sends `credential` (ID token) or `access_token` to `/api/auth/google`
2. Backend verifies with `google-auth-library` or fetches from Google userinfo endpoint
3. Creates/updates user, issues JWT cookie

**GitHub:**
1. Frontend redirects to GitHub, gets `code` from callback URL
2. Frontend sends `code` to `/api/auth/github`
3. Backend exchanges code for access token with GitHub API
4. Fetches user profile + primary email
5. Creates/updates user, issues JWT cookie

---

## RBAC — Roles & Permissions

| Action | Owner | Moderator | Member |
|--------|:-----:|:---------:|:------:|
| Read code & chat | ✅ | ✅ | ✅ |
| Edit code | ✅ | ✅ | ❌ |
| Run code | ✅ | ✅ | ❌ |
| Add/delete files | ✅ | ✅ | ❌ |
| Send chat messages | ✅ | ✅ | ✅ |
| View pending requests | ✅ | ✅ | ❌ |
| Approve/reject joins | ✅ | ✅ | ❌ |
| Kick members | ✅ | ✅ | ❌ |
| Update room settings | ✅ | ✅ | ❌ |
| Promote/demote | ✅ | ❌ | ❌ |
| Transfer ownership | ✅ | ❌ | ❌ |
| Delete room | ✅ | ❌ | ❌ |

All role checks are performed server-side against the database on every request. Client-side RBAC is purely cosmetic.

---

## Code Execution

KodaX uses the [JDoodle Compiler API](https://www.jdoodle.com/compiler-api) for sandboxed code execution.

### Language Mapping

| KodaX Language | JDoodle Language | Version Index |
|----------------|-----------------|:-------------:|
| `javascript` | `nodejs` | 4 |
| `python` | `python3` | 4 |
| `java` | `java` | 4 |
| `c++` | `cpp17` | 1 |
| `c` | `c` | 5 |
| `ruby` | `ruby` | 4 |
| `go` | `go` | 4 |
| `php` | `php` | 4 |

### Execution Flow

```
Client emits run_code → Socket handler validates membership
→ io.to(roomId).emit('code_running') — all members see "executing..."
→ HTTPS request to api.jdoodle.com/v1/execute
→ Response parsed
→ io.to(roomId).emit('code_result', { output, error }) — all members see result
```

**Note:** JDoodle free tier has a daily limit of ~200 executions. Set `JDOODLE_CLIENT_ID` and `JDOODLE_CLIENT_SECRET` in your `.env`.

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env`:

| Variable | Required | Description |
|----------|:--------:|-------------|
| `DB_URL` | ✅ | MongoDB connection URI |
| `PORT` | ❌ | HTTP server port (default: `4000`) |
| `JWT_SECRET` | ✅ | Long random secret for JWT signing |
| `GOOGLE_CLIENT_ID` | ⚠️ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ⚠️ | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | ⚠️ | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | ⚠️ | GitHub OAuth app client secret |
| `JDOODLE_CLIENT_ID` | ⚠️ | JDoodle API client ID |
| `JDOODLE_CLIENT_SECRET` | ⚠️ | JDoodle API client secret |
| `NODE_ENV` | ❌ | `development` (default) or `production` |
| `CLIENT_URL` | ❌ | Frontend URL for CORS (production) |

---

## Running Locally

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env values
npm run dev       # nodemon server.js — hot reload
# OR
npm start         # node server.js — production mode
```

Server starts at `http://localhost:4000` by default.

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `nodemon server.js` | Development with hot reload |
| `npm start` | `node server.js` | Production start |

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2.1 | Web framework |
| `socket.io` | ^4.8.3 | Real-time WebSocket server |
| `mongoose` | ^9.6.1 | MongoDB ODM |
| `jsonwebtoken` | ^9.0.3 | JWT signing/verification |
| `bcrypt` | ^6.0.0 | Password hashing |
| `cookie-parser` | ^1.4.7 | Cookie parsing middleware |
| `cors` | ^2.8.6 | CORS headers |
| `google-auth-library` | ^10.6.2 | Google OAuth token verification |
| `uuid` | ^14.0.0 | UUID generation for room IDs |
| `dotenv` | ^17.4.2 | Environment variable loading |
| `nodemon` | ^3.1.14 | Dev auto-restart |
