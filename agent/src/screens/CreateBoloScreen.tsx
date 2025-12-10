import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
  import { Audio } from 'expo-av';
  import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';

import * as ImagePicker from 'expo-image-picker';

interface CreateBoloScreenProps {
  onBack: () => void;
  onSubmit: (alertData: any) => void;
}

export const CreateBoloScreen: React.FC<CreateBoloScreenProps> = ({ onBack, onSubmit }) => {
  const [mode, setMode] = useState<'capture' | 'review'>('capture');
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Capture States
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingInterval = React.useRef<NodeJS.Timeout | null>(null);

  // Form Data
  const [type, setType] = useState<'fugitif' | 'vol' | 'incident'>('incident');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Suspect/Vehicle Data
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehicleMatricule, setVehicleMatricule] = useState('');
  
  // Location Data
  const [location, setLocation] = useState('');
  const [direction, setDirection] = useState('');

  const [capturedMedia, setCapturedMedia] = useState<any[]>([]);

  React.useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    const audioStatus = await Audio.requestPermissionsAsync();
    if (status !== 'granted' || audioStatus.status !== 'granted') {
      toast.error('Permission caméra et micro requise');
      return false;
    }
    return true;
  };

  const handleCapture = async (mediaType: 'photo' | 'video' | 'audio') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    if (mediaType === 'audio') {
        startRecording();
        return;
    }

    let result;
    if (mediaType === 'photo') {
        result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });
    } else {
        result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 0.8,
        });
    }

    if (!result.canceled && result.assets[0]) {
        simulateAIAnalysis(mediaType, result.assets[0].uri);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
      
      recordingInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
      toast.error('Erreur enregistrement');
    }
  };

  const handleAudioStop = async () => {
    if (!recording) return;

    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    
    if (uri) {
        simulateAIAnalysis('audio', uri);
    }
  };

  const simulateAIAnalysis = (mediaType: 'photo' | 'video' | 'audio', uri: string) => {
    setAnalyzing(true);
    setCapturedMedia([{ type: mediaType, uri }]);
    
    // Simuler l'analyse IA
    setTimeout(() => {
        setAnalyzing(false);
        setMode('review');
        toast.success('Analyse IA terminée');

        // Common Mock Data
        setLocation('Avenue Blaise Diagne, Dakar');
        
        if (mediaType === 'audio') {
            setType('vol');
            setTitle('Alerte Vocale: Véhicule suspect');
            // Simplified logic for demo
            setDescription('Message vocal transcrit (IA): "Alerte, je viens de voir une Toyota Corolla Rouge immatriculée AA-123-BC prendre la fuite."');
            setVehicleModel('Toyota Corolla'); 
            setVehicleColor('Rouge');
            setVehicleMatricule('AA-123-BC');
            setDirection('Nord (vers Sandaga)');
        } else if (mediaType === 'video') {
            setType('vol');
            setTitle('Véhicule en fuite (Vidéo)');
            setDescription('Analyse Vidéo: Véhicule en excès de vitesse, conduite dangereuse.');
            setVehicleModel('Mercedes C200');
            setVehicleColor('Grise');
            setVehicleMatricule('DK-2020-X');
            setDirection('Est (Corniche Ouest)');
        } else {
            setType('incident');
            setTitle('Identification Suspect (Photo)');
            setDescription('Analyse Photo: Suspect identifié à 85%.');
            setVehicleModel('---');
            setVehicleColor('---');
            setVehicleMatricule('---');
            setDirection('Immobile');
        }
    }, 2000);
  };

  const handleSubmit = () => {
    if (!title) {
        toast.error('Le titre est requis');
        return;
    }

    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        toast.success('Alerte BOLO diffusée à toutes les unités !');
        onSubmit({
            title,
            type,
            description,
            vehicle: {
                model: vehicleModel,
                color: vehicleColor,
                matricule: vehicleMatricule
            },
            location,
            direction,
            media: capturedMedia
        });
    }, 1500);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderCaptureMode = () => {
    if (isRecording) {
        return (
            <View style={styles.recordingContainer}>
                <View style={styles.recordingRipple}>
                    <Ionicons name="mic" size={64} color={colors.white} />
                </View>
                <Text style={styles.recordingTimer}>{formatDuration(recordingDuration)}</Text>
                <Text style={styles.recordingText}>Enregistrement en cours...</Text>
                <Text style={styles.recordingSub}>"Décrivez le véhicule, la couleur, la direction..."</Text>
                
                <TouchableOpacity style={styles.stopButton} onPress={handleAudioStop}>
                    <View style={styles.stopIcon} />
                </TouchableOpacity>
            </View>
        );
    }


    if (analyzing) {
        return (
            <View style={styles.analyzingWrapper}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.analyzingText}>Analyse intelligente du contenu...</Text>
                <Text style={styles.analyzingSub}>Extraction: Couleur, Plaque, Direction, Lieu</Text>
            </View>
        );
    }

    return (
        <View style={styles.captureContainer}>
            <Text style={styles.instructions}>
                Choisissez le type de preuve.{"\n"}
                <Text style={{fontWeight: 'bold'}}>L'IA écoute et remplit tout.</Text>
            </Text>

            <View style={styles.grid}>
                <TouchableOpacity 
                    style={[styles.mediaCard, { backgroundColor: '#f59e0b' }]}
                    onPress={() => handleCapture('audio')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="mic" size={48} color="white" />
                    <Text style={styles.mediaTitle}>AUDIO</Text>
                    <Text style={styles.mediaDesc}>Dictez les détails</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.mediaCard, { backgroundColor: colors.primary }]}
                    onPress={() => handleCapture('photo')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="camera" size={48} color="white" />
                    <Text style={styles.mediaTitle}>PHOTO</Text>
                    <Text style={styles.mediaDesc}>Capture instantanée</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.mediaCard, { backgroundColor: colors.destructive }]}
                    onPress={() => handleCapture('video')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="videocam" size={48} color="white" />
                    <Text style={styles.mediaTitle}>VIDÉO</Text>
                    <Text style={styles.mediaDesc}>Situation dynamique</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  };

  const renderReviewMode = () => (
    <View style={styles.reviewContainer}>
        <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={16} color={colors.white} />
            <Text style={styles.aiText}>Données extraites par IA</Text>
        </View>

        <View style={styles.typeSelector}>
             {['fugitif', 'vol', 'incident'].map((t) => (
                <TouchableOpacity
                    key={t}
                    style={[
                        styles.typePill,
                        type === t && styles.typePillSelected,
                         { borderColor: t === 'fugitif' ? colors.destructive : t === 'vol' ? colors.warning : '#f97316' }
                    ]}
                    onPress={() => setType(t as any)}
                >
                    <Text style={[styles.typePillText, type === t && styles.typePillTextSelected]}>
                        {t.toUpperCase()}
                    </Text>
                </TouchableOpacity>
             ))}
        </View>

        <Input
            label="Titre"
            value={title}
            onChangeText={setTitle}
        />
        
        <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
        />
        
        <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
                 <Input
                    label="Localisation"
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Auto-détecté"
                />
            </View>
             <View style={{flex: 1, marginLeft: 8}}>
                 <Input
                    label="Direction"
                    value={direction}
                    onChangeText={setDirection}
                    placeholder="---"
                />
            </View>
        </View>

        <View style={styles.divider} />
        <Text style={styles.sectionHeader}>Véhicule / Suspect Identifié</Text>

        <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
                 <Input
                    label="Modèle"
                    value={vehicleModel}
                    onChangeText={setVehicleModel}
                    placeholder="Non détecté"
                />
            </View>
             <View style={{flex: 1, marginLeft: 8}}>
                 <Input
                    label="Plaque"
                    value={vehicleMatricule}
                    onChangeText={setVehicleMatricule}
                    placeholder="---"
                />
            </View>
        </View>
         <Input
            label="Couleur"
            value={vehicleColor}
            onChangeText={setVehicleColor}
        />

        <Button
            title={loading ? "DIFFUSER L'ALERTE" : "DIFFUSER L'ALERTE"}
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: 24, backgroundColor: colors.destructive }}
        />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="close" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mode === 'capture' ? 'Nouvelle Alerte BOLO' : 'Validation'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            {mode === 'capture' ? renderCaptureMode() : renderReviewMode()}
        </ScrollView>
      </KeyboardAvoidingView>
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
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
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
    flexGrow: 1,
  },
  captureContainer: {
    flex: 1,
    paddingTop: 20,
  },
  instructions: {
    fontSize: 16,
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  grid: {
    gap: 16,
  },
  mediaCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'column',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  mediaTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    letterSpacing: 1,
  },
  mediaDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  analyzingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  analyzingText: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  analyzingSub: {
    marginTop: 8,
    color: colors.mutedForeground,
  },
  reviewContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  aiBadge: {
    backgroundColor: colors.secondary,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 20,
  },
  aiText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  typePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: colors.border,
  },
  typePillSelected: {
    backgroundColor: colors.muted,
    borderColor: colors.foreground,
  },
  typePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  typePillTextSelected: {
    color: colors.foreground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mutedForeground,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
  },
  recordingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  recordingRipple: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.destructive,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: colors.destructive,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  recordingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 8,
  },
  recordingSub: {
    fontSize: 16,
    color: colors.mutedForeground,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 40,
  },
  stopButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: colors.foreground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopIcon: {
    width: 30,
    height: 30,
    backgroundColor: colors.foreground,
    borderRadius: 4,
  },
  recordingTimer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 16,
    fontVariant: ['tabular-nums'],
    // Add shadow to make it visible on any background if needed, leveraging existing global colors or just white
     textShadowColor: 'rgba(0, 0, 0, 0.5)',
     textShadowOffset: {width: -1, height: 1},
     textShadowRadius: 10
  },
});
