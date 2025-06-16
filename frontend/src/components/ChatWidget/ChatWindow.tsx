"use client";

import { useChatContext } from "./ChatContext";
import MessageList from "./MessageInput";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  const { isOpen } = useChatContext();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 bg-white shadow-xl rounded-lg flex flex-col z-50 border">
      <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-semibold">
        Messagerie
      </div>
      <div className="flex-1 overflow-y-auto p-2 h-64">
        <MessageList />
      </div>
      <div className="border-t p-2">
        <MessageInput />
      </div>
    </div>
  );
}
