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
import { Dossier, User } from '../types';
import { colors } from '../theme/colors';
import { DocumentViewer } from '../components/DocumentViewer';

interface DossierScreenProps {
  accessToken: string;
  user: User;
  onBack: () => void;
}

// Types de documents administratifs avec leurs labels et icônes
// Utilisation de seulement 2 couleurs : primary et secondary
const documentTypes = {
  cni: { label: 'Carte Nationale d\'Identité', icon: 'card', color: colors.primary },
  passeport: { label: 'Passeport', icon: 'book', color: colors.primary },
  extrait_naissance: { label: 'Extrait de Naissance', icon: 'document-text', color: colors.primary },
  casier_judiciaire: { label: 'Casier Judiciaire', icon: 'shield-checkmark', color: colors.secondary },
  acte_mariage: { label: 'Acte de Mariage', icon: 'heart', color: colors.primary },
  acte_deces: { label: 'Acte de Décès', icon: 'close-circle', color: colors.mutedForeground },
  certificat_residence: { label: 'Certificat de Résidence', icon: 'home', color: colors.primary },
  permis_conduire: { label: 'Permis de Conduire', icon: 'car', color: colors.secondary },
  carte_sejour: { label: 'Carte de Séjour', icon: 'id-card', color: colors.primary },
  autre: { label: 'Autre Document', icon: 'document', color: colors.mutedForeground },
};

export const DossierScreen: React.FC<DossierScreenProps> = ({
  accessToken,
  user,
  onBack,
}) => {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dossiers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDossiers(data);
      } else {
        // Mode simulation : données de test
        const testDossiers: Dossier[] = [
          {
            id: '1',
            type: 'cni',
            numero: '1234567890123',
            dateEmission: '2020-01-15',
            dateExpiration: '2030-01-15',
            statut: 'valide',
          },
          {
            id: '2',
            type: 'passeport',
            numero: 'AB123456',
            dateEmission: '2022-03-20',
            dateExpiration: '2032-03-20',
            statut: 'valide',
          },
          {
            id: '3',
            type: 'extrait_naissance',
            numero: 'N-2023-001234',
            dateEmission: '2023-05-10',
            statut: 'valide',
          },
          {
            id: '4',
            type: 'casier_judiciaire',
            numero: 'CJ-2024-000567',
            dateEmission: '2024-01-08',
            statut: 'valide',
          },
          {
            id: '5',
            type: 'permis_conduire',
            numero: 'PD-987654',
            dateEmission: '2019-06-12',
            dateExpiration: '2029-06-12',
            statut: 'valide',
          },
          {
            id: '6',
            type: 'certificat_residence',
            numero: 'CR-2023-0456',
            dateEmission: '2023-11-25',
            statut: 'valide',
          },
          {
            id: '7',
            type: 'acte_mariage',
            numero: 'AM-2018-002345',
            dateEmission: '2018-09-15',
            statut: 'valide',
          },
        ];
        setDossiers(testDossiers);
      }
    } catch (error) {
      console.error('Error fetching dossiers:', error);
      // Mode simulation : données de test en cas d'erreur
      const testDossiers: Dossier[] = [
        {
          id: '1',
          type: 'cni',
          numero: '1234567890123',
          dateEmission: '2020-01-15',
          dateExpiration: '2030-01-15',
          statut: 'valide',
        },
        {
          id: '2',
          type: 'passeport',
          numero: 'AB123456',
          dateEmission: '2022-03-20',
          dateExpiration: '2032-03-20',
          statut: 'valide',
        },
        {
          id: '3',
          type: 'extrait_naissance',
          numero: 'N-2023-001234',
          dateEmission: '2023-05-10',
          statut: 'valide',
        },
        {
          id: '4',
          type: 'casier_judiciaire',
          numero: 'CJ-2024-000567',
          dateEmission: '2024-01-08',
          statut: 'valide',
        },
        {
          id: '5',
          type: 'permis_conduire',
          numero: 'PD-987654',
          dateEmission: '2019-06-12',
          dateExpiration: '2029-06-12',
          statut: 'valide',
        },
        {
          id: '6',
          type: 'certificat_residence',
          numero: 'CR-2023-0456',
          dateEmission: '2023-11-25',
          statut: 'valide',
        },
        {
          id: '7',
          type: 'acte_mariage',
          numero: 'AM-2018-002345',
          dateEmission: '2018-09-15',
          statut: 'valide',
        },
      ];
      setDossiers(testDossiers);
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.title}>Mes Dossiers</Text>
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
              <Text style={styles.loadingText}>Chargement des documents...</Text>
            </View>
          ) : dossiers.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name="folder-outline"
                  size={64}
                  color={colors.mutedForeground}
                />
              </View>
              <Text style={styles.emptyText}>Aucun document disponible</Text>
              <Text style={styles.emptySubtext}>
                Les documents administratifs de la DAF apparaîtront ici
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              <Text style={styles.sectionTitle}>Documents administratifs</Text>
              {dossiers.map((dossier) => {
                const docType = documentTypes[dossier.type] || documentTypes.autre;
                const isExpired = dossier.statut === 'expire';
                const isPending = dossier.statut === 'en_attente';
                
                return (
                  <TouchableOpacity 
                    key={dossier.id} 
                    style={[styles.card, isExpired && styles.cardExpired]}
                    activeOpacity={0.7}
                    onPress={() => setSelectedDossier(dossier)}
                  >
                    <View style={styles.cardContent}>
                      <View style={[styles.iconContainer, { backgroundColor: docType.color }]}>
                        <Ionicons
                          name={docType.icon as any}
                          size={28}
                          color={colors.white}
                        />
                      </View>
                      <View style={styles.cardInfo}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardTitle}>{docType.label}</Text>
                          {isExpired && (
                            <View style={styles.badgeExpired}>
                              <Text style={styles.badgeText}>Expiré</Text>
                            </View>
                          )}
                          {isPending && (
                            <View style={styles.badgePending}>
                              <Text style={styles.badgeText}>En attente</Text>
                            </View>
                          )}
                          {dossier.statut === 'valide' && (
                            <View style={styles.badgeValid}>
                              <Text style={styles.badgeText}>Valide</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.cardDetails}>
                          <View style={styles.detailRow}>
                            <Ionicons name="hash-outline" size={14} color={colors.mutedForeground} />
                            <Text style={styles.cardSubtitle}>N° {dossier.numero}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Ionicons name="calendar-outline" size={14} color={colors.mutedForeground} />
                            <Text style={styles.cardSubtitle}>
                              Émis le {dossier.dateEmission}
                            </Text>
                          </View>
                          {dossier.dateExpiration && (
                            <View style={styles.detailRow}>
                              <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
                              <Text style={[styles.cardSubtitle, isExpired && styles.textExpired]}>
                                Expire le {dossier.dateExpiration}
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

      {/* Document Viewer Modal */}
      <DocumentViewer
        dossier={selectedDossier}
        user={user}
        visible={selectedDossier !== null}
        onClose={() => setSelectedDossier(null)}
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
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 8,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  badgeExpired: {
    backgroundColor: colors.destructive,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgePending: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeValid: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
    textTransform: 'uppercase',
  },
  cardExpired: {
    opacity: 0.7,
    borderColor: colors.destructive,
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
  textExpired: {
    color: colors.destructive,
    fontWeight: '500',
  },
});



