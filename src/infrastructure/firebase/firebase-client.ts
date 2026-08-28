import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase の公開設定値。Firebase の設計上、この値はクライアントに
// 公開されることを前提としており、実際のアクセス制御は
// Firestore セキュリティルール (匿名認証必須) 側で行っています。
const firebaseConfig = {
  apiKey: "AIzaSyCV0rOrjrcQdXC_KTSbFbGfZturTZ0hZv0",
  authDomain: "tine-app-c1af3.firebaseapp.com",
  projectId: "tine-app-c1af3",
  storageBucket: "tine-app-c1af3.firebasestorage.app",
  messagingSenderId: "418911742141",
  appId: "1:418911742141:web:e33e8fa4f1b64932b22fd4",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
