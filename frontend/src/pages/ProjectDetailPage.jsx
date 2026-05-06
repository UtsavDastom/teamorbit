import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import StatusBadge, { PriorityBadge } from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TaskForm from '../components/api/tasks/TaskForm';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/api/projects/${id}`),
        api.get(`/api/tasks?projectId=${id}`),
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
    } catch {
      toast.error('Failed to load project');
      navigate('/api/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleTaskSave = (saved) => {
    if (editTask) {
      setTasks(prev => prev.map(t => t._id === saved._id ? saved : t));
      toast.success('Task updated');
    } else {
      setTasks(prev => [saved, ...prev]);
      toast.success('Task created!');
    }
    setShowTaskModal(false);
    setEditTask(null);
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const { data } = await api.put(`/api/tasks/${taskId}`, { status });
      setTasks(prev => prev.map(t => t._id === taskId ? data : t));
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!project) return null;

  const byStatus = {
    pending: tasks.filter(t => t.status === 'pending'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  const statusLabels = { pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed' };
  const statusDotColors = { pending: 'bg-orbit-yellow', 'in-progress': 'bg-orbit-blue', completed: 'bg-orbit-green' };

  return (
    <div className="space-y-6 fade-up">
      {/* Back */}
      <Link to="/api/projects" className="inline-flex items-center gap-2 text-orbit-sub hover:text-orbit-text text-sm transition-colors">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        All Projects
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ background: project.color }} />
            <h1 className="text-2xl font-bold text-orbit-text">{project.title}</h1>
            <StatusBadge status={project.status} />
          </div>
          {project.description && (
            <p className="text-orbit-sub text-sm">{project.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex -space-x-1">
              {project.members?.slice(0, 5).map(m => (
                <div key={m._id} className="w-6 h-6 rounded-full bg-orbit-muted border border-orbit-card flex items-center justify-center text-xs font-bold" title={m.name}>
                  {m.name[0].toUpperCase()}
                </div>
              ))}
            </div>
            <span className="text-xs text-orbit-sub font-mono">{project.members?.length} member{project.members?.length !== 1 ? 's' : ''}</span>
            {project.dueDate && (
              <span className="text-xs text-orbit-sub font-mono">Due {new Date(project.dueDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        {isAdmin && (
          <button onClick={() => { setEditTask(null); setShowTaskModal(true); }} className="orbit-btn-primary flex-shrink-0">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Task
          </button>
        )}
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(byStatus).map(([status, statusTasks]) => (
          <div key={status} className="orbit-card p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${statusDotColors[status]}`} />
              <span className="text-sm font-semibold text-orbit-text">{statusLabels[status]}</span>
              <span className="text-xs font-mono text-orbit-sub ml-auto bg-orbit-muted px-2 py-0.5 rounded-full">
                {statusTasks.length}
              </span>
            </div>

            {statusTasks.length === 0 && (
              <div className="text-center py-8 text-orbit-sub text-sm border border-dashed border-orbit-border rounded-lg">
                No tasks
              </div>
            )}

            {statusTasks.map(task => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
              return (
                <div key={task._id} className="bg-orbit-surface border border-orbit-border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-orbit-text line-clamp-2">{task.title}</span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  {task.description && (
                    <p className="text-xs text-orbit-sub line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-orbit-muted flex items-center justify-center text-xs font-bold">
                          {task.assignedTo.name[0].toUpperCase()}
                        </div>
                        <span className="text-xs text-orbit-sub">{task.assignedTo.name.split(' ')[0]}</span>
                      </div>
                    ) : <span />}
                    {task.dueDate && (
                      <span className={`text-xs font-mono ${isOverdue ? 'text-orbit-red' : 'text-orbit-sub'}`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {/* Status changer */}
                  <select
                    value={task.status}
                    onChange={e => handleStatusChange(task._id, e.target.value)}
                    className="w-full text-xs bg-orbit-muted border border-orbit-border text-orbit-sub rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button onClick={() => { setEditTask(task); setShowTaskModal(true); }}
                        className="text-xs text-orbit-sub hover:text-orbit-accent flex-1 py-1 rounded hover:bg-orbit-muted transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteTask(task._id)}
                        className="text-xs text-orbit-sub hover:text-orbit-red flex-1 py-1 rounded hover:bg-orbit-muted transition-colors">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <Modal
        isOpen={showTaskModal}
        onClose={() => { setShowTaskModal(false); setEditTask(null); }}
        title={editTask ? 'Edit Task' : 'New Task'}
      >
        <TaskForm
          initial={editTask}
          projectId={id}
          members={project.members}
          onSave={handleTaskSave}
          onCancel={() => { setShowTaskModal(false); setEditTask(null); }}
        />
      </Modal>
    </div>
  );
}
