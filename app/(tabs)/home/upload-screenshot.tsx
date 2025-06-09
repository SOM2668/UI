import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Platform,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Upload, 
  Copy, 
  CircleCheck as CheckCircle2, 
  Image as ImageIcon, 
  Camera,
  RefreshCw,
  Sparkles,
  Eye
} from 'lucide-react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';

const { width } = Dimensions.get('window');

interface ImageAsset {
  uri: string;
  width: number;
  height: number;
  type?: string;
  fileName?: string;
}

export default function UploadScreenshotScreen() {
  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const imageScale = useSharedValue(0);
  const replyScale = useSharedValue(0);

  const handleImagePicker = () => {
    // Mock image selection for UI demonstration
    const mockImage = {
      uri: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
      width: 400,
      height: 600,
      fileName: 'chat-screenshot.jpg'
    };
    
    setSelectedImage(mockImage);
    imageScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    
    // Mock extracted text
    setTimeout(() => {
      setExtractedText("Hey! Loved your profile. Would love to get to know you better 😊");
    }, 1000);
  };

  const handleGetReply = () => {
    // Mock reply for UI demonstration
    const mockReply = "Yeh toh full rizzz mode on hai 😎";
    setReply(mockReply);
    replyScale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };
  
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleReset = () => {
    setSelectedImage(null);
    setExtractedText(null);
    setReply(null);
    setCopied(false);
    imageScale.value = 0;
    replyScale.value = 0;
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
          <ArrowLeft size={24} color={Colors.neutral.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Screenshot</Text>
        <View style={styles.headerIcon}>
          <ImageIcon size={24} color={Colors.secondary.main} />
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
                    <Upload size={32} color={Colors.neutral.white} />
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
                  onPress={handleImagePicker}
                >
                  <Camera size={24} color={Colors.secondary.main} />
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
                  <RefreshCw size={20} color={Colors.neutral.white} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.imageInfo}>
                <Text style={styles.imageInfoText}>
                  {selectedImage.fileName || 'Screenshot'} • {Math.round(selectedImage.width)}×{Math.round(selectedImage.height)}
                </Text>
              </View>
            </Animated.View>
          )}
        </Animated.View>

        {/* Extracted Text */}
        {extractedText && (
          <Animated.View entering={FadeInDown.delay(200)}>
            <View style={styles.extractedTextCard}>
              <View style={styles.extractedTextHeader}>
                <Eye size={20} color={Colors.secondary.main} />
                <Text style={styles.extractedTextTitle}>Extracted Text:</Text>
              </View>
              <Text style={styles.extractedText}>{extractedText}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Get Witty Reply 💬"
                onPress={handleGetReply}
                fullWidth
                size="large"
                icon={<Sparkles size={20} color={Colors.neutral.white} />}
              />
            </View>
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
                  <CheckCircle2 size={24} color={Colors.success.main} />
                ) : (
                  <Copy size={24} color={Colors.primary.main} />
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
              icon={<RefreshCw size={20} color={Colors.primary.main} />}
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