// app/checkout.tsx
import { createOrder, getUserById } from "@/hooks/firebaseutitlits";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Colors, Radius, Spacing, Typography } from "../lib/theme";

const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", emoji: "💵", disabled: false },
  { id: "easypaisa", label: "EasyPaisa", emoji: "📱", disabled: true },
  { id: "jazzcash", label: "JazzCash", emoji: "💳", disabled: true },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, subtotal, clearCart } = useCart();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState("");
  const [deliveryFree, setDeliveryFree] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!user?.uid) return;

      const data = await getUserById(user.uid);

      if (data) {
        setAddress(data.city?.city || "");
        setPhone(data.phone || "");
        setDelivery(data.city?.deliveryFee);
        setDeliveryFree(data.city?.deliveryFree);
        setReferralCode(data.referralCode);
      }

      setLoadingUser(false);
    };

    loadUser();
  }, [user]);

  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const total =
    Number(subtotal) >= Number(deliveryFree)
      ? Number(subtotal)
      : Number(subtotal) + Number(delivery);

  if (!user) {
    router.replace("/auth/login?redirect=checkout");
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      Alert.alert("Missing Info", "Please enter your delivery address.");
      return;
    }

    if (!phone.trim()) {
      Alert.alert("Missing Info", "Please enter your contact number.");
      return;
    }

    if (cart.length === 0) {
      Alert.alert("Empty Cart", "Add some items before placing an order.");
      router.push("/(tabs)/products");
      return;
    }

    setLoading(true);

    try {
      const checkoutData = {
        productOrder: cart.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        deliveryFee: total >= Number(deliveryFree) ? 0 : Number(delivery),
        isPaidToRefrral: false,
        orderDate: new Date().toISOString(),
        orderId: Math.floor(10000 + Math.random() * 90000),
        createdAt: new Date().toISOString(),
        referralCode: referralCode || null,
        subtotal,
        total,
        userId: user?.uid || null,
        orderStatus: { status: "pending", position: 0 },
      };

      const res = await createOrder(checkoutData);

      if (res?.success) {
        clearCart();

        router.replace({
          pathname: "/order-success",
          params: { orderId: res.orderId }, // ✅ FIXED
        });
      } else {
        throw new Error("Order failed");
      }
    } catch (e) {
      Alert.alert("Order Failed", "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text style={{ fontSize: 22 }}>←</Text>
          </TouchableOpacity>
          <Text style={Typography.h3}>Checkout</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: Spacing.md,
            gap: 14,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Delivery Details */}
          <Card>
            <Text style={[Typography.h4, { marginBottom: Spacing.md }]}>
              📍 Delivery Details
            </Text>

            <Text style={styles.label}>Delivery Address *</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Street, Area, Gilgit"
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={2}
              style={[styles.input, { height: 72, textAlignVertical: "top" }]}
            />

            <Text style={styles.label}>Contact Number *</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+92 300 XXXXXXX"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Text style={styles.label}>Order Notes (optional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Special instructions, landmark, etc."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={2}
              style={[styles.input, { height: 72, textAlignVertical: "top" }]}
            />
          </Card>

          {/* Payment Method */}
          <Card>
            <Text style={[Typography.h4, { marginBottom: Spacing.md }]}>
              💳 Payment Method
            </Text>
            {PAYMENT_METHODS.map((pm) => {
              const isDisabled = pm.disabled;

              return (
                <TouchableOpacity
                  key={pm.id}
                  disabled={isDisabled}
                  onPress={() => {
                    if (!isDisabled) setPaymentMethod(pm.id);
                  }}
                  style={[
                    styles.paymentOption,
                    paymentMethod === pm.id && styles.paymentOptionSelected,
                    isDisabled && styles.paymentDisabled,
                  ]}
                >
                  <Text style={{ fontSize: 22, opacity: isDisabled ? 0.4 : 1 }}>
                    {pm.emoji}
                  </Text>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: paymentMethod === pm.id ? "700" : "400",
                        color: isDisabled
                          ? Colors.textMuted
                          : paymentMethod === pm.id
                            ? Colors.primary
                            : Colors.text,
                      }}
                    >
                      {pm.label}
                    </Text>

                    {/* 🔥 Coming Soon */}
                    {isDisabled && (
                      <Text style={{ fontSize: 11, color: Colors.textMuted }}>
                        Coming Soon
                      </Text>
                    )}
                  </View>

                  {/* Radio */}
                  <View
                    style={[
                      styles.radio,
                      paymentMethod === pm.id && styles.radioSelected,
                      isDisabled && { opacity: 0.3 },
                    ]}
                  >
                    {paymentMethod === pm.id && !isDisabled && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </Card>

          {/* Order Items Summary */}
          <Card>
            <Text style={[Typography.h4, { marginBottom: Spacing.sm }]}>
              🛒 Order Summary
            </Text>
            {cart.map((item) => (
              <View key={item.product.id} style={styles.itemRow}>
                <Text
                  style={{ fontSize: 13, flex: 1, color: Colors.text }}
                  numberOfLines={1}
                >
                  {item.product.name}
                </Text>
                <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
                  ×{item.quantity}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    minWidth: 72,
                    textAlign: "right",
                  }}
                >
                  Rs. {(item.product.price * item.quantity).toLocaleString()}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <SummaryRow
              label="Subtotal"
              value={`Rs. ${subtotal.toLocaleString()}`}
            />
            <SummaryRow
              label="Delivery Fee"
              value={
                Number(subtotal) >= Number(deliveryFree)
                  ? "FREE"
                  : `Rs. ${delivery}`
              }
              valueColor={delivery === "0" ? Colors.accent : undefined}
            />
            {subtotal < Number(deliveryFree) && (
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.textMuted,
                  marginBottom: 4,
                }}
              >
                Add Rs. {(Number(deliveryFree) - subtotal).toLocaleString()}{" "}
                more for free delivery
              </Text>
            )}
            <View style={styles.divider} />
            <SummaryRow
              label="Total"
              value={`Rs. ${total.toLocaleString()}`}
              bold
            />
          </Card>

          {/* Delivery Time Info */}
          <View style={styles.infoRow}>
            <Text style={{ fontSize: 14 }}>🚀</Text>
            <Text
              style={{
                fontSize: 13,
                color: Colors.textSecondary,
                flex: 1,
                marginLeft: 8,
              }}
            >
              Estimated delivery:{" "}
              <Text style={{ fontWeight: "700", color: Colors.text }}>
                1–2 hours
              </Text>{" "}
              within Gilgit
            </Text>
          </View>

          <Button
            title={`Place Order — Rs. ${total.toLocaleString()}`}
            onPress={handlePlaceOrder}
            loading={loading}
            size="lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  valueColor,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueColor?: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: bold ? Colors.text : Colors.textSecondary,
          fontWeight: bold ? "700" : "400",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: valueColor || (bold ? Colors.primary : Colors.textSecondary),
          fontWeight: bold ? "800" : "500",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  paymentOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: Colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },

  paymentDisabled: {
    opacity: 0.5,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: 12,
  },
});
