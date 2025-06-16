"use client";

import { useChatContext } from "./ChatContext";
import ChatWindow from "./ChatWindow";
import { MessageCircle } from "lucide-react";

export default function ChatWidget() {
  const { isOpen, toggleOpen } = useChatContext();

  return (
    <>
      {isOpen && <ChatWindow />}
      <button
        onClick={toggleOpen}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 hover:bg-blue-700 transition"
        aria-label="Ouvrir le chat"
      >
        <MessageCircle size={24} />
      </button>
    </>
  );
}
