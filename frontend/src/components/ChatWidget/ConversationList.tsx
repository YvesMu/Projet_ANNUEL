"use client";

import { useChatContext } from "./ChatContext";

export default function ConversationList() {
  const {
    conversations,
    users,
    selectConversation,
    selectedConversationId,
  } = useChatContext();

  const getUsername = (conv: { senderId: number; recipientId: number }) => {
    const currentUserId = typeof window !== "undefined"
      ? JSON.parse(atob(localStorage.getItem("token")!.split(".")[1])).id
      : null;

    const otherUserId = conv.senderId === currentUserId ? conv.recipientId : conv.senderId;
    const user = users.find((u) => u.id === otherUserId);
    return user ? `${user.prenom} ${user.nom}` : `Utilisateur #${otherUserId}`;
  };

  return (
    <div className="border-b max-h-48 overflow-auto">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => selectConversation(conv.id)}
          className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
            conv.id === selectedConversationId ? "bg-gray-200 font-semibold" : ""
          }`}
        >
          {getUsername(conv)}
        </button>
      ))}
    </div>
  );
}
