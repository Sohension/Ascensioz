"use client";

import { sendFriendRequest } from "@/lib/friendaction";
import { useTransition } from "react";

export default function AddFriendButton({
  receiverId,
}: {
  receiverId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await sendFriendRequest(receiverId);
        })
      }
    >
      {pending ? "Sending..." : "Add Friend"}
    </button>
  );
}
