import React from 'react';
import type { CameraFeed } from '../../types';
import { Brain, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface AIAnalysisPanelProps {
  feed: CameraFeed | null;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ feed }) => {
  if (!feed) {
    return (
      <div className="ai-panel empty">
        <Brain size={48} className="empty-icon" />
        <h3>Centre d'analyse IA</h3>
        <p>Sélectionnez un flux caméra pour voir les analyses IA en temps réel.</p>
      </div>
    );
  }

  return (
    <div className="ai-panel">
      <div className="panel-header">
        <Brain size={24} className="ai-icon" />
        <div>
          <h3>Analyse IA</h3>
          <span className="feed-name">Analyse en cours : {feed.name}</span>
        </div>
      </div>

      <div className="analysis-content">
        <div className="confidence-meter">
          <div className="meter-label">
            <span>Confiance de détection de menace</span>
            <span className="score">94%</span>
          </div>
          <div className="meter-bar">
            <div className="meter-fill" style={{ width: '94%' }}></div>
          </div>
        </div>

        <div className="detections-list">
          <h4>Objets/Événements détectés</h4>
          {feed.detectedEvents.length === 0 ? (
            <div className="no-detections">
              <CheckCircle size={20} color="var(--secondary)" />
              <span>Aucune anomalie détectée.</span>
            </div>
          ) : (
            feed.detectedEvents.map((event, index) => (
              <div key={index} className="detection-item">
                <div className="detection-icon">
                  <AlertTriangle size={16} />
                </div>
                <div className="detection-details">
                  <span className="detection-type">{event.type}</span>
                  <span className="detection-time">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
                <span className="detection-score">{(event.confidence * 100).toFixed(0)}%</span>
              </div>
            ))
          )}
        </div>

        <div className="recommendations">
          <h4>Recommandations IA</h4>
          <div className="rec-item">
            <div className="rec-bullet"></div>
            <p>Envoyer l'unité de patrouille la plus proche pour vérifier le secteur.</p>
          </div>
          <div className="rec-item">
            <div className="rec-bullet"></div>
            <p>Marquer les images pour examen médico-légal.</p>
          </div>
        </div>

        <div className="actions">
          <button className="action-btn primary">Confirmer l'alerte</button>
          <button className="action-btn secondary">Ignorer (Faux positif)</button>
        </div>
      </div>

      <style>{`
        .ai-panel {
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .ai-panel.empty {
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          color: var(--muted-foreground);
        }

        .empty-icon {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .panel-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 1rem;
          background-color: #f8fafc;
          border-radius: var(--radius) var(--radius) 0 0;
        }

        .ai-icon {
          color: #8b5cf6;
        }

        .panel-header h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .feed-name {
          font-size: 0.8rem;
          color: var(--muted-foreground);
        }

        .analysis-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .meter-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .score {
          color: #8b5cf6;
          font-weight: 700;
        }

        .meter-bar {
          height: 8px;
          background-color: var(--muted);
          border-radius: 4px;
          overflow: hidden;
        }

        .meter-fill {
          height: 100%;
          background-color: #8b5cf6;
          border-radius: 4px;
        }

        .detections-list h4, .recommendations h4 {
          font-size: 0.9rem;
          color: var(--muted-foreground);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .detection-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background-color: #fff1f2;
          border: 1px solid #fecdd3;
          border-radius: var(--radius);
          margin-bottom: 0.75rem;
        }

        .detection-icon {
          color: var(--destructive);
        }

        .detection-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .detection-type {
          font-weight: 600;
          color: #881337;
        }

        .detection-time {
          font-size: 0.75rem;
          color: #9f1239;
        }

        .detection-score {
          font-weight: 700;
          color: #881337;
        }

        .no-detections {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: var(--radius);
          color: #166534;
        }

        .rec-item {
          display: flex;
          align-items: start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .rec-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #8b5cf6;
          margin-top: 8px;
        }

        .rec-item p {
          font-size: 0.9rem;
          color: var(--foreground);
        }

        .actions {
          margin-top: auto;
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: var(--radius);
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          transition: opacity 0.2s;
        }

        .action-btn:hover {
          opacity: 0.9;
        }

        .action-btn.primary {
          background-color: var(--destructive);
          color: white;
        }

        .action-btn.secondary {
          background-color: var(--muted);
          color: var(--foreground);
        }
      `}</style>
    </div>
  );
};
