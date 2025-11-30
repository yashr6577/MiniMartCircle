import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-14 min-w-md">
      <div className="mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">Sign in to <span className="text-blue-600">MiniMart</span></h1>
          <p className="text-gray-600 mt-2">Welcome back! Please enter your details</p>
        </div>
        <form onSubmit={onSubmit} className="card p-5 space-y-4 max-w-xl w-full mx-auto bg-white p-8 rounded-2xl shadow-sm">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm mb-1">Email</label>
          <div className="flex items-center gap-2 bg-white rounded-2xl border px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <Mail className="text-gray-400" size={18} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="w-full outline-none" required />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <div className="flex items-center gap-2 bg-white rounded-2xl border px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="text-gray-400" size={18} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full outline-none" required />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 rounded-2xl text-white shadow-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-60">{loading ? 'Logging in...' : 'Sign in'}</button>
        <div className="flex justify-between text-sm text-gray-600">
          <p>No account? <Link to="/signup" className="text-blue-600">Create Account</Link></p>
          <Link to="/" className="hover:underline">← Back to Home</Link>
        </div>
        </form>
      </div>
    </div>
  );
}
