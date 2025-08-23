"use client";

import Link from "next/link";
import { initializeFirebase } from "../../firebase_config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const { auth } = initializeFirebase();
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
      <div className="flex flex-row gap-2 flex-1 items-stretch">
        {/* sidebar */}
        <div className="w-62 border-2 border-neutral-900 rounded-lg p-2">
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
