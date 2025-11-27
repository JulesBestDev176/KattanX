import * as Location from 'expo-location';

export interface Position {
  latitude: number;
  longitude: number;
  timestamp: number;
}

/**
 * Demande les permissions de localisation
 */
export async function requestLocationPermissions(): Promise<boolean> {
  try {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (foregroundStatus !== 'granted') {
      console.log('Permission de localisation refusée');
      return false;
    }

    // Optionnel: Demander la permission en arrière-plan
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    
    if (backgroundStatus !== 'granted') {
      console.log('Permission de localisation en arrière-plan refusée (optionnel)');
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la demande de permissions:', error);
    return false;
  }
}

/**
 * Récupère la position actuelle de l'agent
 */
export async function getCurrentPosition(): Promise<Position | null> {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la position:', error);
    return null;
  }
}

/**
 * Calcule la distance entre deux points en kilomètres
 * Utilise la formule de Haversine
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Formate la distance pour l'affichage
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Obtient l'adresse à partir des coordonnées (géocodage inversé)
 */
export async function getAddressFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (addresses && addresses.length > 0) {
      const address = addresses[0];
      const parts = [
        address.street,
        address.city,
        address.region,
        address.country,
      ].filter(Boolean);
      
      return parts.join(', ');
    }

    return null;
  } catch (error) {
    console.error('Erreur lors du géocodage inversé:', error);
    return null;
  }
}

/**
 * Démarre le suivi de position en temps réel
 * Retourne une fonction pour arrêter le suivi
 */
export async function startLocationTracking(
  onLocationUpdate: (position: Position) => void,
  intervalMs: number = 30000 // 30 secondes par défaut
): Promise<(() => void) | null> {
  try {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Première position immédiate
    const initialPosition = await getCurrentPosition();
    if (initialPosition) {
      onLocationUpdate(initialPosition);
    }

    // Mise à jour périodique
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: intervalMs,
        distanceInterval: 100, // Mise à jour tous les 100m minimum
      },
      (location) => {
        onLocationUpdate({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: location.timestamp,
        });
      }
    );

    // Retourne une fonction pour arrêter le suivi
    return () => {
      subscription.remove();
    };
  } catch (error) {
    console.error('Erreur lors du démarrage du suivi de position:', error);
    return null;
  }
}
