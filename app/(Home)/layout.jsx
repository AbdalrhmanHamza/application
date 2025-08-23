// import { Geist, Geist_Mono } from "next/font/google";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import "./style.css";

export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
