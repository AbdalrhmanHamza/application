"use client";

import AuthProvider from "./contexts/AuthContext";
import ProductProvider from "./contexts/ProductContext";
import { Cairo } from "next/font/google";
import { Toaster, toast } from "sonner";
import { getMessaging, onMessage } from "firebase/messaging";
import { generateToken } from "../firebase_config";
import { initializeFirebase } from "../firebase_config";
import { useAuth } from "./contexts/AuthContext";
import { useState, useEffect } from "react";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-base",
  display: "swap",
});

export default function RootLayout({ children }) {
  // const { firebase } = initializeFirebase();
  // const { user } = useAuth();

  // useEffect(() => {
  //   if (user) {
  //     const messaging = getMessaging(firebase);
  //     generateToken();
  //     onMessage(messaging, (payload) => {
  //       console.log("Message received. ", payload);
  //       // show toast notification
  //       toast(payload.notification.title, {
  //         description: payload.notification.body,
  //         action: {
  //           label: "Close",
  //         },
  //       });
  //     });
  //   }
  // }, [user]);

  return (
    <html lang="en" className={cairo.variable}>
      <head>
        <title>Gala App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-black text-white">
        <Toaster
          position="top-center"
          visibleToasts={6}
          expand
          richColors={true}
          theme="dark"
        />
        <AuthProvider>
          <ProductProvider>{children}</ProductProvider>
        </AuthProvider>
        {/* Modal portal root (must be unique and empty) */}
        <div id="modal-root" />
      </body>
    </html>
  );
}
