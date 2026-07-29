import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DriverLogin from './pages/DriverLogin';
import ShipperLogin from './pages/ShipperLogin';
import DriverRegistration from './pages/DriverRegistration';
import ShipperRegistration from './pages/ShipperRegistration';
import DashboardPlaceholder from './pages/DashboardPlaceholder';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/driver" element={<DriverLogin />} />
        <Route path="/login/shipper" element={<ShipperLogin />} />
        <Route path="/register/driver" element={<DriverRegistration />} />
        <Route path="/register/shipper" element={<ShipperRegistration />} />
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
