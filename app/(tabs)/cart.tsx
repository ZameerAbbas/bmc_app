// // app/(tabs)/cart.tsx
// import React from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Colors, Spacing, Radius, Typography } from '../../lib/theme';
// import { useCart } from '../../context/CartContext';
// import { useAuth } from '../../context/AuthContext';
// import { Button, EmptyState, Card } from '../../components/ui';

// export default function CartScreen() {
//   const router = useRouter();
//   const { items, totalItems, subtotal, removeItem, updateQty, clearCart } = useCart();
//   const { user } = useAuth();

//   const deliveryFee = subtotal >= 2000 ? 0 : 150;
//   const total = subtotal + deliveryFee;

//   const handleCheckout = () => {
//     if (!user) {
//       // Prompt login before checkout
//       Alert.alert(
//         'Login Required',
//         'Please login or create an account to place your order.',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Login', onPress: () => router.push('/auth/login?redirect=checkout') },
//           { text: 'Sign Up', onPress: () => router.push('/auth/register?redirect=checkout') },
//         ]
//       );
//       return;
//     }
//     router.push('/checkout');
//   };

//   if (items.length === 0) {
//     return (
//       <SafeAreaView style={styles.safe}>
//         <View style={styles.header}>
//           <Text style={Typography.h2}>My Cart</Text>
//         </View>
//         <EmptyState
//           emoji="🛒"
//           title="Your cart is empty"
//           subtitle="Add medicines and products to your cart to get started."
//           action="Browse Products"
//           onAction={() => router.push('/(tabs)/products')}
//         />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safe}>
//       <View style={styles.header}>
//         <Text style={Typography.h2}>My Cart</Text>
//         <TouchableOpacity
//           onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
//             { text: 'Cancel', style: 'cancel' },
//             { text: 'Clear', style: 'destructive', onPress: clearCart },
//           ])}
//         >
//           <Text style={{ color: Colors.danger, fontSize: 14, fontWeight: '600' }}>Clear All</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={items}
//         keyExtractor={(i) => i.id}
//         contentContainerStyle={{ padding: Spacing.md, gap: 10 }}
//         showsVerticalScrollIndicator={false}
//         ListFooterComponent={
//           <Card style={{ marginTop: Spacing.md }}>
//             <Text style={[Typography.h4, { marginBottom: Spacing.md }]}>Order Summary</Text>
//             <Row label="Subtotal" value={`Rs. ${subtotal.toLocaleString()}`} />
//             <Row
//               label="Delivery Fee"
//               value={deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
//               valueColor={deliveryFee === 0 ? Colors.accent : Colors.text}
//             />
//             {subtotal < 2000 && (
//               <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 4 }}>
//                 Add Rs. {(2000 - subtotal).toLocaleString()} more for free delivery
//               </Text>
//             )}
//             <View style={styles.divider} />
//             <Row label="Total" value={`Rs. ${total.toLocaleString()}`} bold />
//             <Button
//               title={user ? 'Proceed to Checkout' : 'Login to Checkout'}
//               onPress={handleCheckout}
//               size="lg"
//               style={{ marginTop: Spacing.md }}
//             />
//             {!user && (
//               <Text style={{ fontSize: 12, color: Colors.textMuted, textAlign: 'center', marginTop: 8 }}>
//                 Already have an account?{' '}
//                 <Text
//                   style={{ color: Colors.primary, fontWeight: '600' }}
//                   onPress={() => router.push('/auth/login?redirect=checkout')}
//                 >
//                   Login
//                 </Text>
//               </Text>
//             )}
//           </Card>
//         }
//         renderItem={({ item }) => (
//           <Card style={{ flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' }}>
//             <Image
//               source={{ uri: item.image || 'https://via.placeholder.com/72x72/0A7EA4/FFFFFF?text=Med' }}
//               style={styles.img}
//             />
//             <View style={{ flex: 1 }}>
//               <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.text }} numberOfLines={2}>
//                 {item.name}
//               </Text>
//               <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 2 }}>
//                 Rs. {item.price} each
//               </Text>
//               <View style={styles.qtyRow}>
//                 <TouchableOpacity
//                   onPress={() => updateQty(item.id, item.quantity - 1)}
//                   style={styles.qtyBtn}
//                 >
//                   <Text style={{ fontSize: 18, color: Colors.primary, fontWeight: '700' }}>−</Text>
//                 </TouchableOpacity>
//                 <Text style={{ fontSize: 15, fontWeight: '700', minWidth: 28, textAlign: 'center' }}>
//                   {item.quantity}
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => updateQty(item.id, item.quantity + 1)}
//                   style={styles.qtyBtn}
//                 >
//                   <Text style={{ fontSize: 18, color: Colors.primary, fontWeight: '700' }}>+</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <View style={{ alignItems: 'flex-end', gap: 8 }}>
//               <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.primary }}>
//                 Rs. {(item.price * item.quantity).toLocaleString()}
//               </Text>
//               <TouchableOpacity onPress={() => removeItem(item.id)}>
//                 <Text style={{ fontSize: 18 }}>🗑️</Text>
//               </TouchableOpacity>
//             </View>
//           </Card>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// function Row({ label, value, bold, valueColor }: {
//   label: string; value: string; bold?: boolean; valueColor?: string;
// }) {
//   return (
//     <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
//       <Text style={{ fontSize: 14, color: bold ? Colors.text : Colors.textSecondary, fontWeight: bold ? '700' : '400' }}>
//         {label}
//       </Text>
//       <Text style={{ fontSize: 14, color: valueColor || (bold ? Colors.text : Colors.textSecondary), fontWeight: bold ? '700' : '500' }}>
//         {value}
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: Colors.background },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: Spacing.md,
//     paddingTop: Spacing.md,
//     paddingBottom: Spacing.sm,
//   },
//   img: {
//     width: 72,
//     height: 72,
//     borderRadius: Radius.md,
//     backgroundColor: Colors.borderLight,
//   },
//   qtyRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//     borderWidth: 1.5,
//     borderColor: Colors.primary,
//     borderRadius: Radius.md,
//     alignSelf: 'flex-start',
//     overflow: 'hidden',
//     height: 34,
//   },
//   qtyBtn: {
//     paddingHorizontal: 10,
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: Colors.border,
//     marginVertical: Spacing.sm,
//   },
// });

