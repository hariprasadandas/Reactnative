// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { Platform } from "react-native";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGcdmzFu6TpGs6WM_QBIcSecxGuuWlNmY",
  authDomain: "cricc-e899c.firebaseapp.com",
  projectId: "cricc-e899c",
  storageBucket: "cricc-e899c.firebasestorage.app",
  messagingSenderId: "644288507783",
  appId: "1:644288507783:web:3e7bff132e7d2390462d22",
  measurementId: "G-JPFMVW3F6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
  auth = getAuth(app); // Web: use default
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

// Initialize Firebase services
const db = getFirestore(app);

export { app, auth, db };