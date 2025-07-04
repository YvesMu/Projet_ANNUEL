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
    <div className="border-b border-gray-100 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
      <button
        onClick={() => setShowUserList(!showUserList)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <span className="text-lg">{showUserList ? "❌" : "✉️"}</span>
        {showUserList ? "Annuler" : "Nouvelle conversation"}
      </button>

      {showUserList && (
        <div className="mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-300">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-base">👥</span>
              Choisir un utilisateur
            </h3>
          </div>
          <div className="max-h-40 overflow-y-auto">
            <ul className="divide-y divide-gray-100">
              {users.map((user, index) => (
                <li key={user.id} className="transition-colors duration-200 hover:bg-blue-50">
                  <button
                    onClick={() => handleStartConversation(user.id)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-xs group-hover:scale-110 transition-transform duration-300">
                      {user.prenom.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                        {getUserName(user)}
                      </div>
                      {user.role && (
                        <div className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                          {user.role}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300 transform group-hover:translate-x-1">
                      →
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
