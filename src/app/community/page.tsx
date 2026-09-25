import Link from "next/link";

export default function CommunityPage() {
  return (
    <main className="page-shell px-4 py-10 text-[var(--color-text)] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="section-kicker">Community</p>
          <h1 className="section-title mt-4">Your progress, shared with the crew.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
            Explore the latest updates from the community and check who is climbing the XP leaderboard right now.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Link href="/community/blog" className="soft-card group p-6 transition-transform duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <p className="section-kicker">Read</p>
              <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">Blog</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--color-text)]">Community blog</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Updates, lessons, wins, and the stories behind the learning loop.
            </p>
          </Link>

          <Link href="/leaderboards" className="soft-card group p-6 transition-transform duration-200 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <p className="section-kicker">Ranked</p>
              <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">Live</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-[var(--color-text)]">XP leaderboard</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Logged-in players are ranked by XP, and anyone can still see the board.
            </p>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Members", "2.4k"],
            ["Active today", "410"],
            ["Avg. XP", "1,280"],
          ].map(([label, value]) => (
            <div key={label} className="glass-panel p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">{label}</p>
              <p className="mt-3 text-3xl font-bold text-[var(--color-text)]">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
