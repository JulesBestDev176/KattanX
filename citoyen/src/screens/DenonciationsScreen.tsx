import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from '../components/ui/Toast';
import { API_BASE_URL } from '../utils/supabase';
import { Denonciation } from '../types';
import { colors } from '../theme/colors';

interface DenonciationsScreenProps {
  accessToken: string;
  onBack: () => void;
}

export const DenonciationsScreen: React.FC<DenonciationsScreenProps> = ({
  accessToken,
  onBack,
}) => {
  const [denonciations, setDenonciations] = useState<Denonciation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [preuveType, setPreuveType] = useState('');

  useEffect(() => {
    fetchDenonciations();
  }, []);

  const fetchDenonciations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/denonciations`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDenonciations(data);
      }
    } catch (error) {
      console.error('Error fetching denonciations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!type || !description || !localisation || !preuveType) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/denonciations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          type,
          description,
          localisation,
          preuveType,
        }),
      });

      if (response.ok) {
        const newDenonciation = await response.json();
        setDenonciations([newDenonciation, ...denonciations]);
        setShowForm(false);
        setType('');
        setDescription('');
        setLocalisation('');
        setPreuveType('');
        toast.success('Alerte envoyée avec succès');
      } else {
        throw new Error("Erreur lors de l'envoi");
      }
    } catch (error: any) {
      console.error('Error creating denonciation:', error);
      toast.error(error.message || "Erreur lors de l'envoi de l'alerte");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'En attente':
        return { name: 'time-outline' as const, color: '#eab308' };
      case 'Vérifiée':
        return { name: 'checkmark-circle' as const, color: colors.secondary };
      case 'Rejetée':
        return { name: 'close-circle' as const, color: colors.destructive };
      default:
        return { name: 'time-outline' as const, color: colors.mutedForeground };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'Vérifiée':
        return { bg: '#d1fae5', text: '#065f46' };
      case 'Rejetée':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: colors.muted, text: colors.mutedForeground };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Dénonciations</Text>
        <TouchableOpacity
          onPress={() => setShowForm(true)}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : denonciations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="warning-outline"
              size={64}
              color={colors.mutedForeground}
            />
            <Text style={styles.emptyText}>Aucune dénonciation</Text>
            <Button
              title="Lancer une alerte"
              onPress={() => setShowForm(true)}
              style={styles.emptyButton}
            />
          </View>
        ) : (
          <View style={styles.list}>
            {denonciations.map((denonciation) => {
              const statusIcon = getStatusIcon(denonciation.status);
              const statusColor = getStatusColor(denonciation.status);
              return (
                <View key={denonciation.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardTitle}>{denonciation.type}</Text>
                      <Text style={styles.cardId}>{denonciation.id}</Text>
                    </View>
                    <Ionicons
                      name={statusIcon.name}
                      size={20}
                      color={statusIcon.color}
                    />
                  </View>
                  <Text style={styles.cardDescription}>
                    {denonciation.description}
                  </Text>
                  <View style={styles.cardLocation}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={colors.mutedForeground}
                    />
                    <Text style={styles.cardLocationText}>
                      {denonciation.localisation}
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardDate}>
                      {new Date(denonciation.createdAt).toLocaleDateString(
                        'fr-FR'
                      )}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusColor.bg },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: statusColor.text }]}>
                        {denonciation.status}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Form Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle Alerte</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Ionicons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Input
                label="Type d'incident"
                value={type}
                onChangeText={setType}
                placeholder="Ex: Accident, Incendie, Vol..."
              />

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.textarea}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Décrivez l'incident en détail..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>

              <Input
                label="Localisation"
                value={localisation}
                onChangeText={setLocalisation}
                placeholder="Adresse ou coordonnées"
              />

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Type de preuve</Text>
                <View style={styles.preuveButtons}>
                  <TouchableOpacity
                    style={[
                      styles.preuveButton,
                      preuveType === 'image' && styles.preuveButtonActive,
                    ]}
                    onPress={() => setPreuveType('image')}
                  >
                    <Ionicons
                      name="camera"
                      size={20}
                      color={
                        preuveType === 'image' ? colors.white : colors.foreground
                      }
                    />
                    <Text
                      style={[
                        styles.preuveButtonText,
                        preuveType === 'image' && styles.preuveButtonTextActive,
                      ]}
                    >
                      Image
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.preuveButton,
                      preuveType === 'audio' && styles.preuveButtonActive,
                    ]}
                    onPress={() => setPreuveType('audio')}
                  >
                    <Ionicons
                      name="mic"
                      size={20}
                      color={
                        preuveType === 'audio' ? colors.white : colors.foreground
                      }
                    />
                    <Text
                      style={[
                        styles.preuveButtonText,
                        preuveType === 'audio' && styles.preuveButtonTextActive,
                      ]}
                    >
                      Audio
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.preuveButton,
                      preuveType === 'video' && styles.preuveButtonActive,
                    ]}
                    onPress={() => setPreuveType('video')}
                  >
                    <Ionicons
                      name="videocam"
                      size={20}
                      color={
                        preuveType === 'video' ? colors.white : colors.foreground
                      }
                    />
                    <Text
                      style={[
                        styles.preuveButtonText,
                        preuveType === 'video' && styles.preuveButtonTextActive,
                      ]}
                    >
                      Vidéo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Button
                title={submitting ? 'Envoi en cours...' : "Envoyer l'alerte"}
                onPress={handleSubmit}
                disabled={submitting}
                loading={submitting}
                style={styles.submitButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  addButton: {
    padding: 8,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.mutedForeground,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: colors.mutedForeground,
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 200,
  },
  list: {
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  cardId: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLocationText: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  modalBody: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 6,
  },
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.foreground,
    minHeight: 100,
  },
  preuveButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  preuveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    gap: 8,
  },
  preuveButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  preuveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  preuveButtonTextActive: {
    color: colors.white,
  },
  submitButton: {
    marginTop: 8,
  },
});



