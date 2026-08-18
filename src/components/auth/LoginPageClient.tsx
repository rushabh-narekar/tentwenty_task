"use client";

import dynamic from "next/dynamic";

const LoginPageContent = dynamic(
  () =>
    import("@/components/auth/LoginPageContent").then(
      (module) => module.LoginPageContent,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5E5E5] border-t-primary-600" />
      </div>
    ),
  },
);

export function LoginPageClient() {
  return <LoginPageContent />;
}
