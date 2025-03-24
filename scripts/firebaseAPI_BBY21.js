// // Import Firebase modules properly using CDN URLs
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
// import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
// //----------------------------------------
// //  Your web app's Firebase configuration
// //----------------------------------------

const firebaseConfig = {

  apiKey: "AIzaSyAmvA1dMsJYhw5RWT9AfSyYcqZvoSviWak",
  authDomain: "comp1800sprint2.firebaseapp.com",
  projectId: "comp1800sprint2",
  storageBucket: "comp1800sprint2.firebasestorage.app",
  messagingSenderId: "735563755343",
  appId: "1:735563755343:web:b1d624ada64c6fde54df3a"

};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// // const db = getFirestore(app);
// const storage = getStorage(app);

// export { auth, db, storage };
