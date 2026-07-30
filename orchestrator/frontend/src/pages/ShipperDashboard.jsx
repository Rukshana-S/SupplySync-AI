import { useAuth } from '../context/AuthContext';
import { User, Package, Plus } from 'lucide-react';

export default function ShipperDashboard() {
  const { user } = useAuth();

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
      <h1 className="text-3xl font-bold" style={{ marginBottom: '2rem' }}>Shipper Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <p className="text-sm">You have no active shipments currently in transit.</p>
          <button className="btn-secondary" style={{ marginTop: 'auto' }}>View All</button>
        </div>

        <div className="card flex flex-col gap-4" style={{ backgroundColor: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' }}>
          <div className="flex items-center gap-2">
            <Plus size={24} />
            <h2 className="text-xl font-bold text-white">New Shipment</h2>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Ready to send something? Create a new shipment request.</p>
          <button className="btn-secondary" style={{ marginTop: 'auto', backgroundColor: 'white', color: 'var(--color-primary)', border: 'none' }}>Create Shipment</button>
        </div>
      </div>
    </div>
  );
}
