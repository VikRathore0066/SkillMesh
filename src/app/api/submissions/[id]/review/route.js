import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUser } from '@/lib/auth';
import { updateReputation } from '@/lib/reputation';

export async function POST(request, { params }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to submit a review' }, { status: 401 });
    }

    const { id: submissionId } = await params;
    const { rating, comment } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Please provide a rating between 1 and 5' }, { status: 400 });
    }

    const submission = db.prepare(`
      SELECT s.*, t.poster_id, t.status, t.id as task_id
      FROM submissions s
      JOIN tasks t ON s.task_id = t.id
      WHERE s.id = ?
    `).get(submissionId);

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Check for duplicate review
    const existingReview = db.prepare(
      'SELECT id FROM reviews WHERE submission_id = ? AND reviewer_id = ?'
    ).get(submissionId, user.id);

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this submission' }, { status: 400 });
    }

    // Determine reviewer type
    let reviewerType = null;
    
    if (submission.poster_id === user.id) {
      reviewerType = 'poster';
    } else {
      const assignment = db.prepare(`
        SELECT id FROM verifier_assignments 
        WHERE submission_id = ? AND verifier_id = ? AND completed = 0
      `).get(submissionId, user.id);
      
      if (assignment) {
        reviewerType = 'peer';
        db.prepare('UPDATE verifier_assignments SET completed = 1 WHERE id = ?').run(assignment.id);
      }
    }

    if (!reviewerType) {
      return NextResponse.json({ error: 'You are not authorized to review this submission' }, { status: 403 });
    }

    // Insert review
    db.prepare(`
      INSERT INTO reviews (submission_id, reviewer_id, reviewer_type, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `).run(submissionId, user.id, reviewerType, rating, comment || '');

    // Update task status
    if (reviewerType === 'poster') {
      db.prepare("UPDATE tasks SET status = 'verified' WHERE id = ?").run(submission.task_id);
    } else if (submission.status === 'submitted') {
      db.prepare("UPDATE tasks SET status = 'under_review' WHERE id = ?").run(submission.task_id);
    }

    // Update learner's reputation
    updateReputation(submission.learner_id);

    return NextResponse.json({ message: 'Review submitted successfully! The learner has been notified.' });
  } catch (error) {
    console.error('Review Submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
