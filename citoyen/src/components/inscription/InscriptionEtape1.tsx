/**
 * Composant pour l'Étape 1 d'inscription
 * Informations de base + Vérification ANCEC
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { colors } from '../../theme/colors';
import { apiService, InscriptionEtape1Data, InscriptionEtape1Response } from '../../utils/api';
import { toast } from '../ui/Toast';
import { MaterialIcons } from '@expo/vector-icons';

// Import du date picker
import DateTimePicker from '@react-native-community/datetimepicker';

interface InscriptionEtape1Props {
  onNext: (data: InscriptionEtape1Data, response: InscriptionEtape1Response) => void;
  onBack?: () => void;
}

export const InscriptionEtape1: React.FC<InscriptionEtape1Props> = ({ onNext, onBack }) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [numeroCNI, setNumeroCNI] = useState('');
  const [dateNaissance, setDateNaissance] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [lieuNaissance, setLieuNaissance] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const validateForm = (): boolean => {
    if (!nom.trim() || nom.trim().length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères');
      return false;
    }
    if (!prenom.trim() || prenom.trim().length < 2) {
      toast.error('Le prénom doit contenir au moins 2 caractères');
      return false;
    }
    if (!numeroCNI || !/^\d{13}$/.test(numeroCNI)) {
      toast.error('Le numéro CNI doit contenir exactement 13 chiffres');
      return false;
    }
    if (!dateNaissance) {
      toast.error('La date de naissance est obligatoire');
      return false;
    }
    // Vérifier l'âge minimum (18 ans)
    const today = new Date();
    const age = today.getFullYear() - dateNaissance.getFullYear();
    const monthDiff = today.getMonth() - dateNaissance.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateNaissance.getDate())) {
      const actualAge = age - 1;
      if (actualAge < 18) {
        toast.error('Vous devez avoir au moins 18 ans');
        return false;
      }
    } else if (age < 18) {
      toast.error('Vous devez avoir au moins 18 ans');
      return false;
    }
    if (!lieuNaissance.trim() || lieuNaissance.trim().length < 2) {
      toast.error('Le lieu de naissance est obligatoire');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setVerifying(true);

    try {
      const data: InscriptionEtape1Data = {
        nom: nom.trim().toUpperCase(),
        prenom: prenom.trim(),
        numeroCNI,
        dateNaissance: dateNaissance.toISOString().split('T')[0], // Format YYYY-MM-DD
        lieuNaissance: lieuNaissance.trim(),
      };

      const response = await apiService.inscriptionEtape1(data);

      if (!response.success || !response.verification_ancec.succes) {
        const errors = response.verification_ancec.erreurs || [];
        const errorMessage = errors.length > 0 
          ? errors.join(', ') 
          : 'Vérification ANCEC échouée. Veuillez vérifier vos informations.';
        toast.error(errorMessage);
        return;
      }

      // Afficher les avertissements s'il y en a
      if (response.verification_ancec.avertissements && response.verification_ancec.avertissements.length > 0) {
        response.verification_ancec.avertissements.forEach((warning: string) => {
          toast.error(warning, 'info');
        });
      }

      // Passer à l'étape suivante
      onNext(data, response);
      toast.success('Étape 1 validée !');
    } catch (error: any) {
      console.error('Erreur étape 1:', error);
      toast.error(error.message || 'Erreur lors de la vérification ANCEC');
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Informations de base</Text>
        <Text style={styles.subtitle}>Étape 1 sur 3</Text>
      </View>

      {verifying && (
        <View style={styles.verifyingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.verifyingText}>Vérification ANCEC en cours...</Text>
        </View>
      )}

      <View style={styles.form}>
        <Input
          label="Nom"
          value={nom}
          onChangeText={setNom}
          placeholder="Votre nom de famille"
          autoCapitalize="words"
          autoComplete="family-name"
          textContentType="familyName"
          editable={!loading}
        />

        <Input
          label="Prénom"
          value={prenom}
          onChangeText={setPrenom}
          placeholder="Votre prénom"
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          editable={!loading}
        />

        <Input
          label="Numéro CNI"
          value={numeroCNI}
          onChangeText={(text) => {
            // Ne garder que les chiffres
            const cleaned = text.replace(/\D/g, '');
            if (cleaned.length <= 13) {
              setNumeroCNI(cleaned);
            }
          }}
          placeholder="13 chiffres (ex: 1663200000432)"
          keyboardType="number-pad"
          maxLength={13}
          editable={!loading}
        />

        <View style={styles.rowContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Date de naissance</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
              disabled={loading}
            >
              <Text style={[styles.datePickerText, !dateNaissance && styles.datePickerPlaceholder]}>
                {dateNaissance
                  ? dateNaissance.toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : 'JJ/MM/AAAA'}
              </Text>
              <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
            </TouchableOpacity>
            {showDatePicker && DateTimePicker && (
              <DateTimePicker
                value={dateNaissance || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event: any, selectedDate?: Date) => {
                  if (Platform.OS === 'android') {
                    setShowDatePicker(false);
                  }
                  if (event.type === 'set' && selectedDate) {
                    setDateNaissance(selectedDate);
                    if (Platform.OS === 'android') {
                      setShowDatePicker(false);
                    }
                  } else if (event.type === 'dismissed') {
                    setShowDatePicker(false);
                  }
                }}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}
          </View>

          <View style={styles.lieuContainer}>
            <Input
              label="Lieu de naissance"
              value={lieuNaissance}
              onChangeText={setLieuNaissance}
              placeholder="Ville ou commune"
              autoCapitalize="words"
              editable={!loading}
            />
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        {onBack && (
          <Button
            title="Retour"
            onPress={onBack}
            disabled={loading}
            style={[styles.button, styles.backButton]}
            variant="outline"
          />
        )}
        <Button
          title={loading ? 'Vérification...' : 'Suivant'}
          onPress={handleNext}
          disabled={loading}
          loading={loading}
          style={styles.button}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  verifyingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.muted,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  verifyingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.foreground,
  },
  form: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
  backButton: {
    flex: 0.5,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  dateContainer: {
    flex: 1,
  },
  lieuContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 6,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  datePickerText: {
    fontSize: 16,
    color: colors.foreground,
  },
  datePickerPlaceholder: {
    color: colors.mutedForeground,
  },
});

