"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function DetailsModal({ isOpen, onClose, details }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl mb-4">Transaction Details</h2>
        <pre className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-96">
          {JSON.stringify(details, null, 2)}
        </pre>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
