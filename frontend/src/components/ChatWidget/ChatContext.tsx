"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  conversationId: number;
}

export interface Conversation {
  id: number;
  senderId: number;
  recipientId: number;
  sender?: { id: number; nom: string; prenom: string };
  recipient?: { id: number; nom: string; prenom: string };
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  role?: string;
}

export interface ChatContextProps {
  isOpen: boolean;
  toggleOpen: () => void;
  hasUnread: boolean;
  messages: Message[];
  sendMessage: (content: string) => void;
  selectedConversationId: number | null;
  selectConversation: (id: number) => void;
  conversations: Conversation[];
  users: User[];
  startNewConversation: (recipientId: number) => Promise<void>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) setHasUnread(false);
  };

  const selectConversation = useCallback(async (id: number) => {
    setSelectedConversationId(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Erreur chargement messages:", error);
    }
  }, [token]);

  const sendMessage = async (content: string) => {
    if (!selectedConversationId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/send/${selectedConversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      await res.json();
      await selectConversation(selectedConversationId); // 🔄 recharge les messages après envoi
    } catch (err) {
      console.error("Erreur envoi message :", err);
    }
  };

  const fetchConversations = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      console.error("Erreur chargement conversations:", error);
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
    }
  }, [token]);

  const startNewConversation = useCallback(async (recipientId: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientId }),
      });

      const newConversation = await res.json();
      await fetchConversations(); // Recharge les conversations
      setSelectedConversationId(newConversation.id); // Sélectionne la nouvelle conversation
    } catch (error) {
      console.error("Erreur création conversation:", error);
    }
  }, [token, fetchConversations]);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
      fetchUsers();
    }
  }, [isOpen, fetchConversations, fetchUsers]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedConversationId && isOpen) {
        selectConversation(selectedConversationId);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedConversationId, isOpen, selectConversation]);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        toggleOpen,
        hasUnread,
        messages,
        sendMessage,
        selectedConversationId,
        selectConversation,
        conversations,
        users,
        startNewConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used inside ChatProvider");
  }
  return context;
}
