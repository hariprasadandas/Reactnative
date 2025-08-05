// firebase.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAGcdmzFu6TpGs6WM_QBIcSecxGuuWlNmY',
  authDomain: 'cricc-e899c.firebaseapp.com',
  projectId: 'cricc-e899c',
  storageBucket: 'cricc-e899c.appspot.com',
  messagingSenderId: '644288507783',
  appId: '1:644288507783:web:3e7bff132e7d2390462d22',
  measurementId: 'G-JPFMVW3F6K',
};

// Initialize app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize auth for Expo Go compatibility (memory persistence)
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
