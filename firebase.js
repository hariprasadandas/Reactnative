// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { Platform } from "react-native";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDhHtBRk8rP8mB1xr1zo5E_PhuQwh8JXU",
  authDomain: "crickhub-153fc.firebaseapp.com",
  projectId: "crickhub-153fc",
  storageBucket: "crickhub-153fc.appspot.com",
  messagingSenderId: "884643516000",
  appId: "1:884643516000:web:4271ae90f5b24e758dbd05",
  measurementId: "G-21E3YSDS07"
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