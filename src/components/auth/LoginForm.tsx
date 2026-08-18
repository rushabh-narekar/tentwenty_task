"use client";

import {
  validateLoginForm,
  type LoginFormValues,
} from "@/lib/validation/login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const REMEMBER_EMAIL_KEY = "ticktock_remember_email";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2.036 12.322a1 1 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getInitialValues(): LoginFormValues {
  if (typeof window === "undefined") {
    return { email: "", password: "", rememberMe: false };
  }

  const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
  if (savedEmail) {
    return { email: savedEmail, password: "", rememberMe: true };
  }

  return { email: "", password: "", rememberMe: false };
}

export function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoginFormValues>(getInitialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateLoginForm(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors as Record<string, string>);
      setFormError("");
      return;
    }

    setFieldErrors({});
    setFormError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setFormError("Invalid email or password. Please try again.");
        return;
      }

      if (values.rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, values.email);
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setFormError("Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-[#1A1A1A]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.value }))
          }
          className="w-full rounded-md border border-[#D1D5DB] px-3 py-2.5 text-base text-[#1A1A1A] outline-none transition focus:border-primary-600 focus:ring-1 focus:ring-primary-600 sm:text-sm"
          placeholder="name@example.com"
        />
        {fieldErrors.email && (
          <p className="mt-1.5 text-sm text-red-600" role="alert">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-[#1A1A1A]"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={values.password}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            className="w-full rounded-md border border-[#D1D5DB] py-2.5 pr-11 pl-3 text-base text-[#1A1A1A] outline-none transition focus:border-primary-600 focus:ring-1 focus:ring-primary-600 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-[#6B7280] transition hover:text-[#1A1A1A]"
            aria-label={showPassword ? "Hide" : "Show"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon open={!showPassword} />
          </button>
        </div>
        {fieldErrors.password && (
          <p className="mt-1.5 text-sm text-red-600" role="alert">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-[#6B7280]">
        <input
          type="checkbox"
          checked={values.rememberMe}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              rememberMe: event.target.checked,
            }))
          }
          className="h-4 w-4 rounded border-[#D1D5DB]"
        />
        Remember me
      </label>

      {formError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
