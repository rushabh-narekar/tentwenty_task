"use client";

import Link from "next/link";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import { signOut, useSession } from "next-auth/react";

export function AppHeader() {
  const { data: session } = useSession();
  const { isOpen: menuOpen, containerRef: menuRef, toggle: toggleMenu, close: closeMenu } =
    useDropdownMenu();

  return (
    <header className="bg-white">
      <div className="px-4 sm:px-6">
        <div className="mx-auto flex h-14 w-full max-w-full items-center justify-between sm:h-16">
          <div className="flex min-w-0 items-center gap-4 sm:gap-8">
            <Link
              href="/dashboard"
              className="shrink-0 text-lg font-bold text-[#1A1A1A] sm:text-xl"
            >
              ticktock
            </Link>
            <nav className="hidden sm:block">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-[#1A1A1A]"
              >
                Timesheets
              </Link>
            </nav>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={toggleMenu}
              className="flex max-w-[45vw] items-center gap-2 text-sm font-medium text-[#1A1A1A] sm:max-w-none"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <span className="truncate">
                {session?.user?.name ?? "User"}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                aria-hidden="true"
                className="shrink-0"
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-20 mt-2 w-40 rounded-lg border border-[#E5E7EB] bg-white py-1 shadow-lg"
              >
                <Link
                  href="/dashboard"
                  role="menuitem"
                  onClick={closeMenu}
                  className="block px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F9FAFB] sm:hidden"
                >
                  Timesheets
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="block w-full px-4 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F9FAFB]"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
