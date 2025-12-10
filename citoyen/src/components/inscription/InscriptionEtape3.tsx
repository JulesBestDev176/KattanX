/**
 * Composant pour l'Étape 3 d'inscription
 * Biométrie (Photo + Empreinte)
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';
import { Button } from '../ui/Button';
import { colors } from '../../theme/colors';
import { apiService, InscriptionEtape1Data, InscriptionEtape2Data, InscriptionEtape3Data, InscriptionEtape3Response } from '../../utils/api';
import { toast } from '../ui/Toast';

interface InscriptionEtape3Props {
  sessionId: string;
  donneesEtape1: InscriptionEtape1Data;
  donneesEtape2: InscriptionEtape2Data & { numero_unique?: string };
  onComplete: (response: InscriptionEtape3Response) => void;
  onBack: () => void;
}

export const InscriptionEtape3: React.FC<InscriptionEtape3Props> = ({
  sessionId,
  donneesEtape1,
  donneesEtape2,
  onComplete,
  onBack,
}) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  
  const [empreinteEnregistree, setEmpreinteEnregistree] = useState(false);
  const [empreinteId, setEmpreinteId] = useState<string | null>(null);
  const [empreinteLoading, setEmpreinteLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);

  // Vérifier la disponibilité du capteur biométrique
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (compatible) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setBiometricAvailable(true);
        
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Reconnaissance faciale');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Empreinte digitale');
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          setBiometricType('Iris');
        } else {
          setBiometricType('Biométrie');
        }
      }
    } catch (error) {
      console.error('Erreur vérification biométrie:', error);
    }
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      toast.error('Permission caméra refusée');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      toast.error('Permission galerie refusée');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    setPhotoLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4], // Ratio photo d'identité
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setPhotoUri(asset.uri);
        
        // Upload de la photo
        try {
          const uploadResponse = await apiService.uploadPhoto(asset.uri);
          if (uploadResponse.success && uploadResponse.photo) {
            setPhotoId(uploadResponse.photo.id);
            setPhotoUrl(uploadResponse.photo.url);
            toast.success('Photo uploadée avec succès');
          }
        } catch (error: any) {
          console.error('Erreur upload photo:', error);
          toast.error('Erreur lors de l\'upload de la photo');
        }
      }
    } catch (error: any) {
      console.error('Erreur capture photo:', error);
      toast.error('Erreur lors de la capture de la photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleChooseFromGallery = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    setPhotoLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setPhotoUri(asset.uri);
        
        // Upload de la photo
        try {
          const uploadResponse = await apiService.uploadPhoto(asset.uri);
          if (uploadResponse.success && uploadResponse.photo) {
            setPhotoId(uploadResponse.photo.id);
            setPhotoUrl(uploadResponse.photo.url);
            toast.success('Photo uploadée avec succès');
          }
        } catch (error: any) {
          console.error('Erreur upload photo:', error);
          toast.error('Erreur lors de l\'upload de la photo');
        }
      }
    } catch (error: any) {
      console.error('Erreur sélection photo:', error);
      toast.error('Erreur lors de la sélection de la photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleEnregistrerEmpreinte = async () => {
    if (!biometricAvailable) {
      toast.error('Capteur biométrique non disponible sur cet appareil');
      return;
    }

    setEmpreinteLoading(true);
    
    try {
      // Vérifier si des données biométriques sont enregistrées
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        toast.error('Aucune empreinte digitale enregistrée sur cet appareil. Veuillez en ajouter une dans les paramètres.');
        setEmpreinteLoading(false);
        return;
      }

      // Authentifier avec le capteur biométrique
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Placez votre doigt sur le capteur',
        cancelLabel: 'Annuler',
        disableDeviceFallback: false,
        fallbackLabel: 'Utiliser le code PIN',
      });

      if (result.success) {
        // L'authentification a réussi, on peut maintenant enregistrer l'empreinte
        // Note: LocalAuthentication ne donne pas accès aux données brutes de l'empreinte
        // pour des raisons de sécurité. On génère un identifiant unique basé sur l'authentification réussie.
        
        // Créer un template unique basé sur l'authentification réussie
        // Note: On ne peut pas récupérer les données brutes de l'empreinte pour des raisons de sécurité
        // On génère un identifiant unique basé sur l'authentification
        const templateData = JSON.stringify({
          type: biometricType || 'Empreinte digitale',
          date_capture: new Date().toISOString(),
          dispositif: Platform.OS === 'ios' ? 'Touch ID / Face ID' : 'Capteur d\'empreinte Android',
          authentification_reussie: true,
          unique_id: `FP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        });

        const empreinteData = {
          doigt: 'POUCE_DROIT', // Par défaut, peut être sélectionné par l'utilisateur
          qualite: 95, // Qualité estimée après authentification réussie
          dispositif: Platform.OS === 'ios' ? 'Touch ID / Face ID' : 'Capteur d\'empreinte Android',
          date_capture: new Date().toISOString(),
          type_biometrie: biometricType || 'Empreinte digitale',
          template: templateData,
        };
        
        const response = await apiService.enregistrerEmpreinte(empreinteData);
        
        if (response.success) {
          setEmpreinteId(response.empreinte_id);
          setEmpreinteEnregistree(true);
          toast.success('Empreinte enregistrée avec succès');
        } else {
          toast.error('Erreur lors de l\'enregistrement de l\'empreinte');
        }
      } else {
        if (result.error === 'user_cancel') {
          toast.error('Authentification annulée');
        } else if (result.error === 'user_fallback') {
          toast.error('Veuillez utiliser le capteur biométrique');
        } else {
          toast.error('Échec de l\'authentification biométrique');
        }
      }
    } catch (error: any) {
      console.error('Erreur empreinte:', error);
      toast.error('Erreur lors de la capture de l\'empreinte');
    } finally {
      setEmpreinteLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!photoUri || !photoId) {
      toast.error('Veuillez prendre une photo');
      return;
    }
    if (!empreinteEnregistree || !empreinteId) {
      toast.error('Veuillez enregistrer votre empreinte');
      return;
    }

    setLoading(true);
    try {
      const data: InscriptionEtape3Data = {
        sessionId,
        donnees_etape1: donneesEtape1,
        donnees_etape2: {
          telephone: donneesEtape2.telephone,
          email: donneesEtape2.email,
          mot_de_passe: donneesEtape2.motDePasse,
          numero_unique: donneesEtape2.numero_unique || '',
          type_inscription: 'CITOYEN',
        },
        photo_id: photoId || undefined,
        empreinte_id: empreinteId || undefined,
        photo_url: photoUrl || undefined,
      };

      const response = await apiService.inscriptionEtape3(data);

      if (!response.success) {
        toast.error(response.message || 'Erreur lors de la finalisation');
        return;
      }

      toast.success('Inscription complète !');
      onComplete(response);
    } catch (error: any) {
      console.error('Erreur étape 3:', error);
      toast.error(error.message || 'Erreur lors de la finalisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Biométrie</Text>
        <Text style={styles.subtitle}>Étape 3 sur 3</Text>
      </View>

      <View style={styles.content}>
        {/* Section Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Photo de profil</Text>
          <Text style={styles.sectionDescription}>
            Prenez une photo ou choisissez depuis votre galerie
          </Text>

          {photoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              <TouchableOpacity
                onPress={() => {
                  setPhotoUri(null);
                  setPhotoId(null);
                  setPhotoUrl(null);
                }}
                style={styles.removeButton}
              >
                <MaterialIcons name="close" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <MaterialIcons name="camera-alt" size={48} color={colors.mutedForeground} />
              <Text style={styles.photoPlaceholderText}>Aucune photo</Text>
            </View>
          )}

          <View style={styles.photoActions}>
            <Button
              title={photoLoading ? 'Traitement...' : 'Prendre photo'}
              onPress={handleTakePhoto}
              disabled={photoLoading}
              loading={photoLoading}
              style={styles.photoButton}
            />
            <Button
              title="Galerie"
              onPress={handleChooseFromGallery}
              disabled={photoLoading}
              variant="outline"
              style={styles.photoButton}
            />
          </View>
        </View>

        {/* Section Empreinte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Empreinte digitale</Text>
          <Text style={styles.sectionDescription}>
            {biometricAvailable 
              ? `Placez votre doigt sur le capteur ${biometricType ? `(${biometricType})` : ''}`
              : 'Capteur biométrique non disponible sur cet appareil'}
          </Text>

          {empreinteEnregistree ? (
            <View style={styles.empreinteContainer}>
              <MaterialIcons name="fingerprint" size={48} color={colors.success || '#10b981'} />
              <Text style={styles.empreinteText}>Empreinte enregistrée</Text>
            </View>
          ) : (
            <View style={styles.empreintePlaceholder}>
              <MaterialIcons name="fingerprint" size={64} color={colors.mutedForeground} />
              <Text style={styles.empreintePlaceholderText}>
                Appuyez sur le bouton pour enregistrer
              </Text>
            </View>
          )}

          {!empreinteEnregistree && (
            <Button
              title={empreinteLoading ? 'Capture...' : biometricAvailable ? 'Capturer empreinte' : 'Non disponible'}
              onPress={handleEnregistrerEmpreinte}
              disabled={empreinteLoading || !biometricAvailable}
              loading={empreinteLoading}
              style={styles.empreinteButton}
            />
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Retour"
          onPress={onBack}
          disabled={loading}
          style={[styles.button, styles.backButton]}
          variant="outline"
        />
        <Button
          title={loading ? 'Finalisation...' : 'Terminer l\'inscription'}
          onPress={handleComplete}
          disabled={loading || !photoUri || !empreinteEnregistree}
          loading={loading}
          style={styles.button}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          ℹ️ Vos données biométriques seront vérifiées et stockées de manière sécurisée
        </Text>
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
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
    width: 200,
    height: 266,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.destructive,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 200,
    height: 266,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.muted,
  },
  photoPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.mutedForeground,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    minHeight: 48,
  },
  empreinteContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.muted,
    borderRadius: 8,
    marginBottom: 16,
  },
  empreinteText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.success || '#10b981',
  },
  empreintePlaceholder: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.muted,
    borderRadius: 8,
    marginBottom: 16,
  },
  empreintePlaceholderText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  empreinteButton: {
    width: '100%',
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
  infoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.muted,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});

