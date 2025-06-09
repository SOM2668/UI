import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Switch,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useApp } from '@/contexts/AppContext';

export default function SettingsScreen() {
  const { state, actions, dispatch } = useApp();

  const handlePremiumToggle = () => {
    if (state.user?.isPremium) {
      Alert.alert(
        'Disable Premium',
        'This will disable premium features and show ads again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
            onPress: () => dispatch({ type: 'SET_PREMIUM', payload: false })
          }
        ]
      );
    } else {
      router.push('/(main)/premium');
    }
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

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    rightComponent 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIconContainer}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      {rightComponent || (showChevron && onPress && (
        <MaterialIcons name="chevron-right" size={20} color={Colors.neutral.dark} />
      ))}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.gradient}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>
          Welcome, {state.user?.name}
        </Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <SectionHeader title="Account" />
          <View style={styles.section}>
            <SettingItem
              icon={<MaterialCommunityIcons name="crown\" size={22} color={Colors.secondary.main} />}
              title="Premium Status"
              subtitle={state.user?.isPremium ? 'Premium features enabled' : 'Free version'}
              rightComponent={
                <Switch
                  value={state.user?.isPremium}
                  onValueChange={handlePremiumToggle}
                  trackColor={{ 
                    false: Colors.neutral.medium, 
                    true: Colors.primary.light 
                  }}
                  thumbColor={state.user?.isPremium ? Colors.primary.main : Colors.neutral.white}
                />
              }
              showChevron={false}
            />
            
            {!state.user?.isPremium && (
              <SettingItem
                icon={<MaterialIcons name="security\" size={22} color={Colors.primary.main} />}
                title="Upgrade to Premium"
                subtitle="Remove ads and unlock all features"
                onPress={() => router.push('/(main)/premium')}
              />
            )}
          </View>
        </Animated.View>

        {/* App Settings */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <SectionHeader title="App Settings" />
          <View style={styles.section}>
            <SettingItem
              icon={<Ionicons name="notifications\" size={22} color={Colors.neutral.darker} />}
              title="Notifications"
              subtitle="Manage notification preferences"
              onPress={() => Alert.alert('Notifications', 'Notification settings coming soon!')}
            />
            
            <SettingItem
              icon={<Ionicons name="moon\" size={22} color={Colors.neutral.darker} />}
              title="Dark Mode"
              subtitle="Switch between light and dark themes"
              onPress={() => Alert.alert('Dark Mode', 'Theme settings coming soon!')}
            />
            
            <SettingItem
              icon={<Ionicons name="globe\" size={22} color={Colors.neutral.darker} />}
              title="Language"
              subtitle="English"
              onPress={() => Alert.alert('Language', 'Language settings coming soon!')}
            />
          </View>
        </Animated.View>

        {/* Data & Privacy */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <SectionHeader title="Data & Privacy" />
          <View style={styles.section}>
            <SettingItem
              icon={<MaterialIcons name="security\" size={22} color={Colors.neutral.darker} />}
              title="Clear Chat History"
              subtitle="Delete all saved conversations"
              onPress={() => {
                Alert.alert(
                  'Clear History',
                  'Are you sure you want to delete all chat history? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Clear', 
                      style: 'destructive',
                      onPress: () => {
                        dispatch({ type: 'CLEAR_CHAT_HISTORY' });
                        Alert.alert('Success', 'Chat history cleared!');
                      }
                    }
                  ]
                );
              }}
            />
          </View>
        </Animated.View>

        {/* Support */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <SectionHeader title="Support" />
          <View style={styles.section}>
            <SettingItem
              icon={<MaterialIcons name="help\" size={22} color={Colors.neutral.darker} />}
              title="Help & FAQ"
              subtitle="Get help and find answers"
              onPress={() => Alert.alert('Help', 'Help center coming soon!')}
            />
            
            <SettingItem
              icon={<MaterialIcons name="email\" size={22} color={Colors.neutral.darker} />}
              title="Contact Us"
              subtitle="Send feedback or report issues"
              onPress={() => Alert.alert('Contact', 'Contact form coming soon!')}
            />
            
            <SettingItem
              icon={<MaterialIcons name="star\" size={22} color={Colors.neutral.darker} />}
              title="Rate App"
              subtitle="Rate us on the app store"
              onPress={() => Alert.alert('Rate App', 'App store rating coming soon!')}
            />
          </View>
        </Animated.View>

        {/* About */}
        <Animated.View entering={FadeInDown.delay(500)}>
          <SectionHeader title="About" />
          <View style={styles.section}>
            <SettingItem
              icon={<MaterialIcons name="info\" size={22} color={Colors.neutral.darker} />}
              title="App Version"
              subtitle="1.0.0"
              showChevron={false}
            />
          </View>
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(600)}>
          <View style={styles.section}>
            <SettingItem
              icon={<MaterialIcons name="logout\" size={22} color={Colors.error.main} />}
              title="Logout"
              subtitle="Sign out of your account"
              onPress={handleLogout}
            />
          </View>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.light,
  },
  headerTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    color: Colors.neutral.black,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: Colors.neutral.darker,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: Colors.neutral.darker,
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 8,
  },
  section: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 16,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.light,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: Colors.neutral.black,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.neutral.darker,
  },
  bottomSpacer: {
    height: 40,
  },
});