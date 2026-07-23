'use client';
import { useState, useEffect } from 'react';
import TaskCard from '../../components/TaskCard';
import EmptyState from '../../components/EmptyState';

export default function TasksFeed() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        let url = '/api/tasks?';
        if (filterStatus !== 'all') {
          url += `status=${filterStatus}&`;
        }
        if (search) {
          url += `search=${encodeURIComponent(search)}`;
        }
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setTasks(data.tasks || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce the API call slightly to avoid too many requests on typing
    const timeoutId = setTimeout(() => {
      fetchTasks();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [search, filterStatus]);

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Browse Tasks</h1>
          <p className="text-muted">Find real projects, build your skills, and get verified.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 300px' }}>
          <input 
            type="text" 
            placeholder="Search tasks or skills..." 
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select 
            className="select" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="claimed">Claimed</option>
            <option value="under_review">Under Review</option>
            <option value="verified">Verified</option>
          </select>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card skeleton" style={{ height: '200px' }}></div>
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon="🔍"
          title="No tasks found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      )}
    </main>
  );
}
