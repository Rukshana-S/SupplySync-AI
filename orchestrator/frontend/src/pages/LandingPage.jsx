import { ShieldCheck, Users, Package, Map, Activity, Clock, AlertTriangle, LineChart, Cpu, Network, Database } from 'lucide-react';

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
          <h1 className="text-5xl font-bold" style={{ marginBottom: '1.5rem', color: 'var(--color-heading)' }}>
            The Future of <span className="text-primary">Multi-Agent Logistics</span>
          </h1>
          <p className="text-xl" style={{ maxWidth: '600px', margin: '0 auto 2.5rem auto', color: 'var(--color-body)' }}>
            Empowering drivers and shippers with an intelligent, multi-agent AI orchestration platform. Automate matching, optimize routes, and predict risks in real-time.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>Get Started</button>
            <button className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>View Architecture</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 className="text-3xl font-bold" style={{ marginBottom: '1rem' }}>Powered by 8 Intelligent Agents</h2>
            <p className="text-lg" style={{ maxWidth: '600px', margin: '0 auto' }}>A distributed ecosystem of specialized AI models working in harmony.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent, idx) => (
              <div key={idx} className="card flex flex-col items-center text-center gap-4" style={{ padding: '2rem 1.5rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-background)', borderRadius: '50%' }}>
                  {agent.icon}
                </div>
                <h3 className="text-lg font-bold">{agent.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 className="text-3xl font-bold text-center" style={{ marginBottom: '4rem' }}>How SupplySync AI Works</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '23px', top: '0', bottom: '0', width: '2px', backgroundColor: 'var(--color-border)' }}></div>
            
            {[
              { title: 'Onboarding & Verification', desc: 'Drivers upload their RC Book and Driving License. Our AI instantly verifies documents using OCR and Groq-powered analysis to ensure compliance.' },
              { title: 'Intelligent Matching', desc: 'Shippers post loads, and our recommendation agents analyze driver history, location, and capacity to propose optimal pairings.' },
              { title: 'Route Optimization & Simulation', desc: 'Once paired, the platform generates the fastest route and simulates traffic and weather conditions before the journey begins.' },
              { title: 'In-Transit Monitoring', desc: 'ETA prediction and Risk agents continuously monitor the shipment, proactively alerting stakeholders to potential delays.' }
            ].map((step, idx) => (
              <div key={idx} style={{ paddingLeft: '4rem', position: 'relative', marginBottom: '3rem' }}>
                <div style={{ position: 'absolute', left: '12px', top: '5px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', border: '4px solid var(--color-background)', zIndex: 10 }}></div>
                <h3 className="text-2xl font-bold" style={{ marginBottom: '0.75rem' }}>Phase {idx + 1}: {step.title}</h3>
                <p className="text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-surface)' }}>
        <div className="container text-center">
          <h2 className="text-3xl font-bold" style={{ marginBottom: '1.5rem' }}>Microservice Architecture</h2>
          <p className="text-lg" style={{ maxWidth: '700px', margin: '0 auto 4rem auto' }}>
            SupplySync AI is built on a robust, scalable microservice architecture. The Orchestrator acts as the central hub, managing state and authentication while communicating asynchronously with specialized, independent agent services.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-4">
              <Cpu size={48} className="text-accent" />
              <h3 className="text-xl font-bold">Independent Agents</h3>
              <p>Each AI capability is deployed as an independent FastAPI microservice.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Network size={48} className="text-primary" />
              <h3 className="text-xl font-bold">Central Orchestrator</h3>
              <p>A unified React frontend and FastAPI backend orchestrating the ecosystem.</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Database size={48} className="text-secondary" />
              <h3 className="text-xl font-bold">MongoDB Atlas</h3>
              <p>Centralized state management storing users, shipments, and agent reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--color-background)', padding: '3rem 0', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
        <div className="container flex flex-col items-center gap-4">
          <div className="flex items-center gap-2" style={{ color: 'var(--color-heading)' }}>
            <Map className="text-primary" size={24} />
            <span className="font-bold text-xl">SupplySync AI</span>
          </div>
          <p className="text-sm">© 2026 SupplySync AI Orchestrator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
