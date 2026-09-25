import { getChallenge } from "@/lib/challenges";
import { notFound } from "next/navigation";
import SubmitButton from "@/components/challengeSubmit";
import BackButton from "@/components/big-components/BackBtn";
import { createClient } from "@/lib/server";


import { Montserrat, Rajdhani } from "next/font/google";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Props = {
  params: Promise<{
    course: string;
    id: string;
  }>;
};

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

export default async function ChallengePage({ params }: Props) {
  const { course, id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: completion } = await supabase
      .from("practice_completions")
      .select("question_id")
      .eq("user_id", user.id)
      .eq("question_id", id)
      .maybeSingle();

    if (completion) notFound();
  }

  const challenge = await getChallenge(id);

  if (!challenge) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4 pb-10 pt-8 sm:px-6 sm:pt-10 md:px-8 lg:px-10 lg:pb-14">
      {/* Header */}
      <BackButton href="/practice/python"/>

      <div className="mx-auto mb-16 w-full max-w-7xl py-4">
        <p
          className={`${rajdhani.className} text-lg font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400`}
        >
          {course}
        </p>

        <h1
          className={`${montserrat.className} mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-white`}
        >
          {challenge.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span
            className={`${rajdhani.className} rounded-full px-4 py-2 text-sm font-bold tracking-wide ${difficultyColor(
              challenge.difficulty,
            )}`}
          >
            {challenge.difficulty.toUpperCase()}
          </span>

          <span
            className={`${rajdhani.className} rounded-full bg-blue-100 dark:bg-blue-900 px-4 py-2 text-sm font-bold text-blue-700 dark:text-blue-300`}
          >
            Challenge #{challenge.id.slice(0, 4)}
          </span>
        </div>
      </div>

      {/* Description + Rewards */}

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Description */}

        <Card
          className="
            rounded-3xl
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
          "
        >
          <CardHeader>
            <CardTitle
              className={`${montserrat.className} text-3xl text-black dark:text-white`}
            >
              Description
            </CardTitle>

            <CardDescription className={`${rajdhani.className} text-lg text-slate-600 dark:text-slate-300`}>
              Read the challenge carefully before writing your solution.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p
              className={`${rajdhani.className} whitespace-pre-wrap text-lg leading-8 text-slate-700 dark:text-slate-300`}
            >
              {challenge.description}
            </p>
          </CardContent>
        </Card>

        {/* Rewards */}

        <Card
          className="
            rounded-3xl
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
          "
        >
          <CardHeader>
            <CardTitle className={`${montserrat.className} text-3xl text-black dark:text-white`}>
              Rewards
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ⚡ {challenge.reward_xp}
              </div>

              <div
                className={`${rajdhani.className} mt-2 text-sm text-slate-600 dark:text-slate-300`}
              >
                XP Reward
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                🪙 {challenge.reward_coins}
              </div>

              <div
                className={`${rajdhani.className} mt-2 text-sm text-slate-600 dark:text-slate-300`}
              >
                Coins
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
      {/* Code Editor */}

      <div className="mx-auto mt-10 max-w-7xl">
        <Card
          className="
            rounded-3xl
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
          "
        >
          <CardHeader>
            <CardTitle
              className={`${montserrat.className} text-3xl text-black dark:text-white`}
            >
              Code Editor
            </CardTitle>

            <CardDescription
              className={`${rajdhani.className} text-lg text-slate-600 dark:text-slate-300`}
            >
              Write your solution below and submit it to earn XP and Coins.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-950 p-5 shadow-inner">
              <SubmitButton challengeId={challenge.id} course={course} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}

      <div className="mx-auto mt-10 max-w-7xl">
        <Card
          className="
            rounded-3xl
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
          "
        >
          <CardHeader>
            <CardTitle
              className={`${montserrat.className} text-2xl text-black dark:text-white`}
            >
              Challenge Tips
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
                <div className="mb-2 text-3xl">📖</div>

                <h3 className={`${montserrat.className} text-lg font-bold text-black dark:text-white`}>
                  Read Carefully
                </h3>

                <p
                  className={`${rajdhani.className} mt-2 text-base leading-6 text-slate-600 dark:text-slate-300`}
                >
                  Understand every requirement before writing your first line of
                  code.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
                <div className="mb-2 text-3xl">🧠</div>

                <h3 className={`${montserrat.className} text-lg font-bold text-black dark:text-white`}>
                  Think First
                </h3>

                <p
                  className={`${rajdhani.className} mt-2 text-base leading-6 text-slate-600 dark:text-slate-300`}
                >
                  Plan your logic before coding. Strong reasoning leads to
                  better solutions.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
                <div className="mb-2 text-3xl">🚀</div>

                <h3 className={`${montserrat.className} text-lg font-bold text-black dark:text-white`}>
                  Keep Improving
                </h3>

                <p
                  className={`${rajdhani.className} mt-2 text-base leading-6 text-slate-600 dark:text-slate-300`}
                >
                  If your first solution isnt perfect, refine it. Every
                  iteration improves your programming skills.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}