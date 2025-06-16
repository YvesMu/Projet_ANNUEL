"use client";

import { useChatContext } from "./ChatContext";
import { MessageCircle } from "lucide-react";

export default function ChatButton() {
  const { toggleOpen, hasUnread } = useChatContext();

  return (
    <button
      onClick={toggleOpen}
      className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition relative z-50"
    >
      <MessageCircle size={24} />
      {hasUnread && (
        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-4 w-4 text-xs flex items-center justify-center">
          !
        </span>
      )}
    </button>
  );
}
