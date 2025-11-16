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
import { Plainte } from '../types';
import { colors } from '../theme/colors';

interface PlaintesScreenProps {
  accessToken: string;
  onBack: () => void;
}

export const PlaintesScreen: React.FC<PlaintesScreenProps> = ({
  accessToken,
  onBack,
}) => {
  const [plaintes, setPlaintes] = useState<Plainte[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [objet, setObjet] = useState('');
  const [description, setDescription] = useState('');
  const [commissariat, setCommissariat] = useState('');

  useEffect(() => {
    fetchPlaintes();
  }, []);

  const fetchPlaintes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/plaintes`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlaintes(data);
      }
    } catch (error) {
      console.error('Error fetching plaintes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!objet || !description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/plaintes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          type: 'déposée',
          objet,
          description,
          commissariat,
        }),
      });

      if (response.ok) {
        const newPlainte = await response.json();
        setPlaintes([newPlainte, ...plaintes]);
        setShowForm(false);
        setObjet('');
        setDescription('');
        setCommissariat('');
        toast.success('Plainte déposée avec succès');
      } else {
        throw new Error('Erreur lors du dépôt');
      }
    } catch (error: any) {
      console.error('Error creating plainte:', error);
      toast.error(error.message || 'Erreur lors du dépôt de la plainte');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Plaintes</Text>
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
        ) : plaintes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="document-text-outline"
              size={64}
              color={colors.mutedForeground}
            />
            <Text style={styles.emptyText}>Aucune plainte</Text>
            <Text style={styles.emptySubtext}>
              Vous n'avez ni plainte reçue ni plainte déposée
            </Text>
            <Button
              title="Déposer une plainte"
              onPress={() => setShowForm(true)}
              style={styles.emptyButton}
            />
          </View>
        ) : (
          <View style={styles.list}>
            {plaintes.map((plainte) => (
              <View
                key={plainte.id}
                style={[
                  styles.card,
                  plainte.type === 'reçue' && styles.cardReceived,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    {plainte.type === 'reçue' && (
                      <Ionicons
                        name="alert-circle"
                        size={20}
                        color={colors.destructive}
                        style={styles.alertIcon}
                      />
                    )}
                    <View>
                      <Text style={styles.cardTitle}>{plainte.objet}</Text>
                      <Text style={styles.cardId}>{plainte.id}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.typeBadge,
                      {
                        backgroundColor:
                          plainte.type === 'reçue'
                            ? colors.destructive
                            : colors.primary,
                      },
                    ]}
                  >
                    <Text style={styles.typeBadgeText}>
                      {plainte.type === 'reçue' ? 'Reçue' : 'Déposée'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardDescription}>{plainte.description}</Text>

                {plainte.commissariat && (
                  <Text style={styles.cardCommissariat}>
                    Commissariat: {plainte.commissariat}
                  </Text>
                )}

                {plainte.amende && (
                  <View style={styles.amendeContainer}>
                    <Ionicons
                      name="cash-outline"
                      size={16}
                      color={colors.destructive}
                    />
                    <Text style={styles.amendeText}>
                      Amende: {plainte.amende.toLocaleString()} FCFA
                    </Text>
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <Text style={styles.cardDate}>
                    {new Date(plainte.createdAt).toLocaleDateString('fr-FR')}
                  </Text>
                  <Text style={styles.cardStatus}>{plainte.status}</Text>
                </View>
              </View>
            ))}
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
              <Text style={styles.modalTitle}>Déposer une plainte</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Ionicons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Input
                label="Objet de la plainte"
                value={objet}
                onChangeText={setObjet}
                placeholder="Ex: Vol, Agression, Escroquerie..."
              />

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={styles.textarea}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Décrivez les faits en détail..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>

              <Input
                label="Commissariat (optionnel)"
                value={commissariat}
                onChangeText={setCommissariat}
                placeholder="Choisir un commissariat"
              />
              <Text style={styles.helperText}>
                Si vide, le plus proche sera automatiquement choisi
              </Text>

              <Button
                title={submitting ? 'Dépôt en cours...' : 'Déposer la plainte'}
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
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 200,
  },
  list: {
    gap: 16,
  },
  card: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardReceived: {
    borderColor: colors.destructive,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  alertIcon: {
    marginRight: 8,
    marginTop: 2,
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
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  cardCommissariat: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  amendeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amendeText: {
    fontSize: 14,
    color: colors.destructive,
    marginLeft: 4,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardDate: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  cardStatus: {
    fontSize: 12,
    color: colors.mutedForeground,
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
  helperText: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: -8,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});



