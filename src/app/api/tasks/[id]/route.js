import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const task = db.prepare(`
      SELECT t.*, u.name as poster_name, u.avatar_url as poster_avatar,
             c.name as claimed_by_name
      FROM tasks t
      JOIN users u ON t.poster_id = u.id
      LEFT JOIN users c ON t.claimed_by = c.id
      WHERE t.id = ?
    `).get(id);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Get submission if exists
    const submission = db.prepare(`
      SELECT s.*, u.name as learner_name
      FROM submissions s
      JOIN users u ON s.learner_id = u.id
      WHERE s.task_id = ?
      ORDER BY s.submitted_at DESC
      LIMIT 1
    `).get(id);

    // Get reviews if submission exists
    let reviews = [];
    if (submission) {
      reviews = db.prepare(`
        SELECT r.*, u.name as reviewer_name
        FROM reviews r
        JOIN users u ON r.reviewer_id = u.id
        WHERE r.submission_id = ?
        ORDER BY r.created_at DESC
      `).all(submission.id);
    }

    return NextResponse.json({ task, submission: submission || null, reviews });
  } catch (error) {
    console.error('Task GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
