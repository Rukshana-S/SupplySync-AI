import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ShipperRegistration() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', phone_number: '', 
    organization_name: '', organization_address: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/register-shipper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.detail || 'Registration failed');
      }
      
      // On success, redirect to login
      navigate('/login/shipper');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-box" style={{ maxWidth: '500px' }}>
        <div className="flex flex-col items-center gap-4" style={{ marginBottom: '2rem' }}>
          <Package className="text-accent" size={48} />
          <h2 className="text-2xl font-bold">Shipper Registration</h2>
          <p className="text-sm text-center">Join the network to manage shipments.</p>
        </div>
        
        {error && <div className="text-error" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>{error}</div>}
        
        <form onSubmit={handleRegister} className="flex flex-col">
          <input type="text" name="full_name" placeholder="Full Name" required onChange={handleChange} />
          <input type="text" name="organization_name" placeholder="Organization Name" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <input type="tel" name="phone_number" placeholder="Phone Number" required onChange={handleChange} />
          <input type="text" name="organization_address" placeholder="Organization Address" required onChange={handleChange} />
          
          <button type="submit" className="btn-primary flex justify-center items-center gap-2" style={{ width: '100%', marginBottom: '1rem', backgroundColor: 'var(--color-accent)' }} disabled={loading}>
            {loading ? <Loader className="animate-spin" size={20} /> : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm">
          Already have an account? <Link to="/login/shipper">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
