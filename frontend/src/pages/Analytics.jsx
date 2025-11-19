import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaMoneyBillWave, FaChartLine, FaReceipt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Analytics() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await api.get('/users/analytics');
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getChartData = () => {
    if (user.role === 'owner' && analytics?.revenueByMonth) {
      return Object.entries(analytics.revenueByMonth).map(([month, amount]) => ({
        month,
        amount
      }));
    }
    return [];
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(user.role === 'owner' ? '/owner/dashboard' : '/dashboard')}>
            <FaHome className="text-3xl text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900">RoomEase</h1>
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
        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          {user.role === 'owner' ? 'Revenue Analytics' : 'Payment Analytics'}
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {user.role === 'tenant' ? (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold">Total Paid</h3>
                  <FaMoneyBillWave className="text-2xl text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(analytics?.totalPaid || 0)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold">Pending Payments</h3>
                  <FaReceipt className="text-2xl text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(analytics?.totalPending || 0)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold">Active Bookings</h3>
                  <FaChartLine className="text-2xl text-teal-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics?.activeBookings || 0}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold">Total Earned</h3>
                  <FaMoneyBillWave className="text-2xl text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(analytics?.totalEarned || 0)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold">Pending Payments</h3>
                  <FaReceipt className="text-2xl text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(analytics?.totalPending || 0)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold">Active Bookings</h3>
                  <FaChartLine className="text-2xl text-teal-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics?.activeBookings || 0}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Revenue Chart (Owner Only) */}
        {user.role === 'owner' && analytics?.revenueByMonth && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="amount" fill="#1a7f8e" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-xl font-bold text-slate-900">Payment History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Month/Year</th>
                  {user.role === 'owner' && (
                    <>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tenant</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Property</th>
                    </>
                  )}
                  {user.role === 'tenant' && (
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Property</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics?.paymentHistory && analytics.paymentHistory.length > 0 ? (
                  analytics.paymentHistory.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{formatDate(payment.date)}</td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {payment.month} {payment.year}
                      </td>
                      {user.role === 'owner' && (
                        <>
                          <td className="px-6 py-4 text-gray-600">{payment.tenant}</td>
                          <td className="px-6 py-4 text-gray-600">{payment.listing}</td>
                        </>
                      )}
                      {user.role === 'tenant' && (
                        <td className="px-6 py-4 text-gray-600">
                          {payment.listing?.title || 'N/A'}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={user.role === 'owner' ? 5 : 4} className="px-6 py-8 text-center text-gray-500">
                      No payment history available
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
