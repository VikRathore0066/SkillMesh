'use client';
import Link from 'next/link';

export default function EmptyState({ icon = '📋', title, description, actionLabel, actionHref }) {
  return (
    <div className="card text-center flex flex-col items-center justify-center animate-fade-in" style={{ padding: '4rem 2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.8 }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</h3>
      <p className="text-muted" style={{ maxWidth: '400px', marginBottom: '2rem' }}>
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
