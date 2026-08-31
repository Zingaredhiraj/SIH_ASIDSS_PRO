'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Panel } from '../common/Panel'
import { ChatMessage } from '@/lib/types'
import { sendChatMessage } from '@/lib/api/ai'
import { Send, Bot, User } from 'lucide-react'
import { SuggestedQuestions } from './SuggestedQuestions'

export function ChatWindow({ stationId }: { stationId: string }) {
  const [history, setHistory] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: "I am the Polar AI Assistant. I can help you analyze telemetry, search SOPs, and provide operational recommendations based on real-time station data. How can I assist you today?",
    timestamp: new Date().toISOString()
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history, loading])

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date().toISOString() }
    setHistory(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    
    try {
      const res = await sendChatMessage(stationId, text, history)
      setHistory(prev => [...prev, res.data])
    } catch (err) {
      setHistory(prev => [...prev, { role: 'assistant', content: "Error: Failed to connect to AI service.", timestamp: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Panel className="h-full flex flex-col p-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-ice-600/20 text-ice-50 border border-ice-500/30' : 'bg-navy-800 border border-polar-border'}`}>
              <div className="flex items-center space-x-2 mb-1">
                {msg.role === 'user' ? <User className="w-4 h-4 text-ice-400" /> : <Bot className="w-4 h-4 text-ice-500" />}
                <span className="text-xs font-mono text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                {msg.source_type && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${msg.source_type === 'groq' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {msg.source_type.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-polar-border space-y-1">
                  <div className="text-[10px] text-gray-500 font-mono uppercase">Sources:</div>
                  {msg.sources.map((s, idx) => (
                    <div key={idx} className="text-xs text-gray-400 bg-navy-900 px-2 py-1 rounded truncate" title={s.chunk_text}>
                      [{s.score.toFixed(2)}] {s.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-navy-800 border border-polar-border rounded-lg p-3 flex space-x-1">
              <div className="w-2 h-2 bg-ice-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-ice-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-ice-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-polar-border bg-navy-900/50">
        <SuggestedQuestions onSelect={handleSend} />
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex space-x-2 mt-2">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about SOPs, current metrics, or recommendations..."
            className="flex-1 bg-navy-900 border border-polar-border rounded px-4 py-2 text-sm text-white focus:border-ice-500 focus:outline-none"
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-ice-600 hover:bg-ice-500 text-white p-2 rounded disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </Panel>
  )
}
