import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const submission = db.prepare(`
      SELECT s.*, t.title as task_title, t.description as task_description, 
             t.skill_tags, t.deliverable_type,
             u.name as learner_name
      FROM submissions s
      JOIN tasks t ON s.task_id = t.id
      JOIN users u ON s.learner_id = u.id
      WHERE s.id = ?
    `).get(id);

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const reviews = db.prepare(`
      SELECT r.*, u.name as reviewer_name, u.avatar_url as reviewer_avatar
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.submission_id = ?
      ORDER BY r.created_at DESC
    `).all(id);

    return NextResponse.json({ submission, reviews });
  } catch (error) {
    console.error('Submission GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
