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
import { colors } from '../theme/colors';
import { VerificationMethodSelector } from '../components/VerificationMethodSelector';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CameraCapture } from '../components/CameraCapture';
import { IndividuCard } from '../components/IndividuCard';
import { toast } from '../components/ui/Toast';
import { searchByCNI, searchByMatricule, analyzePhotoForFaceRecognition } from '../utils/imageAnalysis';
import { IndividuVerifie } from '../types';

interface VerificationScreenProps {
  onBack: () => void;
}

export const VerificationScreen: React.FC<VerificationScreenProps> = ({ onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState<'cni' | 'matricule' | 'photo'>('cni');
  const [loading, setLoading] = useState(false);
  const [cniInput, setCniInput] = useState('');
  const [matriculeInput, setMatriculeInput] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [individu, setIndividu] = useState<IndividuVerifie | null>(null);

  const handleVerifyByCNI = async () => {
    if (!cniInput) {
      toast.error('Veuillez saisir un numéro CNI');
      return;
    }

    setLoading(true);
    try {
      const result = await searchByCNI(cniInput);
      if (result) {
        setIndividu(result);
        toast.success('Individu trouvé');
      } else {
        toast.error('Aucun individu trouvé avec ce CNI');
      }
    } catch (error) {
      toast.error('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyByMatricule = async () => {
    if (!matriculeInput) {
      toast.error('Veuillez saisir un matricule');
      return;
    }

    setLoading(true);
    try {
      const result = await searchByMatricule(matriculeInput);
      if (result) {
        setIndividu(result.proprietaire);
        toast.success('Propriétaire du véhicule trouvé');
      } else {
        toast.error('Aucun véhicule trouvé avec ce matricule');
      }
    } catch (error) {
      toast.error('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoCapture = async (imageUri: string) => {
    setShowCamera(false);
    setLoading(true);
    
    try {
      const result = await analyzePhotoForFaceRecognition(imageUri);
      if (result) {
        setIndividu(result);
        toast.success('Individu identifié par reconnaissance faciale');
      } else {
        toast.error('Aucun individu reconnu sur cette photo');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'analyse de la photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vérification</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {!showCamera ? (
            <>
              <VerificationMethodSelector
                selectedMethod={selectedMethod}
                onSelectMethod={(method) => {
                  setSelectedMethod(method);
                  setIndividu(null);
                }}
              />

              {selectedMethod === 'cni' && (
                <View style={styles.methodContent}>
                  <Input
                    label="Numéro CNI"
                    value={cniInput}
                    onChangeText={setCniInput}
                    placeholder="1234567890123"
                    keyboardType="default"
                  />
                  <Button
                    title={loading ? 'Recherche...' : 'Vérifier'}
                    onPress={handleVerifyByCNI}
                    disabled={loading}
                    loading={loading}
                  />
                </View>
              )}

              {selectedMethod === 'matricule' && (
                <View style={styles.methodContent}>
                  <Input
                    label="Matricule du véhicule"
                    value={matriculeInput}
                    onChangeText={setMatriculeInput}
                    placeholder="DK-1234-AB"
                    autoCapitalize="characters"
                  />
                  <Button
                    title={loading ? 'Recherche...' : 'Vérifier'}
                    onPress={handleVerifyByMatricule}
                    disabled={loading}
                    loading={loading}
                  />
                </View>
              )}

              {selectedMethod === 'photo' && (
                <View style={styles.methodContent}>
                  <Button
                    title="Prendre une photo"
                    onPress={() => setShowCamera(true)}
                  />
                  <Text style={styles.infoText}>
                    Utilisez la reconnaissance faciale IA pour identifier un individu
                  </Text>
                </View>
              )}

              {individu && (
                <IndividuCard
                  individu={individu}
                  onDemandeArrestation={() => toast.info('[DEMO] Demande d\'arrestation envoyée')}
                  onCreerAmende={() => toast.info('[DEMO] Création d\'amende')}
                  onPartagerAlerte={() => toast.info('[DEMO] Alerte partagée')}
                />
              )}
            </>
          ) : (
            <CameraCapture
              title="Capturer une photo pour reconnaissance faciale"
              onImageCaptured={handlePhotoCapture}
              onCancel={() => setShowCamera(false)}
            />
          )}
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
  methodContent: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 12,
  },
});
