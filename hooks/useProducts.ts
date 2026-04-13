// hooks/useProducts.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  category: string;
  brand?: string;
  stock: number;
  unit?: string;
  tags?: string[];
  isFeatured?: boolean;
  isAvailable?: boolean;
  createdAt?: any;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  productCount?: number;
}

// Fallback demo products if Firestore is empty
const DEMO_PRODUCTS: Product[] = [
  { id: '1', name: 'Panadol Extra 500mg', price: 150, originalPrice: 180, category: 'Pain Relief', brand: 'GSK', stock: 100, isFeatured: true, isAvailable: true, image: 'https://via.placeholder.com/200x200/0A7EA4/FFFFFF?text=Panadol', unit: 'Strip of 10' },
  { id: '2', name: 'Brufen 400mg', price: 95, category: 'Pain Relief', brand: 'Abbott', stock: 80, isFeatured: true, isAvailable: true, image: 'https://via.placeholder.com/200x200/16A34A/FFFFFF?text=Brufen', unit: 'Strip of 10' },
  { id: '3', name: 'ORS Sachet', price: 35, originalPrice: 45, category: 'Electrolytes', brand: 'National', stock: 200, isFeatured: true, isAvailable: true, image: 'https://via.placeholder.com/200x200/D97706/FFFFFF?text=ORS', unit: 'Pack of 5' },
  { id: '4', name: 'Vitamin C 500mg', price: 320, category: 'Vitamins', brand: 'Nutrifactor', stock: 60, isFeatured: false, isAvailable: true, image: 'https://via.placeholder.com/200x200/7C3AED/FFFFFF?text=Vit+C', unit: 'Pack of 30' },
  { id: '5', name: 'Augmentin 625mg', price: 480, originalPrice: 520, category: 'Antibiotics', brand: 'GSK', stock: 40, isFeatured: true, isAvailable: true, image: 'https://via.placeholder.com/200x200/DC2626/FFFFFF?text=Augmentin', unit: 'Strip of 7' },
  { id: '6', name: 'Disprin 300mg', price: 75, category: 'Pain Relief', brand: 'Bayer', stock: 150, isFeatured: false, isAvailable: true, image: 'https://via.placeholder.com/200x200/0891B2/FFFFFF?text=Disprin', unit: 'Strip of 12' },
  { id: '7', name: 'Glucophage 500mg', price: 220, category: 'Diabetes', brand: 'Merck', stock: 90, isFeatured: false, isAvailable: true, image: 'https://via.placeholder.com/200x200/059669/FFFFFF?text=Glucophage', unit: 'Strip of 14' },
  { id: '8', name: 'Nexium 20mg', price: 650, originalPrice: 700, category: 'Gastro', brand: 'AstraZeneca', stock: 35, isFeatured: false, isAvailable: true, image: 'https://via.placeholder.com/200x200/9333EA/FFFFFF?text=Nexium', unit: 'Strip of 14' },
];

const DEMO_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Pain Relief', icon: '💊', color: '#0A7EA4', productCount: 3 },
  { id: 'c2', name: 'Antibiotics', icon: '🧬', color: '#DC2626', productCount: 1 },
  { id: 'c3', name: 'Vitamins', icon: '🍊', color: '#7C3AED', productCount: 1 },
  { id: 'c4', name: 'Diabetes', icon: '🩺', color: '#059669', productCount: 1 },
  { id: 'c5', name: 'Gastro', icon: '🫀', color: '#9333EA', productCount: 1 },
  { id: 'c6', name: 'Electrolytes', icon: '💧', color: '#D97706', productCount: 1 },
];

export function useProducts(filters?: {
  category?: string;
  search?: string;
  featuredOnly?: boolean;
  limitCount?: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const constraints: QueryConstraint[] = [];
        if (filters?.category) constraints.push(where('category', '==', filters.category));
        if (filters?.featuredOnly) constraints.push(where('isFeatured', '==', true));
        constraints.push(orderBy('name'));
        if (filters?.limitCount) constraints.push(limit(filters.limitCount));

        const q = query(collection(db, 'products'), ...constraints);
        const snap = await getDocs(q);

        let data: Product[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));

        // Apply client-side search
        if (filters?.search) {
          const s = filters.search.toLowerCase();
          data = data.filter(
            (p) =>
              p.name.toLowerCase().includes(s) ||
              p.brand?.toLowerCase().includes(s) ||
              p.category.toLowerCase().includes(s)
          );
        }

        // Fallback to demo data if empty
        if (data.length === 0) {
          let demo = DEMO_PRODUCTS;
          if (filters?.category) demo = demo.filter((p) => p.category === filters.category);
          if (filters?.featuredOnly) demo = demo.filter((p) => p.isFeatured);
          if (filters?.search) {
            const s = filters.search.toLowerCase();
            demo = demo.filter(
              (p) => p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s)
            );
          }
          if (filters?.limitCount) demo = demo.slice(0, filters.limitCount);
          data = demo;
        }

        setProducts(data);
      } catch (e: any) {
        // Use demo data on error
        setProducts(DEMO_PRODUCTS);
        setError(null);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [filters?.category, filters?.search, filters?.featuredOnly, filters?.limitCount]);

  return { products, loading, error };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() } as Product);
        } else {
          const demo = DEMO_PRODUCTS.find((p) => p.id === id);
          setProduct(demo || null);
        }
      } catch {
        const demo = DEMO_PRODUCTS.find((p) => p.id === id);
        setProduct(demo || null);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  return { product, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'categories'));
        let data: Category[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
        if (data.length === 0) data = DEMO_CATEGORIES;
        setCategories(data);
      } catch {
        setCategories(DEMO_CATEGORIES);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { categories, loading };
}
