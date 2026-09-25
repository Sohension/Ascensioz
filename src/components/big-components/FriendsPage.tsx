"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Rajdhani } from "next/font/google";
import { createClient } from "@/lib/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/* ------------------------------ Types ------------------------------- */

type UserRow = {
  id: string;
  username: string;
  avatar: string;
  online: boolean;
  followers?: number;
  following?: boolean;
  last_message?: string;
  last_message_at?: string;
};

type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read?: boolean;
};

type ApiMessageRow = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
};

type FriendshipPayloadRow = {
  friend_id: string;
  profiles?:
    | {
        id?: string;
        username?: string;
      }
    | Array<{
        id?: string;
        username?: string;
      }>;
};

type SearchApiUser = {
  id: string;
  username: string;
  avatar?: string;
  online?: boolean;
  followers?: number;
  following?: boolean;
};

/* ------------------------------ Helpers ----------------------------- */

function avatarLetter(name: string) {
  return String(name || "?").slice(0, 1).toUpperCase();
}

function formatTime(iso: string | undefined | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

/* ------------------------------ Component --------------------------- */

export default function FriendsPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserRow[]>([]);
  const [searching, setSearching] = useState(false);
  const [conversations, setConversations] = useState<UserRow[]>([]);
  const [activeFriend, setActiveFriend] = useState<UserRow | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [mobilePane, setMobilePane] = useState<"list" | "chat">("list");

  const channelRef = useRef<RealtimeChannel | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabaseRef = useRef(createClient());

  const supabase = supabaseRef.current;

  /* ----------------------- Load current user ------------------------ */

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted && data.user) setCurrentUserId(data.user.id);
    });

    return () => {
      mounted = false;
    };
  }, [supabase]);

  /* ----------------------- Load conversations ----------------------- */

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/friends");
      if (!res.ok) return;

      const payload = await res.json();

      const list: UserRow[] = (
        (payload.friendships as FriendshipPayloadRow[]) ?? []
      )
        .map((f) => {
          const p = Array.isArray(f.profiles) ? f.profiles[0] : f.profiles;

          return {
            id: p?.id ?? f.friend_id,
            username: p?.username ?? "Unknown",
            avatar: avatarLetter(p?.username ?? "?"),
            online: true,
          };
        })
        .filter((u: UserRow) => u.id !== currentUserId);

      setConversations(list);

      const withPreviews = await Promise.all(
        list.map(async (u: UserRow) => {
          try {
            const mr = await fetch(`/api/friends/${u.id}`);
            if (!mr.ok) return u;

            const mj = await mr.json();

            const last = (mj.messages ?? []).slice(-1)[0] as
              | ApiMessageRow
              | undefined;

            return last
              ? {
                  ...u,
                  last_message: last.content,
                  last_message_at: last.created_at,
                }
              : u;
          } catch {
            return u;
          }
        }),
      );

      setConversations(withPreviews);
    } catch {
      /* ignore */
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) loadConversations();
  }, [currentUserId, loadConversations]);

  /* --------------------------- Search ------------------------------- */

  const runSearch = useCallback(
    async (q: string) => {
      const trimmed = q.trim();

      if (!trimmed) {
        setSearchResults([]);
        return;
      }

      try {
        setSearching(true);

        const res = await fetch(
          `/api/friends?query=${encodeURIComponent(trimmed)}`,
        );

        if (!res.ok) {
          setSearchResults([]);
          return;
        }

        const payload = await res.json();

        const list: UserRow[] = ((payload.users as SearchApiUser[]) ?? [])
          .filter((u) => u.id !== currentUserId)
          .map((u) => ({
            id: u.id,
            username: u.username,
            avatar: u.avatar ?? avatarLetter(u.username),
            online: u.online ?? true,
            followers: u.followers ?? 0,
            following: u.following ?? false,
          }));

        setSearchResults(list);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    },
    [currentUserId],
  );

  /* ----------------------- Load messages ---------------------------- */

  const loadMessages = useCallback(async (friendId: string) => {
    setLoadingMessages(true);
    setMessagesError(null);

    try {
      const res = await fetch(`/api/friends/${friendId}`);

      if (!res.ok) {
        const p = await res.json().catch(() => ({}));
        throw new Error(p.message ?? "Failed to load messages");
      }

      const payload = await res.json();

      setMessages((payload.messages ?? []) as Message[]);
    } catch (err) {
      setMessagesError(
        err instanceof Error ? err.message : "Failed to load messages",
      );
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  /* ----------------------- Select conversation ---------------------- */

  const openConversation = useCallback(
    async (friend: UserRow) => {
      setActiveFriend(friend);
      setMobilePane("chat");
      setMessages([]);
      await loadMessages(friend.id);
    },
    [loadMessages],
  );

  /* --------------------------- Realtime ----------------------------- */

  useEffect(() => {
    if (!activeFriend || !currentUserId) return;

    setRealtimeStatus("connecting");

    const channel = supabase
      .channel(`messages:${currentUserId}:${activeFriend.id}`, {
        config: { broadcast: { self: true } },
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${activeFriend.id}`,
        },
        (payload) => {
          const row = payload.new as ApiMessageRow;

          if (row.recipient_id !== currentUserId) return;

          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [...prev, row as Message];
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${currentUserId}`,
        },
        (payload) => {
          const row = payload.new as ApiMessageRow;

          if (row.recipient_id !== activeFriend.id) return;

          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [...prev, row as Message];
          });
        },
      )
      .subscribe((status) => {
        setRealtimeStatus(
          status === "SUBSCRIBED" ? "connected" : "disconnected",
        );
      });

    channelRef.current = channel;

    return () => {
      setRealtimeStatus("disconnected");
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [supabase, activeFriend, currentUserId]);

  /* --------------------------- Send message ------------------------- */

  const sendMessage = useCallback(async () => {
    const content = draft.trim();

    if (!content || !activeFriend || sending) return;

    setSending(true);

    try {
      const res = await fetch(`/api/friends/${activeFriend.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const p = await res.json().catch(() => ({}));
        throw new Error(p.message ?? "Failed to send");
      }

      setDraft("");
      await loadMessages(activeFriend.id);
    } catch (err) {
      setMessagesError(
        err instanceof Error ? err.message : "Failed to send message",
      );
    } finally {
      setSending(false);
    }
  }, [draft, activeFriend, sending, loadMessages]);

  /* --------------------------- Auto-scroll -------------------------- */

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, loadingMessages, activeFriend?.id]);

  /* --------------------------- Derived ------------------------------ */

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort((a, b) => {
        const at = a.last_message_at
          ? new Date(a.last_message_at).getTime()
          : 0;

        const bt = b.last_message_at
          ? new Date(b.last_message_at).getTime()
          : 0;

        return bt - at;
      }),
    [conversations],
  );

  const showSearchResults = query.trim().length > 0;

  /* --------------------------- Render -------------------------------- */

  return (
    <main
      className={`${rajdhani.className} min-h-[calc(100vh-5rem)] bg-[#06080D] px-4 py-6 text-slate-100 sm:px-6 lg:px-10 lg:py-8`}
    >
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[8%] h-72 w-72 rounded-full bg-emerald-400/[0.035] blur-[120px]" />
        <div className="absolute bottom-[5%] right-[8%] h-96 w-96 rounded-full bg-cyan-400/[0.025] blur-[140px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-6">
        {/* ================= PAGE HEADER ================= */}

        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-emerald-300/70" />

              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300/80">
                Social Network
              </span>
            </div>

            <h1 className="text-4xl font-black uppercase leading-none tracking-[0.08em] text-white sm:text-5xl lg:text-6xl">
              Friends
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
              Connect with your people, discover new players, and keep your
              conversations moving.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
              <div className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-600">
                Connections
              </div>

              <div className="mt-1 text-xl font-bold text-white">
                {conversations.length}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
              <div className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-600">
                Status
              </div>

              <div
                className={`mt-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] ${
                  realtimeStatus === "connected"
                    ? "text-emerald-300"
                    : realtimeStatus === "connecting"
                      ? "text-amber-300"
                      : "text-slate-500"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    realtimeStatus === "connected"
                      ? "bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.8)]"
                      : realtimeStatus === "connecting"
                        ? "bg-amber-300"
                        : "bg-slate-600"
                  }`}
                />

                {realtimeStatus === "connected"
                  ? "Live"
                  : realtimeStatus === "connecting"
                    ? "Connecting"
                    : "Offline"}
              </div>
            </div>
          </div>
        </header>

        {/* ================= MAIN FRIENDS AREA ================= */}

        <div
          className="grid min-h-[calc(100dvh-15rem)] w-full overflow-hidden rounded-[30px] border border-slate-800/90 bg-slate-950/70 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-xl lg:grid-cols-[390px_minmax(0,1fr)] lg:min-h-[680px]"
          style={{ height: "min(760px, calc(100dvh - 14rem))" }}
        >
          {/* ================= LEFT COLUMN ================= */}

          <aside
            className={`${
              mobilePane === "chat" ? "hidden" : "flex"
            } min-h-0 w-full flex-col border-r border-slate-800/80 bg-[#080B11]/95 lg:flex`}
          >
            {/* Sidebar heading */}
            <div className="shrink-0 border-b border-slate-800/80 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
                    Your network
                  </div>

                  <div className="mt-1 text-xl font-black uppercase tracking-[0.12em] text-white">
                    Messages
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-center">
                  <div className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-600">
                    Friends
                  </div>

                  <div className="text-sm font-bold text-emerald-300">
                    {conversations.length}
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                  ⌕
                </span>

                <input
                  value={query}
                  onChange={(e) => {
                    const v = e.target.value;
                    setQuery(v);
                    runSearch(v);
                  }}
                  placeholder="Search people..."
                  className="h-12 w-full rounded-2xl border border-slate-800 bg-[#05070B] pl-11 pr-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-300/60 focus:bg-slate-950"
                />
              </div>
            </div>

            {/* List */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
              {showSearchResults ? (
                <div>
                  <div className="mb-4 flex items-center justify-between px-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
                      Search results
                    </span>

                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
                      {searching
                        ? "Searching..."
                        : `${searchResults.length} found`}
                    </span>
                  </div>

                  {searching ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-12 text-center">
                      <div className="mx-auto mb-4 h-8 w-8 animate-pulse rounded-full border border-emerald-300/50 bg-emerald-300/10" />

                      <div className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
                        Searching players...
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-3">
                      {searchResults.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => openConversation(u)}
                          className="group flex w-full items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300/30 hover:bg-slate-900"
                        >
                          <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-slate-700 bg-slate-800 text-sm font-black text-white">
                            {u.avatar}

                            {u.online && (
                              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-[3px] border-slate-900 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.6)]" />
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12px] font-black uppercase tracking-[0.14em] text-white">
                              {u.username}
                            </span>

                            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                              {u.followers ?? 0} followers
                            </span>
                          </span>

                          <span className="rounded-xl bg-emerald-300 px-3 py-2 text-[8px] font-black uppercase tracking-[0.15em] text-slate-950 transition group-hover:bg-emerald-200">
                            Message
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-800 px-5 py-14 text-center">
                      <div className="mb-3 text-2xl opacity-50">⌕</div>

                      <div className="text-[9px] font-black uppercase tracking-[0.24em] text-slate-500">
                        No players found
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="mb-4 px-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
                      Recent conversations
                    </span>
                  </div>

                  {sortedConversations.length === 0 ? (
                    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 px-6 text-center">
                      <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-slate-800 bg-slate-900 text-2xl">
                        +
                      </div>

                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                        Your network is quiet
                      </div>

                      <p className="mt-2 max-w-[230px] text-[9px] leading-relaxed text-slate-600">
                        Search for a friend above and start your first
                        conversation.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sortedConversations.map((u) => {
                        const isActive = activeFriend?.id === u.id;

                        return (
                          <button
                            key={u.id}
                            onClick={() => openConversation(u)}
                            className={`group relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 ${
                              isActive
                                ? "border-emerald-300/30 bg-emerald-300/[0.07] shadow-[inset_3px_0_0_#6ee7b7]"
                                : "border-transparent bg-transparent hover:border-slate-800 hover:bg-slate-900/70"
                            }`}
                          >
                            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-slate-700 bg-slate-800 text-sm font-black text-white shadow-lg">
                              {u.avatar}

                              {u.online && (
                                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-[3px] border-slate-950 bg-emerald-400" />
                              )}
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="flex items-center justify-between gap-3">
                                <span className="block truncate text-[12px] font-black uppercase tracking-[0.14em] text-white">
                                  {u.username}
                                </span>

                                {u.last_message_at && (
                                  <span className="shrink-0 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-600">
                                    {formatTime(u.last_message_at)}
                                  </span>
                                )}
                              </span>

                              <span className="mt-1 block truncate text-[10px] text-slate-500">
                                {u.last_message || "Start a conversation"}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* ================= RIGHT CHAT ================= */}

          <section
            className={`${
              mobilePane === "list" ? "hidden" : "flex"
            } min-h-0 min-w-0 flex-1 flex-col bg-[#070A0F] lg:flex`}
          >
            {!activeFriend ? (
              /* ================= EMPTY CHAT ================= */

              <div className="relative flex flex-1 items-center justify-center overflow-hidden">
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/[0.025] blur-[100px]" />

                <div className="relative mx-auto max-w-lg px-8 text-center">
                  <div className="mx-auto mb-8 grid h-24 w-24 place-items-center rounded-[30px] border border-slate-800 bg-slate-900/80 text-3xl shadow-[0_20px_60px_rgba(0,0,0,.3)]">
                    💬
                  </div>

                  <div className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300/70">
                    Private conversations
                  </div>

                  <h2 className="text-3xl font-black uppercase tracking-[0.08em] text-white">
                    Choose someone
                  </h2>

                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-500">
                    Select a friend from your network to continue a
                    conversation, or search for someone new using the panel on
                    the left.
                  </p>

                  <div className="mt-8 flex justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    <span className="h-1.5 w-8 rounded-full bg-slate-800" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* ================= CHAT HEADER ================= */}

                <div className="flex shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#090C12]/90 px-5 py-5 backdrop-blur-xl sm:px-7">
                  <div className="flex min-w-0 items-center gap-4">
                    <button
                      onClick={() => setMobilePane("list")}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white lg:hidden"
                    >
                      ←
                    </button>

                    <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-slate-700 bg-slate-800 text-base font-black text-white shadow-lg">
                      {activeFriend.avatar}

                      {activeFriend.online && (
                        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-slate-950 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,.65)]" />
                      )}
                    </span>

                    <div className="min-w-0">
                      <div className="truncate text-lg font-black uppercase tracking-[0.12em] text-white">
                        {activeFriend.username}
                      </div>

                      <div
                        className={`mt-1 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] ${
                          activeFriend.online
                            ? "text-emerald-300"
                            : "text-slate-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            activeFriend.online
                              ? "bg-emerald-300"
                              : "bg-slate-600"
                          }`}
                        />

                        {activeFriend.online ? "Online now" : "Offline"}
                      </div>
                    </div>
                  </div>

                  <div className="hidden items-center gap-2 sm:flex">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
                      Private chat
                    </div>

                    <div className="rounded-xl border border-emerald-300/10 bg-emerald-300/[0.04] px-3 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-emerald-300/70">
                      Encrypted
                    </div>
                  </div>
                </div>

                {/* ================= MESSAGES ================= */}

                <div
                  ref={scrollRef}
                  className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:px-12"
                >
                  <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col justify-end">
                    {loadingMessages ? (
                      <div className="flex flex-1 items-center justify-center py-20">
                        <div className="text-center">
                          <div className="mx-auto mb-4 h-9 w-9 animate-pulse rounded-full border border-emerald-300/40 bg-emerald-300/10" />

                          <div className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-600">
                            Loading conversation...
                          </div>
                        </div>
                      </div>
                    ) : messagesError ? (
                      <div className="my-auto rounded-2xl border border-red-400/20 bg-red-400/[0.05] px-5 py-8 text-center">
                        <div className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-red-300">
                          Something went wrong
                        </div>

                        <div className="text-xs text-red-300/60">
                          {messagesError}
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="my-auto py-20 text-center">
                        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-slate-800 bg-slate-900 text-xl">
                          👋
                        </div>

                        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                          No messages yet
                        </div>

                        <p className="mt-2 text-xs text-slate-700">
                          Start the conversation with {activeFriend.username}.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {messages.map((m, index) => {
                          const mine = m.sender_id === currentUserId;

                          const previous = messages[index - 1];

                          const sameSender =
                            previous?.sender_id === m.sender_id;

                          return (
                            <div
                              key={m.id}
                              className={`flex ${
                                mine ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`flex max-w-[82%] items-end gap-3 sm:max-w-[68%] ${
                                  mine ? "flex-row-reverse" : "flex-row"
                                }`}
                              >
                                {!sameSender ? (
                                  <div className="hidden h-8 w-8 shrink-0 place-items-center rounded-xl border border-slate-800 bg-slate-900 text-[9px] font-black text-slate-400 sm:grid">
                                    {mine
                                      ? "Y"
                                      : avatarLetter(activeFriend.username)}
                                  </div>
                                ) : (
                                  <div className="hidden w-8 shrink-0 sm:block" />
                                )}

                                <div
                                  className={`rounded-2xl px-5 py-3.5 shadow-lg ${
                                    mine
                                      ? "rounded-br-md bg-emerald-300 text-slate-950 shadow-[0_10px_30px_rgba(110,231,183,.08)]"
                                      : "rounded-bl-md border border-slate-800 bg-slate-900 text-slate-100"
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                    {m.content}
                                  </p>

                                  <div
                                    className={`mt-2 text-[8px] font-black uppercase tracking-[0.14em] ${
                                      mine
                                        ? "text-slate-700"
                                        : "text-slate-600"
                                    }`}
                                  >
                                    {formatTime(m.created_at)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* ================= MESSAGE INPUT ================= */}

                <div className="shrink-0 border-t border-slate-800/80 bg-[#090C12]/95 px-5 py-5 sm:px-8">
                  <div className="mx-auto flex w-full max-w-4xl items-end gap-3">
                    <div className="relative min-w-0 flex-1">
                      <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder={`Message ${activeFriend.username}...`}
                        className="h-14 w-full rounded-2xl border border-slate-800 bg-[#05070B] px-5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-300/50 focus:bg-slate-950"
                      />
                    </div>

                    <button
                      onClick={sendMessage}
                      disabled={sending || !draft.trim()}
                      className="flex h-14 shrink-0 items-center gap-2 rounded-2xl bg-emerald-300 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 shadow-[0_10px_30px_rgba(110,231,183,.12)] transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {sending ? "Sending..." : "Send"}
                      {!sending && <span className="text-sm">↗</span>}
                    </button>
                  </div>

                  <div className="mx-auto mt-3 flex w-full max-w-4xl justify-between px-1">
                    <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-700">
                      Press Enter to send
                    </span>

                    <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-700">
                      Private conversation
                    </span>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
