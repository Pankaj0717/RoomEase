import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaHeart, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function TenantDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    budget: '',
    roomType: '',
    amenities: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const favRes = await api.get('/users/favorites');
      setFavorites(favRes.data.favorites || []);
      
      // Load all listings
      const listingsRes = await api.get('/listings');
      const listings = listingsRes.data.listings || [];
      setAllListings(listings);
      setFilteredListings(listings);
      
      // Get recent searches from localStorage
      const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      setRecentSearches(searches);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Apply filters to listings
    let filtered = [...allListings];

    if (filters.location) {
      filtered = filtered.filter(listing =>
        listing.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        listing.location.area.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.roomType) {
      filtered = filtered.filter(listing => listing.type === filters.roomType);
    }

    if (filters.budget) {
      filtered = filtered.filter(listing => listing.price <= parseInt(filters.budget));
    }

    if (filters.amenities) {
      filtered = filtered.filter(listing =>
        listing.amenities.some(amenity =>
          amenity.toLowerCase().includes(filters.amenities.toLowerCase())
        )
      );
    }

    setFilteredListings(filtered);

    // Save to recent searches
    const searchQuery = {
      ...filters,
      timestamp: new Date().toISOString()
    };
    
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    searches.unshift(searchQuery);
    localStorage.setItem('recentSearches', JSON.stringify(searches.slice(0, 5)));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
            <FaHome className="text-3xl text-secondary" />
            <h1 className="text-2xl font-bold text-secondary">RoomEase</h1>
          </div>
          <button
            onClick={logout}
            className="text-gray-600 hover:text-secondary font-medium"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen shadow-sm">
          <nav className="p-4 space-y-2">
            <Link
              to="/listings"
              className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg"
            >
              <FaSearch />
              Listings
            </Link>
            <Link
              to="/favorites"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaHeart />
              Favorites
            </Link>
            <Link
              to="/messages"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Messages
            </Link>
            <Link
              to="/analytics/tenant"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Profile
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-secondary mb-6">Dashboard</h2>

          {/* Search Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <select
                name="budget"
                value={filters.budget}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                <option value="">Budget</option>
                <option value="5000">Under ₹5,000</option>
                <option value="10000">Under ₹10,000</option>
                <option value="15000">Under ₹15,000</option>
              </select>
              <select
                name="roomType"
                value={filters.roomType}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                <option value="">Room Type</option>
                <option value="single">Single</option>
                <option value="shared">Shared</option>
                <option value="pg">PG</option>
                <option value="hostel">Hostel</option>
              </select>
              <input
                type="text"
                name="amenities"
                placeholder="Amenities"
                value={filters.amenities}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              Search
            </button>
          </div>

          {/* Favorite Listings */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-secondary mb-4">Favorite Listings</h3>
            <div className="grid grid-cols-2 gap-6">
              {favorites.length > 0 ? (
                favorites.slice(0, 2).map((listing) => (
                  <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                      src={listing.images[0]?.url || '/placeholder.jpg'}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="text-xl font-bold mb-2">₹{listing.price}/month</h4>
                      <p className="text-gray-600 mb-1">{listing.location.city}</p>
                      <p className="text-gray-600 mb-3">{listing.gender}</p>
                      <button
                        onClick={() => navigate(`/listings/${listing._id}`)}
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-gray-500">No favorites yet</p>
              )}
            </div>
          </div>

          {/* All Listings */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-secondary mb-4">Available Listings</h3>
            <p className="text-gray-600 mb-4">{filteredListings.length} properties available</p>
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
                    <img
                      src={listing.images[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'}
                      alt={listing.title}
                      className="w-full h-48 object-cover hover:scale-105 transition duration-300"
                      onClick={() => navigate(`/listings/${listing._id}`)}
                    />
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2 truncate">{listing.title}</h4>
                      <p className="text-gray-600 text-sm mb-1">{listing.location.city}, {listing.location.area}</p>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-2xl font-bold text-primary">₹{listing.price}</span>
                        <span className="text-gray-600 text-sm">/month</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-3">
                        <span>{listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}</span>
                        <span>{listing.occupancy.current}/{listing.occupancy.max} occupied</span>
                      </div>
                      <button
                        onClick={() => navigate(`/listings/${listing._id}`)}
                        className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500 text-lg">No listings match your search criteria</p>
                <button
                  onClick={() => {
                    setFilters({ location: '', budget: '', roomType: '', amenities: '' });
                    setFilteredListings(allListings);
                  }}
                  className="mt-4 bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Recent Searches */}
          <div>
            <h3 className="text-2xl font-bold text-secondary mb-4">Recent Searches</h3>
            <div className="space-y-3">
              {recentSearches.slice(0, 2).map((search, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition cursor-pointer"
                  onClick={() => {
                    const params = new URLSearchParams(search).toString();
                    navigate(`/listings?${params}`);
                  }}
                >
                  <span className="text-gray-700">
                    {search.location && `${search.location}, `}
                    {search.roomType && `${search.roomType}, `}
                    {search.budget && `₹${search.budget}`}
                  </span>
                  <span className="text-gray-400 text-sm">→</span>
                </div>
              ))}
              {recentSearches.length === 0 && (
                <p className="text-gray-500">No recent searches</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}