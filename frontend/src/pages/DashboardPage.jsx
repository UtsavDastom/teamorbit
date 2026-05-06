import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

function StatCard({ label, value, color, icon, sublabel }) {
  const colors = {
    accent: 'border-orbit-accent/30 bg-orbit-accent/5',
    green:  'border-orbit-green/30 bg-orbit-green/5',
    yellow: 'border-orbit-yellow/30 bg-orbit-yellow/5',
    red:    'border-orbit-red/30 bg-orbit-red/5',
    blue:   'border-orbit-blue/30 bg-orbit-blue/5',
  };
  const textColors = {
    accent: 'text-orbit-accent',
    green:  'text-orbit-green',
    yellow: 'text-orbit-yellow',
    red:    'text-orbit-red',
    blue:   'text-orbit-blue',
  };
  return (
    <div className={`stat-card border ${colors[color]} fade-up`}>
      <div className="flex items-center justify-between">
        <span className="text-orbit-sub text-sm font-medium">{label}</span>
        <div className={`${textColors[color]} opacity-70`}>{icon}</div>
      </div>
      <div className={`text-4xl font-bold font-mono ${textColors[color]}`}>{value}</div>
      {sublabel && <div className="text-xs text-orbit-sub">{sublabel}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/tasks/stats'),
          api.get('/tasks?limit=5'),
        ]);
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" />
    </div>
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 fade-up">
      {/* Header */}
      <div>
        <div className="text-orbit-sub text-sm font-mono mb-1">{greeting} ✦</div>
        <h1 className="text-3xl font-bold text-orbit-text tracking-tight">{user?.name}</h1>
        <p className="text-orbit-sub text-sm mt-1">
          {isAdmin ? "Here's your mission overview" : "Here's what's on your radar today"}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          label="Projects"
          value={stats?.totalProjects ?? 0}
          color="accent"
          sublabel="Total active"
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>}
        />
        <StatCard
          label="Total Tasks"
          value={stats?.total ?? 0}
          color="blue"
          sublabel="All time"
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
        />
        <StatCard
          label="Pending"
          value={stats?.pending ?? 0}
          color="yellow"
          sublabel="Need attention"
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard
          label="Completed"
          value={stats?.completed ?? 0}
          color="green"
          sublabel="Done ✓"
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
        <StatCard
          label="Overdue"
          value={stats?.overdue ?? 0}
          color="red"
          sublabel="Past due date"
          icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
        />
      </div>

      {/* Completion bar */}
      {stats?.total > 0 && (
        <div className="orbit-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-orbit-text">Overall Progress</span>
            <span className="text-sm font-mono text-orbit-accent">
              {Math.round((stats.completed / stats.total) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-orbit-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-orbit rounded-full transition-all duration-700"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-orbit-sub mt-2 font-mono">
            <span>{stats.completed} completed</span>
            <span>{stats.total} total</span>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-orbit-text">Recent Tasks</h2>
          <Link to="/tasks" className="text-sm text-orbit-accent hover:underline font-mono">View all →</Link>
        </div>
        {recentTasks.length === 0 ? (
          <div className="orbit-card p-8 text-center text-orbit-sub">No tasks yet. Start by creating a project.</div>
        ) : (
          <div className="space-y-2">
            {recentTasks.map((task) => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
              return (
                <div key={task._id} className="orbit-card p-4 flex items-center gap-4 hover:border-orbit-muted transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.status === 'completed' ? 'bg-orbit-green' :
                    task.status === 'in-progress' ? 'bg-orbit-blue' : 'bg-orbit-yellow'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-orbit-text truncate">{task.title}</div>
                    <div className="text-xs text-orbit-sub font-mono">{task.projectId?.title}</div>
                  </div>
                  {task.dueDate && (
                    <div className={`text-xs font-mono ${isOverdue ? 'text-orbit-red' : 'text-orbit-sub'}`}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
