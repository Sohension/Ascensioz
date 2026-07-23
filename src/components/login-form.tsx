"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Rajdhani, Montserrat } from "next/font/google";
import Link from "next/link";
import { useTheme } from "next-themes";

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const montserrat = Montserrat({ weight: ["800"], subsets: ["latin"] });

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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
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
    <div className={`relative overflow-x-hidden min-h-screen flex items-center justify-center selection:bg-yellow-200 antialiased px-4 sm:px-6 py-8 sm:py-12 w-full ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"
    }`}>
      {/* GRID BACKGROUND */}
      <AnimatedGridPattern className={`absolute inset-0 z-1 ${
        isDark ? "text-slate-800" : "text-gray-200"
      }`} />

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
            className={`${rajdhani.className} inline-block text-xs sm:text-sm uppercase tracking-[0.2em] font-bold transition-colors ${
              isDark ? "text-slate-400 hover:text-slate-300" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            &larr; Back to home
          </Link>
          <h1
            className={`${montserrat.className} text-3xl sm:text-4xl tracking-tight leading-tight ${
              isDark ? "text-slate-50" : "text-slate-950"
            }`}
          >
            Welcome Back.
          </h1>
          <p
            className={`${rajdhani.className} text-base sm:text-lg font-medium tracking-wide max-w-xs sm:max-w-sm mx-auto ${
              isDark ? "text-slate-400" : "text-gray-400"
            }`}
          >
            Sign in to your account to continue your learning journey
          </p>
        </div>

        {/* Auth Card */}
        <div className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-md shadow-xl flex flex-col gap-3.5 sm:gap-4 text-left ${
          isDark 
            ? "bg-slate-900/80 border-slate-700/70" 
            : "bg-white/70 border-gray-200/80"
        }`}>
          {error && (
            <div
              className={`${rajdhani.className} text-sm font-semibold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl ${
                isDark 
                  ? "text-red-300 bg-red-900/30 border border-red-800" 
                  : "text-destructive bg-red-50 border border-red-200"
              }`}
            >
              ⚠️ {error}
            </div>
          )}

          {/* GitHub Login Button */}
          <Button
            onClick={() => handleSocialLogin("github")}
            disabled={loadingProvider !== null}
            className={`${rajdhani.className} w-full text-base sm:text-lg px-4 py-3 sm:py-3.5 h-auto transition-all font-bold tracking-wide rounded-xl shadow-md hover:shadow-lg flex items-center justify-center ${
              isDark 
                ? "bg-slate-800 text-slate-100 hover:bg-slate-700" 
                : "bg-white text-gray-900 hover:bg-gray-50"
            }`}
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
            className={`${rajdhani.className} w-full text-base sm:text-lg px-4 py-3 sm:py-3.5 h-auto transition-all font-bold tracking-wide rounded-xl shadow-md hover:shadow-lg flex items-center justify-center ${
              isDark 
                ? "border-slate-600 text-slate-100 hover:border-slate-500 hover:bg-slate-800" 
                : "border-gray-300 text-gray-900 hover:border-gray-500 hover:bg-gray-50"
            }`}
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
          className={`${rajdhani.className} font-medium text-xs sm:text-sm tracking-wider uppercase ${
            isDark ? "text-slate-500" : "text-gray-400"
          }`}
        >
          PLAY &bull; LEARN &bull; BUILD
        </div>
      </div>
    </div>
  );
}