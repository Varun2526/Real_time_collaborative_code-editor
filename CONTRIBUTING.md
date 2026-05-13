# 🤝 Contributing to KodaX

Thank you for your interest in contributing to KodaX! This guide covers everything you need to get started.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Areas for Contribution](#areas-for-contribution)

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Real_time_collaborative_code-editor.git
   cd Real_time_collaborative_code-editor
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/Varun2526/Real_time_collaborative_code-editor.git
   ```
4. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Development Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Google OAuth credentials (optional, for OAuth features)
- GitHub OAuth App (optional, for OAuth features)
- JDoodle API keys (optional, for code execution)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env with your local values (DB_URL and JWT_SECRET at minimum)
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Fill in VITE_GOOGLE_CLIENT_ID and VITE_GITHUB_CLIENT_ID (can be blank for local dev without OAuth)
npm run dev
```

---

## Project Structure

See the [main README](./Readme.md#-project-structure) for the full directory tree.

Key areas:
- `backend/controllers/` — Add new controller logic here
- `backend/sockets/handlers/` — Add new socket event handlers here
- `frontend/src/components/` — New React components
- `frontend/src/pages/` — New page components
- `frontend/src/utils/` — Shared utilities

---

## Coding Standards

### General

- Use **ES Modules** (`import`/`export`) — both backend and frontend use `"type": "module"`
- Prefer `async/await` over `.then()/.catch()` chains
- Add **JSDoc comments** for non-trivial functions
- Do not commit `console.log` debug statements to production code

### Backend

- Keep controllers thin — business logic belongs in controllers, not routes
- Validate input at the controller level before touching the database
- All error responses must include `{ message: string, error?: string }`
- Socket handlers must verify room membership before any operation

### Frontend

- Use functional React components and hooks only — no class components
- Keep components focused — if a component exceeds ~200 lines, consider splitting it
- Name event handlers with the `handle` prefix: `handleSubmit`, `handleClose`
- Use `useCallback` and `useMemo` where re-renders are expensive (e.g., in `RoomPage`)
- All API calls must include `{ withCredentials: true }` for cookie auth

### CSS / Tailwind

- Use existing custom Tailwind classes from `index.css` before adding new ones:
  - `btn-ghost`, `text-spacex-nav`, `text-spacex-body`, `custom-scrollbar`, etc.
- Follow the SpaceX-inspired dark design language — black backgrounds, white text, subtle borders

---

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting (no logic changes) |
| `refactor` | Code restructuring without behavior change |
| `perf` | Performance improvements |
| `test` | Adding/updating tests |
| `chore` | Build, tooling, or config changes |

### Examples

```bash
feat(room): add file rename support
fix(auth): handle Google auth when email is not verified
docs(backend): update API reference for room endpoints
refactor(frontend): extract chat logic into useChatRoom hook
chore: update nodemon to v3.1
```

---

## Pull Request Process

1. **Sync your fork** with upstream before submitting:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. **Test your changes** — make sure the app runs without errors
3. **Update documentation** — if you add/change an API endpoint or socket event, update `backend/README.md`
4. **Write a clear PR description**:
   - What problem does this solve?
   - What changes did you make?
   - Screenshots if it's a UI change
5. **Request review** from at least one maintainer

### PR Checklist

- [ ] My code follows the project's coding standards
- [ ] I have tested my changes locally (backend + frontend)
- [ ] I have updated relevant documentation
- [ ] My commits follow the Conventional Commits format
- [ ] I have not included any secrets or `.env` files

---

## Issue Reporting

### Bug Reports

When reporting a bug, include:
- **Steps to reproduce** — exact sequence that causes the issue
- **Expected behavior** — what should happen
- **Actual behavior** — what actually happens
- **Screenshots or error messages** — copy the full error from the console
- **Environment** — OS, Node version, browser

### Feature Requests

When requesting a feature:
- Describe the **problem** you're trying to solve
- Describe your **proposed solution**
- Note any **alternatives** you've considered
- Check the [Roadmap](./Readme.md#-roadmap) first — it may already be planned

---

## Areas for Contribution

Looking for something to work on? Here are great starting points:

### 🟢 Good First Issues
- Add input validation feedback on the Register form (real-time password strength)
- Add a "copy room ID" button to the room header
- Add tooltips to icon buttons in the room toolbar
- Improve mobile responsiveness of the dashboard

### 🟡 Medium Complexity
- Wire up the Zustand stores in `frontend/src/store/` to components
- Implement the `services/api/` service layer with Axios instance + API functions
- Implement the `services/socket/` socket service layer
- Add a members online/offline indicator in the Members panel
- Add file rename functionality to the Explorer panel
- Add keyboard shortcuts (e.g., `Ctrl+Enter` to run code)

### 🔴 Advanced
- Implement Yjs/CRDT for true conflict-free real-time code sync
- Add voice/video calling via WebRTC
- Implement persistent file version history
- Add AI code suggestions via OpenAI API
- Add end-to-end tests with Playwright or Cypress
- Set up CI/CD pipeline (GitHub Actions)

---

## Questions?

Open an issue with the `question` label or reach out to the maintainers.

---

*Thank you for making KodaX better! 🚀*
