import db from './db';

const POSTER_WEIGHT = 0.6;
const PEER_WEIGHT = 0.4;

export function calculateReputation(userId) {
  const reviews = db.prepare(`
    SELECT r.rating, r.reviewer_type 
    FROM reviews r
    JOIN submissions s ON r.submission_id = s.id
    WHERE s.learner_id = ?
  `).all(userId);

  if (reviews.length === 0) return { score: 0, count: 0 };

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const review of reviews) {
    const weight = review.reviewer_type === 'poster' ? POSTER_WEIGHT : PEER_WEIGHT;
    totalWeightedScore += review.rating * weight;
    totalWeight += weight;
  }

  const score = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;
  return { score: parseFloat(score.toFixed(2)), count: reviews.length };
}

export function updateReputation(userId) {
  const { score, count } = calculateReputation(userId);
  
  db.prepare(`
    UPDATE users 
    SET reputation_score = ?, total_reviews = ? 
    WHERE id = ?
  `).run(score, count, userId);
  
  return { score, count };
}
