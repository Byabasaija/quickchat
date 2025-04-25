import "./assets/css/main.css";
import type { Metadata } from "next";
import { ChatProvider } from "./context/ChatContext";

export const metadata: Metadata = {
  title: "FastAPI/React starter stack",
  description: "Accelerate your next web development project",
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
