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
import { Alerte } from '../types';
import { colors } from '../theme/colors';
import { formatDistance } from '../utils/location';

const { width } = Dimensions.get('window');

interface AlertCardProps {
  alerte: Alerte;
  onPress?: () => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alerte, onPress }) => {
  const getTypeIcon = () => {
    switch (alerte.type) {
      case 'fugitif':
        return 'person-remove';
      case 'vol':
        return 'warning';
      case 'incident':
        return 'alert-circle';
      default:
        return 'information-circle';
    }
  };

  const getTypeColor = () => {
    switch (alerte.type) {
      case 'fugitif':
        return colors.destructive;
      case 'vol':
        return colors.warning;
      case 'incident':
        return colors.primary;
      default:
        return colors.mutedForeground;
    }
  };

  const getStatusColor = () => {
    switch (alerte.status) {
      case 'active':
        return colors.secondary;
      case 'resolue':
        return colors.mutedForeground;
      case 'annulee':
        return colors.destructive;
      default:
        return colors.mutedForeground;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.typeIcon, { backgroundColor: getTypeColor() }]}>
          <Ionicons name={getTypeIcon()} size={20} color={colors.white} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.titre}>{alerte.titre}</Text>
          <Text style={styles.createdBy}>Par {alerte.createdByName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>
            {alerte.status === 'active' ? 'ACTIVE' : alerte.status === 'resolue' ? 'RÉSOLUE' : 'ANNULÉE'}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        {alerte.description}
      </Text>

      {/* Suspect info */}
      {alerte.suspect && (
        <View style={styles.suspectSection}>
          <Text style={styles.suspectTitle}>Suspect:</Text>
          {alerte.suspect.nom && (
            <Text style={styles.suspectInfo}>
              Nom: {alerte.suspect.prenom} {alerte.suspect.nom}
            </Text>
          )}
          {alerte.suspect.cni && (
            <Text style={styles.suspectInfo}>CNI: {alerte.suspect.cni}</Text>
          )}
          {alerte.suspect.vehicule?.matricule && (
            <Text style={styles.suspectInfo}>
              Véhicule: {alerte.suspect.vehicule.matricule}
            </Text>
          )}
          {alerte.suspect.sexe && (
            <Text style={styles.suspectInfo}>
              Sexe: {alerte.suspect.sexe === 'homme' ? 'Homme' : alerte.suspect.sexe === 'femme' ? 'Femme' : 'Inconnu'}
            </Text>
          )}
          {(alerte.suspect.ageMin || alerte.suspect.ageMax) && (
            <Text style={styles.suspectInfo}>
              Âge: {alerte.suspect.ageMin || '?'} - {alerte.suspect.ageMax || '?'} ans
            </Text>
          )}
        </View>
      )}

      {/* Images */}
      {alerte.images && alerte.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {alerte.images.slice(0, 3).map((imageUri, index) => (
            <Image
              key={index}
              source={{ uri: imageUri }}
              style={styles.image}
            />
          ))}
          {alerte.images.length > 3 && (
            <View style={styles.moreImages}>
              <Text style={styles.moreImagesText}>+{alerte.images.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.locationInfo}>
          <Ionicons name="location" size={14} color={colors.mutedForeground} />
          <Text style={styles.locationText}>
            {alerte.localisation.adresse || 'Localisation GPS'}
          </Text>
        </View>
        {alerte.distance !== undefined && (
          <View style={styles.distanceInfo}>
            <Ionicons name="navigate" size={14} color={colors.primary} />
            <Text style={styles.distanceText}>
              {formatDistance(alerte.distance)}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.date}>
        {new Date(alerte.createdAt).toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  titre: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  createdBy: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  description: {
    fontSize: 14,
    color: colors.foreground,
    marginBottom: 12,
    lineHeight: 20,
  },
  suspectSection: {
    backgroundColor: colors.muted,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  suspectTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 6,
  },
  suspectInfo: {
    fontSize: 12,
    color: colors.foreground,
    marginBottom: 2,
  },
  imagesContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  image: {
    width: (width - 80) / 3,
    height: 80,
    borderRadius: 8,
  },
  moreImages: {
    width: (width - 80) / 3,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: colors.mutedForeground,
    flex: 1,
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  date: {
    fontSize: 11,
    color: colors.mutedForeground,
    textAlign: 'right',
  },
});
