import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to manage claims' }, { status: 401 });
    }

    const { id } = await params;

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (task.claimed_by !== user.id) {
      return NextResponse.json({ error: 'You are not the claimant of this task' }, { status: 403 });
    }

    if (task.status !== 'claimed') {
      return NextResponse.json({ error: 'You can only give up on tasks that are currently in progress (claimed)' }, { status: 400 });
    }

    db.prepare("UPDATE tasks SET status = 'open', claimed_by = NULL WHERE id = ?").run(id);

    return NextResponse.json({ message: 'Task unclaimed. It is now open for others to claim.' });
  } catch (error) {
    console.error('Task Unclaim error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
