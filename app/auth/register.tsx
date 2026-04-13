// app/auth/register.tsx
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

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ redirect?: string }>();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password, phone.trim());
      if (params.redirect) {
        router.replace(`/${params.redirect}` as any);
      } else {
        router.back();
      }
    } catch (e: any) {
      let msg = 'Registration failed. Please try again.';
      if (e.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists.';
      } else if (e.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (e.code === 'auth/weak-password') {
        msg = 'Password is too weak. Use at least 6 characters.';
      }
      Alert.alert('Sign Up Failed', msg);
    }
    setLoading(false);
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ fontSize: 22 }}>←</Text>
          </TouchableOpacity>

          <View style={styles.brand}>
            <View style={styles.logoCircle}>
              <Text style={{ fontSize: 36 }}>💊</Text>
            </View>
            <Text style={styles.brandName}>BARCHA Medicous</Text>
          </View>

          <Text style={[Typography.h2, { marginBottom: 6 }]}>Create Account</Text>
          <Text style={[Typography.bodySmall, { marginBottom: Spacing.xl }]}>
            Join thousands of customers in Gilgit
          </Text>

          <Field label="Full Name *" value={name} onChange={setName} placeholder="Ahmad Khan" />
          <Field
            label="Email Address *"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="Phone Number"
            value={phone}
            onChange={setPhone}
            placeholder="+92 300 XXXXXXX"
            keyboardType="phone-pad"
          />

          {/* Password */}
          <Text style={styles.label}>Password *</Text>
          <View style={styles.passWrap}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 6 characters"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPass}
              style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 4 }}>
              <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <Field
            label="Confirm Password *"
            value={confirm}
            onChange={setConfirm}
            placeholder="Re-enter password"
            secureTextEntry
          />

          <Text style={styles.terms}>
            By signing up, you agree to our{' '}
            <Text style={{ color: Colors.primary }}>Terms of Service</Text> and{' '}
            <Text style={{ color: Colors.primary }}>Privacy Policy</Text>.
          </Text>

          <Button title="Create Account" onPress={handleRegister} loading={loading} size="lg" />

          <TouchableOpacity
            onPress={() => router.replace({ pathname: '/auth/login', params })}
            style={styles.loginBtn}
          >
            <Text style={{ fontSize: 15, color: Colors.text }}>
              Already have an account?{' '}
              <Text style={{ color: Colors.primary, fontWeight: '700' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label, value, onChange, placeholder, keyboardType, autoCapitalize, secureTextEntry,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  keyboardType?: any; autoCapitalize?: any; secureTextEntry?: boolean;
}) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize || 'words'}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingTop: Spacing.sm },
  backBtn: { marginBottom: Spacing.md, padding: 4, alignSelf: 'flex-start' },
  brand: { alignItems: 'center', marginBottom: Spacing.xl },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  brandName: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
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
  terms: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
  loginBtn: { alignItems: 'center', paddingVertical: 16 },
});
