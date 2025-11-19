import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCreditCard, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function PaymentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { booking, amount } = location.state || {};

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: user?.name || ''
  });
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.slice(0, 19);
    }

    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
      }
      if (value.length > 7) value = value.slice(0, 7);
    }

    // Limit CVV to 3 digits
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      navigate('/booking-confirmation', {
        state: {
          booking,
          amount,
          paymentMethod: 'Credit Card',
          transactionId: 'TXN' + Date.now()
        }
      });
    }, 2000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
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
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <FaCreditCard className="text-3xl text-teal-700" />
            <h2 className="text-3xl font-bold text-slate-900">Payment</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Card Number */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
                <FaCreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiration Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM / YY"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              {/* CVV */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Monthly Rent</span>
                  <span>{formatCurrency(amount || 24000)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span className="text-teal-700">{formatCurrency(amount || 24000)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-teal-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaLock />
                  Pay {formatCurrency(amount || 24000)}
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
              <FaLock className="text-gray-400" />
              Your payment information is secure and encrypted
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
