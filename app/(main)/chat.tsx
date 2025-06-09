import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

export default function ChatScreen() {
  const [chatText, setChatText] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { actions } = useApp();
  
  const replyScale = useSharedValue(0);

  const handleGetReply = async () => {
    if (!chatText.trim()) {
      Alert.alert('Error', 'Please enter some text first');
      return;
    }

    setIsGenerating(true);
    try {
      // Add chat message to history
      const messageId = await actions.addChatMessage(chatText.trim(), 'paste');
      
      // Generate witty reply
      await actions.generateWittyReply(messageId);
      
      // Get the reply from the mock API directly for UI
      const mockReply = await getMockReply(chatText);
      setReply(mockReply);
      replyScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate reply. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopy = async () => {
    if (reply) {
      await Clipboard.setStringAsync(reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getMockReply = async (text: string): Promise<string> => {
    const wittyReplies = [
      "Yeh toh full rizz mode on hai 😎",
      "Smooth operator detected! 🔥",
      "Kya baat hai, charm level 💯",
      "Arre waah, flirting game strong! 💪",
      "Yeh toh next level charm hai bhai 🚀",
      "Rizz master in the house! 👑",
      "Smooth like butter, hot like fire 🔥",
      "Yeh toh professional flirter lag raha hai 😏",
      "Charm overload detected! ⚡",
      "Flirting level: Expert mode activated 🎯",
    ];
    
    return wittyReplies[Math.floor(Math.random() * wittyReplies.length)];
  };

  const replyAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: replyScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#FFF5F7']}
        style={styles.gradient}
      />
      
      {/* Header */}
      <Animated.View 
        entering={FadeIn}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.neutral.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paste Chat</Text>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="message-text" size={24} color={Colors.primary.main} />
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Input Section */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Paste your chat here 🧾</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={8}
                placeholder="Paste your conversation here... We'll help you craft the perfect witty reply! 💬"
                placeholderTextColor={Colors.neutral.dark}
                value={chatText}
                onChangeText={setChatText}
                textAlignVertical="top"
                maxLength={2000}
              />
              <View style={styles.characterCount}>
                <Text style={styles.characterCountText}>
                  {chatText.length}/2000
                </Text>
              </View>
            </View>
            <Text style={styles.hint}>
              We support Hinglish, Hindi & English — reply will match your vibe 💖
            </Text>
          </View>
        </Animated.View>

        {/* Action Button */}
        <Animated.View 
          entering={FadeInDown.delay(400)}
          style={styles.buttonContainer}
        >
          <Button
            title={isGenerating ? "Generating..." : "Get Witty Reply 💬"}
            onPress={handleGetReply}
            disabled={!chatText.trim() || isGenerating}
            loading={isGenerating}
            fullWidth
            size="large"
            icon={!isGenerating ? <MaterialCommunityIcons name="auto-fix\" size={20} color={Colors.neutral.white} /> : undefined}
          />
        </Animated.View>

        {/* Reply Section */}
        {reply && (
          <Animated.View 
            entering={FadeInDown.delay(200)}
            style={[styles.replyContainer, replyAnimatedStyle]}
          >
            <View style={styles.replyHeader}>
              <Text style={styles.replyHeaderText}>Your Witty Reply ✨</Text>
            </View>
            
            <View style={styles.replyBubbleContainer}>
              <LinearGradient
                colors={Colors.gradient.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.replyBubble}
              >
                <Text style={styles.replyText}>{reply}</Text>
              </LinearGradient>
              
              <TouchableOpacity
                onPress={handleCopy}
                style={styles.copyButton}
              >
                {copied ? (
                  <MaterialIcons name="check-circle\" size={24} color={Colors.success.main} />
                ) : (
                  <MaterialCommunityIcons name="content-copy" size={24} color={Colors.primary.main} />
                )}
              </TouchableOpacity>
            </View>
            
            {copied && (
              <Animated.Text 
                entering={FadeIn}
                style={styles.copiedText}
              >
                Copied to clipboard! 📋
              </Animated.Text>
            )}
          </Animated.View>
        )}

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
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.light,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral.light,
  },
  headerTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    color: Colors.neutral.black,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.accent.light,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: Colors.neutral.black,
    marginBottom: 16,
    textAlign: 'center',
  },
  textAreaContainer: {
    position: 'relative',
    backgroundColor: Colors.neutral.white,
    borderRadius: 20,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  textArea: {
    minHeight: 160,
    maxHeight: 240,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: Colors.neutral.black,
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.neutral.light,
    lineHeight: 24,
  },
  characterCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    backgroundColor: Colors.neutral.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  characterCountText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: Colors.neutral.dark,
  },
  hint: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.neutral.darker,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  replyContainer: {
    marginBottom: 24,
  },
  replyHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  replyHeaderText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: Colors.primary.main,
  },
  replyBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  replyBubble: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    marginRight: 12,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  replyText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: Colors.neutral.white,
    lineHeight: 24,
  },
  copyButton: {
    padding: 12,
    backgroundColor: Colors.neutral.white,
    borderRadius: 16,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  copiedText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: Colors.success.main,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});