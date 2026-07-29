import { LayoutDashboard } from 'lucide-react';

export default function DashboardPlaceholder() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <div className="flex flex-col items-center gap-4">
        <LayoutDashboard size={64} className="text-primary" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-xl">Welcome to the SupplySync AI Orchestrator.</p>
        <div className="card" style={{ marginTop: '2rem', maxWidth: '600px', margin: '2rem auto' }}>
          <p>
            This is a placeholder dashboard. In future phases, this dashboard will 
            integrate data from all 8 agents (Document Verification, Route Optimization, etc.) 
            and provide actionable logistics insights.
          </p>
        </div>
      </div>
    </div>
  );
}
