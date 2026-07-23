import { Montserrat, Rajdhani } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Leaderboard(){
  return(
    <main className={`${rajdhani.className} min-h-screen bg-slate-50 dark:bg-gray-900 px-4 pb-12 pt-24 sm:px-6 lg:px-8`}>
      <section className="mx-auto max-w-5xl border-t-4 border-yellow-400 pt-8">
        <p className="text-sm font-bold text-blue-700">COMMUNITY</p>
        <h1 className={`${montserrat.className} mt-2 text-4xl font-extrabold text-slate-950 sm:text-5xl`}>Leaderboard</h1>
        <p className="mt-3 max-w-xl text-lg text-slate-600">The next season is being prepared. Complete challenges to be ready when rankings go live.</p>
        <div className="mt-10 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-3">
          <div className="bg-white p-6"><p className={`${montserrat.className} text-3xl font-extrabold text-blue-600`}>01</p><p className="mt-2 font-semibold text-slate-900">Your rank</p><p className="mt-1 text-sm text-slate-500">Start a challenge to enter.</p></div>
          <div className="bg-white p-6"><p className={`${montserrat.className} text-3xl font-extrabold text-yellow-500`}>0</p><p className="mt-2 font-semibold text-slate-900">Weekly XP</p><p className="mt-1 text-sm text-slate-500">A fresh week, a fresh run.</p></div>
          <div className="bg-slate-950 p-6"><p className={`${montserrat.className} text-3xl font-extrabold text-yellow-400`}>Soon</p><p className="mt-2 font-semibold text-white">Season one</p><p className="mt-1 text-sm text-slate-400">Rankings are on their way.</p></div>
        </div>
      </section>
    </main>
  )
}
