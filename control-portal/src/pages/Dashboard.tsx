import React from 'react';
import { AlertTriangle, Users, Video, Activity } from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { AlertsList } from '../components/dashboard/AlertsList';
import type { Alert } from '../types';

export const Dashboard: React.FC = () => {
  // Simulated data
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'accident',
      severity: 'high',
      location: { lat: 14.6928, lng: -17.4467, address: 'Corniche Ouest, Dakar' },
      description: 'Collision multi-véhicules signalée. Circulation bloquée.',
      status: 'new',
      timestamp: new Date().toISOString(),
      source: 'citizen',
    },
    {
      id: '2',
      type: 'fire',
      severity: 'critical',
      location: { lat: 14.7167, lng: -17.4677, address: 'Marché Sandaga' },
      description: 'Fumée détectée dans le secteur B. Risque d\'incendie.',
      status: 'investigating',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      source: 'sensor',
    },
    {
      id: '3',
      type: 'theft',
      severity: 'medium',
      location: { lat: 14.7319, lng: -17.4572, address: 'Plateau, Rue Carnot' },
      description: 'Activité suspecte signalée près d\'un distributeur bancaire.',
      status: 'new',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      source: 'camera',
    },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Vue d'ensemble du tableau de bord</h1>
        <p>Surveillance en temps réel et statut du centre de contrôle.</p>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Alertes actives"
          value="12"
          icon={AlertTriangle}
          trend="+2 depuis la dernière heure"
          trendUp={false}
          color="var(--destructive)"
        />
        <StatsCard
          title="Agents actifs"
          value="45"
          icon={Users}
          trend="85% déployés"
          trendUp={true}
          color="var(--secondary)"
        />
        <StatsCard
          title="Caméras en ligne"
          value="128/130"
          icon={Video}
          trend="98% disponibilité"
          trendUp={true}
          color="var(--primary)"
        />
        <StatsCard
          title="Détections IA"
          value="24"
          icon={Activity}
          trend="Confiance élevée"
          trendUp={true}
          color="#8b5cf6"
        />
      </div>

      <div className="dashboard-grid">
        <div className="main-col">
          <div className="map-placeholder">
            <h3>Vue carte en direct</h3>
            <div className="map-mockup">
              <div className="map-pin" style={{ top: '30%', left: '40%' }}></div>
              <div className="map-pin" style={{ top: '60%', left: '70%' }}></div>
              <div className="map-pin" style={{ top: '45%', left: '20%' }}></div>
            </div>
          </div>
        </div>
        <div className="side-col">
          <AlertsList alerts={alerts} />
        </div>
      </div>

      <style>{`
        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary);
        }

        .page-header p {
          color: var(--muted-foreground);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          height: 600px;
        }

        .map-placeholder {
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          padding: 1.5rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .map-mockup {
          flex: 1;
          background-color: #e5e7eb;
          border-radius: var(--radius);
          margin-top: 1rem;
          position: relative;
          background-image: url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-17.4467,14.6928,12,0/800x600?access_token=YOUR_TOKEN');
          background-size: cover;
          background-position: center;
        }
        
        /* Fallback if image doesn't load */
        .map-mockup {
          background-color: #cbd5e1;
        }

        .map-pin {
          width: 20px;
          height: 20px;
          background-color: var(--destructive);
          border: 3px solid white;
          border-radius: 50%;
          position: absolute;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
};
