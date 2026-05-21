"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up"
        >
          <div
            className={`px-6 py-3 rounded-xl shadow-2xl border font-medium text-sm ${
              toast.type === "error"
                ? "bg-red-500/90 border-red-400/50 text-white"
                : toast.type === "info"
                  ? "bg-blue-500/90 border-blue-400/50 text-white"
                  : "bg-accent border-accent-hover text-white"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: () => {} };
  }
  return ctx;
}
