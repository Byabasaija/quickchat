'use client'

import React, { createContext, useContext, useState } from 'react'

type ChatContextType = {
  askQuestion: (query: string) => Promise<void>
  loading: boolean
  answer: string | null
  error: string | null
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  console.log(baseUrl)
  const askQuestion = async (query: string) => {
    setLoading(true)
    setError(null)


    try {
      const res = await fetch(`${baseUrl}/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!res.ok) throw new Error(`Error ${res.status}`)

      const data: { response: string } = await res.json()
      setAnswer(data.response)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ChatContext.Provider value={{ askQuestion, answer, loading, error }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChatContext must be used within ChatProvider')
  return context
}
