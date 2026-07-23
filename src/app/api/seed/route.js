import { NextResponse } from 'next/server';
import { seedDb } from '@/lib/db';

export async function POST() {
  try {
    seedDb();
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
