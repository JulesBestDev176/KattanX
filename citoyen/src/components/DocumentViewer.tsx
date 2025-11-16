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
import { Dossier, User } from '../types';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

interface DocumentViewerProps {
  dossier: Dossier | null;
  user: User;
  visible: boolean;
  onClose: () => void;
}

const documentTypes = {
  cni: { label: 'Carte Nationale d\'Identité', icon: 'card' },
  passeport: { label: 'Passeport', icon: 'book' },
  extrait_naissance: { label: 'Extrait de Naissance', icon: 'document-text' },
  casier_judiciaire: { label: 'Casier Judiciaire', icon: 'shield-checkmark' },
  acte_mariage: { label: 'Acte de Mariage', icon: 'heart' },
  acte_deces: { label: 'Acte de Décès', icon: 'close-circle' },
  certificat_residence: { label: 'Certificat de Résidence', icon: 'home' },
  permis_conduire: { label: 'Permis de Conduire', icon: 'car' },
  carte_sejour: { label: 'Carte de Séjour', icon: 'id-card' },
  autre: { label: 'Autre Document', icon: 'document' },
};

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  dossier,
  user,
  visible,
  onClose,
}) => {
  if (!dossier) return null;

  const docType = documentTypes[dossier.type] || documentTypes.autre;

  // Formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Affichage de la CNI sénégalaise
  const renderCNI = () => {
    const nameParts = user.name.split(' ');
    const prenom = nameParts[0] || '';
    const nom = nameParts.slice(1).join(' ') || user.name;
    
    return (
      <View style={styles.cniContainer}>
        {/* En-tête CNI Sénégalaise */}
        <View style={styles.cniHeader}>
          <View style={styles.cniHeaderTop}>
            <Text style={styles.cniHeaderText}>RÉPUBLIQUE DU SÉNÉGAL</Text>
            <Text style={styles.cniHeaderSubtext}>Un Peuple - Un But - Une Foi</Text>
          </View>
          <View style={styles.cniHeaderBottom}>
            <Text style={styles.cniTitle}>CARTE NATIONALE D'IDENTITÉ</Text>
          </View>
        </View>

        {/* Corps de la CNI */}
        <View style={styles.cniBody}>
          {/* Photo et informations principales */}
          <View style={styles.cniMainSection}>
            <View style={styles.cniPhotoSection}>
              {user.photo ? (
                <View style={styles.cniPhotoContainer}>
                  <Text style={styles.cniPhotoPlaceholder}>PHOTO</Text>
                </View>
              ) : (
                <View style={styles.cniPhotoContainer}>
                  <Ionicons name="person" size={40} color={colors.mutedForeground} />
                </View>
              )}
            </View>
            
            <View style={styles.cniInfoSection}>
              <View style={styles.cniInfoRow}>
                <Text style={styles.cniLabel}>Nom:</Text>
                <Text style={styles.cniValue}>{nom.toUpperCase()}</Text>
              </View>
              <View style={styles.cniInfoRow}>
                <Text style={styles.cniLabel}>Prénom(s):</Text>
                <Text style={styles.cniValue}>{prenom}</Text>
              </View>
              <View style={styles.cniInfoRow}>
                <Text style={styles.cniLabel}>N° CNI:</Text>
                <Text style={styles.cniValue}>{dossier.numero}</Text>
              </View>
              <View style={styles.cniInfoRow}>
                <Text style={styles.cniLabel}>Né(e) le:</Text>
                <Text style={styles.cniValue}>{formatDate(dossier.dateEmission)}</Text>
              </View>
              <View style={styles.cniInfoRow}>
                <Text style={styles.cniLabel}>À:</Text>
                <Text style={styles.cniValue}>Dakar, Sénégal</Text>
              </View>
            </View>
          </View>

          {/* Informations secondaires */}
          <View style={styles.cniSecondarySection}>
            <View style={styles.cniInfoRow}>
              <Text style={styles.cniLabel}>Taille:</Text>
              <Text style={styles.cniValue}>--</Text>
            </View>
            <View style={styles.cniInfoRow}>
              <Text style={styles.cniLabel}>Tél:</Text>
              <Text style={styles.cniValue}>{user.tel}</Text>
            </View>
            <View style={styles.cniInfoRow}>
              <Text style={styles.cniLabel}>Délivrée le:</Text>
              <Text style={styles.cniValue}>{formatDate(dossier.dateEmission)}</Text>
            </View>
            {dossier.dateExpiration && (
              <View style={styles.cniInfoRow}>
                <Text style={styles.cniLabel}>Expire le:</Text>
                <Text style={styles.cniValue}>{formatDate(dossier.dateExpiration)}</Text>
              </View>
            )}
          </View>

          {/* Signature et cachet */}
          <View style={styles.cniFooter}>
            <View style={styles.cniSignature}>
              <Text style={styles.cniSignatureText}>Signature du titulaire</Text>
              <View style={styles.cniSignatureLine} />
            </View>
            <View style={styles.cniStamp}>
              <Text style={styles.cniStampText}>CACHET</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Affichage générique pour les autres documents
  const renderGenericDocument = () => {
    return (
      <View style={styles.genericContainer}>
        <View style={styles.genericHeader}>
          <View style={styles.genericIconContainer}>
            <Ionicons name={docType.icon as any} size={48} color={colors.primary} />
          </View>
          <Text style={styles.genericTitle}>{docType.label}</Text>
        </View>

        <View style={styles.genericBody}>
          <View style={styles.genericInfoCard}>
            <View style={styles.genericInfoRow}>
              <Text style={styles.genericLabel}>Numéro:</Text>
              <Text style={styles.genericValue}>{dossier.numero}</Text>
            </View>
            <View style={styles.genericInfoRow}>
              <Text style={styles.genericLabel}>Nom complet:</Text>
              <Text style={styles.genericValue}>{user.name}</Text>
            </View>
            <View style={styles.genericInfoRow}>
              <Text style={styles.genericLabel}>CNI:</Text>
              <Text style={styles.genericValue}>{user.cni}</Text>
            </View>
            <View style={styles.genericInfoRow}>
              <Text style={styles.genericLabel}>Date d'émission:</Text>
              <Text style={styles.genericValue}>{formatDate(dossier.dateEmission)}</Text>
            </View>
            {dossier.dateExpiration && (
              <View style={styles.genericInfoRow}>
                <Text style={styles.genericLabel}>Date d'expiration:</Text>
                <Text style={[styles.genericValue, dossier.statut === 'expire' && styles.textExpired]}>
                  {formatDate(dossier.dateExpiration)}
                </Text>
              </View>
            )}
            <View style={styles.genericInfoRow}>
              <Text style={styles.genericLabel}>Statut:</Text>
              <View style={[
                styles.statusBadge,
                dossier.statut === 'valide' && styles.statusBadgeValid,
                dossier.statut === 'expire' && styles.statusBadgeExpired,
                dossier.statut === 'en_attente' && styles.statusBadgePending,
              ]}>
                <Text style={styles.statusBadgeText}>
                  {dossier.statut === 'valide' ? 'Valide' : 
                   dossier.statut === 'expire' ? 'Expiré' : 'En attente'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
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
            <Text style={styles.modalTitle}>{docType.label}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Document Content */}
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {dossier.type === 'cni' ? renderCNI() : renderGenericDocument()}
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
  // CNI Styles
  cniContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  cniHeader: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cniHeaderTop: {
    alignItems: 'center',
    marginBottom: 8,
  },
  cniHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 1,
  },
  cniHeaderSubtext: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  cniHeaderBottom: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 8,
  },
  cniTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.5,
  },
  cniBody: {
    padding: 20,
  },
  cniMainSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cniPhotoSection: {
    marginRight: 16,
  },
  cniPhotoContainer: {
    width: 100,
    height: 120,
    backgroundColor: colors.muted,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cniPhotoPlaceholder: {
    fontSize: 10,
    color: colors.mutedForeground,
    fontWeight: '600',
  },
  cniInfoSection: {
    flex: 1,
  },
  cniInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  cniLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.foreground,
    width: 80,
    marginRight: 8,
  },
  cniValue: {
    fontSize: 12,
    color: colors.foreground,
    flex: 1,
    fontWeight: '500',
  },
  cniSecondarySection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    marginBottom: 16,
  },
  cniFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  cniSignature: {
    flex: 1,
  },
  cniSignatureText: {
    fontSize: 10,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  cniSignatureLine: {
    width: 120,
    height: 1,
    backgroundColor: colors.foreground,
    marginTop: 20,
  },
  cniStamp: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.muted,
  },
  cniStampText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  // Generic Document Styles
  genericContainer: {
    backgroundColor: colors.white,
  },
  genericHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  genericIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  genericTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
  },
  genericBody: {
    marginTop: 8,
  },
  genericInfoCard: {
    backgroundColor: colors.muted,
    borderRadius: 12,
    padding: 20,
  },
  genericInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  genericLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mutedForeground,
    flex: 1,
  },
  genericValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeValid: {
    backgroundColor: colors.secondary,
  },
  statusBadgeExpired: {
    backgroundColor: colors.destructive,
  },
  statusBadgePending: {
    backgroundColor: '#f59e0b',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  textExpired: {
    color: colors.destructive,
    fontWeight: '600',
  },
});

