<div align="center">

# ⚡ KodaX

### _Where developers take control_

A real-time collaborative code editor that lets multiple developers write, edit, and debug code together — live.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

</div>

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schemas](#-database-schemas)
- [WebSocket Events](#-websocket-events)
- [Room Roles & Permissions](#-room-roles--permissions)
- [Roadmap](#-roadmap)

---

## ✨ Features

| Feature | Status | Description |
|---|---|---|
| 🔐 JWT Authentication | ✅ Done | Secure cookie-based auth with register, login & logout |
| 🏠 Room-Based Sessions | ✅ Done | Create & manage isolated coding rooms with unique UUIDs |
| 👥 Role-Based Access | ✅ Done | Owner → Moderator → Member permission hierarchy |
| 🔒 Public & Private Rooms | ✅ Done | Public rooms allow instant join; private rooms require approval |
| 📝 Real-Time Code Sync | ✅ Done | Live code state persisted to database per room |
| 🌐 Multi-Language Support | ✅ Done | JavaScript, Python, Java, C++, C, Ruby, Go, PHP |
| 💬 In-Room Chat | ✅ Done | Persistent messaging between room members |
| 🔗 Invite via Share Link | ✅ Done | Join rooms through shareable room IDs |
| 🖱️ Live Cursor Tracking | 🚧 Planned | See collaborators' cursors in real time |
| 🎨 Syntax Highlighting | 🚧 Planned | Language-aware code highlighting |
| ▶️ Code Execution | 🚧 Planned | Run code directly from the editor |

---

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express v5
- **Database:** MongoDB + Mongoose v9
- **Real-Time:** Socket.IO v4
- **Auth:** JWT + bcrypt + cookie-parser
- **Utilities:** uuid (room ID generation), dotenv, cors

### Frontend
- **Library:** React v19
- **Build Tool:** Vite v8
- **Styling:** Tailwind CSS v4

---

## 🏗 Architecture

```
┌─────────────┐         WebSocket          ┌─────────────────┐
│             │ ◄──────────────────────────►│                 │
│   React     │                            │   Node.js       │
│   Frontend  │ ────── REST API ──────────►│   Backend       │
│   (Vite)    │ ◄──────────────────────────│   (Express v5)  │
│             │    HTTP + JWT Cookies       │                 │
└─────────────┘                            └────────┬────────┘
                                                    │
                                                    │ Mongoose
                                                    ▼
                                           ┌─────────────────┐
                                           │    MongoDB       │
                                           │                  │
                                           │  • Users         │
                                           │  • Rooms         │
                                           │  • Messages      │
                                           └─────────────────┘
```

### Authentication Flow

```
Register/Login → Validate → Hash Password (bcrypt) → Generate JWT { userId }
                                                            │
                                           Set httpOnly Cookie ──► Client
                                                            │
                              Protected Routes ◄── verifyToken middleware
                                    │
                           Extract userId from JWT → Attach to req.user
```

### Room Join Flow

```
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

---

## 📁 Project Structure

```
KodaX/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js      # Register, login, logout logic
│   │   ├── chatController.js      # Message retrieval by room
│   │   ├── codeController.js      # Get/save code per room
│   │   └── roomController.js      # Room CRUD + join/approve/reject
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification (cookie + header)
│   ├── models/
│   │   ├── Message.js             # Chat message schema
│   │   ├── Room.js                # Room schema (members, settings, code)
│   │   └── User.js                # User schema (multi-provider auth)
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── chatRoutes.js          # /api/chat/*
│   │   ├── codeRoutes.js          # /api/code/*
│   │   └── roomRoutes.js          # /api/room/*
│   ├── sockets/
│   │   └── socketHandler.js       # Socket.IO connection management
│   ├── utils/
│   │   └── generateRoomId.js      # (Reserved for custom ID generation)
│   ├── app.js                     # Express app configuration
│   ├── server.js                  # HTTP + Socket.IO server entry point
│   └── package.json
├── frontend/                       # React + Vite + Tailwind CSS
├── sample_frontend/                # Static HTML/CSS UI mockup
├── flows.md                        # Internal development flow notes
├── usecase.md                      # API use case documentation
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Varun2526/Real_time_collaborative_code-editor.git
cd Real_time_collaborative_code-editor
```

**2. Setup the backend**

```bash
cd backend
npm install
```

**3. Create the environment file**

```bash
# backend/.env
DB_URL=mongodb://localhost:27017/REAL-TIME-CODE-EDITOR
PORT=4000
JWT_SECRET=your_super_secret_key_here
```

**4. Start the backend server**

```bash
npx nodemon server.js
```

> Backend runs at `http://localhost:4000`

**5. Setup the frontend**

```bash
cd ../frontend
npm install
npm run dev
```

> Frontend runs at `http://localhost:5174`

---

## 🔑 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DB_URL` | MongoDB connection string | `mongodb://localhost:27017/REAL-TIME-CODE-EDITOR` |
| `PORT` | Backend server port | `4000` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_strong_random_secret` |

---

## 📡 API Reference

All protected routes require a valid JWT token — either as an `httpOnly` cookie or an `Authorization: Bearer <token>` header.

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT cookie |
| `POST` | `/api/auth/logout` | ❌ | Clear auth cookie |
| `GET` | `/api/auth/me` | ✅ | Get current authenticated user |

<details>
<summary><strong>POST /api/auth/register</strong></summary>

**Request Body:**
```json
{
  "username": "varun",
  "email": "varun@mail.com",
  "password": "securepassword123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "payload": {
    "username": "varun",
    "id": "64f...",
    "email": "varun@mail.com"
  }
}
```

**Error Responses:**
- `400` — Missing required fields
- `409` — Username or email already exists

</details>

<details>
<summary><strong>POST /api/auth/login</strong></summary>

**Request Body:**
```json
{
  "email": "varun@mail.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "payload": {
    "id": "64f...",
    "username": "varun",
    "email": "varun@mail.com"
  }
}
```

**Error Responses:**
- `400` — Missing fields or Google-only account
- `401` — Invalid credentials
- `404` — User not found

</details>

---

### Rooms — `/api/room`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/room/create` | ✅ | Create a new room |
| `GET` | `/api/room/my-rooms` | ✅ | Get all rooms the user belongs to |
| `GET` | `/api/room/:roomId` | ✅ | Get room details (members only) |
| `POST` | `/api/room/:roomId/request-join` | ✅ | Request to join a room |
| `GET` | `/api/room/:roomId/pending` | ✅ | Get pending join requests (owner/mod) |
| `POST` | `/api/room/:roomId/approve/:userId` | ✅ | Approve a join request (owner/mod) |
| `POST` | `/api/room/:roomId/reject/:userId` | ✅ | Reject a join request (owner/mod) |

<details>
<summary><strong>POST /api/room/create</strong></summary>

Creates a room with the authenticated user as owner.

**Request Body:**
```json
{
  "title": "My Project Room",
  "description": "Collaborative room for our new project"
}
```

**Success Response (201):**
```json
{
  "message": "Room created successfully",
  "payload": {
    "roomId": "3a519fd8-f287-4080-bc96-faf9790c274b",
    "title": "My Project Room",
    "description": "Collaborative room for our new project",
    "visibility": "private",
    "members": [{ "user": "64f...", "role": "owner", "joinedAt": "2026-05-07T10:00:00.000Z" }],
    "settings": { "allowGuests": false, "maxUsers": 10 }
  }
}
```

</details>

<details>
<summary><strong>POST /api/room/:roomId/request-join</strong></summary>

- **Public room** → User is added directly as a member
- **Private room** → User is added to `pendingRequests` for approval

**Public Room Response (200):**
```json
{ "message": "Joined room successfully", "payload": { ... } }
```

**Private Room Response (200):**
```json
{ "message": "Join request sent successfully" }
```

**Error Responses:**
- `400` — Already a member, already pending, or room is full
- `404` — Room not found

</details>

---

### Code — `/api/code`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/code/:roomId` | ✅ | Get the current code and language for a room |
| `PUT` | `/api/code/:roomId` | ✅ | Save or update the code in a room |

<details>
<summary><strong>PUT /api/code/:roomId</strong></summary>

**Request Body:**
```json
{
  "code": "console.log('Hello, KodaX!');",
  "language": "javascript"
}
```

**Success Response (200):**
```json
{
  "message": "Code saved successfully",
  "payload": { ... }
}
```

</details>

---

### Chat — `/api/chat`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/chat/:roomId` | ✅ | Get all messages for a room (sorted by time) |

---

## 🗄 Database Schemas

### User

```javascript
{
  username:     String     // unique, required
  email:        String     // unique, required, lowercase
  password:     String     // required for local auth, bcrypt hashed
  profilePic:   String     // optional, default null
  providers: [{            // supports multi-provider auth
    name:       String     // enum: 'local', 'google', 'github'
    providerId: String     // required for non-local providers
  }],
  socketId:     String     // tracks active Socket.IO connection
  currentRoom:  String     // tracks which room user is currently in
  createdAt:    Date       // auto-generated
  updatedAt:    Date       // auto-generated
}
```

### Room

```javascript
{
  roomId:       String          // unique UUID, shareable link identifier
  title:        String          // required, max 100 characters (indexed for search)
  description:  String          // optional, default "", max 300 chars (indexed for search)
  code:         String          // persisted code content, default ""
  language:     String          // enum: javascript, python, java, c++, c, ruby, go, php (indexed for search)
  members: [{
    user:       ObjectId → User
    role:       String          // enum: 'owner', 'moderator', 'member'
    joinedAt:   Date            // auto-generated
  }],
  pendingRequests: [ObjectId → User],  // users awaiting approval
  visibility:   String          // enum: 'public', 'private', default 'private'
  settings: {
    allowGuests:  Boolean       // default: false
    maxUsers:     Number        // default: 10
  },
  createdAt:    Date
  updatedAt:    Date
}
```
*Note: A full-text search index exists on `title`, `description`, and `language` to support global room searches.*

### Message

```javascript
{
  roomId:   ObjectId → Room    // which room this message belongs to
  sender:   ObjectId → User    // who sent the message
  message:  String             // max 1000 characters
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔌 WebSocket Events

Socket.IO is used for real-time communication. The current implementation handles connection tracking:

| Event | Direction | Description |
|---|---|---|
| `connection` | Client → Server | Registers user's `socketId` in the database |
| `disconnect` | Client → Server | Clears the user's `socketId` from the database |

> Connection requires `username` passed as a handshake query parameter:
> ```javascript
> const socket = io("http://localhost:4000", {
>   query: { username: "varun" }
> });
> ```

---

## 🛡 Room Roles & Permissions

| Action | Owner | Moderator | Member | Pending | Non-Member |
|---|:---:|:---:|:---:|:---:|:---:|
| View room | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit code | ✅ | ✅ | ✅ | ❌ | ❌ |
| Send chat | ✅ | ✅ | ✅ | ❌ | ❌ |
| View pending requests | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve/Reject joins | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create room | ✅ | — | — | — | — |

---

## 🗺 Roadmap

- [ ] Live cursor tracking with user avatars
- [ ] Syntax highlighting (Monaco / CodeMirror integration)
- [ ] In-browser code execution (sandboxed)
- [ ] Leave room functionality
- [ ] Remove member (owner/moderator action)
- [ ] Promote member → moderator
- [ ] Demote moderator → member
- [ ] Transfer room ownership
- [ ] Update room settings (privacy, max users, guest access)
- [ ] Delete room (owner only)
- [ ] Google & GitHub OAuth integration
- [ ] File/tab management within rooms
- [ ] Deployment support (Vercel + Render)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

<div align="center">


