// // app/auth/register.tsx
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Colors, Spacing, Radius, Typography } from '../../lib/theme';
// import { useAuth } from '../../context/AuthContext';
// import { Button } from '../../components/ui';

// export default function RegisterScreen() {
//   const router = useRouter();
//   const params = useLocalSearchParams<{ redirect?: string }>();
//   const { register } = useAuth();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const [showPass, setShowPass] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     if (!name.trim() || !email.trim() || !password) {
//       Alert.alert('Error', 'Please fill in all required fields.');
//       return;
//     }
//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters.');
//       return;
//     }
//     if (password !== confirm) {
//       Alert.alert('Error', 'Passwords do not match.');
//       return;
//     }

//     setLoading(true);
//     try {
//       await register(name.trim(), email.trim().toLowerCase(), password, phone.trim());
//       if (params.redirect) {
//         router.replace(`/${params.redirect}` as any);
//       } else {
//         router.back();
//       }
//     } catch (e: any) {
//       let msg = 'Registration failed. Please try again.';
//       if (e.code === 'auth/email-already-in-use') {
//         msg = 'An account with this email already exists.';
//       } else if (e.code === 'auth/invalid-email') {
//         msg = 'Please enter a valid email address.';
//       } else if (e.code === 'auth/weak-password') {
//         msg = 'Password is too weak. Use at least 6 characters.';
//       }
//       Alert.alert('Sign Up Failed', msg);
//     }
//     setLoading(false);
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scroll}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
//             <Text style={{ fontSize: 22 }}>←</Text>
//           </TouchableOpacity>

//           <View style={styles.brand}>
//             <View style={styles.logoCircle}>
//               <Text style={{ fontSize: 36 }}>💊</Text>
//             </View>
//             <Text style={styles.brandName}>BARCHA Medicous</Text>
//           </View>

//           <Text style={[Typography.h2, { marginBottom: 6 }]}>Create Account</Text>
//           <Text style={[Typography.bodySmall, { marginBottom: Spacing.xl }]}>
//             Join thousands of customers in Gilgit
//           </Text>

//           <Field label="Full Name *" value={name} onChange={setName} placeholder="Ahmad Khan" />
//           <Field
//             label="Email Address *"
//             value={email}
//             onChange={setEmail}
//             placeholder="you@example.com"
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//           <Field
//             label="Phone Number"
//             value={phone}
//             onChange={setPhone}
//             placeholder="+92 300 XXXXXXX"
//             keyboardType="phone-pad"
//           />

//           {/* Password */}
//           <Text style={styles.label}>Password *</Text>
//           <View style={styles.passWrap}>
//             <TextInput
//               value={password}
//               onChangeText={setPassword}
//               placeholder="Min. 6 characters"
//               placeholderTextColor={Colors.textMuted}
//               secureTextEntry={!showPass}
//               style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
//             />
//             <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 4 }}>
//               <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁️'}</Text>
//             </TouchableOpacity>
//           </View>

//           <Field
//             label="Confirm Password *"
//             value={confirm}
//             onChange={setConfirm}
//             placeholder="Re-enter password"
//             secureTextEntry
//           />

//           <Text style={styles.terms}>
//             By signing up, you agree to our{' '}
//             <Text style={{ color: Colors.primary }}>Terms of Service</Text> and{' '}
//             <Text style={{ color: Colors.primary }}>Privacy Policy</Text>.
//           </Text>

//           <Button title="Create Account" onPress={handleRegister} loading={loading} size="lg" />

//           <TouchableOpacity
//             onPress={() => router.replace({ pathname: '/auth/login', params })}
//             style={styles.loginBtn}
//           >
//             <Text style={{ fontSize: 15, color: Colors.text }}>
//               Already have an account?{' '}
//               <Text style={{ color: Colors.primary, fontWeight: '700' }}>Login</Text>
//             </Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// function Field({
//   label, value, onChange, placeholder, keyboardType, autoCapitalize, secureTextEntry,
// }: {
//   label: string; value: string; onChange: (v: string) => void; placeholder?: string;
//   keyboardType?: any; autoCapitalize?: any; secureTextEntry?: boolean;
// }) {
//   return (
//     <>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         value={value}
//         onChangeText={onChange}
//         placeholder={placeholder}
//         placeholderTextColor={Colors.textMuted}
//         keyboardType={keyboardType}
//         autoCapitalize={autoCapitalize || 'words'}
//         secureTextEntry={secureTextEntry}
//         style={styles.input}
//       />
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: Colors.background },
//   scroll: { padding: Spacing.lg, paddingTop: Spacing.sm },
//   backBtn: { marginBottom: Spacing.md, padding: 4, alignSelf: 'flex-start' },
//   brand: { alignItems: 'center', marginBottom: Spacing.xl },
//   logoCircle: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: Colors.primaryLight,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: Spacing.sm,
//     borderWidth: 2,
//     borderColor: Colors.primary,
//   },
//   brandName: { fontSize: 18, fontWeight: '800', color: Colors.primary },
//   label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
//   input: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radius.md,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 15,
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },
//   passWrap: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.surface,
//     borderRadius: Radius.md,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     marginBottom: Spacing.md,
//     paddingRight: 12,
//   },
//   terms: {
//     fontSize: 12,
//     color: Colors.textMuted,
//     textAlign: 'center',
//     marginBottom: Spacing.lg,
//     lineHeight: 18,
//   },
//   loginBtn: { alignItems: 'center', paddingVertical: 16 },
// });

