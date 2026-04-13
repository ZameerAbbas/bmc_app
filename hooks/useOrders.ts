// hooks/useOrders.ts
import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CartItem } from '../context/CartContext';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
  address: string;
  phone: string;
  notes?: string;
  paymentMethod: string;
  createdAt: any;
  estimatedDelivery?: string;
}

export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }
    const fetch = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
      } catch {
        setOrders([]);
      }
      setLoading(false);
    };
    fetch();
  }, [userId]);

  return { orders, loading };
}

export async function placeOrder(
  userId: string,
  items: CartItem[],
  details: {
    address: string;
    phone: string;
    notes?: string;
    paymentMethod: string;
  }
): Promise<string> {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 2000 ? 0 : 150;
  const total = subtotal + deliveryFee;

  const orderData = {
    userId,
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image || '',
    })),
    subtotal,
    deliveryFee,
    total,
    status: 'pending',
    address: details.address,
    phone: details.phone,
    notes: details.notes || '',
    paymentMethod: details.paymentMethod,
    createdAt: serverTimestamp(),
    estimatedDelivery: '1-2 hours',
  };

  const ref = await addDoc(collection(db, 'orders'), orderData);
  return ref.id;
}
