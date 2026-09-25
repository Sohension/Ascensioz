import ProfileCard from "@/components/big-components/profilecard"

export default function Profile() {
  return (
    <main className="page-shell px-4 py-8 text-[var(--color-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <p className="section-kicker">Profile</p>
          <h1 className="section-title mt-3">Your progression hub</h1>
        </header>
        <div className="soft-card p-2 sm:p-3">
          <ProfileCard />
        </div>
      </div>
    </main>
  )
}
