import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ProjectForm from '../components/api/projects/ProjectForm';

export default function ProjectsPage() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/api/projects');
      setProjects(data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSave = (saved) => {
    if (editProject) {
      setProjects(prev => prev.map(p => p._id === saved._id ? saved : p));
      toast.success('Project updated');
    } else {
      setProjects(prev => [saved, ...prev]);
      toast.success('Project created!');
    }
    setShowModal(false);
    setEditProject(null);
  };

  const handleEdit = (p) => {
    setEditProject(p);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    setDeleting(id);
    try {
      await api.delete(`/api/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const PROJECT_COLORS = ['#7c6af7','#4da6ff','#22d3a0','#f5c842','#f25a5a','#f97316'];

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-orbit-text">Projects</h1>
          <p className="text-orbit-sub text-sm mt-0.5 font-mono">{projects.length} mission{projects.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <button onClick={() => { setEditProject(null); setShowModal(true); }} className="orbit-btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>}
          title="No projects yet"
          description={isAdmin ? "Create your first project to get started." : "You haven't been assigned to any projects yet."}
          action={isAdmin && (
            <button onClick={() => setShowModal(true)} className="orbit-btn-primary">
              Create Project
            </button>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="orbit-card p-5 flex flex-col gap-4 hover:border-orbit-muted transition-all duration-200 group">
              {/* Color bar */}
              <div className="h-1 rounded-full" style={{ background: project.color || '#7c6af7' }} />

              <div className="flex items-start justify-between gap-2">
                <Link to={`/api/projects/${project._id}`} className="font-bold text-orbit-text hover:text-orbit-accent transition-colors line-clamp-2">
                  {project.title}
                </Link>
                <StatusBadge status={project.status} />
              </div>

              {project.description && (
                <p className="text-orbit-sub text-sm line-clamp-2">{project.description}</p>
              )}

              <div className="flex items-center gap-2 mt-auto">
                <div className="flex -space-x-2 flex-1">
                  {project.members?.slice(0, 4).map((m) => (
                    <div
                      key={m._id}
                      className="w-7 h-7 rounded-full bg-orbit-muted border-2 border-orbit-card flex items-center justify-center text-xs font-bold text-orbit-sub"
                      title={m.name}
                    >
                      {m.name[0].toUpperCase()}
                    </div>
                  ))}
                  {project.members?.length > 4 && (
                    <div className="w-7 h-7 rounded-full bg-orbit-muted border-2 border-orbit-card flex items-center justify-center text-xs text-orbit-sub">
                      +{project.members.length - 4}
                    </div>
                  )}
                </div>
                {project.dueDate && (
                  <span className="text-xs font-mono text-orbit-sub">
                    {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {isAdmin && (
                <div className="flex gap-2 pt-2 border-t border-orbit-border">
                  <button onClick={() => handleEdit(project)} className="orbit-btn-ghost text-xs flex-1">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    disabled={deleting === project._id}
                    className="orbit-btn-ghost text-xs flex-1 hover:text-orbit-red"
                  >
                    {deleting === project._id ? <LoadingSpinner size="sm" /> : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditProject(null); }}
        title={editProject ? 'Edit Project' : 'New Project'}
        size="md"
      >
        <ProjectForm
          initial={editProject}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditProject(null); }}
        />
      </Modal>
    </div>
  );
}
