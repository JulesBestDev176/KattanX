import React, { useState } from 'react';
import { X, MapPin, AlertTriangle, FileText, Calendar } from 'lucide-react';
import type { Agent, Alert, Mission } from '../../types';

interface AssignMissionModalProps {
  agent: Agent;
  alerts?: Alert[];
  onAssign: (mission: Omit<Mission, 'id' | 'assignedAt' | 'status'>) => void;
  onClose: () => void;
}

export const AssignMissionModal: React.FC<AssignMissionModalProps> = ({
  agent,
  alerts = [],
  onAssign,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [selectedAlertId, setSelectedAlertId] = useState<string>('');
  const [location, setLocation] = useState({
    lat: agent.location.lat,
    lng: agent.location.lng,
    address: '',
  });
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const mission: Omit<Mission, 'id' | 'assignedAt' | 'status'> = {
      agentId: agent.id,
      agentName: agent.name,
      title: title.trim(),
      description: description.trim(),
      location: useCurrentLocation ? agent.location : location,
      priority,
      alertId: selectedAlertId || undefined,
    };

    onAssign(mission);
    onClose();
  };

  const handleAlertSelect = (alertId: string) => {
    setSelectedAlertId(alertId);
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setTitle(`Intervention: ${alert.type === 'accident' ? 'Accident' : 
                              alert.type === 'fire' ? 'Incendie' :
                              alert.type === 'theft' ? 'Vol' :
                              alert.type === 'medical' ? 'Urgence médicale' : 'Autre'}`);
      setDescription(alert.description);
      setLocation(alert.location);
      setPriority(alert.severity === 'critical' ? 'urgent' :
                  alert.severity === 'high' ? 'high' :
                  alert.severity === 'medium' ? 'medium' : 'low');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Assigner une mission</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="agent-info-section">
            <h4>Agent assigné</h4>
            <div className="agent-assign-info">
              <span className="agent-name">{agent.name}</span>
              <span className="agent-specialty">{agent.specialty}</span>
            </div>
          </div>

          {alerts.length > 0 && (
            <div className="form-section">
              <label>
                <AlertTriangle size={16} />
                Lier à une alerte (optionnel)
              </label>
              <select
                value={selectedAlertId}
                onChange={(e) => handleAlertSelect(e.target.value)}
                className="form-select"
              >
                <option value="">Aucune alerte</option>
                {alerts.map(alert => (
                  <option key={alert.id} value={alert.id}>
                    {alert.type === 'accident' ? 'Accident' :
                     alert.type === 'fire' ? 'Incendie' :
                     alert.type === 'theft' ? 'Vol' :
                     alert.type === 'medical' ? 'Médical' : 'Autre'} - {alert.location.address}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-section">
            <label htmlFor="title">
              Titre de la mission <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Intervention urgente à..."
              className="form-input"
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails de la mission..."
              className="form-textarea"
              rows={4}
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="priority">
              Priorité
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="form-select"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <div className="form-section">
            <label>
              <MapPin size={16} />
              Localisation
            </label>
            <div className="location-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useCurrentLocation}
                  onChange={(e) => setUseCurrentLocation(e.target.checked)}
                />
                Utiliser la position actuelle de l'agent
              </label>
            </div>
            {!useCurrentLocation && (
              <div className="location-inputs">
                <div className="location-row">
                  <input
                    type="number"
                    step="0.000001"
                    value={location.lat}
                    onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) || 0 })}
                    placeholder="Latitude"
                    className="form-input"
                  />
                  <input
                    type="number"
                    step="0.000001"
                    value={location.lng}
                    onChange={(e) => setLocation({ ...location, lng: parseFloat(e.target.value) || 0 })}
                    placeholder="Longitude"
                    className="form-input"
                  />
                </div>
                <input
                  type="text"
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  placeholder="Adresse (optionnel)"
                  className="form-input"
                />
              </div>
            )}
            {useCurrentLocation && (
              <div className="current-location-info">
                <MapPin size={14} />
                <span>{agent.location.lat.toFixed(6)}, {agent.location.lng.toFixed(6)}</span>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="action-btn secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="action-btn primary">
              Assigner la mission
            </button>
          </div>
        </form>

        <style>{`
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
            z-index: 2000;
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

          .agent-info-section {
            background-color: var(--muted);
            padding: 1rem;
            border-radius: var(--radius);
            margin-bottom: 1.5rem;
          }

          .agent-info-section h4 {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--muted-foreground);
            margin-bottom: 0.5rem;
          }

          .agent-assign-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .agent-name {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--foreground);
          }

          .agent-specialty {
            font-size: 0.9rem;
            color: var(--muted-foreground);
          }

          .form-section {
            margin-bottom: 1.5rem;
          }

          .form-section label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--foreground);
            margin-bottom: 0.5rem;
          }

          .required {
            color: var(--destructive);
          }

          .form-input,
          .form-select,
          .form-textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            font-size: 0.95rem;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
          }

          .form-input:focus,
          .form-select:focus,
          .form-textarea:focus {
            border-color: var(--primary);
          }

          .form-textarea {
            resize: vertical;
            min-height: 100px;
          }

          .location-options {
            margin-bottom: 1rem;
          }

          .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            cursor: pointer;
          }

          .checkbox-label input[type="checkbox"] {
            width: auto;
            cursor: pointer;
          }

          .location-inputs {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .location-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }

          .current-location-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem;
            background-color: var(--muted);
            border-radius: var(--radius);
            font-family: monospace;
            font-size: 0.9rem;
            color: var(--foreground);
          }

          .modal-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border);
          }

          .action-btn {
            flex: 1;
            padding: 0.75rem 1.5rem;
            border-radius: var(--radius);
            font-size: 0.95rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: opacity 0.2s;
          }

          .action-btn:hover {
            opacity: 0.9;
          }

          .action-btn.primary {
            background-color: var(--primary);
            color: white;
          }

          .action-btn.secondary {
            background-color: var(--muted);
            color: var(--foreground);
          }
        `}</style>
      </div>
    </div>
  );
};

