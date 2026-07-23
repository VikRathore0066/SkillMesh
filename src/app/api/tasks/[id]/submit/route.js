import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to submit work' }, { status: 401 });
    }

    const { id } = await params;
    const { artifact_url, artifact_type, notes } = await request.json();

    if (!artifact_url) {
      return NextResponse.json({ error: 'Please provide a link to your work' }, { status: 400 });
    }

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (task.claimed_by !== user.id) {
      return NextResponse.json({ error: 'You have not claimed this task' }, { status: 403 });
    }

    if (task.status !== 'claimed') {
      return NextResponse.json({ error: 'This task is not in a claimable state' }, { status: 400 });
    }

    // Insert submission
    const result = db.prepare(`
      INSERT INTO submissions (task_id, learner_id, artifact_url, artifact_type, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, user.id, artifact_url, artifact_type || 'link', notes || '');

    const submissionId = Number(result.lastInsertRowid);

    // Update task status
    db.prepare("UPDATE tasks SET status = 'submitted' WHERE id = ?").run(id);

    // Auto-assign a random peer verifier (not the submitter, not the poster)
    const peer = db.prepare(`
      SELECT id FROM users 
      WHERE id != ? AND id != ?
      ORDER BY RANDOM() LIMIT 1
    `).get(user.id, task.poster_id);

    if (peer) {
      db.prepare(`
        INSERT INTO verifier_assignments (submission_id, verifier_id) VALUES (?, ?)
      `).run(submissionId, peer.id);
    }

    return NextResponse.json({ message: 'Work submitted successfully! It will be reviewed shortly.', submissionId });
  } catch (error) {
    console.error('Task Submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
