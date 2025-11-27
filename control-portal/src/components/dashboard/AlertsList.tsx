import React from 'react';
import { AlertTriangle, Flame, ShieldAlert, Stethoscope, MapPin } from 'lucide-react';
import type { Alert } from '../../types';

interface AlertsListProps {
  alerts: Alert[];
}

export const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
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
      case 'high': return '#f97316'; // Orange
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--secondary)';
      default: return 'var(--muted-foreground)';
    }
  };

  return (
    <div className="alerts-list-container">
      <div className="list-header">
        <h2>Alertes récentes</h2>
        <button className="view-all">Voir tout</button>
      </div>

      <div className="alerts-list">
        {alerts.map((alert) => {
          const Icon = getIcon(alert.type);
          const severityColor = getSeverityColor(alert.severity);

          return (
            <div key={alert.id} className="alert-item">
              <div className="alert-icon" style={{ backgroundColor: `${severityColor}20`, color: severityColor }}>
                <Icon size={20} />
              </div>
              <div className="alert-content">
                <div className="alert-top">
                  <span className="alert-type">
                    {alert.type === 'accident' ? 'Accident' :
                     alert.type === 'fire' ? 'Incendie' :
                     alert.type === 'theft' ? 'Vol' :
                     alert.type === 'medical' ? 'Médical' :
                     'Autre'}
                  </span>
                  <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="alert-desc">{alert.description}</p>
                <div className="alert-location">
                  <MapPin size={14} />
                  <span>{alert.location.address}</span>
                </div>
              </div>
              <div className="alert-status">
                <span className={`status-badge ${alert.status}`}>
                  {alert.status === 'new' ? 'Nouveau' :
                   alert.status === 'investigating' ? 'En enquête' :
                   alert.status === 'resolved' ? 'Résolu' :
                   alert.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .alerts-list-container {
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          padding: 1.5rem;
          height: 100%;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .list-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .view-all {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .alert-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          transition: transform 0.2s;
        }

        .alert-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .alert-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .alert-content {
          flex: 1;
        }

        .alert-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .alert-type {
          font-weight: 600;
          text-transform: capitalize;
        }

        .alert-time {
          font-size: 0.8rem;
          color: var(--muted-foreground);
        }

        .alert-desc {
          font-size: 0.9rem;
          color: var(--muted-foreground);
          margin-bottom: 0.5rem;
        }

        .alert-location {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          color: var(--muted-foreground);
        }

        .status-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          text-transform: capitalize;
          font-weight: 500;
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
      `}</style>
    </div>
  );
};
