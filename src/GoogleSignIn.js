// GoogleSignIn.js
import React from 'react';
import { auth } from './config/firebase'; // Stellen Sie sicher, dass der Pfad korrekt ist
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function GoogleSignIn() {
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // Anmeldung erfolgreich
                console.log("Anmeldung erfolgreich:", result.user);
                // E-Mail-Adresse des Nutzers in der Konsole ausgeben
                console.log("E-Mail-Adresse des Nutzers:", result.user.email);
            })
            .catch((error) => {
                // Fehler bei der Anmeldung
                console.error("Fehler bei der Anmeldung:", error);
            });
    };

    return ( <
        div >
        <
        button onClick = { signInWithGoogle } > Mit Google anmelden < /button> < /
        div >
    );
}

export default GoogleSignIn;