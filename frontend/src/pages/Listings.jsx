import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaHome, FaHeart, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Listings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    budget: searchParams.get('budget') || '',
    gender: searchParams.get('gender') || ''
  });

  useEffect(() => {
    loadListings();
    loadFavorites();
  }, []);

  const loadListings = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.budget) params.append('budget', filters.budget);
      if (filters.gender) params.append('gender', filters.gender);

      const response = await api.get(`/listings?${params.toString()}`);
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await api.get('/users/favorites');
      setFavorites(response.data.favorites?.map(f => f._id) || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleSearch = () => {
    loadListings();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleFavorite = async (listingId) => {
    try {
      await api.post(`/users/favorites/${listingId}`);
      if (favorites.includes(listingId)) {
        setFavorites(favorites.filter(id => id !== listingId));
      } else {
        setFavorites([...favorites, listingId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (listingId) => favorites.includes(listingId);

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
                className="text-gray-900 font-medium"
              >
                Listings
              </button>
              <button
                onClick={() => navigate('/favorites')}
                className="text-gray-600 hover:text-gray-900"
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
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Listings</h2>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-4 gap-4">
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white"
            >
              <option value="">Location</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
            </select>

            <select
              name="budget"
              value={filters.budget}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white"
            >
              <option value="">Budget</option>
              <option value="5000">Under ₹5,000</option>
              <option value="10000">Under ₹10,000</option>
              <option value="15000">Under ₹15,000</option>
              <option value="20000">Under ₹20,000</option>
            </select>

            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="any">Any</option>
            </select>

            <button
              onClick={handleSearch}
              className="bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-800 transition flex items-center justify-center gap-2"
            >
              <FaSearch />
              Search
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-4 gap-6">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  <img
                    src={listing.images[0]?.url || '/placeholder.jpg'}
                    alt={listing.title}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => navigate(`/listings/${listing._id}`)}
                  />
                  <button
                    onClick={() => toggleFavorite(listing._id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
                  >
                    <FaHeart className={isFavorite(listing._id) ? 'text-red-500' : 'text-gray-400'} />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{listing.type.charAt(0).toUpperCase() + listing.type.slice(1)} Room</h3>
                  <p className="text-2xl font-bold text-teal-700 mb-2">₹{listing.price}/mo</p>
                  <p className="text-gray-600 text-sm mb-1">{listing.gender === 'any' ? 'Co-ed' : listing.gender.charAt(0).toUpperCase() + listing.gender.slice(1)}</p>
                  <p className="text-gray-600 text-sm mb-3">{listing.location.city}</p>
                  <button
                    onClick={() => navigate(`/listings/${listing._id}`)}
                    className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-12 text-gray-500">
              No listings found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
