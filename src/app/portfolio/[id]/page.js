'use client';
import React, { useState, useEffect } from 'react';
import StarRating from '../../../components/StarRating';
import EmptyState from '../../../components/EmptyState';

export default function PortfolioPage({ params }) {
  const { id } = params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`/api/users/${id}/portfolio`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          setError('Failed to load portfolio');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolio();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: '4rem 1rem' }}><div className="skeleton" style={{ height: '400px' }}></div></div>;
  }
  
  if (error || !data || !data.user) {
    return <div className="container" style={{ padding: '4rem 1rem' }}>{error || 'User not found'}</div>;
  }

  const { user, portfolio, skills } = data;
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const formatFullDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <main className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      {/* Header Profile Section */}
      <div className="card" style={{ marginBottom: '2rem', padding: '3rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '60%', height: '200%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', md: { flexDirection: 'row' }, gap: '2rem', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div className="flex gap-6 items-center">
            <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, color: 'white', boxShadow: 'var(--shadow-glow)' }}>
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{user.name}</h1>
              <p className="text-primary font-medium" style={{ fontSize: '1.125rem', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{user.role}</p>
              <p className="text-muted" style={{ maxWidth: '500px', fontSize: '0.9375rem' }}>{user.bio || 'Building skills and verifying code.'}</p>
            </div>
          </div>

          {/* Reputation Badge */}
          <div style={{ background: 'var(--color-surface-2)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', textAlign: 'center', minWidth: '180px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-warning)', lineHeight: 1 }}>
              {user.reputation_score ? user.reputation_score.toFixed(1) : '0.0'}
            </div>
            <div className="flex justify-center" style={{ margin: '0.5rem 0' }}>
              <StarRating value={Math.round(user.reputation_score || 0)} readonly size={16} />
            </div>
            <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {user.total_reviews || 0} Peer Reviews
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Sidebar: Skills & Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem' }}>Verified Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(skills || []).map(skill => (
                <div key={skill.skill} className="skill-tag" style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: 'var(--color-text-main)', padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}>
                  {skill.skill} <span style={{ color: 'var(--color-primary-light)', marginLeft: '0.25rem', fontWeight: 600 }}>{skill.count}</span>
                </div>
              ))}
              {(!skills || skills.length === 0) && <p className="text-muted" style={{ fontSize: '0.875rem' }}>No skills verified yet.</p>}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Stats</h3>
            <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
              <span className="text-muted">Verified Tasks</span>
              <span className="font-bold">{(portfolio || []).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Member Since</span>
              <span className="font-medium">{formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Right Content: Verified Work */}
        <div style={{ gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-success)' }}>✓</span> Verified Work Log
          </h2>
          
          {(!portfolio || portfolio.length === 0) ? (
             <EmptyState icon="🚀" title="No verified work yet" description="Complete and submit tasks to build your verified portfolio." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {portfolio.map(item => {
                const itemSkills = item.skill_tags ? item.skill_tags.split(',').map(s => s.trim()) : [];
                return (
                  <div key={item.submission_id} className="card card-hover" style={{ padding: '1.5rem' }}>
                    <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.task_title}</h3>
                        <div className="flex gap-2 mb-2">
                          {itemSkills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>{formatFullDate(item.submitted_at)}</div>
                      </div>
                    </div>
                    
                    <div style={{ padding: '0.75rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="text-muted" style={{ fontSize: '0.875rem' }}>Deliverable Artifact</span>
                      <a href={item.artifact_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                        View Link ↗
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
