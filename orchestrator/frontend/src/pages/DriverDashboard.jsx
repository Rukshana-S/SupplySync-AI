import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Truck, CheckCircle, Loader, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DriverDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/shipments/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setShipments(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch shipments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [token]);

  const handleAction = async (id, action) => {
    try {
      const response = await fetch(`http://localhost:8000/api/shipments/${id}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        if (action === 'accept') {
          navigate(`/shipments/${id}`); // Redirect to tracking page to see AI results
        } else {
          fetchShipments(); // Refresh list if rejected
        }
      }
    } catch (err) {
      console.error(`Failed to ${action} shipment`, err);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
      <h1 className="text-3xl font-bold" style={{ marginBottom: '2rem' }}>Driver Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: '3rem' }}>
        <div className="card flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <User className="text-primary" size={24} />
            <h2 className="text-xl font-bold">Welcome, {user?.full_name}</h2>
          </div>
          <p className="text-sm">Manage your profile and settings here.</p>
          <button className="btn-secondary" style={{ marginTop: 'auto' }}>View Profile</button>
        </div>

        <div className="card flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-success" size={24} />
            <h2 className="text-xl font-bold">Availability</h2>
          </div>
          <p className="text-sm text-success">You are currently marked as AVAILABLE.</p>
          <button className="btn-secondary" style={{ marginTop: 'auto' }}>Change Status</button>
        </div>

        <div className="card flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Truck className="text-secondary" size={24} />
            <h2 className="text-xl font-bold">Assigned Shipments</h2>
          </div>
          <p className="text-sm">You have {shipments.length} active shipment(s).</p>
          <button className="btn-primary" style={{ marginTop: 'auto' }}>View History</button>
        </div>
      </div>

      <h2 className="text-2xl font-bold" style={{ marginBottom: '1.5rem' }}>Assigned Loads</h2>
      {loading ? (
        <div className="flex justify-center py-8"><Loader className="animate-spin text-primary" size={32} /></div>
      ) : shipments.length === 0 ? (
        <div className="card text-center text-body">No active loads assigned to you right now.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {shipments.map(s => (
            <div key={s._id} className="card flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${s.status === 'Driver Assigned' ? 'bg-warning' : 'bg-success'}`} style={{ padding: '0.25rem 0.5rem', borderRadius: '10px', color: 'white', fontSize: '0.75rem' }}>
                    {s.status}
                  </span>
                  <span className="font-bold">{s.cargoType} ({s.cargoWeight}T)</span>
                </div>
                <p className="text-sm text-body flex items-center gap-1"><MapPin size={14} /> {s.pickupLocation} &rarr; {s.dropLocation}</p>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                {s.status === 'Driver Assigned' ? (
                  <>
                    <button onClick={() => handleAction(s._id, 'accept')} className="btn-primary flex-1 md:flex-none">Accept</button>
                    <button onClick={() => handleAction(s._id, 'reject')} className="btn-secondary flex-1 md:flex-none text-error border-error">Reject</button>
                  </>
                ) : (
                  <button onClick={() => navigate(`/shipments/${s._id}`)} className="btn-primary flex-1 md:flex-none">Track Shipment</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
