import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Map, Activity, Clock, AlertTriangle, Loader, Package } from 'lucide-react';

export default function ShipmentTracking() {
  const { id } = useParams();
  const { token } = useAuth();
  
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/shipments/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        
        if (!response.ok) throw new Error(result.detail || 'Failed to fetch shipment');
        
        setShipment(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShipment();
  }, [id, token]);

  if (loading) return <div className="container flex justify-center items-center" style={{ minHeight: '50vh' }}><Loader className="animate-spin text-primary" size={48} /></div>;
  if (error) return <div className="container text-error">{error}</div>;
  if (!shipment) return <div className="container">Shipment not found.</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="text-primary" /> Shipment Tracking
        </h1>
        <span className={`badge ${shipment.status === 'In Transit' ? 'bg-primary' : shipment.status === 'Delivered' ? 'bg-success' : 'bg-secondary'}`} style={{ padding: '0.5rem 1rem', borderRadius: '20px', color: 'white', fontWeight: 'bold' }}>
          {shipment.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>Details</h2>
            <div className="flex flex-col gap-2 text-sm">
              <p><span className="text-body font-bold">From:</span> {shipment.pickupLocation}</p>
              <p><span className="text-body font-bold">To:</span> {shipment.dropLocation}</p>
              <p><span className="text-body font-bold">Cargo:</span> {shipment.cargoType} ({shipment.cargoWeight}T)</p>
              <p><span className="text-body font-bold">Vehicle:</span> {shipment.vehicleType}</p>
              <p><span className="text-body font-bold">Created:</span> {new Date(shipment.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Route Info */}
          <div className="card flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <Map className="text-secondary" />
              <h3 className="font-bold text-lg">Route Agent</h3>
            </div>
            {shipment.routeData ? (
              <div className="text-sm">
                <p><strong>Distance:</strong> {shipment.routeData.distance || 'N/A'}</p>
                <p><strong>Duration:</strong> {shipment.routeData.duration || 'N/A'}</p>
                <p><strong>Path:</strong> {shipment.routeData.path?.join(' -> ') || 'Optimized Path Generated'}</p>
              </div>
            ) : <p className="text-sm text-body">Route not generated yet.</p>}
          </div>

          {/* Simulation */}
          <div className="card flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-warning" />
              <h3 className="font-bold text-lg">Simulation Agent</h3>
            </div>
            {shipment.simulationData ? (
              <div className="text-sm">
                <p><strong>Weather Impact:</strong> {shipment.simulationData.weather_impact || 'Clear'}</p>
                <p><strong>Traffic Delay:</strong> {shipment.simulationData.traffic_delay_minutes || 0} mins</p>
                <p><strong>Overall Status:</strong> {shipment.simulationData.status || 'Optimal'}</p>
              </div>
            ) : <p className="text-sm text-body">Simulation pending.</p>}
          </div>

          {/* ETA */}
          <div className="card flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-primary" />
              <h3 className="font-bold text-lg">ETA Agent</h3>
            </div>
            {shipment.etaData ? (
              <div className="text-sm">
                <p className="text-2xl font-bold text-primary mb-1">{shipment.etaData.predicted_eta || 'Calculating...'}</p>
                <p><strong>Confidence:</strong> {shipment.etaData.confidence_score || 0}%</p>
              </div>
            ) : <p className="text-sm text-body">ETA pending.</p>}
          </div>

          {/* Risk */}
          <div className="card flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={shipment.riskData?.risk_level === 'High' ? 'text-error' : 'text-accent'} />
              <h3 className="font-bold text-lg">Risk Agent</h3>
            </div>
            {shipment.riskData ? (
              <div className="text-sm">
                <p><strong>Risk Level:</strong> <span className={`font-bold ${shipment.riskData.risk_level === 'High' ? 'text-error' : 'text-success'}`}>{shipment.riskData.risk_level || 'Low'}</span></p>
                <p><strong>Factors:</strong> {shipment.riskData.factors?.join(', ') || 'None'}</p>
                <p><strong>Recommendation:</strong> {shipment.riskData.recommendation || 'Proceed safely'}</p>
              </div>
            ) : <p className="text-sm text-body">Risk evaluation pending.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
