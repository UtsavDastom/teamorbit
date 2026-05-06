import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orbit-bg flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orbit-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orbit-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-orbit mb-4 glow-pulse">
            <span className="text-white font-bold">TO</span>
          </div>
          <h1 className="text-3xl font-bold text-orbit-text tracking-tight">TeamOrbit</h1>
          <p className="text-orbit-sub text-sm mt-1 font-mono">Mission Control — Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="orbit-card p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-orbit-text mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
              className="orbit-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-orbit-text mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="orbit-input"
            />
          </div>
          <button type="submit" disabled={loading} className="orbit-btn-primary w-full mt-2">
            {loading ? <LoadingSpinner size="sm" /> : 'Launch Into Orbit'}
          </button>
        </form>

        <p className="text-center text-orbit-sub text-sm mt-6">
          No account?{' '}
          <Link to="/register" className="text-orbit-accent hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
