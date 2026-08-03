import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForEmirePayFallback123",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "emirepay-prod.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "emirepay-prod",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "emirepay-prod.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const authInstance = getAuth(firebaseApp);
setPersistence(authInstance, browserLocalPersistence).catch(() => {});
