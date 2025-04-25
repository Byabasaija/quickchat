'use client'

import React, { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Input } from "@/app/components/ui/input"
import { Send } from "lucide-react"
import { useChatContext } from "@/app/context/ChatContext"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export const Chat = () => {
  const [query, setQuery] = useState("")
  const [submitted, setSubmitted] = useState<string | null>(null)
  const { askQuestion, answer, loading } = useChatContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setSubmitted(query)
    setQuery("")
    await askQuestion(query)
  }

  return (
    <main className="flex-1 flex flex-col">
     <ScrollArea className="flex-1 p-6 overflow-y-auto">
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md text-center w-fit max-w-[80%]">
          How can I help you today?
        </div>
      </div>

      {submitted && (
        <div className="bg-blue-100 p-4 rounded-xl shadow-md self-end w-fit max-w-[80%] mb-4">
          {submitted}
        </div>
      )}

      {loading && (
        <div className="bg-white p-4 rounded-xl shadow-md w-fit max-w-[80%] italic text-gray-500 animate-pulse mb-4">
          Thinking...
        </div>
      )}

      {answer && !loading && (
        <div className="bg-white p-6 rounded-xl shadow-md w-fit max-w-[80%] mt-4">
          <div className="prose prose-sm prose-blue max-w-none space-y-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {answer}
            </ReactMarkdown>
          </div>
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
