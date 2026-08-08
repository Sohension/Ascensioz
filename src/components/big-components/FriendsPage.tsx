"use client";

import { useEffect, useMemo, useState } from "react";
import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

type Player = {
  id: string;
  username: string;
  avatar: string;
  online: boolean;
  followers: number;
  following?: boolean;
};

type ApiPlayerRow = {
  id: string;
  username: string;
  online?: boolean;
  followers?: number;
  following?: boolean;
  avatar?: string;
};

type FriendsApiSearchResponse = {
  users?: ApiPlayerRow[];
};

export default function FriendsPage() {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    refreshFollowing();
  }, []);

  const filteredPlayers = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return [];
    }

    return players.filter((player) => player.username.toLowerCase().includes(q));
  }, [players, query]);

  const refreshFollowing = async () => {
    try {
      const response = await fetch("/api/friends");

      if (!response.ok) return;

      const payload = await response.json();

      const ids = (payload.friendships ?? []).map((f: { friend_id: string }) => f.friend_id);

      setFollowingIds(ids);

      const followerCount = (payload.friendships ?? []).length;
      setFollowersCount(followerCount);
    } catch {
      setFollowingIds([]);
      setFollowersCount(0);
    }
  };

  const refreshSearch = async (nextQuery: string) => {
    const trimmed = nextQuery.trim();

    if (!trimmed) {
      setPlayers([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/friends?query=${encodeURIComponent(trimmed)}`);

      if (!response.ok) {
        setPlayers([]);
        return;
      }

      const payload: FriendsApiSearchResponse = await response.json();

      const list = (payload.users ?? []).map((player: ApiPlayerRow) => ({
        id: player.id,
        username: player.username,
        avatar: player.avatar ?? String(player.username).slice(0, 1).toUpperCase(),
        online: player.online ?? true,
        followers: player.followers ?? 0,
        following: player.following ?? false,
      }));

      setPlayers(list);
    } catch {
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (playerId: string) => {
    const isCurrentlyFollowing = followingIds.includes(playerId);

    try {
      if (isCurrentlyFollowing) {
        const response = await fetch("/api/friends", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetId: playerId }),
        });

        if (response.ok) {
          await refreshFollowing();
          await refreshSearch(query);
        } else {
          const payload = await response.json().catch(() => ({}));
          console.error("Unfollow failed", payload);
        }
      } else {
        const response = await fetch("/api/friends", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetId: playerId }),
        });

        if (response.ok) {
          await refreshFollowing();
          await refreshSearch(query);
        } else {
          const payload = await response.json().catch(() => ({}));
          console.error("Follow failed", payload);
        }
      }
    } catch (err) {
      console.error("Follow toggle failed", err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-4xl w-full">
        <section className={`${rajdhani.className} overflow-hidden rounded-[30px] border border-slate-700/70 bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.30)] p-6`}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-500">
                Network
              </div>
              <h1 className="mt-1 text-3xl font-black uppercase tracking-[0.12em] text-white">
                Friends
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full border border-slate-700 px-4 py-2 text-center">
                <div className="text-[9px] font-black uppercase tracking-[0.24em] text-slate-500">
                  Following
                </div>
                <div className="mt-1 text-lg font-black text-emerald-300">
                  {followingIds.length}
                </div>
              </div>

              <div className="rounded-full border border-slate-700 px-4 py-2 text-center">
                <div className="text-[9px] font-black uppercase tracking-[0.24em] text-slate-500">
                  Followers
                </div>
                <div className="mt-1 text-lg font-black text-white">
                  {followersCount}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-black uppercase tracking-[0.26em] text-slate-500">
              Friends Search
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(event) => {
                const nextValue = event.target.value;
                setQuery(nextValue);
                refreshSearch(nextValue);
              }}
              className="min-w-0 flex-1 rounded-full border border-slate-600 bg-slate-950 px-5 py-4 text-[11px] font-black uppercase tracking-[0.22em] text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-300"
              placeholder="Type a player name"
            />
          </div>

          {query.trim() && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                  Search Results
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500">
                  {loading ? "Searching..." : `${filteredPlayers.length} found`}
                </span>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-6 text-center text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                  Searching players...
                </div>
              ) : filteredPlayers.length > 0 ? (
                <div className="space-y-3">
                  {filteredPlayers.map((player) => {
                    const isFollowing = followingIds.includes(player.id);

                    return (
                      <div key={player.id} className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-full border border-slate-600 bg-slate-800 text-[11px] font-black text-white">
                            {player.avatar}
                          </span>

                          <div>
                            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-white">
                              {player.username}
                            </div>
                            <div className="mt-1 text-[8px] font-black uppercase tracking-[0.24em] text-slate-500">
                              {player.online ? "Online" : "Away"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500">
                            {player.followers} followers
                          </span>
                          <button
                            onClick={() => toggleFollow(player.id)}
                            className={`rounded-full px-4 py-2 text-[9px] font-black uppercase tracking-[0.24em] transition ${
                              isFollowing
                                ? "border border-emerald-300/70 bg-emerald-300 text-slate-950 hover:bg-emerald-200"
                                : "bg-white text-slate-950 hover:bg-slate-200"
                            }`}
                          >
                            {isFollowing ? "Following" : "Follow"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-600 px-4 py-6 text-center text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                  No players found
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
