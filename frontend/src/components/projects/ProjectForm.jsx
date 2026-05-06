import { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';

const COLORS = ['#7c6af7','#4da6ff','#22d3a0','#f5c842','#f25a5a','#f97316','#a855f7','#ec4899'];

export default function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    status: initial?.status || 'active',
    dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : '',
    color: initial?.color || '#7c6af7',
    members: initial?.members?.map(m => m._id || m) || [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleMember = (id) => {
    setForm(prev => ({
      ...prev,
      members: prev.members.includes(id)
        ? prev.members.filter(m => m !== id)
        : [...prev.members, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result;
      if (initial) {
        const { data } = await api.put(`/projects/${initial._id}`, form);
        result = data;
      } else {
        const { data } = await api.post('/projects', form);
        result = data;
      }
      onSave(result);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-orbit-text mb-2">Project Title *</label>
        <input name="title" value={form.title} onChange={handleChange} required
          placeholder="e.g. Product Redesign" className="orbit-input" />
      </div>
      <div>
        <label className="block text-sm font-medium text-orbit-text mb-2">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange}
          placeholder="Brief description..." rows={3} className="orbit-input resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-orbit-text mb-2">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="orbit-input">
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-orbit-text mb-2">Due Date</label>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="orbit-input" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-orbit-text mb-2">Color</label>
        <div className="flex gap-2">
          {COLORS.map(c => (
            <button type="button" key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
              className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-orbit-card scale-110' : ''}`}
              style={{ background: c }} />
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-orbit-text mb-2">Assign Members</label>
        <div className="max-h-36 overflow-y-auto space-y-1 border border-orbit-border rounded-lg p-2">
          {users.map(u => (
            <label key={u._id} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-orbit-muted cursor-pointer">
              <input type="checkbox" checked={form.members.includes(u._id)}
                onChange={() => toggleMember(u._id)} className="accent-orbit-accent" />
              <div className="w-6 h-6 rounded-full bg-orbit-muted flex items-center justify-center text-xs font-bold">
                {u.name[0].toUpperCase()}
              </div>
              <span className="text-sm text-orbit-text">{u.name}</span>
              <span className="text-xs text-orbit-sub font-mono ml-auto">{u.role}</span>
            </label>
          ))}
          {users.length === 0 && <p className="text-orbit-sub text-sm text-center py-2">No users found</p>}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="orbit-btn-primary flex-1">
          {loading ? <LoadingSpinner size="sm" /> : initial ? 'Save Changes' : 'Create Project'}
        </button>
        <button type="button" onClick={onCancel} className="orbit-btn-ghost flex-1">Cancel</button>
      </div>
    </form>
  );
}
