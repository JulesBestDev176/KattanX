import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'default',
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...style,
    };

    if (disabled || loading) {
      return {
        ...baseStyle,
        ...styles.buttonDisabled,
      };
    }

    switch (variant) {
      case 'outline':
        return {
          ...baseStyle,
          ...styles.buttonOutline,
        };
      case 'ghost':
        return {
          ...baseStyle,
          ...styles.buttonGhost,
        };
      default:
        return {
          ...baseStyle,
          ...styles.buttonDefault,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = styles.buttonText;

    if (disabled || loading) {
      return {
        ...baseStyle,
        ...styles.buttonTextDisabled,
      };
    }

    switch (variant) {
      case 'outline':
        return {
          ...baseStyle,
          ...styles.buttonTextOutline,
        };
      case 'ghost':
        return {
          ...baseStyle,
          ...styles.buttonTextGhost,
        };
      default:
        return {
          ...baseStyle,
          ...styles.buttonTextDefault,
        };
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'default' ? colors.white : colors.primary} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDefault: {
    backgroundColor: colors.primary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    backgroundColor: colors.muted,
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDefault: {
    color: colors.white,
  },
  buttonTextOutline: {
    color: colors.primary,
  },
  buttonTextGhost: {
    color: colors.primary,
  },
  buttonTextDisabled: {
    color: colors.mutedForeground,
  },
});

