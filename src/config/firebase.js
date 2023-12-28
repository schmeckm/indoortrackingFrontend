import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBD8U4fJrqicfsOklu0adl_1LYS70pho7A",
    authDomain: "authorization-f291d.firebaseapp.com",
    projectId: "authorization-f291d",
    storageBucket: "authorization-f291d.appspot.com",
    messagingSenderId: "880438732092",
    appId: "1:880438732092:web:0e6147e2425c389429aa39",
    measurementId: "G-MGL4MJBS61"
};


const app = initializeApp(firebaseConfig);

// Authentifizierungsdienst initialisieren
const auth = getAuth(app);

// Firestore-Datenbankdienst initialisieren
const db = getFirestore(app);

// Exportieren der Firebase-Dienste
export { auth, db };