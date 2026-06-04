'use client';
import { useState } from 'react';
import { Bot, X, Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function FloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Handle message sending
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-4">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6" />
                <span className="font-semibold">AI Health Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-primary-700 rounded-full p-1 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-64 p-4 overflow-y-auto bg-gray-50">
            <div className="flex items-start gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-600" />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 max-w-[80%]">
                <p className="text-sm text-gray-900">Hello! I'm your AI pet health assistant. How can I help you today?</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about your pet's health..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Circular Button */}
      <Link href="/ai">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        >
          <Bot className="w-8 h-8" />
        </button>
      </Link>

      {/* Pulse Animation */}
      <div className="absolute inset-0 bg-primary-600 rounded-full animate-ping opacity-75"></div>
    </div>
  );
}
