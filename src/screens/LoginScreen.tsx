import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthService from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('otp');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (loginMethod === 'password' && !password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    if (loginMethod === 'otp' && !otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    setIsLoading(true);
    
    try {
      let response;
      
      if (loginMethod === 'password') {
        response = await AuthService.loginWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
      } else {
        response = await AuthService.verifyOTP({
          email: email.trim(),
          otp: otp.trim(),
        });
      }

      if (response.success) {
        // Use a dummy token if none provided, or use the actual token
        const token = response.token || 'dummy-auth-token';
        await login(token, response.data || response.user);
        // Navigation will be handled automatically by AuthContext
      } else {
        Alert.alert('Error', response.message || 'Login failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email first');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await AuthService.sendOTP({
        email: email.trim(),
      });

      if (response.success) {
        setOtpSent(true);
        Alert.alert('Success', 'OTP sent to your email address');
      } else {
        Alert.alert('Error', response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    await handleSendOTP();
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resetOtpFlow = () => {
    setOtpSent(false);
    setOtp('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#007bff" />
            </TouchableOpacity>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Login Method Toggle */}
          <View style={styles.methodToggle}>
            <TouchableOpacity
              style={[
                styles.methodButton,
                loginMethod === 'password' && styles.methodButtonActive,
              ]}
              onPress={() => {
                setLoginMethod('password');
                resetOtpFlow();
              }}
            >
              <Text
                style={[
                  styles.methodButtonText,
                  loginMethod === 'password' && styles.methodButtonTextActive,
                ]}
              >
                Password
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.methodButton,
                loginMethod === 'otp' && styles.methodButtonActive,
              ]}
              onPress={() => {
                setLoginMethod('otp');
                resetOtpFlow();
              }}
            >
              <Text
                style={[
                  styles.methodButtonText,
                  loginMethod === 'otp' && styles.methodButtonTextActive,
                ]}
              >
                OTP
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="jaysharma@mail.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!otpSent || loginMethod === 'password'}
              />
            </View>

            {/* Password Input */}
            {loginMethod === 'password' && (
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="********"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* OTP Flow */}
            {loginMethod === 'otp' && (
              <View style={styles.otpContainer}>
                {!otpSent ? (
                  // Step 1: Send OTP
                  <TouchableOpacity
                    style={[styles.sendOtpButton, isLoading && styles.sendOtpButtonDisabled]}
                    onPress={handleSendOTP}
                    disabled={isLoading}
                  >
                    <Text style={styles.sendOtpText}>
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  // Step 2: Enter OTP
                  <View>
                    <View style={styles.inputContainer}>
                      <Ionicons name="key-outline" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter 6-digit OTP code"
                        placeholderTextColor="#999"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="numeric"
                        maxLength={6}
                      />
                    </View>
                    <View style={styles.otpActions}>
                      <TouchableOpacity
                        style={styles.resendOtpButton}
                        onPress={handleResendOTP}
                        disabled={isLoading}
                      >
                        <Text style={styles.resendOtpText}>
                          {isLoading ? 'Sending...' : 'Resend OTP'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.changeEmailButton}
                        onPress={resetOtpFlow}
                      >
                        <Text style={styles.changeEmailText}>Change Email</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Forgot Password */}
            {loginMethod === 'password' && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading || (loginMethod === 'otp' && !otpSent)}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  methodButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  methodButtonTextActive: {
    color: '#007bff',
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#222',
  },
  eyeButton: {
    padding: 4,
  },
  otpContainer: {
    marginBottom: 16,
  },
  sendOtpButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendOtpButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendOtpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  resendOtpButton: {
    paddingVertical: 8,
  },
  resendOtpText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  changeEmailButton: {
    paddingVertical: 8,
  },
  changeEmailText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#666',
  },
  signupLink: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
});

export default LoginScreen;