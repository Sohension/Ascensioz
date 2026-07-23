import Link from "next/link";
import { ArrowRight, Code2, Target, Trophy } from "lucide-react";
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
    <main className="min-h-screen bg-slate-50 dark:bg-gray-900 px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pb-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 sm:mb-10">
          <BackButton href="/dashboard" label="Dashboard" />
        </div>

        <section className="border-b border-slate-200 pb-8 sm:flex sm:items-end sm:justify-between sm:gap-10 sm:pb-10">
          <div className="max-w-2xl">
            <p className={`${rajdhani.className} mb-2 text-sm font-bold text-blue-700`}>
              SKILL BUILDER
            </p>
            <h1 className={`${montserrat.className} text-4xl font-extrabold text-slate-950 dark:text-white sm:text-5xl`}>
              Practice <span className="text-blue-600">Arena</span>
            </h1>
            <p className={`${rajdhani.className} mt-3 max-w-xl text-lg leading-7 text-slate-600 dark:text-slate-300 sm:text-xl`}>
              Pick a path, build momentum, and earn XP through focused coding challenges.
            </p>
          </div>

          <div className="mt-6 flex shrink-0 items-center gap-3 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900 dark:border-amber-600 px-4 py-3 sm:mt-0">
            <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <div>
              <p className={`${rajdhani.className} text-sm font-bold text-slate-900 dark:text-white`}>Learn by doing</p>
              <p className={`${rajdhani.className} text-sm text-slate-600 dark:text-slate-300`}>Every challenge moves you forward.</p>
            </div>
          </div>
        </section>

        <section className="pt-8 sm:pt-10" aria-labelledby="course-paths">
          <div className="mb-5 flex items-center justify-between">
            <h2 id="course-paths" className={`${montserrat.className} text-xl font-bold text-slate-950 dark:text-white sm:text-2xl`}>
              Choose your path
            </h2>
            <span className={`${rajdhani.className} text-sm font-semibold text-slate-500 dark:text-slate-400`}>
              {courses.length} available
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/practice/${course.name.toLowerCase()}`}
            className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <Card
              className="
                flex
                h-full
                flex-col
                cursor-pointer
                rounded-lg
                border-slate-200
                bg-white
                dark:bg-gray-800
                dark:border-gray-700
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-300
                hover:shadow-lg
              "
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    <Code2 className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <span
                    className={`${rajdhani.className}
                      rounded-md
                      border
                      border-blue-100
                      dark:border-blue-800
                      bg-blue-50
                      dark:bg-blue-900
                      px-3
                      py-1
                      text-xs
                      font-bold
                      tracking-wide
                      text-blue-700
                      dark:text-blue-300
                    `}
                  >
                    BEGINNER
                  </span>
                </div>

                <CardTitle
                  className={`${montserrat.className}
                    mt-5
                    text-xl
                    font-extrabold
                    text-slate-950
                    dark:text-white
                    transition-colors
                    duration-300
                    group-hover:text-blue-600
                    sm:text-2xl`}
                >
                  {course.name}
                </CardTitle>

                <CardDescription
                  className={`${rajdhani.className}
                    mt-2
                    text-base
                    leading-6
                    text-slate-600
                    dark:text-slate-300
                  `}
                >
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 pt-1">
                <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-gray-700 border-y border-slate-100 dark:border-gray-700 bg-slate-50 dark:bg-gray-900">
                  <div className="p-3.5">
                    <div className="text-xl font-bold text-slate-950 dark:text-white">
                      32
                    </div>

                    <div
                      className={`${rajdhani.className} mt-1 text-sm text-slate-500 dark:text-slate-400`}
                    >
                      Challenges
                    </div>
                  </div>

                  <div className="p-3.5">
                    <div className="text-xl font-bold text-slate-950 dark:text-white">
                      +250
                    </div>

                    <div
                      className={`${rajdhani.className} mt-1 text-sm text-slate-500 dark:text-slate-400`}
                    >
                      XP Reward
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between pt-5">
                <span
                  className={`${rajdhani.className} flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white`}
                >
                  <Target className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  Start practicing
                </span>

                <ArrowRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-600" aria-hidden="true" />
              </CardFooter>
            </Card>
          </Link>
        ))}
          </div>
        </section>
      </div>
    </main>
  );
}
