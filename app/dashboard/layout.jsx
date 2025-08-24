"use client";

import Link from "next/link";
import { initializeFirebase } from "../../firebase_config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function Layout({ children }) {
  const [role, setRole] = useState(null);
  const { user } = useAuth();
  const { displayName } = user || {};
  const { auth, db } = initializeFirebase();

  useEffect(() => {
    if (!user || !db) return;

    const fetchUserRole = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setRole(data?.role || "user");
        } else {
          setRole("user");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole("user");
      } finally {
        // setLoading(false);
      }
    };

    fetchUserRole();
  }, [user, db]);

  const router = useRouter();
  return (
    <main className="flex flex-col gap-2 p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div className="overflow-hidden flex items-center">
          <Link href="/">
            <img
              className="w-16 justify-self-end h-auto"
              src="/logo.png"
              alt="Gala Logo"
            />
          </Link>
          <div className="mr-4">
            <p className="text-lg font-semibold">
              <span className="text-neutral-300">اهلا </span>
              {displayName}
            </p>
          </div>
        </div>
        <div>
          <button
            className="px-4 py-2 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors duration-300"
            onClick={() => {
              signOut(auth);
              router.push("/");
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row sm:flex-col gap-2 flex-1 items-stretch">
        {/* sidebar */}
        <div className="lg:w-62 align-self:stretch  border-2 border-neutral-900 rounded-lg p-2">
          <div>
            <ul className="flex flex-col gap-3 p-2">
              <li className="border border-neutral-800 rounded-lg">
                <Link
                  className="inline-block py-3 px-4 w-full hover:bg-neutral-800 transition-all duration-300"
                  href="/dashboard"
                >
                  المشتريات
                </Link>
              </li>
              <li className="border border-neutral-800 rounded-lg">
                <Link
                  className="inline-block py-3 px-4 w-full hover:bg-neutral-800 transition-all duration-300"
                  href="/dashboard/withdrawOrders"
                >
                  طلبات السحب
                </Link>
              </li>
              {role === "admin" && (
                <li className="border border-neutral-800 rounded-lg">
                  <Link
                    className="inline-block py-3 px-4 w-full hover:bg-neutral-800 transition-all duration-300"
                    href="/dashboard/products"
                  >
                    المنتجات
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        {/* dashboard outlet */}
        <div className="border-2 rounded-lg border-neutral-900 flex-1">
          {children}
        </div>
      </div>
    </main>
  );
}
