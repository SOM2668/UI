import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { X } from 'lucide-react-native';

type BannerAdProps = {
  onClose?: () => void;
  onUpgrade?: () => void;
};

export default function BannerAd({ onClose, onUpgrade }: BannerAdProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.adText}>
        Upgrade to Premium for an ad-free experience!
      </Text>
      <TouchableOpacity 
        style={styles.upgradeButton}
        onPress={onUpgrade}
      >
        <Text style={styles.upgradeButtonText}>Upgrade</Text>
      </TouchableOpacity>
      
      {onClose && (
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <X size={16} color={Colors.neutral.darker} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.accent.light,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.accent.main,
    ...Platform.select({
      web: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      },
      default: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      },
    }),
  },
  adText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.neutral.darker,
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 12,
  },
  upgradeButtonText: {
    color: Colors.neutral.white,
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
});