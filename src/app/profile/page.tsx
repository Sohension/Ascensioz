import ProfileCard from "@/components/big-components/profilecard"

export default function Profile() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <ProfileCard />
      </div>
    </main>
  )
}
