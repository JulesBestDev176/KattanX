import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AlertCard } from '../components/AlertCard';
import { Alerte } from '../types';
import { calculateDistance } from '../utils/location';
import { Audio } from 'expo-av';

interface AlertsScreenProps {
  agentPosition?: { latitude: number; longitude: number };
  onBack: () => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({ agentPosition, onBack }) => {
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<Alerte | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const vibrationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadDemoAlertes();

    // Simulation d'une alerte en temps réel après 5 secondes
    const timer = setTimeout(() => {
      const newAlert: Alerte = {
        id: `new-${Date.now()}`,
        type: 'incident',
        titre: 'URGENCE : Incendie Déclaré',
        description: 'Incendie majeur signalé au Marché HLM. Toutes les unités à proximité sont requises.',
        localisation: {
          latitude: 14.7088,
          longitude: -17.4546,
          adresse: 'Marché HLM, Dakar',
        },
        createdBy: 'system',
        createdByName: 'Système de Surveillance IA',
        createdAt: new Date().toISOString(),
        status: 'active',
      };

      if (agentPosition) {
        newAlert.distance = calculateDistance(
          agentPosition.latitude,
          agentPosition.longitude,
          newAlert.localisation.latitude,
          newAlert.localisation.longitude
        );
      }

      setAlertes(prev => [newAlert, ...prev]);
      showAlertNotification(newAlert);
    }, 5000);

    return () => {
      clearTimeout(timer);
      stopNotification();
    };
  }, [agentPosition]);

  const loadDemoAlertes = () => {
    const demoAlertes: Alerte[] = [
      {
        id: '1',
        type: 'fugitif',
        titre: 'Suspect en fuite - Vol à main armée',
        description: 'Individu armé ayant commis un braquage dans une station-service. Dangereux, ne pas approcher seul.',
        localisation: {
          latitude: 14.6937,
          longitude: -17.4441,
          adresse: 'Dakar, Plateau',
        },
        suspect: {
          sexe: 'homme',
          ageMin: 25,
          ageMax: 35,
          couleurPeau: 'foncee',
          tailleMin: 170,
          tailleMax: 180,
          vehicule: {
            matricule: 'DK-5678-CD',
            couleur: 'Noir',
            description: 'Berline noire, vitre arrière cassée',
          },
        },
        createdBy: 'agent-123',
        createdByName: 'Agent Diallo',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'active',
      },
      {
        id: '2',
        type: 'vol',
        titre: 'Vol de véhicule signalé',
        description: 'Véhicule Toyota Corolla blanc volé ce matin. Propriétaire a déposé plainte.',
        localisation: {
          latitude: 14.7167,
          longitude: -17.4677,
          adresse: 'Dakar, Almadies',
        },
        suspect: {
          vehicule: {
            matricule: 'DK-1234-AB',
            marque: 'Toyota',
            modele: 'Corolla',
            couleur: 'Blanc',
          },
        },
        createdBy: 'agent-456',
        createdByName: 'Agent Ndiaye',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        status: 'active',
      },
      {
        id: '3',
        type: 'incident',
        titre: 'Accident de la circulation',
        description: 'Accident impliquant 2 véhicules. Besoin de renfort pour gérer la circulation.',
        localisation: {
          latitude: 14.7000,
          longitude: -17.4500,
          adresse: 'Dakar, Corniche',
        },
        createdBy: 'agent-789',
        createdByName: 'Agent Sow',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        status: 'active',
      },
    ];

    if (agentPosition) {
      demoAlertes.forEach(alerte => {
        alerte.distance = calculateDistance(
          agentPosition.latitude,
          agentPosition.longitude,
          alerte.localisation.latitude,
          alerte.localisation.longitude
        );
      });
      demoAlertes.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    setAlertes(demoAlertes);
  };

  const showAlertNotification = async (alert: Alerte) => {
    setCurrentAlert(alert);
    setShowAlertModal(true);
    
    // Démarrer le son
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/alert-sound.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      soundRef.current = sound;
    } catch (error) {
      console.log('Erreur lors du chargement du son:', error);
    }

    // Démarrer les vibrations
    const pattern = [0, 500, 200, 500];
    vibrationInterval.current = setInterval(() => {
      Vibration.vibrate(pattern);
    }, 2000);
  };

  const stopNotification = async () => {
    // Arrêter le son
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    // Arrêter les vibrations
    if (vibrationInterval.current) {
      clearInterval(vibrationInterval.current);
      vibrationInterval.current = null;
    }
    Vibration.cancel();
  };

  const handleAcknowledge = () => {
    stopNotification();
    setShowAlertModal(false);
  };

  const handleWillCheck = () => {
    stopNotification();
    setShowAlertModal(false);
    console.log('[DEMO] Agent va vérifier l\'alerte:', currentAlert?.id);
    // TODO: Envoyer la notification au serveur que l'agent prend en charge
  };

  const getAlertIcon = (type: Alerte['type']) => {
    switch (type) {
      case 'fugitif': return 'person-remove';
      case 'vol': return 'car';
      case 'incident': return 'warning';
      default: return 'alert-circle';
    }
  };

  const getAlertColor = (type: Alerte['type']) => {
    switch (type) {
      case 'fugitif': return colors.destructive;
      case 'vol': return colors.warning;
      case 'incident': return '#f97316';
      default: return colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Alertes en Temps Réel</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Agent Position Banner */}
        {agentPosition && (
          <View style={styles.positionBanner}>
            <View style={styles.positionContent}>
              <View style={styles.positionIconContainer}>
                <Ionicons name="navigate" size={20} color={colors.white} />
              </View>
              <View>
                <Text style={styles.positionLabel}>Ma Position Actuelle</Text>
                <Text style={styles.positionValue}>
                  Lat: {agentPosition.latitude.toFixed(5)} • Long: {agentPosition.longitude.toFixed(5)}
                </Text>
              </View>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>EN DIRECT</Text>
            </View>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Flux d'alertes</Text>
          </View>

          {alertes.map((alerte) => (
            <AlertCard
              key={alerte.id}
              alerte={alerte}
              onPress={() => {
                setCurrentAlert(alerte);
                setShowAlertModal(true);
              }}
            />
          ))}

          {alertes.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off" size={64} color={colors.mutedForeground} />
              <Text style={styles.emptyText}>Aucune alerte active</Text>
            </View>
          )}
        </ScrollView>

        {/* Alert Modal */}
        <Modal
          visible={showAlertModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleAcknowledge}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {currentAlert && (
                <>
                  <View style={[styles.modalHeader, { backgroundColor: getAlertColor(currentAlert.type) }]}>
                    <Ionicons name={getAlertIcon(currentAlert.type)} size={48} color={colors.white} />
                    <Text style={styles.modalTitle}>{currentAlert.titre}</Text>
                  </View>

                  <ScrollView style={styles.modalBody}>
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Description</Text>
                      <Text style={styles.detailValue}>{currentAlert.description}</Text>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Localisation</Text>
                      <View style={styles.locationRow}>
                        <Ionicons name="location" size={18} color={colors.primary} />
                        <Text style={styles.detailValue}>{currentAlert.localisation.adresse}</Text>
                      </View>
                      {currentAlert.distance && (
                        <Text style={styles.distanceText}>
                          À {currentAlert.distance.toFixed(1)} km de votre position
                        </Text>
                      )}
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Créée par</Text>
                      <Text style={styles.detailValue}>{currentAlert.createdByName}</Text>
                      <Text style={styles.timeText}>
                        {new Date(currentAlert.createdAt).toLocaleString('fr-FR')}
                      </Text>
                    </View>
                  </ScrollView>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.checkButton]}
                      onPress={handleWillCheck}
                    >
                      <Ionicons name="checkmark-circle" size={24} color={colors.white} />
                      <Text style={styles.actionButtonText}>Je vais vérifier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.okButton]}
                      onPress={handleAcknowledge}
                    >
                      <Text style={styles.actionButtonText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.muted,
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  placeholder: {
    width: 40,
  },
  positionBanner: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  positionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionIconContainer: {
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 20,
  },
  positionLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  positionValue: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.destructive,
    marginRight: 6,
  },
  liveText: {
    color: colors.destructive,
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.mutedForeground,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginTop: 12,
  },
  modalBody: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    color: colors.foreground,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
    marginTop: 4,
  },
  timeText: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  checkButton: {
    backgroundColor: colors.secondary,
  },
  okButton: {
    backgroundColor: colors.mutedForeground,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
