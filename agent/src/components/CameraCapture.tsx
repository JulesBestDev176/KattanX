import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Button } from './ui/Button';

interface CameraCaptureProps {
  onImageCaptured: (uri: string) => void;
  onCancel?: () => void;
  title?: string;
  mode?: 'photo' | 'video';
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onImageCaptured,
  onCancel,
  title = 'Capturer une photo',
  mode = 'photo',
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions requises',
        'Nous avons besoin d\'accéder à votre caméra et à vos photos pour cette fonctionnalité.'
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: mode === 'video' 
        ? ImagePicker.MediaTypeOptions.Videos 
        : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleConfirm = () => {
    if (imageUri) {
      onImageCaptured(imageUri);
    }
  };

  const handleRetake = () => {
    setImageUri(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {!imageUri ? (
        <View style={styles.captureOptions}>
          <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
            <View style={styles.optionIcon}>
              <Ionicons name={mode === 'video' ? "videocam" : "camera"} size={32} color={colors.primary} />
            </View>
            <Text style={styles.optionText}>
              {mode === 'video' ? 'Enregistrer une vidéo' : 'Prendre une photo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
            <View style={styles.optionIcon}>
              <Ionicons name="images" size={32} color={colors.primary} />
            </View>
            <Text style={styles.optionText}>Choisir depuis la galerie</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          
          <View style={styles.previewActions}>
            <Button
              title="Reprendre"
              variant="outline"
              onPress={handleRetake}
              style={styles.actionButton}
            />
            <Button
              title="Confirmer"
              onPress={handleConfirm}
              style={styles.actionButton}
            />
          </View>
        </View>
      )}

      {onCancel && !imageUri && (
        <Button
          title="Annuler"
          variant="ghost"
          onPress={onCancel}
          style={styles.cancelButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 20,
    textAlign: 'center',
  },
  captureOptions: {
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
  },
  previewContainer: {
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
  },
  cancelButton: {
    marginTop: 16,
  },
});
