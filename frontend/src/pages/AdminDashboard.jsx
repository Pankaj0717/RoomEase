import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    pendingApprovals: 0
  });
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/listings/pending')
      ]);

      setStats(statsRes.data.stats);
      setPendingListings(pendingRes.data.listings || []);
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/listings/${id}/approve`);
      loadDashboardData();
    } catch (error) {
      alert('Failed to approve listing');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/listings/${id}/reject`);
      loadDashboardData();
    } catch (error) {
      alert('Failed to reject listing');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">RoomEase Admin</h1>
          <button
            onClick={logout}
            className="text-gray-600 hover:text-slate-900 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-teal-600">
            <h3 className="text-5xl font-bold text-slate-900 mb-2">{stats.totalUsers}</h3>
            <p className="text-gray-600">Total Users</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
            <h3 className="text-5xl font-bold text-slate-900 mb-2">{stats.totalListings}</h3>
            <p className="text-gray-600">Total Listings</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
            <h3 className="text-5xl font-bold text-slate-900 mb-2">{stats.pendingApprovals}</h3>
            <p className="text-gray-600">Pending Approvals</p>
          </div>
        </div>

        {/* Pending Listings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-xl font-bold text-slate-900">Pending Listings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Owner</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date Submitted</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingListings.length > 0 ? (
                  pendingListings.map((listing) => (
                    <tr key={listing._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{listing.title}</td>
                      <td className="px-6 py-4 text-gray-600">{listing.location.city}</td>
                      <td className="px-6 py-4 text-gray-600">{listing.owner?.name}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(listing._id)}
                            className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-800 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(listing._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No pending listings
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
