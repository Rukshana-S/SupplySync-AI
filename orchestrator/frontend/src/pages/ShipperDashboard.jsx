import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Package, Plus, Loader, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ShipperDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    
    fetchShipments();
  }, [token]);

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
      <h1 className="text-3xl font-bold" style={{ marginBottom: '2rem' }}>Shipper Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: '3rem' }}>
        <div className="card flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <User className="text-accent" size={24} />
            <h2 className="text-xl font-bold">Welcome, {user?.full_name}</h2>
          </div>
          <p className="text-sm">Manage your profile and organization settings here.</p>
          <button className="btn-secondary" style={{ marginTop: 'auto' }}>View Profile</button>
        </div>

        <div className="card flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Package className="text-primary" size={24} />
            <h2 className="text-xl font-bold">My Shipments</h2>
          </div>
          <p className="text-sm">You have {shipments.length} total shipment(s) in the system.</p>
          <button className="btn-secondary" style={{ marginTop: 'auto' }}>View All</button>
        </div>

        <div className="card flex flex-col gap-4" style={{ backgroundColor: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' }}>
          <div className="flex items-center gap-2">
            <Plus size={24} />
            <h2 className="text-xl font-bold text-white">New Shipment</h2>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Ready to send something? Create a new shipment request.</p>
          <Link to="/shipments/create" style={{ marginTop: 'auto' }}>
            <button className="btn-secondary" style={{ width: '100%', backgroundColor: 'white', color: 'var(--color-primary)', border: 'none' }}>Create Shipment</button>
          </Link>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold" style={{ marginBottom: '1.5rem' }}>Recent Shipments</h2>
      {loading ? (
        <div className="flex justify-center py-8"><Loader className="animate-spin text-primary" size={32} /></div>
      ) : shipments.length === 0 ? (
        <div className="card text-center text-body">No shipments found. Create one to get started!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shipments.map(s => (
            <div key={s._id} className="card flex justify-between items-center hover:border-primary transition-colors cursor-pointer" onClick={() => navigate(`/shipments/${s._id}`)}>
              <div>
                <p className="font-bold text-lg mb-1">{s.cargoType} ({s.cargoWeight}T)</p>
                <p className="text-sm text-body flex items-center gap-1"><MapPin size={14} /> {s.pickupLocation} &rarr; {s.dropLocation}</p>
              </div>
              <div className="text-right">
                <span className={`badge ${s.status === 'Created' ? 'bg-secondary' : 'bg-primary'}`} style={{ padding: '0.25rem 0.75rem', borderRadius: '15px', color: 'white', fontSize: '0.8rem' }}>
                  {s.status}
                </span>
                {s.assignedDriverName && (
                  <div className="mt-2 text-xs">
                    <p className="font-bold text-accent" style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Driver: {s.assignedDriverName}
                    </p>
                    <p className="text-body mt-1">Vehicle: {s.assignedVehicleType || 'N/A'}</p>
                    <p className="text-body mt-1">No: {s.assignedVehicleNumber || 'N/A'}</p>
                  </div>
                )}
                <p className="text-xs text-body mt-1">{new Date(s.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
