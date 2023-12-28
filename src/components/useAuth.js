import { useState } from 'react';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const auth = getAuth();

    const processAuthAction = async(action) => {
        setIsLoading(true);
        setError('');
        try {
            await action();
        } catch (error) {
            // Here you can add a user-friendly error message
            setError("An error occurred. Please try again later.");
            console.error("Auth Error:", error); // For debugging purposes
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithEmail = (email, password) => processAuthAction(() => signInWithEmailAndPassword(auth, email, password));
    const register = (email, password) => processAuthAction(() => createUserWithEmailAndPassword(auth, email, password));
    const signInWithGoogle = () => processAuthAction(() => signInWithPopup(auth, new GoogleAuthProvider()));
    const resetPassword = (email) => processAuthAction(() => sendPasswordResetEmail(auth, email));

    return { isLoading, error, signInWithEmail, register, signInWithGoogle, resetPassword };
};