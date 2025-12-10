import React from 'react';
import { MaterialIcon } from '../common/MaterialIcon';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend: string;
  trendUp: boolean;
  borderColor: string;
  iconColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp,
  borderColor,
  iconColor,
}) => {
  return (
    <div className={`flex flex-col gap-2 rounded-lg p-4 bg-[#1a2635] border border-white/5 border-t-4 ${borderColor} shadow-sm`}>
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm font-medium leading-normal">{title}</p>
        <div className={`p-2 rounded-lg bg-opacity-10 ${iconColor.replace('text-', 'bg-')}`}>
          <MaterialIcon icon={icon} className={iconColor} />
        </div>
      </div>
      <p className="text-white tracking-tight text-3xl font-bold leading-tight mt-2">{value}</p>
      <p className={`text-sm font-medium leading-normal flex items-center gap-1 ${
        trendUp ? 'text-accent-green' : 'text-accent-red'
      }`}>
        <MaterialIcon icon={trendUp ? 'arrow_upward' : 'arrow_downward'} size="sm" />
        {trend}
        <span className="text-gray-500 text-xs font-normal ml-1">vs mois dernier</span>
      </p>
    </div>
  );
};
