// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCbiYKlfd0lkL-fw0CNuK1gcD9n8wvh7oE",
  authDomain: "indoortracking-b174f.firebaseapp.com",
  projectId: "indoortracking-b174f",
  storageBucket: "indoortracking-b174f.appspot.com",
  messagingSenderId: "797225558025",
  appId: "1:797225558025:web:c7749c5642ecee769e18d8",
  measurementId: "G-0BJQC19M1C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;