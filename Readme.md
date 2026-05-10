<div align="center">

# ⚡ KodaX

### _Where developers take control_

A premium, highly-scalable real-time collaborative code editor that lets multiple developers write, edit, and debug code together seamlessly.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 Table of Contents

- [About KodaX](#-about-kodax)
- [✨ Core Features (Point-by-Point)](#-core-features-point-by-point)
  - [Backend Engine](#1-robust-backend-engine)
  - [Real-Time WebSocket Layer](#2-real-time-websocket-layer)
  - [Frontend Client](#3-modern-frontend-client)
- [🏗 System Architecture](#-system-architecture)
- [📁 Project Structure](#-project-structure)
- [📡 API & Socket Reference](#-api--socket-reference)
- [🛡 Roles & Permissions](#-roles--permissions)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [🗺 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 💡 About KodaX

KodaX was built to solve the friction of remote pair programming. By combining a lightning-fast React frontend with a highly secure, room-based Node.js backend, KodaX provides a Google Docs-like experience but explicitly designed for multi-language code execution and developer collaboration.

Whether you are conducting technical interviews, mentoring junior developers, or debugging a tricky server issue with your team, KodaX provides the isolated, real-time environment you need.

---

## ✨ Core Features (Point-by-Point)

### 1. Robust Backend Engine
*Built with Node.js, Express v5, and MongoDB to ensure maximum security and data persistence.*
* **🔐 Multi-Provider Authentication:** JWT cookie-based auth supporting Local (email/password), Google OAuth, and GitHub OAuth with `bcrypt` password hashing.
* **🏠 Advanced Room Management:** Users can dynamically create public or private coding rooms, generating unique shareable UUIDs.
* **👥 Role-Based Access Control (RBAC):** A strict hierarchy of `Owner` → `Moderator` → `Member`.
* **🚪 Approval System:** Private rooms employ a `pendingRequests` system where Owners/Moderators must explicitly approve or reject joining users.
* **⚙️ Complete Administrative Control:** Owners can promote members, demote moderators, transfer total room ownership, kick members out, update room settings, and delete rooms.
* **📂 Multi-File System:** Rooms support multiple files, each with their own name, language, and code content.

### 2. Real-Time WebSocket Layer
*Powered by Socket.io to provide millisecond-latency syncing across the globe.*
* **📝 Instant Code Sync:** Every keystroke is broadcasted instantly and permanently synced to the database on the fly. Supports both legacy single-file and multi-file modes.
* **🌐 Multi-Language Synchronization:** Switching between JavaScript, Python, C++, Java, C, Ruby, Go, and PHP instantly changes the environment for everyone in the room.
* **💬 Live Chat Persistence:** A dedicated in-room chat system that broadcasts live messages and permanently saves them to MongoDB for history retrieval.
* **🖱️ Live Cursor & Presence Tracking:** Broadcasts precise cursor position coordinates and tracks who is online/offline instantly.
* **⌨️ Typing Indicators:** Real-time "user is typing" status broadcast to all room members.
* **▶️ Sandboxed Code Execution:** Server-side code execution via JDoodle API supporting 8 languages with synchronized output broadcast to all room members.
* **📂 File Management:** Real-time file creation and deletion synced across all room participants.
* **🔔 Join Request Flow:** Socket-based join request, approval, and rejection system for private rooms.

### 3. Modern Frontend Client
*Engineered with React 19, Vite, and Tailwind CSS v4 for a premium, responsive UI.*
* **🔑 Social Login:** Google and GitHub OAuth integration alongside traditional email/password login.
* **🎨 Dashboard Ecosystem:** Beautifully structured Dashboard with room management capabilities.
* **🧭 Dynamic Navigation:** Smart Navbar with theme-aware SpaceX-inspired styling.
* **🛠️ Room Interface:** Full-featured room page with sidebar navigation, file explorer, editor tabs, chat panel, console panel, and members management.
* **📐 Resizable Panels:** Interactive drag-to-resize panels for file explorer, chat, and console sections.
* **⚡ Blazing Fast Build:** Vite ensures instant HMR during development and heavily optimized bundles for production.

---

## 🏗 System Architecture

```text
┌───────────────┐        WebSocket (Socket.io)        ┌───────────────────┐
│               │ ◄─────────────────────────────────► │                   │
│   React 19    │                                     │   Node.js         │
│   Frontend    │ ───────── REST API (Express) ─────► │   Backend         │
│  (Tailwind 4) │ ◄──────── HTTP + JWT Cookies ────── │   Engine          │
│               │                                     │                   │
└───────────────┘                                     └─────────┬─────────┘
                                                                │
                                                                │ Mongoose v9
                                                                ▼
                                                      ┌───────────────────┐
                                                      │     MongoDB       │
                                                      │  • Users          │
                                                      │  • Rooms (Code)   │
                                                      │  • Messages       │
                                                      └───────────────────┘
                                                                │
                                                      ┌────────────────────┐
                                                      │    JDoodle API     │
                                                      │  (Code Execution)  │
                                                      └────────────────────┘
```

---

## 📁 Project Structure

A clean, modular monorepo separating the frontend client from the backend engine.

```text
KodaX/
├── backend/
│   ├── config/
│   │   └── db.js                  # Initializes and connects to the MongoDB database
│   ├── controllers/               # Business Logic Layer
│   │   ├── authController.js      # Register, Login, Logout, Google OAuth, GitHub OAuth, GetMe
│   │   ├── chatController.js      # Retrieves chat message history for specific rooms
│   │   ├── codeController.js      # Fetches initial code state and handles manual code saves
│   │   └── roomController.js      # Full CRUD for rooms, join requests, roles, and admin actions
│   ├── middleware/                 # Express Middlewares
│   │   └── authMiddleware.js      # Protects routes by verifying JWTs from cookies or headers
│   ├── models/                    # MongoDB Mongoose Schemas
│   │   ├── Message.js             # Schema for chat messages (text, sender, room association)
│   │   ├── Room.js                # Schema for rooms (members, multi-file code, language, settings)
│   │   └── User.js                # Schema for users (multi-provider auth, profile, socket state)
│   ├── routes/                    # API Route Definitions
│   │   ├── authRoutes.js          # Maps /api/auth endpoints (register, login, logout, OAuth, me)
│   │   ├── chatRoutes.js          # Maps /api/chat endpoints (get messages)
│   │   ├── codeRoutes.js          # Maps /api/code endpoints (get & save code)
│   │   └── roomRoutes.js          # Maps /api/room endpoints (CRUD, join, roles, settings, admin)
│   ├── sockets/                   # Real-Time WebSocket Architecture
│   │   ├── handlers/
│   │   │   ├── presence/          # User online/offline detection (UserOnline, disconnect)
│   │   │   ├── requests/          # Join request flow (requestJoin, approveRequest, rejectRequest)
│   │   │   └── room/              # Room events (codeChange, cursorMove, typing, roomChat, runCode)
│   │   ├── middlewares/
│   │   │   └── socketAuth.js      # Socket-level JWT authentication middleware
│   │   ├── utils/
│   │   │   ├── emitToRoom.js      # Helper to emit events to all users in a room
│   │   │   └── emitToUser.js      # Helper to emit events to a specific user
│   │   └── index.js               # Main Socket.io server setup and event registration
│   ├── app.js                     # Configures Express app, CORS, cookie parser, and API routes
│   ├── server.js                  # Entry point: Starts HTTP server and initializes Socket.io
│   └── package.json               # Backend dependencies and scripts
│
├── frontend/                      # React 19 + Vite + Tailwind CSS v4 Application
│   ├── src/
│   │   ├── app/                   # Application entry and routing
│   │   │   ├── App.jsx            # Root application component
│   │   │   ├── main.jsx           # Vite entry point with providers
│   │   │   └── routes.jsx         # React Router v7 route definitions
│   │   ├── components/            # UI Components
│   │   │   ├── chat/              # ChatPanel, ChatInput, MessageBubble, TypingIndicator
│   │   │   ├── common/            # Reusable: Button, Input, Modal, Loader, EmptyState
│   │   │   ├── create-room/       # CreateRoomModal, CreateRoomForm, VisibilitySelector
│   │   │   ├── editor/            # MonacoEditorWrapper, EditorToolbar, LanguageSelector
│   │   │   ├── home/              # AvailableRoomsPanel, JoinedRoomPanel, RoomCard, SearchRooms
│   │   │   ├── navbar/            # Navbar, ProfileMenu, NotificationBell, Navlinks
│   │   │   ├── room/              # RoomSidebar, MembersPanel, ExplorerPanel, ConsolePanel, EditorTabs
│   │   │   ├── KodaxLogo.jsx      # Animated logo component
│   │   │   ├── ProtectedRoute.jsx # Auth-gated route wrapper
│   │   │   └── PublicRoute.jsx    # Guest-only route wrapper
│   │   ├── context/               # React Context Providers
│   │   │   ├── AuthContext.jsx    # Authentication state management
│   │   │   └── SocketProvider.jsx # Socket.io connection provider
│   │   ├── hooks/                 # Custom React Hooks
│   │   │   ├── useAuth.js         # Authentication hook
│   │   │   ├── useDebounce.js     # Debounce utility hook
│   │   │   ├── useRoom.js         # Room operations hook
│   │   │   ├── useSocket.js       # Socket connection hook
│   │   │   └── useTypingIndicator.js # Typing status hook
│   │   ├── layouts/               # Page Layout Components
│   │   │   ├── AuthLayout.jsx     # Centered auth page layout
│   │   │   ├── DashboardLayout.jsx # Dashboard page layout
│   │   │   └── RoomLayout.jsx     # Room editor page layout
│   │   ├── pages/                 # Page Components
│   │   │   ├── auth/              # Login, Register, GithubCallback
│   │   │   ├── dashboard/         # Dashboard (home page)
│   │   │   └── room/              # RoomPage (collaborative editor)
│   │   ├── services/              # API & Socket Service Layer
│   │   │   ├── api/               # authApi, roomApi, messageApi, axios instance
│   │   │   └── socket/            # socket client, socketEvents, socketHandlers
│   │   ├── store/                 # State Management Stores
│   │   │   ├── authStore.js       # Auth state store
│   │   │   ├── chatStore.js       # Chat state store
│   │   │   ├── editorStore.js     # Editor state store
│   │   │   ├── roomStore.js       # Room state store
│   │   │   └── socketStore.js     # Socket state store
│   │   ├── utils/                 # Utility Functions
│   │   │   ├── constants.js       # App-wide constants (URLs, enums)
│   │   │   ├── copyToClipboard.js # Clipboard utility
│   │   │   ├── formatDate.js      # Date formatting helper
│   │   │   ├── generateAvatar.js  # Avatar generation utility
│   │   │   └── roleHelpers.js     # Permission checking helpers
│   │   ├── index.css              # Global Tailwind theme and typography
│   │   └── App.css                # App-level styles
│   ├── index.html                 # Vite HTML entry point
│   ├── vite.config.js             # Vite build configuration
│   └── package.json               # Frontend dependencies and scripts
│
├── sample_frontend/               # Initial static HTML/CSS UI mockup reference
├── flows.md                       # Internal developer documentation detailing system flows
├── usecase.md                     # Documentation of API use cases and data payloads
├── Readme.md                      # This file
└── .gitignore                     # Specifies intentionally untracked files for git
```

---

## 📡 API & Socket Reference

### REST API Endpoints

#### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| **POST** | `/api/auth/register` | ❌ | Register a new user with username, email, and password |
| **POST** | `/api/auth/login` | ❌ | Login with email and password, receive JWT cookie |
| **POST** | `/api/auth/google` | ❌ | Authenticate via Google OAuth (credential or access_token) |
| **POST** | `/api/auth/github` | ❌ | Authenticate via GitHub OAuth (authorization code exchange) |
| **POST** | `/api/auth/logout` | ❌ | Clear JWT cookie and end session |
| **GET**  | `/api/auth/me` | ✅ | Fetch current authenticated user's profile |

#### Room Management (`/api/room`)

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| **POST** | `/api/room/create` | ✅ | Create a new coding room (auto-assigns owner role) |
| **GET**  | `/api/room/my-rooms` | ✅ | Fetch all rooms the user is a member of |
| **GET**  | `/api/room/search` | ✅ | Full-text search across public rooms |
| **GET**  | `/api/room/:roomId` | ✅ | Fetch room details (members only) |
| **POST** | `/api/room/:roomId/request-join` | ✅ | Request to join a room (auto-join if public) |
| **GET**  | `/api/room/:roomId/pending` | ✅ | View pending join requests (Owner/Moderator) |
| **POST** | `/api/room/:roomId/approve/:userId` | ✅ | Approve a pending join request (Owner/Moderator) |
| **POST** | `/api/room/:roomId/reject/:userId` | ✅ | Reject a pending join request (Owner/Moderator) |
| **POST** | `/api/room/:roomId/leave` | ✅ | Voluntarily leave a room |
| **POST** | `/api/room/:roomId/remove/:userId` | ✅ | Remove a member from the room (Owner/Moderator) |
| **PATCH** | `/api/room/:roomId/promote/:userId` | ✅ | Promote member → moderator (Owner only) |
| **PATCH** | `/api/room/:roomId/demote/:userId` | ✅ | Demote moderator → member (Owner only) |
| **PATCH** | `/api/room/:roomId/transfer-ownership/:userId` | ✅ | Transfer room ownership (Owner only) |
| **PATCH** | `/api/room/:roomId/settings` | ✅ | Update room settings (Owner/Moderator) |
| **DELETE** | `/api/room/:roomId` | ✅ | Delete room permanently (Owner only) |

#### Chat (`/api/chat`)

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| **GET** | `/api/chat/:roomId` | ✅ | Fetch message history for a room |

#### Code (`/api/code`)

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| **GET** | `/api/code/:roomId` | ✅ | Fetch current code and language for a room |
| **PUT** | `/api/code/:roomId` | ✅ | Save/update code and language for a room |

### WebSocket Events

#### Connection & Presence

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `connection` | Client → Server | JWT via socket auth | Registers user session and verifies authentication |
| `disconnect` | Client → Server | — | Clears session and broadcasts `user_offline` |

#### Room Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `join_room` | Client → Server | `{ roomId }` | Subscribes socket to room, broadcasts `user_joined` |
| `leave_room` | Client → Server | `{ roomId }` | Leaves a room, broadcasts `user_left` |
| `code_change` | Client → Server | `{ roomId, fileId?, code }` | Syncs code (file-specific or legacy), saves to DB, broadcasts `code_updated` |
| `language_change` | Client → Server | `{ roomId, fileId?, language }` | Syncs language, saves to DB, broadcasts `language_updated` |
| `cursor_move` | Client → Server | `{ roomId, position }` | Broadcasts cursor position via `cursor_updated` |
| `typing` | Client → Server | `{ roomId }` | Broadcasts `user_typing` indicator to room |
| `send_message` | Client → Server | `{ roomId, message }` | Persists chat message, populates sender, broadcasts `receive_message` |
| `run_code` | Client → Server | `{ roomId, code, language }` | Executes code via JDoodle API, broadcasts `code_running` then `code_result` |
| `code_output` | Client → Server | `{ roomId, output }` | Broadcasts execution output via `code_output_received` |
| `add_file` | Client → Server | `{ roomId, file }` | Adds a new file to the room, broadcasts `file_added` |
| `delete_file` | Client → Server | `{ roomId, fileId }` | Deletes a file from the room, broadcasts `file_deleted` |

#### Join Request Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `request_join` | Client → Server | `{ roomId }` | Sends join request, notifies Owner/Moderators |
| `approve_request` | Client → Server | `{ roomId, userId }` | Approves a pending join request |
| `reject_request` | Client → Server | `{ roomId, userId }` | Rejects a pending join request |

---

## 🛡 Roles & Permissions

KodaX utilizes a highly secure, database-enforced RBAC (Role-Based Access Control) matrix.

| Action | Owner | Moderator | Member | Pending |
|--------|:-----:|:---------:|:------:|:-------:|
| **View Room & Code** | ✅ | ✅ | ✅ | ❌ |
| **Edit Code & Chat** | ✅ | ✅ | ✅ | ❌ |
| **Run Code** | ✅ | ✅ | ✅ | ❌ |
| **Add/Delete Files** | ✅ | ✅ | ✅ | ❌ |
| **Leave Room** | ✅ | ✅ | ✅ | ❌ |
| **View Pending Requests** | ✅ | ✅ | ❌ | ❌ |
| **Approve/Reject Joins** | ✅ | ✅ | ❌ | ❌ |
| **Remove Regular Members** | ✅ | ✅ | ❌ | ❌ |
| **Update Room Settings** | ✅ | ✅ | ❌ | ❌ |
| **Promote/Demote Members** | ✅ | ❌ | ❌ | ❌ |
| **Transfer Ownership** | ✅ | ❌ | ❌ | ❌ |
| **Delete Room** | ✅ | ❌ | ❌ | ❌ |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

**1. Clone the repository**
```bash
git clone https://github.com/Varun2526/Real_time_collaborative_code-editor.git
cd Real_time_collaborative_code-editor
```

**2. Setup & Start the Backend**
```bash
cd backend
npm install
```
Create a `backend/.env` file:
```env
# Database
DB_URL=mongodb://localhost:27017/REAL-TIME-CODE-EDITOR
PORT=4000

# JWT
JWT_SECRET=your_super_secret_key_here

# Google OAuth (https://console.cloud.google.com)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth (https://github.com/settings/developers)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# JDoodle Code Execution (https://www.jdoodle.com/compiler-api)
JDOODLE_CLIENT_ID=your_jdoodle_client_id
JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
```
Run the server:
```bash
npx nodemon server.js
```
*> Backend running at `http://localhost:4000`*

**3. Setup & Start the Frontend**
```bash
cd ../frontend
npm install
```
Create a `frontend/.env` file:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```
Start the dev server:
```bash
npm run dev
```
*> Frontend running at `http://localhost:5173`*

---

## 🗺 Roadmap

- [x] Room-based authentication & authorization
- [x] Multi-provider authentication (Local, Google, GitHub)
- [x] Real-time code & language synchronization
- [x] Multi-file system support (create, edit, delete files)
- [x] In-room persistent chat system
- [x] Advanced Room Administration (Promote, Demote, Transfer, Kick, Leave, Settings, Delete)
- [x] Live cursor tracking (backend)
- [x] Typing indicators (backend)
- [x] Server-side code execution via JDoodle API (8 languages)
- [x] Socket-based join request approval/rejection flow
- [x] Connect Frontend Monaco Editor with real-time socket sync
- [x] Live cursor tracking with user labels in editor UI
- [ ] Frontend socket service layer & custom hooks
- [ ] Complete reusable UI component library
- [ ] Global deployment (Vercel + Render)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
<i>Engineered with precision for the modern developer workflow.</i>
</div>
