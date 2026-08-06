import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import Link from "next/link";

import CreateProfileModal from "@/components/profile-components/create-profile-modal";

import { Rajdhani, Montserrat } from "next/font/google";
import BackgroundVideo from "@/components/big-components/Video";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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

      <main className="relative min-h-screen w-full overflow-hidden">
        <BackgroundVideo />

        {/* Video readability overlays */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <section className="relative z-10 flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 md:px-16 lg:px-24">
            <div className="max-w-4xl border-l-4 border-yellow-400 pl-5 sm:pl-7">
              {/* Small UI text */}
              <p
                className={`${rajdhani.className}
                  mb-4
                  text-xs sm:text-sm
                  font-semibold
                  tracking-[0.35em]
                  text-yellow-300
                `}
              >
                YOUR ASCENSION
              </p>

              {/* Main heading */}
              <h1
                className={`${montserrat.className}
                  text-4xl
                  sm:text-5xl
                  md:text-6xl
                  lg:text-7xl
                  font-semibold
                  leading-tight
                  text-white
                `}
              >
                Jump back in,
              </h1>

              {/* Username */}
              <h2
                className={`${montserrat.className}
                  mt-2
                  text-5xl
                  sm:text-6xl
                  md:text-7xl
                  lg:text-8xl
                  font-bold
                  leading-none
                  text-yellow-400
                `}
              >
                {profile?.username || "new user"}
              </h2>

              {/* Description */}
              <p
                className={`${rajdhani.className}
                  mt-6
                  max-w-xl
                  text-base
                  sm:text-lg
                  font-medium
                  tracking-wide
                  text-white/70
                `}
              >
                Your journey continues. Enter the arena and continue your
                ascension.
              </p>

              {/* CTA */}
              <Link href="/pyron">
                <button
                  className={`${rajdhani.className}
                    mt-8
                    bg-yellow-400
                    px-8
                    py-3
                    text-base
                    sm:text-lg
                    font-bold
                    tracking-wider
                    text-slate-950
                    shadow-xl
                    shadow-black/40
                    transition-all
                    duration-200
                    hover:scale-105
                    hover:bg-yellow-300
                  `}
                >
                  ▶ PLAY NOW
                </button>
              </Link>

              {/* Small player info */}
              <div className="mt-10 flex flex-wrap gap-4">
                <div
                  className="
                    border border-white/20
                    bg-black/30
                    px-5 py-3
                    backdrop-blur-md
                  "
                >
                  <p
                    className={`${rajdhani.className}
                      text-xs
                      tracking-widest
                      text-white/50
                    `}
                  >
                    STATUS
                  </p>

                  <p
                    className={`${montserrat.className}
                      text-sm
                      font-semibold
                      text-white
                    `}
                  >
                    ONLINE
                  </p>
                </div>

                <div
                  className="
                    border border-white/20
                    bg-black/30
                    px-5 py-3
                    backdrop-blur-md
                  "
                >
                  <p
                    className={`${rajdhani.className}
                      text-xs
                      tracking-widest
                      text-white/50
                    `}
                  >
                    LEVEL
                  </p>

                  <p
                    className={`${montserrat.className}
                      text-sm
                      font-semibold
                      text-white
                    `}
                  >
                    01
                  </p>
                </div>

                <div
                  className="
                    border border-white/20
                    bg-black/30
                    px-5 py-3
                    backdrop-blur-md
                  "
                >
                  <p
                    className={`${rajdhani.className}
                      text-xs
                      tracking-widest
                      text-white/50
                    `}
                  >
                    RANK
                  </p>

                  <p
                    className={`${montserrat.className}
                      text-sm
                      font-semibold
                      text-white
                    `}
                  >
                    ROOKIE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
