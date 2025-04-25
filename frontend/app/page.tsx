"use client";
import { Suspense } from "react"
import { Sidebar } from "./components/SideBar";
import { Chat } from "./components/Chat";

function MainPage() {

  return (
    <main>
      
      <div className="flex h-screen bg-gray-100 text-gray-900">
        <Sidebar />
        <Chat />
      </div>
  
    </main>
  );
}

export default function Page() {
  return <Suspense><MainPage /></Suspense>
}

