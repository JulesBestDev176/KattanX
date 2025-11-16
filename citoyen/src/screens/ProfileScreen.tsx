import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from '../components/ui/Toast';
import { API_BASE_URL } from '../utils/supabase';
import { User } from '../types';
import { colors } from '../theme/colors';

interface ProfileScreenProps {
  user: User;
  accessToken: string;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  accessToken,
  onBack,
  onUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        onUpdateUser(data);
        setIsEditing(false);
        toast.success('Profil mis à jour');
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile(user);
    setIsEditing(false);
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
            <Text style={styles.title}>Profil</Text>
            <TouchableOpacity
              onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={loading}
              style={styles.editButton}
            >
              <Ionicons
                name={isEditing ? 'checkmark' : 'create-outline'}
                size={24}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {profile.photo ? (
                <Image 
                  source={{ uri: profile.photo }} 
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={50} color={colors.primary} />
                </View>
              )}
              <View style={styles.photoBadge}>
                <Ionicons name="camera" size={16} color={colors.white} />
              </View>
            </View>
            <Text style={styles.userName}>{profile.name || 'Utilisateur'}</Text>
            <Text style={styles.userEmail}>{profile.email || 'Aucun email'}</Text>
            <Text style={styles.photoNote}>Photo fournie par la DAF</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            
            <View style={styles.inputCard}>
              <Input
                label="Nom complet"
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                editable={isEditing}
                style={!isEditing && styles.disabledInput}
              />
            </View>

            <View style={styles.inputCard}>
              <Input
                label="Email"
                value={profile.email}
                editable={false}
                style={styles.disabledInput}
              />
            </View>

            <View style={styles.inputCard}>
              <Input
                label="CNI"
                value={profile.cni}
                editable={false}
                style={styles.disabledInput}
              />
              <Text style={styles.fieldNote}>Le CNI ne peut pas être modifié</Text>
            </View>

            <View style={styles.inputCard}>
              <Input
                label="Téléphone"
                value={profile.tel}
                onChangeText={(text) => setProfile({ ...profile, tel: text })}
                editable={isEditing}
                keyboardType="phone-pad"
                style={!isEditing && styles.disabledInput}
              />
            </View>

            {isEditing && (
              <View style={styles.buttonContainer}>
                <Button
                  title={loading ? 'Enregistrement...' : 'Enregistrer'}
                  onPress={handleSave}
                  disabled={loading}
                  loading={loading}
                  style={styles.saveButton}
                />
                <Button
                  title="Annuler"
                  onPress={handleCancel}
                  variant="outline"
                  style={styles.cancelButton}
                />
              </View>
            )}
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
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  content: {
    paddingBottom: 40,
  },
  avatarSection: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.muted,
    borderWidth: 3,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  photoNote: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontStyle: 'italic',
  },
  formSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 12,
    marginLeft: 4,
  },
  inputCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabledInput: {
    backgroundColor: colors.muted,
  },
  fieldNote: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 8,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {},
});
