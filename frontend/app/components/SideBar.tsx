'use client'

import React from "react";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { MessageSquarePlus, Trash2 } from "lucide-react";
import { useChatContext, ChatSession } from "@/app/context/ChatContext";
import { formatDistanceToNow } from "date-fns";

export const Sidebar = () => {
  const { chats, createNewChat, currentChat, setCurrentChat, deleteChat } = useChatContext();

  const handleNewChat = () => {
    createNewChat();
  };

  const handleChatSelect = (chat: ChatSession) => {
    setCurrentChat(chat);
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat?")) {
      deleteChat(chatId);
    }
  };

  const formatDate = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return "recently";
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <Button 
          className="w-full flex items-center justify-center gap-2" 
          onClick={handleNewChat}
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            No chats yet. Start a new conversation!
          </div>
        ) : (
          <ul className="p-2 space-y-1">
            {chats.map((chat) => (
              <li
                key={chat.id}
                className={`p-3 rounded-md hover:bg-gray-100 cursor-pointer text-sm relative group ${
                  currentChat && currentChat.id === chat.id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="flex flex-col">
                  <div className="font-medium truncate">{chat.title}</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(chat.updatedAt)}
                  </div>
                </div>
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  aria-label="Delete chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </aside>
  );
};