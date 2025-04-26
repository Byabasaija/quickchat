"use client";
import { Suspense, useState } from "react"
import { Sidebar } from "./components/SideBar";
import { Chat } from "./components/Chat";
import { Menu } from "lucide-react";
import { Button } from "./components/ui/button";

function MainPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <main>
      <div className="flex h-screen bg-gray-100 text-gray-900 relative">
        {/* Mobile menu button */}
        <div className="md:hidden absolute top-4 left-4 z-20">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Overlay to close sidebar when clicking outside on mobile */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/30 z-10"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        
        {/* Sidebar with responsive behavior */}
        <div
          className={`
            fixed md:static inset-y-0 left-0 z-20 transform 
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 transition-transform duration-200 ease-in-out
            w-72 bg-white border-r border-gray-200 flex flex-col
          `}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
        
        {/* Main content area that takes remaining space */}
        <div className="flex-1 w-full md:pl-0 pl-0">
          <Chat onMenuClick={toggleSidebar} />
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return <Suspense><MainPage /></Suspense>
}