import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBlh0DdEsTub81nzqB6cMujVrHnDQcFk4I",
    authDomain: "authentication-6d8ad.firebaseapp.com",
    projectId: "authentication-6d8ad",
    storageBucket: "authentication-6d8ad.appspot.com",
    messagingSenderId: "1043859499582",
    appId: "1:1043859499582:web:2aae0353ac3727c7d77f6f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { auth, googleAuthProvider };