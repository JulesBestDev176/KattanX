import React, { useState } from 'react';
import { Users, MapPin, Radio, Search, X, Phone, Mail, Navigation } from 'lucide-react';
import type { Agent, Alert, Mission } from '../types';
import { MapView } from '../components/agents/MapView';
import { AssignMissionModal } from '../components/agents/AssignMissionModal';

export const Agents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Agent['status']>('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showMap, setShowMap] = useState<Agent | null>(null);
  const [showAssignModal, setShowAssignModal] = useState<Agent | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);

  // Données simulées
  const allAgents: Agent[] = [
    {
      id: 'agent-1',
      name: 'Diallo Mamadou',
      status: 'available',
      location: { lat: 14.6928, lng: -17.4467 },
      specialty: 'Police - Brigade de circulation',
    },
    {
      id: 'agent-2',
      name: 'Ndiaye Fatou',
      status: 'busy',
      location: { lat: 14.7167, lng: -17.4677 },
      specialty: 'Gendarmerie - Patrouille',
    },
    {
      id: 'agent-3',
      name: 'Sow Amadou',
      status: 'available',
      location: { lat: 14.7319, lng: -17.4572 },
      specialty: 'Police - Sécurité publique',
    },
    {
      id: 'agent-4',
      name: 'Ba Khady',
      status: 'offline',
      location: { lat: 14.7000, lng: -17.4500 },
      specialty: 'Douane - Contrôle routier',
    },
    {
      id: 'agent-5',
      name: 'Fall Ibrahima',
      status: 'available',
      location: { lat: 14.7100, lng: -17.4600 },
      specialty: 'Police - Intervention rapide',
    },
    {
      id: 'agent-6',
      name: 'Diop Aissatou',
      status: 'busy',
      location: { lat: 14.7200, lng: -17.4700 },
      specialty: 'Gendarmerie - Enquêtes',
    },
    {
      id: 'agent-7',
      name: 'Thiam Ousmane',
      status: 'available',
      location: { lat: 14.6900, lng: -17.4400 },
      specialty: 'Police - Sécurité routière',
    },
    {
      id: 'agent-8',
      name: 'Kane Mariama',
      status: 'offline',
      location: { lat: 14.7300, lng: -17.4800 },
      specialty: 'Douane - Port',
    },
  ];

  const getStatusLabel = (status: Agent['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'busy': return 'Occupé';
      case 'offline': return 'Hors ligne';
      default: return status;
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'available': return 'var(--secondary)';
      case 'busy': return 'var(--warning)';
      case 'offline': return 'var(--muted-foreground)';
      default: return 'var(--muted-foreground)';
    }
  };

  // Filtrage
  const filteredAgents = allAgents.filter(agent => {
    const matchesSearch = searchQuery === '' || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Récupérer les alertes disponibles (simulées)
  const availableAlerts: Alert[] = [
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
      status: 'new',
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
  ].filter(a => a.status === 'new'); // Seulement les nouvelles alertes

  const stats = {
    total: allAgents.length,
    available: allAgents.filter(a => a.status === 'available').length,
    busy: allAgents.filter(a => a.status === 'busy').length,
    offline: allAgents.filter(a => a.status === 'offline').length,
  };

  const handleAssignMission = (missionData: Omit<Mission, 'id' | 'assignedAt' | 'status'>) => {
    const newMission: Mission = {
      ...missionData,
      id: `mission-${Date.now()}`,
      assignedAt: new Date().toISOString(),
      status: 'assigned',
    };
    
    setMissions([...missions, newMission]);
    
    // Mettre à jour le statut de l'agent
    const agentIndex = allAgents.findIndex(a => a.id === missionData.agentId);
    if (agentIndex !== -1) {
      allAgents[agentIndex].status = 'busy';
    }
    
    // Mettre à jour le statut de l'alerte si liée
    if (missionData.alertId) {
      const alertIndex = availableAlerts.findIndex(a => a.id === missionData.alertId);
      if (alertIndex !== -1) {
        availableAlerts[alertIndex].status = 'investigating';
      }
    }
    
    console.log('Mission assignée:', newMission);
    alert(`Mission assignée avec succès à ${missionData.agentName}`);
  };

  return (
    <div className="agents-page">
      <div className="page-header">
        <div>
          <h1>Gestion des agents</h1>
          <p>Suivi et déploiement des agents en temps réel</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <Users size={24} className="stat-icon" />
            <div>
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-dot available"></div>
            <div>
              <span className="stat-value">{stats.available}</span>
              <span className="stat-label">Disponibles</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-dot busy"></div>
            <div>
              <span className="stat-value">{stats.busy}</span>
              <span className="stat-label">Occupés</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-dot offline"></div>
            <div>
              <span className="stat-value">{stats.offline}</span>
              <span className="stat-label">Hors ligne</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un agent par nom ou spécialité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-search">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Statut</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
              <option value="all">Tous</option>
              <option value="available">Disponible</option>
              <option value="busy">Occupé</option>
              <option value="offline">Hors ligne</option>
            </select>
          </div>

          <button
            className="reset-filters"
            onClick={() => {
              setStatusFilter('all');
              setSearchQuery('');
            }}
          >
            <X size={16} />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Liste des agents */}
      <div className="agents-container">
        {filteredAgents.length === 0 ? (
          <div className="empty-state">
            <Users size={64} className="empty-icon" />
            <h3>Aucun agent trouvé</h3>
            <p>Aucun agent ne correspond aux critères de recherche.</p>
          </div>
        ) : (
          <div className="agents-grid">
            {filteredAgents.map((agent) => {
              const statusColor = getStatusColor(agent.status);

              return (
                <div key={agent.id} className="agent-card" onClick={() => setSelectedAgent(agent)}>
                  <div className="agent-card-header">
                    <div className="agent-avatar" style={{ backgroundColor: statusColor }}>
                      <Users size={24} color="white" />
                    </div>
                    <div className="agent-header-info">
                      <h3 className="agent-name">{agent.name}</h3>
                      <div className={`agent-status ${agent.status}`} style={{ color: statusColor }}>
                        <div className="status-dot" style={{ backgroundColor: statusColor }}></div>
                        {getStatusLabel(agent.status)}
                      </div>
                    </div>
                  </div>

                  <div className="agent-card-body">
                    <div className="agent-specialty">
                      <Radio size={16} />
                      <span>{agent.specialty}</span>
                    </div>
                    
                    <div className="agent-location">
                      <MapPin size={16} />
                      <span>
                        {agent.location.lat.toFixed(4)}, {agent.location.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <div className="agent-card-footer">
                    <button
                      className="action-btn small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMap(agent);
                      }}
                    >
                      <Navigation size={14} />
                      Voir sur carte
                    </button>
                    {agent.status === 'available' && (
                      <button
                        className="action-btn small primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAssignModal(agent);
                        }}
                      >
                        Assigner mission
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedAgent && (
        <div className="modal-overlay" onClick={() => setSelectedAgent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails de l'agent</h2>
              <button className="close-btn" onClick={() => setSelectedAgent(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <div className="agent-detail-header">
                  <div className="agent-avatar-large" style={{ backgroundColor: getStatusColor(selectedAgent.status) }}>
                    <Users size={48} color="white" />
                  </div>
                  <div>
                    <h3>{selectedAgent.name}</h3>
                    <div className={`agent-status ${selectedAgent.status}`} style={{ color: getStatusColor(selectedAgent.status) }}>
                      <div className="status-dot" style={{ backgroundColor: getStatusColor(selectedAgent.status) }}></div>
                      {getStatusLabel(selectedAgent.status)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Spécialité</h4>
                <div className="detail-info">
                  <Radio size={18} />
                  <span>{selectedAgent.specialty}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Localisation</h4>
                <div className="detail-info">
                  <MapPin size={18} />
                  <div>
                    <p className="detail-coords">
                      {selectedAgent.location.lat.toFixed(6)}, {selectedAgent.location.lng.toFixed(6)}
                    </p>
                    <button 
                      className="action-btn small" 
                      style={{ marginTop: '0.5rem' }}
                      onClick={() => {
                        setSelectedAgent(null);
                        setShowMap(selectedAgent);
                      }}
                    >
                      <Navigation size={14} />
                      Voir sur la carte
                    </button>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Informations</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">ID Agent</span>
                    <span className="detail-value">{selectedAgent.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Statut</span>
                    <span className="detail-value" style={{ color: getStatusColor(selectedAgent.status) }}>
                      {getStatusLabel(selectedAgent.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="action-btn secondary"
                  onClick={() => {
                    setSelectedAgent(null);
                    setShowMap(selectedAgent);
                  }}
                >
                  <Navigation size={16} />
                  Voir sur carte
                </button>
                {selectedAgent.status === 'available' && (
                  <button
                    className="action-btn primary"
                    onClick={() => {
                      setSelectedAgent(null);
                      setShowAssignModal(selectedAgent);
                    }}
                  >
                    Assigner une mission
                  </button>
                )}
                <button
                  className="action-btn secondary"
                  onClick={() => setSelectedAgent(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de carte */}
      {showMap && (
        <MapView
          agent={showMap}
          allAgents={allAgents}
          onClose={() => setShowMap(null)}
        />
      )}

      {/* Modal d'assignation de mission */}
      {showAssignModal && (
        <AssignMissionModal
          agent={showAssignModal}
          alerts={availableAlerts}
          onAssign={handleAssignMission}
          onClose={() => setShowAssignModal(null)}
        />
      )}

      <style>{`
        .agents-page {
          padding: 2rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: var(--muted-foreground);
        }

        .header-stats {
          display: flex;
          gap: 1.5rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
        }

        .stat-icon {
          color: var(--primary);
        }

        .stat-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .stat-dot.available {
          background-color: var(--secondary);
        }

        .stat-dot.busy {
          background-color: var(--warning);
        }

        .stat-dot.offline {
          background-color: var(--muted-foreground);
        }

        .stat-value {
          display: block;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: var(--muted-foreground);
          margin-top: 0.25rem;
        }

        .filters-section {
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--muted-foreground);
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 0.95rem;
          outline: none;
        }

        .search-input:focus {
          border-color: var(--primary);
        }

        .clear-search {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: var(--muted-foreground);
          cursor: pointer;
          padding: 0.25rem;
        }

        .filters-row {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }

        .filter-group {
          flex: 1;
        }

        .filter-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--foreground);
          margin-bottom: 0.5rem;
        }

        .filter-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 0.95rem;
          background-color: white;
          cursor: pointer;
          outline: none;
        }

        .filter-group select:focus {
          border-color: var(--primary);
        }

        .reset-filters {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background-color: var(--muted);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 0.95rem;
          cursor: pointer;
          white-space: nowrap;
        }

        .reset-filters:hover {
          background-color: var(--border);
        }

        .agents-container {
          margin-top: 1rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
        }

        .empty-icon {
          color: var(--muted-foreground);
          opacity: 0.5;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--foreground);
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: var(--muted-foreground);
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .agent-card {
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .agent-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }

        .agent-card-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .agent-avatar {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .agent-header-info {
          flex: 1;
        }

        .agent-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 0.5rem;
        }

        .agent-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .agent-card-body {
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .agent-specialty,
        .agent-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--muted-foreground);
        }

        .agent-card-footer {
          display: flex;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius);
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .action-btn:hover {
          opacity: 0.9;
        }

        .action-btn.small {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          flex: 1;
        }

        .action-btn.primary {
          background-color: var(--primary);
          color: white;
        }

        .action-btn.secondary {
          background-color: var(--muted);
          color: var(--foreground);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--muted-foreground);
          cursor: pointer;
          padding: 0.5rem;
        }

        .close-btn:hover {
          color: var(--foreground);
        }

        .modal-body {
          padding: 1.5rem;
        }

        .detail-section {
          margin-bottom: 1.5rem;
        }

        .detail-section h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--foreground);
          margin-bottom: 0.75rem;
        }

        .agent-detail-header {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .agent-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .agent-detail-header h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 0.5rem;
        }

        .detail-info {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .detail-coords {
          font-size: 0.9rem;
          color: var(--muted-foreground);
          font-family: monospace;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-label {
          font-size: 0.85rem;
          color: var(--muted-foreground);
          font-weight: 500;
        }

        .detail-value {
          font-size: 0.95rem;
          color: var(--foreground);
          font-weight: 600;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }

        .modal-actions .action-btn {
          flex: 1;
        }
      `}</style>
    </div>
  );
};
