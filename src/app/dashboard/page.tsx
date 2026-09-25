import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import Link from "next/link";

import CreateProfileModal from "@/components/profile-components/create-profile-modal";

import BackgroundVideo from "@/components/big-components/Video";

export default async function ProtectedPageHome() {
  const supabase = await createClient();

  // AUTH
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) redirect("/auth/login");

  // PROFILE
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <>
      {!profile && <CreateProfileModal open={true} />}

      <main className="theme-dashboard page-shell relative w-full overflow-hidden">
        <BackgroundVideo />

        <div className="theme-dashboard-overlay absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.2),transparent_45%)]" />
        <div className="theme-dashboard-vignette absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.72)_0%,rgba(2,6,23,0.42)_40%,rgba(2,6,23,0.72)_100%)]" />

        <section className="relative z-10 flex min-h-screen items-center py-16">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 md:px-16 lg:px-24">
            <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="theme-dashboard-content max-w-4xl pl-5 sm:pl-7">
                <p className="theme-dashboard-kicker mb-4 text-xs font-semibold tracking-[0.35em] text-[var(--color-primary)] sm:text-sm">
                  YOUR ASCENSIOZ
                </p>

                <h1 className="theme-dashboard-title text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Jump back in,
                </h1>

                <h2 className="theme-dashboard-name mt-2 text-5xl font-black leading-none sm:text-6xl md:text-7xl lg:text-8xl">
                  {profile?.username || "new user"}
                </h2>

                <p className="theme-dashboard-copy mt-6 max-w-xl text-base font-medium tracking-wide text-[var(--color-muted)] sm:text-lg">
                  Your journey continues. Enter the arena and continue your ascensioz.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/pyron" className="action-button">
                    ▶ Play now
                  </Link>
                  <Link href="/practice" className="secondary-button">
                    Practice path
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  {[
                    ["STATUS", "ONLINE"],
                    ["LEVEL", "01"],
                    ["RANK", "ROOKIE"],
                  ].map(([label, value]) => (
                    <div key={label} className="glass-panel px-5 py-3 backdrop-blur-md">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-muted)]">{label}</p>
                      <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel relative overflow-hidden p-5 sm:p-6">
                <p className="section-kicker">Focus</p>
                <h3 className="mt-3 text-2xl font-bold text-[var(--color-text)]">Today’s momentum</h3>
                <div className="mt-6 space-y-4">
                  {[
                    ["Daily streak", "6 days"],
                    ["XP earned", "+340"],
                    ["Best rank", "#12"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2.5">
                      <span className="text-sm text-[var(--color-muted)]">{label}</span>
                      <span className="text-sm font-bold text-[var(--color-text)]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
