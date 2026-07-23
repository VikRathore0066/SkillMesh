import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let pendingReviews = [];

    if (user.role === 'poster') {
      // Posters review submissions for their tasks that aren't verified yet
      // And where the poster hasn't already reviewed
      pendingReviews = db.prepare(`
        SELECT s.id as submission_id, t.title as task_title, u.name as learner_name, s.submitted_at
        FROM submissions s
        JOIN tasks t ON s.task_id = t.id
        JOIN users u ON s.learner_id = u.id
        LEFT JOIN reviews r ON r.submission_id = s.id AND r.reviewer_id = ?
        WHERE t.poster_id = ? AND r.id IS NULL
      `).all(user.id, user.id);
    } else {
      // Learners review submissions they are assigned to
      pendingReviews = db.prepare(`
        SELECT s.id as submission_id, t.title as task_title, u.name as learner_name, v.assigned_at
        FROM verifier_assignments v
        JOIN submissions s ON v.submission_id = s.id
        JOIN tasks t ON s.task_id = t.id
        JOIN users u ON s.learner_id = u.id
        WHERE v.verifier_id = ? AND v.completed = 0
      `).all(user.id);
    }

    return NextResponse.json({ pendingReviews });
  } catch (error) {
    console.error('Pending Reviews GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
