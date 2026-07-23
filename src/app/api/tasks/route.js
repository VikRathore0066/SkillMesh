import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const skill = searchParams.get('skill');
    const search = searchParams.get('search');

    console.log("🔍 API /api/tasks: Received status =", status, ", search =", search);

    let query = `
      SELECT t.*, u.name as poster_name, u.avatar_url as poster_avatar
      FROM tasks t
      JOIN users u ON t.poster_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ` AND t.status = ?`;
      params.push(status);
    }

    if (skill) {
      query += ` AND t.skill_tags LIKE ?`;
      params.push(`%${skill}%`);
    }

    if (search) {
      query += ` AND (t.title LIKE ? OR t.description LIKE ? OR t.skill_tags LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY t.created_at DESC`;

    const tasks = db.prepare(query).all(...params);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Tasks GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to post a task' }, { status: 401 });
    }

    const { title, description, skill_tags, deliverable_type, due_date } = await request.json();

    if (!title || !description || !skill_tags) {
      return NextResponse.json({ error: 'Title, description, and skill tags are required' }, { status: 400 });
    }

    const result = db.prepare(`
      INSERT INTO tasks (poster_id, title, description, skill_tags, deliverable_type, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      user.id,
      title,
      description,
      skill_tags,
      deliverable_type || 'link',
      due_date || null
    );

    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error('Tasks POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
