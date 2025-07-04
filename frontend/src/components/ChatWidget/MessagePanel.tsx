"use client";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function MessagePanel() {
  return (
    <div className="flex flex-col h-full">
      <MessageList />
      <MessageInput />
    </div>
  );
}
