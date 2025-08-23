"use client";

import {
  doc,
  getDoc,
  getDocs,
  collectionGroup,
  orderBy,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { initializeFirebase } from "../../../firebase_config";
import { useState, useEffect } from "react";
import TransactionsTable from "../../Components/TransactionsTable";
import { useAuth } from "../../contexts/AuthContext";

export default function Page() {
  const { user } = useAuth();
  const { db } = initializeFirebase();

  const uid = user?.uid ?? null;
  const [role, setRole] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        setOrders([]);

        // Guard: must have uid and db
        if (!db || !uid) {
          setRole(null);
          return;
        }

        // Fetch user role
        console.log("Loading user role for uid:", uid);
        const userSnap = await getDoc(doc(db, "users", uid));
        const data = userSnap.exists() ? userSnap.data() : {};
        const userRole = data?.role || "user"; // default to regular user
        setRole(userRole);

        // Build query based on role
        console.log("User role:", userRole);
        const base = collectionGroup(db, "withdrawOrders");
        let q;

        if (userRole === "admin") {
          q = query(base, orderBy("createdAt", "desc"));
        } else if (userRole === "moderator") {
          console.log(
            "User is a moderator, loading their withdraw orders",
            uid
          );
          q = query(
            base,
            where("moderator", "==", uid),
            orderBy("createdAt", "desc")
          );
        } else {
          q = query(
            base,
            where("uid", "==", uid),
            orderBy("createdAt", "desc")
          );
        }
        console.log("Constructed query:", q);

        // const querySnapshot = await getDocs(q);
        // const list = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        // setOrders(list);

        // Subscribe
        unsubscribe = onSnapshot(q, (snapshot) => {
          console.log("Withdraw orders snapshot received:", snapshot.size);
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setOrders(list);
        });
      } catch (e) {
        console.error("Error loading withdraw orders:", e);
        setError(e?.message || "حدث خطأ غير متوقع");
      } finally {
        setLoading(false);
      }
    }

    load();

    // return () => {
    //   if (typeof unsubscribe === "function") unsubscribe();
    // };
  }, [db, uid]);

  return (
    <div className="w-full h-full flex flex-col gap-4 p-1">
      <div>
        <h1>طلبات السحب</h1>
      </div>
      <div>
        <TransactionsTable transactions={orders} role={role} />
        {loading && <p className="text-sm text-gray-500">جارِ التحميل...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
