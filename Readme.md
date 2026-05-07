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

---

## 💡 About KodaX

KodaX was built to solve the friction of remote pair programming. By combining a lightning-fast React frontend with a highly secure, room-based Node.js backend, KodaX provides a Google Docs-like experience but explicitly designed for multi-language code execution and developer collaboration.

Whether you are conducting technical interviews, mentoring junior developers, or debugging a tricky server issue with your team, KodaX provides the isolated, real-time environment you need.

---

## ✨ Core Features (Point-by-Point)

### 1. Robust Backend Engine
*Built with Node.js, Express v5, and MongoDB to ensure maximum security and data persistence.*
* **🔐 Secure Authentication:** Fully integrated JWT cookie-based auth (Register, Login, Logout, Profile) with `bcrypt` password hashing.
* **🏠 Advanced Room Management:** Users can dynamically create public or private coding rooms, generating unique shareable UUIDs.
* **👥 Role-Based Access Control (RBAC):** A strict hierarchy of `Owner` → `Moderator` → `Member`.
* **🚪 Approval System:** Private rooms employ a `pendingRequests` system where Owners/Moderators must explicitly approve or reject joining users.
* **⚙️ Complete Administrative Control:** Owners can promote members, demote moderators, transfer total room ownership, kick members out, and forcefully delete rooms.

### 2. Real-Time WebSocket Layer
*Powered by Socket.io to provide millisecond-latency syncing across the globe.*
* **📝 Instant Code Sync:** Every keystroke is broadcasted instantly and permanently synced to the database on the fly.
* **🌐 Multi-Language Synchronization:** Switching between JavaScript, Python, C++, etc., instantly changes the environment for everyone in the room.
* **💬 Live Chat Persistence:** A dedicated in-room chat system that broadcasts live messages and permanently saves them to MongoDB for history retrieval.
* **🖱️ Live Cursor & Presence Tracking:** (Backend ready) Broadcasts precise X/Y cursor coordinates and tracks who is online/offline instantly.
* **▶️ Synchronized Code Execution:** Emits global execution states so everyone watches the code run and receives the terminal output simultaneously.

