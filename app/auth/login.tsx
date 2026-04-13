// app/auth/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography } from '../../lib/theme';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ redirect?: string }>();
  const { login, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      if (params.redirect) {
        router.replace(`/${params.redirect}` as any);
      } else {
        router.back();
      }
    } catch (e: any) {
      let msg = 'Login failed. Please try again.';
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.';
      } else if (e.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (e.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later.';
      }
      Alert.alert('Login Failed', msg);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Reset Password', 'Please enter your email address first.');
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(email.trim().toLowerCase());
      Alert.alert('Email Sent', 'Check your inbox for a password reset link.');
    } catch {
      Alert.alert('Error', 'Could not send reset email. Check the address and try again.');
    }
    setResetLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ fontSize: 22 }}>←</Text>
          </TouchableOpacity>

          {/* Logo / Brand */}
          <View style={styles.brand}>
            <View style={styles.logoCircle}>
              <Text style={{ fontSize: 36 }}>💊</Text>
            </View>
            <Text style={styles.brandName}>BARCHA Medicous</Text>
            <Text style={styles.brandSub}>Your trusted pharmacy in Gilgit</Text>
          </View>

          <Text style={[Typography.h2, { marginBottom: 6 }]}>Welcome Back</Text>
          <Text style={[Typography.bodySmall, { marginBottom: Spacing.xl }]}>
            Login to your account to continue
          </Text>

          {/* Email */}
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={styles.input}
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passWrap}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPass}
              autoComplete="password"
              style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'flex-end', marginBottom: Spacing.lg }}>
            <Text style={{ fontSize: 13, color: Colors.primary, fontWeight: '600' }}>
              {resetLoading ? 'Sending...' : 'Forgot Password?'}
            </Text>
          </TouchableOpacity>

          <Button title="Login" onPress={handleLogin} loading={loading} size="lg" />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={{ fontSize: 12, color: Colors.textMuted, paddingHorizontal: 12 }}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            onPress={() => router.replace({ pathname: '/auth/register', params })}
            style={styles.registerBtn}
          >
            <Text style={{ fontSize: 15, color: Colors.text }}>
              Don't have an account?{' '}
              <Text style={{ color: Colors.primary, fontWeight: '700' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingTop: Spacing.sm },
  backBtn: { marginBottom: Spacing.md, padding: 4, alignSelf: 'flex-start' },
  brand: { alignItems: 'center', marginBottom: Spacing.xl },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  brandName: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  brandSub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  passWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    paddingRight: 12,
  },
  eyeBtn: { padding: 4 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  registerBtn: { alignItems: 'center', paddingVertical: 8 },
});
