'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('skillmesh_user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));
        router.push('/tasks');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="card animate-scale-up" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p className="text-muted">Log in to continue building your portfolio</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--color-error)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="label" htmlFor="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              className="input" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <div className="flex justify-between">
              <label className="label" htmlFor="password">Password</label>
              <Link href="#" className="text-primary hover:underline" style={{ fontSize: '0.875rem' }}>Forgot?</Link>
            </div>
            <input 
              id="password" 
              type="password" 
              className="input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '1rem', padding: '0.75rem' }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Don't have an account? <Link href="/auth/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </div>
      </div>
    </main>
  );
}
