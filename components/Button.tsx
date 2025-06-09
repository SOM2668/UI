import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  
  const sizeStyles = {
    small: {
      button: { height: 36, paddingHorizontal: 16, borderRadius: 18 },
      text: { fontSize: 14 },
    },
    medium: {
      button: { height: 48, paddingHorizontal: 24, borderRadius: 24 },
      text: { fontSize: 16 },
    },
    large: {
      button: { height: 56, paddingHorizontal: 32, borderRadius: 28 },
      text: { fontSize: 18 },
    },
  };

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? Colors.primary.main : Colors.neutral.white} 
        />
      ) : (
        <>
          {icon && <Text style={styles.iconContainer}>{icon}</Text>}
          <Text style={[
            styles.buttonText,
            sizeStyles[size].text,
            variant === 'outline' && styles.outlineText,
            disabled && styles.disabledText,
            textStyle,
          ]}>
            {title}
          </Text>
        </>
      )}
    </>
  );

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.button,
          styles.outlineButton,
          sizeStyles[size].button,
          fullWidth && styles.fullWidth,
          disabled && styles.disabledOutline,
          style,
        ]}
      >
        {buttonContent}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.buttonContainer,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <LinearGradient
        colors={
          variant === 'secondary'
            ? Colors.gradient.secondary
            : Colors.gradient.primary
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.button,
          sizeStyles[size].button,
          disabled && styles.disabledButton,
        ]}
      >
        {buttonContent}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {},
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Nunito-Bold',
    color: Colors.neutral.white,
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary.main,
  },
  outlineText: {
    color: Colors.primary.main,
  },
  disabledOutline: {
    borderColor: Colors.neutral.dark,
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: 8,
  },
});