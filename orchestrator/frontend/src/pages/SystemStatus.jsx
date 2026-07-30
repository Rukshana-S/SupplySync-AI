import { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function SystemStatus() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/agents/status');
      const data = await res.json();
      if (data.success) {
        setAgents(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch agent status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Ping every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Healthy':
        return <CheckCircle className="text-success" size={20} />;
      case 'Offline':
      case 'Disconnected':
        return <XCircle className="text-error" size={20} />;
      default:
        return <AlertCircle className="text-warning" size={20} />;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="text-primary" size={32} /> System Status
        </h1>
        <button onClick={fetchStatus} disabled={loading} className="btn-secondary flex items-center gap-2">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Agent Name</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Service URL</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Health Endpoint</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '1rem' }}>{agent.name}</td>
                <td style={{ padding: '1rem', color: 'var(--color-primary)' }}>{agent.base_url}</td>
                <td style={{ padding: '1rem' }}>{agent.health_endpoint}</td>
                <td style={{ padding: '1rem' }}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(agent.status)}
                    <span className={
                      agent.status === 'Healthy' ? 'text-success' : 
                      agent.status === 'Offline' || agent.status === 'Disconnected' ? 'text-error' : 'text-warning'
                    }>
                      {agent.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {agents.length === 0 && !loading && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No agents found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
