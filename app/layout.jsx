"use client";

import AuthProvider from "./contexts/AuthContext";
import ProductProvider from "./contexts/ProductContext";
import { Cairo } from "next/font/google";
import { Toaster } from "sonner";
import FCMTokensProvider from "./contexts/FCMTokens";
import { useState } from "react";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-base",
  display: "swap",
});

export default function RootLayout({ children }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
          <ProductProvider>
            <FCMTokensProvider>{children}</FCMTokensProvider>
          </ProductProvider>
        </AuthProvider>
        {/* modal outlet */}
        <div id="modal-root">
          <div>
            <button onClick={() => setModalIsOpen(false)}>close modal</button>
          </div>
          <div id="portal"></div>
        </div>
      </body>
    </html>
  );
}
