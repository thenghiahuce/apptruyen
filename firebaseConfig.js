// firebase.js

// Import SDKs bạn cần
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// (Tuỳ chọn) import cho storage, analytics, v.v.
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Cấu hình Firebase App
const firebaseConfig = {
  apiKey: "AIzaSyAU_Yo3c53nlsdNH7NtLzyteMSY-l5YKT8",
  authDomain: "app-97cd3.firebaseapp.com",
  projectId: "app-97cd3",
  storageBucket: "app-97cd3.appspot.com", // ❗ bạn có typo ở đây: đúng là `.appspot.com`
  messagingSenderId: "84076620357",
  appId: "1:84076620357:web:4cb079d39c0f779f66912c",
  measurementId: "G-GYCSC65PHD"
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export ra để dùng ở file khác
export { app, db, auth, storage, analytics };
