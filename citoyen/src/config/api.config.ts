/**
 * Configuration de l'API backend
 * 
 * Pour tester sur un téléphone physique :
 * 1. Trouvez votre IP locale : ipconfig (Windows) ou ifconfig (Mac/Linux)
 * 2. Remplacez LOCAL_IP ci-dessous par votre IP (ex: '192.168.1.23')
 * 3. Assurez-vous que votre téléphone et votre PC sont sur le même réseau WiFi
 * 4. Redémarrez l'app Expo
 * 
 * Pour utiliser un émulateur Android :
 * - L'émulateur utilise automatiquement 10.0.2.2
 * - Pas besoin de modifier cette configuration
 */

// ⚠️ CONFIGURATION DE L'IP DU BACKEND
// 
// Pour téléphone physique : utilisez votre IP locale (ex: '192.168.1.23')
// Pour émulateur Android : utilisez '10.0.2.2' (IP spéciale de l'émulateur)
// 
// Trouvez votre IP locale avec : ipconfig (Windows) ou ifconfig (Mac/Linux)
// Assurez-vous que votre téléphone et PC sont sur le même réseau WiFi

export const LOCAL_IP = '192.168.1.23';  // ← Votre IP actuelle (modifiez si nécessaire)

// Port du backend Django
export const DJANGO_PORT = 8000;

