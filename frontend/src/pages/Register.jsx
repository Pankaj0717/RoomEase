import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'tenant'
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

    const result = await register(formData);
    
    if (!result.success) {
      setError(result.message);
    } else {
      // Check if there's a redirect path stored
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      }
      // Navigation already handled in AuthContext
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
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Register</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
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
              minLength="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            />
          </div>

          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent bg-white"
            >
              <option value="">Select Role</option>
              <option value="tenant">Tenant</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div>
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-700 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}