import { auth } from "./firebase";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.log("User closed the login window.");
      return null;
    }
    
    if (error.code === 'auth/cancelled-popup-request') {
      console.log("Multiple popup requests; ignoring the extra ones.");
      return null;
    }

    console.error("Actual Login Error:", error.message);
    alert("Something went wrong during login. Please try again.");
    return null;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};