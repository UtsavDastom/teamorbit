import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.get('/users')
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      const { data } = await api.put(`/users/${userId}`, { role });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: data.role } : u));
      toast.success('Role updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user?')) return;
    setDeleting(userId);
    try {
      await api.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User removed');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="text-2xl font-bold text-orbit-text">Team Members</h1>
        <p className="text-orbit-sub text-sm mt-0.5 font-mono">{users.length} crew member{users.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="orbit-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-orbit-border">
              <th className="text-left text-xs font-mono text-orbit-sub px-5 py-3">Member</th>
              <th className="text-left text-xs font-mono text-orbit-sub px-5 py-3 hidden sm:table-cell">Email</th>
              <th className="text-left text-xs font-mono text-orbit-sub px-5 py-3">Role</th>
              <th className="text-left text-xs font-mono text-orbit-sub px-5 py-3 hidden md:table-cell">Joined</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id} className={`border-b border-orbit-border/50 hover:bg-orbit-surface/50 transition-colors ${i === users.length - 1 ? 'border-0' : ''}`}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-orbit flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {u.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-orbit-text">{u.name}</span>
                    {u._id === currentUser._id && (
                      <span className="text-xs font-mono text-orbit-accent">(you)</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 hidden sm:table-cell">
                  <span className="text-sm text-orbit-sub font-mono">{u.email}</span>
                </td>
                <td className="px-5 py-3">
                  {u._id === currentUser._id ? (
                    <span className={`orbit-badge ${u.role === 'admin' ? 'bg-orbit-accent/10 text-orbit-accent border border-orbit-accent/20' : 'bg-orbit-muted text-orbit-sub border border-orbit-border'}`}>
                      {u.role}
                    </span>
                  ) : (
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u._id, e.target.value)}
                      className="text-xs bg-orbit-surface border border-orbit-border text-orbit-sub rounded-lg px-2 py-1"
                    >
                      <option value="member">member</option>
                      <option value="admin">admin</option>
                    </select>
                  )}
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <span className="text-xs text-orbit-sub font-mono">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {u._id !== currentUser._id && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={deleting === u._id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-orbit-red/10 text-orbit-sub hover:text-orbit-red transition-colors"
                    >
                      {deleting === u._id ? <LoadingSpinner size="sm" /> : (
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
