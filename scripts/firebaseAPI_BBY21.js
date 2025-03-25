const firebaseConfig = {
  apiKey: "AIzaSyAmvA1dMsJYhw5RWT9AfSyYcqZvoSviWak",
  authDomain: "comp1800sprint2.firebaseapp.com",
  projectId: "comp1800sprint2",
  storageBucket: "comp1800sprint2.firebasestorage.app",
  messagingSenderId: "735563755343",
  appId: "1:735563755343:web:b1d624ada64c6fde54df3a",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
