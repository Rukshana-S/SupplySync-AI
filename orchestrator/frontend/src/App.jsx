import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import DriverLogin from './pages/DriverLogin';
import ShipperLogin from './pages/ShipperLogin';
import DriverRegistration from './pages/DriverRegistration';
import ShipperRegistration from './pages/ShipperRegistration';
import DriverDashboard from './pages/DriverDashboard';
import ShipperDashboard from './pages/ShipperDashboard';
import CreateShipment from './pages/CreateShipment';
import ShipmentTracking from './pages/ShipmentTracking';
import SystemStatus from './pages/SystemStatus';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function DashboardRouter() {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/" />;
  
  if (user.role === 'driver') {
    return <DriverDashboard />;
  } else if (user.role === 'shipper') {
    return <ShipperDashboard />;
  }
  
  return <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/driver" element={<DriverLogin />} />
          <Route path="/login/shipper" element={<ShipperLogin />} />
          <Route path="/register/driver" element={<DriverRegistration />} />
          <Route path="/register/shipper" element={<ShipperRegistration />} />
          <Route path="/system-status" element={<SystemStatus />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } />
          
          <Route path="/shipments/create" element={
            <ProtectedRoute>
              <CreateShipment />
            </ProtectedRoute>
          } />

          <Route path="/shipments/:id" element={
            <ProtectedRoute>
              <ShipmentTracking />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
