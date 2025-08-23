"use client";

import { initializeFirebase } from "../../firebase_config";
import { useEffect, use, createContext, useState } from "react";
import { getDoc } from "firebase/firestore";

const FCMTokensContext = createContext();

export default function FCMTokensProvider({ children }) {
  const { db, auth } = initializeFirebase();
  const user = auth.currentUser;
  const uid = user ? user.uid : null;
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (!uid) return;

    const fetchTokens = async () => {
      const userDoc = await getDoc(doc(db, "users", uid));
      const tokens = userDoc.data()?.fcmToken || [];
      console.log("Fetched FCM Tokens:", tokens);
      setTokens(tokens);
      return tokens;
    };

    fetchTokens();
  }, [uid]);

  return (
    <FCMTokensContext.Provider value={{ tokens }}>
      {children}
    </FCMTokensContext.Provider>
  );
}

export function useFCMTokens() {
  return use(FCMTokensContext);
}
