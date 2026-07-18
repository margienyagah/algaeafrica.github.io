// ==========================================
// Algae Africa Network
// Firebase Configuration
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiHOBLbRyNeo5gyV82hRBw4h7IVOnxdUA",
  authDomain: "algae-africa-network.firebaseapp.com",
  projectId: "algae-africa-network",
  storageBucket: "algae-africa-network.firebasestorage.app",
  messagingSenderId: "108175545928",
  appId: "1:108175545928:web:59d07f95dc51bbd073ea7d",
  measurementId: "G-B1ZF52Z0XZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Export for other files
export { app, db, auth };
