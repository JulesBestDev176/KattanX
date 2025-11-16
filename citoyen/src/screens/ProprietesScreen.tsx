import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../utils/supabase';
import { Propriete } from '../types';
import { colors } from '../theme/colors';
import { ProprieteViewer } from '../components/ProprieteViewer';

interface ProprietesScreenProps {
  accessToken: string;
  onBack: () => void;
}

// Types de propriétés avec leurs labels, icônes et couleurs
const proprieteTypes = {
  maison: { label: 'Maison', icon: 'home', color: colors.primary },
  voiture: { label: 'Voiture', icon: 'car', color: colors.secondary },
  terrain: { label: 'Terrain', icon: 'map', color: colors.primary },
  appartement: { label: 'Appartement', icon: 'business', color: colors.primary },
  commerce: { label: 'Commerce', icon: 'storefront', color: colors.secondary },
  autre: { label: 'Autre', icon: 'cube', color: colors.mutedForeground },
};

export const ProprietesScreen: React.FC<ProprietesScreenProps> = ({
  accessToken,
  onBack,
}) => {
  const [proprietes, setProprietes] = useState<Propriete[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropriete, setSelectedPropriete] = useState<Propriete | null>(null);

  useEffect(() => {
    fetchProprietes();
  }, []);

  const fetchProprietes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/proprietes`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProprietes(data);
      } else {
        // Mode simulation : données de test
        const testProprietes: Propriete[] = [
          {
            id: '1',
            type: 'maison',
            titre: 'Villa à Almadies',
            reference: 'TF-2020-001234',
            adresse: 'Almadies, Dakar',
            superficie: '250 m²',
            details: 'Villa de 4 chambres avec jardin',
            dateAcquisition: '2020-05-15',
          },
          {
            id: '2',
            type: 'voiture',
            titre: 'Toyota Corolla',
            reference: 'VH-2021-567890',
            adresse: 'Dakar',
            details: 'Toyota Corolla 2021, Gris métallisé',
            dateAcquisition: '2021-08-20',
          },
          {
            id: '3',
            type: 'terrain',
            titre: 'Terrain à Mermoz',
            reference: 'TR-2019-003456',
            adresse: 'Mermoz, Dakar',
            superficie: '500 m²',
            details: 'Terrain constructible',
            dateAcquisition: '2019-03-10',
          },
          {
            id: '4',
            type: 'appartement',
            titre: 'Appartement Fann',
            reference: 'APT-2022-007890',
            adresse: 'Fann, Dakar',
            superficie: '120 m²',
            details: 'Appartement T3 au 3ème étage',
            dateAcquisition: '2022-11-05',
          },
          {
            id: '5',
            type: 'voiture',
            titre: 'Honda CR-V',
            reference: 'VH-2023-123456',
            adresse: 'Dakar',
            details: 'Honda CR-V 2023, Blanc',
            dateAcquisition: '2023-01-12',
          },
        ];
        setProprietes(testProprietes);
      }
    } catch (error) {
      console.error('Error fetching proprietes:', error);
      // Mode simulation : données de test en cas d'erreur
      const testProprietes: Propriete[] = [
        {
          id: '1',
          type: 'maison',
          titre: 'Villa à Almadies',
          reference: 'TF-2020-001234',
          adresse: 'Almadies, Dakar',
          superficie: '250 m²',
          details: 'Villa de 4 chambres avec jardin',
          dateAcquisition: '2020-05-15',
        },
        {
          id: '2',
          type: 'voiture',
          titre: 'Toyota Corolla',
          reference: 'VH-2021-567890',
          adresse: 'Dakar',
          details: 'Toyota Corolla 2021, Gris métallisé',
          dateAcquisition: '2021-08-20',
        },
        {
          id: '3',
          type: 'terrain',
          titre: 'Terrain à Mermoz',
          reference: 'TR-2019-003456',
          adresse: 'Mermoz, Dakar',
          superficie: '500 m²',
          details: 'Terrain constructible',
          dateAcquisition: '2019-03-10',
        },
        {
          id: '4',
          type: 'appartement',
          titre: 'Appartement Fann',
          reference: 'APT-2022-007890',
          adresse: 'Fann, Dakar',
          superficie: '120 m²',
          details: 'Appartement T3 au 3ème étage',
          dateAcquisition: '2022-11-05',
        },
        {
          id: '5',
          type: 'voiture',
          titre: 'Honda CR-V',
          reference: 'VH-2023-123456',
          adresse: 'Dakar',
          details: 'Honda CR-V 2023, Blanc',
          dateAcquisition: '2023-01-12',
        },
      ];
      setProprietes(testProprietes);
    } finally {
      setLoading(false);
    }
  };

  // Formatage de la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
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
            <Text style={styles.title}>Mes Propriétés</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Chargement des propriétés...</Text>
            </View>
          ) : proprietes.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name="home-outline"
                  size={64}
                  color={colors.mutedForeground}
                />
              </View>
              <Text style={styles.emptyText}>Aucune propriété enregistrée</Text>
              <Text style={styles.emptySubtext}>
                Vos biens immobiliers et véhicules apparaîtront ici
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              <Text style={styles.sectionTitle}>Biens immobiliers et véhicules</Text>
              {proprietes.map((propriete) => {
                const propType = proprieteTypes[propriete.type] || proprieteTypes.autre;
                
                return (
                  <TouchableOpacity 
                    key={propriete.id} 
                    style={styles.card}
                    activeOpacity={0.7}
                    onPress={() => setSelectedPropriete(propriete)}
                  >
                    <View style={styles.cardContent}>
                      <View style={[styles.iconContainer, { backgroundColor: propType.color }]}>
                        <Ionicons
                          name={propType.icon as any}
                          size={28}
                          color={colors.white}
                        />
                      </View>
                      <View style={styles.cardInfo}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardTitle}>{propriete.titre}</Text>
                          <View style={styles.typeBadge}>
                            <Text style={styles.typeBadgeText}>{propType.label}</Text>
                          </View>
                        </View>
                        <View style={styles.cardDetails}>
                          <View style={styles.detailRow}>
                            <Ionicons name="hash-outline" size={14} color={colors.mutedForeground} />
                            <Text style={styles.cardSubtitle}>Réf: {propriete.reference}</Text>
                          </View>
                          {propriete.adresse && (
                            <View style={styles.detailRow}>
                              <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
                              <Text style={styles.cardSubtitle}>{propriete.adresse}</Text>
                            </View>
                          )}
                          {propriete.superficie && (
                            <View style={styles.detailRow}>
                              <Ionicons name="resize-outline" size={14} color={colors.mutedForeground} />
                              <Text style={styles.cardSubtitle}>{propriete.superficie}</Text>
                            </View>
                          )}
                          <View style={styles.detailRow}>
                            <Ionicons name="information-circle-outline" size={14} color={colors.mutedForeground} />
                            <Text style={styles.cardSubtitle}>{propriete.details}</Text>
                          </View>
                          {propriete.dateAcquisition && (
                            <View style={styles.detailRow}>
                              <Ionicons name="calendar-outline" size={14} color={colors.mutedForeground} />
                              <Text style={styles.cardSubtitle}>
                                Acquis le {formatDate(propriete.dateAcquisition)}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <Ionicons 
                        name="chevron-forward" 
                        size={20} 
                        color={colors.mutedForeground} 
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Propriete Viewer Modal */}
      <ProprieteViewer
        propriete={selectedPropriete}
        visible={selectedPropriete !== null}
        onClose={() => setSelectedPropriete(null)}
      />
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
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.foreground,
    flex: 1,
  },
  typeBadge: {
    backgroundColor: colors.muted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.foreground,
  },
  cardDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
});



