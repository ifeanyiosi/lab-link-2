// utils/authHelpers.ts
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store the token in localStorage
    const token = await user.getIdToken();
    localStorage.setItem("userToken", token);

    return user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("userToken");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
