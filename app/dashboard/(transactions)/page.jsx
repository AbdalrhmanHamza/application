"use client";

import { useState, useEffect } from "react";
import TransactionsTable from "../../Components/TransactionsTable";
import { useAuth } from "../../contexts/AuthContext";
import { initializeFirebase } from "../../../firebase_config";
import {
  collection,
  getDocs,
  getDoc,
  onSnapshot,
  collectionGroup,
  query,
  where,
  orderBy,
  doc,
} from "firebase/firestore";

export default function Page() {
  const { db } = initializeFirebase();
  const user = useAuth().user;
  const userRef = user ? doc(db, "users", user.uid) : null;

  const [transactions, setTransactions] = useState([]);
  const transactionsData = [];

  useEffect(() => {
    if (!user) return;

    let unSubscribe; // Declare at useEffect level

    const fetchTransactions = async () => {
      try {
        const userMetadata = await getDoc(userRef);
        console.log("User is authenticated:", user);
        const uid = user.uid;
        console.log("user ID:", uid);

        let transactionsRef;
        let queryRef = null;

        console.log("User role:", userMetadata.data()?.role);

        switch (userMetadata.data()?.role) {
          case "admin":
            transactionsRef = collectionGroup(db, "transactions");
            queryRef = query(transactionsRef, orderBy("createdAt", "desc"));
            break;
          case "user":
            transactionsRef = collection(db, `users/${uid}/transactions`);
            queryRef = query(transactionsRef, orderBy("createdAt", "desc"));
            break;
          case "moderator":
            transactionsRef = collectionGroup(db, "transactions");
            queryRef = query(
              transactionsRef,
              where("moderatorId", "==", uid),
              orderBy("createdAt", "desc")
            );
            break;
          default:
            console.error("Unknown user role:", userMetadata.data()?.role);
            return;
        }

        console.log("transactionsRef: ", transactionsRef);

        // Initial fetch
        onSnapshot(queryRef || transactionsRef, (snapshot) => {
          const transactionsData = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            transactionsData.push({ id: doc.id, ...data });
          });
          setTransactions(transactionsData);
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();

    return () => {
      if (unSubscribe) {
        unSubscribe();
      }
      setTransactions([]);
    };
  }, [user, db]);

  return (
    <div className="w-full h-full flex flex-col justify-start p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">المشتريات</h1>
      </div>
      <div className="mt-4 border-t-2 border-neutral-800 pt-4">
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}
