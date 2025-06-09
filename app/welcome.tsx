import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing, FadeIn, FadeOut } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { useApp } from '@/contexts/AppContext';

const { width, height } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WelcomeScreen() {
  const { state } = useApp();
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  
  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    buttonOpacity.value = withDelay(
      1000,
      withTiming(1, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });
  
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
    };
  });
  
  const handleContinue = () => {
    // Check if user is authenticated
    if (state.isAuthenticated) {
      router.replace('/(main)');
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#FFE8EC', '#FFD3DA']}
        style={styles.gradient}
      />
      
      <View style={styles.floatingHeartsContainer}>
        {[...Array(5)].map((_, index) => (
          <FloatingHeart key={index} delay={index * 1000} />
        ))}
      </View>
      
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Logo size="large" />
      </Animated.View>
      
      <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
        <Button 
          title="Get Started"
          onPress={handleContinue}
          size="large"
          fullWidth
        />
      </Animated.View>
    </View>
  );
}

// Floating heart animation component
function FloatingHeart({ delay = 0 }) {
  const startPosition = {
    x: Math.random() * width,
    y: height + 50,
  };
  
  const endPosition = {
    x: startPosition.x + (Math.random() * 200 - 100),
    y: -100,
  };
  
  const duration = 5000 + Math.random() * 3000;
  const size = 15 + Math.random() * 20;
  const opacity = 0.3 + Math.random() * 0.4;
  
  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(300)}
      exiting={FadeOut.duration(300)}
      style={[
        styles.floatingHeart,
        {
          left: startPosition.x,
          top: startPosition.y,
          opacity,
          transform: [
            { translateX: startPosition.x },
            { translateY: startPosition.y },
            { scale: size / 20 },
          ],
        },
      ]}
    >
      <FontAwesome name="heart" color={Colors.primary.light} size={size} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingHeartsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  floatingHeart: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '80%',
    maxWidth: 350,
  },
});