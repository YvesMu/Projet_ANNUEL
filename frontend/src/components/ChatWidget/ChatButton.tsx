"use client";

import { useChatContext } from "./ChatContext";
import { MessageCircle } from "lucide-react";

export default function ChatButton() {
  const { toggleOpen, hasUnread } = useChatContext();

  return (
    <button
      onClick={toggleOpen}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 z-50 transform hover:scale-110 group"
    >
      <div className="relative">
        <MessageCircle size={28} className="group-hover:rotate-12 transition-transform duration-300" />
        {hasUnread && (
          <span className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full h-6 w-6 text-xs font-bold flex items-center justify-center animate-pulse shadow-lg border-2 border-white">
            !
          </span>
        )}
      </div>
      
      {/* Effet de halo */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-ping"></div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl">
          💬 Ouvrir le chat
          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      </div>
    </button>
  );
}
