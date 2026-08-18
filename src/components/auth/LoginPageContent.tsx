"use client";

import { LoginForm } from "@/components/auth/LoginForm";

export function LoginPageContent() {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <section className="flex w-full flex-col justify-center bg-white px-4 py-8 sm:px-8 md:w-1/2 md:px-12 lg:px-16 xl:px-[120px]">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <h2 className="text-2xl font-bold text-primary-600">ticktock</h2>
          </div>
          <h1 className="text-xl font-bold text-[#1A1A1A] sm:text-2xl">
            Welcome back
          </h1>
          <div className="mt-6 sm:mt-8">
            <LoginForm />
          </div>
        </div>
      </section>

      <section className="hidden w-1/2 flex-col justify-center bg-primary-600 px-12 py-12 text-white md:flex lg:px-[120px]">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold lg:text-3xl">ticktock</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/90 lg:mt-6 lg:text-base">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any internet-connected
            device.
          </p>
        </div>
      </section>
    </div>
  );
}
