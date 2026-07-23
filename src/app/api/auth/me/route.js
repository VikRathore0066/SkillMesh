import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(request) {
  try {
    const authUser = await getUser(request);
    
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = db.prepare(
      'SELECT id, name, email, role, reputation_score, total_reviews, avatar_url, bio, created_at FROM users WHERE id = ?'
    ).get(authUser.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
