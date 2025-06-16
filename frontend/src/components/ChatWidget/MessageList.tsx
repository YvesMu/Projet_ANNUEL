"use client";

import { useChatContext } from "./ChatContext";

export default function MessageList() {
  const { messages } = useChatContext();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg) => (
        <div key={msg.id} className="text-sm">
          <p>
            <strong>{msg.senderId}</strong> : {msg.content}
          </p>
          <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  );
}
