import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface MediaCaptureProps {
  onMediaCaptured: (type: 'photo' | 'video' | 'audio', data: any) => void;
}

export const MediaCapture: React.FC<MediaCaptureProps> = ({ onMediaCaptured }) => {
  const [recording, setRecording] = useState<'audio' | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleCapture = (type: 'photo' | 'video') => {
    // Simulation de capture
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      onMediaCaptured(type, { uri: 'mock-uri' });
    }, 1500);
  };

  const handleAudioRecord = () => {
    if (recording) {
      setRecording(null);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        onMediaCaptured('audio', { uri: 'mock-audio-uri' });
      }, 2000);
    } else {
      setRecording('audio');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capturer une preuve</Text>
      
      {analyzing ? (
        <View style={styles.analyzingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.analyzingText}>Analyse IA en cours...</Text>
          <Text style={styles.analyzingSubtext}>Extraction des caractéristiques du véhicule/suspect</Text>
        </View>
      ) : (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.captureButton, styles.photoButton]}
            onPress={() => handleCapture('photo')}
          >
            <Ionicons name="camera" size={32} color={colors.white} />
            <Text style={styles.buttonText}>Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureButton, styles.videoButton]}
            onPress={() => handleCapture('video')}
          >
            <Ionicons name="videocam" size={32} color={colors.white} />
            <Text style={styles.buttonText}>Vidéo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.captureButton, 
              styles.audioButton,
              recording && styles.recordingButton
            ]}
            onPress={handleAudioRecord}
          >
            <Ionicons name={recording ? "stop" : "mic"} size={32} color={colors.white} />
            <Text style={styles.buttonText}>
              {recording ? 'Arrêter' : 'Audio'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={styles.hint}>
        L'IA analysera automatiquement le contenu pour pré-remplir l'alerte
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  captureButton: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  photoButton: {
    backgroundColor: colors.primary,
  },
  videoButton: {
    backgroundColor: colors.secondary,
  },
  audioButton: {
    backgroundColor: '#f59e0b', // Amber
  },
  recordingButton: {
    backgroundColor: colors.destructive,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  analyzingContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderRadius: 12,
  },
  analyzingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
  },
  analyzingSubtext: {
    marginTop: 4,
    fontSize: 13,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
