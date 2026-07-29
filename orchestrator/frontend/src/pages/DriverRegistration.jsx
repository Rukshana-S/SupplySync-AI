import { Link, useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';

export default function DriverRegistration() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-box">
        <div className="flex flex-col items-center gap-4" style={{ marginBottom: '2rem' }}>
          <Truck className="text-primary" size={48} />
          <h2 className="text-2xl font-bold">Driver Registration</h2>
          <p className="text-sm text-center">Join the network and start driving.</p>
        </div>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            Register
          </button>
        </form>
        <p className="text-center text-sm">
          Already have an account? <Link to="/login/driver">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
