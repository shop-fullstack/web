"use client";

import { useState, useRef, useEffect } from "react";
import { X, Sparkles, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useChatStore } from "@/store/chat-store";
import { generateChatResponse } from "@/lib/mock/chatbot";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";
import type { ChatMessage as ChatMessageType } from "@/types";

const QUICK_STARTS = ["인기 상품 추천", "주문 현황 확인", "트렌드 분석", "상품 검색"];

export function ChatWindow() {
  const { messages, isTyping, addMessage, setTyping, toggleOpen } = useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setInput("");

    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setTyping(true);

    const response = await generateChatResponse(text.trim());
    setTyping(false);
    addMessage(response);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
      className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-4 z-50 flex w-full h-full sm:w-[380px] sm:h-[520px] flex-col overflow-hidden sm:rounded-2xl bg-gray-50 shadow-lg border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-primary-700 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-white/80" />
          <span className="text-sm font-semibold text-white">BizMart AI 어시스턴트</span>
        </div>
        <button
          onClick={toggleOpen}
          aria-label="채팅 닫기"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
              <Sparkles size={24} className="text-primary-700" />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-900">무엇을 도와드릴까요?</p>
            <p className="mt-1 text-xs text-gray-400 text-center">상품 추천, 주문 확인, 트렌드 등을 물어보세요</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {QUICK_STARTS.map((qs) => (
                <button
                  key={qs}
                  onClick={() => sendMessage(qs)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-primary-200 hover:text-primary-700 transition-colors"
                >
                  {qs}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 bg-white p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          aria-label="메시지 입력"
          className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-white shadow-sm disabled:opacity-40 hover:shadow-md transition-all"
        >
          <Send size={16} />
        </button>
      </form>
    </motion.div>
  );
}
