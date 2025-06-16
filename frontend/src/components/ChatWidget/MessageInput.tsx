"use client";

import { useState } from "react";
import { useChatContext } from "./ChatContext";

export default function MessageInput() {
  const [text, setText] = useState("");
  const { sendMessage } = useChatContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        className="flex-1 border rounded px-2 py-1 text-sm"
        placeholder="Votre message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="text-blue-600 font-semibold text-sm">
        Envoyer
      </button>
    </form>
  );
}
