import { Link, useNavigate } from 'react-router-dom';
import { Truck, LogOut, LayoutDashboard, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ 
      position: 'sticky', top: 0, zIndex: 50, 
      backgroundColor: 'var(--color-surface)', 
      borderBottom: '1px solid var(--color-border)',
      padding: '1rem 0'
    }}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--color-heading)' }}>
          <Truck className="text-primary" size={28} />
          <span className="font-bold text-xl">SupplySync AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/system-status" className="flex items-center gap-1 text-sm text-body hover:text-primary mr-4" style={{ color: 'var(--color-body)' }}>
            <Activity size={16} /> Status
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 mr-4" style={{ color: 'var(--color-body)' }}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-secondary flex items-center gap-2" style={{ padding: '0.5rem 1rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login/driver">
                <button className="btn-secondary">Driver Login</button>
              </Link>
              <Link to="/login/shipper">
                <button className="btn-primary">Shipper Login</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
