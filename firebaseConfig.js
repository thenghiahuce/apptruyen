// firebase.js

// Import SDKs bạn cần
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// (Tuỳ chọn) import cho storage, analytics, v.v.
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Cấu hình Firebase App
const firebaseConfig = {
  apiKey: "AIzaSyAU_Yo3c53nlsdNH7NtLzyteMSY-l5YKT8",
  authDomain: "app-97cd3.firebaseapp.com",
  projectId: "app-97cd3",
  storageBucket: "app-97cd3.appspot.com", // Lưu ý: `.appspot.com`
  messagingSenderId: "84076620357",
  appId: "1:84076620357:web:4cb079d39c0f779f66912c",
  measurementId: "G-GYCSC65PHD"
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage) // Sử dụng AsyncStorage để lưu trạng thái Auth
});
const storage = getStorage(app);

// Kiểm tra xem Analytics có được hỗ trợ hay không trước khi khởi tạo
let analytics;
if (isSupported()) {
  analytics = getAnalytics(app);
}

// Export ra để dùng ở file khác
export { app, db, auth, storage, analytics };
