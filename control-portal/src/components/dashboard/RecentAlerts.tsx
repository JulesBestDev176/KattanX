import React from 'react';
import { MaterialIcon } from '../common/MaterialIcon';

interface Alert {
  id: string;
  type: string;
  title: string;
  location: string;
  time: string;
  severity: 'Haute' | 'Moyenne' | 'Basse';
  icon: string;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'vol',
    title: 'Vol à l\'arraché',
    location: 'Médina',
    time: 'Il y a 2 min',
    severity: 'Haute',
    icon: 'directions_run',
    bgColor: 'bg-red-900/20',
    iconBg: 'bg-red-900/30',
    iconColor: 'text-accent-red',
    badgeBg: 'bg-red-800',
    badgeText: 'text-red-100',
  },
  {
    id: '2',
    type: 'rassemblement',
    title: 'Rassemblement Suspect',
    location: 'Parcelles Assainies',
    time: 'Il y a 15 min',
    severity: 'Moyenne',
    icon: 'groups',
    bgColor: 'bg-yellow-900/20',
    iconBg: 'bg-yellow-900/30',
    iconColor: 'text-accent-yellow',
    badgeBg: 'bg-yellow-800',
    badgeText: 'text-yellow-100',
  },
  {
    id: '3',
    type: 'accident',
    title: 'Accident de la route',
    location: 'Plateau',
    time: 'Il y a 32 min',
    severity: 'Haute',
    icon: 'traffic',
    bgColor: 'bg-blue-900/20',
    iconBg: 'bg-blue-900/30',
    iconColor: 'text-primary',
    badgeBg: 'bg-red-800',
    badgeText: 'text-red-100',
  },
  {
    id: '4',
    type: 'feu',
    title: 'Départ de feu',
    location: 'Yoff',
    time: 'Il y a 48 min',
    severity: 'Basse',
    icon: 'local_fire_department',
    bgColor: 'bg-gray-800',
    iconBg: 'bg-gray-700',
    iconColor: 'text-gray-400',
    badgeBg: 'bg-gray-600',
    badgeText: 'text-gray-100',
  },
];

export const RecentAlerts: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 bg-dark-bic-blue p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-white shrink-0">Alertes Récentes</h3>
      <div className="flex flex-col gap-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg ${alert.bgColor} shrink-0`}>
            <div className={`p-2 ${alert.iconBg} rounded-full`}>
              <MaterialIcon icon={alert.icon} className={alert.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-white truncate">{alert.title}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{alert.time}</span>
              </div>
              <p className="text-xs text-gray-300 truncate">{alert.location}</p>
              <div className="flex justify-between items-center mt-2">
                <span className={`inline-block px-2 py-0.5 text-xs font-medium ${alert.badgeText} ${alert.badgeBg} rounded-full`}>
                  {alert.severity}
                </span>
                <a href="#" className="text-xs font-semibold text-primary hover:underline">
                  Voir détails
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
