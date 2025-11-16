import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, Screen } from '../types';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  user: User;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

interface MenuItem {
  id: Screen;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  description?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  onNavigate,
  onLogout,
}) => {
  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      icon: 'person-circle',
      label: 'Profil',
      color: colors.primary,
      description: 'Gérer vos informations',
    },
    {
      id: 'dossier',
      icon: 'folder',
      label: 'Dossier',
      color: colors.primary,
      description: 'Documents administratifs',
    },
    {
      id: 'proprietes',
      icon: 'business',
      label: 'Propriétés',
      color: colors.primary,
      description: 'Titres fonciers, véhicules',
    },
    {
      id: 'denonciations',
      icon: 'alert-circle',
      label: 'Dénonciations',
      color: colors.destructive,
      description: 'Signaler un problème',
    },
    {
      id: 'plaintes',
      icon: 'document-text',
      label: 'Plaintes',
      color: colors.primary,
      description: 'Dépôt et suivi',
    },
    {
      id: 'revenus',
      icon: 'wallet',
      label: 'Revenus',
      color: colors.secondary,
      description: 'Gains et transferts',
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
              <Text style={styles.title}>{user.name || 'Utilisateur'}</Text>
              <Text style={styles.subtitle}>Portail Citoyen KattanX</Text>
            </View>
            <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 20,
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
});



