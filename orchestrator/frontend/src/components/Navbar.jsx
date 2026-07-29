import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

export default function Navbar() {
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
        <div className="flex gap-4">
          <Link to="/login/driver">
            <button className="btn-secondary">Driver Login</button>
          </Link>
          <Link to="/login/shipper">
            <button className="btn-primary">Shipper Login</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
