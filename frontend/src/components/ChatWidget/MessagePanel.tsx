"use client";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function MessagePanel() {
  return (
    <div className="flex flex-col flex-1 justify-between p-4 h-full">
      <div className="flex-1 overflow-y-auto mb-4">
        <MessageList />
      </div>
      <MessageInput />
    </div>
  );
}
