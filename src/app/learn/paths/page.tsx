import Link from "next/link";
import BackgroundVideoTwo from "@/components/Video2";
import AfterAuthnav from "@/app/AfterAuthnav";
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
      <AfterAuthnav />

      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        <BackgroundVideoTwo />

        <div className="relative z-10 h-full px-6 sm:px-10 md:px-20 lg:px-28 flex items-center">
          <div className="max-w-4xl space-y-4 sm:space-y-6">
            <h1
              className={`${montserrat.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight`}
            >
              Enter the world of Python.
            </h1>

            <h2
              className={`${rajdhani.className} text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-relaxed`}
            >
              From your first line of code to advanced systems — learn, build,
              and ascend.
            </h2>

            <Link href="/pyron" className="inline-block">
              <button
                className={`${rajdhani.className} rounded px-6 py-4 sm:py-4 font-semibold bg-white text-black hover:bg-gray-100 transition-colors`}
              >
                Play now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Other Courses Section */}
      <section className="px-6 sm:px-10 py-12 sm:py-16 md:px-20 lg:px-28">
        <div className="space-y-3">
          <h1
            className={`${montserrat.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-blue-900`}
          >
            Other Courses :-
          </h1>

          <h2
            className={`${rajdhani.className} text-lg sm:text-xl md:text-2xl text-blue-900`}
          >
            There are no other courses for now!
          </h2>
        </div>
      </section>
    </>
  );
}
