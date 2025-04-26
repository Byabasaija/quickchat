'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Define types for our chat data structure
export type Message = {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

export type ChatSession = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

type ChatContextType = {
  chats: ChatSession[]
  currentChat: ChatSession | null
  setCurrentChat: (chat: ChatSession) => void
  createNewChat: () => void
  askQuestion: (query: string) => Promise<void>
  loading: boolean
  error: string | null
  deleteChat: (chatId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Helper function to generate a title from user message
const generateTitleFromMessage = (message: string): string => {
  // Remove markdown, code blocks, etc.
  const plainText = message.replace(/```[\s\S]*?```/g, '')
                           .replace(/`.*?`/g, '')
                           .replace(/\*\*(.*?)\*\*/g, '$1')
                           .replace(/\*(.*?)\*/g, '$1')
                           .trim();
  
  // If it's a question, use that directly
  if (plainText.endsWith('?')) {
    const questionParts = plainText.split('?')[0];
    return questionParts.length <= 30 
      ? `${questionParts}?` 
      : `${questionParts.substring(0, 27)}...?`;
  }
  
  // Otherwise use first sentence or part of it
  const firstSentenceMatch = plainText.match(/^[^.!?]+[.!?]/);
  if (firstSentenceMatch) {
    const firstSentence = firstSentenceMatch[0];
    return firstSentence.length <= 30 
      ? firstSentence 
      : `${firstSentence.substring(0, 27)}...`;
  }
  
  // Fall back to first few words
  return plainText.length <= 30 
    ? plainText 
    : `${plainText.substring(0, 27)}...`;
}

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<ChatSession[]>([])
  const [currentChat, setCurrentChatState] = useState<ChatSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  // Load chats from localStorage on initial render
  useEffect(() => {
    const savedChats = localStorage.getItem('chats')
    const parsedChats = savedChats ? JSON.parse(savedChats) as ChatSession[] : []
    
    if (parsedChats.length > 0) {
      setChats(parsedChats)
      
      // Set the last active chat if available
      const lastActiveChatId = localStorage.getItem('lastActiveChatId')
      if (lastActiveChatId) {
        const lastChat = parsedChats.find(chat => chat.id === lastActiveChatId)
        if (lastChat) {
          setCurrentChatState(lastChat)
        } else {
          setCurrentChatState(parsedChats[0])
        }
      } else {
        setCurrentChatState(parsedChats[0])
      }
    } else {
      // Only create a new default chat if there are no saved chats
      const newChat: ChatSession = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      setChats([newChat])
      setCurrentChatState(newChat)
      localStorage.setItem('chats', JSON.stringify([newChat]))
    }
  }, [])

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('chats', JSON.stringify(chats))
    }
  }, [chats])

  // Save the current active chat ID
  useEffect(() => {
    if (currentChat) {
      localStorage.setItem('lastActiveChatId', currentChat.id)
    }
  }, [currentChat])

  const setCurrentChat = (chat: ChatSession) => {
    setCurrentChatState(chat)
  }

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    
    setChats(prevChats => {
      const updatedChats = [newChat, ...prevChats];
      // Immediately update localStorage
      localStorage.setItem('chats', JSON.stringify(updatedChats));
      return updatedChats;
    })
    
    setCurrentChatState(newChat)
    return newChat
  }

  const deleteChat = (chatId: string) => {
    setChats(prevChats => {
      const updatedChats = prevChats.filter(chat => chat.id !== chatId)
      
      // If we're deleting the current chat, select another one or create a new one
      if (currentChat && currentChat.id === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChatState(updatedChats[0])
        } else {
          // Create a new chat if we deleted the last one
          const newChat = {
            id: Date.now().toString(),
            title: 'New Chat',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
          setCurrentChatState(newChat)
          // Immediately update localStorage
          localStorage.setItem('chats', JSON.stringify([newChat]));
          return [newChat]
        }
      }
      
      // Immediately update localStorage
      localStorage.setItem('chats', JSON.stringify(updatedChats));
      return updatedChats
    })
  }

  const updateChatTitle = (chatId: string, message: string) => {
    // Generate a better title based on the message
    const newTitle = generateTitleFromMessage(message);
    
    // First update the currentChat state for immediate UI feedback
    if (currentChat && currentChat.id === chatId) {
      const updatedCurrentChat = {
        ...currentChat,
        title: newTitle,
        updatedAt: Date.now()
      };
      setCurrentChatState(updatedCurrentChat);
    }
    
    // Then update the chats array and localStorage
    setChats(prevChats => {
      const updatedChats = prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: newTitle, updatedAt: Date.now() } 
          : chat
      );
      
      // Immediately update localStorage to ensure persistence
      localStorage.setItem('chats', JSON.stringify(updatedChats));
      
      return updatedChats;
    });
  }

  const askQuestion = async (query: string) => {
    setLoading(true)
    setError(null)

    // Make sure we have a current chat
    let activeChat = currentChat
    if (!activeChat) {
      // This should only happen if there's some error state
      // Create a new chat as a fallback
      activeChat = createNewChat()
    }

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: query,
      role: 'user',
      timestamp: Date.now()
    }

    // Check if this is the first message to update title
    const isFirstMessage = activeChat.messages.length === 0;
    
    // Add user message to current chat
    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, userMessage],
      updatedAt: Date.now()
    }

    // Update the title immediately if this is the first message
    if (isFirstMessage) {
      const newTitle = generateTitleFromMessage(query);
      updatedChat.title = newTitle;
    }

    // Update current chat with user message
    setCurrentChatState(updatedChat)
    
    // Update chats list and localStorage
    setChats(prevChats => {
      const updatedChats = prevChats.map(chat => 
        chat.id === updatedChat.id ? updatedChat : chat
      );
      
      // Immediately update localStorage
      localStorage.setItem('chats', JSON.stringify(updatedChats));
      
      return updatedChats;
    });

    try {
      const res = await fetch(`${baseUrl}/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!res.ok) throw new Error(`Error ${res.status}`)

      const data: { response: string } = await res.json()
      
      // Create assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: data.response,
        role: 'assistant',
        timestamp: Date.now()
      }

      // Add assistant message to current chat
      const chatWithResponse = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage],
        updatedAt: Date.now()
      }

      // Update current chat with assistant response
      setCurrentChatState(chatWithResponse)
      
      // Update chats list and localStorage
      setChats(prevChats => {
        const finalChats = prevChats.map(chat => 
          chat.id === chatWithResponse.id ? chatWithResponse : chat
        );
        
        // Immediately update localStorage
        localStorage.setItem('chats', JSON.stringify(finalChats));
        
        return finalChats;
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ChatContext.Provider value={{ 
      chats, 
      currentChat, 
      setCurrentChat, 
      createNewChat, 
      askQuestion, 
      loading, 
      error,
      deleteChat
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChatContext must be used within ChatProvider')
  return context
}