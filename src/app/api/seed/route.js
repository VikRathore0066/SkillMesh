import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { seedDb } from '@/lib/db';

export async function POST(request) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Seeding is disabled in production' }, { status: 403 });
    }

    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to seed the database' }, { status: 401 });
    }

    if (user.role !== 'poster') {
      return NextResponse.json({ error: 'Only posters can seed the database' }, { status: 403 });
    }

    seedDb();
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
