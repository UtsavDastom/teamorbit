import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import StatusBadge, { PriorityBadge } from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function TasksPage() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/tasks')
      .then(r => setTasks(r.data))
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status });
      setTasks(prev => prev.map(t => t._id === taskId ? data : t));
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ];

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="text-2xl font-bold text-orbit-text">Tasks</h1>
        <p className="text-orbit-sub text-sm mt-0.5 font-mono">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-orbit-surface border border-orbit-border rounded-lg p-1 w-fit">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150
              ${filter === f.key ? 'bg-orbit-accent text-white' : 'text-orbit-sub hover:text-orbit-text'}`}
          >
            {f.label}
            <span className={`ml-2 text-xs font-mono ${filter === f.key ? 'text-white/70' : 'text-orbit-sub'}`}>
              {f.key === 'all' ? tasks.length : tasks.filter(t => t.status === f.key).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
          title="No tasks found"
          description="Try a different filter or ask your admin to create tasks."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(task => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
            return (
              <div key={task._id} className="orbit-card p-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 hover:border-orbit-muted transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-orbit-text">{task.title}</span>
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                    {isOverdue && (
                      <span className="orbit-badge bg-orbit-red/10 text-orbit-red border border-orbit-red/20">Overdue</span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-orbit-sub">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs font-mono text-orbit-sub flex-wrap">
                    {task.projectId && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: task.projectId.color || '#7c6af7' }} />
                        {task.projectId.title}
                      </span>
                    )}
                    {task.assignedTo && <span>→ {task.assignedTo.name}</span>}
                    {task.dueDate && (
                      <span className={isOverdue ? 'text-orbit-red' : ''}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={e => handleStatusChange(task._id, e.target.value)}
                    className="text-xs bg-orbit-surface border border-orbit-border text-orbit-sub rounded-lg px-3 py-1.5"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {isAdmin && (
                    <button onClick={() => handleDelete(task._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orbit-red/10 text-orbit-sub hover:text-orbit-red transition-colors">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
