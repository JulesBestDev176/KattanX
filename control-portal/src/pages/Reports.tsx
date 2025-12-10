import React from 'react';
import { MaterialIcon } from '../components/common/MaterialIcon';

export const Reports: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-3xl font-bold leading-tight">Rapports</h1>
          <p className="text-text-muted-dark text-base font-normal leading-normal">
            Consulter et générer des rapports d'activité
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors">
          <MaterialIcon icon="download" />
          <span className="truncate">Générer un Rapport</span>
        </button>
      </div>

      <div className="bg-dark-bic-blue rounded-xl p-6 text-center">
        <MaterialIcon icon="assessment" size="3xl" className="text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Page Rapports</h3>
        <p className="text-text-muted-dark">
          Cette page sera implémentée selon l'exemple HTML fourni.
        </p>
      </div>
    </div>
  );
};
