import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaUpload, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function AddListing() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    price: '',
    city: '',
    area: '',
    address: '',
    gender: '',
    currentOccupancy: '0',
    maxOccupancy: '',
    amenities: []
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const amenitiesList = [
    'Wi-Fi',
    'Air Conditioning',
    'Kitchen',
    'Washing Machine',
    'TV',
    'Refrigerator',
    'Parking',
    'Security',
    'Power Backup',
    'Water Supply',
    'Furnished',
    'Gym'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityToggle = (amenity) => {
    const updatedAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    // Validate file size (5MB max per image)
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setError('Each image must be less than 5MB');
      return;
    }

    // Validate file type
    const invalidTypes = files.filter(file => !file.type.startsWith('image/'));
    if (invalidTypes.length > 0) {
      setError('Only image files are allowed');
      return;
    }

    setImages([...images, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setError('');
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (images.length === 0) {
      setError('Please upload at least one image');
      setLoading(false);
      return;
    }

    if (formData.amenities.length === 0) {
      setError('Please select at least one amenity');
      setLoading(false);
      return;
    }

    try {
      // Create FormData for multipart upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('type', formData.type);
      data.append('price', formData.price);
      data.append('location', JSON.stringify({
        city: formData.city,
        area: formData.area,
        address: formData.address
      }));
      data.append('amenities', JSON.stringify(formData.amenities));
      data.append('gender', formData.gender);
      data.append('occupancy', JSON.stringify({
        current: parseInt(formData.currentOccupancy),
        max: parseInt(formData.maxOccupancy)
      }));

      // Append images
      images.forEach((image) => {
        data.append('images', image);
      });

      const response = await api.post('/listings', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/owner/dashboard');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Listing Created!</h2>
          <p className="text-gray-600 mb-6">
            Your listing has been submitted for admin approval. You'll be notified once it's approved.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/owner/dashboard')}
              className="bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Add Another Listing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/owner/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <div className="flex items-center gap-3">
              <FaHome className="text-3xl text-teal-700" />
              <h1 className="text-2xl font-bold text-gray-900">Add New Listing</h1>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Spacious 2BHK Apartment in Koramangala"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe your property, nearby facilities, rules, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                ></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent bg-white"
                  >
                    <option value="">Select Type</option>
                    <option value="single">Single Room</option>
                    <option value="shared">Shared Room</option>
                    <option value="pg">PG</option>
                    <option value="hostel">Hostel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="1000"
                    placeholder="8000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Bangalore"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Area/Locality *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    placeholder="Koramangala"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, Building Name, Landmark"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent bg-white"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="any">Any</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Occupancy *
                  </label>
                  <input
                    type="number"
                    name="currentOccupancy"
                    value={formData.currentOccupancy}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Occupancy *
                  </label>
                  <input
                    type="number"
                    name="maxOccupancy"
                    value={formData.maxOccupancy}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities *</h2>
            <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
            
            <div className="grid md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                    formData.amenities.includes(amenity)
                      ? 'border-teal-700 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-5 h-5 text-teal-700 rounded focus:ring-teal-700"
                  />
                  <span className="font-medium text-gray-900">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Property Images *</h2>
            <p className="text-sm text-gray-600 mb-4">Upload up to 5 images (Max 5MB each)</p>
            
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-700 transition">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={images.length >= 5}
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <FaUpload className="text-4xl text-gray-400" />
                  <span className="text-gray-700 font-medium">
                    {images.length >= 5 ? 'Maximum 5 images reached' : 'Click to upload images'}
                  </span>
                  <span className="text-sm text-gray-500">PNG, JPG up to 5MB</span>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/owner/dashboard')}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-bold text-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Listing...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}