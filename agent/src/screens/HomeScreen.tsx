import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Agent, Screen } from '../types';
import { colors } from '../theme/colors';
import { storage } from '../utils/storage';
import { getCurrentPosition, startLocationTracking } from '../utils/location';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  agent: Agent;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  onUpdateAgent: (agent: Agent) => void;
}

interface MenuItem {
  id: Screen;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  description?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  agent,
  onNavigate,
  onLogout,
  onUpdateAgent,
}) => {
  const [enService, setEnService] = useState(agent.enService);
  const [locationStopFn, setLocationStopFn] = useState<(() => void) | null>(null);

  useEffect(() => {
    // Charger le statut de service sauvegardé
    loadServiceStatus();
  }, []);

  const loadServiceStatus = async () => {
    const savedStatus = await storage.getServiceStatus();
    setEnService(savedStatus);
    if (savedStatus) {
      startService();
    }
  };

  const startService = async () => {
    console.log('[DEMO] Démarrage du service...');
    
    // Démarrer le suivi de localisation
    const stopFn = await startLocationTracking(async (position) => {
      console.log('[DEMO] Position mise à jour:', position);
      
      // Mettre à jour la position de l'agent
      const updatedAgent: Agent = {
        ...agent,
        position,
        enService: true,
      };
      
      onUpdateAgent(updatedAgent);
      
      // TODO: Envoyer la position au serveur Supabase pour partage en temps réel
    });

    if (stopFn) {
      setLocationStopFn(() => stopFn);
    }
  };

  const stopService = () => {
    console.log('[DEMO] Arrêt du service...');
    
    // Arrêter le suivi de localisation
    if (locationStopFn) {
      locationStopFn();
      setLocationStopFn(null);
    }

    // Mettre à jour l'agent
    const updatedAgent: Agent = {
      ...agent,
      enService: false,
    };
    
    onUpdateAgent(updatedAgent);
  };

  const handleToggleService = async (value: boolean) => {
    setEnService(value);
    await storage.saveServiceStatus(value);

    if (value) {
      await startService();
    } else {
      stopService();
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'verification',
      icon: 'shield-checkmark',
      label: 'Vérification',
      color: colors.primary,
      description: 'Vérifier un individu',
    },
    {
      id: 'alerts',
      icon: 'notifications',
      label: 'Alertes',
      color: colors.destructive,
      description: 'Voir et créer des alertes',
    },
    {
      id: 'profile',
      icon: 'person-circle',
      label: 'Profil',
      color: colors.secondary,
      description: 'Mon profil agent',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Bonjour</Text>
              <Text style={styles.title}>{agent.name || 'Agent'}</Text>
              <Text style={styles.subtitle}>
                {agent.corps} - {agent.matricule}
              </Text>
            </View>
            <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Service Toggle */}
          <View style={styles.serviceToggle}>
            <View style={styles.serviceInfo}>
              <Ionicons
                name={enService ? 'checkmark-circle' : 'close-circle'}
                size={24}
                color={enService ? colors.enService : colors.horsService}
              />
              <View style={styles.serviceTextContainer}>
                <Text style={styles.serviceLabel}>Statut de service</Text>
                <Text
                  style={[
                    styles.serviceStatus,
                    { color: enService ? colors.enService : colors.horsService },
                  ]}
                >
                  {enService ? 'En service' : 'Hors service'}
                </Text>
              </View>
            </View>
            <Switch
              value={enService}
              onValueChange={handleToggleService}
              trackColor={{ false: colors.border, true: colors.enService }}
              thumbColor={colors.white}
            />
          </View>

          {/* Position info */}
          {enService && agent.position && (
            <View style={styles.positionInfo}>
              <Ionicons name="location" size={16} color={colors.white} />
              <Text style={styles.positionText}>
                Position partagée en temps réel
              </Text>
            </View>
          )}
        </View>

        {/* Menu Grid */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services disponibles</Text>
            <View style={styles.grid}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => onNavigate(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon} size={28} color={colors.white} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.description && (
                    <Text style={styles.menuDescription}>{item.description}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stats */}
          {agent.stats && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statistiques</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{agent.stats.verificationsEffectuees}</Text>
                  <Text style={styles.statLabel}>Vérifications</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{agent.stats.alertesCreees}</Text>
                  <Text style={styles.statLabel}>Alertes créées</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{agent.stats.arrestations}</Text>
                  <Text style={styles.statLabel}>Arrestations</Text>
                </View>
              </View>
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
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  serviceToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceTextContainer: {
    marginLeft: 12,
  },
  serviceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  serviceStatus: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  positionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  positionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 16,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: (width - 48) / 2 - 6,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 11,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});
