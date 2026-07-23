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
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-slate-950">
        <BackgroundVideoTwo />

        <div className="relative z-10 w-full px-6 py-28 sm:px-10 md:px-20 lg:px-28">
          <div className="max-w-4xl border-l-4 border-yellow-400 pl-5 sm:pl-7">
            <p className={`${rajdhani.className} mb-3 text-sm font-bold text-yellow-300`}>LEARNING PATHS</p>
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

            <Link href="/pyron" className="inline-block">
              <button
                className={`${rajdhani.className} mt-7 bg-yellow-400 px-6 py-4 font-bold text-slate-950 shadow-lg shadow-black/30 transition-colors hover:bg-yellow-300`}
              >
                Play now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Other Courses Section */}
      <section className="bg-slate-50 dark:bg-gray-900 px-6 py-12 sm:px-10 sm:py-16 md:px-20 lg:px-28">
        <div className="mx-auto max-w-6xl border-t-4 border-blue-600 pt-7">
          <h1
            className={`${montserrat.className} text-3xl font-semibold text-slate-950 sm:text-4xl md:text-5xl`}
          >
            More paths
          </h1>

          <h2
            className={`${rajdhani.className} mt-3 text-lg text-slate-600 sm:text-xl`}
          >
            There are no other courses for now!
          </h2>
        </div>
      </section>
    </>
  );
}
