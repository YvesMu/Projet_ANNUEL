"use client";

import { useChatContext } from "./ChatContext";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const { toggleOpen } = useChatContext();

  return (
    <>
      <ChatWindow />
      <button
        onClick={toggleOpen}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50"
      >
        💬
      </button>
    </>
  );
}
