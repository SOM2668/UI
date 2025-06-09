import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { 
  Ionicons, 
  MaterialCommunityIcons, 
  MaterialIcons
} from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

interface ImageAsset {
  uri: string;
  width: number;
  height: number;
  type?: string;
  fileName?: string;
}

export default function UploadScreen() {
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { actions } = useApp();
  
  const imageScale = useSharedValue(0);
  const replyScale = useSharedValue(0);

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const imageAsset: ImageAsset = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileName: asset.fileName || 'screenshot.jpg'
        };
        
        setSelectedImage(imageAsset);
        imageScale.value = withSpring(1, { damping: 15, stiffness: 150 });
        
        // Extract text from image
        setIsExtracting(true);
        try {
          const text = await actions.extractTextFromImage(asset.uri);
          setExtractedText(text);
        } catch (error) {
          Alert.alert('Error', 'Failed to extract text from image');
        } finally {
          setIsExtracting(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const imageAsset: ImageAsset = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileName: 'camera-photo.jpg'
        };
        
        setSelectedImage(imageAsset);
        imageScale.value = withSpring(1, { damping: 15, stiffness: 150 });
        
        // Extract text from image
        setIsExtracting(true);
        try {
          const text = await actions.extractTextFromImage(asset.uri);
          setExtractedText(text);
        } catch (error) {
          Alert.alert('Error', 'Failed to extract text from image');
        } finally {
          setIsExtracting(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleGetReply = async () => {
    if (!extractedText) return;

    setIsGenerating(true);
    try {
      // Add chat message to history
      const messageId = await actions.addChatMessage(extractedText, 'screenshot', selectedImage?.uri);
      
      // Generate witty reply
      await actions.generateWittyReply(messageId);
      
      // Get the reply from the mock API directly for UI
      const mockReply = await getMockReply(extractedText);
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
  
  const handleReset = () => {
    setSelectedImage(null);
    setExtractedText(null);
    setReply(null);
    setCopied(false);
    imageScale.value = 0;
    replyScale.value = 0;
  };

  const getMockReply = async (text: string): Promise<string> => {
    const wittyReplies = [
      "Yeh toh full rizz mode on hai 😎",
      "Smooth operator detected! 🔥",
      "Kya baat hai, charm level 💯",
      "Arre waah, flirting game strong! 💪",
      "Yeh toh next level charm hai bhai 🚀",
    ];
    
    return wittyReplies[Math.floor(Math.random() * wittyReplies.length)];
  };

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: imageScale.value }],
    };
  });

  const replyAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: replyScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F0F8FF']}
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
        <Text style={styles.headerTitle}>Upload Screenshot</Text>
        <View style={styles.headerIcon}>
          <MaterialIcons name="image" size={24} color={Colors.secondary.main} />
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Section */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={styles.label}>Choose a screenshot of your chat 💬</Text>
          
          {!selectedImage ? (
            <View style={styles.uploadSection}>
              <View style={styles.uploadArea}>
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={handleImagePicker}
                >
                  <LinearGradient
                    colors={Colors.gradient.secondary}
                    style={styles.uploadButtonGradient}
                  >
                    <MaterialCommunityIcons name="upload" size={32} color={Colors.neutral.white} />
                    <Text style={styles.uploadText}>Upload from Gallery</Text>
                    <Text style={styles.uploadHint}>PNG, JPG up to 10MB</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              
              {Platform.OS !== 'web' && (
                <View style={styles.orContainer}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.orLine} />
                </View>
              )}
              
              {Platform.OS !== 'web' && (
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={handleTakePhoto}
                >
                  <MaterialIcons name="camera-alt" size={24} color={Colors.secondary.main} />
                  <Text style={styles.cameraButtonText}>Take Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Animated.View style={[styles.imagePreviewContainer, imageAnimatedStyle]}>
              <View style={styles.imagePreview}>
                <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={handleReset}
                >
                  <MaterialCommunityIcons name="refresh" size={20} color={Colors.neutral.white} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.imageInfo}>
                <Text style={styles.imageInfoText}>
                  {selectedImage.fileName} • {Math.round(selectedImage.width)}×{Math.round(selectedImage.height)}
                </Text>
              </View>
            </Animated.View>
          )}
        </Animated.View>

        {/* Extracted Text */}
        {(extractedText || isExtracting) && (
          <Animated.View entering={FadeInDown.delay(200)}>
            <View style={styles.extractedTextCard}>
              <View style={styles.extractedTextHeader}>
                <MaterialIcons name="visibility" size={20} color={Colors.secondary.main} />
                <Text style={styles.extractedTextTitle}>
                  {isExtracting ? 'Extracting Text...' : 'Extracted Text:'}
                </Text>
              </View>
              {isExtracting ? (
                <Text style={styles.extractingText}>Processing image...</Text>
              ) : (
                <Text style={styles.extractedText}>{extractedText}</Text>
              )}
            </View>
            
            {extractedText && !isExtracting && (
              <View style={styles.buttonContainer}>
                <Button
                  title={isGenerating ? "Generating..." : "Get Witty Reply 💬"}
                  onPress={handleGetReply}
                  loading={isGenerating}
                  disabled={isGenerating}
                  fullWidth
                  size="large"
                  icon={!isGenerating ? <MaterialCommunityIcons name="auto-fix\" size={20} color={Colors.neutral.white} /> : undefined}
                />
              </View>
            )}
          </Animated.View>
        )}

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

        {/* Reset Button */}
        {(extractedText || reply) && (
          <Animated.View 
            entering={FadeInDown.delay(400)}
            style={styles.resetContainer}
          >
            <Button
              title="Try Another Screenshot"
              onPress={handleReset}
              variant="outline"
              fullWidth
              icon={<MaterialCommunityIcons name="refresh\" size={20} color={Colors.primary.main} />}
            />
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
  label: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: Colors.neutral.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadArea: {
    marginBottom: 16,
  },
  uploadButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  uploadButtonGradient: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  uploadText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: Colors.neutral.white,
    marginTop: 12,
  },
  uploadHint: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.neutral.white,
    marginTop: 4,
    opacity: 0.9,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral.medium,
  },
  orText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: Colors.neutral.darker,
    marginHorizontal: 16,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.secondary.light,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cameraButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: Colors.secondary.main,
    marginLeft: 8,
  },
  imagePreviewContainer: {
    marginBottom: 24,
  },
  imagePreview: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  changeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  imageInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  imageInfoText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: Colors.neutral.dark,
  },
  extractedTextCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary.main,
  },
  extractedTextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  extractedTextTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: Colors.neutral.black,
    marginLeft: 8,
  },
  extractedText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: Colors.neutral.darker,
    lineHeight: 24,
  },
  extractingText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: Colors.neutral.dark,
    fontStyle: 'italic',
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
  resetContainer: {
    marginBottom: 24,
  },
  bottomSpacer: {
    height: 40,
  },
});