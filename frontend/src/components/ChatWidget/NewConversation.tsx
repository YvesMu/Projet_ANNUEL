"use client";

import { useState } from "react";
import { useChatContext } from "./ChatContext";

export default function NewConversation() {
  const { users, startNewConversation } = useChatContext();
  const [showUserList, setShowUserList] = useState(false);

  const handleStartConversation = async (recipientId: number) => {
    await startNewConversation(recipientId);
    setShowUserList(false);
  };

  const getUserName = (user: { prenom: string; nom: string }) => {
    return `${user.prenom} ${user.nom}`;
  };

  return (
    <div className="border-b p-2">
      <button
        onClick={() => setShowUserList(!showUserList)}
        className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
      >
        {showUserList ? "Annuler" : "Nouvelle conversation"}
      </button>

      {showUserList && (
        <div className="mt-2 max-h-32 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-1">Choisir un utilisateur :</h3>
          <ul className="space-y-1">
            {users.map((user) => (
              <li key={user.id}>
                <button
                  onClick={() => handleStartConversation(user.id)}
                  className="w-full text-left p-1 text-xs hover:bg-gray-100 rounded"
                >
                  {getUserName(user)}{user.role ? ` (${user.role})` : ""}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
