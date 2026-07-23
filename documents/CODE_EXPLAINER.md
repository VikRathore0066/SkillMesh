# 📑 SkillMesh Codebase Explainer

This document outlines the architecture, database schema, data flows, and code roles for the **SkillMesh** project.

---

## 💾 1. Database Schema (`src/lib/db.js`)

We use a local SQLite database (`skillmesh.db`) configured through `better-sqlite3`.

### Entity-Relationship Diagram (Mental Model)
```
  ┌──────────┐          ┌──────────┐          ┌──────────────┐
  │  users   │ ◄─────── │  tasks   │ ◄─────── │ submissions  │
  └──────────┘          └──────────┘          └──────────────┘
       ▲                     ▲                       ▲
       │                     │                       │
       │                     └─────────┐             │
       │                               │             │
  ┌────┴─────┐                    ┌────┴─────┐       │
  │ reviews  │ ──────────────────▶│ verifier │ ──────┘
  └──────────┘                    │ assigns  │
                                  └──────────┘
```

### Table Definitions
1. **`users`**:
   - Stores user credentials, hashed passwords, roles (`learner`, `poster`), bio, and metrics.
   - Core fields: `reputation_score` (calculated weighted rating), `total_reviews` (count of evaluations).
2. **`tasks`**:
   - Stores task details, tags, deliverable formats, status tracking, and claims.
   - Status transitions: `open` ➔ `claimed` ➔ `submitted` ➔ `under_review` ➔ `verified`.
3. **`submissions`**:
   - Created when a learner submits a work artifact. Points to the corresponding task and the learner.
4. **`reviews`**:
   - Stores reviews from the task poster (`poster` type) or peer verifiers (`peer` type). Contains ratings (1-5 stars) and feedback comments.
5. **`verifier_assignments`**:
   - Assigns completed task submissions to random peer verifiers. Triggers status progression once complete.

---

## 🛡️ 2. Authentication Flow (`src/lib/auth.js`)

Authentication uses JSON Web Tokens (JWT) signed and verified using the lightweight `jose` library, keeping sessions stateless.

- **Registration (`/api/auth/register`)**: Hashes the user password with `bcryptjs` and inserts them into the `users` table. Signs a session token and sets it as an `HttpOnly`, secure cookie.
- **Login (`/api/auth/login`)**: Validates the email and verifies the password hash using `bcryptjs`. Sets the cookie on success.
- **State Check (`/api/auth/me`)**: Retrieves the token from incoming cookies/headers, decodes the payload, queries the DB, and returns the fresh user profile.
- **Logout (`/api/auth/logout`)**: Deletes the cookie.

---

## 🏆 3. Reputation Scoring Model (`src/lib/reputation.js`)

A learner's reputation score is dynamically recalculated every time a new review is submitted.

### The Formula:
$$Reputation = (PosterRating \times 0.6) + (AveragePeerRating \times 0.4)$$

- **Weighting**: The Task Poster (requester) has a direct stakeholder weight of `0.6`, while peer reviews average out bias with a weight of `0.4`.
- **Implementation**:
  - `calculateReputation(userId)`: Queries all reviews associated with the learner's submissions, aggregates ratings by reviewer type, applies weights, and returns the final score.
  - `updateReputation(userId)`: Commits the recalculated average score and the total review count back to the `users` record.

---

## 🔌 4. API Endpoints

All API endpoints are implemented as Next.js Route Handlers inside `src/app/api/`:

| Endpoint | Method | Role | Security Checks |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Registers a new account and logs them in. | Open |
| `/api/auth/login` | `POST` | Logs in and returns cookie session. | Open |
| `/api/auth/logout` | `POST` | Clears HttpOnly cookie. | Authenticated |
| `/api/auth/me` | `GET` | Returns authenticated user details. | Authenticated |
| `/api/tasks` | `GET` | Lists tasks. Support filters (`status`, `search`, `skill`). | Open |
| `/api/tasks` | `POST` | Creates a new task. | Authenticated |
| `/api/tasks/[id]` | `GET` | Returns task details, learner submissions, and reviews. | Open |
| `/api/tasks/[id]/claim` | `POST` | Sets task status to `claimed` by current learner. | Learner Only |
| `/api/tasks/[id]/submit`| `POST` | Stores submission and auto-assigns a peer verifier. | Claimer Only |
| `/api/submissions/[id]` | `GET` | Fetches submission URL, notes, and reviews. | Open |
| `/api/submissions/[id]/review` | `POST` | Appends a review, updates status, and recalculates reputation. | Poster/Assignee |
| `/api/reviews/pending` | `GET` | Gets items the user needs to review (as poster or peer). | Authenticated |
| `/api/users/[id]/portfolio` | `GET` | Returns verified submissions, ratings, and skill clouds. | Open |

---

## 🎨 5. Frontend Pages & Components

We utilize a dark-mode theme utilizing glassmorphism cards and custom CSS variables defined in `src/app/globals.css`.

### Pages (`src/app/`):
- **`page.js` (Home)**: Displays landing animations, core concept widgets, live count stats, and a list of active tasks.
- **`tasks/page.js` (Feed)**: Displays filter pills, query search boxes, and responsive `TaskCard` grids.
- **`tasks/[id]/page.js` (Detail)**: Manages task states. Shows description when open, submission forms when claimed, and review timelines when verified.
- **`reviews/page.js` (Review Dashboard)**: Shows tasks requiring actions, with interactive rating stars and feedback boxes.
- **`portfolio/[id]/page.js` (Portfolio)**: A public-facing, resume-style page showcasing the reputation rating, aggregated skill counts, and verified submissions.

### Components (`src/components/`):
- **`Navbar.js`**: Listens to custom `'auth-change'` events on login/logout to dynamically update account profiles.
- **`StarRating.js`**: Renders golden stars. Supports click selection (when reviewing) or read-only display.
- **`TaskCard.js`**: Standard card with status colors, tag lists, and slide-up hover effects.
- **`Toast.js`**: Provides dynamic alert slides (success, info, warning, error).
- **`Modal.js` / `EmptyState.js`**: Standard overlay frames and default empty feeds.
