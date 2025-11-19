import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-8 flex items-center gap-3">
        <FaHome className="text-5xl text-teal-700" />
        <h1 className="text-4xl font-bold text-slate-900">RoomEase</h1>
      </div>

      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Login</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-teal-700 border-gray-300 rounded focus:ring-teal-600"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 active:bg-teal-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-700 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
