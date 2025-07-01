"use client";

import { useState } from "react";
import { useChatContext } from "./ChatContext";

export default function MessageInput() {
  const { sendMessage } = useChatContext();
  const [text, setText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSend} className="flex p-2 border-t">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded p-2 mr-2"
        placeholder="Votre message..."
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Envoyer
      </button>
    </form>
  );
}
