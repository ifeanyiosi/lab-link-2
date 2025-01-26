// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoZuuzZWeihycjY7XiO95IztSpKPuFnVo",
  authDomain: "lab-link-2025.firebaseapp.com",
  projectId: "lab-link-2025",
  storageBucket: "lab-link-2025.firebasestorage.app",
  messagingSenderId: "262902013758",
  appId: "1:262902013758:web:9c21b832f3a602a0f0d66f",
  measurementId: "G-4C31B945MC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
