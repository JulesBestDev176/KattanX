import React from 'react';
import { MaterialIcon } from '../components/common/MaterialIcon';

export const Brigades: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-3xl font-bold leading-tight">Brigades</h1>
          <p className="text-text-muted-dark text-base font-normal leading-normal">
            Gérer les brigades et leurs affectations
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors">
          <MaterialIcon icon="add" />
          <span className="truncate">Ajouter une Brigade</span>
        </button>
      </div>

      <div className="bg-dark-bic-blue rounded-xl p-6 text-center">
        <MaterialIcon icon="security" size="3xl" className="text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Page Brigades</h3>
        <p className="text-text-muted-dark">
          Cette page sera implémentée selon l'exemple HTML fourni.
        </p>
      </div>
    </div>
  );
};
