"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";

import "../globals.css";

export default function Layout({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  // useEffect(() => {
  // Redirect to sign-in if user is not authenticated
  if (user) {
    return router.push("/");
  }
  // }, [user, router]);

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
      </div>
      <div className="flex-1 flex">{children}</div>
    </main>
  );
}
