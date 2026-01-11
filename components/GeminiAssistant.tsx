import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import { askGeminiAssistant } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const GeminiAssistant = () => {
  const { inventory, events, bookings } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Привет! Я AI-помощник NewVisionHub. Чем могу помочь? Подсказать технику для съемки или найти свободное окно?' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    // Prepare context from REAL app state
    const context = `
      АКТУАЛЬНЫЕ ДАННЫЕ СТУДИИ:
      Инвентарь: ${inventory.map(i => `${i.name} (Статус: ${i.status}, Локация: ${i.location})`).join(', ')}.
      Бронирования: ${bookings.map(b => `${b.resourceName} забронировано с ${b.startTime} до ${b.endTime}`).join('; ')}.
      Ближайшие события: ${events.map(e => `${e.title} в ${e.date} (Локация: ${e.location})`).join(', ')}.
    `;

    const response = await askGeminiAssistant(userMessage, context);
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl text-white transition-all transform hover:scale-110 z-50 ${isOpen ? 'hidden' : 'flex bg-gradient-to-r from-orange-500 to-red-500'}`}
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-orange-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-semibold">AI Помощник</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-orange-600 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-orange-500 text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                  }`}
                >
                   {msg.role === 'user' ? (
                     <p>{msg.text}</p>
                   ) : (
                     <div className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                       <ReactMarkdown>{msg.text}</ReactMarkdown>
                     </div>
                   )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-200 text-slate-500 p-3 rounded-2xl rounded-bl-none text-xs animate-pulse">
                  Думаю...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Спроси что-нибудь..."
              className="flex-1 px-4 py-2 rounded-full bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;