import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import AfterAuthnav from "@/app/AfterAuthnav";
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
      <AfterAuthnav />

      {!hasProfile && <CreateProfileModal open={true} />}

      <div className="relative min-h-screen w-full overflow-hidden">
        <BackgroundVideo />

        <div className="relative z-10 flex min-h-screen items-center">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24">
            <div className="max-w-4xl">
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
                  className={`${rajdhani.className} mt-8 sm:mt-10 px-8 py-4 text-lg sm:text-xl md:text-2xl font-semibold bg-white text-black rounded-xl shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer`}
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
