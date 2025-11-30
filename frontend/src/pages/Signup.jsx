import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Mail, Lock, User, Phone } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container py-14 max-w-md">
      <div className="mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">Create your <span className="text-blue-600">MiniMart</span> account</h1>
          <p className="text-gray-600 mt-2">Join us to discover and sell great items</p>
        </div>
          <form onSubmit={onSubmit} className="card p-4 space-y-4 max-w-xl w-full mx-auto bg-white p-8 rounded-2xl shadow-sm">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm mb-1">Full name</label>
          <div className="flex items-center gap-2 bg-white rounded-2xl border px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <User className="text-gray-400" size={18} />
            <input name="name" value={form.name} onChange={onChange} placeholder="Enter your full name" className="w-full outline-none" required />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <div className="flex items-center gap-2 bg-white rounded-2xl border px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <Phone className="text-gray-400" size={18} />
            <input name="phone" value={form.phone} onChange={onChange} placeholder="Enter your phone number" className="w-full outline-none" required />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <div className="flex items-center gap-2 bg-white rounded-2xl border px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <Mail className="text-gray-400" size={18} />
            <input type="email" name="email" value={form.email} onChange={onChange} placeholder="Enter your email address" className="w-full outline-none" required />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="flex items-center gap-2 bg-white rounded-2xl border px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="text-gray-400" size={18} />
            <input type="password" name="password" value={form.password} onChange={onChange} placeholder="Enter your password" className="w-full outline-none" required />
          </div>
        </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-2xl text-white shadow-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-60">{loading ? 'Creating account...' : 'Create Account'}</button>
        <div className="flex justify-between text-sm text-gray-600">
          <p>Already have an account? <Link to="/login" className="text-blue-600">Sign in</Link></p>
          <Link to="/" className="hover:underline">← Back to Home</Link>
        </div>
        </form>
      </div>
    </div>
  );
}
