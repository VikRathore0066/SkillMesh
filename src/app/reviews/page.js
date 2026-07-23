'use client';
import { useState, useEffect } from 'react';
import StarRating from '../../components/StarRating';
import { useToast } from '../../components/Toast';
import EmptyState from '../../components/EmptyState';
import { useRouter } from 'next/navigation';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews/pending', { credentials: 'include' });
        if (res.status === 401) {
          router.push('/auth/login');
          return;
        }
        if (res.ok) {
          const data = await res.json();
          // API returns pendingReviews array
          setReviews(data.pendingReviews || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [router]);

  const handleReviewSubmitted = (id) => {
    setReviews(prev => prev.filter(r => r.submission_id !== id));
  };

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Pending Reviews</h1>
        <p className="text-muted">Verify peer submissions to maintain quality and earn reputation.</p>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: '300px' }}></div>
      ) : reviews.length === 0 ? (
        <EmptyState icon="🎉" title="All caught up!" description="You have no pending tasks to review right now." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reviews.map(review => (
            <ReviewCard key={review.submission_id} review={review} onSubmitted={() => handleReviewSubmitted(review.submission_id)} />
          ))}
        </div>
      )}
    </main>
  );
}

function ReviewCard({ review, onSubmitted }) {
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  
  const submitReview = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/submissions/${review.submission_id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating, comment })
      });
      
      if (res.ok) {
        toast('Review submitted successfully. Learner notified.', 'success');
        onSubmitted();
      } else {
        const data = await res.json();
        toast(data.error || 'Failed to submit review', 'error');
      }
    } catch (err) {
      toast('Network error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`badge badge-under_review`} style={{ backgroundColor: 'rgba(168,85,247,0.1)' }}>
              Pending Review
            </span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Submitted by {review.learner_name}</span>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{review.task_title}</h3>
        </div>
        <button className="btn btn-ghost">
          {expanded ? 'Collapse ↑' : 'Review ↓'}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', animation: 'slideUp 0.3s ease-out' }}>
          
          <div style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <h4 className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Deliverable</h4>
            <a href={review.artifact_url || '#'} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium break-all">
              {review.artifact_url || 'No link provided'}
            </a>
            {review.notes && (
              <>
                <h4 className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginTop: '1rem', marginBottom: '0.5rem' }}>Learner Notes</h4>
                <p style={{ fontSize: '0.875rem' }}>"{review.notes}"</p>
              </>
            )}
          </div>

          <div className="form-group">
            <label className="label">Rate Quality & Accuracy</label>
            <StarRating value={rating} onChange={setRating} size={32} />
          </div>

          <div className="form-group">
            <label className="label">Constructive Feedback (Public)</label>
            <textarea 
              className="textarea" 
              placeholder="Explain your rating. What did they do well? What could be improved?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-4" style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={submitReview} disabled={!rating || !comment || submitting}>
              {submitting ? 'Submitting...' : 'Verify & Approve'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
