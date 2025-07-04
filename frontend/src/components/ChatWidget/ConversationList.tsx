"use client";

import { useChatContext } from "./ChatContext";

export default function ConversationList() {
  const {
    conversations,
    users,
    selectedConversationId,
    selectConversation,
  } = useChatContext();

  const getUserName = (id: number) => {
    const user = users.find((u) => u.id === id);
    return user ? `${user.prenom} ${user.nom}` : `Utilisateur #${id}`;
  };

  return (
    <div className="w-full border-b p-2">
      <h2 className="text-lg font-semibold mb-2">Conversations</h2>
      <ul className="space-y-1 max-h-48 overflow-y-auto">
        {conversations.map((conv) => {
          const otherUserId =
            typeof window !== "undefined" && localStorage.getItem("token")
              ? [conv.senderId, conv.recipientId].find(
                  (id) =>
                    id !==
                    JSON.parse(
                      atob(localStorage.getItem("token")!.split(".")[1])
                    ).id
                )
              : null;

          return (
            <li
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={`p-2 rounded cursor-pointer ${
                conv.id === selectedConversationId
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {otherUserId ? getUserName(otherUserId) : "Conversation"}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
