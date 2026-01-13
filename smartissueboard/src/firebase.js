import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCqulL38-QJFOuZmdnZN-KDzKcte7VhilE",
  authDomain: "apniassignment.firebaseapp.com",
  projectId: "apniassignment",
  storageBucket: "apniassignment.firebasestorage.app",
  messagingSenderId: "337303997960",
  appId: "1:337303997960:web:eeb67b2975cda7b18f8bbd"
};

let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  console.log("Firebase initialized successfully")
} catch (error) {
  console.error("Firebase initialization error:", error)
  throw error
}

export { auth, db }
