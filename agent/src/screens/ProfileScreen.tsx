import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Agent } from '../types';
import { colors } from '../theme/colors';

interface ProfileScreenProps {
  agent: Agent;
  onBack: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  agent,
  onBack,
  onLogout,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil Agent</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Photo et nom */}
          <View style={styles.profileHeader}>
            <View style={styles.photoContainer}>
              <Ionicons name="person" size={50} color={colors.white} />
            </View>
            <Text style={styles.name}>{agent.name}</Text>
            <Text style={styles.corps}>{agent.corps}</Text>
            <Text style={styles.matricule}>Matricule: {agent.matricule}</Text>
          </View>

          {/* Informations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CNI</Text>
                <Text style={styles.infoValue}>{agent.cni}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{agent.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>{agent.tel}</Text>
              </View>
            </View>
          </View>

          {/* Statistiques */}
          {agent.stats && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statistiques</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
                  <Text style={styles.statValue}>{agent.stats.verificationsEffectuees}</Text>
                  <Text style={styles.statLabel}>Vérifications</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Ionicons name="notifications" size={32} color={colors.destructive} />
                  <Text style={styles.statValue}>{agent.stats.alertesCreees}</Text>
                  <Text style={styles.statLabel}>Alertes créées</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Ionicons name="hand-left" size={32} color={colors.secondary} />
                  <Text style={styles.statValue}>{agent.stats.arrestations}</Text>
                  <Text style={styles.statLabel}>Arrestations</Text>
                </View>
              </View>
            </View>
          )}

          {/* Déconnexion */}
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Ionicons name="log-out" size={20} color={colors.destructive} />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 4,
  },
  corps: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  matricule: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
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
    color: colors.foreground,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.destructive,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.destructive,
  },
});