### 3. Modern Frontend Client
*Engineered with React 19, Vite, and Tailwind CSS v4 for a premium, responsive UI.*
* **🎨 Dashboard Ecosystem:** Beautifully structured `Home`, `CreateRoom`, and `AvailableRoomsPanel` interfaces.
* **🧭 Dynamic Navigation:** Smart `Navbar` with `ProfileMenu` and `NotificationBell` components for seamless UX.
* **🛠️ Room Interface:** A dedicated `RoomSidebar` housing `MembersList`, `OnlineUsers`, `PendingRequests`, and `RoomSettings`.
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
│   │   ├── authController.js      # Handles user registration, login, and profile fetching
│   │   ├── chatController.js      # Retrieves chat message history for specific rooms
│   │   ├── codeController.js      # Fetches initial code state and handles manual code saves
│   │   └── roomController.js      # Handles CRUD for rooms, join requests, and member roles
│   ├── middleware/                # Express Middlewares
│   │   └── authMiddleware.js      # Protects routes by verifying JWTs from cookies or headers
│   ├── models/                    # MongoDB Mongoose Schemas
│   │   ├── Message.js             # Schema for chat messages (text, sender, room association)
│   │   ├── Room.js                # Schema for coding rooms (members, code, language, settings)
│   │   └── User.js                # Schema for users (credentials, profile info, socket state)
│   ├── routes/                    # API Route Definitions
│   │   ├── authRoutes.js          # Maps /api/auth endpoints to auth controllers
│   │   ├── chatRoutes.js          # Maps /api/chat endpoints to chat controllers
│   │   ├── codeRoutes.js          # Maps /api/code endpoints to code controllers
│   │   └── roomRoutes.js          # Maps /api/room endpoints to room controllers
│   ├── sockets/                   # Real-Time WebSocket Architecture
│   │   ├── handlers/              # Modularized Socket.io event listeners (chat, code, presence)
│   │   ├── middlewares/           # Socket-level authentication to prevent unauthorized connections
│   │   ├── utils/                 # Helper functions for emitting events to specific rooms or users
│   │   └── index.js               # Main Socket.io server setup and event registration
│   ├── app.js                     # Configures Express app, CORS, and registers API routes
│   ├── server.js                  # Entry point: Starts HTTP server and initializes Socket.io
│   └── package.json               # Backend dependencies and scripts
├── frontend/                      # React 19 + Vite + Tailwind CSS Application
├── sample_frontend/               # Initial static HTML/CSS UI mockup reference
├── flows.md                       # Internal developer documentation detailing system flows
├── usecase.md                     # Documentation of API use cases and data payloads
└── .gitignore                     # Specifies intentionally untracked files for git
```

---

## 📡 API & Socket Reference

### REST API Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| **POST** | `/api/auth/register` | ❌ | Register new user |
| **POST** | `/api/auth/login` | ❌ | Login and receive JWT cookie |
| **POST** | `/api/room/create` | ✅ | Create a new coding room |
| **GET**  | `/api/room/my-rooms` | ✅ | Fetch rooms user belongs to |
| **POST** | `/api/room/:roomId/request-join` | ✅ | Request entry to a room |
| **POST** | `/api/room/:roomId/approve/:userId` | ✅ | Approve a pending request |
| **POST** | `/api/room/:roomId/leave` | ✅ | Voluntarily leave a room |
| **POST** | `/api/room/:roomId/remove/:userId` | ✅ | Kick a member from the room |
| **PATCH**| `/api/room/:roomId/promote/:userId` | ✅ | Promote member to moderator |

*(For full API documentation including Chat and Code retrieval, see the Postman/REST Client HTTP files in the backend repository).*

### WebSocket Events

| Event | Direction | Functionality |
|---|---|---|
| `connection` | Client → Server | Registers user session and verifies socket auth |
| `disconnect` | Client → Server | Clears session and broadcasts `user_offline` |
| `join_room` | Client → Server | Subscribes socket to room, broadcasts `user_joined` |
| `leave_room` | Client → Server | Leaves a room, broadcasts `user_left` |
| `code_change` | Client → Server | Syncs code, instantly saves to DB, broadcasts `code_updated` |
| `language_change` | Client → Server | Syncs language, saves to DB, broadcasts `language_updated` |
| `send_message` | Client → Server | Persists chat message, populates sender data, broadcasts `receive_message` |
| `run_code` | Client → Server | Triggers execution state, broadcasts `code_running` |
| `code_output` | Client → Server | Broadcasts execution terminal output via `code_output_received` |

---

## 🛡 Roles & Permissions

KodaX utilizes a highly secure, database-enforced RBAC (Role-Based Access Control) matrix.

| Action | Owner | Moderator | Member | Pending |
|---|:---:|:---:|:---:|:---:|
| **View Room & Code** | ✅ | ✅ | ✅ | ❌ |
| **Edit Code & Chat** | ✅ | ✅ | ✅ | ❌ |
| **Leave Room** | ✅ | ✅ | ✅ | ❌ |
| **View Pending Requests** | ✅ | ✅ | ❌ | ❌ |
| **Approve/Reject Joins** | ✅ | ✅ | ❌ | ❌ |
| **Remove Regular Members** | ✅ | ✅ | ❌ | ❌ |
| **Promote/Demote Members** | ✅ | ❌ | ❌ | ❌ |
| **Transfer Ownership** | ✅ | ❌ | ❌ | ❌ |
| **Delete Room** | ✅ | ❌ | ❌ | ❌ |

---

## 🚀 Quick Start Guide

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
DB_URL=mongodb://localhost:27017/REAL-TIME-CODE-EDITOR
PORT=4000
JWT_SECRET=your_super_secret_key_here
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
npm run dev
```
*> Frontend running at `http://localhost:5173`*

---

## 🗺 Roadmap

- [x] Room-based authentication & authorization
- [x] Real-time code & language synchronization
- [x] In-room persistent chat system
- [x] Advanced Room Administration (Promote, Demote, Transfer, Kick, Leave)
- [ ] Connect Frontend Monaco/CodeMirror editor
- [ ] Live cursor tracking with user avatars in UI
- [ ] In-browser code execution (sandboxed API integration)
- [ ] Global deployment (Vercel + Render)

---

<div align="center">
<i>Engineered with precision for the modern developer workflow.</i>
</div>
