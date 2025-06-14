"use client";
import { Toaster, toast } from "react-hot-toast";

// ...existing code...
const CustomToast = ({ t, message, borderColor }) => {
  return (
    <div
      key={t}
      className={`${
        toast.visible ? "animate-enter" : "animate-leave"
      } max-w-sm w-full bg-black text-white rounded-lg shadow-lg p-4 border-2 flex items-center justify-between`}
      style={{ borderColor }}
    >
      <span className="pr-2">{message}</span>
    </div>
  );
};
// ...existing code...

// Main Toaster Setup
export default function CustomToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        // You can keep default options here
        style: {
          background: "#000",
          color: "#fff",
          padding: "12px 16px",
          borderRadius: "8px",
        },
      }}
    />
  );
}

// Helper functions to show custom toasts with close button
export const showSuccess = (message) =>
  toast.custom((t) => (
    <CustomToast t={t} message={message} borderColor="#22c55e" />
  ));

export const showError = (message) =>
  toast.custom((t) => (
    <CustomToast t={t} message={message} borderColor="#ef4444" />
  ));

export const showInfo = (message) =>
  toast.custom((t) => (
    <CustomToast t={t} message={message} borderColor="#ffffff" />
  ));
