"use client";

import { useChatContext } from "./ChatContext";

export default function MessageList() {
  const { messages } = useChatContext();

  return (
    <div className="flex-1 overflow-auto p-3">
      {messages.map((msg) => (
        <div key={msg.id} className="mb-2">
          <div className="text-sm text-gray-600">
            {new Date(msg.createdAt).toLocaleTimeString()}
          </div>
          <div className="bg-gray-100 rounded px-3 py-1">{msg.content}</div>
        </div>
      ))}
    </div>
  );
}
