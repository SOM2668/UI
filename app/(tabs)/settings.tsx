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
import { Settings as SettingsIcon, Crown, Shield, Bell, Moon, Globe, CircleHelp as HelpCircle, Mail, Star, ChevronRight, Info } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '@/constants/Colors';

export default function SettingsScreen() {
  const [isPremium, setIsPremium] = React.useState(false);

  const handlePremiumToggle = () => {
    Alert.alert(
      isPremium ? 'Disable Premium' : 'Enable Premium',
      isPremium 
        ? 'This will disable premium features and show ads again.' 
        : 'This will enable premium features and remove all ads.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: isPremium ? 'Disable' : 'Enable', 
          onPress: () => setIsPremium(!isPremium)
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
        <ChevronRight size={20} color={Colors.neutral.dark} />
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
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Section */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <SectionHeader title="Premium" />
          <View style={styles.section}>
            <SettingItem
              icon={<Crown size={22} color={Colors.secondary.main} />}
              title="Premium Status"
              subtitle={isPremium ? 'Premium features enabled' : 'Free version'}
              rightComponent={
                <Switch
                  value={isPremium}
                  onValueChange={handlePremiumToggle}
                  trackColor={{ 
                    false: Colors.neutral.medium, 
                    true: Colors.primary.light 
                  }}
                  thumbColor={isPremium ? Colors.primary.main : Colors.neutral.white}
                />
              }
              showChevron={false}
            />
            
            {!isPremium && (
              <SettingItem
                icon={<Shield size={22} color={Colors.primary.main} />}
                title="Upgrade to Premium"
                subtitle="Remove ads and unlock all features"
                onPress={() => Alert.alert('Upgrade', 'Premium upgrade coming soon!')}
              />
            )}
          </View>
        </Animated.View>

        {/* App Settings */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <SectionHeader title="App Settings" />
          <View style={styles.section}>
            <SettingItem
              icon={<Bell size={22} color={Colors.neutral.darker} />}
              title="Notifications"
              subtitle="Manage notification preferences"
              onPress={() => Alert.alert('Notifications', 'Notification settings coming soon!')}
            />
            
            <SettingItem
              icon={<Moon size={22} color={Colors.neutral.darker} />}
              title="Dark Mode"
              subtitle="Switch between light and dark themes"
              onPress={() => Alert.alert('Dark Mode', 'Theme settings coming soon!')}
            />
            
            <SettingItem
              icon={<Globe size={22} color={Colors.neutral.darker} />}
              title="Language"
              subtitle="English"
              onPress={() => Alert.alert('Language', 'Language settings coming soon!')}
            />
          </View>
        </Animated.View>

        {/* Support */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <SectionHeader title="Support" />
          <View style={styles.section}>
            <SettingItem
              icon={<HelpCircle size={22} color={Colors.neutral.darker} />}
              title="Help & FAQ"
              subtitle="Get help and find answers"
              onPress={() => Alert.alert('Help', 'Help center coming soon!')}
            />
            
            <SettingItem
              icon={<Mail size={22} color={Colors.neutral.darker} />}
              title="Contact Us"
              subtitle="Send feedback or report issues"
              onPress={() => Alert.alert('Contact', 'Contact form coming soon!')}
            />
            
            <SettingItem
              icon={<Star size={22} color={Colors.neutral.darker} />}
              title="Rate App"
              subtitle="Rate us on the app store"
              onPress={() => Alert.alert('Rate App', 'App store rating coming soon!')}
            />
          </View>
        </Animated.View>

        {/* About */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <SectionHeader title="About" />
          <View style={styles.section}>
            <SettingItem
              icon={<Info size={22} color={Colors.neutral.darker} />}
              title="App Version"
              subtitle="1.0.0"
              showChevron={false}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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