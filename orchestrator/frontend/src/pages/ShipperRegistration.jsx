import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function ShipperRegistration() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-box">
        <div className="flex flex-col items-center gap-4" style={{ marginBottom: '2rem' }}>
          <Package className="text-accent" size={48} />
          <h2 className="text-2xl font-bold">Shipper Registration</h2>
          <p className="text-sm text-center">Join the network to manage shipments.</p>
        </div>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Company Name" required />
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1rem', backgroundColor: 'var(--color-accent)' }}>
            Register
          </button>
        </form>
        <p className="text-center text-sm">
          Already have an account? <Link to="/login/shipper">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
