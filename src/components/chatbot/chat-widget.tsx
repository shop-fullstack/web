"use client";

import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/chat-store";
import { ChatWindow } from "./chat-window";

export function ChatWidget() {
  const { isOpen, toggleOpen } = useChatStore();

  return (
    <>
      <AnimatePresence>
        {isOpen && <ChatWindow />}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "AI 채팅 닫기" : "AI 채팅 열기"}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-700 text-white shadow-lg transition-shadow hover:shadow-xl"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
