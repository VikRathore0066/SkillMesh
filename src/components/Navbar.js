'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('skillmesh_user', JSON.stringify(data.user));
      } else {
        setUser(null);
        localStorage.removeItem('skillmesh_user');
      }
    } catch (e) {
      console.error(e);
      // Fallback to cache if offline
      const stored = localStorage.getItem('skillmesh_user');
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch {}
      }
    }
  };

  useEffect(() => {
    checkAuth();
    
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('skillmesh_user');
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Browse Tasks', href: '/tasks' },
    { name: 'Post Task', href: '/tasks/new' },
    { name: 'Reviews', href: '/reviews' },
  ];

  return (
    <header className="navbar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
        
        {/* Brand */}
        <Link href="/" className="font-bold gradient-text" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', borderRadius: '4px' }}></div>
          SkillMesh
        </Link>

        {/* Desktop Nav */}
        <nav className="flex items-center gap-6" style={{ display: 'none' }} id="desktop-nav">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: pathname === link.href ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.color = 'var(--color-text-main)'}
              onMouseOut={(e) => e.target.style.color = pathname === link.href ? 'var(--color-primary-light)' : 'var(--color-text-muted)'}
            >
              {link.name}
            </Link>
          ))}
          
          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--glass-border)', margin: '0 0.5rem' }}></div>

          {user ? (
            <div className="flex items-center gap-4">
              <Link href={`/portfolio/${user.id}`} className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
                  {user.name?.charAt(0) || 'U'}
                </div>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem' }}>Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="btn btn-ghost">Log In</Link>
              <Link href="/auth/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </nav>
        
        {/* Mobile Toggle */}
        <button 
          className="btn btn-ghost" 
          id="mobile-toggle"
          style={{ display: 'block' }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 768px) {
            #desktop-nav { display: flex !important; }
            #mobile-toggle { display: none !important; }
          }
        `}} />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{ padding: '1rem', background: 'var(--color-surface-1)', borderTop: '1px solid var(--glass-border)' }}>
          <div className="flex flex-col gap-4">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} style={{ color: pathname === link.href ? 'var(--color-primary-light)' : 'inherit' }}>
                {link.name}
              </Link>
            ))}
            <div style={{ height: '1px', backgroundColor: 'var(--glass-border)' }}></div>
            {user ? (
              <>
                <Link href={`/portfolio/${user.id}`} onClick={() => setIsMobileMenuOpen(false)}>My Portfolio</Link>
                <button onClick={handleLogout} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: 0, fontSize: '1rem' }}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
