import { createLoginStyles } from '@/assets/styles/login.styles';
import { useTheme } from '@/hooks/useTheme';
import { useAuthActions } from '@convex-dev/auth/react';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const LoginScreen = () => {
  const { signIn } = useAuthActions();

  const { colors } = useTheme();
  const styles = createLoginStyles(colors);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signIn('password', {
        email,
        password,
        flow: 'signIn',
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login failed:', error.message);
      } else {
        console.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity style={styles.showPasswordButton} onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, (!email || !password) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!email || !password || loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            <Text style={styles.toggleButtonText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
