import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { Redirect, Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold
} from '@expo-google-fonts/nunito';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  
  // Load Nunito font
  const [fontsLoaded, fontError] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
  });
  
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  
  useEffect(() => {
    onLayoutRootView();
    
    // In a real app, we would check if this is the first launch
    // using AsyncStorage or similar
    
    // For demo purposes, we'll simulate first launch
    // In a real app, you would persist this value
    setIsFirstLaunch(true);
    
    return () => {};
  }, [fontsLoaded, fontError]);

  // Show the splash screen until fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // If it's the first launch, show the welcome screen
  if (isFirstLaunch) {
    return (
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="welcome" />
      </Stack>
    );
  }
  
  // Otherwise, go directly to the tabs
  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
    </>
  );
}