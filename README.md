# 🌐 SkillMesh — Verified Skill Portfolio Marketplace

**SkillMesh** is a modern web application designed to bridge the gap between academic credentials and real-world capabilities. Traditional static certificates and resumes often fail to represent a learner's actual hands-on skills. SkillMesh solves this by providing a task-driven marketplace where organizations post real-world projects, and learners claim, build, and submit them. Completed deliverables undergo a robust dual-review verification process (comprising reviews from both the task poster and randomly assigned peer verifiers) to produce a verified public portfolio and a dynamic reputation score.

This platform empowers learners to build proof-of-work history that employers can trust, while enabling organizations to source vetted talent based on proven deliverables.

### 🔗 Live URL: **[https://skill-mesh-five.vercel.app/](https://skill-mesh-five.vercel.app/)**

---

## 🎯 Project Overview & Core Features

SkillMesh functions as a decentralized skill verification marketplace. The platform facilitates three key user interactions:
- **Discovering & Claiming Tasks**: Learners browse a feed of open tasks categorized by skill tags and claim tasks that align with their career objectives.
- **Dual-Review Verification Queue**: Submissions undergo review by the organization that posted the task (Poster Review) and a randomly selected developer from the community (Peer Review).
- **Verified Proof-of-Work Portfolios**: Once verified, deliverables are locked into the learner's public portfolio page, which showcases a dynamic, weighted **Reputation Score** and a verified work log.

### Key Capabilities:
- **Interactive Feed**: Features open tasks ranging from frontend page assembly to backend API middleware design.
- **Peer Assignment Engine**: Automates the selection of an independent reviewer from the platform's user base upon submission to eliminate review collusion.
- **Dynamic Reputation Profiling**: Evaluates user competency scores based on weighted feedback metrics rather than single-source approvals.

---

## 🏗️ Architecture & Technology Stack

The project is built on a modern full-stack JavaScript environment chosen for developer ergonomics, zero-config onboarding, and fast runtime execution.

### Tech Stack Overview:
1. **Frontend & Page Routing**: Next.js 14 (using the App Router). Next.js was selected to enable React Server Components for fast page loading, routing, and search-engine optimized (SEO) public portfolio pages (see [package.json](./package.json)).
2. **Styling & Interface Design**: **Vanilla CSS**. Defined in [globals.css](./src/app/globals.css), the design system relies on CSS variables for a premium dark-themed aesthetic, micro-animations, glassmorphism card components, and responsive typography without the dependency overhead of utility CSS frameworks.
3. **Backend & Endpoints**: Express-style Next.js Route Handlers (API endpoints) inside the `src/app/api` directory. This unifies frontend pages and backend endpoints into a single deployment unit.
4. **Local Database**: SQLite managed via `better-sqlite3`. This provides synchronous database execution, zero server overhead, and immediate local database setup.
5. **Authentication & Security**: JSON Web Tokens (JWT) using `jose` for lightweight token signing and verification, and `bcryptjs` for password hashing (see [auth.js](./src/lib/auth.js)).
6. **Reputation Logic**: Implemented in [reputation.js](./src/lib/reputation.js), utilizing a weighted formula that balances task-poster assessment (60%) and community peer verification (40%).

### Database Schema Design
The SQLite database file is initialized via [db.js](./src/lib/db.js). It sets up five structured tables:
- **`users`**: Stores developer profiles, roles (`learner` vs `poster`), hashed credentials, bio descriptions, and calculated reputation scores.
- **`tasks`**: Tracks project requirements, tag filters, expected deliverable formats (`repository`, `link`, `file`), state transitions (`open`, `claimed`, `submitted`, `under_review`, `verified`), and assignee identifiers.
- **`submissions`**: Documents learner submissions, storing URLs pointing to deliverables along with approach notes.
- **`reviews`**: Holds rating values (1 to 5 stars), written reviews, and reviewer type identifiers.
- **`verifier_assignments`**: Maintains assignments connecting submissions to randomly assigned peer verifiers.

---

## ⚙️ Setup & Configuration Instructions

Follow these step-by-step instructions to configure and run the SkillMesh codebase on your local workstation.

### 1. Prerequisites
- **Node.js**: Version 18.x or newer is required.
- **npm**: Package manager (comes bundled with Node.js).

### 2. Installation
Clone the repository to your local folder and install the necessary dependencies:

```bash
# Clone the repository
git clone <repository-url>
cd SkillBridge

# Install dependencies
npm install
```

### 3. Environment Variables Configuration
Configure the environment by duplicating the variable template file:

```bash
cp .env.example .env.local
```

Open the newly created `.env.local` file (modeled after [.env.example](./.env.example)). The configurations available are:

```env
# JWT Secret key - replace this with a secure random string for production
JWT_SECRET=skillmesh-dev-secret-change-in-production

# SQLite database file path (defaults to ./skillmesh.db if left blank)
DATABASE_PATH=./skillmesh.db

# Optional API Integrations:
# Set a GitHub personal access token to authorize automated repository deliverables checks
GITHUB_TOKEN=your_github_token_here

# Set a Figma access token to enable design-artifact canvas verification checks
FIGMA_TOKEN=your_figma_token_here
```

#### 🔌 Handling Optional GitHub & Figma API Integrations
The environment settings allow for optional tokens:
* **GitHub Integration (`GITHUB_TOKEN`)**: Provides access authorization for repository deliverable parsing. If active, backend scripts can inspect repository files, read lines of code, and check git log metadata to confirm the learner authored the commits.
* **Figma Integration (`FIGMA_TOKEN`)**: Interacts with the Figma REST API. When developers submit Figma design links, the system can parse page configurations, verify component architectures, and check if auto-layout constraints are configured before human reviewers inspect the design files.

