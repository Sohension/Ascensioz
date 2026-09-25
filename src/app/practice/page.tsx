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
    <main className="page-shell px-4 pb-12 pt-8 text-[var(--color-text)] sm:px-6 sm:pt-10 lg:px-8 lg:pb-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 sm:mb-10">
          <BackButton href="/dashboard" label="Dashboard" />
        </div>

        <section className="glass-panel mb-8 flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:p-8">
          <div className="max-w-2xl">
            <p className={`${rajdhani.className} mb-2 text-sm font-bold text-[var(--color-primary)]`}>
              SKILL BUILDER
            </p>
            <h1 className={`${montserrat.className} text-4xl font-extrabold text-[var(--color-text)] sm:text-5xl`}>
              Practice <span className="text-[var(--color-primary)]">Arena</span>
            </h1>
            <p className={`${rajdhani.className} mt-3 max-w-xl text-lg leading-7 text-[var(--color-muted)] sm:text-xl`}>
              Pick a path, build momentum, and earn XP through focused coding challenges.
            </p>
          </div>

          <div className="mt-6 flex shrink-0 items-center gap-3 border-l-4 border-[var(--color-primary)] bg-[var(--color-surface-alt)] px-4 py-3 text-left sm:mt-0">
            <Trophy className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
            <div>
              <p className={`${rajdhani.className} text-sm font-bold text-[var(--color-text)]`}>Learn by doing</p>
              <p className={`${rajdhani.className} text-sm text-[var(--color-muted)]`}>Every challenge moves you forward.</p>
            </div>
          </div>
        </section>

        <section className="pt-2 sm:pt-4" aria-labelledby="course-paths">
          <div className="mb-5 flex items-center justify-between">
            <h2 id="course-paths" className={`${montserrat.className} text-xl font-bold text-[var(--color-text)] sm:text-2xl`}>
              Choose your path
            </h2>
            <span className={`${rajdhani.className} text-sm font-semibold text-[var(--color-muted)]`}>
              {courses.length} available
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/practice/${course.name.toLowerCase()}`}
                className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                <Card className="soft-card flex h-full flex-col cursor-pointer p-0 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]">
                  <CardHeader className="pb-4 px-5 pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        <Code2 className="h-5 w-5" aria-hidden="true" />
                      </div>

                      <span className={`${rajdhani.className} rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-bold tracking-wide text-[var(--color-primary)]`}>
                        BEGINNER
                      </span>
                    </div>

                    <CardTitle className={`${montserrat.className} mt-5 text-xl font-extrabold text-[var(--color-text)] transition-colors duration-300 group-hover:text-[var(--color-primary)] sm:text-2xl`}>
                      {course.name}
                    </CardTitle>

                    <CardDescription className={`${rajdhani.className} mt-2 text-base leading-6 text-[var(--color-muted)]`}>
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 px-5 pb-0 pt-1">
                    <div className="grid grid-cols-2 divide-x divide-[var(--color-border)] border-y border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                      <div className="p-3.5">
                        <div className="text-xl font-bold text-[var(--color-text)]">32</div>
                        <div className={`${rajdhani.className} mt-1 text-sm text-[var(--color-muted)]`}>Challenges</div>
                      </div>

                      <div className="p-3.5">
                        <div className="text-xl font-bold text-[var(--color-text)]">+250</div>
                        <div className={`${rajdhani.className} mt-1 text-sm text-[var(--color-muted)]`}>XP Reward</div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between px-5 pb-5 pt-5">
                    <span className={`${rajdhani.className} flex items-center gap-2 text-lg font-bold text-[var(--color-text)]`}>
                      <Target className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
                      Start practicing
                    </span>

                    <ArrowRight className="h-5 w-5 text-[var(--color-muted)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-primary)]" aria-hidden="true" />
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
