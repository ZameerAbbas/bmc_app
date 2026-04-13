// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography } from '../../lib/theme';
import { useAuth } from '../../context/AuthContext';
import { Button, Card } from '../../components/ui';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, logout, updateUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateUserProfile({ phone, address });
    setSaving(false);
    setEditing(false);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={Typography.h2}>Profile</Text>
        </View>
        <View style={{ flex: 1, padding: Spacing.lg }}>
          <View style={styles.loginCard}>
            <Text style={{ fontSize: 48, marginBottom: Spacing.md }}>👤</Text>
            <Text style={[Typography.h3, { textAlign: 'center', marginBottom: 6 }]}>
              Welcome to BMC
            </Text>
            <Text style={[Typography.bodySmall, { textAlign: 'center', marginBottom: Spacing.lg }]}>
              Login to access your orders, saved addresses, and more.
            </Text>
            <Button title="Login" onPress={() => router.push('/auth/login')} style={{ width: '100%' }} />
            <Button
              title="Create Account"
              variant="ghost"
              onPress={() => router.push('/auth/register')}
              style={{ width: '100%', marginTop: 10 }}
            />
          </View>
        </View>

        {/* Store Info */}
        <View style={{ padding: Spacing.md }}>
          <Card>
            <Text style={[Typography.h4, { marginBottom: Spacing.sm }]}>BMC Medical Store</Text>
            <InfoRow emoji="📍" text="Jutial Road, Gilgit, Pakistan" />
            <InfoRow emoji="📞" text="0300-1234567" />
            <InfoRow emoji="🕐" text="Open 24/7" />
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.header}>
          <Text style={Typography.h2}>Profile</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ color: Colors.danger, fontSize: 14, fontWeight: '600' }}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 36 }}>
              {profile?.displayName?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={[Typography.h3, { marginTop: Spacing.sm }]}>{profile?.displayName}</Text>
          <Text style={[Typography.bodySmall, { marginTop: 2 }]}>{user.email}</Text>
        </View>

        {/* Profile Details */}
        <View style={{ padding: Spacing.md, gap: 12 }}>
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md }}>
              <Text style={Typography.h4}>Personal Info</Text>
              <TouchableOpacity onPress={() => setEditing(!editing)}>
                <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: '600' }}>
                  {editing ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>

            <LabeledField label="Name" value={profile?.displayName || ''} />
            <LabeledField label="Email" value={user.email || ''} />

            {editing ? (
              <>
                <Text style={styles.fieldLabel}>Phone</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+92 300 XXXXXXX"
                  keyboardType="phone-pad"
                  style={styles.input}
                  placeholderTextColor={Colors.textMuted}
                />
                <Text style={styles.fieldLabel}>Delivery Address</Text>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Street, Area, City"
                  multiline
                  numberOfLines={2}
                  style={[styles.input, { height: 72, textAlignVertical: 'top' }]}
                  placeholderTextColor={Colors.textMuted}
                />
                <Button title="Save Changes" onPress={handleSave} loading={saving} style={{ marginTop: 8 }} />
              </>
            ) : (
              <>
                <LabeledField label="Phone" value={profile?.phone || 'Not set'} />
                <LabeledField label="Address" value={profile?.address || 'Not set'} />
              </>
            )}
          </Card>

          {/* Quick Links */}
          <Card>
            <Text style={[Typography.h4, { marginBottom: Spacing.md }]}>Quick Links</Text>
            {[
              { emoji: '📦', label: 'My Orders', onPress: () => router.push('/(tabs)/orders') },
              { emoji: '💊', label: 'Browse Products', onPress: () => router.push('/(tabs)/products') },
              { emoji: '📍', label: 'Our Branches', onPress: () => {} },
              { emoji: '📞', label: 'Contact Us (0300-1234567)', onPress: () => {} },
            ].map((item) => (
              <TouchableOpacity key={item.label} onPress={item.onPress} style={styles.linkRow}>
                <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
                <Text style={{ flex: 1, fontSize: 14, color: Colors.text, marginLeft: 12 }}>{item.label}</Text>
                <Text style={{ color: Colors.textMuted }}>›</Text>
              </TouchableOpacity>
            ))}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LabeledField({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: Spacing.sm }}>
      <Text style={{ fontSize: 12, color: Colors.textMuted, fontWeight: '600', marginBottom: 2 }}>{label}</Text>
      <Text style={{ fontSize: 15, color: Colors.text }}>{value}</Text>
    </View>
  );
}

function InfoRow({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
      <Text style={{ fontSize: 14 }}>{emoji}</Text>
      <Text style={{ fontSize: 14, color: Colors.textSecondary, flex: 1 }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  loginCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatarSection: { alignItems: 'center', paddingVertical: Spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  fieldLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
});
