"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { getRank } from "@/lib/cache/rank";
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
  const xp = stats?.xp ?? 0;
  const level = Math.max(1, stats?.level ?? Math.floor(xp / 250) + 1);
  const currentLevelXP = Math.max(0, (level - 1) * 250);
  const nextLevelXP = level * 250;
  const xpIntoLevel = Math.max(0, xp - currentLevelXP);
  const progressPercent = Math.min(
    Math.round(
      (xpIntoLevel / Math.max(1, nextLevelXP - currentLevelXP)) * 100,
    ),
    100,
  );
  const rankLabel = stats?.rank ?? getRank(xp);

  return (
    <div className="min-h-[89vh] border-2 border-b bg-white text-black flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-cyan-300">
                Battle Profile
              </p>
              <h1 className={`${montserrat.className} mt-2 text-4xl font-bold text-white`}>
                {profile.username}
              </h1>
            </div>
            <div className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">
              {rankLabel}
            </div>
          </div>

          <p className={`${rajdhani.className} mt-3 text-lg text-slate-300`}>
            {profile.description || "No description provided"}
          </p>

          <div className="mt-6 rounded-3xl border border-cyan-400/30 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between gap-3 text-sm text-slate-200">
              <span className="font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Level {level}
              </span>
              <span className="font-semibold text-violet-200">
                {xpIntoLevel} / {nextLevelXP - currentLevelXP} XP
              </span>
            </div>

            <div className="relative mt-4 h-5 overflow-hidden rounded-full border border-cyan-500/40 bg-slate-800">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_20px_rgba(96,165,250,0.8)] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-50">
                <span>{profile.username}</span>
                <span>{progressPercent}%</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-400">
              <span>Next rank unlocks at {nextLevelXP} XP</span>
              <span>{stats?.ovr ?? 0} OVR</span>
            </div>
          </div>

          <div className={`${rajdhani.className} mt-8 space-y-3 text-lg text-slate-900`}>
            <div>
              🏆 OVR: <span className="font-semibold">{stats?.ovr ?? 0}</span>
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
    </div>
  );
}
