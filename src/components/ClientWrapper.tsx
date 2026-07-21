"use client";

import { useState } from "react";
import CodeEditor from "@/components/big-components/CodeEditor";
import { runPython } from "@/lib/runPython";
import { createClient } from "@/lib/client";

function normalize(str: string) {
  return (str || "").replace(/\r?\n/g, "\n").trim();
}

export default function EditorClient({
  challenge,
}: {
  challenge: {
    id: string;
    expected_output: string;
  };
}) {
  const supabase = createClient();

  const [code, setCode] = useState<string>("print('Hello World')");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setOutput("");

    const res = await runPython(code);
    const result = res?.run?.output || "";

    const isCorrect =
      normalize(result) === normalize(challenge.expected_output);

    setOutput(
      result + (isCorrect ? "\n\n✅ Correct Answer" : "\n\n❌ Wrong Answer"),
    );

    if (isCorrect) {
      await supabase.rpc("increment_stats", {
        uid: "test-user", // replace with auth later
        coin_inc: 100,
        xp_inc: 5,
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <CodeEditor onCodeChange={setCode} />

      <button
        onClick={handleRun}
        disabled={loading}
        className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded"
      >
        {loading ? "Running..." : "Run Code"}
      </button>

      <div className="bg-black text-green-400 p-3 rounded min-h-[120px] whitespace-pre-wrap">
        {output}
      </div>
    </div>
  );
}
