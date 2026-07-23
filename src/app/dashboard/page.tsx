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

  const hasProfile = !!profile;

  return (
    <>
      {!hasProfile && <CreateProfileModal open={true} />}

      <div className="relative min-h-screen w-full overflow-hidden">
        <BackgroundVideo />

        <div className="relative z-10 flex min-h-screen items-center">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
            <div className="max-w-4xl border-l-4 border-yellow-400 pl-5 sm:pl-7">
              <p className={`${rajdhani.className} mb-3 text-sm font-bold text-yellow-300`}>YOUR ASCENSION</p>
              <h1
                className={`${montserrat.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-semibold leading-tight`}
              >
                Jump back in,
              </h1>

              <h1
                className={`${montserrat.className} mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-semibold wrap-break-word`}
              >
                {profile?.username || "new user"}
              </h1>

              <Link href="/pyron">
                <button
                  className={`${rajdhani.className} mt-8 bg-yellow-400 px-8 py-4 text-lg font-bold text-slate-950 shadow-xl shadow-black/30 transition-transform duration-200 hover:scale-105 hover:bg-yellow-300 sm:mt-10 sm:text-xl md:text-2xl`}
                >
                  ▶ Play Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
