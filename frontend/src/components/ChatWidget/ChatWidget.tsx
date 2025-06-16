"use client";

import { useChatContext } from "./ChatContext";
import ChatWindow from "./ChatWindow";
import ChatButton from "./ChatButton";

export default function ChatWidget() {
  const { isOpen } = useChatContext();

  return (
    <>
      {isOpen && <ChatWindow />}
      <ChatButton />
    </>
  );
}
