import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCheckCircle, FaDownload, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function BookingConfirmation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { booking, amount, paymentMethod, transactionId } = location.state || {};

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate a PDF
    alert('Receipt download functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaHome className="text-3xl text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900">RoomEase</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your booking has been confirmed!<br />
            A confirmation email has been sent to {user?.email || 'prakash236example.com'}.
          </p>

          {/* Booking Details Card */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <img
              src="/placeholder.jpg"
              alt="Room"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            
            <div className="text-left space-y-3">
              <div>
                <h3 className="font-bold text-xl text-gray-900">Single Occupancy Room</h3>
                <p className="text-gray-600">New Delhi</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-semibold text-gray-900">
                    {booking?.startDate ? formatDate(booking.startDate) : 'April 20, 2024'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-semibold text-gray-900">
                    {booking?.endDate ? formatDate(booking.endDate) : 'May 10, 2024'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-2xl font-bold text-teal-700">
                    {formatCurrency(amount || 24000)}
                  </span>
                </div>
              </div>

              {transactionId && (
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-gray-900">{transactionId}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="text-gray-900">{paymentMethod || 'Credit Card'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center justify-center gap-2 bg-white border-2 border-teal-700 text-teal-700 py-3 rounded-lg font-semibold hover:bg-teal-700 hover:text-white transition"
            >
              <FaDownload />
              Download Receipt
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <FaEnvelope className="text-teal-600 text-xl mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Check Your Email</h4>
            <p className="text-sm text-teal-900">
              We've sent a detailed confirmation email with your booking information, 
              property details, and check-in instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
