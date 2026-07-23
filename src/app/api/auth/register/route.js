import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { name, email, password, role, bio } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const userRole = role === 'poster' ? 'poster' : 'learner';

    const result = db.prepare(
      'INSERT INTO users (name, email, password_hash, role, bio) VALUES (?, ?, ?, ?, ?)'
    ).run(name, email, hashedPassword, userRole, bio || '');

    const userId = Number(result.lastInsertRowid);
    const token = await signToken({ id: userId, email, role: userRole });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400
    });

    return NextResponse.json({
      message: 'Account created successfully',
      user: { id: userId, name, email, role: userRole }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
