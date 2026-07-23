'use client';
import Link from 'next/link';

export default function TaskCard({ task }) {
  if (!task) return null;
  
  const statusLabels = {
    open: 'Open',
    claimed: 'Claimed',
    submitted: 'Submitted',
    under_review: 'Under Review',
    verified: 'Verified'
  };

  const deliverableIcons = {
    link: '🔗',
    file: '📄',
    repository: '💻'
  };

  const getDueDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  const skills = task.skill_tags ? task.skill_tags.split(',').map(s => s.trim()) : [];

  return (
    <Link href={`/tasks/${task.id}`} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
        <span className={`badge badge-${task.status}`}>
          {statusLabels[task.status] || task.status}
        </span>
        <div className="text-muted" style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span>{deliverableIcons[task.deliverable_type] || '📝'}</span>
          <span style={{ textTransform: 'capitalize' }}>{task.deliverable_type}</span>
        </div>
      </div>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
        {task.title}
      </h3>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', flex: 1 }}>
        {skills.map((skill) => (
          <span key={skill} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
      
      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div className="flex items-center gap-2">
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
            {task.poster_name?.charAt(0) || 'U'}
          </div>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{task.poster_name}</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Due {getDueDate(task.due_date)}
        </span>
      </div>
    </Link>
  );
}
