import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AlertCard } from '../components/AlertCard';
import { Alerte } from '../types';
import { calculateDistance } from '../utils/location';

interface AlertsScreenProps {
  agentPosition?: { latitude: number; longitude: number };
  onBack: () => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({ agentPosition, onBack }) => {
  const [alertes, setAlertes] = useState<Alerte[]>([]);

  useEffect(() => {
    // Charger des alertes de démo
    loadDemoAlertes();
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

    // Calculer la distance si la position de l'agent est disponible
    if (agentPosition) {
      demoAlertes.forEach(alerte => {
        alerte.distance = calculateDistance(
          agentPosition.latitude,
          agentPosition.longitude,
          alerte.localisation.latitude,
          alerte.localisation.longitude
        );
      });

      // Trier par distance
      demoAlertes.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    setAlertes(demoAlertes);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Alertes</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Alertes actives ({alertes.length})
            </Text>
            {agentPosition && (
              <Text style={styles.sectionSubtitle}>
                Triées par distance de votre position
              </Text>
            )}
          </View>

          {alertes.map((alerte) => (
            <AlertCard
              key={alerte.id}
              alerte={alerte}
              onPress={() => {
                // TODO: Ouvrir les détails de l'alerte
                console.log('Alerte sélectionnée:', alerte.id);
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
  sectionSubtitle: {
    fontSize: 13,
    color: colors.mutedForeground,
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
});
