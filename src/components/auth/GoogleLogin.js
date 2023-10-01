import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function GoogleLogin() {
  const navigate = useNavigate();
  
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // User is signed in!
        // Navigate the user to the dashboard
        navigate('/');
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The AuthCredential type that was used.
        var credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

export default GoogleLogin;
