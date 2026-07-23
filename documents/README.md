# 🌐 SkillMesh

**SkillMesh** closes the "credential vs. capability" gap. Rather than relying on static certificates, learners claim lightweight, real-world tasks posted by organizations. Once completed, the work is verified through a dual-review process (from both the task requester and randomly selected peer reviewers), generating a shareable, verified proof-of-work portfolio with a dynamic reputation score.

### 🔗 Live URL: **[https://skill-mesh-five.vercel.app/](https://skill-mesh-five.vercel.app/)**

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: Version 18 or higher (LTS recommended)
- **NPM**: Package manager (comes bundled with Node.js)

### 2. Setup & Installation
1. Clone this repository and navigate into the project directory:
   ```bash
   git clone <your-repository-url>
   cd skillmesh
   ```
2. Install all dependencies:
   ```bash
   npm install
   ```

### 3. Run the Application
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.
3. The database initializes and auto-seeds with demo users, tasks, and reviews on the very first start!

---

## 🔑 Demo Login Credentials
You can log in as any of the following pre-seeded users using the universal password: **`password123`**

| Name | Email | Role | Profile / Bio |
| :--- | :--- | :--- | :--- |
| **Charlie Kumar** | `charlie@dev.net` | 👨‍💻 Learner | Full-stack developer (React, Node.js) |
| **Diana Okafor** | `diana@analytics.io` | 👩‍💻 Learner | Data science enthusiast (Python, SQL) |
| **Eve Nakamura** | `eve@content.org` | ✍️ Learner | Technical writer & content strategist |
| **Alice Chen** | `alice@startup.com` | 🏢 Task Poster | CEO of NovaTech developer tools |
| **Bob Martinez** | `bob@design.co` | 🎨 Task Poster | Creative Director at PixelCraft Studio |

---

## 🔄 How the Task Verification Loop Works

```
[Task Poster]             [Learner]             [Peer Verifier]
  Post Task   ──(Open)──▶ Claim Task ──(Claimed)──▶ Submit Link
      │                                                 │
      ▼                                                 ▼
Poster Review ◀──────────(Under Review)─────────── Peer Review
      │                                                 │
      └─────────────────▶ [Verified] ◀──────────────────┘
                            │
                            ▼
                    Reputation Score Updates
                    Portfolio Added to public URL
```

### Step-by-Step Demo Guide:
1. **Browse Feed**: Go to `/tasks` to see open listings.
2. **Claim**: Login as **Diana** (`diana@analytics.io`) and **Claim** the *Analyze User Churn Dataset* task.
3. **Submit**: Click **Submit Work**, enter a link (e.g. your GitHub link) and notes, and click **Submit for Review**.
4. **Peer Review**: Log in as **Charlie** (`charlie@dev.net`), visit `/reviews`, expand Diana's submission, rate it, and submit the review.
5. **Poster Review**: Log in as **Alice** (`alice@startup.com`), visit `/reviews`, rate and comment on the submission, and verify it.
6. **Portfolio View**: Check Diana's portfolio at `/portfolio` to see her updated **Reputation Score** and **Verified Work Log**.

---

## 📁 Project Structure

```
SkillBridge/
├── src/
│   ├── app/
│   │   ├── api/             # Express-style Next.js Route Handlers
│   │   │   ├── auth/        # Login, logout, registration, session check
│   │   │   ├── tasks/       # Feed listing, task details, claiming, submissions
│   │   │   ├── reviews/     # Review submissions and queues
│   │   │   └── users/       # Profiles and portfolio queries
│   │   ├── auth/            # Frontend pages for Login & Signup
│   │   ├── portfolio/       # Public-facing shareable resume views
│   │   ├── reviews/         # Reviewer queue dashboard
│   │   ├── tasks/           # Browse feed, new task forms, details
│   │   ├── globals.css      # Premium dark-mode variables, typography, animations
│   │   └── layout.js        # Root shell with global Navbar and Toast notifications
│   ├── components/          # Reusable UI components (Navbar, Toast, StarRating, Modal)
│   └── lib/
│       ├── db.js            # SQLite connection, tables layout, and auto-seeding
│       ├── auth.js          # JWT sign/verify, password hashing, and cookie helpers
│       └── reputation.js    # Weighted scoring algorithm formula
├── package.json
└── next.config.mjs
```

---

## ⚙️ Configuration
The configuration variables are loaded from `.env.local`:
- `JWT_SECRET`: Used to secure login sessions.
- `DATABASE_PATH`: Relative or absolute path to SQLite file (defaults to `skillmesh.db`).
