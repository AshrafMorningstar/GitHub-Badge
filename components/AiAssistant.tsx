import React, { useState, useRef, useEffect } from 'react';
import { streamBadgeAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Sparkles, Send, Bot, User, BrainCircuit, Zap } from 'lucide-react';

const AiAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm your Badge Advisor. Ask me how to earn a specific badge or how to improve your GitHub profile!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [useDeepThinking, setUseDeepThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    // Add placeholder for model message
    setMessages(prev => [...prev, { role: 'model', text: '', isThinking: useDeepThinking }]);

    await streamBadgeAdvice(userMsg, useDeepThinking, (chunkText) => {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        // For streaming, we append the full text as it comes or just update the last message
        // Since the service might return accumulated text or chunks, let's assume chunks for smoother update
        // But the simplified service wrapper might accumulate. Let's strictly replace text for simplicity if service sends full.
        // Actually, let's assume the service accumulates for us or we just append.
        // To be safe with the provided service pattern (which iterates stream), let's assume we are building it up.
        // For this implementation, let's just replace the text with the accumulated text if the service manages it, 
        // OR append if it sends chunks.
        // Let's modify the service to be simple: the component handles accumulation.
        
        // Wait, the service provided sends chunks.
        // So we append.
        if (lastMsg.role === 'model') {
            // Check if we are still "thinking" (if we want to simulate thinking UI state removal)
            // But for now just append text.
            return [
                ...newMessages.slice(0, -1),
                { ...lastMsg, text: lastMsg.text + chunkText, isThinking: false }
            ];
        }
        return newMessages;
      });
    });

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-white">Badge Advisor AI</h3>
            <p className="text-xs text-slate-400">Powered by Gemini 2.5 & 3.0</p>
          </div>
        </div>
        
        <button
            onClick={() => setUseDeepThinking(!useDeepThinking)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                useDeepThinking 
                ? 'bg-purple-900/30 border-purple-500/50 text-purple-300' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
            title="Toggle Deep Thinking Mode"
        >
            {useDeepThinking ? <BrainCircuit size={14} /> : <Zap size={14} />}
            {useDeepThinking ? 'Deep Think (Gemini 3 Pro)' : 'Fast Mode (Gemini 2.5)'}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-green-700 text-white'}
            `}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`
              max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
              ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-sm' 
                : 'bg-[#21262d] text-slate-200 border border-[#30363d] rounded-tl-sm'}
            `}>
              {msg.isThinking ? (
                 <span className="flex items-center gap-2 animate-pulse text-purple-300">
                    <BrainCircuit size={14} />
                    Analyzing your request with deep reasoning...
                 </span>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#161b22] border-t border-[#30363d]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about badges (e.g., 'How do I get Pull Shark?')"
            disabled={isLoading}
            className="w-full bg-[#0d1117] border border-[#30363d] text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center">
            AI can make mistakes. Verify badge requirements with official docs.
        </p>
      </div>
    </div>
  );
};

export default AiAssistant;