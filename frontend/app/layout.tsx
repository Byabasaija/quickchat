import "./assets/css/main.css";
import type { Metadata } from "next";
import { ChatProvider } from "./context/ChatContext";

export const metadata: Metadata = {
  title: "Quickchat - Your AI Writing Assistant",
  description: "Transforms casual sentences into professional, polished language using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body>
          <ChatProvider>
            {children}
          </ChatProvider>
          
        </body>
      </html>
  );
}
