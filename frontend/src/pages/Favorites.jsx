import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaHeart, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Favorites() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await api.get('/users/favorites');
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (listingId) => {
    try {
      await api.post(`/users/favorites/${listingId}`);
      setFavorites(favorites.filter(fav => fav._id !== listingId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite');
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
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <FaHome className="text-3xl text-slate-900" />
              <h1 className="text-2xl font-bold text-slate-900">RoomEase</h1>
            </div>
            <nav className="flex items-center gap-6">
              <button
                onClick={() => navigate('/listings')}
                className="text-gray-600 hover:text-gray-900"
              >
                Listings
              </button>
              <button
                onClick={() => navigate('/favorites')}
                className="text-gray-900 font-medium"
              >
                Favorites
              </button>
              <button
                onClick={() => navigate('/messages')}
                className="text-gray-600 hover:text-gray-900"
              >
                Messages
              </button>
            </nav>
          </div>
          <button
            onClick={logout}
            className="text-gray-600 hover:text-slate-900 font-medium"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <FaHeart className="text-3xl text-red-500" />
          <h2 className="text-3xl font-bold text-slate-900">Favorite Listings</h2>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-4 gap-6">
            {favorites.map((listing) => (
              <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  <img
                    src={listing.images[0]?.url || '/placeholder.jpg'}
                    alt={listing.title}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => navigate(`/listings/${listing._id}`)}
                  />
                  <button
                    onClick={() => removeFavorite(listing._id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">
                    {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)} Room
                  </h3>
                  <p className="text-2xl font-bold text-teal-700 mb-2">₹{listing.price}/mo</p>
                  <p className="text-gray-600 text-sm mb-1">
                    {listing.gender === 'any' ? 'Co-ed' : listing.gender.charAt(0).toUpperCase() + listing.gender.slice(1)}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">{listing.location.city}</p>
                  <button
                    onClick={() => navigate(`/listings/${listing._id}`)}
                    className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Favorites Yet</h3>
            <p className="text-gray-500 mb-6">
              Start adding listings to your favorites to see them here
            </p>
            <button
              onClick={() => navigate('/listings')}
              className="bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-800 transition"
            >
              Browse Listings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
