"use client";

import { useState, useEffect } from "react";

type Props = {
  open: boolean;
};

export default function CreateProfileModal({ open }: Props) {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(open);

  // 🔥 keep visible synced with parent prop
  useEffect(() => {
    setVisible(open);
  }, [open]);

  const handleSave = async () => {
    if (!username.trim()) return alert("Username required");

    setLoading(true);

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        description,
      }),
    });

    setLoading(false);

    if (res.ok) {
      // reset fields
      setUsername("");
      setDescription("");

      // close modal
      setVisible(false);

      // refresh UI so dashboard picks up new profile
      window.location.reload();
    } else {
      const text = await res.text();
      alert(text);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create your profile</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
