import React from 'react';
import { MapPin, X } from 'lucide-react';
import type { Agent } from '../../types';

interface MapViewProps {
  agent: Agent | null;
  allAgents?: Agent[];
  onClose: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ agent, allAgents = [], onClose }) => {
  // Coordonnées par défaut (Dakar)
  const defaultCenter = { lat: 14.6928, lng: -17.4467 };
  const center = agent ? agent.location : defaultCenter;
  const zoom = 13;

  // Générer l'URL de la carte statique (OpenStreetMap)
  // Utilisation d'OpenStreetMap qui ne nécessite pas de clé API
  const getMapUrl = (lat: number, lng: number, markers: Array<{ lat: number; lng: number; label?: string; color?: string }>) => {
    // Utilisation d'OpenStreetMap Static Map (via une API tierce ou génération locale)
    // Pour cette démo, on utilise une image de carte simple avec OpenStreetMap
    const size = '800x600';
    const scale = 2;
    
    // Utiliser une API de carte statique gratuite (OpenStreetMap via StaticMap)
    // Alternative: utiliser Leaflet pour une carte interactive
    const baseUrl = 'https://staticmap.openstreetmap.de/staticmap.php';
    const markersParam = markers.map((m, i) => 
      `${m.lat},${m.lng},red,${m.label || String.fromCharCode(65 + i)}`
    ).join('|');
    
    // Si des marqueurs existent, les ajouter
    const markersQuery = markers.length > 0 ? `&markers=${markersParam}` : '';
    
    return `${baseUrl}?center=${lat},${lng}&zoom=${zoom}&size=${size}&scale=${scale}${markersQuery}`;
  };

  const markers: Array<{ lat: number; lng: number; label?: string; color?: string }> = [];
  
  if (agent) {
    // Marqueur pour l'agent sélectionné
    markers.push({
      lat: agent.location.lat,
      lng: agent.location.lng,
      label: agent.name.charAt(0),
      color: agent.status === 'available' ? '00ff00' : agent.status === 'busy' ? 'ffaa00' : '888888'
    });
  } else {
    // Afficher tous les agents
    allAgents.forEach((a, index) => {
      markers.push({
        lat: a.location.lat,
        lng: a.location.lng,
        label: a.name.charAt(0),
        color: a.status === 'available' ? '00ff00' : a.status === 'busy' ? 'ffaa00' : '888888'
      });
    });
  }

  const mapUrl = getMapUrl(center.lat, center.lng, markers);

  return (
    <div className="map-view-overlay" onClick={onClose}>
      <div className="map-view-content" onClick={(e) => e.stopPropagation()}>
        <div className="map-view-header">
          <h3>
            {agent ? `Localisation de ${agent.name}` : 'Carte des agents'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="map-container">
          <div className="map-wrapper">
            <img 
              src={mapUrl} 
              alt="Carte"
              className="map-image"
              onError={(e) => {
                // Fallback si l'image ne charge pas
                (e.target as HTMLImageElement).style.display = 'none';
                const wrapper = (e.target as HTMLImageElement).parentElement;
                if (wrapper) {
                  const fallback = document.createElement('div');
                  fallback.className = 'map-fallback';
                  fallback.style.display = 'flex';
                  fallback.innerHTML = `
                    <div style="padding: 2rem; text-align: center; width: 100%;">
                      <p style="color: var(--muted-foreground); margin-bottom: 1rem;">
                        Carte non disponible. Coordonnées:
                      </p>
                      <p style="font-family: monospace; font-size: 1.1rem; margin-bottom: 1.5rem;">
                        ${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}
                      </p>
                      <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: center;">
                        ${agent ? `
                          <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--muted); border-radius: var(--radius);">
                            <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${agent.status === 'available' ? '#00ff00' : agent.status === 'busy' ? '#ffaa00' : '#888888'};"></div>
                            <span style="font-weight: 600;">${agent.name}</span>
                            <span style="color: var(--muted-foreground); font-size: 0.9rem;">${agent.location.lat.toFixed(4)}, ${agent.location.lng.toFixed(4)}</span>
                          </div>
                        ` : allAgents.map(a => `
                          <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--muted); border-radius: var(--radius); width: 100%; max-width: 400px;">
                            <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${a.status === 'available' ? '#00ff00' : a.status === 'busy' ? '#ffaa00' : '#888888'}; flex-shrink: 0;"></div>
                            <div style="flex: 1;">
                              <div style="font-weight: 600;">${a.name}</div>
                              <div style="color: var(--muted-foreground); font-size: 0.85rem;">${a.location.lat.toFixed(4)}, ${a.location.lng.toFixed(4)}</div>
                            </div>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  `;
                  wrapper.appendChild(fallback);
                }
              }}
            />
          </div>
          
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-dot available"></div>
              <span>Disponible</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot busy"></div>
              <span>Occupé</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot offline"></div>
              <span>Hors ligne</span>
            </div>
          </div>

          {agent && (
            <div className="map-agent-info">
              <h4>{agent.name}</h4>
              <p>{agent.specialty}</p>
              <p className="coordinates">
                <MapPin size={14} />
                {agent.location.lat.toFixed(6)}, {agent.location.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .map-view-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 2rem;
        }

        .map-view-content {
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          max-width: 1000px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        .map-view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .map-view-header h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--muted-foreground);
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: var(--foreground);
        }

        .map-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .map-wrapper {
          flex: 1;
          position: relative;
          background-color: #e5e7eb;
          overflow: hidden;
        }

        .map-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .map-fallback {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .map-legend {
          display: flex;
          gap: 1.5rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border);
          background-color: var(--muted);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--foreground);
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-dot.available {
          background-color: var(--secondary);
        }

        .legend-dot.busy {
          background-color: var(--warning);
        }

        .legend-dot.offline {
          background-color: var(--muted-foreground);
        }

        .map-agent-info {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border);
          background-color: white;
        }

        .map-agent-info h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 0.5rem;
        }

        .map-agent-info p {
          font-size: 0.9rem;
          color: var(--muted-foreground);
          margin-bottom: 0.25rem;
        }

        .map-agent-info .coordinates {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: monospace;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};

