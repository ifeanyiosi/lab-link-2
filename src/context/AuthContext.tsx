"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User as FirebaseUser,
  getAuth,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";

// Include the necessary fields from the Firestore patient collection
interface UserDetails {
  uid: string; // Adding uid here
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  gender: string;
  // Add any other fields you need
}

interface AuthContextProps {
  user: UserDetails | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user details from the 'patient' collection in Firestore
          const userDoc = await getDoc(doc(db, "patient", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserDetails;
            // Include firebaseUser.uid here
            setUser({ ...userData, uid: firebaseUser.uid });
          } else {
            console.error("User document not found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null); // Clear the user state
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
