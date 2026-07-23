"use client";

import { useState } from "react";
import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function SubmitButton({ challengeId }: { challengeId: string }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Submit Solution");

  const submit = async () => {
    if (!code.trim()) {
      setButtonText("⚠️ Write some code");

      setTimeout(() => {
        setButtonText("Submit Solution");
      }, 1500);

      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/practice/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId,
          code,
        }),
      });

      const data = await res.json();

      if (data.correct) {
        setButtonText("✅ Correct!");

        // NEXT:
        // Call your reward API here

        setTimeout(() => {
          setButtonText("Submit Solution");
        }, 1500);
      } else {
        setButtonText("❌ Incorrect!");

        setTimeout(() => {
          setButtonText("Submit Solution");
        }, 1500);
      }
    } catch (err) {
      console.error(err);

      setButtonText("⚠️ Error");

      setTimeout(() => {
        setButtonText("Submit Solution");
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <div className={`${rajdhani.className} space-y-4`}>
      <textarea
        value={code}
        className="w-full min-h-[300px] rounded-lg border border-slate-600 bg-slate-900 text-green-400 p-4 font-mono text-base leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="// Write your solution here..."
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : buttonText}
      </button>
    </div>
  );
}
