import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IndividuVerifie } from '../types';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

interface IndividuCardProps {
  individu: IndividuVerifie;
  onDemandeArrestation?: () => void;
  onCreerAmende?: () => void;
  onPartagerAlerte?: () => void;
}

export const IndividuCard: React.FC<IndividuCardProps> = ({
  individu,
  onDemandeArrestation,
  onCreerAmende,
  onPartagerAlerte,
}) => {
  return (
    <View style={styles.container}>
      {/* Header avec photo et infos principales */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/1.jpg')} style={styles.photo} />
        
        <View style={styles.headerInfo}>
          <Text style={styles.nom}>
            {individu.prenom} {individu.nom}
          </Text>
          <Text style={styles.cni}>CNI: {individu.cni}</Text>
          {individu.dateNaissance && (
            <Text style={styles.detail}>Né(e) le {individu.dateNaissance}</Text>
          )}
          {individu.tel && (
            <Text style={styles.detail}>Tél: {individu.tel}</Text>
          )}
        </View>
      </View>

      {/* Badges de statut */}
      <View style={styles.badges}>
        {individu.estRecherche && (
          <View style={[styles.badge, styles.badgeRecherche]}>
            <Ionicons name="alert-circle" size={16} color={colors.white} />
            <Text style={styles.badgeText}>RECHERCHÉ</Text>
          </View>
        )}
        
        {individu.totalAmendes > 0 && (
          <View style={[styles.badge, styles.badgeAmende]}>
            <Ionicons name="warning" size={16} color={colors.white} />
            <Text style={styles.badgeText}>
              {individu.amendes.filter(a => a.status === 'impayee').length} AMENDE(S)
            </Text>
          </View>
        )}
        
        {individu.estConnuJustice && (
          <View style={[styles.badge, styles.badgeCasier]}>
            <Ionicons name="document-text" size={16} color={colors.white} />
            <Text style={styles.badgeText}>CASIER JUDICIAIRE</Text>
          </View>
        )}
      </View>

      {/* Détails */}
      {individu.estRecherche && individu.motifRecherche && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motif de recherche</Text>
          <Text style={styles.sectionContent}>{individu.motifRecherche}</Text>
        </View>
      )}

      {individu.amendes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Amendes ({individu.amendes.filter(a => a.status === 'impayee').length} impayée(s))
          </Text>
          {individu.amendes.filter(a => a.status === 'impayee').map((amende) => (
            <View key={amende.id} style={styles.amendeItem}>
              <Text style={styles.amendeMotif}>{amende.motif}</Text>
              <Text style={styles.amendeMontant}>{amende.montant.toLocaleString()} FCFA</Text>
            </View>
          ))}
          <Text style={styles.totalAmendes}>
            Total: {individu.totalAmendes.toLocaleString()} FCFA
          </Text>
        </View>
      )}

      {individu.casierJudiciaire.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Casier judiciaire</Text>
          {individu.casierJudiciaire.map((entry) => (
            <View key={entry.id} style={styles.casierItem}>
              <Text style={styles.casierType}>{entry.type.toUpperCase()}</Text>
              <Text style={styles.casierDescription}>{entry.description}</Text>
              <Text style={styles.casierDate}>Date: {entry.date}</Text>
              {entry.peine && (
                <Text style={styles.casierPeine}>Peine: {entry.peine}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {individu.vehicules && individu.vehicules.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Véhicules</Text>
          {individu.vehicules.map((vehicule) => (
            <View key={vehicule.id} style={styles.vehiculeItem}>
              <Text style={styles.vehiculeMatricule}>{vehicule.matricule}</Text>
              <Text style={styles.vehiculeDetails}>
                {vehicule.marque} {vehicule.modele} - {vehicule.couleur}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {onDemandeArrestation && individu.estRecherche && (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={onDemandeArrestation}
          >
            <Ionicons name="hand-left" size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Demander arrestation</Text>
          </TouchableOpacity>
        )}
        
        {onCreerAmende && (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={onCreerAmende}
          >
            <Ionicons name="document" size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Créer amende</Text>
          </TouchableOpacity>
        )}
        
        {onPartagerAlerte && (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonWarning]}
            onPress={onPartagerAlerte}
          >
            <Ionicons name="share" size={20} color={colors.white} />
            <Text style={styles.actionButtonText}>Partager alerte</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  photoPlaceholder: {
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 4,
  },
  cni: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 2,
  },
  detail: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  badgeRecherche: {
    backgroundColor: colors.recherche,
  },
  badgeAmende: {
    backgroundColor: colors.amende,
  },
  badgeCasier: {
    backgroundColor: colors.casier,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  section: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: colors.foreground,
  },
  amendeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  amendeMotif: {
    fontSize: 13,
    color: colors.foreground,
    flex: 1,
  },
  amendeMontant: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.amende,
  },
  totalAmendes: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.amende,
    marginTop: 8,
    textAlign: 'right',
  },
  casierItem: {
    backgroundColor: colors.muted,
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  casierType: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.casier,
    marginBottom: 4,
  },
  casierDescription: {
    fontSize: 13,
    color: colors.foreground,
    marginBottom: 2,
  },
  casierDate: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  casierPeine: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  vehiculeItem: {
    backgroundColor: colors.muted,
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  vehiculeMatricule: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  vehiculeDetails: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  actions: {
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonPrimary: {
    backgroundColor: colors.destructive,
  },
  actionButtonSecondary: {
    backgroundColor: colors.primary,
  },
  actionButtonWarning: {
    backgroundColor: colors.warning,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
