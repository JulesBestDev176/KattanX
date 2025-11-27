import React, { useState } from 'react';
import { AlertTriangle, Flame, ShieldAlert, Stethoscope, MapPin, Filter, Search, X } from 'lucide-react';
import type { Alert } from '../types';

export const Alerts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'investigating' | 'resolved'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | Alert['type']>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | Alert['severity']>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Données simulées
  const allAlerts: Alert[] = [
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
    {
      id: '4',
      type: 'medical',
      severity: 'high',
      location: { lat: 14.7000, lng: -17.4500, address: 'Dakar, Corniche' },
      description: 'Personne inconsciente signalée. Besoin d\'assistance médicale urgente.',
      status: 'investigating',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      source: 'citizen',
    },
    {
      id: '5',
      type: 'accident',
      severity: 'medium',
      location: { lat: 14.7100, lng: -17.4600, address: 'Almadies, Route de l\'Aéroport' },
      description: 'Accident de moto. Conducteur blessé.',
      status: 'resolved',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      source: 'citizen',
    },
    {
      id: '6',
      type: 'fire',
      severity: 'critical',
      location: { lat: 14.7200, lng: -17.4700, address: 'Parcelles Assainies' },
      description: 'Début d\'incendie dans un bâtiment résidentiel.',
      status: 'new',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      source: 'sensor',
    },
  ];

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'fire': return Flame;
      case 'medical': return Stethoscope;
      case 'theft': return ShieldAlert;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'var(--destructive)';
      case 'high': return '#f97316';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--secondary)';
      default: return 'var(--muted-foreground)';
    }
  };

  const getTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'accident': return 'Accident';
      case 'fire': return 'Incendie';
      case 'theft': return 'Vol';
      case 'medical': return 'Médical';
      default: return 'Autre';
    }
  };

  const getStatusLabel = (status: Alert['status']) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'investigating': return 'En enquête';
      case 'resolved': return 'Résolu';
      default: return status;
    }
  };

  const getSourceLabel = (source: Alert['source']) => {
    switch (source) {
      case 'citizen': return 'Citoyen';
      case 'camera': return 'Caméra';
      case 'sensor': return 'Capteur';
      default: return source;
    }
  };

  // Filtrage
  const filteredAlerts = allAlerts.filter(alert => {
    const matchesSearch = searchQuery === '' || 
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesSeverity;
  });

  const handleStatusChange = (alertId: string, newStatus: Alert['status']) => {
    // TODO: Implémenter la mise à jour du statut
    console.log(`Changer le statut de l'alerte ${alertId} à ${newStatus}`);
  };

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div>
          <h1>Toutes les alertes</h1>
          <p>Gestion complète des alertes et historique</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{allAlerts.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{allAlerts.filter(a => a.status === 'new').length}</span>
            <span className="stat-label">Nouvelles</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{allAlerts.filter(a => a.status === 'investigating').length}</span>
            <span className="stat-label">En enquête</span>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par description ou localisation..."
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
              <option value="new">Nouveau</option>
              <option value="investigating">En enquête</option>
              <option value="resolved">Résolu</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
              <option value="all">Tous</option>
              <option value="accident">Accident</option>
              <option value="fire">Incendie</option>
              <option value="theft">Vol</option>
              <option value="medical">Médical</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Gravité</label>
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value as any)}>
              <option value="all">Toutes</option>
              <option value="critical">Critique</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>
          </div>

          <button
            className="reset-filters"
            onClick={() => {
              setStatusFilter('all');
              setTypeFilter('all');
              setSeverityFilter('all');
              setSearchQuery('');
            }}
          >
            <X size={16} />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Liste des alertes */}
      <div className="alerts-container">
        {filteredAlerts.length === 0 ? (
          <div className="empty-state">
            <AlertTriangle size={64} className="empty-icon" />
            <h3>Aucune alerte trouvée</h3>
            <p>Aucune alerte ne correspond aux critères de recherche.</p>
          </div>
        ) : (
          <div className="alerts-grid">
            {filteredAlerts.map((alert) => {
              const Icon = getIcon(alert.type);
              const severityColor = getSeverityColor(alert.severity);

              return (
                <div key={alert.id} className="alert-card" onClick={() => setSelectedAlert(alert)}>
                  <div className="alert-card-header">
                    <div className="alert-icon-container" style={{ backgroundColor: `${severityColor}20`, color: severityColor }}>
                      <Icon size={24} />
                    </div>
                    <div className="alert-header-info">
                      <div className="alert-type-badge" style={{ backgroundColor: severityColor }}>
                        {getTypeLabel(alert.type)}
                      </div>
                      <div className="alert-severity" style={{ color: severityColor }}>
                        {alert.severity === 'critical' ? 'Critique' :
                         alert.severity === 'high' ? 'Élevée' :
                         alert.severity === 'medium' ? 'Moyenne' : 'Faible'}
                      </div>
                    </div>
                  </div>

                  <div className="alert-card-body">
                    <p className="alert-description">{alert.description}</p>
                    
                    <div className="alert-meta">
                      <div className="meta-item">
                        <MapPin size={14} />
                        <span>{alert.location.address}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Source:</span>
                        <span>{getSourceLabel(alert.source)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Heure:</span>
                        <span>{new Date(alert.timestamp).toLocaleString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="alert-card-footer">
                    <div className={`status-badge ${alert.status}`}>
                      {getStatusLabel(alert.status)}
                    </div>
                    <div className="alert-actions">
                      {alert.status === 'new' && (
                        <button
                          className="action-btn small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(alert.id, 'investigating');
                          }}
                        >
                          Prendre en charge
                        </button>
                      )}
                      {alert.status === 'investigating' && (
                        <button
                          className="action-btn small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(alert.id, 'resolved');
                          }}
                        >
                          Résoudre
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedAlert && (
        <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails de l'alerte</h2>
              <button className="close-btn" onClick={() => setSelectedAlert(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {(() => {
                const Icon = getIcon(selectedAlert.type);
                const severityColor = getSeverityColor(selectedAlert.severity);
                return (
                  <>
                    <div className="detail-section">
                      <div className="detail-header">
                        <div className="detail-icon" style={{ backgroundColor: `${severityColor}20`, color: severityColor }}>
                          <Icon size={32} />
                        </div>
                        <div>
                          <h3>{getTypeLabel(selectedAlert.type)}</h3>
                          <span className="detail-severity" style={{ color: severityColor }}>
                            Gravité: {selectedAlert.severity === 'critical' ? 'Critique' :
                                     selectedAlert.severity === 'high' ? 'Élevée' :
                                     selectedAlert.severity === 'medium' ? 'Moyenne' : 'Faible'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Description</h4>
                      <p>{selectedAlert.description}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Localisation</h4>
                      <div className="detail-info">
                        <MapPin size={18} />
                        <div>
                          <p className="detail-address">{selectedAlert.location.address}</p>
                          <p className="detail-coords">
                            {selectedAlert.location.lat.toFixed(4)}, {selectedAlert.location.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Informations</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Statut</span>
                          <span className={`detail-value status-${selectedAlert.status}`}>
                            {getStatusLabel(selectedAlert.status)}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Source</span>
                          <span className="detail-value">{getSourceLabel(selectedAlert.source)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Date et heure</span>
                          <span className="detail-value">
                            {new Date(selectedAlert.timestamp).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">ID Alerte</span>
                          <span className="detail-value">{selectedAlert.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="modal-actions">
                      {selectedAlert.status === 'new' && (
                        <button
                          className="action-btn primary"
                          onClick={() => {
                            handleStatusChange(selectedAlert.id, 'investigating');
                            setSelectedAlert(null);
                          }}
                        >
                          Prendre en charge
                        </button>
                      )}
                      {selectedAlert.status === 'investigating' && (
                        <button
                          className="action-btn primary"
                          onClick={() => {
                            handleStatusChange(selectedAlert.id, 'resolved');
                            setSelectedAlert(null);
                          }}
                        >
                          Marquer comme résolu
                        </button>
                      )}
                      <button
                        className="action-btn secondary"
                        onClick={() => setSelectedAlert(null)}
                      >
                        Fermer
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .alerts-page {
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
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
        }

        .stat-label {
          display: block;
          font-size: 0.85rem;
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

        .alerts-container {
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

        .alerts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .alert-card {
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .alert-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }

        .alert-card-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .alert-icon-container {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .alert-header-info {
          flex: 1;
        }

        .alert-type-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.5rem;
        }

        .alert-severity {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .alert-card-body {
          margin-bottom: 1rem;
        }

        .alert-description {
          font-size: 0.95rem;
          color: var(--foreground);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .alert-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--muted-foreground);
        }

        .meta-label {
          font-weight: 600;
        }

        .alert-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .status-badge {
          padding: 0.4rem 0.8rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.new {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .status-badge.investigating {
          background-color: #fef3c7;
          color: #92400e;
        }

        .status-badge.resolved {
          background-color: #dcfce7;
          color: #166534;
        }

        .action-btn {
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

        .detail-header {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .detail-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .detail-header h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 0.25rem;
        }

        .detail-severity {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .detail-info {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .detail-address {
          font-weight: 600;
          color: var(--foreground);
          margin-bottom: 0.25rem;
        }

        .detail-coords {
          font-size: 0.85rem;
          color: var(--muted-foreground);
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

        .detail-value.status-new {
          color: #991b1b;
        }

        .detail-value.status-investigating {
          color: #92400e;
        }

        .detail-value.status-resolved {
          color: #166534;
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
