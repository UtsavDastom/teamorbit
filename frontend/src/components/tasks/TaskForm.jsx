import { useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';

export default function TaskForm({ initial, projectId, members = [], onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    status: initial?.status || 'pending',
    priority: initial?.priority || 'medium',
    dueDate: initial?.dueDate ? initial.dueDate.slice(0, 10) : '',
    assignedTo: initial?.assignedTo?._id || initial?.assignedTo || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, projectId, assignedTo: form.assignedTo || null };
      if (!form.dueDate) delete payload.dueDate;

      let result;
      if (initial) {
        const { data } = await api.put(`/api/tasks/${initial._id}`, payload);
        result = data;
      } else {
        const { data } = await api.post('/api/tasks', payload);
        result = data;
      }
      onSave(result);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save task';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-orbit-text mb-2">Task Title *</label>
        <input name="title" value={form.title} onChange={handleChange} required
          placeholder="e.g. Design new login page" className="orbit-input" />
      </div>
      <div>
        <label className="block text-sm font-medium text-orbit-text mb-2">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange}
          rows={2} placeholder="Details..." className="orbit-input resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-orbit-text mb-2">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="orbit-input">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-orbit-text mb-2">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="orbit-input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-orbit-text mb-2">Due Date</label>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="orbit-input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-orbit-text mb-2">Assign To</label>
          <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className="orbit-input">
            <option value="">Unassigned</option>
            {members.map(m => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="orbit-btn-primary flex-1">
          {loading ? <LoadingSpinner size="sm" /> : initial ? 'Save Changes' : 'Create Task'}
        </button>
        <button type="button" onClick={onCancel} className="orbit-btn-ghost flex-1">Cancel</button>
      </div>
    </form>
  );
}
