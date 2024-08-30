import React from "react";
import { useNavigate } from 'react-router-dom';
import { auth, googleAuthProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

function GoogleSignIn() {
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const user = userCredential.user;
      console.log('Google user signed in:', user);
      // redirect to home page
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  return <button onClick={handleGoogleSignIn}>Sign In with Google</button>;
}

export default GoogleSignIn;
