import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DriverRegistration() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', phone_number: '', 
    age: '', vehicle_type: '', vehicle_capacity: '', current_location: ''
  });
  
  const [rcBook, setRcBook] = useState(null);
  const [drivingLicense, setDrivingLicense] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!rcBook || !drivingLicense) {
      setError('Please upload both RC Book (PDF) and Driving License (Image/PDF)');
      return;
    }
    
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('rc_book', rcBook);
      data.append('driving_license', drivingLicense);
      
      const response = await fetch('http://localhost:8000/api/auth/register-driver', {
        method: 'POST',
        body: data,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.detail || 'Registration failed');
      }
      
      // On success, we could auto-login, but for now we just redirect to login
      navigate('/login/driver');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-box" style={{ maxWidth: '600px' }}>
        <div className="flex flex-col items-center gap-4" style={{ marginBottom: '2rem' }}>
          <Truck className="text-primary" size={48} />
          <h2 className="text-2xl font-bold">Driver Registration</h2>
          <p className="text-sm text-center">Join the network and start driving.</p>
        </div>
        
        {error && <div className="text-error" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>{error}</div>}
        
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="full_name" placeholder="Full Name" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <input type="tel" name="phone_number" placeholder="Phone Number" required onChange={handleChange} />
          <input type="number" name="age" placeholder="Age" required onChange={handleChange} />
          <select name="vehicle_type" required onChange={handleChange} defaultValue="">
            <option value="" disabled>Select Vehicle Type</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Car">Car</option>
          </select>
          <input type="number" step="0.1" name="vehicle_capacity" placeholder="Vehicle Capacity (Tons)" required onChange={handleChange} />
          <input type="text" name="current_location" placeholder="Current Location (e.g. City)" required onChange={handleChange} />
          
          <div className="md:col-span-2">
            <label className="text-sm" style={{ display: 'block', marginBottom: '0.5rem' }}>Upload RC Book (PDF Only)</label>
            <input type="file" accept="application/pdf" required onChange={(e) => setRcBook(e.target.files[0])} />
          </div>
          
          <div className="md:col-span-2">
            <label className="text-sm" style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Driving License (Image/PDF)</label>
            <input type="file" accept="image/*,application/pdf" required onChange={(e) => setDrivingLicense(e.target.files[0])} />
          </div>

          <button type="submit" className="btn-primary md:col-span-2 flex justify-center items-center gap-2" disabled={loading}>
            {loading ? <Loader className="animate-spin" size={20} /> : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm" style={{ marginTop: '1.5rem' }}>
          Already have an account? <Link to="/login/driver">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
