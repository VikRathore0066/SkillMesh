'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../components/Toast';

export default function PortfolioRedirect() {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          router.replace(`/portfolio/${data.user.id}`);
        } else {
          toast('Please log in to view your portfolio', 'warning');
          router.replace('/auth/login');
        }
      } catch (err) {
        toast('Network error. Redirecting to login.', 'error');
        router.replace('/auth/login');
      }
    };
    
    fetchUser();
  }, [router, toast]);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
    </div>
  );
}
