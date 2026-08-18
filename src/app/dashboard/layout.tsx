import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <div className="flex h-dvh min-h-dvh flex-col overflow-hidden bg-[#F9FAFB]">
      <div className="shrink-0">
        <AppHeader />
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="px-4 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </div>
      </main>

      <div className="shrink-0 px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <AppFooter />
        </div>
      </div>
    </div>
  );
}
