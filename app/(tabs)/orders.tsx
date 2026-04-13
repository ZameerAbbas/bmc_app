// app/(tabs)/orders.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography } from '../../lib/theme';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { Card, EmptyState, StatusChip, Button } from '../../components/ui';

export default function OrdersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, loading } = useOrders(user?.uid);

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={Typography.h2}>My Orders</Text>
        </View>
        <EmptyState
          emoji="📦"
          title="Login to view orders"
          subtitle="Track your order history and reorder easily."
          action="Login"
          onAction={() => router.push('/auth/login')}
        />
      </SafeAreaView>
    );
  }

  if (orders.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={Typography.h2}>My Orders</Text>
        </View>
        <EmptyState
          emoji="📦"
          title="No orders yet"
          subtitle="Your order history will appear here once you place an order."
          action="Browse Products"
          onAction={() => router.push('/(tabs)/products')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={Typography.h2}>My Orders</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ padding: Spacing.md, gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const date = item.createdAt?.toDate
            ? item.createdAt.toDate().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'Recent';

          return (
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View>
                  <Text style={{ fontSize: 13, color: Colors.textMuted }}>Order #{item.id.slice(-6).toUpperCase()}</Text>
                  <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 2 }}>{date}</Text>
                </View>
                <StatusChip status={item.status} />
              </View>

              <View style={styles.divider} />

              {item.items.slice(0, 3).map((p) => (
                <View key={p.id} style={styles.itemRow}>
                  <Text style={{ fontSize: 14, flex: 1, color: Colors.text }} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: Colors.textSecondary }}>×{p.quantity}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.text, minWidth: 72, textAlign: 'right' }}>
                    Rs. {(p.price * p.quantity).toLocaleString()}
                  </Text>
                </View>
              ))}
              {item.items.length > 3 && (
                <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 4 }}>
                  +{item.items.length - 3} more item{item.items.length - 3 !== 1 ? 's' : ''}
                </Text>
              )}

              <View style={styles.divider} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 12, color: Colors.textMuted }}>Total</Text>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.primary }}>
                    Rs. {item.total.toLocaleString()}
                  </Text>
                </View>
                {item.status === 'delivered' && (
                  <Button
                    title="Reorder"
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      // Could pre-fill cart with these items
                      router.push('/(tabs)/products');
                    }}
                  />
                )}
              </View>
            </Card>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.sm },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
});
