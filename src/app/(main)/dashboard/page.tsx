import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";

import CreateProfileModal from "@/components/profile-components/create-profile-modal";

import { Rajdhani, Montserrat } from "next/font/google";

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

  // 🔐 AUTH
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) redirect("/auth/login");

  // 📦 PROFILE CHECK (SAFE + STABLE)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle(); // 🔥 BEST FIX HERE

  const hasProfile = !!profile;

  return (
    <>
      {/* MODAL */}
      {!hasProfile && <CreateProfileModal open={true} />}

      {/* DASHBOARD */}
      <div className="relative w-full h-screen -z-5 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
        >
          <source src="/shopwebm.webm" type="video/webm" />
        </video>

        <div className="relative z-10 ml-25 mt-60 h-full">
          <h1
            className={`${montserrat.className} text-7xl text-white font-semibold`}
          >
            Jump back in,
          </h1>

          <h1
            className={`${montserrat.className} text-7xl text-white font-semibold`}
          >
            {profile?.username || "new user"}
          </h1>

          <button
            className={`${rajdhani.className} font-semibold mt-10 px-4 py-2 bg-white text-black rounded`}
          >
            Play now
          </button>
        </div>
      </div>
    </>
  );
}
