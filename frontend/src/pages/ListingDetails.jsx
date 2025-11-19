import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHome, FaBed, FaWifi, FaUtensils, FaSnowflake } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      const response = await api.get(`/listings/${id}`);
      setListing(response.data.listing);
    } catch (error) {
      console.error('Error loading listing:', error);
      alert('Failed to load listing');
      navigate('/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    navigate('/messages', { 
      state: { 
        receiverId: listing.owner._id,
        listingId: listing._id 
      } 
    });
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      'Two Beds': <FaBed />,
      'Wi-Fi': <FaWifi />,
      'Kitchen': <FaUtensils />,
      'Air Conditioning': <FaSnowflake />
    };
    return icons[amenity] || <FaBed />;
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!listing) {
    return <div className="flex items-center justify-center min-h-screen">Listing not found</div>;
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
          <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-semibold">{user?.name?.charAt(0)}</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Image and Details */}
          <div className="col-span-2">
            {/* Image Carousel */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <img
                src={listing.images[currentImageIndex]?.url || '/placeholder.jpg'}
                alt={listing.title}
                className="w-full h-96 object-cover"
              />
              {listing.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {listing.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`${listing.title} ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer ${
                        currentImageIndex === index ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Listing Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{listing.title}</h2>
              <div className="mb-6">
                <p className="text-4xl font-bold text-teal-700 mb-2">₹{listing.price} / month</p>
                <p className="text-gray-600">
                  Type: {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)} • 
                  {listing.gender === 'any' ? ' Co-ed' : ` ${listing.gender.charAt(0).toUpperCase() + listing.gender.slice(1)}`} • 
                  Occupants: {listing.occupancy.current}/{listing.occupancy.max}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact and Amenities */}
          <div className="space-y-6">
            {/* Contact Owner */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Owner</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  {listing.owner.profilePicture ? (
                    <img
                      src={listing.owner.profilePicture}
                      alt={listing.owner.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-600">
                      {listing.owner.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{listing.owner.name}</h4>
                  <p className="text-sm text-gray-600">{listing.location.area}</p>
                </div>
              </div>
              <button
                onClick={handleMessage}
                className="w-full bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition"
              >
                Message
              </button>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Amenities</h3>
              <div className="space-y-3">
                {listing.amenities && listing.amenities.length > 0 ? (
                  listing.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                      <span className="text-teal-700 text-xl">
                        {getAmenityIcon(amenity)}
                      </span>
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No amenities listed</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
