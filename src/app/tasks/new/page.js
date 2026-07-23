'use client';
import { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast';
import { useRouter } from 'next/navigation';

export default function NewTask() {
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) {
          toast('Please log in to post a task', 'error');
          router.push('/auth/login');
        }
      } catch (e) {
        // Continue
      }
    };
    checkUser();
  }, [router, toast]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deliverableType: 'repository',
    dueDate: '',
    skills: []
  });

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.skills.length === 0) {
      toast('Please add at least one skill', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          skill_tags: formData.skills.join(','),
          deliverable_type: formData.deliverableType,
          due_date: formData.dueDate
        })
      });
      
      if (res.ok) {
        toast('Task posted successfully!', 'success');
        router.push('/tasks');
      } else {
        const data = await res.json();
        toast(data.error || 'Failed to post task', 'error');
      }
    } catch (err) {
      toast('Network error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Post a New Task</h1>
        <p className="text-muted">Create a real-world challenge to find and verify top talent.</p>
      </div>

      <div className="card animate-slide-up">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="label">Task Title</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Build a Responsive Navigation Component" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="label">Description & Requirements</label>
            <textarea 
              className="textarea" 
              placeholder="Describe the problem, requirements, constraints, and how it will be evaluated..." 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              required
              style={{ minHeight: '200px' }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="label">Expected Deliverable</label>
              <select 
                className="select" 
                value={formData.deliverableType} 
                onChange={e => setFormData({...formData, deliverableType: e.target.value})}
              >
                <option value="repository">GitHub/GitLab Repository</option>
                <option value="link">Live URL / Hosted Link</option>
                <option value="file">File Upload (PDF, ZIP)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label">Due Date</label>
              <input 
                type="date" 
                className="input" 
                value={formData.dueDate} 
                onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Required Skills to Verify</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. React, Python, UI Design" 
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSkill(e)}
              />
              <button type="button" onClick={handleAddSkill} className="btn btn-secondary">Add</button>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.skills.length === 0 ? (
                <span className="text-muted" style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>No skills added yet</span>
              ) : (
                formData.skills.map(skill => (
                  <span key={skill} className="skill-tag" style={{ padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '2rem', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={() => router.back()} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Task'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
