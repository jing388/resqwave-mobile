import CustomButton from '@/components/custom-button';
import CountryCodePicker from '@/components/CountryCodePicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  SafeAreaView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const COUNTRIES = [
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
];

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    phone: false,
    password: false
  });
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  
  // Check if both fields are filled to enable the button
  const isFormValid = phoneNumber.trim().length >= 10 && password.trim().length >= 6;

  const handleLogin = () => {
    if (isFormValid) {
      // Handle login logic here
      console.log('Login attempted with:', { phoneNumber, password });
      // Navigate to the main app
      router.replace('/(tabs)');
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log('Forgot password pressed');
  };

  const handleBack = () => {
    // Always navigate back to the landing page
    router.replace('/');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>
        {/* Gradient Background */}
        <LinearGradient
          colors={['#1F2937', '#171717']}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Image 
              source={require('@/assets/images/left-arrow.png')} 
              style={styles.backArrow}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
          <View style={styles.headerRight} />
        </View>
        
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Logo and Title */}
              <View style={styles.logoContainer}>
                <View style={styles.logoWrapper}>
                  <Image 
                    source={require('@/assets/images/ResQWaveLogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.title}>Log in to ResQWave</Text>
                <Text style={styles.subtitle}>Stronger Signals, Safer Communities.</Text>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                {/* Phone Number Input */}
                <View style={[
                  styles.inputContainer, 
                  isFocused.phone && styles.inputFocused
                ]}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <View style={styles.phoneInputWrapper}>
                    <CountryCodePicker
                      selectedCountry={selectedCountry}
                      onSelect={setSelectedCountry}
                    />
                    <TextInput
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      onFocus={() => setIsFocused({...isFocused, phone: true})}
                      onBlur={() => setIsFocused({...isFocused, phone: false})}
                      placeholder="Enter your phone number"
                      placeholderTextColor="#6B7280"
                      keyboardType="phone-pad"
                      style={styles.phoneInput}
                      maxLength={11}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={[
                  styles.inputContainer, 
                  isFocused.password && styles.inputFocused
                ]}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setIsFocused({...isFocused, password: true})}
                      onBlur={() => setIsFocused({...isFocused, password: false})}
                      placeholder="Enter your password"
                      placeholderTextColor="#6B7280"
                      secureTextEntry={!showPassword}
                      style={styles.passwordInput}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.passwordToggle}
                    >
                      <Text style={styles.passwordToggleText}>
                        {showPassword ? (
                          <Ionicons name="eye-off" size={20} color="#9CA3AF" />
                        ) : (
                          <Ionicons name="eye" size={20} color="#9CA3AF" />
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity 
                  onPress={handleForgotPassword} 
                  style={styles.forgotPasswordButton}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot your password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          
          {/* Fixed Bottom Area */}
          <View style={styles.footerContainer}>
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Login"
                onPress={handleLogin}
                variant={isFormValid ? "gradient-accent" : "primary"}
                size="lg"
                width="full"
                disabled={!isFormValid}
              />
            </View>
            
            <View style={styles.signUpContainer}>
              <Text style={styles.footerText}>
                Do not have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.signUpText}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        <StatusBar style="light" backgroundColor="#000000" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Geist_600SemiBold',
  },
  headerRight: {
    width: 40, // Same as backButton for balance
  },
  keyboardAvoidingView: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 200, // More space for form content
  },
  inputFocused: {
    borderColor: '#3B82F6',
  },
  footerContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: '#171717',
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    color: '#F9FAFB',
    fontSize: 24,
    fontFamily: 'Geist_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Geist_400Regular',
    textAlign: 'center',
  },
  formContainer: {
    gap: 16,
    marginBottom: 32,
  },
  inputContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  inputLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Geist_500Medium',
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: '#1F2937',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    height: 56,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  phoneInput: {
    flex: 1,
    color: '#F9FAFB',
    fontSize: 16,
    height: '100%',
    marginLeft: 12,
    fontFamily: 'Geist_400Regular',
    paddingVertical: 0,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    color: '#F9FAFB',
    fontSize: 16,
    height: '100%',
    paddingRight: 8,
    fontFamily: 'Geist_400Regular',
    paddingVertical: 0,
  },
  passwordToggle: {
    padding: 8,
  },
  passwordToggleText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Geist_600SemiBold',
    textTransform: 'uppercase',
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 4,
    padding: 8,
  },
  forgotPasswordText: {
    color: '#3B82F6',
    fontSize: 14,
    fontFamily: 'Geist_500Medium',
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Geist_400Regular',
  },
  signUpText: {
    color: '#3B82F6',
    fontSize: 14,
    fontFamily: 'Geist_600SemiBold',
  },
});
