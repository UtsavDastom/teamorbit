import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created! Welcome aboard 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orbit-bg flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orbit-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orbit-green/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-orbit mb-4 glow-pulse">
            <span className="text-white font-bold">TO</span>
          </div>
          <h1 className="text-3xl font-bold text-orbit-text tracking-tight">Join TeamOrbit</h1>
          <p className="text-orbit-sub text-sm mt-1 font-mono">Create your crew account</p>
        </div>

        <form onSubmit={handleSubmit} className="orbit-card p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-orbit-text mb-2">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="Alex Johnson" required className="orbit-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-orbit-text mb-2">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="you@company.com" required className="orbit-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-orbit-text mb-2">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="Min. 6 characters" required className="orbit-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-orbit-text mb-2">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="orbit-input">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="orbit-btn-primary w-full">
            {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-orbit-sub text-sm mt-6">
          Already aboard?{' '}
          <Link to="/login" className="text-orbit-accent hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
