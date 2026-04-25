// app/(tabs)/index.tsx
import {
  Category,
  getProductCategories,
  getProducts,
  Product,
} from "@/hooks/firebaseutitlits";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, ProductCard, SectionHeader } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Colors, Radius, Spacing, Typography } from "../../lib/theme";

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { totalItems } = useCart();
  const [search, setSearch] = useState("");

  const greeting = profile?.displayName
    ? `Hi, ${profile.displayName.split(" ")[0]} 👋`
    : "Welcome 👋";

  const handleSearch = () => {
    if (search.trim())
      router.push({ pathname: "/(tabs)/products", params: { q: search } });
  };

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

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (search.trim().length > 0) {
      const result = products.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredProducts(result);
      setShowDropdown(true);
    } else {
      setFilteredProducts([]);
      setShowDropdown(false);
    }
  }, [search, products]);

  console.log("Products:", products);

  const top5Products = [...products]
    .sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0))
    .slice(0, 4);

  const SearchItem = ({ item, onPress }: any) => (
    <TouchableOpacity style={styles.dropdownItem} onPress={onPress}>
      <View style={styles.dropdownItem}>
        <Image
          source={{ uri: item.productImage }}
          style={{ width: 30, height: 30 }}
        />
        <View style={{ marginLeft: 8 }}>
          <Text>{item.name}</Text>
          <Text style={{ color: "#888", fontSize: 12 }}>Rs {item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={[Typography.bodySmall, { marginTop: 2 }]}>
              BARCHA Medicous — Gilgit
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cart")}
            style={styles.cartBtn}
          >
            <Text style={{ fontSize: 20 }}>🛒</Text>
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text
                  style={{ fontSize: 10, color: "#fff", fontWeight: "700" }}
                >
                  {totalItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        {/* <View style={styles.searchWrap}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            placeholder="Search medicines, vitamins..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={{ color: Colors.textMuted, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View> */}

        <View style={{ position: "relative" }}>
          <View style={styles.searchWrap}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>

            <TextInput
              placeholder="Search medicines, vitamins..."
              placeholderTextColor={Colors.textMuted}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              style={styles.searchInput}
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Text style={{ color: Colors.textMuted, fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 🔽 Dropdown */}
          {showDropdown && (
            <View style={styles.dropdown}>
              <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <SearchItem
                    item={item}
                    onPress={() => {
                      setSearch(item.name);
                      setShowDropdown(false);
                      router.push(`/product/${item.id}`);
                    }}
                  />
                )}
              />
            </View>
          )}
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 12,
                color: Colors.primaryLight,
                fontWeight: "600",
                letterSpacing: 0.5,
              }}
            >
              FREE DELIVERY
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: "#fff",
                marginTop: 4,
                lineHeight: 24,
              }}
            >
              On orders{"\n"} above PKR 2000
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/products")}
              style={styles.bannerBtn}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 13,
                  fontWeight: "700",
                }}
              >
                Order Now →
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 64 }}>💊</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: "10K+", sub: "Products" },
            { label: "24/7", sub: "Available" },
            { label: "6", sub: "Branches" },
            { label: "2hr", sub: "Delivery" },
          ].map((s) => (
            <Card key={s.label} style={styles.statCard}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: Colors.primary,
                }}
              >
                {s.label}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: Colors.textSecondary,
                  marginTop: 2,
                }}
              >
                {s.sub}
              </Text>
            </Card>
          ))}
        </View>

        {/* Categories */}
        <View style={{ paddingHorizontal: Spacing.md, marginTop: Spacing.lg }}>
          <SectionHeader
            title="Categories"
            action="View All"
            onAction={() => router.push("/(tabs)/products")}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/products",
                    params: { category: cat.name },
                  })
                }
                style={[
                  styles.catChip,
                  { backgroundColor: Colors.primary + "18" },
                ]}
              >
                <Image
                  source={{ uri: cat.image }}
                  style={{ width: 24, height: 24, resizeMode: "contain" }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: Colors.primary,
                    marginTop: 4,
                  }}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View
          style={{
            paddingHorizontal: Spacing.md,
            marginTop: Spacing.lg,
          }}
        >
          <SectionHeader
            title="Popular This Month"
            action="See All"
            onAction={() => router.push("/(tabs)/products")}
          />
          <View style={{ paddingBottom: 12 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {top5Products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onPress={() => router.push(`/product/${p.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Emergency Banner */}
        <View
          style={[
            styles.emergencyBanner,
            { marginHorizontal: Spacing.md, marginTop: Spacing.lg },
          ]}
        >
          <Text style={{ fontSize: 28 }}>🚨</Text>
          <View style={{ flex: 1, marginLeft: Spacing.sm }}>
            <Text
              style={{ fontWeight: "700", color: Colors.danger, fontSize: 15 }}
            >
              Emergency?
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: Colors.textSecondary,
                marginTop: 2,
              }}
            >
              Call now: 0300-1234567
            </Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Text
              style={{ color: Colors.white, fontSize: 13, fontWeight: "700" }}
            >
              Call Us
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  greeting: { fontSize: 20, fontWeight: "700", color: Colors.text },
  cartBtn: { padding: 8, position: "relative" },
  cartBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: Colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },
  banner: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerBtn: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: Spacing.sm,
    alignSelf: "flex-start",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: Spacing.sm,
  },
  catChip: {
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    minWidth: 76,
  },
  emergencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dangerLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  callBtn: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  dropdown: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    zIndex: 1000,
    maxHeight: 200,
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
});
