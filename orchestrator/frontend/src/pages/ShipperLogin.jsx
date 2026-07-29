import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function ShipperLogin() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-box">
        <div className="flex flex-col items-center gap-4" style={{ marginBottom: '2rem' }}>
          <Package className="text-accent" size={48} />
          <h2 className="text-2xl font-bold">Shipper Portal</h2>
          <p className="text-sm text-center">Login to manage your shipments and logistics.</p>
        </div>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1rem', backgroundColor: 'var(--color-accent)' }}>
            Sign In
          </button>
        </form>
        <p className="text-center text-sm">
          Don't have an account? <Link to="/register/shipper">Register as Shipper</Link>
        </p>
      </div>
    </div>
  );
}
