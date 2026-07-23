'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '../../../components/Toast';

export default function TaskDetail({ params }) {
  const { id } = React.use(params);
  const toast = useToast();
  const [task, setTask] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitMode, setSubmitMode] = useState(false);
  const [submission, setSubmission] = useState({ link: '', notes: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'init' });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/tasks/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTask(data.task);
          setSubmissionData(data.submission);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
    fetchTask();
  }, [id]);

  const handleClaim = async () => {
    if (!currentUser) {
      toast('Please log in to claim a task', 'error');
      return;
    }
    
    try {
      const res = await fetch(`/api/tasks/${id}/claim`, {
        method: 'POST',
        credentials: 'init'
      });
      
      if (res.ok) {
        setTask({ ...task, status: 'claimed', claimed_by: currentUser.id });
        toast('Task claimed! It is now in your queue.', 'success');
      } else {
        const data = await res.json();
        toast(data.message || 'Failed to claim task', 'error');
      }
    } catch (err) {
      toast('Network error occurred', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch(`/api/tasks/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artifact_url: submission.link, notes: submission.notes }),
        credentials: 'init'
      });
      
      if (res.ok) {
        const data = await res.json();
        setTask({ ...task, status: 'under_review' });
        setSubmissionData({ id: data.submissionId, artifact_url: submission.link, notes: submission.notes });
        setSubmitMode(false);
        toast('Work submitted for review!', 'success');
      } else {
        const data = await res.json();
        toast(data.message || 'Failed to submit', 'error');
      }
    } catch (err) {
      toast('Network error occurred', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 1rem' }}><div className="skeleton" style={{ height: '400px' }}></div></div>;
  if (!task) return <div className="container" style={{ padding: '4rem 1rem' }}>Task not found</div>;

  const skills = task.skill_tags ? task.skill_tags.split(',').map(s => s.trim()) : [];
  const isClaimedByMe = currentUser && task.claimed_by === currentUser.id;

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between" style={{ marginBottom: '2rem' }}>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>Due {new Date(task.due_date).toLocaleDateString()}</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{task.title}</h1>
        </div>
        
        {/* Actions based on state */}
        <div className="flex gap-2">
          {task.status === 'open' && (
            <button onClick={handleClaim} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              Claim Task
            </button>
          )}
          {task.status === 'claimed' && isClaimedByMe && !submitMode && (
            <button onClick={() => setSubmitMode(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              Submit Work
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {submitMode ? (
            <div className="card" style={{ border: '1px solid var(--color-primary)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Submit Deliverable</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="label">Link to Work ({task.deliverable_type})</label>
                  <input type="url" className="input" required placeholder="https://github.com/..." value={submission.link} onChange={e => setSubmission({...submission, link: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">Additional Notes</label>
                  <textarea className="textarea" placeholder="Explain your approach..." value={submission.notes} onChange={e => setSubmission({...submission, notes: e.target.value})} />
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button type="button" className="btn btn-ghost" onClick={() => setSubmitMode(false)} disabled={submitting}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit for Review'}</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Task Description</h2>
              <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-main)', opacity: 0.9 }}>
                {task.description}
              </div>
            </div>
          )}

          {task.status === 'under_review' && (
            <div className="card" style={{ background: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
              <h3 style={{ color: '#c084fc', fontWeight: 600, marginBottom: '0.5rem' }}>Under Peer Review</h3>
              <p className="text-muted">Your submission is currently being reviewed by the poster and peers. You will be notified once it is verified.</p>
              {submissionData && (
                <div style={{ marginTop: '1rem' }}>
                  <a href={submissionData.artifact_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Submission Link</a>
                </div>
              )}
            </div>
          )}
          
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Task Poster</h3>
            <div className="flex items-center gap-3">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {task.poster_name?.charAt(0) || 'U'}
              </div>
              <span className="font-medium">{task.poster_name}</span>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Required Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
