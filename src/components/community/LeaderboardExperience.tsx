"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/client";
import { getRank } from "@/lib/cache/rank";

type StatsRecord = {
  xp?: number | null;
  level?: number | null;
  rank?: string | null;
};

type StatsRelation = StatsRecord | StatsRecord[] | null;

type LeaderboardPlayer = {
  id: string;
  username: string | null;
  xp: number;
  level: number;
  rank: string;
  hasStats: boolean;
};

type ProfileRow = {
  id: string;
  username: string | null;
  user_stats: StatsRelation;
};

function initials(username: string | null) {
  return (username || "?")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function normalizeStats(relation: StatsRelation) {
  const stats: StatsRecord | null = Array.isArray(relation)
    ? relation[0] ?? null
    : relation;

  const xp = stats?.xp ?? 0;

  return {
    xp,
    level: stats?.level ?? Math.max(1, Math.floor(xp / 250) + 1),
    rank: stats?.rank ?? getRank(xp),
    hasStats: stats !== null,
  };
}

function formatXp(xp: number) {
  return new Intl.NumberFormat("en-US").format(xp);
}

export default function LeaderboardExperience() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    const loadLeaderboard = async () => {
      setLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const loggedInUserId = sessionData.session?.user?.id ?? null;

      if (!active) return;

      setCurrentUserId(loggedInUserId);

      const { data, error: queryError } = await supabase
        .from("profiles")
        .select("id, username, user_stats(xp, level, rank)");

      if (!active) return;

      if (queryError) {
        setError("The rankings could not be loaded right now.");
        setLoading(false);
        return;
      }

      const rankedPlayers = ((data ?? []) as ProfileRow[])
        .map((profile) => {
          const stats = normalizeStats(profile.user_stats);
          return {
            id: profile.id,
            username: profile.username,
            xp: stats.xp,
            level: stats.level,
            rank: stats.rank,
            hasStats: stats.hasStats,
          };
        })
        .filter((player) => player.hasStats)
        .sort((first, second) => second.xp - first.xp);

      setPlayers(rankedPlayers);
      setLoading(false);
    };

    loadLeaderboard();

    return () => {
      active = false;
    };
  }, []);

  const podium = players.slice(0, 3);
  const remainingPlayers = players.slice(3);
  const totalXp = useMemo(
    () => players.reduce((total, player) => total + player.xp, 0),
    [players],
  );

  const currentUserRank = currentUserId
    ? players.findIndex((player) => player.id === currentUserId) + 1
    : 0;

  return (
    <main className="leaderboard-shell min-h-screen px-4 pb-16 pt-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="leaderboard-header flex flex-col justify-between gap-8 border-b pb-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="leaderboard-kicker">Community / Leaderboards</p>
            <h1 className="leaderboard-display mt-4 text-5xl font-semibold leading-none sm:text-7xl">
              Climb the XP ladder.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-muted)] sm:text-lg">
              Ranked by XP earned through practice, coding challenges, and momentum. Anyone can view the board, and the logged-in players are the ones being tracked in this leaderboard.
            </p>
          </div>

          <div className="leaderboard-total border-l-2 pl-5">
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Community XP
            </span>
            <strong className="mt-2 block text-3xl font-semibold text-[var(--color-text)]">
              {formatXp(totalXp)}
            </strong>
          </div>
        </header>

        {currentUserId && currentUserRank > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">Your place</p>
              <p className="mt-1 text-lg font-semibold text-[var(--color-text)]">
                #{currentUserRank} overall
              </p>
            </div>
            <Link
              href="/community"
              className="inline-flex items-center rounded-full border border-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-background)]"
            >
              Back to Community
            </Link>
          </div>
        )}

        {loading && (
          <div className="mt-12 grid gap-5 md:grid-cols-3" aria-label="Loading leaderboard">
            {[1, 2, 3].map((item) => (
              <div key={item} className="leaderboard-skeleton h-64 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="leaderboard-message mt-12 border p-8 text-center" role="alert">
            <p className="text-lg font-semibold text-[var(--color-text)]">Rankings unavailable</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{error}</p>
          </div>
        )}

        {!loading && !error && players.length === 0 && (
          <div className="leaderboard-message mt-12 border p-8 text-center">
            <p className="text-lg font-semibold text-[var(--color-text)]">No active challengers yet.</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Once a signed-in player earns XP, they will appear here instantly.</p>
          </div>
        )}

        {!loading && !error && players.length > 0 && (
          <>
            <section className="leaderboard-podium mt-12" aria-label="Top three players">
              {podium.map((player, index) => {
                const isCurrentUser = player.id === currentUserId;

                return (
                  <article
                    key={player.id}
                    className={`podium-card podium-rank-${index + 1} ${
                      isCurrentUser ? "ring-2 ring-[var(--color-primary)]" : ""
                    }`}
                  >
                    <div className="podium-medal" aria-hidden="true">
                      {index === 0 ? "01" : index === 1 ? "02" : "03"}
                    </div>
                    <div className="podium-avatar">{initials(player.username)}</div>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      {player.rank}
                    </p>
                    <h2 className="mt-2 truncate text-2xl font-semibold text-[var(--color-text)]">
                      {player.username || "Unnamed player"}
                    </h2>
                    <p className="mt-4 text-3xl font-semibold text-[var(--color-primary)]">
                      {formatXp(player.xp)} <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">XP</span>
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">Level {player.level}</p>
                    {isCurrentUser && (
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                        You
                      </p>
                    )}
                  </article>
                );
              })}
            </section>

            {remainingPlayers.length > 0 && (
              <section className="mt-16">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[var(--color-text)]">Every challenger</h2>
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">Rank / XP</span>
                </div>
                <div className="leaderboard-list overflow-hidden border">
                  {remainingPlayers.map((player, index) => {
                    const rank = index + 4;
                    const isCurrentUser = player.id === currentUserId;

                    return (
                      <article
                        key={player.id}
                        className={`leaderboard-row grid grid-cols-[3rem_2.75rem_1fr_auto] items-center gap-3 px-4 py-4 sm:grid-cols-[4rem_3.5rem_1fr_auto_auto] sm:gap-5 sm:px-6 ${
                          isCurrentUser ? "bg-[var(--color-surface-alt)]" : ""
                        }`}
                      >
                        <span className="text-sm font-semibold text-[var(--color-muted)]">#{rank}</span>
                        <span className="leaderboard-row-avatar">{initials(player.username)}</span>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-[var(--color-text)]">
                            {player.username || "Unnamed player"}
                            {isCurrentUser && <span className="ml-2 text-xs uppercase tracking-[0.14em] text-[var(--color-primary)]">You</span>}
                          </h3>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                            {player.rank} / Level {player.level}
                          </p>
                        </div>
                        <span className="hidden text-xs uppercase tracking-[0.14em] text-[var(--color-muted)] sm:block">XP</span>
                        <strong className="text-sm text-[var(--color-primary)]">{formatXp(player.xp)}</strong>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
