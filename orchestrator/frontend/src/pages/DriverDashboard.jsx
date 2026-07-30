import { useAuth } from '../context/AuthContext';
import { User, Truck, CheckCircle } from 'lucide-react';

export default function DriverDashboard() {
  const { user } = useAuth();

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
      <h1 className="text-3xl font-bold" style={{ marginBottom: '2rem' }}>Driver Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <p className="text-sm">You have no active shipments at the moment.</p>
          <button className="btn-primary" style={{ marginTop: 'auto' }}>View History</button>
        </div>
      </div>
    </div>
  );
}
