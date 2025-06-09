import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Crown } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type PremiumBadgeProps = {
  size?: 'small' | 'medium' | 'large';
};

export default function PremiumBadge({ size = 'medium' }: PremiumBadgeProps) {
  const sizeStyles = {
    small: {
      container: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
      text: { fontSize: 10 },
      icon: 12,
    },
    medium: {
      container: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
      text: { fontSize: 12 },
      icon: 14,
    },
    large: {
      container: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
      text: { fontSize: 14 },
      icon: 16,
    },
  };
  
  return (
    <View style={[styles.container, sizeStyles[size].container]}>
      <Crown size={sizeStyles[size].icon} color={Colors.neutral.white} fill={Colors.neutral.white} />
      <Text style={[styles.text, sizeStyles[size].text]}>Premium</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Nunito-Bold',
    color: Colors.neutral.white,
    marginLeft: 4,
  },
});