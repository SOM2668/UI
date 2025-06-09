import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useApp } from '@/contexts/AppContext';
import BannerAd from '@/components/BannerAd';

export default function MainLayout() {
  const { state } = useApp();

  // Redirect to auth if not authenticated
  if (!state.isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary.main,
          tabBarInactiveTintColor: Colors.neutral.darker,
          tabBarStyle: {
            backgroundColor: Colors.neutral.white,
            borderTopColor: Colors.neutral.medium,
            height: Platform.OS === 'ios' ? 90 : 70,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontFamily: 'Nunito-SemiBold',
            fontSize: 12,
            marginTop: 2,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="clock-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="premium"
          options={{
            title: 'Premium',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="crown" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
      
      {/* Show ads for non-premium users */}
      {state.showAds && (
        <BannerAd 
          onUpgrade={() => {
            // Navigate to premium screen
          }}
        />
      )}
    </>
  );
}