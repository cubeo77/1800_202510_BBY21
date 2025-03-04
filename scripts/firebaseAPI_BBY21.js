//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = 
{
    apiKey: "AIzaSyBUmyDjs51EDFfgFzqlNfDeCvplilR9X_8",
    authDomain: "demo07-202510-8f468.firebaseapp.com",
    projectId: "demo07-202510-8f468",
    storageBucket: "demo07-202510-8f468.firebasestorage.app",
    messagingSenderId: "603539163423",
    appId: "1:603539163423:web:36bd3f0f640ce6ba63c82a"
  };


//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

