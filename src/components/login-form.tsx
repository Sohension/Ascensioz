"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Link from "next/link";

type Provider = "github" | "google";

const providerConfig = {
  github: {
    label: "GitHub sign-in",
    icon: (
      <svg className="mr-2 h-5 w-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
      </svg>
    ),
  },
  google: {
    label: "Google sign-in",
    icon: (
      <svg className="mr-2 h-5 w-5 fill-current" viewBox="0 0 24 24">
        <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.996 0-.74-.08-1.3-.175-1.859H12.24z" />
      </svg>
    ),
  },
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: Provider) => {
    const supabase = createClient();
    setLoadingProvider(provider);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="theme-auth-shell relative overflow-x-hidden min-h-screen flex items-center justify-center antialiased px-4 sm:px-6 py-8 sm:py-12 w-full">
      {/* GRID BACKGROUND */}
      <AnimatedGridPattern className="theme-auth-pattern absolute inset-0 z-1" />

      {/* Main Container Layer */}
      <div
        className={cn(
          "relative z-10 w-full max-w-sm sm:max-w-md mx-auto space-y-6 sm:space-y-8 text-center",
          className,
        )}
        {...props}
      >
        {/* Branding Header */}
        <div className="space-y-2 sm:space-y-3">
          <Link
            href="/"
            className="theme-auth-back inline-block text-xs sm:text-sm uppercase tracking-[0.2em] font-bold transition-colors"
          >
            &larr; Back to home
          </Link>
          <h1
            className="theme-auth-title text-3xl sm:text-4xl tracking-tight leading-tight"
          >
            Welcome Back.
          </h1>
          <p
            className="theme-auth-copy text-base sm:text-lg font-medium tracking-wide max-w-xs sm:max-w-sm mx-auto"
          >
            Sign in to your account to continue your learning journey
          </p>
        </div>

        {/* Auth Card */}
        <div className="theme-auth-card p-6 sm:p-8 border backdrop-blur-md flex flex-col gap-3.5 sm:gap-4 text-left">
          {error && (
            <div
              className="theme-auth-error text-sm font-semibold px-3 py-2 sm:px-4 sm:py-2.5"
            >
              ⚠️ {error}
            </div>
          )}

          {/* GitHub Login Button */}
          <Button
            onClick={() => handleSocialLogin("github")}
            disabled={loadingProvider !== null}
            className="theme-auth-provider-button w-full text-base sm:text-lg px-4 py-3 sm:py-3.5 h-auto transition-all font-bold tracking-wide flex items-center justify-center"
          >
            {loadingProvider === "github" ? (
              "Logging in..."
            ) : (
              <>
                {providerConfig.github.icon}
                <span className="truncate">{providerConfig.github.label}</span>
              </>
            )}
          </Button>

          {/* Google Login Button */}
          <Button
            onClick={() => handleSocialLogin("google")}
            disabled={loadingProvider !== null}
            variant="outline"
            className="theme-auth-provider-button theme-auth-provider-outline w-full text-base sm:text-lg px-4 py-3 sm:py-3.5 h-auto transition-all font-bold tracking-wide flex items-center justify-center"
          >
            {loadingProvider === "google" ? (
              "Logging in..."
            ) : (
              <>
                {providerConfig.google.icon}
                <span className="truncate">{providerConfig.google.label}</span>
              </>
            )}
          </Button>
        </div>

        {/* Branding Footer Element */}
        <div
          className="theme-auth-footer font-medium text-xs sm:text-sm tracking-wider uppercase"
        >
          PLAY &bull; LEARN &bull; BUILD
        </div>
      </div>
    </div>
  );
}