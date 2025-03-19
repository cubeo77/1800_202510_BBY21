import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Configuration
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
const db = getFirestore(app);

// Function to Load Images
async function loadImages(category) {
  const imagesContainer = document.getElementById(category);
  imagesContainer.innerHTML = ""; // Clear existing content

  const querySnapshot = await getDocs(collection(db, `uploads/${category}/images`));

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const imageElement = document.createElement("div");
    imageElement.classList.add("image-card");
    imageElement.innerHTML = `
            <img src="${data.fileURL}" alt="${data.description}">
            <p>${data.description}</p>
        `;

    imagesContainer.appendChild(imageElement);
  });
}

// Load Images for All Categories
["Diabetic", "IBS", "Celiac"].forEach((category) => loadImages(category));