// app/(tabs)/cart.tsx

import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getUserById } from "@/hooks/firebaseutitlits";
import { Button, Card, EmptyState } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Colors, Radius, Spacing, Typography } from "../../lib/theme";

export default function CartScreen() {
  const router = useRouter();

  const {
    cart,
    subtotal,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
  } = useCart();

  const { user } = useAuth();

  const [delivery, setDelivery] = useState("");
  const [deliveryFree, setDeliveryFree] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  const total =
    Number(subtotal) >= Number(deliveryFree)
      ? Number(subtotal)
      : Number(subtotal) + Number(delivery);

  console.log("CartScreen - delivery:", delivery);
  console.log("CartScreen - deliveryFree:", deliveryFree);
  console.log("CartScreen - subtotal:", subtotal);

  useEffect(() => {
    const loadUser = async () => {
      if (!user?.uid) return;

      const data = await getUserById(user.uid);

      if (data) {
        setDelivery(data?.city?.deliveryFee);
        setDeliveryFree(data?.city?.deliveryFree);
        setReferralCode(data?.referralCode || "");
      }

      console.log("User profile:", data);

      setLoadingUser(false);
    };

    loadUser();
  }, [user]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Cart Empty", "Add items before checkout.");
      return;
    }

    if (!user) {
      Alert.alert("Login Required", "Please login to continue.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Login",
          onPress: () => router.push("/auth/login?redirect=checkout"),
        },
      ]);
      return;
    }

    router.push({
      pathname: "/checkout",
    });
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={Typography.h2}>My Cart</Text>
        </View>

        <EmptyState
          emoji="🛒"
          title="Your cart is empty"
          subtitle="Add products to get started."
          action="Browse Products"
          onAction={() => router.push("/(tabs)/products")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={Typography.h2}>My Cart</Text>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Clear Cart", "Remove all items?", [
              { text: "Cancel", style: "cancel" },
              { text: "Clear", style: "destructive", onPress: clearCart },
            ])
          }
        >
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Cart List */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const product = item.product;

          return (
            <Card style={styles.card}>
              <Image
                source={{
                  uri:
                    product.productImage || "https://via.placeholder.com/72x72",
                }}
                style={styles.img}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{product.name}</Text>

                <Text style={styles.price}>Rs. {product.price} each</Text>

                {/* Qty Controls */}
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    onPress={() => decreaseQty(product.id)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyValue}>{item.quantity}</Text>

                  <TouchableOpacity
                    onPress={() => increaseQty(product.id)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Right side */}
              <View style={styles.right}>
                <Text style={styles.total}>
                  Rs. {(product.price * item.quantity).toLocaleString()}
                </Text>

                <TouchableOpacity onPress={() => removeFromCart(product.id)}>
                  <Text style={{ fontSize: 18 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </Card>
          );
        }}
        ListFooterComponent={
          <Card style={{ marginTop: Spacing.md }}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <Row label="Subtotal" value={`Rs. ${subtotal}`} />

            <Row
              label="Delivery Fee"
              value={
                Number(subtotal) >= Number(deliveryFree)
                  ? "FREE"
                  : `Rs. ${delivery}`
              }
              valueColor={delivery === "0" ? Colors.accent : Colors.text}
            />

            {subtotal < Number(deliveryFree) && (
              <Text style={styles.freeText}>
                Add Rs. {Number(deliveryFree) - subtotal} more for free delivery
              </Text>
            )}

            <View style={styles.divider} />

            <Row label="Total" value={`Rs. ${total}`} bold />

            <Button
              title={user ? "Proceed to Checkout" : "Login to Checkout"}
              onPress={handleCheckout}
              size="lg"
              style={{ marginTop: Spacing.md }}
            />
          </Card>
        }
      />
    </SafeAreaView>
  );
}

function Row({
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
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
      <Text
        style={[
          styles.rowValue,
          bold && styles.bold,
          valueColor && { color: valueColor },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
  },

  clearText: {
    color: Colors.danger,
    fontWeight: "600",
  },

  list: {
    padding: Spacing.md,
    gap: 10,
  },

  card: {
    flexDirection: "row",
    gap: Spacing.sm,
  },

  img: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
  },

  price: {
    fontSize: 12,
    color: Colors.textMuted,
  },

  qtyRow: {
    flexDirection: "row",
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    height: 34,
    alignItems: "center",
  },

  qtyBtn: {
    paddingHorizontal: 10,
  },

  qtyText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: "700",
  },

  qtyValue: {
    minWidth: 28,
    textAlign: "center",
    fontWeight: "700",
  },

  right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  total: {
    fontWeight: "700",
    color: Colors.primary,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },

  freeText: {
    fontSize: 12,
    color: Colors.textMuted,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  rowLabel: {
    color: Colors.textSecondary,
  },

  rowValue: {
    color: Colors.textSecondary,
  },

  bold: {
    fontWeight: "700",
    color: Colors.text,
  },
});
