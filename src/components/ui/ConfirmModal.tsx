"use client";

import { Modal } from "@/components/ui/Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  variant?: "danger" | "default";
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isConfirming = false,
  onConfirm,
  onClose,
  variant = "default",
}: ConfirmModalProps) {
  const confirmClassName =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-primary-600 hover:bg-primary-700";

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose}>
      <p className="text-sm text-[#6B7280]">{message}</p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onConfirm}
          disabled={isConfirming}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${confirmClassName}`}
        >
          {isConfirming ? "Deleting..." : confirmLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isConfirming}
          className="flex-1 rounded-md border border-[#D1D5DB] px-4 py-2.5 text-sm font-medium hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cancelLabel}
        </button>
      </div>
    </Modal>
  );
}
