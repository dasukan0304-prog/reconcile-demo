import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendFollowUpMessage } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await sendFollowUpMessage(messages.map(m => m.text), input);
      const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden mt-8 shadow-2xl">
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
          <span>💬</span> สอบถามเพิ่มเติมกับ GoldGuru AI
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            <p>สงสัยอะไรเพิ่มเติมเกี่ยวกับราคาทอง?</p>
            <p className="text-sm">พิมพ์คำถามด้านล่างได้เลย</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
            }`}>
              {msg.role === 'user' ? (
                 <p>{msg.text}</p>
              ) : (
                 <MarkdownRenderer content={msg.text} />
              )}
              <div className="text-[10px] opacity-50 mt-1 text-right">
                {msg.timestamp.toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="เช่น 'แนวโน้มสัปดาห์หน้าเป็นยังไง', 'ปัจจัยเสี่ยงมีอะไรบ้าง'"
            className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-slate-600 disabled:text-slate-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
          >
            <span>ส่ง</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
