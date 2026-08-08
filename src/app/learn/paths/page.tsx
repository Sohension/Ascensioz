import Link from "next/link";
import BackgroundVideoTwo from "@/components/Video2";
import { Rajdhani, Montserrat } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Paths() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <BackgroundVideoTwo />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(250,204,21,0.24),transparent_24%),radial-gradient(circle_at_20%_92%,rgba(16,185,129,0.22),transparent_20%)]" />

      <section className="relative z-10 flex min-h-screen w-full items-center overflow-hidden">
        <div className="relative z-10 w-full px-6 py-28 sm:px-10 md:px-20 lg:px-28">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(640px,1.2fr)_minmax(280px,0.68fr)]">
            <div className="max-w-4xl rounded-[34px] border border-white/15 bg-black/30 p-8 backdrop-blur-md sm:p-10 lg:p-14">
              <div className="border-l-4 border-yellow-400 pl-5 sm:pl-7">
                <p className={`${rajdhani.className} mb-3 text-sm font-bold uppercase tracking-[0.24em] text-yellow-300`}>
                  Learning Paths
                </p>
                <h1
                  className={`${montserrat.className} text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl`}
                >
                  Enter the world of Python.
                </h1>

                <h2
                  className={`${rajdhani.className} mt-4 text-xl font-semibold leading-relaxed text-slate-200 sm:text-2xl md:text-3xl`}
                >
                  From your first line of code to advanced systems — learn, build,
                  and ascend.
                </h2>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="/pyron" className="inline-block">
                    <button
                      className={`${rajdhani.className} bg-yellow-400 px-6 py-4 font-bold text-slate-950 shadow-lg shadow-black/30 transition-colors hover:bg-yellow-300`}
                    >
                      Play now
                    </button>
                  </Link>

                  <span className="rounded-full border border-white/30 px-5 py-3 text-[10px] font-black uppercase tracking-[0.26em] text-slate-200 backdrop-blur-sm">
                    Track: Python Core
                  </span>
                </div>
              </div>
            </div>

            <aside className="rounded-[28px] border border-emerald-300/35 bg-slate-900/65 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                  Current route
                </span>
                <span className="rounded-full border border-white/20 px-3 py-1 text-[9px] font-black uppercase tracking-[0.24em] text-slate-300">
                  01 / 04
                </span>
              </div>

              <div className="mt-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-yellow-300/60 bg-yellow-300/12 text-yellow-300">
                    ⚡
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                      Foundation
                    </p>
                    <h3 className="mt-1 text-2xl font-black text-white">
                      Python Sprint
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Syntax Lab", status: "Active" },
                    { label: "Control Flow", status: "Unlocked" },
                    { label: "Data Structures", status: "Locked" },
                  ].map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/8 text-[11px] font-black text-slate-200">
                          {index + 1}
                        </span>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-300">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 md:px-20 lg:px-28">
        <div className="mx-auto max-w-6xl rounded-[34px] border border-white/12 bg-slate-900/60 p-7 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.38)]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-yellow-300">
                Ascension Academy
              </p>
              <h1
                className={`${montserrat.className} mt-2 text-3xl font-semibold text-white sm:text-4xl md:text-5xl`}
              >
                More paths
              </h1>
            </div>

            <span className="rounded-full border border-white/20 px-4 py-2 text-[9px] font-black uppercase tracking-[0.22em] text-slate-300">
              04 Modules
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Core Python", progress: "65%", tag: "Active" },
              { title: "Logic Systems", progress: "04%", tag: "Soon" },
              { title: "Algorithms", progress: "00%", tag: "Queued" },
              { title: "Projects", progress: "12%", tag: "Live" },
            ].map((item, index) => (
              <article key={item.title} className="group rounded-[24px] border border-white/12 bg-slate-950/40 p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/60 hover:bg-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/15 px-3 py-1 text-[8px] font-black uppercase tracking-[0.24em] text-slate-400">
                    {item.tag}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-7 text-2xl font-black text-white">
                  {item.title}
                </h3>

                <p className="mt-4 text-[11px] font-bold uppercase leading-6 tracking-[0.2em] text-slate-400">
                  Learn the operating loops behind productive code and build systems that scale.
                </p>

                <div className="mt-7">
                  <div className="mb-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.24em] text-slate-500">
                    <span>Progress</span>
                    <span>{item.progress}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-yellow-300" style={{ width: item.progress }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
