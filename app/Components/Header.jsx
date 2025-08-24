"use client";

import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const { user } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div
        onClick={toggleMenu}
        className={`fixed inset-0 bg-black/40 z-40 ${!isMenuOpen && "hidden"}`}
      ></div>
      <nav className="navbar">
        <div className="logo">
          <Link href="/" className="logo-link-wrapper">
            <img src="/logo.png" className="logo-img" alt="Gala live Logo" />
          </Link>
        </div>
        <div className={`nav-links-wrapper ${isMenuOpen ? "active" : ""}`}>
          <div className="nav-links-container">
            <ul className="nav-links">
              <li>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  className="nav-link"
                  href="/"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  className="nav-link"
                  href="/learn"
                >
                  فيديوهات تعليمية
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  className="nav-link"
                  href="/policy"
                >
                  سياسة غلا لايف
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  className="nav-link"
                  href="/marketplace"
                >
                  متجر غلا لايف
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  className="nav-link"
                  href="/withdraw"
                >
                  سحب راتب
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="download-btn">
          {user ? (
            <Link href="/dashboard" className="btn-primary">
              لوحة التحكم
            </Link>
          ) : (
            <Link href="/signin" className="btn-primary">
              تسجيل الدخول
            </Link>
          )}
          <Link href="/policy" className="btn-primary-download">
            سياسة التطبيق
            <img
              src="/file-text.svg"
              alt="policy icon"
              className="download-icon"
            />
          </Link>
          <div className="menu-button-container">
            <button className="menu-btn" onClick={toggleMenu}>
              <div className="menu-btn-icon">
                <span
                  className={`arc ${isMenuOpen ? "arc-active" : ""}`}
                ></span>
                <span
                  className={`arc ${isMenuOpen ? "arc-active" : ""}`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
