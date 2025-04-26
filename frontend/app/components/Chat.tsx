'use client'

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Input } from "@/app/components/ui/input"
import { Send } from "lucide-react"
import { useChatContext } from "@/app/context/ChatContext"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export const Chat = () => {
  const [query, setQuery] = useState("")
  const { askQuestion, currentChat, loading } = useChatContext()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [currentChat?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const currentQuery = query
    setQuery("")
    await askQuestion(currentQuery)
  }

  return (
    <main className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 p-6 overflow-y-auto" ref={scrollAreaRef}>
        {!currentChat || currentChat.messages.length === 0 ? (
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-xl shadow-md text-center w-fit max-w-[80%]">
              <h1 className="text-xl font-bold mb-2">How can I help you today?</h1>
              <p className="text-sm italic text-gray-600">I will help you with rewritting any sentences in a formal and grammatically formart and professional tone.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {currentChat.messages.map((message) => (
              <div
                key={message.id}
                className={`${
                  message.role === 'user' 
                    ? 'bg-blue-100 ml-auto' 
                    : 'bg-white'
                } p-4 rounded-xl shadow-md w-fit max-w-[80%] ${
                  message.role === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm prose-blue max-w-none space-y-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            ))}
            
            {loading && (
              <div className="bg-white p-4 rounded-xl shadow-md w-fit max-w-[80%] italic text-gray-500 animate-pulse mb-4">
                Thinking...
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
            placeholder="Send a message..."
            type="text"
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading || !query.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </main>
  )
}