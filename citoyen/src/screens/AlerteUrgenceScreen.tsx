/**
 * Écran pour déclencher une alerte d'urgence "SOS"
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Note: Pour utiliser la géolocalisation, installer expo-location:
// npx expo install expo-location
// Pour l'instant, on utilise une approche avec navigator.geolocation
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';
import { apiService } from '../utils/api';
import { colors } from '../theme/colors';

interface AlerteUrgenceScreenProps {
  accessToken: string;
  user: any;
  onBack: () => void;
}

export const AlerteUrgenceScreen: React.FC<AlerteUrgenceScreenProps> = ({
  accessToken,
  user,
  onBack,
}) => {
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [type, setType] = useState('danger_imminent');

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationError(null);

      // Essayer d'utiliser expo-location si disponible
      try {
        const Location = require('expo-location');
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission de localisation refusée. Veuillez l\'activer dans les paramètres.');
          setLocationLoading(false);
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationLoading(false);
      } catch (expoError) {
        // Si expo-location n'est pas disponible, utiliser une position par défaut (Dakar)
        // En production, vous devriez installer expo-location: npx expo install expo-location
        console.warn('expo-location not available, using default location');
        setLocation({
          latitude: 14.6928, // Dakar par défaut
          longitude: -17.4467,
        });
        setLocationError('Utilisation de la position par défaut. Installez expo-location pour la géolocalisation précise.');
        setLocationLoading(false);
      }
    } catch (error: any) {
      console.error('Error getting location:', error);
      setLocationError('Impossible d\'obtenir votre localisation');
      setLocationLoading(false);
    }
  };

  const handleSendAlert = async () => {
    if (!location) {
      toast.error('Localisation requise pour envoyer l\'alerte');
      return;
    }

    // Confirmation avant envoi
    Alert.alert(
      'Confirmer l\'alerte',
      'Voulez-vous vraiment envoyer une alerte d\'urgence aux brigades les plus proches ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Envoyer',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await apiService.createAlerteUrgence({
                type,
                description: description.trim() || undefined,
                latitude: location.latitude,
                longitude: location.longitude,
              });

              if (response && response.success) {
                toast.success('Alerte envoyée avec succès !');
                
                // Afficher les brigades notifiées
                if (response.brigades_notifiees && response.brigades_notifiees.length > 0) {
                  const brigadesList = response.brigades_notifiees
                    .map((b: any) => `• ${b.brigade_nom} (${b.distance_km} km)`)
                    .join('\n');
                  
                  Alert.alert(
                    'Alerte envoyée',
                    `${response.brigades_notifiees.length} brigade(s) notifiée(s) :\n\n${brigadesList}`,
                    [{ text: 'OK', onPress: onBack }]
                  );
                } else {
                  setTimeout(() => {
                    onBack();
                  }, 2000);
                }
              } else {
                throw new Error('Erreur lors de l\'envoi de l\'alerte');
              }
            } catch (error: any) {
              console.error('Error sending alert:', error);
              toast.error(error.message || 'Erreur lors de l\'envoi de l\'alerte');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.title}>SOS</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avertissement */}
          <View style={styles.warningBox}>
            <Ionicons name="warning" size={32} color={colors.destructive} />
            <Text style={styles.warningText}>
              Cette alerte sera envoyée aux brigades les plus proches de votre position.
              Utilisez-la uniquement en cas d'urgence réelle.
            </Text>
          </View>

          {/* Localisation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localisation</Text>
            {locationLoading ? (
              <View style={styles.locationBox}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.locationText}>Récupération de votre position...</Text>
              </View>
            ) : locationError ? (
              <View style={styles.locationBox}>
                <Ionicons name="location-outline" size={24} color={colors.destructive} />
                <Text style={styles.locationErrorText}>{locationError}</Text>
                <Button
                  title="Réessayer"
                  onPress={requestLocation}
                  style={styles.retryButton}
                />
              </View>
            ) : location ? (
              <View style={styles.locationBox}>
                <Ionicons name="location" size={24} color={colors.success} />
                <Text style={styles.locationText}>
                  Position détectée{'\n'}
                  <Text style={styles.locationCoords}>
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </Text>
                </Text>
                <TouchableOpacity onPress={requestLocation} style={styles.refreshButton}>
                  <Ionicons name="refresh" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          {/* Type d'urgence */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type d'urgence</Text>
            <View style={styles.typeContainer}>
              {[
                { value: 'danger_imminent', label: 'Danger imminent', icon: 'alert-circle' },
                { value: 'agression', label: 'Agression', icon: 'shield-outline' },
                { value: 'accident', label: 'Accident', icon: 'car-outline' },
                { value: 'maladie', label: 'Urgence médicale', icon: 'medical-outline' },
                { value: 'autre', label: 'Autre', icon: 'ellipsis-horizontal' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.typeButton,
                    type === item.value && styles.typeButtonActive,
                  ]}
                  onPress={() => setType(item.value)}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={type === item.value ? colors.white : colors.foreground}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === item.value && styles.typeButtonTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description (optionnelle) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description (optionnelle)</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Décrivez brièvement la situation..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
              maxLength={500}
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          {/* Bouton d'envoi */}
          <View style={styles.buttonContainer}>
            <Button
              title={loading ? 'Envoi en cours...' : 'Envoyer l\'alerte'}
              onPress={handleSendAlert}
              disabled={!location || loading}
              style={[
                styles.sendButton,
                (!location || loading) && styles.sendButtonDisabled,
              ]}
              textStyle={styles.sendButtonText}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  warningBox: {
    backgroundColor: colors.destructive + '20',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.destructive,
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.foreground,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 12,
  },
  locationBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.foreground,
  },
  locationCoords: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: 'monospace',
  },
  locationErrorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.destructive,
  },
  refreshButton: {
    padding: 8,
  },
  retryButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    minWidth: '45%',
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.foreground,
  },
  typeButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  descriptionInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: colors.foreground,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'right',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  sendButton: {
    backgroundColor: colors.destructive,
    paddingVertical: 16,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

