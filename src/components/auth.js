import React, { useState } from "react";
import { auth, googleAuthProvider } from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    fetchSignInMethodsForEmail,
} from "firebase/auth";

const Auth = () => {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [message, setMessage] = useState("");

        const signIn = async() => {
            try {
                const signInMethods = await fetchSignInMethodsForEmail(auth, email);

                if (!signInMethods || signInMethods.length === 0) {
                    await createUserWithEmailAndPassword(auth, email, password);
                    setMessage("User created successfully.");
                } else {
                    setMessage(
                        "The provided email address is already registered. Please use a different email."
                    );
                }
            } catch (error) {
                console.error(error);

                if (error.code === "auth/email-already-in-use") {
                    setMessage(
                        "The provided email address is already registered. Please use a different email."
                    );
                } else {
                    setMessage("An error occurred.");
                }
            }
        };

        const signInWithGoogle = async() => {
            try {
                await signInWithPopup(auth, googleAuthProvider);
            } catch (error) {
                console.error(error);
                setMessage("An error occurred.");
            }
        };

        const logout = async() => {
            try {
                await signOut(auth);
                setMessage("Logged out successfully.");
            } catch (error) {
                console.error(error);
                setMessage("An error occurred.");
            }
        };

        return ( <
            div >
            <
            input placeholder = "Email..."
            onChange = {
                (e) => setEmail(e.target.value)
            }
            /> <
            input placeholder = "Password..."
            type = "password"
            onChange = {
                (e) => setPassword(e.target.value)
            }
            /> <
            button onClick = { signIn } > Sign In < /button> <
            button onClick = { signInWithGoogle } > Sign In With Google < /button> <
            button onClick = { logout } > Logout < /button>

            {
                message && < p > { message } < /p>} < /
                    div >
            );
        };

        export default Auth;