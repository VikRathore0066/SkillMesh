import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'skillmesh.db');
const db = new Database(dbPath);

export function initDb() {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'learner',
      reputation_score REAL DEFAULT 0,
      total_reviews INTEGER DEFAULT 0,
      avatar_url TEXT,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poster_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      skill_tags TEXT NOT NULL,
      deliverable_type TEXT NOT NULL DEFAULT 'link',
      status TEXT DEFAULT 'open' CHECK(status IN ('open','claimed','submitted','under_review','verified')),
      due_date TEXT,
      claimed_by INTEGER REFERENCES users(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL REFERENCES tasks(id),
      learner_id INTEGER NOT NULL REFERENCES users(id),
      artifact_url TEXT NOT NULL,
      artifact_type TEXT DEFAULT 'link',
      notes TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL REFERENCES submissions(id),
      reviewer_id INTEGER NOT NULL REFERENCES users(id),
      reviewer_type TEXT NOT NULL CHECK(reviewer_type IN ('poster','peer')),
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS verifier_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL REFERENCES submissions(id),
      verifier_id INTEGER NOT NULL REFERENCES users(id),
      assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed INTEGER DEFAULT 0
    );
  `);
}

export function seedDb() {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    if (userCount > 0) return false;

    console.log('🌱 Seeding SkillMesh database...');
    const insertUser = db.prepare('INSERT INTO users (name, email, password_hash, role, bio, reputation_score) VALUES (?, ?, ?, ?, ?, ?)');
    const defaultPassword = bcrypt.hashSync('password123', 10);

    const users = [
      { name: 'Alice Chen', email: 'alice@startup.com', role: 'poster', bio: 'CEO of NovaTech, building next-gen developer tools. Always looking for talented builders.', rep: 0 },
      { name: 'Bob Martinez', email: 'bob@design.co', role: 'poster', bio: 'Creative Director at PixelCraft Studio. Passionate about design systems and user experience.', rep: 0 },
      { name: 'Charlie Kumar', email: 'charlie@dev.net', role: 'learner', bio: 'Full-stack developer focused on React and Node.js. Building a portfolio of real-world work.', rep: 0 },
      { name: 'Diana Okafor', email: 'diana@analytics.io', role: 'learner', bio: 'Data science enthusiast. Python, pandas, and SQL are my tools. Looking for data-driven projects.', rep: 0 },
      { name: 'Eve Nakamura', email: 'eve@content.org', role: 'learner', bio: 'Technical writer and content strategist. Clear documentation is my superpower.', rep: 0 },
    ];

    const userIds = [];
    for (const u of users) {
      const res = insertUser.run(u.name, u.email, defaultPassword, u.role, u.bio, u.rep);
      userIds.push(Number(res.lastInsertRowid));
    }

    const insertTask = db.prepare('INSERT INTO tasks (poster_id, title, description, skill_tags, deliverable_type, status, due_date, claimed_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

    const today = new Date();
    const futureDate = (days) => new Date(today.getTime() + days * 86400000).toISOString().split('T')[0];

    const tasks = [
      [userIds[0], 'Build a Modern Landing Page', 'Create a responsive, performant landing page for our developer tool launch.\n\nRequirements:\n- Next.js or React\n- Mobile responsive (hamburger nav on mobile)\n- Animated hero section with gradient effects\n- Feature cards with hover animations\n- Performance: Lighthouse score > 90\n- Deploy to Vercel and share the URL\n\nDesign inspiration: Linear, Vercel, or Raycast homepages.', 'React,Next.js,CSS,Responsive Design', 'repository', 'verified', futureDate(-3), userIds[2]],
      [userIds[0], 'Build a Rate Limiting Middleware', 'Implement a production-ready rate limiting middleware for Express.js.\n\nRequirements:\n- Token bucket or sliding window algorithm\n- Configurable rate limits per route\n- Redis integration for distributed environments\n- Proper HTTP 429 responses with retry-after headers\n- Unit tests with > 80% coverage\n- README with setup instructions', 'Node.js,Express,Redis,Backend', 'repository', 'submitted', futureDate(5), userIds[2]],
      [userIds[1], 'Design a Coffee Shop Mobile App', 'Create high-fidelity UI mockups for a premium coffee ordering app.\n\nScreens needed:\n- Home / Menu browsing\n- Product detail with customization\n- Cart and checkout\n- Order tracking\n- Loyalty rewards dashboard\n\nRequirements:\n- Figma file with proper components and auto-layout\n- Dark and light mode variants\n- At least 8 screens', 'Figma,UI Design,Mobile,Prototyping', 'link', 'claimed', futureDate(7), userIds[3]],
      [userIds[1], 'UX Audit of SaaS Dashboard', 'Review our existing analytics dashboard and provide actionable UX feedback.\n\nDeliverables:\n- Heuristic evaluation report (PDF or Notion doc)\n- Annotated screenshots highlighting usability issues\n- Prioritized recommendations (must-fix vs nice-to-have)\n- Competitive analysis with 3 similar products', 'UX Research,UI Review,Heuristics,Documentation', 'file', 'open', futureDate(10), null],
      [userIds[0], 'Analyze User Churn Dataset', 'Use the provided CSV dataset (10K rows) to identify key factors driving user churn.\n\nDeliverables:\n- Jupyter notebook with exploratory data analysis\n- At least 5 visualizations (matplotlib/seaborn)\n- Feature importance analysis\n- A simple predictive model\n- Executive summary with actionable insights', 'Python,Pandas,Data Analysis,Machine Learning', 'repository', 'open', futureDate(12), null],
      [userIds[1], 'Write Technical Blog Posts', 'Write three 1000-word articles on modern web development.\n\nTopics:\n1. "Why Server Components Change Everything"\n2. "Building Accessible Forms in React"\n3. "CSS Container Queries: A Practical Guide"\n\nRequirements:\n- SEO-optimized with proper heading structure\n- Code examples where relevant\n- Reviewed for technical accuracy', 'Technical Writing,SEO,Web Development,Content', 'link', 'verified', futureDate(-5), userIds[4]],
      [userIds[0], 'Create a Social Media Content Calendar', 'Develop a one-month Twitter/X and LinkedIn content strategy.\n\nDeliverables:\n- 30-day content calendar (spreadsheet)\n- 10 pre-written tweet threads\n- 4 LinkedIn long-form post drafts\n- Hashtag strategy document', 'Marketing,Social Media,Content Strategy,Analytics', 'file', 'open', futureDate(14), null],
      [userIds[1], 'Design a PostgreSQL Schema for Multi-Tenant SaaS', 'Design a scalable database schema for a multi-tenant project management SaaS.\n\nRequirements:\n- Support row-level security\n- Handle organizations, projects, tasks, comments\n- Audit logging for compliance\n- ERD diagram and migration scripts', 'PostgreSQL,Database Design,Architecture,SQL', 'repository', 'open', futureDate(8), null],
      [userIds[0], 'Build a REST API with Authentication', 'Create a complete REST API for a task management app.\n\nEndpoints: CRUD for tasks, user registration/login (JWT), RBAC, pagination.\n\nRequirements:\n- Node.js + Express or Fastify\n- PostgreSQL or SQLite\n- Input validation\n- Swagger/OpenAPI docs\n- Docker setup', 'Node.js,REST API,JWT,Docker,PostgreSQL', 'repository', 'open', futureDate(15), null],
      [userIds[1], 'Create Interactive Data Visualizations', 'Build a dashboard with interactive charts using D3.js or Chart.js.\n\nVisualize: Revenue over time, user demographics, feature usage heatmap, conversion funnel.\n\nRequirements:\n- Responsive design with tooltips\n- Smooth transitions/animations\n- Accessible (keyboard navigable)', 'D3.js,Chart.js,Data Visualization,JavaScript,Accessibility', 'repository', 'open', futureDate(11), null],
    ];

    const taskIds = [];
    for (const t of tasks) {
      const res = insertTask.run(...t);
      taskIds.push(Number(res.lastInsertRowid));
    }

    // Submissions for verified/submitted tasks
    const insertSubmission = db.prepare('INSERT INTO submissions (task_id, learner_id, artifact_url, artifact_type, notes) VALUES (?, ?, ?, ?, ?)');

    const sub1 = insertSubmission.run(taskIds[0], userIds[2], 'https://github.com/charlie-k/novatech-landing', 'repository', 'Deployed on Vercel: https://novatech-landing.vercel.app — Lighthouse score: 96.');
    const sub2 = insertSubmission.run(taskIds[1], userIds[2], 'https://github.com/charlie-k/express-rate-limiter', 'repository', 'Implemented sliding window algorithm. Redis integration included. 87% test coverage.');
    const sub3 = insertSubmission.run(taskIds[5], userIds[4], 'https://docs.google.com/document/d/eve-tech-blogs', 'link', 'All three articles completed. Reviewed by two senior developers for technical accuracy.');

    // Reviews
    const insertReview = db.prepare('INSERT INTO reviews (submission_id, reviewer_id, reviewer_type, rating, comment) VALUES (?, ?, ?, ?, ?)');

    // Landing page reviews (task is verified)
    insertReview.run(Number(sub1.lastInsertRowid), userIds[0], 'poster', 5, 'Outstanding work! Clean code, excellent performance, and beautiful design. Exactly what we needed for our launch.');
    insertReview.run(Number(sub1.lastInsertRowid), userIds[3], 'peer', 4, 'Great responsive design and animation work. Code is well-structured. Minor suggestion: add more comments to complex animation logic.');

    // Blog posts reviews (task is verified)
    insertReview.run(Number(sub3.lastInsertRowid), userIds[1], 'poster', 4, 'Well-researched articles with good code examples. Minor edits needed for formatting consistency.');
    insertReview.run(Number(sub3.lastInsertRowid), userIds[2], 'peer', 5, 'Excellent technical depth. The Server Components article is particularly insightful. Ready for publication.');

    // Verifier assignment for rate limiter (submitted, awaiting review)
    const insertAssignment = db.prepare('INSERT INTO verifier_assignments (submission_id, verifier_id) VALUES (?, ?)');
    insertAssignment.run(Number(sub2.lastInsertRowid), userIds[3]);

    // Calculate reputation scores
    function calcReputation(userId) {
      const reviews = db.prepare(`
        SELECT r.rating, r.reviewer_type 
        FROM reviews r
        JOIN submissions s ON r.submission_id = s.id
        WHERE s.learner_id = ?
      `).all(userId);

      if (reviews.length === 0) return;

      let totalWeightedScore = 0;
      let totalWeight = 0;
      for (const review of reviews) {
        const weight = review.reviewer_type === 'poster' ? 0.6 : 0.4;
        totalWeightedScore += review.rating * weight;
        totalWeight += weight;
      }
      const score = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;

      db.prepare('UPDATE users SET reputation_score = ?, total_reviews = ? WHERE id = ?')
        .run(parseFloat(score.toFixed(2)), reviews.length, userId);
    }

    calcReputation(userIds[2]); // Charlie
    calcReputation(userIds[4]); // Eve

    console.log('✅ Database seeded with 5 users, 10 tasks, 3 submissions, 4 reviews');
    return true;
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.message.includes('UNIQUE constraint')) {
      console.log('⚡ Seeding skipped (database already seeded by another process/worker)');
      return false;
    }
    throw err;
  }
}

// Initialize on module load
initDb();
// Auto-seed if empty
seedDb();

export default db;
