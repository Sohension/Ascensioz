"use client";

import { useState } from "react";

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
    <div>
      <textarea
        value={code}
        className="w-full min-h-75 border rounded p-3 font-mono"
        placeholder="// Write your solution here..."
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="mt-4 px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-60"
      >
        {loading ? "Submitting..." : buttonText}
      </button>
    </div>
  );
}
