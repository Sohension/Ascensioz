"use client";

import { useState } from "react";
import { Rajdhani, Montserrat } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function DeleteProfileButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    await fetch("/api/profile", {
      method: "DELETE",
    });

    setLoading(false);
    window.location.reload();
  };

  return (
    <>
      {/* DELETE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className={`${rajdhani.className} bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded`}
      >
        Delete Profile
      </button>

      {/* POPUP MODAL */}
      {open && (
        <div className={`${rajdhani.className} fixed inset-0 bg-black/50 flex items-center justify-center`}>
          <div className="bg-white p-6 rounded-xl w-80">
            <h2 className={`${montserrat.className} text-xl font-bold text-black`}>Delete Profile?</h2>

            <p className="text-gray-600 mt-2">This action cannot be undone.</p>

            <div className="flex justify-end gap-3 mt-6">
              {/* CANCEL */}
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>

              {/* CONFIRM DELETE */}
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
