import React from 'react';
import type { CameraFeed } from '../../types';
import { Maximize2, AlertCircle } from 'lucide-react';

interface VideoGridProps {
  feeds: CameraFeed[];
  onSelectFeed: (feed: CameraFeed) => void;
  selectedFeedId?: string;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ feeds, onSelectFeed, selectedFeedId }) => {
  return (
    <div className="video-grid">
      {feeds.map((feed) => (
        <div
          key={feed.id}
          className={`camera-card ${selectedFeedId === feed.id ? 'selected' : ''}`}
          onClick={() => onSelectFeed(feed)}
        >
          <div className="camera-header">
            <span className="camera-name">{feed.name}</span>
            <span className={`camera-status ${feed.status}`}>
              <span className="status-dot"></span>
              {feed.status === 'online' ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>
          
          <div className="video-placeholder">
            <div className="live-indicator">EN DIRECT</div>
            {feed.detectedEvents.length > 0 && (
              <div className="detection-overlay">
                <AlertCircle size={16} />
                <span>{feed.detectedEvents.length} Détection(s)</span>
              </div>
            )}
            <div className="camera-actions">
              <button className="action-btn">
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          <div className="camera-footer">
            <span className="location">{feed.location}</span>
          </div>
        </div>
      ))}

      <style>{`
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .camera-card {
          background-color: white;
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .camera-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .camera-card.selected {
          border-color: var(--primary);
        }

        .camera-header {
          padding: 0.75rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
        }

        .camera-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .camera-status {
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          text-transform: uppercase;
          font-weight: 600;
        }

        .camera-status.online { color: var(--secondary); }
        .camera-status.offline { color: var(--destructive); }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
        }

        .video-placeholder {
          height: 200px;
          background-color: #1e293b;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
        }

        .live-indicator {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: rgba(220, 38, 38, 0.9);
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .detection-overlay {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(245, 158, 11, 0.9);
          color: white;
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }

        .camera-actions {
          position: absolute;
          bottom: 10px;
          right: 10px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .camera-card:hover .camera-actions {
          opacity: 1;
        }

        .action-btn {
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          padding: 6px;
          border-radius: 4px;
        }

        .action-btn:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }

        .camera-footer {
          padding: 0.75rem 1rem;
          background-color: var(--muted);
          font-size: 0.8rem;
          color: var(--muted-foreground);
        }
      `}</style>
    </div>
  );
};
