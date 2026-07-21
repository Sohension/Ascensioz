import Link from "next/link";
import { getCourses } from "@/lib/courses";
import { Montserrat, Rajdhani } from "next/font/google";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import BackButton from "@/components/big-components/BackBtn";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function PracticePage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 px-4 pb-10 pt-32 sm:px-6 sm:pt-36 md:px-8 md:pt-40 lg:px-10 lg:pt-44 lg:pb-14">
      <BackButton href="/dashboard"/>
      <div className="mx-auto py-4 mb-16 w-full max-w-7xl px-1 sm:mb-20 lg:mb-24">
        <h1
          className={`${montserrat.className} text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl`}
        >
          Practice <span className="text-blue-600">Arena</span>
        </h1>

        <p
          className={`${rajdhani.className} mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg md:text-xl`}
        >
          Strengthen your programming skills through interactive coding
          challenges. Complete missions, earn XP, and continue your Ascension.
        </p>
      </div>

      {/* Cards */}

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/practice/${course.name.toLowerCase()}`}
            className="group h-full"
          >
            <Card
              className="
                flex
                h-full
                flex-col
                cursor-pointer
                border
                border-slate-300
                bg-linear-to-br
                from-white
                via-slate-50
                to-slate-100
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-blue-400
                hover:shadow-2xl
              "
            >
              {/* Header */}

              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl shadow-sm sm:h-16 sm:w-16 sm:text-3xl">
                    🐍
                  </div>

                  <span
                    className={`${rajdhani.className}
                      rounded-full
                      bg-blue-100
                      px-3
                      py-1
                      text-[10px]
                      font-bold
                      tracking-wide
                      text-blue-700
                      sm:text-xs`}
                  >
                    BEGINNER
                  </span>
                </div>

                <CardTitle
                  className={`${montserrat.className}
                    mt-4
                    text-2xl
                    font-extrabold
                    text-black
                    transition-colors
                    duration-300
                    group-hover:text-blue-600
                    sm:text-3xl`}
                >
                  {course.name}
                </CardTitle>

                <CardDescription
                  className={`${rajdhani.className}
                    mt-2
                    text-base
                    leading-7
                    text-slate-600
                    sm:text-lg`}
                >
                  {course.description}
                </CardDescription>
              </CardHeader>

              {/* Content */}

              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                    <div className="text-xl font-bold text-blue-600 sm:text-2xl">
                      32
                    </div>

                    <div
                      className={`${rajdhani.className} mt-1 text-xs text-slate-600 sm:text-sm`}
                    >
                      Challenges
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                    <div className="text-xl font-bold text-blue-600 sm:text-2xl">
                      +250
                    </div>

                    <div
                      className={`${rajdhani.className} mt-1 text-xs text-slate-600 sm:text-sm`}
                    >
                      XP Reward
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Footer */}

              <CardFooter className="flex items-center justify-between pt-4">
                <span
                  className={`${rajdhani.className} text-lg font-semibold text-black sm:text-xl`}
                >
                  Enter Arena
                </span>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600
                    text-base
                    font-bold
                    text-white
                    transition-all
                    duration-300
                    group-hover:translate-x-1
                    group-hover:scale-110
                    sm:h-11
                    sm:w-11
                    sm:text-lg
                  "
                >
                  →
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
