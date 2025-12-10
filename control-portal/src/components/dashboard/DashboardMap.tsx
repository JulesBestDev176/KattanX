import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different alert types
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

interface AlertLocation {
  id: string;
  title: string;
  lat: number;
  lng: number;
  type: string;
  color: string;
}

// Mock data for alerts on map
const alertLocations: AlertLocation[] = [
  { id: '1', title: 'Vol à l\'arraché', lat: 14.6937, lng: -17.4449, type: 'vol', color: '#ef4444' }, // Médina
  { id: '2', title: 'Rassemblement Suspect', lat: 14.7319, lng: -17.4572, type: 'rassemblement', color: '#f59e0b' }, // Parcelles
  { id: '3', title: 'Accident de la route', lat: 14.6708, lng: -17.4381, type: 'accident', color: '#0b68da' }, // Plateau
  { id: '4', title: 'Départ de feu', lat: 14.7486, lng: -17.4924, type: 'feu', color: '#6b7280' }, // Yoff
];

// Component to update map center
const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Custom Zoom Controls Component
const CustomControls: React.FC<{ 
  onZoomIn: () => void; 
  onZoomOut: () => void; 
  onLocate: () => void; 
}> = ({ onZoomIn, onZoomOut, onLocate }) => {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[1000]">
      <button 
        onClick={onZoomIn}
        className="bg-white p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-lg transition-colors"
        title="Zoom avant"
      >
        <span className="material-symbols-outlined text-xl">add</span>
      </button>
      <button 
        onClick={onZoomOut}
        className="bg-white p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-lg transition-colors"
        title="Zoom arrière"
      >
        <span className="material-symbols-outlined text-xl">remove</span>
      </button>
      <button 
        onClick={onLocate}
        className="bg-white p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-lg transition-colors"
        title="Ma position"
      >
        <span className="material-symbols-outlined text-xl">my_location</span>
      </button>
    </div>
  );
};

// Map Controller to handle zoom actions
const MapController: React.FC = () => {
  const map = useMap();
  
  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleLocate = () => {
    map.flyTo([14.6928, -17.4467], 13); // Reset to Dakar center
  };

  return <CustomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onLocate={handleLocate} />;
};

export const DashboardMap: React.FC = () => {
  // Dakar coordinates
  const position: [number, number] = [14.6928, -17.4467];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative z-0">
      <MapContainer 
        center={position} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
        className="bg-gray-100"
      >
        {/* Standard OpenStreetMap Tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ChangeView center={position} zoom={12} />
        <MapController />
        
        {alertLocations.map((alert) => (
          <Marker 
            key={alert.id} 
            position={[alert.lat, alert.lng]}
            icon={createCustomIcon(alert.color)}
          >
            <Popup className="custom-popup" minWidth={250}>
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white uppercase" style={{ backgroundColor: alert.color }}>
                    {alert.type}
                  </span>
                  <span className="text-xs text-gray-500">Il y a 10 min</span>
                </div>
                <h3 className="font-bold text-base text-gray-800 mb-1">{alert.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Incident signalé à {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}. 
                  Nécessite une intervention.
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-primary text-white text-xs font-semibold py-1.5 px-3 rounded hover:bg-primary/90 transition-colors">
                    Détails
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 text-xs font-semibold py-1.5 px-3 rounded hover:bg-gray-200 transition-colors">
                    Ignorer
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
