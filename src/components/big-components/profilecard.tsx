"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Montserrat, Rajdhani } from "next/font/google";
import DeleteProfileButton from "../DeleteProfileButton";

/* ---------------- LOCAL FONTS ---------------- */

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
  rank: string;
  coins: number;
  ascenzy: number;

  ovr: number;

  speed: number;
  accuracy: number;
  code_quality: number;
  logical_thinking: number;
  debugging_ability: number;

  created_at: string;
  last_active: string;
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
      try {
        console.log("========== PROFILE LOAD START ==========");

        const supabase = createClient();

        console.log("Supabase client created");

        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        console.log("AUTH DATA:", authData);
        console.log("AUTH ERROR:", authError);

        const user = authData?.user;

        console.log("USER:", user);

        if (!user) {
          console.log("❌ USER IS NULL");
          setLoading(false);
          return;
        }

        console.log("✅ USER FOUND:", user.id);

        const { data, error } = await supabase
          .from("profiles")
          .select(
            `
          id,
          username,
          description,
          user_stats (
            *
          )
        `,
          )
          .eq("id", user.id)
          .single();

        console.log("PROFILE DATA:", data);
        console.log("PROFILE ERROR:", error);

        if (error) {
          console.log("❌ PROFILE QUERY FAILED");
          console.log(error);
        }

        if (!data) {
          console.log("❌ PROFILE DATA IS NULL");
        }

        if (data) {
          console.log("✅ PROFILE FOUND");
          setProfile(data as unknown as Profile);
        }

        console.log("========== PROFILE LOAD END ==========");
      } catch (err) {
        console.log("🔥 CATCH BLOCK HIT");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className={`${rajdhani.className} p-6`}>Loading...</div>;
  }

  if (!profile) {
    return <div className={`${rajdhani.className} p-6`}>No profile found</div>;
  }

  const stats = profile.user_stats;

  return (
    <div className="min-h-[89vh] border-2 border-b bg-white text-black flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Username */}
        <h1 className={`${montserrat.className} text-4xl font-bold`}>
          {profile.username}
        </h1>

        {/* Description */}
        <p className={`${rajdhani.className} mt-2 text-gray-600 text-lg`}>
          {profile.description || "No description provided"}
        </p>

        {/* Stats */}
        <div className={`${rajdhani.className} mt-8 space-y-3 text-lg`}>
          <div>
            🏆 OVR: <span className="font-semibold">{stats?.ovr ?? 0}</span>
          </div>

          <div>
            🔥 Level: <span className="font-semibold">{stats?.level ?? 0}</span>
          </div>

          <div>
            ⚡ XP: <span className="font-semibold">{stats?.xp ?? 0}</span>
          </div>

          <div>
            🪙 Coins: <span className="font-semibold">{stats?.coins ?? 0}</span>
          </div>

          <div>
            💎 Ascenzy:{" "}
            <span className="font-semibold">{stats?.ascenzy ?? 0}</span>
          </div>

          <div>
            🎖 Rank:{" "}
            <span className="font-semibold">{stats?.rank ?? "Rookie"}</span>
          </div>

          <hr className="my-4" />

          <h2 className="text-2xl font-bold">Python Stats</h2>

          <div>
            ⚡ Speed: <span className="font-semibold">{stats?.speed ?? 0}</span>
          </div>

          <div>
            🎯 Accuracy:{" "}
            <span className="font-semibold">{stats?.accuracy ?? 0}</span>
          </div>

          <div>
            🧠 Logical Thinking:{" "}
            <span className="font-semibold">
              {stats?.logical_thinking ?? 0}
            </span>
          </div>

          <div>
            🧩 Debugging Ability:{" "}
            <span className="font-semibold">
              {stats?.debugging_ability ?? 0}
            </span>
          </div>

          <div>
            ✨ Code Quality:{" "}
            <span className="font-semibold">{stats?.code_quality ?? 0}</span>
          </div>

          <hr className="my-4" />

          <div>
            🕒 Last Active:{" "}
            <span className="font-semibold">
              {stats?.last_active
                ? new Date(stats.last_active).toLocaleString()
                : "Never"}
            </span>
          </div>

          <DeleteProfileButton />
        </div>
      </div>
    </div>
  );
}
