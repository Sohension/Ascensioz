"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { getRank } from "@/lib/cache/rank";
import { Rajdhani } from "next/font/google";

/* ---------------- LOCAL FONTS ---------------- */

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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

const PROFILE_BANNER_STORAGE_KEY = "ascensioz.profile.banner";
const PROFILE_AVATAR_STORAGE_KEY = "ascensioz.profile.avatar";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBanner = window.localStorage.getItem(PROFILE_BANNER_STORAGE_KEY);
      const savedAvatar = window.localStorage.getItem(PROFILE_AVATAR_STORAGE_KEY);

      if (savedBanner) {
        setBannerPreview(savedBanner);
      }

      if (savedAvatar) {
        setAvatarPreview(savedAvatar);
      }
    }

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
  const rankIsRookie = String(rankLabel).toLowerCase() === "rookie";
  const rankBadgeClassName = rankIsRookie
    ? "inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-300/12 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-100 shadow-[inset_0_0_16px_rgba(251,191,36,0.26)]"
    : "inline-flex items-center gap-2 rounded-full border border-slate-500/80 bg-slate-800/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-100 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)]";

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;

      if (!dataUrl) return;

      setBannerPreview(dataUrl);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(PROFILE_BANNER_STORAGE_KEY, dataUrl);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;

      if (!dataUrl) return;

      setAvatarPreview(dataUrl);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(PROFILE_AVATAR_STORAGE_KEY, dataUrl);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-5xl w-full">
        <section className={`${rajdhani.className} overflow-hidden rounded-[30px] border border-slate-700/70 bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.30)]`}>
          <div className="relative">
            <div className="relative h-40 overflow-hidden sm:h-48">
              <div
                className="absolute inset-0 bg-[linear-gradient(120deg,rgba(16,185,129,0.92),rgba(2,6,23,0.99))]"
                style={bannerPreview ? { backgroundImage: `url(${bannerPreview})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
              />

              <div className="absolute right-4 top-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-white/50 bg-black/50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-sm transition hover:bg-black/80">
                  <span>+ Banner</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                </label>
              </div>
            </div>

            <div className="relative px-4 pb-8 sm:px-8">
              <div className="-mt-16 flex flex-wrap items-end gap-4 sm:-mt-20">
                <div className="relative">
                  <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full border-4 border-slate-900 bg-slate-950 text-4xl font-black text-white shadow-[0_0_0_1px_rgba(255,255,255,0.55)] sm:h-36 sm:w-36">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-emerald-300">A</span>
                    )}
                  </div>

                  <label className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-900 bg-white text-black shadow-lg transition hover:bg-emerald-300">
                    <span className="text-sm font-black">+</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>

                <div className="pb-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-4xl font-bold leading-none text-white sm:text-5xl">
                      {profile.username}
                    </h1>
                    <span className={rankBadgeClassName}>
                      <span className="h-2 w-2 rounded-full bg-current opacity-90" />
                      <span>{rankLabel}</span>
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-300 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-950">
                      OVR {stats?.ovr ?? 0}
                    </span>
                    <span className="rounded-full border border-slate-600 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-300">
                      Level {level}
                    </span>
                  </div>
                </div>

                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <button className="rounded-full border border-slate-600 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 transition hover:bg-slate-800">
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-10 border-b border-slate-700 pb-5">
                <div>
                  <span className="text-lg font-black text-white">{stats?.xp ?? 0}</span>
                  <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">XP</span>
                </div>
                <div>
                  <span className="text-lg font-black text-white">{stats?.coins ?? 0}</span>
                  <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">Coins</span>
                </div>
                <div>
                  <span className="text-lg font-black text-white">{stats?.ascenzy ?? 0}</span>
                  <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">Ascenzy</span>
                </div>
                <div>
                  <span className="text-lg font-black text-white">{progressPercent}%</span>
                  <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">Level Progress</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[minmax(300px,0.88fr)_minmax(340px,1fr)]">
                <section className="rounded-[24px] border border-slate-700 bg-slate-950/40 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
                        Bio
                      </p>
                    </div>
                    <span className={rankBadgeClassName}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-90" />
                      <span>{rankLabel}</span>
                    </span>
                  </div>

                  <p className="mt-4 text-lg leading-relaxed text-slate-100">
                    {profile.description || "No description provided"}
                  </p>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                      <span>Progress to next level</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-emerald-300 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                      <span>{xpIntoLevel} XP</span>
                      <span>{nextLevelXP - currentLevelXP} XP</span>
                    </div>
                  </div>
                </section>

                <section className="rounded-[24px] border border-slate-700 bg-slate-950/50 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-300">
                      Skill Index
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Last Active {stats?.last_active ? new Date(stats.last_active).toLocaleDateString() : "Never"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      {label: "Speed", value: stats?.speed ?? 0},
                      {label: "Accuracy", value: stats?.accuracy ?? 0},
                      {label: "Logic", value: stats?.logical_thinking ?? 0},
                      {label: "Debug", value: stats?.debugging_ability ?? 0},
                      {label: "Quality", value: stats?.code_quality ?? 0},
                      {label: "XP", value: stats?.xp ?? 0},
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">
                            {item.label}
                          </span>
                          <span className="text-lg font-black text-white">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </section>
              </div>

              <div className="mt-6 border-t border-slate-700 pt-5">
                <div className="flex gap-4 text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                  <span className="border-b border-emerald-300 pb-2 text-emerald-300">Overview</span>
                  <span className="pb-2">Challenges</span>
                  <span className="pb-2">Achievements</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
