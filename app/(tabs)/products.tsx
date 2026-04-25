// app/(tabs)/products.tsx
import {
  Category,
  getProductCategories,
  getProducts,
  Product,
} from "@/hooks/firebaseutitlits";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState, ProductCard } from "../../components/ui";
import { Colors, Radius, Spacing } from "../../lib/theme";

const SORT_OPTIONS = [
  "Relevance",
  "Price: Low to High",
  "Price: High to Low",
  "Name: A to Z",
];

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string; category?: any }>();

  const [search, setSearch] = useState(params.q || "");
  const [selectedCat, setSelectedCat] = useState(params.category || "");
  const [sort, setSort] = useState("Relevance");
  const [showSort, setShowSort] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getProductCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // 🔍 Search filter
    if (search.trim()) {
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 📂 Category filter
    if (selectedCat) {
      list = list.filter((p) => p.category?.id === selectedCat);
    }

    // 🔃 Sorting
    list.sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      if (sort === "Name: A to Z") return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [products, search, selectedCat, sort]);
  return (
    <SafeAreaView style={styles.safe}>
      {/* Search Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchWrap}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            placeholder="Search medicines..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={{ color: Colors.textMuted }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => setShowSort(!showSort)}
          style={styles.sortBtn}
        >
          <Text style={{ fontSize: 14 }}>⇅</Text>
        </TouchableOpacity>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View style={styles.sortMenu}>
          {SORT_OPTIONS.map((o) => (
            <TouchableOpacity
              key={o}
              onPress={() => {
                setSort(o);
                setShowSort(false);
              }}
              style={[
                styles.sortItem,
                sort === o && { backgroundColor: Colors.primaryLight },
              ]}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: sort === o ? Colors.primary : Colors.text,
                  fontWeight: sort === o ? "600" : "400",
                }}
              >
                {o}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 48, flexGrow: 0 }}
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: Spacing.md,
          paddingVertical: 6,
          marginBottom: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => setSelectedCat("")}
          style={[styles.catChip, selectedCat === "" && styles.catChipActive]}
        >
          <Text
            style={[
              styles.catChipText,
              selectedCat === "" && styles.catChipTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            onPress={() => setSelectedCat(selectedCat === c.id ? "" : c.id)}
            style={[
              styles.catChip,
              selectedCat === c.id && styles.catChipActive,
            ]}
          >
            <Text
              style={[
                styles.catChipText,
                selectedCat === c.name && styles.catChipTextActive,
              ]}
            >
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: Spacing.md, marginBottom: 8 }}>
        <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
          {filteredAndSortedProducts.length} product
          {filteredAndSortedProducts.length !== 1 ? "s" : ""} found
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : filteredAndSortedProducts.length === 0 ? (
        <EmptyState
          emoji="🔍"
          title="No products found"
          subtitle="Try a different search or category"
          action="Clear filters"
          onAction={() => {
            setSearch("");
            setSelectedCat("");
          }}
        />
      ) : (
        <FlatList
          data={filteredAndSortedProducts}
          numColumns={2}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: Spacing.md, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/product/${item.id}`)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    alignItems: "center",
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  sortBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  sortMenu: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: 4,
  },
  sortItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catChipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  catChipTextActive: { color: Colors.white, fontWeight: "700" },
});
