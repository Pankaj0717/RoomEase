import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import TenantDashboard from './pages/TenantDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddListing from './pages/AddListing';
import Listings from './pages/Listings';
import ListingDetails from './pages/ListingDetails';
import Messages from './pages/Messages';
import Favorites from './pages/Favorites';
import Analytics from './pages/Analytics';
import PaymentPage from './pages/PaymentPage';
import BookingConfirmation from './pages/BookingConfirmation';
import AIChatbot from './pages/AIChatbot';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Tenant Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <TenantDashboard />
          </ProtectedRoute>
        }
      />
      
      
      <Route
        path="/listings/:id"
        element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <ListingDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/tenant"
        element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <Analytics />
          </ProtectedRoute>
        }
      />
      
      {/* Owner Routes */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/add-listing"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AddListing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/owner"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <Analytics />
          </ProtectedRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Common Routes */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-confirmation"
        element={
          <ProtectedRoute>
            <BookingConfirmation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-chatbot"
        element={
          <ProtectedRoute>
            <AIChatbot />
          </ProtectedRoute>
        }
      />
      
      {/* Default Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;