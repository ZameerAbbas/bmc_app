// app/(tabs)/cart.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography } from '../../lib/theme';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button, EmptyState, Card } from '../../components/ui';

export default function CartScreen() {
  const router = useRouter();
  const { items, totalItems, subtotal, removeItem, updateQty, clearCart } = useCart();
  const { user } = useAuth();

  const deliveryFee = subtotal >= 2000 ? 0 : 150;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!user) {
      // Prompt login before checkout
      Alert.alert(
        'Login Required',
        'Please login or create an account to place your order.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/auth/login?redirect=checkout') },
          { text: 'Sign Up', onPress: () => router.push('/auth/register?redirect=checkout') },
        ]
      );
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={Typography.h2}>My Cart</Text>
        </View>
        <EmptyState
          emoji="🛒"
          title="Your cart is empty"
          subtitle="Add medicines and products to your cart to get started."
          action="Browse Products"
          onAction={() => router.push('/(tabs)/products')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={Typography.h2}>My Cart</Text>
        <TouchableOpacity
          onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: clearCart },
          ])}
        >
          <Text style={{ color: Colors.danger, fontSize: 14, fontWeight: '600' }}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: Spacing.md, gap: 10 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Card style={{ marginTop: Spacing.md }}>
            <Text style={[Typography.h4, { marginBottom: Spacing.md }]}>Order Summary</Text>
            <Row label="Subtotal" value={`Rs. ${subtotal.toLocaleString()}`} />
            <Row
              label="Delivery Fee"
              value={deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
              valueColor={deliveryFee === 0 ? Colors.accent : Colors.text}
            />
            {subtotal < 2000 && (
              <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 4 }}>
                Add Rs. {(2000 - subtotal).toLocaleString()} more for free delivery
              </Text>
            )}
            <View style={styles.divider} />
            <Row label="Total" value={`Rs. ${total.toLocaleString()}`} bold />
            <Button
              title={user ? 'Proceed to Checkout' : 'Login to Checkout'}
              onPress={handleCheckout}
              size="lg"
              style={{ marginTop: Spacing.md }}
            />
            {!user && (
              <Text style={{ fontSize: 12, color: Colors.textMuted, textAlign: 'center', marginTop: 8 }}>
                Already have an account?{' '}
                <Text
                  style={{ color: Colors.primary, fontWeight: '600' }}
                  onPress={() => router.push('/auth/login?redirect=checkout')}
                >
                  Login
                </Text>
              </Text>
            )}
          </Card>
        }
        renderItem={({ item }) => (
          <Card style={{ flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' }}>
            <Image
              source={{ uri: item.image || 'https://via.placeholder.com/72x72/0A7EA4/FFFFFF?text=Med' }}
              style={styles.img}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.text }} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 2 }}>
                Rs. {item.price} each
              </Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  onPress={() => updateQty(item.id, item.quantity - 1)}
                  style={styles.qtyBtn}
                >
                  <Text style={{ fontSize: 18, color: Colors.primary, fontWeight: '700' }}>−</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 15, fontWeight: '700', minWidth: 28, textAlign: 'center' }}>
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => updateQty(item.id, item.quantity + 1)}
                  style={styles.qtyBtn}
                >
                  <Text style={{ fontSize: 18, color: Colors.primary, fontWeight: '700' }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.primary }}>
                Rs. {(item.price * item.quantity).toLocaleString()}
              </Text>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Text style={{ fontSize: 18 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

function Row({ label, value, bold, valueColor }: {
  label: string; value: string; bold?: boolean; valueColor?: string;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
      <Text style={{ fontSize: 14, color: bold ? Colors.text : Colors.textSecondary, fontWeight: bold ? '700' : '400' }}>
        {label}
      </Text>
      <Text style={{ fontSize: 14, color: valueColor || (bold ? Colors.text : Colors.textSecondary), fontWeight: bold ? '700' : '500' }}>
        {value}
      </Text>
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
  img: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    backgroundColor: Colors.borderLight,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    height: 34,
  },
  qtyBtn: {
    paddingHorizontal: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
});
