import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Truck, Check, Loader, Trophy, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CreateShipment() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [formData, setFormData] = useState({
    pickupLocation: '', dropLocation: '', cargoType: '', cargoWeight: '', vehicleType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [shipmentId, setShipmentId] = useState(null);
  const [topRecommendations, setTopRecommendations] = useState([]);
  const [otherDrivers, setOtherDrivers] = useState([]);
  const [searchedCity, setSearchedCity] = useState('');
  const [assigning, setAssigning] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSearchedCity(formData.pickupLocation);
    
    try {
      const response = await fetch('http://localhost:8000/api/shipments/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, cargoWeight: parseFloat(formData.cargoWeight) })
      });
      
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.detail || 'Failed to create shipment');
      
      setShipmentId(result.id);
      
      // Load new AI recommendations structure
      if (result.topRecommendations || result.otherDrivers) {
        setTopRecommendations(result.topRecommendations || []);
        setOtherDrivers(result.otherDrivers || []);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDriver = async (driver) => {
    setAssigning(true);
    try {
      const response = await fetch(`http://localhost:8000/api/shipments/${shipmentId}/assign-driver`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          driverId: driver.driverId,
          driverName: driver.driverName,
          vehicleNumber: driver.vehicleNumber,
          vehicleType: driver.vehicleType
        })
      });
      
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.detail || 'Failed to assign driver');
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setAssigning(false);
    }
  };

  const renderTopBadge = (rank) => {
    if (rank === 1) return <span className="badge bg-primary flex items-center gap-1" style={{ fontSize: '1rem', padding: '0.4rem 0.8rem' }}>🥇 AI Recommended #1</span>;
    if (rank === 2) return <span className="badge bg-secondary flex items-center gap-1" style={{ fontSize: '1rem', padding: '0.4rem 0.8rem' }}>🥈 AI Recommended #2</span>;
    if (rank === 3) return <span className="badge" style={{ backgroundColor: '#CD7F32', color: 'white', fontSize: '1rem', padding: '0.4rem 0.8rem' }}>🥉 AI Recommended #3</span>;
    return null;
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
      <h1 className="text-3xl font-bold flex items-center gap-2" style={{ marginBottom: '2rem' }}>
        <Package className="text-primary" /> Create New Shipment
      </h1>
      
      {error && <div className="text-error" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>{error}</div>}
      
      {!shipmentId ? (
        <div className="card" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label className="text-sm">Pickup Location (City)</label>
              <input type="text" name="pickupLocation" required onChange={handleChange} placeholder="e.g. Coimbatore" />
            </div>
            <div>
              <label className="text-sm">Drop Location (City)</label>
              <input type="text" name="dropLocation" required onChange={handleChange} placeholder="e.g. Chennai" />
            </div>
            <div>
              <label className="text-sm">Cargo Type</label>
              <input type="text" name="cargoType" required onChange={handleChange} placeholder="e.g. Electronics" />
            </div>
            <div>
              <label className="text-sm">Cargo Weight (Tons)</label>
              <input type="number" step="0.1" name="cargoWeight" required onChange={handleChange} placeholder="e.g. 5.5" />
            </div>
            <div>
              <label className="text-sm">Required Vehicle Type</label>
              <select name="vehicleType" required onChange={handleChange} defaultValue="">
                <option value="" disabled>Select Vehicle</option>
                <option value="Mini Truck">Mini Truck</option>
                <option value="Truck">Truck</option>
                <option value="Container">Container</option>
                <option value="Pickup Van">Pickup Van</option>
                <option value="Trailer">Trailer</option>
              </select>
            </div>
            
            <button type="submit" className="btn-primary flex justify-center items-center gap-2" disabled={loading}>
              {loading ? <Loader className="animate-spin" size={20} /> : 'Create and Find Drivers'}
            </button>
          </form>
        </div>
      ) : (
        <div className="animate-fade-in flex flex-col gap-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-success flex items-center gap-2">
              <Check /> Shipment Created Successfully!
            </h2>
          </div>
          
          {topRecommendations.length === 0 && otherDrivers.length === 0 ? (
            <div className="card" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--color-error)' }}>
              <h3 className="text-xl font-bold text-error flex items-center gap-2">
                <Info /> No Drivers Found
              </h3>
              <p className="mt-2 text-body">No verified drivers are currently available in {searchedCity}.</p>
            </div>
          ) : (
            <>
              {topRecommendations.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                    <Trophy className="text-primary" /> Top AI Recommended Drivers
                  </h3>
                  <div className="flex flex-col gap-6">
                    {topRecommendations.map((d) => (
                      <div key={d.driverId} className="card flex flex-col gap-4" style={{ backgroundColor: 'var(--color-background)', border: '2px solid var(--color-primary)' }}>
                        <div className="flex justify-between items-start">
                          <div>
                            {renderTopBadge(d.rank)}
                            <h3 className="font-bold text-2xl mt-4">{d.driverId} - {d.driverName}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-body">AI Recommendation Score</p>
                            <p className="text-3xl font-bold text-accent">{d.recommendationScore}%</p>
                          </div>
                        </div>
                        
                        <div className="p-4" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--color-success)' }}>
                          <p className="text-sm font-bold flex items-center gap-1"><Info size={16} /> AI Insight</p>
                          <p className="text-sm italic mt-1">"{d.aiReason}"</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-2">
                          <p><span className="text-body block text-xs">Current City</span> <span className="font-bold">{d.currentCity}</span></p>
                          <p><span className="text-body block text-xs">Experience</span> <span className="font-bold">{d.experienceYears} Years</span></p>
                          <p><span className="text-body block text-xs">Completed Trips</span> <span className="font-bold">{d.completedTrips}</span></p>
                          <p><span className="text-body block text-xs">Overall Rating</span> <span className="font-bold text-accent">★ {d.overallRating}</span></p>
                          <p><span className="text-body block text-xs">On-Time Delivery</span> <span className="font-bold text-success">{d.onTimePercentage}%</span></p>
                          <p><span className="text-body block text-xs">Safety Score</span> <span className="font-bold text-primary">{d.safetyScore}%</span></p>
                        </div>

                        <button 
                          onClick={() => handleAssignDriver(d)} 
                          className="btn-primary mt-2 w-full md:w-auto self-end"
                          disabled={assigning}
                        >
                          {assigning ? 'Assigning...' : 'Assign Driver'}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {otherDrivers.length > 0 && (
                <section className="mt-8">
                  <h3 className="text-xl font-bold text-body" style={{ marginBottom: '1.5rem' }}>
                    Other Drivers Available in {searchedCity}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {otherDrivers.map((d) => (
                      <div key={d.driverId} className="card flex flex-col gap-3" style={{ border: '1px solid var(--color-border)' }}>
                        <h4 className="font-bold text-lg">{d.driverId} - {d.driverName}</h4>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <p><span className="text-body block">Experience</span> <span className="font-bold">{d.experienceYears} Yrs</span></p>
                          <p><span className="text-body block">Trips</span> <span className="font-bold">{d.completedTrips}</span></p>
                          <p><span className="text-body block">Rating</span> <span className="font-bold">★ {d.overallRating}</span></p>
                          <p><span className="text-body block">AI Score</span> <span className="font-bold text-accent">{d.recommendationScore}%</span></p>
                        </div>

                        <button 
                          onClick={() => handleAssignDriver(d)} 
                          className="btn-secondary mt-2 w-full"
                          disabled={assigning}
                        >
                          {assigning ? 'Assigning...' : 'Assign Driver'}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
