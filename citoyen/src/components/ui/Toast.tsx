import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, visible, onHide }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
        type === 'success' && styles.success,
        type === 'error' && styles.error,
        type === 'info' && styles.info,
      ]}
    >
      <TouchableOpacity onPress={hideToast} style={styles.content}>
        <Text style={styles.message}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 16,
    zIndex: 9999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    width: '100%',
  },
  message: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  success: {
    backgroundColor: colors.secondary,
  },
  error: {
    backgroundColor: colors.destructive,
  },
  info: {
    backgroundColor: colors.primary,
  },
});

// Toast manager
class ToastManager {
  private showToastCallback: ((message: string, type: 'success' | 'error' | 'info') => void) | null = null;

  setShowToast(callback: (message: string, type: 'success' | 'error' | 'info') => void) {
    this.showToastCallback = callback;
  }

  success(message: string) {
    this.showToastCallback?.(message, 'success');
  }

  error(message: string) {
    this.showToastCallback?.(message, 'error');
  }

  info(message: string) {
    this.showToastCallback?.(message, 'info');
  }
}

export const toast = new ToastManager();



