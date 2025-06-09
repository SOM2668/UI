import React from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Upload, Clipboard, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { router } from 'expo-router';

export default function HomeScreen() {
  const handlePasteChat = () => {
    router.push('/home/paste-chat');
  };
  
  const handleUpload = () => {
    router.push('/home/upload-screenshot');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <LinearGradient
        colors={['#FFFFFF', '#FFE8EC']}
        style={styles.gradient}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Logo size="medium" showTagline={false} />
        </View>
        
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome to Flirtshaala
          </Text>
          <Text style={styles.tagline}>
            Turn Chats into Charm 💘
          </Text>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actionContainer}>
          <View style={styles.actionCard}>
            <Button
              title="Paste Chat"
              onPress={handlePasteChat}
              fullWidth
              size="large"
              icon={<Clipboard size={20} color={Colors.neutral.white} />}
              style={styles.actionButton}
            />
            <Text style={styles.actionDescription}>
              Copy & paste conversations from any messaging app
            </Text>
          </View>
          
          <View style={styles.actionSeparator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>OR</Text>
            <View style={styles.separatorLine} />
          </View>
          
          <View style={styles.actionCard}>
            <Button
              title="Upload Screenshot"
              onPress={handleUpload}
              variant="secondary"
              fullWidth
              size="large"
              icon={<Upload size={20} color={Colors.neutral.white} />}
              style={styles.actionButton}
            />
            <Text style={styles.actionDescription}>
              Upload screenshots of your conversations
            </Text>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Why Choose Flirtshaala?</Text>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Heart size={20} color={Colors.primary.main} fill={Colors.primary.main} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Personalized Flirting</Text>
              <Text style={styles.featureDescription}>
                Get custom flirty responses based on your conversation style
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Sparkles size={20} color={Colors.secondary.main} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>AI-Powered Magic</Text>
              <Text style={styles.featureDescription}>
                Our AI understands Indian dating culture and slang
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    color: Colors.neutral.black,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: Colors.neutral.darker,
    marginTop: 8,
    textAlign: 'center',
  },
  actionContainer: {
    marginBottom: 40,
  },
  actionCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 12,
  },
  actionDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.neutral.darker,
    textAlign: 'center',
  },
  actionSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral.medium,
  },
  separatorText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: Colors.neutral.darker,
    marginHorizontal: 16,
  },
  featuresContainer: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  featuresTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: Colors.neutral.black,
    marginBottom: 16,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: Colors.neutral.black,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.neutral.darker,
    lineHeight: 20,
  },
});