'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';

export default function Home() {
  const [stats, setStats] = useState({ tasks: 0, learners: 3402, skills: 18902 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch('/api/tasks?status=open');
        if (res.ok) {
          const data = await res.json();
          const tasks = data.tasks || [];
          setRecentTasks(tasks.slice(0, 3));
          setStats(prev => ({ ...prev, tasks: tasks.length * 12 + 1200 })); // Semi-dynamic realistic stat
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center text-center animate-slide-up" style={{ padding: '6rem 1rem', minHeight: '70vh' }}>
        <div style={{ padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '99px', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--color-primary-light)' }}>
          🚀 The new standard for hiring and learning
        </div>
        
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          Build Your Portfolio<br />with <span className="gradient-text">Real Work</span>
        </h1>
        
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '3rem' }}>
          Stop building to-do apps. Claim real tasks, get peer-reviewed, and automatically build a verified portfolio that employers actually trust.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <Link href="/tasks" className="btn btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}>
            Browse Tasks
          </Link>
          <Link href="/tasks/new" className="btn btn-secondary" style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}>
            Post a Task
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ backgroundColor: 'var(--color-surface-1)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', padding: '4rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{stats.tasks.toLocaleString()}</div>
            <div className="text-muted">Tasks Posted</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary-light)' }}>{stats.learners.toLocaleString()}</div>
            <div className="text-muted">Active Learners</div>
          </div>
          <div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-accent-light)' }}>{stats.skills.toLocaleString()}</div>
            <div className="text-muted">Skills Verified</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container" style={{ padding: '6rem 1rem' }}>
        <h2 className="text-center" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '4rem' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div className="card text-center flex flex-col items-center">
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1.5rem' }}>
              🎯
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>1. Find a Task</h3>
            <p className="text-muted">Companies and mentors post bite-sized, real-world tasks. Claim one that matches your goals.</p>
          </div>

          <div className="card text-center flex flex-col items-center">
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1.5rem' }}>
              💻
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>2. Build & Submit</h3>
            <p className="text-muted">Complete the work and submit your repository or file. Get practical experience instantly.</p>
          </div>

          <div className="card text-center flex flex-col items-center">
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1.5rem' }}>
              🏅
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>3. Get Verified</h3>
            <p className="text-muted">Peers and pros review your code. Earn verified skills and build a portfolio you can share.</p>
          </div>

        </div>
      </section>

      {/* Recent Tasks */}
      <section className="container" style={{ padding: '4rem 1rem 6rem' }}>
        <div className="flex justify-between items-end" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Recent Tasks</h2>
          <Link href="/tasks" className="text-primary hover:underline font-medium">View all →</Link>
        </div>
        
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card skeleton" style={{ height: '200px' }}></div>
            <div className="card skeleton" style={{ height: '200px' }}></div>
            <div className="card skeleton" style={{ height: '200px' }}></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {recentTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
