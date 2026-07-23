# 🌐 SkillMesh Demo Dashboard

SkillMesh is a verified task marketplace where learners build real-world portfolios of peer-reviewed work. The application is running live at **[https://skill-mesh-five.vercel.app/](https://skill-mesh-five.vercel.app/)**.

---

## 🔑 Demo Accounts (Password: `password123`)

You can log in as any of the following pre-seeded users to test the different roles and flows:

| User Name | Email | Role | Bio |
| :--- | :--- | :--- | :--- |
| **Charlie Kumar** | `charlie@dev.net` | **Learner** (👨‍💻) | Full-stack developer focused on React and Node.js. |
| **Diana Okafor** | `diana@analytics.io` | **Learner** (👩‍💻) | Data science enthusiast. Python, pandas, and SQL. |
| **Eve Nakamura** | `eve@content.org` | **Learner** (✍️) | Technical writer and content strategist. |
| **Alice Chen** | `alice@startup.com` | **Task Poster** (🏢) | CEO of NovaTech, building next-gen developer tools. |
| **Bob Martinez** | `bob@design.co` | **Task Poster** (🎨) | Creative Director at PixelCraft Studio. |

---

## 🔄 End-to-End Demo Guide

Follow these steps to demonstrate the entire SkillMesh ecosystem in under 2 minutes:

### 1. Browse Open Tasks
1. Visit **[https://skill-mesh-five.vercel.app/tasks](https://skill-mesh-five.vercel.app/tasks)**.
2. Observe the search and status filter options.
3. Find an **Open** task (e.g., *UX Audit of SaaS Dashboard* or *Analyze User Churn Dataset*).

### 2. Claim a Task (as a Learner)
1. Go to **[Login](https://skill-mesh-five.vercel.app/auth/login)** and sign in as **Diana Okafor** (`diana@analytics.io` / `password123`).
2. Go to the task details page of **Analyze User Churn Dataset**.
3. Click the **Claim Task** button.
4. Notice the status updates to **Claimed** and the submission form appears.

### 3. Submit Deliverable
1. On the claimed task page, click **Submit Work**.
2. Enter a mock URL (e.g., `https://github.com/diana-o/churn-analysis`) and write notes in the textbox.
3. Click **Submit for Review**.
4. The task status transitions to **Under Review**.
5. The system automatically assigns a random peer verifier (e.g., *Charlie* or *Eve*) behind the scenes.

### 4. Perform Peer Review (as a Peer)
1. Logout and log in as **Charlie Kumar** (`charlie@dev.net` / `password123`).
2. Visit **[https://skill-mesh-five.vercel.app/reviews](https://skill-mesh-five.vercel.app/reviews)**.
3. Under **Pending Reviews**, click on the newly submitted card.
4. Fill in a rating (e.g., 4 or 5 stars) and add constructive feedback.
5. Click **Verify & Approve**.

### 5. Final Approval (as a Task Poster)
1. Logout and log in as **Alice Chen** (`alice@startup.com` / `password123`) — the task poster.
2. Go to **[Pending Reviews](https://skill-mesh-five.vercel.app/reviews)**.
3. Fill in the rating and comments, then click **Verify & Approve**.
4. The task status transitions to **Verified**.

### 6. View the Shareable Portfolio
1. Go to Diana's profile or visit **[https://skill-mesh-five.vercel.app/portfolio](https://skill-mesh-five.vercel.app/portfolio)**.
2. Look at the premium, resume-like layout.
3. Observe the live **Reputation Score** (weighted average: `60%` Poster + `40%` Peer reviews) and the newly added **Verified Work Log**.

---

## 🛠️ Tech Stack & Design Architecture

- **Frontend**: Next.js 14 (App Router) using a custom dark-mode design system with glassmorphism cards and micro-animations.
- **Backend**: Node.js/Express-style handlers located inside `src/app/api/` routes.
- **Database**: SQLite (`better-sqlite3`) for simple zero-config local runs, with full referential integrity.
- **Authentication**: JWT token-based auth stored client-side via HttpOnly cookies and protected route middleware.
- **Reputation System**: Automatic weighted scoring calculations written in `src/lib/reputation.js`.
