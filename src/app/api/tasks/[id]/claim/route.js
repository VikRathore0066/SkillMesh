import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to claim a task' }, { status: 401 });
    }

    const { id } = await params;

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (task.status !== 'open') {
      return NextResponse.json({ error: 'This task is no longer available for claiming' }, { status: 400 });
    }

    if (task.poster_id === user.id) {
      return NextResponse.json({ error: 'You cannot claim your own task' }, { status: 400 });
    }

    // Check active claims limit
    const activeClaims = db.prepare(`
      SELECT COUNT(*) as count FROM tasks 
      WHERE claimed_by = ? AND status IN ('claimed', 'submitted', 'under_review')
    `).get(user.id);

    if (activeClaims.count >= 5) {
      return NextResponse.json({ error: 'You have reached the maximum of 5 active claims. Complete some tasks first!' }, { status: 400 });
    }

    db.prepare('UPDATE tasks SET status = ?, claimed_by = ? WHERE id = ?').run('claimed', user.id, id);

    return NextResponse.json({ message: 'Task claimed successfully! Get started on the deliverable.' });
  } catch (error) {
    console.error('Task Claim error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
