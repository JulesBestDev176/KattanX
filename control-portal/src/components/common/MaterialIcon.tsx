import React from 'react';

interface MaterialIconProps {
  icon: string;
  filled?: boolean;
  className?: string;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
}

const sizeClasses = {
  sm: 'text-base',
  base: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
  '2xl': 'text-4xl',
  '3xl': 'text-5xl',
};

export const MaterialIcon: React.FC<MaterialIconProps> = ({ 
  icon, 
  filled = false, 
  className = '',
  size = 'base'
}) => {
  return (
    <span className={`material-symbols-outlined ${filled ? 'fill' : ''} ${sizeClasses[size]} ${className}`}>
      {icon}
    </span>
  );
};
