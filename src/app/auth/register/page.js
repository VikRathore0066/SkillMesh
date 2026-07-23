'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'learner' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Auto-login
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
          credentials: 'include'
        });
        
        if (loginRes.ok) {
          const loginData = await loginRes.json();
          localStorage.setItem('skillmesh_user', JSON.stringify(loginData.user));
          window.dispatchEvent(new Event('auth-change'));
          router.push('/tasks');
        } else {
          router.push('/auth/login');
        }
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - 4rem)', padding: '2rem 1rem' }}>
      <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem 2rem' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Account</h1>
          <p className="text-muted">Start verifying your skills today</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--color-error)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="label">I want to...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              <label 
                style={{ 
                  border: '1px solid', 
                  borderColor: formData.role === 'learner' ? 'var(--color-primary)' : 'var(--glass-border)',
                  background: formData.role === 'learner' ? 'rgba(99, 102, 241, 0.1)' : 'var(--color-surface-1)',
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <input type="radio" name="role" value="learner" checked={formData.role === 'learner'} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ display: 'none' }} />
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>👩‍💻</div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>Complete Tasks</div>
              </label>
              
              <label 
                style={{ 
                  border: '1px solid', 
                  borderColor: formData.role === 'poster' ? 'var(--color-primary)' : 'var(--glass-border)',
                  background: formData.role === 'poster' ? 'rgba(99, 102, 241, 0.1)' : 'var(--color-surface-1)',
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)', 
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <input type="radio" name="role" value="poster" checked={formData.role === 'poster'} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ display: 'none' }} />
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🏢</div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>Post Tasks</div>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="name">Full Name</label>
            <input id="name" type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="email">Email Address</label>
            <input id="email" type="email" className="input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          
          <div className="form-group">
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength={8} />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '1rem', padding: '0.75rem' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Already have an account? <Link href="/auth/login" className="text-primary font-medium hover:underline">Log in</Link>
        </div>
      </div>
    </main>
  );
}
