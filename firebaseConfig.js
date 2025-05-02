// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth as getWebAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native'; // Thêm Platform

// Cấu hình Firebase App
const firebaseConfig = {
  apiKey: "AIzaSyAU_Yo3c53nlsdNH7NtLzyteMSY-l5YKT8",
  authDomain: "app-97cd3.firebaseapp.com",
  projectId: "app-97cd3",
  storageBucket: "app-97cd3.appspot.com",
  messagingSenderId: "84076620357",
  appId: "1:84076620357:web:4cb079d39c0f779f66912c",
  measurementId: "G-GYCSC65PHD"
};

// Khởi tạo App
const app = initializeApp(firebaseConfig);

// Firestore & Storage luôn dùng chung
const db = getFirestore(app);
const storage = getStorage(app);

// Auth: khác nhau giữa web và mobile
let auth;
if (Platform.OS === 'web') {
  auth = getWebAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

// Analytics (chỉ hỗ trợ web)
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Export ra
export { app, db, auth, storage, analytics };
