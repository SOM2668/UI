import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { useApp } from '@/contexts/AppContext';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { state, actions } = useApp();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await actions.signup(email.trim(), password, name.trim());
      router.replace('/(main)');
    } catch (error) {
      Alert.alert('Signup Failed', 'Something went wrong. Please try again.');
    }
  };

  const handleLoginNavigation = () => {
    router.push('/(auth)/login');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F0F8FF']}
        style={styles.gradient}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.logoContainer}>
          <Logo size="large" />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.formContainer}>
          <Text style={styles.title}>Join Flirtshaala!</Text>
          <Text style={styles.subtitle}>Create your account and start charming</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="person" size={20} color={Colors.neutral.dark} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Full Name"
                placeholderTextColor={Colors.neutral.dark}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrapper}>
              <MaterialIcons name="email" size={20} color={Colors.neutral.dark} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor={Colors.neutral.dark}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={Colors.neutral.dark} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor={Colors.neutral.dark}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Feather 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={Colors.neutral.dark} 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={Colors.neutral.dark} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, styles.passwordInput]}
                placeholder="Confirm Password"
                placeholderTextColor={Colors.neutral.dark}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Feather 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={Colors.neutral.dark} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={state.isLoading}
            fullWidth
            size="large"
            style={styles.signupButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLoginNavigation}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  formContainer: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    color: Colors.neutral.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: Colors.neutral.darker,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.light,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.neutral.medium,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: Colors.neutral.black,
    paddingVertical: 16,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  signupButton: {
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: Colors.neutral.darker,
  },
  loginLink: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: Colors.primary.main,
  },
});