import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const user = db.prepare(
      'SELECT id, name, role, reputation_score, total_reviews, avatar_url, bio, created_at FROM users WHERE id = ?'
    ).get(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let stats = {};
    if (user.role === 'learner') {
      stats.completed_tasks = db.prepare(`
        SELECT COUNT(*) as count FROM tasks WHERE claimed_by = ? AND status = 'verified'
      `).get(id).count;
      stats.active_tasks = db.prepare(`
        SELECT COUNT(*) as count FROM tasks WHERE claimed_by = ? AND status IN ('claimed', 'submitted', 'under_review')
      `).get(id).count;
    } else {
      stats.posted_tasks = db.prepare(`
        SELECT COUNT(*) as count FROM tasks WHERE poster_id = ?
      `).get(id).count;
      stats.verified_tasks = db.prepare(`
        SELECT COUNT(*) as count FROM tasks WHERE poster_id = ? AND status = 'verified'
      `).get(id).count;
    }

    return NextResponse.json({ user, stats });
  } catch (error) {
    console.error('User GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
