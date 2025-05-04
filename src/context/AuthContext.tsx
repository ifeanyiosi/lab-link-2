"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";

export interface UserDetails {
  uid: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  labName: string;
}

interface AuthContextProps {
  user: UserDetails | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// Create a default context
const defaultAuthContext: AuthContextProps = {
  user: null,
  loading: true,
  logout: async () => {},
};

const AuthContext = createContext<AuthContextProps>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // For hydration safety, defer any state changes until after mount
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Only set isClient to true after component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set up auth state listener only on the client
  useEffect(() => {
    // Don't run this effect during SSR or before hydration is complete
    if (!isClient) return;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserDetails;
            setUser({ ...userData, uid: firebaseUser.uid });
          } else {
            console.error("User document not found");
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isClient]);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};