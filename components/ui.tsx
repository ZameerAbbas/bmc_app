// components/ui.tsx
import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Colors, Radius, Spacing, Typography } from "../lib/theme";

// ─── Product Card ─────────────────────────────────────────────────
import { Product } from "@/hooks/firebaseutitlits";
import { useCart } from "../context/CartContext";

// ─── Button ───────────────────────────────────────────────────────
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  style,
  icon,
}: ButtonProps) {
  const bg = {
    primary: Colors.primary,
    secondary: Colors.border,
    danger: Colors.danger,
    ghost: "transparent",
  }[variant];

  const color =
    variant === "secondary"
      ? Colors.text
      : variant === "ghost"
        ? Colors.primary
        : Colors.white;
  const height = size === "sm" ? 36 : size === "lg" ? 56 : 48;
  const fontSize = size === "sm" ? 13 : size === "lg" ? 17 : 15;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.btn,
        { backgroundColor: bg, height, opacity: disabled ? 0.5 : 1 },
        variant === "ghost" && {
          borderWidth: 1.5,
          borderColor: Colors.primary,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {icon}
          <Text style={{ color, fontSize, fontWeight: "600" }}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Badge ────────────────────────────────────────────────────────
interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
}

export function Badge({
  label,
  color = Colors.primary,
  bg = Colors.primaryLight,
}: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={{ fontSize: 11, fontWeight: "600", color }}>{label}</Text>
    </View>
  );
}

// ─── Card ─────────────────────────────────────────────────────────
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── Section Header ───────────────────────────────────────────────
export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={Typography.h3}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text
            style={{ color: Colors.primary, fontSize: 14, fontWeight: "600" }}
          >
            {action}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────
export function EmptyState({
  emoji,
  title,
  subtitle,
  action,
  onAction,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.empty}>
      <Text style={{ fontSize: 48, marginBottom: Spacing.md }}>{emoji}</Text>
      <Text style={[Typography.h3, { textAlign: "center", marginBottom: 6 }]}>
        {title}
      </Text>
      {subtitle && (
        <Text
          style={[
            Typography.bodySmall,
            { textAlign: "center", marginBottom: Spacing.lg },
          ]}
        >
          {subtitle}
        </Text>
      )}
      {action && onAction && <Button title={action} onPress={onAction} />}
    </View>
  );
}

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  horizontal?: boolean;
}

export function ProductCard({
  product,
  onPress,
  horizontal,
}: ProductCardProps) {
  const { addToCart, increaseQty, decreaseQty, getQty } = useCart();

  const qty = getQty(product.id);

  if (horizontal) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.hCard}
      >
        <Image
          source={{
            uri:
              product.productImage ||
              "https://via.placeholder.com/80x80/0A7EA4/FFFFFF?text=Med",
          }}
          style={styles.hCardImg}
        />

        <View style={{ flex: 1 }}>
          <Text
            style={{ fontSize: 14, fontWeight: "600", color: Colors.text }}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 2 }}>
            {product.mg}
          </Text>

          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: Colors.primary,
              marginTop: 6,
            }}
          >
            Rs. {product.price}
          </Text>
        </View>

        <QtyControl
          qty={qty}
          onAdd={() => addToCart(product)}
          onIncrease={() => increaseQty(product.id)}
          onDecrease={() => decreaseQty(product.id)}
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.vCard}
    >
      <Image
        source={{
          uri:
            product.productImage ||
            "https://via.placeholder.com/160x140/0A7EA4/FFFFFF?text=Med",
        }}
        style={styles.vCardImg}
        resizeMode="cover"
      />

      <View style={{ padding: Spacing.sm, flex: 1 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: Colors.text,
            marginBottom: 2,
          }}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <Text
          style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}
        >
          {product.categoryId}
        </Text>

        <Text
          style={{ fontSize: 15, fontWeight: "700", color: Colors.primary }}
        >
          Rs. {product.price}
        </Text>

        <View style={{ marginTop: Spacing.sm }}>
          <QtyControl
            qty={qty}
            onAdd={() => addToCart(product)}
            onIncrease={() => increaseQty(product.id)}
            onDecrease={() => decreaseQty(product.id)}
            small
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function QtyControl({ qty, onAdd, onIncrease, onDecrease, small }: any) {
  if (qty === 0) {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log("add to cart");
          onAdd();
        }}
        style={[styles.addBtn, small && { height: 32, paddingHorizontal: 10 }]}
      >
        <Text style={{ color: Colors.white }}>+ Add</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.qtyRow, small && { height: 32 }]}>
      <TouchableOpacity onPress={onDecrease} style={styles.qtyBtn}>
        <Text>−</Text>
      </TouchableOpacity>

      <Text>{qty}</Text>

      <TouchableOpacity onPress={onIncrease} style={styles.qtyBtn}>
        <Text>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Status Chip ──────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#FEF3C7", text: "#D97706" },
  confirmed: { bg: "#DBEAFE", text: "#1D4ED8" },
  processing: { bg: "#EDE9FE", text: "#7C3AED" },
  dispatched: { bg: "#DCFCE7", text: "#16A34A" },
  delivered: { bg: "#F0FDF4", text: "#15803D" },
  cancelled: { bg: "#FEE2E2", text: "#DC2626" },
};

export function StatusChip({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: c.text,
          textTransform: "capitalize",
        }}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: "flex-start",
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  vCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    width: 164,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  vCardImg: {
    width: 164,
    height: 130,
    backgroundColor: Colors.borderLight,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: Colors.danger,
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  hCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    gap: Spacing.sm,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  hCardImg: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    backgroundColor: Colors.borderLight,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    height: 36,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  qtyBtn: {
    paddingHorizontal: 10,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
