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

// Données de démonstration pour l'individu toujours trouvé
const MOCK_INDIVIDU: IndividuVerifie = {
  id: 'ind-demo-001',
  cni: '1752198901234',
  nom: 'DIOP',
  prenom: 'Moussa',
  dateNaissance: '1989-05-12',
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  tel: '77 123 45 67',
  adresse: 'Parcelles Assainies, Unité 15, Dakar',
  estRecherche: true,
  motifRecherche: 'Vol aggravé et délit de fuite',
  estConnuJustice: true,
  totalAmendes: 150000,
  amendes: [
    {
      id: 'amd-1',
      montant: 50000,
      motif: 'Excès de vitesse',
      date: '2023-11-15',
      status: 'impayee',
      commissariat: 'Central',
    },
    {
      id: 'amd-2',
      montant: 100000,
      motif: 'Défaut de permis',
      date: '2023-10-01',
      status: 'impayee',
      commissariat: 'Dieuppeul',
    }
  ],
  casierJudiciaire: [
    {
      id: 'cj-1',
      type: 'condamnation',
      description: 'Vol simple',
      date: '2020-03-15',
      peine: '6 mois avec sursis',
      lieu: 'Dakar',
    }
  ],
  vehicules: [
    {
      id: 'veh-1',
      matricule: 'DK-2468-AA',
      marque: 'Peugeot',
      modele: '307',
      couleur: 'Gris',
      proprietaireId: 'ind-demo-001',
    }
  ]
};

export const VerificationScreen: React.FC<VerificationScreenProps> = ({ onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState<'cni' | 'matricule' | 'photo'>('cni');
  const [loading, setLoading] = useState(false);
  const [cniInput, setCniInput] = useState('');
  const [matriculeInput, setMatriculeInput] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [individu, setIndividu] = useState<IndividuVerifie | null>(null);

  const handleVerifyByCNI = async () => {
    // Simulation de chargement
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIndividu(MOCK_INDIVIDU);
      toast.success('Individu trouvé (Mode Démo)');
    }, 1500);
  };

  const handleVerifyByMatricule = async () => {
    // Simulation de chargement
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIndividu(MOCK_INDIVIDU);
      toast.success('Propriétaire trouvé (Mode Démo)');
    }, 1500);
  };

  const handlePhotoCapture = async (imageUri: string) => {
    setShowCamera(false);
    setLoading(true);
    
    // Simulation d'analyse IA
    setTimeout(() => {
      setLoading(false);
      setIndividu(MOCK_INDIVIDU);
      toast.success('Identification faciale réussie (Mode Démo)');
    }, 2000);
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
