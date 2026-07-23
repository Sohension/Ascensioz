import ProfileCard from "@/components/big-components/profilecard"

export default function Profile(){
    return(
        <main className="min-h-screen bg-slate-50 dark:bg-gray-900 px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl border-t-4 border-yellow-400 pt-8">
            <ProfileCard/>
          </div>
        </main>
    )
}
