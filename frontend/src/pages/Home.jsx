import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaShieldAlt, FaUserFriends, FaBolt, FaStar, FaArrowRight, FaCheckCircle, FaMapMarkerAlt, FaRupeeSign, FaHeart } from 'react-icons/fa';
import api from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    roomType: '',
    budget: ''
  });
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchData).toString();
    navigate(`/listings?${params}`);
  };

  const features = [
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Verified Listings',
      description: 'All properties are verified by our team for authenticity and safety'
    },
    {
      icon: <FaUserFriends className="text-4xl" />,
      title: 'Trusted Community',
      description: 'Connect with verified owners and like-minded roommates'
    },
    {
      icon: <FaBolt className="text-4xl" />,
      title: 'Instant Booking',
      description: 'Book your perfect room in minutes with our seamless process'
    },
    {
      icon: <FaStar className="text-4xl" />,
      title: 'Best Prices',
      description: 'Find affordable rooms with transparent pricing, no hidden charges'
    }
  ];

  

  const testimonials = [
    {
      name: 'Gouravi Nayak',
      role: 'Software Engineer',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      text: 'Found my perfect PG in just 2 days! The verification process made me feel safe and the room was exactly as shown in pictures.',
      rating: 5
    },
    {
      name: 'Nikhil Majukar',
      role: 'Student',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      text: 'Amazing platform! The owner was responsive and the booking process was super smooth. Highly recommended for students.',
      rating: 5
    },
    {
      name: 'Anjaneya Desai',
      role: 'Marketing Professional',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      text: 'Best decision to use RoomEase. The customer support is excellent and I got exactly what I was looking for.',
      rating: 5
    }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Tenants' },
    { number: '15K+', label: 'Verified Properties' },
    { number: '100+', label: 'Cities Covered' },
    { number: '4.8', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <FaHome className="text-3xl text-teal-700" />
              <span className="text-2xl font-bold text-gray-900">RoomEase</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-teal-700 font-medium transition">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-teal-700 font-medium transition">Reviews</a>
              <button
                onClick={() => navigate('/login')}
                className="text-teal-700 font-semibold hover:text-teal-800 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-800 transition transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
            <button className="md:hidden text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 text-white pt-32 pb-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-teal-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center md:text-left">
              <div className="inline-block bg-teal-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-bounce">
                🎉 India's #1 Room Rental Platform
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in">
                Find Your Perfect
                <span className="block text-yellow-300 mt-2">Home Away From Home</span>
              </h1>
              <p className="text-xl text-teal-50 mb-8 leading-relaxed">
                Discover thousands of verified PGs, hostels, and shared rooms across India. 
                Your comfort is our priority.
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-700" />
                      <input
                        type="text"
                        placeholder="City, Area..."
                        value={searchData.location}
                        onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <select
                      value={searchData.roomType}
                      onChange={(e) => setSearchData({ ...searchData, roomType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-gray-900"
                    >
                      <option value="">Room Type</option>
                      <option value="single">Single Room</option>
                      <option value="shared">Shared Room</option>
                      <option value="pg">PG</option>
                      <option value="hostel">Hostel</option>
                    </select>
                    <div className="relative">
                      <FaRupeeSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-700" />
                      <select
                        value={searchData.budget}
                        onChange={(e) => setSearchData({ ...searchData, budget: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-gray-900"
                      >
                        <option value="">Budget</option>
                        <option value="5000">Under ₹5,000</option>
                        <option value="10000">Under ₹10,000</option>
                        <option value="15000">Under ₹15,000</option>
                        <option value="20000">Under ₹20,000</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-teal-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-teal-800 transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <FaSearch />
                    Search Properties
                  </button>
                </form>
                <p className="text-sm text-gray-600 text-center mt-4">
                  🔥 <span className="font-semibold">5,234</span> people searched in the last 24 hours
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-yellow-300">{stat.number}</div>
                    <div className="text-sm text-teal-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image/Visual */}
            <div className="hidden md:block relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
                  alt="Happy people"
                  className="rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500"
                />
                {/* Floating Card 1 */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-teal-700 text-xl" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Verified Safe</div>
                      <div className="text-sm text-gray-600">100% Secure</div>
                    </div>
                  </div>
                </div>
                {/* Floating Card 2 */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <FaStar className="text-yellow-500 text-xl" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">4.8★ Rating</div>
                      <div className="text-sm text-gray-600">50K+ Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose RoomEase?</h2>
            <p className="text-xl text-gray-600">Everything you need for a hassle-free room search</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 hover:shadow-2xl transition transform hover:-translate-y-2 duration-300 border border-teal-100"
              >
                <div className="text-teal-700 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of happy tenants</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 duration-300 border border-teal-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-700 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Perfect Room?</h2>
          <p className="text-xl text-teal-50 mb-8">
            Join thousands of happy tenants who found their ideal accommodation with RoomEase
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-teal-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              Get Started Free
              <FaArrowRight />
            </button>
            <button
              onClick={() => navigate('/listings')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-teal-700 transition transform hover:scale-105"
            >
              Browse Listings
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FaHome className="text-2xl text-teal-500" />
                <span className="text-xl font-bold text-white">RoomEase</span>
              </div>
              <p className="text-sm">Making room rentals easy and secure across India.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-500 transition">About Us</a></li>
                <li><a href="#" className="hover:text-teal-500 transition">Contact</a></li>
                <li><a href="#" className="hover:text-teal-500 transition">Careers</a></li>
                <li><a href="#" className="hover:text-teal-500 transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">For Tenants</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-500 transition">Search Rooms</a></li>
                <li><a href="#" className="hover:text-teal-500 transition">How It Works</a></li>
                <li><a href="#" className="hover:text-teal-500 transition">Safety Tips</a></li>
                <li><a href="#" className="hover:text-teal-500 transition">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">For Owners</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-500 transition">List Property</a></li>
                <li><a href="#" className="hover:text-teal-500 transition">Owner Guide</a></li>
                <li><a href="#" className="hover:text-teal-500 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-teal-500 transition">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2024 RoomEase. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}