*Note: If these tokens are left blank, the application defaults to standard manual review mode, allowing reviewers to grade work deliverables via their browser without automated sanity checks.*

### 4. Running the Development Server
Initiate the Next.js local server to run the application:

```bash
npm run dev
```

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**. 

Upon first execution, [db.js](./src/lib/db.js) will detect the absence of the database file, execute the table schemas initialization to build the SQLite tables, and automatically run the seeding function to seed the database with mock accounts, listings, and completed submissions.

#### 🔑 Pre-Seeded Accounts for Testing
You can log in to any of the following accounts using the universal password: **`password123`**

| User Name | Email Address | Account Role | Background / Bio |
| :--- | :--- | :--- | :--- |
| **Charlie Kumar** | `charlie@dev.net` | 👨‍💻 Learner | Full-stack developer (React, Node.js) |
| **Diana Okafor** | `diana@analytics.io` | 👩‍💻 Learner | Data science enthusiast (Python, SQL) |
| **Eve Nakamura** | `eve@content.org` | ✍️ Learner | Technical writer & content strategist |
| **Alice Chen** | `alice@startup.com` | 🏢 Task Poster | CEO of NovaTech developer tools |
| **Bob Martinez** | `bob@design.co` | 🎨 Task Poster | Creative Director at PixelCraft Studio |

---

## 🔄 The Task Submission & Review Process

SkillMesh employs a verification system to prevent self-grading and ensure submission authenticity.

### The Lifecycle of a Task:
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

1. **Task Creation**: An organization (e.g., Alice Chen) posts a task listing (e.g., *"Build a Modern Landing Page"*). The deliverable requirement is set to a specific format (e.g., `repository`).
2. **Claiming**: A learner (e.g., Charlie Kumar) claims the task. Its status updates from `open` to `claimed`.
3. **Submission**: The learner builds the solution, navigates to the task page, and enters the artifact link (e.g., a GitHub repository URL) and implementation notes.
4. **Peer Assignment**: Once submitted, the system updates the task status to `submitted`. The endpoint automatically assigns a random user in the system (e.g., Diana Okafor) to serve as the **Peer Verifier**, inserting a record into the verifier assignments table.
5. **Dual Review**: 
   - The peer verifier reviews the submission on the `/reviews` dashboard, scores it from 1 to 5, and submits the feedback. This updates the task status to `under_review`.
   - The task poster (Alice Chen) views the submission, evaluates the code, rates it, and verifies it. This updates the task status to `verified` (see [review endpoint](./src/app/api/submissions/[id]/review/route.js)).
6. **Reputation Update**: The learner's profile score is automatically re-calculated.

### The Weighted Reputation Algorithm
To ensure fair grading, ratings from task posters are weighted higher than peer reviews. The calculation is executed in [reputation.js](./src/lib/reputation.js):

$$\text{Reputation Score} = \frac{\sum (\text{Rating} \times \text{Weight})}{\sum \text{Weight}}$$

Where:
* **Poster Rating Weight**: 60% (`0.6`)
* **Peer Rating Weight**: 40% (`0.4`)

For example, if Charlie Kumar receives a 5-star review from the Task Poster (Alice) and a 4-star review from the Peer Reviewer (Diana):

$$\text{Weighted Score} = \frac{(5 \times 0.6) + (4 \times 0.4)}{0.6 + 0.4} = \frac{3.0 + 1.6}{1.0} = 4.60$$

This score is updated directly in the `users` table via the `updateReputation` function in [reputation.js](./src/lib/reputation.js).

---

## 🤝 Contribution Guidelines

We welcome contributions from developers, technical writers, and designers. To set up your local development environment for contributing:

### Local Development Flow:
1. **Fork the Repository**: Create a fork of the main repository to your GitHub account.
2. **Create a Branch**: Create a feature branch focusing on a single improvement or bug fix:
   ```bash
   git checkout -b feature/your-improvement-name
   ```
3. **Inspect Database Local State**: Because SkillMesh uses SQLite, you can query database changes during development using terminal tools or an SQLite GUI editor:
   ```bash
   sqlite3 skillmesh.db "SELECT * FROM users;"
   ```
4. **Follow Project Coding Standards**:
   - Write clean, modular React Server Components.
   - Restrict custom styling to [globals.css](./src/app/globals.css) variables to preserve styling consistency.
   - Keep route handlers declarative and secure. Validate auth cookies using `getUser` (defined in [auth.js](./src/lib/auth.js)) before performing database operations.
5. **Testing Changes**: Ensure your local Next.js server starts cleanly with no compile warnings or layout shifts. Run `npm run lint` to verify code quality.
6. **Submit a Pull Request**: Open a detailed pull request to the main repository, explaining your implementation decisions.

---

## 📣 Join Us & Build the Future of Skill Verification!

SkillMesh is changing how learners prove their capabilities and how companies hire talent. Whether you are a developer looking to refine your stack, a hackathon organizer seeking a reliable submission review tool, or an organization trying to find vetted talent, we invite you to contribute.

* **Want to add a feature?** Check our open task board and claim a project.
* **Found a bug?** Submit an issue on the repository, and we will address it.
* **Have feedback?** Reach out to the core maintainers.

Let's build a verified web portfolio that speaks louder than paper credentials!
