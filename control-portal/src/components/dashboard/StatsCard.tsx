import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = 'var(--primary)',
}) => {
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ backgroundColor: `${color}20`, color: color }}>
        <Icon size={24} />
      </div>
      <div className="stats-info">
        <h3 className="stats-title">{title}</h3>
        <div className="stats-value">{value}</div>
        {trend && (
          <div className={`stats-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
            {trend}
          </div>
        )}
      </div>

      <style>{`
        .stats-card {
          background-color: white;
          padding: 1.5rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stats-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stats-info {
          flex: 1;
        }

        .stats-title {
          font-size: 0.9rem;
          color: var(--muted-foreground);
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .stats-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--foreground);
        }

        .stats-trend {
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .trend-up {
          color: var(--secondary);
        }

        .trend-down {
          color: var(--destructive);
        }
      `}</style>
    </div>
  );
};
