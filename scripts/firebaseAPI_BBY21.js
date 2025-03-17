// Import Firebase modules properly using CDN URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIEt08N8EAKD2AjgGx1VghYx5XKkjipnU",
  authDomain: "demo10singhashmeet.firebaseapp.com",
  projectId: "demo10singhashmeet",
  storageBucket: "demo10singhashmeet.appspot.com",
  messagingSenderId: "430577309230",
  appId: "1:430577309230:web:335d186a1b8420166471bf",
  measurementId: "G-W05EP00RVC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
