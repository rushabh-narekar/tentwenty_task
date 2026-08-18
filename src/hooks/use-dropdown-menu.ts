"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

const DROPDOWN_CLOSE_ALL_EVENT = "dropdown:close-all";

export function closeAllDropdowns() {
  document.dispatchEvent(new CustomEvent(DROPDOWN_CLOSE_ALL_EVENT));
}

function useDropdownCloseListener(onClose: () => void) {
  useEffect(() => {
    document.addEventListener(DROPDOWN_CLOSE_ALL_EVENT, onClose);
    return () =>
      document.removeEventListener(DROPDOWN_CLOSE_ALL_EVENT, onClose);
  }, [onClose]);
}

function useOutsideClickListener(
  isActive: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActive, containerRef, onClose]);
}

export function useDropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  useDropdownCloseListener(close);
  useOutsideClickListener(isOpen, containerRef, close);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
      return;
    }

    closeAllDropdowns();
    setIsOpen(true);
  }, [isOpen, close]);

  return { isOpen, containerRef, toggle, close };
}

export function useDropdownIdMenu() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setActiveId(null), []);

  useDropdownCloseListener(close);
  useOutsideClickListener(!!activeId, containerRef, close);

  const toggle = useCallback(
    (id: string) => {
      if (activeId === id) {
        close();
        return;
      }

      closeAllDropdowns();
      setActiveId(id);
    },
    [activeId, close],
  );

  return { activeId, containerRef, toggle, close };
}
