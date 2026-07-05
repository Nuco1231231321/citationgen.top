"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CheckCircle, X, Warning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type ToastProps = {
  message: string;
  variant?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
};

export function Toast({
  message,
  variant = "success",
  duration = 2400,
  onClose
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border px-5 py-3.5 shadow-lg backdrop-blur-md transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        variant === "success" && "border-emerald-200 bg-emerald-50/95 text-emerald-800",
        variant === "error" && "border-red-200 bg-red-50/95 text-red-800",
        variant === "info" && "border-stone-200 bg-white/95 text-carbon-ink"
      )}
    >
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-paper-white text-graphite shadow-sm transition-colors hover:bg-soft-stone hover:text-carbon-ink"
        aria-label="Dismiss"
      >
        <X size={12} weight="bold" />
      </button>
      <span className="flex items-center gap-2.5 text-sm font-medium">
        {variant === "success" ? (
          <CheckCircle size={18} weight="fill" className="text-emerald-600" />
        ) : variant === "error" ? (
          <Warning size={18} weight="fill" className="text-red-500" />
        ) : null}
        {message}
      </span>
    </div>
  );
}

type ToastEntry = {
  id: string;
  message: string;
  variant: "success" | "error" | "info";
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  function show(message: string, variant: "success" | "error" | "info" = "success") {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, message, variant }]);
  }

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function ToastContainer() {
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              variant={toast.variant}
              onClose={() => dismiss(toast.id)}
            />
          </div>
        ))}
      </div>
    );
  }

  return { show, dismiss, ToastContainer };
}
