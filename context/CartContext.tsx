// // context/CartContext.tsx
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useReducer,
// } from "react";

// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   image?: string;
//   category?: string;
//   brand?: string;
//   quantity: number;
//   stock: number;
// }

// interface CartState {
//   items: CartItem[];
// }

// type CartAction =
//   | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity"> }
//   | { type: "REMOVE_ITEM"; id: string }
//   | { type: "UPDATE_QTY"; id: string; quantity: number }
//   | { type: "CLEAR_CART" }
//   | { type: "LOAD_CART"; items: CartItem[] };

// function cartReducer(state: CartState, action: CartAction): CartState {
//   switch (action.type) {
//     case "ADD_ITEM": {
//       const existing = state.items.find((i) => i.id === action.item.id);
//       if (existing) {
//         return {
//           items: state.items.map((i) =>
//             i.id === action.item.id
//               ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
//               : i,
//           ),
//         };
//       }
//       return { items: [...state.items, { ...action.item, quantity: 1 }] };
//     }
//     case "REMOVE_ITEM":
//       return { items: state.items.filter((i) => i.id !== action.id) };
//     case "UPDATE_QTY":
//       if (action.quantity <= 0) {
//         return { items: state.items.filter((i) => i.id !== action.id) };
//       }
//       return {
//         items: state.items.map((i) =>
//           i.id === action.id
//             ? { ...i, quantity: Math.min(action.quantity, i.stock) }
//             : i,
//         ),
//       };
//     case "CLEAR_CART":
//       return { items: [] };
//     case "LOAD_CART":
//       return { items: action.items };
//     default:
//       return state;
//   }
// }

// interface CartContextType {
//   items: CartItem[];
//   totalItems: number;
//   subtotal: number;
//   addItem: (item: Omit<CartItem, "quantity">) => void;
//   removeItem: (id: string) => void;
//   updateQty: (id: string, quantity: number) => void;
//   clearCart: () => void;
//   isInCart: (id: string) => boolean;
//   getQty: (id: string) => number;
// }

// const CartContext = createContext<CartContextType | null>(null);
// const CART_KEY = "bmc_cart";

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(cartReducer, { items: [] });

//   // Load persisted cart on mount
//   useEffect(() => {
//     AsyncStorage.getItem(CART_KEY).then((val) => {
//       if (val) {
//         try {
//           const items = JSON.parse(val);
//           dispatch({ type: "LOAD_CART", items });
//         } catch {}
//       }
//     });
//   }, []);

//   // Persist cart on change
//   useEffect(() => {
//     AsyncStorage.setItem(CART_KEY, JSON.stringify(state.items));
//   }, [state.items]);

//   const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
//   const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

//   return (
//     <CartContext.Provider
//       value={{
//         items: state.items,
//         totalItems,
//         subtotal,
//         addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
//         removeItem: (id) => dispatch({ type: "REMOVE_ITEM", id }),
//         updateQty: (id, quantity) =>
//           dispatch({ type: "UPDATE_QTY", id, quantity }),
//         clearCart: () => dispatch({ type: "CLEAR_CART" }),
//         isInCart: (id) => state.items.some((i) => i.id === id),
//         getQty: (id) => state.items.find((i) => i.id === id)?.quantity ?? 0,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used within CartProvider");
//   return ctx;
// }

import { Product } from "@/hooks/firebaseutitlits";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (product: Product) => void;
  increaseQty: (productId: string) => void;
  decreaseQty: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  isInCart: (productId: string) => boolean;
  getQty: (productId: string) => number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "bmc_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Load cart
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_KEY);
        if (stored) {
          setCart(JSON.parse(stored));
        }
      } catch (e) {
        console.log("Load cart error:", e);
      }
    };

    loadCart();
  }, []);

  // ✅ Save cart
  useEffect(() => {
    AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // ✅ Add to cart
  const addToCart = (product: Product) => {
    if (!product.instock) return;

    console.log("Adding to cart:", product.name);

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { product, quantity: 1 }];
    });
  };

  // ✅ Increase
  const increaseQty = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  // ✅ Decrease
  const decreaseQty = (productId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  // ✅ Remove
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // ✅ Clear
  const clearCart = () => setCart([]);

  // ✅ Helpers
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const isInCart = (id: string) => cart.some((item) => item.product.id === id);

  const getQty = (id: string) =>
    cart.find((item) => item.product.id === id)?.quantity || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        subtotal,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        isInCart,
        getQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
