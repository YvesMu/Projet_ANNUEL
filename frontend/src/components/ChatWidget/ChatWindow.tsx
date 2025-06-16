"use client";

import ConversationList from "./ConversationList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChatContext } from "./ChatContext";

export default function ChatWindow() {
  const { isOpen } = useChatContext();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 right-4 w-96 h-[500px] bg-white border shadow-lg rounded flex flex-col z-50">
      <ConversationList />
      <MessageList />
      <MessageInput />
    </div>
  );
}
