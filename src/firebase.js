import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "  AIzaSyCW8ycEe5PTuBORmGxG5G4C5DS589s1a-k",
  authDomain: "IndoorTracking.firebaseapp.com",
  projectId: "IndoorTracking",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

firebase.initializeApp(firebaseConfig);

export default firebase;