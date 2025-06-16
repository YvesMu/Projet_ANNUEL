"use client";

import { useChatContext } from "./ChatContext";

export default function MessageList() {
  const { messages, userId } = useChatContext();

  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`p-2 rounded-lg max-w-[75%] text-sm ${
            msg.senderId === userId
              ? "bg-blue-100 self-end"
              : "bg-gray-200 self-start"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}