// app/auth/register.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
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

import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { auth } from "../../lib/firebase";

import { Colors, Spacing, Typography } from "../../lib/theme";

import { getAddresses, IAddress } from "@/hooks/firebaseutitlits";
import { Picker } from "@react-native-picker/picker";

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ redirect?: string }>();

  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    referralCode: string;
    city: IAddress | null;
  }>({
    firstName: "",
    lastName: "",
    phone: "",
    referralCode: "",
    city: null,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const addressesData = await getAddresses();

        setAddresses(addressesData);
      } catch (error) {
        console.log("Error loading addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  console.log("Addresses:", addresses);

  const validateForm = () => {
    if (!form.firstName.trim()) return "First name required";
    if (!form.lastName.trim()) return "Last name required";
    if (!form.phone.trim()) return "Phone required";
    if (!form.city) return "City required";
    if (!email.trim()) return "Email required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleRegister = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert("Error", error);
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email,
        city: form.city,
        referralCode: form.referralCode || null,
        createdAt: new Date().toISOString(),
      };

      // ✅ Save to Firebase Realtime DB
      const db = getDatabase();
      await set(ref(db, `users/${user.uid}`), userData);

      // ✅ Success
      Alert.alert("Success", "Account created successfully");

      if (params.redirect) {
        router.replace(`/${params.redirect}` as any);
      } else {
        router.replace("/"); // home
      }
    } catch (e: any) {
      let msg = "Signup failed";

      if (e.code === "auth/email-already-in-use") {
        msg = "Email already exists";
      } else if (e.code === "auth/invalid-email") {
        msg = "Invalid email";
      } else if (e.code === "auth/weak-password") {
        msg = "Weak password";
      }

      Alert.alert("Error", msg);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={Typography.h2}>Create Account</Text>

          {/* First Name */}
          <Field
            label="First Name *"
            value={form.firstName}
            onChange={(v: any) => setForm({ ...form, firstName: v })}
          />

          {/* Last Name */}
          <Field
            label="Last Name *"
            value={form.lastName}
            onChange={(v: any) => setForm({ ...form, lastName: v })}
          />

          {/* Email */}
          <Field
            label="Email *"
            value={email}
            onChange={setEmail}
            keyboardType="email-address"
          />

          {/* Phone */}
          <Field
            label="Phone *"
            value={form.phone}
            onChange={(v: any) => setForm({ ...form, phone: v })}
          />

          {/* Password */}
          <Field
            label="Password *"
            value={password}
            onChange={setPassword}
            secureTextEntry
          />

          {/* City Dropdown (Simple version) */}
          <Text style={styles.label}>City *</Text>
          <Picker
            selectedValue={form.city?.id || ""}
            onValueChange={(itemValue) => {
              const selectedCity =
                addresses.find((c) => c.id === itemValue) || null;

              setForm({ ...form, city: selectedCity });
            }}
          >
            <Picker.Item label="Select City" value="" />

            {addresses.map((c) => (
              <Picker.Item key={c.id} label={c.city} value={c.id} />
            ))}
          </Picker>

          {/* Referral */}
          <Field
            label="Referral Code"
            value={form.referralCode}
            onChange={(v: any) => setForm({ ...form, referralCode: v })}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={{ color: "#fff" }}>
              {loading ? "Creating..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/auth/login")}>
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, ...props }: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg },
  label: { marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  loginText: {
    textAlign: "center",
    marginTop: 16,
  },
  cityItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 6,
  },
  citySelected: {
    backgroundColor: "#d0ebff",
  },
});
