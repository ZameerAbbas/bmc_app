// app/order-success.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography } from '../lib/theme';
import { Button } from '../components/ui';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Animated success icon */}
        <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={{ fontSize: 64 }}>✅</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={[Typography.h1, { textAlign: 'center', marginBottom: 8 }]}>
            Order Placed!
          </Text>
          <Text style={[Typography.bodySmall, { textAlign: 'center', marginBottom: 4 }]}>
            Your order has been received.
          </Text>
          <Text style={[Typography.bodySmall, { textAlign: 'center', marginBottom: Spacing.xl }]}>
            Order #{orderId?.slice(-6).toUpperCase() || 'XXXXXX'}
          </Text>

          {/* Info cards */}
          <View style={styles.infoGrid}>
            <InfoCard emoji="🚀" title="Delivery Time" value="1–2 Hours" />
            <InfoCard emoji="📞" title="Questions?" value="0300-1234567" />
          </View>

          <View style={styles.steps}>
            {[
              { emoji: '✅', label: 'Order Received', done: true },
              { emoji: '🔄', label: 'Being Processed', done: false },
              { emoji: '🛵', label: 'On the Way', done: false },
              { emoji: '🏠', label: 'Delivered', done: false },
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepDot, step.done && styles.stepDotDone]}>
                  <Text style={{ fontSize: 12 }}>{step.emoji}</Text>
                </View>
                {i < 3 && <View style={[styles.stepLine, step.done && styles.stepLineDone]} />}
                <Text style={[
                  styles.stepLabel,
                  step.done && { color: Colors.accent, fontWeight: '700' },
                ]}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ width: '100%', gap: 10, marginTop: Spacing.xl }}>
            <Button
              title="Track My Order"
              onPress={() => router.push('/(tabs)/orders')}
              size="lg"
            />
            <Button
              title="Continue Shopping"
              onPress={() => router.replace('/(tabs)/index')}
              variant="ghost"
              size="lg"
            />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function InfoCard({ emoji, title, value }: { emoji: string; title: string; value: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={{ fontSize: 24 }}>{emoji}</Text>
      <Text style={{ fontSize: 11, color: Colors.textMuted, marginTop: 6 }}>{title}</Text>
      <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.text, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconWrap: { marginBottom: Spacing.lg },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.xl,
    width: '100%',
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  steps: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stepRow: { alignItems: 'center', flex: 1 },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  stepDotDone: {
    backgroundColor: Colors.accentLight,
    borderColor: Colors.accent,
  },
  stepLine: {
    position: 'absolute',
    top: 18,
    left: '60%',
    right: '-40%',
    height: 2,
    backgroundColor: Colors.border,
    zIndex: -1,
  },
  stepLineDone: { backgroundColor: Colors.accent },
  stepLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
});
