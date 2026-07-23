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

    // Get verified tasks with their submissions and avg ratings
    const portfolio = db.prepare(`
      SELECT s.id as submission_id, s.artifact_url, s.artifact_type, s.notes, s.submitted_at,
             t.id as task_id, t.title as task_title, t.skill_tags,
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(r.id) as review_count
      FROM submissions s
      JOIN tasks t ON s.task_id = t.id
      LEFT JOIN reviews r ON r.submission_id = s.id
      WHERE s.learner_id = ? AND t.status = 'verified'
      GROUP BY s.id
      ORDER BY s.submitted_at DESC
    `).all(id);

    // Get unique skill counts
    const allSkills = {};
    for (const item of portfolio) {
      const tags = item.skill_tags ? item.skill_tags.split(',') : [];
      for (const tag of tags) {
        const trimmed = tag.trim();
        if (trimmed) {
          allSkills[trimmed] = (allSkills[trimmed] || 0) + 1;
        }
      }
    }
    const skills = Object.entries(allSkills)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({ user, portfolio, skills });
  } catch (error) {
    console.error('Portfolio GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
