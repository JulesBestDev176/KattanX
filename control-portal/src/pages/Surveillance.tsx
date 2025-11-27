import React, { useState } from 'react';
import { VideoGrid } from '../components/surveillance/VideoGrid';
import { AIAnalysisPanel } from '../components/surveillance/AIAnalysisPanel';
import type { CameraFeed } from '../types';

export const Surveillance: React.FC = () => {
  // Simulated data
  const feeds: CameraFeed[] = [
    {
      id: 'cam-01',
      name: 'Corniche Ouest - Zone A',
      location: 'Dakar, Corniche',
      status: 'online',
      thumbnailUrl: '',
      detectedEvents: [
        { type: 'Accident de la circulation', confidence: 0.92, timestamp: new Date().toISOString() }
      ]
    },
    {
      id: 'cam-02',
      name: 'Place de l\'Indépendance',
      location: 'Dakar Plateau',
      status: 'online',
      thumbnailUrl: '',
      detectedEvents: []
    },
    {
      id: 'cam-03',
      name: 'Marché Sandaga - Entrée Nord',
      location: 'Dakar Centre',
      status: 'online',
      thumbnailUrl: '',
      detectedEvents: [
        { type: 'Foule suspecte', confidence: 0.78, timestamp: new Date().toISOString() }
      ]
    },
    {
      id: 'cam-04',
      name: 'Autoroute Péage - Sortie 4',
      location: 'Autoroute',
      status: 'offline',
      thumbnailUrl: '',
      detectedEvents: []
    },
    {
      id: 'cam-05',
      name: 'Monument Renaissance',
      location: 'Ouakam',
      status: 'online',
      thumbnailUrl: '',
      detectedEvents: []
    },
    {
      id: 'cam-06',
      name: 'Gare TER',
      location: 'Dakar',
      status: 'online',
      thumbnailUrl: '',
      detectedEvents: []
    }
  ];

  const [selectedFeed, setSelectedFeed] = useState<CameraFeed | null>(feeds[0]);

  return (
    <div className="surveillance-page">
      <div className="page-header">
        <h1>Surveillance et monitoring IA</h1>
        <p>Flux vidéo en direct avec détection de menaces en temps réel par IA.</p>
      </div>

      <div className="surveillance-layout">
        <div className="video-section">
          <div className="section-header">
            <h2>Flux en direct ({feeds.filter(f => f.status === 'online').length} En ligne)</h2>
            <div className="filters">
              <button className="filter-btn active">Tous</button>
              <button className="filter-btn">Alertes uniquement</button>
              <button className="filter-btn">Hors ligne</button>
            </div>
          </div>
          <VideoGrid 
            feeds={feeds} 
            onSelectFeed={setSelectedFeed} 
            selectedFeedId={selectedFeed?.id}
          />
        </div>
        
        <div className="ai-section">
          <AIAnalysisPanel feed={selectedFeed} />
        </div>
      </div>

      <style>{`
        .surveillance-page {
          height: calc(100vh - 140px); /* Adjust for header/padding */
          display: flex;
          flex-direction: column;
        }

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

        .surveillance-layout {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
          min-height: 0; /* Important for scrolling */
        }

        .video-section {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding-right: 1rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .filters {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          border: 1px solid var(--border);
          background: white;
          font-size: 0.85rem;
          color: var(--muted-foreground);
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .filter-btn.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .ai-section {
          height: 100%;
          position: sticky;
          top: 0;
        }
      `}</style>
    </div>
  );
};
