// app/product/[id].tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography } from '../../lib/theme';
import { useProduct } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import { Button, Badge, Card } from '../../components/ui';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { product, loading } = useProduct(id);
  const { addItem, isInCart, getQty, updateQty } = useCart();

  if (loading || !product) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 32 }}>💊</Text>
          <Text style={[Typography.bodySmall, { marginTop: 8 }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const qty = getQty(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const inCart = isInCart(product.id);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Top Nav */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
            <Text style={{ fontSize: 22 }}>←</Text>
          </TouchableOpacity>
          <Text style={Typography.h4} numberOfLines={1} style={{ flex: 1, textAlign: 'center' }}>
            {product.category}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} style={styles.navBtn}>
            <Text style={{ fontSize: 22 }}>🛒</Text>
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <View style={styles.imageWrap}>
          {discount > 0 && (
            <View style={styles.discountTag}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: Colors.white }}>{discount}% OFF</Text>
            </View>
          )}
          <Image
            source={{
              uri: product.image || `https://via.placeholder.com/400x320/0A7EA4/FFFFFF?text=${encodeURIComponent(product.name)}`,
            }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        <View style={{ padding: Spacing.md }}>
          {/* Brand & Category */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            {product.brand && <Badge label={product.brand} />}
            <Badge label={product.category} color={Colors.accent} bg={Colors.accentLight} />
          </View>

          {/* Name */}
          <Text style={[Typography.h2, { marginBottom: 4 }]}>{product.name}</Text>
          {product.unit && (
            <Text style={[Typography.bodySmall, { marginBottom: Spacing.sm }]}>{product.unit}</Text>
          )}

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>Rs. {product.price.toLocaleString()}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>Rs. {product.originalPrice.toLocaleString()}</Text>
            )}
            {discount > 0 && (
              <View style={styles.savingChip}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.danger }}>
                  Save Rs. {(product.originalPrice! - product.price).toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          {/* Stock */}
          <View style={[styles.stockRow, { backgroundColor: product.stock > 0 ? Colors.accentLight : Colors.dangerLight }]}>
            <Text style={{
              fontSize: 13, fontWeight: '600',
              color: product.stock > 0 ? Colors.accent : Colors.danger,
            }}>
              {product.stock > 0
                ? product.stock < 10
                  ? `⚠️ Only ${product.stock} left in stock`
                  : `✓ In Stock (${product.stock} available)`
                : '✕ Out of Stock'}
            </Text>
          </View>

          {/* Description */}
          {product.description && (
            <Card style={{ marginTop: Spacing.md }}>
              <Text style={[Typography.h4, { marginBottom: 6 }]}>Description</Text>
              <Text style={{ fontSize: 14, color: Colors.textSecondary, lineHeight: 22 }}>
                {product.description}
              </Text>
            </Card>
          )}

          {/* Details */}
          <Card style={{ marginTop: Spacing.md }}>
            <Text style={[Typography.h4, { marginBottom: Spacing.sm }]}>Product Details</Text>
            {[
              { label: 'Brand', value: product.brand || 'N/A' },
              { label: 'Category', value: product.category },
              { label: 'Pack Size', value: product.unit || 'N/A' },
              { label: 'Availability', value: product.isAvailable !== false ? 'Available' : 'Unavailable' },
            ].map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={{ fontSize: 13, color: Colors.textMuted, width: 100 }}>{row.label}</Text>
                <Text style={{ fontSize: 13, color: Colors.text, fontWeight: '500', flex: 1 }}>{row.value}</Text>
              </View>
            ))}
          </Card>

          {/* Delivery Info */}
          <Card style={{ marginTop: Spacing.md }}>
            <Text style={[Typography.h4, { marginBottom: Spacing.sm }]}>Delivery Info</Text>
            <View style={{ gap: 8 }}>
              <InfoLine emoji="🚀" text="Delivery within 1–2 hours in Gilgit" />
              <InfoLine emoji="🆓" text="Free delivery on orders above Rs. 2,000" />
              <InfoLine emoji="✅" text="100% genuine, licensed product" />
              <InfoLine emoji="🕐" text="Order anytime — we're available 24/7" />
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        {qty === 0 ? (
          <Button
            title="Add to Cart"
            onPress={() => addItem(product)}
            size="lg"
            style={{ flex: 1 }}
            disabled={product.stock === 0}
          />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 }}>
            <View style={styles.qtyControl}>
              <TouchableOpacity onPress={() => updateQty(product.id, qty - 1)} style={styles.qtyBtn}>
                <Text style={{ fontSize: 20, color: Colors.primary, fontWeight: '700' }}>−</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: '700', minWidth: 32, textAlign: 'center' }}>{qty}</Text>
              <TouchableOpacity onPress={() => updateQty(product.id, qty + 1)} style={styles.qtyBtn}>
                <Text style={{ fontSize: 20, color: Colors.primary, fontWeight: '700' }}>+</Text>
              </TouchableOpacity>
            </View>
            <Button
              title="Go to Cart"
              onPress={() => router.push('/(tabs)/cart')}
              size="lg"
              style={{ flex: 1 }}
              variant="secondary"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function InfoLine({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
      <Text style={{ fontSize: 14 }}>{emoji}</Text>
      <Text style={{ fontSize: 13, color: Colors.textSecondary, flex: 1 }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    gap: 8,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageWrap: {
    width: width,
    height: 280,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productImage: { width: width - 64, height: 240 },
  discountTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: Colors.danger,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 1,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.sm },
  price: { fontSize: 26, fontWeight: '800', color: Colors.primary },
  originalPrice: { fontSize: 16, color: Colors.textMuted, textDecorationLine: 'line-through' },
  savingChip: {
    backgroundColor: Colors.dangerLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  stockRow: {
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
    flexDirection: 'row',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    height: 56,
    overflow: 'hidden',
    minWidth: 120,
  },
  qtyBtn: {
    paddingHorizontal: 14,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
