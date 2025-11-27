export interface Alert {
  id: string;
  type: 'accident' | 'fire' | 'theft' | 'medical' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  status: 'new' | 'investigating' | 'resolved';
  timestamp: string;
  source: 'citizen' | 'camera' | 'sensor';
}

export interface Agent {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  location: {
    lat: number;
    lng: number;
  };
  specialty: string;
}

export interface Mission {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedAt: string;
  completedAt?: string;
  alertId?: string; // Si la mission est liée à une alerte
}

export interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  thumbnailUrl: string;
  detectedEvents: {
    type: string;
    confidence: number;
    timestamp: string;
  }[];
}
