import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaPlus, FaList, FaEnvelope, FaCog, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalListings: 0,
    inquiries: 0,
    booked: 0
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [listingsRes, bookingsRes] = await Promise.all([
        api.get('/listings/owner/my-listings'),
        api.get('/bookings/owner/my-bookings')
      ]);

      const myListings = listingsRes.data.listings || [];
      const myBookings = bookingsRes.data.bookings || [];

      setListings(myListings);
      setStats({
        totalListings: myListings.length,
        inquiries: myBookings.filter(b => b.status === 'pending').length,
        booked: myBookings.filter(b => b.status === 'active').length
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await api.delete(`/listings/${id}`);
      loadDashboardData();
    } catch (error) {
      alert('Failed to delete listing');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      unlisted: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaHome className="text-3xl text-teal-700" />
            <h1 className="text-2xl font-bold text-slate-900">RoomEase</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Dashboard</span>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-teal-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen shadow-sm">
          <nav className="p-4 space-y-2">
            <Link
              to="/owner/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-teal-700 text-white rounded-lg"
            >
              <FaHome />
              Dashboard
            </Link>
            <Link
              to="/owner/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaList />
              Listings
            </Link>
            <Link
              to="/messages"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaEnvelope />
              Inquiries
            </Link>
            <Link
              to="/analytics/owner"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaCog />
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Owner Dashboard</h2>
            <button
              onClick={() => {
                console.log('Navigating to add listing...');
                navigate('/owner/add-listing');
              }}
              className="flex items-center gap-2 bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition"
            >
              <FaPlus />
              Add Listing
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-5xl font-bold text-teal-700 mb-2">{stats.totalListings}</h3>
              <p className="text-gray-600">Total Listings</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-5xl font-bold text-teal-700 mb-2">{stats.inquiries}</h3>
              <p className="text-gray-600">Inquiries</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-5xl font-bold text-teal-700 mb-2">{stats.booked}</h3>
              <p className="text-gray-600">Booked</p>
            </div>
          </div>

          {/* Your Listings */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-xl font-bold text-slate-900">Your Listings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {listings.length > 0 ? (
                    listings.map((listing) => (
                      <tr key={listing._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900">{listing.title}</td>
                        <td className="px-6 py-4 text-gray-600">{listing.location.city}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(listing.status)}`}>
                            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => navigate(`/owner/edit-listing/${listing._id}`)}
                              className="text-teal-700 hover:text-teal-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteListing(listing._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No listings yet. Click "Add Listing" to create your first property.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}