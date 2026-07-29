import { ShieldCheck, Users, Package, Map, Activity, Clock, AlertTriangle, LineChart } from 'lucide-react';

export default function LandingPage() {
  const agents = [
    { title: 'Document Verification', icon: <ShieldCheck size={32} className="text-secondary" /> },
    { title: 'Driver Recommendation', icon: <Users size={32} className="text-primary" /> },
    { title: 'Shipment Recommendation', icon: <Package size={32} className="text-accent" /> },
    { title: 'Route Optimization', icon: <Map size={32} className="text-secondary" /> },
    { title: 'Route Simulation', icon: <Activity size={32} className="text-warning" /> },
    { title: 'ETA Prediction', icon: <Clock size={32} className="text-primary" /> },
    { title: 'Risk Prediction', icon: <AlertTriangle size={32} className="text-error" /> },
    { title: 'Logistics Insights', icon: <LineChart size={32} className="text-accent" /> },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container">
          <h1 className="text-4xl" style={{ marginBottom: '1.5rem', color: 'var(--color-heading)' }}>
            The Future of <span className="text-primary">Multi-Agent Logistics</span>
          </h1>
          <p className="text-xl" style={{ maxWidth: '600px', margin: '0 auto 2rem auto', color: 'var(--color-body)' }}>
            Empowering drivers and shippers with an intelligent, multi-agent AI orchestration platform.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <h2 className="text-3xl text-center" style={{ marginBottom: '3rem' }}>Powered by 8 Intelligent Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {agents.map((agent, idx) => (
              <div key={idx} className="card flex flex-col items-center text-center gap-4">
                {agent.icon}
                <h3 className="text-lg">{agent.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Agent Workflow Timeline */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <h2 className="text-3xl text-center" style={{ marginBottom: '3rem' }}>Multi-Agent Workflow</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '2px', backgroundColor: 'var(--color-border)' }}></div>
            {['Document Verification', 'Driver & Shipment Matching', 'Route Planning & Simulation', 'In-Transit Monitoring & Insights'].map((step, idx) => (
              <div key={idx} style={{ paddingLeft: '3rem', position: 'relative', marginBottom: '2rem' }}>
                <div style={{ position: 'absolute', left: '11px', top: '5px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', border: '4px solid var(--color-background)' }}></div>
                <h3 className="text-xl" style={{ marginBottom: '0.5rem' }}>Phase {idx + 1}: {step}</h3>
                <p>Intelligent agents coordinate seamlessly to ensure efficient execution of {step.toLowerCase()}.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--color-surface)', padding: '2rem 0', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
        <p>© 2026 SupplySync AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
