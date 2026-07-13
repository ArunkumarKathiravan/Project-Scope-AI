"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

type ToastContextValue = { toast: (message: string) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Array<{ id: string; text: string }>>([]);
  const toast = useCallback((text: string) => {
    const id = crypto.randomUUID();
    setMessages((current) => [...current, { id, text }]);
    window.setTimeout(
      () => setMessages((current) => current.filter((item) => item.id !== id)),
      3000
    );
  }, []);
  const value = useMemo(() => ({ toast }), [toast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] grid w-[min(360px,calc(100vw-2rem))] gap-2"
        aria-live="polite"
      >
        {messages.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-soft"
          >
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <p className="flex-1 text-sm">{item.text}</p>
            <button
              aria-label="Dismiss notification"
              onClick={() =>
                setMessages((current) => current.filter((message) => message.id !== item.id))
              }
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
