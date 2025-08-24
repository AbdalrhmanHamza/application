"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import mediumZoom from "medium-zoom";

export default function Modal({ isOpen, onClose, children }) {
  const elRef = useRef(null);
  const contentRef = useRef(null);
  const zoomRef = useRef(null);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  // Mount/unmount portal container once
  useEffect(() => {
    const modalRoot = document.getElementById("modal-root");
    if (!modalRoot) return;
    modalRoot.appendChild(elRef.current);
    return () => {
      try {
        modalRoot.removeChild(elRef.current);
      } catch {}
    };
  }, []);

  // Attach medium-zoom when modal opens and content is present
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    if (!zoomRef.current) {
      zoomRef.current = mediumZoom({
        margin: 24,
        background: "rgba(0, 0, 0, 0.8)",
        scrollOffset: 0,
        scale: 1.5,
        backdropFilter: "blur(20px)",
      });
    }

    const nodes = Array.from(
      contentRef.current.querySelectorAll("[data-zoomable]")
    );
    if (nodes.length) {
      zoomRef.current.attach(nodes);
    }

    // Detach on close/unmount to avoid duplicate bindings (Strict Mode)
    return () => {
      try {
        if (nodes.length) zoomRef.current?.detach(nodes);
      } catch {}
    };
  }, [isOpen, children]);

  if (!isOpen || !elRef.current) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg bg-opacity-100">
      <div onClick={onClose} className="fixed inset-0" />
      <button
        className="absolute hover:bg-neutral-800 transition-colors duration-300 bg-neutral-900 top-4 right-4 p-2 rounded-lg border border-neutral-700  text-gray-600 hover:text-gray-800"
        onClick={onClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-x-icon lucide-x text-white"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
      <div
        ref={contentRef}
        className="max-h-[90vh] scrollbar overflow-y-auto overflow-x-auto relative p-6 rounded shadow-lg max-w-lg w-full"
      >
        {children}
      </div>
    </div>,
    elRef.current
  );
}
