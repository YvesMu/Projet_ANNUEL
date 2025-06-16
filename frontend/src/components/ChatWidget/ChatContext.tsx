"use client";

import { createContext, useContext, useState } from "react";

interface Message {
  senderId: number;
  content: string;
}

interface ChatContextProps {
  isOpen: boolean;
  toggleChat: () => void;
  messages: Message[];
  sendMessage: (msg: string) => void;
  userId: number;
  hasUnread: boolean;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  const userId = 1; // à remplacer dynamiquement avec l'utilisateur connecté

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) setHasUnread(false);
  };

  const sendMessage = (msg: string) => {
    const newMsg = { senderId: userId, content: msg };
    setMessages((prev) => [...prev, newMsg]);

    // TODO: appel API ou socket ici
  };

  return (
    <ChatContext.Provider
      value={{ isOpen, toggleChat, messages, sendMessage, userId, hasUnread }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatContext must be used inside ChatProvider");
  return context;
}
