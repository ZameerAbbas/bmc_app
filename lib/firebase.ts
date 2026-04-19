// lib/firebase.ts
// ⚠️  Replace these values with your actual Firebase project credentials
// Go to: Firebase Console → Project Settings → Your Apps → Web App → Config

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getApp, getApps, initializeApp } from 'firebase/app';
// import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { Platform } from 'react-native';

// const firebaseConfig = {
//   apiKey: "AIzaSyDxgqi9beqrM_L-LFVWsG1Njq0QBQ5C7I4",
//   authDomain: "barcha-medicous.firebaseapp.com",
//   databaseURL: "https://barcha-medicous-default-rtdb.firebaseio.com",
//   projectId: "barcha-medicous",
//   storageBucket: "barcha-medicous.firebasestorage.app",
//   messagingSenderId: "351174899452",
//   appId: "1:351174899452:web:7198e4509710b7fec20979",
//   measurementId: "G-77LNJWGRTX",
// };

// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// // Use AsyncStorage persistence on native, default on web
// let auth: ReturnType<typeof getAuth>;
// try {
//   if (Platform.OS !== 'web') {
//     auth = initializeAuth(app, {
//       persistence: getReactNativePersistence(AsyncStorage),
//     });
//   } else {
//     auth = getAuth(app);
//   }
// } catch {

//   auth = getAuth(app);
// }

// const db = getFirestore(app);

// export { app, auth, db };



import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // ✅ CHANGE HERE
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDxgqi9beqrM_L-LFVWsG1Njq0QBQ5C7I4",
  authDomain: "barcha-medicous.firebaseapp.com",
  databaseURL: "https://barcha-medicous-default-rtdb.firebaseio.com", // ✅ already correct
  projectId: "barcha-medicous",
  storageBucket: "barcha-medicous.firebasestorage.app",
  messagingSenderId: "351174899452",
  appId: "1:351174899452:web:7198e4509710b7fec20979",
  measurementId: "G-77LNJWGRTX",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Auth setup (same as yours)
let auth: ReturnType<typeof getAuth>;
try {
  if (Platform.OS !== 'web') {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } else {
    auth = getAuth(app);
  }
} catch {
  auth = getAuth(app);
}

// ✅ Realtime Database instead of Firestore
const db = getDatabase(app);

export { app, auth, db };
