import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DriverLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'driver' })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.detail || 'Login failed');
      }
      
      login(result.user, result.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-box">
        <div className="flex flex-col items-center gap-4" style={{ marginBottom: '2rem' }}>
          <Truck className="text-primary" size={48} />
          <h2 className="text-2xl font-bold">Driver Portal</h2>
          <p className="text-sm text-center">Login to manage your routes and shipments.</p>
        </div>
        
        {error && <div className="text-error" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="btn-primary flex justify-center items-center gap-2" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
            {loading ? <Loader className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm">
          Don't have an account? <Link to="/register/driver">Register as Driver</Link>
        </p>
      </div>
    </div>
  );
}
