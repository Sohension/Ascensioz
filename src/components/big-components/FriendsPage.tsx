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
      const list: UserRow[] = (payload.friendships as FriendshipPayloadRow[] ?? [])
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

      // Load last-message preview for each conversation
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
        const res = await fetch(`/api/friends?query=${encodeURIComponent(trimmed)}`);
        if (!res.ok) {
          setSearchResults([]);
          return;
        }
const payload = await res.json();
        const list: UserRow[] = (payload.users as SearchApiUser[] ?? [])
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

  /* ----------------------- Load messages for a friend -------------- */
  const loadMessages = useCallback(
    async (friendId: string) => {
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
    },
    [],
  );

  /* ----------------------- Select a conversation -------------------- */
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
  // Subscribe to live messages for the active conversation.
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
        const at = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
        const bt = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
        return bt - at;
      }),
    [conversations],
  );

  const showSearchResults = query.trim().length > 0;

  /* --------------------------- Render -------------------------------- */
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 px-2 py-4 text-slate-100 sm:px-4 sm:py-6">
      <div
        className={`${rajdhani.className} mx-auto flex max-w-6xl w-full overflow-hidden rounded-[24px] border border-slate-700/70 bg-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.30)]`}
        style={{ height: "calc(100vh - 8rem)" }}
      >
        {/* ================= LEFT COLUMN ================= */}
        <aside
          className={`${mobilePane === "chat" ? "hidden" : "flex"} w-full flex-col border-r border-slate-700/70 md:flex md:w-80 md:shrink-0`}
        >
          {/* Header + search */}
          <div className="shrink-0 border-b border-slate-700/70 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.26em] text-slate-500">
                  Network
                </div>
                <div className="text-xl font-black uppercase tracking-[0.12em] text-white">
                  Friends
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] ${
                  realtimeStatus === "connected"
                    ? "bg-emerald-300/15 text-emerald-300"
                    : realtimeStatus === "connecting"
                      ? "bg-amber-300/15 text-amber-300"
                      : "bg-red-400/15 text-red-300"
                }`}
              >
                {realtimeStatus === "connected"
                  ? "Live"
                  : realtimeStatus === "connecting"
                    ? "Connecting"
                    : "Offline"}
              </span>
            </div>

            <input
              value={query}
              onChange={(e) => {
                const v = e.target.value;
                setQuery(v);
                runSearch(v);
              }}
              placeholder="Search friends…"
              className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-300"
            />
          </div>

          {/* Scrollable list area */}
          <div className="flex-1 overflow-y-auto">
            {showSearchResults ? (
              // ---- Search results ----
              <div className="p-2">
                <div className="mb-2 flex items-center justify-between px-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.24em] text-slate-500">
                    Search Results
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                    {searching ? "Searching…" : `${searchResults.length} found`}
                  </span>
                </div>

                {searching ? (
                  <div className="rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-6 text-center text-[9px] font-black uppercase tracking-[0.24em] text-slate-500">
                    Searching players…
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1.5">
                    {searchResults.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => openConversation(u)}
                        className="flex w-full items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-left transition hover:border-emerald-300/60 hover:bg-slate-950"
                      >
                        <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-600 bg-slate-800 text-[11px] font-black text-white">
                          {u.avatar}
                          {u.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[11px] font-black uppercase tracking-[0.18em] text-white">
                            {u.username}
                          </span>
                          <span className="block text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                            {u.followers ?? 0} followers
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-emerald-300 px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-slate-950">
                          Message
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-600 px-4 py-6 text-center text-[9px] font-black uppercase tracking-[0.24em] text-slate-500">
                    No players found
                  </div>
                )}
              </div>
            ) : (
              // ---- Conversation list ----
              <div className="p-2">
                <div className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.24em] text-slate-500">
                  Conversations
                </div>

                {sortedConversations.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-600 px-4 py-8 text-center text-[9px] font-black uppercase tracking-[0.24em] text-slate-500">
                    No conversations yet.
                    <br />
                    Search for a friend to start chatting.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {sortedConversations.map((u) => {
                      const isActive = activeFriend?.id === u.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => openConversation(u)}
                          className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                            isActive
                              ? "border-emerald-300/70 bg-emerald-300/10"
                              : "border-slate-700 bg-slate-950/60 hover:border-slate-500"
                          }`}
                        >
                          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-600 bg-slate-800 text-[11px] font-black text-white">
                            {u.avatar}
                            {u.online && (
                              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[11px] font-black uppercase tracking-[0.18em] text-white">
                              {u.username}
                            </span>
                            <span className="block truncate text-[9px] text-slate-400">
                              {u.last_message || "No messages yet"}
                            </span>
                          </span>
                          {u.last_message_at && (
                            <span className="shrink-0 text-[8px] font-black uppercase tracking-[0.16em] text-slate-500">
                              {formatTime(u.last_message_at)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* ================= RIGHT COLUMN (CHAT) ================= */}
        <section
          className={`${mobilePane === "list" ? "hidden" : "flex"} min-w-0 flex-1 flex-col md:flex`}
        >
          {!activeFriend ? (
            // ---- Empty state ----
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-slate-600 bg-slate-950 text-2xl">
                💬
              </div>
              <div className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
                Select a conversation
              </div>
              <p className="max-w-xs text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                Choose a friend from the list or search for someone to start a
                private chat.
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex shrink-0 items-center gap-3 border-b border-slate-700/70 px-3 py-2.5">
                <button
                  onClick={() => setMobilePane("list")}
                  className="rounded-lg border border-slate-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-300 transition hover:bg-slate-800 md:hidden"
                >
                  ← Back
                </button>
                <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-500 bg-slate-800 text-[13px] font-black text-white">
                  {activeFriend.avatar}
                  {activeFriend.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-black uppercase tracking-[0.16em] text-white">
                    {activeFriend.username}
                  </div>
                  <div
                    className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                      activeFriend.online ? "text-emerald-300" : "text-slate-500"
                    }`}
                  >
                    {activeFriend.online ? "Online" : "Offline"}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 space-y-2 overflow-y-auto p-3"
              >
                {loadingMessages ? (
                  <div className="py-10 text-center text-[9px] font-black uppercase tracking-[0.24em] text-slate-500">
                    Loading messages…
                  </div>
                ) : messagesError ? (
                  <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                    {messagesError}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-10 text-center text-[9px] font-black uppercase tracking-[0.24em] text-slate-500">
                    No messages yet. Say hello! 👋
                  </div>
                ) : (
                  messages.map((m) => {
                    const mine = m.sender_id === currentUserId;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                            mine
                              ? "rounded-br-sm bg-emerald-300 text-slate-950"
                              : "rounded-bl-sm border border-slate-600 bg-slate-800 text-slate-100"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm leading-snug">
                            {m.content}
                          </p>
                          <div
                            className={`mt-0.5 text-right text-[8px] font-black uppercase tracking-[0.14em] ${
                              mine ? "text-slate-700" : "text-slate-500"
                            }`}
                          >
                            {formatTime(m.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input */}
              <div className="flex shrink-0 items-center gap-2 border-t border-slate-700/70 p-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={`Message ${activeFriend.username}…`}
                  className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-300"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !draft.trim()}
                  className="shrink-0 rounded-xl bg-emerald-300 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sending ? "…" : "Send"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
