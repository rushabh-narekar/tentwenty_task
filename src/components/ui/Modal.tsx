"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) {
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      className="m-auto flex w-[calc(100%-1rem)] max-w-lg max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-lg border border-[#E5E5E5] bg-white p-0 shadow-xl open:flex backdrop:bg-(--gray-600) sm:w-[calc(100%-2rem)] sm:max-h-[calc(100dvh-2rem)]"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-[#E5E5E5] px-4 py-3 sm:px-6 sm:py-4">
        <h2 className="text-base font-bold text-[#1A1A1A]">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center text-[#D1D5DB] transition hover:text-[#9CA3AF]"
          aria-label="Close modal"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">{children}</div>
    </dialog>
  );
}
