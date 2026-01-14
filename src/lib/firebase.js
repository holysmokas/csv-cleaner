// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';

// Your Firebase configuration
// Replace these values with your actual Firebase config from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDaIx4zhHwP0f8Cngy0WdQ1HjQDpP8pA8Y",
    authDomain: "csv-cleaner-b8862.firebaseapp.com",
    projectId: "csv-cleaner-b8862",
    storageBucket: "csv-cleaner-b8862.firebasestorage.app",
    messagingSenderId: "918432232056",
    appId: "1:918432232056:web:37f6709866355b7b03738d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
};


// Initialize Firebase
