"use client";

import { useChatContext } from "./ChatContext";

export default function ConversationList() {
  const {
    conversations,
    selectConversation,
    selectedConversationId,
    users,
  } = useChatContext();

  const getUserName = (conv: { senderId: number; recipientId: number }) => {
    const userId = localStorage.getItem("token")
      ? JSON.parse(atob(localStorage.getItem("token")!.split(".")[1])).id
      : null;
    const partnerId = conv.senderId === userId ? conv.recipientId : conv.senderId;
    const partner = users.find((u) => u.id === partnerId);
    return partner ? `${partner.prenom} ${partner.nom}` : "Utilisateur inconnu";
  };

  return (
    <div className="border-b p-2">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className={`p-2 cursor-pointer rounded ${
            selectedConversationId === conv.id ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
          onClick={() => selectConversation(conv.id)}
        >
          {getUserName(conv)}
        </div>
      ))}
    </div>
  );
}
