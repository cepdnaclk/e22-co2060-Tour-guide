import React from "react";
import { useNavigate } from "react-router-dom";

export default function PageNavigation({ showHome = true, className = "" }) {
  const navigate = useNavigate();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
     <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition"
      >
        ← Back
      </button>

      {showHome && (
        <button
          onClick={() => navigate("/")}
          className="px-6 h-12 rounded-full bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition"
        >
          Home
        </button>
      )}

    <button
        onClick={() => navigate(1)}
        className="px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition"
      >
        Forward →
      </button>
    </div>
  );
}