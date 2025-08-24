"use client";

import { createContext, useState, useEffect, use } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { initializeFirebase } from "../../firebase_config";

// Provide a default shape to avoid undefined checks in consumers
export const AuthContext = createContext({ user: null, loading: true });

export default function AuthProvider({ children }) {
  const { auth } = initializeFirebase();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("🚀🚀🎉Auth state changed, user:");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
      console.log("🚀🚀🎉Auth state changed, user:", firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return use(AuthContext);
}
