"use client";

import { useChatContext } from "./ChatContext";
import ConversationList from "./ConversationList";
import NewConversation from "./NewConversation";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  const { isOpen } = useChatContext();

  return (
    <div
      className={`fixed bottom-24 right-6 w-[380px] h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 backdrop-blur-lg ${
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg">💬</span>
          </div>
          <h2 className="font-semibold text-lg">Messages</h2>
        </div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>

      {/* Corps principal avec design amélioré */}
      <div className="flex flex-row h-full bg-gradient-to-br from-gray-50 to-white">
        {/* Panel gauche - Conversations */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto bg-white/80 backdrop-blur-sm">
          <NewConversation />
          <ConversationList />
        </div>
        
        {/* Panel droit - Messages */}
        <div className="w-1/2 flex flex-col bg-gradient-to-b from-white to-gray-50">
          {/* Zone des messages avec fond subtil */}
          <div className="flex-1 overflow-y-auto bg-white/50 backdrop-blur-sm">
            <MessageList />
          </div>
          
          {/* Zone de saisie avec séparateur élégant */}
          <div className="border-t border-gray-100 bg-white/90 backdrop-blur-sm">
            <MessageInput />
          </div>
        </div>
      </div>
      
      {/* Effet de glow subtil en bordure */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/10 to-indigo-400/10 pointer-events-none"></div>
    </div>
  );
}
