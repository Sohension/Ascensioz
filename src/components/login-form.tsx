"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Provider = "github" | "google";

const providerConfig = {
  github: {
    label: "Continue with GitHub",
  },
  google: {
    label: "Continue with Google",
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {error && (
            <p className="text-sm text-destructive-500">{error}</p>
          )}

          <Button
            onClick={() => handleSocialLogin("github")}
            disabled={loadingProvider !== null}
            className="w-full"
          >
            {loadingProvider === "github"
              ? "Logging in..."
              : providerConfig.github.label}
          </Button>

          <Button
            onClick={() => handleSocialLogin("google")}
            disabled={loadingProvider !== null}
            className="w-full"
          >
            {loadingProvider === "google"
              ? "Logging in..."
              : providerConfig.google.label}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}