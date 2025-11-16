import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Propriete } from '../types';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

interface ProprieteViewerProps {
  propriete: Propriete | null;
  visible: boolean;
  onClose: () => void;
}

const proprieteTypes = {
  maison: { label: 'Maison', icon: 'home', color: colors.primary },
  voiture: { label: 'Voiture', icon: 'car', color: colors.secondary },
  terrain: { label: 'Terrain', icon: 'map', color: colors.primary },
  appartement: { label: 'Appartement', icon: 'business', color: colors.primary },
  commerce: { label: 'Commerce', icon: 'storefront', color: colors.secondary },
  autre: { label: 'Autre', icon: 'cube', color: colors.mutedForeground },
};

export const ProprieteViewer: React.FC<ProprieteViewerProps> = ({
  propriete,
  visible,
  onClose,
}) => {
  if (!propriete) return null;

  const propType = proprieteTypes[propriete.type] || proprieteTypes.autre;

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
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIcon, { backgroundColor: propType.color }]}>
                <Ionicons name={propType.icon as any} size={24} color={colors.white} />
              </View>
              <Text style={styles.modalTitle}>{propType.label}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Titre principal */}
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>{propriete.titre}</Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{propType.label}</Text>
              </View>
            </View>

            {/* Informations principales */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Informations principales</Text>
              
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.infoLabelContainer}>
                    <Ionicons name="hash-outline" size={18} color={colors.primary} />
                    <Text style={styles.infoLabel}>Référence</Text>
                  </View>
                  <Text style={styles.infoValue}>{propriete.reference}</Text>
                </View>

                {propriete.adresse && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoLabelContainer}>
                      <Ionicons name="location-outline" size={18} color={colors.primary} />
                      <Text style={styles.infoLabel}>Adresse</Text>
                    </View>
                    <Text style={styles.infoValue}>{propriete.adresse}</Text>
                  </View>
                )}

                {propriete.superficie && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoLabelContainer}>
                      <Ionicons name="resize-outline" size={18} color={colors.primary} />
                      <Text style={styles.infoLabel}>Superficie</Text>
                    </View>
                    <Text style={styles.infoValue}>{propriete.superficie}</Text>
                  </View>
                )}

                {propriete.dateAcquisition && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoLabelContainer}>
                      <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                      <Text style={styles.infoLabel}>Date d'acquisition</Text>
                    </View>
                    <Text style={styles.infoValue}>{formatDate(propriete.dateAcquisition)}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Détails */}
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Détails</Text>
              <View style={styles.detailsCard}>
                <View style={styles.detailsRow}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
                  <Text style={styles.detailsText}>{propriete.details}</Text>
                </View>
              </View>
            </View>

            {/* Informations spécifiques selon le type */}
            {propriete.type === 'voiture' && (
              <View style={styles.specificSection}>
                <Text style={styles.sectionTitle}>Informations véhicule</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoLabelContainer}>
                      <Ionicons name="car-sport-outline" size={18} color={colors.primary} />
                      <Text style={styles.infoLabel}>Modèle</Text>
                    </View>
                    <Text style={styles.infoValue}>{propriete.titre}</Text>
                  </View>
                  {propriete.adresse && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoLabelContainer}>
                        <Ionicons name="location-outline" size={18} color={colors.primary} />
                        <Text style={styles.infoLabel}>Localisation</Text>
                      </View>
                      <Text style={styles.infoValue}>{propriete.adresse}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {(propriete.type === 'maison' || propriete.type === 'appartement' || propriete.type === 'terrain') && (
              <View style={styles.specificSection}>
                <Text style={styles.sectionTitle}>Informations immobilières</Text>
                <View style={styles.infoCard}>
                  {propriete.superficie && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoLabelContainer}>
                        <Ionicons name="resize-outline" size={18} color={colors.primary} />
                        <Text style={styles.infoLabel}>Superficie</Text>
                      </View>
                      <Text style={styles.infoValue}>{propriete.superficie}</Text>
                    </View>
                  )}
                  {propriete.adresse && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoLabelContainer}>
                        <Ionicons name="location-outline" size={18} color={colors.primary} />
                        <Text style={styles.infoLabel}>Adresse complète</Text>
                      </View>
                      <Text style={styles.infoValue}>{propriete.adresse}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.95,
    maxHeight: '90%',
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.primary,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollContent: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: colors.muted,
    borderRadius: 12,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    flex: 1,
    textAlign: 'right',
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsCard: {
    backgroundColor: colors.muted,
    borderRadius: 12,
    padding: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailsText: {
    fontSize: 14,
    color: colors.foreground,
    lineHeight: 22,
    flex: 1,
  },
  specificSection: {
    marginBottom: 24,
  },
});

