"use client";

import { useChatContext } from "./ChatContext";

export default function MessageList() {
  const { messages } = useChatContext();

  const userId =
    typeof window !== "undefined" && localStorage.getItem("token")
      ? JSON.parse(atob(localStorage.getItem("token")!.split(".")[1])).id
      : null;

  return (
    <div className="flex flex-col gap-2 p-2 overflow-y-auto h-64">
      {messages.map((msg) => {
        const isMe = msg.senderId === userId;
        return (
          <div
            key={msg.id}
            className={`p-2 rounded max-w-xs ${
              isMe
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.content}
          </div>
        );
      })}
    </div>
  );
}
