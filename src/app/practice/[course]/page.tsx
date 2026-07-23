import Link from "next/link";
import { getCourses } from "@/lib/courses";
import { getChallenges } from "@/lib/challenges";
import { pythonPracticeQuestions } from "@/lib/python-practice";
import { Montserrat, Rajdhani } from "next/font/google";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function difficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
    case "beginner":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";

    case "medium":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";

    case "hard":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

    default:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
  }
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: courseSlug } = await params;

  const courses = await getCourses();

  const course = courses.find((c) => c.name.toLowerCase() === courseSlug);

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-gray-900">
        <Card className="w-full max-w-md border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          <CardContent className="py-12 text-center">
            <h2
              className={`${montserrat.className} text-3xl font-bold text-black dark:text-white`}
            >
              Course Not Found
            </h2>

            <p className={`${rajdhani.className} mt-3 text-lg text-slate-600 dark:text-slate-300`}>
              The requested course doesnt exist.
            </p>

            <Link
              href="/practice"
              className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              ← Back to Practice
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const challenges =
    course.name.toLowerCase() === "python"
      ? pythonPracticeQuestions
      : await getChallenges(course.id);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4 pb-10 pt-8 sm:px-6 sm:pt-10 md:px-8 lg:px-10 lg:pb-14">
      {/* Header */}

      <div className="mx-auto mb-16 w-full max-w-7xl py-4 sm:mb-20 lg:mb-24">
        <Link
          href="/practice"
          className={`${rajdhani.className} inline-flex items-center text-lg font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300`}
        >
          ← Back to Practice
        </Link>

        <h1
          className={`${montserrat.className} mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-slate-900 dark:text-white`}
        >
          {course.name} <span className="text-blue-600 dark:text-blue-400">Challenges</span>
        </h1>

        <p
          className={`${rajdhani.className} mt-4 max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg md:text-xl`}
        >
          Complete coding missions, earn XP, and master {course.name}. Every
          solved challenge makes your Ascension stronger.
        </p>

        {/* Stats */}

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-md">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {challenges.length}
            </div>

            <div
              className={`${rajdhani.className} mt-1 text-sm text-slate-600 dark:text-slate-300`}
            >
              Challenges
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-md">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              +{challenges.reduce((total, challenge) => total + challenge.reward_xp, 0)}
            </div>

            <div
              className={`${rajdhani.className} mt-1 text-sm text-slate-600 dark:text-slate-300`}
            >
              Total XP
            </div>
          </div>

          <div className="hidden rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-md sm:block">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {course.name}
            </div>

            <div
              className={`${rajdhani.className} mt-1 text-sm text-slate-600 dark:text-slate-300`}
            >
              Course
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Cards */}

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
        {challenges.map((ch, index) => (
          <Link
            key={ch.id}
            href={`/practice/${courseSlug}/${ch.id}`}
            className="group h-full"
          >
            <Card
              className="
                flex
                h-full
                flex-col
                border
                border-slate-300
                dark:border-gray-700
                bg-linear-to-br
                from-white
                via-slate-50
                to-slate-100
                dark:from-gray-800
                dark:via-gray-800
                dark:to-gray-800
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-blue-400
                hover:shadow-2xl
              "
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900 text-2xl shadow-sm sm:h-16 sm:w-16 sm:text-3xl">
                    💻
                  </div>

                  <span
                    className={`${rajdhani.className} rounded-full px-3 py-1 text-xs font-bold tracking-wide ${difficultyColor(
                      ch.difficulty,
                    )}`}
                  >
                    {ch.difficulty.toUpperCase()}
                  </span>
                </div>

                <CardTitle
                  className={`${montserrat.className} mt-5 text-2xl font-extrabold text-black dark:text-white transition duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 sm:text-3xl`}
                >
                  {index + 1}. {ch.title}
                </CardTitle>

                <CardDescription
                  className={`${rajdhani.className} mt-2 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg`}
                >
                  {ch.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">+{ch.reward_xp}</div>

                    <div
                      className={`${rajdhani.className} mt-1 text-sm text-slate-600 dark:text-slate-300`}
                    >
                      XP Reward
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      🪙 {ch.reward_coins}
                    </div>

                    <div
                      className={`${rajdhani.className} mt-1 text-sm text-slate-600 dark:text-slate-300`}
                    >
                      Coins
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-4">
                <span
                  className={`${rajdhani.className} text-lg font-semibold text-black dark:text-white sm:text-xl`}
                >
                  Open Challenge
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

        {challenges.length === 0 && (
          <Card className="col-span-full border border-slate-300 dark:border-gray-700 bg-linear-to-br from-white via-slate-50 to-slate-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-5xl">
                🚀
              </div>

              <h2
                className={`${montserrat.className} text-3xl font-bold text-black dark:text-white`}
              >
                No Challenges Yet
              </h2>

              <p
                className={`${rajdhani.className} mt-4 max-w-lg text-lg text-slate-600 dark:text-slate-300`}
              >
                Challenges for this course havent been published yet. Check
                back soon as new missions are added regularly.
              </p>

              <Link
                href="/practice"
                className="mt-8 inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-lg"
              >
                ← Return to Practice
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}