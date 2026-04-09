import { useEffect, useState } from "react";
import "./Toast.css";

export function Toast({ message, type = "success", onClose, autoClose = 3000 }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoClose);

    return () => clearTimeout(timer);
  }, [message, autoClose, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === "success" && "✓"}
          {type === "error" && "✕"}
          {type === "info" && "ℹ"}
        </span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success", autoClose = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, autoClose }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
}
