import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withRepeat, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

type LogoProps = {
  showTagline?: boolean;
  size?: 'small' | 'medium' | 'large';
};

export default function Logo({ showTagline = true, size = 'large' }: LogoProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  
  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      -1, 
      true
    );
    
    rotation.value = withRepeat(
      withDelay(
        500,
        withTiming(5, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      ),
      -1, 
      true
    );
  }, []);
  
  const heartStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ]
    };
  });

  const sizeStyles = {
    small: {
      container: { height: 40 },
      title: { fontSize: 20 },
      heart: { size: 18 },
      tagline: { fontSize: 12 }
    },
    medium: {
      container: { height: 60 },
      title: { fontSize: 28 },
      heart: { size: 24 },
      tagline: { fontSize: 14 }
    },
    large: {
      container: { height: 80 },
      title: { fontSize: 36 },
      heart: { size: 30 },
      tagline: { fontSize: 16 }
    },
  };
  
  return (
    <View style={[styles.container, sizeStyles[size].container]}>
      <View style={styles.logoContainer}>
        <Text style={[styles.logoText, sizeStyles[size].title]}>Flirt</Text>
        <Animated.View style={[styles.heartContainer, heartStyle]}>
          <FontAwesome name="heart" color={Colors.primary.main} size={sizeStyles[size].heart.size} />
        </Animated.View>
        <Text style={[styles.logoText, sizeStyles[size].title]}>shaala</Text>
      </View>
      
      {showTagline && (
        <Text style={[styles.tagline, sizeStyles[size].tagline]}>
          Turn Chats into Charm 💘
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'Nunito-Bold',
    color: Colors.primary.main,
  },
  heartContainer: {
    marginHorizontal: -2,
  },
  tagline: {
    fontFamily: 'Nunito-Regular',
    color: Colors.neutral.darker,
    marginTop: 8,
    textAlign: 'center',
  },
});