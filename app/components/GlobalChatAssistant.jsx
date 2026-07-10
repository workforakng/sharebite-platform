"use client";

import { useState, useRef, useEffect } from "react";

export default function GlobalChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm the ShareBite AI Assistant. How can I help you rescue food today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.error || "An error occurred." }]);
      } else {
        // AI returns { answer: "..." } based on our soul instruction
        const answer = data.answer || data.response || JSON.stringify(data);
        setMessages(prev => [...prev, { role: "assistant", content: answer }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Failed to connect to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-[#4a6741] text-white p-4 rounded-full shadow-xl hover:bg-[#3d5535] transition-transform transform hover:scale-110 z-50 flex items-center justify-center"
        aria-label="Open AI Chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-200" style={{ height: '500px', maxHeight: '80vh' }}>
          {/* Header */}
          <div className="bg-[#4a6741] p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold">ShareBite AI</h3>
              <p className="text-xs opacity-80">Ask me about food rescue!</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-[#4a6741] text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-grow p-2 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-[#4a6741] focus:border-transparent rounded-lg text-sm transition text-gray-900"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-[#4a6741] text-white p-2 rounded-lg hover:bg-[#3d5535] transition disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
