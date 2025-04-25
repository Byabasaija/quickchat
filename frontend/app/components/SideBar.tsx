import React from "react";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";

const chats = [
  "Website Redesign",
  "AI Assistant",
  "Interview Prep",
  "Landing Page Feedback",
];

export const Sidebar = () => {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <Button className="w-full">+ New Chat</Button>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-1">
          {chats.map((chat, i) => (
            <li
              key={i}
              className="p-3 rounded-md hover:bg-gray-100 cursor-pointer text-sm"
            >
              {chat}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  );
};




