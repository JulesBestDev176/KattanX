import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VerificationMethod } from '../types';
import { colors } from '../theme/colors';

interface VerificationMethodSelectorProps {
  selectedMethod: 'cni' | 'matricule' | 'photo' | 'permis';
  onSelectMethod: (method: 'cni' | 'matricule' | 'photo' | 'permis') => void;
}

export const VerificationMethodSelector: React.FC<VerificationMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const methods: VerificationMethod[] = [
    {
      type: 'cni',
      label: 'Par CNI',
      icon: 'id-card',
      description: 'Saisir le numéro CNI',
    },
    {
      type: 'matricule',
      label: 'Par Matricule',
      icon: 'car-outline',
      description: 'Saisir ou scanner la plaque',
    },
    {
      type: 'photo',
      label: 'Par Photo',
      icon: 'camera-outline',
      description: 'Reconnaissance faciale IA',
    },
    {
      type: 'permis',
      label: 'Par Permis',
      icon: 'card-outline',
      description: 'Saisir le numéro de permis',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Méthode de vérification</Text>
      <View style={styles.methodsGrid}>
        {methods.map((method) => (
          <TouchableOpacity
            key={method.type}
            style={[
              styles.methodCard,
              selectedMethod === method.type && styles.methodCardSelected,
            ]}
            onPress={() => onSelectMethod(method.type)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                selectedMethod === method.type && styles.iconContainerSelected,
              ]}
            >
              <Ionicons
                name={method.icon as keyof typeof Ionicons.glyphMap}
                size={28}
                color={selectedMethod === method.type ? colors.white : colors.primary}
              />
            </View>
            <Text
              style={[
                styles.methodLabel,
                selectedMethod === method.type && styles.methodLabelSelected,
              ]}
            >
              {method.label}
            </Text>
            <Text
              style={[
                styles.methodDescription,
                selectedMethod === method.type && styles.methodDescriptionSelected,
              ]}
            >
              {method.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 12,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  methodCard: {
    width: '48%', // 2 items per row with gap
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  methodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainerSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
    textAlign: 'center',
  },
  methodLabelSelected: {
    color: colors.white,
  },
  methodDescription: {
    fontSize: 11,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  methodDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
