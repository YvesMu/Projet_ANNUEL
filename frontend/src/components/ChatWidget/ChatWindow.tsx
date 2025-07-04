"use client";

import { useChatContext } from "./ChatContext";
import ConversationList from "./ConversationList";
import NewConversation from "./NewConversation";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  const { isOpen } = useChatContext();

  return (
    <div
      className={`fixed bottom-20 right-4 w-[320px] h-[420px] bg-white border rounded-lg shadow-lg z-50 flex flex-col overflow-hidden transition-all duration-300 ${
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="flex flex-row h-full">
        <div className="w-1/2 border-r overflow-y-auto">
          <NewConversation />
          <ConversationList />
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <MessageList />
          </div>
          <MessageInput />
        </div>
      </div>
    </div>
  );
}
