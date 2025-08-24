"use client";

import { useState, useEffect } from "react";
import TransactionsTable from "../../Components/TransactionsTable";
import { useAuth } from "../../contexts/AuthContext";
import { initializeFirebase } from "../../../firebase_config";
import {
  collection,
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
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!user || !db) return;

    let unsubscribe;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setTransactions([]);

        const userRef = doc(db, "users", user.uid);
        const userMetadata = await getDoc(userRef);
        const userRole = userMetadata.exists()
          ? userMetadata.data()?.role || "user"
          : "user";
        setRole(userRole);

        const uid = user.uid;

        let q;
        if (userRole === "admin") {
          q = query(collectionGroup(db, "transactions"), orderBy("createdAt", "desc"));
        } else if (userRole === "moderator") {
          q = query(
            collectionGroup(db, "transactions"),
            where("moderatorId", "==", uid),
            orderBy("createdAt", "desc")
          );
        } else {
          q = query(collection(db, `users/${uid}/transactions`), orderBy("createdAt", "desc"));
        }

        unsubscribe = onSnapshot(q, (snapshot) => {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setTransactions(list);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      setTransactions([]);
    };
  }, [user, db]);

  return (
    <div className="w-full h-full flex flex-col justify-start p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">المشتريات</h1>
      </div>
      <div className="mt-4 border-t-2 border-neutral-800 pt-4">
        <TransactionsTable transactions={transactions} role={role} />
        {loading && <p className="text-lg text-center">جارِ التحميل...</p>}
        {!loading && transactions.length === 0 && (
          <p className="text-lg text-center">لا توجد مشتريات</p>
        )}
      </div>
    </div>
  );
}
