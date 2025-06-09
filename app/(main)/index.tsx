import React from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import PremiumBadge from '@/components/PremiumBadge';
import { useApp } from '@/contexts/AppContext';

export default function HomeScreen() {
  const { state, actions } = useApp();

  const handlePasteChat = () => {
    router.push('/(main)/chat');
  };
  
  const handleUpload = () => {
    router.push('/(main)/upload');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await actions.logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
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
          <View style={styles.headerTop}>
            <Logo size="medium" showTagline={false} />
            <View style={styles.headerRight}>
              {state.user?.isPremium && <PremiumBadge size="small" />}
              <Button
                title=""
                onPress={handleLogout}
                variant="outline"
                size="small"
                icon={<MaterialIcons name="logout" size={16} color={Colors.primary.main} />}
                style={styles.logoutButton}
              />
            </View>
          </View>
          <Text style={styles.welcomeText}>
            Welcome back, {state.user?.name}! 👋
          </Text>
        </View>
        
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{state.chatHistory.length}</Text>
            <Text style={styles.statLabel}>Chats Analyzed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {state.chatHistory.filter(chat => chat.wittyReply).length}
            </Text>
            <Text style={styles.statLabel}>Witty Replies</Text>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actionContainer}>
          <View style={styles.actionCard}>
            <Button
              title="Paste Chat"
              onPress={handlePasteChat}
              fullWidth
              size="large"
              icon={<MaterialCommunityIcons name="content-paste" size={20} color={Colors.neutral.white} />}
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
              icon={<MaterialCommunityIcons name="upload" size={20} color={Colors.neutral.white} />}
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
              <FontAwesome name="heart" size={20} color={Colors.primary.main} />
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
              <MaterialCommunityIcons name="auto-fix" size={20} color={Colors.secondary.main} />
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
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    paddingHorizontal: 8,
  },
  welcomeText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 18,
    color: Colors.neutral.darker,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    color: Colors.primary.main,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.neutral.darker,
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