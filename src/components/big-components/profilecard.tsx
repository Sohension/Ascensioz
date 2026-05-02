"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Montserrat, Rajdhani } from "next/font/google";
import DeleteProfileButton from "../DeleteProfileButton";

/* ---------------- LOCAL FONTS (ONLY THIS PAGE) ---------------- */

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

/* ---------------- TYPES ---------------- */

type Stats = {
  xp: number;
  level: number;
  coins: number;
  ascenzy: number;
};

type Profile = {
  id: string;
  username: string;
  description: string | null;
  user_stats: Stats | null;
};

/* ---------------- PAGE ---------------- */

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          username,
          description,
          user_stats (
            xp,
            level,
            coins,
            ascenzy
          )
        `,
        )
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data as unknown as Profile);
      }

      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <div className={rajdhani.className}>Loading...</div>;

  if (!profile)
    return <div className={rajdhani.className}>No profile found</div>;

  const stats = profile.user_stats;

  return (
    <div className="min-h-[89vh] border-2 border-b bg-white text-black flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* NAME (Montserrat) */}
        <h1 className={`${montserrat.className} text-4xl font-bold`}>
          {profile.username}
        </h1>

        {/* DESCRIPTION (Rajdhani) */}
        <p className={`${rajdhani.className} mt-2 text-gray-600 text-lg`}>
          {profile.description || "No description provided"}
        </p>

        {/* STATS (Rajdhani) */}
        <div className={`${rajdhani.className} mt-8 space-y-3 text-lg`}>
          <div>
            🔥 Level: <span className="font-semibold">{stats?.level ?? 0}</span>
          </div>

          <div>
            ⚡ XP: <span className="font-semibold">{stats?.xp ?? 0}</span>
          </div>

          <div>
            💰 Coins: <span className="font-semibold">{stats?.coins ?? 0}</span>
          </div>

          <div>
            ✨ Ascenzy:{" "}
            <span className="font-semibold">{stats?.ascenzy ?? 0}</span>
          </div>

          <DeleteProfileButton/>
        </div>
      </div>
    </div>
  );
}
